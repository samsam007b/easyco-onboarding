'use client';

import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';

interface SafeSinglePropertyMapProps {
  latitude: number;
  longitude: number;
  title?: string;
  address?: string;
  className?: string;
}

export default function SafeSinglePropertyMap({
  latitude,
  longitude,
  title,
  address,
  className = 'w-full h-[400px]'
}: SafeSinglePropertyMapProps) {
  const position = { lat: latitude, lng: longitude };

  return (
    <div className={className}>
      <Map
        defaultCenter={position}
        defaultZoom={15}
        gestureHandling={'greedy'}
        disableDefaultUI={false}
        mapId="easyco-single-property-map"
      >
        <AdvancedMarker position={position}>
          {/* Custom marker */}
          <div className="flex flex-col items-center">
            <div className="bg-orange-600 rounded-full p-3 shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            {title && (
              <div className="mt-2 bg-white rounded-lg shadow-md px-3 py-2 max-w-xs">
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                {address && (
                  <p className="text-xs text-gray-600 mt-1">{address}</p>
                )}
              </div>
            )}
          </div>
        </AdvancedMarker>
      </Map>
    </div>
  );
}
