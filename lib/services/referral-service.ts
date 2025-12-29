/**
 * Referral Service
 * Handles referral code generation, validation, and reward tracking
 */

import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import type {
  ReferralStats,
  ValidateCodeResponse,
  ApplyCodeResponse,
  ServiceResult,
} from '@/types/referral.types';

// ============================================================================
// CONSTANTS
// ============================================================================

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://izzico.be';

// ============================================================================
// GET USER'S REFERRAL CODE
// ============================================================================

/**
 * Get user's referral code (creates one if doesn't exist)
 */
export async function getUserReferralCode(
  userId?: string
): Promise<ServiceResult<{ code: string; shareUrl: string }>> {
  try {
    const supabase = createClient();

    // Get current user if not provided
    let targetUserId = userId;
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Non authentifié' };
      }
      targetUserId = user.id;
    }

    // Call database function to get or create code
    const { data, error } = await supabase
      .rpc('create_user_referral_code', { p_user_id: targetUserId });

    if (error) {
      logger.supabaseError('create_user_referral_code', error, { userId: targetUserId });
      return { success: false, error: 'Erreur lors de la génération du code' };
    }

    const code = data as string;
    return {
      success: true,
      data: {
        code,
        shareUrl: `${APP_URL}/signup?ref=${code}`,
      },
    };
  } catch (error) {
    logger.error('getUserReferralCode error:', error);
    return { success: false, error: 'Erreur inattendue' };
  }
}

// ============================================================================
// VALIDATE REFERRAL CODE
// ============================================================================

/**
 * Validate a referral code and get referrer info
 */
export async function validateReferralCode(
  code: string
): Promise<ServiceResult<ValidateCodeResponse>> {
  try {
    const supabase = createClient();
    const normalizedCode = code.toUpperCase().trim();

    // Call database function to validate
    const { data: referrerId, error } = await supabase
      .rpc('validate_referral_code', { p_code: normalizedCode });

    if (error) {
      logger.supabaseError('validate_referral_code', error, { code: normalizedCode });
      return {
        success: true,
        data: { valid: false, error: 'Erreur de validation' },
      };
    }

    if (!referrerId) {
      return {
        success: true,
        data: { valid: false, error: 'Code invalide ou inactif' },
      };
    }

    // Get referrer name
    const { data: referrer } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', referrerId)
      .single();

    return {
      success: true,
      data: {
        valid: true,
        referrer_id: referrerId,
        referrer_name: referrer?.full_name || 'Utilisateur Izzico',
      },
    };
  } catch (error) {
    logger.error('validateReferralCode error:', error);
    return { success: false, error: 'Erreur inattendue' };
  }
}

// ============================================================================
// APPLY REFERRAL CODE
// ============================================================================

/**
 * Apply a referral code to a user's account
 * Should be called during signup process
 */
export async function applyReferralCode(
  code: string,
  referredUserId?: string
): Promise<ServiceResult<ApplyCodeResponse>> {
  try {
    const supabase = createClient();

    // Get current user if not provided
    let targetUserId = referredUserId;
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Non authentifié' };
      }
      targetUserId = user.id;
    }

    // Call database function
    const { data, error } = await supabase
      .rpc('apply_referral_code', {
        p_referred_user_id: targetUserId,
        p_referral_code: code.toUpperCase().trim(),
      });

    if (error) {
      logger.supabaseError('apply_referral_code', error, { userId: targetUserId, code });
      return { success: false, error: 'Erreur lors de l\'application du code' };
    }

    const result = data as ApplyCodeResponse;
    return {
      success: result.success,
      data: result,
    };
  } catch (error) {
    logger.error('applyReferralCode error:', error);
    return { success: false, error: 'Erreur inattendue' };
  }
}

// ============================================================================
// GET REFERRAL STATISTICS
// ============================================================================

/**
 * Get referral statistics for a user
 */
export async function getReferralStats(
  userId?: string
): Promise<ServiceResult<ReferralStats>> {
  try {
    const supabase = createClient();

    // Get current user if not provided
    let targetUserId = userId;
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Non authentifié' };
      }
      targetUserId = user.id;
    }

    // Call database function
    const { data, error } = await supabase
      .rpc('get_referral_stats', { p_user_id: targetUserId });

    if (error) {
      logger.supabaseError('get_referral_stats', error, { userId: targetUserId });
      return { success: false, error: 'Erreur lors du chargement des statistiques' };
    }

    // Parse the result (it's returned as JSONB from the function)
    const stats = data as ReferralStats;
    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    logger.error('getReferralStats error:', error);
    return { success: false, error: 'Erreur inattendue' };
  }
}

