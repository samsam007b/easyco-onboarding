'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { User, Mail, Lock, LogOut, Trash2, Camera, Check, X, Eye, EyeOff, AlertCircle, RefreshCw, Settings, Shield, UserCircle, ArrowLeft, DollarSign, Users, Heart, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import RoleSwitchModal from '@/components/RoleSwitchModal'
import { useRole } from '@/lib/role/role-context'
import ProfilePictureUpload from '@/components/ProfilePictureUpload'
import LoadingHouse from '@/components/ui/LoadingHouse';
import { motion, AnimatePresence } from 'framer-motion'
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
  financial_info: any
  community_preferences: any
  extended_personality: any
  advanced_preferences: any
  verification_status: string | null
}

const USER_TYPES = [
  { value: 'searcher', label: 'Searcher (looking for a place)' },
  { value: 'owner', label: 'Owner (have properties to rent)' },
  { value: 'resident', label: 'Resident (currently renting)' },
]

type TabType = 'profile' | 'security' | 'settings'

export default function ProfilePage() {
  const router = useRouter()
  const { activeRole } = useRole()
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

  const supabase = createClient()

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
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

        // Fetch user profile data
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('financial_info, community_preferences, extended_personality, advanced_preferences, verification_status')
          .eq('user_id', user.id)
          .single()

        if (profileData) {
          setUserProfile(profileData)
        }
      } catch (error) {
        toast.error('An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }

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

  // Password strength validation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: '', color: '' }

    let strength = 0
    if (pwd.length >= 8) strength++
    if (pwd.length >= 12) strength++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' }
    if (strength <= 3) return { strength, label: 'Medium', color: 'bg-yellow-500' }
    return { strength, label: 'Strong', color: 'bg-green-500' }
  }

  const newPasswordStrength = getPasswordStrength(newPassword)

  // Change password
  const handleChangePassword = async () => {
    if (!currentPassword) {
      toast.error('Please enter your current password')
      return
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match')
      return
    }

    setIsChangingPassword(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData!.email,
        password: currentPassword,
      })

      if (signInError) {
        toast.error('Current password is incorrect')
        setIsChangingPassword(false)
        return
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        toast.error('Failed to update password')
        return
      }

      toast.success('Password updated successfully')
      setShowChangePassword(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm')
      return
    }

    setIsDeletingAccount(true)

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete account')
      }

      toast.success('Account deleted successfully')
      router.push('/')
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred')
    } finally {
      setIsDeletingAccount(false)
    }
  }

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 flex items-center justify-center">
        <LoadingHouse size={64} />
      </div>
    )
  }

  if (!userData) {
    return null
  }

  // Get role-specific colors
  const getRoleColors = () => {
    const role = userData.user_type
    if (role === 'owner') return {
      gradient: 'from-purple-600 to-purple-700',
      light: 'from-purple-50 via-white to-purple-50/30',
      ring: 'from-purple-400 to-purple-600',
      text: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      hover: 'hover:border-purple-300'
    }
    if (role === 'resident') return {
      gradient: 'from-orange-600 to-red-600',
      light: 'from-orange-50 via-white to-red-50/30',
      ring: 'from-orange-400 to-red-500',
      text: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      hover: 'hover:border-orange-300'
    }
    return {
      gradient: 'from-[#FFA040] to-[#FFD080]',
      light: 'from-orange-50 via-white to-yellow-50/30',
      ring: 'from-[#FFA040] to-[#FFD080]',
      text: 'text-[#FFA040]',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      hover: 'hover:border-orange-300'
    }
  }

  const colors = getRoleColors()
  const profileCompletion = userData.onboarding_completed ? 100 : 50

  // Tab content components
  const tabs = [
    { id: 'profile' as TabType, label: 'Profil', icon: UserCircle },
    { id: 'security' as TabType, label: 'Sécurité', icon: Shield },
    { id: 'settings' as TabType, label: 'Paramètres', icon: Settings },
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.light}`}>
      {/* Header - Minimal */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => {
                const role = activeRole || userData?.user_type || 'searcher'
                router.push(`/dashboard/${role}`)
              }}
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

                {/* Enhanced Profile Sections */}
                <div className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all p-6 border ${colors.border} ${colors.hover}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Améliorer mon profil</h2>
                    <span className="text-sm text-gray-500">Augmentez vos chances de matching</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Financial Info */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => router.push('/profile/enhance/financial')}
                      className="group relative cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200 hover:border-green-300 hover:shadow-lg transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity" />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                            <DollarSign className="w-6 h-6 text-white" />
                          </div>
                          {userProfile?.financial_info ? (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2.5 py-1 rounded-lg font-semibold">
                              <Check className="w-3 h-3" />
                              Complété
                            </span>
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1.5">Informations Financières & Garantie</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">Coordonnées bancaires, garant, documents financiers</p>
                      </div>
                    </motion.div>

                    {/* Community Events */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => router.push('/profile/enhance/community')}
                      className="group relative cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity" />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          {userProfile?.community_preferences ? (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2.5 py-1 rounded-lg font-semibold">
                              <Check className="w-3 h-3" />
                              Complété
                            </span>
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1.5">Communauté & Événements</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">Intérêts communautaires, participation aux événements</p>
                      </div>
                    </motion.div>

                    {/* Extended Personality */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => router.push('/profile/enhance/personality')}
                      className="group relative cursor-pointer bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-5 border border-pink-200 hover:border-pink-300 hover:shadow-lg transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity" />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md">
                            <Heart className="w-6 h-6 text-white" />
                          </div>
                          {userProfile?.extended_personality ? (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2.5 py-1 rounded-lg font-semibold">
                              <Check className="w-3 h-3" />
                              Complété
                            </span>
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1.5">Personnalité Étendue</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">Loisirs, intérêts, détails du style de vie</p>
                      </div>
                    </motion.div>

                    {/* Advanced Preferences */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => router.push('/profile/enhance/preferences')}
                      className="group relative cursor-pointer bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-5 border border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity" />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-md">
                            <Settings className="w-6 h-6 text-white" />
                          </div>
                          {userProfile?.advanced_preferences ? (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2.5 py-1 rounded-lg font-semibold">
                              <Check className="w-3 h-3" />
                              Complété
                            </span>
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1.5">Préférences Avancées</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">Préférences de vie détaillées, deal-breakers</p>
                      </div>
                    </motion.div>

                    {/* Profile Verification */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => router.push('/profile/enhance/verification')}
                      className="group relative cursor-pointer bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200 hover:border-amber-300 hover:shadow-lg transition-all md:col-span-2"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity" />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                            <Shield className="w-6 h-6 text-white" />
                          </div>
                          {userProfile?.verification_status === 'verified' ? (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2.5 py-1 rounded-lg font-semibold">
                              <Check className="w-3 h-3" />
                              Vérifié
                            </span>
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1.5">Vérification du Profil</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">Vérification d'identité, vérifications d'antécédents</p>
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

            {/* Security Tab */}
            {activeTab === 'security' && (
              <>
                {/* Change Password */}
                <div className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all p-6 border ${colors.border} ${colors.hover}`}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Changer le mot de passe</h2>

                  {!showChangePassword ? (
                    <Button
                      onClick={() => setShowChangePassword(true)}
                      variant="outline"
                      className="rounded-full flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Change Password
                    </Button>
                  ) : (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mot de passe actuel
                        </label>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            disabled={isChangingPassword}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nouveau mot de passe
                        </label>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={isChangingPassword}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>

                        {newPassword && (
                          <div className="mt-2">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`h-1 flex-1 rounded-full ${
                                    i < newPasswordStrength.strength ? newPasswordStrength.color : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{newPasswordStrength.label}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirmer le nouveau mot de passe
                        </label>
                        <div className="relative">
                          <Input
                            type={showConfirmNewPassword ? 'text' : 'password'}
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            disabled={isChangingPassword}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            {showConfirmNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>

                        {confirmNewPassword && (
                          <div className="mt-2 flex items-center gap-1">
                            {newPassword === confirmNewPassword ? (
                              <>
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-xs text-green-700">Passwords match</span>
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4 text-red-600" />
                                <span className="text-xs text-red-700">Passwords do not match</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={handleChangePassword}
                          disabled={isChangingPassword || !currentPassword || !newPassword || newPassword !== confirmNewPassword}
                          className={`bg-gradient-to-r ${colors.gradient} text-white`}
                        >
                          {isChangingPassword ? 'Updating...' : 'Update Password'}
                        </Button>
                        <Button
                          onClick={() => {
                            setShowChangePassword(false)
                            setCurrentPassword('')
                            setNewPassword('')
                            setConfirmNewPassword('')
                          }}
                          variant="outline"
                          disabled={isChangingPassword}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delete Account */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all p-6 border border-red-200 hover:border-red-300">
                  <h2 className="text-xl font-semibold text-red-600 mb-4">Zone de Danger</h2>

                  {!showDeleteConfirm ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-4">
                        Une fois votre compte supprimé, il n'y a pas de retour en arrière possible.
                      </p>
                      <Button
                        onClick={() => setShowDeleteConfirm(true)}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50 rounded-full flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer mon compte
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 rounded-2xl space-y-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-900 mb-1">
                            Êtes-vous absolument sûr ?
                          </p>
                          <p className="text-sm text-red-700 mb-2">
                            Cette action est irréversible. Cela supprimera définitivement votre compte et toutes vos données.
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-red-900 mb-2">
                          Tapez <span className="font-mono font-bold">DELETE</span> pour confirmer
                        </label>
                        <Input
                          type="text"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          placeholder="DELETE"
                          disabled={isDeletingAccount}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleDeleteAccount}
                          disabled={isDeletingAccount || deleteConfirmText !== 'DELETE'}
                          className="bg-red-600 hover:bg-red-700 text-white rounded-full"
                        >
                          {isDeletingAccount ? 'Deleting...' : 'Delete My Account'}
                        </Button>
                        <Button
                          onClick={() => {
                            setShowDeleteConfirm(false)
                            setDeleteConfirmText('')
                          }}
                          variant="outline"
                          disabled={isDeletingAccount}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
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
            <AlertDialogTitle className="text-gray-900">Réinitialiser l'Onboarding</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Cela réinitialisera votre progression d'onboarding. Vos informations de profil seront préservées.
              Êtes-vous sûr de vouloir continuer ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-100">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmResetOnboarding}
              className={`bg-gradient-to-r ${colors.gradient} text-white`}
            >
              Réinitialiser
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
