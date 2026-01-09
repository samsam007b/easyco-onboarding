'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Input } from '@/components/ui/input';
import { Heart, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileSelectionCard,
  EnhanceProfileTag,
  EnhanceProfileInfoBox,
  EnhanceProfileSection,
} from '@/components/enhance-profile';

export default function PersonalityResidentPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t, getSection } = useLanguage();
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [hobbyInput, setHobbyInput] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [personalityTraits, setPersonalityTraits] = useState<string[]>([]);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('extended_personality, interests')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        if (profileData.extended_personality) {
          const personality = profileData.extended_personality;
          setHobbies(personality.hobbies || []);
          setInterests(personality.interests || []);
          setPersonalityTraits(personality.traits || []);
        }
        if (profileData.interests) {
          // If interests is stored as string, convert to array
          const interestsData = typeof profileData.interests === 'string'
            ? profileData.interests.split(',').map((i: string) => i.trim())
            : profileData.interests;
          if (interests.length === 0) setInterests(interestsData);
        }
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading personality data:', error);
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
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const extendedPersonality = {
        hobbies,
        interests,
        traits: personalityTraits,
      };

      const { error } = await supabase
        .from('user_profiles')
        .update({
          extended_personality: extendedPersonality,
          interests: interests.join(', ')
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success(t('enhanceResident.personality.saved'));
      router.push('/dashboard/resident');
    } catch (error) {
      // FIXME: Use logger.error('Error saving personality:', error);
      toast.error(common.errors.unexpected);
    } finally {
      setIsSaving(false);
    }
  };

  const interestOptions = [
    { value: 'Music', key: 'music' },
    { value: 'Sports', key: 'sports' },
    { value: 'Reading', key: 'reading' },
    { value: 'Cooking', key: 'cooking' },
    { value: 'Gaming', key: 'gaming' },
    { value: 'Travel', key: 'travel' },
    { value: 'Art', key: 'art' },
    { value: 'Photography', key: 'photography' },
    { value: 'Fitness', key: 'fitness' },
    { value: 'Movies', key: 'movies' },
    { value: 'Technology', key: 'technology' },
    { value: 'Nature', key: 'nature' },
  ];

  const traitOptions = [
    { value: 'Outgoing', key: 'outgoing' },
    { value: 'Introverted', key: 'introverted' },
    { value: 'Creative', key: 'creative' },
    { value: 'Organized', key: 'organized' },
    { value: 'Spontaneous', key: 'spontaneous' },
    { value: 'Relaxed', key: 'relaxed' },
    { value: 'Ambitious', key: 'ambitious' },
    { value: 'Friendly', key: 'friendly' },
    { value: 'Independent', key: 'independent' },
    { value: 'Team Player', key: 'teamPlayer' },
  ];

  return (
    <EnhanceProfileLayout
      role="resident"
      backUrl="/dashboard/resident"
      backLabel={t('enhanceResident.common.backToDashboard')}
      isLoading={isLoading}
      loadingText={t('enhanceResident.personality.loading')}
    >
      {/* Header */}
      <EnhanceProfileHeading
        role="resident"
        title={t('enhanceResident.personality.title')}
        description={t('enhanceResident.personality.description')}
        icon={<Heart className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Hobbies */}
        <EnhanceProfileSection title={t('enhanceResident.personality.hobbiesTitle')}>
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              value={hobbyInput}
              onChange={(e) => setHobbyInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHobby()}
              placeholder={t('enhanceResident.personality.hobbiesPlaceholder')}
              className="flex-1 focus:ring-orange-500"
            />
            <button
              onClick={addHobby}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hobbies.map((hobby) => (
              <span
                key={hobby}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-2"
              >
                {hobby}
                <button onClick={() => removeHobby(hobby)} className="hover:text-orange-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Interests */}
        <EnhanceProfileSection title={t('enhanceResident.personality.interestsTitle')}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {interestOptions.map((interest) => (
              <EnhanceProfileTag
                key={interest.value}
                role="resident"
                selected={interests.includes(interest.value)}
                onClick={() => toggleInterest(interest.value)}
              >
                {t(`enhanceResident.personality.interests.${interest.key}`)}
              </EnhanceProfileTag>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Personality Traits */}
        <EnhanceProfileSection title={t('enhanceResident.personality.traitsTitle')}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {traitOptions.map((trait) => (
              <EnhanceProfileTag
                key={trait.value}
                role="resident"
                selected={personalityTraits.includes(trait.value)}
                onClick={() => toggleTrait(trait.value)}
              >
                {t(`enhanceResident.personality.traits.${trait.key}`)}
              </EnhanceProfileTag>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Info callout */}
        <EnhanceProfileInfoBox role="resident" title={t('enhanceResident.personality.tip')} icon="lightbulb">
          {t('enhanceResident.personality.tipContent')}
        </EnhanceProfileInfoBox>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-8">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-4 superellipse-xl font-semibold transition-all duration-300 ${
            !isSaving
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
