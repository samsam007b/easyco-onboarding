'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import {
  MessageCircle,
  Home,
  Users,
  Search,
  Filter,
  Archive,
  Building2,
  UserCircle2,
  UsersRound,
  UserPlus,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { cn } from '@/lib/utils';

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

    // Load pending message requests from matches
    await loadPendingRequests();
  };

  const loadPendingRequests = async () => {
    if (!userId) return;

    try {
      // Get matches where user hasn't started a conversation yet
      const { data: matches, error } = await supabase
        .from('matches')
        .select(`
          id,
          created_at,
          user1_id,
          user2_id,
          users!matches_user1_id_fkey (
            id,
            full_name,
            user_profiles (
              profile_photo
            )
          ),
          users2:users!matches_user2_id_fkey (
            id,
            full_name,
            user_profiles (
              profile_photo
            )
          )
        `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .eq('status', 'matched')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading pending requests:', error);
        return;
      }

      // Filter out matches that already have conversations
      const existingConversationUserIds = new Set(
        conversations.map(c => c.other_user_id)
      );

      const requests = matches?.filter((match: any) => {
        const otherId = match.user1_id === userId ? match.user2_id : match.user1_id;
        return !existingConversationUserIds.has(otherId);
      }).map((match: any) => {
        const isUser1 = match.user1_id === userId;
        const otherUser = isUser1 ? match.users2 : match.users;
        return {
          match_id: match.id,
          user_id: otherUser?.id,
          user_name: otherUser?.full_name,
          user_photo: otherUser?.user_profiles?.profile_photo,
          matched_at: match.created_at,
        };
      }) || [];

      setPendingRequests(requests);
    } catch (error) {
      console.error('Error loading pending requests:', error);
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
      // Owners: conversations with property owners (for applications)
      if (activeTab === 'owners') {
        return conv.metadata?.conversationType === 'owner_application' ||
               conv.metadata?.userType === 'owner';
      }

      // Searchers: conversations with other searchers (matches)
      if (activeTab === 'searchers') {
        return conv.metadata?.conversationType === 'searcher_match' ||
               conv.metadata?.userType === 'searcher';
      }

      // Groups: group conversations
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50/30 via-white to-yellow-50/30">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-orange-200 rounded-full mx-auto mb-6"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 border-4 border-[#FFA040] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Chargement des messages...</h3>
          <p className="text-gray-600">Préparation de vos conversations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/20 via-white to-yellow-50/20">
      {profile && (
        <DashboardHeader
          profile={profile}
          avatarColor="#FFA040"
          role="searcher"
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#FFA040] to-[#FFB85C] bg-clip-text text-transparent flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFA040] to-[#FFB85C] flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                Messages
              </h1>
              <p className="text-gray-600 text-lg">
                Gérez vos conversations avec propriétaires, colocataires et groupes
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={showArchived ? 'default' : 'outline'}
                onClick={() => setShowArchived(!showArchived)}
                className={cn(
                  'rounded-full',
                  showArchived && 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548]'
                )}
              >
                <Archive className="w-4 h-4 mr-2" />
                {showArchived ? 'Actives' : 'Archivées'}
              </Button>
            </div>
          </div>

          {/* Searcher-specific tabs */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveTab('all')}
              size="sm"
              className={cn(
                'rounded-full',
                activeTab === 'all' && 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548]'
              )}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Tous
              <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-900">
                {conversations.length}
              </Badge>
            </Button>

            <Button
              variant={activeTab === 'owners' ? 'default' : 'outline'}
              onClick={() => setActiveTab('owners')}
              size="sm"
              className={cn(
                'rounded-full',
                activeTab === 'owners' && 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548]'
              )}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Propriétaires
              {ownersCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-900">
                  {ownersCount}
                </Badge>
              )}
            </Button>

            <Button
              variant={activeTab === 'searchers' ? 'default' : 'outline'}
              onClick={() => setActiveTab('searchers')}
              size="sm"
              className={cn(
                'rounded-full',
                activeTab === 'searchers' && 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548]'
              )}
            >
              <UserCircle2 className="w-4 h-4 mr-2" />
              Matchs
              {searchersCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-900">
                  {searchersCount}
                </Badge>
              )}
            </Button>

            <Button
              variant={activeTab === 'groups' ? 'default' : 'outline'}
              onClick={() => setActiveTab('groups')}
              size="sm"
              className={cn(
                'rounded-full',
                activeTab === 'groups' && 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548]'
              )}
            >
              <UsersRound className="w-4 h-4 mr-2" />
              Groupes
              {groupsCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-900">
                  {groupsCount}
                </Badge>
              )}
            </Button>

            <Button
              variant={activeTab === 'requests' ? 'default' : 'outline'}
              onClick={() => setActiveTab('requests')}
              size="sm"
              className={cn(
                'rounded-full',
                activeTab === 'requests' && 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548]'
              )}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Demandes
              {pendingRequests.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-900">
                  {pendingRequests.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Messages Container */}
        {activeTab === 'requests' ? (
          /* Pending Requests View */
          pendingRequests.length === 0 ? (
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-yellow-50/30 rounded-3xl p-12 text-center">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-200/20 to-yellow-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-orange-300/10 to-yellow-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-[#FFA040] to-[#FFB85C] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <UserPlus className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Aucune demande de contact
                </h3>

                <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                  Les personnes avec qui vous avez matché et qui n'ont pas encore de conversation avec vous apparaîtront ici
                </p>

                <Button
                  onClick={() => router.push('/dashboard/searcher/top-matches')}
                  className="rounded-full bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548] text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Trouver des colocataires
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#FFA040]" />
                  Demandes de contact ({pendingRequests.length})
                </h2>
                <p className="text-gray-600 mb-6">
                  Ces personnes ont matché avec vous et souhaitent peut-être vous contacter
                </p>

                <div className="space-y-4">
                  {pendingRequests.map((request: any) => (
                    <div
                      key={request.match_id}
                      className="group relative bg-gradient-to-br from-orange-50/50 to-yellow-50/50 hover:from-orange-50 hover:to-yellow-50 rounded-2xl p-6 border border-orange-100 hover:border-orange-200 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Avatar */}
                          <div className="relative">
                            {request.user_photo ? (
                              <img
                                src={request.user_photo}
                                alt={request.user_name}
                                className="w-16 h-16 rounded-full object-cover ring-2 ring-orange-200"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFA040] to-[#FFB85C] flex items-center justify-center ring-2 ring-orange-200">
                                <UserCircle2 className="w-8 h-8 text-white" />
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center ring-2 ring-white">
                              <Heart className="w-3 h-3 text-white fill-white" />
                            </div>
                          </div>

                          {/* User Info */}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {request.user_name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                              Match depuis {new Date(request.matched_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: new Date(request.matched_at).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                              })}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-orange-700 bg-orange-100/50 rounded-full px-3 py-1 w-fit">
                              <Heart className="w-3.5 h-3.5 fill-orange-700" />
                              <span className="font-medium">Match confirmé</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={async () => {
                              if (!userId || !request.user_id) return;

                              try {
                                // Create a new conversation
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

                                // Add participants
                                await supabase
                                  .from('conversation_participants')
                                  .insert([
                                    { conversation_id: newConv.id, user_id: userId, is_read: true },
                                    { conversation_id: newConv.id, user_id: request.user_id, is_read: false }
                                  ]);

                                toast.success('Conversation créée !');

                                // Reload conversations and requests
                                await loadConversations();
                                await loadPendingRequests();

                                // Switch to the new conversation
                                setSelectedConversationId(newConv.id);
                                setActiveTab('searchers');
                              } catch (error) {
                                console.error('Error creating conversation:', error);
                                toast.error('Échec de la création de la conversation');
                              }
                            }}
                            className="rounded-full bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548] text-white font-semibold px-6 py-2 shadow-md hover:shadow-lg transition-all hover:scale-105"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Envoyer un message
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => router.push(`/dashboard/searcher/top-matches?user=${request.user_id}`)}
                            className="rounded-full border-orange-200 hover:bg-orange-50 text-gray-700"
                          >
                            Voir le profil
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        ) : filteredConversations.length === 0 && !showArchived ? (
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-yellow-50/30 rounded-3xl p-12 text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-200/20 to-yellow-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-orange-300/10 to-yellow-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FFA040] to-[#FFB85C] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                {(() => {
                  switch (activeTab) {
                    case 'owners':
                      return <Building2 className="w-10 h-10 text-white" />;
                    case 'searchers':
                      return <UserCircle2 className="w-10 h-10 text-white" />;
                    case 'groups':
                      return <UsersRound className="w-10 h-10 text-white" />;
                    case 'requests':
                      return <UserPlus className="w-10 h-10 text-white" />;
                    default:
                      return <MessageCircle className="w-10 h-10 text-white" />;
                  }
                })()}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {activeTab === 'owners' && 'Aucun message avec des propriétaires'}
                {activeTab === 'searchers' && 'Aucun match'}
                {activeTab === 'groups' && 'Aucune conversation de groupe'}
                {activeTab === 'requests' && 'Aucune demande de contact'}
                {activeTab === 'all' && 'Aucune conversation'}
              </h3>

              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                {activeTab === 'owners' && 'Postulez à des propriétés pour commencer à échanger avec les propriétaires'}
                {activeTab === 'searchers' && 'Vos matchs avec d\'autres chercheurs de colocation apparaîtront ici'}
                {activeTab === 'groups' && 'Créez ou rejoignez un groupe pour chercher ensemble'}
                {activeTab === 'requests' && 'Les personnes avec qui vous avez matché et qui n\'ont pas encore de conversation avec vous apparaîtront ici'}
                {activeTab === 'all' && 'Vos conversations apparaîtront ici'}
              </p>

              {activeTab === 'owners' && (
                <Button
                  onClick={() => router.push('/dashboard/searcher')}
                  className="rounded-full bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548] text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Explorer les propriétés
                </Button>
              )}

              {activeTab === 'searchers' && (
                <Button
                  onClick={() => router.push('/dashboard/searcher/top-matches')}
                  className="rounded-full bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548] text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Trouver des colocataires
                </Button>
              )}

              {activeTab === 'groups' && (
                <Button
                  onClick={() => router.push('/dashboard/searcher/groups')}
                  className="rounded-full bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548] text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <UsersRound className="w-5 h-5 mr-2" />
                  Gérer mes groupes
                </Button>
              )}

              {activeTab === 'requests' && (
                <Button
                  onClick={() => router.push('/dashboard/searcher/top-matches')}
                  className="rounded-full bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548] text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Trouver des colocataires
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow overflow-hidden h-[calc(100vh-300px)]">
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
                  <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50/30 to-yellow-50/30">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#FFA040] to-[#FFB85C] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <MessageCircle className="w-10 h-10 text-white" />
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

export default function SearcherMessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA040]"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    }>
      <SearcherMessagesContent />
    </Suspense>
  );
}
