/**
 * ADMIN INVITATION API
 *
 * POST: Create and send an admin invitation email
 * GET: List pending invitations
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { getAdminClient } from '@/lib/auth/supabase-admin';
import { sendAdminInvitationEmail } from '@/lib/emails/admin-invitation';
import { logger } from '@/lib/security/logger';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/invite
 * Create a new admin invitation and send email
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorise' },
        { status: 401 }
      );
    }

    // Check if user is super_admin
    const adminClient = getAdminClient();
    const { data: admin } = await adminClient
      .from('admins')
      .select('id, role')
      .eq('user_id', user.id)
      .single() as { data: { id: string; role: string } | null };

    if (!admin || admin.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Seuls les super admins peuvent inviter' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email et role requis' },
        { status: 400 }
      );
    }

    if (!['admin', 'super_admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Role invalide' },
        { status: 400 }
      );
    }

    // Check if email is already an admin
    const { data: existingAdmin } = await (adminClient
      .from('admins') as any)
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Cet email est deja administrateur' },
        { status: 400 }
      );
    }

    // Check for existing pending invitation
    const { data: existingInvite } = await (adminClient
      .from('admin_invitations') as any)
      .select('id')
      .eq('email', email.toLowerCase())
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .single();

    if (existingInvite) {
      return NextResponse.json(
        { error: 'Une invitation est deja en attente pour cet email' },
        { status: 400 }
      );
    }

    // Generate secure token
    const tokenBytes = new Uint8Array(24);
    crypto.getRandomValues(tokenBytes);
    let token = Buffer.from(tokenBytes).toString('base64');
    token = token.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    // Calculate expiration (7 days)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    // Create invitation
    const { data: invitation, error: insertError } = await (adminClient
      .from('admin_invitations') as any)
      .insert({
        token,
        email: email.toLowerCase(),
        role,
        invited_by: user.id,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (insertError) {
      logger.error('[AdminInvite] Insert error', insertError instanceof Error ? insertError : new Error(String(insertError)));
      return NextResponse.json(
        { error: 'Erreur lors de la creation de l\'invitation' },
        { status: 500 }
      );
    }

    // Generate invite URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://izzico.be';
    const inviteUrl = `${appUrl}/admin/invite/${token}`;

    // Send invitation email
    const emailResult = await sendAdminInvitationEmail({
      inviterEmail: user.email || 'admin@izzico.be',
      inviteeEmail: email.toLowerCase(),
      role,
      inviteUrl,
      expiresAt,
    });

    if (!emailResult.success) {
      logger.warn('[AdminInvite] Email send failed', { error: emailResult.error });
      // Don't fail the request - invitation is created, email can be resent
    }

    // Log the action
    await (adminClient.from('audit_logs') as any).insert({
      user_id: user.id,
      action: 'admin_invitation_created',
      resource_type: 'admin_invitation',
      resource_id: invitation.id,
      metadata: {
        invited_email: email,
        invited_role: role,
        inviter_email: user.email,
        email_sent: emailResult.success,
      },
    });

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expires_at: invitation.expires_at,
      },
      emailSent: emailResult.success,
    });

  } catch (error) {
    logger.error('[AdminInvite] Error', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Erreur interne' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/invite
 * List pending invitations
 */
export async function GET() {
  try {
    // Verify authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorise' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminClient = getAdminClient();
    const { data: admin } = await (adminClient
      .from('admins') as any)
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!admin) {
      return NextResponse.json(
        { error: 'Acces admin requis' },
        { status: 403 }
      );
    }

    // First, expire old invitations
    await (adminClient
      .from('admin_invitations') as any)
      .update({ status: 'expired' })
      .eq('status', 'pending')
      .lt('expires_at', new Date().toISOString());

    // Fetch pending invitations
    const { data: invitations, error } = await (adminClient
      .from('admin_invitations') as any)
      .select(`
        id,
        email,
        role,
        status,
        created_at,
        expires_at,
        invited_by
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('[AdminInvite] Fetch error', error instanceof Error ? error : new Error(String(error)));
      return NextResponse.json(
        { error: 'Erreur lors de la recuperation des invitations' },
        { status: 500 }
      );
    }

    // Get inviter emails
    const inviterIds = [...new Set(invitations?.map((i: any) => i.invited_by) || [])];
    const { data: inviters } = await (adminClient
      .from('users') as any)
      .select('id, email')
      .in('id', inviterIds);

    const inviterMap = new Map(inviters?.map((i: any) => [i.id, i.email]) || []);

    const enrichedInvitations = (invitations || []).map((inv: any) => ({
      ...inv,
      inviter_email: inviterMap.get(inv.invited_by) || 'Inconnu',
    }));

    return NextResponse.json({
      invitations: enrichedInvitations,
      count: enrichedInvitations.length,
    });

  } catch (error) {
    logger.error('[AdminInvite] Error', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Erreur interne' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/invite
 * Cancel an invitation
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('id');

    if (!invitationId) {
      return NextResponse.json(
        { error: 'ID d\'invitation requis' },
        { status: 400 }
      );
    }

    // Verify authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorise' },
        { status: 401 }
      );
    }

    // Check if user is super_admin
    const adminClient = getAdminClient();
    const { data: admin } = await (adminClient
      .from('admins') as any)
      .select('id, role')
      .eq('user_id', user.id)
      .single();

    if (!admin || admin.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Seuls les super admins peuvent annuler les invitations' },
        { status: 403 }
      );
    }

    // Get invitation details for logging
    const { data: invitation } = await (adminClient
      .from('admin_invitations') as any)
      .select('email, role')
      .eq('id', invitationId)
      .eq('status', 'pending')
      .single();

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation non trouvee ou deja traitee' },
        { status: 404 }
      );
    }

    // Cancel invitation
    const { error: updateError } = await (adminClient
      .from('admin_invitations') as any)
      .update({ status: 'cancelled' })
      .eq('id', invitationId);

    if (updateError) {
      logger.error('[AdminInvite] Cancel error', updateError instanceof Error ? updateError : new Error(String(updateError)));
      return NextResponse.json(
        { error: 'Erreur lors de l\'annulation' },
        { status: 500 }
      );
    }

    // Log the action
    await (adminClient.from('audit_logs') as any).insert({
      user_id: user.id,
      action: 'admin_invitation_cancelled',
      resource_type: 'admin_invitation',
      resource_id: invitationId,
      metadata: {
        cancelled_email: invitation.email,
        cancelled_role: invitation.role,
        cancelled_by: user.email,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    logger.error('[AdminInvite] Error', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Erreur interne' },
      { status: 500 }
    );
  }
}
