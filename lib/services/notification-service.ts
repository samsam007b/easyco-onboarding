/**
 * Notification Service for Izzico
 * Handles all notification-related operations
 */

import { createClient } from '@/lib/auth/supabase-client';
import type {
  NotificationRow,
  CreateNotificationParams,
  NotificationFilters,
} from '@/lib/types/notifications.types';

export class NotificationService {
  /**
   * Get notifications for the current user
   */
  static async getUserNotifications(
    filters?: NotificationFilters
  ): Promise<{ data: NotificationRow[]; error: Error | null }> {
    try {
      const supabase = createClient();
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.type) {
        if (Array.isArray(filters.type)) {
          query = query.in('type', filters.type);
        } else {
          query = query.eq('type', filters.type);
        }
      }

      if (filters?.read !== undefined) {
        query = query.eq('is_read', filters.read);
      }

      if (filters?.from_date) {
        query = query.gte('created_at', filters.from_date);
      }

      if (filters?.to_date) {
        query = query.lte('created_at', filters.to_date);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 20) - 1
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data: data as NotificationRow[], error: null };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { data: [], error: error as Error };
    }
  }

  /**
   * Get unread notification count for the current user
   */
  static async getUnreadCount(): Promise<{
    count: number;
    error: Error | null;
  }> {
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user?.id) {
        return { count: 0, error: null };
      }

      // Use direct count query (more reliable than RPC)
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userData.user.id)
        .eq('is_read', false);

      if (error) throw error;

      return { count: count || 0, error: null };
    } catch (error) {
      console.error('Error getting unread count:', error);
      return { count: 0, error: error as Error };
    }
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(
    notificationId: string
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read: true })
        .eq('id', notificationId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Mark all notifications as read for the current user
   */
  static async markAllAsRead(): Promise<{
    count: number;
    error: Error | null;
  }> {
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user?.id) {
        return { count: 0, error: null };
      }

      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true, read: true })
        .eq('user_id', userData.user.id)
        .eq('is_read', false)
        .select();

      if (error) throw error;

      return { count: data?.length || 0, error: null };
    } catch (error) {
      console.error('Error marking all as read:', error);
      return { count: 0, error: error as Error };
    }
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(
    notificationId: string
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Create a notification (for server-side use)
   * Note: This should be called from API routes with service role
   */
  static async createNotification(
    params: CreateNotificationParams
  ): Promise<{ data: NotificationRow | null; error: Error | null }> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: params.user_id,
          type: params.type,
          title: params.title,
          message: params.message,
          metadata: params.metadata || {},
          action_url: params.action_url,
          action_label: params.action_label,
          image_url: params.image_url,
          is_read: false,
          read: false,
        })
        .select()
        .single();

      if (error) throw error;

      return { data: data as NotificationRow, error: null };
    } catch (error) {
      console.error('Error creating notification:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Subscribe to real-time notifications
   */
  static subscribeToNotifications(
    userId: string,
    callback: (notification: NotificationRow) => void
  ) {
    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as NotificationRow);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Get notification by ID
   */
  static async getNotificationById(
    notificationId: string
  ): Promise<{ data: NotificationRow | null; error: Error | null }> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', notificationId)
        .single();

      if (error) throw error;

      return { data: data as NotificationRow, error: null };
    } catch (error) {
      console.error('Error fetching notification:', error);
      return { data: null, error: error as Error };
    }
  }
}

// Export helper functions for convenience
export const {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  subscribeToNotifications,
  getNotificationById,
} = NotificationService;
