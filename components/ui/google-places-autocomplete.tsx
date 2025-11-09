'use client';

import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useGoogleMaps } from '@/lib/hooks/use-google-maps';

interface GooglePlacesAutocompleteProps {
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  defaultValue?: string;
}

export default function GooglePlacesAutocomplete({
  onPlaceSelect,
  placeholder = 'Ville, quartier...',
  className = '',
  inputClassName = '',
  iconClassName = '',
  defaultValue = ''
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { loaded, google: googleMaps, error } = useGoogleMaps();

  useEffect(() => {
    // Wait for Google Maps to load
    if (!loaded || !inputRef.current || !googleMaps) return;

    // Verify that Places API is available
    if (!googleMaps.maps?.places?.Autocomplete) {
      console.error('Google Maps Places API not available');
      return;
    }

    try {
      // Initialize Google Places Autocomplete
      autocompleteRef.current = new googleMaps.maps.places.Autocomplete(inputRef.current, {
        types: ['(cities)'],
        componentRestrictions: { country: ['be', 'fr', 'nl', 'de'] }, // Belgium, France, Netherlands, Germany
        fields: ['address_components', 'formatted_address', 'geometry', 'name', 'place_id']
      });

      // Listen for place selection
      const listener = autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && onPlaceSelect) {
          onPlaceSelect(place);
        }
      });

      return () => {
        if (listener && googleMaps.maps?.event) {
          googleMaps.maps.event.removeListener(listener);
        }
      };
    } catch (err) {
      console.error('Error initializing Google Places Autocomplete:', err);
    }
  }, [loaded, googleMaps, onPlaceSelect]);

  // Determine placeholder text based on loading state
  const getPlaceholder = () => {
    if (error) return 'Erreur de chargement';
    if (!loaded) return 'Chargement...';
    return placeholder;
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <MapPin className={iconClassName} />
        <input
          ref={inputRef}
          type="text"
          placeholder={getPlaceholder()}
          defaultValue={defaultValue}
          className={inputClassName}
          disabled={!loaded || !!error}
          title={error || undefined}
        />
      </div>
    </div>
  );
}
