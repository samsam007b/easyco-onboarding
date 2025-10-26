'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Smile, Share2, MessageCircle, Globe } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';

export default function SocialVibePage() {
  const router = useRouter();
  const [socialEnergy, setSocialEnergy] = useState('');
  const [opennessToSharing, setOpennessToSharing] = useState('');
  const [communicationStyle, setCommunicationStyle] = useState('');
  const [culturalOpenness, setCulturalOpenness] = useState('');

  const handleContinue = () => {
    // Save to localStorage
    safeLocalStorage.set('socialVibe', {
      socialEnergy,
      opennessToSharing,
      communicationStyle,
      culturalOpenness,
    });

    // Navigate to next step
    router.push('/onboarding/searcher/ideal-coliving');
  };

  const canContinue = socialEnergy && opennessToSharing && communicationStyle && culturalOpenness;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[color:var(--easy-purple)] w-4/6 transition-all" />
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
            Social Vibe
          </h1>
          <p className="text-gray-600">
            How do you connect with others?
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Social energy */}
          {/* TODO: Upgrade to slider component (see figma-07.png) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Smile className="w-4 h-4 text-purple-600" />
              </div>
              Social energy
            </label>
            <select
              value={socialEnergy}
              onChange={(e) => setSocialEnergy(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">Select...</option>
              <option value="introvert">Introvert</option>
              <option value="moderate">Moderate</option>
              <option value="extrovert">Extrovert</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">How much do you enjoy social interactions?</p>
          </div>

          {/* Openness to sharing */}
          {/* TODO: Upgrade to slider component (see figma-07.png) */}
          <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Share2 className="w-4 h-4 text-yellow-600" />
              </div>
              Openness to sharing
            </label>
            <select
              value={opennessToSharing}
              onChange={(e) => setOpennessToSharing(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">Select...</option>
              <option value="private">Private</option>
              <option value="moderate">Moderate</option>
              <option value="very-open">Very open</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">Do you like sharing meals, stories, and experiences?</p>
          </div>

          {/* Communication style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-blue-600" />
              </div>
              Communication style
            </label>
            <select
              value={communicationStyle}
              onChange={(e) => setCommunicationStyle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">Select...</option>
              <option value="direct">Direct & straightforward</option>
              <option value="diplomatic">Diplomatic & tactful</option>
              <option value="casual">Casual & friendly</option>
              <option value="formal">Formal & professional</option>
            </select>
          </div>

          {/* Cultural openness */}
          {/* TODO: Upgrade to slider component (see figma-07.png) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-600" />
              </div>
              Cultural openness
            </label>
            <select
              value={culturalOpenness}
              onChange={(e) => setCulturalOpenness(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">Select...</option>
              <option value="prefer-similar">Prefer similar</option>
              <option value="moderate">Moderate</option>
              <option value="love-diversity">Love diversity</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">How comfortable are you with different cultures and backgrounds?</p>
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full mt-12 py-4 rounded-full font-semibold text-lg transition shadow-md ${
            canContinue
              ? 'bg-[color:var(--easy-yellow)] text-black hover:opacity-90 hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </main>
  );
}
