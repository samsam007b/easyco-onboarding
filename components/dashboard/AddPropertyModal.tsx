'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  MapPin,
  Euro,
  Bed,
  Bath,
  Building2,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Wifi,
  Car,
  Trees,
  Dumbbell,
  WashingMachine,
  Wind,
  Flame,
  Utensils,
  Sofa,
  PawPrint,
  Cigarette,
  Users,
  Calendar,
  Maximize2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { createProperty } from '@/lib/property-helpers';
import { toast } from 'sonner';
import type { PropertyType, PropertyAmenity } from '@/lib/types/property';
import { useLanguage } from '@/lib/i18n/use-language';
import { cn } from '@/lib/utils';

// V3 Owner gradient constants
const ownerGradient = 'linear-gradient(135deg, #9c5698 0%, #a5568d 25%, #af5682 50%, #b85676 75%, #c2566b 100%)';

const PROPERTY_TYPES: { value: PropertyType; label: string; icon: React.ReactNode }[] = [
  { value: 'apartment', label: 'Apartment', icon: <Building2 className="w-4 h-4" /> },
  { value: 'house', label: 'House', icon: <Home className="w-4 h-4" /> },
  { value: 'studio', label: 'Studio', icon: <Maximize2 className="w-4 h-4" /> },
  { value: 'coliving', label: 'Coliving', icon: <Users className="w-4 h-4" /> },
];

const AMENITIES_CONFIG: { value: PropertyAmenity; label: string; icon: React.ReactNode }[] = [
  { value: 'wifi', label: 'WiFi', icon: <Wifi className="w-4 h-4" /> },
  { value: 'parking', label: 'Parking', icon: <Car className="w-4 h-4" /> },
  { value: 'garden', label: 'Garden', icon: <Trees className="w-4 h-4" /> },
  { value: 'gym', label: 'Gym', icon: <Dumbbell className="w-4 h-4" /> },
  { value: 'washing_machine', label: 'Washing machine', icon: <WashingMachine className="w-4 h-4" /> },
  { value: 'air_conditioning', label: 'Air conditioning', icon: <Wind className="w-4 h-4" /> },
  { value: 'heating', label: 'Heating', icon: <Flame className="w-4 h-4" /> },
  { value: 'kitchen', label: 'Equipped kitchen', icon: <Utensils className="w-4 h-4" /> },
  { value: 'furnished', label: 'Furnished', icon: <Sofa className="w-4 h-4" /> },
];

interface AddPropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type Step = 'type' | 'details' | 'pricing' | 'amenities';

const STEPS: { id: Step; title: string; icon: React.ReactNode }[] = [
  { id: 'type', title: 'Type', icon: <Home className="w-4 h-4" /> },
  { id: 'details', title: 'Details', icon: <MapPin className="w-4 h-4" /> },
  { id: 'pricing', title: 'Price', icon: <Euro className="w-4 h-4" /> },
  { id: 'amenities', title: 'Amenities', icon: <Wifi className="w-4 h-4" /> },
];

