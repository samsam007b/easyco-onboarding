import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import type { AcceptInvitationRequest, AcceptInvitationResponse } from '@/types/invitation.types';

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
    const body: AcceptInvitationRequest = await request.json();

    if (!body.invitation_id) {
      return NextResponse.json(
        { success: false, error: 'missing_fields', message: 'invitation_id est requis' },
        { status: 400 }
      );
    }

    // Call the database function
    const { data, error } = await supabase.rpc('accept_property_invitation', {
      p_invitation_id: body.invitation_id
    });

    if (error) {
      console.error('Error accepting invitation:', error);
      return NextResponse.json(
        { success: false, error: 'database_error', message: error.message },
        { status: 500 }
      );
    }

    const result = data as AcceptInvitationResponse;

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in accept invitation API:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
