/**
 * Expense Calendar View
 * Monthly calendar showing expenses with color-coded category indicators
 */

'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from 'lucide-react';
import type { ExpenseWithDetails } from '@/types/finances.types';

interface ExpenseCalendarViewProps {
  expenses: ExpenseWithDetails[];
  onExpenseClick: (expense: ExpenseWithDetails) => void;
  onDayClick?: (date: Date, expenses: ExpenseWithDetails[]) => void;
}

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const categoryColors: Record<string, string> = {
  rent: 'bg-purple-500',
  utilities: 'bg-blue-500',
  groceries: 'bg-green-500',
  cleaning: 'bg-cyan-500',
  maintenance: 'bg-orange-500',
  internet: 'bg-indigo-500',
  other: 'bg-gray-500',
};

export default function ExpenseCalendarView({
  expenses,
  onExpenseClick,
  onDayClick,
}: ExpenseCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Group expenses by date
  const expensesByDate = useMemo(() => {
    const map = new Map<string, ExpenseWithDetails[]>();

    expenses.forEach((expense) => {
      const dateKey = expense.date.split('T')[0]; // YYYY-MM-DD
      const existing = map.get(dateKey) || [];
      existing.push(expense);
      map.set(dateKey, existing);
    });

    return map;
  }, [expenses]);

  // Calculate monthly total
  const monthlyTotal = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    return expenses.reduce((sum, exp) => {
      const expDate = new Date(exp.date);
      if (expDate >= startDate && expDate <= endDate) {
        return sum + exp.amount;
      }
      return sum;
    }, 0);
  }, [expenses, currentDate]);

  // Get days in month with padding for week alignment
  const getDaysInMonth = (date: Date): (number | null)[] => {
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

  const getExpensesForDate = (day: number): ExpenseWithDetails[] => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return expensesByDate.get(dateStr) || [];
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-4">
      {/* Month Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <p className="text-sm text-gray-500">
            Total du mois: €{monthlyTotal.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={previousMonth}
            variant="outline"
            size="sm"
            className="rounded-full w-9 h-9 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={goToToday}
            size="sm"
            className="rounded-full text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)' }}
          >
            Aujourd'hui
          </Button>
          <Button
            onClick={nextMonth}
            variant="outline"
            size="sm"
            className="rounded-full w-9 h-9 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Category Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className="flex items-center gap-1.5">
            <div className={cn('w-2.5 h-2.5 rounded-full', color)} />
            <span className="text-xs text-gray-500 capitalize">
              {category === 'rent' && 'Loyer'}
              {category === 'utilities' && 'Charges'}
              {category === 'groceries' && 'Courses'}
              {category === 'cleaning' && 'Ménage'}
              {category === 'maintenance' && 'Entretien'}
              {category === 'internet' && 'Internet'}
              {category === 'other' && 'Autre'}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-500 py-3 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayExpenses = day ? getExpensesForDate(day) : [];
            const dayTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
            const today = day ? isToday(day) : false;

            return (
              <motion.button
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                disabled={day === null}
                onClick={() => {
                  if (day && dayExpenses.length > 0) {
                    if (dayExpenses.length === 1) {
                      onExpenseClick(dayExpenses[0]);
                    } else if (onDayClick) {
                      onDayClick(
                        new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
                        dayExpenses
                      );
                    }
                  }
                }}
                className={cn(
                  'relative min-h-[80px] md:min-h-[100px] p-2 border-b border-r border-gray-50 transition-all text-left',
                  day === null && 'bg-gray-25 cursor-default',
                  day !== null && 'hover:bg-gray-50 cursor-pointer',
                  today && 'bg-gradient-to-br from-[#fff5f3] to-white'
                )}
              >
                {day !== null && (
                  <>
                    {/* Day number */}
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          'text-sm font-medium',
                          today ? 'text-[#ee5736] font-bold' : 'text-gray-700',
                          dayExpenses.length > 0 && 'font-semibold'
                        )}
                      >
                        {day}
                      </span>
                      {today && (
                        <div className="w-2 h-2 rounded-full bg-[#ee5736]" />
                      )}
                    </div>

                    {/* Expense indicators */}
                    {dayExpenses.length > 0 && (
                      <div className="space-y-1">
                        {/* Category dots */}
                        <div className="flex flex-wrap gap-1">
                          {dayExpenses.slice(0, 4).map((expense, i) => (
                            <div
                              key={expense.id}
                              className={cn(
                                'w-2 h-2 rounded-full',
                                categoryColors[expense.category] || 'bg-gray-400'
                              )}
                              title={expense.title}
                            />
                          ))}
                          {dayExpenses.length > 4 && (
                            <span className="text-[10px] text-gray-400 leading-none">
                              +{dayExpenses.length - 4}
                            </span>
                          )}
                        </div>

                        {/* Day total */}
                        <div className="text-xs font-medium text-gray-600">
                          €{dayTotal.toFixed(0)}
                        </div>

                        {/* First expense title (on larger screens) */}
                        <div className="hidden md:block">
                          <p className="text-[10px] text-gray-500 truncate leading-tight">
                            {dayExpenses[0].title}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
          <p className="text-xs text-gray-500">Dépenses totales</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-[#ee5736]">€{monthlyTotal.toFixed(0)}</p>
          <p className="text-xs text-gray-500">Ce mois</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {Array.from(expensesByDate.keys()).filter((date) => {
              const d = new Date(date);
              return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
            }).length}
          </p>
          <p className="text-xs text-gray-500">Jours avec dépenses</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">
            €{expenses.length > 0 ? (monthlyTotal / Math.max(1, expenses.filter((e) => {
              const d = new Date(e.date);
              return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
            }).length)).toFixed(0) : '0'}
          </p>
          <p className="text-xs text-gray-500">Moyenne/dépense</p>
        </div>
      </div>
    </div>
  );
}
