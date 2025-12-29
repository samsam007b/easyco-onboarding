/**
 * Mobile Optimization Hooks
 *
 * Utilities for optimizing data loading and rendering on mobile devices.
 * Reduces payload size and improves performance on slower connections.
 *
 * @example
 * ```tsx
 * const config = useMobileOptimizedQuery();
 * const { data } = useQuery({
 *   ...config,
 *   queryFn: () => fetchProperties(config.limit),
 * });
 * ```
 */

import { useIsMobile, useIsTablet } from './use-media-query';

/**
 * Configuration for mobile-optimized queries
 */
export interface MobileQueryConfig {
  /**
   * Number of items to fetch
   * - Mobile: 5-10 items
   * - Tablet: 10-15 items
   * - Desktop: 20+ items
   */
  limit: number;

  /**
   * Whether to include heavy fields (large text, arrays, etc.)
   * - Mobile: false (lighter payload)
   * - Desktop: true (full data)
   */
  includeHeavyFields: boolean;

  /**
   * Whether to load images immediately or lazy load
   * - Mobile: true (lazy load)
   * - Desktop: false (immediate load)
   */
  lazyLoadImages: boolean;

  /**
   * Image quality to request
   * - Mobile: 'low' or 'medium'
   * - Desktop: 'high'
   */
  imageQuality: 'low' | 'medium' | 'high';

  /**
   * Stale time for React Query cache
   * - Mobile: longer (conserve bandwidth)
   * - Desktop: shorter (fresher data)
   */
  staleTime: number;

  /**
   * Whether to prefetch next page
   * - Mobile: false (save bandwidth)
   * - Desktop: true (better UX)
   */
  prefetchNextPage: boolean;

  /**
   * Debounce time for search/filter inputs (ms)
   * - Mobile: longer (reduce requests)
   * - Desktop: shorter (more responsive)
   */
  debounceTime: number;
}

/**
 * Get mobile-optimized query configuration
 *
 * Returns appropriate settings based on device type.
 *
 * @param overrides - Optional overrides for specific settings
 * @returns Configuration object for mobile-optimized queries
 *
 * @example
 * ```tsx
 * const queryConfig = useMobileOptimizedQuery();
 *
 * const { data } = useQuery({
 *   queryKey: ['properties'],
 *   queryFn: () => fetchProperties({
 *     limit: queryConfig.limit,
 *     includeHeavyFields: queryConfig.includeHeavyFields,
 *   }),
 *   staleTime: queryConfig.staleTime,
 * });
 * ```
 */
export function useMobileOptimizedQuery(
  overrides?: Partial<MobileQueryConfig>
): MobileQueryConfig {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const defaultConfig: MobileQueryConfig = isMobile
    ? {
        // Mobile configuration (aggressive optimization)
        limit: 6,
        includeHeavyFields: false,
        lazyLoadImages: true,
        imageQuality: 'medium',
        staleTime: 5 * 60 * 1000, // 5 minutes
        prefetchNextPage: false,
        debounceTime: 500,
      }
    : isTablet
    ? {
        // Tablet configuration (balanced)
        limit: 12,
        includeHeavyFields: true,
        lazyLoadImages: true,
        imageQuality: 'medium',
        staleTime: 3 * 60 * 1000, // 3 minutes
        prefetchNextPage: false,
        debounceTime: 300,
      }
    : {
        // Desktop configuration (full experience)
        limit: 20,
        includeHeavyFields: true,
        lazyLoadImages: false,
        imageQuality: 'high',
        staleTime: 1 * 60 * 1000, // 1 minute
        prefetchNextPage: true,
        debounceTime: 200,
      };

  return {
    ...defaultConfig,
    ...overrides,
  };
}

/**
 * Get grid columns based on device
 *
 * Returns appropriate number of columns for responsive grids.
 *
 * @returns Number of columns
 *
 * @example
 * ```tsx
 * const columns = useResponsiveColumns();
 * // Mobile: 1, Tablet: 2, Desktop: 3
 * ```
 */
export function useResponsiveColumns(): number {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  if (isMobile) return 1;
  if (isTablet) return 2;
  return 3;
}

/**
 * Get pagination size based on device
 *
 * @returns Page size
 *
 * @example
 * ```tsx
 * const pageSize = useResponsivePageSize();
 * // Mobile: 10, Tablet: 15, Desktop: 20
 * ```
 */
