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
import { ArrowLeft, Search, SlidersHorizontal, Lock, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import DashboardHeader from '@/components/DashboardHeader';
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
}

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

const AMENITIES = [
  { id: 'wifi', label: 'WiFi', icon: '📶' },
  { id: 'parking', label: 'Parking', icon: '🚗' },
  { id: 'balcony', label: 'Balcon', icon: '🌿' },
  { id: 'terrace', label: 'Terrasse', icon: '🏡' },
  { id: 'garden', label: 'Jardin', icon: '🌳' },
  { id: 'elevator', label: 'Ascenseur', icon: '🛗' },
  { id: 'dishwasher', label: 'Lave-vaisselle', icon: '🍽️' },
  { id: 'washing_machine', label: 'Machine à laver', icon: '👕' },
  { id: 'dryer', label: 'Sèche-linge', icon: '🔥' },
  { id: 'air_conditioning', label: 'Climatisation', icon: '❄️' },
  { id: 'heating', label: 'Chauffage', icon: '🔥' },
  { id: 'pets_allowed', label: 'Animaux acceptés', icon: '🐕' },
];

export default function PropertiesBrowsePageV2() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const common = getSection('common');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'best_match'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    minPrice: 0,
    maxPrice: 5000,
    bedrooms: null,
    bathrooms: null,
    propertyType: 'all',
    city: '',
    amenities: [],
    furnished: null
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

  // Handle save search
  const handleSaveSearch = async () => {
    if (!isAuthenticated) {
      toast.error('Connecte-toi pour sauvegarder des recherches');
      router.push('/login');
      return;
    }

    if (!searchName.trim()) {
      toast.error('Entre un nom pour cette recherche');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('saved_searches')
        .insert({
          user_id: user.id,
          name: searchName,
          filters: {
            city: filters.city,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            bedrooms: filters.bedrooms,
            bathrooms: filters.bathrooms,
            propertyType: filters.propertyType,
            furnished: filters.furnished,
            amenities: filters.amenities
          }
        });

      if (error) {
        console.error('Error saving search:', error);
        toast.error('Erreur lors de la sauvegarde');
        return;
      }

      toast.success('Recherche sauvegardée !');
      setShowSaveSearchModal(false);
      setSearchName('');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Une erreur est survenue');
    }
  };

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, [supabase]);

  // Fetch user data if authenticated
  const { data: userData } = useQuery({
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
    queryKey: ['user-preferences', userData?.id],
    queryFn: async () => {
      if (!userData?.id) return null;

      const { data } = await supabase
        .from('searcher_preferences')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      return data as UserPreferences | null;
    },
    enabled: isAuthenticated === true && !!userData?.id,
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

    if (filters.minPrice > 0) params.minPrice = filters.minPrice;
    if (filters.maxPrice < 5000) params.maxPrice = filters.maxPrice;
    if (filters.bedrooms) params.bedrooms = filters.bedrooms;
    if (filters.bathrooms) params.bathrooms = filters.bathrooms;
    if (filters.propertyType !== 'all') params.propertyType = filters.propertyType;
    if (filters.city) params.city = filters.city;

    return params;
  }, [currentPage, sortBy, searchQuery, filters, isAuthenticated]);

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

  const handleFilterChange = useCallback((newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

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
      {isAuthenticated ? (
        <DashboardHeader
          profile={{
            full_name: userData?.full_name || 'User',
            email: userData?.email || ''
          }}
        />
      ) : (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-[var(--easy-purple-900)] transition"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Retour</span>
              </Link>

              <Link
                href="/auth"
                className="px-4 py-2 bg-[var(--easy-purple-900)] text-white font-semibold rounded-lg hover:bg-[var(--easy-purple-700)] transition"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </header>
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
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <PublicSearchBar variant="compact" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtres
              </Button>

              {isAuthenticated && (
                <Button
                  variant="outline"
                  onClick={() => setShowSaveSearchModal(true)}
                  className="flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Save className="w-4 h-4" />
                  Sauvegarder
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

          {showFilters && (
            <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fourchette de prix
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange({ minPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange({ maxPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chambres
                </label>
                <select
                  value={filters.bedrooms || ''}
                  onChange={(e) => handleFilterChange({ bedrooms: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Toutes</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de bien
                </label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange({ propertyType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="all">Tous</option>
                  <option value="Studio">Studio</option>
                  <option value="Colocation">Colocation</option>
                  <option value="Appartement">Appartement</option>
                  <option value="Maison">Maison</option>
                </select>
              </div>

              {/* Furnished Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meublé
                </label>
                <select
                  value={filters.furnished === null ? '' : filters.furnished.toString()}
                  onChange={(e) => handleFilterChange({
                    furnished: e.target.value === '' ? null : e.target.value === 'true'
                  })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Peu importe</option>
                  <option value="true">Oui</option>
                  <option value="false">Non</option>
                </select>
              </div>

              {/* Amenities Filter */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Équipements
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {AMENITIES.map((amenity) => (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => {
                        const newAmenities = filters.amenities.includes(amenity.id)
                          ? filters.amenities.filter(a => a !== amenity.id)
                          : [...filters.amenities, amenity.id];
                        handleFilterChange({ amenities: newAmenities });
                      }}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                        filters.amenities.includes(amenity.id)
                          ? 'bg-purple-100 border-purple-500 text-purple-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300'
                      }`}
                    >
                      <span className="mr-1">{amenity.icon}</span>
                      {amenity.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Colocations à Bruxelles
          </h1>
          <p className="text-gray-600">
            {!isAuthenticated && `${Math.min(propertiesData?.properties.length || 0, GUEST_LIMIT)} / `}
            {propertiesData?.totalCount || 0} annonces disponibles
          </p>
        </div>

        {/* Properties Grid */}
        {propertiesWithScores && propertiesWithScores.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {propertiesWithScores.map((property, index) => {
                // Track view for guests when they see properties
                if (!isAuthenticated && index < 10) {
                  setTimeout(() => trackView(), index * 100);
                }

                return (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    showCompatibilityScore={isAuthenticated}
                    compatibilityScore={property.compatibilityScore}
                    variant="default"
                    onFavoriteClick={handleFavoriteClick}
                    isFavorite={userFavorites.has(property.id)}
                  />
                );
              })}
            </div>

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

      {/* Save Search Modal */}
      <Dialog open={showSaveSearchModal} onOpenChange={setShowSaveSearchModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Save className="w-5 h-5 text-purple-600" />
              Sauvegarder cette recherche
            </DialogTitle>
            <DialogDescription>
              Donne un nom à cette recherche pour la retrouver facilement et recevoir des alertes quand de nouvelles propriétés correspondent à tes critères.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="search-name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la recherche
              </label>
              <Input
                id="search-name"
                type="text"
                placeholder="Ex: Appart 2ch Paris Centre"
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
              className="flex-1 bg-gradient-to-r from-purple-600 to-yellow-500 text-white"
            >
              Sauvegarder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
