/**
 * Shared Calendar Page - V2 Fun Design
 * Plan and coordinate co-living events with style
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import CalendarEventModal from '@/components/CalendarEventModal';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  MapPin,
  Trash2,
  Edit,
  Sparkles,
  PartyPopper,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import HubLayout from '@/components/hub/HubLayout';

// V2 Fun Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 25,
    },
  },
};

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location?: string;
  attendees: string[];
  attendeeNames?: string[];
  color: string;
  createdBy: string;
  createdByName?: string;
}

// Fallback months (English) - will be replaced by translations
const MONTHS_FALLBACK = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Fallback days (English) - will be replaced by translations
const DAYS_FALLBACK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// V3 Option C - Official Resident Palette Event Colors
const EVENT_COLORS = [
  'bg-gradient-to-br from-[#e05747] to-[#e05747]',
  'bg-gradient-to-br from-[#f8572b] to-[#ff7b19]',
  'bg-gradient-to-br from-[#e05747] via-[#e05747] to-[#e05747]',
  'bg-gradient-to-br from-[#e05747] to-[#e05747]',
  'bg-gradient-to-br from-[#f8572b] to-[#e05747]',
  'bg-gradient-to-br from-[#e05747] to-[#e05747]'
];

export default function HubCalendarPage() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection, language } = useLanguage();
  const t = getSection('hub')?.calendar;

  // Get translated months and days arrays
  const MONTHS = t?.months ? Object.values(t.months).map((m: any) => m[language]) : MONTHS_FALLBACK;
  const DAYS = t?.days ? Object.values(t.days).map((d: any) => d[language]) : DAYS_FALLBACK;

  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentPropertyId, setCurrentPropertyId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    loadEvents();
  }, [currentDate]);

  const loadEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setCurrentUserId(user.id);

      // Get user's property membership using RPC function
      const { data: membershipData, error: memberError } = await supabase
        .rpc('get_user_property_membership', { p_user_id: user.id });

      if (memberError || !membershipData?.property_id) {
        console.error('No property membership found');
        setIsLoading(false);
        return;
      }

      const propertyId = membershipData.property_id;
      setCurrentPropertyId(propertyId);

      // Get month range
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      // Fetch events for the current month with attendees
      const { data: eventsData, error } = await supabase
        .from('calendar_events')
        .select(`
          id,
          title,
          description,
          start_time,
          end_time,
          location,
          created_by,
          event_attendees (
            user_id
          )
        `)
        .eq('property_id', propertyId)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;

      // Fetch user names
      const userIds = [
        ...new Set([
          ...eventsData.map(e => e.created_by),
          ...eventsData.flatMap(e => e.event_attendees?.map((a: any) => a.user_id) || [])
        ])
      ];

      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      const userMap = new Map(
        usersData?.map(u => [u.id, `${u.first_name} ${u.last_name}`])
      );

      // Enrich events
      const enrichedEvents = eventsData.map((event, index) => {
        const startTime = new Date(event.start_time);
        const attendeeIds = event.event_attendees?.map((a: any) => a.user_id) || [];
        const attendeeNames = attendeeIds.map(id =>
          id === user.id ? (t?.you?.[language] || 'You') : userMap.get(id) || (t?.unknown?.[language] || 'Unknown')
        );

        return {
          id: event.id,
          title: event.title,
          description: event.description,
          date: startTime.toISOString().split('T')[0],
          time: startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          location: event.location,
          attendees: attendeeIds,
          attendeeNames,
          color: EVENT_COLORS[index % EVENT_COLORS.length],
          createdBy: event.created_by,
          createdByName: event.created_by === user.id ? (t?.you?.[language] || 'You') : userMap.get(event.created_by) || (t?.unknown?.[language] || 'Unknown')
        };
      });

      setEvents(enrichedEvents);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading events:', error);
      setIsLoading(false);
    }
  };

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

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const handleCreateEvent = () => {
    setEventToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEventToEdit(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm(t?.confirmDelete?.[language] || 'Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      // Reload events
      await loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert(t?.deleteError?.[language] || 'Error deleting event');
    }
  };

  const handleEventSaved = async () => {
    await loadEvents();
  };

  const days = getDaysInMonth(currentDate);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium">{t?.loading?.[language] || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  // Stats calculations
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const todayEvents = events.filter((e) => e.date === todayStr);
  const upcomingEvents = events.filter((e) => new Date(e.date) >= today);

  return (
    <HubLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header - Matching Finance Style */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 superellipse-2xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)',
                boxShadow: '0 8px 24px rgba(255, 101, 30, 0.35)',
              }}
            >
              <CalendarIcon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t?.title?.[language] || 'Calendar'}</h1>
              <p className="text-sm text-gray-500">
                {events.length} {events.length !== 1 ? (t?.eventPlural?.[language] || 'events') : (t?.eventSingular?.[language] || 'event')} • {MONTHS[currentDate.getMonth()]}
              </p>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleCreateEvent}
              size="sm"
              className="h-9 text-sm superellipse-xl text-white font-semibold shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)',
                boxShadow: '0 4px 14px rgba(255, 101, 30, 0.4)',
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t?.newEvent?.[language] || 'New event'}
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Cards - Matching Finance Style */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
          {/* Today Card - Orange Gradient */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden superellipse-2xl p-4 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #fff5f3 0%, #ffe8e0 100%)',
              boxShadow: '0 8px 24px rgba(255, 101, 30, 0.15)',
            }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
              style={{ background: 'linear-gradient(135deg, #e05747, #e05747, #e05747)' }}
            />
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-700">{t?.today?.[language] || 'Today'}</span>
              <div
                className="w-8 h-8 superellipse-xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #e05747, #e05747, #e05747)' }}
              >
                <CalendarIcon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{todayEvents.length}</p>
            <p className="text-xs text-orange-600 font-medium mt-2">{todayEvents.length !== 1 ? (t?.eventPlural?.[language] || 'events') : (t?.eventSingular?.[language] || 'event')}</p>
          </motion.div>

          {/* This Month Card - Lavender Gradient (UI Accent) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden superellipse-2xl p-4 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #f5f0ff 0%, #ede5fe 100%)',
              boxShadow: '0 8px 24px rgba(155, 123, 217, 0.15)',
            }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
              style={{ background: '#9B7BD9' }}
            />
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#7C5DB0' }}>{t?.thisMonth?.[language] || 'This month'}</span>
              <div
                className="w-8 h-8 superellipse-xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #9B7BD9, #B89EE6)' }}
              >
                <PartyPopper className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            <p className="text-xs font-medium mt-2" style={{ color: '#7C5DB0' }}>{events.length !== 1 ? (t?.eventPlural?.[language] || 'events') : (t?.eventSingular?.[language] || 'event')}</p>
          </motion.div>

          {/* Upcoming Card - Sage Gradient (UI Accent) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden superellipse-2xl p-4 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #f0f9f5 0%, #e5f5ed 100%)',
              boxShadow: '0 8px 24px rgba(124, 184, 155, 0.15)',
            }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
              style={{ background: '#7CB89B' }}
            />
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#5A9278' }}>{t?.upcoming?.[language] || 'Upcoming'}</span>
              <div
                className="w-8 h-8 superellipse-xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #7CB89B, #9DCDB4)' }}
              >
                <Clock className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
            <p className="text-xs font-medium mt-2" style={{ color: '#5A9278' }}>{upcomingEvents.length !== 1 ? (t?.eventPlural?.[language] || 'events') : (t?.eventSingular?.[language] || 'event')}</p>
          </motion.div>
        </motion.div>

        {/* Calendar Grid - Matching Finance Style */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="bg-white superellipse-2xl shadow-lg p-6 border-2 border-orange-100"
          style={{ boxShadow: '0 12px 32px rgba(255, 101, 30, 0.08)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              <Badge
                className="text-xs border-none text-white font-bold ml-2"
                style={{ background: 'linear-gradient(135deg, #e05747 0%, #e05747 100%)' }}
              >
                {events.length} {events.length !== 1 ? (t?.eventPlural?.[language] || 'events') : (t?.eventSingular?.[language] || 'event')}
              </Badge>
            </h2>

            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={previousMonth}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setCurrentDate(new Date())}
                  size="sm"
                  className="rounded-full text-white font-semibold hover:shadow-lg transition-all border-none"
                  style={{
                    background: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)',
                    boxShadow: '0 4px 12px rgba(255, 101, 30, 0.35)',
                  }}
                >
                  {t?.today?.[language] || 'Today'}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={nextMonth}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Days of week - V2 Fun */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAYS.map((day: string, idx: number) => (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="text-center text-sm font-bold text-gray-500 py-2 uppercase tracking-wider"
              >
                {day}
              </motion.div>
            ))}
          </div>

          {/* Calendar Grid - V2 Fun */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-7 gap-2"
          >
            {days.map((day, index) => {
              const dayEvents = day ? getEventsForDate(day) : [];
              const isTodayDay = isToday(day || 0);

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={day ? { scale: 1.02, y: -2 } : undefined}
                  whileTap={day ? { scale: 0.98 } : undefined}
                  className={cn(
                    'min-h-[100px] p-2 border-2 superellipse-xl transition-all cursor-pointer',
                    day
                      ? 'bg-white hover:border-orange-300 border-gray-100'
                      : 'bg-gray-50/50 border-gray-50',
                    isTodayDay && 'ring-2 ring-orange-400 border-orange-200'
                  )}
                  style={
                    isTodayDay
                      ? {
                          background:
                            'linear-gradient(135deg, rgba(255,245,243,1) 0%, rgba(255,255,255,1) 100%)',
                          boxShadow: '0 4px 16px rgba(255, 101, 30, 0.15)',
                        }
                      : undefined
                  }
                  onClick={() =>
                    day &&
                    setSelectedDate(
                      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                    )
                  }
                >
                  {day && (
                    <>
                      <div
                        className={cn(
                          'text-sm font-bold mb-1 flex items-center gap-1',
                          isTodayDay ? 'text-orange-600' : 'text-gray-900'
                        )}
                      >
                        {day}
                        {isTodayDay && (
                          <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                            {t?.todayShort?.[language] || 'Now'}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <motion.div
                            key={event.id}
                            whileHover={{ scale: 1.02 }}
                            className={cn(
                              'text-xs px-2 py-1 superellipse-lg text-white truncate font-medium shadow-sm',
                              event.color
                            )}
                          >
                            {event.time} {event.title}
                          </motion.div>
                        ))}
                        {dayEvents.length > 2 && (
                          <Badge
                            className="text-xs border-none text-white font-semibold"
                            style={{
                              background: 'linear-gradient(135deg, #9B7BD9 0%, #B89EE6 100%)',
                            }}
                          >
                            +{dayEvents.length - 2}
                          </Badge>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Upcoming Events - Matching Finance Style */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="bg-white superellipse-2xl shadow-lg overflow-hidden border-l-4"
          style={{ boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)', borderColor: '#9B7BD9' }}
        >
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <div
              className="w-9 h-9 superellipse-xl flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg, #e05747, #e05747)' }}
            >
              <PartyPopper className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-bold text-gray-900">{t?.upcomingEvents?.[language] || 'Upcoming events'}</h3>
            <Badge
              className="text-xs px-2 py-0.5 font-bold border-none"
              style={{ background: 'linear-gradient(135deg, #e05747, #e05747)', color: 'white' }}
            >
              {events.length}
            </Badge>
          </div>

          <div className="p-3">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {events.length === 0 ? (
              <motion.div variants={itemVariants} className="text-center py-12">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="relative w-20 h-20 superellipse-2xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)',
                    boxShadow: '0 8px 24px rgba(255, 101, 30, 0.35)',
                  }}
                >
                  <CalendarIcon className="w-10 h-10 text-white" />
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ y: [-2, 2, -2], rotate: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </motion.div>
                </motion.div>
                <p className="font-bold text-gray-900 mb-2 text-lg">{t?.noEvents?.[language] || 'No events planned'}</p>
                <p className="text-sm text-gray-500">{t?.createFirst?.[language] || 'Create your first event!'}</p>
              </motion.div>
            ) : (
              events
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((event, index) => (
                  <motion.div
                    key={event.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex items-start gap-4 p-4 superellipse-2xl border-2 border-orange-100 hover:border-orange-200 transition-all group cursor-pointer"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255,245,243,1) 0%, rgba(255,255,255,1) 100%)',
                      boxShadow: '0 4px 16px rgba(255, 101, 30, 0.1)',
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={cn(
                        'relative w-12 h-12 superellipse-xl overflow-hidden flex items-center justify-center shadow-md',
                        event.color
                      )}
                      style={{ boxShadow: '0 4px 12px rgba(255, 101, 30, 0.35)' }}
                    >
                      <CalendarIcon className="w-6 h-6 text-white relative z-10" />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 mb-1">{event.title}</h4>
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                        <Badge className="bg-orange-100 text-orange-700 font-semibold border-none">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {new Date(event.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : language === 'nl' ? 'nl-NL' : 'de-DE', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </Badge>
                        <Badge className="font-semibold border-none" style={{ backgroundColor: '#f5f0ff', color: '#7C5DB0' }}>
                          <Clock className="w-3 h-3 mr-1" />
                          {event.time}
                        </Badge>
                        {event.location && (
                          <Badge className="font-semibold border-none" style={{ backgroundColor: '#e8f2fb', color: '#3A6BAD' }}>
                            <MapPin className="w-3 h-3 mr-1" />
                            {event.location}
                          </Badge>
                        )}
                        <span className="flex items-center gap-1 text-gray-500">
                          <Users className="w-3 h-3" style={{ color: '#e05747' }} />
                          {event.attendeeNames && event.attendeeNames.length > 0
                            ? event.attendeeNames.join(', ')
                            : (t?.noParticipants?.[language] || 'No participants')}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full"
                          style={{ color: '#5B8BD9' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8f2fb'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full hover:bg-red-100 text-red-600"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))
            )}
          </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Event Modal */}
      {currentPropertyId && (
        <CalendarEventModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEventToEdit(null);
          }}
          onEventCreated={handleEventSaved}
          eventToEdit={eventToEdit}
          propertyId={currentPropertyId}
        />
      )}
    </HubLayout>
  );
}
