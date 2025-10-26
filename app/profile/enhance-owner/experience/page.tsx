'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Award, Building, Heart } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';

export default function OwnerExperiencePage() {
  const router = useRouter();
  const [experienceYears, setExperienceYears] = useState('');
  const [managementStyle, setManagementStyle] = useState('');
  const [primaryMotivation, setPrimaryMotivation] = useState('');
  const [bio, setBio] = useState('');

  const handleContinue = () => {
    safeLocalStorage.set('ownerExperience', {
      experienceYears,
      managementStyle,
      primaryMotivation,
      bio,
    });

    router.push('/profile/enhance-owner/policies');
  };

  const handleSkip = () => {
    router.push('/profile/enhance-owner/policies');
  };

  const canContinue = experienceYears && managementStyle && primaryMotivation;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[color:var(--easy-purple)]">Step 1 of 4</span>
            <span className="text-sm text-gray-500">Experience & Motivation</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[color:var(--easy-purple)] h-2 rounded-full" style={{ width: '25%' }} />
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
            Your Hosting Journey
          </h1>
          <p className="text-gray-600">
            Share your experience and what drives you as a landlord
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Experience Years */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Award className="w-4 h-4 text-purple-600" />
              </div>
              Years of landlord experience
            </label>
            <select
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">Select...</option>
              <option value="0">Less than 1 year</option>
              <option value="1-2">1-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>

          {/* Management Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Building className="w-4 h-4 text-blue-600" />
              </div>
              Property management style
            </label>
            <div className="space-y-2">
              {[
                { value: 'self-managed', label: 'Self-managed', desc: 'I handle everything personally' },
                { value: 'agency', label: 'Via Agency', desc: 'Professional property management' },
                { value: 'hybrid', label: 'Hybrid', desc: 'Mix of personal and agency management' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setManagementStyle(option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition text-left ${
                    managementStyle === option.value
                      ? 'border-[color:var(--easy-purple)] bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Motivation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Heart className="w-4 h-4 text-green-600" />
              </div>
              What drives you as a landlord?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'income', label: 'Rental Income', emoji: '💰' },
                { value: 'community', label: 'Building Community', emoji: '🤝' },
                { value: 'investment', label: 'Investment Growth', emoji: '📈' },
                { value: 'other', label: 'Other', emoji: '✨' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPrimaryMotivation(option.value)}
                  className={`p-4 rounded-xl border-2 transition ${
                    primaryMotivation === option.value
                      ? 'border-[color:var(--easy-purple)] bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className={`text-sm font-semibold ${
                    primaryMotivation === option.value ? 'text-[color:var(--easy-purple)]' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tell tenants about yourself (optional)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
              placeholder="e.g., I'm a passionate landlord who values creating comfortable, welcoming spaces for tenants..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{bio.length}/500 characters</p>
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
