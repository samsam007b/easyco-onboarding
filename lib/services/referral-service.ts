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
// i18n TRANSLATIONS
// ============================================================================
type Language = 'fr' | 'en' | 'nl' | 'de';

let currentLang: Language = 'fr';

export function setReferralServiceLanguage(lang: Language) {
  currentLang = lang;
}

const translations = {
  notAuthenticated: {
    fr: 'Non authentifié',
    en: 'Not authenticated',
    nl: 'Niet geauthenticeerd',
    de: 'Nicht authentifiziert',
  },
  unexpectedError: {
    fr: 'Erreur inattendue',
    en: 'Unexpected error',
    nl: 'Onverwachte fout',
    de: 'Unerwarteter Fehler',
  },
  izzicoUser: {
    fr: 'Utilisateur Izzico',
    en: 'Izzico User',
    nl: 'Izzico Gebruiker',
    de: 'Izzico Benutzer',
  },
  aFriend: {
    fr: 'Un ami',
    en: 'A friend',
    nl: 'Een vriend',
    de: 'Ein Freund',
  },
  errors: {
    generateCode: {
      fr: 'Erreur lors de la génération du code',
      en: 'Error generating the code',
      nl: 'Fout bij het genereren van de code',
      de: 'Fehler beim Generieren des Codes',
    },
    validation: {
      fr: 'Erreur de validation',
      en: 'Validation error',
      nl: 'Validatiefout',
      de: 'Validierungsfehler',
    },
    invalidCode: {
      fr: 'Code invalide ou inactif',
      en: 'Invalid or inactive code',
      nl: 'Ongeldige of inactieve code',
      de: 'Ungültiger oder inaktiver Code',
    },
    applyCode: {
      fr: "Erreur lors de l'application du code",
      en: 'Error applying the code',
      nl: 'Fout bij het toepassen van de code',
      de: 'Fehler beim Anwenden des Codes',
    },
    loadStats: {
      fr: 'Erreur lors du chargement des statistiques',
      en: 'Error loading statistics',
      nl: 'Fout bij het laden van statistieken',
      de: 'Fehler beim Laden der Statistiken',
    },
    loadCredits: {
      fr: 'Erreur lors du chargement des crédits',
      en: 'Error loading credits',
      nl: 'Fout bij het laden van tegoeden',
      de: 'Fehler beim Laden der Guthaben',
    },
  },
  share: {
    subject: {
      fr: (name: string) => `${name} vous invite sur Izzico!`,
      en: (name: string) => `${name} invites you to Izzico!`,
      nl: (name: string) => `${name} nodigt je uit voor Izzico!`,
      de: (name: string) => `${name} lädt dich zu Izzico ein!`,
    },
    body: {
      fr: (name: string, code: string, url: string) =>
        `${name} vous invite à rejoindre Izzico, la plateforme de coliving en Belgique!\n\nUtilisez le code ${code} ou cliquez sur ce lien pour vous inscrire et bénéficier d'un mois gratuit:\n${url}\n\nÀ bientôt sur Izzico!`,
      en: (name: string, code: string, url: string) =>
        `${name} invites you to join Izzico, the coliving platform in Belgium!\n\nUse the code ${code} or click this link to sign up and get a free month:\n${url}\n\nSee you soon on Izzico!`,
      nl: (name: string, code: string, url: string) =>
        `${name} nodigt je uit voor Izzico, het coliving-platform in België!\n\nGebruik de code ${code} of klik op deze link om je aan te melden en een gratis maand te krijgen:\n${url}\n\nTot snel op Izzico!`,
      de: (name: string, code: string, url: string) =>
        `${name} lädt dich zu Izzico ein, der Coliving-Plattform in Belgien!\n\nVerwende den Code ${code} oder klicke auf diesen Link, um dich anzumelden und einen kostenlosen Monat zu erhalten:\n${url}\n\nBis bald auf Izzico!`,
    },
    twitter: {
      fr: (code: string) => `Rejoignez Izzico avec mon code ${code} et bénéficiez d'un mois gratuit!`,
      en: (code: string) => `Join Izzico with my code ${code} and get a free month!`,
      nl: (code: string) => `Sluit je aan bij Izzico met mijn code ${code} en krijg een gratis maand!`,
      de: (code: string) => `Tritt Izzico mit meinem Code ${code} bei und erhalte einen kostenlosen Monat!`,
    },
  },
};

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
        return { success: false, error: translations.notAuthenticated[currentLang] };
      }
      targetUserId = user.id;
    }

    // Call database function to get or create code
    const { data, error } = await supabase
      .rpc('create_user_referral_code', { p_user_id: targetUserId });

    if (error) {
      logger.supabaseError('create_user_referral_code', error, { userId: targetUserId });
      return { success: false, error: translations.errors.generateCode[currentLang] };
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
    return { success: false, error: translations.unexpectedError[currentLang] };
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
        data: { valid: false, error: translations.errors.validation[currentLang] },
      };
    }

    if (!referrerId) {
      return {
        success: true,
        data: { valid: false, error: translations.errors.invalidCode[currentLang] },
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
        referrer_name: referrer?.full_name || translations.izzicoUser[currentLang],
      },
    };
  } catch (error) {
    logger.error('validateReferralCode error:', error);
    return { success: false, error: translations.unexpectedError[currentLang] };
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
        return { success: false, error: translations.notAuthenticated[currentLang] };
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
      return { success: false, error: translations.errors.applyCode[currentLang] };
    }

    const result = data as ApplyCodeResponse;
    return {
      success: result.success,
      data: result,
    };
  } catch (error) {
    logger.error('applyReferralCode error:', error);
    return { success: false, error: translations.unexpectedError[currentLang] };
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
        return { success: false, error: translations.notAuthenticated[currentLang] };
      }
      targetUserId = user.id;
    }

    // Call database function
    const { data, error } = await supabase
      .rpc('get_referral_stats', { p_user_id: targetUserId });

    if (error) {
      logger.supabaseError('get_referral_stats', error, { userId: targetUserId });
      return { success: false, error: translations.errors.loadStats[currentLang] };
    }

    // Parse the result (it's returned as JSONB from the function)
    const stats = data as ReferralStats;
    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    logger.error('getReferralStats error:', error);
    return { success: false, error: translations.unexpectedError[currentLang] };
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
        return { success: false, error: translations.notAuthenticated[currentLang] };
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
        referrerName: referrerData?.full_name || translations.izzicoUser[currentLang],
      },
    };
  } catch (error) {
    logger.error('checkPendingReferral error:', error);
    return { success: false, error: translations.unexpectedError[currentLang] };
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
        return { success: false, error: translations.notAuthenticated[currentLang] };
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
      return { success: false, error: translations.errors.loadCredits[currentLang] };
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
    return { success: false, error: translations.unexpectedError[currentLang] };
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
  const inviterName = userName || translations.aFriend[currentLang];

  return {
    subject: translations.share.subject[currentLang](inviterName),
    body: translations.share.body[currentLang](inviterName, code, shareUrl),
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
  const text = translations.share.twitter[currentLang](code);
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
