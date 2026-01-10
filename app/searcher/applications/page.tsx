'use client';

import React, { useEffect, useState, memo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useApplications } from '@/lib/hooks/use-applications';
import { createClient } from '@/lib/auth/supabase-client';
import type { Application } from '@/lib/hooks/use-applications';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  CheckCircle,
  XCircle,
  Clock,
  Home,
  MapPin,
  Euro,
  Calendar,
  MessageSquare,
  Eye,
  Trash2,
  FileText,
  Sparkles,
  Send,
  ArrowLeft,
  Search,
  Heart,
  Bookmark,
  MessageCircle,
  ClipboardList,
} from 'lucide-react';
import { toast } from 'sonner';

// V3-FUN Applications Palette - Searcher Main Gradient
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

const SearcherApplicationsPage = memo(function SearcherApplicationsPage() {
  const router = useRouter();
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.searcher?.applications;
  const [userId, setUserId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | Application['status']>('all');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [favorites, setFavorites] = useState(0);

  const { applications: hookApplications, loadApplications, withdrawApplication, deleteApplication } = useApplications(userId || undefined);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

      // Load sidebar stats
      const [messagesRes, favoritesRes] = await Promise.all([
        supabase.rpc('get_unread_count', { target_user_id: user.id }),
        supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);

      setUnreadMessages(messagesRes.data || 0);
      setFavorites(favoritesRes.count || 0);

      await loadApplications(false);
      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    if (hookApplications) {
      setApplications(hookApplications);
    }
  }, [hookApplications]);

  const loadApplicationsData = async () => {
    await loadApplications(false);
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm(t?.confirmWithdraw?.[language] || 'Êtes-vous sûr de vouloir retirer cette candidature ?')) {
      return;
    }

    const success = await withdrawApplication(applicationId);
    if (success) {
      toast.success(t?.messages?.withdrawn?.[language] || 'Candidature retirée');
      await loadApplicationsData();
    }
  };

  const handleDelete = async (applicationId: string) => {
    if (!confirm(t?.confirmDelete?.[language] || 'Êtes-vous sûr de vouloir supprimer cette candidature de votre historique ?')) {
      return;
    }

    const success = await deleteApplication(applicationId);
    if (success) {
      toast.success(t?.messages?.deleted?.[language] || 'Candidature supprimée');
      await loadApplicationsData();
    }
  };

  const getStatusConfig = (status: Application['status']) => {
    const config = {
      pending: { icon: Clock, label: 'En attente', color: '#F59E0B', bgColor: '#FEF3C7' },
      reviewing: { icon: Eye, label: 'En examen', color: 'var(--searcher-500)', bgColor: 'var(--searcher-100)' },
      approved: { icon: CheckCircle, label: 'Acceptée', color: '#10B981', bgColor: '#D1FAE5' },
      rejected: { icon: XCircle, label: 'Refusée', color: '#EF4444', bgColor: '#FEE2E2' },
      withdrawn: { icon: XCircle, label: 'Retirée', color: '#6B7280', bgColor: '#F3F4F6' },
      expired: { icon: Clock, label: 'Expirée', color: '#6B7280', bgColor: '#F3F4F6' },
    };
    return config[status];
  };

  const filteredApplications = applications.filter((app) =>
    filterStatus === 'all' ? true : app.status === filterStatus
  );

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending' || a.status === 'reviewing').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  // Stats cards
  const statsCards = [
    {
      icon: Send,
      value: stats.total,
      label: 'Total',
      color: 'var(--searcher-500)',
      bgColor: 'var(--searcher-100)',
    },
    {
      icon: Clock,
      value: stats.pending,
      label: 'En attente',
      color: '#F59E0B',
      bgColor: '#FEF3C7',
    },
    {
      icon: CheckCircle,
      value: stats.approved,
      label: 'Acceptées',
      color: '#10B981',
      bgColor: '#D1FAE5',
    },
    {
      icon: XCircle,
      value: stats.rejected,
      label: 'Refusées',
      color: '#EF4444',
      bgColor: '#FEE2E2',
    },
  ];

  // Filter tabs
  const filterTabs = [
    { id: 'all', label: 'Toutes', count: stats.total },
    { id: 'pending', label: 'En attente', count: stats.pending },
    { id: 'approved', label: 'Acceptées', count: stats.approved },
    { id: 'rejected', label: 'Refusées', count: stats.rejected },
  ];

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-searcher-500/5" />
          <div className="absolute top-0 -left-4 w-96 h-96 bg-searcher-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-resident-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-searcher-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />
          <div className="absolute inset-0 backdrop-blur-3xl bg-white/60" />
        </div>
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium mt-4">Chargement de vos candidatures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 md:pb-0">
      {/* Glassmorphism background - Searcher for Applications */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-searcher-500/8 via-searcher-400/5 to-searcher-300/3" />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-searcher-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-resident-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-searcher-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />
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
                    <ClipboardList className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-gray-900">{t?.title?.[language] || 'Mes Candidatures'}</h1>
                    <p className="text-xs text-gray-500">{stats.total} candidature{stats.total !== 1 ? 's' : ''} envoyée{stats.total !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              {/* Right: Discover Button */}
              {stats.total > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/searcher/explore')}
                  className="flex items-center gap-2 px-4 py-2 superellipse-xl text-white text-sm font-medium shadow-md"
                  style={{ background: 'var(--gradient-searcher)' }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Découvrir plus</span>
                </motion.button>
              )}
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
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {statsCards.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 superellipse-xl bg-white shadow-sm border border-gray-100 flex-shrink-0"
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
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {filterTabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilterStatus(tab.id as typeof filterStatus)}
                  className={`px-3 py-1.5 superellipse-lg text-xs font-medium transition-all flex-shrink-0 ${
                    filterStatus === tab.id
                      ? 'text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                  }`}
                  style={filterStatus === tab.id ? { background: 'var(--gradient-searcher)' } : {}}
                >
                  {tab.label} ({tab.count})
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {filteredApplications.length === 0 ? (
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
                <FileText className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {filterStatus === 'all' ? 'Pas encore de candidatures' : `Aucune candidature ${filterStatus === 'pending' ? 'en attente' : filterStatus === 'approved' ? 'acceptée' : 'refusée'}`}
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                {filterStatus === 'all' ? 'Explorez les propriétés et postulez à celles qui vous plaisent' : 'Essayez de sélectionner un autre filtre'}
              </p>
              {filterStatus === 'all' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/searcher/explore')}
                  className="px-6 py-3 superellipse-xl text-white font-medium shadow-md flex items-center gap-2"
                  style={{ background: 'var(--gradient-searcher)' }}
                >
                  <Sparkles className="w-4 h-4" />
                  Découvrir les propriétés
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
              {filteredApplications.map((application) => {
                const statusConfig = getStatusConfig(application.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={application.id}
                    variants={itemVariants}
                    layout
                    exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                  >
                    <div className="bg-white superellipse-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-searcher-200 transition-all">
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          {/* Property Image */}
                          <div
                            className="w-20 h-20 superellipse-xl bg-gray-100 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                            onClick={() => application.property?.id && router.push(`/properties/${application.property.id}`)}
                          >
                            {application.property?.main_image ? (
                              <Image
                                src={application.property.main_image}
                                alt={application.property.title || 'Property'}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Home className="w-8 h-8 text-gray-300" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3
                                className="font-semibold text-gray-900 cursor-pointer hover:text-searcher-600 transition-colors"
                                onClick={() => application.property?.id && router.push(`/properties/${application.property.id}`)}
                              >
                                {application.property?.title || 'Propriété'}
                              </h3>
                              <span
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1"
                                style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.color }}
                              >
                                <StatusIcon className="w-3 h-3" />
                                {statusConfig.label}
                              </span>
                            </div>

                            {application.property && (
                              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {application.property.city}
                                </span>
                                <span className="flex items-center gap-1 font-medium text-gray-700">
                                  <Euro className="w-3 h-3" />
                                  {application.property.monthly_rent.toLocaleString()}€/mois
                                </span>
                              </div>
                            )}

                            {application.desired_move_in_date && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                <Calendar className="w-3 h-3" />
                                <span>Emménagement: {new Date(application.desired_move_in_date).toLocaleDateString('fr-FR')}</span>
                              </div>
                            )}

                            {application.message && (
                              <div className="p-2 superellipse-lg bg-gray-50 border border-gray-100 mb-2">
                                <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-0.5">
                                  <MessageSquare className="w-3 h-3" />
                                  Votre message:
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-1">{application.message}</p>
                              </div>
                            )}

                            {/* Approval/Rejection Message */}
                            {application.status === 'approved' && (
                              <div className="p-2 superellipse-lg bg-emerald-50 border border-emerald-100">
                                <div className="flex items-center gap-1 text-xs text-emerald-700">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span className="font-medium">Félicitations ! Votre candidature a été acceptée.</span>
                                </div>
                              </div>
                            )}

                            {application.status === 'rejected' && (
                              <div className="p-2 superellipse-lg bg-red-50 border border-red-100">
                                <div className="flex items-center gap-1 text-xs text-red-700">
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span className="font-medium">Votre candidature n'a pas été retenue.</span>
                                </div>
                                {application.rejection_reason && (
                                  <p className="text-[10px] text-red-600 mt-1">{application.rejection_reason}</p>
                                )}
                              </div>
                            )}

                            <p className="text-[10px] text-gray-400 mt-2">
                              Envoyée le {new Date(application.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-1.5">
                            {application.property?.id && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => router.push(`/properties/${application.property.id}`)}
                                className="w-8 h-8 superellipse-lg bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5 text-gray-500" />
                              </motion.button>
                            )}
                            {(application.status === 'pending' || application.status === 'reviewing') && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleWithdraw(application.id)}
                                className="w-8 h-8 superellipse-lg bg-searcher-50 flex items-center justify-center hover:bg-searcher-100 transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5 text-searcher-600" />
                              </motion.button>
                            )}
                            {(application.status === 'rejected' || application.status === 'withdrawn') && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(application.id)}
                                className="w-8 h-8 superellipse-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              </motion.button>
                            )}
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

export default SearcherApplicationsPage;
