'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Calendar, Globe, Phone } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { LanguagesChipInput, type LanguageChip } from '@/components/LanguagesChipInput';

export default function ResidentBasicInfoPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t, getSection } = useLanguage();
  const resident = getSection('resident');
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [languages, setLanguages] = useState<LanguageChip[]>([]);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('residentBasicInfo', {}) as any;
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setFirstName(saved.firstName || profileData.first_name || '');
          setLastName(saved.lastName || profileData.last_name || '');
          setDateOfBirth(saved.dateOfBirth || profileData.date_of_birth || '');
          setNationality(saved.nationality || profileData.nationality || '');
          setPhoneNumber(saved.phoneNumber || profileData.phone_number || '');

          // Convert old string array format to new LanguageChip format if needed
          const savedLangs = saved.languages || profileData.languages_spoken || [];
          if (Array.isArray(savedLangs) && savedLangs.length > 0) {
            if (typeof savedLangs[0] === 'string') {
              setLanguages(savedLangs.map((lang: string) => ({
                code: lang,
                display: lang,
                canonicalEn: lang,
              })));
            } else {
              setLanguages(savedLangs as LanguageChip[]);
            }
          }
        } else if (saved.firstName) {
          setFirstName(saved.firstName);
          setLastName(saved.lastName);
          setDateOfBirth(saved.dateOfBirth);
          setNationality(saved.nationality);
          setPhoneNumber(saved.phoneNumber);

          const savedLangs = saved.languages || [];
          if (Array.isArray(savedLangs) && savedLangs.length > 0) {
            if (typeof savedLangs[0] === 'string') {
              setLanguages(savedLangs.map((lang: string) => ({
                code: lang,
                display: lang,
                canonicalEn: lang,
              })));
            } else {
              setLanguages(savedLangs as LanguageChip[]);
            }
          }
        }
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading profile data:', error);
      toast.error(common.errors.loadFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!firstName.trim()) {
      toast.error(resident.basicInfo.errors.firstNameRequired);
      return;
    }
    if (!lastName.trim()) {
      toast.error(resident.basicInfo.errors.lastNameRequired);
      return;
    }
    if (!dateOfBirth) {
      toast.error(resident.basicInfo.errors.dobRequired);
      return;
    }
    if (!nationality.trim()) {
      toast.error(resident.basicInfo.errors.nationalityRequired);
      return;
    }
    if (!phoneNumber.trim()) {
      toast.error(resident.basicInfo.errors.phoneRequired);
      return;
    }
    if (languages.length === 0) {
      toast.error(resident.basicInfo.errors.languageRequired);
      return;
    }

    safeLocalStorage.set('residentBasicInfo', {
      firstName,
      lastName,
      dateOfBirth,
      nationality,
      phoneNumber,
      languages,
    });

    router.push('/onboarding/resident/lifestyle');
  };

  const canContinue = firstName && lastName && dateOfBirth && nationality && phoneNumber && languages.length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFA040] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard/resident')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{common.back}</span>
          </button>
          <div className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] bg-clip-text text-transparent">EASY</span>
            <span className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] bg-clip-text text-transparent">Co</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{resident.basicInfo.progress}</span>
            <span className="text-sm text-gray-500">{resident.basicInfo.title}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] h-2 rounded-full" style={{ width: '25%' }} />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FFA040] to-[#FFB85C] bg-clip-text text-transparent mb-2">
              {resident.basicInfo.heading}
            </h1>
            <p className="text-gray-600">
              {resident.basicInfo.description}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {resident.basicInfo.firstName} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={resident.basicInfo.firstNamePlaceholder}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {resident.basicInfo.lastName} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={resident.basicInfo.lastNamePlaceholder}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {resident.basicInfo.dateOfBirth} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {resident.basicInfo.nationality} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder={resident.basicInfo.nationalityPlaceholder}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {resident.basicInfo.phoneNumber} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={resident.basicInfo.phoneNumberPlaceholder}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {resident.basicInfo.languages} <span className="text-red-500">*</span>
              </label>
              <LanguagesChipInput
                value={languages}
                onChange={setLanguages}
                maxLanguages={10}
                placeholder={resident.basicInfo.languagesPlaceholder}
              />
            </div>
          </div>

          {/* Continue Button */}
          <div className="mt-8">
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
                canContinue
                  ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:opacity-90 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {common.continue}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
