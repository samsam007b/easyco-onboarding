/**
 * Admin Invitation Email Template
 * Generates the HTML email sent to invited admins
 */

interface AdminInvitationEmailParams {
  inviterEmail: string;
  inviteeEmail: string;
  role: 'admin' | 'super_admin';
  inviteUrl: string;
  expiresAt: string;
}

export function generateAdminInvitationEmail(params: AdminInvitationEmailParams): string {
  const { inviterEmail, inviteeEmail, role, inviteUrl, expiresAt } = params;

  const roleName = role === 'super_admin' ? 'Super Administrateur' : 'Administrateur';
  const expiresDate = new Date(expiresAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitation Admin - Izzico</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background-color: #0f172a;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a;">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">

                <!-- Header -->
                <tr>
                  <td style="text-align: center; padding-bottom: 32px;">
                    <img src="https://izzico.be/logo.png" alt="Izzico" width="120" style="display: block; margin: 0 auto;">
                  </td>
                </tr>

                <!-- Main Card -->
                <tr>
                  <td>
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; overflow: hidden; border: 1px solid #334155;">

                      <!-- Purple Header -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 32px; text-align: center;">
                          <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                            Vous etes invite(e) !
                          </h1>
                          <p style="margin: 12px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                            Rejoignez l'equipe d'administration Izzico
                          </p>
                        </td>
                      </tr>

                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px 32px;">
                          <p style="margin: 0 0 20px; color: #e2e8f0; font-size: 16px; line-height: 1.6;">
                            Bonjour,
                          </p>
                          <p style="margin: 0 0 20px; color: #e2e8f0; font-size: 16px; line-height: 1.6;">
                            <strong style="color: #a78bfa;">${inviterEmail}</strong> vous invite a rejoindre l'equipe d'administration d'Izzico en tant que <strong style="color: #a78bfa;">${roleName}</strong>.
                          </p>

                          <!-- Info Box -->
                          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1e293b; border-radius: 12px; margin: 24px 0; border: 1px solid #334155;">
                            <tr>
                              <td style="padding: 20px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td style="padding-bottom: 12px;">
                                      <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</span>
                                      <p style="margin: 4px 0 0; color: #f1f5f9; font-size: 15px;">${inviteeEmail}</p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="padding-bottom: 12px;">
                                      <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Role</span>
                                      <p style="margin: 4px 0 0; color: #a78bfa; font-size: 15px; font-weight: 600;">${roleName}</p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Expire le</span>
                                      <p style="margin: 4px 0 0; color: #f1f5f9; font-size: 15px;">${expiresDate}</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>

                          <!-- CTA Button -->
                          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 32px 0;">
                            <tr>
                              <td style="text-align: center;">
                                <a href="${inviteUrl}"
                                   target="_blank"
                                   style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: #ffffff; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
                                  Accepter l'invitation
                                </a>
                              </td>
                            </tr>
                          </table>

                          <!-- URL Fallback -->
                          <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
                            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
                          </p>
                          <p style="margin: 8px 0 0; color: #94a3b8; font-size: 12px; word-break: break-all; background: #0f172a; padding: 12px; border-radius: 8px;">
                            ${inviteUrl}
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 32px 20px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #64748b; font-size: 13px;">
                      Cette invitation expire le ${expiresDate}.
                    </p>
                    <p style="margin: 0; color: #475569; font-size: 12px;">
                      Si vous n'avez pas demande cette invitation, vous pouvez ignorer cet email.
                    </p>
                    <p style="margin: 16px 0 0; color: #475569; font-size: 11px;">
                      &copy; ${new Date().getFullYear()} Izzico. Tous droits reserves.
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

/**
 * Send admin invitation email via Resend
 */
export async function sendAdminInvitationEmail(params: AdminInvitationEmailParams): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.log('[AdminInvitation] Email would be sent to:', params.inviteeEmail);
    console.log('[AdminInvitation] Invite URL:', params.inviteUrl);
    return { success: true };
  }

  try {
    const htmlContent = generateAdminInvitationEmail(params);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Izzico Admin <hello@izzico.be>',
        to: [params.inviteeEmail],
        subject: `Invitation a rejoindre l'equipe admin Izzico`,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AdminInvitation] Resend API error:', errorText);
      return { success: false, error: `Resend API error: ${errorText}` };
    }

    const result = await response.json();
    console.log('[AdminInvitation] Email sent successfully:', result.id);
    return { success: true };

  } catch (error) {
    console.error('[AdminInvitation] Email send error:', error);
    return { success: false, error: String(error) };
  }
}
