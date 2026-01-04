'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, Building2, MapPin, Check } from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function PropertyInfoPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t, getSection } = useLanguage();
  const onboarding = getSection('onboarding');
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string>('');

  // Form fields
  const [hasProperty, setHasProperty] = useState<boolean | null>(null);
  const [propertyCity, setPropertyCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [numberOfProperties, setNumberOfProperties] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setHasProperty(profileData.has_property);
        setPropertyCity(profileData.property_city || '');
        setPropertyType(profileData.property_type || '');
        // numberOfProperties isn't in the schema yet, but we'll keep it for future use
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading property data:', error);
      toast.error(common.errors.loadFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (hasProperty && (!propertyCity || !propertyType)) {
      toast.error(onboarding.owner.propertyBasics?.fillAllFields || 'Please fill all required fields');
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          has_property: hasProperty,
          property_city: hasProperty ? propertyCity : null,
          property_type: hasProperty ? propertyType : null,
        })
        .eq('user_id', userId);

      if (error) {
        // FIXME: Use logger.error('Error updating property info:', error);
        toast.error(common.errors.saveFailed);
        return;
      }

      toast.success(common.saveSuccess);
      router.push('/dashboard/my-profile-owner');
    } catch (error) {
      // FIXME: Use logger.error('Error:', error);
      toast.error(common.errors.unexpected);
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = hasProperty !== null && (hasProperty === false || (propertyCity && propertyType));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600">{common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <main className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => router.push('/dashboard/my-profile-owner')}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-owner-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{common.back}</span>
          </button>

          {/* Main Card */}
          <div className="bg-white superellipse-3xl shadow-xl p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-owner superellipse-2xl flex items-center justify-center">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-owner-700">
                  {onboarding.owner.propertyBasics?.title || 'Property Information'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {onboarding.owner.propertyBasics?.subtitle || 'Tell us about your property'}
                </p>
              </div>
            </div>

            {/* Do you have a property? */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {onboarding.owner.propertyBasics?.hasPropertyLabel || 'Do you currently have a property to list?'}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setHasProperty(true)}
                  className={`p-4 superellipse-xl border-2 transition-all ${
                    hasProperty === true
                      ? 'border-owner-700 bg-owner-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{common.yes}</span>
                    {hasProperty === true && <Check className="w-5 h-5 text-owner-700" />}
                  </div>
                  <p className="text-sm text-gray-600 text-left">
                    {onboarding.owner.propertyBasics?.hasPropertyYes || 'I have a property ready'}
                  </p>
                </button>

                <button
                  onClick={() => {
                    setHasProperty(false);
                    setPropertyCity('');
                    setPropertyType('');
                  }}
                  className={`p-4 superellipse-xl border-2 transition-all ${
                    hasProperty === false
                      ? 'border-owner-700 bg-owner-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{common.no}</span>
                    {hasProperty === false && <Check className="w-5 h-5 text-owner-700" />}
                  </div>
                  <p className="text-sm text-gray-600 text-left">
                    {onboarding.owner.propertyBasics?.hasPropertyNo || "I'm planning to list later"}
                  </p>
                </button>
              </div>
            </div>

            {/* Property Details - Only show if has property */}
            {hasProperty === true && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Property City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {onboarding.owner.propertyBasics?.propertyCityLabel || 'Property City'} *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={propertyCity}
                      onChange={(e) => setPropertyCity(e.target.value)}
                      placeholder={onboarding.owner.propertyBasics?.propertyCityPlaceholder || 'e.g., Brussels, Antwerp, Ghent'}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 superellipse-xl focus:border-owner-700 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {onboarding.owner.propertyBasics?.propertyTypeLabel || 'Property Type'} *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 superellipse-xl focus:border-owner-700 focus:outline-none transition-colors appearance-none bg-white"
                    >
                      <option value="">
                        {onboarding.owner.propertyBasics?.propertyTypeSelect || 'Select type'}
                      </option>
                      <option value="apartment">
                        {onboarding.owner.propertyBasics?.propertyTypes?.apartment || 'Apartment'}
                      </option>
                      <option value="house">
                        {onboarding.owner.propertyBasics?.propertyTypes?.house || 'House'}
                      </option>
                      <option value="studio">
                        {onboarding.owner.propertyBasics?.propertyTypes?.studio || 'Studio'}
                      </option>
                      <option value="room">
                        {onboarding.owner.propertyBasics?.propertyTypes?.room || 'Room'}
                      </option>
                      <option value="other">
                        {onboarding.owner.propertyBasics?.propertyTypes?.other || 'Other'}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Button
                onClick={handleSave}
                disabled={!canSave || isSaving}
                className="w-full py-6 text-lg font-semibold bg-gradient-owner hover:opacity-90 text-white superellipse-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <LoadingHouse size={20} />
                    {common.saving}
                  </div>
                ) : (
                  common.save
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
