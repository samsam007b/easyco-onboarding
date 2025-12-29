/**
 * HYBRID AI ASSISTANT CHAT API
 *
 * Architecture en 3 couches pour minimiser les coûts :
 *
 * Layer 1: FAQ System (LOCAL) - ~70% des queries - $0
 * Layer 2: Groq Llama 8B - ~28% des queries - ~$0 (free tier)
 * Layer 3: OpenAI GPT-4o-mini - ~2% des queries - $$ (fallback)
 *
 * Estimation: < $5/mois pour 5000 conversations
 */

import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@/lib/auth/supabase-server';
import {
  processAssistantMessage,
  streamGroqResponse,
  getUsageStats,
  SYSTEM_PROMPT,
  type ChatMessage,
} from '@/lib/services/assistant';
import { type UserContext, DEFAULT_USER_CONTEXT } from '@/lib/services/assistant/faq-system';

// =====================================================
// USER CONTEXT BUILDER
// =====================================================

/**
 * Build UserContext from authenticated user's data
 * Aggregates data from multiple tables for personalization
 */
async function buildUserContext(): Promise<UserContext> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log('[Assistant] No authenticated user, using default context');
      return DEFAULT_USER_CONTEXT;
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('users')
      .select(`
        id,
        first_name,
        last_name,
        display_name,
        email,
        user_type,
        onboarding_completed,
        onboarding_step,
        profile_completion_score,
        email_verified,
        phone_verified,
        kyc_status,
        referral_code,
        preferred_city,
        budget_min,
        budget_max,
        is_smoker,
        has_pets,
        cleanliness_level,
        sociability_level
      `)
      .eq('id', user.id)
      .single();

    if (!profile) {
      console.log('[Assistant] No profile found, using default context');
      return { ...DEFAULT_USER_CONTEXT, userId: user.id, email: user.email };
    }

    // Fetch subscription info
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, trial_end_date, current_period_end')
      .eq('user_id', user.id)
      .single();

    // Fetch referral stats
    const { data: referralStats } = await supabase
      .from('referrals')
      .select('id')
      .eq('referrer_id', user.id);

    const { data: referralCredits } = await supabase
      .from('referral_credits')
      .select('credits_months')
      .eq('user_id', user.id)
      .single();

    // Fetch property stats (for owners)
    let propertiesCount = 0;
    let publishedPropertiesCount = 0;
    let applicationsCount = 0;

    if (profile.user_type === 'owner') {
      const { data: properties } = await supabase
        .from('properties')
        .select('id, status')
        .eq('owner_id', user.id);

      propertiesCount = properties?.length || 0;
      publishedPropertiesCount = properties?.filter(p => p.status === 'published').length || 0;

      // Count pending applications
      if (propertiesCount > 0) {
        const propertyIds = properties?.map(p => p.id) || [];
        const { count } = await supabase
          .from('applications')
          .select('id', { count: 'exact', head: true })
          .in('property_id', propertyIds)
          .eq('status', 'pending');

        applicationsCount = count || 0;
      }
    }

    // Fetch searcher/resident specific data
    let savedSearchesCount = 0;
    let favoritesCount = 0;
    let matchesCount = 0;
    let currentPropertyName: string | undefined;

    if (profile.user_type === 'searcher' || profile.user_type === 'resident') {
      // Favorites count
      const { count: favCount } = await supabase
        .from('favorites')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      favoritesCount = favCount || 0;

      // Saved searches
      const { count: searchCount } = await supabase
        .from('saved_searches')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      savedSearchesCount = searchCount || 0;

      // Matches count (simplified - could be more complex)
      const { count: matchCount } = await supabase
        .from('matches')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      matchesCount = matchCount || 0;

      // Current property for residents
      if (profile.user_type === 'resident') {
        const { data: residency } = await supabase
          .from('residencies')
          .select('property:properties(name)')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        currentPropertyName = (residency?.property as { name?: string })?.name;
      }
    }

    // Unread messages count
    const { count: unreadCount } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', user.id)
      .eq('read', false);

    // Calculate trial days remaining
    let trialDaysRemaining: number | undefined;
    let subscriptionStatus: UserContext['subscriptionStatus'] = 'none';

    if (subscription) {
      if (subscription.status === 'trial' && subscription.trial_end_date) {
        const trialEnd = new Date(subscription.trial_end_date);
        const now = new Date();
        trialDaysRemaining = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        subscriptionStatus = 'trial';
      } else if (subscription.status === 'active') {
        subscriptionStatus = 'active';
      } else if (subscription.status === 'expired') {
        subscriptionStatus = 'expired';
      } else if (subscription.status === 'cancelled') {
        subscriptionStatus = 'cancelled';
      }
    }

    // Build the context
    const context: UserContext = {
      // Basic identity
      userId: user.id,
      firstName: profile.first_name || undefined,
      lastName: profile.last_name || undefined,
      displayName: profile.display_name || undefined,
      email: profile.email || user.email,

      // User type & status
      userType: (profile.user_type as UserContext['userType']) || 'unknown',
      onboardingCompleted: profile.onboarding_completed ?? false,
      onboardingStep: profile.onboarding_step || undefined,
      profileCompletionScore: profile.profile_completion_score || undefined,

      // Subscription info
      subscriptionStatus,
      trialDaysRemaining,
      subscriptionEndDate: subscription?.current_period_end || undefined,
      isPremium: subscriptionStatus === 'active',

      // Verification status
      emailVerified: profile.email_verified ?? false,
      phoneVerified: profile.phone_verified ?? false,
      idVerified: profile.kyc_status === 'verified',
      kycStatus: profile.kyc_status as UserContext['kycStatus'] || undefined,

      // Referral info
      referralCode: profile.referral_code || undefined,
      referralCreditsMonths: referralCredits?.credits_months || 0,
      referralsCount: referralStats?.length || 0,

      // Property info (for owners)
      propertiesCount,
      publishedPropertiesCount,
      applicationsCount,

      // Searcher/Resident specific
      savedSearchesCount,
      favoritesCount,
      matchesCount,
      currentPropertyName,

      // Activity
      unreadMessagesCount: unreadCount || 0,

      // Preferences
      preferredCity: profile.preferred_city || undefined,
      budgetMin: profile.budget_min || undefined,
      budgetMax: profile.budget_max || undefined,
      language: 'fr',

      // Personality traits
      isSmoker: profile.is_smoker ?? undefined,
      hasPets: profile.has_pets ?? undefined,
      cleanlinessLevel: profile.cleanliness_level || undefined,
      sociabilityLevel: profile.sociability_level || undefined,
    };

    console.log(`[Assistant] Built context for ${context.firstName || 'user'} (${context.userType})`);
    return context;

  } catch (error: any) {
    console.error('[Assistant] Error building user context:', error.message);
    return DEFAULT_USER_CONTEXT;
  }
}

