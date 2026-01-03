'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import { useLanguage } from '@/lib/i18n/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Heart,
  MapPin,
  Euro,
  Bed,
  Users,
  Calendar,
  Trash2,
  Eye,
  Send,
  Sparkles,
  Home,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';

// V3-FUN Palette
const SEARCHER_GRADIENT = 'linear-gradient(135deg, #F59E0B 0%, #FFB10B 50%, #FCD34D 100%)';
const SEARCHER_GRADIENT_SOFT = 'linear-gradient(135deg, #FFF9E6 0%, #FEF3C7 100%)';

interface Favorite {
  id: string;
  property_id: string;
  created_at: string;
  property: {
    id: string;
    title: string;
    city: string;
    postal_code: string;
    monthly_rent: number;
    available_rooms: number;
    max_roommates: number;
    main_image?: string;
    available_from?: string;
    property_type: string;
  };
}

export default function SearcherFavoritesPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.searcher?.favorites;

  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: favs, error } = await supabase
        .from('favorites')
        .select(`
          id,
          property_id,
          created_at,
          property:properties(
            id,
            title,
            city,
            postal_code,
            monthly_rent,
            available_rooms,
            max_roommates,
            main_image,
            available_from,
            property_type
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && favs) {
        // Filter out nulls and map to correct type
        // Supabase returns property as array for some relations, we take the first element
        const validFavorites: Favorite[] = favs
          .filter(f => f.property !== null)
          .map(f => ({
            id: f.id,
            property_id: f.property_id,
            created_at: f.created_at,
            property: Array.isArray(f.property) ? f.property[0] : f.property
          }))
          .filter(f => f.property !== null && f.property !== undefined);
        setFavorites(validFavorites);
      }
      setLoading(false);
    };
    loadFavorites();
  }, [supabase, router]);

  const handleRemoveFavorite = async (favoriteId: string) => {
    setRemoving(favoriteId);
    const { error } = await supabase.from('favorites').delete().eq('id', favoriteId);
    if (error) {
      toast.error(getHookTranslation('alerts', 'deleteFailed'));
    } else {
      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
      toast.success(getHookTranslation('alerts', 'removedFromFavorites'));
    }
    setRemoving(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingHouse size={80} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Link href="/searcher">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: SEARCHER_GRADIENT }}
                >
                  <Heart className="w-6 h-6 text-white" />
                </div>
                Mes Favoris
              </h1>
              <p className="text-gray-600 mt-1">
                {favorites.length} bien{favorites.length !== 1 ? 's' : ''} sauvegardé{favorites.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-3xl border-2 border-amber-100 shadow-lg"
            style={{ background: SEARCHER_GRADIENT_SOFT }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20" style={{ background: SEARCHER_GRADIENT }} />
            <div className="relative flex flex-col items-center justify-center py-20 px-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                style={{ background: SEARCHER_GRADIENT }}
              >
                <Heart className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                Aucun favori pour l'instant
              </h3>
              <p className="text-lg text-gray-600 text-center max-w-md mb-8">
                Explorez les propriétés et ajoutez-les à vos favoris pour les retrouver facilement
              </p>
              <Button
                onClick={() => router.push('/searcher/explore')}
                className="text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                style={{ background: SEARCHER_GRADIENT }}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Découvrir les propriétés
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {favorites.map((favorite) => (
              <motion.div
                key={favorite.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Card className="overflow-hidden rounded-2xl border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all group">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100">
                    {favorite.property.main_image ? (
                      <Image
                        src={favorite.property.main_image}
                        alt={favorite.property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFavorite(favorite.id)}
                      disabled={removing === favorite.id}
                      className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors"
                    >
                      {removing === favorite.id ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                      )}
                    </button>
                    {/* Property Type Badge */}
                    <Badge className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 border-0">
                      {favorite.property.property_type === 'shared' ? 'Colocation' : 'Appartement'}
                    </Badge>
                  </div>

                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
                      {favorite.property.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{favorite.property.city}, {favorite.property.postal_code}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Bed className="w-4 h-4" />
                          <span>{favorite.property.available_rooms} ch.</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{favorite.property.max_roommates} pers.</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Euro className="w-5 h-5 text-amber-600" />
                        <span className="text-xl font-bold text-gray-900">
                          {favorite.property.monthly_rent.toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm">/mois</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl"
                        onClick={() => router.push(`/properties/${favorite.property.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 rounded-xl text-white"
                        style={{ background: SEARCHER_GRADIENT }}
                        onClick={() => router.push(`/properties/${favorite.property.id}/apply`)}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Postuler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
