'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface ConversationState {
  id: string | null;
  sessionId: string;
  isActive: boolean;
}

interface FeedbackData {
  rating?: number;
  text?: string;
  type?: 'bug' | 'suggestion' | 'question' | 'praise' | 'complaint';
}

interface SuggestionData {
  text: string;
  category?: 'ui_ux' | 'new_feature' | 'improvement' | 'integration' | 'performance' | 'other';
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

// Generate a unique session ID
function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomPart}`;
}

// Get or create session ID from localStorage
function getSessionId(): string {
  if (typeof window === 'undefined') return generateSessionId();

  const stored = localStorage.getItem('assistant_session_id');
  if (stored) {
    // Check if session is still valid (less than 30 minutes old)
    const sessionData = JSON.parse(stored);
    const thirtyMinutes = 30 * 60 * 1000;
    if (Date.now() - sessionData.createdAt < thirtyMinutes) {
      return sessionData.id;
    }
  }

  // Create new session
  const newSession = {
    id: generateSessionId(),
    createdAt: Date.now(),
  };
  localStorage.setItem('assistant_session_id', JSON.stringify(newSession));
  return newSession.id;
}

export function useAssistantConversation() {
  const pathname = usePathname();
  const [conversation, setConversation] = useState<ConversationState>({
    id: null,
    sessionId: '',
    isActive: false,
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const messageStartTime = useRef<number>(0);

  // Initialize session ID on client
  useEffect(() => {
    setConversation(prev => ({
      ...prev,
      sessionId: getSessionId(),
    }));
  }, []);

  // Start a new conversation
  // Note: Fails silently if assistant_conversations table doesn't exist
  const startConversation = useCallback(async () => {
    if (conversation.id) return conversation.id;

    try {
      const response = await fetch('/api/assistant/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          sessionId: conversation.sessionId || getSessionId(),
          page: pathname,
          pageTitle: document.title,
          userAgent: navigator.userAgent,
        }),
      });

      // Silently handle errors (table may not exist in production)
      if (!response.ok) {
        console.debug('[Assistant] Conversation tracking unavailable');
        return null;
      }

      const data = await response.json();
      if (data.conversation) {
        setConversation(prev => ({
          ...prev,
          id: data.conversation.id,
          isActive: true,
        }));
        return data.conversation.id;
      }
    } catch (error) {
      // Silently fail - conversation tracking is optional
      console.debug('[Assistant] Conversation tracking unavailable:', error);
    }
    return null;
  }, [conversation.id, conversation.sessionId, pathname]);

  // Save a message (fire-and-forget, non-blocking)
  // Fails silently if tracking is unavailable
  const saveMessage = useCallback(async (
    content: string,
    role: 'user' | 'assistant',
    toolCalls?: any,
    toolResults?: any
  ) => {
    // Calculate response time for assistant messages
    let responseTimeMs: number | undefined;
    if (role === 'user') {
      messageStartTime.current = Date.now();
    } else if (role === 'assistant' && messageStartTime.current) {
      responseTimeMs = Date.now() - messageStartTime.current;
    }

    // Fire-and-forget: don't await, don't block the UI
    // This ensures the chat works even if tracking fails
    const doSave = async () => {
      let convId = conversation.id;

      // Try to start conversation if not started
      if (!convId) {
        convId = await startConversation();
      }

      // If no conversation ID, tracking is unavailable - skip silently
      if (!convId) return;

      try {
        await fetch('/api/assistant/conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'message',
            conversationId: convId,
            message: content,
            role,
            currentPage: pathname,
            toolCalls,
            toolResults,
            responseTimeMs,
          }),
        });
      } catch {
        // Silently fail - tracking is optional
      }
    };

    // Execute in background without blocking
    doSave();
  }, [conversation.id, pathname, startConversation]);

  // End conversation (fire-and-forget)
  const endConversation = useCallback(async () => {
    if (!conversation.id) {
      // Reset state even if no conversation tracked
      setConversation(prev => ({
        ...prev,
        id: null,
        isActive: false,
      }));
      setFeedbackSubmitted(false);
      return;
    }

    try {
      await fetch('/api/assistant/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'end',
          conversationId: conversation.id,
        }),
      });
    } catch {
      // Silently fail - tracking is optional
    }

    // Always reset state
    setConversation(prev => ({
      ...prev,
      id: null,
      isActive: false,
    }));
    setFeedbackSubmitted(false);
  }, [conversation.id]);

  // Submit feedback
  // Returns true to show success UI even if tracking fails
  const submitFeedback = useCallback(async (feedback: FeedbackData) => {
    // Mark as submitted immediately for better UX
    setFeedbackSubmitted(true);

    if (!conversation.id) {
      // No tracking available, but still show success
      return true;
    }

    try {
      await fetch('/api/assistant/conversation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conversation.id,
          feedbackRating: feedback.rating,
          feedbackText: feedback.text,
          feedbackType: feedback.type,
          currentPage: pathname,
        }),
      });
    } catch {
      // Silently fail - feedback submission UI still works
    }
    return true;
  }, [conversation.id, pathname]);

  // Submit suggestion
  // Returns true to show success UI even if tracking fails
  const submitSuggestion = useCallback(async (suggestion: SuggestionData) => {
    // Try to start conversation if not started
    let convId = conversation.id;
    if (!convId) {
      convId = await startConversation();
    }

    // Even if no tracking, return true for good UX
    if (!convId) return true;

    try {
      await fetch('/api/assistant/conversation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: convId,
          suggestionText: suggestion.text,
          suggestionCategory: suggestion.category,
          suggestionPriority: suggestion.priority,
          currentPage: pathname,
        }),
      });
    } catch {
      // Silently fail - suggestion UI still works
    }
    return true;
  }, [conversation.id, pathname, startConversation]);

  return {
    conversationId: conversation.id,
    isActive: conversation.isActive,
    currentPage: pathname,
    feedbackSubmitted,
    startConversation,
    saveMessage,
    endConversation,
    submitFeedback,
    submitSuggestion,
  };
}
