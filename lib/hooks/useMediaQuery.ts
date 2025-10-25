import { useState, useEffect } from 'react'

/**
 * Listen to CSS media query changes
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)')
 * const isDark = useMediaQuery('(prefers-color-scheme: dark)')
 *
 * @param query - CSS media query string
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const media = window.matchMedia(query)

    // Set initial value
    setMatches(media.matches)

    // Define a callback function to handle changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add the callback function as a listener for changes to the media query
    media.addEventListener('change', listener)

    // Remove the listener when the component is unmounted
    return () => {
      media.removeEventListener('change', listener)
    }
  }, [query])

  return matches
}

/**
 * Predefined breakpoint hooks for common use cases
 */

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 640px)')
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 641px) and (max-width: 1024px)')
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1025px)')
}

export function useIsSmallScreen(): boolean {
  return useMediaQuery('(max-width: 768px)')
}

export function useIsLargeScreen(): boolean {
  return useMediaQuery('(min-width: 1280px)')
}
