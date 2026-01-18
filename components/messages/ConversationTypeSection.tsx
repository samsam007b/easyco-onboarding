'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { memo } from 'react';
import {
  MessageSquare,
  Users,
  Home,
  UserCheck,
  UserPlus,
  Clock,
  Pin
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  conversation_type: string;
  is_official: boolean;
  subject?: string;
  last_message?: {
    content: string;
    created_at: string;
    sender_name: string;
  };
  unread_count: number;
  participants_count?: number;
  other_user_name?: string;
}

interface ConversationTypeSectionProps {
  title: string;
  icon: React.ReactNode;
  conversations: Conversation[];
  emptyMessage: string;
  iconColor?: string;
}

// Memoized component pour éviter re-renders inutiles
const ConversationTypeSection = memo(function ConversationTypeSection({
  title,
  icon,
  conversations,
  emptyMessage,
  iconColor = 'text-orange-600'
}: ConversationTypeSectionProps) {
  const router = useRouter();

  const getConversationIcon = (conversation: Conversation) => {
    switch (conversation.conversation_type) {
      case 'residence_group':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'residence_owner':
        return <Home className="w-5 h-5 text-blue-600" />;
      case 'private_residents':
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'private_resident_owner':
        return <UserCheck className="w-5 h-5 text-orange-600" />;
      case 'candidate_inquiry':
        return <UserPlus className="w-5 h-5 text-pink-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  if (conversations.length === 0) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className={cn("p-2 rounded-lg bg-gray-100", iconColor)}>
            {icon}
          </div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        </div>
        <div className="bg-gray-50 superellipse-xl p-6 text-center text-gray-500">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className={cn("p-2 rounded-lg bg-gray-100", iconColor)}>
          {icon}
        </div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <Badge variant="secondary" className="ml-auto">
          {conversations.length}
        </Badge>
      </div>

      <div className="space-y-2">
        {conversations.map((conversation, index) => (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => router.push(`/hub/messages/${conversation.id}`)}
            className={cn(
              "bg-white superellipse-xl p-4 cursor-pointer transition-all hover:shadow-md border",
              conversation.unread_count > 0
                ? "border-orange-200 bg-orange-50/30"
                : "border-gray-200"
            )}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">
                {getConversationIcon(conversation)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={cn(
                    "font-semibold text-sm truncate",
                    conversation.unread_count > 0 ? "text-gray-900" : "text-gray-700"
                  )}>
                    {conversation.subject || conversation.other_user_name || 'Conversation'}
                  </h3>
                  {conversation.is_official && (
                    <Pin className="w-3 h-3 text-orange-600 flex-shrink-0" />
                  )}
                </div>

                {conversation.last_message && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="font-medium">
                      {conversation.last_message.sender_name}:
                    </span>
                    <p className="truncate flex-1">
                      {conversation.last_message.content}
                    </p>
                  </div>
                )}

                {!conversation.last_message && (
                  <p className="text-xs text-gray-400">
                    Aucun message
                  </p>
                )}
              </div>

              {/* Right side: Time & unread badge */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {conversation.last_message && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatTime(conversation.last_message.created_at)}
                  </div>
                )}

                {conversation.unread_count > 0 && (
                  <Badge className="bg-orange-600 text-white">
                    {conversation.unread_count}
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparator : ne re-render que si conversations changent réellement
  if (prevProps.conversations.length !== nextProps.conversations.length) {
    return false; // Re-render (props ont changé)
  }

  // Vérifier si les IDs ou unread_count ont changé
  for (let i = 0; i < prevProps.conversations.length; i++) {
    const prev = prevProps.conversations[i];
    const next = nextProps.conversations[i];

    if (
      prev.id !== next.id ||
      prev.unread_count !== next.unread_count ||
      prev.last_message?.created_at !== next.last_message?.created_at
    ) {
      return false; // Re-render (conversation a changé)
    }
  }

  // Tous les props identiques → pas de re-render
  return true;
});

export default ConversationTypeSection;
