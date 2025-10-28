import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Skeleton for user profile cards (dependent profiles, group members, etc.)
 */
export function ProfileCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <Skeleton className="h-12 w-12 rounded-full" />

          <div className="flex-1 space-y-2">
            {/* Name */}
            <Skeleton className="h-5 w-32" />
            {/* Role or status */}
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Badge or action */}
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Bio or description */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />

        {/* Tags or metadata */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>

        {/* Action button */}
        <Skeleton className="h-9 w-full mt-4" />
      </CardContent>
    </Card>
  );
}

/**
 * Grid of profile card skeletons
 */
export function ProfileCardsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProfileCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * List of profile card skeletons (for narrow layouts)
 */
export function ProfileCardsListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProfileCardSkeleton key={i} />
      ))}
    </div>
  );
}
