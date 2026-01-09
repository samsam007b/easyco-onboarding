'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import {
  Coffee, Moon, Music, Utensils, Calendar,
  Sunrise, Bird, Clock, Sparkles, ThumbsUp, Smile,
  VolumeX, Volume1, Volume2, ChefHat, CookingPot, Pizza,
  type LucideIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileSelectionCard,
  EnhanceProfileSection,
} from '@/components/enhance-profile';

export default function LifestyleResidentPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t, getSection } = useLanguage();
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Lifestyle preferences
  const [sleepSchedule, setSleepSchedule] = useState<'early-bird' | 'night-owl' | 'flexible' | ''>('');
  const [cleanliness, setCleanliness] = useState<'very-clean' | 'moderately-clean' | 'relaxed' | ''>('');
  const [noiseTolerance, setNoiseTolerance] = useState<'quiet' | 'moderate' | 'lively' | ''>('');
  const [cookingFrequency, setCookingFrequency] = useState<'daily' | 'often' | 'rarely' | ''>('');
  const [guestsFrequency, setGuestsFrequency] = useState<'never' | 'rarely' | 'sometimes' | 'often' | ''>('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('lifestyle_preferences')
        .eq('user_id', user.id)
        .single();

      if (profileData?.lifestyle_preferences) {
        const prefs = profileData.lifestyle_preferences;
        setSleepSchedule(prefs.sleepSchedule || '');
        setCleanliness(prefs.cleanliness || '');
        setNoiseTolerance(prefs.noiseTolerance || '');
        setCookingFrequency(prefs.cookingFrequency || '');
        setGuestsFrequency(prefs.guestsFrequency || '');
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading lifestyle preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Icon mappings for lifestyle options
  const SLEEP_ICONS: Record<string, LucideIcon> = {
    'early-bird': Sunrise,
    'night-owl': Bird,
    'flexible': Clock,
  };

  const CLEANLINESS_ICONS: Record<string, LucideIcon> = {
    'very-clean': Sparkles,
    'moderately-clean': ThumbsUp,
    'relaxed': Smile,
  };

  const NOISE_ICONS: Record<string, LucideIcon> = {
    'quiet': VolumeX,
    'moderate': Volume1,
    'lively': Volume2,
  };

  const COOKING_ICONS: Record<string, LucideIcon> = {
    'daily': ChefHat,
    'often': CookingPot,
    'rarely': Pizza,
  };

  const handleSave = async () => {
    if (!sleepSchedule || !cleanliness || !noiseTolerance) {
      toast.error(t('enhanceResident.errors.requiredFields'));
      return;
    }

    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const lifestylePreferences = {
        sleepSchedule,
        cleanliness,
        noiseTolerance,
        cookingFrequency,
        guestsFrequency,
      };

      const { error } = await supabase
        .from('user_profiles')
        .update({ lifestyle_preferences: lifestylePreferences })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success(t('enhanceResident.lifestyle.saved'));
      router.push('/dashboard/resident');
    } catch (error) {
      // FIXME: Use logger.error('Error saving lifestyle preferences:', error);
      toast.error(common.errors.unexpected);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <EnhanceProfileLayout
      role="resident"
      backUrl="/dashboard/resident"
      backLabel={t('enhanceResident.common.backToDashboard')}
      isLoading={isLoading}
      loadingText={t('enhanceResident.lifestyle.loadingText')}
    >
      {/* Header */}
      <EnhanceProfileHeading
        role="resident"
        title={t('enhanceResident.lifestyle.title')}
        description={t('enhanceResident.lifestyle.description')}
        icon={<Coffee className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Sleep Schedule */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Moon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t('enhanceResident.lifestyle.sleep.title')}</h3>
              <p className="text-sm text-gray-500">{t('enhanceResident.lifestyle.sleep.subtitle')}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: 'early-bird', labelKey: 'earlyBird', descKey: 'earlyBirdDesc' },
              { value: 'night-owl', labelKey: 'nightOwl', descKey: 'nightOwlDesc' },
              { value: 'flexible', labelKey: 'flexible', descKey: 'flexibleDesc' }
            ].map(option => {
              const IconComponent = SLEEP_ICONS[option.value];
              return (
                <EnhanceProfileSelectionCard
                  key={option.value}
                  role="resident"
                  selected={sleepSchedule === option.value}
                  onClick={() => setSleepSchedule(option.value as any)}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-1">
                      <IconComponent className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="font-medium">{t(`enhanceResident.lifestyle.sleep.${option.labelKey}`)}</div>
                    <div className="text-xs text-gray-500 mt-1">{t(`enhanceResident.lifestyle.sleep.${option.descKey}`)}</div>
                  </div>
                </EnhanceProfileSelectionCard>
              );
            })}
          </div>
        </EnhanceProfileSection>

        {/* Cleanliness */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t('enhanceResident.lifestyle.cleanliness.title')}</h3>
              <p className="text-sm text-gray-500">{t('enhanceResident.lifestyle.cleanliness.subtitle')}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: 'very-clean', labelKey: 'veryClean', descKey: 'veryCleanDesc' },
              { value: 'moderately-clean', labelKey: 'moderate', descKey: 'moderateDesc' },
              { value: 'relaxed', labelKey: 'relaxed', descKey: 'relaxedDesc' }
            ].map(option => {
              const IconComponent = CLEANLINESS_ICONS[option.value];
              return (
                <EnhanceProfileSelectionCard
                  key={option.value}
                  role="resident"
                  selected={cleanliness === option.value}
                  onClick={() => setCleanliness(option.value as any)}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-1">
                      <IconComponent className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="font-medium">{t(`enhanceResident.lifestyle.cleanliness.${option.labelKey}`)}</div>
                    <div className="text-xs text-gray-500 mt-1">{t(`enhanceResident.lifestyle.cleanliness.${option.descKey}`)}</div>
                  </div>
                </EnhanceProfileSelectionCard>
              );
            })}
          </div>
        </EnhanceProfileSection>

        {/* Noise Tolerance */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
              <Music className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t('enhanceResident.lifestyle.noise.title')}</h3>
              <p className="text-sm text-gray-500">{t('enhanceResident.lifestyle.noise.subtitle')}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: 'quiet', labelKey: 'quiet', descKey: 'quietDesc' },
              { value: 'moderate', labelKey: 'moderate', descKey: 'moderateDesc' },
              { value: 'lively', labelKey: 'lively', descKey: 'livelyDesc' }
            ].map(option => {
              const IconComponent = NOISE_ICONS[option.value];
              return (
                <EnhanceProfileSelectionCard
                  key={option.value}
                  role="resident"
                  selected={noiseTolerance === option.value}
                  onClick={() => setNoiseTolerance(option.value as any)}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-1">
                      <IconComponent className="w-6 h-6 text-pink-500" />
                    </div>
                    <div className="font-medium">{t(`enhanceResident.lifestyle.noise.${option.labelKey}`)}</div>
                    <div className="text-xs text-gray-500 mt-1">{t(`enhanceResident.lifestyle.noise.${option.descKey}`)}</div>
                  </div>
                </EnhanceProfileSelectionCard>
              );
            })}
          </div>
        </EnhanceProfileSection>

        {/* Cooking Frequency */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t('enhanceResident.lifestyle.cooking.title')}</h3>
              <p className="text-sm text-gray-500">{t('enhanceResident.lifestyle.cooking.subtitle')}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: 'daily', key: 'daily' },
              { value: 'often', key: 'often' },
              { value: 'rarely', key: 'rarely' }
            ].map(option => {
              const IconComponent = COOKING_ICONS[option.value];
              return (
                <EnhanceProfileSelectionCard
                  key={option.value}
                  role="resident"
                  selected={cookingFrequency === option.value}
                  onClick={() => setCookingFrequency(option.value as any)}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-1">
                      <IconComponent className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="font-medium">{t(`enhanceResident.lifestyle.cooking.${option.key}`)}</div>
                  </div>
                </EnhanceProfileSelectionCard>
              );
            })}
          </div>
        </EnhanceProfileSection>

        {/* Guests Frequency */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t('enhanceResident.lifestyle.guests.title')}</h3>
              <p className="text-sm text-gray-500">{t('enhanceResident.lifestyle.guests.subtitle')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: 'never', key: 'never' },
              { value: 'rarely', key: 'rarely' },
              { value: 'sometimes', key: 'sometimes' },
              { value: 'often', key: 'often' }
            ].map(option => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="resident"
                selected={guestsFrequency === option.value}
                onClick={() => setGuestsFrequency(option.value as any)}
              >
                <div className="text-center font-medium">{t(`enhanceResident.lifestyle.guests.${option.key}`)}</div>
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-8">
        <button
          onClick={handleSave}
          disabled={isSaving || !sleepSchedule || !cleanliness || !noiseTolerance}
          className={`w-full py-4 superellipse-xl font-semibold transition-all duration-300 ${
            (!isSaving && sleepSchedule && cleanliness && noiseTolerance)
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
