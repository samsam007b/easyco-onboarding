/**
 * Groq AI Provider
 * Free tier: 14,400 requests/day
 * Ultra-fast inference, great for text processing
 */

import type { CategoryResult, ChatResult, ChatMessage, ExpenseCategory } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant'; // Fast and efficient

interface GroqResponse {
  choices?: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
    type: string;
  };
}

export class GroqProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Categorize expense using Groq (ultra-fast)
   */
  async categorizeExpense(description: string, merchant?: string): Promise<CategoryResult> {
    const startTime = Date.now();

    try {
      const prompt = `Categorize this expense. Return ONLY a JSON object.

Expense: ${description}
${merchant ? `Merchant: ${merchant}` : ''}

Categories:
- groceries: Food, supermarkets (Carrefour, Delhaize, Colruyt, etc.)
- cleaning: Cleaning supplies, household items
- utilities: Electricity, water, gas, heating
- internet: Internet, phone, telecom
- rent: Rent, building charges
- entertainment: Restaurants, bars, cinema, leisure
- transport: Gas, parking, public transport
- health: Pharmacy, doctor, medical
- other: Anything else

Respond with: {"category": "name", "confidence": 0.9}`;

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 100,
          temperature: 0,
        }),
      });

      const data: GroqResponse = await response.json();
      const latencyMs = Date.now() - startTime;

      console.log(`[Groq] Categorization completed in ${latencyMs}ms`);

      if (data.error) {
        console.error('[Groq] Error:', data.error);
        return { category: 'other', confidence: 0.5 };
      }

      const textResponse = data.choices?.[0]?.message?.content;
      if (!textResponse) {
        return { category: 'other', confidence: 0.5 };
      }

      const parsed = this.parseJsonResponse(textResponse);
      return {
        category: (parsed?.category as ExpenseCategory) || 'other',
        confidence: parsed?.confidence || 0.5,
        reasoning: parsed?.reasoning,
      };
    } catch (error) {
      console.error('[Groq] Categorization error:', error);
      return { category: 'other', confidence: 0.5 };
    }
  }

  /**
   * Chat completion using Groq
   */
  async chat(messages: ChatMessage[], systemPrompt?: string): Promise<ChatResult> {
    const startTime = Date.now();

    try {
      const formattedMessages = [
        ...(systemPrompt
          ? [{ role: 'system' as const, content: systemPrompt }]
          : []),
        ...messages,
      ];

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: formattedMessages,
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      const data: GroqResponse = await response.json();
      const latencyMs = Date.now() - startTime;

      if (data.error) {
        return {
          success: false,
          provider: 'groq',
          error: data.error.message,
          latencyMs,
        };
      }

      const content = data.choices?.[0]?.message?.content;
      return {
        success: true,
        provider: 'groq',
        message: content || '',
        latencyMs,
      };
    } catch (error: any) {
      return {
        success: false,
        provider: 'groq',
        error: error.message,
        latencyMs: Date.now() - startTime,
      };
    }
  }

  /**
   * Extract expense from natural language
   */
  async parseExpenseCommand(text: string): Promise<{
    amount?: number;
    description?: string;
    merchant?: string;
    date?: string;
    category?: ExpenseCategory;
  } | null> {
    try {
      const prompt = `Extract expense information from this text. Return JSON only.

Text: "${text}"

Extract:
- amount: the monetary amount (number only)
- description: what was purchased
- merchant: store/restaurant name if mentioned
- date: date if mentioned (YYYY-MM-DD format, use today if "yesterday" etc.)
- category: one of groceries/cleaning/utilities/internet/rent/entertainment/transport/health/other

Return: {"amount": 45.50, "description": "...", "merchant": "...", "date": "...", "category": "..."}
Only include fields that are clearly stated. Return null if not an expense.`;

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200,
          temperature: 0,
        }),
      });

      const data: GroqResponse = await response.json();
      const textResponse = data.choices?.[0]?.message?.content;

      if (!textResponse || textResponse.toLowerCase().includes('null')) {
        return null;
      }

      return this.parseJsonResponse(textResponse);
    } catch (error) {
      console.error('[Groq] Parse expense error:', error);
      return null;
    }
  }

  private parseJsonResponse(text: string): any {
    try {
      return JSON.parse(text);
    } catch {
      const objectMatch = text.match(/\{[\s\S]*?\}/);
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
