'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Bookmark,
  FileText,
  ChevronDown,
  ChevronRight,
  MapPin,
  Euro,
  Calendar,
  Users,
  Bell,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Search,
  Edit3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface SearcherDashboardCompactProps {
  userId: string;
  userData: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

interface DashboardStats {
  favoritesCount: number;
  topMatchesCount: number;
  applicationsCount: number;
  profileCompletion: number;
  unreadMessages: number;
  likedProfiles: number;
}

interface SearchPreferences {
  cities: string[];
  minBudget: number;
  maxBudget: number;
  moveInDate?: string;
}

export default function SearcherDashboardCompact({ userId, userData }: SearcherDashboardCompactProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const [stats, setStats] = useState<DashboardStats>({
    favoritesCount: 0,
    topMatchesCount: 0,
    applicationsCount: 0,
    profileCompletion: 0,
    unreadMessages: 0,
    likedProfiles: 0,
  });

  const [preferences, setPreferences] = useState<SearchPreferences>({
    cities: [],
    minBudget: 0,
    maxBudget: 2000,
  });

  const [alerts, setAlerts] = useState<{ active: number; newResults: number }>({
    active: 0,
    newResults: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      // Load favorites count
      const { count: favCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Load applications count
      const { count: appCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('applicant_id', userId);

      // Load liked profiles count (from user_swipes)
      const { count: likedCount } = await supabase
        .from('user_swipes')
        .select('*', { count: 'exact', head: true })
        .eq('swiper_id', userId)
        .eq('action', 'like');

      // Load unread messages count
      let unreadCount = 0;
      try {
        const { data: unreadData } = await supabase
          .rpc('get_unread_count', { target_user_id: userId });
        if (unreadData !== null) {
          unreadCount = unreadData;
        }
      } catch (err) {
        console.error('Unread count failed:', err);
      }

      // Load alerts count
      const { count: alertsCount } = await supabase
        .from('saved_searches')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Calculate profile completion & load preferences
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      let profileCompletion = 0;
      if (profile) {
        const fields = [
          profile.first_name,
          profile.last_name,
          profile.date_of_birth,
          profile.occupation,
          profile.bio,
          profile.profile_photo_url,
          profile.min_budget,
          profile.max_budget,
          profile.preferred_cities,
          profile.cleanliness_level,
          profile.noise_tolerance,
          profile.smoking !== undefined,
          profile.pets !== undefined
        ];
        const completedFields = fields.filter(field => field !== null && field !== undefined && field !== '').length;
        profileCompletion = Math.round((completedFields / fields.length) * 100);

        // Set preferences from profile
        setPreferences({
          cities: profile.preferred_cities || [],
          minBudget: profile.min_budget || 0,
          maxBudget: profile.max_budget || 2000,
          moveInDate: profile.move_in_date,
        });
      }

      setStats({
        favoritesCount: favCount || 0,
        topMatchesCount: 0, // Will be calculated from matching
        applicationsCount: appCount || 0,
        profileCompletion,
        unreadMessages: unreadCount,
        likedProfiles: likedCount || 0,
      });

      setAlerts({
        active: alertsCount || 0,
        newResults: 0, // Would need to calculate new matches
      });

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // KPI data
  const kpis = [
    {
      id: 'matches',
      icon: Heart,
      value: stats.topMatchesCount,
      label: 'Matchs',
      subLabel: '+3 nouveaux',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      onClick: () => router.push('/matching/matches'),
    },
    {
      id: 'favorites',
      icon: Bookmark,
      value: stats.favoritesCount,
      label: 'Favoris',
      subLabel: '2 dispos',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      onClick: () => router.push('/dashboard/searcher/favorites'),
    },
    {
      id: 'messages',
      icon: MessageCircle,
      value: stats.unreadMessages,
      label: 'Messages',
      subLabel: stats.unreadMessages > 0 ? 'non lus' : 'tous lus',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      badge: stats.unreadMessages > 0,
      onClick: () => router.push('/dashboard/searcher/messages'),
    },
    {
      id: 'profile',
      icon: stats.profileCompletion >= 100 ? CheckCircle2 : AlertCircle,
      value: `${stats.profileCompletion}%`,
      label: 'Profil',
      subLabel: stats.profileCompletion >= 100 ? 'Complet' : 'Compléter',
      color: stats.profileCompletion >= 100 ? 'text-green-600' : 'text-amber-600',
      bgColor: stats.profileCompletion >= 100 ? 'bg-green-50' : 'bg-amber-50',
      borderColor: stats.profileCompletion >= 100 ? 'border-green-200' : 'border-amber-200',
      onClick: () => router.push('/dashboard/my-profile'),
    },
  ];

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 p-4">
        <div className="h-24 bg-gray-200 rounded-2xl" />
        <div className="h-16 bg-gray-200 rounded-xl" />
        <div className="h-16 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-orange-50/80 via-white to-white">
      {/* Compact Header with Profile */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-orange-300 shadow-md">
              {userData.avatar_url ? (
                <Image
                  src={userData.avatar_url}
                  alt={userData.full_name}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {userData.full_name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            {/* Profile completion indicator */}
            {stats.profileCompletion < 100 && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-[8px] font-bold text-white">{stats.profileCompletion}%</span>
              </div>
            )}
          </div>

          {/* Welcome text */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">
              Salut, {userData.full_name.split(' ')[0]} !
            </h1>
            <p className="text-xs text-gray-600 truncate">
              {preferences.cities.length > 0
                ? `Tu cherches à ${preferences.cities.slice(0, 2).join(', ')}${preferences.cities.length > 2 ? '...' : ''}`
                : 'Configure ta recherche'}
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/dashboard/my-profile')}
              className="p-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition"
            >
              <Edit3 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => router.push('/dashboard/searcher/settings')}
              className="p-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition"
            >
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* KPIs - Compact inline grid */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-4 gap-2">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <motion.button
                key={kpi.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={kpi.onClick}
                className={cn(
                  'relative p-3 rounded-xl border transition-all',
                  kpi.bgColor,
                  kpi.borderColor,
                  'hover:shadow-md'
                )}
              >
                {kpi.badge && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">{kpi.value}</span>
                  </div>
                )}
                <div className="flex flex-col items-center gap-1">
                  <Icon className={cn('w-5 h-5', kpi.color)} />
                  <span className={cn('text-lg font-bold', kpi.color)}>{kpi.value}</span>
                  <span className="text-[10px] text-gray-600 leading-tight text-center">{kpi.label}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Collapsible Sections */}
      <div className="px-4 pb-4 space-y-2">
        {/* Ma Recherche Idéale */}
        <motion.div
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
          initial={false}
        >
          <button
            onClick={() => toggleSection('search')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Ma Recherche Idéale</p>
                <p className="text-xs text-gray-500">
                  {preferences.minBudget}-{preferences.maxBudget}€ • {preferences.cities.slice(0, 2).join(', ') || 'Non défini'}
                </p>
              </div>
            </div>
            <ChevronDown className={cn(
              'w-5 h-5 text-gray-400 transition-transform',
              expandedSection === 'search' && 'rotate-180'
            )} />
          </button>

          <AnimatePresence>
            {expandedSection === 'search' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-gray-100"
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Euro className="w-4 h-4" /> Budget
                    </span>
                    <span className="font-medium">{preferences.minBudget}€ - {preferences.maxBudget}€</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Villes
                    </span>
                    <span className="font-medium">{preferences.cities.join(', ') || 'Non définies'}</span>
                  </div>
                  {preferences.moveInDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Disponibilité
                      </span>
                      <span className="font-medium">
                        {new Date(preferences.moveInDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  <Button
                    onClick={() => router.push('/onboarding/searcher-preferences')}
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 rounded-full"
                  >
                    <Edit3 className="w-3 h-3 mr-2" />
                    Modifier mes critères
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Mon Groupe de Coloc */}
        <motion.div
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
          initial={false}
        >
          <button
            onClick={() => toggleSection('group')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Mon Groupe de Coloc</p>
                <p className="text-xs text-gray-500">
                  Toi + {stats.likedProfiles} profils likés
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {stats.likedProfiles > 0 && (
                <Badge className="bg-pink-100 text-pink-700 text-xs">
                  {stats.likedProfiles}
                </Badge>
              )}
              <ChevronDown className={cn(
                'w-5 h-5 text-gray-400 transition-transform',
                expandedSection === 'group' && 'rotate-180'
              )} />
            </div>
          </button>

          <AnimatePresence>
            {expandedSection === 'group' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-gray-100"
              >
                <div className="p-4 space-y-3">
                  <p className="text-sm text-gray-600">
                    Forme ton groupe de colocation idéal en likant des profils compatibles !
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => router.push('/matching/matches')}
                      size="sm"
                      className="flex-1 rounded-full bg-gradient-to-r from-pink-500 to-pink-600"
                    >
                      <Heart className="w-3 h-3 mr-2" />
                      Voir le groupe
                    </Button>
                    <Button
                      onClick={() => router.push('/properties/browse?viewMode=matching')}
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full"
                    >
                      <Search className="w-3 h-3 mr-2" />
                      Swiper
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Mes Alertes */}
        <motion.div
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
          initial={false}
        >
          <button
            onClick={() => toggleSection('alerts')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Mes Alertes</p>
                <p className="text-xs text-gray-500">
                  {alerts.active} alertes actives
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {alerts.newResults > 0 && (
                <Badge className="bg-purple-100 text-purple-700 text-xs">
                  +{alerts.newResults} new
                </Badge>
              )}
              <ChevronDown className={cn(
                'w-5 h-5 text-gray-400 transition-transform',
                expandedSection === 'alerts' && 'rotate-180'
              )} />
            </div>
          </button>

          <AnimatePresence>
            {expandedSection === 'alerts' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-gray-100"
              >
                <div className="p-4">
                  <Button
                    onClick={() => router.push('/dashboard/searcher/saved-searches')}
                    variant="outline"
                    size="sm"
                    className="w-full rounded-full"
                  >
                    Gérer mes alertes
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Separator with gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent mx-4" />
    </div>
  );
}
