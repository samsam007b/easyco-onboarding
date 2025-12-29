/**
 * Referral System Type Definitions
 * Types for referral codes, tracking, rewards, and credits
 */

// ============================================================================
// REFERRAL STATUS & ENUMS
// ============================================================================

export type ReferralStatus = 'pending' | 'qualified' | 'rewarded' | 'expired';

export type ReferredUserType = 'owner' | 'resident';

// ============================================================================
// REFERRAL CODE TYPES
// ============================================================================

export interface ReferralCode {
  id: string;
  user_id: string;
  code: string; // Format: "IZZI7KM2"
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// REFERRAL TRACKING TYPES
// ============================================================================

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code_id: string;

  // Status
  status: ReferralStatus;

  // User type (determines reward amount)
  referred_user_type: ReferredUserType | null;

  // Rewards (in months)
  referrer_reward_months: number;
  referred_reward_months: number;

  // Timestamps
  created_at: string;
  qualified_at: string | null;
  rewarded_at: string | null;
}

export interface ReferralWithDetails extends Referral {
  referred_name?: string;
  referred_email?: string;
  referred_avatar?: string;
}

// ============================================================================
// REFERRAL CREDITS TYPES
// ============================================================================

export interface ReferralCredits {
  id: string;
  user_id: string;

  // Credit tracking
  total_credits_earned: number;
  credits_used: number;

  // Computed (max 24)
  credits_available: number;

  // Stats
  successful_referrals: number;

  // Timestamps
  created_at: string;
  updated_at: string;
}

// ============================================================================
// REFERRAL STATISTICS TYPES
// ============================================================================

export interface ReferralStats {
  // User's code
  code: string;
  share_url: string;

  // Referral counts
  total_referrals: number;
  successful_referrals: number;
  pending_referrals: number;

  // Credits
  credits_earned: number;
  credits_used: number;
  credits_available: number; // Capped at 24

  // Recent activity
  recent_referrals: ReferralWithDetails[];
}

// ============================================================================
// REWARD CONFIGURATION
// ============================================================================

export const REFERRAL_REWARDS = {
  // Inviting a resident
  resident: {
    referrer_months: 2,
    referred_months: 1,
  },
  // Inviting an owner
  owner: {
    referrer_months: 3,
    referred_months: 1,
  },
  // Maximum accumulated credits
  max_credits: 24,
} as const;

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ValidateCodeResponse {
  valid: boolean;
  referrer_id?: string;
  referrer_name?: string;
  error?: string;
}

export interface ApplyCodeResponse {
  success: boolean;
  error?: 'invalid_code' | 'self_referral' | 'already_referred';
  message?: string;
  referrer_id?: string;
}

export interface ProcessRewardsResponse {
  success: boolean;
  reason?: 'not_eligible' | 'no_pending_referral' | 'invalid_user_type';
  message?: string;
  referrer_reward?: number;
  referred_reward?: number;
  referred_user_type?: ReferredUserType;
}

// ============================================================================
// API REQUEST TYPES
// ============================================================================

export interface ApplyReferralCodeParams {
  code: string;
}

// ============================================================================
// UI COMPONENT PROPS TYPES
// ============================================================================

export interface ReferralCodeCardProps {
  code: string;
  shareUrl: string;
  onShare?: () => void;
  onCopy?: () => void;
  variant?: 'default' | 'compact';
}

export interface ReferralStatsCardProps {
  stats: ReferralStats;
  isLoading?: boolean;
}

export interface ReferralCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate?: (isValid: boolean) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export interface ShareReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  shareUrl: string;
  userName?: string;
}

// ============================================================================
// SHARE OPTIONS
// ============================================================================

export type ShareMethod = 'copy' | 'email' | 'whatsapp' | 'facebook' | 'twitter' | 'sms';

export interface ShareOption {
  method: ShareMethod;
  label: string;
  icon: string;
  action: (code: string, shareUrl: string, userName?: string) => void;
}

// ============================================================================
// SERVICE RESULT TYPES
// ============================================================================

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type GetReferralCodeResult = ServiceResult<{
  code: string;
  shareUrl: string;
}>;

export type GetReferralStatsResult = ServiceResult<ReferralStats>;

export type ValidateReferralCodeResult = ServiceResult<ValidateCodeResponse>;

export type ApplyReferralCodeResult = ServiceResult<ApplyCodeResponse>;
