'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Home,
  Users,
  MessageCircle,
  Plus,
  Bell,
  User,
  LogOut,
  Settings,
  Building2,
  TrendingUp,
  DollarSign,
  Menu,
  X,
  ChevronDown,
  CreditCard,
  Heart,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/notifications/NotificationBell';

interface ModernOwnerHeaderProps {
  profile: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  stats?: {
    monthlyRevenue?: number;
    roi?: number;
    occupation?: number;
    pendingApplications?: number;
    unreadMessages?: number;
  };
}

export default function ModernOwnerHeader({
  profile,
  stats = {}
}: ModernOwnerHeaderProps) {
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
    monthlyRevenue = 0,
    roi = 0,
    occupation = 0,
    pendingApplications = 0,
    unreadMessages = 0
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
      id: 'dashboard',
      href: '/dashboard/owner',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'properties',
      href: '/dashboard/owner/properties',
      label: 'Propriétés',
      icon: Building2,
    },
    {
      id: 'applications',
      href: '/dashboard/owner/applications',
      label: 'Candidatures',
      icon: Users,
      badge: pendingApplications > 0 ? pendingApplications : null,
    },
    {
      id: 'finance',
      href: '/dashboard/owner/finance',
      label: 'Finance',
      icon: DollarSign,
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-white/20 shadow-lg supports-[backdrop-filter]:bg-white/60">
      {/* Modern glassmorphism header with frosted glass effect */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-16">

          {/* Logo + Badge */}
          <Link
            href="/dashboard/owner"
            className="flex items-center gap-3 group"
          >
            {/* Logo Owner avec dégradé purple moderne */}
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all"
              style={{
                background: 'linear-gradient(135deg, #7B5FB8 0%, #A67BB8 50%, #C98B9E 100%)'
              }}
            >
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                EasyCo
              </h1>
              <span className="text-xs font-medium text-purple-600">
                Propriétaire
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
                  {/* Triangle pointer - avec couleur du dégradé Owner */}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
                      style={{
                        borderTopColor: '#A67BB8'
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
                        ? "text-purple-900 font-semibold bg-purple-50"
                        : "text-gray-600 hover:bg-purple-50/50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge
                        className="ml-1 text-white border-0 h-5 min-w-[20px] px-1.5"
                        style={{
                          background: 'linear-gradient(135deg, #6E56CF 0%, #5B45B8 100%)'
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
            {/* Quick Stats - Desktop Only */}
            {monthlyRevenue > 0 && (
              <div className="hidden xl:flex items-center gap-4 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Revenus</p>
                    <p className="text-sm font-bold text-purple-900">
                      €{monthlyRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>

                {roi > 0 && (
                  <>
                    <div className="w-px h-8 bg-purple-200" />
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600 font-medium">ROI</p>
                        <p className="text-sm font-bold text-purple-900">{roi}%</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Add Property CTA */}
            <Link href="/properties/add" className="hidden md:block">
              <Button className="rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter bien
              </Button>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl hover:bg-gray-100 transition-all"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {(pendingApplications > 0 || unreadMessages > 0) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full border-2 border-white" />
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
                        {pendingApplications > 0 && (
                          <Link
                            href="/dashboard/owner/applications"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition"
                            onClick={() => setShowNotifications(false)}
                          >
                            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                              <Users className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {pendingApplications} nouvelle{pendingApplications > 1 ? 's' : ''} candidature{pendingApplications > 1 ? 's' : ''}
                              </p>
                              <p className="text-xs text-gray-500">Cliquez pour voir</p>
                            </div>
                          </Link>
                        )}
                        {(pendingApplications === 0 && unreadMessages === 0) && (
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

            {/* Language Switcher with Dropdown */}
            <div ref={langDropdownRef} className="relative hidden md:block">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-all"
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
                    className="absolute top-full mt-2 right-0 bg-white/95 backdrop-blur-2xl rounded-lg shadow-xl border border-white/20 overflow-hidden min-w-[160px] z-50"
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
                            ? "bg-purple-50 text-purple-900 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.label}</span>
                        {selectedLang === lang.code && (
                          <span className="ml-auto text-purple-600">✓</span>
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
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-all group"
              >
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-purple-200 group-hover:border-purple-400 transition-colors"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-purple-200"
                    style={{
                      background: 'linear-gradient(135deg, #8E7AD6 0%, #6E56CF 100%)'
                    }}
                  >
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-purple-900 transition-colors hidden md:block" />
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
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700 font-medium">Mon Profil</span>
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition"
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
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all"
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
              className="lg:hidden overflow-hidden border-t border-purple-200/50"
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
                          ? "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-900 font-semibold"
                          : "text-gray-700 hover:bg-purple-50"
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

                <div className="pt-4 mt-2 border-t border-purple-200/50">
                  <Link href="/properties/add" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter une propriété
                    </Button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Stats Bar - Desktop Only */}
      {(occupation > 0 || pendingApplications > 0) && (
        <div className="hidden lg:block bg-gradient-to-r from-purple-50/50 to-transparent border-t border-purple-200/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6 text-gray-700">
                {occupation > 0 && (
                  <span className="flex items-center gap-2">
                    <span className="text-gray-600">Occupation:</span>
                    <strong className="text-purple-900 font-bold">{occupation}%</strong>
                  </span>
                )}
                {pendingApplications > 0 && (
                  <span className="flex items-center gap-2">
                    <span className="text-gray-600">Candidatures:</span>
                    <strong className="text-purple-900 font-bold">{pendingApplications}</strong>
                  </span>
                )}
              </div>
              <Link
                href="/dashboard/owner/finance"
                className="text-purple-600 hover:text-purple-800 transition text-xs font-medium flex items-center gap-1"
              >
                Voir analytiques
                <TrendingUp className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
