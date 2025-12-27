/**
 * SUPABASE ADMIN CLIENT
 *
 * Uses service role key for admin operations that don't require user context.
 * Use this for:
 * - Cached data fetching with unstable_cache (no cookie access)
 * - Webhook handlers
 * - Background jobs
 * - Admin dashboards reading aggregated data
 *
 * NEVER expose this client to the frontend or use it for user-specific operations.
 */

import { createClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors
let _adminClient: ReturnType<typeof createClient> | null = null;

export function getAdminClient() {
  if (!_adminClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
    }
    if (!serviceRoleKey) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    }

    _adminClient = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _adminClient;
}
