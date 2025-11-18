'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import { Heart, Search, FileText, TrendingUp, Bookmark, Users, ArrowRight, Home, MapPin, MessageCircle, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import SafeGooglePlacesAutocomplete from '@/components/ui/SafeGooglePlacesAutocomplete';
import DatePicker from '@/components/ui/date-picker';
import BudgetRangePicker from '@/components/ui/budget-range-picker';
import LoadingHouse from '@/components/ui/LoadingHouse';
import PropertyCard from '@/components/PropertyCard';
import { useMatching } from '@/lib/hooks/use-matching';
import { Progress } from '@/components/ui/progress';

interface DashboardStats {
  favoritesCount: number;
  topMatchesCount: number;
  applicationsCount: number;
  profileCompletion: number;
  unreadMessages: number;
}

export default function ModernSearcherDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    favoritesCount: 0,
    topMatchesCount: 0,
    applicationsCount: 0,
    profileCompletion: 0,
    unreadMessages: 0,
  });
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [budgetRange, setBudgetRange] = useState({ min: 0, max: 2000 });

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

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.formatted_address) {
      setSelectedLocation(place.formatted_address);
    }
  };

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleBudgetChange = (min: number, max: number) => {
    setBudgetRange({ min, max });
  };

  const handleSearch = () => {
    // Build search query
    const params = new URLSearchParams();
    if (selectedLocation) params.set('location', selectedLocation);
    if (budgetRange.max > 0) params.set('max_price', budgetRange.max.toString());
    if (budgetRange.min > 0) params.set('min_price', budgetRange.min.toString());
    if (selectedDate) params.set('move_in_date', selectedDate.toISOString());

    router.push(`/properties/browse?${params.toString()}`);
  };

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

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

      // Load unread messages count using RPC function
      let unreadCount = 0;
      try {
        const { data: unreadData, error: unreadError } = await supabase
          .rpc('get_unread_count', { target_user_id: user.id });

        if (!unreadError && unreadData !== null) {
          unreadCount = unreadData;
        }
      } catch (err) {
        console.error('Unread count failed:', err);
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
          profile.first_name, profile.last_name, profile.date_of_birth,
          profile.occupation, profile.bio, profile.profile_photo_url,
          profile.min_budget, profile.max_budget, profile.preferred_cities,
          profile.cleanliness_level, profile.noise_tolerance,
          profile.smoking !== undefined, profile.pets !== undefined
        ];
        const completedFields = fields.filter(field => field !== null && field !== undefined && field !== '').length;
        profileCompletion = Math.round((completedFields / fields.length) * 100);
      }

      setStats({
        favoritesCount: favCount || 0,
        topMatchesCount: 0, // Will be updated after matches load
        applicationsCount: appCount || 0,
        profileCompletion,
        unreadMessages: unreadCount || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const kpiCards = [
    { title: 'Messages', value: stats.unreadMessages, icon: MessageCircle, gradient: 'from-[#FFA040] to-[#FFB85C]', bg: 'from-orange-50 to-orange-100/50', action: () => router.push('/dashboard/searcher/messages') },
    { title: 'Favoris', value: stats.favoritesCount, icon: Bookmark, gradient: 'from-orange-400 to-orange-600', bg: 'from-orange-50 to-orange-100/50', action: () => router.push('/dashboard/searcher/favorites') },
    { title: 'Top Matchs', value: stats.topMatchesCount, icon: Heart, gradient: 'from-orange-500 to-orange-700', bg: 'from-orange-50 to-orange-100/50', action: () => router.push('/dashboard/searcher/top-matches') },
    { title: 'Candidatures', value: stats.applicationsCount, icon: FileText, gradient: 'from-[#FFB85C] to-[#FFD080]', bg: 'from-yellow-50 to-yellow-100/50', action: () => router.push('/dashboard/searcher/my-applications') },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  // Get top matches for display
  const topMatches = getTopMatches(70).slice(0, 4);
  const hasActivity = stats.favoritesCount > 0 || stats.applicationsCount > 0 || stats.unreadMessages > 0 || topMatches.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Unified Dashboard Overview Section - FIRST */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="relative rounded-[32px] overflow-hidden shadow-xl bg-gradient-to-br from-purple-50 via-orange-50 to-yellow-50 p-8 md:p-12">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/30" />

          {/* Content */}
          <div className="relative z-10">
            {/* Central Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                <div className="relative w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
                  <Home className="w-12 h-12 text-orange-600" />
                </div>
              </div>
            </div>

            {/* KPI Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {kpiCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={card.action}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", `bg-gradient-to-br ${card.gradient}`)}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xs font-medium text-gray-600 mb-1">{card.title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Welcome Message - Only show if no activity */}
            {!hasActivity && (
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Commencez votre recherche
                </h2>
                <p className="text-gray-600 max-w-lg mx-auto">
                  Explorez nos propriétés et trouvez la colocation idéale qui vous correspond
                </p>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => router.push('/properties/browse')}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Explorer les propriétés
              </Button>
              {topMatches.length > 0 && (
                <Button
                  onClick={() => router.push('/dashboard/searcher/top-matches')}
                  variant="outline"
                  size="lg"
                  className="bg-white/50 backdrop-blur-sm border-2 border-orange-200 hover:bg-white hover:border-orange-300"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Voir mes matchs ({stats.topMatchesCount})
                </Button>
              )}
              {stats.profileCompletion < 80 && !hasActivity && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/dashboard/my-profile')}
                  className="bg-white/50 backdrop-blur-sm border-2 border-purple-200 hover:bg-white hover:border-purple-300"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Compléter mon profil
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Completion Indicator */}
      {stats.profileCompletion < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-5 bg-gradient-to-r from-purple-50 to-orange-50 rounded-2xl border border-purple-100"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {stats.profileCompletion >= 80 ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-orange-600" />
              )}
              <div>
                <h3 className="font-semibold text-gray-900">
                  Profil complété à {stats.profileCompletion}%
                </h3>
                <p className="text-sm text-gray-600">
                  {stats.profileCompletion >= 80
                    ? 'Excellent ! Votre profil est presque complet.'
                    : 'Complétez votre profil pour obtenir de meilleurs matchs'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard/my-profile')}
              className="flex-shrink-0"
            >
              Compléter
            </Button>
          </div>
          <Progress value={stats.profileCompletion} className="h-2" />
        </motion.div>
      )}

      {/* Search Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="rounded-[32px] shadow-xl overflow-hidden">
          {/* Image container with gradient */}
          <div className="relative rounded-[32px] overflow-hidden">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url(/images/hero/pexels-kseniachernaya-4740485.jpg)',
                backgroundPosition: 'center',
                backgroundSize: 'cover'
              }}
            />

            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

            {/* Subtle light effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-purple-500/20" />

            {/* Content */}
            <div className="p-6 md:p-8 relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
                Rechercher une colocation
              </h2>
              <p className="text-white/90 text-center mb-6">
                Affinez votre recherche
              </p>
            </div>

            {/* White section with search inputs */}
            <div className="bg-white p-4 relative z-10 rounded-b-[32px]">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">

                {/* Location Input */}
                <div className="p-4 rounded-2xl hover:bg-orange-50/50 transition-all group">
                  <label className="block text-xs font-semibold text-gray-900 mb-1">
                    Où ?
                  </label>
                  <SafeGooglePlacesAutocomplete
                    onPlaceSelect={handlePlaceSelect}
                    placeholder="Ville, quartier..."
                    iconClassName="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors"
                    inputClassName="w-full text-sm text-gray-600 placeholder:text-gray-400 bg-transparent outline-none"
                  />
                </div>

                {/* Budget Input */}
                <div className="p-4 rounded-2xl hover:bg-orange-50/50 transition-all group border-l-0 md:border-l border-gray-200">
                  <label className="block text-xs font-semibold text-gray-900 mb-1">
                    Budget
                  </label>
                  <BudgetRangePicker
                    onBudgetChange={handleBudgetChange}
                    placeholder="€800/mois"
                    iconClassName="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors"
                    inputClassName="w-full text-sm text-gray-600 placeholder:text-gray-400 bg-transparent outline-none"
                    minBudget={0}
                    maxBudget={2000}
                  />
                </div>

                {/* Date Input */}
                <div className="p-4 rounded-2xl hover:bg-orange-50/50 transition-all group border-l-0 md:border-l border-gray-200">
                  <label className="block text-xs font-semibold text-gray-900 mb-1">
                    Quand ?
                  </label>
                  <DatePicker
                    onDateSelect={handleDateSelect}
                    placeholder="Flexible"
                    iconClassName="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors"
                    inputClassName="w-full text-sm text-gray-600 placeholder:text-gray-400 bg-transparent outline-none"
                  />
                </div>

                {/* Search Button */}
                <div className="p-2 flex items-center justify-center">
                  <Button
                    onClick={handleSearch}
                    className="w-full h-full text-gray-900 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #FFA040 0%, #FFB85C 50%, #FFD080 100%)'
                    }}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top Matches Section */}
      {topMatches.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Vos meilleurs matchs</h2>
            </div>
            {stats.topMatchesCount > 4 && (
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/searcher/top-matches')}
              >
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
                <PropertyCard
                  property={{
                    id: match.id,
                    title: match.title,
                    description: match.description,
                    city: match.city,
                    neighborhood: match.neighborhood,
                    monthly_rent: match.price,
                    bedrooms: match.bedrooms,
                    property_type: match.furnished ? 'Meublé' : 'Non meublé',
                    images: match.images,
                    available_from: match.available_from
                  }}
                  variant="compact"
                  showCompatibilityScore
                  compatibilityScore={match.matchResult ? Math.round(match.matchResult.score) : undefined}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : matchesLoading ? (
        /* Loading State */
        <div className="text-center py-12">
          <LoadingHouse size={48} />
          <p className="text-gray-600 mt-4">Recherche de matchs en cours...</p>
        </div>
      ) : null}
    </div>
  );
}
