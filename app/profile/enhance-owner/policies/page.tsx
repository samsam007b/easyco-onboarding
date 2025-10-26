'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, PawPrint, Cigarette, Calendar, Euro } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';

export default function OwnerPoliciesPage() {
  const router = useRouter();
  const [petsAllowed, setPetsAllowed] = useState<boolean | null>(null);
  const [smokingAllowed, setSmokingAllowed] = useState<boolean | null>(null);
  const [minimumLeaseDuration, setMinimumLeaseDuration] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');

  const handleContinue = () => {
    safeLocalStorage.set('ownerPolicies', {
      petsAllowed,
      smokingAllowed,
      minimumLeaseDuration,
      depositAmount,
      noticePeriod,
    });

    router.push('/profile/enhance-owner/services');
  };

  const handleSkip = () => {
    router.push('/profile/enhance-owner/services');
  };

  const canContinue = petsAllowed !== null && smokingAllowed !== null;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[color:var(--easy-purple)]">Step 2 of 4</span>
            <span className="text-sm text-gray-500">Tenant Policies</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[color:var(--easy-purple)] h-2 rounded-full" style={{ width: '50%' }} />
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[color:var(--easy-purple)] mb-2">
            Your Rental Policies
          </h1>
          <p className="text-gray-600">
            Set clear expectations for potential tenants
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Pets Policy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <PawPrint className="w-4 h-4 text-orange-600" />
              </div>
              Do you allow pets?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPetsAllowed(true)}
                className={`p-4 rounded-xl border-2 transition ${
                  petsAllowed === true
                    ? 'border-[color:var(--easy-purple)] bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-2xl mb-1">🐕</div>
                <div className={`text-sm font-semibold ${
                  petsAllowed === true ? 'text-[color:var(--easy-purple)]' : 'text-gray-900'
                }`}>
                  Yes, pets allowed
                </div>
              </button>
              <button
                onClick={() => setPetsAllowed(false)}
                className={`p-4 rounded-xl border-2 transition ${
                  petsAllowed === false
                    ? 'border-[color:var(--easy-purple)] bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-2xl mb-1">🚫</div>
                <div className={`text-sm font-semibold ${
                  petsAllowed === false ? 'text-[color:var(--easy-purple)]' : 'text-gray-900'
                }`}>
                  No pets
                </div>
              </button>
            </div>
          </div>

          {/* Smoking Policy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <Cigarette className="w-4 h-4 text-red-600" />
              </div>
              Do you allow smoking?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSmokingAllowed(true)}
                className={`p-4 rounded-xl border-2 transition ${
                  smokingAllowed === true
                    ? 'border-[color:var(--easy-purple)] bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-2xl mb-1">✅</div>
                <div className={`text-sm font-semibold ${
                  smokingAllowed === true ? 'text-[color:var(--easy-purple)]' : 'text-gray-900'
                }`}>
                  Smoking allowed
                </div>
              </button>
              <button
                onClick={() => setSmokingAllowed(false)}
                className={`p-4 rounded-xl border-2 transition ${
                  smokingAllowed === false
                    ? 'border-[color:var(--easy-purple)] bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-2xl mb-1">🚭</div>
                <div className={`text-sm font-semibold ${
                  smokingAllowed === false ? 'text-[color:var(--easy-purple)]' : 'text-gray-900'
                }`}>
                  Non-smoking
                </div>
              </button>
            </div>
          </div>

          {/* Minimum Lease Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              Minimum lease duration (optional)
            </label>
            <select
              value={minimumLeaseDuration}
              onChange={(e) => setMinimumLeaseDuration(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">No preference</option>
              <option value="1">1 month</option>
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
            </select>
          </div>

          {/* Deposit Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Euro className="w-4 h-4 text-green-600" />
              </div>
              Typical deposit (optional)
            </label>
            <select
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">Not specified</option>
              <option value="half-month">Half month's rent</option>
              <option value="1-month">1 month's rent</option>
              <option value="2-months">2 months' rent</option>
              <option value="negotiable">Negotiable</option>
            </select>
          </div>

          {/* Notice Period */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Shield className="w-4 h-4 text-yellow-600" />
              </div>
              Notice period for move-out (optional)
            </label>
            <select
              value={noticePeriod}
              onChange={(e) => setNoticePeriod(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">Not specified</option>
              <option value="1-month">1 month</option>
              <option value="2-months">2 months</option>
              <option value="3-months">3 months</option>
            </select>
          </div>

          {/* Info box */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-gray-700">
              <strong className="text-blue-800">Tip:</strong> Clear policies help attract the right tenants and avoid misunderstandings later.
            </p>
          </div>

        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-12">
          <button
            onClick={handleSkip}
            className="flex-1 py-4 rounded-full font-semibold text-lg transition border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Skip
          </button>
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`flex-1 py-4 rounded-full font-semibold text-lg transition shadow-md ${
              canContinue
                ? 'bg-[color:var(--easy-yellow)] text-black hover:opacity-90 hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}
