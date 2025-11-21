'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  MessageCircle,
  Users,
  Filter,
  Archive,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ModernOwnerHeader from '@/components/layout/ModernOwnerHeader';
import { ConversationList } from '@/components/messaging/ConversationList';
import { ChatWindow } from '@/components/messaging/ChatWindow';
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/30 via-white to-indigo-50/30">
        <div className="text-center">
          <LoadingHouse size={80} />
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Chargement des messages...</h3>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-200/70 to-indigo-200/70 flex items-center justify-center shadow-sm">
                  <MessageCircle className="w-6 h-6 text-gray-700" />
                </div>
                Messages
              </h1>
              <p className="text-gray-600">
                Gérez vos conversations avec les candidats et locataires
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={showArchived ? 'default' : 'outline'}
                onClick={() => setShowArchived(!showArchived)}
                className={cn(
                  'rounded-full transition-all',
                  showArchived && 'bg-gradient-to-r from-purple-200/70 to-indigo-200/70 text-gray-900 border-purple-300 hover:from-purple-300/70 hover:to-indigo-300/70'
                )}
              >
                <Archive className="w-4 h-4 mr-2" />
                {showArchived ? 'Actives' : 'Archivées'}
              </Button>
            </div>
          </div>

          {/* Owner-specific tabs */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveTab('all')}
              size="sm"
              className={cn(
                'rounded-full transition-all',
                activeTab === 'all' && 'bg-gradient-to-r from-purple-200/70 to-indigo-200/70 text-gray-900 border-purple-300 hover:from-purple-300/70 hover:to-indigo-300/70'
              )}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Tous
              <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-900">
                {conversations.length}
              </Badge>
            </Button>

            <Button
              variant={activeTab === 'applicants' ? 'default' : 'outline'}
              onClick={() => setActiveTab('applicants')}
              size="sm"
              className={cn(
                'rounded-full transition-all',
                activeTab === 'applicants' && 'bg-gradient-to-r from-purple-200/70 to-indigo-200/70 text-gray-900 border-purple-300 hover:from-purple-300/70 hover:to-indigo-300/70'
              )}
            >
              <Users className="w-4 h-4 mr-2" />
              Candidats
              {applicantsCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-900">
                  {applicantsCount}
                </Badge>
              )}
            </Button>

            <Button
              variant={activeTab === 'tenants' ? 'default' : 'outline'}
              onClick={() => setActiveTab('tenants')}
              size="sm"
              className={cn(
                'rounded-full transition-all',
                activeTab === 'tenants' && 'bg-gradient-to-r from-purple-200/70 to-indigo-200/70 text-gray-900 border-purple-300 hover:from-purple-300/70 hover:to-indigo-300/70'
              )}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Locataires
              {tenantsCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-900">
                  {tenantsCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Messages Container */}
        {filteredConversations.length === 0 && !showArchived ? (
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-12 text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-indigo-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-purple-300/10 to-indigo-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-200/70 to-indigo-200/70 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <MessageCircle className="w-10 h-10 text-gray-700" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aucune conversation
              </h3>

              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Vos conversations avec les candidats et locataires apparaîtront ici
              </p>

              <Button
                onClick={() => router.push('/dashboard/owner/applications')}
                className="rounded-full bg-gradient-to-r from-purple-200/70 to-indigo-200/70 text-gray-900 hover:from-purple-300/70 hover:to-indigo-300/70 font-semibold px-8 shadow-sm hover:shadow-md transition-all hover:scale-105"
              >
                <Users className="w-5 h-5 mr-2" />
                Voir les candidatures
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-300px)]">
            <div className="grid md:grid-cols-3 h-full">
              {/* Conversations List */}
              <div className={`${selectedConversationId ? 'hidden md:block' : ''} border-r border-gray-200`}>
                <ConversationList
                  conversations={filteredConversations}
                  selectedConversationId={selectedConversationId || undefined}
                  onSelectConversation={setSelectedConversationId}
                  showArchived={showArchived}
                />
              </div>

              {/* Chat Window */}
              <div className={`md:col-span-2 ${!selectedConversationId ? 'hidden md:flex' : ''}`}>
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
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50/50 via-white to-indigo-50/50">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-200/70 to-indigo-200/70 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <MessageCircle className="w-10 h-10 text-gray-700" />
                      </div>
                      <p className="text-lg font-bold text-gray-900 mb-2">Sélectionnez une conversation</p>
                      <p className="text-sm text-gray-600">
                        Choisissez une conversation pour commencer à discuter
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function OwnerMessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    }>
      <OwnerMessagesContent />
    </Suspense>
  );
}
