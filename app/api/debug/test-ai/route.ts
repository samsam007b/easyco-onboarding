/**
 * Debug endpoint to test AI API connectivity
 * TEMPORARY - Remove after debugging
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_MODEL = 'gemini-2.0-flash';

export async function GET() {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
  };

  // Test Gemini API with a simple text request (no image)
  const geminiKey = process.env.GOOGLE_AI_API_KEY;
  if (geminiKey) {
    try {
      const response = await fetch(
        `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Say "OK" if you can hear me.' }] }],
            generationConfig: { maxOutputTokens: 10 },
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        results.gemini = {
          success: false,
          status: response.status,
          error: data.error.message,
          errorCode: data.error.code,
        };
      } else {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        results.gemini = {
          success: true,
          response: text,
        };
      }
    } catch (error: any) {
      results.gemini = {
        success: false,
        error: error.message,
      };
    }
  } else {
    results.gemini = { success: false, error: 'API key not configured' };
  }

  // Test Together API with a simple text request
  const togetherKey = process.env.TOGETHER_API_KEY;
  if (togetherKey) {
    try {
      const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${togetherKey}`,
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
          messages: [{ role: 'user', content: 'Say "OK"' }],
          max_tokens: 10,
        }),
      });

      const data = await response.json();

      if (data.error) {
        results.together = {
          success: false,
          status: response.status,
          error: data.error.message || data.error,
        };
      } else {
        const text = data.choices?.[0]?.message?.content;
        results.together = {
          success: true,
          response: text,
        };
      }
    } catch (error: any) {
      results.together = {
        success: false,
        error: error.message,
      };
    }
  } else {
    results.together = { success: false, error: 'API key not configured' };
  }

  return NextResponse.json(results);
}
