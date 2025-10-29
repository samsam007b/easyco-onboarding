'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, MoreVertical, Archive, Trash2, ArrowLeft } from 'lucide-react';
import { formatMessageTime, type Message } from '@/lib/services/messaging-service';
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
}

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
}: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || isSending) return;

    const content = messageInput.trim();
    setMessageInput('');
    setIsSending(true);

    try {
      await onSendMessage(content);
      onStopTyping();
    } catch (error) {
      console.error('Error sending message:', error);
      setMessageInput(content); // Restore message on error
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
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="md:hidden rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          {otherUserPhoto ? (
            <img
              src={otherUserPhoto}
              alt={otherUserName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
              {otherUserName.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-900">{otherUserName}</h3>
            {isTyping && (
              <p className="text-xs text-purple-600 animate-pulse">typing...</p>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onArchive && (
              <DropdownMenuItem onClick={onArchive}>
                <Archive className="h-4 w-4 mr-2" />
                Archive conversation
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete conversation
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex items-center justify-center my-4">
              <span className="px-3 py-1 text-xs text-gray-500 bg-white rounded-full border">
                {date}
              </span>
            </div>

            {/* Messages for this date */}
            {msgs.map((message, index) => {
              const isSender = message.sender_id === currentUserId;
              const showAvatar =
                index === msgs.length - 1 ||
                msgs[index + 1]?.sender_id !== message.sender_id;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isSender={isSender}
                  showAvatar={showAvatar}
                  otherUserPhoto={otherUserPhoto}
                  otherUserName={otherUserName}
                />
              );
            })}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-end gap-2">
          <Textarea
            value={messageInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 min-h-[44px] max-h-32 resize-none rounded-2xl"
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || isSending}
            className="rounded-full h-11 w-11 p-0 bg-purple-600 hover:bg-purple-700"
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
  otherUserPhoto?: string;
  otherUserName: string;
}

function MessageBubble({
  message,
  isSender,
  showAvatar,
  otherUserPhoto,
  otherUserName,
}: MessageBubbleProps) {
  // Check if message is deleted
  if (
    (isSender && message.deleted_by_sender) ||
    (!isSender && message.deleted_by_recipient)
  ) {
    return null;
  }

  return (
    <div className={`flex items-end gap-2 mb-2 ${isSender ? 'flex-row-reverse' : ''}`}>
      {/* Avatar (only for last message in group) */}
      <div className="w-8 h-8 flex-shrink-0">
        {showAvatar && !isSender && (
          <>
            {otherUserPhoto ? (
              <img
                src={otherUserPhoto}
                alt={otherUserName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
                {otherUserName.charAt(0).toUpperCase()}
              </div>
            )}
          </>
        )}
      </div>

      {/* Message bubble */}
      <div className={`flex flex-col max-w-[70%] ${isSender ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isSender
              ? 'bg-purple-600 text-white rounded-br-sm'
              : 'bg-white text-gray-900 border rounded-bl-sm'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          {message.edited && (
            <span className="text-xs opacity-70 italic ml-2">(edited)</span>
          )}
        </div>

        {/* Timestamp and read status */}
        <div className="flex items-center gap-1 mt-1 px-1">
          <span className="text-xs text-gray-500">
            {formatMessageTime(message.created_at)}
          </span>
          {isSender && message.read_by_recipient && (
            <span className="text-xs text-purple-600">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to group messages by date
function groupMessagesByDate(messages: Message[]): Record<string, Message[]> {
  const grouped: Record<string, Message[]> = {};

  messages.forEach((message) => {
    const date = new Date(message.created_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateKey: string;
    if (date.toDateString() === today.toDateString()) {
      dateKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'Yesterday';
    } else {
      dateKey = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
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
