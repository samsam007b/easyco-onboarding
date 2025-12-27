'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import {
  FileText,
  Shield,
  UserPlus,
  LogIn,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
  users?: {
    email: string;
    full_name: string | null;
  };
}

interface SecurityAuditLogsProps {
  maxLogs?: number;
}

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

function formatDate(date: string): string {
  const now = new Date();
  const logDate = new Date(date);
  const diffMs = now.getTime() - logDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return 'A l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins}min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;

  return logDate.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatAction(action: string): string {
  return action
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function SecurityAuditLogs({ maxLogs = 10 }: SecurityAuditLogsProps) {
  const supabase = createClient();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'auth' | 'admin' | 'security'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('audit_logs')
        .select(`
          id,
          user_id,
          action,
          resource_type,
          resource_id,
          metadata,
          created_at,
          users (
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      // Apply filter
      if (filter === 'auth') {
        query = query.or('action.ilike.%login%,action.ilike.%logout%,action.ilike.%signup%,action.ilike.%session%');
      } else if (filter === 'admin') {
        query = query.or('action.ilike.%admin%,action.ilike.%permission%,action.ilike.%role%');
      } else if (filter === 'security') {
        query = query.or('action.ilike.%security%,action.ilike.%ban%,action.ilike.%alert%,action.ilike.%block%');
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter for security-related actions and limit
      const securityLogs = (data || [])
        .filter((log) => isSecurityRelated(log.action))
        .slice(0, maxLogs);

      setLogs(securityLogs);
    } catch (error) {
      console.error('[SecurityAuditLogs] Error loading logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, filter, maxLogs]);

  // Subscribe to real-time updates
  useEffect(() => {
    loadLogs();

    const channel = supabase
      .channel('security-audit-logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'audit_logs' },
        (payload) => {
          const newLog = payload.new as AuditLog;
          if (isSecurityRelated(newLog.action)) {
            setLogs((prev) => [newLog, ...prev.slice(0, maxLogs - 1)]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadLogs, supabase, maxLogs]);

  const filters = [
    { key: 'all', label: 'Tous' },
    { key: 'auth', label: 'Auth' },
    { key: 'admin', label: 'Admin' },
    { key: 'security', label: 'Securite' },
  ] as const;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            Audit Logs Securite
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-slate-400 hover:text-white"
              >
                <Filter className="w-4 h-4 mr-2" />
                {filters.find((f) => f.key === filter)?.label}
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              {showFilters && (
                <div className="absolute right-0 top-full mt-1 bg-slate-700 rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
                  {filters.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => {
                        setFilter(f.key);
                        setShowFilters(false);
                      }}
                      className={cn(
                        'w-full px-4 py-2 text-sm text-left hover:bg-slate-600 transition-colors',
                        filter === f.key ? 'text-emerald-400' : 'text-slate-300'
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadLogs}
              disabled={isLoading}
              className="text-slate-400 hover:text-white"
            >
              <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-slate-600" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-slate-600 rounded" />
                  <div className="h-3 w-1/2 bg-slate-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">Aucun log de securite</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {logs.map((log) => {
              const ActionIcon = getActionIcon(log.action);
              const colorClass = getActionColor(log.action);

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                >
                  <div className={cn('p-2 rounded-lg', colorClass)}>
                    <ActionIcon className="w-4 h-4" />
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
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span>
                        {log.users?.full_name || log.users?.email || 'Systeme'}
                      </span>
                      <span>-</span>
                      <span>{formatDate(log.created_at)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
