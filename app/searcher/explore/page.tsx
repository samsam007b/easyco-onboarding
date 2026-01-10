'use client';

import { useState, useEffect, memo } from 'react';
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
  Heart,
  MapPin,
  Sparkles,
  TrendingUp,
  Home,
  MessageCircle,
  Star,
  Filter,
  Map,
  List,
  ChevronRight,
} from 'lucide-react';
import VerificationBadge, { getVerificationLevel, type VerificationLevel } from '@/components/profile/VerificationBadge';

// V3 Color System - Using CSS Variables from globals.css
// All colors now reference var(--searcher-*) and var(--gradient-searcher-*)

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } }
};

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
  propertiesViewed: number;
  matchScore: number;
}

const SearcherExplorePage = memo(function SearcherExplorePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStats>({
    favorites: 0,
    unreadMessages: 0,
    verificationLevel: 'starter',
    propertiesViewed: 0,
    matchScore: 0,
  });

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Parallel fetch for better performance
      const [profileRes, favoritesRes, unreadRes, userProfileRes, viewsRes] = await Promise.all([
        supabase.from('users').select('full_name, email, avatar_url').eq('id', user.id).single(),
        supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.rpc('get_unread_count', { target_user_id: user.id }),
        supabase.from('user_profiles').select('email_verified, phone_verified, id_verified').eq('user_id', user.id).single(),
        supabase.from('property_views').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
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
        propertiesViewed: viewsRes.count || 0,
        matchScore: Math.floor(Math.random() * 20) + 75, // Placeholder
      });

      setLoading(false);
    };
    init();
  }, [supabase, router]);

  // Quick stats cards configuration
  const statsCards = [
    {
      icon: Bookmark,
      value: quickStats.favorites,
      label: 'Favoris',
      color: '#EC4899',
      bgColor: '#FCE7F3',
      href: '/searcher/favorites',
    },
    {
      icon: TrendingUp,
      value: quickStats.propertiesViewed,
      label: 'Vus',
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      href: null,
    },
    {
      icon: Sparkles,
      value: `${quickStats.matchScore}%`,
      label: 'Match moyen',
      color: '#7CB89B',
      bgColor: '#D1FAE5',
      href: '/searcher/matching',
    },
  ];

  if (loading || !userData) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Glassmorphism background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-searcher-500/5" />
          <div className="absolute top-0 -left-4 w-96 h-96 bg-searcher-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-searcher-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-searcher-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />
          <div className="absolute inset-0 backdrop-blur-3xl bg-white/60" />
        </div>
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Glassmorphism background - V3 Searcher */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-searcher-500/8 via-searcher-400/5 to-searcher-300/3" />

        {/* Animated gradient blobs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-searcher-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-searcher-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-searcher-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />

        {/* Glass effect overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/60" />
      </div>

      {/* Sticky Header - V3-fun Style */}
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
                    style={{ background: 'var(--gradient-searcher)' }}
                  >
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-gray-900">Explorer</h1>
                    <p className="text-xs text-gray-500">Trouve ta coloc idéale</p>
                  </div>
                </div>
              </div>

              {/* Right: Quick Actions */}
              <div className="flex items-center gap-2">
                {/* Messages */}
                <Link href="/messages">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-10 h-10 superellipse-xl bg-white flex items-center justify-center shadow-sm border border-gray-100 cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                    {quickStats.unreadMessages > 0 && (
                      <span
                        className="absolute -top-1 -right-1 w-5 h-5 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                        style={{ background: 'var(--gradient-searcher)' }}
                      >
                        {quickStats.unreadMessages}
                      </span>
                    )}
                  </motion.div>
                </Link>

                {/* Avatar */}
                <Link href="/profile/searcher">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative cursor-pointer"
                  >
                    <div
                      className="w-10 h-10 superellipse-xl overflow-hidden shadow-sm border-2 border-searcher-500"
                    >
                      {userData.avatar_url ? (
                        <Image
                          src={userData.avatar_url}
                          alt={userData.full_name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: 'var(--gradient-searcher-subtle)' }}
                        >
                          <span className="text-sm font-bold text-searcher-500">
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
        </div>

        {/* Stats Bar - V3-fun Style */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-md border-b border-searcher-100/30"
        >
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Mini Stats */}
              <div className="flex items-center gap-3">
                {statsCards.map((stat, index) => {
                  const content = (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-2 px-3 py-1.5 superellipse-xl bg-white shadow-sm border border-gray-100 cursor-pointer"
                    >
                      <div
                        className="w-7 h-7 superellipse-lg flex items-center justify-center"
                        style={{ backgroundColor: stat.bgColor }}
                      >
                        <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-bold text-gray-900 text-sm">{stat.value}</span>
                        <span className="text-[10px] text-gray-500 hidden sm:inline">{stat.label}</span>
                      </div>
                    </motion.div>
                  );

                  return stat.href ? (
                    <Link key={index} href={stat.href}>{content}</Link>
                  ) : (
                    <div key={index}>{content}</div>
                  );
                })}
              </div>

              {/* Quick Links */}
              <div className="hidden md:flex items-center gap-2">
                <Link href="/searcher/alerts">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 superellipse-xl text-sm font-medium text-gray-600 hover:bg-searcher-50 transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    Alertes
                  </motion.button>
                </Link>
                <Link href="/searcher/matching">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 superellipse-xl text-sm font-medium text-white"
                    style={{ background: 'var(--gradient-searcher)' }}
                  >
                    <Heart className="w-4 h-4" />
                    Matching
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <BrowseContent userId={userData.id} />
      </main>

      {/* Mobile Bottom Bar - Quick Actions */}
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
                <Search className="w-5 h-5 text-searcher-500" />
                <span className="text-[10px] font-medium text-searcher-500">Explorer</span>
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
                {quickStats.favorites > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {quickStats.favorites}
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
                {quickStats.unreadMessages > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                    style={{ background: 'var(--gradient-searcher)' }}
                  >
                    {quickStats.unreadMessages}
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

export default SearcherExplorePage;
