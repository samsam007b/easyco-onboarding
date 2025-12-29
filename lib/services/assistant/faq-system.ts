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

/**
 * Get a friendly greeting based on time of day
 */
function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon après-midi';
  return 'Bonsoir';
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
  {
    intent: 'greeting',
    patterns: [
      /^(salut|bonjour|hello|hi|hey|coucou|bonsoir)/i,
      /^(ca va|ça va|comment ça va|comment vas-tu)/i,
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
      /(aide|help|besoin|problème)/i,
      /(comment|qu'est-ce|c'est quoi)/i,
      /ne (comprends|sais|trouve) pas/i,
    ],
    keywords: ['aide', 'help', 'comment', 'problème', 'question'],
    priority: 40,
  },
];

// =====================================================
// PERSONALIZED FAQ RESPONSES
// =====================================================

const FAQ_RESPONSES: Record<Intent, (ctx: UserContext) => FAQResponse> = {
  // ─────────────────────────────────────────────────────
  // GREETING - Fully personalized based on context
  // ─────────────────────────────────────────────────────
  greeting: (ctx) => {
    const greeting = getTimeBasedGreeting();
    const name = getUserName(ctx);
    const isNewUser = !ctx.onboardingCompleted;

    let response = '';

    // Personalized greeting
    if (name !== 'vous') {
      response = `${greeting} ${name} ! 👋`;
    } else {
      response = `${greeting} ! 👋`;
    }

    // Add context-specific welcome
    if (isNewUser) {
      response += `\n\nBienvenue sur IzzIco ! Je suis votre assistant personnel et je suis là pour vous guider.`;
      if (ctx.profileCompletionScore !== undefined && ctx.profileCompletionScore < 100) {
        response += `\n\n📊 Votre profil est complété à **${ctx.profileCompletionScore}%**. Voulez-vous que je vous aide à le finaliser ?`;
      }
    } else {
      response += `\n\nRavi de vous revoir ! Comment puis-je vous aider aujourd'hui ?`;
    }

    // Add user-type specific info
    if (ctx.userType === 'owner') {
      if (ctx.applicationsCount && ctx.applicationsCount > 0) {
        response += `\n\n📬 Vous avez **${ctx.applicationsCount} candidature${ctx.applicationsCount > 1 ? 's' : ''}** en attente.`;
      }
      if (ctx.propertiesCount === 0) {
        response += `\n\n🏠 Vous n'avez pas encore de propriété. Voulez-vous en ajouter une ?`;
      }
    } else if (ctx.userType === 'searcher') {
      if (ctx.matchesCount && ctx.matchesCount > 0) {
        response += `\n\n🎯 Vous avez **${ctx.matchesCount} match${ctx.matchesCount > 1 ? 's' : ''}** à découvrir !`;
      }
      if (ctx.favoritesCount && ctx.favoritesCount > 0) {
        response += `\n\n💜 ${ctx.favoritesCount} annonce${ctx.favoritesCount > 1 ? 's' : ''} dans vos favoris.`;
      }
    } else if (ctx.userType === 'resident' && ctx.currentPropertyName) {
      response += `\n\n🏠 Comment ça se passe à "${ctx.currentPropertyName}" ?`;
    }

    // Unread messages notification
    if (ctx.unreadMessagesCount && ctx.unreadMessagesCount > 0) {
      response += `\n\n💬 Vous avez **${ctx.unreadMessagesCount} message${ctx.unreadMessagesCount > 1 ? 's' : ''} non lu${ctx.unreadMessagesCount > 1 ? 's' : ''}**.`;
    }

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

    return {
      intent: 'greeting',
      response,
      confidence: 1.0,
      suggestedActions:
        ctx.unreadMessagesCount && ctx.unreadMessagesCount > 0
          ? [{ type: 'navigate', label: 'Voir mes messages', value: '/messages' }]
          : undefined,
    };
  },

  // ─────────────────────────────────────────────────────
  // GOODBYE - Personalized farewell
  // ─────────────────────────────────────────────────────
  goodbye: (ctx) => {
    const name = getUserName(ctx);
    let response = '';

    if (name !== 'vous') {
      response = `Au revoir ${name} ! 👋`;
    } else {
      response = `Au revoir ! 👋`;
    }

    // Add personalized note
    if (ctx.userType === 'searcher' && !ctx.onboardingCompleted) {
      response += `\n\nN'oubliez pas de terminer votre profil pour maximiser vos chances de trouver la coloc idéale !`;
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
