/**
 * ADMIN INVITATION VALIDATION API
 *
 * GET: Validate an invitation token and return details
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/auth/supabase-admin';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/invite/validate?token=xxx
 * Validate invitation token
 */
export async function GET(request: NextRequest) {
  const lang = getApiLanguage(request);

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'missing_token', message: apiT('admin.inviteTokenMissing', lang) },
        { status: 400 }
      );
    }

    const adminClient = getAdminClient();

    // Define invitation type
    interface AdminInvitation {
      id: string;
      email: string;
      role: string;
      status: string;
      expires_at: string;
      invited_by: string;
    }

    // Get invitation
    const { data: invitation, error } = await adminClient
      .from('admin_invitations')
      .select(`
        id,
        email,
        role,
        status,
        expires_at,
        invited_by
      `)
      .eq('token', token)
      .single() as { data: AdminInvitation | null; error: unknown };

    if (error || !invitation) {
      return NextResponse.json({
        valid: false,
        error: 'not_found',
        message: apiT('admin.inviteTokenNotFound', lang),
      });
    }

    // Check status
    if (invitation.status === 'accepted') {
      return NextResponse.json({
        valid: false,
        error: 'already_used',
        message: apiT('admin.inviteAlreadyUsed', lang),
      });
    }

    if (invitation.status === 'cancelled') {
      return NextResponse.json({
        valid: false,
        error: 'cancelled',
        message: apiT('admin.inviteCancelled', lang),
      });
    }

    if (invitation.status === 'expired') {
      return NextResponse.json({
        valid: false,
        error: 'expired',
        message: apiT('admin.inviteExpired', lang),
      });
    }

    // Check expiration
    if (new Date(invitation.expires_at) < new Date()) {
      // Update status to expired
      await (adminClient
        .from('admin_invitations') as any)
        .update({ status: 'expired' })
        .eq('id', invitation.id);

      return NextResponse.json({
        valid: false,
        error: 'expired',
        message: apiT('admin.inviteExpired', lang),
      });
    }

    // Get inviter email
    const { data: inviterData } = await (adminClient
      .from('users') as any)
      .select('email')
      .eq('id', invitation.invited_by)
      .single();

    return NextResponse.json({
      valid: true,
      invitation_id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      expires_at: invitation.expires_at,
      inviter_email: inviterData?.email || 'Administrateur',
    });

  } catch (error) {
    console.error('[AdminInviteValidate] Error:', error);
    return NextResponse.json(
      { valid: false, error: 'internal', message: apiT('admin.internalError', lang) },
      { status: 500 }
    );
  }
}
