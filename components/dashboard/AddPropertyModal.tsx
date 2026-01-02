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

const translations = {
  toasts: {
    success: {
      fr: 'Propriété créée avec succès !',
      en: 'Property created successfully!',
      nl: 'Eigendom succesvol aangemaakt!',
      de: 'Immobilie erfolgreich erstellt!',
    },
    error: {
      fr: 'Erreur lors de la création de la propriété',
      en: 'Error creating property',
      nl: 'Fout bij het aanmaken van eigendom',
      de: 'Fehler beim Erstellen der Immobilie',
    },
  },
  dialog: {
    title: {
      fr: 'Ajouter une propriété',
      en: 'Add a property',
      nl: 'Eigendom toevoegen',
      de: 'Immobilie hinzufügen',
    },
    description: {
      fr: 'Complétez les informations pour créer votre annonce',
      en: 'Complete the information to create your listing',
      nl: 'Vul de gegevens in om uw advertentie te maken',
      de: 'Vervollständigen Sie die Angaben für Ihr Inserat',
    },
  },
  buttons: {
    cancel: {
      fr: 'Annuler',
      en: 'Cancel',
      nl: 'Annuleren',
      de: 'Abbrechen',
    },
    back: {
      fr: 'Retour',
      en: 'Back',
      nl: 'Terug',
      de: 'Zurück',
    },
    continue: {
      fr: 'Continuer',
      en: 'Continue',
      nl: 'Doorgaan',
      de: 'Weiter',
    },
    creating: {
      fr: 'Création...',
      en: 'Creating...',
      nl: 'Aanmaken...',
      de: 'Erstellen...',
    },
    createProperty: {
      fr: 'Créer la propriété',
      en: 'Create property',
      nl: 'Eigendom aanmaken',
      de: 'Immobilie erstellen',
    },
  },
  steps: {
    type: { fr: 'Type', en: 'Type', nl: 'Type', de: 'Typ' },
    details: { fr: 'Détails', en: 'Details', nl: 'Details', de: 'Details' },
    price: { fr: 'Prix', en: 'Price', nl: 'Prijs', de: 'Preis' },
    amenities: { fr: 'Équipements', en: 'Amenities', nl: 'Voorzieningen', de: 'Ausstattung' },
  },
  propertyTypes: {
    apartment: { fr: 'Appartement', en: 'Apartment', nl: 'Appartement', de: 'Wohnung' },
    house: { fr: 'Maison', en: 'House', nl: 'Huis', de: 'Haus' },
    studio: { fr: 'Studio', en: 'Studio', nl: 'Studio', de: 'Studio' },
    coliving: { fr: 'Coliving', en: 'Coliving', nl: 'Coliving', de: 'Coliving' },
  },
  amenitiesLabels: {
    wifi: { fr: 'WiFi', en: 'WiFi', nl: 'WiFi', de: 'WLAN' },
    parking: { fr: 'Parking', en: 'Parking', nl: 'Parking', de: 'Parkplatz' },
    garden: { fr: 'Jardin', en: 'Garden', nl: 'Tuin', de: 'Garten' },
    gym: { fr: 'Salle de sport', en: 'Gym', nl: 'Sportschool', de: 'Fitnessstudio' },
    washing_machine: { fr: 'Machine à laver', en: 'Washing machine', nl: 'Wasmachine', de: 'Waschmaschine' },
    air_conditioning: { fr: 'Climatisation', en: 'Air conditioning', nl: 'Airconditioning', de: 'Klimaanlage' },
    heating: { fr: 'Chauffage', en: 'Heating', nl: 'Verwarming', de: 'Heizung' },
    kitchen: { fr: 'Cuisine équipée', en: 'Equipped kitchen', nl: 'Uitgeruste keuken', de: 'Einbauküche' },
    furnished: { fr: 'Meublé', en: 'Furnished', nl: 'Gemeubileerd', de: 'Möbliert' },
  },
  form: {
    listingTitle: { fr: 'Titre de l\'annonce', en: 'Listing title', nl: 'Advertentietitel', de: 'Inserattitel' },
    listingPlaceholder: {
      fr: 'Ex: Bel appartement lumineux en centre-ville',
      en: 'E.g., Beautiful bright apartment in city center',
      nl: 'Bijv. Mooi licht appartement in het centrum',
      de: 'Z.B. Schöne helle Wohnung im Stadtzentrum',
    },
    propertyType: { fr: 'Type de bien', en: 'Property type', nl: 'Type eigendom', de: 'Immobilientyp' },
    description: { fr: 'Description (optionnel)', en: 'Description (optional)', nl: 'Beschrijving (optioneel)', de: 'Beschreibung (optional)' },
    descriptionPlaceholder: { fr: 'Décrivez votre bien...', en: 'Describe your property...', nl: 'Beschrijf uw eigendom...', de: 'Beschreiben Sie Ihre Immobilie...' },
    address: { fr: 'Adresse', en: 'Address', nl: 'Adres', de: 'Adresse' },
    addressPlaceholder: { fr: '123 Rue Principale', en: '123 Main Street', nl: '123 Hoofdstraat', de: '123 Hauptstraße' },
    city: { fr: 'Ville', en: 'City', nl: 'Stad', de: 'Stadt' },
    cityPlaceholder: { fr: 'Bruxelles', en: 'Brussels', nl: 'Brussel', de: 'Brüssel' },
    postalCode: { fr: 'Code postal', en: 'Postal code', nl: 'Postcode', de: 'Postleitzahl' },
    bedrooms: { fr: 'Chambres', en: 'Bedrooms', nl: 'Slaapkamers', de: 'Schlafzimmer' },
    bathrooms: { fr: 'Salles de bain', en: 'Bathrooms', nl: 'Badkamers', de: 'Badezimmer' },
    area: { fr: 'Surface (m²)', en: 'Area (m²)', nl: 'Oppervlakte (m²)', de: 'Fläche (m²)' },
    availableFrom: { fr: 'Disponible à partir du', en: 'Available from', nl: 'Beschikbaar vanaf', de: 'Verfügbar ab' },
    monthlyRent: { fr: 'Loyer mensuel (€)', en: 'Monthly rent (€)', nl: 'Maandelijkse huur (€)', de: 'Monatsmiete (€)' },
    charges: { fr: 'Charges (€)', en: 'Charges (€)', nl: 'Kosten (€)', de: 'Nebenkosten (€)' },
    deposit: { fr: 'Caution (€)', en: 'Security deposit (€)', nl: 'Borg (€)', de: 'Kaution (€)' },
    minimumStay: { fr: 'Durée minimum (mois)', en: 'Minimum stay (months)', nl: 'Minimale verblijfsduur (maanden)', de: 'Mindestaufenthalt (Monate)' },
    monthlySummary: { fr: 'Récapitulatif mensuel', en: 'Monthly summary', nl: 'Maandelijks overzicht', de: 'Monatliche Übersicht' },
    rentAndCharges: { fr: 'Loyer + Charges', en: 'Rent + Charges', nl: 'Huur + Kosten', de: 'Miete + Nebenkosten' },
    perMonth: { fr: '€/mois', en: '€/month', nl: '€/maand', de: '€/Monat' },
    amenitiesLabel: { fr: 'Équipements', en: 'Amenities', nl: 'Voorzieningen', de: 'Ausstattung' },
    houseRules: { fr: 'Règles de la maison', en: 'House rules', nl: 'Huisregels', de: 'Hausregeln' },
    petsAllowed: { fr: 'Animaux acceptés', en: 'Pets allowed', nl: 'Huisdieren toegestaan', de: 'Haustiere erlaubt' },
    smokingAllowed: { fr: 'Fumeurs acceptés', en: 'Smoking allowed', nl: 'Roken toegestaan', de: 'Rauchen erlaubt' },
    couplesAllowed: { fr: 'Couples acceptés', en: 'Couples allowed', nl: 'Koppels toegestaan', de: 'Paare erlaubt' },
  },
};

