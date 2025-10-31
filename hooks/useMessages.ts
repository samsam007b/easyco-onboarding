'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  image_url?: string | null;
  image_width?: number | null;
  image_height?: number | null;
  read_by_recipient: boolean;
  read_at?: string | null;
  created_at: string;
  metadata?: any;
}

export interface UseMessagesOptions {
  conversationId: string;
  enabled?: boolean;
}

export function useMessages({ conversationId, enabled = true }: UseMessagesOptions) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const loadMessages = async () => {
    if (!enabled || !conversationId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      setMessages(data || []);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (
    content: string,
    options?: {
      messageType?: string;
      imageUrl?: string;
      metadata?: any;
    }
  ) => {
    try {
      setSending(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data: messageId, error: sendError } = await supabase.rpc('send_message', {
        p_conversation_id: conversationId,
        p_sender_id: user.id,
        p_content: content,
        p_message_type: options?.messageType || 'text',
        p_metadata: options?.metadata || {},
        p_image_url: options?.imageUrl || null,
      });

      if (sendError) throw sendError;

      // Update conversation's last_message
      await supabase
        .from('conversations')
        .update({
          last_message_text: content,
          last_message_at: new Date().toISOString(),
        })
        .eq('id', conversationId);

      return messageId;
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await supabase.rpc('mark_conversation_read', {
        p_conversation_id: conversationId,
        p_user_id: user.id,
      });
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (deleteError) throw deleteError;
    } catch (err) {
      console.error('Error deleting message:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (!enabled || !conversationId) return;

    loadMessages();

    // Subscribe to new messages in this conversation
    channelRef.current = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === payload.new.id ? (payload.new as Message) : msg))
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [conversationId, enabled]);

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage,
    markAsRead,
    deleteMessage,
    refresh: loadMessages,
  };
}
