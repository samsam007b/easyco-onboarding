'use client';

import { useEffect, useState, memo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import { shouldShowDemoData } from '@/lib/utils/admin-demo';
import { motion } from 'framer-motion';
import Image from 'next/image';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Heart,
  Search,
  FileText,
  Bookmark,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Euro,
  Calendar,
  TrendingUp,
  Plus,
  Clock,
  Home,
  Filter,
  Bell,
  Eye,
  ChevronDown,
  Trophy,
  Target,
  Settings,
  Users,
  ChevronRight,
} from 'lucide-react';
import {
  OnboardingTour,
  useOnboarding,
  OnboardingStep,
  GettingStartedChecklist,
  useGettingStarted,
  SEARCHER_CHECKLIST_ITEMS,
  celebrateToast,
} from '@/components/onboarding';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import OptimizedPropertyCard from '@/components/optimized/OptimizedPropertyCard';
import SmartFilters from '@/components/optimized/SmartFilters';
import PropertyComparison from '@/components/optimized/PropertyComparison';
import EnhancedSkeleton from '@/components/optimized/EnhancedSkeleton';
import { useMatching } from '@/lib/hooks/use-matching';
import { useLanguage } from '@/lib/i18n/use-language';
import { calculateProfileCompletion, type UserProfile } from '@/lib/profile/profile-completion';
import VerificationBadge, { getVerificationLevel, type VerificationLevel } from '@/components/profile/VerificationBadge';
import SubscriptionBanner from '@/components/subscriptions/SubscriptionBanner';
import UpgradeNotification from '@/components/subscriptions/UpgradeNotification';

// V3-FUN Searcher Palette (Amber/Gold theme)
const SEARCHER_GRADIENT = 'linear-gradient(135deg, #F59E0B 0%, #FFB10B 50%, #FCD34D 100%)';
const SEARCHER_GRADIENT_SOFT = 'linear-gradient(135deg, #F59E0B20 0%, #FFB10B15 50%, #FCD34D10 100%)';
const SEARCHER_PRIMARY = '#FFB10B';
const SEARCHER_DARK = '#F59E0B';
const CARD_BG_GRADIENT = 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)';
const ACCENT_SHADOW = 'rgba(255, 177, 11, 0.15)';
// Semantic Pastel Colors
const SEMANTIC_SUCCESS = '#7CB89B';
const SEMANTIC_SUCCESS_BG = 'linear-gradient(135deg, #F0F7F4 0%, #E8F5EE 100%)';
const SEMANTIC_ERROR = '#D08080';
const SEMANTIC_ERROR_BG = 'linear-gradient(135deg, #FDF5F5 0%, #FAE8E8 100%)';

interface DashboardStats {
  favoritesCount: number;
  topMatchesCount: number;
  applicationsCount: number;
  profileCompletion: number;
  unreadMessages: number;
  savedSearchesCount: number;
  viewsCount: number;
  likedProfiles: number;
  verificationLevel: VerificationLevel;
}

interface SearchPreferences {
  cities: string[];
  minBudget: number;
  maxBudget: number;
  moveInDate?: string;
}

interface SavedSearch {
  id: string;
  name: string;
  location: string;
  priceRange: string;
  moveInDate?: string;
  resultsCount: number;
  lastUpdated: string;
}

interface Activity {
  id: string;
  icon: any;
  iconBgColor: string;
  iconColor: string;
  title: string;
  subtitle: string;
  time: string;
  link?: string;
}

// Helper function to get relative time string
interface RelativeTimeTranslations {
  recently?: string;
  minutesAgo?: string;
  hoursAgo?: string;
  yesterday?: string;
  daysAgo?: string;
}

function getRelativeTime(
  dateString: string | null,
  translations?: RelativeTimeTranslations,
  locale: string = 'fr-FR'
): string {
  if (!dateString) return translations?.recently || 'Récemment';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    const template = translations?.minutesAgo || 'Il y a {count} min';
    return template.replace('{count}', String(diffMins));
  }
  if (diffHours < 24) {
    const template = translations?.hoursAgo || 'Il y a {count}h';
    return template.replace('{count}', String(diffHours));
  }
  if (diffDays === 1) return translations?.yesterday || 'Hier';
  if (diffDays < 7) {
    const template = translations?.daysAgo || 'Il y a {count} jours';
    return template.replace('{count}', String(diffDays));
  }
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

