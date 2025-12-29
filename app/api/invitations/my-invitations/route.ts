import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import type { ReceivedInvitation } from '@/types/invitation.types';

export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'not_authenticated', message: 'Vous devez être connecté', invitations: [] },
        { status: 401 }
      );
    }

    // Call the database function
    const { data, error } = await supabase.rpc('get_my_received_invitations');

    if (error) {
      console.error('Error getting invitations:', error);
      return NextResponse.json(
        { success: false, error: 'database_error', message: error.message, invitations: [] },
        { status: 500 }
      );
    }

    const invitations = (data || []) as ReceivedInvitation[];

    return NextResponse.json({
      success: true,
      invitations,
      pending_count: invitations.filter(i => i.status === 'pending').length
    });
  } catch (error) {
    console.error('Error in my-invitations API:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: 'Erreur serveur', invitations: [] },
      { status: 500 }
    );
  }
}
