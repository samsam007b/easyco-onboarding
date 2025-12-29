/**
 * GET /api/referral/validate/[code]
 * Validate a referral code before signup
 * Public endpoint - no auth required
 */

import { createClient } from '@/lib/auth/supabase-server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ code: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { code } = await params;

    if (!code || code.length < 4) {
      return NextResponse.json({
        valid: false,
        error: 'Code invalide',
      });
    }

    const supabase = await createClient();
    const normalizedCode = code.toUpperCase().trim();

    // Call database function to validate
    const { data: referrerId, error } = await supabase.rpc('validate_referral_code', {
      p_code: normalizedCode,
    });

    if (error) {
      console.error('Error validating referral code:', error);
      return NextResponse.json({
        valid: false,
        error: 'Erreur de validation',
      });
    }

    if (!referrerId) {
      return NextResponse.json({
        valid: false,
        error: 'Code invalide ou inactif',
      });
    }

    // Get referrer name
    const { data: referrer } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', referrerId)
      .single();

    return NextResponse.json({
      valid: true,
      referrer_id: referrerId,
      referrer_name: referrer?.full_name || 'Utilisateur Izzico',
    });
  } catch (error) {
    console.error('Error in /api/referral/validate:', error);
    return NextResponse.json({
      valid: false,
      error: 'Erreur serveur',
    });
  }
}
