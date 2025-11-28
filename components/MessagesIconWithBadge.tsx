'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import { getTotalUnreadCount, subscribeToConversationList } from '@/lib/services/messaging-service';

interface MessagesIconWithBadgeProps {
  userId: string;
  role?: 'searcher' | 'owner' | 'resident';
}

export default function MessagesIconWithBadge({ userId, role }: MessagesIconWithBadgeProps) {
  const router = useRouter();
  const supabase = createClient();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [userRole, setUserRole] = useState<string | null>(role || null);

  useEffect(() => {
    // Update userRole when role prop changes
    if (role) {
      setUserRole(role);
    } else {
      // If role not provided, fetch it
      loadUserRole();
    }
  }, [role]);

  useEffect(() => {
    // Initial load
    loadUnreadCount();

    // Subscribe to conversation updates for real-time count
    const cleanup = subscribeToConversationList(userId, loadUnreadCount);

    return cleanup;
  }, [userId]);

  const loadUserRole = async () => {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', userId)
        .single();

      if (userData?.user_type) {
        setUserRole(userData.user_type);
      }
    } catch (error) {
      logger.error('Error loading user role', error);
    }
  };

  const loadUnreadCount = async () => {
    const result = await getTotalUnreadCount(userId);
    if (result.success && result.data !== undefined) {
      setUnreadCount(result.data);
    }
  };

  const getMessagesUrl = () => {
    // Route to role-specific messages page - no generic fallback
    switch (userRole) {
      case 'searcher':
        return '/dashboard/searcher/messages';
      case 'owner':
        return '/dashboard/owner/messages'; // Will be created later
      case 'resident':
        return '/dashboard/resident/messages';
      default:
        // Fallback to searcher if role not yet loaded
        return '/dashboard/searcher/messages';
    }
  };

  const handleClick = () => {
    const url = getMessagesUrl();
    router.push(url);
  };

  return (
    <button
      onClick={handleClick}
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
