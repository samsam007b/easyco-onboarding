/**
 * useMessagesOptimized - Hook optimisé pour la messagerie
 *
 * OPTIMISATIONS vs MessagesContext :
 * 1. Requêtes parallèles (3 max au lieu de séquentielles)
 * 2. Utilise RPC get_unread_count() au lieu de calculer côté client
 * 3. Debouncing real-time (500ms) pour éviter requêtes en rafale
 * 4. useMemo/useCallback pour éviter re-renders inutiles
 * 5. Ne charge QUE le dernier message (pas tous les messages de toutes les conversations)
 *
 * PERFORMANCE GAIN ESTIMÉ :
 * - AVANT : 10 conversations = 20-30 requêtes (1-2 sec de chargement)
 * - APRÈS : 10 conversations = 3 requêtes parallèles (200-500ms)
 * - Réduction : -70% de requêtes DB, -75% de latence
 *
 * COMPATIBILITÉ :
 * - Même interface que MessagesContext
 * - Utilise le bon schéma DB (conversation_participants)
 * - Drop-in replacement pour MessagesProvider
 */

'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';
import type {
  Message,
  Conversation,
  ConversationWithDetails,
  SendMessageParams,
  CreateConversationParams,
} from '@/types/message.types';

export interface UseMessagesOptimizedReturn {
  conversations: ConversationWithDetails[];
  activeConversation: ConversationWithDetails | null;
  unreadCount: number;
  isLoading: boolean;
  loadConversations: () => Promise<void>;
  loadConversation: (conversationId: string) => Promise<void>;
  sendMessage: (params: SendMessageParams) => Promise<Message | null>;
  createConversation: (params: CreateConversationParams) => Promise<Conversation | null>;
  markAsRead: (conversationId: string) => Promise<void>;
  archiveConversation: (conversationId: string) => Promise<void>;
  setActiveConversation: (conv: ConversationWithDetails | null) => void;
}

