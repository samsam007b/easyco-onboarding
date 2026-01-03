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
  UnifiedConversation,
  UnifiedMessagingState,
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
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';

// V3-FUN Searcher Palette
const SEARCHER_GRADIENT = 'linear-gradient(135deg, #F59E0B 0%, #FFB10B 50%, #FCD34D 100%)';
const SEARCHER_GRADIENT_LIGHT = 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FFF9E6 100%)';

/**
 * Searcher Messages Page
 *
 * Unified messaging system for searchers with V3-FUN amber styling.
 * Features:
 * - Role-based visual indicators for owners
 * - Real-time messaging with typing indicators
 * - Property inquiry conversations
 */
function SearcherMessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const t = getSection('searcher')?.messages;

  // User state
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
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
        .select('full_name')
        .eq('id', user.id)
        .single();

      setUserName(userData?.full_name || (t?.fallback?.[language] || 'User'));

      // Load conversations with searcher role forced
      const result = await getUnifiedConversations(user.id, 'searcher');
      if (result.success && result.data) {
        setMessagingState(result.data);
      } else {
        toast.error(t?.errors?.loadConversations?.[language] || 'Erreur lors du chargement des conversations');
      }
    } catch (error) {
      console.error('Error loading user:', error);
      toast.error(t?.errors?.loadError?.[language] || 'Erreur de chargement');
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
    if (userId) {
      getUnifiedConversations(userId, 'searcher').then((result) => {
        if (result.success && result.data) {
          setMessagingState(result.data);
        }
      });
    }
  }, [selectedConversation?.id, userId]);

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
      toast.error(t?.errors?.sendFailed?.[language] || "Impossible d'envoyer le message");
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
      toast.success(t?.archived?.[language] || 'Conversation archivée');
      setSelectedConversation(null);
      loadUserAndConversations();
    } else {
      toast.error(t?.errors?.archiveFailed?.[language] || "Impossible d'archiver");
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
      <div
        className="flex items-center justify-center py-20 min-h-screen"
        style={{ background: SEARCHER_GRADIENT_LIGHT }}
      >
        <div className="text-center">
          <LoadingHouse size={80} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">
            {t?.loading?.title?.[language] || 'Chargement des messages...'}
          </h3>
          <p className="text-gray-600">{t?.loading?.subtitle?.[language] || 'Préparation de vos conversations'}</p>
        </div>
      </div>
    );
  }

  // Render empty state for virtual conversations
  const renderChatContent = () => {
    if (!selectedConversation) {
      return null;
    }

    // Virtual conversation without needing invitation (empty chat)
    if (selectedConversation.isVirtual) {
      return (
        <div className="relative flex flex-col items-center justify-center h-full p-8 text-center overflow-hidden">
          {/* V3-FUN Decorative circles */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10" style={{ background: SEARCHER_GRADIENT }} />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full opacity-10" style={{ background: SEARCHER_GRADIENT }} />

          {/* V3-FUN Animated Icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-3xl blur-lg"
              style={{ background: SEARCHER_GRADIENT }}
            />
            <div
              className="relative w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg"
              style={{ background: SEARCHER_GRADIENT }}
            >
              <MessageCircle className="w-12 h-12 text-white" />
            </div>
            <motion.div
              animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-6 h-6 text-amber-400" />
            </motion.div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {selectedConversation.name}
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {t?.emptyState?.[language] || 'Soyez le premier à envoyer un message !'}
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
    <div
      className="min-h-screen px-4 sm:px-6 lg:px-8 pb-8"
      style={{ background: SEARCHER_GRADIENT_LIGHT }}
    >
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
              variant="searcher"
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

function MessagesFallback() {
  return (
    <div
      className="flex items-center justify-center py-20 min-h-screen"
      style={{ background: SEARCHER_GRADIENT_LIGHT }}
    >
      <div className="text-center">
        <LoadingHouse size={80} />
        <p className="text-gray-600 font-medium mt-4">Chargement...</p>
      </div>
    </div>
  );
}

export default function SearcherMessagesPage() {
  return (
    <Suspense fallback={<MessagesFallback />}>
      <SearcherMessagesContent />
    </Suspense>
  );
}
