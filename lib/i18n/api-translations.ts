/**
 * API Routes i18n Translations
 * Server-side translations for Next.js API routes
 *
 * Usage in API routes:
 * ```
 * import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';
 *
 * export async function POST(request: NextRequest) {
 *   const lang = getApiLanguage(request);
 *   return NextResponse.json({ error: apiT('auth.notAuthenticated', lang) }, { status: 401 });
 * }
 * ```
 */

import { NextRequest } from 'next/server';

export type Language = 'fr' | 'en' | 'nl' | 'de';

// ============================================================================
// LANGUAGE DETECTION
// ============================================================================

/**
 * Detect language from API request
 * Priority: Cookie > Accept-Language header > Default (fr)
 */
export function getApiLanguage(request: NextRequest): Language {
  // 1. Check cookie
  const cookieLang = request.cookies.get('izzico_language')?.value as Language;
  if (cookieLang && isValidLanguage(cookieLang)) {
    return cookieLang;
  }

  // 2. Check Accept-Language header
  const acceptLang = request.headers.get('Accept-Language');
  if (acceptLang) {
    // Parse first language (e.g., "fr-FR,en;q=0.9" -> "fr")
    const primary = acceptLang.split(',')[0]?.split('-')[0]?.toLowerCase();
    if (primary && isValidLanguage(primary as Language)) {
      return primary as Language;
    }
  }

  // 3. Default to French
  return 'fr';
}

function isValidLanguage(lang: string): lang is Language {
  return ['fr', 'en', 'nl', 'de'].includes(lang);
}

// ============================================================================
// API TRANSLATIONS
// ============================================================================

