'use client';

import { useEffect, useState } from 'react';

interface UseExitIntentOptions {
  enabled?: boolean;
  onExitIntent: () => void;
  delay?: number;
}

export function useExitIntent({ enabled = true, onExitIntent, delay = 0 }: UseExitIntentOptions) {
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (!enabled || hasTriggered) return;

    let timeoutId: NodeJS.Timeout;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top
      if (e.clientY <= 0 && !hasTriggered) {
        if (delay > 0) {
          timeoutId = setTimeout(() => {
            setHasTriggered(true);
            onExitIntent();
          }, delay);
        } else {
          setHasTriggered(true);
          onExitIntent();
        }
      }
    };

    const handleMouseEnter = () => {
      // Cancel timeout if mouse comes back
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    document.addEventListener('mouseout', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseEnter);

    return () => {
      document.removeEventListener('mouseout', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseEnter);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [enabled, hasTriggered, onExitIntent, delay]);

  const reset = () => setHasTriggered(false);

  return { hasTriggered, reset };
}
