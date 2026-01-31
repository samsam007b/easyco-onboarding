/**
 * Alerts Notification Service
 * Handles automatic detection and notification of:
 * - Lease expirations
 * - Overdue payments
 * - Urgent maintenance tickets
 * - Daily digest generation
 */

import { createClient } from '@/lib/auth/supabase-client';
import {
  sendLeaseExpirationAlert,
  sendMaintenanceAlert,
  sendDailyDigest,
  type LeaseExpirationData,
  type MaintenanceAlertData,
  type DailyDigestData,
} from './email-service';

// Types
export interface AlertsConfig {
  leaseExpirationDays: number[]; // Days before expiration to send alerts (e.g., [90, 60, 30, 14, 7])
  maintenanceAlertDays: number; // Days after creation to send reminder for open tickets
  sendDailyDigest: boolean;
}

export interface OwnerAlertsSummary {
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  expiringLeases: LeaseExpirationData[];
  urgentMaintenance: MaintenanceAlertData[];
  overduePayments: number;
  pendingApplications: number;
}

const DEFAULT_CONFIG: AlertsConfig = {
  leaseExpirationDays: [90, 60, 30, 14, 7],
  maintenanceAlertDays: 7,
  sendDailyDigest: true,
};

class AlertsNotificationService {
  // Create fresh client for each request to ensure user session is current
  private getSupabase() {
    return createClient();
  }

  /**
   * Get all owners with their properties for alert processing
   */
  private async getOwnersWithProperties(): Promise<
    Array<{
      id: string;
      full_name: string;
      email: string;
      properties: Array<{
        id: string;
        title: string;
        address: string;
        monthly_rent: number;
      }>;
    }>
  > {
    try {
      // Get all owners who have at least one property
      const { data: properties, error } = await this.getSupabase()
        .from('properties')
        .select(`
          id,
          title,
          address,
          monthly_rent,
          owner_id,
          profiles!owner_id (
            id,
            full_name,
            email
          )
        `)
        .eq('status', 'published');

      if (error || !properties) {
        console.error('[AlertsNotification] Failed to fetch properties:', error);
        return [];
      }

      // Group properties by owner
      const ownerMap = new Map<
        string,
        {
          id: string;
          full_name: string;
          email: string;
          properties: Array<{
            id: string;
            title: string;
            address: string;
            monthly_rent: number;
          }>;
        }
      >();

      for (const prop of properties) {
        const profile = prop.profiles as any;
        if (!profile?.id || !profile?.email) continue;

        if (!ownerMap.has(profile.id)) {
          ownerMap.set(profile.id, {
            id: profile.id,
            full_name: profile.full_name || 'Propriétaire',
            email: profile.email,
            properties: [],
          });
        }

        ownerMap.get(profile.id)!.properties.push({
          id: prop.id,
          title: prop.title,
          address: prop.address || '',
          monthly_rent: prop.monthly_rent || 0,
        });
      }

      return Array.from(ownerMap.values());
    } catch (error) {
      console.error('[AlertsNotification] Error fetching owners:', error);
      return [];
    }
  }

