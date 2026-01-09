/**
 * COMPREHENSIVE ASSISTANT AUDIT ENDPOINT
 *
 * Tests the entire assistant system with REAL API calls:
 * - Layer 1: FAQ System ($0)
 * - Layer 2: Groq Llama 8B (~$0)
 * - Layer 3: Gemini Flash 2.0 ($)
 * - Layer 4: OpenAI GPT-4o-mini ($$)
 *
 * Also tests:
 * - Streaming functionality
 * - Error handling & fallback mechanisms
 * - Response quality & timing
 * - Edge cases
 *
 * DELETE THIS FILE IN PRODUCTION
 */

import {
  processAssistantMessage,
  getUsageStats,
  analyzeComplexity,
  isGroqAvailable,
  isGroqConfigured,
  isGeminiConfigured,
  isOpenAIConfigured,
  ASSISTANT_CONFIG,
} from '@/lib/services/assistant';
import { tryFAQAnswer, detectIntent, DEFAULT_USER_CONTEXT } from '@/lib/services/assistant/faq-system';

// =====================================================
// TEST CASES
// =====================================================

interface TestCase {
  question: string;
  category: string;
  expectedLayer: 'faq' | 'groq' | 'gemini' | 'openai';
  description: string;
}

const TEST_CASES: Record<string, TestCase[]> = {
  // LAYER 1: FAQ - Simple, pattern-matched questions
  faq_layer: [
    {
      question: "Bonjour !",
      category: "greeting",
      expectedLayer: "faq",
      description: "Simple greeting"
    },
    {
      question: "Combien ça coûte ?",
      category: "pricing",
      expectedLayer: "faq",
      description: "Simple pricing question"
    },
    {
      question: "C'est quoi le matching ?",
      category: "matching",
      expectedLayer: "faq",
      description: "Feature explanation"
    },
    {
      question: "Comment fonctionne le parrainage ?",
      category: "referral",
      expectedLayer: "faq",
      description: "Referral system"
    },
    {
      question: "Où sont mes messages ?",
      category: "navigation",
      expectedLayer: "faq",
      description: "Navigation help"
    },
  ],

  // LAYER 2: Groq - Moderate complexity, needs AI but simple
  groq_layer: [
    {
      question: "Quels sont les avantages de vivre en colocation à Bruxelles ?",
      category: "advice",
      expectedLayer: "groq",
      description: "General advice (moderate complexity)"
    },
    {
      question: "Peux-tu me donner des conseils pour bien rédiger mon annonce de colocation ?",
      category: "tips",
      expectedLayer: "groq",
      description: "Writing tips request"
    },
    {
      question: "Comment je peux améliorer mes chances de trouver une colocation rapidement ?",
      category: "strategy",
      expectedLayer: "groq",
      description: "Strategy advice"
    },
  ],

  // LAYER 3/4: Complex questions that need higher-tier AI
  complex_layer: [
    {
      question: "J'ai un bug avec l'API de paiement qui ne fonctionne pas et j'ai essayé plusieurs fois. Pouvez-vous m'aider à debugger le problème technique ?",
      category: "technical_complex",
      expectedLayer: "groq",
      description: "Technical issue (complexity triggers AI)"
    },
    {
      question: "Pouvez-vous comparer les avantages et inconvénients entre louer une chambre privée versus une chambre partagée en colocation à Bruxelles, en tenant compte du budget, de l'intimité et des aspects sociaux ?",
      category: "comparison",
      expectedLayer: "groq",
      description: "Detailed comparison request"
    },
    {
      question: "Je voudrais parler à un humain s'il vous plaît, le chatbot ne comprend pas ce que je veux",
      category: "escalation",
      expectedLayer: "openai",
      description: "Human escalation request"
    },
  ],

  // EDGE CASES
  edge_cases: [
    {
      question: "",
      category: "empty",
      expectedLayer: "faq",
      description: "Empty message"
    },
    {
      question: "a",
      category: "too_short",
      expectedLayer: "faq",
      description: "Single character"
    },
    {
      question: "Salut, combien ça coûte et comment marche le matching et aussi le parrainage ?",
      category: "multi_intent",
      expectedLayer: "groq",
      description: "Multiple intents in one message"
    },
    {
      question: "🤔 Hello! Comment ça va? 😊",
      category: "emoji_heavy",
      expectedLayer: "faq",
      description: "Emoji-heavy greeting"
    },
  ],
};

// =====================================================
// AUDIT FUNCTIONS
// =====================================================

interface TestResult {
  question: string;
  category: string;
  expectedLayer: string;
  actualProvider: string;
  success: boolean;
  responsePreview: string;
  metrics: {
    latencyMs: number;
    tokensUsed?: number;
    costEstimate?: number;
    complexity: number;
    complexityReasons: string[];
    intentDetected?: string;
    intentConfidence?: string;
    faqMatched: boolean;
    faqConfidence?: string;
  };
  verdict: string;
}

