'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Users, ArrowLeft, Info } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      {/* Header */}
      <header className="px-6 py-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard/searcher')}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-sm group-hover:shadow-md flex items-center justify-center transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium">{common.back}</span>
          </button>
          <div className="text-xl font-bold">
            <span className="text-orange-600">EASY</span>
            <span className="text-amber-500">Co</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 pb-12">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">{onboarding.profileType.gettingStarted}</span>
            <span className="text-xs text-gray-500 font-medium">10%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500" style={{ width: '10%' }} />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {onboarding.profileType.title}
          </h1>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            {onboarding.profileType.subtitle}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {/* Searching for Self */}
          <button
            type="button"
            onClick={() => setProfileType('self')}
            className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
              profileType === 'self'
                ? 'border-orange-500 bg-white shadow-lg scale-[1.02]'
                : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                profileType === 'self'
                  ? 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-md'
                  : 'bg-gray-100 group-hover:bg-orange-50'
              }`}>
                <User className={`w-7 h-7 transition-colors ${profileType === 'self' ? 'text-white' : 'text-gray-600 group-hover:text-orange-600'}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {onboarding.profileType.forMyself}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {onboarding.profileType.forMyselfDesc}
                </p>
              </div>
              {profileType === 'self' && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 animate-in zoom-in duration-200">
                  <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
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
            className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
              profileType === 'dependent'
                ? 'border-orange-500 bg-white shadow-lg scale-[1.02]'
                : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                profileType === 'dependent'
                  ? 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-md'
                  : 'bg-gray-100 group-hover:bg-orange-50'
              }`}>
                <Users className={`w-7 h-7 transition-colors ${profileType === 'dependent' ? 'text-white' : 'text-gray-600 group-hover:text-orange-600'}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {onboarding.profileType.forSomeoneElse}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {onboarding.profileType.forSomeoneElseDesc}
                </p>
                {profileType === 'dependent' && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl animate-in slide-in-from-top duration-300">
                    <p className="text-xs text-amber-900 leading-relaxed">
                      {onboarding.profileType.multipleProfilesNote}
                    </p>
                  </div>
                )}
              </div>
              {profileType === 'dependent' && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 animate-in zoom-in duration-200">
                  <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 text-sm mb-2">
                {onboarding.profileType.whyAsk}
              </h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                {onboarding.profileType.whyAskDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!profileType}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
            profileType
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {common.continue}
        </button>
      </main>
    </div>
  );
}
