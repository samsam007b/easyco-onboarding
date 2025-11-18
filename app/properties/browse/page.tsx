/**
 * PUBLIC Properties Browse Page
 * Supports both authenticated and guest users
 * Guest users see limited results (20) with CTAs to sign up
 */

'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, SlidersHorizontal, Lock, Save, Map as MapIcon, List, Bell, Users, Heart, X, RotateCcw, Star, Info, Sparkles, TrendingUp, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import ModernSearcherHeader from '@/components/layout/ModernSearcherHeader';
import ModernPublicHeader from '@/components/layout/ModernPublicHeader';
import PropertyCard from '@/components/PropertyCard';
import PublicSearchBar from '@/components/PublicSearchBar';
import { PropertyCardsGridSkeleton } from '@/components/PropertyCardSkeleton';
import SafeGooglePlacesAutocomplete from '@/components/ui/SafeGooglePlacesAutocomplete';
import DatePicker from '@/components/ui/date-picker';
import BudgetRangePicker from '@/components/ui/budget-range-picker';
import { useQuery } from '@tanstack/react-query';
import { calculateMatchScore, type UserPreferences, type PropertyFeatures } from '@/lib/services/matching-service';
import { ConversionModal, type ConversionModalType } from '@/components/conversion/ConversionModal';
import { useExitIntent } from '@/lib/hooks/use-exit-intent';
import { useScrollTracker } from '@/lib/hooks/use-scroll-tracker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AlertsService } from '@/lib/services/alerts-service';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getResidentsForProperties } from '@/lib/services/rooms.service';
import { AdvancedFilters, type AdvancedFiltersState } from '@/components/filters/AdvancedFilters';
import { PropertySwipeCard } from '@/components/matching/PropertySwipeCard';
import { SwipeCard } from '@/components/matching/SwipeCard';
import { useUserMatching } from '@/lib/hooks/use-user-matching';
import { cn } from '@/lib/utils';
import LoadingHouse from '@/components/ui/LoadingHouse';

// Note: framer-motion doit être importé normalement car utilisé dans les hooks useExitIntent/useScrollTracker
import { AnimatePresence, motion } from 'framer-motion';

// Lazy load heavy components
const SafePropertyMap = dynamic(() => import('@/components/SafePropertyMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg" />
});

interface Property {
  id: string;
  title: string;
  city: string;
  neighborhood?: string;
  postal_code: string;
  monthly_rent: number;
  bedrooms: number;
  bathrooms: number;
  status: string;
  description?: string;
  property_type?: string;
  created_at?: string;
  main_image?: string;
  images?: string[];
  rating?: number;
  reviews_count?: number;
  views_count?: number;
  available_from?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  total_rooms?: number;
  total_area?: number;
  furnished?: boolean;
  balcony?: boolean;
  parking?: boolean;
  smoking_allowed?: boolean;
  pets_allowed?: boolean;
  is_featured?: boolean;
  owner_id?: string;
}

// Legacy interface - kept for compatibility with alerts service
interface Filters {
  minPrice: number;
  maxPrice: number;
  bedrooms: number | null;
  bathrooms: number | null;
  propertyType: string;
  city: string;
  amenities: string[];
  furnished: boolean | null;
}

const ITEMS_PER_PAGE = 12;
const GUEST_LIMIT = 20;

