import { createClient } from '@/lib/auth/supabase-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * OAuth Callback Handler
 * Handles the redirect from OAuth providers (Google, etc.)
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    // FIXME: Use logger.error('OAuth error:', error, error_description)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error_description || error)}`, requestUrl.origin)
    )
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', requestUrl.origin))
  }

  const supabase = await createClient()

  try {
    // Exchange the code for a session
    const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      // FIXME: Use logger.error('Error exchanging code for session:', exchangeError)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
      )
    }

    if (!session?.user) {
      return NextResponse.redirect(new URL('/login?error=no_session', requestUrl.origin))
    }

    const user = session.user

    // Get or create user record in our custom users table
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, user_type, full_name, avatar_url, email_verified, onboarding_completed')
      .eq('id', user.id)
      .single()

    // If user doesn't exist in our users table, the trigger should have created it
    // But let's check and handle edge cases
    if (userError || !userData) {
      // Wait a bit for the trigger to complete
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Try fetching again
      const { data: retryData, error: retryError } = await supabase
        .from('users')
        .select('id, email, user_type, full_name, avatar_url, email_verified, onboarding_completed')
        .eq('id', user.id)
        .single()

      if (retryError || !retryData) {
        // If still not found, create manually
        const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]

        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email!,
            user_type: 'searcher', // Default, will be updated if needed
            full_name: userName,
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
            email_verified: user.email_confirmed_at != null,
          })
          .select()
          .single()

        if (insertError) {
          // FIXME: Use logger.error('Error creating user record:', insertError)
          return NextResponse.redirect(
            new URL(`/login?error=${encodeURIComponent('Failed to create user record')}`, requestUrl.origin)
          )
        }

        userData = newUser
      } else {
        userData = retryData
      }
    }

    // Update user metadata if available from OAuth provider
    if (userData) {
      const updates: any = {}

      // Update full_name if not set and available from OAuth
      if (!userData.full_name && (user.user_metadata?.full_name || user.user_metadata?.name)) {
        updates.full_name = user.user_metadata.full_name || user.user_metadata.name
      }

      // Update avatar_url if not set and available from OAuth
      if (!userData.avatar_url && (user.user_metadata?.avatar_url || user.user_metadata?.picture)) {
        updates.avatar_url = user.user_metadata.avatar_url || user.user_metadata.picture
      }

      // Update email_verified status
      if (user.email_confirmed_at && !userData.email_verified) {
        updates.email_verified = true
      }

      // Apply updates if any
      if (Object.keys(updates).length > 0) {
        await supabase
          .from('users')
          .update(updates)
          .eq('id', user.id)

        // Refresh userData
        const { data: refreshedData } = await supabase
          .from('users')
          .select('id, email, user_type, full_name, avatar_url, email_verified, onboarding_completed')
          .eq('id', user.id)
          .single()

        if (refreshedData) {
          userData = refreshedData
        }
      }
    }

    // Determine redirect based on user profile status
    let redirectPath = '/welcome'

    if (userData) {
      // Check if user has completed onboarding
      if (userData.onboarding_completed && userData.user_type) {
        // User has finished onboarding → redirect to their dashboard
        redirectPath = `/dashboard/${userData.user_type}`
      } else {
        // User hasn't completed onboarding → redirect to welcome page to select role
        redirectPath = '/welcome'
      }
    }

    // Check if there was a redirect parameter (user was trying to access a protected route)
    const intendedDestination = requestUrl.searchParams.get('redirect')
    if (intendedDestination) {
      // Whitelist of allowed redirect destinations to prevent open redirect vulnerability
      const allowedRoutes = [
        '/dashboard',
        '/dashboard/searcher',
        '/dashboard/owner',
        '/dashboard/resident',
        '/dashboard/my-profile',
        '/dashboard/my-profile-owner',
        '/dashboard/my-profile-resident',
        '/dashboard/profiles',
        '/profile',
        '/properties',
        '/messages',
        '/notifications',
        '/favorites',
        '/groups',
        '/settings',
        '/onboarding',
      ]

      // Check if redirect matches an allowed route or is a sub-path of one
      const isAllowed = allowedRoutes.some(route =>
        intendedDestination === route ||
        intendedDestination.startsWith(route + '/')
      )

      // Only use redirect if it's in the whitelist and doesn't contain protocol
      if (isAllowed && !intendedDestination.includes('://') && !intendedDestination.startsWith('//')) {
        redirectPath = intendedDestination
      }
    }

    return NextResponse.redirect(new URL(redirectPath, requestUrl.origin))
  } catch (error: any) {
    // FIXME: Use logger.error('Unexpected error in OAuth callback:', error)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent('An unexpected error occurred')}`, requestUrl.origin)
    )
  }
}
