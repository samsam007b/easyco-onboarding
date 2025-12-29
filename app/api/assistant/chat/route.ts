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
import {
  processAssistantMessage,
  streamGroqResponse,
  getUsageStats,
  SYSTEM_PROMPT,
  type ChatMessage,
} from '@/lib/services/assistant';

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

    // Convert to our ChatMessage format
    const conversationHistory: ChatMessage[] = messages.slice(0, -1).map((m: any) => ({
      role: m.role as 'user' | 'assistant',
      content: typeof m.content === 'string' ? m.content : m.content[0]?.text || '',
    }));

    // Process through hybrid pipeline
    const result = await processAssistantMessage(
      lastUserMessage.content,
      conversationHistory,
      { forceProvider }
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
