'use client';

import Link from 'next/link';
import { CheckCircle2, Home } from 'lucide-react';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-14 h-14 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-[color:var(--easy-purple)]">
            Profile Created!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for completing the onboarding
          </p>
        </div>

        {/* Info card */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-green-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">What happens next?</h2>
          <ul className="text-left text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Your profile has been saved successfully</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>We'll use your answers to find compatible matches</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>You can update your preferences anytime</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Link
            href="/dashboard/searcher"
            className="block w-full py-4 rounded-full bg-[color:var(--easy-yellow)] text-black font-semibold text-lg hover:opacity-90 transition shadow-md hover:shadow-lg"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:border-[color:var(--easy-purple)] hover:text-[color:var(--easy-purple)] transition"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-sm text-gray-400">
          Your response has been recorded. Thank you for participating in our test!
        </p>
      </div>
    </main>
  );
}
