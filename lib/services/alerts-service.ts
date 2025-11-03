import { SupabaseClient } from '@supabase/supabase-js';
import { PropertyAlert, PropertyNotification, CreateAlertInput, UpdateAlertInput, AlertCriteria } from '@/types/alerts.types';

export class AlertsService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Create a new property alert
   */
  async createAlert(input: CreateAlertInput): Promise<PropertyAlert> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('property_alerts')
      .insert({
        user_id: user.id,
        name: input.name,
        criteria: input.criteria,
        email_notifications: input.email_notifications ?? true,
        in_app_notifications: input.in_app_notifications ?? true,
        notification_frequency: input.notification_frequency ?? 'instant',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get all alerts for current user
   */
  async getUserAlerts(): Promise<PropertyAlert[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('property_alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get active alerts count
   */
  async getActiveAlertsCount(): Promise<number> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { count, error } = await this.supabase
      .from('property_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (error) throw error;
    return count || 0;
  }

  /**
   * Update an existing alert
   */
  async updateAlert(alertId: string, input: UpdateAlertInput): Promise<PropertyAlert> {
    const { data, error } = await this.supabase
      .from('property_alerts')
      .update(input)
      .eq('id', alertId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Toggle alert active status
   */
  async toggleAlert(alertId: string, isActive: boolean): Promise<void> {
    const { error } = await this.supabase
      .from('property_alerts')
      .update({ is_active: isActive })
      .eq('id', alertId);

    if (error) throw error;
  }

  /**
   * Delete an alert
   */
  async deleteAlert(alertId: string): Promise<void> {
    const { error } = await this.supabase
      .from('property_alerts')
      .delete()
      .eq('id', alertId);

    if (error) throw error;
  }

  /**
   * Get all notifications for current user
   */
  async getUserNotifications(limit: number = 50): Promise<PropertyNotification[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('property_notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Get unread notifications count
   */
  async getUnreadNotificationsCount(): Promise<number> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { count, error } = await this.supabase
      .from('property_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await this.supabase
      .from('property_notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId);

    if (error) throw error;
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsAsRead(): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await this.supabase
      .from('property_notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) throw error;
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await this.supabase
      .from('property_notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  }

  /**
   * Create an alert from current search filters
   */
  async createAlertFromFilters(
    name: string,
    filters: {
      minPrice: number;
      maxPrice: number;
      bedrooms: number | null;
      bathrooms: number | null;
      propertyType: string;
      city: string;
      amenities: string[];
      furnished: boolean | null;
    }
  ): Promise<PropertyAlert> {
    const criteria: AlertCriteria = {
      city: filters.city || undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      bedrooms: filters.bedrooms,
      bathrooms: filters.bathrooms,
      propertyType: filters.propertyType !== 'all' ? filters.propertyType : undefined,
      amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
      furnished: filters.furnished,
    };

    return this.createAlert({
      name,
      criteria,
      email_notifications: true,
      in_app_notifications: true,
      notification_frequency: 'instant',
    });
  }

  /**
   * Subscribe to real-time notifications
   */
  subscribeToNotifications(
    callback: (notification: PropertyNotification) => void
  ) {
    return this.supabase
      .channel('property_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'property_notifications',
        },
        (payload) => {
          callback(payload.new as PropertyNotification);
        }
      )
      .subscribe();
  }
}
