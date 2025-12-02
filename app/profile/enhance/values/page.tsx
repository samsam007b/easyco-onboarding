'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ThumbsUp, AlertTriangle } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { getOnboardingData } from '@/lib/onboarding-helpers';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileTag,
  EnhanceProfileSection,
} from '@/components/enhance-profile';

export default function EnhanceValuesPage() {
  const router = useRouter();
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
    router.push('/profile');
  };

  const handleSkip = () => {
    router.push('/profile');
  };

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/profile"
      backLabel="Back to Profile"
      progress={undefined}
      isLoading={isLoading}
      loadingText="Loading your values..."
    >
      <EnhanceProfileHeading
        role="searcher"
        title="Your Values & Preferences"
        description="Help us understand what matters most to you"
        icon={<Sparkles className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Core Values */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">Core Values</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Select what matters most to you (choose up to 5):</p>
          <div className="flex flex-wrap gap-2">
            {valueOptions.map((value) => (
              <EnhanceProfileTag
                key={value}
                role="searcher"
                selected={coreValues.includes(value)}
                onClick={() => handleToggleValue(value)}
                disabled={!coreValues.includes(value) && coreValues.length >= 5}
              >
                {value}
              </EnhanceProfileTag>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">{coreValues.length}/5 selected</p>
        </EnhanceProfileSection>

        {/* Important Qualities */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <ThumbsUp className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">Important Qualities in a Roommate</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">What qualities do you value in a roommate?</p>
          <div className="flex flex-wrap gap-2">
            {qualityOptions.map((quality) => (
              <EnhanceProfileTag
                key={quality}
                role="searcher"
                selected={importantQualities.includes(quality)}
                onClick={() => handleToggleQuality(quality)}
              >
                {quality}
              </EnhanceProfileTag>
            ))}
          </div>
          {importantQualities.length > 0 && (
            <p className="text-xs text-gray-500 mt-3">{importantQualities.length} selected</p>
          )}
        </EnhanceProfileSection>

        {/* Deal Breakers */}
        <EnhanceProfileSection>
          <div className="bg-white p-6 rounded-2xl border-2 border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-orange-600">Deal Breakers</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">Select behaviors or situations you absolutely cannot tolerate:</p>
            <div className="flex flex-wrap gap-2">
              {dealBreakerOptions.map((dealBreaker) => (
                <button
                  key={dealBreaker}
                  onClick={() => handleToggleDealBreaker(dealBreaker)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    dealBreakers.includes(dealBreaker)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dealBreaker}
                </button>
              ))}
            </div>
            {dealBreakers.length > 0 && (
              <p className="text-xs text-gray-500 mt-3">{dealBreakers.length} selected</p>
            )}
          </div>
        </EnhanceProfileSection>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between items-center gap-4">
        <button
          onClick={handleSkip}
          className="px-6 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          Skip
          <span className="text-lg">→</span>
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          Save
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
