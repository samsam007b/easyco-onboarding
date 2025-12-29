/**
 * Property Invitation Types
 * Used for the invitation flow where users invite others to join their property
 */

export type InvitationStatus = 'pending' | 'accepted' | 'refused' | 'expired' | 'cancelled';
export type InvitedRole = 'owner' | 'resident';

/**
 * Information about the person who sent the invitation
 */
export interface InviterInfo {
  id: string;
  name: string;
  avatar_url: string | null;
}

/**
 * Property information included in invitation
 */
export interface InvitationPropertyInfo {
  id: string;
  title: string;
  address: string;
  city: string;
  image: string | null;
}

/**
 * Full property invitation record
 */
export interface PropertyInvitation {
  id: string;
  token: string;
  inviter_id: string;
  property_id: string;
  invited_role: InvitedRole;
  invitee_email: string | null;
  invitee_id: string | null;
  status: InvitationStatus;
  created_at: string;
  expires_at: string;
  responded_at: string | null;
  clicked_count: number;
  last_clicked_at: string | null;
}

/**
 * Response from validate_invitation_token function
 */
export interface ValidateInvitationResponse {
  valid: boolean;
  invitation_id?: string;
  invited_role?: InvitedRole;
  expires_at?: string;
  inviter?: InviterInfo;
  property?: InvitationPropertyInfo;
  error?: string;
  message?: string;
}

/**
 * Request body for creating an invitation
 */
export interface CreateInvitationRequest {
  property_id: string;
  invited_role: InvitedRole;
  invitee_email?: string;
}

/**
 * Response from create_property_invitation function
 */
export interface CreateInvitationResponse {
  success: boolean;
  invitation_id?: string;
  token?: string;
  inviter_name?: string;
  property_title?: string;
  property_address?: string;
  property_city?: string;
  invited_role?: InvitedRole;
  error?: string;
  message?: string;
}

/**
 * Request body for accepting an invitation
 */
export interface AcceptInvitationRequest {
  invitation_id: string;
}

/**
 * Response from accept_property_invitation function
 */
export interface AcceptInvitationResponse {
  success: boolean;
  property_id?: string;
  property_title?: string;
  role?: InvitedRole;
  already_member?: boolean;
  error?: string;
  message?: string;
}

/**
 * Request body for refusing an invitation
 */
export interface RefuseInvitationRequest {
  invitation_id: string;
}

/**
 * Response from refuse_property_invitation function
 */
export interface RefuseInvitationResponse {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Received invitation with full details (from get_my_received_invitations)
 */
export interface ReceivedInvitation {
  id: string;
  status: InvitationStatus;
  invited_role: InvitedRole;
  created_at: string;
  responded_at: string | null;
  expires_at: string;
  inviter: InviterInfo;
  property: InvitationPropertyInfo;
}

/**
 * Context stored in sessionStorage when user clicks invitation link
 * Used to pre-fill role and show invitation alert during onboarding
 */
export interface PendingInvitationContext {
  token: string;
  invitationId: string;
  invitedRole: InvitedRole;
  inviter: InviterInfo;
  property: InvitationPropertyInfo;
  expiresAt: string;
  validatedAt: string;
}

/**
 * Session storage key for pending invitation
 */
export const PENDING_INVITATION_KEY = 'pendingInvitationData';

/**
 * Helper to get pending invitation from sessionStorage
 */
export function getPendingInvitation(): PendingInvitationContext | null {
  if (typeof window === 'undefined') return null;
  const data = sessionStorage.getItem(PENDING_INVITATION_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as PendingInvitationContext;
  } catch {
    return null;
  }
}

/**
 * Helper to set pending invitation in sessionStorage
 */
export function setPendingInvitation(context: PendingInvitationContext): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(PENDING_INVITATION_KEY, JSON.stringify(context));
}

/**
 * Helper to clear pending invitation from sessionStorage
 */
export function clearPendingInvitation(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(PENDING_INVITATION_KEY);
}
