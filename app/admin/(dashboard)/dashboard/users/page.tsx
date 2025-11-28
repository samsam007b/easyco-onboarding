import { createClient } from '@/lib/auth/supabase-server';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Ban,
  CheckCircle,
  Shield,
  Mail,
  Calendar,
  UserCheck,
  UserX,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import UsersTable from '@/components/admin/UsersTable';

async function getUsers(searchQuery?: string, filterType?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('users')
    .select(`
      id,
      email,
      full_name,
      user_type,
      onboarding_completed,
      created_at,
      user_profiles (
        profile_photo,
        phone
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (searchQuery) {
    query = query.or(`email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`);
  }

  if (filterType && filterType !== 'all') {
    query = query.eq('user_type', filterType);
  }

  const { data: users, error } = await query;

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return users || [];
}

async function getUserStats() {
  const supabase = await createClient();

  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    { count: totalUsers },
    { count: activeUsers },
    { count: newThisWeek },
    { count: owners },
    { count: searchers },
    { count: residents },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('onboarding_completed', true),
    supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', lastWeek.toISOString()),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('user_type', 'owner'),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('user_type', 'searcher'),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('user_type', 'resident'),
  ]);

  return {
    totalUsers: totalUsers || 0,
    activeUsers: activeUsers || 0,
    newThisWeek: newThisWeek || 0,
    owners: owners || 0,
    searchers: searchers || 0,
    residents: residents || 0,
  };
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string }>;
}) {
  const params = await searchParams;
  const [users, stats] = await Promise.all([
    getUsers(params.search, params.type),
    getUserStats(),
  ]);

  const statCards = [
    {
      title: 'Total utilisateurs',
      value: stats.totalUsers,
      icon: Users,
      color: 'purple',
    },
    {
      title: 'Profils complets',
      value: stats.activeUsers,
      icon: UserCheck,
      color: 'green',
    },
    {
      title: 'Nouveaux (7j)',
      value: stats.newThisWeek,
      icon: Calendar,
      color: 'blue',
    },
  ];

  const typeStats = [
    { label: 'Propriétaires', value: stats.owners, color: 'bg-purple-500' },
    { label: 'Chercheurs', value: stats.searchers, color: 'bg-orange-500' },
    { label: 'Résidents', value: stats.residents, color: 'bg-blue-500' },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
      green: { bg: 'bg-green-500/10', text: 'text-green-400' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

      {/* Type Distribution */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm font-medium">
            Répartition par type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {typeStats.map((type) => (
              <div key={type.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${type.color}`} />
                <span className="text-sm text-slate-300">{type.label}</span>
                <span className="text-sm font-medium text-white">{type.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Liste des utilisateurs</CardTitle>
            <div className="flex items-center gap-2">
              <form className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="search"
                    name="search"
                    placeholder="Rechercher..."
                    defaultValue={params.search}
                    className="pl-9 w-64 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <select
                  name="type"
                  defaultValue={params.type || 'all'}
                  className="h-10 px-3 rounded-md bg-slate-700/50 border border-slate-600 text-white text-sm"
                >
                  <option value="all">Tous les types</option>
                  <option value="owner">Propriétaires</option>
                  <option value="searcher">Chercheurs</option>
                  <option value="resident">Résidents</option>
                </select>
                <Button type="submit" variant="outline" size="sm">
                  Filtrer
                </Button>
              </form>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <UsersTable users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
