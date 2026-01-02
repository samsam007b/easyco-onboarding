/**
 * Gestion Service
 * Aggregates operational data for the Owner Gestion Hub
 * Combines: Tenants, Leases, Maintenance data
 */

import { createClient } from '@/lib/auth/supabase-client';
import { maintenanceService } from './maintenance-service';
import { differenceInDays, differenceInMonths, addMonths, format } from 'date-fns';

// Types
export interface TenantStats {
  total: number;
  active: number;
  newThisMonth: number;
  withIssues: number;
  leavingSoon: number;
}

export interface LeaseStats {
  total: number;
  active: number;
  expiringSoon: number;
  expired: number;
  totalMonthlyRent: number;
}

export interface MaintenanceStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  urgent: number;
  avgResolutionHours: number;
  totalCost: number;
}

export interface GestionOverview {
  tenants: TenantStats;
  leases: LeaseStats;
  maintenance: MaintenanceStats;
  healthScore: number;
  lastUpdated: string;
}

export type UrgentActionType = 'payment_overdue' | 'lease_expiring' | 'maintenance_urgent' | 'tenant_leaving';

export interface UrgentAction {
  id: string;
  type: UrgentActionType;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  propertyName?: string;
  href: string;
  createdAt: string;
  daysOverdue?: number;
  daysUntilExpiry?: number;
}

export interface ActivityItem {
  id: string;
  type: 'payment' | 'maintenance' | 'lease' | 'tenant';
  action: string;
  description: string;
  propertyName?: string;
  timestamp: string;
  icon?: string;
}

/** Internal type for property data from database */
interface PropertyData {
  id: string;
  title: string;
  status?: string;
  monthly_rent?: number;
}

class GestionService {
  private supabase = createClient();

