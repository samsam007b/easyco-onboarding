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

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

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
      toast.success('All notifications marked as read');
    } else {
      toast.error('Error marking notifications');
    }
  };

  const handleClearRead = async () => {
    const success = await clearReadNotifications();
    if (success) {
      toast.success('Read notifications deleted');
    } else {
      toast.error('Error deleting notifications');
    }
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    const success = await deleteNotification(notificationId);
    if (success) {
      toast.success('Notification deleted');
    } else {
      toast.error('Error deleting');
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
          <p className="text-gray-600">Loading notifications...</p>
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
                <span>Back</span>
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
                Filters
              </Button>

              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all as read
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
                  Delete read
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
                  <span className="text-sm font-medium text-gray-700">Status:</span>
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
                        {f === 'all' && 'All'}
                        {f === 'unread' && 'Unread'}
                        {f === 'read' && 'Read'}
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
                          All
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
              {filter === 'unread' && 'No unread notifications'}
              {filter === 'read' && 'No read notifications'}
              {filter === 'all' && 'No notifications'}
            </h2>
            <p className="text-gray-600">
              {filter === 'unread' && 'All your notifications have been read'}
              {filter === 'read' && 'You haven\'t read any notifications yet'}
              {filter === 'all' && 'You will receive your notifications here'}
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
                              Unread
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
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(e, notification.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                          title="Delete"
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
              Load more
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
