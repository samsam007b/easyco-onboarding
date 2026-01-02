'use client';

import { useRouter } from 'next/navigation';
import { Search, Users, Home, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingButton,
} from '@/components/onboarding';

export default function SearcherIndex() {
  const router = useRouter();
  const { t } = useLanguage();

  const features = [
    {
      icon: Search,
      title: t('onboarding.searcherIndex.feature1Title') || 'Smart search',
      description: t('onboarding.searcherIndex.feature1Desc') || 'Find shared housing that matches your lifestyle',
    },
    {
      icon: Users,
      title: t('onboarding.searcherIndex.feature2Title') || 'Personalized matching',
      description: t('onboarding.searcherIndex.feature2Desc') || 'Connect with compatible roommates',
    },
    {
      icon: Home,
      title: t('onboarding.searcherIndex.feature3Title') || 'Verified properties',
      description: t('onboarding.searcherIndex.feature3Desc') || 'Access quality housing',
    },
  ];

  return (
    <OnboardingLayout
      role="searcher"
      backUrl="/"
      backLabel={t('common.back') || 'Back'}
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FFB85C] mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <OnboardingHeading
          role="searcher"
          title={t('onboarding.searcherIndex.title') || 'Welcome to Izzico'}
          description={t('onboarding.searcherIndex.description') || 'Find your ideal shared housing in a few steps'}
        />
      </div>

      {/* Features */}
      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 rounded-xl bg-orange-50/50 border border-orange-100"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FFB85C] flex items-center justify-center">
              <feature.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <OnboardingButton
        role="searcher"
        onClick={() => router.push('/onboarding/searcher/group-selection')}
      >
        {t('onboarding.searcherIndex.start') || 'Get started'}
      </OnboardingButton>

      {/* Info text */}
      <p className="text-center text-sm text-gray-500 mt-4">
        {t('onboarding.searcherIndex.timeEstimate') || 'About 5 minutes to complete your profile'}
      </p>
    </OnboardingLayout>
  );
}
