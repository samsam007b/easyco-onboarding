'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, RotateCcw } from 'lucide-react';
import type { AdvancedFilterOptions } from './AdvancedFilters';

interface ActiveFiltersBarProps {
  filters: AdvancedFilterOptions;
  onRemoveFilter: (key: keyof AdvancedFilterOptions, value?: any) => void;
  onClearAll: () => void;
}

export function ActiveFiltersBar({ filters, onRemoveFilter, onClearAll }: ActiveFiltersBarProps) {
  const activeFilters: Array<{ key: keyof AdvancedFilterOptions; label: string; value?: any }> = [];

  // Price range
  if (filters.minPrice > 0 || filters.maxPrice < 5000) {
    activeFilters.push({
      key: 'minPrice',
      label: `${filters.minPrice}€ - ${filters.maxPrice}€`,
    });
  }

  // Property type
  if (filters.propertyType !== 'all') {
    const typeLabels: Record<string, string> = {
      apartment: 'Appartement',
      house: 'Maison',
      studio: 'Studio',
      loft: 'Loft',
      duplex: 'Duplex',
      room: 'Chambre',
    };
    activeFilters.push({
      key: 'propertyType',
      label: typeLabels[filters.propertyType] || filters.propertyType,
    });
  }

  // Bedrooms
  if (filters.bedrooms !== null) {
    activeFilters.push({
      key: 'bedrooms',
      label: `${filters.bedrooms} chambre${filters.bedrooms > 1 ? 's' : ''}`,
    });
  }

  // Bathrooms
  if (filters.bathrooms !== null) {
    activeFilters.push({
      key: 'bathrooms',
      label: `${filters.bathrooms} salle${filters.bathrooms > 1 ? 's' : ''} de bain`,
    });
  }

  // Furnished
  if (filters.furnished !== null) {
    activeFilters.push({
      key: 'furnished',
      label: filters.furnished ? 'Meublé' : 'Non meublé',
    });
  }

  // Surface
  if (filters.minSurface !== null || filters.maxSurface !== null) {
    const min = filters.minSurface ?? 0;
    const max = filters.maxSurface ?? '∞';
    activeFilters.push({
      key: 'minSurface',
      label: `${min}m² - ${max}m²`,
    });
  }

  // City
  if (filters.city) {
    activeFilters.push({
      key: 'city',
      label: filters.city,
    });
  }

  // Floor
  if (filters.floor !== 'all') {
    const floorLabels: Record<string, string> = {
      ground: 'Rez-de-chaussée',
      low: 'Étages bas',
      mid: 'Étages moyens',
      high: 'Étages hauts',
    };
    activeFilters.push({
      key: 'floor',
      label: floorLabels[filters.floor] || filters.floor,
    });
  }

  // Amenities
  filters.amenities.forEach((amenity) => {
    const amenityLabels: Record<string, string> = {
      wifi: 'WiFi',
      kitchen: 'Cuisine équipée',
      dishwasher: 'Lave-vaisselle',
      washing_machine: 'Machine à laver',
      dryer: 'Sèche-linge',
      tv: 'TV',
      air_conditioning: 'Climatisation',
      heating: 'Chauffage',
      fireplace: 'Cheminée',
      workspace: 'Espace travail',
      gym: 'Salle de sport',
      pool: 'Piscine',
      security: 'Sécurité',
      concierge: 'Concierge',
    };
    activeFilters.push({
      key: 'amenities',
      label: amenityLabels[amenity] || amenity,
      value: amenity,
    });
  });

  // Building features
  if (filters.hasElevator) {
    activeFilters.push({ key: 'hasElevator', label: 'Ascenseur' });
  }
  if (filters.hasParking) {
    activeFilters.push({ key: 'hasParking', label: 'Parking' });
  }
  if (filters.hasBalcony) {
    activeFilters.push({ key: 'hasBalcony', label: 'Balcon' });
  }
  if (filters.hasGarden) {
    activeFilters.push({ key: 'hasGarden', label: 'Jardin' });
  }

  // Policies
  if (filters.petsAllowed) {
    activeFilters.push({ key: 'petsAllowed', label: 'Animaux acceptés' });
  }
  if (filters.smokingAllowed) {
    activeFilters.push({ key: 'smokingAllowed', label: 'Fumeur accepté' });
  }
  if (filters.accessibility) {
    activeFilters.push({ key: 'accessibility', label: 'Accessible PMR' });
  }

  // Energy class
  if (filters.energyClass.length > 0) {
    activeFilters.push({
      key: 'energyClass',
      label: `DPE: ${filters.energyClass.join(', ')}`,
    });
  }

  // Quick filters
  if (filters.instantBooking) {
    activeFilters.push({ key: 'instantBooking', label: 'Réservation instantanée' });
  }
  if (filters.verifiedOnly) {
    activeFilters.push({ key: 'verifiedOnly', label: 'Propriétaires vérifiés' });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap p-4 bg-purple-50 rounded-lg border border-purple-200">
      <span className="text-sm font-medium text-gray-700">Filtres actifs:</span>

      {activeFilters.map((filter, index) => (
        <Badge
          key={`${filter.key}-${index}`}
          variant="secondary"
          className="gap-1 py-1 px-3 hover:bg-purple-200 transition-colors"
        >
          <span>{filter.label}</span>
          <button
            onClick={() => onRemoveFilter(filter.key, filter.value)}
            className="ml-1 hover:text-red-600 transition-colors"
            aria-label={`Retirer le filtre ${filter.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="gap-2 text-purple-700 hover:text-purple-900 hover:bg-purple-100"
      >
        <RotateCcw className="w-3 h-3" />
        Tout effacer
      </Button>
    </div>
  );
}
