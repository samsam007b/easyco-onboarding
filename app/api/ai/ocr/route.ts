/**
 * AI OCR API Route - Server-Side Processing
 *
 * This route handles OCR requests server-side to:
 * 1. Bypass browser CSP restrictions
 * 2. Keep API keys secure (not exposed to client)
 * 3. Use server-side environment variables
 */

import { NextRequest, NextResponse } from 'next/server';
import type { OCRResult, OCRLineItem, ExpenseCategory } from '@/lib/services/ai/types';

// Route configuration for larger payloads (images can be large)
export const maxDuration = 60; // 60 seconds timeout
export const dynamic = 'force-dynamic';

// API URLs
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_MODEL = 'gemini-2.0-flash';
const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';
// Use serverless-compatible vision model (11B is available for serverless, 90B requires dedicated endpoint)
const TOGETHER_MODEL = 'meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo';

// Daily usage tracking (in-memory for now)
const usageTracker: Record<string, { count: number; resetAt: Date }> = {
  gemini: { count: 0, resetAt: new Date() },
  together: { count: 0, resetAt: new Date() },
};

const DAILY_LIMITS: Record<string, number> = {
  gemini: 40,
  together: 80,
};

function canUseProvider(provider: string): boolean {
  const usage = usageTracker[provider];
  const now = new Date();

  if (usage.resetAt.getDate() !== now.getDate()) {
    usage.count = 0;
    usage.resetAt = now;
  }

  const limit = DAILY_LIMITS[provider];
  const safeLimit = Math.floor(limit * 0.8);
  return usage.count < safeLimit;
}

function trackUsage(provider: string) {
  usageTracker[provider].count++;
}

interface GeminiResponse {
  candidates?: {
    content: {
      parts: { text: string }[];
    };
  }[];
  error?: {
    message: string;
    code: number;
  };
}

interface TogetherResponse {
  choices?: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
}

function parseJsonResponse(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch {
        // Continue
      }
    }
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch {
        // Give up
      }
    }
    return null;
  }
}

