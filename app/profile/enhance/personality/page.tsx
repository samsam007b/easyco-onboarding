'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Music, Book, Coffee } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
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
      toast.error('Failed to load existing data');
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
    toast.success('Personality details saved!');
    router.push('/dashboard/my-profile');
  };

  const handleCancel = () => {
    router.push('/dashboard/my-profile');
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
      role="searcher"
      backUrl="/dashboard/my-profile"
      backLabel="Back to Profile"
      progress={undefined}
      isLoading={isLoading}
      loadingText="Loading your information..."
    >
      <EnhanceProfileHeading
        role="searcher"
        title="Extended Personality"
        description="Share more about yourself to help find compatible roommates"
        icon={<Heart className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Hobbies */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your Hobbies
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={hobbyInput}
              onChange={(e) => setHobbyInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHobby())}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
              placeholder="Add a hobby"
            />
            <EnhanceProfileButton
              role="searcher"
              onClick={addHobby}
              className="px-6"
            >
              Add
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
            Your Interests
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interestOptions.map((interest) => (
              <EnhanceProfileTag
                key={interest}
                role="searcher"
                selected={interests.includes(interest)}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </EnhanceProfileTag>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Personality Traits */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Personality Traits
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {traitOptions.map((trait) => (
              <EnhanceProfileTag
                key={trait}
                role="searcher"
                selected={personalityTraits.includes(trait)}
                onClick={() => toggleTrait(trait)}
              >
                {trait}
              </EnhanceProfileTag>
            ))}
          </div>
        </EnhanceProfileSection>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-8">
        <EnhanceProfileButton
          role="searcher"
          variant="outline"
          onClick={handleCancel}
          className="flex-1"
        >
          Cancel
        </EnhanceProfileButton>
        <EnhanceProfileButton
          role="searcher"
          onClick={handleSave}
          className="flex-1"
        >
          Save Changes
        </EnhanceProfileButton>
      </div>
    </EnhanceProfileLayout>
  );
}
