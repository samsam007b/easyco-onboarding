'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ThumbsUp, AlertTriangle } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { getOnboardingData } from '@/lib/onboarding-helpers';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileTag,
  EnhanceProfileSection,
} from '@/components/enhance-profile';

export default function EnhanceValuesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [coreValues, setCoreValues] = useState<string[]>([]);
  const [importantQualities, setImportantQualities] = useState<string[]>([]);
  const [dealBreakers, setDealBreakers] = useState<string[]>([]);

  // Options with translation keys (English values stored in DB)
  const valueOptions = [
    { value: 'Honesty', key: 'honesty' },
    { value: 'Respect', key: 'respect' },
    { value: 'Communication', key: 'communication' },
    { value: 'Sustainability', key: 'sustainability' },
    { value: 'Diversity', key: 'diversity' },
    { value: 'Collaboration', key: 'collaboration' },
    { value: 'Independence', key: 'independence' },
    { value: 'Growth', key: 'growth' },
    { value: 'Community', key: 'community' },
    { value: 'Creativity', key: 'creativity' },
  ];

  const qualityOptions = [
    { value: 'Cleanliness', key: 'cleanliness' },
    { value: 'Punctuality', key: 'punctuality' },
    { value: 'Friendliness', key: 'friendliness' },
    { value: 'Quietness', key: 'quietness' },
    { value: 'Flexibility', key: 'flexibility' },
    { value: 'Organization', key: 'organization' },
    { value: 'Openness', key: 'openness' },
    { value: 'Reliability', key: 'reliability' },
    { value: 'Humor', key: 'humor' },
    { value: 'Empathy', key: 'empathy' },
  ];

  const dealBreakerOptions = [
    { value: 'Smoking indoors', key: 'smokingIndoors' },
    { value: 'Loud noise late night', key: 'loudNoise' },
    { value: 'Messiness', key: 'messiness' },
    { value: 'No cleaning', key: 'noCleaning' },
    { value: 'Bringing strangers often', key: 'bringingStrangers' },
    { value: 'Not respecting boundaries', key: 'notRespectingBoundaries' },
    { value: 'Pets (if allergic)', key: 'petsAllergic' },
    { value: 'No communication', key: 'noCommunication' },
    { value: 'Invasion of privacy', key: 'privacyInvasion' },
  ];

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
        const savedData = safeLocalStorage.get('enhanceValues', {}) as any;
        if (savedData.coreValues) setCoreValues(savedData.coreValues);
        if (savedData.importantQualities) setImportantQualities(savedData.importantQualities);
        if (savedData.dealBreakers) setDealBreakers(savedData.dealBreakers);

        // If nothing in localStorage, load from database
        if (!savedData.coreValues && !savedData.importantQualities && !savedData.dealBreakers) {
          const { data: profileData } = await getOnboardingData(user.id);
          if (profileData) {
            setCoreValues(profileData.coreValues || []);
            setImportantQualities(profileData.importantQualities || []);
            setDealBreakers(profileData.dealBreakers || []);
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

  const handleToggleValue = (valueStr: string) => {
    if (coreValues.includes(valueStr)) {
      setCoreValues(coreValues.filter(v => v !== valueStr));
    } else if (coreValues.length < 5) {
      setCoreValues([...coreValues, valueStr]);
    }
  };

  const handleToggleQuality = (quality: string) => {
    if (importantQualities.includes(quality)) {
      setImportantQualities(importantQualities.filter(q => q !== quality));
    } else {
      setImportantQualities([...importantQualities, quality]);
    }
  };

  const handleToggleDealBreaker = (dealBreaker: string) => {
    if (dealBreakers.includes(dealBreaker)) {
      setDealBreakers(dealBreakers.filter(d => d !== dealBreaker));
    } else {
      setDealBreakers([...dealBreakers, dealBreaker]);
    }
  };

  const handleNext = async () => {
    // Save to localStorage for immediate feedback
    safeLocalStorage.set('enhanceValues', { coreValues, importantQualities, dealBreakers });

    // Save to database
    try {
      await fetch('/api/profile/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'values',
          data: { coreValues, importantQualities, dealBreakers }
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

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/profile/enhance/hobbies"
      backLabel={t('profileEnhance.common.backToProfile')}
      progress={{
        current: 3,
        total: 6,
        label: `${t('profileEnhance.values.progress.step')} 3 ${t('profileEnhance.values.progress.of')} 6`,
        stepName: t('profileEnhance.values.progress.stepName'),
      }}
      isLoading={isLoading}
      loadingText={t('profileEnhance.values.loading')}
    >
      <EnhanceProfileHeading
        role="searcher"
        title={t('profileEnhance.values.title')}
        description={t('profileEnhance.values.description')}
        icon={<Sparkles className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Core Values */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">{t('profileEnhance.values.coreValues.title')}</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">{t('profileEnhance.values.coreValues.description')}</p>
          <div className="flex flex-wrap gap-2">
            {valueOptions.map((option) => (
              <EnhanceProfileTag
                key={option.value}
                role="searcher"
                selected={coreValues.includes(option.value)}
                onClick={() => handleToggleValue(option.value)}
                disabled={!coreValues.includes(option.value) && coreValues.length >= 5}
              >
                {t(`profileEnhance.values.coreValues.options.${option.key}`)}
              </EnhanceProfileTag>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">{coreValues.length}/5 {t('profileEnhance.values.coreValues.selected')}</p>
        </EnhanceProfileSection>

        {/* Important Qualities */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <ThumbsUp className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">{t('profileEnhance.values.qualities.title')}</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">{t('profileEnhance.values.qualities.description')}</p>
          <div className="flex flex-wrap gap-2">
            {qualityOptions.map((option) => (
              <EnhanceProfileTag
                key={option.value}
                role="searcher"
                selected={importantQualities.includes(option.value)}
                onClick={() => handleToggleQuality(option.value)}
              >
                {t(`profileEnhance.values.qualities.options.${option.key}`)}
              </EnhanceProfileTag>
            ))}
          </div>
          {importantQualities.length > 0 && (
            <p className="text-xs text-gray-500 mt-3">{importantQualities.length} {t('profileEnhance.values.qualities.selected')}</p>
          )}
        </EnhanceProfileSection>

        {/* Deal Breakers */}
        <EnhanceProfileSection>
          <div className="bg-white p-6 superellipse-2xl border-2 border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-orange-600">{t('profileEnhance.values.dealBreakers.title')}</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">{t('profileEnhance.values.dealBreakers.description')}</p>
            <div className="flex flex-wrap gap-2">
              {dealBreakerOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleToggleDealBreaker(option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    dealBreakers.includes(option.value)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t(`profileEnhance.values.dealBreakers.options.${option.key}`)}
                </button>
              ))}
            </div>
            {dealBreakers.length > 0 && (
              <p className="text-xs text-gray-500 mt-3">{dealBreakers.length} {t('profileEnhance.values.dealBreakers.selected')}</p>
            )}
          </div>
        </EnhanceProfileSection>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between items-center gap-4">
        <button
          onClick={handleSkip}
          className="px-6 py-3 superellipse-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          {t('profileEnhance.common.skip')}
          <span className="text-lg">→</span>
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 superellipse-xl font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          {t('profileEnhance.common.save')}
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
