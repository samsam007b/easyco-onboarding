'use client';

import { useState, useEffect, useRef, memo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  Settings,
  Search,
  Filter,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  Star,
  Lightbulb,
  ThumbsUp,
  MessageSquarePlus,
  ChevronDown,
  Bug,
  Zap,
  Heart,
} from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { cn } from '@/lib/utils';
import { useAssistantConversation } from '@/hooks/useAssistantConversation';
import {
  parseActionsFromResponse,
  useOptionalAssistantActions,
  type AssistantAction,
  type ActionResult,
} from '@/lib/assistant';

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

// Feedback prompts shown after conversations
const feedbackPrompts = [
  {
    icon: Lightbulb,
    label: 'Une idée ?',
    type: 'suggestion' as const,
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Bug,
    label: 'Un problème ?',
    type: 'bug' as const,
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: Zap,
    label: 'Amélioration ?',
    type: 'improvement' as const,
    color: 'from-blue-500 to-cyan-500',
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

type FeedbackMode = 'none' | 'rating' | 'suggestion' | 'thanks';
type SuggestionCategory = 'ui_ux' | 'new_feature' | 'improvement' | 'integration' | 'performance' | 'other';

// OPTIMIZED: Wrapped with React.memo to prevent unnecessary re-renders
const AssistantButton = memo(function AssistantButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [pendingAction, setPendingAction] = useState<ToolResult | null>(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Action system (optional - works even if provider not present)
  const actionContext = useOptionalAssistantActions();
  const [pendingAssistantActions, setPendingAssistantActions] = useState<AssistantAction[]>([]);
  const [executedActions, setExecutedActions] = useState<ActionResult[]>([]);

  // Feedback state
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>('none');
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [suggestionCategory, setSuggestionCategory] = useState<SuggestionCategory>('new_feature');
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);

  // Conversation tracking
  const {
    conversationId,
    saveMessage,
    endConversation,
    submitFeedback,
    submitSuggestion,
    feedbackSubmitted,
  } = useAssistantConversation();

  const {
    messages,
    sendMessage,
    status,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/assistant/chat',
    }),
    onFinish: async (result) => {
      setHasNewMessage(true);
      // Save assistant message - extract text from the message
      const msg = result.message;
      let rawText = '';
      if ('parts' in msg && Array.isArray(msg.parts)) {
        rawText = msg.parts
          .filter((part: any): part is { type: 'text'; text: string } => part.type === 'text')
          .map((part: { type: 'text'; text: string }) => part.text)
          .join('');
      } else if ('content' in msg && typeof msg.content === 'string') {
        rawText = msg.content;
      }

      // Parse actions from response
      const { cleanedText, actions } = parseActionsFromResponse(rawText);

      // Save cleaned text (without action markers)
      saveMessage(cleanedText, 'assistant');

      // Execute actions if action context is available
      if (actions.length > 0 && actionContext) {
        console.log('[AssistantButton] Parsed actions:', actions);
        setPendingAssistantActions(actions);

        // Execute actions with slight delay for UX
        setTimeout(async () => {
          try {
            const results = await actionContext.executeActions(actions);
            setExecutedActions(results);
            console.log('[AssistantButton] Action results:', results);

            // Clear pending after execution
            setTimeout(() => {
              setPendingAssistantActions([]);
              setExecutedActions([]);
            }, 3000);
          } catch (error) {
            console.error('[AssistantButton] Action execution error:', error);
          }
        }, 500);
      }

      // Show feedback prompt after a few messages
      if (messages.length >= 3 && !feedbackSubmitted) {
        setTimeout(() => setShowFeedbackPrompt(true), 2000);
      }
    },
    onToolCall: async ({ toolCall }) => {
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
  }, [messages, feedbackMode]);

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

  // Handle closing the chat
  const handleClose = async () => {
    setIsOpen(false);
    if (messages.length > 0) {
      await endConversation();
    }
    // Reset feedback state
    setFeedbackMode('none');
    setRating(0);
    setFeedbackText('');
    setShowFeedbackPrompt(false);
  };

  const handleSuggestedAction = async (prompt: string) => {
    // Prevent double-click while loading
    if (isLoading) return;

    // Save user message (fire-and-forget, non-blocking)
    saveMessage(prompt, 'user');
    await sendMessage({ text: prompt });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      // Save user message (fire-and-forget, non-blocking)
      saveMessage(input.trim(), 'user');
      await sendMessage({ text: input });
      setInput('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Submit rating feedback
  const handleRatingSubmit = async () => {
    if (rating > 0) {
      await submitFeedback({
        rating,
        text: feedbackText || undefined,
        type: rating >= 4 ? 'praise' : rating <= 2 ? 'complaint' : 'question',
      });
      setFeedbackMode('thanks');
      setTimeout(() => {
        setFeedbackMode('none');
        setShowFeedbackPrompt(false);
      }, 2000);
    }
  };

  // Submit suggestion
  const handleSuggestionSubmit = async () => {
    if (feedbackText.trim()) {
      await submitSuggestion({
        text: feedbackText,
        category: suggestionCategory,
        priority: 'medium',
      });
      setFeedbackMode('thanks');
      setFeedbackText('');
      setTimeout(() => {
        setFeedbackMode('none');
        setShowFeedbackPrompt(false);
      }, 2000);
    }
  };

  // Helper function to extract text from message
  // Handles both AI SDK v6 format (content string) and legacy format (parts array)
  // Also removes action markers from displayed text
  const getMessageText = (message: typeof messages[0]): string => {
    let rawText = '';
    // AI SDK v6: content is a string directly
    if ('content' in message && typeof message.content === 'string') {
      rawText = message.content;
    }
    // Legacy format: parts array
    else if (message.parts && Array.isArray(message.parts)) {
      rawText = message.parts
        .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
        .map(part => part.text)
        .join('');
    }

    // For assistant messages, parse out action markers
    if (message.role === 'assistant' && rawText) {
      const { cleanedText } = parseActionsFromResponse(rawText);
      return cleanedText;
    }

    return rawText;
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
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg',
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
              'fixed bottom-6 right-6 z-50',
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
                  <p className="text-white/80 text-xs">
                    {pathname ? `Page: ${pathname.split('/').pop() || 'accueil'}` : 'Je suis là pour vous aider'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
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

                      {/* Suggestion prompt in welcome */}
                      <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                        <div className="flex items-center gap-2 text-amber-700">
                          <Lightbulb className="w-4 h-4" />
                          <span className="text-xs font-medium">Votre avis compte !</span>
                        </div>
                        <p className="text-xs text-amber-600 mt-1">
                          N'hésitez pas à me partager vos idées d'amélioration ou les fonctionnalités que vous aimeriez voir.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Suggested Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    {suggestedActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedAction(action.prompt)}
                        disabled={isLoading}
                        className={cn(
                          'flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 transition text-left group',
                          isLoading
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:border-purple-300 hover:bg-purple-50'
                        )}
                      >
                        <action.icon className={cn(
                          'w-4 h-4 text-purple-600 transition',
                          !isLoading && 'group-hover:scale-110'
                        )} />
                        <span className="text-xs text-gray-700 font-medium">{action.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Quick suggestion button */}
                  <button
                    onClick={() => setFeedbackMode('suggestion')}
                    disabled={isLoading}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 p-3 rounded-xl transition font-medium text-sm',
                      isLoading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                    )}
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    Proposer une idée ou amélioration
                  </button>
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

              {/* Action Execution Feedback */}
              {(pendingAssistantActions.length > 0 || executedActions.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 border border-indigo-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-900">
                      {executedActions.length > 0 ? 'Actions effectuées' : 'Actions en cours...'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {pendingAssistantActions.map((action, index) => {
                      const result = executedActions[index];
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs text-indigo-700"
                        >
                          {result ? (
                            result.success ? (
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                            ) : (
                              <X className="w-3 h-3 text-red-500" />
                            )
                          ) : (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          )}
                          <span>{result?.message || `${action.type}...`}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Pending Action Card (legacy tool-based actions) */}
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

              {/* Feedback Prompt (shows after a few messages) */}
              {showFeedbackPrompt && messages.length >= 3 && feedbackMode === 'none' && !feedbackSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <span className="font-medium text-gray-900">Votre avis nous intéresse !</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {feedbackPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setFeedbackMode(prompt.type === 'suggestion' || prompt.type === 'improvement' ? 'suggestion' : 'rating');
                          if (prompt.type === 'bug') {
                            setSuggestionCategory('other');
                          } else if (prompt.type === 'improvement') {
                            setSuggestionCategory('improvement');
                          } else {
                            setSuggestionCategory('new_feature');
                          }
                        }}
                        className={cn(
                          'flex flex-col items-center gap-1 p-2 rounded-lg transition',
                          'bg-white border border-gray-200 hover:border-purple-300',
                          'hover:shadow-sm'
                        )}
                      >
                        <div className={cn('p-1.5 rounded-full bg-gradient-to-r', prompt.color)}>
                          <prompt.icon className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-gray-600">{prompt.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Rating Feedback UI */}
              {feedbackMode === 'rating' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <p className="text-sm font-medium text-gray-900 mb-3">Comment évaluez-vous cette conversation ?</p>
                  <div className="flex justify-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 transition hover:scale-110"
                      >
                        <Star
                          className={cn(
                            'w-8 h-8 transition',
                            star <= rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Un commentaire ? (optionnel)"
                    className="w-full p-3 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-300"
                    rows={2}
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleRatingSubmit}
                      disabled={rating === 0}
                      className={cn(
                        'flex-1 py-2 rounded-lg font-medium text-sm transition',
                        rating > 0
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      )}
                    >
                      Envoyer
                    </button>
                    <button
                      onClick={() => setFeedbackMode('none')}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm transition"
                    >
                      Annuler
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Suggestion UI */}
              {feedbackMode === 'suggestion' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <p className="text-sm font-medium text-gray-900 mb-3">
                    Partagez votre idée ou suggestion !
                  </p>

                  {/* Category selector */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[
                      { value: 'new_feature', label: 'Nouvelle fonctionnalité', icon: Sparkles },
                      { value: 'improvement', label: 'Amélioration', icon: Zap },
                      { value: 'ui_ux', label: 'Design/UX', icon: Heart },
                      { value: 'other', label: 'Autre', icon: MessageCircle },
                    ].map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setSuggestionCategory(cat.value as SuggestionCategory)}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition',
                          suggestionCategory === cat.value
                            ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                            : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                        )}
                      >
                        <cat.icon className="w-3 h-3" />
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Décrivez votre idée en détail... Que souhaiteriez-vous voir dans l'application ?"
                    className="w-full p-3 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-300"
                    rows={4}
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleSuggestionSubmit}
                      disabled={!feedbackText.trim()}
                      className={cn(
                        'flex-1 py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2',
                        feedbackText.trim()
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      )}
                    >
                      <Send className="w-4 h-4" />
                      Envoyer ma suggestion
                    </button>
                    <button
                      onClick={() => setFeedbackMode('none')}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm transition"
                    >
                      Annuler
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Thanks message */}
              {feedbackMode === 'thanks' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 text-center"
                >
                  <div className="w-12 h-12 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-3">
                    <ThumbsUp className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-medium text-green-800">Merci pour votre retour !</p>
                  <p className="text-sm text-green-600 mt-1">
                    Votre avis nous aide à améliorer IzzIco.
                  </p>
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
                  placeholder="Posez votre question ou partagez une idée..."
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                  disabled={isLoading || feedbackMode !== 'none'}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim() || feedbackMode !== 'none'}
                  className={cn(
                    'p-3 rounded-xl transition',
                    input.trim() && !isLoading && feedbackMode === 'none'
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  )}
                  aria-label="Envoyer"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Quick feedback button at bottom */}
              {messages.length > 0 && feedbackMode === 'none' && !feedbackSubmitted && (
                <button
                  onClick={() => setFeedbackMode('suggestion')}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition"
                >
                  <Lightbulb className="w-3 h-3" />
                  Une idée d'amélioration ?
                </button>
              )}

              <p className="mt-2 text-xs text-gray-400 text-center">
                Propulsé par IA • Vos retours améliorent IzzIco
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default AssistantButton;
