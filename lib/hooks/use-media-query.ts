/**
 * useMediaQuery Hook
 *
 * React hook for responsive design that matches CSS media queries.
 * Works in both SSR and client-side rendering.
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
 * const isDesktop = useMediaQuery('(min-width: 1025px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 * ```
 */

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  // Initialize with false for SSR
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Only run on client-side
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener (modern way)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  // Return false during SSR to avoid hydration mismatch
  return mounted ? matches : false;
}

/**
 * useIsMobile Hook
 *
 * Simplified hook to detect mobile devices (< 768px).
 * Based on Tailwind's 'md' breakpoint.
 *
 * @returns true if screen width is less than 768px
 *
 * @example
 * ```tsx
 * const isMobile = useIsMobile();
 *
 * return (
 *   <div>
 *     {isMobile ? (
 *       <MobileView />
 *     ) : (
 *       <DesktopView />
 *     )}
 *   </div>
 * );
 * ```
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

/**
 * useIsTablet Hook
 *
 * Detects tablet devices (768px - 1024px).
 * Based on Tailwind's 'md' to 'lg' breakpoints.
 *
 * @returns true if screen width is between 768px and 1024px
 */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

/**
 * useIsDesktop Hook
 *
 * Detects desktop devices (>= 1024px).
 * Based on Tailwind's 'lg' breakpoint.
 *
 * @returns true if screen width is 1024px or more
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

/**
 * useBreakpoint Hook
 *
 * Returns the current Tailwind breakpoint.
 * Useful for complex responsive logic.
 *
 * @returns 'mobile' | 'tablet' | 'desktop'
 *
 * @example
 * ```tsx
 * const breakpoint = useBreakpoint();
 *
 * const columns = {
 *   mobile: 1,
 *   tablet: 2,
 *   desktop: 3,
 * }[breakpoint];
 * ```
 */
export function useBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
}

/**
 * usePrefersDarkMode Hook
 *
 * Detects if user prefers dark color scheme.
 *
 * @returns true if user prefers dark mode
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * usePrefersReducedMotion Hook
 *
 * Detects if user prefers reduced motion.
 * Important for accessibility.
 *
 * @returns true if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
