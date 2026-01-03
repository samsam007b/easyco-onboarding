/**
 * ADMIN INVITATION ACCEPTANCE API
 *
 * POST: Accept an admin invitation and create the user account
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/auth/supabase-admin';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';

export const dynamic = 'force-dynamic';

interface AcceptInviteRequest {
  token: string;
  password: string;
  fullName?: string;
}

interface AdminInvitation {
  id: string;
  email: string;
  role: string;
  status: string;
  token: string;
  expires_at: string;
  invited_by: string;
}

/**
 * POST /api/admin/invite/accept
 * Accept invitation and create admin account
 */
export async function POST(request: NextRequest) {
  const lang = getApiLanguage(request);

  try {
    const body: AcceptInviteRequest = await request.json();
    const { token, password, fullName } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: apiT('admin.tokenAndPasswordRequired', lang) },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: apiT('admin.passwordTooShort', lang) },
        { status: 400 }
      );
    }

    const adminClient = getAdminClient();

    // Get and validate the invitation
    const { data: invitationData, error: inviteError } = await (adminClient
      .from('admin_invitations') as any)
      .select('*')
      .eq('token', token)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .single();

    if (inviteError || !invitationData) {
      return NextResponse.json(
        { error: apiT('admin.inviteInvalidOrExpired', lang) },
        { status: 400 }
      );
    }

    const invitation = invitationData as AdminInvitation;

    // Check if email is already registered
    const { data: existingUsers } = await adminClient.auth.admin.listUsers();
    const existingUser = (existingUsers?.users as Array<{ email?: string }> | undefined)?.find(
      u => u.email?.toLowerCase() === invitation.email.toLowerCase()
    );

    if (existingUser) {
      return NextResponse.json(
        { error: apiT('admin.accountExistsContactAdmin', lang) },
        { status: 400 }
      );
    }

    // Create the user account with admin auth
    const { data: authData, error: signUpError } = await adminClient.auth.admin.createUser({
      email: invitation.email,
      password,
      email_confirm: true, // Auto-confirm since they received the invite email
      user_metadata: {
        full_name: fullName || invitation.email.split('@')[0],
        is_admin: true,
        admin_role: invitation.role,
      },
    });

    if (signUpError || !authData.user) {
      console.error('[AdminInviteAccept] Signup error:', signUpError);
      return NextResponse.json(
        { error: signUpError?.message || apiT('admin.accountCreateError', lang) },
        { status: 500 }
      );
    }

    // Create admin record
    const { data: adminRecord, error: adminError } = await (adminClient
      .from('admins') as any)
      .insert({
        user_id: authData.user.id,
        email: invitation.email.toLowerCase(),
        role: invitation.role,
        created_by: invitation.invited_by,
      })
      .select()
      .single();

    if (adminError) {
      console.error('[AdminInviteAccept] Admin record error:', adminError);
      // Rollback: delete the user if admin record creation failed
      await adminClient.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: apiT('admin.adminProfileCreateError', lang) },
        { status: 500 }
      );
    }

    // Create user record in users table
    await (adminClient.from('users') as any).insert({
      id: authData.user.id,
      email: invitation.email.toLowerCase(),
      full_name: fullName || invitation.email.split('@')[0],
    }).onConflict('id').ignore();

    // Update invitation status
    await (adminClient.from('admin_invitations') as any)
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
        accepted_by_user_id: authData.user.id,
      })
      .eq('id', invitation.id);

    // Log the action
    await (adminClient.from('audit_logs') as any).insert({
      user_id: authData.user.id,
      action: 'admin_invitation_accepted',
      resource_type: 'admin',
      resource_id: adminRecord.id,
      metadata: {
        email: invitation.email,
        role: invitation.role,
        invitation_id: invitation.id,
        invited_by: invitation.invited_by,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Compte cree avec succes',
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
      admin: {
        id: adminRecord.id,
        role: adminRecord.role,
      },
    });

  } catch (error) {
    console.error('[AdminInviteAccept] Error:', error);
    return NextResponse.json(
      { error: apiT('admin.internalError', lang) },
      { status: 500 }
    );
  }
}
