'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { getTotalUnreadCount, subscribeToConversationList } from '@/lib/services/messaging-service';

interface MessagesIconWithBadgeProps {
  userId: string;
}

export default function MessagesIconWithBadge({ userId }: MessagesIconWithBadgeProps) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    // Initial load
    loadUnreadCount();

    // Subscribe to conversation updates for real-time count
    const cleanup = subscribeToConversationList(userId, loadUnreadCount);

    return cleanup;
  }, [userId]);

  const loadUnreadCount = async () => {
    const result = await getTotalUnreadCount(userId);
    if (result.success && result.data !== undefined) {
      setUnreadCount(result.data);
    }
  };

  return (
    <button
      onClick={() => router.push('/messages')}
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
      aria-label="Messages"
    >
      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}
