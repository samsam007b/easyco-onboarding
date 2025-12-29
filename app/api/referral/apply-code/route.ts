/**
 * POST /api/referral/apply-code
 * Apply a referral code to the current user's account
 */

import { createClient } from '@/lib/auth/supabase-server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
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

    // Parse request body
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'invalid_code', message: 'Code requis' },
        { status: 400 }
      );
    }

    // Call database function
    const { data, error } = await supabase.rpc('apply_referral_code', {
      p_referred_user_id: user.id,
      p_referral_code: code.toUpperCase().trim(),
    });

    if (error) {
      console.error('Error applying referral code:', error);
      return NextResponse.json(
        { success: false, error: 'server_error', message: 'Erreur serveur' },
        { status: 500 }
      );
    }

    // The database function returns a JSONB object
    const result = data as {
      success: boolean;
      error?: string;
      message?: string;
      referrer_id?: string;
    };

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/referral/apply-code:', error);
    return NextResponse.json(
      { success: false, error: 'server_error', message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
