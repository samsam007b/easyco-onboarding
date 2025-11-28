/**
 * Enhanced Matching Service
 *
 * Provides advanced matching algorithms for searchers and properties
 * with weighted scoring across multiple dimensions.
 */

import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';

export interface MatchScore {
  total_score: number;
  budget_score: number;
  location_score: number;
  lifestyle_score: number;
  availability_score: number;
  preferences_score: number;
  match_reason: string;
}

export interface Match {
  id: string;
  searcher_id: string;
  property_id: string | null;
  owner_id: string;
  total_score: number;
  budget_score: number | null;
  location_score: number | null;
  lifestyle_score: number | null;
  availability_score: number | null;
  preferences_score: number | null;
  status: 'active' | 'viewed' | 'contacted' | 'hidden' | 'expired';
  viewed_at: string | null;
  contacted_at: string | null;
  hidden_at: string | null;
  match_reason: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface EnhancedMatch extends Match {
  owner_profile?: any;
  property?: any;
}

/**
 * Scoring Weights Configuration
 * Total must equal 100
 */
export const MATCH_WEIGHTS = {
  BUDGET: 30,      // 30% - Most important (affordability)
  LOCATION: 25,    // 25% - Second most important (convenience)
  LIFESTYLE: 20,   // 20% - Third (compatibility)
  AVAILABILITY: 15, // 15% - Fourth (timing)
  PREFERENCES: 10,  // 10% - Fifth (nice-to-have)
} as const;

/**
 * Calculate enhanced match score with detailed breakdown
 */
export async function calculateEnhancedMatchScore(
  searcherId: string,
  ownerId: string,
  propertyId?: string
): Promise<MatchScore | null> {
  const supabase = createClient();

  try {
    // Call the database function
    const { data, error } = await supabase.rpc('calculate_match_score', {
      p_searcher_id: searcherId,
      p_owner_id: ownerId,
      p_property_id: propertyId || null,
    });

    if (error) {
      logger.error('Error calculating match score', error);
      return null;
    }

    return data?.[0] || null;
  } catch (error) {
    logger.error('Failed to calculate match score', error);
    return null;
  }
}

/**
 * Find potential matches for a searcher
 * Returns top N matches sorted by score
 */
export async function findMatchesForSearcher(
  searcherId: string,
  options: {
    limit?: number;
    minScore?: number;
    status?: Match['status'][];
  } = {}
): Promise<EnhancedMatch[]> {
  const {
    limit = 20,
    minScore = 60, // Minimum 60% compatibility
    status = ['active', 'viewed'],
  } = options;

  const supabase = createClient();

  try {
    let query = supabase
      .from('matches')
      .select(`
        *,
        owner_profile:user_profiles!matches_owner_id_fkey(*),
        property:properties(*)
      `)
      .eq('searcher_id', searcherId)
      .gte('total_score', minScore)
      .in('status', status)
      .order('total_score', { ascending: false })
      .limit(limit);

    const { data, error } = await query;

    if (error) {
      logger.error('Error fetching matches', error);
      return [];
    }

    return (data || []) as EnhancedMatch[];
  } catch (error) {
    logger.error('Failed to find matches', error);
    return [];
  }
}

/**
 * Generate new matches for a searcher
 * This should be called periodically or when profile is updated
 */
export async function generateMatchesForSearcher(
  searcherId: string
): Promise<{ success: boolean; matchesGenerated: number; error?: string }> {
  const supabase = createClient();

  try {
    // Get searcher profile
    const { data: searcherProfile, error: searcherError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', searcherId)
      .single();

    if (searcherError || !searcherProfile) {
      return { success: false, matchesGenerated: 0, error: 'Searcher profile not found' };
    }

    // Get all potential owners/properties
    // Filter by city if specified
    let ownersQuery = supabase
      .from('user_profiles')
      .select('user_id')
      .eq('user_type', 'owner')
      .neq('user_id', searcherId); // Don't match with self

    if (searcherProfile.current_city) {
      ownersQuery = ownersQuery.or(`current_city.ilike.%${searcherProfile.current_city}%,city.ilike.%${searcherProfile.current_city}%`);
    }

    const { data: potentialOwners, error: ownersError } = await ownersQuery;

    if (ownersError || !potentialOwners || potentialOwners.length === 0) {
      return { success: true, matchesGenerated: 0, error: 'No potential owners found' };
    }

    let matchesGenerated = 0;

    // Calculate scores for each potential owner
    for (const owner of potentialOwners) {
      const score = await calculateEnhancedMatchScore(searcherId, owner.user_id);

      if (score && score.total_score >= 60) { // Only create matches >= 60%
        // Check if match already exists
        const { data: existingMatch } = await supabase
          .from('matches')
          .select('id')
          .eq('searcher_id', searcherId)
          .eq('owner_id', owner.user_id)
          .single();

        if (!existingMatch) {
          // Create new match
          const { error: insertError } = await supabase
            .from('matches')
            .insert({
              searcher_id: searcherId,
              owner_id: owner.user_id,
              total_score: score.total_score,
              budget_score: score.budget_score,
              location_score: score.location_score,
              lifestyle_score: score.lifestyle_score,
              availability_score: score.availability_score,
              preferences_score: score.preferences_score,
              match_reason: score.match_reason,
              status: 'active',
            });

          if (!insertError) {
            matchesGenerated++;
          }
        }
      }
    }

    return { success: true, matchesGenerated };
  } catch (error) {
    logger.error('Failed to generate matches', error);
    return { success: false, matchesGenerated: 0, error: String(error) };
  }
}

/**
 * Mark a match as viewed
 */
export async function markMatchViewed(matchId: string, userId: string): Promise<boolean> {
  const supabase = createClient();

  try {
    const { error } = await supabase.rpc('mark_match_viewed', {
      p_match_id: matchId,
      p_user_id: userId,
    });

    return !error;
  } catch (error) {
    logger.error('Failed to mark match as viewed', error);
    return false;
  }
}

/**
 * Update match status
 */
export async function updateMatchStatus(
  matchId: string,
  status: Match['status']
): Promise<boolean> {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from('matches')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', matchId);

    return !error;
  } catch (error) {
    logger.error('Failed to update match status', error);
    return false;
  }
}

/**
 * Hide a match (user not interested)
 */
export async function hideMatch(matchId: string): Promise<boolean> {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from('matches')
      .update({
        status: 'hidden',
        hidden_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', matchId);

    return !error;
  } catch (error) {
    logger.error('Failed to hide match', error);
    return false;
  }
}

/**
 * Get match statistics for a user
 */
export async function getMatchStatistics(userId: string): Promise<{
  total: number;
  active: number;
  viewed: number;
  contacted: number;
  hidden: number;
  averageScore: number;
}> {
  const supabase = createClient();

  try {
    const { data: matches, error } = await supabase
      .from('matches')
      .select('status, total_score')
      .eq('searcher_id', userId);

    if (error || !matches) {
      return { total: 0, active: 0, viewed: 0, contacted: 0, hidden: 0, averageScore: 0 };
    }

    const stats = {
      total: matches.length,
      active: matches.filter((m) => m.status === 'active').length,
      viewed: matches.filter((m) => m.status === 'viewed').length,
      contacted: matches.filter((m) => m.status === 'contacted').length,
      hidden: matches.filter((m) => m.status === 'hidden').length,
      averageScore:
        matches.length > 0
          ? Math.round(matches.reduce((sum, m) => sum + m.total_score, 0) / matches.length)
          : 0,
    };

    return stats;
  } catch (error) {
    logger.error('Failed to get match statistics', error);
    return { total: 0, active: 0, viewed: 0, contacted: 0, hidden: 0, averageScore: 0 };
  }
}

/**
 * Submit feedback for a match (improves algorithm over time)
 */
export async function submitMatchFeedback(
  matchId: string,
  userId: string,
  feedback: {
    rating: number; // 1-5
    helpful: boolean;
    feedbackText?: string;
  }
): Promise<boolean> {
  const supabase = createClient();

  try {
    const { error } = await supabase.from('match_feedback').upsert({
      match_id: matchId,
      user_id: userId,
      rating: feedback.rating,
      helpful: feedback.helpful,
      feedback_text: feedback.feedbackText,
    });

    return !error;
  } catch (error) {
    logger.error('Failed to submit match feedback', error);
    return false;
  }
}
