'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/auth/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Mail, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useLanguage } from '@/lib/i18n/use-language'
import { getHookTranslation } from '@/lib/i18n/get-language'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function ForgotPasswordPage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error(t('auth.forgotPassword.errors.invalidEmail'))
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        // FIXME: Use logger.error('Password reset error:', error)
        // For security reasons, we still show success even if email doesn't exist
        // This prevents email enumeration attacks
      }

      // Always show success message
      setEmailSent(true)
      toast.success(t('auth.forgotPassword.errors.linkSent'), {
        description: t('auth.forgotPassword.errors.checkEmailDescription'),
      })
    } catch (error: any) {
      // FIXME: Use logger.error('Unexpected error:', error)
      toast.error(getHookTranslation('forgotPassword', 'unexpectedError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/auth" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>{t('auth.forgotPassword.backToLogin')}</span>
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
          {!emailSent ? (
            /* Reset Form */
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
              {/* Title */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#4A148C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-[#4A148C]" />
                </div>
                <h1 className="text-3xl font-bold text-[#4A148C] mb-2">
                  {t('auth.forgotPassword.title')}
                </h1>
                <p className="text-gray-600">
                  {t('auth.forgotPassword.subtitle')}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('auth.forgotPassword.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('auth.forgotPassword.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 pr-4 py-6 rounded-full border-2 border-gray-300 focus:border-[#4A148C] focus:ring-0"
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FFD600] hover:bg-[#F57F17] text-black font-semibold py-6 rounded-full transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingHouse size={20} />
                      <span>{t('auth.forgotPassword.sending')}</span>
                    </div>
                  ) : (
                    t('auth.forgotPassword.sendButton')
                  )}
                </Button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {t('auth.forgotPassword.rememberPassword')}{' '}
                  <Link
                    href="/auth"
                    className="text-[#4A148C] hover:text-[#311B92] font-semibold"
                  >
                    {t('auth.forgotPassword.loginLink')}
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            /* Success Message */
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('auth.forgotPassword.success.title')}
                </h1>
                <p className="text-gray-600 mb-6">
                  {t('auth.forgotPassword.success.subtitle')}{' '}
                  <span className="font-semibold text-gray-900">{email}</span>
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-left">
                  <p className="text-sm text-blue-900 mb-2 font-medium">
                    {t('auth.forgotPassword.success.nextSteps')}
                  </p>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>{t('auth.forgotPassword.success.step1')}</li>
                    <li>{t('auth.forgotPassword.success.step2')}</li>
                    <li>{t('auth.forgotPassword.success.step3')}</li>
                  </ol>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  {t('auth.forgotPassword.success.noEmail')}{' '}
                  <button
                    onClick={() => setEmailSent(false)}
                    className="text-[#4A148C] hover:text-[#311B92] font-semibold underline"
                  >
                    {t('auth.forgotPassword.success.tryAgain')}
                  </button>
                </p>
                <Link
                  href="/auth"
                  className="inline-block w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-full transition-colors"
                >
                  {t('auth.forgotPassword.success.backToLogin')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
