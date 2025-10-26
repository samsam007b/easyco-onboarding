'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, MapPin, DollarSign, FileText, CheckCircle } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function PropertyReview() {
  const router = useRouter();
  const { t, getSection } = useLanguage();
  const onboarding = getSection('onboarding');
  const common = getSection('common');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const basics = safeLocalStorage.get('propertyBasics', {});
    const pricing = safeLocalStorage.get('propertyPricing', {});
    const description = safeLocalStorage.get('propertyDescription', {});
    const ownerId = safeLocalStorage.get('owner_id', null);

    setData({ basics, pricing, description, ownerId });
  }, []);

  const handleSubmit = async () => {
    if (!data.ownerId) {
      toast.error(onboarding.property.review.errorNoOwner);
      router.push('/onboarding/owner/basic-info');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('test_properties').insert([
        {
          owner_id: data.ownerId,
          property_type: data.basics?.propertyType,
          address: data.basics?.address,
          city: data.basics?.city,
          postal_code: data.basics?.postalCode || null,
          bedrooms: data.basics?.bedrooms,
          bathrooms: data.basics?.bathrooms,
          monthly_rent: data.pricing?.monthlyRent,
          security_deposit: data.pricing?.securityDeposit,
          available_from: data.pricing?.availableFrom || null,
          description: data.description?.description || null,
        },
      ]);

      if (error) throw error;

      // Clear property data
      safeLocalStorage.remove('propertyBasics');
      safeLocalStorage.remove('propertyPricing');
      safeLocalStorage.remove('propertyDescription');

      router.push('/onboarding/property/success');
    } catch (err: any) {
      toast.error('Error: ' + err.message);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/onboarding/property/description');
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      apartment: onboarding.property.basics.apartment,
      house: onboarding.property.basics.house,
      condo: onboarding.property.basics.condo,
      studio: onboarding.property.basics.studio,
      coliving: onboarding.property.basics.coliving,
    };
    return labels[type] || type;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Language Switcher */}
        <div className="absolute top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[color:var(--easy-purple)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{common.back}</span>
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[color:var(--easy-purple)] flex items-center justify-center">
            <Home className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[color:var(--easy-purple)]">EasyCo</h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step 4 of 4</span>
            <span className="text-sm font-semibold text-[color:var(--easy-purple)]">100%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[color:var(--easy-purple)] rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{onboarding.property.review.title}</h2>
            <p className="text-gray-600">{onboarding.property.review.subtitle}</p>
          </div>

          {/* Property Summary */}
          <div className="space-y-4">
            {/* Basics */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Home className="w-5 h-5 text-[color:var(--easy-purple)]" />
                <h3 className="font-semibold text-gray-900">{onboarding.property.review.propertyDetails}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{onboarding.property.review.type}</span>
                  <span className="font-medium text-gray-900">
                    {getPropertyTypeLabel(data.basics?.propertyType)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{onboarding.property.review.bedrooms}</span>
                  <span className="font-medium text-gray-900">{data.basics?.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{onboarding.property.review.bathrooms}</span>
                  <span className="font-medium text-gray-900">{data.basics?.bathrooms}</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-[color:var(--easy-purple)]" />
                <h3 className="font-semibold text-gray-900">{onboarding.property.review.location}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{onboarding.property.review.address}</span>
                  <span className="font-medium text-gray-900">{data.basics?.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{onboarding.property.review.city}</span>
                  <span className="font-medium text-gray-900">
                    {data.basics?.city}
                    {data.basics?.postalCode && ` ${data.basics.postalCode}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-[color:var(--easy-purple)]" />
                <h3 className="font-semibold text-gray-900">{onboarding.property.review.pricing}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{onboarding.property.review.monthlyRent}</span>
                  <span className="font-medium text-gray-900">€{data.pricing?.monthlyRent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{onboarding.property.review.securityDeposit}</span>
                  <span className="font-medium text-gray-900">€{data.pricing?.securityDeposit}</span>
                </div>
                {data.pricing?.availableFrom && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{onboarding.property.review.availableFrom}</span>
                    <span className="font-medium text-gray-900">
                      {new Date(data.pricing.availableFrom).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {data.description?.description && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-[color:var(--easy-purple)]" />
                  <h3 className="font-semibold text-gray-900">{onboarding.property.review.description}</h3>
                </div>
                <p className="text-sm text-gray-700">{data.description.description}</p>
              </div>
            )}
          </div>

          {/* Success Message */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">{onboarding.property.review.readyToPublishTitle}</h4>
                <p className="text-sm text-green-700">
                  {onboarding.property.review.readyToPublishDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {common.back}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-[color:var(--easy-purple)] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? onboarding.property.review.publishing : onboarding.property.review.publishListing}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
