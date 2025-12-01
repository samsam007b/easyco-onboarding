'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Coffee, Moon, Music, Utensils, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileSelectionCard,
  EnhanceProfileSection,
} from '@/components/enhance-profile';

export default function LifestyleResidentPage() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Lifestyle preferences
  const [sleepSchedule, setSleepSchedule] = useState<'early-bird' | 'night-owl' | 'flexible' | ''>('');
  const [cleanliness, setCleanliness] = useState<'very-clean' | 'moderately-clean' | 'relaxed' | ''>('');
  const [noiseTolerance, setNoiseTolerance] = useState<'quiet' | 'moderate' | 'lively' | ''>('');
  const [cookingFrequency, setCookingFrequency] = useState<'daily' | 'often' | 'rarely' | ''>('');
  const [guestsFrequency, setGuestsFrequency] = useState<'never' | 'rarely' | 'sometimes' | 'often' | ''>('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('lifestyle_preferences')
        .eq('user_id', user.id)
        .single();

      if (profileData?.lifestyle_preferences) {
        const prefs = profileData.lifestyle_preferences;
        setSleepSchedule(prefs.sleepSchedule || '');
        setCleanliness(prefs.cleanliness || '');
        setNoiseTolerance(prefs.noiseTolerance || '');
        setCookingFrequency(prefs.cookingFrequency || '');
        setGuestsFrequency(prefs.guestsFrequency || '');
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading lifestyle preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!sleepSchedule || !cleanliness || !noiseTolerance) {
      toast.error('Please answer all required questions');
      return;
    }

    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const lifestylePreferences = {
        sleepSchedule,
        cleanliness,
        noiseTolerance,
        cookingFrequency,
        guestsFrequency,
      };

      const { error } = await supabase
        .from('user_profiles')
        .update({ lifestyle_preferences: lifestylePreferences })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Lifestyle preferences saved!');
      router.push('/dashboard/resident');
    } catch (error) {
      // FIXME: Use logger.error('Error saving lifestyle preferences:', error);
      toast.error(common.errors.unexpected);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <EnhanceProfileLayout
      role="resident"
      backUrl="/dashboard/resident"
      backLabel="Back to Dashboard"
      isLoading={isLoading}
      loadingText="Loading your lifestyle preferences..."
    >
      {/* Header */}
      <EnhanceProfileHeading
        role="resident"
        title="Lifestyle Preferences"
        description="Help us understand your daily lifestyle and living habits"
        icon={<Coffee className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Sleep Schedule */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Moon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sleep Schedule *</h3>
              <p className="text-sm text-gray-500">When do you typically sleep?</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: 'early-bird', emoji: '🌅', label: 'Early Bird', desc: 'Sleep before 11pm' },
              { value: 'night-owl', emoji: '🦉', label: 'Night Owl', desc: 'Sleep after 1am' },
              { value: 'flexible', emoji: '⏰', label: 'Flexible', desc: 'Varies by day' }
            ].map(option => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="resident"
                selected={sleepSchedule === option.value}
                onClick={() => setSleepSchedule(option.value as any)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                </div>
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Cleanliness */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Cleanliness Level *</h3>
              <p className="text-sm text-gray-500">How clean do you keep your space?</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: 'very-clean', emoji: '✨', label: 'Very Clean', desc: 'Everything spotless' },
              { value: 'moderately-clean', emoji: '👍', label: 'Moderate', desc: 'Tidy most times' },
              { value: 'relaxed', emoji: '😌', label: 'Relaxed', desc: 'Lived-in feel' }
            ].map(option => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="resident"
                selected={cleanliness === option.value}
                onClick={() => setCleanliness(option.value as any)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                </div>
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Noise Tolerance */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
              <Music className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Noise Preference *</h3>
              <p className="text-sm text-gray-500">What's your ideal noise level?</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: 'quiet', emoji: '🤫', label: 'Quiet', desc: 'Peace & tranquility' },
              { value: 'moderate', emoji: '🔉', label: 'Moderate', desc: 'Normal sounds OK' },
              { value: 'lively', emoji: '🔊', label: 'Lively', desc: 'Energy & vibes' }
            ].map(option => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="resident"
                selected={noiseTolerance === option.value}
                onClick={() => setNoiseTolerance(option.value as any)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                </div>
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Cooking Frequency */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Cooking Frequency</h3>
              <p className="text-sm text-gray-500">How often do you cook at home?</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: 'daily', label: 'Daily', emoji: '👨‍🍳' },
              { value: 'often', label: 'Often', emoji: '🍳' },
              { value: 'rarely', label: 'Rarely', emoji: '🍕' }
            ].map(option => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="resident"
                selected={cookingFrequency === option.value}
                onClick={() => setCookingFrequency(option.value as any)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="font-medium">{option.label}</div>
                </div>
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Guests Frequency */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Having Guests Over</h3>
              <p className="text-sm text-gray-500">How often do you have visitors?</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: 'never', label: 'Never' },
              { value: 'rarely', label: 'Rarely' },
              { value: 'sometimes', label: 'Sometimes' },
              { value: 'often', label: 'Often' }
            ].map(option => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="resident"
                selected={guestsFrequency === option.value}
                onClick={() => setGuestsFrequency(option.value as any)}
              >
                <div className="text-center font-medium">{option.label}</div>
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>
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
          disabled={isSaving || !sleepSchedule || !cleanliness || !noiseTolerance}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </EnhanceProfileButton>
      </div>
    </EnhanceProfileLayout>
  );
}
