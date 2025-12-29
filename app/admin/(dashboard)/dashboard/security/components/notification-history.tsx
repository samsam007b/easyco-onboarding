'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Mail, MessageSquare, Smartphone, CheckCircle, XCircle, RefreshCw, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { format } from 'date-fns';

interface NotificationLog {
  id: string;
  created_at: string;
  event_type: string;
  event_title: string;
  severity: string;
  channel: string;
  recipients: string[];
  success: boolean;
  error_message: string | null;
}

interface NotificationHistoryProps {
  initialNotifications?: NotificationLog[];
}

const CHANNEL_ICONS = {
  email: Mail,
  slack: MessageSquare,
  in_app: Bell,
  sms: Smartphone,
};

const SEVERITY_COLORS = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/30',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
};

export function NotificationHistory({ initialNotifications = [] }: NotificationHistoryProps) {
  const [notifications, setNotifications] = useState<NotificationLog[]>(initialNotifications);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/security/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialNotifications.length === 0) {
      fetchNotifications();
    }
  }, [initialNotifications.length]);

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);
  const successCount = notifications.filter(n => n.success).length;
  const failedCount = notifications.filter(n => !n.success).length;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-400" />
              Historique des Notifications
            </CardTitle>
            <CardDescription>
              {notifications.length} notifications envoyees
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchNotifications}
            disabled={loading}
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <div>
              <p className="text-xs text-green-400">Succes</p>
              <p className="text-lg font-bold text-green-400">{successCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10">
            <XCircle className="w-4 h-4 text-red-400" />
            <div>
              <p className="text-xs text-red-400">Echecs</p>
              <p className="text-lg font-bold text-red-400">{failedCount}</p>
            </div>
          </div>
        </div>

        {/* Notification List */}
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">Aucune notification envoyee</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayedNotifications.map((notification) => {
              const ChannelIcon = CHANNEL_ICONS[notification.channel as keyof typeof CHANNEL_ICONS] || Bell;
              const severityClass = SEVERITY_COLORS[notification.severity as keyof typeof SEVERITY_COLORS] || SEVERITY_COLORS.low;

              return (
                <div
                  key={notification.id}
                  className={cn(
                    'p-3 rounded-lg border transition-colors',
                    notification.success
                      ? 'bg-slate-700/30 border-slate-600/50'
                      : 'bg-red-500/5 border-red-500/20'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <div className={cn('p-1.5 rounded', notification.success ? 'bg-slate-600/50' : 'bg-red-500/20')}>
                        <ChannelIcon className={cn('w-4 h-4', notification.success ? 'text-slate-300' : 'text-red-400')} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {notification.event_title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={cn('text-xs border', severityClass)}>
                            {notification.severity}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {notification.channel}
                          </span>
                          {notification.recipients?.length > 0 && (
                            <span className="text-xs text-slate-500">
                              {notification.recipients.length} dest.
                            </span>
                          )}
                        </div>
                        {notification.error_message && (
                          <p className="text-xs text-red-400 mt-1 truncate">
                            {notification.error_message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      {notification.success ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-xs text-slate-500 mt-1">
                        {format(new Date(notification.created_at), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {notifications.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-slate-400"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Voir moins' : `Voir tout (${notifications.length})`}
                <ChevronDown className={cn('w-4 h-4 ml-2 transition-transform', showAll && 'rotate-180')} />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
