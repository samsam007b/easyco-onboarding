/**
 * AI Service Module
 * Multi-provider AI integration for IzzIco
 */

export { aiService } from './ai-service';
export * from './types';

// Provider exports (for advanced usage)
export { GeminiProvider } from './providers/gemini';
export { GroqProvider } from './providers/groq';
