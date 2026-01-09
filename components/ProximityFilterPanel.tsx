'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  MapPin,
  Train,
  GraduationCap,
  Hospital,
  ShoppingCart,
  TreePine,
  Plus,
  X,
} from 'lucide-react';
import { ProximityFilter } from '@/types/geo-filters.types';

interface ProximityFilterPanelProps {
  filters: ProximityFilter[];
  onAddFilter: (filter: ProximityFilter) => void;
  onRemoveFilter: (index: number) => void;
}

const POI_TYPES = [
  { type: 'metro', label: 'Métro', icon: Train, color: 'blue' },
  { type: 'school', label: 'École', icon: GraduationCap, color: 'green' },
  { type: 'hospital', label: 'Hôpital', icon: Hospital, color: 'red' },
  { type: 'supermarket', label: 'Supermarché', icon: ShoppingCart, color: 'orange' },
  { type: 'park', label: 'Parc', icon: TreePine, color: 'emerald' },
] as const;

export default function ProximityFilterPanel({
  filters,
  onAddFilter,
  onRemoveFilter,
}: ProximityFilterPanelProps) {
  const [selectedType, setSelectedType] = useState<typeof POI_TYPES[number]['type'] | null>(null);
  const [radius, setRadius] = useState(500);

  const handleAddFilter = (poiType: typeof POI_TYPES[number]['type']) => {
    // This would normally use geocoding or allow user to click on map
    // For now, we'll create a placeholder
    const filter: ProximityFilter = {
      location: { lat: 50.8503, lng: 4.3517 }, // Brussels center as example
      radius: radius,
      poi_type: poiType,
    };
    onAddFilter(filter);
    setSelectedType(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Filtres de proximité
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Radius Selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Rayon de recherche
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              min={100}
              max={5000}
              step={100}
              className="w-24"
            />
            <span className="text-sm text-gray-600">mètres</span>
          </div>
        </div>

        {/* POI Type Selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Ajouter un point d'intérêt
          </label>
          <div className="grid grid-cols-2 gap-2">
            {POI_TYPES.map((poi) => {
              const Icon = poi.icon;
              const isActive = filters.some((f) => f.poi_type === poi.type);

              return (
                <Button
                  key={poi.type}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAddFilter(poi.type)}
                  className="justify-start"
                  disabled={isActive}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {poi.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Active Filters */}
        {filters.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium text-gray-700 mb-2">Filtres actifs :</p>
            <div className="space-y-2">
              {filters.map((filter, index) => {
                const poiConfig = POI_TYPES.find((p) => p.type === filter.poi_type);
                const Icon = poiConfig?.icon || MapPin;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">
                        {poiConfig?.label || 'Point d\'intérêt'}
                      </span>
                      <Badge variant="default" className="text-xs">
                        {filter.radius}m
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFilter(index)}
                      className="h-auto p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-blue-900">
            Les propriétés seront filtrées pour ne montrer que celles situées dans le rayon
            défini autour des points d'intérêt sélectionnés.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
