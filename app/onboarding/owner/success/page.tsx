'use client';

import Link from 'next/link';
import { CheckCircle, Home, ArrowRight } from 'lucide-react';

export default function OwnerSuccess() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[color:var(--easy-purple)] flex items-center justify-center">
            <Home className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[color:var(--easy-purple)]">EasyCo</h1>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Profile Created Successfully!</h2>
        <p className="text-gray-600 mb-8">
          Welcome to EasyCo! Your host profile is now active. Ready to add your first property listing?
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="text-2xl font-bold text-[color:var(--easy-purple)]">3x</div>
            <div className="text-sm text-gray-600">More inquiries with complete listings</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="text-2xl font-bold text-yellow-600">Fast</div>
            <div className="text-sm text-gray-600">List in under 5 minutes</div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-3">
          <Link
            href="/dashboard/owner"
            className="flex items-center justify-center gap-2 w-full bg-[color:var(--easy-purple)] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/"
            className="block w-full border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Help Link */}
        <p className="mt-6 text-sm text-gray-500">
          Need help?{' '}
          <a href="mailto:support@easyco.com" className="text-[color:var(--easy-purple)] hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </main>
  );
}
