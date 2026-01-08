'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  X,
  Home,
  Euro,
  Bed,
  Bath,
  Calendar,
  MapPin,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';

export interface AdvancedFilterOptions {
  // Price
  minPrice: number;
  maxPrice: number;

  // Rooms
  bedrooms: number | null;
  bathrooms: number | null;

  // Property details
  propertyType: string;
  furnished: boolean | null;
  minSurface: number | null;
  maxSurface: number | null;

  // Location
  city: string;
  neighborhoods: string[];
  maxDistance: number | null; // km from city center

  // Availability
  availableFrom: string | null;
  minLeaseDuration: number | null; // months
  maxLeaseDuration: number | null; // months

  // Amenities
  amenities: string[];
  accessibility: boolean;
  petsAllowed: boolean;
  smokingAllowed: boolean;

  // Building
  hasElevator: boolean;
  hasParking: boolean;
  hasBalcony: boolean;
  hasGarden: boolean;
  floor: string; // 'ground', 'low', 'mid', 'high', 'all'

  // Energy & Environment
  energyClass: string[]; // A, B, C, D, E, F, G
  greenhouseGasClass: string[]; // A, B, C, D, E, F, G

  // Preferences
  instantBooking: boolean;
  verifiedOnly: boolean;
}

interface AdvancedFiltersProps {
  filters: AdvancedFilterOptions;
  onFiltersChange: (filters: AdvancedFilterOptions) => void;
  onClose?: () => void;
  onReset?: () => void;
}

const PROPERTY_TYPES = [
  { value: 'all', label: 'Tous les types' },
  { value: 'apartment', label: 'Appartement' },
  { value: 'house', label: 'Maison' },
  { value: 'studio', label: 'Studio' },
  { value: 'loft', label: 'Loft' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'room', label: 'Chambre' },
];

const AMENITIES = [
  { id: 'wifi', label: 'WiFi', icon: '📶' },
  { id: 'kitchen', label: 'Cuisine équipée', icon: '🍳' },
  { id: 'dishwasher', label: 'Lave-vaisselle', icon: '🍽️' },
  { id: 'washing_machine', label: 'Machine à laver', icon: '👕' },
  { id: 'dryer', label: 'Sèche-linge', icon: '🌀' },
  { id: 'tv', label: 'Télévision', icon: '📺' },
  { id: 'air_conditioning', label: 'Climatisation', icon: '❄️' },
  { id: 'heating', label: 'Chauffage central', icon: '🔥' },
  { id: 'fireplace', label: 'Cheminée', icon: '🔥' },
  { id: 'workspace', label: 'Espace de travail', icon: '💻' },
  { id: 'gym', label: 'Salle de sport', icon: '🏋️' },
  { id: 'pool', label: 'Piscine', icon: '🏊' },
  { id: 'security', label: 'Sécurité 24/7', icon: '🔒' },
  { id: 'concierge', label: 'Concierge', icon: '🛎️' },
];

const FLOOR_OPTIONS = [
  { value: 'all', label: 'Tous les étages' },
  { value: 'ground', label: 'Rez-de-chaussée' },
  { value: 'low', label: 'Étages bas (1-2)' },
  { value: 'mid', label: 'Étages moyens (3-5)' },
  { value: 'high', label: 'Étages hauts (6+)' },
];

