'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, MoreVertical, Archive, Trash2, ArrowLeft, Phone, Video, CheckCheck, Check } from 'lucide-react';
import { formatMessageTime, type Message } from '@/lib/services/messaging-service';
import { ImageUploadButton } from './ImageUploadButton';
import { MessageImage } from './MessageImage';
import { useMessageSound } from '@/lib/hooks/use-message-sound';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChatWindowProps {
  conversationId: string;
  messages: Message[];
  currentUserId: string;
  otherUserName: string;
  otherUserPhoto?: string;
  isTyping: boolean;
  onSendMessage: (content: string) => Promise<void>;
  onStartTyping: () => void;
  onStopTyping: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
  variant?: 'searcher' | 'owner' | 'hub';
}

const variantStyles = {
  searcher: {
    header: 'bg-gradient-to-r from-searcher-50 to-searcher-100/50',
    sendButton: 'bg-gradient-searcher hover:opacity-90',
    senderBubble: 'bg-gradient-to-br from-searcher-500 to-orange-500 text-white',
    receiverBubble: 'bg-white border border-gray-100 text-gray-900',
    typing: 'text-searcher-600',
    avatarGradient: 'from-searcher-500 to-orange-500',
    readIndicator: 'text-searcher-500',
  },
  owner: {
    header: 'bg-gradient-to-r from-purple-50 to-indigo-100/50',
    sendButton: 'bg-gradient-to-br from-purple-500 to-indigo-500 hover:opacity-90',
    senderBubble: 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white',
    receiverBubble: 'bg-white border border-gray-100 text-gray-900',
    typing: 'text-purple-600',
    avatarGradient: 'from-purple-500 to-pink-500',
    readIndicator: 'text-purple-500',
  },
  hub: {
    header: 'bg-gradient-to-r from-orange-50 to-red-100/50',
    sendButton: 'bg-gradient-to-br from-orange-500 to-red-500 hover:opacity-90',
    senderBubble: 'bg-gradient-to-br from-orange-500 to-red-500 text-white',
    receiverBubble: 'bg-white border border-gray-100 text-gray-900',
    typing: 'text-orange-600',
    avatarGradient: 'from-orange-500 to-red-500',
    readIndicator: 'text-orange-500',
  },
};

