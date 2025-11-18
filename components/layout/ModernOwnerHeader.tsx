'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Globe,
  Wrench,
  Receipt,
  UserPlus,
  BarChart3,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/notifications/NotificationBell';
import LanguageSwitcher from '@/components/LanguageSwitcher';

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
  const [showQuickActions, setShowQuickActions] = useState(false);

  const {
    monthlyRevenue = 0,
    roi = 0,
    occupation = 0,
    pendingApplications = 0,
    unreadMessages = 0
  } = stats;

  const navItems = [
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
      id: 'messages',
      href: '/messages',
      label: 'Messages',
      icon: MessageCircle,
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
  ];

  const quickActions = [
    {
      id: 'add-property',
      href: '/properties/add',
      label: 'Ajouter une propriété',
      icon: Building2,
      description: 'Créer un nouveau bien',
    },
    {
      id: 'create-ticket',
      href: '/dashboard/owner/maintenance',
      label: 'Ticket maintenance',
      icon: Wrench,
      description: 'Signaler un problème',
    },
    {
      id: 'add-expense',
      href: '/dashboard/owner/expenses/add',
      label: 'Ajouter une dépense',
      icon: Receipt,
      description: 'Enregistrer une dépense',
    },
    {
      id: 'view-analytics',
      href: '/dashboard/owner/finance',
      label: 'Voir les analytics',
      icon: BarChart3,
      description: 'Performances détaillées',
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

          {/* Logo */}
          <Link
            href="/dashboard/owner"
            className="flex items-center group"
          >
            <Image
              src="/logos/easyco-logo-medium.png"
              alt="EasyCo"
              width={120}
              height={30}
              className="transition-transform group-hover:scale-105"
              priority
            />
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
                        borderTopColor: 'var(--owner-500)'
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
                        className="ml-1 badge-gradient-owner h-5 min-w-[20px] px-1.5"
                        style={{
                          background: 'var(--gradient-owner)'
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
            {/* Quick Actions Menu - Desktop Only */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-purple-50 transition-all border border-gray-200 hover:border-purple-300"
                aria-label="Menu actions rapides"
                aria-expanded={showQuickActions}
                aria-haspopup="true"
              >
                <Zap className="w-4 h-4 text-purple-600" />
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
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 py-2 z-20"
                    >
                      <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-purple-600" />
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
                              className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-purple-50 transition group"
                              onClick={() => setShowQuickActions(false)}
                            >
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
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

            {/* Quick Stats - Desktop Only - Now Clickable */}
            {monthlyRevenue > 0 && (
              <Link
                href="/dashboard/owner/finance"
                className="hidden xl:flex items-center gap-4 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200/50 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
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
                      <TrendingUp className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-xs text-gray-600 font-medium">ROI</p>
                        <p className="text-sm font-bold text-purple-900">{roi}%</p>
                      </div>
                    </div>
                  </>
                )}
              </Link>
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
                aria-label={`Notifications${(pendingApplications > 0 || unreadMessages > 0) ? ` (${pendingApplications + unreadMessages} non lues)` : ''}`}
                aria-expanded={showNotifications}
                aria-haspopup="true"
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
                  className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-purple-200 group-hover:border-purple-400 transition-colors"
                  style={{
                    background: 'var(--gradient-owner)'
                  }}
                >
                  <Building2 className="w-4 h-4 text-white" />
                </div>
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
                          ? "bg-purple-50 text-purple-900 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
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

                <div className="pt-4 mt-2 border-t border-gray-200">
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

      {/* Quick Stats Bar - Desktop Only - Now with Clickable Stats */}
      {(occupation > 0 || pendingApplications > 0) && (
        <div className="hidden lg:block bg-gradient-to-r from-purple-50/30 to-transparent border-t border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6 text-gray-700">
                {occupation > 0 && (
                  <Link
                    href="/dashboard/owner/properties"
                    className="flex items-center gap-2 hover:text-purple-900 transition-colors group"
                  >
                    <span className="text-gray-600 group-hover:text-purple-700">Occupation:</span>
                    <strong className="text-purple-900 font-bold group-hover:scale-110 transition-transform inline-block">{occupation}%</strong>
                  </Link>
                )}
                {pendingApplications > 0 && (
                  <Link
                    href="/dashboard/owner/applications"
                    className="flex items-center gap-2 hover:text-purple-900 transition-colors group"
                  >
                    <span className="text-gray-600 group-hover:text-purple-700">Candidatures:</span>
                    <strong className="text-purple-900 font-bold group-hover:scale-110 transition-transform inline-block">{pendingApplications}</strong>
                  </Link>
                )}
              </div>
              <Link
                href="/dashboard/owner/finance"
                className="text-purple-600 hover:text-purple-800 transition text-xs font-medium flex items-center gap-1 group"
              >
                Voir analytiques
                <TrendingUp className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
