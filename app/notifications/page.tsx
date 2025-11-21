'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  MessageCircle,
  Heart,
  Home,
  Users,
  FileText,
  ArrowLeft,
  Filter,
  X
} from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';
import { useNotifications } from '@/lib/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function NotificationsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [userId, setUserId] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications,
  } = useNotifications(userId);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      router.push('/login');
      return;
    }

    setUserId(user.id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-6 h-6 text-blue-500" />;
      case 'application':
        return <FileText className="w-6 h-6 text-green-500" />;
      case 'group':
        return <Users className="w-6 h-6 text-purple-500" />;
      case 'property':
        return <Home className="w-6 h-6 text-orange-500" />;
      case 'system':
        return <Bell className="w-6 h-6 text-gray-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleMarkAllAsRead = async () => {
    const success = await markAllAsRead();
    if (success) {
      toast.success('Toutes les notifications ont été marquées comme lues');
    } else {
      toast.error('Erreur lors du marquage des notifications');
    }
  };

  const handleClearRead = async () => {
    const success = await clearReadNotifications();
    if (success) {
      toast.success('Notifications lues supprimées');
    } else {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    const success = await deleteNotification(notificationId);
    if (success) {
      toast.success('Notification supprimée');
    } else {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(n => {
    // Filter by read status
    if (filter === 'unread' && n.read) return false;
    if (filter === 'read' && !n.read) return false;

    // Filter by type
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;

    return true;
  });

  // Get unique notification types
  const notificationTypes = Array.from(new Set(notifications.map(n => n.type)));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600">Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-[#4A148C] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour</span>
              </button>

              <div className="h-6 w-px bg-gray-300" />

              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-[#4A148C]" />
                <h1 className="text-2xl font-bold text-[#4A148C]">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtres
              </Button>

              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Tout marquer comme lu
                </Button>
              )}

              {notifications.some(n => n.read) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearRead}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer les lues
                </Button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-6">
                {/* Read Status Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Statut:</span>
                  <div className="flex gap-2">
                    {(['all', 'unread', 'read'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          filter === f
                            ? 'bg-[#4A148C] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {f === 'all' && 'Toutes'}
                        {f === 'unread' && 'Non lues'}
                        {f === 'read' && 'Lues'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                {notificationTypes.length > 1 && (
                  <>
                    <div className="h-6 w-px bg-gray-300" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Type:</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setTypeFilter('all')}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            typeFilter === 'all'
                              ? 'bg-[#4A148C] text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Tous
                        </button>
                        {notificationTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors capitalize ${
                              typeFilter === type
                                ? 'bg-[#4A148C] text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'unread' && 'Aucune notification non lue'}
              {filter === 'read' && 'Aucune notification lue'}
              {filter === 'all' && 'Aucune notification'}
            </h2>
            <p className="text-gray-600">
              {filter === 'unread' && 'Toutes vos notifications ont été lues'}
              {filter === 'read' && 'Vous n\'avez pas encore lu de notifications'}
              {filter === 'all' && 'Vous recevrez vos notifications ici'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-2xl shadow hover:shadow-lg transition-all cursor-pointer p-5 ${
                  !notification.read ? 'border-2 border-[#4A148C]' : 'border border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                    !notification.read ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 ${
                          !notification.read ? 'text-[#4A148C]' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.created_at)}
                          </span>
                          {!notification.read && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#4A148C]">
                              <div className="w-2 h-2 bg-[#4A148C] rounded-full" />
                              Non lu
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors group"
                            title="Marquer comme lu"
                          >
                            <Check className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(e, notification.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (for future pagination) */}
        {filteredNotifications.length >= 50 && (
          <div className="mt-6 text-center">
            <Button variant="outline" className="w-full sm:w-auto">
              Charger plus
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
