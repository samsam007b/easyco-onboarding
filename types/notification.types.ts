export type NotificationType =
  | 'application'
  | 'message'
  | 'payment'
  | 'task'
  | 'member'
  | 'property'
  | 'system';

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
  metadata?: Record<string, any>;
}

export interface NotificationStats {
  unreadCount: number;
  todayCount: number;
  totalCount: number;
}
