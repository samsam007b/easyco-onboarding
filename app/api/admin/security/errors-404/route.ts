/**
 * 404 ERRORS API
 *
 * Fetches and aggregates 404 errors for the security dashboard.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { getAdminClient } from '@/lib/auth/supabase-admin';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';
import { validateAdminRequest } from '@/lib/security/admin-auth';

export const dynamic = 'force-dynamic';

interface SecurityError {
  id: string;
  route: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

interface GroupedError {
  id: string;
  route: string;
  count: number;
  last_seen: string;
  referrers: string[];
}

export async function GET(request: NextRequest) {
  const lang = getApiLanguage(request);

  try {
    // Verify authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: apiT('common.unauthorized', lang) },
        { status: 401 }
      );
    }

    // Check if user is admin using admin client (bypasses RLS)
    const adminClient = getAdminClient();
    const { data: admin } = await adminClient
      .from('admins')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!admin) {
      return NextResponse.json(
        { error: apiT('admin.accessRequired', lang) },
        { status: 403 }
      );
    }

    // Fetch 404 errors (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await adminClient
      .from('security_errors')
      .select('id, route, created_at, metadata')
      .eq('status_code', 404)
      .gte('created_at', sevenDaysAgo)
      .order('created_at', { ascending: false });

    const rawErrors = data as SecurityError[] | null;

    if (error) {
      console.error('[Errors404] Error fetching errors:', error);
      return NextResponse.json(
        { error: apiT('security.fetchErrorsError', lang) },
        { status: 500 }
      );
    }

    // Group errors by route
    const groupedMap = new Map<string, GroupedError>();

    for (const err of rawErrors || []) {
      const route = err.route || 'unknown';
      const existing = groupedMap.get(route);
      const metadata = err.metadata as { referrer?: string } | null;
      const referrer = metadata?.referrer || 'direct';

      if (existing) {
        existing.count++;
        if (new Date(err.created_at) > new Date(existing.last_seen)) {
          existing.last_seen = err.created_at;
        }
        if (!existing.referrers.includes(referrer)) {
          existing.referrers.push(referrer);
        }
      } else {
        groupedMap.set(route, {
          id: err.id,
          route,
          count: 1,
          last_seen: err.created_at,
          referrers: [referrer],
        });
      }
    }

    // Sort by count descending
    const errors = Array.from(groupedMap.values()).sort((a, b) => b.count - a.count);

    return NextResponse.json({
      errors,
      totalErrors: rawErrors?.length || 0,
      uniqueRoutes: errors.length,
    });
  } catch (error) {
    console.error('[Errors404] Error:', error);
    return NextResponse.json(
      { error: apiT('security.internalError', lang) },
      { status: 500 }
    );
  }
}
