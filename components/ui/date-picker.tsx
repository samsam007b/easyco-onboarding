'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  onDateSelect?: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
}

export default function DatePicker({
  onDateSelect,
  placeholder = 'Flexible',
  className = '',
  inputClassName = '',
  iconClassName = ''
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate calendar position and close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const updatePosition = () => {
      if (containerRef.current && isOpen) {
        const rect = containerRef.current.getBoundingClientRect();
        setCalendarPosition({
          top: rect.bottom + 8,
          left: rect.left
        });
      }
    };

    if (isOpen) {
      updatePosition();
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    if (onDateSelect) {
      onDateSelect(newDate);
    }
    setIsOpen(false);
  };

  const handleFlexibleClick = () => {
    setSelectedDate(null);
    if (onDateSelect) {
      onDateSelect(null);
    }
    setIsOpen(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return placeholder;
    const day = date.getDate();
    const month = date.toLocaleDateString('fr-FR', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);
    const today = new Date();

    // Adjust for Monday start (0 = Sunday, we want 1 = Monday)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    // Empty cells for days before month starts
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-7" />);
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

      days.push(
        <button
          key={day}
          onClick={() => !isPast && handleDateClick(day)}
          disabled={isPast}
          className={cn(
            "h-7 w-7 rounded-full text-xs font-medium transition-all",
            isSelected
              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md scale-110"
              : isToday
              ? "bg-purple-100 text-purple-900 hover:bg-purple-200"
              : isPast
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-purple-50"
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const calendarContent = isOpen ? (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed z-[99999] bg-white rounded-xl shadow-2xl border border-gray-200 p-3 min-w-[260px]"
      style={{
        top: `${calendarPosition.top}px`,
        left: `${calendarPosition.left}px`
      }}
    >
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handlePreviousMonth}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <span className="font-semibold text-gray-900 text-sm">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((day) => (
          <div
            key={day}
            className="h-6 flex items-center justify-center text-[10px] font-semibold text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {renderCalendarDays()}
      </div>

      {/* Flexible option */}
      <button
        onClick={handleFlexibleClick}
        className="w-full py-1.5 px-3 rounded-lg text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
      >
        Flexible
      </button>
    </motion.div>
  ) : null;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className={iconClassName} />
        <input
          type="text"
          value={formatDate(selectedDate)}
          readOnly
          placeholder={placeholder}
          className={cn("cursor-pointer", inputClassName)}
        />
      </div>

      {mounted && (
        <AnimatePresence>
          {calendarContent && createPortal(calendarContent, document.body)}
        </AnimatePresence>
      )}
    </div>
  );
}
