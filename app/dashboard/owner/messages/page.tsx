'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { MessagesLayout } from '@/components/messaging/MessagesLayout';
import { UnifiedConversationList } from '@/components/messaging/UnifiedConversationList';
import { ChatWindow } from '@/components/messaging/ChatWindow';
import { InvitationCTA, InvitationDialog } from '@/components/messaging/InvitationCTA';
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
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';

// V3 Owner gradient constants
const ownerGradient = 'linear-gradient(135deg, #9c5698 0%, #a5568d 25%, #af5682 50%, #b85676 75%, #c2566b 100%)';
const ownerGradientLight = 'linear-gradient(135deg, #F8F0F7 0%, #FDF5F9 100%)';

/**
 * Owner Messages Page
 *
 * Unified messaging system for property owners with Facebook Messenger-like experience.
 * Features:
 * - Role-based visual indicators for searchers and residents
 * - Real-time messaging with typing indicators
 * - Property-based conversation organization
 */
function OwnerMessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.owner?.messagesPage;

  // User state
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('owner');
  const [userName, setUserName] = useState<string>('');

  // Messaging state
  const [messagingState, setMessagingState] = useState<UnifiedMessagingState | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<UnifiedConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  // Dialog state
  const [invitationDialogOpen, setInvitationDialogOpen] = useState(false);
  const [invitationType, setInvitationType] = useState<'owner' | 'resident'>('resident');

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
      setUserName(userData?.full_name || (t?.fallback?.[language] || 'User'));

      // Load conversations
      const result = await getUnifiedConversations(user.id, role);
      if (result.success && result.data) {
        setMessagingState(result.data);
      } else {
        toast.error(t?.errors?.loadConversations?.[language] || 'Error loading conversations');
      }
    } catch (error) {
      console.error('Error loading user:', error);
      toast.error(t?.errors?.loadError?.[language] || 'Loading error');
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
      toast.error(t?.errors?.sendFailed?.[language] || 'Failed to send message');
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
      toast.success(t?.archived?.[language] || 'Conversation archived');
      setSelectedConversation(null);
      loadUserAndConversations();
    } else {
      toast.error(t?.errors?.archiveFailed?.[language] || 'Failed to archive');
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

  const handleInviteClick = (type: 'owner' | 'resident') => {
    setInvitationType(type);
    setInvitationDialogOpen(true);
  };

  const isOtherUserTyping =
    selectedConversation &&
    Array.from(typingUsers).some((id) => id !== userId);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-20"
        style={{ background: ownerGradientLight }}
      >
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

  // Render empty state or invitation CTA for virtual conversations
  const renderChatContent = () => {
    if (!selectedConversation) {
      return null;
    }

    // Virtual conversation needing invitation
    if (selectedConversation.isVirtual && selectedConversation.needsInvitation) {
      return (
        <InvitationCTA
          type={selectedConversation.invitationType || 'resident'}
          propertyId={selectedConversation.propertyId || ''}
          inviterName={userName}
          variant="empty-state"
        />
      );
    }

    // Virtual conversation without needing invitation (empty chat)
    if (selectedConversation.isVirtual) {
      return (
        <div className="relative flex flex-col items-center justify-center h-full p-8 text-center overflow-hidden">
          {/* V3 Decorative circles */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10" style={{ background: ownerGradient }} />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full opacity-10" style={{ background: ownerGradient }} />

          {/* V3 Animated Icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 superellipse-3xl blur-lg"
              style={{ background: ownerGradient }}
            />
            <div
              className="relative w-24 h-24 superellipse-3xl flex items-center justify-center shadow-lg"
              style={{ background: ownerGradient }}
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
            {t?.emptyState?.[language] || 'Be the first to send a message in this conversation!'}
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
        variant="owner"
      />
    );
  };

  return (
    <div
      className="px-4 sm:px-6 lg:px-8 pb-8"
      style={{ background: ownerGradientLight }}
    >
      <MessagesLayout
        variant="owner"
        hasSelectedConversation={!!selectedConversation}
        onBack={handleBack}
        sidebar={
          messagingState ? (
            <UnifiedConversationList
              state={messagingState}
              selectedConversationId={selectedConversation?.id}
              onSelectConversation={handleSelectConversation}
              onInviteClick={handleInviteClick}
              currentUserId={userId || undefined}
              variant="owner"
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

      {/* Invitation Dialog */}
      <InvitationDialog
        isOpen={invitationDialogOpen}
        onClose={() => setInvitationDialogOpen(false)}
        type={invitationType}
        propertyId={messagingState?.userResidence?.propertyId || ''}
        inviterName={userName}
      />
    </div>
  );
}

function MessagesFallback() {
  return (
    <div
      className="flex items-center justify-center py-20"
      style={{ background: ownerGradientLight }}
    >
      <div className="text-center">
        <LoadingHouse size={80} />
        <p className="text-gray-600 font-medium mt-4">Loading...</p>
      </div>
    </div>
  );
}

export default function OwnerMessagesPage() {
  return (
    <Suspense fallback={<MessagesFallback />}>
      <OwnerMessagesContent />
    </Suspense>
  );
}
