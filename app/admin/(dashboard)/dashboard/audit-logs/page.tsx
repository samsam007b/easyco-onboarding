import { createClient } from '@/lib/auth/supabase-server';
import {
  Activity,
  Search,
  Filter,
  Shield,
  UserPlus,
  Home,
  FileText,
  LogIn,
  AlertCircle,
  CheckCircle,
  Eye,
  Trash2,
  Edit,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

async function getAuditLogs(
  searchQuery?: string,
  filterAction?: string,
  filterResource?: string
) {
  const supabase = await createClient();

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
        id,
        email,
        full_name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(200);

  if (filterAction && filterAction !== 'all') {
    query = query.eq('action', filterAction);
  }

  if (filterResource && filterResource !== 'all') {
    query = query.eq('resource_type', filterResource);
  }

  const { data: logs, error } = await query;

  if (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }

  // Filter by search query if provided
  if (searchQuery && logs) {
    const search = searchQuery.toLowerCase();
    return logs.filter((log: any) => {
      const email = log.users?.email?.toLowerCase() || '';
      const name = log.users?.full_name?.toLowerCase() || '';
      const action = log.action?.toLowerCase() || '';
      return email.includes(search) || name.includes(search) || action.includes(search);
    });
  }

  return logs || [];
}

async function getLogStats() {
  const supabase = await createClient();

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    { count: totalLogs },
    { count: todayLogs },
    { count: weekLogs },
    { count: adminActions },
  ] = await Promise.all([
    supabase.from('audit_logs').select('*', { count: 'exact', head: true }),
    supabase.from('audit_logs').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
    supabase.from('audit_logs').select('*', { count: 'exact', head: true }).gte('created_at', lastWeek.toISOString()),
    supabase.from('audit_logs').select('*', { count: 'exact', head: true }).like('action', 'admin_%'),
  ]);

  return {
    totalLogs: totalLogs || 0,
    todayLogs: todayLogs || 0,
    weekLogs: weekLogs || 0,
    adminActions: adminActions || 0,
  };
}

export default async function AdminAuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; action?: string; resource?: string }>;
}) {
  const params = await searchParams;
  const [logs, stats] = await Promise.all([
    getAuditLogs(params.search, params.action, params.resource),
    getLogStats(),
  ]);

  const statCards = [
    {
      title: 'Total logs',
      value: stats.totalLogs,
      icon: Activity,
      color: 'purple',
    },
    {
      title: 'Aujourd\'hui',
      value: stats.todayLogs,
      icon: Calendar,
      color: 'blue',
    },
    {
      title: 'Cette semaine',
      value: stats.weekLogs,
      icon: Activity,
      color: 'green',
    },
    {
      title: 'Actions admin',
      value: stats.adminActions,
      icon: Shield,
      color: 'orange',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
      green: { bg: 'bg-green-500/10', text: 'text-green-400' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
    };
    return colors[color] || colors.purple;
  };

  const getActionIcon = (action: string) => {
    if (action.includes('login') || action.includes('access')) {
      return <LogIn className="w-4 h-4" />;
    }
    if (action.includes('create') || action.includes('user_created')) {
      return <UserPlus className="w-4 h-4" />;
    }
    if (action.includes('property')) {
      return <Home className="w-4 h-4" />;
    }
    if (action.includes('application')) {
      return <FileText className="w-4 h-4" />;
    }
    if (action.includes('view') || action.includes('read')) {
      return <Eye className="w-4 h-4" />;
    }
    if (action.includes('delete') || action.includes('ban')) {
      return <Trash2 className="w-4 h-4" />;
    }
    if (action.includes('update') || action.includes('edit')) {
      return <Edit className="w-4 h-4" />;
    }
    if (action.includes('admin')) {
      return <Shield className="w-4 h-4" />;
    }
    return <Activity className="w-4 h-4" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('login') || action.includes('access')) {
      return 'text-green-400 bg-green-500/10';
    }
    if (action.includes('create')) {
      return 'text-blue-400 bg-blue-500/10';
    }
    if (action.includes('delete') || action.includes('ban')) {
      return 'text-red-400 bg-red-500/10';
    }
    if (action.includes('update') || action.includes('edit')) {
      return 'text-orange-400 bg-orange-500/10';
    }
    if (action.includes('admin')) {
      return 'text-purple-400 bg-purple-500/10';
    }
    return 'text-slate-400 bg-slate-500/10';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAction = (action: string) => {
    return action
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Get unique actions and resource types for filters
  const uniqueActions = [...new Set(logs.map((log: any) => log.action).filter(Boolean))];
  const uniqueResources = [...new Set(logs.map((log: any) => log.resource_type).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const colors = getColorClasses(stat.color);
          return (
            <Card key={stat.title} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <stat.icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Logs Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle className="text-white">Historique des actions</CardTitle>
            <form className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="search"
                  name="search"
                  placeholder="Rechercher..."
                  defaultValue={params.search}
                  className="pl-9 w-48 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <select
                name="action"
                defaultValue={params.action || 'all'}
                className="h-10 px-3 rounded-md bg-slate-700/50 border border-slate-600 text-white text-sm"
              >
                <option value="all">Toutes les actions</option>
                {uniqueActions.map((action: string) => (
                  <option key={action} value={action}>
                    {formatAction(action)}
                  </option>
                ))}
              </select>
              <select
                name="resource"
                defaultValue={params.resource || 'all'}
                className="h-10 px-3 rounded-md bg-slate-700/50 border border-slate-600 text-white text-sm"
              >
                <option value="all">Toutes les ressources</option>
                {uniqueResources.map((resource: string) => (
                  <option key={resource} value={resource}>
                    {resource}
                  </option>
                ))}
              </select>
              <Button type="submit" variant="outline" size="sm">
                Filtrer
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Aucun log trouvé</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-700/30 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">
                        {formatAction(log.action)}
                      </span>
                      {log.resource_type && (
                        <Badge className="bg-slate-600/50 text-slate-300 text-xs">
                          {log.resource_type}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      {log.users ? (
                        <>
                          <span>{log.users.full_name || log.users.email}</span>
                          <span>•</span>
                        </>
                      ) : (
                        <>
                          <span className="text-slate-500">Système</span>
                          <span>•</span>
                        </>
                      )}
                      <span>{formatDate(log.created_at)}</span>
                      {log.resource_id && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500 font-mono">
                            {log.resource_id.slice(0, 8)}...
                          </span>
                        </>
                      )}
                    </div>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <details className="mt-2">
                        <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400">
                          Voir les détails
                        </summary>
                        <pre className="mt-1 p-2 bg-slate-900/50 rounded text-xs text-slate-400 overflow-x-auto">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
