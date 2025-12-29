/**
 * Unified Error Handling System for Izzico
 *
 * This module provides centralized error handling with:
 * - Type-safe error codes
 * - Internationalized error messages (FR/EN/NL/DE)
 * - Consistent error logging
 * - User-friendly toast notifications
 * - Proper error categorization
 *
 * @example
 * ```typescript
 * import { handleError, ErrorCode } from '@/lib/utils/error-handler';
 *
 * try {
 *   await saveData();
 * } catch (error) {
 *   handleError(error, ErrorCode.SAVE_FAILED);
 * }
 * ```
 */

import { toast } from 'sonner';
import { logger } from './logger';

/**
 * Comprehensive error codes for the application
 * Each code maps to a translated user-friendly message
 */
export enum ErrorCode {
  // Authentication Errors
  AUTH_FAILED = 'auth.failed',
  AUTH_INVALID_CREDENTIALS = 'auth.invalidCredentials',
  AUTH_USER_NOT_FOUND = 'auth.userNotFound',
  AUTH_SESSION_EXPIRED = 'auth.sessionExpired',
  AUTH_NO_USER = 'auth.noUser',

  // Data Loading Errors
  LOAD_FAILED = 'load.failed',
  LOAD_PROFILE_FAILED = 'load.profileFailed',
  LOAD_PROPERTIES_FAILED = 'load.propertiesFailed',
  LOAD_MESSAGES_FAILED = 'load.messagesFailed',

  // Data Saving Errors
  SAVE_FAILED = 'save.failed',
  SAVE_PROFILE_FAILED = 'save.profileFailed',
  SAVE_PROPERTY_FAILED = 'save.propertyFailed',
  UPDATE_FAILED = 'update.failed',
  DELETE_FAILED = 'delete.failed',

  // Validation Errors
  VALIDATION_REQUIRED_FIELD = 'validation.requiredField',
  VALIDATION_INVALID_EMAIL = 'validation.invalidEmail',
  VALIDATION_INVALID_PHONE = 'validation.invalidPhone',
  VALIDATION_INVALID_DATE = 'validation.invalidDate',
  VALIDATION_MIN_LENGTH = 'validation.minLength',
  VALIDATION_MAX_LENGTH = 'validation.maxLength',
  VALIDATION_INVALID_FORMAT = 'validation.invalidFormat',

  // Network Errors
  NETWORK_ERROR = 'network.error',
  NETWORK_TIMEOUT = 'network.timeout',
  NETWORK_OFFLINE = 'network.offline',

  // Permission Errors
  PERMISSION_DENIED = 'permission.denied',
  PERMISSION_NOT_OWNER = 'permission.notOwner',
  PERMISSION_INSUFFICIENT = 'permission.insufficient',

  // Resource Errors
  RESOURCE_NOT_FOUND = 'resource.notFound',
  RESOURCE_ALREADY_EXISTS = 'resource.alreadyExists',
  RESOURCE_UNAVAILABLE = 'resource.unavailable',

  // Upload Errors
  UPLOAD_FAILED = 'upload.failed',
  UPLOAD_SIZE_EXCEEDED = 'upload.sizeExceeded',
  UPLOAD_INVALID_TYPE = 'upload.invalidType',

  // Payment Errors
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_DECLINED = 'payment.declined',
  PAYMENT_INSUFFICIENT_FUNDS = 'payment.insufficientFunds',

  // Matching Errors
  MATCHING_FAILED = 'matching.failed',
  MATCHING_NO_RESULTS = 'matching.noResults',

  // Generic Errors
  UNEXPECTED_ERROR = 'unexpected.error',
  UNKNOWN_ERROR = 'unknown.error',
}

/**
 * Error message translations for all supported languages
 * Maps error codes to user-friendly messages
 */
