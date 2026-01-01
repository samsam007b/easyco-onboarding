'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Music, Book, Coffee } from 'lucide-react';
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

export default function ExtendedPersonalityPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLanguage();
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
      toast.error(t('profileEnhance.personality.loadFailed'));
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

  const handleSave = async () => {
    // Save to localStorage for immediate feedback
    safeLocalStorage.set('extendedPersonality', {
      hobbies,
      interests,
      personalityTraits,
    });

    // Save to database
    try {
      await fetch('/api/profile/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'personality',
          data: { hobbies, interests, personalityTraits }
        })
      });
      toast.success(t('profileEnhance.personality.saved'));
    } catch (error) {
      console.error('Failed to save to database:', error);
      toast.error(t('profileEnhance.personality.saveFailed'));
    }

    router.push('/profile');
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  const interestOptions = [
    'Music', 'Sports', 'Reading', 'Cooking', 'Gaming', 'Travel',
    'Art', 'Photography', 'Fitness', 'Movies', 'Technology', 'Nature'
  ];

  const traitOptions = [
    'Outgoing', 'Introverted', 'Creative', 'Organized', 'Spontaneous',
    'Relaxed', 'Ambitious', 'Friendly', 'Independent', 'Team Player'
  ];

  // Get translated interest name
  const getInterestLabel = (interest: string): string => {
    const key = interest.toLowerCase();
    const translationKey = `profileEnhance.personality.interests.${key}`;
    const translated = t(translationKey);
    return translated !== translationKey ? translated : interest;
  };

  // Get translated trait name
  const getTraitLabel = (trait: string): string => {
    const key = trait.toLowerCase().replace(' ', '');
    const keyMap: Record<string, string> = {
      'outgoing': 'outgoing',
      'introverted': 'introverted',
      'creative': 'creative',
      'organized': 'organized',
      'spontaneous': 'spontaneous',
      'relaxed': 'relaxed',
      'ambitious': 'ambitious',
      'friendly': 'friendly',
      'independent': 'independent',
      'teamplayer': 'teamPlayer'
    };
    const translationKey = `profileEnhance.personality.traits.${keyMap[key] || key}`;
    const translated = t(translationKey);
    return translated !== translationKey ? translated : trait;
  };

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/profile"
      backLabel={t('profileEnhance.common.backToProfile')}
      progress={undefined}
      isLoading={isLoading}
      loadingText={t('profileEnhance.common.loading')}
    >
      <EnhanceProfileHeading
        role="searcher"
        title={t('profileEnhance.personality.title')}
        description={t('profileEnhance.personality.description')}
        icon={<Heart className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Hobbies */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('profileEnhance.personality.yourHobbies')}
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={hobbyInput}
              onChange={(e) => setHobbyInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHobby())}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
              placeholder={t('profileEnhance.personality.addHobbyPlaceholder')}
            />
            <EnhanceProfileButton
              role="searcher"
              onClick={addHobby}
              className="px-6"
            >
              {t('profileEnhance.common.add')}
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
            {t('profileEnhance.personality.yourInterests')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interestOptions.map((interest) => (
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
            {t('profileEnhance.personality.personalityTraits')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {traitOptions.map((trait) => (
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
      <div className="mt-8 flex justify-between items-center gap-4">
        <button
          onClick={handleCancel}
          className="px-6 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          {t('profileEnhance.common.skip')}
          <span className="text-lg">→</span>
        </button>
        <button
          onClick={handleSave}
          className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          {t('profileEnhance.common.save')}
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
