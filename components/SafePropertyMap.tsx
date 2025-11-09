'use client';

import { useEffect, useState, useCallback } from 'react';
import { Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  price?: number;
  image_url?: string;
}

interface SafePropertyMapProps {
  properties: Property[];
  selectedPropertyId?: string | null;
  onPropertySelect?: (propertyId: string | null) => void;
  className?: string;
}

export default function SafePropertyMap({
  properties,
  selectedPropertyId,
  onPropertySelect,
  className = 'w-full h-[600px]'
}: SafePropertyMapProps) {
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  // Calculate center based on properties
  const center = properties.length > 0 ? {
    lat: properties.reduce((sum, p) => sum + p.latitude, 0) / properties.length,
    lng: properties.reduce((sum, p) => sum + p.longitude, 0) / properties.length
  } : { lat: 50.8503, lng: 4.3517 }; // Brussels default

  const handleMarkerClick = useCallback((propertyId: string) => {
    onPropertySelect?.(propertyId === selectedPropertyId ? null : propertyId);
  }, [selectedPropertyId, onPropertySelect]);

  return (
    <div className={className}>
      <Map
        defaultCenter={center}
        defaultZoom={12}
        gestureHandling={'greedy'}
        disableDefaultUI={false}
        mapId="easyco-properties-map"
      >
        {properties.map((property) => (
          <AdvancedMarker
            key={property.id}
            position={{ lat: property.latitude, lng: property.longitude }}
            onClick={() => handleMarkerClick(property.id)}
            onMouseEnter={() => setHoveredPropertyId(property.id)}
            onMouseLeave={() => setHoveredPropertyId(null)}
          >
            {/* Custom marker */}
            <div
              className={`
                flex items-center justify-center
                w-10 h-10 rounded-full
                transition-all duration-200
                ${selectedPropertyId === property.id
                  ? 'bg-orange-600 scale-125 shadow-lg'
                  : hoveredPropertyId === property.id
                  ? 'bg-orange-500 scale-110 shadow-md'
                  : 'bg-orange-400 shadow'
                }
              `}
            >
              <MapPin className="w-5 h-5 text-white" />
            </div>
          </AdvancedMarker>
        ))}

        {/* Info Window for selected property */}
        {selectedPropertyId && (() => {
          const selectedProperty = properties.find(p => p.id === selectedPropertyId);
          if (!selectedProperty) return null;

          return (
            <InfoWindow
              position={{
                lat: selectedProperty.latitude,
                lng: selectedProperty.longitude
              }}
              onCloseClick={() => onPropertySelect?.(null)}
            >
              <div className="p-2 max-w-xs">
                {selectedProperty.image_url && (
                  <img
                    src={selectedProperty.image_url}
                    alt={selectedProperty.title}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                <h3 className="font-semibold text-gray-900 mb-1">
                  {selectedProperty.title}
                </h3>
                {selectedProperty.address && (
                  <p className="text-sm text-gray-600 mb-1">
                    {selectedProperty.address}
                  </p>
                )}
                {selectedProperty.price && (
                  <p className="text-sm font-medium text-orange-600">
                    {selectedProperty.price}€/mois
                  </p>
                )}
              </div>
            </InfoWindow>
          );
        })()}
      </Map>
    </div>
  );
}
