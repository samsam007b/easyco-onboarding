/**
 * HYBRID ASSISTANT SERVICE
 *
 * Architecture en 4 couches pour minimiser les coûts :
 *
 * Layer 1: FAQ System (LOCAL) - 70% des queries - $0
 *          → Intent detection + réponses prédéfinies
 *
 * Layer 2: Groq Llama 8B - 25% des queries - ~$0
 *          → 6000 req/jour gratuites, ultra-rapide
 *
 * Layer 3: Gemini Flash 2.0 - 4% des queries - $
 *          → Moins cher qu'OpenAI, bonne qualité
 *
 * Layer 4: OpenAI GPT-4o-mini - 1% des queries - $$
 *          → Questions complexes, escalade manuelle
 *
 * Estimation coût: < $3/mois pour 5000 conversations
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

  // Secondary AI (Gemini Flash - cheap)
  secondary: {
    provider: 'gemini' as const,
    model: 'gemini-2.0-flash-exp',
    triggerConditions: [
      'groq_unavailable', // Groq limit reached or error
    ],
  },

  // Fallback AI (OpenAI - paid, last resort)
  fallback: {
    provider: 'openai' as const,
    model: 'gpt-4o-mini',
    triggerConditions: [
      'user_escalation', // User explicitly asks for better AI
      'complexity_high', // Detected complex query
      'gemini_unavailable', // Gemini error
    ],
  },

  // Cost tracking (per 1M tokens)
  costs: {
    groq: { input: 0.05, output: 0.08 },
    gemini: { input: 0.075, output: 0.30 }, // Gemini Flash pricing
    openai: { input: 0.15, output: 0.60 },
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
  gemini: { count: number; tokens: number };
  openai: { count: number; tokens: number };
}

const usageTracker: UsageStats = {
  date: new Date().toISOString().split('T')[0],
  faq: { count: 0, saved: 0 },
  groq: { count: 0, tokens: 0 },
  gemini: { count: 0, tokens: 0 },
  openai: { count: 0, tokens: 0 },
};

function resetIfNewDay() {
  const today = new Date().toISOString().split('T')[0];
  if (usageTracker.date !== today) {
    usageTracker.date = today;
    usageTracker.faq = { count: 0, saved: 0 };
    usageTracker.groq = { count: 0, tokens: 0 };
    usageTracker.gemini = { count: 0, tokens: 0 };
    usageTracker.openai = { count: 0, tokens: 0 };
  }
}

export function getUsageStats(): UsageStats & { estimatedCost: number; savedCost: number } {
  resetIfNewDay();

  const groqCost =
    (usageTracker.groq.tokens / 1_000_000) *
    (ASSISTANT_CONFIG.costs.groq.input + ASSISTANT_CONFIG.costs.groq.output) / 2;

  const geminiCost =
    (usageTracker.gemini.tokens / 1_000_000) *
    (ASSISTANT_CONFIG.costs.gemini.input + ASSISTANT_CONFIG.costs.gemini.output) / 2;

  const openaiCost =
    (usageTracker.openai.tokens / 1_000_000) *
    (ASSISTANT_CONFIG.costs.openai.input + ASSISTANT_CONFIG.costs.openai.output) / 2;

  // FAQ saved cost = what it would have cost with OpenAI
  const faqSavedCost =
    (usageTracker.faq.count * ASSISTANT_CONFIG.costs.avgTokensPerMessage / 1_000_000) *
    (ASSISTANT_CONFIG.costs.openai.input + ASSISTANT_CONFIG.costs.openai.output) / 2;

  return {
    ...usageTracker,
    estimatedCost: groqCost + geminiCost + openaiCost,
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

  // Multiple questions (by question marks)
  const questionMarks = (message.match(/\?/g) || []).length;
  if (questionMarks > 2) {
    score += 0.2;
    reasons.push('multiple_questions');
  }

  // Multi-topic detection (using connectors like "et", "aussi", "également")
  // Pattern: "combien ça coûte et comment marche le matching et aussi le parrainage"
  const multiTopicConnectors = message.match(/\b(et aussi|et comment|et quoi|et où|et quand|et pourquoi|également|en plus)\b/gi) || [];
  if (multiTopicConnectors.length >= 2) {
    score += 0.25;
    reasons.push('multi_topic');
  }

  // Advice/tips requests - needs AI for quality response
  const adviceTerms = /\b(conseil|astuce|recommand|tip|peux-tu|pouvez-vous|comment (bien|mieux|optimiser|améliorer|réussir|rédiger))\b/i;
  if (adviceTerms.test(message)) {
    score += 0.2;
    reasons.push('advice_request');
  }

  // Technical terms - weight increased to ensure AI handles technical issues
  const technicalTerms = /api|bug|erreur|problème technique|code|debug|crash|ne (fonctionne|marche) (pas|plus)|essayé plusieurs fois/i;
  if (technicalTerms.test(message)) {
    score += 0.25;
    reasons.push('technical_content');
  }

  // Comparison requests - weight increased for nuanced comparisons
  const comparisonTerms = /comparer|différence|versus|vs|plutôt|mieux|avantages?.*(inconvénients?)?|pour et contre/i;
  if (comparisonTerms.test(message)) {
    score += 0.25;
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

  // ACTION REQUESTS - User wants to PERFORM an action, not get information
  // These MUST go to AI to emit proper actions, never to FAQ
  const actionRequestTerms = /\b(amène|emmène|am[eè]ne|va\s+(?:à|vers|sur)|navigue|redirige|ouvre|affiche|montre|configure|lance|démarre|active|désactive)\s*(moi|nous)?\s*(à|vers|sur|la|le|les|mes|une?)?/i;
  const actionMatch = actionRequestTerms.test(message);
  console.log(`[Complexity] Action request check: "${message.substring(0, 60)}..." => match=${actionMatch}`);

  if (actionMatch) {
    score += 0.3; // Force to AI tier
    reasons.push('action_request');
    console.log('[Complexity] OK: ACTION REQUEST DETECTED - score now:', score, '- bypassing FAQ');
  }

  // Also detect imperative navigation commands
  const imperativeNavigation = /\b(page|section)\s+(des?\s+)?(finances|messages|paramètres|profil|recherche|propriétés)/i;
  if (imperativeNavigation.test(message) && !reasons.includes('action_request')) {
    // Only add if combined with action-like verbs in the same message
    if (/\b(am[eè]ne|emmène|va|montre|ouvre)\b/i.test(message)) {
      score += 0.3;
      reasons.push('action_request');
      console.log('[Complexity] OK: NAVIGATION REQUEST DETECTED - score now:', score);
    }
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

/**
 * Check if any AI provider is configured (Groq, Gemini, or OpenAI)
 */
