import { createClient } from '@/lib/auth/supabase-server';
import {
  Building2,
  Search,
  MapPin,
  Euro,
  Bed,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getProperties(searchQuery?: string, filterStatus?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('properties')
    .select(`
      id,
      title,
      address,
      city,
      postal_code,
      price,
      bedrooms,
      bathrooms,
      surface_area,
      status,
      created_at,
      images,
      owner_id,
      users!properties_owner_id_fkey (
        id,
        full_name,
        email
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%`);
  }

  if (filterStatus && filterStatus !== 'all') {
    query = query.eq('status', filterStatus);
  }

  const { data: properties, error } = await query;

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }

  return properties || [];
}

async function getPropertyStats() {
  const supabase = await createClient();

  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    { count: totalProperties },
    { count: activeProperties },
    { count: pendingProperties },
    { count: newThisWeek },
  ] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('properties').select('*', { count: 'exact', head: true }).gte('created_at', lastWeek.toISOString()),
  ]);

  return {
    totalProperties: totalProperties || 0,
    activeProperties: activeProperties || 0,
    pendingProperties: pendingProperties || 0,
    newThisWeek: newThisWeek || 0,
  };
}

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const [properties, stats] = await Promise.all([
    getProperties(params.search, params.status),
    getPropertyStats(),
  ]);

  const statCards = [
    {
      title: 'Total propriétés',
      value: stats.totalProperties,
      icon: Building2,
      color: 'blue',
    },
    {
      title: 'Actives',
      value: stats.activeProperties,
      icon: CheckCircle,
      color: 'green',
    },
    {
      title: 'En attente',
      value: stats.pendingProperties,
      icon: Clock,
      color: 'orange',
    },
    {
      title: 'Nouvelles (7j)',
      value: stats.newThisWeek,
      icon: Building2,
      color: 'purple',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
      green: { bg: 'bg-green-500/10', text: 'text-green-400' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
    };
    return colors[color] || colors.blue;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="bg-slate-500/20 text-slate-400 hover:bg-slate-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Inactive
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
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

      {/* Properties Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Liste des propriétés</CardTitle>
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
                  <option value="active">Active</option>
                  <option value="pending">En attente</option>
                  <option value="inactive">Inactive</option>
                </select>
                <Button type="submit" variant="outline" size="sm">
                  Filtrer
                </Button>
              </form>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Aucune propriété trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 text-left">
                    <th className="pb-3 text-sm font-medium text-slate-400">Propriété</th>
                    <th className="pb-3 text-sm font-medium text-slate-400">Propriétaire</th>
                    <th className="pb-3 text-sm font-medium text-slate-400">Prix</th>
                    <th className="pb-3 text-sm font-medium text-slate-400">Statut</th>
                    <th className="pb-3 text-sm font-medium text-slate-400">Créée le</th>
                    <th className="pb-3 text-sm font-medium text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property: any) => (
                    <tr
                      key={property.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                            {property.images?.[0] ? (
                              <img
                                src={property.images[0]}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-slate-500" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white line-clamp-1">
                              {property.title || 'Sans titre'}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              <span className="line-clamp-1">
                                {property.city || property.address || 'Adresse non renseignée'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {property.bedrooms && (
                                <span className="text-xs text-slate-500">
                                  <Bed className="w-3 h-3 inline mr-0.5" />
                                  {property.bedrooms}
                                </span>
                              )}
                              {property.surface_area && (
                                <span className="text-xs text-slate-500">
                                  {property.surface_area} m²
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="text-sm text-white">
                            {property.users?.full_name || 'N/A'}
                          </p>
                          <p className="text-xs text-slate-400">
                            {property.users?.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-sm font-medium text-white">
                          {property.price ? formatPrice(property.price) : 'N/A'}
                        </span>
                      </td>
                      <td className="py-4">
                        {getStatusBadge(property.status || 'pending')}
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-slate-300">
                          {formatDate(property.created_at)}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Link href={`/property/${property.id}`} target="_blank">
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
