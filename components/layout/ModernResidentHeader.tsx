'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  CheckSquare,
  DollarSign,
  Calendar,
  MessageCircle,
  User,
  LogOut,
  Settings,
  Users,
  Menu,
  X,
  ChevronDown,
  Zap,
  Receipt,
  AlertCircle,
  Plus,
  Key,
  Globe,
  Mail,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import NotificationBell from '@/components/notifications/NotificationBell';
import { useLanguage } from '@/lib/i18n/use-language';
import FranceFlag from '@/components/icons/flags/FranceFlag';
import UKFlag from '@/components/icons/flags/UKFlag';
import NetherlandsFlag from '@/components/icons/flags/NetherlandsFlag';
import GermanyFlag from '@/components/icons/flags/GermanyFlag';

interface ModernResidentHeaderProps {
  profile: {
    full_name: string;
    email: string;
    avatar_url?: string;
    profile_data?: any;
  };
  stats?: {
    groupName?: string;
    pendingTasks?: number;
    yourBalance?: number; // Positive = owed to you, Negative = you owe
    unreadMessages?: number;
    activeMembersCount?: number;
  };
}

const flagComponents = {
  fr: FranceFlag,
  en: UKFlag,
  nl: NetherlandsFlag,
  de: GermanyFlag,
};

