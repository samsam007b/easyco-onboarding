'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  attachment_url?: string | null;
  attachment_type?: string | null;
  attachment_size?: number | null;
  attachment_name?: string | null;
  message_type?: 'text' | 'image' | 'file' | 'system';
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message_text: string | null;
  last_message_at: string | null;
  last_message_sender_id: string | null;
  created_at: string;
  updated_at: string;
  other_user?: {
    id: string;
    full_name: string;
    email: string;
    user_type: string;
  };
  unread_count?: number;
}

export function useMessages(userId?: string) {
  const supabase = createClient();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Load all conversations for the user
  const loadConversations = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Enrich conversations with other user info
      const enrichedConversations = await Promise.all(
        (data || []).map(async (conv) => {
          const otherUserId = conv.participant1_id === userId ? conv.participant2_id : conv.participant1_id;

          const { data: userData } = await supabase
            .from('users')
            .select('id, full_name, email, user_type')
            .eq('id', otherUserId)
            .single();

          // Get unread count
          const { data: readStatus } = await supabase
            .from('conversation_read_status')
            .select('last_read_at')
            .eq('conversation_id', conv.id)
            .eq('user_id', userId)
            .single();

          let unreadCount = 0;
          if (readStatus?.last_read_at) {
            const { count } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conv.id)
              .neq('sender_id', userId)
              .gt('created_at', readStatus.last_read_at);

            unreadCount = count || 0;
          } else {
            // No read status = all messages are unread
            const { count } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conv.id)
              .neq('sender_id', userId);

            unreadCount = count || 0;
          }

          return {
            ...conv,
            other_user: userData || undefined,
            unread_count: unreadCount,
          };
        })
      );

      setConversations(enrichedConversations);
    } catch (error: any) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Mark conversation as read
  const markConversationAsRead = useCallback(
    async (conversationId: string) => {
      if (!userId) return;

      try {
        const { error } = await supabase
          .from('conversation_read_status')
          .upsert({
            conversation_id: conversationId,
            user_id: userId,
            last_read_at: new Date().toISOString(),
          });

        if (error) throw error;

        // Refresh conversations to update unread count
        await loadConversations();
      } catch (error: any) {
        console.error('Error marking as read:', error);
      }
    },
    [userId, loadConversations]
  );

  // Load messages for a specific conversation
  const loadMessages = useCallback(
    async (conversationId: string) => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        setMessages(data || []);

        // Mark conversation as read
        await markConversationAsRead(conversationId);
      } catch (error: any) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      }
    },
    [markConversationAsRead]
  );

  // Send a new message
  const sendMessage = useCallback(
    async (conversationId: string, content: string): Promise<boolean> => {
      if (!userId || !content.trim()) {
        return false;
      }

      try {
        const { error } = await supabase.from('messages').insert({
          conversation_id: conversationId,
          sender_id: userId,
          content: content.trim(),
        });

        if (error) throw error;

        return true;
      } catch (error: any) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
        return false;
      }
    },
    [userId]
  );

  // Send a message with attachment
  const sendMessageWithAttachment = useCallback(
    async (
      conversationId: string,
      content: string,
      attachmentUrl: string,
      attachmentType: string,
      attachmentSize: number,
      attachmentName: string
    ): Promise<boolean> => {
      if (!userId) {
        return false;
      }

      try {
        const messageType = attachmentType.startsWith('image/') ? 'image' : 'file';

        const { error } = await supabase.from('messages').insert({
          conversation_id: conversationId,
          sender_id: userId,
          content: content.trim() || attachmentName, // Use filename if no caption
          message_type: messageType,
          attachment_url: attachmentUrl,
          attachment_type: attachmentType,
          attachment_size: attachmentSize,
          attachment_name: attachmentName,
        });

        if (error) throw error;

        return true;
      } catch (error: any) {
        console.error('Error sending message with attachment:', error);
        toast.error('Failed to send message');
        return false;
      }
    },
    [userId]
  );

  // Create or get existing conversation with another user
  const getOrCreateConversation = useCallback(
    async (otherUserId: string): Promise<string | null> => {
      if (!userId) return null;

      try {
        // Ensure participant1 < participant2 for consistency
        const [participant1, participant2] =
          userId < otherUserId ? [userId, otherUserId] : [otherUserId, userId];

        // Try to find existing conversation
        const { data: existing } = await supabase
          .from('conversations')
          .select('id')
          .eq('participant1_id', participant1)
          .eq('participant2_id', participant2)
          .single();

        if (existing) {
          return existing.id;
        }

        // Create new conversation
        const { data: newConv, error } = await supabase
          .from('conversations')
          .insert({
            participant1_id: participant1,
            participant2_id: participant2,
          })
          .select('id')
          .single();

        if (error) throw error;

        // Reload conversations
        await loadConversations();

        return newConv.id;
      } catch (error: any) {
        console.error('Error creating conversation:', error);
        toast.error('Failed to start conversation');
        return null;
      }
    },
    [userId, loadConversations]
  );

  // Subscribe to real-time updates for a conversation
  const subscribeToConversation = useCallback(
    (conversationId: string) => {
      if (!conversationId) return;

      // Unsubscribe from previous channel if exists
      if (channel) {
        supabase.removeChannel(channel);
      }

      // Subscribe to new messages in this conversation
      const newChannel = supabase
        .channel(`conversation:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            const newMessage = payload.new as Message;
            setMessages((prev) => [...prev, newMessage]);
          }
        )
        .subscribe();

      setChannel(newChannel);
    },
    [channel]
  );

  // Unsubscribe from real-time updates
  const unsubscribeFromConversation = useCallback(() => {
    if (channel) {
      supabase.removeChannel(channel);
      setChannel(null);
    }
  }, [channel]);

  // Initial load
  useEffect(() => {
    loadConversations();

    // Cleanup on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [loadConversations, channel]);

  return {
    conversations,
    messages,
    isLoading,
    loadConversations,
    loadMessages,
    sendMessage,
    sendMessageWithAttachment,
    getOrCreateConversation,
    markConversationAsRead,
    subscribeToConversation,
    unsubscribeFromConversation,
  };
}
