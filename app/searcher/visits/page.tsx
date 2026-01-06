'use client';

import { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import { useLanguage } from '@/lib/i18n/use-language';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Calendar,
  Clock,
  MapPin,
  Home,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Sparkles,
  Eye,
  MessageCircle,
  Phone,
  Video,
  Plus,
  Search,
  Heart,
  Bookmark,
  CalendarCheck,
  CalendarClock,
} from 'lucide-react';

// V3-FUN Visits Palette - Searcher Light Gradient (calendar/scheduling feel)
// Searcher colors for nav
// V3 Color System - Using CSS Variables from globals.css
// Semantic Colors

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

interface Visit {
  id: string;
  property_id: string;
  visit_date: string;
  visit_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  visit_type: 'in_person' | 'video';
  notes?: string;
  property: {
    id: string;
    title: string;
    city: string;
    postal_code: string;
    address?: string;
    main_image?: string;
  };
  owner?: {
    full_name: string;
    phone?: string;
  };
}

const SearcherVisitsPage = memo(function SearcherVisitsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [favorites, setFavorites] = useState(0);

  useEffect(() => {
    const loadVisits = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Load sidebar stats
      const [messagesRes, favoritesRes] = await Promise.all([
        supabase.rpc('get_unread_count', { target_user_id: user.id }),
        supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);

      setUnreadMessages(messagesRes.data || 0);
      setFavorites(favoritesRes.count || 0);

      // Mock visits data (would be fetched from property_visits table)
      const mockVisits: Visit[] = [
        {
          id: '1',
          property_id: 'p1',
          visit_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          visit_time: '14:00',
          status: 'confirmed',
          visit_type: 'in_person',
          property: {
            id: 'p1',
            title: 'Appartement T3 lumineux',
            city: 'Bruxelles',
            postal_code: '1000',
            address: '42 Rue de la Loi',
            main_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'
          },
          owner: {
            full_name: 'Jean Dupont',
            phone: '+32 475 12 34 56'
          }
        },
        {
          id: '2',
          property_id: 'p2',
          visit_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          visit_time: '10:30',
          status: 'pending',
          visit_type: 'video',
          property: {
            id: 'p2',
            title: 'Studio moderne à Ixelles',
            city: 'Ixelles',
            postal_code: '1050',
            main_image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'
          },
          owner: {
            full_name: 'Marie Martin'
          }
        },
        {
          id: '3',
          property_id: 'p3',
          visit_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          visit_time: '16:00',
          status: 'completed',
          visit_type: 'in_person',
          property: {
            id: 'p3',
            title: 'Colocation Saint-Gilles',
            city: 'Saint-Gilles',
            postal_code: '1060',
            main_image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400'
          },
          owner: {
            full_name: 'Sophie Leblanc'
          }
        }
      ];

      setVisits(mockVisits);
      setLoading(false);
    };
    loadVisits();
  }, [supabase, router]);

  const filteredVisits = visits.filter(visit => {
    const visitDate = new Date(visit.visit_date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (filter === 'upcoming') return visitDate >= now && visit.status !== 'cancelled';
    if (filter === 'past') return visitDate < now || visit.status === 'completed';
    return true;
  });

  const upcomingCount = visits.filter(v => {
    const d = new Date(v.visit_date);
    return d >= new Date() && v.status !== 'cancelled';
  }).length;

  const confirmedCount = visits.filter(v => v.status === 'confirmed').length;

  const getStatusConfig = (status: Visit['status']) => {
    const config = {
      pending: { color: '#F59E0B', bgColor: '#FEF3C7', label: 'En attente' },
      confirmed: { color: '#10B981', bgColor: '#D1FAE5', label: 'Confirmée' },
      cancelled: { color: '#EF4444', bgColor: '#FEE2E2', label: 'Annulée' },
      completed: { color: '#6B7280', bgColor: '#F3F4F6', label: 'Terminée' }
    };
    return config[status];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(date);
  };

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short'
    }).format(date);
  };

  // Stats cards
  const statsCards = [
    {
      icon: Calendar,
      value: visits.length,
      label: 'Total',
      color: 'var(--searcher-600)',
      bgColor: '#FFF4E0',
    },
    {
      icon: CalendarClock,
      value: upcomingCount,
      label: 'À venir',
      color: '#3B82F6',
      bgColor: '#DBEAFE',
    },
    {
      icon: CalendarCheck,
      value: confirmedCount,
      label: 'Confirmées',
      color: '#10B981',
      bgColor: '#D1FAE5',
    },
  ];

  // Filter tabs
  const filterTabs = [
    { id: 'upcoming', label: 'À venir' },
    { id: 'past', label: 'Passées' },
    { id: 'all', label: 'Toutes' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/8 via-amber-300/5 to-yellow-200/3" />
          <div className="absolute top-0 -left-4 w-96 h-96 bg-yellow-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-searcher-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-orange-200/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />
          <div className="absolute inset-0 backdrop-blur-3xl bg-white/60" />
        </div>
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium mt-4">Chargement de vos visites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 md:pb-0">
      {/* Glassmorphism background - Searcher Light for Visits */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/8 via-amber-300/5 to-yellow-200/3" />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-yellow-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-searcher-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-orange-200/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />
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
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-gray-900">Mes Visites</h1>
                    <p className="text-xs text-gray-500">{upcomingCount} visite{upcomingCount !== 1 ? 's' : ''} à venir</p>
                  </div>
                </div>
              </div>

              {/* Right: Plan Visit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/searcher/explore')}
                className="flex items-center gap-2 px-4 py-2 superellipse-xl text-white text-sm font-medium shadow-md"
                style={{ background: 'var(--gradient-searcher)' }}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Planifier</span>
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

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/40 backdrop-blur-sm border-b border-searcher-100/20"
        >
          <div className="max-w-4xl mx-auto px-4 py-2">
            <div className="flex items-center gap-2">
              {filterTabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilter(tab.id as typeof filter)}
                  className={`px-3 py-1.5 superellipse-lg text-xs font-medium transition-all ${
                    filter === tab.id
                      ? 'text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                  }`}
                  style={filter === tab.id ? { background: 'var(--gradient-searcher)' } : {}}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {filteredVisits.length === 0 ? (
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
                <Calendar className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {filter === 'upcoming' ? 'Aucune visite planifiée' : 'Aucune visite'}
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                {filter === 'upcoming'
                  ? 'Explorez les propriétés et planifiez vos visites'
                  : 'Aucune visite dans cette catégorie'}
              </p>
              {filter === 'upcoming' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/searcher/explore')}
                  className="px-6 py-3 superellipse-xl text-white font-medium shadow-md flex items-center gap-2"
                  style={{ background: 'var(--gradient-searcher)' }}
                >
                  <Sparkles className="w-4 h-4" />
                  Explorer les propriétés
                </motion.button>
              )}
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
              {filteredVisits.map((visit) => {
                const statusConfig = getStatusConfig(visit.status);

                return (
                  <motion.div
                    key={visit.id}
                    variants={itemVariants}
                    layout
                    exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                  >
                    <div className="bg-white superellipse-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-searcher-200 transition-all">
                      <div className="flex">
                        {/* Property Image */}
                        <div className="relative w-28 md:w-36 flex-shrink-0">
                          {visit.property.main_image ? (
                            <Image
                              src={visit.property.main_image}
                              alt={visit.property.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <Home className="w-8 h-8 text-gray-300" />
                            </div>
                          )}
                          {/* Visit Type Badge */}
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-medium flex items-center gap-1">
                              {visit.visit_type === 'video' ? (
                                <><Video className="w-3 h-3" /> Vidéo</>
                              ) : (
                                <><MapPin className="w-3 h-3" /> Sur place</>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="font-semibold text-gray-900">
                                  {visit.property.title}
                                </h3>
                                <span
                                  className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                                  style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.color }}
                                >
                                  {statusConfig.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                <MapPin className="w-3 h-3" />
                                <span>{visit.property.city}, {visit.property.postal_code}</span>
                              </div>

                              {/* Date & Time */}
                              <div className="flex items-center gap-3 p-2 superellipse-lg bg-gray-50 border border-gray-100 mb-2">
                                <div className="flex items-center gap-1.5 text-gray-700">
                                  <Calendar className="w-4 h-4 text-searcher-600" />
                                  <span className="text-xs font-medium capitalize">{formatShortDate(visit.visit_date)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-700">
                                  <Clock className="w-4 h-4 text-searcher-600" />
                                  <span className="text-xs font-medium">{visit.visit_time}</span>
                                </div>
                              </div>

                              {/* Owner Info */}
                              {visit.owner && (
                                <p className="text-xs text-gray-500">
                                  Propriétaire: <span className="font-medium text-gray-700">{visit.owner.full_name}</span>
                                </p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-1.5">
                              {visit.owner?.phone && visit.status === 'confirmed' && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="w-8 h-8 superellipse-lg bg-searcher-50 flex items-center justify-center hover:bg-searcher-100 transition-colors"
                                >
                                  <Phone className="w-3.5 h-3.5" style={{ color: 'var(--searcher-500)' }} />
                                </motion.button>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => router.push(`/properties/${visit.property_id}`)}
                                className="w-8 h-8 superellipse-lg bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5 text-gray-500" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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

export default SearcherVisitsPage;
