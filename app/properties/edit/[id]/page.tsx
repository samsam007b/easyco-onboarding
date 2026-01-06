'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Home, MapPin, Euro, Bed, Bath } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PageContainer, PageHeader } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { getPropertyById, updateProperty } from '@/lib/property-helpers';
import { toast } from 'sonner';
import type { PropertyType, PropertyAmenity } from '@/lib/types/property';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { useLanguage } from '@/lib/i18n/use-language';

const PROPERTY_TYPES: PropertyType[] = [
  'apartment',
  'house',
  'studio',
  'coliving',
  'shared_room',
  'private_room',
  'entire_place',
];

const AMENITIES: PropertyAmenity[] = [
  'wifi',
  'parking',
  'elevator',
  'balcony',
  'garden',
  'gym',
  'laundry',
  'dishwasher',
  'washing_machine',
  'dryer',
  'air_conditioning',
  'heating',
  'kitchen',
  'furnished',
  'pets_allowed',
  'smoking_allowed',
];

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  const { t } = useLanguage();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'apartment' as PropertyType,
    address: '',
    city: '',
    postal_code: '',
    bedrooms: 1,
    bathrooms: 1,
    surface_area: undefined as number | undefined,
    furnished: false,
    monthly_rent: 0,
    charges: 0,
    deposit: 0,
    available_from: '',
    minimum_stay_months: 1,
    smoking_allowed: false,
    pets_allowed: false,
    couples_allowed: true,
  });

  const [selectedAmenities, setSelectedAmenities] = useState<PropertyAmenity[]>([]);

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  const loadProperty = async () => {
    setIsLoading(true);
    const result = await getPropertyById(propertyId);

    if (result.success && result.data) {
      const property = result.data;

      setFormData({
        title: property.title || '',
        description: property.description || '',
        property_type: property.property_type,
        address: property.address || '',
        city: property.city || '',
        postal_code: property.postal_code || '',
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        surface_area: property.surface_area || undefined,
        furnished: property.furnished || false,
        monthly_rent: property.monthly_rent || 0,
        charges: property.charges || 0,
        deposit: property.deposit || 0,
        available_from: property.available_from || '',
        minimum_stay_months: property.minimum_stay_months || 1,
        smoking_allowed: property.smoking_allowed || false,
        pets_allowed: property.pets_allowed || false,
        couples_allowed: property.couples_allowed !== undefined ? property.couples_allowed : true,
      });

      setSelectedAmenities(property.amenities || []);
    } else {
      toast.error(t('properties.edit.errors.loadFailed'));
      router.push('/dashboard/owner');
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: PropertyAmenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.title.trim()) {
        toast.error(t('properties.edit.errors.titleRequired'));
        setIsSubmitting(false);
        return;
      }

      if (!formData.city.trim() || !formData.postal_code.trim()) {
        toast.error(t('properties.edit.errors.locationRequired'));
        setIsSubmitting(false);
        return;
      }

      if (formData.monthly_rent <= 0) {
        toast.error(t('properties.edit.errors.rentRequired'));
        setIsSubmitting(false);
        return;
      }

      // Update property
      const result = await updateProperty(propertyId, {
        ...formData,
        amenities: selectedAmenities,
      });

      if (!result.success) {
        throw new Error(result.error || t('properties.edit.errors.updateFailed'));
      }

      toast.success(t('properties.edit.success'));
      router.push(`/properties/${propertyId}`);
    } catch (error: any) {
      toast.error(error.message || t('properties.edit.errors.updateFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoadingHouse size={64} />
            <p className="mt-4 text-gray-600">{t('properties.edit.loading')}</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="2xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('common.back')}
      </Button>

      <PageHeader
        title={t('properties.edit.title')}
        description={t('properties.edit.description')}
      />

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-[#9c5698]" />
              {t('properties.add.sections.basicInfo')}
            </h3>

            <div className="space-y-4">
              <Input
                label={t('properties.add.fields.propertyTitle')}
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder={t('properties.add.fields.titlePlaceholder')}
                required
              />

              <Textarea
                label={t('properties.add.fields.description')}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={t('properties.add.fields.descriptionPlaceholder')}
                rows={4}
              />

              <Select
                label={t('properties.add.fields.propertyType')}
                value={formData.property_type}
                onChange={(e) => handleInputChange('property_type', e.target.value as PropertyType)}
                options={PROPERTY_TYPES.map(type => ({
                  value: type,
                  label: t(`properties.add.propertyTypes.${type}`)
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#9c5698]" />
              {t('properties.add.sections.location')}
            </h3>

            <div className="space-y-4">
              <Input
                label={t('properties.add.fields.address')}
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder={t('properties.add.fields.addressPlaceholder')}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('properties.add.fields.city')}
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Paris"
                  required
                />

                <Input
                  label={t('properties.add.fields.postalCode')}
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  placeholder="75001"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Bed className="w-5 h-5 text-[#9c5698]" />
              {t('properties.add.sections.propertyDetails')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input
                label={t('properties.add.fields.bedrooms')}
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                leftIcon={<Bed className="w-4 h-4" />}
              />

              <Input
                label={t('properties.add.fields.bathrooms')}
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 0)}
                leftIcon={<Bath className="w-4 h-4" />}
              />

              <Input
                label={t('properties.add.fields.surfaceArea')}
                type="number"
                min="0"
                value={formData.surface_area || ''}
                onChange={(e) => handleInputChange('surface_area', parseInt(e.target.value) || undefined)}
                placeholder={t('properties.add.fields.optional')}
              />
            </div>

            <Checkbox
              label={t('properties.add.fields.furnished')}
              checked={formData.furnished}
              onChange={(e) => handleInputChange('furnished', e.target.checked)}
            />
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Euro className="w-5 h-5 text-[#9c5698]" />
              {t('properties.add.sections.pricing')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label={t('properties.add.fields.monthlyRent')}
                type="number"
                min="0"
                value={formData.monthly_rent}
                onChange={(e) => handleInputChange('monthly_rent', parseFloat(e.target.value) || 0)}
                leftIcon={<Euro className="w-4 h-4" />}
                required
              />

              <Input
                label={t('properties.add.fields.charges')}
                type="number"
                min="0"
                value={formData.charges}
                onChange={(e) => handleInputChange('charges', parseFloat(e.target.value) || 0)}
                leftIcon={<Euro className="w-4 h-4" />}
              />

              <Input
                label={t('properties.add.fields.deposit')}
                type="number"
                min="0"
                value={formData.deposit}
                onChange={(e) => handleInputChange('deposit', parseFloat(e.target.value) || 0)}
                leftIcon={<Euro className="w-4 h-4" />}
              />
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">{t('properties.add.sections.amenities')}</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AMENITIES.map((amenity) => (
                <Checkbox
                  key={amenity}
                  label={t(`properties.add.amenitiesLabels.${amenity}`)}
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* House Rules */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">{t('properties.add.sections.houseRules')}</h3>

            <div className="space-y-3">
              <Checkbox
                label={t('properties.add.fields.smokingAllowed')}
                checked={formData.smoking_allowed}
                onChange={(e) => handleInputChange('smoking_allowed', e.target.checked)}
              />
              <Checkbox
                label={t('properties.add.fields.petsAllowed')}
                checked={formData.pets_allowed}
                onChange={(e) => handleInputChange('pets_allowed', e.target.checked)}
              />
              <Checkbox
                label={t('properties.add.fields.couplesAllowed')}
                checked={formData.couples_allowed}
                onChange={(e) => handleInputChange('couples_allowed', e.target.checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">{t('properties.add.sections.availability')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('properties.add.fields.availableFrom')}
                type="date"
                value={formData.available_from}
                onChange={(e) => handleInputChange('available_from', e.target.value)}
              />

              <Input
                label={t('properties.add.fields.minimumStay')}
                type="number"
                min="1"
                value={formData.minimum_stay_months}
                onChange={(e) => handleInputChange('minimum_stay_months', parseInt(e.target.value) || 1)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('properties.edit.saving') : t('properties.edit.saveButton')}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
