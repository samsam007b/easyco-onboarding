'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, X, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end?: Date;
  location?: string;
  color?: 'orange' | 'blue' | 'green' | 'red' | 'purple';
}

interface EventCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
}

export function EventCalendar({ events, onEventClick, onDateClick }: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { locale: fr });
  const calendarEnd = endOfWeek(monthEnd, { locale: fr });

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.start), date));
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateClick?.(date);
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick?.(event);
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'orange':
        return 'bg-orange-500 hover:bg-orange-600 border-orange-600';
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600 border-blue-600';
      case 'green':
        return 'bg-green-500 hover:bg-green-600 border-green-600';
      case 'red':
        return 'bg-red-500 hover:bg-red-600 border-red-600';
      case 'purple':
        return 'bg-purple-500 hover:bg-purple-600 border-purple-600';
      default:
        return 'bg-orange-500 hover:bg-orange-600 border-orange-600';
    }
  };

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="w-full h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl font-bold text-gray-900">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="bg-gradient-to-r from-orange-50 to-orange-100/50 py-3 text-center text-sm font-semibold text-gray-700"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, idx) => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <div
              key={idx}
              onClick={() => handleDateClick(day)}
              className={`
                min-h-[120px] bg-white p-2 cursor-pointer transition-all hover:bg-orange-50/50
                ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                ${isSelected ? 'ring-2 ring-orange-500 ring-inset' : ''}
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`
                    text-sm font-medium inline-flex items-center justify-center w-7 h-7 rounded-full
                    ${isTodayDate ? 'bg-orange-600 text-white' : ''}
                    ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
                  `}
                >
                  {format(day, 'd')}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-xs font-medium text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* Events for this day */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={(e) => handleEventClick(event, e)}
                    className={`
                      text-xs p-1.5 rounded text-white cursor-pointer truncate
                      border-l-2 transition-all
                      ${getColorClasses(event.color)}
                    `}
                  >
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span className="font-medium truncate">{event.title}</span>
                    </div>
                    {event.start && (
                      <div className="text-[10px] opacity-90 mt-0.5">
                        {format(new Date(event.start), 'HH:mm', { locale: fr })}
                      </div>
                    )}
                  </motion.div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-orange-600 font-medium pl-1">
                    +{dayEvents.length - 3} de plus
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event details sidebar */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedDate(null)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Events list for selected date */}
              <div className="space-y-3">
                {getEventsForDate(selectedDate).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Aucune visite prévue ce jour</p>
                  </div>
                ) : (
                  getEventsForDate(selectedDate).map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className={`h-1 ${getColorClasses(event.color).split(' ')[0]}`} />
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                        )}
                        <div className="space-y-2">
                          {event.start && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4 text-orange-600" />
                              <span>
                                {format(new Date(event.start), 'HH:mm', { locale: fr })}
                                {event.end && ` - ${format(new Date(event.end), 'HH:mm', { locale: fr })}`}
                              </span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-orange-600" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
