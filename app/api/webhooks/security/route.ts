import { NextRequest, NextResponse } from 'next/server';
import { sendSecurityNotification, SecurityEvent } from '@/lib/services/security-notifications';

/**
 * SECURITY WEBHOOK ENDPOINT
 *
 * This endpoint receives security events from:
 * - Supabase database triggers
 * - External monitoring services
 * - Internal error tracking
 *
 * It processes events and sends notifications via configured channels.
 */

// Verify webhook secret for security
function verifyWebhookSecret(request: NextRequest): boolean {
  const secret = request.headers.get('x-webhook-secret');
  const expectedSecret = process.env.SECURITY_WEBHOOK_SECRET;

  // In development, allow all if no secret configured
  if (!expectedSecret && process.env.NODE_ENV === 'development') {
    return true;
  }

  return secret === expectedSecret;
}

export async function POST(request: NextRequest) {
  // Verify webhook secret
  if (!verifyWebhookSecret(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // Handle Supabase webhook format
    if (body.type === 'INSERT' && body.table) {
      return handleSupabaseWebhook(body);
    }

    // Handle direct event format
    if (body.event) {
      return handleDirectEvent(body.event);
    }

    return NextResponse.json(
      { error: 'Invalid payload format' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[SecurityWebhook] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle Supabase database trigger webhooks
async function handleSupabaseWebhook(payload: {
  type: string;
  table: string;
  record: Record<string, any>;
  old_record?: Record<string, any>;
}) {
  const { table, record } = payload;

  let event: SecurityEvent | null = null;

  switch (table) {
    case 'security_alerts':
      // Only notify for new alerts with critical/high severity
      if (record.severity === 'critical' || record.severity === 'high') {
        event = {
          type: 'alert',
          severity: record.severity,
          title: record.title,
          description: record.description || 'Security alert triggered',
          metadata: {
            alert_id: record.id,
            alert_type: record.alert_type,
            source: record.source,
          },
          timestamp: record.created_at,
        };
      }
      break;

    case 'security_errors':
      // Only notify for critical errors
      if (record.severity === 'critical') {
        event = {
          type: 'error',
          severity: record.severity,
          title: `Critical Error: ${record.error_type}`,
          description: record.message || 'A critical error occurred',
          metadata: {
            error_id: record.id,
            route: record.route,
            stack_trace: record.stack_trace,
          },
          timestamp: record.created_at,
        };
      }
      break;

    case 'security_vulnerabilities':
      // Notify for new critical/high vulnerabilities
      if (record.severity === 'critical' || record.severity === 'high') {
        event = {
          type: 'vulnerability',
          severity: record.severity,
          title: record.title || 'New vulnerability detected',
          description: record.description || 'A security vulnerability was detected',
          metadata: {
            vulnerability_id: record.id,
            cve_id: record.cve_id,
            affected_component: record.affected_component,
          },
          timestamp: record.created_at,
        };
      }
      break;

    default:
      console.log(`[SecurityWebhook] Ignoring event from table: ${table}`);
  }

  if (event) {
    const result = await sendSecurityNotification(event);
    return NextResponse.json({
      success: true,
      notified: result.success,
      channels: result.channels,
    });
  }

  return NextResponse.json({
    success: true,
    notified: false,
    reason: 'Event did not meet notification threshold',
  });
}

// Handle direct event format
async function handleDirectEvent(event: SecurityEvent) {
  // Validate event
  if (!event.type || !event.severity || !event.title) {
    return NextResponse.json(
      { error: 'Invalid event format. Required: type, severity, title' },
      { status: 400 }
    );
  }

  const validTypes = ['alert', 'error', 'vulnerability'];
  const validSeverities = ['critical', 'high', 'medium', 'low'];

  if (!validTypes.includes(event.type)) {
    return NextResponse.json(
      { error: `Invalid event type. Must be one of: ${validTypes.join(', ')}` },
      { status: 400 }
    );
  }

  if (!validSeverities.includes(event.severity)) {
    return NextResponse.json(
      { error: `Invalid severity. Must be one of: ${validSeverities.join(', ')}` },
      { status: 400 }
    );
  }

  const result = await sendSecurityNotification(event);

  return NextResponse.json({
    success: true,
    notified: result.success,
    channels: result.channels,
  });
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'security-webhook',
    timestamp: new Date().toISOString(),
  });
}
