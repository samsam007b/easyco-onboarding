/**
 * FAQ SYSTEM - Layer 1 (100% LOCAL) - PERSONALIZED VERSION
 *
 * Intent detection + PERSONALIZED responses based on user context
 * Cost: $0 - handles ~70% of queries
 *
 * This system uses keyword matching and pattern recognition
 * to answer common questions WITHOUT calling any AI API.
 *
 * PERSONALIZATION FEATURES:
 * - Uses user's first name in responses
 * - Adapts content based on user_type (owner/resident/searcher)
 * - Shows relevant info based on onboarding status
 * - Displays subscription/trial status
 * - References user's properties, preferences, etc.
 */

// =====================================================
// USER CONTEXT INTERFACE
// =====================================================

export interface UserContext {
  // Basic identity
  userId?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;

  // User type & status
  userType: 'owner' | 'resident' | 'searcher' | 'unknown';
  onboardingCompleted: boolean;
  onboardingStep?: string;
  profileCompletionScore?: number; // 0-100

  // Subscription info
  subscriptionStatus?: 'trial' | 'active' | 'expired' | 'cancelled' | 'none';
  trialDaysRemaining?: number;
  subscriptionEndDate?: string;
  isPremium?: boolean;

  // Verification status
  emailVerified?: boolean;
  phoneVerified?: boolean;
  idVerified?: boolean;
  kycStatus?: 'pending' | 'verified' | 'rejected';

  // Referral info
  referralCode?: string;
  referralCreditsMonths?: number;
  referralsCount?: number;

  // Property info (for owners)
  propertiesCount?: number;
  publishedPropertiesCount?: number;
  applicationsCount?: number;

  // Searcher/Resident specific
  savedSearchesCount?: number;
  favoritesCount?: number;
  matchesCount?: number;
  currentPropertyName?: string; // If resident

  // Activity
  unreadMessagesCount?: number;
  pendingTasksCount?: number;
  lastActiveAt?: string;

  // Preferences
  preferredCity?: string;
  budgetMin?: number;
  budgetMax?: number;
  language?: 'fr' | 'en';

  // Personality traits (for matching context)
  isSmoker?: boolean;
  hasPets?: boolean;
  cleanlinessLevel?: string;
  sociabilityLevel?: number; // 1-10
}

// Default context for non-authenticated users
export const DEFAULT_USER_CONTEXT: UserContext = {
  userType: 'unknown',
  onboardingCompleted: false,
  language: 'fr',
};

// =====================================================
// INTENT DEFINITIONS
// =====================================================

export type Intent =
  | 'pricing'
  | 'subscription'
  | 'trial'
  | 'referral'
  | 'matching'
  | 'search'
  | 'property'
  | 'finances'
  | 'messaging'
  | 'verification'
  | 'navigation'
  | 'help'
  | 'greeting'
  | 'goodbye'
  | 'onboarding_help'
  | 'profile_completion'
  | 'my_account'
  | 'applications'
  | 'roommates'
  // NEW INTENTS - Extended coverage
  | 'notifications'
  | 'security'
  | 'payment'
  | 'calendar'
  | 'documents'
  | 'support'
  | 'tips'
  | 'feedback'
  | 'settings'
  | 'privacy'
  | 'delete_account'
  | 'language'
  | 'mobile_app'
  | 'bug_report'
  | 'feature_request'
  | 'how_it_works'
  | 'trust_safety'
  | 'success_stories'
  | 'community'
  | 'events'
  | 'moving'
  | 'lease'
  | 'insurance'
  | 'unknown';

interface IntentPattern {
  intent: Intent;
  patterns: RegExp[];
  keywords: string[];
  priority: number; // Higher = checked first
}

interface FAQResponse {
  intent: Intent;
  response: string;
  confidence: number;
  suggestedActions?: {
    type: 'navigate' | 'explain' | 'contact';
    label: string;
    value: string;
  }[];
}

// =====================================================
// PERSONALIZATION HELPERS
// =====================================================

// =====================================================
// RESPONSE VARIATIONS - For natural conversation
// =====================================================

/**
 * Pick a random element from an array for variety
 */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Get a friendly greeting based on time of day with variations
 */
function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  const day = new Date().getDay(); // 0 = Sunday
  const isWeekend = day === 0 || day === 6;

  if (hour < 6) {
    return pickRandom(['Bonsoir', 'Toujours debout ?', 'Nuit blanche ?']);
  }
  if (hour < 12) {
    if (isWeekend) {
      return pickRandom(['Bon week-end', 'Bonjour', 'Belle matinée']);
    }
    return pickRandom(['Bonjour', 'Bonne matinée', 'Hello']);
  }
  if (hour < 14) {
    return pickRandom(['Bon appétit', 'Bonjour', 'Bonne pause déj']);
  }
  if (hour < 18) {
    return pickRandom(['Bonjour', 'Bon après-midi', 'Bel après-midi']);
  }
  if (hour < 22) {
    return pickRandom(['Bonsoir', 'Bonne soirée', 'Hello']);
  }
  return pickRandom(['Bonsoir', 'Bonne fin de soirée', 'Pas encore au lit ?']);
}

/**
 * Get seasonal/contextual greeting addition
 */
function getSeasonalContext(): string {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  // Special dates
  if (month === 11 && day >= 20 && day <= 25) return " 🎄 Joyeuses fêtes !";
  if (month === 0 && day === 1) return " 🎉 Bonne année !";
  if (month === 1 && day === 14) return " 💕";
  if (month === 5 && day === 21) return " ☀️ C'est l'été !";

  // Seasonal touches
  if (month >= 2 && month <= 4) return pickRandom(['', ' 🌸', ' Le printemps est là !']);
  if (month >= 5 && month <= 7) return pickRandom(['', ' ☀️', '']);
  if (month >= 8 && month <= 10) return pickRandom(['', ' 🍂', '']);
  if (month === 11 || month <= 1) return pickRandom(['', ' ❄️', '']);

  return '';
}

/**
 * Get encouraging messages based on user activity
 */
function getEncouragingMessage(ctx: UserContext): string {
  const messages: string[] = [];

  // Profile completion encouragement
  if (ctx.profileCompletionScore !== undefined) {
    if (ctx.profileCompletionScore < 30) {
      messages.push("Petit conseil : un profil complet, c'est 5x plus de chances de succès ! 🚀");
    } else if (ctx.profileCompletionScore < 60) {
      messages.push("Vous avancez bien ! Encore quelques infos et votre profil sera top.");
    } else if (ctx.profileCompletionScore < 90) {
      messages.push("Presque parfait ! Plus que quelques détails pour un profil au top !");
    }
  }

  // Activity-based encouragement
  if (ctx.userType === 'searcher') {
    if (!ctx.favoritesCount || ctx.favoritesCount === 0) {
      messages.push("Pensez à ajouter des annonces en favoris pour les retrouver facilement !");
    }
    if (ctx.matchesCount && ctx.matchesCount > 3) {
      messages.push("Wow, plusieurs matchs vous attendent ! N'hésitez pas à les contacter.");
    }
  }

  if (ctx.userType === 'owner') {
    if (ctx.applicationsCount && ctx.applicationsCount > 0) {
      messages.push("Des candidats attendent votre réponse ! Répondre vite augmente vos chances.");
    }
    if (!ctx.propertiesCount || ctx.propertiesCount === 0) {
      messages.push("Prêt à publier votre première annonce ? C'est gratuit pendant l'essai !");
    }
  }

  // Referral nudge
  if (ctx.referralsCount === 0 && ctx.subscriptionStatus === 'trial') {
    messages.push("💡 Saviez-vous que le parrainage peut vous offrir jusqu'à 24 mois gratuits ?");
  }

  return messages.length > 0 ? pickRandom(messages) : '';
}

/**
 * Get proactive recommendations based on user context
 */
function getProactiveRecommendation(ctx: UserContext): { message: string; action?: { label: string; value: string } } | null {
  // Priority 1: Trial ending soon
  if (ctx.subscriptionStatus === 'trial' && ctx.trialDaysRemaining !== undefined && ctx.trialDaysRemaining < 14) {
    return {
      message: `⏰ Votre essai se termine dans ${ctx.trialDaysRemaining} jours. Pensez au parrainage pour prolonger gratuitement !`,
      action: { label: 'Voir le parrainage', value: '/settings/referral' }
    };
  }

  // Priority 2: Unread messages
  if (ctx.unreadMessagesCount && ctx.unreadMessagesCount >= 3) {
    return {
      message: `📬 Vous avez ${ctx.unreadMessagesCount} messages en attente !`,
      action: { label: 'Voir les messages', value: '/messages' }
    };
  }

  // Priority 3: Pending applications (for owners)
  if (ctx.userType === 'owner' && ctx.applicationsCount && ctx.applicationsCount >= 2) {
    return {
      message: `📋 ${ctx.applicationsCount} candidatures attendent votre réponse.`,
      action: { label: 'Voir les candidatures', value: '/dashboard/owner/applications' }
    };
  }

  // Priority 4: Profile incomplete
  if (ctx.profileCompletionScore !== undefined && ctx.profileCompletionScore < 50) {
    return {
      message: `📊 Profil à ${ctx.profileCompletionScore}% - Complétez-le pour de meilleurs résultats !`,
      action: { label: 'Compléter', value: '/profile/edit' }
    };
  }

  // Priority 5: High matches for searchers
  if (ctx.userType === 'searcher' && ctx.matchesCount && ctx.matchesCount >= 5) {
    return {
      message: `🎯 ${ctx.matchesCount} matchs compatibles vous attendent !`,
      action: { label: 'Voir les matchs', value: '/search?tab=matches' }
    };
  }

  // Priority 6: No verification
  if (!ctx.emailVerified || !ctx.phoneVerified) {
    return {
      message: `✅ Vérifiez votre profil pour gagner en visibilité et confiance.`,
      action: { label: 'Vérifier', value: '/settings/verification' }
    };
  }

  return null;
}

/**
 * Get user's display name or fallback
 */
function getUserName(ctx: UserContext): string {
  return ctx.firstName || ctx.displayName || 'vous';
}

/**
 * Get user type label in French
 */
function getUserTypeLabel(ctx: UserContext): string {
  switch (ctx.userType) {
    case 'owner':
      return 'propriétaire';
    case 'resident':
      return 'résident';
    case 'searcher':
      return 'chercheur de coloc';
    default:
      return 'utilisateur';
  }
}

/**
 * Format trial/subscription status message
 */
function getSubscriptionStatusMessage(ctx: UserContext): string {
  if (ctx.subscriptionStatus === 'trial' && ctx.trialDaysRemaining !== undefined) {
    if (ctx.trialDaysRemaining > 30) {
      return `Vous êtes en période d'essai gratuite (encore ${Math.floor(ctx.trialDaysRemaining / 30)} mois).`;
    }
    if (ctx.trialDaysRemaining > 0) {
      return `Votre essai gratuit se termine dans ${ctx.trialDaysRemaining} jours.`;
    }
    return `Votre période d'essai est terminée.`;
  }
  if (ctx.subscriptionStatus === 'active') {
    return `Votre abonnement est actif.`;
  }
  if (ctx.subscriptionStatus === 'expired') {
    return `Votre abonnement a expiré.`;
  }
  return '';
}

/**
 * Get onboarding progress message
 */
function getOnboardingMessage(ctx: UserContext): string {
  if (ctx.onboardingCompleted) {
    return '';
  }
  if (ctx.profileCompletionScore !== undefined) {
    if (ctx.profileCompletionScore < 50) {
      return `\n\n💡 **Conseil** : Votre profil est complété à ${ctx.profileCompletionScore}%. Complétez-le pour améliorer vos chances de matching !`;
    }
    if (ctx.profileCompletionScore < 100) {
      return `\n\n💡 Plus que quelques étapes pour compléter votre profil (${ctx.profileCompletionScore}% complété) !`;
    }
  }
  if (ctx.onboardingStep) {
    return `\n\n📋 Vous êtes à l'étape "${ctx.onboardingStep}" de votre inscription.`;
  }
  return `\n\n📋 N'oubliez pas de terminer votre inscription pour profiter de toutes les fonctionnalités !`;
}

/**
 * Get referral encouragement based on usage
 */
function getReferralEncouragement(ctx: UserContext): string {
  if (ctx.referralCreditsMonths && ctx.referralCreditsMonths > 0) {
    return `\n\n🎁 Vous avez ${ctx.referralCreditsMonths} mois de crédit parrainage !`;
  }
  if (ctx.referralsCount === 0) {
    return `\n\n🎁 Astuce : Parrainez un ami et gagnez des mois gratuits !`;
  }
  return '';
}

// =====================================================
// INTENT PATTERNS (ordered by priority)
// =====================================================