// =====================================================
// TOOL DEFINITIONS (shared across providers)
// =====================================================

// Tool schemas
const navigateSchema = z.object({
  path: z.string().describe('Le chemin de la page (ex: /hub, /settings, /properties)'),
  description: z.string().describe("Description de la page pour l'utilisateur"),
});

const searchFiltersSchema = z.object({
  priceMin: z.number().optional().describe('Prix minimum en euros'),
  priceMax: z.number().optional().describe('Prix maximum en euros'),
  city: z.string().optional().describe('Ville recherchée'),
  roomType: z.enum(['private', 'shared', 'any']).optional().describe('Type de chambre'),
  amenities: z.array(z.string()).optional().describe('Équipements souhaités'),
});

const settingsSchema = z.object({
  setting: z.enum(['notifications', 'privacy', 'language', 'theme']).describe('Le paramètre à modifier'),
  action: z.enum(['enable', 'disable', 'navigate']).describe("L'action à effectuer"),
});

const featureSchema = z.object({
  feature: z
    .enum([
      'matching',
      'finances',
      'messaging',
      'verification',
      'subscription',
      'referral',
      'search',
      'property',
    ])
    .describe('La fonctionnalité à expliquer'),
});

const assistantTools = {
  // Navigation tool
  navigate: tool({
    description: "Navigue vers une page spécifique de l'application. Utilise cet outil quand l'utilisateur veut aller quelque part.",
    inputSchema: navigateSchema,
    execute: async ({ path, description }) => {
      return {
        action: 'navigate',
        path,
        message: `Je vous redirige vers ${description}`,
      };
    },
  }),

  // Search filters tool
  setSearchFilters: tool({
    description: "Configure les filtres de recherche de colocation. Utilise cet outil quand l'utilisateur veut affiner sa recherche.",
    inputSchema: searchFiltersSchema,
    execute: async (filters) => {
      return {
        action: 'setFilters',
        filters,
        message: 'Filtres de recherche mis à jour',
      };
    },
  }),

  // Settings tool
  updateSettings: tool({
    description: "Modifie les paramètres de l'utilisateur. Utilise cet outil pour aider à configurer le compte.",
    inputSchema: settingsSchema,
    execute: async ({ setting, action }) => {
      const settingPaths: Record<string, string> = {
        notifications: '/settings/notifications',
        privacy: '/settings/privacy',
        language: '/settings/language',
        theme: '/settings',
      };
      return {
        action: 'updateSettings',
        setting,
        settingAction: action,
        path: settingPaths[setting],
        message: `Paramètre ${setting} : ${action}`,
      };
    },
  }),

  // Feature explanation tool
  explainFeature: tool({
    description: "Explique une fonctionnalité spécifique de l'application en détail.",
    inputSchema: featureSchema,
    execute: async ({ feature }) => {
      // These are handled by FAQ system now, but kept for tool consistency
      return {
        action: 'explain',
        feature,
        message: `Explication de ${feature}`,
      };
    },
  }),
};

// =====================================================
// STREAMING RESPONSE HELPERS
// =====================================================

/**
 * Create a streaming response for FAQ answers
 */
