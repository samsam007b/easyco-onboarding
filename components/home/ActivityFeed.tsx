'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ActivityItem {
  id: string;
  icon: LucideIcon;
  iconBgColor: string;
  title: string;
  subtitle: string;
  time: string;
  onClick?: () => void;
}

interface ActivityFeedProps {
  title?: string;
  activities: ActivityItem[];
  maxItems?: number;
}

export function ActivityFeed({
  title = 'Recent Activity',
  activities,
  maxItems = 5,
}: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedActivities.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No recent activity</p>
          ) : (
            displayedActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className={cn(
                    'flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors',
                    activity.onClick && 'cursor-pointer'
                  )}
                  onClick={activity.onClick}
                >
                  <div className={cn('p-2 rounded-lg', activity.iconBgColor)}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600 truncate">{activity.subtitle}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
