'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/supabase-client'
import { Button } from '@/components/ui/button'
import { Users, Settings, LogOut, Edit, MapPin, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

interface UserProfile {
  full_name: string
  email: string
  user_type: string
  onboarding_completed: boolean
  profile_data: any
}

export default function ResidentDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        router.push('/login')
        return
      }

      const { data: userData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('Error loading profile:', profileError)
        toast.error('Failed to load profile')
        return
      }

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setProfile({
        full_name: userData.full_name || user.email?.split('@')[0] || 'User',
        email: userData.email,
        user_type: userData.user_type,
        onboarding_completed: userData.onboarding_completed,
        profile_data: profileData || {}
      })

      if (!userData.onboarding_completed) {
        router.push('/onboarding/resident/basic-info')
        return
      }

    } catch (error: any) {
      console.error('Error:', error)
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    toast.success('Logged out successfully')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A148C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const { profile_data } = profile

  const calculateProfileCompletion = () => {
    const fields = [
      profile_data?.first_name,
      profile_data?.last_name,
      profile_data?.date_of_birth,
      profile_data?.nationality,
      profile_data?.phone_number,
      profile_data?.languages_spoken?.length,
      profile_data?.occupation_status,
      profile_data?.wake_up_time,
      profile_data?.sleep_time,
      profile_data?.smoker !== undefined,
      profile_data?.cleanliness_preference,
      profile_data?.introvert_extrovert_scale,
      profile_data?.sociability_level,
      profile_data?.preferred_interaction_type,
      profile_data?.home_activity_level,
      profile_data?.current_city,
      profile_data?.move_in_date,
      profile_data?.bio
    ]

    const filledFields = fields.filter(field => field !== undefined && field !== null && field !== '').length
    return Math.round((filledFields / fields.length) * 100)
  }

  const completionPercentage = calculateProfileCompletion()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4A148C] to-[#6A1B9A] rounded-full flex items-center justify-center text-white font-bold text-lg">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#4A148C]">Resident Dashboard</h1>
              <p className="text-sm text-gray-600">{profile.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.push('/profile')}>
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#4A148C] mb-2">
            Welcome back, {profile.full_name}! 👋
          </h2>
          <p className="text-gray-600">Connect with your coliving community</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-br from-[#4A148C] to-[#6A1B9A] p-8 text-white relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                  <Users className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Community Member</h2>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-4 h-4" />
                    <span>{profile_data?.current_city || 'Location not set'}</span>
                  </div>
                </div>
              </div>
              <Button onClick={() => router.push('/dashboard/my-profile-resident')} variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/90 font-medium">Profile Completion</span>
                <span className="text-sm text-white font-semibold">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-1"
                  style={{ width: `${completionPercentage}%` }}
                >
                  {completionPercentage > 10 && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </div>
              </div>
              {completionPercentage < 100 && (
                <p className="text-xs text-white/70 mt-2">
                  Complete your profile to connect better with your community!
                </p>
              )}
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                📋 About Me
              </h3>
              <div className="space-y-2 text-gray-700">
                {profile_data?.date_of_birth && (
                  <p>• {new Date().getFullYear() - new Date(profile_data.date_of_birth).getFullYear()} years old</p>
                )}
                {profile_data?.occupation_status && (
                  <p>• {profile_data.occupation_status}</p>
                )}
                {profile_data?.nationality && (
                  <p>• From {profile_data.nationality}</p>
                )}
                {profile_data?.languages_spoken && profile_data.languages_spoken.length > 0 && (
                  <p>• Speaks: {profile_data.languages_spoken.join(', ')}</p>
                )}
                {profile_data?.bio && (
                  <p className="text-sm text-gray-600 mt-3 italic">"{profile_data.bio}"</p>
                )}
              </div>
            </div>

            {(profile_data?.cleanliness_preference || profile_data?.introvert_extrovert_scale || profile_data?.smoker !== undefined) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                  ✨ Lifestyle
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile_data?.cleanliness_preference && (
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                      Cleanliness: {profile_data.cleanliness_preference}/10
                    </span>
                  )}
                  {profile_data?.introvert_extrovert_scale && (
                    <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                      {profile_data.introvert_extrovert_scale <= 2 ? 'Introvert' : profile_data.introvert_extrovert_scale >= 4 ? 'Extrovert' : 'Ambivert'}
                    </span>
                  )}
                  {profile_data?.smoker !== undefined && (
                    <span className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
                      {profile_data.smoker ? 'Smoker' : 'Non-smoker'}
                    </span>
                  )}
                  {profile_data?.sociability_level && (
                    <span className="px-3 py-1.5 bg-pink-50 text-pink-700 rounded-full text-sm font-medium border border-pink-200 capitalize">
                      {profile_data.sociability_level} Social Activity
                    </span>
                  )}
                </div>
              </div>
            )}

            {profile_data?.move_in_date && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                  🏠 Living Situation
                </h3>
                <p className="text-gray-700">
                  Moved in: {new Date(profile_data.move_in_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <button className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-[#4A148C]" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Community</h4>
            <p className="text-sm text-gray-600">Meet your roommates</p>
          </button>

          <button className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-[#FFD600]" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Messages</h4>
            <p className="text-sm text-gray-600">Chat with others</p>
          </button>

          <button onClick={() => router.push('/profile')} className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Settings className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Account Settings</h4>
            <p className="text-sm text-gray-600">Update preferences</p>
          </button>
        </div>
      </main>
    </div>
  )
}
