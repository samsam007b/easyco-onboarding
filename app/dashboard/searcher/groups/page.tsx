'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, MessageCircle, MapPin, Euro, Calendar, Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';

interface Group {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  budget_min: number | null;
  budget_max: number | null;
  preferred_location: string | null;
  move_in_date: string | null;
  member_count?: number;
  created_at: string;
}

export default function GroupsPage() {
  const router = useRouter();
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [discoverGroups, setDiscoverGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        // Load user's groups from group_members table
        const { data: groupMemberships, error: membershipsError } = await supabase
          .from('group_members')
          .select('group_id, groups(*)')
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (!membershipsError && groupMemberships) {
          const userGroups = groupMemberships.map(m => m.groups).filter(Boolean) as any[];

          // Get member counts for each group
          const groupsWithCounts = await Promise.all(
            userGroups.map(async (group: any) => {
              const { count } = await supabase
                .from('group_members')
                .select('*', { count: 'exact', head: true })
                .eq('group_id', group.id)
                .eq('status', 'active');

              return { ...group, member_count: count || 0 };
            })
          );

          setMyGroups(groupsWithCounts);
        }

        // Load discover groups (public groups user is not part of)
        const { data: allGroups, error: groupsError } = await supabase
          .from('groups')
          .select('*')
          .eq('is_public', true)
          .limit(6);

        if (!groupsError && allGroups) {
          // Filter out groups user is already in
          const userGroupIds = new Set(myGroups.map(g => g.id));
          const filteredGroups = allGroups.filter(g => !userGroupIds.has(g.id));

          // Get member counts
          const groupsWithCounts = await Promise.all(
            filteredGroups.map(async (group: any) => {
              const { count } = await supabase
                .from('group_members')
                .select('*', { count: 'exact', head: true })
                .eq('group_id', group.id)
                .eq('status', 'active');

              return { ...group, member_count: count || 1 };
            })
          );

          setDiscoverGroups(groupsWithCounts);
        }

        setIsLoading(false);
      } catch (error) {
        logger.error('Failed to load groups page data', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Budget flexible';
    if (!min) return `Jusqu'à €${max}`;
    if (!max) return `À partir de €${min}`;
    return `€${min}-${max}`;
  };

  const formatMoveInDate = (date: string | null) => {
    if (!date) return 'Flexible';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Recherchez en Groupe
              </h1>
              <p className="text-xl text-orange-50 max-w-2xl mx-auto mb-8">
                Trouvez des colocataires, partagez les frais et cherchez le logement parfait ensemble
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={() => router.push('/groups/create')}
                  className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all gap-2 group"
                  size="lg"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  Créer un groupe
                </Button>
                <Button
                  onClick={() => router.push('/groups/browse')}
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 font-semibold px-8 py-6 rounded-2xl gap-2"
                  size="lg"
                >
                  <Search className="w-5 h-5" />
                  Parcourir les groupes
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

          {/* My Groups Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Mes Groupes</h2>
                <p className="text-gray-600 mt-1">Vos groupes de recherche actifs</p>
              </div>
              {myGroups.length > 0 && (
                <Badge className="bg-orange-100 text-orange-700 px-4 py-2 text-base hover:bg-orange-100">
                  {myGroups.length} {myGroups.length > 1 ? 'groupes' : 'groupe'}
                </Badge>
              )}
            </div>

            {myGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="rounded-3xl shadow-lg hover:shadow-2xl transition-all cursor-pointer border-orange-100 hover:border-orange-300 group overflow-hidden"
                    onClick={() => router.push(`/groups/${group.id}`)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <CardHeader className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-md">
                            <Users className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                              {group.name}
                            </CardTitle>
                            <p className="text-sm text-gray-500">{group.member_count} membres</p>
                          </div>
                        </div>
                      </div>
                      {group.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                          {group.description}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent className="relative space-y-3">
                      {group.preferred_location && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <MapPin className="h-4 w-4 text-orange-600" />
                          <span className="font-medium">{group.preferred_location}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Euro className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">
                          {formatBudget(group.budget_min, group.budget_max)}
                        </span>
                      </div>

                      {group.move_in_date && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar className="h-4 w-4 text-orange-600" />
                          <span className="font-medium">{formatMoveInDate(group.move_in_date)}</span>
                        </div>
                      )}

                      <div className="pt-3 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-xl border-orange-200 hover:bg-orange-50 text-orange-700 gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/groups/${group.id}/chat`);
                          }}
                        >
                          <MessageCircle className="h-4 w-4" />
                          Chat
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-xl border-orange-200 hover:bg-orange-50 text-orange-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/groups/${group.id}/settings`);
                          }}
                        >
                          Paramètres
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="rounded-3xl border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50/50 to-white">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-10 h-10 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Aucun groupe pour le moment
                  </h3>
                  <p className="text-gray-600 text-center max-w-md mb-6">
                    Créez votre premier groupe et commencez à chercher un logement avec d'autres personnes
                  </p>
                  <Button
                    onClick={() => router.push('/groups/create')}
                    className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548] text-white rounded-2xl px-6 gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Créer un groupe
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Discover Groups Section */}
          {discoverGroups.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Groupes à découvrir</h2>
                  <p className="text-gray-600 mt-1">Rejoignez des groupes qui correspondent à vos critères</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push('/groups/browse')}
                  className="rounded-xl border-orange-200 hover:bg-orange-50 text-orange-700 gap-2"
                >
                  Voir tout
                  <TrendingUp className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {discoverGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="rounded-3xl shadow-lg hover:shadow-2xl transition-all cursor-pointer border-purple-100 hover:border-purple-300 group overflow-hidden"
                    onClick={() => router.push(`/groups/${group.id}`)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <CardHeader className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-md">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {group.name}
                          </CardTitle>
                          <p className="text-sm text-gray-500">{group.member_count} membres</p>
                        </div>
                      </div>
                      {group.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {group.description}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent className="relative space-y-3">
                      {group.preferred_location && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <MapPin className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">{group.preferred_location}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Euro className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">
                          {formatBudget(group.budget_min, group.budget_max)}
                        </span>
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-xl mt-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/groups/${group.id}/join`);
                        }}
                      >
                        Rejoindre ce groupe
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Why Search in Groups - Benefits Section */}
          <section className="bg-gradient-to-br from-purple-50 to-white rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Pourquoi chercher en groupe ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Euro className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Économisez</h3>
                <p className="text-gray-600">
                  Partagez les frais et trouvez un logement plus abordable ensemble
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Rencontrez</h3>
                <p className="text-gray-600">
                  Trouvez des personnes qui partagent vos critères et votre style de vie
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Plus de chances</h3>
                <p className="text-gray-600">
                  Augmentez vos chances de trouver le logement parfait rapidement
                </p>
              </div>
            </div>
          </section>
    </div>
  );
}
