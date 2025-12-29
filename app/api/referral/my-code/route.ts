/**
 * GET /api/referral/my-code
 * Get or create the current user's referral code
 */

import { createClient } from '@/lib/auth/supabase-server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://izzico.be';

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

    // Call database function to get or create code
    const { data: code, error } = await supabase.rpc('create_user_referral_code', {
      p_user_id: user.id,
    });

    if (error) {
      console.error('Error creating referral code:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la génération du code' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      code,
      shareUrl: `${APP_URL}/signup?ref=${code}`,
    });
  } catch (error) {
    console.error('Error in /api/referral/my-code:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