export const errorMessages = {
  // Authentication Errors
  'auth.failed': {
    fr: 'Échec de l\'authentification',
    en: 'Authentication failed',
    nl: 'Authenticatie mislukt',
    de: 'Authentifizierung fehlgeschlagen',
  },
  'auth.invalidCredentials': {
    fr: 'Identifiants invalides',
    en: 'Invalid credentials',
    nl: 'Ongeldige inloggegevens',
    de: 'Ungültige Anmeldedaten',
  },
  'auth.userNotFound': {
    fr: 'Utilisateur non trouvé',
    en: 'User not found',
    nl: 'Gebruiker niet gevonden',
    de: 'Benutzer nicht gefunden',
  },
  'auth.sessionExpired': {
    fr: 'Votre session a expiré. Veuillez vous reconnecter.',
    en: 'Your session has expired. Please log in again.',
    nl: 'Uw sessie is verlopen. Log opnieuw in.',
    de: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.',
  },
  'auth.noUser': {
    fr: 'Aucun utilisateur connecté',
    en: 'No user logged in',
    nl: 'Geen gebruiker ingelogd',
    de: 'Kein Benutzer angemeldet',
  },

  // Data Loading Errors
  'load.failed': {
    fr: 'Échec du chargement des données',
    en: 'Failed to load data',
    nl: 'Laden van gegevens mislukt',
    de: 'Fehler beim Laden der Daten',
  },
  'load.profileFailed': {
    fr: 'Échec du chargement du profil',
    en: 'Failed to load profile',
    nl: 'Profiel laden mislukt',
    de: 'Fehler beim Laden des Profils',
  },
  'load.propertiesFailed': {
    fr: 'Échec du chargement des propriétés',
    en: 'Failed to load properties',
    nl: 'Eigenschappen laden mislukt',
    de: 'Fehler beim Laden der Eigenschaften',
  },
  'load.messagesFailed': {
    fr: 'Échec du chargement des messages',
    en: 'Failed to load messages',
    nl: 'Berichten laden mislukt',
    de: 'Fehler beim Laden der Nachrichten',
  },

  // Data Saving Errors
  'save.failed': {
    fr: 'Échec de la sauvegarde',
    en: 'Save failed',
    nl: 'Opslaan mislukt',
    de: 'Speichern fehlgeschlagen',
  },
  'save.profileFailed': {
    fr: 'Échec de la sauvegarde du profil',
    en: 'Failed to save profile',
    nl: 'Profiel opslaan mislukt',
    de: 'Fehler beim Speichern des Profils',
  },
  'save.propertyFailed': {
    fr: 'Échec de la sauvegarde de la propriété',
    en: 'Failed to save property',
    nl: 'Eigenschap opslaan mislukt',
    de: 'Fehler beim Speichern der Eigenschaft',
  },
  'update.failed': {
    fr: 'Échec de la mise à jour',
    en: 'Update failed',
    nl: 'Update mislukt',
    de: 'Aktualisierung fehlgeschlagen',
  },
  'delete.failed': {
    fr: 'Échec de la suppression',
    en: 'Delete failed',
    nl: 'Verwijderen mislukt',
    de: 'Löschen fehlgeschlagen',
  },

  // Validation Errors
  'validation.requiredField': {
    fr: 'Ce champ est requis',
    en: 'This field is required',
    nl: 'Dit veld is verplicht',
    de: 'Dieses Feld ist erforderlich',
  },
  'validation.invalidEmail': {
    fr: 'Adresse email invalide',
    en: 'Invalid email address',
    nl: 'Ongeldig e-mailadres',
    de: 'Ungültige E-Mail-Adresse',
  },
  'validation.invalidPhone': {
    fr: 'Numéro de téléphone invalide',
    en: 'Invalid phone number',
    nl: 'Ongeldig telefoonnummer',
    de: 'Ungültige Telefonnummer',
  },
  'validation.invalidDate': {
    fr: 'Date invalide',
    en: 'Invalid date',
    nl: 'Ongeldige datum',
    de: 'Ungültiges Datum',
  },
  'validation.minLength': {
    fr: 'Longueur minimale non atteinte',
    en: 'Minimum length not met',
    nl: 'Minimale lengte niet bereikt',
    de: 'Mindestlänge nicht erreicht',
  },
  'validation.maxLength': {
    fr: 'Longueur maximale dépassée',
    en: 'Maximum length exceeded',
    nl: 'Maximale lengte overschreden',
    de: 'Maximale Länge überschritten',
  },
  'validation.invalidFormat': {
    fr: 'Format invalide',
    en: 'Invalid format',
    nl: 'Ongeldig formaat',
    de: 'Ungültiges Format',
  },

  // Network Errors
  'network.error': {
    fr: 'Erreur réseau. Vérifiez votre connexion internet.',
    en: 'Network error. Check your internet connection.',
    nl: 'Netwerkfout. Controleer uw internetverbinding.',
    de: 'Netzwerkfehler. Überprüfen Sie Ihre Internetverbindung.',
  },
  'network.timeout': {
    fr: 'Délai d\'attente dépassé. Veuillez réessayer.',
    en: 'Request timeout. Please try again.',
    nl: 'Time-out. Probeer het opnieuw.',
    de: 'Zeitüberschreitung. Bitte versuchen Sie es erneut.',
  },
  'network.offline': {
    fr: 'Vous êtes hors ligne. Vérifiez votre connexion.',
    en: 'You are offline. Check your connection.',
    nl: 'U bent offline. Controleer uw verbinding.',
    de: 'Sie sind offline. Überprüfen Sie Ihre Verbindung.',
  },

  // Permission Errors
  'permission.denied': {
    fr: 'Permission refusée',
    en: 'Permission denied',
    nl: 'Toestemming geweigerd',
    de: 'Berechtigung verweigert',
  },
  'permission.notOwner': {
    fr: 'Vous n\'êtes pas le propriétaire',
    en: 'You are not the owner',
    nl: 'Je bent niet de eigenaar',
    de: 'Sie sind nicht der Eigentümer',
  },
  'permission.insufficient': {
    fr: 'Permissions insuffisantes',
    en: 'Insufficient permissions',
    nl: 'Onvoldoende machtigingen',
    de: 'Unzureichende Berechtigungen',
  },

  // Resource Errors
  'resource.notFound': {
    fr: 'Ressource non trouvée',
    en: 'Resource not found',
    nl: 'Resource niet gevonden',
    de: 'Ressource nicht gefunden',
  },
  'resource.alreadyExists': {
    fr: 'Cette ressource existe déjà',
    en: 'This resource already exists',
    nl: 'Deze resource bestaat al',
    de: 'Diese Ressource existiert bereits',
  },
  'resource.unavailable': {
    fr: 'Ressource temporairement indisponible',
    en: 'Resource temporarily unavailable',
    nl: 'Resource tijdelijk niet beschikbaar',
    de: 'Ressource vorübergehend nicht verfügbar',
  },

  // Upload Errors
  'upload.failed': {
    fr: 'Échec du téléchargement',
    en: 'Upload failed',
    nl: 'Upload mislukt',
    de: 'Upload fehlgeschlagen',
  },
  'upload.sizeExceeded': {
    fr: 'Fichier trop volumineux',
    en: 'File too large',
    nl: 'Bestand te groot',
    de: 'Datei zu groß',
  },
  'upload.invalidType': {
    fr: 'Type de fichier non autorisé',
    en: 'File type not allowed',
    nl: 'Bestandstype niet toegestaan',
    de: 'Dateityp nicht erlaubt',
  },

  // Payment Errors
  'payment.failed': {
    fr: 'Paiement échoué',
    en: 'Payment failed',
    nl: 'Betaling mislukt',
    de: 'Zahlung fehlgeschlagen',
  },
  'payment.declined': {
    fr: 'Paiement refusé',
    en: 'Payment declined',
    nl: 'Betaling geweigerd',
    de: 'Zahlung abgelehnt',
  },
  'payment.insufficientFunds': {
    fr: 'Fonds insuffisants',
    en: 'Insufficient funds',
    nl: 'Onvoldoende saldo',
    de: 'Unzureichende Mittel',
  },

  // Matching Errors
  'matching.failed': {
    fr: 'Échec de la recherche de correspondances',
    en: 'Failed to find matches',
    nl: 'Kan geen matches vinden',
    de: 'Fehler beim Finden von Übereinstimmungen',
  },
  'matching.noResults': {
    fr: 'Aucune correspondance trouvée',
    en: 'No matches found',
    nl: 'Geen matches gevonden',
    de: 'Keine Übereinstimmungen gefunden',
  },

  // Generic Errors
  'unexpected.error': {
    fr: 'Une erreur inattendue s\'est produite',
    en: 'An unexpected error occurred',
    nl: 'Er is een onverwachte fout opgetreden',
    de: 'Ein unerwarteter Fehler ist aufgetreten',
  },
  'unknown.error': {
    fr: 'Erreur inconnue',
    en: 'Unknown error',
    nl: 'Onbekende fout',
    de: 'Unbekannter Fehler',
  },
} as const;

