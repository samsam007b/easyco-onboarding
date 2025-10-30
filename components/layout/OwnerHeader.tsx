'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, TrendingUp, Home as HomeIcon, Users, MessageCircle, Plus, Bell, ChevronDown, LogOut, Settings, User, DollarSign, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface OwnerHeaderProps {
  profile: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  notifications?: number;
  unreadMessages?: number;
  pendingApplications?: number;
  monthlyRevenue?: number;
}

export default function OwnerHeader({
  profile,
  notifications = 0,
  unreadMessages = 0,
  pendingApplications = 0,
  monthlyRevenue = 0,
}: OwnerHeaderProps) {
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAnalyticsMenu, setShowAnalyticsMenu] = useState(false);

  const navLinks = [
    {
      href: '/dashboard/owner',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      href: '/analytics',
      label: 'Analytiques',
      icon: TrendingUp,
      badge: 'Nouveau',
      hasSubmenu: true,
    },
    {
      href: '/properties',
      label: 'Annonces',
      icon: HomeIcon,
      badge: null,
    },
    {
      href: '/applications',
      label: 'Candidatures',
      icon: Users,
      badge: pendingApplications > 0 ? pendingApplications : null,
    },
    {
      href: '/messages',
      label: 'Messages',
      icon: MessageCircle,
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
  ];

  const analyticsSubMenu = [
    { href: '/analytics/revenue', label: 'Revenus', icon: DollarSign },
    { href: '/analytics/occupation', label: 'Occupation', icon: HomeIcon },
    { href: '/analytics/market', label: 'Comparaison marché', icon: TrendingUp },
    { href: '/analytics/forecast', label: 'Prévisionnels', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--owner-primary)] border-b border-purple-400/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo + Role Badge */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard/owner" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-[var(--owner-primary)]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">EasyCo</h1>
                <span className="text-xs font-medium text-purple-100">Propriétaire</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
              const Icon = link.icon;

              if (link.hasSubmenu) {
                return (
                  <div key={link.href} className="relative">
                    <button
                      onClick={() => setShowAnalyticsMenu(!showAnalyticsMenu)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'text-purple-100 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                      {link.badge && typeof link.badge === 'string' && (
                        <Badge variant="secondary" className="ml-1 bg-yellow-400 text-yellow-900 hover:bg-yellow-400">
                          {link.badge}
                        </Badge>
                      )}
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Submenu */}
                    {showAnalyticsMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowAnalyticsMenu(false)}
                        />
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                          {analyticsSubMenu.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition"
                              onClick={() => setShowAnalyticsMenu(false)}
                            >
                              <item.icon className="w-5 h-5 text-gray-600" />
                              <span className="text-gray-700">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all relative',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-purple-100 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <Badge variant="destructive" className="ml-1">
                      {link.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Monthly Revenue (Quick Stat) */}
            {monthlyRevenue > 0 && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                <DollarSign className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-white">
                  €{monthlyRevenue.toLocaleString()}
                  <span className="text-xs text-purple-200">/mois</span>
                </span>
              </div>
            )}

            {/* Add Property CTA */}
            <Link
              href="/properties/add"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white text-[var(--owner-primary)] font-semibold rounded-lg hover:bg-gray-100 transition shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter bien</span>
            </Link>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-white/10 transition">
              <Bell className="w-5 h-5 text-white" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full" />
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition"
              >
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <ChevronDown className="w-4 h-4 text-white" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfileMenu(false)}
                  />
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
        <nav className="md:hidden flex items-center justify-around py-2 border-t border-purple-400/20">
          {navLinks.slice(0, 5).map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition relative',
                  isActive ? 'text-white' : 'text-purple-200'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{link.label}</span>
                {link.badge && typeof link.badge === 'number' && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Quick Actions Bar (Optional - shows key stats) */}
      <div className="hidden lg:block bg-[var(--owner-dark)] border-t border-purple-400/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6 text-purple-100">
              <span>ROI Moyen: <strong className="text-white">8.2%</strong></span>
              <span>Occupation: <strong className="text-white">96%</strong></span>
              <span>Candidatures: <strong className="text-white">{pendingApplications}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/analytics/revenue" className="text-purple-200 hover:text-white transition text-xs">
                Voir détails →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
