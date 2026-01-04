'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Home, Calendar } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileSelectionCard,
  EnhanceProfileSection,
  EnhanceProfileInfoBox,
} from '@/components/enhance-profile';

export default function AdvancedPreferencesPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [roomType, setRoomType] = useState('');
  const [bathroomType, setBathroomType] = useState('');
  const [leaseDuration, setLeaseDuration] = useState('');
  const [moveInFlexibility, setMoveInFlexibility] = useState('');
  const [petsPreference, setPetsPreference] = useState('');
  const [smokingPreference, setSmokingPreference] = useState('');
  const [quietHours, setQuietHours] = useState(false);
  const [guestsAllowed, setGuestsAllowed] = useState(false);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('advancedPreferences', {}) as any;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData?.advanced_preferences) {
          const prefs = profileData.advanced_preferences;
          setRoomType(saved.roomType || prefs.room_type || '');
          setBathroomType(saved.bathroomType || prefs.bathroom_type || '');
          setLeaseDuration(saved.leaseDuration || prefs.lease_duration || '');
          setMoveInFlexibility(saved.moveInFlexibility || prefs.move_in_flexibility || '');
          setPetsPreference(saved.petsPreference || prefs.pets_preference || '');
          setSmokingPreference(saved.smokingPreference || prefs.smoking_preference || '');
          setQuietHours(saved.quietHours || prefs.quiet_hours || false);
          setGuestsAllowed(saved.guestsAllowed || prefs.guests_allowed || false);
        } else if (saved.roomType) {
          setRoomType(saved.roomType);
          setBathroomType(saved.bathroomType);
          setLeaseDuration(saved.leaseDuration);
          setMoveInFlexibility(saved.moveInFlexibility);
          setPetsPreference(saved.petsPreference);
          setSmokingPreference(saved.smokingPreference);
          setQuietHours(saved.quietHours || false);
          setGuestsAllowed(saved.guestsAllowed || false);
        }
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading preferences data:', error);
      toast.error(t('profileEnhance.preferences.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    safeLocalStorage.set('advancedPreferences', {
      roomType,
      bathroomType,
      leaseDuration,
      moveInFlexibility,
      petsPreference,
      smokingPreference,
      quietHours,
      guestsAllowed,
    });
    toast.success(t('profileEnhance.preferences.saved'));
    router.push('/dashboard/my-profile');
  };

  const handleCancel = () => {
    router.push('/dashboard/my-profile');
  };

  // Options with translation keys
  const roomTypeOptions = [
    { value: 'private', key: 'private' },
    { value: 'shared', key: 'shared' },
    { value: 'studio', key: 'studio' },
    { value: 'flexible', key: 'flexible' },
  ];

  const bathroomOptions = [
    { value: 'private', key: 'private' },
    { value: 'shared', key: 'shared' },
  ];

  const leaseDurationOptions = [
    { value: '1-3-months', key: 'oneToThree' },
    { value: '3-6-months', key: 'threeToSix' },
    { value: '6-12-months', key: 'sixToTwelve' },
    { value: '12-months-plus', key: 'twelvePlus' },
    { value: 'flexible', key: 'flexible' },
  ];

  const moveInFlexibilityOptions = [
    { value: 'exact', key: 'exact' },
    { value: 'within 1 week', key: 'withinWeek' },
    { value: 'flexible', key: 'flexible' },
  ];

  const petsOptions = [
    { value: 'i have pets', key: 'havePets' },
    { value: 'no pets', key: 'noPets' },
    { value: 'open to pets', key: 'openToPets' },
  ];

  const smokingOptions = [
    { value: 'non-smoking only', key: 'nonSmoking' },
    { value: 'smoking outside ok', key: 'smokingOutside' },
  ];

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/dashboard/my-profile"
      backLabel={t('profileEnhance.common.backToProfile')}
      progress={undefined}
      isLoading={isLoading}
      loadingText={t('profileEnhance.common.loading')}
    >
      <EnhanceProfileHeading
        role="searcher"
        title={t('profileEnhance.preferences.title')}
        description={t('profileEnhance.preferences.description')}
        icon={<Settings className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Room Type */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Home className="w-5 h-5 text-orange-600" />
            {t('profileEnhance.preferences.roomType.label')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {roomTypeOptions.map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="searcher"
                selected={roomType === option.value}
                onClick={() => setRoomType(option.value)}
              >
                {t(`profileEnhance.preferences.roomType.${option.key}`)}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Bathroom Type */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('profileEnhance.preferences.bathroom.label')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {bathroomOptions.map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="searcher"
                selected={bathroomType === option.value}
                onClick={() => setBathroomType(option.value)}
              >
                {t(`profileEnhance.preferences.bathroom.${option.key}`)}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Lease Duration */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            {t('profileEnhance.preferences.leaseDuration.label')}
          </label>
          <select
            value={leaseDuration}
            onChange={(e) => setLeaseDuration(e.target.value)}
            className="w-full px-4 py-3 superellipse-xl border border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
          >
            <option value="">{t('profileEnhance.preferences.leaseDuration.select')}</option>
            {leaseDurationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(`profileEnhance.preferences.leaseDuration.${option.key}`)}
              </option>
            ))}
          </select>
        </EnhanceProfileSection>

        {/* Move-in Flexibility */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('profileEnhance.preferences.moveInFlexibility.label')}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {moveInFlexibilityOptions.map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="searcher"
                selected={moveInFlexibility === option.value}
                onClick={() => setMoveInFlexibility(option.value)}
              >
                {t(`profileEnhance.preferences.moveInFlexibility.${option.key}`)}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Pets Preference */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('profileEnhance.preferences.pets.label')}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {petsOptions.map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="searcher"
                selected={petsPreference === option.value}
                onClick={() => setPetsPreference(option.value)}
              >
                {t(`profileEnhance.preferences.pets.${option.key}`)}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Smoking Preference */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('profileEnhance.preferences.smoking.label')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {smokingOptions.map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="searcher"
                selected={smokingPreference === option.value}
                onClick={() => setSmokingPreference(option.value)}
              >
                {t(`profileEnhance.preferences.smoking.${option.key}`)}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Toggles */}
        <EnhanceProfileSection>
          {/* Quiet Hours */}
          <div className="flex items-center justify-between p-4 bg-orange-50 superellipse-xl mb-4">
            <div>
              <span className="font-medium text-gray-700 block">{t('profileEnhance.preferences.quietHours.label')}</span>
              <span className="text-sm text-gray-500">{t('profileEnhance.preferences.quietHours.description')}</span>
            </div>
            <button
              onClick={() => setQuietHours(!quietHours)}
              className={`relative w-14 h-8 rounded-full transition flex-shrink-0 ${
                quietHours ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                  quietHours ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Guests Allowed */}
          <div className="flex items-center justify-between p-4 bg-orange-50 superellipse-xl">
            <div>
              <span className="font-medium text-gray-700 block">{t('profileEnhance.preferences.guests.label')}</span>
              <span className="text-sm text-gray-500">{t('profileEnhance.preferences.guests.description')}</span>
            </div>
            <button
              onClick={() => setGuestsAllowed(!guestsAllowed)}
              className={`relative w-14 h-8 rounded-full transition flex-shrink-0 ${
                guestsAllowed ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                  guestsAllowed ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </EnhanceProfileSection>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-8">
        <EnhanceProfileButton
          role="searcher"
          variant="outline"
          onClick={handleCancel}
          className="flex-1"
        >
          {t('profileEnhance.common.cancel')}
        </EnhanceProfileButton>
        <EnhanceProfileButton
          role="searcher"
          onClick={handleSave}
          className="flex-1"
        >
          {t('profileEnhance.common.saveChanges')}
        </EnhanceProfileButton>
      </div>
    </EnhanceProfileLayout>
  );
}
