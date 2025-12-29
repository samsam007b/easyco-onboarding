/**
 * Unified AI Service
 * Orchestrates multiple AI providers with automatic fallback
 * Prioritizes free tiers and handles rate limiting
 */

import { GeminiProvider } from './providers/gemini';
import { TogetherProvider } from './providers/together';
import { GroqProvider } from './providers/groq';
import { ocrService } from '../ocr-service'; // Tesseract fallback
import type {
  AIProvider,
  OCRResult,
  CategoryResult,
  ChatResult,
  ChatMessage,
  ExpenseCategory,
} from './types';

// Daily usage tracking (in-memory, resets on app restart)
// In production, use Supabase for persistence
const usageTracker: Record<AIProvider, { count: number; resetAt: Date }> = {
  gemini: { count: 0, resetAt: new Date() },
  openai: { count: 0, resetAt: new Date() },
  together: { count: 0, resetAt: new Date() },
  groq: { count: 0, resetAt: new Date() },
  mistral: { count: 0, resetAt: new Date() },
  tesseract: { count: 0, resetAt: new Date() }, // Unlimited
};

// Daily limits per provider (conservative estimates)
const DAILY_LIMITS: Record<AIProvider, number> = {
  gemini: 40,      // Free tier ~50/day, leave buffer
  openai: 10,      // $5 credits, conserve
  together: 100,   // $25 credits
  groq: 10000,     // Very generous free tier
  mistral: 500,    // Good free tier
  tesseract: Infinity, // Local, unlimited
};

class AIService {
  private gemini: GeminiProvider | null = null;
  private together: TogetherProvider | null = null;
  private groq: GroqProvider | null = null;

  constructor() {
    this.initializeProviders();
  }

  /**
   * Initialize providers with API keys
   */
  private initializeProviders() {
    // Get API keys from environment
    const geminiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
    const togetherKey = process.env.NEXT_PUBLIC_TOGETHER_API_KEY;
    const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (geminiKey) {
      this.gemini = new GeminiProvider(geminiKey);
      console.log('[AI] ✅ Gemini provider initialized');
    }

    if (togetherKey) {
      this.together = new TogetherProvider(togetherKey);
      console.log('[AI] ✅ Together AI provider initialized');
    }

    if (groqKey) {
      this.groq = new GroqProvider(groqKey);
      console.log('[AI] ✅ Groq provider initialized');
    }

    if (!geminiKey && !togetherKey) {
      console.warn('[AI] ⚠️ No vision AI providers configured, using Tesseract fallback');
    }
  }

  /**
   * Check if provider is available (initialized and under daily limit)
   */
  private canUseProvider(provider: AIProvider): boolean {
    const usage = usageTracker[provider];
    const now = new Date();

    // Reset counter if new day
    if (usage.resetAt.getDate() !== now.getDate()) {
      usage.count = 0;
      usage.resetAt = now;
    }

    return usage.count < DAILY_LIMITS[provider];
  }

  /**
   * Track provider usage
   */
  private trackUsage(provider: AIProvider) {
    usageTracker[provider].count++;
    console.log(`[AI] ${provider} usage: ${usageTracker[provider].count}/${DAILY_LIMITS[provider]}`);
  }

  /**
   * Analyze receipt image with automatic fallback
   * Priority: Gemini → Together AI → Tesseract
   */
  async analyzeReceipt(imageFile: File): Promise<OCRResult> {
    console.log('[AI] 📸 Starting receipt analysis...');
    const startTime = Date.now();

    // Convert file to base64
    const base64 = await this.fileToBase64(imageFile);
    const mimeType = imageFile.type || 'image/jpeg';

    // Try Gemini first (best quality, free tier)
    if (this.gemini && this.canUseProvider('gemini')) {
      console.log('[AI] Trying Gemini...');
      this.trackUsage('gemini');
      const result = await this.gemini.analyzeReceipt(base64, mimeType);
      if (result.success) {
        return result;
      }
      console.warn('[AI] Gemini failed, trying fallback...');
    }

    // Try Together AI (Llama Vision)
    if (this.together && this.canUseProvider('together')) {
      console.log('[AI] Trying Together AI...');
      this.trackUsage('together');
      const result = await this.together.analyzeReceipt(base64, mimeType);
      if (result.success) {
        return result;
      }
      console.warn('[AI] Together AI failed, trying fallback...');
    }

    // Fallback to Tesseract (local, always available)
    console.log('[AI] Using Tesseract fallback...');
    try {
      const tesseractResult = await ocrService.scanReceipt(imageFile);
      const latencyMs = Date.now() - startTime;

      if (tesseractResult.success && tesseractResult.data) {
        return {
          success: true,
          provider: 'tesseract',
          data: {
            merchant: tesseractResult.data.merchant,
            total: tesseractResult.data.total,
            date: tesseractResult.data.date,
            items: tesseractResult.data.items,
            confidence: tesseractResult.data.confidence,
          },
          latencyMs,
        };
      }

      return {
        success: false,
        provider: 'tesseract',
        error: tesseractResult.error || 'OCR failed',
        latencyMs,
      };
    } catch (error: any) {
      return {
        success: false,
        provider: 'tesseract',
        error: error.message || 'Tesseract failed',
        latencyMs: Date.now() - startTime,
      };
    }
  }

