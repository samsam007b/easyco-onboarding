'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import { useLanguage } from '@/lib/i18n/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Search,
  Heart,
  Users,
  MessageCircle,
  Calendar,
  FileText,
  Map,
  Home,
  Bell,
  Sparkles,
  TrendingUp,
  Clock,
  Eye,
  Send,
  Star,
  ChevronRight,
  Bookmark,
  UserPlus,
  Zap,
  Target,
  ArrowUpRight,
  Activity,
} from 'lucide-react';

// V3-FUN Searcher Palette
const SEARCHER_GRADIENT = 'linear-gradient(135deg, #F59E0B 0%, #FFB10B 50%, #FCD34D 100%)';
const SEARCHER_GRADIENT_SOFT = 'linear-gradient(135deg, #FFF9E6 0%, #FEF3C7 100%)';
const SEARCHER_PRIMARY = '#FFB10B';
const SEARCHER_DARK = '#F59E0B';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

interface DashboardStats {
  newListings: number;
  matches: number;
  favorites: number;
  applications: number;
  visits: number;
  groups: number;
  unreadMessages: number;
  profileCompletion: number;
}

interface RecentActivity {
  id: string;
  type: 'match' | 'application' | 'message' | 'visit' | 'favorite';
  title: string;
  description: string;
  timestamp: Date;
  icon: typeof Heart;
  color: string;
}

