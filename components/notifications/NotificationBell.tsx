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
  switch (type) {
    case 'message': return 'from-blue-500 to-blue-700';
    case 'payment': return 'from-green-500 to-green-700';
    case 'member': return 'from-purple-500 to-purple-700';
    case 'property': return 'from-orange-500 to-orange-700';
    case 'application': return 'from-yellow-500 to-yellow-700';
    case 'task': return 'from-pink-500 to-pink-700';
    case 'system': return 'from-gray-500 to-gray-700';
    default: return 'from-gray-500 to-gray-700';
  }
};

export default function NotificationBell() {
  const router = useRouter();
  const { notifications, stats, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
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
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {stats.unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
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
            className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                {stats.unreadCount > 0 && (
                  <Button
                    onClick={markAllAsRead}
                    variant="ghost"
                    size="sm"
                    className="text-xs rounded-full"
                  >
                    <CheckCheck className="w-3 h-3 mr-1" />
                    Tout marquer lu
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span>{stats.unreadCount} non lues</span>
                <span>•</span>
                <span>{stats.todayCount} aujourd'hui</span>
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
                          "p-4 hover:bg-gray-50 transition-colors cursor-pointer group",
                          !notification.isRead && "bg-blue-50/30"
                        )}
                        onClick={() => handleNotificationClick(notification.id, notification.actionUrl)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
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
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
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
                                <span className="text-xs text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
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
                                className="p-1 hover:bg-white rounded-lg transition-colors"
                                title="Marquer comme lu"
                              >
                                <Check className="w-4 h-4 text-green-600" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-1 hover:bg-white rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <X className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Aucune notification
                  </p>
                  <p className="text-xs text-gray-500">
                    Vous êtes à jour!
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {recentNotifications.length > 0 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/notifications');
                  }}
                  variant="ghost"
                  className="w-full rounded-full text-sm font-medium"
                >
                  Voir toutes les notifications
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
