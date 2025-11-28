import { createClient } from '@/lib/auth/supabase-server';
import {
  FileText,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  User,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getApplications(searchQuery?: string, filterStatus?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('applications')
    .select(`
      id,
      status,
      message,
      created_at,
      updated_at,
      property_id,
      user_id,
      properties (
        id,
        title,
        city,
        price
      ),
      users (
        id,
        full_name,
        email
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (filterStatus && filterStatus !== 'all') {
    query = query.eq('status', filterStatus);
  }

  const { data: applications, error } = await query;

  if (error) {
    console.error('Error fetching applications:', error);
    return [];
  }

  // Filter by search query if provided
  if (searchQuery && applications) {
    const search = searchQuery.toLowerCase();
    return applications.filter((app: any) => {
      const userName = app.users?.full_name?.toLowerCase() || '';
      const userEmail = app.users?.email?.toLowerCase() || '';
      const propertyTitle = app.properties?.title?.toLowerCase() || '';
      return userName.includes(search) || userEmail.includes(search) || propertyTitle.includes(search);
    });
  }

  return applications || [];
}

async function getApplicationStats() {
  const supabase = await createClient();

  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    { count: totalApplications },
    { count: pendingApplications },
    { count: acceptedApplications },
    { count: rejectedApplications },
    { count: newThisWeek },
  ] = await Promise.all([
    supabase.from('applications').select('*', { count: 'exact', head: true }),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'accepted'),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
    supabase.from('applications').select('*', { count: 'exact', head: true }).gte('created_at', lastWeek.toISOString()),
  ]);

  return {
    totalApplications: totalApplications || 0,
    pendingApplications: pendingApplications || 0,
    acceptedApplications: acceptedApplications || 0,
    rejectedApplications: rejectedApplications || 0,
    newThisWeek: newThisWeek || 0,
  };
}

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const [applications, stats] = await Promise.all([
    getApplications(params.search, params.status),
    getApplicationStats(),
  ]);

  const statCards = [
    {
      title: 'Total candidatures',
      value: stats.totalApplications,
      icon: FileText,
      color: 'purple',
    },
    {
      title: 'En attente',
      value: stats.pendingApplications,
      icon: Clock,
      color: 'orange',
    },
    {
      title: 'Acceptées',
      value: stats.acceptedApplications,
      icon: CheckCircle,
      color: 'green',
    },
    {
      title: 'Refusées',
      value: stats.rejectedApplications,
      icon: XCircle,
      color: 'red',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
      green: { bg: 'bg-green-500/10', text: 'text-green-400' },
      red: { bg: 'bg-red-500/10', text: 'text-red-400' },
    };
    return colors[color] || colors.purple;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case 'accepted':
        return (
          <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Acceptée
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Refusée
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-500/20 text-slate-400">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
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

      {/* Applications Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Liste des candidatures</CardTitle>
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
                  name="status"
                  defaultValue={params.status || 'all'}
                  className="h-10 px-3 rounded-md bg-slate-700/50 border border-slate-600 text-white text-sm"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="accepted">Acceptées</option>
                  <option value="rejected">Refusées</option>
                </select>
                <Button type="submit" variant="outline" size="sm">
                  Filtrer
                </Button>
              </form>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Aucune candidature trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 text-left">
                    <th className="pb-3 text-sm font-medium text-slate-400">Candidat</th>
                    <th className="pb-3 text-sm font-medium text-slate-400">Propriété</th>
                    <th className="pb-3 text-sm font-medium text-slate-400">Statut</th>
                    <th className="pb-3 text-sm font-medium text-slate-400">Date</th>
                    <th className="pb-3 text-sm font-medium text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application: any) => (
                    <tr
                      key={application.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-medium">
                              {application.users?.full_name?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {application.users?.full_name || 'N/A'}
                            </p>
                            <p className="text-xs text-slate-400">
                              {application.users?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="text-sm text-white line-clamp-1">
                            {application.properties?.title || 'N/A'}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>{application.properties?.city}</span>
                            {application.properties?.price && (
                              <>
                                <span>•</span>
                                <span>{formatPrice(application.properties.price)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        {getStatusBadge(application.status || 'pending')}
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-slate-300">
                          {formatDate(application.created_at)}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Link href={`/properties/${application.property_id}`} target="_blank">
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
