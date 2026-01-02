'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileTag,
  EnhanceProfileSection,
} from '@/components/enhance-profile';

export default function OnboardingExtendedPersonalityPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [hobbyInput, setHobbyInput] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [personalityTraits, setPersonalityTraits] = useState<string[]>([]);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('extendedPersonality', {}) as any;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData?.extended_personality) {
          const personality = profileData.extended_personality;
          setHobbies(saved.hobbies || personality.hobbies || []);
          setInterests(saved.interests || personality.interests || []);
          setPersonalityTraits(saved.personalityTraits || personality.traits || []);
        } else if (saved.hobbies) {
          setHobbies(saved.hobbies);
          setInterests(saved.interests || []);
          setPersonalityTraits(saved.personalityTraits || []);
        }
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading personality data:', error);
      toast.error(t('common.errors.loadFailed') || 'Failed to load existing data');
    } finally {
      setIsLoading(false);
    }
  };

  const addHobby = () => {
    if (hobbyInput.trim() && !hobbies.includes(hobbyInput.trim())) {
      setHobbies([...hobbies, hobbyInput.trim()]);
      setHobbyInput('');
    }
  };

  const removeHobby = (hobby: string) => {
    setHobbies(hobbies.filter(h => h !== hobby));
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const toggleTrait = (trait: string) => {
    if (personalityTraits.includes(trait)) {
      setPersonalityTraits(personalityTraits.filter(t => t !== trait));
    } else {
      setPersonalityTraits([...personalityTraits, trait]);
    }
  };

  const handleSave = () => {
    safeLocalStorage.set('extendedPersonality', {
      hobbies,
      interests,
      personalityTraits,
    });
    toast.success(t('common.saved') || 'Saved!');
    router.push('/onboarding/searcher/enhance');
  };

  const handleSkip = () => {
    router.push('/onboarding/searcher/enhance');
  };

  const interestOptionKeys = [
    'music', 'sports', 'reading', 'cooking', 'gaming', 'travel',
    'art', 'photography', 'fitness', 'movies', 'technology', 'nature'
  ];

  const traitOptionKeys = [
    'outgoing', 'introverted', 'creative', 'organized', 'spontaneous',
    'relaxed', 'ambitious', 'friendly', 'independent', 'teamPlayer'
  ];

  const getInterestLabel = (key: string) => t(`enhanceSearcher.personality.interests.options.${key}`) || key.charAt(0).toUpperCase() + key.slice(1);
  const getTraitLabel = (key: string) => t(`enhanceSearcher.personality.traits.options.${key}`) || key.charAt(0).toUpperCase() + key.slice(1);

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
        title={t('enhanceSearcher.personality.title')}
        description={t('enhanceSearcher.personality.description')}
        icon={<Heart className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Hobbies */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('enhanceSearcher.personality.hobbies.title')}
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={hobbyInput}
              onChange={(e) => setHobbyInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHobby())}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
              placeholder={t('enhanceSearcher.personality.hobbies.placeholder')}
            />
            <EnhanceProfileButton
              role="searcher"
              onClick={addHobby}
              className="px-6"
            >
              {t('enhanceSearcher.personality.hobbies.add')}
            </EnhanceProfileButton>
          </div>

          {hobbies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby) => (
                <EnhanceProfileTag
                  key={hobby}
                  role="searcher"
                  selected={true}
                  onRemove={() => removeHobby(hobby)}
                >
                  {hobby}
                </EnhanceProfileTag>
              ))}
            </div>
          )}
        </EnhanceProfileSection>

        {/* Interests */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('enhanceSearcher.personality.interests.title')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interestOptionKeys.map((interest) => (
              <EnhanceProfileTag
                key={interest}
                role="searcher"
                selected={interests.includes(interest)}
                onClick={() => toggleInterest(interest)}
              >
                {getInterestLabel(interest)}
              </EnhanceProfileTag>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Personality Traits */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('enhanceSearcher.personality.traits.title')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {traitOptionKeys.map((trait) => (
              <EnhanceProfileTag
                key={trait}
                role="searcher"
                selected={personalityTraits.includes(trait)}
                onClick={() => toggleTrait(trait)}
              >
                {getTraitLabel(trait)}
              </EnhanceProfileTag>
            ))}
          </div>
        </EnhanceProfileSection>
      </div>

      {/* Action buttons */}
      <div className="space-y-3 mt-8">
        <button
          onClick={handleSave}
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
