/**
 * Security Alert Webhook
 *
 * This Edge Function is triggered by PostgreSQL pg_notify
 * when a security alert is created. It sends notifications
 * to admins via email and/or Slack webhook.
 *
 * Setup:
 * 1. Deploy this function: supabase functions deploy security-alert-webhook
 * 2. Set secrets:
 *    - ADMIN_EMAIL: Email to receive alerts
 *    - SLACK_WEBHOOK_URL: (optional) Slack incoming webhook URL
 * 3. Configure pg_notify listener or call via HTTP
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id: string;
  description: string;
  user_name?: string;
  user_email?: string;
}

// Severity colors for Slack
const severityColors: Record<string, string> = {
  critical: '#DC2626', // Red
  high: '#F97316', // Orange
  medium: '#EAB308', // Yellow
  low: '#6B7280', // Gray
};

// Severity emojis
const severityEmojis: Record<string, string> = {
  critical: '🚨',
  high: '⚠️',
  medium: '📢',
  low: 'ℹ️',
};

async function sendSlackNotification(alert: SecurityAlert, webhookUrl: string) {
  const emoji = severityEmojis[alert.severity] || '📢';
  const color = severityColors[alert.severity] || '#6B7280';

  const payload = {
    attachments: [
      {
        color,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `${emoji} Security Alert: ${alert.type.replace(/_/g, ' ').toUpperCase()}`,
              emoji: true,
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Severity:*\n${alert.severity.toUpperCase()}`,
              },
              {
                type: 'mrkdwn',
                text: `*User:*\n${alert.user_name || 'Unknown'} (${alert.user_email || 'N/A'})`,
              },
            ],
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Description:*\n${alert.description}`,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `Alert ID: ${alert.id} | <${Deno.env.get('APP_URL') || 'https://app.easyco.be'}/admin/security|View in Dashboard>`,
              },
            ],
          },
        ],
      },
    ],
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return response.ok;
}

async function sendEmailNotification(
  alert: SecurityAlert,
  adminEmail: string,
  supabaseClient: ReturnType<typeof createClient>
) {
  // Use Supabase's built-in email (via Edge Function or SMTP)
  // Or integrate with your email provider (SendGrid, Resend, etc.)

  const subject = `[${alert.severity.toUpperCase()}] Security Alert: ${alert.type.replace(/_/g, ' ')}`;

  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: ${severityColors[alert.severity]}; color: white; padding: 16px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 20px;">
          ${severityEmojis[alert.severity]} Security Alert
        </h1>
      </div>
      <div style="padding: 24px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>Type:</strong></td>
            <td style="padding: 8px 0;">${alert.type.replace(/_/g, ' ')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>Severity:</strong></td>
            <td style="padding: 8px 0;">
              <span style="background: ${severityColors[alert.severity]}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">
                ${alert.severity.toUpperCase()}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>User:</strong></td>
            <td style="padding: 8px 0;">${alert.user_name || 'Unknown'} (${alert.user_email || 'N/A'})</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>Description:</strong></td>
            <td style="padding: 8px 0;">${alert.description}</td>
          </tr>
        </table>
        <div style="margin-top: 24px;">
          <a href="${Deno.env.get('APP_URL') || 'https://app.easyco.be'}/admin/security"
             style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            View in Dashboard
          </a>
        </div>
      </div>
    </div>
  `;

  // If using Resend or similar, integrate here
  // For now, we'll log it and you can integrate your email provider
  console.log('Email notification would be sent to:', adminEmail);
  console.log('Subject:', subject);

  // Example with Resend (if configured):
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  if (resendApiKey) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'security@easyco.be',
        to: adminEmail,
        subject,
        html: htmlBody,
      }),
    });

    return response.ok;
  }

  return true; // Logged successfully
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse alert from request body
    const alert: SecurityAlert = await req.json();

    // Only notify for high and critical alerts
    if (alert.severity !== 'high' && alert.severity !== 'critical') {
      return new Response(
        JSON.stringify({ message: 'Alert logged, no notification sent for low/medium severity' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user details
    if (alert.user_id) {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('full_name, email')
        .eq('id', alert.user_id)
        .single();

      if (profile) {
        alert.user_name = profile.full_name;
        alert.user_email = profile.email;
      }
    }

    const results = {
      slack: false,
      email: false,
    };

    // Send Slack notification
    const slackWebhookUrl = Deno.env.get('SLACK_WEBHOOK_URL');
    if (slackWebhookUrl) {
      results.slack = await sendSlackNotification(alert, slackWebhookUrl);
    }

    // Send email notification
    const adminEmail = Deno.env.get('ADMIN_EMAIL');
    if (adminEmail) {
      results.email = await sendEmailNotification(alert, adminEmail, supabaseClient);
    }

    return new Response(
      JSON.stringify({
        success: true,
        notifications: results,
        alert_id: alert.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing security alert:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
