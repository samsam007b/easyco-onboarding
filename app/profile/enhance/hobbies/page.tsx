'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { getOnboardingData } from '@/lib/onboarding-helpers';
import LoadingHouse from '@/components/ui/LoadingHouse';

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

  const handleBack = () => {
    safeLocalStorage.set('enhanceHobbies', { hobbies });
    router.push('/profile/enhance/about');
  };

  const handleSkip = () => {
    router.push('/profile/enhance/values');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingHouse size={80} />
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
            <span className="text-sm font-medium text-[color:var(--easy-purple)]">Step 2 of 6</span>
            <span className="text-sm text-gray-500">Hobbies & Interests</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[color:var(--easy-purple)] h-2 rounded-full" style={{ width: '33%' }} />
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="w-7 h-7 text-[color:var(--easy-purple)]" />
            <h1 className="text-3xl font-bold text-[color:var(--easy-purple)]">Your Hobbies & Interests</h1>
          </div>
          <p className="text-gray-600">Help us find roommates who share your passions</p>
        </div>

        <div className="space-y-6">
          {/* Common Hobbies */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Select from common hobbies:</h2>
            <div className="flex flex-wrap gap-2">
              {commonHobbies.map((hobby) => (
                <button
                  key={hobby}
                  onClick={() => handleToggleCommonHobby(hobby)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    hobbies.includes(hobby)
                      ? 'bg-[color:var(--easy-purple)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {hobby}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Hobbies */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add your own hobbies:</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddHobby()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--easy-purple)]"
                placeholder="Add a hobby..."
              />
              <button
                onClick={handleAddHobby}
                className="px-6 py-2 bg-[color:var(--easy-yellow)] text-black font-medium rounded-xl hover:opacity-90"
              >
                Add
              </button>
            </div>

            {hobbies.filter(h => !commonHobbies.includes(h)).length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Your custom hobbies:</p>
                <div className="flex flex-wrap gap-2">
                  {hobbies.filter(h => !commonHobbies.includes(h)).map((hobby) => (
                    <button
                      key={hobby}
                      onClick={() => handleRemoveHobby(hobby)}
                      className="px-4 py-2 bg-[color:var(--easy-purple)] text-white rounded-full text-sm font-medium hover:opacity-90"
                    >
                      {hobby} ×
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Selected Count */}
          {hobbies.length > 0 && (
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <p className="text-sm text-[color:var(--easy-purple)] font-medium">
                {hobbies.length} {hobbies.length === 1 ? 'hobby' : 'hobbies'} selected
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleNext}
            className="flex-1 py-4 rounded-full bg-[color:var(--easy-yellow)] text-black font-semibold text-lg hover:opacity-90 flex items-center justify-center gap-2"
          >
            Next
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
