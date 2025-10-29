'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/supabase-client'
import { getMyProperties } from '@/lib/property-helpers'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Home, Plus, Settings, LogOut, Edit, User, Building2, MapPin, Bed, Bath, Hand, UserCircle, FileText, CreditCard, Check, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import type { Property } from '@/types/property.types'
import { useLanguage } from '@/lib/i18n/use-language'
import DashboardHeader from '@/components/DashboardHeader'
import { useRole } from '@/lib/role/role-context'
import IconBadge from '@/components/IconBadge'

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
  const { t, getSection } = useLanguage()
  const { setActiveRole } = useRole()
  const dashboard = getSection('dashboard')
  const common = getSection('common')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProfile()
    // Set active role when dashboard loads
    setActiveRole('owner')
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
        // FIXME: Use logger.error('Error loading profile:', profileError)
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
      // FIXME: Use logger.error('Error:', error)
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const loadProperties = async () => {
    const result = await getMyProperties()
    if (result.success && result.data) {
      setProperties(result.data as Property[])
    } else {
      // FIXME: Use logger.error('Error loading properties:', result.error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    toast.success(dashboard.owner.logoutSuccess)
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
          <p className="text-gray-600">{dashboard.owner.loadingDashboard}</p>
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
      <DashboardHeader
        profile={{
          full_name: profile.full_name,
          email: profile.email,
          profile_data: profile.profile_data
        }}
        avatarColor="#4A148C"
        role="owner"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Back to Home Button */}
        <Button
          onClick={() => router.push('/home/owner')}
          variant="outline"
          className="mb-4 rounded-2xl gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
        {/* Welcome Section */}
        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#4A148C] mb-2 flex items-center gap-2">
            {dashboard.owner.welcome} {profile.full_name}! <Hand className="w-6 h-6 sm:w-7 sm:h-7 text-[#FFD700]" />
          </h2>
          <p className="text-gray-600">
            {dashboard.owner.welcomeMessage}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl shadow p-4 sm:p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/owner/properties')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#4A148C]" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{dashboard.owner.manageProperties}</h4>
            <p className="text-xs sm:text-sm text-gray-600">{dashboard.owner.viewEditListings}</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-4 sm:p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/owner/applications')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFD600]" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{dashboard.owner.applications}</h4>
            <p className="text-xs sm:text-sm text-gray-600">{dashboard.owner.reviewTenantRequests}</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-4 sm:p-6 text-center hover:shadow-lg transition-shadow cursor-pointer sm:col-span-2 md:col-span-1" onClick={() => router.push('/profile')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{dashboard.searcher.accountSettings}</h4>
            <p className="text-xs sm:text-sm text-gray-600">{dashboard.owner.updateYourPreferences}</p>
          </div>
        </div>

        {/* Profile Preview Card */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6 sm:mb-8">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-[#4A148C] to-[#6A1B9A] p-4 sm:p-8 text-white relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                  <Building2 className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold mb-1">{dashboard.owner.propertyOwnerProfile}</h2>
                  <div className="flex items-center gap-2 text-white/90 text-sm sm:text-base">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="line-clamp-1">{profile.profile_data?.primary_location || profile.profile_data?.property_city || dashboard.searcher.locationNotSet}</span>
                  </div>
                </div>
              </div>
              <Button onClick={handleEditProfile} variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 w-full sm:w-auto text-sm sm:text-base">
                <Edit className="w-4 h-4 mr-2" />
                {dashboard.searcher.editProfile}
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
                  {dashboard.owner.completionMessage}
                </p>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-8">
            {/* Owner Info Section */}
            <div className="mb-6">
              <h3 className="text-base sm:text-base sm:text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                <IconBadge icon={UserCircle} variant="purple" size="sm" /> {dashboard.owner.ownerInfo}
              </h3>
              <div className="space-y-2 text-gray-700">
                {profile.profile_data?.landlord_type && (
                  <p>• {dashboard.owner.type} <span className="font-medium capitalize">{profile.profile_data.landlord_type}</span></p>
                )}
                {profile.profile_data?.owner_type && (
                  <p>• {dashboard.owner.ownerType} <span className="font-medium capitalize">{profile.profile_data.owner_type}</span></p>
                )}
                {profile.profile_data?.company_name && (
                  <p>• {dashboard.owner.company} <span className="font-medium">{profile.profile_data.company_name}</span></p>
                )}
                {profile.profile_data?.phone_number && (
                  <p>• {dashboard.owner.phone} <span className="font-medium">{profile.profile_data.phone_number}</span></p>
                )}
                {profile.profile_data?.hosting_experience && (
                  <p>• {dashboard.owner.experience} <span className="font-medium">{profile.profile_data.hosting_experience}</span></p>
                )}
                <p>• {dashboard.owner.email} <span className="font-medium">{profile.email}</span></p>
              </div>
            </div>

            {/* Property Info Section */}
            {(profile.profile_data?.has_property || profile.profile_data?.property_city || profile.profile_data?.property_type) && (
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                  <IconBadge icon={Home} variant="blue" size="sm" /> {dashboard.owner.propertyDetails}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.profile_data?.has_property && (
                    <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                      {dashboard.owner.propertyAvailable}
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
                <h3 className="text-base sm:text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                  <IconBadge icon={Settings} variant="orange" size="sm" /> Management Style
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
                <h3 className="text-base sm:text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                  <IconBadge icon={FileText} variant="green" size="sm" /> About
                </h3>
                <p className="text-gray-700 italic">"{profile.profile_data.bio || profile.profile_data.owner_bio}"</p>
              </div>
            )}

            {/* Payment Info */}
            {(profile.profile_data?.iban || profile.profile_data?.swift_bic) && (
              <div className="mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-[#4A148C] mb-3 flex items-center gap-2">
                  <IconBadge icon={CreditCard} variant="cyan" size="sm" /> Payment Information
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
                    <Check className="w-4 h-4 mr-1" />Complete
                  </span>
                ) : (
                  <span className="text-yellow-600 font-medium">Incomplete</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Properties Section */}
        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-[#4A148C] flex items-center gap-2">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              {dashboard.owner.myProperties}
            </h3>
            <Button onClick={handleAddProperty} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              {dashboard.owner.addProperty}
            </Button>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Home className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                {dashboard.owner.noPropertiesYet}
              </h4>
              <p className="text-sm sm:text-base text-gray-500 mb-6">
                {dashboard.owner.addFirstProperty}
              </p>
              <Button onClick={handleAddProperty} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                {dashboard.owner.addYourFirstProperty}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {properties.map((property) => (
                <div key={property.id} className="border-2 border-gray-200 rounded-2xl p-4 sm:p-6 hover:border-[#4A148C] transition-colors cursor-pointer">
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
                      {dashboard.owner.viewDetails}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
