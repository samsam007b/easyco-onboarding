'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import { shouldShowDemoData } from '@/lib/utils/admin-demo';
import { motion } from 'framer-motion';
import {
  Heart,
  Search,
  FileText,
  Bookmark,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MapPin,
  Euro,
  Calendar,
  TrendingUp,
  Plus,
  Clock,
  Home,
  Filter,
  Bell,
  Eye,
  ChevronDown,
  Trophy,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import OptimizedPropertyCard from '@/components/optimized/OptimizedPropertyCard';
import SmartFilters from '@/components/optimized/SmartFilters';
import PropertyComparison from '@/components/optimized/PropertyComparison';
import EnhancedSkeleton from '@/components/optimized/EnhancedSkeleton';
import { useMatching } from '@/lib/hooks/use-matching';

interface DashboardStats {
  favoritesCount: number;
  topMatchesCount: number;
  applicationsCount: number;
  profileCompletion: number;
  unreadMessages: number;
  savedSearchesCount: number;
  viewsCount: number;
}

interface SavedSearch {
  id: string;
  name: string;
  location: string;
  priceRange: string;
  moveInDate?: string;
  resultsCount: number;
  lastUpdated: string;
}

interface Activity {
  id: string;
  icon: any;
  iconBgColor: string;
  title: string;
  subtitle: string;
  time: string;
  link?: string;
}

// Helper function to get relative time string
function getRelativeTime(dateString: string | null): string {
  if (!dateString) return 'Récemment';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function ModernSearcherDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showCompletionDetails, setShowCompletionDetails] = useState(false);
  const [showSmartFilters, setShowSmartFilters] = useState(false);
  const [comparisonProperties, setComparisonProperties] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const [stats, setStats] = useState<DashboardStats>({
    favoritesCount: 0,
    topMatchesCount: 0,
    applicationsCount: 0,
    profileCompletion: 0,
    unreadMessages: 0,
    savedSearchesCount: 0,
    viewsCount: 0,
  });

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  // Mock data for admin demo accounts only
  const MOCK_SAVED_SEARCHES: SavedSearch[] = [
    {
      id: 'demo-1',
      name: 'Bruxelles Centre',
      location: 'Bruxelles',
      priceRange: '€600-900',
      moveInDate: '2024-12-01',
      resultsCount: 12,
      lastUpdated: 'Il y a 2h',
    },
    {
      id: 'demo-2',
      name: 'Liège Étudiant',
      location: 'Liège',
      priceRange: '€400-600',
      resultsCount: 8,
      lastUpdated: 'Hier',
    },
  ];

  const MOCK_RECENT_ACTIVITIES: Activity[] = [
    {
      id: 'demo-1',
      icon: Home,
      iconBgColor: 'bg-green-100',
      title: 'Nouvelle propriété disponible',
      subtitle: 'Correspond à ta recherche "Bruxelles Centre"',
      time: 'Il y a 1h',
      link: '/properties/browse',
    },
    {
      id: 'demo-2',
      icon: MessageCircle,
      iconBgColor: 'bg-blue-100',
      title: 'Nouveau message du propriétaire',
      subtitle: 'Appartement rue des Chartreux',
      time: 'Il y a 3h',
      link: '/dashboard/searcher/messages',
    },
    {
      id: 'demo-3',
      icon: Eye,
      iconBgColor: 'bg-purple-100',
      title: 'Ton profil a été consulté',
      subtitle: 'Par le propriétaire de "Studio Quartier Européen"',
      time: 'Hier',
    },
  ];

  // Use matching hook to get top matches
  const {
    propertiesWithMatches,
    isLoading: matchesLoading,
    loadPropertiesWithMatches,
    getTopMatches
  } = useMatching(userId || undefined);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load matches when userId is available
  useEffect(() => {
    if (userId) {
      loadPropertiesWithMatches();
    }
  }, [userId, loadPropertiesWithMatches]);

  // Update topMatchesCount when matches are loaded
  useEffect(() => {
    if (!matchesLoading && propertiesWithMatches.length > 0) {
      const topMatchesCount = getTopMatches(70).length;
      setStats(prev => ({ ...prev, topMatchesCount }));
    }
  }, [propertiesWithMatches, matchesLoading, getTopMatches]);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);
      setUserEmail(user.email || null);

      const isAdminDemo = shouldShowDemoData(user.email);

      // Load favorites count
      const { count: favCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Load applications count
      const { count: appCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('applicant_id', user.id);

      // Load saved searches (full data for display)
      const { data: savedSearchesData, count: searchesCount } = await supabase
        .from('saved_searches')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(5);

      // Set saved searches - real data for regular users, mock for admin demo
      if (isAdminDemo && (!savedSearchesData || savedSearchesData.length === 0)) {
        setSavedSearches(MOCK_SAVED_SEARCHES);
        setRecentActivities(MOCK_RECENT_ACTIVITIES);
      } else if (savedSearchesData && savedSearchesData.length > 0) {
        // Transform real data to match our interface
        const transformedSearches: SavedSearch[] = savedSearchesData.map((search: any) => ({
          id: search.id,
          name: search.name || search.location || 'Ma recherche',
          location: search.location || search.city || 'Non spécifié',
          priceRange: search.min_price && search.max_price
            ? `€${search.min_price}-${search.max_price}`
            : 'Tout budget',
          moveInDate: search.move_in_date,
          resultsCount: search.results_count || 0,
          lastUpdated: getRelativeTime(search.updated_at || search.created_at),
        }));
        setSavedSearches(transformedSearches);
        // For now, activities remain empty for regular users (no activity tracking yet)
        setRecentActivities([]);
      } else {
        // No saved searches - show empty state (handled in render)
        setSavedSearches([]);
        setRecentActivities([]);
      }

      // Load unread messages count using RPC function
      let unreadCount = 0;
      try {
        const { data: unreadData, error: unreadError } = await supabase
          .rpc('get_unread_count', { target_user_id: user.id });

        if (!unreadError && unreadData !== null) {
          unreadCount = unreadData;
        }
      } catch (err) {
        logger.error('Unread count failed', err);
      }

      // Calculate profile completion
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      let profileCompletion = 0;
      if (profile) {
        const fields = [
          profile.first_name,
          profile.last_name,
          profile.date_of_birth,
          profile.occupation,
          profile.bio,
          profile.profile_photo_url,
          profile.min_budget,
          profile.max_budget,
          profile.preferred_cities,
          profile.cleanliness_level,
          profile.noise_tolerance,
          profile.smoking !== undefined,
          profile.pets !== undefined
        ];
        const completedFields = fields.filter(field => field !== null && field !== undefined && field !== '').length;
        profileCompletion = Math.round((completedFields / fields.length) * 100);
      }

      // Load favorites for marking cards
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user.id);

      if (favoritesData) {
        setFavorites(new Set(favoritesData.map(f => f.property_id)));
      }

      setStats({
        favoritesCount: favCount || 0,
        topMatchesCount: 0, // Will be updated after matches load
        applicationsCount: appCount || 0,
        profileCompletion,
        unreadMessages: unreadCount || 0,
        savedSearchesCount: searchesCount || 0,
        viewsCount: 0, // TODO: Implement views tracking
      });
    } catch (error) {
      logger.error('Error loading dashboard', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteClick = async (propertyId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
      if (userId) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('property_id', propertyId);
      }
    } else {
      newFavorites.add(propertyId);
      if (userId) {
        await supabase
          .from('favorites')
          .insert({ user_id: userId, property_id: propertyId });
      }
    }
    setFavorites(newFavorites);
  };

  const handleSmartFilterApply = (filters: any) => {
    // Navigate to browse with filters
    const params = new URLSearchParams();
    if (filters.cities && filters.cities.length > 0) {
      params.set('location', filters.cities[0]);
    }
    if (filters.priceRange) {
      params.set('min_price', filters.priceRange.min.toString());
      params.set('max_price', filters.priceRange.max.toString());
    }
    router.push(`/properties/browse?${params.toString()}`);
    setShowSmartFilters(false);
  };

  const handleAddToComparison = (property: any) => {
    if (comparisonProperties.length >= 4) {
      alert('Vous pouvez comparer jusqu\'à 4 propriétés maximum');
      return;
    }
    if (!comparisonProperties.find(p => p.id === property.id)) {
      setComparisonProperties([...comparisonProperties, property]);
    }
  };

  const handleRemoveFromComparison = (propertyId: string) => {
    setComparisonProperties(comparisonProperties.filter(p => p.id !== propertyId));
  };

  const kpiCards = [
    {
      title: 'Messages',
      value: stats.unreadMessages,
      subtitle: stats.unreadMessages > 0 ? 'Non lus' : 'Tous lus',
      icon: MessageCircle,
      gradient: 'from-[#9c5698] to-[#9D7EE5]',
      bg: 'from-purple-50 to-purple-100/50',
      action: () => router.push('/dashboard/searcher/messages'),
    },
    {
      title: 'Favoris',
      value: stats.favoritesCount,
      subtitle: 'Propriétés sauvegardées',
      icon: Bookmark,
      gradient: 'from-[#FFA040] to-[#FFB85C]',
      bg: 'from-orange-50 to-orange-100/50',
      action: () => router.push('/dashboard/searcher/favorites'),
    },
    {
      title: 'Top Matchs',
      value: stats.topMatchesCount,
      subtitle: 'Compatibilité > 70%',
      icon: Heart,
      gradient: 'from-[#FF5722] to-[#FF8C5C]',
      bg: 'from-orange-50 to-orange-100/50',
      action: () => router.push('/dashboard/searcher/groups'),
    },
    {
      title: 'Candidatures',
      value: stats.applicationsCount,
      subtitle: 'En attente',
      icon: FileText,
      gradient: 'from-[#FFB10B] to-[#FFE082]',
      bg: 'from-yellow-50 to-yellow-100/50',
      action: () => router.push('/dashboard/searcher/my-applications'),
    },
  ];

  if (isLoading) {
    return <EnhancedSkeleton variant="dashboard" />;
  }

  // Get top matches for display
  const topMatches = getTopMatches(70).slice(0, 4);

  return (
    <>
      {/* Profile Completion Widget */}
      {stats.profileCompletion < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-7xl mx-auto bg-gradient-to-br from-purple-50/50 to-orange-50/50 backdrop-blur-sm rounded-b-2xl rounded-t-none p-4 border-l border-r border-b border-purple-200/50 hover:shadow-md transition-all mb-6 mx-2 sm:mx-6 lg:mx-8"
        >
          <button
            onClick={() => setShowCompletionDetails(!showCompletionDetails)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {/* Progress Circle */}
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90">
                  <defs>
                    <linearGradient id="searcherCompletionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#9c5698" />
                      <stop offset="50%" stopColor="#9D7EE5" />
                      <stop offset="100%" stopColor="#FFA040" />
                    </linearGradient>
                  </defs>
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="url(#searcherCompletionGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - stats.profileCompletion / 100)}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold bg-gradient-to-r from-[#9c5698] via-[#9D7EE5] to-[#FFA040] bg-clip-text text-transparent">
                    {stats.profileCompletion}%
                  </span>
                </div>
              </div>

              <div className="text-left">
                <h3 className="text-sm font-semibold text-gray-900">Complétion du profil</h3>
                <p className="text-xs text-gray-600">
                  {stats.profileCompletion >= 80
                    ? 'Excellent ! Profil presque complet'
                    : 'Complète ton profil pour de meilleurs matchs'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {stats.profileCompletion >= 80 && <Trophy className="w-5 h-5 text-yellow-600" />}
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  showCompletionDetails ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {/* Dropdown Details */}
          {showCompletionDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-purple-200/30"
            >
              <Progress value={stats.profileCompletion} className="h-2 mb-4" />
              <Button
                onClick={() => router.push('/dashboard/my-profile')}
                className="w-full rounded-full bg-gradient-to-r from-[#9c5698] via-[#9D7EE5] to-[#FFA040]"
                size="sm"
              >
                Compléter mon profil
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={card.action}
                className={cn(
                  'relative overflow-hidden rounded-3xl p-6 cursor-pointer transition-all hover:scale-105',
                  'bg-white shadow-lg hover:shadow-xl hover:ring-2 hover:ring-purple-500'
                )}
              >
                {/* Gradient Background */}
                <div
                  className={cn(
                    'absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20',
                    `bg-gradient-to-br ${card.bg}`
                  )}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center mb-4',
                      `bg-gradient-to-br ${card.gradient} shadow-lg`
                    )}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-medium text-gray-600 mb-2">{card.title}</h3>

                  {/* Value */}
                  <p className="text-2xl font-bold text-gray-900 mb-2">{card.value}</p>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-500">{card.subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Top Matches Section */}
        {topMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Tes meilleurs matchs</h2>
              </div>
              {stats.topMatchesCount > 4 && (
                <Button variant="outline" onClick={() => router.push('/dashboard/searcher/groups')}>
                  Voir tous ({stats.topMatchesCount})
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <OptimizedPropertyCard
                    property={{
                      id: match.id,
                      title: match.title,
                      description: match.description,
                      city: match.city,
                      neighborhood: match.neighborhood,
                      monthly_rent: match.price,
                      bedrooms: match.bedrooms,
                      property_type: match.furnished ? 'Meublé' : 'Non meublé',
                      main_image: match.images?.[0],
                      images: match.images,
                      available_from: match.available_from,
                    }}
                    variant="compact"
                    showCompatibilityScore
                    compatibilityScore={
                      match.matchResult ? Math.round(match.matchResult.score) : undefined
                    }
                    onFavoriteClick={handleFavoriteClick}
                    isFavorite={favorites.has(match.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {matchesLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <EnhancedSkeleton variant="card" count={4} />
          </motion.div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Saved Searches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-purple-600" />
                Recherches Sauvegardées
              </h3>
              <Button
                onClick={() => setShowSmartFilters(true)}
                variant="ghost"
                size="sm"
                className="rounded-full"
              >
                <Plus className="w-4 h-4 mr-1" />
                Nouveau
              </Button>
            </div>

            {savedSearches.length > 0 ? (
              <>
                <div className="space-y-3">
                  {savedSearches.map((search, index) => (
                    <motion.div
                      key={search.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="flex items-start justify-between p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer"
                      onClick={() => router.push('/properties/browse')}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-purple-600" />
                          <p className="font-semibold text-gray-900">{search.name}</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Euro className="w-3 h-3" />
                            {search.priceRange}
                          </span>
                          {search.moveInDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(search.moveInDate).toLocaleDateString('fr-FR', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{search.lastUpdated}</p>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {search.resultsCount}
                      </Badge>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={() => router.push('/dashboard/searcher/saved-searches')}
                  variant="outline"
                  className="w-full mt-4 rounded-full"
                >
                  Voir toutes les recherches
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            ) : (
              /* Empty state with CTA */
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Aucune recherche sauvegardée</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Sauvegarde tes critères de recherche pour être notifié des nouvelles propriétés qui correspondent à tes besoins.
                </p>
                <Button
                  onClick={() => setShowSmartFilters(true)}
                  className="rounded-full bg-gradient-to-r from-[#9c5698] via-[#9D7EE5] to-[#FFA040]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer ma première recherche
                </Button>
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-3xl shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-600" />
              Activité Récente
            </h3>

            {recentActivities.length > 0 ? (
              <>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => activity.link && router.push(activity.link)}
                      >
                        <div
                          className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                            activity.iconBgColor
                          )}
                        >
                          <Icon className="w-5 h-5 text-gray-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{activity.title}</p>
                          <p className="text-xs text-gray-500 truncate">{activity.subtitle}</p>
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
                      </motion.div>
                    );
                  })}
                </div>

                <Button
                  onClick={() => router.push('/dashboard/searcher/notifications')}
                  variant="outline"
                  className="w-full mt-4 rounded-full"
                >
                  Voir toutes les notifications
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            ) : (
              /* Empty state with tips */
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Aucune activité récente</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Tes notifications apparaîtront ici : nouveaux messages, propriétés correspondant à tes critères, et plus encore.
                </p>
                <div className="bg-purple-50 rounded-xl p-4 text-left">
                  <p className="text-sm font-medium text-purple-900 mb-2">Conseils pour commencer :</p>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li className="flex items-center gap-2">
                      <Target className="w-4 h-4 flex-shrink-0" />
                      Complète ton profil pour améliorer tes matchs
                    </li>
                    <li className="flex items-center gap-2">
                      <Search className="w-4 h-4 flex-shrink-0" />
                      Sauvegarde une recherche pour recevoir des alertes
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Explore More Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-[#9c5698] via-[#9D7EE5] to-[#FFA040] rounded-3xl shadow-lg p-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Continue ta recherche
              </h3>
              <p className="text-purple-100 mb-4">
                Découvre plus de propriétés qui correspondent à tes critères et augmente tes chances de trouver
                le lieu idéal
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => router.push('/properties/browse')}
                  className="bg-white text-purple-600 hover:bg-gray-100 rounded-full"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Explorer les propriétés
                </Button>
                <Button
                  onClick={() => setShowSmartFilters(true)}
                  variant="outline"
                  className="border-white text-white hover:bg-white/20 rounded-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres intelligents
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold">{stats.topMatchesCount}</p>
                <p className="text-sm text-purple-100">Top Matchs</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold">{stats.savedSearchesCount}</p>
                <p className="text-sm text-purple-100">Recherches</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Smart Filters Modal */}
        {showSmartFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSmartFilters(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Filtres intelligents</h2>
                </div>
                <button
                  onClick={() => setShowSmartFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
                </button>
              </div>
              <SmartFilters onFilterApply={handleSmartFilterApply} />
            </motion.div>
          </motion.div>
        )}

        {/* Comparison Floating Button */}
        {comparisonProperties.length > 0 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="fixed bottom-8 right-8 z-40">
            <Button
              onClick={() => setShowComparison(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white shadow-2xl rounded-full px-6 py-6"
            >
              <TrendingUp className="w-6 h-6 mr-2" />
              Comparer ({comparisonProperties.length})
            </Button>
          </motion.div>
        )}

        {/* Property Comparison Modal */}
        {showComparison && comparisonProperties.length > 0 && (
          <PropertyComparison
            properties={comparisonProperties}
            onClose={() => setShowComparison(false)}
            onRemoveProperty={handleRemoveFromComparison}
          />
        )}
      </div>
    </>
  );
}
