/**
 * TEST ENDPOINT - Cascade System Verification
 *
 * Tests different types of questions and shows which provider would handle them.
 * DELETE THIS FILE IN PRODUCTION
 */

import {
  analyzeComplexity,
  isGroqAvailable,
  isGroqConfigured,
  isGeminiConfigured,
  isOpenAIConfigured,
  ASSISTANT_CONFIG,
} from '@/lib/services/assistant';
import { tryFAQAnswer, detectIntent, DEFAULT_USER_CONTEXT } from '@/lib/services/assistant/faq-system';

// Test cases organized by expected behavior
const TEST_CASES = {
  // Should be handled by FAQ (simple questions)
  faq_expected: [
    { q: "Bonjour", category: "greeting" },
    { q: "Combien ça coûte ?", category: "pricing" },
    { q: "C'est quoi le parrainage ?", category: "referral" },
    { q: "Comment fonctionne le matching ?", category: "matching" },
    { q: "Où sont mes messages ?", category: "navigation" },
    { q: "Comment ajouter une propriété ?", category: "property" },
    { q: "Quelle est la durée de l'essai gratuit ?", category: "trial" },
    { q: "Comment modifier mon mot de passe ?", category: "security" },
  ],

  // Should escalate to AI (complex questions)
  ai_expected: [
    { q: "J'ai un bug avec l'API de paiement qui ne fonctionne pas et j'ai essayé plusieurs fois de corriger le problème technique mais rien ne marche, pouvez-vous m'aider à debugger ?", category: "technical_complex" },
    { q: "Pouvez-vous comparer les avantages et inconvénients entre louer une chambre privée vs une chambre partagée en colocation à Bruxelles ?", category: "comparison" },
    { q: "Je voudrais parler à un humain s'il vous plaît, le chatbot ne comprend pas ma question", category: "escalation" },
    { q: "Comment optimiser mon profil pour avoir plus de matchs ? Quels sont les critères importants ? Comment améliorer ma visibilité ? Et quels sont les meilleurs moments pour chercher ?", category: "multiple_questions" },
  ],

  // Edge cases
  edge_cases: [
    { q: "Salut, c'est quoi le prix du truc là ?", category: "mixed_intent" },
    { q: "", category: "empty" },
    { q: "a", category: "too_short" },
  ],
};

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    config: {
      faq_min_confidence: ASSISTANT_CONFIG.faq.minConfidence,
      groq_configured: isGroqConfigured(),
      groq_available: isGroqAvailable(),
      gemini_configured: isGeminiConfigured(),
      openai_configured: isOpenAIConfigured(),
    },
    tests: {
      faq_expected: [] as any[],
      ai_expected: [] as any[],
      edge_cases: [] as any[],
    },
    summary: {
      faq_success: 0,
      faq_fail: 0,
      ai_success: 0,
      ai_fail: 0,
      total: 0,
    },
  };

  // Test FAQ-expected questions
  for (const test of TEST_CASES.faq_expected) {
    const result = analyzeQuestion(test.q, test.category, 'faq');
    results.tests.faq_expected.push(result);
    results.summary.total++;
    if (result.would_use_faq) {
      results.summary.faq_success++;
    } else {
      results.summary.faq_fail++;
    }
  }

  // Test AI-expected questions
  for (const test of TEST_CASES.ai_expected) {
    const result = analyzeQuestion(test.q, test.category, 'ai');
    results.tests.ai_expected.push(result);
    results.summary.total++;
    if (!result.would_use_faq) {
      results.summary.ai_success++;
    } else {
      results.summary.ai_fail++;
    }
  }

  // Test edge cases
  for (const test of TEST_CASES.edge_cases) {
    const result = analyzeQuestion(test.q, test.category, 'edge');
    results.tests.edge_cases.push(result);
  }

  return new Response(JSON.stringify(results, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}

function analyzeQuestion(question: string, category: string, expectedType: string) {
  // Detect intent
  const intentResult = detectIntent(question);

  // Analyze complexity
  const complexity = analyzeComplexity(question, 0, DEFAULT_USER_CONTEXT);

  // Try FAQ answer
  const faqResult = tryFAQAnswer(question, ASSISTANT_CONFIG.faq.minConfidence, DEFAULT_USER_CONTEXT);

  // Determine what provider would be used
  let expected_provider: string;
  if (complexity.score < 0.2 && faqResult) {
    expected_provider = 'faq';
  } else if (complexity.score > 0.6 || complexity.reasons.includes('escalation_request')) {
    expected_provider = 'openai';
  } else {
    expected_provider = 'groq';
  }

  const would_use_faq = faqResult !== null && complexity.recommendedProvider === 'faq';

  return {
    question: question.substring(0, 80) + (question.length > 80 ? '...' : ''),
    category,
    expected_type: expectedType,

    // Intent detection
    detected_intent: intentResult.intent,
    intent_confidence: Math.round(intentResult.confidence * 100) + '%',

    // Complexity analysis
    complexity_score: Math.round(complexity.score * 100) + '%',
    complexity_reasons: complexity.reasons,
    recommended_provider: complexity.recommendedProvider,

    // FAQ result
    faq_matched: faqResult !== null,
    faq_confidence: faqResult ? Math.round(faqResult.confidence * 100) + '%' : 'N/A',

    // Final decision
    would_use_faq,
    expected_provider,

    // Verdict
    verdict: expectedType === 'faq'
      ? (would_use_faq ? '✅ CORRECT' : '❌ SHOULD USE FAQ')
      : expectedType === 'ai'
        ? (!would_use_faq ? '✅ CORRECT' : '❌ SHOULD USE AI')
        : '⚪ EDGE CASE',
  };
}
