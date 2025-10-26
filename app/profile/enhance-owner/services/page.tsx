'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wifi, Car, Dumbbell, Tv, Shirt, Coffee } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';

export default function OwnerServicesPage() {
  const router = useRouter();
  const [amenities, setAmenities] = useState<string[]>([]);
  const [includedServices, setIncludedServices] = useState<string[]>([]);

  const handleContinue = () => {
    safeLocalStorage.set('ownerServices', {
      amenities,
      includedServices,
    });

    router.push('/profile/enhance-owner/review');
  };

  const handleSkip = () => {
    router.push('/profile/enhance-owner/review');
  };

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const toggleService = (service: string) => {
    if (includedServices.includes(service)) {
      setIncludedServices(includedServices.filter(s => s !== service));
    } else {
      setIncludedServices([...includedServices, service]);
    }
  };

  const amenitiesList = [
    { value: 'wifi', label: 'WiFi', icon: Wifi },
    { value: 'parking', label: 'Parking', icon: Car },
    { value: 'gym', label: 'Gym/Fitness', icon: Dumbbell },
    { value: 'tv', label: 'TV/Streaming', icon: Tv },
    { value: 'laundry', label: 'Laundry', icon: Shirt },
    { value: 'kitchen', label: 'Full Kitchen', icon: Coffee },
  ];

  const servicesList = [
    { value: 'utilities', label: 'Utilities Included', emoji: '💡' },
    { value: 'cleaning', label: 'Cleaning Service', emoji: '🧹' },
    { value: 'maintenance', label: '24/7 Maintenance', emoji: '🔧' },
    { value: 'insurance', label: 'Property Insurance', emoji: '🛡️' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[color:var(--easy-purple)]">Step 3 of 4</span>
            <span className="text-sm text-gray-500">Services & Amenities</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[color:var(--easy-purple)] h-2 rounded-full" style={{ width: '75%' }} />
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
            What You Offer
          </h1>
          <p className="text-gray-600">
            Highlight amenities and services to attract tenants
          </p>
        </div>

        {/* Form */}
        <div className="space-y-8">

          {/* Amenities */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Available Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {amenitiesList.map((amenity) => {
                const Icon = amenity.icon;
                const isSelected = amenities.includes(amenity.value);
                return (
                  <button
                    key={amenity.value}
                    onClick={() => toggleAmenity(amenity.value)}
                    className={`p-4 rounded-xl border-2 transition ${
                      isSelected
                        ? 'border-[color:var(--easy-purple)] bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${
                      isSelected ? 'text-[color:var(--easy-purple)]' : 'text-gray-400'
                    }`} />
                    <div className={`text-sm font-semibold ${
                      isSelected ? 'text-[color:var(--easy-purple)]' : 'text-gray-900'
                    }`}>
                      {amenity.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Included Services */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Included Services</h3>
            <div className="space-y-2">
              {servicesList.map((service) => {
                const isSelected = includedServices.includes(service.value);
                return (
                  <button
                    key={service.value}
                    onClick={() => toggleService(service.value)}
                    className={`w-full p-4 rounded-xl border-2 transition flex items-center gap-3 ${
                      isSelected
                        ? 'border-[color:var(--easy-purple)] bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className="text-2xl">{service.emoji}</span>
                    <span className={`font-semibold flex-1 text-left ${
                      isSelected ? 'text-[color:var(--easy-purple)]' : 'text-gray-900'
                    }`}>
                      {service.label}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[color:var(--easy-purple)] flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info box */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">
            <p className="text-sm text-gray-700">
              <strong className="text-purple-800">Pro Tip:</strong> Listings with amenities listed get 2x more inquiries than those without.
            </p>
          </div>

        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-12">
          <button
            onClick={handleSkip}
            className="flex-1 py-4 rounded-full font-semibold text-lg transition border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Skip
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 py-4 rounded-full font-semibold text-lg transition shadow-md bg-[color:var(--easy-yellow)] text-black hover:opacity-90 hover:shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}
