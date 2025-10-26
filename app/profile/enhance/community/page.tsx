'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PartyPopper, Users, UtensilsCrossed, Sparkles } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';

export default function CommunityEventsPage() {
  const router = useRouter();
  const [eventInterest, setEventInterest] = useState<'low' | 'medium' | 'high' | ''>('');
  const [enjoySharedMeals, setEnjoySharedMeals] = useState(false);
  const [openToMeetups, setOpenToMeetups] = useState(false);

  const handleContinue = () => {
    // Save to localStorage
    safeLocalStorage.set('communityEvents', {
      eventInterest,
      enjoySharedMeals,
      openToMeetups,
    });

    // Navigate to verification page
    router.push('/profile/enhance/verification');
  };

  const handleSkip = () => {
    // Clear this section from localStorage
    safeLocalStorage.remove('communityEvents');
    // Navigate to verification page
    router.push('/profile/enhance/verification');
  };

  const canContinue = eventInterest !== '';

  const interestLevels = [
    { value: 'low' as const, emoji: '😐', label: 'Low', description: 'Prefer quiet independence' },
    { value: 'medium' as const, emoji: '😊', label: 'Medium', description: 'Occasional socializing' },
    { value: 'high' as const, emoji: '🎉', label: 'High', description: 'Love community events!' },
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
            Community & Events
          </h1>
          <p className="text-gray-600">
            How interested are you in community events, parties, and social gatherings?
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Event participation interest */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <PartyPopper className="w-4 h-4 text-purple-600" />
              </div>
              Event participation interest
            </label>
            <div className="grid grid-cols-3 gap-3">
              {interestLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setEventInterest(level.value)}
                  className={`p-4 rounded-xl transition border-2 flex flex-col items-center gap-2 ${
                    eventInterest === level.value
                      ? 'bg-[color:var(--easy-purple)] text-white border-[color:var(--easy-purple)]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[color:var(--easy-purple)]'
                  }`}
                >
                  <span className="text-3xl">{level.emoji}</span>
                  <span className="font-semibold text-sm">{level.label}</span>
                  <span className={`text-xs text-center ${
                    eventInterest === level.value ? 'text-purple-100' : 'text-gray-500'
                  }`}>
                    {level.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Shared meals toggle */}
          <div className="p-4 rounded-xl bg-yellow-50 border-2 border-yellow-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-700 block">I'd enjoy shared meals</span>
                  <span className="text-sm text-gray-500">Cook and eat together with flatmates</span>
                </div>
              </div>
              <button
                onClick={() => setEnjoySharedMeals(!enjoySharedMeals)}
                className={`relative w-14 h-8 rounded-full transition flex-shrink-0 ${
                  enjoySharedMeals ? 'bg-[color:var(--easy-yellow)]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                    enjoySharedMeals ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Flatmate meetups toggle */}
          <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-700 block">Open to flatmate meetups</span>
                  <span className="text-sm text-gray-500">Hang out, watch movies, game nights</span>
                </div>
              </div>
              <button
                onClick={() => setOpenToMeetups(!openToMeetups)}
                className={`relative w-14 h-8 rounded-full transition flex-shrink-0 ${
                  openToMeetups ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                    openToMeetups ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Community perks callout */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Community Perks</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Find flatmates with similar social energy
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Get matched with compatible living styles
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Discover coliving spaces that fit your vibe
                  </li>
                </ul>
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
