/**
 * FAQ SYSTEM - Layer 1 (100% LOCAL)
 *
 * Intent detection + predefined responses
 * Cost: $0 - handles ~70% of queries
 *
 * This system uses keyword matching and pattern recognition
 * to answer common questions WITHOUT calling any AI API.
 */

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
// INTENT PATTERNS (ordered by priority)
// =====================================================

const INTENT_PATTERNS: IntentPattern[] = [
  // Greeting (highest priority for UX)
  {
    intent: 'greeting',
    patterns: [
      /^(salut|bonjour|hello|hi|hey|coucou|bonsoir)/i,
      /^(ca va|ça va|comment ça va)/i,
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
    ],
    keywords: ['parrainage', 'parrain', 'inviter', 'référer', 'code', 'bonus', 'filleul'],
    priority: 80,
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
// FAQ RESPONSES (in French)
// =====================================================

const FAQ_RESPONSES: Record<Intent, (context?: any) => FAQResponse> = {
  greeting: () => ({
    intent: 'greeting',
    response: `Bonjour ! 👋 Je suis l'assistant IzzIco. Comment puis-je vous aider aujourd'hui ?

Je peux vous renseigner sur :
• Les tarifs et abonnements
• Le programme de parrainage
• La recherche de colocation
• La gestion des dépenses partagées

Posez-moi votre question !`,
    confidence: 1.0,
  }),

  goodbye: () => ({
    intent: 'goodbye',
    response: `Au revoir et à bientôt sur IzzIco ! 👋

N'hésitez pas à revenir si vous avez d'autres questions.`,
    confidence: 1.0,
  }),

  pricing: () => ({
    intent: 'pricing',
    response: `💰 **Tarifs IzzIco**

**Pour les Propriétaires (Owner) :**
• 15,99 €/mois
• ou 159,90 €/an (-17%)

**Pour les Résidents :**
• 7,99 €/mois
• ou 79,90 €/an (-17%)

**Essai gratuit inclus :**
• Propriétaires : 3 mois
• Résidents : 6 mois

💡 Avec le parrainage, vous pouvez gagner jusqu'à 24 mois gratuits !`,
    confidence: 0.95,
    suggestedActions: [
      { type: 'navigate', label: 'Voir les abonnements', value: '/dashboard/subscription' },
      { type: 'explain', label: 'Programme parrainage', value: 'referral' },
    ],
  }),

  trial: () => ({
    intent: 'trial',
    response: `🎁 **Période d'essai gratuite**

• **Propriétaires** : 3 mois gratuits
• **Résidents** : 6 mois gratuits

Pendant l'essai, vous avez accès à toutes les fonctionnalités premium sans aucun engagement.

À la fin de l'essai, vous pouvez :
• Souscrire un abonnement
• Ou utiliser vos crédits de parrainage pour prolonger gratuitement`,
    confidence: 0.95,
    suggestedActions: [
      { type: 'navigate', label: 'Mon abonnement', value: '/dashboard/subscription' },
    ],
  }),

  subscription: () => ({
    intent: 'subscription',
    response: `⚙️ **Gestion de votre abonnement**

Pour gérer votre abonnement (modifier, annuler, voir la facturation) :

1. Allez dans **Paramètres** → **Abonnement**
2. Ou cliquez sur le bouton ci-dessous

Vous pouvez annuler à tout moment. L'accès reste actif jusqu'à la fin de la période payée.`,
    confidence: 0.95,
    suggestedActions: [
      { type: 'navigate', label: 'Gérer mon abonnement', value: '/dashboard/subscription' },
      { type: 'contact', label: 'Contacter le support', value: 'support@izzico.be' },
    ],
  }),

  referral: () => ({
    intent: 'referral',
    response: `🎁 **Programme de parrainage**

Invitez vos amis et gagnez des mois gratuits !

**Récompenses :**
• Inviter un **Propriétaire** → **+3 mois** pour vous
• Inviter un **Résident** → **+2 mois** pour vous
• Votre ami reçoit **+1 mois** bonus

**Comment ça marche :**
1. Partagez votre code unique (format: EASY****)
2. Votre ami s'inscrit avec ce code
3. Une fois son onboarding terminé, vous recevez tous les deux vos bonus

**Maximum :** 24 mois accumulables`,
    confidence: 0.95,
    suggestedActions: [
      { type: 'navigate', label: 'Mon code parrainage', value: '/settings/referral' },
    ],
  }),

  matching: () => ({
    intent: 'matching',
    response: `🎯 **Système de Matching IzzIco**

Notre algorithme analyse la compatibilité entre colocataires selon :

**Critères analysés :**
• Personnalité (extraverti/introverti)
• Habitudes de vie (horaires, propreté)
• Préférences (fumeur, animaux, fêtes)
• Budget et localisation

**Score de compatibilité :**
• 90%+ : Excellente compatibilité
• 70-89% : Bonne compatibilité
• <70% : Compatibilité moyenne

💡 Plus votre profil est complet, meilleurs sont les matchs !`,
    confidence: 0.90,
    suggestedActions: [
      { type: 'navigate', label: 'Compléter mon profil', value: '/profile' },
    ],
  }),

  search: () => ({
    intent: 'search',
    response: `🔍 **Recherche de colocation**

**Filtres disponibles :**
• Prix (min/max)
• Localisation (ville, quartier)
• Type de chambre (privée/partagée)
• Équipements (wifi, parking, etc.)

**Conseils :**
• Complétez votre profil pour voir les scores de matching
• Activez les alertes email pour les nouvelles annonces
• Utilisez la carte pour explorer les quartiers`,
    confidence: 0.90,
    suggestedActions: [
      { type: 'navigate', label: 'Rechercher', value: '/search' },
    ],
  }),

  property: () => ({
    intent: 'property',
    response: `🏠 **Gestion de propriété**

**Pour publier une annonce :**
1. Allez dans "Mes propriétés"
2. Cliquez sur "Ajouter une propriété"
3. Remplissez les informations et ajoutez des photos
4. Publiez votre annonce

**Fonctionnalités :**
• Gestion multi-propriétés
• Candidatures triées par compatibilité
• Messagerie intégrée avec les candidats
• Signature de bail en ligne (bientôt)`,
    confidence: 0.90,
    suggestedActions: [
      { type: 'navigate', label: 'Mes propriétés', value: '/properties' },
      { type: 'navigate', label: 'Ajouter une propriété', value: '/properties/add' },
    ],
  }),

  finances: () => ({
    intent: 'finances',
    response: `💰 **Gestion des finances partagées**

**Fonctionnalités :**
• **Scanner de tickets** : Photographiez vos reçus, l'IA extrait les infos automatiquement
• **Catégorisation** : Courses, charges, internet...
• **Répartition équitable** : Calcul automatique des parts
• **Historique** : Suivez toutes les dépenses

**Comment ajouter une dépense :**
1. Cliquez sur "+" dans la section Finances
2. Scannez un ticket ou saisissez manuellement
3. La répartition se fait automatiquement`,
    confidence: 0.90,
    suggestedActions: [
      { type: 'navigate', label: 'Voir les finances', value: '/hub/finances' },
    ],
  }),

  messaging: () => ({
    intent: 'messaging',
    response: `💬 **Messagerie IzzIco**

**Fonctionnalités :**
• Conversations privées et de groupe
• Notifications en temps réel
• Partage de fichiers
• Historique complet

**Accéder aux messages :**
Cliquez sur l'icône Messages dans le menu ou utilisez le bouton ci-dessous.`,
    confidence: 0.90,
    suggestedActions: [
      { type: 'navigate', label: 'Mes messages', value: '/messages' },
    ],
  }),

  verification: () => ({
    intent: 'verification',
    response: `✅ **Vérification de profil**

Un profil vérifié augmente la confiance et vos chances de trouver une colocation.

**Étapes de vérification :**
1. Email confirmé ✓
2. Téléphone vérifié
3. Pièce d'identité (optionnel mais recommandé)

**Avantages :**
• Badge de confiance visible
• Meilleur classement dans les recherches
• Plus de candidatures acceptées`,
    confidence: 0.85,
    suggestedActions: [
      { type: 'navigate', label: 'Vérifier mon profil', value: '/settings/verification' },
    ],
  }),

  navigation: () => ({
    intent: 'navigation',
    response: `🧭 **Navigation IzzIco**

**Pages principales :**
• **/hub** - Dashboard résident
• **/dashboard/owner** - Dashboard propriétaire
• **/properties** - Mes propriétés
• **/search** - Rechercher une colocation
• **/messages** - Messagerie
• **/settings** - Paramètres

Dites-moi où vous voulez aller et je vous y emmène !`,
    confidence: 0.85,
  }),

  help: () => ({
    intent: 'help',
    response: `🤝 **Comment puis-je vous aider ?**

Je peux vous renseigner sur :
• 💰 **Tarifs** - Prix et abonnements
• 🎁 **Parrainage** - Gagner des mois gratuits
• 🔍 **Recherche** - Trouver une colocation
• 🏠 **Propriétés** - Publier une annonce
• 💬 **Messages** - Contacter des membres
• ⚙️ **Paramètres** - Gérer votre compte

Posez votre question ou choisissez un sujet !`,
    confidence: 0.80,
  }),

  unknown: () => ({
    intent: 'unknown',
    response: '', // Will be handled by AI
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
        const confidence = 0.9 + (priority / 1000); // Small boost for priority
        if (confidence > bestMatch.confidence) {
          bestMatch = { intent, confidence: Math.min(confidence, 1) };
        }
      }
    }

    // Check keyword score
    const keywordScore = calculateKeywordScore(message, keywords);
    if (keywordScore > 0.3) {
      const confidence = 0.5 + (keywordScore * 0.4) + (priority / 2000);
      if (confidence > bestMatch.confidence) {
        bestMatch = { intent, confidence: Math.min(confidence, 0.85) };
      }
    }
  }

  return bestMatch;
}

/**
 * Get FAQ response for an intent
 */
export function getFAQResponse(intent: Intent, context?: any): FAQResponse {
  const responseGenerator = FAQ_RESPONSES[intent];
  if (!responseGenerator) {
    return FAQ_RESPONSES.unknown();
  }
  return responseGenerator(context);
}

/**
 * Try to answer with FAQ (returns null if confidence too low)
 */
export function tryFAQAnswer(message: string, minConfidence = 0.7): FAQResponse | null {
  const { intent, confidence } = detectIntent(message);

  console.log(`[FAQ] Intent: ${intent}, Confidence: ${(confidence * 100).toFixed(1)}%`);

  if (confidence < minConfidence || intent === 'unknown') {
    return null;
  }

  return getFAQResponse(intent);
}

// =====================================================
// EXPORTS
// =====================================================

export { INTENT_PATTERNS, FAQ_RESPONSES };
