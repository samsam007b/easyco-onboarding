'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { User, Mail, Lock, LogOut, Trash2, Camera, Check, X, Eye, EyeOff, AlertCircle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import RoleSwitchModal from '@/components/RoleSwitchModal'
import { useRole } from '@/lib/role/role-context'
import ProfilePictureUpload from '@/components/ProfilePictureUpload'
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

const USER_TYPES = [
  { value: 'searcher', label: 'Searcher (looking for a place)' },
  { value: 'owner', label: 'Owner (have properties to rent)' },
  { value: 'resident', label: 'Resident (currently renting)' },
]

export default function ProfilePage() {
  const router = useRouter()
  const { activeRole } = useRole()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [fullName, setFullName] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [isSavingName, setIsSavingName] = useState(false)

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
          // FIXME: Use logger.error('Error fetching user data:', error)
          toast.error('Failed to load profile')
          return
        }

        setUserData(data)
        setFullName(data.full_name || '')
        setSelectedUserType(data.user_type)
      } catch (error) {
        // FIXME: Use logger.error('Error:', error)
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
        // FIXME: Use logger.error('Error updating name:', error)
        toast.error('Failed to update name')
        return
      }

      setUserData({ ...userData, full_name: fullName })
      setIsEditingName(false)
      toast.success('Name updated successfully')
    } catch (error) {
      // FIXME: Use logger.error('Error:', error)
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
      // Check if user has profile data for the new role
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userData.id)
        .single()

      // Check if onboarding is completed for new role
      // We'll check this by looking if key fields for that role exist
      let hasCompletedNewRoleOnboarding = false

      if (selectedUserType === 'searcher') {
        hasCompletedNewRoleOnboarding = !!(profileData?.first_name && profileData?.date_of_birth && profileData?.budget_min)
      } else if (selectedUserType === 'owner') {
        hasCompletedNewRoleOnboarding = !!(profileData?.first_name && profileData?.phone_number && profileData?.owner_type)
      } else if (selectedUserType === 'resident') {
        hasCompletedNewRoleOnboarding = !!(profileData?.first_name && profileData?.current_city && profileData?.bio)
      }

      // Update user_type (keep all profile data intact!)
      const { error } = await supabase
        .from('users')
        .update({
          user_type: selectedUserType,
          // Only mark onboarding as incomplete if they haven't completed it for this role
          onboarding_completed: hasCompletedNewRoleOnboarding
        })
        .eq('id', userData.id)

      if (error) {
        // FIXME: Use logger.error('Error updating user type:', error)
        toast.error('Failed to change role')
        return
      }

      toast.success('Role switched successfully!')

      // Redirect based on onboarding status
      setTimeout(() => {
        if (hasCompletedNewRoleOnboarding) {
          router.push(`/dashboard/${selectedUserType}`)
        } else {
          // Searcher onboarding starts with profile-type to ask if searching for self or dependent
          if (selectedUserType === 'searcher') {
            router.push('/onboarding/searcher/profile-type')
          } else {
            router.push(`/onboarding/${selectedUserType}/basic-info`)
          }
        }
      }, 1000)
    } catch (error) {
      // FIXME: Use logger.error('Error:', error)
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
        // Searcher onboarding starts with profile-type
        if (userData.user_type === 'searcher') {
          router.push('/onboarding/searcher/profile-type')
        } else {
          router.push(`/onboarding/${userData.user_type}/basic-info`)
        }
      }, 1000)
    } catch (error) {
      // FIXME: Use logger.error('Error:', error)
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
      // Verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData!.email,
        password: currentPassword,
      })

      if (signInError) {
        toast.error('Current password is incorrect')
        setIsChangingPassword(false)
        return
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        // FIXME: Use logger.error('Error updating password:', updateError)
        toast.error('Failed to update password')
        return
      }

      toast.success('Password updated successfully')
      setShowChangePassword(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (error) {
      // FIXME: Use logger.error('Error:', error)
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
      // Call API route to delete account (uses service role key)
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
      // FIXME: Use logger.error('Error:', error)
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4A148C] border-t-transparent rounded-full animate-spin" />
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
      gradient: 'from-purple-50 via-white to-purple-50/30',
      primary: 'purple',
      header: 'bg-purple-50/95 border-purple-200/50'
    }
    if (role === 'resident') return {
      gradient: 'from-orange-50 via-white to-orange-50/30',
      primary: 'orange',
      header: 'bg-orange-50/95 border-orange-200/50'
    }
    return {
      gradient: 'from-yellow-50 via-white to-yellow-50/30',
      primary: 'yellow',
      header: 'bg-yellow-50/95 border-yellow-200/50'
    }
  }

  const colors = getRoleColors()

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.gradient}`}>
      {/* Header with glassmorphism */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl ${colors.header} border-b`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
              <p className="text-sm text-gray-600 capitalize">{userData.user_type}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  const role = activeRole || userData?.user_type || 'searcher'
                  router.push(`/dashboard/${role}`)
                }}
                variant="outline"
                className="rounded-full"
              >
                Retour au Dashboard
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="flex items-center gap-2 rounded-full"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Enhance Profile Card */}
          <div className="lg:col-span-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl shadow-xl p-8 text-white">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Perfectionne ton profil</h2>
                <p className="text-purple-100 text-sm">
                  Augmente tes chances de matching en complétant ton profil à 100%
                </p>
              </div>
              <div className="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                <span className="text-white font-bold">
                  {userData.onboarding_completed ? '100%' : '50%'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <Button
                onClick={() => router.push(`/profile/enhance-${userData.user_type}`)}
                className="bg-white text-purple-700 hover:bg-white/90 rounded-full font-semibold"
              >
                Perfectionner mon profil
              </Button>
              {userData.onboarding_completed && (
                <Button
                  onClick={handleResetOnboarding}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refaire l'onboarding
                </Button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Statut du compte</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email vérifié</span>
                {userData.email_verified ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <X className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Onboarding</span>
                {userData.onboarding_completed ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <X className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Photo de profil</span>
                {userData.avatar_url ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <X className="w-5 h-5 text-red-600" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Picture</h2>
            <ProfilePictureUpload
              userId={userData.id}
              currentAvatarUrl={userData.avatar_url || undefined}
              onUploadSuccess={async (url) => {
                // Refresh user data after upload
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

          {/* Personal Information */}
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
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
                      className="text-[#4A148C] hover:text-[#311B92]"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{userData.email}</span>
                  </div>
                  {userData.email_verified ? (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <Check className="w-4 h-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-yellow-600">
                      <AlertCircle className="w-4 h-4" />
                      Not verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Role Management */}
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Role</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Role
                </label>
                <div className="p-4 bg-purple-50 rounded-2xl">
                  <span className="text-gray-900 capitalize font-medium">{userData.user_type}</span>
                  {userData.onboarding_completed && (
                    <span className="ml-3 text-xs text-green-600">
                      <Check className="w-3 h-3 inline mr-1" />
                      Onboarding completed
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Change Role
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
                  >
                    Change Role
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Your data is preserved when switching roles. You can always switch back.
                </p>
              </div>

              {userData.onboarding_completed && (
                <div className="pt-4 border-t border-gray-100">
                  <Button
                    onClick={handleResetOnboarding}
                    variant="outline"
                    className="flex items-center gap-2 border-[#4A148C] text-[#4A148C] hover:bg-[#4A148C] hover:text-white transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Redo Onboarding
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Security - Same as before */}
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Security</h2>

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
                {/* Password change form - keeping the same as before */}
                <h3 className="font-medium text-gray-900">Change Password</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
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
                    New Password
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
                    Confirm New Password
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

          {/* Danger Zone - Same but with new API */}
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-red-200">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>

            {!showDeleteConfirm ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 rounded-full flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </Button>
              </div>
            ) : (
              <div className="p-4 bg-red-50 rounded-2xl space-y-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900 mb-1">
                      Are you absolutely sure?
                    </p>
                    <p className="text-sm text-red-700 mb-2">
                      This action cannot be undone. This will permanently delete your account and remove all your data.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-red-900 mb-2">
                    Type <span className="font-mono font-bold">DELETE</span> to confirm
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
        </div>
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
            <AlertDialogTitle className="text-gray-900">Reset Onboarding Progress</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This will reset your onboarding progress and redirect you to the beginning of the onboarding process.
              All your profile information will be preserved, but you'll need to go through the onboarding steps again.
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-100">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmResetOnboarding}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Reset Onboarding
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
