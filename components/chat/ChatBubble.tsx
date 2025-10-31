'use client';

import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Check, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  message: string;
  timestamp: string;
  isOwn: boolean;
  isRead?: boolean;
  senderName?: string;
  senderPhoto?: string | null;
  imageUrl?: string | null;
}

export function ChatBubble({
  message,
  timestamp,
  isOwn,
  isRead,
  senderName,
  senderPhoto,
  imageUrl,
}: ChatBubbleProps) {
  const formattedTime = formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <div className={cn('flex gap-3 mb-4', isOwn && 'flex-row-reverse')}>
      {/* Avatar */}
      {!isOwn && (
        <div className="flex-shrink-0">
          {senderPhoto ? (
            <img
              src={senderPhoto}
              alt={senderName || 'User'}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
              <span className="text-purple-700 text-sm font-semibold">
                {senderName?.charAt(0) || '?'}
              </span>
            </div>
          )}
        </div>
      )}

      <div className={cn('flex flex-col', isOwn ? 'items-end' : 'items-start', 'max-w-[70%]')}>
        {/* Sender name for received messages */}
        {!isOwn && senderName && (
          <span className="text-xs text-gray-600 mb-1 px-1">{senderName}</span>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-2 break-words',
            isOwn
              ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
          )}
        >
          {/* Image if present */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Attached"
              className="rounded-lg mb-2 max-w-full h-auto max-h-64 object-cover"
            />
          )}

          {/* Message text */}
          {message && <p className="text-sm whitespace-pre-wrap">{message}</p>}
        </div>

        {/* Timestamp and read status */}
        <div className="flex items-center gap-1 mt-1 px-1">
          <span className="text-xs text-gray-500">{formattedTime}</span>
          {isOwn && (
            <span className="text-gray-500">
              {isRead ? (
                <CheckCheck className="w-3 h-3 text-blue-500" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