type Language = 'fr' | 'en' | 'nl' | 'de';

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
  const { language } = useLanguage();
  const lang = language as Language;
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

      toast.success(translations.toasts.success[lang]);
      handleClose();
      onSuccess?.();
      router.refresh();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : translations.toasts.error[lang];
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
              {translations.dialog.title[lang]}
            </DialogTitle>
            <DialogDescription className="text-white/80">
              {translations.dialog.description[lang]}
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
                  <span className="hidden sm:inline">{translations.steps[step.id as keyof typeof translations.steps]?.[lang] || step.title}</span>
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
                  label={translations.form.listingTitle[lang]}
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder={translations.form.listingPlaceholder[lang]}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.form.propertyType[lang]}
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
                          {translations.propertyTypes[type.value as keyof typeof translations.propertyTypes]?.[lang] || type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <Textarea
                  label={translations.form.description[lang]}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={translations.form.descriptionPlaceholder[lang]}
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
                  label={translations.form.address[lang]}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder={translations.form.addressPlaceholder[lang]}
                  leftIcon={<MapPin className="w-4 h-4" />}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={translations.form.city[lang]}
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder={translations.form.cityPlaceholder[lang]}
                    required
                  />
                  <Input
                    label={translations.form.postalCode[lang]}
                    value={formData.postal_code}
                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                    placeholder="1000"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label={translations.form.bedrooms[lang]}
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                    leftIcon={<Bed className="w-4 h-4" />}
                  />
                  <Input
                    label={translations.form.bathrooms[lang]}
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 0)}
                    leftIcon={<Bath className="w-4 h-4" />}
                  />
                  <Input
                    label={translations.form.area[lang]}
                    type="number"
                    min="0"
                    value={formData.surface_area || ''}
                    onChange={(e) => handleInputChange('surface_area', parseInt(e.target.value) || undefined)}
                    leftIcon={<Maximize2 className="w-4 h-4" />}
                  />
                </div>

                <Input
                  label={translations.form.availableFrom[lang]}
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
                  label={translations.form.monthlyRent[lang]}
                  type="number"
                  min="0"
                  value={formData.monthly_rent || ''}
                  onChange={(e) => handleInputChange('monthly_rent', parseFloat(e.target.value) || 0)}
                  leftIcon={<Euro className="w-4 h-4" />}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={translations.form.charges[lang]}
                    type="number"
                    min="0"
                    value={formData.charges || ''}
                    onChange={(e) => handleInputChange('charges', parseFloat(e.target.value) || 0)}
                    leftIcon={<Euro className="w-4 h-4" />}
                  />
                  <Input
                    label={translations.form.deposit[lang]}
                    type="number"
                    min="0"
                    value={formData.deposit || ''}
                    onChange={(e) => handleInputChange('deposit', parseFloat(e.target.value) || 0)}
                    leftIcon={<Euro className="w-4 h-4" />}
                  />
                </div>

                <Input
                  label={translations.form.minimumStay[lang]}
                  type="number"
                  min="1"
                  value={formData.minimum_stay_months}
                  onChange={(e) => handleInputChange('minimum_stay_months', parseInt(e.target.value) || 1)}
                />

                {/* Summary card */}
                <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">{translations.form.monthlySummary[lang]}</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{translations.form.rentAndCharges[lang]}</span>
                    <span className="font-bold" style={{ color: '#9c5698' }}>
                      {(formData.monthly_rent + formData.charges).toLocaleString(lang === 'en' ? 'en-US' : lang === 'de' ? 'de-DE' : lang === 'nl' ? 'nl-NL' : 'fr-FR')} {translations.form.perMonth[lang]}
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
                    {translations.form.amenitiesLabel[lang]}
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
                          {translations.amenitiesLabels[amenity.value as keyof typeof translations.amenitiesLabels]?.[lang] || amenity.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {translations.form.houseRules[lang]}
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
                      <span className="text-sm text-gray-700">{translations.form.petsAllowed[lang]}</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-purple-300 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={formData.smoking_allowed}
                        onChange={(e) => handleInputChange('smoking_allowed', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <Cigarette className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700">{translations.form.smokingAllowed[lang]}</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-purple-300 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={formData.couples_allowed}
                        onChange={(e) => handleInputChange('couples_allowed', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <Users className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700">{translations.form.couplesAllowed[lang]}</span>
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
                {translations.buttons.cancel[lang]}
              </>
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                {translations.buttons.back[lang]}
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
                  {translations.buttons.creating[lang]}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {translations.buttons.createProperty[lang]}
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
              {translations.buttons.continue[lang]}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddPropertyModal;
