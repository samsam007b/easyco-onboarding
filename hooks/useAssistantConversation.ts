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
      console.error('Failed to start conversation:', error);
    }
    return null;
  }, [conversation.id, conversation.sessionId, pathname]);

  // Save a message
  const saveMessage = useCallback(async (
    content: string,
    role: 'user' | 'assistant',
    toolCalls?: any,
    toolResults?: any
  ) => {
    let convId = conversation.id;

    // Start conversation if not started
    if (!convId) {
      convId = await startConversation();
    }

    if (!convId) return;

    // Calculate response time for assistant messages
    let responseTimeMs: number | undefined;
    if (role === 'user') {
      messageStartTime.current = Date.now();
    } else if (role === 'assistant' && messageStartTime.current) {
      responseTimeMs = Date.now() - messageStartTime.current;
    }

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
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  }, [conversation.id, pathname, startConversation]);

  // End conversation
  const endConversation = useCallback(async () => {
    if (!conversation.id) return;

    try {
      await fetch('/api/assistant/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'end',
          conversationId: conversation.id,
        }),
      });

      setConversation(prev => ({
        ...prev,
        id: null,
        isActive: false,
      }));
      setFeedbackSubmitted(false);
    } catch (error) {
      console.error('Failed to end conversation:', error);
    }
  }, [conversation.id]);

  // Submit feedback
  const submitFeedback = useCallback(async (feedback: FeedbackData) => {
    if (!conversation.id) return false;

    try {
      const response = await fetch('/api/assistant/conversation', {
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

      if (response.ok) {
        setFeedbackSubmitted(true);
        return true;
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
    return false;
  }, [conversation.id, pathname]);

  // Submit suggestion
  const submitSuggestion = useCallback(async (suggestion: SuggestionData) => {
    // Start conversation if not started
    let convId = conversation.id;
    if (!convId) {
      convId = await startConversation();
    }

    if (!convId) return false;

    try {
      const response = await fetch('/api/assistant/conversation', {
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

      return response.ok;
    } catch (error) {
      console.error('Failed to submit suggestion:', error);
    }
    return false;
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
