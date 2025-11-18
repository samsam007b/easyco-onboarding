'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Music, Book, Coffee } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import LoadingHouse from '@/components/ui/LoadingHouse';

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

  const interestOptions = [
    'Music', 'Sports', 'Reading', 'Cooking', 'Gaming', 'Travel',
    'Art', 'Photography', 'Fitness', 'Movies', 'Technology', 'Nature'
  ];

  const traitOptions = [
    'Outgoing', 'Introverted', 'Creative', 'Organized', 'Spontaneous',
    'Relaxed', 'Ambitious', 'Friendly', 'Independent', 'Team Player'
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600">Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push('/dashboard/my-profile')}
          className="mb-6 text-[color:var(--easy-purple)] hover:opacity-70 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-[color:var(--easy-purple)]">
              Extended Personality
            </h1>
          </div>
          <p className="text-gray-600">
            Share more about yourself to help find compatible roommates
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Hobbies */}
          <div className="bg-white rounded-2xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Hobbies
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={hobbyInput}
                onChange={(e) => setHobbyInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHobby())}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
                placeholder="Add a hobby"
              />
              <button
                onClick={addHobby}
                className="px-6 py-3 rounded-xl bg-[color:var(--easy-purple)] text-white font-medium hover:opacity-90 transition"
              >
                Add
              </button>
            </div>

            {hobbies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {hobbies.map((hobby) => (
                  <span
                    key={hobby}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--easy-yellow)] text-black text-sm font-medium"
                  >
                    {hobby}
                    <button onClick={() => removeHobby(hobby)} className="hover:opacity-70">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Interests */}
          <div className="bg-white rounded-2xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Interests
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-3 rounded-xl font-medium transition border-2 ${
                    interests.includes(interest)
                      ? 'bg-[color:var(--easy-purple)] text-white border-[color:var(--easy-purple)]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[color:var(--easy-purple)]'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Personality Traits */}
          <div className="bg-white rounded-2xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Personality Traits
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {traitOptions.map((trait) => (
                <button
                  key={trait}
                  onClick={() => toggleTrait(trait)}
                  className={`px-4 py-3 rounded-xl font-medium transition border-2 ${
                    personalityTraits.includes(trait)
                      ? 'bg-[color:var(--easy-purple)] text-white border-[color:var(--easy-purple)]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[color:var(--easy-purple)]'
                  }`}
                >
                  {trait}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => router.push('/dashboard/my-profile')}
            className="flex-1 py-4 rounded-full font-semibold text-lg transition border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-4 rounded-full font-semibold text-lg transition shadow-md bg-[color:var(--easy-yellow)] text-black hover:opacity-90 hover:shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </main>
  );
}
