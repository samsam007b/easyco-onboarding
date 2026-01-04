'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, Users, Coffee, PartyPopper } from 'lucide-react';
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

export default function OnboardingCommunityActivitiesPage() {
  const router = useRouter();
  const { t } = useLanguage();
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
    { value: 'never', labelKey: 'never', descKey: 'neverDesc' },
    { value: 'rarely', labelKey: 'rarely', descKey: 'rarelyDesc' },
    { value: 'sometimes', labelKey: 'sometimes', descKey: 'sometimesDesc' },
    { value: 'often', labelKey: 'often', descKey: 'oftenDesc' },
    { value: 'daily', labelKey: 'daily', descKey: 'dailyDesc' },
  ];

  const groupActivitiesOptions = [
    { value: 'not_interested', labelKey: 'notInterested', descKey: 'notInterestedDesc' },
    { value: 'occasionally', labelKey: 'occasionally', descKey: 'occasionallyDesc' },
    { value: 'regularly', labelKey: 'regularly', descKey: 'regularlyDesc' },
    { value: 'very_active', labelKey: 'veryActive', descKey: 'veryActiveDesc' },
  ];

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/onboarding/searcher/enhance"
      backLabel={t('enhanceSearcher.common.backToMenu')}
      progress={undefined}
      isLoading={isLoading}
      loadingText={t('enhanceSearcher.common.loading')}
    >
      <EnhanceProfileHeading
        role="searcher"
        title={t('enhanceSearcher.communityActivities.title')}
        description={t('enhanceSearcher.communityActivities.description')}
        icon={<Dumbbell className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Sport/Exercise Frequency */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">{t('enhanceSearcher.communityActivities.sport.title')}</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">{t('enhanceSearcher.communityActivities.sport.subtitle')}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sportOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSportFrequency(option.value)}
                className={`p-4 superellipse-xl border-2 transition-all text-center ${
                  sportFrequency === option.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium text-sm">{t(`enhanceSearcher.communityActivities.sport.${option.labelKey}`)}</div>
                <div className="text-xs text-gray-500 mt-1">{t(`enhanceSearcher.communityActivities.sport.${option.descKey}`)}</div>
              </button>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Open to Flatmate Meetups */}
        <EnhanceProfileSection>
          <div className="p-4 superellipse-xl bg-blue-50 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Coffee className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-700 block">{t('enhanceSearcher.communityActivities.meetups.title')}</span>
                  <span className="text-sm text-gray-500">{t('enhanceSearcher.communityActivities.meetups.description')}</span>
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
            <h2 className="text-lg font-semibold text-gray-800">{t('enhanceSearcher.communityActivities.group.title')}</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">{t('enhanceSearcher.communityActivities.group.subtitle')}</p>
          <div className="space-y-2">
            {groupActivitiesOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setGroupActivitiesInterest(option.value)}
                className={`w-full p-4 superellipse-xl border-2 transition-all text-left ${
                  groupActivitiesInterest === option.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">{t(`enhanceSearcher.communityActivities.group.${option.labelKey}`)}</div>
                <div className="text-xs text-gray-500 mt-1">{t(`enhanceSearcher.communityActivities.group.${option.descKey}`)}</div>
              </button>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Activity Examples */}
        <EnhanceProfileInfoBox role="searcher">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('enhanceSearcher.communityActivities.examples.title')}</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                {t('enhanceSearcher.communityActivities.examples.item1')}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                {t('enhanceSearcher.communityActivities.examples.item2')}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                {t('enhanceSearcher.communityActivities.examples.item3')}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                {t('enhanceSearcher.communityActivities.examples.item4')}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                {t('enhanceSearcher.communityActivities.examples.item5')}
              </li>
            </ul>
          </div>
        </EnhanceProfileInfoBox>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-8">
        <button
          onClick={handleSave}
          className="w-full py-4 superellipse-xl font-semibold transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          {t('enhanceSearcher.common.saveAndContinue')}
        </button>
        <button
          onClick={handleSkip}
          className="w-full text-center text-sm text-transparent hover:text-gray-600 transition-colors duration-200 py-2"
        >
          {t('enhanceSearcher.common.skipForNow')}
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
