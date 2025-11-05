'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserCircle, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

type SearchMode = 'alone' | 'create_group' | 'join_group' | null;

export default function GroupSelectionPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedMode, setSelectedMode] = useState<SearchMode>(null);

  const handleContinue = () => {
    if (!selectedMode) return;

    // Store the selection in localStorage to be used after onboarding
    localStorage.setItem('searcher_mode', selectedMode);

    // Route based on selection
    if (selectedMode === 'alone') {
      // Go directly to basic-info onboarding
      router.push('/onboarding/searcher/basic-info');
    } else if (selectedMode === 'create_group') {
      // Go to group creation page
      router.push('/onboarding/searcher/create-group');
    } else if (selectedMode === 'join_group') {
      // Go to join group page
      router.push('/onboarding/searcher/join-group');
    }
  };

  const options = [
    {
      id: 'alone' as SearchMode,
      icon: UserCircle,
      title: 'Search Alone',
      description: 'Find and apply for properties individually',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      id: 'create_group' as SearchMode,
      icon: Users,
      title: 'Create a Group',
      description: 'Start a group and invite friends to search together',
      gradient: 'from-yellow-500 to-yellow-600',
    },
    {
      id: 'join_group' as SearchMode,
      icon: UserPlus,
      title: 'Join a Group',
      description: 'Enter an invite code to join an existing group',
      gradient: 'from-blue-500 to-blue-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 py-8 px-4">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How do you want to search?
          </h1>
          <p className="text-lg text-gray-600">
            Choose whether you want to search for properties alone or with a group
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {options.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedMode === option.id;

            return (
              <button
                key={option.id}
                onClick={() => setSelectedMode(option.id)}
                className={`
                  relative bg-white rounded-3xl p-8 text-center transition-all duration-300
                  ${isSelected
                    ? 'ring-4 ring-purple-500 shadow-2xl scale-105'
                    : 'shadow-lg hover:shadow-xl hover:scale-102'
                  }
                `}
              >
                {/* Icon Circle */}
                <div className={`
                  w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center
                  bg-gradient-to-br ${option.gradient}
                  ${isSelected ? 'ring-4 ring-purple-200' : ''}
                `}>
                  <Icon className="w-10 h-10 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {option.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {option.description}
                </p>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">
                Don't worry, you can change this later
              </h4>
              <p className="text-blue-800 text-sm">
                You can create or join groups at any time from your dashboard. This just helps us get started.
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedMode}
            size="lg"
            className="px-12 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
