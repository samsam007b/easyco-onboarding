/**
 * Finances Service
 * Aggregates financial data for the Owner Finances Hub
 * Combines: Rent payments, Property finances, Alerts
 */

import { createClient } from '@/lib/auth/supabase-client';
import { differenceInDays, startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

// Types
export interface FinancesKPIs {
  monthlyRevenue: number;
  pendingPayments: number;
  overdueAmount: number;
  collectionRate: number;
  occupationRate: number;
  avgRentPerProperty: number;
}

export interface MonthlyTrendData {
  month: string;
  monthLabel: string;
  collected: number;
  expected: number;
  pending: number;
  overdue: number;
}

export type FinanceAlertType = 'overdue' | 'upcoming_due' | 'collection_low' | 'vacant_property';

export interface FinanceAlert {
  id: string;
  type: FinanceAlertType;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  amount?: number;
  propertyId?: string;
  propertyTitle?: string;
  href: string;
  createdAt: string;
}

export interface PaymentSummary {
  paid: number;
  pending: number;
  overdue: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
}

export interface FinancesOverview {
  kpis: FinancesKPIs;
  paymentSummary: PaymentSummary;
  trend: MonthlyTrendData[];
  alerts: FinanceAlert[];
  lastUpdated: string;
}

export interface RentPaymentRecord {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantName: string;
  tenantId: string;
  amount: number;
  dueDate: Date;
  paidAt?: Date;
  status: 'paid' | 'pending' | 'overdue';
  month: string;
}

class FinancesService {
  private supabase = createClient();

  /**
   * Get comprehensive finances overview for Hub
   */
  async getFinancesOverview(userId: string): Promise<FinancesOverview> {
    try {
      // Fetch properties
      const { data: properties } = await this.supabase
        .from('properties')
        .select('id, title, status, monthly_rent')
        .eq('owner_id', userId);

      if (!properties || properties.length === 0) {
        return this.getEmptyOverview();
      }

      const propertyIds = properties.map(p => p.id);

      // Fetch rent payments
      const { data: payments } = await this.supabase
        .from('rent_payments')
        .select('*')
        .in('property_id', propertyIds)
        .order('due_date', { ascending: false });

      // Fetch active residents
      const { data: residents } = await this.supabase
        .from('property_residents')
        .select('property_id')
        .in('property_id', propertyIds)
        .eq('is_active', true);

      // Calculate data in parallel
      const [kpis, paymentSummary, trend, alerts] = await Promise.all([
        this.calculateKPIs(properties, payments || [], residents || []),
        this.calculatePaymentSummary(payments || []),
        this.calculateMonthlyTrend(payments || [], properties, 6),
        this.generateAlerts(properties, payments || [], residents || []),
      ]);

      return {
        kpis,
        paymentSummary,
        trend,
        alerts,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('[Finances] Error fetching overview:', error);
      return this.getEmptyOverview();
    }
  }

  /**
   * Calculate KPIs
   */
  private async calculateKPIs(
    properties: any[],
    payments: any[],
    residents: any[]
  ): Promise<FinancesKPIs> {
    // Current month expected revenue
    const rentedPropertyIds = new Set(residents.map(r => r.property_id));
    const rentedProperties = properties.filter(p => rentedPropertyIds.has(p.id));
    const monthlyRevenue = rentedProperties.reduce((sum, p) => sum + (p.monthly_rent || 0), 0);

    // Current month payments
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const currentMonthKey = format(now, 'yyyy-MM');

    const currentMonthPayments = payments.filter(p => p.month.startsWith(currentMonthKey));

    const pendingPayments = currentMonthPayments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const overdueAmount = payments
      .filter(p => p.status === 'overdue')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    // Collection rate (last 3 months)
    const threeMonthsAgo = subMonths(now, 3);
    const recentPayments = payments.filter(p => new Date(p.due_date) >= threeMonthsAgo);
    const totalCollected = recentPayments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const totalDue = recentPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const collectionRate = totalDue > 0 ? Math.round((totalCollected / totalDue) * 100) : 100;

    // Occupation rate
    const publishedProperties = properties.filter(p => p.status === 'published' || p.status === 'rented');
    const occupationRate = publishedProperties.length > 0
      ? Math.round((rentedPropertyIds.size / publishedProperties.length) * 100)
      : 0;

    // Avg rent
    const avgRentPerProperty = rentedProperties.length > 0
      ? Math.round(monthlyRevenue / rentedProperties.length)
      : 0;

    return {
      monthlyRevenue,
      pendingPayments,
      overdueAmount,
      collectionRate,
      occupationRate,
      avgRentPerProperty,
    };
  }

  /**
   * Calculate payment summary
   */
  private async calculatePaymentSummary(payments: any[]): Promise<PaymentSummary> {
    const now = new Date();
    const currentMonthKey = format(now, 'yyyy-MM');
    const currentMonthPayments = payments.filter(p => p.month.startsWith(currentMonthKey));

    const paid = currentMonthPayments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const pending = currentMonthPayments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const overdue = payments
      .filter(p => p.status === 'overdue')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    return {
      paid,
      pending,
      overdue,
      paidCount: currentMonthPayments.filter(p => p.status === 'paid').length,
      pendingCount: currentMonthPayments.filter(p => p.status === 'pending').length,
      overdueCount: payments.filter(p => p.status === 'overdue').length,
    };
  }

  /**
   * Calculate monthly trend data
   */
  private async calculateMonthlyTrend(
    payments: any[],
    properties: any[],
    months: number
  ): Promise<MonthlyTrendData[]> {
    const trend: MonthlyTrendData[] = [];
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const now = new Date();

    // Expected monthly revenue (sum of all rented properties)
    const expectedMonthly = properties
      .filter(p => p.status === 'rented' || p.status === 'published')
      .reduce((sum, p) => sum + (p.monthly_rent || 0), 0);

    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(now, i);
      const monthKey = format(date, 'yyyy-MM');
      const monthLabel = monthNames[date.getMonth()];

      const monthPayments = payments.filter(p => p.month.startsWith(monthKey));

      const collected = monthPayments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);

      const pending = monthPayments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);

      const overdue = monthPayments
        .filter(p => p.status === 'overdue')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);

      trend.push({
        month: monthKey,
        monthLabel,
        collected,
        expected: expectedMonthly,
        pending,
        overdue,
      });
    }

    return trend;
  }

  /**
   * Generate finance alerts
   */
  private async generateAlerts(
    properties: any[],
    payments: any[],
    residents: any[]
  ): Promise<FinanceAlert[]> {
    const alerts: FinanceAlert[] = [];

    // 1. Overdue payments
    const overduePayments = payments.filter(p => p.status === 'overdue');
    if (overduePayments.length > 0) {
      const totalOverdue = overduePayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
      alerts.push({
        id: 'overdue-payments',
        type: 'overdue',
        severity: totalOverdue > 1000 ? 'critical' : 'warning',
        title: `${overduePayments.length} paiement${overduePayments.length > 1 ? 's' : ''} en retard`,
        description: `${totalOverdue.toLocaleString()}€ à recouvrer`,
        amount: totalOverdue,
        href: '/dashboard/owner/finance',
        createdAt: new Date().toISOString(),
      });
    }

    // 2. Low collection rate (< 80%)
    const now = new Date();
    const currentMonthKey = format(now, 'yyyy-MM');
    const currentMonthPayments = payments.filter(p => p.month.startsWith(currentMonthKey));
    const paidCount = currentMonthPayments.filter(p => p.status === 'paid').length;
    const totalCount = currentMonthPayments.length;

    if (totalCount > 0 && paidCount / totalCount < 0.8) {
      alerts.push({
        id: 'low-collection',
        type: 'collection_low',
        severity: 'warning',
        title: 'Taux de recouvrement faible',
        description: `Seulement ${paidCount}/${totalCount} paiements reçus ce mois`,
        href: '/dashboard/owner/finance',
        createdAt: new Date().toISOString(),
      });
    }

    // 3. Vacant properties (published but no tenant for > 30 days)
    const rentedPropertyIds = new Set(residents.map(r => r.property_id));
    const vacantProperties = properties.filter(
      p => p.status === 'published' && !rentedPropertyIds.has(p.id)
    );

    if (vacantProperties.length > 0) {
      const potentialRevenue = vacantProperties.reduce((sum, p) => sum + (p.monthly_rent || 0), 0);
      alerts.push({
        id: 'vacant-properties',
        type: 'vacant_property',
        severity: 'info',
        title: `${vacantProperties.length} bien${vacantProperties.length > 1 ? 's' : ''} vacant${vacantProperties.length > 1 ? 's' : ''}`,
        description: `${potentialRevenue.toLocaleString()}€/mois de revenus potentiels`,
        amount: potentialRevenue,
        href: '/dashboard/owner/properties',
        createdAt: new Date().toISOString(),
      });
    }

    // Sort by severity
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  }

  /**
   * Get recent payments for table view
   */
  async getRecentPayments(userId: string, limit: number = 10): Promise<RentPaymentRecord[]> {
    try {
      // Get user's properties
      const { data: properties } = await this.supabase
        .from('properties')
        .select('id, title')
        .eq('owner_id', userId);

      if (!properties || properties.length === 0) return [];

      const propertyIds = properties.map(p => p.id);
      const propertyMap = new Map(properties.map(p => [p.id, p.title]));

      // Get recent payments
      const { data: payments } = await this.supabase
        .from('rent_payments')
        .select(`
          id,
          property_id,
          user_id,
          amount,
          due_date,
          paid_at,
          status,
          month,
          users:user_id (
            full_name
          )
        `)
        .in('property_id', propertyIds)
        .order('due_date', { ascending: false })
        .limit(limit);

      if (!payments) return [];

      return payments.map(p => ({
        id: p.id,
        propertyId: p.property_id,
        propertyTitle: propertyMap.get(p.property_id) || 'Propriété',
        tenantName: (p.users as any)?.full_name || 'Locataire',
        tenantId: p.user_id,
        amount: p.amount,
        dueDate: new Date(p.due_date),
        paidAt: p.paid_at ? new Date(p.paid_at) : undefined,
        status: p.status,
        month: p.month,
      }));
    } catch (error) {
      console.error('[Finances] Error fetching recent payments:', error);
      return [];
    }
  }

  /**
   * Compare current month to previous month
   */
  async getMonthlyComparison(userId: string): Promise<{
    currentMonth: { collected: number; expected: number };
    previousMonth: { collected: number; expected: number };
    changePercent: number;
  }> {
    try {
      const { data: properties } = await this.supabase
        .from('properties')
        .select('id, monthly_rent, status')
        .eq('owner_id', userId);

      if (!properties) {
        return {
          currentMonth: { collected: 0, expected: 0 },
          previousMonth: { collected: 0, expected: 0 },
          changePercent: 0,
        };
      }

      const propertyIds = properties.map(p => p.id);

      const { data: payments } = await this.supabase
        .from('rent_payments')
        .select('*')
        .in('property_id', propertyIds);

      const now = new Date();
      const currentMonthKey = format(now, 'yyyy-MM');
      const previousMonthKey = format(subMonths(now, 1), 'yyyy-MM');

      const currentPayments = payments?.filter(p => p.month.startsWith(currentMonthKey)) || [];
      const previousPayments = payments?.filter(p => p.month.startsWith(previousMonthKey)) || [];

      const currentCollected = currentPayments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);

      const previousCollected = previousPayments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);

      const expected = properties
        .filter(p => p.status === 'rented' || p.status === 'published')
        .reduce((sum, p) => sum + (p.monthly_rent || 0), 0);

      const changePercent = previousCollected > 0
        ? Math.round(((currentCollected - previousCollected) / previousCollected) * 100)
        : 0;

      return {
        currentMonth: { collected: currentCollected, expected },
        previousMonth: { collected: previousCollected, expected },
        changePercent,
      };
    } catch (error) {
      console.error('[Finances] Error calculating comparison:', error);
      return {
        currentMonth: { collected: 0, expected: 0 },
        previousMonth: { collected: 0, expected: 0 },
        changePercent: 0,
      };
    }
  }

  private getEmptyOverview(): FinancesOverview {
    return {
      kpis: {
        monthlyRevenue: 0,
        pendingPayments: 0,
        overdueAmount: 0,
        collectionRate: 100,
        occupationRate: 0,
        avgRentPerProperty: 0,
      },
      paymentSummary: {
        paid: 0,
        pending: 0,
        overdue: 0,
        paidCount: 0,
        pendingCount: 0,
        overdueCount: 0,
      },
      trend: [],
      alerts: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const financesService = new FinancesService();
