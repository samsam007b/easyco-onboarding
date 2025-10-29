'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatMessageTime, type ConversationListItem } from '@/lib/services/messaging-service';
import { MessageCircle, Archive, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ConversationListProps {
  conversations: ConversationListItem[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  showArchived?: boolean;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  showArchived = false,
}: ConversationListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    // Filter by archived status
    if (conv.is_archived !== showArchived) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        conv.other_user_name.toLowerCase().includes(query) ||
        conv.last_message?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  if (filteredConversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <MessageCircle className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {showArchived ? 'No archived conversations' : 'No conversations yet'}
        </h3>
        <p className="text-sm text-gray-500 max-w-xs">
          {showArchived
            ? 'Archived conversations will appear here'
            : 'Start a conversation with a property owner or potential roommate'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <ConversationItem
            key={conversation.conversation_id}
            conversation={conversation}
            isSelected={conversation.conversation_id === selectedConversationId}
            onClick={() => onSelectConversation(conversation.conversation_id)}
          />
        ))}
      </div>
    </div>
  );
}

interface ConversationItemProps {
  conversation: ConversationListItem;
  isSelected: boolean;
  onClick: () => void;
}

function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  const hasUnread = conversation.unread_count > 0;

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b ${
        isSelected ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {conversation.other_user_photo ? (
          <img
            src={conversation.other_user_photo}
            alt={conversation.other_user_name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
            {conversation.other_user_name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Online indicator - TODO: implement online status */}
        {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div> */}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-1">
          <h4
            className={`text-sm font-medium truncate ${
              hasUnread ? 'text-gray-900 font-semibold' : 'text-gray-700'
            }`}
          >
            {conversation.other_user_name}
          </h4>
          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
            {conversation.last_message_at
              ? formatMessageTime(conversation.last_message_at)
              : ''}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-sm truncate ${
              hasUnread ? 'text-gray-900 font-medium' : 'text-gray-500'
            }`}
          >
            {conversation.last_message || 'No messages yet'}
          </p>

          {hasUnread && (
            <Badge
              variant="default"
              className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0"
            >
              {conversation.unread_count}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}
