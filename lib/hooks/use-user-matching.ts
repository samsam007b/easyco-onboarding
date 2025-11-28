'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import {
  calculateUserCompatibility,
  calculatePersonalProfileCompletion,
  UserProfile,
  type CompatibilityResult,
  type PersonalProfileCompletion,
} from '@/lib/services/user-matching-service';

export interface UserWithCompatibility extends UserProfile {
  compatibility_score?: number;
  compatibility_result?: CompatibilityResult;
}

export interface MatchingGateStatus {
  isUnlocked: boolean;
  profileCompletion: PersonalProfileCompletion;
  requiredFields: string[];
}

export type SwipeContext = 'searcher_matching' | 'resident_matching';

// Helper to map database fields to UserProfile interface
// Helper to convert cleanliness text values to numbers
function parseCleanlinessLevel(value: unknown): number | undefined {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Handle text values from DB
    const textToNumber: Record<string, number> = {
      'relaxed': 3,
      'moderate': 5,
      'tidy': 7,
      'spotless': 9,
      // Also handle emoji-based values that might be in the DB
      'very_relaxed': 2,
      'very_tidy': 8,
    };
    const parsed = textToNumber[value.toLowerCase()];
    if (parsed !== undefined) return parsed;
    // Try parsing as number string
    const num = parseInt(value, 10);
    if (!isNaN(num)) return num;
  }
  return undefined;
}

// Helper to convert time preference text to standardized format
function parseTimePreference(value: unknown): 'early' | 'moderate' | 'late' | undefined {
  if (!value) return undefined;
  const str = String(value).toLowerCase();
  if (str.includes('early') || str.includes('tôt') || str.includes('morning')) return 'early';
  if (str.includes('late') || str.includes('tard') || str.includes('night')) return 'late';
  if (str.includes('moderate') || str.includes('normal') || str.includes('regular')) return 'moderate';
  return str as 'early' | 'moderate' | 'late';
}

