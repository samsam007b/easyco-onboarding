'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Bookmark,
  ChevronDown,
  MapPin,
  Euro,
  Users,
  Settings,
  Target,
  Edit3,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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

  const [isLoading, setIsLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const [stats, setStats] = useState<DashboardStats>({
    favoritesCount: 0,
    topMatchesCount: 0,
    applicationsCount: 0,
    profileCompletion: 0,
    unreadMessages: 0,
    likedProfiles: 0,
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

      // Calculate profile completion & load preferences
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      let profileCompletion = 0;
      if (profile) {
        const fields = [
          profile.first_name,
          profile.last_name,
          profile.date_of_birth,
          profile.occupation,
          profile.bio,
          profile.profile_photo_url,
          profile.min_budget,
          profile.max_budget,
          profile.preferred_cities,
          profile.cleanliness_level,
          profile.noise_tolerance,
          profile.smoking !== undefined,
          profile.pets !== undefined
        ];
        const completedFields = fields.filter(field => field !== null && field !== undefined && field !== '').length;
        profileCompletion = Math.round((completedFields / fields.length) * 100);

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
      });

    } catch (error) {
      logger.error('Error loading dashboard', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-1 pb-2">
      {/* Main Unified Card - Glassmorphism Design with Searcher Colors */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br from-yellow-100/60 via-amber-50/50 to-orange-50/40 border-2 border-yellow-300/60"
        style={{
          background: 'linear-gradient(135deg, rgba(254, 249, 195, 0.7) 0%, rgba(254, 243, 199, 0.6) 50%, rgba(255, 237, 213, 0.5) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="p-4">
          {/* Header: Profile + Quick actions */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-yellow-500/50 shadow-sm">
                  {userData.avatar_url ? (
                    <Image
                      src={userData.avatar_url}
                      alt={userData.full_name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-yellow-200/40 flex items-center justify-center">
                      <span className="text-yellow-800 text-lg font-bold">
                        {userData.full_name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                {/* Profile completion badge */}
                {stats.profileCompletion < 100 && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-yellow-500 flex items-center justify-center shadow-sm">
                    <span className="text-[9px] font-bold text-yellow-700">{stats.profileCompletion}%</span>
                  </div>
                )}
              </div>

              {/* Welcome text */}
              <div>
                <h1 className="text-base font-bold text-gray-900">
                  Salut, {userData.full_name.split(' ')[0]} !
                </h1>
                <p className="text-xs text-gray-700 font-medium">
                  {preferences.cities.length > 0
                    ? `Recherche à ${preferences.cities.slice(0, 2).join(', ')}`
                    : 'Configure ta recherche'}
                </p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/dashboard/my-profile')}
                className="p-2 rounded-lg bg-white/60 hover:bg-white/80 transition border border-yellow-300/50 shadow-sm"
              >
                <Edit3 className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={() => router.push('/settings')}
                className="p-2 rounded-lg bg-white/60 hover:bg-white/80 transition border border-yellow-300/50 shadow-sm"
              >
                <Settings className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>

          {/* KPIs Row - Glassmorphism design */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {/* Groupes / Matchs */}
            <button
              onClick={() => router.push('/dashboard/searcher/groups')}
              className="bg-white/50 hover:bg-white/70 border border-yellow-300/50 rounded-xl py-3 px-2 transition text-center shadow-sm backdrop-blur-sm"
            >
              <Users className="w-5 h-5 text-yellow-700 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{stats.likedProfiles}</p>
              <p className="text-[10px] text-gray-700 font-semibold">Groupes</p>
            </button>

            {/* Favoris */}
            <button
              onClick={() => router.push('/dashboard/searcher/favorites')}
              className="bg-white/50 hover:bg-white/70 border border-yellow-300/50 rounded-xl py-3 px-2 transition text-center shadow-sm backdrop-blur-sm"
            >
              <Bookmark className="w-5 h-5 text-yellow-700 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{stats.favoritesCount}</p>
              <p className="text-[10px] text-gray-700 font-semibold">Favoris</p>
            </button>

            {/* Messages */}
            <button
              onClick={() => router.push('/dashboard/searcher/messages')}
              className="bg-white/50 hover:bg-white/70 border border-yellow-300/50 rounded-xl py-3 px-2 transition text-center relative shadow-sm backdrop-blur-sm"
            >
              {stats.unreadMessages > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-[9px] font-bold text-white">{stats.unreadMessages}</span>
                </div>
              )}
              <MessageCircle className="w-5 h-5 text-yellow-700 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{stats.unreadMessages}</p>
              <p className="text-[10px] text-gray-700 font-semibold">Messages</p>
            </button>

            {/* Profil */}
            <button
              onClick={() => router.push('/dashboard/my-profile')}
              className="bg-white/50 hover:bg-white/70 border border-yellow-300/50 rounded-xl py-3 px-2 transition text-center shadow-sm backdrop-blur-sm"
            >
              {stats.profileCompletion >= 100 ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-1" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-700 mx-auto mb-1" />
              )}
              <p className="text-2xl font-bold text-gray-900">{stats.profileCompletion}%</p>
              <p className="text-[10px] text-gray-700 font-semibold">Profil</p>
            </button>
          </div>

          {/* Collapsible Sections - Glassmorphism design */}
          <div className="space-y-2">
            {/* Ma Recherche Idéale */}
            <div className="bg-white/50 border border-yellow-300/50 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm">
              <button
                onClick={() => toggleSection('search')}
                className="w-full px-3 py-3 flex items-center justify-between hover:bg-white/30 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-100/60 flex items-center justify-center border border-yellow-300/50">
                    <Target className="w-4 h-4 text-yellow-700" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">Ma Recherche</p>
                    <p className="text-xs text-gray-700 font-medium">
                      <span className="font-bold">{preferences.minBudget}-{preferences.maxBudget}€</span> • {preferences.cities.slice(0, 2).join(', ') || 'Non défini'}
                    </p>
                  </div>
                </div>
                <ChevronDown className={cn(
                  'w-4 h-4 text-gray-600 transition-transform',
                  expandedSection === 'search' && 'rotate-180'
                )} />
              </button>

              <AnimatePresence>
                {expandedSection === 'search' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-yellow-300/30"
                  >
                    <div className="p-3 space-y-3 bg-white/30">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 flex items-center gap-2 font-medium">
                          <Euro className="w-4 h-4" /> Budget
                        </span>
                        <span className="font-bold text-gray-900 text-base">{preferences.minBudget}€ - {preferences.maxBudget}€</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 flex items-center gap-2 font-medium">
                          <MapPin className="w-4 h-4" /> Villes
                        </span>
                        <span className="font-bold text-gray-900">{preferences.cities.join(', ') || 'Non définies'}</span>
                      </div>
                      <Button
                        onClick={() => router.push('/onboarding/searcher-preferences')}
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold border border-yellow-600 shadow-sm"
                      >
                        <Edit3 className="w-3 h-3 mr-2" />
                        Modifier
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
