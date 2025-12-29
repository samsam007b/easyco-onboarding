'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/supabase-client'
import LoadingHouse from '@/components/ui/LoadingHouse'

/**
 * Complete Signup Page
 * Handles post-OAuth user type assignment from localStorage
 */
export default function CompleteSignupPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'processing' | 'error'>('processing')
  const supabase = createClient()

  useEffect(() => {
    const completeSignup = async () => {
      try {
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
          // FIXME: Use logger.error('No authenticated user found')
          router.push('/login')
          return
        }

        // Check for pending user type in localStorage
        const pendingUserType = localStorage.getItem('izzico_pending_user_type')

        if (pendingUserType && (pendingUserType === 'searcher' || pendingUserType === 'owner' || pendingUserType === 'resident')) {
          // Update user record with selected type
          const { error: updateError } = await supabase
            .from('users')
            .update({ user_type: pendingUserType })
            .eq('id', user.id)

          if (updateError) {
            // FIXME: Use logger.error('Error updating user type:', updateError)
          }

          // Clear localStorage
          localStorage.removeItem('izzico_pending_user_type')

          // Redirect to onboarding (searcher starts with profile-type to ask if searching for self or dependent)
          if (pendingUserType === 'searcher') {
            router.push('/onboarding/searcher/profile-type')
          } else {
            router.push(`/onboarding/${pendingUserType}/basic-info`)
          }
        } else {
          // No pending user type in localStorage
          // Check user's current status
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('user_type, onboarding_completed')
            .eq('id', user.id)
            .single()

          if (userError || !userData) {
            // FIXME: Use logger.error('Error fetching user data:', userError)
            setStatus('error')
            return
          }

          // If onboarding completed, redirect to dashboard
          if (userData.onboarding_completed) {
            switch (userData.user_type) {
              case 'searcher':
                router.push('/dashboard/searcher')
                break
              case 'owner':
                router.push('/dashboard/owner')
                break
              case 'resident':
                router.push('/dashboard/resident')
                break
              default:
                router.push('/dashboard')
            }
          } else {
            // If user_type is default 'searcher' and onboarding not started,
            // ask them to select their type
            router.push('/welcome')
          }
        }
      } catch (error) {
        // FIXME: Use logger.error('Error completing signup:', error)
        setStatus('error')
      }
    }

    completeSignup()
  }, [supabase, router])

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-6">We couldn't complete your signup. Please try again.</p>
          <a
            href="/signup"
            className="inline-block px-6 py-3 bg-[#FFD600] hover:bg-[#F57F17] text-black font-semibold rounded-full transition-colors"
          >
            Back to Signup
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingHouse size={80} />
        <p className="text-gray-600">Completing your signup...</p>
      </div>
    </div>
  )
}
