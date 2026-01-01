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
  EnhanceProfileButton,
  EnhanceProfileSection,
} from '@/components/enhance-profile';

export default function EnhanceAboutPage() {
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

  const handleNext = async () => {
    // Save to localStorage for immediate feedback
    safeLocalStorage.set('enhanceAbout', { bio, aboutMe, lookingFor });

    // Save to database
    try {
      await fetch('/api/profile/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'about',
          data: { bio, aboutMe, lookingFor }
        })
      });
    } catch (error) {
      console.error('Failed to save to database:', error);
    }

    router.push('/profile');
  };

  const handleSkip = () => {
    router.push('/profile');
  };

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/profile"
      backLabel={t('profileEnhance.common.backToProfile')}
      progress={undefined}
      isLoading={isLoading}
      loadingText={t('profileEnhance.common.loading')}
    >
      <EnhanceProfileHeading
        role="searcher"
        title={t('profileEnhance.about.title')}
        description={t('profileEnhance.about.description')}
        icon={<User className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Bio Section */}
        <EnhanceProfileSection>
          <EnhanceProfileTextarea
            role="searcher"
            label={t('profileEnhance.about.shortBio.label')}
            helperText={t('profileEnhance.about.shortBio.helper')}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            maxLength={200}
            placeholder={t('profileEnhance.about.shortBio.placeholder')}
          />
        </EnhanceProfileSection>

        {/* About Me Section */}
        <EnhanceProfileSection>
          <EnhanceProfileTextarea
            role="searcher"
            label={t('profileEnhance.about.moreAboutMe.label')}
            helperText={t('profileEnhance.about.moreAboutMe.helper')}
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder={t('profileEnhance.about.moreAboutMe.placeholder')}
          />
        </EnhanceProfileSection>

        {/* Looking For Section */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-5 h-5 text-orange-600" />
            <label className="block text-sm font-medium text-gray-700">
              {t('profileEnhance.about.lookingFor.label')}
            </label>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            {t('profileEnhance.about.lookingFor.helper')}
          </p>
          <EnhanceProfileTextarea
            role="searcher"
            label=""
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
            rows={3}
            maxLength={300}
            placeholder={t('profileEnhance.about.lookingFor.placeholder')}
          />
        </EnhanceProfileSection>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between items-center gap-4">
        <button
          onClick={handleSkip}
          className="px-6 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          {t('profileEnhance.common.skip')}
          <span className="text-lg">→</span>
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          {t('profileEnhance.common.save')}
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
