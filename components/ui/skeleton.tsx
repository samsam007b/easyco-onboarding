/**
 * Skeleton Component
 *
 * Loading placeholders for content that's being fetched.
 * Provides better UX than spinners by showing content structure.
 *
 * @example
 * ```tsx
 * // Basic skeleton
 * <Skeleton className="h-4 w-full" />
 *
 * // Avatar skeleton
 * <Skeleton variant="circular" className="w-12 h-12" />
 *
 * // Card skeleton
 * <SkeletonCard />
 *
 * // Property card skeleton
 * <SkeletonPropertyCard />
 * ```
 */

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'rectangular';
  animate?: boolean;
}

export function Skeleton({
  className,
  variant = 'default',
  animate = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-800',
        animate && 'animate-pulse',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-lg',
        variant === 'default' && 'rounded-md',
        className
      )}
      {...props}
    />
  );
}

/**
 * SkeletonText
 * Pre-styled skeleton for text content
 */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full' // Last line shorter
          )}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard
 * Generic card skeleton with image, title, and description
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('superellipse-xl border border-gray-200 bg-white p-4', className)}>
      {/* Image */}
      <Skeleton className="h-48 w-full mb-4" variant="rectangular" />

      {/* Title */}
      <Skeleton className="h-6 w-3/4 mb-3" />

      {/* Description lines */}
      <SkeletonText lines={3} />

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-8 w-24" variant="rectangular" />
        <Skeleton className="h-8 w-16" variant="rectangular" />
      </div>
    </div>
  );
}

/**
 * SkeletonPropertyCard
 * Skeleton specifically for property cards
 */
export function SkeletonPropertyCard({ className }: { className?: string }) {
  return (
    <div className={cn('superellipse-2xl border border-gray-200 bg-white overflow-hidden', className)}>
      {/* Property Image */}
      <Skeleton className="h-64 w-full" variant="rectangular" />

      <div className="p-6">
        {/* Title & Price */}
        <div className="flex items-start justify-between mb-4">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-8 w-20" variant="rectangular" />
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mb-4">
          <Skeleton variant="circular" className="h-4 w-4" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Match Score (if applicable) */}
        <div className="flex items-center gap-2 mb-4">
          <Skeleton variant="circular" className="h-5 w-5" />
          <Skeleton className="h-5 w-32" />
        </div>

        {/* Description */}
        <SkeletonText lines={2} className="mb-4" />

        {/* CTA Button */}
        <Skeleton className="h-11 w-full" variant="rectangular" />
      </div>
    </div>
  );
}

/**
 * SkeletonAvatar
 * Avatar with optional text
 */
export function SkeletonAvatar({
  withText = false,
  className,
}: {
  withText?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Skeleton variant="circular" className="h-10 w-10" />
      {withText && (
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      )}
    </div>
  );
}

/**
 * SkeletonTable
 * Table skeleton with rows and columns
 */
export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center gap-4 pb-3 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 flex-1" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex items-center gap-4 py-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * SkeletonList
 * List of items skeleton
 */
export function SkeletonList({
  items = 3,
  withAvatar = false,
  className,
}: {
  items?: number;
  withAvatar?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          {withAvatar && <Skeleton variant="circular" className="h-12 w-12 flex-shrink-0" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * SkeletonDashboard
 * Complete dashboard skeleton
 */
export function SkeletonDashboard({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-8', className)}>
      {/* Header */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="superellipse-xl border border-gray-200 bg-white p-6">
            <Skeleton className="h-4 w-20 mb-3" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main section */}
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-7 w-48 mb-4" />
          <SkeletonPropertyCard />
          <SkeletonPropertyCard />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Skeleton className="h-7 w-32 mb-4" />
          <SkeletonList items={5} withAvatar />
        </div>
      </div>
    </div>
  );
}

/**
 * SkeletonHeader
 * Page header skeleton
 */
export function SkeletonHeader({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      <Skeleton className="h-9 w-80" />
      <Skeleton className="h-5 w-96" />
      <div className="flex items-center gap-3 mt-6">
        <Skeleton className="h-10 w-32" variant="rectangular" />
        <Skeleton className="h-10 w-28" variant="rectangular" />
      </div>
    </div>
  );
}

/**
 * SkeletonGrid
 * Grid of cards
 */
export function SkeletonGrid({
  items = 6,
  columns = 3,
  cardType = 'default',
  className,
}: {
  items?: number;
  columns?: number;
  cardType?: 'default' | 'property';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid gap-6',
        columns === 2 && 'grid-cols-1 md:grid-cols-2',
        columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {Array.from({ length: items }).map((_, i) =>
        cardType === 'property' ? (
          <SkeletonPropertyCard key={i} />
        ) : (
          <SkeletonCard key={i} />
        )
      )}
    </div>
  );
}
