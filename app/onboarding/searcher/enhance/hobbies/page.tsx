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

export default function OnboardingEnhanceHobbiesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [newHobby, setNewHobby] = useState('');

  const commonHobbiesKeys = [
    'reading', 'sports', 'cooking', 'music', 'movies', 'gaming',
    'hiking', 'photography', 'travel', 'art', 'yoga', 'dancing',
    'cycling', 'running', 'swimming', 'drawing', 'writing', 'gardening'
  ];

  const getHobbyLabel = (key: string) => t(`enhanceSearcher.hobbies.items.${key}`) || key.charAt(0).toUpperCase() + key.slice(1);

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

  const handleNext = () => {
    safeLocalStorage.set('enhanceHobbies', { hobbies });
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
        title={t('enhanceSearcher.hobbies.title')}
        description={t('enhanceSearcher.hobbies.description')}
        icon={<Heart className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Common Hobbies */}
        <EnhanceProfileSection>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('enhanceSearcher.hobbies.common.title')}</h2>
          <div className="flex flex-wrap gap-2">
            {commonHobbiesKeys.map((hobby) => (
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
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('enhanceSearcher.hobbies.custom.title')}</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddHobby()}
              className="flex-1 px-4 py-2 border border-gray-300 superellipse-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder={t('enhanceSearcher.hobbies.custom.placeholder')}
            />
            <EnhanceProfileButton
              role="searcher"
              variant="secondary"
              onClick={handleAddHobby}
              className="px-6"
            >
              {t('enhanceSearcher.hobbies.custom.add')}
            </EnhanceProfileButton>
          </div>

          {hobbies.filter(h => !commonHobbiesKeys.includes(h)).length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">{t('enhanceSearcher.hobbies.custom.yourHobbies')}</p>
              <div className="flex flex-wrap gap-2">
                {hobbies.filter(h => !commonHobbiesKeys.includes(h)).map((hobby) => (
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
              {hobbies.length} {hobbies.length === 1 ? t('enhanceSearcher.hobbies.count.singular') : t('enhanceSearcher.hobbies.count.plural')}
            </p>
          </EnhanceProfileInfoBox>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-8">
        <button
          onClick={handleNext}
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
