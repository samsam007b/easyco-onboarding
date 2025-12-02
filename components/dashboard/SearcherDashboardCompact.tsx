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
} from 'lucide-react';
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

  if (isLoading) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-48 bg-[#FFF9E6]/40 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-1 pb-2">
      {/* Background with grain texture */}
      <div className="relative overflow-hidden rounded-2xl" style={{
        background: 'rgba(255, 249, 230, 0.6)',
      }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        <div className="relative p-5">
          {/* Floating White Card with Glass Effect */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/80 shadow-2xl p-4"
          >
            {/* Gradient blob inside */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFF9E6]/60 rounded-full blur-2xl" />

            <div className="relative">
          {/* Header: Profile + Quick actions */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-[#FFF9E6] border-2 border-white/70 shadow-lg flex items-center justify-center grain-medium overflow-hidden">
                  {userData.avatar_url ? (
                    <Image
                      src={userData.avatar_url}
                      alt={userData.full_name}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full absolute inset-0"
                    />
                  ) : (
                    <span className="text-sm font-bold text-[#F9A825] relative z-10">
                      {userData.full_name.charAt(0)}
                    </span>
                  )}
                </div>
                {/* Profile completion badge */}
                {stats.profileCompletion < 100 && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-[#FFC107] flex items-center justify-center shadow-sm">
                    <span className="text-[9px] font-bold text-[#F9A825]">{stats.profileCompletion}%</span>
                  </div>
                )}
              </div>

              {/* Welcome text */}
              <div>
                <h1 className="text-sm font-bold text-gray-900">
                  Salut, {userData.full_name.split(' ')[0]} !
                </h1>
                <p className="text-[10px] text-gray-600">
                  {preferences.cities.length > 0
                    ? `${preferences.cities.slice(0, 2).join(', ')} • ${preferences.minBudget}-${preferences.maxBudget}€`
                    : 'Configure ta recherche'}
                </p>
              </div>
            </div>
          </div>

          {/* Stats inline */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Groupes', value: stats.likedProfiles.toString(), icon: Users, route: '/dashboard/searcher/groups' },
              { label: 'Favoris', value: stats.favoritesCount.toString(), icon: Bookmark, route: '/dashboard/searcher/favorites' },
              { label: 'Messages', value: stats.unreadMessages.toString(), icon: MessageCircle, route: '/dashboard/searcher/messages', badge: stats.unreadMessages },
              { label: 'Profil', value: `${stats.profileCompletion}%`, icon: stats.profileCompletion >= 100 ? CheckCircle2 : Target, route: '/dashboard/my-profile' }
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <button
                  key={stat.label}
                  onClick={() => router.push(stat.route)}
                  className="relative rounded-2xl p-2.5 text-center overflow-hidden shadow-sm border border-[#FFC107]/30 bg-[#FFF9E6] transition-transform hover:scale-105"
                >
                  <div className="absolute inset-0 grain-subtle opacity-40" />
                  {stat.badge && stat.badge > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center shadow-md z-10">
                      <span className="text-[9px] font-bold text-white">{stat.badge}</span>
                    </div>
                  )}
                  <div className="relative">
                    <Icon className="w-4 h-4 mx-auto mb-1 text-[#F9A825]" />
                    <p className="text-base font-bold text-gray-900">{stat.value}</p>
                    <p className="text-[9px] text-gray-600 font-medium">{stat.label}</p>
                  </div>
                </button>
              );
            })}
          </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
