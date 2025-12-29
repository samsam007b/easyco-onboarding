/**
 * HYBRID ASSISTANT SERVICE
 *
 * Architecture en 3 couches pour minimiser les coûts :
 *
 * Layer 1: FAQ System (LOCAL) - 70% des queries - $0
 *          → Intent detection + réponses prédéfinies
 *
 * Layer 2: Groq Llama 8B - 28% des queries - ~$0
 *          → 6000 req/jour gratuites, ultra-rapide
 *
 * Layer 3: OpenAI GPT-4o-mini - 2% des queries - $$
 *          → Questions complexes, escalade manuelle
 *
 * Estimation coût: < $5/mois pour 5000 conversations
 */

import {
  tryFAQAnswer,
  detectIntent,
  type Intent,
  type UserContext,
  DEFAULT_USER_CONTEXT,
} from './faq-system';
import { createClient } from '@/lib/auth/supabase-server';

// =====================================================
// CONFIGURATION
// =====================================================

export const ASSISTANT_CONFIG = {
  // FAQ Layer
  faq: {
    enabled: true,
    minConfidence: 0.7, // Threshold to use FAQ response
  },

  // Primary AI (Groq - free tier)
  primary: {
    provider: 'groq' as const,
    model: 'llama-3.1-8b-instant',
    dailyLimit: 6000,
    switchThreshold: 0.8, // Switch at 80% usage
  },

  // Fallback AI (OpenAI - paid)
  fallback: {
    provider: 'openai' as const,
    model: 'gpt-4o-mini',
    triggerConditions: [
      'user_escalation', // User explicitly asks for better AI
      'complexity_high', // Detected complex query
      'groq_unavailable', // Groq limit reached
    ],
  },

  // Cost tracking
  costs: {
    groq: { input: 0.05, output: 0.08 }, // per 1M tokens
    openai: { input: 0.15, output: 0.60 }, // per 1M tokens
    avgTokensPerMessage: 500,
  },
};

// =====================================================
// USAGE TRACKING (in-memory, persisted to DB later)
// =====================================================

interface UsageStats {
  date: string;
  faq: { count: number; saved: number }; // saved = estimated $ saved
  groq: { count: number; tokens: number };
  openai: { count: number; tokens: number };
}

const usageTracker: UsageStats = {
  date: new Date().toISOString().split('T')[0],
  faq: { count: 0, saved: 0 },
  groq: { count: 0, tokens: 0 },
  openai: { count: 0, tokens: 0 },
};

function resetIfNewDay() {
  const today = new Date().toISOString().split('T')[0];
  if (usageTracker.date !== today) {
    usageTracker.date = today;
    usageTracker.faq = { count: 0, saved: 0 };
    usageTracker.groq = { count: 0, tokens: 0 };
    usageTracker.openai = { count: 0, tokens: 0 };
  }
}

export function getUsageStats(): UsageStats & { estimatedCost: number; savedCost: number } {
  resetIfNewDay();

  const groqCost =
    (usageTracker.groq.tokens / 1_000_000) *
    (ASSISTANT_CONFIG.costs.groq.input + ASSISTANT_CONFIG.costs.groq.output) / 2;

  const openaiCost =
    (usageTracker.openai.tokens / 1_000_000) *
    (ASSISTANT_CONFIG.costs.openai.input + ASSISTANT_CONFIG.costs.openai.output) / 2;

  // FAQ saved cost = what it would have cost with OpenAI
  const faqSavedCost =
    (usageTracker.faq.count * ASSISTANT_CONFIG.costs.avgTokensPerMessage / 1_000_000) *
    (ASSISTANT_CONFIG.costs.openai.input + ASSISTANT_CONFIG.costs.openai.output) / 2;

  return {
    ...usageTracker,
    estimatedCost: groqCost + openaiCost,
    savedCost: faqSavedCost,
  };
}

// =====================================================
// COMPLEXITY DETECTION
// =====================================================

interface ComplexityAnalysis {
  score: number; // 0-1
  reasons: string[];
  recommendedProvider: 'faq' | 'groq' | 'openai';
}

/**
 * Analyze message complexity to route to appropriate provider
 */
