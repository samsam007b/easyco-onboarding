'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  CreditCard,
  Globe,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/notifications/NotificationBell';
import { createClient } from '@/lib/auth/supabase-client';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/use-language';

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
  const { getSection } = useLanguage();
  const nav = getSection('dashboard').searcher.header;

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
      id: 'browse',
      href: '/properties/browse',
      label: nav.browse,
      icon: Search,
    },
    {
      id: 'favorites',
      href: '/dashboard/searcher/favorites',
      label: nav.favorites,
      icon: Bookmark,
      badge: favoritesCount > 0 ? favoritesCount : null,
    },
    {
      id: 'matches',
      href: '/dashboard/searcher/top-matches',
      label: nav.matches,
      icon: Heart,
      badge: matchesCount > 0 ? matchesCount : null,
    },
    {
      id: 'visits',
      href: '/dashboard/searcher/my-visits',
      label: nav.visits,
      icon: Calendar,
    },
    {
      id: 'applications',
      href: '/dashboard/searcher/my-applications',
      label: nav.applications,
      icon: Sparkles,
    },
    {
      id: 'groups',
      href: '/dashboard/searcher/groups',
      label: nav.groups,
      icon: Users,
    },
    {
      id: 'messages',
      href: '/messages',
      label: nav.messages,
      icon: MessageCircle,
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
  ];

  const handleLogout = async () => {
    setShowProfileMenu(false);
    router.push('/auth/logout');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphism background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/60 backdrop-blur-3xl backdrop-saturate-150"
           style={{
             WebkitBackdropFilter: 'blur(40px) saturate(150%)',
             backdropFilter: 'blur(40px) saturate(150%)'
           }}
      />
      <div className="absolute inset-0 border-b border-white/30 shadow-lg" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-16">

          {/* Logo with Searcher gradient */}
          <Link
            href="/dashboard/searcher"
            className="flex items-center group"
          >
            <svg
              width="100"
              height="25"
              viewBox="0 0 400 100"
              className="transition-transform group-hover:scale-105"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="searcherGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#FFA040', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#FFB85C', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#FFD080', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <text
                x="0"
                y="70"
                fontSize="80"
                fontWeight="700"
                fontFamily="system-ui, -apple-system, sans-serif"
                fill="url(#searcherGradient)"
              >
                EasyCo
              </text>
            </svg>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <div key={item.id} className="relative">
                  {/* Triangle pointer - avec couleur du dégradé Searcher */}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
                      style={{
                        borderTopColor: 'var(--searcher-500)'
                      }}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}

                  <Link
                    href={item.href}
                    prefetch={true}
                    className={cn(
                      "nav-item-searcher relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "active font-semibold bg-orange-50"
                        : "text-gray-600 hover:bg-orange-50/50"
                    )}
                  >
                    <Icon className="nav-icon w-4 h-4" />
                    <span className="nav-text">{item.label}</span>
                    {item.badge && (
                      <Badge
                        className="ml-1 badge-gradient-searcher h-5 min-w-[20px] px-1.5"
                        style={{
                          background: 'var(--gradient-searcher)'
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
            {/* Favorites Quick Access */}
            {favoritesCount > 0 && (
              <Link
                href="/dashboard/searcher/favorites"
                className="hidden xl:flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-200 bg-orange-50/50 hover:bg-orange-100/50 hover:shadow-md transition-all"
              >
                <Bookmark className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">{favoritesCount} favoris</span>
              </Link>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl hover:bg-gray-100 transition-all"
                aria-label={`Notifications${(matchesCount > 0 || unreadMessages > 0) ? ` (${matchesCount + unreadMessages} non lues)` : ''}`}
                aria-expanded={showNotifications}
                aria-haspopup="true"
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
                      className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 py-2 z-20"
                    >
                      <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {matchesCount > 0 && (
                          <Link
                            href="/dashboard/searcher/top-matches"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition"
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
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-all group"
                aria-label="Menu profil"
                aria-expanded={showProfileMenu}
                aria-haspopup="true"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-orange-200 group-hover:border-orange-400 transition-colors"
                  style={{
                    background: 'var(--gradient-searcher)'
                  }}
                >
                  <Search className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-orange-600 transition-colors hidden md:block" />
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
                      className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 py-2 z-20"
                    >
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="font-semibold text-gray-900">{profile.full_name}</p>
                        <p className="text-sm text-gray-500 truncate">{profile.email}</p>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700 font-medium">Mon Profil</span>
                      </Link>

                      <Link
                        href="/dashboard/searcher/saved-searches"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Save className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700 font-medium">Recherches Sauvegardées</span>
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition"
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

            {/* Language Switcher */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
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
              className="lg:hidden overflow-hidden border-t border-gray-200"
            >
              <nav id="mobile-navigation" className="py-4 flex flex-col gap-2" aria-label="Navigation mobile">
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
                          ? "bg-orange-50 text-orange-900 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
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
