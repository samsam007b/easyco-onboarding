'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, MapPin, DollarSign, FileText, CheckCircle } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function PropertyReview() {
  const router = useRouter();
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
      toast.error('Error: No owner profile found. Please complete the owner onboarding first.');
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
      apartment: 'Apartment',
      house: 'House',
      condo: 'Condo',
      studio: 'Studio',
      coliving: 'Coliving',
    };
    return labels[type] || type;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[color:var(--easy-purple)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Review your listing</h2>
            <p className="text-gray-600">Make sure everything looks good before publishing.</p>
          </div>

          {/* Property Summary */}
          <div className="space-y-4">
            {/* Basics */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Home className="w-5 h-5 text-[color:var(--easy-purple)]" />
                <h3 className="font-semibold text-gray-900">Property Details</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-900">
                    {getPropertyTypeLabel(data.basics?.propertyType)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bedrooms:</span>
                  <span className="font-medium text-gray-900">{data.basics?.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bathrooms:</span>
                  <span className="font-medium text-gray-900">{data.basics?.bathrooms}</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-[color:var(--easy-purple)]" />
                <h3 className="font-semibold text-gray-900">Location</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium text-gray-900">{data.basics?.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">City:</span>
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
                <h3 className="font-semibold text-gray-900">Pricing</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Rent:</span>
                  <span className="font-medium text-gray-900">€{data.pricing?.monthlyRent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Security Deposit:</span>
                  <span className="font-medium text-gray-900">€{data.pricing?.securityDeposit}</span>
                </div>
                {data.pricing?.availableFrom && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available From:</span>
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
                  <h3 className="font-semibold text-gray-900">Description</h3>
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
                <h4 className="font-semibold text-green-900 mb-1">Ready to publish!</h4>
                <p className="text-sm text-green-700">
                  Your listing will be live immediately and visible to quality tenants.
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
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-[color:var(--easy-purple)] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