export function analyzeComplexity(
  message: string,
  conversationLength: number,
  userContext: UserContext = DEFAULT_USER_CONTEXT
): ComplexityAnalysis {
  const reasons: string[] = [];
  let score = 0;

  // Long messages are usually more complex
  if (message.length > 500) {
    score += 0.2;
    reasons.push('long_message');
  }

  // Multiple questions
  const questionMarks = (message.match(/\?/g) || []).length;
  if (questionMarks > 2) {
    score += 0.2;
    reasons.push('multiple_questions');
  }

  // Technical terms
  const technicalTerms = /api|bug|erreur|problème technique|code|debug|crash/i;
  if (technicalTerms.test(message)) {
    score += 0.15;
    reasons.push('technical_content');
  }

  // Comparison requests
  const comparisonTerms = /comparer|différence|versus|vs|plutôt|mieux/i;
  if (comparisonTerms.test(message)) {
    score += 0.15;
    reasons.push('comparison_request');
  }

  // Long conversation = probably complex topic
  if (conversationLength > 5) {
    score += 0.1;
    reasons.push('long_conversation');
  }

  // Explicit escalation request
  const escalationTerms = /parler.*humain|support|aide.*plus|pas.*compris|autre.*réponse/i;
  if (escalationTerms.test(message)) {
    score += 0.3;
    reasons.push('escalation_request');
  }

  // Determine recommended provider
  let recommendedProvider: 'faq' | 'groq' | 'openai' = 'groq';

  if (score < 0.2) {
    // Try FAQ first - pass user context for personalized responses
    const faqResult = tryFAQAnswer(message, ASSISTANT_CONFIG.faq.minConfidence, userContext);
    if (faqResult) {
      recommendedProvider = 'faq';
    }
  } else if (score > 0.6 || reasons.includes('escalation_request')) {
    recommendedProvider = 'openai';
  }

  return {
    score: Math.min(score, 1),
    reasons,
    recommendedProvider,
  };
}

// =====================================================
// PROVIDER AVAILABILITY
// =====================================================

export function isGroqAvailable(): boolean {
  resetIfNewDay();
  const { dailyLimit, switchThreshold } = ASSISTANT_CONFIG.primary;
  const safeLimit = Math.floor(dailyLimit * switchThreshold);
  return usageTracker.groq.count < safeLimit;
}

// =====================================================
// RESPONSE TYPES
// =====================================================

export interface AssistantResponse {
  success: boolean;
  content: string;
  provider: 'faq' | 'groq' | 'openai' | 'error';
  intent?: Intent;
  confidence?: number;
  suggestedActions?: Array<{
    type: 'navigate' | 'explain' | 'contact';
    label: string;
    value: string;
  }>;
  metadata: {
    latencyMs: number;
    tokensUsed?: number;
    costEstimate?: number;
    complexity?: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// =====================================================
// SYSTEM PROMPT (shared across providers)
// =====================================================

export const SYSTEM_PROMPT = `Tu es l'assistant IA d'IzzIco, une plateforme de colocation en Belgique.

## Ton rôle
- Aider les utilisateurs à comprendre et utiliser l'application
- Répondre de manière concise et utile
- Proposer des actions concrètes quand c'est pertinent

## À propos d'IzzIco
- Plateforme connectant propriétaires et chercheurs de colocation
- Système de matching basé sur la personnalité
- Gestion des finances partagées avec scan de tickets
- Messagerie intégrée

## Types d'utilisateurs
- Owner (Propriétaire) : Gère des propriétés, 15,99€/mois
- Resident (Résident) : Vit en colocation, 7,99€/mois
- Searcher (Chercheur) : Recherche une colocation

## Tarifs
- Trial gratuit : 3 mois (owners), 6 mois (residents)
- Parrainage : jusqu'à 24 mois gratuits

## Navigation principale
- /hub : Dashboard résident
- /dashboard/owner : Dashboard propriétaire
- /properties : Mes propriétés
- /search : Rechercher
- /messages : Messagerie
- /settings : Paramètres

## Règles de réponse
1. Réponds TOUJOURS en français
2. Sois concis mais complet
3. Utilise des emojis avec modération
4. Si tu ne sais pas, dis-le honnêtement
5. Propose des actions concrètes (navigation, filtres)`;

// =====================================================
// DATABASE LOGGING (non-blocking)
// =====================================================

interface LogRequestParams {
  userMessage: string;
  provider: 'faq' | 'groq' | 'openai' | 'error';
  intent?: Intent;
  confidence?: number;
  responseTimeMs: number;
  tokensUsed?: number;
  estimatedCost?: number;
  userType?: string;
  pagePath?: string;
  userId?: string;
  conversationId?: string;
}

/**
 * Log assistant request to database for analytics
 * Non-blocking - errors are logged but don't affect response
 */
async function logRequestToDatabase(params: LogRequestParams): Promise<void> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('agent_request_logs').insert({
      user_message: params.userMessage.substring(0, 2000), // Truncate long messages
      detected_intent: params.intent || 'unknown',
      intent_confidence: params.confidence,
      provider: params.provider,
      response_time_ms: params.responseTimeMs,
      tokens_used: params.tokensUsed,
      estimated_cost: params.estimatedCost,
      user_type: params.userType,
      page_path: params.pagePath,
      user_id: params.userId,
      conversation_id: params.conversationId,
    });

    if (error) {
      console.error('[Assistant] Failed to log request:', error.message);
    }
  } catch (err: any) {
    // Non-blocking - just log the error
    console.error('[Assistant] Logging error:', err.message);
  }
}

