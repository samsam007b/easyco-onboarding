'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import { Home, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import { roleThemes, OnboardingRole } from '@/components/onboarding/OnboardingLayout';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import LoadingHouse from '@/components/ui/LoadingHouse';

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

        logger.debug('Completion page - verifying user');

        if (!user) {
          logger.debug('No user, redirecting to login');
          router.push('/login');
          return;
        }

        // Priority 1: Get user_type from URL query parameter (most reliable)
        const userTypeFromURL = searchParams.get('user_type');
        if (userTypeFromURL && ['searcher', 'owner', 'resident'].includes(userTypeFromURL)) {
          logger.debug('Got user type from URL', { userType: userTypeFromURL });
          setUserType(userTypeFromURL as 'searcher' | 'owner' | 'resident');
          setUserName(user.user_metadata?.full_name || user.user_metadata?.name || 'User');
          setIsLoading(false);
          return;
        }

        // Priority 2: Get user_type from metadata (faster, no DB query)
        const userTypeFromMetadata = user.user_metadata?.user_type;
        const fullNameFromMetadata = user.user_metadata?.full_name || user.user_metadata?.name;

        if (userTypeFromMetadata) {
          logger.debug('Got user type from metadata', { userType: userTypeFromMetadata });
          setUserType(userTypeFromMetadata as 'searcher' | 'owner' | 'resident');
          setUserName(fullNameFromMetadata || 'User');
          setIsLoading(false);
          return;
        }

        // Priority 3: Try to fetch from database
        logger.debug('No user_type in URL or metadata, fetching from DB');

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('user_type, full_name, onboarding_completed')
          .eq('id', user.id)
          .single();

        if (userError) {
          logger.error('Failed to fetch user data', userError);
          setUserName('User');
          setIsLoading(false);
          return;
        }

        if (!userData?.onboarding_completed) {
          // If not completed, redirect back to onboarding
          logger.debug('Onboarding not completed, redirecting back');
          router.push(`/onboarding/${userData?.user_type}/basic-info`);
          return;
        }

        logger.debug('Setting user type from DB', { userType: userData.user_type });
        setUserType(userData.user_type as 'searcher' | 'owner' | 'resident');
        setUserName(userData.full_name || 'User');
        setIsLoading(false);
      } catch (error) {
        logger.error('Error in verifyCompletion', error);
        setIsLoading(false);
      }
    };

    verifyCompletion();
  }, [router, searchParams]);

  const handleGoHome = () => {
    if (!userType) {
      return;
    }
    router.replace(`/dashboard/${userType}`);
  };

  const handleEnhanceProfile = () => {
    if (!userType) {
      return;
    }

    // Redirect to appropriate enhance profile page
    if (userType === 'searcher') {
      router.replace('/profile/enhance');
    } else if (userType === 'owner') {
      router.replace('/profile/enhance-owner');
    } else if (userType === 'resident') {
      router.replace('/profile/enhance-resident/personality');
    }
  };

  // Get theme based on user type
  const theme = userType ? roleThemes[userType as OnboardingRole] : roleThemes.owner;

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center`}>
        <LoadingHouse size={80} />
      </div>
    );
  }

  return (
    <main className={`min-h-screen bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center p-6`}>
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className={`w-24 h-24 bg-gradient-to-br ${theme.gradient} rounded-full flex items-center justify-center animate-bounce`}>
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <div className={`absolute -top-2 -right-2 w-8 h-8 ${
                userType === 'owner' ? 'bg-[#FFD600]' : 'bg-yellow-400'
              } rounded-full flex items-center justify-center`}>
                <Sparkles className={`w-4 h-4 ${
                  userType === 'owner' ? 'text-[#4A148C]' : 'text-orange-600'
                }`} />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
              🎉 {onboarding.completion.congratulations}, {userName}!
            </span>
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
              className={`group relative bg-gradient-to-br ${theme.gradient} rounded-2xl p-8 text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="absolute top-4 right-4">
                <Home className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="text-left">
                <h3 className="text-xl font-bold mb-2">
                  {onboarding.completion.goHomeTitle}
                </h3>
                <p className={`text-sm mb-4 ${
                  userType === 'owner' ? 'text-purple-100' : 'text-orange-100'
                }`}>
                  {userType === 'searcher'
                    ? onboarding.completion.goHomeDescriptionSearcher
                    : userType === 'owner'
                    ? onboarding.completion.goHomeDescriptionOwner
                    : onboarding.completion.goHomeDescriptionResident}
                </p>

                <div className={`flex items-center font-semibold ${
                  userType === 'owner' ? 'text-[#FFD600]' : 'text-yellow-300'
                }`}>
                  <span>{onboarding.completion.continueButton}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            {/* Enhance Profile */}
            <button
              onClick={handleEnhanceProfile}
              className={`group relative bg-gradient-to-br ${
                userType === 'owner' ? 'from-[#FFD600] to-yellow-400' : 'from-yellow-400 to-yellow-500'
              } rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="absolute top-4 right-4">
                <Sparkles className={`w-6 h-6 opacity-50 group-hover:opacity-100 group-hover:animate-pulse transition-opacity ${
                  userType === 'owner' ? 'text-[#4A148C]' : 'text-orange-600'
                }`} />
              </div>

              <div className="text-left">
                <h3 className={`text-xl font-bold mb-2 ${
                  userType === 'owner' ? 'text-[#4A148C]' : 'text-gray-900'
                }`}>
                  {onboarding.completion.enhanceProfileTitle}
                </h3>
                <p className={`text-sm mb-4 ${
                  userType === 'owner' ? 'text-purple-900' : 'text-gray-700'
                }`}>
                  {onboarding.completion.enhanceProfileDescription}
                </p>

                <div className={`flex items-center font-semibold ${
                  userType === 'owner' ? 'text-[#4A148C]' : 'text-orange-600'
                }`}>
                  <span>{onboarding.completion.enhanceNowButton}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          </div>

          {/* Info Message */}
          <div className={`${
            userType === 'owner' ? 'bg-purple-50' : userType === 'searcher' ? 'bg-orange-50' : 'bg-orange-50'
          } rounded-xl p-4 text-sm text-gray-600`}>
            <p>
              💡 <strong>{onboarding.completion.tipTitle} :</strong> {onboarding.completion.tipMessage}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
