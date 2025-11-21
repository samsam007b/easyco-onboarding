'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import ConversationTypeSection from '@/components/messages/ConversationTypeSection';
import {
  MessageSquare,
  Users,
  Home,
  UserCheck,
  UserPlus,
  Plus,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Conversation {
  id: string;
  conversation_type: string;
  is_official: boolean;
  subject?: string;
  last_message?: {
    content: string;
    created_at: string;
    sender_name: string;
    sender_id: string;
  };
  unread_count: number;
  participants_count?: number;
  other_user_name?: string;
}

export default function HubMessagesPage() {
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
        .select('conversation_id, last_read_at')
        .eq('user_id', user.id);

      if (participantsError) throw participantsError;

      const conversationIds = participantsData.map(p => p.conversation_id);

      if (conversationIds.length === 0) {
        setIsLoading(false);
        return;
      }

      // Get conversations details
      const { data: conversationsData, error: convsError } = await supabase
        .from('conversations')
        .select('id, conversation_type, is_official, subject, property_id, last_message_at')
        .in('id', conversationIds);

      if (convsError) throw convsError;

      // Enrich conversations with details
      const enrichedConversations = await Promise.all(
        conversationsData.map(async (conv) => {
          const participant = participantsData.find(p => p.conversation_id === conv.id);

          // Get last message
          const { data: messagesData } = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1);

          const lastMessage = messagesData?.[0];

          // Get sender name if there's a message
          let senderName = 'Inconnu';
          if (lastMessage) {
            if (lastMessage.sender_id === user.id) {
              senderName = 'Vous';
            } else {
              const { data: senderProfile } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', lastMessage.sender_id)
                .single();

              if (senderProfile) {
                senderName = `${senderProfile.first_name} ${senderProfile.last_name}`.trim();
              }
            }
          }

          // Count unread messages
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .neq('sender_id', user.id)
            .gt('created_at', participant?.last_read_at || '1970-01-01');

          // For private chats, get other user's name
          let otherUserName;
          if (conv.conversation_type && conv.conversation_type.includes('private')) {
            const { data: otherParticipants } = await supabase
              .from('conversation_participants')
              .select('user_id')
              .eq('conversation_id', conv.id)
              .neq('user_id', user.id)
              .limit(1);

            if (otherParticipants && otherParticipants.length > 0) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', otherParticipants[0].user_id)
                .single();

              if (profile) {
                otherUserName = `${profile.first_name} ${profile.last_name}`.trim();
              }
            }
          }

          // Get participants count
          const { count: participantsCount } = await supabase
            .from('conversation_participants')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id);

          return {
            id: conv.id,
            conversation_type: conv.conversation_type || 'private_residents',
            is_official: conv.is_official || false,
            subject: conv.subject,
            last_message: lastMessage ? {
              content: lastMessage.content,
              created_at: lastMessage.created_at,
              sender_name: senderName,
              sender_id: lastMessage.sender_id
            } : undefined,
            unread_count: unreadCount || 0,
            participants_count: participantsCount || 0,
            other_user_name: otherUserName
          };
        })
      );

      // Sort by last_message_at
      enrichedConversations.sort((a, b) => {
        const timeA = a.last_message?.created_at || '1970-01-01';
        const timeB = b.last_message?.created_at || '1970-01-01';
        return new Date(timeB).getTime() - new Date(timeA).getTime();
      });

      setConversations(enrichedConversations);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setIsLoading(false);
    }
  };

  // Filter conversations by search
  const filteredConversations = conversations.filter(conv =>
    conv.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.other_user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message?.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group conversations by type
  const officialChats = filteredConversations.filter(c => c.conversation_type === 'residence_group');
  const residenceOwnerChats = filteredConversations.filter(c => c.conversation_type === 'residence_owner');
  const privateResidentChats = filteredConversations.filter(c => c.conversation_type === 'private_residents');
  const privateOwnerChats = filteredConversations.filter(c => c.conversation_type === 'private_resident_owner');
  const candidateChats = filteredConversations.filter(c => c.conversation_type === 'candidate_inquiry');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.push('/hub')}
            variant="ghost"
            className="mb-4 rounded-full"
          >
            ← Retour au hub
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Messages
              </h1>
              <p className="text-gray-600">
                Communiquez avec votre résidence et vos colocataires
              </p>
            </div>

            <Button
              onClick={() => router.push('/hub/messages/new')}
              className="rounded-full bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Conversations grouped by type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Official Residence Chat */}
          <ConversationTypeSection
            title="Discussion de la résidence"
            icon={<Users className="w-5 h-5" />}
            conversations={officialChats}
            emptyMessage="Aucune discussion de résidence disponible"
            iconColor="text-purple-600"
          />

          {/* Residence ↔ Owner */}
          <ConversationTypeSection
            title="Résidence ↔ Propriétaire"
            icon={<Home className="w-5 h-5" />}
            conversations={residenceOwnerChats}
            emptyMessage="Aucune discussion avec le propriétaire"
            iconColor="text-blue-600"
          />

          {/* Private with Residents */}
          <ConversationTypeSection
            title="Messages privés entre résidents"
            icon={<MessageSquare className="w-5 h-5" />}
            conversations={privateResidentChats}
            emptyMessage="Aucune conversation privée avec vos colocataires"
            iconColor="text-green-600"
          />

          {/* Private with Owner */}
          <ConversationTypeSection
            title="Messages privés avec le propriétaire"
            icon={<UserCheck className="w-5 h-5" />}
            conversations={privateOwnerChats}
            emptyMessage="Aucune conversation privée avec le propriétaire"
            iconColor="text-orange-600"
          />

          {/* Candidate Inquiries */}
          <ConversationTypeSection
            title="Candidats intéressés"
            icon={<UserPlus className="w-5 h-5" />}
            conversations={candidateChats}
            emptyMessage="Aucune demande de candidat"
            iconColor="text-pink-600"
          />
        </motion.div>
      </div>
    </div>
  );
}
