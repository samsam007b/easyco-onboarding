'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  CheckSquare,
  DollarSign,
  Calendar,
  Wrench,
  MessageCircle,
  Bell,
  User,
  LogOut,
  Settings,
  Users,
  Menu,
  X,
  ChevronDown,
  TrendingUp,
  CreditCard,
  Heart,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/notifications/NotificationBell';

interface ModernResidentHeaderProps {
  profile: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  stats?: {
    groupName?: string;
    pendingTasks?: number;
    yourBalance?: number; // Positive = owed to you, Negative = you owe
    unreadMessages?: number;
    activeMembersCount?: number;
  };
}

export default function ModernResidentHeader({
  profile,
  stats = {}
}: ModernResidentHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'FR' | 'EN'>('FR');

  const langDropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'FR', label: 'Français', flag: '🇫🇷' },
    { code: 'EN', label: 'English', flag: '🇬🇧' },
  ];

  const {
    groupName = 'Ma Coloc',
    pendingTasks = 0,
    yourBalance = 0,
    unreadMessages = 0,
    activeMembersCount = 0
  } = stats;

  // Click outside handler for language dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    if (langDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [langDropdownOpen]);

  const navItems = [
    {
      id: 'hub',
      href: '/dashboard/resident',
      label: 'Hub',
      icon: Home,
    },
    {
      id: 'tasks',
      href: '/hub/tasks',
      label: 'Tâches',
      icon: CheckSquare,
      badge: pendingTasks > 0 ? pendingTasks : null,
    },
    {
      id: 'finances',
      href: '/hub/finances',
      label: 'Finances',
      icon: DollarSign,
      badge: yourBalance !== 0 ? '!' : null,
    },
    {
      id: 'payments',
      href: '/payments',
      label: 'Paiements',
      icon: CreditCard,
    },
    {
      id: 'calendar',
      href: '/hub/calendar',
      label: 'Calendrier',
      icon: Calendar,
    },
    {
      id: 'messages',
      href: '/messages',
      label: 'Messages',
      icon: MessageCircle,
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
    {
      id: 'favorites',
      href: '/favorites',
      label: 'Favoris',
      icon: Heart,
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

          {/* Logo + Group Name */}
          <Link
            href="/dashboard/resident"
            className="flex items-center gap-3 group"
          >
            {/* Logo Resident avec dégradé extrait du logo original */}
            <div
              className="grain-medium w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)'
              }}
            >
              <Home className="w-5 h-5 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                EasyCo
              </h1>
              <span className="text-xs font-medium text-white/70">
                {groupName}
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
                  {/* Triangle pointer - avec couleur du dégradé Resident */}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
                      style={{
                        borderTopColor: '#E8865D'
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
                      "relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "text-active-resident font-semibold"
                        : "text-hover-resident"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge
                        className="ml-1 text-white border-0 h-5 min-w-[20px] px-1.5"
                        style={{
                          background: 'linear-gradient(135deg, #FF6F3C 0%, #FF5722 100%)'
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
            {/* Balance Indicator - Desktop Only */}
            {yourBalance !== 0 && (
              <Link
                href="/hub/finances"
                className={cn(
                  "hidden xl:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                  yourBalance > 0
                    ? "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 hover:shadow-md"
                    : "bg-gradient-to-r from-red-50 to-red-100 text-red-700 hover:shadow-md"
                )}
              >
                <DollarSign className="w-4 h-4" />
                {yourBalance > 0 ? (
                  <span>+€{Math.abs(yourBalance)}</span>
                ) : (
                  <span>-€{Math.abs(yourBalance)}</span>
                )}
              </Link>
            )}

            {/* Group Members Button avec dégradé orange subtil */}
            {activeMembersCount > 0 && (
              <Link
                href="/hub/members"
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-orange-200/50 hover:shadow-md transition-all group"
                style={{
                  background: 'linear-gradient(135deg, #FFF3EF 0%, #FFE5DC 100%)'
                }}
              >
                <Users className="w-4 h-4 text-orange-700" />
                <span className="text-sm font-medium text-orange-900">{activeMembersCount} membres</span>
              </Link>
            )}

            {/* Notifications - New NotificationBell Component */}
            <NotificationBell />

            {/* Language Switcher with Dropdown */}
            <div ref={langDropdownRef} className="relative hidden md:block">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-orange-50 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">{selectedLang}</span>
                <ChevronDown className={cn(
                  "w-3 h-3 transition-transform",
                  langDropdownOpen && "rotate-180"
                )} />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden min-w-[160px] z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLang(lang.code as 'FR' | 'EN');
                          setLangDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                          selectedLang === lang.code
                            ? "bg-orange-50 text-orange-900 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.label}</span>
                        {selectedLang === lang.code && (
                          <span className="ml-auto text-orange-600">✓</span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-orange-50 transition-all group"
              >
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-orange-200 group-hover:border-orange-400 transition-colors"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-orange-200"
                    style={{
                      background: 'linear-gradient(135deg, #FF8C5C 0%, #FF6F3C 100%)'
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
                      className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-200/50 py-2 z-20"
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

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-orange-50 transition-all"
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
              className="lg:hidden overflow-hidden border-t border-orange-200/50"
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
                          ? "bg-gradient-to-r from-orange-100 to-orange-50 text-orange-900 font-semibold"
                          : "text-gray-700 hover:bg-orange-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </div>
                      {item.badge && (
                        <Badge variant="error" className="bg-yellow-500 hover:bg-yellow-500 text-white border-0">
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

      {/* Quick Stats Bar - Desktop Only */}
      {(pendingTasks > 0 || activeMembersCount > 0) && (
        <div className="hidden lg:block bg-gradient-to-r from-orange-50/50 to-transparent border-t border-orange-200/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6 text-gray-700">
                {pendingTasks > 0 && (
                  <span className="flex items-center gap-2">
                    <span className="text-gray-600">Tâches en cours:</span>
                    <strong className="text-orange-900 font-bold">{pendingTasks}</strong>
                  </span>
                )}
                {activeMembersCount > 0 && (
                  <span className="flex items-center gap-2">
                    <span className="text-gray-600">Membres actifs:</span>
                    <strong className="text-orange-900 font-bold">{activeMembersCount}</strong>
                  </span>
                )}
              </div>
              <Link
                href="/hub/calendar"
                className="text-orange-600 hover:text-orange-800 transition text-xs font-medium flex items-center gap-1"
              >
                Voir calendrier
                <Calendar className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
