'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Send, Search } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import DashboardHeader from '@/components/DashboardHeader';
import { useMessages } from '@/lib/hooks/use-messages';

export default function MessagesPage() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    messages,
    loadMessages,
    sendMessage,
    subscribeToConversation,
    unsubscribeFromConversation,
  } = useMessages(userId || undefined);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId);
      subscribeToConversation(selectedConversationId);
    }

    return () => {
      unsubscribeFromConversation();
    };
  }, [selectedConversationId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      // FIXME: Use logger.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return;

    const success = await sendMessage(selectedConversationId, newMessage);
    if (success) {
      setNewMessage('');
    }
  };

  const getRoleColor = () => {
    switch (profile?.user_type) {
      case 'owner':
        return '#4A148C';
      case 'resident':
        return '#FF6F3C';
      default:
        return '#FFD700';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  // Filter conversations by search query
  const filteredConversations = conversations.filter(conv =>
    conv.other_user?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A148C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      {profile && (
        <DashboardHeader
          profile={profile}
          avatarColor={getRoleColor()}
          role={profile.user_type}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#4A148C] mb-2 flex items-center gap-2">
                <MessageCircle className="w-8 h-8 text-[#4A148C]" />
                Messages
              </h1>
              <p className="text-gray-600">Chat with property owners and roommates</p>
            </div>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Messages Container */}
        {conversations.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-600 mb-6">
              Start a conversation with property owners or roommates
            </p>
            {profile?.user_type === 'searcher' && (
              <Button onClick={() => router.push('/properties/browse')}>
                Browse Properties
              </Button>
            )}
            {profile?.user_type === 'resident' && (
              <Button onClick={() => router.push('/community')}>
                View Community
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-3 h-[600px]">
              {/* Conversations List */}
              <div className="border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4A148C] focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversationId(conv.id)}
                      className={`w-full p-4 text-left hover:bg-purple-50 transition-colors ${
                        selectedConversationId === conv.id ? 'bg-purple-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#4A148C] to-[#6A1B9A] rounded-full flex items-center justify-center text-white font-bold">
                          {conv.other_user?.full_name.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {conv.other_user?.full_name || 'Unknown User'}
                            </h3>
                            {(conv.unread_count || 0) > 0 && (
                              <span className="bg-[#4A148C] text-white text-xs font-bold px-2 py-1 rounded-full">
                                {conv.unread_count}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conv.last_message_text || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                      {conv.last_message_at && (
                        <p className="text-xs text-gray-400">{formatTimestamp(conv.last_message_at)}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="md:col-span-2 flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#4A148C] to-[#6A1B9A] rounded-full flex items-center justify-center text-white font-bold">
                          {selectedConversation.other_user?.full_name.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {selectedConversation.other_user?.full_name || 'Unknown User'}
                          </h3>
                          <p className="text-xs text-gray-500 capitalize">
                            {selectedConversation.other_user?.user_type || 'User'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <div className="text-center">
                            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No messages yet. Start the conversation!</p>
                          </div>
                        </div>
                      ) : (
                        messages.map((message) => {
                          const isOwn = message.sender_id === userId;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl ${
                                  isOwn
                                    ? 'bg-[#4A148C] text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {formatMessageTime(message.created_at)}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4A148C] focus:outline-none"
                        />
                        <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Select a conversation to start messaging</p>
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
