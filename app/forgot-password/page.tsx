'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/auth/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Mail, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        console.error('Password reset error:', error)
        // For security reasons, we still show success even if email doesn't exist
        // This prevents email enumeration attacks
      }

      // Always show success message
      setEmailSent(true)
      toast.success('Password reset link sent!', {
        description: 'Check your email for further instructions',
      })
    } catch (error: any) {
      console.error('Unexpected error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/login" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to login</span>
          </Link>
          <div className="text-2xl font-bold">
            <span className="text-[#4A148C]">EASY</span>
            <span className="text-[#FFD600]">Co</span>
          </div>
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
                  Forgot Password?
                </h1>
                <p className="text-gray-600">
                  No worries! Enter your email and we'll send you reset instructions
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
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
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Remember your password?{' '}
                  <Link
                    href="/login"
                    className="text-[#4A148C] hover:text-[#311B92] font-semibold"
                  >
                    Log in
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
                  Check Your Email
                </h1>
                <p className="text-gray-600 mb-6">
                  We've sent password reset instructions to{' '}
                  <span className="font-semibold text-gray-900">{email}</span>
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-left">
                  <p className="text-sm text-blue-900 mb-2 font-medium">
                    What's next?
                  </p>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Check your email inbox</li>
                    <li>Click the password reset link</li>
                    <li>Create a new password</li>
                  </ol>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => setEmailSent(false)}
                    className="text-[#4A148C] hover:text-[#311B92] font-semibold underline"
                  >
                    try again
                  </button>
                </p>
                <Link
                  href="/login"
                  className="inline-block w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-full transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
