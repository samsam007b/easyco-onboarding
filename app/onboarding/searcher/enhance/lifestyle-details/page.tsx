'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Music, ChefHat, Apple, MessageCircle } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { getOnboardingData } from '@/lib/onboarding-helpers';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileSelectionCard,
  EnhanceProfileSection,
  EnhanceProfileInfoBox,
} from '@/components/enhance-profile';

export default function OnboardingLifestyleDetailsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [musicHabits, setMusicHabits] = useState('');
  const [cookingFrequency, setCookingFrequency] = useState('');
  const [dietType, setDietType] = useState('');
  const [communicationStyle, setCommunicationStyle] = useState('');

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
        const savedData = safeLocalStorage.get('lifestyleDetails', {}) as any;
        if (savedData.musicHabits) setMusicHabits(savedData.musicHabits);
        if (savedData.cookingFrequency) setCookingFrequency(savedData.cookingFrequency);
        if (savedData.dietType) setDietType(savedData.dietType);
        if (savedData.communicationStyle) setCommunicationStyle(savedData.communicationStyle);

        // If nothing in localStorage, load from database
        if (!savedData.musicHabits) {
          const { data: profileData } = await getOnboardingData(user.id);
          if (profileData) {
            setMusicHabits(profileData.musicHabits || '');
            setCookingFrequency(profileData.cookingFrequency || '');
            setDietType(profileData.dietType || '');
            setCommunicationStyle(profileData.communicationStyle || '');
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

  const handleSave = () => {
    safeLocalStorage.set('lifestyleDetails', {
      musicHabits,
      cookingFrequency,
      dietType,
      communicationStyle,
    });
    router.push('/onboarding/searcher/enhance');
  };

  const handleSkip = () => {
    router.push('/onboarding/searcher/enhance');
  };

  const musicOptions = [
    { value: 'none', label: 'Silence', description: 'I prefer quiet environments' },
    { value: 'headphones_only', label: 'Headphones Only', description: 'Music is for me alone' },
    { value: 'headphones_mostly', label: 'Mostly Headphones', description: 'Sometimes play softly' },
    { value: 'quiet_background', label: 'Quiet Background', description: 'Low volume music' },
    { value: 'social_listening', label: 'Social Listening', description: 'Love sharing music' },
  ];

  const cookingOptions = [
    { value: 'never', label: 'Never', description: 'I eat out or order' },
    { value: 'rarely', label: 'Rarely', description: 'Once in a while' },
    { value: 'sometimes', label: 'Sometimes', description: 'Few times a week' },
    { value: 'often', label: 'Often', description: 'Most days' },
    { value: 'daily', label: 'Daily', description: 'I love cooking!' },
  ];

  const dietOptions = [
    { value: 'omnivore', label: 'Omnivore', description: 'I eat everything' },
    { value: 'vegetarian', label: 'Vegetarian', description: 'No meat' },
    { value: 'vegan', label: 'Vegan', description: 'No animal products' },
    { value: 'pescatarian', label: 'Pescatarian', description: 'Fish but no meat' },
    { value: 'flexitarian', label: 'Flexitarian', description: 'Mostly plant-based' },
  ];

  const communicationOptions = [
    { value: 'direct', label: 'Direct & Straightforward', description: 'I say what I mean' },
    { value: 'diplomatic', label: 'Diplomatic & Tactful', description: 'I consider feelings' },
    { value: 'casual', label: 'Casual & Friendly', description: 'Laid-back communication' },
    { value: 'formal', label: 'Formal & Professional', description: 'Structured communication' },
  ];

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/onboarding/searcher/enhance"
      backLabel="Back to Menu"
      progress={undefined}
      isLoading={isLoading}
      loadingText="Loading your preferences..."
    >
      <EnhanceProfileHeading
        role="searcher"
        title="Lifestyle Details"
        description="Share more about your daily habits and preferences"
        icon={<Music className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Music Habits */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <Music className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">Music Habits at Home</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">How do you enjoy music at home?</p>
          <div className="space-y-2">
            {musicOptions.map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="searcher"
                selected={musicHabits === option.value}
                onClick={() => setMusicHabits(option.value)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs text-gray-500 mt-1">{option.description}</span>
                </div>
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Cooking Frequency */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <ChefHat className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">Cooking Frequency</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">How often do you cook at home?</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {cookingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setCookingFrequency(option.value)}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  cookingFrequency === option.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium text-sm">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Diet Type */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <Apple className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">Dietary Preferences</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">What best describes your diet?</p>
          <div className="space-y-2">
            {dietOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDietType(option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  dietType === option.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Communication Style */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">Communication Style</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">How do you prefer to communicate with flatmates?</p>
          <div className="space-y-2">
            {communicationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setCommunicationStyle(option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  communicationStyle === option.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </button>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Info box */}
        <EnhanceProfileInfoBox role="searcher">
          <p className="text-sm text-gray-600">
            These details help us find flatmates with compatible lifestyles and communication preferences.
          </p>
        </EnhanceProfileInfoBox>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-8">
        <EnhanceProfileButton
          role="searcher"
          onClick={handleSave}
        >
          Continue
        </EnhanceProfileButton>
        <button
          onClick={handleSkip}
          className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 py-2"
        >
          Skip for now
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
