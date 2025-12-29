/**
 * AI Service Types
 * Unified types for multi-provider AI integration
 */

export type AIProvider = 'gemini' | 'openai' | 'together' | 'groq' | 'mistral' | 'tesseract';

export type AIFeature = 'ocr' | 'categorization' | 'chat' | 'document_analysis';

export interface AIProviderConfig {
  name: AIProvider;
  apiKey?: string;
  enabled: boolean;
  priority: number; // Lower = higher priority
  dailyLimit: number;
  supportsVision: boolean;
  supportsChat: boolean;
}

export interface AIUsage {
  provider: AIProvider;
  feature: AIFeature;
  tokensUsed?: number;
  success: boolean;
  latencyMs: number;
  timestamp: Date;
}

export interface OCRResult {
  success: boolean;
  provider: AIProvider;
  data?: {
    merchant?: string;
    total?: number;
    date?: string;
    items?: OCRLineItem[];
    category?: ExpenseCategory;
    raw_text?: string;
    confidence: number;
  };
  error?: string;
  latencyMs: number;
}

export interface OCRLineItem {
  name: string;
  quantity?: number;
  unit_price?: number;
  total_price: number;
}

export type ExpenseCategory =
  | 'groceries'      // Courses alimentaires
  | 'cleaning'       // Ménage & Entretien
  | 'utilities'      // Charges (électricité, eau, gaz)
  | 'internet'       // Internet & Télécom
  | 'rent'           // Loyer & Charges communes
  | 'entertainment'  // Sorties & Loisirs
  | 'transport'      // Transport
  | 'health'         // Santé
  | 'other';         // Autres

export interface CategoryResult {
  category: ExpenseCategory;
  confidence: number;
  reasoning?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResult {
  success: boolean;
  provider: AIProvider;
  message?: string;
  error?: string;
  latencyMs: number;
}

export interface DocumentAnalysisResult {
  success: boolean;
  provider: AIProvider;
  data?: {
    document_type: 'lease' | 'invoice' | 'receipt' | 'contract' | 'unknown';
    summary?: string;
    key_points?: string[];
    dates?: { label: string; date: string }[];
    amounts?: { label: string; amount: number }[];
    parties?: string[];
  };
  error?: string;
  latencyMs: number;
}

// Category labels in French
export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  groceries: 'Courses alimentaires',
  cleaning: 'Ménage & Entretien',
  utilities: 'Charges (électricité, eau, gaz)',
  internet: 'Internet & Télécom',
  rent: 'Loyer & Charges communes',
  entertainment: 'Sorties & Loisirs',
  transport: 'Transport',
  health: 'Santé',
  other: 'Autres',
};

// Category icons
export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  groceries: '🛒',
  cleaning: '🧹',
  utilities: '💡',
  internet: '📡',
  rent: '🏠',
  entertainment: '🎉',
  transport: '🚗',
  health: '🏥',
  other: '📦',
};
