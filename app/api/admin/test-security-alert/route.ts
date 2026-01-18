/**
 * TEST SECURITY ALERT ENDPOINT
 *
 * Allows admins to test the security notification system.
 * Only accessible to authenticated admin users.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { getAdminClient } from '@/lib/auth/supabase-admin';
import { sendSecurityNotification } from '@/lib/services/security-notifications';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';
import { validateAdminRequest } from '@/lib/security/admin-auth';

export async function POST(request: NextRequest) {
  const lang = getApiLanguage(request);

  try {
    // Verify authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: apiT('common.unauthorized', lang) },
        { status: 401 }
      );
    }

    // Check if user is admin using admin client (bypasses RLS)
    const adminClient = getAdminClient();
    const { data: admin } = await adminClient
      .from('admins')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!admin) {
      return NextResponse.json(
        { error: apiT('admin.accessRequired', lang) },
        { status: 403 }
      );
    }

    // Get test parameters from request body
    const body = await request.json().catch(() => ({}));
    const severity = body.severity || 'high';
    const testType = body.type || 'alert';

    // Send test notification
    const result = await sendSecurityNotification({
      type: testType,
      severity,
      title: 'Test Security Alert',
      description: `This is a test ${severity} ${testType} triggered by admin ${user.email}. If you received this email, your security notifications are working correctly.`,
      metadata: {
        triggered_by: user.email,
        triggered_at: new Date().toISOString(),
        test: true,
      },
    });

    return NextResponse.json({
      success: result.success,
      message: apiT('security.testAlertSent', lang),
      channels: result.channels,
      errors: result.errors,
      config: {
        emailEnabled: !!process.env.SECURITY_EMAIL_ENABLED,
        slackEnabled: !!process.env.SECURITY_SLACK_WEBHOOK_URL,
        recipients: process.env.SECURITY_EMAIL_RECIPIENTS?.split(',') || [],
        minSeverity: process.env.SECURITY_MIN_SEVERITY || 'high',
        resendConfigured: !!process.env.RESEND_API_KEY,
      },
    });
  } catch (error) {
    console.error('[TestSecurityAlert] Error:', error);
    return NextResponse.json(
      { error: apiT('security.sendTestAlertError', lang), details: String(error) },
      { status: 500 }
    );
  }
}

// GET endpoint to check configuration status
export async function GET(request: NextRequest) {
  const lang = getApiLanguage(request);

  try {
    // Verify authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: apiT('common.unauthorized', lang) },
        { status: 401 }
      );
    }

    // Check if user is admin using admin client (bypasses RLS)
    const adminClient = getAdminClient();
    const { data: admin } = await adminClient
      .from('admins')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!admin) {
      return NextResponse.json(
        { error: apiT('admin.accessRequired', lang) },
        { status: 403 }
      );
    }

    // Return configuration status
    const recipients = process.env.SECURITY_EMAIL_RECIPIENTS?.split(',').filter(Boolean) || [];

    return NextResponse.json({
      status: 'ok',
      configuration: {
        emailEnabled: process.env.SECURITY_EMAIL_ENABLED === 'true',
        slackEnabled: !!process.env.SECURITY_SLACK_WEBHOOK_URL,
        resendConfigured: !!process.env.RESEND_API_KEY,
        recipientCount: recipients.length,
        recipients: recipients.map(r => r.replace(/(.{3}).*(@.*)/, '$1***$2')), // Mask emails
        minSeverity: process.env.SECURITY_MIN_SEVERITY || 'high',
      },
      ready: !!(
        process.env.SECURITY_EMAIL_ENABLED === 'true' &&
        process.env.RESEND_API_KEY &&
        recipients.length > 0
      ),
    });
  } catch (error) {
    console.error('[TestSecurityAlert] Error:', error);
    return NextResponse.json(
      { error: apiT('security.checkConfigError', lang) },
      { status: 500 }
    );
  }
}
