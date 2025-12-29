/**
 * Invitation Service
 * Client-side service for managing property invitations
 */

import type {
  ValidateInvitationResponse,
  CreateInvitationResponse,
  AcceptInvitationResponse,
  RefuseInvitationResponse,
  ReceivedInvitation,
  InvitedRole,
  PendingInvitationContext,
  PENDING_INVITATION_KEY,
} from '@/types/invitation.types';

const API_BASE = '/api/invitations';

/**
 * Validate an invitation token
 * Can be called without authentication
 */
export async function validateInvitationToken(token: string): Promise<ValidateInvitationResponse> {
  try {
    const response = await fetch(`${API_BASE}/validate/${token}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error validating invitation:', error);
    return {
      valid: false,
      error: 'network_error',
      message: 'Erreur de connexion',
    };
  }
}

/**
 * Create a new invitation
 * Requires authentication
 */
export async function createInvitation(
  propertyId: string,
  invitedRole: InvitedRole,
  inviteeEmail?: string
): Promise<CreateInvitationResponse & { invite_url?: string }> {
  try {
    const response = await fetch(`${API_BASE}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        property_id: propertyId,
        invited_role: invitedRole,
        invitee_email: inviteeEmail,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating invitation:', error);
    return {
      success: false,
      error: 'network_error',
      message: 'Erreur de connexion',
    };
  }
}

/**
 * Accept an invitation
 * Requires authentication
 */
export async function acceptInvitation(invitationId: string): Promise<AcceptInvitationResponse> {
  try {
    const response = await fetch(`${API_BASE}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitation_id: invitationId }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return {
      success: false,
      error: 'network_error',
      message: 'Erreur de connexion',
    };
  }
}

/**
 * Refuse an invitation
 * Requires authentication
 */
export async function refuseInvitation(invitationId: string): Promise<RefuseInvitationResponse> {
  try {
    const response = await fetch(`${API_BASE}/refuse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitation_id: invitationId }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error refusing invitation:', error);
    return {
      success: false,
      error: 'network_error',
      message: 'Erreur de connexion',
    };
  }
}

/**
 * Get all received invitations for current user
 * Requires authentication
 */
export async function getMyInvitations(): Promise<{
  success: boolean;
  invitations: ReceivedInvitation[];
  pending_count: number;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE}/my-invitations`);
    return await response.json();
  } catch (error) {
    console.error('Error getting invitations:', error);
    return {
      success: false,
      invitations: [],
      pending_count: 0,
      error: 'network_error',
    };
  }
}

/**
 * Generate share text for WhatsApp
 */
export function generateWhatsAppText(
  inviteUrl: string,
  propertyName: string,
  invitedRole: InvitedRole
): string {
  const roleText = invitedRole === 'owner' ? 'propriétaire' : 'colocataire';
  return `Rejoins-nous sur Izzico ! Je t'invite à devenir ${roleText} de "${propertyName}".

Clique ici pour accepter l'invitation : ${inviteUrl}`;
}

/**
 * Generate share text for Email
 */
export function generateEmailContent(
  inviteUrl: string,
  propertyName: string,
  inviterName: string,
  invitedRole: InvitedRole
): { subject: string; body: string } {
  const roleText = invitedRole === 'owner' ? 'propriétaire' : 'colocataire';

  const subject = `${inviterName} t'invite à rejoindre ${propertyName} sur Izzico`;

  const body = `Salut !

${inviterName} t'invite à devenir ${roleText} de "${propertyName}" sur Izzico.

Clique sur ce lien pour accepter l'invitation :
${inviteUrl}

Tu pourras ensuite créer ton compte et rejoindre la colocation.

À bientôt !`;

  return { subject, body };
}

/**
 * Open WhatsApp share dialog
 */
export function shareViaWhatsApp(
  inviteUrl: string,
  propertyName: string,
  invitedRole: InvitedRole
): void {
  const text = generateWhatsAppText(inviteUrl, propertyName, invitedRole);
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

/**
 * Open email share dialog
 */
export function shareViaEmail(
  inviteUrl: string,
  propertyName: string,
  inviterName: string,
  invitedRole: InvitedRole
): void {
  const { subject, body } = generateEmailContent(inviteUrl, propertyName, inviterName, invitedRole);
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Copy invite URL to clipboard
 */
export async function copyInviteUrl(inviteUrl: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(inviteUrl);
    return true;
  } catch {
    return false;
  }
}
