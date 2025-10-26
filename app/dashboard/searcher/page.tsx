'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/supabase-client'
import { Button } from '@/components/ui/button'
import { Heart, Search, MessageCircle, Settings, LogOut, Edit, User, MapPin, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

interface UserProfile {
  full_name: string
  email: string
  user_type: string
  onboarding_completed: boolean
  profile_data: any
}

export default function SearcherDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProfile()
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
        full_name: userData.full_name || user.email?.split('@')[0] || 'User',
        email: userData.email,
        user_type: userData.user_type,
        onboarding_completed: userData.onboarding_completed,
        profile_data: profileData?.profile_data || {}
      })

      // If onboarding not completed, redirect
      if (!userData.onboarding_completed) {
        router.push('/onboarding/searcher/basic-info')
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

  const handleEditProfile = () => {
    router.push('/dashboard/my-profile')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#4A148C] to-[#6A1B9A] rounded-full flex items-center justify-center text-white font-bold text-lg">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#4A148C]">Searcher Dashboard</h1>
              <p className="text-sm text-gray-600">{profile.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push('/profile/enhance')}>
              ✨ Enhance Profile
            </Button>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#4A148C] mb-2">
            Welcome back, {profile.full_name}! 👋
          </h2>
          <p className="text-gray-600">
            Ready to find your perfect coliving space?
          </p>
        </div>

        {/* Profile Preview Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-[#4A148C] to-[#6A1B9A] p-8 text-white relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                  <User className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Welcome!</h2>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-4 h-4" />
                    <span>{profile_data?.location || 'Location not set'}</span>
                  </div>
                </div>
              </div>
              <Button onClick={handleEditProfile} variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>

          <div className="p-8">
            {/* About Me Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                📋 About Me
              </h3>
              <div className="space-y-2 text-gray-700">
                {profile_data?.dateOfBirth && (
                  <p>• {new Date().getFullYear() - new Date(profile_data.dateOfBirth).getFullYear()} years old</p>
                )}
                {profile_data?.occupation && (
                  <p>• {profile_data.occupation}</p>
                )}
                {profile_data?.nationality && (
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">🌍</span>
                    {profile_data.nationality}
                  </p>
                )}
                {profile_data?.about && (
                  <p className="text-sm text-gray-600 mt-3 italic">"{profile_data.about}"</p>
                )}
              </div>
            </div>

            {/* Lifestyle Section */}
            {(profile_data?.cleanliness || profile_data?.socialPreference || profile_data?.smoking || profile_data?.cooking) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                  ✨ Lifestyle
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile_data?.cleanliness && (
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                      Cleanliness: {profile_data.cleanliness}/10
                    </span>
                  )}
                  {profile_data?.socialPreference && (
                    <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
                      {profile_data.socialPreference}
                    </span>
                  )}
                  {profile_data?.smoking !== undefined && (
                    <span className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
                      {profile_data.smoking ? 'Smoker' : 'Non-smoker'}
                    </span>
                  )}
                  {profile_data?.cooking && (
                    <span className="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium border border-yellow-200">
                      {profile_data.cooking}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Daily Routine Section */}
            {(profile_data?.wakeUpTime || profile_data?.bedTime) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                  🔄 Daily Routine
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {profile_data?.wakeUpTime && (
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <p className="text-xs text-gray-600 mb-1">Wake up</p>
                      <p className="font-semibold text-gray-900">{profile_data.wakeUpTime}</p>
                    </div>
                  )}
                  {profile_data?.bedTime && (
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <p className="text-xs text-gray-600 mb-1">Sleep time</p>
                      <p className="font-semibold text-gray-900">{profile_data.bedTime}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Looking For Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                🏠 Looking For
              </h3>
              <div className="space-y-2 text-gray-700">
                {profile_data?.colivingSize && (
                  <p>• Coliving size: <span className="font-medium">{profile_data.colivingSize}</span></p>
                )}
                {profile_data?.genderPreference && (
                  <p>• Gender preference: <span className="font-medium">{profile_data.genderPreference}</span></p>
                )}
                {profile_data?.roommateAgeRange && (
                  <p>• Roommates aged <span className="font-medium">{profile_data.roommateAgeRange}</span></p>
                )}
                {profile_data?.budget && (
                  <p className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Budget: <span className="font-medium">${profile_data.budget}/month</span>
                  </p>
                )}
                {profile_data?.moveInDate && (
                  <p>• Move-in: <span className="font-medium">{profile_data.moveInDate}</span></p>
                )}
              </div>
            </div>

            {/* Profile Status */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Profile Status</span>
                {profile.onboarding_completed ? (
                  <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                    ✓ Complete
                  </span>
                ) : (
                  <span className="text-yellow-600 font-medium">Incomplete</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <button className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-[#4A148C]" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Browse Properties</h4>
            <p className="text-sm text-gray-600">Find your perfect match</p>
          </button>

          <button className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Favorites</h4>
            <p className="text-sm text-gray-600">View saved properties</p>
          </button>

          <button onClick={() => router.push('/profile')} className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Settings className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Account Settings</h4>
            <p className="text-sm text-gray-600">Update preferences</p>
          </button>
        </div>

        {/* Matches Section (Coming Soon) */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
          <h3 className="text-xl font-bold text-[#4A148C] mb-4">Your Matches</h3>
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              No matches yet
            </h4>
            <p className="text-gray-500 mb-6">
              Start browsing properties to find your perfect coliving space
            </p>
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Start Searching
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
