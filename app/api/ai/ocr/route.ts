/**
 * AI OCR API Route - Server-Side Processing (Cost-Optimized)
 *
 * Architecture économique :
 * 1. Cloud Vision API → OCR extraction (cheap: $1.50/1000 images, 1000 free/month)
 * 2. Gemini (text only) → Structure the extracted text (much cheaper than image input)
 * 3. Tesseract → Free fallback (client-side)
 *
 * This separates OCR (cheap) from AI analysis (text-based = cheaper than image)
 */

import { NextRequest, NextResponse } from 'next/server';
import type { OCRResult, OCRLineItem, ExpenseCategory } from '@/lib/services/ai/types';

// Route configuration for larger payloads (images can be large)
export const maxDuration = 60; // 60 seconds timeout
export const dynamic = 'force-dynamic';

// API URLs
const CLOUD_VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_MODEL = 'gemini-2.0-flash';

// Daily usage tracking (in-memory for now)
const usageTracker: Record<string, { count: number; resetAt: Date }> = {
  vision: { count: 0, resetAt: new Date() },
  gemini: { count: 0, resetAt: new Date() },
};

const DAILY_LIMITS: Record<string, number> = {
  vision: 900, // Cloud Vision: 1000 free/month, be conservative
  gemini: 100, // Gemini text analysis is cheaper
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

interface CloudVisionResponse {
  responses?: {
    textAnnotations?: {
      description: string;
      locale?: string;
    }[];
    fullTextAnnotation?: {
      text: string;
    };
    error?: {
      message: string;
      code: number;
    };
  }[];
  error?: {
    message: string;
    code: number;
  };
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

/**
 * Step 1: Cloud Vision API - Extract raw text from image (CHEAP)
 * Cost: ~$1.50/1000 images, 1000 free/month
 */
async function extractTextWithVision(
  imageBase64: string,
  apiKey: string
): Promise<{ success: boolean; text?: string; error?: string; latencyMs: number }> {
  const startTime = Date.now();

  try {
    const response = await fetch(`${CLOUD_VISION_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { content: imageBase64 },
            features: [
              { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1 }
            ],
          },
        ],
      }),
    });

    const data: CloudVisionResponse = await response.json();
    const latencyMs = Date.now() - startTime;

    if (data.error) {
      console.error('[CloudVision] API Error:', data.error);
      return { success: false, error: data.error.message, latencyMs };
    }

    const firstResponse = data.responses?.[0];
    if (firstResponse?.error) {
      console.error('[CloudVision] Response Error:', firstResponse.error);
      return { success: false, error: firstResponse.error.message, latencyMs };
    }

    // Get full text (better for receipts than individual annotations)
    const extractedText = firstResponse?.fullTextAnnotation?.text
      || firstResponse?.textAnnotations?.[0]?.description
      || '';

    if (!extractedText) {
      return { success: false, error: 'No text detected in image', latencyMs };
    }

    console.log('[CloudVision] ✅ Text extracted:', {
      length: extractedText.length,
      preview: extractedText.substring(0, 100) + '...',
      latencyMs,
    });

    return { success: true, text: extractedText, latencyMs };
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    console.error('[CloudVision] Error:', error);
    return { success: false, error: error.message || 'Unknown error', latencyMs };
  }
}

/**
 * Step 2: Gemini - Structure the extracted TEXT (much cheaper than image input)
 * This analyzes TEXT, not images - significantly reduces cost
 */
async function structureTextWithGemini(
  extractedText: string,
  apiKey: string
): Promise<OCRResult> {
  const startTime = Date.now();

  const prompt = `Analyze this receipt text and extract ALL line items in JSON format:

RECEIPT TEXT:
"""
${extractedText}
"""

Return this JSON structure:
{
  "merchant": "store name",
  "total": numeric total amount (just the number, no currency symbol),
  "date": "YYYY-MM-DD format",
  "items": [
    {"name": "item name or — if unclear", "quantity": 1, "unit_price": 0.00, "total_price": 0.00}
  ],
  "category": one of: "groceries", "cleaning", "utilities", "internet", "rent", "entertainment", "transport", "health", "other",
  "confidence": 0.0-1.0 confidence score
}

CRITICAL RULES FOR ITEMS:
- Include EVERY line that looks like a product/item, even if partially readable
- If you see a price but can't read the name clearly, use "—" as the name
- If you see a name but no price, include with total_price: 0
- The SUM of all item prices should be CLOSE to the total amount
- Better to include too many items than too few - user can delete extras
- Look for prices at end of lines (e.g., "FRITES 6,50" or "6.50 FRITES")

OTHER RULES:
- Extract the TOTAL amount paid (look for "Total", "Somme", "Net à payer", "Cash", "Carte", "CB")
- Date should be in YYYY-MM-DD format
- Items should include quantity if available (default to 1)
- Category should match the type of purchase
- Return ONLY valid JSON, no explanations`;

  try {
    const response = await fetch(
      `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
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

    console.log('[Gemini] ✅ Text structured:', {
      merchant: parsed.merchant,
      total: parsed.total,
      itemCount: parsed.items?.length || 0,
      latencyMs,
    });

    return {
      success: true,
      provider: 'vision+gemini', // Indicates the cost-effective pipeline
      data: {
        merchant: parsed.merchant,
        total: typeof parsed.total === 'number' ? parsed.total : parseFloat(parsed.total),
        date: parsed.date,
        items: parsed.items as OCRLineItem[],
        category: parsed.category as ExpenseCategory,
        confidence: parsed.confidence || 0.85,
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

/**
 * Legacy: Gemini with IMAGE input (more expensive, used as fallback)
 */
async function analyzeWithGemini(
  imageBase64: string,
  mimeType: string,
  apiKey: string
): Promise<OCRResult> {
  const startTime = Date.now();

  const prompt = `Analyze this receipt image and extract ALL line items in JSON format:
{
  "merchant": "store name",
  "total": numeric total amount (just the number, no currency symbol),
  "date": "YYYY-MM-DD format",
  "items": [
    {"name": "item name or — if unclear", "quantity": 1, "unit_price": 0.00, "total_price": 0.00}
  ],
  "category": one of: "groceries", "cleaning", "utilities", "internet", "rent", "entertainment", "transport", "health", "other",
  "confidence": 0.0-1.0 confidence score
}

CRITICAL RULES FOR ITEMS:
- Include EVERY line that looks like a product/item, even if partially readable
- If you see a price but can't read the name clearly, use "—" as the name
- If you see a name but no price, include with total_price: 0
- The SUM of all item prices should be CLOSE to the total amount
- Better to include too many items than too few - user can delete extras

OTHER RULES:
- Extract the TOTAL amount paid (look for "Total", "Somme", "Net à payer", "Cash", "Carte", "CB")
- Date should be in YYYY-MM-DD format
- Items should include quantity if available (default to 1)
- Category should match the type of purchase
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

    // Get API key from SERVER environment variables
    // Note: Same key works for both Cloud Vision and Gemini (Google Cloud project)
    const googleKey = process.env.GOOGLE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;

    console.log(`[API OCR] Google API key available: ${!!googleKey}`);

    let visionError: string | null = null;
    let geminiError: string | null = null;

    // ============================================================
    // STRATEGY 1: Cloud Vision (OCR) + Gemini (text analysis) - CHEAPEST
    // ============================================================
    if (googleKey && canUseProvider('vision') && canUseProvider('gemini')) {
      console.log('[API OCR] 💰 Trying cost-effective pipeline: Vision OCR + Gemini text...');

      // Step 1: Extract text with Cloud Vision (cheap)
      const visionResult = await extractTextWithVision(imageBase64, googleKey);
      trackUsage('vision');

      if (visionResult.success && visionResult.text) {
        console.log('[API OCR] Vision extracted text, now structuring with Gemini...');

        // Step 2: Structure text with Gemini (text input = much cheaper than image)
        const structuredResult = await structureTextWithGemini(visionResult.text, googleKey);
        trackUsage('gemini');

        if (structuredResult.success) {
          console.log('[API OCR] ✅ Cost-effective pipeline succeeded!');
          // Add total latency
          structuredResult.latencyMs = (structuredResult.latencyMs || 0) + visionResult.latencyMs;
          return NextResponse.json(structuredResult);
        }
        geminiError = structuredResult.error || 'Failed to structure text';
        console.warn('[API OCR] Gemini text structuring failed:', geminiError);
      } else {
        visionError = visionResult.error || 'No text extracted';
        console.warn('[API OCR] Cloud Vision failed:', visionError);
      }
    }

    // ============================================================
    // STRATEGY 2: Gemini with image (more expensive fallback)
    // ============================================================
    if (googleKey && canUseProvider('gemini')) {
      console.log('[API OCR] 📸 Falling back to Gemini with image (more expensive)...');
      const result = await analyzeWithGemini(imageBase64, mimeType, googleKey);
      trackUsage('gemini');

      if (result.success) {
        console.log('[API OCR] ✅ Gemini image analysis succeeded');
        return NextResponse.json(result);
      }
      geminiError = result.error || 'Unknown Gemini error';
      console.warn('[API OCR] Gemini image analysis failed:', geminiError);
    } else if (!googleKey) {
      geminiError = 'Google API key not configured';
      console.log('[API OCR] Google API key not configured');
    } else {
      geminiError = 'Daily limit reached';
      console.log('[API OCR] Gemini daily limit reached');
    }

    // ============================================================
    // All server-side methods failed - client will use Tesseract
    // ============================================================
    console.warn('[API OCR] All providers failed, client should use Tesseract fallback');
    return NextResponse.json({
      success: false,
      provider: 'none',
      error: 'All AI providers failed or unavailable. Use client-side Tesseract fallback.',
      debug: {
        googleKeyPresent: !!googleKey,
        visionCanUse: canUseProvider('vision'),
        geminiCanUse: canUseProvider('gemini'),
        visionError,
        geminiError,
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
