'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { PartyPopper, Users, UtensilsCrossed, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileSelectionCard,
  EnhanceProfileInfoBox,
  EnhanceProfileSection,
} from '@/components/enhance-profile';

export default function CommunityEventsResidentPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t, getSection } = useLanguage();
  const common = getSection('common');
  const [eventInterest, setEventInterest] = useState<'low' | 'medium' | 'high' | ''>('');
  const [enjoySharedMeals, setEnjoySharedMeals] = useState(false);
  const [openToMeetups, setOpenToMeetups] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('community_preferences')
        .eq('user_id', user.id)
        .single();

      if (profileData?.community_preferences) {
        const prefs = profileData.community_preferences;
        setEventInterest(prefs.eventInterest || '');
        setEnjoySharedMeals(prefs.enjoySharedMeals || false);
        setOpenToMeetups(prefs.openToMeetups || false);
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading community preferences:', error);
    }
  };

  const handleSave = async () => {
    if (!eventInterest) {
      toast.error(t('enhanceResident.errors.selectEventInterest'));
      return;
    }

    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const communityPreferences = {
        eventInterest,
        enjoySharedMeals,
        openToMeetups,
      };

      const { error } = await supabase
        .from('user_profiles')
        .update({ community_preferences: communityPreferences })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success(t('enhanceResident.community.saved'));
      router.push('/dashboard/resident');
    } catch (error) {
      // FIXME: Use logger.error('Error saving community preferences:', error);
      toast.error(common.errors.unexpected);
    } finally {
      setIsSaving(false);
    }
  };

  const canContinue = eventInterest !== '';

  const interestLevels = [
    { value: 'low' as const, emoji: '😐', labelKey: 'low', descKey: 'lowDesc' },
    { value: 'medium' as const, emoji: '😊', labelKey: 'medium', descKey: 'mediumDesc' },
    { value: 'high' as const, emoji: '🎉', labelKey: 'high', descKey: 'highDesc' },
  ];

  return (
    <EnhanceProfileLayout
      role="resident"
      backUrl="/dashboard/resident"
      backLabel={t('enhanceResident.common.backToDashboard')}
    >
      {/* Header */}
      <EnhanceProfileHeading
        role="resident"
        title={t('enhanceResident.community.title')}
        description={t('enhanceResident.community.description')}
        icon={<PartyPopper className="w-8 h-8 text-orange-600" />}
      />

      {/* Form */}
      <div className="space-y-6">
        {/* Event participation interest */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <PartyPopper className="w-4 h-4 text-orange-600" />
            </div>
            {t('enhanceResident.community.eventInterest.label')}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {interestLevels.map((level) => (
              <EnhanceProfileSelectionCard
                key={level.value}
                role="resident"
                selected={eventInterest === level.value}
                onClick={() => setEventInterest(level.value)}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">{level.emoji}</span>
                  <span className="font-semibold text-sm">{t(`enhanceResident.community.eventInterest.${level.labelKey}`)}</span>
                  <span className="text-xs text-center text-gray-500">
                    {t(`enhanceResident.community.eventInterest.${level.descKey}`)}
                  </span>
                </div>
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Shared meals toggle */}
        <div className="p-4 superellipse-xl bg-orange-50 border-2 border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <span className="font-medium text-gray-700 block">{t('enhanceResident.community.sharedMeals.title')}</span>
                <span className="text-sm text-gray-500">{t('enhanceResident.community.sharedMeals.description')}</span>
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

        {/* Flatmate meetups toggle */}
        <div className="p-4 superellipse-xl bg-orange-50 border-2 border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <span className="font-medium text-gray-700 block">{t('enhanceResident.community.meetups.title')}</span>
                <span className="text-sm text-gray-500">{t('enhanceResident.community.meetups.description')}</span>
              </div>
            </div>
            <button
              onClick={() => setOpenToMeetups(!openToMeetups)}
              className={`relative w-[52px] h-[32px] rounded-full transition-all duration-300 flex-shrink-0 ${
                openToMeetups ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gray-300'
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

        {/* Community perks callout */}
        <EnhanceProfileInfoBox role="resident" title={t('enhanceResident.community.perks.title')} icon="✨">
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              {t('enhanceResident.community.perks.connect')}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              {t('enhanceResident.community.perks.invited')}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              {t('enhanceResident.community.perks.friendships')}
            </li>
          </ul>
        </EnhanceProfileInfoBox>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-8">
        <button
          onClick={handleSave}
          disabled={!canContinue || isSaving}
          className={`w-full py-4 superellipse-xl font-semibold transition-all duration-300 ${
            (canContinue && !isSaving)
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              : 'bg-transparent border-2 border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSaving ? t('enhanceResident.common.saving') : t('enhanceResident.common.saveChanges')}
        </button>
        <button
          onClick={() => router.push('/dashboard/resident')}
          disabled={isSaving}
          className="w-full text-center text-sm text-transparent hover:text-gray-600 transition-colors duration-200 py-2 disabled:opacity-50"
        >
          {t('enhanceResident.common.cancel')}
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
