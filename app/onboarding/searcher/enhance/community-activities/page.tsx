'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, Users, Coffee, PartyPopper } from 'lucide-react';
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

export default function OnboardingCommunityActivitiesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [sportFrequency, setSportFrequency] = useState('');
  const [openToMeetups, setOpenToMeetups] = useState(false);
  const [groupActivitiesInterest, setGroupActivitiesInterest] = useState('');

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
        const savedData = safeLocalStorage.get('communityActivities', {}) as any;
        if (savedData.sportFrequency) setSportFrequency(savedData.sportFrequency);
        if (savedData.openToMeetups !== undefined) setOpenToMeetups(savedData.openToMeetups);
        if (savedData.groupActivitiesInterest) setGroupActivitiesInterest(savedData.groupActivitiesInterest);

        // If nothing in localStorage, load from database
        if (!savedData.sportFrequency) {
          const { data: profileData } = await getOnboardingData(user.id);
          if (profileData) {
            setSportFrequency(profileData.sportFrequency || profileData.exerciseFrequency || '');
            setOpenToMeetups(profileData.openToMeetups || profileData.flatmateMeetupsInterest || false);
            setGroupActivitiesInterest(profileData.groupActivitiesInterest || '');
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

  const handleSave = () => {
    safeLocalStorage.set('communityActivities', {
      sportFrequency,
      openToMeetups,
      groupActivitiesInterest,
    });
    router.push('/onboarding/searcher/enhance');
  };

  const handleSkip = () => {
    router.push('/onboarding/searcher/enhance');
  };

  const sportOptions = [
    { value: 'never', label: 'Never', description: 'I don\'t exercise' },
    { value: 'rarely', label: 'Rarely', description: 'Once in a while' },
    { value: 'sometimes', label: 'Sometimes', description: 'Few times a month' },
    { value: 'often', label: 'Often', description: 'Few times a week' },
    { value: 'daily', label: 'Daily', description: 'Every day or almost' },
  ];

  const groupActivitiesOptions = [
    { value: 'not_interested', label: 'Not Interested', description: 'I prefer solo activities' },
    { value: 'occasionally', label: 'Occasionally', description: 'Once in a while is nice' },
    { value: 'regularly', label: 'Regularly', description: 'I enjoy group activities' },
    { value: 'very_active', label: 'Very Active', description: 'I love organizing events!' },
  ];

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/onboarding/searcher/enhance"
      backLabel="Back to Menu"
      progress={undefined}
      isLoading={isLoading}
      loadingText="Loading your preferences..."
    >
      <EnhanceProfileHeading
        role="searcher"
        title="Community Activities"
        description="Share your interest in sports and group activities"
        icon={<Dumbbell className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Sport/Exercise Frequency */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">Exercise & Sports Frequency</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">How often do you exercise or play sports?</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sportOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSportFrequency(option.value)}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  sportFrequency === option.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium text-sm">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Open to Flatmate Meetups */}
        <EnhanceProfileSection>
          <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Coffee className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-700 block">Open to Flatmate Meetups</span>
                  <span className="text-sm text-gray-500">Hang out, watch movies, game nights, etc.</span>
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

        {/* Group Activities Interest */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">Group Activities Interest</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">How interested are you in group activities with flatmates?</p>
          <div className="space-y-2">
            {groupActivitiesOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setGroupActivitiesInterest(option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  groupActivitiesInterest === option.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Activity Examples */}
        <EnhanceProfileInfoBox role="searcher">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Examples of Community Activities</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Workout sessions together
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Movie nights or game nights
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Cooking together or potlucks
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Exploring the city together
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Study sessions or co-working
              </li>
            </ul>
          </div>
        </EnhanceProfileInfoBox>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-8">
        <EnhanceProfileButton
          role="searcher"
          onClick={handleSave}
        >
          Continue
        </EnhanceProfileButton>
        <button
          onClick={handleSkip}
          className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 py-2"
        >
          Skip for now
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