export function isAnyAIProviderConfigured(): boolean {
  return isGroqConfigured() || isGeminiConfigured() || isOpenAIConfigured();
}

/**
 * Check if Groq is configured
 */
export function isGroqConfigured(): boolean {
  return !!(process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY);
}

/**
 * Check if Gemini is configured
 * Supports both dedicated Gemini API key and Google Cloud API key
 */
export function isGeminiConfigured(): boolean {
  return !!(process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_CLOUD_API_KEY);
}

/**
 * Check if OpenAI is configured
 */
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

export function isGroqAvailable(): boolean {
  if (!isGroqConfigured()) return false;

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
  provider: 'faq' | 'groq' | 'gemini' | 'openai' | 'error';
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
- Guider vers les bonnes pages et fonctionnalités
- Faciliter la découverte de l'application
- **IMPORTANT: Tu peux effectuer des actions dans l'app (navigation, filtres, modals)**

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

## ACTIONS DISPONIBLES

Tu peux effectuer des actions dans l'app en utilisant ce format EXACT :
[ACTION:type:{"key":"value"}]

### navigate - Naviguer vers une page
[ACTION:navigate:{"path":"/hub/finances","description":"Page des finances"}]

Pages disponibles:
- /hub : Dashboard résident
- /dashboard/owner : Dashboard propriétaire
- /hub/finances : Gestion des finances
- /properties : Mes propriétés
- /properties/add : Ajouter une propriété
- /matching/properties : Rechercher une colocation
- /matching/swipe : Parcourir les annonces (swipe)
- /messages : Messagerie
- /profile : Mon profil
- /settings : Paramètres
- /dashboard/settings/preferences : Notifications et alertes
- /dashboard/subscription : Mon abonnement
- /settings/referrals : Programme de parrainage
- /settings/security : Sécurité du compte
- /about : À propos

### setFilters - Configurer les filtres de recherche
[ACTION:setFilters:{"filters":{"city":"Bruxelles","maxBudget":600}}]

Filtres disponibles: city, minBudget, maxBudget, roomType (private/shared/studio)

### openModal - Ouvrir un formulaire (vide)
[ACTION:openModal:{"modal":"addExpense"}]

Modals disponibles:
- addExpense : Ajouter une dépense (navigue vers /hub/finances)
- addProperty : Ajouter une propriété
- referralShare : Partager son code de parrainage
- feedback : Donner un feedback

### highlightElement - Mettre en évidence un élément
[ACTION:highlightElement:{"selector":"add-expense-button","message":"Cliquez ici pour ajouter une dépense"}]

### scrollToSection - Défiler vers une section
[ACTION:scrollToSection:{"section":"expenses-list","highlight":true}]

### startTour - Lancer un tour guidé
[ACTION:startTour:{"tour":"finances"}]

Tours: onboarding, dashboard, search, finances, messaging, properties, settings, matching, referral

### copyToClipboard - Copier du texte
[ACTION:copyToClipboard:{"text":"CODE123","label":"Code de parrainage"}]

## Règles d'utilisation des actions

1. **Toujours expliquer** ce que tu fais AVANT l'action
2. **Après une action**, explique comment l'utilisateur peut le faire lui-même la prochaine fois
3. **Une action par message** en général, sauf si elles sont liées
4. **L'action doit être sur sa propre ligne**
5. **Ne crée, modifie ou supprime JAMAIS de données** (pas d'ajout de dépense, pas d'envoi de message)

## Exemple de réponse avec action

"Je vais vous amener à la page des finances pour que vous puissiez ajouter votre dépense.

[ACTION:navigate:{"path":"/hub/finances","description":"Page des finances"}]

Une fois sur la page, vous verrez le bouton **+ Ajouter** en haut à droite. C'est là que vous pourrez saisir vos dépenses à l'avenir !"

## Règles de réponse
1. Réponds TOUJOURS en français
2. Sois concis mais utile
3. N'utilise pas d'emojis
4. Si tu ne sais pas, dis-le honnêtement
5. **Utilise les actions quand l'utilisateur veut faire quelque chose**
6. Après chaque action, montre comment faire soi-même`;


// =====================================================
// FAQ-ONLY FALLBACK RESPONSES
// =====================================================

interface FAQFallbackResponse {
  message: string;
  suggestedActions?: Array<{
    type: 'navigate' | 'explain' | 'contact';
    label: string;
    value: string;
  }>;
}

/**
 * Generate a helpful response when no AI providers are configured
 * and the FAQ system didn't find a match.
 *
 * Returns intent-specific guidance with navigation actions.
 */
function getFAQOnlyFallbackResponse(
  userMessage: string,
  intent?: Intent,
  context?: UserContext
): FAQFallbackResponse {
  const userName = context?.firstName ? ` ${context.firstName}` : '';

  // Intent-specific fallbacks with navigation
  const intentFallbacks: Record<string, FAQFallbackResponse> = {
    pricing: {
      message: `Bonjour${userName} ! Pour toutes les informations sur nos tarifs :\n\n• **Trial gratuit** : 3 mois (propriétaires) ou 6 mois (résidents)\n• **Abonnement Owner** : 15,99€/mois\n• **Abonnement Resident** : 7,99€/mois\n• **Parrainage** : Jusqu'à 24 mois gratuits\n\nVous pouvez consulter votre abonnement dans les paramètres.`,
      suggestedActions: [
        { type: 'navigate', label: 'Mon abonnement', value: '/dashboard/subscription' },
        { type: 'navigate', label: 'Parrainage', value: '/settings/referrals' },
      ],
    },
    matching: {
      message: `Notre système de matching analyse vos préférences et votre personnalité pour vous proposer des colocations compatibles.\n\nPour améliorer vos résultats :\n1. Complétez votre profil de personnalité\n2. Définissez vos critères de recherche\n3. Parcourez les annonces suggérées`,
      suggestedActions: [
        { type: 'navigate', label: 'Mon profil', value: '/profile' },
        { type: 'navigate', label: 'Rechercher', value: '/matching/properties' },
      ],
    },
    finances: {
      message: `La gestion des finances partagées vous permet de :\n\n• Scanner vos tickets de caisse\n• Répartir automatiquement les dépenses\n• Suivre qui doit quoi\n• Gérer les comptes communs\n\nAccédez à vos finances depuis votre Hub.`,
      suggestedActions: [
        { type: 'navigate', label: 'Mes finances', value: '/hub/finances' },
        { type: 'navigate', label: 'Ajouter une dépense', value: '/hub/finances' },
      ],
    },
    search: {
      message: `Pour trouver votre colocation idéale :\n\n1. Utilisez les filtres (ville, budget, type)\n2. Consultez les profils compatibles\n3. Envoyez une demande de contact\n\nN'oubliez pas de compléter votre profil pour de meilleures suggestions !`,
      suggestedActions: [
        { type: 'navigate', label: 'Rechercher', value: '/matching/properties' },
        { type: 'navigate', label: 'Mon profil', value: '/profile' },
      ],
    },
    account: {
      message: `Gérez votre compte depuis les paramètres :\n\n• Informations personnelles\n• Notifications\n• Abonnement\n• Sécurité`,
      suggestedActions: [
        { type: 'navigate', label: 'Paramètres', value: '/settings' },
        { type: 'navigate', label: 'Mon profil', value: '/profile' },
      ],
    },
    messaging: {
      message: `La messagerie IzzIco vous permet de communiquer en toute sécurité avec les autres utilisateurs.\n\nVous recevrez une notification pour chaque nouveau message.`,
      suggestedActions: [
        { type: 'navigate', label: 'Mes messages', value: '/messages' },
        { type: 'navigate', label: 'Notifications', value: '/dashboard/settings/preferences' },
      ],
    },
    property: {
      message: `Pour gérer vos propriétés :\n\n• Ajoutez ou modifiez vos annonces\n• Gérez les candidatures\n• Suivez vos résidents actuels\n\nAccédez à votre dashboard propriétaire.`,
      suggestedActions: [
        { type: 'navigate', label: 'Mes propriétés', value: '/properties' },
        { type: 'navigate', label: 'Dashboard', value: '/dashboard/owner' },
      ],
    },
  };

  // Check if we have an intent-specific fallback
  if (intent && intentFallbacks[intent]) {
    return intentFallbacks[intent];
  }

  // Generic fallback with common actions
  return {
    message: `Bonjour${userName} ! Je suis l'assistant IzzIco en mode FAQ.\n\nJe peux vous aider avec :\n• **Navigation** sur la plateforme\n• **Questions fréquentes** sur les tarifs et fonctionnalités\n• **Aide** pour trouver une page\n\nPour une question spécifique, essayez de reformuler ou consultez la page À propos.`,
    suggestedActions: [
      { type: 'navigate', label: 'À propos', value: '/about' },
      { type: 'navigate', label: 'Rechercher', value: '/matching/properties' },
      { type: 'contact', label: 'Contacter le support', value: 'support@izzico.be' },
    ],
  };
}

