'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, Trash2, MessageCircle, Heart, Home, X } from 'lucide-react';
import { useNotifications } from '@/lib/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { useLanguage } from '@/lib/i18n/use-language';

interface NotificationsDropdownProps {
  userId: string;
}

export default function NotificationsDropdown({ userId }: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { getSection } = useLanguage();

  // Traductions
  const notificationsT = getSection('notifications');

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications,
  } = useNotifications(userId);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'favorite':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'property_update':
        return <Home className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return notificationsT?.time?.justNow || 'Just now';
    if (minutes < 60) return `${minutes}${notificationsT?.time?.minutesAgo || 'm ago'}`;
    if (hours < 24) return `${hours}${notificationsT?.time?.hoursAgo || 'h ago'}`;
    if (days < 7) return `${days}${notificationsT?.time?.daysAgo || 'd ago'}`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = async (notification: any) => {
    // Mark as read if unread
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate to action URL if exists
    if (notification.action_url) {
      setIsOpen(false);
      router.push(notification.action_url);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleClearRead = async () => {
    await clearReadNotifications();
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 superellipse-lg transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white superellipse-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-yellow-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">{notificationsT?.title || 'Notifications'}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/50 superellipse-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {unreadCount > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                >
                  <Check className="w-3 h-3 mr-1" />
                  {notificationsT?.markAllRead || 'Mark all read'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClearRead}
                  className="text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  {notificationsT?.clearRead || 'Clear read'}
                </Button>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <LoadingHouse size={32} />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">{notificationsT?.noNotifications || 'No notifications yet'}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors relative ${
                      !notification.read ? 'bg-purple-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="font-semibold text-gray-900 text-sm">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400">
                            {formatTimestamp(notification.created_at)}
                          </p>
                          <button
                            onClick={(e) => handleDelete(e, notification.id)}
                            className="p-1 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/notifications');
                }}
                className="w-full text-center text-sm text-[#4A148C] font-semibold hover:text-[#311B92] transition-colors"
              >
                {notificationsT?.viewAll || 'View all notifications'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