const INTENT_PATTERNS: IntentPattern[] = [
  // Greeting (highest priority for UX)
  // Note: Uses \s* after ^ to handle emojis at the start (emojis are stripped, leaving spaces)
  {
    intent: 'greeting',
    patterns: [
      /^[\s\p{Emoji}]*(salut|bonjour|hello|hi|hey|coucou|bonsoir)/iu,
      /^[\s\p{Emoji}]*(ca va|ça va|comment ça va|comment vas-tu)/iu,
      /(salut|bonjour|hello|hi|hey|coucou)[\s!?.]*$/i, // Greeting at end of message
    ],
    keywords: ['salut', 'bonjour', 'hello', 'hi', 'hey', 'coucou'],
    priority: 100,
  },

  // Goodbye
  {
    intent: 'goodbye',
    patterns: [
      /^(au revoir|bye|à\+|a\+|merci|thanks|ciao)/i,
      /(bonne (journée|soirée|nuit))/i,
    ],
    keywords: ['bye', 'aurevoir', 'merci', 'ciao'],
    priority: 99,
  },

  // Account/Profile questions
  {
    intent: 'my_account',
    patterns: [
      /(mon|ma).*(compte|profil|abonnement)/i,
      /(voir|afficher|montrer).*(profil|compte)/i,
      /mes (infos|informations|données)/i,
    ],
    keywords: ['compte', 'profil', 'mes', 'infos', 'données'],
    priority: 95,
  },

  // Onboarding help
  {
    intent: 'onboarding_help',
    patterns: [
      /(finir|terminer|continuer).*(inscription|onboarding|profil)/i,
      /(étape|step|prochaine).*(inscription|profil)/i,
      /comment.*(commencer|débuter|s'inscrire)/i,
    ],
    keywords: ['inscription', 'onboarding', 'commencer', 'étape', 'débuter'],
    priority: 93,
  },

  // Profile completion
  {
    intent: 'profile_completion',
    patterns: [
      /(compléter|remplir|améliorer).*(profil)/i,
      /(profil).*(incomplet|manque|vide)/i,
      /pourcentage.*(profil)/i,
    ],
    keywords: ['compléter', 'profil', 'pourcentage', 'améliorer'],
    priority: 92,
  },

  // Pricing - very common question
  {
    intent: 'pricing',
    patterns: [
      /(combien|prix|coût|cout|tarif|cher)/i,
      /(abonnement|subscription).*(prix|coût|cout|combien)/i,
      /(gratuit|free|payant)/i,
    ],
    keywords: ['prix', 'tarif', 'coût', 'cout', 'euro', '€', 'gratuit', 'payant', 'combien'],
    priority: 90,
  },

  // Trial period
  {
    intent: 'trial',
    patterns: [
      /(période|durée).*(essai|trial)/i,
      /(essai|trial).*(gratuit|jours|mois)/i,
      /combien.*(temps|jours|mois).*(essai|gratuit)/i,
      /quand.*(fin|termine).*(essai|gratuit)/i,
    ],
    keywords: ['essai', 'trial', 'tester', 'test', 'gratuit'],
    priority: 88,
  },

  // Subscription management
  {
    intent: 'subscription',
    patterns: [
      /(gérer|annuler|modifier|changer).*(abonnement|subscription)/i,
      /(abonnement|subscription).*(gérer|annuler|modifier)/i,
      /désabonner|unsubscribe|résilier/i,
    ],
    keywords: ['abonnement', 'subscription', 'résilier', 'annuler', 'facturation'],
    priority: 85,
  },

  // Referral program
  {
    intent: 'referral',
    patterns: [
      /(parrain|référ|invite|invit)/i,
      /(code|lien).*(parrain|invit)/i,
      /gagner.*(mois|gratuit)/i,
      /(mon|avoir).*(code|parrain)/i,
    ],
    keywords: ['parrainage', 'parrain', 'inviter', 'référer', 'code', 'bonus', 'filleul'],
    priority: 80,
  },

  // Applications (for owners)
  {
    intent: 'applications',
    patterns: [
      /(candidature|application|demande).*(reçu|nouvelle|voir)/i,
      /(voir|gérer).*(candidature|application)/i,
      /qui.*(postulé|candidat)/i,
    ],
    keywords: ['candidature', 'candidat', 'application', 'postulé', 'demande'],
    priority: 78,
  },

  // Roommates (for residents/searchers)
  {
    intent: 'roommates',
    patterns: [
      /(coloc|colocataire|roommate)/i,
      /(mes|voir|trouver).*(coloc|colocataire)/i,
      /avec qui.*(habite|vit)/i,
    ],
    keywords: ['colocataire', 'coloc', 'roommate', 'cohabitation'],
    priority: 76,
  },

  // Matching system
  {
    intent: 'matching',
    patterns: [
      /(matching|compatibilité|score)/i,
      /(comment|pourquoi).*(match|compatible)/i,
      /(trouver|chercher).*(colocataire|coloc)/i,
    ],
    keywords: ['matching', 'compatibilité', 'personnalité', 'préférences', 'score'],
    priority: 75,
  },

  // Property management
  {
    intent: 'property',
    patterns: [
      /(ajouter|créer|publier).*(propriété|annonce|logement)/i,
      /(propriété|annonce|logement).*(ajouter|créer|publier)/i,
      /comment.*(mettre|poster).*(annonce)/i,
      /(mes|voir).*(propriété|annonce|logement)/i,
    ],
    keywords: ['propriété', 'annonce', 'logement', 'appartement', 'chambre', 'louer'],
    priority: 70,
  },

  // Search/Find housing
  {
    intent: 'search',
    patterns: [
      /(chercher|trouver|rechercher).*(coloc|logement|chambre)/i,
      /(filtre|critère).*(recherche)/i,
      /comment.*(recherche|chercher)/i,
    ],
    keywords: ['chercher', 'recherche', 'trouver', 'filtre', 'critère'],
    priority: 70,
  },

  // Finances/Expenses
  {
    intent: 'finances',
    patterns: [
      /(dépense|expense|facture|ticket)/i,
      /(partager|diviser).*(frais|dépense)/i,
      /(scanner|photo).*(ticket|reçu|facture)/i,
    ],
    keywords: ['dépense', 'finances', 'partager', 'scanner', 'ticket', 'facture'],
    priority: 65,
  },

  // Messaging
  {
    intent: 'messaging',
    patterns: [
      /(message|contacter|écrire|envoyer)/i,
      /(messagerie|chat|conversation)/i,
      /(mes|voir).*(message)/i,
    ],
    keywords: ['message', 'contacter', 'écrire', 'messagerie', 'chat'],
    priority: 60,
  },

  // Verification
  {
    intent: 'verification',
    patterns: [
      /(vérif|verif).*(profil|identité|compte)/i,
      /(profil|compte).*(vérif|verif)/i,
      /badge|certifié/i,
    ],
    keywords: ['vérification', 'vérifier', 'badge', 'certifié', 'identité'],
    priority: 55,
  },

  // Navigation help
  {
    intent: 'navigation',
    patterns: [
      /(où|comment).*(trouver|aller|accéder)/i,
      /(page|section|menu).*(trouver|où)/i,
      /emmène-moi|redirige|va vers/i,
    ],
    keywords: ['où', 'page', 'menu', 'aller', 'accéder', 'trouver'],
    priority: 50,
  },

  // General help
  {
    intent: 'help',
    patterns: [
      /(aide|help|besoin d'aide)/i, // Explicit help requests
      /(j'ai (besoin|un problème)|peux-tu m'aider)/i, // Need help
      /ne (comprends|sais|trouve) pas/i, // Confusion
      /^(qu'est-ce que|c'est quoi) (?!izzico)/i, // "c'est quoi X" (but not "c'est quoi izzico")
      /comment (faire|puis-je|je peux)/i, // "comment faire X" (action-oriented help)
    ],
    keywords: ['aide', 'help', 'problème', 'question', 'besoin'],
    priority: 40,
  },

  // =====================================================
  // NEW INTENTS - Extended coverage
  // =====================================================

  // Notifications
  {
    intent: 'notifications',
    patterns: [
      /(notif|notification|alertes?)/i,
      /(activer|désactiver|configurer).*(notif|alerte)/i,
      /(recevoir|envoyer).*(notif|alerte|email)/i,
      /je (reçois|ne reçois).*(notif|email|sms)/i,
    ],
    keywords: ['notification', 'alerte', 'email', 'sms', 'push', 'recevoir'],
    priority: 65,
  },

  // Security
  {
    intent: 'security',
    patterns: [
      /(sécurité|securite|mot de passe|password)/i,
      /(changer|modifier|réinitialiser).*(mot de passe|password)/i,
      /(connexion|login).*(problème|sécurisée)/i,
      /double (authentification|auth|facteur)/i,
      /(2fa|mfa|authentification)/i,
    ],
    keywords: ['sécurité', 'mot de passe', 'password', 'connexion', '2fa', 'authentification', 'piraté'],
    priority: 85,
  },

  // Payment
  {
    intent: 'payment',
    patterns: [
      /(paiement|payer|carte|bancaire|facture)/i,
      /(ajouter|modifier|changer).*(carte|paiement)/i,
      /(problème|erreur).*(paiement|carte)/i,
      /remboursement/i,
    ],
    keywords: ['paiement', 'payer', 'carte', 'bancaire', 'facture', 'visa', 'mastercard', 'remboursement'],
    priority: 82,
  },

  // Calendar/Events
  {
    intent: 'calendar',
    patterns: [
      /(calendrier|agenda|rdv|rendez-vous|visite)/i,
      /(planifier|programmer|réserver).*(visite|rdv)/i,
      /quand.*(disponible|visite)/i,
    ],
    keywords: ['calendrier', 'visite', 'rdv', 'rendez-vous', 'planifier', 'disponibilité'],
    priority: 60,
  },

  // Documents
  {
    intent: 'documents',
    patterns: [
      /(document|justificatif|pièce|attestation|facture)/i,
      /(télécharger|upload|envoyer).*(document|pièce)/i,
      /(où|comment).*(document|justificatif)/i,
    ],
    keywords: ['document', 'justificatif', 'pièce', 'attestation', 'facture', 'télécharger', 'upload'],
    priority: 55,
  },

  // Support/Contact - HIGH PRIORITY for escalation detection
  {
    intent: 'support',
    patterns: [
      /(support|contact|contacter|équipe|service client)/i,
      /(parler|écrire).*(humain|quelqu'un|personne|agent|support)/i,
      /(pas|ne).*(résolu|aidé|compris|comprend|fonctionne)/i,
      /escalader|réclamation/i,
      /(chatbot|bot|robot|ia|assistant).*(ne|pas).*(compren|résou|aide)/i,
      /(besoin|vouloir|voudrais).*(humain|aide|vraie|réel)/i,
    ],
    keywords: ['support', 'contact', 'équipe', 'humain', 'aide', 'réclamation', 'problème', 'escalade', 'agent'],
    priority: 68, // Higher than messaging (65) to catch escalation requests
  },

  // Tips/Advice
  {
    intent: 'tips',
    patterns: [
      /(conseil|astuce|recommandation|tip)/i,
      /(comment|meilleur).*(trouver|réussir|optimiser)/i,
      /bonnes pratiques/i,
    ],
    keywords: ['conseil', 'astuce', 'recommandation', 'meilleur', 'optimiser', 'réussir'],
    priority: 38,
  },

  // Feedback
  {
    intent: 'feedback',
    patterns: [
      /(feedback|avis|suggestion|amélioration)/i,
      /(donner|laisser).*(avis|feedback)/i,
      /(j'aime|je n'aime).*(pas|bien)/i,
    ],
    keywords: ['feedback', 'avis', 'suggestion', 'amélioration', 'opinion'],
    priority: 35,
  },

  // Settings
  {
    intent: 'settings',
    patterns: [
      /(paramètres?|réglages?|config|préférences?)/i,
      /(changer|modifier).*(paramètre|préférence)/i,
      /où.*(paramètres|réglages)/i,
    ],
    keywords: ['paramètres', 'réglages', 'configuration', 'préférences', 'options'],
    priority: 50,
  },

  // Privacy
  {
    intent: 'privacy',
    patterns: [
      /(confidentialité|vie privée|rgpd|données personnelles)/i,
      /(mes|voir|télécharger).*(données)/i,
      /qui (voit|peut voir|accès)/i,
    ],
    keywords: ['confidentialité', 'privé', 'rgpd', 'données', 'personnel', 'vie privée'],
    priority: 52,
  },

  // Delete Account
  {
    intent: 'delete_account',
    patterns: [
      /(supprimer|effacer|fermer).*(compte|profil)/i,
      /(compte|profil).*(supprimer|effacer)/i,
      /me désinscrire/i,
    ],
    keywords: ['supprimer', 'effacer', 'fermer', 'désinscrire', 'quitter'],
    priority: 48,
  },

  // Language
  {
    intent: 'language',
    patterns: [
      /(langue|language|anglais|français|néerlandais)/i,
      /(changer|modifier).*(langue)/i,
      /in (english|french|dutch)/i,
    ],
    keywords: ['langue', 'anglais', 'français', 'néerlandais', 'english', 'french'],
    priority: 42,
  },

  // Mobile App
  {
    intent: 'mobile_app',
    patterns: [
      /(app|application).*(mobile|téléphone|android|iphone|ios)/i,
      /(télécharger|installer).*(app)/i,
      /version (mobile|app)/i,
    ],
    keywords: ['app', 'mobile', 'android', 'iphone', 'ios', 'télécharger', 'installer'],
    priority: 43,
  },

  // Bug Report
  {
    intent: 'bug_report',
    patterns: [
      /(bug|bogue|erreur|planté|crash|ne (fonctionne|marche) (pas|plus))/i,
      /ça (ne marche|bug|plante)/i,
      /problème technique/i,
    ],
    keywords: ['bug', 'erreur', 'problème', 'crash', 'planté', 'marche pas'],
    priority: 70,
  },

  // Feature Request
  {
    intent: 'feature_request',
    patterns: [
      /(ce serait bien|j'aimerais|pourquoi pas|vous devriez)/i,
      /(ajouter|implémenter).*(fonctionnalité|option)/i,
      /il manque/i,
    ],
    keywords: ['fonctionnalité', 'ajouter', 'améliorer', 'serait bien', 'manque'],
    priority: 32,
  },

  // How It Works
  {
    intent: 'how_it_works',
    patterns: [
      /(comment (ça|cela)? ?(marche|fonctionne))/i, // "comment ça fonctionne" or "comment fonctionne"
      /comment fonctionne (izzico|l'app|la plateforme|le site)/i, // "comment fonctionne izzico"
      /(expliquer?|comprendre).*(fonctionnement|système)/i,
      /c'est quoi (izzico|le concept)/i,
      /izzico.*(marche|fonctionne)/i, // "izzico fonctionne comment"
      /(fonctionnalités? (principales?|clés?))/i, // "fonctionnalités principales"
    ],
    keywords: ['comment', 'marche', 'fonctionne', 'concept', 'principe', 'expliquer', 'fonctionnalité'],
    priority: 48, // Higher than help (40) to take precedence
  },

  // Trust & Safety
  {
    intent: 'trust_safety',
    patterns: [
      /(confiance|sûr|arnaque|fiable|sécurisé)/i,
      /(vérifier|authentique).*(profil|annonce)/i,
      /est-ce (que c'est|sûr|fiable)/i,
    ],
    keywords: ['confiance', 'sûr', 'arnaque', 'fiable', 'vérifié', 'authentique', 'sécurité'],
    priority: 58,
  },

  // Success Stories
  {
    intent: 'success_stories',
    patterns: [
      /(témoignage|histoire|réussite|succès)/i,
      /(ça marche|fonctionné) (pour|chez)/i,
      /expérience.*(autres|utilisateurs)/i,
    ],
    keywords: ['témoignage', 'histoire', 'succès', 'réussite', 'expérience', 'avis'],
    priority: 30,
  },

  // Community
  {
    intent: 'community',
    patterns: [
      /(communauté|forum|groupe|réseau)/i,
      /(rejoindre|participer).*(communauté|groupe)/i,
      /autres (utilisateurs|membres)/i,
    ],
    keywords: ['communauté', 'forum', 'groupe', 'réseau', 'membres', 'social'],
    priority: 28,
  },

  // Events
  {
    intent: 'events',
    patterns: [
      /(événement|event|rencontre|meetup|soirée)/i,
      /(prochain|à venir).*(événement|rencontre)/i,
      /organiser.*(événement|rencontre)/i,
    ],
    keywords: ['événement', 'event', 'rencontre', 'meetup', 'soirée', 'activité'],
    priority: 26,
  },

  // Moving/Déménagement
  {
    intent: 'moving',
    patterns: [
      /(déménag|emménag|changer de logement)/i,
      /(quitter|partir).*(coloc|logement)/i,
      /nouveau logement/i,
    ],
    keywords: ['déménager', 'emménager', 'déménagement', 'changer', 'quitter', 'partir'],
    priority: 45,
  },

  // Lease/Bail
  {
    intent: 'lease',
    patterns: [
      /(bail|contrat|location|loyer)/i,
      /(signer|résilier).*(bail|contrat)/i,
      /durée.*(bail|contrat)/i,
    ],
    keywords: ['bail', 'contrat', 'location', 'loyer', 'signer', 'résilier'],
    priority: 47,
  },

  // Insurance
  {
    intent: 'insurance',
    patterns: [
      /(assurance|assuré|couverture|sinistre)/i,
      /assurance.*(locataire|habitation)/i,
      /(dégât|dommage).*(couvert)/i,
    ],
    keywords: ['assurance', 'assuré', 'couverture', 'sinistre', 'dégât', 'responsabilité'],
    priority: 40,
  },
];

// =====================================================
// PERSONALIZED FAQ RESPONSES
// =====================================================

const FAQ_RESPONSES: Record<Intent, (ctx: UserContext) => FAQResponse> = {
  // ─────────────────────────────────────────────────────
  // GREETING - Fully personalized with seasonal & proactive context
  // ─────────────────────────────────────────────────────
  greeting: (ctx) => {
    const greeting = getTimeBasedGreeting();
    const name = getUserName(ctx);
    const seasonal = getSeasonalContext();
    const isNewUser = !ctx.onboardingCompleted;

    let response = '';

    // Personalized greeting with seasonal touch
    if (name !== 'vous') {
      response = `${greeting} ${name} !${seasonal} 👋`;
    } else {
      response = `${greeting} !${seasonal} 👋`;
    }

    // Add context-specific welcome with variations
    if (isNewUser) {
      const welcomeVariations = [
        `Bienvenue sur IzzIco ! Je suis votre assistant personnel et je suis là pour vous guider.`,
        `Bienvenue parmi nous ! Je suis là pour rendre votre expérience IzzIco la plus fluide possible.`,
        `Super de vous avoir sur IzzIco ! Je suis votre guide personnalisé, posez-moi toutes vos questions.`,
      ];
      response += `\n\n${pickRandom(welcomeVariations)}`;
      if (ctx.profileCompletionScore !== undefined && ctx.profileCompletionScore < 100) {
        response += `\n\n📊 Votre profil est complété à **${ctx.profileCompletionScore}%**. Voulez-vous que je vous aide à le finaliser ?`;
      }
    } else {
      const returnVariations = [
        `Ravi de vous revoir ! Comment puis-je vous aider aujourd'hui ?`,
        `Content de vous retrouver ! Qu'est-ce qui vous amène ?`,
        `Re-bonjour ! Une question ou juste envie de discuter ?`,
        `Vous revoilà ! Que puis-je faire pour vous ?`,
      ];
      response += `\n\n${pickRandom(returnVariations)}`;
    }

    // Add encouraging message based on activity
    const encouragement = getEncouragingMessage(ctx);
    if (encouragement && Math.random() > 0.5) {
      response += `\n\n${encouragement}`;
    }

    // Add user-type specific info
    if (ctx.userType === 'owner') {
      if (ctx.applicationsCount && ctx.applicationsCount > 0) {
        const appVariations = [
          `📬 Vous avez **${ctx.applicationsCount} candidature${ctx.applicationsCount > 1 ? 's' : ''}** en attente.`,
          `📬 **${ctx.applicationsCount}** personne${ctx.applicationsCount > 1 ? 's' : ''} ${ctx.applicationsCount > 1 ? 'attendent' : 'attend'} votre réponse !`,
          `📬 Bonne nouvelle : **${ctx.applicationsCount} candidature${ctx.applicationsCount > 1 ? 's' : ''}** à consulter.`,
        ];
        response += `\n\n${pickRandom(appVariations)}`;
      }
      if (ctx.propertiesCount === 0) {
        response += `\n\n🏠 Vous n'avez pas encore de propriété. Voulez-vous en ajouter une ?`;
      }
    } else if (ctx.userType === 'searcher') {
      if (ctx.matchesCount && ctx.matchesCount > 0) {
        const matchVariations = [
          `🎯 Vous avez **${ctx.matchesCount} match${ctx.matchesCount > 1 ? 's' : ''}** à découvrir !`,
          `🎯 **${ctx.matchesCount}** colocation${ctx.matchesCount > 1 ? 's correspondent' : ' correspond'} à votre profil !`,
          `🎯 Nouvelle${ctx.matchesCount > 1 ? 's' : ''} correspondance${ctx.matchesCount > 1 ? 's' : ''} : **${ctx.matchesCount} match${ctx.matchesCount > 1 ? 's' : ''}** !`,
        ];
        response += `\n\n${pickRandom(matchVariations)}`;
      }
      if (ctx.favoritesCount && ctx.favoritesCount > 0) {
        response += `\n\n💜 ${ctx.favoritesCount} annonce${ctx.favoritesCount > 1 ? 's' : ''} dans vos favoris.`;
      }
    } else if (ctx.userType === 'resident' && ctx.currentPropertyName) {
      const residentVariations = [
        `🏠 Comment ça se passe à "${ctx.currentPropertyName}" ?`,
        `🏠 Tout roule à "${ctx.currentPropertyName}" ?`,
        `🏠 Du nouveau à "${ctx.currentPropertyName}" ?`,
      ];
      response += `\n\n${pickRandom(residentVariations)}`;
    }

    // Unread messages notification
    if (ctx.unreadMessagesCount && ctx.unreadMessagesCount > 0) {
      response += `\n\n💬 Vous avez **${ctx.unreadMessagesCount} message${ctx.unreadMessagesCount > 1 ? 's' : ''} non lu${ctx.unreadMessagesCount > 1 ? 's' : ''}**.`;
    }

    // Proactive recommendation
    const proactiveReco = getProactiveRecommendation(ctx);

    // Suggested topics
    response += `\n\n**Je peux vous aider avec :**\n`;

    if (ctx.userType === 'owner') {
      response += `• 🏠 Gérer vos propriétés\n• 📋 Voir les candidatures\n• 💰 Tarifs et abonnement\n• 🎁 Parrainage`;
    } else if (ctx.userType === 'searcher') {
      response += `• 🔍 Trouver une colocation\n• 🎯 Comprendre le matching\n• 💰 Tarifs et abonnement\n• 🎁 Parrainage`;
    } else if (ctx.userType === 'resident') {
      response += `• 💰 Gérer les finances partagées\n• 👥 Mes colocataires\n• 💬 Messages\n• 🎁 Parrainage`;
    } else {
      response += `• 💰 Les tarifs et abonnements\n• 🎁 Le programme de parrainage\n• 🔍 La recherche de colocation\n• 🏠 Publier une annonce`;
    }

    // Build suggested actions
    const suggestedActions: FAQResponse['suggestedActions'] = [];

    // Priority 1: Proactive recommendation action
    if (proactiveReco?.action) {
      suggestedActions.push({
        type: 'navigate',
        label: proactiveReco.action.label,
        value: proactiveReco.action.value,
      });
    }

    // Priority 2: Unread messages
    if (ctx.unreadMessagesCount && ctx.unreadMessagesCount > 0) {
      suggestedActions.push({ type: 'navigate', label: 'Voir mes messages', value: '/messages' });
    }

    // Priority 3: Profile completion
    if (ctx.profileCompletionScore !== undefined && ctx.profileCompletionScore < 80 && !ctx.onboardingCompleted) {
      suggestedActions.push({ type: 'navigate', label: 'Compléter mon profil', value: '/onboarding' });
    }

    return {
      intent: 'greeting',
      response,
      confidence: 1.0,
      suggestedActions: suggestedActions.length > 0 ? suggestedActions.slice(0, 3) : undefined,
    };
  },

  // ─────────────────────────────────────────────────────
  // GOODBYE - Personalized farewell with variations
  // ─────────────────────────────────────────────────────
  goodbye: (ctx) => {
    const name = getUserName(ctx);
    const seasonal = getSeasonalContext();
    let response = '';

    // Farewell variations
    const farewellVariations = name !== 'vous'
      ? [
          `Au revoir ${name} !${seasonal} 👋`,
          `À bientôt ${name} !${seasonal} 👋`,
          `Bonne continuation ${name} !${seasonal} 👋`,
          `À très vite ${name} !${seasonal} 👋`,
        ]
      : [
          `Au revoir !${seasonal} 👋`,
          `À bientôt !${seasonal} 👋`,
          `Bonne continuation !${seasonal} 👋`,
          `À très vite !${seasonal} 👋`,
        ];

    response = pickRandom(farewellVariations);

    // Add personalized note based on context
    if (ctx.userType === 'searcher' && !ctx.onboardingCompleted) {
      const searcherTips = [
        `N'oubliez pas de terminer votre profil pour maximiser vos chances de trouver la coloc idéale !`,
        `Pensez à compléter votre profil, ça augmente vraiment vos chances !`,
        `Un profil complet = plus de matchs. À méditer ! 😉`,
      ];
      response += `\n\n${pickRandom(searcherTips)}`;
    } else if (ctx.userType === 'owner' && ctx.applicationsCount && ctx.applicationsCount > 0) {
      response += `\n\nVous avez ${ctx.applicationsCount} candidature${ctx.applicationsCount > 1 ? 's' : ''} en attente. Pensez à les consulter !`;
    } else {
      response += `\n\nÀ bientôt sur IzzIco !`;
    }

    return {
      intent: 'goodbye',
      response,
      confidence: 1.0,
    };
  },

  // ─────────────────────────────────────────────────────
  // MY ACCOUNT - Personalized account summary
  // ─────────────────────────────────────────────────────
  my_account: (ctx) => {
    const name = getUserName(ctx);
    let response = `📋 **Votre compte${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    // Account type
    response += `**Type de compte :** ${getUserTypeLabel(ctx).charAt(0).toUpperCase() + getUserTypeLabel(ctx).slice(1)}\n`;

    // Profile completion
    if (ctx.profileCompletionScore !== undefined) {
      const progressBar = '█'.repeat(Math.floor(ctx.profileCompletionScore / 10)) + '░'.repeat(10 - Math.floor(ctx.profileCompletionScore / 10));
      response += `**Profil :** ${progressBar} ${ctx.profileCompletionScore}%\n`;
    }

    // Subscription status
    if (ctx.subscriptionStatus) {
      const statusEmoji = ctx.subscriptionStatus === 'active' ? '✅' : ctx.subscriptionStatus === 'trial' ? '🎁' : '⚠️';
      response += `**Abonnement :** ${statusEmoji} `;
      if (ctx.subscriptionStatus === 'trial' && ctx.trialDaysRemaining) {
        response += `Essai gratuit (${ctx.trialDaysRemaining} jours restants)\n`;
      } else if (ctx.subscriptionStatus === 'active') {
        response += `Actif${ctx.isPremium ? ' (Premium)' : ''}\n`;
      } else {
        response += `${ctx.subscriptionStatus}\n`;
      }
    }

    // Verification status
    response += `\n**Vérifications :**\n`;
    response += `• Email : ${ctx.emailVerified ? '✅' : '❌'}\n`;
    response += `• Téléphone : ${ctx.phoneVerified ? '✅' : '❌'}\n`;
    response += `• Identité : ${ctx.idVerified ? '✅' : ctx.kycStatus === 'pending' ? '⏳' : '❌'}\n`;

    // Referral stats
    if (ctx.referralCode) {
      response += `\n**Parrainage :**\n`;
      response += `• Code : \`${ctx.referralCode}\`\n`;
      if (ctx.referralsCount !== undefined) {
        response += `• Filleuls : ${ctx.referralsCount}\n`;
      }
      if (ctx.referralCreditsMonths && ctx.referralCreditsMonths > 0) {
        response += `• Crédits : ${ctx.referralCreditsMonths} mois 🎁\n`;
      }
    }

    // Type-specific stats
    if (ctx.userType === 'owner') {
      response += `\n**Statistiques propriétaire :**\n`;
      response += `• Propriétés : ${ctx.propertiesCount || 0} (${ctx.publishedPropertiesCount || 0} publiées)\n`;
      response += `• Candidatures : ${ctx.applicationsCount || 0}\n`;
    } else if (ctx.userType === 'searcher' || ctx.userType === 'resident') {
      response += `\n**Activité :**\n`;
      if (ctx.favoritesCount !== undefined) response += `• Favoris : ${ctx.favoritesCount}\n`;
      if (ctx.savedSearchesCount !== undefined) response += `• Recherches sauvées : ${ctx.savedSearchesCount}\n`;
      if (ctx.matchesCount !== undefined) response += `• Matchs : ${ctx.matchesCount}\n`;
    }

    const suggestedActions: FAQResponse['suggestedActions'] = [
      { type: 'navigate', label: 'Mon profil', value: '/profile' },
    ];

    if (ctx.profileCompletionScore !== undefined && ctx.profileCompletionScore < 100) {
      suggestedActions.push({ type: 'navigate', label: 'Compléter mon profil', value: '/onboarding' });
    }

    return {
      intent: 'my_account',
      response,
      confidence: 0.95,
      suggestedActions,
    };
  },

  // ─────────────────────────────────────────────────────
  // ONBOARDING HELP - Guide based on current step
  // ─────────────────────────────────────────────────────
  onboarding_help: (ctx) => {
    const name = getUserName(ctx);

    if (ctx.onboardingCompleted) {
      return {
        intent: 'onboarding_help',
        response: `${name !== 'vous' ? `${name}, v` : 'V'}otre inscription est déjà terminée ! ✅\n\nVotre profil est complet${ctx.profileCompletionScore ? ` à ${ctx.profileCompletionScore}%` : ''}.\n\nVoulez-vous que je vous aide avec autre chose ?`,
        confidence: 0.95,
        suggestedActions: [{ type: 'navigate', label: 'Voir mon profil', value: '/profile' }],
      };
    }

    let response = `📋 **Votre inscription${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    if (ctx.profileCompletionScore !== undefined) {
      response += `Vous êtes à **${ctx.profileCompletionScore}%** de votre inscription.\n\n`;
    }

    // Guide based on user type
    if (ctx.userType === 'owner') {
      response += `**Prochaines étapes pour les propriétaires :**\n`;
      response += `1. ✅ Créer votre compte\n`;
      response += `2. ${ctx.profileCompletionScore && ctx.profileCompletionScore >= 50 ? '✅' : '⏳'} Compléter votre profil\n`;
      response += `3. ${ctx.propertiesCount && ctx.propertiesCount > 0 ? '✅' : '⏳'} Ajouter votre première propriété\n`;
      response += `4. ⏳ Publier votre annonce\n`;
      response += `5. ⏳ Recevoir vos premières candidatures\n`;
    } else if (ctx.userType === 'searcher') {
      response += `**Prochaines étapes pour trouver votre coloc :**\n`;
      response += `1. ✅ Créer votre compte\n`;
      response += `2. ${ctx.profileCompletionScore && ctx.profileCompletionScore >= 30 ? '✅' : '⏳'} Renseigner vos infos de base\n`;
      response += `3. ${ctx.profileCompletionScore && ctx.profileCompletionScore >= 60 ? '✅' : '⏳'} Compléter votre personnalité (pour le matching)\n`;
      response += `4. ${ctx.profileCompletionScore && ctx.profileCompletionScore >= 80 ? '✅' : '⏳'} Définir vos préférences de logement\n`;
      response += `5. ⏳ Commencer à explorer les annonces\n`;
    } else {
      response += `**Prochaines étapes :**\n`;
      response += `1. Compléter vos informations personnelles\n`;
      response += `2. Définir vos préférences\n`;
      response += `3. Explorer les fonctionnalités\n`;
    }

    if (ctx.onboardingStep) {
      response += `\n\n📍 **Étape actuelle :** ${ctx.onboardingStep}`;
    }

    response += `\n\n💡 Un profil complet augmente vos chances de succès de 80% !`;

    return {
      intent: 'onboarding_help',
      response,
      confidence: 0.95,
      suggestedActions: [
        { type: 'navigate', label: 'Continuer l\'inscription', value: '/onboarding' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // PROFILE COMPLETION - Encourage profile completion
  // ─────────────────────────────────────────────────────
  profile_completion: (ctx) => {
    const name = getUserName(ctx);
    const score = ctx.profileCompletionScore || 0;

    let response = `📊 **Votre profil${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    // Progress visualization
    const progressBar = '█'.repeat(Math.floor(score / 10)) + '░'.repeat(10 - Math.floor(score / 10));
    response += `**Progression :** ${progressBar} **${score}%**\n\n`;

    if (score === 100) {
      response += `🎉 **Félicitations !** Votre profil est complet !\n\n`;
      response += `Vous maximisez vos chances de matching et de visibilité sur la plateforme.`;
    } else if (score >= 80) {
      response += `💪 **Excellent !** Vous y êtes presque !\n\n`;
      response += `Quelques informations manquantes pour un profil parfait. Un profil à 100% est 3x plus visible !`;
    } else if (score >= 50) {
      response += `👍 **Bon début !** Continuez sur cette lancée.\n\n`;
      response += `Les profils complets reçoivent en moyenne 5x plus de matchs !`;
    } else {
      response += `📝 **Commencez à remplir votre profil**\n\n`;
      response += `Plus votre profil est complet, meilleures sont vos chances de trouver la colocation idéale.`;
    }

    // What's missing based on user type
    response += `\n\n**Ce qui compte le plus :**\n`;
    if (ctx.userType === 'searcher' || ctx.userType === 'resident') {
      response += `• Photo de profil (confiance +40%)\n`;
      response += `• Habitudes de vie (matching précis)\n`;
      response += `• Bio personnalisée (attirer les bons profils)\n`;
      response += `• Vérification téléphone (badge de confiance)`;
    } else if (ctx.userType === 'owner') {
      response += `• Photo professionnelle\n`;
      response += `• Vérification d'identité\n`;
      response += `• Description de vos attentes\n`;
      response += `• Politique locataire claire`;
    }

    return {
      intent: 'profile_completion',
      response,
      confidence: 0.95,
      suggestedActions: [
        { type: 'navigate', label: 'Compléter mon profil', value: '/profile/edit' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // PRICING - Personalized based on user type
  // ─────────────────────────────────────────────────────
  pricing: (ctx) => {
    const name = getUserName(ctx);
    const userType = ctx.userType;

    let response = `💰 **Tarifs IzzIco${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    // Show relevant pricing first based on user type
    if (userType === 'owner') {
      response += `**Pour vous en tant que propriétaire :**\n`;
      response += `• **15,99 €/mois** ou **159,90 €/an** (-17%)\n`;
      response += `• Essai gratuit : **3 mois**\n\n`;
      response += `_Pour les résidents : 7,99 €/mois_\n`;
    } else if (userType === 'resident' || userType === 'searcher') {
      response += `**Pour vous en tant que ${userType === 'resident' ? 'résident' : 'chercheur'} :**\n`;
      response += `• **7,99 €/mois** ou **79,90 €/an** (-17%)\n`;
      response += `• Essai gratuit : **6 mois**\n\n`;
      response += `_Pour les propriétaires : 15,99 €/mois_\n`;
    } else {
      response += `**Pour les Propriétaires :**\n`;
      response += `• 15,99 €/mois ou 159,90 €/an (-17%)\n`;
      response += `• Essai gratuit : 3 mois\n\n`;
      response += `**Pour les Résidents/Chercheurs :**\n`;
      response += `• 7,99 €/mois ou 79,90 €/an (-17%)\n`;
      response += `• Essai gratuit : 6 mois\n`;
    }

    // Current status if applicable
    const statusMsg = getSubscriptionStatusMessage(ctx);
    if (statusMsg) {
      response += `\n**Votre situation :** ${statusMsg}`;
    }

    // Referral bonus
    response += `\n\n🎁 **Astuce parrainage :** Gagnez jusqu'à **24 mois gratuits** en invitant vos amis !`;
    if (ctx.referralCode) {
      response += `\nVotre code : \`${ctx.referralCode}\``;
    }

    return {
      intent: 'pricing',
      response,
      confidence: 0.95,
      suggestedActions: [
        { type: 'navigate', label: 'Voir mon abonnement', value: '/settings/subscription' },
        { type: 'explain', label: 'Programme parrainage', value: 'referral' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // TRIAL - Show personalized trial info
  // ─────────────────────────────────────────────────────
  trial: (ctx) => {
    const name = getUserName(ctx);
    let response = `🎁 **Période d'essai${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    // Show user's specific trial status
    if (ctx.subscriptionStatus === 'trial' && ctx.trialDaysRemaining !== undefined) {
      if (ctx.trialDaysRemaining > 30) {
        const months = Math.floor(ctx.trialDaysRemaining / 30);
        response += `✨ **Votre essai gratuit est actif !**\n`;
        response += `Il vous reste environ **${months} mois** (${ctx.trialDaysRemaining} jours).\n\n`;
        response += `Profitez de toutes les fonctionnalités premium sans aucun engagement.\n`;
      } else if (ctx.trialDaysRemaining > 7) {
        response += `⏰ **Votre essai gratuit se termine dans ${ctx.trialDaysRemaining} jours.**\n\n`;
        response += `Pensez à souscrire un abonnement ou à utiliser le parrainage pour prolonger gratuitement !`;
      } else if (ctx.trialDaysRemaining > 0) {
        response += `⚠️ **Attention !** Votre essai se termine dans **${ctx.trialDaysRemaining} jour${ctx.trialDaysRemaining > 1 ? 's' : ''}**.\n\n`;
        response += `Pour continuer à utiliser IzzIco :\n`;
        response += `• Souscrivez un abonnement\n`;
        response += `• Ou parrainez des amis pour gagner des mois gratuits`;
      } else {
        response += `❌ **Votre période d'essai est terminée.**\n\n`;
        response += `Abonnez-vous pour continuer à profiter d'IzzIco !`;
      }
    } else if (ctx.subscriptionStatus === 'active') {
      response += `Vous êtes déjà abonné ! 🎉\n\n`;
      response += `Votre abonnement est actif, vous avez accès à toutes les fonctionnalités.`;
    } else {
      // Generic info
      const trialMonths = ctx.userType === 'owner' ? 3 : 6;
      response += `**Durée de l'essai gratuit :**\n`;
      response += `• Propriétaires : **3 mois**\n`;
      response += `• Résidents/Chercheurs : **6 mois**\n\n`;

      if (ctx.userType && ctx.userType !== 'unknown') {
        response += `En tant que ${getUserTypeLabel(ctx)}, vous bénéficiez de **${trialMonths} mois gratuits** !\n`;
      }

      response += `\nPendant l'essai, accès illimité à toutes les fonctionnalités.`;
    }

    // Referral tip
    response += getReferralEncouragement(ctx);

    return {
      intent: 'trial',
      response,
      confidence: 0.95,
      suggestedActions: [
        { type: 'navigate', label: 'Mon abonnement', value: '/settings/subscription' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // SUBSCRIPTION - Personalized subscription management
  // ─────────────────────────────────────────────────────
  subscription: (ctx) => {
    const name = getUserName(ctx);
    let response = `⚙️ **Votre abonnement${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    // Show current status
    if (ctx.subscriptionStatus === 'active') {
      response += `✅ **Statut :** Abonnement actif${ctx.isPremium ? ' (Premium)' : ''}\n`;
      if (ctx.subscriptionEndDate) {
        response += `📅 **Prochain renouvellement :** ${new Date(ctx.subscriptionEndDate).toLocaleDateString('fr-FR')}\n`;
      }
    } else if (ctx.subscriptionStatus === 'trial') {
      response += `🎁 **Statut :** Période d'essai\n`;
      if (ctx.trialDaysRemaining !== undefined) {
        response += `⏰ **Jours restants :** ${ctx.trialDaysRemaining}\n`;
      }
    } else if (ctx.subscriptionStatus === 'expired') {
      response += `⚠️ **Statut :** Abonnement expiré\n`;
      response += `Réactivez votre abonnement pour continuer à utiliser IzzIco.\n`;
    } else if (ctx.subscriptionStatus === 'cancelled') {
      response += `❌ **Statut :** Abonnement annulé\n`;
    }

    // Referral credits
    if (ctx.referralCreditsMonths && ctx.referralCreditsMonths > 0) {
      response += `\n🎁 **Crédits parrainage :** ${ctx.referralCreditsMonths} mois gratuits disponibles !\n`;
    }

    response += `\n**Actions disponibles :**\n`;
    response += `• Modifier votre formule\n`;
    response += `• Voir l'historique de facturation\n`;
    response += `• Annuler l'abonnement (accès jusqu'à la fin de la période)\n`;
    response += `• Télécharger vos factures`;

    return {
      intent: 'subscription',
      response,
      confidence: 0.95,
      suggestedActions: [
        { type: 'navigate', label: 'Gérer mon abonnement', value: '/settings/subscription' },
        { type: 'contact', label: 'Contacter le support', value: 'support@izzico.be' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // REFERRAL - Show personal code and stats
  // ─────────────────────────────────────────────────────
  referral: (ctx) => {
    const name = getUserName(ctx);
    let response = `🎁 **Programme de parrainage${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    // Show personal stats if available
    if (ctx.referralCode) {
      response += `**Votre code unique :** \`${ctx.referralCode}\`\n\n`;

      if (ctx.referralsCount !== undefined) {
        if (ctx.referralsCount > 0) {
          response += `🎉 Vous avez déjà parrainé **${ctx.referralsCount} personne${ctx.referralsCount > 1 ? 's' : ''}** !\n`;
        } else {
          response += `📢 Vous n'avez pas encore de filleuls. Partagez votre code !\n`;
        }
      }

      if (ctx.referralCreditsMonths && ctx.referralCreditsMonths > 0) {
        response += `💰 **Crédits accumulés :** ${ctx.referralCreditsMonths} mois gratuits\n`;
      }
      response += `\n`;
    }

    // Rewards explanation
    response += `**Comment ça marche :**\n\n`;
    response += `📤 **Vous parrainez un propriétaire**\n`;
    response += `   → Vous gagnez **+3 mois** gratuits\n`;
    response += `   → Il/elle gagne **+1 mois** bonus\n\n`;
    response += `📤 **Vous parrainez un résident/chercheur**\n`;
    response += `   → Vous gagnez **+2 mois** gratuits\n`;
    response += `   → Il/elle gagne **+1 mois** bonus\n\n`;
    response += `⭐ **Maximum :** 24 mois accumulables\n`;

    // Call to action based on current status
    if (!ctx.referralsCount || ctx.referralsCount === 0) {
      response += `\n💡 **Astuce :** Partagez votre code sur les réseaux sociaux ou par email pour maximiser vos parrainages !`;
    } else if (ctx.referralsCount < 5) {
      response += `\n💡 **Continuez !** Plus que ${5 - ctx.referralsCount} parrainages pour atteindre 10 mois gratuits !`;
    }

    return {
      intent: 'referral',
      response,
      confidence: 0.95,
      suggestedActions: [
        { type: 'navigate', label: 'Mon espace parrainage', value: '/settings/referral' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // APPLICATIONS - For owners to see applications
  // ─────────────────────────────────────────────────────
  applications: (ctx) => {
    const name = getUserName(ctx);

    if (ctx.userType !== 'owner') {
      return {
        intent: 'applications',
        response: `${name !== 'vous' ? `${name}, c` : 'C'}ette fonctionnalité est réservée aux propriétaires.\n\nVous êtes actuellement inscrit${name !== 'vous' ? '' : '(e)'} en tant que ${getUserTypeLabel(ctx)}. Si vous souhaitez publier une annonce, vous pouvez passer en mode propriétaire.`,
        confidence: 0.90,
        suggestedActions: [
          { type: 'navigate', label: 'Changer de profil', value: '/settings/account' },
        ],
      };
    }

    let response = `📋 **Vos candidatures${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    if (ctx.applicationsCount && ctx.applicationsCount > 0) {
      response += `Vous avez **${ctx.applicationsCount} candidature${ctx.applicationsCount > 1 ? 's' : ''}** en attente !\n\n`;
      response += `**Actions rapides :**\n`;
      response += `• Voir toutes les candidatures\n`;
      response += `• Filtrer par propriété\n`;
      response += `• Comparer les profils avec le score de matching\n`;
      response += `• Accepter ou refuser\n`;
    } else if (ctx.propertiesCount && ctx.propertiesCount > 0) {
      response += `Aucune candidature en attente pour le moment.\n\n`;
      response += `**Conseils pour attirer plus de candidats :**\n`;
      response += `• Ajoutez des photos de qualité\n`;
      response += `• Complétez la description\n`;
      response += `• Répondez rapidement aux messages\n`;
      response += `• Vérifiez que vos annonces sont visibles`;
    } else {
      response += `Vous n'avez pas encore de propriété.\n\n`;
      response += `Ajoutez votre première propriété pour commencer à recevoir des candidatures !`;
    }

    return {
      intent: 'applications',
      response,
      confidence: 0.95,
      suggestedActions: ctx.applicationsCount && ctx.applicationsCount > 0
        ? [{ type: 'navigate', label: 'Voir les candidatures', value: '/dashboard/owner/applications' }]
        : [{ type: 'navigate', label: 'Ajouter une propriété', value: '/properties/add' }],
    };
  },

  // ─────────────────────────────────────────────────────
  // ROOMMATES - For residents
  // ─────────────────────────────────────────────────────
  roommates: (ctx) => {
    const name = getUserName(ctx);

    if (ctx.userType === 'owner') {
      return {
        intent: 'roommates',
        response: `En tant que propriétaire, vous pouvez voir les résidents de vos propriétés dans la section "Mes propriétés".\n\nVoulez-vous y accéder ?`,
        confidence: 0.90,
        suggestedActions: [
          { type: 'navigate', label: 'Mes propriétés', value: '/properties' },
        ],
      };
    }

    let response = `👥 **Colocataires${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    if (ctx.userType === 'resident' && ctx.currentPropertyName) {
      response += `🏠 **Votre colocation :** ${ctx.currentPropertyName}\n\n`;
      response += `**Fonctionnalités disponibles :**\n`;
      response += `• Voir les profils de vos colocataires\n`;
      response += `• Envoyer des messages groupés\n`;
      response += `• Partager les dépenses\n`;
      response += `• Organiser des événements\n`;
    } else if (ctx.userType === 'searcher') {
      response += `Vous n'êtes pas encore dans une colocation.\n\n`;

      if (ctx.matchesCount && ctx.matchesCount > 0) {
        response += `🎯 Bonne nouvelle ! Vous avez **${ctx.matchesCount} match${ctx.matchesCount > 1 ? 's' : ''}** à explorer.\n\n`;
      }

      response += `**Pour trouver vos futurs colocataires :**\n`;
      response += `• Explorez les annonces\n`;
      response += `• Utilisez le matching pour trouver des profils compatibles\n`;
      response += `• Envoyez des messages aux propriétaires/résidents`;
    } else {
      response += `Utilisez le système de matching pour trouver des colocataires compatibles avec votre personnalité !`;
    }

    return {
      intent: 'roommates',
      response,
      confidence: 0.90,
      suggestedActions: ctx.userType === 'resident'
        ? [{ type: 'navigate', label: 'Mon hub', value: '/hub' }]
        : [{ type: 'navigate', label: 'Rechercher', value: '/search' }],
    };
  },

  // ─────────────────────────────────────────────────────
  // MATCHING - Explain matching system
  // ─────────────────────────────────────────────────────
  matching: (ctx) => {
    const name = getUserName(ctx);
    let response = `🎯 **Système de Matching${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    // Show personal matching stats if available
    if (ctx.matchesCount !== undefined && ctx.matchesCount > 0) {
      response += `✨ Vous avez **${ctx.matchesCount} match${ctx.matchesCount > 1 ? 's' : ''}** en ce moment !\n\n`;
    }

    response += `Notre algorithme analyse la compatibilité selon :\n\n`;
    response += `**📊 Critères analysés :**\n`;
    response += `• Personnalité (extraverti/introverti)\n`;
    response += `• Habitudes de vie (horaires, propreté)\n`;
    response += `• Préférences (fumeur, animaux, fêtes)\n`;
    response += `• Budget et localisation\n\n`;

    // Personalized tips based on profile
    if (ctx.profileCompletionScore !== undefined && ctx.profileCompletionScore < 80) {
      response += `⚠️ **Important :** Votre profil est à ${ctx.profileCompletionScore}%. Complétez-le pour des matchs plus précis !\n\n`;
    }

    // Show user's own matching criteria if available
    if (ctx.sociabilityLevel !== undefined) {
      response += `**Votre profil :**\n`;
      response += `• Sociabilité : ${ctx.sociabilityLevel}/10\n`;
      if (ctx.isSmoker !== undefined) response += `• Fumeur : ${ctx.isSmoker ? 'Oui' : 'Non'}\n`;
      if (ctx.hasPets !== undefined) response += `• Animaux : ${ctx.hasPets ? 'Oui' : 'Non'}\n`;
      if (ctx.cleanlinessLevel) response += `• Propreté : ${ctx.cleanlinessLevel}\n`;
      response += `\n`;
    }

    response += `**Score de compatibilité :**\n`;
    response += `• 90%+ : Excellente compatibilité 🌟\n`;
    response += `• 70-89% : Bonne compatibilité ✨\n`;
    response += `• <70% : Compatibilité moyenne\n`;

    return {
      intent: 'matching',
      response,
      confidence: 0.90,
      suggestedActions: [
        { type: 'navigate', label: 'Voir mes matchs', value: '/search?tab=matches' },
        { type: 'navigate', label: 'Améliorer mon profil', value: '/profile/edit' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // PROPERTY - For owners
  // ─────────────────────────────────────────────────────
  property: (ctx) => {
    const name = getUserName(ctx);
    let response = `🏠 **Gestion de propriété${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    if (ctx.userType === 'owner') {
      // Show owner's property stats
      if (ctx.propertiesCount !== undefined && ctx.propertiesCount > 0) {
        response += `**Vos propriétés :**\n`;
        response += `• Total : ${ctx.propertiesCount}\n`;
        response += `• Publiées : ${ctx.publishedPropertiesCount || 0}\n`;
        if (ctx.applicationsCount !== undefined) {
          response += `• Candidatures en attente : ${ctx.applicationsCount}\n`;
        }
        response += `\n`;
      } else {
        response += `Vous n'avez pas encore de propriété.\n\n`;
      }

      response += `**Actions disponibles :**\n`;
      response += `• Ajouter une nouvelle propriété\n`;
      response += `• Gérer les annonces existantes\n`;
      response += `• Voir les candidatures\n`;
      response += `• Consulter les statistiques de vues\n`;
    } else {
      response += `Cette section est destinée aux propriétaires.\n\n`;
      response += `Vous souhaitez publier une annonce ? Passez en mode propriétaire dans vos paramètres.`;
    }

    return {
      intent: 'property',
      response,
      confidence: 0.90,
      suggestedActions: ctx.userType === 'owner'
        ? [
            { type: 'navigate', label: 'Mes propriétés', value: '/properties' },
            { type: 'navigate', label: 'Ajouter une propriété', value: '/properties/add' },
          ]
        : [{ type: 'navigate', label: 'Devenir propriétaire', value: '/settings/account' }],
    };
  },

  // ─────────────────────────────────────────────────────
  // SEARCH - Help with property search
  // ─────────────────────────────────────────────────────
  search: (ctx) => {
    const name = getUserName(ctx);
    let response = `🔍 **Recherche de colocation${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    // Show personalized search info
    if (ctx.preferredCity) {
      response += `📍 **Votre zone de recherche :** ${ctx.preferredCity}\n`;
    }
    if (ctx.budgetMin !== undefined && ctx.budgetMax !== undefined) {
      response += `💰 **Votre budget :** ${ctx.budgetMin}€ - ${ctx.budgetMax}€/mois\n`;
    }

    if (ctx.savedSearchesCount && ctx.savedSearchesCount > 0) {
      response += `📌 **Recherches sauvées :** ${ctx.savedSearchesCount}\n`;
    }
    if (ctx.favoritesCount && ctx.favoritesCount > 0) {
      response += `💜 **Favoris :** ${ctx.favoritesCount} annonce${ctx.favoritesCount > 1 ? 's' : ''}\n`;
    }

    response += `\n**Filtres disponibles :**\n`;
    response += `• Prix (min/max)\n`;
    response += `• Localisation (ville, quartier)\n`;
    response += `• Type de chambre (privée/partagée)\n`;
    response += `• Équipements (wifi, parking, etc.)\n`;
    response += `• Compatibilité (score de matching)\n\n`;

    response += `**💡 Conseils :**\n`;
    if (ctx.profileCompletionScore !== undefined && ctx.profileCompletionScore < 80) {
      response += `• Complétez votre profil (${ctx.profileCompletionScore}%) pour voir les scores de matching\n`;
    } else {
      response += `• Activez les alertes pour les nouvelles annonces\n`;
    }
    response += `• Utilisez la carte pour explorer les quartiers\n`;
    response += `• Sauvegardez vos recherches fréquentes`;

    return {
      intent: 'search',
      response,
      confidence: 0.90,
      suggestedActions: [
        { type: 'navigate', label: 'Rechercher', value: '/search' },
        { type: 'navigate', label: 'Mes favoris', value: '/favorites' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // FINANCES - For residents
  // ─────────────────────────────────────────────────────
  finances: (ctx) => {
    const name = getUserName(ctx);
    let response = `💰 **Finances partagées${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    if (ctx.userType === 'resident') {
      if (ctx.currentPropertyName) {
        response += `🏠 **Colocation :** ${ctx.currentPropertyName}\n\n`;
      }

      response += `**Fonctionnalités disponibles :**\n`;
      response += `• 📷 **Scanner de tickets** - Photographiez vos reçus, l'IA extrait les infos\n`;
      response += `• 📁 **Catégorisation auto** - Courses, charges, internet...\n`;
      response += `• ⚖️ **Répartition équitable** - Calcul automatique des parts\n`;
      response += `• 📊 **Historique** - Suivez toutes les dépenses\n\n`;

      response += `**Comment ajouter une dépense :**\n`;
      response += `1. Cliquez sur "+" dans la section Finances\n`;
      response += `2. Scannez un ticket ou saisissez manuellement\n`;
      response += `3. La répartition se fait automatiquement`;
    } else if (ctx.userType === 'owner') {
      response += `En tant que propriétaire, vous pouvez suivre les paiements de loyer de vos locataires.\n\n`;
      response += `Consultez la section "Mes propriétés" pour voir les détails financiers.`;
    } else {
      response += `Cette fonctionnalité sera disponible une fois que vous aurez rejoint une colocation.\n\n`;
      response += `Elle permet de gérer facilement les dépenses partagées entre colocataires.`;
    }

    return {
      intent: 'finances',
      response,
      confidence: 0.90,
      suggestedActions: ctx.userType === 'resident'
        ? [{ type: 'navigate', label: 'Mes finances', value: '/hub/finances' }]
        : [{ type: 'navigate', label: 'Rechercher une coloc', value: '/search' }],
    };
  },

  // ─────────────────────────────────────────────────────
  // MESSAGING - Personalized with unread count
  // ─────────────────────────────────────────────────────
  messaging: (ctx) => {
    const name = getUserName(ctx);
    let response = `💬 **Messagerie${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    // Show unread messages
    if (ctx.unreadMessagesCount && ctx.unreadMessagesCount > 0) {
      response += `📬 **${ctx.unreadMessagesCount} message${ctx.unreadMessagesCount > 1 ? 's' : ''} non lu${ctx.unreadMessagesCount > 1 ? 's' : ''}**\n\n`;
    }

    response += `**Fonctionnalités :**\n`;
    response += `• Conversations privées et de groupe\n`;
    response += `• Notifications en temps réel\n`;
    response += `• Partage de fichiers\n`;
    response += `• Historique complet\n\n`;

    if (ctx.userType === 'owner') {
      response += `💡 **Conseil propriétaire :** Répondez rapidement aux candidats pour augmenter votre taux de conversion !`;
    } else if (ctx.userType === 'searcher') {
      response += `💡 **Conseil :** N'hésitez pas à contacter les propriétaires pour poser vos questions avant de postuler.`;
    }

    return {
      intent: 'messaging',
      response,
      confidence: 0.90,
      suggestedActions: [
        { type: 'navigate', label: 'Mes messages', value: '/messages' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // VERIFICATION - Show user's verification status
  // ─────────────────────────────────────────────────────
  verification: (ctx) => {
    const name = getUserName(ctx);
    let response = `✅ **Vérification de profil${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    // Show current verification status
    response += `**Votre statut actuel :**\n`;
    response += `• Email : ${ctx.emailVerified ? '✅ Vérifié' : '❌ Non vérifié'}\n`;
    response += `• Téléphone : ${ctx.phoneVerified ? '✅ Vérifié' : '❌ Non vérifié'}\n`;
    response += `• Identité : ${ctx.idVerified ? '✅ Vérifié' : ctx.kycStatus === 'pending' ? '⏳ En attente' : '❌ Non vérifié'}\n\n`;

    // Count verified items
    const verifiedCount = [ctx.emailVerified, ctx.phoneVerified, ctx.idVerified].filter(Boolean).length;

    if (verifiedCount === 3) {
      response += `🎉 **Profil entièrement vérifié !**\n`;
      response += `Vous bénéficiez de la confiance maximale sur la plateforme.\n`;
    } else {
      response += `**Avantages de la vérification :**\n`;
      response += `• Badge de confiance visible\n`;
      response += `• Meilleur classement dans les recherches\n`;
      response += `• Plus de candidatures/réponses\n`;

      if (!ctx.phoneVerified) {
        response += `\n💡 **Suggestion :** Vérifiez votre téléphone pour un badge de confiance rapide !`;
      }
    }

    return {
      intent: 'verification',
      response,
      confidence: 0.85,
      suggestedActions: verifiedCount < 3
        ? [{ type: 'navigate', label: 'Vérifier mon profil', value: '/settings/verification' }]
        : [{ type: 'navigate', label: 'Mon profil', value: '/profile' }],
    };
  },

  // ─────────────────────────────────────────────────────
  // NAVIGATION - Based on user type
  // ─────────────────────────────────────────────────────
  navigation: (ctx) => {
    const name = getUserName(ctx);
    let response = `🧭 **Navigation${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    response += `**Pages principales `;

    if (ctx.userType === 'owner') {
      response += `(Propriétaire) :**\n`;
      response += `• \`/dashboard/owner\` - Tableau de bord\n`;
      response += `• \`/properties\` - Mes propriétés\n`;
      response += `• \`/applications\` - Candidatures\n`;
    } else if (ctx.userType === 'resident') {
      response += `(Résident) :**\n`;
      response += `• \`/hub\` - Mon hub\n`;
      response += `• \`/hub/finances\` - Finances partagées\n`;
      response += `• \`/hub/tasks\` - Tâches ménage\n`;
    } else {
      response += `(Chercheur) :**\n`;
      response += `• \`/search\` - Rechercher\n`;
      response += `• \`/favorites\` - Mes favoris\n`;
      response += `• \`/applications\` - Mes candidatures\n`;
    }

    response += `• \`/messages\` - Messagerie\n`;
    response += `• \`/profile\` - Mon profil\n`;
    response += `• \`/settings\` - Paramètres\n\n`;

    response += `Dites-moi où vous voulez aller et je vous y emmène !`;

    return {
      intent: 'navigation',
      response,
      confidence: 0.85,
    };
  },

  // ─────────────────────────────────────────────────────
  // HELP - Contextual help
  // ─────────────────────────────────────────────────────
  help: (ctx) => {
    const name = getUserName(ctx);
    let response = `🤝 **Comment puis-je vous aider${name !== 'vous' ? `, ${name}` : ''} ?**\n\n`;

    // Contextual suggestions based on user type and status
    if (!ctx.onboardingCompleted) {
      response += `📋 Il semble que votre inscription ne soit pas terminée.\n`;
      response += `Voulez-vous que je vous aide à la finaliser ?\n\n`;
    }

    response += `**Je peux vous renseigner sur :**\n`;

    if (ctx.userType === 'owner') {
      response += `• 🏠 **Propriétés** - Ajouter, gérer vos annonces\n`;
      response += `• 📋 **Candidatures** - Voir et gérer les demandes\n`;
      response += `• 💰 **Tarifs** - Prix et abonnement propriétaire\n`;
    } else if (ctx.userType === 'resident') {
      response += `• 💰 **Finances** - Gérer les dépenses partagées\n`;
      response += `• 👥 **Colocataires** - Voir les profils\n`;
      response += `• 🏠 **Ma coloc** - Infos sur votre logement\n`;
    } else {
      response += `• 🔍 **Recherche** - Trouver une colocation\n`;
      response += `• 🎯 **Matching** - Comprendre le système\n`;
      response += `• 📝 **Candidatures** - Postuler efficacement\n`;
    }

    response += `• 🎁 **Parrainage** - Gagner des mois gratuits\n`;
    response += `• ⚙️ **Compte** - Paramètres, abonnement\n`;
    response += `• ✅ **Vérification** - Badge de confiance\n\n`;

    response += `Posez votre question ou choisissez un sujet !`;

    return {
      intent: 'help',
      response,
      confidence: 0.80,
      suggestedActions: !ctx.onboardingCompleted
        ? [{ type: 'navigate', label: 'Terminer l\'inscription', value: '/onboarding' }]
        : undefined,
    };
  },

  // =====================================================
  // NEW INTENT RESPONSES - Extended coverage
  // =====================================================

  // ─────────────────────────────────────────────────────
  // NOTIFICATIONS - Manage alerts and notifications
  // ─────────────────────────────────────────────────────
  notifications: (ctx) => {
    const name = getUserName(ctx);
    let response = `🔔 **Notifications${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    response += `**Types de notifications disponibles :**\n`;
    response += `• 📧 **Email** - Nouveaux messages, candidatures, matchs\n`;
    response += `• 📱 **Push** - Alertes instantanées (si app mobile)\n`;
    response += `• 🔔 **In-app** - Notifications dans l'application\n\n`;

    if (ctx.userType === 'owner') {
      response += `**Alertes propriétaire :**\n`;
      response += `• Nouvelle candidature reçue\n`;
      response += `• Message d'un candidat\n`;
      response += `• Expiration prochaine d'une annonce\n`;
    } else if (ctx.userType === 'searcher') {
      response += `**Alertes chercheur :**\n`;
      response += `• Nouvelle annonce dans vos critères\n`;
      response += `• Nouveau match compatible\n`;
      response += `• Réponse à votre candidature\n`;
    } else if (ctx.userType === 'resident') {
      response += `**Alertes résident :**\n`;
      response += `• Nouvelle dépense partagée\n`;
      response += `• Message de groupe\n`;
      response += `• Rappels de tâches\n`;
    }

    response += `\n**💡 Conseil :** Personnalisez vos alertes dans les paramètres pour ne recevoir que ce qui vous intéresse.`;

    return {
      intent: 'notifications',
      response,
      confidence: 0.90,
      suggestedActions: [
        { type: 'navigate', label: 'Gérer mes notifications', value: '/dashboard/settings/preferences' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // SECURITY - Account security and password
  // ─────────────────────────────────────────────────────
  security: (ctx) => {
    const name = getUserName(ctx);
    let response = `🔐 **Sécurité du compte${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    response += `**Actions de sécurité :**\n\n`;
    response += `🔑 **Mot de passe**\n`;
    response += `• Modifier : Paramètres → Sécurité → Changer le mot de passe\n`;
    response += `• Mot de passe oublié : Cliquez "Mot de passe oublié" sur la page de connexion\n\n`;

    response += `📱 **Double authentification (2FA)**\n`;
    response += `• Recommandé pour une sécurité maximale\n`;
    response += `• Active : email de confirmation à chaque connexion\n\n`;

    response += `🛡️ **Conseils de sécurité :**\n`;
    response += `• Utilisez un mot de passe unique pour IzzIco\n`;
    response += `• Ne partagez jamais vos identifiants\n`;
    response += `• Déconnectez-vous sur les appareils partagés\n`;
    response += `• Méfiez-vous des emails suspects (phishing)\n\n`;

    if (!ctx.phoneVerified) {
      response += `⚠️ **Recommandation :** Vérifiez votre téléphone pour sécuriser la récupération de compte.`;
    }

    return {
      intent: 'security',
      response,
      confidence: 0.95,
      suggestedActions: [
        { type: 'navigate', label: 'Paramètres de sécurité', value: '/settings/security' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // PAYMENT - Billing and payment methods
  // ─────────────────────────────────────────────────────
  payment: (ctx) => {
    const name = getUserName(ctx);
    let response = `💳 **Paiement et facturation${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    // Current subscription status
    if (ctx.subscriptionStatus === 'trial') {
      response += `✨ **Vous êtes en période d'essai gratuite**\n`;
      if (ctx.trialDaysRemaining !== undefined) {
        response += `Il vous reste ${ctx.trialDaysRemaining} jours avant la fin de l'essai.\n\n`;
      }
      response += `Aucun paiement requis pour l'instant !\n\n`;
    } else if (ctx.subscriptionStatus === 'active') {
      response += `✅ **Abonnement actif**\n`;
      response += `Votre prochain paiement sera prélevé automatiquement.\n\n`;
    }

    response += `**Modes de paiement acceptés :**\n`;
    response += `• 💳 Carte bancaire (Visa, Mastercard)\n`;
    response += `• 🏦 Prélèvement SEPA\n`;
    response += `• 📱 Apple Pay / Google Pay\n\n`;

    response += `**Gestion des paiements :**\n`;
    response += `• Modifier votre carte\n`;
    response += `• Télécharger vos factures\n`;
    response += `• Voir l'historique des paiements\n\n`;

    response += `**❓ Problème de paiement ?**\n`;
    response += `• Vérifiez que votre carte est valide\n`;
    response += `• Contactez votre banque si refus répété\n`;
    response += `• Notre support est là pour vous aider`;

    return {
      intent: 'payment',
      response,
      confidence: 0.95,
      suggestedActions: [
        { type: 'navigate', label: 'Gérer mes paiements', value: '/settings/billing' },
        { type: 'contact', label: 'Contacter le support', value: 'support@izzico.be' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // CALENDAR - Visits and scheduling
  // ─────────────────────────────────────────────────────
  calendar: (ctx) => {
    const name = getUserName(ctx);
    let response = `📅 **Calendrier et visites${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    if (ctx.userType === 'owner') {
      response += `**En tant que propriétaire :**\n`;
      response += `• Définissez vos disponibilités pour les visites\n`;
      response += `• Les candidats peuvent réserver un créneau\n`;
      response += `• Recevez des rappels automatiques\n\n`;

      response += `**Conseils pour les visites :**\n`;
      response += `• Proposez plusieurs créneaux par semaine\n`;
      response += `• Confirmez les visites 24h avant\n`;
      response += `• Préparez les documents (bail, règlement...)\n`;
    } else if (ctx.userType === 'searcher') {
      response += `**Planifier une visite :**\n\n`;
      response += `1. Trouvez une annonce qui vous plaît\n`;
      response += `2. Cliquez sur "Demander une visite"\n`;
      response += `3. Choisissez un créneau disponible\n`;
      response += `4. Attendez la confirmation du propriétaire\n\n`;

      response += `**Conseils :**\n`;
      response += `• Préparez vos questions à l'avance\n`;
      response += `• Arrivez à l'heure !\n`;
      response += `• Visitez les parties communes aussi\n`;
    } else {
      response += `Le système de calendrier permet de planifier les visites de logements.\n\n`;
      response += `**Pour les propriétaires :** Définir les créneaux de visite\n`;
      response += `**Pour les chercheurs :** Réserver une visite`;
    }

    return {
      intent: 'calendar',
      response,
      confidence: 0.85,
      suggestedActions: ctx.userType === 'owner'
        ? [{ type: 'navigate', label: 'Gérer mes disponibilités', value: '/properties/calendar' }]
        : [{ type: 'navigate', label: 'Rechercher des logements', value: '/search' }],
    };
  },

  // ─────────────────────────────────────────────────────
  // DOCUMENTS - Document management
  // ─────────────────────────────────────────────────────
  documents: (ctx) => {
    const name = getUserName(ctx);
    let response = `📄 **Documents${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    if (ctx.userType === 'owner') {
      response += `**Documents propriétaire :**\n`;
      response += `• 📋 Bail type (modèle Belgique)\n`;
      response += `• 🏠 État des lieux (template)\n`;
      response += `• 📜 Règlement intérieur\n`;
      response += `• 💰 Historique des paiements\n\n`;

      response += `**Documents requis des candidats :**\n`;
      response += `• Pièce d'identité\n`;
      response += `• Attestation de revenus\n`;
      response += `• Certificat de domicile (optionnel)\n`;
    } else {
      response += `**Vos documents :**\n`;
      response += `• 🪪 Pièce d'identité (pour vérification)\n`;
      response += `• 💼 Justificatifs de revenus\n`;
      response += `• 📄 Attestations diverses\n\n`;

      response += `**Documents à télécharger :**\n`;
      response += `• Vos factures d'abonnement\n`;
      response += `• Vos données personnelles (RGPD)\n`;
    }

    response += `\n**💡 Tous vos documents sont stockés de manière sécurisée et chiffrée.**`;

    return {
      intent: 'documents',
      response,
      confidence: 0.85,
      suggestedActions: [
        { type: 'navigate', label: 'Mes documents', value: '/settings/documents' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // SUPPORT - Contact support team
  // ─────────────────────────────────────────────────────
  support: (ctx) => {
    const name = getUserName(ctx);
    let response = `💬 **Besoin d'aide${name !== 'vous' ? `, ${name}` : ''} ?**\n\n`;

    response += `Je suis là pour vous aider ! Mais si vous avez besoin de parler à notre équipe humaine, voici comment nous contacter :\n\n`;

    response += `**📧 Email :** support@izzico.be\n`;
    response += `Réponse sous 24h en jours ouvrés\n\n`;

    response += `**💬 Chat en direct :**\n`;
    response += `Disponible du lundi au vendredi, 9h-18h\n`;
    response += `Cliquez sur le bouton "Chat" en bas à droite\n\n`;

    response += `**📞 Téléphone :**\n`;
    response += `+32 2 XXX XX XX (jours ouvrés, 10h-17h)\n\n`;

    response += `**Avant de nous contacter, avez-vous essayé :**\n`;
    response += `• La FAQ (je peux vous aider !)\n`;
    response += `• Le centre d'aide dans les paramètres\n\n`;

    // Add context-specific tips
    if (!ctx.onboardingCompleted) {
      response += `💡 Je vois que votre inscription n'est pas terminée. Puis-je vous aider avec ça ?`;
    } else if (ctx.unreadMessagesCount && ctx.unreadMessagesCount > 0) {
      response += `💡 Vous avez des messages non lus, peut-être y a-t-il déjà une réponse dedans ?`;
    }

    return {
      intent: 'support',
      response,
      confidence: 0.90,
      suggestedActions: [
        { type: 'contact', label: 'Envoyer un email', value: 'mailto:support@izzico.be' },
        { type: 'navigate', label: 'Centre d\'aide', value: '/help' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // TIPS - Advice and best practices
  // ─────────────────────────────────────────────────────
  tips: (ctx) => {
    const name = getUserName(ctx);
    let response = `💡 **Conseils et astuces${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    // Personalized tips based on user type
    if (ctx.userType === 'owner') {
      response += `**🏠 Conseils pour propriétaires :**\n\n`;
      response += `📸 **Photos de qualité**\n`;
      response += `• Photos lumineuses et nettes\n`;
      response += `• Montrez chaque pièce\n`;
      response += `• Incluez les espaces communs\n\n`;

      response += `📝 **Annonce attractive**\n`;
      response += `• Description détaillée et honnête\n`;
      response += `• Mentionnez les équipements\n`;
      response += `• Indiquez la proximité des transports\n\n`;

      response += `⚡ **Réactivité**\n`;
      response += `• Répondez vite aux candidatures\n`;
      response += `• Proposez des créneaux de visite flexibles\n`;
      response += `• Donnez des réponses claires (même négatives)\n`;
    } else if (ctx.userType === 'searcher') {
      response += `**🔍 Conseils pour trouver la coloc idéale :**\n\n`;
      response += `👤 **Profil complet**\n`;
      response += `• Photo souriante et claire\n`;
      response += `• Bio authentique et personnelle\n`;
      response += `• Décrivez vos habitudes honnêtement\n\n`;

      response += `📨 **Candidature efficace**\n`;
      response += `• Personnalisez chaque message\n`;
      response += `• Présentez-vous brièvement\n`;
      response += `• Posez des questions pertinentes\n\n`;

      response += `🎯 **Utilisez le matching**\n`;
      response += `• Complétez le test de personnalité\n`;
      response += `• Faites confiance aux scores élevés\n`;
      response += `• Contactez vos matchs en priorité\n`;
    } else if (ctx.userType === 'resident') {
      response += `**🏡 Conseils pour la vie en coloc :**\n\n`;
      response += `💰 **Finances partagées**\n`;
      response += `• Scannez tous les tickets\n`;
      response += `• Régularisez vite les dettes\n`;
      response += `• Communiquez sur les grosses dépenses\n\n`;

      response += `🤝 **Bonne entente**\n`;
      response += `• Utilisez la messagerie de groupe\n`;
      response += `• Définissez les règles ensemble\n`;
      response += `• Organisez des moments conviviaux\n`;
    } else {
      response += `**Conseils généraux :**\n`;
      response += `• Complétez votre profil à 100%\n`;
      response += `• Vérifiez votre téléphone\n`;
      response += `• Utilisez le système de matching\n`;
      response += `• Soyez réactif aux messages\n`;
    }

    // Add profile-specific tip
    if (ctx.profileCompletionScore !== undefined && ctx.profileCompletionScore < 80) {
      response += `\n\n⭐ **Conseil prioritaire :** Complétez votre profil (${ctx.profileCompletionScore}%) pour 5x plus de résultats !`;
    }

    return {
      intent: 'tips',
      response,
      confidence: 0.85,
      suggestedActions: ctx.profileCompletionScore !== undefined && ctx.profileCompletionScore < 80
        ? [{ type: 'navigate', label: 'Compléter mon profil', value: '/profile/edit' }]
        : undefined,
    };
  },

  // ─────────────────────────────────────────────────────
  // FEEDBACK - Give feedback
  // ─────────────────────────────────────────────────────
  feedback: (ctx) => {
    const name = getUserName(ctx);
    let response = `📝 **Votre avis compte${name !== 'vous' ? `, ${name}` : ''} !**\n\n`;

    response += `Nous adorons recevoir vos retours pour améliorer IzzIco.\n\n`;

    response += `**Comment donner votre avis :**\n\n`;
    response += `⭐ **Note l'application**\n`;
    response += `Sur l'App Store ou Google Play\n\n`;

    response += `💬 **Suggestion d'amélioration**\n`;
    response += `Envoyez-nous un email à feedback@izzico.be\n\n`;

    response += `🐛 **Signaler un bug**\n`;
    response += `Décrivez le problème dans les paramètres\n\n`;

    response += `💡 **Idée de fonctionnalité**\n`;
    response += `Proposez vos idées, on lit tout !\n\n`;

    response += `Merci de contribuer à rendre IzzIco meilleur pour tous les utilisateurs ! 🙏`;

    return {
      intent: 'feedback',
      response,
      confidence: 0.85,
      suggestedActions: [
        { type: 'contact', label: 'Envoyer un feedback', value: 'mailto:feedback@izzico.be' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // SETTINGS - Application settings
  // ─────────────────────────────────────────────────────
  settings: (ctx) => {
    const name = getUserName(ctx);
    let response = `⚙️ **Paramètres${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    response += `**Accès aux paramètres :**\n`;
    response += `Menu → Paramètres (ou /settings)\n\n`;

    response += `**Sections disponibles :**\n`;
    response += `• 👤 **Profil** - Infos personnelles, photo\n`;
    response += `• 🔔 **Notifications** - Emails, push, alertes\n`;
    response += `• 💳 **Abonnement** - Forfait, facturation\n`;
    response += `• 🔐 **Sécurité** - Mot de passe, 2FA\n`;
    response += `• 🌐 **Langue** - Français, Nederlands, English\n`;
    response += `• 📄 **Confidentialité** - RGPD, données\n`;
    response += `• 🎁 **Parrainage** - Code, statistiques\n`;

    if (ctx.userType === 'owner') {
      response += `• 🏠 **Propriétés** - Gérer vos annonces\n`;
    }

    return {
      intent: 'settings',
      response,
      confidence: 0.90,
      suggestedActions: [
        { type: 'navigate', label: 'Ouvrir les paramètres', value: '/settings' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // PRIVACY - Privacy and data
  // ─────────────────────────────────────────────────────
  privacy: (ctx) => {
    const name = getUserName(ctx);
    let response = `🔒 **Confidentialité et données${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    response += `**Vos droits RGPD :**\n`;
    response += `• 📥 **Accès** - Téléchargez toutes vos données\n`;
    response += `• ✏️ **Rectification** - Modifiez vos informations\n`;
    response += `• 🗑️ **Effacement** - Supprimez votre compte\n`;
    response += `• 📤 **Portabilité** - Export de vos données\n\n`;

    response += `**Qui voit quoi ?**\n`;
    response += `• Profil public : Photo, prénom, bio, personnalité\n`;
    response += `• Privé : Email, téléphone, adresse complète\n`;
    response += `• Visible après match : Informations de contact\n\n`;

    response += `**Nos engagements :**\n`;
    response += `• ✅ Vos données ne sont JAMAIS vendues\n`;
    response += `• ✅ Hébergement sécurisé en Europe\n`;
    response += `• ✅ Chiffrement de bout en bout\n`;
    response += `• ✅ Suppression à la demande\n`;

    return {
      intent: 'privacy',
      response,
      confidence: 0.90,
      suggestedActions: [
        { type: 'navigate', label: 'Gérer mes données', value: '/settings/privacy' },
        { type: 'navigate', label: 'Télécharger mes données', value: '/settings/privacy/export' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // DELETE ACCOUNT - Account deletion
  // ─────────────────────────────────────────────────────
  delete_account: (ctx) => {
    const name = getUserName(ctx);
    let response = `⚠️ **Suppression de compte${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    response += `Nous sommes tristes de vous voir partir ! 😢\n\n`;

    response += `**Avant de supprimer, sachez que :**\n`;
    response += `• ❌ Toutes vos données seront effacées\n`;
    response += `• ❌ Vos conversations seront supprimées\n`;
    response += `• ❌ Vos crédits de parrainage seront perdus\n`;

    if (ctx.referralCreditsMonths && ctx.referralCreditsMonths > 0) {
      response += `\n⚠️ **Attention !** Vous avez ${ctx.referralCreditsMonths} mois de crédit parrainage qui seront perdus.\n`;
    }

    if (ctx.subscriptionStatus === 'trial' && ctx.trialDaysRemaining && ctx.trialDaysRemaining > 30) {
      response += `\n⚠️ Vous êtes encore en essai gratuit pendant ${ctx.trialDaysRemaining} jours. Profitez-en avant de partir !\n`;
    }

    response += `\n**Alternatives :**\n`;
    response += `• 😴 **Pause** - Désactivez temporairement votre profil\n`;
    response += `• 🔕 **Notifications** - Désactivez les alertes\n`;
    response += `• 💬 **Parlez-nous** - On peut peut-être vous aider\n\n`;

    response += `**Pour supprimer définitivement :**\n`;
    response += `Paramètres → Compte → Supprimer mon compte`;

    return {
      intent: 'delete_account',
      response,
      confidence: 0.95,
      suggestedActions: [
        { type: 'navigate', label: 'Gérer mon compte', value: '/settings/account' },
        { type: 'contact', label: 'Nous contacter d\'abord', value: 'mailto:support@izzico.be' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // LANGUAGE - Language settings
  // ─────────────────────────────────────────────────────
  language: (ctx) => {
    const name = getUserName(ctx);
    let response = `🌐 **Langues${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    response += `**Langues disponibles :**\n`;
    response += `• 🇫🇷 Français\n`;
    response += `• 🇧🇪 Nederlands\n`;
    response += `• 🇬🇧 English\n\n`;

    response += `**Changer de langue :**\n`;
    response += `Paramètres → Langue → Sélectionner\n\n`;

    response += `L'interface et les notifications seront traduites automatiquement.`;

    return {
      intent: 'language',
      response,
      confidence: 0.90,
      suggestedActions: [
        { type: 'navigate', label: 'Changer la langue', value: '/settings/language' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // MOBILE APP - App download
  // ─────────────────────────────────────────────────────
  mobile_app: (ctx) => {
    const name = getUserName(ctx);
    let response = `📱 **Application mobile${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    response += `**Téléchargez IzzIco sur votre téléphone !**\n\n`;

    response += `📲 **Disponible sur :**\n`;
    response += `• App Store (iPhone)\n`;
    response += `• Google Play (Android)\n\n`;

    response += `**Avantages de l'app :**\n`;
    response += `• 🔔 Notifications push instantanées\n`;
    response += `• 📷 Scanner de tickets plus rapide\n`;
    response += `• 💬 Messagerie optimisée\n`;
    response += `• 📍 Recherche géolocalisée\n`;
    response += `• 🔐 Connexion biométrique (Face ID, Touch ID)\n\n`;

    response += `Votre compte est synchronisé automatiquement entre web et mobile.`;

    return {
      intent: 'mobile_app',
      response,
      confidence: 0.90,
      suggestedActions: [
        { type: 'navigate', label: 'Télécharger l\'app', value: '/download' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // BUG REPORT - Technical issues
  // ─────────────────────────────────────────────────────
  bug_report: (ctx) => {
    const name = getUserName(ctx);
    let response = `🐛 **Problème technique${name !== 'vous' ? `, ${name}` : ''} ?**\n\n`;

    response += `Je suis désolé que vous rencontriez un problème ! Voici comment le résoudre :\n\n`;

    response += `**🔄 Essayez d'abord :**\n`;
    response += `1. Rafraîchir la page (F5 ou Cmd+R)\n`;
    response += `2. Vider le cache du navigateur\n`;
    response += `3. Essayer un autre navigateur\n`;
    response += `4. Vérifier votre connexion internet\n\n`;

    response += `**📝 Si le problème persiste :**\n`;
    response += `Signalez-le en incluant :\n`;
    response += `• La page concernée\n`;
    response += `• Les étapes pour reproduire le bug\n`;
    response += `• Une capture d'écran si possible\n`;
    response += `• Votre navigateur et appareil\n\n`;

    response += `**📧 Envoyer le rapport à :** bugs@izzico.be\n\n`;

    response += `Notre équipe technique traite les bugs en priorité. Merci de nous aider à améliorer IzzIco ! 🙏`;

    return {
      intent: 'bug_report',
      response,
      confidence: 0.90,
      suggestedActions: [
        { type: 'contact', label: 'Signaler un bug', value: 'mailto:bugs@izzico.be' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // FEATURE REQUEST - Suggest features
  // ─────────────────────────────────────────────────────
  feature_request: (ctx) => {
    const name = getUserName(ctx);
    let response = `💡 **Vous avez une idée${name !== 'vous' ? `, ${name}` : ''} ?**\n\n`;

    response += `Nous adorons recevoir des suggestions d'amélioration !\n\n`;

    response += `**Comment proposer une fonctionnalité :**\n`;
    response += `1. Décrivez votre idée clairement\n`;
    response += `2. Expliquez le problème qu'elle résout\n`;
    response += `3. Envoyez à : ideas@izzico.be\n\n`;

    response += `**Fonctionnalités récentes ajoutées grâce à vous :**\n`;
    response += `• 📷 Scanner de tickets amélioré\n`;
    response += `• 🎯 Matching de personnalité\n`;
    response += `• 💬 Messagerie de groupe\n`;
    response += `• 🔔 Alertes personnalisées\n\n`;

    response += `Votre avis compte vraiment ! Les meilleures idées sont souvent implémentées. 🚀`;

    return {
      intent: 'feature_request',
      response,
      confidence: 0.85,
      suggestedActions: [
        { type: 'contact', label: 'Proposer une idée', value: 'mailto:ideas@izzico.be' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // HOW IT WORKS - Platform explanation
  // ─────────────────────────────────────────────────────
  how_it_works: (ctx) => {
    const name = getUserName(ctx);
    let response = `🏠 **Comment fonctionne IzzIco${name !== 'vous' ? `, ${name}` : ''} ?**\n\n`;

    response += `**IzzIco, c'est quoi ?**\n`;
    response += `Une plateforme qui connecte propriétaires et chercheurs de colocation en Belgique, avec un système de matching basé sur la personnalité.\n\n`;

    response += `**Le concept :**\n\n`;

    response += `🏠 **Pour les propriétaires :**\n`;
    response += `1. Publiez votre annonce (photos, description)\n`;
    response += `2. Recevez des candidatures compatibles\n`;
    response += `3. Échangez via la messagerie\n`;
    response += `4. Choisissez le meilleur profil\n\n`;

    response += `🔍 **Pour les chercheurs :**\n`;
    response += `1. Créez votre profil et test de personnalité\n`;
    response += `2. Recherchez par critères et score de matching\n`;
    response += `3. Candidatez aux annonces\n`;
    response += `4. Visitez et emménagez !\n\n`;

    response += `🤝 **Pour les résidents :**\n`;
    response += `• Gérez les finances partagées\n`;
    response += `• Communiquez avec vos colocataires\n`;
    response += `• Organisez la vie commune\n\n`;

    response += `**Ce qui nous différencie :**\n`;
    response += `• 🎯 Matching de personnalité (pas juste le budget)\n`;
    response += `• 📷 IA pour scanner les tickets de caisse\n`;
    response += `• ✅ Profils vérifiés\n`;
    response += `• 💬 Messagerie intégrée`;

    return {
      intent: 'how_it_works',
      response,
      confidence: 0.90,
      suggestedActions: !ctx.onboardingCompleted
        ? [{ type: 'navigate', label: 'Commencer maintenant', value: '/onboarding' }]
        : undefined,
    };
  },

  // ─────────────────────────────────────────────────────
  // TRUST & SAFETY - Platform safety
  // ─────────────────────────────────────────────────────
  trust_safety: (ctx) => {
    const name = getUserName(ctx);
    let response = `🛡️ **Confiance et sécurité${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    response += `**Comment on vous protège :**\n\n`;

    response += `✅ **Vérification des profils**\n`;
    response += `• Email vérifié obligatoire\n`;
    response += `• Vérification téléphone disponible\n`;
    response += `• Vérification d'identité (KYC) pour les propriétaires\n\n`;

    response += `🔒 **Sécurité des données**\n`;
    response += `• Chiffrement SSL/TLS\n`;
    response += `• Hébergement sécurisé en Europe\n`;
    response += `• Conformité RGPD\n\n`;

    response += `⚠️ **Signalement**\n`;
    response += `• Signalez les comportements suspects\n`;
    response += `• Équipe de modération réactive\n`;
    response += `• Bannissement des comptes frauduleux\n\n`;

    response += `**🚨 Conseils de prudence :**\n`;
    response += `• Ne communiquez JAMAIS hors plateforme avant la visite\n`;
    response += `• Ne payez JAMAIS avant d'avoir visité\n`;
    response += `• Méfiez-vous des offres trop belles\n`;
    response += `• Préférez les profils vérifiés`;

    return {
      intent: 'trust_safety',
      response,
      confidence: 0.90,
      suggestedActions: [
        { type: 'navigate', label: 'Signaler un problème', value: '/report' },
      ],
    };
  },

  // ─────────────────────────────────────────────────────
  // SUCCESS STORIES - Testimonials
  // ─────────────────────────────────────────────────────
  success_stories: (ctx) => {
    const name = getUserName(ctx);
    let response = `🌟 **Témoignages${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    response += `**Ils ont trouvé leur coloc idéale sur IzzIco :**\n\n`;

    response += `💬 *"J'ai trouvé ma coloc en 2 semaines grâce au matching de personnalité. On s'entend super bien !"*\n`;
    response += `— **Marie**, 26 ans, Bruxelles\n\n`;

    response += `💬 *"En tant que propriétaire, je reçois des candidatures de qualité. Les profils sont vérifiés et le matching aide vraiment."*\n`;
    response += `— **Thomas**, propriétaire à Liège\n\n`;

    response += `💬 *"Le scanner de tickets est génial ! Plus de discussions sur qui doit quoi."*\n`;
    response += `— **Sofia**, résidente à Namur\n\n`;

    response += `**En chiffres :**\n`;
    response += `• 10 000+ utilisateurs actifs\n`;
    response += `• 85% de taux de satisfaction\n`;
    response += `• 3 semaines en moyenne pour trouver\n`;

    return {
      intent: 'success_stories',
      response,
      confidence: 0.80,
    };
  },

  // ─────────────────────────────────────────────────────
  // COMMUNITY - IzzIco community
  // ─────────────────────────────────────────────────────
  community: (ctx) => {
    const name = getUserName(ctx);
    let response = `👥 **Communauté IzzIco${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    response += `Rejoignez la communauté des colocataires belges !\n\n`;

    response += `**Nos réseaux :**\n`;
    response += `• 📸 Instagram : @izzico_be\n`;
    response += `• 👥 Facebook : IzzIco Belgique\n`;
    response += `• 💼 LinkedIn : IzzIco\n\n`;

    response += `**Ce qu'on partage :**\n`;
    response += `• Conseils colocation\n`;
    response += `• Actualités immobilières\n`;
    response += `• Témoignages d'utilisateurs\n`;
    response += `• Offres exclusives\n\n`;

    response += `**Avantages membres :**\n`;
    response += `• Accès aux événements communautaires\n`;
    response += `• Codes promo exclusifs\n`;
    response += `• Partage d'expériences\n`;

    return {
      intent: 'community',
      response,
      confidence: 0.80,
    };
  },

  // ─────────────────────────────────────────────────────
  // EVENTS - Community events
  // ─────────────────────────────────────────────────────
  events: (ctx) => {
    const name = getUserName(ctx);
    let response = `🎉 **Événements${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    response += `**Événements IzzIco :**\n\n`;

    response += `🥂 **Afterworks coloc**\n`;
    response += `Rencontrez d'autres colocataires dans une ambiance détendue.\n\n`;

    response += `🏠 **Journées portes ouvertes**\n`;
    response += `Visitez plusieurs colocations en une journée.\n\n`;

    response += `📚 **Ateliers pratiques**\n`;
    response += `• Comment bien chercher une coloc\n`;
    response += `• Gérer les finances partagées\n`;
    response += `• Droits et devoirs du locataire\n\n`;

    response += `**Prochains événements :**\n`;
    response += `Suivez-nous sur Instagram @izzico_be pour les annonces !\n`;

    if (ctx.userType === 'resident' && ctx.currentPropertyName) {
      response += `\n💡 **Astuce :** Organisez un événement dans votre coloc et invitez la communauté !`;
    }

    return {
      intent: 'events',
      response,
      confidence: 0.80,
    };
  },

  // ─────────────────────────────────────────────────────
  // MOVING - Moving advice
  // ─────────────────────────────────────────────────────
  moving: (ctx) => {
    const name = getUserName(ctx);
    let response = `📦 **Déménagement${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    if (ctx.userType === 'resident') {
      response += `**Vous quittez votre coloc ?**\n\n`;
      response += `📝 **Étapes importantes :**\n`;
      response += `1. Prévenez vos colocataires (respect du préavis)\n`;
      response += `2. Informez le propriétaire\n`;
      response += `3. Régularisez les finances partagées\n`;
      response += `4. Faites l'état des lieux de sortie\n`;
      response += `5. Mettez à jour votre profil IzzIco\n\n`;

      response += `**💰 N'oubliez pas :**\n`;
      response += `• Récupérer votre caution\n`;
      response += `• Solder tous les comptes\n`;
      response += `• Transférer les abonnements (internet, énergie)`;
    } else if (ctx.userType === 'searcher') {
      response += `**Vous emménagez bientôt ?**\n\n`;
      response += `📋 **Checklist emménagement :**\n`;
      response += `• ✅ Signer le bail\n`;
      response += `• ✅ Payer la caution et premier loyer\n`;
      response += `• ✅ État des lieux d'entrée\n`;
      response += `• ✅ Assurance locataire\n`;
      response += `• ✅ Changement d'adresse\n`;
      response += `• ✅ Abonnements (internet, énergie)\n\n`;

      response += `**📱 Sur IzzIco :**\n`;
      response += `• Passez votre profil en "Résident"\n`;
      response += `• Rejoignez le groupe de votre coloc\n`;
      response += `• Commencez à scanner vos tickets !`;
    } else {
      response += `**Conseils déménagement :**\n`;
      response += `• Prévoyez 1-2 mois à l'avance\n`;
      response += `• Comparez les devis de déménageurs\n`;
      response += `• Faites le tri avant d'emballer\n`;
      response += `• Prévenez tous les organismes (banque, mutuelle...)\n`;
      response += `• Redirigez votre courrier`;
    }

    return {
      intent: 'moving',
      response,
      confidence: 0.85,
      suggestedActions: ctx.userType === 'resident'
        ? [{ type: 'navigate', label: 'Mes finances à régulariser', value: '/hub/finances' }]
        : undefined,
    };
  },

  // ─────────────────────────────────────────────────────
  // LEASE - Rental contract info
  // ─────────────────────────────────────────────────────
  lease: (ctx) => {
    const name = getUserName(ctx);
    let response = `📜 **Bail et contrat${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    response += `**Types de baux en Belgique :**\n\n`;

    response += `📝 **Bail de résidence principale**\n`;
    response += `• Durée : 9 ans (standard) ou 3 ans (courte durée)\n`;
    response += `• Enregistrement obligatoire\n`;
    response += `• Préavis : 3 mois\n\n`;

    response += `📝 **Bail étudiant**\n`;
    response += `• Durée : 10-12 mois renouvelable\n`;
    response += `• Préavis : 2 mois avant la fin\n\n`;

    response += `📝 **Colocation**\n`;
    response += `• Bail commun OU baux individuels\n`;
    response += `• Clause de solidarité (attention !)\n`;
    response += `• Sous-location à vérifier\n\n`;

    response += `**⚠️ Points de vigilance :**\n`;
    response += `• Lisez TOUT le contrat avant de signer\n`;
    response += `• Vérifiez les charges incluses/exclues\n`;
    response += `• Photographiez l'état des lieux\n`;
    response += `• Conservez une copie signée\n\n`;

    response += `**💡 IzzIco ne fournit pas de conseils juridiques. En cas de doute, consultez un professionnel.**`;

    return {
      intent: 'lease',
      response,
      confidence: 0.85,
    };
  },

  // ─────────────────────────────────────────────────────
  // INSURANCE - Rental insurance
  // ─────────────────────────────────────────────────────
  insurance: (ctx) => {
    const name = getUserName(ctx);
    let response = `🛡️ **Assurance${name !== 'vous' ? `, ${name}` : ''}**\n\n`;

    response += `**Assurance locataire (obligatoire) :**\n\n`;

    response += `✅ **Ce qu'elle couvre :**\n`;
    response += `• Dégâts des eaux\n`;
    response += `• Incendie\n`;
    response += `• Vol (selon contrat)\n`;
    response += `• Responsabilité civile\n\n`;

    response += `💰 **Coût moyen :**\n`;
    response += `• Studio : 60-100€/an\n`;
    response += `• Appartement : 100-150€/an\n`;
    response += `• Colocation : 80-120€/personne/an\n\n`;

    response += `**📋 Spécificités colocation :**\n`;
    response += `• Chaque colocataire doit être assuré\n`;
    response += `• Vérifiez la clause "colocation"\n`;
    response += `• Optez pour une RC étendue\n\n`;

    response += `**💡 Conseils :**\n`;
    response += `• Comparez plusieurs assureurs\n`;
    response += `• Vérifiez les franchises\n`;
    response += `• Conservez les factures de vos biens\n`;
    response += `• Déclarez vite en cas de sinistre`;

    return {
      intent: 'insurance',
      response,
      confidence: 0.85,
    };
  },

  // ─────────────────────────────────────────────────────
  // UNKNOWN - Fallback
  // ─────────────────────────────────────────────────────
  unknown: () => ({
    intent: 'unknown',
    response: '',
    confidence: 0,
  }),
};

// =====================================================
// INTENT DETECTION ENGINE
// =====================================================

/**
 * Normalize text for matching
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .trim();
}

/**
 * Calculate keyword match score
 */
function calculateKeywordScore(text: string, keywords: string[]): number {
  const normalizedText = normalizeText(text);
  const words = normalizedText.split(/\s+/);

  let matches = 0;
  for (const keyword of keywords) {
    const normalizedKeyword = normalizeText(keyword);
    if (normalizedText.includes(normalizedKeyword) || words.includes(normalizedKeyword)) {
      matches++;
    }
  }

  return matches / keywords.length;
}

/**
 * Detect intent from user message
 */
export function detectIntent(message: string): { intent: Intent; confidence: number } {
  const normalizedMessage = normalizeText(message);

  // Sort patterns by priority
  const sortedPatterns = [...INTENT_PATTERNS].sort((a, b) => b.priority - a.priority);

  let bestMatch: { intent: Intent; confidence: number } = {
    intent: 'unknown',
    confidence: 0,
  };

  for (const { intent, patterns, keywords, priority } of sortedPatterns) {
    // Check regex patterns first (highest confidence)
    for (const pattern of patterns) {
      if (pattern.test(message)) {
        const confidence = 0.9 + priority / 1000; // Small boost for priority
        if (confidence > bestMatch.confidence) {
          bestMatch = { intent, confidence: Math.min(confidence, 1) };
        }
      }
    }

    // Check keyword score
    const keywordScore = calculateKeywordScore(message, keywords);
    if (keywordScore > 0.3) {
      const confidence = 0.5 + keywordScore * 0.4 + priority / 2000;
      if (confidence > bestMatch.confidence) {
        bestMatch = { intent, confidence: Math.min(confidence, 0.85) };
      }
    }
  }

  return bestMatch;
}

/**
 * Get FAQ response for an intent with user context
 */
export function getFAQResponse(intent: Intent, context: UserContext = DEFAULT_USER_CONTEXT): FAQResponse {
  const responseGenerator = FAQ_RESPONSES[intent];
  if (!responseGenerator) {
    return FAQ_RESPONSES.unknown(context);
  }
  return responseGenerator(context);
}

/**
 * Try to answer with FAQ (returns null if confidence too low)
 */
export function tryFAQAnswer(
  message: string,
  minConfidence = 0.7,
  context: UserContext = DEFAULT_USER_CONTEXT
): FAQResponse | null {
  const { intent, confidence } = detectIntent(message);

  console.log(`[FAQ] Intent: ${intent}, Confidence: ${(confidence * 100).toFixed(1)}%`);

  if (confidence < minConfidence || intent === 'unknown') {
    return null;
  }

  const response = getFAQResponse(intent, context);
  return {
    ...response,
    confidence, // Override with detected confidence
  };
}

// =====================================================
// EXPORTS
// =====================================================

export { INTENT_PATTERNS, FAQ_RESPONSES };
