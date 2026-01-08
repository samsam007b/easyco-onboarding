import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconBgColor = 'bg-owner-100',
  iconColor = 'text-owner-600',
  className,
  onClick,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-white superellipse-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md',
        onClick && 'cursor-pointer hover:border-owner-300',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', iconBgColor)}>
            <Icon className={cn('w-5 h-5', iconColor)} />
          </div>
        )}
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
}
