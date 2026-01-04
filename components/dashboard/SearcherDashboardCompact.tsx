'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Bookmark,
  Users,
  Target,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Search,
  Calendar,
  Home,
} from 'lucide-react';
import Image from 'next/image';
import { calculateProfileCompletion, type UserProfile } from '@/lib/profile/profile-completion';
import VerificationBadge, { getVerificationLevel, type VerificationLevel } from '@/components/profile/VerificationBadge';
import { useLanguage } from '@/lib/i18n/use-language';

// V3-FUN Searcher Palette (Amber/Gold theme)
const SEARCHER_GRADIENT = 'linear-gradient(135deg, #F59E0B 0%, #FFB10B 50%, #FCD34D 100%)';
const SEARCHER_GRADIENT_SOFT = 'linear-gradient(135deg, #FFF9E6 0%, #FEF3C7 100%)';
const SEARCHER_PRIMARY = '#FFB10B';
const SEARCHER_DARK = '#F59E0B';
const ACCENT_SHADOW = 'rgba(255, 177, 11, 0.15)';
const SEMANTIC_SUCCESS = '#7CB89B';

interface SearcherDashboardCompactProps {
  userId: string;
  userData: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

interface DashboardStats {
  favoritesCount: number;
  topMatchesCount: number;
  applicationsCount: number;
  profileCompletion: number;
  unreadMessages: number;
  likedProfiles: number;
  verificationLevel: VerificationLevel;
}

interface SearchPreferences {
  cities: string[];
  minBudget: number;
  maxBudget: number;
  moveInDate?: string;
}

export default function SearcherDashboardCompact({ userId, userData }: SearcherDashboardCompactProps) {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const searcher = getSection('dashboard')?.searcher;

  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats>({
    favoritesCount: 0,
    topMatchesCount: 0,
    applicationsCount: 0,
    profileCompletion: 0,
    unreadMessages: 0,
    likedProfiles: 0,
    verificationLevel: 'starter',
  });

  const [preferences, setPreferences] = useState<SearchPreferences>({
    cities: [],
    minBudget: 0,
    maxBudget: 2000,
  });


  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      // Load favorites count
      const { count: favCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Load applications count
      const { count: appCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('applicant_id', userId);

      // Load liked profiles count (from user_swipes)
      const { count: likedCount } = await supabase
        .from('user_swipes')
        .select('*', { count: 'exact', head: true })
        .eq('swiper_id', userId)
        .eq('action', 'like');

      // Load unread messages count
      let unreadCount = 0;
      try {
        const { data: unreadData } = await supabase
          .rpc('get_unread_count', { target_user_id: userId });
        if (unreadData !== null) {
          unreadCount = unreadData;
        }
      } catch (err) {
        logger.error('Unread count failed', err);
      }

      // Load profile and calculate completion
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Use the new profile completion calculator
      const completionResult = calculateProfileCompletion(profile as UserProfile);
      const profileCompletion = completionResult.percentage;

      // Calculate verification level
      const verificationLevel = getVerificationLevel({
        email_verified: profile?.email_verified,
        phone_verified: profile?.phone_verified,
        id_verified: profile?.id_verified,
      });

      if (profile) {
        // Set preferences from profile
        setPreferences({
          cities: profile.preferred_cities || [],
          minBudget: profile.min_budget || 0,
          maxBudget: profile.max_budget || 2000,
          moveInDate: profile.move_in_date,
        });
      }

      setStats({
        favoritesCount: favCount || 0,
        topMatchesCount: 0,
        applicationsCount: appCount || 0,
        profileCompletion,
        unreadMessages: unreadCount,
        likedProfiles: likedCount || 0,
        verificationLevel,
      });

    } catch (error) {
      logger.error('Error loading dashboard', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // Get current date formatted
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  if (isLoading) {
    return (
      <div className="px-4 pt-1 pb-2">
        <div className="relative overflow-hidden superellipse-3xl p-4" style={{ background: SEARCHER_GRADIENT_SOFT }}>
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 superellipse-2xl bg-amber-200/50" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-amber-200/50 rounded" />
                <div className="h-3 w-24 bg-amber-200/30 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 superellipse-2xl bg-white/60" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-1 pb-2">
      {/* Main Card with V3-FUN Design */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative overflow-hidden superellipse-3xl bg-white border border-amber-100/50"
        style={{
          boxShadow: `0 8px 32px ${ACCENT_SHADOW}, 0 2px 8px rgba(0,0,0,0.04)`,
        }}
      >
        {/* Decorative blobs - V3-FUN style */}
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-60"
          style={{ background: SEARCHER_GRADIENT }}
        />
        <div
          className="absolute -bottom-12 -left-8 w-28 h-28 rounded-full blur-3xl opacity-40"
          style={{ background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)' }}
        />

        <div className="relative p-4">
          {/* Header: Profile + Welcome + Date */}
          <motion.div variants={itemVariants} className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Avatar with V3-FUN styling */}
              <motion.button
                onClick={() => router.push('/dashboard/my-profile')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group cursor-pointer flex-shrink-0"
              >
                {/* Gradient ring around avatar */}
                <div
                  className="absolute -inset-0.5 superellipse-2xl opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ background: SEARCHER_GRADIENT }}
                />

                {/* Avatar container */}
                <div className="relative w-12 h-12 superellipse-xl flex items-center justify-center overflow-hidden shadow-md transition-all bg-white">
                  {userData.avatar_url ? (
                    <Image
                      src={userData.avatar_url}
                      alt={userData.full_name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: SEARCHER_GRADIENT_SOFT }}
                    >
                      <span className="text-lg font-bold" style={{ color: SEARCHER_DARK }}>
                        {userData.full_name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Verification Badge */}
                <div className="absolute -bottom-1 -right-1 z-10">
                  <VerificationBadge level={stats.verificationLevel} size="sm" />
                </div>
              </motion.button>

              {/* Welcome text with date pill */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-sm font-bold text-gray-900">
                    {searcher?.hiUser || 'Salut,'} {userData.full_name.split(' ')[0]} !
                  </h1>
                  <Sparkles className="w-3.5 h-3.5" style={{ color: SEARCHER_PRIMARY }} />
                </div>
                <div
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ background: `${SEARCHER_PRIMARY}15`, color: SEARCHER_DARK }}
                >
                  <Calendar className="w-2.5 h-2.5" />
                  {currentDate}
                </div>
              </div>
            </div>

            {/* Quick search button */}
            <motion.button
              onClick={() => router.push('/properties/browse')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 px-3 py-1.5 superellipse-xl text-white text-xs font-semibold transition-all"
              style={{
                background: SEARCHER_GRADIENT,
                boxShadow: `0 4px 12px ${ACCENT_SHADOW}`,
              }}
            >
              <Search className="w-3.5 h-3.5" />
              {searcher?.exploreButton || 'Explorer'}
            </motion.button>
          </motion.div>

          {/* Profile completion hint - only if < 100% */}
          {stats.profileCompletion < 100 && (
            <motion.button
              variants={itemVariants}
              onClick={() => router.push('/dashboard/profile-completion')}
              className="w-full mb-4 p-3 superellipse-2xl border transition-all hover:shadow-md group"
              style={{
                background: SEARCHER_GRADIENT_SOFT,
                borderColor: `${SEARCHER_PRIMARY}30`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 superellipse-xl flex items-center justify-center"
                    style={{ background: `${SEARCHER_PRIMARY}20` }}
                  >
                    <Target className="w-4.5 h-4.5" style={{ color: SEARCHER_DARK }} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-900">
                      {searcher?.completeProfile || 'Complete ton profil'}
                    </p>
                    <p className="text-[10px] text-gray-600">
                      {stats.profileCompletion}% {searcher?.completed || 'complété'} • {searcher?.betterMatches || 'Plus de matchs'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mini progress bar */}
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${stats.profileCompletion}%`,
                        background: SEARCHER_GRADIENT
                      }}
                    />
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </div>
            </motion.button>
          )}

          {/* Stats Grid - V3-FUN KPI Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-4 gap-2">
            {[
              {
                label: searcher?.groups || 'Groupes',
                value: stats.likedProfiles.toString(),
                icon: Users,
                route: '/dashboard/searcher/groups',
                color: '#8B5CF6',
                bgColor: '#8B5CF620'
              },
              {
                label: searcher?.favorites || 'Favoris',
                value: stats.favoritesCount.toString(),
                icon: Bookmark,
                route: '/dashboard/searcher/favorites',
                color: '#EC4899',
                bgColor: '#EC489920'
              },
              {
                label: searcher?.messages || 'Messages',
                value: stats.unreadMessages.toString(),
                icon: MessageCircle,
                route: '/dashboard/searcher/messages',
                badge: stats.unreadMessages,
                color: '#3B82F6',
                bgColor: '#3B82F620'
              },
              {
                label: searcher?.profileLabel || 'Profil',
                value: `${stats.profileCompletion}%`,
                icon: stats.profileCompletion >= 100 ? CheckCircle2 : Target,
                route: '/dashboard/profile-completion',
                color: stats.profileCompletion >= 100 ? SEMANTIC_SUCCESS : SEARCHER_DARK,
                bgColor: stats.profileCompletion >= 100 ? `${SEMANTIC_SUCCESS}20` : `${SEARCHER_PRIMARY}20`
              }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.button
                  key={stat.label}
                  onClick={() => router.push(stat.route)}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative superellipse-2xl p-2.5 text-center overflow-hidden bg-white transition-all"
                  style={{
                    boxShadow: `0 4px 16px ${ACCENT_SHADOW}`,
                    border: '1px solid rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Decorative circle - V3-FUN pattern */}
                  <div
                    className="absolute -top-3 -right-3 w-10 h-10 rounded-full opacity-30"
                    style={{ background: stat.bgColor }}
                  />

                  {/* Badge for unread */}
                  {stat.badge && stat.badge > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center shadow-md z-10"
                    >
                      <span className="text-[9px] font-bold text-white">{stat.badge}</span>
                    </motion.div>
                  )}

                  <div className="relative z-10">
                    {/* Icon with colored background */}
                    <div
                      className="w-8 h-8 mx-auto mb-1.5 superellipse-xl flex items-center justify-center"
                      style={{ background: stat.bgColor }}
                    >
                      <Icon className="w-4 h-4" style={{ color: stat.color }} />
                    </div>
                    <p className="text-base font-bold text-gray-900">{stat.value}</p>
                    <p className="text-[9px] text-gray-500 font-medium">{stat.label}</p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Quick Actions Row */}
          <motion.div variants={itemVariants} className="flex gap-2 mt-3">
            {[
              { label: searcher?.matching || 'Matching', icon: Home, route: '/matching/properties' },
              { label: searcher?.visits || 'Visites', icon: Calendar, route: '/dashboard/searcher/visits' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  onClick={() => router.push(action.route)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 superellipse-xl text-xs font-medium transition-all"
                  style={{
                    background: `${SEARCHER_PRIMARY}10`,
                    color: SEARCHER_DARK,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {action.label}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