  /**
   * Get comprehensive overview for Gestion Hub
   */
  async getGestionOverview(userId: string): Promise<GestionOverview> {
    try {
      // Fetch properties for this owner
      const { data: properties } = await this.supabase
        .from('properties')
        .select('id, title, status, monthly_rent')
        .eq('owner_id', userId);

      if (!properties || properties.length === 0) {
        return this.getEmptyOverview();
      }

      const propertyIds = properties.map(p => p.id);

      // Fetch all data in parallel
      const [tenantStats, leaseStats, maintenanceStats] = await Promise.all([
        this.getTenantStats(propertyIds),
        this.getLeaseStats(propertyIds, properties),
        this.getMaintenanceStats(propertyIds),
      ]);

      // Calculate health score
      const healthScore = this.calculateHealthScore(tenantStats, leaseStats, maintenanceStats);

      return {
        tenants: tenantStats,
        leases: leaseStats,
        maintenance: maintenanceStats,
        healthScore,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('[Gestion] ❌ Failed to fetch overview:', error);
      return this.getEmptyOverview();
    }
  }

  /**
   * Get tenant statistics
   */
  private async getTenantStats(propertyIds: string[]): Promise<TenantStats> {
    try {
      const { data: residents } = await this.supabase
        .from('property_residents')
        .select('*')
        .in('property_id', propertyIds)
        .eq('is_active', true);

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const total = residents?.length || 0;
      const active = total; // All fetched are active

      const newThisMonth = residents?.filter(r =>
        new Date(r.move_in_date) >= monthStart
      ).length || 0;

      // Check for issues (overdue payments)
      const { data: overduePayments } = await this.supabase
        .from('rent_payments')
        .select('user_id')
        .in('property_id', propertyIds)
        .eq('status', 'overdue');

      const tenantsWithOverdue = new Set(overduePayments?.map(p => p.user_id) || []);
      const withIssues = tenantsWithOverdue.size;

      // Tenants leaving soon (lease ending within 90 days)
      const leavingSoon = residents?.filter(r => {
        if (!r.lease_duration_months) return false;
        const leaseEnd = addMonths(new Date(r.move_in_date), r.lease_duration_months);
        const daysUntil = differenceInDays(leaseEnd, now);
        return daysUntil > 0 && daysUntil <= 90;
      }).length || 0;

      return { total, active, newThisMonth, withIssues, leavingSoon };
    } catch (error) {
      console.error('[Gestion] ❌ Failed to fetch tenant stats:', error);
      return { total: 0, active: 0, newThisMonth: 0, withIssues: 0, leavingSoon: 0 };
    }
  }

  /**
   * Get lease statistics
   */
  private async getLeaseStats(propertyIds: string[], properties: PropertyData[]): Promise<LeaseStats> {
    try {
      const { data: residents } = await this.supabase
        .from('property_residents')
        .select('*')
        .in('property_id', propertyIds)
        .eq('is_active', true);

      const now = new Date();
      let active = 0;
      let expiringSoon = 0;
      let expired = 0;
      let totalMonthlyRent = 0;

      residents?.forEach(r => {
        if (!r.lease_duration_months) return;

        const leaseEnd = addMonths(new Date(r.move_in_date), r.lease_duration_months);
        const daysUntil = differenceInDays(leaseEnd, now);

        if (daysUntil < 0) {
          expired++;
        } else if (daysUntil <= 90) {
          expiringSoon++;
          // Add rent for active leases
          const property = properties.find(p => p.id === r.property_id);
          if (property) totalMonthlyRent += property.monthly_rent || 0;
        } else {
          active++;
          const property = properties.find(p => p.id === r.property_id);
          if (property) totalMonthlyRent += property.monthly_rent || 0;
        }
      });

      return {
        total: residents?.length || 0,
        active,
        expiringSoon,
        expired,
        totalMonthlyRent,
      };
    } catch (error) {
      console.error('[Gestion] ❌ Failed to fetch lease stats:', error);
      return { total: 0, active: 0, expiringSoon: 0, expired: 0, totalMonthlyRent: 0 };
    }
  }

  /**
   * Get maintenance statistics (uses batch method - avoids N+1)
   */
  private async getMaintenanceStats(propertyIds: string[]): Promise<MaintenanceStats> {
    try {
      // Single batch query instead of N queries
      const statsMap = await maintenanceService.getStatsForProperties(propertyIds);

      let totalOpen = 0;
      let totalInProgress = 0;
      let totalResolved = 0;
      let totalUrgent = 0;
      let totalCost = 0;
      let totalResolutionHours = 0;
      let resolvedCount = 0;

      statsMap.forEach((stats) => {
        totalOpen += stats.open_count || 0;
        totalInProgress += stats.in_progress_count || 0;
        totalResolved += stats.resolved_count || 0;
        totalUrgent += (stats.by_priority?.high || 0) + (stats.by_priority?.emergency || 0);
        totalCost += stats.total_cost || 0;

        if (stats.avg_resolution_time_hours && stats.resolved_count) {
          totalResolutionHours += stats.avg_resolution_time_hours * stats.resolved_count;
          resolvedCount += stats.resolved_count;
        }
      });

      const avgResolutionHours = resolvedCount > 0
        ? Math.round(totalResolutionHours / resolvedCount)
        : 0;

      return {
        total: totalOpen + totalInProgress + totalResolved,
        open: totalOpen,
        inProgress: totalInProgress,
        resolved: totalResolved,
        urgent: totalUrgent,
        avgResolutionHours,
        totalCost,
      };
    } catch (error) {
      console.error('[Gestion] ❌ Failed to fetch maintenance stats:', error);
      return { total: 0, open: 0, inProgress: 0, resolved: 0, urgent: 0, avgResolutionHours: 0, totalCost: 0 };
    }
  }

  /**
   * Calculate overall health score (0-100)
   */
  private calculateHealthScore(
    tenants: TenantStats,
    leases: LeaseStats,
    maintenance: MaintenanceStats
  ): number {
    let score = 100;

    // Tenant issues (-10 per issue, max -30)
    score -= Math.min(tenants.withIssues * 10, 30);

    // Expired leases (-15 per expired, max -30)
    score -= Math.min(leases.expired * 15, 30);

    // Leases expiring soon (-5 per expiring, max -15)
    score -= Math.min(leases.expiringSoon * 5, 15);

    // Urgent maintenance (-10 per urgent, max -20)
    score -= Math.min(maintenance.urgent * 10, 20);

    // Open maintenance (-3 per open, max -15)
    score -= Math.min(maintenance.open * 3, 15);

    return Math.max(score, 0);
  }

  /**
   * Get urgent actions requiring attention
   */
  async getUrgentActions(userId: string): Promise<UrgentAction[]> {
    try {
      const actions: UrgentAction[] = [];

      // Fetch properties
      const { data: properties } = await this.supabase
        .from('properties')
        .select('id, title')
        .eq('owner_id', userId);

      if (!properties) return [];

      const propertyIds = properties.map(p => p.id);
      const propertyMap = new Map(properties.map(p => [p.id, p.title]));

      // 1. Overdue payments
      const { data: overduePayments } = await this.supabase
        .from('rent_payments')
        .select('id, property_id, amount, due_date, user_id, profiles!user_id(full_name)')
        .in('property_id', propertyIds)
        .eq('status', 'overdue')
        .order('due_date', { ascending: true })
        .limit(5);

      overduePayments?.forEach(payment => {
        const daysOverdue = differenceInDays(new Date(), new Date(payment.due_date));
        actions.push({
          id: `payment-${payment.id}`,
          type: 'payment_overdue',
          severity: daysOverdue > 30 ? 'critical' : 'warning',
          title: `Loyer impayé - ${(payment.profiles as any)?.full_name || 'Locataire'}`,
          description: `${payment.amount}€ en retard de ${daysOverdue} jours`,
          propertyName: propertyMap.get(payment.property_id),
          href: '/dashboard/owner/finance',
          createdAt: payment.due_date,
          daysOverdue,
        });
      });

      // 2. Expiring leases
      const { data: residents } = await this.supabase
        .from('property_residents')
        .select('*, profiles!user_id(full_name)')
        .in('property_id', propertyIds)
        .eq('is_active', true);

      const now = new Date();
      residents?.forEach(r => {
        if (!r.lease_duration_months) return;
        const leaseEnd = addMonths(new Date(r.move_in_date), r.lease_duration_months);
        const daysUntil = differenceInDays(leaseEnd, now);

        if (daysUntil <= 0) {
          actions.push({
            id: `lease-expired-${r.id}`,
            type: 'lease_expiring',
            severity: 'critical',
            title: `Bail expiré - ${(r.profiles as any)?.full_name || 'Locataire'}`,
            description: `Expiré depuis ${Math.abs(daysUntil)} jours`,
            propertyName: propertyMap.get(r.property_id),
            href: '/dashboard/owner/leases',
            createdAt: leaseEnd.toISOString(),
            daysUntilExpiry: daysUntil,
          });
        } else if (daysUntil <= 30) {
          actions.push({
            id: `lease-expiring-${r.id}`,
            type: 'lease_expiring',
            severity: 'warning',
            title: `Bail expire bientôt - ${(r.profiles as any)?.full_name || 'Locataire'}`,
            description: `Expire dans ${daysUntil} jours`,
            propertyName: propertyMap.get(r.property_id),
            href: '/dashboard/owner/leases',
            createdAt: leaseEnd.toISOString(),
            daysUntilExpiry: daysUntil,
          });
        }
      });

      // 3. Urgent maintenance (batch query - avoids N+1)
      const allRequests = await maintenanceService.getRequestsForProperties(
        properties.map(p => ({ id: p.id, name: p.title })),
        { status: ['open', 'in_progress'] }
      );

      allRequests
        .filter(r => r.priority === 'high' || r.priority === 'emergency')
        .slice(0, 10) // Limit total urgent tickets shown
        .forEach(r => {
          actions.push({
            id: `maintenance-${r.id}`,
            type: 'maintenance_urgent',
            severity: r.priority === 'emergency' ? 'critical' : 'warning',
            title: r.title,
            description: `${r.priority === 'emergency' ? 'Urgence' : 'Priorité haute'} - ${r.category}`,
            propertyName: r.property_name,
            href: '/dashboard/owner/maintenance',
            createdAt: r.created_at,
          });
        });

      // Sort by severity and date
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return actions.sort((a, b) => {
        const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
        if (severityDiff !== 0) return severityDiff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    } catch (error) {
      console.error('[Gestion] ❌ Failed to fetch urgent actions:', error);
      return [];
    }
  }

  /**
   * Get recent activity timeline
   */
  async getRecentActivity(userId: string, limit: number = 10): Promise<ActivityItem[]> {
    try {
      const activities: ActivityItem[] = [];

      // Fetch properties
      const { data: properties } = await this.supabase
        .from('properties')
        .select('id, title')
        .eq('owner_id', userId);

      if (!properties) return [];

      const propertyIds = properties.map(p => p.id);
      const propertyMap = new Map(properties.map(p => [p.id, p.title]));

      // Recent payments
      const { data: recentPayments } = await this.supabase
        .from('rent_payments')
        .select('id, property_id, amount, status, paid_at, created_at')
        .in('property_id', propertyIds)
        .eq('status', 'paid')
        .order('paid_at', { ascending: false })
        .limit(5);

      recentPayments?.forEach(p => {
        activities.push({
          id: `payment-${p.id}`,
          type: 'payment',
          action: 'Loyer reçu',
          description: `${p.amount}€ encaissés`,
          propertyName: propertyMap.get(p.property_id),
          timestamp: p.paid_at || p.created_at,
        });
      });

      // Recent maintenance resolutions (batch query - avoids N+1)
      const resolvedRequests = await maintenanceService.getRequestsForProperties(
        properties.map(p => ({ id: p.id, name: p.title })),
        { status: ['resolved', 'closed'] }
      );

      resolvedRequests.slice(0, 5).forEach(r => {
        activities.push({
          id: `maintenance-${r.id}`,
          type: 'maintenance',
          action: 'Ticket résolu',
          description: r.title,
          propertyName: r.property_name,
          timestamp: r.resolved_at || r.updated_at || r.created_at,
        });
      });

      // Sort by timestamp and limit
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('[Gestion] ❌ Failed to fetch activity:', error);
      return [];
    }
  }

  private getEmptyOverview(): GestionOverview {
    return {
      tenants: { total: 0, active: 0, newThisMonth: 0, withIssues: 0, leavingSoon: 0 },
      leases: { total: 0, active: 0, expiringSoon: 0, expired: 0, totalMonthlyRent: 0 },
      maintenance: { total: 0, open: 0, inProgress: 0, resolved: 0, urgent: 0, avgResolutionHours: 0, totalCost: 0 },
      healthScore: 100,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const gestionService = new GestionService();
