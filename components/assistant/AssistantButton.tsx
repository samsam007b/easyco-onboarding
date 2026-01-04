'use client';

import { useState, useEffect, useRef, memo, useCallback } from 'react';
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
  ThumbsDown,
  MessageSquarePlus,
  ChevronDown,
  Bug,
  Zap,
  Heart,
  Check,
} from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';
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
  const { getSection } = useLanguage();
  const assistant = getSection('assistant');

  // Dynamic suggested actions based on language
  const localSuggestedActions: SuggestedAction[] = [
    {
      icon: HelpCircle,
      label: assistant?.suggestedActions?.howItWorks || 'How does it work?',
      prompt: assistant?.suggestedActions?.howItWorksPrompt || 'How does IzzIco work? Tell me about the main features.',
    },
    {
      icon: Search,
      label: assistant?.suggestedActions?.findRoommate || 'Find a roommate',
      prompt: assistant?.suggestedActions?.findRoommatePrompt || 'How can I find a coliving that suits me?',
    },
    {
      icon: Filter,
      label: assistant?.suggestedActions?.configureFilters || 'Configure my filters',
      prompt: assistant?.suggestedActions?.configureFiltersPrompt || 'Help me configure my search filters to find the ideal housing.',
    },
    {
      icon: Settings,
      label: assistant?.suggestedActions?.settings || 'Settings',
      prompt: assistant?.suggestedActions?.settingsPrompt || 'How can I change my notification and privacy settings?',
    },
  ];

  // Dynamic feedback prompts based on language
  const localFeedbackPrompts = [
    {
      icon: Lightbulb,
      label: assistant?.feedbackPrompts?.idea || 'An idea?',
      type: 'suggestion' as const,
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Bug,
      label: assistant?.feedbackPrompts?.problem || 'A problem?',
      type: 'bug' as const,
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Zap,
      label: assistant?.feedbackPrompts?.improvement || 'Improvement?',
      type: 'improvement' as const,
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [pendingAction, setPendingAction] = useState<ToolResult | null>(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Inline satisfaction rating state - tracks which message IDs have been rated
  const [ratedMessages, setRatedMessages] = useState<Set<string>>(new Set());
  const [ratingSubmitting, setRatingSubmitting] = useState<string | null>(null);

  // Persistence key for localStorage
  const STORAGE_KEY = 'assistant_state';
  const isInitialized = useRef(false);

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

        // Check if any action involves navigation - if so, ensure we persist open state
        const hasNavigateAction = actions.some(a => a.type === 'navigate');
        if (hasNavigateAction) {
          // Pre-save open state before navigation
          try {
            const state = {
              isOpen: true,
              ratedMessages: [],
              timestamp: Date.now(),
            };
            localStorage.setItem('assistant_state', JSON.stringify(state));
          } catch {}
        }

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
          message: `${assistant?.navigateTo || 'Navigate to'} ${args.description}`,
        });
      }
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // =====================================================
  // PERSISTENCE: Restore and save conversation state
  // =====================================================

  // Restore state from localStorage on mount
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const state = JSON.parse(stored);
        // Only restore if state is recent (less than 30 minutes old)
        const thirtyMinutes = 30 * 60 * 1000;
        if (state.timestamp && Date.now() - state.timestamp < thirtyMinutes) {
          if (state.isOpen) {
            setIsOpen(true);
          }
          if (state.ratedMessages) {
            setRatedMessages(new Set(state.ratedMessages));
          }
        }
      }
    } catch (error) {
      console.warn('[AssistantButton] Failed to restore state:', error);
    }
  }, []);

  // Save state to localStorage whenever relevant state changes
  useEffect(() => {
    if (!isInitialized.current) return;

    try {
      const state = {
        isOpen,
        ratedMessages: Array.from(ratedMessages),
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('[AssistantButton] Failed to save state:', error);
    }
  }, [isOpen, ratedMessages]);

  // =====================================================
  // INLINE SATISFACTION RATING
  // =====================================================

  const handleInlineRating = useCallback(async (messageId: string, isHelpful: boolean) => {
    if (ratedMessages.has(messageId)) return;

    setRatingSubmitting(messageId);

    try {
      // Submit feedback via the tracking API
      await submitFeedback({
        rating: isHelpful ? 5 : 1,
        text: isHelpful ? 'Helpful response (thumbs up)' : 'Unhelpful response (thumbs down)',
        type: isHelpful ? 'praise' : 'complaint',
      });

      // Mark message as rated
      setRatedMessages(prev => new Set(prev).add(messageId));
    } catch (error) {
      console.warn('[AssistantButton] Failed to submit inline rating:', error);
    } finally {
      setRatingSubmitting(null);
    }
  }, [ratedMessages, submitFeedback]);

  // Execute pending navigation action - KEEP ASSISTANT OPEN
  const executeAction = () => {
    if (pendingAction?.action === 'navigate' && pendingAction.path) {
      // Save current state before navigation so it persists
      try {
        const state = {
          isOpen: true, // Keep open after navigation
          ratedMessages: Array.from(ratedMessages),
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {}

      router.push(pendingAction.path);
      // DON'T close the assistant - keep it open for continuity
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

    // Clear persistence state when user explicitly closes
    try {
      localStorage.removeItem(STORAGE_KEY);
      setRatedMessages(new Set());
    } catch {}
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
        aria-label={assistant?.openAssistant || "Open IzzIco assistant"}
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
              'bg-white superellipse-2xl shadow-2xl',
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
                  <h3 className="text-white font-semibold">{assistant?.title || 'IzzIco Assistant'}</h3>
                  <p className="text-white/80 text-xs">
                    {pathname ? `${assistant?.page || 'Page'}: ${pathname.split('/').pop() || assistant?.home || 'home'}` : assistant?.hereToHelp || 'I\'m here to help you'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-full transition"
                aria-label={assistant?.closeAssistant || "Close assistant"}
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
                      <div className="bg-white superellipse-2xl rounded-tl-sm p-4 shadow-sm">
                        <p className="text-gray-800 text-sm">
                          {assistant?.welcome?.greeting || "Hello! I'm the IzzIco assistant. I can help you:"}
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          <li className="flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 text-purple-500" />
                            {assistant?.welcome?.helpItem1 || 'Understand the features'}
                          </li>
                          <li className="flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 text-purple-500" />
                            {assistant?.welcome?.helpItem2 || 'Configure your search filters'}
                          </li>
                          <li className="flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 text-purple-500" />
                            {assistant?.welcome?.helpItem3 || 'Navigate the application'}
                          </li>
                          <li className="flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 text-purple-500" />
                            {assistant?.welcome?.helpItem4 || 'Change your settings'}
                          </li>
                        </ul>
                      </div>

                      {/* Suggestion prompt in welcome */}
                      <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 superellipse-xl border border-amber-200">
                        <div className="flex items-center gap-2 text-amber-700">
                          <Lightbulb className="w-4 h-4" />
                          <span className="text-xs font-medium">{assistant?.welcome?.opinionMatters || 'Your opinion matters!'}</span>
                        </div>
                        <p className="text-xs text-amber-600 mt-1">
                          {assistant?.welcome?.shareIdeas || "Feel free to share your improvement ideas or features you'd like to see."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Suggested Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    {localSuggestedActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedAction(action.prompt)}
                        disabled={isLoading}
                        className={cn(
                          'flex items-center gap-2 p-3 bg-white superellipse-xl border border-gray-200 transition text-left group',
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
                      'w-full flex items-center justify-center gap-2 p-3 superellipse-xl transition font-medium text-sm',
                      isLoading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                    )}
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    {assistant?.proposeIdea || 'Propose an idea or improvement'}
                  </button>
                </div>
              )}

              {/* Chat Messages */}
              {messages.map((message, index) => {
                const messageId = message.id || `msg-${index}`;
                const isAssistant = message.role === 'assistant';
                const isRated = ratedMessages.has(messageId);
                const isSubmitting = ratingSubmitting === messageId;

                return (
                  <div key={messageId} className="space-y-2">
                    <div
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
                          'max-w-[80%] superellipse-2xl p-3 shadow-sm',
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-tr-sm'
                            : 'bg-white text-gray-800 rounded-tl-sm'
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{getMessageText(message)}</p>
                      </div>
                    </div>

                    {/* Inline satisfaction rating for assistant messages */}
                    {isAssistant && !isLoading && (
                      <div className="flex items-center gap-2 ml-11">
                        {isRated ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1 text-xs text-green-600"
                          >
                            <Check className="w-3 h-3" />
                            <span>{assistant?.feedback?.thankYou || 'Thank you!'}</span>
                          </motion.div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-400 mr-1">
                              {assistant?.feedback?.wasHelpful || 'Helpful?'}
                            </span>
                            <button
                              onClick={() => handleInlineRating(messageId, true)}
                              disabled={isSubmitting}
                              className={cn(
                                'p-1.5 rounded-full transition hover:bg-green-50',
                                isSubmitting && 'opacity-50 cursor-not-allowed'
                              )}
                              aria-label={assistant?.feedback?.helpful || 'Helpful'}
                            >
                              <ThumbsUp className="w-3.5 h-3.5 text-gray-400 hover:text-green-600" />
                            </button>
                            <button
                              onClick={() => handleInlineRating(messageId, false)}
                              disabled={isSubmitting}
                              className={cn(
                                'p-1.5 rounded-full transition hover:bg-red-50',
                                isSubmitting && 'opacity-50 cursor-not-allowed'
                              )}
                              aria-label={assistant?.feedback?.notHelpful || 'Not helpful'}
                            >
                              <ThumbsDown className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white superellipse-2xl rounded-tl-sm p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                      <span className="text-sm text-gray-500">{assistant?.thinking || 'Thinking...'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Execution Feedback */}
              {(pendingAssistantActions.length > 0 || executedActions.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 superellipse-xl p-3 border border-indigo-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-900">
                      {executedActions.length > 0 ? (assistant?.actionsCompleted || 'Actions completed') : (assistant?.actionsInProgress || 'Actions in progress...')}
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
                  className="bg-gradient-to-r from-purple-50 to-indigo-50 superellipse-xl p-4 border border-purple-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">{assistant?.suggestedAction || 'Suggested action'}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{pendingAction.message}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={executeAction}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {assistant?.execute || 'Execute'}
                    </button>
                    <button
                      onClick={() => setPendingAction(null)}
                      className="px-4 py-2 bg-white text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition text-sm border border-gray-200"
                    >
                      {assistant?.ignore || 'Ignore'}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Feedback Prompt (shows after a few messages) */}
              {showFeedbackPrompt && messages.length >= 3 && feedbackMode === 'none' && !feedbackSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 superellipse-xl p-4 border border-purple-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <span className="font-medium text-gray-900">{assistant?.feedback?.weCareAboutYourOpinion || 'We care about your feedback!'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {localFeedbackPrompts.map((prompt, index) => (
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
                  className="bg-white superellipse-xl p-4 shadow-sm border border-gray-200"
                >
                  <p className="text-sm font-medium text-gray-900 mb-3">{assistant?.feedback?.rateConversation || 'How would you rate this conversation?'}</p>
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
                    placeholder={assistant?.feedback?.commentOptional || 'Any comment? (optional)'}
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
                      {assistant?.feedback?.send || 'Send'}
                    </button>
                    <button
                      onClick={() => setFeedbackMode('none')}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm transition"
                    >
                      {assistant?.feedback?.cancel || 'Cancel'}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Suggestion UI */}
              {feedbackMode === 'suggestion' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white superellipse-xl p-4 shadow-sm border border-gray-200"
                >
                  <p className="text-sm font-medium text-gray-900 mb-3">
                    {assistant?.suggestion?.shareIdea || 'Share your idea or suggestion!'}
                  </p>

                  {/* Category selector */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[
                      { value: 'new_feature', label: assistant?.suggestion?.newFeature || 'New feature', icon: Sparkles },
                      { value: 'improvement', label: assistant?.suggestion?.improvementLabel || 'Improvement', icon: Zap },
                      { value: 'ui_ux', label: assistant?.suggestion?.designUx || 'Design/UX', icon: Heart },
                      { value: 'other', label: assistant?.suggestion?.other || 'Other', icon: MessageCircle },
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
                    placeholder={assistant?.suggestion?.placeholder || "Describe your idea in detail... What would you like to see in the app?"}
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
                      {assistant?.suggestion?.sendSuggestion || 'Send my suggestion'}
                    </button>
                    <button
                      onClick={() => setFeedbackMode('none')}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm transition"
                    >
                      {assistant?.feedback?.cancel || 'Cancel'}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Thanks message */}
              {feedbackMode === 'thanks' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 superellipse-xl p-4 border border-green-200 text-center"
                >
                  <div className="w-12 h-12 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-3">
                    <ThumbsUp className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-medium text-green-800">{assistant?.thanks?.title || 'Thank you for your feedback!'}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {assistant?.thanks?.description || 'Your feedback helps us improve IzzIco.'}
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
                  placeholder={assistant?.inputPlaceholder || 'Ask a question or share an idea...'}
                  className="flex-1 px-4 py-3 bg-gray-100 superellipse-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                  disabled={isLoading || feedbackMode !== 'none'}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim() || feedbackMode !== 'none'}
                  className={cn(
                    'p-3 superellipse-xl transition',
                    input.trim() && !isLoading && feedbackMode === 'none'
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  )}
                  aria-label={assistant?.feedback?.send || 'Send'}
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
                  {assistant?.improvementIdea || 'An improvement idea?'}
                </button>
              )}

              <p className="mt-2 text-xs text-gray-400 text-center">
                {assistant?.footer || 'Powered by AI • Your feedback improves IzzIco'}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default AssistantButton;
