/**
 * Invitation Service
 * Client-side service for managing property invitations
 */

// ============================================================================
// i18n TRANSLATIONS
// ============================================================================
type Language = 'fr' | 'en' | 'nl' | 'de';

let currentLang: Language = 'fr';

export function setInvitationServiceLanguage(lang: Language) {
  currentLang = lang;
}

const translations = {
  connectionError: {
    fr: 'Erreur de connexion',
    en: 'Connection error',
    nl: 'Verbindingsfout',
    de: 'Verbindungsfehler',
  },
  roles: {
    owner: {
      fr: 'propriétaire',
      en: 'owner',
      nl: 'eigenaar',
      de: 'Eigentümer',
    },
    roommate: {
      fr: 'colocataire',
      en: 'roommate',
      nl: 'huisgenoot',
      de: 'Mitbewohner',
    },
  },
  share: {
    whatsapp: {
      fr: (role: string, propertyName: string, url: string) =>
        `Rejoins-nous sur Izzico ! Je t'invite à devenir ${role} de "${propertyName}".\n\nClique ici pour accepter l'invitation : ${url}`,
      en: (role: string, propertyName: string, url: string) =>
        `Join us on Izzico! I invite you to become ${role} of "${propertyName}".\n\nClick here to accept the invitation: ${url}`,
      nl: (role: string, propertyName: string, url: string) =>
        `Doe mee op Izzico! Ik nodig je uit om ${role} te worden van "${propertyName}".\n\nKlik hier om de uitnodiging te accepteren: ${url}`,
      de: (role: string, propertyName: string, url: string) =>
        `Komm zu Izzico! Ich lade dich ein, ${role} von "${propertyName}" zu werden.\n\nKlicke hier, um die Einladung anzunehmen: ${url}`,
    },
    email: {
      subject: {
        fr: (inviterName: string, propertyName: string) => `${inviterName} t'invite à rejoindre ${propertyName} sur Izzico`,
        en: (inviterName: string, propertyName: string) => `${inviterName} invites you to join ${propertyName} on Izzico`,
        nl: (inviterName: string, propertyName: string) => `${inviterName} nodigt je uit om ${propertyName} te joinen op Izzico`,
        de: (inviterName: string, propertyName: string) => `${inviterName} lädt dich ein, ${propertyName} auf Izzico beizutreten`,
      },
      body: {
        fr: (inviterName: string, role: string, propertyName: string, url: string) =>
          `Salut !\n\n${inviterName} t'invite à devenir ${role} de "${propertyName}" sur Izzico.\n\nClique sur ce lien pour accepter l'invitation :\n${url}\n\nTu pourras ensuite créer ton compte et rejoindre la colocation.\n\nÀ bientôt !`,
        en: (inviterName: string, role: string, propertyName: string, url: string) =>
          `Hi!\n\n${inviterName} invites you to become ${role} of "${propertyName}" on Izzico.\n\nClick this link to accept the invitation:\n${url}\n\nYou can then create your account and join the coliving.\n\nSee you soon!`,
        nl: (inviterName: string, role: string, propertyName: string, url: string) =>
          `Hallo!\n\n${inviterName} nodigt je uit om ${role} te worden van "${propertyName}" op Izzico.\n\nKlik op deze link om de uitnodiging te accepteren:\n${url}\n\nDaarna kun je je account aanmaken en je aansluiten bij de woongroep.\n\nTot snel!`,
        de: (inviterName: string, role: string, propertyName: string, url: string) =>
          `Hallo!\n\n${inviterName} lädt dich ein, ${role} von "${propertyName}" auf Izzico zu werden.\n\nKlicke auf diesen Link, um die Einladung anzunehmen:\n${url}\n\nDanach kannst du dein Konto erstellen und der Wohngemeinschaft beitreten.\n\nBis bald!`,
      },
    },
  },
};

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
      message: translations.connectionError[currentLang],
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
      message: translations.connectionError[currentLang],
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
      message: translations.connectionError[currentLang],
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
      message: translations.connectionError[currentLang],
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
  const roleText = invitedRole === 'owner'
    ? translations.roles.owner[currentLang]
    : translations.roles.roommate[currentLang];
  return translations.share.whatsapp[currentLang](roleText, propertyName, inviteUrl);
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
  const roleText = invitedRole === 'owner'
    ? translations.roles.owner[currentLang]
    : translations.roles.roommate[currentLang];

  const subject = translations.share.email.subject[currentLang](inviterName, propertyName);
  const body = translations.share.email.body[currentLang](inviterName, roleText, propertyName, inviteUrl);

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
