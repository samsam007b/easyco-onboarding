'use client';

import { useState, useRef, useEffect, memo } from 'react';
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
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
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

const ModernResidentHeader = memo(function ModernResidentHeader({
  profile,
  stats = {}
}: ModernResidentHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, getSection } = useLanguage();
  const header = getSection('header');
  const common = getSection('common');
  const ariaLabels = getSection('ariaLabels');
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
      label: header?.nav?.residents || 'Résidents',
      icon: Users,
      badge: activeMembersCount > 0 ? activeMembersCount : null,
    },
    {
      id: 'tasks',
      href: '/hub/tasks',
      label: header?.nav?.tasks || 'Tâches',
      icon: CheckSquare,
      badge: pendingTasks > 0 ? pendingTasks : null,
    },
    {
      id: 'finances',
      href: '/hub/finances',
      label: header?.nav?.finances || 'Finances',
      icon: DollarSign,
      badge: yourBalance !== 0 ? '!' : null,
    },
    {
      id: 'calendar',
      href: '/hub/calendar',
      label: header?.nav?.calendar || 'Calendrier',
      icon: Calendar,
    },
    {
      id: 'messages',
      href: '/hub/messages',
      label: header?.nav?.messages || 'Messages',
      icon: MessageCircle,
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
  ];

  const quickActions = [
    {
      id: 'pay-rent',
      href: '/hub/finances',
      label: header?.quickActions?.resident?.payRent?.label || 'Payer le loyer',
      icon: Receipt,
      description: header?.quickActions?.resident?.payRent?.description || 'Effectuer un paiement',
    },
    {
      id: 'report-issue',
      href: '/hub/tasks',
      label: header?.quickActions?.resident?.reportIssue?.label || 'Signaler un problème',
      icon: AlertCircle,
      description: header?.quickActions?.resident?.reportIssue?.description || 'Créer une demande',
    },
    {
      id: 'add-expense',
      href: '/hub/finances',
      label: header?.quickActions?.resident?.addExpense?.label || 'Ajouter une dépense',
      icon: Plus,
      description: header?.quickActions?.resident?.addExpense?.description || 'Partager une dépense',
    },
    {
      id: 'contact-roommates',
      href: '/hub/messages',
      label: header?.quickActions?.resident?.contactRoommates?.label || 'Contacter les colocataires',
      icon: MessageCircle,
      description: header?.quickActions?.resident?.contactRoommates?.description || 'Envoyer un message',
    },
  ];

  const handleLogout = async () => {
    try {
      setShowProfileMenu(false);
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error);
        toast.error(common?.logoutError?.[language] || 'Logout failed');
        return;
      }

      toast.success(common?.logoutSuccess?.[language] || 'Successfully logged out');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(common?.logoutError?.[language] || 'Logout failed');
    }
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

          {/* Logo IzzIco */}
          <Link
            href="/dashboard/resident"
            className="flex items-center group"
          >
            <img
              src="/logos/izzico-trademark-text-gradient.svg?v=4"
              alt="IzzIco"
              className="h-8 w-auto transition-transform group-hover:scale-105"
            />
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
                      "relative z-10 flex items-center gap-2 px-4 py-2 superellipse-xl text-sm font-medium transition-all group",
                      isActive
                        ? "font-semibold"
                        : "text-gray-600 hover:bg-orange-50/50"
                    )}
                    style={isActive ? {
                      background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    } : undefined}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-all",
                        isActive ? "" : "group-hover:text-[#ff651e]"
                      )}
                      style={isActive ? { color: '#ff651e' } : undefined}
                    />
                    <span>{item.label}</span>
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
                  "hidden xl:flex items-center gap-2 px-4 py-2 superellipse-xl text-sm font-semibold transition-all",
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

            {/* Quick Actions Menu - Desktop Only */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="flex items-center gap-2 px-4 py-2 superellipse-xl text-sm font-medium transition-all border"
                style={{
                  background: showQuickActions ? 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)' : 'linear-gradient(135deg, rgba(224, 87, 71, 0.06) 0%, rgba(255, 144, 20, 0.06) 100%)',
                  borderColor: 'rgba(224, 87, 71, 0.2)',
                  color: showQuickActions ? 'white' : '#ff651e'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)';
                  e.currentTarget.style.borderColor = '#ff651e';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  if (!showQuickActions) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(224, 87, 71, 0.06) 0%, rgba(255, 144, 20, 0.06) 100%)';
                    e.currentTarget.style.borderColor = 'rgba(224, 87, 71, 0.2)';
                    e.currentTarget.style.color = '#ff651e';
                  }
                }}
                aria-label={common?.quickActionsMenu?.[language] || 'Quick actions menu'}
                aria-expanded={showQuickActions}
                aria-haspopup="true"
              >
                <Zap className="w-4 h-4" style={{ color: showQuickActions ? 'white' : '#ff651e' }} />
                <span>{header?.quickActions?.title || common?.quickActions || 'Actions Rapides'}</span>
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform",
                  showQuickActions && "rotate-180"
                )} style={{ color: showQuickActions ? 'white' : '#ff651e' }} />
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
                      className="absolute right-0 mt-2 w-80 bg-white superellipse-2xl shadow-2xl border border-gray-100 overflow-hidden z-20"
                    >
                      {/* Header with subtle gradient background */}
                      <div className="px-5 py-4 border-b border-gray-100" style={{ background: '#fff5f3' }}>
                        <h3 className="font-bold text-gray-900 flex items-center gap-2.5 text-base">
                          <div className="w-6 h-6 superellipse-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)' }}>
                            <Zap className="w-3.5 h-3.5 text-white" />
                          </div>
                          {header?.quickActions?.title || common?.quickActions || 'Actions Rapides'}
                        </h3>
                      </div>
                      <div className="p-3">
                        {quickActions.map((action) => {
                          const Icon = action.icon;
                          return (
                            <Link
                              key={action.id}
                              href={action.href}
                              className="flex items-center gap-4 px-3 py-3.5 superellipse-xl transition group"
                              style={{ background: 'transparent' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#fff5f3'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                              onClick={() => setShowQuickActions(false)}
                            >
                              <div
                                className="w-11 h-11 superellipse-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-md"
                                style={{ background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)' }}
                              >
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 mb-0.5">
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
                className="flex items-center gap-1.5 px-3 py-1.5 superellipse-lg text-sm text-gray-700 hover:bg-gray-100 transition-all"
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
                      className="absolute top-full mt-2 right-0 bg-white superellipse-xl shadow-2xl border border-gray-100 overflow-hidden min-w-[180px] z-20"
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
                                "w-full flex items-center justify-between px-5 py-3.5 text-sm transition-all group",
                                language === lang.code
                                  ? ""
                                  : "hover:bg-[#fff5f3]"
                              )}
                              style={language === lang.code ? { background: 'linear-gradient(135deg, rgba(224, 87, 71, 0.08) 0%, rgba(255, 144, 20, 0.08) 100%)' } : undefined}
                            >
                              <span
                                className="font-medium transition-all"
                                style={language === lang.code
                                  ? { background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 600 }
                                  : { color: '#374151' }
                                }
                              >
                                {lang.label}
                              </span>
                              {language === lang.code && (
                                <span style={{ color: '#ff651e' }} className="text-sm font-medium">✓</span>
                              )}
                            </button>
                            {index < languages.length - 1 && (
                              <div className="h-px bg-gray-100 mx-4" />
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
                aria-label={common?.profileMenu?.[language] || 'Profile menu'}
                aria-expanded={showProfileMenu}
                aria-haspopup="true"
              >
                {/* Avatar rond avec icône key */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-gray-200 group-hover:border-gray-300 transition-colors shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)' }}
                >
                  <Key className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600 transition-colors hidden md:block" style={{ color: showProfileMenu ? '#ff651e' : undefined }} />
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
                      className="absolute right-0 mt-2 w-80 bg-white superellipse-2xl shadow-2xl border border-gray-100 overflow-hidden z-20"
                    >
                      {/* Premium Header with Gradient */}
                      <div className="relative px-5 py-5 text-white" style={{ background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)' }}>
                        <div className="relative flex items-center gap-4">
                          {/* Avatar with Progress Ring */}
                          <div className="relative">
                            <svg className="absolute inset-0 -m-1.5" width="68" height="68">
                              <circle cx="34" cy="34" r="32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                              <circle
                                cx="34" cy="34" r="32"
                                fill="none"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 32}`}
                                strokeDashoffset={`${2 * Math.PI * 32 * (1 - 0.75)}`}
                                transform="rotate(-90 34 34)"
                                className="transition-all duration-1000"
                              />
                            </svg>
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden">
                              <Key className="w-8 h-8 text-white" />
                            </div>
                          </div>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white truncate text-lg">{profile.full_name}</p>
                            <p className="text-white/90 text-sm truncate">{profile.email}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <div className="h-1.5 flex-1 bg-white/30 rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-white" style={{ width: '75%' }} />
                              </div>
                              <span className="text-xs text-white font-semibold">75%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="px-4 py-3 border-b border-gray-100" style={{ background: '#fff5f3' }}>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <div className="text-lg font-bold" style={{ color: '#ff651e' }}>
                              {pendingTasks || 0}
                            </div>
                            <div className="text-xs font-medium" style={{ color: '#c23f21' }}>{header?.stats?.tasks || 'Tâches'}</div>
                          </div>
                          <div className="text-center border-x border-gray-200">
                            <div className="text-lg font-bold" style={{ color: '#ff651e' }}>
                              {activeMembersCount || 0}
                            </div>
                            <div className="text-xs font-medium" style={{ color: '#c23f21' }}>{header?.stats?.members || 'Membres'}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold" style={{ color: '#ff651e' }}>
                              {unreadMessages || 0}
                            </div>
                            <div className="text-xs font-medium" style={{ color: '#c23f21' }}>{header?.stats?.messages || 'Messages'}</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-3 px-3">
                        <Link
                          href="/profile"
                          className="group flex items-center gap-3.5 px-3 py-3 superellipse-xl transition-all"
                          style={{ background: 'transparent' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#fff5f3'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-10 h-10 superellipse-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-md" style={{ background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)' }}>
                            <User className="w-4.5 h-4.5 text-white" />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-900 font-semibold block">{common?.myProfile || 'Mon Profil'}</span>
                            <span className="text-xs text-gray-500">{common?.manageInfo || 'Gérer mes informations'}</span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                          href="/hub/finances"
                          className="group flex items-center gap-3.5 px-3 py-3 superellipse-xl transition-all"
                          style={{ background: 'transparent' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#fff5f3'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-10 h-10 superellipse-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-md" style={{ background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)' }}>
                            <DollarSign className="w-4.5 h-4.5 text-white" />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-900 font-semibold block">{common?.finances || 'Finances'}</span>
                            <span className="text-xs text-gray-500">{common?.rentAndExpenses || 'Loyer et dépenses'}</span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                          href="/settings"
                          className="group flex items-center gap-3.5 px-3 py-3 superellipse-xl transition-all"
                          style={{ background: 'transparent' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#fff5f3'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-10 h-10 superellipse-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-md" style={{ background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)' }}>
                            <Settings className="w-4.5 h-4.5 text-white" />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-900 font-semibold block">{common?.settings || 'Paramètres'}</span>
                            <span className="text-xs text-gray-500">{common?.accountPreferences || 'Préférences du compte'}</span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <div className="my-2 h-px bg-gray-100 mx-1" />

                        <button
                          onClick={handleLogout}
                          className="group w-full flex items-center gap-3.5 px-3 py-3 hover:bg-red-50 transition-all superellipse-xl"
                        >
                          <div className="w-10 h-10 superellipse-xl bg-red-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <LogOut className="w-4.5 h-4.5 text-red-600" />
                          </div>
                          <div className="flex-1 text-left">
                            <span className="text-red-600 font-semibold block">{common?.logout || 'Se déconnecter'}</span>
                            <span className="text-xs text-red-400">{common?.leaveSession || 'Quitter votre session'}</span>
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
              className="lg:hidden p-2 superellipse-xl hover:bg-gray-100 transition-all"
              aria-label={mobileMenuOpen ? (common?.closeMenu?.[language] || 'Close menu') : (common?.openMenu?.[language] || 'Open menu')}
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
              <nav id="mobile-navigation" className="py-4 flex flex-col gap-2" aria-label={ariaLabels?.mobileNavigation?.[language] || 'Navigation mobile'}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 superellipse-xl transition-all group",
                        isActive
                          ? "bg-orange-50 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      style={isActive ? {
                        background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      } : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn(
                          "w-5 h-5 transition-all",
                          isActive ? "" : "group-hover:text-[#ff651e]"
                        )} />
                        <span className={cn(
                          isActive ? "" : "group-hover:bg-gradient-to-r group-hover:from-[#e05747] group-hover:via-[#ff651e] group-hover:to-[#ff9014] group-hover:bg-clip-text group-hover:text-transparent"
                        )}>{item.label}</span>
                      </div>
                      {item.badge && (
                        <Badge className="text-white border-0" style={{ background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)' }}>
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
});

export default ModernResidentHeader;
