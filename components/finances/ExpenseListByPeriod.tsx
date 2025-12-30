/**
 * Expense List By Period - Fun & Colorful Design
 * Groups expenses by time period (today, this week, this month, older)
 * With animated cards, colorful gradients, and emojis
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
  Sparkles,
  Receipt,
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

const categoryEmojis: Record<string, string> = {
  rent: '🏠',
  utilities: '💡',
  groceries: '🛒',
  cleaning: '🧹',
  maintenance: '🔧',
  internet: '📶',
  other: '📦',
};

const categoryGradients: Record<string, { gradient: string; shadow: string }> = {
  rent: {
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    shadow: 'rgba(124, 58, 237, 0.4)',
  },
  utilities: {
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    shadow: 'rgba(59, 130, 246, 0.4)',
  },
  groceries: {
    gradient: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
    shadow: 'rgba(34, 197, 94, 0.4)',
  },
  cleaning: {
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
    shadow: 'rgba(6, 182, 212, 0.4)',
  },
  maintenance: {
    gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
    shadow: 'rgba(249, 115, 22, 0.4)',
  },
  internet: {
    gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
    shadow: 'rgba(99, 102, 241, 0.4)',
  },
  other: {
    gradient: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
    shadow: 'rgba(100, 116, 139, 0.4)',
  },
};

const periodEmojis: Record<string, string> = {
  today: '🌟',
  thisWeek: '📅',
  thisMonth: '🗓️',
  lastMonth: '⏪',
  older: '📚',
  all: '✨',
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
        className="text-center py-16 px-6"
      >
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-24 h-24 mx-auto mb-6"
        >
          {/* Animated glow rings */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              background: 'linear-gradient(135deg, #d9574f 0%, #ff8017 100%)',
            }}
          />
          <div
            className="relative w-full h-full rounded-3xl overflow-hidden flex items-center justify-center shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
              boxShadow: '0 12px 32px rgba(238, 87, 54, 0.4)',
            }}
          >
            <Receipt className="w-12 h-12 text-white" />
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          </div>
          {/* Floating sparkles */}
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-6 h-6 text-amber-400" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            Aucune dépense <span className="text-2xl">🧾</span>
          </p>
          <p className="text-gray-500">
            Scannez votre premier ticket pour commencer !
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {groupedExpenses.map((group, groupIndex) => {
        const periodEmoji = periodEmojis[group.label] || '📋';

        return (
          <motion.div
            key={group.label}
            variants={itemVariants}
          >
            {/* Period Header - Enhanced colorful design */}
            {showPeriodHeaders && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="flex items-center justify-between mb-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{periodEmoji}</span>
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    {group.labelFr}
                  </h4>
                  <Badge
                    className="text-xs border-none text-gray-600 bg-gray-100/80"
                  >
                    {group.expenses.length} dépense{group.expenses.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge
                    className="text-sm font-bold border-none text-white px-4 py-1.5 shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)',
                      boxShadow: '0 4px 12px rgba(238, 87, 54, 0.3)',
                    }}
                  >
                    €{group.total.toFixed(2)}
                  </Badge>
                </motion.div>
              </motion.div>
            )}

            {/* Expenses List */}
            <motion.div
              variants={containerVariants}
              className="space-y-3"
            >
              {group.expenses.map((expense) => {
                const catGradient = categoryGradients[expense.category] || categoryGradients.other;
                const catEmoji = categoryEmojis[expense.category] || '📦';

                return (
                  <motion.button
                    key={expense.id}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.02,
                      x: 6,
                      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onExpenseClick(expense)}
                    className="w-full group flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer text-left relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 50%, #fff5f3 100%)',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)',
                      border: '1px solid rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    {/* Hover gradient overlay */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, rgba(255, 255, 255, 0) 0%, ${catGradient.shadow.replace('0.4', '0.08')} 100%)`,
                      }}
                    />

                    <div className="flex items-center gap-4 flex-1 min-w-0 relative z-10">
                      {/* Category Icon - Uses category gradient */}
                      <motion.div
                        className="relative"
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        <div
                          className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-lg"
                          style={{
                            background: catGradient.gradient,
                            boxShadow: `0 8px 20px ${catGradient.shadow}`,
                          }}
                        >
                          <span className="text-2xl">{catEmoji}</span>
                        </div>
                        {/* OCR indicator badge */}
                        {expense.receipt_image_url && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-md"
                            style={{
                              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.5)',
                            }}
                          >
                            <Scan className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate text-base">{expense.title}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <span className="truncate">👤 {expense.paid_by_name}</span>
                          <span className="text-gray-300">•</span>
                          <span className="flex items-center gap-1 flex-shrink-0">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(expense.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </p>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <Badge
                            className="text-xs font-semibold border-none text-white px-2.5 py-1"
                            style={{
                              background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)',
                            }}
                          >
                            💰 Ta part: €{(expense.your_share || 0).toFixed(2)}
                          </Badge>
                          <Badge
                            className="text-xs border-none px-2.5 py-1"
                            style={{
                              background: `${catGradient.shadow.replace('0.4', '0.15')}`,
                              color: catGradient.shadow.replace('rgba', 'rgb').replace(', 0.4)', ')'),
                            }}
                          >
                            {catEmoji} {categoryLabels[expense.category] || expense.category}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4 flex-shrink-0 relative z-10">
                      <div className="text-right">
                        <motion.p
                          className="text-2xl font-black"
                          style={{
                            background: catGradient.gradient,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          €{expense.amount.toFixed(2)}
                        </motion.p>
                      </div>
                      <motion.div
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors"
                        whileHover={{ x: 3 }}
                      >
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </motion.div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
