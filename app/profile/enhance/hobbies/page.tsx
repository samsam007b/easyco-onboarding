'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { getOnboardingData } from '@/lib/onboarding-helpers';
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
  const [isLoading, setIsLoading] = useState(true);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [newHobby, setNewHobby] = useState('');

  const commonHobbies = [
    'Reading', 'Sports', 'Cooking', 'Music', 'Movies', 'Gaming',
    'Hiking', 'Photography', 'Travel', 'Art', 'Yoga', 'Dancing',
    'Cycling', 'Running', 'Swimming', 'Drawing', 'Writing', 'Gardening'
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
    router.push('/profile/enhance/values');
  };

  const handleSkip = () => {
    router.push('/profile/enhance/values');
  };

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/profile/enhance/about"
      backLabel="Back"
      progress={{
        current: 2,
        total: 6,
        label: 'Step 2 of 6',
        stepName: 'Hobbies & Interests',
      }}
      isLoading={isLoading}
      loadingText="Loading your hobbies..."
    >
      <EnhanceProfileHeading
        role="searcher"
        title="Your Hobbies & Interests"
        description="Help us find roommates who share your passions"
        icon={<Heart className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Common Hobbies */}
        <EnhanceProfileSection>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Select from common hobbies:</h2>
          <div className="flex flex-wrap gap-2">
            {commonHobbies.map((hobby) => (
              <EnhanceProfileTag
                key={hobby}
                role="searcher"
                selected={hobbies.includes(hobby)}
                onClick={() => handleToggleCommonHobby(hobby)}
              >
                {hobby}
              </EnhanceProfileTag>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Custom Hobbies */}
        <EnhanceProfileSection>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Add your own hobbies:</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddHobby()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Add a hobby..."
            />
            <EnhanceProfileButton
              role="searcher"
              variant="secondary"
              onClick={handleAddHobby}
              className="px-6"
            >
              Add
            </EnhanceProfileButton>
          </div>

          {hobbies.filter(h => !commonHobbies.includes(h)).length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Your custom hobbies:</p>
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
              {hobbies.length} {hobbies.length === 1 ? 'hobby' : 'hobbies'} selected
            </p>
          </EnhanceProfileInfoBox>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <EnhanceProfileButton
          role="searcher"
          onClick={handleNext}
          className="flex-1"
        >
          Next
        </EnhanceProfileButton>
        <EnhanceProfileButton
          role="searcher"
          variant="outline"
          onClick={handleSkip}
          className="px-8"
        >
          Skip
        </EnhanceProfileButton>
      </div>
    </EnhanceProfileLayout>
  );
}
