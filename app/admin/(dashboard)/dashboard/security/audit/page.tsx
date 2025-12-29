'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserPlus,
  LogIn,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

const ITEMS_PER_PAGE = 25;

// Security-related action patterns
const SECURITY_ACTIONS = [
  'login',
  'logout',
  'signup',
  'password',
  'mfa',
  'session',
  'permission',
  'role',
  'admin',
  'security',
  'ban',
  'unban',
  'delete',
  'verify',
  'token',
  'access',
];

function isSecurityRelated(action: string): boolean {
  return SECURITY_ACTIONS.some((pattern) => action.toLowerCase().includes(pattern));
}

function getActionIcon(action: string) {
  const lowerAction = action.toLowerCase();

  if (lowerAction.includes('login') || lowerAction.includes('session')) {
    return LogIn;
  }
  if (lowerAction.includes('signup') || lowerAction.includes('user_created')) {
    return UserPlus;
  }
  if (lowerAction.includes('admin') || lowerAction.includes('permission') || lowerAction.includes('role')) {
    return Shield;
  }
  if (lowerAction.includes('ban') || lowerAction.includes('delete') || lowerAction.includes('block')) {
    return XCircle;
  }
  if (lowerAction.includes('verify') || lowerAction.includes('approve')) {
    return CheckCircle;
  }
  if (lowerAction.includes('security') || lowerAction.includes('alert')) {
    return AlertTriangle;
  }

  return FileText;
}

function getActionColor(action: string): string {
  const lowerAction = action.toLowerCase();

  if (lowerAction.includes('login') || lowerAction.includes('session_start')) {
    return 'text-green-400 bg-green-500/10';
  }
  if (lowerAction.includes('logout') || lowerAction.includes('session_end')) {
    return 'text-slate-400 bg-slate-500/10';
  }
  if (lowerAction.includes('signup') || lowerAction.includes('created')) {
    return 'text-blue-400 bg-blue-500/10';
  }
  if (lowerAction.includes('ban') || lowerAction.includes('delete') || lowerAction.includes('block')) {
    return 'text-red-400 bg-red-500/10';
  }
  if (lowerAction.includes('admin') || lowerAction.includes('security')) {
    return 'text-purple-400 bg-purple-500/10';
  }
  if (lowerAction.includes('update') || lowerAction.includes('change')) {
    return 'text-orange-400 bg-orange-500/10';
  }

  return 'text-slate-400 bg-slate-500/10';
}

function formatAction(action: string): string {
  return action
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

type FilterType = 'all' | 'auth' | 'admin' | 'security';

export default function AuditPage() {
  const supabase = createClient();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<FilterType>('all');
  const [detailLog, setDetailLog] = useState<AuditLog | null>(null);

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('audit_logs')
        .select('id, user_id, action, resource_type, resource_id, metadata, created_at', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply filter
      if (filter === 'auth') {
        query = query.or('action.ilike.%login%,action.ilike.%logout%,action.ilike.%signup%,action.ilike.%session%');
      } else if (filter === 'admin') {
        query = query.or('action.ilike.%admin%,action.ilike.%permission%,action.ilike.%role%');
      } else if (filter === 'security') {
        query = query.or('action.ilike.%security%,action.ilike.%ban%,action.ilike.%alert%,action.ilike.%block%');
      }

      // Pagination
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      // Filter for security-related actions if showing all
      const filteredLogs = filter === 'all'
        ? (data || []).filter((log) => isSecurityRelated(log.action))
        : (data || []);

      setLogs(filteredLogs);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('[AuditPage] Error loading:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  }, [supabase, page, filter]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(0);
  }, [filter]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Tous (Securite)' },
    { key: 'auth', label: 'Authentification' },
    { key: 'admin', label: 'Admin' },
    { key: 'security', label: 'Securite' },
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
              <FileText className="w-6 h-6 text-purple-400" />
              Audit Logs
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Historique des actions de securite
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadLogs}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
          Actualiser
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Filtre:</span>
            </div>
            <div className="flex gap-1">
              {filters.map((f) => (
                <Button
                  key={f.key}
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    'text-xs',
                    filter === f.key
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
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
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Aucun log de securite</p>
              <p className="text-slate-500 text-sm mt-1">
                Les actions de securite apparaitront ici
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => {
                const ActionIcon = getActionIcon(log.action);
                const colorClass = getActionColor(log.action);

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer"
                    onClick={() => setDetailLog(log)}
                  >
                    <div className={cn('p-2 rounded-lg', colorClass)}>
                      <ActionIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-white">
                          {formatAction(log.action)}
                        </span>
                        {log.resource_type && (
                          <Badge className="text-xs bg-slate-600/50 text-slate-300">
                            {log.resource_type}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 flex-wrap">
                        <span>
                          {log.user_id ? `User: ${log.user_id.slice(0, 8)}...` : 'Systeme'}
                        </span>
                        {log.resource_id && (
                          <>
                            <span>-</span>
                            <span className="font-mono">{log.resource_id.slice(0, 8)}...</span>
                          </>
                        )}
                        <span>-</span>
                        <span>{format(new Date(log.created_at), 'dd MMM yyyy HH:mm:ss', { locale: fr })}</span>
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
            Page {page + 1} sur {totalPages}
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

      {/* Log Detail Dialog */}
      <Dialog open={!!detailLog} onOpenChange={() => setDetailLog(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Detail du log
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {detailLog?.action && formatAction(detailLog.action)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Action</p>
                <p className="text-sm text-white mt-1">{detailLog?.action}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Date</p>
                <p className="text-sm text-white mt-1">
                  {detailLog?.created_at && format(new Date(detailLog.created_at), 'dd MMM yyyy HH:mm:ss', { locale: fr })}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">User ID</p>
                <p className="text-sm text-white mt-1 font-mono">
                  {detailLog?.user_id || 'Systeme'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Resource Type</p>
                <p className="text-sm text-white mt-1">
                  {detailLog?.resource_type || '-'}
                </p>
              </div>
              {detailLog?.resource_id && (
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Resource ID</p>
                  <p className="text-sm text-white mt-1 font-mono">
                    {detailLog.resource_id}
                  </p>
                </div>
              )}
            </div>
            {detailLog?.metadata && Object.keys(detailLog.metadata).length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Metadata</p>
                <div className="p-4 bg-slate-900 rounded-lg">
                  <pre className="text-xs text-slate-400 whitespace-pre-wrap font-mono">
                    {JSON.stringify(detailLog.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Fermer</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
