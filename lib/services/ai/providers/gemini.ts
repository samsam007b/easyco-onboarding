/**
 * Google Gemini AI Provider
 * Free tier: ~50 requests/day for Gemini Flash
 * Excellent for OCR and document understanding
 */

import type { OCRResult, CategoryResult, ExpenseCategory, OCRLineItem } from '../types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL = 'gemini-2.0-flash'; // Fast and free tier friendly

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

export class GeminiProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Analyze receipt image using Gemini Vision
   */
  async analyzeReceipt(imageBase64: string, mimeType: string): Promise<OCRResult> {
    const startTime = Date.now();

    try {
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

      const response = await fetch(
        `${GEMINI_API_URL}/${MODEL}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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

      // Parse JSON response
      const parsed = this.parseJsonResponse(textResponse);
      if (!parsed) {
        return {
          success: false,
          provider: 'gemini',
          error: 'Failed to parse Gemini response',
          latencyMs,
        };
      }

      console.log('[Gemini] OK: Receipt analyzed:', {
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

  /**
   * Categorize expense based on description
   */
  async categorizeExpense(description: string, merchant?: string): Promise<CategoryResult> {
    try {
      const prompt = `Categorize this expense:
Description: ${description}
${merchant ? `Merchant: ${merchant}` : ''}

Return JSON:
{
  "category": one of: "groceries", "cleaning", "utilities", "internet", "rent", "entertainment", "transport", "health", "other",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation"
}

Category definitions:
- groceries: Food shopping, supermarkets
- cleaning: Cleaning supplies, household maintenance
- utilities: Electricity, water, gas, heating
- internet: Internet, phone, telecom
- rent: Rent, common charges
- entertainment: Restaurants, bars, cinema, outings
- transport: Gas, public transport, parking
- health: Pharmacy, medical
- other: Everything else

Return ONLY valid JSON.`;

      const response = await fetch(
        `${GEMINI_API_URL}/${MODEL}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 256 },
          }),
        }
      );

      const data: GeminiResponse = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textResponse) {
        return { category: 'other', confidence: 0.5 };
      }

      const parsed = this.parseJsonResponse(textResponse);
      return {
        category: parsed?.category || 'other',
        confidence: parsed?.confidence || 0.5,
        reasoning: parsed?.reasoning,
      };
    } catch (error) {
      console.error('[Gemini] Categorization error:', error);
      return { category: 'other', confidence: 0.5 };
    }
  }

  /**
   * Parse JSON from potentially messy AI response
   */
  private parseJsonResponse(text: string): any {
    try {
      // Try direct parse first
      return JSON.parse(text);
    } catch {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1].trim());
        } catch {
          // Continue to next attempt
        }
      }

      // Try to find JSON object in text
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
}
