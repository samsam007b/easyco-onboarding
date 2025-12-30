/**
 * API Endpoint: Web Vitals Metrics Collection
 *
 * Receives Core Web Vitals metrics from the client and stores them
 * for the Performance Dashboard.
 *
 * Features:
 * - Rate limiting (max 100 requests per minute per IP)
 * - Batch insertion for efficiency
 * - Graceful degradation if table doesn't exist
 */

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/lib/auth/supabase-server';

export const dynamic = 'force-dynamic';

// ============================================================================
// TYPES
// ============================================================================

interface MetricEntry {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
  timestamp: number;
  path: string;
  userAgent: string;
}

interface RequestBody {
  metrics: MetricEntry[];
}

// ============================================================================
// RATE LIMITING (in-memory, simple)
// ============================================================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 60 * 1000);

// ============================================================================
// VALIDATION
// ============================================================================

const VALID_METRIC_NAMES = ['CLS', 'INP', 'FCP', 'LCP', 'TTFB'];
const VALID_RATINGS = ['good', 'needs-improvement', 'poor'];

function isValidMetric(metric: unknown): metric is MetricEntry {
  if (!metric || typeof metric !== 'object') return false;

  const m = metric as Record<string, unknown>;

  return (
    typeof m.name === 'string' &&
    VALID_METRIC_NAMES.includes(m.name) &&
    typeof m.value === 'number' &&
    m.value >= 0 &&
    m.value < 100000 && // Sanity check: no metric should be > 100s
    typeof m.rating === 'string' &&
    VALID_RATINGS.includes(m.rating) &&
    typeof m.id === 'string' &&
    typeof m.timestamp === 'number' &&
    typeof m.path === 'string' &&
    m.path.length < 500 && // Sanity check
    typeof m.userAgent === 'string' &&
    m.userAgent.length < 1000 // Sanity check
  );
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] ||
               headersList.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Parse request body
    let body: RequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    // Validate metrics array
    if (!body.metrics || !Array.isArray(body.metrics)) {
      return NextResponse.json(
        { error: 'Missing or invalid metrics array' },
        { status: 400 }
      );
    }

    // Limit batch size
    if (body.metrics.length > 50) {
      return NextResponse.json(
        { error: 'Too many metrics in batch (max 50)' },
        { status: 400 }
      );
    }

    // Validate and filter metrics
    const validMetrics = body.metrics.filter(isValidMetric);

    if (validMetrics.length === 0) {
      return NextResponse.json(
        { error: 'No valid metrics provided' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Prepare records for insertion
    const records = validMetrics.map(metric => ({
      metric_name: metric.name,
      metric_value: metric.value,
      rating: metric.rating,
      metric_id: metric.id,
      page_path: metric.path.substring(0, 255), // Truncate to fit column
      user_agent: metric.userAgent.substring(0, 512), // Truncate
      recorded_at: new Date(metric.timestamp).toISOString(),
    }));

    // Try to insert - gracefully handle if table doesn't exist
    const { error } = await supabase
      .from('web_vitals_metrics')
      .insert(records);

    if (error) {
      // Check if it's a "table doesn't exist" error
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        // Log but don't fail - table might not be created yet
        console.warn('[Web Vitals API] Table web_vitals_metrics does not exist. Metrics not persisted.');
        return NextResponse.json({
          ok: true,
          stored: 0,
          warning: 'Metrics table not configured'
        });
      }

      // Log other errors but still return success to client
      console.error('[Web Vitals API] Insert error:', error);
      return NextResponse.json({
        ok: true,
        stored: 0,
        warning: 'Storage temporarily unavailable'
      });
    }

    return NextResponse.json({
      ok: true,
      stored: records.length
    });

  } catch (error: unknown) {
    console.error('[Web Vitals API] Error:', error);

    // Always return 200 to client - we don't want to retry on errors
    return NextResponse.json({
      ok: true,
      stored: 0,
      warning: 'Internal processing error'
    });
  }
}

// ============================================================================
// GET - Health check / stats
// ============================================================================

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'web-vitals',
    acceptedMetrics: VALID_METRIC_NAMES,
    rateLimit: `${RATE_LIMIT} requests per minute`,
  });
}
