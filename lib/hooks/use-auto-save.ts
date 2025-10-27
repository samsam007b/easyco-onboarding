// lib/hooks/use-auto-save.ts
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';

// Rate limiting: max saves per minute
const RATE_LIMIT_MAX_SAVES = 10;
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const saveTimestamps: number[] = [];

interface AutoSaveOptions {
  key: string; // The localStorage key for this data
  debounceMs?: number; // Debounce time in milliseconds (default: 2000)
  enabled?: boolean; // Enable/disable auto-save (default: true)
}

/**
 * Hook to automatically save onboarding data to both localStorage and Supabase
 *
 * Usage:
 * ```ts
 * const saveData = useAutoSave({ key: 'basicInfo' });
 *
 * // In your handleContinue or onChange:
 * saveData({ firstName, lastName, dateOfBirth });
 * ```
 */
export function useAutoSave(options: AutoSaveOptions) {
  const { key, debounceMs = 2000, enabled = true } = options;
  const supabase = createClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  const saveToSupabase = useCallback(async (data: any) => {
    if (!enabled || isSavingRef.current) return;

    try {
      // Check rate limit
      const now = Date.now();
      const recentSaves = saveTimestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);

      if (recentSaves.length >= RATE_LIMIT_MAX_SAVES) {
        console.warn('Auto-save rate limit exceeded');
        return;
      }

      saveTimestamps.push(now);
      // Keep only recent timestamps
      while (saveTimestamps.length > 0 && now - saveTimestamps[0] > RATE_LIMIT_WINDOW_MS) {
        saveTimestamps.shift();
      }

      isSavingRef.current = true;

      // 1. Validate data size to prevent DoS
      const jsonString = JSON.stringify(data);
      const sizeInBytes = new Blob([jsonString]).size;
      const maxSizeBytes = 100 * 1024; // 100KB max per save

      if (sizeInBytes > maxSizeBytes) {
        console.error('Data too large for auto-save:', {
          size: sizeInBytes,
          maxSize: maxSizeBytes,
          key
        });
        toast.error('Data is too large to save');
        return;
      }

      // 2. Sanitize data to prevent XSS
      const sanitizedData = typeof data === 'object' && data !== null
        ? JSON.parse(jsonString) // Re-parse to ensure no functions/undefined values
        : data;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user logged in, skipping Supabase save');
        return;
      }

      // Get existing profile data
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('profile_data, user_type')
        .eq('user_id', user.id)
        .single();

      // Merge new data with existing data (use sanitized data)
      const updatedProfileData = {
        ...(existingProfile?.profile_data || {}),
        [key]: {
          ...sanitizedData,
          savedAt: new Date().toISOString(),
        },
      };

      // Save to Supabase
      if (existingProfile) {
        // Update existing profile
        await supabase
          .from('user_profiles')
          .update({
            profile_data: updatedProfileData,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
      } else {
        // Create new profile (fallback, should normally exist)
        await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            user_type: 'searcher', // Default, will be updated later
            profile_data: updatedProfileData,
          });
      }

      console.log(`✅ Auto-saved ${key} to Supabase`);
    } catch (error) {
      console.error('Error auto-saving to Supabase:', error);
      // Don't show error toast to user, silent failure is fine for auto-save
    } finally {
      isSavingRef.current = false;
    }
  }, [enabled, key, supabase]);

  const saveData = useCallback((data: any) => {
    if (!enabled) return;

    // Always save to localStorage immediately
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }

    // Debounce Supabase save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveToSupabase(data);
    }, debounceMs);
  }, [enabled, key, debounceMs, saveToSupabase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return saveData;
}

/**
 * Load saved onboarding data from Supabase or localStorage
 */
export async function loadSavedData(key: string): Promise<any | null> {
  const supabase = createClient();

  try {
    // Try to get from Supabase first
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('profile_data')
        .eq('user_id', user.id)
        .single();

      if (profile?.profile_data?.[key]) {
        console.log(`✅ Loaded ${key} from Supabase`);
        return profile.profile_data[key];
      }
    }
  } catch (error) {
    console.error('Error loading from Supabase:', error);
  }

  // Fallback to localStorage
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(key);
      if (raw) {
        console.log(`✅ Loaded ${key} from localStorage`);
        return JSON.parse(raw);
      }
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }

  return null;
}

/**
 * Get onboarding progress (which step the user is on)
 */
export async function getOnboardingProgress(): Promise<{
  currentStep: string | null;
  profileData: any;
  isIncomplete: boolean;
} | null> {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userData } = await supabase
      .from('users')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();

    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('profile_data')
      .eq('user_id', user.id)
      .single();

    const onboardingCompleted = userData?.onboarding_completed || false;
    const profile = profileData?.profile_data || {};

    // If onboarding is completed, no need to resume
    if (onboardingCompleted) {
      return null;
    }

    // Check if there's any saved data
    const hasSavedData = Object.keys(profile).length > 0;

    if (!hasSavedData) {
      return null;
    }

    // Determine the last completed step
    const steps = ['searcherProfileType', 'basicInfo', 'dailyHabits', 'lifestyle'];
    let lastCompletedStep = null;

    for (const step of steps) {
      if (profile[step]) {
        lastCompletedStep = step;
      } else {
        break; // Stop at first missing step
      }
    }

    // Map step to next URL
    const stepToUrl: Record<string, string> = {
      searcherProfileType: '/onboarding/searcher/basic-info',
      basicInfo: '/onboarding/searcher/daily-habits',
      dailyHabits: '/onboarding/searcher/lifestyle',
      lifestyle: '/onboarding/searcher/review',
    };

    const nextUrl = lastCompletedStep ? stepToUrl[lastCompletedStep] : '/onboarding/searcher/profile-type';

    return {
      currentStep: nextUrl,
      profileData: profile,
      isIncomplete: true,
    };
  } catch (error) {
    console.error('Error getting onboarding progress:', error);
    return null;
  }
}
