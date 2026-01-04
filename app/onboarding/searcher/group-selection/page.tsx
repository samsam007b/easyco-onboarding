'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserCircle, UserPlus, Info, Check } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingButton,
  OnboardingGrid,
} from '@/components/onboarding';

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
      router.push('/onboarding/searcher/basic-info');
    } else if (selectedMode === 'create_group') {
      router.push('/onboarding/searcher/create-group');
    } else if (selectedMode === 'join_group') {
      router.push('/onboarding/searcher/join-group');
    }
  };

  const options = [
    {
      id: 'alone' as SearchMode,
      icon: UserCircle,
      title: t('onboarding.groupSelection.aloneTitle') || 'Alone',
      description: t('onboarding.groupSelection.aloneDesc') || 'Search and apply individually',
    },
    {
      id: 'create_group' as SearchMode,
      icon: Users,
      title: t('onboarding.groupSelection.createTitle') || 'Create a group',
      description: t('onboarding.groupSelection.createDesc') || 'Invite friends to search together',
    },
    {
      id: 'join_group' as SearchMode,
      icon: UserPlus,
      title: t('onboarding.groupSelection.joinTitle') || 'Join a group',
      description: t('onboarding.groupSelection.joinDesc') || 'Use an invitation code',
    },
  ];

  return (
    <OnboardingLayout
      role="searcher"
      backUrl="/onboarding/searcher"
      backLabel={t('common.back') || 'Back'}
      progress={{
        current: 0,
        total: 6,
        label: t('onboarding.groupSelection.progress') || 'Preliminary step',
        stepName: t('onboarding.groupSelection.stepName') || 'Search mode',
      }}
    >
      <OnboardingHeading
        role="searcher"
        title={t('onboarding.groupSelection.title') || 'How do you want to search?'}
        description={t('onboarding.groupSelection.subtitle') || 'Choose if you want to search alone or in a group'}
      />

      {/* Options Grid */}
      <OnboardingGrid columns={3} className="mb-6">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedMode === option.id;

          return (
            <button
              key={option.id}
              onClick={() => setSelectedMode(option.id)}
              className={`
                relative p-6 superellipse-2xl text-center transition-all duration-200
                ${isSelected
                  ? 'bg-orange-50 border-2 border-orange-500 shadow-lg'
                  : 'bg-white border-2 border-gray-200 hover:border-orange-300 hover:shadow-md'
                }
              `}
            >
              {/* Icon Circle */}
              <div className={`
                w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
                bg-gradient-to-br from-[#FF8C42] to-[#FFB85C]
                ${isSelected ? 'ring-4 ring-orange-200' : ''}
              `}>
                <Icon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {option.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {option.description}
              </p>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </OnboardingGrid>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 superellipse-xl p-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 text-sm mb-1">
              {t('onboarding.groupSelection.infoTitle') || 'You can change later'}
            </h4>
            <p className="text-blue-800 text-sm">
              {t('onboarding.groupSelection.infoDesc') || 'Create or join groups anytime from your dashboard.'}
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <OnboardingButton
        role="searcher"
        onClick={handleContinue}
        disabled={!selectedMode}
      >
        {t('common.continue') || 'Continue'}
      </OnboardingButton>
    </OnboardingLayout>
  );
}
