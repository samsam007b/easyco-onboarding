'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/auth/supabase-client'
import { Button } from '@/components/ui/button'
import { Mail, X, Check } from 'lucide-react'
import { toast } from 'sonner'

export function EmailVerificationBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const supabase = createClient()

  useEffect(() => {
    const checkEmailVerification = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        // Get user data from our users table
        const { data: userData } = await supabase
          .from('users')
          .select('email_verified, email')
          .eq('id', user.id)
          .single()

        if (userData && !userData.email_verified) {
          setIsVisible(true)
          setUserEmail(userData.email)
        }
      } catch (error) {
        console.error('Error checking email verification:', error)
      }
    }

    checkEmailVerification()
  }, [supabase])

  const handleResendEmail = async () => {
    setIsResending(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Please log in to resend verification email')
        return
      }

      // Resend confirmation email
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
      })

      if (error) {
        console.error('Error resending email:', error)
        toast.error('Failed to resend verification email')
        return
      }

      setEmailSent(true)
      toast.success('Verification email sent!', {
        description: 'Please check your inbox',
      })

      // Reset "email sent" state after 30 seconds
      setTimeout(() => {
        setEmailSent(false)
      }, 30000)
    } catch (error) {
      console.error('Error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsResending(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Mail className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-900">
              Please verify your email address
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              We sent a verification link to <span className="font-semibold">{userEmail}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!emailSent ? (
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              size="sm"
              variant="outline"
              className="border-yellow-300 bg-white text-yellow-900 hover:bg-yellow-100 rounded-full"
            >
              {isResending ? 'Sending...' : 'Resend Email'}
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-full">
              <Check className="w-4 h-4" />
              <span>Email sent!</span>
            </div>
          )}

          <button
            onClick={() => setIsVisible(false)}
            className="text-yellow-600 hover:text-yellow-900 p-1"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
