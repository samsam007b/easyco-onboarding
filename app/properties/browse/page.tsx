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
import { ArrowLeft, Search, SlidersHorizontal, Lock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import DashboardHeader from '@/components/DashboardHeader';
import PropertyCard from '@/components/PropertyCard';
import PublicSearchBar from '@/components/PublicSearchBar';
import { PropertyCardsGridSkeleton } from '@/components/PropertyCardSkeleton';
import { useQuery } from '@tanstack/react-query';
import { calculateMatchScore, type UserPreferences, type PropertyFeatures } from '@/lib/services/matching-service';

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
}

const ITEMS_PER_PAGE = 12;
const GUEST_LIMIT = 20;

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
    city: ''
  });

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
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
            </Button>

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
              {propertiesWithScores.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  showCompatibilityScore={isAuthenticated}
                  compatibilityScore={property.compatibilityScore}
                  variant="default"
                />
              ))}
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
                city: ''
              });
              setSearchQuery('');
            }}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
