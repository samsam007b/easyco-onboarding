'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, MessageCircle } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { getOnboardingData } from '@/lib/onboarding-helpers';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileTextarea,
  EnhanceProfileButton,
  EnhanceProfileSection,
} from '@/components/enhance-profile';

export default function EnhanceAboutPage() {
  const router = useRouter();
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
    router.push('/profile');
  };

  const handleSkip = () => {
    router.push('/profile');
  };

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/profile"
      backLabel="Back to Profile"
      progress={undefined}
      isLoading={isLoading}
      loadingText="Loading your information..."
    >
      <EnhanceProfileHeading
        role="searcher"
        title="Tell Us About Yourself"
        description="Share a bit about who you are (all fields are optional)"
        icon={<User className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Bio Section */}
        <EnhanceProfileSection>
          <EnhanceProfileTextarea
            role="searcher"
            label="Short Bio"
            helperText="A brief introduction that appears at the top of your profile"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            maxLength={200}
            placeholder="e.g., Tech student passionate about sustainability and outdoor activities..."
          />
        </EnhanceProfileSection>

        {/* About Me Section */}
        <EnhanceProfileSection>
          <EnhanceProfileTextarea
            role="searcher"
            label="More About Me"
            helperText="Share more details about your lifestyle, interests, or what makes you unique"
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder="e.g., I'm a communication student who loves techno and dancing. I work from home sometimes, enjoy cooking healthy meals, and like to keep a tidy space..."
          />
        </EnhanceProfileSection>

        {/* Looking For Section */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-5 h-5 text-orange-600" />
            <label className="block text-sm font-medium text-gray-700">
              What I'm Looking For
            </label>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Describe your ideal living situation and the kind of people you'd like to live with
          </p>
          <EnhanceProfileTextarea
            role="searcher"
            label=""
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
            rows={3}
            maxLength={300}
            placeholder="e.g., Looking for a convivial room in a mixed coliving with people who respect shared spaces and enjoy occasional social activities..."
          />
        </EnhanceProfileSection>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between items-center gap-4">
        <button
          onClick={handleSkip}
          className="px-6 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          Skip
          <span className="text-lg">→</span>
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          Save
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
