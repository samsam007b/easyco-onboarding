/**
 * SECURITY NOTIFICATIONS API
 *
 * Fetches notification logs for the security dashboard.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { getAdminClient } from '@/lib/auth/supabase-admin';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';
import { validateAdminRequest } from '@/lib/security/admin-auth';

export const dynamic = 'force-dynamic';

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

    // Fetch notification logs (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: notifications, error } = await adminClient
      .from('notification_logs')
      .select('*')
      .gte('created_at', sevenDaysAgo)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('[SecurityNotifications] Error fetching notifications:', error);
      return NextResponse.json(
        { error: apiT('security.fetchNotificationsError', lang) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      notifications: notifications || [],
      count: notifications?.length || 0,
    });
  } catch (error) {
    console.error('[SecurityNotifications] Error:', error);
    return NextResponse.json(
      { error: apiT('security.internalError', lang) },
      { status: 500 }
    );
  }
}