export const apiTranslations = {
  // ────────────────────────────────────────────────────────────────────────
  // COMMON ERRORS
  // ────────────────────────────────────────────────────────────────────────
  common: {
    unexpectedError: {
      fr: 'Une erreur inattendue s\'est produite.',
      en: 'An unexpected error occurred.',
      nl: 'Er is een onverwachte fout opgetreden.',
      de: 'Ein unerwarteter Fehler ist aufgetreten.',
    },
    notAuthenticated: {
      fr: 'Vous devez être connecté.',
      en: 'You must be logged in.',
      nl: 'Je moet ingelogd zijn.',
      de: 'Sie müssen angemeldet sein.',
    },
    invalidRequest: {
      fr: 'Requête invalide.',
      en: 'Invalid request.',
      nl: 'Ongeldige aanvraag.',
      de: 'Ungültige Anfrage.',
    },
    rateLimitExceeded: {
      fr: 'Trop de tentatives. Veuillez réessayer plus tard.',
      en: 'Too many attempts. Please try again later.',
      nl: 'Te veel pogingen. Probeer het later opnieuw.',
      de: 'Zu viele Versuche. Bitte versuchen Sie es später erneut.',
    },
    serverError: {
      fr: 'Erreur serveur. Veuillez réessayer.',
      en: 'Server error. Please try again.',
      nl: 'Serverfout. Probeer het opnieuw.',
      de: 'Serverfehler. Bitte versuchen Sie es erneut.',
    },
    unauthorized: {
      fr: 'Non autorisé.',
      en: 'Unauthorized.',
      nl: 'Niet geautoriseerd.',
      de: 'Nicht autorisiert.',
    },
    internalServerError: {
      fr: 'Erreur serveur interne.',
      en: 'Internal server error.',
      nl: 'Interne serverfout.',
      de: 'Interner Serverfehler.',
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // AUTH (SIGNUP/LOGIN)
  // ────────────────────────────────────────────────────────────────────────
  auth: {
    allFieldsRequired: {
      fr: 'Tous les champs sont requis.',
      en: 'All fields are required.',
      nl: 'Alle velden zijn verplicht.',
      de: 'Alle Felder sind erforderlich.',
    },
    invalidPasswordFormat: {
      fr: 'Format de mot de passe invalide.',
      en: 'Invalid password format.',
      nl: 'Ongeldig wachtwoordformaat.',
      de: 'Ungültiges Passwortformat.',
    },
    passwordLength: {
      fr: 'Le mot de passe doit contenir entre 8 et 128 caractères.',
      en: 'Password must be between 8 and 128 characters.',
      nl: 'Wachtwoord moet tussen 8 en 128 tekens bevatten.',
      de: 'Passwort muss zwischen 8 und 128 Zeichen lang sein.',
    },
    nameLength: {
      fr: 'Le nom doit contenir entre 2 et 100 caractères.',
      en: 'Name must be between 2 and 100 characters.',
      nl: 'Naam moet tussen 2 en 100 tekens bevatten.',
      de: 'Name muss zwischen 2 und 100 Zeichen lang sein.',
    },
    invalidUserType: {
      fr: 'Type d\'utilisateur invalide.',
      en: 'Invalid user type.',
      nl: 'Ongeldig gebruikerstype.',
      de: 'Ungültiger Benutzertyp.',
    },
    tooManySignupAttempts: {
      fr: 'Trop de tentatives d\'inscription. Veuillez réessayer plus tard.',
      en: 'Too many signup attempts. Please try again later.',
      nl: 'Te veel aanmeldpogingen. Probeer het later opnieuw.',
      de: 'Zu viele Anmeldeversuche. Bitte versuchen Sie es später erneut.',
    },
    emailAlreadyExists: {
      fr: 'Un compte existe déjà avec cet email.',
      en: 'An account with this email already exists.',
      nl: 'Er bestaat al een account met dit e-mailadres.',
      de: 'Ein Konto mit dieser E-Mail-Adresse existiert bereits.',
    },
    failedToCreateAccount: {
      fr: 'Échec de la création du compte.',
      en: 'Failed to create account.',
      nl: 'Account aanmaken mislukt.',
      de: 'Konto konnte nicht erstellt werden.',
    },
    emailPasswordRequired: {
      fr: 'Email et mot de passe requis.',
      en: 'Email and password are required.',
      nl: 'E-mail en wachtwoord zijn vereist.',
      de: 'E-Mail und Passwort sind erforderlich.',
    },
    tooManyLoginAttempts: {
      fr: 'Trop de tentatives de connexion. Veuillez réessayer dans quelques minutes.',
      en: 'Too many login attempts. Please try again in a few minutes.',
      nl: 'Te veel inlogpogingen. Probeer het over een paar minuten opnieuw.',
      de: 'Zu viele Anmeldeversuche. Bitte versuchen Sie es in einigen Minuten erneut.',
    },
    accountLocked: {
      fr: 'Compte temporairement verrouillé suite à plusieurs tentatives échouées. Veuillez réessayer dans 15 minutes ou réinitialisez votre mot de passe.',
      en: 'Account temporarily locked due to multiple failed login attempts. Please try again in 15 minutes or reset your password.',
      nl: 'Account tijdelijk vergrendeld vanwege meerdere mislukte inlogpogingen. Probeer het over 15 minuten opnieuw of reset je wachtwoord.',
      de: 'Konto vorübergehend gesperrt wegen mehrerer fehlgeschlagener Anmeldeversuche. Bitte versuchen Sie es in 15 Minuten erneut oder setzen Sie Ihr Passwort zurück.',
    },
    invalidCredentials: {
      fr: 'Email ou mot de passe invalide.',
      en: 'Invalid email or password.',
      nl: 'Ongeldige e-mail of wachtwoord.',
      de: 'Ungültige E-Mail oder Passwort.',
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ASSISTANT / CHAT
  // ────────────────────────────────────────────────────────────────────────
  assistant: {
    rateLimitBurst: {
      fr: 'Veuillez patienter quelques secondes avant de renvoyer un message.',
      en: 'Please wait a few seconds before sending another message.',
      nl: 'Wacht een paar seconden voordat je een nieuw bericht stuurt.',
      de: 'Bitte warten Sie einige Sekunden, bevor Sie eine weitere Nachricht senden.',
    },
    rateLimitGeneral: {
      fr: 'Vous avez atteint la limite de messages. Veuillez réessayer dans une minute.',
      en: 'You have reached the message limit. Please try again in a minute.',
      nl: 'Je hebt de berichtenlimiet bereikt. Probeer het over een minuut opnieuw.',
      de: 'Sie haben das Nachrichtenlimit erreicht. Bitte versuchen Sie es in einer Minute erneut.',
    },
    noMessageReceived: {
      fr: 'Aucun message reçu. Veuillez réessayer.',
      en: 'No message received. Please try again.',
      nl: 'Geen bericht ontvangen. Probeer het opnieuw.',
      de: 'Keine Nachricht erhalten. Bitte versuchen Sie es erneut.',
    },
    emptyMessage: {
      fr: 'Message vide. Veuillez saisir une question.',
      en: 'Empty message. Please enter a question.',
      nl: 'Leeg bericht. Voer een vraag in.',
      de: 'Leere Nachricht. Bitte geben Sie eine Frage ein.',
    },
    temporarilyUnavailable: {
      fr: 'L\'assistant est temporairement indisponible. Veuillez réessayer plus tard.',
      en: 'The assistant is temporarily unavailable. Please try again later.',
      nl: 'De assistent is tijdelijk niet beschikbaar. Probeer het later opnieuw.',
      de: 'Der Assistent ist vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut.',
    },
    technicalProblem: {
      fr: 'Désolé, je rencontre un problème technique. Veuillez réessayer.',
      en: 'Sorry, I am experiencing a technical problem. Please try again.',
      nl: 'Sorry, ik ondervind een technisch probleem. Probeer het opnieuw.',
      de: 'Entschuldigung, ich habe ein technisches Problem. Bitte versuchen Sie es erneut.',
    },
    retryOrContact: {
      fr: 'Veuillez réessayer ou contacter le support si le problème persiste.',
      en: 'Please try again or contact support if the problem persists.',
      nl: 'Probeer het opnieuw of neem contact op met de ondersteuning als het probleem aanhoudt.',
      de: 'Bitte versuchen Sie es erneut oder kontaktieren Sie den Support, wenn das Problem weiterhin besteht.',
    },
    faqModeIntro: {
      fr: "Je suis l'assistant Izzico en mode FAQ.",
      en: 'I am the Izzico assistant in FAQ mode.',
      nl: 'Ik ben de Izzico-assistent in FAQ-modus.',
      de: 'Ich bin der Izzico-Assistent im FAQ-Modus.',
    },
    faqModeHelp: {
      fr: 'Je peux vous aider avec les questions courantes sur :\n• Les **tarifs** et abonnements\n• La **navigation** sur la plateforme\n• Les **fonctionnalités** principales',
      en: 'I can help you with common questions about:\n• **Pricing** and subscriptions\n• **Navigation** on the platform\n• Main **features**',
      nl: 'Ik kan je helpen met veelgestelde vragen over:\n• **Prijzen** en abonnementen\n• **Navigatie** op het platform\n• Belangrijkste **functies**',
      de: 'Ich kann Ihnen bei häufigen Fragen helfen zu:\n• **Preise** und Abonnements\n• **Navigation** auf der Plattform\n• Wichtigste **Funktionen**',
    },
    faqModeContactSupport: {
      fr: "Pour des questions plus complexes, n'hésitez pas à contacter notre support.",
      en: 'For more complex questions, feel free to contact our support.',
      nl: 'Voor complexere vragen kun je contact opnemen met onze ondersteuning.',
      de: 'Bei komplexeren Fragen wenden Sie sich bitte an unseren Support.',
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // PHONE AUTHENTICATION
  // ────────────────────────────────────────────────────────────────────────
  phone: {
    phoneRequired: {
      fr: 'Le numéro de téléphone est requis.',
      en: 'Phone number is required.',
      nl: 'Telefoonnummer is vereist.',
      de: 'Telefonnummer ist erforderlich.',
    },
    invalidFormat: {
      fr: 'Format de numéro invalide. Utilisez un numéro français (+33) ou belge (+32).',
      en: 'Invalid number format. Use a French (+33) or Belgian (+32) number.',
      nl: 'Ongeldig nummerformaat. Gebruik een Frans (+33) of Belgisch (+32) nummer.',
      de: 'Ungültiges Nummernformat. Verwenden Sie eine französische (+33) oder belgische (+32) Nummer.',
    },
    invalidFormatShort: {
      fr: 'Format de numéro invalide.',
      en: 'Invalid number format.',
      nl: 'Ongeldig nummerformaat.',
      de: 'Ungültiges Nummernformat.',
    },
    tooManyCodesToNumber: {
      fr: 'Trop de codes envoyés à ce numéro. Réessayez dans une heure.',
      en: 'Too many codes sent to this number. Try again in an hour.',
      nl: 'Te veel codes naar dit nummer verzonden. Probeer het over een uur opnieuw.',
      de: 'Zu viele Codes an diese Nummer gesendet. Versuchen Sie es in einer Stunde erneut.',
    },
    tooManyAttemptsFromIP: {
      fr: 'Trop de tentatives depuis cette adresse. Réessayez plus tard.',
      en: 'Too many attempts from this address. Try again later.',
      nl: 'Te veel pogingen vanaf dit adres. Probeer het later opnieuw.',
      de: 'Zu viele Versuche von dieser Adresse. Versuchen Sie es später erneut.',
    },
    mustBeLoggedIn: {
      fr: 'Vous devez être connecté pour vérifier votre téléphone.',
      en: 'You must be logged in to verify your phone.',
      nl: 'Je moet ingelogd zijn om je telefoon te verifiëren.',
      de: 'Sie müssen angemeldet sein, um Ihr Telefon zu verifizieren.',
    },
    providerNotConfigured: {
      fr: 'La vérification par téléphone n\'est pas configurée. Contactez le support.',
      en: 'Phone verification is not configured. Contact support.',
      nl: 'Telefoonverificatie is niet geconfigureerd. Neem contact op met ondersteuning.',
      de: 'Telefonverifizierung ist nicht konfiguriert. Kontaktieren Sie den Support.',
    },
    sendError: {
      fr: 'Erreur lors de l\'envoi du SMS. Veuillez réessayer.',
      en: 'Error sending SMS. Please try again.',
      nl: 'Fout bij het verzenden van SMS. Probeer het opnieuw.',
      de: 'Fehler beim Senden der SMS. Bitte versuchen Sie es erneut.',
    },
    codeSent: {
      fr: 'Code envoyé par SMS.',
      en: 'Code sent via SMS.',
      nl: 'Code verzonden via SMS.',
      de: 'Code per SMS gesendet.',
    },
    codeRequired: {
      fr: 'Le code de vérification est requis.',
      en: 'Verification code is required.',
      nl: 'Verificatiecode is vereist.',
      de: 'Bestätigungscode ist erforderlich.',
    },
    codeMust6Digits: {
      fr: 'Le code doit contenir exactement 6 chiffres.',
      en: 'The code must contain exactly 6 digits.',
      nl: 'De code moet precies 6 cijfers bevatten.',
      de: 'Der Code muss genau 6 Ziffern enthalten.',
    },
    tooManyVerifyAttempts: {
      fr: 'Trop de tentatives. Veuillez demander un nouveau code.',
      en: 'Too many attempts. Please request a new code.',
      nl: 'Te veel pogingen. Vraag een nieuwe code aan.',
      de: 'Zu viele Versuche. Bitte fordern Sie einen neuen Code an.',
    },
    codeExpired: {
      fr: 'Le code a expiré. Veuillez demander un nouveau code.',
      en: 'The code has expired. Please request a new code.',
      nl: 'De code is verlopen. Vraag een nieuwe code aan.',
      de: 'Der Code ist abgelaufen. Bitte fordern Sie einen neuen Code an.',
    },
    codeIncorrect: {
      fr: 'Code incorrect. Veuillez vérifier et réessayer.',
      en: 'Incorrect code. Please check and try again.',
      nl: 'Onjuiste code. Controleer en probeer het opnieuw.',
      de: 'Falscher Code. Bitte überprüfen Sie und versuchen Sie es erneut.',
    },
    updateError: {
      fr: 'Erreur lors de la mise à jour. Veuillez réessayer.',
      en: 'Error during update. Please try again.',
      nl: 'Fout tijdens update. Probeer het opnieuw.',
      de: 'Fehler beim Aktualisieren. Bitte versuchen Sie es erneut.',
    },
    verifiedSuccess: {
      fr: 'Numéro de téléphone vérifié avec succès!',
      en: 'Phone number verified successfully!',
      nl: 'Telefoonnummer succesvol geverifieerd!',
      de: 'Telefonnummer erfolgreich verifiziert!',
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // REFERRAL SYSTEM
  // ────────────────────────────────────────────────────────────────────────
  referral: {
    codeApplied: {
      fr: 'Code de parrainage appliqué!',
      en: 'Referral code applied!',
      nl: 'Verwijzingscode toegepast!',
      de: 'Empfehlungscode angewendet!',
    },
    invalidCode: {
      fr: 'Code de parrainage invalide ou expiré.',
      en: 'Invalid or expired referral code.',
      nl: 'Ongeldige of verlopen verwijzingscode.',
      de: 'Ungültiger oder abgelaufener Empfehlungscode.',
    },
    alreadyUsed: {
      fr: 'Vous avez déjà utilisé un code de parrainage.',
      en: 'You have already used a referral code.',
      nl: 'Je hebt al een verwijzingscode gebruikt.',
      de: 'Sie haben bereits einen Empfehlungscode verwendet.',
    },
    cannotUseOwnCode: {
      fr: 'Vous ne pouvez pas utiliser votre propre code.',
      en: 'You cannot use your own code.',
      nl: 'Je kunt je eigen code niet gebruiken.',
      de: 'Sie können Ihren eigenen Code nicht verwenden.',
    },
    statsLoadError: {
      fr: 'Erreur lors du chargement des statistiques.',
      en: 'Error loading statistics.',
      nl: 'Fout bij het laden van statistieken.',
      de: 'Fehler beim Laden der Statistiken.',
    },
    codeGenerateError: {
      fr: 'Erreur lors de la génération du code.',
      en: 'Error generating code.',
      nl: 'Fout bij het genereren van de code.',
      de: 'Fehler beim Generieren des Codes.',
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // INVITATIONS
  // ────────────────────────────────────────────────────────────────────────
  invitations: {
    tokenRequired: {
      fr: 'Token d\'invitation requis.',
      en: 'Invitation token required.',
      nl: 'Uitnodigingstoken vereist.',
      de: 'Einladungstoken erforderlich.',
    },
    invalidToken: {
      fr: 'Invitation invalide ou expirée.',
      en: 'Invalid or expired invitation.',
      nl: 'Ongeldige of verlopen uitnodiging.',
      de: 'Ungültige oder abgelaufene Einladung.',
    },
    alreadyAccepted: {
      fr: 'Cette invitation a déjà été acceptée.',
      en: 'This invitation has already been accepted.',
      nl: 'Deze uitnodiging is al geaccepteerd.',
      de: 'Diese Einladung wurde bereits angenommen.',
    },
    alreadyMember: {
      fr: 'Vous êtes déjà membre de cette propriété.',
      en: 'You are already a member of this property.',
      nl: 'Je bent al lid van dit pand.',
      de: 'Sie sind bereits Mitglied dieser Immobilie.',
    },
    acceptSuccess: {
      fr: 'Invitation acceptée!',
      en: 'Invitation accepted!',
      nl: 'Uitnodiging geaccepteerd!',
      de: 'Einladung angenommen!',
    },
    acceptError: {
      fr: 'Erreur lors de l\'acceptation de l\'invitation.',
      en: 'Error accepting invitation.',
      nl: 'Fout bij accepteren uitnodiging.',
      de: 'Fehler beim Annehmen der Einladung.',
    },
    refuseSuccess: {
      fr: 'Invitation refusée.',
      en: 'Invitation declined.',
      nl: 'Uitnodiging afgewezen.',
      de: 'Einladung abgelehnt.',
    },
    refuseError: {
      fr: 'Erreur lors du refus de l\'invitation.',
      en: 'Error declining invitation.',
      nl: 'Fout bij afwijzen uitnodiging.',
      de: 'Fehler beim Ablehnen der Einladung.',
    },
    createSuccess: {
      fr: 'Invitation créée!',
      en: 'Invitation created!',
      nl: 'Uitnodiging aangemaakt!',
      de: 'Einladung erstellt!',
    },
    createError: {
      fr: 'Erreur lors de la création de l\'invitation.',
      en: 'Error creating invitation.',
      nl: 'Fout bij aanmaken uitnodiging.',
      de: 'Fehler beim Erstellen der Einladung.',
    },
    propertyRequired: {
      fr: 'ID de propriété requis.',
      en: 'Property ID required.',
      nl: 'Eigendom-ID vereist.',
      de: 'Immobilien-ID erforderlich.',
    },
    roleRequired: {
      fr: 'Rôle requis.',
      en: 'Role required.',
      nl: 'Rol vereist.',
      de: 'Rolle erforderlich.',
    },
    notOwner: {
      fr: 'Vous n\'êtes pas propriétaire de ce bien.',
      en: 'You are not the owner of this property.',
      nl: 'Je bent niet de eigenaar van dit pand.',
      de: 'Sie sind nicht der Eigentümer dieser Immobilie.',
    },
    invitationIdRequired: {
      fr: 'ID d\'invitation requis.',
      en: 'Invitation ID required.',
      nl: 'Uitnodigings-ID vereist.',
      de: 'Einladungs-ID erforderlich.',
    },
    notFound: {
      fr: 'Invitation non trouvée.',
      en: 'Invitation not found.',
      nl: 'Uitnodiging niet gevonden.',
      de: 'Einladung nicht gefunden.',
    },
    notYours: {
      fr: 'Cette invitation ne vous est pas destinée.',
      en: 'This invitation is not for you.',
      nl: 'Deze uitnodiging is niet voor jou.',
      de: 'Diese Einladung ist nicht für Sie.',
    },
    tokenMissing: {
      fr: 'Token manquant.',
      en: 'Missing token.',
      nl: 'Ontbrekende token.',
      de: 'Token fehlt.',
    },
    propertyRoleRequired: {
      fr: 'property_id et invited_role sont requis.',
      en: 'property_id and invited_role are required.',
      nl: 'property_id en invited_role zijn vereist.',
      de: 'property_id und invited_role sind erforderlich.',
    },
    invalidRole: {
      fr: 'Rôle invalide.',
      en: 'Invalid role.',
      nl: 'Ongeldige rol.',
      de: 'Ungültige Rolle.',
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // STRIPE / PAYMENTS
  // ────────────────────────────────────────────────────────────────────────
  stripe: {
    sessionCreated: {
      fr: 'Session de paiement créée.',
      en: 'Payment session created.',
      nl: 'Betalingssessie aangemaakt.',
      de: 'Zahlungssitzung erstellt.',
    },
    sessionError: {
      fr: 'Erreur lors de la création de la session de paiement.',
      en: 'Error creating payment session.',
      nl: 'Fout bij het aanmaken van betalingssessie.',
      de: 'Fehler beim Erstellen der Zahlungssitzung.',
    },
    priceIdRequired: {
      fr: 'ID du prix requis.',
      en: 'Price ID required.',
      nl: 'Prijs-ID vereist.',
      de: 'Preis-ID erforderlich.',
    },
    webhookError: {
      fr: 'Erreur du webhook.',
      en: 'Webhook error.',
      nl: 'Webhook-fout.',
      de: 'Webhook-Fehler.',
    },
    signatureInvalid: {
      fr: 'Signature du webhook invalide.',
      en: 'Invalid webhook signature.',
      nl: 'Ongeldige webhook-handtekening.',
      de: 'Ungültige Webhook-Signatur.',
    },
    missingSignatureHeader: {
      fr: 'En-tête de signature Stripe manquant.',
      en: 'Missing stripe-signature header.',
      nl: 'Stripe-handtekeningheader ontbreekt.',
      de: 'Stripe-Signatur-Header fehlt.',
    },
    sessionIdRequired: {
      fr: 'ID de session requis.',
      en: 'Session ID is required.',
      nl: 'Sessie-ID is vereist.',
      de: 'Sitzungs-ID ist erforderlich.',
    },
    sessionNotComplete: {
      fr: 'La session de paiement n\'est pas complète.',
      en: 'The payment session is not complete.',
      nl: 'De betalingssessie is niet voltooid.',
      de: 'Die Zahlungssitzung ist nicht abgeschlossen.',
    },
    sessionNotFound: {
      fr: 'Session introuvable.',
      en: 'Session not found.',
      nl: 'Sessie niet gevonden.',
      de: 'Sitzung nicht gefunden.',
    },
    sessionExpired: {
      fr: 'Cette session de paiement n\'existe pas ou a expiré.',
      en: 'This payment session does not exist or has expired.',
      nl: 'Deze betalingssessie bestaat niet of is verlopen.',
      de: 'Diese Zahlungssitzung existiert nicht oder ist abgelaufen.',
    },
    verificationError: {
      fr: 'Erreur de vérification.',
      en: 'Verification error.',
      nl: 'Verificatiefout.',
      de: 'Verifizierungsfehler.',
    },
    noStripeCustomer: {
      fr: 'Aucun client Stripe trouvé. Veuillez d\'abord souscrire.',
      en: 'No Stripe customer found. Please subscribe first.',
      nl: 'Geen Stripe-klant gevonden. Schrijf je eerst in.',
      de: 'Kein Stripe-Kunde gefunden. Bitte zuerst abonnieren.',
    },
    planRequired: {
      fr: 'Plan requis.',
      en: 'Plan is required.',
      nl: 'Abonnement is vereist.',
      de: 'Abo ist erforderlich.',
    },
    invalidPlan: {
      fr: 'Plan invalide.',
      en: 'Invalid plan.',
      nl: 'Ongeldig abonnement.',
      de: 'Ungültiges Abo.',
    },
    userEmailNotFound: {
      fr: 'Email utilisateur non trouvé.',
      en: 'User email not found.',
      nl: 'Gebruikers-e-mail niet gevonden.',
      de: 'Benutzer-E-Mail nicht gefunden.',
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ADMIN
  // ────────────────────────────────────────────────────────────────────────
  admin: {
    notAuthorized: {
      fr: 'Accès non autorisé.',
      en: 'Unauthorized access.',
      nl: 'Ongeautoriseerde toegang.',
      de: 'Nicht autorisierter Zugriff.',
    },
    adminOnly: {
      fr: 'Réservé aux administrateurs.',
      en: 'Admin only.',
      nl: 'Alleen beheerders.',
      de: 'Nur für Administratoren.',
    },
    forbidden: {
      fr: 'Accès interdit.',
      en: 'Forbidden.',
      nl: 'Verboden.',
      de: 'Verboten.',
    },
    noFileProvided: {
      fr: 'Aucun fichier fourni.',
      en: 'No file provided.',
      nl: 'Geen bestand verstrekt.',
      de: 'Keine Datei bereitgestellt.',
    },
    noVersionIdProvided: {
      fr: 'Aucun ID de version fourni.',
      en: 'No versionId provided.',
      nl: 'Geen versie-ID verstrekt.',
      de: 'Keine Versions-ID bereitgestellt.',
    },
    invalidFileType: {
      fr: 'Type de fichier invalide. Autorisés: JPEG, PNG, WebP.',
      en: 'Invalid file type. Allowed: JPEG, PNG, WebP.',
      nl: 'Ongeldig bestandstype. Toegestaan: JPEG, PNG, WebP.',
      de: 'Ungültiger Dateityp. Erlaubt: JPEG, PNG, WebP.',
    },
    fileTooLarge: {
      fr: 'Fichier trop volumineux. Taille maximale: 10MB.',
      en: 'File too large. Maximum size: 10MB.',
      nl: 'Bestand te groot. Maximale grootte: 10MB.',
      de: 'Datei zu groß. Maximale Größe: 10MB.',
    },
    invalidImage: {
      fr: 'Fichier image invalide. Le fichier peut être corrompu.',
      en: 'Invalid image file. The file may be corrupted or not a real image.',
      nl: 'Ongeldig afbeeldingsbestand. Het bestand is mogelijk beschadigd.',
      de: 'Ungültige Bilddatei. Die Datei ist möglicherweise beschädigt.',
    },
    storageBucketNotConfigured: {
      fr: 'Bucket de stockage non configuré. Contactez l\'administrateur.',
      en: 'Storage bucket not configured. Please contact administrator.',
      nl: 'Opslagbucket niet geconfigureerd. Neem contact op met beheerder.',
      de: 'Speicher-Bucket nicht konfiguriert. Bitte Administrator kontaktieren.',
    },
    versionIdRequired: {
      fr: 'ID de version requis.',
      en: 'versionId required.',
      nl: 'Versie-ID vereist.',
      de: 'Versions-ID erforderlich.',
    },
    pathRequired: {
      fr: 'Chemin requis.',
      en: 'path required.',
      nl: 'Pad vereist.',
      de: 'Pfad erforderlich.',
    },
    accessRequired: {
      fr: 'Accès admin requis.',
      en: 'Admin access required.',
      nl: 'Beheerderstoegang vereist.',
      de: 'Admin-Zugang erforderlich.',
    },
    failedToFetchNotifications: {
      fr: 'Erreur lors de la récupération des notifications.',
      en: 'Failed to fetch notifications.',
      nl: 'Fout bij ophalen van notificaties.',
      de: 'Fehler beim Abrufen der Benachrichtigungen.',
    },
    failedToFetchErrors: {
      fr: 'Erreur lors de la récupération des erreurs.',
      en: 'Failed to fetch errors.',
      nl: 'Fout bij ophalen van fouten.',
      de: 'Fehler beim Abrufen der Fehler.',
    },
    internalError: {
      fr: 'Erreur interne.',
      en: 'Internal error.',
      nl: 'Interne fout.',
      de: 'Interner Fehler.',
    },
    failedToSendTestAlert: {
      fr: 'Erreur lors de l\'envoi de l\'alerte de test.',
      en: 'Failed to send test alert.',
      nl: 'Fout bij verzenden van testalarm.',
      de: 'Fehler beim Senden des Testalarms.',
    },
    failedToCheckConfig: {
      fr: 'Erreur lors de la vérification de la configuration.',
      en: 'Failed to check configuration.',
      nl: 'Fout bij controleren van configuratie.',
      de: 'Fehler beim Überprüfen der Konfiguration.',
    },
    // Admin invitations
    superAdminOnly: {
      fr: 'Seuls les super admins peuvent effectuer cette action.',
      en: 'Only super admins can perform this action.',
      nl: 'Alleen super admins kunnen deze actie uitvoeren.',
      de: 'Nur Super-Admins können diese Aktion ausführen.',
    },
    emailAndRoleRequired: {
      fr: 'Email et rôle requis.',
      en: 'Email and role required.',
      nl: 'E-mail en rol vereist.',
      de: 'E-Mail und Rolle erforderlich.',
    },
    invalidAdminRole: {
      fr: 'Rôle invalide.',
      en: 'Invalid role.',
      nl: 'Ongeldige rol.',
      de: 'Ungültige Rolle.',
    },
    emailAlreadyAdmin: {
      fr: 'Cet email est déjà administrateur.',
      en: 'This email is already an admin.',
      nl: 'Dit e-mailadres is al beheerder.',
      de: 'Diese E-Mail-Adresse ist bereits Administrator.',
    },
    invitePending: {
      fr: 'Une invitation est déjà en attente pour cet email.',
      en: 'An invitation is already pending for this email.',
      nl: 'Er is al een uitnodiging in behandeling voor dit e-mailadres.',
      de: 'Eine Einladung für diese E-Mail-Adresse ist bereits ausstehend.',
    },
    inviteCreateError: {
      fr: 'Erreur lors de la création de l\'invitation.',
      en: 'Error creating invitation.',
      nl: 'Fout bij aanmaken uitnodiging.',
      de: 'Fehler beim Erstellen der Einladung.',
    },
    inviteFetchError: {
      fr: 'Erreur lors de la récupération des invitations.',
      en: 'Error fetching invitations.',
      nl: 'Fout bij ophalen uitnodigingen.',
      de: 'Fehler beim Abrufen der Einladungen.',
    },
    inviteIdRequired: {
      fr: 'ID d\'invitation requis.',
      en: 'Invitation ID required.',
      nl: 'Uitnodigings-ID vereist.',
      de: 'Einladungs-ID erforderlich.',
    },
    inviteNotFound: {
      fr: 'Invitation non trouvée ou déjà traitée.',
      en: 'Invitation not found or already processed.',
      nl: 'Uitnodiging niet gevonden of al verwerkt.',
      de: 'Einladung nicht gefunden oder bereits verarbeitet.',
    },
    inviteCancelError: {
      fr: 'Erreur lors de l\'annulation.',
      en: 'Error cancelling invitation.',
      nl: 'Fout bij annuleren uitnodiging.',
      de: 'Fehler beim Abbrechen der Einladung.',
    },
    tokenAndPasswordRequired: {
      fr: 'Token et mot de passe requis.',
      en: 'Token and password required.',
      nl: 'Token en wachtwoord vereist.',
      de: 'Token und Passwort erforderlich.',
    },
    passwordTooShort: {
      fr: 'Le mot de passe doit contenir au moins 8 caractères.',
      en: 'Password must be at least 8 characters.',
      nl: 'Wachtwoord moet minimaal 8 tekens bevatten.',
      de: 'Passwort muss mindestens 8 Zeichen lang sein.',
    },
    inviteInvalidOrExpired: {
      fr: 'Invitation invalide ou expirée.',
      en: 'Invalid or expired invitation.',
      nl: 'Ongeldige of verlopen uitnodiging.',
      de: 'Ungültige oder abgelaufene Einladung.',
    },
    accountExistsContactAdmin: {
      fr: 'Un compte existe déjà avec cet email. Contactez un administrateur.',
      en: 'An account already exists with this email. Contact an administrator.',
      nl: 'Er bestaat al een account met dit e-mailadres. Neem contact op met een beheerder.',
      de: 'Ein Konto mit dieser E-Mail-Adresse existiert bereits. Kontaktieren Sie einen Administrator.',
    },
    accountCreateError: {
      fr: 'Erreur lors de la création du compte.',
      en: 'Error creating account.',
      nl: 'Fout bij aanmaken account.',
      de: 'Fehler beim Erstellen des Kontos.',
    },
    adminProfileCreateError: {
      fr: 'Erreur lors de la création du profil admin.',
      en: 'Error creating admin profile.',
      nl: 'Fout bij aanmaken admin-profiel.',
      de: 'Fehler beim Erstellen des Admin-Profils.',
    },
    // Admin invite validation
    inviteTokenMissing: {
      fr: 'Token manquant.',
      en: 'Missing token.',
      nl: 'Ontbrekende token.',
      de: 'Token fehlt.',
    },
    inviteTokenNotFound: {
      fr: 'Invitation non trouvée.',
      en: 'Invitation not found.',
      nl: 'Uitnodiging niet gevonden.',
      de: 'Einladung nicht gefunden.',
    },
    inviteAlreadyUsed: {
      fr: 'Cette invitation a déjà été utilisée.',
      en: 'This invitation has already been used.',
      nl: 'Deze uitnodiging is al gebruikt.',
      de: 'Diese Einladung wurde bereits verwendet.',
    },
    inviteCancelled: {
      fr: 'Cette invitation a été annulée.',
      en: 'This invitation has been cancelled.',
      nl: 'Deze uitnodiging is geannuleerd.',
      de: 'Diese Einladung wurde storniert.',
    },
    inviteExpired: {
      fr: 'Cette invitation a expiré.',
      en: 'This invitation has expired.',
      nl: 'Deze uitnodiging is verlopen.',
      de: 'Diese Einladung ist abgelaufen.',
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // MATCHING
  // ────────────────────────────────────────────────────────────────────────
  matching: {
    comingSoon: {
      fr: 'Fonctionnalité bientôt disponible',
      en: 'Feature coming soon',
      nl: 'Functie binnenkort beschikbaar',
      de: 'Funktion bald verfügbar',
    },
    comingSoonMessage: {
      fr: 'La fonction de matching sera disponible prochainement. Inscrivez-vous à la liste d\'attente !',
      en: 'The matching feature will be available soon. Sign up for the waiting list!',
      nl: 'De matchfunctie is binnenkort beschikbaar. Schrijf je in op de wachtlijst!',
      de: 'Die Matching-Funktion wird bald verfügbar sein. Melden Sie sich für die Warteliste an!',
    },
    noMatches: {
      fr: 'Aucun match trouvé.',
      en: 'No matches found.',
      nl: 'Geen matches gevonden.',
      de: 'Keine Übereinstimmungen gefunden.',
    },
    matchHidden: {
      fr: 'Match masqué.',
      en: 'Match hidden.',
      nl: 'Match verborgen.',
      de: 'Übereinstimmung ausgeblendet.',
    },
    matchViewed: {
      fr: 'Match consulté.',
      en: 'Match viewed.',
      nl: 'Match bekeken.',
      de: 'Übereinstimmung angesehen.',
    },
    contactSent: {
      fr: 'Demande de contact envoyée!',
      en: 'Contact request sent!',
      nl: 'Contactverzoek verzonden!',
      de: 'Kontaktanfrage gesendet!',
    },
    matchIdRequired: {
      fr: 'ID du match requis.',
      en: 'Match ID required.',
      nl: 'Match-ID vereist.',
      de: 'Match-ID erforderlich.',
    },
    matchNotFound: {
      fr: 'Match non trouvé.',
      en: 'Match not found.',
      nl: 'Match niet gevonden.',
      de: 'Übereinstimmung nicht gefunden.',
    },
    matchContacted: {
      fr: 'Contact établi avec succès.',
      en: 'Match marked as contacted.',
      nl: 'Match gemarkeerd als gecontacteerd.',
      de: 'Übereinstimmung als kontaktiert markiert.',
    },
    failedCreateConversation: {
      fr: 'Échec de la création de la conversation.',
      en: 'Failed to create conversation.',
      nl: 'Conversatie aanmaken mislukt.',
      de: 'Konversation konnte nicht erstellt werden.',
    },
    forbidden: {
      fr: 'Accès interdit.',
      en: 'Forbidden.',
      nl: 'Verboden.',
      de: 'Verboten.',
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // USER ACCOUNT
  // ────────────────────────────────────────────────────────────────────────
  user: {
    tooManyDeletionRequests: {
      fr: 'Trop de demandes de suppression. Veuillez réessayer plus tard.',
      en: 'Too many deletion requests. Please try again later.',
      nl: 'Te veel verwijderingsverzoeken. Probeer het later opnieuw.',
      de: 'Zu viele Löschanfragen. Bitte versuchen Sie es später erneut.',
    },
    failedToDeleteAccount: {
      fr: 'Échec de la suppression du compte.',
      en: 'Failed to delete account.',
      nl: 'Account verwijderen mislukt.',
      de: 'Konto konnte nicht gelöscht werden.',
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // OCR / AI
  // ────────────────────────────────────────────────────────────────────────
  ocr: {
    noFile: {
      fr: 'Aucun fichier fourni.',
      en: 'No file provided.',
      nl: 'Geen bestand verstrekt.',
      de: 'Keine Datei bereitgestellt.',
    },
    fileTooLarge: {
      fr: 'Fichier trop volumineux (max 10MB).',
      en: 'File too large (max 10MB).',
      nl: 'Bestand te groot (max 10MB).',
      de: 'Datei zu groß (max 10MB).',
    },
    invalidFileType: {
      fr: 'Type de fichier non supporté.',
      en: 'Unsupported file type.',
      nl: 'Niet-ondersteund bestandstype.',
      de: 'Nicht unterstützter Dateityp.',
    },
    processingError: {
      fr: 'Erreur lors du traitement de l\'image.',
      en: 'Error processing image.',
      nl: 'Fout bij verwerken afbeelding.',
      de: 'Fehler bei der Bildverarbeitung.',
    },
    invalidRequestBody: {
      fr: 'Corps de requête invalide - impossible de parser le JSON.',
      en: 'Invalid request body - could not parse JSON.',
      nl: 'Ongeldige aanvraagbody - kon JSON niet parsen.',
      de: 'Ungültiger Anfragebody - JSON konnte nicht geparst werden.',
    },
    missingImageData: {
      fr: 'Données d\'image manquantes (imageBase64 ou mimeType).',
      en: 'Missing image data (imageBase64 or mimeType).',
      nl: 'Ontbrekende afbeeldingsgegevens (imageBase64 of mimeType).',
      de: 'Fehlende Bilddaten (imageBase64 oder mimeType).',
    },
    allProvidersFailed: {
      fr: 'Tous les fournisseurs IA ont échoué. Utilisez la reconnaissance locale.',
      en: 'All AI providers failed or unavailable. Use client-side Tesseract fallback.',
      nl: 'Alle AI-providers gefaald of niet beschikbaar. Gebruik lokale Tesseract-fallback.',
      de: 'Alle KI-Anbieter fehlgeschlagen oder nicht verfügbar. Verwenden Sie den lokalen Tesseract-Fallback.',
    },
    noTextDetected: {
      fr: 'Aucun texte détecté dans l\'image.',
      en: 'No text detected in image.',
      nl: 'Geen tekst gedetecteerd in afbeelding.',
      de: 'Kein Text im Bild erkannt.',
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // OWNER / PAYMENTS
  // ────────────────────────────────────────────────────────────────────────
  owner: {
    reminderSent: {
      fr: 'Rappel de paiement envoyé.',
      en: 'Payment reminder sent.',
      nl: 'Betalingsherinnering verzonden.',
      de: 'Zahlungserinnerung gesendet.',
    },
    reminderError: {
      fr: 'Erreur lors de l\'envoi du rappel.',
      en: 'Error sending reminder.',
      nl: 'Fout bij verzenden herinnering.',
      de: 'Fehler beim Senden der Erinnerung.',
    },
    paymentIdRequired: {
      fr: 'ID du paiement requis.',
      en: 'Payment ID required.',
      nl: 'Betalings-ID vereist.',
      de: 'Zahlungs-ID erforderlich.',
    },
    paymentNotFound: {
      fr: 'Paiement non trouvé.',
      en: 'Payment not found.',
      nl: 'Betaling niet gevonden.',
      de: 'Zahlung nicht gefunden.',
    },
    notPropertyOwner: {
      fr: 'Vous n\'êtes pas propriétaire de ce bien.',
      en: 'You are not the owner of this property.',
      nl: 'Je bent niet de eigenaar van dit pand.',
      de: 'Sie sind nicht der Eigentümer dieser Immobilie.',
    },
    tenantNotFound: {
      fr: 'Locataire non trouvé.',
      en: 'Tenant not found.',
      nl: 'Huurder niet gevonden.',
      de: 'Mieter nicht gefunden.',
    },
    tenantEmailNotAvailable: {
      fr: 'Email du locataire non disponible.',
      en: 'Tenant email not available.',
      nl: 'E-mail van huurder niet beschikbaar.',
      de: 'E-Mail des Mieters nicht verfügbar.',
    },
    reminderSentSuccess: {
      fr: 'Rappel envoyé avec succès.',
      en: 'Reminder sent successfully.',
      nl: 'Herinnering succesvol verzonden.',
      de: 'Erinnerung erfolgreich gesendet.',
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ALERTS
  // ────────────────────────────────────────────────────────────────────────
  alerts: {
    triggered: {
      fr: 'Alerte déclenchée.',
      en: 'Alert triggered.',
      nl: 'Waarschuwing geactiveerd.',
      de: 'Alarm ausgelöst.',
    },
    noNewProperties: {
      fr: 'Aucune nouvelle propriété correspondante.',
      en: 'No new matching properties.',
      nl: 'Geen nieuwe overeenkomende eigendommen.',
      de: 'Keine neuen passenden Immobilien.',
    },
    alertIdRequired: {
      fr: 'ID de l\'alerte requis.',
      en: 'Alert ID required.',
      nl: 'Waarschuwings-ID vereist.',
      de: 'Alarm-ID erforderlich.',
    },
    runError: {
      fr: 'Erreur lors de l\'exécution des alertes.',
      en: 'Failed to run alerts.',
      nl: 'Fout bij uitvoeren van waarschuwingen.',
      de: 'Fehler beim Ausführen der Alarme.',
    },
    runSuccess: {
      fr: 'Alertes exécutées avec succès.',
      en: 'Alerts executed successfully.',
      nl: 'Waarschuwingen succesvol uitgevoerd.',
      de: 'Alarme erfolgreich ausgeführt.',
    },
    usePostInProduction: {
      fr: 'Utilisez la méthode POST en production.',
      en: 'Use POST method in production.',
      nl: 'Gebruik POST-methode in productie.',
      de: 'Verwenden Sie POST-Methode in der Produktion.',
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // PROFILE
  // ────────────────────────────────────────────────────────────────────────
  profile: {
    sectionRequired: {
      fr: 'Section requise.',
      en: 'Section is required.',
      nl: 'Sectie is vereist.',
      de: 'Abschnitt ist erforderlich.',
    },
    invalidSection: {
      fr: 'Section invalide.',
      en: 'Invalid section.',
      nl: 'Ongeldige sectie.',
      de: 'Ungültiger Abschnitt.',
    },
    missingSectionOrData: {
      fr: 'Section ou données manquantes.',
      en: 'Missing section or data.',
      nl: 'Ontbrekende sectie of gegevens.',
      de: 'Fehlende Sektion oder Daten.',
    },
    enhanceError: {
      fr: 'Erreur lors de l\'amélioration du profil.',
      en: 'Error enhancing profile.',
      nl: 'Fout bij verbeteren van profiel.',
      de: 'Fehler bei der Profilverbesserung.',
    },
    profileNotFound: {
      fr: 'Profil non trouvé.',
      en: 'Profile not found.',
      nl: 'Profiel niet gevonden.',
      de: 'Profil nicht gefunden.',
    },
    debugError: {
      fr: 'Erreur lors du débogage du profil.',
      en: 'Error debugging profile.',
      nl: 'Fout bij debuggen van profiel.',
      de: 'Fehler beim Profildebugging.',
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // ANALYTICS
  // ────────────────────────────────────────────────────────────────────────
  analytics: {
    eventRecorded: {
      fr: 'Événement enregistré.',
      en: 'Event recorded.',
      nl: 'Gebeurtenis opgenomen.',
      de: 'Ereignis aufgezeichnet.',
    },
    eventReceived: {
      fr: 'Événement reçu.',
      en: 'Event received.',
      nl: 'Gebeurtenis ontvangen.',
      de: 'Ereignis empfangen.',
    },
    eventError: {
      fr: 'Erreur lors de l\'enregistrement de l\'événement.',
      en: 'Error recording event.',
      nl: 'Fout bij opnemen gebeurtenis.',
      de: 'Fehler beim Aufzeichnen des Ereignisses.',
    },
    invalidEventData: {
      fr: 'Données d\'événement invalides.',
      en: 'Invalid event data.',
      nl: 'Ongeldige gebeurtenisgegevens.',
      de: 'Ungültige Ereignisdaten.',
    },
    invalidJsonFormat: {
      fr: 'Format JSON invalide.',
      en: 'Invalid JSON format.',
      nl: 'Ongeldig JSON-formaat.',
      de: 'Ungültiges JSON-Format.',
    },
    invalidEventFormat: {
      fr: 'Format d\'événement analytique invalide.',
      en: 'Invalid analytics event format.',
      nl: 'Ongeldig formaat voor analytische gebeurtenis.',
      de: 'Ungültiges Analyseereignisformat.',
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // PERFORMANCE / WEB VITALS
  // ────────────────────────────────────────────────────────────────────────
  performance: {
    metricsRecorded: {
      fr: 'Métriques enregistrées.',
      en: 'Metrics recorded.',
      nl: 'Statistieken opgenomen.',
      de: 'Metriken aufgezeichnet.',
    },
    invalidJson: {
      fr: 'JSON invalide.',
      en: 'Invalid JSON.',
      nl: 'Ongeldige JSON.',
      de: 'Ungültiges JSON.',
    },
    metricsError: {
      fr: 'Erreur lors de l\'enregistrement des métriques.',
      en: 'Error recording metrics.',
      nl: 'Fout bij opnemen statistieken.',
      de: 'Fehler beim Aufzeichnen der Metriken.',
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // LOG / ERROR LOGGING
  // ────────────────────────────────────────────────────────────────────────
  log: {
    errorRecorded: {
      fr: 'Erreur enregistrée.',
      en: 'Error recorded.',
      nl: 'Fout opgenomen.',
      de: 'Fehler aufgezeichnet.',
    },
    errorDataRequired: {
      fr: 'Données d\'erreur requises.',
      en: 'Error data required.',
      nl: 'Foutgegevens vereist.',
      de: 'Fehlerdaten erforderlich.',
    },
    loggingError: {
      fr: 'Erreur lors de l\'enregistrement.',
      en: 'Error logging failed.',
      nl: 'Fout bij loggen.',
      de: 'Fehler bei der Protokollierung.',
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // SECURITY / WEBHOOKS
  // ────────────────────────────────────────────────────────────────────────
  security: {
    webhookReceived: {
      fr: 'Webhook de sécurité reçu.',
      en: 'Security webhook received.',
      nl: 'Beveiligingswebhook ontvangen.',
      de: 'Sicherheits-Webhook empfangen.',
    },
    webhookError: {
      fr: 'Erreur lors du traitement du webhook.',
      en: 'Error processing webhook.',
      nl: 'Fout bij verwerken webhook.',
      de: 'Fehler bei der Webhook-Verarbeitung.',
    },
    invalidSignature: {
      fr: 'Signature invalide.',
      en: 'Invalid signature.',
      nl: 'Ongeldige handtekening.',
      de: 'Ungültige Signatur.',
    },
    alertSent: {
      fr: 'Alerte de sécurité envoyée.',
      en: 'Security alert sent.',
      nl: 'Beveiligingswaarschuwing verzonden.',
      de: 'Sicherheitswarnung gesendet.',
    },
    internalError: {
      fr: 'Erreur interne.',
      en: 'Internal error.',
      nl: 'Interne fout.',
      de: 'Interner Fehler.',
    },
    fetchNotificationsError: {
      fr: 'Échec de la récupération des notifications.',
      en: 'Failed to fetch notifications.',
      nl: 'Kon meldingen niet ophalen.',
      de: 'Benachrichtigungen konnten nicht abgerufen werden.',
    },
    fetchErrorsError: {
      fr: 'Échec de la récupération des erreurs.',
      en: 'Failed to fetch errors.',
      nl: 'Kon fouten niet ophalen.',
      de: 'Fehler konnten nicht abgerufen werden.',
    },
    sendTestAlertError: {
      fr: 'Échec de l\'envoi de l\'alerte test.',
      en: 'Failed to send test alert.',
      nl: 'Kon testwaarschuwing niet verzenden.',
      de: 'Testwarnung konnte nicht gesendet werden.',
    },
    testAlertSent: {
      fr: 'Alerte test envoyée.',
      en: 'Test alert sent.',
      nl: 'Testwaarschuwing verzonden.',
      de: 'Testwarnung gesendet.',
    },
    checkConfigError: {
      fr: 'Échec de la vérification de la configuration.',
      en: 'Failed to check configuration.',
      nl: 'Kon configuratie niet controleren.',
      de: 'Konfiguration konnte nicht überprüft werden.',
    },
  },
};

// ============================================================================
// TRANSLATION HELPER
// ============================================================================

/**
 * Get a translation by dot-notation key
 * @param key - Dot notation key (e.g., 'phone.phoneRequired')
 * @param lang - Language code
 * @returns Translated string or the key if not found
 */
export function apiT(key: string, lang: Language = 'fr'): string {
  const keys = key.split('.');
  let result: any = apiTranslations;

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      console.warn(`[i18n] Translation key not found: ${key}`);
      return key;
    }
  }

  if (result && typeof result === 'object' && lang in result) {
    return result[lang];
  }

  console.warn(`[i18n] Language ${lang} not found for key: ${key}`);
  return result?.fr || key;
}

/**
 * Get a translation section
 * @param section - Section key (e.g., 'phone', 'assistant')
 * @param lang - Language code
 * @returns Object with all translations in that section for the given language
 */
export function getApiSection<K extends keyof typeof apiTranslations>(
  section: K,
  lang: Language = 'fr'
): Record<string, string> {
  const sectionData = apiTranslations[section];
  const result: Record<string, string> = {};

  for (const [key, translations] of Object.entries(sectionData)) {
    if (typeof translations === 'object' && lang in translations) {
      result[key] = (translations as Record<Language, string>)[lang];
    }
  }

  return result;
}
