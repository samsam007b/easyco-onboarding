'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Search,
  Heart,
  Users,
  MessageCircle,
  Bell,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  ChevronDown,
  Bookmark,
  Save,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/notifications/NotificationBell';
import { createClient } from '@/lib/auth/supabase-client';

interface ModernSearcherHeaderProps {
  profile: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  stats?: {
    favoritesCount?: number;
    matchesCount?: number;
    unreadMessages?: number;
  };
}

export default function ModernSearcherHeader({
  profile,
  stats = {}
}: ModernSearcherHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(stats.favoritesCount || 0);

  const {
    matchesCount = 0,
    unreadMessages = 0
  } = stats;

  // Load and subscribe to favorites count
  useEffect(() => {
    const loadFavoritesCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setFavoritesCount(count || 0);
    };

    loadFavoritesCount();

    // Real-time subscription
    const channel = supabase
      .channel('favorites-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'favorites'
      }, () => {
        loadFavoritesCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const navItems = [
    {
      id: 'dashboard',
      href: '/dashboard/searcher',
      label: 'Accueil',
      icon: Home,
    },
    {
      id: 'browse',
      href: '/properties/browse',
      label: 'Explorer',
      icon: Search,
    },
    {
      id: 'favorites',
      href: '/dashboard/searcher/favorites',
      label: 'Favoris',
      icon: Bookmark,
      badge: favoritesCount > 0 ? favoritesCount : null,
    },
    {
      id: 'matches',
      href: '/dashboard/searcher/top-matches',
      label: 'Matchs',
      icon: Heart,
      badge: matchesCount > 0 ? matchesCount : null,
    },
    {
      id: 'applications',
      href: '/dashboard/searcher/my-applications',
      label: 'Candidatures',
      icon: Sparkles,
    },
    {
      id: 'payments',
      href: '/payments',
      label: 'Paiements',
      icon: CreditCard,
    },
    {
      id: 'messages',
      href: '/messages',
      label: 'Messages',
      icon: MessageCircle,
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
  ];

  const handleLogout = async () => {
    setShowProfileMenu(false);
    router.push('/auth/logout');
  };

  return (
    <header className="sticky top-0 z-50 header-gray-warm shadow-lg">
      {/* Unified gray warm header with subtle grain texture */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-16">

          {/* Logo tricolore signature EasyCo */}
          <Link
            href="/dashboard/searcher"
            className="flex items-center gap-3 group"
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all"
              style={{
                background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)'
              }}
            >
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                EasyCo
              </h1>
              <span className="text-xs font-medium text-white/70">
                Chercheur
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <div key={item.id} className="relative">
                  {/* Active Indicator avec dégradé jaune subtil */}
                  {isActive && (
                    <motion.div
                      layoutId="searcher-active-nav"
                      className="absolute inset-0 rounded-xl -z-10"
                      style={{
                        background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFBEA 100%)'
                      }}
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}

                  <Link
                    href={item.href}
                    prefetch={true}
                    className={cn(
                      "relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "text-white font-semibold"
                        : "text-white/70 hover:bg-white/10 text-hover-gradient"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge
                        className="ml-1 text-white border-0 h-5 min-w-[20px] px-1.5"
                        style={{
                          background: 'linear-gradient(135deg, #FFD249 0%, #FFC107 100%)'
                        }}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Favorites Quick Access avec dégradé jaune subtil */}
            {favoritesCount > 0 && (
              <Link
                href="/dashboard/searcher/favorites"
                className="hidden xl:flex items-center gap-2 px-4 py-2 rounded-xl border border-yellow-200/50 hover:shadow-md transition-all"
                style={{
                  background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFBEA 100%)'
                }}
              >
                <Bookmark className="w-4 h-4 text-yellow-700" />
                <span className="text-sm font-medium text-yellow-900">{favoritesCount} favoris</span>
              </Link>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl hover:bg-yellow-50 transition-all"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {(matchesCount > 0 || unreadMessages > 0) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowNotifications(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-yellow-200/50 py-2 z-20"
                    >
                      <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {matchesCount > 0 && (
                          <Link
                            href="/dashboard/searcher/top-matches"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-yellow-50 transition"
                            onClick={() => setShowNotifications(false)}
                          >
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                              <Heart className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {matchesCount} nouveau{matchesCount > 1 ? 'x' : ''} match{matchesCount > 1 ? 's' : ''}
                              </p>
                              <p className="text-xs text-gray-500">Propriétés compatibles avec vous</p>
                            </div>
                          </Link>
                        )}
                        {(matchesCount === 0 && unreadMessages === 0) && (
                          <div className="px-4 py-8 text-center text-gray-500">
                            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">Aucune notification</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-yellow-50 transition-all group"
              >
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-yellow-200 group-hover:border-yellow-400 transition-colors"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-yellow-200"
                    style={{
                      background: 'linear-gradient(135deg, #FFD249 0%, #FFC107 100%)'
                    }}
                  >
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-orange-900 transition-colors hidden md:block" />
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-yellow-200/50 py-2 z-20"
                    >
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="font-semibold text-gray-900">{profile.full_name}</p>
                        <p className="text-sm text-gray-500 truncate">{profile.email}</p>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-yellow-50 transition"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700 font-medium">Mon Profil</span>
                      </Link>

                      <Link
                        href="/dashboard/searcher/saved-searches"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-yellow-50 transition"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Save className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700 font-medium">Recherches Sauvegardées</span>
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-yellow-50 transition"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700 font-medium">Paramètres</span>
                      </Link>

                      <div className="my-2 border-t border-gray-200" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition text-red-600"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Déconnexion</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-yellow-50 transition-all"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-yellow-200/50"
            >
              <nav className="py-4 flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl transition-all",
                        isActive
                          ? "bg-gradient-to-r from-yellow-100 to-orange-50 text-orange-900 font-semibold"
                          : "text-gray-700 hover:bg-yellow-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </div>
                      {item.badge && (
                        <Badge variant="error" className="bg-orange-500 hover:bg-orange-500 text-white border-0">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
