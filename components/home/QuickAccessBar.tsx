'use client';

import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface QuickAccessItem {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  count?: number;
  hasNotification?: boolean;
}

interface QuickAccessBarProps {
  items: QuickAccessItem[];
  className?: string;
}

export function QuickAccessBar({ items, className }: QuickAccessBarProps) {
  return (
    <div
      className={cn(
        'flex gap-3 overflow-x-auto pb-2 scrollbar-hide',
        className
      )}
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <Button
            key={index}
            variant="outline"
            className="flex-shrink-0 superellipse-2xl px-6 py-6 hover:bg-searcher-50 hover:border-searcher-300 relative"
            onClick={item.onClick}
          >
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              <span className="font-semibold">{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 bg-searcher-100 text-searcher-700"
                >
                  {item.count}
                </Badge>
              )}
            </div>
            {item.hasNotification && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </Button>
        );
      })}
    </div>
  );
}
