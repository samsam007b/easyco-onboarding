'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, MessageCircle } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { getOnboardingData } from '@/lib/onboarding-helpers';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileTextarea,
  EnhanceProfileSection,
} from '@/components/enhance-profile';

export default function OnboardingEnhanceAboutPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [bio, setBio] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [lookingFor, setLookingFor] = useState('');

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
        const savedData = safeLocalStorage.get('enhanceAbout', {}) as any;
        if (savedData.bio) setBio(savedData.bio);
        if (savedData.aboutMe) setAboutMe(savedData.aboutMe);
        if (savedData.lookingFor) setLookingFor(savedData.lookingFor);

        // If nothing in localStorage, load from database
        if (!savedData.bio && !savedData.aboutMe && !savedData.lookingFor) {
          const { data: profileData } = await getOnboardingData(user.id);
          if (profileData) {
            setBio(profileData.bio || '');
            setAboutMe(profileData.aboutMe || '');
            setLookingFor(profileData.lookingFor || '');
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

  const handleNext = () => {
    safeLocalStorage.set('enhanceAbout', { bio, aboutMe, lookingFor });
    // Return to enhance menu
    router.push('/onboarding/searcher/enhance');
  };

  const handleSkip = () => {
    // Return to enhance menu
    router.push('/onboarding/searcher/enhance');
  };

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/onboarding/searcher/enhance"
      backLabel={t('enhanceSearcher.common.backToMenu')}
      progress={undefined}
      isLoading={isLoading}
      loadingText={t('enhanceSearcher.common.loading')}
    >
      <EnhanceProfileHeading
        role="searcher"
        title={t('enhanceSearcher.about.title')}
        description={t('enhanceSearcher.about.description')}
        icon={<User className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Bio Section */}
        <EnhanceProfileSection>
          <EnhanceProfileTextarea
            role="searcher"
            label={t('enhanceSearcher.about.bio.label')}
            helperText={t('enhanceSearcher.about.bio.helper')}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            maxLength={200}
            placeholder={t('enhanceSearcher.about.bio.placeholder')}
          />
        </EnhanceProfileSection>

        {/* About Me Section */}
        <EnhanceProfileSection>
          <EnhanceProfileTextarea
            role="searcher"
            label={t('enhanceSearcher.about.aboutMe.label')}
            helperText={t('enhanceSearcher.about.aboutMe.helper')}
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder={t('enhanceSearcher.about.aboutMe.placeholder')}
          />
        </EnhanceProfileSection>

        {/* Looking For Section */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-5 h-5 text-orange-600" />
            <label className="block text-sm font-medium text-gray-700">
              {t('enhanceSearcher.about.lookingFor.label')}
            </label>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            {t('enhanceSearcher.about.lookingFor.helper')}
          </p>
          <EnhanceProfileTextarea
            role="searcher"
            label=""
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
            rows={3}
            maxLength={300}
            placeholder={t('enhanceSearcher.about.lookingFor.placeholder')}
          />
        </EnhanceProfileSection>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-8">
        <button
          onClick={handleNext}
          className="w-full py-4 superellipse-xl font-semibold transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          {t('enhanceSearcher.common.saveAndContinue')}
        </button>
        <button
          onClick={handleSkip}
          className="w-full text-center text-sm text-transparent hover:text-gray-600 transition-colors duration-200 py-2"
        >
          {t('enhanceSearcher.common.skipForNow')}
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