function mapDbProfileToUserProfile(dbProfile: Record<string, unknown>): UserProfile {
  return {
    user_id: dbProfile.user_id as string,
    first_name: dbProfile.first_name as string || '',
    last_name: dbProfile.last_name as string || '',
    profile_photo_url: dbProfile.profile_photo_url as string | undefined,
    date_of_birth: dbProfile.date_of_birth as string | undefined,
    gender: dbProfile.gender_identity as string | undefined,
    nationality: dbProfile.nationality as string | undefined,
    languages: dbProfile.languages_spoken as string[] | undefined,
    occupation_status: dbProfile.occupation_status as string | undefined,
    bio: dbProfile.bio as string | undefined,

    // Enriched profile data
    languages_spoken: dbProfile.languages_spoken as string[] | undefined,
    interests: dbProfile.interests as string[] | undefined,
    hobbies: dbProfile.hobbies as string[] | undefined,
    important_qualities: dbProfile.important_qualities as string[] | undefined,
    deal_breakers: dbProfile.deal_breakers as string[] | undefined,

    // Lifestyle preferences
    cleanliness_level: parseCleanlinessLevel(dbProfile.cleanliness_preference),
    social_energy: dbProfile.introvert_extrovert_scale
      ? (dbProfile.introvert_extrovert_scale as number) * 2 // Convert 1-5 to approx 1-10
      : undefined,
    openness_to_sharing: dbProfile.openness_to_sharing as string | undefined,
    cultural_openness: dbProfile.cultural_openness as string | undefined,
    house_rules_preference: dbProfile.house_rules_preference as number | undefined,
    shared_space_importance: dbProfile.shared_space_importance as number | undefined,

    // Daily routine
    wake_up_time: parseTimePreference(dbProfile.wake_up_time),
    sleep_time: parseTimePreference(dbProfile.sleep_time),
    works_from_home: dbProfile.works_from_home as boolean | undefined,
    work_schedule: dbProfile.work_schedule as 'office' | 'hybrid' | 'remote' | 'flexible' | 'student' | undefined,
    exercise_frequency: dbProfile.exercise_frequency as 'never' | 'rarely' | 'sometimes' | 'often' | 'daily' | undefined,
    sports_frequency: dbProfile.sports_frequency as 'never' | 'rarely' | 'sometimes' | 'often' | 'daily' | undefined,

    // Social preferences
    guest_frequency: dbProfile.guest_frequency as 'never' | 'rarely' | 'sometimes' | 'often' | undefined,
    shared_meals_interest: dbProfile.shared_meals_interest as boolean | undefined,
    flatmate_meetups_interest: dbProfile.flatmate_meetups_interest as boolean | undefined,
    open_to_meetups: dbProfile.open_to_meetups as boolean | undefined,
    event_participation_interest: dbProfile.event_participation_interest as 'low' | 'medium' | 'high' | undefined,
    event_interest: dbProfile.event_interest as 'low' | 'medium' | 'high' | undefined,
    introvert_extrovert_scale: dbProfile.introvert_extrovert_scale as number | undefined,

    // Lifestyle habits
    smoking: dbProfile.smoker as boolean | undefined,
    drinks_alcohol: dbProfile.drinks_alcohol as boolean | undefined,
    pets: dbProfile.has_pets as boolean | undefined,
    pet_type: dbProfile.pet_type as string | undefined,
    cooking_frequency: dbProfile.cooking_frequency as 'never' | 'rarely' | 'sometimes' | 'often' | 'daily' | undefined,
    music_at_home: dbProfile.music_at_home as boolean | undefined,
    music_habits: dbProfile.music_habits as 'none' | 'headphones_only' | 'headphones_mostly' | 'quiet_background' | 'social_listening' | undefined,
    diet_type: dbProfile.diet_type as 'omnivore' | 'vegetarian' | 'vegan' | 'flexitarian' | 'pescatarian' | undefined,

    // Values
    core_values: dbProfile.core_values as string[] | undefined,

    // Preferences for matching
    preferred_coliving_size: dbProfile.preferred_coliving_size as 'small' | 'medium' | 'large' | 'very_large' | undefined,
    preferred_gender_mix: dbProfile.preferred_gender_mix as 'no_preference' | 'same_gender' | 'mixed' | undefined,
    gender_preference: dbProfile.gender_preference as 'no_preference' | 'same_gender' | 'mixed' | undefined,
    age_range_min: dbProfile.roommate_age_min as number | undefined,
    age_range_max: dbProfile.roommate_age_max as number | undefined,
    preferred_neighborhoods: dbProfile.preferred_neighborhoods as string[] | undefined,
    min_budget: dbProfile.budget_min as number || dbProfile.min_budget as number | undefined,
    max_budget: dbProfile.budget_max as number || dbProfile.max_budget as number | undefined,
    quiet_hours_preference: dbProfile.quiet_hours_preference as boolean | undefined,
    communication_style: dbProfile.communication_style as 'direct' | 'diplomatic' | 'casual' | 'formal' | undefined,
    coworking_space_needed: dbProfile.coworking_space_needed as boolean | undefined,
    gym_access_needed: dbProfile.gym_access_needed as boolean | undefined,

    // Tolerance preferences
    pets_tolerance: dbProfile.pet_tolerance as boolean | undefined,
    smoking_tolerance: dbProfile.smoking_tolerance as boolean | undefined,
  };
}