const ENERGY_CLASSES = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onClose,
  onReset,
}: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<AdvancedFilterOptions>(filters);
  const { language, getSection } = useLanguage();
  const ariaLabels = getSection('ariaLabels');

  const updateFilter = (key: keyof AdvancedFilterOptions, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenityId: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const toggleEnergyClass = (energyClass: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      energyClass: prev.energyClass.includes(energyClass)
        ? prev.energyClass.filter((c) => c !== energyClass)
        : [...prev.energyClass, energyClass],
    }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose?.();
  };

  const handleReset = () => {
    onReset?.();
    onClose?.();
  };

  const activeFiltersCount = [
    localFilters.propertyType !== 'all',
    localFilters.furnished !== null,
    localFilters.bedrooms !== null,
    localFilters.bathrooms !== null,
    localFilters.minSurface !== null,
    localFilters.city !== '',
    localFilters.amenities.length > 0,
    localFilters.petsAllowed,
    localFilters.smokingAllowed,
    localFilters.hasParking,
    localFilters.hasBalcony,
    localFilters.hasGarden,
    localFilters.hasElevator,
    localFilters.accessibility,
    localFilters.floor !== 'all',
    localFilters.energyClass.length > 0,
    localFilters.instantBooking,
    localFilters.verifiedOnly,
  ].filter(Boolean).length;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-searcher-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtres avancés</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="default" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} aria-label={ariaLabels?.closeFilters?.[language] || 'Fermer les filtres'}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Price Range */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <Euro className="w-4 h-4 text-searcher-600" />
              <span>Budget mensuel</span>
            </Label>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Minimum: {localFilters.minPrice}€</label>
                <Slider
                  min={0}
                  max={5000}
                  step={50}
                  value={localFilters.minPrice}
                  onChange={(value) => updateFilter('minPrice', value)}
                  showValue={false}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Maximum: {localFilters.maxPrice}€</label>
                <Slider
                  min={0}
                  max={5000}
                  step={50}
                  value={localFilters.maxPrice}
                  onChange={(value) => updateFilter('maxPrice', value)}
                  showValue={false}
                />
              </div>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <Home className="w-4 h-4 text-searcher-600" />
              <span>Type de bien</span>
            </Label>
            <select
              value={localFilters.propertyType}
              onChange={(e) => updateFilter('propertyType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-searcher-600 focus:border-transparent"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Bed className="w-4 h-4 text-searcher-600" />
                <span>Chambres</span>
              </Label>
              <div className="flex gap-2 flex-wrap">
                {[null, 1, 2, 3, 4, 5].map((num) => (
                  <Button
                    key={num ?? 'any'}
                    variant={localFilters.bedrooms === num ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFilter('bedrooms', num)}
                    className="flex-1 min-w-[60px]"
                  >
                    {num ?? 'Tous'}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Bath className="w-4 h-4 text-searcher-600" />
                <span>Salles de bain</span>
              </Label>
              <div className="flex gap-2 flex-wrap">
                {[null, 1, 2, 3].map((num) => (
                  <Button
                    key={num ?? 'any'}
                    variant={localFilters.bathrooms === num ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFilter('bathrooms', num)}
                    className="flex-1 min-w-[60px]"
                  >
                    {num ?? 'Tous'}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Surface */}
          <div>
            <Label className="mb-3">Surface (m²)</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  placeholder="Min"
                  value={localFilters.minSurface ?? ''}
                  onChange={(e) =>
                    updateFilter('minSurface', e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max"
                  value={localFilters.maxSurface ?? ''}
                  onChange={(e) =>
                    updateFilter('maxSurface', e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Furnished */}
          <div>
            <Label className="mb-3">Meublé</Label>
            <div className="flex gap-2">
              <Button
                variant={localFilters.furnished === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilter('furnished', null)}
                className="flex-1"
              >
                Tous
              </Button>
              <Button
                variant={localFilters.furnished === true ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilter('furnished', true)}
                className="flex-1"
              >
                Meublé
              </Button>
              <Button
                variant={localFilters.furnished === false ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilter('furnished', false)}
                className="flex-1"
              >
                Non meublé
              </Button>
            </div>
          </div>

          {/* Floor */}
          <div>
            <Label className="mb-3">Étage</Label>
            <select
              value={localFilters.floor}
              onChange={(e) => updateFilter('floor', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-searcher-600 focus:border-transparent"
            >
              {FLOOR_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Amenities */}
          <div>
            <Label className="mb-3">Équipements</Label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((amenity) => (
                <Button
                  key={amenity.id}
                  variant={localFilters.amenities.includes(amenity.id) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleAmenity(amenity.id)}
                  className="gap-2"
                >
                  <span>{amenity.icon}</span>
                  <span>{amenity.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Building Features */}
          <div>
            <Label className="mb-3">Caractéristiques de l'immeuble</Label>
            <div className="space-y-3">
              {[
                { key: 'hasElevator', label: 'Ascenseur', icon: '🛗' },
                { key: 'hasParking', label: 'Parking', icon: '🚗' },
                { key: 'hasBalcony', label: 'Balcon', icon: '🌿' },
                { key: 'hasGarden', label: 'Jardin', icon: '🌳' },
              ].map((feature) => (
                <div key={feature.key} className="flex items-center justify-between">
                  <Label htmlFor={feature.key} className="flex items-center gap-2">
                    <span>{feature.icon}</span>
                    <span>{feature.label}</span>
                  </Label>
                  <Switch
                    id={feature.key}
                    checked={localFilters[feature.key as keyof AdvancedFilterOptions] as boolean}
                    onCheckedChange={(checked) => updateFilter(feature.key as keyof AdvancedFilterOptions, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div>
            <Label className="mb-3">Règles et préférences</Label>
            <div className="space-y-3">
              {[
                { key: 'petsAllowed', label: 'Animaux acceptés', icon: '🐕' },
                { key: 'smokingAllowed', label: 'Fumeur accepté', icon: '🚬' },
                { key: 'accessibility', label: 'Accessible PMR', icon: '♿' },
              ].map((policy) => (
                <div key={policy.key} className="flex items-center justify-between">
                  <Label htmlFor={policy.key} className="flex items-center gap-2">
                    <span>{policy.icon}</span>
                    <span>{policy.label}</span>
                  </Label>
                  <Switch
                    id={policy.key}
                    checked={localFilters[policy.key as keyof AdvancedFilterOptions] as boolean}
                    onCheckedChange={(checked) => updateFilter(policy.key as keyof AdvancedFilterOptions, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Energy Performance */}
          <div>
            <Label className="mb-3">Performance énergétique (DPE)</Label>
            <div className="flex gap-2 flex-wrap">
              {ENERGY_CLASSES.map((energyClass) => (
                <Button
                  key={energyClass}
                  variant={localFilters.energyClass.includes(energyClass) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleEnergyClass(energyClass)}
                  className={cn(
                    'w-10 h-10',
                    energyClass === 'A' && 'bg-green-600 hover:bg-green-700',
                    energyClass === 'B' && 'bg-green-500 hover:bg-green-600',
                    energyClass === 'C' && 'bg-yellow-500 hover:bg-yellow-600',
                    energyClass === 'D' && 'bg-orange-500 hover:bg-orange-600',
                    energyClass === 'E' && 'bg-orange-600 hover:bg-orange-700',
                    energyClass === 'F' && 'bg-red-500 hover:bg-red-600',
                    energyClass === 'G' && 'bg-red-700 hover:bg-red-800'
                  )}
                >
                  {energyClass}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <Label className="mb-3">Filtres rapides</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="instantBooking">Réservation instantanée</Label>
                <Switch
                  id="instantBooking"
                  checked={localFilters.instantBooking}
                  onCheckedChange={(checked) => updateFilter('instantBooking', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="verifiedOnly">Propriétaires vérifiés uniquement</Label>
                <Switch
                  id="verifiedOnly"
                  checked={localFilters.verifiedOnly}
                  onCheckedChange={(checked) => updateFilter('verifiedOnly', checked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={handleReset} className="flex-1 gap-2">
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </Button>
          <Button onClick={handleApply} className="flex-1 gap-2">
            <Filter className="w-4 h-4" />
            Appliquer ({activeFiltersCount})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