  /**
   * Check for expiring leases and return alert data
   */
  async getExpiringLeases(config: AlertsConfig = DEFAULT_CONFIG): Promise<LeaseExpirationData[]> {
    const alerts: LeaseExpirationData[] = [];

    try {
      const owners = await this.getOwnersWithProperties();
      const now = new Date();

      for (const owner of owners) {
        for (const property of owner.properties) {
          // Get residents for this property (note: no is_active column)
          const { data: residents } = await this.getSupabase()
            .from('property_residents')
            .select('*')
            .eq('property_id', property.id);

          if (!residents) continue;

          for (const resident of residents) {
            if (!resident.move_in_date || !resident.lease_duration_months) continue;

            // Calculate lease end date
            const moveIn = new Date(resident.move_in_date);
            const leaseEnd = new Date(moveIn);
            leaseEnd.setMonth(leaseEnd.getMonth() + resident.lease_duration_months);

            // Calculate days until expiration
            const daysUntil = Math.ceil(
              (leaseEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            );

            // Check if this falls within our alert thresholds
            if (daysUntil > 0 && config.leaseExpirationDays.some((d) => daysUntil <= d)) {
              alerts.push({
                ownerName: owner.full_name,
                ownerEmail: owner.email,
                tenantName: `${resident.first_name} ${resident.last_name}`,
                propertyTitle: property.title,
                propertyAddress: property.address,
                leaseEndDate: leaseEnd,
                daysUntilExpiration: daysUntil,
                monthlyRent: property.monthly_rent,
              });
            }
          }
        }
      }

      return alerts;
    } catch (error) {
      console.error('[AlertsNotification] Error checking expiring leases:', error);
      return [];
    }
  }

  /**
   * Check for urgent/old maintenance tickets
   */
  async getUrgentMaintenanceTickets(
    config: AlertsConfig = DEFAULT_CONFIG
  ): Promise<MaintenanceAlertData[]> {
    const alerts: MaintenanceAlertData[] = [];

    try {
      const now = new Date();
      const cutoffDate = new Date(now);
      cutoffDate.setDate(cutoffDate.getDate() - config.maintenanceAlertDays);

      // Get open tickets older than the threshold or with high/urgent priority
      const { data: tickets, error } = await this.getSupabase()
        .from('maintenance_requests')
        .select(`
          *,
          properties!property_id (
            id,
            title,
            address,
            owner_id,
            profiles!owner_id (
              id,
              full_name,
              email
            )
          ),
          created_by_profile:profiles!created_by (
            full_name
          )
        `)
        .in('status', ['pending', 'in_progress'])
        .or(`priority.in.(urgent,high),created_at.lt.${cutoffDate.toISOString()}`);

      if (error || !tickets) {
        console.error('[AlertsNotification] Failed to fetch maintenance tickets:', error);
        return [];
      }

      for (const ticket of tickets) {
        const property = ticket.properties as any;
        const owner = property?.profiles;
        if (!owner?.email) continue;

        const createdAt = new Date(ticket.created_at);
        const daysOpen = Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        alerts.push({
          ownerName: owner.full_name || 'Propriétaire',
          ownerEmail: owner.email,
          propertyTitle: property.title,
          propertyAddress: property.address || '',
          ticketTitle: ticket.title,
          ticketDescription: ticket.description || '',
          priority: ticket.priority || 'medium',
          category: ticket.category || 'Général',
          reportedBy: (ticket.created_by_profile as any)?.full_name || 'Locataire',
          reportedAt: createdAt,
          daysOpen,
        });
      }

      return alerts;
    } catch (error) {
      console.error('[AlertsNotification] Error checking maintenance tickets:', error);
      return [];
    }
  }

  /**
   * Get overdue payments count for an owner
   */
  private async getOverduePaymentsCount(ownerId: string): Promise<number> {
    try {
      const { count, error } = await this.getSupabase()
        .from('rent_payments')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', ownerId)
        .eq('status', 'overdue');

      return error ? 0 : count || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Get pending applications count for owner's properties
   */
  private async getPendingApplicationsCount(propertyIds: string[]): Promise<number> {
    if (propertyIds.length === 0) return 0;

    try {
      const { count, error } = await this.getSupabase()
        .from('applications')
        .select('id', { count: 'exact', head: true })
        .in('property_id', propertyIds)
        .eq('status', 'pending');

      return error ? 0 : count || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Generate daily digest data for an owner
   */
  async generateDailyDigestForOwner(ownerId: string): Promise<DailyDigestData | null> {
    try {
      // Get owner info
      const { data: owner, error: ownerError } = await this.getSupabase()
        .from('profiles')
        .select('id, full_name, email')
        .eq('id', ownerId)
        .single();

      if (ownerError || !owner?.email) return null;

      // Get owner's properties
      const { data: properties } = await this.getSupabase()
        .from('properties')
        .select('id, title, status')
        .eq('owner_id', ownerId);

      if (!properties || properties.length === 0) return null;

      const propertyIds = properties.map((p) => p.id);

      // Get residents count (occupied properties) - note: no is_active column
      const { data: residents } = await this.getSupabase()
        .from('property_residents')
        .select('property_id')
        .in('property_id', propertyIds);

      const occupiedPropertyIds = new Set(residents?.map((r) => r.property_id) || []);
      const publishedProperties = properties.filter((p) => p.status === 'published');

      // Get maintenance tickets
      const { data: tickets } = await this.getSupabase()
        .from('maintenance_requests')
        .select('id, priority, status')
        .in('property_id', propertyIds)
        .in('status', ['pending', 'in_progress']);

      const openTickets = tickets?.length || 0;
      const urgentTickets = tickets?.filter((t) => t.priority === 'urgent').length || 0;

      // Get overdue payments
      const { data: overduePayments } = await this.getSupabase()
        .from('rent_payments')
        .select('id')
        .in('property_id', propertyIds)
        .eq('status', 'overdue');

      // Get pending applications
      const pendingApplications = await this.getPendingApplicationsCount(propertyIds);

      // Get recent payments (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: recentPayments } = await this.getSupabase()
        .from('rent_payments')
        .select(`
          id,
          amount,
          paid_at,
          property_id,
          properties!property_id (title),
          profiles!user_id (full_name)
        `)
        .in('property_id', propertyIds)
        .eq('status', 'paid')
        .gte('paid_at', sevenDaysAgo.toISOString())
        .order('paid_at', { ascending: false })
        .limit(5);

      // Build alerts array
      const alerts: DailyDigestData['alerts'] = [];

      // Add overdue payment alerts
      if (overduePayments && overduePayments.length > 0) {
        alerts.push({
          type: 'payment_overdue',
          title: `${overduePayments.length} loyer(s) en retard`,
          description: 'Des paiements nécessitent votre attention',
          propertyTitle: 'Multiple propriétés',
        });
      }

      // Add pending applications alert
      if (pendingApplications > 0) {
        alerts.push({
          type: 'application_pending',
          title: `${pendingApplications} candidature(s) en attente`,
          description: 'Nouvelles candidatures à examiner',
          propertyTitle: 'Multiple propriétés',
        });
      }

      // Add urgent maintenance alert
      if (urgentTickets > 0) {
        alerts.push({
          type: 'maintenance_urgent',
          title: `${urgentTickets} ticket(s) urgent(s)`,
          description: 'Interventions urgentes requises',
          propertyTitle: 'Multiple propriétés',
        });
      }

      return {
        ownerName: owner.full_name || 'Propriétaire',
        ownerEmail: owner.email,
        date: new Date(),
        summary: {
          totalProperties: publishedProperties.length,
          occupiedProperties: occupiedPropertyIds.size,
          vacantProperties: publishedProperties.length - occupiedPropertyIds.size,
          pendingApplications,
          overduePayments: overduePayments?.length || 0,
          openMaintenanceTickets: openTickets,
          urgentMaintenanceTickets: urgentTickets,
        },
        alerts,
        recentPayments:
          recentPayments?.map((p) => ({
            tenantName: (p.profiles as any)?.full_name || 'Locataire',
            propertyTitle: (p.properties as any)?.title || 'Propriété',
            amount: p.amount,
            date: new Date(p.paid_at),
          })) || [],
      };
    } catch (error) {
      console.error('[AlertsNotification] Error generating digest:', error);
      return null;
    }
  }

  /**
   * Send lease expiration alerts
   */
  async sendLeaseExpirationAlerts(config: AlertsConfig = DEFAULT_CONFIG): Promise<{
    sent: number;
    failed: number;
  }> {
    const alerts = await this.getExpiringLeases(config);
    let sent = 0;
    let failed = 0;

    for (const alert of alerts) {
      const result = await sendLeaseExpirationAlert(alert);
      if (result.success) {
        sent++;
        console.log(
          `[AlertsNotification] OK: Sent lease expiration alert for ${alert.propertyTitle}`
        );
      } else {
        failed++;
        console.error(
          `[AlertsNotification] ERROR: Failed to send lease alert: ${result.error}`
        );
      }
    }

    return { sent, failed };
  }

  /**
   * Send maintenance alerts
   */
  async sendMaintenanceAlerts(config: AlertsConfig = DEFAULT_CONFIG): Promise<{
    sent: number;
    failed: number;
  }> {
    const alerts = await this.getUrgentMaintenanceTickets(config);
    let sent = 0;
    let failed = 0;

    for (const alert of alerts) {
      const result = await sendMaintenanceAlert(alert);
      if (result.success) {
        sent++;
        console.log(
          `[AlertsNotification] OK: Sent maintenance alert for ${alert.ticketTitle}`
        );
      } else {
        failed++;
        console.error(
          `[AlertsNotification] ERROR: Failed to send maintenance alert: ${result.error}`
        );
      }
    }

    return { sent, failed };
  }

  /**
   * Send daily digests to all owners
   */
  async sendDailyDigests(): Promise<{ sent: number; failed: number }> {
    const owners = await this.getOwnersWithProperties();
    let sent = 0;
    let failed = 0;

    for (const owner of owners) {
      const digestData = await this.generateDailyDigestForOwner(owner.id);
      if (!digestData) continue;

      const result = await sendDailyDigest(digestData);
      if (result.success) {
        sent++;
        console.log(`[AlertsNotification] OK: Sent daily digest to ${owner.email}`);
      } else {
        failed++;
        console.error(
          `[AlertsNotification] ERROR: Failed to send digest to ${owner.email}: ${result.error}`
        );
      }
    }

    return { sent, failed };
  }

  /**
   * Run all automatic alerts (typically called by a cron job)
   */
  async runAllAlerts(config: AlertsConfig = DEFAULT_CONFIG): Promise<{
    leaseAlerts: { sent: number; failed: number };
    maintenanceAlerts: { sent: number; failed: number };
    dailyDigests: { sent: number; failed: number };
  }> {
    console.log('[AlertsNotification] Starting automatic alerts run...');

    const leaseAlerts = await this.sendLeaseExpirationAlerts(config);
    const maintenanceAlerts = await this.sendMaintenanceAlerts(config);
    const dailyDigests = config.sendDailyDigest
      ? await this.sendDailyDigests()
      : { sent: 0, failed: 0 };

    console.log('[AlertsNotification] Alerts run complete:', {
      leaseAlerts,
      maintenanceAlerts,
      dailyDigests,
    });

    return { leaseAlerts, maintenanceAlerts, dailyDigests };
  }
}

export const alertsNotificationService = new AlertsNotificationService();
