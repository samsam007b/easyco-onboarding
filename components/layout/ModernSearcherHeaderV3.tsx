'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Heart,
  Users,
  MessageCircle,
  Bell,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Bookmark,
  Save,
  Sparkles,
  Globe,
  Calendar,
  Home,
  MapPin,
  LayoutDashboard,
  FileText,
  Scale,
  Target,
  UserPlus,
  Eye,
  Zap,
  Send,
  CalendarPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/auth/supabase-client';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/use-language';
import { toast } from 'sonner';
import { calculateProfileCompletion, type UserProfile } from '@/lib/profile/profile-completion';
import VerificationBadge, { getVerificationLevel, type VerificationLevel } from '@/components/profile/VerificationBadge';
import { searcherGradientVibrant, searcherColors } from '@/lib/constants/searcher-theme';

// V3 Searcher gradient
const searcherGradient = 'linear-gradient(135deg, #FFA040 0%, #FFB85C 50%, #FFD080 100%)';

interface ModernSearcherHeaderV3Props {
  profile: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  stats?: {
    favoritesCount?: number;
    matchesCount?: number;
    unreadMessages?: number;
    pendingApplications?: number;
    upcomingVisits?: number;
    savedSearches?: number;
  };
}

// Navigation structure by business domain
const navigationDomains = {
  recherche: {
    id: 'recherche',
    label: 'Recherche',
    icon: Search,
    description: 'Trouvez votre logement idéal',
    items: [
      {
        id: 'browse',
        href: '/dashboard/searcher',
        label: 'Parcourir',
        icon: Home,
        description: 'Explorer les annonces',
        color: '#FFA040'
      },
      {
        id: 'favorites',
        href: '/dashboard/searcher/favorites',
        label: 'Favoris',
        icon: Heart,
        description: 'Vos annonces sauvées',
        color: '#FFB85C',
        badgeKey: 'favoritesCount'
      },
      {
        id: 'saved-searches',
        href: '/dashboard/searcher/saved-searches',
        label: 'Alertes',
        icon: Bell,
        description: 'Vos recherches sauvées',
        color: '#FFD080',
        badgeKey: 'savedSearches'
      }
    ]
  },
  matching: {
    id: 'matching',
    label: 'Matching',
    icon: Target,
    description: 'Trouvez vos futurs colocataires',
    items: [
      {
        id: 'top-matches',
        href: '/dashboard/searcher/matching',
        label: 'Top Matches',
        icon: Sparkles,
        description: 'Propriétés compatibles',
        color: '#FFA040',
        badgeKey: 'matchesCount'
      },
      {
        id: 'groups',
        href: '/dashboard/searcher/groups',
        label: 'Groupes',
        icon: Users,
        description: 'Groupes de recherche',
        color: '#FFB85C'
      }
    ]
  },
  candidatures: {
    id: 'candidatures',
    label: 'Candidatures',
    icon: FileText,
    description: 'Gérez vos démarches',
    items: [
      {
        id: 'applications',
        href: '/dashboard/searcher/my-applications',
        label: 'Mes candidatures',
        icon: FileText,
        description: 'Suivi des candidatures',
        color: '#FFA040',
        badgeKey: 'pendingApplications'
      },
      {
        id: 'visits',
        href: '/dashboard/searcher/my-visits',
        label: 'Mes visites',
        icon: Calendar,
        description: 'Visites planifiées',
        color: '#FFB85C',
        badgeKey: 'upcomingVisits'
      },
      {
        id: 'calendar',
        href: '/dashboard/searcher/calendar',
        label: 'Calendrier',
        icon: CalendarPlus,
        description: 'Vue calendrier',
        color: '#FFD080'
      }
    ]
  }
};

// Quick Actions for mobile and dropdown
const quickActions = [
  {
    id: 'new-search',
    label: 'Nouvelle recherche',
    icon: Search,
    href: '/dashboard/searcher',
    color: '#FFA040'
  },
  {
    id: 'schedule-visit',
    label: 'Planifier une visite',
    icon: CalendarPlus,
    href: '/dashboard/searcher/my-visits?new=true',
    color: '#FFB85C'
  },
  {
    id: 'contact-owner',
    label: 'Contacter un proprio',
    icon: Send,
    href: '/dashboard/searcher/messages',
    color: '#FFD080'
  },
  {
    id: 'create-group',
    label: 'Créer un groupe',
    icon: UserPlus,
    href: '/dashboard/searcher/groups/create',
    color: '#FF8C20'
  }
];

