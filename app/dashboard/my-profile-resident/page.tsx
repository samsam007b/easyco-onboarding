'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { User, Mail, Lock, LogOut, Trash2, Camera, Check, X, Eye, EyeOff, AlertCircle, RefreshCw, Settings, Shield, UserCircle, ArrowLeft, DollarSign, Users, Heart, ChevronRight, Sparkles, Award, Trophy, Star, Zap, Target, TrendingUp, Rocket, ChevronDown, MapPin, Euro, ShieldCheck, Edit } from 'lucide-react'
import { toast } from 'sonner'
import RoleSwitchModal from '@/components/RoleSwitchModal'
import { useRole } from '@/lib/role/role-context'
import { useLanguage } from '@/lib/i18n/use-language'
import ProfilePictureUpload from '@/components/ProfilePictureUpload'
import LoadingHouse from '@/components/ui/LoadingHouse';
import { motion, AnimatePresence } from 'framer-motion'
import { calculateProfileCompletion } from '@/lib/profile/profile-completion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface UserData {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  user_type: string
  onboarding_completed: boolean
  email_verified: boolean
}

interface UserProfile {
  // Basic Info
  first_name?: string | null
  last_name?: string | null
  date_of_birth?: string | null
  phone_number?: string | null
  profile_photo_url?: string | null

  // Search Preferences
  preferred_cities?: string[] | null
  min_budget?: number | null
  max_budget?: number | null
  move_in_date?: string | null
  room_type?: string | null

  // Lifestyle
  occupation?: string | null
  bio?: string | null
  cleanliness_level?: number | null
  noise_tolerance?: string | null
  smoking?: boolean | null
  pets?: boolean | null
  has_pets?: boolean | null
  pet_friendly?: boolean | null

  // Personality & Compatibility
  morning_person?: boolean | null
  social_level?: string | null
  introvert_extrovert?: string | null
  shared_meals_interest?: boolean | null
  event_participation?: string | null

  // Hobbies & Interests
  hobbies?: string[] | null
  interests?: string[] | null

  // Values
  sustainability_importance?: string | null
  community_values?: string[] | null

  // Financial
  income_range?: string | null
  employment_status?: string | null

  // Verification
  id_verified?: boolean | null
  email_verified?: boolean | null
  phone_verified?: boolean | null
  background_check?: boolean | null

  // CORE Onboarding field aliases (for backward compatibility)
  budget_min?: number | null
  budget_max?: number | null
  current_city?: string | null
  preferred_move_in_date?: string | null
  preferred_room_type?: string | null
  occupation_status?: string | null
  cleanliness_preference?: string | null
  is_smoker?: boolean | null
  wake_up_time?: string | null
  home_activity_level?: string | null
  introvert_extrovert_scale?: number | null
  event_interest?: string | null
  core_values?: string[] | null

  // Legacy fields for enhance sections
  about_me?: string | null
  looking_for?: string | null
  important_qualities?: string[] | null
  deal_breakers?: string[] | null
  financial_info?: any
  community_preferences?: any
  extended_personality?: any
  advanced_preferences?: any
  verification_status?: string | null
}

const USER_TYPES = [
  { value: 'searcher', label: 'Searcher (looking for a place)' },
  { value: 'owner', label: 'Owner (have properties to rent)' },
  { value: 'resident', label: 'Resident (currently renting)' },
]

type TabType = 'profile' | 'settings'

