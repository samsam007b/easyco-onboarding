'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { User, Mail, Lock, LogOut, Trash2, Camera, Check, X, Eye, EyeOff, AlertCircle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

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
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [fullName, setFullName] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [isSavingName, setIsSavingName] = useState(false)

  // User type change
  const [selectedUserType, setSelectedUserType] = useState('')
  const [isChangingUserType, setIsChangingUserType] = useState(false)

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
          console.error('Error fetching user data:', error)
          toast.error('Failed to load profile')
          return
        }

        setUserData(data)
        setFullName(data.full_name || '')
        setSelectedUserType(data.user_type)
      } catch (error) {
        console.error('Error:', error)
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
        console.error('Error updating name:', error)
        toast.error('Failed to update name')
        return
      }

      setUserData({ ...userData, full_name: fullName })
      setIsEditingName(false)
      toast.success('Name updated successfully')
    } catch (error) {
      console.error('Error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSavingName(false)
    }
  }

  // Change user type
  const handleChangeUserType = async () => {
    if (!userData) return

    if (selectedUserType === userData.user_type) {
      toast.error('Please select a different role')
      return
    }

    // Confirm role change with user
    if (!confirm(`Are you sure you want to change your role from ${userData.user_type} to ${selectedUserType}? This will reset your onboarding progress and you'll need to complete the onboarding process again.`)) {
      return
    }

    setIsChangingUserType(true)

    try {
      // Update user_type and reset onboarding
      const { error } = await supabase
        .from('users')
        .update({
          user_type: selectedUserType,
          onboarding_completed: false
        })
        .eq('id', userData.id)

      if (error) {
        console.error('Error updating user type:', error)
        toast.error('Failed to change role')
        return
      }

      toast.success('Role changed successfully! Redirecting to onboarding...')

      // Redirect to new onboarding
      setTimeout(() => {
        router.push(`/onboarding/${selectedUserType}/basic-info`)
      }, 1000)
    } catch (error) {
      console.error('Error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsChangingUserType(false)
    }
  }

  // Reset onboarding
  const handleResetOnboarding = async () => {
    if (!userData) return

    if (!confirm('This will reset your onboarding progress. Continue?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ onboarding_completed: false })
        .eq('id', userData.id)

      if (error) throw error

      toast.success('Onboarding reset! Redirecting...')

      setTimeout(() => {
        router.push(`/onboarding/${userData.user_type}/basic-info`)
      }, 1000)
    } catch (error) {
      console.error('Error:', error)
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
        console.error('Error updating password:', updateError)
        toast.error('Failed to update password')
        return
      }

      toast.success('Password updated successfully')
      setShowChangePassword(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (error) {
      console.error('Error:', error)
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
      console.error('Error:', error)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold">
            <span className="text-[#4A148C]">EASY</span>
            <span className="text-[#FFD600]">Co</span>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 rounded-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#4A148C]">Profile Settings</h1>
          <Button
            onClick={() => router.push(`/dashboard/${userData.user_type}`)}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Picture</h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                {userData.avatar_url ? (
                  <img
                    src={userData.avatar_url}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#4A148C]/10 flex items-center justify-center">
                    <User className="w-12 h-12 text-[#4A148C]" />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#FFD600] rounded-full flex items-center justify-center hover:bg-[#F57F17] transition-colors">
                  <Camera className="w-4 h-4 text-black" />
                </button>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Upload a profile picture (coming soon)
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>
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
                    onClick={handleChangeUserType}
                    disabled={isChangingUserType || selectedUserType === userData.user_type}
                  >
                    {isChangingUserType ? 'Changing...' : 'Change Role'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Changing your role will reset your onboarding progress.
                </p>
              </div>

              {userData.onboarding_completed && (
                <div className="pt-4 border-t border-gray-100">
                  <Button
                    onClick={handleResetOnboarding}
                    variant="outline"
                    className="flex items-center gap-2"
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
    </div>
  )
}
