/**
 * Email Service
 * Handles sending emails for various application needs
 *
 * Current implementation: Development mode with console logging
 *
 * To enable real email sending:
 * 1. Install Resend: npm install resend
 * 2. Add RESEND_API_KEY to your .env.local
 * 3. Set EMAIL_PROVIDER=resend in .env.local
 * 4. Configure EMAIL_FROM and EMAIL_FROM_NAME
 */

// Types
export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface PaymentReminderData {
  tenantName: string;
  tenantEmail: string;
  propertyTitle: string;
  amount: number;
  dueDate: Date;
  ownerName: string;
  paymentId: string;
}

// Check if email is properly configured
const isEmailConfigured = (): boolean => {
  return process.env.EMAIL_PROVIDER === 'resend' && !!process.env.RESEND_API_KEY;
};

// Send email via configured provider
async function sendViaProvider(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const provider = process.env.EMAIL_PROVIDER;

  if (provider === 'resend') {
    try {
      const fromEmail = process.env.EMAIL_FROM || 'noreply@easyco.app';
      const fromName = process.env.EMAIL_FROM_NAME || 'EasyCo';
      const apiKey = process.env.RESEND_API_KEY;

      // Use fetch to call Resend API directly (no need to install resend package)
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${fromName} <${fromEmail}>`,
          to: Array.isArray(options.to) ? options.to : [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text,
          reply_to: options.replyTo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[EmailService] Resend error:', data);
        return { success: false, error: data.message || 'Failed to send email' };
      }

      return { success: true, messageId: data.id };
    } catch (error) {
      console.error('[EmailService] Failed to send via Resend:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // No provider configured
  return { success: false, error: 'No email provider configured' };
}

// Fallback: Log email (development mode)
function logEmail(options: EmailOptions): { success: boolean; messageId: string } {
  console.log('='.repeat(60));
  console.log('[EmailService] EMAIL SENT (Development Mode)');
  console.log('='.repeat(60));
  console.log('To:', options.to);
  console.log('Subject:', options.subject);
  console.log('ReplyTo:', options.replyTo);
  console.log('-'.repeat(60));
  console.log('HTML Preview (first 500 chars):');
  console.log(options.html.substring(0, 500) + '...');
  console.log('='.repeat(60));

  return { success: true, messageId: `dev-${Date.now()}` };
}

// Main send function
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (isEmailConfigured()) {
    return sendViaProvider(options);
  }

  // Development fallback - log email and return success
  console.warn('[EmailService] Email provider not configured. Logging email instead.');
  return logEmail(options);
}

// Payment reminder email template
export function generatePaymentReminderHTML(data: PaymentReminderData): string {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td>
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #9c5698, #c2566b); border-radius: 16px 16px 0 0; padding: 30px;">
          <tr>
            <td align="center">
              <h1 style="color: white; margin: 0; font-size: 28px;">EasyCo</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Rappel de paiement</p>
            </td>
          </tr>
        </table>

        <!-- Body -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: white; padding: 30px; border-radius: 0 0 16px 16px;">
          <tr>
            <td>
              <p style="color: #1f2937; font-size: 16px; margin: 0 0 20px 0;">
                Bonjour <strong>${escapeHtml(data.tenantName)}</strong>,
              </p>

              <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                Nous vous rappelons que le paiement du loyer pour le bien
                <strong style="color: #9c5698;">${escapeHtml(data.propertyTitle)}</strong>
                est attendu.
              </p>

              <!-- Payment Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(156,86,152,0.1), rgba(194,86,107,0.1)); border-radius: 12px; padding: 20px; margin: 20px 0;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 13px;">Montant du</span><br>
                          <strong style="color: #1f2937; font-size: 24px;">${formatCurrency(data.amount)}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid rgba(156,86,152,0.2);">
                          <span style="color: #6b7280; font-size: 13px;">Date d'echeance</span><br>
                          <strong style="color: #1f2937; font-size: 16px;">${formatDate(data.dueDate)}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid rgba(156,86,152,0.2);">
                          <span style="color: #6b7280; font-size: 13px;">Proprietaire</span><br>
                          <strong style="color: #1f2937; font-size: 16px;">${escapeHtml(data.ownerName)}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 20px 0;">
                Si vous avez deja effectue ce paiement, veuillez ignorer ce message.
                Pour toute question, n'hesitez pas a repondre a cet email.
              </p>

              <p style="color: #4b5563; font-size: 15px; margin: 20px 0 0 0;">
                Cordialement,<br>
                <strong style="color: #9c5698;">L'equipe EasyCo</strong>
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
          <tr>
            <td align="center">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Ce message a ete envoye automatiquement par EasyCo.<br>
                &copy; ${new Date().getFullYear()} EasyCo. Tous droits reserves.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Plain text version
export function generatePaymentReminderText(data: PaymentReminderData): string {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return `
Bonjour ${data.tenantName},

Nous vous rappelons que le paiement du loyer pour le bien "${data.propertyTitle}" est attendu.

DETAILS DU PAIEMENT
-------------------
Montant: ${formatCurrency(data.amount)}
Date d'echeance: ${formatDate(data.dueDate)}
Proprietaire: ${data.ownerName}

Si vous avez deja effectue ce paiement, veuillez ignorer ce message.
Pour toute question, n'hesitez pas a repondre a cet email.

Cordialement,
L'equipe EasyCo

---
Ce message a ete envoye automatiquement par EasyCo.
  `.trim();
}

// Send payment reminder
export async function sendPaymentReminder(data: PaymentReminderData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const html = generatePaymentReminderHTML(data);
  const text = generatePaymentReminderText(data);

  return sendEmail({
    to: data.tenantEmail,
    subject: `Rappel: Paiement du loyer - ${data.propertyTitle}`,
    html,
    text,
  });
}

// Utility
function escapeHtml(str: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (char) => escapeMap[char] || char);
}

// ============================================
// AUTOMATIC ALERTS EMAIL TEMPLATES
// ============================================

// Lease Expiration Alert Data
export interface LeaseExpirationData {
  ownerName: string;
  ownerEmail: string;
  tenantName: string;
  propertyTitle: string;
  propertyAddress: string;
  leaseEndDate: Date;
  daysUntilExpiration: number;
  monthlyRent: number;
}

// Generate lease expiration alert HTML
export function generateLeaseExpirationHTML(data: LeaseExpirationData): string {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  const urgencyColor = data.daysUntilExpiration <= 30 ? '#dc2626' : data.daysUntilExpiration <= 60 ? '#f59e0b' : '#9c5698';
  const urgencyLabel = data.daysUntilExpiration <= 30 ? 'Urgent' : data.daysUntilExpiration <= 60 ? 'Attention' : 'Information';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td>
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #9c5698, #c2566b); border-radius: 16px 16px 0 0; padding: 30px;">
          <tr>
            <td align="center">
              <h1 style="color: white; margin: 0; font-size: 28px;">EasyCo</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Alerte Expiration Bail</p>
            </td>
          </tr>
        </table>

        <!-- Body -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: white; padding: 30px; border-radius: 0 0 16px 16px;">
          <tr>
            <td>
              <!-- Urgency Badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td>
                    <span style="display: inline-block; background: ${urgencyColor}; color: white; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;">
                      ${urgencyLabel} - ${data.daysUntilExpiration} jours restants
                    </span>
                  </td>
                </tr>
              </table>

              <p style="color: #1f2937; font-size: 16px; margin: 0 0 20px 0;">
                Bonjour <strong>${escapeHtml(data.ownerName)}</strong>,
              </p>

              <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                Le bail de votre propriété arrive bientôt à échéance. Voici les détails :
              </p>

              <!-- Property Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(156,86,152,0.1), rgba(194,86,107,0.1)); border-radius: 12px; padding: 20px; margin: 20px 0;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 13px;">Propriété</span><br>
                          <strong style="color: #1f2937; font-size: 18px;">${escapeHtml(data.propertyTitle)}</strong><br>
                          <span style="color: #6b7280; font-size: 14px;">${escapeHtml(data.propertyAddress)}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid rgba(156,86,152,0.2);">
                          <span style="color: #6b7280; font-size: 13px;">Locataire actuel</span><br>
                          <strong style="color: #1f2937; font-size: 16px;">${escapeHtml(data.tenantName)}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid rgba(156,86,152,0.2);">
                          <span style="color: #6b7280; font-size: 13px;">Fin du bail</span><br>
                          <strong style="color: ${urgencyColor}; font-size: 16px;">${formatDate(data.leaseEndDate)}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid rgba(156,86,152,0.2);">
                          <span style="color: #6b7280; font-size: 13px;">Loyer mensuel</span><br>
                          <strong style="color: #1f2937; font-size: 16px;">${formatCurrency(data.monthlyRent)}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 20px 0;">
                <strong>Actions recommandées :</strong>
              </p>
              <ul style="color: #4b5563; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                <li>Contacter le locataire pour discuter du renouvellement</li>
                <li>Préparer les documents de renouvellement si nécessaire</li>
                <li>Prévoir l'état des lieux si départ confirmé</li>
              </ul>

              <p style="color: #4b5563; font-size: 15px; margin: 20px 0 0 0;">
                Cordialement,<br>
                <strong style="color: #9c5698;">L'équipe EasyCo</strong>
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
          <tr>
            <td align="center">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Ce message a été envoyé automatiquement par EasyCo.<br>
                &copy; ${new Date().getFullYear()} EasyCo. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Send lease expiration alert
export async function sendLeaseExpirationAlert(data: LeaseExpirationData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const html = generateLeaseExpirationHTML(data);

  return sendEmail({
    to: data.ownerEmail,
    subject: `Alerte: Bail expire dans ${data.daysUntilExpiration} jours - ${data.propertyTitle}`,
    html,
  });
}

// ============================================
// MAINTENANCE ALERT EMAIL
// ============================================

export interface MaintenanceAlertData {
  ownerName: string;
  ownerEmail: string;
  propertyTitle: string;
  propertyAddress: string;
  ticketTitle: string;
  ticketDescription: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  reportedBy: string;
  reportedAt: Date;
  daysOpen: number;
}

export function generateMaintenanceAlertHTML(data: MaintenanceAlertData): string {
  const formatDate = (date: Date) =>
    date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  const priorityConfig: Record<string, { color: string; label: string }> = {
    urgent: { color: '#dc2626', label: 'Urgent' },
    high: { color: '#f59e0b', label: 'Haute' },
    medium: { color: '#9c5698', label: 'Moyenne' },
    low: { color: '#6b7280', label: 'Basse' },
  };

  const { color, label } = priorityConfig[data.priority] || priorityConfig.medium;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td>
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #9c5698, #c2566b); border-radius: 16px 16px 0 0; padding: 30px;">
          <tr>
            <td align="center">
              <h1 style="color: white; margin: 0; font-size: 28px;">EasyCo</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Alerte Maintenance</p>
            </td>
          </tr>
        </table>

        <!-- Body -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: white; padding: 30px; border-radius: 0 0 16px 16px;">
          <tr>
            <td>
              <!-- Priority Badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td>
                    <span style="display: inline-block; background: ${color}; color: white; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;">
                      Priorité ${label}
                    </span>
                    ${data.daysOpen > 7 ? `
                    <span style="display: inline-block; background: #fef3c7; color: #92400e; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-left: 8px;">
                      Ouvert depuis ${data.daysOpen} jours
                    </span>
                    ` : ''}
                  </td>
                </tr>
              </table>

              <p style="color: #1f2937; font-size: 16px; margin: 0 0 20px 0;">
                Bonjour <strong>${escapeHtml(data.ownerName)}</strong>,
              </p>

              <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                Une demande de maintenance requiert votre attention :
              </p>

              <!-- Ticket Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(156,86,152,0.1), rgba(194,86,107,0.1)); border-radius: 12px; padding: 20px; margin: 20px 0;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 13px;">Problème</span><br>
                          <strong style="color: #1f2937; font-size: 18px;">${escapeHtml(data.ticketTitle)}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-top: 1px solid rgba(156,86,152,0.2);">
                          <span style="color: #6b7280; font-size: 13px;">Description</span><br>
                          <span style="color: #4b5563; font-size: 14px; line-height: 1.5;">${escapeHtml(data.ticketDescription)}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid rgba(156,86,152,0.2);">
                          <span style="color: #6b7280; font-size: 13px;">Propriété</span><br>
                          <strong style="color: #1f2937; font-size: 16px;">${escapeHtml(data.propertyTitle)}</strong><br>
                          <span style="color: #6b7280; font-size: 14px;">${escapeHtml(data.propertyAddress)}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid rgba(156,86,152,0.2);">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="50%">
                                <span style="color: #6b7280; font-size: 13px;">Catégorie</span><br>
                                <strong style="color: #1f2937; font-size: 14px;">${escapeHtml(data.category)}</strong>
                              </td>
                              <td width="50%">
                                <span style="color: #6b7280; font-size: 13px;">Signalé par</span><br>
                                <strong style="color: #1f2937; font-size: 14px;">${escapeHtml(data.reportedBy)}</strong>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-top: 1px solid rgba(156,86,152,0.2);">
                          <span style="color: #6b7280; font-size: 13px;">Date du signalement</span><br>
                          <strong style="color: #1f2937; font-size: 14px;">${formatDate(data.reportedAt)}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color: #4b5563; font-size: 15px; margin: 20px 0 0 0;">
                Cordialement,<br>
                <strong style="color: #9c5698;">L'équipe EasyCo</strong>
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
          <tr>
            <td align="center">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Ce message a été envoyé automatiquement par EasyCo.<br>
                &copy; ${new Date().getFullYear()} EasyCo. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendMaintenanceAlert(data: MaintenanceAlertData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const html = generateMaintenanceAlertHTML(data);
  const priorityPrefix = data.priority === 'urgent' ? '🚨 URGENT: ' : data.priority === 'high' ? '⚠️ ' : '';

  return sendEmail({
    to: data.ownerEmail,
    subject: `${priorityPrefix}Maintenance: ${data.ticketTitle} - ${data.propertyTitle}`,
    html,
  });
}

// ============================================
// DAILY DIGEST EMAIL
// ============================================

export interface DailyDigestData {
  ownerName: string;
  ownerEmail: string;
  date: Date;
  summary: {
    totalProperties: number;
    occupiedProperties: number;
    vacantProperties: number;
    pendingApplications: number;
    overduePayments: number;
    openMaintenanceTickets: number;
    urgentMaintenanceTickets: number;
  };
  alerts: Array<{
    type: 'payment_overdue' | 'lease_expiring' | 'maintenance_urgent' | 'application_pending';
    title: string;
    description: string;
    propertyTitle: string;
  }>;
  recentPayments: Array<{
    tenantName: string;
    propertyTitle: string;
    amount: number;
    date: Date;
  }>;
}

export function generateDailyDigestHTML(data: DailyDigestData): string {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const formatShortDate = (date: Date) =>
    date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

  const occupancyRate = data.summary.totalProperties > 0
    ? Math.round((data.summary.occupiedProperties / data.summary.totalProperties) * 100)
    : 0;

  const alertIcons: Record<string, string> = {
    payment_overdue: '💰',
    lease_expiring: '📋',
    maintenance_urgent: '🔧',
    application_pending: '👤',
  };

  const alertsHTML = data.alerts.length > 0
    ? data.alerts.map(alert => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="40" valign="top">
                <span style="font-size: 20px;">${alertIcons[alert.type] || '⚠️'}</span>
              </td>
              <td>
                <strong style="color: #1f2937; font-size: 14px;">${escapeHtml(alert.title)}</strong><br>
                <span style="color: #6b7280; font-size: 13px;">${escapeHtml(alert.description)}</span><br>
                <span style="color: #9c5698; font-size: 12px;">${escapeHtml(alert.propertyTitle)}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `).join('')
    : `
      <tr>
        <td style="padding: 20px; text-align: center;">
          <span style="color: #10b981; font-size: 24px;">✓</span><br>
          <span style="color: #6b7280; font-size: 14px;">Aucune alerte aujourd'hui</span>
        </td>
      </tr>
    `;

  const paymentsHTML = data.recentPayments.length > 0
    ? data.recentPayments.slice(0, 5).map(payment => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <strong style="color: #1f2937; font-size: 14px;">${escapeHtml(payment.tenantName)}</strong><br>
                <span style="color: #6b7280; font-size: 12px;">${escapeHtml(payment.propertyTitle)}</span>
              </td>
              <td align="right" valign="top">
                <strong style="color: #10b981; font-size: 14px;">+${formatCurrency(payment.amount)}</strong><br>
                <span style="color: #9ca3af; font-size: 11px;">${formatShortDate(payment.date)}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `).join('')
    : `
      <tr>
        <td style="padding: 20px; text-align: center;">
          <span style="color: #6b7280; font-size: 14px;">Aucun paiement récent</span>
        </td>
      </tr>
    `;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td>
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #9c5698, #c2566b); border-radius: 16px 16px 0 0; padding: 30px;">
          <tr>
            <td align="center">
              <h1 style="color: white; margin: 0; font-size: 28px;">EasyCo</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Résumé Quotidien</p>
              <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0 0; font-size: 12px;">${formatDate(data.date)}</p>
            </td>
          </tr>
        </table>

        <!-- Body -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: white; padding: 30px; border-radius: 0 0 16px 16px;">
          <tr>
            <td>
              <p style="color: #1f2937; font-size: 16px; margin: 0 0 20px 0;">
                Bonjour <strong>${escapeHtml(data.ownerName)}</strong>,
              </p>

              <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                Voici le résumé de votre portfolio immobilier :
              </p>

              <!-- KPIs Grid -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  <td width="33%" style="padding: 10px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(156,86,152,0.1), rgba(194,86,107,0.1)); border-radius: 12px; padding: 15px; text-align: center;">
                      <tr>
                        <td>
                          <strong style="color: #9c5698; font-size: 24px;">${data.summary.totalProperties}</strong><br>
                          <span style="color: #6b7280; font-size: 12px;">Propriétés</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="33%" style="padding: 10px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05)); border-radius: 12px; padding: 15px; text-align: center;">
                      <tr>
                        <td>
                          <strong style="color: #10b981; font-size: 24px;">${occupancyRate}%</strong><br>
                          <span style="color: #6b7280; font-size: 12px;">Occupation</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="33%" style="padding: 10px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: ${data.summary.overduePayments > 0 ? 'linear-gradient(135deg, rgba(220,38,38,0.1), rgba(220,38,38,0.05))' : 'linear-gradient(135deg, rgba(107,114,128,0.1), rgba(107,114,128,0.05))'}; border-radius: 12px; padding: 15px; text-align: center;">
                      <tr>
                        <td>
                          <strong style="color: ${data.summary.overduePayments > 0 ? '#dc2626' : '#10b981'}; font-size: 24px;">${data.summary.overduePayments}</strong><br>
                          <span style="color: #6b7280; font-size: 12px;">Impayés</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td width="33%" style="padding: 10px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: ${data.summary.pendingApplications > 0 ? 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))' : 'linear-gradient(135deg, rgba(107,114,128,0.1), rgba(107,114,128,0.05))'}; border-radius: 12px; padding: 15px; text-align: center;">
                      <tr>
                        <td>
                          <strong style="color: ${data.summary.pendingApplications > 0 ? '#3b82f6' : '#6b7280'}; font-size: 24px;">${data.summary.pendingApplications}</strong><br>
                          <span style="color: #6b7280; font-size: 12px;">Candidatures</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="33%" style="padding: 10px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: ${data.summary.openMaintenanceTickets > 0 ? 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))' : 'linear-gradient(135deg, rgba(107,114,128,0.1), rgba(107,114,128,0.05))'}; border-radius: 12px; padding: 15px; text-align: center;">
                      <tr>
                        <td>
                          <strong style="color: ${data.summary.openMaintenanceTickets > 0 ? '#f59e0b' : '#6b7280'}; font-size: 24px;">${data.summary.openMaintenanceTickets}</strong><br>
                          <span style="color: #6b7280; font-size: 12px;">Tickets ouverts</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="33%" style="padding: 10px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(107,114,128,0.1), rgba(107,114,128,0.05)); border-radius: 12px; padding: 15px; text-align: center;">
                      <tr>
                        <td>
                          <strong style="color: #6b7280; font-size: 24px;">${data.summary.vacantProperties}</strong><br>
                          <span style="color: #6b7280; font-size: 12px;">Vacants</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Alerts Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0 20px 0;">
                <tr>
                  <td>
                    <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #9c5698;">
                      ⚡ Alertes & Actions requises
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: #fafafa; border-radius: 12px;">
                      ${alertsHTML}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Recent Payments Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0 20px 0;">
                <tr>
                  <td>
                    <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #10b981;">
                      💰 Paiements récents
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: #fafafa; border-radius: 12px;">
                      ${paymentsHTML}
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color: #4b5563; font-size: 15px; margin: 30px 0 0 0;">
                Bonne journée !<br>
                <strong style="color: #9c5698;">L'équipe EasyCo</strong>
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
          <tr>
            <td align="center">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Ce résumé est envoyé quotidiennement à 8h.<br>
                &copy; ${new Date().getFullYear()} EasyCo. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendDailyDigest(data: DailyDigestData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const html = generateDailyDigestHTML(data);
  const alertCount = data.alerts.length;
  const alertsPrefix = alertCount > 0 ? `(${alertCount} alerte${alertCount > 1 ? 's' : ''}) ` : '';

  return sendEmail({
    to: data.ownerEmail,
    subject: `${alertsPrefix}Résumé quotidien - ${data.summary.totalProperties} propriétés`,
    html,
  });
}
