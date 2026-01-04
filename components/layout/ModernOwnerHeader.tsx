'use client';

import { useState, memo } from 'react';
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
  ChevronRight,
  Wrench,
  FileText,
  BarChart3,
  Sparkles,
  Briefcase,
  UserCheck,
  Wallet,
  PieChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/use-language';
import { getHookTranslation } from '@/lib/i18n/get-language';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';

// V3 Owner gradient
const ownerGradient = 'linear-gradient(135deg, #9c5698 0%, #a5568d 25%, #af5682 50%, #b85676 75%, #c2566b 100%)';

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
    openMaintenance?: number;
  };
}

// Navigation structure by business domain
const navigationDomains = {
  portfolio: {
    id: 'portfolio',
    label: 'Portfolio',
    icon: Briefcase,
    description: 'Manage your real estate',
    items: [
      {
        id: 'hub',
        href: '/dashboard/owner/portfolio',
        label: 'Overview',
        icon: LayoutDashboard,
        description: 'Portfolio Hub',
        color: '#9c5698'
      },
      {
        id: 'properties',
        href: '/dashboard/owner/properties',
        label: 'Properties',
        icon: Building2,
        description: 'All your properties',
        color: '#a5568d'
      },
      {
        id: 'applications',
        href: '/dashboard/owner/applications',
        label: 'Applications',
        icon: UserCheck,
        description: 'Rental requests',
        color: '#af5682',
        badgeKey: 'pendingApplications'
      }
    ]
  },
  gestion: {
    id: 'gestion',
    label: 'Gestion',
    icon: Users,
    description: 'Manage your tenants',
    items: [
      {
        id: 'hub',
        href: '/dashboard/owner/gestion',
        label: 'Overview',
        icon: LayoutDashboard,
        description: 'Operational management hub',
        color: '#9c5698'
      },
      {
        id: 'tenants',
        href: '/dashboard/owner/tenants',
        label: 'Tenants',
        icon: Users,
        description: 'Your current residents',
        color: '#a5568d'
      },
      {
        id: 'leases',
        href: '/dashboard/owner/leases',
        label: 'Leases',
        icon: FileText,
        description: 'Rental contracts',
        color: '#af5682'
      },
      {
        id: 'maintenance',
        href: '/dashboard/owner/maintenance',
        label: 'Maintenance',
        icon: Wrench,
        description: 'Requests & repairs',
        color: '#b85676',
        badgeKey: 'openMaintenance'
      }
    ]
  },
  finances: {
    id: 'finances',
    label: 'Finances',
    icon: Wallet,
    description: 'Track your income',
    href: '/dashboard/owner/finances',
    items: []
  }
};

