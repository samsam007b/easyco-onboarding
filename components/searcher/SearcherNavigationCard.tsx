'use client';

import { motion } from 'framer-motion';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { searcherGradientVibrant, searcherGradientLight, searcherAnimations } from '@/lib/constants/searcher-theme';

interface StatItem {
  label: string;
  value: string | number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

interface SearcherNavigationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  stats?: StatItem[];
  badge?: {
    count: number;
    variant?: 'default' | 'warning' | 'danger';
  };
  actionLabel?: string;
  className?: string;
}

const statVariantStyles = {
  default: 'text-gray-900',
  success: 'text-emerald-600',
  warning: 'text-amber-600',
  danger: 'text-red-600',
};

const badgeVariantStyles = {
  default: 'bg-gray-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

export function SearcherNavigationCard({
  title,
  description,
  icon: Icon,
  href,
  stats,
  badge,
  actionLabel = 'Voir',
  className,
}: SearcherNavigationCardProps) {
  const router = useRouter();

  return (
    <motion.div
      {...searcherAnimations.fadeInUp}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(href)}
      className={cn(
        'relative overflow-hidden superellipse-2xl p-6 border border-gray-200 shadow-sm cursor-pointer bg-white/80 backdrop-blur-sm',
        'hover:shadow-lg hover:border-searcher-200 transition-all duration-300',
        className
      )}
    >
      {/* Badge indicator */}
      {badge && badge.count > 0 && (
        <div
          className={cn(
            'absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg',
            badgeVariantStyles[badge.variant || 'default']
          )}
        >
          {badge.count}
        </div>
      )}

      {/* Decorative gradient */}
      <div
        className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-10"
        style={{ background: searcherGradientVibrant }}
      />

      <div className="relative">
        {/* Icon */}
        <div
          className="w-14 h-14 superellipse-2xl flex items-center justify-center mb-4 shadow-md"
          style={{ background: searcherGradientVibrant }}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-sm">
                <span className={cn('font-semibold', statVariantStyles[stat.variant || 'default'])}>
                  {stat.value}
                </span>
                <span className="text-gray-500 ml-1">{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action */}
        <div
          className="inline-flex items-center gap-2 text-sm font-medium"
          style={{ color: '#FFA040' }}
        >
          {actionLabel}
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}

// Grid wrapper
interface SearcherNavigationGridProps {
  children: React.ReactNode;
  className?: string;
}

export function SearcherNavigationGrid({ children, className }: SearcherNavigationGridProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {children}
    </div>
  );
}
