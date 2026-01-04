'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  X,
  ArrowRight,
  Mail,
  DollarSign,
  Users,
  Home,
  AlertCircle,
  Settings
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { NotificationType } from '@/types/notification.types';
import { useLanguage } from '@/lib/i18n/use-language';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'message': return Mail;
    case 'payment': return DollarSign;
    case 'member': return Users;
    case 'property': return Home;
    case 'application': return Users;
    case 'task': return CheckCheck;
    case 'system': return Settings;
    default: return AlertCircle;
  }
};

const getNotificationColor = (type: NotificationType) => {
  // Use V3 Option C gradient colors for all notification types
  switch (type) {
    case 'message': return 'from-[#e05747] to-[#ff651e]';
    case 'payment': return 'from-[#ff651e] to-[#ff9014]';
    case 'member': return 'from-[#e05747] via-[#ff651e] to-[#ff9014]';
    case 'property': return 'from-[#e05747] to-[#ff651e]';
    case 'application': return 'from-[#ff651e] to-[#ff9014]';
    case 'task': return 'from-[#e05747] to-[#ff9014]';
    case 'system': return 'from-[#e05747] to-[#ff651e]';
    default: return 'from-[#e05747] to-[#ff9014]';
  }
};

export default function NotificationBell() {
  const router = useRouter();
  const { notifications, stats, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const { language, getSection } = useLanguage();
  const ariaLabels = getSection('ariaLabels');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notificationId: string, actionUrl?: string) => {
    await markAsRead(notificationId);
    if (actionUrl) {
      setIsOpen(false);
      router.push(actionUrl);
    }
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full transition-colors"
        style={{ background: 'transparent' }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(217, 87, 79, 0.08) 0%, rgba(255, 128, 23, 0.08) 100%)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <Bell className="w-5 h-5" style={{ color: '#ff651e' }} />
        {stats.unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs font-bold rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)' }}
          >
            {stats.unreadCount > 9 ? '9+' : stats.unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white superellipse-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                {stats.unreadCount > 0 && (
                  <Button
                    onClick={markAllAsRead}
                    variant="ghost"
                    size="sm"
                    className="text-xs rounded-full hover:bg-[#fff5f3]"
                    style={{ color: '#ff651e' }}
                  >
                    <CheckCheck className="w-3 h-3 mr-1" />
                    Mark all read
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span style={{ color: '#ff651e' }} className="font-medium">{stats.unreadCount} unread</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{stats.todayCount} today</span>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {recentNotifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {recentNotifications.map((notification, index) => {
                    const Icon = getNotificationIcon(notification.type);
                    const colorClass = getNotificationColor(notification.type);

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "p-4 transition-colors cursor-pointer group",
                          !notification.isRead && "bg-gradient-to-r from-[#fff5f3] to-white"
                        )}
                        style={{ background: notification.isRead ? 'transparent' : undefined }}
                        onMouseEnter={(e) => {
                          if (notification.isRead) {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(217, 87, 79, 0.04) 0%, rgba(255, 128, 23, 0.04) 100%)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (notification.isRead) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                        onClick={() => handleNotificationClick(notification.id, notification.actionUrl)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className={cn(
                            "w-10 h-10 superellipse-xl flex items-center justify-center flex-shrink-0",
                            `bg-gradient-to-br ${colorClass}`
                          )}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="font-semibold text-sm text-gray-900 line-clamp-1">
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: '#ff651e' }} />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              {notification.actionLabel && (
                                <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#ff651e' }}>
                                  {notification.actionLabel} →
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="p-1 hover:bg-white superellipse-lg transition-colors"
                                title={ariaLabels?.markAsRead?.[language] || 'Mark as read'}
                              >
                                <Check className="w-4 h-4" style={{ color: '#10b981' }} />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-1 hover:bg-white superellipse-lg transition-colors"
                              title={ariaLabels?.delete?.[language] || 'Delete'}
                            >
                              <X className="w-4 h-4" style={{ color: '#ff651e' }} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 px-8 text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, rgba(224, 87, 71, 0.12) 0%, rgba(255, 144, 20, 0.12) 100%)' }}>
                    <Bell className="w-9 h-9" style={{ color: '#ff651e' }} />
                  </div>
                  <p className="text-base font-semibold text-gray-900 mb-1">
                    No notifications
                  </p>
                  <p className="text-sm text-gray-500">
                    You're all caught up!
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {recentNotifications.length > 0 && (
              <div className="p-3 border-t border-gray-100">
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/notifications');
                  }}
                  variant="ghost"
                  className="w-full superellipse-xl text-sm font-medium hover:bg-[#fff5f3]"
                  style={{ color: '#ff651e' }}
                >
                  See all notifications
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