/**
 * Flag a request for potential FAQ improvement
 * Called when confidence is low or escalation is requested
 */
async function flagForImprovement(
  userMessage: string,
  intent: Intent,
  improvementType: 'low_confidence' | 'escalation' | 'missing_intent' | 'poor_response',
  confidence?: number
): Promise<void> {
  try {
    const supabase = await createClient();

    await supabase.from('agent_improvement_candidates').insert({
      user_message: userMessage.substring(0, 2000),
      detected_intent: intent,
      improvement_type: improvementType,
      current_confidence: confidence,
      status: 'pending',
    });
  } catch (err: any) {
    console.error('[Assistant] Failed to flag for improvement:', err.message);
  }
}

// =====================================================
// GROQ API CALL
// =====================================================

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function callGroq(
  messages: ChatMessage[],
  systemPrompt: string = SYSTEM_PROMPT
): Promise<{ success: boolean; content: string; tokens: number }> {
  const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY not configured');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: ASSISTANT_CONFIG.primary.model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || 'Groq API error');
  }

  const content = data.choices?.[0]?.message?.content || '';
  const tokens = data.usage?.total_tokens || 0;

  return { success: true, content, tokens };
}

// =====================================================
// MAIN ASSISTANT FUNCTION
// =====================================================

/**
 * Process a message through the hybrid assistant pipeline
 *
 * Flow: FAQ → Groq → OpenAI (fallback)
 */
