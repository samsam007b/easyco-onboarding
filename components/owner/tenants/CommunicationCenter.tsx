'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  MessageCircle,
  Send,
  Clock,
  User,
  ChevronRight,
  Zap,
  FileText,
  AlertCircle,
  CalendarCheck,
  Home,
  Heart,
  CheckCircle,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ownerGradient } from '@/lib/constants/owner-theme';

interface RecentConversation {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantPhoto?: string;
  propertyName: string;
  lastMessage: string;
  lastMessageAt: Date;
  unread: boolean;
  messageType: 'text' | 'maintenance' | 'payment' | 'lease';
}

interface QuickTemplate {
  id: string;
  icon: typeof MessageCircle;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  category: 'reminder' | 'info' | 'welcome' | 'custom';
}

interface CommunicationCenterProps {
  conversations: RecentConversation[];
  tenantCount: number;
  className?: string;
  onSendMessage?: (tenantId: string, templateId?: string) => void;
}

const quickTemplates: QuickTemplate[] = [
  {
    id: 'payment_reminder',
    icon: Bell,
    label: 'Rappel de loyer',
    description: 'Rappel amical pour le paiement du loyer',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 hover:bg-amber-100 border-amber-200',
    category: 'reminder',
  },
  {
    id: 'maintenance_update',
    icon: FileText,
    label: 'Mise à jour maintenance',
    description: 'Informer sur l\'avancement des travaux',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    category: 'info',
  },
  {
    id: 'lease_renewal',
    icon: CalendarCheck,
    label: 'Renouvellement bail',
    description: 'Proposer le renouvellement du bail',
    color: 'text-owner-600',
    bgColor: 'bg-owner-50 hover:bg-owner-100 border-owner-200',
    category: 'reminder',
  },
  {
    id: 'welcome',
    icon: Heart,
    label: 'Message de bienvenue',
    description: 'Accueillir un nouveau locataire',
    color: 'text-owner-600',
    bgColor: 'bg-owner-50 hover:bg-owner-100 border-owner-200',
    category: 'welcome',
  },
];

export function CommunicationCenter({
  conversations,
  tenantCount,
  className,
  onSendMessage
}: CommunicationCenterProps) {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const unreadCount = conversations.filter(c => c.unread).length;

  const getMessageTypeConfig = (type: RecentConversation['messageType']) => {
    const configs = {
      text: { icon: MessageCircle, color: 'text-gray-500' },
      maintenance: { icon: FileText, color: 'text-blue-500' },
      payment: { icon: AlertCircle, color: 'text-amber-500' },
      lease: { icon: CalendarCheck, color: 'text-owner-500' },
    };
    return configs[type];
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length >= 2
      ? `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
      : name.charAt(0).toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white/80 backdrop-blur-sm superellipse-2xl border border-gray-200 shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-sm"
              style={{ background: ownerGradient }}
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Centre de Communication
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-600 rounded-full">
                    {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-500">Restez en contact avec vos locataires</p>
            </div>
          </div>

          <Button
            onClick={() => router.push('/dashboard/owner/messages')}
            variant="outline"
            size="sm"
            className="rounded-full border-gray-200 hover:border-owner-300"
          >
            Voir tout
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* Recent Conversations */}
        <div className="p-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Conversations récentes
          </h4>

          <div className="space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center py-6 text-gray-400">
                <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune conversation</p>
              </div>
            ) : (
              conversations.slice(0, 4).map((conv, index) => {
                const typeConfig = getMessageTypeConfig(conv.messageType);
                const TypeIcon = typeConfig.icon;

                return (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "flex items-center gap-3 p-3 superellipse-xl transition-all cursor-pointer",
                      conv.unread
                        ? "bg-owner-50/50 border border-owner-100"
                        : "bg-gray-50/50 hover:bg-gray-100 border border-transparent"
                    )}
                    onClick={() => router.push(`/dashboard/owner/messages?conversation=${conv.id}`)}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {conv.tenantPhoto ? (
                        <img
                          src={conv.tenantPhoto}
                          alt={conv.tenantName}
                          className="w-10 h-10 superellipse-xl object-cover"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 superellipse-xl flex items-center justify-center text-white font-bold text-sm"
                          style={{ background: ownerGradient }}
                        >
                          {getInitials(conv.tenantName)}
                        </div>
                      )}
                      {conv.unread && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-semibold text-sm truncate",
                          conv.unread ? "text-gray-900" : "text-gray-700"
                        )}>
                          {conv.tenantName}
                        </span>
                        <TypeIcon className={cn("w-3.5 h-3.5 flex-shrink-0", typeConfig.color)} />
                      </div>
                      <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                    </div>

                    {/* Time */}
                    <div className="text-xs text-gray-400 flex-shrink-0">
                      {formatDistanceToNow(conv.lastMessageAt, { addSuffix: false, locale: fr })}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Templates */}
        <div className="p-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Messages rapides
          </h4>

          <div className="grid grid-cols-2 gap-2">
            {quickTemplates.map((template, index) => {
              const Icon = template.icon;
              const isSelected = selectedTemplate === template.id;

              return (
                <motion.button
                  key={template.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setSelectedTemplate(isSelected ? null : template.id);
                    if (!isSelected && onSendMessage) {
                      // Could open a modal to select tenant
                    }
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 superellipse-xl border transition-all text-center",
                    template.bgColor,
                    isSelected && "ring-2 ring-owner-400"
                  )}
                >
                  <Icon className={cn("w-5 h-5", template.color)} />
                  <span className="text-xs font-medium text-gray-700">{template.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Bulk message option */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => router.push('/dashboard/owner/messages/compose?bulk=true')}
            className="w-full mt-4 flex items-center justify-center gap-2 p-3 superellipse-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-owner-300 hover:text-owner-600 transition-all"
          >
            <Send className="w-4 h-4" />
            <span className="text-sm font-medium">Message à tous ({tenantCount})</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default CommunicationCenter;
