'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

const ITEMS_PER_PAGE = 20;

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

type ChannelFilter = 'all' | 'email' | 'slack' | 'in_app' | 'sms';
type StatusFilter = 'all' | 'success' | 'failed';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        channel: channelFilter,
        status: statusFilter,
      });

      const response = await fetch(`/api/admin/security/notifications?${params}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setTotalCount(data.total || 0);
      }
    } catch (error) {
      console.error('[NotificationsPage] Error loading:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  }, [page, channelFilter, statusFilter]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [channelFilter, statusFilter]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const successCount = notifications.filter(n => n.success).length;
  const failedCount = notifications.filter(n => !n.success).length;

  const channelFilters: { key: ChannelFilter; label: string }[] = [
    { key: 'all', label: 'Tous' },
    { key: 'email', label: 'Email' },
    { key: 'slack', label: 'Slack' },
    { key: 'in_app', label: 'In-App' },
    { key: 'sms', label: 'SMS' },
  ];

  const statusFilters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'Tous' },
    { key: 'success', label: 'Succes' },
    { key: 'failed', label: 'Echecs' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard/security"
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-purple-400" />
              Historique des Notifications
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {totalCount} notifications au total
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadNotifications}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
          Actualiser
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-500/10">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Envoyees avec succes</p>
              <p className="text-2xl font-bold text-green-400">{successCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-red-500/10">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Echecs d'envoi</p>
              <p className="text-2xl font-bold text-red-400">{failedCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Channel Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Canal:</span>
              <div className="flex gap-1">
                {channelFilters.map((f) => (
                  <Button
                    key={f.key}
                    variant="ghost"
                    size="sm"
                    onClick={() => setChannelFilter(f.key)}
                    className={cn(
                      'text-xs',
                      channelFilter === f.key
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Statut:</span>
              <div className="flex gap-1">
                {statusFilters.map((f) => (
                  <Button
                    key={f.key}
                    variant="ghost"
                    size="sm"
                    onClick={() => setStatusFilter(f.key)}
                    className={cn(
                      'text-xs',
                      statusFilter === f.key
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30 animate-pulse">
                  <div className="w-10 h-10 rounded bg-slate-600" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-slate-600 rounded" />
                    <div className="h-3 w-1/2 bg-slate-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Aucune notification trouvee</p>
              <p className="text-slate-500 text-sm mt-1">
                Essayez de modifier les filtres
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => {
                const ChannelIcon = CHANNEL_ICONS[notification.channel as keyof typeof CHANNEL_ICONS] || Bell;
                const severityClass = SEVERITY_COLORS[notification.severity as keyof typeof SEVERITY_COLORS] || SEVERITY_COLORS.low;

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 rounded-lg border transition-colors',
                      notification.success
                        ? 'bg-slate-700/30 border-slate-600/50'
                        : 'bg-red-500/5 border-red-500/20'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={cn('p-2 rounded', notification.success ? 'bg-slate-600/50' : 'bg-red-500/20')}>
                          <ChannelIcon className={cn('w-5 h-5', notification.success ? 'text-slate-300' : 'text-red-400')} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium">
                            {notification.event_title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge className={cn('text-xs border', severityClass)}>
                              {notification.severity}
                            </Badge>
                            <Badge className="text-xs bg-slate-600/50 text-slate-300">
                              {notification.channel}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {notification.event_type}
                            </span>
                            {notification.recipients?.length > 0 && (
                              <span className="text-xs text-slate-500">
                                {notification.recipients.length} destinataire(s)
                              </span>
                            )}
                          </div>
                          {notification.error_message && (
                            <p className="text-xs text-red-400 mt-2 bg-red-500/10 p-2 rounded">
                              {notification.error_message}
                            </p>
                          )}
                          {notification.recipients?.length > 0 && (
                            <div className="mt-2 text-xs text-slate-500">
                              <span className="font-medium">Destinataires: </span>
                              {notification.recipients.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0">
                        {notification.success ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className="text-xs text-slate-500 mt-1">
                          {format(new Date(notification.created_at), 'dd MMM HH:mm', { locale: fr })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Page {page + 1} sur {totalPages} ({totalCount} resultats)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0 || isLoading}
              className="text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Precedent
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1 || isLoading}
              className="text-slate-400 hover:text-white"
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
