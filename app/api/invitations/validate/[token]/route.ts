import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import type { ValidateInvitationResponse } from '@/types/invitation.types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'missing_token', message: 'Token manquant' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Call the database function (accessible to anon)
    const { data, error } = await supabase.rpc('validate_invitation_token', {
      p_token: token
    });

    if (error) {
      console.error('Error validating invitation token:', error);
      return NextResponse.json(
        { valid: false, error: 'database_error', message: error.message },
        { status: 500 }
      );
    }

    const result = data as ValidateInvitationResponse;

    if (!result.valid) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in validate invitation API:', error);
    return NextResponse.json(
      { valid: false, error: 'server_error', message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
