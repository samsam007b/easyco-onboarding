// Internationalization translations for EasyCo
// Supported languages: FR (default), EN, NL, DE

export type Language = 'fr' | 'en' | 'nl' | 'de';

export const languages = {
  fr: { code: 'fr', name: 'Français', flag: '🇫🇷' },
  en: { code: 'en', name: 'English', flag: '🇬🇧' },
  nl: { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  de: { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
} as const;

export const translations = {
  // ============================================================================
  // LANDING PAGE
  // ============================================================================
  landing: {
    hero: {
      title: {
        fr: 'Trouve une coloc fiable et compatible.',
        en: 'Find a reliable and compatible flatshare.',
        nl: 'Vind een betrouwbare en compatibele flatshare.',
        de: 'Finde eine zuverlässige und kompatible WG.',
      },
      subtitle: {
        fr: 'Évite les arnaques. Gagne du temps grâce aux groupes.',
        en: 'Avoid scams. Save time with groups.',
        nl: 'Vermijd oplichting. Bespaar tijd met groepen.',
        de: 'Vermeide Betrug. Spare Zeit mit Gruppen.',
      },
      ctaSearcher: {
        fr: 'Je cherche une coloc',
        en: 'I\'m looking for a flatshare',
        nl: 'Ik zoek een flatshare',
        de: 'Ich suche eine WG',
      },
      ctaOwner: {
        fr: 'Je liste mon bien',
        en: 'List my property',
        nl: 'Mijn eigendom vermelden',
        de: 'Meine Immobilie listen',
      },
      login: {
        fr: 'Se connecter',
        en: 'Log in',
        nl: 'Inloggen',
        de: 'Anmelden',
      },
    },

    benefits: {
      verified: {
        title: {
          fr: '100% Vérifié',
          en: '100% Verified',
          nl: '100% Geverifieerd',
          de: '100% Verifiziert',
        },
        description: {
          fr: 'Identité et annonces vérifiées manuellement. Zéro arnaque garantie.',
          en: 'Manually verified identities and listings. Zero scam guarantee.',
          nl: 'Handmatig geverifieerde identiteiten en advertenties. Nul oplichting gegarandeerd.',
          de: 'Manuell verifizierte Identitäten und Anzeigen. Null Betrug garantiert.',
        },
      },
      compatibility: {
        title: {
          fr: 'Compatibilité Sociale',
          en: 'Social Compatibility',
          nl: 'Sociale Compatibiliteit',
          de: 'Soziale Kompatibilität',
        },
        description: {
          fr: 'Matching intelligent basé sur ton lifestyle, tes horaires et tes valeurs.',
          en: 'Smart matching based on your lifestyle, schedule and values.',
          nl: 'Slimme matching op basis van je levensstijl, schema en waarden.',
          de: 'Intelligentes Matching basierend auf Lebensstil, Zeitplan und Werten.',
        },
      },
      groups: {
        title: {
          fr: 'Groupes Pré-formés',
          en: 'Pre-formed Groups',
          nl: 'Voorgevormde Groepen',
          de: 'Vorgeformte Gruppen',
        },
        description: {
          fr: 'Rejoins des groupes de 2-4 personnes déjà compatibles. 3x plus rapide.',
          en: 'Join groups of 2-4 already compatible people. 3x faster.',
          nl: 'Sluit je aan bij groepen van 2-4 reeds compatibele mensen. 3x sneller.',
          de: 'Tritt Gruppen von 2-4 bereits kompatiblen Personen bei. 3x schneller.',
        },
      },
    },

    trust: {
      idVerified: {
        fr: 'ID vérifié obligatoire',
        en: 'Mandatory ID verification',
        nl: 'Verplichte ID-verificatie',
        de: 'Obligatorische ID-Verifizierung',
      },
      listingsVerified: {
        fr: 'Annonces vérifiées manuellement',
        en: 'Manually verified listings',
        nl: 'Handmatig geverifieerde advertenties',
        de: 'Manuell verifizierte Anzeigen',
      },
      reporting: {
        fr: 'Signalement en 1 clic',
        en: '1-click reporting',
        nl: 'Rapportage met 1 klik',
        de: '1-Klick-Meldung',
      },
      support: {
        fr: 'Support 24/7',
        en: '24/7 Support',
        nl: '24/7 Ondersteuning',
        de: '24/7 Support',
      },
    },

    socialProof: {
      claim: {
        fr: 'Rejoins des milliers de colocataires satisfaits',
        en: 'Join thousands of happy flatmates',
        nl: 'Sluit je aan bij duizenden tevreden huisgenoten',
        de: 'Schließe dich Tausenden zufriedenen Mitbewohnern an',
      },
    },
  },

  // ============================================================================
  // CONSENT PAGE
  // ============================================================================
  consent: {
    title: {
      fr: 'Consentement pour le Test de Compatibilité',
      en: 'Consent for Compatibility Test',
      nl: 'Toestemming voor Compatibiliteitstest',
      de: 'Einwilligung für Kompatibilitätstest',
    },
    subtitle: {
      fr: 'Nous respectons votre vie privée',
      en: 'We respect your privacy',
      nl: 'We respecteren je privacy',
      de: 'Wir respektieren Ihre Privatsphäre',
    },
    description: {
      fr: 'Ce test nous permet de mieux comprendre vos préférences de colocation et de vous proposer les meilleurs matchs. Vos réponses sont traitées de manière anonyme et sécurisée.',
      en: 'This test helps us better understand your flatsharing preferences and offer you the best matches. Your responses are processed anonymously and securely.',
      nl: 'Deze test helpt ons je flatshare-voorkeuren beter te begrijpen en je de beste matches aan te bieden. Je antwoorden worden anoniem en veilig verwerkt.',
      de: 'Dieser Test hilft uns, Ihre WG-Präferenzen besser zu verstehen und Ihnen die besten Matches anzubieten. Ihre Antworten werden anonym und sicher verarbeitet.',
    },
    bullets: {
      anonymous: {
        fr: 'Réponses traitées de manière anonyme',
        en: 'Responses processed anonymously',
        nl: 'Antwoorden anoniem verwerkt',
        de: 'Antworten werden anonym verarbeitet',
      },
      secure: {
        fr: 'Données stockées de manière sécurisée',
        en: 'Data stored securely',
        nl: 'Gegevens veilig opgeslagen',
        de: 'Daten sicher gespeichert',
      },
      improve: {
        fr: 'Amélioration de nos algorithmes de matching',
        en: 'Improvement of our matching algorithms',
        nl: 'Verbetering van onze matching-algoritmes',
        de: 'Verbesserung unserer Matching-Algorithmen',
      },
      optional: {
        fr: 'Vous pouvez refuser sans impact sur votre utilisation',
        en: 'You can decline without impacting your usage',
        nl: 'Je kunt weigeren zonder impact op je gebruik',
        de: 'Sie können ablehnen ohne Auswirkung auf Ihre Nutzung',
      },
    },
    privacy: {
      fr: 'En continuant, vous acceptez notre',
      en: 'By continuing, you accept our',
      nl: 'Door door te gaan, accepteer je onze',
      de: 'Indem Sie fortfahren, akzeptieren Sie unsere',
    },
    privacyLink: {
      fr: 'Politique de confidentialité',
      en: 'Privacy Policy',
      nl: 'Privacybeleid',
      de: 'Datenschutzerklärung',
    },
    ctaAccept: {
      fr: 'Démarrer le test',
      en: 'Start the test',
      nl: 'Test starten',
      de: 'Test starten',
    },
    ctaDecline: {
      fr: 'Annuler',
      en: 'Cancel',
      nl: 'Annuleren',
      de: 'Abbrechen',
    },
  },

  // ============================================================================
  // NAVIGATION & COMMON
  // ============================================================================
  nav: {
    home: {
      fr: 'Accueil',
      en: 'Home',
      nl: 'Home',
      de: 'Startseite',
    },
    howItWorks: {
      fr: 'Comment ça marche',
      en: 'How it works',
      nl: 'Hoe het werkt',
      de: 'Wie es funktioniert',
    },
    about: {
      fr: 'À propos',
      en: 'About',
      nl: 'Over ons',
      de: 'Über uns',
    },
    contact: {
      fr: 'Contact',
      en: 'Contact',
      nl: 'Contact',
      de: 'Kontakt',
    },
    faq: {
      fr: 'FAQ',
      en: 'FAQ',
      nl: 'FAQ',
      de: 'FAQ',
    },
    blog: {
      fr: 'Blog',
      en: 'Blog',
      nl: 'Blog',
      de: 'Blog',
    },
  },

  // ============================================================================
  // FOOTER
  // ============================================================================
  footer: {
    company: {
      fr: 'Entreprise',
      en: 'Company',
      nl: 'Bedrijf',
      de: 'Unternehmen',
    },
    legal: {
      fr: 'Légal',
      en: 'Legal',
      nl: 'Juridisch',
      de: 'Rechtliches',
    },
    support: {
      fr: 'Support',
      en: 'Support',
      nl: 'Ondersteuning',
      de: 'Support',
    },
    privacy: {
      fr: 'Politique de confidentialité',
      en: 'Privacy Policy',
      nl: 'Privacybeleid',
      de: 'Datenschutzerklärung',
    },
    terms: {
      fr: 'Conditions d\'utilisation',
      en: 'Terms of Service',
      nl: 'Gebruiksvoorwaarden',
      de: 'Nutzungsbedingungen',
    },
    mentions: {
      fr: 'Mentions légales',
      en: 'Legal Notice',
      nl: 'Juridische kennisgeving',
      de: 'Impressum',
    },
    cookies: {
      fr: 'Politique cookies',
      en: 'Cookie Policy',
      nl: 'Cookiebeleid',
      de: 'Cookie-Richtlinie',
    },
    copyright: {
      fr: 'Tous droits réservés.',
      en: 'All rights reserved.',
      nl: 'Alle rechten voorbehouden.',
      de: 'Alle Rechte vorbehalten.',
    },
  },

  // ============================================================================
  // COMMON BUTTONS & ACTIONS
  // ============================================================================
  common: {
    continue: {
      fr: 'Continuer',
      en: 'Continue',
      nl: 'Doorgaan',
      de: 'Weiter',
    },
    back: {
      fr: 'Retour',
      en: 'Back',
      nl: 'Terug',
      de: 'Zurück',
    },
    cancel: {
      fr: 'Annuler',
      en: 'Cancel',
      nl: 'Annuleren',
      de: 'Abbrechen',
    },
    save: {
      fr: 'Enregistrer',
      en: 'Save',
      nl: 'Opslaan',
      de: 'Speichern',
    },
    delete: {
      fr: 'Supprimer',
      en: 'Delete',
      nl: 'Verwijderen',
      de: 'Löschen',
    },
    edit: {
      fr: 'Modifier',
      en: 'Edit',
      nl: 'Bewerken',
      de: 'Bearbeiten',
    },
    add: {
      fr: 'Ajouter',
      en: 'Add',
      nl: 'Toevoegen',
      de: 'Hinzufügen',
    },
    loading: {
      fr: 'Chargement...',
      en: 'Loading...',
      nl: 'Laden...',
      de: 'Laden...',
    },
    loadingInfo: {
      fr: 'Chargement de vos informations...',
      en: 'Loading your information...',
      nl: 'Je informatie laden...',
      de: 'Ihre Informationen werden geladen...',
    },
    error: {
      fr: 'Une erreur est survenue',
      en: 'An error occurred',
      nl: 'Er is een fout opgetreden',
      de: 'Ein Fehler ist aufgetreten',
    },
    success: {
      fr: 'Succès !',
      en: 'Success!',
      nl: 'Succes!',
      de: 'Erfolg!',
    },
    required: {
      fr: 'requis',
      en: 'required',
      nl: 'verplicht',
      de: 'erforderlich',
    },
    optional: {
      fr: 'optionnel',
      en: 'optional',
      nl: 'optioneel',
      de: 'optional',
    },
  },

  // ============================================================================
  // ONBOARDING - SEARCHER
  // ============================================================================
  onboarding: {
    // Basic Info Page
    basicInfo: {
      title: {
        fr: 'Informations de base',
        en: 'Basic Info',
        nl: 'Basisinformatie',
        de: 'Grundinformationen',
      },
      subtitle: {
        fr: 'Ces détails nous aident à personnaliser votre expérience.',
        en: 'These details help us personalize your experience.',
        nl: 'Deze gegevens helpen ons je ervaring te personaliseren.',
        de: 'Diese Details helfen uns, Ihre Erfahrung zu personalisieren.',
      },
      subtitleDependent: {
        fr: 'Parlez-nous de la personne pour laquelle vous cherchez.',
        en: "Tell us about the person you're searching for.",
        nl: 'Vertel ons over de persoon waarvoor je zoekt.',
        de: 'Erzählen Sie uns von der Person, für die Sie suchen.',
      },
      dependentBadgeTitle: {
        fr: 'Création d\'un profil dépendant',
        en: 'Creating a dependent profile',
        nl: 'Een afhankelijk profiel aanmaken',
        de: 'Erstellen eines abhängigen Profils',
      },
      dependentBadgeSubtitle: {
        fr: 'Ce profil sera séparé de votre profil personnel',
        en: 'This profile will be separate from your personal profile',
        nl: 'Dit profiel is gescheiden van je persoonlijk profiel',
        de: 'Dieses Profil wird von Ihrem persönlichen Profil getrennt sein',
      },
      profileName: {
        fr: 'Nom du profil',
        en: 'Profile Name',
        nl: 'Profielnaam',
        de: 'Profilname',
      },
      profileNamePlaceholder: {
        fr: 'ex: Profil pour Emma, Pour mon fils',
        en: 'e.g., Profile for Emma, For my son',
        nl: 'bijv. Profiel voor Emma, Voor mijn zoon',
        de: 'z.B. Profil für Emma, Für meinen Sohn',
      },
      profileNameHelp: {
        fr: 'Cela vous aide à identifier ce profil dans votre tableau de bord',
        en: 'This helps you identify this profile in your dashboard',
        nl: 'Dit helpt je dit profiel te identificeren in je dashboard',
        de: 'Dies hilft Ihnen, dieses Profil in Ihrem Dashboard zu identifizieren',
      },
      relationship: {
        fr: 'Relation',
        en: 'Relationship',
        nl: 'Relatie',
        de: 'Beziehung',
      },
      relationshipChild: {
        fr: 'Enfant',
        en: 'Child',
        nl: 'Kind',
        de: 'Kind',
      },
      relationshipFamily: {
        fr: 'Membre de la famille',
        en: 'Family Member',
        nl: 'Familielid',
        de: 'Familienmitglied',
      },
      relationshipFriend: {
        fr: 'Ami(e)',
        en: 'Friend',
        nl: 'Vriend',
        de: 'Freund',
      },
      relationshipOther: {
        fr: 'Autre',
        en: 'Other',
        nl: 'Ander',
        de: 'Andere',
      },
      firstName: {
        fr: 'Prénom',
        en: 'First Name',
        nl: 'Voornaam',
        de: 'Vorname',
      },
      firstNamePlaceholder: {
        fr: 'ex: Jean',
        en: 'e.g., John',
        nl: 'bijv. Jan',
        de: 'z.B. Hans',
      },
      lastName: {
        fr: 'Nom',
        en: 'Last Name',
        nl: 'Achternaam',
        de: 'Nachname',
      },
      lastNamePlaceholder: {
        fr: 'ex: Dupont',
        en: 'e.g., Doe',
        nl: 'bijv. Jansen',
        de: 'z.B. Schmidt',
      },
      dateOfBirth: {
        fr: 'Date de naissance',
        en: 'Date of Birth',
        nl: 'Geboortedatum',
        de: 'Geburtsdatum',
      },
      dateOfBirthPlaceholder: {
        fr: 'jj/mm/aaaa',
        en: 'dd/mm/yyyy',
        nl: 'dd/mm/jjjj',
        de: 'tt/mm/jjjj',
      },
      nationality: {
        fr: 'Nationalité',
        en: 'Nationality',
        nl: 'Nationaliteit',
        de: 'Nationalität',
      },
      nationalityPlaceholder: {
        fr: 'ex: Français, Brésilien',
        en: 'e.g., French, Brazilian',
        nl: 'bijv. Frans, Braziliaans',
        de: 'z.B. Französisch, Brasilianisch',
      },
      languagesSpoken: {
        fr: 'Langues parlées',
        en: 'Languages Spoken',
        nl: 'Gesproken talen',
        de: 'Gesprochene Sprachen',
      },
      languagesPlaceholder: {
        fr: 'Ajouter une langue',
        en: 'Add a language',
        nl: 'Voeg een taal toe',
        de: 'Sprache hinzufügen',
      },
    },

    // Lifestyle preferences
    lifestyle: {
      title: {
        fr: 'Préférences de style de vie',
        en: 'Lifestyle preferences',
        nl: 'Levensstijlvoorkeuren',
        de: 'Lebensstil-Präferenzen',
      },
      nonSmoker: {
        fr: 'Non-fumeur',
        en: 'Non-smoker',
        nl: 'Niet-roker',
        de: 'Nichtraucher',
      },
      quiet: {
        fr: 'Calme',
        en: 'Quiet',
        nl: 'Rustig',
        de: 'Ruhig',
      },
      petFriendly: {
        fr: 'Animaux acceptés',
        en: 'Pet-friendly',
        nl: 'Huisdiervriendelijk',
        de: 'Haustierfreundlich',
      },
      remoteWorker: {
        fr: 'Télétravailleur',
        en: 'Remote worker',
        nl: 'Thuiswerker',
        de: 'Remote-Arbeiter',
      },
      earlyBird: {
        fr: 'Lève-tôt',
        en: 'Early bird',
        nl: 'Vroege vogel',
        de: 'Frühaufsteher',
      },
      nightOwl: {
        fr: 'Couche-tard',
        en: 'Night owl',
        nl: 'Nachtbraker',
        de: 'Nachteule',
      },
    },

    // Owner specific
    owner: {
      welcomeTitle: {
        fr: 'Bienvenue sur EasyCo pour Propriétaires',
        en: 'Welcome to EasyCo for Homeowners',
        nl: 'Welkom bij EasyCo voor Huiseigenaren',
        de: 'Willkommen bei EasyCo für Hausbesitzer',
      },
      welcomeSubtitle: {
        fr: 'Listez votre bien, rencontrez les bons locataires et gérez tout depuis un seul endroit.',
        en: 'List your property, meet the right tenants, and manage everything from one place.',
        nl: 'Vermeld je eigendom, ontmoet de juiste huurders en beheer alles vanaf één plek.',
        de: 'Listen Sie Ihre Immobilie auf, treffen Sie die richtigen Mieter und verwalten Sie alles an einem Ort.',
      },
      profileSetup: {
        fr: 'Configurons votre profil d\'hôte',
        en: "Let's set up your host profile",
        nl: 'Laten we je gastprofiel instellen',
        de: 'Richten wir Ihr Gastgeberprofil ein',
      },
      profileSetupHelp: {
        fr: 'Votre profil vérifié nous aide à établir la confiance avec les locataires potentiels.',
        en: 'Your verified profile helps us build trust with potential tenants.',
        nl: 'Je geverifieerd profiel helpt ons vertrouwen op te bouwen bij potentiële huurders.',
        de: 'Ihr verifiziertes Profil hilft uns, Vertrauen bei potenziellen Mietern aufzubauen.',
      },
      phoneNumber: {
        fr: 'Numéro de téléphone',
        en: 'Phone Number',
        nl: 'Telefoonnummer',
        de: 'Telefonnummer',
      },
      phoneNumberPlaceholder: {
        fr: '+33 6 12 34 56 78',
        en: '+44 20 1234 5678',
        nl: '+31 6 12 34 56 78',
        de: '+49 30 12345678',
      },
      phoneNumberHelp: {
        fr: 'Requis pour la communication avec les locataires',
        en: 'Required for tenant communication',
        nl: 'Vereist voor communicatie met huurders',
        de: 'Erforderlich für die Kommunikation mit Mietern',
      },
      stepOf: {
        fr: 'Étape {current} sur {total}',
        en: 'Step {current} of {total}',
        nl: 'Stap {current} van {total}',
        de: 'Schritt {current} von {total}',
      },
    },

    // Progress & Navigation
    progress: {
      step: {
        fr: 'Étape',
        en: 'Step',
        nl: 'Stap',
        de: 'Schritt',
      },
      of: {
        fr: 'sur',
        en: 'of',
        nl: 'van',
        de: 'von',
      },
      complete: {
        fr: 'Terminé',
        en: 'Complete',
        nl: 'Voltooid',
        de: 'Abgeschlossen',
      },
    },

    // Error messages
    errors: {
      requiredField: {
        fr: 'Ce champ est requis',
        en: 'This field is required',
        nl: 'Dit veld is verplicht',
        de: 'Dieses Feld ist erforderlich',
      },
      invalidEmail: {
        fr: 'Adresse email invalide',
        en: 'Invalid email address',
        nl: 'Ongeldig e-mailadres',
        de: 'Ungültige E-Mail-Adresse',
      },
      loadFailed: {
        fr: 'Échec du chargement des données existantes',
        en: 'Failed to load existing data',
        nl: 'Kan bestaande gegevens niet laden',
        de: 'Fehler beim Laden vorhandener Daten',
      },
      enterName: {
        fr: 'Veuillez entrer votre prénom et nom',
        en: 'Please enter your first and last name',
        nl: 'Voer alstublieft je voor- en achternaam in',
        de: 'Bitte geben Sie Ihren Vor- und Nachnamen ein',
      },
      enterPhone: {
        fr: 'Veuillez entrer votre numéro de téléphone',
        en: 'Please enter your phone number',
        nl: 'Voer alstublieft je telefoonnummer in',
        de: 'Bitte geben Sie Ihre Telefonnummer ein',
      },
    },
  },
};

// Helper function to get translation
export function t(key: string, lang: Language = 'fr'): string {
  const keys = key.split('.');
  let value: any = translations;

  for (const k of keys) {
    value = value?.[k];
    if (!value) return key; // Fallback to key if not found
  }

  return value[lang] || value.fr || key; // Fallback to FR then key
}

// Get all translations for a section
export function getSection(section: keyof typeof translations, lang: Language = 'fr') {
  const sectionData = translations[section];

  function translateObject(obj: any): any {
    if (typeof obj === 'object' && obj !== null) {
      if (obj[lang]) {
        return obj[lang];
      }

      const result: any = {};
      for (const key in obj) {
        result[key] = translateObject(obj[key]);
      }
      return result;
    }
    return obj;
  }

  return translateObject(sectionData);
}
