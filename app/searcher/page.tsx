'use client';

import { useState, useEffect, memo } from 'react';
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
  Plus,
} from 'lucide-react';

// V3 Color System - Using CSS Variables from globals.css
// Primary gradient: var(--gradient-searcher)
// All Searcher colors: var(--searcher-50) through var(--searcher-900)
// Semantic colors use Tailwind's built-in scales

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
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } }
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

const SearcherHub = memo(function SearcherHub() {
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

  // Get locale code for date formatting
  const localeMap: { [key: string]: string } = {
    fr: 'fr-FR',
    en: 'en-US',
    nl: 'nl-NL',
    de: 'de-DE',
  };
  const locale = localeMap[language] || 'fr-FR';

  // Get current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  // Capitalize first letter
  const displayDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

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
        matches: 0,
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

  // KPI Cards Configuration - V3 Fun Style
  const kpiCards = [
    {
      title: 'Favoris',
      value: stats.favorites,
      subtitle: 'Biens sauvegardés',
      icon: Bookmark,
      iconGradient: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
      iconColor: '#8B5CF6',
      bgGradient: 'white',
      shadowColor: 'rgba(139, 92, 246, 0.12)',
      href: '/searcher/favorites',
    },
    {
      title: 'Candidatures',
      value: stats.applications,
      subtitle: 'En cours',
      icon: FileText,
      iconGradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
      iconColor: '#3B82F6',
      bgGradient: 'white',
      shadowColor: 'rgba(59, 130, 246, 0.12)',
      href: '/searcher/applications',
    },
    {
      title: 'Visites',
      value: stats.visits,
      subtitle: 'Planifiées',
      icon: Calendar,
      iconGradient: 'linear-gradient(135deg, #F0F7F4 0%, #E8F5EE 100%)',
      iconColor: '#7CB89B',
      bgGradient: 'white',
      shadowColor: 'rgba(124, 184, 155, 0.12)',
      href: '/searcher/visits',
    },
    {
      title: 'Messages',
      value: stats.unreadMessages,
      subtitle: 'Non lus',
      icon: MessageCircle,
      iconGradient: 'var(--gradient-searcher-subtle)',
      iconColor: 'var(--searcher-500)',
      bgGradient: 'white',
      shadowColor: 'var(--searcher-shadow)',
      href: '/messages',
      badge: stats.unreadMessages > 0,
    },
  ];

  // Quick Actions - Pertinentes pour un Searcher
  const quickActions = [
    { label: 'Nouvelle alerte', icon: Bell, href: '/searcher/alerts', primary: true },
    { label: 'Matching', icon: Heart, href: '/searcher/matching' },
    { label: 'Carte', icon: Map, href: '/searcher/map' },
    { label: 'Créer un groupe', icon: Users, href: '/searcher/groups/create' },
  ];

  // Determine next step based on user progress
  const getNextStep = () => {
    if (stats.profileCompletion < 70) {
      return {
        icon: Star,
        label: 'Compléter votre profil',
        description: 'Un profil complet augmente vos chances de matching',
        href: '/profile/searcher',
      };
    }
    if (stats.favorites === 0) {
      return {
        icon: Compass,
        label: 'Explorer les biens',
        description: 'Découvrez les colocations disponibles',
        href: '/searcher/explore',
      };
    }
    if (stats.applications === 0 && stats.favorites > 0) {
      return {
        icon: Send,
        label: 'Envoyer une candidature',
        description: `Vous avez ${stats.favorites} favori${stats.favorites > 1 ? 's' : ''}, postulez !`,
        href: '/searcher/favorites',
      };
    }
    if (stats.groups === 0) {
      return {
        icon: Users,
        label: 'Créer ou rejoindre un groupe',
        description: 'Cherchez à plusieurs pour plus de chances',
        href: '/searcher/groups',
      };
    }
    return {
      icon: Sparkles,
      label: 'Continuer votre recherche',
      description: 'Explorez de nouveaux biens',
      href: '/searcher/explore',
    };
  };

  const nextStep = getNextStep();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium mt-4">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Glassmorphism background - V3 Searcher Amber */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-searcher-500/8 via-searcher-400/5 to-searcher-300/3" />

        {/* Animated gradient blobs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-searcher-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-searcher-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-searcher-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />

        {/* Glass effect overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/60" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        {/* Hero Header - Split Layout like Resident */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left: Property Card (or Search CTA for Searcher) */}
          <div
            className="relative overflow-hidden superellipse-3xl p-6"
            style={{ background: 'var(--gradient-searcher)' }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10">
              <motion.div
                whileHover={{ rotate: 5 }}
                className="w-12 h-12 superellipse-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4"
              >
                <Search className="w-6 h-6 text-white" />
              </motion.div>

              <h2 className="text-xl font-bold text-white mb-1">
                Trouvez votre colocation
              </h2>
              <p className="text-white/80 text-sm mb-4">
                Explorer les biens disponibles
              </p>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm superellipse-xl px-3 py-2">
                  <MapPin className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Belgique</span>
                </div>

                {/* Profile completion circle */}
                {stats.profileCompletion < 100 && (
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      <circle
                        cx="24" cy="24" r="20" fill="none" stroke="white" strokeWidth="3"
                        strokeDasharray={`${(stats.profileCompletion / 100) * 125.6} 125.6`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                      {stats.profileCompletion}%
                    </span>
                  </div>
                )}
              </div>

              <Link href="/searcher/explore">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 w-full bg-white text-searcher-600 font-semibold px-4 py-3 superellipse-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <Compass className="w-5 h-5" />
                  <span>Explorer</span>
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Right: Welcome + Quick Actions */}
          <div className="lg:col-span-2 space-y-4">
            {/* Welcome Section */}
            <div className="bg-white superellipse-2xl p-5" style={{ boxShadow: '0 8px 24px var(--searcher-shadow)' }}>
              {/* Decorative blob */}
              <div
                className="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-30 pointer-events-none"
                style={{ background: 'var(--gradient-searcher)' }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{displayDate}</span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {greeting}, {userName || 'Chercheur'} !
                </h1>
                <p className="text-gray-500">
                  Voici un aperçu de votre recherche
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 px-4 py-2.5 superellipse-xl font-medium text-sm transition-all ${
                      action.primary
                        ? 'text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-searcher-200'
                    }`}
                    style={action.primary ? {
                      background: 'var(--gradient-searcher)',
                      boxShadow: '0 4px 14px var(--searcher-shadow)'
                    } : undefined}
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </motion.button>
                </Link>
              ))}
            </div>

            {/* Next Step Banner - Dynamic based on user progress */}
            <Link href={nextStep.href}>
              <motion.div
                whileHover={{ scale: 1.01, x: 4 }}
                className="bg-white superellipse-2xl p-4 flex items-center justify-between cursor-pointer"
                style={{ boxShadow: '0 4px 16px var(--searcher-shadow)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 superellipse-xl flex items-center justify-center"
                    style={{ background: 'var(--gradient-searcher)' }}
                  >
                    <nextStep.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Prochaine étape:</span>
                    <p className="font-semibold text-gray-900">{nextStep.label}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* KPI Cards Grid - V3 Style */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6"
        >
          {kpiCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <Link key={card.title} href={card.href}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative overflow-hidden superellipse-2xl p-4 cursor-pointer bg-white"
                  style={{ boxShadow: `0 8px 24px ${card.shadowColor}` }}
                >
                  {/* Decorative circle */}
                  <div
                    className="absolute -right-6 -top-6 w-20 h-20 rounded-full opacity-40"
                    style={{ background: card.iconGradient }}
                  />

                  <div className="relative z-10">
                    {/* Icon with badge */}
                    <div className="flex items-start justify-between mb-3">
                      <motion.div
                        whileHover={{ rotate: 5 }}
                        className="w-10 h-10 superellipse-xl flex items-center justify-center"
                        style={{ background: card.iconGradient }}
                      >
                        <Icon className="w-5 h-5" style={{ color: card.iconColor }} />
                      </motion.div>

                      {card.badge && (
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">{card.value}</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xs font-medium text-gray-500 mb-0.5">
                      {card.title}
                    </h3>

                    {/* Value */}
                    <p className="text-xl font-black text-gray-900 mb-1">
                      {card.value}
                    </p>

                    {/* Subtitle */}
                    <p className="text-xs text-gray-500">{card.subtitle}</p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Navigation Tiles - Compact */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-white superellipse-2xl p-5 border-l-4 border-searcher-400"
            style={{ boxShadow: '0 8px 24px var(--searcher-shadow)' }}
          >
            <div
              className="absolute -right-10 -top-10 w-28 h-28 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'var(--gradient-searcher)' }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="w-8 h-8 superellipse-lg flex items-center justify-center"
                    style={{ background: 'var(--gradient-searcher)' }}
                  >
                    <Compass className="w-4 h-4 text-white" />
                  </motion.div>
                  Accès rapide
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Compass, label: 'Explorer', href: '/searcher/explore', bgColor: 'var(--searcher-100)', iconColor: 'var(--searcher-500)' },
                  { icon: Heart, label: 'Matching', href: '/searcher/matching', bgColor: '#FCE7F3', iconColor: '#EC4899' },
                  { icon: Map, label: 'Carte', href: '/searcher/map', bgColor: '#DBEAFE', iconColor: '#3B82F6' },
                  { icon: Users, label: 'Groupes', href: '/searcher/groups', bgColor: '#EDE9FE', iconColor: '#8B5CF6' },
                  { icon: Bell, label: 'Alertes', href: '/searcher/alerts', bgColor: '#D1FAE5', iconColor: '#10B981' },
                  { icon: Star, label: 'Profil', href: '/profile/searcher', bgColor: '#F3F4F6', iconColor: '#6B7280' },
                ].map((item, index) => (
                  <Link key={index} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.02, x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 p-3 superellipse-xl bg-gray-50 hover:bg-searcher-50/50 transition-all cursor-pointer"
                    >
                      <div
                        className="w-9 h-9 superellipse-lg flex items-center justify-center"
                        style={{ backgroundColor: item.bgColor }}
                      >
                        <item.icon className="w-4 h-4" style={{ color: item.iconColor }} />
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{item.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-white superellipse-2xl p-5"
            style={{ boxShadow: '0 8px 24px var(--searcher-shadow)' }}
          >
            <div
              className="absolute -left-10 -bottom-10 w-28 h-28 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'var(--gradient-searcher)' }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="w-8 h-8 superellipse-lg flex items-center justify-center"
                    style={{ background: 'var(--gradient-searcher)' }}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                  Recommandés pour vous
                </h3>
                <Link href="/searcher/explore">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full font-medium text-xs h-8 px-3 text-searcher-500"
                  >
                    Tout voir
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-2">
                {recommendations.length > 0 ? (
                  recommendations.slice(0, 3).map((property, index) => (
                    <Link key={property.id} href={`/properties/${property.id}`}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.06 }}
                        whileHover={{ x: 3, backgroundColor: 'rgba(245, 158, 11, 0.04)' }}
                        className="flex items-center gap-3 p-3 superellipse-xl bg-gray-50 transition-all cursor-pointer"
                      >
                        <div className="w-12 h-12 superellipse-xl bg-gray-200 overflow-hidden flex-shrink-0">
                          {property.main_image ? (
                            <Image
                              src={property.main_image}
                              alt={property.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Home className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{property.title}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {property.city}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-searcher-600 text-sm">€{property.monthly_rent}</p>
                          {property.match_score && (
                            <Badge
                              className="text-xs border-none mt-1 bg-searcher-100 text-searcher-600"
                            >
                              {property.match_score}%
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div
                      className="w-16 h-16 superellipse-2xl flex items-center justify-center mx-auto mb-3"
                      style={{ background: 'var(--gradient-searcher-subtle)' }}
                    >
                      <Search className="w-7 h-7 text-searcher-500" />
                    </div>
                    <p className="font-medium text-gray-900 mb-1">Aucun bien pour le moment</p>
                    <p className="text-sm text-gray-500">Explorez les biens disponibles</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Actions */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3">
          <Link href="/searcher/alerts">
            <Button variant="outline" className="superellipse-xl border-searcher-200 text-searcher-700 hover:bg-searcher-50">
              <Bell className="w-4 h-4 mr-2" />
              Créer une alerte
            </Button>
          </Link>
          <Link href="/searcher/groups/create">
            <Button variant="outline" className="superellipse-xl border-violet-200 text-violet-700 hover:bg-violet-50">
              <UserPlus className="w-4 h-4 mr-2" />
              Créer un groupe
            </Button>
          </Link>
          <Link href="/profile/searcher">
            <Button variant="outline" className="superellipse-xl border-gray-200 text-gray-700 hover:bg-gray-50">
              <Star className="w-4 h-4 mr-2" />
              Améliorer mon profil
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
});

export default SearcherHub;