// =====================================================
// DATABASE LOGGING (fire-and-forget, never blocks)
// =====================================================

interface LogRequestParams {
  userMessage: string;
  provider: 'faq' | 'groq' | 'gemini' | 'openai' | 'error';
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
 * Uses log_agent_request RPC which atomically updates:
 * - agent_request_logs (detailed logs)
 * - agent_intent_stats (aggregated by intent)
 * - agent_daily_stats (daily aggregates)
 *
 * FIRE-AND-FORGET: Never blocks, never throws, silently fails if tables don't exist
 */
function logRequestToDatabase(params: LogRequestParams): void {
  // Wrap in setTimeout to make truly non-blocking
  setTimeout(async () => {
    try {
      const supabase = await createClient();

      // Use the RPC function that atomically updates all stats tables
      const { error } = await supabase.rpc('log_agent_request', {
        p_conversation_id: params.conversationId || null,
        p_message_id: null,
        p_user_message: params.userMessage.substring(0, 2000),
        p_detected_intent: params.intent || 'unknown',
        p_intent_confidence: params.confidence || null,
        p_provider: params.provider,
        p_recommended_provider: null,
        p_complexity_score: null,
        p_complexity_reasons: null,
        p_response_time_ms: params.responseTimeMs,
        p_tokens_used: params.tokensUsed || null,
        p_cost_estimate: params.estimatedCost || null,
        p_user_type: params.userType || 'unknown',
        p_is_authenticated: !!params.userId,
        p_page_path: params.pagePath || null,
        p_conversation_turn: null,
      });

      if (error) {
        // Silently log - don't crash anything
        console.warn('[Assistant Analytics] Log skipped:', error.code, error.message);
      }
    } catch {
      // Completely silent - tables may not exist yet
    }
  }, 0);
}

/**
 * Flag a request for potential FAQ improvement
 * FIRE-AND-FORGET: Never blocks, never throws
 */
function flagForImprovement(
  userMessage: string,
  intent: Intent,
  improvementType: 'low_confidence' | 'escalation' | 'missing_intent' | 'poor_response',
  confidence?: number
): void {
  setTimeout(async () => {
    try {
      const supabase = await createClient();

      await supabase.from('agent_improvement_candidates').insert({
        user_message: userMessage.substring(0, 2000),
        detected_intent: intent,
        improvement_type: improvementType,
        current_confidence: confidence,
        status: 'pending',
      });
    } catch {
      // Completely silent - tables may not exist yet
    }
  }, 0);
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
// GEMINI API CALL
// =====================================================

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

async function callGemini(
  messages: ChatMessage[],
  systemPrompt: string = SYSTEM_PROMPT
): Promise<{ success: boolean; content: string; tokens: number }> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_CLOUD_API_KEY;

  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY not configured');
  }

