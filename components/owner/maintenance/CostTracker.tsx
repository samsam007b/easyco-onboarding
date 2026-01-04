'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Euro,
  TrendingUp,
  TrendingDown,
  Minus,
  PieChart,
  BarChart3,
  Droplets,
  Zap,
  Flame,
  Lightbulb,
  Key,
  Paintbrush,
  Bug,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ownerGradient, semanticColors } from '@/lib/constants/owner-theme';
import type { TicketCategory } from './TicketKanbanBoard';

interface CategoryCost {
  category: TicketCategory;
  amount: number;
  ticketCount: number;
}

interface CostTrackerProps {
  currentMonthTotal: number;
  previousMonthTotal: number;
  budgetLimit?: number;
  costsByCategory: CategoryCost[];
  className?: string;
}

const categoryConfig: Record<TicketCategory, {
  icon: typeof Wrench;
  label: string;
  color: string;
  bgColor: string;
}> = {
  plumbing: {
    icon: Droplets,
    label: 'Plomberie',
    color: '#0ea5e9',
    bgColor: '#e0f2fe',
  },
  electrical: {
    icon: Zap,
    label: 'Électricité',
    color: '#f59e0b',
    bgColor: '#fef3c7',
  },
  heating: {
    icon: Flame,
    label: 'Chauffage',
    color: '#ef4444',
    bgColor: '#fee2e2',
  },
  appliance: {
    icon: Lightbulb,
    label: 'Électroménager',
    color: '#8b5cf6',
    bgColor: '#ede9fe',
  },
  locksmith: {
    icon: Key,
    label: 'Serrurerie',
    color: '#64748b',
    bgColor: '#f1f5f9',
  },
  painting: {
    icon: Paintbrush,
    label: 'Peinture',
    color: '#ec4899',
    bgColor: '#fce7f3',
  },
  pest: {
    icon: Bug,
    label: 'Nuisibles',
    color: '#84cc16',
    bgColor: '#ecfccb',
  },
  other: {
    icon: Wrench,
    label: 'Autre',
    color: '#9c5698',
    bgColor: '#fdf4ff',
  },
};

export function CostTracker({
  currentMonthTotal,
  previousMonthTotal,
  budgetLimit,
  costsByCategory,
  className,
}: CostTrackerProps) {
  // Calculate trend
  const trend = useMemo(() => {
    if (previousMonthTotal === 0) return { percent: 0, direction: 'stable' as const };
    const change = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
    return {
      percent: Math.abs(Math.round(change)),
      direction: change > 5 ? 'up' as const : change < -5 ? 'down' as const : 'stable' as const,
    };
  }, [currentMonthTotal, previousMonthTotal]);

  // Calculate budget usage
  const budgetUsage = budgetLimit ? (currentMonthTotal / budgetLimit) * 100 : 0;
  const isOverBudget = budgetUsage > 100;
  const isNearBudget = budgetUsage > 80 && budgetUsage <= 100;

  // Sort categories by cost (descending)
  const sortedCategories = useMemo(() => {
    return [...costsByCategory].sort((a, b) => b.amount - a.amount);
  }, [costsByCategory]);

  // Calculate max for bar visualization
  const maxAmount = Math.max(...costsByCategory.map(c => c.amount), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white/80 backdrop-blur-sm superellipse-2xl border border-gray-200 shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-sm"
            style={{ background: ownerGradient }}
          >
            <Euro className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Suivi des coûts</h3>
            <p className="text-sm text-gray-500">Ce mois-ci</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Main cost display */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-3xl font-bold" style={{ color: '#9c5698' }}>
              {currentMonthTotal.toLocaleString('fr-FR')}€
            </p>
            <div className="flex items-center gap-2 mt-1">
              {trend.direction === 'up' && (
                <span className="flex items-center gap-1 text-sm text-red-600">
                  <TrendingUp className="w-4 h-4" />
                  +{trend.percent}% vs mois dernier
                </span>
              )}
              {trend.direction === 'down' && (
                <span className="flex items-center gap-1 text-sm text-emerald-600">
                  <TrendingDown className="w-4 h-4" />
                  -{trend.percent}% vs mois dernier
                </span>
              )}
              {trend.direction === 'stable' && (
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Minus className="w-4 h-4" />
                  Stable vs mois dernier
                </span>
              )}
            </div>
          </div>

          {/* Budget gauge */}
          {budgetLimit && (
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Budget: {budgetLimit.toLocaleString('fr-FR')}€</p>
              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(budgetUsage, 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full",
                    isOverBudget ? "bg-red-500" :
                    isNearBudget ? "bg-amber-500" : "bg-emerald-500"
                  )}
                />
              </div>
              <p className={cn(
                "text-xs mt-1 font-medium",
                isOverBudget ? "text-red-600" :
                isNearBudget ? "text-amber-600" : "text-emerald-600"
              )}>
                {Math.round(budgetUsage)}% utilisé
              </p>
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <BarChart3 className="w-4 h-4" />
            <span>Par catégorie</span>
          </div>

          {sortedCategories.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <PieChart className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune dépense ce mois</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedCategories.map((item, index) => {
                const config = categoryConfig[item.category];
                const Icon = config.icon;
                const percentage = (item.amount / maxAmount) * 100;

                return (
                  <motion.div
                    key={item.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 superellipse-lg flex items-center justify-center"
                          style={{ backgroundColor: config.bgColor }}
                        >
                          <Icon className="w-4 h-4" style={{ color: config.color }} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {config.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({item.ticketCount} ticket{item.ticketCount > 1 ? 's' : ''})
                        </span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: config.color }}>
                        {item.amount.toLocaleString('fr-FR')}€
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6, delay: index * 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: config.color }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Previous month comparison */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Mois précédent</span>
            <span className="font-medium text-gray-700">
              {previousMonthTotal.toLocaleString('fr-FR')}€
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CostTracker;
