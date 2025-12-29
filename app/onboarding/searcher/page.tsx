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
      title: t('onboarding.searcherIndex.feature1Title') || 'Recherche intelligente',
      description: t('onboarding.searcherIndex.feature1Desc') || 'Trouvez des colocations qui correspondent à votre style de vie',
    },
    {
      icon: Users,
      title: t('onboarding.searcherIndex.feature2Title') || 'Matching personnalisé',
      description: t('onboarding.searcherIndex.feature2Desc') || 'Connectez-vous avec des colocataires compatibles',
    },
    {
      icon: Home,
      title: t('onboarding.searcherIndex.feature3Title') || 'Propriétés vérifiées',
      description: t('onboarding.searcherIndex.feature3Desc') || 'Accédez à des logements de qualité',
    },
  ];

  return (
    <OnboardingLayout
      role="searcher"
      backUrl="/"
      backLabel={t('common.back') || 'Retour'}
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FFB85C] mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <OnboardingHeading
          role="searcher"
          title={t('onboarding.searcherIndex.title') || 'Bienvenue sur Izzico'}
          description={t('onboarding.searcherIndex.description') || 'Trouvez votre colocation idéale en quelques étapes'}
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
        {t('onboarding.searcherIndex.start') || 'Commencer'}
      </OnboardingButton>

      {/* Info text */}
      <p className="text-center text-sm text-gray-500 mt-4">
        {t('onboarding.searcherIndex.timeEstimate') || 'Environ 5 minutes pour compléter votre profil'}
      </p>
    </OnboardingLayout>
  );
}
