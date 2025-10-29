'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/auth/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { useLanguage } from '@/lib/i18n/use-language'
import LanguageSwitcher from '@/components/LanguageSwitcher'

type UserType = 'searcher' | 'owner' | 'resident'

export default function SignupPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [userType, setUserType] = useState<UserType>('searcher')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const supabase = createClient()

  // Password strength validation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: '', color: '' }

    let strength = 0
    if (pwd.length >= 8) strength++
    if (pwd.length >= 12) strength++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++

    if (strength <= 2) return { strength, label: t('auth.signup.weak'), color: 'bg-red-500' }
    if (strength <= 3) return { strength, label: t('auth.signup.medium'), color: 'bg-yellow-500' }
    return { strength, label: t('auth.signup.strong'), color: 'bg-green-500' }
  }

  const passwordStrength = getPasswordStrength(password)

  // Password requirements
  const requirements = [
    { met: password.length >= 8, text: t('auth.signup.requirements.length') },
    { met: /[A-Z]/.test(password), text: t('auth.signup.requirements.uppercase') },
    { met: /[a-z]/.test(password), text: t('auth.signup.requirements.lowercase') },
    { met: /[0-9]/.test(password), text: t('auth.signup.requirements.number') },
  ]

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!fullName.trim()) {
      toast.error(t('auth.signup.errors.enterName'))
      return
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error(t('auth.signup.errors.invalidEmail'))
      return
    }

    if (password.length < 8) {
      toast.error(t('auth.signup.errors.passwordLength'))
      return
    }

    if (password !== confirmPassword) {
      toast.error(t('auth.signup.errors.passwordsDontMatch'))
      return
    }

    if (!agreedToTerms) {
      toast.error(t('auth.signup.errors.agreeToTerms'))
      return
    }

    setIsLoading(true)

    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error(t('auth.signup.errors.emailAlreadyRegistered'), {
            description: t('auth.signup.errors.tryLogin'),
            action: {
              label: t('auth.signup.errors.goToLogin'),
              onClick: () => router.push('/login'),
            },
          })
        } else {
          toast.error(error.message)
        }
        return
      }

      if (data.user) {
        // Update the users table with full name
        await supabase
          .from('users')
          .update({
            full_name: fullName,
            user_type: userType
          })
          .eq('id', data.user.id)

        toast.success(t('auth.signup.success.accountCreated'), {
          description: t('auth.signup.success.checkEmail'),
        })

        // Redirect to a "check your email" page or login
        router.push('/login?verified=false')
      }
    } catch (error: any) {
      // FIXME: Use logger.error('Signup error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    if (!agreedToTerms) {
      toast.error(t('auth.signup.errors.agreeToTerms'))
      return
    }

    setIsGoogleLoading(true)

    try {
      // Store user type in localStorage before OAuth redirect
      localStorage.setItem('easyco_pending_user_type', userType)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error('Failed to connect with Google')
        setIsGoogleLoading(false)
        // Clean up localStorage on error
        localStorage.removeItem('easyco_pending_user_type')
      }
      // If successful, user will be redirected to Google
    } catch (error) {
      // FIXME: Use logger.error('Google signup error:', error)
      toast.error('An unexpected error occurred')
      setIsGoogleLoading(false)
      // Clean up localStorage on error
      localStorage.removeItem('easyco_pending_user_type')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>{t('auth.signup.backToHome')}</span>
          </Link>
          <div className="text-2xl font-bold">
            <span className="text-[#4A148C]">EASY</span>
            <span className="text-[#FFD600]">Co</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-[#4A148C] mb-2">
                {t('auth.signup.title')}
              </h1>
              <p className="text-gray-600">
                {t('auth.signup.subtitle')}
              </p>
            </div>

            {/* User Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('auth.signup.userTypeLabel')}
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('searcher')}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    userType === 'searcher'
                      ? 'border-[#4A148C] bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={isLoading || isGoogleLoading}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">🔍</div>
                    <div className="font-semibold text-sm">{t('auth.signup.searcher')}</div>
                    <div className="text-xs text-gray-500 mt-1">{t('auth.signup.searcherLabel')}</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('owner')}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    userType === 'owner'
                      ? 'border-[#4A148C] bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={isLoading || isGoogleLoading}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">🏠</div>
                    <div className="font-semibold text-sm">{t('auth.signup.owner')}</div>
                    <div className="text-xs text-gray-500 mt-1">{t('auth.signup.ownerLabel')}</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('resident')}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    userType === 'resident'
                      ? 'border-[#4A148C] bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={isLoading || isGoogleLoading}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">👥</div>
                    <div className="font-semibold text-sm">{t('auth.signup.resident')}</div>
                    <div className="text-xs text-gray-500 mt-1">{t('auth.signup.residentLabel')}</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Google Sign Up */}
            <Button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isGoogleLoading || isLoading}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-full py-6 mb-6 flex items-center justify-center gap-3 font-medium"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span>{t('auth.signup.googleButton')}</span>
            </Button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">{t('auth.signup.divider')}</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailSignup} className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.signup.fullName')}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder={t('auth.signup.fullNamePlaceholder')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-12 pr-4 py-6 rounded-full border-2 border-gray-300 focus:border-[#4A148C] focus:ring-0"
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.signup.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.signup.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 pr-4 py-6 rounded-full border-2 border-gray-300 focus:border-[#4A148C] focus:ring-0"
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.signup.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.signup.passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 py-6 rounded-full border-2 border-gray-300 focus:border-[#4A148C] focus:ring-0"
                    disabled={isLoading || isGoogleLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength */}
                {password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">{t('auth.signup.passwordStrength')}</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength.label === t('auth.signup.weak') ? 'text-red-600' :
                        passwordStrength.label === t('auth.signup.medium') ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full ${
                            i <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                {password && (
                  <div className="mt-3 space-y-1">
                    {requirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        {req.met ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-gray-300" />
                        )}
                        <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.signup.confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('auth.signup.passwordPlaceholder')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 pr-12 py-6 rounded-full border-2 border-gray-300 focus:border-[#4A148C] focus:ring-0"
                    disabled={isLoading || isGoogleLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                    <X className="w-3 h-3" />
                    {t('auth.signup.passwordsDontMatch')}
                  </p>
                )}
                {confirmPassword && password === confirmPassword && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {t('auth.signup.passwordsMatch')}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 mt-1 rounded border-gray-300 text-[#4A148C] focus:ring-[#4A148C]"
                    disabled={isLoading || isGoogleLoading}
                  />
                  <span className="text-sm text-gray-600">
                    {t('auth.signup.termsAgree')}{' '}
                    <Link href="/legal/terms" className="text-[#4A148C] hover:underline">
                      {t('auth.signup.termsLink')}
                    </Link>
                    {' '}{t('auth.signup.and')}{' '}
                    <Link href="/legal/privacy" className="text-[#4A148C] hover:underline">
                      {t('auth.signup.privacyLink')}
                    </Link>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || isGoogleLoading || !agreedToTerms}
                className="w-full bg-[#FFD600] hover:bg-[#F57F17] text-black font-semibold py-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>{t('auth.signup.creatingAccount')}</span>
                  </div>
                ) : (
                  t('auth.signup.signupButton')
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {t('auth.signup.haveAccount')}{' '}
                <Link
                  href="/login"
                  className="text-[#4A148C] hover:text-[#311B92] font-semibold"
                >
                  {t('auth.signup.loginLink')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
