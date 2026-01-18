// Message System Types
// Comprehensive types for the real-time messaging system

export type MessageType = 'text' | 'system' | 'application';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  attachments?: MessageAttachment[];
  message_type: MessageType;
  // Populated fields
  sender?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    user_type: string;
  };
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'document' | 'link';
  url: string;
  name?: string;
  size?: number;
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  subject?: string;
  property_id?: string;
  last_message_at: string;
  // Populated fields
  participants?: ConversationParticipant[];
  last_message?: Message;
  unread_count?: number;
  property?: {
    id: string;
    title: string;
    main_image?: string;
  };
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string;
  is_archived: boolean;
  // Populated fields
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    user_type: string;
    email: string;
  };
}

export interface ConversationWithDetails extends Conversation {
  other_participant?: ConversationParticipant;
  messages?: Message[];
}

export interface CreateConversationParams {
  participant_user_ids: string[];
  subject?: string;
  property_id?: string;
  initial_message?: string;
  type?: 'direct' | 'group' | 'property';
  description?: string;
}

export interface SendMessageParams {
  conversation_id: string;
  content: string;
  attachments?: MessageAttachment[];
  message_type?: MessageType;
}

export interface MessagesContextValue {
  conversations: ConversationWithDetails[];
  activeConversation: ConversationWithDetails | null;
  unreadCount: number;
  isLoading: boolean;
  // Actions
  loadConversations: () => Promise<void>;
  loadConversation: (conversationId: string) => Promise<void>;
  sendMessage: (params: SendMessageParams) => Promise<Message | null>;
  createConversation: (params: CreateConversationParams) => Promise<Conversation | null>;
  markAsRead: (conversationId: string) => Promise<void>;
  archiveConversation: (conversationId: string) => Promise<void>;
  setActiveConversation: (conversation: ConversationWithDetails | null) => void;
}
