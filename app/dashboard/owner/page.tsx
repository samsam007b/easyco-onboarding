'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/supabase-client'
import { getMyProperties } from '@/lib/property-helpers'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Home, Plus, Settings, LogOut, Edit, User, Building2, MapPin, Bed, Bath } from 'lucide-react'
import { toast } from 'sonner'
import type { Property } from '@/types/property.types'

interface UserProfile {
  full_name: string
  email: string
  user_type: string
  onboarding_completed: boolean
  profile_data: any
}

export default function OwnerDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
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

      // If onboarding not completed, redirect directly to first step
      if (!userData.onboarding_completed) {
        router.push('/onboarding/owner/basic-info')
        return
      }

      // Load properties
      await loadProperties()

    } catch (error: any) {
      console.error('Error:', error)
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const loadProperties = async () => {
    const result = await getMyProperties()
    if (result.success && result.data) {
      setProperties(result.data)
    } else {
      console.error('Error loading properties:', result.error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    toast.success('Logged out successfully')
  }

  const handleEditProfile = () => {
    router.push('/dashboard/my-profile-owner')
  }

  const handleAddProperty = () => {
    router.push('/properties/add')
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "success" | "warning"> = {
      published: 'success',
      draft: 'warning',
      archived: 'default'
    }
    return variants[status] || 'default'
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
              <h1 className="text-xl font-bold text-[#4A148C]">Owner Dashboard</h1>
              <p className="text-sm text-gray-600">{profile.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push('/profile/enhance-owner')}>
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
            Manage your properties and tenant applications from here.
          </p>
        </div>

        {/* Profile Info Card */}
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

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900">{profile.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Account Type</label>
              <p className="text-gray-900 capitalize">{profile.user_type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Onboarding Status</label>
              <p className="text-gray-900">
                {profile.onboarding_completed ? (
                  <span className="inline-flex items-center gap-1 text-green-600">
                    ✓ Completed
                  </span>
                ) : (
                  <span className="text-yellow-600">Pending</span>
                )}
              </p>
            </div>
          </div>

          {profile.profile_data?.about && (
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-600">About</label>
              <p className="text-gray-900">{profile.profile_data.about}</p>
            </div>
          )}
        </div>

        {/* Properties Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#4A148C] flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              My Properties
            </h3>
            <Button onClick={handleAddProperty}>
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-12">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                No properties yet
              </h4>
              <p className="text-gray-500 mb-6">
                Add your first property to start receiving tenant applications
              </p>
              <Button onClick={handleAddProperty}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Property
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-[#4A148C] transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-lg text-gray-900 flex-1">{property.title}</h4>
                    <Badge variant={getStatusBadge(property.status)}>
                      {property.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    {property.city}, {property.postal_code}
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      {property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#4A148C]">€{property.monthly_rent}/mo</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/properties/${property.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6 text-[#4A148C]" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Manage Properties</h4>
            <p className="text-sm text-gray-600">View and edit your listings</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-[#FFD600]" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Applications</h4>
            <p className="text-sm text-gray-600">Review tenant requests</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/profile')}>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Settings className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Account Settings</h4>
            <p className="text-sm text-gray-600">Update your preferences</p>
          </div>
        </div>
      </main>
    </div>
  )
}
