import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { checkRateLimit, getClientIdentifier } from '@/lib/security/rate-limiter';
import { logger } from '@/lib/security/logger';

// Schema validation for analytics events
interface AnalyticsEvent {
  event_name: string;
  event_params?: Record<string, any>;
  timestamp?: string;
}

function validateAnalyticsEvent(body: any): body is AnalyticsEvent {
  if (typeof body !== 'object' || body === null) {
    return false;
  }

  if (typeof body.event_name !== 'string' || body.event_name.length === 0) {
    return false;
  }

  if (body.event_name.length > 100) {
    return false;
  }

  if (body.event_params !== undefined) {
    if (typeof body.event_params !== 'object' || Array.isArray(body.event_params)) {
      return false;
    }
    // Limit size of event params
    if (JSON.stringify(body.event_params).length > 5000) {
      return false;
    }
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(
      `analytics:${clientId}`,
      'analytics',
      100, // 100 requests
      60   // per minute
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit?.toString() || '100',
            'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
          }
        }
      );
    }

    // Authentication required
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate JSON
    let body: any;
    try {
      body = await request.json();
    } catch (parseError) {
      logger.error('Invalid JSON in analytics request', parseError as Error);
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    // Validate event schema
    if (!validateAnalyticsEvent(body)) {
      return NextResponse.json(
        { error: 'Invalid analytics event format' },
        { status: 400 }
      );
    }

    // Log the analytics event securely (without sensitive data)
    logger.info('Analytics event received', {
      userId: user.id,
      eventName: body.event_name,
      timestamp: body.timestamp || new Date().toISOString(),
      // Don't log full event_params to avoid logging sensitive data
    });

    // In production, you would send this to your analytics service
    // For now, we just acknowledge receipt
    return NextResponse.json(
      { ok: true, message: 'Event received' },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Analytics error', error as Error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
