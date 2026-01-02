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

export default function OnboardingEnhanceValuesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [coreValues, setCoreValues] = useState<string[]>([]);
  const [importantQualities, setImportantQualities] = useState<string[]>([]);
  const [dealBreakers, setDealBreakers] = useState<string[]>([]);

  const valueOptions = [
    'Honesty', 'Respect', 'Communication', 'Sustainability', 'Diversity',
    'Collaboration', 'Independence', 'Growth', 'Community', 'Creativity'
  ];

  const qualityOptions = [
    'Cleanliness', 'Punctuality', 'Friendliness', 'Quietness', 'Flexibility',
    'Organization', 'Openness', 'Reliability', 'Humor', 'Empathy'
  ];

  const dealBreakerOptions = [
    'Smoking indoors', 'Loud noise late night', 'Messiness', 'No cleaning',
    'Bringing strangers often', 'Not respecting boundaries', 'Pets (if allergic)',
    'No communication', 'Invasion of privacy'
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

  const handleToggleValue = (value: string) => {
    if (coreValues.includes(value)) {
      setCoreValues(coreValues.filter(v => v !== value));
    } else if (coreValues.length < 5) {
      setCoreValues([...coreValues, value]);
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

  const handleNext = () => {
    safeLocalStorage.set('enhanceValues', { coreValues, importantQualities, dealBreakers });
    router.push('/onboarding/searcher/enhance');
  };

  const handleSkip = () => {
    router.push('/onboarding/searcher/enhance');
  };

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
        title={t('enhanceSearcher.values.title')}
        description={t('enhanceSearcher.values.description')}
        icon={<Sparkles className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Core Values */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">{t('enhanceSearcher.values.coreValues.title')}</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">{t('enhanceSearcher.values.coreValues.subtitle')}</p>
          <div className="flex flex-wrap gap-2">
            {valueOptions.map((value) => (
              <EnhanceProfileTag
                key={value}
                role="searcher"
                selected={coreValues.includes(value)}
                onClick={() => handleToggleValue(value)}
                disabled={!coreValues.includes(value) && coreValues.length >= 5}
              >
                {t(`enhanceSearcher.values.coreValues.options.${value.toLowerCase()}`)}
              </EnhanceProfileTag>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">{coreValues.length}/5 {t('enhanceSearcher.values.selected')}</p>
        </EnhanceProfileSection>

        {/* Important Qualities */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <ThumbsUp className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">{t('enhanceSearcher.values.qualities.title')}</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">{t('enhanceSearcher.values.qualities.subtitle')}</p>
          <div className="flex flex-wrap gap-2">
            {qualityOptions.map((quality) => (
              <EnhanceProfileTag
                key={quality}
                role="searcher"
                selected={importantQualities.includes(quality)}
                onClick={() => handleToggleQuality(quality)}
              >
                {t(`enhanceSearcher.values.qualities.options.${quality.toLowerCase()}`)}
              </EnhanceProfileTag>
            ))}
          </div>
          {importantQualities.length > 0 && (
            <p className="text-xs text-gray-500 mt-3">{importantQualities.length} {t('enhanceSearcher.values.selected')}</p>
          )}
        </EnhanceProfileSection>

        {/* Deal Breakers */}
        <EnhanceProfileSection>
          <div className="bg-white p-6 rounded-2xl border-2 border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-orange-600">{t('enhanceSearcher.values.dealBreakers.title')}</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">{t('enhanceSearcher.values.dealBreakers.subtitle')}</p>
            <div className="flex flex-wrap gap-2">
              {dealBreakerOptions.map((dealBreaker, index) => (
                <button
                  key={dealBreaker}
                  onClick={() => handleToggleDealBreaker(dealBreaker)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    dealBreakers.includes(dealBreaker)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t(`enhanceSearcher.values.dealBreakers.options.option${index + 1}`)}
                </button>
              ))}
            </div>
            {dealBreakers.length > 0 && (
              <p className="text-xs text-gray-500 mt-3">{dealBreakers.length} {t('enhanceSearcher.values.selected')}</p>
            )}
          </div>
        </EnhanceProfileSection>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-8">
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
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