export default function PropertiesBrowsePageV2() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const common = getSection('common');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<{ id: string; full_name: string; email: string; avatar_url?: string } | null>(null);
  const [searcherStats, setSearcherStats] = useState({ favoritesCount: 0, matchesCount: 0, unreadMessages: 0 });

  // User matching hook for People mode
  const {
    potentialMatches,
    isLoading: isLoadingMatches,
    recordSwipe,
    loadPotentialMatches
  } = useUserMatching(userData?.id || '', 'searcher_matching');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'best_match'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'matching'>('list');

  // Hero search states
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [budgetRange, setBudgetRange] = useState({ min: 0, max: 2000 });

  // Matching mode state
  const [matchingIndex, setMatchingIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState<Array<{ propertyId: string; action: 'left' | 'right' | 'super' }>>([]);
  const [likedProperties, setLikedProperties] = useState<Set<string>>(new Set());
  const [passedProperties, setPassedProperties] = useState<Set<string>>(new Set());
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>();
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

  // Conversion modals state
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [conversionModalType, setConversionModalType] = useState<ConversionModalType>('scroll');

  // Save search modal state
  const [showSaveSearchModal, setShowSaveSearchModal] = useState(false);
  const [searchName, setSearchName] = useState('');

  // Exit intent hook (only for guests)
  useExitIntent({
    enabled: isAuthenticated === false,
    onExitIntent: () => {
      setConversionModalType('exitIntent');
      setShowConversionModal(true);
    },
    delay: 500
  });

  // Scroll tracker hook (show modal after viewing 5 properties)
  const { trackView, viewedItemsCount } = useScrollTracker({
    enabled: isAuthenticated === false,
    threshold: 5,
    onThresholdReached: () => {
      setConversionModalType('scroll');
      setShowConversionModal(true);
      toast.info('Tu as vu plusieurs propriétés intéressantes ! 👀', {
        description: 'Crée ton compte pour débloquer toutes les fonctionnalités',
        duration: 5000
      });
    }
  });

  // Load user favorites
  const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user.id);

      if (data) {
        setUserFavorites(new Set(data.map(f => f.property_id)));
      }
    };

    loadFavorites();
  }, [isAuthenticated, supabase]);

  // Handle favorite click (show CTA for guests, toggle for authenticated)
  const handleFavoriteClick = useCallback(async (propertyId: string) => {
    if (!isAuthenticated) {
      setConversionModalType('favorite');
      setShowConversionModal(true);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isFavorite = userFavorites.has(propertyId);

    if (isFavorite) {
      // Remove from favorites
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);

      if (error) {
        toast.error('Erreur lors de la suppression');
        return;
      }

      setUserFavorites(prev => {
        const next = new Set(prev);
        next.delete(propertyId);
        return next;
      });
      toast.success('Retiré des favoris');
    } else {
      // Add to favorites
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          property_id: propertyId
        });

      if (error) {
        toast.error('Erreur lors de l\'ajout');
        return;
      }

      setUserFavorites(prev => new Set(prev).add(propertyId));
      toast.success('Ajouté aux favoris !');
    }
  }, [isAuthenticated, userFavorites, supabase]);

  // Handle signup from conversion modal
  const handleSignup = useCallback(() => {
    router.push('/signup');
  }, [router]);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (advancedFilters.cities.length > 0) count++;
    if (advancedFilters.propertyTypes.length > 0) count++;
    if (advancedFilters.priceRange.min > 0 || advancedFilters.priceRange.max < 5000) count++;
    if (advancedFilters.bedrooms.min !== null) count++;
    if (advancedFilters.furnished !== null) count++;
    if (advancedFilters.smoking !== 'flexible') count++;
    if (advancedFilters.pets !== 'flexible') count++;
    if (advancedFilters.socialLevel.length > 0) count++;
    if (advancedFilters.wakeUpTime.length > 0) count++;
    if (advancedFilters.sleepTime.length > 0) count++;
    if (advancedFilters.workSchedule.length > 0) count++;
    if (advancedFilters.genderMix.length > 0) count++;
    if (advancedFilters.occupationTypes.length > 0) count++;
    if (advancedFilters.guestFrequency.length > 0) count++;
    if (advancedFilters.musicHabits.length > 0) count++;
    if (advancedFilters.cookingFrequency.length > 0) count++;
    if (advancedFilters.amenities.length > 0) count++;
    if (advancedFilters.minMatchScore > 0) count++;
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

  // Handle save search / create alert
  const handleSaveSearch = async () => {
    if (!isAuthenticated) {
      toast.error('Connecte-toi pour créer des alertes');
      router.push('/login');
      return;
    }

    if (!searchName.trim()) {
      toast.error('Entre un nom pour cette alerte');
      return;
    }

    try {
      const alertsService = new AlertsService(supabase);

      // Convert advanced filters to old format for compatibility
      const legacyFilters = {
        minPrice: advancedFilters.priceRange.min,
        maxPrice: advancedFilters.priceRange.max,
        bedrooms: advancedFilters.bedrooms.min,
        bathrooms: advancedFilters.bathrooms.min,
        propertyType: advancedFilters.propertyTypes[0] || 'all',
        city: advancedFilters.cities[0] || '',
        amenities: advancedFilters.amenities,
        furnished: advancedFilters.furnished
      };

      await alertsService.createAlertFromFilters(searchName, legacyFilters);

      toast.success('Alerte créée ! Tu recevras des notifications pour les nouvelles propriétés correspondantes 🔔');
      setShowSaveSearchModal(false);
      setSearchName('');
    } catch (error) {
      console.error('Error creating alert:', error);
      toast.error('Une erreur est survenue');
    }
  };

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      if (user) {
        // Load user data
        const { data: usersData } = await supabase.from('users').select('full_name, email, avatar_url').eq('id', user.id).single();
        if (usersData) {
          setUserData({ ...usersData, id: user.id });
        }

        // Load searcher stats
        const { count: favCount } = await supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
        setSearcherStats({
          favoritesCount: favCount || 0,
          matchesCount: 5, // Mock for now
          unreadMessages: 0 // Mock for now
        });
      }
    };
    checkAuth();
  }, [supabase]);

  // Fetch user data if authenticated (for preferences)
  const { data: queryUserData } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const [usersData, profileData] = await Promise.all([
        supabase.from('users').select('*').eq('id', user.id).single(),
        supabase.from('user_profiles').select('*').eq('user_id', user.id).single()
      ]);

      return {
        id: user.id,
        full_name: usersData.data?.full_name || 'User',
        email: usersData.data?.email || '',
        profile_data: profileData.data
      };
    },
    enabled: isAuthenticated === true,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch user preferences for matching (if authenticated)
  const { data: userPreferences } = useQuery({
    queryKey: ['user-preferences', queryUserData?.id],
    queryFn: async () => {
      if (!queryUserData?.id) return null;

      const { data } = await supabase
        .from('searcher_preferences')
        .select('*')
        .eq('user_id', queryUserData.id)
        .single();

      return data as UserPreferences | null;
    },
    enabled: isAuthenticated === true && !!queryUserData?.id,
    staleTime: 5 * 60 * 1000,
  });

  // Build query parameters
  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      pageSize: isAuthenticated ? ITEMS_PER_PAGE : GUEST_LIMIT,
      sortBy,
      search: searchQuery.trim(),
    };

    // Apply advanced filters
    if (advancedFilters.priceRange.min > 0) params.minPrice = advancedFilters.priceRange.min;
    if (advancedFilters.priceRange.max < 5000) params.maxPrice = advancedFilters.priceRange.max;
    if (advancedFilters.bedrooms.min) params.bedrooms = advancedFilters.bedrooms.min;
    if (advancedFilters.bathrooms.min) params.bathrooms = advancedFilters.bathrooms.min;
    if (advancedFilters.propertyTypes.length > 0) params.propertyType = advancedFilters.propertyTypes[0];
    if (advancedFilters.cities.length > 0) params.city = advancedFilters.cities[0];

    return params;
  }, [currentPage, sortBy, searchQuery, advancedFilters, isAuthenticated]);

  // Fetch properties
  const { data: propertiesData, isLoading } = useQuery({
    queryKey: ['properties', 'browse', queryParams, isAuthenticated],
    queryFn: async () => {
      const from = isAuthenticated ? (queryParams.page - 1) * queryParams.pageSize : 0;
      const to = isAuthenticated
        ? from + queryParams.pageSize - 1
        : GUEST_LIMIT - 1;

      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('status', 'published');

      // Apply filters
      if (queryParams.minPrice) query = query.gte('monthly_rent', queryParams.minPrice);
      if (queryParams.maxPrice) query = query.lte('monthly_rent', queryParams.maxPrice);
      if (queryParams.bedrooms) query = query.eq('bedrooms', queryParams.bedrooms);
      if (queryParams.bathrooms) query = query.eq('bathrooms', queryParams.bathrooms);
      if (queryParams.propertyType) query = query.eq('property_type', queryParams.propertyType);
      if (queryParams.city) query = query.ilike('city', `%${queryParams.city}%`);
      if (queryParams.search) {
        query = query.or(`title.ilike.%${queryParams.search}%,description.ilike.%${queryParams.search}%`);
      }

      // Apply sorting
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
        currentPage: queryParams.page,
      };
    },
    enabled: isAuthenticated !== null,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch residents for all properties
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

  // Calculate match scores for properties (if user has preferences)
  const propertiesWithScores = useMemo(() => {
    if (!propertiesData?.properties) {
      return [];
    }

    let properties = propertiesData.properties;

    // Calculate match scores if authenticated and has preferences
    if (isAuthenticated && userPreferences) {
      properties = properties.map(property => {
        try {
          const propertyFeatures: PropertyFeatures = {
            price: property.monthly_rent,
            city: property.city,
            neighborhood: property.neighborhood,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            furnished: property.furnished || false,
            balcony: property.balcony,
            parking: property.parking,
            available_from: property.available_from,
            smoking_allowed: property.smoking_allowed,
            pets_allowed: property.pets_allowed,
          };

          const matchResult = calculateMatchScore(userPreferences, propertyFeatures);

          return {
            ...property,
            compatibilityScore: matchResult.score,
            matchInsights: matchResult.insights,
          };
        } catch (error) {
          console.error('Error calculating match score:', error);
          return property;
        }
      });
    }

    // Apply client-side sorting for "best_match"
    if (sortBy === 'best_match' && isAuthenticated && userPreferences) {
      properties = [...properties].sort((a, b) => {
        const scoreA = a.compatibilityScore || 0;
        const scoreB = b.compatibilityScore || 0;
        return scoreB - scoreA; // Descending order (best match first)
      });
    }

    return properties;
  }, [propertiesData?.properties, userPreferences, isAuthenticated, sortBy]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.formatted_address) {
      setSelectedLocation(place.formatted_address);
      // Extract city from place and apply to filters
      const cityComponent = place.address_components?.find(c => c.types.includes('locality'));
      if (cityComponent) {
        setAdvancedFilters(prev => ({
          ...prev,
          cities: [cityComponent.long_name]
        }));
      }
    }
  };

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      setAdvancedFilters(prev => ({
        ...prev,
        availableFrom: date.toISOString().split('T')[0]
      }));
    }
  };

  const handleBudgetChange = (min: number, max: number) => {
    setBudgetRange({ min, max });
    setAdvancedFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };

  const handleHeroSearch = () => {
    // Apply the hero search filters to the advanced filters
    // Filters are already applied through the handlers above
    setCurrentPage(1);
  };

  // Legacy filter change handler - no longer needed with AdvancedFilters
  // const handleFilterChange = useCallback((newFilters: Partial<Filters>) => {
  //   setFilters(prev => ({ ...prev, ...newFilters }));
  //   setCurrentPage(1);
  // }, []);

  const handleSortChange = useCallback((newSort: typeof sortBy) => {
    setSortBy(newSort);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Loading state
  if (isAuthenticated === null || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <PropertyCardsGridSkeleton count={12} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {isAuthenticated && userData ? (
        <ModernSearcherHeader
          profile={userData}
          stats={searcherStats}
        />
      ) : (
        <ModernPublicHeader />
      )}

      {/* Guest Banner */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-lg">
                  Tu vois {Math.min(propertiesData?.properties.length || 0, GUEST_LIMIT)} annonces sur {propertiesData?.totalCount || 0}
                </p>
                <p className="text-sm text-purple-100">
                  Crée un compte gratuit pour tout débloquer et voir les scores de compatibilité
                </p>
              </div>
            </div>
            <Link
              href="/auth/signup"
              className="px-6 py-3 bg-white text-purple-600 font-bold rounded-full hover:bg-purple-50 transition whitespace-nowrap shadow-lg"
            >
              Créer mon compte gratuit
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="min-h-screen pt-24">
        {/* View Mode Toggle - CENTERED AT TOP */}
        <div className="bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 py-8">
          <div className="max-w-3xl mx-auto px-6">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center bg-white rounded-full p-2 shadow-lg border border-orange-100">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all font-medium ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white shadow-md'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50/50'
                  }`}
                >
                  <List className="w-5 h-5" />
                  <span>Liste</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all font-medium ${
                    viewMode === 'map'
                      ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white shadow-md'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50/50'
                  }`}
                >
                  <MapIcon className="w-5 h-5" />
                  <span>Carte</span>
                </button>
                <button
                  onClick={() => setViewMode('matching')}
                  className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all font-medium ${
                    viewMode === 'matching'
                      ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white shadow-md'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50/50'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>People</span>
                </button>
              </div>
            </div>

            {/* Hero Section - Only for list/map */}
            {(viewMode === 'list' || viewMode === 'map') && (
              <div className="text-center mb-8">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                  Trouves ton{' '}
                  <span className="bg-gradient-to-r from-[#FFA040] via-[#FFB85C] to-[#FFD080] bg-clip-text text-transparent">
                    co-living idéal
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                  Des colocations où tu te sentiras bien, entouré·e de personnes qui te ressemblent
                </p>

                {/* Advanced Search Hero */}
                <div className="max-w-4xl mx-auto mb-6">
                  <div className="rounded-[32px] shadow-xl" style={{ overflow: 'visible' }}>
                    {/* Glassmorphism container with gradient */}
                    <div className="relative rounded-[32px]"
                         style={{
                           background: 'linear-gradient(135deg, rgba(255, 160, 64, 0.25) 0%, rgba(255, 184, 92, 0.22) 50%, rgba(255, 208, 128, 0.25) 100%)',
                           backdropFilter: 'blur(50px) saturate(250%) brightness(1.15)',
                           WebkitBackdropFilter: 'blur(50px) saturate(250%) brightness(1.15)',
                           boxShadow: 'inset 0 0 60px rgba(255, 255, 255, 0.4), inset 0 -2px 30px rgba(255, 160, 64, 0.3)',
                           overflow: 'hidden'
                         }}
                    >
                      {/* Light refraction effect */}
                      <div className="absolute inset-0 rounded-[32px]"
                           style={{
                             background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 20%, transparent 80%, rgba(255, 160, 64, 0.3) 100%)',
                             mixBlendMode: 'overlay',
                             overflow: 'hidden'
                           }}
                      />

                      {/* Top left light reflection */}
                      <div className="absolute top-0 left-0 w-1/2 h-1/2 rounded-[32px]"
                           style={{
                             background: 'radial-gradient(circle at top left, rgba(255, 255, 255, 0.5) 0%, transparent 60%)',
                             mixBlendMode: 'soft-light',
                             overflow: 'hidden'
                           }}
                      />

                      {/* White section with search inputs */}
                      <div className="bg-white/95 backdrop-blur-sm p-4 relative z-10 rounded-[32px]">
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
                              maxBudget={5000}
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
                              onClick={handleHeroSearch}
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
                </div>

                {/* Stats bar */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span className="font-medium text-orange-600">{propertiesData?.totalCount || 0}</span>
                  <span>logements disponibles</span>
                  <span className="text-gray-300">•</span>
                  <span>À partir de 400€/mois</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 border-orange-200 text-orange-700 hover:bg-orange-50 relative"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtres
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>

              {isAuthenticated && (
                <Button
                  variant="outline"
                  onClick={() => setShowSaveSearchModal(true)}
                  className="flex items-center gap-2 border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  <Bell className="w-4 h-4" />
                  Créer une alerte
                </Button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              {isAuthenticated && userPreferences && (
                <option value="best_match">🎯 Meilleur match</option>
              )}
              <option value="newest">Plus récent</option>
              <option value="price_low">Prix: Croissant</option>
              <option value="price_high">Prix: Décroissant</option>
            </select>
          </div>

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

        {/* Properties Grid, Map, or Matching View */}
        {propertiesWithScores && propertiesWithScores.length > 0 ? (
          <>
            {viewMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {propertiesWithScores.map((property, index) => {
                  // Track view for guests when they see properties
                  if (!isAuthenticated && index < 10) {
                    setTimeout(() => trackView(), index * 100);
                  }

                  const residents = residentsData?.get(property.id) || [];

                  return (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      residents={residents}
                      showCompatibilityScore={isAuthenticated}
                      compatibilityScore={property.compatibilityScore}
                      variant="default"
                      onFavoriteClick={handleFavoriteClick}
                      isFavorite={userFavorites.has(property.id)}
                    />
                  );
                })}
              </div>
            ) : viewMode === 'map' ? (
              <div className="mb-8">
                <SafePropertyMap
                  properties={propertiesWithScores}
                  selectedPropertyId={selectedPropertyId || null}
                  onPropertySelect={(id) => setSelectedPropertyId(id || undefined)}
                  className="w-full h-[700px] rounded-2xl overflow-hidden shadow-lg"
                />
              </div>
            ) : (
              // People Mode - Find co-searchers to form groups
              <div className="max-w-lg mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">
                    Trouve tes futurs{' '}
                    <span className="bg-gradient-to-r from-[#FFA040] via-[#FFB85C] to-[#FFD080] bg-clip-text text-transparent">
                      colocataires
                    </span>
                  </h2>
                  <p className="text-lg text-gray-600 max-w-md mx-auto">
                    Swipe pour créer ton groupe de colocation idéal
                  </p>
                </div>

                {/* Stats Bar */}
                <div className="mb-6 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
                    <Heart className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold text-gray-700">{matchingIndex} vus</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
                    <Users className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold text-gray-700">{potentialMatches.length - matchingIndex} restants</span>
                  </div>
                </div>

                {/* Card Stack */}
                <div className="relative h-[650px] mb-6">
                  {!isAuthenticated ? (
                    // Must be logged in
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 text-center"
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-6">
                        <Lock className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-3">
                        Connecte-toi
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-sm">
                        Crée ton compte pour rencontrer des colocataires compatibles et former ton groupe !
                      </p>
                      <Link href="/auth/signup">
                        <Button
                          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                          size="lg"
                        >
                          Créer mon compte gratuit
                        </Button>
                      </Link>
                    </motion.div>
                  ) : isLoadingMatches ? (
                    // Loading
                    <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
                      <div className="text-center">
                        <LoadingHouse size={64} />
                        <p className="text-gray-600 font-medium">Chargement des profils...</p>
                      </div>
                    </div>
                  ) : matchingIndex >= potentialMatches.length ? (
                    // No more profiles
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 text-center"
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-6">
                        <Sparkles className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-3">
                        Bravo ! 🎉
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-sm">
                        Tu as vu tous les profils disponibles. Reviens plus tard pour découvrir de nouveaux chercheurs de coloc !
                      </p>
                      <div className="flex flex-col gap-3 w-full max-w-xs">
                        <Button
                          onClick={() => {
                            setMatchingIndex(0);
                            loadPotentialMatches();
                          }}
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                          size="lg"
                        >
                          <RotateCcw className="w-5 h-5 mr-2" />
                          Recharger
                        </Button>
                        <Button
                          onClick={() => router.push('/matching/matches')}
                          variant="outline"
                          size="lg"
                          className="w-full"
                        >
                          <Heart className="w-5 h-5 mr-2" />
                          Voir mes matchs
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      {/* Preview cards (behind) - Blurred stack effect */}
                      {[1, 2].map((offset) => {
                        const previewIndex = matchingIndex + offset;
                        if (previewIndex >= potentialMatches.length) return null;
                        return (
                          <div
                            key={`preview-${previewIndex}`}
                            className={cn(
                              "absolute inset-0 rounded-3xl shadow-2xl overflow-hidden pointer-events-none transition-all duration-300",
                              offset === 1 ? "scale-[0.95] opacity-40 blur-sm translate-y-2" : "scale-[0.90] opacity-20 blur-md translate-y-4"
                            )}
                            style={{
                              zIndex: -offset,
                            }}
                          >
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                          </div>
                        );
                      })}

                      {/* Current card */}
                      <SwipeCard
                        key={potentialMatches[matchingIndex].user_id}
                        user={potentialMatches[matchingIndex]}
                        onSwipe={async (direction) => {
                          const currentUser = potentialMatches[matchingIndex];
                          const action = direction === 'right' ? 'like' : 'pass';

                          // Record swipe
                          const success = await recordSwipe(currentUser.user_id, action);

                          if (success) {
                            if (action === 'like') {
                              toast.success('👍 Profil liké !', {
                                description: `${currentUser.first_name} ${currentUser.last_name}`
                              });
                            }
                            // Move to next
                            setTimeout(() => setMatchingIndex(prev => prev + 1), 200);
                          } else {
                            toast.error('Erreur lors de l\'enregistrement');
                          }
                        }}
                        onCardClick={() => {
                          toast.info('Profil complet bientôt disponible !');
                        }}
                      />
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                {isAuthenticated && matchingIndex < potentialMatches.length && (
                  <div className="flex items-center justify-center gap-4 mb-6">
                    {/* Pass */}
                    <button
                      onClick={async () => {
                        const currentUser = potentialMatches[matchingIndex];
                        const success = await recordSwipe(currentUser.user_id, 'pass');
                        if (success) {
                          setMatchingIndex(prev => prev + 1);
                        }
                      }}
                      className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                    >
                      <X className="w-8 h-8 text-red-500" />
                    </button>

                    {/* Undo - Not available in this version */}
                    <button
                      onClick={() => {
                        toast.info('Retour en arrière bientôt disponible');
                      }}
                      disabled={matchingIndex === 0}
                      className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <RotateCcw className="w-6 h-6 text-gray-600" />
                    </button>

                    {/* Info */}
                    <button
                      onClick={() => {
                        toast.info('Détails de compatibilité bientôt disponibles !');
                      }}
                      className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                    >
                      <Info className="w-6 h-6 text-orange-600" />
                    </button>

                    {/* Like */}
                    <button
                      onClick={async () => {
                        const currentUser = potentialMatches[matchingIndex];
                        const success = await recordSwipe(currentUser.user_id, 'like');
                        if (success) {
                          toast.success('👍 Profil liké !', {
                            description: `${currentUser.first_name} ${currentUser.last_name}`
                          });
                          setMatchingIndex(prev => prev + 1);
                        }
                      }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                    >
                      <Heart className="w-8 h-8 text-white fill-current" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Pagination (authenticated only, not in matching mode) */}
            {isAuthenticated && viewMode !== 'matching' && propertiesData && propertiesData.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, propertiesData.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? 'default' : 'outline'}
                        onClick={() => handlePageChange(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === propertiesData.totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}

            {/* Guest CTA */}
            {!isAuthenticated && (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-2 border-purple-200 mt-8">
                <div className="max-w-2xl mx-auto">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Débloquer toutes les annonces
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Crée ton compte gratuit pour voir les {(propertiesData?.totalCount || 0) - GUEST_LIMIT} annonces restantes
                    et découvrir tes scores de compatibilité avec notre algorithme de matching.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href="/auth/signup"
                      className="px-8 py-4 bg-[var(--easy-purple-900)] text-white font-bold rounded-full hover:bg-[var(--easy-purple-700)] transition shadow-lg"
                    >
                      Créer mon compte gratuit
                    </Link>
                    <Link
                      href="/auth"
                      className="px-8 py-4 border-2 border-[var(--easy-purple-900)] text-[var(--easy-purple-900)] font-bold rounded-full hover:bg-purple-50 transition"
                    >
                      J'ai déjà un compte
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune annonce trouvée</h3>
            <p className="text-gray-600 mb-4">Essaye d'ajuster tes filtres ou ta recherche</p>
            <Button onClick={() => {
              handleResetFilters();
              setSearchQuery('');
            }}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </main>

      {/* Conversion Modal */}
      <ConversionModal
        isOpen={showConversionModal}
        onClose={() => setShowConversionModal(false)}
        type={conversionModalType}
        onSignup={handleSignup}
      />

      {/* Create Alert Modal */}
      <Dialog open={showSaveSearchModal} onOpenChange={setShowSaveSearchModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-600" />
              Créer une alerte
            </DialogTitle>
            <DialogDescription>
              Nomme cette alerte pour recevoir des notifications instantanées quand de nouvelles propriétés correspondent à tes critères.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="search-name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'alerte
              </label>
              <Input
                id="search-name"
                type="text"
                placeholder="Ex: Appart 2ch Bruxelles Centre"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveSearch()}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Filtres actifs:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {advancedFilters.cities.length > 0 && <li>📍 Villes: {advancedFilters.cities.join(', ')}</li>}
                {(advancedFilters.priceRange.min > 0 || advancedFilters.priceRange.max < 5000) && (
                  <li>💰 Prix: €{advancedFilters.priceRange.min} - €{advancedFilters.priceRange.max}</li>
                )}
                {advancedFilters.bedrooms.min && <li>🛏️ Chambres: {advancedFilters.bedrooms.min}+</li>}
                {advancedFilters.bathrooms.min && <li>🚿 Salles de bain: {advancedFilters.bathrooms.min}+</li>}
                {advancedFilters.propertyTypes.length > 0 && <li>🏠 Types: {advancedFilters.propertyTypes.join(', ')}</li>}
                {advancedFilters.furnished !== null && <li>✨ {advancedFilters.furnished ? 'Meublé' : 'Non meublé'}</li>}
              </ul>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowSaveSearchModal(false);
                setSearchName('');
              }}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSaveSearch}
              className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white"
            >
              <Bell className="w-4 h-4 mr-2" />
              Créer l'alerte
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
