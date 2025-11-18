'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  MessageSquare,
  Search,
  Plus,
  Users,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  avatar_url?: string;
  last_message?: {
    content: string;
    created_at: string;
    sender_name: string;
  };
  unread_count: number;
  other_user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  participants_count?: number;
}

export default function MessagesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setCurrentUserId(user.id);

      // Get user's conversations
      const { data: participantsData, error: participantsError } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          conversations (
            id,
            type,
            name,
            avatar_url,
            updated_at
          )
        `)
        .eq('user_id', user.id);

      if (participantsError) throw participantsError;

      const conversationIds = participantsData.map(p => p.conversation_id);

      // Get last message for each conversation
      const conversationsWithDetails = await Promise.all(
        participantsData.map(async (participant: any) => {
          const conv = participant.conversations;

          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select(`
              content,
              created_at,
              sender_id,
              message_type
            `)
            .eq('conversation_id', conv.id)
            .eq('deleted', false)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          const { data: unreadData } = await supabase
            .rpc('get_unread_count', { target_user_id: user.id });

          const unreadCount = unreadData?.find((u: any) => u.conversation_id === conv.id)?.unread_count || 0;

          // For direct conversations, get the other user
          let otherUser: Conversation['other_user'] = undefined;
          let participantsCount = 0;

          if (conv.type === 'direct') {
            const { data: otherParticipant } = await supabase
              .from('conversation_participants')
              .select(`
                user_id,
                user_profiles (
                  first_name,
                  last_name,
                  avatar_url
                )
              `)
              .eq('conversation_id', conv.id)
              .neq('user_id', user.id)
              .single();

            if (otherParticipant && otherParticipant.user_profiles) {
              const profile = Array.isArray(otherParticipant.user_profiles)
                ? otherParticipant.user_profiles[0]
                : otherParticipant.user_profiles;

              otherUser = {
                id: otherParticipant.user_id,
                name: `${profile.first_name} ${profile.last_name}`,
                avatar_url: profile.avatar_url
              };
            }
          } else {
            // Count participants for group chats
            const { count } = await supabase
              .from('conversation_participants')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conv.id);

            participantsCount = count || 0;
          }

          // Get sender name for last message
          let senderName = 'Inconnu';
          if (lastMessage) {
            if (lastMessage.sender_id === user.id) {
              senderName = 'Toi';
            } else {
              const { data: senderProfile } = await supabase
                .from('user_profiles')
                .select('first_name, last_name')
                .eq('user_id', lastMessage.sender_id)
                .single();

              if (senderProfile) {
                senderName = `${senderProfile.first_name} ${senderProfile.last_name}`;
              }
            }
          }

          return {
            id: conv.id,
            type: conv.type,
            name: conv.name,
            avatar_url: conv.avatar_url,
            last_message: lastMessage ? {
              content: lastMessage.message_type === 'text'
                ? lastMessage.content
                : lastMessage.message_type === 'image'
                ? '📷 Photo'
                : '📎 Fichier',
              created_at: lastMessage.created_at,
              sender_name: senderName
            } : undefined,
            unread_count: unreadCount,
            other_user: otherUser,
            participants_count: participantsCount
          };
        })
      );

      // Sort by last message time
      conversationsWithDetails.sort((a, b) => {
        const aTime = a.last_message?.created_at || 0;
        const bTime = b.last_message?.created_at || 0;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });

      setConversations(conversationsWithDetails);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setIsLoading(false);
    }
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.type === 'direct' && conversation.other_user) {
      return conversation.other_user.name;
    }
    return conversation.name || 'Conversation de groupe';
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.type === 'direct' && conversation.other_user?.avatar_url) {
      return conversation.other_user.avatar_url;
    }
    return conversation.avatar_url;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const filteredConversations = conversations.filter(conv =>
    getConversationName(conv).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] bg-clip-text text-transparent">
              Messages
            </h1>
            <Button
              onClick={() => router.push('/dashboard/resident')}
              variant="ghost"
              className="rounded-full"
            >
              ← Retour
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </motion.div>

        {/* Conversations List */}
        <div className="space-y-3">
          {filteredConversations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-lg p-12 text-center"
            >
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? 'Essayez avec un autre nom'
                  : 'Commencez une conversation avec vos colocataires'}
              </p>
              {!searchQuery && (
                <Button className="rounded-full bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle conversation
                </Button>
              )}
            </motion.div>
          ) : (
            filteredConversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => router.push(`/dashboard/resident/messages/${conversation.id}`)}
                className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {getConversationAvatar(conversation) ? (
                      <img
                        src={getConversationAvatar(conversation)}
                        alt={getConversationName(conversation)}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D97B6F] to-[#FF8C4B] flex items-center justify-center">
                        {conversation.type === 'group' ? (
                          <Users className="w-7 h-7 text-white" />
                        ) : (
                          <span className="text-white font-bold text-lg">
                            {getConversationName(conversation).charAt(0)}
                          </span>
                        )}
                      </div>
                    )}
                    {conversation.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-900 truncate">
                        {getConversationName(conversation)}
                      </h3>
                      {conversation.last_message && (
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                          {getTimeAgo(conversation.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    {conversation.last_message ? (
                      <p className="text-sm text-gray-600 truncate">
                        <span className="font-medium">{conversation.last_message.sender_name}:</span>{' '}
                        {conversation.last_message.content}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Aucun message</p>
                    )}
                  </div>

                  {/* Indicators */}
                  <div className="flex-shrink-0">
                    {conversation.type === 'group' && (
                      <Badge variant="secondary" className="text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        {conversation.participants_count}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
