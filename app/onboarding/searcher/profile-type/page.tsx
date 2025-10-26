'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Users, ArrowLeft } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function ProfileTypePage() {
  const router = useRouter();
  const { t, getSection } = useLanguage();
  const onboarding = getSection('onboarding');
  const common = getSection('common');
  const [profileType, setProfileType] = useState<'self' | 'dependent' | ''>('');

  const handleContinue = () => {
    if (!profileType) {
      toast.error(onboarding.errors.selectProfileType);
      return;
    }

    // Save profile type to localStorage
    safeLocalStorage.set('searcherProfileType', { profileType });

    // Navigate to basic info
    router.push('/onboarding/searcher/basic-info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard/searcher')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{common.back}</span>
          </button>
          <div className="text-2xl font-bold">
            <span className="text-[#4A148C]">EASY</span>
            <span className="text-[#FFD600]">Co</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{onboarding.profileType.gettingStarted}</span>
            <span className="text-sm text-gray-500">{onboarding.profileType.title}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#4A148C] h-2 rounded-full" style={{ width: '10%' }} />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#4A148C] mb-2">
              {onboarding.profileType.title}
            </h1>
            <p className="text-gray-600">
              {onboarding.profileType.subtitle}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {/* Searching for Self */}
            <button
              type="button"
              onClick={() => setProfileType('self')}
              className={`w-full p-6 rounded-2xl border-2 transition-all text-left hover:shadow-md ${
                profileType === 'self'
                  ? 'border-[#4A148C] bg-purple-50 shadow-md'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  profileType === 'self' ? 'bg-[#4A148C]' : 'bg-gray-100'
                }`}>
                  <User className={`w-6 h-6 ${profileType === 'self' ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {onboarding.profileType.forMyself}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {onboarding.profileType.forMyselfDesc}
                  </p>
                </div>
                {profileType === 'self' && (
                  <div className="w-6 h-6 rounded-full bg-[#4A148C] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </div>
            </button>

            {/* Searching for Someone Else */}
            <button
              type="button"
              onClick={() => setProfileType('dependent')}
              className={`w-full p-6 rounded-2xl border-2 transition-all text-left hover:shadow-md ${
                profileType === 'dependent'
                  ? 'border-[#4A148C] bg-purple-50 shadow-md'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  profileType === 'dependent' ? 'bg-[#4A148C]' : 'bg-gray-100'
                }`}>
                  <Users className={`w-6 h-6 ${profileType === 'dependent' ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {onboarding.profileType.forSomeoneElse}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {onboarding.profileType.forSomeoneElseDesc}
                  </p>
                  {profileType === 'dependent' && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        {onboarding.profileType.multipleProfilesNote}
                      </p>
                    </div>
                  )}
                </div>
                {profileType === 'dependent' && (
                  <div className="w-6 h-6 rounded-full bg-[#4A148C] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 text-sm mb-1">
                  {onboarding.profileType.whyAsk}
                </h4>
                <p className="text-xs text-blue-800">
                  {onboarding.profileType.whyAskDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!profileType}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
              profileType
                ? 'bg-[#FFD600] hover:bg-[#F57F17] text-black'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {common.continue}
          </button>
        </div>
      </main>
    </div>
  );
}
