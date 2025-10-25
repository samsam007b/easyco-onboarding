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
    console.error('OAuth error:', error, error_description)
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
      console.error('Error exchanging code for session:', exchangeError)
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
      .select('*')
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
        .select('*')
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
          console.error('Error creating user record:', insertError)
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
          .select('*')
          .eq('id', user.id)
          .single()

        if (refreshedData) {
          userData = refreshedData
        }
      }
    }

    // Determine redirect based on onboarding status and user type
    let redirectPath = '/dashboard'

    if (userData) {
      // If onboarding not completed, redirect to complete-signup
      // This allows us to check localStorage for user_type selection
      if (!userData.onboarding_completed) {
        redirectPath = '/auth/complete-signup'
      } else {
        // Redirect to appropriate dashboard
        switch (userData.user_type) {
          case 'searcher':
            redirectPath = '/searcher/dashboard'
            break
          case 'owner':
            redirectPath = '/owner/dashboard'
            break
          case 'resident':
            redirectPath = '/resident/dashboard'
            break
          default:
            redirectPath = '/dashboard'
        }
      }
    }

    // Check if there was a redirect parameter (user was trying to access a protected route)
    const intendedDestination = requestUrl.searchParams.get('redirect')
    if (intendedDestination && intendedDestination.startsWith('/')) {
      redirectPath = intendedDestination
    }

    return NextResponse.redirect(new URL(redirectPath, requestUrl.origin))
  } catch (error: any) {
    console.error('Unexpected error in OAuth callback:', error)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent('An unexpected error occurred')}`, requestUrl.origin)
    )
  }
}
