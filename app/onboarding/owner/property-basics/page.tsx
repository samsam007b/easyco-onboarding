'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, Plus, MapPin } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function PropertyBasicsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t, getSection } = useLanguage();
  const onboarding = getSection('onboarding');
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);
  const [hasProperty, setHasProperty] = useState<string>('');
  const [propertyCity, setPropertyCity] = useState('');
  const [propertyType, setPropertyType] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('ownerPropertyBasics', {}) as any;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          const hasPropertyValue = saved.hasProperty || (profileData.has_property ? 'yes' : profileData.has_property === false ? 'no' : '');
          setHasProperty(hasPropertyValue);
          setPropertyCity(saved.propertyCity || profileData.property_city || '');
          setPropertyType(saved.propertyType || profileData.property_type || '');
        } else if (saved.hasProperty) {
          setHasProperty(saved.hasProperty);
          setPropertyCity(saved.propertyCity || '');
          setPropertyType(saved.propertyType || '');
        }
      }
    } catch (error) {
      console.error('Error loading property data:', error);
      toast.error(common.errorLoadingData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    safeLocalStorage.set('ownerPropertyBasics', {
      hasProperty,
      propertyCity: hasProperty === 'yes' ? propertyCity : '',
      propertyType: hasProperty === 'yes' ? propertyType : '',
    });

    // Navigate to verification
    router.push('/onboarding/owner/verification');
  };

  const canContinue = hasProperty && (hasProperty === 'no' || (propertyCity && propertyType));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[color:var(--easy-purple)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{onboarding.owner.about.loadingInfo}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        {/* Language Switcher */}
        <div className="absolute top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[color:var(--easy-purple)] w-2/3 transition-all" />
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-[color:var(--easy-purple)] hover:opacity-70 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[color:var(--easy-purple)] mb-2">
            {onboarding.owner.propertyBasics.title}
          </h1>
          <p className="text-gray-600">
            {onboarding.owner.propertyBasics.subtitle}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Has Property */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {onboarding.owner.propertyBasics.hasPropertyLabel}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setHasProperty('yes')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  hasProperty === 'yes'
                    ? 'border-[color:var(--easy-purple)] bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    hasProperty === 'yes' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    <Home className={`w-5 h-5 ${
                      hasProperty === 'yes' ? 'text-purple-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <span className={`font-semibold text-sm ${
                    hasProperty === 'yes' ? 'text-[color:var(--easy-purple)]' : 'text-gray-900'
                  }`}>
                    {onboarding.owner.propertyBasics.yes}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setHasProperty('no')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  hasProperty === 'no'
                    ? 'border-[color:var(--easy-purple)] bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    hasProperty === 'no' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    <Plus className={`w-5 h-5 ${
                      hasProperty === 'no' ? 'text-purple-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <span className={`font-semibold text-sm ${
                    hasProperty === 'no' ? 'text-[color:var(--easy-purple)]' : 'text-gray-900'
                  }`}>
                    {onboarding.owner.propertyBasics.notYet}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional: If has property */}
          {hasProperty === 'yes' && (
            <>
              {/* Property City */}
              <div className="p-5 rounded-xl bg-blue-50 border border-blue-200">
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {onboarding.owner.propertyBasics.propertyLocation}
                </label>
                <input
                  type="text"
                  value={propertyCity}
                  onChange={(e) => setPropertyCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
                  placeholder={onboarding.owner.propertyBasics.propertyLocationPlaceholder}
                />
              </div>

              {/* Property Type */}
              <div className="p-5 rounded-xl bg-yellow-50 border border-yellow-200">
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  {onboarding.owner.propertyBasics.propertyType}
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
                >
                  <option value="">{onboarding.owner.propertyBasics.propertyTypeSelect}</option>
                  <option value="apartment">{onboarding.owner.propertyBasics.apartment}</option>
                  <option value="house">{onboarding.owner.propertyBasics.house}</option>
                  <option value="studio">{onboarding.owner.propertyBasics.studio}</option>
                  <option value="room">{onboarding.owner.propertyBasics.privateRoom}</option>
                  <option value="coliving">{onboarding.owner.propertyBasics.colivingSpace}</option>
                  <option value="other">{onboarding.owner.propertyBasics.other}</option>
                </select>
              </div>

              {/* Info box */}
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm text-gray-700">
                  {onboarding.owner.propertyBasics.infoGreat}
                </p>
              </div>
            </>
          )}

          {/* Conditional: If no property */}
          {hasProperty === 'no' && (
            <div className="p-5 rounded-xl bg-purple-50 border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-2">{onboarding.owner.propertyBasics.noProblemTitle}</h3>
              <p className="text-sm text-gray-700">
                {onboarding.owner.propertyBasics.noProblemDesc}
              </p>
            </div>
          )}

        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full mt-12 py-4 rounded-full font-semibold text-lg transition shadow-md ${
            canContinue
              ? 'bg-[color:var(--easy-yellow)] text-black hover:opacity-90 hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {common.continue}
        </button>
      </div>
    </main>
  );
}
