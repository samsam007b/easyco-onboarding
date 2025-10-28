'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, MapPin, Euro, Bed, Bath } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PageContainer, PageHeader } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { createProperty } from '@/lib/property-helpers';
import { toast } from 'sonner';
import type { PropertyType, PropertyAmenity } from '@/lib/types/property';

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'studio', label: 'Studio' },
  { value: 'coliving', label: 'Coliving Space' },
  { value: 'shared_room', label: 'Shared Room' },
  { value: 'private_room', label: 'Private Room' },
  { value: 'entire_place', label: 'Entire Place' },
];

const AMENITIES: { value: PropertyAmenity; label: string }[] = [
  { value: 'wifi', label: 'WiFi' },
  { value: 'parking', label: 'Parking' },
  { value: 'elevator', label: 'Elevator' },
  { value: 'balcony', label: 'Balcony' },
  { value: 'garden', label: 'Garden' },
  { value: 'gym', label: 'Gym' },
  { value: 'laundry', label: 'Laundry' },
  { value: 'dishwasher', label: 'Dishwasher' },
  { value: 'washing_machine', label: 'Washing Machine' },
  { value: 'dryer', label: 'Dryer' },
  { value: 'air_conditioning', label: 'Air Conditioning' },
  { value: 'heating', label: 'Heating' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'furnished', label: 'Furnished' },
  { value: 'pets_allowed', label: 'Pets Allowed' },
  { value: 'smoking_allowed', label: 'Smoking Allowed' },
];

export default function AddPropertyPage() {
  const router = useRouter();
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
        toast.error('Please enter a property title');
        setIsSubmitting(false);
        return;
      }

      if (!formData.city.trim() || !formData.postal_code.trim()) {
        toast.error('Please enter location details');
        setIsSubmitting(false);
        return;
      }

      if (formData.monthly_rent <= 0) {
        toast.error('Please enter a valid monthly rent');
        setIsSubmitting(false);
        return;
      }

      // Create property
      const result = await createProperty({
        ...formData,
        amenities: selectedAmenities,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to create property');
      }

      toast.success('Property created successfully!');
      router.push('/dashboard/owner');
    } catch (error: any) {
      // FIXME: Use logger.error('Error creating property:', error);
      toast.error(error.message || 'Failed to create property');
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer maxWidth="xl">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-[#4A148C] transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <PageHeader
          title="Add New Property"
          description="List your property and find compatible tenants"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-[#4A148C]" />
              Basic Information
            </h3>

            <div className="space-y-4">
              <Input
                label="Property Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Cozy 2-bedroom apartment in Paris"
                required
              />

              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your property, its features, and the neighborhood..."
                rows={4}
              />

              <Select
                label="Property Type"
                value={formData.property_type}
                onChange={(e) => handleInputChange('property_type', e.target.value as PropertyType)}
                options={PROPERTY_TYPES}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#4A148C]" />
              Location
            </h3>

            <div className="space-y-4">
              <Input
                label="Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Street address"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Paris"
                  required
                />

                <Input
                  label="Postal Code"
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
          <CardContent>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bed className="w-5 h-5 text-[#4A148C]" />
              Property Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input
                label="Bedrooms"
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                leftIcon={<Bed className="w-4 h-4" />}
              />

              <Input
                label="Bathrooms"
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 0)}
                leftIcon={<Bath className="w-4 h-4" />}
              />

              <Input
                label="Surface Area (m²)"
                type="number"
                min="0"
                value={formData.surface_area || ''}
                onChange={(e) => handleInputChange('surface_area', parseInt(e.target.value) || undefined)}
                placeholder="Optional"
              />
            </div>

            <Checkbox
              label="Furnished"
              checked={formData.furnished}
              onChange={(e) => handleInputChange('furnished', e.target.checked)}
            />
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Euro className="w-5 h-5 text-[#4A148C]" />
              Pricing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Monthly Rent (€)"
                type="number"
                min="0"
                value={formData.monthly_rent}
                onChange={(e) => handleInputChange('monthly_rent', parseFloat(e.target.value) || 0)}
                leftIcon={<Euro className="w-4 h-4" />}
                required
              />

              <Input
                label="Charges (€)"
                type="number"
                min="0"
                value={formData.charges}
                onChange={(e) => handleInputChange('charges', parseFloat(e.target.value) || 0)}
                leftIcon={<Euro className="w-4 h-4" />}
              />

              <Input
                label="Deposit (€)"
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
          <CardContent>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {AMENITIES.map((amenity) => (
                <Checkbox
                  key={amenity.value}
                  label={amenity.label}
                  checked={selectedAmenities.includes(amenity.value)}
                  onChange={() => toggleAmenity(amenity.value)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* House Rules */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">House Rules</h3>

            <div className="space-y-3">
              <Checkbox
                label="Smoking allowed"
                checked={formData.smoking_allowed}
                onChange={(e) => handleInputChange('smoking_allowed', e.target.checked)}
              />
              <Checkbox
                label="Pets allowed"
                checked={formData.pets_allowed}
                onChange={(e) => handleInputChange('pets_allowed', e.target.checked)}
              />
              <Checkbox
                label="Couples allowed"
                checked={formData.couples_allowed}
                onChange={(e) => handleInputChange('couples_allowed', e.target.checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Available From"
                type="date"
                value={formData.available_from}
                onChange={(e) => handleInputChange('available_from', e.target.value)}
              />

              <Input
                label="Minimum Stay (months)"
                type="number"
                min="1"
                value={formData.minimum_stay_months}
                onChange={(e) => handleInputChange('minimum_stay_months', parseInt(e.target.value) || 1)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Creating...' : 'Create Property'}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
