'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Search,
  ArrowLeft,
  Bell,
  Bookmark,
} from 'lucide-react';
import VerificationBadge, { getVerificationLevel, type VerificationLevel } from '@/components/profile/VerificationBadge';

// V3-FUN Searcher Palette
const SEARCHER_GRADIENT = 'linear-gradient(135deg, #F59E0B 0%, #FFB10B 50%, #FCD34D 100%)';
const SEARCHER_GRADIENT_SOFT = 'linear-gradient(135deg, #FFF9E6 0%, #FEF3C7 100%)';
const SEARCHER_DARK = '#F59E0B';

// Dynamically import browse content for better performance
const BrowseContent = dynamic(
  () => import('@/components/browse/BrowseContent'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <LoadingHouse size={48} />
      </div>
    )
  }
);

interface UserData {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

interface QuickStats {
  favorites: number;
  unreadMessages: number;
  verificationLevel: VerificationLevel;
}

export default function SearcherExplorePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStats>({
    favorites: 0,
    unreadMessages: 0,
    verificationLevel: 'starter',
  });

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Parallel fetch for better performance
      const [profileRes, favoritesRes, unreadRes, userProfileRes] = await Promise.all([
        supabase.from('users').select('full_name, email, avatar_url').eq('id', user.id).single(),
        supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.rpc('get_unread_count', { target_user_id: user.id }),
        supabase.from('user_profiles').select('email_verified, phone_verified, id_verified').eq('user_id', user.id).single(),
      ]);

      if (profileRes.data) {
        setUserData({ id: user.id, ...profileRes.data });
      }

      // Calculate verification level
      const verificationLevel = getVerificationLevel({
        email_verified: userProfileRes.data?.email_verified,
        phone_verified: userProfileRes.data?.phone_verified,
        id_verified: userProfileRes.data?.id_verified,
      });

      setQuickStats({
        favorites: favoritesRes.count || 0,
        unreadMessages: unreadRes.data || 0,
        verificationLevel,
      });

      setLoading(false);
    };
    init();
  }, [supabase, router]);

  if (loading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-yellow-50/30">
        <LoadingHouse size={80} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-yellow-50/20">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-amber-100/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Back + Brand */}
            <div className="flex items-center gap-3">
              <Link href="/searcher">
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-amber-50">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
                  style={{ background: SEARCHER_GRADIENT }}
                >
                  <Search className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-gray-900 text-sm">Explorer</h1>
                  <p className="text-[10px] text-gray-500">Trouve ton logement idéal</p>
                </div>
              </div>
            </div>

            {/* Right: Quick Actions + Avatar */}
            <div className="flex items-center gap-2">
              {/* Favorites pill */}
              <Link href="/searcher/favorites">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-100 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5 text-pink-500" />
                  <span className="text-xs font-semibold text-pink-600">{quickStats.favorites}</span>
                </motion.div>
              </Link>

              {/* Messages */}
              <Link href="/messages">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-gray-600" />
                  {quickStats.unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {quickStats.unreadMessages}
                    </span>
                  )}
                </motion.div>
              </Link>

              {/* Avatar */}
              <Link href="/profile">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-amber-200 shadow-sm">
                    {userData.avatar_url ? (
                      <Image
                        src={userData.avatar_url}
                        alt={userData.full_name}
                        width={36}
                        height={36}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: SEARCHER_GRADIENT_SOFT }}
                      >
                        <span className="text-sm font-bold" style={{ color: SEARCHER_DARK }}>
                          {userData.full_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5">
                    <VerificationBadge level={quickStats.verificationLevel} size="sm" />
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Browse Content */}
      <main>
        <BrowseContent userId={userData.id} />
      </main>
    </div>
  );
}
