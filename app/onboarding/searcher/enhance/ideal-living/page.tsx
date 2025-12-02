'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Users, Building2, Calendar, Volume2 } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { getOnboardingData } from '@/lib/onboarding-helpers';
import IconBadge from '@/components/IconBadge';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileSelectionCard,
  EnhanceProfileSection,
  EnhanceProfileInfoBox,
} from '@/components/enhance-profile';

export default function OnboardingIdealLivingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [colivingSize, setColivingSize] = useState('');
  const [genderMix, setGenderMix] = useState('');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);
  const [sharedSpaceImportance, setSharedSpaceImportance] = useState(5);
  const [quietHoursPreference, setQuietHoursPreference] = useState(false);

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
        const savedData = safeLocalStorage.get('idealLiving', {}) as any;
        if (savedData.colivingSize) setColivingSize(savedData.colivingSize);
        if (savedData.genderMix) setGenderMix(savedData.genderMix);
        if (savedData.minAge) setMinAge(savedData.minAge);
        if (savedData.maxAge) setMaxAge(savedData.maxAge);
        if (savedData.sharedSpaceImportance) setSharedSpaceImportance(savedData.sharedSpaceImportance);
        if (savedData.quietHoursPreference !== undefined) setQuietHoursPreference(savedData.quietHoursPreference);

        // If nothing in localStorage, load from database
        if (!savedData.colivingSize) {
          const { data: profileData } = await getOnboardingData(user.id);
          if (profileData) {
            setColivingSize(profileData.preferredColivingSize || '');
            setGenderMix(profileData.genderPreference || '');
            setMinAge(profileData.ageRangeMin || 18);
            setMaxAge(profileData.ageRangeMax || 35);
            setSharedSpaceImportance(profileData.sharedSpaceImportance || 5);
            setQuietHoursPreference(profileData.quietHoursPreference || false);
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
    safeLocalStorage.set('idealLiving', {
      colivingSize,
      genderMix,
      minAge,
      maxAge,
      sharedSpaceImportance,
      quietHoursPreference,
    });
    router.push('/onboarding/searcher/enhance');
  };

  const handleSkip = () => {
    router.push('/onboarding/searcher/enhance');
  };

  const colivingSizes = [
    { value: 'small', label: '2-3 People', icon: Users, variant: 'purple' as const, description: 'Intimate & Quiet' },
    { value: 'medium', label: '4-6 People', icon: Users, variant: 'blue' as const, description: 'Perfect Balance' },
    { value: 'large', label: '7-10 People', icon: Users, variant: 'green' as const, description: 'Vibrant Community' },
    { value: 'xlarge', label: '10+ People', icon: Building2, variant: 'orange' as const, description: 'Large Community' },
  ];

  const genderMixOptions = [
    { value: 'male-only', label: 'Male Only' },
    { value: 'female-only', label: 'Female Only' },
    { value: 'mixed', label: 'Mixed Gender' },
    { value: 'no-preference', label: 'No Preference' },
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
        title="Ideal Living Situation"
        description="Tell us about your ideal coliving environment"
        icon={<Home className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Preferred Coliving Size */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <Home className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">Preferred Community Size</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">How many people would you like to live with?</p>
          <div className="grid grid-cols-2 gap-3">
            {colivingSizes.map((size) => (
              <button
                key={size.value}
                onClick={() => setColivingSize(size.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  colivingSize === size.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <IconBadge icon={size.icon} variant={size.variant} size="lg" />
                  </div>
                  <div className={`font-semibold text-sm mb-1 ${
                    colivingSize === size.value ? 'text-orange-600' : 'text-gray-900'
                  }`}>
                    {size.label}
                  </div>
                  <div className="text-xs text-gray-500">{size.description}</div>
                </div>
              </button>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Gender Mix Preference */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">Gender Mix Preference</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">What gender mix do you prefer?</p>
          <div className="grid grid-cols-2 gap-3">
            {genderMixOptions.map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="searcher"
                selected={genderMix === option.value}
                onClick={() => setGenderMix(option.value)}
              >
                {option.label}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Age Range Preference */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">Preferred Age Range</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">What age range are you comfortable with?</p>

          <div className="space-y-4">
            {/* Min Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Age: <span className="text-orange-600 font-bold">{minAge}</span>
              </label>
              <input
                type="range"
                min="18"
                max="65"
                value={minAge}
                onChange={(e) => setMinAge(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* Max Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Age: <span className="text-orange-600 font-bold">{maxAge}</span>
              </label>
              <input
                type="range"
                min="18"
                max="65"
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          </div>
        </EnhanceProfileSection>

        {/* Shared Space Importance */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">Shared Spaces Importance</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">How important are shared common areas to you?</p>

          <div className="space-y-3">
            <input
              type="range"
              min="1"
              max="10"
              value={sharedSpaceImportance}
              onChange={(e) => setSharedSpaceImportance(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Not Important</span>
              <span className="text-2xl font-bold text-orange-600">{sharedSpaceImportance}</span>
              <span className="text-sm text-gray-500">Very Important</span>
            </div>
          </div>
        </EnhanceProfileSection>

        {/* Quiet Hours Preference */}
        <EnhanceProfileSection>
          <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-700 block">Quiet Hours Preference</span>
                  <span className="text-sm text-gray-500">Do you prefer established quiet hours?</span>
                </div>
              </div>
              <button
                onClick={() => setQuietHoursPreference(!quietHoursPreference)}
                className={`relative w-[52px] h-[32px] rounded-full transition-all duration-300 flex-shrink-0 ${
                  quietHoursPreference ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-[2px] left-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-md transition-all duration-300 ${
                    quietHoursPreference ? 'translate-x-[20px]' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </EnhanceProfileSection>

        {/* Info box */}
        <EnhanceProfileInfoBox role="searcher">
          <p className="text-sm text-gray-600">
            These preferences help us match you with properties and communities that fit your ideal living situation.
          </p>
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
