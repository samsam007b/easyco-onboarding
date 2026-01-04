'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  MessageCircle,
  FileText,
  Calendar,
  Sparkles,
  Users,
  Bell,
  ChevronRight,
  MapPin,
  Euro,
  Home,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  Plus,
  ArrowRight,
  Zap,
  Target,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearcherKPICard, SearcherKPIGrid } from './SearcherKPICard';
import { SearcherNavigationCard, SearcherNavigationGrid } from './SearcherNavigationCard';
import { SearcherAlertBanner, SearcherAlertStack } from './SearcherAlertBanner';
import {
  searcherGradientVibrant,
  searcherGradientLight,
  searcherAnimations,
  getMatchScoreCategory,
  matchScoreColors
} from '@/lib/constants/searcher-theme';
import { createClient } from '@/lib/auth/supabase-client';

interface SearcherCommandCenterProps {
  userId: string;
  userData: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

interface UrgentAction {
  id: string;
  type: 'message' | 'visit' | 'application' | 'profile';
  title: string;
  description: string;
  href: string;
  urgency: 'high' | 'medium' | 'low';
  timeAgo?: string;
}

interface TopMatch {
  id: string;
  title: string;
  location: string;
  price: number;
  matchScore: number;
  image_url?: string;
  bedrooms: number;
  available_from?: string;
  isFavorite: boolean;
}

interface SavedSearch {
  id: string;
  name: string;
  criteria: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
  };
  newResults: number;
}

