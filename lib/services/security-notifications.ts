/**
 * IZZICO SECURITY NOTIFICATIONS SERVICE
 *
 * Handles sending notifications for security events via:
 * - Email (via Resend or SMTP)
 * - Slack webhook
 * - In-app notifications
 */

import { createClient } from '@/lib/auth/supabase-server';
import { getAdminClient } from '@/lib/auth/supabase-admin';

// ============================================================================
// TYPES
// ============================================================================

export interface SecurityEvent {
  type: 'alert' | 'error' | 'vulnerability';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  metadata?: Record<string, any>;
  timestamp?: string;
}

interface NotificationConfig {
  emailEnabled: boolean;
  slackEnabled: boolean;
  inAppEnabled: boolean;
  emailRecipients: string[];
  slackWebhookUrl?: string;
  minSeverity: 'critical' | 'high' | 'medium' | 'low';
}

// Severity levels for comparison
const SEVERITY_LEVELS = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

// ============================================================================
// NOTIFICATION LOGGING
// ============================================================================

async function logNotification(
  event: SecurityEvent,
  channel: 'email' | 'slack' | 'in_app',
  success: boolean,
  recipients?: string[],
  errorMessage?: string
): Promise<void> {
  try {
    const adminClient = getAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (adminClient as any).from('notification_logs').insert({
      event_type: event.type,
      event_title: event.title,
      event_description: event.description,
      severity: event.severity,
      channel,
      recipients: recipients || [],
      success,
      error_message: errorMessage,
      metadata: event.metadata,
    });
  } catch (error) {
    console.error('[SecurityNotifications] Failed to log notification:', error);
  }
}

// ============================================================================
// CONFIGURATION
// ============================================================================

function getNotificationConfig(): NotificationConfig {
  return {
    emailEnabled: !!process.env.SECURITY_EMAIL_ENABLED,
    slackEnabled: !!process.env.SECURITY_SLACK_WEBHOOK_URL,
    inAppEnabled: true, // Always enabled
    emailRecipients: (process.env.SECURITY_EMAIL_RECIPIENTS || '').split(',').filter(Boolean),
    slackWebhookUrl: process.env.SECURITY_SLACK_WEBHOOK_URL,
    minSeverity: (process.env.SECURITY_MIN_SEVERITY as any) || 'high',
  };
}

// ============================================================================
// SLACK NOTIFICATIONS
// ============================================================================

async function sendSlackNotification(event: SecurityEvent, webhookUrl: string): Promise<{ success: boolean; error?: string }> {
  const severityEmoji = {
    critical: ':rotating_light:',
    high: ':warning:',
    medium: ':large_orange_diamond:',
    low: ':information_source:',
  };

  const severityColor = {
    critical: '#dc2626',
    high: '#ea580c',
    medium: '#eab308',
    low: '#3b82f6',
  };

  const payload = {
    attachments: [
      {
        color: severityColor[event.severity],
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `${severityEmoji[event.severity]} Security ${event.type.toUpperCase()}: ${event.title}`,
              emoji: true,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: event.description,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `*Severity:* ${event.severity.toUpperCase()} | *Type:* ${event.type} | *Time:* ${event.timestamp || new Date().toISOString()}`,
              },
            ],
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'View Dashboard',
                },
                url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://izzico.be'}/admin/dashboard/security`,
              },
            ],
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorMsg = `Slack notification failed: ${response.statusText}`;
      console.error('[SecurityNotifications]', errorMsg);
      await logNotification(event, 'slack', false, undefined, errorMsg);
      return { success: false, error: errorMsg };
    }

    await logNotification(event, 'slack', true);
    return { success: true };
  } catch (error) {
    const errorMsg = String(error);
    console.error('[SecurityNotifications] Slack notification error:', error);
    await logNotification(event, 'slack', false, undefined, errorMsg);
    return { success: false, error: errorMsg };
  }
}

// ============================================================================
// EMAIL NOTIFICATIONS
// ============================================================================

async function sendEmailNotification(event: SecurityEvent, recipients: string[]): Promise<{ success: boolean; error?: string }> {
  // Skip if no recipients
  if (recipients.length === 0) {
    return { success: true };
  }

  const severityColors = {
    critical: '#dc2626',
    high: '#ea580c',
    medium: '#eab308',
    low: '#3b82f6',
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Security Alert - Izzico</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 12px; overflow: hidden;">
          <div style="background: ${severityColors[event.severity]}; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">
              Security ${event.type.toUpperCase()}
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">
              Severity: ${event.severity.toUpperCase()}
            </p>
          </div>
          <div style="padding: 24px;">
            <h2 style="color: #f1f5f9; margin: 0 0 16px;">${event.title}</h2>
            <p style="color: #94a3b8; line-height: 1.6;">${event.description}</p>
            ${event.metadata ? `
              <div style="background: #0f172a; padding: 16px; border-radius: 8px; margin-top: 16px;">
                <h3 style="color: #94a3b8; font-size: 12px; margin: 0 0 8px;">DETAILS</h3>
                <pre style="color: #e2e8f0; font-size: 12px; margin: 0; white-space: pre-wrap;">${JSON.stringify(event.metadata, null, 2)}</pre>
              </div>
            ` : ''}
            <div style="margin-top: 24px; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://izzico.be'}/admin/dashboard/security"
                 style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                View Security Dashboard
              </a>
            </div>
          </div>
          <div style="background: #0f172a; padding: 16px; text-align: center;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              This is an automated security notification from Izzico.
              <br>Time: ${event.timestamp || new Date().toISOString()}
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Use Resend if available, otherwise log
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'IzzIco Security <hello@izzico.be>',
          to: recipients,
          subject: `[${event.severity.toUpperCase()}] Security ${event.type}: ${event.title}`,
          html: htmlContent,
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        const errorMsg = `Resend API error: ${responseText}`;
        console.error('[SecurityNotifications] Email notification failed:', responseText);
        await logNotification(event, 'email', false, recipients, errorMsg);
        return { success: false, error: errorMsg };
      }

      console.log('[SecurityNotifications] Email sent successfully:', responseText);
      await logNotification(event, 'email', true, recipients);
      return { success: true };
    } catch (error) {
      const errorMsg = String(error);
      console.error('[SecurityNotifications] Email notification error:', error);
      await logNotification(event, 'email', false, recipients, errorMsg);
      return { success: false, error: errorMsg };
    }
  } else {
    // Log for development
    console.log('[SecurityNotifications] Email would be sent to:', recipients);
    console.log('[SecurityNotifications] Subject:', `[${event.severity.toUpperCase()}] Security ${event.type}: ${event.title}`);
    await logNotification(event, 'email', true, recipients);
    return { success: true };
  }
}

