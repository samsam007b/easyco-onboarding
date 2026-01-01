'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { AlertsService } from '@/lib/services/alerts-service';
import { PropertyNotification } from '@/types/alerts.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Trash2, Filter, ArrowLeft, Home, DollarSign, FileText, Heart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr, enGB, de, nl } from 'date-fns/locale';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { useLanguage } from '@/lib/i18n/use-language';
// Removed Select imports - using button filters instead

export default function NotificationsPage() {
  const router = useRouter();
  const supabase = createClient();
  const alertsService = new AlertsService(supabase);
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.searcher?.notifications;

  const [notifications, setNotifications] = useState<PropertyNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadNotifications();

    // Subscribe to real-time updates
    const channel = alertsService.subscribeToNotifications((notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await alertsService.getUserNotifications(100);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error(t?.messages?.loadError?.[language] || 'Erreur lors du chargement des notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = async (notification: PropertyNotification) => {
    if (!notification.is_read) {
      await alertsService.markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );
    }
    router.push(`/properties/${notification.property_id}`);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await alertsService.markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
      toast.success(t?.messages?.allMarkedRead?.[language] || 'Toutes les notifications ont été marquées comme lues');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error(t?.messages?.markError?.[language] || 'Erreur lors du marquage');
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await alertsService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      toast.success(t?.messages?.deleted?.[language] || 'Notification supprimée');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error(t?.messages?.deleteError?.[language] || 'Erreur lors de la suppression');
    }
  };

  const getNotificationIcon = (type: PropertyNotification['type']) => {
    switch (type) {
      case 'new_property':
        return Home;
      case 'price_drop':
        return DollarSign;
      case 'status_change':
        return FileText;
      case 'new_match':
        return Heart;
      default:
        return Bell;
    }
  };

  const getNotificationBadge = (type: PropertyNotification['type']) => {
    switch (type) {
      case 'new_property':
        return { label: t?.types?.newProperty?.[language] || 'Nouvelle propriété', color: 'bg-green-100 text-green-700' };
      case 'price_drop':
        return { label: t?.types?.priceDrop?.[language] || 'Baisse de prix', color: 'bg-blue-100 text-blue-700' };
      case 'status_change':
        return { label: t?.types?.statusChange?.[language] || 'Changement', color: 'bg-gray-100 text-gray-700' };
      case 'new_match':
        return { label: t?.types?.newMatch?.[language] || 'Nouveau match', color: 'bg-pink-100 text-pink-700' };
      default:
        return { label: type, color: 'bg-gray-100 text-gray-700' };
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'read') return n.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getDateLocale = () => {
    switch (language) {
      case 'fr': return fr;
      case 'de': return de;
      case 'nl': return nl;
      default: return enGB;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoadingHouse size={64} />
            <p className="text-gray-600">{t?.loading?.[language] || 'Chargement des notifications...'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t?.back?.[language] || 'Retour'}
        </Button>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-md">
                <Bell className="w-6 h-6 text-white" />
              </div>
              {t?.title?.[language] || 'Notifications'}
            </h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? (
                <>{unreadCount} {unreadCount > 1
                  ? (t?.unreadCount?.plural?.[language] || 'notifications non lues')
                  : (t?.unreadCount?.singular?.[language] || 'notification non lue')}</>
              ) : (
                <>{t?.noUnread?.[language] || 'Aucune notification non lue'}</>
              )}
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant="outline"
              className="text-orange-600 border-orange-300 hover:bg-orange-50"
            >
              <Check className="w-4 h-4 mr-2" />
              {t?.markAllRead?.[language] || 'Tout marquer comme lu'}
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filter === 'all'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t?.filters?.all?.[language] || 'Toutes'}
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filter === 'unread'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t?.filters?.unread?.[language] || 'Non lues'}
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filter === 'read'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t?.filters?.read?.[language] || 'Lues'}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-3xl border-2 border-orange-100 shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-200/30 to-orange-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-100/40 to-orange-200/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative flex flex-col items-center justify-center py-20 px-8">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-orange-500/30 animate-pulse">
                <Bell className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                {filter === 'unread'
                  ? (t?.empty?.unreadTitle?.[language] || 'Aucune notification non lue')
                  : (t?.empty?.title?.[language] || 'Aucune notification')}
              </h3>
              <p className="text-lg text-gray-600 text-center max-w-md mb-8">
                {filter === 'unread'
                  ? (t?.empty?.unreadDescription?.[language] || 'Tu es à jour !')
                  : (t?.empty?.description?.[language] || 'Tu recevras des notifications quand de nouvelles propriétés correspondent à tes alertes')}
              </p>
              <Button
                onClick={() => router.push('/dashboard/searcher/alerts')}
                className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white hover:from-[#FF8C30] hover:to-[#FFA548] px-8 py-6 text-lg rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {t?.empty?.button?.[language] || 'Gérer mes alertes'}
              </Button>
            </div>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const badge = getNotificationBadge(notification.type);
            const IconComponent = getNotificationIcon(notification.type);
            return (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.is_read ? 'bg-orange-50 border-orange-200' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-md">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-orange-600 rounded-full" />
                          )}
                        </div>
                        <Badge className={badge.color}>
                          {badge.label}
                        </Badge>
                      </div>

                      {notification.message && (
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true,
                            locale: getDateLocale(),
                          })}
                        </p>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.id);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
