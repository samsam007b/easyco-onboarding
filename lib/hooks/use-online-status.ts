'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface OnlineUser {
  userId: string;
  lastSeen: string;
}

/**
 * Hook to track and broadcast user online status using Supabase Realtime Presence
 * @param userId - The current user's ID
 * @returns Object containing online users set and utility functions
 */
export function useOnlineStatus(userId: string | null) {
  const supabase = createClient();
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Create a presence channel
    const presenceChannel = supabase.channel('online-users', {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    // Subscribe to presence events
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const online = new Set<string>();

        Object.keys(state).forEach((presenceId) => {
          const presences = state[presenceId] as unknown as OnlineUser[];
          presences.forEach((presence) => {
            online.add(presence.userId);
          });
        });

        setOnlineUsers(online);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        setOnlineUsers((prev) => {
          const updated = new Set(prev);
          (newPresences as unknown as OnlineUser[]).forEach((presence) => {
            updated.add(presence.userId);
          });
          return updated;
        });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        setOnlineUsers((prev) => {
          const updated = new Set(prev);
          (leftPresences as unknown as OnlineUser[]).forEach((presence) => {
            updated.delete(presence.userId);
          });
          return updated;
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track this user as online
          await presenceChannel.track({
            userId,
            lastSeen: new Date().toISOString(),
          });
        }
      });

    setChannel(presenceChannel);

    // Cleanup on unmount
    return () => {
      presenceChannel.untrack();
      presenceChannel.unsubscribe();
    };
  }, [userId, supabase]);

  // Check if a specific user is online
  const isUserOnline = useCallback(
    (targetUserId: string): boolean => {
      return onlineUsers.has(targetUserId);
    },
    [onlineUsers]
  );

  // Get all online users
  const getOnlineUsers = useCallback((): string[] => {
    return Array.from(onlineUsers);
  }, [onlineUsers]);

  // Get count of online users
  const getOnlineCount = useCallback((): number => {
    return onlineUsers.size;
  }, [onlineUsers]);

  return {
    onlineUsers,
    isUserOnline,
    getOnlineUsers,
    getOnlineCount,
    channel,
  };
}
