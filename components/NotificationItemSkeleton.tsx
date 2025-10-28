import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Skeleton for notification list item
 */
export function NotificationItemSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 border-b">
      {/* Icon */}
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />

      <div className="flex-1 space-y-2 min-w-0">
        {/* Title */}
        <Skeleton className="h-4 w-3/4" />
        {/* Description */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        {/* Timestamp */}
        <Skeleton className="h-3 w-24 mt-2" />
      </div>

      {/* Unread indicator */}
      <Skeleton className="h-2 w-2 rounded-full flex-shrink-0" />
    </div>
  );
}

/**
 * Skeleton for notification list
 */
export function NotificationListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <Card>
      <CardContent className="p-0">
        {Array.from({ length: count }).map((_, i) => (
          <NotificationItemSkeleton key={i} />
        ))}
      </CardContent>
    </Card>
  );
}
