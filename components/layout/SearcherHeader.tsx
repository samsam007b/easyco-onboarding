'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, Users, MessageCircle, Search, Bell, ChevronDown, LogOut, Settings, User, Bookmark, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/auth/supabase-client';

interface SearcherHeaderProps {
  profile: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  notifications?: number;
  unreadMessages?: number;
  newMatches?: number;
}

export default function SearcherHeader({
  profile,
  notifications = 0,
  unreadMessages = 0,
  newMatches = 0,
}: SearcherHeaderProps) {
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const supabase = createClient();

  // Load favorites count
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

    // Subscribe to changes
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

  const navLinks = [
    {
      href: '/dashboard/searcher',
      label: 'Accueil',
      icon: Home,
      badge: null,
    },
    {
      href: '/properties/browse',
      label: 'Explorer',
      icon: Search,
      badge: null,
    },
    {
      href: '/dashboard/searcher/favorites',
      label: 'Favoris',
      icon: Bookmark,
      badge: favoritesCount > 0 ? favoritesCount : null,
    },
    {
      href: '/matching',
      label: 'Matchs',
      icon: Heart,
      badge: newMatches > 0 ? newMatches : null,
    },
    {
      href: '/groups',
      label: 'Groupes',
      icon: Users,
      badge: null,
    },
    {
      href: '/messages',
      label: 'Messages',
      icon: MessageCircle,
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-[var(--searcher-primary)] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo + Role Badge */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard/searcher" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl border-2 border-[var(--searcher-primary)] bg-white flex items-center justify-center group-hover:bg-[var(--searcher-primary)] transition-colors">
                <Home className="w-6 h-6 text-[var(--searcher-primary)] group-hover:text-white transition-colors" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-[var(--searcher-primary)] transition-colors">EasyCo</h1>
                <span className="text-xs font-medium text-gray-600">Chercheur</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all relative border-2 border-transparent',
                    isActive
                      ? 'border-[var(--searcher-primary)] text-[var(--searcher-primary)] bg-[var(--searcher-light)]'
                      : 'text-gray-600 hover:text-[var(--searcher-primary)] hover:border-[var(--searcher-primary)]'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <Badge variant="error" className="ml-1">
                      {link.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg border-2 border-transparent hover:border-[var(--searcher-primary)] transition-all group"
              >
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-[var(--searcher-primary)] transition-colors" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--searcher-primary)] rounded-full animate-pulse" />
                )}
              </button>

              {/* Notifications Dropdown Menu */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {notifications > 0 && (
                      <p className="text-xs text-gray-500">{notifications} nouvelles</p>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications > 0 ? (
                      <>
                        {/* Mock notifications */}
                        <Link
                          href="/matching"
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition"
                          onClick={() => setShowNotifications(false)}
                        >
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Heart className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Nouveau match!
                            </p>
                            <p className="text-xs text-gray-600">
                              Tu as un nouveau match à 92% avec une coloc à Ixelles
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Il y a 5 minutes</p>
                          </div>
                        </Link>
                        <Link
                          href="/messages"
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition"
                          onClick={() => setShowNotifications(false)}
                        >
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Nouveau message
                            </p>
                            <p className="text-xs text-gray-600">
                              Marie a répondu à ta demande
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Il y a 1 heure</p>
                          </div>
                        </Link>
                      </>
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Aucune notification</p>
                      </div>
                    )}
                  </div>
                  {notifications > 0 && (
                    <div className="px-4 py-2 border-t border-gray-100">
                      <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                        Tout marquer comme lu
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-2 rounded-lg border-2 border-transparent hover:border-[var(--searcher-primary)] transition-all group"
              >
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 group-hover:border-[var(--searcher-primary)] transition-colors"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-gray-200 group-hover:border-[var(--searcher-primary)] bg-white flex items-center justify-center transition-colors">
                    <User className="w-5 h-5 text-gray-600 group-hover:text-[var(--searcher-primary)] transition-colors" />
                  </div>
                )}
                <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-[var(--searcher-primary)] transition-colors" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfileMenu(false)}
                  />

                  {/* Menu */}
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">{profile.full_name}</p>
                      <p className="text-sm text-gray-500">{profile.email}</p>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">Mon Profil</span>
                    </Link>

                    <Link
                      href="/dashboard/searcher/saved-searches"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Save className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">Recherches Sauvegardées</span>
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">Paramètres</span>
                    </Link>

                    <hr className="my-2" />

                    <button
                      onClick={async () => {
                        // Handle logout
                        setShowProfileMenu(false);
                        window.location.href = '/auth/logout';
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition text-red-600"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center justify-around py-2 border-t-2 border-[var(--searcher-primary)]">
          {navLinks.slice(0, 5).map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition relative',
                  isActive ? 'text-[var(--searcher-primary)]' : 'text-gray-600 hover:text-[var(--searcher-primary)]'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{link.label}</span>
                {link.badge && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
