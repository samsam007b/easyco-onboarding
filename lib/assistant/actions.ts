/**
 * ASSISTANT ACTION SYSTEM
 *
 * Defines all actions the assistant can perform in the app.
 * Actions are READ-ONLY or NAVIGATION - never data modification.
 *
 * The assistant emits actions as structured JSON in responses,
 * which are parsed and executed by the frontend.
 */

// =====================================================
// ACTION TYPES
// =====================================================

export type AssistantActionType =
  | 'navigate'
  | 'setFilters'
  | 'openModal'
  | 'highlightElement'
  | 'scrollToSection'
  | 'startTour'
  | 'copyToClipboard'
  | 'togglePreference';

// =====================================================
// ACTION PAYLOADS
// =====================================================

export interface NavigateAction {
  type: 'navigate';
  path: string;
  description: string;
}

export interface SetFiltersAction {
  type: 'setFilters';
  filters: {
    city?: string;
    minBudget?: number;
    maxBudget?: number;
    roomType?: 'private' | 'shared' | 'studio';
    amenities?: string[];
    moveInDate?: string;
  };
  navigateTo?: string; // Usually /matching/properties
}

export interface OpenModalAction {
  type: 'openModal';
  modal:
    | 'addExpense'
    | 'addProperty'
    | 'addRoom'
    | 'inviteRoommate'
    | 'shareProperty'
    | 'contactOwner'
    | 'scheduleVisit'
    | 'referralShare'
    | 'exportData'
    | 'feedback';
  context?: Record<string, unknown>; // Optional context for pre-filling
}

export interface HighlightElementAction {
  type: 'highlightElement';
  selector: string; // CSS selector or data-assistant-id
  message?: string; // Tooltip message
  duration?: number; // How long to highlight (ms)
}

export interface ScrollToSectionAction {
  type: 'scrollToSection';
  section: string; // Section ID or data-section attribute
  highlight?: boolean; // Also highlight after scrolling
}

export interface StartTourAction {
  type: 'startTour';
  tour:
    | 'onboarding'
    | 'dashboard'
    | 'search'
    | 'finances'
    | 'messaging'
    | 'properties'
    | 'settings'
    | 'matching'
    | 'referral';
}

export interface CopyToClipboardAction {
  type: 'copyToClipboard';
  text: string;
  label: string; // What was copied (for confirmation message)
}

export interface TogglePreferenceAction {
  type: 'togglePreference';
  preference: 'darkMode' | 'notifications' | 'emailAlerts' | 'sounds';
  value?: boolean; // If not provided, toggles current value
}

// Union of all action types
export type AssistantAction =
  | NavigateAction
  | SetFiltersAction
  | OpenModalAction
  | HighlightElementAction
  | ScrollToSectionAction
  | StartTourAction
  | CopyToClipboardAction
  | TogglePreferenceAction;

// =====================================================
// ACTION RESULT
// =====================================================

export interface ActionResult {
  success: boolean;
  message: string;
  navigatedTo?: string;
}

// =====================================================
// ACTION PARSING
// =====================================================

/**
 * Pattern to match action blocks in AI responses
 * Format: [ACTION:type:payload]
 *
 * Examples:
 * [ACTION:navigate:{"path":"/hub/finances","description":"Page des finances"}]
 * [ACTION:setFilters:{"city":"Bruxelles","maxBudget":600}]
 * [ACTION:openModal:{"modal":"addExpense"}]
 * [ACTION:setFilters:{"amenities":["wifi","parking"]}] (with nested arrays)
 */

/**
 * Extract balanced JSON object from a string starting at a given position
 * Handles nested objects and arrays correctly
 */
