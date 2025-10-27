'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/supabase-client'
import { Button } from '@/components/ui/button'
import { Heart, Search, MessageCircle, Settings, LogOut, Edit, User, MapPin, DollarSign, ClipboardList, Sparkles, RotateCw, Home, Globe, Hand, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { useLanguage } from '@/lib/i18n/use-language'
import DashboardHeader from '@/components/DashboardHeader'
import { useRole } from '@/lib/role/role-context'
import IconBadge from '@/components/IconBadge'
import GroupManagement from '@/components/GroupManagement'

interface UserProfile {
  id: string
  full_name: string
  email: string
  user_type: string
  onboarding_completed: boolean
  profile_data: any
}

export default function SearcherDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const { t, getSection } = useLanguage()
  const { setActiveRole } = useRole()
  const dashboard = getSection('dashboard')
  const common = getSection('common')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProfile()
    // Set active role when dashboard loads
    setActiveRole('searcher')
  }, [])

  const loadProfile = async () => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        router.push('/login')
        return
      }

      // Get user profile
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

      // Get detailed profile data
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setProfile({
        id: user.id,
        full_name: userData.full_name || user.email?.split('@')[0] || 'User',
        email: userData.email,
        user_type: userData.user_type,
        onboarding_completed: userData.onboarding_completed,
        profile_data: profileData || {}
      })

      // If onboarding not completed, redirect
      if (!userData.onboarding_completed) {
        router.push('/onboarding/searcher/profile-type')
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
    toast.success(dashboard.searcher.logoutSuccess)
  }

  const handleEditProfile = () => {
    router.push('/dashboard/my-profile')
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

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      profile_data?.date_of_birth,
      profile_data?.occupation_status,
      profile_data?.nationality,
      profile_data?.languages_spoken?.length,
      profile_data?.bio || profile_data?.about_me,
      profile_data?.cleanliness_preference,
      profile_data?.introvert_extrovert_scale !== undefined,
      profile_data?.is_smoker !== undefined,
      profile_data?.dietary_preferences?.length,
      profile_data?.hobbies?.length,
      profile_data?.early_bird_night_owl,
      profile_data?.work_schedule,
      profile_data?.coliving_size,
      profile_data?.gender_mix,
      profile_data?.budget_min,
      profile_data?.budget_max,
      profile_data?.move_in_date,
      profile_data?.desired_stay_duration,
      profile_data?.accepted_room_types?.length,
      profile_data?.preferred_cities?.length
    ]

    const filledFields = fields.filter(field => field !== undefined && field !== null && field !== '').length
    return Math.round((filledFields / fields.length) * 100)
  }

  const completionPercentage = calculateProfileCompletion()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      <DashboardHeader
        profile={{
          full_name: profile.full_name,
          email: profile.email,
          profile_data: profile.profile_data
        }}
        avatarColor="#FFD700"
        role="searcher"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#4A148C] mb-2 flex items-center gap-2">
            {dashboard.searcher.welcome} {profile.full_name}! <Hand className="w-6 h-6 sm:w-7 sm:h-7 text-[#FFD700]" />
          </h2>
          <p className="text-gray-600">
            {dashboard.searcher.welcomeMessage}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <button onClick={() => router.push('/properties/browse')} className="bg-white rounded-2xl shadow p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#4A148C]" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{dashboard.searcher.browseProperties}</h4>
            <p className="text-xs sm:text-sm text-gray-600">{dashboard.searcher.findPerfectMatch}</p>
          </button>

          <button onClick={() => router.push('/favorites')} className="bg-white rounded-2xl shadow p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{dashboard.searcher.favorites}</h4>
            <p className="text-xs sm:text-sm text-gray-600">{dashboard.searcher.viewSavedProperties}</p>
          </button>

          <button onClick={() => router.push('/dashboard/searcher/my-applications')} className="bg-white rounded-2xl shadow p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">My Applications</h4>
            <p className="text-xs sm:text-sm text-gray-600">Track your applications</p>
          </button>

          <button onClick={() => router.push('/profile')} className="bg-white rounded-2xl shadow p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{dashboard.searcher.accountSettings}</h4>
            <p className="text-xs sm:text-sm text-gray-600">{dashboard.searcher.updatePreferences}</p>
          </button>
        </div>

        {/* Profile Preview Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6 sm:mb-8">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-[#4A148C] to-[#6A1B9A] p-4 sm:p-8 text-white relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                  <User className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1">Welcome!</h2>
                  <div className="flex items-center gap-2 text-white/90 text-sm sm:text-base">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="line-clamp-1">{profile_data?.current_city || profile_data?.preferred_cities?.[0] || 'Location not set'}</span>
                  </div>
                </div>
              </div>
              <Button onClick={handleEditProfile} variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 w-full sm:w-auto text-sm sm:text-base">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {/* Progress Bar */}
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
                  {dashboard.searcher.completionMessage}
                </p>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-8">
            {/* About Me Section */}
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                <IconBadge icon={ClipboardList} variant="purple" size="sm" />
                {dashboard.searcher.aboutMe}
              </h3>
              <div className="space-y-2 text-gray-700">
                {profile_data?.date_of_birth && (
                  <p>• {new Date().getFullYear() - new Date(profile_data.date_of_birth).getFullYear()} {dashboard.searcher.yearsOld}</p>
                )}
                {profile_data?.occupation_status && (
                  <p>• {profile_data.occupation_status}</p>
                )}
                {(profile_data?.field_of_study || profile_data?.university) && (
                  <p>• {profile_data.field_of_study && profile_data.university ? `${profile_data.field_of_study} at ${profile_data.university}` : profile_data.field_of_study || profile_data.university}</p>
                )}
                {(profile_data?.job_title || profile_data?.employer) && (
                  <p>• {profile_data.job_title && profile_data.employer ? `${profile_data.job_title} at ${profile_data.employer}` : profile_data.job_title || profile_data.employer}</p>
                )}
                {profile_data?.nationality && (
                  <p className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    {profile_data.nationality}
                  </p>
                )}
                {profile_data?.languages_spoken && profile_data.languages_spoken.length > 0 && (
                  <p>• {dashboard.searcher.speaks} {profile_data.languages_spoken.join(', ')}</p>
                )}
                {(profile_data?.bio || profile_data?.about_me) && (
                  <p className="text-sm text-gray-600 mt-3 italic">"{profile_data.bio || profile_data.about_me}"</p>
                )}
              </div>
            </div>

            {/* Lifestyle Section */}
            {(profile_data?.cleanliness_preference || profile_data?.introvert_extrovert_scale !== undefined || profile_data?.is_smoker !== undefined || profile_data?.dietary_preferences || profile_data?.hobbies) && (
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                  <IconBadge icon={Sparkles} variant="pink" size="sm" />
                  {dashboard.searcher.lifestyle}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile_data?.cleanliness_preference && (
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                      {dashboard.searcher.cleanliness}: {profile_data.cleanliness_preference}/10
                    </span>
                  )}
                  {profile_data?.introvert_extrovert_scale !== undefined && (
                    <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                      {profile_data.introvert_extrovert_scale <= 3 ? dashboard.searcher.introvert : profile_data.introvert_extrovert_scale >= 7 ? dashboard.searcher.extrovert : dashboard.searcher.ambivert}
                    </span>
                  )}
                  {profile_data?.is_smoker !== undefined && (
                    <span className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
                      {profile_data.is_smoker ? dashboard.searcher.smoker : dashboard.searcher.nonSmoker}
                    </span>
                  )}
                  {profile_data?.dietary_preferences && profile_data.dietary_preferences.length > 0 && (
                    profile_data.dietary_preferences.map((diet: string) => (
                      <span key={diet} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                        {diet}
                      </span>
                    ))
                  )}
                  {profile_data?.exercise_frequency && (
                    <span className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-medium border border-orange-200">
                      {dashboard.searcher.exercise}: {profile_data.exercise_frequency}
                    </span>
                  )}
                  {profile_data?.alcohol_consumption && (
                    <span className="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium border border-yellow-200">
                      {dashboard.searcher.alcohol}: {profile_data.alcohol_consumption}
                    </span>
                  )}
                </div>
                {profile_data?.hobbies && profile_data.hobbies.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">{dashboard.searcher.hobbies}</p>
                    <div className="flex flex-wrap gap-2">
                      {profile_data.hobbies.map((hobby: string) => (
                        <span key={hobby} className="px-2 py-1 bg-pink-50 text-pink-700 rounded-md text-xs font-medium border border-pink-200">
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Daily Routine Section */}
            {(profile_data?.early_bird_night_owl || profile_data?.work_schedule) && (
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                  <IconBadge icon={RotateCw} variant="blue" size="sm" />
                  {dashboard.searcher.dailyRoutine}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {profile_data?.early_bird_night_owl && (
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <p className="text-xs text-gray-600 mb-1">{dashboard.searcher.sleepSchedule}</p>
                      <p className="font-semibold text-gray-900 capitalize">{profile_data.early_bird_night_owl.replace('_', ' ')}</p>
                    </div>
                  )}
                  {profile_data?.work_schedule && (
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <p className="text-xs text-gray-600 mb-1">{dashboard.searcher.workSchedule}</p>
                      <p className="font-semibold text-gray-900 capitalize">{profile_data.work_schedule}</p>
                    </div>
                  )}
                  {profile_data?.work_from_home !== undefined && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1">{dashboard.searcher.workFromHome}</p>
                      <p className="font-semibold text-gray-900">{profile_data.work_from_home ? dashboard.searcher.yes : dashboard.searcher.no}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Looking For Section */}
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                <IconBadge icon={Home} variant="green" size="sm" />
                {dashboard.searcher.lookingFor}
              </h3>
              <div className="space-y-2 text-gray-700">
                {profile_data?.coliving_size && (
                  <p>• {dashboard.searcher.colivingSize} <span className="font-medium">{profile_data.coliving_size}</span></p>
                )}
                {profile_data?.gender_mix && (
                  <p>• {dashboard.searcher.genderPreference} <span className="font-medium">{profile_data.gender_mix}</span></p>
                )}
                {(profile_data?.min_age || profile_data?.max_age) && (
                  <p>• {dashboard.searcher.roommatesAged} <span className="font-medium">{profile_data.min_age || '?'}-{profile_data.max_age || '?'}</span></p>
                )}
                {(profile_data?.budget_min || profile_data?.budget_max) && (
                  <p className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {dashboard.searcher.budget} <span className="font-medium">€{profile_data.budget_min || '?'}-€{profile_data.budget_max || '?'}{dashboard.searcher.perMonth}</span>
                  </p>
                )}
                {profile_data?.move_in_date && (
                  <p>• {dashboard.searcher.moveIn} <span className="font-medium">{new Date(profile_data.move_in_date).toLocaleDateString()}</span></p>
                )}
                {profile_data?.desired_stay_duration && (
                  <p>• {dashboard.searcher.stayDuration} <span className="font-medium">{profile_data.desired_stay_duration}</span></p>
                )}
                {profile_data?.accepted_room_types && profile_data.accepted_room_types.length > 0 && (
                  <p>• {dashboard.searcher.roomTypes} <span className="font-medium">{profile_data.accepted_room_types.join(', ')}</span></p>
                )}
                {profile_data?.preferred_cities && profile_data.preferred_cities.length > 0 && (
                  <p>• {dashboard.searcher.cities} <span className="font-medium">{profile_data.preferred_cities.join(', ')}</span></p>
                )}
              </div>
            </div>

            {/* Profile Status */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{dashboard.searcher.profileStatus}</span>
                {profile.onboarding_completed ? (
                  <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                    ✓ {dashboard.searcher.complete}
                  </span>
                ) : (
                  <span className="text-yellow-600 font-medium">{dashboard.searcher.incomplete}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Group Management Section */}
        <div className="mb-6 sm:mb-8">
          <GroupManagement userId={profile.id} />
        </div>

        {/* Matches Section (Coming Soon) */}
        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-8 mt-6 sm:mt-8">
          <h3 className="text-lg sm:text-xl font-bold text-[#4A148C] mb-4">{dashboard.searcher.yourMatches}</h3>
          <div className="text-center py-8 sm:py-12">
            <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
              {dashboard.searcher.noMatchesYet}
            </h4>
            <p className="text-gray-500 mb-6">
              {dashboard.searcher.browseProperties}
            </p>
            <Button>
              <Search className="w-4 h-4 mr-2" />
              {dashboard.searcher.browseProperties}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
