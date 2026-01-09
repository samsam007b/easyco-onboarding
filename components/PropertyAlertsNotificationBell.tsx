'use client';

import { useState, useEffect } from 'react';
import { Bell, Home, TrendingDown, FileText, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import { AlertsService } from '@/lib/services/alerts-service';
import { PropertyNotification } from '@/types/alerts.types';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS, nl, de } from 'date-fns/locale';
import { useLanguage } from '@/lib/i18n/use-language';

const dateLocales: Record<string, typeof fr> = { fr, en: enUS, nl, de };

export default function PropertyAlertsNotificationBell() {
  const router = useRouter();
  const supabase = createClient();
  const alertsService = new AlertsService(supabase);
  const { language, getSection } = useLanguage();
  const ariaLabels = getSection('ariaLabels');
  const locale = dateLocales[language] || fr;

  const [notifications, setNotifications] = useState<PropertyNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();

    // Subscribe to real-time notifications
    const channel = alertsService.subscribeToNotifications((notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await alertsService.getUserNotifications(10);
      setNotifications(data);
    } catch (error) {
      logger.error('Error loading notifications', error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await alertsService.getUnreadNotificationsCount();
      setUnreadCount(count);
    } catch (error) {
      logger.error('Error loading unread count', error);
    }
  };

  const handleNotificationClick = async (notification: PropertyNotification) => {
    // Mark as read
    if (!notification.is_read) {
      await alertsService.markNotificationAsRead(notification.id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        )
      );
    }

    // Navigate to property
    setIsOpen(false);
    router.push(`/properties/${notification.property_id}`);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await alertsService.markAllNotificationsAsRead();
      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
    } catch (error) {
      logger.error('Error marking all as read', error);
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    router.push('/dashboard/searcher/notifications');
  };

  const getNotificationIcon = (type: PropertyNotification['type']) => {
    switch (type) {
      case 'new_property':
        return <Home className="w-5 h-5 text-blue-600" />;
      case 'price_drop':
        return <TrendingDown className="w-5 h-5 text-green-600" />;
      case 'status_change':
        return <FileText className="w-5 h-5 text-orange-600" />;
      case 'new_match':
        return <Heart className="w-5 h-5 text-pink-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={ariaLabels?.notifications?.[language] || 'Notifications'}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="error"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px]">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p className="text-sm">Aucune notification</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-3 cursor-pointer ${
                  !notification.is_read ? 'bg-blue-50 hover:bg-blue-100' : ''
                }`}
              >
                <div className="flex gap-3 w-full">
                  <div className="text-2xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm text-gray-900 line-clamp-1">
                        {notification.title}
                      </p>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    {notification.message && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale,
                      })}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleViewAll}
          className="p-3 text-center text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
        >
          Voir toutes les notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
