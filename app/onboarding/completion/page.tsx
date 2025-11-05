'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Home, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function OnboardingCompletionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getSection } = useLanguage();
  const common = getSection('common');
  const onboarding = getSection('onboarding');
  const [userType, setUserType] = useState<'searcher' | 'owner' | 'resident' | null>(null);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyCompletion = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        console.log('🔍 Completion page - User:', user?.id);
        console.log('🔍 User metadata:', user?.user_metadata);

        if (!user) {
          console.log('❌ No user, redirecting to login');
          router.push('/login');
          return;
        }

        // Priority 1: Get user_type from URL query parameter (most reliable)
        const userTypeFromURL = searchParams.get('user_type');
        if (userTypeFromURL && ['searcher', 'owner', 'resident'].includes(userTypeFromURL)) {
          console.log('✅ Got user type from URL:', userTypeFromURL);
          setUserType(userTypeFromURL as 'searcher' | 'owner' | 'resident');
          setUserName(user.user_metadata?.full_name || user.user_metadata?.name || 'User');
          setIsLoading(false);
          return;
        }

        // Priority 2: Get user_type from metadata (faster, no DB query)
        const userTypeFromMetadata = user.user_metadata?.user_type;
        const fullNameFromMetadata = user.user_metadata?.full_name || user.user_metadata?.name;

        if (userTypeFromMetadata) {
          console.log('✅ Got user type from metadata:', userTypeFromMetadata);
          setUserType(userTypeFromMetadata as 'searcher' | 'owner' | 'resident');
          setUserName(fullNameFromMetadata || 'User');
          setIsLoading(false);
          return;
        }

        // Priority 3: Try to fetch from database
        console.log('⚠️ No user_type in URL or metadata, fetching from DB...');

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('user_type, full_name, onboarding_completed')
          .eq('id', user.id)
          .single();

        console.log('📊 User data from DB:', userData);
        console.log('❌ User error:', userError);

        if (userError) {
          console.error('Failed to fetch user data:', userError);
          console.error('⚠️ Cannot determine user type - navigation will be blocked');
          setUserName('User');
          setIsLoading(false);
          return;
        }

        if (!userData?.onboarding_completed) {
          // If not completed, redirect back to onboarding
          console.log('⚠️ Onboarding not completed, redirecting back');
          router.push(`/onboarding/${userData?.user_type}/basic-info`);
          return;
        }

        console.log('✅ Setting user type from DB:', userData.user_type);
        setUserType(userData.user_type as 'searcher' | 'owner' | 'resident');
        setUserName(userData.full_name || 'User');
        setIsLoading(false);
      } catch (error) {
        console.error('💥 Error in verifyCompletion:', error);
        setIsLoading(false);
      }
    };

    verifyCompletion();
  }, [router, searchParams]);

  const handleGoHome = () => {
    console.log('🏠 handleGoHome clicked, userType:', userType);
    if (!userType) {
      console.log('❌ No userType, cannot navigate');
      return;
    }
    console.log('✅ Navigating to:', `/dashboard/${userType}`);
    router.replace(`/dashboard/${userType}`);
  };

  const handleEnhanceProfile = () => {
    console.log('✨ handleEnhanceProfile clicked, userType:', userType);
    if (!userType) {
      console.log('❌ No userType, cannot navigate');
      return;
    }

    // Redirect to appropriate enhance profile page
    if (userType === 'searcher') {
      console.log('✅ Navigating to: /profile/enhance');
      router.replace('/profile/enhance');
    } else if (userType === 'owner') {
      console.log('✅ Navigating to: /profile/enhance-owner');
      router.replace('/profile/enhance-owner');
    } else if (userType === 'resident') {
      console.log('✅ Navigating to: /profile/enhance-resident/personality');
      router.replace('/profile/enhance-resident/personality');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A148C]"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center p-6">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-[#4A148C] to-purple-600 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFD600] rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#4A148C]" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl sm:text-4xl font-bold text-[#4A148C] mb-3">
            🎉 {onboarding.completion.congratulations}, {userName}!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {onboarding.completion.subtitle}
          </p>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>

          {/* Choice Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Go to Home */}
            <button
              onClick={handleGoHome}
              className="group relative bg-gradient-to-br from-[#4A148C] to-purple-600 rounded-2xl p-8 text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-4 right-4">
                <Home className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="text-left">
                <h3 className="text-xl font-bold mb-2">
                  {onboarding.completion.goHomeTitle}
                </h3>
                <p className="text-sm text-purple-100 mb-4">
                  {userType === 'searcher'
                    ? onboarding.completion.goHomeDescriptionSearcher
                    : userType === 'owner'
                    ? onboarding.completion.goHomeDescriptionOwner
                    : onboarding.completion.goHomeDescriptionResident}
                </p>

                <div className="flex items-center text-[#FFD600] font-semibold">
                  <span>{onboarding.completion.continueButton}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            {/* Enhance Profile */}
            <button
              onClick={handleEnhanceProfile}
              className="group relative bg-gradient-to-br from-[#FFD600] to-yellow-400 rounded-2xl p-8 text-[#4A148C] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-4 right-4">
                <Sparkles className="w-6 h-6 opacity-50 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
              </div>

              <div className="text-left">
                <h3 className="text-xl font-bold mb-2">
                  {onboarding.completion.enhanceProfileTitle}
                </h3>
                <p className="text-sm text-purple-900 mb-4">
                  {onboarding.completion.enhanceProfileDescription}
                </p>

                <div className="flex items-center font-semibold">
                  <span>{onboarding.completion.enhanceNowButton}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          </div>

          {/* Info Message */}
          <div className="bg-purple-50 rounded-xl p-4 text-sm text-gray-600">
            <p>
              💡 <strong>{onboarding.completion.tipTitle} :</strong> {onboarding.completion.tipMessage}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
