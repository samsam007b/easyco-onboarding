import { createClient } from '@/lib/auth/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { findMatchesForSearcher, getMatchStatistics } from '@/lib/services/enhanced-matching-service';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';
import { paginationSchema, matchingScoreSchema } from '@/lib/validation/query-params';
import { z } from 'zod';
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/matching/matches
 * Get matches for the current user with optional filters
 */
export async function GET(request: NextRequest) {
  const lang = getApiLanguage(request);

  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: apiT('common.unauthorized', lang) }, { status: 401 });
    }

    // RATE LIMITING: 20 requests per minute (matching endpoints)
    const rateLimitResponse = await rateLimitMiddleware(request, 'matching', user.id);
    if (rateLimitResponse) {
      return rateLimitResponse; // 429 Too Many Requests
    }

    // SECURITY VULN-005 FIX: Validate query params with Zod
    const querySchema = z.object({
      limit: z.coerce.number().int().min(1).max(100).default(20),
      minScore: z.coerce.number().int().min(0).max(100).default(60),
      status: z.string().default('active,viewed').transform(s => s.split(',')),
      includeStats: z.coerce.boolean().default(false),
    });

    const { limit, minScore, status, includeStats } = querySchema.parse({
      limit: searchParams.get('limit'),
      minScore: searchParams.get('minScore'),
      status: searchParams.get('status'),
      includeStats: searchParams.get('includeStats'),
    });

    // Get matches
    const matches = await findMatchesForSearcher(user.id, {
      limit,
      minScore,
      status: status as any,
    });

    // Get statistics if requested
    let stats = null;
    if (includeStats) {
      stats = await getMatchStatistics(user.id);
    }

    return NextResponse.json({
      success: true,
      matches,
      stats,
      count: matches.length,
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: apiT('common.internalServerError', lang) }, { status: 500 });
  }
}
