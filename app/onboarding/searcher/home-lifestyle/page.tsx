'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Users, Music, PawPrint, ChefHat } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';

export default function HomeLifestylePage() {
  const router = useRouter();
  const [cleanliness, setCleanliness] = useState('');
  const [guestFrequency, setGuestFrequency] = useState('');
  const [musicHabits, setMusicHabits] = useState('');
  const [hasPets, setHasPets] = useState(false);
  const [petType, setPetType] = useState('');
  const [cookingFrequency, setCookingFrequency] = useState('');

  const handleContinue = () => {
    // Save to localStorage
    safeLocalStorage.set('homeLifestyle', JSON.stringify({
      cleanliness,
      guestFrequency,
      musicHabits,
      hasPets,
      petType: hasPets ? petType : null,
      cookingFrequency,
    }));

    // Navigate to next step
    router.push('/onboarding/searcher/social-vibe');
  };

  const canContinue = cleanliness && guestFrequency && musicHabits && cookingFrequency && (!hasPets || petType);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[color:var(--easy-purple)] w-3/6 transition-all" />
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
            Home Lifestyle
          </h1>
          <p className="text-gray-600">
            Your habits make a home feel like yours.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Cleanliness preference */}
          {/* TODO: Upgrade to slider component (see figma-06.png) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              Cleanliness preference
            </label>
            <select
              value={cleanliness}
              onChange={(e) => setCleanliness(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">Select...</option>
              <option value="relaxed">Relaxed</option>
              <option value="moderate">Moderate</option>
              <option value="tidy">Tidy</option>
              <option value="spotless">Spotless</option>
            </select>
          </div>

          {/* Guest frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              Guest frequency
            </label>
            <select
              value={guestFrequency}
              onChange={(e) => setGuestFrequency(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">Select...</option>
              <option value="never">Never</option>
              <option value="rarely">Rarely</option>
              <option value="sometimes">Sometimes</option>
              <option value="often">Often</option>
            </select>
          </div>

          {/* Music habits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                <Music className="w-4 h-4 text-pink-600" />
              </div>
              Music habits
            </label>
            <select
              value={musicHabits}
              onChange={(e) => setMusicHabits(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">Select...</option>
              <option value="quiet">Quiet environment</option>
              <option value="low-volume">Low volume</option>
              <option value="moderate">Moderate volume</option>
              <option value="loud">Loud sometimes</option>
            </select>
          </div>

          {/* Pets toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <PawPrint className="w-4 h-4 text-orange-600" />
                </div>
                <span className="font-medium text-gray-700">I have pets</span>
              </div>
              <button
                onClick={() => setHasPets(!hasPets)}
                className={`relative w-14 h-8 rounded-full transition ${
                  hasPets ? 'bg-[color:var(--easy-purple)]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                    hasPets ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {hasPets && (
              <input
                type="text"
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
                placeholder="e.g., cats, dog, hamster"
              />
            )}
          </div>

          {/* Cooking frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-yellow-600" />
              </div>
              Cooking frequency
            </label>
            <select
              value={cookingFrequency}
              onChange={(e) => setCookingFrequency(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">Select...</option>
              <option value="never">Never / Rarely</option>
              <option value="once-week">Once a week</option>
              <option value="few-times">Few times a week</option>
              <option value="daily">Daily</option>
            </select>
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
