/**
 * EASYCO SECURITY NOTIFICATIONS SERVICE
 *
 * Handles sending notifications for security events via:
 * - Email (via Resend or SMTP)
 * - Slack webhook
 * - In-app notifications
 */

import { createClient } from '@/lib/auth/supabase-server';

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

async function sendSlackNotification(event: SecurityEvent, webhookUrl: string): Promise<boolean> {
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
                url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://easyco.be'}/admin/dashboard/security`,
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
      console.error('[SecurityNotifications] Slack notification failed:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[SecurityNotifications] Slack notification error:', error);
    return false;
  }
}

// ============================================================================
// EMAIL NOTIFICATIONS
// ============================================================================

async function sendEmailNotification(event: SecurityEvent, recipients: string[]): Promise<boolean> {
  // Skip if no recipients
  if (recipients.length === 0) {
    return true;
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
        <title>Security Alert - Easyco</title>
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
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://easyco.be'}/admin/dashboard/security"
                 style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                View Security Dashboard
              </a>
            </div>
          </div>
          <div style="background: #0f172a; padding: 16px; text-align: center;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              This is an automated security notification from Easyco.
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
          from: 'Easyco Security <security@easyco.be>',
          to: recipients,
          subject: `[${event.severity.toUpperCase()}] Security ${event.type}: ${event.title}`,
          html: htmlContent,
        }),
      });

      if (!response.ok) {
        console.error('[SecurityNotifications] Email notification failed:', await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error('[SecurityNotifications] Email notification error:', error);
      return false;
    }
  } else {
    // Log for development
    console.log('[SecurityNotifications] Email would be sent to:', recipients);
    console.log('[SecurityNotifications] Subject:', `[${event.severity.toUpperCase()}] Security ${event.type}: ${event.title}`);
    return true;
  }
}

// ============================================================================
// IN-APP NOTIFICATIONS
// ============================================================================

async function sendInAppNotification(event: SecurityEvent): Promise<boolean> {
  try {
    const supabase = await createClient();

    // Get all admin users
    const { data: admins } = await supabase
      .from('admins')
      .select('user_id');

    if (!admins || admins.length === 0) {
      return true;
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

    const { error } = await supabase.from('notifications').insert(notifications);

    if (error) {
      console.error('[SecurityNotifications] In-app notification error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[SecurityNotifications] In-app notification error:', error);
    return false;
  }
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export async function sendSecurityNotification(event: SecurityEvent): Promise<{
  success: boolean;
  channels: { email: boolean; slack: boolean; inApp: boolean };
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
      sendSlackNotification(event, config.slackWebhookUrl).then((r) => {
        results.slack = r;
      })
    );
  }

  // Email
  if (config.emailEnabled && config.emailRecipients.length > 0) {
    promises.push(
      sendEmailNotification(event, config.emailRecipients).then((r) => {
        results.email = r;
      })
    );
  }

  // In-app (always for critical/high)
  if (config.inAppEnabled && (event.severity === 'critical' || event.severity === 'high')) {
    promises.push(
      sendInAppNotification(event).then((r) => {
        results.inApp = r;
      })
    );
  }

  await Promise.all(promises);

  const success = results.email || results.slack || results.inApp;

  console.log('[SecurityNotifications] Notification sent:', {
    event: event.title,
    severity: event.severity,
    channels: results,
  });

  return { success, channels: results };
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