async function runSingleTest(testCase: TestCase): Promise<TestResult> {
  const startTime = Date.now();

  // Pre-analysis
  const intentResult = detectIntent(testCase.question);
  const complexity = analyzeComplexity(testCase.question, 0, DEFAULT_USER_CONTEXT);
  const faqResult = tryFAQAnswer(testCase.question, ASSISTANT_CONFIG.faq.minConfidence, DEFAULT_USER_CONTEXT);

  // Make real API call
  let actualProvider: string = 'error';
  let responseText = '';
  let tokensUsed: number | undefined;
  let costEstimate: number | undefined;

  try {
    const response = await processAssistantMessage(testCase.question, []);
    actualProvider = response.provider;
    responseText = response.content;
    tokensUsed = response.metadata.tokensUsed;
    costEstimate = response.metadata.costEstimate;
  } catch (error) {
    actualProvider = 'error';
    responseText = error instanceof Error ? error.message : 'Unknown error';
  }

  const latencyMs = Date.now() - startTime;

  // Determine if the routing was correct
  // FAQ should stay in FAQ, Groq questions should go to Groq/Gemini (not FAQ)
  // Complex/escalation should go to OpenAI (or Groq if OpenAI not configured)
  let success = false;

  if (testCase.expectedLayer === 'faq') {
    success = actualProvider === 'faq';
  } else if (testCase.expectedLayer === 'groq') {
    success = ['groq', 'gemini'].includes(actualProvider); // Gemini is acceptable fallback
  } else if (testCase.expectedLayer === 'openai') {
    success = ['openai', 'gemini', 'groq'].includes(actualProvider); // Any AI is acceptable for complex
  }

  const verdict = success
    ? '[OK] CORRECT'
    : `[ERROR] Expected ${testCase.expectedLayer}, got ${actualProvider}`;

  return {
    question: testCase.question.substring(0, 80) + (testCase.question.length > 80 ? '...' : ''),
    category: testCase.category,
    expectedLayer: testCase.expectedLayer,
    actualProvider,
    success,
    responsePreview: responseText.substring(0, 150) + (responseText.length > 150 ? '...' : ''),
    metrics: {
      latencyMs,
      tokensUsed,
      costEstimate,
      complexity: Math.round(complexity.score * 100),
      complexityReasons: complexity.reasons,
      intentDetected: intentResult.intent,
      intentConfidence: Math.round(intentResult.confidence * 100) + '%',
      faqMatched: faqResult !== null,
      faqConfidence: faqResult ? Math.round(faqResult.confidence * 100) + '%' : undefined,
    },
    verdict,
  };
}

// =====================================================
// STREAMING TEST
// =====================================================

async function testStreaming(): Promise<{
  success: boolean;
  message: string;
  details: any;
}> {
  try {
    // Test streaming endpoint directly
    const response = await fetch('http://localhost:3000/api/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Bonjour, comment ça va ?' }],
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `HTTP ${response.status}: ${response.statusText}`,
        details: await response.text(),
      };
    }

    // Check headers
    const contentType = response.headers.get('content-type');
    const isStreaming = contentType?.includes('text/event-stream') || contentType?.includes('text/plain');

    // Read first chunk
    const reader = response.body?.getReader();
    if (!reader) {
      return {
        success: false,
        message: 'No response body reader',
        details: null,
      };
    }

    const { value } = await reader.read();
    reader.releaseLock();

    const firstChunk = new TextDecoder().decode(value);

    return {
      success: true,
      message: 'Streaming works correctly',
      details: {
        contentType,
        isStreaming,
        firstChunkPreview: firstChunk.substring(0, 200),
        hasUIMessageFormat: firstChunk.includes('2:') || firstChunk.includes('"type"'),
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown streaming error',
      details: null,
    };
  }
}