const ModernOwnerHeader = memo(function ModernOwnerHeader({
  profile,
  stats = {}
}: ModernOwnerHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, getSection } = useLanguage();
  const ariaLabels = getSection('ariaLabels');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);

  const header = getSection('header');
  const common = getSection('common');
  const notifications = getSection('notifications');

  const {
    monthlyRevenue = 0,
    roi = 0,
    pendingApplications = 0,
    unreadMessages = 0,
    openMaintenance = 0
  } = stats;

  const handleLogout = async () => {
    try {
      setShowProfileMenu(false);
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error);
        toast.error(getHookTranslation('logout', 'error'));
        return;
      }

      toast.success(getHookTranslation('logout', 'success'));
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(getHookTranslation('logout', 'error'));
    }
  };

  // Check if any item in a domain is active (or direct href)
  const isDomainActive = (domain: typeof navigationDomains.portfolio) => {
    // Check direct href first
    const directHref = 'href' in domain ? (domain as { href: string }).href : null;
    if (directHref && (pathname === directHref || pathname?.startsWith(directHref + '/'))) {
      return true;
    }
    // Check items
    return domain.items.some(item =>
      pathname === item.href || pathname?.startsWith(item.href + '/')
    );
  };

  // Get badge value for an item
  const getBadgeValue = (badgeKey?: string) => {
    if (!badgeKey) return null;
    const value = stats[badgeKey as keyof typeof stats];
    return typeof value === 'number' && value > 0 ? value : null;
  };

  // Close dropdown when clicking outside
  const closeDropdown = () => setActiveDropdown(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphism background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/70 backdrop-blur-2xl"
        style={{
          WebkitBackdropFilter: 'blur(32px) saturate(150%)',
          backdropFilter: 'blur(32px) saturate(150%)'
        }}
      />
      <div className="absolute inset-0 border-b border-gray-200/50 shadow-sm" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/dashboard/owner" className="flex items-center group">
            <img
              src="/logos/izzico-trademark-text-gradient.svg?v=2"
              alt="IzzIco"
              className="h-10 w-auto transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation - Mega Menus */}
          <nav className="hidden lg:flex items-center gap-1">
            {Object.values(navigationDomains).map((domain) => {
              const isActive = isDomainActive(domain);
              const Icon = domain.icon;
              const isOpen = activeDropdown === domain.id;
              const hasItems = domain.items.length > 0;
              const directHref = 'href' in domain ? (domain as { href: string }).href : null;

              // Calculate total badge for domain
              const domainBadge = domain.items.reduce((acc, item) => {
                const badge = 'badgeKey' in item ? getBadgeValue(item.badgeKey) : 0;
                return acc + (badge || 0);
              }, 0);

              // Direct link (no dropdown) if domain has href and no items
              if (!hasItems && directHref) {
                return (
                  <div key={domain.id} className="relative">
                    <Link
                      href={directHref}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 superellipse-xl text-sm font-medium transition-all",
                        isActive
                          ? "text-purple-900 bg-purple-50"
                          : "text-gray-600 hover:bg-purple-50/50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{domain.label}</span>
                    </Link>
                    {isActive && (
                      <motion.div
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
                        style={{ borderTopColor: '#9c5698' }}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      />
                    )}
                  </div>
                );
              }

              return (
                <div key={domain.id} className="relative">
                  <button
                    onClick={() => setActiveDropdown(isOpen ? null : domain.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 superellipse-xl text-sm font-medium transition-all",
                      isActive || isOpen
                        ? "text-purple-900 bg-purple-50"
                        : "text-gray-600 hover:bg-purple-50/50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{domain.label}</span>
                    {domainBadge > 0 && (
                      <Badge
                        className="ml-1 h-5 min-w-[20px] px-1.5 text-white"
                        style={{ background: ownerGradient }}
                      >
                        {domainBadge}
                      </Badge>
                    )}
                    <ChevronDown className={cn(
                      "w-3.5 h-3.5 transition-transform",
                      isOpen && "rotate-180"
                    )} />
                  </button>

                  {/* Triangle pointer */}
                  {isActive && !isOpen && (
                    <motion.div
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
                      style={{ borderTopColor: '#9c5698' }}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    />
                  )}

                  {/* Dropdown */}
                  <AnimatePresence>
                    {isOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={closeDropdown} />
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="absolute left-0 mt-3 w-72 bg-white/95 backdrop-blur-xl superellipse-2xl shadow-xl border border-gray-200/50 overflow-hidden z-20"
                        >
                          {/* Domain header */}
                          <div className="px-4 py-3 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #F8F0F7 0%, #FDF5F9 100%)' }}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 superellipse-lg flex items-center justify-center"
                                style={{ background: ownerGradient }}
                              >
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{domain.label}</p>
                                <p className="text-xs text-gray-500">{domain.description}</p>
                              </div>
                            </div>
                          </div>

                          {/* Items */}
                          <div className="p-2">
                            {domain.items.map((item) => {
                              const ItemIcon = item.icon;
                              const badge = 'badgeKey' in item ? getBadgeValue(item.badgeKey) : null;
                              const isItemActive = pathname === item.href;

                              return (
                                <Link
                                  key={item.id}
                                  href={item.href}
                                  onClick={closeDropdown}
                                  className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 superellipse-xl transition-all group",
                                    isItemActive
                                      ? "bg-purple-50"
                                      : "hover:bg-gray-50"
                                  )}
                                >
                                  <div
                                    className="w-9 h-9 superellipse-xl flex items-center justify-center transition-transform group-hover:scale-110"
                                    style={{ background: `${item.color}15` }}
                                  >
                                    <ItemIcon className="w-4.5 h-4.5" style={{ color: item.color }} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={cn(
                                      "text-sm font-medium",
                                      isItemActive ? "text-purple-900" : "text-gray-900"
                                    )}>
                                      {item.label}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{item.description}</p>
                                  </div>
                                  {badge && (
                                    <Badge
                                      className="text-white"
                                      style={{ background: item.color }}
                                    >
                                      {badge}
                                    </Badge>
                                  )}
                                  <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Messages - Direct link */}
            <Link
              href="/dashboard/owner/messages"
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 superellipse-xl text-sm font-medium transition-all",
                pathname?.startsWith('/dashboard/owner/messages')
                  ? "text-purple-900 bg-purple-50"
                  : "text-gray-600 hover:bg-purple-50/50"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Messages</span>
              {unreadMessages > 0 && (
                <Badge className="ml-1 h-5 min-w-[20px] px-1.5 text-white" style={{ background: ownerGradient }}>
                  {unreadMessages}
                </Badge>
              )}
              {pathname?.startsWith('/dashboard/owner/messages') && (
                <motion.div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
                  style={{ borderTopColor: '#9c5698' }}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                />
              )}
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Add Property Button - Desktop */}
            <Link href="/dashboard/owner?addProperty=true" className="hidden lg:block">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  className="rounded-full text-white shadow-lg"
                  style={{ background: ownerGradient, boxShadow: '0 4px 14px rgba(156, 86, 152, 0.3)' }}
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add
                </Button>
              </motion.div>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 superellipse-xl hover:bg-gray-100 transition-all"
                aria-label={ariaLabels?.notifications?.[language] || 'Notifications'}
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {(pendingApplications > 0 || unreadMessages > 0) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white" style={{ background: '#c2566b' }} />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl superellipse-2xl shadow-xl border border-gray-200/50 overflow-hidden z-20"
                    >
                      <div className="px-4 py-3 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #F8F0F7 0%, #FDF5F9 100%)' }}>
                        <h3 className="font-semibold text-gray-900">{notifications?.title || 'Notifications'}</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {pendingApplications > 0 && (
                          <Link
                            href="/dashboard/owner/applications"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition"
                            onClick={() => setShowNotifications(false)}
                          >
                            <div className="w-10 h-10 superellipse-xl bg-amber-100 flex items-center justify-center">
                              <UserCheck className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {pendingApplications} pending application{pendingApplications > 1 ? 's' : ''}
                              </p>
                              <p className="text-xs text-gray-500">Click to view</p>
                            </div>
                          </Link>
                        )}
                        {unreadMessages > 0 && (
                          <Link
                            href="/dashboard/owner/messages"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition"
                            onClick={() => setShowNotifications(false)}
                          >
                            <div className="w-10 h-10 superellipse-xl bg-blue-100 flex items-center justify-center">
                              <MessageCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {unreadMessages} unread message{unreadMessages > 1 ? 's' : ''}
                              </p>
                              <p className="text-xs text-gray-500">Click to view</p>
                            </div>
                          </Link>
                        )}
                        {openMaintenance > 0 && (
                          <Link
                            href="/dashboard/owner/maintenance"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition"
                            onClick={() => setShowNotifications(false)}
                          >
                            <div className="w-10 h-10 superellipse-xl bg-orange-100 flex items-center justify-center">
                              <Wrench className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {openMaintenance} open ticket{openMaintenance > 1 ? 's' : ''}
                              </p>
                              <p className="text-xs text-gray-500">Click to view</p>
                            </div>
                          </Link>
                        )}
                        {pendingApplications === 0 && unreadMessages === 0 && openMaintenance === 0 && (
                          <div className="px-4 py-8 text-center text-gray-500">
                            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">{notifications?.none || 'No notifications'}</p>
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
              <LanguageSwitcher variant="owner" />
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-all group"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-purple-200 group-hover:border-purple-400 transition-colors"
                  style={{ background: ownerGradient }}
                >
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600 hidden md:block" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl superellipse-2xl shadow-xl border border-gray-200/50 overflow-hidden z-20"
                    >
                      {/* Profile Header */}
                      <div className="px-5 py-4" style={{ background: 'linear-gradient(135deg, #F8F0F7 0%, #FDF5F9 100%)' }}>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-md"
                            style={{ background: ownerGradient }}
                          >
                            {profile.avatar_url ? (
                              <Image
                                src={profile.avatar_url}
                                alt={profile.full_name}
                                width={48}
                                height={48}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 truncate">{profile.full_name}</p>
                            <p className="text-sm text-gray-600 truncate">{profile.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      {monthlyRevenue > 0 && (
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-emerald-600" />
                              <span className="text-sm text-gray-600">Monthly income</span>
                            </div>
                            <span className="font-bold text-gray-900">€{monthlyRevenue.toLocaleString()}</span>
                          </div>
                          {roi > 0 && (
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-purple-600" />
                                <span className="text-sm text-gray-600">ROI</span>
                              </div>
                              <span className="font-bold text-purple-900">{roi}%</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <User className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-gray-900">{common?.myProfile || 'My Profile'}</span>
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Settings className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">{common?.settings || 'Settings'}</span>
                        </Link>
                      </div>

                      <div className="border-t border-gray-100" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">{common?.logout || 'Sign out'}</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 superellipse-xl hover:bg-gray-100 transition-all"
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
              <nav className="py-4 space-y-2">
                {/* Domain sections for mobile */}
                {Object.values(navigationDomains).map((domain) => {
                  const Icon = domain.icon;
                  const isExpanded = expandedMobileSection === domain.id;
                  const hasItems = domain.items.length > 0;
                  const directHref = 'href' in domain ? (domain as { href: string }).href : null;
                  const domainBadge = domain.items.reduce((acc, item) => {
                    const badge = 'badgeKey' in item ? getBadgeValue(item.badgeKey) : 0;
                    return acc + (badge || 0);
                  }, 0);

                  // Direct link (no expandable) if domain has href and no items
                  if (!hasItems && directHref) {
                    const isActive = pathname === directHref || pathname?.startsWith(directHref + '/');
                    return (
                      <Link
                        key={domain.id}
                        href={directHref}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 superellipse-xl transition",
                          isActive ? "bg-purple-50 text-purple-900" : "hover:bg-purple-50"
                        )}
                      >
                        <Icon className="w-5 h-5 text-gray-700" />
                        <span className="font-medium text-gray-900">{domain.label}</span>
                      </Link>
                    );
                  }

                  return (
                    <div key={domain.id}>
                      <button
                        onClick={() => setExpandedMobileSection(isExpanded ? null : domain.id)}
                        className="w-full flex items-center justify-between px-4 py-3 superellipse-xl hover:bg-purple-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-gray-700" />
                          <span className="font-medium text-gray-900">{domain.label}</span>
                          {domainBadge > 0 && (
                            <Badge className="text-white" style={{ background: ownerGradient }}>
                              {domainBadge}
                            </Badge>
                          )}
                        </div>
                        <ChevronDown className={cn(
                          "w-5 h-5 text-gray-400 transition-transform",
                          isExpanded && "rotate-180"
                        )} />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-8 pr-4 py-2 space-y-1">
                              {domain.items.map((item) => {
                                const ItemIcon = item.icon;
                                const badge = 'badgeKey' in item ? getBadgeValue(item.badgeKey) : null;
                                const isActive = pathname === item.href;

                                return (
                                  <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                      "flex items-center justify-between px-4 py-2.5 superellipse-xl transition",
                                      isActive ? "bg-purple-50 text-purple-900" : "text-gray-700 hover:bg-gray-50"
                                    )}
                                  >
                                    <div className="flex items-center gap-3">
                                      <ItemIcon className="w-4 h-4" style={{ color: item.color }} />
                                      <span className="font-medium">{item.label}</span>
                                    </div>
                                    {badge && (
                                      <Badge className="text-white" style={{ background: item.color }}>
                                        {badge}
                                      </Badge>
                                    )}
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Messages direct link */}
                <Link
                  href="/dashboard/owner/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 superellipse-xl transition",
                    pathname?.startsWith('/dashboard/owner/messages')
                      ? "bg-purple-50 text-purple-900"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">Messages</span>
                  </div>
                  {unreadMessages > 0 && (
                    <Badge className="text-white" style={{ background: ownerGradient }}>
                      {unreadMessages}
                    </Badge>
                  )}
                </Link>

                {/* Add Property CTA */}
                <div className="pt-4 mt-2 border-t border-gray-200 px-4">
                  <Link href="/dashboard/owner?addProperty=true" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-full text-white" style={{ background: ownerGradient }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add a property
                    </Button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
});

export default ModernOwnerHeader;