export function useResponsivePageSize(): number {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  if (isMobile) return 10;
  if (isTablet) return 15;
  return 20;
}

/**
 * Check if device should use simplified UI
 *
 * Returns true for mobile devices where complex UI should be simplified.
 *
 * @example
 * ```tsx
 * const shouldSimplify = useShouldSimplifyUI();
 *
 * return shouldSimplify ? (
 *   <SimplifiedDashboard />
 * ) : (
 *   <FullDashboard />
 * );
 * ```
 */
export function useShouldSimplifyUI(): boolean {
  return useIsMobile();
}

/**
 * Get appropriate image sizes for responsive images
 *
 * Returns sizes string for <img> srcSet attribute.
 *
 * @example
 * ```tsx
 * const imageSizes = useResponsiveImageSizes();
 * // "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
 * ```
 */
export function useResponsiveImageSizes(): string {
  return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
}

/**
 * Determine if animations should be disabled for performance
 *
 * Disables complex animations on mobile for better performance.
 *
 * @example
 * ```tsx
 * const shouldAnimate = useShouldAnimate();
 *
 * <motion.div
 *   animate={shouldAnimate ? { scale: 1.1 } : {}}
 * />
 * ```
 */
export function useShouldAnimate(): boolean {
  const isMobile = useIsMobile();
  return !isMobile; // Disable animations on mobile
}

/**
 * Get debounced value optimized for device
 *
 * @param value - Value to debounce
 * @param defaultDelay - Optional override for delay
 * @returns Debounced value
 */
export function useMobileOptimizedDebounce<T>(
  value: T,
  defaultDelay?: number
): T {
  const { debounceTime } = useMobileOptimizedQuery();
  const delay = defaultDelay ?? debounceTime;

  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Import React for hooks
import React from 'react';

/**
 * Connection quality detection
 *
 * Detects user's connection speed and adjusts behavior accordingly.
 * Uses Network Information API when available.
 */
export function useConnectionQuality(): 'slow' | 'medium' | 'fast' {
  const [quality, setQuality] = React.useState<'slow' | 'medium' | 'fast'>('medium');

  React.useEffect(() => {
    if (typeof window === 'undefined' || !('connection' in navigator)) {
      return;
    }

    const connection = (navigator as any).connection;

    const updateQuality = () => {
      // effectiveType: 'slow-2g', '2g', '3g', '4g'
      const effectiveType = connection?.effectiveType;

      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        setQuality('slow');
      } else if (effectiveType === '3g') {
        setQuality('medium');
      } else {
        setQuality('fast');
      }
    };

    updateQuality();

    connection?.addEventListener?.('change', updateQuality);

    return () => {
      connection?.removeEventListener?.('change', updateQuality);
    };
  }, []);

  return quality;
}

/**
 * Adaptive loading strategy
 *
 * Combines device type and connection quality to determine
 * the best loading strategy.
 *
 * @example
 * ```tsx
 * const loadingStrategy = useAdaptiveLoadingStrategy();
 *
 * const itemsToShow = {
 *   minimal: 3,
 *   reduced: 6,
 *   normal: 12,
 *   full: 20,
 * }[loadingStrategy];
 * ```
 */
export function useAdaptiveLoadingStrategy(): 'minimal' | 'reduced' | 'normal' | 'full' {
  const isMobile = useIsMobile();
  const connectionQuality = useConnectionQuality();

  if (connectionQuality === 'slow') {
    return 'minimal'; // Very conservative on slow connections
  }

  if (isMobile) {
    return connectionQuality === 'medium' ? 'reduced' : 'normal';
  }

  return 'full'; // Desktop with good connection
}

/**
 * Save data mode
 *
 * Checks if user has enabled data saver mode.
 * Uses Save-Data header or localStorage preference.
 *
 * @example
 * ```tsx
 * const saveDataMode = useSaveDataMode();
 *
 * if (saveDataMode) {
 *   // Skip loading non-essential images, videos, etc.
 * }
 * ```
 */
export function useSaveDataMode(): boolean {
  const [saveData, setSaveData] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check Save-Data header
    const connection = (navigator as any).connection;
    const saveDataHeader = connection?.saveData;

    // Check localStorage preference
    const userPreference = localStorage.getItem('izzico_save_data') === 'true';

    setSaveData(saveDataHeader || userPreference);
  }, []);

  return saveData;
}
