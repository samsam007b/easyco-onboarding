'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, Map as MapIcon, List, Bell, Users, Heart, X, RotateCcw, Info, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import PropertyCard from '@/components/PropertyCard';
import { useQuery } from '@tanstack/react-query';
import { calculateMatchScore, type UserPreferences, type PropertyFeatures } from '@/lib/services/matching-service';
import { getResidentsForProperties } from '@/lib/services/rooms.service';
import { AdvancedFilters, type AdvancedFiltersState } from '@/components/filters/AdvancedFilters';
import { SwipeCard } from '@/components/matching/SwipeCard';
import { CardPile } from '@/components/matching/CardPile';
import { useUserMatching, type UserWithCompatibility } from '@/lib/hooks/use-user-matching';
import { cn } from '@/lib/utils';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { AnimatePresence, motion } from 'framer-motion';

const SafePropertyMap = dynamic(() => import('@/components/SafePropertyMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg" />
});

interface BrowseContentProps {
  userId: string;
}

const ITEMS_PER_PAGE = 12;

export default function BrowseContent({ userId }: BrowseContentProps) {
  const router = useRouter();
  const supabase = createClient();

  // User matching hook for People mode
  const {
    potentialMatches,
    isLoading: isLoadingMatches,
    recordSwipe,
    loadPotentialMatches
  } = useUserMatching(userId, 'searcher_matching');

  const [viewMode, setViewMode] = useState<'list' | 'map' | 'matching'>('list');
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'best_match'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>();

  // Matching mode state
  const [matchingIndex, setMatchingIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<UserWithCompatibility[]>([]);
  const [passedProfiles, setPassedProfiles] = useState<UserWithCompatibility[]>([]);
  const [isAnimatingReload, setIsAnimatingReload] = useState(false);

  // Advanced filters state
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFiltersState>({
    priceRange: { min: 0, max: 5000 },
    cities: [],
    neighborhoods: [],
    propertyTypes: [],
    bedrooms: { min: null, max: null },
    bathrooms: { min: null, max: null },
    furnished: null,
    availableFrom: '',
    minStayMonths: null,
    smoking: 'flexible',
    pets: 'flexible',
    cleanlinessLevel: { min: 1, max: 10 },
    socialLevel: [],
    wakeUpTime: [],
    sleepTime: [],
    workSchedule: [],
    ageRange: { min: 18, max: 65 },
    genderMix: [],
    occupationTypes: [],
    languages: [],
    guestFrequency: [],
    musicHabits: [],
    cookingFrequency: [],
    amenities: [],
    minMatchScore: 0,
  });

  // User favorites
  const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadFavorites = async () => {
      const { data } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', userId);

      if (data) {
        setUserFavorites(new Set(data.map(f => f.property_id)));
      }
    };
    loadFavorites();
  }, [userId, supabase]);

  // Handle favorite click
  const handleFavoriteClick = useCallback(async (propertyId: string) => {
    const isFavorite = userFavorites.has(propertyId);

    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId);

      setUserFavorites(prev => {
        const next = new Set(prev);
        next.delete(propertyId);
        return next;
      });
      toast.success('Retiré des favoris');
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: userId, property_id: propertyId });

      setUserFavorites(prev => new Set(prev).add(propertyId));
      toast.success('Ajouté aux favoris !');
    }
  }, [userId, userFavorites, supabase]);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (advancedFilters.cities.length > 0) count++;
    if (advancedFilters.propertyTypes.length > 0) count++;
    if (advancedFilters.priceRange.min > 0 || advancedFilters.priceRange.max < 5000) count++;
    if (advancedFilters.bedrooms.min !== null) count++;
    if (advancedFilters.furnished !== null) count++;
    return count;
  }, [advancedFilters]);

  // Reset filters
  const handleResetFilters = () => {
    setAdvancedFilters({
      priceRange: { min: 0, max: 5000 },
      cities: [],
      neighborhoods: [],
      propertyTypes: [],
      bedrooms: { min: null, max: null },
      bathrooms: { min: null, max: null },
      furnished: null,
      availableFrom: '',
      minStayMonths: null,
      smoking: 'flexible',
      pets: 'flexible',
      cleanlinessLevel: { min: 1, max: 10 },
      socialLevel: [],
      wakeUpTime: [],
      sleepTime: [],
      workSchedule: [],
      ageRange: { min: 18, max: 65 },
      genderMix: [],
      occupationTypes: [],
      languages: [],
      guestFrequency: [],
      musicHabits: [],
      cookingFrequency: [],
      amenities: [],
      minMatchScore: 0,
    });
  };

  // Build query parameters
  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      pageSize: ITEMS_PER_PAGE,
      sortBy,
    };

    if (advancedFilters.priceRange.min > 0) params.minPrice = advancedFilters.priceRange.min;
    if (advancedFilters.priceRange.max < 5000) params.maxPrice = advancedFilters.priceRange.max;
    if (advancedFilters.bedrooms.min) params.bedrooms = advancedFilters.bedrooms.min;
    if (advancedFilters.bathrooms.min) params.bathrooms = advancedFilters.bathrooms.min;
    if (advancedFilters.propertyTypes.length > 0) params.propertyType = advancedFilters.propertyTypes[0];
    if (advancedFilters.cities.length > 0) params.city = advancedFilters.cities[0];

    return params;
  }, [currentPage, sortBy, advancedFilters]);

  // Fetch properties
  const { data: propertiesData, isLoading } = useQuery({
    queryKey: ['properties', 'browse', queryParams],
    queryFn: async () => {
      const from = (queryParams.page - 1) * queryParams.pageSize;
      const to = from + queryParams.pageSize - 1;

      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('status', 'published');

      if (queryParams.minPrice) query = query.gte('monthly_rent', queryParams.minPrice);
      if (queryParams.maxPrice) query = query.lte('monthly_rent', queryParams.maxPrice);
      if (queryParams.bedrooms) query = query.eq('bedrooms', queryParams.bedrooms);
      if (queryParams.city) query = query.ilike('city', `%${queryParams.city}%`);

      switch (queryParams.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'price_low':
          query = query.order('monthly_rent', { ascending: true });
          break;
        case 'price_high':
          query = query.order('monthly_rent', { ascending: false });
          break;
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        properties: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / queryParams.pageSize),
      };
    },
    staleTime: 2 * 60 * 1000,
  });

  // Fetch residents
  const { data: residentsData } = useQuery({
    queryKey: ['property-residents', propertiesData?.properties?.map(p => p.id)],
    queryFn: async () => {
      if (!propertiesData?.properties || propertiesData.properties.length === 0) {
        return new Map();
      }
      const propertyIds = propertiesData.properties.map(p => p.id);
      return await getResidentsForProperties(propertyIds);
    },
    enabled: !!propertiesData?.properties && propertiesData.properties.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const handleSortChange = useCallback((newSort: typeof sortBy) => {
    setSortBy(newSort);
    setCurrentPage(1);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingHouse size={48} />
      </div>
    );
  }

  return (
    <div id="browse-content" className="pb-8">
      {/* View Mode Toggle */}
      <div className="py-6 px-4">
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1.5 shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`px-5 py-2.5 rounded-full flex items-center gap-2 transition-all font-medium text-sm ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white shadow-md'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <List className="w-4 h-4" />
              Liste
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-5 py-2.5 rounded-full flex items-center gap-2 transition-all font-medium text-sm ${
                viewMode === 'map'
                  ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white shadow-md'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              Carte
            </button>
            <button
              onClick={() => setViewMode('matching')}
              className={`px-5 py-2.5 rounded-full flex items-center gap-2 transition-all font-medium text-sm ${
                viewMode === 'matching'
                  ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white shadow-md'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <Users className="w-4 h-4" />
              People
            </button>
          </div>
        </div>

        {/* Filters Bar - Only for list/map */}
        {(viewMode === 'list' || viewMode === 'map') && (
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 border-orange-200 text-orange-700 hover:bg-orange-50 relative rounded-full"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtres
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
              className="px-3 py-1.5 border border-gray-200 rounded-full text-sm bg-white"
            >
              <option value="newest">Plus récent</option>
              <option value="price_low">Prix croissant</option>
              <option value="price_high">Prix décroissant</option>
            </select>
          </div>
        )}
      </div>

      {/* Advanced Filters Modal */}
      {showFilters && (
        <AdvancedFilters
          filters={advancedFilters}
          onFiltersChange={setAdvancedFilters}
          onClose={() => setShowFilters(false)}
          onReset={handleResetFilters}
          activeFiltersCount={activeFiltersCount}
        />
      )}

      {/* Content */}
      {viewMode === 'list' && propertiesData?.properties && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6">
            {/* Property Cards */}
            <div className={cn("w-full lg:w-[60%]", showMobileMap && "hidden lg:block")}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {propertiesData.properties.map((property) => {
                  const residents = residentsData?.get(property.id) || [];
                  return (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      residents={residents}
                      showCompatibilityScore
                      variant="default"
                      onFavoriteClick={handleFavoriteClick}
                      isFavorite={userFavorites.has(property.id)}
                      onMouseEnter={() => setSelectedPropertyId(property.id)}
                      onMouseLeave={() => setSelectedPropertyId(undefined)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Map */}
            <div className={cn(
              "lg:w-[40%]",
              showMobileMap ? "fixed inset-0 z-40 lg:relative" : "hidden lg:block"
            )}>
              <div className={cn(showMobileMap ? "h-full" : "sticky top-24 h-[calc(100vh-7rem)]")}>
                <SafePropertyMap
                  properties={propertiesData.properties}
                  selectedPropertyId={selectedPropertyId || null}
                  onPropertySelect={(id) => setSelectedPropertyId(id || undefined)}
                  className="w-full h-full rounded-2xl overflow-hidden shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Mobile map toggle */}
          <button
            onClick={() => setShowMobileMap(!showMobileMap)}
            className="lg:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 font-medium"
          >
            {showMobileMap ? <List className="w-5 h-5" /> : <MapIcon className="w-5 h-5" />}
            {showMobileMap ? 'Liste' : 'Carte'}
          </button>
        </div>
      )}

      {viewMode === 'map' && propertiesData?.properties && (
        <div className="max-w-7xl mx-auto px-4">
          <SafePropertyMap
            properties={propertiesData.properties}
            selectedPropertyId={selectedPropertyId || null}
            onPropertySelect={(id) => setSelectedPropertyId(id || undefined)}
            className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg"
          />
        </div>
      )}

      {viewMode === 'matching' && (
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Trouve tes futurs{' '}
              <span className="bg-gradient-to-r from-[#FFA040] to-[#FFD080] bg-clip-text text-transparent">
                colocataires
              </span>
            </h2>
            <p className="text-sm text-gray-600">
              Swipe pour créer ton groupe idéal
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm text-xs">
              <Heart className="w-3.5 h-3.5 text-green-600" />
              <span className="font-semibold text-gray-700">{likedProfiles.length}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm text-xs">
              <Users className="w-3.5 h-3.5 text-orange-600" />
              <span className="font-semibold text-gray-700">{potentialMatches.length - matchingIndex}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm text-xs">
              <X className="w-3.5 h-3.5 text-red-500" />
              <span className="font-semibold text-gray-700">{passedProfiles.length}</span>
            </div>
          </div>

          {/* 3-Column Layout */}
          <div className="flex items-center justify-center gap-6 lg:gap-10 mb-4">
            {/* Left Pile */}
            <div className="hidden lg:flex flex-shrink-0">
              <CardPile
                type="pass"
                cards={passedProfiles}
                onUndo={() => {
                  if (passedProfiles.length > 0) {
                    const lastPassed = passedProfiles[passedProfiles.length - 1];
                    setPassedProfiles(prev => prev.slice(0, -1));
                    setMatchingIndex(prev => Math.max(0, prev - 1));
                    toast.info(`${lastPassed.first_name} remis dans le deck`);
                  }
                }}
              />
            </div>

            {/* Center Card */}
            <div className="relative w-full max-w-[380px] h-[580px] flex-shrink-0">
              {isLoadingMatches ? (
                <div className="absolute inset-0 bg-white rounded-3xl shadow-xl flex items-center justify-center">
                  <LoadingHouse size={48} />
                </div>
              ) : matchingIndex >= potentialMatches.length ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Bravo !</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Tu as vu tous les profils disponibles.
                  </p>
                  <Button
                    onClick={async () => {
                      setIsAnimatingReload(true);
                      setMatchingIndex(0);
                      await loadPotentialMatches();
                      setIsAnimatingReload(false);
                      toast.success('Profils rechargés !');
                    }}
                    disabled={isAnimatingReload}
                    className="bg-gradient-to-r from-orange-500 to-orange-600"
                  >
                    <RotateCcw className={`w-4 h-4 mr-2 ${isAnimatingReload ? 'animate-spin' : ''}`} />
                    Recharger
                  </Button>
                </motion.div>
              ) : (
                <>
                  {/* Background cards */}
                  <AnimatePresence mode="popLayout">
                    {[2, 1].map((offset) => {
                      const cardIndex = matchingIndex + offset;
                      const card = potentialMatches[cardIndex];
                      if (!card) return null;

                      return (
                        <motion.div
                          key={`preview-${cardIndex}`}
                          className="absolute inset-0 bg-white rounded-3xl shadow-lg pointer-events-none overflow-hidden"
                          animate={{
                            scale: 1 - offset * 0.04,
                            y: -offset * 10,
                            opacity: 1 - offset * 0.25,
                            zIndex: -offset
                          }}
                        />
                      );
                    })}
                  </AnimatePresence>

                  {/* Current card */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`current-${matchingIndex}`}
                      className="relative z-10"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                    >
                      <SwipeCard
                        user={potentialMatches[matchingIndex]}
                        onSwipe={async (direction) => {
                          const currentUser = potentialMatches[matchingIndex];
                          const action = direction === 'right' ? 'like' : 'pass';

                          const success = await recordSwipe(currentUser.user_id, action);
                          if (success) {
                            if (action === 'like') {
                              setLikedProfiles(prev => [...prev, currentUser]);
                              toast.success(`${currentUser.first_name} liké !`);
                            } else {
                              setPassedProfiles(prev => [...prev, currentUser]);
                            }
                            setTimeout(() => setMatchingIndex(prev => prev + 1), 200);
                          }
                        }}
                        onCardClick={() => toast.info('Profil complet bientôt disponible !')}
                      />
                    </motion.div>
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* Right Pile */}
            <div className="hidden lg:flex flex-shrink-0">
              <CardPile
                type="like"
                cards={likedProfiles}
                onUndo={() => {
                  if (likedProfiles.length > 0) {
                    const lastLiked = likedProfiles[likedProfiles.length - 1];
                    setLikedProfiles(prev => prev.slice(0, -1));
                    setMatchingIndex(prev => Math.max(0, prev - 1));
                    toast.info(`${lastLiked.first_name} remis dans le deck`);
                  }
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {matchingIndex < potentialMatches.length && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={async () => {
                  const currentUser = potentialMatches[matchingIndex];
                  const success = await recordSwipe(currentUser.user_id, 'pass');
                  if (success) {
                    setPassedProfiles(prev => [...prev, currentUser]);
                    setMatchingIndex(prev => prev + 1);
                  }
                }}
                className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform border-2 border-red-200"
              >
                <X className="w-7 h-7 text-red-500" />
              </button>
              <button
                onClick={async () => {
                  const currentUser = potentialMatches[matchingIndex];
                  const success = await recordSwipe(currentUser.user_id, 'like');
                  if (success) {
                    setLikedProfiles(prev => [...prev, currentUser]);
                    toast.success(`${currentUser.first_name} liké !`);
                    setMatchingIndex(prev => prev + 1);
                  }
                }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Heart className="w-7 h-7 text-white fill-current" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
