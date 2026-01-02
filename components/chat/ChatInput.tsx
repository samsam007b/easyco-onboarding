'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

interface ChatInputProps {
  onSendMessage: (message: string, imageUrl?: string) => Promise<void>;
  onTyping?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  onTyping,
  disabled = false,
  placeholder,
}: ChatInputProps) {
  const { language, getSection } = useLanguage();
  const t = getSection('components')?.chat;
  const defaultPlaceholder = t?.placeholder?.[language] || 'Write your message...';
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!message.trim() || sending) return;

    try {
      setSending(true);
      await onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t?.sendError?.[language] || 'Unable to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (onTyping) {
      onTyping();
    }

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error(t?.selectImage?.[language] || 'Please select an image');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t?.imageTooLarge?.[language] || 'Image is too large (max 5MB)');
      return;
    }

    try {
      setUploading(true);
      // TODO: Implement image upload to Supabase Storage
      // For now, just show a message
      toast.info(t?.uploadComingSoon?.[language] || 'Image upload coming soon');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(t?.uploadError?.[language] || 'Unable to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="flex items-end gap-2">
        {/* Image upload button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading || sending}
          className="flex-shrink-0"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ImageIcon className="w-5 h-5" />
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        {/* Message input */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder || defaultPlaceholder}
          disabled={disabled || sending}
          className="min-h-[44px] max-h-[120px] resize-none"
          rows={1}
        />

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled || sending}
          className="flex-shrink-0"
          size="icon"
        >
          {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </Button>
      </div>

      {/* Hint text */}
      <p className="text-xs text-gray-500 mt-2">
        {t?.hint?.[language] || 'Press Enter to send, Shift+Enter for new line'}
      </p>
    </div>
  );
}
