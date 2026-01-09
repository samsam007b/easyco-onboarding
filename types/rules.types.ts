/**
 * House Rules + Voting System Types
 * Democratic rule creation and voting
 */

// ============================================================================
// CORE TYPES
// ============================================================================

export type RuleCategory =
  | 'cleaning'
  | 'noise'
  | 'guests'
  | 'common_areas'
  | 'kitchen'
  | 'bathroom'
  | 'pets'
  | 'smoking'
  | 'other';

export type RuleStatus = 'voting' | 'active' | 'rejected' | 'archived';

export type VoteType = 'for' | 'against' | 'abstain';

export interface HouseRule {
  id: string;
  property_id: string;
  proposed_by: string;
  title: string;
  description: string;
  category: RuleCategory;
  status: RuleStatus;
  votes_required: number;
  votes_for: number;
  votes_against: number;
  votes_abstain: number;
  voting_ends_at?: string;
  activated_at?: string;
  archived_at?: string;
  created_at: string;
  updated_at: string;
}

export interface RuleVote {
  id: string;
  rule_id: string;
  user_id: string;
  vote: VoteType;
  comment?: string;
  voted_at: string;
}

// ============================================================================
// ENRICHED TYPES (with joined data)
// ============================================================================

export interface HouseRuleWithProposer extends HouseRule {
  proposer_name: string;
  proposer_avatar?: string;
  user_vote?: VoteType; // Current user's vote
  has_voted: boolean;
  total_votes: number;
  vote_percentage: number; // % of required votes received
  is_passing: boolean; // More "for" than "against"
  time_remaining?: string; // Human readable (ex: "2 jours restants")
}

export interface RuleVoteWithUser extends RuleVote {
  user_name: string;
  user_avatar?: string;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface CreateRuleForm {
  title: string;
  description: string;
  category: RuleCategory;
  voting_duration_days?: number; // Default: 7 days
}

export interface CastVoteForm {
  vote: VoteType;
  comment?: string;
}

// ============================================================================
// STATISTICS & ANALYTICS
// ============================================================================

export interface RulesStats {
  total_active: number;
  total_voting: number;
  total_rejected: number;
  by_category: Record<RuleCategory, number>;
  recent_rules: Array<{
    id: string;
    title: string;
    category: RuleCategory;
    activated_at: string;
  }>;
}

export interface VotingProgress {
  votes_received: number;
  votes_required: number;
  percentage: number;
  votes_for: number;
  votes_against: number;
  votes_abstain: number;
  is_passing: boolean;
  can_finalize: boolean;
}

// ============================================================================
// FUNCTION RETURN TYPES
// ============================================================================

export interface CastVoteResult {
  success: boolean;
  message: string;
  votes_for: number;
  votes_against: number;
  votes_abstain: number;
}

export interface FinalizeVoteResult {
  success: boolean;
  new_status: RuleStatus;
  message: string;
}

// ============================================================================
// UI HELPERS
// ============================================================================

export const RULE_CATEGORIES: Array<{
  value: RuleCategory;
  label: string;
  iconName: string;
  color: string;
}> = [
  { value: 'cleaning', label: 'Ménage', iconName: 'Sparkles', color: 'bg-blue-100 text-blue-700' },
  { value: 'noise', label: 'Bruit', iconName: 'VolumeX', color: 'bg-purple-100 text-purple-700' },
  { value: 'guests', label: 'Invités', iconName: 'Users', color: 'bg-green-100 text-green-700' },
  {
    value: 'common_areas',
    label: 'Espaces communs',
    iconName: 'Home',
    color: 'bg-orange-100 text-orange-700',
  },
  { value: 'kitchen', label: 'Cuisine', iconName: 'UtensilsCrossed', color: 'bg-yellow-100 text-yellow-700' },
  {
    value: 'bathroom',
    label: 'Salle de bain',
    iconName: 'Droplets',
    color: 'bg-cyan-100 text-cyan-700',
  },
  { value: 'pets', label: 'Animaux', iconName: 'PawPrint', color: 'bg-pink-100 text-pink-700' },
  { value: 'smoking', label: 'Tabac', iconName: 'Ban', color: 'bg-red-100 text-red-700' },
  { value: 'other', label: 'Autre', iconName: 'FileText', color: 'bg-gray-100 text-gray-700' },
];

export const RULE_STATUSES: Array<{
  value: RuleStatus;
  label: string;
  iconName: string;
  color: string;
}> = [
  { value: 'voting', label: 'En vote', iconName: 'Vote', color: 'bg-blue-100 text-blue-700' },
  { value: 'active', label: 'Active', iconName: 'CheckCircle', color: 'bg-green-100 text-green-700' },
  { value: 'rejected', label: 'Rejetée', iconName: 'XCircle', color: 'bg-red-100 text-red-700' },
  { value: 'archived', label: 'Archivée', iconName: 'Archive', color: 'bg-gray-100 text-gray-700' },
];

export const VOTE_TYPES: Array<{
  value: VoteType;
  label: string;
  iconName: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = [
  {
    value: 'for',
    label: 'Pour',
    iconName: 'ThumbsUp',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
  },
  {
    value: 'against',
    label: 'Contre',
    iconName: 'ThumbsDown',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
  },
  {
    value: 'abstain',
    label: 'Abstention',
    iconName: 'Minus',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-500',
  },
];

export const getCategoryInfo = (category: RuleCategory) => {
  return RULE_CATEGORIES.find((c) => c.value === category) || RULE_CATEGORIES[8];
};

export const getStatusInfo = (status: RuleStatus) => {
  return RULE_STATUSES.find((s) => s.value === status) || RULE_STATUSES[0];
};

export const getVoteTypeInfo = (vote: VoteType) => {
  return VOTE_TYPES.find((v) => v.value === vote) || VOTE_TYPES[2];
};

/**
 * Calculate voting progress
 */
export const calculateVotingProgress = (rule: HouseRule): VotingProgress => {
  const votes_received = rule.votes_for + rule.votes_against + rule.votes_abstain;
  const percentage = rule.votes_required > 0 ? (votes_received / rule.votes_required) * 100 : 0;
  const is_passing = rule.votes_for > rule.votes_against;
  const can_finalize = votes_received >= rule.votes_required;

  return {
    votes_received,
    votes_required: rule.votes_required,
    percentage: Math.min(percentage, 100),
    votes_for: rule.votes_for,
    votes_against: rule.votes_against,
    votes_abstain: rule.votes_abstain,
    is_passing,
    can_finalize,
  };
};

/**
 * Get time remaining for voting
 */
export const getTimeRemaining = (votingEndsAt?: string): string | undefined => {
  if (!votingEndsAt) return undefined;

  const now = new Date();
  const endDate = new Date(votingEndsAt);
  const diff = endDate.getTime() - now.getTime();

  if (diff <= 0) return 'Terminé';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days} jour${days > 1 ? 's' : ''} restant${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} heure${hours > 1 ? 's' : ''} restante${hours > 1 ? 's' : ''}`;
  return 'Moins d\'1 heure';
};
