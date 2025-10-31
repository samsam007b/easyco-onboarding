'use client';

import { useEffect, useState } from 'react';

interface UseScrollTrackerOptions {
  enabled?: boolean;
  threshold: number; // Number of items viewed
  onThresholdReached: () => void;
}

export function useScrollTracker({ enabled = true, threshold, onThresholdReached }: UseScrollTrackerOptions) {
  const [viewedItemsCount, setViewedItemsCount] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);

  const trackView = () => {
    if (!enabled || hasTriggered) return;

    setViewedItemsCount(prev => {
      const newCount = prev + 1;
      if (newCount >= threshold && !hasTriggered) {
        setHasTriggered(true);
        onThresholdReached();
      }
      return newCount;
    });
  };

  const reset = () => {
    setViewedItemsCount(0);
    setHasTriggered(false);
  };

  return { viewedItemsCount, hasTriggered, trackView, reset };
}
