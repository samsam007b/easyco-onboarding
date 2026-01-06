'use client';

import { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import { useLanguage } from '@/lib/i18n/use-language';
import { Switch } from '@/components/ui/switch';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Bell,
  MapPin,
  Euro,
  Home,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  BellRing,
  BellOff,
  Search,
  Heart,
  Bookmark,
  MessageCircle,
  Zap,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';

// V3 Color System - Using CSS Variables from globals.css
// All colors now reference var(--searcher-*) and var(--gradient-searcher-*)

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

interface SearchAlert {
  id: string;
  name: string;
  city: string;
  budget_min?: number;
  budget_max?: number;
  rooms_min?: number;
  property_types: string[];
  is_active: boolean;
  created_at: string;
  new_matches: number;
  last_match?: string;
}

const SearcherAlertsPage = memo(function SearcherAlertsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<SearchAlert[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [favorites, setFavorites] = useState(0);

  useEffect(() => {
    const loadAlerts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const [messagesRes, favoritesRes] = await Promise.all([
        supabase.rpc('get_unread_count', { target_user_id: user.id }),
        supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);

      setUnreadMessages(messagesRes.data || 0);
      setFavorites(favoritesRes.count || 0);

      // Mock alerts data
      const mockAlerts: SearchAlert[] = [
        {
          id: '1',
          name: 'Colocation Bruxelles Centre',
          city: 'Bruxelles',
          budget_min: 400,
          budget_max: 600,
          rooms_min: 1,
          property_types: ['shared'],
          is_active: true,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          new_matches: 3,
          last_match: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          name: 'Studio Ixelles',
          city: 'Ixelles',
          budget_max: 800,
          property_types: ['studio', 'apartment'],
          is_active: true,
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          new_matches: 0,
          last_match: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          name: 'Appartement familial',
          city: 'Woluwe-Saint-Lambert',
          budget_min: 800,
          budget_max: 1200,
          rooms_min: 2,
          property_types: ['apartment'],
          is_active: false,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          new_matches: 0
        }
      ];

      setAlerts(mockAlerts);
      setLoading(false);
    };
    loadAlerts();
  }, [supabase, router]);

  const handleToggleAlert = async (alertId: string, isActive: boolean) => {
    setAlerts(prev => prev.map(a =>
      a.id === alertId ? { ...a, is_active: isActive } : a
    ));
    toast.success(isActive ? 'Alerte activée' : 'Alerte désactivée');
  };

  const handleDeleteAlert = async (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    toast.success('Alerte supprimée');
  };

  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Jamais';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Il y a moins d\'une heure';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    return `Il y a ${diffDays} jours`;
  };

  const activeCount = alerts.filter(a => a.is_active).length;
  const totalNewMatches = alerts.reduce((sum, a) => sum + a.new_matches, 0);

  // Stats cards
  const statsCards = [
    {
      icon: Bell,
      value: alerts.length,
      label: 'Alertes',
      color: '#ffa000',
      bgColor: '#FFF8E6',
    },
    {
      icon: Zap,
      value: activeCount,
      label: 'Actives',
      color: '#10B981',
      bgColor: '#D1FAE5',
    },
    {
      icon: Sparkles,
      value: totalNewMatches,
      label: 'Nouveaux',
      color: '#EC4899',
      bgColor: '#FCE7F3',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-searcher-500/8 via-searcher-400/5 to-searcher-300/3" />
          <div className="absolute top-0 -left-4 w-96 h-96 bg-searcher-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-orange-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-yellow-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />
          <div className="absolute inset-0 backdrop-blur-3xl bg-white/60" />
        </div>
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium mt-4">Chargement de vos alertes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 md:pb-0">
      {/* Glassmorphism background - Searcher Medium for Alerts */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-searcher-500/8 via-searcher-400/5 to-searcher-300/3" />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-searcher-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-orange-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-yellow-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/60" />
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50">
        <div className="bg-white/80 backdrop-blur-xl border-b border-searcher-100/50">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Left: Back + Title */}
              <div className="flex items-center gap-3">
                <Link href="/searcher">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 superellipse-xl bg-white flex items-center justify-center shadow-sm border border-gray-100"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </Link>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-md"
                    style={{ background: 'var(--gradient-searcher)' }}
                  >
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-gray-900">Mes Alertes</h1>
                    <p className="text-xs text-gray-500">{activeCount} alerte{activeCount !== 1 ? 's' : ''} active{activeCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              {/* Right: Create Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/searcher/alerts/new')}
                className="flex items-center gap-2 px-4 py-2 superellipse-xl text-white text-sm font-medium shadow-md"
                style={{ background: 'var(--gradient-searcher)' }}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nouvelle alerte</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-md border-b border-searcher-100/30"
        >
          <div className="max-w-4xl mx-auto px-4 py-2">
            <div className="flex items-center gap-3">
              {statsCards.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 superellipse-xl bg-white shadow-sm border border-gray-100"
                >
                  <div
                    className="w-7 h-7 superellipse-lg flex items-center justify-center"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-gray-900 text-sm">{stat.value}</span>
                    <span className="text-[10px] text-gray-500 hidden sm:inline">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden superellipse-3xl bg-white shadow-lg"
            style={{ boxShadow: `0 8px 32px var(--searcher-shadow)` }}
          >
            {/* Decorative circles */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20"
              style={{ background: 'var(--gradient-searcher)' }}
            />

            <div className="relative flex flex-col items-center justify-center py-16 px-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 superellipse-2xl flex items-center justify-center mb-6 shadow-lg"
                style={{ background: 'var(--gradient-searcher)' }}
              >
                <BellRing className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Aucune alerte configurée
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                Créez des alertes pour être notifié dès qu'un bien correspond à vos critères
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/searcher/alerts/new')}
                className="px-6 py-3 superellipse-xl text-white font-medium shadow-md flex items-center gap-2"
                style={{ background: 'var(--gradient-searcher)' }}
              >
                <Sparkles className="w-4 h-4" />
                Créer ma première alerte
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                >
                  <div
                    className={`bg-white superellipse-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all ${!alert.is_active ? 'opacity-60' : ''}`}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        {/* Left: Alert Info */}
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className="w-11 h-11 superellipse-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: alert.is_active ? 'var(--gradient-searcher-subtle)' : '#F3F4F6' }}
                          >
                            {alert.is_active ? (
                              <BellRing className="w-5 h-5" style={{ color: 'var(--searcher-500)' }} />
                            ) : (
                              <BellOff className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-gray-900">{alert.name}</h3>
                              {alert.new_matches > 0 && (
                                <span
                                  className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                                  style={{ background: 'var(--gradient-searcher)' }}
                                >
                                  {alert.new_matches} nouveau{alert.new_matches > 1 ? 'x' : ''}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-0.5">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{alert.city}</span>
                            </div>

                            {/* Criteria Pills */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {(alert.budget_min || alert.budget_max) && (
                                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium flex items-center gap-1">
                                  <Euro className="w-3 h-3" />
                                  {alert.budget_min && `${alert.budget_min}€`}
                                  {alert.budget_min && alert.budget_max && ' - '}
                                  {alert.budget_max && `${alert.budget_max}€`}
                                </span>
                              )}
                              {alert.rooms_min && (
                                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium flex items-center gap-1">
                                  <Home className="w-3 h-3" />
                                  {alert.rooms_min}+ ch.
                                </span>
                              )}
                              {alert.property_types.slice(0, 2).map((type, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium">
                                  {type === 'shared' ? 'Coloc' : type === 'studio' ? 'Studio' : 'Appart'}
                                </span>
                              ))}
                            </div>

                            {/* Last Match */}
                            <div className="flex items-center gap-1 text-gray-400 text-xs mt-2">
                              <Clock className="w-3 h-3" />
                              <span>Dernier match: {formatTimeAgo(alert.last_match)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-col items-end gap-2">
                          <Switch
                            checked={alert.is_active}
                            onCheckedChange={(checked) => handleToggleAlert(alert.id, checked)}
                          />
                          <div className="flex gap-1.5">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => router.push(`/searcher/alerts/${alert.id}/edit`)}
                              className="w-8 h-8 superellipse-lg bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteAlert(alert.id)}
                              className="w-8 h-8 superellipse-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-white/90 backdrop-blur-xl border-t border-searcher-100/50 px-4 py-3 safe-area-pb">
          <div className="flex items-center justify-around">
            <Link href="/searcher">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1"
              >
                <Home className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] text-gray-500">Accueil</span>
              </motion.div>
            </Link>
            <Link href="/searcher/explore">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1"
              >
                <Search className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] text-gray-500">Explorer</span>
              </motion.div>
            </Link>
            <Link href="/searcher/matching">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1"
              >
                <Heart className="w-5 h-5 text-gray-400" />
                <span className="text-[10px] text-gray-500">Matching</span>
              </motion.div>
            </Link>
            <Link href="/searcher/favorites">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 relative"
              >
                <Bookmark className="w-5 h-5 text-gray-400" />
                {favorites > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#EC4899' }}
                  >
                    {favorites}
                  </span>
                )}
                <span className="text-[10px] text-gray-500">Favoris</span>
              </motion.div>
            </Link>
            <Link href="/messages">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 relative"
              >
                <MessageCircle className="w-5 h-5 text-gray-400" />
                {unreadMessages > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                    style={{ background: 'var(--gradient-searcher)' }}
                  >
                    {unreadMessages}
                  </span>
                )}
                <span className="text-[10px] text-gray-500">Messages</span>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SearcherAlertsPage;
