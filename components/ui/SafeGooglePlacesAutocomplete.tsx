'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface SafeGooglePlacesAutocompleteProps {
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  defaultValue?: string;
}

export default function SafeGooglePlacesAutocomplete({
  onPlaceSelect,
  placeholder = 'Ville, quartier...',
  className = '',
  inputClassName = '',
  iconClassName = '',
  defaultValue = ''
}: SafeGooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  // Load the Places library using vis.gl hook
  const placesLibrary = useMapsLibrary('places');

  useEffect(() => {
    if (!placesLibrary || !inputRef.current) return;

    try {
      // Initialize Google Places Autocomplete
      const newAutocomplete = new placesLibrary.Autocomplete(inputRef.current, {
        types: ['(cities)'],
        componentRestrictions: { country: ['be', 'fr', 'nl', 'de'] }, // Belgium, France, Netherlands, Germany
        fields: ['address_components', 'formatted_address', 'geometry', 'name', 'place_id']
      });

      setAutocomplete(newAutocomplete);

      // Listen for place selection
      const listener = newAutocomplete.addListener('place_changed', () => {
        const place = newAutocomplete.getPlace();
        if (place && onPlaceSelect) {
          onPlaceSelect(place);
        }
      });

      return () => {
        if (listener) {
          google.maps.event.removeListener(listener);
        }
      };
    } catch (err) {
      console.error('[SafeGooglePlacesAutocomplete] Error initializing:', err);
    }
  }, [placesLibrary, onPlaceSelect]);

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <MapPin className={iconClassName} />
        <input
          ref={inputRef}
          type="text"
          placeholder={!placesLibrary ? 'Chargement...' : placeholder}
          defaultValue={defaultValue}
          className={inputClassName}
          disabled={!placesLibrary}
        />
      </div>
    </div>
  );
}
