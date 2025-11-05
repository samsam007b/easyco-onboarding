'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  ArrowLeft,
  Users,
  MoreVertical,
  Image as ImageIcon,
  Paperclip,
  Smile
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  metadata: any;
  created_at: string;
  sender_name: string;
  sender_avatar?: string;
}

interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  avatar_url?: string;
  participants: Array<{
    user_id: string;
    name: string;
    avatar_url?: string;
  }>;
}

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.id as string;
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversation();
    loadMessages();
    subscribeToMessages();
    markAsRead();

    return () => {
      supabase.removeAllChannels();
    };
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setCurrentUserId(user.id);

      // Get conversation details
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('id, type, name, avatar_url')
        .eq('id', conversationId)
        .single();

      if (convError) throw convError;

      // Get participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('conversation_participants')
        .select(`
          user_id,
          user_profiles (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('conversation_id', conversationId);

      if (participantsError) throw participantsError;

      const participants = participantsData.map(p => {
        const profile = Array.isArray(p.user_profiles) ? p.user_profiles[0] : p.user_profiles;
        return {
          user_id: p.user_id,
          name: profile ? `${profile.first_name} ${profile.last_name}` : 'Inconnu',
          avatar_url: profile?.avatar_url
        };
      });

      setConversation({
        ...convData,
        participants
      });
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('deleted', false)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get unique sender IDs
      const senderIds = [...new Set(messagesData.map(m => m.sender_id))];

      // Fetch sender profiles
      const { data: usersData } = await supabase
        .from('user_profiles')
        .select('user_id, first_name, last_name, avatar_url')
        .in('user_id', senderIds);

      const userMap = new Map(
        usersData?.map(u => [
          u.user_id,
          {
            name: `${u.first_name} ${u.last_name}`,
            avatar_url: u.avatar_url
          }
        ])
      );

      // Enrich messages with sender info
      const enrichedMessages = messagesData.map(msg => {
        const senderInfo = userMap.get(msg.sender_id);
        return {
          ...msg,
          sender_name: senderInfo?.name || 'Inconnu',
          sender_avatar: senderInfo?.avatar_url
        };
      });

      setMessages(enrichedMessages);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading messages:', error);
      setIsLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload) => {
          const newMsg = payload.new as any;

          // Fetch sender info
          const { data: senderData } = await supabase
            .from('user_profiles')
            .select('first_name, last_name, avatar_url')
            .eq('user_id', newMsg.sender_id)
            .single();

          const enrichedMsg: Message = {
            ...newMsg,
            sender_name: senderData
              ? `${senderData.first_name} ${senderData.last_name}`
              : 'Inconnu',
            sender_avatar: senderData?.avatar_url
          };

          setMessages(prev => [...prev, enrichedMsg]);
          markAsRead();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const markAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.rpc('mark_messages_as_read', {
        target_conversation_id: conversationId,
        target_user_id: user.id
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || isSending || !currentUserId) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: messageContent,
          message_type: 'text'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageContent); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  const getConversationTitle = () => {
    if (!conversation) return 'Chargement...';

    if (conversation.type === 'direct' && currentUserId) {
      const otherUser = conversation.participants.find(p => p.user_id !== currentUserId);
      return otherUser?.name || 'Conversation';
    }

    return conversation.name || 'Conversation de groupe';
  };

  const getConversationSubtitle = () => {
    if (!conversation) return '';

    if (conversation.type === 'group') {
      return `${conversation.participants.length} participants`;
    }

    return ''; // Could add "En ligne" status later
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    }
  };

  const shouldShowDateSeparator = (index: number) => {
    if (index === 0) return true;

    const currentDate = new Date(messages[index].created_at).toDateString();
    const previousDate = new Date(messages[index - 1].created_at).toDateString();

    return currentDate !== previousDate;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E8865D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement de la conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
        <Button
          onClick={() => router.push('/dashboard/resident/messages')}
          variant="ghost"
          size="sm"
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-3 flex-1">
          {/* Avatar */}
          {conversation?.type === 'direct' ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D97B6F] to-[#FF8C4B] flex items-center justify-center">
              <span className="text-white font-bold">
                {getConversationTitle().charAt(0)}
              </span>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D97B6F] to-[#FF8C4B] flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
          )}

          {/* Title */}
          <div className="flex-1">
            <h1 className="font-bold text-gray-900">{getConversationTitle()}</h1>
            {getConversationSubtitle() && (
              <p className="text-xs text-gray-500">{getConversationSubtitle()}</p>
            )}
          </div>
        </div>

        <Button variant="ghost" size="sm" className="rounded-full">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
      >
        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            const isOwnMessage = message.sender_id === currentUserId;
            const showDateSeparator = shouldShowDateSeparator(index);

            return (
              <div key={message.id}>
                {/* Date Separator */}
                {showDateSeparator && (
                  <div className="flex items-center justify-center my-6">
                    <div className="bg-white px-4 py-1 rounded-full shadow-sm">
                      <p className="text-xs font-medium text-gray-600">
                        {formatMessageDate(message.created_at)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={cn(
                    'flex gap-2 items-end',
                    isOwnMessage ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  {/* Avatar (only for others in group chats) */}
                  {!isOwnMessage && conversation?.type === 'group' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D97B6F] to-[#FF8C4B] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">
                        {message.sender_name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Message Content */}
                  <div
                    className={cn(
                      'max-w-[70%] rounded-2xl px-4 py-2 shadow-md',
                      isOwnMessage
                        ? 'bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] text-white rounded-br-sm'
                        : 'bg-white text-gray-900 rounded-bl-sm'
                    )}
                  >
                    {/* Sender name in group chats */}
                    {!isOwnMessage && conversation?.type === 'group' && (
                      <p className="text-xs font-medium text-orange-600 mb-1">
                        {message.sender_name}
                      </p>
                    )}

                    {/* Message content */}
                    {message.message_type === 'text' ? (
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    ) : message.message_type === 'image' ? (
                      <div>
                        <p className="text-sm mb-1">📷 Photo</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm mb-1">📎 Fichier</p>
                      </div>
                    )}

                    {/* Timestamp */}
                    <p
                      className={cn(
                        'text-xs mt-1',
                        isOwnMessage ? 'text-white/80' : 'text-gray-500'
                      )}
                    >
                      {formatMessageTime(message.created_at)}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          {/* Attachment buttons */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full flex-shrink-0"
          >
            <Paperclip className="w-5 h-5 text-gray-500" />
          </Button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écris un message..."
              className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
              disabled={isSending}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Smile className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="rounded-full bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
