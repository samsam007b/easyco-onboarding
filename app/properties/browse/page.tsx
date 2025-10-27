'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, MapPin, Home, Bed, Bath, Euro, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import DashboardHeader from '@/components/DashboardHeader';

interface Property {
  id: string;
  title: string;
  city: string;
  postal_code: string;
  monthly_rent: number;
  bedrooms: number;
  bathrooms: number;
  status: string;
  description?: string;
  property_type?: string;
  created_at?: string;
}

interface Filters {
  minPrice: number;
  maxPrice: number;
  bedrooms: number | null;
  bathrooms: number | null;
  propertyType: string;
  city: string;
}

export default function BrowsePropertiesPage() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const common = getSection('common');
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high'>('newest');

  const [filters, setFilters] = useState<Filters>({
    minPrice: 0,
    maxPrice: 5000,
    bedrooms: null,
    bathrooms: null,
    propertyType: 'all',
    city: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Get user profile
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProfile({
        full_name: userData?.full_name || 'User',
        email: userData?.email || '',
        profile_data: profileData
      });

      // Load published properties
      const { data: propertiesData, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading properties:', error);
      } else {
        setProperties(propertiesData || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredAndSortedProperties = () => {
    let filtered = properties.filter(property => {
      // Search query filter
      const matchesSearch =
        property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Price filter
      const matchesPrice =
        property.monthly_rent >= filters.minPrice &&
        property.monthly_rent <= filters.maxPrice;

      // Bedrooms filter
      const matchesBedrooms =
        filters.bedrooms === null || property.bedrooms >= filters.bedrooms;

      // Bathrooms filter
      const matchesBathrooms =
        filters.bathrooms === null || property.bathrooms >= filters.bathrooms;

      // Property type filter
      const matchesType =
        filters.propertyType === 'all' ||
        property.property_type === filters.propertyType;

      // City filter
      const matchesCity =
        !filters.city ||
        property.city?.toLowerCase().includes(filters.city.toLowerCase());

      return matchesSearch && matchesPrice && matchesBedrooms &&
             matchesBathrooms && matchesType && matchesCity;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.monthly_rent - b.monthly_rent;
        case 'price_high':
          return b.monthly_rent - a.monthly_rent;
        case 'newest':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

    return filtered;
  };

  const filteredProperties = getFilteredAndSortedProperties();

  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 5000,
      bedrooms: null,
      bathrooms: null,
      propertyType: 'all',
      city: ''
    });
    setSearchQuery('');
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (filters.minPrice > 0) count++;
    if (filters.maxPrice < 5000) count++;
    if (filters.bedrooms !== null) count++;
    if (filters.bathrooms !== null) count++;
    if (filters.propertyType !== 'all') count++;
    if (filters.city) count++;
    return count;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A148C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      {profile && (
        <DashboardHeader
          profile={profile}
          avatarColor="#FFD700"
          role="searcher"
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#4A148C] mb-2">Browse Properties</h1>
              <p className="text-gray-600">Find your perfect coliving space</p>
            </div>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by location, property name, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4A148C] focus:outline-none text-gray-900"
            />
          </div>

          {/* Filters and Sort Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#4A148C] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {activeFiltersCount()}
                  </span>
                )}
              </Button>

              {activeFiltersCount() > 0 && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear all
                </Button>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">{filteredProperties.length}</span>
                <span>{filteredProperties.length === 1 ? 'property' : 'properties'} found</span>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none pl-4 pr-10 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4A148C] focus:outline-none text-sm bg-white cursor-pointer"
              >
                <option value="newest">Newest first</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-4 sm:p-6 bg-gray-50 rounded-2xl border-2 border-gray-200 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price Range (€/month)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4A148C] focus:outline-none text-sm"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value) || 5000})}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4A148C] focus:outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Minimum Bedrooms
                  </label>
                  <select
                    value={filters.bedrooms || ''}
                    onChange={(e) => setFilters({...filters, bedrooms: e.target.value ? parseInt(e.target.value) : null})}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4A148C] focus:outline-none text-sm bg-white"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Minimum Bathrooms
                  </label>
                  <select
                    value={filters.bathrooms || ''}
                    onChange={(e) => setFilters({...filters, bathrooms: e.target.value ? parseInt(e.target.value) : null})}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4A148C] focus:outline-none text-sm bg-white"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4A148C] focus:outline-none text-sm bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="studio">Studio</option>
                    <option value="coliving">Coliving Space</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city name"
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4A148C] focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 text-center">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || activeFiltersCount() > 0
                ? 'Try adjusting your search criteria or filters'
                : 'Check back soon for new listings'}
            </p>
            {activeFiltersCount() > 0 && (
              <Button onClick={resetFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                onClick={() => router.push(`/properties/${property.id}`)}
              >
                {/* Property Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-purple-100 to-yellow-100 flex items-center justify-center">
                  <Home className="w-16 h-16 text-[#4A148C] opacity-50" />
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1">{property.title}</h3>
                    {property.property_type && (
                      <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full capitalize">
                        {property.property_type}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.city}, {property.postal_code}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      {property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}
                    </div>
                  </div>

                  {property.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{property.description}</p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-1 text-[#4A148C] font-bold text-xl">
                      <Euro className="w-5 h-5" />
                      {property.monthly_rent}
                      <span className="text-sm font-normal text-gray-600">/month</span>
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
