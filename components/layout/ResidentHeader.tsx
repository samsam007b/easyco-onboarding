'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CheckSquare, DollarSign, Calendar, Ticket, MessageCircle, Bell, ChevronDown, LogOut, Settings, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { NotificationCenter } from '@/components/NotificationCenter';

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
  const [showNotifications, setShowNotifications] = useState(false);

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
    <header className="sticky top-0 z-40 bg-white border-b-2 border-[var(--resident-primary)] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo + Group Name */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard/resident" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl border-2 border-[var(--resident-primary)] bg-white flex items-center justify-center group-hover:bg-[var(--resident-primary)] transition-colors">
                <Home className="w-6 h-6 text-[var(--resident-primary)] group-hover:text-white transition-colors" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-[var(--resident-primary)] transition-colors">EasyCo</h1>
                <span className="text-xs font-medium text-gray-600">{groupName}</span>
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
                      ? 'border-[var(--resident-primary)] text-[var(--resident-primary)] bg-[var(--resident-light)]'
                      : 'text-gray-600 hover:text-[var(--resident-primary)] hover:border-[var(--resident-primary)]'
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
            {/* Balance Indicator */}
            {yourBalance !== 0 && (
              <Link
                href="/hub/finances"
                className={cn(
                  'hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all border-2',
                  yourBalance > 0
                    ? 'bg-green-50 text-green-700 border-green-500 hover:bg-green-100'
                    : 'bg-red-50 text-red-700 border-red-500 hover:bg-red-100'
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
              className="hidden sm:flex items-center gap-2 px-3 py-2 border-2 border-[var(--resident-primary)] bg-[var(--resident-light)] hover:bg-[var(--resident-primary)] rounded-lg transition-all group"
            >
              <Users className="w-5 h-5 text-[var(--resident-primary)] group-hover:text-white transition-colors" />
              <span className="text-sm font-medium text-[var(--resident-primary)] group-hover:text-white transition-colors">4 membres</span>
            </Link>

            {/* Notifications Center */}
            <NotificationCenter />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-2 rounded-lg border-2 border-transparent hover:border-[var(--resident-primary)] transition-all group"
              >
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 group-hover:border-[var(--resident-primary)] transition-colors"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-gray-200 group-hover:border-[var(--resident-primary)] bg-white flex items-center justify-center transition-colors">
                    <User className="w-5 h-5 text-gray-600 group-hover:text-[var(--resident-primary)] transition-colors" />
                  </div>
                )}
                <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-[var(--resident-primary)] transition-colors" />
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
        <nav className="md:hidden flex items-center justify-around py-2 border-t-2 border-[var(--resident-primary)]">
          {navLinks.slice(0, 6).map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition relative',
                  isActive ? 'text-[var(--resident-primary)]' : 'text-gray-600 hover:text-[var(--resident-primary)]'
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
      <div className="hidden lg:block bg-[var(--resident-light)] border-t-2 border-[var(--resident-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6 text-gray-700">
              <span>Tâches en cours: <strong className="text-[var(--resident-primary)]">{pendingTasks}</strong></span>
              <span>Prochaine échéance: <strong className="text-[var(--resident-primary)]">Loyer 5 nov</strong></span>
              <span>Membres actifs: <strong className="text-[var(--resident-primary)]">4/4</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/hub/calendar" className="text-gray-600 hover:text-[var(--resident-primary)] transition text-xs font-medium">
                Voir calendrier →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
