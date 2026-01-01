'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PartyPopper, Users, UtensilsCrossed, Sparkles } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { getOnboardingData } from '@/lib/onboarding-helpers';
import { useLanguage } from '@/lib/i18n/use-language';
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
  const { t } = useLanguage();
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

  const handleContinue = async () => {
    // Save to localStorage for immediate feedback
    safeLocalStorage.set('communityEvents', {
      eventInterest,
      enjoySharedMeals,
      openToMeetups,
    });

    // Save to database
    try {
      await fetch('/api/profile/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'community',
          data: { eventInterest, enjoySharedMeals, openToMeetups }
        })
      });
    } catch (error) {
      console.error('Failed to save to database:', error);
    }

    router.push('/profile');
  };

  const handleSkip = () => {
    router.push('/profile');
  };

  const canContinue = eventInterest !== '';

  const interestLevels = [
    { value: 'low' as const, labelKey: 'low', descriptionKey: 'low' },
    { value: 'medium' as const, labelKey: 'medium', descriptionKey: 'medium' },
    { value: 'high' as const, labelKey: 'high', descriptionKey: 'high' },
  ];

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/profile"
      backLabel={t('profileEnhance.common.backToProfile')}
      progress={undefined}
      isLoading={isLoading}
      loadingText={t('profileEnhance.community.loading')}
    >
      <EnhanceProfileHeading
        role="searcher"
        title={t('profileEnhance.community.title')}
        description={t('profileEnhance.community.description')}
        icon={<PartyPopper className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Event participation interest */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <PartyPopper className="w-4 h-4 text-orange-600" />
            </div>
            {t('profileEnhance.community.eventInterest.label')}
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
                <span className="font-semibold text-sm">{t(`profileEnhance.community.eventInterest.${level.labelKey}.label`)}</span>
                <span className={`text-xs text-center ${
                  eventInterest === level.value ? 'text-orange-100' : 'text-gray-500'
                }`}>
                  {t(`profileEnhance.community.eventInterest.${level.descriptionKey}.description`)}
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
                  <span className="font-medium text-gray-700 block">{t('profileEnhance.community.sharedMeals.title')}</span>
                  <span className="text-sm text-gray-500">{t('profileEnhance.community.sharedMeals.description')}</span>
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
                  <span className="font-medium text-gray-700 block">{t('profileEnhance.community.openToMeetups.title')}</span>
                  <span className="text-sm text-gray-500">{t('profileEnhance.community.openToMeetups.description')}</span>
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
              <h3 className="font-semibold text-gray-900 mb-2">{t('profileEnhance.community.perks.title')}</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  {t('profileEnhance.community.perks.perk1')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  {t('profileEnhance.community.perks.perk2')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  {t('profileEnhance.community.perks.perk3')}
                </li>
              </ul>
            </div>
          </div>
        </EnhanceProfileInfoBox>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between items-center gap-4">
        <button
          onClick={handleSkip}
          className="px-6 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          {t('profileEnhance.common.skip')}
          <span className="text-lg">→</span>
        </button>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {t('profileEnhance.common.save')}
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