interface ModernSearcherDashboardProps {
  userId?: string;
  userData?: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

const ModernSearcherDashboard = memo(function ModernSearcherDashboard({
  userId: propsUserId,
  userData: propsUserData,
}: ModernSearcherDashboardProps) {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const searcher = getSection('dashboard')?.searcher;
  const common = getSection('common');

  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(propsUserId || null);
  const [userData, setUserData] = useState<typeof propsUserData>(propsUserData);
  const [showCompletionDetails, setShowCompletionDetails] = useState(false);
  const [showSmartFilters, setShowSmartFilters] = useState(false);
  const [comparisonProperties, setComparisonProperties] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const [stats, setStats] = useState<DashboardStats>({
    favoritesCount: 0,
    topMatchesCount: 0,
    applicationsCount: 0,
    profileCompletion: 0,
    unreadMessages: 0,
    savedSearchesCount: 0,
    viewsCount: 0,
    likedProfiles: 0,
    verificationLevel: 'starter',
  });

  const [preferences, setPreferences] = useState<SearchPreferences>({
    cities: [],
    minBudget: 0,
    maxBudget: 2000,
  });

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  // Get locale for date formatting
  const localeMap: { [key: string]: string } = {
    fr: 'fr-FR',
    en: 'en-US',
    nl: 'nl-NL',
    de: 'de-DE',
  };
  const locale = localeMap[language] || 'fr-FR';

  // Get current date formatted
  const currentDate = new Date().toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Get first name
  const firstName = userData?.full_name?.split(' ')[0] || '';

  // Mock data for admin demo accounts
  const MOCK_SAVED_SEARCHES: SavedSearch[] = [
    {
      id: 'demo-1',
      name: 'Bruxelles Centre',
      location: 'Bruxelles',
      priceRange: '€600-900',
      moveInDate: '2024-12-01',
      resultsCount: 12,
      lastUpdated: 'Il y a 2h',
    },
    {
      id: 'demo-2',
      name: 'Liège Étudiant',
      location: 'Liège',
      priceRange: '€400-600',
      resultsCount: 8,
      lastUpdated: 'Hier',
    },
  ];

  const MOCK_RECENT_ACTIVITIES: Activity[] = [
    {
      id: 'demo-1',
      icon: Home,
      iconBgColor: `${SEMANTIC_SUCCESS}20`,
      iconColor: SEMANTIC_SUCCESS,
      title: 'Nouvelle propriété disponible',
      subtitle: 'Correspond à ta recherche "Bruxelles Centre"',
      time: 'Il y a 1h',
      link: '/properties/browse',
    },
    {
      id: 'demo-2',
      icon: MessageCircle,
      iconBgColor: `${SEARCHER_PRIMARY}15`,
      iconColor: SEARCHER_PRIMARY,
      title: 'Nouveau message du propriétaire',
      subtitle: 'Appartement rue des Chartreux',
      time: 'Il y a 3h',
      link: '/dashboard/searcher/messages',
    },
    {
      id: 'demo-3',
      icon: Eye,
      iconBgColor: `${SEMANTIC_SUCCESS}20`,
      iconColor: SEMANTIC_SUCCESS,
      title: 'Ton profil a été consulté',
      subtitle: 'Par le propriétaire de "Studio Quartier Européen"',
      time: 'Hier',
    },
  ];

  // Use matching hook
  const {
    propertiesWithMatches,
    isLoading: matchesLoading,
    loadPropertiesWithMatches,
    getTopMatches,
  } = useMatching(userId || undefined);

  // Onboarding steps
  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      target: '[data-onboarding="kpi-cards"]',
      title: searcher?.onboarding?.welcome?.title || 'Bienvenue sur IzzIco ! 🏠',
      description: searcher?.onboarding?.welcome?.description || 'Voici ton tableau de bord. Tu y trouveras un résumé de ton activité.',
      position: 'bottom',
    },
    {
      id: 'profile',
      target: '[data-onboarding="profile-card"]',
      title: searcher?.onboarding?.profile?.title || 'Ton profil',
      description: searcher?.onboarding?.profile?.description || 'Un profil complet améliore tes chances de matcher avec les bonnes colocations.',
      position: 'bottom',
    },
    {
      id: 'browse',
      target: '[data-onboarding="quick-actions"]',
      title: searcher?.onboarding?.browse?.title || 'Actions rapides',
      description: searcher?.onboarding?.browse?.description || 'Accède rapidement aux fonctionnalités principales.',
      position: 'bottom',
    },
  ];

