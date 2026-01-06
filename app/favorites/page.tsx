'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Home, MapPin, Bed, Bath, Euro, Trash2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import DashboardHeader from '@/components/DashboardHeader';
import { useFavorites } from '@/lib/hooks/use-favorites';
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function FavoritesPage() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const common = getSection('common');
  const [favoriteProperties, setFavoriteProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const { favorites, removeFavorite } = useFavorites(userId || undefined);

  useEffect(() => {
    loadUserAndFavorites();
  }, []);

  useEffect(() => {
    if (favorites.length > 0) {
      loadFavoriteProperties();
    } else {
      setFavoriteProperties([]);
    }
  }, [favorites]);

  const loadUserAndFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

      // Get user profile
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      // Redirect residents to their dashboard (favorites is only for searchers)
      if (userData?.user_type === 'resident') {
        router.push('/dashboard/resident');
        return;
      }

      // Redirect owners to their dashboard (favorites is only for searchers)
      if (userData?.user_type === 'owner') {
        router.push('/dashboard/owner');
        return;
      }

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

      setIsLoading(false);
    } catch (error) {
      // FIXME: Use logger.error('Error:', error);
      setIsLoading(false);
    }
  };

  const loadFavoriteProperties = async () => {
    try {
      const propertyIds = favorites.map(f => f.property_id);

      if (propertyIds.length === 0) {
        setFavoriteProperties([]);
        return;
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .in('id', propertyIds);

      if (error) throw error;

      setFavoriteProperties(data || []);
    } catch (error) {
      // FIXME: Use logger.error('Error loading properties:', error);
    }
  };

  const handleRemoveFavorite = async (propertyId: string) => {
    await removeFavorite(propertyId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
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
        <div className="bg-white superellipse-3xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#9c5698] mb-2 flex items-center gap-2">
                <Heart className="w-8 h-8 text-red-500" />
                My Favorites
              </h1>
              <p className="text-gray-600">Properties you've saved for later</p>
            </div>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Favorites List */}
        {favoriteProperties.length === 0 ? (
          <div className="bg-white superellipse-3xl shadow-lg p-8 sm:p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              Start browsing properties and save your favorites to view them here
            </p>
            <Button onClick={() => router.push('/properties/browse')}>
              Browse Properties
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {favoriteProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white superellipse-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Property Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-purple-100 to-yellow-100 flex items-center justify-center relative">
                  <Home className="w-16 h-16 text-[#9c5698] opacity-50" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(property.id);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                  </button>
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{property.title}</h3>

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

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-1 text-[#9c5698] font-bold text-xl">
                      <Euro className="w-5 h-5" />
                      {property.monthly_rent}
                      <span className="text-sm font-normal text-gray-600">/month</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(property.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" onClick={() => router.push(`/properties/${property.id}`)}>
                        View
                      </Button>
                    </div>
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
