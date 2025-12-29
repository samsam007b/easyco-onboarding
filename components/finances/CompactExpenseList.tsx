/**
 * Compact Expense List
 * Premium, dense expense list matching Messages page style
 * Smaller typography, tighter spacing, more data per row
 */

'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Calendar,
  Scan,
  ChevronRight,
  Receipt,
} from 'lucide-react';
import type { ExpenseWithDetails } from '@/types/finances.types';

interface CompactExpenseListProps {
  expenses: ExpenseWithDetails[];
  onExpenseClick: (expense: ExpenseWithDetails) => void;
  maxItems?: number;
  showDate?: boolean;
}

const categoryColors: Record<string, string> = {
  rent: 'bg-purple-500',
  utilities: 'bg-blue-500',
  groceries: 'bg-green-500',
  cleaning: 'bg-cyan-500',
  maintenance: 'bg-orange-500',
  internet: 'bg-indigo-500',
  other: 'bg-gray-500',
};

const categoryLabels: Record<string, string> = {
  rent: 'Loyer',
  utilities: 'Charges',
  groceries: 'Courses',
  cleaning: 'Ménage',
  maintenance: 'Entretien',
  internet: 'Internet',
  other: 'Autre',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays}j`;

  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function CompactExpenseList({
  expenses,
  onExpenseClick,
  maxItems,
  showDate = true,
}: CompactExpenseListProps) {
  const displayExpenses = maxItems ? expenses.slice(0, maxItems) : expenses;

  if (displayExpenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-3 shadow-sm">
          <Receipt className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm font-medium text-gray-900 mb-1">Aucune dépense</p>
        <p className="text-xs text-gray-500">
          Scannez un ticket pour commencer
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {displayExpenses.map((expense, index) => (
        <motion.button
          key={expense.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.02 }}
          onClick={() => onExpenseClick(expense)}
          className="w-full p-2.5 flex items-center gap-2.5 rounded-xl transition-all duration-200 hover:bg-white active:scale-[0.99] text-left group"
        >
          {/* Category indicator */}
          <div className="relative flex-shrink-0">
            <div
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center',
                categoryColors[expense.category] || categoryColors.other
              )}
            >
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            {expense.receipt_image_url && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-gray-50 flex items-center justify-center">
                <Scan className="w-2 h-2 text-white" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {expense.title}
              </h4>
              <span className="text-sm font-semibold text-gray-900 tabular-nums flex-shrink-0">
                €{expense.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                <span className="truncate">{expense.paid_by_name}</span>
                {showDate && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="flex-shrink-0">{formatDate(expense.date)}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  className={cn(
                    'text-xs px-1.5 py-0.5 rounded font-medium',
                    'bg-orange-50 text-orange-600'
                  )}
                >
                  Ta part: €{(expense.your_share || 0).toFixed(0)}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

/**
 * Grouped expense list by time period (for history modal)
 */
interface GroupedExpenseListProps {
  expenses: ExpenseWithDetails[];
  onExpenseClick: (expense: ExpenseWithDetails) => void;
}

interface ExpenseGroup {
  label: string;
  expenses: ExpenseWithDetails[];
  total: number;
}

function groupExpensesByPeriod(expenses: ExpenseWithDetails[]): ExpenseGroup[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const groups: Record<string, ExpenseWithDetails[]> = {
    today: [],
    thisWeek: [],
    thisMonth: [],
    older: [],
  };

  expenses.forEach((expense) => {
    const expenseDate = new Date(expense.created_at);

    if (expenseDate >= today) {
      groups.today.push(expense);
    } else if (expenseDate >= startOfWeek) {
      groups.thisWeek.push(expense);
    } else if (expenseDate >= startOfMonth) {
      groups.thisMonth.push(expense);
    } else {
      groups.older.push(expense);
    }
  });

  const result: ExpenseGroup[] = [];

  if (groups.today.length > 0) {
    result.push({
      label: "Aujourd'hui",
      expenses: groups.today,
      total: groups.today.reduce((sum, e) => sum + e.amount, 0),
    });
  }

  if (groups.thisWeek.length > 0) {
    result.push({
      label: 'Cette semaine',
      expenses: groups.thisWeek,
      total: groups.thisWeek.reduce((sum, e) => sum + e.amount, 0),
    });
  }

  if (groups.thisMonth.length > 0) {
    result.push({
      label: 'Ce mois',
      expenses: groups.thisMonth,
      total: groups.thisMonth.reduce((sum, e) => sum + e.amount, 0),
    });
  }

  if (groups.older.length > 0) {
    result.push({
      label: 'Plus ancien',
      expenses: groups.older,
      total: groups.older.reduce((sum, e) => sum + e.amount, 0),
    });
  }

  return result;
}

export function GroupedExpenseList({
  expenses,
  onExpenseClick,
}: GroupedExpenseListProps) {
  const groups = useMemo(() => groupExpensesByPeriod(expenses), [expenses]);

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4 shadow-md">
          <Receipt className="w-7 h-7 text-white" />
        </div>
        <p className="text-sm font-semibold text-gray-900 mb-1">Aucune dépense</p>
        <p className="text-xs text-gray-500">
          Vos dépenses apparaîtront ici
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.label}>
          {/* Period header */}
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {group.label}
            </span>
            <span className="text-xs font-medium text-gray-400 tabular-nums">
              €{group.total.toFixed(0)}
            </span>
          </div>

          {/* Expenses */}
          <div className="bg-gray-50/50 rounded-xl p-1">
            <CompactExpenseList
              expenses={group.expenses}
              onExpenseClick={onExpenseClick}
              showDate={group.label !== "Aujourd'hui"}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
