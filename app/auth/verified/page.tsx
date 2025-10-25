'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check } from 'lucide-react'

export default function EmailVerifiedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(3)

  const next = searchParams.get('next') || '/profile'

  useEffect(() => {
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          router.push(next)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownInterval)
  }, [router, next])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="text-2xl font-bold">
            <span className="text-[#4A148C]">EASY</span>
            <span className="text-[#FFD600]">Co</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 border border-gray-100 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Email Verified!
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            Your email address has been successfully verified. You now have full access to your EasyCo account.
          </p>

          {/* Countdown */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <p className="text-sm text-gray-600">
              Redirecting in <span className="font-bold text-[#4A148C]">{countdown}</span> second{countdown !== 1 ? 's' : ''}...
            </p>
          </div>

          {/* Manual Redirect Button */}
          <button
            onClick={() => router.push(next)}
            className="text-sm text-[#4A148C] hover:text-[#311B92] font-semibold underline"
          >
            Click here if not redirected
          </button>
        </div>
      </main>
    </div>
  )
}
