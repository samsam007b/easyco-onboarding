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
    loading: {
      fr: 'Chargement...',
      en: 'Loading...',
      nl: 'Laden...',
      de: 'Laden...',
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
