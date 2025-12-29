/**
 * ERROR LOGGING ENDPOINT
 *
 * Logs errors (404, runtime, etc.) to the security_errors table.
 * Used by client-side error boundaries and not-found pages.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/auth/supabase-admin';
import { headers } from 'next/headers';

interface ErrorLogRequest {
  type: '404' | 'runtime' | 'client' | 'api';
  message: string;
  route?: string;
  stack?: string;
  metadata?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body: ErrorLogRequest = await request.json();
    const headersList = await headers();

    // Get client info
    const userAgent = headersList.get('user-agent') || 'Unknown';
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0]?.trim() || realIp || 'Unknown';

    // Map error type to severity
    const severityMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
      '404': 'low',
      'client': 'medium',
      'runtime': 'high',
      'api': 'high',
    };

    const adminClient = getAdminClient();

    // Insert error into security_errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminClient as any).from('security_errors').insert({
      error_type: body.type === '404' ? 'validation' : 'exception',
      severity: severityMap[body.type] || 'medium',
      message: body.message,
      stack_trace: body.stack,
      route: body.route || request.headers.get('referer'),
      method: body.type === '404' ? 'GET' : 'UNKNOWN',
      status_code: body.type === '404' ? 404 : 500,
      ip_address: ipAddress !== 'Unknown' ? ipAddress : null,
      user_agent: userAgent,
      metadata: {
        error_type: body.type,
        ...body.metadata,
      },
    });

    if (error) {
      console.error('[ErrorLog] Failed to insert error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to log error' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ErrorLog] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    );
  }
}
