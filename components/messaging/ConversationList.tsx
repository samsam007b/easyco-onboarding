'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { formatMessageTime, type ConversationListItem } from '@/lib/services/messaging-service';
import { MessageCircle, Search, Pin, Archive } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useOnlineStatus } from '@/lib/hooks/use-online-status';
import { useAuth } from '@/lib/contexts/auth-context';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';
import { motion } from 'framer-motion';

interface ConversationListProps {
  conversations: ConversationListItem[];
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  showArchived?: boolean;
  variant?: 'searcher' | 'owner' | 'hub';
  header?: React.ReactNode;
}

const variantStyles = {
  searcher: {
    selected: 'bg-searcher-50 border-l-4 border-l-searcher-500',
    badge: 'bg-searcher-500 text-white',
    accent: 'bg-searcher-500',
    avatarGradient: 'bg-searcher-500',
    online: 'bg-green-500',
    searchFocus: 'focus:ring-searcher-200 focus:border-searcher-300',
  },
  owner: {
    selected: 'bg-owner-50 border-l-4 border-l-owner-500',
    badge: 'bg-owner-500 text-white',
    accent: 'bg-owner-500',
    avatarGradient: 'bg-owner-500',
    online: 'bg-green-500',
    searchFocus: 'focus:ring-owner-200 focus:border-owner-300',
  },
  hub: {
    selected: 'bg-resident-50 border-l-4 border-l-resident-500',
    badge: 'bg-resident-500 text-white',
    accent: 'bg-resident-500',
    avatarGradient: 'bg-resident-500',
    online: 'bg-green-500',
    searchFocus: 'focus:ring-resident-200 focus:border-resident-300',
  },
};

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  showArchived = false,
  variant = 'searcher',
  header,
}: ConversationListProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { isUserOnline } = useOnlineStatus(user?.id || null);
  const styles = variantStyles[variant];
  const { getSection } = useLanguage();
  const messaging = getSection('messaging');

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

  return (
    <div className="flex flex-col h-full">
      {/* Custom Header */}
      {header && (
        <div className="flex-shrink-0">
          {header}
        </div>
      )}

      {/* Search bar */}
      <div className="p-4 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={messaging?.searchPlaceholder || "Rechercher une conversation..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'pl-11 pr-4 py-3 superellipse-xl border-gray-200 bg-white shadow-sm transition-all',
              styles.searchFocus
            )}
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-2">
        {filteredConversations.length === 0 ? (
          <EmptyState showArchived={showArchived} variant={variant} styles={styles} messaging={messaging} />
        ) : (
          <div className="space-y-1 pb-4">
            {filteredConversations.map((conversation, index) => (
              <motion.div
                key={conversation.conversation_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <ConversationItem
                  conversation={conversation}
                  isSelected={conversation.conversation_id === selectedConversationId}
                  onClick={() => onSelectConversation(conversation.conversation_id)}
                  isUserOnline={isUserOnline}
                  variant={variant}
                  styles={styles}
                  messaging={messaging}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface EmptyStateProps {
  showArchived: boolean;
  variant: 'searcher' | 'owner' | 'hub';
  styles: typeof variantStyles.searcher;
  messaging: Record<string, string> | undefined;
}

function EmptyState({ showArchived, variant, styles, messaging }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className={cn('w-16 h-16 superellipse-2xl flex items-center justify-center mb-4 shadow-md text-white', styles.accent)}>
        {showArchived ? (
          <Archive className="h-8 w-8" />
        ) : (
          <MessageCircle className="h-8 w-8" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {showArchived
          ? (messaging?.noArchivedConversations || 'Aucune conversation archivée')
          : (messaging?.noConversations || 'Aucune conversation')}
      </h3>
      <p className="text-sm text-gray-500 max-w-xs">
        {showArchived
          ? (messaging?.archivedWillAppear || 'Les conversations archivées apparaîtront ici')
          : (messaging?.conversationsWillAppear || 'Vos conversations apparaîtront ici')}
      </p>
    </div>
  );
}

interface ConversationItemProps {
  conversation: ConversationListItem;
  isSelected: boolean;
  onClick: () => void;
  isUserOnline: (userId: string) => boolean;
  variant: 'searcher' | 'owner' | 'hub';
  styles: typeof variantStyles.searcher;
  messaging: Record<string, string> | undefined;
}

function ConversationItem({
  conversation,
  isSelected,
  onClick,
  isUserOnline,
  variant,
  styles,
  messaging,
}: ConversationItemProps) {
  const hasUnread = conversation.unread_count > 0;
  const isOnline = isUserOnline(conversation.other_user_id);

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-3 flex items-center gap-3 superellipse-xl transition-all duration-200',
        'hover:bg-gray-100/80 active:scale-[0.99]',
        isSelected ? styles.selected : 'bg-transparent',
        hasUnread && !isSelected && 'bg-white shadow-sm'
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {conversation.other_user_photo ? (
          <Image
            src={conversation.other_user_photo}
            alt={conversation.other_user_name}
            width={52}
            height={52}
            className="w-13 h-13 rounded-full object-cover ring-2 ring-white shadow-sm"
            priority={false}
          />
        ) : (
          <div
            className={cn(
              'w-13 h-13 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm',
              styles.avatarGradient
            )}
            style={{ width: 52, height: 52 }}
          >
            {conversation.other_user_name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Online indicator */}
        {isOnline && (
          <div
            className={cn(
              'absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white',
              styles.online
            )}
            title={messaging?.online || "En ligne"}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-0.5">
          <h4
            className={cn(
              'text-sm truncate max-w-[160px]',
              hasUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'
            )}
          >
            {conversation.other_user_name}
          </h4>
          <span className="text-xs text-gray-400 flex-shrink-0 ml-2 tabular-nums">
            {conversation.last_message_at
              ? formatMessageTime(conversation.last_message_at)
              : ''}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              'text-sm truncate',
              hasUnread ? 'text-gray-800 font-medium' : 'text-gray-500'
            )}
          >
            {conversation.last_message || (messaging?.noMessagesYet || 'Pas encore de messages')}
          </p>

          {hasUnread && (
            <Badge
              className={cn(
                'text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-semibold min-w-[20px] justify-center',
                styles.badge
              )}
            >
              {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}
