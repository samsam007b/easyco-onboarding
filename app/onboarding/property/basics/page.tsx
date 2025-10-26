'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, Building2, DoorClosed } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { toast } from 'sonner';

export default function PropertyBasics() {
  const router = useRouter();
  const [propertyType, setPropertyType] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');

  useEffect(() => {
    const saved = safeLocalStorage.get('propertyBasics', {}) as any;
    if (saved.propertyType) setPropertyType(saved.propertyType);
    if (saved.address) setAddress(saved.address);
    if (saved.city) setCity(saved.city);
    if (saved.postalCode) setPostalCode(saved.postalCode);
    if (saved.bedrooms) setBedrooms(saved.bedrooms);
    if (saved.bathrooms) setBathrooms(saved.bathrooms);
  }, []);

  const handleContinue = () => {
    if (!propertyType || !address.trim() || !city.trim() || !bedrooms || !bathrooms) {
      toast.error('Please fill in all required fields');
      return;
    }

    safeLocalStorage.set('propertyBasics', {
      propertyType,
      address,
      city,
      postalCode,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
    });
    router.push('/onboarding/property/pricing');
  };

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: Building2 },
    { value: 'house', label: 'House', icon: Home },
    { value: 'condo', label: 'Condo', icon: Building2 },
    { value: 'studio', label: 'Studio', icon: DoorClosed },
    { value: 'coliving', label: 'Coliving', icon: Home },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/')}
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
            <span className="text-sm text-gray-600">Step 1 of 4</span>
            <span className="text-sm font-semibold text-[color:var(--easy-purple)]">25%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[color:var(--easy-purple)] rounded-full" style={{ width: '25%' }} />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Basics</h2>
            <p className="text-gray-600">Start by describing your property basics.</p>
          </div>

          <div className="space-y-6">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Property Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {propertyTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setPropertyType(type.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        propertyType === type.value
                          ? 'border-[color:var(--easy-purple)] bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 mx-auto mb-2 ${
                          propertyType === type.value ? 'text-[color:var(--easy-purple)]' : 'text-gray-400'
                        }`}
                      />
                      <div className="text-sm font-medium text-gray-900">{type.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Property Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, Apt 4B"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* City and Postal Code */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="1180"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Bedrooms and Bathrooms */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms <span className="text-red-500">*</span>
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select</option>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms <span className="text-red-500">*</span>
                </label>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select</option>
                  {[1, 2, 3, 4].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full mt-8 bg-[color:var(--easy-purple)] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}
