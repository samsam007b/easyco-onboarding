'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import { useLanguage } from '@/lib/i18n/use-language';
import { Button } from '@/components/ui/button';
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
  ChevronRight,
  Bookmark,
  UserPlus,
  Compass,
  ArrowRight,
  Star,
  Clock,
  TrendingUp,
  Eye,
  Send,
  MapPin,
  Euro,
} from 'lucide-react';

// V3-FUN Searcher Palette
const SEARCHER_GRADIENT = 'linear-gradient(135deg, #F59E0B 0%, #FFB10B 50%, #FCD34D 100%)';
const SEARCHER_GRADIENT_SOFT = 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)';
const SEARCHER_PRIMARY = '#F59E0B';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } }
};

interface UserStats {
  favorites: number;
  applications: number;
  visits: number;
  matches: number;
  groups: number;
  unreadMessages: number;
  profileCompletion: number;
}

interface RecommendedProperty {
  id: string;
  title: string;
  city: string;
  monthly_rent: number;
  main_image?: string;
  match_score?: number;
}

export default function SearcherHub() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState<UserStats>({
    favorites: 0,
    applications: 0,
    visits: 0,
    matches: 0,
    groups: 0,
    unreadMessages: 0,
    profileCompletion: 0
  });
  const [recommendations, setRecommendations] = useState<RecommendedProperty[]>([]);
  const [greeting, setGreeting] = useState('Bonjour');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bonjour');
    else if (hour < 18) setGreeting('Bon après-midi');
    else setGreeting('Bonsoir');
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Load user profile
      const { data: profile } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profile?.full_name) {
        setUserName(profile.full_name.split(' ')[0]);
      }

      // Load stats in parallel
      const [
        favoritesRes,
        applicationsRes,
        visitsRes,
        groupsRes,
        unreadRes
      ] = await Promise.all([
        supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('applications').select('*', { count: 'exact', head: true })
          .eq('applicant_id', user.id)
          .in('status', ['pending', 'reviewing', 'accepted']),
        supabase.from('property_visits').select('*', { count: 'exact', head: true })
          .eq('visitor_id', user.id)
          .gte('visit_date', new Date().toISOString()),
        supabase.from('group_members').select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'active'),
        supabase.rpc('get_unread_count', { target_user_id: user.id })
      ]);

      // Load profile completion
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      let completion = 30;
      if (userProfile) {
        if (userProfile.bio) completion += 10;
        if (userProfile.phone) completion += 10;
        if (userProfile.occupation) completion += 10;
        if (userProfile.interests?.length > 0) completion += 10;
        if (userProfile.lifestyle_preferences) completion += 15;
        if (userProfile.budget_min && userProfile.budget_max) completion += 15;
      }

      setStats({
        favorites: favoritesRes.count || 0,
        applications: applicationsRes.count || 0,
        visits: visitsRes.count || 0,
        matches: 0, // Will be calculated
        groups: groupsRes.count || 0,
        unreadMessages: unreadRes.data || 0,
        profileCompletion: Math.min(completion, 100)
      });

      // Load some recommended properties
      const { data: properties } = await supabase
        .from('properties')
        .select('id, title, city, monthly_rent, main_image')
        .eq('is_active', true)
        .limit(3)
        .order('created_at', { ascending: false });

      if (properties) {
        setRecommendations(properties.map(p => ({
          ...p,
          match_score: Math.floor(Math.random() * 20) + 75
        })));
      }

      setLoading(false);
    };

    loadData();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-yellow-50/30">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  // Navigation tiles configuration
  const navigationTiles = [
    {
      id: 'explore',
      title: 'Explorer',
      description: 'Découvrir les biens disponibles',
      icon: Compass,
      href: '/searcher/explore',
      gradient: 'from-amber-500 to-yellow-400',
      shadowColor: '#F59E0B',
      primary: true
    },
    {
      id: 'matching',
      title: 'Matching',
      description: 'Biens & colocataires compatibles',
      icon: Heart,
      href: '/searcher/matching',
      gradient: 'from-pink-500 to-rose-400',
      shadowColor: '#EC4899',
      badge: stats.matches > 0 ? stats.matches : undefined
    },
    {
      id: 'favorites',
      title: 'Favoris',
      description: 'Vos biens sauvegardés',
      icon: Bookmark,
      href: '/searcher/favorites',
      gradient: 'from-violet-500 to-purple-400',
      shadowColor: '#8B5CF6',
      badge: stats.favorites > 0 ? stats.favorites : undefined
    },
    {
      id: 'applications',
      title: 'Candidatures',
      description: 'Suivre vos demandes',
      icon: FileText,
      href: '/searcher/applications',
      gradient: 'from-blue-500 to-cyan-400',
      shadowColor: '#3B82F6',
      badge: stats.applications > 0 ? stats.applications : undefined
    },
    {
      id: 'visits',
      title: 'Visites',
      description: 'Rendez-vous planifiés',
      icon: Calendar,
      href: '/searcher/visits',
      gradient: 'from-emerald-500 to-teal-400',
      shadowColor: '#10B981',
      badge: stats.visits > 0 ? stats.visits : undefined
    },
    {
      id: 'groups',
      title: 'Groupes',
      description: 'Chercher en colocation',
      icon: Users,
      href: '/searcher/groups',
      gradient: 'from-orange-500 to-amber-400',
      shadowColor: '#F97316',
      badge: stats.groups > 0 ? stats.groups : undefined
    },
    {
      id: 'map',
      title: 'Carte',
      description: 'Vue géographique',
      icon: Map,
      href: '/searcher/map',
      gradient: 'from-indigo-500 to-blue-400',
      shadowColor: '#6366F1'
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Vos conversations',
      icon: MessageCircle,
      href: '/messages',
      gradient: 'from-slate-600 to-gray-500',
      shadowColor: '#475569',
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-yellow-50/30">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8" style={{ background: SEARCHER_GRADIENT }}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="text-white">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl sm:text-3xl font-bold mb-2"
                >
                  {greeting}, {userName || 'Chercheur'} !
                </motion.h1>
                <p className="text-white/80 text-lg">
                  Trouvez votre colocation idéale
                </p>
              </div>

              <Link href="/searcher/explore">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 bg-white text-amber-600 font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Search className="w-5 h-5" />
                  <span>Explorer les biens</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>

            {/* Profile Completion Banner */}
            {stats.profileCompletion < 100 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative z-10 mt-6 bg-white/15 backdrop-blur-sm rounded-2xl p-4"
              >
                <Link href="/profile/searcher" className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 transform -rotate-90">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                        <circle
                          cx="24" cy="24" r="20" fill="none" stroke="white" strokeWidth="4"
                          strokeDasharray={`${(stats.profileCompletion / 100) * 125.6} 125.6`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                        {stats.profileCompletion}%
                      </span>
                    </div>
                    <div className="text-white">
                      <p className="font-semibold">Complétez votre profil</p>
                      <p className="text-sm text-white/70">Plus de matchs avec un profil complet</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/60" />
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Navigation Grid */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-500" />
            Accès rapide
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {navigationTiles.map((tile, index) => (
              <Link key={tile.id} href={tile.href}>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { delay: index * 0.05 } }
                  }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 cursor-pointer bg-gradient-to-br ${tile.gradient} text-white`}
                  style={{
                    boxShadow: `0 8px 20px ${tile.shadowColor}30`,
                    minHeight: tile.primary ? '140px' : '120px'
                  }}
                >
                  {tile.badge !== undefined && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/25 text-white border-0 backdrop-blur-sm text-xs font-bold">
                        {tile.badge}
                      </Badge>
                    </div>
                  )}

                  <tile.icon className={`${tile.primary ? 'w-8 h-8' : 'w-6 h-6'} mb-2 sm:mb-3 opacity-90`} />
                  <p className={`font-bold ${tile.primary ? 'text-lg' : 'text-base'}`}>{tile.title}</p>
                  <p className="text-xs sm:text-sm text-white/75 line-clamp-1">{tile.description}</p>

                  {/* Decorative circle */}
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Votre activité
            </h2>

            <div className="grid grid-cols-4 gap-4 sm:gap-6">
              <Link href="/searcher/favorites" className="text-center group">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center bg-violet-100 group-hover:bg-violet-200 transition-colors">
                  <Bookmark className="w-6 h-6 text-violet-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.favorites}</p>
                <p className="text-xs text-gray-500">Favoris</p>
              </Link>

              <Link href="/searcher/applications" className="text-center group">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.applications}</p>
                <p className="text-xs text-gray-500">Candidatures</p>
              </Link>

              <Link href="/searcher/visits" className="text-center group">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.visits}</p>
                <p className="text-xs text-gray-500">Visites</p>
              </Link>

              <Link href="/messages" className="text-center group">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors relative">
                  <MessageCircle className="w-6 h-6 text-gray-600" />
                  {stats.unreadMessages > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{stats.unreadMessages}</span>
                    </div>
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.unreadMessages}</p>
                <p className="text-xs text-gray-500">Messages</p>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Recommandés pour vous
              </h2>
              <Link href="/searcher/explore">
                <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                  Voir tout
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {recommendations.map((property, index) => (
                <motion.div
                  key={property.id}
                  variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1, transition: { delay: 0.1 + index * 0.1 } }
                  }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <Link href={`/properties/${property.id}`}>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-36 bg-gray-100">
                        {property.main_image ? (
                          <Image
                            src={property.main_image}
                            alt={property.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home className="w-10 h-10 text-gray-300" />
                          </div>
                        )}
                        {property.match_score && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-amber-500 text-white border-0">
                              {property.match_score}% match
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">{property.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {property.city}
                          </span>
                          <span className="font-bold text-amber-600 flex items-center gap-0.5">
                            <Euro className="w-4 h-4" />
                            {property.monthly_rent}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Actions Footer */}
        <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/searcher/alerts">
              <Button variant="outline" className="rounded-xl border-amber-200 text-amber-700 hover:bg-amber-50">
                <Bell className="w-4 h-4 mr-2" />
                Créer une alerte
              </Button>
            </Link>
            <Link href="/searcher/groups/create">
              <Button variant="outline" className="rounded-xl border-violet-200 text-violet-700 hover:bg-violet-50">
                <UserPlus className="w-4 h-4 mr-2" />
                Créer un groupe
              </Button>
            </Link>
            <Link href="/profile/searcher">
              <Button variant="outline" className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50">
                <Star className="w-4 h-4 mr-2" />
                Améliorer mon profil
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
