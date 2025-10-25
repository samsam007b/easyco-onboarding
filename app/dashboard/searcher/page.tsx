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
        router.push('/onboarding/searcher')
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
    router.push('/onboarding/searcher')
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

        {/* Profile Summary Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#4A148C] flex items-center gap-2">
              <User className="w-6 h-6" />
              Your Profile
            </h3>
            <Button onClick={handleEditProfile} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Info */}
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900">{profile.email}</p>
            </div>

            {/* Location Preference */}
            {profile_data?.location && (
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Preferred Location
                </label>
                <p className="text-gray-900">{profile_data.location}</p>
              </div>
            )}

            {/* Budget */}
            {profile_data?.budget && (
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Budget
                </label>
                <p className="text-gray-900">${profile_data.budget}/month</p>
              </div>
            )}

            {/* Move-in Date */}
            {profile_data?.moveInDate && (
              <div>
                <label className="text-sm font-medium text-gray-600">Move-in Date</label>
                <p className="text-gray-900">{profile_data.moveInDate}</p>
              </div>
            )}

            {/* Living Style */}
            {profile_data?.lifestyle && (
              <div>
                <label className="text-sm font-medium text-gray-600">Living Style</label>
                <p className="text-gray-900 capitalize">{profile_data.lifestyle}</p>
              </div>
            )}

            {/* Onboarding Status */}
            <div>
              <label className="text-sm font-medium text-gray-600">Profile Status</label>
              <p className="text-gray-900">
                {profile.onboarding_completed ? (
                  <span className="inline-flex items-center gap-1 text-green-600">
                    ✓ Complete
                  </span>
                ) : (
                  <span className="text-yellow-600">Incomplete</span>
                )}
              </p>
            </div>
          </div>

          {/* About/Bio */}
          {profile_data?.about && (
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-600">About Me</label>
              <p className="text-gray-900 mt-1">{profile_data.about}</p>
            </div>
          )}
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
