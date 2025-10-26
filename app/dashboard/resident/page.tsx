'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/supabase-client'
import { Button } from '@/components/ui/button'
import { Users, Settings, LogOut, Edit, MapPin, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useLanguage } from '@/lib/i18n/use-language'
import LanguageSwitcher from '@/components/LanguageSwitcher'

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
  const { t, getSection } = useLanguage()
  const dashboard = getSection('dashboard')
  const common = getSection('common')
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
        toast.error(common.failedToLoad)
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
      toast.error(common.errorOccurred)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    toast.success(dashboard.searcher.logoutSuccess)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A148C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{dashboard.searcher.loadingDashboard}</p>
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
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4A148C] to-[#6A1B9A] rounded-full flex items-center justify-center text-white font-bold text-lg">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#4A148C]">{dashboard.resident.title}</h1>
              <p className="text-sm text-gray-600">{profile.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.push('/profile')}>
              <Settings className="w-5 h-5 mr-2" />
              {dashboard.searcher.settings}
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-5 h-5 mr-2" />
              {dashboard.searcher.logout}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#4A148C] mb-2">
            {dashboard.resident.welcome} {profile.full_name}! 👋
          </h2>
          <p className="text-gray-600">{dashboard.resident.welcomeMessage}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-br from-[#4A148C] to-[#6A1B9A] p-8 text-white relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                  <Users className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{dashboard.resident.communityMember}</h2>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-4 h-4" />
                    <span>{profile_data?.current_city || dashboard.searcher.locationNotSet}</span>
                  </div>
                </div>
              </div>
              <Button onClick={() => router.push('/dashboard/my-profile-resident')} variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                <Edit className="w-4 h-4 mr-2" />
                {dashboard.searcher.editProfile}
              </Button>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/90 font-medium">{dashboard.searcher.profileCompletion}</span>
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
                  {dashboard.resident.completionMessage}
                </p>
              )}
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                📋 {dashboard.searcher.aboutMe}
              </h3>
              <div className="space-y-2 text-gray-700">
                {profile_data?.date_of_birth && (
                  <p>• {new Date().getFullYear() - new Date(profile_data.date_of_birth).getFullYear()} {dashboard.searcher.yearsOld}</p>
                )}
                {profile_data?.occupation_status && (
                  <p>• {profile_data.occupation_status}</p>
                )}
                {profile_data?.nationality && (
                  <p>• {dashboard.resident.from} {profile_data.nationality}</p>
                )}
                {profile_data?.languages_spoken && profile_data.languages_spoken.length > 0 && (
                  <p>• {dashboard.searcher.speaks} {profile_data.languages_spoken.join(', ')}</p>
                )}
                {profile_data?.bio && (
                  <p className="text-sm text-gray-600 mt-3 italic">"{profile_data.bio}"</p>
                )}
              </div>
            </div>

            {(profile_data?.cleanliness_preference || profile_data?.introvert_extrovert_scale || profile_data?.smoker !== undefined) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                  ✨ {dashboard.searcher.lifestyle}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile_data?.cleanliness_preference && (
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                      {dashboard.searcher.cleanliness}: {profile_data.cleanliness_preference}/10
                    </span>
                  )}
                  {profile_data?.introvert_extrovert_scale && (
                    <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                      {profile_data.introvert_extrovert_scale <= 2 ? dashboard.searcher.introvert : profile_data.introvert_extrovert_scale >= 4 ? dashboard.searcher.extrovert : dashboard.searcher.ambivert}
                    </span>
                  )}
                  {profile_data?.smoker !== undefined && (
                    <span className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
                      {profile_data.smoker ? dashboard.searcher.smoker : dashboard.searcher.nonSmoker}
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
                  🏠 {dashboard.resident.livingSituation}
                </h3>
                <p className="text-gray-700">
                  {dashboard.resident.movedIn} {new Date(profile_data.move_in_date).toLocaleDateString()}
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
            <h4 className="font-semibold text-gray-900 mb-1">{dashboard.resident.community}</h4>
            <p className="text-sm text-gray-600">{dashboard.resident.meetYourRoommates}</p>
          </button>

          <button className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-[#FFD600]" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{dashboard.resident.messages}</h4>
            <p className="text-sm text-gray-600">{dashboard.resident.chatWithOthers}</p>
          </button>

          <button onClick={() => router.push('/profile')} className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Settings className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{dashboard.searcher.accountSettings}</h4>
            <p className="text-sm text-gray-600">{dashboard.searcher.updatePreferences}</p>
          </button>
        </div>
      </main>
    </div>
  )
}
