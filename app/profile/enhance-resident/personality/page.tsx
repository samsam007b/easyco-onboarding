'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Heart, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

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
      console.error('Error loading personality data:', error);
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
      router.push('/dashboard/my-profile-resident');
    } catch (error) {
      console.error('Error saving personality:', error);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4A148C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push('/dashboard/my-profile-resident')}
          className="mb-6 text-[#4A148C] hover:opacity-70 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#4A148C]">
              Personality & Interests
            </h1>
          </div>
          <p className="text-gray-600">
            Share more about yourself to connect with like-minded neighbors
          </p>
        </div>

        <div className="space-y-6">
          {/* Hobbies */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Your Hobbies</h3>
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                value={hobbyInput}
                onChange={(e) => setHobbyInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addHobby()}
                placeholder="Add a hobby..."
                className="flex-1"
              />
              <Button onClick={addHobby} className="bg-[#4A148C] hover:bg-[#4A148C]/90">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby) => (
                <span
                  key={hobby}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2"
                >
                  {hobby}
                  <button onClick={() => removeHobby(hobby)} className="hover:text-purple-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Interests</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`p-3 rounded-xl text-sm font-medium transition border-2 ${
                    interests.includes(interest)
                      ? 'bg-[#4A148C] text-white border-[#4A148C]'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#4A148C]'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Personality Traits */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Personality Traits</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {traitOptions.map((trait) => (
                <button
                  key={trait}
                  onClick={() => toggleTrait(trait)}
                  className={`p-3 rounded-xl text-sm font-medium transition border-2 ${
                    personalityTraits.includes(trait)
                      ? 'bg-[#FFD600] text-black border-[#FFD600]'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#FFD600]'
                  }`}
                >
                  {trait}
                </button>
              ))}
            </div>
          </div>

          {/* Info callout */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-200">
            <p className="text-sm text-gray-700">
              <strong>Tip:</strong> Sharing your personality helps you connect with neighbors who share similar interests and lifestyles!
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-8">
          <Button
            onClick={() => router.push('/dashboard/my-profile-resident')}
            variant="outline"
            className="flex-1"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-[#FFD600] text-black hover:bg-[#FFD600]/90"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </main>
  );
}
