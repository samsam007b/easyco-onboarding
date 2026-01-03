'use client';

import { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import { useLanguage } from '@/lib/i18n/use-language';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Users,
  UserPlus,
  ArrowLeft,
  Plus,
  Settings,
  MessageCircle,
  Crown,
  Sparkles,
  ChevronRight,
  MapPin,
  Euro,
  Calendar,
  Home,
  Search,
  Heart,
  Bookmark,
  UsersRound,
  Target,
} from 'lucide-react';

// V3-FUN Groups Palette - Searcher Soft Gradient (community feel)
const GROUPS_GRADIENT = 'linear-gradient(135deg, #FFF9E6 0%, #FFD080 100%)'; // --gradient-searcher-soft
const GROUPS_PRIMARY = '#FFD080';
const GROUPS_DARK = '#FFA040';
const GROUPS_LIGHT = '#FFF9E6';
const CARD_BG_GRADIENT = 'linear-gradient(135deg, #FFFEF5 0%, #FFF9E6 100%)';
const ACCENT_SHADOW = 'rgba(255, 208, 128, 0.15)';
// Searcher colors for nav
const SEARCHER_GRADIENT = 'linear-gradient(135deg, #FFA040 0%, #FFB85C 50%, #FFD080 100%)';
const SEARCHER_PRIMARY = '#FFA040';
// Semantic Colors
const SEMANTIC_SUCCESS = '#10B981';
const SEMANTIC_AMBER = '#F59E0B';
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

interface SearchGroup {
  id: string;
  name: string;
  description?: string;
  budget_min?: number;
  budget_max?: number;
  target_city?: string;
  target_move_date?: string;
  member_count: number;
  is_owner: boolean;
  created_at: string;
  members: {
    id: string;
    full_name: string;
    avatar_url?: string;
    is_admin: boolean;
  }[];
}

