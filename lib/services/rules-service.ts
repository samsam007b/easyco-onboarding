/**
 * House Rules Service
 * Handles: Rule creation, voting, status updates, statistics
 */

import { createClient } from '@/lib/auth/supabase-client';
import type {
  HouseRule,
  HouseRuleWithProposer,
  RuleVote,
  RuleVoteWithUser,
  CreateRuleForm,
  CastVoteForm,
  RulesStats,
  RuleStatus,
  CastVoteResult,
  FinalizeVoteResult,
} from '@/types/rules.types';
import { calculateVotingProgress, getTimeRemaining } from '@/types/rules.types';

class RulesService {
  private supabase = createClient();

  /**
   * Get all rules for a property
   */
  async getRules(
    propertyId: string,
    userId: string,
    filters?: {
      status?: RuleStatus;
    }
  ): Promise<HouseRuleWithProposer[]> {
    try {
      let query = this.supabase
        .from('house_rules')
        .select(
          `
          *,
          profiles!proposed_by (
            full_name,
            avatar_url
          )
        `
        )
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Get user's votes for all rules
      const { data: userVotes } = await this.supabase
        .from('rule_votes')
        .select('rule_id, vote')
        .eq('user_id', userId);

      const userVotesMap = new Map(userVotes?.map((v) => [v.rule_id, v.vote]) || []);

      const enriched: HouseRuleWithProposer[] =
        data?.map((rule) => {
          const userVote = userVotesMap.get(rule.id);
          const progress = calculateVotingProgress(rule);

          return {
            ...rule,
            proposer_name: (rule.profiles as any)?.full_name || 'Utilisateur inconnu',
            proposer_avatar: (rule.profiles as any)?.avatar_url,
            user_vote: userVote,
            has_voted: !!userVote,
            total_votes: progress.votes_received,
            vote_percentage: progress.percentage,
            is_passing: progress.is_passing,
            time_remaining: getTimeRemaining(rule.voting_ends_at),
          };
        }) || [];

      console.log(`[Rules] ✅ Fetched ${enriched.length} rules`);
      return enriched;
    } catch (error) {
      console.error('[Rules] ❌ Failed to fetch rules:', error);
      return [];
    }
  }

  /**
   * Get a single rule by ID
   */
  async getRule(ruleId: string, userId: string): Promise<HouseRuleWithProposer | null> {
    try {
      const { data, error } = await this.supabase
        .from('house_rules')
        .select(
          `
          *,
          profiles!proposed_by (
            full_name,
            avatar_url
          )
        `
        )
        .eq('id', ruleId)
        .single();

      if (error) throw error;

      // Get user's vote
      const { data: userVote } = await this.supabase
        .from('rule_votes')
        .select('vote')
        .eq('rule_id', ruleId)
        .eq('user_id', userId)
        .single();

      const progress = calculateVotingProgress(data);

      const enriched: HouseRuleWithProposer = {
        ...data,
        proposer_name: (data.profiles as any)?.full_name || 'Utilisateur inconnu',
        proposer_avatar: (data.profiles as any)?.avatar_url,
        user_vote: userVote?.vote,
        has_voted: !!userVote,
        total_votes: progress.votes_received,
        vote_percentage: progress.percentage,
        is_passing: progress.is_passing,
        time_remaining: getTimeRemaining(data.voting_ends_at),
      };

      return enriched;
    } catch (error) {
      console.error('[Rules] ❌ Failed to fetch rule:', error);
      return null;
    }
  }