export async function processAssistantMessage(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  options: {
    forceProvider?: 'faq' | 'groq' | 'openai';
    userId?: string;
    userContext?: UserContext;
    pagePath?: string;
    conversationId?: string;
  } = {}
): Promise<AssistantResponse> {
  const startTime = Date.now();
  resetIfNewDay();

  // Use provided context or default
  const context = options.userContext || DEFAULT_USER_CONTEXT;

  console.log(`[Assistant] Processing message: "${userMessage.substring(0, 50)}..."`);
  if (context.firstName) {
    console.log(`[Assistant] User context: ${context.firstName} (${context.userType})`);
  }

  // Analyze complexity with user context
  const complexity = analyzeComplexity(userMessage, conversationHistory.length, context);
  console.log(`[Assistant] Complexity: ${(complexity.score * 100).toFixed(0)}%, Provider: ${complexity.recommendedProvider}`);

  // Force provider if specified
  const targetProvider = options.forceProvider || complexity.recommendedProvider;

  // =====================================================
  // Layer 1: FAQ (LOCAL - $0) - PERSONALIZED
  // =====================================================
  if (targetProvider === 'faq' || (!options.forceProvider && conversationHistory.length === 0)) {
    // Pass user context for personalized responses
    const faqResponse = tryFAQAnswer(userMessage, ASSISTANT_CONFIG.faq.minConfidence, context);

    if (faqResponse && faqResponse.confidence >= ASSISTANT_CONFIG.faq.minConfidence) {
      console.log(`[Assistant] FAQ match: ${faqResponse.intent} (${(faqResponse.confidence * 100).toFixed(0)}%)`);

      // Track usage
      usageTracker.faq.count++;
      usageTracker.faq.saved +=
        (ASSISTANT_CONFIG.costs.avgTokensPerMessage / 1_000_000) *
        ASSISTANT_CONFIG.costs.openai.output;

      const latencyMs = Date.now() - startTime;

      // Log to database (non-blocking)
      logRequestToDatabase({
        userMessage,
        provider: 'faq',
        intent: faqResponse.intent,
        confidence: faqResponse.confidence,
        responseTimeMs: latencyMs,
        estimatedCost: 0,
        userType: context.userType,
        pagePath: options.pagePath,
        userId: options.userId || context.userId,
        conversationId: options.conversationId,
      });

      // Flag for improvement if confidence is borderline
      if (faqResponse.confidence < 0.85 && faqResponse.confidence >= ASSISTANT_CONFIG.faq.minConfidence) {
        flagForImprovement(userMessage, faqResponse.intent, 'low_confidence', faqResponse.confidence);
      }

      return {
        success: true,
        content: faqResponse.response,
        provider: 'faq',
        intent: faqResponse.intent,
        confidence: faqResponse.confidence,
        suggestedActions: faqResponse.suggestedActions,
        metadata: {
          latencyMs,
          costEstimate: 0,
          complexity: complexity.score,
        },
      };
    }
  }

  // =====================================================
  // Layer 2: Groq (FREE TIER - ~$0)
  // =====================================================
  if ((targetProvider === 'groq' || !options.forceProvider) && isGroqAvailable()) {
    try {
      console.log(`[Assistant] Using Groq (${usageTracker.groq.count}/${ASSISTANT_CONFIG.primary.dailyLimit})`);

      const messages: ChatMessage[] = [
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ];

      const groqResult = await callGroq(messages);

      // Track usage
      usageTracker.groq.count++;
      usageTracker.groq.tokens += groqResult.tokens;

      const latencyMs = Date.now() - startTime;
      const costEstimate =
        (groqResult.tokens / 1_000_000) *
        (ASSISTANT_CONFIG.costs.groq.input + ASSISTANT_CONFIG.costs.groq.output) / 2;

      // Detect intent for logging (even though we used AI)
      const detectedIntent = detectIntent(userMessage);

      // Log to database (non-blocking)
      logRequestToDatabase({
        userMessage,
        provider: 'groq',
        intent: detectedIntent?.intent,
        confidence: detectedIntent?.confidence,
        responseTimeMs: latencyMs,
        tokensUsed: groqResult.tokens,
        estimatedCost: costEstimate,
        userType: context.userType,
        pagePath: options.pagePath,
        userId: options.userId || context.userId,
        conversationId: options.conversationId,
      });

      return {
        success: true,
        content: groqResult.content,
        provider: 'groq',
        metadata: {
          latencyMs,
          tokensUsed: groqResult.tokens,
          costEstimate,
          complexity: complexity.score,
        },
      };
    } catch (error: any) {
      console.error('[Assistant] Groq error:', error.message);
      // Fall through to OpenAI
    }
  }

  // =====================================================
  // Layer 3: OpenAI (FALLBACK - $$)
  // =====================================================
  if (targetProvider === 'openai' || !isGroqAvailable()) {
    console.log('[Assistant] Using OpenAI fallback');

    const latencyMs = Date.now() - startTime;
    const detectedIntent = detectIntent(userMessage);

    // Log OpenAI usage (will be updated with actual cost by the route)
    logRequestToDatabase({
      userMessage,
      provider: 'openai',
      intent: detectedIntent?.intent,
      confidence: detectedIntent?.confidence,
      responseTimeMs: latencyMs,
      userType: context.userType,
      pagePath: options.pagePath,
      userId: options.userId || context.userId,
      conversationId: options.conversationId,
    });

    // Flag escalation requests for potential FAQ improvement
    if (complexity.reasons.includes('escalation_request')) {
      flagForImprovement(
        userMessage,
        detectedIntent?.intent || 'unknown',
        'escalation',
        detectedIntent?.confidence
      );
    }

    // Note: OpenAI call is handled by the existing Vercel AI SDK in the route
    // We return a special response to indicate the route should use OpenAI
    return {
      success: true,
      content: '__USE_OPENAI__', // Signal to use OpenAI streaming
      provider: 'openai',
      metadata: {
        latencyMs,
        complexity: complexity.score,
      },
    };
  }

  // =====================================================
  // Error fallback
  // =====================================================
  const errorLatencyMs = Date.now() - startTime;
  const errorIntent = detectIntent(userMessage);

  // Log error for analysis
  logRequestToDatabase({
    userMessage,
    provider: 'error',
    intent: errorIntent?.intent,
    confidence: errorIntent?.confidence,
    responseTimeMs: errorLatencyMs,
    userType: context.userType,
    pagePath: options.pagePath,
    userId: options.userId || context.userId,
    conversationId: options.conversationId,
  });

  return {
    success: false,
    content: "Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants.",
    provider: 'error',
    metadata: {
      latencyMs: errorLatencyMs,
      complexity: complexity.score,
    },
  };
}

// =====================================================
// STREAMING SUPPORT FOR GROQ
// =====================================================

export async function* streamGroqResponse(
  messages: ChatMessage[],
  systemPrompt: string = SYSTEM_PROMPT
): AsyncGenerator<string, void, unknown> {
  const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY not configured');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: ASSISTANT_CONFIG.primary.model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 1024,
      temperature: 0.7,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('No response body');
  }

  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
  }
}

// Note: ASSISTANT_CONFIG, isGroqAvailable, and analyzeComplexity
// are already exported inline with their declarations above.
