'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Sparkles, ThumbsUp, AlertTriangle } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { getOnboardingData } from '@/lib/onboarding-helpers';
import LoadingHouse from '@/components/ui/LoadingHouse';

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
    router.push('/profile/enhance/financial');
  };

  const handleBack = () => {
    safeLocalStorage.set('enhanceValues', { coreValues, importantQualities, dealBreakers });
    router.push('/profile/enhance/hobbies');
  };

  const handleSkip = () => {
    router.push('/profile/enhance/financial');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingHouse size={48} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={handleBack} className="mb-6 text-[color:var(--easy-purple)]">
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[color:var(--easy-purple)]">Step 3 of 6</span>
            <span className="text-sm text-gray-500">Values & Preferences</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[color:var(--easy-purple)] h-2 rounded-full" style={{ width: '50%' }} />
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-7 h-7 text-[color:var(--easy-purple)]" />
            <h1 className="text-3xl font-bold text-[color:var(--easy-purple)]">Your Values & Preferences</h1>
          </div>
          <p className="text-gray-600">Help us understand what matters most to you</p>
        </div>

        <div className="space-y-6">
          {/* Core Values */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[color:var(--easy-purple)]" />
              <h2 className="text-lg font-semibold text-gray-800">Core Values</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">Select what matters most to you (choose up to 5):</p>
            <div className="flex flex-wrap gap-2">
              {valueOptions.map((value) => (
                <button
                  key={value}
                  onClick={() => handleToggleValue(value)}
                  disabled={!coreValues.includes(value) && coreValues.length >= 5}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    coreValues.includes(value)
                      ? 'bg-[color:var(--easy-purple)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">{coreValues.length}/5 selected</p>
          </div>

          {/* Important Qualities */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center gap-2 mb-3">
              <ThumbsUp className="w-5 h-5 text-[color:var(--easy-purple)]" />
              <h2 className="text-lg font-semibold text-gray-800">Important Qualities in a Roommate</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">What qualities do you value in a roommate?</p>
            <div className="flex flex-wrap gap-2">
              {qualityOptions.map((quality) => (
                <button
                  key={quality}
                  onClick={() => handleToggleQuality(quality)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    importantQualities.includes(quality)
                      ? 'bg-[color:var(--easy-purple)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {quality}
                </button>
              ))}
            </div>
            {importantQualities.length > 0 && (
              <p className="text-xs text-gray-500 mt-3">{importantQualities.length} selected</p>
            )}
          </div>

          {/* Deal Breakers */}
          <div className="bg-white p-6 rounded-2xl shadow border-2 border-orange-200">
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
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleNext}
            className="flex-1 py-4 rounded-full bg-[color:var(--easy-yellow)] text-black font-semibold text-lg hover:opacity-90 flex items-center justify-center gap-2"
          >
            Review & Save
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={handleSkip}
            className="px-8 py-4 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
          >
            Skip
          </button>
        </div>
      </div>
    </main>
  );
}