  /**
   * Create a new rule proposal
   */
  async createRule(
    propertyId: string,
    userId: string,
    form: CreateRuleForm
  ): Promise<{ success: boolean; rule?: HouseRule; error?: string }> {
    try {
      // Get number of members to set votes_required
      const { data: members } = await this.supabase
        .from('property_members')
        .select('user_id')
        .eq('property_id', propertyId);

      const votesRequired = members?.length || 1;

      // Calculate voting end date
      const votingDurationDays = form.voting_duration_days || 7;
      const votingEndsAt = new Date();
      votingEndsAt.setDate(votingEndsAt.getDate() + votingDurationDays);

      const { data: rule, error } = await this.supabase
        .from('house_rules')
        .insert({
          property_id: propertyId,
          proposed_by: userId,
          title: form.title,
          description: form.description,
          category: form.category,
          status: 'voting',
          votes_required: votesRequired,
          voting_ends_at: votingEndsAt.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      console.log('[Rules] ✅ Rule created:', rule.id);

      return { success: true, rule };
    } catch (error: any) {
      console.error('[Rules] ❌ Failed to create rule:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la création de la règle',
      };
    }
  }

  /**
   * Cast a vote on a rule
   */
  async castVote(
    ruleId: string,
    userId: string,
    form: CastVoteForm
  ): Promise<{ success: boolean; result?: CastVoteResult; error?: string }> {
    try {
      const { data, error } = await this.supabase.rpc('cast_rule_vote', {
        p_rule_id: ruleId,
        p_user_id: userId,
        p_vote: form.vote,
        p_comment: form.comment || null,
      });

      if (error) throw error;

      const result = data[0] as CastVoteResult;

      console.log('[Rules] ✅ Vote cast:', result);

      return { success: true, result };
    } catch (error: any) {
      console.error('[Rules] ❌ Failed to cast vote:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors du vote',
      };
    }
  }

  /**
   * Finalize voting on a rule
   */
  async finalizeVoting(
    ruleId: string
  ): Promise<{ success: boolean; result?: FinalizeVoteResult; error?: string }> {
    try {
      const { data, error } = await this.supabase.rpc('finalize_rule_voting', {
        p_rule_id: ruleId,
      });

      if (error) throw error;

      const result = data[0] as FinalizeVoteResult;

      console.log('[Rules] ✅ Voting finalized:', result);

      return { success: true, result };
    } catch (error: any) {
      console.error('[Rules] ❌ Failed to finalize voting:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la finalisation',
      };
    }
  }

  /**
   * Archive a rule
   */
  async archiveRule(ruleId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('house_rules')
        .update({
          status: 'archived',
          archived_at: new Date().toISOString(),
        })
        .eq('id', ruleId);

      if (error) throw error;

      console.log('[Rules] ✅ Rule archived:', ruleId);

      return { success: true };
    } catch (error: any) {
      console.error('[Rules] ❌ Failed to archive rule:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'archivage',
      };
    }
  }

  /**
   * Get all votes for a rule
   */
  async getVotes(ruleId: string): Promise<RuleVoteWithUser[]> {
    try {
      const { data, error } = await this.supabase
        .from('rule_votes')
        .select(
          `
          *,
          profiles!user_id (
            full_name,
            avatar_url
          )
        `
        )
        .eq('rule_id', ruleId)
        .order('voted_at', { ascending: false });

      if (error) throw error;

      const enriched: RuleVoteWithUser[] =
        data?.map((vote) => ({
          ...vote,
          user_name: (vote.profiles as any)?.full_name || 'Utilisateur inconnu',
          user_avatar: (vote.profiles as any)?.avatar_url,
        })) || [];

      return enriched;
    } catch (error) {
      console.error('[Rules] ❌ Failed to fetch votes:', error);
      return [];
    }
  }

  /**
   * Get rules statistics
   */
  async getStats(propertyId: string): Promise<RulesStats> {
    try {
      const { data, error } = await this.supabase.rpc('get_active_rules_summary', {
        p_property_id: propertyId,
      });

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          total_active: 0,
          total_voting: 0,
          total_rejected: 0,
          by_category: {} as any,
          recent_rules: [],
        };
      }

      const stats = data[0];

      // Get voting and rejected counts
      const { data: votingRules } = await this.supabase
        .from('house_rules')
        .select('id')
        .eq('property_id', propertyId)
        .eq('status', 'voting');

      const { data: rejectedRules } = await this.supabase
        .from('house_rules')
        .select('id')
        .eq('property_id', propertyId)
        .eq('status', 'rejected');

      return {
        total_active: stats.total_rules || 0,
        total_voting: votingRules?.length || 0,
        total_rejected: rejectedRules?.length || 0,
        by_category: stats.by_category || {},
        recent_rules: stats.recent_rules || [],
      };
    } catch (error) {
      console.error('[Rules] ❌ Failed to get stats:', error);
      return {
        total_active: 0,
        total_voting: 0,
        total_rejected: 0,
        by_category: {} as any,
        recent_rules: [],
      };
    }
  }
}

export const rulesService = new RulesService();