  /**
   * Categorize expense with fallback
   * Priority: Groq (fast) → Gemini → Together AI → Rule-based
   */
  async categorizeExpense(description: string, merchant?: string): Promise<CategoryResult> {
    console.log('[AI] 🏷️ Categorizing expense:', description);

    // Try Groq first (ultra-fast, generous free tier)
    if (this.groq && this.canUseProvider('groq')) {
      this.trackUsage('groq');
      const result = await this.groq.categorizeExpense(description, merchant);
      if (result.confidence > 0.6) {
        return result;
      }
    }

    // Try Gemini
    if (this.gemini && this.canUseProvider('gemini')) {
      this.trackUsage('gemini');
      const result = await this.gemini.categorizeExpense(description, merchant);
      if (result.confidence > 0.6) {
        return result;
      }
    }

    // Try Together AI
    if (this.together && this.canUseProvider('together')) {
      this.trackUsage('together');
      const result = await this.together.categorizeExpense(description, merchant);
      if (result.confidence > 0.5) {
        return result;
      }
    }

    // Fallback to rule-based categorization
    return this.ruleBasedCategorization(description, merchant);
  }

  /**
   * Chat with AI assistant
   * Uses Groq for speed
   */
  async chat(messages: ChatMessage[], systemPrompt?: string): Promise<ChatResult> {
    const defaultSystemPrompt = systemPrompt || `Tu es l'assistant IA d'IzzIco, une application de gestion de colocation.
Tu aides les colocataires à gérer leurs finances, dépenses, et la vie quotidienne.
Réponds de manière concise et amicale en français.
Si on te demande d'ajouter une dépense ou de faire une action, explique comment le faire dans l'app.`;

    if (this.groq && this.canUseProvider('groq')) {
      this.trackUsage('groq');
      return this.groq.chat(messages, defaultSystemPrompt);
    }

    return {
      success: false,
      provider: 'groq',
      error: 'Aucun service de chat disponible',
      latencyMs: 0,
    };
  }

  /**
   * Parse natural language expense command
   * "J'ai payé 45€ chez Carrefour" → { amount: 45, merchant: "Carrefour" }
   */
  async parseExpenseCommand(text: string): Promise<{
    amount?: number;
    description?: string;
    merchant?: string;
    date?: string;
    category?: ExpenseCategory;
  } | null> {
    if (this.groq && this.canUseProvider('groq')) {
      this.trackUsage('groq');
      return this.groq.parseExpenseCommand(text);
    }
    return null;
  }

  /**
   * Rule-based categorization fallback
   */
  private ruleBasedCategorization(description: string, merchant?: string): CategoryResult {
    const text = `${description} ${merchant || ''}`.toLowerCase();

    // Groceries
    if (
      /carrefour|delhaize|colruyt|aldi|lidl|match|spar|proxy|intermarché|casino|monoprix|courses|supermarché|épicerie|boulangerie|boucherie/i.test(
        text
      )
    ) {
      return { category: 'groceries', confidence: 0.8 };
    }

    // Utilities
    if (/électricité|eau|gaz|energie|engie|edf|luminus|facture énergie|chauffage/i.test(text)) {
      return { category: 'utilities', confidence: 0.9 };
    }

    // Internet/Telecom
    if (/internet|wifi|téléphone|mobile|proximus|orange|voo|telenet|base|sfr|free/i.test(text)) {
      return { category: 'internet', confidence: 0.9 };
    }

    // Rent
    if (/loyer|rent|charges? communes?|syndic|copropriété/i.test(text)) {
      return { category: 'rent', confidence: 0.9 };
    }

    // Cleaning
    if (/ménage|nettoyage|produits? d'entretien|cleaning|entretien/i.test(text)) {
      return { category: 'cleaning', confidence: 0.8 };
    }

    // Entertainment
    if (/restaurant|bar|café|cinema|cinéma|netflix|spotify|sortie|concert/i.test(text)) {
      return { category: 'entertainment', confidence: 0.7 };
    }

    // Transport
    if (/essence|carburant|parking|transport|bus|tram|métro|uber|taxi|train|sncb/i.test(text)) {
      return { category: 'transport', confidence: 0.8 };
    }

    // Health
    if (/pharmacie|médecin|docteur|santé|médicament|hopital|clinique/i.test(text)) {
      return { category: 'health', confidence: 0.8 };
    }

    // Default
    return { category: 'other', confidence: 0.3 };
  }

  /**
   * Get current usage stats
   */
  getUsageStats(): Record<AIProvider, { used: number; limit: number; remaining: number }> {
    const stats: Record<AIProvider, { used: number; limit: number; remaining: number }> = {} as any;

    for (const provider of Object.keys(usageTracker) as AIProvider[]) {
      stats[provider] = {
        used: usageTracker[provider].count,
        limit: DAILY_LIMITS[provider],
        remaining: Math.max(0, DAILY_LIMITS[provider] - usageTracker[provider].count),
      };
    }

    return stats;
  }

  /**
   * Check if any AI providers are available
   */
  hasAIProviders(): boolean {
    return !!(this.gemini || this.together || this.groq);
  }

  /**
   * Convert File to base64 string
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (data:image/jpeg;base64,)
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

// Export singleton instance
export const aiService = new AIService();

// Re-export types
export * from './types';
