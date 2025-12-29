'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Loader2,
  User,
  Bot,
  ArrowRight,
  Home,
  Settings,
  Search,
  Filter,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { cn } from '@/lib/utils';

interface SuggestedAction {
  icon: React.ElementType;
  label: string;
  prompt: string;
}

const suggestedActions: SuggestedAction[] = [
  {
    icon: HelpCircle,
    label: 'Comment ça marche ?',
    prompt: 'Comment fonctionne IzzIco ? Explique-moi les fonctionnalités principales.',
  },
  {
    icon: Search,
    label: 'Trouver une coloc',
    prompt: 'Comment puis-je trouver une colocation qui me correspond ?',
  },
  {
    icon: Filter,
    label: 'Configurer mes filtres',
    prompt: 'Aide-moi à configurer mes filtres de recherche pour trouver le logement idéal.',
  },
  {
    icon: Settings,
    label: 'Paramètres',
    prompt: 'Comment modifier mes paramètres de notification et de confidentialité ?',
  },
];

// Tool result action handler
interface ToolResult {
  action: string;
  path?: string;
  message?: string;
  filters?: Record<string, any>;
  explanation?: string;
  feature?: string;
}

export default function AssistantButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [pendingAction, setPendingAction] = useState<ToolResult | null>(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    sendMessage,
    status,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/assistant/chat',
    }),
    onFinish: () => {
      setHasNewMessage(true);
    },
    onToolCall: async ({ toolCall }) => {
      // Handle tool calls from the assistant
      if (toolCall.toolName === 'navigate' && toolCall.input) {
        const args = toolCall.input as { path: string; description: string };
        setPendingAction({
          action: 'navigate',
          path: args.path,
          message: `Naviguer vers ${args.description}`,
        });
      }
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Execute pending navigation action
  const executeAction = () => {
    if (pendingAction?.action === 'navigate' && pendingAction.path) {
      router.push(pendingAction.path);
      setIsOpen(false);
      setPendingAction(null);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Clear new message indicator when opening chat
  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
    }
  }, [isOpen]);

  const handleSuggestedAction = (prompt: string) => {
    sendMessage({ text: prompt });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Helper function to extract text from message parts
  const getMessageText = (message: typeof messages[0]) => {
    if (!message.parts) return '';
    return message.parts
      .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
      .map(part => part.text)
      .join('');
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-lg',
          'bg-gradient-to-br from-purple-600 to-indigo-600',
          'hover:from-purple-700 hover:to-indigo-700',
          'flex items-center justify-center',
          'transition-all duration-200 hover:scale-110',
          'focus:outline-none focus:ring-4 focus:ring-purple-300',
          isOpen && 'hidden'
        )}
        aria-label="Ouvrir l'assistant IzzIco"
      >
        <MessageCircle className="w-6 h-6 text-white" />

        {/* Notification dot */}
        {hasNewMessage && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white"
          />
        )}

        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-25" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={cn(
              'fixed bottom-6 left-6 z-50',
              'w-[380px] h-[600px] max-h-[80vh]',
              'bg-white rounded-2xl shadow-2xl',
              'flex flex-col overflow-hidden',
              'border border-gray-200'
            )}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Assistant IzzIco</h3>
                  <p className="text-white/80 text-xs">Je suis là pour vous aider</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition"
                aria-label="Fermer l'assistant"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {/* Welcome message if no messages */}
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm">
                        <p className="text-gray-800 text-sm">
                          Bonjour ! Je suis l'assistant IzzIco. Je peux vous aider à :
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          <li className="flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 text-purple-500" />
                            Comprendre les fonctionnalités
                          </li>
                          <li className="flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 text-purple-500" />
                            Configurer vos filtres de recherche
                          </li>
                          <li className="flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 text-purple-500" />
                            Naviguer dans l'application
                          </li>
                          <li className="flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 text-purple-500" />
                            Modifier vos paramètres
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Suggested Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    {suggestedActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedAction(action.prompt)}
                        className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition text-left group"
                      >
                        <action.icon className="w-4 h-4 text-purple-600 group-hover:scale-110 transition" />
                        <span className="text-xs text-gray-700 font-medium">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' && 'flex-row-reverse'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-orange-500 to-amber-500'
                        : 'bg-gradient-to-br from-purple-500 to-indigo-500'
                    )}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl p-3 shadow-sm',
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-tr-sm'
                        : 'bg-white text-gray-800 rounded-tl-sm'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{getMessageText(message)}</p>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                      <span className="text-sm text-gray-500">Réflexion en cours...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Pending Action Card */}
              {pendingAction && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Action suggérée</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{pendingAction.message}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={executeAction}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Exécuter
                    </button>
                    <button
                      onClick={() => setPendingAction(null)}
                      className="px-4 py-2 bg-white text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition text-sm border border-gray-200"
                    >
                      Ignorer
                    </button>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleFormSubmit} className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Posez votre question..."
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className={cn(
                    'p-3 rounded-xl transition',
                    input.trim() && !isLoading
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  )}
                  aria-label="Envoyer"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-400 text-center">
                Propulsé par IA • Réponses en temps réel
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
