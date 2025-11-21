'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function OwnerBasicInfo() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const onboarding = getSection('onboarding');
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationality, setNationality] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      // First check localStorage for temporary data
      const saved = safeLocalStorage.get('ownerBasicInfo', {}) as any;

      // Get current user and their profile from database
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          // Pre-fill from database, but localStorage takes priority (if user is in middle of editing)
          setFirstName(saved.firstName || profileData.first_name || '');
          setLastName(saved.lastName || profileData.last_name || '');
          setPhoneNumber(saved.phoneNumber || profileData.phone_number || '');
          setNationality(saved.nationality || profileData.nationality || '');
        } else if (saved.firstName) {
          // Fallback to localStorage only if no database data
          setFirstName(saved.firstName);
          setLastName(saved.lastName);
          setPhoneNumber(saved.phoneNumber);
          setNationality(saved.nationality);
        }
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading profile data:', error);
      toast.error(onboarding.errors.loadFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error(onboarding.errors.enterName);
      return;
    }
    if (!phoneNumber.trim()) {
      toast.error(onboarding.errors.enterPhone);
      return;
    }

    safeLocalStorage.set('ownerBasicInfo', {
      firstName,
      lastName,
      phoneNumber,
      nationality,
    });
    router.push('/onboarding/owner/about');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600">{common.loadingInfo}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-[color:var(--easy-purple)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{common.back}</span>
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[color:var(--easy-purple)] flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[color:var(--easy-purple)]">EasyCo</h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{onboarding.progress.step} 1 {onboarding.progress.of} 3</span>
            <span className="text-sm font-semibold text-[color:var(--easy-purple)]">33%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[color:var(--easy-purple)] rounded-full" style={{ width: '33%' }} />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{onboarding.owner.welcomeTitle}</h2>
            <p className="text-gray-600">{onboarding.owner.welcomeSubtitle}</p>
          </div>

          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-[color:var(--easy-purple)] mb-2">{onboarding.owner.profileSetup}</h3>
            <p className="text-sm text-gray-600">{onboarding.owner.profileSetupHelp}</p>
          </div>

          <div className="space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {onboarding.basicInfo.firstName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={onboarding.basicInfo.firstNamePlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {onboarding.basicInfo.lastName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={onboarding.basicInfo.lastNamePlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {onboarding.owner.phoneNumber} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={onboarding.owner.phoneNumberPlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
              />
              <p className="mt-2 text-xs text-gray-500">{onboarding.owner.phoneNumberHelp}</p>
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {onboarding.basicInfo.nationality}
              </label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder={onboarding.basicInfo.nationalityPlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full mt-8 bg-[color:var(--easy-purple)] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            {common.continue}
          </button>
        </div>
      </div>
    </main>
  );
}
