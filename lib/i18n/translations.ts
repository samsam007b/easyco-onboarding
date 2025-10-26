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
      selectProfileType: {
        fr: 'Veuillez sélectionner pour qui vous cherchez',
        en: 'Please select who you are searching for',
        nl: 'Selecteer alstublieft voor wie je zoekt',
        de: 'Bitte wählen Sie aus, für wen Sie suchen',
      },
    },

    // Profile Type Page
    profileType: {
      title: {
        fr: 'Pour qui cherchez-vous ? 🔍',
        en: 'Who are you searching for? 🔍',
        nl: 'Voor wie zoek je? 🔍',
        de: 'Für wen suchen Sie? 🔍',
      },
      subtitle: {
        fr: 'Cela nous aide à personnaliser votre expérience de recherche',
        en: 'This helps us personalize your search experience',
        nl: 'Dit helpt ons je zoekervaring te personaliseren',
        de: 'Dies hilft uns, Ihre Sucherfahrung zu personalisieren',
      },
      gettingStarted: {
        fr: 'Démarrage',
        en: 'Getting Started',
        nl: 'Aan de slag',
        de: 'Erste Schritte',
      },
      forMyself: {
        fr: 'Pour moi-même',
        en: 'For Myself',
        nl: 'Voor mezelf',
        de: 'Für mich selbst',
      },
      forMyselfDesc: {
        fr: 'Je cherche un espace de colocation pour moi-même',
        en: "I'm looking for a coliving space for myself",
        nl: 'Ik zoek een co-living ruimte voor mezelf',
        de: 'Ich suche einen Co-Living-Raum für mich selbst',
      },
      forSomeoneElse: {
        fr: 'Pour quelqu\'un d\'autre',
        en: 'For Someone Else',
        nl: 'Voor iemand anders',
        de: 'Für jemand anderen',
      },
      forSomeoneElseDesc: {
        fr: 'J\'aide un enfant, un membre de la famille ou un ami à trouver un logement',
        en: "I'm helping a child, family member, or friend find a place",
        nl: 'Ik help een kind, familielid of vriend een plek te vinden',
        de: 'Ich helfe einem Kind, Familienmitglied oder Freund, eine Unterkunft zu finden',
      },
      multipleProfilesNote: {
        fr: '💡 Vous pouvez créer plusieurs profils - un pour vous et des profils séparés pour chaque personne que vous aidez',
        en: "💡 You can create multiple profiles - one for yourself and separate ones for each person you're helping",
        nl: '💡 Je kunt meerdere profielen aanmaken - één voor jezelf en aparte profielen voor elke persoon die je helpt',
        de: '💡 Sie können mehrere Profile erstellen - eines für sich selbst und separate für jede Person, der Sie helfen',
      },
      whyAsk: {
        fr: 'Pourquoi demandons-nous ?',
        en: 'Why do we ask?',
        nl: 'Waarom vragen we dit?',
        de: 'Warum fragen wir?',
      },
      whyAskDesc: {
        fr: 'Cela nous aide à créer des profils de recherche séparés et indépendants. Chaque profil aura ses propres préférences, filtres et matchs - garantissant confidentialité et résultats personnalisés pour chacun.',
        en: 'This helps us create separate, independent search profiles. Each profile will have its own preferences, filters, and matches - ensuring privacy and personalized results for everyone.',
        nl: 'Dit helpt ons om aparte, onafhankelijke zoekprofielen te maken. Elk profiel heeft zijn eigen voorkeuren, filters en matches - wat privacy en gepersonaliseerde resultaten voor iedereen garandeert.',
        de: 'Dies hilft uns, separate, unabhängige Suchprofile zu erstellen. Jedes Profil hat seine eigenen Präferenzen, Filter und Matches - was Privatsphäre und personalisierte Ergebnisse für alle gewährleistet.',
      },
    },

    // Daily Habits Page
    dailyHabits: {
      title: {
        fr: 'Habitudes quotidiennes',
        en: 'Daily Habits',
        nl: 'Dagelijkse gewoonten',
        de: 'Tägliche Gewohnheiten',
      },
      subtitle: {
        fr: 'Votre routine nous aide à trouver des colocataires compatibles.',
        en: 'Your routine helps us find compatible housemates.',
        nl: 'Je routine helpt ons compatibele huisgenoten te vinden.',
        de: 'Ihre Routine hilft uns, kompatible Mitbewohner zu finden.',
      },
      wakeUpTime: {
        fr: 'Heure de réveil',
        en: 'Wake-up time',
        nl: 'Waktijd',
        de: 'Aufwachzeit',
      },
      sleepTime: {
        fr: 'Heure de coucher',
        en: 'Sleep time',
        nl: 'Slaaptijd',
        de: 'Schlafenszeit',
      },
      workSchedule: {
        fr: 'Horaire travail/études',
        en: 'Work/Study schedule',
        nl: 'Werk/studie schema',
        de: 'Arbeits-/Studienplan',
      },
      sportFrequency: {
        fr: 'Fréquence sportive',
        en: 'Sport frequency',
        nl: 'Sportfrequentie',
        de: 'Sporthäufigkeit',
      },
      iAmSmoker: {
        fr: 'Je suis fumeur',
        en: 'I am a smoker',
        nl: 'Ik ben een roker',
        de: 'Ich bin Raucher',
      },
      select: {
        fr: 'Sélectionner...',
        en: 'Select...',
        nl: 'Selecteer...',
        de: 'Auswählen...',
      },
      early5to7: {
        fr: 'Tôt (5-7h)',
        en: 'Early (5-7 AM)',
        nl: 'Vroeg (5-7 uur)',
        de: 'Früh (5-7 Uhr)',
      },
      moderate7to9: {
        fr: 'Modéré (7-9h)',
        en: 'Moderate (7-9 AM)',
        nl: 'Gematigd (7-9 uur)',
        de: 'Moderat (7-9 Uhr)',
      },
      late9plus: {
        fr: 'Tard (9h+)',
        en: 'Late (9 AM+)',
        nl: 'Laat (9 uur+)',
        de: 'Spät (9 Uhr+)',
      },
      early9to10: {
        fr: 'Tôt (21-22h)',
        en: 'Early (9-10 PM)',
        nl: 'Vroeg (21-22 uur)',
        de: 'Früh (21-22 Uhr)',
      },
      moderate10to12: {
        fr: 'Modéré (22-00h)',
        en: 'Moderate (10-12 PM)',
        nl: 'Gematigd (22-00 uur)',
        de: 'Moderat (22-00 Uhr)',
      },
      late12plus: {
        fr: 'Tard (00h+)',
        en: 'Late (12 PM+)',
        nl: 'Laat (00 uur+)',
        de: 'Spät (00 Uhr+)',
      },
      traditional9to5: {
        fr: 'Traditionnel (9h-17h)',
        en: 'Traditional (9-5)',
        nl: 'Traditioneel (9-17)',
        de: 'Traditionell (9-17)',
      },
      flexible: {
        fr: 'Flexible',
        en: 'Flexible',
        nl: 'Flexibel',
        de: 'Flexibel',
      },
      remote: {
        fr: 'À distance',
        en: 'Remote',
        nl: 'Op afstand',
        de: 'Remote',
      },
      student: {
        fr: 'Étudiant',
        en: 'Student',
        nl: 'Student',
        de: 'Student',
      },
      daily: {
        fr: 'Quotidien',
        en: 'Daily',
        nl: 'Dagelijks',
        de: 'Täglich',
      },
      fewTimesWeek: {
        fr: 'Quelques fois par semaine',
        en: 'Few times a week',
        nl: 'Een paar keer per week',
        de: 'Ein paar Mal pro Woche',
      },
      onceWeek: {
        fr: 'Une fois par semaine',
        en: 'Once a week',
        nl: 'Eens per week',
        de: 'Einmal pro Woche',
      },
      rarely: {
        fr: 'Rarement',
        en: 'Rarely',
        nl: 'Zelden',
        de: 'Selten',
      },
    },

    // Success Page
    success: {
      title: {
        fr: 'Profil créé !',
        en: 'Profile Created!',
        nl: 'Profiel aangemaakt!',
        de: 'Profil erstellt!',
      },
      thankYou: {
        fr: 'Merci d\'avoir complété l\'onboarding',
        en: 'Thank you for completing the onboarding',
        nl: 'Bedankt voor het voltooien van de onboarding',
        de: 'Vielen Dank für das Abschließen des Onboardings',
      },
      whatNext: {
        fr: 'Que se passe-t-il ensuite ?',
        en: 'What happens next?',
        nl: 'Wat gebeurt er nu?',
        de: 'Was passiert als Nächstes?',
      },
      profileSaved: {
        fr: 'Votre profil a été enregistré avec succès',
        en: 'Your profile has been saved successfully',
        nl: 'Je profiel is succesvol opgeslagen',
        de: 'Ihr Profil wurde erfolgreich gespeichert',
      },
      findMatches: {
        fr: 'Nous utiliserons vos réponses pour trouver des matchs compatibles',
        en: "We'll use your answers to find compatible matches",
        nl: 'We gebruiken je antwoorden om compatibele matches te vinden',
        de: 'Wir verwenden Ihre Antworten, um kompatible Matches zu finden',
      },
      updateAnytime: {
        fr: 'Vous pouvez mettre à jour vos préférences à tout moment',
        en: 'You can update your preferences anytime',
        nl: 'Je kunt je voorkeuren op elk moment bijwerken',
        de: 'Sie können Ihre Präferenzen jederzeit aktualisieren',
      },
      startBrowsing: {
        fr: 'Commencer à parcourir',
        en: 'Start Browsing',
        nl: 'Begin met bladeren',
        de: 'Mit dem Durchsuchen beginnen',
      },
      enhanceProfile: {
        fr: '✨ Améliorer votre profil',
        en: '✨ Enhance Your Profile',
        nl: '✨ Verbeter je profiel',
        de: '✨ Profil verbessern',
      },
      backToHome: {
        fr: 'Retour à l\'accueil',
        en: 'Back to Home',
        nl: 'Terug naar home',
        de: 'Zurück zur Startseite',
      },
      thankYouNote: {
        fr: 'Votre réponse a été enregistrée. Merci d\'avoir participé à notre test !',
        en: 'Your response has been recorded. Thank you for participating in our test!',
        nl: 'Je antwoord is opgenomen. Bedankt voor je deelname aan onze test!',
        de: 'Ihre Antwort wurde aufgezeichnet. Vielen Dank für Ihre Teilnahme an unserem Test!',
      },
    },

    // Resume Onboarding Modal
    resumeOnboarding: {
      title: {
        fr: 'Reprendre votre profil ?',
        en: 'Resume your profile?',
        nl: 'Je profiel hervatten?',
        de: 'Ihr Profil fortsetzen?',
      },
      subtitle: {
        fr: 'Vous avez commencé à créer votre profil. Voulez-vous continuer là où vous vous êtes arrêté ?',
        en: 'You started creating your profile. Want to continue where you left off?',
        nl: 'Je bent begonnen met het maken van je profiel. Wil je verder gaan waar je gebleven was?',
        de: 'Sie haben begonnen, Ihr Profil zu erstellen. Möchten Sie dort weitermachen, wo Sie aufgehört haben?',
      },
      continue: {
        fr: 'Reprendre',
        en: 'Resume',
        nl: 'Hervatten',
        de: 'Fortsetzen',
      },
      startFresh: {
        fr: 'Recommencer',
        en: 'Start Fresh',
        nl: 'Opnieuw beginnen',
        de: 'Neu beginnen',
      },
      later: {
        fr: 'Plus tard',
        en: 'Later',
        nl: 'Later',
        de: 'Später',
      },
      info: {
        fr: 'Vos réponses sont sauvegardées automatiquement',
        en: 'Your answers are saved automatically',
        nl: 'Je antwoorden worden automatisch opgeslagen',
        de: 'Ihre Antworten werden automatisch gespeichert',
      },
    },
  },

  // ============================================================================
  // LEGAL PAGES
  // ============================================================================
  legal: {
    // Common elements
    common: {
      backToHome: {
        fr: 'Retour à l\'accueil',
        en: 'Back to home',
        nl: 'Terug naar home',
        de: 'Zurück zur Startseite',
      },
      lastUpdated: {
        fr: 'Dernière mise à jour',
        en: 'Last updated',
        nl: 'Laatst bijgewerkt',
        de: 'Zuletzt aktualisiert',
      },
      contact: {
        fr: 'Contact',
        en: 'Contact',
        nl: 'Contact',
        de: 'Kontakt',
      },
      email: {
        fr: 'Email',
        en: 'Email',
        nl: 'E-mail',
        de: 'E-Mail',
      },
      address: {
        fr: 'Adresse',
        en: 'Address',
        nl: 'Adres',
        de: 'Adresse',
      },
    },

    // Privacy Policy
    privacy: {
      title: {
        fr: 'Politique de Confidentialité',
        en: 'Privacy Policy',
        nl: 'Privacybeleid',
        de: 'Datenschutzerklärung',
      },
      subtitle: {
        fr: 'Comment nous collectons, utilisons et protégeons vos données personnelles',
        en: 'How we collect, use and protect your personal data',
        nl: 'Hoe we uw persoonlijke gegevens verzamelen, gebruiken en beschermen',
        de: 'Wie wir Ihre personenbezogenen Daten erfassen, verwenden und schützen',
      },
      intro: {
        fr: 'EasyCo SPRL/BVBA s\'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD).',
        en: 'EasyCo SPRL/BVBA is committed to protecting your privacy. This privacy policy explains how we collect, use, share and protect your personal information in accordance with the General Data Protection Regulation (GDPR).',
        nl: 'EasyCo SPRL/BVBA verbindt zich ertoe uw privacy te beschermen. Dit privacybeleid legt uit hoe we uw persoonlijke informatie verzamelen, gebruiken, delen en beschermen in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG).',
        de: 'EasyCo SPRL/BVBA verpflichtet sich, Ihre Privatsphäre zu schützen. Diese Datenschutzerklärung erklärt, wie wir Ihre persönlichen Informationen gemäß der Datenschutz-Grundverordnung (DSGVO) erfassen, verwenden, weitergeben und schützen.',
      },

      dataCollection: {
        title: {
          fr: '1. Données Collectées',
          en: '1. Data Collection',
          nl: '1. Gegevensverzameling',
          de: '1. Datenerhebung',
        },
        content: {
          fr: 'Nous collectons les données suivantes :',
          en: 'We collect the following data:',
          nl: 'We verzamelen de volgende gegevens:',
          de: 'Wir erheben folgende Daten:',
        },
        personal: {
          fr: 'Informations personnelles : nom, prénom, date de naissance, nationalité',
          en: 'Personal information: first name, last name, date of birth, nationality',
          nl: 'Persoonlijke informatie: voornaam, achternaam, geboortedatum, nationaliteit',
          de: 'Persönliche Informationen: Vorname, Nachname, Geburtsdatum, Nationalität',
        },
        contact: {
          fr: 'Coordonnées : adresse email, numéro de téléphone',
          en: 'Contact details: email address, phone number',
          nl: 'Contactgegevens: e-mailadres, telefoonnummer',
          de: 'Kontaktdaten: E-Mail-Adresse, Telefonnummer',
        },
        account: {
          fr: 'Données de compte : identifiants de connexion, préférences de profil',
          en: 'Account data: login credentials, profile preferences',
          nl: 'Accountgegevens: inloggegevens, profielvoorkeuren',
          de: 'Kontodaten: Anmeldedaten, Profilpräferenzen',
        },
        preferences: {
          fr: 'Préférences de colocation : style de vie, habitudes, compatibilité',
          en: 'Flatsharing preferences: lifestyle, habits, compatibility',
          nl: 'Flatshare-voorkeuren: levensstijl, gewoonten, compatibiliteit',
          de: 'WG-Präferenzen: Lebensstil, Gewohnheiten, Kompatibilität',
        },
        usage: {
          fr: 'Données d\'utilisation : logs de connexion, interactions avec la plateforme',
          en: 'Usage data: login logs, platform interactions',
          nl: 'Gebruiksgegevens: inloglogs, platform-interacties',
          de: 'Nutzungsdaten: Login-Protokolle, Plattform-Interaktionen',
        },
      },

      legalBasis: {
        title: {
          fr: '2. Base Légale du Traitement',
          en: '2. Legal Basis for Processing',
          nl: '2. Rechtsgrondslag voor Verwerking',
          de: '2. Rechtsgrundlage für die Verarbeitung',
        },
        content: {
          fr: 'Nous traitons vos données sur les bases légales suivantes :',
          en: 'We process your data on the following legal bases:',
          nl: 'We verwerken uw gegevens op de volgende rechtsgronden:',
          de: 'Wir verarbeiten Ihre Daten auf folgenden Rechtsgrundlagen:',
        },
        consent: {
          fr: 'Consentement : pour les préférences marketing et les tests de compatibilité',
          en: 'Consent: for marketing preferences and compatibility tests',
          nl: 'Toestemming: voor marketingvoorkeuren en compatibiliteitstests',
          de: 'Einwilligung: für Marketingpräferenzen und Kompatibilitätstests',
        },
        contract: {
          fr: 'Exécution du contrat : pour fournir nos services de matching',
          en: 'Contract performance: to provide our matching services',
          nl: 'Contractuitvoering: om onze matching-diensten te leveren',
          de: 'Vertragserfüllung: zur Bereitstellung unserer Matching-Dienste',
        },
        legal: {
          fr: 'Obligation légale : pour la vérification d\'identité et la conformité',
          en: 'Legal obligation: for identity verification and compliance',
          nl: 'Wettelijke verplichting: voor identiteitsverificatie en naleving',
          de: 'Rechtliche Verpflichtung: für Identitätsprüfung und Compliance',
        },
        legitimate: {
          fr: 'Intérêts légitimes : pour la sécurité et l\'amélioration de la plateforme',
          en: 'Legitimate interests: for security and platform improvement',
          nl: 'Legitieme belangen: voor beveiliging en platformverbetering',
          de: 'Berechtigte Interessen: für Sicherheit und Plattformverbesserung',
        },
      },

      dataUsage: {
        title: {
          fr: '3. Utilisation des Données',
          en: '3. Data Usage',
          nl: '3. Gegevensgebruik',
          de: '3. Datennutzung',
        },
        content: {
          fr: 'Nous utilisons vos données pour :',
          en: 'We use your data to:',
          nl: 'We gebruiken uw gegevens om:',
          de: 'Wir verwenden Ihre Daten um:',
        },
        matching: {
          fr: 'Fournir des services de matching entre colocataires et propriétés',
          en: 'Provide matching services between flatmates and properties',
          nl: 'Matching-diensten te bieden tussen huisgenoten en eigendommen',
          de: 'Matching-Dienste zwischen Mitbewohnern und Immobilien bereitzustellen',
        },
        verification: {
          fr: 'Vérifier votre identité et prévenir les fraudes',
          en: 'Verify your identity and prevent fraud',
          nl: 'Uw identiteit te verifiëren en fraude te voorkomen',
          de: 'Ihre Identität zu überprüfen und Betrug zu verhindern',
        },
        communication: {
          fr: 'Communiquer avec vous concernant votre compte et nos services',
          en: 'Communicate with you regarding your account and our services',
          nl: 'Met u te communiceren over uw account en onze diensten',
          de: 'Mit Ihnen über Ihr Konto und unsere Dienste zu kommunizieren',
        },
        improvement: {
          fr: 'Améliorer nos services et algorithmes de compatibilité',
          en: 'Improve our services and compatibility algorithms',
          nl: 'Onze diensten en compatibiliteitsalgoritmen te verbeteren',
          de: 'Unsere Dienste und Kompatibilitätsalgorithmen zu verbessern',
        },
        legal: {
          fr: 'Respecter nos obligations légales et réglementaires',
          en: 'Comply with our legal and regulatory obligations',
          nl: 'Onze wettelijke en regelgevende verplichtingen na te komen',
          de: 'Unsere rechtlichen und regulatorischen Verpflichtungen zu erfüllen',
        },
      },

      dataStorage: {
        title: {
          fr: '4. Conservation des Données',
          en: '4. Data Storage',
          nl: '4. Gegevensopslag',
          de: '4. Datenspeicherung',
        },
        content: {
          fr: 'Vos données sont conservées aussi longtemps que nécessaire pour fournir nos services. Les comptes inactifs depuis plus de 3 ans sont archivés. Vous pouvez demander la suppression de vos données à tout moment.',
          en: 'Your data is retained as long as necessary to provide our services. Accounts inactive for more than 3 years are archived. You can request deletion of your data at any time.',
          nl: 'Uw gegevens worden bewaard zolang als nodig is om onze diensten te verlenen. Accounts die langer dan 3 jaar inactief zijn, worden gearchiveerd. U kunt op elk moment verwijdering van uw gegevens aanvragen.',
          de: 'Ihre Daten werden so lange gespeichert, wie es zur Bereitstellung unserer Dienste erforderlich ist. Konten, die länger als 3 Jahre inaktiv sind, werden archiviert. Sie können jederzeit die Löschung Ihrer Daten beantragen.',
        },
      },

      userRights: {
        title: {
          fr: '5. Vos Droits',
          en: '5. Your Rights',
          nl: '5. Uw Rechten',
          de: '5. Ihre Rechte',
        },
        content: {
          fr: 'Conformément au RGPD, vous disposez des droits suivants :',
          en: 'In accordance with GDPR, you have the following rights:',
          nl: 'In overeenstemming met de AVG heeft u de volgende rechten:',
          de: 'Gemäß DSGVO haben Sie folgende Rechte:',
        },
        access: {
          fr: 'Droit d\'accès : obtenir une copie de vos données personnelles',
          en: 'Right of access: obtain a copy of your personal data',
          nl: 'Recht op toegang: een kopie van uw persoonlijke gegevens verkrijgen',
          de: 'Auskunftsrecht: eine Kopie Ihrer personenbezogenen Daten erhalten',
        },
        rectification: {
          fr: 'Droit de rectification : corriger vos données inexactes',
          en: 'Right to rectification: correct your inaccurate data',
          nl: 'Recht op rectificatie: uw onjuiste gegevens corrigeren',
          de: 'Berichtigungsrecht: Ihre unrichtigen Daten korrigieren',
        },
        erasure: {
          fr: 'Droit à l\'effacement : demander la suppression de vos données',
          en: 'Right to erasure: request deletion of your data',
          nl: 'Recht op verwijdering: verwijdering van uw gegevens aanvragen',
          de: 'Recht auf Löschung: Löschung Ihrer Daten beantragen',
        },
        portability: {
          fr: 'Droit à la portabilité : recevoir vos données dans un format structuré',
          en: 'Right to portability: receive your data in a structured format',
          nl: 'Recht op overdraagbaarheid: uw gegevens in een gestructureerd formaat ontvangen',
          de: 'Recht auf Datenübertragbarkeit: Ihre Daten in einem strukturierten Format erhalten',
        },
        objection: {
          fr: 'Droit d\'opposition : vous opposer au traitement de vos données',
          en: 'Right to object: object to the processing of your data',
          nl: 'Recht van bezwaar: bezwaar maken tegen de verwerking van uw gegevens',
          de: 'Widerspruchsrecht: der Verarbeitung Ihrer Daten widersprechen',
        },
        withdraw: {
          fr: 'Droit de retirer votre consentement à tout moment',
          en: 'Right to withdraw your consent at any time',
          nl: 'Recht om uw toestemming op elk moment in te trekken',
          de: 'Recht, Ihre Einwilligung jederzeit zu widerrufen',
        },
      },

      cookies: {
        title: {
          fr: '6. Cookies et Technologies Similaires',
          en: '6. Cookies and Similar Technologies',
          nl: '6. Cookies en Vergelijkbare Technologieën',
          de: '6. Cookies und ähnliche Technologien',
        },
        content: {
          fr: 'Nous utilisons des cookies pour améliorer votre expérience. Consultez notre Politique Cookies pour plus de détails.',
          en: 'We use cookies to improve your experience. See our Cookie Policy for more details.',
          nl: 'We gebruiken cookies om uw ervaring te verbeteren. Zie ons Cookiebeleid voor meer details.',
          de: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Siehe unsere Cookie-Richtlinie für weitere Details.',
        },
      },

      security: {
        title: {
          fr: '7. Sécurité des Données',
          en: '7. Data Security',
          nl: '7. Gegevensbeveiliging',
          de: '7. Datensicherheit',
        },
        content: {
          fr: 'Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou destruction. Cela inclut le chiffrement, les pare-feu, les contrôles d\'accès et des audits de sécurité réguliers.',
          en: 'We implement appropriate technical and organizational measures to protect your data against unauthorized access, loss or destruction. This includes encryption, firewalls, access controls and regular security audits.',
          nl: 'We implementeren passende technische en organisatorische maatregelen om uw gegevens te beschermen tegen ongeautoriseerde toegang, verlies of vernietiging. Dit omvat encryptie, firewalls, toegangscontroles en regelmatige beveiligingsaudits.',
          de: 'Wir setzen angemessene technische und organisatorische Maßnahmen um, um Ihre Daten vor unbefugtem Zugriff, Verlust oder Zerstörung zu schützen. Dies umfasst Verschlüsselung, Firewalls, Zugriffskontrollen und regelmäßige Sicherheitsaudits.',
        },
      },

      sharing: {
        title: {
          fr: '8. Partage des Données',
          en: '8. Data Sharing',
          nl: '8. Gegevensdeling',
          de: '8. Datenweitergabe',
        },
        content: {
          fr: 'Nous ne partageons vos données qu\'avec :',
          en: 'We only share your data with:',
          nl: 'We delen uw gegevens alleen met:',
          de: 'Wir geben Ihre Daten nur weiter an:',
        },
        users: {
          fr: 'Autres utilisateurs : informations de profil nécessaires au matching',
          en: 'Other users: profile information necessary for matching',
          nl: 'Andere gebruikers: profielinformatie nodig voor matching',
          de: 'Andere Nutzer: Profilinformationen, die für das Matching erforderlich sind',
        },
        providers: {
          fr: 'Prestataires de services : hébergement, analytics, vérification d\'identité',
          en: 'Service providers: hosting, analytics, identity verification',
          nl: 'Dienstverleners: hosting, analytics, identiteitsverificatie',
          de: 'Dienstleister: Hosting, Analytics, Identitätsprüfung',
        },
        legal: {
          fr: 'Autorités légales : si requis par la loi',
          en: 'Legal authorities: if required by law',
          nl: 'Wettelijke autoriteiten: indien wettelijk vereist',
          de: 'Rechtsbehörden: wenn gesetzlich vorgeschrieben',
        },
      },

      dpo: {
        title: {
          fr: '9. Délégué à la Protection des Données',
          en: '9. Data Protection Officer',
          nl: '9. Functionaris voor Gegevensbescherming',
          de: '9. Datenschutzbeauftragter',
        },
        content: {
          fr: 'Pour toute question concernant vos données personnelles ou pour exercer vos droits, contactez notre DPO à :',
          en: 'For any questions regarding your personal data or to exercise your rights, contact our DPO at:',
          nl: 'Voor vragen over uw persoonlijke gegevens of om uw rechten uit te oefenen, neem contact op met onze FG op:',
          de: 'Für Fragen zu Ihren personenbezogenen Daten oder zur Ausübung Ihrer Rechte kontaktieren Sie unseren DSB unter:',
        },
      },

      changes: {
        title: {
          fr: '10. Modifications de cette Politique',
          en: '10. Changes to this Policy',
          nl: '10. Wijzigingen in dit Beleid',
          de: '10. Änderungen dieser Richtlinie',
        },
        content: {
          fr: 'Nous pouvons mettre à jour cette politique de confidentialité. Les modifications importantes seront communiquées par email. La dernière mise à jour est indiquée en bas de cette page.',
          en: 'We may update this privacy policy. Significant changes will be communicated by email. The last update is indicated at the bottom of this page.',
          nl: 'We kunnen dit privacybeleid bijwerken. Belangrijke wijzigingen worden per e-mail gecommuniceerd. De laatste update wordt onderaan deze pagina aangegeven.',
          de: 'Wir können diese Datenschutzerklärung aktualisieren. Wesentliche Änderungen werden per E-Mail mitgeteilt. Die letzte Aktualisierung ist am Ende dieser Seite angegeben.',
        },
      },
    },

    // Terms of Service
    terms: {
      title: {
        fr: 'Conditions Générales d\'Utilisation',
        en: 'Terms of Service',
        nl: 'Algemene Gebruiksvoorwaarden',
        de: 'Allgemeine Geschäftsbedingungen',
      },
      subtitle: {
        fr: 'Conditions régissant l\'utilisation de la plateforme EasyCo',
        en: 'Terms governing the use of the EasyCo platform',
        nl: 'Voorwaarden voor het gebruik van het EasyCo-platform',
        de: 'Bedingungen für die Nutzung der EasyCo-Plattform',
      },
      intro: {
        fr: 'En utilisant EasyCo, vous acceptez les présentes conditions générales d\'utilisation. Veuillez les lire attentivement avant d\'utiliser nos services.',
        en: 'By using EasyCo, you accept these terms of service. Please read them carefully before using our services.',
        nl: 'Door EasyCo te gebruiken, accepteert u deze algemene gebruiksvoorwaarden. Lees ze zorgvuldig door voordat u onze diensten gebruikt.',
        de: 'Durch die Nutzung von EasyCo akzeptieren Sie diese Allgemeinen Geschäftsbedingungen. Bitte lesen Sie sie sorgfältig durch, bevor Sie unsere Dienste nutzen.',
      },

      service: {
        title: {
          fr: '1. Description du Service',
          en: '1. Service Description',
          nl: '1. Servicebeschrijving',
          de: '1. Dienstbeschreibung',
        },
        content: {
          fr: 'EasyCo est une plateforme de mise en relation pour la colocation en Belgique. Nous offrons :',
          en: 'EasyCo is a matching platform for flatsharing in Belgium. We offer:',
          nl: 'EasyCo is een matchingplatform voor flatsharing in België. We bieden:',
          de: 'EasyCo ist eine Matching-Plattform für WG-Suche in Belgien. Wir bieten:',
        },
        matching: {
          fr: 'Matching intelligent entre chercheurs et propriétés',
          en: 'Smart matching between searchers and properties',
          nl: 'Slimme matching tussen zoekers en eigendommen',
          de: 'Intelligentes Matching zwischen Suchenden und Immobilien',
        },
        verification: {
          fr: 'Vérification d\'identité et d\'annonces',
          en: 'Identity and listing verification',
          nl: 'Identiteits- en advertentieverificatie',
          de: 'Identitäts- und Anzeigenverifizierung',
        },
        groups: {
          fr: 'Formation de groupes compatibles',
          en: 'Compatible group formation',
          nl: 'Compatibele groepsvorming',
          de: 'Kompatible Gruppenbildung',
        },
        communication: {
          fr: 'Outils de communication sécurisés',
          en: 'Secure communication tools',
          nl: 'Veilige communicatietools',
          de: 'Sichere Kommunikationswerkzeuge',
        },
      },

      eligibility: {
        title: {
          fr: '2. Conditions d\'Éligibilité',
          en: '2. Eligibility',
          nl: '2. Geschiktheid',
          de: '2. Berechtigung',
        },
        content: {
          fr: 'Pour utiliser EasyCo, vous devez :',
          en: 'To use EasyCo, you must:',
          nl: 'Om EasyCo te gebruiken, moet u:',
          de: 'Um EasyCo zu nutzen, müssen Sie:',
        },
        age: {
          fr: 'Avoir au moins 18 ans',
          en: 'Be at least 18 years old',
          nl: 'Minimaal 18 jaar oud zijn',
          de: 'Mindestens 18 Jahre alt sein',
        },
        identity: {
          fr: 'Fournir une identité vérifiable',
          en: 'Provide verifiable identity',
          nl: 'Een verifieerbare identiteit verstrekken',
          de: 'Eine überprüfbare Identität angeben',
        },
        accurate: {
          fr: 'Fournir des informations exactes et complètes',
          en: 'Provide accurate and complete information',
          nl: 'Nauwkeurige en volledige informatie verstrekken',
          de: 'Genaue und vollständige Informationen angeben',
        },
        comply: {
          fr: 'Respecter les lois belges et européennes',
          en: 'Comply with Belgian and European laws',
          nl: 'Voldoen aan Belgische en Europese wetten',
          de: 'Belgische und europäische Gesetze einhalten',
        },
      },

      userObligations: {
        title: {
          fr: '3. Obligations de l\'Utilisateur',
          en: '3. User Obligations',
          nl: '3. Gebruikersverplichtingen',
          de: '3. Nutzerpflichten',
        },
        content: {
          fr: 'Vous vous engagez à :',
          en: 'You agree to:',
          nl: 'U stemt ermee in om:',
          de: 'Sie verpflichten sich:',
        },
        truthful: {
          fr: 'Fournir des informations véridiques et à jour',
          en: 'Provide truthful and up-to-date information',
          nl: 'Waarheidsgetrouwe en actuele informatie te verstrekken',
          de: 'Wahrheitsgemäße und aktuelle Informationen bereitzustellen',
        },
        respectful: {
          fr: 'Respecter les autres utilisateurs',
          en: 'Respect other users',
          nl: 'Andere gebruikers te respecteren',
          de: 'Andere Nutzer zu respektieren',
        },
        noScam: {
          fr: 'Ne pas publier d\'annonces frauduleuses',
          en: 'Not post fraudulent listings',
          nl: 'Geen frauduleuze advertenties te plaatsen',
          de: 'Keine betrügerischen Anzeigen zu veröffentlichen',
        },
        security: {
          fr: 'Maintenir la sécurité de votre compte',
          en: 'Maintain the security of your account',
          nl: 'De beveiliging van uw account te handhaven',
          de: 'Die Sicherheit Ihres Kontos zu wahren',
        },
        prohibited: {
          fr: 'Ne pas utiliser la plateforme à des fins illégales',
          en: 'Not use the platform for illegal purposes',
          nl: 'Het platform niet te gebruiken voor illegale doeleinden',
          de: 'Die Plattform nicht für illegale Zwecke zu nutzen',
        },
      },

      intellectualProperty: {
        title: {
          fr: '4. Propriété Intellectuelle',
          en: '4. Intellectual Property',
          nl: '4. Intellectueel Eigendom',
          de: '4. Geistiges Eigentum',
        },
        content: {
          fr: 'Tous les contenus de la plateforme EasyCo (logo, design, algorithmes, textes) sont protégés par le droit d\'auteur et appartiennent à EasyCo SPRL/BVBA. Vous conservez vos droits sur le contenu que vous publiez, mais nous accordez une licence d\'utilisation.',
          en: 'All content on the EasyCo platform (logo, design, algorithms, texts) is protected by copyright and belongs to EasyCo SPRL/BVBA. You retain rights to content you post, but grant us a license to use it.',
          nl: 'Alle inhoud op het EasyCo-platform (logo, ontwerp, algoritmen, teksten) is beschermd door auteursrecht en behoort toe aan EasyCo SPRL/BVBA. U behoudt rechten op inhoud die u plaatst, maar verleent ons een licentie om deze te gebruiken.',
          de: 'Alle Inhalte auf der EasyCo-Plattform (Logo, Design, Algorithmen, Texte) sind urheberrechtlich geschützt und gehören EasyCo SPRL/BVBA. Sie behalten Rechte an von Ihnen veröffentlichten Inhalten, gewähren uns jedoch eine Nutzungslizenz.',
        },
      },

      liability: {
        title: {
          fr: '5. Limitation de Responsabilité',
          en: '5. Limitation of Liability',
          nl: '5. Beperking van Aansprakelijkheid',
          de: '5. Haftungsbeschränkung',
        },
        content: {
          fr: 'EasyCo agit comme intermédiaire. Nous ne sommes pas responsables de :',
          en: 'EasyCo acts as an intermediary. We are not responsible for:',
          nl: 'EasyCo treedt op als tussenpersoon. We zijn niet verantwoordelijk voor:',
          de: 'EasyCo fungiert als Vermittler. Wir sind nicht verantwortlich für:',
        },
        listings: {
          fr: 'La véracité des annonces publiées par les utilisateurs',
          en: 'The truthfulness of listings posted by users',
          nl: 'De waarheidsgetrouwheid van advertenties geplaatst door gebruikers',
          de: 'Die Wahrhaftigkeit von Anzeigen, die von Nutzern veröffentlicht werden',
        },
        disputes: {
          fr: 'Les litiges entre utilisateurs',
          en: 'Disputes between users',
          nl: 'Geschillen tussen gebruikers',
          de: 'Streitigkeiten zwischen Nutzern',
        },
        quality: {
          fr: 'La qualité ou l\'état des propriétés',
          en: 'The quality or condition of properties',
          nl: 'De kwaliteit of staat van eigendommen',
          de: 'Die Qualität oder den Zustand von Immobilien',
        },
        transactions: {
          fr: 'Les transactions financières entre utilisateurs',
          en: 'Financial transactions between users',
          nl: 'Financiële transacties tussen gebruikers',
          de: 'Finanztransaktionen zwischen Nutzern',
        },
        disclaimer: {
          fr: 'Notre responsabilité est limitée au montant des frais payés au cours des 12 derniers mois.',
          en: 'Our liability is limited to the amount of fees paid over the past 12 months.',
          nl: 'Onze aansprakelijkheid is beperkt tot het bedrag van de kosten betaald in de afgelopen 12 maanden.',
          de: 'Unsere Haftung ist auf die Höhe der in den letzten 12 Monaten gezahlten Gebühren begrenzt.',
        },
      },

      termination: {
        title: {
          fr: '6. Résiliation',
          en: '6. Termination',
          nl: '6. Beëindiging',
          de: '6. Kündigung',
        },
        content: {
          fr: 'Vous pouvez supprimer votre compte à tout moment. Nous nous réservons le droit de suspendre ou fermer votre compte en cas de :',
          en: 'You can delete your account at any time. We reserve the right to suspend or close your account in case of:',
          nl: 'U kunt uw account op elk moment verwijderen. We behouden ons het recht voor om uw account op te schorten of te sluiten in geval van:',
          de: 'Sie können Ihr Konto jederzeit löschen. Wir behalten uns das Recht vor, Ihr Konto zu sperren oder zu schließen im Falle von:',
        },
        violation: {
          fr: 'Violation des conditions d\'utilisation',
          en: 'Violation of terms of service',
          nl: 'Schending van de gebruiksvoorwaarden',
          de: 'Verletzung der Nutzungsbedingungen',
        },
        fraud: {
          fr: 'Activité frauduleuse ou suspecte',
          en: 'Fraudulent or suspicious activity',
          nl: 'Frauduleuze of verdachte activiteit',
          de: 'Betrügerische oder verdächtige Aktivität',
        },
        abuse: {
          fr: 'Abus ou harcèlement d\'autres utilisateurs',
          en: 'Abuse or harassment of other users',
          nl: 'Misbruik of intimidatie van andere gebruikers',
          de: 'Missbrauch oder Belästigung anderer Nutzer',
        },
        inactivity: {
          fr: 'Inactivité prolongée (plus de 3 ans)',
          en: 'Prolonged inactivity (more than 3 years)',
          nl: 'Langdurige inactiviteit (meer dan 3 jaar)',
          de: 'Längere Inaktivität (mehr als 3 Jahre)',
        },
      },

      applicableLaw: {
        title: {
          fr: '7. Droit Applicable et Juridiction',
          en: '7. Applicable Law and Jurisdiction',
          nl: '7. Toepasselijk Recht en Jurisdictie',
          de: '7. Anwendbares Recht und Gerichtsstand',
        },
        content: {
          fr: 'Les présentes conditions sont régies par le droit belge. Tout litige sera soumis à la juridiction exclusive des tribunaux de Bruxelles, Belgique.',
          en: 'These terms are governed by Belgian law. Any dispute will be submitted to the exclusive jurisdiction of the courts of Brussels, Belgium.',
          nl: 'Deze voorwaarden worden beheerst door Belgisch recht. Elk geschil wordt voorgelegd aan de exclusieve jurisdictie van de rechtbanken van Brussel, België.',
          de: 'Diese Bedingungen unterliegen belgischem Recht. Alle Streitigkeiten unterliegen der ausschließlichen Zuständigkeit der Gerichte in Brüssel, Belgien.',
        },
      },

      modifications: {
        title: {
          fr: '8. Modifications des Conditions',
          en: '8. Modifications to Terms',
          nl: '8. Wijzigingen van Voorwaarden',
          de: '8. Änderungen der Bedingungen',
        },
        content: {
          fr: 'Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications importantes seront notifiées par email 30 jours à l\'avance. La poursuite de l\'utilisation après modification constitue une acceptation.',
          en: 'We reserve the right to modify these terms at any time. Significant changes will be notified by email 30 days in advance. Continued use after modification constitutes acceptance.',
          nl: 'We behouden ons het recht voor om deze voorwaarden op elk moment te wijzigen. Belangrijke wijzigingen worden 30 dagen van tevoren per e-mail gemeld. Voortgezet gebruik na wijziging vormt acceptatie.',
          de: 'Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu ändern. Wesentliche Änderungen werden 30 Tage im Voraus per E-Mail mitgeteilt. Die fortgesetzte Nutzung nach Änderung stellt eine Annahme dar.',
        },
      },

      contact: {
        title: {
          fr: '9. Contact',
          en: '9. Contact',
          nl: '9. Contact',
          de: '9. Kontakt',
        },
        content: {
          fr: 'Pour toute question concernant ces conditions :',
          en: 'For any questions regarding these terms:',
          nl: 'Voor vragen over deze voorwaarden:',
          de: 'Für Fragen zu diesen Bedingungen:',
        },
      },
    },

    // Legal Mentions
    mentions: {
      title: {
        fr: 'Mentions Légales',
        en: 'Legal Notice',
        nl: 'Juridische Kennisgeving',
        de: 'Impressum',
      },
      subtitle: {
        fr: 'Informations légales sur EasyCo SPRL/BVBA',
        en: 'Legal information about EasyCo SPRL/BVBA',
        nl: 'Juridische informatie over EasyCo SPRL/BVBA',
        de: 'Rechtliche Informationen über EasyCo SPRL/BVBA',
      },

      company: {
        title: {
          fr: '1. Identification de l\'Entreprise',
          en: '1. Company Identification',
          nl: '1. Bedrijfsidentificatie',
          de: '1. Unternehmensidentifikation',
        },
        name: {
          fr: 'Dénomination sociale',
          en: 'Company name',
          nl: 'Bedrijfsnaam',
          de: 'Firmenname',
        },
        form: {
          fr: 'Forme juridique',
          en: 'Legal form',
          nl: 'Rechtsvorm',
          de: 'Rechtsform',
        },
        formValue: {
          fr: 'SPRL/BVBA (Société Privée à Responsabilité Limitée / Besloten Vennootschap met Beperkte Aansprakelijkheid)',
          en: 'SPRL/BVBA (Private Limited Liability Company)',
          nl: 'SPRL/BVBA (Besloten Vennootschap met Beperkte Aansprakelijkheid)',
          de: 'SPRL/BVBA (Gesellschaft mit beschränkter Haftung)',
        },
        vat: {
          fr: 'Numéro de TVA',
          en: 'VAT number',
          nl: 'BTW-nummer',
          de: 'USt-IdNr.',
        },
        vatValue: {
          fr: 'BE 0XXX.XXX.XXX (à déterminer)',
          en: 'BE 0XXX.XXX.XXX (to be determined)',
          nl: 'BE 0XXX.XXX.XXX (nog te bepalen)',
          de: 'BE 0XXX.XXX.XXX (wird festgelegt)',
        },
        registration: {
          fr: 'Numéro d\'entreprise',
          en: 'Company number',
          nl: 'Ondernemingsnummer',
          de: 'Unternehmensnummer',
        },
        registrationValue: {
          fr: '0XXX.XXX.XXX (à déterminer)',
          en: '0XXX.XXX.XXX (to be determined)',
          nl: '0XXX.XXX.XXX (nog te bepalen)',
          de: '0XXX.XXX.XXX (wird festgelegt)',
        },
      },

      headquarters: {
        title: {
          fr: '2. Siège Social',
          en: '2. Registered Office',
          nl: '2. Maatschappelijke Zetel',
          de: '2. Eingetragener Sitz',
        },
        address: {
          fr: 'Adresse',
          en: 'Address',
          nl: 'Adres',
          de: 'Adresse',
        },
        addressValue: {
          fr: 'Rue Example 123, 1000 Bruxelles, Belgique',
          en: 'Rue Example 123, 1000 Brussels, Belgium',
          nl: 'Rue Example 123, 1000 Brussel, België',
          de: 'Rue Example 123, 1000 Brüssel, Belgien',
        },
      },

      contact: {
        title: {
          fr: '3. Contact',
          en: '3. Contact',
          nl: '3. Contact',
          de: '3. Kontakt',
        },
        emailLabel: {
          fr: 'Email',
          en: 'Email',
          nl: 'E-mail',
          de: 'E-Mail',
        },
        emailValue: {
          fr: 'contact@easyco.be',
          en: 'contact@easyco.be',
          nl: 'contact@easyco.be',
          de: 'contact@easyco.be',
        },
        website: {
          fr: 'Site web',
          en: 'Website',
          nl: 'Website',
          de: 'Website',
        },
        websiteValue: {
          fr: 'www.easyco.be',
          en: 'www.easyco.be',
          nl: 'www.easyco.be',
          de: 'www.easyco.be',
        },
      },

      director: {
        title: {
          fr: '4. Directeur de la Publication',
          en: '4. Publication Director',
          nl: '4. Publicatiedirecteur',
          de: '4. Veröffentlichungsleiter',
        },
        content: {
          fr: 'Le directeur de la publication est le représentant légal de EasyCo SPRL/BVBA.',
          en: 'The publication director is the legal representative of EasyCo SPRL/BVBA.',
          nl: 'De publicatiedirecteur is de wettelijke vertegenwoordiger van EasyCo SPRL/BVBA.',
          de: 'Der Veröffentlichungsleiter ist der gesetzliche Vertreter von EasyCo SPRL/BVBA.',
        },
      },

      hosting: {
        title: {
          fr: '5. Hébergement',
          en: '5. Hosting',
          nl: '5. Hosting',
          de: '5. Hosting',
        },
        content: {
          fr: 'Le site est hébergé par :',
          en: 'The website is hosted by:',
          nl: 'De website wordt gehost door:',
          de: 'Die Website wird gehostet von:',
        },
        provider: {
          fr: 'Vercel Inc.',
          en: 'Vercel Inc.',
          nl: 'Vercel Inc.',
          de: 'Vercel Inc.',
        },
        providerAddress: {
          fr: '340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis',
          en: '340 S Lemon Ave #4133, Walnut, CA 91789, United States',
          nl: '340 S Lemon Ave #4133, Walnut, CA 91789, Verenigde Staten',
          de: '340 S Lemon Ave #4133, Walnut, CA 91789, Vereinigte Staaten',
        },
      },

      activity: {
        title: {
          fr: '6. Activité',
          en: '6. Activity',
          nl: '6. Activiteit',
          de: '6. Tätigkeit',
        },
        content: {
          fr: 'EasyCo est une plateforme digitale de mise en relation pour la colocation et le colivingn en Belgique. Nous facilitons la recherche de colocataires compatibles et de logements adaptés grâce à des algorithmes de matching intelligents.',
          en: 'EasyCo is a digital matching platform for flatsharing and coliving in Belgium. We facilitate the search for compatible flatmates and suitable housing through smart matching algorithms.',
          nl: 'EasyCo is een digitaal matchingplatform voor flatsharing en coliving in België. We faciliteren het zoeken naar compatibele huisgenoten en geschikte huisvesting via slimme matching-algoritmen.',
          de: 'EasyCo ist eine digitale Matching-Plattform für WG-Suche und Coliving in Belgien. Wir erleichtern die Suche nach kompatiblen Mitbewohnern und geeigneten Unterkünften durch intelligente Matching-Algorithmen.',
        },
      },

      intellectualProperty: {
        title: {
          fr: '7. Propriété Intellectuelle',
          en: '7. Intellectual Property',
          nl: '7. Intellectueel Eigendom',
          de: '7. Geistiges Eigentum',
        },
        content: {
          fr: 'L\'ensemble du contenu de ce site (textes, images, logos, algorithmes) est la propriété exclusive de EasyCo SPRL/BVBA et est protégé par les lois sur la propriété intellectuelle. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable.',
          en: 'All content on this website (texts, images, logos, algorithms) is the exclusive property of EasyCo SPRL/BVBA and is protected by intellectual property laws. Any reproduction, even partial, is strictly prohibited without prior authorization.',
          nl: 'Alle inhoud op deze website (teksten, afbeeldingen, logo\'s, algoritmen) is het exclusieve eigendom van EasyCo SPRL/BVBA en wordt beschermd door wetgeving inzake intellectuele eigendom. Elke reproductie, zelfs gedeeltelijk, is strikt verboden zonder voorafgaande toestemming.',
          de: 'Alle Inhalte dieser Website (Texte, Bilder, Logos, Algorithmen) sind ausschließliches Eigentum von EasyCo SPRL/BVBA und durch Gesetze zum Schutz des geistigen Eigentums geschützt. Jede Reproduktion, auch teilweise, ist ohne vorherige Genehmigung strengstens untersagt.',
        },
      },

      disputes: {
        title: {
          fr: '8. Règlement des Litiges',
          en: '8. Dispute Resolution',
          nl: '8. Geschillenbeslechting',
          de: '8. Streitbeilegung',
        },
        content: {
          fr: 'Conformément à la législation européenne, vous pouvez recourir à la plateforme de résolution des litiges en ligne : https://ec.europa.eu/consumers/odr/',
          en: 'In accordance with European legislation, you can use the online dispute resolution platform: https://ec.europa.eu/consumers/odr/',
          nl: 'In overeenstemming met de Europese wetgeving kunt u gebruik maken van het online geschillenbeslechtingsplatform: https://ec.europa.eu/consumers/odr/',
          de: 'Gemäß europäischer Gesetzgebung können Sie die Online-Streitbeilegungsplattform nutzen: https://ec.europa.eu/consumers/odr/',
        },
      },
    },

    // Cookie Policy
    cookies: {
      title: {
        fr: 'Politique Cookies',
        en: 'Cookie Policy',
        nl: 'Cookiebeleid',
        de: 'Cookie-Richtlinie',
      },
      subtitle: {
        fr: 'Comment nous utilisons les cookies et technologies similaires',
        en: 'How we use cookies and similar technologies',
        nl: 'Hoe we cookies en vergelijkbare technologieën gebruiken',
        de: 'Wie wir Cookies und ähnliche Technologien verwenden',
      },
      intro: {
        fr: 'EasyCo utilise des cookies et technologies similaires pour améliorer votre expérience sur notre plateforme. Cette politique explique ce que sont les cookies, comment nous les utilisons et comment vous pouvez les gérer.',
        en: 'EasyCo uses cookies and similar technologies to improve your experience on our platform. This policy explains what cookies are, how we use them and how you can manage them.',
        nl: 'EasyCo gebruikt cookies en vergelijkbare technologieën om uw ervaring op ons platform te verbeteren. Dit beleid legt uit wat cookies zijn, hoe we ze gebruiken en hoe u ze kunt beheren.',
        de: 'EasyCo verwendet Cookies und ähnliche Technologien, um Ihre Erfahrung auf unserer Plattform zu verbessern. Diese Richtlinie erklärt, was Cookies sind, wie wir sie verwenden und wie Sie sie verwalten können.',
      },

      whatAre: {
        title: {
          fr: '1. Qu\'est-ce qu\'un Cookie ?',
          en: '1. What is a Cookie?',
          nl: '1. Wat is een Cookie?',
          de: '1. Was ist ein Cookie?',
        },
        content: {
          fr: 'Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez un site web. Les cookies permettent au site de mémoriser vos actions et préférences sur une période donnée.',
          en: 'A cookie is a small text file stored on your device when you visit a website. Cookies allow the website to remember your actions and preferences over a period of time.',
          nl: 'Een cookie is een klein tekstbestand dat op uw apparaat wordt opgeslagen wanneer u een website bezoekt. Cookies stellen de website in staat om uw acties en voorkeuren gedurende een bepaalde periode te onthouden.',
          de: 'Ein Cookie ist eine kleine Textdatei, die auf Ihrem Gerät gespeichert wird, wenn Sie eine Website besuchen. Cookies ermöglichen es der Website, sich Ihre Aktionen und Präferenzen über einen bestimmten Zeitraum zu merken.',
        },
      },

      types: {
        title: {
          fr: '2. Types de Cookies Utilisés',
          en: '2. Types of Cookies Used',
          nl: '2. Soorten Gebruikte Cookies',
          de: '2. Arten verwendeter Cookies',
        },
        essential: {
          title: {
            fr: 'Cookies Essentiels',
            en: 'Essential Cookies',
            nl: 'Essentiële Cookies',
            de: 'Essenzielle Cookies',
          },
          content: {
            fr: 'Nécessaires au fonctionnement du site. Ils permettent la navigation, l\'authentification et l\'accès aux zones sécurisées. Ces cookies ne peuvent pas être désactivés.',
            en: 'Necessary for the website to function. They enable navigation, authentication and access to secure areas. These cookies cannot be disabled.',
            nl: 'Noodzakelijk voor het functioneren van de website. Ze maken navigatie, authenticatie en toegang tot beveiligde gebieden mogelijk. Deze cookies kunnen niet worden uitgeschakeld.',
            de: 'Erforderlich für das Funktionieren der Website. Sie ermöglichen Navigation, Authentifizierung und Zugang zu gesicherten Bereichen. Diese Cookies können nicht deaktiviert werden.',
          },
          examples: {
            fr: 'Exemples : session d\'utilisateur, préférences de langue, panier',
            en: 'Examples: user session, language preferences, cart',
            nl: 'Voorbeelden: gebruikerssessie, taalvoorkeuren, winkelwagen',
            de: 'Beispiele: Benutzersitzung, Sprachpräferenzen, Warenkorb',
          },
        },
        functional: {
          title: {
            fr: 'Cookies Fonctionnels',
            en: 'Functional Cookies',
            nl: 'Functionele Cookies',
            de: 'Funktionale Cookies',
          },
          content: {
            fr: 'Améliorent l\'expérience utilisateur en mémorisant vos préférences et choix.',
            en: 'Improve user experience by remembering your preferences and choices.',
            nl: 'Verbeteren de gebruikerservaring door uw voorkeuren en keuzes te onthouden.',
            de: 'Verbessern das Benutzererlebnis, indem sie Ihre Präferenzen und Wahlmöglichkeiten speichern.',
          },
          examples: {
            fr: 'Exemples : préférences d\'affichage, filtres de recherche sauvegardés',
            en: 'Examples: display preferences, saved search filters',
            nl: 'Voorbeelden: weergavevoorkeuren, opgeslagen zoekfilters',
            de: 'Beispiele: Anzeigeeinstellungen, gespeicherte Suchfilter',
          },
        },
        analytics: {
          title: {
            fr: 'Cookies Analytiques',
            en: 'Analytics Cookies',
            nl: 'Analytische Cookies',
            de: 'Analytische Cookies',
          },
          content: {
            fr: 'Nous aident à comprendre comment vous utilisez notre plateforme pour l\'améliorer.',
            en: 'Help us understand how you use our platform to improve it.',
            nl: 'Helpen ons begrijpen hoe u ons platform gebruikt om het te verbeteren.',
            de: 'Helfen uns zu verstehen, wie Sie unsere Plattform nutzen, um sie zu verbessern.',
          },
          examples: {
            fr: 'Exemples : Google Analytics, pages visitées, durée des sessions',
            en: 'Examples: Google Analytics, pages visited, session duration',
            nl: 'Voorbeelden: Google Analytics, bezochte pagina\'s, sessieduur',
            de: 'Beispiele: Google Analytics, besuchte Seiten, Sitzungsdauer',
          },
        },
        marketing: {
          title: {
            fr: 'Cookies Marketing',
            en: 'Marketing Cookies',
            nl: 'Marketingcookies',
            de: 'Marketing-Cookies',
          },
          content: {
            fr: 'Utilisés pour personnaliser les publicités et mesurer l\'efficacité des campagnes.',
            en: 'Used to personalize ads and measure campaign effectiveness.',
            nl: 'Gebruikt om advertenties te personaliseren en de effectiviteit van campagnes te meten.',
            de: 'Verwendet zur Personalisierung von Anzeigen und Messung der Kampagneneffektivität.',
          },
          examples: {
            fr: 'Exemples : Facebook Pixel, Google Ads, remarketing',
            en: 'Examples: Facebook Pixel, Google Ads, remarketing',
            nl: 'Voorbeelden: Facebook Pixel, Google Ads, remarketing',
            de: 'Beispiele: Facebook Pixel, Google Ads, Remarketing',
          },
        },
      },

      ourCookies: {
        title: {
          fr: '3. Cookies que Nous Utilisons',
          en: '3. Cookies We Use',
          nl: '3. Cookies die We Gebruiken',
          de: '3. Von uns verwendete Cookies',
        },
        content: {
          fr: 'Liste des principaux cookies utilisés sur EasyCo :',
          en: 'List of main cookies used on EasyCo:',
          nl: 'Lijst van belangrijkste cookies gebruikt op EasyCo:',
          de: 'Liste der wichtigsten auf EasyCo verwendeten Cookies:',
        },
        session: {
          fr: 'easyco_session : cookie de session essentiel (durée : session)',
          en: 'easyco_session: essential session cookie (duration: session)',
          nl: 'easyco_session: essentiële sessiecookie (duur: sessie)',
          de: 'easyco_session: essenzielles Sitzungscookie (Dauer: Sitzung)',
        },
        language: {
          fr: 'easyco_lang : préférence de langue (durée : 1 an)',
          en: 'easyco_lang: language preference (duration: 1 year)',
          nl: 'easyco_lang: taalvoorkeur (duur: 1 jaar)',
          de: 'easyco_lang: Sprachpräferenz (Dauer: 1 Jahr)',
        },
        consent: {
          fr: 'easyco_cookie_consent : mémorisation du consentement cookies (durée : 1 an)',
          en: 'easyco_cookie_consent: cookie consent memory (duration: 1 year)',
          nl: 'easyco_cookie_consent: cookie toestemmingsgeheugen (duur: 1 jaar)',
          de: 'easyco_cookie_consent: Cookie-Einwilligungsspeicher (Dauer: 1 Jahr)',
        },
        analytics: {
          fr: '_ga, _gid : Google Analytics (durée : 2 ans / 24 heures)',
          en: '_ga, _gid: Google Analytics (duration: 2 years / 24 hours)',
          nl: '_ga, _gid: Google Analytics (duur: 2 jaar / 24 uur)',
          de: '_ga, _gid: Google Analytics (Dauer: 2 Jahre / 24 Stunden)',
        },
      },

      thirdParty: {
        title: {
          fr: '4. Cookies Tiers',
          en: '4. Third-Party Cookies',
          nl: '4. Cookies van Derden',
          de: '4. Cookies von Drittanbietern',
        },
        content: {
          fr: 'Nous utilisons des services tiers qui peuvent déposer leurs propres cookies :',
          en: 'We use third-party services that may set their own cookies:',
          nl: 'We gebruiken diensten van derden die hun eigen cookies kunnen instellen:',
          de: 'Wir verwenden Drittanbieterdienste, die eigene Cookies setzen können:',
        },
        google: {
          fr: 'Google Analytics : analyse du trafic et du comportement utilisateur',
          en: 'Google Analytics: traffic and user behavior analysis',
          nl: 'Google Analytics: verkeer en gebruikersgedraganalyse',
          de: 'Google Analytics: Verkehr und Nutzerverhalten-Analyse',
        },
        auth: {
          fr: 'Services d\'authentification : Google, Facebook (si connexion via réseaux sociaux)',
          en: 'Authentication services: Google, Facebook (if social login)',
          nl: 'Authenticatiediensten: Google, Facebook (bij social login)',
          de: 'Authentifizierungsdienste: Google, Facebook (bei Social Login)',
        },
        payment: {
          fr: 'Prestataires de paiement : pour les transactions sécurisées',
          en: 'Payment providers: for secure transactions',
          nl: 'Betalingsproviders: voor veilige transacties',
          de: 'Zahlungsanbieter: für sichere Transaktionen',
        },
      },

      management: {
        title: {
          fr: '5. Gestion de vos Cookies',
          en: '5. Managing Your Cookies',
          nl: '5. Uw Cookies Beheren',
          de: '5. Verwaltung Ihrer Cookies',
        },
        content: {
          fr: 'Vous pouvez gérer vos préférences de cookies de plusieurs façons :',
          en: 'You can manage your cookie preferences in several ways:',
          nl: 'U kunt uw cookievoorkeuren op verschillende manieren beheren:',
          de: 'Sie können Ihre Cookie-Einstellungen auf verschiedene Weise verwalten:',
        },
        banner: {
          fr: 'Via notre bannière de consentement lors de votre première visite',
          en: 'Via our consent banner on your first visit',
          nl: 'Via onze toestemmingsbanner bij uw eerste bezoek',
          de: 'Über unser Einwilligungsbanner bei Ihrem ersten Besuch',
        },
        settings: {
          fr: 'Dans vos paramètres de compte (section Confidentialité)',
          en: 'In your account settings (Privacy section)',
          nl: 'In uw accountinstellingen (Privacy-sectie)',
          de: 'In Ihren Kontoeinstellungen (Datenschutz-Bereich)',
        },
        browser: {
          fr: 'Dans les paramètres de votre navigateur',
          en: 'In your browser settings',
          nl: 'In uw browserinstellingen',
          de: 'In Ihren Browsereinstellungen',
        },
      },

      browserSettings: {
        title: {
          fr: '6. Paramètres du Navigateur',
          en: '6. Browser Settings',
          nl: '6. Browserinstellingen',
          de: '6. Browser-Einstellungen',
        },
        content: {
          fr: 'Pour gérer les cookies via votre navigateur :',
          en: 'To manage cookies via your browser:',
          nl: 'Om cookies via uw browser te beheren:',
          de: 'Um Cookies über Ihren Browser zu verwalten:',
        },
        chrome: {
          fr: 'Chrome : Paramètres > Confidentialité et sécurité > Cookies',
          en: 'Chrome: Settings > Privacy and security > Cookies',
          nl: 'Chrome: Instellingen > Privacy en beveiliging > Cookies',
          de: 'Chrome: Einstellungen > Datenschutz und Sicherheit > Cookies',
        },
        firefox: {
          fr: 'Firefox : Options > Vie privée et sécurité > Cookies',
          en: 'Firefox: Options > Privacy & Security > Cookies',
          nl: 'Firefox: Opties > Privacy & Beveiliging > Cookies',
          de: 'Firefox: Optionen > Datenschutz & Sicherheit > Cookies',
        },
        safari: {
          fr: 'Safari : Préférences > Confidentialité > Cookies',
          en: 'Safari: Preferences > Privacy > Cookies',
          nl: 'Safari: Voorkeuren > Privacy > Cookies',
          de: 'Safari: Einstellungen > Datenschutz > Cookies',
        },
        edge: {
          fr: 'Edge : Paramètres > Confidentialité > Cookies',
          en: 'Edge: Settings > Privacy > Cookies',
          nl: 'Edge: Instellingen > Privacy > Cookies',
          de: 'Edge: Einstellungen > Datenschutz > Cookies',
        },
      },

      impact: {
        title: {
          fr: '7. Impact du Refus des Cookies',
          en: '7. Impact of Refusing Cookies',
          nl: '7. Impact van het Weigeren van Cookies',
          de: '7. Auswirkungen der Ablehnung von Cookies',
        },
        content: {
          fr: 'Le refus de certains cookies peut impacter votre expérience :',
          en: 'Refusing certain cookies may impact your experience:',
          nl: 'Het weigeren van bepaalde cookies kan uw ervaring beïnvloeden:',
          de: 'Die Ablehnung bestimmter Cookies kann Ihre Erfahrung beeinträchtigen:',
        },
        essential: {
          fr: 'Cookies essentiels : le site ne fonctionnera pas correctement',
          en: 'Essential cookies: the site will not function properly',
          nl: 'Essentiële cookies: de site zal niet correct functioneren',
          de: 'Essenzielle Cookies: die Website wird nicht richtig funktionieren',
        },
        functional: {
          fr: 'Cookies fonctionnels : vous devrez reconfigurer vos préférences à chaque visite',
          en: 'Functional cookies: you will need to reconfigure your preferences each visit',
          nl: 'Functionele cookies: u moet uw voorkeuren bij elk bezoek opnieuw configureren',
          de: 'Funktionale Cookies: Sie müssen Ihre Präferenzen bei jedem Besuch neu konfigurieren',
        },
        analytics: {
          fr: 'Cookies analytiques : nous ne pourrons pas améliorer le service basé sur votre utilisation',
          en: 'Analytics cookies: we cannot improve the service based on your usage',
          nl: 'Analytische cookies: we kunnen de service niet verbeteren op basis van uw gebruik',
          de: 'Analytische Cookies: wir können den Service nicht basierend auf Ihrer Nutzung verbessern',
        },
        marketing: {
          fr: 'Cookies marketing : les publicités seront moins pertinentes',
          en: 'Marketing cookies: ads will be less relevant',
          nl: 'Marketingcookies: advertenties zijn minder relevant',
          de: 'Marketing-Cookies: Anzeigen werden weniger relevant sein',
        },
      },

      updates: {
        title: {
          fr: '8. Mises à Jour de cette Politique',
          en: '8. Updates to this Policy',
          nl: '8. Updates van dit Beleid',
          de: '8. Aktualisierungen dieser Richtlinie',
        },
        content: {
          fr: 'Nous pouvons mettre à jour cette politique cookies pour refléter les changements dans nos pratiques ou pour des raisons légales. Nous vous informerons de tout changement significatif.',
          en: 'We may update this cookie policy to reflect changes in our practices or for legal reasons. We will inform you of any significant changes.',
          nl: 'We kunnen dit cookiebeleid bijwerken om veranderingen in onze praktijken weer te geven of om juridische redenen. We zullen u informeren over belangrijke wijzigingen.',
          de: 'Wir können diese Cookie-Richtlinie aktualisieren, um Änderungen in unseren Praktiken oder aus rechtlichen Gründen widerzuspiegeln. Wir werden Sie über wesentliche Änderungen informieren.',
        },
      },

      contact: {
        title: {
          fr: '9. Questions sur les Cookies',
          en: '9. Questions About Cookies',
          nl: '9. Vragen over Cookies',
          de: '9. Fragen zu Cookies',
        },
        content: {
          fr: 'Pour toute question concernant notre utilisation des cookies :',
          en: 'For any questions regarding our use of cookies:',
          nl: 'Voor vragen over ons gebruik van cookies:',
          de: 'Für Fragen zu unserer Verwendung von Cookies:',
        },
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
