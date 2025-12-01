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
  const { getSection } = useLanguage();
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

      toast.success('Personality details saved!');
      router.push('/dashboard/resident');
    } catch (error) {
      // FIXME: Use logger.error('Error saving personality:', error);
      toast.error(common.errors.unexpected);
    } finally {
      setIsSaving(false);
    }
  };

  const interestOptions = [
    'Music', 'Sports', 'Reading', 'Cooking', 'Gaming', 'Travel',
    'Art', 'Photography', 'Fitness', 'Movies', 'Technology', 'Nature'
  ];

  const traitOptions = [
    'Outgoing', 'Introverted', 'Creative', 'Organized', 'Spontaneous',
    'Relaxed', 'Ambitious', 'Friendly', 'Independent', 'Team Player'
  ];

  return (
    <EnhanceProfileLayout
      role="resident"
      backUrl="/dashboard/resident"
      backLabel="Back to Dashboard"
      isLoading={isLoading}
      loadingText="Loading your personality details..."
    >
      {/* Header */}
      <EnhanceProfileHeading
        role="resident"
        title="Personality & Interests"
        description="Share more about yourself to connect with like-minded neighbors"
        icon={<Heart className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Hobbies */}
        <EnhanceProfileSection title="Your Hobbies">
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              value={hobbyInput}
              onChange={(e) => setHobbyInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHobby()}
              placeholder="Add a hobby..."
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
        <EnhanceProfileSection title="Interests">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {interestOptions.map((interest) => (
              <EnhanceProfileTag
                key={interest}
                role="resident"
                selected={interests.includes(interest)}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </EnhanceProfileTag>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Personality Traits */}
        <EnhanceProfileSection title="Personality Traits">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {traitOptions.map((trait) => (
              <EnhanceProfileTag
                key={trait}
                role="resident"
                selected={personalityTraits.includes(trait)}
                onClick={() => toggleTrait(trait)}
              >
                {trait}
              </EnhanceProfileTag>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Info callout */}
        <EnhanceProfileInfoBox role="resident" title="Tip" icon="💡">
          Sharing your personality helps you connect with neighbors who share similar interests and lifestyles!
        </EnhanceProfileInfoBox>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-8">
        <EnhanceProfileButton
          role="resident"
          variant="outline"
          onClick={() => router.push('/dashboard/resident')}
          disabled={isSaving}
        >
          Cancel
        </EnhanceProfileButton>
        <EnhanceProfileButton
          role="resident"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </EnhanceProfileButton>
      </div>
    </EnhanceProfileLayout>
  );
}