export default function SearcherCommandCenter() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.searcher;

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{
    id: string;
    full_name: string;
    avatar_url?: string;
  } | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    newListings: 0,
    matches: 0,
    favorites: 0,
    applications: 0,
    visits: 0,
    groups: 0,
    unreadMessages: 0,
    profileCompletion: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bonjour');
    else if (hour < 18) setGreeting('Bon après-midi');
    else setGreeting('Bonsoir');
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Load user profile
      const { data: profile } = await supabase
        .from('users')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserData({ id: user.id, ...profile });
      }

      // Load stats in parallel
      const [
        favoritesRes,
        matchesRes,
        applicationsRes,
        visitsRes,
        groupsRes,
        unreadRes
      ] = await Promise.all([
        supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('user_matches').select('*', { count: 'exact', head: true })
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .gte('compatibility_score', 70)
          .eq('is_active', true),
        supabase.from('applications').select('*', { count: 'exact', head: true })
          .eq('applicant_id', user.id)
          .in('status', ['pending', 'reviewing']),
        supabase.from('property_visits').select('*', { count: 'exact', head: true })
          .eq('visitor_id', user.id)
          .eq('status', 'confirmed')
          .gte('visit_date', new Date().toISOString()),
        supabase.from('search_groups').select('*', { count: 'exact', head: true })
          .contains('member_ids', [user.id]),
        supabase.rpc('get_unread_count', { target_user_id: user.id })
      ]);

      // Calculate profile completion
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      let completion = 30; // Base completion
      if (userProfile) {
        if (userProfile.bio) completion += 10;
        if (userProfile.phone) completion += 10;
        if (userProfile.occupation) completion += 10;
        if (userProfile.interests?.length > 0) completion += 10;
        if (userProfile.lifestyle_preferences) completion += 15;
        if (userProfile.budget_min && userProfile.budget_max) completion += 15;
      }

      setStats({
        newListings: 12, // Could be fetched from a "new this week" query
        matches: matchesRes.count || 0,
        favorites: favoritesRes.count || 0,
        applications: applicationsRes.count || 0,
        visits: visitsRes.count || 0,
        groups: groupsRes.count || 0,
        unreadMessages: unreadRes.data || 0,
        profileCompletion: Math.min(completion, 100)
      });

      // Mock recent activity (would be fetched from activity log)
      setRecentActivity([
        {
          id: '1',
          type: 'match',
          title: 'Nouveau match !',
          description: 'Appartement T3 à Bruxelles - 92% compatible',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          icon: Heart,
          color: '#EC4899'
        },
        {
          id: '2',
          type: 'application',
          title: 'Candidature envoyée',
          description: 'Studio moderne à Ixelles',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          icon: Send,
          color: '#3B82F6'
        },
        {
          id: '3',
          type: 'visit',
          title: 'Visite confirmée',
          description: 'Demain à 14h - Colocation Saint-Gilles',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          icon: Calendar,
          color: '#10B981'
        }
      ]);

      setLoading(false);
    };

    loadDashboardData();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      id: 'explore',
      label: 'Explorer',
      description: 'Découvrir les biens',
      icon: Search,
      href: '/searcher/explore',
      color: '#F59E0B',
      gradient: 'from-amber-500 to-yellow-400'
    },
    {
      id: 'matching',
      label: 'Matching',
      description: 'Trouver ton match',
      icon: Heart,
      href: '/searcher/matching',
      color: '#EC4899',
      gradient: 'from-pink-500 to-rose-400',
      badge: stats.matches > 0 ? stats.matches : undefined
    },
    {
      id: 'applications',
      label: 'Candidatures',
      description: 'Suivre tes demandes',
      icon: FileText,
      href: '/searcher/applications',
      color: '#3B82F6',
      gradient: 'from-blue-500 to-cyan-400',
      badge: stats.applications > 0 ? stats.applications : undefined
    },
    {
      id: 'messages',
      label: 'Messages',
      description: 'Conversations',
      icon: MessageCircle,
      href: '/messages',
      color: '#8B5CF6',
      gradient: 'from-violet-500 to-purple-400',
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined
    }
  ];

  const kpiCards = [
    {
      id: 'listings',
      title: 'Nouveaux biens',
      value: stats.newListings,
      subtitle: 'cette semaine',
      icon: Home,
      color: '#F59E0B',
      href: '/searcher/explore?sort=newest'
    },
    {
      id: 'matches',
      title: 'Matchs',
      value: stats.matches,
      subtitle: 'compatibilité > 70%',
      icon: Heart,
      color: '#EC4899',
      href: '/searcher/matching'
    },
    {
      id: 'favorites',
      title: 'Favoris',
      value: stats.favorites,
      subtitle: 'biens sauvegardés',
      icon: Bookmark,
      color: '#8B5CF6',
      href: '/searcher/favorites'
    },
    {
      id: 'visits',
      title: 'Visites',
      value: stats.visits,
      subtitle: 'planifiées',
      icon: Calendar,
      color: '#10B981',
      href: '/searcher/visits'
    }
  ];

  return (
    <div className="min-h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {greeting}, {userData?.full_name?.split(' ')[0] || 'Chercheur'} !
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Votre tableau de bord pour trouver votre colocation idéale
              </p>
            </div>

            {/* Profile Completion */}
            {stats.profileCompletion < 100 && (
              <Link href="/profile/searcher">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-4 rounded-2xl border-2 border-amber-200 cursor-pointer hover:border-amber-300 transition-colors"
                  style={{ background: SEARCHER_GRADIENT_SOFT }}
                >
                  <div className="relative">
                    <svg className="w-14 h-14 transform -rotate-90">
                      <circle cx="28" cy="28" r="24" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                      <circle
                        cx="28" cy="28" r="24" fill="none" stroke={SEARCHER_PRIMARY} strokeWidth="4"
                        strokeDasharray={`${(stats.profileCompletion / 100) * 150.8} 150.8`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
                      {stats.profileCompletion}%
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Complétez votre profil</p>
                    <p className="text-sm text-gray-600">+{100 - stats.profileCompletion}% pour plus de matchs</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </motion.div>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" style={{ color: SEARCHER_PRIMARY }} />
            Actions rapides
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.id} href={action.href}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative overflow-hidden rounded-2xl p-5 cursor-pointer bg-gradient-to-br ${action.gradient} text-white shadow-lg`}
                  style={{ boxShadow: `0 8px 24px ${action.color}40` }}
                >
                  {action.badge && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                        {action.badge}
                      </Badge>
                    </div>
                  )}
                  <action.icon className="w-8 h-8 mb-3 opacity-90" />
                  <p className="font-bold text-lg">{action.label}</p>
                  <p className="text-sm opacity-80">{action.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" style={{ color: SEARCHER_PRIMARY }} />
            Votre activité
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpiCards.map((kpi) => (
              <Link key={kpi.id} href={kpi.href}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="relative overflow-hidden rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  {/* Decorative circle */}
                  <div
                    className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10"
                    style={{ background: kpi.color }}
                  />
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${kpi.color}15` }}
                  >
                    <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                  <p className="text-sm font-medium text-gray-700">{kpi.title}</p>
                  <p className="text-xs text-gray-500">{kpi.subtitle}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card className="rounded-2xl border-0 shadow-md overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5" style={{ color: SEARCHER_PRIMARY }} />
                    Activité récente
                  </h3>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    Voir tout
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                {recentActivity.length === 0 ? (
                  <div className="text-center py-12">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: SEARCHER_GRADIENT_SOFT }}
                    >
                      <Activity className="w-8 h-8" style={{ color: SEARCHER_PRIMARY }} />
                    </div>
                    <p className="text-gray-600 font-medium">Aucune activité récente</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Commencez à explorer pour voir votre activité ici
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${activity.color}15` }}
                        >
                          <activity.icon className="w-5 h-5" style={{ color: activity.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                        </div>
                        <p className="text-xs text-gray-400 flex-shrink-0">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Suggestions Panel */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl border-0 shadow-md overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5" style={{ color: SEARCHER_PRIMARY }} />
                  Suggestions
                </h3>

                <div className="space-y-4">
                  {/* Suggestion Card 1 */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl border border-amber-200 cursor-pointer"
                    style={{ background: SEARCHER_GRADIENT_SOFT }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: SEARCHER_GRADIENT }}
                      >
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <p className="font-medium text-gray-900">Affinez vos critères</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Ajoutez vos préférences de style de vie pour de meilleurs matchs
                    </p>
                  </motion.div>

                  {/* Suggestion Card 2 */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => router.push('/searcher/groups/create')}
                    className="p-4 rounded-xl border border-violet-200 cursor-pointer bg-gradient-to-br from-violet-50 to-purple-50"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-500">
                        <UserPlus className="w-4 h-4 text-white" />
                      </div>
                      <p className="font-medium text-gray-900">Créer un groupe</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Recherchez en colocation avec vos amis
                    </p>
                  </motion.div>

                  {/* Suggestion Card 3 */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => router.push('/searcher/alerts')}
                    className="p-4 rounded-xl border border-emerald-200 cursor-pointer bg-gradient-to-br from-emerald-50 to-teal-50"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500">
                        <Bell className="w-4 h-4 text-white" />
                      </div>
                      <p className="font-medium text-gray-900">Créer une alerte</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Soyez notifié des nouveaux biens correspondants
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `Il y a ${diffMins}min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return 'Hier';
  return `Il y a ${diffDays}j`;
}
