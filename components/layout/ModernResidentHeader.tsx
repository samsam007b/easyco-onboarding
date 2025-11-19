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
  Globe,
  Zap,
  Receipt,
  AlertCircle,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/notifications/NotificationBell';
import LanguageSwitcher from '@/components/LanguageSwitcher';

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
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const {
    groupName = 'Ma Coloc',
    pendingTasks = 0,
    yourBalance = 0,
    unreadMessages = 0,
    activeMembersCount = 0
  } = stats;

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
      href: '/messages',
      label: 'Contacter les colocataires',
      icon: MessageCircle,
      description: 'Envoyer un message',
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
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                                   style={{
                                     background: 'linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)'
                                   }}>
                                <Icon className="w-5 h-5 text-white" />
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

            {/* Language Switcher */}
            <div className="hidden md:block">
              <LanguageSwitcher />
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
                    background: 'var(--gradient-resident)'
                  }}
                >
                  <Users className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-orange-600 transition-colors hidden md:block" />
              </button>

              {/* Enhanced Profile Dropdown */}
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
                      transition={{ type: "spring", duration: 0.3 }}
                      className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden z-20"
                    >
                      {/* Header avec gradient */}
                      <div className="relative px-4 py-4 bg-gradient-to-br from-orange-50 to-pink-50">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#D97B6F]/10 via-[#E8865D]/10 to-[#FF8C4B]/10" />
                        <div className="relative">
                          <p className="font-bold text-gray-900 text-lg">{profile.full_name}</p>
                          <p className="text-sm text-gray-600 truncate">{profile.email}</p>
                        </div>
                      </div>

                      {/* Stats rapides */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="w-3.5 h-3.5 text-orange-600" />
                              <span className="text-xs font-medium text-gray-600">Coloc</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900">{activeMembersCount}</p>
                          </div>
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
                              <span className="text-xs font-medium text-gray-600">Messages</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900">{unreadMessages}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition group"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <User className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-gray-700 font-medium">Mon Profil</span>
                        </Link>

                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition group"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Settings className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="text-gray-700 font-medium">Paramètres</span>
                        </Link>
                      </div>

                      <div className="my-1 border-t border-gray-100" />

                      <div className="py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50/50 transition text-red-600 group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <LogOut className="w-4 h-4" />
                          </div>
                          <span className="font-medium">Déconnexion</span>
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
