'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Heart, MapPin, Home, Sparkles, Euro, TrendingUp } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { toast } from 'sonner';
import { getResidentsForProperties } from '@/lib/services/rooms.service';
import { useLanguage } from '@/lib/i18n/use-language';
import { SkeletonGrid } from '@/components/ui/skeleton';
import { logger } from '@/lib/utils/logger';
import {
  SearcherPageHeader,
  SearcherKPICard,
  SearcherKPIGrid,
  searcherGradientVibrant,
  searcherGradientLight,
  searcherColors,
  searcherAnimations,
} from '@/components/searcher';
import LoadingHouse from '@/components/ui/LoadingHouse';

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
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.searcher?.favorites;
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [residentsData, setResidentsData] = useState<Map<string, any[]>>(new Map());

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
            available_from
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error loading favorites', error);
        toast.error(t?.messages?.loadError?.[language] || 'Error loading favorites');
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

      // Load residents for all properties
      if (transformedData.length > 0) {
        const propertyIds = transformedData.map(f => f.property.id);
        const residents = await getResidentsForProperties(propertyIds);
        setResidentsData(residents);
      }
    } catch (error) {
      logger.error('Error loading favorites', error);
      toast.error(t?.messages?.error?.[language] || 'An error occurred');
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
        logger.error('Error removing favorite', error);
        toast.error(t?.messages?.removeError?.[language] || 'Error removing favorite');
        return;
      }

      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
      toast.success(t?.messages?.removed?.[language]?.replace('{title}', propertyTitle) || `"${propertyTitle}" removed from favorites`);
    } catch (error) {
      logger.error('Error removing favorite', error);
      toast.error(t?.messages?.error?.[language] || 'An error occurred');
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Chargement de vos favoris...'}</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const uniqueCities = new Set(favorites.map(f => f.property.city)).size;
  const averagePrice = favorites.length > 0
    ? Math.round(favorites.reduce((sum, f) => sum + f.property.monthly_rent, 0) / favorites.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          {...searcherAnimations.fadeInUp}
          className="space-y-6"
        >
          {/* Header */}
          <SearcherPageHeader
            icon={Heart}
            title={t?.title?.[language] || 'Mes Favoris'}
            subtitle={`${favorites.length} ${favorites.length === 1 ? (t?.count?.singular?.[language] || 'propriété sauvegardée') : (t?.count?.plural?.[language] || 'propriétés sauvegardées')}`}
            breadcrumb={{ label: 'Accueil', href: '/dashboard/searcher' }}
            currentPage="Favoris"
            actions={
              favorites.length > 0 && (
                <Button
                  onClick={() => router.push('/properties/browse')}
                  className="rounded-2xl text-white font-semibold"
                  style={{ background: searcherGradientVibrant }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Découvrir plus
                </Button>
              )
            }
          />

          {/* Empty State */}
          {favorites.length === 0 ? (
            <motion.div
              {...searcherAnimations.cardHover}
              className="relative overflow-hidden rounded-3xl border-2 border-amber-100 shadow-lg"
              style={{ background: searcherGradientLight }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20" style={{ background: searcherGradientVibrant }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 opacity-10" style={{ background: searcherGradientVibrant }} />

              <div className="relative flex flex-col items-center justify-center py-20 px-8">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                  style={{ background: searcherGradientVibrant, boxShadow: '0 12px 32px rgba(255, 140, 32, 0.3)' }}
                >
                  <Heart className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  {t?.empty?.title?.[language] || 'Pas encore de favoris'}
                </h3>
                <p className="text-lg text-gray-600 text-center max-w-md mb-8">
                  {t?.empty?.description?.[language] || 'Sauvegardez vos propriétés préférées en cliquant sur le'}
                  <Heart className="w-4 h-4 inline-block mx-1" style={{ color: searcherColors.primary }} />
                  {t?.empty?.descriptionSuffix?.[language] || 'pour les retrouver facilement ici'}
                </p>
                <Button
                  onClick={() => router.push('/properties/browse')}
                  className="text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  style={{ background: searcherGradientVibrant, boxShadow: '0 8px 24px rgba(255, 140, 32, 0.3)' }}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t?.empty?.button?.[language] || 'Découvrir les propriétés'}
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Stats KPIs */}
              <SearcherKPIGrid columns={3}>
                <SearcherKPICard
                  title={t?.stats?.total?.[language] || 'Total favoris'}
                  value={favorites.length}
                  icon={Heart}
                  variant="primary"
                />
                <SearcherKPICard
                  title={t?.stats?.cities?.[language] || 'Villes'}
                  value={uniqueCities}
                  icon={MapPin}
                  variant="info"
                />
                <SearcherKPICard
                  title={t?.stats?.averagePrice?.[language] || 'Prix moyen'}
                  value={`€${averagePrice}`}
                  icon={Euro}
                  variant="success"
                  subtext="/mois"
                />
              </SearcherKPIGrid>

              {/* Favorites Grid */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {favorites.map((favorite, index) => {
                  const residents = residentsData.get(favorite.property.id) || [];

                  return (
                    <motion.div
                      key={favorite.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      className="relative"
                    >
                      <PropertyCard
                        property={favorite.property}
                        residents={residents}
                        variant="default"
                        isFavorite={true}
                        onFavoriteClick={handleFavoriteClick}
                      />
                      <div className="mt-2 text-xs text-gray-500 text-center">
                        {t?.addedOn?.[language] || 'Ajouté le'} {new Date(favorite.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : language === 'nl' ? 'nl-NL' : 'en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