export function useMessagesOptimized(userId: string | undefined): UseMessagesOptimizedReturn {
  const supabase = createClient();

  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationWithDetails | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Debounce timer pour real-time updates
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // LOAD CONVERSATIONS - OPTIMIZED (3 parallel queries max)
  // ============================================================================
  const loadConversations = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // ========================================================================
      // QUERY 1: Get user's conversations (with JOIN to conversations table)
      // ========================================================================
      const { data: participantsData, error: participantsError } = await supabase
        .from('conversation_participants')
        .select(`
          *,
          conversation:conversations (
            id,
            type,
            name,
            description,
            property_id,
            avatar_url,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId)
        .eq('is_archived', false);

      if (participantsError) throw participantsError;

      if (!participantsData || participantsData.length === 0) {
        setConversations([]);
        setUnreadCount(0);
        setIsLoading(false);
        return;
      }

      // Extract conversation IDs
      const conversationIds = participantsData.map((p: any) => p.conversation_id);

      // ========================================================================
      // QUERIES 2, 3, 4 in PARALLEL (instead of sequential)
      // ========================================================================
      const [allParticipantsResult, lastMessagesResult, unreadCountsResult] = await Promise.all([
        // Query 2: Get ALL participants for these conversations
        supabase
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
          .in('conversation_id', conversationIds),

        // Query 3: Get ONLY last message for each conversation (OPTIMIZED)
        // BEFORE: fetched ALL messages (.select('*'))
        // AFTER: fetch only 1 message per conversation (window function)
        supabase.rpc('get_last_messages_for_conversations', {
          p_conversation_ids: conversationIds,
        }),

        // Query 4: Get unread counts using RPC function (OPTIMIZED)
        // BEFORE: calculated client-side by looping through ALL messages
        // AFTER: use database function with proper indexing
        supabase.rpc('get_unread_count', {
          target_user_id: userId,
        }),
      ]);

      if (allParticipantsResult.error) throw allParticipantsResult.error;

      // ========================================================================
      // BUILD CONVERSATIONS WITH DETAILS (O(N) complexity, not O(N²))
      // ========================================================================

      // Create lookup maps for O(1) access (instead of .find() = O(N))
      const lastMessagesMap = new Map(
        (lastMessagesResult.data || []).map((msg: any) => [msg.conversation_id, msg])
      );

      const unreadCountsMap = new Map(
        (unreadCountsResult.data || []).map((item: any) => [item.conversation_id, item.unread_count])
      );

      // Group participants by conversation
      const participantsByConversation = new Map<string, any[]>();
      (allParticipantsResult.data || []).forEach((p: any) => {
        if (!participantsByConversation.has(p.conversation_id)) {
          participantsByConversation.set(p.conversation_id, []);
        }
        participantsByConversation.get(p.conversation_id)!.push(p);
      });

      // Build enriched conversations
      const conversationsWithDetails: ConversationWithDetails[] = participantsData.map((p: any) => {
        const conv = p.conversation;
        const convParticipants = participantsByConversation.get(conv.id) || [];
        const otherParticipant = convParticipants.find((cp: any) => cp.user_id !== userId);
        const lastMessage = lastMessagesMap.get(conv.id);
        const unread = unreadCountsMap.get(conv.id) || 0;

        return {
          ...conv,
          participants: convParticipants,
          other_participant: otherParticipant,
          last_message: lastMessage,
          unread_count: unread,
        };
      });

      // Sort by last message time (most recent first)
      conversationsWithDetails.sort((a, b) => {
        const aTime = a.last_message?.created_at || a.updated_at;
        const bTime = b.last_message?.created_at || b.updated_at;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });

      setConversations(conversationsWithDetails);

      // Calculate total unread
      const totalUnread = conversationsWithDetails.reduce(
        (sum, conv) => sum + (conv.unread_count || 0),
        0
      );
      setUnreadCount(totalUnread);

    } catch (error) {
      console.error('[useMessagesOptimized] Error loading conversations:', error);
      toast.error(getHookTranslation('conversations', 'loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [userId, supabase]);

  // ============================================================================
  // LOAD CONVERSATION - Get all messages for specific conversation
  // ============================================================================
  const loadConversation = useCallback(
    async (conversationId: string) => {
      if (!userId) return;

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

        // Get all messages (only for active conversation)
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

        const otherParticipant = participants?.find((p: any) => p.user_id !== userId);

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
        console.error('[useMessagesOptimized] Error loading conversation:', error);
        toast.error(getHookTranslation('conversations', 'loadConversationFailed'));
      }
    },
    [userId, supabase]
  );

  // ============================================================================
  // SEND MESSAGE
  // ============================================================================
  const sendMessage = useCallback(
    async (params: SendMessageParams): Promise<Message | null> => {
      if (!userId) return null;

      try {
        const { data, error } = await supabase
          .from('messages')
          .insert({
            conversation_id: params.conversation_id,
            sender_id: userId,
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

        // Update active conversation immediately (optimistic update)
        if (activeConversation?.id === params.conversation_id) {
          setActiveConversation({
            ...activeConversation,
            messages: [...(activeConversation.messages || []), data],
          });
        }

        // Reload conversations list (debounced via real-time)

        return data;
      } catch (error) {
        console.error('[useMessagesOptimized] Error sending message:', error);
        toast.error(getHookTranslation('conversations', 'sendFailed'));
        return null;
      }
    },
    [userId, supabase, activeConversation]
  );

  // ============================================================================
  // CREATE CONVERSATION
  // ============================================================================
  const createConversation = useCallback(
    async (params: CreateConversationParams): Promise<Conversation | null> => {
      if (!userId) return null;

      try {
        // Create conversation
        const { data: conv, error: convError } = await supabase
          .from('conversations')
          .insert({
            type: params.type || 'direct',
            name: params.subject,
            description: params.description,
            property_id: params.property_id,
          })
          .select()
          .single();

        if (convError) throw convError;

        // Add participants
        const participantInserts = [userId, ...params.participant_user_ids].map((uid) => ({
          conversation_id: conv.id,
          user_id: uid,
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
        console.error('[useMessagesOptimized] Error creating conversation:', error);
        toast.error(getHookTranslation('conversations', 'createFailed'));
        return null;
      }
    },
    [userId, supabase, sendMessage, loadConversations]
  );

  // ============================================================================
  // MARK AS READ
  // ============================================================================
  const markAsRead = useCallback(
    async (conversationId: string) => {
      if (!userId) return;

      try {
        await supabase
          .from('conversation_participants')
          .update({ last_read_at: new Date().toISOString() })
          .eq('conversation_id', conversationId)
          .eq('user_id', userId);

        // Update local state (optimistic)
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
          )
        );

        // Recalculate total unread
        const totalUnread = conversations.reduce(
          (sum, conv) => (conv.id === conversationId ? sum : sum + (conv.unread_count || 0)),
          0
        );
        setUnreadCount(totalUnread);

      } catch (error) {
        console.error('[useMessagesOptimized] Error marking as read:', error);
      }
    },
    [userId, supabase, conversations]
  );

  // ============================================================================
  // ARCHIVE CONVERSATION
  // ============================================================================
  const archiveConversation = useCallback(
    async (conversationId: string) => {
      if (!userId) return;

      try {
        await supabase
          .from('conversation_participants')
          .update({ is_archived: true })
          .eq('conversation_id', conversationId)
          .eq('user_id', userId);

        // Remove from local state
        setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));

        if (activeConversation?.id === conversationId) {
          setActiveConversation(null);
        }

        toast.success(getHookTranslation('conversations', 'archived'));
      } catch (error) {
        console.error('[useMessagesOptimized] Error archiving conversation:', error);
        toast.error(getHookTranslation('conversations', 'archiveFailed'));
      }
    },
    [userId, supabase, activeConversation]
  );

  // ============================================================================
  // REAL-TIME SUBSCRIPTION (WITH DEBOUNCING)
  // ============================================================================
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('messages-optimized')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as Message;

          // Update active conversation immediately (if match)
          if (activeConversation?.id === newMessage.conversation_id) {
            setActiveConversation((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                messages: [...(prev.messages || []), newMessage],
              };
            });
          }

          // Debounce conversations reload (avoid 100 reloads/sec during active chat)
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }

          debounceTimerRef.current = setTimeout(() => {
            loadConversations();
          }, 500); // Wait 500ms after last message before reloading
        }
      )
      .subscribe();

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [userId, supabase, activeConversation, loadConversations]);

  // ============================================================================
  // INITIAL LOAD
  // ============================================================================
  useEffect(() => {
    if (userId) {
      loadConversations();
    }
  }, [userId, loadConversations]);

  // ============================================================================
  // MEMOIZED RETURN VALUE (avoid re-renders)
  // ============================================================================
  const value = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  return value;
}
