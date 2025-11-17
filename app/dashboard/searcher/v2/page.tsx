'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/auth/supabase-client';
import { useQuery } from '@tanstack/react-query';
import SearcherHeader from '@/components/layout/SearcherHeader';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/ui/EmptyState';
import { SkeletonPropertyCard, SkeletonDashboard } from '@/components/ui/Skeleton';
import { useIsMobile } from '@/lib/hooks/use-media-query';
import { useMobileOptimizedQuery, useShouldSimplifyUI } from '@/lib/hooks/use-mobile-optimization';
import {
  Heart,
  Users,
  MessageCircle,
  Search,
  TrendingUp,
  MapPin,
  Calendar,
  Star,
  Eye,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface Match {
  id: string;
  property_id: string;
  score: number;
  property: any;
}

export default function SearcherDashboardV2() {
  const router = useRouter();
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);

  // Mobile optimization hooks
  const isMobile = useIsMobile();
  const shouldSimplify = useShouldSimplifyUI();
  const queryConfig = useMobileOptimizedQuery();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
      } else {
        setUserId(user.id);
      }
    };
    checkAuth();
  }, [router, supabase]);

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['searcher-profile', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      return {
        id: userId,
        first_name: userData?.first_name || 'Searcher',
        last_name: userData?.last_name || '',
        full_name: userData?.full_name || 'Searcher',
        email: userData?.email || '',
        avatar_url: profileData?.avatar_url,
        profile_data: profileData,
      };
    },
    enabled: !!userId,
  });

  // Fetch real matches from the matching algorithm
  // Use mobile-optimized limit: mobile=6, tablet=12, desktop=20
  const { data: matchesData, isLoading: matchesLoading, refetch: refetchMatches } = useQuery({
    queryKey: ['searcher-matches', userId, queryConfig.limit],
    queryFn: async () => {
      if (!userId) return [];

      try {
        // Try to fetch existing matches from the API with mobile-optimized limit
        const response = await fetch(`/api/matching/matches?limit=${queryConfig.limit}&minScore=60&includeStats=false`);

        if (!response.ok) {
          console.error('Failed to fetch matches:', response.statusText);
          return [];
        }

        const data = await response.json();

        // If no matches found, generate new ones
        if (!data.matches || data.matches.length === 0) {
          console.log('No matches found, generating new ones...');

          const generateResponse = await fetch('/api/matching/generate', {
            method: 'POST',
          });

          if (generateResponse.ok) {
            const generateData = await generateResponse.json();
            console.log(`Generated ${generateData.matchesGenerated} new matches`);

            // Fetch matches again after generation
            const retryResponse = await fetch('/api/matching/matches?limit=20&minScore=60&includeStats=false');
            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              return formatMatchesData(retryData.matches || []);
            }
          }
        }

        return formatMatchesData(data.matches || []);
      } catch (error) {
        console.error('Error fetching matches:', error);
        return [];
      }
    },
    enabled: !!userId,
    staleTime: queryConfig.staleTime, // Mobile-optimized: mobile=5min, desktop=1min
    refetchOnWindowFocus: false,
  });

  // Helper function to format matches data for compatibility with existing UI
  const formatMatchesData = (matches: any[]) => {
    return matches.map((match) => ({
      id: match.id,
      property_id: match.property_id,
      score: Math.round(match.total_score), // Use real match score
      property: match.property,
      match_reason: match.match_reason,
      budget_score: match.budget_score,
      location_score: match.location_score,
      lifestyle_score: match.lifestyle_score,
      status: match.status,
    }));
  };

  // Fetch favorites (mobile-optimized limit)
  const { data: favoritesData } = useQuery({
    queryKey: ['searcher-favorites', userId, isMobile],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('favorites')
        .select('*, property:properties(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(isMobile ? 3 : 6); // Show fewer on mobile

      if (error) return [];
      return data || [];
    },
    enabled: !!userId,
    staleTime: queryConfig.staleTime,
  });

  // Fetch user's groups (mock for now)
  const { data: groupsData } = useQuery({
    queryKey: ['searcher-groups', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .contains('members', [userId])
        .order('created_at', { ascending: false });

      if (error) return [];
      return data || [];
    },
    enabled: !!userId,
  });

  // Calculate stats
  const totalMatches = matchesData?.length || 0;
  const newMatches = matchesData?.filter((m) => m.score >= 85).length || 0;
  const totalFavorites = favoritesData?.length || 0;
  const totalGroups = groupsData?.length || 0;

  // Show skeleton screen while loading
  if (!userId || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SearcherHeader
          profile={{
            full_name: 'Loading...',
            email: '',
            avatar_url: undefined,
          }}
          stats={{
            favoritesCount: 0,
            matchesCount: 0,
            unreadMessages: 0,
          }}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonDashboard />
        </main>
      </div>
    );
  }

  const topMatches = matchesData?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Searcher theme (yellow) */}
      <SearcherHeader
        profile={profile}
        notifications={0}
        unreadMessages={0}
        newMatches={newMatches}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Hero */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl shadow-lg p-8 mb-8 text-gray-900">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Salut {profile.first_name}! 👋
              </h1>
              <p className="text-lg text-gray-800">
                Tu as <span className="font-bold">{newMatches} nouveaux matchs</span> aujourd'hui!
              </p>
            </div>
            <Link href="/matching/swipe">
              <Button
                size="lg"
                className="bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Commencer à swiper
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-8 h-8 text-red-500" />
              <Badge variant="error">{newMatches} nouveaux</Badge>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalMatches}</p>
            <p className="text-sm text-gray-600">Matchs Totaux</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalFavorites}</p>
            <p className="text-sm text-gray-600">Favoris</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalGroups}</p>
            <p className="text-sm text-gray-600">Mes Groupes</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600">Visites Planifiées</p>
          </div>
        </div>

        {/* Top Matches Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tes Meilleurs Matchs</h2>
                <p className="text-sm text-gray-600">
                  Basé sur tes préférences et notre algorithme IA
                </p>
              </div>
            </div>
            <Link href="/matching">
              <Button variant="outline">Voir tous</Button>
            </Link>
          </div>

          {matchesLoading ? (
            <div className={`grid gap-6 ${shouldSimplify ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {Array.from({ length: shouldSimplify ? 2 : 3 }).map((_, i) => (
                <SkeletonPropertyCard key={i} />
              ))}
            </div>
          ) : topMatches.length > 0 ? (
            <div className={`grid gap-6 ${shouldSimplify ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {topMatches.map((match) => (
                <div key={match.id} className="relative group">
                  {/* Compatibility Score Badge with Tooltip */}
                  <div className="absolute top-4 right-4 z-20">
                    <div
                      className="bg-green-500 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 cursor-help"
                      title={match.match_reason || 'Score de compatibilité basé sur vos préférences'}
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-bold">{match.score}%</span>
                    </div>

                    {/* Detailed Tooltip on Hover */}
                    {match.match_reason && (
                      <div className="invisible group-hover:visible absolute top-full right-0 mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-30">
                        <div className="space-y-2">
                          <p className="font-semibold border-b border-gray-700 pb-2">
                            Pourquoi ce match?
                          </p>
                          <p className="text-gray-300">{match.match_reason}</p>

                          {/* Score Breakdown */}
                          {(match.budget_score || match.location_score || match.lifestyle_score) && (
                            <div className="border-t border-gray-700 pt-2 mt-2 space-y-1">
                              {match.budget_score && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Budget:</span>
                                  <span className="text-green-400">{Math.round(match.budget_score)}%</span>
                                </div>
                              )}
                              {match.location_score && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Localisation:</span>
                                  <span className="text-blue-400">{Math.round(match.location_score)}%</span>
                                </div>
                              )}
                              {match.lifestyle_score && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Lifestyle:</span>
                                  <span className="text-purple-400">{Math.round(match.lifestyle_score)}%</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {/* Arrow pointing up */}
                        <div className="absolute -top-2 right-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-900" />
                      </div>
                    )}
                  </div>

                  <PropertyCard
                    property={match.property}
                    showCompatibilityScore={false}
                    variant="default"
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Heart}
              title="Aucun match pour le moment"
              description="Notre algorithme IA cherche les meilleures options pour toi. Complete ton profil pour obtenir des recommandations personnalisées dès maintenant!"
              illustration="search"
              variant="colorful"
              primaryAction={{
                label: "Compléter mon profil",
                onClick: () => router.push('/profile/enhance'),
                icon: Sparkles,
              }}
              secondaryAction={{
                label: "Parcourir les propriétés",
                onClick: () => router.push('/properties/browse'),
              }}
            />
          )}
        </div>

        {/* Recommended Properties */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recommandations Pour Toi</h2>
                <p className="text-sm text-gray-600">
                  Propriétés qui correspondent à tes critères
                </p>
              </div>
            </div>
            <Link href="/properties/browse">
              <Button variant="outline" className="flex items-center gap-2">
                Explorer
                <Search className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {matchesData && matchesData.length > 3 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {matchesData.slice(3, 6).map((match) => (
                <PropertyCard
                  key={match.id}
                  property={match.property}
                  showCompatibilityScore={true}
                  compatibilityScore={match.score}
                  variant="default"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                Commence à explorer pour voir des recommandations
              </p>
            </div>
          )}
        </div>

        {/* My Groups */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Mes Groupes de Coloc</h2>
                <p className="text-sm text-gray-600">
                  Cherche avec d'autres personnes
                </p>
              </div>
            </div>
            <Link href="/groups/new">
              <Button variant="outline">Créer un groupe</Button>
            </Link>
          </div>

          {groupsData && groupsData.length > 0 ? (
            <div className="space-y-4">
              {groupsData.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{group.name}</p>
                      <p className="text-sm text-gray-600">
                        {group.members?.length || 0} membres
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        group.status === 'complete'
                          ? 'success'
                          : group.status === 'forming'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {group.status === 'complete' && 'Complet'}
                      {group.status === 'forming' && 'En formation'}
                      {group.status === 'active' && 'Actif'}
                    </Badge>
                    <Link href={`/groups/${group.id}`}>
                      <Button variant="outline" size="sm">
                        Voir
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun groupe pour le moment
              </h3>
              <p className="text-gray-600 mb-6">
                Crée ou rejoins un groupe pour chercher une coloc ensemble
              </p>
              <Link href="/groups/new">
                <Button className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Créer mon premier groupe
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* My Favorites */}
        {favoritesData && favoritesData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Mes Favoris</h2>
                  <p className="text-sm text-gray-600">
                    Propriétés que tu as aimées
                  </p>
                </div>
              </div>
              <Link href="/favorites">
                <Button variant="outline">Voir tous</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {favoritesData.slice(0, 3).map((fav) => (
                <PropertyCard
                  key={fav.id}
                  property={fav.property}
                  isFavorite={true}
                  variant="default"
                />
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl shadow-lg p-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-gray-900">
              <h3 className="text-2xl font-bold mb-2">
                Prêt à trouver ta coloc idéale? 🏡
              </h3>
              <p className="text-gray-800">
                Commence à swiper sur les propriétés et trouve ton match parfait!
              </p>
            </div>
            <Link href="/matching/swipe">
              <Button
                size="lg"
                className="bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2 whitespace-nowrap"
              >
                Commencer à swiper
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
