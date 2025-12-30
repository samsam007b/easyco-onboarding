/**
 * DEBUG ENDPOINT - Assistant Configuration Check
 *
 * Returns status of AI providers without revealing keys
 * DELETE THIS FILE AFTER DEBUGGING
 */

import { NextResponse } from 'next/server';
import {
  isGroqConfigured,
  isGeminiConfigured,
  isOpenAIConfigured,
  isAnyAIProviderConfigured,
  getUsageStats,
} from '@/lib/services/assistant';

export async function GET() {
  const config = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    providers: {
      faq: {
        status: 'always_available',
        description: 'Local FAQ system - no API key needed',
      },
      groq: {
        configured: isGroqConfigured(),
        keyPrefix: process.env.GROQ_API_KEY
          ? `${process.env.GROQ_API_KEY.substring(0, 8)}...`
          : null,
      },
      gemini: {
        configured: isGeminiConfigured(),
        keyPrefix: (process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_CLOUD_API_KEY)
          ? `${(process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_CLOUD_API_KEY || '').substring(0, 8)}...`
          : null,
      },
      openai: {
        configured: isOpenAIConfigured(),
        keyPrefix: process.env.OPENAI_API_KEY
          ? `${process.env.OPENAI_API_KEY.substring(0, 8)}...`
          : null,
      },
    },
    anyAIConfigured: isAnyAIProviderConfigured(),
    usageStats: getUsageStats(),
    envCheck: {
      GROQ_API_KEY: !!process.env.GROQ_API_KEY,
      NEXT_PUBLIC_GROQ_API_KEY: !!process.env.NEXT_PUBLIC_GROQ_API_KEY,
      GOOGLE_CLOUD_API_KEY: !!process.env.GOOGLE_CLOUD_API_KEY,
      GOOGLE_GEMINI_API_KEY: !!process.env.GOOGLE_GEMINI_API_KEY,
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    },
    message: 'Si tous les providers sont false, les variables ne sont pas configurées dans Vercel',
  };

  return NextResponse.json(config, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