function extractBalancedJson(str: string, startIndex: number): string | null {
  if (str[startIndex] !== '{') return null;

  let depth = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = startIndex; i < str.length; i++) {
    const char = str[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\' && inString) {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '{' || char === '[') {
      depth++;
    } else if (char === '}' || char === ']') {
      depth--;
      if (depth === 0) {
        return str.slice(startIndex, i + 1);
      }
    }
  }

  return null;
}

/**
 * Parse actions from AI response text
 * Returns the cleaned text (without action markers) and parsed actions
 */
export function parseActionsFromResponse(responseText: string): {
  cleanedText: string;
  actions: AssistantAction[];
} {
  const actions: AssistantAction[] = [];
  let cleanedText = responseText;

  // Find all action markers using matchAll
  const actionStartPattern = /\[ACTION:(\w+):/g;
  const startMatches = [...responseText.matchAll(actionStartPattern)];

  // Collect all valid actions
  const actionMatches: Array<{ fullMatch: string; type: string; payload: string }> = [];

  for (const match of startMatches) {
    const actionType = match[1];
    const jsonStartIndex = match.index! + match[0].length;

    // Extract balanced JSON
    const jsonPayload = extractBalancedJson(responseText, jsonStartIndex);

    if (jsonPayload) {
      // Check for closing bracket
      const closingBracketIndex = jsonStartIndex + jsonPayload.length;
      if (responseText[closingBracketIndex] === ']') {
        const fullMatch = responseText.slice(match.index!, closingBracketIndex + 1);
        actionMatches.push({
          fullMatch,
          type: actionType,
          payload: jsonPayload,
        });
      }
    }
  }

  // Process collected matches
  for (const { fullMatch, type, payload } of actionMatches) {
    try {
      const parsedPayload = JSON.parse(payload);
      const action = {
        type: type as AssistantActionType,
        ...parsedPayload,
      } as AssistantAction;

      // Validate action type
      if (isValidAction(action)) {
        actions.push(action);
      }
    } catch (e) {
      console.warn('[Actions] Failed to parse action:', fullMatch, e);
    }

    // Remove action marker from text
    cleanedText = cleanedText.replace(fullMatch, '');
  }

  // Clean up extra whitespace
  cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n').trim();

  return { cleanedText, actions };
}

/**
 * Validate that an action has the correct structure
 */
function isValidAction(action: unknown): action is AssistantAction {
  if (!action || typeof action !== 'object') return false;

  const a = action as Record<string, unknown>;

  switch (a.type) {
    case 'navigate':
      return typeof a.path === 'string';
    case 'setFilters':
      return typeof a.filters === 'object';
    case 'openModal':
      return typeof a.modal === 'string';
    case 'highlightElement':
      return typeof a.selector === 'string';
    case 'scrollToSection':
      return typeof a.section === 'string';
    case 'startTour':
      return typeof a.tour === 'string';
    case 'copyToClipboard':
      return typeof a.text === 'string';
    case 'togglePreference':
      return typeof a.preference === 'string';
    default:
      return false;
  }
}

// =====================================================
// NAVIGATION PATHS
// =====================================================

/**
 * Common navigation paths in the app
 * Used by AI to know valid destinations
 */
export const NAVIGATION_PATHS = {
  // Hub / Dashboard
  hub: { path: '/hub', description: 'Dashboard résident' },
  dashboard_owner: { path: '/dashboard/owner', description: 'Dashboard propriétaire' },

  // Finances
  finances: { path: '/hub/finances', description: 'Gestion des finances' },
  add_expense: { path: '/hub/finances', description: 'Ajouter une dépense', modal: 'addExpense' },

  // Properties
  properties: { path: '/properties', description: 'Mes propriétés' },
  add_property: { path: '/properties/new', description: 'Ajouter une propriété' },

  // Search / Matching
  search: { path: '/matching/properties', description: 'Rechercher une colocation' },
  browse: { path: '/matching/swipe', description: 'Parcourir les annonces (swipe)' },
  matching: { path: '/matching/properties', description: 'Voir mes matchs' },

  // Messaging
  messages: { path: '/messages', description: 'Messagerie' },

  // Profile & Settings
  profile: { path: '/profile', description: 'Mon profil' },
  settings: { path: '/settings', description: 'Paramètres' },
  settings_notifications: { path: '/dashboard/settings/preferences', description: 'Paramètres de notification et alertes' },
  settings_subscription: { path: '/settings/subscription', description: 'Mon abonnement' },
  settings_security: { path: '/settings/security', description: 'Sécurité du compte' },

  // Referral
  referral: { path: '/referral', description: 'Programme de parrainage' },

  // Onboarding
  onboarding: { path: '/onboarding', description: "Assistant d'inscription" },

  // Help
  help: { path: '/help', description: "Centre d'aide" },
  pricing: { path: '/pricing', description: 'Tarifs' },
} as const;

// =====================================================
// MODAL DEFINITIONS
// =====================================================

/**
 * Available modals that can be opened by the assistant
 */
export const OPENABLE_MODALS = {
  addExpense: {
    id: 'addExpense',
    description: 'Formulaire pour ajouter une nouvelle dépense',
    requiredPage: '/hub/finances',
  },
  addProperty: {
    id: 'addProperty',
    description: 'Formulaire pour ajouter une nouvelle propriété',
    requiredPage: '/properties',
  },
  addRoom: {
    id: 'addRoom',
    description: 'Formulaire pour ajouter une chambre',
    requiredPage: null, // Can be opened from property detail
  },
  inviteRoommate: {
    id: 'inviteRoommate',
    description: 'Inviter un colocataire',
    requiredPage: null,
  },
  shareProperty: {
    id: 'shareProperty',
    description: 'Partager une propriété',
    requiredPage: null,
  },
  contactOwner: {
    id: 'contactOwner',
    description: 'Contacter un propriétaire',
    requiredPage: null,
  },
  referralShare: {
    id: 'referralShare',
    description: 'Partager son code de parrainage',
    requiredPage: null,
  },
  feedback: {
    id: 'feedback',
    description: 'Donner un feedback',
    requiredPage: null,
  },
} as const;

// =====================================================
// TOUR DEFINITIONS
// =====================================================

/**
 * Available guided tours
 */
export const AVAILABLE_TOURS = {
  onboarding: {
    id: 'onboarding',
    description: "Tour d'introduction à l'application",
  },
  dashboard: {
    id: 'dashboard',
    description: 'Découvrir le dashboard',
  },
  search: {
    id: 'search',
    description: 'Comment rechercher une colocation',
  },
  finances: {
    id: 'finances',
    description: 'Gérer les finances partagées',
  },
  messaging: {
    id: 'messaging',
    description: 'Utiliser la messagerie',
  },
  properties: {
    id: 'properties',
    description: 'Gérer ses propriétés (propriétaires)',
  },
  settings: {
    id: 'settings',
    description: 'Configurer son compte',
  },
  matching: {
    id: 'matching',
    description: 'Comprendre le système de matching',
  },
  referral: {
    id: 'referral',
    description: 'Utiliser le programme de parrainage',
  },
} as const;
