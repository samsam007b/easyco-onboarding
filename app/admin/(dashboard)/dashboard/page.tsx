import { createClient } from '@/lib/auth/supabase-server';
import {
  Users,
  Building2,
  FileText,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Home,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

async function getStats() {
  const supabase = await createClient();

  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    { count: totalUsers },
    { count: totalProperties },
    { count: totalApplications },
    { count: totalMessages },
    { count: newUsersThisWeek },
    { count: newPropertiesThisWeek },
    { count: pendingApplications },
    { data: recentUsers },
    { data: recentActivity },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('applications').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', lastWeek.toISOString()),
    supabase.from('properties').select('*', { count: 'exact', head: true }).gte('created_at', lastWeek.toISOString()),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('users').select('id, email, full_name, user_type, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('audit_logs').select('id, user_id, action, resource_type, created_at, metadata').order('created_at', { ascending: false }).limit(10),
  ]);

  return {
    totalUsers: totalUsers || 0,
    totalProperties: totalProperties || 0,
    totalApplications: totalApplications || 0,
    totalMessages: totalMessages || 0,
    newUsersThisWeek: newUsersThisWeek || 0,
    newPropertiesThisWeek: newPropertiesThisWeek || 0,
    pendingApplications: pendingApplications || 0,
    recentUsers: recentUsers || [],
    recentActivity: recentActivity || [],
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const statCards = [
    {
      title: 'Utilisateurs',
      value: stats.totalUsers,
      change: stats.newUsersThisWeek,
      changeLabel: 'cette semaine',
      icon: Users,
      href: '/admin/dashboard/users',
      color: 'purple',
    },
    {
      title: 'Propriétés',
      value: stats.totalProperties,
      change: stats.newPropertiesThisWeek,
      changeLabel: 'cette semaine',
      icon: Building2,
      href: '/admin/dashboard/properties',
      color: 'blue',
    },
    {
      title: 'Applications',
      value: stats.totalApplications,
      change: stats.pendingApplications,
      changeLabel: 'en attente',
      icon: FileText,
      href: '/admin/dashboard/applications',
      color: 'orange',
    },
    {
      title: 'Messages',
      value: stats.totalMessages,
      change: null,
      changeLabel: null,
      icon: MessageSquare,
      href: '/admin/dashboard/messages',
      color: 'green',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
      green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    };
    return colors[color] || colors.purple;
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'admin_login':
      case 'admin_access':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'user_created':
        return <UserPlus className="w-4 h-4 text-blue-400" />;
      case 'property_created':
        return <Home className="w-4 h-4 text-purple-400" />;
      case 'application_submitted':
        return <FileText className="w-4 h-4 text-orange-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const colors = getColorClasses(stat.color);
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                      <p className="text-3xl font-bold text-white mt-1">
                        {stat.value.toLocaleString()}
                      </p>
                      {stat.change !== null && (
                        <p className="text-xs text-slate-500 mt-1">
                          <span className={colors.text}>+{stat.change}</span> {stat.changeLabel}
                        </p>
                      )}
                    </div>
                    <div className={`p-3 rounded-xl ${colors.bg} ${colors.border} border`}>
                      <stat.icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Nouveaux utilisateurs</CardTitle>
                <CardDescription className="text-slate-400">
                  Les 5 dernières inscriptions
                </CardDescription>
              </div>
              <Link
                href="/admin/dashboard/users"
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Voir tout →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentUsers.length > 0 ? (
                stats.recentUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium">
                        {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user.full_name || 'Sans nom'}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        user.user_type === 'owner'
                          ? 'bg-purple-500/20 text-purple-400'
                          : user.user_type === 'searcher'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {user.user_type || 'N/A'}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatTimeAgo(user.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm text-center py-4">
                  Aucun utilisateur récent
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Activité récente</CardTitle>
                <CardDescription className="text-slate-400">
                  Dernières actions enregistrées
                </CardDescription>
              </div>
              <Link
                href="/admin/dashboard/audit-logs"
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Voir tout →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity: any) => (
                  <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700/30 transition-colors">
                    <div className="mt-0.5">
                      {getActionIcon(activity.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">
                        {activity.action.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-slate-400">
                        {activity.resource_type} • {formatTimeAgo(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm text-center py-4">
                  Aucune activité récente
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/dashboard/users"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
            >
              <Users className="w-6 h-6 text-purple-400" />
              <span className="text-sm text-slate-300">Gérer utilisateurs</span>
            </Link>
            <Link
              href="/admin/dashboard/properties"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
            >
              <Building2 className="w-6 h-6 text-blue-400" />
              <span className="text-sm text-slate-300">Voir propriétés</span>
            </Link>
            <Link
              href="/admin/dashboard/applications"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
            >
              <FileText className="w-6 h-6 text-orange-400" />
              <span className="text-sm text-slate-300">Applications</span>
            </Link>
            <Link
              href="/admin/dashboard/audit-logs"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
            >
              <Clock className="w-6 h-6 text-green-400" />
              <span className="text-sm text-slate-300">Logs d'audit</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
