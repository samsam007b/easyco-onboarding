/**
 * Global Google Maps API Hook
 *
 * This hook ensures that Google Maps API is loaded only once across the entire application,
 * preventing race conditions and duplicate script loading.
 *
 * Usage:
 * ```tsx
 * const { loaded, google, error } = useGoogleMaps();
 *
 * if (!loaded) return <div>Loading maps...</div>;
 * if (error) return <div>Error loading maps: {error}</div>;
 *
 * // Use google.maps API here
 * ```
 */

'use client';

import { useEffect, useState } from 'react';

// Global state to track loading status across all hook instances
let isLoading = false;
let isLoaded = false;
let loadError: string | null = null;
const callbacks: Array<(success: boolean) => void> = [];

// Timeout for script loading (10 seconds)
const LOAD_TIMEOUT = 10000;

export interface UseGoogleMapsReturn {
  loaded: boolean;
  google: typeof google | null;
  error: string | null;
}

export function useGoogleMaps(): UseGoogleMapsReturn {
  const [loaded, setLoaded] = useState(isLoaded);
  const [error, setError] = useState<string | null>(loadError);

  useEffect(() => {
    // Already loaded successfully
    if (isLoaded) {
      setLoaded(true);
      setError(null);
      return;
    }

    // Already failed to load
    if (loadError) {
      setError(loadError);
      return;
    }

    // Currently loading - add callback
    if (isLoading) {
      callbacks.push((success) => {
        if (success) {
          setLoaded(true);
          setError(null);
        } else {
          setError(loadError);
        }
      });
      return;
    }

    // Start loading
    isLoading = true;

    // Check if Google Maps is already loaded (e.g., by another script)
    if (typeof window !== 'undefined' && window.google?.maps?.places) {
      isLoaded = true;
      isLoading = false;
      setLoaded(true);

      // Notify all waiting callbacks
      callbacks.forEach(cb => cb(true));
      callbacks.length = 0;
      return;
    }

    // Get API key from environment
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      const errorMsg = 'Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.';
      console.error(errorMsg);
      loadError = errorMsg;
      isLoading = false;
      setError(errorMsg);

      // Notify all waiting callbacks
      callbacks.forEach(cb => cb(false));
      callbacks.length = 0;
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=__googleMapsCallback`;
    script.async = true;
    script.defer = true;

    // Set up timeout
    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        const errorMsg = 'Google Maps API failed to load within timeout period';
        console.error(errorMsg);
        loadError = errorMsg;
        isLoading = false;
        setError(errorMsg);

        // Notify all waiting callbacks
        callbacks.forEach(cb => cb(false));
        callbacks.length = 0;
      }
    }, LOAD_TIMEOUT);

    // Global callback for Google Maps
    (window as any).__googleMapsCallback = () => {
      clearTimeout(timeoutId);

      // Verify that the API is fully loaded
      if (window.google?.maps?.places?.Autocomplete) {
        isLoaded = true;
        isLoading = false;
        setLoaded(true);
        setError(null);

        console.log('✅ Google Maps API loaded successfully');

        // Notify all waiting callbacks
        callbacks.forEach(cb => cb(true));
        callbacks.length = 0;
      } else {
        const errorMsg = 'Google Maps API loaded but Places library is not available';
        console.error(errorMsg);
        loadError = errorMsg;
        isLoading = false;
        setError(errorMsg);

        // Notify all waiting callbacks
        callbacks.forEach(cb => cb(false));
        callbacks.length = 0;
      }
    };

    // Handle script loading errors
    script.onerror = () => {
      clearTimeout(timeoutId);
      const errorMsg = 'Failed to load Google Maps script. Please check your API key and network connection.';
      console.error(errorMsg);
      loadError = errorMsg;
      isLoading = false;
      setError(errorMsg);

      // Notify all waiting callbacks
      callbacks.forEach(cb => cb(false));
      callbacks.length = 0;
    };

    // Append script to document
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return {
    loaded,
    google: loaded && typeof window !== 'undefined' ? window.google : null,
    error
  };
}
