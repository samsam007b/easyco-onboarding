import { createClient } from '@/lib/auth/supabase-server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Email Confirmation Handler
 * Handles email verification when user clicks link from email
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next') || '/profile'

  if (!token_hash || !type) {
    return NextResponse.redirect(
      new URL('/login?error=missing_token', requestUrl.origin)
    )
  }

  const supabase = await createClient()

  try {
    // Verify the email confirmation token
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    })

    if (error) {
      console.error('Email verification error:', error)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      )
    }

    if (data.user) {
      // Update email_verified status in our users table
      const { error: updateError } = await supabase
        .from('users')
        .update({ email_verified: true })
        .eq('id', data.user.id)

      if (updateError) {
        console.error('Error updating email_verified status:', updateError)
        // Don't fail the whole flow, just log the error
      }

      // Redirect to success page or next destination
      return NextResponse.redirect(
        new URL(`/auth/verified?next=${encodeURIComponent(next)}`, requestUrl.origin)
      )
    }

    // No user found
    return NextResponse.redirect(
      new URL('/login?error=verification_failed', requestUrl.origin)
    )
  } catch (error: any) {
    console.error('Unexpected error in email confirmation:', error)
    return NextResponse.redirect(
      new URL('/login?error=unexpected_error', requestUrl.origin)
    )
  }
}
