'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface TypingUser {
  user_id: string;
  expires_at: string;
}

export function useTypingIndicator(conversationId: string) {
  const supabase = createClient();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const setTyping = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const expiresAt = new Date(Date.now() + 5000); // 5 seconds

      await supabase.from('typing_indicators').upsert(
        {
          conversation_id: conversationId,
          user_id: user.id,
          expires_at: expiresAt.toISOString(),
        },
        {
          onConflict: 'conversation_id,user_id',
        }
      );

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Auto-remove after 5 seconds
      timeoutRef.current = setTimeout(() => {
        clearTyping();
      }, 5000);
    } catch (err) {
      console.error('Error setting typing indicator:', err);
    }
  }, [conversationId]);

  const clearTyping = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await supabase
        .from('typing_indicators')
        .delete()
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } catch (err) {
      console.error('Error clearing typing indicator:', err);
    }
  }, [conversationId]);

  useEffect(() => {
    const loadTypingUsers = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
          .from('typing_indicators')
          .select('user_id, expires_at')
          .eq('conversation_id', conversationId)
          .neq('user_id', user.id)
          .gt('expires_at', new Date().toISOString());

        if (error) throw error;

        setTypingUsers((data || []).map((t: TypingUser) => t.user_id));
      } catch (err) {
        console.error('Error loading typing users:', err);
      }
    };

    loadTypingUsers();

    // Subscribe to typing indicator changes
    channelRef.current = supabase
      .channel(`typing:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          loadTypingUsers();
        }
      )
      .subscribe();

    // Clean up expired indicators periodically
    const cleanupInterval = setInterval(() => {
      setTypingUsers((prev) => {
        // This will be refreshed by realtime, but we can also clean locally
        return prev;
      });
    }, 1000);

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      clearInterval(cleanupInterval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [conversationId]);

  return {
    typingUsers,
    setTyping,
    clearTyping,
    isTyping: typingUsers.length > 0,
  };
}
