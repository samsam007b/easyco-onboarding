'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMapsScript = () => {
      if (typeof window !== 'undefined' && !window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setIsLoaded(true);
        document.head.appendChild(script);
      } else if (window.google) {
        setIsLoaded(true);
      }
    };

    loadGoogleMapsScript();
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    // Initialize Google Places Autocomplete
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
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
      if (listener) {
        google.maps.event.removeListener(listener);
      }
    };
  }, [isLoaded, onPlaceSelect]);

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <MapPin className={iconClassName} />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={inputClassName}
        />
      </div>
    </div>
  );
}
