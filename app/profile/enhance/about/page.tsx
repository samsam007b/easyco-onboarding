'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, User, MessageCircle } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { getOnboardingData } from '@/lib/onboarding-helpers';

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
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleNext = () => {
    safeLocalStorage.set('enhanceAbout', { bio, aboutMe, lookingFor });
    router.push('/profile/enhance/hobbies');
  };

  const handleSkip = () => {
    router.push('/profile/enhance/hobbies');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[color:var(--easy-purple)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="mb-6 text-[color:var(--easy-purple)]">
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[color:var(--easy-purple)]">Step 1 of 6</span>
            <span className="text-sm text-gray-500">About You</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[color:var(--easy-purple)] h-2 rounded-full" style={{ width: '17%' }} />
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <User className="w-7 h-7 text-[color:var(--easy-purple)]" />
            <h1 className="text-3xl font-bold text-[color:var(--easy-purple)]">Tell Us About Yourself</h1>
          </div>
          <p className="text-gray-600">Share a bit about who you are (all fields are optional)</p>
        </div>

        <div className="space-y-6">
          {/* Bio Section */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Bio
            </label>
            <p className="text-xs text-gray-500 mb-3">
              A brief introduction that appears at the top of your profile
            </p>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--easy-purple)]"
              placeholder="e.g., Tech student passionate about sustainability and outdoor activities..."
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{bio.length}/200 characters</p>
          </div>

          {/* About Me Section */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              More About Me
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Share more details about your lifestyle, interests, or what makes you unique
            </p>
            <textarea
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--easy-purple)]"
              placeholder="e.g., I'm a communication student who loves techno and dancing. I work from home sometimes, enjoy cooking healthy meals, and like to keep a tidy space..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{aboutMe.length}/500 characters</p>
          </div>

          {/* Looking For Section */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-5 h-5 text-[color:var(--easy-purple)]" />
              <label className="block text-sm font-medium text-gray-700">
                What I'm Looking For
              </label>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Describe your ideal living situation and the kind of people you'd like to live with
            </p>
            <textarea
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--easy-purple)]"
              placeholder="e.g., Looking for a convivial room in a mixed coliving with people who respect shared spaces and enjoy occasional social activities..."
              maxLength={300}
            />
            <p className="text-xs text-gray-500 mt-1">{lookingFor.length}/300 characters</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleNext}
            className="flex-1 py-4 rounded-full bg-[color:var(--easy-yellow)] text-black font-semibold text-lg hover:opacity-90 flex items-center justify-center gap-2"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={handleSkip}
            className="px-8 py-4 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
          >
            Skip
          </button>
        </div>
      </div>
    </main>
  );
}
