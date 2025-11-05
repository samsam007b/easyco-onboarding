/**
 * PUBLIC Properties Browse Page
 * Supports both authenticated and guest users
 * Guest users see limited results (20) with CTAs to sign up
 */

'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, SlidersHorizontal, Lock, Save, Map as MapIcon, List, Bell, Users } from 'lucide-react';
import { toast } from 'sonner';
import PropertyMap from '@/components/PropertyMap';
import { useLanguage } from '@/lib/i18n/use-language';
import ModernSearcherHeader from '@/components/layout/ModernSearcherHeader';
import ModernPublicHeader from '@/components/layout/ModernPublicHeader';
import PropertyCard from '@/components/PropertyCard';
import PublicSearchBar from '@/components/PublicSearchBar';
import { PropertyCardsGridSkeleton } from '@/components/PropertyCardSkeleton';
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
  const [userData, setUserData] = useState<{ full_name: string; email: string; avatar_url?: string } | null>(null);
  const [searcherStats, setSearcherStats] = useState({ favoritesCount: 0, matchesCount: 0, unreadMessages: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'best_match'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
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
          setUserData(usersData);
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
      <main className="min-h-screen">
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
                  onClick={() => router.push('/matching/swipe')}
                  className="px-6 py-3 rounded-full flex items-center gap-2 transition-all font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50/50"
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

                {/* Search Bar */}
                <div className="max-w-3xl mx-auto">
                  <PublicSearchBar variant="hero" />
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

        {/* Properties Grid, Map, or People View */}
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
            ) : (
              <div className="mb-8">
                <PropertyMap
                  properties={propertiesWithScores}
                  selectedPropertyId={selectedPropertyId}
                  onPropertySelect={setSelectedPropertyId}
                  className="w-full h-[700px] rounded-2xl overflow-hidden shadow-lg"
                />
              </div>
            )}

            {/* Pagination (authenticated only) */}
            {isAuthenticated && propertiesData && propertiesData.totalPages > 1 && (
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
              setFilters({
                minPrice: 0,
                maxPrice: 5000,
                bedrooms: null,
                bathrooms: null,
                propertyType: 'all',
                city: '',
                amenities: [],
                furnished: null
              });
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
                {filters.city && <li>📍 Ville: {filters.city}</li>}
                {(filters.minPrice > 0 || filters.maxPrice < 3000) && (
                  <li>💰 Prix: €{filters.minPrice} - €{filters.maxPrice}</li>
                )}
                {filters.bedrooms && <li>🛏️ Chambres: {filters.bedrooms}</li>}
                {filters.bathrooms && <li>🚿 Salles de bain: {filters.bathrooms}</li>}
                {filters.propertyType && filters.propertyType !== 'all' && <li>🏠 Type: {filters.propertyType}</li>}
                {filters.furnished !== null && <li>✨ {filters.furnished ? 'Meublé' : 'Non meublé'}</li>}
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
