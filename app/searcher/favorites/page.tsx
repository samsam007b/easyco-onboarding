'use client';

import { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import { useLanguage } from '@/lib/i18n/use-language';
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
  Search,
  Bookmark,
  MessageCircle,
  Building2,
  Star,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';

// V3-FUN Searcher Palette
const SEARCHER_GRADIENT = 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #FCD34D 100%)';
const SEARCHER_PRIMARY = '#F59E0B';
const CARD_BG_GRADIENT = 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)';
const ACCENT_SHADOW = 'rgba(245, 158, 11, 0.15)';
// Semantic Colors
const SEMANTIC_PINK = '#EC4899';
const SEMANTIC_SUCCESS = '#10B981';
const SEMANTIC_BLUE = '#3B82F6';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } }
};

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

const SearcherFavoritesPage = memo(function SearcherFavoritesPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [removing, setRemoving] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const loadFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const [favoritesRes, messagesRes] = await Promise.all([
        supabase
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
          .order('created_at', { ascending: false }),
        supabase.rpc('get_unread_count', { target_user_id: user.id }),
      ]);

      setUnreadMessages(messagesRes.data || 0);

      if (!favoritesRes.error && favoritesRes.data) {
        const validFavorites: Favorite[] = favoritesRes.data
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

  // Stats cards
  const statsCards = [
    {
      icon: Bookmark,
      value: favorites.length,
      label: 'Favoris',
      color: SEMANTIC_PINK,
      bgColor: '#FCE7F3',
    },
    {
      icon: Building2,
      value: [...new Set(favorites.map(f => f.property.city))].length,
      label: 'Villes',
      color: SEMANTIC_BLUE,
      bgColor: '#DBEAFE',
    },
    {
      icon: Euro,
      value: favorites.length > 0
        ? Math.round(favorites.reduce((a, b) => a + b.property.monthly_rent, 0) / favorites.length) + '€'
        : '0€',
      label: 'Loyer moy.',
      color: SEARCHER_PRIMARY,
      bgColor: '#FEF3C7',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 via-yellow-400/5 to-amber-300/3" />
          <div className="absolute top-0 -left-4 w-96 h-96 bg-amber-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-amber-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />
          <div className="absolute inset-0 backdrop-blur-3xl bg-white/60" />
        </div>
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium mt-4">Chargement de vos favoris...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 md:pb-0">
      {/* Glassmorphism background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 via-yellow-400/5 to-amber-300/3" />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-amber-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-amber-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/60" />
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50">
        <div className="bg-white/80 backdrop-blur-xl border-b border-amber-100/50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Left: Back + Title */}
              <div className="flex items-center gap-3">
                <Link href="/searcher">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-100"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </Link>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                    style={{ background: SEARCHER_GRADIENT }}
                  >
                    <Bookmark className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-gray-900">Mes Favoris</h1>
                    <p className="text-xs text-gray-500">{favorites.length} bien{favorites.length !== 1 ? 's' : ''} sauvegardé{favorites.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              {/* Right: Quick Actions */}
              <div className="flex items-center gap-2">
                <Link href="/messages">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-100 cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                    {unreadMessages > 0 && (
                      <span
                        className="absolute -top-1 -right-1 w-5 h-5 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                        style={{ background: SEARCHER_GRADIENT }}
                      >
                        {unreadMessages}
                      </span>
                    )}
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-md border-b border-amber-100/30"
        >
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Stats */}
              <div className="flex items-center gap-3">
                {statsCards.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white shadow-sm border border-gray-100"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: stat.bgColor }}
                    >
                      <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-gray-900 text-sm">{stat.value}</span>
                      <span className="text-[10px] text-gray-500 hidden sm:inline">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Link */}
              <Link href="/searcher/explore" className="hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-white"
                  style={{ background: SEARCHER_GRADIENT }}
                >
                  <Search className="w-4 h-4" />
                  Explorer
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-3xl bg-white shadow-lg"
            style={{ boxShadow: `0 8px 32px ${ACCENT_SHADOW}` }}
          >
            {/* Decorative circles */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20"
              style={{ background: SEARCHER_GRADIENT }}
            />
            <div
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-15"
              style={{ background: SEARCHER_GRADIENT }}
            />

            <div className="relative flex flex-col items-center justify-center py-16 px-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                style={{ background: SEARCHER_GRADIENT }}
              >
                <Bookmark className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Aucun favori pour l'instant
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                Explorez les propriétés et ajoutez-les à vos favoris pour les retrouver facilement
              </p>
              <Link href="/searcher/explore">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl text-white font-medium shadow-md flex items-center gap-2"
                  style={{ background: SEARCHER_GRADIENT }}
                >
                  <Sparkles className="w-4 h-4" />
                  Découvrir les propriétés
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {favorites.map((favorite) => (
                <motion.div
                  key={favorite.id}
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                >
                  <div
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-amber-200 transition-all group cursor-pointer"
                    onClick={() => router.push(`/properties/${favorite.property.id}`)}
                  >
                    {/* Image */}
                    <div className="relative h-40 bg-gray-100">
                      {favorite.property.main_image ? (
                        <Image
                          src={favorite.property.main_image}
                          alt={favorite.property.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: CARD_BG_GRADIENT }}
                        >
                          <Building2 className="w-10 h-10 text-amber-300" />
                        </div>
                      )}

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(favorite.id);
                        }}
                        disabled={removing === favorite.id}
                        className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                      >
                        {removing === favorite.id ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        )}
                      </motion.button>

                      {/* Property Type Badge */}
                      <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700">
                        {favorite.property.property_type === 'shared' ? 'Colocation' : 'Appartement'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {favorite.property.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{favorite.property.city}</span>
                      </div>

                      {/* Details */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <Bed className="w-3.5 h-3.5" />
                          <span>{favorite.property.available_rooms} ch.</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <Users className="w-3.5 h-3.5" />
                          <span>{favorite.property.max_roommates} pers.</span>
                        </div>
                        {favorite.property.available_from && (
                          <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Dispo</span>
                          </div>
                        )}
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-gray-900">
                            {favorite.property.monthly_rent.toLocaleString()}€
                          </span>
                          <span className="text-xs text-gray-500">/mois</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/properties/${favorite.property.id}/apply`);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-sm font-medium shadow-sm"
                          style={{ background: SEARCHER_GRADIENT }}
                        >
                          <Send className="w-3.5 h-3.5" />
                          Postuler
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-white/90 backdrop-blur-xl border-t border-amber-100/50 px-4 py-3 safe-area-pb">
          <div className="flex items-center justify-around">
            <Link href="/searcher">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1"
              >
                <Home className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] text-gray-500">Accueil</span>
              </motion.div>
            </Link>
            <Link href="/searcher/explore">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1"
              >
                <Search className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] text-gray-500">Explorer</span>
              </motion.div>
            </Link>
            <Link href="/searcher/matching">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1"
              >
                <Heart className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] text-gray-500">Matching</span>
              </motion.div>
            </Link>
            <Link href="/searcher/favorites">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1"
              >
                <Bookmark className="w-5 h-5" style={{ color: SEARCHER_PRIMARY }} />
                <span className="text-[10px] font-medium" style={{ color: SEARCHER_PRIMARY }}>Favoris</span>
              </motion.div>
            </Link>
            <Link href="/messages">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 relative"
              >
                <MessageCircle className="w-5 h-5 text-gray-400" />
                {unreadMessages > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                    style={{ background: SEARCHER_GRADIENT }}
                  >
                    {unreadMessages}
                  </span>
                )}
                <span className="text-[10px] text-gray-500">Messages</span>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SearcherFavoritesPage;