  // Convert chat messages to Gemini format
  // Gemini uses 'user' and 'model' roles, and has a different structure
  const geminiContents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  // Add system instruction as the first user message if not empty
  const requestBody = {
    contents: geminiContents,
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      topP: 0.95,
    },
  };

  const model = ASSISTANT_CONFIG.secondary.model;
  const response = await fetch(`${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || 'Gemini API error');
  }

  // Extract content from Gemini response
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Gemini returns token counts in usageMetadata
  const tokens = (data.usageMetadata?.promptTokenCount || 0) +
                 (data.usageMetadata?.candidatesTokenCount || 0);

  return { success: true, content, tokens };
}

// =====================================================
// MAIN ASSISTANT FUNCTION
// =====================================================

/**
 * Process a message through the hybrid assistant pipeline
 *
 * Flow: FAQ → Groq → Gemini → OpenAI (fallback)
 */
export async function processAssistantMessage(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  options: {
    forceProvider?: 'faq' | 'groq' | 'gemini' | 'openai';
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

  console.log(`\n[Assistant] ======== NEW REQUEST ========`);
  console.log(`[Assistant] Message: "${userMessage}"`);
  if (context.firstName) {
    console.log(`[Assistant] User context: ${context.firstName} (${context.userType})`);
  }

  // Edge case: empty or very short messages - handle gracefully
  const trimmedMessage = userMessage.trim();
  if (trimmedMessage.length < 2) {
    console.log(`[Assistant] Edge case: message too short (${trimmedMessage.length} chars)`);
    return {
      success: true,
      content: "👋 Bonjour ! Comment puis-je vous aider ? N'hésitez pas à me poser une question sur IzzIco.",
      provider: 'faq',
      metadata: {
        latencyMs: Date.now() - startTime,
        costEstimate: 0,
        complexity: 0,
      },
    };
  }

  // Analyze complexity with user context
  const complexity = analyzeComplexity(userMessage, conversationHistory.length, context);
  console.log(`[Assistant] Complexity: ${(complexity.score * 100).toFixed(0)}%, Reasons: [${complexity.reasons.join(', ')}], Provider: ${complexity.recommendedProvider}`);

  // Force provider if specified
  const targetProvider = options.forceProvider || complexity.recommendedProvider;

  // =====================================================
  // Layer 1: FAQ (LOCAL - $0) - PERSONALIZED
  // Only use FAQ if:
  // 1. Complexity analysis recommends it (score < 0.2 AND FAQ has a match)
  // 2. No escalation request is detected
  // 3. No forced provider that's different
  // =====================================================
  const shouldTryFAQ = targetProvider === 'faq' &&
                       !complexity.reasons.includes('escalation_request') &&
                       complexity.score < 0.2;

  console.log(`[Assistant] FAQ decision: targetProvider=${targetProvider}, score=${complexity.score.toFixed(2)}, shouldTryFAQ=${shouldTryFAQ}`);
  console.log(`[Assistant] Reasons: [${complexity.reasons.join(', ')}]`);

  if (shouldTryFAQ) {
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
      console.log(`[Assistant] OK: FAQ BYPASSED - Using Groq AI (${usageTracker.groq.count}/${ASSISTANT_CONFIG.primary.dailyLimit})`);

      const messages: ChatMessage[] = [
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ];

      const groqResult = await callGroq(messages);
      console.log(`[Assistant] Groq response (first 200 chars): "${groqResult.content.substring(0, 200)}..."`);

      // Check if response contains actions
      if (groqResult.content.includes('[ACTION:')) {
        console.log(`[Assistant] OK: ACTION DETECTED in Groq response!`);
      } else {
        console.log(`[Assistant] WARN: No [ACTION:] found in Groq response`);
      }

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
      // Fall through to Gemini
    }
  }

  // =====================================================
  // Layer 3: Gemini Flash (SECONDARY - $) - Cheaper than OpenAI
  // =====================================================
  if ((targetProvider === 'gemini' || !options.forceProvider) && isGeminiConfigured()) {
    try {
      console.log(`[Assistant] OK: Using Gemini Flash (${usageTracker.gemini.count} calls today)`);

      const messages: ChatMessage[] = [
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ];

      const geminiResult = await callGemini(messages);
      console.log(`[Assistant] Gemini response (first 200 chars): "${geminiResult.content.substring(0, 200)}..."`);

      // Check if response contains actions
      if (geminiResult.content.includes('[ACTION:')) {
        console.log(`[Assistant] OK: ACTION DETECTED in Gemini response!`);
      } else {
        console.log(`[Assistant] WARN: No [ACTION:] found in Gemini response`);
      }

      // Track usage
      usageTracker.gemini.count++;
      usageTracker.gemini.tokens += geminiResult.tokens;

      const latencyMs = Date.now() - startTime;
      const costEstimate =
        (geminiResult.tokens / 1_000_000) *
        (ASSISTANT_CONFIG.costs.gemini.input + ASSISTANT_CONFIG.costs.gemini.output) / 2;

      // Detect intent for logging
      const detectedIntent = detectIntent(userMessage);

      // Log to database (non-blocking)
      logRequestToDatabase({
        userMessage,
        provider: 'gemini',
        intent: detectedIntent?.intent,
        confidence: detectedIntent?.confidence,
        responseTimeMs: latencyMs,
        tokensUsed: geminiResult.tokens,
        estimatedCost: costEstimate,
        userType: context.userType,
        pagePath: options.pagePath,
        userId: options.userId || context.userId,
        conversationId: options.conversationId,
      });

      return {
        success: true,
        content: geminiResult.content,
        provider: 'gemini',
        metadata: {
          latencyMs,
          tokensUsed: geminiResult.tokens,
          costEstimate,
          complexity: complexity.score,
        },
      };
    } catch (error: any) {
      console.error('[Assistant] Gemini error:', error.message);
      // Fall through to OpenAI
    }
  }

  // =====================================================
  // Layer 4: OpenAI (LAST RESORT - $$) - Only if configured
  // =====================================================
  if ((targetProvider === 'openai' || !options.forceProvider) && isOpenAIConfigured()) {
    console.log('[Assistant] Using OpenAI as last resort');

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
  // Layer 5: FAQ-ONLY FALLBACK (All AI providers exhausted)
  // =====================================================
  // This triggers when:
  // - All AI providers failed (Groq error + Gemini error + OpenAI not configured)
  // - Or no AI providers are configured at all
  // At this point, we've tried all available providers and they all failed
  {
    console.log('[Assistant] All AI providers exhausted - FAQ-only fallback mode');

    const latencyMs = Date.now() - startTime;
    const detectedIntent = detectIntent(userMessage);

    // Log for analytics
    logRequestToDatabase({
      userMessage,
      provider: 'faq',
      intent: detectedIntent?.intent || 'unknown',
      confidence: detectedIntent?.confidence,
      responseTimeMs: latencyMs,
      estimatedCost: 0,
      userType: context.userType,
      pagePath: options.pagePath,
      userId: options.userId || context.userId,
      conversationId: options.conversationId,
    });

    // Flag for FAQ improvement - this message didn't match any FAQ
    flagForImprovement(
      userMessage,
      detectedIntent?.intent || 'unknown',
      'missing_intent',
      detectedIntent?.confidence
    );

    // Provide helpful fallback based on detected intent
    const fallbackContent = getFAQOnlyFallbackResponse(userMessage, detectedIntent?.intent, context);

    return {
      success: true,
      content: fallbackContent.message,
      provider: 'faq',
      intent: detectedIntent?.intent,
      confidence: detectedIntent?.confidence,
      suggestedActions: fallbackContent.suggestedActions,
      metadata: {
        latencyMs,
        costEstimate: 0,
        complexity: complexity.score,
      },
    };
  }
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