const SearcherGroupsPage = memo(function SearcherGroupsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<SearchGroup[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [favorites, setFavorites] = useState(0);

  useEffect(() => {
    const loadGroups = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Load sidebar stats
      const [messagesRes, favoritesRes] = await Promise.all([
        supabase.rpc('get_unread_count', { target_user_id: user.id }),
        supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);

      setUnreadMessages(messagesRes.data || 0);
      setFavorites(favoritesRes.count || 0);

      // Mock groups data
      const mockGroups: SearchGroup[] = [
        {
          id: '1',
          name: 'Coloc Bruxelles Centre',
          description: 'On cherche un appart sympa à 3 pour septembre',
          budget_min: 300,
          budget_max: 500,
          target_city: 'Bruxelles',
          target_move_date: '2024-09-01',
          member_count: 3,
          is_owner: true,
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          members: [
            { id: '1', full_name: 'Vous', avatar_url: undefined, is_admin: true },
            { id: '2', full_name: 'Marie D.', avatar_url: 'https://randomuser.me/api/portraits/women/32.jpg', is_admin: false },
            { id: '3', full_name: 'Thomas L.', avatar_url: 'https://randomuser.me/api/portraits/men/45.jpg', is_admin: false }
          ]
        },
        {
          id: '2',
          name: 'Recherche Ixelles',
          description: 'Duo à la recherche d\'un 2 chambres à Ixelles',
          budget_max: 1200,
          target_city: 'Ixelles',
          member_count: 2,
          is_owner: false,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          members: [
            { id: '4', full_name: 'Sophie M.', avatar_url: 'https://randomuser.me/api/portraits/women/68.jpg', is_admin: true },
            { id: '1', full_name: 'Vous', avatar_url: undefined, is_admin: false }
          ]
        }
      ];

      setGroups(mockGroups);
      setLoading(false);
    };
    loadGroups();
  }, [supabase, router]);

  const totalMembers = groups.reduce((sum, g) => sum + g.member_count, 0);
  const adminGroups = groups.filter(g => g.is_owner).length;

  // Stats cards
  const statsCards = [
    {
      icon: UsersRound,
      value: groups.length,
      label: 'Groupes',
      color: GROUPS_PRIMARY,
      bgColor: '#FFF9E6',
    },
    {
      icon: Users,
      value: totalMembers,
      label: 'Membres',
      color: SEMANTIC_BLUE,
      bgColor: '#DBEAFE',
    },
    {
      icon: Crown,
      value: adminGroups,
      label: 'Admin',
      color: SEARCHER_PRIMARY,
      bgColor: '#FEF3C7',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/8 via-amber-300/5 to-orange-200/3" />
          <div className="absolute top-0 -left-4 w-96 h-96 bg-yellow-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-amber-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-orange-200/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />
          <div className="absolute inset-0 backdrop-blur-3xl bg-white/60" />
        </div>
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium mt-4">Chargement de vos groupes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 md:pb-0">
      {/* Glassmorphism background - Searcher Soft for Groups */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/8 via-amber-300/5 to-orange-200/3" />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-yellow-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-amber-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-orange-200/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/60" />
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50">
        <div className="bg-white/80 backdrop-blur-xl border-b border-amber-100/50">
          <div className="max-w-4xl mx-auto px-4 py-3">
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
                    style={{ background: GROUPS_GRADIENT }}
                  >
                    <UsersRound className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-gray-900">Mes Groupes</h1>
                    <p className="text-xs text-gray-500">{groups.length} groupe{groups.length !== 1 ? 's' : ''} de recherche</p>
                  </div>
                </div>
              </div>

              {/* Right: Create Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/searcher/groups/create')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-md"
                style={{ background: GROUPS_GRADIENT }}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Créer un groupe</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-md border-b border-amber-100/30"
        >
          <div className="max-w-4xl mx-auto px-4 py-2">
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
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {groups.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-3xl bg-white shadow-lg"
            style={{ boxShadow: `0 8px 32px ${ACCENT_SHADOW}` }}
          >
            {/* Decorative circles */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20"
              style={{ background: GROUPS_GRADIENT }}
            />

            <div className="relative flex flex-col items-center justify-center py-16 px-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                style={{ background: GROUPS_GRADIENT }}
              >
                <UserPlus className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Cherchez en groupe !
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                Créez un groupe avec vos futurs colocataires pour rechercher ensemble et partager les favoris
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/searcher/groups/create')}
                className="px-6 py-3 rounded-xl text-white font-medium shadow-md flex items-center gap-2"
                style={{ background: GROUPS_GRADIENT }}
              >
                <Sparkles className="w-4 h-4" />
                Créer mon premier groupe
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {groups.map((group) => (
                <motion.div
                  key={group.id}
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-amber-200 transition-all cursor-pointer"
                    onClick={() => router.push(`/searcher/groups/${group.id}`)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        {/* Left: Group Info */}
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                            style={{ background: GROUPS_GRADIENT }}
                          >
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-gray-900">{group.name}</h3>
                              {group.is_owner && (
                                <span
                                  className="px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1"
                                  style={{ backgroundColor: '#FEF3C7', color: SEARCHER_PRIMARY }}
                                >
                                  <Crown className="w-3 h-3" />
                                  Admin
                                </span>
                              )}
                            </div>
                            {group.description && (
                              <p className="text-gray-500 text-sm mt-0.5 line-clamp-1">{group.description}</p>
                            )}

                            {/* Criteria Pills */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {group.target_city && (
                                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {group.target_city}
                                </span>
                              )}
                              {(group.budget_min || group.budget_max) && (
                                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium flex items-center gap-1">
                                  <Euro className="w-3 h-3" />
                                  {group.budget_min && `${group.budget_min}€`}
                                  {group.budget_min && group.budget_max && ' - '}
                                  {group.budget_max && `${group.budget_max}€`}
                                  /pers
                                </span>
                              )}
                              {group.target_move_date && (
                                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(group.target_move_date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                                </span>
                              )}
                            </div>

                            {/* Members */}
                            <div className="flex items-center gap-2 mt-3">
                              <div className="flex -space-x-2">
                                {group.members.slice(0, 4).map((member, i) => (
                                  <div
                                    key={member.id}
                                    className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden"
                                    style={{ zIndex: 4 - i }}
                                  >
                                    {member.avatar_url ? (
                                      <Image
                                        src={member.avatar_url}
                                        alt={member.full_name}
                                        width={28}
                                        height={28}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-[10px] font-medium text-gray-600">
                                        {member.full_name.charAt(0)}
                                      </span>
                                    )}
                                  </div>
                                ))}
                                {group.member_count > 4 && (
                                  <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-600">
                                    +{group.member_count - 4}
                                  </div>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                {group.member_count} membre{group.member_count > 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-1.5">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/messages?group=${group.id}`);
                              }}
                              className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center hover:bg-amber-100 transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" style={{ color: GROUPS_PRIMARY }} />
                            </motion.button>
                            {group.is_owner && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/searcher/groups/${group.id}/settings`);
                                }}
                                className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                              >
                                <Settings className="w-4 h-4 text-gray-500" />
                              </motion.button>
                            )}
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-300" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
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
                className="flex flex-col items-center gap-1 relative"
              >
                <Bookmark className="w-5 h-5 text-gray-400" />
                {favorites > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                    style={{ backgroundColor: SEMANTIC_PINK }}
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

export default SearcherGroupsPage;
