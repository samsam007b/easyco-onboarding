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

// V2 Fun Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10, scale: 0.98 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 25,
    },
  },
};

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
      {/* Header - V2 Fun Design */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
        className="p-4 border-b border-gray-100"
        style={{
          background: 'linear-gradient(180deg, rgba(255,245,243,1) 0%, rgba(255,255,255,0) 100%)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
              boxShadow: '0 8px 24px rgba(238, 87, 54, 0.35)',
            }}
          >
            <MessageCircle className="w-6 h-6 text-white" />
            <motion.div
              className="absolute inset-0 rounded-2xl bg-white/20"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Messages
            </h2>
            <p className="text-xs text-gray-500 flex items-center gap-2">
              <Badge
                className="text-xs border-none text-white font-bold"
                style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)' }}
              >
                {pinnedConversations.length + conversations.length}
              </Badge>
              conversation{pinnedConversations.length + conversations.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Search - Enhanced */}
        <motion.div
          whileFocus={{ scale: 1.01 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-orange-300 bg-white shadow-sm text-sm"
            style={{
              background: 'linear-gradient(135deg, #fff 0%, #fafafa 100%)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Invitation Banner - V2 Fun */}
      <AnimatePresence>
        {showInvitationBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
              className="p-4 border-b border-amber-200"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 237, 213, 0.8) 0%, rgba(254, 243, 199, 0.8) 100%)',
              }}
            >
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-amber-800">
                    {missingInvitations.needsOwner && missingInvitations.needsResidents
                      ? 'Invitez votre propriétaire et vos colocataires'
                      : missingInvitations.needsOwner
                      ? 'Invitez votre propriétaire'
                      : 'Invitez vos colocataires'}
                  </p>
                  <div className="flex gap-2 mt-3">
                    {missingInvitations.needsOwner && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          size="sm"
                          onClick={() => onInviteClick?.('owner')}
                          className="h-8 text-xs rounded-full text-white font-semibold shadow-md"
                          style={{
                            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                          }}
                        >
                          <Key className="w-3 h-3 mr-1" />
                          Propriétaire
                        </Button>
                      </motion.div>
                    )}
                    {missingInvitations.needsResidents && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          size="sm"
                          onClick={() => onInviteClick?.('resident')}
                          className="h-8 text-xs rounded-full text-white font-semibold shadow-md"
                          style={{
                            background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)',
                            boxShadow: '0 4px 12px rgba(238, 87, 54, 0.3)',
                          }}
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          Colocataires
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conversation Lists */}
      <div className="flex-1 overflow-y-auto">
        {/* Pinned Section */}
        {filteredPinned.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="px-3 py-4"
          >
            <div className="flex items-center gap-2 px-2 mb-3">
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                <Pin className="w-4 h-4 text-orange-500" />
              </motion.div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Épinglées
              </span>
            </div>
            <div className="space-y-2">
              {filteredPinned.map((conv) => (
                <motion.div
                  key={conv.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
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
          </motion.div>
        )}

        {/* Regular Conversations */}
        {filteredConversations.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="px-3 py-4"
          >
            {filteredPinned.length > 0 && (
              <div className="flex items-center gap-2 px-2 mb-3">
                <MessageCircle className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Conversations
                </span>
              </div>
            )}
            <div className="space-y-2">
              {filteredConversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
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
          </motion.div>
        )}

        {/* Empty State - V2 Fun */}
        {filteredPinned.length === 0 && filteredConversations.length === 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center h-full p-8 text-center"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotate: 3 }}
              className="relative mb-6"
            >
              {/* Glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-40"
                style={{
                  background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                  filter: 'blur(15px)',
                }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
              <div
                className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                  boxShadow: '0 8px 24px rgba(238, 87, 54, 0.35)',
                }}
              >
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ y: [-2, 2, -2], rotate: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
              </motion.div>
            </motion.div>

            <motion.h3
              variants={itemVariants}
              className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2"
            >
              {searchQuery ? (
                <>
                  <Search className="w-5 h-5 text-gray-400" />
                  Aucun résultat
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                  Aucune conversation
                </>
              )}
            </motion.h3>
            <motion.p
              variants={itemVariants}
              className="text-sm text-gray-500 max-w-xs"
            >
              {searchQuery
                ? 'Essayez avec d\'autres termes de recherche'
                : 'Vos conversations apparaîtront ici'}
            </motion.p>
          </motion.div>
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

  // Get conversation icon for special types - V2 Fun styling
  const getConversationIcon = () => {
    if (conversation.type === 'residence_group') {
      return (
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
          }}
        >
          <Users className="w-6 h-6 text-white" />
        </div>
      );
    }
    if (conversation.type === 'residence_owner') {
      return (
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.35)',
          }}
        >
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
        'w-full p-3 flex items-center gap-3 rounded-2xl transition-all duration-200',
        'hover:bg-white active:scale-[0.99]',
        isSelected
          ? 'bg-white shadow-md border-2'
          : 'bg-transparent border-2 border-transparent hover:border-orange-100',
        hasUnread && !isSelected && 'bg-white shadow-sm border-2 border-orange-100',
        conversation.isVirtual && 'opacity-80'
      )}
      style={
        isSelected
          ? {
              background: 'linear-gradient(135deg, rgba(255,245,243,1) 0%, rgba(255,255,255,1) 100%)',
              borderColor: 'rgba(255, 91, 33, 0.3)',
              boxShadow: '0 4px 12px rgba(238, 87, 54, 0.15)',
            }
          : undefined
      }
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
            <Badge
              className="text-white text-xs px-2.5 py-1 rounded-full flex-shrink-0 font-bold min-w-[22px] justify-center border-none shadow-md"
              style={{
                background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)',
                boxShadow: '0 2px 8px rgba(238, 87, 54, 0.4)',
              }}
            >
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
