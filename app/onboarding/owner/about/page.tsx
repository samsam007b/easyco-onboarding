'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Building2, Users } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function OwnerAbout() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [ownerType, setOwnerType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [primaryLocation, setPrimaryLocation] = useState('');
  const [hostingExperience, setHostingExperience] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('ownerAbout', {}) as any;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setOwnerType(saved.ownerType || profileData.owner_type || '');
          setCompanyName(saved.companyName || profileData.company_name || '');
          setPrimaryLocation(saved.primaryLocation || profileData.primary_location || '');
          setHostingExperience(saved.hostingExperience || profileData.hosting_experience || '');
        } else if (saved.ownerType) {
          setOwnerType(saved.ownerType);
          setCompanyName(saved.companyName || '');
          setPrimaryLocation(saved.primaryLocation);
          setHostingExperience(saved.hostingExperience);
        }
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading about data:', error);
      toast.error(t('onboarding.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!ownerType || !primaryLocation || !hostingExperience) {
      toast.error(t('onboarding.owner.about.errorRequired'));
      return;
    }

    if ((ownerType === 'agency' || ownerType === 'company') && !companyName.trim()) {
      toast.error(t('onboarding.owner.about.errorCompanyName'));
      return;
    }

    safeLocalStorage.set('ownerAbout', {
      ownerType,
      companyName: (ownerType === 'agency' || ownerType === 'company') ? companyName : '',
      primaryLocation,
      hostingExperience,
    });
    router.push('/onboarding/owner/property-basics');
  };

  const handleBack = () => {
    router.push('/onboarding/owner/basic-info');
  };

  const ownerTypes = [
    {
      value: 'individual',
      label: t('onboarding.owner.about.individualOwner'),
      icon: User,
      description: t('onboarding.owner.about.individualOwnerDesc')
    },
    {
      value: 'agency',
      label: t('onboarding.owner.about.propertyAgency'),
      icon: Building2,
      description: t('onboarding.owner.about.propertyAgencyDesc')
    },
    {
      value: 'company',
      label: t('onboarding.owner.about.companyCorporation'),
      icon: Users,
      description: t('onboarding.owner.about.companyCorporationDesc')
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600">{t('onboarding.owner.about.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 relative">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[color:var(--easy-purple)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('common.back')}</span>
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
            <span className="text-sm text-gray-600">{t('onboarding.progress.step')} 2 {t('onboarding.progress.of')} 3</span>
            <span className="text-sm font-semibold text-[color:var(--easy-purple)]">67%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[color:var(--easy-purple)] rounded-full" style={{ width: '67%' }} />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('onboarding.owner.about.title')}</h2>
            <p className="text-gray-600">{t('onboarding.owner.about.subtitle')}</p>
          </div>

          <div className="space-y-6">
            {/* Owner Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('onboarding.owner.about.ownerTypeLabel')} <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {ownerTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setOwnerType(type.value)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        ownerType === type.value
                          ? 'border-[color:var(--easy-purple)] bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 mt-0.5 ${ownerType === type.value ? 'text-[color:var(--easy-purple)]' : 'text-gray-400'}`} />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{type.label}</div>
                          <div className="text-sm text-gray-500">{type.description}</div>
                        </div>
                        {ownerType === type.value && (
                          <div className="w-5 h-5 rounded-full bg-[color:var(--easy-purple)] flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Company Name (conditional) */}
            {(ownerType === 'agency' || ownerType === 'company') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('onboarding.owner.about.companyName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={t('onboarding.owner.about.companyNamePlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
                />
              </div>
            )}

            {/* Primary Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('onboarding.owner.about.primaryLocation')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={primaryLocation}
                onChange={(e) => setPrimaryLocation(e.target.value)}
                placeholder={t('onboarding.owner.about.primaryLocationPlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Hosting Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('onboarding.owner.about.hostingExperience')} <span className="text-red-500">*</span>
              </label>
              <select
                value={hostingExperience}
                onChange={(e) => setHostingExperience(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
              >
                <option value="">{t('onboarding.owner.about.hostingExperiencePlaceholder')}</option>
                <option value="0-1 year">{t('onboarding.owner.about.experience0to1')}</option>
                <option value="1-3 years">{t('onboarding.owner.about.experience1to3')}</option>
                <option value="3+ years">{t('onboarding.owner.about.experience3plus')}</option>
              </select>
              <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  {t('onboarding.owner.about.tipComplete')}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleBack}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {t('common.back')}
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 bg-[color:var(--easy-purple)] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {t('common.continue')}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
