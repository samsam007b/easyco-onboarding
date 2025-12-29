'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  UnifiedConversation,
  UnifiedMessagingState,
  UserRole,
  ROLE_VISUALS,
} from '@/lib/services/unified-messaging-service';
import {
  Search,
  Home,
  Key,
  Users,
  MessageCircle,
  Pin,
  ExternalLink,
  UserPlus,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

// Role icon mapping
const RoleIcon = ({ role, className }: { role: UserRole; className?: string }) => {
  const iconClass = cn('w-4 h-4', className);
  switch (role) {
    case 'searcher':
      return <Search className={iconClass} />;
    case 'owner':
      return <Key className={iconClass} />;
    case 'resident':
      return <Home className={iconClass} />;
    default:
      return <Users className={iconClass} />;
  }
};

interface UnifiedConversationListProps {
  state: UnifiedMessagingState;
  selectedConversationId?: string;
  onSelectConversation: (conversation: UnifiedConversation) => void;
  onInviteClick?: (type: 'owner' | 'resident') => void;
  currentUserId?: string;
}

export function UnifiedConversationList({
  state,
  selectedConversationId,
  onSelectConversation,
  onInviteClick,
  currentUserId,
}: UnifiedConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { pinnedConversations, conversations, missingInvitations } = state;

  // Filter conversations by search
  const filteredPinned = pinnedConversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if we need to show invitation banner
  const showInvitationBanner = missingInvitations.needsOwner || missingInvitations.needsResidents;

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50/80 to-red-50/80">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-sm">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Messages</h2>
            <p className="text-xs text-gray-500">
              {pinnedConversations.length + conversations.length} conversation
              {pinnedConversations.length + conversations.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl border-gray-200 bg-white shadow-sm text-sm"
          />
        </div>
      </div>

      {/* Invitation Banner */}
      <AnimatePresence>
        {showInvitationBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-amber-800">
                    {missingInvitations.needsOwner && missingInvitations.needsResidents
                      ? 'Invitez votre propriétaire et vos colocataires'
                      : missingInvitations.needsOwner
                      ? 'Invitez votre propriétaire'
                      : 'Invitez vos colocataires'}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {missingInvitations.needsOwner && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onInviteClick?.('owner')}
                        className="h-7 text-xs rounded-full border-amber-300 text-amber-700 hover:bg-amber-100"
                      >
                        <Key className="w-3 h-3 mr-1" />
                        Propriétaire
                      </Button>
                    )}
                    {missingInvitations.needsResidents && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onInviteClick?.('resident')}
                        className="h-7 text-xs rounded-full border-amber-300 text-amber-700 hover:bg-amber-100"
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        Colocataires
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conversation Lists */}
      <div className="flex-1 overflow-y-auto">
        {/* Pinned Section */}
        {filteredPinned.length > 0 && (
          <div className="px-2 py-3">
            <div className="flex items-center gap-2 px-2 mb-2">
              <Pin className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Épinglées
              </span>
            </div>
            <div className="space-y-1">
              {filteredPinned.map((conv, index) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ConversationItem
                    conversation={conv}
                    isSelected={conv.id === selectedConversationId}
                    onClick={() => onSelectConversation(conv)}
                    currentUserId={currentUserId}
                    isPinned
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Conversations */}
        {filteredConversations.length > 0 && (
          <div className="px-2 py-3">
            {filteredPinned.length > 0 && (
              <div className="flex items-center gap-2 px-2 mb-2">
                <MessageCircle className="w-3 h-3 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Conversations
                </span>
              </div>
            )}
            <div className="space-y-1">
              {filteredConversations.map((conv, index) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (filteredPinned.length + index) * 0.03 }}
                >
                  <ConversationItem
                    conversation={conv}
                    isSelected={conv.id === selectedConversationId}
                    onClick={() => onSelectConversation(conv)}
                    currentUserId={currentUserId}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredPinned.length === 0 && filteredConversations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4 shadow-md">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'Aucun résultat' : 'Aucune conversation'}
            </h3>
            <p className="text-sm text-gray-500 max-w-xs">
              {searchQuery
                ? 'Essayez avec d\'autres termes de recherche'
                : 'Vos conversations apparaîtront ici'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Individual conversation item component
interface ConversationItemProps {
  conversation: UnifiedConversation;
  isSelected: boolean;
  onClick: () => void;
  currentUserId?: string;
  isPinned?: boolean;
}

function ConversationItem({
  conversation,
  isSelected,
  onClick,
  currentUserId,
  isPinned,
}: ConversationItemProps) {
  const hasUnread = conversation.unreadCount > 0;
  const roleVisual = conversation.otherUserRole
    ? ROLE_VISUALS[conversation.otherUserRole]
    : null;

  // Format time
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'maintenant';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  // Get conversation icon for special types
  const getConversationIcon = () => {
    if (conversation.type === 'residence_group') {
      return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-sm">
          <Users className="w-6 h-6 text-white" />
        </div>
      );
    }
    if (conversation.type === 'residence_owner') {
      return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-sm">
          <Key className="w-6 h-6 text-white" />
        </div>
      );
    }
    return null;
  };

  const specialIcon = getConversationIcon();

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-200',
        'hover:bg-white active:scale-[0.99]',
        isSelected
          ? 'bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-l-orange-500 shadow-sm'
          : 'bg-transparent',
        hasUnread && !isSelected && 'bg-white shadow-sm',
        conversation.isVirtual && 'opacity-80'
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {specialIcon ? (
          specialIcon
        ) : conversation.photo ? (
          <Image
            src={conversation.photo}
            alt={conversation.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
        ) : (
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm',
              roleVisual
                ? `bg-gradient-to-br ${roleVisual.bgColor.replace('bg-', 'from-')} to-${roleVisual.color.replace('text-', '').replace('-600', '-500')}`
                : 'bg-gradient-to-br from-gray-400 to-gray-500'
            )}
          >
            {conversation.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Role indicator badge */}
        {roleVisual && !specialIcon && (
          <div
            className={cn(
              'absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm',
              roleVisual.bgColor
            )}
          >
            <RoleIcon role={roleVisual.role} className={cn('w-2.5 h-2.5', roleVisual.color)} />
          </div>
        )}

        {/* External badge */}
        {conversation.isExternal && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm">
            <ExternalLink className="w-2.5 h-2.5 text-gray-500" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-2 min-w-0">
            <h4
              className={cn(
                'text-sm truncate',
                hasUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'
              )}
            >
              {conversation.name}
            </h4>

            {/* Role label for non-special conversations */}
            {roleVisual && !specialIcon && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0',
                  roleVisual.bgColor,
                  roleVisual.color
                )}
              >
                {roleVisual.label}
              </span>
            )}

            {/* External label */}
            {conversation.isExternal && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600 flex-shrink-0">
                Externe
              </span>
            )}
          </div>

          <span className="text-xs text-gray-400 flex-shrink-0 ml-2 tabular-nums">
            {formatTime(conversation.lastMessageAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          {conversation.isVirtual && conversation.needsInvitation ? (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <UserPlus className="w-3 h-3" />
              {conversation.invitationType === 'owner'
                ? 'Invitez votre propriétaire'
                : 'Invitez vos colocataires'}
            </p>
          ) : (
            <p
              className={cn(
                'text-sm truncate',
                hasUnread ? 'text-gray-800 font-medium' : 'text-gray-500'
              )}
            >
              {conversation.lastMessage ? (
                <>
                  {conversation.lastMessageSenderId === currentUserId && (
                    <span className="text-gray-400">Vous: </span>
                  )}
                  {conversation.lastMessage}
                </>
              ) : conversation.isVirtual ? (
                'Aucun message'
              ) : (
                'Démarrer la conversation'
              )}
            </p>
          )}

          {hasUnread && (
            <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-semibold min-w-[20px] justify-center">
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </Badge>
          )}

          {conversation.isVirtual && !conversation.needsInvitation && (
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          )}
        </div>

        {/* Participant count for group chats */}
        {conversation.participantCount && conversation.participantCount > 2 && (
          <p className="text-xs text-gray-400 mt-1">
            {conversation.participantCount} membres
          </p>
        )}
      </div>
    </button>
  );
}

export default UnifiedConversationList;
