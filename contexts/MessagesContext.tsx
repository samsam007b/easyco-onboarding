'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { useAuth } from '@/lib/contexts/auth-context';
import {
  Message,
  Conversation,
  ConversationWithDetails,
  ConversationParticipant,
  MessagesContextValue,
  CreateConversationParams,
  SendMessageParams,
} from '@/types/message.types';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';

const MessagesContext = createContext<MessagesContextValue | undefined>(undefined);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const supabase = createClient();

  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationWithDetails | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load all conversations for current user
  const loadConversations = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Get conversations where user is a participant
      const { data: participantsData, error: participantsError } = await supabase
        .from('conversation_participants')
        .select(`
          *,
          conversation:conversations (
            id,
            created_at,
            updated_at,
            subject,
            property_id,
            last_message_at
          )
        `)
        .eq('user_id', user.id)
        .eq('is_archived', false);

      if (participantsError) throw participantsError;

      if (!participantsData || participantsData.length === 0) {
        setConversations([]);
        setUnreadCount(0);
        return;
      }

      // Get all conversation IDs
      const conversationIds = participantsData.map((p: any) => p.conversation_id);

      // Get all participants for these conversations
      const { data: allParticipants } = await supabase
        .from('conversation_participants')
        .select(`
          *,
          user:users (
            id,
            full_name,
            avatar_url,
            user_type,
            email
          )
        `)
        .in('conversation_id', conversationIds);

      // Get last message for each conversation
      const { data: lastMessages } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey (
            id,
            full_name,
            avatar_url,
            user_type
          )
        `)
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false });

      // Build conversations with details
      const conversationsWithDetails: ConversationWithDetails[] = participantsData.map((p: any) => {
        const conv = p.conversation;
        const convParticipants = allParticipants?.filter((ap: any) => ap.conversation_id === conv.id) || [];
        const otherParticipant = convParticipants.find((cp: any) => cp.user_id !== user.id);
        const lastMessage = lastMessages?.find((m: any) => m.conversation_id === conv.id);

        // Calculate unread count
        const unread = lastMessages?.filter((m: any) =>
          m.conversation_id === conv.id &&
          m.sender_id !== user.id &&
          new Date(m.created_at) > new Date(p.last_read_at)
        ).length || 0;

        return {
          ...conv,
          participants: convParticipants,
          other_participant: otherParticipant,
          last_message: lastMessage,
          unread_count: unread,
        };
      });

      // Sort by last message time
      conversationsWithDetails.sort((a, b) =>
        new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      );

      setConversations(conversationsWithDetails);

      // Calculate total unread
      const totalUnread = conversationsWithDetails.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
      setUnreadCount(totalUnread);

    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error(getHookTranslation('conversations', 'loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);

  // Load specific conversation with all messages
  const loadConversation = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      // Get conversation details
      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (convError) throw convError;

      // Get all participants
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select(`
          *,
          user:users (
            id,
            full_name,
            avatar_url,
            user_type,
            email
          )
        `)
        .eq('conversation_id', conversationId);

      // Get all messages
      const { data: messages } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey (
            id,
            full_name,
            avatar_url,
            user_type
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      const otherParticipant = participants?.find((p: any) => p.user_id !== user.id);

      const conversationWithDetails: ConversationWithDetails = {
        ...conv,
        participants: participants || [],
        other_participant: otherParticipant,
        messages: messages || [],
      };

      setActiveConversation(conversationWithDetails);

      // Mark as read
      await markAsRead(conversationId);

    } catch (error) {
      console.error('Error loading conversation:', error);
      toast.error(getHookTranslation('conversations', 'loadConversationFailed'));
    }
  }, [user, supabase]);

  // Send a message
  const sendMessage = useCallback(async (params: SendMessageParams): Promise<Message | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: params.conversation_id,
          sender_id: user.id,
          content: params.content,
          attachments: params.attachments || null,
          message_type: params.message_type || 'text',
        })
        .select(`
          *,
          sender:users!messages_sender_id_fkey (
            id,
            full_name,
            avatar_url,
            user_type
          )
        `)
        .single();

      if (error) throw error;

      // Update active conversation if it's the same
      if (activeConversation?.id === params.conversation_id) {
        setActiveConversation({
          ...activeConversation,
          messages: [...(activeConversation.messages || []), data],
        });
      }

      // Reload conversations to update last message
      loadConversations();

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(getHookTranslation('conversations', 'sendFailed'));
      return null;
    }
  }, [user, supabase, activeConversation, loadConversations]);

  // Create a new conversation
  const createConversation = useCallback(async (params: CreateConversationParams): Promise<Conversation | null> => {
    if (!user) return null;

    try {
      // Create conversation
      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .insert({
          subject: params.subject,
          property_id: params.property_id,
        })
        .select()
        .single();

      if (convError) throw convError;

      // Add participants (including current user)
      const participantInserts = [user.id, ...params.participant_user_ids].map(userId => ({
        conversation_id: conv.id,
        user_id: userId,
      }));

      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert(participantInserts);

      if (participantsError) throw participantsError;

      // Send initial message if provided
      if (params.initial_message) {
        await sendMessage({
          conversation_id: conv.id,
          content: params.initial_message,
        });
      }

      // Reload conversations
      await loadConversations();

      toast.success(getHookTranslation('conversations', 'created'));
      return conv;

    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error(getHookTranslation('conversations', 'createFailed'));
      return null;
    }
  }, [user, supabase, sendMessage, loadConversations]);

  // Mark conversation as read
  const markAsRead = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id);

      // Update local state
      setConversations(prev => prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, unread_count: 0 }
          : conv
      ));

      // Recalculate total unread
      const totalUnread = conversations.reduce((sum, conv) =>
        conv.id === conversationId ? sum : sum + (conv.unread_count || 0), 0
      );
      setUnreadCount(totalUnread);

    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }, [user, supabase, conversations]);

  // Archive conversation
  const archiveConversation = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('conversation_participants')
        .update({ is_archived: true })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id);

      // Remove from local state
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));

      if (activeConversation?.id === conversationId) {
        setActiveConversation(null);
      }

      toast.success(getHookTranslation('conversations', 'archived'));
    } catch (error) {
      console.error('Error archiving conversation:', error);
      toast.error(getHookTranslation('conversations', 'archiveFailed'));
    }
  }, [user, supabase, activeConversation]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as Message;

          // Update active conversation if match
          if (activeConversation?.id === newMessage.conversation_id) {
            loadConversation(newMessage.conversation_id);
          }

          // Reload conversations list
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase, activeConversation, loadConversation, loadConversations]);

  // Load conversations on mount
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, loadConversations]);

  const value: MessagesContextValue = {
    conversations,
    activeConversation,
    unreadCount,
    isLoading,
    loadConversations,
    loadConversation,
    sendMessage,
    createConversation,
    markAsRead,
    archiveConversation,
    setActiveConversation,
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
}
