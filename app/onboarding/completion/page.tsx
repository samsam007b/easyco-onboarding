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
    <main className={`min-h-screen bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center p-4 sm:p-6`}>
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="max-w-3xl w-full">
        {/* Success Icon - Outside card for better visual hierarchy */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${theme.gradient} rounded-full flex items-center justify-center shadow-xl`}>
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <div className={`absolute -top-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 ${
              userType === 'owner' ? 'bg-[#FFD600]' : 'bg-yellow-400'
            } rounded-full flex items-center justify-center shadow-lg`}>
              <Sparkles className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                userType === 'owner' ? 'text-[#4A148C]' : 'text-orange-600'
              }`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-10">
          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                🎉 {onboarding.completion.congratulations}, {userName}!
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              {onboarding.completion.subtitle}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>

          {/* Choice Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* Go to Home */}
            <button
              onClick={handleGoHome}
              className={`group relative bg-gradient-to-br ${theme.gradient} rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}
            >
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Home className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>

              <div className="text-left pr-12">
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  {onboarding.completion.goHomeTitle}
                </h3>
                <p className="text-xs sm:text-sm mb-4 opacity-90">
                  {userType === 'searcher'
                    ? onboarding.completion.goHomeDescriptionSearcher
                    : userType === 'owner'
                    ? onboarding.completion.goHomeDescriptionOwner
                    : onboarding.completion.goHomeDescriptionResident}
                </p>

                <div className="flex items-center font-semibold text-sm">
                  <span>{onboarding.completion.continueButton}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            {/* Enhance Profile */}
            <button
              onClick={handleEnhanceProfile}
              className={`group relative border-2 ${
                userType === 'owner'
                  ? 'border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-300'
                  : 'border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-300'
              } rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}
            >
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${
                  userType === 'owner' ? 'bg-purple-100' : 'bg-orange-100'
                } rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    userType === 'owner' ? 'text-purple-600' : 'text-orange-600'
                  }`} />
                </div>
              </div>

              <div className="text-left pr-12">
                <h3 className={`text-lg sm:text-xl font-bold mb-2 ${
                  userType === 'owner' ? 'text-purple-900' : 'text-orange-900'
                }`}>
                  {onboarding.completion.enhanceProfileTitle}
                </h3>
                <p className={`text-xs sm:text-sm mb-4 ${
                  userType === 'owner' ? 'text-purple-700' : 'text-orange-700'
                }`}>
                  {onboarding.completion.enhanceProfileDescription}
                </p>

                <div className={`flex items-center font-semibold text-sm ${
                  userType === 'owner' ? 'text-purple-600' : 'text-orange-600'
                }`}>
                  <span>{onboarding.completion.enhanceNowButton}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          </div>

          {/* Info Message */}
          <div className={`${
            userType === 'owner' ? 'bg-purple-50 border-purple-100' : 'bg-orange-50 border-orange-100'
          } border rounded-xl p-4 text-sm text-gray-700`}>
            <p className="flex items-start gap-2">
              <span className="text-base flex-shrink-0">💡</span>
              <span>
                <strong className={userType === 'owner' ? 'text-purple-900' : 'text-orange-900'}>
                  {onboarding.completion.tipTitle} :
                </strong>{' '}
                {onboarding.completion.tipMessage}
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
