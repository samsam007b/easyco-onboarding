/**
 * Property Timeline Service
 * Aggregates historical events for a property from multiple sources:
 * - Tenants (move in/out)
 * - Maintenance requests
 * - Rent payments
 * - Applications
 * - Lease changes
 */

import { createClient } from '@/lib/auth/supabase-client';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Timeline Event Types
export type TimelineEventType =
  | 'tenant_move_in'
  | 'tenant_move_out'
  | 'maintenance_created'
  | 'maintenance_resolved'
  | 'payment_received'
  | 'payment_overdue'
  | 'application_received'
  | 'application_approved'
  | 'application_rejected'
  | 'lease_created'
  | 'lease_renewed'
  | 'property_created'
  | 'property_published';

export type TimelineCategory = 'tenant' | 'maintenance' | 'payment' | 'application' | 'lease' | 'property';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  category: TimelineCategory;
  title: string;
  description: string;
  date: Date;
  metadata?: {
    amount?: number;
    personName?: string;
    status?: string;
    priority?: string;
    category?: string;
  };
}

export interface TimelineFilters {
  categories?: TimelineCategory[];
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

export interface PropertyTimelineData {
  propertyId: string;
  propertyTitle: string;
  events: TimelineEvent[];
  stats: {
    totalEvents: number;
    tenantChanges: number;
    maintenanceCount: number;
    paymentsReceived: number;
  };
}

class PropertyTimelineService {
  private supabase = createClient();

  /**
   * Get complete timeline for a property
   */
  async getPropertyTimeline(
    propertyId: string,
    filters?: TimelineFilters
  ): Promise<PropertyTimelineData> {
    try {
      // Get property info
      const { data: property } = await this.supabase
        .from('properties')
        .select('id, title, created_at, status')
        .eq('id', propertyId)
        .single();

      if (!property) {
        return {
          propertyId,
          propertyTitle: 'Propriété inconnue',
          events: [],
          stats: { totalEvents: 0, tenantChanges: 0, maintenanceCount: 0, paymentsReceived: 0 },
        };
      }

      // Fetch all events in parallel
      const [
        tenantEvents,
        maintenanceEvents,
        paymentEvents,
        applicationEvents,
        propertyEvents,
      ] = await Promise.all([
        this.getTenantEvents(propertyId),
        this.getMaintenanceEvents(propertyId),
        this.getPaymentEvents(propertyId),
        this.getApplicationEvents(propertyId),
        this.getPropertyEvents(property),
      ]);

      // Combine all events
      let allEvents = [
        ...tenantEvents,
        ...maintenanceEvents,
        ...paymentEvents,
        ...applicationEvents,
        ...propertyEvents,
      ];

      // Apply filters
      if (filters?.categories && filters.categories.length > 0) {
        allEvents = allEvents.filter((e) => filters.categories!.includes(e.category));
      }

      if (filters?.startDate) {
        allEvents = allEvents.filter((e) => e.date >= filters.startDate!);
      }

      if (filters?.endDate) {
        allEvents = allEvents.filter((e) => e.date <= filters.endDate!);
      }

      // Sort by date (newest first)
      allEvents.sort((a, b) => b.date.getTime() - a.date.getTime());

      // Apply limit
      if (filters?.limit) {
        allEvents = allEvents.slice(0, filters.limit);
      }

      // Calculate stats
      const stats = {
        totalEvents: allEvents.length,
        tenantChanges: tenantEvents.length,
        maintenanceCount: maintenanceEvents.length,
        paymentsReceived: paymentEvents.filter((e) => e.type === 'payment_received').length,
      };

      return {
        propertyId,
        propertyTitle: property.title,
        events: allEvents,
        stats,
      };
    } catch (error) {
      console.error('[PropertyTimeline] ERROR: Failed to fetch timeline:', error);
      return {
        propertyId,
        propertyTitle: 'Erreur',
        events: [],
        stats: { totalEvents: 0, tenantChanges: 0, maintenanceCount: 0, paymentsReceived: 0 },
      };
    }
  }

  /**
   * Get tenant-related events (move in/out)
   */
  private async getTenantEvents(propertyId: string): Promise<TimelineEvent[]> {
    const events: TimelineEvent[] = [];

    try {
      const { data: residents } = await this.supabase
        .from('property_residents')
        .select('*')
        .eq('property_id', propertyId)
        .order('move_in_date', { ascending: false });

      residents?.forEach((resident) => {
        // Move in event
        if (resident.move_in_date) {
          events.push({
            id: `tenant-in-${resident.id}`,
            type: 'tenant_move_in',
            category: 'tenant',
            title: 'Nouveau locataire',
            description: `${resident.first_name} ${resident.last_name} a emménagé`,
            date: new Date(resident.move_in_date),
            metadata: {
              personName: `${resident.first_name} ${resident.last_name}`,
            },
          });
        }

        // Move out event (if not active and has an end date)
        if (!resident.is_active && resident.move_in_date && resident.lease_duration_months) {
          const moveOutDate = new Date(resident.move_in_date);
          moveOutDate.setMonth(moveOutDate.getMonth() + resident.lease_duration_months);

          events.push({
            id: `tenant-out-${resident.id}`,
            type: 'tenant_move_out',
            category: 'tenant',
            title: 'Départ locataire',
            description: `${resident.first_name} ${resident.last_name} a quitté le logement`,
            date: moveOutDate,
            metadata: {
              personName: `${resident.first_name} ${resident.last_name}`,
            },
          });
        }
      });
    } catch (error) {
      console.error('[PropertyTimeline] ERROR: Failed to fetch tenant events:', error);
    }

    return events;
  }