  const onboarding = useOnboarding({
    tourId: 'searcher-dashboard-v3',
    steps: onboardingSteps,
    onComplete: () => {
      logger.info('Onboarding completed');
    },
  });

  // Getting Started checklist
  const gettingStarted = useGettingStarted({
    checklistId: 'searcher-checklist',
    items: SEARCHER_CHECKLIST_ITEMS,
    onAllComplete: () => {
      celebrateToast.checklistComplete();
    },
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (userId) {
      loadPropertiesWithMatches();
    }
  }, [userId, loadPropertiesWithMatches]);

  useEffect(() => {
    if (!matchesLoading && propertiesWithMatches.length > 0) {
      const topMatchesCount = getTopMatches(70).length;
      setStats((prev) => ({ ...prev, topMatchesCount }));
    }
  }, [propertiesWithMatches, matchesLoading, getTopMatches]);

  const loadDashboardData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

      const isAdminDemo = shouldShowDemoData(user.email);

      // Load user data if not provided via props
      if (!propsUserData) {
        const { data: usersData } = await supabase
          .from('users')
          .select('full_name, email, avatar_url')
          .eq('id', user.id)
          .single();

        if (usersData) {
          setUserData({
            id: user.id,
            full_name: usersData.full_name || 'Utilisateur',
            email: usersData.email || '',
            avatar_url: usersData.avatar_url,
          });
        }
      }

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

      // Load liked profiles count
      const { count: likedCount } = await supabase
        .from('user_swipes')
        .select('*', { count: 'exact', head: true })
        .eq('swiper_id', user.id)
        .eq('action', 'like');

      // Load saved searches
      const { data: savedSearchesData, count: searchesCount } = await supabase
        .from('saved_searches')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (isAdminDemo && (!savedSearchesData || savedSearchesData.length === 0)) {
        setSavedSearches(MOCK_SAVED_SEARCHES);
        setRecentActivities(MOCK_RECENT_ACTIVITIES);
      } else if (savedSearchesData && savedSearchesData.length > 0) {
        const transformedSearches: SavedSearch[] = savedSearchesData.map((search: any) => ({
          id: search.id,
          name: search.name || search.location || 'Ma recherche',
          location: search.location || search.city || 'Non spécifié',
          priceRange:
            search.min_price && search.max_price
              ? `€${search.min_price}-${search.max_price}`
              : 'Tout budget',
          moveInDate: search.move_in_date,
          resultsCount: search.results_count || 0,
          lastUpdated: getRelativeTime(search.updated_at || search.created_at),
        }));
        setSavedSearches(transformedSearches);
        setRecentActivities([]);
      } else {
        setSavedSearches([]);
        setRecentActivities([]);
      }

      // Load unread messages
      let unreadCount = 0;
      try {
        const { data: unreadData } = await supabase.rpc('get_unread_count', {
          target_user_id: user.id,
        });
        if (unreadData !== null) {
          unreadCount = unreadData;
        }
      } catch {
        // Silently handle
      }

      // Load profile and calculate completion
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const completionResult = calculateProfileCompletion(profile as UserProfile);
      const profileCompletion = completionResult.percentage;

      const verificationLevel = getVerificationLevel({
        email_verified: profile?.email_verified,
        phone_verified: profile?.phone_verified,
        id_verified: profile?.id_verified,
      });

      if (profile) {
        setPreferences({
          cities: profile.preferred_cities || [],
          minBudget: profile.min_budget || 0,
          maxBudget: profile.max_budget || 2000,
          moveInDate: profile.move_in_date,
        });
      }