export default function ModernResidentHeader({
  profile,
  stats = {}
}: ModernResidentHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const {
    pendingTasks = 0,
    yourBalance = 0,
    unreadMessages = 0,
    activeMembersCount = 0
  } = stats;

  const languages = [
    { code: 'fr', label: 'Français', flagComponent: FranceFlag },
    { code: 'en', label: 'English', flagComponent: UKFlag },
    { code: 'nl', label: 'Nederlands', flagComponent: NetherlandsFlag },
    { code: 'de', label: 'Deutsch', flagComponent: GermanyFlag },
  ] as const;

  const navItems = [
    {
      id: 'members',
      href: '/hub/members',
      label: 'Résidents',
      icon: Users,
      badge: activeMembersCount > 0 ? activeMembersCount : null,
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
      id: 'calendar',
      href: '/hub/calendar',
      label: 'Calendrier',
      icon: Calendar,
    },
    {
      id: 'messages',
      href: '/hub/messages',
      label: 'Messages',
      icon: MessageCircle,
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
  ];

  const quickActions = [
    {
      id: 'pay-rent',
      href: '/hub/finances',
      label: 'Payer le loyer',
      icon: Receipt,
      description: 'Effectuer un paiement',
    },
    {
      id: 'report-issue',
      href: '/hub/tasks',
      label: 'Signaler un problème',
      icon: AlertCircle,
      description: 'Créer une demande',
    },
    {
      id: 'add-expense',
      href: '/hub/finances',
      label: 'Ajouter une dépense',
      icon: Plus,
      description: 'Partager une dépense',
    },
    {
      id: 'contact-roommates',
      href: '/hub/messages',
      label: 'Contacter les colocataires',
      icon: MessageCircle,
      description: 'Envoyer un message',
    },
  ];

  const handleLogout = async () => {
    setShowProfileMenu(false);
    router.push('/auth/logout');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Close language dropdown when clicking outside
  const langDropdownRef = useRef<HTMLDivElement>(null);
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

          {/* Logo with SVG Gradient */}
          <Link
            href="/dashboard/resident"
            className="flex items-center group"
          >
            <svg
              width="120"
              height="28"
              viewBox="0 0 120 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform group-hover:scale-105"
            >
              <defs>
                <linearGradient id="residentLogoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D97B6F" />
                  <stop offset="50%" stopColor="#E8865D" />
                  <stop offset="100%" stopColor="#FF8C4B" />
                </linearGradient>
              </defs>
              <text
                x="0"
                y="20"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="24"
                fontWeight="700"
                fill="url(#residentLogoGradient)"
              >
                Easy
              </text>
              <text
                x="54"
                y="20"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="24"
                fontWeight="300"
                fill="url(#residentLogoGradient)"
              >
                Co
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
                  {/* Triangle pointer - avec gradient orange authentique */}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
                      style={{
                        borderTopColor: 'var(--resident-500)'
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
                      "relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all group",
                      isActive
                        ? "bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] bg-clip-text text-transparent font-semibold"
                        : "text-gray-600 hover:bg-orange-50/50"
                    )}
                  >
                    <Icon className={cn(
                      "w-4 h-4 transition-all",
                      isActive ? "" : "group-hover:text-[#E8865D]"
                    )} />
                    <span className={cn(
                      isActive ? "" : "group-hover:bg-gradient-to-r group-hover:from-[#D97B6F] group-hover:via-[#E8865D] group-hover:to-[#FF8C4B] group-hover:bg-clip-text group-hover:text-transparent"
                    )}>{item.label}</span>
                    {item.badge && (
                      <Badge
                        className="ml-1 badge-gradient-resident h-5 min-w-[20px] px-1.5"
                        style={{
                          background: 'var(--gradient-resident)'
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
                  background: 'var(--gradient-resident-subtle)'
                }}
              >
                <Users className="w-4 h-4 text-orange-700" />
                <span className="text-sm font-medium text-orange-900">{activeMembersCount} membres</span>
              </Link>
            )}

            {/* Quick Actions Menu - Desktop Only */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-orange-50 transition-all border border-gray-200 hover:border-orange-300"
                aria-label="Menu actions rapides"
                aria-expanded={showQuickActions}
                aria-haspopup="true"
              >
                <Zap className="w-4 h-4 text-orange-600" />
                <span>Actions Rapides</span>
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform",
                  showQuickActions && "rotate-180"
                )} />
              </button>

              {/* Quick Actions Dropdown */}
              <AnimatePresence>
                {showQuickActions && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowQuickActions(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ type: "spring", duration: 0.3 }}
                      className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 py-2 z-20"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-orange-600" />
                          Actions Rapides
                        </h3>
                      </div>
                      <div className="p-2">
                        {quickActions.map((action) => {
                          const Icon = action.icon;
                          return (
                            <Link
                              key={action.id}
                              href={action.href}
                              className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-orange-50 transition group"
                              onClick={() => setShowQuickActions(false)}
                            >
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform bg-gradient-to-br from-[#F5D5CF] to-[#FFDAC9]/70 border border-gray-200">
                                <Icon className="w-5 h-5 text-gray-700" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900">
                                  {action.label}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {action.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications - New NotificationBell Component */}
            <NotificationBell />

            {/* Language Switcher - Landing Page Style */}
            <div ref={langDropdownRef} className="hidden md:block relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">{language.toUpperCase()}</span>
                <ChevronDown className={cn(
                  "w-3 h-3 transition-transform",
                  langDropdownOpen && "rotate-180"
                )} />
              </button>

              {/* Dropdown Menu - Premium Minimalist */}
              <AnimatePresence>
                {langDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setLangDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden min-w-[180px] z-20"
                    >
                      {languages.map((lang, index) => {
                        return (
                          <div key={lang.code}>
                            <button
                              onClick={() => {
                                setLanguage(lang.code);
                                setLangDropdownOpen(false);
                              }}
                              className={cn(
                                "w-full flex items-center justify-between px-5 py-3 text-sm transition-all group",
                                language === lang.code
                                  ? "bg-gray-50"
                                  : "hover:bg-gray-50"
                              )}
                            >
                              <span className={cn(
                                "font-medium transition-all",
                                language === lang.code
                                  ? "bg-gradient-to-r from-purple-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent font-semibold"
                                  : "text-gray-700 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-orange-500 group-hover:to-yellow-500 group-hover:bg-clip-text group-hover:text-transparent"
                              )}>
                                {lang.label}
                              </span>
                              {language === lang.code && (
                                <span className="text-purple-600 text-xs">✓</span>
                              )}
                            </button>
                            {index < languages.length - 1 && (
                              <div className="h-px bg-gray-100 mx-3" />
                            )}
                          </div>
                        );
                      })}
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
                {/* Avatar rond avec icône key */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-gray-200 group-hover:border-gray-300 transition-colors shadow-sm bg-gradient-to-br from-[#F5D5CF] to-[#FFDAC9]/70"
                >
                  <Key className="w-4 h-4 text-gray-700" />
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
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden z-20"
                    >
                      {/* Premium Header with Gradient */}
                      <div className="relative px-6 py-5 bg-gradient-to-br from-[#F5D5CF]/70 via-[#FFD5C5]/70 to-[#FFDAC9]/70 text-gray-900">
                        <div className="absolute inset-0 bg-white/10" />
                        <div className="relative flex items-center gap-4">
                          {/* Avatar with Progress Ring */}
                          <div className="relative">
                            <svg className="absolute inset-0 -m-1.5" width="68" height="68">
                              <circle cx="34" cy="34" r="32" fill="none" stroke="rgba(100,100,100,0.2)" strokeWidth="2" />
                              <circle
                                cx="34" cy="34" r="32"
                                fill="none"
                                stroke="rgba(255, 111, 60, 0.5)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 32}`}
                                strokeDashoffset={`${2 * Math.PI * 32 * (1 - 0.75)}`}
                                transform="rotate(-90 34 34)"
                                className="transition-all duration-1000"
                              />
                            </svg>
                            <div className="w-16 h-16 rounded-full bg-white/50 backdrop-blur-sm border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                              <Key className="w-8 h-8 text-gray-700" />
                            </div>
                          </div>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 truncate text-lg">{profile.full_name}</p>
                            <p className="text-gray-700 text-sm truncate">{profile.email}</p>
                            <div className="mt-1 flex items-center gap-1.5">
                              <div className="h-1.5 flex-1 bg-gray-300 rounded-full overflow-hidden">
                                <div className="h-full bg-[#FF5722] rounded-full" style={{ width: '75%' }} />
                              </div>
                              <span className="text-xs text-gray-700 font-medium">75%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="px-4 py-3 bg-gradient-to-br from-[#FFF3EF]/50 to-[#FFEBE5]/50 border-b border-[#FFDAC9]/50">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">
                              {pendingTasks || 0}
                            </div>
                            <div className="text-xs text-gray-600">Tâches</div>
                          </div>
                          <div className="text-center border-x border-[#FFDAC9]/50">
                            <div className="text-lg font-bold text-gray-900">
                              {activeMembersCount || 0}
                            </div>
                            <div className="text-xs text-gray-600">Membres</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">
                              {unreadMessages || 0}
                            </div>
                            <div className="text-xs text-gray-600">Messages</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="group flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-all"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center transition-transform">
                            <User className="w-4 h-4 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-900 font-medium block">Mon Profil</span>
                            <span className="text-xs text-gray-500">Gérer mes informations</span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                          href="/hub/finances"
                          className="group flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-all"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center transition-transform">
                            <DollarSign className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-900 font-medium block">Finances</span>
                            <span className="text-xs text-gray-500">Loyer et dépenses</span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                          href="/settings"
                          className="group flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-all"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center transition-transform">
                            <Settings className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-900 font-medium block">Paramètres</span>
                            <span className="text-xs text-gray-500">Préférences du compte</span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <div className="my-1 h-px bg-gray-200" />

                        <button
                          onClick={handleLogout}
                          className="group w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all rounded-xl"
                        >
                          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center transition-transform">
                            <LogOut className="w-4 h-4 text-red-600" />
                          </div>
                          <div className="flex-1 text-left">
                            <span className="text-red-600 font-medium block">Se déconnecter</span>
                            <span className="text-xs text-red-400">Quitter votre session</span>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
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
                        "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                        isActive
                          ? "bg-orange-50 font-semibold bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] bg-clip-text text-transparent"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn(
                          "w-5 h-5 transition-all",
                          isActive ? "" : "group-hover:text-[#E8865D]"
                        )} />
                        <span className={cn(
                          isActive ? "" : "group-hover:bg-gradient-to-r group-hover:from-[#D97B6F] group-hover:via-[#E8865D] group-hover:to-[#FF8C4B] group-hover:bg-clip-text group-hover:text-transparent"
                        )}>{item.label}</span>
                      </div>
                      {item.badge && (
                        <Badge className="bg-gradient-to-r from-[#D97B6F] to-[#E8865D] hover:from-[#D97B6F] hover:to-[#E8865D] text-white border-0">
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
