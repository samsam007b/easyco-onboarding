/**
 * GET /api/referral/stats
 * Get referral statistics for the current user
 */

import { createClient } from '@/lib/auth/supabase-server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Call database function
    const { data, error } = await supabase.rpc('get_referral_stats', {
      p_user_id: user.id,
    });

    if (error) {
      console.error('Error getting referral stats:', error);
      return NextResponse.json(
        { error: 'Erreur lors du chargement des statistiques' },
        { status: 500 }
      );
    }

    // The database function returns a JSONB object with all stats
    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error('Error in /api/referral/stats:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