/**
 * Get the current user's language preference
 */
export function getCurrentLanguage(): 'fr' | 'en' | 'nl' | 'de' {
  if (typeof window === 'undefined') return 'fr';

  const savedLang = localStorage.getItem('izzico_language') as 'fr' | 'en' | 'nl' | 'de' | null;
  return savedLang && ['fr', 'en', 'nl', 'de'].includes(savedLang) ? savedLang : 'fr';
}

/**
 * Get translated error message for a specific error code
 *
 * @param errorCode - The error code to translate
 * @param language - Optional language override (defaults to user's preference)
 * @returns Translated error message
 */
export function getErrorMessage(
  errorCode: ErrorCode,
  language?: 'fr' | 'en' | 'nl' | 'de'
): string {
  const lang = language || getCurrentLanguage();
  const messages = errorMessages[errorCode];

  if (!messages) {
    console.warn(`No translation found for error code: ${errorCode}`);
    return errorMessages[ErrorCode.UNKNOWN_ERROR][lang];
  }

  return messages[lang];
}

/**
 * Enhanced error with context information
 */
export interface AppError {
  code: ErrorCode;
  message: string;
  originalError?: unknown;
  context?: Record<string, any>;
  timestamp: Date;
}

/**
 * Create a structured application error
 *
 * @param code - Error code
 * @param originalError - Original error object (if any)
 * @param context - Additional context about the error
 * @returns Structured AppError object
 */
