/**
 * Expense List By Period
 * Groups expenses by time period (today, this week, this month, older)
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
} from 'lucide-react';
import type { ExpenseWithDetails } from '@/types/finances.types';

interface ExpenseListByPeriodProps {
  expenses: ExpenseWithDetails[];
  onExpenseClick: (expense: ExpenseWithDetails) => void;
  showPeriodHeaders?: boolean;
  maxItems?: number;
}

interface ExpenseGroup {
  label: string;
  labelFr: string;
  expenses: ExpenseWithDetails[];
  total: number;
}

const categoryLabels: Record<string, string> = {
  rent: 'Loyer',
  utilities: 'Charges',
  groceries: 'Courses',
  cleaning: 'Ménage',
  maintenance: 'Entretien',
  internet: 'Internet',
  other: 'Autre',
};

const categoryColors: Record<string, string> = {
  rent: 'bg-purple-500',
  utilities: 'bg-blue-500',
  groceries: 'bg-green-500',
  cleaning: 'bg-cyan-500',
  maintenance: 'bg-orange-500',
  internet: 'bg-indigo-500',
  other: 'bg-gray-500',
};

function groupExpensesByPeriod(expenses: ExpenseWithDetails[]): ExpenseGroup[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const groups: Record<string, ExpenseWithDetails[]> = {
    today: [],
    thisWeek: [],
    thisMonth: [],
    lastMonth: [],
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
    } else if (expenseDate >= startOfLastMonth) {
      groups.lastMonth.push(expense);
    } else {
      groups.older.push(expense);
    }
  });

  const result: ExpenseGroup[] = [];

  if (groups.today.length > 0) {
    result.push({
      label: 'today',
      labelFr: "Aujourd'hui",
      expenses: groups.today,
      total: groups.today.reduce((sum, e) => sum + e.amount, 0),
    });
  }

  if (groups.thisWeek.length > 0) {
    result.push({
      label: 'thisWeek',
      labelFr: 'Cette semaine',
      expenses: groups.thisWeek,
      total: groups.thisWeek.reduce((sum, e) => sum + e.amount, 0),
    });
  }

  if (groups.thisMonth.length > 0) {
    result.push({
      label: 'thisMonth',
      labelFr: 'Ce mois',
      expenses: groups.thisMonth,
      total: groups.thisMonth.reduce((sum, e) => sum + e.amount, 0),
    });
  }

  if (groups.lastMonth.length > 0) {
    const monthName = startOfLastMonth.toLocaleDateString('fr-FR', { month: 'long' });
    result.push({
      label: 'lastMonth',
      labelFr: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      expenses: groups.lastMonth,
      total: groups.lastMonth.reduce((sum, e) => sum + e.amount, 0),
    });
  }

  if (groups.older.length > 0) {
    result.push({
      label: 'older',
      labelFr: 'Plus ancien',
      expenses: groups.older,
      total: groups.older.reduce((sum, e) => sum + e.amount, 0),
    });
  }

  return result;
}

export default function ExpenseListByPeriod({
  expenses,
  onExpenseClick,
  showPeriodHeaders = true,
  maxItems,
}: ExpenseListByPeriodProps) {
  const groupedExpenses = useMemo(() => {
    if (!showPeriodHeaders) {
      // Return flat list
      const limitedExpenses = maxItems ? expenses.slice(0, maxItems) : expenses;
      return [{
        label: 'all',
        labelFr: 'Toutes les dépenses',
        expenses: limitedExpenses,
        total: limitedExpenses.reduce((sum, e) => sum + e.amount, 0),
      }];
    }
    return groupExpensesByPeriod(expenses);
  }, [expenses, showPeriodHeaders, maxItems]);

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div
          className="relative w-20 h-20 mx-auto mb-4 rounded-3xl overflow-hidden flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(217, 87, 79, 0.12) 0%, rgba(255, 128, 23, 0.2) 100%)',
          }}
        >
          <DollarSign className="w-10 h-10 relative z-10" style={{ color: '#ee5736' }} />
        </div>
        <p className="font-semibold text-gray-900 mb-2">Aucune dépense</p>
        <p className="text-sm text-gray-500">
          Scannez votre premier ticket pour commencer
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupedExpenses.map((group, groupIndex) => (
        <div key={group.label}>
          {/* Period Header */}
          {showPeriodHeaders && (
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                {group.labelFr}
              </h4>
              <Badge className="text-xs bg-gray-100 text-gray-700 border border-gray-200">
                €{group.total.toFixed(2)}
              </Badge>
            </div>
          )}

          {/* Expenses */}
          <div className="space-y-2">
            {group.expenses.map((expense, index) => (
              <motion.button
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (groupIndex * 0.1) + (index * 0.03) }}
                whileHover={{ scale: 1.01, x: 4 }}
                onClick={() => onExpenseClick(expense)}
                className="w-full group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-[#fff5f3] rounded-2xl hover:shadow-md transition-all cursor-pointer border border-gray-100 text-left"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Category Indicator */}
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{
                        background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)',
                      }}
                    >
                      <DollarSign className="w-6 h-6 text-white relative z-10" />
                    </div>
                    {/* Category dot */}
                    <div
                      className={cn(
                        'absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white',
                        categoryColors[expense.category] || 'bg-gray-500'
                      )}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{expense.title}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <span className="truncate">Payé par {expense.paid_by_name}</span>
                      <span>•</span>
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span className="flex-shrink-0">
                        {new Date(expense.date).toLocaleDateString('fr-FR')}
                      </span>
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Badge
                        className="text-xs border-none text-white"
                        style={{ background: 'rgba(217, 87, 79, 0.8)' }}
                      >
                        Ta part: €{(expense.your_share || 0).toFixed(2)}
                      </Badge>
                      {expense.receipt_image_url && (
                        <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                          <Scan className="w-3 h-3 mr-1 inline" />
                          OCR
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">€{expense.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">
                      {categoryLabels[expense.category] || expense.category}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