export function SearcherCommandCenter({ userId, userData }: SearcherCommandCenterProps) {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    favoritesCount: 0,
    matchesCount: 0,
    pendingApplications: 0,
    upcomingVisits: 0,
    unreadMessages: 0,
    profileCompletion: 0
  });
  const [urgentActions, setUrgentActions] = useState<UrgentAction[]>([]);
  const [topMatches, setTopMatches] = useState<TopMatch[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showAllActions, setShowAllActions] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load favorites count
        const { count: favCount } = await supabase
          .from('favorites')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        // Load pending applications
        const { count: appCount } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'pending');

        // Load upcoming visits
        const { count: visitCount } = await supabase
          .from('visits')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('visit_date', new Date().toISOString());

        // Load profile completion
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        // Calculate profile completion (simplified)
        let profileCompletion = 30; // Base
        if (profile?.bio) profileCompletion += 15;
        if (profile?.avatar_url) profileCompletion += 15;
        if (profile?.phone_verified) profileCompletion += 20;
        if (profile?.preferred_cities?.length) profileCompletion += 10;
        if (profile?.budget_max) profileCompletion += 10;

        // Build urgent actions
        const actions: UrgentAction[] = [];

        if (profileCompletion < 100) {
          actions.push({
            id: 'complete-profile',
            type: 'profile',
            title: 'Complétez votre profil',
            description: `Votre profil est complet à ${profileCompletion}%`,
            href: '/profile',
            urgency: profileCompletion < 50 ? 'high' : 'medium'
          });
        }

        // Mock data for demonstration - in production, fetch real data
        setStats({
          favoritesCount: favCount || 0,
          matchesCount: 12, // Mock
          pendingApplications: appCount || 0,
          upcomingVisits: visitCount || 0,
          unreadMessages: 3, // Mock
          profileCompletion
        });

        setUrgentActions(actions);

        // Mock top matches
        setTopMatches([
          {
            id: '1',
            title: 'Appartement lumineux centre-ville',
            location: 'Bruxelles, Ixelles',
            price: 850,
            matchScore: 92,
            bedrooms: 2,
            available_from: '2024-02-01',
            isFavorite: true,
            image_url: '/images/property-placeholder.jpg'
          },
          {
            id: '2',
            title: 'Coliving moderne avec terrasse',
            location: 'Bruxelles, Saint-Gilles',
            price: 650,
            matchScore: 87,
            bedrooms: 1,
            available_from: '2024-01-15',
            isFavorite: false,
            image_url: '/images/property-placeholder.jpg'
          },
          {
            id: '3',
            title: 'Chambre dans maison partagée',
            location: 'Bruxelles, Schaerbeek',
            price: 550,
            matchScore: 78,
            bedrooms: 1,
            available_from: '2024-02-01',
            isFavorite: false,
            image_url: '/images/property-placeholder.jpg'
          },
          {
            id: '4',
            title: 'Studio rénové proche métro',
            location: 'Bruxelles, Etterbeek',
            price: 720,
            matchScore: 73,
            bedrooms: 1,
            available_from: '2024-01-20',
            isFavorite: true,
            image_url: '/images/property-placeholder.jpg'
          }
        ]);

        // Mock saved searches
        setSavedSearches([
          {
            id: '1',
            name: 'Coliving Bruxelles < 700€',
            criteria: { city: 'Bruxelles', maxPrice: 700 },
            newResults: 5
          },
          {
            id: '2',
            name: 'Ixelles 2 chambres',
            criteria: { city: 'Ixelles' },
            newResults: 2
          }
        ]);

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [userId, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const visibleActions = showAllActions ? urgentActions : urgentActions.slice(0, 3);

  return (
    <div
      className="min-h-screen pt-20 pb-8"
      style={{ background: searcherGradientLight }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Section */}
        <motion.div
          {...searcherAnimations.fadeInUp}
          className="relative overflow-hidden bg-white/80 backdrop-blur-sm superellipse-3xl shadow-lg border border-gray-200 p-6 sm:p-8"
        >
          {/* Decorative circles */}
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
            style={{ background: searcherGradientVibrant }}
          />
          <div
            className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-5"
            style={{ background: searcherGradientVibrant }}
          />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Animated Icon */}
              <div className="relative">
                <div
                  className="absolute inset-0 superellipse-2xl blur-xl animate-pulse"
                  style={{ background: searcherGradientVibrant, opacity: 0.3 }}
                />
                <motion.div
                  whileHover={{ rotate: 3 }}
                  className="relative w-14 h-14 sm:w-16 sm:h-16 superellipse-2xl flex items-center justify-center shadow-lg"
                  style={{ background: searcherGradientVibrant }}
                >
                  <Target className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -2, 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </motion.div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Bonjour, {userData.full_name?.split(' ')[0]} !
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Votre centre de commande pour trouver le logement idéal
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/dashboard/searcher">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="superellipse-2xl text-white shadow-lg"
                    style={{
                      background: searcherGradientVibrant,
                      boxShadow: '0 4px 14px rgba(255, 160, 64, 0.3)'
                    }}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Parcourir
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SearcherKPIGrid columns={5}>
            <SearcherKPICard
              title="Top Matches"
              value={stats.matchesCount}
              icon={Sparkles}
              variant="primary"
              subtext="70%+ compatibilité"
              onClick={() => window.location.href = '/dashboard/searcher/matching'}
            />
            <SearcherKPICard
              title="Favoris"
              value={stats.favoritesCount}
              icon={Heart}
              variant="secondary"
              subtext="Annonces sauvées"
              onClick={() => window.location.href = '/dashboard/searcher/favorites'}
            />
            <SearcherKPICard
              title="Candidatures"
              value={stats.pendingApplications}
              icon={FileText}
              variant="info"
              subtext="En attente"
              badge={stats.pendingApplications > 0 ? { label: 'En cours', variant: 'warning' } : undefined}
              onClick={() => window.location.href = '/dashboard/searcher/my-applications'}
            />
            <SearcherKPICard
              title="Visites"
              value={stats.upcomingVisits}
              icon={Calendar}
              variant="success"
              subtext="À venir"
              onClick={() => window.location.href = '/dashboard/searcher/my-visits'}
            />
            <SearcherKPICard
              title="Messages"
              value={stats.unreadMessages}
              icon={MessageCircle}
              variant="danger"
              subtext="Non lus"
              badge={stats.unreadMessages > 0 ? { label: 'Nouveau', variant: 'danger' } : undefined}
              onClick={() => window.location.href = '/dashboard/searcher/messages'}
            />
          </SearcherKPIGrid>
        </motion.div>

        {/* Urgent Actions */}
        {urgentActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                Actions recommandées
              </h2>
              {urgentActions.length > 3 && (
                <button
                  onClick={() => setShowAllActions(!showAllActions)}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  {showAllActions ? 'Voir moins' : `Voir tout (${urgentActions.length})`}
                </button>
              )}
            </div>
            <SearcherAlertStack>
              {visibleActions.map((action) => (
                <SearcherAlertBanner
                  key={action.id}
                  title={action.title}
                  description={action.description}
                  severity={action.urgency === 'high' ? 'warning' : 'info'}
                  href={action.href}
                />
              ))}
            </SearcherAlertStack>
          </motion.div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Top Matches */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-500" />
                Vos Top Matches
              </h2>
              <Link
                href="/dashboard/searcher/matching"
                className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
              >
                Voir tout <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topMatches.map((match, index) => {
                const scoreCategory = getMatchScoreCategory(match.matchScore);
                const scoreStyle = matchScoreColors[scoreCategory];

                return (
                  <motion.div
                    key={match.id}
                    {...searcherAnimations.fadeInUp}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="relative overflow-hidden bg-white superellipse-2xl shadow-sm border border-gray-200 cursor-pointer group"
                    onClick={() => window.location.href = `/properties/${match.id}`}
                  >
                    {/* Match Score Badge */}
                    <div
                      className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1"
                      style={{ background: scoreStyle.gradient }}
                    >
                      <Target className="w-3 h-3" />
                      {match.matchScore}%
                    </div>

                    {/* Favorite Button */}
                    <button
                      className={cn(
                        "absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        match.isFavorite
                          ? "bg-red-500 text-white"
                          : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
                      )}
                      onClick={(e) => { e.stopPropagation(); }}
                    >
                      <Heart className={cn("w-4 h-4", match.isFavorite && "fill-current")} />
                    </button>

                    {/* Image */}
                    <div className="h-32 bg-gray-100 relative overflow-hidden">
                      {match.image_url ? (
                        <Image
                          src={match.image_url}
                          alt={match.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="w-10 h-10 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 truncate">{match.title}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {match.location}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-lg font-bold text-orange-600">
                          €{match.price}/mois
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Home className="w-3.5 h-3.5" />
                          {match.bedrooms} ch.
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column - Saved Searches & Quick Access */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Saved Searches */}
            <div className="bg-white/80 backdrop-blur-sm superellipse-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-orange-500" />
                  Alertes sauvées
                </h3>
                <Link
                  href="/dashboard/searcher/saved-searches"
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                >
                  Gérer
                </Link>
              </div>

              {savedSearches.length > 0 ? (
                <div className="space-y-3">
                  {savedSearches.map((search) => (
                    <Link
                      key={search.id}
                      href={`/dashboard/searcher?search=${search.id}`}
                      className="flex items-center justify-between p-3 superellipse-xl bg-gray-50 hover:bg-orange-50 transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm">{search.name}</p>
                        <p className="text-xs text-gray-500">
                          {search.criteria.city && search.criteria.city}
                          {search.criteria.maxPrice && ` • < €${search.criteria.maxPrice}`}
                        </p>
                      </div>
                      {search.newResults > 0 && (
                        <Badge
                          className="text-white ml-2"
                          style={{ background: searcherGradientVibrant }}
                        >
                          {search.newResults} new
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500 mb-3">Aucune alerte sauvée</p>
                  <Link href="/dashboard/searcher">
                    <Button size="sm" variant="outline" className="rounded-full">
                      <Plus className="w-4 h-4 mr-1" />
                      Créer une alerte
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Navigation */}
            <div className="bg-white/80 backdrop-blur-sm superellipse-2xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                Accès rapide
              </h3>

              <div className="space-y-2">
                <Link
                  href="/dashboard/searcher/groups"
                  className="flex items-center gap-3 p-3 superellipse-xl hover:bg-orange-50 transition-all group"
                >
                  <div
                    className="w-10 h-10 superellipse-xl flex items-center justify-center"
                    style={{ background: 'rgba(255, 160, 64, 0.1)' }}
                  >
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Groupes de recherche</p>
                    <p className="text-xs text-gray-500">Cherchez à plusieurs</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  href="/dashboard/searcher/calendar"
                  className="flex items-center gap-3 p-3 superellipse-xl hover:bg-orange-50 transition-all group"
                >
                  <div
                    className="w-10 h-10 superellipse-xl flex items-center justify-center"
                    style={{ background: 'rgba(255, 184, 92, 0.1)' }}
                  >
                    <Calendar className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Calendrier</p>
                    <p className="text-xs text-gray-500">Vos visites planifiées</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center gap-3 p-3 superellipse-xl hover:bg-orange-50 transition-all group"
                >
                  <div
                    className="w-10 h-10 superellipse-xl flex items-center justify-center"
                    style={{ background: 'rgba(255, 208, 128, 0.1)' }}
                  >
                    <CheckCircle className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Compléter mon profil</p>
                    <p className="text-xs text-gray-500">{stats.profileCompletion}% complété</p>
                  </div>
                  <div className="w-10 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${stats.profileCompletion}%`,
                        background: searcherGradientVibrant
                      }}
                    />
                  </div>
                </Link>
              </div>
            </div>

            {/* Tip of the Day */}
            <motion.div
              className="relative overflow-hidden superellipse-2xl p-5"
              style={{ background: searcherGradientVibrant }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
              <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-white/10" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="text-white/90 text-sm font-medium">Astuce du jour</span>
                </div>
                <p className="text-white font-medium">
                  Complétez votre profil à 100% pour augmenter vos chances de match de 40% !
                </p>
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-1 mt-3 text-white/90 text-sm font-medium hover:text-white transition"
                >
                  Compléter maintenant
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