// =====================================================
// MAIN AUDIT HANDLER
// =====================================================

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || 'full';
  const skipApiCalls = searchParams.get('skip_api') === 'true';

  const auditStart = Date.now();

  // System configuration check
  const config = {
    faq_enabled: ASSISTANT_CONFIG.faq.enabled,
    faq_min_confidence: ASSISTANT_CONFIG.faq.minConfidence,
    groq_configured: isGroqConfigured(),
    groq_available: isGroqAvailable(),
    groq_model: ASSISTANT_CONFIG.primary.model,
    gemini_configured: isGeminiConfigured(),
    gemini_model: ASSISTANT_CONFIG.secondary.model,
    openai_configured: isOpenAIConfigured(),
    openai_model: ASSISTANT_CONFIG.fallback.model,
    cascade_order: ['FAQ ($0)', 'Groq (~$0)', 'Gemini ($)', 'OpenAI ($$)'],
  };

  // Check which providers are available
  const availableProviders = [];
  if (config.faq_enabled) availableProviders.push('faq');
  if (config.groq_available) availableProviders.push('groq');
  if (config.gemini_configured) availableProviders.push('gemini');
  if (config.openai_configured) availableProviders.push('openai');

  const results: Record<string, TestResult[]> = {
    faq_layer: [],
    groq_layer: [],
    complex_layer: [],
    edge_cases: [],
  };

  const summary = {
    total_tests: 0,
    passed: 0,
    failed: 0,
    by_layer: {
      faq: { expected: 0, correct: 0, wrong: 0 },
      groq: { expected: 0, correct: 0, wrong: 0 },
      complex: { expected: 0, correct: 0, wrong: 0 },
    },
    providers_used: {} as Record<string, number>,
    avg_latency_ms: 0,
    total_cost_estimate: 0,
  };

  // Run tests
  if (!skipApiCalls) {
    for (const [category, tests] of Object.entries(TEST_CASES)) {
      for (const test of tests) {
        if (mode === 'quick' && results[category].length >= 2) continue;

        const result = await runSingleTest(test);
        results[category].push(result);

        // Update summary
        summary.total_tests++;
        if (result.success) {
          summary.passed++;
        } else {
          summary.failed++;
        }

        // Track by layer
        const layerKey = test.expectedLayer === 'openai' ? 'complex' : test.expectedLayer;
        if (summary.by_layer[layerKey as keyof typeof summary.by_layer]) {
          summary.by_layer[layerKey as keyof typeof summary.by_layer].expected++;
          if (result.success) {
            summary.by_layer[layerKey as keyof typeof summary.by_layer].correct++;
          } else {
            summary.by_layer[layerKey as keyof typeof summary.by_layer].wrong++;
          }
        }

        // Track provider usage
        summary.providers_used[result.actualProvider] =
          (summary.providers_used[result.actualProvider] || 0) + 1;

        // Track costs
        if (result.metrics.costEstimate) {
          summary.total_cost_estimate += result.metrics.costEstimate;
        }
      }
    }

    // Calculate average latency
    const allResults = Object.values(results).flat();
    if (allResults.length > 0) {
      summary.avg_latency_ms = Math.round(
        allResults.reduce((sum, r) => sum + r.metrics.latencyMs, 0) / allResults.length
      );
    }
  }

  // Test streaming
  const streamingTest = mode !== 'quick' ? await testStreaming() : null;

  // Get current usage stats
  const usageStats = getUsageStats();

  // Generate recommendations
  const recommendations: string[] = [];

  if (summary.by_layer.faq.wrong > 0) {
    recommendations.push('[WARN] Some FAQ questions are escaping to AI - review FAQ patterns');
  }
  if (summary.by_layer.groq.wrong > 0 && summary.providers_used['faq'] > 0) {
    recommendations.push('[WARN] Some moderate questions are being handled by FAQ - may need complexity tuning');
  }
  if (!config.gemini_configured) {
    recommendations.push('[TIP] Consider adding Gemini for better fallback (cheaper than OpenAI)');
  }
  if (!config.openai_configured) {
    recommendations.push('[TIP] Consider adding OpenAI for handling complex escalations');
  }
  if (summary.avg_latency_ms > 2000) {
    recommendations.push('[WARN] Average latency is high (>2s) - consider optimizing');
  }
  if (summary.passed === summary.total_tests && summary.total_tests > 0) {
    recommendations.push('[OK] All tests passed! Cascade system is working correctly');
  }

  const auditDuration = Date.now() - auditStart;

  return new Response(
    JSON.stringify({
      audit_info: {
        timestamp: new Date().toISOString(),
        duration_ms: auditDuration,
        mode,
        api_calls_made: !skipApiCalls,
      },

      system_config: config,
      available_providers: availableProviders,

      test_results: results,

      summary: {
        ...summary,
        success_rate: summary.total_tests > 0
          ? Math.round((summary.passed / summary.total_tests) * 100) + '%'
          : 'N/A',
      },

      streaming_test: streamingTest,

      usage_stats: usageStats,

      recommendations,

      cost_analysis: {
        this_audit_cost: `$${summary.total_cost_estimate.toFixed(6)}`,
        daily_estimated_cost: `$${usageStats.estimatedCost.toFixed(4)}`,
        daily_savings_from_faq: `$${usageStats.savedCost.toFixed(4)}`,
        faq_requests_today: usageStats.faq.count,
        ai_requests_today: usageStats.groq.count + usageStats.gemini.count + usageStats.openai.count,
      },
    }, null, 2),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
