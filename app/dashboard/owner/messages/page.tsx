'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  MessageCircle,
  Users,
  Archive,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ModernOwnerHeader from '@/components/layout/ModernOwnerHeader';
import { ConversationList } from '@/components/messaging/ConversationList';
import { ChatWindow } from '@/components/messaging/ChatWindow';
import { MessagesLayout } from '@/components/messaging/MessagesLayout';
import {
  getUserConversations,
  getMessages,
  sendMessage as sendMessageService,
  markConversationRead,
  setTypingIndicator,
  removeTypingIndicator,
  subscribeToConversation,
  toggleArchiveConversation,
  type ConversationListItem,
  type Message,
} from '@/lib/services/messaging-service';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type OwnerMessageTab = 'all' | 'applicants' | 'tenants';

function OwnerMessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [showArchived, setShowArchived] = useState(false);
  const [activeTab, setActiveTab] = useState<OwnerMessageTab>('all');

  // Load user data
  useEffect(() => {
    loadUserData();
  }, []);

  // Load conversations when user is loaded
  useEffect(() => {
    if (userId) {
      loadConversations();
    }
  }, [userId]);

  // Handle URL conversation parameter
  useEffect(() => {
    const conversationParam = searchParams.get('conversation');
    if (conversationParam && conversations.length > 0) {
      const conversationExists = conversations.some(
        (conv) => conv.conversation_id === conversationParam
      );
      if (conversationExists) {
        setSelectedConversationId(conversationParam);
      }
    }
  }, [searchParams, conversations]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      loadMessagesForConversation(selectedConversationId);
      markAsRead(selectedConversationId);

      const cleanup = subscribeToConversation(
        selectedConversationId,
        handleNewMessage,
        handleTypingUpdate
      );

      return cleanup;
    }
  }, [selectedConversationId]);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile({
        full_name: userData?.full_name || 'Owner',
        email: userData?.email || '',
        avatar_url: userData?.avatar_url,
        user_type: userData?.user_type,
      });
    } catch (error) {
      console.error('Error loading user:', error);
      toast.error('Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversations = async () => {
    if (!userId) return;

    const result = await getUserConversations(userId);
    if (result.success && result.data) {
      setConversations(result.data);
    } else {
      console.error('Error loading conversations:', result.error);
    }
  };

  const loadMessagesForConversation = async (conversationId: string) => {
    const result = await getMessages(conversationId);
    if (result.success && result.data) {
      setMessages(result.data);
    } else {
      console.error('Error loading messages:', result.error);
      toast.error('Failed to load messages');
    }
  };

  const markAsRead = async (conversationId: string) => {
    if (!userId) return;

    const result = await markConversationRead(conversationId, userId);
    if (result.success) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.conversation_id === conversationId
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    }
  };

  const handleNewMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);

    if (selectedConversationId === message.conversation_id && userId) {
      markAsRead(message.conversation_id);
    }

    loadConversations();
  };

  const handleTypingUpdate = (typingUserId: string, isTyping: boolean) => {
    setTypingUsers((prev) => {
      const next = new Set(prev);
      if (isTyping) {
        next.add(typingUserId);
      } else {
        next.delete(typingUserId);
      }
      return next;
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId) return;

    const result = await sendMessageService({
      conversationId: selectedConversationId,
      content,
    });

    if (!result.success) {
      toast.error('Failed to send message');
      throw new Error(result.error);
    }

    if (userId) {
      await removeTypingIndicator(selectedConversationId, userId);
    }
  };

  const handleStartTyping = async () => {
    if (!selectedConversationId || !userId) return;
    await setTypingIndicator(selectedConversationId, userId);
  };

  const handleStopTyping = async () => {
    if (!selectedConversationId || !userId) return;
    await removeTypingIndicator(selectedConversationId, userId);
  };

  const handleArchive = async () => {
    if (!selectedConversationId || !userId) return;

    const result = await toggleArchiveConversation(
      selectedConversationId,
      userId,
      true
    );

    if (result.success) {
      toast.success('Conversation archivée');
      setSelectedConversationId(null);
      loadConversations();
    } else {
      toast.error('Échec de l\'archivage');
    }
  };

  const handleDelete = async () => {
    if (!selectedConversationId || !userId) return;
    await handleArchive();
  };

  // Filter conversations by category
  const getFilteredConversations = () => {
    if (activeTab === 'all') {
      return conversations;
    }

    return conversations.filter((conv) => {
      // Applicants: conversations with applicants
      if (activeTab === 'applicants') {
        return conv.metadata?.conversationType === 'application' ||
               conv.metadata?.isApplication === true;
      }

      // Tenants: conversations with current tenants
      if (activeTab === 'tenants') {
        return conv.metadata?.conversationType === 'tenant' ||
               conv.metadata?.isTenant === true;
      }

      return true;
    });
  };

  const filteredConversations = getFilteredConversations();

  // Count conversations by type
  const applicantsCount = conversations.filter(c =>
    c.metadata?.conversationType === 'application' || c.metadata?.isApplication === true
  ).length;

  const tenantsCount = conversations.filter(c =>
    c.metadata?.conversationType === 'tenant' || c.metadata?.isTenant === true
  ).length;

  const selectedConversation = conversations.find(
    (c) => c.conversation_id === selectedConversationId
  );

  const isOtherUserTyping =
    selectedConversation &&
    Array.from(typingUsers).some((id) => id !== userId);

  // Sidebar header with tabs
  const sidebarHeader = (
    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50/80 to-indigo-50/80">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-sm">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Messages</h2>
            <p className="text-xs text-gray-500">
              {conversations.length} conversation{conversations.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowArchived(!showArchived)}
          className={cn(
            'rounded-full h-8 w-8 p-0',
            showArchived && 'bg-purple-100 text-purple-700'
          )}
        >
          <Archive className="w-4 h-4" />
        </Button>
      </div>

      {/* Owner-specific tabs */}
      <div className="flex gap-1.5">
        <Button
          variant={activeTab === 'all' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('all')}
          size="sm"
          className={cn(
            'rounded-full text-xs h-8 px-3 flex-1 transition-all',
            activeTab === 'all'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm'
              : 'text-gray-600 hover:bg-purple-50'
          )}
        >
          <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
          Tous
          <Badge
            variant="secondary"
            className={cn(
              'ml-1.5 text-[10px] px-1.5 py-0 h-4 min-w-[18px]',
              activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
            )}
          >
            {conversations.length}
          </Badge>
        </Button>

        <Button
          variant={activeTab === 'applicants' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('applicants')}
          size="sm"
          className={cn(
            'rounded-full text-xs h-8 px-3 flex-1 transition-all',
            activeTab === 'applicants'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm'
              : 'text-gray-600 hover:bg-purple-50'
          )}
        >
          <Users className="w-3.5 h-3.5 mr-1.5" />
          Candidats
          {applicantsCount > 0 && (
            <Badge
              variant="secondary"
              className={cn(
                'ml-1.5 text-[10px] px-1.5 py-0 h-4 min-w-[18px]',
                activeTab === 'applicants' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
              )}
            >
              {applicantsCount}
            </Badge>
          )}
        </Button>

        <Button
          variant={activeTab === 'tenants' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('tenants')}
          size="sm"
          className={cn(
            'rounded-full text-xs h-8 px-3 flex-1 transition-all',
            activeTab === 'tenants'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm'
              : 'text-gray-600 hover:bg-purple-50'
          )}
        >
          <Building2 className="w-3.5 h-3.5 mr-1.5" />
          Locataires
          {tenantsCount > 0 && (
            <Badge
              variant="secondary"
              className={cn(
                'ml-1.5 text-[10px] px-1.5 py-0 h-4 min-w-[18px]',
                activeTab === 'tenants' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
              )}
            >
              {tenantsCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );

  // Custom empty state for owner
  const emptyState = (
    <div className="text-center p-8">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
        <MessageCircle className="w-12 h-12 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Aucune conversation
      </h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-6">
        Vos conversations avec les candidats et locataires apparaîtront ici
      </p>
      <Button
        onClick={() => router.push('/dashboard/owner/applications')}
        className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90 font-semibold px-6 shadow-sm hover:shadow-md transition-all"
      >
        <Users className="w-4 h-4 mr-2" />
        Voir les candidatures
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/30 via-white to-indigo-50/30">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <LoadingHouse size={80} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Chargement des messages...</h3>
          <p className="text-gray-600">Préparation de vos conversations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-indigo-50/30">
      {profile && (
        <ModernOwnerHeader
          profile={profile}
          stats={{}}
        />
      )}

      <main className="pt-20">
        <MessagesLayout
          variant="owner"
          hasSelectedConversation={!!selectedConversationId}
          onBack={() => setSelectedConversationId(null)}
          emptyState={emptyState}
          sidebar={
            <ConversationList
              conversations={filteredConversations}
              selectedConversationId={selectedConversationId || undefined}
              onSelectConversation={setSelectedConversationId}
              showArchived={showArchived}
              variant="owner"
              header={sidebarHeader}
            />
          }
        >
          {selectedConversation && userId ? (
            <ChatWindow
              conversationId={selectedConversationId!}
              messages={messages}
              currentUserId={userId}
              otherUserName={selectedConversation.other_user_name}
              otherUserPhoto={selectedConversation.other_user_photo}
              isTyping={!!isOtherUserTyping}
              onSendMessage={handleSendMessage}
              onStartTyping={handleStartTyping}
              onStopTyping={handleStopTyping}
              onArchive={handleArchive}
              onDelete={handleDelete}
              onBack={() => setSelectedConversationId(null)}
              variant="owner"
            />
          ) : null}
        </MessagesLayout>
      </main>
    </div>
  );
}

export default function OwnerMessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-indigo-50/30">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <LoadingHouse size={80} />
          </div>
          <p className="text-gray-600 font-medium">Loading messages...</p>
        </div>
      </div>
    }>
      <OwnerMessagesContent />
    </Suspense>
  );
}
