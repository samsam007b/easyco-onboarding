/**
 * Shared Calendar Page - V2 Fun Design
 * Plan and coordinate colocation events with style
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import CalendarEventModal from '@/components/CalendarEventModal';
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

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const EVENT_COLORS = [
  'bg-gradient-to-br from-[#d9574f] to-[#ff5b21]',
  'bg-gradient-to-br from-[#ff5b21] to-[#ff8017]',
  'bg-gradient-to-br from-[#d9574f] via-[#ff5b21] to-[#ff8017]',
  'bg-gradient-to-br from-[#ee5736] to-[#ff6e1c]',
  'bg-gradient-to-br from-[#ff5b21] to-[#ff8017]',
  'bg-gradient-to-br from-[#d9574f] to-[#ff8017]'
];

export default function HubCalendarPage() {
  const router = useRouter();
  const supabase = createClient();
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
          id === user.id ? 'Toi' : userMap.get(id) || 'Inconnu'
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
          createdByName: event.created_by === user.id ? 'Toi' : userMap.get(event.created_by) || 'Inconnu'
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
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
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
      alert('Erreur lors de la suppression de l\'événement');
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
          <p className="text-gray-600 font-medium">Chargement...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - V2 Fun Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-4 rounded-full hover:bg-gradient-to-r hover:from-[#d9574f]/10 hover:to-[#ff8017]/10 font-semibold"
          >
            ← Retour au hub
          </Button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                  boxShadow: '0 8px 24px rgba(238, 87, 54, 0.35)',
                }}
              >
                <CalendarIcon className="w-7 h-7 text-white relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Calendrier Partagé
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <PartyPopper className="w-4 h-4 text-orange-500" />
                  Planifiez et coordonnez vos événements
                </p>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleCreateEvent}
                className="rounded-full text-white font-semibold hover:shadow-xl transition-all border-none"
                style={{
                  background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                  boxShadow: '0 4px 16px rgba(238, 87, 54, 0.4)',
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvel événement
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards - V2 Fun */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: "Aujourd'hui", value: todayEvents.length, gradient: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)', shadow: 'rgba(217, 87, 79, 0.35)' },
            { label: 'Ce mois', value: events.length, gradient: 'linear-gradient(135deg, #ff5b21 0%, #ff8017 100%)', shadow: 'rgba(255, 91, 33, 0.35)' },
            { label: 'À venir', value: upcomingEvents.length, gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', shadow: 'rgba(124, 58, 237, 0.35)' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -4 }}
              className="bg-white rounded-2xl shadow-lg p-5 cursor-pointer border-2 border-transparent hover:border-orange-100"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-600">
                    {stat.label}
                  </p>
                  <p
                    className="text-3xl font-bold mt-1"
                    style={{
                      background: stat.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md"
                  style={{
                    background: stat.gradient,
                    boxShadow: `0 4px 12px ${stat.shadow}`,
                  }}
                >
                  <CalendarIcon className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Calendar Header - V2 Fun */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring' as const, stiffness: 300, damping: 25 }}
          className="bg-white rounded-3xl shadow-lg p-6 mb-6 border-2 border-transparent"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              <Badge
                className="text-xs border-none text-white font-bold ml-2"
                style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)' }}
              >
                {events.length} événements
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
                    background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                    boxShadow: '0 4px 12px rgba(238, 87, 54, 0.35)',
                  }}
                >
                  Aujourd'hui
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
            {DAYS.map((day, idx) => (
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
                    'min-h-[100px] p-2 border-2 rounded-xl transition-all cursor-pointer',
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
                          boxShadow: '0 4px 16px rgba(238, 87, 54, 0.15)',
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
                            Auj
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <motion.div
                            key={event.id}
                            whileHover={{ scale: 1.02 }}
                            className={cn(
                              'text-xs px-2 py-1 rounded-lg text-white truncate font-medium shadow-sm',
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
                              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
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

        {/* Upcoming Events - V2 Fun */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring' as const, stiffness: 300, damping: 25 }}
          className="bg-white rounded-3xl shadow-lg p-6 border-2 border-transparent"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PartyPopper className="w-5 h-5" style={{ color: '#ee5736' }} />
            Événements à venir
            <Badge
              className="text-xs border-none text-white font-bold ml-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' }}
            >
              {events.length}
            </Badge>
          </h3>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {events.length === 0 ? (
              <motion.div variants={itemVariants} className="text-center py-12">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="relative w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                    boxShadow: '0 8px 24px rgba(238, 87, 54, 0.35)',
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
                <p className="font-bold text-gray-900 mb-2 text-lg">Aucun événement prévu</p>
                <p className="text-sm text-gray-500">Créez votre premier événement !</p>
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
                    className="flex items-start gap-4 p-4 rounded-2xl border-2 border-orange-100 hover:border-orange-200 transition-all group cursor-pointer"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255,245,243,1) 0%, rgba(255,255,255,1) 100%)',
                      boxShadow: '0 4px 16px rgba(238, 87, 54, 0.1)',
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={cn(
                        'relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shadow-md',
                        event.color
                      )}
                      style={{ boxShadow: '0 4px 12px rgba(238, 87, 54, 0.35)' }}
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
                          {new Date(event.date).toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-700 font-semibold border-none">
                          <Clock className="w-3 h-3 mr-1" />
                          {event.time}
                        </Badge>
                        {event.location && (
                          <Badge className="bg-blue-100 text-blue-700 font-semibold border-none">
                            <MapPin className="w-3 h-3 mr-1" />
                            {event.location}
                          </Badge>
                        )}
                        <span className="flex items-center gap-1 text-gray-500">
                          <Users className="w-3 h-3" style={{ color: '#ee5736' }} />
                          {event.attendeeNames && event.attendeeNames.length > 0
                            ? event.attendeeNames.join(', ')
                            : 'Aucun participant'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full hover:bg-blue-100 text-blue-600"
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
        </motion.div>
      </div>

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
    </div>
  );
}