// ============================================================================
// IN-APP NOTIFICATIONS
// ============================================================================

async function sendInAppNotification(event: SecurityEvent): Promise<{ success: boolean; error?: string }> {
  try {
    const adminClient = getAdminClient();

    // Get all admin users
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (adminClient as any)
      .from('admins')
      .select('user_id');

    const admins = data as { user_id: string }[] | null;

    if (!admins || admins.length === 0) {
      return { success: true };
    }

    // Create notifications for all admins
    const notifications = admins.map((admin) => ({
      user_id: admin.user_id,
      type: `security_${event.type}`,
      title: `Security ${event.type}: ${event.title}`,
      message: event.description,
      action_url: '/admin/dashboard/security',
      read: false,
      metadata: {
        severity: event.severity,
        ...event.metadata,
      },
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminClient as any).from('notifications').insert(notifications);

    if (error) {
      const errorMsg = error.message;
      console.error('[SecurityNotifications] In-app notification error:', error);
      await logNotification(event, 'in_app', false, admins.map(a => a.user_id), errorMsg);
      return { success: false, error: errorMsg };
    }

    await logNotification(event, 'in_app', true, admins.map(a => a.user_id));
    return { success: true };
  } catch (error) {
    const errorMsg = String(error);
    console.error('[SecurityNotifications] In-app notification error:', error);
    await logNotification(event, 'in_app', false, undefined, errorMsg);
    return { success: false, error: errorMsg };
  }
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export async function sendSecurityNotification(event: SecurityEvent): Promise<{
  success: boolean;
  channels: { email: boolean; slack: boolean; inApp: boolean };
  errors?: { email?: string; slack?: string; inApp?: string };
}> {
  const config = getNotificationConfig();
  const eventLevel = SEVERITY_LEVELS[event.severity];
  const minLevel = SEVERITY_LEVELS[config.minSeverity];

  // Add timestamp if not present
  if (!event.timestamp) {
    event.timestamp = new Date().toISOString();
  }

  const results = {
    email: false,
    slack: false,
    inApp: false,
  };

  const errors: { email?: string; slack?: string; inApp?: string } = {};

  // Check if severity meets threshold
  if (eventLevel < minLevel) {
    console.log(`[SecurityNotifications] Event severity ${event.severity} below threshold ${config.minSeverity}`);
    return { success: true, channels: results };
  }

  // Send notifications in parallel
  const promises: Promise<void>[] = [];

  // Slack
  if (config.slackEnabled && config.slackWebhookUrl) {
    promises.push(
      sendSlackNotification(event, config.slackWebhookUrl)
        .then((r) => {
          results.slack = r.success;
          if (r.error) errors.slack = r.error;
        })
        .catch((e) => { errors.slack = String(e); })
    );
  }

  // Email
  if (config.emailEnabled && config.emailRecipients.length > 0) {
    promises.push(
      sendEmailNotification(event, config.emailRecipients)
        .then((r) => {
          results.email = r.success;
          if (r.error) errors.email = r.error;
        })
        .catch((e) => { errors.email = String(e); })
    );
  }

  // In-app (always for critical/high)
  if (config.inAppEnabled && (event.severity === 'critical' || event.severity === 'high')) {
    promises.push(
      sendInAppNotification(event)
        .then((r) => {
          results.inApp = r.success;
          if (r.error) errors.inApp = r.error;
        })
        .catch((e) => { errors.inApp = String(e); })
    );
  }

  await Promise.all(promises);

  const success = results.email || results.slack || results.inApp;

  console.log('[SecurityNotifications] Notification sent:', {
    event: event.title,
    severity: event.severity,
    channels: results,
    errors,
  });

  return { success, channels: results, errors: Object.keys(errors).length > 0 ? errors : undefined };
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

export async function notifyCriticalAlert(title: string, description: string, metadata?: Record<string, any>) {
  return sendSecurityNotification({
    type: 'alert',
    severity: 'critical',
    title,
    description,
    metadata,
  });
}

export async function notifySecurityError(title: string, description: string, severity: 'critical' | 'high' | 'medium' | 'low' = 'high') {
  return sendSecurityNotification({
    type: 'error',
    severity,
    title,
    description,
  });
}

export async function notifyVulnerability(title: string, description: string, severity: 'critical' | 'high' | 'medium' | 'low') {
  return sendSecurityNotification({
    type: 'vulnerability',
    severity,
    title,
    description,
  });
}
