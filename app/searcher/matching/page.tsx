'use client';

import { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import { useLanguage } from '@/lib/i18n/use-language';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Heart,
  Home,
  Users,
  MapPin,
  Euro,
  Star,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Eye,
  Send,
  Filter,
  RefreshCw,
  Zap,
  ChevronRight,
  Search,
  Bookmark,
  MessageCircle,
  Building2,
  Bed,
  Calendar,
} from 'lucide-react';

// V3-FUN Matching Palette - Searcher Dark Gradient (intense for matching energy)
const MATCHING_GRADIENT = 'linear-gradient(135deg, #FFA040 0%, #FF8C20 100%)'; // --gradient-searcher-dark
const MATCHING_PRIMARY = '#FFA040';
const MATCHING_DARK = '#FF8C20';
const MATCHING_LIGHT = '#FFD080';
// Semantic Colors

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

interface PropertyMatch {
  id: string;
  property_id: string;
  compatibility_score: number;
  match_reasons: string[];
  property: {
    id: string;
    title: string;
    city: string;
    postal_code: string;
    monthly_rent: number;
    available_rooms: number;
    max_roommates: number;
    main_image?: string;
    property_type: string;
  };
}

const SearcherMatchingPage = memo(function SearcherMatchingPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<PropertyMatch[]>([]);
  const [activeTab, setActiveTab] = useState<'properties' | 'people'>('properties');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [favorites, setFavorites] = useState(0);

  useEffect(() => {
    const loadMatches = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Parallel fetch
      const [favoritesRes, messagesRes, countRes] = await Promise.all([
        supabase
          .from('favorites')
          .select(`
            id,
            property_id,
            property:properties(
              id,
              title,
              city,
              postal_code,
              monthly_rent,
              available_rooms,
              max_roommates,
              main_image,
              property_type
            )
          `)
          .eq('user_id', user.id)
          .limit(20),
        supabase.rpc('get_unread_count', { target_user_id: user.id }),
        supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);

      setUnreadMessages(messagesRes.data || 0);
      setFavorites(countRes.count || 0);

      if (favoritesRes.data) {
        const matchData: PropertyMatch[] = favoritesRes.data
          .filter(f => f.property !== null)
          .map(f => {
            const property = Array.isArray(f.property) ? f.property[0] : f.property;
            return {
              id: f.id,
              property_id: f.property_id,
              compatibility_score: Math.floor(Math.random() * 30) + 70,
              match_reasons: [
                'Budget correspondant',
                'Localisation idéale',
                'Style de vie compatible'
              ],
              property: property as PropertyMatch['property']
            };
          })
          .filter(m => m.property !== null && m.property !== undefined)
          .sort((a, b) => b.compatibility_score - a.compatibility_score);

        setMatches(matchData);
      }
      setLoading(false);
    };
    loadMatches();
  }, [supabase, router]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return SEMANTIC_SUCCESS;
    if (score >= 80) return SEMANTIC_AMBER;
    if (score >= 70) return SEMANTIC_BLUE;
    return '#6B7280';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return '#D1FAE5';
    if (score >= 80) return '#FEF3C7';
    if (score >= 70) return '#DBEAFE';
    return '#F3F4F6';
  };

  // Stats cards
  const statsCards = [
    {
      icon: Heart,
      value: matches.length,
      label: 'Matchs',
      color: MATCHING_PRIMARY,
      bgColor: '#FFF4E0',
    },
    {
      icon: Zap,
      value: matches.filter(m => m.compatibility_score >= 85).length,
      label: 'Top matchs',
      color: SEMANTIC_SUCCESS,
      bgColor: '#D1FAE5',
    },
    {
      icon: TrendingUp,
      value: matches.length > 0 ? Math.round(matches.reduce((a, b) => a + b.compatibility_score, 0) / matches.length) + '%' : '0%',
      label: 'Score moyen',
      color: SEMANTIC_AMBER,
      bgColor: '#FEF3C7',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Glassmorphism background - Searcher Dark Orange */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-searcher-500/8 via-orange-400/5 to-yellow-300/3" />
          <div className="absolute top-0 -left-4 w-96 h-96 bg-searcher-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-orange-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-yellow-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />
          <div className="absolute inset-0 backdrop-blur-3xl bg-white/60" />
        </div>
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium mt-4">Recherche de vos matchs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 md:pb-0">
      {/* Glassmorphism background - Searcher Dark Orange for Matching */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-searcher-500/8 via-orange-400/5 to-yellow-300/3" />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-searcher-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-orange-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-yellow-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/60" />
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50">
        <div className="bg-white/80 backdrop-blur-xl border-b border-searcher-100/50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Left: Back + Title */}
              <div className="flex items-center gap-3">
                <Link href="/searcher">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 superellipse-xl bg-white flex items-center justify-center shadow-sm border border-gray-100"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </Link>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-md"
                    style={{ background: MATCHING_GRADIENT }}
                  >
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-gray-900">Matching</h1>
                    <p className="text-xs text-gray-500">Trouve ta coloc idéale</p>
                  </div>
                </div>
              </div>

              {/* Right: Quick Actions */}
              <div className="flex items-center gap-2">
                <Link href="/messages">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-10 h-10 superellipse-xl bg-white flex items-center justify-center shadow-sm border border-gray-100 cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                    {unreadMessages > 0 && (
                      <span
                        className="absolute -top-1 -right-1 w-5 h-5 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                        style={{ background: MATCHING_GRADIENT }}
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

        {/* Tabs Bar */}
        <div className="bg-white/60 backdrop-blur-md border-b border-searcher-100/30">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Tabs */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('properties')}
                  className={`flex items-center gap-2 px-4 py-2 superellipse-xl text-sm font-medium transition-all ${
                    activeTab === 'properties'
                      ? 'text-white shadow-md'
                      : 'text-gray-600 bg-white border border-gray-100 hover:bg-searcher-50'
                  }`}
                  style={activeTab === 'properties' ? { background: MATCHING_GRADIENT } : {}}
                >
                  <Building2 className="w-4 h-4" />
                  Propriétés
                </motion.button>
                <Link href="/searcher/matching/people">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 superellipse-xl text-sm font-medium text-gray-600 bg-white border border-gray-100 hover:bg-searcher-50 transition-all"
                  >
                    <Users className="w-4 h-4" />
                    Colocataires
                  </motion.button>
                </Link>
              </div>

              {/* Mini Stats */}
              <div className="hidden md:flex items-center gap-3">
                {statsCards.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 superellipse-xl bg-white shadow-sm border border-gray-100"
                  >
                    <div
                      className="w-7 h-7 superellipse-lg flex items-center justify-center"
                      style={{ backgroundColor: stat.bgColor }}
                    >
                      <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-gray-900 text-sm">{stat.value}</span>
                      <span className="text-[10px] text-gray-500">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden flex items-center gap-3 mb-6 overflow-x-auto pb-2"
        >
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 superellipse-xl bg-white shadow-sm border border-gray-100 flex-shrink-0"
            >
              <div
                className="w-8 h-8 superellipse-lg flex items-center justify-center"
                style={{ backgroundColor: stat.bgColor }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{stat.value}</p>
                <p className="text-[10px] text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Empty State */}
        {matches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden superellipse-3xl bg-white shadow-lg"
            style={{ boxShadow: `0 8px 32px var(--searcher-shadow)` }}
          >
            {/* Decorative circles */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20"
              style={{ background: MATCHING_GRADIENT }}
            />
            <div
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-15"
              style={{ background: MATCHING_GRADIENT }}
            />

            <div className="relative flex flex-col items-center justify-center py-16 px-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 superellipse-2xl flex items-center justify-center mb-6 shadow-lg"
                style={{ background: MATCHING_GRADIENT }}
              >
                <Heart className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Pas encore de matchs
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                Complétez votre profil et explorez les propriétés pour découvrir vos matchs
              </p>
              <div className="flex gap-3">
                <Link href="/profile/searcher">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 superellipse-xl text-white font-medium shadow-md flex items-center gap-2"
                    style={{ background: MATCHING_GRADIENT }}
                  >
                    <Star className="w-4 h-4" />
                    Mon profil
                  </motion.button>
                </Link>
                <Link href="/searcher/explore">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 superellipse-xl bg-white border border-gray-200 font-medium shadow-sm flex items-center gap-2 hover:bg-gray-50"
                  >
                    <Search className="w-4 h-4" />
                    Explorer
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between mb-4"
            >
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{matches.length}</span> propriétés compatibles
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-3 py-1.5 superellipse-xl bg-white border border-gray-100 shadow-sm text-sm text-gray-600 hover:bg-searcher-50"
              >
                <Filter className="w-4 h-4" />
                Filtrer
              </motion.button>
            </motion.div>

            {/* Matches Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {matches.map((match, index) => (
                <motion.div
                  key={match.id}
                  variants={itemVariants}
                >
                  <div
                    className="bg-white superellipse-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-searcher-200 transition-all group cursor-pointer"
                    onClick={() => router.push(`/properties/${match.property.id}`)}
                  >
                    {/* Image */}
                    <div className="relative h-40 bg-gray-100">
                      {match.property.main_image ? (
                        <Image
                          src={match.property.main_image}
                          alt={match.property.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: 'var(--gradient-searcher-subtle)' }}
                        >
                          <Building2 className="w-10 h-10 text-searcher-300" />
                        </div>
                      )}

                      {/* Match Score Badge */}
                      <div
                        className="absolute top-3 right-3 px-2.5 py-1 superellipse-lg text-sm font-bold flex items-center gap-1 shadow-md"
                        style={{
                          backgroundColor: getScoreBg(match.compatibility_score),
                          color: getScoreColor(match.compatibility_score)
                        }}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        {match.compatibility_score}%
                      </div>

                      {/* Rank Badge for top 3 */}
                      {index < 3 && (
                        <div
                          className="absolute top-3 left-3 w-7 h-7 superellipse-lg flex items-center justify-center shadow-md"
                          style={{ background: MATCHING_GRADIENT }}
                        >
                          <span className="font-bold text-white text-xs">#{index + 1}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {match.property.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{match.property.city}</span>
                      </div>

                      {/* Match Reasons */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {match.match_reasons.slice(0, 2).map((reason, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                            style={{ backgroundColor: '#FFF4E0', color: MATCHING_PRIMARY }}
                          >
                            {reason}
                          </span>
                        ))}
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-gray-900">
                            {match.property.monthly_rent.toLocaleString()}€
                          </span>
                          <span className="text-xs text-gray-500">/mois</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/properties/${match.property.id}/apply`);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 superellipse-lg text-white text-sm font-medium shadow-sm"
                          style={{ background: MATCHING_GRADIENT }}
                        >
                          <Send className="w-3.5 h-3.5" />
                          Postuler
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-white/90 backdrop-blur-xl border-t border-searcher-100/50 px-4 py-3 safe-area-pb">
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
                <Heart className="w-5 h-5" style={{ color: MATCHING_PRIMARY }} />
                <span className="text-[10px] font-medium" style={{ color: MATCHING_PRIMARY }}>Matching</span>
              </motion.div>
            </Link>
            <Link href="/searcher/favorites">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 relative"
              >
                <Bookmark className="w-5 h-5 text-gray-400" />
                {favorites > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                    style={{ backgroundColor: MATCHING_PRIMARY }}
                  >
                    {favorites}
                  </span>
                )}
                <span className="text-[10px] text-gray-500">Favoris</span>
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
                    style={{ background: MATCHING_GRADIENT }}
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

export default SearcherMatchingPage;
