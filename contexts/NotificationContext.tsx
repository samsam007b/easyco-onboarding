'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { Notification, NotificationStats } from '@/types/notification.types';

interface NotificationContextType {
  notifications: Notification[];
  stats: NotificationStats;
  isLoading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    unreadCount: 0,
    todayCount: 0,
    totalCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const loadNotifications = useCallback(async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (data) {
        const formattedNotifications: Notification[] = data.map((notif: any) => ({
          id: notif.id,
          userId: notif.user_id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          actionUrl: notif.action_url,
          actionLabel: notif.action_label,
          isRead: notif.is_read,
          createdAt: notif.created_at,
          imageUrl: notif.image_url,
          metadata: notif.metadata
        }));

        setNotifications(formattedNotifications);

        // Calculate stats
        const unreadCount = formattedNotifications.filter(n => !n.isRead).length;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = formattedNotifications.filter(
          n => new Date(n.createdAt) >= today
        ).length;

        setStats({
          unreadCount,
          todayCount,
          totalCount: formattedNotifications.length
        });
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    const initNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await loadNotifications(user.id);

        // Subscribe to realtime changes
        const channel = supabase
          .channel('notifications')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${user.id}`
            },
            () => {
              loadNotifications(user.id);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    };

    initNotifications();
  }, [supabase, loadNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      setNotifications(notifications.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      ));

      setStats(prev => ({
        ...prev,
        unreadCount: Math.max(0, prev.unreadCount - 1)
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
      setStats(prev => ({ ...prev, unreadCount: 0 }));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      const deletedNotif = notifications.find(n => n.id === notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));

      setStats(prev => ({
        ...prev,
        unreadCount: deletedNotif && !deletedNotif.isRead ? prev.unreadCount - 1 : prev.unreadCount,
        totalCount: prev.totalCount - 1
      }));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const refreshNotifications = async () => {
    if (userId) {
      await loadNotifications(userId);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        stats,
        isLoading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refreshNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
