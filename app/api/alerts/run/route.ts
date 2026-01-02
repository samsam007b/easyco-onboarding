/**
 * API Route: Run Automatic Alerts
 * POST /api/alerts/run
 *
 * This endpoint triggers automatic alert notifications for:
 * - Lease expirations
 * - Overdue maintenance tickets
 * - Daily digests
 *
 * Typically called by a cron job (e.g., Vercel Cron, external scheduler)
 *
 * Security: Requires CRON_SECRET header for authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { alertsNotificationService } from '@/lib/services/alerts-notification-service';

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret for security (optional but recommended)
    const cronSecret = request.headers.get('x-cron-secret');
    const expectedSecret = process.env.CRON_SECRET;

    // If CRON_SECRET is configured, require it
    if (expectedSecret && cronSecret !== expectedSecret) {
      console.warn('[API/alerts/run] Unauthorized request - invalid cron secret');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse optional config from request body
    const body = await request.json().catch(() => ({}));
    const config = body.config || undefined;

    console.log('[API/alerts/run] Starting alerts run...');

    // Run all alerts
    const results = await alertsNotificationService.runAllAlerts(config);

    const totalSent =
      results.leaseAlerts.sent +
      results.maintenanceAlerts.sent +
      results.dailyDigests.sent;

    const totalFailed =
      results.leaseAlerts.failed +
      results.maintenanceAlerts.failed +
      results.dailyDigests.failed;

    console.log(`[API/alerts/run] Complete: ${totalSent} sent, ${totalFailed} failed`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results: {
        leaseAlerts: results.leaseAlerts,
        maintenanceAlerts: results.maintenanceAlerts,
        dailyDigests: results.dailyDigests,
        summary: {
          totalSent,
          totalFailed,
        },
      },
    });
  } catch (error) {
    console.error('[API/alerts/run] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to run alerts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Allow GET for easy testing in development
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Use POST method in production' },
      { status: 405 }
    );
  }

  // Forward to POST handler
  return POST(request);
}
