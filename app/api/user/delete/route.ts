import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { checkRateLimit, getClientIdentifier, createRateLimitHeaders, RateLimitConfig } from '@/lib/security/rate-limiter'
import { logger } from '@/lib/security/logger'

/**
 * DELETE /api/user/delete
 * Deletes the current user's account from both auth.users and users table
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get client identifier (IP address)
    const clientId = getClientIdentifier(request)

    // SECURITY: Check rate limit (2 deletes per hour per IP)
    const rateLimitResult = await checkRateLimit(
      `delete:${clientId}`,
      'delete',
      RateLimitConfig.DELETE.limit,
      RateLimitConfig.DELETE.window
    )

    if (!rateLimitResult.success) {
      logger.security('Account deletion rate limit exceeded', {
        ip: clientId,
      })

      return NextResponse.json(
        {
          success: false,
          error: 'Too many deletion requests. Please try again later.',
        },
        {
          status: 429,
          headers: createRateLimitHeaders(rateLimitResult),
        }
      )
    }

    const cookieStore = await cookies()

    // Create client for session verification
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        {
          status: 401,
          headers: createRateLimitHeaders(rateLimitResult),
        }
      )
    }

    // Log account deletion attempt
    logger.security('Account deletion requested', {
      userId: user.id,
      email: user.email,
      ip: clientId,
    })

    // Create admin client (requires service role key)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Delete user from auth.users (this cascades to users table if foreign key is set)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (deleteError) {
      // FIXME: Use logger.error('Error deleting user from auth:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete account' },
        { status: 500 }
      )
    }

    // Also delete from users table manually (in case cascade doesn't work)
    const { error: usersError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', user.id)

    if (usersError) {
      // FIXME: Use logger.warn('Error deleting from users table:', usersError)
      // Don't fail here as auth user is already deleted
    }

    // Delete from user_profiles
    const { error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .delete()
      .eq('user_id', user.id)

    if (profilesError) {
      // FIXME: Use logger.warn('Error deleting from user_profiles table:', profilesError)
    }

    // Log successful deletion
    logger.security('Account deleted successfully', {
      userId: user.id,
      email: user.email,
      ip: clientId,
    })

    // Sign out the user
    await supabase.auth.signOut()

    return NextResponse.json(
      { success: true },
      { headers: createRateLimitHeaders(rateLimitResult) }
    )
  } catch (error) {
    logger.error('Unexpected error deleting account', error as Error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
