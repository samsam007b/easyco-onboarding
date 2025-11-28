'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MessageSquare } from 'lucide-react';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/hooks/useConversations';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (conversationId: string) => void;
  loading?: boolean;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  loading = false,
}: ConversationListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingHouse size={48} />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune conversation</h3>
        <p className="text-sm text-gray-600">
          Vos conversations apparaîtront ici une fois que vous aurez commencé à échanger
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      {conversations.map((conversation) => (
        <Card
          key={conversation.conversation_id}
          className={cn(
            'p-4 mb-2 cursor-pointer transition-all hover:shadow-md border-l-4',
            selectedId === conversation.conversation_id
              ? 'border-l-purple-600 bg-purple-50'
              : 'border-l-transparent hover:border-l-purple-300'
          )}
          onClick={() => onSelect(conversation.conversation_id)}
        >
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {conversation.other_user_photo ? (
                <img
                  src={conversation.other_user_photo}
                  alt={conversation.other_user_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
                  <span className="text-purple-700 font-semibold text-lg">
                    {conversation.other_user_name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {conversation.other_user_name}
                </h3>
                {conversation.unread_count > 0 && (
                  <Badge variant="default" className="ml-2">
                    {conversation.unread_count}
                  </Badge>
                )}
              </div>

              <p className="text-sm text-gray-600 truncate mb-1">
                {conversation.last_message || 'Pas de message'}
              </p>

              {conversation.last_message_at && (
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(conversation.last_message_at), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
