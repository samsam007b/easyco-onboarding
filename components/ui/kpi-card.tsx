import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface KPICardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  badge?: string;
  badgeVariant?: 'success' | 'warning' | 'error' | 'info';
  className?: string;
  onClick?: () => void;
}

export function KPICard({
  title,
  value,
  trend,
  trendDirection = 'neutral',
  icon: Icon,
  badge,
  badgeVariant = 'info',
  className,
  onClick,
}: KPICardProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  const badgeColors = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <div
      className={cn(
        'bg-white superellipse-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md',
        onClick && 'cursor-pointer hover:border-owner-300',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {Icon && (
          <div className="w-12 h-12 bg-owner-100 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-owner-600" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {trend && (
          <span className={cn('text-sm font-semibold', trendColors[trendDirection])}>
            {trend}
          </span>
        )}
        {badge && (
          <span
            className={cn(
              'text-xs font-semibold px-2 py-1 rounded-full border',
              badgeColors[badgeVariant]
            )}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
