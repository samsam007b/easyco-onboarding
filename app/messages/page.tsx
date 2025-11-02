'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardHeader from '@/components/DashboardHeader';
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

function MessagesContent() {
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
      // Check if conversation exists in the list
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

      // Subscribe to real-time updates
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

      // Get user profile
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProfile({
        full_name: userData?.full_name || 'User',
        email: userData?.email || '',
        profile_data: profileData,
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
      // Update conversation list unread count
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

    // Mark as read if conversation is selected
    if (selectedConversationId === message.conversation_id && userId) {
      markAsRead(message.conversation_id);
    }

    // Reload conversations to update last message
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

    // Stop typing indicator
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
      toast.success('Conversation archived');
      setSelectedConversationId(null);
      loadConversations();
    } else {
      toast.error('Failed to archive conversation');
    }
  };

  const handleDelete = async () => {
    if (!selectedConversationId || !userId) return;

    // Note: For now, archive serves as soft delete
    // Full delete will be implemented when needed
    await handleArchive();
  };

  const getRoleColor = () => {
    switch (profile?.user_type) {
      case 'owner':
        return '#6E56CF';
      case 'resident':
        return '#FF6F3C';
      default:
        return '#FFD249';
    }
  };

  const getRoleGradient = () => {
    switch (profile?.user_type) {
      case 'owner':
        return 'linear-gradient(135deg, #F3F1FF 0%, #F9F8FF 100%)';
      case 'resident':
        return 'linear-gradient(135deg, #FFF3EF 0%, #FFE5DC 100%)';
      default:
        return 'linear-gradient(135deg, #FFF9E6 0%, #FFFBEA 100%)';
    }
  };

  const selectedConversation = conversations.find(
    (c) => c.conversation_id === selectedConversationId
  );

  // Check if other user is typing
  const isOtherUserTyping =
    selectedConversation &&
    Array.from(typingUsers).some((id) => id !== userId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{
              borderColor: 'transparent',
              borderTopColor: getRoleColor(),
            }}
          />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {profile && (
        <DashboardHeader
          profile={profile}
          avatarColor={getRoleColor()}
          role={profile.user_type}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div
          className="rounded-3xl shadow-lg p-4 sm:p-8 mb-6 border border-gray-200"
          style={{ background: getRoleGradient() }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)'
                  }}
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                Messages
              </h1>
              <p className="text-gray-600">
                Communiquez avec les propriétaires et résidents
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={showArchived ? 'default' : 'outline'}
                onClick={() => setShowArchived(!showArchived)}
                className="rounded-full"
              >
                {showArchived ? 'Show Active' : 'Show Archived'}
              </Button>
              <Button onClick={() => router.back()} variant="outline" className="rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        {conversations.length === 0 && !showArchived ? (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 sm:p-12 text-center">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
              style={{
                background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)'
              }}
            >
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune conversation
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez à discuter avec des propriétaires ou colocataires potentiels
            </p>
            {profile?.user_type === 'searcher' && (
              <Button onClick={() => router.push('/properties/browse')} className="rounded-full">
                Explorer les propriétés
              </Button>
            )}
            {profile?.user_type === 'resident' && (
              <Button onClick={() => router.push('/matching/swipe')} className="rounded-full">
                Trouver des colocataires
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-[calc(100vh-300px)]">
            <div className="grid md:grid-cols-3 h-full">
              {/* Conversations List */}
              <div className={`${selectedConversationId ? 'hidden md:block' : ''} border-r`}>
                <ConversationList
                  conversations={conversations}
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
                  <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <div
                        className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
                        style={{
                          background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)'
                        }}
                      >
                        <MessageCircle className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-lg font-medium text-gray-900">Sélectionnez une conversation</p>
                      <p className="text-sm mt-2 text-gray-600">
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

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
