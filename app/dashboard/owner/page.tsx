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
        profile_data: profileData || {}
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

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      profile.profile_data?.first_name,
      profile.profile_data?.last_name,
      profile.profile_data?.phone_number,
      profile.profile_data?.nationality,
      profile.profile_data?.owner_type,
      profile.profile_data?.company_name,
      profile.profile_data?.primary_location,
      profile.profile_data?.hosting_experience,
      profile.profile_data?.has_property,
      profile.profile_data?.property_city,
      profile.profile_data?.property_type,
      profile.profile_data?.landlord_type,
      profile.profile_data?.experience_years,
      profile.profile_data?.management_type,
      profile.profile_data?.bio || profile.profile_data?.owner_bio,
      profile.profile_data?.primary_motivation,
      profile.profile_data?.iban,
      profile.profile_data?.swift_bic,
      profile.profile_data?.verification_status
    ]

    const filledFields = fields.filter(field => field !== undefined && field !== null && field !== '').length
    return Math.round((filledFields / fields.length) * 100)
  }

  const completionPercentage = calculateProfileCompletion()

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

        {/* Profile Preview Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-[#4A148C] to-[#6A1B9A] p-8 text-white relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                  <Building2 className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Property Owner Profile</h2>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.profile_data?.primary_location || profile.profile_data?.property_city || 'Location not set'}</span>
                  </div>
                </div>
              </div>
              <Button onClick={handleEditProfile} variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {/* Progress Bar */}
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
                  Complete your profile to build trust with potential tenants!
                </p>
              )}
            </div>
          </div>

          <div className="p-8">
            {/* Owner Info Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                👤 Owner Information
              </h3>
              <div className="space-y-2 text-gray-700">
                {profile.profile_data?.landlord_type && (
                  <p>• Type: <span className="font-medium capitalize">{profile.profile_data.landlord_type}</span></p>
                )}
                {profile.profile_data?.owner_type && (
                  <p>• Owner Type: <span className="font-medium capitalize">{profile.profile_data.owner_type}</span></p>
                )}
                {profile.profile_data?.company_name && (
                  <p>• Company: <span className="font-medium">{profile.profile_data.company_name}</span></p>
                )}
                {profile.profile_data?.phone_number && (
                  <p>• Phone: <span className="font-medium">{profile.profile_data.phone_number}</span></p>
                )}
                {profile.profile_data?.hosting_experience && (
                  <p>• Experience: <span className="font-medium">{profile.profile_data.hosting_experience}</span></p>
                )}
                <p>• Email: <span className="font-medium">{profile.email}</span></p>
              </div>
            </div>

            {/* Property Info Section */}
            {(profile.profile_data?.has_property || profile.profile_data?.property_city || profile.profile_data?.property_type) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                  🏠 Property Details
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.profile_data?.has_property && (
                    <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                      Property Available
                    </span>
                  )}
                  {profile.profile_data?.property_city && (
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {profile.profile_data.property_city}
                    </span>
                  )}
                  {profile.profile_data?.property_type && (
                    <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200 capitalize">
                      {profile.profile_data.property_type}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Management Style */}
            {(profile.profile_data?.experience_years || profile.profile_data?.management_type) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                  ⚙️ Management Style
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {profile.profile_data?.experience_years && (
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <p className="text-xs text-gray-600 mb-1">Years of Experience</p>
                      <p className="font-semibold text-gray-900">{profile.profile_data.experience_years} years</p>
                    </div>
                  )}
                  {profile.profile_data?.management_type && (
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <p className="text-xs text-gray-600 mb-1">Management Type</p>
                      <p className="font-semibold text-gray-900 capitalize">{profile.profile_data.management_type}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* About/Bio */}
            {(profile.profile_data?.bio || profile.profile_data?.owner_bio) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                  📝 About
                </h3>
                <p className="text-gray-700 italic">"{profile.profile_data.bio || profile.profile_data.owner_bio}"</p>
              </div>
            )}

            {/* Payment Info */}
            {(profile.profile_data?.iban || profile.profile_data?.swift_bic) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                  💳 Payment Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="text-sm font-medium">✓ Banking details configured</span>
                  </div>
                  {profile.profile_data?.iban && (
                    <p className="text-xs text-gray-500 mt-2">IBAN: {profile.profile_data.iban.replace(/(.{4})/g, '$1 ').trim()}</p>
                  )}
                </div>
              </div>
            )}

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