async function analyzeWithGemini(
  imageBase64: string,
  mimeType: string,
  apiKey: string
): Promise<OCRResult> {
  const startTime = Date.now();

  const prompt = `Analyze this receipt image and extract the following information in JSON format:
{
  "merchant": "store name",
  "total": numeric total amount (just the number, no currency symbol),
  "date": "YYYY-MM-DD format",
  "items": [
    {"name": "item name", "quantity": 1, "unit_price": 0.00, "total_price": 0.00}
  ],
  "category": one of: "groceries", "cleaning", "utilities", "internet", "rent", "entertainment", "transport", "health", "other",
  "confidence": 0.0-1.0 confidence score
}

Rules:
- Extract the TOTAL amount paid (look for "Total", "Somme", "Net à payer", "Cash", "Carte")
- Date should be in YYYY-MM-DD format
- Items should include quantity if available
- Category should match the type of purchase
- If information is unclear, omit the field rather than guess
- Return ONLY valid JSON, no explanations`;

  try {
    const response = await fetch(
      `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const data: GeminiResponse = await response.json();
    const latencyMs = Date.now() - startTime;

    if (data.error) {
      console.error('[Gemini] API Error:', data.error);
      return {
        success: false,
        provider: 'gemini',
        error: data.error.message,
        latencyMs,
      };
    }

    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      return {
        success: false,
        provider: 'gemini',
        error: 'No response from Gemini',
        latencyMs,
      };
    }

    const parsed = parseJsonResponse(textResponse);
    if (!parsed) {
      return {
        success: false,
        provider: 'gemini',
        error: 'Failed to parse Gemini response',
        latencyMs,
      };
    }

    console.log('[Gemini] ✅ Receipt analyzed:', {
      merchant: parsed.merchant,
      total: parsed.total,
      itemCount: parsed.items?.length || 0,
      latencyMs,
    });

    return {
      success: true,
      provider: 'gemini',
      data: {
        merchant: parsed.merchant,
        total: typeof parsed.total === 'number' ? parsed.total : parseFloat(parsed.total),
        date: parsed.date,
        items: parsed.items as OCRLineItem[],
        category: parsed.category as ExpenseCategory,
        confidence: parsed.confidence || 0.8,
      },
      latencyMs,
    };
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    console.error('[Gemini] Error:', error);
    return {
      success: false,
      provider: 'gemini',
      error: error.message || 'Unknown error',
      latencyMs,
    };
  }
}

async function analyzeWithTogether(
  imageBase64: string,
  mimeType: string,
  apiKey: string
): Promise<OCRResult> {
  const startTime = Date.now();

  const prompt = `Analyze this receipt image and extract the following information in JSON format:
{
  "merchant": "store name",
  "total": numeric total amount (just the number, no currency symbol),
  "date": "YYYY-MM-DD format",
  "items": [
    {"name": "item name", "quantity": 1, "unit_price": 0.00, "total_price": 0.00}
  ],
  "category": one of: "groceries", "cleaning", "utilities", "internet", "rent", "entertainment", "transport", "health", "other",
  "confidence": 0.0-1.0 confidence score
}

Rules:
- Extract the TOTAL amount paid
- Date should be in YYYY-MM-DD format
- Return ONLY valid JSON`;

  try {
    const response = await fetch(TOGETHER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: TOGETHER_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 2048,
        temperature: 0.1,
      }),
    });

    const data: TogetherResponse = await response.json();
    const latencyMs = Date.now() - startTime;

    if (data.error) {
      console.error('[Together] API Error:', data.error);
      return {
        success: false,
        provider: 'together',
        error: data.error.message,
        latencyMs,
      };
    }

    const textResponse = data.choices?.[0]?.message?.content;
    if (!textResponse) {
      return {
        success: false,
        provider: 'together',
        error: 'No response from Together AI',
        latencyMs,
      };
    }

    const parsed = parseJsonResponse(textResponse);
    if (!parsed) {
      return {
        success: false,
        provider: 'together',
        error: 'Failed to parse Together response',
        latencyMs,
      };
    }

    console.log('[Together] ✅ Receipt analyzed:', {
      merchant: parsed.merchant,
      total: parsed.total,
      itemCount: parsed.items?.length || 0,
      latencyMs,
    });

    return {
      success: true,
      provider: 'together',
      data: {
        merchant: parsed.merchant,
        total: typeof parsed.total === 'number' ? parsed.total : parseFloat(parsed.total),
        date: parsed.date,
        items: parsed.items as OCRLineItem[],
        category: parsed.category as ExpenseCategory,
        confidence: parsed.confidence || 0.75,
      },
      latencyMs,
    };
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    console.error('[Together] Error:', error);
    return {
      success: false,
      provider: 'together',
      error: error.message || 'Unknown error',
      latencyMs,
    };
  }
}

export async function POST(request: NextRequest) {
  console.log('[API OCR] Request received');
  const startTime = Date.now();

  try {
    // Parse request body with error handling
    let body;
    try {
      body = await request.json();
    } catch (parseError: any) {
      console.error('[API OCR] Failed to parse request body:', parseError.message);
      return NextResponse.json(
        {
          success: false,
          provider: 'none',
          error: 'Invalid request body - could not parse JSON',
          latencyMs: Date.now() - startTime,
        },
        { status: 400 }
      );
    }

    const { imageBase64, mimeType } = body;

    if (!imageBase64 || !mimeType) {
      console.warn('[API OCR] Missing required fields');
      return NextResponse.json(
        {
          success: false,
          provider: 'none',
          error: 'Missing imageBase64 or mimeType',
          latencyMs: Date.now() - startTime,
        },
        { status: 400 }
      );
    }

    console.log(`[API OCR] Processing image: ${mimeType}, size: ${Math.round(imageBase64.length / 1024)}KB`);

    // Get API keys from SERVER environment variables (not NEXT_PUBLIC_)
    const geminiKey = process.env.GOOGLE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
    const togetherKey = process.env.TOGETHER_API_KEY || process.env.NEXT_PUBLIC_TOGETHER_API_KEY;

    console.log(`[API OCR] Available providers: Gemini=${!!geminiKey}, Together=${!!togetherKey}`);

    let geminiError: string | null = null;
    let togetherError: string | null = null;

    // Try Gemini first
    if (geminiKey && canUseProvider('gemini')) {
      console.log('[API OCR] Trying Gemini...');
      const result = await analyzeWithGemini(imageBase64, mimeType, geminiKey);
      trackUsage('gemini');

      if (result.success) {
        console.log('[API OCR] Gemini succeeded');
        return NextResponse.json(result);
      }
      geminiError = result.error || 'Unknown Gemini error';
      console.warn('[API OCR] Gemini failed:', geminiError);
    } else if (!geminiKey) {
      geminiError = 'API key not configured';
      console.log('[API OCR] Gemini API key not configured');
    } else {
      geminiError = 'Daily limit reached';
      console.log('[API OCR] Gemini daily limit reached');
    }

    // Try Together AI
    if (togetherKey && canUseProvider('together')) {
      console.log('[API OCR] Trying Together AI...');
      const result = await analyzeWithTogether(imageBase64, mimeType, togetherKey);
      trackUsage('together');

      if (result.success) {
        console.log('[API OCR] Together AI succeeded');
        return NextResponse.json(result);
      }
      togetherError = result.error || 'Unknown Together error';
      console.warn('[API OCR] Together AI failed:', togetherError);
    } else if (!togetherKey) {
      togetherError = 'API key not configured';
      console.log('[API OCR] Together API key not configured');
    } else {
      togetherError = 'Daily limit reached';
      console.log('[API OCR] Together daily limit reached');
    }

    // Return error if no providers available or all failed
    console.warn('[API OCR] All providers failed or unavailable');
    return NextResponse.json({
      success: false,
      provider: 'none',
      error: 'All AI providers failed or unavailable. Use client-side Tesseract fallback.',
      debug: {
        geminiKeyPresent: !!geminiKey,
        togetherKeyPresent: !!togetherKey,
        geminiCanUse: canUseProvider('gemini'),
        togetherCanUse: canUseProvider('together'),
        geminiError,
        togetherError,
      },
      latencyMs: Date.now() - startTime,
    });
  } catch (error: any) {
    console.error('[API OCR] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        provider: 'none',
        error: error.message || 'Internal server error',
        latencyMs: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}