export function useUserMatching(currentUserId: string, context: SwipeContext) {
  const supabase = createClient();
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<UserWithCompatibility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [matchingGateStatus, setMatchingGateStatus] = useState<MatchingGateStatus | null>(null);
  const [extendedUserData, setExtendedUserData] = useState<{
    phone_number?: string;
    email?: string;
    kyc_verified?: boolean;
    iban?: string;
    profile_photo_url?: string;
  } | null>(null);

  // Load current user's profile from user_profiles (has all matching data)
  // Also loads extended data for profile completion gate check
  const loadCurrentUserProfile = useCallback(async () => {
    if (!currentUserId) {
      console.log('No user ID provided');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Loading profile for user:', currentUserId);

      // Load main profile
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', currentUserId)
        .single();

      if (error) {
        console.error('Profile load error:', error);
        throw error;
      }

      // Load user email from auth
      const { data: { user: authUser } } = await supabase.auth.getUser();

      // Load verification data if exists
      const { data: verification } = await supabase
        .from('user_verifications')
        .select('kyc_status, phone_verified')
        .eq('user_id', currentUserId)
        .single();

      // Store extended data for gate check
      const extended = {
        phone_number: profile.phone_number as string | undefined,
        email: authUser?.email,
        kyc_verified: verification?.kyc_status === 'verified',
        iban: profile.iban as string | undefined,
        profile_photo_url: profile.profile_photo_url as string | undefined,
      };
      setExtendedUserData(extended);

      console.log('Profile loaded successfully:', profile);
      const mappedProfile = mapDbProfileToUserProfile(profile as Record<string, unknown>);
      setCurrentUserProfile(mappedProfile);

      // Calculate personal profile completion for gate check
      const profileCompletion = calculatePersonalProfileCompletion(mappedProfile, extended);

      setMatchingGateStatus({
        isUnlocked: profileCompletion.isUnlocked,
        profileCompletion,
        requiredFields: profileCompletion.requiredForUnlock,
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('[Matching Gate]', {
          isUnlocked: profileCompletion.isUnlocked,
          percentage: `${profileCompletion.percentage}%`,
          filledFields: `${profileCompletion.filledFields}/${profileCompletion.totalFields}`,
          missingCategories: profileCompletion.missingCategories.filter(c => !c.isComplete).map(c => c.label),
          requiredForUnlock: profileCompletion.requiredForUnlock,
        });
      }
    } catch (error) {
      console.error('Failed to load current user profile:', error);
      setCurrentUserProfile(null);
      setIsLoading(false);
    }
  }, [currentUserId, supabase]);

  // Load potential matches from user_profiles (has all matching data)
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

        // Build query based on context - use user_profiles for all matching data
        let query = supabase
          .from('user_profiles')
          .select('*')
          .neq('user_id', currentUserId)
          .limit(limit);

        // Exclude already swiped users
        if (swipedUserIds.length > 0) {
          query = query.not('user_id', 'in', `(${swipedUserIds.join(',')})`);
        }

        // Context-specific filters - filter by user_type for relevant matches
        if (context === 'searcher_matching') {
          // For searchers finding co-searchers: filter by user_type = 'searcher'
          query = query.eq('user_type', 'searcher');
        } else if (context === 'resident_matching') {
          // For residents finding new roommates: filter by user_type = 'searcher'
          query = query.eq('user_type', 'searcher');
        }

        const { data: users, error } = await query;

        if (error) throw error;

        // Map database profiles to UserProfile interface and calculate compatibility scores
        const usersWithScores: UserWithCompatibility[] = (users || []).map((user) => {
          const mappedUser = mapDbProfileToUserProfile(user as Record<string, unknown>);
          const compatibilityResult = calculateUserCompatibility(
            currentUserProfile,
            mappedUser
          );

          // Debug logging for compatibility calculation
          if (process.env.NODE_ENV === 'development') {
            const { profileCompleteness, isScoreReliable } = compatibilityResult;
            console.log(`[Matching] ${mappedUser.first_name}: Score ${compatibilityResult.score}% | Reliable: ${isScoreReliable}`, {
              '⚠️ SCORE_RELIABLE': isScoreReliable,
              '👤 TON PROFIL': {
                completeness: `${profileCompleteness.user1.percentage}% (${profileCompleteness.user1.filledFields}/${profileCompleteness.user1.totalFields} champs)`,
                isComplete: profileCompleteness.user1.isComplete,
                missingCategories: profileCompleteness.user1.missingCategories,
                data: {
                  cleanliness: currentUserProfile.cleanliness_level,
                  socialEnergy: currentUserProfile.social_energy,
                  wakeUp: currentUserProfile.wake_up_time,
                  sleep: currentUserProfile.sleep_time,
                  budget: `${currentUserProfile.min_budget || '?'}-${currentUserProfile.max_budget || '?'}€`,
                  smoking: currentUserProfile.smoking,
                  pets: currentUserProfile.pets,
                },
              },
              '🎯 LEUR PROFIL': {
                name: mappedUser.first_name,
                completeness: `${profileCompleteness.user2.percentage}% (${profileCompleteness.user2.filledFields}/${profileCompleteness.user2.totalFields} champs)`,
                isComplete: profileCompleteness.user2.isComplete,
                missingCategories: profileCompleteness.user2.missingCategories,
                data: {
                  cleanliness: mappedUser.cleanliness_level,
                  socialEnergy: mappedUser.social_energy,
                  wakeUp: mappedUser.wake_up_time,
                  sleep: mappedUser.sleep_time,
                },
              },
              breakdown: compatibilityResult.breakdown,
            });
          }

          return {
            ...mappedUser,
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

      // Fetch full profiles for matched users from user_profiles
      if (matches && matches.length > 0) {
        const matchedUserIds = matches.map((m: Record<string, unknown>) => m.matched_user_id);

        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('*')
          .in('user_id', matchedUserIds);

        // Map database profiles to UserProfile interface
        return (profiles || []).map((p) => mapDbProfileToUserProfile(p as Record<string, unknown>));
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
    // New: Gate status for profile completion requirement
    matchingGateStatus,
    isMatchingUnlocked: matchingGateStatus?.isUnlocked ?? false,
  };
}
