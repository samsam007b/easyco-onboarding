import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import type { CreateInvitationRequest, CreateInvitationResponse } from '@/types/invitation.types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'not_authenticated', message: 'Vous devez être connecté' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: CreateInvitationRequest = await request.json();

    if (!body.property_id || !body.invited_role) {
      return NextResponse.json(
        { success: false, error: 'missing_fields', message: 'property_id et invited_role sont requis' },
        { status: 400 }
      );
    }

    if (!['owner', 'resident'].includes(body.invited_role)) {
      return NextResponse.json(
        { success: false, error: 'invalid_role', message: 'Role invalide' },
        { status: 400 }
      );
    }

    // Call the database function
    const { data, error } = await supabase.rpc('create_property_invitation', {
      p_property_id: body.property_id,
      p_invited_role: body.invited_role,
      p_invitee_email: body.invitee_email || null
    });

    if (error) {
      console.error('Error creating invitation:', error);
      return NextResponse.json(
        { success: false, error: 'database_error', message: error.message },
        { status: 500 }
      );
    }

    const result = data as CreateInvitationResponse;

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    // Add the invite URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://easyco.be';
    const inviteUrl = `${baseUrl}/invite/${result.token}`;

    return NextResponse.json({
      ...result,
      invite_url: inviteUrl
    });
  } catch (error) {
    console.error('Error in create invitation API:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
