'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CheckSquare, DollarSign, Calendar, Ticket, MessageCircle, Bell, ChevronDown, LogOut, Settings, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface ResidentHeaderProps {
  profile: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  groupName?: string;
  notifications?: number;
  unreadMessages?: number;
  pendingTasks?: number;
  yourBalance?: number; // Positive = you're owed, Negative = you owe
}

export default function ResidentHeader({
  profile,
  groupName = 'Ma Coloc',
  notifications = 0,
  unreadMessages = 0,
  pendingTasks = 0,
  yourBalance = 0,
}: ResidentHeaderProps) {
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navLinks = [
    {
      href: '/dashboard/resident',
      label: 'Hub',
      icon: Home,
      badge: null,
    },
    {
      href: '/hub/tasks',
      label: 'Tâches',
      icon: CheckSquare,
      badge: pendingTasks > 0 ? pendingTasks : null,
    },
    {
      href: '/hub/finances',
      label: 'Finances',
      icon: DollarSign,
      badge: yourBalance !== 0 ? '!' : null,
    },
    {
      href: '/hub/calendar',
      label: 'Calendrier',
      icon: Calendar,
      badge: null,
    },
    {
      href: '/hub/tickets',
      label: 'Tickets',
      icon: Ticket,
      badge: null,
    },
    {
      href: '/messages',
      label: 'Chat',
      icon: MessageCircle,
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--resident-primary)] border-b border-orange-400/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo + Group Name */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard/resident" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Home className="w-6 h-6 text-[var(--resident-primary)]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">EasyCo</h1>
                <span className="text-xs font-medium text-orange-100">{groupName}</span>
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
                    'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all relative',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-orange-100 hover:bg-white/10 hover:text-white'
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
            {/* Balance Indicator */}
            {yourBalance !== 0 && (
              <Link
                href="/hub/finances"
                className={cn(
                  'hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition',
                  yourBalance > 0
                    ? 'bg-green-500/20 text-white hover:bg-green-500/30'
                    : 'bg-red-500/20 text-white hover:bg-red-500/30'
                )}
              >
                <DollarSign className="w-4 h-4" />
                {yourBalance > 0 ? (
                  <span>On te doit €{Math.abs(yourBalance)}</span>
                ) : (
                  <span>Tu dois €{Math.abs(yourBalance)}</span>
                )}
              </Link>
            )}

            {/* Group Members Button */}
            <Link
              href="/hub/members"
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
            >
              <Users className="w-5 h-5 text-white" />
              <span className="text-sm font-medium text-white">4 membres</span>
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
                      href="/hub/settings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">Paramètres Groupe</span>
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
        <nav className="md:hidden flex items-center justify-around py-2 border-t border-orange-400/20">
          {navLinks.slice(0, 6).map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition relative',
                  isActive ? 'text-white' : 'text-orange-200'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{link.label}</span>
                {link.badge && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Quick Info Bar (Optional - shows quick stats) */}
      <div className="hidden lg:block bg-[var(--resident-dark)] border-t border-orange-400/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6 text-orange-100">
              <span>Tâches en cours: <strong className="text-white">{pendingTasks}</strong></span>
              <span>Prochaine échéance: <strong className="text-white">Loyer 5 nov</strong></span>
              <span>Membres actifs: <strong className="text-white">4/4</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/hub/calendar" className="text-orange-200 hover:text-white transition text-xs">
                Voir calendrier →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
