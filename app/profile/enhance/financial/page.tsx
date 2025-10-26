'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Euro, Shield, Briefcase } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';

export default function FinancialInfoPage() {
  const router = useRouter();
  const [incomeRange, setIncomeRange] = useState('');
  const [hasGuarantor, setHasGuarantor] = useState(false);
  const [employmentType, setEmploymentType] = useState('');

  const handleContinue = () => {
    // Save to localStorage
    safeLocalStorage.set('financialInfo', {
      incomeRange,
      hasGuarantor,
      employmentType,
    });

    // Navigate to next step (Community Events)
    router.push('/profile/enhance/community');
  };

  const handleSkip = () => {
    // Clear this section from localStorage
    safeLocalStorage.remove('financialInfo');
    // Navigate to next step
    router.push('/profile/enhance/community');
  };

  const canContinue = incomeRange && employmentType;

  const incomeRanges = [
    { value: 'under-1000', label: '< €1,000' },
    { value: '1000-1500', label: '€1,000 - €1,500' },
    { value: '1500-2000', label: '€1,500 - €2,000' },
    { value: '2000-3000', label: '€2,000 - €3,000' },
    { value: '3000-5000', label: '€3,000 - €5,000' },
    { value: 'over-5000', label: '> €5,000' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">

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
            Financial Information
          </h1>
          <p className="text-gray-600">
            Optional information to help landlords understand your financial situation.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Income range selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Euro className="w-4 h-4 text-green-600" />
              </div>
              Monthly income range
            </label>
            <div className="grid grid-cols-2 gap-3">
              {incomeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setIncomeRange(range.value)}
                  className={`px-4 py-3 rounded-xl font-medium transition border-2 ${
                    incomeRange === range.value
                      ? 'bg-[color:var(--easy-purple)] text-white border-[color:var(--easy-purple)]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[color:var(--easy-purple)]'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Guarantor toggle */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-700 block">I have a guarantor available</span>
                  <span className="text-sm text-gray-500">Someone who can vouch for rent payments</span>
                </div>
              </div>
              <button
                onClick={() => setHasGuarantor(!hasGuarantor)}
                className={`relative w-14 h-8 rounded-full transition flex-shrink-0 ${
                  hasGuarantor ? 'bg-[color:var(--easy-purple)]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                    hasGuarantor ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Employment type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-purple-600" />
              </div>
              Employment type
            </label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">Select...</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="freelance">Freelance</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="student">Student</option>
              <option value="unemployed">Unemployed</option>
            </select>
          </div>

          {/* Privacy notice */}
          <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Shield className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Your privacy matters</h3>
                <p className="text-sm text-gray-600">
                  This information is only shared with verified landlords when you express interest in their properties.
                  You can update or remove it anytime from your profile settings.
                </p>
              </div>
            </div>
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
