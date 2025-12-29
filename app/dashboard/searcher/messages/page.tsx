'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { SkeletonDashboard } from '@/components/ui/skeleton';
import { logger } from '@/lib/utils/logger';
import {
  MessageCircle,
  Users,
  Search,
  Archive,
  Building2,
  UserCircle2,
  UsersRound,
  UserPlus,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessagesLayout } from '@/components/messaging/MessagesLayout';
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
import { motion } from 'framer-motion';

type SearcherMessageTab = 'all' | 'owners' | 'searchers' | 'groups' | 'requests';

function SearcherMessagesContent() {
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
  const [activeTab, setActiveTab] = useState<SearcherMessageTab>('all');
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

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

  // Load pending requests when conversations are loaded
  useEffect(() => {
    if (userId && conversations.length >= 0) {
      loadPendingRequests();
    }
  }, [userId, conversations.length]);

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
      logger.error('Error loading user', error);
      toast.error('Erreur lors du chargement des données');
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
      logger.error('Error loading conversations', result.error);
    }

    await loadPendingRequests();
  };

  const loadPendingRequests = async () => {
    if (!userId) return;

    try {
      const { data: matches, error } = await supabase
        .from('matches')
        .select(`
          id,
          created_at,
          searcher_id,
          owner_id,
          owner:users!matches_owner_id_fkey (
            id,
            full_name,
            user_profiles (
              profile_photo
            )
          )
        `)
        .eq('searcher_id', userId)
        .in('status', ['active', 'viewed'])
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error loading pending requests', error);
        return;
      }

      const existingConversationUserIds = new Set(
        conversations.map(c => c.other_user_id)
      );

      const requests = matches?.filter((match: any) => {
        return !existingConversationUserIds.has(match.owner_id);
      }).map((match: any) => {
        return {
          match_id: match.id,
          user_id: match.owner?.id || match.owner_id,
          user_name: match.owner?.full_name || 'Propriétaire',
          user_photo: match.owner?.user_profiles?.profile_photo,
          matched_at: match.created_at,
        };
      }) || [];

      setPendingRequests(requests);
    } catch (error) {
      logger.error('Error loading pending requests', error);
    }
  };

  const loadMessagesForConversation = async (conversationId: string) => {
    const result = await getMessages(conversationId);
    if (result.success && result.data) {
      setMessages(result.data);
    } else {
      logger.error('Error loading messages', result.error);
      toast.error('Erreur lors du chargement des messages');
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
      if (activeTab === 'owners') {
        return conv.metadata?.conversationType === 'owner_application' ||
               conv.metadata?.userType === 'owner';
      }

      if (activeTab === 'searchers') {
        return conv.metadata?.conversationType === 'searcher_match' ||
               conv.metadata?.userType === 'searcher';
      }

      if (activeTab === 'groups') {
        return conv.metadata?.conversationType === 'group' ||
               conv.metadata?.isGroup === true;
      }

      return true;
    });
  };

  const filteredConversations = getFilteredConversations();

  // Count conversations by type
  const ownersCount = conversations.filter(c =>
    c.metadata?.conversationType === 'owner_application' || c.metadata?.userType === 'owner'
  ).length;

  const searchersCount = conversations.filter(c =>
    c.metadata?.conversationType === 'searcher_match' || c.metadata?.userType === 'searcher'
  ).length;

  const groupsCount = conversations.filter(c =>
    c.metadata?.conversationType === 'group' || c.metadata?.isGroup === true
  ).length;

  const selectedConversation = conversations.find(
    (c) => c.conversation_id === selectedConversationId
  );

  const isOtherUserTyping =
    selectedConversation &&
    Array.from(typingUsers).some((id) => id !== userId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-searcher-50/30 via-white to-searcher-50/30 p-8">
        <div className="max-w-7xl mx-auto">
          <SkeletonDashboard />
        </div>
      </div>
    );
  }

  // Sidebar Header with tabs
  const sidebarHeader = (
    <div className="p-4 border-b border-gray-100 bg-white">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-searcher flex items-center justify-center shadow-md">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Messages</h1>
            <p className="text-xs text-gray-500">{conversations.length} conversations</p>
          </div>
        </div>
        <Button
          variant={showArchived ? 'default' : 'ghost'}
          size="icon"
          onClick={() => setShowArchived(!showArchived)}
          className={cn(
            'rounded-full h-9 w-9',
            showArchived && 'bg-gradient-searcher hover:opacity-90'
          )}
        >
          <Archive className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {[
          { key: 'all', label: 'Tous', icon: MessageCircle, count: conversations.length },
          { key: 'owners', label: 'Proprios', icon: Building2, count: ownersCount },
          { key: 'searchers', label: 'Matchs', icon: UserCircle2, count: searchersCount },
          { key: 'groups', label: 'Groupes', icon: UsersRound, count: groupsCount },
          { key: 'requests', label: 'Demandes', icon: UserPlus, count: pendingRequests.length },
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'default' : 'ghost'}
            onClick={() => setActiveTab(tab.key as SearcherMessageTab)}
            size="sm"
            className={cn(
              'rounded-full h-8 text-xs px-3',
              activeTab === tab.key
                ? 'bg-gradient-searcher hover:opacity-90 text-white'
                : 'hover:bg-searcher-50 text-gray-600'
            )}
          >
            <tab.icon className="w-3.5 h-3.5 mr-1.5" />
            {tab.label}
            {tab.count > 0 && (
              <Badge
                variant="secondary"
                className={cn(
                  'ml-1.5 h-5 min-w-5 text-xs px-1.5',
                  activeTab === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-searcher-100 text-searcher-700'
                )}
              >
                {tab.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );

  // Requests view - special sidebar content
  const requestsSidebar = (
    <div className="flex flex-col h-full">
      {sidebarHeader}
      <div className="flex-1 overflow-y-auto p-4">
        {pendingRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-searcher flex items-center justify-center mb-4 shadow-md">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune demande
            </h3>
            <p className="text-sm text-gray-500 max-w-xs mb-4">
              Les personnes avec qui vous matcherez apparaîtront ici
            </p>
            <Button
              onClick={() => router.push('/dashboard/searcher/groups')}
              size="sm"
              className="rounded-full bg-gradient-searcher hover:opacity-90 text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Trouver des colocataires
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((request: any, index: number) => (
              <motion.div
                key={request.match_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-searcher-50/50 to-orange-50/50 rounded-2xl p-4 border border-searcher-100 hover:border-searcher-200 transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-3">
                  {request.user_photo ? (
                    <img
                      src={request.user_photo}
                      alt={request.user_name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-searcher flex items-center justify-center ring-2 ring-white shadow-sm">
                      <UserCircle2 className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {request.user_name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-searcher-500 text-searcher-500" />
                      Match {new Date(request.matched_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={async () => {
                    if (!userId || !request.user_id) return;

                    try {
                      const { data: newConv, error } = await supabase
                        .from('conversations')
                        .insert({
                          created_by: userId,
                          metadata: {
                            conversationType: 'searcher_match',
                            userType: 'searcher',
                            matchId: request.match_id
                          }
                        })
                        .select()
                        .single();

                      if (error) throw error;

                      await supabase
                        .from('conversation_participants')
                        .insert([
                          { conversation_id: newConv.id, user_id: userId, is_read: true },
                          { conversation_id: newConv.id, user_id: request.user_id, is_read: false }
                        ]);

                      toast.success('Conversation créée !');
                      await loadConversations();
                      await loadPendingRequests();
                      setSelectedConversationId(newConv.id);
                      setActiveTab('searchers');
                    } catch (error) {
                      logger.error('Error creating conversation', error);
                      toast.error('Échec de la création de la conversation');
                    }
                  }}
                  className="w-full rounded-xl bg-gradient-searcher hover:opacity-90 text-white"
                  size="sm"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Envoyer un message
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <MessagesLayout
      variant="searcher"
      hasSelectedConversation={!!selectedConversationId}
      onBack={() => setSelectedConversationId(null)}
      sidebar={
        activeTab === 'requests' ? (
          requestsSidebar
        ) : (
          <ConversationList
            conversations={filteredConversations}
            selectedConversationId={selectedConversationId || undefined}
            onSelectConversation={setSelectedConversationId}
            showArchived={showArchived}
            variant="searcher"
            header={sidebarHeader}
          />
        )
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
          variant="searcher"
        />
      ) : null}
    </MessagesLayout>
  );
}

export default function SearcherMessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-searcher-50/30 via-white to-searcher-50/30 p-8">
        <div className="max-w-7xl mx-auto">
          <SkeletonDashboard />
        </div>
      </div>
    }>
      <SearcherMessagesContent />
    </Suspense>
  );
}
