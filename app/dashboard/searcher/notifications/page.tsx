'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { AlertsService } from '@/lib/services/alerts-service';
import { PropertyNotification } from '@/types/alerts.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, Filter, Home, DollarSign, FileText, Heart, Sparkles, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr, enGB, de, nl } from 'date-fns/locale';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  SearcherPageHeader,
  SearcherKPICard,
  SearcherKPIGrid,
  searcherGradientVibrant,
  searcherGradientLight,
  searcherAnimations,
} from '@/components/searcher';

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
      toast.error(t?.messages?.loadError?.[language] || 'Error loading notifications');
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
      toast.success(t?.messages?.allMarkedRead?.[language] || 'All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error(t?.messages?.markError?.[language] || 'Error marking notifications');
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await alertsService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      toast.success(t?.messages?.deleted?.[language] || 'Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error(t?.messages?.deleteError?.[language] || 'Error deleting notification');
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
        return { label: t?.types?.newProperty?.[language] || 'New property', color: 'bg-green-100 text-green-700' };
      case 'price_drop':
        return { label: t?.types?.priceDrop?.[language] || 'Price drop', color: 'bg-blue-100 text-blue-700' };
      case 'status_change':
        return { label: t?.types?.statusChange?.[language] || 'Status change', color: 'bg-gray-100 text-gray-700' };
      case 'new_match':
        return { label: t?.types?.newMatch?.[language] || 'New match', color: 'bg-pink-100 text-pink-700' };
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Chargement de vos notifications...'}</p>
        </div>
      </div>
    );
  }

  const readCount = notifications.filter((n) => n.is_read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          {...searcherAnimations.fadeInUp}
          className="space-y-6"
        >
          {/* Header */}
          <SearcherPageHeader
            icon={Bell}
            title={t?.title?.[language] || 'Notifications'}
            subtitle={unreadCount > 0
              ? `${unreadCount} ${unreadCount > 1 ? (t?.unreadCount?.plural?.[language] || 'notifications non lues') : (t?.unreadCount?.singular?.[language] || 'notification non lue')}`
              : (t?.noUnread?.[language] || 'Aucune notification non lue')
            }
            breadcrumb={{ label: 'Accueil', href: '/dashboard/searcher' }}
            currentPage="Notifications"
            actions={
              unreadCount > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  variant="outline"
                  className="rounded-2xl border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {t?.markAllRead?.[language] || 'Tout marquer comme lu'}
                </Button>
              )
            }
          />

          {/* Stats KPIs */}
          <SearcherKPIGrid columns={3}>
            <SearcherKPICard
              title="Total"
              value={notifications.length}
              icon={Bell}
              variant="primary"
            />
            <SearcherKPICard
              title={t?.stats?.unread?.[language] || 'Non lues'}
              value={unreadCount}
              icon={Clock}
              variant="warning"
            />
            <SearcherKPICard
              title={t?.stats?.read?.[language] || 'Lues'}
              value={readCount}
              icon={CheckCircle}
              variant="success"
            />
          </SearcherKPIGrid>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <Filter className="w-4 h-4 text-gray-500" />
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filter === 'all'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t?.filters?.all?.[language] || 'Toutes'}
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filter === 'unread'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t?.filters?.unread?.[language] || 'Non lues'}
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filter === 'read'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t?.filters?.read?.[language] || 'Lues'}
              </button>
            </div>
          </motion.div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <motion.div
              {...searcherAnimations.cardHover}
              className="relative overflow-hidden rounded-3xl border-2 border-amber-100 shadow-lg"
              style={{ background: searcherGradientLight }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20" style={{ background: searcherGradientVibrant }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 opacity-10" style={{ background: searcherGradientVibrant }} />

              <div className="relative flex flex-col items-center justify-center py-20 px-8">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                  style={{ background: searcherGradientVibrant, boxShadow: '0 12px 32px rgba(255, 140, 32, 0.3)' }}
                >
                  <Bell className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  {filter === 'unread'
                    ? (t?.empty?.unreadTitle?.[language] || 'Aucune notification non lue')
                    : (t?.empty?.title?.[language] || 'Aucune notification')}
                </h3>
                <p className="text-lg text-gray-600 text-center max-w-md mb-8">
                  {filter === 'unread'
                    ? (t?.empty?.unreadDescription?.[language] || 'Vous êtes à jour !')
                    : (t?.empty?.description?.[language] || 'Vous recevrez des notifications quand de nouvelles propriétés correspondront à vos alertes')}
                </p>
                <Button
                  onClick={() => router.push('/dashboard/searcher/alerts')}
                  className="text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  style={{ background: searcherGradientVibrant, boxShadow: '0 8px 24px rgba(255, 140, 32, 0.3)' }}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t?.empty?.button?.[language] || 'Gérer mes alertes'}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
              className="space-y-3"
            >
              {filteredNotifications.map((notification) => {
                const badge = getNotificationBadge(notification.type);
                const IconComponent = getNotificationIcon(notification.type);
                return (
                  <motion.div
                    key={notification.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md bg-white/80 backdrop-blur-sm border-gray-200 rounded-2xl ${
                        !notification.is_read ? 'bg-amber-50/80 border-amber-200' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {/* Icon */}
                          <div className="flex-shrink-0">
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                              style={{ background: searcherGradientVibrant }}
                            >
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
                                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
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
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
