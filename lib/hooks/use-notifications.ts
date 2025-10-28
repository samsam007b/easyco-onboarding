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
    // TEMPORARILY DISABLED: Persistent auth/CORS issues
    // Will be debugged separately - not blocking other features
    setNotifications([]);
    setUnreadCount(0);
    setIsLoading(false);
    return;
  }, [userId]);

  // Load only unread notifications count (for badge)
  const loadUnreadCount = useCallback(async () => {
    // TEMPORARILY DISABLED: Persistent auth/CORS issues
    setUnreadCount(0);
    return;
  }, [userId]);

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
    [userId]
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
  }, [userId]);

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
    [userId, notifications]
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
  }, [userId]);

  // Subscribe to real-time notifications
  const subscribeToNotifications = useCallback(() => {
    // TEMPORARILY DISABLED: Persistent auth/CORS issues
    return;
  }, [userId, channel]);

  // Unsubscribe from real-time notifications
  const unsubscribeFromNotifications = useCallback(() => {
    if (channel) {
      supabase.removeChannel(channel);
      setChannel(null);
    }
  }, [channel]);

  // Initial load and real-time subscription
  useEffect(() => {
    loadNotifications();
    subscribeToNotifications();

    // Cleanup on unmount
    return () => {
      unsubscribeFromNotifications();
    };
  }, [loadNotifications, subscribeToNotifications, unsubscribeFromNotifications]);

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
