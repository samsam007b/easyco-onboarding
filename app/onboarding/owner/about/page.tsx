'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Building2, Users } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';

export default function OwnerAbout() {
  const router = useRouter();
  const [ownerType, setOwnerType] = useState('');
  const [primaryLocation, setPrimaryLocation] = useState('');
  const [hostingExperience, setHostingExperience] = useState('');

  useEffect(() => {
    const saved = safeLocalStorage.get('ownerAbout', {}) as any;
    if (saved.ownerType) setOwnerType(saved.ownerType);
    if (saved.primaryLocation) setPrimaryLocation(saved.primaryLocation);
    if (saved.hostingExperience) setHostingExperience(saved.hostingExperience);
  }, []);

  const handleContinue = () => {
    if (!ownerType || !primaryLocation || !hostingExperience) {
      alert('Please fill in all required fields');
      return;
    }

    safeLocalStorage.set('ownerAbout', {
      ownerType,
      primaryLocation,
      hostingExperience,
    });
    router.push('/onboarding/owner/review');
  };

  const handleBack = () => {
    router.push('/onboarding/owner/basic-info');
  };

  const ownerTypes = [
    { value: 'individual', label: 'Individual Owner', icon: User, description: 'I own and manage my own property' },
    { value: 'agency', label: 'Property Agency', icon: Building2, description: 'I manage multiple properties professionally' },
    { value: 'company', label: 'Company / Corporation', icon: Users, description: 'Corporate property management' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[color:var(--easy-purple)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[color:var(--easy-purple)] flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[color:var(--easy-purple)]">EasyCo</h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step 2 of 3</span>
            <span className="text-sm font-semibold text-[color:var(--easy-purple)]">67%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[color:var(--easy-purple)] rounded-full" style={{ width: '67%' }} />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
            <p className="text-gray-600">This helps us customize your hosting experience.</p>
          </div>

          <div className="space-y-6">
            {/* Owner Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a... <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {ownerTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setOwnerType(type.value)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        ownerType === type.value
                          ? 'border-[color:var(--easy-purple)] bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 mt-0.5 ${ownerType === type.value ? 'text-[color:var(--easy-purple)]' : 'text-gray-400'}`} />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{type.label}</div>
                          <div className="text-sm text-gray-500">{type.description}</div>
                        </div>
                        {ownerType === type.value && (
                          <div className="w-5 h-5 rounded-full bg-[color:var(--easy-purple)] flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={primaryLocation}
                onChange={(e) => setPrimaryLocation(e.target.value)}
                placeholder="Select your primary city"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
              />
              {/* TODO: Upgrade to city dropdown/autocomplete later */}
            </div>

            {/* Hosting Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hosting experience <span className="text-red-500">*</span>
              </label>
              <select
                value={hostingExperience}
                onChange={(e) => setHostingExperience(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
              >
                <option value="">How long have you been a host?</option>
                <option value="0-1 year">0-1 year</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3+ years">3+ years</option>
              </select>
              <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  💡 Tip: Complete profiles receive 3x more tenant inquiries on average.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleBack}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 bg-[color:var(--easy-purple)] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
