/**
 * Searcher Visits Calendar Page - V3 Fun Design
 * Full-featured calendar view for property visits
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisits, type PropertyVisit } from '@/lib/hooks/use-visits';
import { useLanguage } from '@/lib/i18n/use-language';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Home,
  Video,
  User,
  Sparkles,
  Eye,
  ListChecks,
  CalendarDays,
  CalendarCheck,
  Star,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  searcherGradientVibrant,
  searcherGradientLight,
  searcherColors,
  searcherAnimations,
  semanticColors,
} from '@/lib/constants/searcher-theme';
import { SearcherPageHeader } from '@/components/searcher';
import Link from 'next/link';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
  },
};

// Months and days
const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// Visit type colors for calendar
const VISIT_COLORS = {
  confirmed: {
    bg: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
    text: 'text-white',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  pending: {
    bg: 'bg-gradient-to-r from-amber-500 to-amber-400',
    text: 'text-white',
    badge: 'bg-amber-100 text-amber-700',
  },
  completed: {
    bg: 'bg-gradient-to-r from-blue-500 to-blue-400',
    text: 'text-white',
    badge: 'bg-blue-100 text-blue-700',
  },
  cancelled: {
    bg: 'bg-gradient-to-r from-gray-400 to-gray-300',
    text: 'text-white',
    badge: 'bg-gray-100 text-gray-600',
  },
};

export default function SearcherCalendarPage() {
  const router = useRouter();
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.searcher?.calendar;

  const {
    visits,
    loading,
    fetchMyVisits,
    getUpcomingVisits,
    getPastVisits,
  } = useVisits();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  useEffect(() => {
    fetchMyVisits();
  }, []);

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const days: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getVisitsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return visits.filter((visit) => {
      const visitDate = new Date(visit.scheduled_at).toISOString().split('T')[0];
      return visitDate === dateStr;
    });
  };

  const getVisitStatus = (status: string): keyof typeof VISIT_COLORS => {
    if (status === 'cancelled_by_visitor' || status === 'cancelled_by_owner' || status === 'no_show') {
      return 'cancelled';
    }
    return status as keyof typeof VISIT_COLORS;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const days = getDaysInMonth(currentDate);
  const upcomingVisits = getUpcomingVisits();
  const pastVisits = getPastVisits();

  // Selected date visits
  const selectedDayVisits = selectedDate
    ? visits.filter((visit) => {
        const visitDate = new Date(visit.scheduled_at);
        return (
          visitDate.getDate() === selectedDate.getDate() &&
          visitDate.getMonth() === selectedDate.getMonth() &&
          visitDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">Chargement du calendrier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Page Header */}
          <SearcherPageHeader
            icon={CalendarDays}
            title={t?.title?.[language] || 'Calendrier des visites'}
            subtitle={t?.subtitle?.[language] || 'Visualisez et planifiez toutes vos visites de propriétés'}
            breadcrumb={{ label: 'Accueil', href: '/dashboard/searcher' }}
            currentPage="Calendrier"
            actions={
              <Link href="/dashboard/searcher/my-visits">
                <Button
                  className="rounded-2xl text-white font-semibold shadow-lg"
                  style={{
                    background: searcherGradientVibrant,
                    boxShadow: '0 4px 14px rgba(255, 140, 32, 0.3)',
                  }}
                >
                  <ListChecks className="w-4 h-4 mr-2" />
                  Voir la liste
                </Button>
              </Link>
            }
          />

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Next Visit */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden rounded-2xl p-5 shadow-sm border border-gray-200"
              style={{ background: searcherGradientLight }}
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-15" style={{ background: searcherGradientVibrant }} />
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Prochaine visite</span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: searcherGradientVibrant }}>
                  <CalendarCheck className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {upcomingVisits.length > 0
                  ? new Date(upcomingVisits[0].scheduled_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                  : '—'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {upcomingVisits.length > 0 ? upcomingVisits[0].property?.title?.slice(0, 20) + '...' : 'Aucune visite planifiée'}
              </p>
            </motion.div>

            {/* This Month */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden rounded-2xl p-5 shadow-sm border border-gray-200"
              style={{ background: 'linear-gradient(135deg, #FFF5E6 0%, #FFF9F0 100%)' }}
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-15" style={{ background: semanticColors.info.gradient }} />
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Ce mois</span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: semanticColors.info.gradient }}>
                  <CalendarIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {visits.filter((v) => {
                  const vDate = new Date(v.scheduled_at);
                  return vDate.getMonth() === currentDate.getMonth() && vDate.getFullYear() === currentDate.getFullYear();
                }).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">visites programmées</p>
            </motion.div>

            {/* Upcoming */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden rounded-2xl p-5 shadow-sm border border-gray-200"
              style={{ background: semanticColors.success.light }}
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-15" style={{ background: semanticColors.success.gradient }} />
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">À venir</span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: semanticColors.success.gradient }}>
                  <Clock className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{upcomingVisits.length}</p>
              <p className="text-xs text-gray-500 mt-1">visites à venir</p>
            </motion.div>

            {/* Completed */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden rounded-2xl p-5 shadow-sm border border-gray-200"
              style={{ background: 'linear-gradient(135deg, #F0F4FF 0%, #E8EEFF 100%)' }}
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-15" style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)' }} />
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Terminées</span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}>
                  <Star className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{visits.filter((v) => v.status === 'completed').length}</p>
              <p className="text-xs text-gray-500 mt-1">visites effectuées</p>
            </motion.div>
          </motion.div>

          {/* Main Calendar Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <motion.div
              whileHover={{ y: -4 }}
              className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6 border-2 border-amber-100"
              style={{ boxShadow: '0 12px 32px rgba(255, 160, 64, 0.08)' }}
            >
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: searcherGradientVibrant }}
                  >
                    <CalendarIcon className="w-5 h-5 text-white" />
                  </motion.div>
                  {MONTHS_FR[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={previousMonth}
                    className="w-9 h-9 rounded-xl flex items-center justify-center border-2 border-amber-200 text-amber-600 hover:bg-amber-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentDate(new Date())}
                    className="px-4 h-9 rounded-xl font-semibold text-white text-sm"
                    style={{ background: searcherGradientVibrant }}
                  >
                    Aujourd'hui
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextMonth}
                    className="w-9 h-9 rounded-xl flex items-center justify-center border-2 border-amber-200 text-amber-600 hover:bg-amber-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Days of week */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {DAYS_FR.map((day, idx) => (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="text-center text-sm font-bold text-gray-400 py-2 uppercase tracking-wider"
                  >
                    {day}
                  </motion.div>
                ))}
              </div>

              {/* Calendar Days */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-7 gap-2"
              >
                {days.map((day, index) => {
                  const dayVisits = day ? getVisitsForDate(day) : [];
                  const isTodayDay = isToday(day || 0);
                  const isSelected =
                    selectedDate &&
                    day === selectedDate.getDate() &&
                    currentDate.getMonth() === selectedDate.getMonth() &&
                    currentDate.getFullYear() === selectedDate.getFullYear();

                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={day ? { scale: 1.02 } : undefined}
                      whileTap={day ? { scale: 0.98 } : undefined}
                      className={cn(
                        'min-h-[90px] p-2 border-2 rounded-xl transition-all cursor-pointer',
                        day
                          ? 'bg-white hover:border-amber-300 border-gray-100'
                          : 'bg-gray-50/50 border-gray-50',
                        isTodayDay && 'ring-2 ring-amber-400 border-amber-200',
                        isSelected && 'ring-2 ring-amber-500 border-amber-300 bg-amber-50'
                      )}
                      style={
                        isTodayDay
                          ? {
                              background: 'linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 100%)',
                              boxShadow: '0 4px 16px rgba(255, 160, 64, 0.15)',
                            }
                          : undefined
                      }
                      onClick={() =>
                        day &&
                        setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
                      }
                    >
                      {day && (
                        <>
                          <div
                            className={cn(
                              'text-sm font-bold mb-1 flex items-center gap-1',
                              isTodayDay ? 'text-amber-600' : 'text-gray-900'
                            )}
                          >
                            {day}
                            {isTodayDay && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white" style={{ background: searcherGradientVibrant }}>
                                Auj
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            {dayVisits.slice(0, 2).map((visit) => {
                              const status = getVisitStatus(visit.status);
                              const colors = VISIT_COLORS[status];
                              return (
                                <motion.div
                                  key={visit.id}
                                  whileHover={{ scale: 1.02 }}
                                  className={cn(
                                    'text-[10px] px-1.5 py-0.5 rounded-lg truncate font-medium shadow-sm',
                                    colors.bg,
                                    colors.text
                                  )}
                                >
                                  {new Date(visit.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </motion.div>
                              );
                            })}
                            {dayVisits.length > 2 && (
                              <Badge className="text-[10px] border-none text-white font-semibold py-0" style={{ background: searcherGradientVibrant }}>
                                +{dayVisits.length - 2}
                              </Badge>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500 font-medium">Légende:</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
                  <span className="text-xs text-gray-600">Confirmée</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400" />
                  <span className="text-xs text-gray-600">En attente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400" />
                  <span className="text-xs text-gray-600">Terminée</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-300" />
                  <span className="text-xs text-gray-600">Annulée</span>
                </div>
              </div>
            </motion.div>

            {/* Selected Day Details */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-amber-100"
              style={{ boxShadow: '0 12px 32px rgba(255, 160, 64, 0.08)' }}
            >
              <div
                className="p-4 border-b border-amber-100"
                style={{ background: searcherGradientLight }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: searcherGradientVibrant }}
                  >
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {selectedDate
                        ? selectedDate.toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                          })
                        : 'Sélectionnez une date'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedDayVisits.length} visite{selectedDayVisits.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 max-h-[400px] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {selectedDayVisits.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8"
                    >
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: searcherGradientLight }}
                      >
                        <CalendarIcon className="w-8 h-8" style={{ color: searcherColors.primary }} />
                      </div>
                      <p className="text-gray-500 text-sm">
                        {selectedDate ? 'Aucune visite ce jour' : 'Cliquez sur une date pour voir les détails'}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="visits"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {selectedDayVisits.map((visit) => {
                        const status = getVisitStatus(visit.status);
                        const colors = VISIT_COLORS[status];
                        const visitTime = new Date(visit.scheduled_at);

                        return (
                          <motion.div
                            key={visit.id}
                            whileHover={{ scale: 1.02, x: 4 }}
                            className="p-4 rounded-2xl border-2 border-amber-100 hover:border-amber-200 transition-all cursor-pointer"
                            style={{ background: 'linear-gradient(135deg, #FFFBF5 0%, #FFFFFF 100%)' }}
                            onClick={() => router.push(`/properties/${visit.property_id}`)}
                          >
                            <div className="flex items-start gap-3">
                              {/* Property Image */}
                              {visit.property?.main_image_url ? (
                                <img
                                  src={visit.property.main_image_url}
                                  alt=""
                                  className="w-14 h-14 rounded-xl object-cover"
                                />
                              ) : (
                                <div
                                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                                  style={{ background: searcherGradientLight }}
                                >
                                  <Home className="w-6 h-6" style={{ color: searcherColors.primary }} />
                                </div>
                              )}

                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm truncate">
                                  {visit.property?.title || 'Visite'}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">
                                    {visitTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  {visit.visit_type === 'virtual' ? (
                                    <Badge className="text-[10px] bg-blue-100 text-blue-700 border-none">
                                      <Video className="w-2.5 h-2.5 mr-0.5" />
                                      Virtuelle
                                    </Badge>
                                  ) : (
                                    <Badge className="text-[10px] bg-green-100 text-green-700 border-none">
                                      <MapPin className="w-2.5 h-2.5 mr-0.5" />
                                      Sur place
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500 truncate">
                                    {visit.property?.city || 'Adresse non renseignée'}
                                  </span>
                                </div>
                              </div>

                              <Badge className={cn('text-xs border-none', colors.badge)}>
                                {status === 'confirmed' && 'Confirmée'}
                                {status === 'pending' && 'En attente'}
                                {status === 'completed' && 'Terminée'}
                                {status === 'cancelled' && 'Annulée'}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <User className="w-3 h-3" />
                                <span>{visit.owner?.full_name || 'Propriétaire'}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs font-medium" style={{ color: searcherColors.primary }}>
                                <span>Voir la propriété</span>
                                <ArrowRight className="w-3 h-3" />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* Upcoming Visits Quick View */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl shadow-lg overflow-hidden border-l-4"
            style={{
              borderLeftColor: searcherColors.primary,
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.06)',
            }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: searcherGradientVibrant }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Prochaines visites</h3>
                  <p className="text-sm text-gray-500">{upcomingVisits.length} visite{upcomingVisits.length !== 1 ? 's' : ''} à venir</p>
                </div>
              </div>
              <Link href="/dashboard/searcher/my-visits">
                <Button variant="outline" className="rounded-xl text-sm" style={{ borderColor: searcherColors.primary, color: searcherColors.primary }}>
                  Voir tout
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="p-4">
              {upcomingVisits.length === 0 ? (
                <div className="text-center py-8">
                  <Info className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucune visite planifiée</p>
                  <Link href="/properties/browse">
                    <Button
                      className="mt-4 rounded-xl text-white"
                      style={{ background: searcherGradientVibrant }}
                    >
                      Parcourir les propriétés
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingVisits.slice(0, 3).map((visit) => {
                    const visitDate = new Date(visit.scheduled_at);
                    const status = getVisitStatus(visit.status);
                    const colors = VISIT_COLORS[status];

                    return (
                      <motion.div
                        key={visit.id}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="p-4 rounded-2xl border-2 border-amber-100 hover:border-amber-200 transition-all cursor-pointer"
                        style={{ background: searcherGradientLight }}
                        onClick={() => router.push(`/properties/${visit.property_id}`)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Badge className={cn('text-xs border-none', colors.badge)}>
                            {status === 'confirmed' && 'Confirmée'}
                            {status === 'pending' && 'En attente'}
                          </Badge>
                          {visit.visit_type === 'virtual' && (
                            <Video className="w-4 h-4 text-blue-500" />
                          )}
                        </div>

                        <h4 className="font-semibold text-gray-900 mb-2 truncate">
                          {visit.property?.title || 'Visite'}
                        </h4>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <CalendarIcon className="w-4 h-4" style={{ color: searcherColors.primary }} />
                            <span>
                              {visitDate.toLocaleDateString('fr-FR', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" style={{ color: searcherColors.primary }} />
                            <span>
                              {visitDate.toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" style={{ color: searcherColors.primary }} />
                            <span className="truncate">{visit.property?.city || 'Non renseigné'}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