export function createAppError(
  code: ErrorCode,
  originalError?: unknown,
  context?: Record<string, any>
): AppError {
  return {
    code,
    message: getErrorMessage(code),
    originalError,
    context,
    timestamp: new Date(),
  };
}

/**
 * Main error handling function
 * - Logs error to console/service
 * - Shows user-friendly toast notification
 * - Handles different error types appropriately
 *
 * @param error - The error to handle (any type)
 * @param errorCode - Optional specific error code (defaults to UNEXPECTED_ERROR)
 * @param context - Optional context information for logging
 * @param silent - If true, don't show toast notification (useful for background errors)
 */
export function handleError(
  error: unknown,
  errorCode: ErrorCode = ErrorCode.UNEXPECTED_ERROR,
  context?: Record<string, any>,
  silent: boolean = false
): void {
  const appError = createAppError(errorCode, error, context);

  // Log error with context
  logger.error('Application Error', appError.originalError || new Error(appError.message), {
    code: appError.code,
    context: appError.context,
    timestamp: appError.timestamp.toISOString(),
  });

  // Show user-friendly toast notification (unless silent)
  if (!silent) {
    toast.error(appError.message);
  }
}

/**
 * Handle Supabase-specific errors
 * Extracts useful information from Supabase error objects
 *
 * @param error - Supabase error object
 * @param fallbackCode - Fallback error code if specific type can't be determined
 * @param context - Additional context
 */
export function handleSupabaseError(
  error: any,
  fallbackCode: ErrorCode = ErrorCode.UNEXPECTED_ERROR,
  context?: Record<string, any>
): void {
  // Check for specific Supabase error codes/messages
  let errorCode = fallbackCode;

  if (error?.code === '23505') {
    // Unique violation
    errorCode = ErrorCode.RESOURCE_ALREADY_EXISTS;
  } else if (error?.code === '23503') {
    // Foreign key violation
    errorCode = ErrorCode.RESOURCE_NOT_FOUND;
  } else if (error?.code === 'PGRST116') {
    // Row not found
    errorCode = ErrorCode.RESOURCE_NOT_FOUND;
  } else if (error?.message?.includes('JWT')) {
    // Auth error
    errorCode = ErrorCode.AUTH_SESSION_EXPIRED;
  } else if (error?.message?.includes('permission')) {
    // Permission error
    errorCode = ErrorCode.PERMISSION_DENIED;
  }

  handleError(error, errorCode, {
    ...context,
    supabaseCode: error?.code,
    supabaseMessage: error?.message,
  });
}

/**
 * Handle network/fetch errors
 *
 * @param error - Network error
 * @param context - Additional context
 */
export function handleNetworkError(
  error: unknown,
  context?: Record<string, any>
): void {
  let errorCode = ErrorCode.NETWORK_ERROR;

  if (error instanceof TypeError && error.message.includes('fetch')) {
    errorCode = ErrorCode.NETWORK_OFFLINE;
  } else if (error instanceof Error && error.name === 'TimeoutError') {
    errorCode = ErrorCode.NETWORK_TIMEOUT;
  }

  handleError(error, errorCode, context);
}

/**
 * Handle validation errors
 * Shows specific field validation message
 *
 * @param fieldName - Name of the field that failed validation
 * @param errorCode - Specific validation error code
 * @param context - Additional context
 */
export function handleValidationError(
  fieldName: string,
  errorCode: ErrorCode = ErrorCode.VALIDATION_REQUIRED_FIELD,
  context?: Record<string, any>
): void {
  handleError(
    new Error(`Validation failed for field: ${fieldName}`),
    errorCode,
    { ...context, field: fieldName }
  );
}

/**
 * Async error handler wrapper for functions
 * Catches and handles any errors thrown by the wrapped function
 *
 * @param fn - Async function to wrap
 * @param errorCode - Error code to use if function throws
 * @param context - Additional context
 * @returns Wrapped function that handles errors
 *
 * @example
 * ```typescript
 * const saveProfile = withErrorHandler(
 *   async () => {
 *     await supabase.from('profiles').update(data);
 *   },
 *   ErrorCode.SAVE_PROFILE_FAILED,
 *   { userId: user.id }
 * );
 *
 * await saveProfile(); // Errors are automatically handled
 * ```
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorCode: ErrorCode,
  context?: Record<string, any>
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, errorCode, context);
      throw error; // Re-throw so calling code can handle if needed
    }
  }) as T;
}