export default function MyProfileResidentPage() {
  const router = useRouter()
  const { activeRole } = useRole()
  const { language, getSection } = useLanguage()
  const common = getSection('common')
  const settings = getSection('settings')
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [fullName, setFullName] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [isSavingName, setIsSavingName] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('profile')

  // User type change
  const [selectedUserType, setSelectedUserType] = useState('')
  const [isChangingUserType, setIsChangingUserType] = useState(false)
  const [showRoleSwitchModal, setShowRoleSwitchModal] = useState(false)

  // Password change state
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  // Reset onboarding dialog state
  const [showResetOnboardingDialog, setShowResetOnboardingDialog] = useState(false)

  // Profile completion dropdown state
  const [showCompletionDetails, setShowCompletionDetails] = useState(false)

  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false)

  const supabase = createClient()

  // Fetch user data
  const fetchUserData = async () => {
    setIsRefreshing(true)
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        toast.error('Failed to load profile')
        return
      }

      setUserData(data)
      setFullName(data.full_name || '')
      setSelectedUserType(data.user_type)

      // Fetch user profile data - fetch ALL fields for profile completion calculation
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profileData) {
        setUserProfile(profileData)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [supabase, router])

  // Save full name
  const handleSaveName = async () => {
    if (!userData) return

    if (!fullName.trim()) {
      toast.error('Name cannot be empty')
      return
    }

    setIsSavingName(true)

    try {
      const { error } = await supabase
        .from('users')
        .update({ full_name: fullName })
        .eq('id', userData.id)

      if (error) {
        toast.error('Failed to update name')
        return
      }

      setUserData({ ...userData, full_name: fullName })
      setIsEditingName(false)
      toast.success('Name updated successfully')
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSavingName(false)
    }
  }

  // Open role switch modal
  const handleOpenRoleSwitch = () => {
    if (!userData) return

    if (selectedUserType === userData.user_type) {
      toast.error('Please select a different role')
      return
    }

    setShowRoleSwitchModal(true)
  }

  // Confirm role switch
  const handleConfirmRoleSwitch = async () => {
    if (!userData) return

    setIsChangingUserType(true)

    try {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userData.id)
        .single()

      let hasCompletedNewRoleOnboarding = false

      if (selectedUserType === 'searcher') {
        hasCompletedNewRoleOnboarding = !!(profileData?.first_name && profileData?.date_of_birth && profileData?.budget_min)
      } else if (selectedUserType === 'owner') {
        hasCompletedNewRoleOnboarding = !!(profileData?.first_name && profileData?.phone_number && profileData?.owner_type)
      } else if (selectedUserType === 'resident') {
        hasCompletedNewRoleOnboarding = !!(profileData?.first_name && profileData?.current_city && profileData?.bio)
      }

      const { error } = await supabase
        .from('users')
        .update({
          user_type: selectedUserType,
          onboarding_completed: hasCompletedNewRoleOnboarding
        })
        .eq('id', userData.id)

      if (error) {
        toast.error('Failed to change role')
        return
      }

      toast.success('Role switched successfully!')

      setTimeout(() => {
        if (hasCompletedNewRoleOnboarding) {
          router.push(`/dashboard/${selectedUserType}`)
        } else {
          if (selectedUserType === 'searcher') {
            router.push('/onboarding/searcher/profile-type')
          } else {
            router.push(`/onboarding/${selectedUserType}/basic-info`)
          }
        }
      }, 1000)
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsChangingUserType(false)
      setShowRoleSwitchModal(false)
    }
  }

  // Reset onboarding
  const handleResetOnboarding = async () => {
    if (!userData) return
    setShowResetOnboardingDialog(true)
  }

  const confirmResetOnboarding = async () => {
    if (!userData) return

    try {
      const { error } = await supabase
        .from('users')
        .update({ onboarding_completed: false })
        .eq('id', userData.id)

      if (error) throw error

      toast.success('Onboarding reset! Redirecting...')
      setShowResetOnboardingDialog(false)

      setTimeout(() => {
        // Handle null user_type - redirect to welcome for role selection
        if (!userData.user_type) {
          router.push('/welcome')
          return
        }
        if (userData.user_type === 'searcher') {
          router.push('/onboarding/searcher/profile-type')
        } else {
          router.push(`/onboarding/${userData.user_type}/basic-info`)
        }
      }, 1000)
    } catch (error) {
      toast.error('Failed to reset onboarding')
    }
  }

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50/30 flex items-center justify-center">
        <LoadingHouse size={80} />
      </div>
    )
  }

  if (!userData) {
    return null
  }

  // Resident colors (orange/red)
  const colors = {
    gradient: 'from-orange-600 to-red-600',
    light: 'from-orange-50 via-white to-red-50/30',
    ring: 'from-orange-400 to-red-500',
    text: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    hover: 'hover:border-orange-300'
  }

  // Calculate comprehensive profile completion using the proper function
  const profileCompletionResult = calculateProfileCompletion(userProfile)
  const profileCompletion = profileCompletionResult.percentage

  // Tab content components
  const tabs = [
    { id: 'profile' as TabType, label: 'Profil', icon: UserCircle },
    { id: 'settings' as TabType, label: 'Rôle', icon: Settings },
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.light}`}>
      {/* Header - Minimal */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.push('/settings')}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Hero Section with Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Avatar with Progress Ring */}
          <div className="relative inline-block mb-6">
            {/* Progress Ring */}
            <svg className="absolute inset-0 -m-3" width="220" height="220">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className={colors.ring.split(' ')[0].replace('from-', 'stop-')} />
                  <stop offset="100%" className={colors.ring.split(' ')[1].replace('to-', 'stop-')} />
                </linearGradient>
              </defs>
              {/* Background circle */}
              <circle
                cx="110"
                cy="110"
                r="105"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              {/* Progress circle */}
              <circle
                cx="110"
                cy="110"
                r="105"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 105}`}
                strokeDashoffset={`${2 * Math.PI * 105 * (1 - profileCompletion / 100)}`}
                transform="rotate(-90 110 110)"
                className="transition-all duration-1000"
              />
            </svg>

            {/* Avatar */}
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl">
              {userData.avatar_url ? (
                <img
                  src={userData.avatar_url}
                  alt={userData.full_name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                  <User className="w-24 h-24 text-white" />
                </div>
              )}
            </div>

            {/* Upload button overlay */}
            <div className="absolute bottom-2 right-2">
              <ProfilePictureUpload
                userId={userData.id}
                currentAvatarUrl={userData.avatar_url || undefined}
                compact={true}
                onUploadSuccess={async (url) => {
                  const { data } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', userData.id)
                    .single();
                  if (data) {
                    setUserData(data as UserData);
                  }
                }}
              />
            </div>
          </div>

          {/* Name and Role */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {userData.full_name || 'Unnamed User'}
          </h1>
          <p className={`text-lg ${colors.text} font-medium capitalize mb-4`}>
            {userData.user_type}
          </p>

          {/* Completion Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - profileCompletion / 100)}`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900">
                  {profileCompletion}%
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                Profil complété
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-2xl p-1 shadow-lg border border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? `${colors.text} bg-gradient-to-r ${colors.bg}`
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 bg-gradient-to-r ${colors.bg} rounded-xl -z-10`}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <>
                {/* Personal Information */}
                <div className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all p-6 border ${colors.border} ${colors.hover}`}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations Personnelles</h2>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom Complet
                      </label>
                      {isEditingName ? (
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="flex-1"
                            disabled={isSavingName}
                          />
                          <Button
                            onClick={handleSaveName}
                            disabled={isSavingName}
                            className={`bg-gradient-to-r ${colors.gradient} text-white`}
                          >
                            {isSavingName ? 'Saving...' : 'Save'}
                          </Button>
                          <Button
                            onClick={() => {
                              setIsEditingName(false)
                              setFullName(userData.full_name || '')
                            }}
                            variant="outline"
                            disabled={isSavingName}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                          <span className="text-gray-900">{userData.full_name || 'Not set'}</span>
                          <Button
                            onClick={() => setIsEditingName(true)}
                            variant="ghost"
                            className={colors.text}
                          >
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{userData.email}</span>
                        </div>
                        {userData.email_verified ? (
                          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            <Check className="w-4 h-4" />
                            Vérifié
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                            <AlertCircle className="w-4 h-4" />
                            Non vérifié
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Card Hero - "What others see" */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  {/* Hero Message */}
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600 font-medium">Voici ce que les autres voient de toi</p>
                  </div>

                  {/* Large Profile Card */}
                  <div className={`relative overflow-hidden rounded-3xl border-2 ${colors.border} bg-white/90 backdrop-blur-sm p-6 shadow-xl hover:shadow-2xl transition-all`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-orange-50 opacity-50" />
                    <div className="relative">
                      {/* Header: Photo + Basic Info */}
                      <div className="flex items-start gap-4 mb-4">
                        {/* Photo with Progress Ring */}
                        <div className="relative flex-shrink-0">
                          <svg className="absolute -inset-1" width="88" height="88">
                            <circle cx="44" cy="44" r="42" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                            <circle
                              cx="44" cy="44" r="42"
                              fill="none"
                              stroke="#ea580c"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeDasharray="264"
                              strokeDashoffset={264 * (1 - profileCompletion / 100)}
                              transform="rotate(-90 44 44)"
                            />
                          </svg>
                          {userData.avatar_url ? (
                            <img
                              src={userData.avatar_url}
                              alt="Profile"
                              className="w-20 h-20 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center text-white text-2xl font-bold">
                              {userData.full_name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          )}
                        </div>

                        {/* Name + Quick Info */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {userData.full_name || 'Nom non renseigné'}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                            {/* City */}
                            {(userProfile?.current_city || (userProfile?.preferred_cities && userProfile.preferred_cities.length > 0)) && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {userProfile?.current_city || userProfile?.preferred_cities?.[0]}
                              </span>
                            )}

                            {/* Budget */}
                            {((userProfile?.budget_min || userProfile?.min_budget) && (userProfile?.budget_max || userProfile?.max_budget)) && (
                              <span className="flex items-center gap-1">
                                <Euro className="w-4 h-4" />
                                {userProfile?.budget_min || userProfile?.min_budget}-{userProfile?.budget_max || userProfile?.max_budget}€
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            {userData.email_verified && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                Vérifié
                              </span>
                            )}
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              profileCompletion === 100 ? 'bg-green-100 text-green-700' :
                              profileCompletion >= 60 ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {profileCompletion}% complet
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      {userProfile?.about_me && (
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                          {userProfile.about_me}
                        </p>
                      )}

                      {/* Tags */}
                      <div className="space-y-2 mb-4">
                        {/* Hobbies */}
                        {userProfile?.hobbies && userProfile.hobbies.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-semibold text-gray-600">🎨 Loisirs:</span>
                            {userProfile.hobbies.slice(0, 3).map((hobby, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                {hobby}
                              </span>
                            ))}
                            {userProfile.hobbies.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{userProfile.hobbies.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Values */}
                        {userProfile?.core_values && userProfile.core_values.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-semibold text-gray-600">❤️ Valeurs:</span>
                            {userProfile.core_values.slice(0, 3).map((value, idx) => (
                              <span key={idx} className="px-2 py-1 bg-pink-50 text-pink-700 text-xs rounded-full">
                                {value}
                              </span>
                            ))}
                            {userProfile.core_values.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{userProfile.core_values.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <button
                          className={`flex-1 px-4 py-2 bg-gradient-to-r ${colors.gradient} text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all`}
                          onClick={() => router.push('/profile/public-view')}
                        >
                          <Eye className="w-4 h-4 inline mr-1" />
                          Voir en mode public
                        </button>
                        <button
                          className="px-4 py-2 border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                          onClick={() => setIsEditingName(true)}
                        >
                          <Edit className="w-4 h-4 inline" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Compact Profile Completion - Just below Personal Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-gradient-to-br from-orange-50/50 to-pink-50/50 backdrop-blur-sm rounded-2xl p-4 border ${colors.border} ${colors.hover} mb-6`}
                >
                  {/* Header - Always visible */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setShowCompletionDetails(!showCompletionDetails)}
                      className="flex-1 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                      {/* Small Progress Circle */}
                      <div className="relative w-12 h-12">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                          <circle
                            cx="24" cy="24" r="20"
                            fill="none"
                            stroke="url(#compactGradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 20}`}
                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - profileCompletion / 100)}`}
                            className="transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            {profileCompletion}%
                          </span>
                        </div>
                        <svg className="hidden">
                          <defs>
                            <linearGradient id="compactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ea580c" />
                              <stop offset="50%" stopColor="#ec4899" />
                              <stop offset="100%" stopColor="#dc2626" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>

                      <div className="text-left">
                        <h3 className="text-sm font-semibold text-gray-900">Complétion du profil</h3>
                        <p className="text-xs text-gray-600">
                          {profileCompletion === 100 ? (
                            "Profil complet"
                          ) : (
                            `${7 - Math.round((profileCompletion / 100) * 7)} section${7 - Math.round((profileCompletion / 100) * 7) > 1 ? 's' : ''} à compléter`
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {profileCompletion === 100 && (
                        <Trophy className="w-5 h-5 text-yellow-600" />
                      )}
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCompletionDetails ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Refresh Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      fetchUserData()
                      toast.success('Données actualisées')
                    }}
                    disabled={isRefreshing}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors disabled:opacity-50"
                    title="Actualiser les données"
                  >
                    <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                  {/* Dropdown Details */}
                  <AnimatePresence>
                    {showCompletionDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                          {/* Profile de base */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <UserCircle className={`w-4 h-4 ${userData.full_name && userData.avatar_url ? 'text-green-600' : 'text-gray-400'}`} />
                                <span className="text-xs font-medium text-gray-700">Profil de base</span>
                              </div>
                              {userData.full_name && userData.avatar_url ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <span className="text-xs text-gray-500">0/2</span>
                              )}
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                                style={{ width: `${userData.full_name && userData.avatar_url ? 100 : 0}%` }}
                              />
                            </div>
                          </div>

                          {/* À propos */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <User className={`w-4 h-4 ${userProfile?.about_me || userProfile?.looking_for ? 'text-green-600' : 'text-gray-400'}`} />
                                <span className="text-xs font-medium text-gray-700">À propos</span>
                              </div>
                              {userProfile?.about_me || userProfile?.looking_for ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-sky-600 transition-all duration-500"
                                style={{ width: `${userProfile?.about_me || userProfile?.looking_for ? 100 : 0}%` }}
                              />
                            </div>
                          </div>

                          {/* Loisirs */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Sparkles className={`w-4 h-4 ${userProfile?.hobbies && userProfile.hobbies.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                                <span className="text-xs font-medium text-gray-700">Loisirs</span>
                              </div>
                              {userProfile?.hobbies && userProfile.hobbies.length > 0 ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                                style={{ width: `${userProfile?.hobbies && userProfile.hobbies.length > 0 ? 100 : 0}%` }}
                              />
                            </div>
                          </div>

                          {/* Personality */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Heart className={`w-4 h-4 ${userProfile?.extended_personality ? 'text-green-600' : 'text-gray-400'}`} />
                                <span className="text-xs font-medium text-gray-700">Personnalité</span>
                              </div>
                              {userProfile?.extended_personality ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-pink-500 to-rose-600 transition-all duration-500"
                                style={{ width: `${userProfile?.extended_personality ? 100 : 0}%` }}
                              />
                            </div>
                          </div>

                          {/* Valeurs */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Shield className={`w-4 h-4 ${userProfile?.core_values && userProfile.core_values.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                                <span className="text-xs font-medium text-gray-700">Valeurs</span>
                              </div>
                              {userProfile?.core_values && userProfile.core_values.length > 0 ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-violet-600 transition-all duration-500"
                                style={{ width: `${userProfile?.core_values && userProfile.core_values.length > 0 ? 100 : 0}%` }}
                              />
                            </div>
                          </div>

                          {/* Financial Info */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <DollarSign className={`w-4 h-4 ${userProfile?.financial_info ? 'text-green-600' : 'text-gray-400'}`} />
                                <span className="text-xs font-medium text-gray-700">Informations financières</span>
                              </div>
                              {userProfile?.financial_info ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-yellow-500 to-amber-600 transition-all duration-500"
                                style={{ width: `${userProfile?.financial_info ? 100 : 0}%` }}
                              />
                            </div>
                          </div>

                          {/* Community */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Users className={`w-4 h-4 ${userProfile?.community_preferences ? 'text-green-600' : 'text-gray-400'}`} />
                                <span className="text-xs font-medium text-gray-700">Communauté & événements</span>
                              </div>
                              {userProfile?.community_preferences ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-orange-500 to-amber-600 transition-all duration-500"
                                style={{ width: `${userProfile?.community_preferences ? 100 : 0}%` }}
                              />
                            </div>
                          </div>

                          {/* CTA if not complete */}
                          {profileCompletion < 100 && (
                            <div className="pt-2">
                              <p className="text-xs text-center text-gray-600 italic">
                                Complète ton profil pour augmenter ta visibilité jusqu'à 3x
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Enhanced Profile Sections - Uniform Style */}
                <div className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all p-6 border ${colors.border} ${colors.hover}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Améliorer mon profil</h2>
                    <span className="text-sm text-gray-500">Augmentez vos chances de matching</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* About Me */}
                    <motion.div
                      onClick={() => router.push('/profile/enhance/about')}
                      className="group cursor-pointer bg-white rounded-2xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">À propos</h3>
                            <p className="text-sm text-gray-600">Parlez-nous de vous</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1" />
                      </div>
                    </motion.div>

                    {/* Personality */}
                    <motion.div
                      onClick={() => router.push('/profile/enhance/personality')}
                      className="group cursor-pointer bg-white rounded-2xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                            <Heart className="w-6 h-6 text-pink-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Personnalité</h3>
                            <p className="text-sm text-gray-600">Votre style de vie</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1" />
                      </div>
                    </motion.div>

                    {/* Values */}
                    <motion.div
                      onClick={() => router.push('/profile/enhance/values')}
                      className="group cursor-pointer bg-white rounded-2xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Valeurs</h3>
                            <p className="text-sm text-gray-600">Ce qui compte pour vous</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1" />
                      </div>
                    </motion.div>

                    {/* Hobbies */}
                    <motion.div
                      onClick={() => router.push('/profile/enhance/hobbies')}
                      className="group cursor-pointer bg-white rounded-2xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Loisirs</h3>
                            <p className="text-sm text-gray-600">Vos passions et activités</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1" />
                      </div>
                    </motion.div>

                    {/* Community Events */}
                    <motion.div
                      onClick={() => router.push('/profile/enhance/community')}
                      className="group cursor-pointer bg-white rounded-2xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                            <Users className="w-6 h-6 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Communauté</h3>
                            <p className="text-sm text-gray-600">Événements et repas partagés</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1" />
                      </div>
                    </motion.div>

                    {/* Financial Info */}
                    <motion.div
                      onClick={() => router.push('/profile/enhance/financial')}
                      className="group cursor-pointer bg-white rounded-2xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Financier</h3>
                            <p className="text-sm text-gray-600">Situation professionnelle</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1" />
                      </div>
                    </motion.div>

                    {/* Profile Verification */}
                    <motion.div
                      onClick={() => router.push('/profile/enhance/verification')}
                      className="group cursor-pointer bg-white rounded-2xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all md:col-span-2 lg:col-span-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">Vérification</h3>
                              {userProfile?.verification_status === 'verified' && (
                                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-semibold">
                                  <Check className="w-3 h-3" />
                                  Vérifié
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">Vérifiez votre identité</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1" />
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Enhance Profile CTA */}
                {!userData.onboarding_completed && (
                  <div className={`bg-gradient-to-r ${colors.gradient} rounded-3xl shadow-xl p-8 text-white`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Perfectionne ton profil</h2>
                        <p className="text-white/90">
                          Augmente tes chances de matching en complétant ton profil à 100%
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push(`/profile/enhance-${userData.user_type}`)}
                      className="bg-white text-gray-900 hover:bg-white/90 rounded-full font-semibold"
                    >
                      Perfectionner mon profil
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <>
                {/* Role Management */}
                <div className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all p-6 border ${colors.border} ${colors.hover}`}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Gestion du Rôle</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rôle Actuel
                      </label>
                      <div className={`p-4 ${colors.bg} rounded-2xl`}>
                        <span className="text-gray-900 capitalize font-medium">{userData.user_type}</span>
                        {userData.onboarding_completed && (
                          <span className="ml-3 text-xs text-green-600">
                            <Check className="w-3 h-3 inline mr-1" />
                            Onboarding terminé
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Changer de Rôle
                      </label>
                      <div className="flex gap-2">
                        <Select
                          value={selectedUserType}
                          onChange={(e) => setSelectedUserType(e.target.value)}
                          options={USER_TYPES}
                          className="flex-1"
                          disabled={isChangingUserType}
                        />
                        <Button
                          onClick={handleOpenRoleSwitch}
                          disabled={isChangingUserType || selectedUserType === userData.user_type}
                          className={`bg-gradient-to-r ${colors.gradient} text-white`}
                        >
                          Changer
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Vos données sont préservées lors du changement de rôle.
                      </p>
                    </div>

                    {userData.onboarding_completed && (
                      <div className="pt-4 border-t border-gray-100">
                        <Button
                          onClick={handleResetOnboarding}
                          variant="outline"
                          className={`flex items-center gap-2 border-2 ${colors.border} ${colors.text} hover:bg-gray-50`}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Refaire l'Onboarding
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Status */}
                <div className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all p-6 border ${colors.border} ${colors.hover}`}>
                  <h3 className="font-bold text-gray-900 mb-4">Statut du Compte</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm text-gray-600">Email vérifié</span>
                      {userData.email_verified ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm text-gray-600">Onboarding</span>
                      {userData.onboarding_completed ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm text-gray-600">Photo de profil</span>
                      {userData.avatar_url ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

      </main>

      {/* Role Switch Modal */}
      <RoleSwitchModal
        isOpen={showRoleSwitchModal}
        onClose={() => setShowRoleSwitchModal(false)}
        onConfirm={handleConfirmRoleSwitch}
        currentRole={userData.user_type}
        newRole={selectedUserType}
        isLoading={isChangingUserType}
      />

      {/* Reset Onboarding Confirmation Dialog */}
      <AlertDialog open={showResetOnboardingDialog} onOpenChange={setShowResetOnboardingDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">
              {settings?.resetOnboarding?.title?.[language] || 'Reset Onboarding'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              {settings?.resetOnboarding?.description?.[language] || 'This will reset your onboarding progress. Your profile information will be preserved. Are you sure you want to continue?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-100">
              {common?.cancel?.[language] || 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmResetOnboarding}
              className={`bg-gradient-to-r ${colors.gradient} text-white`}
            >
              {settings?.resetOnboarding?.confirm?.[language] || 'Reset'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