// ============================================================================
// CHECK IF USER HAS PENDING REFERRAL
// ============================================================================

/**
 * Check if user was referred by someone (pending reward)
 */
export async function checkPendingReferral(
  userId?: string
): Promise<ServiceResult<{ hasReferrer: boolean; referrerName?: string }>> {
  try {
    const supabase = createClient();

    // Get current user if not provided
    let targetUserId = userId;
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Non authentifié' };
      }
      targetUserId = user.id;
    }

    // Check for pending referral
    const { data: referral, error } = await supabase
      .from('referrals')
      .select(`
        id,
        status,
        referrer:referrer_id (
          full_name
        )
      `)
      .eq('referred_id', targetUserId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      logger.supabaseError('check pending referral', error, { userId: targetUserId });
    }

    if (!referral) {
      return {
        success: true,
        data: { hasReferrer: false },
      };
    }

    const referrerData = (Array.isArray(referral.referrer) ? referral.referrer[0] : referral.referrer) as { full_name: string } | null;

    return {
      success: true,
      data: {
        hasReferrer: true,
        referrerName: referrerData?.full_name || 'Utilisateur Izzico',
      },
    };
  } catch (error) {
    logger.error('checkPendingReferral error:', error);
    return { success: false, error: 'Erreur inattendue' };
  }
}

// ============================================================================
// GET REFERRAL CREDITS
// ============================================================================

/**
 * Get user's available referral credits
 */
export async function getReferralCredits(
  userId?: string
): Promise<ServiceResult<{ earned: number; used: number; available: number; successfulReferrals: number }>> {
  try {
    const supabase = createClient();

    // Get current user if not provided
    let targetUserId = userId;
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Non authentifié' };
      }
      targetUserId = user.id;
    }

    const { data, error } = await supabase
      .from('referral_credits')
      .select('total_credits_earned, credits_used, successful_referrals')
      .eq('user_id', targetUserId)
      .single();

    if (error && error.code !== 'PGRST116') {
      logger.supabaseError('get referral credits', error, { userId: targetUserId });
      return { success: false, error: 'Erreur lors du chargement des crédits' };
    }

    const earned = data?.total_credits_earned || 0;
    const used = data?.credits_used || 0;
    const available = Math.min(earned - used, 24); // Cap at 24 months
    const successfulReferrals = data?.successful_referrals || 0;

    return {
      success: true,
      data: { earned, used, available: Math.max(0, available), successfulReferrals },
    };
  } catch (error) {
    logger.error('getReferralCredits error:', error);
    return { success: false, error: 'Erreur inattendue' };
  }
}

// ============================================================================
// SHARE HELPERS
// ============================================================================

/**
 * Generate share message for different platforms
 */
export function generateShareMessage(
  code: string,
  shareUrl: string,
  userName?: string
): { subject: string; body: string } {
  const inviterName = userName || 'Un ami';

  return {
    subject: `${inviterName} vous invite sur Izzico!`,
    body: `${inviterName} vous invite à rejoindre Izzico, la plateforme de coliving en Belgique!

Utilisez le code ${code} ou cliquez sur ce lien pour vous inscrire et bénéficier d'un mois gratuit:
${shareUrl}

À bientôt sur Izzico!`,
  };
}

/**
 * Generate WhatsApp share URL
 */
export function getWhatsAppShareUrl(code: string, shareUrl: string, userName?: string): string {
  const message = generateShareMessage(code, shareUrl, userName);
  return `https://wa.me/?text=${encodeURIComponent(message.body)}`;
}

/**
 * Generate email share URL (mailto)
 */
export function getEmailShareUrl(code: string, shareUrl: string, userName?: string): string {
  const message = generateShareMessage(code, shareUrl, userName);
  return `mailto:?subject=${encodeURIComponent(message.subject)}&body=${encodeURIComponent(message.body)}`;
}

/**
 * Generate Facebook share URL
 */
export function getFacebookShareUrl(shareUrl: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
}

/**
 * Generate Twitter/X share URL
 */
export function getTwitterShareUrl(code: string, shareUrl: string): string {
  const text = `Rejoignez Izzico avec mon code ${code} et bénéficiez d'un mois gratuit!`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
}

/**
 * Copy to clipboard helper
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
}
