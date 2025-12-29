/**
 * Together AI Provider
 * Free tier: $25 credits
 * Uses Llama Vision for OCR
 */

import type { OCRResult, CategoryResult, ExpenseCategory, OCRLineItem } from '../types';

const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';
const VISION_MODEL = 'meta-llama/Llama-Vision-Free'; // Free vision model
const TEXT_MODEL = 'meta-llama/Llama-3.2-3B-Instruct-Turbo'; // Fast text model

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

export class TogetherProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Analyze receipt image using Llama Vision
   */
  async analyzeReceipt(imageBase64: string, mimeType: string): Promise<OCRResult> {
    const startTime = Date.now();

    try {
      const prompt = `Analyze this receipt image and extract the following information in JSON format:
{
  "merchant": "store name",
  "total": numeric total amount (just the number),
  "date": "YYYY-MM-DD format",
  "items": [
    {"name": "item name", "quantity": 1, "unit_price": 0.00, "total_price": 0.00}
  ],
  "category": one of: "groceries", "cleaning", "utilities", "internet", "rent", "entertainment", "transport", "health", "other",
  "confidence": 0.0-1.0
}

Return ONLY valid JSON, no explanations.`;

      const response = await fetch(TOGETHER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: VISION_MODEL,
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

      // Parse JSON response
      const parsed = this.parseJsonResponse(textResponse);
      if (!parsed) {
        return {
          success: false,
          provider: 'together',
          error: 'Failed to parse Together AI response',
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
          confidence: parsed.confidence || 0.7,
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

  /**
   * Categorize expense using Llama
   */
  async categorizeExpense(description: string, merchant?: string): Promise<CategoryResult> {
    try {
      const prompt = `Categorize this expense into exactly one category.

Description: ${description}
${merchant ? `Merchant: ${merchant}` : ''}

Categories:
- groceries: Food shopping, supermarkets
- cleaning: Cleaning supplies, maintenance
- utilities: Electricity, water, gas
- internet: Internet, phone
- rent: Rent, common charges
- entertainment: Restaurants, outings
- transport: Gas, public transport
- health: Pharmacy, medical
- other: Everything else

Return JSON only:
{"category": "category_name", "confidence": 0.8}`;

      const response = await fetch(TOGETHER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: TEXT_MODEL,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 100,
          temperature: 0.1,
        }),
      });

      const data: TogetherResponse = await response.json();
      const textResponse = data.choices?.[0]?.message?.content;

      if (!textResponse) {
        return { category: 'other', confidence: 0.5 };
      }

      const parsed = this.parseJsonResponse(textResponse);
      return {
        category: parsed?.category || 'other',
        confidence: parsed?.confidence || 0.5,
      };
    } catch (error) {
      console.error('[Together] Categorization error:', error);
      return { category: 'other', confidence: 0.5 };
    }
  }

  private parseJsonResponse(text: string): any {
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
}
