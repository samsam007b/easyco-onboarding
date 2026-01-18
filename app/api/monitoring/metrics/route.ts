/**
 * API Endpoint - Métriques Supabase
 * Expose les métriques de performance et d'utilisation
 *
 * GET /api/monitoring/metrics
 * Authentification : Admin seulement
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import {
  getSupabaseMetrics,
  checkMigrationThresholds,
  shouldMigrateToPro,
} from '@/lib/monitoring/supabase-metrics';

export async function GET(request: NextRequest) {
  try {
    // 1. Vérifier auth
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Vérifier que l'utilisateur est admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('user_type')
      .eq('user_id', session.user.id)
      .single();

    // TODO: Ajouter un champ is_admin dans user_profiles
    // Pour l'instant, vérifier si user_type = 'owner' (temporaire)
    const isAdmin = profile?.user_type === 'owner'; // FIXME: utiliser is_admin

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // 3. Récupérer métriques
    const metrics = await getSupabaseMetrics();
    const alerts = await checkMigrationThresholds();
    const migrationCheck = await shouldMigrateToPro();

    // 4. Retourner résultats
    return NextResponse.json(
      {
        success: true,
        metrics,
        alerts,
        migration: migrationCheck,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
