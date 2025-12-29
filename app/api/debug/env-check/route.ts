/**
 * Debug endpoint to check environment variables
 * TEMPORARY - Remove after debugging
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Only allow in development or with a secret token
  const isDev = process.env.NODE_ENV === 'development';

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    // Check if keys are present (not their values!)
    keys: {
      GOOGLE_AI_API_KEY: !!process.env.GOOGLE_AI_API_KEY,
      NEXT_PUBLIC_GOOGLE_AI_API_KEY: !!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY,
      TOGETHER_API_KEY: !!process.env.TOGETHER_API_KEY,
      NEXT_PUBLIC_TOGETHER_API_KEY: !!process.env.NEXT_PUBLIC_TOGETHER_API_KEY,
      GROQ_API_KEY: !!process.env.GROQ_API_KEY,
      NEXT_PUBLIC_GROQ_API_KEY: !!process.env.NEXT_PUBLIC_GROQ_API_KEY,
    },
    // Show first few chars of keys to verify they're loaded correctly
    keyPrefixes: {
      gemini: process.env.GOOGLE_AI_API_KEY?.slice(0, 8) || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY?.slice(0, 8) || 'not set',
      together: process.env.TOGETHER_API_KEY?.slice(0, 8) || process.env.NEXT_PUBLIC_TOGETHER_API_KEY?.slice(0, 8) || 'not set',
      groq: process.env.GROQ_API_KEY?.slice(0, 8) || process.env.NEXT_PUBLIC_GROQ_API_KEY?.slice(0, 8) || 'not set',
    }
  });
}
