'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PartyPopper, Users, UtensilsCrossed, Sparkles } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { getOnboardingData } from '@/lib/onboarding-helpers';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileSelectionCard,
  EnhanceProfileSection,
  EnhanceProfileInfoBox,
} from '@/components/enhance-profile';

export default function CommunityEventsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [eventInterest, setEventInterest] = useState<'low' | 'medium' | 'high' | ''>('');
  const [enjoySharedMeals, setEnjoySharedMeals] = useState(false);
  const [openToMeetups, setOpenToMeetups] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        // Load from localStorage first
        const savedData = safeLocalStorage.get('communityEvents', {}) as any;
        if (savedData.eventInterest) setEventInterest(savedData.eventInterest);
        if (savedData.enjoySharedMeals !== undefined) setEnjoySharedMeals(savedData.enjoySharedMeals);
        if (savedData.openToMeetups !== undefined) setOpenToMeetups(savedData.openToMeetups);

        // If nothing in localStorage, load from database
        if (!savedData.eventInterest) {
          const { data: profileData } = await getOnboardingData(user.id);
          if (profileData) {
            setEventInterest(profileData.eventInterest || '');
            setEnjoySharedMeals(profileData.enjoySharedMeals || false);
            setOpenToMeetups(profileData.openToMeetups || false);
          }
        }
      } catch (error) {
        // FIXME: Use logger.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleContinue = () => {
    safeLocalStorage.set('communityEvents', {
      eventInterest,
      enjoySharedMeals,
      openToMeetups,
    });
    router.push('/profile/enhance/verification');
  };

  const handleSkip = () => {
    router.push('/profile/enhance/verification');
  };

  const canContinue = eventInterest !== '';

  const interestLevels = [
    { value: 'low' as const, emoji: '😐', label: 'Low', description: 'Prefer quiet independence' },
    { value: 'medium' as const, emoji: '😊', label: 'Medium', description: 'Occasional socializing' },
    { value: 'high' as const, emoji: '🎉', label: 'High', description: 'Love community events!' },
  ];

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/profile/enhance/financial"
      backLabel="Back"
      progress={{
        current: 5,
        total: 6,
        label: 'Step 5 of 6',
        stepName: 'Community & Events',
      }}
      isLoading={isLoading}
      loadingText="Loading your preferences..."
    >
      <EnhanceProfileHeading
        role="searcher"
        title="Community & Events"
        description="How interested are you in community events, parties, and social gatherings?"
        icon={<PartyPopper className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Event participation interest */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <PartyPopper className="w-4 h-4 text-orange-600" />
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
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500'
                }`}
              >
                <span className="text-3xl">{level.emoji}</span>
                <span className="font-semibold text-sm">{level.label}</span>
                <span className={`text-xs text-center ${
                  eventInterest === level.value ? 'text-orange-100' : 'text-gray-500'
                }`}>
                  {level.description}
                </span>
              </button>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Shared meals toggle */}
        <EnhanceProfileSection>
          <div className="p-4 rounded-xl bg-orange-50 border-2 border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-700 block">I'd enjoy shared meals</span>
                  <span className="text-sm text-gray-500">Cook and eat together with flatmates</span>
                </div>
              </div>
              <button
                onClick={() => setEnjoySharedMeals(!enjoySharedMeals)}
                className={`relative w-[52px] h-[32px] rounded-full transition-all duration-300 flex-shrink-0 ${
                  enjoySharedMeals ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-[2px] left-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-md transition-all duration-300 ${
                    enjoySharedMeals ? 'translate-x-[20px]' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </EnhanceProfileSection>

        {/* Flatmate meetups toggle */}
        <EnhanceProfileSection>
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
                className={`relative w-[52px] h-[32px] rounded-full transition-all duration-300 flex-shrink-0 ${
                  openToMeetups ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-[2px] left-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-md transition-all duration-300 ${
                    openToMeetups ? 'translate-x-[20px]' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </EnhanceProfileSection>

        {/* Community perks callout */}
        <EnhanceProfileInfoBox role="searcher">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Sparkles className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Community Perks</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Find flatmates with similar social energy
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Get matched with compatible living styles
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Discover coliving spaces that fit your vibe
                </li>
              </ul>
            </div>
          </div>
        </EnhanceProfileInfoBox>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-8">
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
            canContinue
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              : 'bg-transparent border-2 border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
        <button
          onClick={handleSkip}
          className="w-full text-center text-sm text-transparent hover:text-gray-600 transition-colors duration-200 py-2"
        >
          Skip for now
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