export function AddPropertyModal({ open, onOpenChange, onSuccess }: AddPropertyModalProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<Step>('type');
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

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: PropertyAmenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      property_type: 'apartment',
      address: '',
      city: '',
      postal_code: '',
      bedrooms: 1,
      bathrooms: 1,
      surface_area: undefined,
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
    setSelectedAmenities([]);
    setCurrentStep('type');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
    }
  };

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'type':
        return formData.title.trim().length > 0;
      case 'details':
        return formData.city.trim().length > 0 && formData.postal_code.trim().length > 0;
      case 'pricing':
        return formData.monthly_rent > 0;
      case 'amenities':
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const result = await createProperty({
        ...formData,
        amenities: selectedAmenities,
      });

      if (!result.success) {
        throw new Error(result.error || 'Error creating property');
      }

      toast.success('Property created successfully!');
      handleClose();
      onSuccess?.();
      router.refresh();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error creating property';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
        {/* Header with gradient */}
        <div
          className="px-6 py-4 text-white"
          style={{ background: ownerGradient }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Add a property
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Complete the information to create your listing
            </DialogDescription>
          </DialogHeader>

          {/* Step indicator */}
          <div className="flex items-center justify-between mt-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => index <= currentStepIndex && setCurrentStep(step.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all",
                    currentStep === step.id
                      ? "bg-white text-purple-700 font-medium"
                      : index < currentStepIndex
                        ? "bg-white/30 text-white cursor-pointer hover:bg-white/40"
                        : "bg-white/10 text-white/60 cursor-not-allowed"
                  )}
                  disabled={index > currentStepIndex}
                >
                  {index < currentStepIndex ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.icon
                  )}
                  <span className="hidden sm:inline">{step.title}</span>
                </button>
                {index < STEPS.length - 1 && (
                  <ChevronRight className="w-4 h-4 mx-1 text-white/40" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <AnimatePresence mode="wait">
            {/* Step 1: Type */}
            {currentStep === 'type' && (
              <motion.div
                key="type"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Input
                  label="Listing title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="E.g., Beautiful bright apartment in city center"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {PROPERTY_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('property_type', type.value)}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                          formData.property_type === type.value
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            formData.property_type === type.value
                              ? "bg-purple-500 text-white"
                              : "bg-gray-100 text-gray-500"
                          )}
                        >
                          {type.icon}
                        </div>
                        <span className={cn(
                          "font-medium",
                          formData.property_type === type.value ? "text-purple-700" : "text-gray-700"
                        )}>
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <Textarea
                  label="Description (optional)"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your property..."
                  rows={3}
                />
              </motion.div>
            )}

            {/* Step 2: Details */}
            {currentStep === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main Street"
                  leftIcon={<MapPin className="w-4 h-4" />}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Brussels"
                    required
                  />
                  <Input
                    label="Postal code"
                    value={formData.postal_code}
                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                    placeholder="1000"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
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
                    label="Area (m²)"
                    type="number"
                    min="0"
                    value={formData.surface_area || ''}
                    onChange={(e) => handleInputChange('surface_area', parseInt(e.target.value) || undefined)}
                    leftIcon={<Maximize2 className="w-4 h-4" />}
                  />
                </div>

                <Input
                  label="Available from"
                  type="date"
                  value={formData.available_from}
                  onChange={(e) => handleInputChange('available_from', e.target.value)}
                  leftIcon={<Calendar className="w-4 h-4" />}
                />
              </motion.div>
            )}

            {/* Step 3: Pricing */}
            {currentStep === 'pricing' && (
              <motion.div
                key="pricing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Input
                  label="Monthly rent (€)"
                  type="number"
                  min="0"
                  value={formData.monthly_rent || ''}
                  onChange={(e) => handleInputChange('monthly_rent', parseFloat(e.target.value) || 0)}
                  leftIcon={<Euro className="w-4 h-4" />}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Charges (€)"
                    type="number"
                    min="0"
                    value={formData.charges || ''}
                    onChange={(e) => handleInputChange('charges', parseFloat(e.target.value) || 0)}
                    leftIcon={<Euro className="w-4 h-4" />}
                  />
                  <Input
                    label="Security deposit (€)"
                    type="number"
                    min="0"
                    value={formData.deposit || ''}
                    onChange={(e) => handleInputChange('deposit', parseFloat(e.target.value) || 0)}
                    leftIcon={<Euro className="w-4 h-4" />}
                  />
                </div>

                <Input
                  label="Minimum stay (months)"
                  type="number"
                  min="1"
                  value={formData.minimum_stay_months}
                  onChange={(e) => handleInputChange('minimum_stay_months', parseInt(e.target.value) || 1)}
                />

                {/* Summary card */}
                <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">Monthly summary</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Rent + Charges</span>
                    <span className="font-bold" style={{ color: '#9c5698' }}>
                      {(formData.monthly_rent + formData.charges).toLocaleString('en-US')} €/month
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Amenities */}
            {currentStep === 'amenities' && (
              <motion.div
                key="amenities"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Amenities
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {AMENITIES_CONFIG.map((amenity) => (
                      <button
                        key={amenity.value}
                        type="button"
                        onClick={() => toggleAmenity(amenity.value)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center",
                          selectedAmenities.includes(amenity.value)
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                        )}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            selectedAmenities.includes(amenity.value)
                              ? "bg-purple-500 text-white"
                              : "bg-gray-100 text-gray-500"
                          )}
                        >
                          {amenity.icon}
                        </div>
                        <span className={cn(
                          "text-xs font-medium",
                          selectedAmenities.includes(amenity.value) ? "text-purple-700" : "text-gray-600"
                        )}>
                          {amenity.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    House rules
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-purple-300 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={formData.pets_allowed}
                        onChange={(e) => handleInputChange('pets_allowed', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <PawPrint className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700">Pets allowed</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-purple-300 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={formData.smoking_allowed}
                        onChange={(e) => handleInputChange('smoking_allowed', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <Cigarette className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700">Smoking allowed</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-purple-300 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={formData.couples_allowed}
                        onChange={(e) => handleInputChange('couples_allowed', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <Users className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700">Couples allowed</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={currentStepIndex === 0 ? handleClose : goToPrevStep}
            disabled={isSubmitting}
          >
            {currentStepIndex === 0 ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </>
            )}
          </Button>

          {currentStep === 'amenities' ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="text-white"
              style={{ background: ownerGradient }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Create property
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={goToNextStep}
              disabled={!canProceed()}
              className="text-white"
              style={{ background: canProceed() ? ownerGradient : undefined }}
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddPropertyModal;
