/**
 * Assistant Service Module
 *
 * Hybrid architecture for cost-effective AI assistance:
 * - FAQ System (Layer 1) - Local, $0
 * - Groq Llama 8B (Layer 2) - Free tier, ultra-fast
 * - Gemini Flash 2.0 (Layer 3) - Cheap, good quality
 * - OpenAI GPT-4o-mini (Layer 4) - Last resort fallback
 */

export {
  // Main service
  processAssistantMessage,
  streamGroqResponse,
  getUsageStats,
  analyzeComplexity,
  isGroqAvailable,
  isGroqConfigured,
  isGeminiConfigured,
  isOpenAIConfigured,
  isAnyAIProviderConfigured,
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
