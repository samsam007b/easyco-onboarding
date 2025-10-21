'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Sparkles } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';

export default function PrivacyPage() {
  const router = useRouter();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [readPrivacy, setReadPrivacy] = useState(false);
  const [consentData, setConsentData] = useState(false);
  const [agreeMatching, setAgreeMatching] = useState(false);

  const handleFinish = () => {
    // Save privacy consents
    safeLocalStorage.set('privacy', JSON.stringify({
      acceptTerms,
      readPrivacy,
      consentData,
      agreeMatching,
      timestamp: new Date().toISOString(),
    }));

    // Navigate to preferences (budget, location, etc.)
    router.push('/onboarding/searcher/preferences');
  };

  const canContinue = acceptTerms && readPrivacy && consentData;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[color:var(--easy-purple)] w-5/6 transition-all" />
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-[color:var(--easy-purple)] hover:opacity-70 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-[color:var(--easy-purple)]" />
          </div>
          <h1 className="text-2xl font-bold text-[color:var(--easy-purple)] mb-2">
            Privacy & Confirmation
          </h1>
          <p className="text-gray-600">
            We take your privacy seriously.
          </p>
        </div>

        {/* Privacy consents */}
        <div className="space-y-4 mb-6">

          {/* Terms & Conditions */}
          <label className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-200 cursor-pointer hover:border-[color:var(--easy-purple)] transition">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 w-5 h-5 text-[color:var(--easy-purple)] rounded focus:ring-2 focus:ring-purple-100"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 flex items-center gap-1">
                I accept the Terms & Conditions
                <span className="text-red-500">*</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Review our{' '}
                <a href="/terms" className="text-[color:var(--easy-purple)] underline">
                  terms of service
                </a>
              </p>
            </div>
          </label>

          {/* Privacy Policy */}
          <label className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-200 cursor-pointer hover:border-[color:var(--easy-purple)] transition">
            <input
              type="checkbox"
              checked={readPrivacy}
              onChange={(e) => setReadPrivacy(e.target.checked)}
              className="mt-0.5 w-5 h-5 text-[color:var(--easy-purple)] rounded focus:ring-2 focus:ring-purple-100"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 flex items-center gap-1">
                I have read the Privacy Policy
                <span className="text-red-500">*</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Learn how we protect your{' '}
                <a href="/privacy" className="text-[color:var(--easy-purple)] underline">
                  personal data
                </a>
              </p>
            </div>
          </label>

          {/* Data processing */}
          <label className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-200 cursor-pointer hover:border-[color:var(--easy-purple)] transition">
            <input
              type="checkbox"
              checked={consentData}
              onChange={(e) => setConsentData(e.target.checked)}
              className="mt-0.5 w-5 h-5 text-[color:var(--easy-purple)] rounded focus:ring-2 focus:ring-purple-100"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 flex items-center gap-1">
                I consent to data processing
                <span className="text-red-500">*</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Required to create your profile and find matches. Your data will be processed securely according to GDPR.
              </p>
            </div>
          </label>

          {/* Algorithmic matching (optional) */}
          <label className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 border-2 border-yellow-200 cursor-pointer hover:border-yellow-300 transition">
            <input
              type="checkbox"
              checked={agreeMatching}
              onChange={(e) => setAgreeMatching(e.target.checked)}
              className="mt-0.5 w-5 h-5 text-[color:var(--easy-purple)] rounded focus:ring-2 focus:ring-purple-100"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-600" />
                I agree to algorithmic matching
                <span className="text-xs text-gray-500">(Optional)</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Our smart algorithm will suggest the best roommate matches based on compatibility. Highly recommended!
              </p>
            </div>
          </label>
        </div>

        {/* Privacy notice */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 mb-8">
          <p className="text-sm text-gray-700">
            <strong>Your privacy matters:</strong> We never share your personal information with third parties without consent. You can request data deletion at any time.
          </p>
        </div>

        {/* Finish button */}
        <button
          onClick={handleFinish}
          disabled={!canContinue}
          className={`w-full py-4 rounded-full font-semibold text-lg transition shadow-md ${
            canContinue
              ? 'bg-[color:var(--easy-yellow)] text-black hover:opacity-90 hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Preferences
        </button>
      </div>
    </main>
  );
}
