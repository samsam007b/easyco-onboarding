'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { MessagesLayout } from '@/components/messaging/MessagesLayout';
import { UnifiedConversationList } from '@/components/messaging/UnifiedConversationList';
import { ChatWindow } from '@/components/messaging/ChatWindow';
import {
  getUnifiedConversations,
  getUserRole,
  UnifiedConversation,
  UnifiedMessagingState,
  UserRole,
} from '@/lib/services/unified-messaging-service';
import {
  getMessages,
  sendMessage as sendMessageService,
  markConversationRead,
  setTypingIndicator,
  removeTypingIndicator,
  subscribeToConversation,
  toggleArchiveConversation,
  type Message,
} from '@/lib/services/messaging-service';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

/**
 * Searcher Messages Page
 *
 * Unified messaging system for property searchers with Facebook Messenger-like experience.
 * Features:
 * - Conversations with property owners
 * - Role-based visual indicators
 * - Real-time messaging with typing indicators
 */
function SearcherMessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.searcher?.messages;

  // User state
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('searcher');
  const [userName, setUserName] = useState<string>('');

  // Messaging state
  const [messagingState, setMessagingState] = useState<UnifiedMessagingState | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<UnifiedConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  // Load user and conversations
  useEffect(() => {
    loadUserAndConversations();
  }, []);

  // Handle URL conversation parameter
  useEffect(() => {
    const conversationParam = searchParams.get('conversation');
    if (conversationParam && messagingState) {
      const allConversations = [
        ...messagingState.pinnedConversations,
        ...messagingState.conversations,
      ];
      const conversation = allConversations.find(c => c.id === conversationParam);
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }
  }, [searchParams, messagingState]);

  // Load messages and subscribe when conversation changes
  useEffect(() => {
    if (selectedConversation && !selectedConversation.isVirtual) {
      loadMessagesForConversation(selectedConversation.id);
      if (userId) {
        markAsRead(selectedConversation.id);
      }

      const cleanup = subscribeToConversation(
        selectedConversation.id,
        handleNewMessage,
        handleTypingUpdate
      );

      return cleanup;
    }
  }, [selectedConversation?.id, userId]);

  const loadUserAndConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

      // Get user profile
      const { data: userData } = await supabase
        .from('users')
        .select('full_name, user_type')
        .eq('id', user.id)
        .single();

      const role = getUserRole(userData?.user_type);
      setUserRole(role);
      setUserName(userData?.full_name || (t?.defaultUser?.[language] || 'Utilisateur'));

      // Load conversations
      const result = await getUnifiedConversations(user.id, role);
      if (result.success && result.data) {
        setMessagingState(result.data);
      } else {
        toast.error(t?.errors?.loadConversations?.[language] || 'Erreur lors du chargement des conversations');
      }
    } catch (error) {
      console.error('Error loading user:', error);
      toast.error(t?.errors?.loading?.[language] || 'Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessagesForConversation = async (conversationId: string) => {
    const result = await getMessages(conversationId);
    if (result.success && result.data) {
      setMessages(result.data);
    } else {
      console.error('Error loading messages:', result.error);
    }
  };

  const markAsRead = async (conversationId: string) => {
    if (!userId) return;

    await markConversationRead(conversationId, userId);

    // Update unread count in state
    if (messagingState) {
      const updateConversation = (conv: UnifiedConversation) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv;

      setMessagingState({
        ...messagingState,
        pinnedConversations: messagingState.pinnedConversations.map(updateConversation),
        conversations: messagingState.conversations.map(updateConversation),
      });
    }
  };

  const handleNewMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);

    if (selectedConversation?.id === message.conversation_id && userId) {
      markAsRead(message.conversation_id);
    }

    // Refresh conversation list
    if (userId && userRole) {
      getUnifiedConversations(userId, userRole).then((result) => {
        if (result.success && result.data) {
          setMessagingState(result.data);
        }
      });
    }
  }, [selectedConversation?.id, userId, userRole]);

  const handleTypingUpdate = useCallback((typingUserId: string, isTyping: boolean) => {
    setTypingUsers((prev) => {
      const next = new Set(prev);
      if (isTyping) {
        next.add(typingUserId);
      } else {
        next.delete(typingUserId);
      }
      return next;
    });
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || selectedConversation.isVirtual) return;

    const result = await sendMessageService({
      conversationId: selectedConversation.id,
      content,
    });

    if (!result.success) {
      toast.error(t?.errors?.sendFailed?.[language] || 'Échec de l\'envoi du message');
      throw new Error(result.error);
    }

    if (userId) {
      await removeTypingIndicator(selectedConversation.id, userId);
    }
  };

  const handleStartTyping = async () => {
    if (!selectedConversation || !userId || selectedConversation.isVirtual) return;
    await setTypingIndicator(selectedConversation.id, userId);
  };

  const handleStopTyping = async () => {
    if (!selectedConversation || !userId || selectedConversation.isVirtual) return;
    await removeTypingIndicator(selectedConversation.id, userId);
  };

  const handleArchive = async () => {
    if (!selectedConversation || !userId || selectedConversation.isVirtual) return;

    const result = await toggleArchiveConversation(
      selectedConversation.id,
      userId,
      true
    );

    if (result.success) {
      toast.success(t?.toast?.archived?.[language] || 'Conversation archivée');
      setSelectedConversation(null);
      loadUserAndConversations();
    } else {
      toast.error(t?.errors?.archiveFailed?.[language] || 'Échec de l\'archivage');
    }
  };

  const handleSelectConversation = (conversation: UnifiedConversation) => {
    setSelectedConversation(conversation);

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('conversation', conversation.id);
    window.history.replaceState({}, '', url.toString());
  };

  const handleBack = () => {
    setSelectedConversation(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('conversation');
    window.history.replaceState({}, '', url.toString());
  };

  const isOtherUserTyping =
    selectedConversation &&
    Array.from(typingUsers).some((id) => id !== userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <LoadingHouse size={80} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">
            {t?.loading?.title?.[language] || 'Loading messages...'}
          </h3>
          <p className="text-gray-600">{t?.loading?.subtitle?.[language] || 'Preparing your conversations'}</p>
        </div>
      </div>
    );
  }

  // Render chat content
  const renderChatContent = () => {
    if (!selectedConversation) {
      return null;
    }

    // Virtual conversation (empty chat)
    if (selectedConversation.isVirtual) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-searcher flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl">💬</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {selectedConversation.name}
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {t?.empty?.firstMessage?.[language] || 'Soyez le premier à envoyer un message dans cette conversation !'}
          </p>
        </div>
      );
    }

    // Regular conversation with messages
    return (
      <ChatWindow
        conversationId={selectedConversation.id}
        messages={messages}
        currentUserId={userId!}
        otherUserName={selectedConversation.name}
        otherUserPhoto={selectedConversation.photo}
        isTyping={!!isOtherUserTyping}
        onSendMessage={handleSendMessage}
        onStartTyping={handleStartTyping}
        onStopTyping={handleStopTyping}
        onArchive={handleArchive}
        onDelete={handleArchive}
        onBack={handleBack}
        variant="searcher"
      />
    );
  };

  return (
    <div className="bg-gradient-to-br from-searcher-50/30 via-white to-orange-50/30 px-4 sm:px-6 lg:px-8 pb-8">
      <MessagesLayout
        variant="searcher"
        hasSelectedConversation={!!selectedConversation}
        onBack={handleBack}
        sidebar={
          messagingState ? (
            <UnifiedConversationList
              state={messagingState}
              selectedConversationId={selectedConversation?.id}
              onSelectConversation={handleSelectConversation}
              currentUserId={userId || undefined}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <LoadingHouse size={40} />
            </div>
          )
        }
      >
        {renderChatContent()}
      </MessagesLayout>
    </div>
  );
}

function SuspenseFallback() {
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.searcher?.messages;

  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <LoadingHouse size={80} />
        <p className="text-gray-600 font-medium mt-4">{t?.loading?.simple?.[language] || 'Loading...'}</p>
      </div>
    </div>
  );
}

export default function SearcherMessagesPage() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <SearcherMessagesContent />
    </Suspense>
  );
}
