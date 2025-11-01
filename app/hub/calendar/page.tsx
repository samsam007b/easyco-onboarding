'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  MapPin,
  Trash2,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location?: string;
  attendees: string[];
  color: string;
  createdBy: string;
}

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function HubCalendarPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Réunion mensuelle',
      description: 'Discussion sur le budget et les règles',
      date: '2024-11-08',
      time: '19:00',
      location: 'Salon',
      attendees: ['Tous'],
      color: 'bg-purple-500',
      createdBy: 'Sarah'
    },
    {
      id: '2',
      title: 'Inspection annuelle',
      description: 'Visite du propriétaire',
      date: '2024-11-15',
      time: '14:00',
      location: 'Appartement',
      attendees: ['Tous'],
      color: 'bg-red-500',
      createdBy: 'Propriétaire'
    },
    {
      id: '3',
      title: 'Soirée jeux',
      description: 'Soirée conviviale entre colocataires',
      date: '2024-11-22',
      time: '20:00',
      location: 'Salon',
      attendees: ['Sarah', 'Marc', 'Julie'],
      color: 'bg-green-500',
      createdBy: 'Marc'
    }
  ]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/login');
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

  const days = getDaysInMonth(currentDate);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-4 rounded-full"
          >
            ← Retour au hub
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Calendrier Partagé
              </h1>
              <p className="text-gray-600">
                Planifiez et coordonnez vos événements de colocation
              </p>
            </div>

            <Button
              className="rounded-full bg-gradient-to-r from-orange-600 to-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel événement
            </Button>
          </div>
        </motion.div>

        {/* Calendar Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>

            <div className="flex items-center gap-2">
              <Button
                onClick={previousMonth}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setCurrentDate(new Date())}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                Aujourd'hui
              </Button>
              <Button
                onClick={nextMonth}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-gray-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const dayEvents = day ? getEventsForDate(day) : [];

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={cn(
                    "min-h-[100px] p-2 border rounded-xl transition-all cursor-pointer",
                    day ? "bg-white hover:bg-orange-50 border-gray-200 hover:border-orange-300" : "bg-gray-50 border-gray-100",
                    isToday(day || 0) && "ring-2 ring-orange-500 bg-orange-50"
                  )}
                  onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                >
                  {day && (
                    <>
                      <div className={cn(
                        "text-sm font-semibold mb-1",
                        isToday(day) ? "text-orange-600" : "text-gray-900"
                      )}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "text-xs px-2 py-1 rounded text-white truncate",
                              event.color
                            )}
                          >
                            {event.time} {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500 px-2">
                            +{dayEvents.length - 2} autres
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-orange-600" />
            Événements à venir
          </h3>

          <div className="space-y-3">
            {events
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group"
                >
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", event.color)}>
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 mb-1">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        {new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {event.attendees.join(', ')}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