function createFAQStreamResponse(content: string, metadata: any) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Send the content as a single chunk (FAQ responses are instant)
      const data = {
        type: 'text-delta',
        textDelta: content,
      };
      controller.enqueue(encoder.encode(`0:${JSON.stringify(data)}\n`));

      // Send finish message with metadata
      const finishData = {
        type: 'finish',
        finishReason: 'stop',
        usage: { promptTokens: 0, completionTokens: 0 },
        metadata: {
          provider: 'faq',
          ...metadata,
        },
      };
      controller.enqueue(encoder.encode(`d:${JSON.stringify(finishData)}\n`));

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Assistant-Provider': 'faq',
      'X-Assistant-Cost': '0',
    },
  });
}

/**
 * Create a streaming response from Groq
 */
async function createGroqStreamResponse(messages: ChatMessage[], metadata: any) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let fullContent = '';

        for await (const chunk of streamGroqResponse(messages)) {
          fullContent += chunk;
          const data = {
            type: 'text-delta',
            textDelta: chunk,
          };
          controller.enqueue(encoder.encode(`0:${JSON.stringify(data)}\n`));
        }

        // Send finish message
        const finishData = {
          type: 'finish',
          finishReason: 'stop',
          usage: { promptTokens: 0, completionTokens: fullContent.length / 4 },
          metadata: {
            provider: 'groq',
            ...metadata,
          },
        };
        controller.enqueue(encoder.encode(`d:${JSON.stringify(finishData)}\n`));

        controller.close();
      } catch (error: any) {
        console.error('[Groq Stream] Error:', error);

        // Send error message
        const errorData = {
          type: 'error',
          error: error.message,
        };
        controller.enqueue(encoder.encode(`e:${JSON.stringify(errorData)}\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Assistant-Provider': 'groq',
    },
  });
}

// =====================================================
// MAIN API HANDLER
// =====================================================

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    const { messages, forceProvider } = await req.json();

    // Extract last user message
    const lastUserMessage = messages
      .filter((m: any) => m.role === 'user')
      .pop();

    if (!lastUserMessage) {
      return new Response(JSON.stringify({ error: 'No user message provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build personalized user context (fetches from Supabase)
    const userContext = await buildUserContext();

    // Convert to our ChatMessage format
    const conversationHistory: ChatMessage[] = messages.slice(0, -1).map((m: any) => ({
      role: m.role as 'user' | 'assistant',
      content: typeof m.content === 'string' ? m.content : m.content[0]?.text || '',
    }));

    // Process through hybrid pipeline with user context for personalization
    const result = await processAssistantMessage(
      lastUserMessage.content,
      conversationHistory,
      { forceProvider, userContext }
    );

    console.log(`[Assistant API] Provider: ${result.provider}, Latency: ${result.metadata.latencyMs}ms`);

    // =====================================================
    // Layer 1: FAQ Response
    // =====================================================
    if (result.provider === 'faq' && result.success) {
      console.log(`[Assistant API] FAQ hit: ${result.intent}`);

      // Add suggested actions to the response
      let response = result.content;
      if (result.suggestedActions && result.suggestedActions.length > 0) {
        response += '\n\n---\n';
        for (const action of result.suggestedActions) {
          if (action.type === 'navigate') {
            response += `\n[${action.label}](${action.value})`;
          }
        }
      }

      return createFAQStreamResponse(response, {
        intent: result.intent,
        confidence: result.confidence,
        latencyMs: result.metadata.latencyMs,
      });
    }

    // =====================================================
    // Layer 2: Groq Response
    // =====================================================
    if (result.provider === 'groq' && result.success && result.content !== '__USE_OPENAI__') {
      // If we got a non-streaming response, convert to stream
      if (result.content && result.content !== '__USE_OPENAI__') {
        return createFAQStreamResponse(result.content, {
          provider: 'groq',
          tokensUsed: result.metadata.tokensUsed,
          costEstimate: result.metadata.costEstimate,
          latencyMs: result.metadata.latencyMs,
        });
      }

      // Stream Groq response
      const chatMessages: ChatMessage[] = [
        ...conversationHistory,
        { role: 'user', content: lastUserMessage.content },
      ];

      return createGroqStreamResponse(chatMessages, {
        latencyMs: Date.now() - startTime,
      });
    }

    // =====================================================
    // Layer 3: OpenAI Fallback (via Vercel AI SDK)
    // =====================================================
    console.log('[Assistant API] Using OpenAI fallback');

    const openaiResult = streamText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      messages,
      tools: assistantTools,
    });

    // Add custom headers to the response
    const response = openaiResult.toTextStreamResponse();

    // Clone response to add headers
    const headers = new Headers(response.headers);
    headers.set('X-Assistant-Provider', 'openai');
    headers.set('X-Assistant-Fallback', 'true');

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (error: any) {
    console.error('[Assistant API] Error:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        provider: 'error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// =====================================================
// STATS ENDPOINT
// =====================================================

export async function GET() {
  const stats = getUsageStats();

  return new Response(JSON.stringify(stats), {
    headers: { 'Content-Type': 'application/json' },
  });
}
