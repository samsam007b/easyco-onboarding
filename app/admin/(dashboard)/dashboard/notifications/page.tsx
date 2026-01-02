import { createClient } from '@/lib/auth/supabase-server';
import {
  Bell,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Send,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

async function getNotifications() {
  const supabase = await createClient();

  const { data: notifications, error } = await supabase
    .from('notifications')
    .select(`
      id,
      user_id,
      type,
      title,
      message,
      read,
      created_at,
      users (
        id,
        full_name,
        email
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return notifications || [];
}

async function getNotificationStats() {
  const supabase = await createClient();

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    { count: totalNotifications },
    { count: unreadNotifications },
    { count: todayNotifications },
    { count: weekNotifications },
  ] = await Promise.all([
    supabase.from('notifications').select('*', { count: 'exact', head: true }),
    supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('read', false),
    supabase.from('notifications').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
    supabase.from('notifications').select('*', { count: 'exact', head: true }).gte('created_at', lastWeek.toISOString()),
  ]);

  return {
    totalNotifications: totalNotifications || 0,
    unreadNotifications: unreadNotifications || 0,
    todayNotifications: todayNotifications || 0,
    weekNotifications: weekNotifications || 0,
  };
}

export default async function AdminNotificationsPage() {
  const [notifications, stats] = await Promise.all([
    getNotifications(),
    getNotificationStats(),
  ]);

  const statCards = [
    {
      title: 'Total notifications',
      value: stats.totalNotifications,
      icon: Bell,
      color: 'purple',
    },
    {
      title: 'Unread',
      value: stats.unreadNotifications,
      icon: AlertCircle,
      color: 'orange',
    },
    {
      title: 'Today',
      value: stats.todayNotifications,
      icon: Clock,
      color: 'blue',
    },
    {
      title: 'This week',
      value: stats.weekNotifications,
      icon: Calendar,
      color: 'green',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
      green: { bg: 'bg-green-500/10', text: 'text-green-400' },
    };
    return colors[color] || colors.purple;
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'message':
        return <Badge className="bg-blue-500/20 text-blue-400">Message</Badge>;
      case 'application':
        return <Badge className="bg-purple-500/20 text-purple-400">Application</Badge>;
      case 'property':
        return <Badge className="bg-green-500/20 text-green-400">Property</Badge>;
      case 'system':
        return <Badge className="bg-slate-500/20 text-slate-400">System</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400">{type}</Badge>;
    }
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

      {/* Notifications List */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Recent notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No notifications found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                    notification.read
                      ? 'bg-slate-700/20 hover:bg-slate-700/30'
                      : 'bg-slate-700/40 hover:bg-slate-700/50 border-l-2 border-purple-500'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${notification.read ? 'bg-slate-600/30' : 'bg-purple-500/20'}`}>
                    <Bell className={`w-4 h-4 ${notification.read ? 'text-slate-400' : 'text-purple-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-white">
                        {notification.title || 'Notification'}
                      </p>
                      {getTypeBadge(notification.type)}
                      {!notification.read && (
                        <Badge className="bg-purple-500/20 text-purple-400 text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <span>{notification.users?.full_name || notification.users?.email || 'User'}</span>
                      <span>•</span>
                      <span>{formatDate(notification.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Send Notification Card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Send className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                Send notifications
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Send group notifications to all users or specific groups.
              </p>
              <Button disabled className="bg-purple-600 hover:bg-purple-700 text-white">
                Coming soon
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
