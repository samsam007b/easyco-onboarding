import { Skeleton } from '@/components/ui/skeleton';

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white superellipse-2xl shadow-lg overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full rounded-none" />

      <div className="p-4 sm:p-6">
        {/* Title skeleton */}
        <div className="flex items-start justify-between mb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Location skeleton */}
        <Skeleton className="h-4 w-1/2 mb-4" />

        {/* Bed/Bath skeleton */}
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Price skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function PropertyCardsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
