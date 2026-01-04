'use client';

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ownerGradient,
  ownerGradientLight,
  semanticColors,
  ownerAnimations,
} from '@/lib/constants/owner-theme';

type KPIVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface OwnerKPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: KPIVariant;
  subtext?: string;
  change?: {
    value: number;
    label?: string;
  };
  onClick?: () => void;
  badge?: {
    label: string;
    variant?: 'default' | 'success' | 'warning' | 'danger';
  };
  className?: string;
}

const variantStyles: Record<KPIVariant, { gradient: string; bgGradient: string; textColor: string }> = {
  primary: {
    gradient: ownerGradient,
    bgGradient: ownerGradientLight,
    textColor: '#9c5698',
  },
  success: {
    gradient: semanticColors.success.gradient,
    bgGradient: semanticColors.success.light,
    textColor: semanticColors.success.text,
  },
  warning: {
    gradient: semanticColors.warning.gradient,
    bgGradient: semanticColors.warning.light,
    textColor: semanticColors.warning.text,
  },
  danger: {
    gradient: semanticColors.danger.gradient,
    bgGradient: semanticColors.danger.light,
    textColor: semanticColors.danger.text,
  },
  info: {
    gradient: semanticColors.info.gradient,
    bgGradient: semanticColors.info.light,
    textColor: semanticColors.info.text,
  },
};

const badgeVariantStyles = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
};

export function OwnerKPICard({
  title,
  value,
  icon: Icon,
  variant = 'primary',
  subtext,
  change,
  onClick,
  badge,
  className,
}: OwnerKPICardProps) {
  const styles = variantStyles[variant];
  const isClickable = !!onClick;

  return (
    <motion.div
      {...ownerAnimations.fadeInUp}
      whileHover={isClickable ? { scale: 1.02, y: -2 } : undefined}
      whileTap={isClickable ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden superellipse-2xl p-5 border border-gray-200 shadow-sm',
        isClickable && 'cursor-pointer',
        className
      )}
      style={{ background: styles.bgGradient }}
    >
      {/* Decorative circle */}
      <div
        className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-15"
        style={{ background: styles.gradient }}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          {/* Title with optional badge */}
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {badge && (
              <span
                className={cn(
                  'px-2 py-0.5 text-xs font-medium rounded-full',
                  badgeVariantStyles[badge.variant || 'default']
                )}
              >
                {badge.label}
              </span>
            )}
          </div>

          {/* Value */}
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {value}
          </p>

          {/* Subtext or Change indicator */}
          {(subtext || change) && (
            <div className="mt-2 flex items-center gap-2">
              {change && (
                <div
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    change.value >= 0 ? 'text-emerald-600' : 'text-red-600'
                  )}
                >
                  {change.value >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {change.value >= 0 ? '+' : ''}
                    {change.value}%
                  </span>
                </div>
              )}
              {subtext && (
                <span className="text-sm text-gray-500">{subtext}</span>
              )}
            </div>
          )}
        </div>

        {/* Icon */}
        <div
          className="w-12 h-12 superellipse-xl flex items-center justify-center flex-shrink-0"
          style={{ background: styles.gradient }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

// Grid wrapper for KPI cards
interface OwnerKPIGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function OwnerKPIGrid({ children, columns = 4, className }: OwnerKPIGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {children}
    </div>
  );
}
