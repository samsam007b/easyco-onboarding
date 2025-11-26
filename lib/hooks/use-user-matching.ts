'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import {
  calculateUserCompatibility,
  UserProfile,
  type CompatibilityResult,
} from '@/lib/services/user-matching-service';

export interface UserWithCompatibility extends UserProfile {
  compatibility_score?: number;
  compatibility_result?: CompatibilityResult;
}

export type SwipeContext = 'searcher_matching' | 'resident_matching';

export function useUserMatching(currentUserId: string, context: SwipeContext) {
  const supabase = createClient();
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<UserWithCompatibility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // Load current user's profile
  const loadCurrentUserProfile = useCallback(async () => {
    if (!currentUserId) {
      console.log('No user ID provided');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Loading profile for user:', currentUserId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUserId)
        .single();

      if (error) {
        console.error('Profile load error:', error);
        throw error;
      }

      console.log('Profile loaded successfully:', profile);
      setCurrentUserProfile(profile as any);
    } catch (error) {
      console.error('Failed to load current user profile:', error);
      setCurrentUserProfile(null);
      setIsLoading(false);
    }
  }, [currentUserId, supabase]);

  // Load potential matches
  const loadPotentialMatches = useCallback(
    async (limit: number = 20) => {
      if (!currentUserProfile) return;

      setIsLoading(true);

      try {
        // Get users who have already been swiped by current user
        const { data: swipedUsers } = await supabase
          .from('user_swipes')
          .select('swiped_id')
          .eq('swiper_id', currentUserId)
          .eq('context', context);

        const swipedUserIds = swipedUsers?.map((s) => s.swiped_id) || [];

        // Build query based on context
        let query = supabase
          .from('profiles')
          .select('*')
          .neq('user_id', currentUserId)
          .limit(limit);

        // Exclude already swiped users
        if (swipedUserIds.length > 0) {
          query = query.not('user_id', 'in', `(${swipedUserIds.join(',')})`);
        }

        // Context-specific filters
        // NOTE: Temporarily disabled user_type filter as profiles table doesn't have this column
        // TODO: Join with users table or add user_type to profiles
        /*
        if (context === 'searcher_matching') {
          // For searchers finding co-searchers: filter by user_type = 'searcher'
          query = query.eq('user_type', 'searcher');
        } else if (context === 'resident_matching') {
          // For residents finding new roommates: filter by user_type = 'searcher'
          query = query.eq('user_type', 'searcher');
        }
        */

        const { data: users, error } = await query;

        if (error) throw error;

        // Calculate compatibility scores
        const usersWithScores: UserWithCompatibility[] = (users || []).map((user) => {
          const compatibilityResult = calculateUserCompatibility(
            currentUserProfile,
            user as UserProfile
          );

          return {
            ...(user as UserProfile),
            compatibility_score: compatibilityResult.score,
            compatibility_result: compatibilityResult,
          };
        });

        // Sort by compatibility score (highest first)
        usersWithScores.sort((a, b) => (b.compatibility_score || 0) - (a.compatibility_score || 0));

        setPotentialMatches(usersWithScores);
        setHasMore(usersWithScores.length >= limit);
      } catch (error) {
        console.error('Failed to load potential matches:', error);
        setPotentialMatches([]);
      } finally {
        setIsLoading(false);
      }
    },
    [currentUserId, currentUserProfile, context, supabase]
  );

  // Record a swipe
  const recordSwipe = useCallback(
    async (swipedUserId: string, action: 'like' | 'pass') => {
      try {
        const { error } = await supabase.from('user_swipes').insert({
          swiper_id: currentUserId,
          swiped_id: swipedUserId,
          action,
          context,
        });

        if (error) throw error;

        // Remove the swiped user from the list
        setPotentialMatches((prev) => prev.filter((u) => u.user_id !== swipedUserId));

        return true;
      } catch (error) {
        console.error('Failed to record swipe:', error);
        return false;
      }
    },
    [currentUserId, context, supabase]
  );

  // Get matches for current user
  const getMatches = useCallback(async () => {
    try {
      const { data: matches, error } = await supabase.rpc('get_user_matches', {
        p_user_id: currentUserId,
        p_context: context,
      });

      if (error) throw error;

      // Fetch full profiles for matched users
      if (matches && matches.length > 0) {
        const matchedUserIds = matches.map((m: any) => m.matched_user_id);

        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .in('id', matchedUserIds);

        return profiles as UserProfile[];
      }

      return [];
    } catch (error) {
      console.error('Failed to get matches:', error);
      return [];
    }
  }, [currentUserId, context, supabase]);

  // Check if two users have matched
  const checkIfMatched = useCallback(
    async (otherUserId: string): Promise<boolean> => {
      try {
        const { data, error } = await supabase.rpc('have_users_matched', {
          p_user1_id: currentUserId,
          p_user2_id: otherUserId,
          p_context: context,
        });

        if (error) throw error;

        return data === true;
      } catch (error) {
        console.error('Failed to check match status:', error);
        return false;
      }
    },
    [currentUserId, context, supabase]
  );

  // Initial load
  useEffect(() => {
    loadCurrentUserProfile();
  }, [loadCurrentUserProfile]);

  useEffect(() => {
    if (currentUserProfile) {
      loadPotentialMatches();
    }
  }, [currentUserProfile, loadPotentialMatches]);

  return {
    currentUserProfile,
    potentialMatches,
    isLoading,
    hasMore,
    recordSwipe,
    getMatches,
    checkIfMatched,
    loadPotentialMatches,
  };
}
