/**
 * Unified AI Service - SECURE VERSION
 *
 * SECURITY PRINCIPLES:
 * 1. ZERO CLIENT DATA TO AI - Only send raw images + minimal prompts
 * 2. PRE-EMPTIVE SWITCHING - Switch providers at 80% usage, not 100%
 * 3. METADATA STRIPPING - Remove all EXIF data from images
 * 4. AUDIT LOGGING - Track all AI calls (without data content)
 * 5. NO CONTEXT - Never send user IDs, property IDs, or any identifying info
 */

import { GeminiProvider } from './providers/gemini';
import { TogetherProvider } from './providers/together';
import { GroqProvider } from './providers/groq';
import { ocrService } from '../ocr-service'; // Tesseract fallback
import {
  sanitizeImage,
  sanitizeText,
  auditLog,
  shouldSwitchProvider,
  AI_SECURITY_CONFIG,
} from './security';
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

// Daily limits per provider - CONSERVATIVE to stay in free tier
// We switch at 80% of these limits to NEVER hit paid usage
const DAILY_LIMITS: Record<AIProvider, number> = {
  gemini: 40,      // Free tier ~50/day, switch at 32
  openai: 10,      // $5 credits, switch at 8
  together: 80,    // $25 credits, switch at 64
  groq: 8000,      // Very generous free tier, switch at 6400
  mistral: 400,    // Good free tier, switch at 320
  tesseract: Infinity, // Local, unlimited, never switch
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
   * Check if provider is SAFELY available
   * Returns false at 80% usage to prevent hitting paid limits
   */
  private canSafelyUseProvider(provider: AIProvider): boolean {
    const usage = usageTracker[provider];
    const now = new Date();

    // Reset counter if new day
    if (usage.resetAt.getDate() !== now.getDate()) {
      usage.count = 0;
      usage.resetAt = now;
      console.log(`[AI] 🔄 Reset daily counter for ${provider}`);
    }

    const limit = DAILY_LIMITS[provider];
    const safeLimit = Math.floor(limit * AI_SECURITY_CONFIG.SWITCH_THRESHOLD);

    // Check if we're approaching the limit
    if (shouldSwitchProvider(usage.count, limit)) {
      console.log(`[AI] ⚠️ ${provider} at ${usage.count}/${limit} (${Math.round(usage.count/limit*100)}%) - SWITCHING to stay free`);
      return false;
    }

    return usage.count < safeLimit;
  }

  /**
   * Track provider usage with audit logging
   */
  private trackUsage(provider: AIProvider, success: boolean, latencyMs: number) {
    usageTracker[provider].count++;
    const usage = usageTracker[provider];
    const limit = DAILY_LIMITS[provider];
    const percentage = Math.round((usage.count / limit) * 100);

    console.log(`[AI] 📊 ${provider}: ${usage.count}/${limit} (${percentage}%)`);

    // Audit log (no sensitive data)
    auditLog('ai_call', provider, {
      success,
      latencyMs,
      usageCount: usage.count,
      usageLimit: limit,
    });

    // Warn if approaching limit
    if (percentage >= 70) {
      console.warn(`[AI] ⚠️ ${provider} approaching limit: ${percentage}%`);
    }
  }

  /**
   * Analyze receipt image with SECURE processing
   * - Strips image metadata
   * - Sends minimal prompt
   * - No client context
   * - Pre-emptive provider switching
   */
  async analyzeReceipt(imageFile: File): Promise<OCRResult> {
    console.log('[AI] 🔒 Starting SECURE receipt analysis...');
    const startTime = Date.now();

    // Convert file to base64
    let base64 = await this.fileToBase64(imageFile);
    const mimeType = imageFile.type || 'image/jpeg';

    // SECURITY: Strip all metadata from image
    try {
      if (typeof window !== 'undefined') {
        base64 = await sanitizeImage(base64, mimeType);
        console.log('[AI] 🔒 Image metadata stripped');
      }
    } catch (error) {
      console.warn('[AI] Could not sanitize image, proceeding with original');
    }

    // Try Gemini first (best quality) - only if SAFELY under limit
    if (this.gemini && this.canSafelyUseProvider('gemini')) {
      console.log('[AI] Trying Gemini (secure mode)...');
      const result = await this.gemini.analyzeReceipt(base64, mimeType);
      const latencyMs = Date.now() - startTime;
      this.trackUsage('gemini', result.success, latencyMs);

      if (result.success) {
        return { ...result, latencyMs };
      }
      console.warn('[AI] Gemini failed, trying fallback...');
    }

    // Try Together AI (Llama Vision) - only if SAFELY under limit
    if (this.together && this.canSafelyUseProvider('together')) {
      console.log('[AI] Trying Together AI (secure mode)...');
      const result = await this.together.analyzeReceipt(base64, mimeType);
      const latencyMs = Date.now() - startTime;
      this.trackUsage('together', result.success, latencyMs);

      if (result.success) {
        return { ...result, latencyMs };
      }
      console.warn('[AI] Together AI failed, trying fallback...');
    }

    // Fallback to Tesseract (LOCAL - 100% secure, no data leaves device)
    console.log('[AI] 🔒 Using Tesseract (100% local, no data sent externally)...');
    try {
      const tesseractResult = await ocrService.scanReceipt(imageFile);
      const latencyMs = Date.now() - startTime;

      auditLog('ai_call', 'tesseract', {
        success: tesseractResult.success,
        latencyMs,
        note: 'local_processing',
      });

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
   * Categorize expense with SECURE processing
   * - Sanitizes input text
   * - Minimal prompt
   * - Pre-emptive switching
   */
  async categorizeExpense(description: string, merchant?: string): Promise<CategoryResult> {
    // SECURITY: Sanitize input before sending to AI
    const safeDescription = sanitizeText(description);
    const safeMerchant = merchant ? sanitizeText(merchant) : undefined;

    console.log('[AI] 🔒 Categorizing (sanitized input)');

    // Try Groq first (ultra-fast, generous free tier)
    if (this.groq && this.canSafelyUseProvider('groq')) {
      const startTime = Date.now();
      const result = await this.groq.categorizeExpense(safeDescription, safeMerchant);
      this.trackUsage('groq', result.confidence > 0.5, Date.now() - startTime);

      if (result.confidence > 0.6) {
        return result;
      }
    }

    // Try Gemini - only if safely under limit
    if (this.gemini && this.canSafelyUseProvider('gemini')) {
      const startTime = Date.now();
      const result = await this.gemini.categorizeExpense(safeDescription, safeMerchant);
      this.trackUsage('gemini', result.confidence > 0.5, Date.now() - startTime);

      if (result.confidence > 0.6) {
        return result;
      }
    }

    // Try Together AI - only if safely under limit
    if (this.together && this.canSafelyUseProvider('together')) {
      const startTime = Date.now();
      const result = await this.together.categorizeExpense(safeDescription, safeMerchant);
      this.trackUsage('together', result.confidence > 0.5, Date.now() - startTime);

      if (result.confidence > 0.5) {
        return result;
      }
    }

    // Fallback to rule-based categorization (100% local)
    console.log('[AI] 🔒 Using local rule-based categorization');
    return this.ruleBasedCategorization(safeDescription, safeMerchant);
  }

  /**
   * Chat with AI assistant
   * SECURITY: Uses sanitized input
   */
  async chat(messages: ChatMessage[], systemPrompt?: string): Promise<ChatResult> {
    // Sanitize all user messages
    const safeMessages = messages.map((msg) => ({
      ...msg,
      content: msg.role === 'user' ? sanitizeText(msg.content) : msg.content,
    }));

    const defaultSystemPrompt = systemPrompt || `Tu es un assistant pour une application de gestion de colocation.
Réponds de manière concise en français. N'inclus jamais d'informations personnelles dans tes réponses.`;

    if (this.groq && this.canSafelyUseProvider('groq')) {
      const startTime = Date.now();
      const result = await this.groq.chat(safeMessages, defaultSystemPrompt);
      this.trackUsage('groq', result.success, Date.now() - startTime);
      return result;
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
   * SECURITY: Sanitizes input
   */
  async parseExpenseCommand(text: string): Promise<{
    amount?: number;
    description?: string;
    merchant?: string;
    date?: string;
    category?: ExpenseCategory;
  } | null> {
    const safeText = sanitizeText(text);

    if (this.groq && this.canSafelyUseProvider('groq')) {
      const startTime = Date.now();
      const result = await this.groq.parseExpenseCommand(safeText);
      this.trackUsage('groq', !!result, Date.now() - startTime);
      return result;
    }
    return null;
  }

  /**
   * Rule-based categorization fallback (100% LOCAL)
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
   * Get current usage stats (for admin dashboard)
   */
  getUsageStats(): Record<AIProvider, { used: number; limit: number; remaining: number; safeRemaining: number }> {
    const stats: Record<AIProvider, { used: number; limit: number; remaining: number; safeRemaining: number }> = {} as any;

    for (const provider of Object.keys(usageTracker) as AIProvider[]) {
      const used = usageTracker[provider].count;
      const limit = DAILY_LIMITS[provider];
      const safeLimit = Math.floor(limit * AI_SECURITY_CONFIG.SWITCH_THRESHOLD);

      stats[provider] = {
        used,
        limit,
        remaining: Math.max(0, limit - used),
        safeRemaining: Math.max(0, safeLimit - used), // Remaining before we switch
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
   * Get security status
   */
  getSecurityStatus(): {
    metadataStripping: boolean;
    preEmptiveSwitching: boolean;
    auditLogging: boolean;
    switchThreshold: number;
  } {
    return {
      metadataStripping: AI_SECURITY_CONFIG.STRIP_METADATA,
      preEmptiveSwitching: true,
      auditLogging: AI_SECURITY_CONFIG.AUDIT_LOGGING,
      switchThreshold: AI_SECURITY_CONFIG.SWITCH_THRESHOLD,
    };
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
