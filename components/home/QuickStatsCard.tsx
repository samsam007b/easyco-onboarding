'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuickStatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: string;
  iconBgColor?: string;
  onClick?: () => void;
}

export function QuickStatsCard({
  icon: Icon,
  label,
  value,
  trend,
  gradient,
  iconBgColor = 'bg-owner-100',
  onClick,
}: QuickStatsCardProps) {
  return (
    <Card
      className={cn(
        'superellipse-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer',
        gradient,
        onClick && 'hover:scale-105'
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p
                className={cn(
                  'text-sm font-medium mt-2',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          <div className={cn('p-3 superellipse-xl', iconBgColor)}>
            <Icon className="h-6 w-6 text-owner-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
