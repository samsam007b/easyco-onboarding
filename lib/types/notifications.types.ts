/**
 * Notification Types for Izzico
 * Defines all types related to the notification system
 * Compatible with existing NotificationContext.tsx and database schema
 */

// NotificationType matching the database enum
export type NotificationType =
  | 'application'
  | 'message'
  | 'payment'
  | 'task'
  | 'member'
  | 'property'
  | 'system';

// Database row format (snake_case)
export interface NotificationRow {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  action_url: string | null;
  action_label: string | null;
  is_read: boolean;
  created_at: string;
  image_url: string | null;
  metadata: Record<string, unknown>;
}

// Client format (camelCase) - matches existing NotificationContext
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  isRead: boolean;
  createdAt: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
}

// Convert database row to client format
export function toNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    message: row.message,
    actionUrl: row.action_url || undefined,
    actionLabel: row.action_label || undefined,
    isRead: row.is_read,
    createdAt: row.created_at,
    imageUrl: row.image_url || undefined,
    metadata: row.metadata || undefined,
  };
}

export interface NotificationStats {
  unreadCount: number;
  todayCount: number;
  totalCount: number;
}

export interface CreateNotificationParams {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  action_url?: string;
  action_label?: string;
  image_url?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationFilters {
  type?: NotificationType | NotificationType[];
  read?: boolean;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
}

// UI specific types
export interface NotificationUIProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

// Notification icon mapping (using Lucide icon names)
export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  application: 'user-plus',
  message: 'message-circle',
  payment: 'credit-card',
  task: 'clipboard-list',
  member: 'users',
  property: 'home',
  system: 'bell',
};

// Notification color mapping (for badges/icons) - V3-fun design
export const NOTIFICATION_COLORS: Record<NotificationType, string> = {
  application: 'bg-indigo-100 text-indigo-600',
  message: 'bg-violet-100 text-violet-600',
  payment: 'bg-emerald-100 text-emerald-600',
  task: 'bg-blue-100 text-blue-600',
  member: 'bg-amber-100 text-amber-600',
  property: 'bg-orange-100 text-orange-600',
  system: 'bg-gray-100 text-gray-600',
};
