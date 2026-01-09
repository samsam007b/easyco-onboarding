'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wifi, Car, Dumbbell, Tv, Shirt, Coffee, Sparkles, Lightbulb, Wrench, Shield, type LucideIcon } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
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
  const { t } = useLanguage();
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
      toast.error(t('enhanceOwner.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    safeLocalStorage.set('ownerServices', {
      amenities,
      includedServices,
    });
    toast.success(t('enhanceOwner.services.saved'));
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
    { value: 'wifi', key: 'wifi', icon: Wifi },
    { value: 'parking', key: 'parking', icon: Car },
    { value: 'gym', key: 'gym', icon: Dumbbell },
    { value: 'tv', key: 'tv', icon: Tv },
    { value: 'laundry', key: 'laundry', icon: Shirt },
    { value: 'kitchen', key: 'kitchen', icon: Coffee },
  ];

  // Icon mapping for services
  const SERVICE_ICONS: Record<string, LucideIcon> = {
    Lightbulb,
    Sparkles,
    Wrench,
    Shield,
  };

  const servicesList = [
    { value: 'utilities', key: 'utilities', iconName: 'Lightbulb' },
    { value: 'cleaning', key: 'cleaning', iconName: 'Sparkles' },
    { value: 'maintenance', key: 'maintenance', iconName: 'Wrench' },
    { value: 'insurance', key: 'insurance', iconName: 'Shield' },
  ];

  return (
    <EnhanceProfileLayout
      role="owner"
      backUrl="/dashboard/my-profile-owner"
      backLabel={t('enhanceOwner.common.backToProfile')}
      isLoading={isLoading}
      loadingText={t('enhanceOwner.common.loading')}
    >
      <EnhanceProfileHeading
        role="owner"
        title={t('enhanceOwner.services.title')}
        description={t('enhanceOwner.services.description')}
        icon={<Sparkles className="w-8 h-8 text-purple-600" />}
      />

      <div className="space-y-8">
        {/* Amenities */}
        <EnhanceProfileSection>
          <h3 className="font-semibold text-gray-900 mb-4">{t('enhanceOwner.services.amenitiesTitle')}</h3>
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
                    {t(`enhanceOwner.services.amenities.${amenity.key}`)}
                  </div>
                </EnhanceProfileSelectionCard>
              );
            })}
          </div>
        </EnhanceProfileSection>

        {/* Included Services */}
        <EnhanceProfileSection>
          <h3 className="font-semibold text-gray-900 mb-4">{t('enhanceOwner.services.servicesTitle')}</h3>
          <div className="space-y-2">
            {servicesList.map((service) => {
              const isSelected = includedServices.includes(service.value);
              const ServiceIcon = SERVICE_ICONS[service.iconName] || Sparkles;
              return (
                <EnhanceProfileSelectionCard
                  key={service.value}
                  role="owner"
                  selected={isSelected}
                  onClick={() => toggleService(service.value)}
                  className="flex items-center gap-3 text-left"
                >
                  <ServiceIcon className={`w-6 h-6 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />
                  <span className="font-semibold flex-1">
                    {t(`enhanceOwner.services.servicesList.${service.key}`)}
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
        <EnhanceProfileInfoBox role="owner" title={t('enhanceOwner.services.proTip')}>
          <p className="text-sm text-gray-700">
            {t('enhanceOwner.services.proTipContent')}
          </p>
        </EnhanceProfileInfoBox>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-8">
        <button
          onClick={handleContinue}
          className="w-full py-4 superellipse-xl font-semibold transition-all duration-300 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          {t('enhanceOwner.common.saveChanges')}
        </button>
        <button
          onClick={handleCancel}
          className="w-full text-center text-sm text-transparent hover:text-gray-600 transition-colors duration-200 py-2"
        >
          {t('common.cancel')}
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
