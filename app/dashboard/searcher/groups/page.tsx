'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, MessageCircle, MapPin, Euro, Calendar, Search, TrendingUp, Heart, Briefcase, UserPlus, Check, Sparkles, Home, Settings, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { UserProfile } from '@/lib/services/user-matching-service';
import { toast } from 'sonner';
import Image from 'next/image';
import { useMatching } from '@/lib/hooks/use-matching';
import PropertyCard from '@/components/PropertyCard';
import { getResidentsForProperties } from '@/lib/services/rooms.service';

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
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [selectedMatches, setSelectedMatches] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [residentsData, setResidentsData] = useState<Map<string, any[]>>(new Map());

  // Hook for property matching
  const {
    propertiesWithMatches,
    userPreferences,
    isLoading: matchingLoading,
    loadPropertiesWithMatches,
    getTopMatches,
  } = useMatching(userId || undefined);

  const topMatches = getTopMatches(70); // Properties with score >= 70%

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

        // Set userId for property matching
        setUserId(user.id);

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

        // Load user matches from user_matches table
        const { data: matchData, error: matchError } = await supabase
          .from('user_matches')
          .select('*')
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .eq('is_active', true)
          .order('matched_at', { ascending: false });

        if (!matchError && matchData && matchData.length > 0) {
          // Extract matched user IDs
          const matchedUserIds = matchData.map((m: any) => {
            return m.user1_id === user.id ? m.user2_id : m.user1_id;
          });

          // Fetch profiles for matched users
          const { data: profiles, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .in('user_id', matchedUserIds);

          if (!profileError && profiles) {
            setMatches(profiles as UserProfile[]);
          }
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

  // Load properties when userId is set
  useEffect(() => {
    if (userId && !matchingLoading) {
      loadPropertiesWithMatches();
    }
  }, [userId, loadPropertiesWithMatches, matchingLoading]);

  // Load residents for properties
  useEffect(() => {
    const loadResidents = async () => {
      if (propertiesWithMatches.length > 0) {
        const propertyIds = propertiesWithMatches.map(p => p.id);
        const residents = await getResidentsForProperties(propertyIds);
        setResidentsData(residents);
      }
    };

    loadResidents();
  }, [propertiesWithMatches]);

  const toggleSelectMatch = (userId: string) => {
    const newSelected = new Set(selectedMatches);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedMatches(newSelected);
  };

  const handleCreateGroupFromMatches = () => {
    if (selectedMatches.size === 0) {
      toast.error('Sélectionne au moins une personne pour créer un groupe');
      return;
    }
    const memberIds = Array.from(selectedMatches).join(',');
    router.push(`/dashboard/searcher/groups/create?members=${memberIds}`);
  };

  const calculateAge = (dateOfBirth?: string): number | null => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

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
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
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
                  onClick={() => router.push('/dashboard/searcher/groups/create')}
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

          {/* Matches Section - Create groups from matches */}
          <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-orange-600" />
                    Tes Matchs
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Sélectionne des personnes pour créer un groupe de colocation
                  </p>
                </div>
                {selectedMatches.size > 0 && (
                  <Button
                    onClick={handleCreateGroupFromMatches}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-2xl gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Créer un groupe ({selectedMatches.size})
                  </Button>
                )}
              </div>

              {matches.length > 0 ? (
                <>
                  {/* Info Banner */}
                  <Card className="mb-6 border-orange-200 bg-gradient-to-r from-orange-50 to-white rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Heart className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            Ces personnes t'ont aussi liké !
                          </p>
                          <p className="text-sm text-gray-700">
                            Sélectionne-les pour former ton groupe de colocation idéal et chercher un logement ensemble.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Matches Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {matches.map((match) => {
                      const age = calculateAge(match.date_of_birth);
                      const isSelected = selectedMatches.has(match.user_id);

                      return (
                        <Card
                          key={match.user_id}
                          className={`overflow-hidden hover:shadow-xl transition-all cursor-pointer rounded-2xl border-2 ${
                            isSelected
                              ? 'border-orange-500 ring-2 ring-orange-200'
                              : 'border-orange-100 hover:border-orange-300'
                          }`}
                          onClick={() => toggleSelectMatch(match.user_id)}
                        >
                          <div className="relative h-48 overflow-hidden">
                            {match.profile_photo_url ? (
                              <Image
                                src={match.profile_photo_url}
                                alt={`${match.first_name} ${match.last_name}`}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-orange-200 via-orange-100 to-yellow-100 flex items-center justify-center">
                                <div className="text-4xl font-bold text-orange-600 opacity-30">
                                  {match.first_name.charAt(0)}
                                  {match.last_name?.charAt(0) || ''}
                                </div>
                              </div>
                            )}

                            {/* Match Badge */}
                            <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg">
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3 fill-current" />
                                <span className="text-xs font-bold">Match</span>
                              </div>
                            </div>

                            {/* Selection Indicator */}
                            {isSelected && (
                              <div className="absolute top-3 left-3 w-7 h-7 bg-orange-600 rounded-full flex items-center justify-center shadow-lg">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>

                          <CardContent className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {match.first_name} {match.last_name}
                              {age && <span className="text-base font-normal text-gray-500 ml-2">{age} ans</span>}
                            </h3>

                            {match.occupation_status && (
                              <div className="flex items-center gap-2 text-gray-600 text-sm">
                                <Briefcase className="w-3 h-3" />
                                <span className="capitalize">
                                  {match.occupation_status.replace('_', ' ')}
                                </span>
                              </div>
                            )}

                            {match.bio && (
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{match.bio}</p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Suggested Group Combinations */}
                  {matches.length >= 2 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-orange-600" />
                        Suggestions de groupes
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {matches.slice(0, 4).map((match1, idx1) => {
                          const match2 = matches[idx1 + 1];
                          if (!match2) return null;

                          return (
                            <Card
                              key={`suggestion-${idx1}`}
                              className="p-4 rounded-2xl border border-orange-200 hover:border-orange-400 hover:shadow-lg transition-all cursor-pointer"
                              onClick={() => {
                                const groupMembers = [match1.user_id, match2.user_id].join(',');
                                router.push(`/dashboard/searcher/groups/create?members=${groupMembers}`);
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold border-2 border-white">
                                    {match1.first_name.charAt(0)}
                                  </div>
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-white">
                                    {match2.first_name.charAt(0)}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">
                                    {match1.first_name} + {match2.first_name}
                                  </p>
                                  <p className="text-xs text-gray-600">Groupe de 2 personnes</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-orange-300 text-orange-700 hover:bg-orange-50 rounded-xl"
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Créer
                                </Button>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Empty State for Matches */
                <Card className="rounded-3xl border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50/50 to-white overflow-hidden">
                  <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                        <Heart className="w-12 h-12 text-orange-400" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Pas encore de matchs
                    </h3>
                    <p className="text-gray-600 max-w-md mb-6">
                      Swipe des profils pour trouver des personnes compatibles avec ton style de vie.
                      Quand vous vous likez mutuellement, un match apparaît ici !
                    </p>
                    <Button
                      onClick={() => router.push('/matching/swipe')}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl px-8 py-6 gap-3 shadow-xl hover:shadow-2xl transition-all group"
                      size="lg"
                    >
                      <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Découvrir des profils
                    </Button>
                    <p className="text-sm text-gray-500 mt-4">
                      35+ profils t'attendent
                    </p>
                  </CardContent>
                </Card>
              )}
            </section>

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
                    onClick={() => router.push('/dashboard/searcher/groups/create')}
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
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Groupes à découvrir</h2>
                <p className="text-gray-600 mt-1">Rejoignez des groupes qui correspondent à vos critères</p>
              </div>
              {discoverGroups.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => router.push('/groups/browse')}
                  className="rounded-xl border-orange-200 hover:bg-orange-50 text-orange-700 gap-2"
                >
                  Voir tout
                  <TrendingUp className="h-4 w-4" />
                </Button>
              )}
            </div>

            {discoverGroups.length > 0 ? (
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
            ) : (
              /* Empty State for Discover Groups */
              <Card className="rounded-3xl border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50/50 to-white">
                <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                      <Search className="w-12 h-12 text-purple-400" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Aucun groupe public pour le moment
                  </h3>
                  <p className="text-gray-600 max-w-md mb-6">
                    Sois le premier à créer un groupe de recherche ! D'autres chercheurs pourront te rejoindre pour chercher ensemble.
                  </p>
                  <Button
                    onClick={() => router.push('/dashboard/searcher/groups/create')}
                    className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-2xl px-8 py-6 gap-3 shadow-xl hover:shadow-2xl transition-all group"
                    size="lg"
                  >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Créer un groupe public
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Top Properties Matches Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Home className="w-8 h-8 text-orange-600" />
                  Propriétés Recommandées
                </h2>
                <p className="text-gray-600 mt-1">
                  Logements qui correspondent à tes critères
                </p>
              </div>
              {topMatches.length > 0 && (
                <Badge className="bg-orange-100 text-orange-700 px-4 py-2 text-base hover:bg-orange-100">
                  {topMatches.length} {topMatches.length > 1 ? 'matchs' : 'match'}
                </Badge>
              )}
            </div>

            {!userPreferences ? (
              /* No preferences set */
              <Card className="rounded-3xl border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50/50 to-white">
                <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                      <Settings className="w-12 h-12 text-orange-400" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <Home className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Configure tes préférences
                  </h3>
                  <p className="text-gray-600 max-w-md mb-6">
                    Complète ton profil et tes préférences pour obtenir des recommandations de logements personnalisées.
                  </p>
                  <Button
                    onClick={() => router.push('/settings/preferences')}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl px-8 py-6 gap-3 shadow-xl hover:shadow-2xl transition-all group"
                    size="lg"
                  >
                    <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Configurer mes préférences
                  </Button>
                </CardContent>
              </Card>
            ) : topMatches.length > 0 ? (
              <>
                {/* Stats Banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-white border-orange-100 shadow-md hover:shadow-lg transition-shadow rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Top Matchs</p>
                          <p className="text-xl font-bold text-gray-900">{topMatches.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-orange-100 shadow-md hover:shadow-lg transition-shadow rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                          <Home className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Total analysé</p>
                          <p className="text-xl font-bold text-gray-900">{propertiesWithMatches.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-orange-100 shadow-md hover:shadow-lg transition-shadow rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                          <Euro className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Budget</p>
                          <p className="text-lg font-bold text-gray-900">
                            {userPreferences.min_budget ? `€${userPreferences.min_budget}` : '?'} - {userPreferences.max_budget ? `€${userPreferences.max_budget}` : '?'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Properties Grid - Show first 6 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topMatches.slice(0, 6).map((property) => {
                    const residents = residentsData.get(property.id) || [];
                    const matchScore = property.matchResult?.score;

                    return (
                      <PropertyCard
                        key={property.id}
                        property={{
                          id: property.id,
                          title: property.title,
                          description: property.description,
                          city: property.city,
                          neighborhood: property.neighborhood,
                          monthly_rent: property.price,
                          bedrooms: property.bedrooms,
                          property_type: 'Colocation',
                          main_image: property.images?.[0],
                          images: property.images,
                          available_from: property.available_from,
                        }}
                        residents={residents}
                        showCompatibilityScore={true}
                        compatibilityScore={matchScore}
                        variant="default"
                      />
                    );
                  })}
                </div>

                {/* See all button */}
                {topMatches.length > 6 && (
                  <div className="mt-6 text-center">
                    <Button
                      variant="outline"
                      onClick={() => router.push('/matching/properties')}
                      className="rounded-xl border-orange-200 hover:bg-orange-50 text-orange-700 gap-2"
                    >
                      Voir les {topMatches.length - 6} autres propriétés
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              /* No matches found */
              <Card className="rounded-3xl border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50/50 to-white">
                <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                      <Home className="w-12 h-12 text-orange-400" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Aucun match élevé trouvé
                  </h3>
                  <p className="text-gray-600 max-w-md mb-6">
                    Ajuste tes préférences ou reviens plus tard pour de nouvelles annonces qui correspondent mieux à tes critères.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={() => router.push('/settings/preferences')}
                      className="rounded-xl border-orange-200 hover:bg-orange-50 text-orange-700 gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Ajuster mes préférences
                    </Button>
                    <Button
                      onClick={() => router.push('/matching/properties')}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl gap-2"
                    >
                      Explorer toutes les propriétés
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>

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
    </>
  );
}
