'use client';

import { useState, useEffect, memo } from 'react';
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
  Sparkles,
  Calendar,
  FileText,
  Map,
  Home,
  Target,
  UserPlus,
  Clock,
  Zap,
  Filter,
  Eye,
  Send,
  Star,
  LayoutDashboard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/auth/supabase-client';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/use-language';
import { getHookTranslation } from '@/lib/i18n/get-language';
import { toast } from 'sonner';
import { calculateProfileCompletion, type UserProfile } from '@/lib/profile/profile-completion';
import VerificationBadge, { getVerificationLevel, type VerificationLevel } from '@/components/profile/VerificationBadge';

// V3-FUN Searcher Palette (Amber/Gold theme)
const SEARCHER_GRADIENT = 'linear-gradient(135deg, #F59E0B 0%, #FFB10B 50%, #FCD34D 100%)';
const SEARCHER_GRADIENT_SOFT = 'linear-gradient(135deg, #FFF9E6 0%, #FEF3C7 100%)';
const SEARCHER_PRIMARY = '#FFB10B';
const SEARCHER_DARK = '#F59E0B';
const ACCENT_SHADOW = 'rgba(255, 177, 11, 0.15)';

interface SearcherMegaMenuHeaderProps {
  profile: {
    id?: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  stats?: {
    favoritesCount?: number;
    matchesCount?: number;
    unreadMessages?: number;
    applicationsCount?: number;
    visitsCount?: number;
    groupsCount?: number;
  };
}

// Navigation structure by business domain
const navigationDomains = {
  recherche: {
    id: 'recherche',
    label: 'Recherche',
    icon: Search,
    description: 'Explorer les biens disponibles',
    items: [
      {
        id: 'explore',
        href: '/searcher/explore',
        label: 'Explorer',
        icon: Search,
        description: 'Parcourir tous les biens',
        color: '#F59E0B'
      },
      {
        id: 'map',
        href: '/searcher/map',
        label: 'Carte',
        icon: Map,
        description: 'Vue carte interactive',
        color: '#10B981'
      },
      {
        id: 'favorites',
        href: '/searcher/favorites',
        label: 'Favoris',
        icon: Bookmark,
        description: 'Biens sauvegardés',
        color: '#EC4899',
        badgeKey: 'favoritesCount'
      },
      {
        id: 'alerts',
        href: '/searcher/alerts',
        label: 'Alertes',
        icon: Bell,
        description: 'Recherches sauvegardées',
        color: '#8B5CF6'
      }
    ]
  },
  matching: {
    id: 'matching',
    label: 'Matching',
    icon: Heart,
    description: 'Trouver ta colocation idéale',
    items: [
      {
        id: 'properties',
        href: '/searcher/matching',
        label: 'Propriétés compatibles',
        icon: Home,
        description: 'Biens avec haut score',
        color: '#F59E0B',
        badgeKey: 'matchesCount'
      },
      {
        id: 'people',
        href: '/searcher/matching/people',
        label: 'Colocataires',
        icon: Users,
        description: 'Swipe & Match',
        color: '#EC4899'
      },
      {
        id: 'groups',
        href: '/searcher/groups',
        label: 'Groupes',
        icon: UserPlus,
        description: 'Recherche en groupe',
        color: '#8B5CF6',
        badgeKey: 'groupsCount'
      }
    ]
  },
  demarches: {
    id: 'demarches',
    label: 'Mes démarches',
    icon: FileText,
    description: 'Suivre tes candidatures',
    items: [
      {
        id: 'applications',
        href: '/searcher/applications',
        label: 'Candidatures',
        icon: Send,
        description: 'Suivi des demandes',
        color: '#3B82F6',
        badgeKey: 'applicationsCount'
      },
      {
        id: 'visits',
        href: '/searcher/visits',
        label: 'Visites',
        icon: Calendar,
        description: 'Rendez-vous planifiés',
        color: '#10B981',
        badgeKey: 'visitsCount'
      },
      {
        id: 'calendar',
        href: '/searcher/calendar',
        label: 'Calendrier',
        icon: Clock,
        description: 'Vue calendrier',
        color: '#6366F1'
      }
    ]
  }
};

// Quick actions for dropdown
const quickActions = [
  {
    id: 'new-search',
    label: 'Nouvelle recherche',
    icon: Search,
    href: '/searcher/explore',
    color: '#F59E0B'
  },
  {
    id: 'apply',
    label: 'Déposer une candidature',
    icon: Send,
    href: '/searcher/applications/new',
    color: '#3B82F6'
  },
  {
    id: 'schedule-visit',
    label: 'Planifier une visite',
    icon: Calendar,
    href: '/searcher/visits/new',
    color: '#10B981'
  },
  {
    id: 'create-group',
    label: 'Créer un groupe',
    icon: UserPlus,
    href: '/searcher/groups/create',
    color: '#8B5CF6'
  }
];

const SearcherMegaMenuHeader = memo(function SearcherMegaMenuHeader({
  profile,
  stats = {}
}: SearcherMegaMenuHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const common = getSection('common');
  const ariaLabels = getSection('ariaLabels');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);

  // Local stats state
  const [localStats, setLocalStats] = useState({
    favoritesCount: stats.favoritesCount || 0,
    matchesCount: stats.matchesCount || 0,
    unreadMessages: stats.unreadMessages || 0,
    applicationsCount: stats.applicationsCount || 0,
    visitsCount: stats.visitsCount || 0,
    groupsCount: stats.groupsCount || 0,
  });
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [verificationLevel, setVerificationLevel] = useState<VerificationLevel>('starter');

  // Load real-time stats
  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load favorites count
      const { count: favCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Load applications count
      const { count: appCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('applicant_id', user.id);

      // Load groups count
      const { count: groupCount } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Load unread messages
      let unreadCount = 0;
      try {
        const { data: unreadData } = await supabase
          .rpc('get_unread_count', { target_user_id: user.id });
        if (unreadData !== null) {
          unreadCount = unreadData;
        }
      } catch (err) {
        // Ignore RPC errors
      }

      // Load profile completion
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        const completion = calculateProfileCompletion(profileData as UserProfile);
        setProfileCompletion(completion.percentage);

        const level = getVerificationLevel({
          email_verified: profileData?.email_verified,
          phone_verified: profileData?.phone_verified,
          id_verified: profileData?.id_verified,
        });
        setVerificationLevel(level);
      }

      setLocalStats({
        favoritesCount: favCount || 0,
        matchesCount: stats.matchesCount || 0,
        unreadMessages: unreadCount,
        applicationsCount: appCount || 0,
        visitsCount: stats.visitsCount || 0,
        groupsCount: groupCount || 0,
      });
    };

    loadData();

    // Real-time subscriptions
    const channel = supabase
      .channel('searcher-header-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'favorites' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles' }, loadData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, stats]);

  const handleLogout = async () => {
    try {
      setShowProfileMenu(false);
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(getHookTranslation('logout', 'error'));
        return;
      }
      toast.success(getHookTranslation('logout', 'success'));
      window.location.href = '/';
    } catch (error) {
      toast.error(getHookTranslation('logout', 'error'));
    }
  };

  // Check if domain is active
  const isDomainActive = (domain: typeof navigationDomains.recherche) => {
    return domain.items.some(item =>
      pathname === item.href || pathname?.startsWith(item.href + '/')
    );
  };

  // Get badge value
  const getBadgeValue = (badgeKey?: string) => {
    if (!badgeKey) return null;
    const value = localStats[badgeKey as keyof typeof localStats];
    return typeof value === 'number' && value > 0 ? value : null;
  };

  const closeDropdown = () => setActiveDropdown(null);
  const closeAllMenus = () => {
    setActiveDropdown(null);
    setShowProfileMenu(false);
    setShowNotifications(false);
    setShowQuickActions(false);
  };

  // Total notifications count
  const totalNotifications = localStats.unreadMessages + localStats.applicationsCount;

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
      <div className="absolute inset-0 border-b border-amber-100/50 shadow-sm" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/searcher" className="flex items-center group">
            <img
              src="/logos/izzico-trademark-text-gradient.svg"
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
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                      isActive || isOpen
                        ? "text-amber-900 bg-amber-50"
                        : "text-gray-600 hover:bg-amber-50/50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{domain.label}</span>
                    {domainBadge > 0 && (
                      <Badge
                        className="ml-1 h-5 min-w-[20px] px-1.5 text-white"
                        style={{ background: SEARCHER_GRADIENT }}
                      >
                        {domainBadge}
                      </Badge>
                    )}
                    <ChevronDown className={cn(
                      "w-3.5 h-3.5 transition-transform",
                      isOpen && "rotate-180"
                    )} />
                  </button>

                  {/* Triangle pointer when active */}
                  {isActive && !isOpen && (
                    <motion.div
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
                      style={{ borderTopColor: SEARCHER_PRIMARY }}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    />
                  )}

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={closeDropdown} />
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="absolute left-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-100/50 overflow-hidden z-20"
                        >
                          {/* Domain header */}
                          <div className="px-4 py-3 border-b border-amber-100/50" style={{ background: SEARCHER_GRADIENT_SOFT }}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: SEARCHER_GRADIENT }}
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
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                                    isItemActive
                                      ? "bg-amber-50"
                                      : "hover:bg-gray-50"
                                  )}
                                >
                                  <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                                    style={{ background: `${item.color}15` }}
                                  >
                                    <ItemIcon className="w-4.5 h-4.5" style={{ color: item.color }} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={cn(
                                      "text-sm font-medium",
                                      isItemActive ? "text-amber-900" : "text-gray-900"
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
              href="/searcher/messages"
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                pathname?.startsWith('/searcher/messages')
                  ? "text-amber-900 bg-amber-50"
                  : "text-gray-600 hover:bg-amber-50/50"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Messages</span>
              {localStats.unreadMessages > 0 && (
                <Badge className="ml-1 h-5 min-w-[20px] px-1.5 text-white" style={{ background: SEARCHER_GRADIENT }}>
                  {localStats.unreadMessages}
                </Badge>
              )}
              {pathname?.startsWith('/searcher/messages') && (
                <motion.div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
                  style={{ borderTopColor: SEARCHER_PRIMARY }}
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
                  style={{ background: SEARCHER_GRADIENT, boxShadow: `0 4px 14px ${ACCENT_SHADOW}` }}
                >
                  <Zap className="w-4 h-4 mr-1.5" />
                  Actions
                  <ChevronDown className={cn("w-3.5 h-3.5 ml-1 transition-transform", showQuickActions && "rotate-180")} />
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
                      className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-100/50 overflow-hidden z-20"
                    >
                      <div className="px-4 py-3 border-b border-amber-100/50" style={{ background: SEARCHER_GRADIENT_SOFT }}>
                        <p className="font-semibold text-gray-900">Actions rapides</p>
                      </div>
                      <div className="p-2">
                        {quickActions.map((action) => {
                          const ActionIcon = action.icon;
                          return (
                            <Link
                              key={action.id}
                              href={action.href}
                              onClick={() => setShowQuickActions(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all group"
                            >
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{ background: `${action.color}15` }}
                              >
                                <ActionIcon className="w-4 h-4" style={{ color: action.color }} />
                              </div>
                              <span className="text-sm font-medium text-gray-900">{action.label}</span>
                              <ChevronRight className="w-4 h-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100" />
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
                className="relative p-2 rounded-xl hover:bg-amber-50 transition-all"
                aria-label={ariaLabels?.notifications?.[language] || 'Notifications'}
              >
                <Bell className="w-5 h-5 text-gray-700" />
                {totalNotifications > 0 && (
                  <span
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white"
                    style={{ background: SEARCHER_PRIMARY }}
                  />
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
                      className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-100/50 overflow-hidden z-20"
                    >
                      <div className="px-4 py-3 border-b border-amber-100/50" style={{ background: SEARCHER_GRADIENT_SOFT }}>
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {localStats.unreadMessages > 0 && (
                          <Link
                            href="/searcher/messages"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-amber-50 transition"
                            onClick={() => setShowNotifications(false)}
                          >
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                              <MessageCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {localStats.unreadMessages} nouveau{localStats.unreadMessages > 1 ? 'x' : ''} message{localStats.unreadMessages > 1 ? 's' : ''}
                              </p>
                              <p className="text-xs text-gray-500">Voir les messages</p>
                            </div>
                          </Link>
                        )}
                        {localStats.applicationsCount > 0 && (
                          <Link
                            href="/searcher/applications"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-amber-50 transition"
                            onClick={() => setShowNotifications(false)}
                          >
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                              <Send className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {localStats.applicationsCount} candidature{localStats.applicationsCount > 1 ? 's' : ''} en cours
                              </p>
                              <p className="text-xs text-gray-500">Suivre mes candidatures</p>
                            </div>
                          </Link>
                        )}
                        {totalNotifications === 0 && (
                          <div className="px-4 py-8 text-center">
                            <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Aucune notification</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-amber-50 transition-all"
              >
                <div className="relative">
                  {/* Profile completion ring */}
                  <svg className="w-10 h-10 -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      fill="none"
                      stroke={SEARCHER_PRIMARY}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={`${(profileCompletion / 100) * 113} 113`}
                    />
                  </svg>
                  {/* Avatar */}
                  <div className="absolute inset-1 rounded-full overflow-hidden bg-amber-100">
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold" style={{ color: SEARCHER_DARK }}>
                        {profile.full_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  {/* Verification badge */}
                  <div className="absolute -bottom-0.5 -right-0.5">
                    <VerificationBadge level={verificationLevel} size="sm" />
                  </div>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-gray-600 transition-transform hidden sm:block", showProfileMenu && "rotate-180")} />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-100/50 overflow-hidden z-20"
                    >
                      {/* Profile header */}
                      <div className="px-4 py-4 border-b border-amber-100/50" style={{ background: SEARCHER_GRADIENT_SOFT }}>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-amber-100">
                              {profile.avatar_url ? (
                                <Image
                                  src={profile.avatar_url}
                                  alt={profile.full_name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-lg font-bold" style={{ color: SEARCHER_DARK }}>
                                  {profile.full_name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1">
                              <VerificationBadge level={verificationLevel} size="sm" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{profile.full_name}</p>
                            <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${profileCompletion}%`, background: SEARCHER_GRADIENT }}
                                />
                              </div>
                              <span className="text-xs font-medium" style={{ color: SEARCHER_DARK }}>{profileCompletion}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick stats */}
                      <div className="grid grid-cols-3 gap-2 p-3 border-b border-amber-100/50">
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{localStats.favoritesCount}</p>
                          <p className="text-xs text-gray-500">Favoris</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{localStats.applicationsCount}</p>
                          <p className="text-xs text-gray-500">Candidatures</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{localStats.groupsCount}</p>
                          <p className="text-xs text-gray-500">Groupes</p>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-2">
                        <Link
                          href="/searcher/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all"
                        >
                          <User className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-900">Mon profil</span>
                        </Link>
                        <Link
                          href="/searcher/settings"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all"
                        >
                          <Settings className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-900">Paramètres</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-all text-red-600"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Déconnexion</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-amber-50 transition-all"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-amber-100/50 bg-white/95 backdrop-blur-xl"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {/* Domain sections */}
              {Object.values(navigationDomains).map((domain) => {
                const Icon = domain.icon;
                const isExpanded = expandedMobileSection === domain.id;

                return (
                  <div key={domain.id} className="border border-amber-100/50 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedMobileSection(isExpanded ? null : domain.id)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-amber-50/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: `${SEARCHER_PRIMARY}15` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: SEARCHER_PRIMARY }} />
                        </div>
                        <span className="font-medium text-gray-900">{domain.label}</span>
                      </div>
                      <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform", isExpanded && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-amber-100/50 bg-amber-50/30"
                        >
                          {domain.items.map((item) => {
                            const ItemIcon = item.icon;
                            const badge = 'badgeKey' in item ? getBadgeValue(item.badgeKey) : null;

                            return (
                              <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-amber-50 transition-all"
                              >
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                                  style={{ background: `${item.color}15` }}
                                >
                                  <ItemIcon className="w-4 h-4" style={{ color: item.color }} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                                  <p className="text-xs text-gray-500">{item.description}</p>
                                </div>
                                {badge && (
                                  <Badge className="text-white" style={{ background: item.color }}>
                                    {badge}
                                  </Badge>
                                )}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Messages */}
              <Link
                href="/searcher/messages"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 border border-amber-100/50 rounded-xl hover:bg-amber-50/50 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium text-gray-900">Messages</span>
                {localStats.unreadMessages > 0 && (
                  <Badge className="ml-auto text-white" style={{ background: SEARCHER_GRADIENT }}>
                    {localStats.unreadMessages}
                  </Badge>
                )}
              </Link>

              {/* Quick Actions */}
              <div className="pt-2 border-t border-amber-100/50">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Actions rapides</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => {
                    const ActionIcon = action.icon;
                    return (
                      <Link
                        key={action.id}
                        href={action.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-amber-50/50 transition-all"
                      >
                        <ActionIcon className="w-4 h-4" style={{ color: action.color }} />
                        <span className="text-sm text-gray-900">{action.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

export default SearcherMegaMenuHeader;