const ModernSearcherHeaderV3 = memo(function ModernSearcherHeaderV3({
  profile,
  stats = {}
}: ModernSearcherHeaderV3Props) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const nav = getSection('dashboard')?.searcher?.header || {};
  const common = getSection('common') || {};
  const ariaLabels = getSection('ariaLabels');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  const [favoritesCount, setFavoritesCount] = useState(stats.favoritesCount || 0);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [verificationLevel, setVerificationLevel] = useState<VerificationLevel>('starter');

  const {
    matchesCount = 0,
    unreadMessages = 0,
    pendingApplications = 0,
    upcomingVisits = 0,
    savedSearches = 0
  } = stats;

  // Load favorites count and profile completion
  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load favorites count
      const { count } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setFavoritesCount(count || 0);

      // Load profile completion
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const completion = calculateProfileCompletion(userProfile as UserProfile);
      setProfileCompletion(completion.percentage);

      // Calculate verification level
      const level = getVerificationLevel({
        email_verified: userProfile?.email_verified,
        phone_verified: userProfile?.phone_verified,
        id_verified: userProfile?.id_verified,
      });
      setVerificationLevel(level);
    };

    loadData();

    // Real-time subscription for favorites
    const favoritesChannel = supabase
      .channel('favorites-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'favorites'
      }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(favoritesChannel);
    };
  }, [supabase]);

  const handleLogout = async () => {
    try {
      setShowProfileMenu(false);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error);
        toast.error(common?.logoutError?.[language] || 'Erreur de déconnexion');
        return;
      }

      toast.success(common?.logoutSuccess?.[language] || 'Déconnexion réussie');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(common?.logoutError?.[language] || 'Erreur de déconnexion');
    }
  };

  // Check if any item in a domain is active
  const isDomainActive = (domain: typeof navigationDomains.recherche) => {
    return domain.items.some(item =>
      pathname === item.href || pathname?.startsWith(item.href + '/')
    );
  };

  // Get badge value for an item
  const getBadgeValue = (badgeKey?: string) => {
    if (!badgeKey) return null;
    const statValues: Record<string, number> = {
      favoritesCount,
      matchesCount,
      unreadMessages,
      pendingApplications,
      upcomingVisits,
      savedSearches
    };
    const value = statValues[badgeKey];
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
          <Link href="/dashboard/searcher" className="flex items-center group">
            <img
              src="/logos/izzico-trademark-text-gradient.svg?v=3"
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

              // Calculate total badge for domain
              const domainBadge = domain.items.reduce((acc, item) => {
                const badge = 'badgeKey' in item ? getBadgeValue(item.badgeKey) : 0;
                return acc + (badge || 0);
              }, 0);

              return (
                <div key={domain.id} className="relative">
                  <button
                    onClick={() => setActiveDropdown(isOpen ? null : domain.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 superellipse-xl text-sm font-medium transition-all",
                      isActive || isOpen
                        ? "text-orange-900 bg-orange-50"
                        : "text-gray-600 hover:bg-orange-50/50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{domain.label}</span>
                    {domainBadge > 0 && (
                      <Badge
                        className="ml-1 h-5 min-w-[20px] px-1.5 text-white"
                        style={{ background: searcherGradient }}
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
                      style={{ borderTopColor: '#FFA040' }}
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
                          <div className="px-4 py-3 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFBEA 100%)' }}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 superellipse-lg flex items-center justify-center"
                                style={{ background: searcherGradient }}
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
                                      ? "bg-orange-50"
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
                                      isItemActive ? "text-orange-900" : "text-gray-900"
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
              href="/dashboard/searcher/messages"
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 superellipse-xl text-sm font-medium transition-all",
                pathname?.startsWith('/dashboard/searcher/messages')
                  ? "text-orange-900 bg-orange-50"
                  : "text-gray-600 hover:bg-orange-50/50"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Messages</span>
              {unreadMessages > 0 && (
                <Badge className="ml-1 h-5 min-w-[20px] px-1.5 text-white" style={{ background: searcherGradient }}>
                  {unreadMessages}
                </Badge>
              )}
              {pathname?.startsWith('/dashboard/searcher/messages') && (
                <motion.div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
                  style={{ borderTopColor: '#FFA040' }}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                />
              )}
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Actions Button - Desktop */}
            <div className="relative hidden lg:block">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="rounded-full text-white shadow-lg"
                  style={{ background: searcherGradient, boxShadow: '0 4px 14px rgba(255, 160, 64, 0.3)' }}
                >
                  <Zap className="w-4 h-4 mr-1.5" />
                  Actions
                </Button>
              </motion.div>

              {/* Quick Actions Dropdown */}
              <AnimatePresence>
                {showQuickActions && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowQuickActions(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl superellipse-2xl shadow-xl border border-gray-200/50 overflow-hidden z-20"
                    >
                      <div className="px-4 py-3 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFBEA 100%)' }}>
                        <h3 className="font-semibold text-gray-900">Actions rapides</h3>
                      </div>
                      <div className="p-2">
                        {quickActions.map((action) => {
                          const ActionIcon = action.icon;
                          return (
                            <Link
                              key={action.id}
                              href={action.href}
                              onClick={() => setShowQuickActions(false)}
                              className="flex items-center gap-3 px-3 py-2.5 superellipse-xl hover:bg-gray-50 transition-all group"
                            >
                              <div
                                className="w-8 h-8 superellipse-lg flex items-center justify-center transition-transform group-hover:scale-110"
                                style={{ background: `${action.color}15` }}
                              >
                                <ActionIcon className="w-4 h-4" style={{ color: action.color }} />
                              </div>
                              <span className="text-sm font-medium text-gray-900">{action.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 superellipse-xl hover:bg-gray-100 transition-all"
                aria-label={ariaLabels?.notifications?.[language] || 'Notifications'}
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {(matchesCount > 0 || unreadMessages > 0 || pendingApplications > 0) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white" style={{ background: '#FF8C20' }} />
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
                      <div className="px-4 py-3 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFBEA 100%)' }}>
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {matchesCount > 0 && (
                          <Link
                            href="/dashboard/searcher/matching"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition"
                            onClick={() => setShowNotifications(false)}
                          >
                            <div className="w-10 h-10 superellipse-xl bg-orange-100 flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {matchesCount} nouveau{matchesCount > 1 ? 'x' : ''} match{matchesCount > 1 ? 'es' : ''}
                              </p>
                              <p className="text-xs text-gray-500">Propriétés compatibles</p>
                            </div>
                          </Link>
                        )}
                        {unreadMessages > 0 && (
                          <Link
                            href="/dashboard/searcher/messages"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition"
                            onClick={() => setShowNotifications(false)}
                          >
                            <div className="w-10 h-10 superellipse-xl bg-blue-100 flex items-center justify-center">
                              <MessageCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {unreadMessages} message{unreadMessages > 1 ? 's' : ''} non lu{unreadMessages > 1 ? 's' : ''}
                              </p>
                              <p className="text-xs text-gray-500">Cliquez pour voir</p>
                            </div>
                          </Link>
                        )}
                        {pendingApplications > 0 && (
                          <Link
                            href="/dashboard/searcher/my-applications"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition"
                            onClick={() => setShowNotifications(false)}
                          >
                            <div className="w-10 h-10 superellipse-xl bg-amber-100 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {pendingApplications} candidature{pendingApplications > 1 ? 's' : ''} en cours
                              </p>
                              <p className="text-xs text-gray-500">Cliquez pour voir</p>
                            </div>
                          </Link>
                        )}
                        {upcomingVisits > 0 && (
                          <Link
                            href="/dashboard/searcher/my-visits"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition"
                            onClick={() => setShowNotifications(false)}
                          >
                            <div className="w-10 h-10 superellipse-xl bg-green-100 flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {upcomingVisits} visite{upcomingVisits > 1 ? 's' : ''} à venir
                              </p>
                              <p className="text-xs text-gray-500">Cliquez pour voir</p>
                            </div>
                          </Link>
                        )}
                        {matchesCount === 0 && unreadMessages === 0 && pendingApplications === 0 && upcomingVisits === 0 && (
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
              <LanguageSwitcher variant="searcher" />
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-all group"
              >
                <div className="relative">
                  {/* Progress ring */}
                  <svg className="absolute inset-0 -m-1" width="42" height="42">
                    <circle cx="21" cy="21" r="19" fill="none" stroke="rgba(255,160,64,0.2)" strokeWidth="2" />
                    <circle
                      cx="21" cy="21" r="19"
                      fill="none"
                      stroke="#FFA040"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 19}`}
                      strokeDashoffset={`${2 * Math.PI * 19 * (1 - profileCompletion / 100)}`}
                      transform="rotate(-90 21 21)"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-orange-200 group-hover:border-orange-400 transition-colors"
                    style={{ background: searcherGradient }}
                  >
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        width={32}
                        height={32}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Search className="w-4 h-4 text-white" />
                    )}
                  </div>
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
                      className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl superellipse-3xl shadow-xl border border-gray-200/50 overflow-hidden z-20"
                    >
                      {/* Profile Header */}
                      <div className="relative px-6 py-5" style={{ background: searcherGradient }}>
                        <div className="absolute inset-0 bg-black/5" />
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
                                strokeDashoffset={`${2 * Math.PI * 32 * (1 - profileCompletion / 100)}`}
                                transform="rotate(-90 34 34)"
                                className="transition-all duration-1000"
                              />
                            </svg>
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center overflow-hidden">
                              {profile.avatar_url ? (
                                <Image
                                  src={profile.avatar_url}
                                  alt={profile.full_name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-8 h-8 text-white" />
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                              <VerificationBadge level={verificationLevel} size="md" />
                            </div>
                          </div>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white truncate text-lg">{profile.full_name}</p>
                            <p className="text-white/90 text-sm truncate">{profile.email}</p>
                            <div className="mt-1 flex items-center gap-1.5">
                              <div className="h-1.5 flex-1 bg-white/30 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${profileCompletion}%` }} />
                              </div>
                              <span className="text-xs text-white/90 font-medium">{profileCompletion}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="px-4 py-3 bg-gradient-to-br from-orange-50/50 to-yellow-50/50 border-b border-orange-100/50">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <div className="text-lg font-bold bg-gradient-to-r from-[#FFA040] to-[#FFB85C] bg-clip-text text-transparent">
                              {favoritesCount}
                            </div>
                            <div className="text-xs text-gray-600">Favoris</div>
                          </div>
                          <div className="text-center border-x border-orange-200/50">
                            <div className="text-lg font-bold bg-gradient-to-r from-[#FFA040] to-[#FFB85C] bg-clip-text text-transparent">
                              {matchesCount}
                            </div>
                            <div className="text-xs text-gray-600">Matches</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold bg-gradient-to-r from-[#FFA040] to-[#FFB85C] bg-clip-text text-transparent">
                              {pendingApplications}
                            </div>
                            <div className="text-xs text-gray-600">Candidat.</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="group flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50/50 transition-all"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-9 h-9 superellipse-xl bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <User className="w-4 h-4 text-orange-700" />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-900 font-medium block">Mon Profil</span>
                            <span className="text-xs text-gray-500">Gérer mes informations</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                          href="/dashboard/searcher/saved-searches"
                          className="group flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50/50 transition-all"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-9 h-9 superellipse-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Save className="w-4 h-4 text-blue-700" />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-900 font-medium block">Recherches</span>
                            <span className="text-xs text-gray-500">Mes alertes sauvegardées</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                          href="/settings"
                          className="group flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50/50 transition-all"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-9 h-9 superellipse-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Settings className="w-4 h-4 text-purple-700" />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-900 font-medium block">Paramètres</span>
                            <span className="text-xs text-gray-500">Préférences et confidentialité</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>

                      {/* Complete Profile CTA */}
                      {profileCompletion < 100 && (
                        <div className="px-4 pb-3">
                          <Link
                            href="/profile"
                            className="block w-full px-4 py-2.5 superellipse-xl text-white font-medium text-center hover:shadow-lg hover:scale-[1.02] transition-all"
                            style={{ background: searcherGradient }}
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              <span>Compléter mon profil</span>
                            </div>
                          </Link>
                        </div>
                      )}

                      {/* Divider */}
                      <div className="border-t border-gray-200/80" />

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all text-red-600 group"
                      >
                        <div className="w-9 h-9 superellipse-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 group-hover:scale-110 transition-all">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="font-medium">Se déconnecter</span>
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
                  const domainBadge = domain.items.reduce((acc, item) => {
                    const badge = 'badgeKey' in item ? getBadgeValue(item.badgeKey) : 0;
                    return acc + (badge || 0);
                  }, 0);

                  return (
                    <div key={domain.id}>
                      <button
                        onClick={() => setExpandedMobileSection(isExpanded ? null : domain.id)}
                        className="w-full flex items-center justify-between px-4 py-3 superellipse-xl hover:bg-orange-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-gray-700" />
                          <span className="font-medium text-gray-900">{domain.label}</span>
                          {domainBadge > 0 && (
                            <Badge className="text-white" style={{ background: searcherGradient }}>
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
                                      isActive ? "bg-orange-50 text-orange-900" : "text-gray-700 hover:bg-gray-50"
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
                  href="/dashboard/searcher/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 superellipse-xl transition",
                    pathname?.startsWith('/dashboard/searcher/messages')
                      ? "bg-orange-50 text-orange-900"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">Messages</span>
                  </div>
                  {unreadMessages > 0 && (
                    <Badge className="text-white" style={{ background: searcherGradient }}>
                      {unreadMessages}
                    </Badge>
                  )}
                </Link>

                {/* Quick Actions for Mobile */}
                <div className="pt-4 mt-2 border-t border-gray-200">
                  <p className="px-4 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Actions rapides</p>
                  <div className="grid grid-cols-2 gap-2 px-4">
                    {quickActions.map((action) => {
                      const ActionIcon = action.icon;
                      return (
                        <Link
                          key={action.id}
                          href={action.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 p-3 superellipse-xl bg-gray-50 hover:bg-orange-50 transition"
                        >
                          <ActionIcon className="w-4 h-4" style={{ color: action.color }} />
                          <span className="text-sm font-medium text-gray-900">{action.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
});

export default ModernSearcherHeaderV3;
