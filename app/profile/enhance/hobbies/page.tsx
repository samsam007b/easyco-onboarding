'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
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
  EnhanceProfileInfoBox,
} from '@/components/enhance-profile';

export default function EnhanceHobbiesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [newHobby, setNewHobby] = useState('');

  // Map of hobby keys to English names (for storage)
  const hobbyKeys = [
    'reading', 'sports', 'cooking', 'music', 'movies', 'gaming',
    'hiking', 'photography', 'travel', 'art', 'yoga', 'dancing',
    'cycling', 'running', 'swimming', 'drawing', 'writing', 'gardening'
  ];

  // English names for storage compatibility
  const commonHobbies = [
    'Reading', 'Sports', 'Cooking', 'Music', 'Movies', 'Gaming',
    'Hiking', 'Photography', 'Travel', 'Art', 'Yoga', 'Dancing',
    'Cycling', 'Running', 'Swimming', 'Drawing', 'Writing', 'Gardening'
  ];

  // Get translated hobby name
  const getHobbyLabel = (hobby: string): string => {
    const key = hobby.toLowerCase();
    const translationKey = `profileEnhance.hobbies.commonList.${key}`;
    const translated = t(translationKey);
    return translated !== translationKey ? translated : hobby;
  };

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
        const savedData = safeLocalStorage.get('enhanceHobbies', {}) as any;
        if (savedData.hobbies && savedData.hobbies.length > 0) {
          setHobbies(savedData.hobbies);
        } else {
          // Load from database
          const { data: profileData } = await getOnboardingData(user.id);
          if (profileData && profileData.hobbies) {
            setHobbies(profileData.hobbies);
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

  const handleAddHobby = () => {
    if (newHobby && !hobbies.includes(newHobby)) {
      setHobbies([...hobbies, newHobby]);
      setNewHobby('');
    }
  };

  const handleRemoveHobby = (hobby: string) => {
    setHobbies(hobbies.filter(h => h !== hobby));
  };

  const handleToggleCommonHobby = (hobby: string) => {
    if (hobbies.includes(hobby)) {
      handleRemoveHobby(hobby);
    } else {
      setHobbies([...hobbies, hobby]);
    }
  };

  const handleNext = async () => {
    // Save to localStorage for immediate feedback
    safeLocalStorage.set('enhanceHobbies', { hobbies });

    // Save to database
    try {
      await fetch('/api/profile/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'hobbies',
          data: { hobbies }
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
      backUrl="/profile"
      backLabel={t('profileEnhance.common.backToProfile')}
      progress={undefined}
      isLoading={isLoading}
      loadingText={t('profileEnhance.hobbies.loading')}
    >
      <EnhanceProfileHeading
        role="searcher"
        title={t('profileEnhance.hobbies.title')}
        description={t('profileEnhance.hobbies.description')}
        icon={<Heart className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Common Hobbies */}
        <EnhanceProfileSection>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('profileEnhance.hobbies.selectCommon')}</h2>
          <div className="flex flex-wrap gap-2">
            {commonHobbies.map((hobby) => (
              <EnhanceProfileTag
                key={hobby}
                role="searcher"
                selected={hobbies.includes(hobby)}
                onClick={() => handleToggleCommonHobby(hobby)}
              >
                {getHobbyLabel(hobby)}
              </EnhanceProfileTag>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Custom Hobbies */}
        <EnhanceProfileSection>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('profileEnhance.hobbies.addOwn')}</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddHobby()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder={t('profileEnhance.hobbies.addPlaceholder')}
            />
            <EnhanceProfileButton
              role="searcher"
              variant="secondary"
              onClick={handleAddHobby}
              className="px-6"
            >
              {t('profileEnhance.common.add')}
            </EnhanceProfileButton>
          </div>

          {hobbies.filter(h => !commonHobbies.includes(h)).length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">{t('profileEnhance.hobbies.customHobbies')}</p>
              <div className="flex flex-wrap gap-2">
                {hobbies.filter(h => !commonHobbies.includes(h)).map((hobby) => (
                  <EnhanceProfileTag
                    key={hobby}
                    role="searcher"
                    selected={true}
                    onRemove={() => handleRemoveHobby(hobby)}
                  >
                    {hobby}
                  </EnhanceProfileTag>
                ))}
              </div>
            </div>
          )}
        </EnhanceProfileSection>

        {/* Selected Count */}
        {hobbies.length > 0 && (
          <EnhanceProfileInfoBox role="searcher">
            <p className="text-sm font-medium">
              {hobbies.length} {hobbies.length === 1 ? t('profileEnhance.hobbies.selected') : t('profileEnhance.hobbies.selectedPlural')}
            </p>
          </EnhanceProfileInfoBox>
        )}
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
          onClick={handleNext}
          className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          {t('profileEnhance.common.save')}
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