export function ChatWindow({
  conversationId,
  messages,
  currentUserId,
  otherUserName,
  otherUserPhoto,
  isTyping,
  onSendMessage,
  onStartTyping,
  onStopTyping,
  onArchive,
  onDelete,
  onBack,
  variant = 'searcher',
}: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    width: number;
    height: number;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const previousMessagesLengthRef = useRef(messages.length);
  const { playSound } = useMessageSound();
  const styles = variantStyles[variant];
  const { language, getSection } = useLanguage();
  const messaging = getSection('messaging');

  // Locale mapping for date formatting
  const localeMap: Record<string, string> = {
    fr: 'fr-FR',
    en: 'en-US',
    nl: 'nl-NL',
    de: 'de-DE',
  };
  const locale = localeMap[language] || 'fr-FR';

  // Auto-scroll to bottom when new messages arrive and play sound for incoming messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Play sound for new incoming messages (not sent by current user)
    if (messages.length > previousMessagesLengthRef.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.sender_id !== currentUserId) {
        playSound();
      }
    }

    previousMessagesLengthRef.current = messages.length;
  }, [messages, currentUserId, playSound]);

  const handleSendMessage = async () => {
    if ((!messageInput.trim() && !selectedImage) || isSending) return;

    const content = messageInput.trim() || (selectedImage ? '📷 Image' : '');
    const imageData = selectedImage;

    setMessageInput('');
    setSelectedImage(null);
    setIsSending(true);

    try {
      await onSendMessage(content);
      onStopTyping();
    } catch (error) {
      console.error('Error sending message:', error);
      setMessageInput(content); // Restore message on error
      setSelectedImage(imageData); // Restore image on error
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (value: string) => {
    setMessageInput(value);

    // Send typing indicator
    if (value.length > 0) {
      onStartTyping();

      // Reset typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        onStopTyping();
      }, 3000);
    } else {
      onStopTyping();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages, locale, messaging);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className={cn('flex items-center justify-between px-4 py-3 border-b border-gray-100', styles.header)}>
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="md:hidden rounded-full hover:bg-white/50"
              aria-label={messaging?.back || "Back"}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          <div className="relative">
            {otherUserPhoto ? (
              <Image
                src={otherUserPhoto}
                alt={otherUserName}
                width={44}
                height={44}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm"
                priority={false}
              />
            ) : (
              <div className={cn('w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold shadow-sm bg-gradient-to-br', styles.avatarGradient)}>
                {otherUserName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">{otherUserName}</h3>
            <AnimatePresence>
              {isTyping && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn('text-xs font-medium', styles.typing)}
                >
                  <span className="inline-flex items-center gap-1">
                    {messaging?.isTyping || "est en train d'écrire"}
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/50" aria-label={messaging?.moreOptions || "Plus d'options"}>
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {onArchive && (
              <DropdownMenuItem onClick={onArchive} className="cursor-pointer">
                <Archive className="h-4 w-4 mr-2" />
                {messaging?.archive || "Archiver"}
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={onDelete} className="text-red-600 cursor-pointer">
                <Trash2 className="h-4 w-4 mr-2" />
                {messaging?.delete || "Supprimer"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-gray-50">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex items-center justify-center my-6">
              <div className="flex items-center gap-4 w-full">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
                <span className="px-4 py-1.5 text-xs font-medium text-gray-500 bg-white rounded-full border border-gray-100 shadow-sm">
                  {date}
                </span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
              </div>
            </div>

            {/* Messages for this date */}
            <div className="space-y-3">
              {msgs.map((message, index) => {
                const isSender = message.sender_id === currentUserId;
                const showAvatar =
                  index === msgs.length - 1 ||
                  msgs[index + 1]?.sender_id !== message.sender_id;
                const isFirstInGroup =
                  index === 0 ||
                  msgs[index - 1]?.sender_id !== message.sender_id;

                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isSender={isSender}
                    showAvatar={showAvatar}
                    isFirstInGroup={isFirstInGroup}
                    otherUserPhoto={otherUserPhoto}
                    otherUserName={otherUserName}
                    variant={variant}
                    styles={styles}
                    messaging={messaging}
                  />
                );
              })}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-end gap-3">
          <ImageUploadButton
            onImageSelected={(url, width, height) =>
              setSelectedImage({ url, width, height })
            }
            onImageRemoved={() => setSelectedImage(null)}
            disabled={isSending}
          />

          <div className="flex-1">
            {selectedImage && (
              <div className="mb-2">
                <MessageImage
                  imageUrl={selectedImage.url}
                  width={selectedImage.width}
                  height={selectedImage.height}
                />
              </div>
            )}

            <Textarea
              value={messageInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={messaging?.placeholder || "Écrivez votre message..."}
              className="min-h-[48px] max-h-32 resize-none superellipse-2xl border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-300 transition-colors"
              rows={1}
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={(!messageInput.trim() && !selectedImage) || isSending}
            className={cn(
              'rounded-full h-12 w-12 p-0 shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100',
              styles.sendButton
            )}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  isSender: boolean;
  showAvatar: boolean;
  isFirstInGroup: boolean;
  otherUserPhoto?: string;
  otherUserName: string;
  variant: 'searcher' | 'owner' | 'hub';
  styles: typeof variantStyles.searcher;
  messaging: Record<string, string> | undefined;
}

function MessageBubble({
  message,
  isSender,
  showAvatar,
  isFirstInGroup,
  otherUserPhoto,
  otherUserName,
  variant,
  styles,
  messaging,
}: MessageBubbleProps) {
  // Check if message is deleted
  if (
    (isSender && message.deleted_by_sender) ||
    (!isSender && message.deleted_by_recipient)
  ) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn('flex items-end gap-2', isSender ? 'flex-row-reverse' : '')}
    >
      {/* Avatar (only for last message in group) */}
      <div className="w-8 h-8 flex-shrink-0">
        {showAvatar && !isSender && (
          <>
            {otherUserPhoto ? (
              <Image
                src={otherUserPhoto}
                alt={otherUserName}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover shadow-sm"
                priority={false}
              />
            ) : (
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm bg-gradient-to-br', styles.avatarGradient)}>
                {otherUserName.charAt(0).toUpperCase()}
              </div>
            )}
          </>
        )}
      </div>

      {/* Message bubble */}
      <div className={cn('flex flex-col max-w-[75%]', isSender ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'px-4 py-2.5 shadow-sm',
            isSender
              ? cn(styles.senderBubble, 'superellipse-2xl', isFirstInGroup ? 'rounded-tr-md' : '', showAvatar ? 'rounded-br-md' : '')
              : cn(styles.receiverBubble, 'superellipse-2xl', isFirstInGroup ? 'rounded-tl-md' : '', showAvatar ? 'rounded-bl-md' : '')
          )}
        >
          {/* Image if present */}
          {message.image_url && (
            <MessageImage
              imageUrl={message.image_url}
              width={message.image_width}
              height={message.image_height}
            />
          )}

          {/* Text content */}
          {message.content && (
            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
          )}

          {message.edited && (
            <span className="text-xs opacity-70 italic ml-2">({messaging?.edited || "modifié"})</span>
          )}
        </div>

        {/* Timestamp and read status */}
        {showAvatar && (
          <div className="flex items-center gap-1.5 mt-1 px-1">
            <span className="text-xs text-gray-400 tabular-nums">
              {formatMessageTime(message.created_at)}
            </span>
            {isSender && (
              <span className={styles.readIndicator}>
                {message.read_by_recipient ? (
                  <CheckCheck className="w-3.5 h-3.5" />
                ) : (
                  <Check className="w-3.5 h-3.5 text-gray-400" />
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Helper function to group messages by date
function groupMessagesByDate(
  messages: Message[],
  locale: string = 'fr-FR',
  messaging?: Record<string, string>
): Record<string, Message[]> {
  const grouped: Record<string, Message[]> = {};

  messages.forEach((message) => {
    const date = new Date(message.created_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateKey: string;
    if (date.toDateString() === today.toDateString()) {
      dateKey = messaging?.today || "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = messaging?.yesterday || 'Hier';
    } else {
      dateKey = date.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(message);
  });

  return grouped;
}
