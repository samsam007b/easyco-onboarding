/**
 * Messaging Service
 * Handles all messaging operations: conversations, messages, typing indicators
 */

import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';

// ============================================================================
// TYPES
// ============================================================================

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  context_type?: 'general' | 'property_inquiry' | 'application' | 'coliving_match';
  context_id?: string;
  last_message_id?: string;
  last_message_at?: string;
  last_message_preview?: string;
  participant1_unread_count: number;
  participant2_unread_count: number;
  participant1_archived: boolean;
  participant2_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'system' | 'property_share' | 'meeting_request';
  metadata?: Record<string, any>;
  read_by_recipient: boolean;
  read_at?: string;
  deleted_by_sender: boolean;
  deleted_by_recipient: boolean;
  edited: boolean;
  edited_at?: string;
  image_url?: string;
  image_width?: number;
  image_height?: number;
  created_at: string;
}

export interface ConversationListItem {
  conversation_id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_photo?: string;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  is_archived: boolean;
  metadata?: {
    isResident?: boolean;
    [key: string]: any;
  };
}

export interface SendMessageParams {
  conversationId: string;
  content: string;
  messageType?: 'text' | 'system' | 'property_share' | 'meeting_request';
  metadata?: Record<string, any>;
}

// ============================================================================
// CONVERSATION MANAGEMENT
// ============================================================================

/**
 * Get or create a conversation between two users
 */
export async function getOrCreateConversation(
  userId1: string,
  userId2: string,
  contextType?: string,
  contextId?: string
): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.rpc('get_or_create_conversation', {
      p_user1_id: userId1,
      p_user2_id: userId2,
      p_context_type: contextType,
      p_context_id: contextId,
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    logger.error('Error getting/creating conversation', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get list of user's conversations
 */
export async function getUserConversations(
  userId: string
): Promise<{ success: boolean; data?: ConversationListItem[]; error?: string }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.rpc('get_user_conversations', {
      p_user_id: userId,
    });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error: any) {
    logger.error('Error fetching conversations', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get conversation details
 */
export async function getConversation(
  conversationId: string
): Promise<{ success: boolean; data?: Conversation; error?: string }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    logger.error('Error fetching conversation', error);
    return { success: false, error: error.message };
  }
}

/**
 * Archive/unarchive conversation
 */
export async function toggleArchiveConversation(
  conversationId: string,
  userId: string,
  archive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    // Get conversation to determine which participant
    const { data: conversation, error: fetchError } = await supabase
      .from('conversations')
      .select('participant1_id')
      .eq('id', conversationId)
      .single();

    if (fetchError) throw fetchError;

    const isParticipant1 = conversation.participant1_id === userId;
    const field = isParticipant1 ? 'participant1_archived' : 'participant2_archived';

    const { error } = await supabase
      .from('conversations')
      .update({ [field]: archive })
      .eq('id', conversationId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    logger.error('Error archiving conversation', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// MESSAGE MANAGEMENT
// ============================================================================

/**
 * Send a message
 */
export async function sendMessage(
  params: SendMessageParams
): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { data, error } = await supabase.rpc('send_message', {
      p_conversation_id: params.conversationId,
      p_sender_id: user.id,
      p_content: params.content,
      p_message_type: params.messageType || 'text',
      p_metadata: params.metadata || {},
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    logger.error('Error sending message', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get messages for a conversation
 */
export async function getMessages(
  conversationId: string,
  limit: number = 50,
  beforeMessageId?: string
): Promise<{ success: boolean; data?: Message[]; error?: string }> {
  try {
    const supabase = createClient();

    let query = supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    // Pagination support
    if (beforeMessageId) {
      const { data: beforeMessage } = await supabase
        .from('messages')
        .select('created_at')
        .eq('id', beforeMessageId)
        .single();

      if (beforeMessage) {
        query = query.lt('created_at', beforeMessage.created_at);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    // Reverse to show oldest first
    return { success: true, data: (data || []).reverse() };
  } catch (error: any) {
    logger.error('Error fetching messages', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mark conversation as read
 */
export async function markConversationRead(
  conversationId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase.rpc('mark_conversation_read', {
      p_conversation_id: conversationId,
      p_user_id: userId,
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    logger.error('Error marking conversation as read', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete message (soft delete for user)
 */
export async function deleteMessage(
  messageId: string,
  userId: string,
  isSender: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const field = isSender ? 'deleted_by_sender' : 'deleted_by_recipient';

    const { error } = await supabase
      .from('messages')
      .update({ [field]: true })
      .eq('id', messageId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    logger.error('Error deleting message', error);
    return { success: false, error: error.message };
  }
}

/**
 * Edit message (sender only)
 */
export async function editMessage(
  messageId: string,
  newContent: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('messages')
      .update({
        content: newContent,
        edited: true,
        edited_at: new Date().toISOString(),
      })
      .eq('id', messageId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    logger.error('Error editing message', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// TYPING INDICATORS
// ============================================================================

/**
 * Set typing indicator
 */
export async function setTypingIndicator(
  conversationId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    // Upsert typing indicator (will auto-expire in 5 seconds)
    const { error } = await supabase
      .from('typing_indicators')
      .upsert(
        {
          conversation_id: conversationId,
          user_id: userId,
          expires_at: new Date(Date.now() + 5000).toISOString(),
        },
        {
          onConflict: 'conversation_id,user_id',
        }
      );

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    logger.error('Error setting typing indicator', error);
    return { success: false, error: error.message };
  }
}

/**
 * Remove typing indicator
 */
export async function removeTypingIndicator(
  conversationId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('typing_indicators')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    logger.error('Error removing typing indicator', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

/**
 * Subscribe to new messages in a conversation
 */
export function subscribeToConversation(
  conversationId: string,
  onMessage: (message: Message) => void,
  onTyping: (userId: string, isTyping: boolean) => void
) {
  const supabase = createClient();

  // Subscribe to new messages
  const messagesChannel = supabase
    .channel(`conversation:${conversationId}:messages`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onMessage(payload.new as Message);
      }
    )
    .subscribe();

  // Subscribe to typing indicators
  const typingChannel = supabase
    .channel(`conversation:${conversationId}:typing`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'typing_indicators',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          onTyping((payload.new as any).user_id, true);
        } else if (payload.eventType === 'DELETE') {
          onTyping((payload.old as any).user_id, false);
        }
      }
    )
    .subscribe();

  // Return cleanup function
  return () => {
    supabase.removeChannel(messagesChannel);
    supabase.removeChannel(typingChannel);
  };
}

/**
 * Subscribe to conversation list updates
 */
export function subscribeToConversationList(
  userId: string,
  onUpdate: () => void
) {
  const supabase = createClient();

  const channel = supabase
    .channel('conversations:updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `participant1_id=eq.${userId}`,
      },
      onUpdate
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `participant2_id=eq.${userId}`,
      },
      onUpdate
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get unread count for user across all conversations
 */
export async function getTotalUnreadCount(
  userId: string
): Promise<{ success: boolean; data?: number; error?: string }> {
  try {
    const supabase = createClient();

    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('participant1_id, participant1_unread_count, participant2_unread_count')
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`);

    if (error) throw error;

    const total = (conversations || []).reduce((sum, conv) => {
      if (conv.participant1_id === userId) {
        return sum + conv.participant1_unread_count;
      } else {
        return sum + conv.participant2_unread_count;
      }
    }, 0);

    return { success: true, data: total };
  } catch (error: any) {
    logger.error('Error getting total unread count', error);
    return { success: false, error: error.message };
  }
}

/**
 * Format timestamp for message display
 */
export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}
