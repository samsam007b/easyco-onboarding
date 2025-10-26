'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/supabase-client'
import { Button } from '@/components/ui/button'
import { Search, Home } from 'lucide-react'
import { toast } from 'sonner'

export default function SelectUserTypePage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<'searcher' | 'owner'>('searcher')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const supabase = createClient()

  // Check if user is authenticated and needs to select type
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Check if user already has a type selected
      const { data: userData } = await supabase
        .from('users')
        .select('user_type, onboarding_completed')
        .eq('id', user.id)
        .single()

      // If user already has a non-default type or completed onboarding, redirect
      if (userData && userData.user_type && userData.user_type !== 'searcher') {
        if (userData.onboarding_completed) {
          switch (userData.user_type) {
            case 'owner':
              router.push('/dashboard/owner')
              break
            case 'resident':
              router.push('/dashboard/resident')
              break
            default:
              router.push('/dashboard/searcher')
          }
        } else {
          // Searcher onboarding starts with profile-type
          if (userData.user_type === 'searcher') {
            router.push('/onboarding/searcher/profile-type')
          } else {
            router.push(`/onboarding/${userData.user_type}/basic-info`)
          }
        }
        return
      }

      // If user has completed onboarding as searcher, redirect to dashboard
      if (userData?.onboarding_completed) {
        router.push('/dashboard/searcher')
        return
      }

      setIsCheckingAuth(false)
    }

    checkAuth()
  }, [supabase, router])

  const handleContinue = async () => {
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Please log in to continue')
        router.push('/login')
        return
      }

      // Update user type
      const { error } = await supabase
        .from('users')
        .update({ user_type: selectedType })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating user type:', error)
        toast.error('Failed to update user type')
        return
      }

      toast.success(`Welcome, ${selectedType === 'searcher' ? 'Searcher' : selectedType === 'owner' ? 'Owner' : 'Resident'}!`)

      // Redirect to onboarding (searcher starts with profile-type)
      if (selectedType === 'searcher') {
        router.push('/onboarding/searcher/profile-type')
      } else {
        router.push(`/onboarding/${selectedType}/basic-info`)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#4A148C] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="text-2xl font-bold">
            <span className="text-[#4A148C]">EASY</span>
            <span className="text-[#FFD600]">Co</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#4A148C] mb-2">
                Welcome to EasyCo!
              </h1>
              <p className="text-gray-600">
                Tell us about yourself to get started
              </p>
            </div>

            {/* User Type Selection */}
            <div className="space-y-4 mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a...
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Searcher Button */}
                <button
                  type="button"
                  onClick={() => setSelectedType('searcher')}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    selectedType === 'searcher'
                      ? 'border-[#4A148C] bg-[#4A148C]/5 shadow-md'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      selectedType === 'searcher' ? 'bg-[#4A148C]' : 'bg-gray-200'
                    }`}>
                      <Search className={`w-8 h-8 ${
                        selectedType === 'searcher' ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="text-center">
                      <h3 className={`text-lg font-semibold mb-1 ${
                        selectedType === 'searcher' ? 'text-[#4A148C]' : 'text-gray-900'
                      }`}>
                        Searcher
                      </h3>
                      <p className="text-sm text-gray-600">
                        Looking for a coliving space or roommates
                      </p>
                    </div>
                  </div>
                </button>

                {/* Owner Button */}
                <button
                  type="button"
                  onClick={() => setSelectedType('owner')}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    selectedType === 'owner'
                      ? 'border-[#4A148C] bg-[#4A148C]/5 shadow-md'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      selectedType === 'owner' ? 'bg-[#4A148C]' : 'bg-gray-200'
                    }`}>
                      <Home className={`w-8 h-8 ${
                        selectedType === 'owner' ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="text-center">
                      <h3 className={`text-lg font-semibold mb-1 ${
                        selectedType === 'owner' ? 'text-[#4A148C]' : 'text-gray-900'
                      }`}>
                        Owner
                      </h3>
                      <p className="text-sm text-gray-600">
                        I have a property to list or manage
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Continue Button */}
            <Button
              type="button"
              onClick={handleContinue}
              disabled={isLoading}
              className="w-full bg-[#FFD600] hover:bg-[#F57F17] text-black font-semibold py-6 rounded-full transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Setting up your account...</span>
                </div>
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
