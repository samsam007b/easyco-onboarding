'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  related_user_id?: string | null;
  related_property_id?: string | null;
  related_conversation_id?: string | null;
  action_url?: string | null;
  read: boolean;
  read_at?: string | null;
  created_at: string;
  metadata?: any;
}

export function useNotifications(userId?: string) {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Load all notifications for the user
  const loadNotifications = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.read).length);
    } catch (error: any) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, supabase]);

  // Load only unread notifications count (for badge)
  const loadUnreadCount = useCallback(async () => {
    if (!userId) return;

    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;

      setUnreadCount(count || 0);
    } catch (error: any) {
      console.error('Error loading unread count:', error);
    }
  }, [userId, supabase]);

  // Mark a notification as read
  const markAsRead = useCallback(
    async (notificationId: string): Promise<boolean> => {
      if (!userId) return false;

      try {
        const { error } = await supabase
          .from('notifications')
          .update({
            read: true,
            read_at: new Date().toISOString(),
          })
          .eq('id', notificationId)
          .eq('user_id', userId);

        if (error) throw error;

        // Update local state
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId
              ? { ...n, read: true, read_at: new Date().toISOString() }
              : n
          )
        );

        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));

        return true;
      } catch (error: any) {
        console.error('Error marking notification as read:', error);
        return false;
      }
    },
    [userId, supabase]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          read: true,
          read_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;

      // Update local state
      setNotifications(prev =>
        prev.map(n => ({
          ...n,
          read: true,
          read_at: n.read_at || new Date().toISOString(),
        }))
      );

      setUnreadCount(0);

      return true;
    } catch (error: any) {
      console.error('Error marking all as read:', error);
      return false;
    }
  }, [userId, supabase]);

  // Delete a notification
  const deleteNotification = useCallback(
    async (notificationId: string): Promise<boolean> => {
      if (!userId) return false;

      try {
        const { error } = await supabase
          .from('notifications')
          .delete()
          .eq('id', notificationId)
          .eq('user_id', userId);

        if (error) throw error;

        // Update local state
        const notification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));

        if (notification && !notification.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }

        return true;
      } catch (error: any) {
        console.error('Error deleting notification:', error);
        return false;
      }
    },
    [userId, supabase, notifications]
  );

  // Delete all read notifications
  const clearReadNotifications = useCallback(async (): Promise<boolean> => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
        .eq('read', true);

      if (error) throw error;

      // Update local state
      setNotifications(prev => prev.filter(n => !n.read));

      return true;
    } catch (error: any) {
      console.error('Error clearing read notifications:', error);
      return false;
    }
  }, [userId, supabase]);

  // Subscribe to real-time notifications
  const subscribeToNotifications = useCallback(() => {
    if (!userId) return;

    // Unsubscribe from previous channel if exists
    if (channel) {
      supabase.removeChannel(channel);
    }

    // Subscribe to new notifications
    const newChannel = supabase
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
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const updatedNotification = payload.new as Notification;
          setNotifications(prev =>
            prev.map(n => (n.id === updatedNotification.id ? updatedNotification : n))
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const deletedNotification = payload.old as Notification;
          setNotifications(prev => prev.filter(n => n.id !== deletedNotification.id));
          if (!deletedNotification.read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    setChannel(newChannel);
  }, [userId, channel, supabase]);

  // Unsubscribe from real-time notifications
  const unsubscribeFromNotifications = useCallback(() => {
    if (channel) {
      supabase.removeChannel(channel);
      setChannel(null);
    }
  }, [channel, supabase]);

  // Initial load and real-time subscription
  useEffect(() => {
    loadNotifications();
    subscribeToNotifications();

    // Cleanup on unmount
    return () => {
      unsubscribeFromNotifications();
    };
  }, [userId]);

  return {
    notifications,
    unreadCount,
    isLoading,
    loadNotifications,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications,
    subscribeToNotifications,
    unsubscribeFromNotifications,
  };
}
