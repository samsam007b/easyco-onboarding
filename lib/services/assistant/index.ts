/**
 * Assistant Service Module
 *
 * Hybrid architecture for cost-effective AI assistance:
 * - FAQ System (Layer 1) - Local, $0
 * - Groq Llama 8B (Layer 2) - Free tier, ultra-fast
 * - OpenAI GPT-4o-mini (Layer 3) - Paid fallback
 */

export {
  // Main service
  processAssistantMessage,
  streamGroqResponse,
  getUsageStats,
  analyzeComplexity,
  isGroqAvailable,
  ASSISTANT_CONFIG,
  SYSTEM_PROMPT,
  type AssistantResponse,
  type ChatMessage,
} from './assistant-service';

export {
  // FAQ System
  tryFAQAnswer,
  detectIntent,
  getFAQResponse,
  DEFAULT_USER_CONTEXT,
  type Intent,
  type UserContext,
} from './faq-system';