  /**
   * Get maintenance-related events
   */
  private async getMaintenanceEvents(propertyId: string): Promise<TimelineEvent[]> {
    const events: TimelineEvent[] = [];

    try {
      const { data: requests } = await this.supabase
        .from('maintenance_requests')
        .select('*, profiles!created_by(full_name)')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      requests?.forEach((request) => {
        // Created event
        events.push({
          id: `maint-created-${request.id}`,
          type: 'maintenance_created',
          category: 'maintenance',
          title: 'Ticket maintenance',
          description: request.title,
          date: new Date(request.created_at),
          metadata: {
            priority: request.priority,
            category: request.category,
            personName: (request.profiles as any)?.full_name,
          },
        });

        // Resolved event
        if (request.status === 'resolved' || request.status === 'closed') {
          const resolvedDate = request.resolved_at || request.updated_at;
          if (resolvedDate) {
            events.push({
              id: `maint-resolved-${request.id}`,
              type: 'maintenance_resolved',
              category: 'maintenance',
              title: 'Ticket résolu',
              description: request.title,
              date: new Date(resolvedDate),
              metadata: {
                amount: request.cost,
                priority: request.priority,
                category: request.category,
              },
            });
          }
        }
      });
    } catch (error) {
      console.error('[PropertyTimeline] ERROR: Failed to fetch maintenance events:', error);
    }

    return events;
  }

  /**
   * Get payment-related events
   */
  private async getPaymentEvents(propertyId: string): Promise<TimelineEvent[]> {
    const events: TimelineEvent[] = [];

    try {
      const { data: payments } = await this.supabase
        .from('rent_payments')
        .select('*, profiles!user_id(full_name)')
        .eq('property_id', propertyId)
        .order('paid_at', { ascending: false, nullsFirst: false });

      payments?.forEach((payment) => {
        if (payment.status === 'paid' && payment.paid_at) {
          events.push({
            id: `payment-${payment.id}`,
            type: 'payment_received',
            category: 'payment',
            title: 'Loyer reçu',
            description: `${payment.amount}€ de ${(payment.profiles as any)?.full_name || 'locataire'}`,
            date: new Date(payment.paid_at),
            metadata: {
              amount: payment.amount,
              personName: (payment.profiles as any)?.full_name,
            },
          });
        } else if (payment.status === 'overdue') {
          events.push({
            id: `payment-overdue-${payment.id}`,
            type: 'payment_overdue',
            category: 'payment',
            title: 'Loyer en retard',
            description: `${payment.amount}€ de ${(payment.profiles as any)?.full_name || 'locataire'}`,
            date: new Date(payment.due_date),
            metadata: {
              amount: payment.amount,
              personName: (payment.profiles as any)?.full_name,
              status: 'overdue',
            },
          });
        }
      });
    } catch (error) {
      console.error('[PropertyTimeline] ERROR: Failed to fetch payment events:', error);
    }

    return events;
  }

  /**
   * Get application-related events
   */
  private async getApplicationEvents(propertyId: string): Promise<TimelineEvent[]> {
    const events: TimelineEvent[] = [];

    try {
      const { data: applications } = await this.supabase
        .from('applications')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      applications?.forEach((app) => {
        // Application received
        events.push({
          id: `app-${app.id}`,
          type: 'application_received',
          category: 'application',
          title: 'Candidature reçue',
          description: `De ${app.applicant_name}`,
          date: new Date(app.created_at),
          metadata: {
            personName: app.applicant_name,
            status: app.status,
          },
        });

        // If approved or rejected
        if (app.status === 'approved' && app.updated_at !== app.created_at) {
          events.push({
            id: `app-approved-${app.id}`,
            type: 'application_approved',
            category: 'application',
            title: 'Candidature approuvée',
            description: `${app.applicant_name} accepté`,
            date: new Date(app.updated_at),
            metadata: {
              personName: app.applicant_name,
            },
          });
        } else if (app.status === 'rejected' && app.updated_at !== app.created_at) {
          events.push({
            id: `app-rejected-${app.id}`,
            type: 'application_rejected',
            category: 'application',
            title: 'Candidature refusée',
            description: `${app.applicant_name}`,
            date: new Date(app.updated_at),
            metadata: {
              personName: app.applicant_name,
            },
          });
        }
      });
    } catch (error) {
      console.error('[PropertyTimeline] ERROR: Failed to fetch application events:', error);
    }

    return events;
  }

  /**
   * Get property lifecycle events
   */
  private async getPropertyEvents(property: {
    id: string;
    title: string;
    created_at: string;
    status: string;
  }): Promise<TimelineEvent[]> {
    const events: TimelineEvent[] = [];

    // Property created
    if (property.created_at) {
      events.push({
        id: `prop-created-${property.id}`,
        type: 'property_created',
        category: 'property',
        title: 'Propriété créée',
        description: `${property.title} ajoutée au portfolio`,
        date: new Date(property.created_at),
      });
    }

    // If published
    if (property.status === 'published') {
      events.push({
        id: `prop-published-${property.id}`,
        type: 'property_published',
        category: 'property',
        title: 'Annonce publiée',
        description: `${property.title} mise en ligne`,
        date: new Date(property.created_at), // Would need actual publish date
      });
    }

    return events;
  }
}

export const propertyTimelineService = new PropertyTimelineService();
