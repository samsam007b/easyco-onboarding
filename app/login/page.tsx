'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/auth/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useLanguage } from '@/lib/i18n/use-language'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const supabase = createClient()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error(t('auth.login.errors.invalidEmail'))
      return
    }

    if (!password) {
      toast.error(t('auth.login.errors.enterPassword'))
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error(t('auth.login.errors.invalidCredentials'))
        } else if (error.message.includes('Email not confirmed')) {
          toast.error(t('auth.login.errors.emailNotConfirmed'), {
            description: t('auth.login.errors.checkInbox'),
          })
        } else {
          toast.error(error.message)
        }
        return
      }

      if (data.user) {
        toast.success(t('auth.login.success.welcomeBack'))

        // Get user type from profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('user_type')
          .eq('user_id', data.user.id)
          .single()

        const userType = profile?.user_type

        // Redirect based on user type
        if (userType === 'searcher') {
          router.push('/dashboard/searcher')
        } else if (userType === 'owner') {
          router.push('/dashboard/owner')
        } else if (userType === 'resident') {
          router.push('/dashboard/resident')
        } else {
          router.push('/select-user-type')
        }
      }
    } catch (error: any) {
      toast.error('An error occurred', {
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(t('auth.login.errors.googleFailed'), {
          description: error.message,
        })
        setIsGoogleLoading(false)
      }
      // If successful, user will be redirected to Google
    } catch (error: any) {
      toast.error('An error occurred', {
        description: error.message,
      })
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center">
        <Link href="/" className="inline-flex items-center gap-2 text-[#4A148C] hover:text-[#311B92] transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">{t('auth.login.backToHome')}</span>
        </Link>
        <LanguageSwitcher />
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#4A148C] mb-2">{t('auth.login.title')}</h1>
            <p className="text-gray-600">{t('auth.login.subtitle')}</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            {/* Google OAuth Button */}
            <Button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              variant="outline"
              className="w-full mb-6"
            >
              {isGoogleLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#4A148C] border-t-transparent rounded-full animate-spin mr-2" />
                  {t('auth.login.signingInGoogle')}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {t('auth.login.googleButton')}
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">{t('auth.login.divider')}</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.login.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.login.emailPlaceholder')}
                    className="pl-12"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.login.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.login.passwordPlaceholder')}
                    className="pl-12 pr-12"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#4A148C] border-gray-300 rounded focus:ring-[#4A148C]"
                  />
                  <span className="text-sm text-gray-600">{t('auth.login.remember')}</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#4A148C] hover:text-[#311B92] font-semibold"
                >
                  {t('auth.login.forgotPassword')}
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {t('auth.login.signingIn')}
                  </>
                ) : (
                  t('auth.login.loginButton')
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t('auth.login.noAccount')}{' '}
                <Link href="/signup" className="text-[#4A148C] hover:text-[#311B92] font-semibold">
                  {t('auth.login.signupLink')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
