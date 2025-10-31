'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Heart, MapPin, Trash2, Home, Users } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { toast } from 'sonner';

interface Property {
  id: string;
  title: string;
  description?: string;
  city: string;
  neighborhood?: string;
  monthly_rent: number;
  bedrooms?: number;
  property_type: string;
  main_image?: string;
  images?: string[];
  views_count?: number;
  rating?: number;
  reviews_count?: number;
  available_from?: string;
}

interface Favorite {
  id: string;
  property_id: string;
  created_at: string;
  property: Property;
}

export default function FavoritesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Load favorites with property details
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          property_id,
          created_at,
          property:properties!inner(
            id,
            title,
            description,
            city,
            neighborhood,
            monthly_rent,
            bedrooms,
            property_type,
            main_image,
            images,
            views_count,
            rating,
            reviews_count,
            available_from
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading favorites:', error);
        toast.error('Erreur lors du chargement des favoris');
        return;
      }

      // Transform data to fix TypeScript issues
      const transformedData = (data || []).map((item: any) => ({
        id: item.id,
        property_id: item.property_id,
        created_at: item.created_at,
        property: Array.isArray(item.property) ? item.property[0] : item.property
      })).filter(item => item.property); // Filter out favorites with deleted properties

      setFavorites(transformedData);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: string, propertyTitle: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) {
        console.error('Error removing favorite:', error);
        toast.error('Erreur lors de la suppression');
        return;
      }

      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
      toast.success(`"${propertyTitle}" retiré des favoris`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Une erreur est survenue');
    }
  };

  const handleFavoriteClick = async (propertyId: string) => {
    // Remove from favorites
    const favorite = favorites.find(f => f.property.id === propertyId);
    if (favorite) {
      await handleRemoveFavorite(favorite.id, favorite.property.title);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </div>

          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de vos favoris...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                Mes Favoris
              </h1>
              <p className="text-gray-600 mt-1">
                {favorites.length} {favorites.length === 1 ? 'propriété sauvegardée' : 'propriétés sauvegardées'}
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun favori pour le moment
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                Sauvegarde tes propriétés préférées en cliquant sur le cœur pour les retrouver facilement ici
              </p>
              <Button
                onClick={() => router.push('/properties/browse')}
                className="bg-gradient-to-r from-purple-600 to-yellow-500 text-white"
              >
                Découvrir des propriétés
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm text-red-600 font-medium">Total favoris</p>
                      <p className="text-2xl font-bold text-red-900">{favorites.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Villes</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {new Set(favorites.map(f => f.property.city)).size}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                      <Home className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-yellow-600 font-medium">Prix moyen</p>
                      <p className="text-2xl font-bold text-yellow-900">
                        €{Math.round(favorites.reduce((sum, f) => sum + f.property.monthly_rent, 0) / favorites.length)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="relative">
                  <PropertyCard
                    property={favorite.property}
                    variant="default"
                    isFavorite={true}
                    onFavoriteClick={handleFavoriteClick}
                  />
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Ajouté le {new Date(favorite.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
