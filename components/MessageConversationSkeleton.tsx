import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Skeleton for conversation list item
 */
export function ConversationListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 border-b">
      {/* Avatar */}
      <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />

      <div className="flex-1 space-y-2 min-w-0">
        {/* Name and timestamp */}
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-12" />
        </div>
        {/* Last message preview */}
        <Skeleton className="h-4 w-full" />
      </div>

      {/* Unread badge */}
      <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
    </div>
  );
}

/**
 * Skeleton for conversation list
 */
export function ConversationListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <Card>
      <CardContent className="p-0">
        {Array.from({ length: count }).map((_, i) => (
          <ConversationListItemSkeleton key={i} />
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton for message bubble
 */
export function MessageBubbleSkeleton({ isOwn = false }: { isOwn?: boolean }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />

        <div className="space-y-1 flex-1">
          {/* Message content */}
          <Skeleton className={`h-16 w-full rounded-lg ${isOwn ? 'rounded-tr-none' : 'rounded-tl-none'}`} />
          {/* Timestamp */}
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for message thread
 */
export function MessageThreadSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <MessageBubbleSkeleton key={i} isOwn={i % 3 === 0} />
      ))}
    </div>
  );
}
