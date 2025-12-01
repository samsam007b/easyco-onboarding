'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wifi, Car, Dumbbell, Tv, Shirt, Coffee, Sparkles } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileSelectionCard,
  EnhanceProfileSection,
  EnhanceProfileInfoBox,
} from '@/components/enhance-profile';

export default function OwnerServicesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [includedServices, setIncludedServices] = useState<string[]>([]);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('ownerServices', {}) as any;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setAmenities(saved.amenities || profileData.amenities || []);
          setIncludedServices(saved.includedServices || profileData.included_services || []);
        } else if (saved.amenities) {
          setAmenities(saved.amenities);
          setIncludedServices(saved.includedServices || []);
        }
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading services data:', error);
      toast.error('Failed to load existing data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    safeLocalStorage.set('ownerServices', {
      amenities,
      includedServices,
    });
    toast.success('Services saved!');
    router.push('/dashboard/my-profile-owner');
  };

  const handleCancel = () => {
    router.push('/dashboard/my-profile-owner');
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
    <EnhanceProfileLayout
      role="owner"
      backUrl="/dashboard/my-profile-owner"
      backLabel="Back to Profile"
      isLoading={isLoading}
      loadingText="Loading your information..."
    >
      <EnhanceProfileHeading
        role="owner"
        title="What You Offer"
        description="Highlight amenities and services to attract tenants"
        icon={<Sparkles className="w-8 h-8 text-purple-600" />}
      />

      <div className="space-y-8">
        {/* Amenities */}
        <EnhanceProfileSection>
          <h3 className="font-semibold text-gray-900 mb-4">Available Amenities</h3>
          <div className="grid grid-cols-2 gap-3">
            {amenitiesList.map((amenity) => {
              const Icon = amenity.icon;
              const isSelected = amenities.includes(amenity.value);
              return (
                <EnhanceProfileSelectionCard
                  key={amenity.value}
                  role="owner"
                  selected={isSelected}
                  onClick={() => toggleAmenity(amenity.value)}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${
                    isSelected ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  <div className="text-sm font-semibold">
                    {amenity.label}
                  </div>
                </EnhanceProfileSelectionCard>
              );
            })}
          </div>
        </EnhanceProfileSection>

        {/* Included Services */}
        <EnhanceProfileSection>
          <h3 className="font-semibold text-gray-900 mb-4">Included Services</h3>
          <div className="space-y-2">
            {servicesList.map((service) => {
              const isSelected = includedServices.includes(service.value);
              return (
                <EnhanceProfileSelectionCard
                  key={service.value}
                  role="owner"
                  selected={isSelected}
                  onClick={() => toggleService(service.value)}
                  className="flex items-center gap-3 text-left"
                >
                  <span className="text-2xl">{service.emoji}</span>
                  <span className="font-semibold flex-1">
                    {service.label}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </EnhanceProfileSelectionCard>
              );
            })}
          </div>
        </EnhanceProfileSection>

        {/* Info box */}
        <EnhanceProfileInfoBox role="owner" title="Pro Tip:">
          <p className="text-sm text-gray-700">
            Listings with amenities listed get 2x more inquiries than those without.
          </p>
        </EnhanceProfileInfoBox>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mt-8">
        <EnhanceProfileButton
          role="owner"
          variant="outline"
          onClick={handleCancel}
        >
          Cancel
        </EnhanceProfileButton>
        <EnhanceProfileButton
          role="owner"
          onClick={handleContinue}
          className="flex-1"
        >
          Save Changes
        </EnhanceProfileButton>
      </div>
    </EnhanceProfileLayout>
  );
}
