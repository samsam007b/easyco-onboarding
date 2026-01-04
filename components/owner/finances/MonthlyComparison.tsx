'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ownerGradient, semanticColors } from '@/lib/constants/owner-theme';

export interface MonthlyComparisonData {
  currentMonth: {
    collected: number;
    expected: number;
    label?: string;
  };
  previousMonth: {
    collected: number;
    expected: number;
    label?: string;
  };
  changePercent: number;
}

interface MonthlyComparisonProps {
  data: MonthlyComparisonData;
  className?: string;
}

export function MonthlyComparison({ data, className }: MonthlyComparisonProps) {
  const { currentMonth, previousMonth, changePercent } = data;

  const currentProgress = currentMonth.expected > 0
    ? Math.round((currentMonth.collected / currentMonth.expected) * 100)
    : 0;

  const previousProgress = previousMonth.expected > 0
    ? Math.round((previousMonth.collected / previousMonth.expected) * 100)
    : 0;

  const progressDiff = currentProgress - previousProgress;

  const getTrendIcon = () => {
    if (changePercent > 0) return TrendingUp;
    if (changePercent < 0) return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (changePercent > 0) return 'text-emerald-600';
    if (changePercent < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const TrendIcon = getTrendIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white/80 backdrop-blur-sm superellipse-2xl border border-gray-200 shadow-sm p-6',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-sm"
            style={{ background: ownerGradient }}
          >
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Comparaison mensuelle</h3>
            <p className="text-sm text-gray-500">Mois actuel vs precedent</p>
          </div>
        </div>

        {/* Global trend indicator */}
        <div
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
            changePercent > 0
              ? 'bg-emerald-100 text-emerald-700'
              : changePercent < 0
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-600'
          )}
        >
          <TrendIcon className="w-4 h-4" />
          {changePercent > 0 ? '+' : ''}{changePercent}%
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Current Month */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 superellipse-xl p-4 border border-purple-100">
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20" style={{ background: ownerGradient }} />

          <div className="relative">
            <p className="text-xs font-medium text-gray-500 mb-1">
              {currentMonth.label || 'Ce mois'}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {currentMonth.collected.toLocaleString()}e
            </p>
            <p className="text-sm text-gray-500 mt-1">
              sur {currentMonth.expected.toLocaleString()}e attendus
            </p>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">Progression</span>
                <span className="font-semibold" style={{ color: '#9c5698' }}>
                  {currentProgress}%
                </span>
              </div>
              <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(currentProgress, 100)}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{
                    background: currentProgress >= 90
                      ? semanticColors.success.gradient
                      : currentProgress >= 70
                      ? semanticColors.warning.gradient
                      : semanticColors.danger.gradient,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Previous Month */}
        <div className="relative overflow-hidden bg-gray-50 superellipse-xl p-4 border border-gray-200">
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gray-200 opacity-30" />

          <div className="relative">
            <p className="text-xs font-medium text-gray-500 mb-1">
              {previousMonth.label || 'Mois precedent'}
            </p>
            <p className="text-2xl font-bold text-gray-700">
              {previousMonth.collected.toLocaleString()}e
            </p>
            <p className="text-sm text-gray-500 mt-1">
              sur {previousMonth.expected.toLocaleString()}e attendus
            </p>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">Progression</span>
                <span className="font-semibold text-gray-600">
                  {previousProgress}%
                </span>
              </div>
              <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(previousProgress, 100)}%` }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="h-full rounded-full bg-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delta Summary */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Variation d'encaissement</span>
          <div className="flex items-center gap-4">
            {/* Amount difference */}
            <div
              className={cn(
                'flex items-center gap-1 text-sm font-medium',
                getTrendColor()
              )}
            >
              {changePercent > 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : changePercent < 0 ? (
                <ArrowDownRight className="w-4 h-4" />
              ) : null}
              {changePercent > 0 ? '+' : ''}
              {(currentMonth.collected - previousMonth.collected).toLocaleString()}e
            </div>

            {/* Progress difference */}
            {progressDiff !== 0 && (
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  progressDiff > 0
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                )}
              >
                {progressDiff > 0 ? '+' : ''}{progressDiff} pts
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