      // Load favorites for marking
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user.id);

      if (favoritesData) {
        setFavorites(new Set(favoritesData.map((f) => f.property_id)));
      }

      setStats({
        favoritesCount: favCount || 0,
        topMatchesCount: 0,
        applicationsCount: appCount || 0,
        profileCompletion,
        unreadMessages: unreadCount,
        savedSearchesCount: searchesCount || 0,
        viewsCount: 0,
        likedProfiles: likedCount || 0,
        verificationLevel,
      });
    } catch (error) {
      logger.error('Error loading dashboard', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteClick = async (propertyId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
      if (userId) {
        await supabase.from('favorites').delete().eq('user_id', userId).eq('property_id', propertyId);
      }
    } else {
      newFavorites.add(propertyId);
      if (userId) {
        await supabase.from('favorites').insert({ user_id: userId, property_id: propertyId });
      }
    }
    setFavorites(newFavorites);
  };

  const handleSmartFilterApply = (filters: any) => {
    const params = new URLSearchParams();
    if (filters.cities && filters.cities.length > 0) {
      params.set('location', filters.cities[0]);
    }
    if (filters.priceRange) {
      params.set('min_price', filters.priceRange.min.toString());
      params.set('max_price', filters.priceRange.max.toString());
    }
    router.push(`/properties/browse?${params.toString()}`);
    setShowSmartFilters(false);
  };

  const handleAddToComparison = (property: any) => {
    if (comparisonProperties.length >= 4) {
      alert(searcher?.maxCompareWarning || 'Maximum 4 propriétés');
      return;
    }
    if (!comparisonProperties.find((p) => p.id === property.id)) {
      setComparisonProperties([...comparisonProperties, property]);
    }
  };

  const handleRemoveFromComparison = (propertyId: string) => {
    setComparisonProperties(comparisonProperties.filter((p) => p.id !== propertyId));
  };

  // V3-FUN KPI Cards
  const kpiCards = [
    {
      title: searcher?.favorites || 'Favoris',
      value: stats.favoritesCount,
      subtitle: searcher?.savedProperties || 'Biens sauvegardés',
      icon: Bookmark,
      iconGradient: SEARCHER_GRADIENT,
      shadowColor: ACCENT_SHADOW,
      action: () => router.push('/dashboard/searcher/favorites'),
      onboardingId: 'favorites-card',
    },
    {
      title: searcher?.groups || 'Groupes',
      value: stats.likedProfiles,
      subtitle: searcher?.matchedProfiles || 'Profils matchés',
      icon: Users,
      iconGradient: SEARCHER_GRADIENT,
      shadowColor: ACCENT_SHADOW,
      action: () => router.push('/dashboard/searcher/groups'),
      onboardingId: 'groups-card',
    },
    {
      title: searcher?.messages || 'Messages',
      value: stats.unreadMessages,
      subtitle:
        stats.unreadMessages > 0
          ? searcher?.unreadMessages || 'Non lus'
          : searcher?.noNewMessages || 'Aucun nouveau',
      icon: MessageCircle,
      iconGradient:
        stats.unreadMessages > 0
          ? `linear-gradient(135deg, ${SEMANTIC_ERROR} 0%, #E0A0A0 100%)`
          : SEARCHER_GRADIENT,
      shadowColor: stats.unreadMessages > 0 ? 'rgba(208, 128, 128, 0.15)' : ACCENT_SHADOW,
      action: () => router.push('/dashboard/searcher/messages'),
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined,
    },
    {
      title: searcher?.profileLabel || 'Profil',
      value: `${stats.profileCompletion}%`,
      subtitle:
        stats.profileCompletion >= 100
          ? searcher?.profileComplete || 'Complet !'
          : searcher?.profileToComplete || 'À compléter',
      icon: stats.profileCompletion >= 100 ? CheckCircle2 : Target,
      iconGradient:
        stats.profileCompletion >= 100
          ? `linear-gradient(135deg, ${SEMANTIC_SUCCESS} 0%, #9ECDB5 100%)`
          : SEARCHER_GRADIENT,
      shadowColor: stats.profileCompletion >= 100 ? 'rgba(124, 184, 155, 0.15)' : ACCENT_SHADOW,
      progress: stats.profileCompletion,
      action: () => router.push('/dashboard/profile-completion'),
    },
  ];

  // Quick actions
  const quickActions = [
    {
      icon: Search,
      label: searcher?.actionBrowse || 'Explorer',
      onClick: () => router.push('/browse'),
      primary: true,
    },
    {
      icon: Heart,
      label: searcher?.actionMatching || 'Matching',
      onClick: () => router.push('/matching/properties'),
    },
    {
      icon: Calendar,
      label: searcher?.actionVisits || 'Visites',
      onClick: () => router.push('/dashboard/searcher/my-visits'),
    },
    {
      icon: FileText,
      label: searcher?.actionApplications || 'Candidatures',
      onClick: () => router.push('/dashboard/searcher/my-applications'),
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Circular progress component
  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-16 h-16">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="4"
            fill="none"
          />
          <motion.circle
            cx="32"
            cy="32"
            r={radius}
            stroke="white"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-black text-sm">{percentage}%</span>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium">{searcher?.loading || 'Chargement...'}</p>
        </div>
      </div>
    );
  }

  const topMatches = getTopMatches(70).slice(0, 4);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Stripe Upgrade Notification */}
      <UpgradeNotification />

      {/* V3-FUN Glassmorphism background with Searcher amber gradient */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/10 via-[#FFB10B]/8 to-[#FCD34D]/5" />

        {/* Animated gradient blobs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-[#F59E0B]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-[#FFB10B]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#FCD34D]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />

        {/* Glass effect overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/50" />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-6"
      >
        {/* V3-FUN Split Asymmetric Header */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-6">
          {/* LEFT: Search Profile Card */}
          <motion.div
            variants={itemVariants}
            data-onboarding="profile-card"
            className="w-full lg:w-72 flex-shrink-0"
          >
            <div
              className="relative overflow-hidden superellipse-3xl p-5 h-full min-h-[220px]"
              style={{
                background: SEARCHER_GRADIENT,
                boxShadow: `0 20px 60px ${ACCENT_SHADOW}`,
              }}
            >
              {/* Decorative elements */}
              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10" />
              <div className="absolute -left-6 -bottom-6 w-20 h-20 rounded-full bg-white/10" />

              <div className="relative z-10 flex flex-col h-full justify-between">
                {/* Avatar and user info */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div whileHover={{ scale: 1.05 }} className="relative">
                      <div className="w-14 h-14 superellipse-2xl bg-white/20 backdrop-blur flex items-center justify-center overflow-hidden border-2 border-white/30">
                        {userData?.avatar_url ? (
                          <Image
                            src={userData.avatar_url}
                            alt={userData.full_name}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold text-white">
                            {userData?.full_name?.charAt(0) || '?'}
                          </span>
                        )}
                      </div>
                      {/* Verification Badge */}
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-md">
                        <VerificationBadge level={stats.verificationLevel} size="sm" />
                      </div>
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black text-white truncate">
                        {userData?.full_name || 'Utilisateur'}
                      </h3>
                      <p className="text-white/80 text-sm truncate">
                        {searcher?.searcherProfile || 'Chercheur'}
                      </p>
                    </div>
                  </div>

                  {/* Search preferences summary */}
                  {preferences.cities.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-2 superellipse-xl">
                        <MapPin className="w-4 h-4 text-white flex-shrink-0" />
                        <span className="text-white font-medium text-sm truncate">
                          {preferences.cities.slice(0, 2).join(', ')}
                          {preferences.cities.length > 2 && ` +${preferences.cities.length - 2}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-2 superellipse-xl">
                        <Euro className="w-4 h-4 text-white flex-shrink-0" />
                        <span className="text-white font-medium text-sm">
                          {preferences.minBudget}-{preferences.maxBudget}€/mois
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/15 backdrop-blur px-3 py-2 superellipse-xl">
                      <p className="text-white/80 text-sm">
                        {searcher?.configureSearch || 'Configure ta recherche'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom: Profile completion or edit button */}
                <div className="mt-4 flex items-center justify-between">
                  {stats.profileCompletion < 100 ? (
                    <CircularProgress percentage={stats.profileCompletion} />
                  ) : (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-2 superellipse-xl"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      <span className="text-white font-bold text-sm">
                        {searcher?.profileComplete || 'Complet!'}
                      </span>
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/profile')}
                    className="flex items-center gap-1.5 bg-white text-gray-900 px-4 py-2 superellipse-xl font-bold text-sm shadow-lg"
                  >
                    <Settings className="w-4 h-4" />
                    <span>{searcher?.editProfile || 'Modifier'}</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Welcome + Quick Actions */}
          <motion.div variants={itemVariants} className="flex-1 flex flex-col gap-4">
            {/* Welcome Section */}
            <div
              className="relative overflow-hidden superellipse-3xl p-6 bg-white"
              style={{ boxShadow: `0 12px 32px ${ACCENT_SHADOW}` }}
            >
              {/* Decorative gradient blob */}
              <div
                className="absolute -right-16 -top-16 w-40 h-40 rounded-full opacity-30"
                style={{ background: SEARCHER_GRADIENT }}
              />

              <div className="relative z-10">
                {/* Date pill */}
                <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full mb-3">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-sm text-gray-600 font-medium capitalize">{currentDate}</span>
                </div>

                {/* Welcome message */}
                <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-1">
                  {searcher?.welcomeBack || 'Salut'}
                  {firstName ? `, ${firstName}` : ''} ! 👋
                </h2>
                <p className="text-gray-500 font-medium">
                  {searcher?.welcomeSubtitle || 'Prêt à trouver ton futur chez-toi ?'}
                </p>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div
              data-onboarding="quick-actions"
              className="relative overflow-hidden superellipse-2xl p-4 bg-white"
              style={{ boxShadow: `0 8px 24px ${ACCENT_SHADOW}` }}
            >
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={action.onClick}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2.5 superellipse-xl font-semibold text-sm',
                        'transition-all whitespace-nowrap flex-shrink-0',
                        action.primary
                          ? 'text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                      style={action.primary ? { background: SEARCHER_GRADIENT } : undefined}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{action.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Next step hint (if profile incomplete) */}
            {stats.profileCompletion < 100 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => router.push('/dashboard/profile-completion')}
                className="flex items-center gap-3 px-4 py-3 superellipse-2xl cursor-pointer hover:opacity-90 transition-opacity"
                style={{ background: SEARCHER_GRADIENT_SOFT }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: SEARCHER_PRIMARY }} />
                </motion.div>
                <span className="text-sm font-medium text-gray-700">
                  {searcher?.nextStep || 'Prochaine étape'}:{' '}
                  <span className="font-bold">{searcher?.completeProfile || 'Complète ton profil'}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Subscription Banner */}
        {userId && (
          <div className="mb-6">
            <SubscriptionBanner userId={userId} />
          </div>
        )}

        {/* Getting Started Checklist */}
        {gettingStarted.isLoaded && !gettingStarted.isDismissed && !gettingStarted.isAllComplete && (
          <motion.div variants={itemVariants} className="mb-6">
            <GettingStartedChecklist
              items={gettingStarted.items}
              completedCount={gettingStarted.completedCount}
              totalCount={gettingStarted.totalCount}
              progress={gettingStarted.progress}
              isAllComplete={gettingStarted.isAllComplete}
              onDismiss={gettingStarted.dismissChecklist}
              onCompleteItem={gettingStarted.completeItem}
              variant="searcher"
            />
          </motion.div>
        )}

        {/* V3-FUN KPI Cards Grid */}
        <motion.div
          data-onboarding="kpi-cards"
          variants={containerVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6"
        >
          {kpiCards.map((card) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={card.action}
                data-onboarding={card.onboardingId}
                className="relative overflow-hidden superellipse-2xl p-4 cursor-pointer transition-all bg-white"
                style={{
                  boxShadow: `0 8px 24px ${card.shadowColor}`,
                }}
              >
                {/* Decorative circle */}
                <div
                  className="absolute -right-6 -top-6 w-20 h-20 rounded-full opacity-25"
                  style={{ background: card.iconGradient }}
                />

                {/* Badge for notifications */}
                {card.badge && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge
                      className="px-2 py-0.5 text-xs font-bold text-white border-0"
                      style={{ background: SEMANTIC_ERROR }}
                    >
                      {card.badge}
                    </Badge>
                  </div>
                )}

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="w-10 h-10 superellipse-xl flex items-center justify-center mb-3"
                    style={{ background: card.iconGradient }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xs font-medium text-gray-500 mb-0.5">{card.title}</h3>

                  {/* Value */}
                  <p className="text-xl font-black text-gray-900 mb-1">{card.value}</p>

                  {/* Subtitle or Progress */}
                  {card.progress !== undefined ? (
                    <>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${card.progress}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: card.iconGradient }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">{card.subtitle}</p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500">{card.subtitle}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Top Matches Section */}
        {topMatches.length > 0 && (
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="w-8 h-8 superellipse-lg flex items-center justify-center"
                  style={{ background: SEARCHER_GRADIENT }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
                <h3 className="text-base font-bold text-gray-900">
                  {searcher?.yourBestMatches || 'Tes meilleurs matchs'}
                </h3>
              </div>
              {stats.topMatchesCount > 4 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/dashboard/searcher/groups')}
                  className="rounded-full font-medium text-xs h-8 px-3"
                  style={{ color: SEARCHER_PRIMARY }}
                >
                  {searcher?.viewAll || 'Tout voir'}
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <OptimizedPropertyCard
                    property={{
                      id: match.id,
                      title: match.title,
                      description: match.description,
                      city: match.city,
                      neighborhood: match.neighborhood,
                      monthly_rent: match.price,
                      bedrooms: match.bedrooms,
                      property_type: match.furnished ? 'Meublé' : 'Non meublé',
                      main_image: match.images?.[0],
                      images: match.images,
                      available_from: match.available_from,
                    }}
                    variant="compact"
                    showCompatibilityScore
                    compatibilityScore={match.matchResult ? Math.round(match.matchResult.score) : undefined}
                    onFavoriteClick={handleFavoriteClick}
                    isFavorite={favorites.has(match.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {matchesLoading && (
          <motion.div variants={itemVariants} className="mb-6">
            <EnhancedSkeleton variant="card" count={4} />
          </motion.div>
        )}

        {/* Two Column Layout - Saved Searches & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Saved Searches */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-white superellipse-2xl p-5"
            style={{ boxShadow: `0 8px 24px ${ACCENT_SHADOW}` }}
          >
            <div
              className="absolute -right-10 -top-10 w-28 h-28 rounded-full opacity-20"
              style={{ background: SEARCHER_GRADIENT }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="w-8 h-8 superellipse-lg flex items-center justify-center"
                    style={{ background: SEARCHER_GRADIENT }}
                  >
                    <Filter className="w-4 h-4 text-white" />
                  </motion.div>
                  {searcher?.savedSearches || 'Recherches Sauvegardées'}
                </h3>
                <Button
                  onClick={() => setShowSmartFilters(true)}
                  variant="ghost"
                  size="sm"
                  className="rounded-full font-medium text-xs h-8 px-3"
                  style={{ color: SEARCHER_PRIMARY }}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {searcher?.newSearch || 'Nouveau'}
                </Button>
              </div>

              {savedSearches.length > 0 ? (
                <div className="space-y-2">
                  {savedSearches.slice(0, 3).map((search, index) => (
                    <motion.div
                      key={search.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06 }}
                      whileHover={{ x: 3, backgroundColor: `${SEARCHER_PRIMARY}08` }}
                      className="flex items-center justify-between p-3 bg-gray-50 superellipse-xl transition-all cursor-pointer"
                      onClick={() => router.push('/properties/browse')}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 superellipse-lg flex items-center justify-center bg-[#FEF3C7]">
                          <MapPin className="w-4 h-4" style={{ color: SEARCHER_PRIMARY }} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{search.name}</p>
                          <p className="text-xs text-gray-500">{search.priceRange}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="font-medium text-xs">
                        {search.resultsCount}
                      </Badge>
                    </motion.div>
                  ))}

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      onClick={() => router.push('/dashboard/searcher/saved-searches')}
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 superellipse-xl border-2 py-4 font-semibold"
                      style={{
                        borderColor: `${SEARCHER_PRIMARY}30`,
                        color: SEARCHER_PRIMARY,
                      }}
                    >
                      {searcher?.viewAllSearches || 'Voir toutes les recherches'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div
                    className="w-12 h-12 superellipse-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: SEARCHER_GRADIENT_SOFT }}
                  >
                    <Search className="w-6 h-6" style={{ color: SEARCHER_PRIMARY }} />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                    {searcher?.noSavedSearches || 'Aucune recherche'}
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">
                    {searcher?.saveSearchCriteria || 'Sauvegarde tes critères pour être notifié'}
                  </p>
                  <Button
                    onClick={() => setShowSmartFilters(true)}
                    size="sm"
                    className="superellipse-xl text-white"
                    style={{ background: SEARCHER_GRADIENT }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {searcher?.createFirstSearch || 'Créer une recherche'}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-white superellipse-2xl p-5"
            style={{ boxShadow: `0 8px 24px ${ACCENT_SHADOW}` }}
          >
            <div
              className="absolute -left-10 -bottom-10 w-28 h-28 rounded-full opacity-20"
              style={{ background: SEARCHER_GRADIENT }}
            />

            <div className="relative z-10">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="w-8 h-8 superellipse-lg flex items-center justify-center"
                  style={{ background: SEARCHER_GRADIENT }}
                >
                  <Bell className="w-4 h-4 text-white" />
                </motion.div>
                {searcher?.recentActivity || 'Activité Récente'}
              </h3>

              {recentActivities.length > 0 ? (
                <div className="space-y-2">
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.06 }}
                        whileHover={{ x: 3 }}
                        className="flex items-center gap-2.5 p-2.5 superellipse-xl hover:bg-gray-50 transition-all cursor-pointer"
                        onClick={() => activity.link && router.push(activity.link)}
                      >
                        <div
                          className="w-8 h-8 superellipse-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: activity.iconBgColor }}
                        >
                          <Icon className="w-4 h-4" style={{ color: activity.iconColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.subtitle}</p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div
                    className="w-12 h-12 superellipse-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: SEARCHER_GRADIENT_SOFT }}
                  >
                    <Bell className="w-6 h-6" style={{ color: SEARCHER_PRIMARY }} />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                    {searcher?.noRecentActivity || 'Aucune activité'}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {searcher?.notificationsWillAppear || 'Tes notifications apparaîtront ici'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Smart Filters Modal */}
        {showSmartFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSmartFilters(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white superellipse-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6" style={{ color: SEARCHER_PRIMARY }} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {searcher?.smartFilters || 'Filtres intelligents'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowSmartFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <ArrowRight className="w-5 h-5 text-gray-600 rotate-180" />
                </button>
              </div>
              <SmartFilters onFilterApply={handleSmartFilterApply} />
            </motion.div>
          </motion.div>
        )}

        {/* Comparison Floating Button */}
        {comparisonProperties.length > 0 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="fixed bottom-8 right-8 z-40">
            <Button
              onClick={() => setShowComparison(true)}
              size="lg"
              className="text-white shadow-2xl rounded-full px-6 py-6"
              style={{ background: SEARCHER_GRADIENT }}
            >
              <TrendingUp className="w-6 h-6 mr-2" />
              {searcher?.compare || 'Comparer'} ({comparisonProperties.length})
            </Button>
          </motion.div>
        )}

        {/* Property Comparison Modal */}
        {showComparison && comparisonProperties.length > 0 && (
          <PropertyComparison
            properties={comparisonProperties}
            onClose={() => setShowComparison(false)}
            onRemoveProperty={handleRemoveFromComparison}
          />
        )}
      </motion.div>

      {/* Onboarding Tour */}
      <OnboardingTour
        isActive={onboarding.isActive}
        currentStep={onboarding.currentStep}
        currentStepData={onboarding.currentStepData}
        totalSteps={onboarding.totalSteps}
        onNext={onboarding.nextStep}
        onPrev={onboarding.prevStep}
        onSkip={onboarding.skipTour}
        onComplete={onboarding.endTour}
        variant="searcher"
      />
    </div>
  );
});

export default ModernSearcherDashboard;
