/**
 * ADMIN AUTHENTICATION & AUTHORIZATION HELPER
 *
 * Centralized admin access validation combining:
 * - Authentication (Supabase)
 * - Authorization (is_admin RPC)
 * - IP Allowlisting (admin-protection.ts)
 * - Audit Logging
 *
 * USAGE in admin API routes:
 *
 * import { validateAdminRequest } from '@/lib/security/admin-auth';
 *
 * export async function GET(request: NextRequest) {
 *   const adminCheck = await validateAdminRequest(request);
 *
 *   if (!adminCheck.allowed) {
 *     return adminCheck.response; // Returns appropriate error
 *   }
 *
 *   // Proceed with admin logic...
 *   const { supabase, user } = adminCheck;
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { validateAdminAccess, getClientIP } from './admin-protection';

export interface AdminValidationResult {
  allowed: boolean;
  response?: NextResponse;
  supabase?: Awaited<ReturnType<typeof createClient>>;
  user?: any;
  clientIP?: string;
}

/**
 * Complete admin access validation
 * Combines: Auth + Admin check + IP allowlist + Audit
 */
export async function validateAdminRequest(
  request: NextRequest
): Promise<AdminValidationResult> {
  // Step 1: IP Allowlist Check (fastest - fail early)
  const ipCheck = validateAdminAccess(request);

  if (!ipCheck.allowed) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: 'Accès non autorisé',
          reason: 'IP address not in allowlist',
          // Do NOT expose client IP to attacker
        },
        { status: 403 }
      ),
    };
  }

  // Step 2: Authentication Check
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      allowed: false,
      response: NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      ),
    };
  }

  // Step 3: Admin Authorization Check
  const { data: isAdmin, error: adminError } = await supabase
    .rpc('is_admin', { user_email: user.email });

  if (adminError || !isAdmin) {
    // Log unauthorized admin access attempt
    console.warn('[SECURITY] Non-admin user attempted admin route', {
      userId: user.id,
      email: user.email,
      ip: ipCheck.clientIP,
      path: request.nextUrl.pathname,
    });

    return {
      allowed: false,
      response: NextResponse.json(
        { error: 'Accès administrateur requis' },
        { status: 403 }
      ),
    };
  }

  // Step 4: Success - Log admin access (already done in validateAdminAccess)
  // Return supabase client and user for use in route
  return {
    allowed: true,
    supabase,
    user,
    clientIP: ipCheck.clientIP,
  };
}

/**
 * Lightweight version for admin middleware (middleware.ts)
 * Only checks IP, not full auth (middleware handles auth separately)
 */
export function checkAdminIP(request: NextRequest): {
  allowed: boolean;
  clientIP: string;
} {
  const ipCheck = validateAdminAccess(request);
  return {
    allowed: ipCheck.allowed,
    clientIP: ipCheck.clientIP,
  };
}
