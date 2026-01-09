// Internationalization translations for Izzico
// Supported languages: FR (default), EN, NL, DE

export type Language = 'fr' | 'en' | 'nl' | 'de';

export const languages = {
  fr: { code: 'fr', name: 'Français', flagCode: 'FR' as const },
  en: { code: 'en', name: 'English', flagCode: 'GB' as const },
  nl: { code: 'nl', name: 'Nederlands', flagCode: 'NL' as const },
  de: { code: 'de', name: 'Deutsch', flagCode: 'DE' as const },
} as const;

export const translations = {
  // ============================================================================
  // LANDING PAGE
  // ============================================================================
  landing: {
    hero: {
      title: {
        fr: 'Trouve ton co-living idéal.',
        en: 'Find your ideal co-living.',
        nl: 'Vind je ideale co-living.',
        de: 'Finde dein ideales Co-Living.',
      },
      subtitle: {
        fr: 'Trouve avec qui vivre, pas juste où vivre',
        en: 'Find who to live with, not just where',
        nl: 'Vind met wie je wilt wonen, niet alleen waar',
        de: 'Finde mit wem du leben willst, nicht nur wo',
      },
      ctaSearcher: {
        fr: 'Je cherche mon co-living',
        en: 'I\'m looking for my co-living',
        nl: 'Ik zoek mijn co-living',
        de: 'Ich suche mein Co-Living',
      },
      ctaOwner: {
        fr: 'Je loue ma résidence',
        en: 'List my residence',
        nl: 'Mijn residentie verhuren',
        de: 'Meine Residenz vermieten',
      },
      login: {
        fr: 'Se connecter',
        en: 'Log in',
        nl: 'Inloggen',
        de: 'Anmelden',
      },
      guestMode: {
        fr: 'Continuer en tant qu\'invité',
        en: 'Continue as guest',
        nl: 'Doorgaan als gast',
        de: 'Als Gast fortfahren',
      },
    },

    guest: {
      title: {
        fr: 'Mode Invité',
        en: 'Guest Mode',
        nl: 'Gastmodus',
        de: 'Gastmodus',
      },
      subtitle: {
        fr: 'Explorez les propriétés sans créer de compte',
        en: 'Explore properties without creating an account',
        nl: 'Ontdek eigenschappen zonder een account aan te maken',
        de: 'Erkunde Immobilien ohne ein Konto zu erstellen',
      },
      whatCanYouDo: {
        fr: 'Que peux-tu faire en mode invité ?',
        en: 'What can you do in guest mode?',
        nl: 'Wat kun je doen in gastmodus?',
        de: 'Was kannst du im Gastmodus tun?',
      },
      description: {
        fr: 'Découvrez nos propriétés et fonctionnalités. Créez un compte pour débloquer toutes les possibilités.',
        en: 'Discover our properties and features. Create an account to unlock all possibilities.',
        nl: 'Ontdek onze eigenschappen en functies. Maak een account aan om alle mogelijkheden te ontgrendelen.',
        de: 'Entdecke unsere Immobilien und Funktionen. Erstelle ein Konto, um alle Möglichkeiten freizuschalten.',
      },
      features: {
        browse: {
          title: {
            fr: 'Parcourir les résidences',
            en: 'Browse residences',
            nl: 'Bladeren door residenties',
            de: 'Residenzen durchsuchen',
          },
          description: {
            fr: 'Explorez notre sélection de propriétés disponibles',
            en: 'Explore our selection of available properties',
            nl: 'Ontdek onze selectie van beschikbare eigenschappen',
            de: 'Erkunde unsere Auswahl an verfügbaren Immobilien',
          },
        },
        locations: {
          title: {
            fr: 'Voir les emplacements',
            en: 'View locations',
            nl: 'Locaties bekijken',
            de: 'Standorte ansehen',
          },
          description: {
            fr: 'Découvrez les quartiers et localisations',
            en: 'Discover neighborhoods and locations',
            nl: 'Ontdek buurten en locaties',
            de: 'Entdecke Viertel und Standorte',
          },
        },
        matching: {
          title: {
            fr: 'Matching intelligent',
            en: 'Smart matching',
            nl: 'Slimme matching',
            de: 'Intelligentes Matching',
          },
          description: {
            fr: 'Trouve des résidents compatibles',
            en: 'Find compatible residents',
            nl: 'Vind compatibele bewoners',
            de: 'Finde kompatible Bewohner',
          },
        },
        bookVisits: {
          title: {
            fr: 'Réserver des visites',
            en: 'Book visits',
            nl: 'Bezoeken boeken',
            de: 'Besichtigungen buchen',
          },
          description: {
            fr: 'Planifiez des visites de propriétés',
            en: 'Schedule property visits',
            nl: 'Plan bezoeken aan eigendommen',
            de: 'Plane Immobilienbesichtigungen',
          },
        },
        favorites: {
          title: {
            fr: 'Sauvegarder des favoris',
            en: 'Save favorites',
            nl: 'Favorieten opslaan',
            de: 'Favoriten speichern',
          },
          description: {
            fr: 'Crée ta liste de propriétés préférées',
            en: 'Create your list of favorite properties',
            nl: 'Maak je lijst met favoriete eigenschappen',
            de: 'Erstelle deine Liste der Lieblingsimmobilien',
          },
        },
      },
      accountRequired: {
        fr: 'Compte requis',
        en: 'Account required',
        nl: 'Account vereist',
        de: 'Konto erforderlich',
      },
      unlockFeature: {
        fr: 'Créer un compte pour débloquer',
        en: 'Create an account to unlock',
        nl: 'Maak een account aan om te ontgrendelen',
        de: 'Erstelle ein Konto zum Freischalten',
      },
      availableProperties: {
        fr: 'Propriétés disponibles',
        en: 'Available properties',
        nl: 'Beschikbare eigenschappen',
        de: 'Verfügbare Immobilien',
      },
      previewDescription: {
        fr: 'Aperçu des propriétés - Créez un compte pour voir tous les détails',
        en: 'Property preview - Create an account to see all details',
        nl: 'Voorvertoning van eigenschappen - Maak een account aan om alle details te zien',
        de: 'Immobilienvorschau - Erstelle ein Konto, um alle Details zu sehen',
      },
      seeMore: {
        fr: 'Voir plus de propriétés ?',
        en: 'See more properties?',
        nl: 'Meer eigenschappen zien?',
        de: 'Mehr Immobilien sehen?',
      },
      createAccountCTA: {
        fr: 'Créez un compte gratuit pour accéder à toutes nos propriétés, utiliser notre système de matching intelligent, et réserver des visites.',
        en: 'Create a free account to access all our properties, use our smart matching system, and book visits.',
        nl: 'Maak een gratis account aan om toegang te krijgen tot al onze eigendommen, ons slimme matchingsysteem te gebruiken en bezoeken te boeken.',
        de: 'Erstelle ein kostenloses Konto, um auf alle unsere Immobilien zuzugreifen, unser intelligentes Matching-System zu nutzen und Besichtigungen zu buchen.',
      },
      whyCreateAccount: {
        fr: 'Pourquoi créer un compte ?',
        en: 'Why create an account?',
        nl: 'Waarom een account aanmaken?',
        de: 'Warum ein Konto erstellen?',
      },
      benefits: {
        smartMatching: {
          title: {
            fr: 'Matching Intelligent',
            en: 'Smart Matching',
            nl: 'Slimme Matching',
            de: 'Intelligentes Matching',
          },
          description: {
            fr: 'Trouvez des résidents compatibles avec ton style de vie',
            en: 'Find roommates compatible with your lifestyle',
            nl: 'Vind huisgenoten die compatibel zijn met jouw levensstijl',
            de: 'Finde Mitbewohner, die zu deinem Lebensstil passen',
          },
        },
        alerts: {
          title: {
            fr: 'Alertes Personnalisées',
            en: 'Personalized Alerts',
            nl: 'Gepersonaliseerde Meldingen',
            de: 'Personalisierte Benachrichtigungen',
          },
          description: {
            fr: 'Recevez des notifications pour les nouvelles propriétés',
            en: 'Receive notifications for new properties',
            nl: 'Ontvang meldingen voor nieuwe eigenschappen',
            de: 'Erhalte Benachrichtigungen für neue Immobilien',
          },
        },
        messaging: {
          title: {
            fr: 'Messagerie Directe',
            en: 'Direct Messaging',
            nl: 'Directe Berichten',
            de: 'Direktnachrichten',
          },
          description: {
            fr: 'Contactez directement les propriétaires et résidents',
            en: 'Contact owners and roommates directly',
            nl: 'Neem direct contact op met eigenaren en huisgenoten',
            de: 'Kontaktiere Eigentümer und Mitbewohner direkt',
          },
        },
      },
      startFree: {
        fr: 'Commencer gratuitement',
        en: 'Start for free',
        nl: 'Start gratis',
        de: 'Kostenlos starten',
      },
      limitedAccess: {
        title: {
          fr: 'Fonctionnalité limitée',
          en: 'Limited feature',
          nl: 'Beperkte functie',
          de: 'Eingeschränkte Funktion',
        },
        description: {
          fr: 'Cette fonctionnalité nécessite un compte Izzico. Crée ta compte gratuitement pour accéder à toutes nos fonctionnalités.',
          en: 'This feature requires an Izzico account. Create your account for free to access all our features.',
          nl: 'Deze functie vereist een Izzico-account. Maak gratis een account aan om toegang te krijgen tot al onze functies.',
          de: 'Diese Funktion erfordert ein Izzico-Konto. Erstelle dein Konto kostenlos, um auf alle unsere Funktionen zuzugreifen.',
        },
      },
      continueAsGuest: {
        fr: 'Continuer en mode invité',
        en: 'Continue in guest mode',
        nl: 'Doorgaan in gastmodus',
        de: 'Im Gastmodus fortfahren',
      },
    },

    benefits: {
      verified: {
        title: {
          fr: 'Profils Vérifiés',
          en: 'Identity Verification',
          nl: 'Identiteitsverificatie',
          de: 'Identitätsverifizierung',
        },
        description: {
          fr: 'Tous les profils sont vérifiés (identité, photo). Recherche sereine, zéro mauvaise surprise.',
          en: 'KYC identity verification. All reports are verified and processed within 24h.',
          nl: 'KYC-identiteitsverificatie. Alle meldingen worden binnen 24u geverifieerd en verwerkt.',
          de: 'KYC-Identitätsverifizierung. Alle Meldungen werden innerhalb von 24h verifiziert und bearbeitet.',
        },
      },
      compatibility: {
        title: {
          fr: 'Living Match',
          en: 'Social Compatibility',
          nl: 'Sociale Compatibiliteit',
          de: 'Soziale Kompatibilität',
        },
        description: {
          fr: 'Crée ton Living Persona en 3 minutes — on trouve ceux qui te ressemblent vraiment. Score de compatibilité clair (70-90%+).',
          en: 'Smart matching based on your lifestyle, schedule and values.',
          nl: 'Slimme matching op basis van je levensstijl, schema en waarden.',
          de: 'Intelligentes Matching basierend auf Lebensstil, Zeitplan und Werten.',
        },
      },
      groups: {
        title: {
          fr: 'Search Squads',
          en: 'Pre-formed Groups',
          nl: 'Voorgevormde Groepen',
          de: 'Vorgeformte Gruppen',
        },
        description: {
          fr: 'Cherche avec tes potes — créez votre groupe et trouvez ensemble votre prochain chez-vous.',
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
        fr: 'Résidences vérifiées manuellement',
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
        fr: 'Rejoins des milliers de résidents satisfaits',
        en: 'Join thousands of happy flatmates',
        nl: 'Sluit je aan bij duizenden tevreden huisgenoten',
        de: 'Schließe dich Tausenden zufriedenen Mitbewohnern an',
      },
    },

    howItWorks: {
      title: {
        fr: 'Comment ça marche ?',
        en: 'How does it work?',
        nl: 'Hoe werkt het?',
        de: 'Wie funktioniert es?',
      },
      subtitle: {
        fr: 'En 3 étapes simples',
        en: 'In 3 simple steps',
        nl: 'In 3 eenvoudige stappen',
        de: 'In 3 einfachen Schritten',
      },
      step1: {
        title: {
          fr: 'Crée ton Living Persona',
          en: 'Create your profile',
          nl: 'Maak je profiel',
          de: 'Erstelle dein Profil',
        },
        description: {
          fr: 'Réponds à 15 questions sur ton lifestyle et tes préférences pour que notre algorithme puisse te proposer les meilleurs Living Matchs.',
          en: 'Answer 15 questions about your lifestyle and preferences so our algorithm can suggest the best matches for you.',
          nl: 'Beantwoord 15 vragen over je levensstijl en voorkeuren zodat ons algoritme de beste matches voor je kan voorstellen.',
          de: 'Beantworte 15 Fragen zu deinem Lebensstil und deinen Präferenzen, damit unser Algorithmus die besten Matches für dich vorschlagen kann.',
        },
      },
      step2: {
        title: {
          fr: 'Découvre tes Living Matchs',
          en: 'Discover your matches',
          nl: 'Ontdek je matches',
          de: 'Entdecke deine Matches',
        },
        description: {
          fr: 'Notre algorithme te propose des résidents compatibles avec ton mode de vie, tes horaires et tes valeurs. Plus besoin de deviner.',
          en: 'Our algorithm suggests flatmates compatible with your lifestyle, schedule, and values. No more guessing.',
          nl: 'Ons algoritme stelt huisgenoten voor die compatibel zijn met je levensstijl, schema en waarden. Niet meer gissen.',
          de: 'Unser Algorithmus schlägt Mitbewohner vor, die mit deinem Lebensstil, Zeitplan und Werten kompatibel sind. Kein Raten mehr.',
        },
      },
      step3: {
        title: {
          fr: 'Créez votre Search Squad',
          en: 'Join a group',
          nl: 'Sluit je aan bij een groep',
          de: 'Tritt einer Gruppe bei',
        },
        description: {
          fr: 'Cherche avec 2-4 potes qui te ressemblent. Trouvez ensemble votre prochain chez-vous — c\'est 3x plus rapide.',
          en: 'Connect with 2-4 people like you and search together. It\'s 3x faster and much simpler.',
          nl: 'Maak verbinding met 2-4 mensen zoals jij en zoek samen. Het is 3x sneller en veel eenvoudiger.',
          de: 'Verbinde dich mit 2-4 Menschen wie dir und sucht zusammen. Es ist 3x schneller und viel einfacher.',
        },
      },
      cta: {
        fr: 'Commencer maintenant',
        en: 'Get started now',
        nl: 'Begin nu',
        de: 'Jetzt starten',
      },
    },

    stats: {
      title: {
        fr: 'Izzico en chiffres',
        en: 'Izzico by the numbers',
        nl: 'Izzico in cijfers',
        de: 'Izzico in Zahlen',
      },
      subtitle: {
        fr: 'Rejoins des milliers d\'utilisateurs satisfaits',
        en: 'Join thousands of satisfied users',
        nl: 'Sluit je aan bij duizenden tevreden gebruikers',
        de: 'Schließe dich Tausenden zufriedener Nutzer an',
      },
      properties: {
        fr: 'Résidences à Bruxelles',
        en: 'Listings in Brussels',
        nl: 'Advertenties in Brussel',
        de: 'Anzeigen in Brüssel',
      },
      users: {
        fr: 'Utilisateurs actifs',
        en: 'Active users',
        nl: 'Actieve gebruikers',
        de: 'Aktive Nutzer',
      },
      satisfaction: {
        fr: 'Taux de satisfaction',
        en: 'Satisfaction rate',
        nl: 'Tevredenheidspercentage',
        de: 'Zufriedenheitsrate',
      },
      verified: {
        fr: 'Profils vérifiés',
        en: 'Verified profiles',
        nl: 'Geverifieerde profielen',
        de: 'Verifizierte Profile',
      },
      trustBadge: {
        fr: 'Toutes les identités vérifiées manuellement',
        en: 'All identities manually verified',
        nl: 'Alle identiteiten handmatig geverifieerd',
        de: 'Alle Identitäten manuell verifiziert',
      },
    },

    testimonials: {
      title: {
        fr: 'Ce qu\'ils disent de nous',
        en: 'What they say about us',
        nl: 'Wat ze over ons zeggen',
        de: 'Was sie über uns sagen',
      },
      subtitle: {
        fr: 'Des milliers d\'utilisateurs nous font confiance',
        en: 'Thousands of users trust us',
        nl: 'Duizenden gebruikers vertrouwen ons',
        de: 'Tausende Nutzer vertrauen uns',
      },
      testimonial1: {
        name: {
          fr: 'Thomas L.',
          en: 'Thomas L.',
          nl: 'Thomas L.',
          de: 'Thomas L.',
        },
        role: {
          fr: 'Étudiant à l\'ULB',
          en: 'Student at ULB',
          nl: 'Student aan ULB',
          de: 'Student an der ULB',
        },
        text: {
          fr: 'J\'ai trouvé mes résidents en moins de 2 semaines grâce à Izzico. Le matching est vraiment précis, on s\'entend super bien ! Plus besoin de passer des heures sur des sites douteux.',
          en: 'I found my flatmates in less than 2 weeks thanks to Izzico. The matching is really accurate, we get along great! No more spending hours on dodgy sites.',
          nl: 'Ik vond mijn huisgenoten in minder dan 2 weken dankzij Izzico. De matching is echt nauwkeurig, we kunnen het geweldig vinden! Niet meer uren spenderen op dubieuze sites.',
          de: 'Ich habe meine Mitbewohner in weniger als 2 Wochen dank Izzico gefunden. Das Matching ist wirklich genau, wir verstehen uns super! Keine Stunden mehr auf dubiosen Seiten verbringen.',
        },
      },
      testimonial2: {
        name: {
          fr: 'Marie D.',
          en: 'Marie D.',
          nl: 'Marie D.',
          de: 'Marie D.',
        },
        role: {
          fr: 'Jeune professionnelle',
          en: 'Young professional',
          nl: 'Jonge professional',
          de: 'Junge Berufstätige',
        },
        text: {
          fr: 'Le matching est vraiment précis. J\'ai été mise en contact avec des personnes qui partagent mes valeurs et mon mode de vie. La vérification d\'identité me rassure complètement.',
          en: 'The matching is really precise. I was connected with people who share my values and lifestyle. The identity verification completely reassures me.',
          nl: 'De matching is echt nauwkeurig. Ik werd in contact gebracht met mensen die mijn waarden en levensstijl delen. De identiteitsverificatie stelt me volledig gerust.',
          de: 'Das Matching ist wirklich präzise. Ich wurde mit Menschen verbunden, die meine Werte und Lebensweise teilen. Die Identitätsverifizierung beruhigt mich vollständig.',
        },
      },
      testimonial3: {
        name: {
          fr: 'Lucas M.',
          en: 'Lucas M.',
          nl: 'Lucas M.',
          de: 'Lucas M.',
        },
        role: {
          fr: 'Développeur',
          en: 'Developer',
          nl: 'Ontwikkelaar',
          de: 'Entwickler',
        },
        text: {
          fr: 'Fini les arnaques et les mauvaises surprises. Avec Izzico, tous les profils sont vérifiés et les résidences sont authentiques. J\'ai trouvé un co-living en 3 semaines, c\'est incroyable.',
          en: 'No more scams and bad surprises. With Izzico, all profiles are verified and listings are authentic. I found a flatshare in 3 weeks, it\'s amazing.',
          nl: 'Geen oplichting en slechte verrassingen meer. Met Izzico zijn alle profielen geverifieerd en advertenties authentiek. Ik vond een flatshare in 3 weken, het is geweldig.',
          de: 'Keine Betrügereien und schlechten Überraschungen mehr. Mit Izzico sind alle Profile verifiziert und Anzeigen authentisch. Ich fand eine WG in 3 Wochen, es ist unglaublich.',
        },
      },
      rating: {
        fr: '4.9/5 étoiles',
        en: '4.9/5 stars',
        nl: '4,9/5 sterren',
        de: '4,9/5 Sterne',
      },
      reviews: {
        fr: 'Plus de 500 avis',
        en: 'Over 500 reviews',
        nl: 'Meer dan 500 reviews',
        de: 'Über 500 Bewertungen',
      },
    },

    faq: {
      title: {
        fr: 'Questions fréquentes',
        en: 'Frequently asked questions',
        nl: 'Veelgestelde vragen',
        de: 'Häufig gestellte Fragen',
      },
      subtitle: {
        fr: 'Tout ce que tu dois savoir',
        en: 'Everything you need to know',
        nl: 'Alles wat je moet weten',
        de: 'Alles, was Sie wissen müssen',
      },
      question1: {
        q: {
          fr: 'Comment fonctionne la vérification d\'identité ?',
          en: 'How does identity verification work?',
          nl: 'Hoe werkt identiteitsverificatie?',
          de: 'Wie funktioniert die Identitätsverifizierung?',
        },
        a: {
          fr: 'Nous vérifions manuellement chaque document d\'identité soumis. Notre équipe examine ton passeport, carte d\'identité ou permis de conduire pour s\'assurer qu\'il s\'agit bien de toi. Ce processus prend généralement 24-48 heures.',
          en: 'We manually verify each submitted identity document. Our team examines your passport, ID card, or driver\'s license to ensure it\'s really you. This process typically takes 24-48 hours.',
          nl: 'We verifiëren elk ingediend identiteitsdocument handmatig. Ons team onderzoekt je paspoort, identiteitskaart of rijbewijs om er zeker van te zijn dat het echt jou is. Dit proces duurt meestal 24-48 uur.',
          de: 'Wir verifizieren jedes eingereichte Identitätsdokument manuell. Unser Team prüft Ihren Pass, Personalausweis oder Führerschein, um sicherzustellen, dass Sie es wirklich sind. Dieser Prozess dauert in der Regel 24-48 Stunden.',
        },
      },
      question2: {
        q: {
          fr: 'Est-ce que c\'est gratuit ?',
          en: 'Is it free?',
          nl: 'Is het gratis?',
          de: 'Ist es kostenlos?',
        },
        a: {
          fr: 'L\'inscription et la création de ton Living Persona sont entièrement gratuites. Tu peux parcourir les résidences, créer ton Living Persona et recevoir des Living Matchs sans aucun frais. Nous proposons également des fonctionnalités premium pour accélérer ta recherche.',
          en: 'Registration and profile creation are completely free. You can browse listings, create your profile, and receive matches at no cost. We also offer premium features to speed up your search.',
          nl: 'Registratie en profielcreatie zijn volledig gratis. Je kunt advertenties bekijken, je profiel aanmaken en matches ontvangen zonder kosten. We bieden ook premium functies om je zoektocht te versnellen.',
          de: 'Registrierung und Profilerstellung sind völlig kostenlos. Sie können Anzeigen durchsuchen, Ihr Profil erstellen und Matches ohne Kosten erhalten. Wir bieten auch Premium-Funktionen, um Ihre Suche zu beschleunigen.',
        },
      },
      question3: {
        q: {
          fr: 'Comment fonctionne Living Match ?',
          en: 'How does the matching work?',
          nl: 'Hoe werkt de matching?',
          de: 'Wie funktioniert das Matching?',
        },
        a: {
          fr: 'Crée ton Living Persona en 3 minutes — on analyse tes rythmes de vie, tes valeurs et ton quotidien. Notre algorithme compare ensuite ton Living Persona avec ceux des autres utilisateurs pour te proposer des Living Matchs avec un score de compatibilité clair (70-90%+). Tu sais exactement pourquoi ça matche.',
          en: 'Our algorithm analyzes your answers to 15 questions about your lifestyle, schedule, habits, and values. It then compares this data with other users to suggest the most compatible people for you.',
          nl: 'Ons algoritme analyseert je antwoorden op 15 vragen over je levensstijl, schema, gewoonten en waarden. Het vergelijkt deze gegevens vervolgens met andere gebruikers om de meest compatibele mensen voor je voor te stellen.',
          de: 'Unser Algorithmus analysiert Ihre Antworten auf 15 Fragen zu Ihrem Lebensstil, Zeitplan, Gewohnheiten und Werten. Er vergleicht dann diese Daten mit anderen Nutzern, um Ihnen die kompatibelsten Personen vorzuschlagen.',
        },
      },
      question4: {
        q: {
          fr: 'Puis-je faire confiance aux résidences ?',
          en: 'Can I trust the listings?',
          nl: 'Kan ik de advertenties vertrouwen?',
          de: 'Kann ich den Anzeigen vertrauen?',
        },
        a: {
          fr: 'Oui, toutes les résidences sont vérifiées par notre équipe. Nous vérifions l\'identité des propriétaires et la validité de leurs documents. De plus, nous avons un système de signalement en 1 clic si tu détectes quelque chose de suspect.',
          en: 'Yes, all listings are verified by our team. We verify the identity of owners and the validity of their documents. Additionally, we have a 1-click reporting system if you detect something suspicious.',
          nl: 'Ja, alle advertenties worden geverifieerd door ons team. We verifiëren de identiteit van eigenaren en de geldigheid van hun documenten. Bovendien hebben we een rapportagesysteem met 1 klik als je iets verdachts detecteert.',
          de: 'Ja, alle Anzeigen werden von unserem Team verifiziert. Wir überprüfen die Identität der Eigentümer und die Gültigkeit ihrer Dokumente. Außerdem haben wir ein 1-Klick-Meldesystem, wenn Sie etwas Verdächtiges entdecken.',
        },
      },
      question5: {
        q: {
          fr: 'Comment rejoindre un Search Squad ?',
          en: 'How do I join a group?',
          nl: 'Hoe sluit ik me aan bij een groep?',
          de: 'Wie trete ich einer Gruppe bei?',
        },
        a: {
          fr: 'Une fois ton Living Persona créé, notre algorithme te proposera des Search Squads de 2-4 personnes compatibles avec toi. Tu peux parcourir ces squads, voir leurs Living Personas et demander à les rejoindre. Chercher à plusieurs, c\'est 3x plus rapide !',
          en: 'Once your profile is created, our algorithm will suggest groups of 2-4 people compatible with you. You can browse these groups, view their profiles, and request to join them. It\'s that simple!',
          nl: 'Zodra je profiel is aangemaakt, stelt ons algoritme groepen van 2-4 mensen voor die compatibel zijn met jou. Je kunt deze groepen bekijken, hun profielen bekijken en verzoeken om lid te worden. Zo simpel is het!',
          de: 'Sobald Ihr Profil erstellt ist, schlägt unser Algorithmus Gruppen von 2-4 Personen vor, die mit Ihnen kompatibel sind. Sie können diese Gruppen durchsuchen, ihre Profile anzeigen und eine Beitrittsanfrage stellen. So einfach ist das!',
        },
      },
      question6: {
        q: {
          fr: 'Que faire en cas de problème ?',
          en: 'What should I do if there\'s a problem?',
          nl: 'Wat moet ik doen als er een probleem is?',
          de: 'Was soll ich tun, wenn es ein Problem gibt?',
        },
        a: {
          fr: 'Contacte-nous directement via le chat, par email (hello@izzico.be) ou dans ton espace perso. Notre équipe te répond en moins de 24h en semaine. Pour les urgences, utilise le système de signalement en 1 clic — on intervient en priorité.',
          en: 'Our support team is available 24/7 to help you. You can contact us via live chat, email, or phone. We are committed to resolving all issues within 24 hours.',
          nl: 'Ons supportteam is 24/7 beschikbaar om je te helpen. Je kunt contact met ons opnemen via livechat, e-mail of telefoon. We zijn toegewijd om alle problemen binnen 24 uur op te lossen.',
          de: 'Unser Support-Team ist 24/7 verfügbar, um Ihnen zu helfen. Sie können uns über Live-Chat, E-Mail oder Telefon kontaktieren. Wir verpflichten uns, alle Probleme innerhalb von 24 Stunden zu lösen.',
        },
      },
      contactTitle: {
        fr: 'Tu as d\'autres questions ?',
        en: 'Have more questions?',
        nl: 'Heb je meer vragen?',
        de: 'Haben Sie weitere Fragen?',
      },
      contactSubtitle: {
        fr: 'Notre équipe est là pour t\'aider',
        en: 'Our team is here to help you',
        nl: 'Ons team is er om je te helpen',
        de: 'Unser Team ist hier, um Ihnen zu helfen',
      },
      contactButton: {
        fr: 'Nous contacter',
        en: 'Contact us',
        nl: 'Neem contact op',
        de: 'Kontaktiere uns',
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
      fr: 'Ce test nous permet de mieux comprendre tes préférences de co-living et de te proposer les meilleurs Living Matchs. Tes réponses sont traitées de manière anonyme et sécurisée.',
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
        fr: 'Tu peux refuser sans impact sur ton utilisation',
        en: 'You can decline without impacting your usage',
        nl: 'Je kunt weigeren zonder impact op je gebruik',
        de: 'Sie können ablehnen ohne Auswirkung auf Ihre Nutzung',
      },
    },
    privacy: {
      fr: 'En continuant, tu acceptes notre',
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
    explorer: {
      fr: 'Explorer',
      en: 'Explore',
      nl: 'Verkennen',
      de: 'Erkunden',
    },
    residents: {
      fr: 'Résidents',
      en: 'Residents',
      nl: 'Bewoners',
      de: 'Bewohner',
    },
    owners: {
      fr: 'Propriétaires',
      en: 'Owners',
      nl: 'Eigenaren',
      de: 'Eigentümer',
    },
    login: {
      fr: 'Se connecter',
      en: 'Sign In',
      nl: 'Inloggen',
      de: 'Anmelden',
    },
    signup: {
      fr: 'S\'inscrire',
      en: 'Sign Up',
      nl: 'Aanmelden',
      de: 'Registrieren',
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

  cookies: {
    banner: {
      title: {
        fr: 'Nous utilisons des cookies',
        en: 'We use cookies',
        nl: 'Wij gebruiken cookies',
        de: 'Wir verwenden Cookies',
      },
      description: {
        fr: 'Nous utilisons des cookies pour améliorer ton expérience, analyser le trafic et personnaliser le contenu. En cliquant sur "Accepter", tu consens à notre utilisation des cookies.',
        en: 'We use cookies to improve your experience, analyze traffic, and personalize content. By clicking "Accept", you consent to our use of cookies.',
        nl: 'We gebruiken cookies om uw ervaring te verbeteren, verkeer te analyseren en inhoud te personaliseren. Door op "Accepteren" te klikken, stemt u in met ons gebruik van cookies.',
        de: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern, den Verkehr zu analysieren und Inhalte zu personalisieren. Indem Sie auf "Akzeptieren" klicken, stimmen Sie unserer Verwendung von Cookies zu.',
      },
      learnMore: {
        fr: 'En savoir plus',
        en: 'Learn more',
        nl: 'Meer informatie',
        de: 'Mehr erfahren',
      },
      accept: {
        fr: 'Accepter',
        en: 'Accept',
        nl: 'Accepteren',
        de: 'Akzeptieren',
      },
      decline: {
        fr: 'Refuser',
        en: 'Decline',
        nl: 'Weigeren',
        de: 'Ablehnen',
      },
    },
  },

  // ============================================================================
  // WELCOME PAGE (Post-Login Role Selection)
  // ============================================================================
  welcome: {
    greeting: {
      fr: 'Bonjour',
      en: 'Hello',
      nl: 'Hallo',
      de: 'Hallo',
    },
    subtitle: {
      fr: 'Que souhaites-tu faire aujourd\'hui ?',
      en: 'What would you like to do today?',
      nl: 'Wat wilt u vandaag doen?',
      de: 'Was möchten Sie heute tun?',
    },
    searcher: {
      title: {
        fr: 'Je cherche un logement',
        en: 'I\'m looking for housing',
        nl: 'Ik zoek woonruimte',
        de: 'Ich suche eine Unterkunft',
      },
      description: {
        fr: 'Trouver un co-living fiable et compatible',
        en: 'Find a reliable and compatible flatshare',
        nl: 'Vind een betrouwbare en compatibele flatshare',
        de: 'Finde eine zuverlässige und kompatible WG',
      },
    },
    owner: {
      title: {
        fr: 'Je loue ma résidence',
        en: 'I\'m renting out my property',
        nl: 'Ik verhuur mijn woning',
        de: 'Ich vermiete meine Immobilie',
      },
      description: {
        fr: 'Gérer mes résidences et trouver des résidents',
        en: 'Manage my properties and find tenants',
        nl: 'Beheer mijn eigendommen en vind huurders',
        de: 'Verwalten Sie meine Immobilien und finden Sie Mieter',
      },
    },
    resident: {
      title: {
        fr: 'Je suis déjà résident',
        en: 'I\'m already a resident',
        nl: 'Ik ben al een bewoner',
        de: 'Ich bin bereits Bewohner',
      },
      description: {
        fr: 'Accéder à mon espace de co-living',
        en: 'Access my flatshare space',
        nl: 'Toegang tot mijn flatshare ruimte',
        de: 'Zugriff auf meinen WG-Bereich',
      },
    },
    continueButton: {
      fr: 'Continuer',
      en: 'Continue',
      nl: 'Doorgaan',
      de: 'Weiter',
    },
    helpText: {
      fr: 'Tu pourras toujours changer de rôle plus tard dans les paramètres',
      en: 'You can always change roles later in settings',
      nl: 'U kunt later altijd van rol wisselen in de instellingen',
      de: 'Sie können die Rolle später jederzeit in den Einstellungen ändern',
    },
    settings: {
      fr: 'Paramètres',
      en: 'Settings',
      nl: 'Instellingen',
      de: 'Einstellungen',
    },
    logout: {
      fr: 'Se déconnecter',
      en: 'Logout',
      nl: 'Uitloggen',
      de: 'Abmelden',
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
      fr: 'Chargement de tes informations...',
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
    yes: {
      fr: 'Oui',
      en: 'Yes',
      nl: 'Ja',
      de: 'Ja',
    },
    no: {
      fr: 'Non',
      en: 'No',
      nl: 'Nee',
      de: 'Nein',
    },
    flexible: {
      fr: 'Flexible',
      en: 'Flexible',
      nl: 'Flexibel',
      de: 'Flexibel',
    },
    all: {
      fr: 'Tout',
      en: 'All',
      nl: 'Alle',
      de: 'Alle',
    },
    unread: {
      fr: 'Non lu',
      en: 'Unread',
      nl: 'Ongelezen',
      de: 'Ungelesen',
    },
    read: {
      fr: 'Lu',
      en: 'Read',
      nl: 'Gelezen',
      de: 'Gelesen',
    },
    type: {
      fr: 'Type',
      en: 'Type',
      nl: 'Type',
      de: 'Typ',
    },
    status: {
      fr: 'Statut',
      en: 'Status',
      nl: 'Status',
      de: 'Status',
    },
    markAllAsRead: {
      fr: 'Tout marquer comme lu',
      en: 'Mark all as read',
      nl: 'Alles als gelezen markeren',
      de: 'Alle als gelesen markieren',
    },
    deleteRead: {
      fr: 'Supprimer les lus',
      en: 'Delete read',
      nl: 'Gelezen verwijderen',
      de: 'Gelesene löschen',
    },
    loadMore: {
      fr: 'Charger plus',
      en: 'Load more',
      nl: 'Meer laden',
      de: 'Mehr laden',
    },
    errors: {
      saveFailed: {
        fr: 'Échec de la sauvegarde',
        en: 'Failed to save',
        nl: 'Opslaan mislukt',
        de: 'Speichern fehlgeschlagen',
      },
      loadFailed: {
        fr: 'Échec du chargement',
        en: 'Failed to load',
        nl: 'Laden mislukt',
        de: 'Laden fehlgeschlagen',
      },
      unexpected: {
        fr: 'Une erreur inattendue s\'est produite',
        en: 'An unexpected error occurred',
        nl: 'Er is een onverwachte fout opgetreden',
        de: 'Ein unerwarteter Fehler ist aufgetreten',
      },
    },
    backToDashboard: {
      fr: 'Retour au tableau de bord',
      en: 'Back to Dashboard',
      nl: 'Terug naar Dashboard',
      de: 'Zurück zum Dashboard',
    },
    deleting: {
      fr: 'Suppression...',
      en: 'Deleting...',
      nl: 'Verwijderen...',
      de: 'Löschen...',
    },
    logoutSuccess: {
      fr: 'Déconnexion réussie',
      en: 'Successfully logged out',
      nl: 'Succesvol uitgelogd',
      de: 'Erfolgreich abgemeldet',
    },
    logoutError: {
      fr: 'Erreur lors de la déconnexion',
      en: 'Logout failed',
      nl: 'Uitloggen mislukt',
      de: 'Abmeldung fehlgeschlagen',
    },
    profileSettings: {
      fr: 'Paramètres du profil',
      en: 'Profile Settings',
      nl: 'Profielinstellingen',
      de: 'Profileinstellungen',
    },
    logout: {
      fr: 'Se déconnecter',
      en: 'Log out',
      nl: 'Uitloggen',
      de: 'Abmelden',
    },
    leaveSession: {
      fr: 'Quitter votre session',
      en: 'Leave your session',
      nl: 'Sessie verlaten',
      de: 'Sitzung beenden',
    },
    myProfile: {
      fr: 'Mon Profil',
      en: 'My Profile',
      nl: 'Mijn Profiel',
      de: 'Mein Profil',
    },
    manageInfo: {
      fr: 'Gérer mes informations',
      en: 'Manage my information',
      nl: 'Mijn informatie beheren',
      de: 'Meine Informationen verwalten',
    },
    settings: {
      fr: 'Paramètres',
      en: 'Settings',
      nl: 'Instellingen',
      de: 'Einstellungen',
    },
    accountPreferences: {
      fr: 'Préférences du compte',
      en: 'Account preferences',
      nl: 'Accountvoorkeuren',
      de: 'Kontoeinstellungen',
    },
    preferencesAndPrivacy: {
      fr: 'Préférences et confidentialité',
      en: 'Preferences and privacy',
      nl: 'Voorkeuren en privacy',
      de: 'Einstellungen und Datenschutz',
    },
    completeProfile: {
      fr: 'Compléter mon Living Persona',
      en: 'Complete my profile',
      nl: 'Mijn profiel voltooien',
      de: 'Mein Profil vervollständigen',
    },
    finances: {
      fr: 'Finances',
      en: 'Finances',
      nl: 'Financiën',
      de: 'Finanzen',
    },
    rentAndExpenses: {
      fr: 'Loyer et dépenses',
      en: 'Rent and expenses',
      nl: 'Huur en uitgaven',
      de: 'Miete und Ausgaben',
    },
    revenueAndExpenses: {
      fr: 'Revenus et dépenses',
      en: 'Revenue and expenses',
      nl: 'Inkomsten en uitgaven',
      de: 'Einnahmen und Ausgaben',
    },
    quickActions: {
      fr: 'Actions Rapides',
      en: 'Quick Actions',
      nl: 'Snelle Acties',
      de: 'Schnellaktionen',
    },
    openMenu: {
      fr: 'Ouvrir le menu',
      en: 'Open menu',
      nl: 'Menu openen',
      de: 'Menü öffnen',
    },
    closeMenu: {
      fr: 'Fermer le menu',
      en: 'Close menu',
      nl: 'Menu sluiten',
      de: 'Menü schließen',
    },
    profileMenu: {
      fr: 'Menu profil',
      en: 'Profile menu',
      nl: 'Profielmenu',
      de: 'Profilmenü',
    },
    quickActionsMenu: {
      fr: 'Menu actions rapides',
      en: 'Quick actions menu',
      nl: 'Snelle acties menu',
      de: 'Schnellaktionen-Menü',
    },
    notifications: {
      fr: 'Notifications',
      en: 'Notifications',
      nl: 'Meldingen',
      de: 'Benachrichtigungen',
    },
    noNotifications: {
      fr: 'Aucune notification',
      en: 'No notifications',
      nl: 'Geen meldingen',
      de: 'Keine Benachrichtigungen',
    },
    unreadNotifications: {
      fr: 'non lues',
      en: 'unread',
      nl: 'ongelezen',
      de: 'ungelesen',
    },
    favorites: {
      fr: 'favoris',
      en: 'favorites',
      nl: 'favorieten',
      de: 'Favoriten',
    },
    savedSearches: {
      fr: 'Recherches',
      en: 'Searches',
      nl: 'Zoekopdrachten',
      de: 'Suchen',
    },
    mySavedSearches: {
      fr: 'Mes recherches sauvegardées',
      en: 'My saved searches',
      nl: 'Mijn opgeslagen zoekopdrachten',
      de: 'Meine gespeicherten Suchen',
    },
    newMatches: {
      fr: 'nouveau Living Match',
      en: 'new match',
      nl: 'nieuwe match',
      de: 'neuer Match',
    },
    newMatchesPlural: {
      fr: 'nouveaux Living Matchs',
      en: 'new matches',
      nl: 'nieuwe matches',
      de: 'neue Matches',
    },
    compatibleProperties: {
      fr: 'Propriétés compatibles avec toi',
      en: 'Properties compatible with you',
      nl: 'Woningen die bij jou passen',
      de: 'Passende Immobilien für Sie',
    },
    // View mode toggles
    viewList: {
      fr: 'Liste',
      en: 'List',
      nl: 'Lijst',
      de: 'Liste',
    },
    viewMap: {
      fr: 'Carte',
      en: 'Map',
      nl: 'Kaart',
      de: 'Karte',
    },
    viewPeople: {
      fr: 'Personnes',
      en: 'People',
      nl: 'Mensen',
      de: 'Personen',
    },
    filters: {
      fr: 'Filtres',
      en: 'Filters',
      nl: 'Filters',
      de: 'Filter',
    },
    close: {
      fr: 'Fermer',
      en: 'Close',
      nl: 'Sluiten',
      de: 'Schließen',
    },
    confirm: {
      fr: 'Confirmer',
      en: 'Confirm',
      nl: 'Bevestigen',
      de: 'Bestätigen',
    },
    inProgress: {
      fr: 'En cours',
      en: 'In progress',
      nl: 'In behandeling',
      de: 'In Bearbeitung',
    },
  },

  // ============================================================================
  // ERROR PAGES (404, Error)
  // ============================================================================
  errorPages: {
    notFound: {
      title: {
        fr: 'Page non trouvée',
        en: 'Page Not Found',
        nl: 'Pagina niet gevonden',
        de: 'Seite nicht gefunden',
      },
      description: {
        fr: 'Désolé, nous n\'avons pas trouvé la page que tu cherches. Elle a peut-être été déplacée ou supprimée.',
        en: 'Sorry, we couldn\'t find the page you\'re looking for. It might have been moved or deleted.',
        nl: 'Sorry, we konden de pagina die je zoekt niet vinden. Deze is mogelijk verplaatst of verwijderd.',
        de: 'Entschuldigung, wir konnten die gesuchte Seite nicht finden. Sie wurde möglicherweise verschoben oder gelöscht.',
      },
      goHome: {
        fr: 'Retour à l\'accueil',
        en: 'Go Home',
        nl: 'Naar startpagina',
        de: 'Zur Startseite',
      },
      browseProperties: {
        fr: 'Parcourir les résidences',
        en: 'Browse Properties',
        nl: 'Woningen bekijken',
        de: 'Immobilien durchsuchen',
      },
      goBack: {
        fr: 'Retour',
        en: 'Go Back',
        nl: 'Terug',
        de: 'Zurück',
      },
    },
    error: {
      title: {
        fr: 'Oups ! Une erreur est survenue',
        en: 'Oops! Something went wrong',
        nl: 'Oeps! Er ging iets mis',
        de: 'Hoppla! Etwas ist schiefgelaufen',
      },
      description: {
        fr: 'Nous sommes désolés, quelque chose d\'inattendu s\'est produit. Ne t\'inquiète pas, tes données sont en sécurité.',
        en: 'We\'re sorry, but something unexpected happened. Don\'t worry, your data is safe.',
        nl: 'Sorry, er is iets onverwachts gebeurd. Maak je geen zorgen, je gegevens zijn veilig.',
        de: 'Es tut uns leid, aber etwas Unerwartetes ist passiert. Keine Sorge, Ihre Daten sind sicher.',
      },
      tryAgain: {
        fr: 'Réessayer',
        en: 'Try Again',
        nl: 'Opnieuw proberen',
        de: 'Erneut versuchen',
      },
      goHome: {
        fr: 'Retour à l\'accueil',
        en: 'Go Home',
        nl: 'Naar startpagina',
        de: 'Zur Startseite',
      },
      errorId: {
        fr: 'ID de l\'erreur',
        en: 'Error ID',
        nl: 'Fout-ID',
        de: 'Fehler-ID',
      },
    },
  },

  // ============================================================================
  // SETTINGS PAGE
  // ============================================================================
  settings: {
    title: {
      fr: 'Paramètres',
      en: 'Settings',
      nl: 'Instellingen',
      de: 'Einstellungen',
    },
    subtitle: {
      fr: 'Gérer ton compte et tes préférences',
      en: 'Manage your account and preferences',
      nl: 'Beheer uw account en voorkeuren',
      de: 'Verwalten Sie Ihr Konto und Ihre Einstellungen',
    },
    loading: {
      fr: 'Chargement...',
      en: 'Loading...',
      nl: 'Laden...',
      de: 'Laden...',
    },
    back: {
      fr: 'Retour',
      en: 'Back',
      nl: 'Terug',
      de: 'Zurück',
    },
    categories: {
      account: {
        fr: 'Compte',
        en: 'Account',
        nl: 'Account',
        de: 'Konto',
      },
      preferences: {
        fr: 'Préférences',
        en: 'Preferences',
        nl: 'Voorkeuren',
        de: 'Einstellungen',
      },
      advanced: {
        fr: 'Avancé',
        en: 'Advanced',
        nl: 'Geavanceerd',
        de: 'Erweitert',
      },
    },
    badges: {
      new: {
        fr: 'Nouveau',
        en: 'New',
        nl: 'Nieuw',
        de: 'Neu',
      },
      premium: {
        fr: 'Premium',
        en: 'Premium',
        nl: 'Premium',
        de: 'Premium',
      },
    },
    sections: {
      profile: {
        title: {
          fr: 'Profil',
          en: 'Profile',
          nl: 'Profiel',
          de: 'Profil',
        },
        description: {
          fr: 'Gérer tes informations personnelles',
          en: 'Manage your personal information',
          nl: 'Beheer uw persoonlijke gegevens',
          de: 'Verwalten Sie Ihre persönlichen Daten',
        },
      },
      security: {
        title: {
          fr: 'Sécurité',
          en: 'Security',
          nl: 'Beveiliging',
          de: 'Sicherheit',
        },
        description: {
          fr: 'Mot de passe et authentification',
          en: 'Password and authentication',
          nl: 'Wachtwoord en authenticatie',
          de: 'Passwort und Authentifizierung',
        },
      },
      verification: {
        title: {
          fr: 'Vérifications',
          en: 'Verifications',
          nl: 'Verificaties',
          de: 'Verifizierungen',
        },
        description: {
          fr: 'Téléphone, identité ITSME et badges',
          en: 'Phone, ITSME identity and badges',
          nl: 'Telefoon, ITSME-identiteit en badges',
          de: 'Telefon, ITSME-Identität und Abzeichen',
        },
      },
      privacy: {
        title: {
          fr: 'Confidentialité',
          en: 'Privacy',
          nl: 'Privacy',
          de: 'Datenschutz',
        },
        description: {
          fr: 'Contrôler la visibilité de ton profil',
          en: 'Control your profile visibility',
          nl: 'Beheer de zichtbaarheid van uw profiel',
          de: 'Kontrolle über die Sichtbarkeit Ihres Profils',
        },
      },
      privateCodes: {
        title: {
          fr: 'Codes Privés',
          en: 'Private Codes',
          nl: 'Privécodes',
          de: 'Private Codes',
        },
        description: {
          fr: "Codes d'invitation de ton résidence",
          en: 'Invitation codes for your residence',
          nl: 'Uitnodigingscodes voor uw woning',
          de: 'Einladungscodes für Ihre Residenz',
        },
      },
      residenceProfile: {
        title: {
          fr: 'Profil de la Résidence',
          en: 'Residence Profile',
          nl: 'Residentieprofiel',
          de: 'Residenzprofil',
        },
        description: {
          fr: 'Gérer les informations de ton résidence',
          en: 'Manage your residence information',
          nl: 'Beheer uw woninggegevens',
          de: 'Verwalten Sie Ihre Residenzinformationen',
        },
      },
      referrals: {
        title: {
          fr: 'Parrainage',
          en: 'Referrals',
          nl: 'Verwijzingen',
          de: 'Empfehlungen',
        },
        description: {
          fr: 'Invitez tes amis et gagnez des mois gratuits',
          en: 'Invite friends and earn free months',
          nl: 'Nodig vrienden uit en verdien gratis maanden',
          de: 'Laden Sie Freunde ein und verdienen Sie kostenlose Monate',
        },
      },
      invitations: {
        title: {
          fr: 'Invitations',
          en: 'Invitations',
          nl: 'Uitnodigingen',
          de: 'Einladungen',
        },
        description: {
          fr: 'Gère tes invitations à rejoindre des co-livings',
          en: 'Manage your invitations to join shared housing',
          nl: 'Beheer uw uitnodigingen om deel te nemen aan gedeelde huisvesting',
          de: 'Verwalten Sie Ihre Einladungen zu WGs',
        },
      },
      notifications: {
        title: {
          fr: 'Notifications',
          en: 'Notifications',
          nl: 'Meldingen',
          de: 'Benachrichtigungen',
        },
        description: {
          fr: 'Configurer tes préférences',
          en: 'Configure your preferences',
          nl: 'Configureer uw voorkeuren',
          de: 'Konfigurieren Sie Ihre Einstellungen',
        },
      },
      language: {
        title: {
          fr: 'Langue & Région',
          en: 'Language & Region',
          nl: 'Taal & Regio',
          de: 'Sprache & Region',
        },
        description: {
          fr: "Changer la langue de l'interface",
          en: 'Change the interface language',
          nl: 'Wijzig de interfacetaal',
          de: 'Ändern Sie die Oberflächensprache',
        },
      },
      email: {
        title: {
          fr: 'Emails',
          en: 'Emails',
          nl: 'E-mails',
          de: 'E-Mails',
        },
        description: {
          fr: 'Préférences de communications',
          en: 'Communication preferences',
          nl: 'Communicatievoorkeuren',
          de: 'Kommunikationseinstellungen',
        },
      },
      subscription: {
        title: {
          fr: 'Mon Abonnement',
          en: 'My Subscription',
          nl: 'Mijn Abonnement',
          de: 'Mein Abonnement',
        },
        description: {
          fr: 'Gérer votre plan et votre essai gratuit',
          en: 'Manage your plan and free trial',
          nl: 'Beheer uw abonnement en gratis proefperiode',
          de: 'Verwalten Sie Ihren Plan und Ihre kostenlose Testversion',
        },
      },
      payment: {
        title: {
          fr: 'Moyens de paiement',
          en: 'Payment Methods',
          nl: 'Betaalmethoden',
          de: 'Zahlungsmethoden',
        },
        description: {
          fr: 'Gérer tes cartes et méthodes de paiement',
          en: 'Manage your cards and payment methods',
          nl: 'Beheer uw kaarten en betaalmethoden',
          de: 'Verwalten Sie Ihre Karten und Zahlungsmethoden',
        },
      },
      invoices: {
        title: {
          fr: 'Factures',
          en: 'Invoices',
          nl: 'Facturen',
          de: 'Rechnungen',
        },
        description: {
          fr: 'Historique et téléchargement des factures',
          en: 'Invoice history and downloads',
          nl: 'Factuurgeschiedenis en downloads',
          de: 'Rechnungsverlauf und Downloads',
        },
      },
      devices: {
        title: {
          fr: 'Appareils',
          en: 'Devices',
          nl: 'Apparaten',
          de: 'Geräte',
        },
        description: {
          fr: 'Gérer tes sessions actives',
          en: 'Manage your active sessions',
          nl: 'Beheer uw actieve sessies',
          de: 'Verwalten Sie Ihre aktiven Sitzungen',
        },
      },
    },
    help: {
      title: {
        fr: "Besoin d'aide ?",
        en: 'Need help?',
        nl: 'Hulp nodig?',
        de: 'Brauchen Sie Hilfe?',
      },
      description: {
        fr: "Consulte notre centre d'aide ou contactez le support",
        en: 'Check our help center or contact support',
        nl: 'Bekijk ons helpcentrum of neem contact op met support',
        de: 'Besuchen Sie unser Hilfezentrum oder kontaktieren Sie den Support',
      },
      helpCenter: {
        fr: "Centre d'aide",
        en: 'Help Center',
        nl: 'Helpcentrum',
        de: 'Hilfezentrum',
      },
      contactSupport: {
        fr: 'Contacter le support',
        en: 'Contact Support',
        nl: 'Contact opnemen met support',
        de: 'Support kontaktieren',
      },
    },

    // Bank Info Page
    bankInfo: {
      pageTitle: {
        fr: 'Informations bancaires',
        en: 'Bank Information',
        nl: 'Bankgegevens',
        de: 'Bankinformationen',
      },
      subtitle: {
        fr: 'Gère tes informations de paiement',
        en: 'Manage your payment information',
        nl: 'Beheer uw betalingsgegevens',
        de: 'Verwalten Sie Ihre Zahlungsinformationen',
      },
      sections: {
        bankAccount: {
          fr: 'Compte bancaire',
          en: 'Bank Account',
          nl: 'Bankrekening',
          de: 'Bankkonto',
        },
        mobileMethods: {
          fr: 'Paiements mobiles',
          en: 'Mobile Payments',
          nl: 'Mobiele betalingen',
          de: 'Mobile Zahlungen',
        },
      },
      fields: {
        accountHolder: {
          fr: 'Titulaire du compte',
          en: 'Account Holder',
          nl: 'Rekeninghouder',
          de: 'Kontoinhaber',
        },
        bankName: {
          fr: 'Nom de la banque',
          en: 'Bank Name',
          nl: 'Banknaam',
          de: 'Bankname',
        },
        optional: {
          fr: 'optionnel',
          en: 'optional',
          nl: 'optioneel',
          de: 'optional',
        },
        ibanHint: {
          fr: 'Votre numéro de compte international (IBAN)',
          en: 'Your International Bank Account Number (IBAN)',
          nl: 'Uw internationaal bankrekeningnummer (IBAN)',
          de: 'Ihre internationale Bankkontonummer (IBAN)',
        },
        payconiqHint: {
          fr: 'Permettre les paiements via Payconiq',
          en: 'Allow payments via Payconiq',
          nl: 'Betalingen via Payconiq toestaan',
          de: 'Zahlungen über Payconiq erlauben',
        },
        revtagHint: {
          fr: 'Votre identifiant Revolut pour recevoir des paiements',
          en: 'Your Revolut ID to receive payments',
          nl: 'Uw Revolut-ID om betalingen te ontvangen',
          de: 'Ihre Revolut-ID zum Empfangen von Zahlungen',
        },
      },
      placeholders: {
        accountHolder: {
          fr: 'Jean Dupont',
          en: 'John Doe',
          nl: 'Jan Jansen',
          de: 'Max Mustermann',
        },
        iban: {
          fr: 'BE68 5390 0754 7034',
          en: 'BE68 5390 0754 7034',
          nl: 'NL91 ABNA 0417 1643 00',
          de: 'DE89 3704 0044 0532 0130 00',
        },
        bankName: {
          fr: 'KBC, ING, Belfius...',
          en: 'KBC, ING, Belfius...',
          nl: 'ING, ABN AMRO, Rabobank...',
          de: 'Sparkasse, Deutsche Bank...',
        },
        bic: {
          fr: 'KREDBEBB',
          en: 'KREDBEBB',
          nl: 'ABNANL2A',
          de: 'COBADEFFXXX',
        },
        revtag: {
          fr: 'votre_revtag',
          en: 'your_revtag',
          nl: 'uw_revtag',
          de: 'ihr_revtag',
        },
      },
      security: {
        title: {
          fr: 'Données sécurisées',
          en: 'Secure Data',
          nl: 'Beveiligde gegevens',
          de: 'Sichere Daten',
        },
        description: {
          fr: 'Vos informations bancaires sont chiffrées et ne sont visibles que par tes résidents pour effectuer des paiements.',
          en: 'Your bank information is encrypted and only visible to your roommates for making payments.',
          nl: 'Uw bankgegevens zijn versleuteld en alleen zichtbaar voor uw huisgenoten om betalingen te doen.',
          de: 'Ihre Bankdaten sind verschlüsselt und nur für Ihre Mitbewohner sichtbar, um Zahlungen zu tätigen.',
        },
      },
      buttons: {
        saving: {
          fr: 'Enregistrement...',
          en: 'Saving...',
          nl: 'Opslaan...',
          de: 'Speichern...',
        },
        save: {
          fr: 'Enregistrer les informations',
          en: 'Save Information',
          nl: 'Informatie opslaan',
          de: 'Informationen speichern',
        },
      },
      twoFactor: {
        title: {
          fr: 'Confirmation requise',
          en: 'Confirmation Required',
          nl: 'Bevestiging vereist',
          de: 'Bestätigung erforderlich',
        },
        description: {
          fr: 'Pour modifier tes informations bancaires, veuillez confirmer votre identité.',
          en: 'To modify your bank information, please confirm your identity.',
          nl: 'Om uw bankgegevens te wijzigen, bevestig uw identiteit.',
          de: 'Um Ihre Bankdaten zu ändern, bestätigen Sie bitte Ihre Identität.',
        },
        passwordLabel: {
          fr: 'Mot de passe',
          en: 'Password',
          nl: 'Wachtwoord',
          de: 'Passwort',
        },
        passwordPlaceholder: {
          fr: 'Entrez ton mot de passe',
          en: 'Enter your password',
          nl: 'Voer uw wachtwoord in',
          de: 'Geben Sie Ihr Passwort ein',
        },
        cancel: {
          fr: 'Annuler',
          en: 'Cancel',
          nl: 'Annuleren',
          de: 'Abbrechen',
        },
        verifying: {
          fr: 'Vérification...',
          en: 'Verifying...',
          nl: 'Verifiëren...',
          de: 'Überprüfen...',
        },
        confirm: {
          fr: 'Confirmer et enregistrer',
          en: 'Confirm and Save',
          nl: 'Bevestigen en opslaan',
          de: 'Bestätigen und speichern',
        },
      },
    },
  },

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================
  notifications: {
    title: {
      fr: 'Notifications',
      en: 'Notifications',
      nl: 'Meldingen',
      de: 'Benachrichtigungen',
    },
    markAllRead: {
      fr: 'Tout marquer comme lu',
      en: 'Mark all read',
      nl: 'Alles als gelezen markeren',
      de: 'Alle als gelesen markieren',
    },
    clearRead: {
      fr: 'Effacer les lues',
      en: 'Clear read',
      nl: 'Gelezen wissen',
      de: 'Gelesene löschen',
    },
    noNotifications: {
      fr: 'Pas encore de notifications',
      en: 'No notifications yet',
      nl: 'Nog geen meldingen',
      de: 'Noch keine Benachrichtigungen',
    },
    viewAll: {
      fr: 'Voir toutes les notifications',
      en: 'View all notifications',
      nl: 'Alle meldingen bekijken',
      de: 'Alle Benachrichtigungen anzeigen',
    },
    none: {
      fr: 'Aucune notification',
      en: 'No notifications',
      nl: 'Geen meldingen',
      de: 'Keine Benachrichtigungen',
    },
    unread: {
      fr: 'non lues',
      en: 'unread',
      nl: 'ongelezen',
      de: 'ungelesen',
    },
    clickToView: {
      fr: 'Cliquez pour voir',
      en: 'Click to view',
      nl: 'Klik om te bekijken',
      de: 'Klicken um anzuzeigen',
    },
    time: {
      justNow: {
        fr: "À l'instant",
        en: 'Just now',
        nl: 'Zojuist',
        de: 'Gerade eben',
      },
      minutesAgo: {
        fr: 'il y a {count}m',
        en: '{count}m ago',
        nl: '{count}m geleden',
        de: 'vor {count}m',
      },
      hoursAgo: {
        fr: 'il y a {count}h',
        en: '{count}h ago',
        nl: '{count}u geleden',
        de: 'vor {count}h',
      },
      daysAgo: {
        fr: 'il y a {count}j',
        en: '{count}d ago',
        nl: '{count}d geleden',
        de: 'vor {count}T',
      },
    },
    newApplication: {
      fr: 'nouvelle candidature',
      en: 'new application',
      nl: 'nieuwe aanvraag',
      de: 'neue Bewerbung',
    },
    newApplications: {
      fr: 'nouvelles candidatures',
      en: 'new applications',
      nl: 'nieuwe aanvragen',
      de: 'neue Bewerbungen',
    },
    toast: {
      allMarkedAsRead: {
        fr: 'Toutes les notifications marquées comme lues',
        en: 'All notifications marked as read',
        nl: 'Alle meldingen als gelezen gemarkeerd',
        de: 'Alle Benachrichtigungen als gelesen markiert',
      },
      markError: {
        fr: 'Erreur lors du marquage des notifications',
        en: 'Error marking notifications',
        nl: 'Fout bij het markeren van meldingen',
        de: 'Fehler beim Markieren der Benachrichtigungen',
      },
      readDeleted: {
        fr: 'Notifications lues supprimées',
        en: 'Read notifications deleted',
        nl: 'Gelezen meldingen verwijderd',
        de: 'Gelesene Benachrichtigungen gelöscht',
      },
      deleteError: {
        fr: 'Erreur lors de la suppression des notifications',
        en: 'Error deleting notifications',
        nl: 'Fout bij het verwijderen van meldingen',
        de: 'Fehler beim Löschen der Benachrichtigungen',
      },
      notificationDeleted: {
        fr: 'Notification supprimée',
        en: 'Notification deleted',
        nl: 'Melding verwijderd',
        de: 'Benachrichtigung gelöscht',
      },
      deleteSingleError: {
        fr: 'Erreur lors de la suppression',
        en: 'Error deleting',
        nl: 'Fout bij het verwijderen',
        de: 'Fehler beim Löschen',
      },
    },
    emptyState: {
      noUnread: {
        fr: 'Aucune notification non lue',
        en: 'No unread notifications',
        nl: 'Geen ongelezen meldingen',
        de: 'Keine ungelesenen Benachrichtigungen',
      },
      noRead: {
        fr: 'Aucune notification lue',
        en: 'No read notifications',
        nl: 'Geen gelezen meldingen',
        de: 'Keine gelesenen Benachrichtigungen',
      },
      noNotifications: {
        fr: 'Aucune notification',
        en: 'No notifications',
        nl: 'Geen meldingen',
        de: 'Keine Benachrichtigungen',
      },
      allRead: {
        fr: 'Toutes tes notifications ont été lues',
        en: 'All your notifications have been read',
        nl: 'Al je meldingen zijn gelezen',
        de: 'Alle Ihre Benachrichtigungen wurden gelesen',
      },
      noneReadYet: {
        fr: 'Tu n\'as pas encore lu de notifications',
        en: 'You haven\'t read any notifications yet',
        nl: 'Je hebt nog geen meldingen gelezen',
        de: 'Sie haben noch keine Benachrichtigungen gelesen',
      },
      willReceiveHere: {
        fr: 'Tu recevras tes notifications ici',
        en: 'You will receive your notifications here',
        nl: 'Je ontvangt hier je meldingen',
        de: 'Sie erhalten hier Ihre Benachrichtigungen',
      },
    },
  },

  // ============================================================================
  // HEADER - NAVIGATION & MENUS
  // ============================================================================
  header: {
    nav: {
      residents: {
        fr: 'Résidents',
        en: 'Residents',
        nl: 'Bewoners',
        de: 'Bewohner',
      },
      tasks: {
        fr: 'Tâches',
        en: 'Tasks',
        nl: 'Taken',
        de: 'Aufgaben',
      },
      finances: {
        fr: 'Finances',
        en: 'Finances',
        nl: 'Financiën',
        de: 'Finanzen',
      },
      calendar: {
        fr: 'Calendrier',
        en: 'Calendar',
        nl: 'Kalender',
        de: 'Kalender',
      },
      messages: {
        fr: 'Messages',
        en: 'Messages',
        nl: 'Berichten',
        de: 'Nachrichten',
      },
      properties: {
        fr: 'Propriétés',
        en: 'Properties',
        nl: 'Eigendommen',
        de: 'Immobilien',
      },
      applications: {
        fr: 'Candidatures',
        en: 'Applications',
        nl: 'Aanvragen',
        de: 'Bewerbungen',
      },
      finance: {
        fr: 'Finance',
        en: 'Finance',
        nl: 'Financiën',
        de: 'Finanzen',
      },
      maintenance: {
        fr: 'Maintenance',
        en: 'Maintenance',
        nl: 'Onderhoud',
        de: 'Wartung',
      },
    },
    quickActions: {
      title: {
        fr: 'Actions Rapides',
        en: 'Quick Actions',
        nl: 'Snelle Acties',
        de: 'Schnellaktionen',
      },
      resident: {
        payRent: {
          label: {
            fr: 'Payer le loyer',
            en: 'Pay rent',
            nl: 'Huur betalen',
            de: 'Miete zahlen',
          },
          description: {
            fr: 'Effectuer un paiement',
            en: 'Make a payment',
            nl: 'Een betaling doen',
            de: 'Eine Zahlung vornehmen',
          },
        },
        reportIssue: {
          label: {
            fr: 'Signaler un problème',
            en: 'Report an issue',
            nl: 'Een probleem melden',
            de: 'Ein Problem melden',
          },
          description: {
            fr: 'Créer une demande',
            en: 'Create a request',
            nl: 'Een verzoek aanmaken',
            de: 'Eine Anfrage erstellen',
          },
        },
        addExpense: {
          label: {
            fr: 'Ajouter une dépense',
            en: 'Add expense',
            nl: 'Uitgave toevoegen',
            de: 'Ausgabe hinzufügen',
          },
          description: {
            fr: 'Partager une dépense',
            en: 'Share an expense',
            nl: 'Een uitgave delen',
            de: 'Eine Ausgabe teilen',
          },
        },
        contactRoommates: {
          label: {
            fr: 'Contacter les résidents',
            en: 'Contact roommates',
            nl: 'Contact huisgenoten',
            de: 'Mitbewohner kontaktieren',
          },
          description: {
            fr: 'Envoyer un message',
            en: 'Send a message',
            nl: 'Een bericht sturen',
            de: 'Eine Nachricht senden',
          },
        },
      },
      owner: {
        addProperty: {
          label: {
            fr: 'Ajouter une propriété',
            en: 'Add property',
            nl: 'Eigendom toevoegen',
            de: 'Immobilie hinzufügen',
          },
          description: {
            fr: 'Créer un nouvelle résidence',
            en: 'Create a new property',
            nl: 'Een nieuw eigendom aanmaken',
            de: 'Eine neue Immobilie erstellen',
          },
        },
        maintenanceTicket: {
          label: {
            fr: 'Ticket maintenance',
            en: 'Maintenance ticket',
            nl: 'Onderhoudsticket',
            de: 'Wartungsticket',
          },
          description: {
            fr: 'Signaler un problème',
            en: 'Report an issue',
            nl: 'Een probleem melden',
            de: 'Ein Problem melden',
          },
        },
        addExpense: {
          label: {
            fr: 'Ajouter une dépense',
            en: 'Add expense',
            nl: 'Uitgave toevoegen',
            de: 'Ausgabe hinzufügen',
          },
          description: {
            fr: 'Enregistrer une dépense',
            en: 'Record an expense',
            nl: 'Een uitgave registreren',
            de: 'Eine Ausgabe erfassen',
          },
        },
        viewAnalytics: {
          label: {
            fr: 'Voir les analytics',
            en: 'View analytics',
            nl: 'Analytics bekijken',
            de: 'Analytics anzeigen',
          },
          description: {
            fr: 'Performances détaillées',
            en: 'Detailed performance',
            nl: 'Gedetailleerde prestaties',
            de: 'Detaillierte Leistung',
          },
        },
      },
    },
    stats: {
      tasks: {
        fr: 'Tâches',
        en: 'Tasks',
        nl: 'Taken',
        de: 'Aufgaben',
      },
      members: {
        fr: 'Membres',
        en: 'Members',
        nl: 'Leden',
        de: 'Mitglieder',
      },
      messages: {
        fr: 'Messages',
        en: 'Messages',
        nl: 'Berichten',
        de: 'Nachrichten',
      },
      revenue: {
        fr: 'Revenus',
        en: 'Revenue',
        nl: 'Inkomsten',
        de: 'Einnahmen',
      },
      roi: {
        fr: 'ROI',
        en: 'ROI',
        nl: 'ROI',
        de: 'ROI',
      },
      occupation: {
        fr: 'Occupation',
        en: 'Occupation',
        nl: 'Bezetting',
        de: 'Belegung',
      },
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
        fr: 'Ces détails nous aident à personnaliser ton expérience.',
        en: 'These details help us personalize your experience.',
        nl: 'Deze gegevens helpen ons je ervaring te personaliseren.',
        de: 'Diese Details helfen uns, Ihre Erfahrung zu personalisieren.',
      },
      subtitleDependent: {
        fr: 'Parlez-nous de la personne pour laquelle tu cherches.',
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
        fr: 'Ce profil sera séparé de ton profil personnel',
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
        fr: 'Cela t\'aide à identifier ce profil dans ton tableau de bord',
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
        fr: 'Bienvenue sur Izzico pour Propriétaires',
        en: 'Welcome to Izzico for Homeowners',
        nl: 'Welkom bij Izzico voor Huiseigenaren',
        de: 'Willkommen bei Izzico für Hausbesitzer',
      },
      welcomeSubtitle: {
        fr: 'Listez ta résidence, rencontre les bons résidents et gérez tout depuis un seul endroit.',
        en: 'List your property, meet the right tenants, and manage everything from one place.',
        nl: 'Vermeld je eigendom, ontmoet de juiste huurders en beheer alles vanaf één plek.',
        de: 'Listen Sie Ihre Immobilie auf, treffen Sie die richtigen Mieter und verwalten Sie alles an einem Ort.',
      },
      profileSetup: {
        fr: 'Configurons ton profil d\'hôte',
        en: "Let's set up your host profile",
        nl: 'Laten we je gastprofiel instellen',
        de: 'Richten wir Ihr Gastgeberprofil ein',
      },
      profileSetupHelp: {
        fr: 'Ton profil vérifié nous aide à établir la confiance avec les résidents potentiels.',
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
        fr: 'Requis pour la communication avec les résidents',
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

      // Owner About Page
      about: {
        title: {
          fr: 'Parle-nous de toi',
          en: 'Tell us about yourself',
          nl: 'Vertel ons over jezelf',
          de: 'Erzählen Sie uns von sich',
        },
        subtitle: {
          fr: 'Cela nous aide à personnaliser ton expérience d\'hébergement.',
          en: 'This helps us customize your hosting experience.',
          nl: 'Dit helpt ons je hostingervaring te personaliseren.',
          de: 'Dies hilft uns, Ihre Hosting-Erfahrung anzupassen.',
        },
        ownerTypeLabel: {
          fr: 'Je suis un...',
          en: 'I am a...',
          nl: 'Ik ben een...',
          de: 'Ich bin ein...',
        },
        individualOwner: {
          fr: 'Propriétaire Individuel',
          en: 'Individual Owner',
          nl: 'Individuele Eigenaar',
          de: 'Einzelner Eigentümer',
        },
        individualOwnerDesc: {
          fr: 'Je possède et gère mon propre résidence',
          en: 'I own and manage my own property',
          nl: 'Ik bezit en beheer mijn eigen eigendom',
          de: 'Ich besitze und verwalte meine eigene Immobilie',
        },
        propertyAgency: {
          fr: 'Agence Immobilière',
          en: 'Property Agency',
          nl: 'Vastgoedkantoor',
          de: 'Immobilienagentur',
        },
        propertyAgencyDesc: {
          fr: 'Je gère plusieurs résidences de manière professionnelle',
          en: 'I manage multiple properties professionally',
          nl: 'Ik beheer meerdere eigendommen professioneel',
          de: 'Ich verwalte mehrere Immobilien professionell',
        },
        companyCorporation: {
          fr: 'Société / Corporation',
          en: 'Company / Corporation',
          nl: 'Bedrijf / Corporatie',
          de: 'Unternehmen / Konzern',
        },
        companyCorporationDesc: {
          fr: 'Gestion immobilière d\'entreprise',
          en: 'Corporate property management',
          nl: 'Zakelijk vastgoedbeheer',
          de: 'Unternehmens-Immobilienverwaltung',
        },
        companyName: {
          fr: 'Nom de l\'entreprise',
          en: 'Company Name',
          nl: 'Bedrijfsnaam',
          de: 'Firmenname',
        },
        companyNamePlaceholder: {
          fr: 'Entrez le nom de ton entreprise ou agence',
          en: 'Enter your company or agency name',
          nl: 'Voer je bedrijfs- of kantoor naam in',
          de: 'Geben Sie Ihren Firmen- oder Agenturnamen ein',
        },
        primaryLocation: {
          fr: 'Localisation principale',
          en: 'Primary location',
          nl: 'Primaire locatie',
          de: 'Hauptstandort',
        },
        primaryLocationPlaceholder: {
          fr: 'Sélectionnez votre ville principale',
          en: 'Select your primary city',
          nl: 'Selecteer je primaire stad',
          de: 'Wählen Sie Ihre Hauptstadt',
        },
        hostingExperience: {
          fr: 'Expérience d\'hébergement',
          en: 'Hosting experience',
          nl: 'Hostingervaring',
          de: 'Hosting-Erfahrung',
        },
        hostingExperiencePlaceholder: {
          fr: 'Depuis combien de temps es-tu hôte?',
          en: 'How long have you been a host?',
          nl: 'Hoe lang ben je al host?',
          de: 'Wie lange sind Sie schon Gastgeber?',
        },
        experience0to1: {
          fr: '0-1 an',
          en: '0-1 year',
          nl: '0-1 jaar',
          de: '0-1 Jahr',
        },
        experience1to3: {
          fr: '1-3 ans',
          en: '1-3 years',
          nl: '1-3 jaar',
          de: '1-3 Jahre',
        },
        experience3plus: {
          fr: '3+ ans',
          en: '3+ years',
          nl: '3+ jaar',
          de: '3+ Jahre',
        },
        tipComplete: {
          fr: 'Astuce : Les profils complets reçoivent 3 fois plus de demandes de résidents en moyenne.',
          en: 'Tip: Complete profiles receive 3x more tenant inquiries on average.',
          nl: 'Tip: Volledige profielen ontvangen gemiddeld 3x meer huurdersvragen.',
          de: 'Tipp: Vollständige Profile erhalten durchschnittlich 3x mehr Mieteranfragen.',
        },
        errorRequired: {
          fr: 'Veuillez remplir tous les champs obligatoires',
          en: 'Please fill in all required fields',
          nl: 'Vul alle verplichte velden in',
          de: 'Bitte füllen Sie alle Pflichtfelder aus',
        },
        errorCompanyName: {
          fr: 'Veuillez entrer le nom de ton entreprise',
          en: 'Please enter your company name',
          nl: 'Voer je bedrijfsnaam in',
          de: 'Bitte geben Sie Ihren Firmennamen ein',
        },
        loading: {
          fr: 'Chargement de tes informations...',
          en: 'Loading your information...',
          nl: 'Je informatie laden...',
          de: 'Lade Ihre Informationen...',
        },
      },

      // Owner Payment Info Page
      paymentInfo: {
        title: {
          fr: 'Paiement et Banque',
          en: 'Payment & Banking',
          nl: 'Betaling & Bankieren',
          de: 'Zahlung & Banking',
        },
        subtitle: {
          fr: 'Fournissez tes coordonnées bancaires pour recevoir les paiements de loyer',
          en: 'Provide your banking details to receive rent payments',
          nl: 'Geef je bankgegevens op om huurbetalingen te ontvangen',
          de: 'Geben Sie Ihre Bankdaten an, um Mietzahlungen zu erhalten',
        },
        iban: {
          fr: 'IBAN',
          en: 'IBAN',
          nl: 'IBAN',
          de: 'IBAN',
        },
        ibanPlaceholder: {
          fr: 'FR76 1234 5678 9012 3456 7890 123',
          en: 'FR76 1234 5678 9012 3456 7890 123',
          nl: 'NL91 ABNA 0417 1643 00',
          de: 'DE89 3704 0044 0532 0130 00',
        },
        ibanHelp: {
          fr: 'Numéro de compte bancaire international pour recevoir les paiements',
          en: 'International Bank Account Number for receiving payments',
          nl: 'Internationaal bankrekeningnummer voor het ontvangen van betalingen',
          de: 'Internationale Bankkontonummer für den Empfang von Zahlungen',
        },
        swiftBic: {
          fr: 'Code SWIFT/BIC',
          en: 'SWIFT/BIC Code',
          nl: 'SWIFT/BIC-code',
          de: 'SWIFT/BIC-Code',
        },
        swiftBicPlaceholder: {
          fr: 'BNPAFRPP',
          en: 'BNPAFRPP',
          nl: 'ABNANL2A',
          de: 'COBADEFFXXX',
        },
        swiftBicHelp: {
          fr: 'Code d\'identification bancaire pour les virements internationaux',
          en: 'Bank Identifier Code for international transfers',
          nl: 'Bank Identifier Code voor internationale overboekingen',
          de: 'Bank Identifier Code für internationale Überweisungen',
        },
        securityNoticeTitle: {
          fr: 'Vos informations sont sécurisées',
          en: 'Your information is secure',
          nl: 'Je informatie is veilig',
          de: 'Ihre Informationen sind sicher',
        },
        securityNoticeDesc: {
          fr: 'Vos coordonnées bancaires sont cryptées et stockées en toute sécurité. Elles ne seront utilisées que pour traiter les paiements de loyer des résidents vérifiés.',
          en: 'Your banking details are encrypted and stored securely. They will only be used for processing rent payments from verified tenants.',
          nl: 'Je bankgegevens zijn versleuteld en veilig opgeslagen. Ze worden alleen gebruikt voor het verwerken van huurbetalingen van geverifieerde huurders.',
          de: 'Ihre Bankdaten sind verschlüsselt und sicher gespeichert. Sie werden nur für die Verarbeitung von Mietzahlungen von verifizierten Mietern verwendet.',
        },
        saveChanges: {
          fr: 'Enregistrer les modifications',
          en: 'Save Changes',
          nl: 'Wijzigingen opslaan',
          de: 'Änderungen speichern',
        },
        saved: {
          fr: 'Informations de paiement enregistrées !',
          en: 'Payment information saved!',
          nl: 'Betalingsinformatie opgeslagen!',
          de: 'Zahlungsinformationen gespeichert!',
        },
        backToProfile: {
          fr: 'Retour au profil',
          en: 'Back to Profile',
          nl: 'Terug naar profiel',
          de: 'Zurück zum Profil',
        },
      },

      // Owner Property Basics Page
      propertyBasics: {
        title: {
          fr: 'Votre Propriété',
          en: 'Your Property',
          nl: 'Je Eigendom',
          de: 'Ihre Immobilie',
        },
        subtitle: {
          fr: 'Parle-nous de tes projets de location',
          en: 'Let us know about your listing plans',
          nl: 'Laat ons weten over je verhuurplannen',
          de: 'Informieren Sie uns über Ihre Vermietungspläne',
        },
        hasPropertyLabel: {
          fr: 'As-tu déjà une résidence à louer?',
          en: 'Do you already have a property to list?',
          nl: 'Heb je al een eigendom om te verhuren?',
          de: 'Haben Sie bereits eine Immobilie zu vermieten?',
        },
        yes: {
          fr: 'Oui, j\'en ai un',
          en: 'Yes, I do',
          nl: 'Ja, dat heb ik',
          de: 'Ja, habe ich',
        },
        notYet: {
          fr: 'Pas encore',
          en: 'Not yet',
          nl: 'Nog niet',
          de: 'Noch nicht',
        },
        propertyLocation: {
          fr: 'Où se trouve ta propriété?',
          en: 'Where is your property located?',
          nl: 'Waar bevindt je eigendom zich?',
          de: 'Wo befindet sich Ihre Immobilie?',
        },
        propertyLocationPlaceholder: {
          fr: 'ex: Bruxelles, Paris, Amsterdam',
          en: 'e.g., Brussels, Paris, Amsterdam',
          nl: 'bijv. Brussel, Parijs, Amsterdam',
          de: 'z.B. Brüssel, Paris, Amsterdam',
        },
        propertyType: {
          fr: 'Quel type de propriété est-ce?',
          en: 'What type of property is it?',
          nl: 'Wat voor soort eigendom is het?',
          de: 'Was für eine Art von Immobilie ist es?',
        },
        propertyTypeSelect: {
          fr: 'Sélectionner le type...',
          en: 'Select type...',
          nl: 'Selecteer type...',
          de: 'Typ auswählen...',
        },
        apartment: {
          fr: 'Appartement',
          en: 'Apartment',
          nl: 'Appartement',
          de: 'Wohnung',
        },
        house: {
          fr: 'Maison',
          en: 'House',
          nl: 'Huis',
          de: 'Haus',
        },
        studio: {
          fr: 'Studio',
          en: 'Studio',
          nl: 'Studio',
          de: 'Studio',
        },
        privateRoom: {
          fr: 'Chambre Privée',
          en: 'Private Room',
          nl: 'Privékamer',
          de: 'Privatzimmer',
        },
        colivingSpace: {
          fr: 'Espace Co-living',
          en: 'Coliving Space',
          nl: 'Coliving Ruimte',
          de: 'Coliving Raum',
        },
        other: {
          fr: 'Autre',
          en: 'Other',
          nl: 'Ander',
          de: 'Andere',
        },
        infoGreat: {
          fr: 'Super! Tu pourras ajouter les détails complets de la propriété après avoir terminé ton profil.',
          en: 'Great! You\'ll be able to add full property details after completing your profile.',
          nl: 'Geweldig! Je kunt volledige eigendomsdetails toevoegen na het voltooien van je profiel.',
          de: 'Großartig! Sie können nach Abschluss Ihres Profils vollständige Immobiliendetails hinzufügen.',
        },
        noProblemTitle: {
          fr: 'Pas de problème!',
          en: 'No problem!',
          nl: 'Geen probleem!',
          de: 'Kein Problem!',
        },
        noProblemDesc: {
          fr: 'Complète ton profil d\'hôte maintenant, et tu pourras ajouter des résidences de propriétés quand tu seras prêt.',
          en: 'Complete your host profile now, and you can add property listings whenever you\'re ready.',
          nl: 'Voltooi nu je hostprofiel en je kunt eigendomsadvertenties toevoegen wanneer je klaar bent.',
          de: 'Vervollständigen Sie jetzt Ihr Gastgeberprofil und Sie können Immobilienanzeigen hinzufügen, wann immer Sie bereit sind.',
        },
        continue: {
          fr: 'Continuer',
          en: 'Continue',
          nl: 'Doorgaan',
          de: 'Weiter',
        },
      },

      // Owner Review Page
      review: {
        title: {
          fr: 'Vérifiez ton profil',
          en: 'Review your profile',
          nl: 'Controleer je profiel',
          de: 'Überprüfen Sie Ihr Profil',
        },
        subtitle: {
          fr: 'Assure-toi que tout est correct avant de soumettre.',
          en: 'Make sure everything looks good before submitting.',
          nl: 'Zorg ervoor dat alles goed is voor het indienen.',
          de: 'Stellen Sie sicher, dass alles in Ordnung ist, bevor Sie absenden.',
        },
        basicInfo: {
          fr: 'Informations de base',
          en: 'Basic Information',
          nl: 'Basisinformatie',
          de: 'Grundinformationen',
        },
        profileDetails: {
          fr: 'Détails du profil',
          en: 'Profile Details',
          nl: 'Profieldetails',
          de: 'Profildetails',
        },
        propertyInfo: {
          fr: 'Informations sur la propriété',
          en: 'Property Information',
          nl: 'Eigendomsinformatie',
          de: 'Immobilieninformationen',
        },
        verificationStatus: {
          fr: 'Statut de vérification',
          en: 'Verification Status',
          nl: 'Verificatiestatus',
          de: 'Verifizierungsstatus',
        },
        type: {
          fr: 'Type :',
          en: 'Type:',
          nl: 'Type:',
          de: 'Typ:',
        },
        company: {
          fr: 'Société :',
          en: 'Company:',
          nl: 'Bedrijf:',
          de: 'Firma:',
        },
        name: {
          fr: 'Nom :',
          en: 'Name:',
          nl: 'Naam:',
          de: 'Name:',
        },
        phone: {
          fr: 'Téléphone :',
          en: 'Phone:',
          nl: 'Telefoon:',
          de: 'Telefon:',
        },
        location: {
          fr: 'Localisation :',
          en: 'Location:',
          nl: 'Locatie:',
          de: 'Standort:',
        },
        experience: {
          fr: 'Expérience :',
          en: 'Experience:',
          nl: 'Ervaring:',
          de: 'Erfahrung:',
        },
        hasProperty: {
          fr: 'A une propriété :',
          en: 'Has Property:',
          nl: 'Heeft eigendom:',
          de: 'Hat Immobilie:',
        },
        yesLabel: {
          fr: 'Oui',
          en: 'Yes',
          nl: 'Ja',
          de: 'Ja',
        },
        notYetLabel: {
          fr: 'Pas encore',
          en: 'Not yet',
          nl: 'Nog niet',
          de: 'Noch nicht',
        },
        uploaded: {
          fr: 'Téléchargé',
          en: '✓ Uploaded',
          nl: '✓ Geüpload',
          de: '✓ Hochgeladen',
        },
        idDocument: {
          fr: 'Document d\'identité :',
          en: 'ID Document:',
          nl: 'ID-document:',
          de: 'Ausweisdokument:',
        },
        proofOfOwnership: {
          fr: 'Preuve de propriété :',
          en: 'Proof of Ownership:',
          nl: 'Bewijs van eigendom:',
          de: 'Eigentumsnachweis:',
        },
        nextStepsTitle: {
          fr: 'Prochaines étapes',
          en: 'Next steps',
          nl: 'Volgende stappen',
          de: 'Nächste Schritte',
        },
        nextStepsDesc: {
          fr: 'Après soumission, tu pourras ajouter ta première résidence de propriété !',
          en: 'After submitting, you\'ll be able to add your first property listing!',
          nl: 'Na het indienen kun je je eerste eigendomsadvertentie toevoegen!',
          de: 'Nach dem Absenden können Sie Ihre erste Immobilienanzeige hinzufügen!',
        },
        submitting: {
          fr: 'Envoi en cours...',
          en: 'Submitting...',
          nl: 'Indienen...',
          de: 'Wird gesendet...',
        },
        createProfile: {
          fr: 'Créer le profil',
          en: 'Create Profile',
          nl: 'Profiel aanmaken',
          de: 'Profil erstellen',
        },
        profileCreated: {
          fr: 'Profil créé avec succès !',
          en: 'Profile created successfully!',
          nl: 'Profiel succesvol aangemaakt!',
          de: 'Profil erfolgreich erstellt!',
        },
        nationality: {
          fr: 'Nationalité :',
          en: 'Nationality:',
          nl: 'Nationaliteit:',
          de: 'Nationalität:',
        },
      },

      // Owner Success Page
      success: {
        title: {
          fr: 'Profil créé avec succès !',
          en: 'Profile Created Successfully!',
          nl: 'Profiel succesvol aangemaakt!',
          de: 'Profil erfolgreich erstellt!',
        },
        welcome: {
          fr: 'Bienvenue sur Izzico ! Ton profil d\'hôte est maintenant actif. Prêt à ajouter ta première résidence de propriété ?',
          en: 'Welcome to Izzico! Your host profile is now active. Ready to add your first property listing?',
          nl: 'Welkom bij Izzico! Je hostprofiel is nu actief. Klaar om je eerste eigendomsadvertentie toe te voegen?',
          de: 'Willkommen bei Izzico! Ihr Gastgeberprofil ist jetzt aktiv. Bereit, Ihre erste Immobilienanzeige hinzuzufügen?',
        },
        stat3xLabel: {
          fr: '3x',
          en: '3x',
          nl: '3x',
          de: '3x',
        },
        stat3xDesc: {
          fr: 'Plus de demandes avec des résidences complètes',
          en: 'More inquiries with complete listings',
          nl: 'Meer vragen met complete advertenties',
          de: 'Mehr Anfragen mit vollständigen Anzeigen',
        },
        statFastLabel: {
          fr: 'Rapide',
          en: 'Fast',
          nl: 'Snel',
          de: 'Schnell',
        },
        statFastDesc: {
          fr: 'Liste en moins de 5 minutes',
          en: 'List in under 5 minutes',
          nl: 'Vermeld in minder dan 5 minuten',
          de: 'In unter 5 Minuten listen',
        },
        goToDashboard: {
          fr: 'Aller au tableau de bord',
          en: 'Go to Dashboard',
          nl: 'Ga naar dashboard',
          de: 'Zum Dashboard gehen',
        },
        enhanceProfile: {
          fr: 'Améliorez ton profil',
          en: 'Enhance Your Profile',
          nl: 'Verbeter je profiel',
          de: 'Verbessern Sie Ihr Profil',
        },
        backToHome: {
          fr: 'Retour à l\'accueil',
          en: 'Back to Home',
          nl: 'Terug naar home',
          de: 'Zurück zur Startseite',
        },
        needHelp: {
          fr: 'Besoin d\'aide ?',
          en: 'Need help?',
          nl: 'Hulp nodig?',
          de: 'Brauchen Sie Hilfe?',
        },
        contactSupport: {
          fr: 'Contacter le support',
          en: 'Contact Support',
          nl: 'Contact opnemen met support',
          de: 'Support kontaktieren',
        },
      },

      // Owner Verification Page
      verification: {
        title: {
          fr: 'Vérification du propriétaire',
          en: 'Landlord Verification',
          nl: 'Verhuurderverificatie',
          de: 'Vermieter-Verifizierung',
        },
        subtitle: {
          fr: 'Créez la confiance avec des informations d\'identification vérifiées',
          en: 'Build trust with verified credentials',
          nl: 'Bouw vertrouwen met geverifieerde referenties',
          de: 'Vertrauen mit verifizierten Anmeldeinformationen aufbauen',
        },
        idVerificationTitle: {
          fr: 'Vérification d\'identité (KYC)',
          en: 'Identity verification (KYC)',
          nl: 'Identiteitsverificatie (KYC)',
          de: 'Identitätsüberprüfung (KYC)',
        },
        idVerificationDesc: {
          fr: 'Téléchargez une pièce d\'identité officielle (passeport, permis de conduire, carte d\'identité nationale)',
          en: 'Upload a government-issued ID (passport, driver\'s license, national ID)',
          nl: 'Upload een door de overheid afgegeven ID (paspoort, rijbewijs, nationale ID)',
          de: 'Laden Sie einen amtlichen Ausweis hoch (Reisepass, Führerschein, Personalausweis)',
        },
        uploadId: {
          fr: 'Télécharger l\'ID',
          en: 'Upload ID',
          nl: 'ID uploaden',
          de: 'ID hochladen',
        },
        changeId: {
          fr: 'Changer l\'ID',
          en: 'Change ID',
          nl: 'ID wijzigen',
          de: 'ID ändern',
        },
        proofOfOwnershipTitle: {
          fr: 'Preuve de propriété',
          en: 'Proof of ownership',
          nl: 'Bewijs van eigendom',
          de: 'Eigentumsnachweis',
        },
        proofOfOwnershipDesc: {
          fr: 'Téléchargez un acte de propriété, un contrat de location ou une autorisation de gestion',
          en: 'Upload property deed, rental agreement, or management authorization',
          nl: 'Upload eigendomsakte, huurovereenkomst of beheervergunning',
          de: 'Laden Sie Eigentumsurkunde, Mietvertrag oder Verwaltungsgenehmigung hoch',
        },
        uploadDocument: {
          fr: 'Télécharger le document',
          en: 'Upload Document',
          nl: 'Document uploaden',
          de: 'Dokument hochladen',
        },
        changeDocument: {
          fr: 'Changer le document',
          en: 'Change Document',
          nl: 'Document wijzigen',
          de: 'Dokument ändern',
        },
        emailVerificationTitle: {
          fr: 'Vérification par email',
          en: 'Email verification',
          nl: 'E-mailverificatie',
          de: 'E-Mail-Verifizierung',
        },
        emailVerificationDesc: {
          fr: 'Nous t\'enverrons un lien de vérification à ton email',
          en: 'We\'ll send a verification link to your email',
          nl: 'We sturen een verificatielink naar je e-mail',
          de: 'Wir senden einen Verifizierungslink an Ihre E-Mail',
        },
        verifyEmail: {
          fr: 'Vérifier l\'email',
          en: 'Verify Email',
          nl: 'E-mail verifiëren',
          de: 'E-Mail verifizieren',
        },
        phoneVerificationTitle: {
          fr: 'Vérification par téléphone',
          en: 'Phone verification',
          nl: 'Telefoonverificatie',
          de: 'Telefonverifizierung',
        },
        phoneVerificationDesc: {
          fr: 'Entrez ton numéro de téléphone',
          en: 'Enter your phone number',
          nl: 'Voer je telefoonnummer in',
          de: 'Geben Sie Ihre Telefonnummer ein',
        },
        phoneNumberPlaceholder: {
          fr: '+33 6 12 34 56 78',
          en: '+33 6 12 34 56 78',
          nl: '+31 6 12 34 56 78',
          de: '+49 30 12345678',
        },
        sendOtp: {
          fr: 'Envoyer le code OTP',
          en: 'Send OTP',
          nl: 'OTP verzenden',
          de: 'OTP senden',
        },
        whyVerifyTitle: {
          fr: 'Pourquoi se vérifier en tant que propriétaire?',
          en: 'Why verify as a landlord?',
          nl: 'Waarom verifiëren als verhuurder?',
          de: 'Warum als Vermieter verifizieren?',
        },
        whyVerify1: {
          fr: '•Créez la confiance avec les résidents potentiels',
          en: '•Build trust with potential tenants',
          nl: '•Bouw vertrouwen met potentiële huurders',
          de: '•Vertrauen bei potenziellen Mietern aufbauen',
        },
        whyVerify2: {
          fr: '•Obtenez un placement prioritaire des résidences',
          en: '•Get priority listing placement',
          nl: '•Krijg prioriteit bij advertentievermelding',
          de: '•Erhalten Sie vorrangige Anzeigenplatzierung',
        },
        whyVerify3: {
          fr: '•Débloquez le badge de propriétaire vérifié',
          en: '•Unlock verified landlord badge',
          nl: '•Ontgrendel geverifieerde verhuurdersbadge',
          de: '•Verifiziertes Vermieter-Badge freischalten',
        },
        whyVerify4: {
          fr: '•Respectez les exigences légales',
          en: '•Comply with legal requirements',
          nl: '•Voldoe aan wettelijke vereisten',
          de: '•Erfüllen Sie gesetzliche Anforderungen',
        },
        saveProgress: {
          fr: 'Enregistrer la progression',
          en: 'Save Progress',
          nl: 'Voortgang opslaan',
          de: 'Fortschritt speichern',
        },
        verifyLater: {
          fr: 'Je vérifierai plus tard',
          en: 'I\'ll verify later',
          nl: 'Ik verifieer later',
          de: 'Ich verifiziere später',
        },
      },
    },

    // Property Onboarding Pages
    property: {
      // Property Basics Page
      basics: {
        title: {
          fr: 'Informations de base sur la propriété',
          en: 'Property Basics',
          nl: 'Eigendomsbasis',
          de: 'Immobilien-Grundlagen',
        },
        subtitle: {
          fr: 'Commencez par décrire les bases de ta propriété.',
          en: 'Start by describing your property basics.',
          nl: 'Begin met het beschrijven van de basisinformatie van je eigendom.',
          de: 'Beginnen Sie mit der Beschreibung Ihrer Immobilien-Grundlagen.',
        },
        propertyType: {
          fr: 'Type de propriété',
          en: 'Property Type',
          nl: 'Type eigendom',
          de: 'Immobilientyp',
        },
        apartment: {
          fr: 'Appartement',
          en: 'Apartment',
          nl: 'Appartement',
          de: 'Wohnung',
        },
        house: {
          fr: 'Maison',
          en: 'House',
          nl: 'Huis',
          de: 'Haus',
        },
        condo: {
          fr: 'Condo',
          en: 'Condo',
          nl: 'Condo',
          de: 'Eigentumswohnung',
        },
        studio: {
          fr: 'Studio',
          en: 'Studio',
          nl: 'Studio',
          de: 'Studio',
        },
        coliving: {
          fr: 'Co-living',
          en: 'Coliving',
          nl: 'Coliving',
          de: 'Coliving',
        },
        propertyAddress: {
          fr: 'Adresse de la propriété',
          en: 'Property address',
          nl: 'Eigendomsadres',
          de: 'Immobilienadresse',
        },
        propertyAddressPlaceholder: {
          fr: '123 Rue Principale, Appt 4B',
          en: '123 Main St, Apt 4B',
          nl: 'Hoofdstraat 123, App 4B',
          de: 'Hauptstraße 123, Wohnung 4B',
        },
        city: {
          fr: 'Ville',
          en: 'City',
          nl: 'Stad',
          de: 'Stadt',
        },
        cityPlaceholder: {
          fr: 'Ville',
          en: 'City',
          nl: 'Stad',
          de: 'Stadt',
        },
        zipCode: {
          fr: 'Code postal',
          en: 'ZIP Code',
          nl: 'Postcode',
          de: 'Postleitzahl',
        },
        zipCodePlaceholder: {
          fr: '1180',
          en: '1180',
          nl: '1180',
          de: '1180',
        },
        bedrooms: {
          fr: 'Chambres',
          en: 'Bedrooms',
          nl: 'Slaapkamers',
          de: 'Schlafzimmer',
        },
        bathrooms: {
          fr: 'Salles de bain',
          en: 'Bathrooms',
          nl: 'Badkamers',
          de: 'Badezimmer',
        },
        select: {
          fr: 'Sélectionner',
          en: 'Select',
          nl: 'Selecteer',
          de: 'Auswählen',
        },
        continue: {
          fr: 'Continuer',
          en: 'Continue',
          nl: 'Doorgaan',
          de: 'Weiter',
        },
        errorRequired: {
          fr: 'Veuillez remplir tous les champs obligatoires',
          en: 'Please fill in all required fields',
          nl: 'Vul alle verplichte velden in',
          de: 'Bitte füllen Sie alle Pflichtfelder aus',
        },
      },

      // Property Description Page
      description: {
        title: {
          fr: 'Description de la propriété',
          en: 'Property Description',
          nl: 'Eigendomsbeschrijving',
          de: 'Immobilienbeschreibung',
        },
        subtitle: {
          fr: 'De bonnes descriptions aident ta résidence à se démarquer.',
          en: 'Great descriptions help your listing stand out.',
          nl: 'Geweldige beschrijvingen helpen je advertentie op te vallen.',
          de: 'Gute Beschreibungen helfen Ihrer Anzeige, sich abzuheben.',
        },
        proTipTitle: {
          fr: 'Astuce pro',
          en: 'Pro tip',
          nl: 'Pro tip',
          de: 'Profi-Tipp',
        },
        proTipDesc: {
          fr: 'Mentionnez les commodités à proximité, les transports et ce qui la rend spéciale !',
          en: 'Mention nearby amenities, transit, and what makes it special!',
          nl: 'Vermeld nabijgelegen voorzieningen, vervoer en wat het speciaal maakt!',
          de: 'Erwähnen Sie nahe gelegene Annehmlichkeiten, Verkehrsmittel und was es besonders macht!',
        },
        propertyDescription: {
          fr: 'Description de la propriété',
          en: 'Property description',
          nl: 'Eigendomsbeschrijving',
          de: 'Immobilienbeschreibung',
        },
        descriptionPlaceholder: {
          fr: 'Décrivez les meilleures caractéristiques de ta propriété, les commodités à proximité et ce qui la rend spéciale...',
          en: 'Describe your property\'s best features, nearby amenities, and what makes it special...',
          nl: 'Beschrijf de beste kenmerken van je eigendom, nabijgelegen voorzieningen en wat het speciaal maakt...',
          de: 'Beschreiben Sie die besten Eigenschaften Ihrer Immobilie, nahe gelegene Annehmlichkeiten und was sie besonders macht...',
        },
        charactersRemaining: {
          fr: 'caractères restants',
          en: 'characters remaining',
          nl: 'tekens over',
          de: 'Zeichen übrig',
        },
        photosComingSoon: {
          fr: 'Photos bientôt disponibles : Tu pourras ajouter des photos dans la prochaine version !',
          en: 'Photos coming soon: You\'ll be able to add photos in the next version!',
          nl: 'Foto\'s komen eraan: Je kunt foto\'s toevoegen in de volgende versie!',
          de: 'Fotos kommen bald: Sie können in der nächsten Version Fotos hinzufügen!',
        },
        skipForNow: {
          fr: 'Ignorer pour le moment',
          en: 'Skip for now',
          nl: 'Voor nu overslaan',
          de: 'Vorerst überspringen',
        },
      },

      // Property Pricing Page
      pricing: {
        title: {
          fr: 'Tarification et disponibilité',
          en: 'Pricing & Availability',
          nl: 'Prijzen & Beschikbaarheid',
          de: 'Preisgestaltung & Verfügbarkeit',
        },
        subtitle: {
          fr: 'Fixez des prix compétitifs pour attirer des résidents de qualité.',
          en: 'Set competitive pricing to attract quality tenants.',
          nl: 'Stel concurrerende prijzen in om kwaliteitshuurders aan te trekken.',
          de: 'Setzen Sie wettbewerbsfähige Preise, um Qualitätsmieter anzuziehen.',
        },
        monthlyRent: {
          fr: 'Loyer mensuel (€)',
          en: 'Monthly Rent (€)',
          nl: 'Maandelijkse huur (€)',
          de: 'Monatliche Miete (€)',
        },
        monthlyRentPlaceholder: {
          fr: '1300',
          en: '1300',
          nl: '1300',
          de: '1300',
        },
        earningsEstimate: {
          fr: 'Tu gagneras environ',
          en: 'You\'ll earn approximately',
          nl: 'Je verdient ongeveer',
          de: 'Sie werden ungefähr verdienen',
        },
        perMonth: {
          fr: '/mois',
          en: '/month',
          nl: '/maand',
          de: '/Monat',
        },
        afterFees: {
          fr: 'après frais de plateforme',
          en: 'after platform fees',
          nl: 'na platformkosten',
          de: 'nach Plattformgebühren',
        },
        securityDeposit: {
          fr: 'Dépôt de garantie (€)',
          en: 'Security Deposit (€)',
          nl: 'Borgsom (€)',
          de: 'Kaution (€)',
        },
        securityDepositPlaceholder: {
          fr: '2500',
          en: '2500',
          nl: '2500',
          de: '2500',
        },
        securityDepositHelp: {
          fr: 'Généralement égal à 1 mois de loyer',
          en: 'Typically equal to 1 month\'s rent',
          nl: 'Meestal gelijk aan 1 maand huur',
          de: 'Normalerweise gleich 1 Monatsmiete',
        },
        availableFrom: {
          fr: 'Disponible à partir de',
          en: 'Available from',
          nl: 'Beschikbaar vanaf',
          de: 'Verfügbar ab',
        },
        continue: {
          fr: 'Continuer',
          en: 'Continue',
          nl: 'Doorgaan',
          de: 'Weiter',
        },
        errorRequired: {
          fr: 'Veuillez remplir tous les champs obligatoires',
          en: 'Please fill in all required fields',
          nl: 'Vul alle verplichte velden in',
          de: 'Bitte füllen Sie alle Pflichtfelder aus',
        },
      },

      // Property Review Page
      review: {
        title: {
          fr: 'Vérifiez ta résidence',
          en: 'Review your listing',
          nl: 'Controleer je advertentie',
          de: 'Überprüfen Sie Ihre Anzeige',
        },
        subtitle: {
          fr: 'Assure-toi que tout est correct avant de publier.',
          en: 'Make sure everything looks good before publishing.',
          nl: 'Zorg ervoor dat alles goed is voor het publiceren.',
          de: 'Stellen Sie sicher, dass alles in Ordnung ist, bevor Sie veröffentlichen.',
        },
        propertyDetails: {
          fr: 'Détails de la propriété',
          en: 'Property Details',
          nl: 'Eigendomsdetails',
          de: 'Immobiliendetails',
        },
        location: {
          fr: 'Localisation',
          en: 'Location',
          nl: 'Locatie',
          de: 'Standort',
        },
        pricing: {
          fr: 'Tarification',
          en: 'Pricing',
          nl: 'Prijzen',
          de: 'Preisgestaltung',
        },
        description: {
          fr: 'Description',
          en: 'Description',
          nl: 'Beschrijving',
          de: 'Beschreibung',
        },
        type: {
          fr: 'Type :',
          en: 'Type:',
          nl: 'Type:',
          de: 'Typ:',
        },
        bedrooms: {
          fr: 'Chambres :',
          en: 'Bedrooms:',
          nl: 'Slaapkamers:',
          de: 'Schlafzimmer:',
        },
        bathrooms: {
          fr: 'Salles de bain :',
          en: 'Bathrooms:',
          nl: 'Badkamers:',
          de: 'Badezimmer:',
        },
        address: {
          fr: 'Adresse :',
          en: 'Address:',
          nl: 'Adres:',
          de: 'Adresse:',
        },
        city: {
          fr: 'Ville :',
          en: 'City:',
          nl: 'Stad:',
          de: 'Stadt:',
        },
        monthlyRent: {
          fr: 'Loyer mensuel :',
          en: 'Monthly Rent:',
          nl: 'Maandelijkse huur:',
          de: 'Monatliche Miete:',
        },
        securityDeposit: {
          fr: 'Dépôt de garantie :',
          en: 'Security Deposit:',
          nl: 'Borgsom:',
          de: 'Kaution:',
        },
        availableFrom: {
          fr: 'Disponible à partir de :',
          en: 'Available From:',
          nl: 'Beschikbaar vanaf:',
          de: 'Verfügbar ab:',
        },
        readyToPublishTitle: {
          fr: 'Prêt à publier !',
          en: 'Ready to publish!',
          nl: 'Klaar om te publiceren!',
          de: 'Bereit zum Veröffentlichen!',
        },
        readyToPublishDesc: {
          fr: 'Ta résidence sera en ligne immédiatement et visible aux résidents de qualité.',
          en: 'Your listing will be live immediately and visible to quality tenants.',
          nl: 'Je advertentie is direct live en zichtbaar voor kwaliteitshuurders.',
          de: 'Ihre Anzeige wird sofort live sein und für Qualitätsmieter sichtbar sein.',
        },
        publishing: {
          fr: 'Publication en cours...',
          en: 'Publishing...',
          nl: 'Publiceren...',
          de: 'Wird veröffentlicht...',
        },
        publishListing: {
          fr: 'Mettre en ligne',
          en: 'Publish Residence',
          nl: 'Residentie publiceren',
          de: 'Residenz veröffentlichen',
        },
        errorNoOwner: {
          fr: 'Erreur : Aucun profil de propriétaire trouvé. Veuillez d\'abord compléter l\'intégration du propriétaire.',
          en: 'Error: No owner profile found. Please complete the owner onboarding first.',
          nl: 'Fout: Geen eigenaarsprofiel gevonden. Voltooi eerst de eigenaar onboarding.',
          de: 'Fehler: Kein Eigentümerprofil gefunden. Bitte schließen Sie zuerst das Eigentümer-Onboarding ab.',
        },
      },

      // Property Success Page
      success: {
        title: {
          fr: 'Résidence mise en ligne !',
          en: 'Listing Published!',
          nl: 'Advertentie gepubliceerd!',
          de: 'Anzeige veröffentlicht!',
        },
        subtitle: {
          fr: 'Votre propriété est maintenant en ligne sur Izzico. Des résidents de qualité peuvent maintenant voir et s\'informer sur ta résidence.',
          en: 'Your property is now live on Izzico. Quality tenants can now view and inquire about your listing.',
          nl: 'Je eigendom is nu live op Izzico. Kwaliteitshuurders kunnen nu je advertentie bekijken en erover informeren.',
          de: 'Ihre Immobilie ist jetzt auf Izzico live. Qualitätsmieter können jetzt Ihre Anzeige ansehen und anfragen.',
        },
        trackViewsLabel: {
          fr: 'Suivre les vues',
          en: 'Track Views',
          nl: 'Weergaven volgen',
          de: 'Aufrufe verfolgen',
        },
        trackViewsDesc: {
          fr: 'Tableau de bord bientôt disponible',
          en: 'Dashboard coming soon',
          nl: 'Dashboard komt eraan',
          de: 'Dashboard kommt bald',
        },
        addPhotosLabel: {
          fr: 'Ajouter des photos',
          en: 'Add Photos',
          nl: 'Foto\'s toevoegen',
          de: 'Fotos hinzufügen',
        },
        addPhotosDesc: {
          fr: 'Fonctionnalité bientôt disponible',
          en: 'Feature coming soon',
          nl: 'Functie komt eraan',
          de: 'Funktion kommt bald',
        },
        addAnotherProperty: {
          fr: 'Ajouter une autre propriété',
          en: 'Add Another Property',
          nl: 'Nog een eigendom toevoegen',
          de: 'Weitere Immobilie hinzufügen',
        },
        backToHome: {
          fr: 'Retour à l\'accueil',
          en: 'Back to Home',
          nl: 'Terug naar home',
          de: 'Zurück zur Startseite',
        },
        proTipsTitle: {
          fr: 'Conseils pro',
          en: 'Pro Tips',
          nl: 'Pro Tips',
          de: 'Profi-Tipps',
        },
        proTip1: {
          fr: '• Ajoutez des photos pour obtenir 5 fois plus de demandes',
          en: '• Add photos to get 5x more inquiries',
          nl: '• Voeg foto\'s toe om 5x meer vragen te krijgen',
          de: '• Fügen Sie Fotos hinzu, um 5x mehr Anfragen zu erhalten',
        },
        proTip2: {
          fr: '• Répondez rapidement pour augmenter le taux de réservation',
          en: '• Respond quickly to increase booking rate',
          nl: '• Reageer snel om boekingspercentage te verhogen',
          de: '• Reagieren Sie schnell, um die Buchungsrate zu erhöhen',
        },
        proTip3: {
          fr: '• Mettez à jour la disponibilité pour rester visible',
          en: '• Update availability to stay visible',
          nl: '• Update beschikbaarheid om zichtbaar te blijven',
          de: '• Aktualisieren Sie die Verfügbarkeit, um sichtbar zu bleiben',
        },
        needHelp: {
          fr: 'Besoin d\'aide pour gérer ta résidence ?',
          en: 'Need help managing your listing?',
          nl: 'Hulp nodig bij het beheren van je advertentie?',
          de: 'Brauchen Sie Hilfe bei der Verwaltung Ihrer Anzeige?',
        },
        contactSupport: {
          fr: 'Contacter le support',
          en: 'Contact Support',
          nl: 'Contact opnemen met support',
          de: 'Support kontaktieren',
        },
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
        fr: 'Veuillez entrer ton numéro de téléphone',
        en: 'Please enter your phone number',
        nl: 'Voer alstublieft je telefoonnummer in',
        de: 'Bitte geben Sie Ihre Telefonnummer ein',
      },
      selectProfileType: {
        fr: 'Veuillez sélectionner pour qui tu cherches',
        en: 'Please select who you are searching for',
        nl: 'Selecteer alstublieft voor wie je zoekt',
        de: 'Bitte wählen Sie aus, für wen Sie suchen',
      },
    },

    // Profile Type Page
    profileType: {
      title: {
        fr: 'Pour qui cherches-tu ?',
        en: 'Who are you searching for?',
        nl: 'Voor wie zoek je?',
        de: 'Für wen suchen Sie?',
      },
      subtitle: {
        fr: 'Cela nous aide à personnaliser ton expérience de recherche',
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
        fr: 'Je cherche un espace de co-living pour moi-même',
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
        fr: 'Tu peux créer plusieurs profils - un pour toi et des profils séparés pour chaque personne que tu aides',
        en: "You can create multiple profiles - one for yourself and separate ones for each person you're helping",
        nl: 'Je kunt meerdere profielen aanmaken - één voor jezelf en aparte profielen voor elke persoon die je helpt',
        de: 'Sie können mehrere Profile erstellen - eines für sich selbst und separate für jede Person, der Sie helfen',
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
        fr: 'Votre routine nous aide à trouver des résidents compatibles.',
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

    // Home Lifestyle Page
    homeLifestyle: {
      title: {
        fr: 'Style de vie à la maison',
        en: 'Home Lifestyle',
        nl: 'Thuislevensstijl',
        de: 'Zuhause Lebensstil',
      },
      subtitle: {
        fr: 'Tes habitudes font d\'une maison ton chez-toi.',
        en: 'Your habits make a home feel like yours.',
        nl: 'Je gewoonten maken van een huis jouw thuis.',
        de: 'Ihre Gewohnheiten machen ein Haus zu Ihrem Zuhause.',
      },
      cleanliness: {
        fr: 'Préférence de propreté',
        en: 'Cleanliness preference',
        nl: 'Schoonheidsvoorkeur',
        de: 'Sauberkeitspräferenz',
      },
      relaxed: {
        fr: 'Décontracté',
        en: 'Relaxed',
        nl: 'Ontspannen',
        de: 'Entspannt',
      },
      spotless: {
        fr: 'Impeccable',
        en: 'Spotless',
        nl: 'Vlekkeloos',
        de: 'Makellos',
      },
      guestFrequency: {
        fr: 'Fréquence des invités',
        en: 'Guest frequency',
        nl: 'Gastenfrequentie',
        de: 'Gästehäufigkeit',
      },
      never: {
        fr: 'Jamais',
        en: 'Never',
        nl: 'Nooit',
        de: 'Nie',
      },
      sometimes: {
        fr: 'Parfois',
        en: 'Sometimes',
        nl: 'Soms',
        de: 'Manchmal',
      },
      often: {
        fr: 'Souvent',
        en: 'Often',
        nl: 'Vaak',
        de: 'Oft',
      },
      musicHabits: {
        fr: 'Habitudes musicales',
        en: 'Music habits',
        nl: 'Muziekgewoonten',
        de: 'Musikgewohnheiten',
      },
      quietEnvironment: {
        fr: 'Environnement calme',
        en: 'Quiet environment',
        nl: 'Rustige omgeving',
        de: 'Ruhige Umgebung',
      },
      lowVolume: {
        fr: 'Volume faible',
        en: 'Low volume',
        nl: 'Laag volume',
        de: 'Leise Lautstärke',
      },
      moderateVolume: {
        fr: 'Volume modéré',
        en: 'Moderate volume',
        nl: 'Gemiddeld volume',
        de: 'Mittlere Lautstärke',
      },
      loudSometimes: {
        fr: 'Fort parfois',
        en: 'Loud sometimes',
        nl: 'Soms hard',
        de: 'Manchmal laut',
      },
      iHavePets: {
        fr: 'J\'ai des animaux',
        en: 'I have pets',
        nl: 'Ik heb huisdieren',
        de: 'Ich habe Haustiere',
      },
      petTypePlaceholder: {
        fr: 'ex : chat, chien, hamster',
        en: 'e.g., cats, dog, hamster',
        nl: 'bijv. katten, hond, hamster',
        de: 'z.B. Katzen, Hund, Hamster',
      },
      cookingFrequency: {
        fr: 'Fréquence de cuisine',
        en: 'Cooking frequency',
        nl: 'Kookfrequentie',
        de: 'Kochhäufigkeit',
      },
      neverRarely: {
        fr: 'Jamais / Rarement',
        en: 'Never / Rarely',
        nl: 'Nooit / Zelden',
        de: 'Nie / Selten',
      },
      fewTimesAWeek: {
        fr: 'Quelques fois par semaine',
        en: 'Few times a week',
        nl: 'Een paar keer per week',
        de: 'Ein paar Mal pro Woche',
      },
    },

    // Social Vibe Page
    socialVibe: {
      title: {
        fr: 'Ambiance sociale',
        en: 'Social Vibe',
        nl: 'Sociale sfeer',
        de: 'Soziale Atmosphäre',
      },
      subtitle: {
        fr: 'Comment te connectes-tu avec les autres ?',
        en: 'How do you connect with others?',
        nl: 'Hoe maak je contact met anderen?',
        de: 'Wie verbinden Sie sich mit anderen?',
      },
      socialEnergy: {
        fr: 'Énergie sociale',
        en: 'Social energy',
        nl: 'Sociale energie',
        de: 'Soziale Energie',
      },
      socialEnergyHelp: {
        fr: 'Dans quelle mesure aimes-tu les interactions sociales ?',
        en: 'How much do you enjoy social interactions?',
        nl: 'Hoeveel geniet je van sociale interacties?',
        de: 'Wie sehr genießen Sie soziale Interaktionen?',
      },
      introvert: {
        fr: 'Introverti',
        en: 'Introvert',
        nl: 'Introvert',
        de: 'Introvertiert',
      },
      moderate: {
        fr: 'Modéré',
        en: 'Moderate',
        nl: 'Gemiddeld',
        de: 'Moderat',
      },
      extrovert: {
        fr: 'Extraverti',
        en: 'Extrovert',
        nl: 'Extravert',
        de: 'Extrovertiert',
      },
      opennessToSharing: {
        fr: 'Ouverture au partage',
        en: 'Openness to sharing',
        nl: 'Openheid voor delen',
        de: 'Offenheit zum Teilen',
      },
      opennessHelp: {
        fr: 'Aimes-tu partager des repas, des histoires et des expériences ?',
        en: 'Do you like sharing meals, stories, and experiences?',
        nl: 'Deel je graag maaltijden, verhalen en ervaringen?',
        de: 'Teilen Sie gerne Mahlzeiten, Geschichten und Erfahrungen?',
      },
      private: {
        fr: 'Privé',
        en: 'Private',
        nl: 'Privé',
        de: 'Privat',
      },
      veryOpen: {
        fr: 'Très ouvert',
        en: 'Very open',
        nl: 'Zeer open',
        de: 'Sehr offen',
      },
      communicationStyle: {
        fr: 'Style de communication',
        en: 'Communication style',
        nl: 'Communicatiestijl',
        de: 'Kommunikationsstil',
      },
      directStraightforward: {
        fr: 'Direct et franc',
        en: 'Direct & straightforward',
        nl: 'Direct & duidelijk',
        de: 'Direkt & geradlinig',
      },
      diplomaticTactful: {
        fr: 'Diplomatique et tactile',
        en: 'Diplomatic & tactful',
        nl: 'Diplomatiek & tactvol',
        de: 'Diplomatisch & taktvoll',
      },
      casualFriendly: {
        fr: 'Décontracté et amical',
        en: 'Casual & friendly',
        nl: 'Casual & vriendelijk',
        de: 'Lässig & freundlich',
      },
      formalProfessional: {
        fr: 'Formel et professionnel',
        en: 'Formal & professional',
        nl: 'Formeel & professioneel',
        de: 'Formell & professionell',
      },
      culturalOpenness: {
        fr: 'Ouverture culturelle',
        en: 'Cultural openness',
        nl: 'Culturele openheid',
        de: 'Kulturelle Offenheit',
      },
      culturalOpennessHelp: {
        fr: 'Es-tu à l\'aise avec différentes cultures et origines ?',
        en: 'How comfortable are you with different cultures and backgrounds?',
        nl: 'Hoe comfortabel voel je je bij verschillende culturen en achtergronden?',
        de: 'Wie wohl fühlen Sie sich mit verschiedenen Kulturen und Hintergründen?',
      },
      preferSimilar: {
        fr: 'Préfère similaire',
        en: 'Prefer similar',
        nl: 'Voorkeur voor vergelijkbaar',
        de: 'Ähnliches bevorzugen',
      },
      loveDiversity: {
        fr: 'Aime la diversité',
        en: 'Love diversity',
        nl: 'Hou van diversiteit',
        de: 'Liebe Vielfalt',
      },
    },

    // Ideal Co-living Page
    idealColiving: {
      title: {
        fr: 'Co-living idéal',
        en: 'Ideal Coliving',
        nl: 'Ideale coliving',
        de: 'Ideales Coliving',
      },
      subtitle: {
        fr: 'Décrivez votre atmosphère de vie idéale.',
        en: 'Describe your ideal living atmosphere.',
        nl: 'Beschrijf je ideale woonomgeving.',
        de: 'Beschreiben Sie Ihre ideale Wohnatmosphäre.',
      },
      preferredColivingSize: {
        fr: 'Taille de co-living préférée',
        en: 'Preferred coliving size',
        nl: 'Gewenste coliving grootte',
        de: 'Bevorzugte Coliving-Größe',
      },
      twoPeople: {
        fr: '2-3 personnes',
        en: '2-3 people',
        nl: '2-3 personen',
        de: '2-3 Personen',
      },
      fourPeople: {
        fr: '4-6 personnes',
        en: '4-6 people',
        nl: '4-6 personen',
        de: '4-6 Personen',
      },
      sevenPeople: {
        fr: '7-10 personnes',
        en: '7-10 people',
        nl: '7-10 personen',
        de: '7-10 Personen',
      },
      tenPlusPeople: {
        fr: '10+ personnes',
        en: '10+ people',
        nl: '10+ personen',
        de: '10+ Personen',
      },
      intimateQuiet: {
        fr: 'Intime et calme',
        en: 'Intimate and quiet',
        nl: 'Intiem en rustig',
        de: 'Intim und ruhig',
      },
      perfectBalance: {
        fr: 'Équilibre parfait',
        en: 'Perfect balance',
        nl: 'Perfecte balans',
        de: 'Perfekte Balance',
      },
      vibrantCommunity: {
        fr: 'Communauté vibrante',
        en: 'Vibrant community',
        nl: 'Levendige gemeenschap',
        de: 'Lebendige Gemeinschaft',
      },
      largeCommunity: {
        fr: 'Grande communauté',
        en: 'Large community',
        nl: 'Grote gemeenschap',
        de: 'Große Gemeinschaft',
      },
      genderMixPreference: {
        fr: 'Préférence de mixité',
        en: 'Gender mix preference',
        nl: 'Gendervoorkeur',
        de: 'Geschlechtermischung',
      },
      maleOnly: {
        fr: 'Hommes uniquement',
        en: 'Male only',
        nl: 'Alleen mannen',
        de: 'Nur Männer',
      },
      femaleOnly: {
        fr: 'Femmes uniquement',
        en: 'Female only',
        nl: 'Alleen vrouwen',
        de: 'Nur Frauen',
      },
      mixed: {
        fr: 'Mixte',
        en: 'Mixed',
        nl: 'Gemengd',
        de: 'Gemischt',
      },
      noPreference: {
        fr: 'Pas de préférence',
        en: 'No preference',
        nl: 'Geen voorkeur',
        de: 'Keine Präferenz',
      },
      roommateAgeRange: {
        fr: 'Tranche d\'âge des résidents',
        en: 'Roommate age range',
        nl: 'Leeftijdsbereik huisgenoten',
        de: 'Altersbereich Mitbewohner',
      },
      minAge: {
        fr: 'Âge minimum',
        en: 'Min age',
        nl: 'Min leeftijd',
        de: 'Mindestalter',
      },
      maxAge: {
        fr: 'Âge maximum',
        en: 'Max age',
        nl: 'Max leeftijd',
        de: 'Höchstalter',
      },
      lookingForRoommates: {
        fr: 'Recherche de résidents âgés de',
        en: 'Looking for roommates aged',
        nl: 'Op zoek naar huisgenoten van',
        de: 'Suche Mitbewohner im Alter von',
      },
      sharedSpaceImportance: {
        fr: 'Importance des espaces partagés',
        en: 'Shared space importance',
        nl: 'Belang van gedeelde ruimte',
        de: 'Wichtigkeit gemeinsamer Räume',
      },
      needPrivacy: {
        fr: 'Besoin d\'intimité',
        en: 'Need privacy',
        nl: 'Behoefte aan privacy',
        de: 'Brauche Privatsphäre',
      },
      loveCommunal: {
        fr: 'Aime le communautaire',
        en: 'Love communal',
        nl: 'Hou van gemeenschappelijk',
        de: 'Liebe Gemeinschaft',
      },
      sharedSpaceHelp: {
        fr: 'À quel point les espaces de vie partagés sont-ils importants pour toi ?',
        en: 'How important are shared living spaces to you?',
        nl: 'Hoe belangrijk zijn gedeelde woonruimtes voor jou?',
        de: 'Wie wichtig sind Ihnen gemeinsame Wohnräume?',
      },
    },

    // Preferences Page
    preferences: {
      title: {
        fr: 'Préférences avancées',
        en: 'Advanced Preferences',
        nl: 'Geavanceerde voorkeuren',
        de: 'Erweiterte Einstellungen',
      },
      subtitle: {
        fr: 'Ajustez tes préférences à tout moment.',
        en: 'Adjust your preferences anytime.',
        nl: 'Pas je voorkeuren op elk moment aan.',
        de: 'Passen Sie Ihre Präferenzen jederzeit an.',
      },
      monthlyBudget: {
        fr: 'Budget mensuel',
        en: 'Monthly budget',
        nl: 'Maandelijks budget',
        de: 'Monatliches Budget',
      },
      minimum: {
        fr: 'Minimum',
        en: 'Minimum',
        nl: 'Minimum',
        de: 'Minimum',
      },
      maximum: {
        fr: 'Maximum',
        en: 'Maximum',
        nl: 'Maximum',
        de: 'Maximum',
      },
      budgetRange: {
        fr: 'Fourchette budgétaire : €{min} - €{max}/mois',
        en: 'Budget range: €{min} - €{max}/month',
        nl: 'Budgetbereik: €{min} - €{max}/maand',
        de: 'Budgetbereich: €{min} - €{max}/Monat',
      },
      preferredDistrict: {
        fr: 'Quartier préféré',
        en: 'Preferred district',
        nl: 'Gewenste wijk',
        de: 'Bevorzugter Bezirk',
      },
      districtPlaceholder: {
        fr: 'ex : Centre-ville, Kreuzberg, Le Marais',
        en: 'e.g., City Center, Kreuzberg, Le Marais',
        nl: 'bijv. Stadscentrum, Kreuzberg, Le Marais',
        de: 'z.B. Stadtzentrum, Kreuzberg, Le Marais',
      },
      districtHelp: {
        fr: 'Entrez votre quartier préféré ou laissez vide pour toutes les zones',
        en: 'Enter your preferred neighborhood or leave blank for all areas',
        nl: 'Voer je gewenste buurt in of laat leeg voor alle gebieden',
        de: 'Geben Sie Ihr bevorzugtes Viertel ein oder lassen Sie es leer für alle Bereiche',
      },
      tolerancePreferences: {
        fr: 'Préférences de tolérance',
        en: 'Tolerance preferences',
        nl: 'Tolerantievoorkeuren',
        de: 'Toleranzpräferenzen',
      },
      openToLivingWithPets: {
        fr: 'Ouvert à vivre avec des animaux',
        en: 'Open to living with pets',
        nl: 'Open om met huisdieren te leven',
        de: 'Offen für das Leben mit Haustieren',
      },
      acceptSmokersInHouse: {
        fr: 'Accepte les fumeurs dans la maison',
        en: 'Accept smokers in the house',
        nl: 'Accepteer rokers in huis',
        de: 'Akzeptiere Raucher im Haus',
      },
      continueToPrivacy: {
        fr: 'Continuer vers la confidentialité',
        en: 'Continue to Privacy',
        nl: 'Doorgaan naar privacy',
        de: 'Weiter zu Datenschutz',
      },
    },

    // Privacy Page
    privacy: {
      title: {
        fr: 'Confidentialité et confirmation',
        en: 'Privacy & Confirmation',
        nl: 'Privacy & bevestiging',
        de: 'Datenschutz & Bestätigung',
      },
      subtitle: {
        fr: 'Nous prenons votre confidentialité au sérieux.',
        en: 'We take your privacy seriously.',
        nl: 'We nemen je privacy serieus.',
        de: 'Wir nehmen Ihre Privatsphäre ernst.',
      },
      acceptTermsRequired: {
        fr: 'J\'accepte les conditions générales',
        en: 'I accept the Terms & Conditions',
        nl: 'Ik accepteer de algemene voorwaarden',
        de: 'Ich akzeptiere die Allgemeinen Geschäftsbedingungen',
      },
      reviewTerms: {
        fr: 'Consulte nos',
        en: 'Review our',
        nl: 'Bekijk onze',
        de: 'Überprüfen Sie unsere',
      },
      termsOfService: {
        fr: 'conditions d\'utilisation',
        en: 'terms of service',
        nl: 'gebruiksvoorwaarden',
        de: 'Nutzungsbedingungen',
      },
      readPrivacyRequired: {
        fr: 'J\'ai lu la politique de confidentialité',
        en: 'I have read the Privacy Policy',
        nl: 'Ik heb het privacybeleid gelezen',
        de: 'Ich habe die Datenschutzerklärung gelesen',
      },
      learnProtection: {
        fr: 'Découvrez comment nous protégeons vos',
        en: 'Learn how we protect your',
        nl: 'Leer hoe we je',
        de: 'Erfahren Sie, wie wir Ihre',
      },
      personalData: {
        fr: 'données personnelles',
        en: 'personal data',
        nl: 'persoonlijke gegevens',
        de: 'persönlichen Daten',
      },
      personalDataProtect: {
        fr: 'protégeons',
        en: 'protect',
        nl: 'beschermen',
        de: 'schützen',
      },
      consentDataRequired: {
        fr: 'Je consens au traitement des données',
        en: 'I consent to data processing',
        nl: 'Ik stem in met gegevensverwerking',
        de: 'Ich stimme der Datenverarbeitung zu',
      },
      consentDataHelp: {
        fr: 'Requis pour créer ton profil et trouver des Living Matchs. Tes données seront traitées de manière sécurisée conformément au RGPD.',
        en: 'Required to create your profile and find matches. Your data will be processed securely according to GDPR.',
        nl: 'Vereist om je profiel aan te maken en matches te vinden. Je gegevens worden veilig verwerkt volgens de AVG.',
        de: 'Erforderlich, um Ihr Profil zu erstellen und Matches zu finden. Ihre Daten werden sicher gemäß DSGVO verarbeitet.',
      },
      agreeMatchingOptional: {
        fr: 'J\'accepte le matching algorithmique',
        en: 'I agree to algorithmic matching',
        nl: 'Ik ga akkoord met algoritmische matching',
        de: 'Ich stimme dem algorithmischen Matching zu',
      },
      agreeMatchingHelp: {
        fr: 'Notre algorithme intelligent suggérera les meilleurs Living Matchs de résidents basés sur la compatibilité. Fortement recommandé !',
        en: 'Our smart algorithm will suggest the best roommate matches based on compatibility. Highly recommended!',
        nl: 'Ons slimme algoritme zal de beste huisgenootmatches voorstellen op basis van compatibiliteit. Sterk aanbevolen!',
        de: 'Unser intelligenter Algorithmus schlägt die besten Mitbewohner-Matches basierend auf Kompatibilität vor. Sehr empfohlen!',
      },
      privacyMatters: {
        fr: 'Votre confidentialité compte :',
        en: 'Your privacy matters:',
        nl: 'Je privacy is belangrijk:',
        de: 'Ihre Privatsphäre zählt:',
      },
      privacyNotice: {
        fr: 'Nous ne partageons jamais tes informations personnelles avec des tiers sans consentement. Tu peux demander la suppression des données à tout moment.',
        en: 'We never share your personal information with third parties without consent. You can request data deletion at any time.',
        nl: 'We delen je persoonlijke informatie nooit met derden zonder toestemming. Je kunt op elk moment verwijdering van gegevens aanvragen.',
        de: 'Wir teilen Ihre persönlichen Informationen niemals ohne Zustimmung mit Dritten. Sie können jederzeit die Löschung Ihrer Daten beantragen.',
      },
      continueToPreferences: {
        fr: 'Continuer vers les préférences',
        en: 'Continue to Preferences',
        nl: 'Doorgaan naar voorkeuren',
        de: 'Weiter zu Einstellungen',
      },
    },

    // Verification Page
    verification: {
      title: {
        fr: 'Vérification du profil',
        en: 'Profile Verification',
        nl: 'Profielverificatie',
        de: 'Profilverifizierung',
      },
      subtitle: {
        fr: 'Les profils vérifiés sont prioritaires dans les Living Matchs.',
        en: 'Verified profiles are prioritized in matches.',
        nl: 'Geverifieerde profielen krijgen prioriteit in matches.',
        de: 'Verifizierte Profile werden bei Matches priorisiert.',
      },
      identityVerification: {
        fr: 'Vérification d\'identité (KYC)',
        en: 'Identity verification (KYC)',
        nl: 'Identiteitsverificatie (KYC)',
        de: 'Identitätsverifizierung (KYC)',
      },
      uploadIdHelp: {
        fr: 'Téléchargez une pièce d\'identité officielle (passeport, permis de conduire, carte nationale d\'identité)',
        en: 'Upload a government-issued ID (passport, driver\'s license, national ID)',
        nl: 'Upload een door de overheid afgegeven ID (paspoort, rijbewijs, nationale ID)',
        de: 'Laden Sie einen amtlichen Ausweis hoch (Reisepass, Führerschein, Personalausweis)',
      },
      uploadId: {
        fr: 'Télécharger la pièce d\'identité',
        en: 'Upload ID',
        nl: 'ID uploaden',
        de: 'Ausweis hochladen',
      },
      changeId: {
        fr: 'Changer la pièce d\'identité',
        en: 'Change ID',
        nl: 'ID wijzigen',
        de: 'Ausweis ändern',
      },
      emailVerification: {
        fr: 'Vérification email',
        en: 'Email verification',
        nl: 'E-mailverificatie',
        de: 'E-Mail-Verifizierung',
      },
      emailVerificationHelp: {
        fr: 'Nous enverrons un lien de vérification à ton email',
        en: 'We\'ll send a verification link to your email',
        nl: 'We sturen een verificatielink naar je e-mail',
        de: 'Wir senden Ihnen einen Verifizierungslink an Ihre E-Mail',
      },
      verifyEmail: {
        fr: 'Vérifier l\'email',
        en: 'Verify Email',
        nl: 'E-mail verifiëren',
        de: 'E-Mail verifizieren',
      },
      phoneVerification: {
        fr: 'Vérification téléphone',
        en: 'Phone verification',
        nl: 'Telefoonverificatie',
        de: 'Telefonverifizierung',
      },
      phoneVerificationHelp: {
        fr: 'Entrez ton numéro de téléphone',
        en: 'Enter your phone number',
        nl: 'Voer je telefoonnummer in',
        de: 'Geben Sie Ihre Telefonnummer ein',
      },
      sendOtp: {
        fr: 'Envoyer le code OTP',
        en: 'Send OTP',
        nl: 'OTP verzenden',
        de: 'OTP senden',
      },
      whyVerify: {
        fr: 'Pourquoi vérifier ?',
        en: 'Why verify?',
        nl: 'Waarom verifiëren?',
        de: 'Warum verifizieren?',
      },
      benefit1: {
        fr: 'Obtenez 3x plus de vues de profil',
        en: 'Get 3x more profile views',
        nl: 'Krijg 3x meer profielweergaven',
        de: 'Erhalten Sie 3x mehr Profilaufrufe',
      },
      benefit2: {
        fr: 'Créez de la confiance avec tes futurs résidents',
        en: 'Build trust with potential flatmates',
        nl: 'Bouw vertrouwen op met potentiële huisgenoten',
        de: 'Bauen Sie Vertrauen zu potenziellen Mitbewohnern auf',
      },
      benefit3: {
        fr: 'Démarque-toi avec un badge vérifié',
        en: 'Stand out with a verified badge',
        nl: 'Val op met een geverifieerd badge',
        de: 'Heben Sie sich mit einem verifizierten Badge ab',
      },
      saveProgress: {
        fr: 'Enregistrer les progrès',
        en: 'Save Progress',
        nl: 'Voortgang opslaan',
        de: 'Fortschritt speichern',
      },
      verifyLater: {
        fr: 'Je vérifierai plus tard',
        en: 'I\'ll verify later',
        nl: 'Ik verifieer later',
        de: 'Ich verifiziere später',
      },

      // Phone OTP verification
      phoneNumber: {
        fr: 'Numéro de téléphone',
        en: 'Phone number',
        nl: 'Telefoonnummer',
        de: 'Telefonnummer',
      },
      phoneNumberPlaceholder: {
        fr: '+33 6 12 34 56 78',
        en: '+33 6 12 34 56 78',
        nl: '+31 6 12 34 56 78',
        de: '+49 170 12 34 56 78',
      },
      sendCode: {
        fr: 'Envoyer le code',
        en: 'Send code',
        nl: 'Code verzenden',
        de: 'Code senden',
      },
      sendingCode: {
        fr: 'Envoi du code en cours...',
        en: 'Sending code...',
        nl: 'Code verzenden...',
        de: 'Code wird gesendet...',
      },
      codeSent: {
        fr: 'Code envoyé!',
        en: 'Code sent!',
        nl: 'Code verzonden!',
        de: 'Code gesendet!',
      },
      codeSentTo: {
        fr: 'Code envoyé au',
        en: 'Code sent to',
        nl: 'Code verzonden naar',
        de: 'Code gesendet an',
      },
      enterOtp: {
        fr: 'Entrez le code à 6 chiffres',
        en: 'Enter the 6-digit code',
        nl: 'Voer de 6-cijferige code in',
        de: 'Geben Sie den 6-stelligen Code ein',
      },
      verifyingCode: {
        fr: 'Vérification en cours...',
        en: 'Verifying...',
        nl: 'Verifiëren...',
        de: 'Verifizieren...',
      },
      phoneVerified: {
        fr: 'Téléphone vérifié!',
        en: 'Phone verified!',
        nl: 'Telefoon geverifieerd!',
        de: 'Telefon verifiziert!',
      },
      phoneVerifiedSuccess: {
        fr: 'Votre numéro de téléphone a été vérifié avec succès.',
        en: 'Your phone number has been verified successfully.',
        nl: 'Je telefoonnummer is succesvol geverifieerd.',
        de: 'Ihre Telefonnummer wurde erfolgreich verifiziert.',
      },
      changeNumber: {
        fr: 'Changer de numéro',
        en: 'Change number',
        nl: 'Nummer wijzigen',
        de: 'Nummer ändern',
      },
      resendCode: {
        fr: 'Renvoyer le code',
        en: 'Resend code',
        nl: 'Code opnieuw verzenden',
        de: 'Code erneut senden',
      },
      resendIn: {
        fr: 'Renvoyer dans',
        en: 'Resend in',
        nl: 'Opnieuw verzenden in',
        de: 'Erneut senden in',
      },
      invalidCode: {
        fr: 'Code incorrect. Vérifie et réessayer.',
        en: 'Invalid code. Please check and try again.',
        nl: 'Ongeldige code. Controleer en probeer opnieuw.',
        de: 'Ungültiger Code. Bitte überprüfen und erneut versuchen.',
      },
      expiredCode: {
        fr: 'Le code a expiré. Veuillez demander un nouveau code.',
        en: 'The code has expired. Please request a new code.',
        nl: 'De code is verlopen. Vraag een nieuwe code aan.',
        de: 'Der Code ist abgelaufen. Bitte fordern Sie einen neuen Code an.',
      },
      tooManyAttempts: {
        fr: 'Trop de tentatives. Veuillez réessayer dans quelques minutes.',
        en: 'Too many attempts. Please try again in a few minutes.',
        nl: 'Te veel pogingen. Probeer het over een paar minuten opnieuw.',
        de: 'Zu viele Versuche. Bitte versuchen Sie es in einigen Minuten erneut.',
      },
      smsWillBeSent: {
        fr: 'Un code de vérification sera envoyé par SMS à ce numéro.',
        en: 'A verification code will be sent via SMS to this number.',
        nl: 'Er wordt een verificatiecode per SMS naar dit nummer verzonden.',
        de: 'Ein Verifizierungscode wird per SMS an diese Nummer gesendet.',
      },

      // ITSME verification
      itsmeTitle: {
        fr: 'Vérification d\'identité ITSME',
        en: 'ITSME Identity Verification',
        nl: 'ITSME Identiteitsverificatie',
        de: 'ITSME Identitätsverifizierung',
      },
      itsmeSubtitle: {
        fr: 'Vérifiez votre identité avec l\'app ITSME',
        en: 'Verify your identity with the ITSME app',
        nl: 'Verifieer je identiteit met de ITSME app',
        de: 'Verifizieren Sie Ihre Identität mit der ITSME App',
      },
      itsmeDescription: {
        fr: 'ITSME est l\'identité numérique belge officielle.',
        en: 'ITSME is the official Belgian digital identity.',
        nl: 'ITSME is de officiële Belgische digitale identiteit.',
        de: 'ITSME ist die offizielle belgische digitale Identität.',
      },
      itsmeFastSecure: {
        fr: 'La vérification est rapide, sécurisée et gratuite.',
        en: 'Verification is fast, secure and free.',
        nl: 'Verificatie is snel, veilig en gratis.',
        de: 'Die Verifizierung ist schnell, sicher und kostenlos.',
      },
      itsmeSecure: {
        fr: 'Sécurisé',
        en: 'Secure',
        nl: 'Veilig',
        de: 'Sicher',
      },
      itsmeBadge: {
        fr: 'Badge vérifié',
        en: 'Verified badge',
        nl: 'Geverifieerd badge',
        de: 'Verifiziertes Badge',
      },
      itsmeTrust: {
        fr: 'Confiance',
        en: 'Trust',
        nl: 'Vertrouwen',
        de: 'Vertrauen',
      },
      itsmeWhatData: {
        fr: 'Quelles données sont vérifiées ?',
        en: 'What data is verified?',
        nl: 'Welke gegevens worden geverifieerd?',
        de: 'Welche Daten werden verifiziert?',
      },
      itsmeVerifies: {
        fr: 'ITSME vérifie :',
        en: 'ITSME verifies:',
        nl: 'ITSME verifieert:',
        de: 'ITSME verifiziert:',
      },
      itsmeData1: {
        fr: 'Votre nom et prénom officiels',
        en: 'Your official name',
        nl: 'Je officiële naam',
        de: 'Ihren offiziellen Namen',
      },
      itsmeData2: {
        fr: 'Votre date de naissance',
        en: 'Your date of birth',
        nl: 'Je geboortedatum',
        de: 'Ihr Geburtsdatum',
      },
      itsmeData3: {
        fr: 'Votre nationalité',
        en: 'Your nationality',
        nl: 'Je nationaliteit',
        de: 'Ihre Nationalität',
      },
      itsmeData4: {
        fr: 'Votre numéro de registre national (hashé, jamais stocké en clair)',
        en: 'Your national register number (hashed, never stored in plain text)',
        nl: 'Je rijksregisternummer (gehasht, nooit in platte tekst opgeslagen)',
        de: 'Ihre Personalausweisnummer (gehasht, nie im Klartext gespeichert)',
      },
      verifyWithItsme: {
        fr: 'Vérifier avec ITSME',
        en: 'Verify with ITSME',
        nl: 'Verifiëren met ITSME',
        de: 'Mit ITSME verifizieren',
      },
      redirectingToItsme: {
        fr: 'Redirection vers ITSME...',
        en: 'Redirecting to ITSME...',
        nl: 'Doorverwijzen naar ITSME...',
        de: 'Weiterleitung zu ITSME...',
      },
      itsmeRedirectNote: {
        fr: 'Tu seras redirigé vers l\'application ITSME pour confirmer votre identité.',
        en: 'You will be redirected to the ITSME app to confirm your identity.',
        nl: 'Je wordt doorverwezen naar de ITSME app om je identiteit te bevestigen.',
        de: 'Sie werden zur ITSME App weitergeleitet, um Ihre Identität zu bestätigen.',
      },
      downloadItsme: {
        fr: 'Télécharger l\'app ITSME',
        en: 'Download the ITSME app',
        nl: 'Download de ITSME app',
        de: 'ITSME App herunterladen',
      },
      itsmeVerified: {
        fr: 'Identité vérifiée!',
        en: 'Identity verified!',
        nl: 'Identiteit geverifieerd!',
        de: 'Identität verifiziert!',
      },
      itsmeVerifiedSuccess: {
        fr: 'Votre identité a été vérifiée avec succès via ITSME.',
        en: 'Your identity has been verified successfully via ITSME.',
        nl: 'Je identiteit is succesvol geverifieerd via ITSME.',
        de: 'Ihre Identität wurde erfolgreich über ITSME verifiziert.',
      },
      identityVerified: {
        fr: 'Identité vérifiée',
        en: 'Identity verified',
        nl: 'Identiteit geverifieerd',
        de: 'Identität verifiziert',
      },
      verifiedViaItsme: {
        fr: 'Vérifié via ITSME',
        en: 'Verified via ITSME',
        nl: 'Geverifieerd via ITSME',
        de: 'Verifiziert über ITSME',
      },
      verifiedOn: {
        fr: 'Vérifié le',
        en: 'Verified on',
        nl: 'Geverifieerd op',
        de: 'Verifiziert am',
      },

      // ITSME error messages
      itsmeAccessDenied: {
        fr: 'Tu as annulé la vérification ITSME.',
        en: 'You cancelled the ITSME verification.',
        nl: 'Je hebt de ITSME verificatie geannuleerd.',
        de: 'Sie haben die ITSME-Verifizierung abgebrochen.',
      },
      itsmeNotConfigured: {
        fr: 'La vérification ITSME n\'est pas configurée.',
        en: 'ITSME verification is not configured.',
        nl: 'ITSME verificatie is niet geconfigureerd.',
        de: 'ITSME-Verifizierung ist nicht konfiguriert.',
      },
      itsmeStateMismatch: {
        fr: 'Erreur de sécurité. Veuillez réessayer.',
        en: 'Security error. Please try again.',
        nl: 'Beveiligingsfout. Probeer het opnieuw.',
        de: 'Sicherheitsfehler. Bitte versuchen Sie es erneut.',
      },
      itsmeSessionExpired: {
        fr: 'Session expirée. Veuillez réessayer.',
        en: 'Session expired. Please try again.',
        nl: 'Sessie verlopen. Probeer het opnieuw.',
        de: 'Sitzung abgelaufen. Bitte versuchen Sie es erneut.',
      },
      itsmeVerificationFailed: {
        fr: 'La vérification a échoué. Veuillez réessayer.',
        en: 'Verification failed. Please try again.',
        nl: 'Verificatie mislukt. Probeer het opnieuw.',
        de: 'Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.',
      },

      // Trust level labels
      trustLevel: {
        fr: 'Niveau de confiance',
        en: 'Trust level',
        nl: 'Vertrouwensniveau',
        de: 'Vertrauensstufe',
      },
      levelStarter: {
        fr: 'Débutant',
        en: 'Starter',
        nl: 'Starter',
        de: 'Starter',
      },
      levelBasic: {
        fr: 'Basique',
        en: 'Basic',
        nl: 'Basis',
        de: 'Basis',
      },
      levelVerified: {
        fr: 'Vérifié',
        en: 'Verified',
        nl: 'Geverifieerd',
        de: 'Verifiziert',
      },
      levelItsme: {
        fr: 'ITSME',
        en: 'ITSME',
        nl: 'ITSME',
        de: 'ITSME',
      },
      levelPremium: {
        fr: 'Premium',
        en: 'Premium',
        nl: 'Premium',
        de: 'Premium',
      },
      verificationsCompleted: {
        fr: 'vérifications complétées',
        en: 'verifications completed',
        nl: 'verificaties voltooid',
        de: 'Verifizierungen abgeschlossen',
      },

      // Why verify benefits
      whyVerifyBenefit1: {
        fr: 'Profil de confiance pour les propriétaires et résidents',
        en: 'Trusted profile for owners and flatmates',
        nl: 'Vertrouwd profiel voor eigenaren en huisgenoten',
        de: 'Vertrauenswürdiges Profil für Eigentümer und Mitbewohner',
      },
      whyVerifyBenefit2: {
        fr: 'Badge "Vérifié" visible sur ton profil',
        en: '"Verified" badge visible on your profile',
        nl: '"Geverifieerd" badge zichtbaar op je profiel',
        de: '"Verifiziert"-Badge auf Ihrem Profil sichtbar',
      },
      whyVerifyBenefit3: {
        fr: 'Priorité dans les résultats de recherche',
        en: 'Priority in search results',
        nl: 'Prioriteit in zoekresultaten',
        de: 'Priorität in Suchergebnissen',
      },
      whyVerifyBenefit4: {
        fr: 'Accès à plus de fonctionnalités premium',
        en: 'Access to more premium features',
        nl: 'Toegang tot meer premium functies',
        de: 'Zugang zu mehr Premium-Funktionen',
      },
    },

    // Review Page
    review: {
      title: {
        fr: 'Vérifiez ton profil',
        en: 'Review Your Profile',
        nl: 'Controleer je profiel',
        de: 'Überprüfen Sie Ihr Profil',
      },
      subtitle: {
        fr: 'Assure-toi que tout est correct',
        en: 'Make sure everything looks good',
        nl: 'Zorg dat alles er goed uitziet',
        de: 'Stellen Sie sicher, dass alles gut aussieht',
      },
      basicInfoSection: {
        fr: 'Informations de base',
        en: 'Basic Info',
        nl: 'Basisinformatie',
        de: 'Grundinformationen',
      },
      dailyHabitsSection: {
        fr: 'Habitudes quotidiennes',
        en: 'Daily Habits',
        nl: 'Dagelijkse gewoonten',
        de: 'Tägliche Gewohnheiten',
      },
      idealColivingSection: {
        fr: 'Co-living idéal',
        en: 'Ideal Coliving',
        nl: 'Ideale coliving',
        de: 'Ideales Coliving',
      },
      preferencesSection: {
        fr: 'Préférences',
        en: 'Preferences',
        nl: 'Voorkeuren',
        de: 'Einstellungen',
      },
      verificationSection: {
        fr: 'Vérification',
        en: 'Verification',
        nl: 'Verificatie',
        de: 'Verifizierung',
      },
      firstNameLabel: {
        fr: 'Prénom :',
        en: 'First Name:',
        nl: 'Voornaam:',
        de: 'Vorname:',
      },
      lastNameLabel: {
        fr: 'Nom :',
        en: 'Last Name:',
        nl: 'Achternaam:',
        de: 'Nachname:',
      },
      dateOfBirthLabel: {
        fr: 'Date de naissance :',
        en: 'Date of Birth:',
        nl: 'Geboortedatum:',
        de: 'Geburtsdatum:',
      },
      nationalityLabel: {
        fr: 'Nationalité :',
        en: 'Nationality:',
        nl: 'Nationaliteit:',
        de: 'Nationalität:',
      },
      languagesLabel: {
        fr: 'Langues :',
        en: 'Languages:',
        nl: 'Talen:',
        de: 'Sprachen:',
      },
      wakeUpLabel: {
        fr: 'Réveil :',
        en: 'Wake-up:',
        nl: 'Opstaan:',
        de: 'Aufwachen:',
      },
      sleepLabel: {
        fr: 'Coucher :',
        en: 'Sleep:',
        nl: 'Slapen:',
        de: 'Schlafen:',
      },
      smokerLabel: {
        fr: 'Fumeur :',
        en: 'Smoker:',
        nl: 'Roker:',
        de: 'Raucher:',
      },
      yes: {
        fr: 'Oui',
        en: 'Yes',
        nl: 'Ja',
        de: 'Ja',
      },
      no: {
        fr: 'Non',
        en: 'No',
        nl: 'Nee',
        de: 'Nein',
      },
      colivingSizeLabel: {
        fr: 'Taille de co-living :',
        en: 'Coliving Size:',
        nl: 'Coliving grootte:',
        de: 'Coliving-Größe:',
      },
      genderMixLabel: {
        fr: 'Mixité :',
        en: 'Gender Mix:',
        nl: 'Gendermix:',
        de: 'Geschlechtermischung:',
      },
      ageRangeLabel: {
        fr: 'Tranche d\'âge :',
        en: 'Age Range:',
        nl: 'Leeftijdsbereik:',
        de: 'Altersbereich:',
      },
      sharedSpaceLabel: {
        fr: 'Espaces partagés :',
        en: 'Shared Space:',
        nl: 'Gedeelde ruimte:',
        de: 'Gemeinsame Räume:',
      },
      budgetLabel: {
        fr: 'Budget :',
        en: 'Budget:',
        nl: 'Budget:',
        de: 'Budget:',
      },
      districtLabel: {
        fr: 'Quartier :',
        en: 'District:',
        nl: 'Wijk:',
        de: 'Bezirk:',
      },
      any: {
        fr: 'N\'importe lequel',
        en: 'Any',
        nl: 'Willekeurig',
        de: 'Beliebig',
      },
      phoneLabel: {
        fr: 'Téléphone :',
        en: 'Phone:',
        nl: 'Telefoon:',
        de: 'Telefon:',
      },
      idDocumentLabel: {
        fr: 'Pièce d\'identité :',
        en: 'ID Document:',
        nl: 'ID-document:',
        de: 'Ausweisdokument:',
      },
      uploaded: {
        fr: 'Téléchargé',
        en: '✓ Uploaded',
        nl: '✓ Geüpload',
        de: '✓ Hochgeladen',
      },
      submitting: {
        fr: 'Envoi en cours...',
        en: 'Submitting...',
        nl: 'Verzenden...',
        de: 'Wird gesendet...',
      },
      submitMyProfile: {
        fr: 'Soumettre mon profil',
        en: 'Submit My Profile',
        nl: 'Mijn profiel indienen',
        de: 'Mein Profil einreichen',
      },
    },

    // Searcher Index Page
    searcherIndex: {
      title: {
        fr: 'Onboarding Chercheur',
        en: 'Searcher Onboarding',
        nl: 'Zoeker onboarding',
        de: 'Suchender Onboarding',
      },
      description: {
        fr: 'Suivez les étapes pour définir tes préférences.',
        en: 'Follow the steps to set your preferences.',
        nl: 'Volg de stappen om je voorkeuren in te stellen.',
        de: 'Folgen Sie den Schritten, um Ihre Präferenzen festzulegen.',
      },
      start: {
        fr: 'Commencer',
        en: 'Start',
        nl: 'Start',
        de: 'Starten',
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
        fr: 'Ton profil a été enregistré avec succès',
        en: 'Your profile has been saved successfully',
        nl: 'Je profiel is succesvol opgeslagen',
        de: 'Ihr Profil wurde erfolgreich gespeichert',
      },
      findMatches: {
        fr: 'Nous utiliserons tes réponses pour trouver des Living Matchs compatibles',
        en: "We'll use your answers to find compatible matches",
        nl: 'We gebruiken je antwoorden om compatibele matches te vinden',
        de: 'Wir verwenden Ihre Antworten, um kompatible Matches zu finden',
      },
      updateAnytime: {
        fr: 'Tu peux mettre à jour tes préférences à tout moment',
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
        fr: 'Améliorer ton profil',
        en: 'Enhance Your Profile',
        nl: 'Verbeter je profiel',
        de: 'Profil verbessern',
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
        fr: 'Reprendre ton profil ?',
        en: 'Resume your profile?',
        nl: 'Je profiel hervatten?',
        de: 'Ihr Profil fortsetzen?',
      },
      subtitle: {
        fr: 'Tu as commencé à créer ton profil. Veux-tu continuer là où tu t\'es arrêté ?',
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

    // Completion Page
    completion: {
      congratulations: {
        fr: 'Félicitations',
        en: 'Congratulations',
        nl: 'Gefeliciteerd',
        de: 'Glückwunsch',
      },
      subtitle: {
        fr: 'Ton profil de base est complet. Que veux-tu faire maintenant ?',
        en: 'Your basic profile is complete. What would you like to do now?',
        nl: 'Je basisprofiel is compleet. Wat wil je nu doen?',
        de: 'Dein Basisprofil ist vollständig. Was möchtest du jetzt tun?',
      },
      goHomeTitle: {
        fr: 'Aller à l\'Accueil',
        en: 'Go to Home',
        nl: 'Ga naar Home',
        de: 'Zur Startseite',
      },
      goHomeDescriptionSearcher: {
        fr: 'Commencer à explorer les propriétés et les résidents',
        en: 'Start exploring properties and roommates',
        nl: 'Begin met het verkennen van woningen en huisgenoten',
        de: 'Beginne mit der Erkundung von Immobilien und Mitbewohnern',
      },
      goHomeDescriptionOwner: {
        fr: 'Commencer à explorer tes propriétés et candidats',
        en: 'Start exploring your properties and applicants',
        nl: 'Begin met het verkennen van je eigendommen en kandidaten',
        de: 'Beginne mit der Erkundung deiner Immobilien und Bewerber',
      },
      goHomeDescriptionResident: {
        fr: 'Commencer à explorer ta communauté',
        en: 'Start exploring your community',
        nl: 'Begin met het verkennen van je gemeenschap',
        de: 'Beginne mit der Erkundung deiner Gemeinschaft',
      },
      enhanceProfileTitle: {
        fr: 'Enrichir Mon Profil',
        en: 'Enhance My Profile',
        nl: 'Mijn Profiel Verbeteren',
        de: 'Mein Profil Verbessern',
      },
      enhanceProfileDescription: {
        fr: 'Ajouter plus d\'informations pour améliorer ton matching et ta visibilité',
        en: 'Add more information to improve your matching and visibility',
        nl: 'Voeg meer informatie toe om je matching en zichtbaarheid te verbeteren',
        de: 'Füge mehr Informationen hinzu, um dein Matching und deine Sichtbarkeit zu verbessern',
      },
      continueButton: {
        fr: 'Continuer',
        en: 'Continue',
        nl: 'Doorgaan',
        de: 'Weiter',
      },
      enhanceNowButton: {
        fr: 'Enrichir maintenant',
        en: 'Enhance now',
        nl: 'Nu verbeteren',
        de: 'Jetzt verbessern',
      },
      tipTitle: {
        fr: 'Conseil',
        en: 'Tip',
        nl: 'Tip',
        de: 'Tipp',
      },
      tipMessage: {
        fr: 'Tu peux toujours enrichir ton profil plus tard depuis ton dashboard.',
        en: 'You can always enhance your profile later from your dashboard.',
        nl: 'Je kunt je profiel altijd later verbeteren vanaf je dashboard.',
        de: 'Du kannst dein Profil jederzeit später über dein Dashboard verbessern.',
      },
    },
  },

  // ============================================================================
  // AUTHENTICATION PAGES
  // ============================================================================
  auth: {
    // Login Page
    login: {
      title: {
        fr: 'Bienvenue',
        en: 'Welcome Back',
        nl: 'Welkom Terug',
        de: 'Willkommen zurück',
      },
      subtitle: {
        fr: 'Connecte-toi à ton compte Izzico',
        en: 'Sign in to your Izzico account',
        nl: 'Log in op je Izzico-account',
        de: 'Melden Sie sich bei Ihrem Izzico-Konto an',
      },
      email: {
        fr: 'Adresse e-mail',
        en: 'Email Address',
        nl: 'E-mailadres',
        de: 'E-Mail-Adresse',
      },
      emailPlaceholder: {
        fr: 'votre@email.com',
        en: 'your@email.com',
        nl: 'jouw@email.com',
        de: 'ihre@email.com',
      },
      password: {
        fr: 'Mot de passe',
        en: 'Password',
        nl: 'Wachtwoord',
        de: 'Passwort',
      },
      passwordPlaceholder: {
        fr: 'Entrez ton mot de passe',
        en: 'Enter your password',
        nl: 'Voer je wachtwoord in',
        de: 'Geben Sie Ihr Passwort ein',
      },
      remember: {
        fr: 'Se souvenir de moi',
        en: 'Remember me',
        nl: 'Onthoud mij',
        de: 'Angemeldet bleiben',
      },
      forgotPassword: {
        fr: 'Mot de passe oublié ?',
        en: 'Forgot password?',
        nl: 'Wachtwoord vergeten?',
        de: 'Passwort vergessen?',
      },
      loginButton: {
        fr: 'Se connecter',
        en: 'Sign In',
        nl: 'Inloggen',
        de: 'Anmelden',
      },
      signingIn: {
        fr: 'Connexion...',
        en: 'Signing in...',
        nl: 'Inloggen...',
        de: 'Anmelden...',
      },
      googleButton: {
        fr: 'Continuer avec Google',
        en: 'Continue with Google',
        nl: 'Doorgaan met Google',
        de: 'Mit Google fortfahren',
      },
      signingInGoogle: {
        fr: 'Connexion avec Google...',
        en: 'Signing in with Google...',
        nl: 'Inloggen met Google...',
        de: 'Anmelden mit Google...',
      },
      divider: {
        fr: 'Ou continuer avec email',
        en: 'Or continue with email',
        nl: 'Of ga verder met e-mail',
        de: 'Oder mit E-Mail fortfahren',
      },
      noAccount: {
        fr: 'Tu n\'as pas de compte ?',
        en: 'Don\'t have an account?',
        nl: 'Heb je geen account?',
        de: 'Haben Sie kein Konto?',
      },
      signupLink: {
        fr: 'Créer un compte',
        en: 'Create one',
        nl: 'Maak er een',
        de: 'Konto erstellen',
      },
      backToHome: {
        fr: 'Retour à l\'accueil',
        en: 'Back to Home',
        nl: 'Terug naar Home',
        de: 'Zurück zur Startseite',
      },
      errors: {
        invalidEmail: {
          fr: 'Veuillez entrer une adresse e-mail valide',
          en: 'Please enter a valid email address',
          nl: 'Voer een geldig e-mailadres in',
          de: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
        },
        invalidCredentials: {
          fr: 'E-mail ou mot de passe incorrect',
          en: 'Invalid email or password',
          nl: 'Ongeldig e-mailadres of wachtwoord',
          de: 'Ungültige E-Mail oder Passwort',
        },
        emailNotConfirmed: {
          fr: 'Vérifie ton e-mail avant de te connecter',
          en: 'Please verify your email before logging in',
          nl: 'Verifieer je e-mail voordat je inlogt',
          de: 'Bitte verifizieren Sie Ihre E-Mail, bevor Sie sich anmelden',
        },
        checkInbox: {
          fr: 'Vérifiez votre boîte de réception pour le lien de vérification',
          en: 'Check your inbox for the verification link',
          nl: 'Controleer je inbox voor de verificatielink',
          de: 'Überprüfen Sie Ihren Posteingang auf den Verifizierungslink',
        },
        googleFailed: {
          fr: 'Échec de la connexion avec Google',
          en: 'Failed to sign in with Google',
          nl: 'Inloggen met Google mislukt',
          de: 'Anmeldung mit Google fehlgeschlagen',
        },
        enterPassword: {
          fr: 'Veuillez entrer ton mot de passe',
          en: 'Please enter your password',
          nl: 'Voer je wachtwoord in',
          de: 'Bitte geben Sie Ihr Passwort ein',
        },
      },
      success: {
        welcomeBack: {
          fr: 'Bienvenue !',
          en: 'Welcome back!',
          nl: 'Welkom terug!',
          de: 'Willkommen zurück!',
        },
      },
    },

    // Signup Page
    signup: {
      title: {
        fr: 'Rejoignez Izzico',
        en: 'Join Izzico',
        nl: 'Word lid van Izzico',
        de: 'Tritt Izzico bei',
      },
      subtitle: {
        fr: 'Commencez votre aventure co-living aujourd\'hui',
        en: 'Start your coliving journey today',
        nl: 'Begin vandaag je coliving reis',
        de: 'Beginnen Sie heute Ihre Coliving-Reise',
      },
      fullName: {
        fr: 'Nom complet',
        en: 'Full Name',
        nl: 'Volledige naam',
        de: 'Vollständiger Name',
      },
      fullNamePlaceholder: {
        fr: 'Jean Dupont',
        en: 'John Doe',
        nl: 'Jan Janssen',
        de: 'Max Mustermann',
      },
      email: {
        fr: 'Adresse e-mail',
        en: 'Email Address',
        nl: 'E-mailadres',
        de: 'E-Mail-Adresse',
      },
      emailPlaceholder: {
        fr: 'vous@example.com',
        en: 'you@example.com',
        nl: 'jij@voorbeeld.com',
        de: 'sie@beispiel.com',
      },
      password: {
        fr: 'Mot de passe',
        en: 'Password',
        nl: 'Wachtwoord',
        de: 'Passwort',
      },
      passwordPlaceholder: {
        fr: '••••••••',
        en: '••••••••',
        nl: '••••••••',
        de: '••••••••',
      },
      confirmPassword: {
        fr: 'Confirmer le mot de passe',
        en: 'Confirm Password',
        nl: 'Bevestig wachtwoord',
        de: 'Passwort bestätigen',
      },
      confirmPasswordPlaceholder: {
        fr: 'Confirmez ton mot de passe',
        en: 'Confirm your password',
        nl: 'Bevestig je wachtwoord',
        de: 'Bestätigen Sie Ihr Passwort',
      },
      userTypeLabel: {
        fr: 'Je veux :',
        en: 'I want to:',
        nl: 'Ik wil:',
        de: 'Ich möchte:',
      },
      searcher: {
        fr: 'Trouver un logement',
        en: 'Find a place',
        nl: 'Vind een plek',
        de: 'Finde einen Ort',
      },
      searcherLabel: {
        fr: 'Chercheur',
        en: 'Searcher',
        nl: 'Zoeker',
        de: 'Suchender',
      },
      owner: {
        fr: 'Lister une résidence',
        en: 'List property',
        nl: 'Lijst eigendom',
        de: 'Immobilie listen',
      },
      ownerLabel: {
        fr: 'Propriétaire',
        en: 'Owner',
        nl: 'Eigenaar',
        de: 'Eigentümer',
      },
      resident: {
        fr: 'Rejoindre une communauté',
        en: 'Join community',
        nl: 'Word lid van gemeenschap',
        de: 'Gemeinschaft beitreten',
      },
      residentLabel: {
        fr: 'Résident',
        en: 'Resident',
        nl: 'Bewoner',
        de: 'Bewohner',
      },
      googleButton: {
        fr: 'Continuer avec Google',
        en: 'Continue with Google',
        nl: 'Doorgaan met Google',
        de: 'Mit Google fortfahren',
      },
      divider: {
        fr: 'Ou inscris-toi avec email',
        en: 'Or sign up with email',
        nl: 'Of meld je aan met e-mail',
        de: 'Oder mit E-Mail registrieren',
      },
      passwordStrength: {
        fr: 'Force du mot de passe :',
        en: 'Password strength:',
        nl: 'Wachtwoordsterkte:',
        de: 'Passwortstärke:',
      },
      weak: {
        fr: 'Faible',
        en: 'Weak',
        nl: 'Zwak',
        de: 'Schwach',
      },
      medium: {
        fr: 'Moyen',
        en: 'Medium',
        nl: 'Gemiddeld',
        de: 'Mittel',
      },
      strong: {
        fr: 'Fort',
        en: 'Strong',
        nl: 'Sterk',
        de: 'Stark',
      },
      requirements: {
        length: {
          fr: 'Au moins 8 caractères',
          en: 'At least 8 characters',
          nl: 'Minstens 8 tekens',
          de: 'Mindestens 8 Zeichen',
        },
        uppercase: {
          fr: 'Une majuscule',
          en: 'One uppercase letter',
          nl: 'Een hoofdletter',
          de: 'Ein Großbuchstabe',
        },
        lowercase: {
          fr: 'Une minuscule',
          en: 'One lowercase letter',
          nl: 'Een kleine letter',
          de: 'Ein Kleinbuchstabe',
        },
        number: {
          fr: 'Un chiffre',
          en: 'One number',
          nl: 'Een cijfer',
          de: 'Eine Zahl',
        },
      },
      passwordsMatch: {
        fr: 'Les mots de passe correspondent',
        en: 'Passwords match',
        nl: 'Wachtwoorden komen overeen',
        de: 'Passwörter stimmen überein',
      },
      passwordsDontMatch: {
        fr: 'Les mots de passe ne correspondent pas',
        en: 'Passwords do not match',
        nl: 'Wachtwoorden komen niet overeen',
        de: 'Passwörter stimmen nicht überein',
      },
      termsAgree: {
        fr: 'J\'accepte les',
        en: 'I agree to Izzico\'s',
        nl: 'Ik ga akkoord met',
        de: 'Ich stimme zu',
      },
      termsLink: {
        fr: 'Conditions d\'utilisation',
        en: 'Terms of Service',
        nl: 'Servicevoorwaarden',
        de: 'Nutzungsbedingungen',
      },
      and: {
        fr: 'et',
        en: 'and',
        nl: 'en',
        de: 'und',
      },
      privacyLink: {
        fr: 'Politique de confidentialité',
        en: 'Privacy Policy',
        nl: 'Privacybeleid',
        de: 'Datenschutzrichtlinie',
      },
      agreeToTerms: {
        fr: 'J\'accepte les',
        en: 'I agree to the',
        nl: 'Ik ga akkoord met de',
        de: 'Ich stimme den',
      },
      signupButton: {
        fr: 'Créer un compte',
        en: 'Create Account',
        nl: 'Account aanmaken',
        de: 'Konto erstellen',
      },
      creatingAccount: {
        fr: 'Création du compte...',
        en: 'Creating account...',
        nl: 'Account aanmaken...',
        de: 'Konto erstellen...',
      },
      haveAccount: {
        fr: 'Tu as déjà un compte ?',
        en: 'Already have an account?',
        nl: 'Heb je al een account?',
        de: 'Haben Sie bereits ein Konto?',
      },
      hasAccount: {
        fr: 'Tu as déjà un compte ?',
        en: 'Already have an account?',
        nl: 'Heb je al een account?',
        de: 'Haben Sie bereits ein Konto?',
      },
      loginLink: {
        fr: 'Se connecter',
        en: 'Log in',
        nl: 'Inloggen',
        de: 'Anmelden',
      },
      backToHome: {
        fr: 'Retour à l\'accueil',
        en: 'Back to home',
        nl: 'Terug naar home',
        de: 'Zurück zur Startseite',
      },
      errors: {
        enterName: {
          fr: 'Veuillez entrer votre nom complet',
          en: 'Please enter your full name',
          nl: 'Voer je volledige naam in',
          de: 'Bitte geben Sie Ihren vollständigen Namen ein',
        },
        invalidEmail: {
          fr: 'Veuillez entrer une adresse e-mail valide',
          en: 'Please enter a valid email address',
          nl: 'Voer een geldig e-mailadres in',
          de: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
        },
        passwordLength: {
          fr: 'Le mot de passe doit contenir au moins 8 caractères',
          en: 'Password must be at least 8 characters',
          nl: 'Wachtwoord moet minimaal 8 tekens bevatten',
          de: 'Passwort muss mindestens 8 Zeichen lang sein',
        },
        passwordsDontMatch: {
          fr: 'Les mots de passe ne correspondent pas',
          en: 'Passwords do not match',
          nl: 'Wachtwoorden komen niet overeen',
          de: 'Passwörter stimmen nicht überein',
        },
        agreeToTerms: {
          fr: 'Veuillez accepter les Conditions d\'utilisation et la Politique de confidentialité',
          en: 'Please agree to the Terms of Service and Privacy Policy',
          nl: 'Ga akkoord met de Servicevoorwaarden en het Privacybeleid',
          de: 'Bitte stimmen Sie den Nutzungsbedingungen und der Datenschutzrichtlinie zu',
        },
        emailAlreadyRegistered: {
          fr: 'Cet e-mail est déjà enregistré',
          en: 'This email is already registered',
          nl: 'Dit e-mailadres is al geregistreerd',
          de: 'Diese E-Mail ist bereits registriert',
        },
        emailExists: {
          fr: 'Cet e-mail est déjà utilisé. Essayez de te connecter.',
          en: 'This email is already in use. Try logging in.',
          nl: 'Dit e-mailadres is al in gebruik. Probeer in te loggen.',
          de: 'Diese E-Mail wird bereits verwendet. Versuchen Sie sich anzumelden.',
        },
        tryLogin: {
          fr: 'Essaie de te connecter à la place',
          en: 'Please try logging in instead',
          nl: 'Probeer in plaats daarvan in te loggen',
          de: 'Bitte versuchen Sie stattdessen sich anzumelden',
        },
        goToLogin: {
          fr: 'Aller à la connexion',
          en: 'Go to Login',
          nl: 'Ga naar inloggen',
          de: 'Zur Anmeldung gehen',
        },
      },
      success: {
        accountCreated: {
          fr: 'Compte créé avec succès !',
          en: 'Account created successfully!',
          nl: 'Account succesvol aangemaakt!',
          de: 'Konto erfolgreich erstellt!',
        },
        checkEmail: {
          fr: 'Vérifie ton e-mail pour valider ton compte',
          en: 'Please check your email to verify your account',
          nl: 'Controleer je e-mail om je account te verifiëren',
          de: 'Bitte überprüfen Sie Ihre E-Mail, um Ihr Konto zu verifizieren',
        },
      },
      // Google signup
      signingUpGoogle: {
        fr: 'Inscription avec Google...',
        en: 'Signing up with Google...',
        nl: 'Aanmelden met Google...',
        de: 'Anmeldung mit Google...',
      },
      signUpWithGoogle: {
        fr: 'S\'inscrire avec Google',
        en: 'Sign up with Google',
        nl: 'Aanmelden met Google',
        de: 'Mit Google registrieren',
      },
      // Referral code
      referral: {
        haveCode: {
          fr: 'J\'ai un code parrainage',
          en: 'I have a referral code',
          nl: 'Ik heb een verwijzingscode',
          de: 'Ich habe einen Empfehlungscode',
        },
        codeLabel: {
          fr: 'Code de parrainage (optionnel)',
          en: 'Referral code (optional)',
          nl: 'Verwijzingscode (optioneel)',
          de: 'Empfehlungscode (optional)',
        },
        invitedBy: {
          fr: 'Invité par {name} - 1 mois offert !',
          en: 'Invited by {name} - 1 free month!',
          nl: 'Uitgenodigd door {name} - 1 gratis maand!',
          de: 'Eingeladen von {name} - 1 Monat gratis!',
        },
        referredBy: {
          fr: 'Parrainé par {name} ! Tu recevras 1 mois gratuit après avoir complété ton profil.',
          en: 'Referred by {name}! You\'ll receive 1 free month after completing your profile.',
          nl: 'Verwezen door {name}! Je ontvangt 1 gratis maand na het voltooien van je profiel.',
          de: 'Empfohlen von {name}! Sie erhalten 1 Gratismonat nach Abschluss Ihres Profils.',
        },
        successMessage: {
          fr: 'Parrainé par {name} ! Tu recevras 1 mois gratuit après avoir complété ton profil.',
          en: 'Referred by {name}! You\'ll receive 1 free month after completing your profile.',
          nl: 'Verwezen door {name}! Je ontvangt 1 gratis maand na het voltooien van je profiel.',
          de: 'Empfohlen von {name}! Sie erhalten 1 Gratismonat nach Abschluss Ihres Profils.',
        },
        invalidCode: {
          fr: 'Code invalide ou expiré',
          en: 'Invalid or expired code',
          nl: 'Ongeldige of verlopen code',
          de: 'Ungültiger oder abgelaufener Code',
        },
      },
    },

    // Forgot Password Page
    forgotPassword: {
      title: {
        fr: 'Mot de passe oublié ?',
        en: 'Forgot Password?',
        nl: 'Wachtwoord vergeten?',
        de: 'Passwort vergessen?',
      },
      subtitle: {
        fr: 'Pas de souci ! Entrez ton e-mail et nous t\'enverrons les instructions',
        en: 'No worries! Enter your email and we\'ll send you reset instructions',
        nl: 'Geen zorgen! Voer je e-mail in en we sturen je reset-instructies',
        de: 'Keine Sorge! Geben Sie Ihre E-Mail ein und wir senden Ihnen Anweisungen zum Zurücksetzen',
      },
      email: {
        fr: 'Adresse e-mail',
        en: 'Email Address',
        nl: 'E-mailadres',
        de: 'E-Mail-Adresse',
      },
      emailPlaceholder: {
        fr: 'vous@example.com',
        en: 'you@example.com',
        nl: 'jij@voorbeeld.com',
        de: 'sie@beispiel.com',
      },
      sendButton: {
        fr: 'Envoyer le lien',
        en: 'Send Reset Link',
        nl: 'Verstuur resetlink',
        de: 'Reset-Link senden',
      },
      sending: {
        fr: 'Envoi...',
        en: 'Sending...',
        nl: 'Verzenden...',
        de: 'Senden...',
      },
      backToLogin: {
        fr: 'Retour à la connexion',
        en: 'Back to login',
        nl: 'Terug naar inloggen',
        de: 'Zurück zur Anmeldung',
      },
      rememberPassword: {
        fr: 'Tu te souviens de ton mot de passe ?',
        en: 'Remember your password?',
        nl: 'Weet je je wachtwoord nog?',
        de: 'Erinnern Sie sich an Ihr Passwort?',
      },
      loginLink: {
        fr: 'Se connecter',
        en: 'Log in',
        nl: 'Inloggen',
        de: 'Anmelden',
      },
      success: {
        title: {
          fr: 'Vérifiez ton e-mail',
          en: 'Check Your Email',
          nl: 'Controleer je e-mail',
          de: 'Überprüfen Sie Ihre E-Mail',
        },
        subtitle: {
          fr: 'Nous avons envoyé les instructions de réinitialisation à',
          en: 'We\'ve sent password reset instructions to',
          nl: 'We hebben wachtwoord reset-instructies gestuurd naar',
          de: 'Wir haben Anweisungen zum Zurücksetzen des Passworts gesendet an',
        },
        nextSteps: {
          fr: 'Que faire ensuite ?',
          en: 'What\'s next?',
          nl: 'Wat is de volgende stap?',
          de: 'Was kommt als nächstes?',
        },
        step1: {
          fr: 'Vérifiez votre boîte de réception',
          en: 'Check your email inbox',
          nl: 'Controleer je e-mail inbox',
          de: 'Überprüfen Sie Ihren E-Mail-Posteingang',
        },
        step2: {
          fr: 'Cliquez sur le lien de réinitialisation',
          en: 'Click the password reset link',
          nl: 'Klik op de wachtwoord reset-link',
          de: 'Klicken Sie auf den Link zum Zurücksetzen des Passworts',
        },
        step3: {
          fr: 'Créez un nouveau mot de passe',
          en: 'Create a new password',
          nl: 'Maak een nieuw wachtwoord',
          de: 'Erstellen Sie ein neues Passwort',
        },
        noEmail: {
          fr: 'Tu n\'as pas reçu l\'e-mail ? Vérifiez votre dossier spam ou',
          en: 'Didn\'t receive the email? Check your spam folder or',
          nl: 'E-mail niet ontvangen? Controleer je spammap of',
          de: 'E-Mail nicht erhalten? Überprüfen Sie Ihren Spam-Ordner oder',
        },
        tryAgain: {
          fr: 'réessayer',
          en: 'try again',
          nl: 'probeer opnieuw',
          de: 'erneut versuchen',
        },
        backToLogin: {
          fr: 'Retour à la connexion',
          en: 'Back to Login',
          nl: 'Terug naar inloggen',
          de: 'Zurück zur Anmeldung',
        },
      },
      errors: {
        invalidEmail: {
          fr: 'Veuillez entrer une adresse e-mail valide',
          en: 'Please enter a valid email address',
          nl: 'Voer een geldig e-mailadres in',
          de: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
        },
        linkSent: {
          fr: 'Lien de réinitialisation envoyé !',
          en: 'Password reset link sent!',
          nl: 'Wachtwoord reset-link verzonden!',
          de: 'Link zum Zurücksetzen des Passworts gesendet!',
        },
        checkEmailDescription: {
          fr: 'Vérifiez ton e-mail pour plus d\'instructions',
          en: 'Check your email for further instructions',
          nl: 'Controleer je e-mail voor verdere instructies',
          de: 'Überprüfen Sie Ihre E-Mail für weitere Anweisungen',
        },
      },
    },

    // Reset Password Page
    resetPassword: {
      title: {
        fr: 'Réinitialiser le mot de passe',
        en: 'Reset Password',
        nl: 'Wachtwoord resetten',
        de: 'Passwort zurücksetzen',
      },
      subtitle: {
        fr: 'Entrez votre nouveau mot de passe ci-dessous',
        en: 'Enter your new password below',
        nl: 'Voer hieronder je nieuwe wachtwoord in',
        de: 'Geben Sie unten Ihr neues Passwort ein',
      },
      newPassword: {
        fr: 'Nouveau mot de passe',
        en: 'New Password',
        nl: 'Nieuw wachtwoord',
        de: 'Neues Passwort',
      },
      newPasswordPlaceholder: {
        fr: 'Entrez le nouveau mot de passe',
        en: 'Enter new password',
        nl: 'Voer nieuw wachtwoord in',
        de: 'Neues Passwort eingeben',
      },
      confirmPassword: {
        fr: 'Confirmer le nouveau mot de passe',
        en: 'Confirm New Password',
        nl: 'Bevestig nieuw wachtwoord',
        de: 'Neues Passwort bestätigen',
      },
      confirmPasswordPlaceholder: {
        fr: 'Confirmez le nouveau mot de passe',
        en: 'Confirm new password',
        nl: 'Bevestig nieuw wachtwoord',
        de: 'Neues Passwort bestätigen',
      },
      updateButton: {
        fr: 'Mettre à jour le mot de passe',
        en: 'Update Password',
        nl: 'Wachtwoord bijwerken',
        de: 'Passwort aktualisieren',
      },
      updating: {
        fr: 'Mise à jour du mot de passe...',
        en: 'Updating password...',
        nl: 'Wachtwoord bijwerken...',
        de: 'Passwort wird aktualisiert...',
      },
      backToLogin: {
        fr: 'Retour à la connexion',
        en: 'Back to login',
        nl: 'Terug naar inloggen',
        de: 'Zurück zur Anmeldung',
      },
      verifying: {
        fr: 'Vérification du lien de réinitialisation...',
        en: 'Verifying reset link...',
        nl: 'Resetlink verifiëren...',
        de: 'Reset-Link wird überprüft...',
      },
      loading: {
        fr: 'Chargement...',
        en: 'Loading...',
        nl: 'Laden...',
        de: 'Laden...',
      },
      passwordStrength: {
        fr: 'Force du mot de passe',
        en: 'Password strength',
        nl: 'Wachtwoordsterkte',
        de: 'Passwortstärke',
      },
      weak: {
        fr: 'Faible',
        en: 'Weak',
        nl: 'Zwak',
        de: 'Schwach',
      },
      medium: {
        fr: 'Moyen',
        en: 'Medium',
        nl: 'Gemiddeld',
        de: 'Mittel',
      },
      strong: {
        fr: 'Fort',
        en: 'Strong',
        nl: 'Sterk',
        de: 'Stark',
      },
      requirements: {
        title: {
          fr: 'Le mot de passe doit contenir :',
          en: 'Password must contain:',
          nl: 'Wachtwoord moet bevatten:',
          de: 'Passwort muss enthalten:',
        },
        minLength: {
          fr: 'Au moins 8 caractères',
          en: 'At least 8 characters',
          nl: 'Minimaal 8 tekens',
          de: 'Mindestens 8 Zeichen',
        },
        uppercase: {
          fr: 'Une lettre majuscule',
          en: 'One uppercase letter',
          nl: 'Eén hoofdletter',
          de: 'Ein Großbuchstabe',
        },
        lowercase: {
          fr: 'Une lettre minuscule',
          en: 'One lowercase letter',
          nl: 'Eén kleine letter',
          de: 'Ein Kleinbuchstabe',
        },
        number: {
          fr: 'Un chiffre',
          en: 'One number',
          nl: 'Eén cijfer',
          de: 'Eine Zahl',
        },
      },
      passwordsMatch: {
        fr: 'Les mots de passe correspondent',
        en: 'Passwords match',
        nl: 'Wachtwoorden komen overeen',
        de: 'Passwörter stimmen überein',
      },
      passwordsNoMatch: {
        fr: 'Les mots de passe ne correspondent pas',
        en: 'Passwords do not match',
        nl: 'Wachtwoorden komen niet overeen',
        de: 'Passwörter stimmen nicht überein',
      },
      invalidLink: {
        title: {
          fr: 'Lien de réinitialisation invalide',
          en: 'Invalid Reset Link',
          nl: 'Ongeldige resetlink',
          de: 'Ungültiger Reset-Link',
        },
        description: {
          fr: 'Ce lien de réinitialisation est invalide ou a expiré. Veuillez en demander un nouveau.',
          en: 'This password reset link is invalid or has expired. Please request a new one.',
          nl: 'Deze wachtwoord resetlink is ongeldig of verlopen. Vraag een nieuwe aan.',
          de: 'Dieser Link zum Zurücksetzen des Passworts ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen an.',
        },
        requestNew: {
          fr: 'Demander un nouveau lien',
          en: 'Request New Link',
          nl: 'Nieuwe link aanvragen',
          de: 'Neuen Link anfordern',
        },
      },
      success: {
        title: {
          fr: 'Mot de passe mis à jour !',
          en: 'Password Updated!',
          nl: 'Wachtwoord bijgewerkt!',
          de: 'Passwort aktualisiert!',
        },
        description: {
          fr: 'Ton mot de passe a été mis à jour avec succès. Tu peux maintenant te connecter avec ton nouveau mot de passe.',
          en: 'Your password has been successfully updated. You can now log in with your new password.',
          nl: 'Je wachtwoord is succesvol bijgewerkt. Je kunt nu inloggen met je nieuwe wachtwoord.',
          de: 'Ihr Passwort wurde erfolgreich aktualisiert. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.',
        },
        goToLogin: {
          fr: 'Aller à la connexion',
          en: 'Go to Login',
          nl: 'Naar inloggen',
          de: 'Zur Anmeldung',
        },
      },
      errors: {
        invalidOrExpired: {
          fr: 'Lien de réinitialisation invalide ou expiré',
          en: 'Invalid or expired reset link',
          nl: 'Ongeldige of verlopen resetlink',
          de: 'Ungültiger oder abgelaufener Reset-Link',
        },
        requestNew: {
          fr: 'Veuillez demander une nouvelle réinitialisation du mot de passe',
          en: 'Please request a new password reset',
          nl: 'Vraag een nieuwe wachtwoord reset aan',
          de: 'Bitte fordern Sie eine neue Passwort-Zurücksetzung an',
        },
        minLength: {
          fr: 'Le mot de passe doit contenir au moins 8 caractères',
          en: 'Password must be at least 8 characters',
          nl: 'Wachtwoord moet minimaal 8 tekens bevatten',
          de: 'Passwort muss mindestens 8 Zeichen enthalten',
        },
        meetRequirements: {
          fr: 'Veuillez respecter toutes les exigences du mot de passe',
          en: 'Please meet all password requirements',
          nl: 'Voldoe aan alle wachtwoordvereisten',
          de: 'Bitte erfüllen Sie alle Passwortanforderungen',
        },
        noMatch: {
          fr: 'Les mots de passe ne correspondent pas',
          en: 'Passwords do not match',
          nl: 'Wachtwoorden komen niet overeen',
          de: 'Passwörter stimmen nicht überein',
        },
        updateFailed: {
          fr: 'Échec de la mise à jour du mot de passe',
          en: 'Failed to update password',
          nl: 'Wachtwoord bijwerken mislukt',
          de: 'Passwort konnte nicht aktualisiert werden',
        },
        unexpected: {
          fr: 'Une erreur inattendue est survenue',
          en: 'An unexpected error occurred',
          nl: 'Er is een onverwachte fout opgetreden',
          de: 'Ein unerwarteter Fehler ist aufgetreten',
        },
      },
      toast: {
        success: {
          fr: 'Mot de passe mis à jour avec succès !',
          en: 'Password updated successfully!',
          nl: 'Wachtwoord succesvol bijgewerkt!',
          de: 'Passwort erfolgreich aktualisiert!',
        },
        successDescription: {
          fr: 'Tu peux maintenant te connecter avec ton nouveau mot de passe',
          en: 'You can now log in with your new password',
          nl: 'Je kunt nu inloggen met je nieuwe wachtwoord',
          de: 'Sie können sich jetzt mit Ihrem neuen Passwort anmelden',
        },
      },
    },

    // Complete Signup Page
    completeSignup: {
      processing: {
        fr: 'Finalisation de ton inscription...',
        en: 'Completing your signup...',
        nl: 'Je registratie voltooien...',
        de: 'Ihre Anmeldung abschließen...',
      },
      error: {
        title: {
          fr: 'Une erreur est survenue',
          en: 'Something went wrong',
          nl: 'Er is iets misgegaan',
          de: 'Etwas ist schiefgelaufen',
        },
        description: {
          fr: 'Nous n\'avons pas pu finaliser votre inscription. Veuillez réessayer.',
          en: 'We couldn\'t complete your signup. Please try again.',
          nl: 'We konden je registratie niet voltooien. Probeer opnieuw.',
          de: 'Wir konnten Ihre Anmeldung nicht abschließen. Bitte versuchen Sie es erneut.',
        },
        backButton: {
          fr: 'Retour à l\'inscription',
          en: 'Back to Signup',
          nl: 'Terug naar registratie',
          de: 'Zurück zur Anmeldung',
        },
      },
    },

    // Email Verified Page (emailVerified for backwards compatibility)
    emailVerified: {
      title: {
        fr: 'Email vérifié !',
        en: 'Email Verified!',
        nl: 'E-mail geverifieerd!',
        de: 'E-Mail verifiziert!',
      },
      description: {
        fr: 'Votre adresse e-mail a été vérifiée avec succès. Tu as maintenant accès complet à ton compte Izzico.',
        en: 'Your email address has been successfully verified. You now have full access to your Izzico account.',
        nl: 'Je e-mailadres is succesvol geverifieerd. Je hebt nu volledige toegang tot je Izzico-account.',
        de: 'Ihre E-Mail-Adresse wurde erfolgreich verifiziert. Sie haben jetzt vollen Zugriff auf Ihr Izzico-Konto.',
      },
      redirecting: {
        fr: 'Redirection dans',
        en: 'Redirecting in',
        nl: 'Doorverwijzen in',
        de: 'Weiterleitung in',
      },
      seconds: {
        fr: 'secondes',
        en: 'seconds',
        nl: 'seconden',
        de: 'Sekunden',
      },
      second: {
        fr: 'seconde',
        en: 'second',
        nl: 'seconde',
        de: 'Sekunde',
      },
      clickHere: {
        fr: 'Clique ici si tu n\'êtes pas redirigé',
        en: 'Click here if not redirected',
        nl: 'Klik hier als je niet wordt doorverwezen',
        de: 'Klicken Sie hier, wenn Sie nicht weitergeleitet werden',
      },
      loading: {
        fr: 'Chargement...',
        en: 'Loading...',
        nl: 'Laden...',
        de: 'Laden...',
      },
    },

    // Email Verified Page (verified path from file structure)
    verified: {
      title: {
        fr: 'Email vérifié !',
        en: 'Email Verified!',
        nl: 'E-mail geverifieerd!',
        de: 'E-Mail verifiziert!',
      },
      description: {
        fr: 'Votre adresse e-mail a été vérifiée avec succès. Tu as maintenant accès complet à ton compte Izzico.',
        en: 'Your email address has been successfully verified. You now have full access to your Izzico account.',
        nl: 'Je e-mailadres is succesvol geverifieerd. Je hebt nu volledige toegang tot je Izzico-account.',
        de: 'Ihre E-Mail-Adresse wurde erfolgreich verifiziert. Sie haben jetzt vollen Zugriff auf Ihr Izzico-Konto.',
      },
      redirecting: {
        fr: 'Redirection dans',
        en: 'Redirecting in',
        nl: 'Doorverwijzen in',
        de: 'Weiterleitung in',
      },
      seconds: {
        fr: 'secondes',
        en: 'seconds',
        nl: 'seconden',
        de: 'Sekunden',
      },
      second: {
        fr: 'seconde',
        en: 'second',
        nl: 'seconde',
        de: 'Sekunde',
      },
      clickHere: {
        fr: 'Clique ici si tu n\'êtes pas redirigé',
        en: 'Click here if not redirected',
        nl: 'Klik hier als je niet wordt doorverwezen',
        de: 'Klicken Sie hier, wenn Sie nicht weitergeleitet werden',
      },
    },

    // Select User Type Page
    selectUserType: {
      title: {
        fr: 'Bienvenue sur Izzico !',
        en: 'Welcome to Izzico!',
        nl: 'Welkom bij Izzico!',
        de: 'Willkommen bei Izzico!',
      },
      subtitle: {
        fr: 'Parle-nous de toi pour commencer',
        en: 'Tell us about yourself to get started',
        nl: 'Vertel ons over jezelf om te beginnen',
        de: 'Erzählen Sie uns von sich, um zu beginnen',
      },
      label: {
        fr: 'Je suis un...',
        en: 'I am a...',
        nl: 'Ik ben een...',
        de: 'Ich bin ein...',
      },
      searcher: {
        fr: 'Chercheur',
        en: 'Searcher',
        nl: 'Zoeker',
        de: 'Suchender',
      },
      searcherDescription: {
        fr: 'Je cherche un espace de co-living ou des résidents',
        en: 'Looking for a coliving space or roommates',
        nl: 'Op zoek naar een coliving ruimte of huisgenoten',
        de: 'Auf der Suche nach einem Coliving-Raum oder Mitbewohnern',
      },
      owner: {
        fr: 'Propriétaire',
        en: 'Owner',
        nl: 'Eigenaar',
        de: 'Eigentümer',
      },
      ownerDescription: {
        fr: 'J\'ai une résidence à lister ou gérer',
        en: 'I have a property to list or manage',
        nl: 'Ik heb een eigendom om te vermelden of te beheren',
        de: 'Ich habe eine Immobilie zum Auflisten oder Verwalten',
      },
      resident: {
        fr: 'Résident',
        en: 'Resident',
        nl: 'Bewoner',
        de: 'Bewohner',
      },
      residentDescription: {
        fr: 'Je vis déjà dans un espace de co-living',
        en: 'I already live in a coliving space',
        nl: 'Ik woon al in een coliving ruimte',
        de: 'Ich lebe bereits in einem Coliving-Raum',
      },
      continueButton: {
        fr: 'Continuer',
        en: 'Continue',
        nl: 'Doorgaan',
        de: 'Fortfahren',
      },
      settingUp: {
        fr: 'Configuration de ton compte...',
        en: 'Setting up your account...',
        nl: 'Je account instellen...',
        de: 'Ihr Konto wird eingerichtet...',
      },
      errors: {
        loginRequired: {
          fr: 'Connecte-toi pour continuer',
          en: 'Please log in to continue',
          nl: 'Log in om door te gaan',
          de: 'Bitte melden Sie sich an, um fortzufahren',
        },
        updateFailed: {
          fr: 'Échec de la mise à jour du type d\'utilisateur',
          en: 'Failed to update user type',
          nl: 'Gebruikerstype bijwerken mislukt',
          de: 'Benutzertyp konnte nicht aktualisiert werden',
        },
      },
      success: {
        welcomeSearcher: {
          fr: 'Bienvenue, Chercheur !',
          en: 'Welcome, Searcher!',
          nl: 'Welkom, Zoeker!',
          de: 'Willkommen, Suchender!',
        },
        welcomeOwner: {
          fr: 'Bienvenue, Propriétaire !',
          en: 'Welcome, Owner!',
          nl: 'Welkom, Eigenaar!',
          de: 'Willkommen, Eigentümer!',
        },
        welcomeResident: {
          fr: 'Bienvenue, Résident !',
          en: 'Welcome, Resident!',
          nl: 'Welkom, Bewoner!',
          de: 'Willkommen, Bewohner!',
        },
      },
    },
  },

  // ============================================================================
  // ABOUT PAGE
  // ============================================================================
  about: {
    hero: {
      title: {
        fr: 'À Propos d\'',
        en: 'About ',
        nl: 'Over ',
        de: 'Über ',
      },
      subtitle: {
        fr: 'Nous révolutionnons la recherche de co-living à Bruxelles avec une plateforme moderne, sécurisée et intelligente qui connecte les bonnes personnes au bon moment.',
        en: 'We are revolutionizing roommate search in Brussels with a modern, secure, and intelligent platform that connects the right people at the right time.',
        nl: 'Wij revolutioneren het zoeken naar huisgenoten in Brussel met een modern, veilig en intelligent platform dat de juiste mensen op het juiste moment verbindt.',
        de: 'Wir revolutionieren die Mitbewohnersuche in Brüssel mit einer modernen, sicheren und intelligenten Plattform, die die richtigen Menschen zur richtigen Zeit verbindet.',
      },
      joinFree: {
        fr: 'Rejoins-nous gratuitement',
        en: 'Join us for free',
        nl: 'Sluit je gratis aan',
        de: 'Kostenlos beitreten',
      },
      browseListings: {
        fr: 'Explorer les résidences',
        en: 'Browse listings',
        nl: 'Bekijk advertenties',
        de: 'Anzeigen durchsuchen',
      },
    },
    mission: {
      badge: {
        fr: 'Notre Mission',
        en: 'Our Mission',
        nl: 'Onze Missie',
        de: 'Unsere Mission',
      },
      title: {
        fr: 'Simplifier la vie en co-living',
        en: 'Simplifying shared living',
        nl: 'Het samenwonen vereenvoudigen',
        de: 'Gemeinsames Wohnen vereinfachen',
      },
      description1: {
        fr: 'Chercher une co-living peut être stressant, chronophage et frustrant. Nous avons créé Izzico pour transformer cette expérience en quelque chose de simple, rapide et même agréable.',
        en: 'Searching for a shared home can be stressful, time-consuming, and frustrating. We created Izzico to transform this experience into something simple, fast, and even enjoyable.',
        nl: 'Het zoeken naar een gedeelde woning kan stressvol, tijdrovend en frustrerend zijn. We hebben Izzico gemaakt om deze ervaring om te zetten in iets eenvoudigs, snels en zelfs aangenaams.',
        de: 'Die Suche nach einer WG kann stressig, zeitaufwendig und frustrierend sein. Wir haben Izzico geschaffen, um diese Erfahrung in etwas Einfaches, Schnelles und sogar Angenehmes zu verwandeln.',
      },
      description2: {
        fr: 'Notre algorithme de matching intelligent analyse tes préférences, ton style de vie et ta personnalité pour te connecter avec des résidents vraiment compatibles.',
        en: 'Our intelligent matching algorithm analyzes your preferences, lifestyle, and personality to connect you with truly compatible roommates.',
        nl: 'Ons intelligente matching-algoritme analyseert je voorkeuren, levensstijl en persoonlijkheid om je te verbinden met echt compatibele huisgenoten.',
        de: 'Unser intelligenter Matching-Algorithmus analysiert deine Präferenzen, deinen Lebensstil und deine Persönlichkeit, um dich mit wirklich kompatiblen Mitbewohnern zu verbinden.',
      },
      successTitle: {
        fr: 'Des milliers de Living Matchs réussis',
        en: 'Thousands of successful matches',
        nl: 'Duizenden succesvolle matches',
        de: 'Tausende erfolgreiche Matches',
      },
      successDescription: {
        fr: 'Chaque jour, nous aidons des personnes à trouver leur co-living idéale',
        en: 'Every day, we help people find their ideal roommate',
        nl: 'Elke dag helpen we mensen hun ideale huisgenoot te vinden',
        de: 'Jeden Tag helfen wir Menschen, ihren idealen Mitbewohner zu finden',
      },
    },
    values: {
      title: {
        fr: 'Nos Valeurs',
        en: 'Our Values',
        nl: 'Onze Waarden',
        de: 'Unsere Werte',
      },
      subtitle: {
        fr: 'Ce qui guide chacune de nos décisions',
        en: 'What guides every decision we make',
        nl: 'Wat al onze beslissingen stuurt',
        de: 'Was jede unserer Entscheidungen leitet',
      },
      security: {
        title: {
          fr: 'Sécurité & Confiance',
          en: 'Security & Trust',
          nl: 'Veiligheid & Vertrouwen',
          de: 'Sicherheit & Vertrauen',
        },
        description: {
          fr: 'Vérification d\'identité et résidences contrôlées pour une expérience sûre et fiable.',
          en: 'Identity verification and controlled residences for a safe and reliable experience.',
          nl: 'Identiteitsverificatie en gecontroleerde advertenties voor een veilige en betrouwbare ervaring.',
          de: 'Identitätsprüfung und kontrollierte Anzeigen für ein sicheres und zuverlässiges Erlebnis.',
        },
      },
      community: {
        title: {
          fr: 'Communauté',
          en: 'Community',
          nl: 'Gemeenschap',
          de: 'Gemeinschaft',
        },
        description: {
          fr: 'Créer des connexions authentiques entre résidents compatibles.',
          en: 'Creating authentic connections between compatible roommates.',
          nl: 'Het creëren van authentieke connecties tussen compatibele huisgenoten.',
          de: 'Authentische Verbindungen zwischen kompatiblen Mitbewohnern schaffen.',
        },
      },
      simplicity: {
        title: {
          fr: 'Simplicité',
          en: 'Simplicity',
          nl: 'Eenvoud',
          de: 'Einfachheit',
        },
        description: {
          fr: 'Une plateforme intuitive qui simplifie chaque étape de ta recherche.',
          en: 'An intuitive platform that simplifies every step of your search.',
          nl: 'Een intuïtief platform dat elke stap van je zoektocht vereenvoudigt.',
          de: 'Eine intuitive Plattform, die jeden Schritt deiner Suche vereinfacht.',
        },
      },
      innovation: {
        title: {
          fr: 'Innovation',
          en: 'Innovation',
          nl: 'Innovatie',
          de: 'Innovation',
        },
        description: {
          fr: 'Algorithme de matching intelligent pour trouver ton co-living idéale.',
          en: 'Intelligent matching algorithm to find your ideal roommate.',
          nl: 'Intelligent matching-algoritme om je ideale huisgenoot te vinden.',
          de: 'Intelligenter Matching-Algorithmus, um deinen idealen Mitbewohner zu finden.',
        },
      },
    },
    stats: {
      title: {
        fr: 'Izzico en Chiffres',
        en: 'Izzico in Numbers',
        nl: 'Izzico in Cijfers',
        de: 'Izzico in Zahlen',
      },
      subtitle: {
        fr: 'Notre impact sur la communauté',
        en: 'Our impact on the community',
        nl: 'Onze impact op de gemeenschap',
        de: 'Unser Einfluss auf die Gemeinschaft',
      },
      activeUsers: {
        fr: 'Utilisateurs actifs',
        en: 'Active users',
        nl: 'Actieve gebruikers',
        de: 'Aktive Nutzer',
      },
      colivingsCreated: {
        fr: 'Co-livings créées',
        en: 'Colivings created',
        nl: 'Samenwoningen gecreëerd',
        de: 'Erstellte WGs',
      },
      satisfactionRate: {
        fr: 'Taux de satisfaction',
        en: 'Satisfaction rate',
        nl: 'Tevredenheidspercentage',
        de: 'Zufriedenheitsrate',
      },
      supportAvailable: {
        fr: 'Support disponible',
        en: 'Support available',
        nl: 'Ondersteuning beschikbaar',
        de: 'Support verfügbar',
      },
    },
    team: {
      badge: {
        fr: 'Notre Équipe',
        en: 'Our Team',
        nl: 'Ons Team',
        de: 'Unser Team',
      },
      title: {
        fr: 'Rencontre l\'équipe derrière Izzico',
        en: 'Meet the team behind Izzico',
        nl: 'Ontmoet het team achter Izzico',
        de: 'Triff das Team hinter Izzico',
      },
      subtitle: {
        fr: 'Des passionnés qui travaillent chaque jour pour améliorer ton expérience',
        en: 'Passionate people working every day to improve your experience',
        nl: 'Gepassioneerde mensen die elke dag werken om je ervaring te verbeteren',
        de: 'Leidenschaftliche Menschen, die jeden Tag daran arbeiten, dein Erlebnis zu verbessern',
      },
      members: {
        marie: {
          role: {
            fr: 'CEO & Co-fondatrice',
            en: 'CEO & Co-founder',
            nl: 'CEO & Mede-oprichter',
            de: 'CEO & Mitgründerin',
          },
          bio: {
            fr: 'Passionnée par le logement partagé et l\'innovation sociale.',
            en: 'Passionate about shared housing and social innovation.',
            nl: 'Gepassioneerd door gedeelde huisvesting en sociale innovatie.',
            de: 'Leidenschaftlich für gemeinsames Wohnen und soziale Innovation.',
          },
        },
        thomas: {
          role: {
            fr: 'CTO & Co-fondateur',
            en: 'CTO & Co-founder',
            nl: 'CTO & Mede-oprichter',
            de: 'CTO & Mitgründer',
          },
          bio: {
            fr: 'Expert en IA et développement web, ancien de Facebook.',
            en: 'AI and web development expert, former Facebook engineer.',
            nl: 'AI- en webontwikkelingsexpert, voormalig Facebook-ingenieur.',
            de: 'KI- und Webentwicklungsexperte, ehemaliger Facebook-Ingenieur.',
          },
        },
        sophie: {
          role: {
            fr: 'Head of Product',
            en: 'Head of Product',
            nl: 'Head of Product',
            de: 'Head of Product',
          },
          bio: {
            fr: 'Designer UX avec 8 ans d\'expérience chez Airbnb.',
            en: 'UX Designer with 8 years of experience at Airbnb.',
            nl: 'UX Designer met 8 jaar ervaring bij Airbnb.',
            de: 'UX-Designerin mit 8 Jahren Erfahrung bei Airbnb.',
          },
        },
        lucas: {
          role: {
            fr: 'Head of Growth',
            en: 'Head of Growth',
            nl: 'Head of Growth',
            de: 'Head of Growth',
          },
          bio: {
            fr: 'Spécialiste marketing digital et growth hacking.',
            en: 'Digital marketing and growth hacking specialist.',
            nl: 'Specialist in digitale marketing en growth hacking.',
            de: 'Spezialist für digitales Marketing und Growth Hacking.',
          },
        },
      },
    },
    story: {
      title: {
        fr: 'Notre Histoire',
        en: 'Our Story',
        nl: 'Ons Verhaal',
        de: 'Unsere Geschichte',
      },
      subtitle: {
        fr: 'Comment Izzico est né',
        en: 'How Izzico was born',
        nl: 'Hoe Izzico is ontstaan',
        de: 'Wie Izzico entstand',
      },
      paragraph1: {
        fr: 'Tout a commencé en 2023 quand Marie et Thomas, deux amis de longue date, ont partagé leurs frustrations respectives concernant la recherche de co-living à Bruxelles. Entre les résidences douteuses, les incompatibilités de personnalité et les processus archaïques, ils ont réalisé qu\'il fallait une solution moderne.',
        en: 'It all started in 2023 when Marie and Thomas, long-time friends, shared their frustrations about searching for roommates in Brussels. Between dubious listings, personality incompatibilities, and archaic processes, they realized a modern solution was needed.',
        nl: 'Het begon allemaal in 2023 toen Marie en Thomas, al lang bevriend, hun frustraties deelden over het zoeken naar huisgenoten in Brussel. Tussen dubieuze advertenties, persoonlijkheidsincompatibiliteiten en archaïsche processen, realiseerden ze zich dat er een moderne oplossing nodig was.',
        de: 'Alles begann 2023, als Marie und Thomas, langjährige Freunde, ihre Frustrationen über die Mitbewohnersuche in Brüssel teilten. Zwischen dubiosen Anzeigen, Persönlichkeitsinkompatibilitäten und veralteten Prozessen erkannten sie, dass eine moderne Lösung benötigt wurde.',
      },
      paragraph2: {
        fr: 'Forts de leur expérience respective dans la tech et le design, ils ont décidé de créer la plateforme qu\'ils auraient rêvé d\'avoir : une solution qui utilise l\'intelligence artificielle pour matcher les bonnes personnes, qui vérifie les identités pour plus de sécurité, et qui rend le processus aussi simple que possible.',
        en: 'With their combined experience in tech and design, they decided to create the platform they had dreamed of: a solution that uses artificial intelligence to match the right people, verifies identities for more security, and makes the process as simple as possible.',
        nl: 'Met hun gecombineerde ervaring in tech en design, besloten ze het platform te creëren waarvan ze hadden gedroomd: een oplossing die kunstmatige intelligentie gebruikt om de juiste mensen te matchen, identiteiten verifieert voor meer veiligheid, en het proces zo eenvoudig mogelijk maakt.',
        de: 'Mit ihrer kombinierten Erfahrung in Tech und Design beschlossen sie, die Plattform zu schaffen, von der sie geträumt hatten: eine Lösung, die künstliche Intelligenz nutzt, um die richtigen Menschen zusammenzubringen, Identitäten für mehr Sicherheit überprüft und den Prozess so einfach wie möglich macht.',
      },
      paragraph3: {
        fr: 'Aujourd\'hui, Izzico aide des milliers de personnes à trouver leur co-living idéale chaque mois. Notre équipe grandit, notre technologie s\'améliore, mais notre mission reste la même : simplifier la vie en co-living pour tous.',
        en: 'Today, Izzico helps thousands of people find their ideal coliving every month. Our team grows, our technology improves, but our mission remains the same: simplifying shared living for everyone.',
        nl: 'Vandaag helpt Izzico elke maand duizenden mensen hun ideale samenwoning te vinden. Ons team groeit, onze technologie verbetert, maar onze missie blijft hetzelfde: het samenwonen voor iedereen vereenvoudigen.',
        de: 'Heute hilft Izzico jeden Monat Tausenden von Menschen, ihr ideales WG-Leben zu finden. Unser Team wächst, unsere Technologie verbessert sich, aber unsere Mission bleibt dieselbe: das gemeinsame Wohnen für alle zu vereinfachen.',
      },
    },
    cta: {
      title: {
        fr: 'Prêt à rejoindre l\'aventure?',
        en: 'Ready to join the adventure?',
        nl: 'Klaar om mee te doen aan het avontuur?',
        de: 'Bereit, dem Abenteuer beizutreten?',
      },
      subtitle: {
        fr: 'Inscris-toi gratuitement et trouve ta co-living idéale dès aujourd\'hui',
        en: 'Sign up for free and find your ideal roommate today',
        nl: 'Meld je gratis aan en vind vandaag nog je ideale huisgenoot',
        de: 'Melde dich kostenlos an und finde noch heute deinen idealen Mitbewohner',
      },
      createAccount: {
        fr: 'Créer mon compte gratuit',
        en: 'Create my free account',
        nl: 'Maak mijn gratis account aan',
        de: 'Mein kostenloses Konto erstellen',
      },
      browseListings: {
        fr: 'Explorer les résidences',
        en: 'Browse listings',
        nl: 'Bekijk advertenties',
        de: 'Anzeigen durchsuchen',
      },
    },
  },

  // ============================================================================
  // OWNERS PAGE
  // ============================================================================
  owners: {
    hero: {
      badge: {
        fr: 'Pour les Propriétaires',
        en: 'For Owners',
        nl: 'Voor Eigenaren',
        de: 'Für Eigentümer',
      },
      title: {
        fr: 'Loue plus vite, gagne plus, stresse moins',
        en: 'Rent faster, earn more, stress less',
        nl: 'Sneller verhuren, meer verdienen, minder stress',
        de: 'Schneller vermieten, mehr verdienen, weniger Stress',
      },
      subtitle: {
        fr: 'La plateforme moderne pour gérer tes co-livings. Matching intelligent, gestion simplifiée, revenus optimisés.',
        en: 'The modern platform to manage your shared housing. Smart matching, simplified management, optimized income.',
        nl: 'Het moderne platform om je gedeelde woningen te beheren. Slimme matching, vereenvoudigd beheer, geoptimaliseerde inkomsten.',
        de: 'Die moderne Plattform zur Verwaltung deiner WGs. Intelligentes Matching, vereinfachte Verwaltung, optimierte Einnahmen.',
      },
      listProperty: {
        fr: 'Lister ma résidence gratuitement',
        en: 'List my property for free',
        nl: 'Mijn woning gratis adverteren',
        de: 'Meine Immobilie kostenlos inserieren',
      },
      seeFeatures: {
        fr: 'Voir les fonctionnalités',
        en: 'See features',
        nl: 'Bekijk functies',
        de: 'Funktionen ansehen',
      },
      freeSignup: {
        fr: 'Gratuit à l\'inscription • ✓ Sans engagement • ✓ Support 24/7',
        en: '✓ Free signup • ✓ No commitment • ✓ 24/7 support',
        nl: '✓ Gratis aanmelden • ✓ Geen verplichtingen • ✓ 24/7 ondersteuning',
        de: '✓ Kostenlose Anmeldung • ✓ Keine Verpflichtung • ✓ 24/7 Support',
      },
      avgIncome: {
        fr: 'Revenu moyen mensuel par propriétaire',
        en: 'Average monthly income per owner',
        nl: 'Gemiddeld maandelijks inkomen per eigenaar',
        de: 'Durchschnittliches monatliches Einkommen pro Eigentümer',
      },
    },
    stats: {
      propertiesListed: {
        fr: 'Propriétés listées',
        en: 'Properties listed',
        nl: 'Geadverteerde woningen',
        de: 'Gelistete Immobilien',
      },
      avgOccupancy: {
        fr: 'Taux d\'occupation moyen',
        en: 'Average occupancy rate',
        nl: 'Gemiddelde bezettingsgraad',
        de: 'Durchschnittliche Auslastung',
      },
      avgRoi: {
        fr: 'ROI moyen annuel',
        en: 'Average annual ROI',
        nl: 'Gemiddeld jaarlijks ROI',
        de: 'Durchschnittlicher jährlicher ROI',
      },
      avgRentalTime: {
        fr: 'Temps de location moyen',
        en: 'Average rental time',
        nl: 'Gemiddelde verhuurtijd',
        de: 'Durchschnittliche Vermietungszeit',
      },
    },
    benefits: {
      title: {
        fr: 'Pourquoi choisir Izzico?',
        en: 'Why choose Izzico?',
        nl: 'Waarom Izzico kiezen?',
        de: 'Warum Izzico wählen?',
      },
      subtitle: {
        fr: 'Tout ce dont tu as besoin pour gérer tes co-livings comme un pro',
        en: 'Everything you need to manage your shared housing like a pro',
        nl: 'Alles wat je nodig hebt om je gedeelde woningen als een pro te beheren',
        de: 'Alles was du brauchst, um deine WGs wie ein Profi zu verwalten',
      },
      maximizeRevenue: {
        title: {
          fr: 'Maximise tes revenus',
          en: 'Maximize your income',
          nl: 'Maximaliseer je inkomsten',
          de: 'Maximiere dein Einkommen',
        },
        description: {
          fr: 'Algorithme de pricing intelligent qui optimise ton loyer selon le marché et l\'occupation.',
          en: 'Smart pricing algorithm that optimizes your rent based on market and occupancy.',
          nl: 'Slim prijsalgoritme dat je huur optimaliseert op basis van markt en bezetting.',
          de: 'Intelligenter Preisalgorithmus, der deine Miete basierend auf Markt und Auslastung optimiert.',
        },
      },
      verifiedTenants: {
        title: {
          fr: 'Résidents vérifiés',
          en: 'Verified tenants',
          nl: 'Geverifieerde huurders',
          de: 'Verifizierte Mieter',
        },
        description: {
          fr: 'Tous les profils sont vérifiés (identité, revenus, références) pour ta tranquillité d\'esprit.',
          en: 'All profiles are verified (identity, income, references) for your peace of mind.',
          nl: 'Alle profielen zijn geverifieerd (identiteit, inkomen, referenties) voor je gemoedsrust.',
          de: 'Alle Profile sind verifiziert (Identität, Einkommen, Referenzen) für deine Sicherheit.',
        },
      },
      saveTime: {
        title: {
          fr: 'Gagne du temps',
          en: 'Save time',
          nl: 'Bespaar tijd',
          de: 'Spare Zeit',
        },
        description: {
          fr: 'Automatise les visites, la sélection et la gestion administrative. Focus sur l\'essentiel.',
          en: 'Automate visits, selection, and administrative management. Focus on what matters.',
          nl: 'Automatiseer bezichtigingen, selectie en administratief beheer. Focus op wat belangrijk is.',
          de: 'Automatisiere Besichtigungen, Auswahl und Verwaltung. Konzentriere dich auf das Wesentliche.',
        },
      },
      smartMatching: {
        title: {
          fr: 'Matching intelligent',
          en: 'Smart matching',
          nl: 'Slimme matching',
          de: 'Intelligentes Matching',
        },
        description: {
          fr: 'Notre IA trouve les meilleurs candidats selon tes critères et le profil de ton co-living.',
          en: 'Our AI finds the best candidates based on your criteria and your coliving profile.',
          nl: 'Onze AI vindt de beste kandidaten op basis van je criteria en je samenwoningsprofiel.',
          de: 'Unsere KI findet die besten Kandidaten basierend auf deinen Kriterien und deinem WG-Profil.',
        },
      },
      realTimeAnalytics: {
        title: {
          fr: 'Analytics en temps réel',
          en: 'Real-time analytics',
          nl: 'Realtime analytics',
          de: 'Echtzeit-Analytics',
        },
        description: {
          fr: 'Dashboard complet avec KPIs, revenus, occupation et insights pour optimiser ta rentabilité.',
          en: 'Complete dashboard with KPIs, revenue, occupancy, and insights to optimize your profitability.',
          nl: 'Compleet dashboard met KPI\'s, inkomsten, bezetting en inzichten om je winstgevendheid te optimaliseren.',
          de: 'Komplettes Dashboard mit KPIs, Einnahmen, Auslastung und Insights zur Optimierung deiner Rentabilität.',
        },
      },
      dedicatedSupport: {
        title: {
          fr: 'Support dédié',
          en: 'Dedicated support',
          nl: 'Toegewijde ondersteuning',
          de: 'Dedizierter Support',
        },
        description: {
          fr: 'Une équipe à ton écoute 24/7 pour répondre à toutes tes questions et t\'accompagner.',
          en: 'A team available 24/7 to answer all your questions and support you.',
          nl: 'Een team 24/7 beschikbaar om al je vragen te beantwoorden en je te ondersteunen.',
          de: 'Ein Team 24/7 verfügbar, um alle deine Fragen zu beantworten und dich zu unterstützen.',
        },
      },
    },
    features: {
      title: {
        fr: 'Fonctionnalités clés',
        en: 'Key features',
        nl: 'Belangrijkste functies',
        de: 'Hauptfunktionen',
      },
      optimizedListings: {
        title: {
          fr: 'Résidences optimisées',
          en: 'Optimized listings',
          nl: 'Geoptimaliseerde advertenties',
          de: 'Optimierte Anzeigen',
        },
        description: {
          fr: 'Templates professionnels et suggestions IA pour maximiser l\'attractivité',
          en: 'Professional templates and AI suggestions to maximize attractiveness',
          nl: 'Professionele templates en AI-suggesties om de aantrekkingskracht te maximaliseren',
          de: 'Professionelle Vorlagen und KI-Vorschläge zur Maximierung der Attraktivität',
        },
      },
      simplifiedManagement: {
        title: {
          fr: 'Gestion simplifiée',
          en: 'Simplified management',
          nl: 'Vereenvoudigd beheer',
          de: 'Vereinfachte Verwaltung',
        },
        description: {
          fr: 'Dashboard centralisé pour gérer toutes tes propriétés en un coup d\'œil',
          en: 'Centralized dashboard to manage all your properties at a glance',
          nl: 'Gecentraliseerd dashboard om al je woningen in één oogopslag te beheren',
          de: 'Zentrales Dashboard zur Verwaltung aller deiner Immobilien auf einen Blick',
        },
      },
      securePayments: {
        title: {
          fr: 'Paiements sécurisés',
          en: 'Secure payments',
          nl: 'Veilige betalingen',
          de: 'Sichere Zahlungen',
        },
        description: {
          fr: 'Collecte automatique des loyers et gestion financière intégrée',
          en: 'Automatic rent collection and integrated financial management',
          nl: 'Automatische huurinning en geïntegreerd financieel beheer',
          de: 'Automatischer Mieteinzug und integriertes Finanzmanagement',
        },
      },
      roiTracking: {
        title: {
          fr: 'ROI tracking',
          en: 'ROI tracking',
          nl: 'ROI tracking',
          de: 'ROI-Tracking',
        },
        description: {
          fr: 'Suis ton retour sur investissement avec des analytics détaillés',
          en: 'Track your return on investment with detailed analytics',
          nl: 'Volg je rendement met gedetailleerde analytics',
          de: 'Verfolge deine Rendite mit detaillierten Analytics',
        },
      },
    },
    testimonials: {
      title: {
        fr: 'Ce que disent nos propriétaires',
        en: 'What our owners say',
        nl: 'Wat onze eigenaren zeggen',
        de: 'Was unsere Eigentümer sagen',
      },
      subtitle: {
        fr: 'Rejoins des centaines de propriétaires satisfaits',
        en: 'Join hundreds of satisfied owners',
        nl: 'Sluit je aan bij honderden tevreden eigenaren',
        de: 'Schließ dich hunderten zufriedener Eigentümer an',
      },
      jean: {
        role: {
          fr: 'Propriétaire de 3 co-livings',
          en: 'Owner of 3 colivings',
          nl: 'Eigenaar van 3 samenwoningen',
          de: 'Eigentümer von 3 WGs',
        },
        quote: {
          fr: 'Izzico a transformé ma façon de gérer mes résidences. Je gagne 10h par semaine et mes revenus ont augmenté de 15%!',
          en: 'Izzico has transformed the way I manage my properties. I save 10 hours per week and my income increased by 15%!',
          nl: 'Izzico heeft de manier waarop ik mijn woningen beheer veranderd. Ik bespaar 10 uur per week en mijn inkomen is met 15% gestegen!',
          de: 'Izzico hat die Art verändert, wie ich meine Immobilien verwalte. Ich spare 10 Stunden pro Woche und mein Einkommen ist um 15% gestiegen!',
        },
      },
      sophie: {
        role: {
          fr: 'Investisseuse immobilier',
          en: 'Real estate investor',
          nl: 'Vastgoedinvesteerder',
          de: 'Immobilieninvestorin',
        },
        quote: {
          fr: 'Le matching intelligent est incroyable. Fini les mauvaises surprises, tous mes résidents sont compatibles!',
          en: 'The smart matching is incredible. No more bad surprises, all my tenants are compatible!',
          nl: 'De slimme matching is ongelooflijk. Geen vervelende verrassingen meer, al mijn huurders zijn compatibel!',
          de: 'Das intelligente Matching ist unglaublich. Keine bösen Überraschungen mehr, alle meine Mieter sind kompatibel!',
        },
      },
      pierre: {
        role: {
          fr: 'Propriétaire depuis 2 ans',
          en: 'Owner for 2 years',
          nl: 'Eigenaar sinds 2 jaar',
          de: 'Eigentümer seit 2 Jahren',
        },
        quote: {
          fr: 'Interface ultra intuitive et support réactif. Je recommande à tous les propriétaires!',
          en: 'Ultra intuitive interface and responsive support. I recommend it to all owners!',
          nl: 'Ultra intuïtieve interface en responsieve ondersteuning. Ik raad het alle eigenaren aan!',
          de: 'Ultra intuitive Benutzeroberfläche und reaktionsschneller Support. Ich empfehle es allen Eigentümern!',
        },
      },
    },
    pricing: {
      title: {
        fr: 'Tarifs Transparents',
        en: 'Transparent Pricing',
        nl: 'Transparante Prijzen',
        de: 'Transparente Preise',
      },
      subtitle: {
        fr: 'Commence gratuitement, upgrade quand tu veux',
        en: 'Start for free, upgrade when you want',
        nl: 'Begin gratis, upgrade wanneer je wilt',
        de: 'Starte kostenlos, upgrade wann du willst',
      },
      free: {
        name: {
          fr: 'Gratuit',
          en: 'Free',
          nl: 'Gratis',
          de: 'Kostenlos',
        },
        features: {
          unlimitedListings: {
            fr: 'Résidences illimitées',
            en: 'Unlimited listings',
            nl: 'Onbeperkte advertenties',
            de: 'Unbegrenzte Anzeigen',
          },
          dashboardAnalytics: {
            fr: 'Dashboard analytics',
            en: 'Dashboard analytics',
            nl: 'Dashboard analytics',
            de: 'Dashboard-Analytics',
          },
          candidateMessaging: {
            fr: 'Messagerie candidats',
            en: 'Candidate messaging',
            nl: 'Berichtverkeer met kandidaten',
            de: 'Kandidaten-Nachrichten',
          },
          emailSupport: {
            fr: 'Support email',
            en: 'Email support',
            nl: 'E-mail ondersteuning',
            de: 'E-Mail-Support',
          },
        },
        cta: {
          fr: 'Commencer gratuitement',
          en: 'Start for free',
          nl: 'Gratis beginnen',
          de: 'Kostenlos starten',
        },
      },
      premium: {
        name: {
          fr: 'Premium',
          en: 'Premium',
          nl: 'Premium',
          de: 'Premium',
        },
        popular: {
          fr: 'Populaire',
          en: 'Popular',
          nl: 'Populair',
          de: 'Beliebt',
        },
        features: {
          everythingInFree: {
            fr: 'Tout dans Free',
            en: 'Everything in Free',
            nl: 'Alles in Gratis',
            de: 'Alles in Kostenlos',
          },
          priorityMatching: {
            fr: 'Matching prioritaire',
            en: 'Priority matching',
            nl: 'Prioritaire matching',
            de: 'Prioritäts-Matching',
          },
          aiPricing: {
            fr: 'Pricing intelligent IA',
            en: 'AI smart pricing',
            nl: 'AI slimme prijsstelling',
            de: 'KI-intelligente Preisgestaltung',
          },
          phoneSupport: {
            fr: 'Support téléphone prioritaire',
            en: 'Priority phone support',
            nl: 'Prioritaire telefonische ondersteuning',
            de: 'Prioritäts-Telefonsupport',
          },
          multiProperty: {
            fr: 'Gestion multi-propriétés',
            en: 'Multi-property management',
            nl: 'Multi-woning beheer',
            de: 'Multi-Immobilien-Verwaltung',
          },
          dataExport: {
            fr: 'Export des données',
            en: 'Data export',
            nl: 'Data export',
            de: 'Datenexport',
          },
        },
        cta: {
          fr: 'Essayer 14 jours gratuits',
          en: 'Try 14 days free',
          nl: 'Probeer 14 dagen gratis',
          de: '14 Tage kostenlos testen',
        },
      },
    },
    cta: {
      title: {
        fr: 'Prêt à optimiser tes revenus locatifs?',
        en: 'Ready to optimize your rental income?',
        nl: 'Klaar om je huurinkomsten te optimaliseren?',
        de: 'Bereit, deine Mieteinnahmen zu optimieren?',
      },
      subtitle: {
        fr: 'Rejoins des centaines de propriétaires qui font confiance à Izzico',
        en: 'Join hundreds of owners who trust Izzico',
        nl: 'Sluit je aan bij honderden eigenaren die Izzico vertrouwen',
        de: 'Schließ dich hunderten Eigentümern an, die Izzico vertrauen',
      },
      button: {
        fr: 'Lister ma première propriété',
        en: 'List my first property',
        nl: 'Mijn eerste woning adverteren',
        de: 'Meine erste Immobilie inserieren',
      },
      noCreditCard: {
        fr: 'Aucune carte bancaire requise • Configuration en 5 minutes',
        en: 'No credit card required • Setup in 5 minutes',
        nl: 'Geen creditcard vereist • Instellen in 5 minuten',
        de: 'Keine Kreditkarte erforderlich • Einrichtung in 5 Minuten',
      },
    },
  },

  // ============================================================================
  // CHECKOUT PAGE
  // ============================================================================
  checkout: {
    header: {
      back: {
        fr: 'Retour',
        en: 'Back',
        nl: 'Terug',
        de: 'Zurück',
      },
      securePayment: {
        fr: 'Paiement sécurisé',
        en: 'Secure payment',
        nl: 'Veilige betaling',
        de: 'Sichere Zahlung',
      },
    },
    loading: {
      preparingPayment: {
        fr: 'Préparation du paiement sécurisé...',
        en: 'Preparing secure payment...',
        nl: 'Veilige betaling voorbereiden...',
        de: 'Sichere Zahlung wird vorbereitet...',
      },
      loadingForm: {
        fr: 'Chargement du formulaire de paiement...',
        en: 'Loading payment form...',
        nl: 'Betalingsformulier laden...',
        de: 'Zahlungsformular wird geladen...',
      },
    },
    errors: {
      invalidPlan: {
        title: {
          fr: 'Plan invalide',
          en: 'Invalid plan',
          nl: 'Ongeldig plan',
          de: 'Ungültiger Plan',
        },
        description: {
          fr: 'Le plan sélectionné n\'existe pas. Veuillez choisir un plan valide.',
          en: 'The selected plan does not exist. Please choose a valid plan.',
          nl: 'Het geselecteerde plan bestaat niet. Kies een geldig plan.',
          de: 'Der ausgewählte Plan existiert nicht. Bitte wählen Sie einen gültigen Plan.',
        },
        seeAvailablePlans: {
          fr: 'Voir les plans disponibles',
          en: 'See available plans',
          nl: 'Bekijk beschikbare plannen',
          de: 'Verfügbare Pläne ansehen',
        },
      },
      generic: {
        title: {
          fr: 'Erreur',
          en: 'Error',
          nl: 'Fout',
          de: 'Fehler',
        },
        retry: {
          fr: 'Réessayer',
          en: 'Retry',
          nl: 'Opnieuw proberen',
          de: 'Erneut versuchen',
        },
        back: {
          fr: 'Retour',
          en: 'Back',
          nl: 'Terug',
          de: 'Zurück',
        },
      },
      unauthorized: {
        fr: 'Tu dois être connecté pour accéder à cette page',
        en: 'You must be logged in to access this page',
        nl: 'U moet ingelogd zijn om deze pagina te bezoeken',
        de: 'Sie müssen angemeldet sein, um auf diese Seite zugreifen zu können',
      },
      checkoutCreation: {
        fr: 'Erreur lors de la création du checkout',
        en: 'Error creating checkout',
        nl: 'Fout bij het aanmaken van de checkout',
        de: 'Fehler beim Erstellen des Checkouts',
      },
      sessionNotCreated: {
        fr: 'La session de paiement n\'a pas pu être créée. Veuillez réessayer.',
        en: 'The payment session could not be created. Please try again.',
        nl: 'De betalingssessie kon niet worden aangemaakt. Probeer het opnieuw.',
        de: 'Die Zahlungssitzung konnte nicht erstellt werden. Bitte versuchen Sie es erneut.',
      },
      unableToLoad: {
        title: {
          fr: 'Impossible de charger le formulaire',
          en: 'Unable to load form',
          nl: 'Kan formulier niet laden',
          de: 'Formular kann nicht geladen werden',
        },
      },
    },
    plans: {
      interval: {
        month: {
          fr: 'mois',
          en: 'month',
          nl: 'maand',
          de: 'Monat',
        },
        year: {
          fr: 'an',
          en: 'year',
          nl: 'jaar',
          de: 'Jahr',
        },
      },
      subscription: {
        annual: {
          fr: 'Abonnement annuel',
          en: 'Annual subscription',
          nl: 'Jaarabonnement',
          de: 'Jahresabonnement',
        },
        monthly: {
          fr: 'Abonnement mensuel',
          en: 'Monthly subscription',
          nl: 'Maandabonnement',
          de: 'Monatsabonnement',
        },
      },
      savings: {
        fr: 'Économisez',
        en: 'Save',
        nl: 'Bespaar',
        de: 'Sparen Sie',
      },
      perYear: {
        fr: '/an',
        en: '/year',
        nl: '/jaar',
        de: '/Jahr',
      },
      freeTrialIncluded: {
        fr: 'Essai gratuit de',
        en: 'Free trial of',
        nl: 'Gratis proefperiode van',
        de: 'Kostenlose Testversion von',
      },
      included: {
        fr: 'inclus',
        en: 'included',
        nl: 'inbegrepen',
        de: 'inklusive',
      },
      free: {
        fr: 'GRATUIT',
        en: 'FREE',
        nl: 'GRATIS',
        de: 'KOSTENLOS',
      },
      trialDays: {
        owner: {
          fr: '3 mois',
          en: '3 months',
          nl: '3 maanden',
          de: '3 Monate',
        },
        resident: {
          fr: '6 mois',
          en: '6 months',
          nl: '6 maanden',
          de: '6 Monate',
        },
      },
    },
    features: {
      includedInSubscription: {
        fr: 'Inclus dans ton abonnement',
        en: 'Included in your subscription',
        nl: 'Inbegrepen in je abonnement',
        de: 'In Ihrem Abonnement enthalten',
      },
      owner: {
        multiProperty: {
          fr: 'Gestion multi-propriétés',
          en: 'Multi-property management',
          nl: 'Beheer van meerdere woningen',
          de: 'Multi-Immobilien-Verwaltung',
        },
        advancedMatching: {
          fr: 'Matching avancé résidents',
          en: 'Advanced roommate matching',
          nl: 'Geavanceerde huisgenoot matching',
          de: 'Erweitertes Mitbewohner-Matching',
        },
        unlimitedMessaging: {
          fr: 'Messagerie illimitée',
          en: 'Unlimited messaging',
          nl: 'Onbeperkte berichten',
          de: 'Unbegrenzte Nachrichten',
        },
        analyticsBoard: {
          fr: 'Tableau de bord analytique',
          en: 'Analytics dashboard',
          nl: 'Analyse dashboard',
          de: 'Analytics-Dashboard',
        },
        documentsContracts: {
          fr: 'Documents & contrats',
          en: 'Documents & contracts',
          nl: 'Documenten & contracten',
          de: 'Dokumente & Verträge',
        },
        prioritySupport: {
          fr: 'Support prioritaire',
          en: 'Priority support',
          nl: 'Prioritaire ondersteuning',
          de: 'Prioritäts-Support',
        },
      },
      resident: {
        verifiedProfile: {
          fr: 'Profil vérifié & visible',
          en: 'Verified & visible profile',
          nl: 'Geverifieerd & zichtbaar profiel',
          de: 'Verifiziertes & sichtbares Profil',
        },
        colivingMatching: {
          fr: 'Matching de co-livings',
          en: 'Coliving matching',
          nl: 'Samenwoning matching',
          de: 'WG-Matching',
        },
        unlimitedMessaging: {
          fr: 'Messagerie illimitée',
          en: 'Unlimited messaging',
          nl: 'Onbeperkte berichten',
          de: 'Unbegrenzte Nachrichten',
        },
        personalizedAlerts: {
          fr: 'Alertes personnalisées',
          en: 'Personalized alerts',
          nl: 'Gepersonaliseerde meldingen',
          de: 'Personalisierte Benachrichtigungen',
        },
        residentCommunity: {
          fr: 'Communauté de résidents',
          en: 'Resident community',
          nl: 'Bewonerscommissie',
          de: 'Bewohner-Community',
        },
        dedicatedSupport: {
          fr: 'Support dédié',
          en: 'Dedicated support',
          nl: 'Toegewijde ondersteuning',
          de: 'Dedizierter Support',
        },
      },
    },
    trust: {
      title: {
        fr: 'Paiement 100% sécurisé',
        en: '100% secure payment',
        nl: '100% veilige betaling',
        de: '100% sichere Zahlung',
      },
      stripe: {
        title: {
          fr: 'Sécurisé par Stripe',
          en: 'Secured by Stripe',
          nl: 'Beveiligd door Stripe',
          de: 'Gesichert durch Stripe',
        },
        description: {
          fr: 'Données chiffrées SSL 256-bit',
          en: 'SSL 256-bit encrypted data',
          nl: 'SSL 256-bit versleutelde gegevens',
          de: 'SSL 256-Bit verschlüsselte Daten',
        },
      },
      cancellation: {
        title: {
          fr: 'Annulation flexible',
          en: 'Flexible cancellation',
          nl: 'Flexibele annulering',
          de: 'Flexible Stornierung',
        },
        description: {
          fr: 'Annulez quand tu veux',
          en: 'Cancel anytime you want',
          nl: 'Annuleer wanneer je wilt',
          de: 'Jederzeit kündbar',
        },
      },
      deferredPayment: {
        title: {
          fr: 'Paiement différé',
          en: 'Deferred payment',
          nl: 'Uitgestelde betaling',
          de: 'Aufgeschobene Zahlung',
        },
        description: {
          fr: '1er prélèvement après l\'essai',
          en: 'First charge after trial',
          nl: 'Eerste afschrijving na proefperiode',
          de: 'Erste Abbuchung nach Testversion',
        },
      },
      paymentMethods: {
        fr: 'Moyens de paiement acceptés',
        en: 'Accepted payment methods',
        nl: 'Geaccepteerde betaalmethoden',
        de: 'Akzeptierte Zahlungsmethoden',
      },
    },
    form: {
      title: {
        fr: 'Finaliser votre abonnement',
        en: 'Complete your subscription',
        nl: 'Voltooi je abonnement',
        de: 'Abonnement abschließen',
      },
      subtitle: {
        fr: 'Entrez tes informations de paiement ci-dessous',
        en: 'Enter your payment information below',
        nl: 'Voer hieronder je betalingsgegevens in',
        de: 'Geben Sie unten Ihre Zahlungsinformationen ein',
      },
    },
    support: {
      question: {
        fr: 'Une question ? Contactez-nous à',
        en: 'Have a question? Contact us at',
        nl: 'Heb je een vraag? Neem contact met ons op via',
        de: 'Haben Sie eine Frage? Kontaktieren Sie uns unter',
      },
    },
  },

  // ============================================================================
  // COMING SOON PAGES
  // ============================================================================
  comingSoon: {
    searcher: {
      backToHome: {
        fr: 'Retour à l\'accueil',
        en: 'Back to home',
        nl: 'Terug naar home',
        de: 'Zurück zur Startseite',
      },
      title: {
        fr: 'Bientôt Disponible !',
        en: 'Coming Soon!',
        nl: 'Binnenkort Beschikbaar!',
        de: 'Demnächst Verfügbar!',
      },
      subtitle: {
        fr: 'La fonction',
        en: 'The',
        nl: 'De',
        de: 'Die',
      },
      featureName: {
        fr: 'Chercheur',
        en: 'Searcher',
        nl: 'Zoeker',
        de: 'Sucher',
      },
      arriving: {
        fr: 'arrive très prochainement.',
        en: 'feature is coming very soon.',
        nl: 'functie komt zeer binnenkort.',
        de: 'Funktion kommt sehr bald.',
      },
      whatscoming: {
        fr: 'Qu\'est-ce qui arrive ?',
        en: 'What\'s coming?',
        nl: 'Wat komt eraan?',
        de: 'Was kommt?',
      },
      features: {
        marketplace: {
          title: {
            fr: 'Marketplace Complète',
            en: 'Complete Marketplace',
            nl: 'Complete Marktplaats',
            de: 'Vollständiger Marktplatz',
          },
          description: {
            fr: 'Parcourez des centaines de propriétés disponibles avec recherche avancée',
            en: 'Browse hundreds of available properties with advanced search',
            nl: 'Blader door honderden beschikbare woningen met geavanceerd zoeken',
            de: 'Durchsuchen Sie Hunderte von verfügbaren Immobilien mit erweiterter Suche',
          },
        },
        matching: {
          title: {
            fr: 'Matching Intelligent',
            en: 'Smart Matching',
            nl: 'Slim Matchen',
            de: 'Intelligentes Matching',
          },
          description: {
            fr: 'Trouvez votre co-living idéale grâce à notre algorithme de compatibilité',
            en: 'Find your ideal coliving through our compatibility algorithm',
            nl: 'Vind je ideale samenwoning via ons compatibiliteitsalgoritme',
            de: 'Finden Sie Ihre ideale WG durch unseren Kompatibilitätsalgorithmus',
          },
        },
        alerts: {
          title: {
            fr: 'Alertes Temps Réel',
            en: 'Real-Time Alerts',
            nl: 'Realtime Meldingen',
            de: 'Echtzeit-Benachrichtigungen',
          },
          description: {
            fr: 'Soyez notifié instantanément dès qu\'une propriété correspond à tes critères',
            en: 'Get notified instantly when a property matches your criteria',
            nl: 'Word direct op de hoogte gesteld wanneer een woning aan je criteria voldoet',
            de: 'Werden Sie sofort benachrichtigt, wenn eine Immobilie Ihren Kriterien entspricht',
          },
        },
      },
      waitlist: {
        title: {
          fr: 'Inscris-toi à la liste d\'attente',
          en: 'Join the waitlist',
          nl: 'Schrijf je in voor de wachtlijst',
          de: 'Tragen Sie sich in die Warteliste ein',
        },
        subtitle: {
          fr: 'Soyez parmi les premiers à accéder à la marketplace !',
          en: 'Be among the first to access the marketplace!',
          nl: 'Wees een van de eersten die toegang krijgt tot de marktplaats!',
          de: 'Gehören Sie zu den Ersten, die Zugang zum Marktplatz erhalten!',
        },
        placeholder: {
          fr: 'votre@email.com',
          en: 'your@email.com',
          nl: 'jouw@email.com',
          de: 'ihre@email.com',
        },
        button: {
          fr: 'Rejoindre',
          en: 'Join',
          nl: 'Aanmelden',
          de: 'Beitreten',
        },
        success: {
          title: {
            fr: 'Merci ! Tu es sur la liste !',
            en: 'Thanks! You\'re on the list!',
            nl: 'Bedankt! Je staat op de lijst!',
            de: 'Danke! Sie sind auf der Liste!',
          },
          message: {
            fr: 'Nous te contacterons dès l\'ouverture de la marketplace.',
            en: 'We\'ll contact you as soon as the marketplace opens.',
            nl: 'We nemen contact met je op zodra de marktplaats opent.',
            de: 'Wir kontaktieren Sie, sobald der Marktplatz öffnet.',
          },
        },
      },
      alternatives: {
        title: {
          fr: 'En attendant, découvrez nos autres fonctionnalités',
          en: 'Meanwhile, discover our other features',
          nl: 'Ontdek ondertussen onze andere functies',
          de: 'Entdecken Sie in der Zwischenzeit unsere anderen Funktionen',
        },
        owner: {
          fr: 'Gérer une Propriété (Owner)',
          en: 'Manage a Property (Owner)',
          nl: 'Een Woning Beheren (Eigenaar)',
          de: 'Eine Immobilie Verwalten (Eigentümer)',
        },
        resident: {
          fr: 'Gérer ma Co-living (Resident)',
          en: 'Manage my Coliving (Resident)',
          nl: 'Mijn Samenwoning Beheren (Bewoner)',
          de: 'Meine WG Verwalten (Bewohner)',
        },
      },
    },
  },

  // ============================================================================
  // COMPONENTS
  // ============================================================================
  components: {
    proTipCard: {
      profileCompletion: {
        fr: 'Complétion du profil',
        en: 'Profile Completion',
        nl: 'Profiel Voltooiing',
        de: 'Profil Vervollständigung',
      },
    },
    loadingView: {
      loadingMessages: {
        fr: 'Chargement de tes messages',
        en: 'Loading your messages',
        nl: 'Je berichten laden',
        de: 'Ihre Nachrichten werden geladen',
      },
    },
    chat: {
      placeholder: {
        fr: 'Écrivez votre message...',
        en: 'Write your message...',
        nl: 'Schrijf je bericht...',
        de: 'Schreiben Sie Ihre Nachricht...',
      },
      sendError: {
        fr: 'Impossible d\'envoyer le message',
        en: 'Unable to send message',
        nl: 'Kan bericht niet verzenden',
        de: 'Nachricht konnte nicht gesendet werden',
      },
      selectImage: {
        fr: 'Veuillez sélectionner une image',
        en: 'Please select an image',
        nl: 'Selecteer een afbeelding',
        de: 'Bitte wählen Sie ein Bild aus',
      },
      imageTooLarge: {
        fr: 'L\'image est trop volumineuse (max 5MB)',
        en: 'Image is too large (max 5MB)',
        nl: 'Afbeelding is te groot (max 5MB)',
        de: 'Bild ist zu groß (max 5MB)',
      },
      uploadComingSoon: {
        fr: 'Upload d\'images bientôt disponible',
        en: 'Image upload coming soon',
        nl: 'Afbeelding uploaden binnenkort beschikbaar',
        de: 'Bild-Upload kommt bald',
      },
      uploadError: {
        fr: 'Impossible d\'uploader l\'image',
        en: 'Unable to upload image',
        nl: 'Kan afbeelding niet uploaden',
        de: 'Bild konnte nicht hochgeladen werden',
      },
      hint: {
        fr: 'Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne',
        en: 'Press Enter to send, Shift+Enter for a new line',
        nl: 'Druk op Enter om te verzenden, Shift+Enter voor een nieuwe regel',
        de: 'Drücken Sie Enter zum Senden, Shift+Enter für eine neue Zeile',
      },
    },
    invitation: {
      invitedYou: {
        fr: 't\'a invité',
        en: 'invited you',
        nl: 'heeft je uitgenodigd',
        de: 'hat Sie eingeladen',
      },
      status: {
        pending: {
          fr: 'En attente',
          en: 'Pending',
          nl: 'In afwachting',
          de: 'Ausstehend',
        },
        accepted: {
          fr: 'Acceptée',
          en: 'Accepted',
          nl: 'Geaccepteerd',
          de: 'Akzeptiert',
        },
        refused: {
          fr: 'Refusée',
          en: 'Refused',
          nl: 'Geweigerd',
          de: 'Abgelehnt',
        },
        expired: {
          fr: 'Expirée',
          en: 'Expired',
          nl: 'Verlopen',
          de: 'Abgelaufen',
        },
        unknown: {
          fr: 'Inconnu',
          en: 'Unknown',
          nl: 'Onbekend',
          de: 'Unbekannt',
        },
      },
      asRole: {
        owner: {
          fr: 'En tant que propriétaire',
          en: 'As owner',
          nl: 'Als eigenaar',
          de: 'Als Eigentümer',
        },
        resident: {
          fr: 'En tant que résident',
          en: 'As resident',
          nl: 'Als bewoner',
          de: 'Als Bewohner',
        },
      },
      receivedOn: {
        fr: 'Reçu le',
        en: 'Received on',
        nl: 'Ontvangen op',
        de: 'Empfangen am',
      },
      expiresOn: {
        fr: 'Expire le',
        en: 'Expires on',
        nl: 'Verloopt op',
        de: 'Läuft ab am',
      },
      accept: {
        fr: 'Accepter',
        en: 'Accept',
        nl: 'Accepteren',
        de: 'Annehmen',
      },
      refuse: {
        fr: 'Refuser',
        en: 'Refuse',
        nl: 'Weigeren',
        de: 'Ablehnen',
      },
      acceptSuccess: {
        fr: 'Invitation acceptée ! Bienvenue dans la co-living.',
        en: 'Invitation accepted! Welcome to the coliving.',
        nl: 'Uitnodiging geaccepteerd! Welkom in de samenwoning.',
        de: 'Einladung angenommen! Willkommen in der WG.',
      },
      acceptError: {
        fr: 'Erreur lors de l\'acceptation de l\'invitation',
        en: 'Error accepting the invitation',
        nl: 'Fout bij het accepteren van de uitnodiging',
        de: 'Fehler beim Annehmen der Einladung',
      },
      refuseSuccess: {
        fr: 'Invitation refusée.',
        en: 'Invitation refused.',
        nl: 'Uitnodiging geweigerd.',
        de: 'Einladung abgelehnt.',
      },
      refuseError: {
        fr: 'Erreur lors du refus de l\'invitation',
        en: 'Error refusing the invitation',
        nl: 'Fout bij het weigeren van de uitnodiging',
        de: 'Fehler beim Ablehnen der Einladung',
      },
    },
    savedSearches: {
      loadError: {
        fr: 'Impossible de charger les recherches sauvegardées',
        en: 'Unable to load saved searches',
        nl: 'Kan opgeslagen zoekopdrachten niet laden',
        de: 'Gespeicherte Suchen konnten nicht geladen werden',
      },
      deleteSuccess: {
        fr: 'Recherche supprimée',
        en: 'Search deleted',
        nl: 'Zoekopdracht verwijderd',
        de: 'Suche gelöscht',
      },
      deleteError: {
        fr: 'Impossible de supprimer la recherche',
        en: 'Unable to delete the search',
        nl: 'Kan zoekopdracht niet verwijderen',
        de: 'Suche konnte nicht gelöscht werden',
      },
      notificationsEnabled: {
        fr: 'Notifications activées pour cette recherche',
        en: 'Notifications enabled for this search',
        nl: 'Meldingen ingeschakeld voor deze zoekopdracht',
        de: 'Benachrichtigungen für diese Suche aktiviert',
      },
      notificationsDisabled: {
        fr: 'Notifications désactivées',
        en: 'Notifications disabled',
        nl: 'Meldingen uitgeschakeld',
        de: 'Benachrichtigungen deaktiviert',
      },
      notificationsError: {
        fr: 'Impossible de modifier les notifications',
        en: 'Unable to modify notifications',
        nl: 'Kan meldingen niet wijzigen',
        de: 'Benachrichtigungen konnten nicht geändert werden',
      },
      noSavedSearches: {
        fr: 'Aucune recherche sauvegardée',
        en: 'No saved searches',
        nl: 'Geen opgeslagen zoekopdrachten',
        de: 'Keine gespeicherten Suchen',
      },
      saveHint: {
        fr: 'Sauvegardez tes recherches pour y accéder rapidement plus tard',
        en: 'Save your searches for quick access later',
        nl: 'Sla je zoekopdrachten op voor snelle toegang later',
        de: 'Speichern Sie Ihre Suchen für schnellen Zugriff später',
      },
      bedroom: {
        fr: 'chambre',
        en: 'bedroom',
        nl: 'slaapkamer',
        de: 'Schlafzimmer',
      },
      bedrooms: {
        fr: 'chambres',
        en: 'bedrooms',
        nl: 'slaapkamers',
        de: 'Schlafzimmer',
      },
      amenity: {
        fr: 'équipement',
        en: 'amenity',
        nl: 'voorziening',
        de: 'Ausstattung',
      },
      amenities: {
        fr: 'équipements',
        en: 'amenities',
        nl: 'voorzieningen',
        de: 'Ausstattungen',
      },
      created: {
        fr: 'Créée',
        en: 'Created',
        nl: 'Aangemaakt',
        de: 'Erstellt',
      },
      disableNotifications: {
        fr: 'Désactiver les notifications',
        en: 'Disable notifications',
        nl: 'Meldingen uitschakelen',
        de: 'Benachrichtigungen deaktivieren',
      },
      enableNotifications: {
        fr: 'Activer les notifications',
        en: 'Enable notifications',
        nl: 'Meldingen inschakelen',
        de: 'Benachrichtigungen aktivieren',
      },
      delete: {
        fr: 'Supprimer',
        en: 'Delete',
        nl: 'Verwijderen',
        de: 'Löschen',
      },
      loadSearch: {
        fr: 'Charger cette recherche',
        en: 'Load this search',
        nl: 'Deze zoekopdracht laden',
        de: 'Diese Suche laden',
      },
    },
    headers: {
      logoutSuccess: {
        fr: 'Déconnexion réussie',
        en: 'Successfully logged out',
        nl: 'Succesvol uitgelogd',
        de: 'Erfolgreich abgemeldet',
      },
      logoutError: {
        fr: 'Erreur lors de la déconnexion',
        en: 'Error during logout',
        nl: 'Fout bij uitloggen',
        de: 'Fehler beim Abmelden',
      },
    },
    reviews: {
      // ReviewsList
      loginToVote: {
        fr: 'Connecte-toi pour voter',
        en: 'Log in to vote',
        nl: 'Log in om te stemmen',
        de: 'Melden Sie sich an, um abzustimmen',
      },
      voteError: {
        fr: 'Erreur lors du vote',
        en: 'Error voting',
        nl: 'Fout bij het stemmen',
        de: 'Fehler beim Abstimmen',
      },
      noReviews: {
        fr: 'Aucun avis pour le moment',
        en: 'No reviews yet',
        nl: 'Nog geen beoordelingen',
        de: 'Noch keine Bewertungen',
      },
      beFirstToReview: {
        fr: 'Soyez le premier à laisser un avis sur cette propriété',
        en: 'Be the first to leave a review for this property',
        nl: 'Wees de eerste om een beoordeling voor deze woning achter te laten',
        de: 'Seien Sie der Erste, der eine Bewertung für diese Immobilie hinterlässt',
      },
      reviewCount: {
        fr: 'avis',
        en: 'reviews',
        nl: 'beoordelingen',
        de: 'Bewertungen',
      },
      cleanliness: {
        fr: 'Propreté',
        en: 'Cleanliness',
        nl: 'Netheid',
        de: 'Sauberkeit',
      },
      location: {
        fr: 'Emplacement',
        en: 'Location',
        nl: 'Locatie',
        de: 'Lage',
      },
      valueForMoney: {
        fr: 'Rapport qualité-prix',
        en: 'Value for money',
        nl: 'Prijs-kwaliteitverhouding',
        de: 'Preis-Leistungs-Verhältnis',
      },
      amenities: {
        fr: 'Équipements',
        en: 'Amenities',
        nl: 'Voorzieningen',
        de: 'Ausstattung',
      },
      communication: {
        fr: 'Communication',
        en: 'Communication',
        nl: 'Communicatie',
        de: 'Kommunikation',
      },
      verifiedStay: {
        fr: 'Séjour vérifié',
        en: 'Verified stay',
        nl: 'Geverifieerd verblijf',
        de: 'Verifizierter Aufenthalt',
      },
      stayedMonths: {
        fr: 'A séjourné {count} mois',
        en: 'Stayed {count} months',
        nl: 'Verbleef {count} maanden',
        de: 'Blieb {count} Monate',
      },
      helpful: {
        fr: 'Utile',
        en: 'Helpful',
        nl: 'Nuttig',
        de: 'Hilfreich',
      },
      // AddReviewModal
      leaveReview: {
        fr: 'Laisser un avis',
        en: 'Leave a review',
        nl: 'Laat een beoordeling achter',
        de: 'Eine Bewertung hinterlassen',
      },
      close: {
        fr: 'Fermer',
        en: 'Close',
        nl: 'Sluiten',
        de: 'Schließen',
      },
      overallRating: {
        fr: 'Note globale',
        en: 'Overall rating',
        nl: 'Totale beoordeling',
        de: 'Gesamtbewertung',
      },
      required: {
        fr: '*',
        en: '*',
        nl: '*',
        de: '*',
      },
      titleOptional: {
        fr: 'Titre (optionnel)',
        en: 'Title (optional)',
        nl: 'Titel (optioneel)',
        de: 'Titel (optional)',
      },
      titlePlaceholder: {
        fr: 'Résumez ton expérience',
        en: 'Summarize your experience',
        nl: 'Vat je ervaring samen',
        de: 'Fassen Sie Ihre Erfahrung zusammen',
      },
      yourReviewOptional: {
        fr: 'Votre avis (optionnel)',
        en: 'Your review (optional)',
        nl: 'Je beoordeling (optioneel)',
        de: 'Ihre Bewertung (optional)',
      },
      reviewPlaceholder: {
        fr: 'Partagez ton expérience avec les futurs résidents...',
        en: 'Share your experience with future tenants...',
        nl: 'Deel je ervaring met toekomstige huurders...',
        de: 'Teilen Sie Ihre Erfahrung mit zukünftigen Mietern...',
      },
      detailedRatingsOptional: {
        fr: 'Notes détaillées (optionnel)',
        en: 'Detailed ratings (optional)',
        nl: 'Gedetailleerde beoordelingen (optioneel)',
        de: 'Detaillierte Bewertungen (optional)',
      },
      cancel: {
        fr: 'Annuler',
        en: 'Cancel',
        nl: 'Annuleren',
        de: 'Abbrechen',
      },
      publishing: {
        fr: 'Publication...',
        en: 'Publishing...',
        nl: 'Publiceren...',
        de: 'Veröffentlichen...',
      },
      publishReview: {
        fr: 'Publier l\'avis',
        en: 'Publish review',
        nl: 'Beoordeling publiceren',
        de: 'Bewertung veröffentlichen',
      },
      selectOverallRating: {
        fr: 'Veuillez sélectionner une note globale',
        en: 'Please select an overall rating',
        nl: 'Selecteer een totale beoordeling',
        de: 'Bitte wählen Sie eine Gesamtbewertung',
      },
      mustBeLoggedIn: {
        fr: 'Tu dois être connecté',
        en: 'You must be logged in',
        nl: 'Je moet ingelogd zijn',
        de: 'Sie müssen angemeldet sein',
      },
      mustHaveStayed: {
        fr: 'Tu dois avoir séjourné dans cette propriété pour laisser un avis',
        en: 'You must have stayed at this property to leave a review',
        nl: 'Je moet in deze woning hebben verbleven om een beoordeling achter te laten',
        de: 'Sie müssen in dieser Immobilie gewohnt haben, um eine Bewertung zu hinterlassen',
      },
      alreadyReviewed: {
        fr: 'Tu as déjà laissé un avis pour cette propriété',
        en: 'You have already left a review for this property',
        nl: 'Je hebt al een beoordeling voor deze woning achtergelaten',
        de: 'Sie haben bereits eine Bewertung für diese Immobilie hinterlassen',
      },
      reviewPublished: {
        fr: 'Avis publié avec succès !',
        en: 'Review published successfully!',
        nl: 'Beoordeling succesvol gepubliceerd!',
        de: 'Bewertung erfolgreich veröffentlicht!',
      },
      publishError: {
        fr: 'Erreur lors de la publication de l\'avis',
        en: 'Error publishing the review',
        nl: 'Fout bij het publiceren van de beoordeling',
        de: 'Fehler beim Veröffentlichen der Bewertung',
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
        fr: 'Comment nous collectons, utilisons et protégeons tes données personnelles',
        en: 'How we collect, use and protect your personal data',
        nl: 'Hoe we uw persoonlijke gegevens verzamelen, gebruiken en beschermen',
        de: 'Wie wir Ihre personenbezogenen Daten erfassen, verwenden und schützen',
      },
      intro: {
        fr: 'Izzico SPRL/BVBA s\'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons tes informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD).',
        en: 'Izzico SPRL/BVBA is committed to protecting your privacy. This privacy policy explains how we collect, use, share and protect your personal information in accordance with the General Data Protection Regulation (GDPR).',
        nl: 'Izzico SPRL/BVBA verbindt zich ertoe uw privacy te beschermen. Dit privacybeleid legt uit hoe we uw persoonlijke informatie verzamelen, gebruiken, delen en beschermen in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG).',
        de: 'Izzico SPRL/BVBA verpflichtet sich, Ihre Privatsphäre zu schützen. Diese Datenschutzerklärung erklärt, wie wir Ihre persönlichen Informationen gemäß der Datenschutz-Grundverordnung (DSGVO) erfassen, verwenden, weitergeben und schützen.',
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
          fr: 'Préférences de co-living : style de vie, habitudes, compatibilité',
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
          fr: 'Nous traitons tes données sur les bases légales suivantes :',
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
          fr: 'Nous utilisons tes données pour :',
          en: 'We use your data to:',
          nl: 'We gebruiken uw gegevens om:',
          de: 'Wir verwenden Ihre Daten um:',
        },
        matching: {
          fr: 'Fournir des services de matching entre résidents et propriétés',
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
          fr: 'Communiquer avec toi concernant ton compte et nos services',
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
          fr: 'Vos données sont conservées aussi longtemps que nécessaire pour fournir nos services. Les comptes inactifs depuis plus de 3 ans sont archivés. Tu peux demander la suppression de tes données à tout moment.',
          en: 'Your data is retained as long as necessary to provide our services. Accounts inactive for more than 3 years are archived. You can request deletion of your data at any time.',
          nl: 'Uw gegevens worden bewaard zolang als nodig is om onze diensten te verlenen. Accounts die langer dan 3 jaar inactief zijn, worden gearchiveerd. U kunt op elk moment verwijdering van uw gegevens aanvragen.',
          de: 'Ihre Daten werden so lange gespeichert, wie es zur Bereitstellung unserer Dienste erforderlich ist. Konten, die länger als 3 Jahre inaktiv sind, werden archiviert. Sie können jederzeit die Löschung Ihrer Daten beantragen.',
        },
      },

      userRights: {
        title: {
          fr: '5. Tes Droits',
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
          fr: 'Droit d\'accès : obtenir une copie de tes données personnelles',
          en: 'Right of access: obtain a copy of your personal data',
          nl: 'Recht op toegang: een kopie van uw persoonlijke gegevens verkrijgen',
          de: 'Auskunftsrecht: eine Kopie Ihrer personenbezogenen Daten erhalten',
        },
        rectification: {
          fr: 'Droit de rectification : corriger tes données inexactes',
          en: 'Right to rectification: correct your inaccurate data',
          nl: 'Recht op rectificatie: uw onjuiste gegevens corrigeren',
          de: 'Berichtigungsrecht: Ihre unrichtigen Daten korrigieren',
        },
        erasure: {
          fr: 'Droit à l\'effacement : demander la suppression de tes données',
          en: 'Right to erasure: request deletion of your data',
          nl: 'Recht op verwijdering: verwijdering van uw gegevens aanvragen',
          de: 'Recht auf Löschung: Löschung Ihrer Daten beantragen',
        },
        portability: {
          fr: 'Droit à la portabilité : recevoir tes données dans un format structuré',
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
          fr: 'Nous utilisons des cookies pour améliorer ton expérience. Consulte notre Politique Cookies pour plus de détails.',
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
          fr: 'Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger tes données contre tout accès non autorisé, perte ou destruction. Cela inclut le chiffrement, les pare-feu, les contrôles d\'accès et des audits de sécurité réguliers.',
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
          fr: 'Nous ne partageons tes données qu\'avec :',
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
          fr: 'Pour toute question concernant tes données personnelles ou pour exercer tes droits, contactez notre DPO à :',
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
        fr: 'Conditions régissant l\'utilisation de la plateforme Izzico',
        en: 'Terms governing the use of the Izzico platform',
        nl: 'Voorwaarden voor het gebruik van het Izzico-platform',
        de: 'Bedingungen für die Nutzung der Izzico-Plattform',
      },
      intro: {
        fr: 'En utilisant Izzico, tu acceptes les présentes conditions générales d\'utilisation. Veuillez les lire attentivement avant d\'utiliser nos services.',
        en: 'By using Izzico, you accept these terms of service. Please read them carefully before using our services.',
        nl: 'Door Izzico te gebruiken, accepteert u deze algemene gebruiksvoorwaarden. Lees ze zorgvuldig door voordat u onze diensten gebruikt.',
        de: 'Durch die Nutzung von Izzico akzeptieren Sie diese Allgemeinen Geschäftsbedingungen. Bitte lesen Sie sie sorgfältig durch, bevor Sie unsere Dienste nutzen.',
      },

      service: {
        title: {
          fr: '1. Description du Service',
          en: '1. Service Description',
          nl: '1. Servicebeschrijving',
          de: '1. Dienstbeschreibung',
        },
        content: {
          fr: 'Izzico est une plateforme de mise en relation pour la co-living en Belgique. Nous offrons :',
          en: 'Izzico is a matching platform for flatsharing in Belgium. We offer:',
          nl: 'Izzico is een matchingplatform voor flatsharing in België. We bieden:',
          de: 'Izzico ist eine Matching-Plattform für WG-Suche in Belgien. Wir bieten:',
        },
        matching: {
          fr: 'Matching intelligent entre chercheurs et propriétés',
          en: 'Smart matching between searchers and properties',
          nl: 'Slimme matching tussen zoekers en eigendommen',
          de: 'Intelligentes Matching zwischen Suchenden und Immobilien',
        },
        verification: {
          fr: 'Vérification d\'identité et de résidences',
          en: 'Identity and residence verification',
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
          fr: 'Pour utiliser Izzico, tu dois :',
          en: 'To use Izzico, you must:',
          nl: 'Om Izzico te gebruiken, moet u:',
          de: 'Um Izzico zu nutzen, müssen Sie:',
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
          fr: 'Ne pas publier de résidences frauduleuses',
          en: 'Not post fraudulent residences',
          nl: 'Geen frauduleuze advertenties te plaatsen',
          de: 'Keine betrügerischen Anzeigen zu veröffentlichen',
        },
        security: {
          fr: 'Maintenir la sécurité de ton compte',
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
          fr: 'Tous les contenus de la plateforme Izzico (logo, design, algorithmes, textes) sont protégés par le droit d\'auteur et appartiennent à Izzico SPRL/BVBA. Vous conservez vos droits sur le contenu que vous publiez, mais nous accordez une licence d\'utilisation.',
          en: 'All content on the Izzico platform (logo, design, algorithms, texts) is protected by copyright and belongs to Izzico SPRL/BVBA. You retain rights to content you post, but grant us a license to use it.',
          nl: 'Alle inhoud op het Izzico-platform (logo, ontwerp, algoritmen, teksten) is beschermd door auteursrecht en behoort toe aan Izzico SPRL/BVBA. U behoudt rechten op inhoud die u plaatst, maar verleent ons een licentie om deze te gebruiken.',
          de: 'Alle Inhalte auf der Izzico-Plattform (Logo, Design, Algorithmen, Texte) sind urheberrechtlich geschützt und gehören Izzico SPRL/BVBA. Sie behalten Rechte an von Ihnen veröffentlichten Inhalten, gewähren uns jedoch eine Nutzungslizenz.',
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
          fr: 'Izzico agit comme intermédiaire. Nous ne sommes pas responsables de :',
          en: 'Izzico acts as an intermediary. We are not responsible for:',
          nl: 'Izzico treedt op als tussenpersoon. We zijn niet verantwoordelijk voor:',
          de: 'Izzico fungiert als Vermittler. Wir sind nicht verantwortlich für:',
        },
        listings: {
          fr: 'La véracité des résidences publiées par les utilisateurs',
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
          fr: 'Tu peux supprimer ton compte à tout moment. Nous nous réservons le droit de suspendre ou fermer ton compte en cas de :',
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
        fr: 'Informations légales sur Izzico SPRL/BVBA',
        en: 'Legal information about Izzico SPRL/BVBA',
        nl: 'Juridische informatie over Izzico SPRL/BVBA',
        de: 'Rechtliche Informationen über Izzico SPRL/BVBA',
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
          fr: 'contact@izzico.be',
          en: 'contact@izzico.be',
          nl: 'contact@izzico.be',
          de: 'contact@izzico.be',
        },
        website: {
          fr: 'Site web',
          en: 'Website',
          nl: 'Website',
          de: 'Website',
        },
        websiteValue: {
          fr: 'www.izzico.be',
          en: 'www.izzico.be',
          nl: 'www.izzico.be',
          de: 'www.izzico.be',
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
          fr: 'Le directeur de la publication est le représentant légal de Izzico SPRL/BVBA.',
          en: 'The publication director is the legal representative of Izzico SPRL/BVBA.',
          nl: 'De publicatiedirecteur is de wettelijke vertegenwoordiger van Izzico SPRL/BVBA.',
          de: 'Der Veröffentlichungsleiter ist der gesetzliche Vertreter von Izzico SPRL/BVBA.',
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
          fr: 'Izzico est une plateforme digitale de mise en relation pour le co-living en Belgique. Nous facilitons la recherche de résidents compatibles et de logements adaptés grâce à des algorithmes de matching intelligents.',
          en: 'Izzico is a digital matching platform for flatsharing and coliving in Belgium. We facilitate the search for compatible flatmates and suitable housing through smart matching algorithms.',
          nl: 'Izzico is een digitaal matchingplatform voor flatsharing en coliving in België. We faciliteren het zoeken naar compatibele huisgenoten en geschikte huisvesting via slimme matching-algoritmen.',
          de: 'Izzico ist eine digitale Matching-Plattform für WG-Suche und Coliving in Belgien. Wir erleichtern die Suche nach kompatiblen Mitbewohnern und geeigneten Unterkünften durch intelligente Matching-Algorithmen.',
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
          fr: 'L\'ensemble du contenu de ce site (textes, images, logos, algorithmes) est la propriété exclusive de Izzico SPRL/BVBA et est protégé par les lois sur la propriété intellectuelle. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable.',
          en: 'All content on this website (texts, images, logos, algorithms) is the exclusive property of Izzico SPRL/BVBA and is protected by intellectual property laws. Any reproduction, even partial, is strictly prohibited without prior authorization.',
          nl: 'Alle inhoud op deze website (teksten, afbeeldingen, logo\'s, algoritmen) is het exclusieve eigendom van Izzico SPRL/BVBA en wordt beschermd door wetgeving inzake intellectuele eigendom. Elke reproductie, zelfs gedeeltelijk, is strikt verboden zonder voorafgaande toestemming.',
          de: 'Alle Inhalte dieser Website (Texte, Bilder, Logos, Algorithmen) sind ausschließliches Eigentum von Izzico SPRL/BVBA und durch Gesetze zum Schutz des geistigen Eigentums geschützt. Jede Reproduktion, auch teilweise, ist ohne vorherige Genehmigung strengstens untersagt.',
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
          fr: 'Conformément à la législation européenne, tu peux recourir à la plateforme de résolution des litiges en ligne : https://ec.europa.eu/consumers/odr/',
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
        fr: 'Izzico utilise des cookies et technologies similaires pour améliorer ton expérience sur notre plateforme. Cette politique explique ce que sont les cookies, comment nous les utilisons et comment tu peux les gérer.',
        en: 'Izzico uses cookies and similar technologies to improve your experience on our platform. This policy explains what cookies are, how we use them and how you can manage them.',
        nl: 'Izzico gebruikt cookies en vergelijkbare technologieën om uw ervaring op ons platform te verbeteren. Dit beleid legt uit wat cookies zijn, hoe we ze gebruiken en hoe u ze kunt beheren.',
        de: 'Izzico verwendet Cookies und ähnliche Technologien, um Ihre Erfahrung auf unserer Plattform zu verbessern. Diese Richtlinie erklärt, was Cookies sind, wie wir sie verwenden und wie Sie sie verwalten können.',
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
            fr: 'Améliorent l\'expérience utilisateur en mémorisant tes préférences et choix.',
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
            fr: 'Nous aident à comprendre comment tu utilises notre plateforme pour l\'améliorer.',
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
          fr: 'Liste des principaux cookies utilisés sur Izzico :',
          en: 'List of main cookies used on Izzico:',
          nl: 'Lijst van belangrijkste cookies gebruikt op Izzico:',
          de: 'Liste der wichtigsten auf Izzico verwendeten Cookies:',
        },
        session: {
          fr: 'izzico_session : cookie de session essentiel (durée : session)',
          en: 'izzico_session: essential session cookie (duration: session)',
          nl: 'izzico_session: essentiële sessiecookie (duur: sessie)',
          de: 'izzico_session: essenzielles Sitzungscookie (Dauer: Sitzung)',
        },
        language: {
          fr: 'izzico_lang : préférence de langue (durée : 1 an)',
          en: 'izzico_lang: language preference (duration: 1 year)',
          nl: 'izzico_lang: taalvoorkeur (duur: 1 jaar)',
          de: 'izzico_lang: Sprachpräferenz (Dauer: 1 Jahr)',
        },
        consent: {
          fr: 'izzico_cookie_consent : mémorisation du consentement cookies (durée : 1 an)',
          en: 'izzico_cookie_consent: cookie consent memory (duration: 1 year)',
          nl: 'izzico_cookie_consent: cookie toestemmingsgeheugen (duur: 1 jaar)',
          de: 'izzico_cookie_consent: Cookie-Einwilligungsspeicher (Dauer: 1 Jahr)',
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
          fr: '5. Gestion de tes Cookies',
          en: '5. Managing Your Cookies',
          nl: '5. Uw Cookies Beheren',
          de: '5. Verwaltung Ihrer Cookies',
        },
        content: {
          fr: 'Tu peux gérer tes préférences de cookies de plusieurs façons :',
          en: 'You can manage your cookie preferences in several ways:',
          nl: 'U kunt uw cookievoorkeuren op verschillende manieren beheren:',
          de: 'Sie können Ihre Cookie-Einstellungen auf verschiedene Weise verwalten:',
        },
        banner: {
          fr: 'Via notre bannière de consentement lors de ta première visite',
          en: 'Via our consent banner on your first visit',
          nl: 'Via onze toestemmingsbanner bij uw eerste bezoek',
          de: 'Über unser Einwilligungsbanner bei Ihrem ersten Besuch',
        },
        settings: {
          fr: 'Dans tes paramètres de compte (section Confidentialité)',
          en: 'In your account settings (Privacy section)',
          nl: 'In uw accountinstellingen (Privacy-sectie)',
          de: 'In Ihren Kontoeinstellungen (Datenschutz-Bereich)',
        },
        browser: {
          fr: 'Dans les paramètres de ton navigateur',
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
          fr: 'Le refus de certains cookies peut impacter ton expérience :',
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
          fr: 'Cookies analytiques : nous ne pourrons pas améliorer le service basé sur ton utilisation',
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
          fr: 'Nous pouvons mettre à jour cette politique cookies pour refléter les changements dans nos pratiques ou pour des raisons légales. Nous t\'informerons de tout changement significatif.',
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

  // ============================================================================
  // DASHBOARD PAGES
  // ============================================================================
  dashboard: {
    // Searcher Dashboard
    searcher: {
      title: {
        fr: 'Tableau de Bord Chercheur',
        en: 'Searcher Dashboard',
        nl: 'Zoeker Dashboard',
        de: 'Suchenden-Dashboard',
      },
      header: {
        browse: {
          fr: 'Explorer',
          en: 'Browse',
          nl: 'Verkennen',
          de: 'Durchsuchen',
        },
        favorites: {
          fr: 'Favoris',
          en: 'Favorites',
          nl: 'Favorieten',
          de: 'Favoriten',
        },
        matches: {
          fr: 'Matchs',
          en: 'Matches',
          nl: 'Matches',
          de: 'Matches',
        },
        visits: {
          fr: 'Visites',
          en: 'Visits',
          nl: 'Bezoeken',
          de: 'Besuche',
        },
        applications: {
          fr: 'Candidatures',
          en: 'Applications',
          nl: 'Aanvragen',
          de: 'Bewerbungen',
        },
        groups: {
          fr: 'Groupes',
          en: 'Groups',
          nl: 'Groepen',
          de: 'Gruppen',
        },
        messages: {
          fr: 'Messages',
          en: 'Messages',
          nl: 'Berichten',
          de: 'Nachrichten',
        },
        profile: {
          fr: 'Profil',
          en: 'Profile',
          nl: 'Profiel',
          de: 'Profil',
        },
        settings: {
          fr: 'Paramètres',
          en: 'Settings',
          nl: 'Instellingen',
          de: 'Einstellungen',
        },
        logout: {
          fr: 'Déconnexion',
          en: 'Logout',
          nl: 'Uitloggen',
          de: 'Abmelden',
        },
      },
      welcome: {
        fr: 'Bienvenue,',
        en: 'Welcome back,',
        nl: 'Welkom terug,',
        de: 'Willkommen zurück,',
      },
      welcomeMessage: {
        fr: 'Prêt à trouver ton espace de co-living parfait ?',
        en: 'Ready to find your perfect coliving space?',
        nl: 'Klaar om je perfecte coliving ruimte te vinden?',
        de: 'Bereit, Ihren perfekten Coliving-Raum zu finden?',
      },
      loadingDashboard: {
        fr: 'Chargement de ton tableau de bord...',
        en: 'Loading your dashboard...',
        nl: 'Je dashboard laden...',
        de: 'Laden Ihres Dashboards...',
      },
      enhanceProfile: {
        fr: 'Améliorer le Profil',
        en: 'Enhance Profile',
        nl: 'Profiel Verbeteren',
        de: 'Profil Verbessern',
      },
      settings: {
        fr: 'Paramètres',
        en: 'Settings',
        nl: 'Instellingen',
        de: 'Einstellungen',
      },
      logout: {
        fr: 'Déconnexion',
        en: 'Logout',
        nl: 'Uitloggen',
        de: 'Abmelden',
      },
      logoutSuccess: {
        fr: 'Déconnexion réussie',
        en: 'Logged out successfully',
        nl: 'Succesvol uitgelogd',
        de: 'Erfolgreich abgemeldet',
      },
      profileCompletion: {
        fr: 'Complétion du Profil',
        en: 'Profile Completion',
        nl: 'Profiel Voltooiing',
        de: 'Profil-Vollständigkeit',
      },
      completionMessage: {
        fr: 'Complète ton Living Persona pour augmenter tes chances de trouver le Living Match parfait !',
        en: 'Complete your profile to increase your chances of finding the perfect match!',
        nl: 'Vul je profiel aan om je kansen te vergroten op het vinden van de perfecte match!',
        de: 'Vervollständigen Sie Ihr Profil, um Ihre Chancen auf den perfekten Match zu erhöhen!',
      },
      aboutMe: {
        fr: 'À Propos de Moi',
        en: 'About Me',
        nl: 'Over Mij',
        de: 'Über Mich',
      },
      yearsOld: {
        fr: 'ans',
        en: 'years old',
        nl: 'jaar oud',
        de: 'Jahre alt',
      },
      speaks: {
        fr: 'Parle :',
        en: 'Speaks:',
        nl: 'Spreekt:',
        de: 'Spricht:',
      },
      lifestyle: {
        fr: 'Style de Vie',
        en: 'Lifestyle',
        nl: 'Levensstijl',
        de: 'Lebensstil',
      },
      cleanliness: {
        fr: 'Propreté',
        en: 'Cleanliness',
        nl: 'Netheid',
        de: 'Sauberkeit',
      },
      introvert: {
        fr: 'Introverti',
        en: 'Introvert',
        nl: 'Introvert',
        de: 'Introvertiert',
      },
      extrovert: {
        fr: 'Extroverti',
        en: 'Extrovert',
        nl: 'Extravert',
        de: 'Extrovertiert',
      },
      ambivert: {
        fr: 'Ambivert',
        en: 'Ambivert',
        nl: 'Ambivert',
        de: 'Ambivertiert',
      },
      smoker: {
        fr: 'Fumeur',
        en: 'Smoker',
        nl: 'Roker',
        de: 'Raucher',
      },
      nonSmoker: {
        fr: 'Non-fumeur',
        en: 'Non-smoker',
        nl: 'Niet-roker',
        de: 'Nichtraucher',
      },
      exercise: {
        fr: 'Exercice',
        en: 'Exercise',
        nl: 'Oefening',
        de: 'Bewegung',
      },
      alcohol: {
        fr: 'Alcool',
        en: 'Alcohol',
        nl: 'Alcohol',
        de: 'Alkohol',
      },
      hobbies: {
        fr: 'Loisirs :',
        en: 'Hobbies:',
        nl: 'Hobby\'s:',
        de: 'Hobbys:',
      },
      dailyRoutine: {
        fr: 'Routine Quotidienne',
        en: 'Daily Routine',
        nl: 'Dagelijkse Routine',
        de: 'Tägliche Routine',
      },
      sleepSchedule: {
        fr: 'Horaire de Sommeil',
        en: 'Sleep Schedule',
        nl: 'Slaapschema',
        de: 'Schlafrhythmus',
      },
      workSchedule: {
        fr: 'Horaire de Travail',
        en: 'Work Schedule',
        nl: 'Werkrooster',
        de: 'Arbeitszeiten',
      },
      workFromHome: {
        fr: 'Télétravail',
        en: 'Work from Home',
        nl: 'Thuiswerken',
        de: 'Home Office',
      },
      yes: {
        fr: 'Oui',
        en: 'Yes',
        nl: 'Ja',
        de: 'Ja',
      },
      no: {
        fr: 'Non',
        en: 'No',
        nl: 'Nee',
        de: 'Nein',
      },
      lookingFor: {
        fr: 'Recherche',
        en: 'Looking For',
        nl: 'Op Zoek Naar',
        de: 'Suche',
      },
      colivingSize: {
        fr: 'Taille de co-living :',
        en: 'Coliving size:',
        nl: 'Coliving grootte:',
        de: 'Coliving-Größe:',
      },
      genderPreference: {
        fr: 'Préférence de genre :',
        en: 'Gender preference:',
        nl: 'Gendervoorkeur:',
        de: 'Geschlechtspräferenz:',
      },
      roommatesAged: {
        fr: 'Résidents âgés de',
        en: 'Roommates aged',
        nl: 'Huisgenoten van',
        de: 'Mitbewohner im Alter von',
      },
      budget: {
        fr: 'Budget :',
        en: 'Budget:',
        nl: 'Budget:',
        de: 'Budget:',
      },
      perMonth: {
        fr: '/mois',
        en: '/month',
        nl: '/maand',
        de: '/Monat',
      },
      moveIn: {
        fr: 'Emménagement :',
        en: 'Move-in:',
        nl: 'Intrek:',
        de: 'Einzug:',
      },
      stayDuration: {
        fr: 'Durée de séjour :',
        en: 'Stay duration:',
        nl: 'Verblijfsduur:',
        de: 'Aufenthaltsdauer:',
      },
      roomTypes: {
        fr: 'Types de chambre :',
        en: 'Room types:',
        nl: 'Kamertypes:',
        de: 'Zimmertypen:',
      },
      cities: {
        fr: 'Villes :',
        en: 'Cities:',
        nl: 'Steden:',
        de: 'Städte:',
      },
      profileStatus: {
        fr: 'Statut du Profil',
        en: 'Profile Status',
        nl: 'Profielstatus',
        de: 'Profilstatus',
      },
      complete: {
        fr: 'Complet',
        en: 'Complete',
        nl: 'Volledig',
        de: 'Vollständig',
      },
      incomplete: {
        fr: 'Incomplet',
        en: 'Incomplete',
        nl: 'Onvolledig',
        de: 'Unvollständig',
      },
      browseProperties: {
        fr: 'Parcourir les Propriétés',
        en: 'Browse Properties',
        nl: 'Eigenschappen Doorbladeren',
        de: 'Immobilien Durchsuchen',
      },
      findPerfectMatch: {
        fr: 'Trouve ton Living Match parfait',
        en: 'Find your perfect match',
        nl: 'Vind je perfecte match',
        de: 'Finden Sie Ihr perfektes Match',
      },
      favorites: {
        fr: 'Favoris',
        en: 'Favorites',
        nl: 'Favorieten',
        de: 'Favoriten',
      },
      viewSavedProperties: {
        fr: 'Voir les propriétés sauvegardées',
        en: 'View saved properties',
        nl: 'Bekijk opgeslagen eigenschappen',
        de: 'Gespeicherte Immobilien anzeigen',
      },
      accountSettings: {
        fr: 'Paramètres du Compte',
        en: 'Account Settings',
        nl: 'Account Instellingen',
        de: 'Kontoeinstellungen',
      },
      updatePreferences: {
        fr: 'Mettre à jour les préférences',
        en: 'Update preferences',
        nl: 'Voorkeuren bijwerken',
        de: 'Präferenzen aktualisieren',
      },
      yourMatches: {
        fr: 'Vos Matchs',
        en: 'Your Matches',
        nl: 'Je Matches',
        de: 'Ihre Matches',
      },
      noMatchesYet: {
        fr: 'Pas encore de matchs',
        en: 'No matches yet',
        nl: 'Nog geen matches',
        de: 'Noch keine Matches',
      },
      startBrowsing: {
        fr: 'Commencez à parcourir les propriétés pour trouver ton espace de co-living parfait',
        en: 'Start browsing properties to find your perfect coliving space',
        nl: 'Begin met het doorbladeren van eigenschappen om je perfecte coliving ruimte te vinden',
        de: 'Beginnen Sie mit dem Durchsuchen von Immobilien, um Ihren perfekten Coliving-Raum zu finden',
      },
      startSearching: {
        fr: 'Commencer la Recherche',
        en: 'Start Searching',
        nl: 'Begin met Zoeken',
        de: 'Suche Starten',
      },
      editProfile: {
        fr: 'Modifier le Profil',
        en: 'Edit Profile',
        nl: 'Profiel Bewerken',
        de: 'Profil Bearbeiten',
      },
      locationNotSet: {
        fr: 'Lieu non défini',
        en: 'Location not set',
        nl: 'Locatie niet ingesteld',
        de: 'Standort nicht festgelegt',
      },
      // ModernSearcherDashboard translations
      hiUser: {
        fr: 'Salut,',
        en: 'Hi,',
        nl: 'Hallo,',
        de: 'Hallo,',
      },
      configureSearch: {
        fr: 'Configure ta recherche',
        en: 'Configure your search',
        nl: 'Configureer je zoekopdracht',
        de: 'Konfiguriere deine Suche',
      },
      groups: {
        fr: 'Groupes',
        en: 'Groups',
        nl: 'Groepen',
        de: 'Gruppen',
      },
      messages: {
        fr: 'Messages',
        en: 'Messages',
        nl: 'Berichten',
        de: 'Nachrichten',
      },
      profileLabel: {
        fr: 'Profil',
        en: 'Profile',
        nl: 'Profiel',
        de: 'Profil',
      },
      unread: {
        fr: 'Non lus',
        en: 'Unread',
        nl: 'Ongelezen',
        de: 'Ungelesen',
      },
      allRead: {
        fr: 'Tous lus',
        en: 'All read',
        nl: 'Alles gelezen',
        de: 'Alle gelesen',
      },
      savedProperties: {
        fr: 'Propriétés sauvegardées',
        en: 'Saved properties',
        nl: 'Opgeslagen eigenschappen',
        de: 'Gespeicherte Immobilien',
      },
      topMatches: {
        fr: 'Top Matchs',
        en: 'Top Matches',
        nl: 'Beste Matches',
        de: 'Top-Matches',
      },
      compatibilityOver70: {
        fr: 'Compatibilité > 70%',
        en: 'Compatibility > 70%',
        nl: 'Compatibiliteit > 70%',
        de: 'Kompatibilität > 70%',
      },
      applications: {
        fr: 'Candidatures',
        en: 'Applications',
        nl: 'Aanvragen',
        de: 'Bewerbungen',
      },
      pending: {
        fr: 'En attente',
        en: 'Pending',
        nl: 'In afwachting',
        de: 'Ausstehend',
      },
      profileCompletionTitle: {
        fr: 'Complétion du profil',
        en: 'Profile completion',
        nl: 'Profiel voltooiing',
        de: 'Profilvervollständigung',
      },
      profileExcellent: {
        fr: 'Excellent ! Profil presque complet',
        en: 'Excellent! Profile almost complete',
        nl: 'Uitstekend! Profiel bijna compleet',
        de: 'Ausgezeichnet! Profil fast vollständig',
      },
      completeProfileForBetterMatches: {
        fr: 'Complète ton profil pour de meilleurs matchs',
        en: 'Complete your profile for better matches',
        nl: 'Voltooi je profiel voor betere matches',
        de: 'Vervollständige dein Profil für bessere Matches',
      },
      completeMyProfile: {
        fr: 'Compléter mon Living Persona',
        en: 'Complete my profile',
        nl: 'Mijn profiel voltooien',
        de: 'Mein Profil vervollständigen',
      },
      topMatchesTitle: {
        fr: 'Top Matchs',
        en: 'Top Matches',
        nl: 'Beste Matches',
        de: 'Top-Matches',
      },
      viewAllMatches: {
        fr: 'Voir tous les matchs',
        en: 'View all matches',
        nl: 'Bekijk alle matches',
        de: 'Alle Matches anzeigen',
      },
      noTopMatchesYet: {
        fr: 'Pas encore de top matchs',
        en: 'No top matches yet',
        nl: 'Nog geen top matches',
        de: 'Noch keine Top-Matches',
      },
      completeProfileForMatches: {
        fr: 'Complète ton profil pour découvrir les co-livings qui te correspondent le mieux !',
        en: 'Complete your profile to discover flatshares that match you best!',
        nl: 'Voltooi je profiel om flatshares te ontdekken die het beste bij je passen!',
        de: 'Vervollständige dein Profil, um WGs zu entdecken, die am besten zu dir passen!',
      },
      savedSearches: {
        fr: 'Recherches Sauvegardées',
        en: 'Saved Searches',
        nl: 'Opgeslagen Zoekopdrachten',
        de: 'Gespeicherte Suchen',
      },
      seeAll: {
        fr: 'Voir tout',
        en: 'See all',
        nl: 'Alles zien',
        de: 'Alle anzeigen',
      },
      newSearch: {
        fr: 'Nouvelle recherche',
        en: 'New search',
        nl: 'Nieuwe zoekopdracht',
        de: 'Neue Suche',
      },
      noSavedSearches: {
        fr: 'Aucune recherche sauvegardée',
        en: 'No saved searches',
        nl: 'Geen opgeslagen zoekopdrachten',
        de: 'Keine gespeicherten Suchen',
      },
      setUpAlert: {
        fr: 'Configurez une alerte pour être notifié des nouvelles propriétés correspondant à tes critères.',
        en: 'Set up an alert to be notified of new properties matching your criteria.',
        nl: 'Stel een melding in om op de hoogte te worden gehouden van nieuwe eigenschappen die aan je criteria voldoen.',
        de: 'Richte eine Benachrichtigung ein, um über neue Immobilien informiert zu werden, die deinen Kriterien entsprechen.',
      },
      recentActivity: {
        fr: 'Activité Récente',
        en: 'Recent Activity',
        nl: 'Recente Activiteit',
        de: 'Letzte Aktivität',
      },
      viewAll: {
        fr: 'Voir tout',
        en: 'View all',
        nl: 'Alles bekijken',
        de: 'Alle anzeigen',
      },
      noRecentActivity: {
        fr: 'Aucune activité récente',
        en: 'No recent activity',
        nl: 'Geen recente activiteit',
        de: 'Keine aktuelle Aktivität',
      },
      notificationsWillAppear: {
        fr: 'Tes notifications apparaîtront ici : nouveaux messages, propriétés correspondant à tes critères, et plus encore.',
        en: 'Your notifications will appear here: new messages, properties matching your criteria, and more.',
        nl: 'Je meldingen verschijnen hier: nieuwe berichten, eigenschappen die aan je criteria voldoen, en meer.',
        de: 'Deine Benachrichtigungen erscheinen hier: neue Nachrichten, Immobilien die deinen Kriterien entsprechen, und mehr.',
      },
      tipsToStart: {
        fr: 'Conseils pour commencer :',
        en: 'Tips to get started:',
        nl: 'Tips om te beginnen:',
        de: 'Tipps zum Starten:',
      },
      tipCompleteProfile: {
        fr: 'Complète ton profil pour améliorer tes matchs',
        en: 'Complete your profile to improve your matches',
        nl: 'Voltooi je profiel om je matches te verbeteren',
        de: 'Vervollständige dein Profil, um deine Matches zu verbessern',
      },
      tipSaveSearch: {
        fr: 'Sauvegarde une recherche pour recevoir des alertes',
        en: 'Save a search to receive alerts',
        nl: 'Sla een zoekopdracht op om meldingen te ontvangen',
        de: 'Speichere eine Suche, um Benachrichtigungen zu erhalten',
      },
      continueSearch: {
        fr: 'Continue ta recherche',
        en: 'Continue your search',
        nl: 'Ga verder met zoeken',
        de: 'Setze deine Suche fort',
      },
      discoverMoreProperties: {
        fr: 'Découvre plus de propriétés qui correspondent à tes critères et augmente tes chances de trouver le lieu idéal',
        en: 'Discover more properties that match your criteria and increase your chances of finding the ideal place',
        nl: 'Ontdek meer eigenschappen die aan je criteria voldoen en vergroot je kansen om de ideale plek te vinden',
        de: 'Entdecke mehr Immobilien, die deinen Kriterien entsprechen, und erhöhe deine Chancen, den idealen Ort zu finden',
      },
      exploreProperties: {
        fr: 'Explorer les propriétés',
        en: 'Explore properties',
        nl: 'Eigenschappen verkennen',
        de: 'Immobilien erkunden',
      },
      smartFilters: {
        fr: 'Filtres intelligents',
        en: 'Smart filters',
        nl: 'Slimme filters',
        de: 'Intelligente Filter',
      },
      searches: {
        fr: 'Recherches',
        en: 'Searches',
        nl: 'Zoekopdrachten',
        de: 'Suchen',
      },
      compare: {
        fr: 'Comparer',
        en: 'Compare',
        nl: 'Vergelijken',
        de: 'Vergleichen',
      },
      maxCompareWarning: {
        fr: 'Tu peux comparer jusqu\'à 4 propriétés maximum',
        en: 'You can compare up to 4 properties maximum',
        nl: 'Je kunt maximaal 4 eigenschappen vergelijken',
        de: 'Sie können maximal 4 Immobilien vergleichen',
      },
      recently: {
        fr: 'Récemment',
        en: 'Recently',
        nl: 'Recent',
        de: 'Kürzlich',
      },
      minutesAgo: {
        fr: 'Il y a {count} min',
        en: '{count} min ago',
        nl: '{count} min geleden',
        de: 'vor {count} Min.',
      },
      hoursAgo: {
        fr: 'Il y a {count}h',
        en: '{count}h ago',
        nl: '{count}u geleden',
        de: 'vor {count}h',
      },
      yesterday: {
        fr: 'Hier',
        en: 'Yesterday',
        nl: 'Gisteren',
        de: 'Gestern',
      },
      daysAgo: {
        fr: 'Il y a {count}j',
        en: '{count}d ago',
        nl: '{count}d geleden',
        de: 'vor {count}T',
      },
      onboarding: {
        welcome: {
          title: {
            fr: 'Hello ! Bienvenue sur Izzico',
            en: 'Hello! Welcome to Izzico',
            nl: 'Hallo! Welkom bij Izzico',
            de: 'Hallo! Willkommen bei Izzico',
          },
          description: {
            fr: 'Voici ton tableau de bord. Tu y trouveras un résumé de ton activité : messages, favoris, matchs et candidatures.',
            en: 'Here is your dashboard. You\'ll find a summary of your activity: messages, favorites, matches, and applications.',
            nl: 'Hier is je dashboard. Je vindt een overzicht van je activiteit: berichten, favorieten, matches en aanvragen.',
            de: 'Hier ist dein Dashboard. Du findest eine Zusammenfassung deiner Aktivitäten: Nachrichten, Favoriten, Matches und Bewerbungen.',
          },
        },
        profile: {
          title: {
            fr: 'Complète ton profil',
            en: 'Complete your profile',
            nl: 'Voltooi je profiel',
            de: 'Vervollständige dein Profil',
          },
          description: {
            fr: 'Un profil complet améliore tes chances de matcher avec les bonnes co-livings. Plus tu renseignes d\'infos, meilleurs seront tes matchs !',
            en: 'A complete profile improves your chances of matching with the right flatshares. The more info you provide, the better your matches!',
            nl: 'Een compleet profiel vergroot je kansen om te matchen met de juiste flatshares. Hoe meer info je geeft, hoe beter je matches!',
            de: 'Ein vollständiges Profil verbessert deine Chancen, mit den richtigen WGs zu matchen. Je mehr Infos du angibst, desto besser deine Matches!',
          },
        },
        browse: {
          title: {
            fr: 'Explore les propriétés',
            en: 'Explore properties',
            nl: 'Verken eigenschappen',
            de: 'Erkunde Immobilien',
          },
          description: {
            fr: 'Parcours les co-livings disponibles et trouve celle qui te correspond. Tu peux filtrer par ville, budget et date d\'emménagement.',
            en: 'Browse available flatshares and find the one that suits you. You can filter by city, budget, and move-in date.',
            nl: 'Blader door beschikbare flatshares en vind degene die bij je past. Je kunt filteren op stad, budget en verhuisdatum.',
            de: 'Durchstöbere verfügbare WGs und finde die, die zu dir passt. Du kannst nach Stadt, Budget und Einzugsdatum filtern.',
          },
        },
        savedSearches: {
          title: {
            fr: 'Sauvegarde tes recherches',
            en: 'Save your searches',
            nl: 'Bewaar je zoekopdrachten',
            de: 'Speichere deine Suchen',
          },
          description: {
            fr: 'Crée des alertes pour être notifié dès qu\'une nouvelle co-living correspond à tes critères. Plus besoin de chercher tous les jours !',
            en: 'Create alerts to be notified when a new flatshare matches your criteria. No need to search every day!',
            nl: 'Maak meldingen aan om op de hoogte te worden gehouden wanneer een nieuwe flatshare aan je criteria voldoet. Niet meer elke dag zoeken!',
            de: 'Erstelle Benachrichtigungen, um informiert zu werden, wenn eine neue WG deinen Kriterien entspricht. Nicht mehr jeden Tag suchen!',
          },
        },
      },
    },

    // Owner Dashboard
    owner: {
      title: {
        fr: 'Tableau de Bord Propriétaire',
        en: 'Owner Dashboard',
        nl: 'Eigenaar Dashboard',
        de: 'Eigentümer-Dashboard',
      },
      welcome: {
        fr: 'Bienvenue,',
        en: 'Welcome back,',
        nl: 'Welkom terug,',
        de: 'Willkommen zurück,',
      },
      welcomeMessage: {
        fr: 'Gère tes propriétés et les candidatures de résidents ici.',
        en: 'Manage your properties and tenant applications from here.',
        nl: 'Beheer je eigenschappen en huurders aanvragen vanaf hier.',
        de: 'Verwalten Sie Ihre Immobilien und Mietergesuche von hier aus.',
      },
      propertyOwnerProfile: {
        fr: 'Profil de Propriétaire',
        en: 'Property Owner Profile',
        nl: 'Eigenaar Profiel',
        de: 'Immobilieneigentümer-Profil',
      },
      completionMessage: {
        fr: 'Complète ton profil pour instaurer la confiance avec les résidents potentiels !',
        en: 'Complete your profile to build trust with potential tenants!',
        nl: 'Vul je profiel aan om vertrouwen op te bouwen met potentiële huurders!',
        de: 'Vervollständigen Sie Ihr Profil, um Vertrauen bei potenziellen Mietern aufzubauen!',
      },
      ownerInfo: {
        fr: 'Informations du Propriétaire',
        en: 'Owner Information',
        nl: 'Eigenaar Informatie',
        de: 'Eigentümer-Informationen',
      },
      type: {
        fr: 'Type :',
        en: 'Type:',
        nl: 'Type:',
        de: 'Typ:',
      },
      ownerType: {
        fr: 'Type de propriétaire :',
        en: 'Owner Type:',
        nl: 'Eigenaar Type:',
        de: 'Eigentümertyp:',
      },
      company: {
        fr: 'Société :',
        en: 'Company:',
        nl: 'Bedrijf:',
        de: 'Firma:',
      },
      phone: {
        fr: 'Téléphone :',
        en: 'Phone:',
        nl: 'Telefoon:',
        de: 'Telefon:',
      },
      experience: {
        fr: 'Expérience :',
        en: 'Experience:',
        nl: 'Ervaring:',
        de: 'Erfahrung:',
      },
      email: {
        fr: 'Email :',
        en: 'Email:',
        nl: 'E-mail:',
        de: 'E-Mail:',
      },
      propertyDetails: {
        fr: 'Détails de la Propriété',
        en: 'Property Details',
        nl: 'Eigendom Details',
        de: 'Immobiliendetails',
      },
      propertyAvailable: {
        fr: 'Propriété Disponible',
        en: 'Property Available',
        nl: 'Eigendom Beschikbaar',
        de: 'Immobilie Verfügbar',
      },
      managementStyle: {
        fr: 'Style de Gestion',
        en: 'Management Style',
        nl: 'Beheersstijl',
        de: 'Verwaltungsstil',
      },
      yearsOfExperience: {
        fr: 'Années d\'Expérience',
        en: 'Years of Experience',
        nl: 'Jaren Ervaring',
        de: 'Jahre Erfahrung',
      },
      years: {
        fr: 'ans',
        en: 'years',
        nl: 'jaar',
        de: 'Jahre',
      },
      managementType: {
        fr: 'Type de Gestion',
        en: 'Management Type',
        nl: 'Beheer Type',
        de: 'Verwaltungstyp',
      },
      about: {
        fr: 'À Propos',
        en: 'About',
        nl: 'Over',
        de: 'Über',
      },
      paymentInfo: {
        fr: 'Informations de Paiement',
        en: 'Payment Information',
        nl: 'Betalingsinformatie',
        de: 'Zahlungsinformationen',
      },
      bankingDetailsConfigured: {
        fr: 'Coordonnées bancaires configurées',
        en: 'Banking details configured',
        nl: 'Bankgegevens geconfigureerd',
        de: 'Bankverbindung konfiguriert',
      },
      myProperties: {
        fr: 'Mes Propriétés',
        en: 'My Properties',
        nl: 'Mijn Eigendommen',
        de: 'Meine Immobilien',
      },
      addProperty: {
        fr: 'Ajouter une Propriété',
        en: 'Add Property',
        nl: 'Eigendom Toevoegen',
        de: 'Immobilie Hinzufügen',
      },
      noPropertiesYet: {
        fr: 'Pas encore de propriétés',
        en: 'No properties yet',
        nl: 'Nog geen eigendommen',
        de: 'Noch keine Immobilien',
      },
      addFirstProperty: {
        fr: 'Ajoute ta première propriété pour commencer à recevoir des candidatures de résidents',
        en: 'Add your first property to start receiving tenant applications',
        nl: 'Voeg je eerste eigendom toe om huurders aanvragen te ontvangen',
        de: 'Fügen Sie Ihre erste Immobilie hinzu, um Mietergesuche zu erhalten',
      },
      addYourFirstProperty: {
        fr: 'Ajouter Votre Première Propriété',
        en: 'Add Your First Property',
        nl: 'Voeg Je Eerste Eigendom Toe',
        de: 'Ihre Erste Immobilie Hinzufügen',
      },
      bed: {
        fr: 'lit',
        en: 'bed',
        nl: 'bed',
        de: 'Bett',
      },
      beds: {
        fr: 'lits',
        en: 'beds',
        nl: 'bedden',
        de: 'Betten',
      },
      bath: {
        fr: 'sdb',
        en: 'bath',
        nl: 'bad',
        de: 'Bad',
      },
      baths: {
        fr: 'sdbs',
        en: 'baths',
        nl: 'badkamers',
        de: 'Bäder',
      },
      viewDetails: {
        fr: 'Voir les Détails',
        en: 'View Details',
        nl: 'Bekijk Details',
        de: 'Details Anzeigen',
      },
      manageProperties: {
        fr: 'Gérer les Propriétés',
        en: 'Manage Properties',
        nl: 'Eigendommen Beheren',
        de: 'Immobilien Verwalten',
      },
      viewEditListings: {
        fr: 'Voir et modifier tes résidences',
        en: 'View and edit your listings',
        nl: 'Bekijk en bewerk je advertenties',
        de: 'Ihre Anzeigen ansehen und bearbeiten',
      },
      applications: {
        fr: 'Candidatures',
        en: 'Applications',
        nl: 'Aanvragen',
        de: 'Bewerbungen',
      },
      reviewTenantRequests: {
        fr: 'Examiner les demandes de résidents',
        en: 'Review tenant requests',
        nl: 'Beoordeel huurders verzoeken',
        de: 'Mietergesuche prüfen',
      },
      updateYourPreferences: {
        fr: 'Mettez à jour tes préférences',
        en: 'Update your preferences',
        nl: 'Werk je voorkeuren bij',
        de: 'Aktualisieren Sie Ihre Präferenzen',
      },
      properties: {
        fr: 'Propriétés',
        en: 'Properties',
        nl: 'Eigendommen',
        de: 'Immobilien',
      },
      activeListings: {
        fr: 'Résidences Actives',
        en: 'Active Listings',
        nl: 'Actieve Advertenties',
        de: 'Aktive Anzeigen',
      },
      individualOwner: {
        fr: 'Propriétaire Individuel',
        en: 'Individual Property Owner',
        nl: 'Individuele Eigenaar',
        de: 'Einzelner Immobilieneigentümer',
      },
      realEstateAgency: {
        fr: 'Agence Immobilière',
        en: 'Real Estate Agency',
        nl: 'Vastgoedkantoor',
        de: 'Immobilienagentur',
      },
      propertyManagementCompany: {
        fr: 'Société de Gestion Immobilière',
        en: 'Property Management Company',
        nl: 'Vastgoedbeheer Bedrijf',
        de: 'Immobilienverwaltungsgesellschaft',
      },
      propertyOwner: {
        fr: 'Propriétaire',
        en: 'Property Owner',
        nl: 'Eigenaar',
        de: 'Immobilieneigentümer',
      },

      // ============================================
      // PROPERTIES PAGE - app/dashboard/owner/properties
      // ============================================
      propertiesPage: {
        loading: {
          title: {
            fr: 'Chargement des propriétés...',
            en: 'Loading properties...',
            nl: 'Eigenschappen laden...',
            de: 'Immobilien werden geladen...',
          },
          subtitle: {
            fr: 'Préparation de tes résidences',
            en: 'Preparing your listings',
            nl: 'Je advertenties voorbereiden',
            de: 'Ihre Anzeigen werden vorbereitet',
          },
        },
        header: {
          title: {
            fr: 'Mes Propriétés',
            en: 'My Properties',
            nl: 'Mijn Eigendommen',
            de: 'Meine Immobilien',
          },
          subtitle: {
            fr: 'Gérer et suivre toutes tes résidences immobilières',
            en: 'Manage and track all your property listings',
            nl: 'Beheer en volg al je vastgoedadvertenties',
            de: 'Verwalten und verfolgen Sie alle Ihre Immobilienanzeigen',
          },
          addButton: {
            fr: 'Ajouter',
            en: 'Add',
            nl: 'Toevoegen',
            de: 'Hinzufügen',
          },
        },
        stats: {
          total: {
            fr: 'Total',
            en: 'Total',
            nl: 'Totaal',
            de: 'Gesamt',
          },
          published: {
            fr: 'Publiées',
            en: 'Published',
            nl: 'Gepubliceerd',
            de: 'Veröffentlicht',
          },
          drafts: {
            fr: 'Brouillons',
            en: 'Drafts',
            nl: 'Concepten',
            de: 'Entwürfe',
          },
          archived: {
            fr: 'Archivées',
            en: 'Archived',
            nl: 'Gearchiveerd',
            de: 'Archiviert',
          },
        },
        filters: {
          all: {
            fr: 'Toutes',
            en: 'All',
            nl: 'Alle',
            de: 'Alle',
          },
          published: {
            fr: 'Publiées',
            en: 'Published',
            nl: 'Gepubliceerd',
            de: 'Veröffentlicht',
          },
          drafts: {
            fr: 'Brouillons',
            en: 'Drafts',
            nl: 'Concepten',
            de: 'Entwürfe',
          },
          archived: {
            fr: 'Archivées',
            en: 'Archived',
            nl: 'Gearchiveerd',
            de: 'Archiviert',
          },
        },
        status: {
          published: {
            fr: 'Publié',
            en: 'Published',
            nl: 'Gepubliceerd',
            de: 'Veröffentlicht',
          },
          draft: {
            fr: 'Brouillon',
            en: 'Draft',
            nl: 'Concept',
            de: 'Entwurf',
          },
          archived: {
            fr: 'Archivé',
            en: 'Archived',
            nl: 'Gearchiveerd',
            de: 'Archiviert',
          },
        },
        empty: {
          noProperties: {
            fr: 'Aucune propriété',
            en: 'No properties',
            nl: 'Geen eigendommen',
            de: 'Keine Immobilien',
          },
          noPublished: {
            fr: 'Aucune propriété publiée',
            en: 'No published properties',
            nl: 'Geen gepubliceerde eigendommen',
            de: 'Keine veröffentlichten Immobilien',
          },
          noDraft: {
            fr: 'Aucune propriété en brouillon',
            en: 'No draft properties',
            nl: 'Geen concepteigendommen',
            de: 'Keine Entwurfsimmobilien',
          },
          noArchived: {
            fr: 'Aucune propriété archivée',
            en: 'No archived properties',
            nl: 'Geen gearchiveerde eigendommen',
            de: 'Keine archivierten Immobilien',
          },
          addFirst: {
            fr: 'Ajoute ta première propriété pour commencer à gérer ton portefeuille',
            en: 'Add your first property to start managing your portfolio',
            nl: 'Voeg je eerste eigendom toe om je portfolio te beheren',
            de: 'Fügen Sie Ihre erste Immobilie hinzu, um Ihr Portfolio zu verwalten',
          },
          changeFilters: {
            fr: 'Modifier tes filtres pour voir plus de propriétés',
            en: 'Change your filters to see more properties',
            nl: 'Wijzig je filters om meer eigendommen te zien',
            de: 'Ändern Sie Ihre Filter, um mehr Immobilien zu sehen',
          },
          addFirstButton: {
            fr: 'Ajouter ma première propriété',
            en: 'Add my first property',
            nl: 'Mijn eerste eigendom toevoegen',
            de: 'Meine erste Immobilie hinzufügen',
          },
        },
        card: {
          bedroom: {
            fr: 'chambre',
            en: 'bedroom',
            nl: 'slaapkamer',
            de: 'Schlafzimmer',
          },
          bedrooms: {
            fr: 'chambres',
            en: 'bedrooms',
            nl: 'slaapkamers',
            de: 'Schlafzimmer',
          },
          bathroom: {
            fr: 'SDB',
            en: 'bath',
            nl: 'badkamer',
            de: 'Bad',
          },
          perMonth: {
            fr: '€/mois',
            en: '€/month',
            nl: '€/maand',
            de: '€/Monat',
          },
        },
        actions: {
          view: {
            fr: 'Voir',
            en: 'View',
            nl: 'Bekijken',
            de: 'Ansehen',
          },
          edit: {
            fr: 'Modifier',
            en: 'Edit',
            nl: 'Bewerken',
            de: 'Bearbeiten',
          },
          publish: {
            fr: 'Publier',
            en: 'Publish',
            nl: 'Publiceren',
            de: 'Veröffentlichen',
          },
          unpublish: {
            fr: 'Dépublier',
            en: 'Unpublish',
            nl: 'Depubliceren',
            de: 'Nicht mehr veröffentlichen',
          },
          delete: {
            fr: 'Supprimer',
            en: 'Delete',
            nl: 'Verwijderen',
            de: 'Löschen',
          },
        },
        deleteModal: {
          title: {
            fr: 'Supprimer la propriété ?',
            en: 'Delete property?',
            nl: 'Eigendom verwijderen?',
            de: 'Immobilie löschen?',
          },
          confirm: {
            fr: 'Es-tu sûr de vouloir supprimer',
            en: 'Are you sure you want to delete',
            nl: 'Weet je zeker dat je wilt verwijderen',
            de: 'Sind Sie sicher, dass Sie löschen möchten',
          },
          irreversible: {
            fr: 'Cette action est irréversible.',
            en: 'This action cannot be undone.',
            nl: 'Deze actie kan niet ongedaan worden gemaakt.',
            de: 'Diese Aktion kann nicht rückgängig gemacht werden.',
          },
          cancel: {
            fr: 'Annuler',
            en: 'Cancel',
            nl: 'Annuleren',
            de: 'Abbrechen',
          },
          delete: {
            fr: 'Supprimer',
            en: 'Delete',
            nl: 'Verwijderen',
            de: 'Löschen',
          },
        },
        toast: {
          loadError: {
            fr: 'Erreur lors du chargement',
            en: 'Error loading data',
            nl: 'Fout bij het laden',
            de: 'Fehler beim Laden',
          },
          deleteSuccess: {
            fr: 'Propriété supprimée',
            en: 'Property deleted',
            nl: 'Eigendom verwijderd',
            de: 'Immobilie gelöscht',
          },
          deleteError: {
            fr: 'Erreur lors de la suppression',
            en: 'Error deleting property',
            nl: 'Fout bij het verwijderen',
            de: 'Fehler beim Löschen',
          },
          publishSuccess: {
            fr: 'Propriété publiée',
            en: 'Property published',
            nl: 'Eigendom gepubliceerd',
            de: 'Immobilie veröffentlicht',
          },
          unpublishSuccess: {
            fr: 'Propriété dépubliée',
            en: 'Property unpublished',
            nl: 'Eigendom gedepubliceerd',
            de: 'Immobilie nicht mehr veröffentlicht',
          },
          updateError: {
            fr: 'Erreur lors de la mise à jour',
            en: 'Error updating property',
            nl: 'Fout bij het bijwerken',
            de: 'Fehler beim Aktualisieren',
          },
        },
      },

      // ============================================
      // APPLICATIONS PAGE - app/dashboard/owner/applications
      // ============================================
      applicationsPage: {
        loading: {
          title: {
            fr: 'Chargement des candidatures...',
            en: 'Loading applications...',
            nl: 'Aanvragen laden...',
            de: 'Bewerbungen werden geladen...',
          },
          subtitle: {
            fr: 'Préparation de tes données',
            en: 'Preparing your data',
            nl: 'Je gegevens voorbereiden',
            de: 'Ihre Daten werden vorbereitet',
          },
        },
        header: {
          title: {
            fr: 'Candidatures',
            en: 'Applications',
            nl: 'Aanvragen',
            de: 'Bewerbungen',
          },
          subtitle: {
            fr: 'Gérer les candidatures individuelles et de groupe pour tes propriétés',
            en: 'Manage individual and group applications for your properties',
            nl: 'Beheer individuele en groepsaanvragen voor je eigendommen',
            de: 'Verwalten Sie Einzel- und Gruppenbewerbungen für Ihre Immobilien',
          },
        },
        stats: {
          total: {
            fr: 'Total',
            en: 'Total',
            nl: 'Totaal',
            de: 'Gesamt',
          },
          individual: {
            fr: 'Individuel',
            en: 'Individual',
            nl: 'Individueel',
            de: 'Einzeln',
          },
          groups: {
            fr: 'Groupes',
            en: 'Groups',
            nl: 'Groepen',
            de: 'Gruppen',
          },
          pending: {
            fr: 'En attente',
            en: 'Pending',
            nl: 'In afwachting',
            de: 'Ausstehend',
          },
          reviewing: {
            fr: 'En révision',
            en: 'Reviewing',
            nl: 'In beoordeling',
            de: 'In Prüfung',
          },
          approved: {
            fr: 'Approuvées',
            en: 'Approved',
            nl: 'Goedgekeurd',
            de: 'Genehmigt',
          },
          rejected: {
            fr: 'Rejetées',
            en: 'Rejected',
            nl: 'Afgewezen',
            de: 'Abgelehnt',
          },
        },
        filters: {
          allTypes: {
            fr: 'Tous les types',
            en: 'All types',
            nl: 'Alle types',
            de: 'Alle Typen',
          },
          individual: {
            fr: 'Individuel',
            en: 'Individual',
            nl: 'Individueel',
            de: 'Einzeln',
          },
          groups: {
            fr: 'Groupes',
            en: 'Groups',
            nl: 'Groepen',
            de: 'Gruppen',
          },
          allStatuses: {
            fr: 'Tous les statuts',
            en: 'All statuses',
            nl: 'Alle statussen',
            de: 'Alle Status',
          },
          pending: {
            fr: 'En attente',
            en: 'Pending',
            nl: 'In afwachting',
            de: 'Ausstehend',
          },
          reviewing: {
            fr: 'En révision',
            en: 'Reviewing',
            nl: 'In beoordeling',
            de: 'In Prüfung',
          },
          approved: {
            fr: 'Approuvées',
            en: 'Approved',
            nl: 'Goedgekeurd',
            de: 'Genehmigt',
          },
          rejected: {
            fr: 'Rejetées',
            en: 'Rejected',
            nl: 'Afgewezen',
            de: 'Abgelehnt',
          },
          allProperties: {
            fr: 'Toutes les propriétés',
            en: 'All properties',
            nl: 'Alle eigendommen',
            de: 'Alle Immobilien',
          },
        },
        status: {
          pending: {
            fr: 'En attente',
            en: 'Pending',
            nl: 'In afwachting',
            de: 'Ausstehend',
          },
          reviewing: {
            fr: 'En révision',
            en: 'Reviewing',
            nl: 'In beoordeling',
            de: 'In Prüfung',
          },
          approved: {
            fr: 'Approuvée',
            en: 'Approved',
            nl: 'Goedgekeurd',
            de: 'Genehmigt',
          },
          rejected: {
            fr: 'Rejetée',
            en: 'Rejected',
            nl: 'Afgewezen',
            de: 'Abgelehnt',
          },
          withdrawn: {
            fr: 'Retirée',
            en: 'Withdrawn',
            nl: 'Ingetrokken',
            de: 'Zurückgezogen',
          },
          expired: {
            fr: 'Expirée',
            en: 'Expired',
            nl: 'Verlopen',
            de: 'Abgelaufen',
          },
        },
        empty: {
          title: {
            fr: 'Aucune candidature trouvée',
            en: 'No applications found',
            nl: 'Geen aanvragen gevonden',
            de: 'Keine Bewerbungen gefunden',
          },
          subtitle: {
            fr: 'Essayez de modifier tes filtres ou attendez de nouvelles candidatures',
            en: 'Try changing your filters or wait for new applications',
            nl: 'Probeer je filters te wijzigen of wacht op nieuwe aanvragen',
            de: 'Versuchen Sie, Ihre Filter zu ändern oder warten Sie auf neue Bewerbungen',
          },
        },
        card: {
          group: {
            fr: 'Groupe',
            en: 'Group',
            nl: 'Groep',
            de: 'Gruppe',
          },
          members: {
            fr: 'Membres',
            en: 'Members',
            nl: 'Leden',
            de: 'Mitglieder',
          },
          combinedIncome: {
            fr: 'Revenu combiné:',
            en: 'Combined income:',
            nl: 'Gecombineerd inkomen:',
            de: 'Kombiniertes Einkommen:',
          },
          message: {
            fr: 'Message :',
            en: 'Message:',
            nl: 'Bericht:',
            de: 'Nachricht:',
          },
          appliedOn: {
            fr: 'Candidature du',
            en: 'Applied on',
            nl: 'Aangevraagd op',
            de: 'Beworben am',
          },
          at: {
            fr: 'à',
            en: 'at',
            nl: 'om',
            de: 'um',
          },
          moveIn: {
            fr: 'Emménagement:',
            en: 'Move-in:',
            nl: 'Intrek:',
            de: 'Einzug:',
          },
          leaseDuration: {
            fr: 'mois',
            en: 'months',
            nl: 'maanden',
            de: 'Monate',
          },
          perMonth: {
            fr: '€/mois',
            en: '€/month',
            nl: '€/maand',
            de: '€/Monat',
          },
        },
        actions: {
          review: {
            fr: 'Réviser',
            en: 'Review',
            nl: 'Beoordelen',
            de: 'Prüfen',
          },
          approve: {
            fr: 'Approuver',
            en: 'Approve',
            nl: 'Goedkeuren',
            de: 'Genehmigen',
          },
          reject: {
            fr: 'Rejeter',
            en: 'Reject',
            nl: 'Afwijzen',
            de: 'Ablehnen',
          },
        },
        modal: {
          approveTitle: {
            fr: 'Approuver la candidature',
            en: 'Approve application',
            nl: 'Aanvraag goedkeuren',
            de: 'Bewerbung genehmigen',
          },
          rejectTitle: {
            fr: 'Rejeter la candidature',
            en: 'Reject application',
            nl: 'Aanvraag afwijzen',
            de: 'Bewerbung ablehnen',
          },
          approveConfirm: {
            fr: 'Es-tu sûr de vouloir approuver la candidature de',
            en: 'Are you sure you want to approve the application from',
            nl: 'Weet je zeker dat je de aanvraag wilt goedkeuren van',
            de: 'Sind Sie sicher, dass Sie die Bewerbung genehmigen möchten von',
          },
          rejectConfirm: {
            fr: 'Es-tu sûr de vouloir rejeter la candidature de',
            en: 'Are you sure you want to reject the application from',
            nl: 'Weet je zeker dat je de aanvraag wilt afwijzen van',
            de: 'Sind Sie sicher, dass Sie die Bewerbung ablehnen möchten von',
          },
          rejectReasonLabel: {
            fr: 'Raison du rejet (optionnel)',
            en: 'Rejection reason (optional)',
            nl: 'Reden voor afwijzing (optioneel)',
            de: 'Ablehnungsgrund (optional)',
          },
          rejectReasonPlaceholder: {
            fr: 'Explique pourquoi tu rejettes cette candidature...',
            en: 'Explain why you are rejecting this application...',
            nl: 'Leg uit waarom je deze aanvraag afwijst...',
            de: 'Erklären Sie, warum Sie diese Bewerbung ablehnen...',
          },
          notifyApplicant: {
            fr: 'Le candidat sera notifié de ton décision.',
            en: 'The applicant will be notified of your decision.',
            nl: 'De aanvrager wordt op de hoogte gebracht van je beslissing.',
            de: 'Der Bewerber wird über Ihre Entscheidung informiert.',
          },
          cancel: {
            fr: 'Annuler',
            en: 'Cancel',
            nl: 'Annuleren',
            de: 'Abbrechen',
          },
          processing: {
            fr: 'Traitement...',
            en: 'Processing...',
            nl: 'Verwerken...',
            de: 'Wird verarbeitet...',
          },
        },
        toast: {
          approveSuccess: {
            fr: 'Candidature approuvée !',
            en: 'Application approved!',
            nl: 'Aanvraag goedgekeurd!',
            de: 'Bewerbung genehmigt!',
          },
          rejectSuccess: {
            fr: 'Candidature rejetée',
            en: 'Application rejected',
            nl: 'Aanvraag afgewezen',
            de: 'Bewerbung abgelehnt',
          },
          actionError: {
            fr: "Erreur lors de l'action",
            en: 'Error during action',
            nl: 'Fout bij actie',
            de: 'Fehler bei der Aktion',
          },
        },
      },

      // ============================================
      // FINANCE PAGE - app/dashboard/owner/finance
      // ============================================
      financePage: {
        loading: {
          title: {
            fr: 'Chargement des finances...',
            en: 'Loading finances...',
            nl: 'Financiën laden...',
            de: 'Finanzen werden geladen...',
          },
          subtitle: {
            fr: 'Préparation de tes données',
            en: 'Preparing your data',
            nl: 'Je gegevens voorbereiden',
            de: 'Ihre Daten werden vorbereitet',
          },
        },
        header: {
          title: {
            fr: 'Rapport Financier',
            en: 'Financial Report',
            nl: 'Financieel Rapport',
            de: 'Finanzbericht',
          },
          subtitle: {
            fr: "Vue d'ensemble complète de tes finances",
            en: 'Complete overview of your finances',
            nl: 'Volledig overzicht van je financiën',
            de: 'Vollständiger Überblick über Ihre Finanzen',
          },
        },
        kpi: {
          totalRevenue: {
            fr: 'Revenus Totaux',
            en: 'Total Revenue',
            nl: 'Totale Omzet',
            de: 'Gesamteinnahmen',
          },
          totalExpenses: {
            fr: 'Dépenses Totales',
            en: 'Total Expenses',
            nl: 'Totale Uitgaven',
            de: 'Gesamtausgaben',
          },
          netProfit: {
            fr: 'Bénéfice Net',
            en: 'Net Profit',
            nl: 'Nettowinst',
            de: 'Nettogewinn',
          },
          occupancyRate: {
            fr: "Taux d'Occupation",
            en: 'Occupancy Rate',
            nl: 'Bezettingsgraad',
            de: 'Belegungsrate',
          },
          vsLastMonth: {
            fr: 'vs mois dernier',
            en: 'vs last month',
            nl: 'vs vorige maand',
            de: 'vs letzten Monat',
          },
        },
        monthly: {
          title: {
            fr: 'Détails Mensuels',
            en: 'Monthly Details',
            nl: 'Maandelijkse Details',
            de: 'Monatliche Details',
          },
          revenue: {
            fr: 'Revenus',
            en: 'Revenue',
            nl: 'Omzet',
            de: 'Einnahmen',
          },
          expenses: {
            fr: 'Dépenses',
            en: 'Expenses',
            nl: 'Uitgaven',
            de: 'Ausgaben',
          },
          profit: {
            fr: 'Bénéfice',
            en: 'Profit',
            nl: 'Winst',
            de: 'Gewinn',
          },
        },
        chart: {
          title: {
            fr: 'Revenus vs Dépenses',
            en: 'Revenue vs Expenses',
            nl: 'Omzet vs Uitgaven',
            de: 'Einnahmen vs Ausgaben',
          },
          comingSoon: {
            fr: 'Visualisation à venir',
            en: 'Visualization coming soon',
            nl: 'Visualisatie binnenkort',
            de: 'Visualisierung kommt bald',
          },
          comingSoonSubtitle: {
            fr: 'Graphiques interactifs bientôt disponibles',
            en: 'Interactive charts available soon',
            nl: 'Interactieve grafieken binnenkort beschikbaar',
            de: 'Interaktive Diagramme bald verfügbar',
          },
        },
        months: {
          jan: { fr: 'Jan', en: 'Jan', nl: 'Jan', de: 'Jan' },
          feb: { fr: 'Fév', en: 'Feb', nl: 'Feb', de: 'Feb' },
          mar: { fr: 'Mar', en: 'Mar', nl: 'Mrt', de: 'Mär' },
          apr: { fr: 'Avr', en: 'Apr', nl: 'Apr', de: 'Apr' },
          may: { fr: 'Mai', en: 'May', nl: 'Mei', de: 'Mai' },
          jun: { fr: 'Juin', en: 'Jun', nl: 'Jun', de: 'Jun' },
          jul: { fr: 'Juil', en: 'Jul', nl: 'Jul', de: 'Jul' },
          aug: { fr: 'Août', en: 'Aug', nl: 'Aug', de: 'Aug' },
          sep: { fr: 'Sep', en: 'Sep', nl: 'Sep', de: 'Sep' },
          oct: { fr: 'Oct', en: 'Oct', nl: 'Okt', de: 'Okt' },
          nov: { fr: 'Nov', en: 'Nov', nl: 'Nov', de: 'Nov' },
          dec: { fr: 'Déc', en: 'Dec', nl: 'Dec', de: 'Dez' },
        },
      },

      // ============================================
      // MAINTENANCE PAGE - app/dashboard/owner/maintenance
      // ============================================
      maintenancePage: {
        loading: {
          title: {
            fr: 'Chargement de la maintenance...',
            en: 'Loading maintenance...',
            nl: 'Onderhoud laden...',
            de: 'Wartung wird geladen...',
          },
          subtitle: {
            fr: 'Préparation de tes données',
            en: 'Preparing your data',
            nl: 'Je gegevens voorbereiden',
            de: 'Ihre Daten werden vorbereitet',
          },
        },
        header: {
          title: {
            fr: 'Maintenance',
            en: 'Maintenance',
            nl: 'Onderhoud',
            de: 'Wartung',
          },
          subtitle: {
            fr: 'Gérer les tickets de maintenance de tes propriétés',
            en: 'Manage maintenance tickets for your properties',
            nl: 'Beheer onderhoudstickets voor je eigendommen',
            de: 'Verwalten Sie Wartungstickets für Ihre Immobilien',
          },
          newTicket: {
            fr: 'Nouveau Ticket',
            en: 'New Ticket',
            nl: 'Nieuw Ticket',
            de: 'Neues Ticket',
          },
        },
        stats: {
          total: {
            fr: 'Total',
            en: 'Total',
            nl: 'Totaal',
            de: 'Gesamt',
          },
          pending: {
            fr: 'En attente',
            en: 'Pending',
            nl: 'In afwachting',
            de: 'Ausstehend',
          },
          inProgress: {
            fr: 'En cours',
            en: 'In progress',
            nl: 'In behandeling',
            de: 'In Bearbeitung',
          },
          completed: {
            fr: 'Terminés',
            en: 'Completed',
            nl: 'Voltooid',
            de: 'Abgeschlossen',
          },
        },
        filters: {
          all: {
            fr: 'Tous',
            en: 'All',
            nl: 'Alle',
            de: 'Alle',
          },
          pending: {
            fr: 'En attente',
            en: 'Pending',
            nl: 'In afwachting',
            de: 'Ausstehend',
          },
          inProgress: {
            fr: 'En cours',
            en: 'In progress',
            nl: 'In behandeling',
            de: 'In Bearbeitung',
          },
          completed: {
            fr: 'Terminés',
            en: 'Completed',
            nl: 'Voltooid',
            de: 'Abgeschlossen',
          },
        },
        status: {
          pending: {
            fr: 'En attente',
            en: 'Pending',
            nl: 'In afwachting',
            de: 'Ausstehend',
          },
          inProgress: {
            fr: 'En cours',
            en: 'In progress',
            nl: 'In behandeling',
            de: 'In Bearbeitung',
          },
          completed: {
            fr: 'Terminé',
            en: 'Completed',
            nl: 'Voltooid',
            de: 'Abgeschlossen',
          },
        },
        priority: {
          high: {
            fr: 'Urgent',
            en: 'Urgent',
            nl: 'Dringend',
            de: 'Dringend',
          },
          medium: {
            fr: 'Moyen',
            en: 'Medium',
            nl: 'Gemiddeld',
            de: 'Mittel',
          },
          low: {
            fr: 'Faible',
            en: 'Low',
            nl: 'Laag',
            de: 'Niedrig',
          },
        },
        empty: {
          title: {
            fr: 'Aucun ticket trouvé',
            en: 'No tickets found',
            nl: 'Geen tickets gevonden',
            de: 'Keine Tickets gefunden',
          },
          createFirst: {
            fr: 'Crée ta premier ticket de maintenance',
            en: 'Create your first maintenance ticket',
            nl: 'Maak je eerste onderhoudsticket aan',
            de: 'Erstellen Sie Ihr erstes Wartungsticket',
          },
          noWithStatus: {
            fr: 'Aucun ticket avec ce statut',
            en: 'No tickets with this status',
            nl: 'Geen tickets met deze status',
            de: 'Keine Tickets mit diesem Status',
          },
          createButton: {
            fr: 'Créer un ticket',
            en: 'Create ticket',
            nl: 'Ticket aanmaken',
            de: 'Ticket erstellen',
          },
        },
        card: {
          assignedTo: {
            fr: 'Assigné à :',
            en: 'Assigned to:',
            nl: 'Toegewezen aan:',
            de: 'Zugewiesen an:',
          },
        },
        actions: {
          viewDetails: {
            fr: 'Voir Détails',
            en: 'View Details',
            nl: 'Details Bekijken',
            de: 'Details Anzeigen',
          },
          start: {
            fr: 'Commencer',
            en: 'Start',
            nl: 'Starten',
            de: 'Starten',
          },
          complete: {
            fr: 'Terminer',
            en: 'Complete',
            nl: 'Voltooien',
            de: 'Abschließen',
          },
        },
        time: {
          hoursAgo: {
            fr: 'Il y a {count} heures',
            en: '{count} hours ago',
            nl: '{count} uur geleden',
            de: 'Vor {count} Stunden',
          },
          daysAgo: {
            fr: 'Il y a {count} jour(s)',
            en: '{count} day(s) ago',
            nl: '{count} dag(en) geleden',
            de: 'Vor {count} Tag(en)',
          },
        },
      },

      // ============================================
      // EXPENSES ADD PAGE - app/dashboard/owner/expenses/add
      // ============================================
      expensesAddPage: {
        title: {
          fr: 'Ajouter une dépense',
          en: 'Add Expense',
          nl: 'Kosten toevoegen',
          de: 'Ausgabe hinzufügen',
        },
        subtitle: {
          fr: 'Enregistrer les dépenses liées à la propriété',
          en: 'Record property-related expenses',
          nl: 'Registreer eigendomskosten',
          de: 'Immobilienbezogene Ausgaben erfassen',
        },
        cardTitle: {
          fr: 'Détails de la dépense',
          en: 'Expense Details',
          nl: 'Kostendetails',
          de: 'Ausgabendetails',
        },
        property: {
          fr: 'Propriété',
          en: 'Property',
          nl: 'Eigendom',
          de: 'Immobilie',
        },
        noProperties: {
          fr: 'Aucune propriété trouvée',
          en: 'No properties found',
          nl: 'Geen eigendommen gevonden',
          de: 'Keine Immobilien gefunden',
        },
        selectProperty: {
          fr: 'Sélectionner une propriété',
          en: 'Select property',
          nl: 'Selecteer eigendom',
          de: 'Immobilie auswählen',
        },
        expenseTitle: {
          fr: 'Titre de la dépense',
          en: 'Expense Title',
          nl: 'Kostentitel',
          de: 'Ausgabentitel',
        },
        expenseTitlePlaceholder: {
          fr: 'ex: Maintenance, Réparations, Charges',
          en: 'e.g., Maintenance, Repairs, Utilities',
          nl: 'bijv. Onderhoud, Reparaties, Nutsvoorzieningen',
          de: 'z.B. Wartung, Reparaturen, Nebenkosten',
        },
        amount: {
          fr: 'Montant (€)',
          en: 'Amount (€)',
          nl: 'Bedrag (€)',
          de: 'Betrag (€)',
        },
        category: {
          fr: 'Catégorie',
          en: 'Category',
          nl: 'Categorie',
          de: 'Kategorie',
        },
        selectCategory: {
          fr: 'Sélectionner une catégorie',
          en: 'Select category',
          nl: 'Selecteer categorie',
          de: 'Kategorie auswählen',
        },
        categories: {
          maintenance: { fr: 'Maintenance', en: 'Maintenance', nl: 'Onderhoud', de: 'Wartung' },
          repairs: { fr: 'Réparations', en: 'Repairs', nl: 'Reparaties', de: 'Reparaturen' },
          utilities: { fr: 'Charges', en: 'Utilities', nl: 'Nutsvoorzieningen', de: 'Nebenkosten' },
          insurance: { fr: 'Assurance', en: 'Insurance', nl: 'Verzekering', de: 'Versicherung' },
          property_tax: { fr: 'Taxe foncière', en: 'Property Tax', nl: 'Onroerendgoedbelasting', de: 'Grundsteuer' },
          management: { fr: 'Gestion immobilière', en: 'Property Management', nl: 'Vastgoedbeheer', de: 'Hausverwaltung' },
          other: { fr: 'Autre', en: 'Other', nl: 'Anders', de: 'Sonstiges' },
        },
        date: {
          fr: 'Date',
          en: 'Date',
          nl: 'Datum',
          de: 'Datum',
        },
        description: {
          fr: 'Description (Optionnel)',
          en: 'Description (Optional)',
          nl: 'Beschrijving (Optioneel)',
          de: 'Beschreibung (Optional)',
        },
        descriptionPlaceholder: {
          fr: 'Ajouter des détails supplémentaires...',
          en: 'Add any additional details...',
          nl: 'Voeg extra details toe...',
          de: 'Weitere Details hinzufügen...',
        },
        cancel: {
          fr: 'Annuler',
          en: 'Cancel',
          nl: 'Annuleren',
          de: 'Abbrechen',
        },
        submit: {
          fr: 'Ajouter la dépense',
          en: 'Add Expense',
          nl: 'Kosten toevoegen',
          de: 'Ausgabe hinzufügen',
        },
        submitting: {
          fr: 'Ajout en cours...',
          en: 'Adding...',
          nl: 'Toevoegen...',
          de: 'Hinzufügen...',
        },
        errors: {
          loadProperties: {
            fr: 'Impossible de charger tes propriétés. Veuillez réessayer.',
            en: 'Unable to load your properties. Please try again.',
            nl: 'Kan je eigendommen niet laden. Probeer het opnieuw.',
            de: 'Ihre Immobilien konnten nicht geladen werden. Bitte versuchen Sie es erneut.',
          },
          noPublishedProperties: {
            fr: 'Tu dois avoir une propriété publiée pour ajouter des dépenses.',
            en: 'You must have a published property to add expenses.',
            nl: 'Je moet een gepubliceerd eigendom hebben om kosten toe te voegen.',
            de: 'Sie müssen eine veröffentlichte Immobilie haben, um Ausgaben hinzuzufügen.',
          },
          loadError: {
            fr: 'Une erreur est survenue lors du chargement de tes propriétés.',
            en: 'An error occurred while loading your properties.',
            nl: 'Er is een fout opgetreden bij het laden van je eigendommen.',
            de: 'Beim Laden Ihrer Immobilien ist ein Fehler aufgetreten.',
          },
          notLoggedIn: {
            fr: 'Tu dois être connecté pour ajouter une dépense.',
            en: 'You must be logged in to add an expense.',
            nl: 'Je moet ingelogd zijn om kosten toe te voegen.',
            de: 'Sie müssen angemeldet sein, um eine Ausgabe hinzuzufügen.',
          },
          selectProperty: {
            fr: 'Veuillez sélectionner une propriété.',
            en: 'Please select a property.',
            nl: 'Selecteer een eigendom.',
            de: 'Bitte wählen Sie eine Immobilie aus.',
          },
          submitError: {
            fr: 'Erreur lors de l\'ajout de la dépense. Veuillez réessayer.',
            en: 'Error adding expense. Please try again.',
            nl: 'Fout bij het toevoegen van kosten. Probeer het opnieuw.',
            de: 'Fehler beim Hinzufügen der Ausgabe. Bitte versuchen Sie es erneut.',
          },
        },
      },

      // ============================================
      // MESSAGES PAGE - app/dashboard/owner/messages
      // ============================================
      messagesPage: {
        loading: {
          title: {
            fr: 'Chargement des messages...',
            en: 'Loading messages...',
            nl: 'Berichten laden...',
            de: 'Nachrichten werden geladen...',
          },
          subtitle: {
            fr: 'Préparation de tes conversations',
            en: 'Preparing your conversations',
            nl: 'Je gesprekken voorbereiden',
            de: 'Ihre Unterhaltungen werden vorbereitet',
          },
        },
        fallback: {
          fr: 'Utilisateur',
          en: 'User',
          nl: 'Gebruiker',
          de: 'Benutzer',
        },
        errors: {
          loadConversations: {
            fr: 'Erreur lors du chargement des conversations',
            en: 'Error loading conversations',
            nl: 'Fout bij het laden van gesprekken',
            de: 'Fehler beim Laden der Unterhaltungen',
          },
          loadError: {
            fr: 'Erreur de chargement',
            en: 'Loading error',
            nl: 'Laadfout',
            de: 'Ladefehler',
          },
          sendFailed: {
            fr: 'Échec de l\'envoi du message',
            en: 'Failed to send message',
            nl: 'Bericht verzenden mislukt',
            de: 'Nachricht konnte nicht gesendet werden',
          },
          archiveFailed: {
            fr: 'Échec de l\'archivage',
            en: 'Failed to archive',
            nl: 'Archiveren mislukt',
            de: 'Archivierung fehlgeschlagen',
          },
        },
        archived: {
          fr: 'Conversation archivée',
          en: 'Conversation archived',
          nl: 'Gesprek gearchiveerd',
          de: 'Unterhaltung archiviert',
        },
        emptyState: {
          fr: 'Soyez le premier à envoyer un message dans cette conversation !',
          en: 'Be the first to send a message in this conversation!',
          nl: 'Wees de eerste om een bericht in dit gesprek te sturen!',
          de: 'Seien Sie der Erste, der eine Nachricht in dieser Unterhaltung sendet!',
        },
      },
    },

    // Resident Dashboard
    resident: {
      title: {
        fr: 'Tableau de Bord Résident',
        en: 'Resident Dashboard',
        nl: 'Bewoner Dashboard',
        de: 'Bewohner-Dashboard',
      },
      welcome: {
        fr: 'Bienvenue,',
        en: 'Welcome back,',
        nl: 'Welkom terug,',
        de: 'Willkommen zurück,',
      },
      welcomeMessage: {
        fr: 'Ta communauté de co-living t\'attend',
        en: 'Connect with your coliving community',
        nl: 'Verbind met je coliving gemeenschap',
        de: 'Verbinden Sie sich mit Ihrer Coliving-Gemeinschaft',
      },
      welcomeBack: {
        fr: 'Bienvenue',
        en: 'Welcome back',
        nl: 'Welkom terug',
        de: 'Willkommen zurück',
      },
      welcomeSubtitle: {
        fr: 'Voici un aperçu de ton co-living',
        en: 'Here\'s an overview of your coliving',
        nl: 'Hier is een overzicht van je coliving',
        de: 'Hier ist ein Überblick über dein Coliving',
      },
      communityMember: {
        fr: 'Membre de la Communauté',
        en: 'Community Member',
        nl: 'Gemeenschapslid',
        de: 'Gemeinschaftsmitglied',
      },
      completionMessage: {
        fr: 'Complète ton Living Persona pour mieux te connecter avec ta communauté !',
        en: 'Complete your profile to connect better with your community!',
        nl: 'Vul je profiel aan om beter te verbinden met je gemeenschap!',
        de: 'Vervollständigen Sie Ihr Profil, um sich besser mit Ihrer Gemeinschaft zu verbinden!',
      },
      from: {
        fr: 'De',
        en: 'From',
        nl: 'Van',
        de: 'Aus',
      },
      livingSituation: {
        fr: 'Situation de Logement',
        en: 'Living Situation',
        nl: 'Woonsituatie',
        de: 'Wohnsituation',
      },
      movedIn: {
        fr: 'Emménagé le :',
        en: 'Moved in:',
        nl: 'Verhuisd op:',
        de: 'Eingezogen:',
      },
      community: {
        fr: 'Communauté',
        en: 'Community',
        nl: 'Gemeenschap',
        de: 'Gemeinschaft',
      },
      meetYourRoommates: {
        fr: 'Rencontrez tes résidents',
        en: 'Meet your roommates',
        nl: 'Ontmoet je huisgenoten',
        de: 'Treffen Sie Ihre Mitbewohner',
      },
      messages: {
        fr: 'Messages',
        en: 'Messages',
        nl: 'Berichten',
        de: 'Nachrichten',
      },
      chatWithOthers: {
        fr: 'Discutez avec les autres',
        en: 'Chat with others',
        nl: 'Chat met anderen',
        de: 'Chatten Sie mit anderen',
      },
      // ModernResidentDashboard translations
      loadingHub: {
        fr: 'Chargement du hub...',
        en: 'Loading hub...',
        nl: 'Hub laden...',
        de: 'Hub wird geladen...',
      },
      monthlyRent: {
        fr: 'Loyer du Mois',
        en: 'Monthly Rent',
        nl: 'Maandhuur',
        de: 'Monatsmiete',
      },
      dueDate: {
        fr: 'Échéance',
        en: 'Due',
        nl: 'Vervaldatum',
        de: 'Fällig',
      },
      sharedExpenses: {
        fr: 'Dépenses Partagées',
        en: 'Shared Expenses',
        nl: 'Gedeelde Kosten',
        de: 'Geteilte Ausgaben',
      },
      toSplit: {
        fr: 'À répartir',
        en: 'To split',
        nl: 'Te splitsen',
        de: 'Aufzuteilen',
      },
      yourBalance: {
        fr: 'Ton Solde',
        en: 'Your Balance',
        nl: 'Jouw Saldo',
        de: 'Dein Kontostand',
      },
      owedToYou: {
        fr: 'On te doit',
        en: 'Owed to you',
        nl: 'Je krijgt',
        de: 'Dir geschuldet',
      },
      youOwe: {
        fr: 'Tu dois',
        en: 'You owe',
        nl: 'Je bent schuldig',
        de: 'Du schuldest',
      },
      roommates: {
        fr: 'Résidents',
        en: 'Roommates',
        nl: 'Huisgenoten',
        de: 'Mitbewohner',
      },
      activeMembers: {
        fr: 'Membres actifs',
        en: 'Active members',
        nl: 'Actieve leden',
        de: 'Aktive Mitglieder',
      },
      upcomingTasks: {
        fr: 'Tâches à Venir',
        en: 'Upcoming Tasks',
        nl: 'Aankomende Taken',
        de: 'Kommende Aufgaben',
      },
      viewAll: {
        fr: 'Tout voir',
        en: 'View all',
        nl: 'Alles bekijken',
        de: 'Alle anzeigen',
      },
      priorityUrgent: {
        fr: 'Urgent',
        en: 'Urgent',
        nl: 'Dringend',
        de: 'Dringend',
      },
      priorityMedium: {
        fr: 'Moyen',
        en: 'Medium',
        nl: 'Gemiddeld',
        de: 'Mittel',
      },
      priorityLow: {
        fr: 'Bas',
        en: 'Low',
        nl: 'Laag',
        de: 'Niedrig',
      },
      addTask: {
        fr: 'Ajouter une tâche',
        en: 'Add a task',
        nl: 'Taak toevoegen',
        de: 'Aufgabe hinzufügen',
      },
      recentActivity: {
        fr: 'Activité Récente',
        en: 'Recent Activity',
        nl: 'Recente Activiteit',
        de: 'Letzte Aktivität',
      },
      communityHappiness: {
        fr: 'Bonheur du Co-living',
        en: 'Community Happiness',
        nl: 'Huisgenoten Geluk',
        de: 'Gemeinschaftsglück',
      },
      happinessSubtitle: {
        fr: 'Basé sur l\'activité et les interactions',
        en: 'Based on activity and interactions',
        nl: 'Gebaseerd op activiteit en interacties',
        de: 'Basierend auf Aktivität und Interaktionen',
      },
      excellent: {
        fr: 'Excellent!',
        en: 'Excellent!',
        nl: 'Uitstekend!',
        de: 'Ausgezeichnet!',
      },
      onboarding: {
        welcome: {
          title: {
            fr: 'Bienvenue dans ton Hub !',
            en: 'Welcome to your Hub!',
            nl: 'Welkom in je Hub!',
            de: 'Willkommen in deinem Hub!',
          },
          description: {
            fr: 'Ici tu retrouves un aperçu de ton co-living : loyer, dépenses partagées et solde avec tes résidents.',
            en: 'Here you\'ll find an overview of your flatshare: rent, shared expenses, and balance with your roommates.',
            nl: 'Hier vind je een overzicht van je flatshare: huur, gedeelde kosten en saldo met je huisgenoten.',
            de: 'Hier findest du eine Übersicht deiner WG: Miete, geteilte Ausgaben und Saldo mit deinen Mitbewohnern.',
          },
        },
        finances: {
          title: {
            fr: 'Gère tes finances',
            en: 'Manage your finances',
            nl: 'Beheer je financiën',
            de: 'Verwalte deine Finanzen',
          },
          description: {
            fr: 'Clique ici pour voir le détail des dépenses partagées et équilibrer les comptes avec tes résidents.',
            en: 'Click here to see shared expense details and balance accounts with your roommates.',
            nl: 'Klik hier om gedeelde kostendetails te zien en rekeningen met je huisgenoten te vereffenen.',
            de: 'Klicke hier, um geteilte Ausgabendetails zu sehen und die Konten mit deinen Mitbewohnern auszugleichen.',
          },
        },
        members: {
          title: {
            fr: 'Tes résidents',
            en: 'Your roommates',
            nl: 'Je huisgenoten',
            de: 'Deine Mitbewohner',
          },
          description: {
            fr: 'Retrouve tous les membres de ton co-living, invite de nouveaux résidents ou anticipe les départs.',
            en: 'Find all members of your flatshare, invite new roommates, or plan departures.',
            nl: 'Vind alle leden van je flatshare, nodig nieuwe huisgenoten uit of plan vertrek.',
            de: 'Finde alle Mitglieder deiner WG, lade neue Mitbewohner ein oder plane Auszüge.',
          },
        },
        tasks: {
          title: {
            fr: 'Organise la vie commune',
            en: 'Organize shared living',
            nl: 'Organiseer het samenleven',
            de: 'Organisiere das Zusammenleben',
          },
          description: {
            fr: 'Planifie les tâches ménagères, les réunions et les échéances importantes de le co-living.',
            en: 'Plan household tasks, meetings, and important deadlines for the flatshare.',
            nl: 'Plan huishoudelijke taken, vergaderingen en belangrijke deadlines voor de flatshare.',
            de: 'Plane Haushaltsaufgaben, Meetings und wichtige Fristen für die WG.',
          },
        },
      },
    },

    // Hub Residence Header
    hub: {
      residenceHeader: {
        // Quick actions
        actionExpense: {
          fr: 'Dépense',
          en: 'Expense',
          nl: 'Uitgave',
          de: 'Ausgabe',
        },
        actionDocuments: {
          fr: 'Documents',
          en: 'Documents',
          nl: 'Documenten',
          de: 'Dokumente',
        },
        actionRules: {
          fr: 'Règles',
          en: 'Rules',
          nl: 'Regels',
          de: 'Regeln',
        },
        actionInvite: {
          fr: 'Inviter',
          en: 'Invite',
          nl: 'Uitnodigen',
          de: 'Einladen',
        },
        actionSettings: {
          fr: 'Paramètres',
          en: 'Settings',
          nl: 'Instellingen',
          de: 'Einstellungen',
        },
        nextStep: {
          fr: 'Prochaine étape',
          en: 'Next step',
          nl: 'Volgende stap',
          de: 'Nächster Schritt',
        },
        // Member count
        roommate: {
          fr: 'résident',
          en: 'roommate',
          nl: 'huisgenoot',
          de: 'Mitbewohner',
        },
        roommates: {
          fr: 'résidents',
          en: 'roommates',
          nl: 'huisgenoten',
          de: 'Mitbewohner',
        },
        // Completion steps
        stepInviteRoommates: {
          fr: 'Inviter des résidents',
          en: 'Invite roommates',
          nl: 'Nodig huisgenoten uit',
          de: 'Lade Mitbewohner ein',
        },
        stepAddPhoto: {
          fr: 'Ajouter une photo de la résidence',
          en: 'Add a photo of the residence',
          nl: 'Voeg een foto van de residentie toe',
          de: 'Füge ein Foto der Residenz hinzu',
        },
        stepAddMoreExpenses: {
          fr: 'Ajouter {count} dépenses de plus',
          en: 'Add {count} more expenses',
          nl: 'Voeg nog {count} uitgaven toe',
          de: 'Füge {count} weitere Ausgaben hinzu',
        },
        stepCreateFirstExpense: {
          fr: 'Créer ta première dépense',
          en: 'Create your first expense',
          nl: 'Maak je eerste uitgave aan',
          de: 'Erstelle deine erste Ausgabe',
        },
        stepSetupTasks: {
          fr: 'Configurer des tâches',
          en: 'Set up tasks',
          nl: 'Taken instellen',
          de: 'Aufgaben einrichten',
        },
        // Progress section
        completeResidence: {
          fr: 'Complète votre résidence',
          en: 'Complete your residence',
          nl: 'Voltooi je residentie',
          de: 'Vervollständige deine Residenz',
        },
        congratulations: {
          fr: 'Félicitations ! Votre résidence est complète !',
          en: 'Congratulations! Your residence is complete!',
          nl: 'Gefeliciteerd! Je residentie is compleet!',
          de: 'Herzlichen Glückwunsch! Deine Residenz ist vollständig!',
        },
      },
      // Finances page translations
      finances: {
        loading: {
          fr: 'Chargement...',
          en: 'Loading...',
          nl: 'Laden...',
          de: 'Laden...',
        },
        title: {
          fr: 'Finances',
          en: 'Finances',
          nl: 'Financiën',
          de: 'Finanzen',
        },
        expensesPlural: {
          fr: 'dépenses',
          en: 'expenses',
          nl: 'uitgaven',
          de: 'Ausgaben',
        },
        expenseSingular: {
          fr: 'dépense',
          en: 'expense',
          nl: 'uitgave',
          de: 'Ausgabe',
        },
        total: {
          fr: 'total',
          en: 'total',
          nl: 'totaal',
          de: 'gesamt',
        },
        calendar: {
          fr: 'Calendrier',
          en: 'Calendar',
          nl: 'Kalender',
          de: 'Kalender',
        },
        scan: {
          fr: 'Scanner',
          en: 'Scan',
          nl: 'Scannen',
          de: 'Scannen',
        },
        stats: {
          total: {
            fr: 'Total',
            en: 'Total',
            nl: 'Totaal',
            de: 'Gesamt',
          },
          lastDays: {
            fr: '7 derniers jours',
            en: 'Last 7 days',
            nl: 'Laatste 7 dagen',
            de: 'Letzte 7 Tage',
          },
          yourShare: {
            fr: 'Ta part',
            en: 'Your share',
            nl: 'Jouw deel',
            de: 'Dein Anteil',
          },
          balance: {
            fr: 'Solde',
            en: 'Balance',
            nl: 'Saldo',
            de: 'Saldo',
          },
          youAreOwed: {
            fr: 'On te doit',
            en: 'You are owed',
            nl: 'Je krijgt nog',
            de: 'Dir wird geschuldet',
          },
          youOwe: {
            fr: 'Tu dois',
            en: 'You owe',
            nl: 'Je bent verschuldigd',
            de: 'Du schuldest',
          },
        },
        charts: {
          progression: {
            fr: 'Progression',
            en: 'Progression',
            nl: 'Voortgang',
            de: 'Verlauf',
          },
          byCategory: {
            fr: 'Par catégorie',
            en: 'By category',
            nl: 'Per categorie',
            de: 'Nach Kategorie',
          },
        },
        recentExpenses: {
          fr: 'Dépenses récentes',
          en: 'Recent expenses',
          nl: 'Recente uitgaven',
          de: 'Letzte Ausgaben',
        },
        viewAll: {
          fr: 'Tout voir',
          en: 'View all',
          nl: 'Alles bekijken',
          de: 'Alle anzeigen',
        },
        balancesBetweenRoommates: {
          fr: 'Soldes entre résidents',
          en: 'Balances between roommates',
          nl: 'Saldi tussen huisgenoten',
          de: 'Salden zwischen Mitbewohnern',
        },
        emptyBalance: {
          title: {
            fr: 'Tout est réglé !',
            en: 'All settled!',
            nl: 'Alles geregeld!',
            de: 'Alles erledigt!',
          },
          description: {
            fr: 'Aucun solde en attente',
            en: 'No pending balances',
            nl: 'Geen openstaande saldi',
            de: 'Keine ausstehenden Salden',
          },
        },
        owesYou: {
          fr: 'Te doit',
          en: 'Owes you',
          nl: 'Is je verschuldigd',
          de: 'Schuldet dir',
        },
        youOweThem: {
          fr: 'Tu lui dois',
          en: 'You owe them',
          nl: 'Je bent verschuldigd',
          de: 'Du schuldest ihnen',
        },
        modal: {
          scanTitle: {
            fr: 'Scanner un ticket',
            en: 'Scan a receipt',
            nl: 'Scan een bon',
            de: 'Beleg scannen',
          },
          splitTitle: {
            fr: 'Répartir la dépense',
            en: 'Split the expense',
            nl: 'Verdeel de uitgave',
            de: 'Ausgabe aufteilen',
          },
          creating: {
            fr: 'Création de la dépense...',
            en: 'Creating the expense...',
            nl: 'Uitgave aanmaken...',
            de: 'Ausgabe wird erstellt...',
          },
        },
      },
      // Members page translations
      members: {
        loading: {
          fr: 'Chargement...',
          en: 'Loading...',
          nl: 'Laden...',
          de: 'Laden...',
        },
        title: {
          fr: 'Membres',
          en: 'Members',
          nl: 'Leden',
          de: 'Mitglieder',
        },
        backToHub: {
          fr: 'Retour au hub',
          en: 'Back to hub',
          nl: 'Terug naar hub',
          de: 'Zurück zum Hub',
        },
        yourResidence: {
          fr: 'Votre résidence',
          en: 'Your residence',
          nl: 'Je residentie',
          de: 'Deine Residenz',
        },
        membersPlural: {
          fr: 'membres',
          en: 'members',
          nl: 'leden',
          de: 'Mitglieder',
        },
        memberSingular: {
          fr: 'membre',
          en: 'member',
          nl: 'lid',
          de: 'Mitglied',
        },
        invite: {
          fr: 'Inviter',
          en: 'Invite',
          nl: 'Uitnodigen',
          de: 'Einladen',
        },
        stats: {
          total: {
            fr: 'Total',
            en: 'Total',
            nl: 'Totaal',
            de: 'Gesamt',
          },
          activeMembersPlural: {
            fr: 'membres actifs',
            en: 'active members',
            nl: 'actieve leden',
            de: 'aktive Mitglieder',
          },
          activeMemberSingular: {
            fr: 'membre actif',
            en: 'active member',
            nl: 'actief lid',
            de: 'aktives Mitglied',
          },
          residents: {
            fr: 'Résidents',
            en: 'Residents',
            nl: 'Bewoners',
            de: 'Bewohner',
          },
          owners: {
            fr: 'Propriétaires',
            en: 'Owners',
            nl: 'Eigenaren',
            de: 'Eigentümer',
          },
          activeManagement: {
            fr: 'gestion active',
            en: 'active management',
            nl: 'actief beheer',
            de: 'aktive Verwaltung',
          },
          noOwner: {
            fr: 'aucun propriétaire',
            en: 'no owner',
            nl: 'geen eigenaar',
            de: 'kein Eigentümer',
          },
        },
        roles: {
          owner: {
            fr: 'Propriétaire',
            en: 'Owner',
            nl: 'Eigenaar',
            de: 'Eigentümer',
          },
          resident: {
            fr: 'Résident',
            en: 'Resident',
            nl: 'Bewoner',
            de: 'Bewohner',
          },
        },
        since: {
          fr: 'Depuis',
          en: 'Since',
          nl: 'Sinds',
          de: 'Seit',
        },
        interests: {
          fr: "Centres d'intérêt",
          en: 'Interests',
          nl: 'Interesses',
          de: 'Interessen',
        },
        message: {
          fr: 'Message',
          en: 'Message',
          nl: 'Bericht',
          de: 'Nachricht',
        },
        emptyState: {
          title: {
            fr: 'Aucun résident pour le moment',
            en: 'No roommates yet',
            nl: 'Nog geen huisgenoten',
            de: 'Noch keine Mitbewohner',
          },
          description: {
            fr: 'Invitez des personnes à rejoindre votre co-living !',
            en: 'Invite people to join your co-living!',
            nl: 'Nodig mensen uit om bij je co-living te komen!',
            de: 'Laden Sie Leute ein, Ihrer WG beizutreten!',
          },
          inviteButton: {
            fr: 'Inviter des membres',
            en: 'Invite members',
            nl: 'Leden uitnodigen',
            de: 'Mitglieder einladen',
          },
        },
      },
      // Tasks page translations
      tasks: {
        title: {
          fr: 'Tâches',
          en: 'Tasks',
          nl: 'Taken',
          de: 'Aufgaben',
        },
        pending: {
          fr: 'en attente',
          en: 'pending',
          nl: 'in behandeling',
          de: 'ausstehend',
        },
        forMe: {
          fr: 'pour moi',
          en: 'for me',
          nl: 'voor mij',
          de: 'für mich',
        },
        newTask: {
          fr: 'Nouvelle tâche',
          en: 'New task',
          nl: 'Nieuwe taak',
          de: 'Neue Aufgabe',
        },
        stats: {
          myTasks: {
            fr: 'Mes tâches',
            en: 'My tasks',
            nl: 'Mijn taken',
            de: 'Meine Aufgaben',
          },
          toDo: {
            fr: 'à faire',
            en: 'to do',
            nl: 'te doen',
            de: 'zu erledigen',
          },
          pendingLabel: {
            fr: 'En attente',
            en: 'Pending',
            nl: 'In behandeling',
            de: 'Ausstehend',
          },
          tasksPlural: {
            fr: 'tâches',
            en: 'tasks',
            nl: 'taken',
            de: 'Aufgaben',
          },
          taskSingular: {
            fr: 'tâche',
            en: 'task',
            nl: 'taak',
            de: 'Aufgabe',
          },
          completed: {
            fr: 'Terminées',
            en: 'Completed',
            nl: 'Voltooid',
            de: 'Abgeschlossen',
          },
          completedPlural: {
            fr: 'complétées',
            en: 'completed',
            nl: 'voltooid',
            de: 'abgeschlossen',
          },
          completedSingular: {
            fr: 'complétée',
            en: 'completed',
            nl: 'voltooid',
            de: 'abgeschlossen',
          },
          overdue: {
            fr: 'En retard',
            en: 'Overdue',
            nl: 'Te laat',
            de: 'Überfällig',
          },
          urgentPlural: {
            fr: 'urgentes',
            en: 'urgent',
            nl: 'dringend',
            de: 'dringend',
          },
          urgentSingular: {
            fr: 'urgente',
            en: 'urgent',
            nl: 'dringend',
            de: 'dringend',
          },
        },
        allTasks: {
          fr: 'Toutes les tâches',
          en: 'All tasks',
          nl: 'Alle taken',
          de: 'Alle Aufgaben',
        },
        rotation: {
          fr: 'Rotation',
          en: 'Rotation',
          nl: 'Rotatie',
          de: 'Rotation',
        },
        overdue: {
          fr: 'En retard',
          en: 'Overdue',
          nl: 'Te laat',
          de: 'Überfällig',
        },
        complete: {
          fr: 'Terminer',
          en: 'Complete',
          nl: 'Voltooien',
          de: 'Abschließen',
        },
        emptyState: {
          title: {
            fr: 'Aucune tâche en attente',
            en: 'No pending tasks',
            nl: 'Geen openstaande taken',
            de: 'Keine ausstehenden Aufgaben',
          },
          description: {
            fr: 'Tout est fait !',
            en: 'All done!',
            nl: 'Alles gedaan!',
            de: 'Alles erledigt!',
          },
        },
        modal: {
          newTask: {
            fr: 'Nouvelle tâche',
            en: 'New task',
            nl: 'Nieuwe taak',
            de: 'Neue Aufgabe',
          },
          titleLabel: {
            fr: 'Titre',
            en: 'Title',
            nl: 'Titel',
            de: 'Titel',
          },
          titlePlaceholder: {
            fr: 'Ex: Nettoyer la cuisine',
            en: 'Ex: Clean the kitchen',
            nl: 'Bijv: Keuken schoonmaken',
            de: 'Z.B.: Küche putzen',
          },
          descriptionLabel: {
            fr: 'Description',
            en: 'Description',
            nl: 'Beschrijving',
            de: 'Beschreibung',
          },
          descriptionPlaceholder: {
            fr: 'Détails (optionnel)',
            en: 'Details (optional)',
            nl: 'Details (optioneel)',
            de: 'Details (optional)',
          },
          categoryLabel: {
            fr: 'Catégorie',
            en: 'Category',
            nl: 'Categorie',
            de: 'Kategorie',
          },
          priorityLabel: {
            fr: 'Priorité',
            en: 'Priority',
            nl: 'Prioriteit',
            de: 'Priorität',
          },
          dueDateLabel: {
            fr: "Date d'échéance",
            en: 'Due date',
            nl: 'Vervaldatum',
            de: 'Fälligkeitsdatum',
          },
          cancel: {
            fr: 'Annuler',
            en: 'Cancel',
            nl: 'Annuleren',
            de: 'Abbrechen',
          },
          create: {
            fr: 'Créer',
            en: 'Create',
            nl: 'Aanmaken',
            de: 'Erstellen',
          },
          creating: {
            fr: 'Création...',
            en: 'Creating...',
            nl: 'Aanmaken...',
            de: 'Erstellen...',
          },
        },
        categories: {
          cleaning: {
            fr: 'Nettoyage',
            en: 'Cleaning',
            nl: 'Schoonmaken',
            de: 'Reinigung',
          },
          groceries: {
            fr: 'Courses',
            en: 'Groceries',
            nl: 'Boodschappen',
            de: 'Einkaufen',
          },
          maintenance: {
            fr: 'Entretien',
            en: 'Maintenance',
            nl: 'Onderhoud',
            de: 'Wartung',
          },
          admin: {
            fr: 'Administratif',
            en: 'Administrative',
            nl: 'Administratief',
            de: 'Administrativ',
          },
          other: {
            fr: 'Autre',
            en: 'Other',
            nl: 'Overig',
            de: 'Sonstiges',
          },
        },
        priorities: {
          low: {
            fr: 'Basse',
            en: 'Low',
            nl: 'Laag',
            de: 'Niedrig',
          },
          medium: {
            fr: 'Moyenne',
            en: 'Medium',
            nl: 'Gemiddeld',
            de: 'Mittel',
          },
          high: {
            fr: 'Haute',
            en: 'High',
            nl: 'Hoog',
            de: 'Hoch',
          },
          urgent: {
            fr: 'Urgente',
            en: 'Urgent',
            nl: 'Dringend',
            de: 'Dringend',
          },
        },
        completeModal: {
          title: {
            fr: 'Terminer la tâche',
            en: 'Complete task',
            nl: 'Taak voltooien',
            de: 'Aufgabe abschließen',
          },
          notesLabel: {
            fr: 'Notes de complétion',
            en: 'Completion notes',
            nl: 'Voltooiingsnotities',
            de: 'Abschlussnotizen',
          },
          notesPlaceholder: {
            fr: "Comment ça s'est passé ? (optionnel)",
            en: 'How did it go? (optional)',
            nl: 'Hoe ging het? (optioneel)',
            de: 'Wie ist es gelaufen? (optional)',
          },
          completing: {
            fr: 'Finalisation...',
            en: 'Completing...',
            nl: 'Voltooien...',
            de: 'Abschließen...',
          },
        },
      },
      // Calendar page translations
      calendar: {
        loading: {
          fr: 'Chargement...',
          en: 'Loading...',
          nl: 'Laden...',
          de: 'Laden...',
        },
        title: {
          fr: 'Calendrier',
          en: 'Calendar',
          nl: 'Kalender',
          de: 'Kalender',
        },
        newEvent: {
          fr: 'Nouvel événement',
          en: 'New event',
          nl: 'Nieuw evenement',
          de: 'Neues Event',
        },
        eventPlural: {
          fr: 'événements',
          en: 'events',
          nl: 'evenementen',
          de: 'Events',
        },
        eventSingular: {
          fr: 'événement',
          en: 'event',
          nl: 'evenement',
          de: 'Event',
        },
        today: {
          fr: "Aujourd'hui",
          en: 'Today',
          nl: 'Vandaag',
          de: 'Heute',
        },
        todayShort: {
          fr: 'Auj',
          en: 'Today',
          nl: 'Vand',
          de: 'Heute',
        },
        thisMonth: {
          fr: 'Ce mois',
          en: 'This month',
          nl: 'Deze maand',
          de: 'Dieser Monat',
        },
        upcoming: {
          fr: 'À venir',
          en: 'Upcoming',
          nl: 'Aanstaande',
          de: 'Bevorstehend',
        },
        upcomingEvents: {
          fr: 'Événements à venir',
          en: 'Upcoming events',
          nl: 'Aanstaande evenementen',
          de: 'Bevorstehende Events',
        },
        noEvents: {
          fr: 'Aucun événement prévu',
          en: 'No events scheduled',
          nl: 'Geen evenementen gepland',
          de: 'Keine Events geplant',
        },
        createFirst: {
          fr: 'Crée ta premier événement !',
          en: 'Create your first event!',
          nl: 'Maak je eerste evenement!',
          de: 'Erstelle dein erstes Event!',
        },
        noParticipants: {
          fr: 'Aucun participant',
          en: 'No participants',
          nl: 'Geen deelnemers',
          de: 'Keine Teilnehmer',
        },
        you: {
          fr: 'Toi',
          en: 'You',
          nl: 'Jij',
          de: 'Du',
        },
        unknown: {
          fr: 'Inconnu',
          en: 'Unknown',
          nl: 'Onbekend',
          de: 'Unbekannt',
        },
        confirmDelete: {
          fr: 'Es-tu sûr de vouloir supprimer cet événement ?',
          en: 'Are you sure you want to delete this event?',
          nl: 'Weet je zeker dat je dit evenement wilt verwijderen?',
          de: 'Bist du sicher, dass du dieses Event löschen möchtest?',
        },
        deleteError: {
          fr: "Erreur lors de la suppression de l'événement",
          en: 'Error deleting event',
          nl: 'Fout bij het verwijderen van evenement',
          de: 'Fehler beim Löschen des Events',
        },
        months: {
          jan: { fr: 'Janvier', en: 'January', nl: 'Januari', de: 'Januar' },
          feb: { fr: 'Février', en: 'February', nl: 'Februari', de: 'Februar' },
          mar: { fr: 'Mars', en: 'March', nl: 'Maart', de: 'März' },
          apr: { fr: 'Avril', en: 'April', nl: 'April', de: 'April' },
          may: { fr: 'Mai', en: 'May', nl: 'Mei', de: 'Mai' },
          jun: { fr: 'Juin', en: 'June', nl: 'Juni', de: 'Juni' },
          jul: { fr: 'Juillet', en: 'July', nl: 'Juli', de: 'Juli' },
          aug: { fr: 'Août', en: 'August', nl: 'Augustus', de: 'August' },
          sep: { fr: 'Septembre', en: 'September', nl: 'September', de: 'September' },
          oct: { fr: 'Octobre', en: 'October', nl: 'Oktober', de: 'Oktober' },
          nov: { fr: 'Novembre', en: 'November', nl: 'November', de: 'November' },
          dec: { fr: 'Décembre', en: 'December', nl: 'December', de: 'Dezember' },
        },
        days: {
          mon: { fr: 'Lun', en: 'Mon', nl: 'Ma', de: 'Mo' },
          tue: { fr: 'Mar', en: 'Tue', nl: 'Di', de: 'Di' },
          wed: { fr: 'Mer', en: 'Wed', nl: 'Wo', de: 'Mi' },
          thu: { fr: 'Jeu', en: 'Thu', nl: 'Do', de: 'Do' },
          fri: { fr: 'Ven', en: 'Fri', nl: 'Vr', de: 'Fr' },
          sat: { fr: 'Sam', en: 'Sat', nl: 'Za', de: 'Sa' },
          sun: { fr: 'Dim', en: 'Sun', nl: 'Zo', de: 'So' },
        },
      },
      // Invite page translations
      invite: {
        loading: {
          fr: 'Chargement...',
          en: 'Loading...',
          nl: 'Laden...',
          de: 'Laden...',
        },
        back: {
          fr: 'Retour',
          en: 'Back',
          nl: 'Terug',
          de: 'Zurück',
        },
        title: {
          fr: 'Inviter des résidents',
          en: 'Invite roommates',
          nl: 'Nodig huisgenoten uit',
          de: 'Mitbewohner einladen',
        },
        rewards: {
          title: {
            fr: 'Récompenses automatiques',
            en: 'Automatic rewards',
            nl: 'Automatische beloningen',
            de: 'Automatische Belohnungen',
          },
          description: {
            fr: "Quand quelqu'un rejoint avec ton lien, tu gagnes tous les deux des mois gratuits !",
            en: 'When someone joins with your link, you both earn free months!',
            nl: 'Wanneer iemand zich aanmeldt met jouw link, verdienen jullie allebei gratis maanden!',
            de: 'Wenn jemand mit deinem Link beitritt, erhaltet ihr beide kostenlose Monate!',
          },
          resident: {
            fr: 'Résident',
            en: 'Resident',
            nl: 'Bewoner',
            de: 'Bewohner',
          },
          owner: {
            fr: 'Proprio',
            en: 'Owner',
            nl: 'Eigenaar',
            de: 'Eigentümer',
          },
        },
        createLink: {
          title: {
            fr: "Créer un lien d'invitation",
            en: 'Create an invite link',
            nl: 'Maak een uitnodigingslink',
            de: 'Einladungslink erstellen',
          },
          description: {
            fr: "Générez un lien unique et trackable pour inviter quelqu'un à rejoindre votre co-living.",
            en: 'Generate a unique and trackable link to invite someone to join your flatshare.',
            nl: 'Genereer een unieke en traceerbare link om iemand uit te nodigen voor je flatshare.',
            de: 'Erstelle einen einzigartigen und nachverfolgbaren Link, um jemanden zu deiner WG einzuladen.',
          },
          inviteAs: {
            fr: 'Inviter en tant que :',
            en: 'Invite as:',
            nl: 'Uitnodigen als:',
            de: 'Einladen als:',
          },
          residentRole: {
            fr: 'Résident',
            en: 'Resident',
            nl: 'Bewoner',
            de: 'Bewohner',
          },
          ownerRole: {
            fr: 'Propriétaire',
            en: 'Owner',
            nl: 'Eigenaar',
            de: 'Eigentümer',
          },
          generate: {
            fr: "Générer le lien d'invitation",
            en: 'Generate invite link',
            nl: 'Genereer uitnodigingslink',
            de: 'Einladungslink generieren',
          },
          generating: {
            fr: 'Génération...',
            en: 'Generating...',
            nl: 'Genereren...',
            de: 'Generieren...',
          },
          linkLabel: {
            fr: "Lien d'invitation",
            en: 'Invite link',
            nl: 'Uitnodigingslink',
            de: 'Einladungslink',
          },
          copyLink: {
            fr: 'Copier le lien',
            en: 'Copy link',
            nl: 'Kopieer link',
            de: 'Link kopieren',
          },
          copied: {
            fr: 'Copié !',
            en: 'Copied!',
            nl: 'Gekopieerd!',
            de: 'Kopiert!',
          },
        },
        toast: {
          linkGenerated: {
            fr: "Lien d'invitation généré !",
            en: 'Invite link generated!',
            nl: 'Uitnodigingslink gegenereerd!',
            de: 'Einladungslink generiert!',
          },
          linkCopied: {
            fr: 'Lien copié !',
            en: 'Link copied!',
            nl: 'Link gekopieerd!',
            de: 'Link kopiert!',
          },
          generateError: {
            fr: 'Erreur lors de la génération',
            en: 'Error generating link',
            nl: 'Fout bij het genereren',
            de: 'Fehler beim Generieren',
          },
        },
        currentMembers: {
          title: {
            fr: 'Membres actuels',
            en: 'Current members',
            nl: 'Huidige leden',
            de: 'Aktuelle Mitglieder',
          },
          resident: {
            fr: 'Résident',
            en: 'Resident',
            nl: 'Bewoner',
            de: 'Bewohner',
          },
          active: {
            fr: 'Actif',
            en: 'Active',
            nl: 'Actief',
            de: 'Aktiv',
          },
        },
        defaultProperty: {
          fr: 'Votre co-living',
          en: 'Your flatshare',
          nl: 'Jouw flatshare',
          de: 'Deine WG',
        },
        defaultInviter: {
          fr: 'Un résident',
          en: 'A roommate',
          nl: 'Een huisgenoot',
          de: 'Ein Mitbewohner',
        },
      },
      // Rules page translations
      rules: {
        loading: {
          fr: 'Chargement...',
          en: 'Loading...',
          nl: 'Laden...',
          de: 'Laden...',
        },
        backToHub: {
          fr: '← Retour au hub',
          en: '← Back to hub',
          nl: '← Terug naar hub',
          de: '← Zurück zum Hub',
        },
        title: {
          fr: 'Règles de la maison',
          en: 'House rules',
          nl: 'Huisregels',
          de: 'Hausregeln',
        },
        subtitle: {
          fr: 'Créez et votez sur les règles de vie en commun',
          en: 'Create and vote on community living rules',
          nl: 'Maak en stem over samenlevingsregels',
          de: 'Erstelle und stimme über Zusammenlebensregeln ab',
        },
        proposeRule: {
          fr: 'Proposer une règle',
          en: 'Propose a rule',
          nl: 'Stel een regel voor',
          de: 'Regel vorschlagen',
        },
        stats: {
          all: {
            fr: 'Toutes',
            en: 'All',
            nl: 'Alle',
            de: 'Alle',
          },
          voting: {
            fr: 'En vote',
            en: 'Voting',
            nl: 'Stemmen',
            de: 'Abstimmung',
          },
          active: {
            fr: 'Actives',
            en: 'Active',
            nl: 'Actief',
            de: 'Aktiv',
          },
          rejected: {
            fr: 'Rejetées',
            en: 'Rejected',
            nl: 'Afgewezen',
            de: 'Abgelehnt',
          },
        },
        emptyState: {
          noRules: {
            fr: 'Aucune règle',
            en: 'No rules',
            nl: 'Geen regels',
            de: 'Keine Regeln',
          },
          noRulesFilter: {
            fr: 'Aucune règle',
            en: 'No rules',
            nl: 'Geen regels',
            de: 'Keine Regeln',
          },
          proposeFirst: {
            fr: 'Proposez la première règle de la maison',
            en: 'Propose the first house rule',
            nl: 'Stel de eerste huisregel voor',
            de: 'Schlage die erste Hausregel vor',
          },
        },
        voting: {
          votes: {
            fr: 'votes',
            en: 'votes',
            nl: 'stemmen',
            de: 'Stimmen',
          },
          for: {
            fr: 'Pour',
            en: 'For',
            nl: 'Voor',
            de: 'Dafür',
          },
          against: {
            fr: 'Contre',
            en: 'Against',
            nl: 'Tegen',
            de: 'Dagegen',
          },
          abstain: {
            fr: 'Abstentions',
            en: 'Abstentions',
            nl: 'Onthoudingen',
            de: 'Enthaltungen',
          },
          vote: {
            fr: 'Voter',
            en: 'Vote',
            nl: 'Stem',
            de: 'Abstimmen',
          },
          changeVote: {
            fr: 'Changer mon vote',
            en: 'Change my vote',
            nl: 'Wijzig mijn stem',
            de: 'Meine Stimme ändern',
          },
          finalize: {
            fr: 'Finaliser le vote',
            en: 'Finalize vote',
            nl: 'Stem afronden',
            de: 'Abstimmung abschließen',
          },
          youVoted: {
            fr: 'Tu as voté',
            en: 'You voted',
            nl: 'Je hebt gestemd',
            de: 'Du hast gestimmt',
          },
          confirmFinalize: {
            fr: 'Veux-tu finaliser ce vote ?',
            en: 'Do you want to finalize this vote?',
            nl: 'Wil je deze stemming afronden?',
            de: 'Möchtest du diese Abstimmung abschließen?',
          },
        },
        meta: {
          proposedBy: {
            fr: 'Proposé par',
            en: 'Proposed by',
            nl: 'Voorgesteld door',
            de: 'Vorgeschlagen von',
          },
        },
        modal: {
          createTitle: {
            fr: 'Proposer une règle',
            en: 'Propose a rule',
            nl: 'Stel een regel voor',
            de: 'Regel vorschlagen',
          },
          voteTitle: {
            fr: 'Voter',
            en: 'Vote',
            nl: 'Stem',
            de: 'Abstimmen',
          },
          titleLabel: {
            fr: 'Titre *',
            en: 'Title *',
            nl: 'Titel *',
            de: 'Titel *',
          },
          titlePlaceholder: {
            fr: 'Ex: Pas de bruit après 22h',
            en: 'Ex: No noise after 10pm',
            nl: 'Bijv: Geen lawaai na 22u',
            de: 'Z.B.: Keine Geräusche nach 22 Uhr',
          },
          descriptionLabel: {
            fr: 'Description *',
            en: 'Description *',
            nl: 'Beschrijving *',
            de: 'Beschreibung *',
          },
          descriptionPlaceholder: {
            fr: 'Expliquez la règle en détail...',
            en: 'Explain the rule in detail...',
            nl: 'Leg de regel in detail uit...',
            de: 'Erkläre die Regel im Detail...',
          },
          categoryLabel: {
            fr: 'Catégorie *',
            en: 'Category *',
            nl: 'Categorie *',
            de: 'Kategorie *',
          },
          durationLabel: {
            fr: 'Durée du vote (jours)',
            en: 'Voting duration (days)',
            nl: 'Stemperiode (dagen)',
            de: 'Abstimmungsdauer (Tage)',
          },
          durationHelp: {
            fr: 'Le vote se terminera dans {days} jours',
            en: 'The vote will end in {days} days',
            nl: 'De stemming eindigt over {days} dagen',
            de: 'Die Abstimmung endet in {days} Tagen',
          },
          yourVote: {
            fr: 'Votre vote *',
            en: 'Your vote *',
            nl: 'Jouw stem *',
            de: 'Deine Stimme *',
          },
          commentLabel: {
            fr: 'Commentaire (optionnel)',
            en: 'Comment (optional)',
            nl: 'Opmerking (optioneel)',
            de: 'Kommentar (optional)',
          },
          commentPlaceholder: {
            fr: 'Expliquez votre vote...',
            en: 'Explain your vote...',
            nl: 'Leg je stem uit...',
            de: 'Erkläre deine Stimme...',
          },
          cancel: {
            fr: 'Annuler',
            en: 'Cancel',
            nl: 'Annuleren',
            de: 'Abbrechen',
          },
          create: {
            fr: 'Proposer la règle',
            en: 'Propose rule',
            nl: 'Stel regel voor',
            de: 'Regel vorschlagen',
          },
          creating: {
            fr: 'Création...',
            en: 'Creating...',
            nl: 'Aanmaken...',
            de: 'Erstellen...',
          },
          confirmVote: {
            fr: 'Confirmer mon vote',
            en: 'Confirm my vote',
            nl: 'Bevestig mijn stem',
            de: 'Meine Stimme bestätigen',
          },
          voting: {
            fr: 'Vote en cours...',
            en: 'Voting...',
            nl: 'Stemmen...',
            de: 'Abstimmen...',
          },
        },
        errors: {
          fillRequired: {
            fr: 'Veuillez remplir tous les champs obligatoires',
            en: 'Please fill in all required fields',
            nl: 'Vul alle verplichte velden in',
            de: 'Bitte fülle alle erforderlichen Felder aus',
          },
          createError: {
            fr: 'Erreur lors de la création',
            en: 'Error creating rule',
            nl: 'Fout bij het aanmaken',
            de: 'Fehler beim Erstellen',
          },
          voteError: {
            fr: 'Erreur lors du vote',
            en: 'Error voting',
            nl: 'Fout bij het stemmen',
            de: 'Fehler bei der Abstimmung',
          },
          finalizeError: {
            fr: 'Erreur lors de la finalisation',
            en: 'Error finalizing vote',
            nl: 'Fout bij het afronden',
            de: 'Fehler beim Abschließen',
          },
          genericError: {
            fr: 'Une erreur est survenue',
            en: 'An error occurred',
            nl: 'Er is een fout opgetreden',
            de: 'Ein Fehler ist aufgetreten',
          },
        },
      },
      // Documents page translations
      documents: {
        loading: {
          fr: 'Chargement...',
          en: 'Loading...',
          nl: 'Laden...',
          de: 'Laden...',
        },
        backToHub: {
          fr: '← Retour au hub',
          en: '← Back to hub',
          nl: '← Terug naar hub',
          de: '← Zurück zum Hub',
        },
        title: {
          fr: 'Coffre-fort documents',
          en: 'Document vault',
          nl: 'Documentenkluis',
          de: 'Dokumententresor',
        },
        subtitle: {
          fr: 'Stockez et partagez tes documents importants',
          en: 'Store and share your important documents',
          nl: 'Bewaar en deel je belangrijke documenten',
          de: 'Speichere und teile deine wichtigen Dokumente',
        },
        uploadDocument: {
          fr: 'Upload document',
          en: 'Upload document',
          nl: 'Document uploaden',
          de: 'Dokument hochladen',
        },
        stats: {
          total: {
            fr: 'Total Documents',
            en: 'Total Documents',
            nl: 'Totaal Documenten',
            de: 'Dokumente Gesamt',
          },
          storage: {
            fr: 'Stockage utilisé',
            en: 'Storage used',
            nl: 'Gebruikte opslag',
            de: 'Speicher verwendet',
          },
          expiringSoon: {
            fr: 'Expirent bientôt',
            en: 'Expiring soon',
            nl: 'Verloopt binnenkort',
            de: 'Läuft bald ab',
          },
          expired: {
            fr: 'Expirés',
            en: 'Expired',
            nl: 'Verlopen',
            de: 'Abgelaufen',
          },
        },
        search: {
          placeholder: {
            fr: 'Rechercher un document...',
            en: 'Search for a document...',
            nl: 'Zoek een document...',
            de: 'Dokument suchen...',
          },
          all: {
            fr: 'Tous',
            en: 'All',
            nl: 'Alle',
            de: 'Alle',
          },
        },
        emptyState: {
          noDocuments: {
            fr: 'Aucun document',
            en: 'No documents',
            nl: 'Geen documenten',
            de: 'Keine Dokumente',
          },
          uploadFirst: {
            fr: 'Uploadez votre premier document',
            en: 'Upload your first document',
            nl: 'Upload je eerste document',
            de: 'Lade dein erstes Dokument hoch',
          },
        },
        expiration: {
          expiresOn: {
            fr: 'Expire le',
            en: 'Expires on',
            nl: 'Verloopt op',
            de: 'Läuft ab am',
          },
          expired: {
            fr: 'Expiré',
            en: 'Expired',
            nl: 'Verlopen',
            de: 'Abgelaufen',
          },
          expiresSoon: {
            fr: 'Expire bientôt',
            en: 'Expires soon',
            nl: 'Verloopt binnenkort',
            de: 'Läuft bald ab',
          },
        },
        private: {
          fr: 'Privé',
          en: 'Private',
          nl: 'Privé',
          de: 'Privat',
        },
        modal: {
          uploadTitle: {
            fr: 'Upload un document',
            en: 'Upload a document',
            nl: 'Upload een document',
            de: 'Dokument hochladen',
          },
          detailsTitle: {
            fr: 'Détails du document',
            en: 'Document details',
            nl: 'Documentdetails',
            de: 'Dokumentdetails',
          },
          fileLabel: {
            fr: 'Fichier *',
            en: 'File *',
            nl: 'Bestand *',
            de: 'Datei *',
          },
          dragDrop: {
            fr: 'Glissez un fichier ici ou cliquez pour sélectionner',
            en: 'Drag a file here or click to select',
            nl: 'Sleep een bestand hierheen of klik om te selecteren',
            de: 'Ziehe eine Datei hierher oder klicke zum Auswählen',
          },
          fileTypes: {
            fr: 'PDF, Images, Documents (Max 50MB)',
            en: 'PDF, Images, Documents (Max 50MB)',
            nl: 'PDF, Afbeeldingen, Documenten (Max 50MB)',
            de: 'PDF, Bilder, Dokumente (Max 50MB)',
          },
          changeFile: {
            fr: 'Changer de fichier',
            en: 'Change file',
            nl: 'Verander bestand',
            de: 'Datei ändern',
          },
          titleLabel: {
            fr: 'Titre *',
            en: 'Title *',
            nl: 'Titel *',
            de: 'Titel *',
          },
          titlePlaceholder: {
            fr: 'Ex: Contrat de résidence 2024',
            en: 'Ex: Lease contract 2024',
            nl: 'Bijv: Huurcontract 2024',
            de: 'Z.B.: Mietvertrag 2024',
          },
          descriptionLabel: {
            fr: 'Description (optionnel)',
            en: 'Description (optional)',
            nl: 'Beschrijving (optioneel)',
            de: 'Beschreibung (optional)',
          },
          descriptionPlaceholder: {
            fr: 'Ajoutez des détails sur ce document...',
            en: 'Add details about this document...',
            nl: 'Voeg details toe over dit document...',
            de: 'Füge Details zu diesem Dokument hinzu...',
          },
          categoryLabel: {
            fr: 'Catégorie *',
            en: 'Category *',
            nl: 'Categorie *',
            de: 'Kategorie *',
          },
          expirationLabel: {
            fr: "Date d'expiration (optionnel)",
            en: 'Expiration date (optional)',
            nl: 'Vervaldatum (optioneel)',
            de: 'Ablaufdatum (optional)',
          },
          privateLabel: {
            fr: 'Document privé (visible uniquement par moi)',
            en: 'Private document (visible only to me)',
            nl: 'Privédocument (alleen voor mij zichtbaar)',
            de: 'Privates Dokument (nur für mich sichtbar)',
          },
          cancel: {
            fr: 'Annuler',
            en: 'Cancel',
            nl: 'Annuleren',
            de: 'Abbrechen',
          },
          upload: {
            fr: 'Uploader',
            en: 'Upload',
            nl: 'Uploaden',
            de: 'Hochladen',
          },
          uploading: {
            fr: 'Upload...',
            en: 'Uploading...',
            nl: 'Uploaden...',
            de: 'Hochladen...',
          },
          download: {
            fr: 'Télécharger',
            en: 'Download',
            nl: 'Downloaden',
            de: 'Herunterladen',
          },
          delete: {
            fr: 'Supprimer',
            en: 'Delete',
            nl: 'Verwijderen',
            de: 'Löschen',
          },
          uploadedBy: {
            fr: 'Uploadé par',
            en: 'Uploaded by',
            nl: 'Geüpload door',
            de: 'Hochgeladen von',
          },
          uploadDate: {
            fr: "Date d'upload",
            en: 'Upload date',
            nl: 'Uploaddatum',
            de: 'Upload-Datum',
          },
          expirationDate: {
            fr: "Date d'expiration",
            en: 'Expiration date',
            nl: 'Vervaldatum',
            de: 'Ablaufdatum',
          },
        },
        errors: {
          titleRequired: {
            fr: 'Veuillez donner un titre au document',
            en: 'Please give the document a title',
            nl: 'Geef het document een titel',
            de: 'Bitte gib dem Dokument einen Titel',
          },
          uploadError: {
            fr: "Erreur lors de l'upload",
            en: 'Error uploading',
            nl: 'Fout bij uploaden',
            de: 'Fehler beim Hochladen',
          },
          deleteConfirm: {
            fr: 'Veux-tu vraiment supprimer ce document ?',
            en: 'Do you really want to delete this document?',
            nl: 'Wil je dit document echt verwijderen?',
            de: 'Möchtest du dieses Dokument wirklich löschen?',
          },
          deleteError: {
            fr: 'Erreur lors de la suppression',
            en: 'Error deleting',
            nl: 'Fout bij verwijderen',
            de: 'Fehler beim Löschen',
          },
          genericError: {
            fr: 'Une erreur est survenue',
            en: 'An error occurred',
            nl: 'Er is een fout opgetreden',
            de: 'Ein Fehler ist aufgetreten',
          },
        },
      },
      // Maintenance page translations
      maintenance: {
        loading: {
          fr: 'Chargement...',
          en: 'Loading...',
          nl: 'Laden...',
          de: 'Laden...',
        },
        backToHub: {
          fr: '← Retour au hub',
          en: '← Back to hub',
          nl: '← Terug naar hub',
          de: '← Zurück zum Hub',
        },
        title: {
          fr: 'Maintenance',
          en: 'Maintenance',
          nl: 'Onderhoud',
          de: 'Wartung',
        },
        subtitle: {
          fr: 'Signalez et suivez les problèmes techniques',
          en: 'Report and track technical issues',
          nl: 'Meld en volg technische problemen',
          de: 'Melde und verfolge technische Probleme',
        },
        newTicket: {
          fr: 'Nouveau ticket',
          en: 'New ticket',
          nl: 'Nieuw ticket',
          de: 'Neues Ticket',
        },
        stats: {
          total: {
            fr: 'Total',
            en: 'Total',
            nl: 'Totaal',
            de: 'Gesamt',
          },
          open: {
            fr: 'Ouverts',
            en: 'Open',
            nl: 'Open',
            de: 'Offen',
          },
          inProgress: {
            fr: 'En cours',
            en: 'In progress',
            nl: 'Bezig',
            de: 'In Bearbeitung',
          },
          resolved: {
            fr: 'Résolus',
            en: 'Resolved',
            nl: 'Opgelost',
            de: 'Gelöst',
          },
        },
        emptyState: {
          noRequests: {
            fr: 'Aucune demande',
            en: 'No requests',
            nl: 'Geen verzoeken',
            de: 'Keine Anfragen',
          },
          createFirst: {
            fr: 'Crée ta première demande de maintenance',
            en: 'Create your first maintenance request',
            nl: 'Maak je eerste onderhoudsverzoek',
            de: 'Erstelle deine erste Wartungsanfrage',
          },
          newRequest: {
            fr: 'Nouvelle demande',
            en: 'New request',
            nl: 'Nieuw verzoek',
            de: 'Neue Anfrage',
          },
        },
        actions: {
          start: {
            fr: 'Commencer',
            en: 'Start',
            nl: 'Start',
            de: 'Starten',
          },
          markResolved: {
            fr: 'Marquer résolu',
            en: 'Mark resolved',
            nl: 'Markeer als opgelost',
            de: 'Als gelöst markieren',
          },
        },
        cost: {
          estimated: {
            fr: 'estimé',
            en: 'estimated',
            nl: 'geschat',
            de: 'geschätzt',
          },
          actual: {
            fr: 'réel',
            en: 'actual',
            nl: 'werkelijk',
            de: 'tatsächlich',
          },
        },
        modal: {
          title: {
            fr: 'Nouvelle demande',
            en: 'New request',
            nl: 'Nieuw verzoek',
            de: 'Neue Anfrage',
          },
          titleLabel: {
            fr: 'Titre *',
            en: 'Title *',
            nl: 'Titel *',
            de: 'Titel *',
          },
          titlePlaceholder: {
            fr: "Ex: Fuite d'eau dans la salle de bain",
            en: 'Ex: Water leak in the bathroom',
            nl: 'Bijv: Waterlek in de badkamer',
            de: 'Z.B.: Wasserleck im Badezimmer',
          },
          descriptionLabel: {
            fr: 'Description *',
            en: 'Description *',
            nl: 'Beschrijving *',
            de: 'Beschreibung *',
          },
          descriptionPlaceholder: {
            fr: 'Décrivez le problème en détail...',
            en: 'Describe the problem in detail...',
            nl: 'Beschrijf het probleem in detail...',
            de: 'Beschreibe das Problem im Detail...',
          },
          categoryLabel: {
            fr: 'Catégorie *',
            en: 'Category *',
            nl: 'Categorie *',
            de: 'Kategorie *',
          },
          priorityLabel: {
            fr: 'Priorité *',
            en: 'Priority *',
            nl: 'Prioriteit *',
            de: 'Priorität *',
          },
          locationLabel: {
            fr: 'Localisation (optionnel)',
            en: 'Location (optional)',
            nl: 'Locatie (optioneel)',
            de: 'Ort (optional)',
          },
          locationPlaceholder: {
            fr: 'Ex: Cuisine, Salle de bain',
            en: 'Ex: Kitchen, Bathroom',
            nl: 'Bijv: Keuken, Badkamer',
            de: 'Z.B.: Küche, Badezimmer',
          },
          costLabel: {
            fr: 'Coût estimé (optionnel)',
            en: 'Estimated cost (optional)',
            nl: 'Geschatte kosten (optioneel)',
            de: 'Geschätzte Kosten (optional)',
          },
          photosLabel: {
            fr: 'Photos (max 5)',
            en: 'Photos (max 5)',
            nl: "Foto's (max 5)",
            de: 'Fotos (max 5)',
          },
          addPhotos: {
            fr: 'Cliquez pour ajouter des photos',
            en: 'Click to add photos',
            nl: "Klik om foto's toe te voegen",
            de: 'Klicken zum Hinzufügen von Fotos',
          },
          cancel: {
            fr: 'Annuler',
            en: 'Cancel',
            nl: 'Annuleren',
            de: 'Abbrechen',
          },
          create: {
            fr: 'Créer la demande',
            en: 'Create request',
            nl: 'Verzoek aanmaken',
            de: 'Anfrage erstellen',
          },
          creating: {
            fr: 'Création...',
            en: 'Creating...',
            nl: 'Aanmaken...',
            de: 'Erstellen...',
          },
        },
        errors: {
          fillRequired: {
            fr: 'Veuillez remplir tous les champs obligatoires',
            en: 'Please fill in all required fields',
            nl: 'Vul alle verplichte velden in',
            de: 'Bitte fülle alle erforderlichen Felder aus',
          },
          createError: {
            fr: 'Erreur lors de la création',
            en: 'Error creating request',
            nl: 'Fout bij aanmaken',
            de: 'Fehler beim Erstellen',
          },
          updateError: {
            fr: 'Erreur lors de la mise à jour',
            en: 'Error updating',
            nl: 'Fout bij bijwerken',
            de: 'Fehler beim Aktualisieren',
          },
          genericError: {
            fr: 'Une erreur est survenue',
            en: 'An error occurred',
            nl: 'Er is een fout opgetreden',
            de: 'Ein Fehler ist aufgetreten',
          },
        },
      },
      // Messages page translations
      messages: {
        loading: {
          title: {
            fr: 'Chargement des messages...',
            en: 'Loading messages...',
            nl: 'Berichten laden...',
            de: 'Nachrichten laden...',
          },
          subtitle: {
            fr: 'Préparation de tes conversations',
            en: 'Preparing your conversations',
            nl: 'Je gesprekken voorbereiden',
            de: 'Deine Konversationen werden vorbereitet',
          },
        },
        emptyChat: {
          title: {
            fr: 'Soyez le premier à envoyer un message dans cette conversation !',
            en: 'Be the first to send a message in this conversation!',
            nl: 'Wees de eerste die een bericht stuurt in dit gesprek!',
            de: 'Sei der erste, der eine Nachricht in diesem Gespräch sendet!',
          },
        },
        errors: {
          loadError: {
            fr: 'Erreur lors du chargement des conversations',
            en: 'Error loading conversations',
            nl: 'Fout bij het laden van gesprekken',
            de: 'Fehler beim Laden der Konversationen',
          },
          sendError: {
            fr: "Échec de l'envoi du message",
            en: 'Failed to send message',
            nl: 'Bericht verzenden mislukt',
            de: 'Nachricht konnte nicht gesendet werden',
          },
          archiveSuccess: {
            fr: 'Conversation archivée',
            en: 'Conversation archived',
            nl: 'Gesprek gearchiveerd',
            de: 'Konversation archiviert',
          },
          archiveError: {
            fr: "Échec de l'archivage",
            en: 'Failed to archive',
            nl: 'Archiveren mislukt',
            de: 'Archivieren fehlgeschlagen',
          },
          genericError: {
            fr: 'Erreur de chargement',
            en: 'Loading error',
            nl: 'Laadfout',
            de: 'Ladefehler',
          },
        },
        defaultUser: {
          fr: 'Utilisateur',
          en: 'User',
          nl: 'Gebruiker',
          de: 'Benutzer',
        },
      },
    },

    // Matching Section
    matching: {
      cardPile: {
        like: {
          fr: 'LIKE',
          en: 'LIKE',
          nl: 'LIKE',
          de: 'LIKE',
        },
        nope: {
          fr: 'NOPE',
          en: 'NOPE',
          nl: 'NOPE',
          de: 'NOPE',
        },
        profile: {
          fr: 'profil',
          en: 'profile',
          nl: 'profiel',
          de: 'Profil',
        },
        profiles: {
          fr: 'profils',
          en: 'profiles',
          nl: 'profielen',
          de: 'Profile',
        },
        empty: {
          fr: 'Vide',
          en: 'Empty',
          nl: 'Leeg',
          de: 'Leer',
        },
        undo: {
          fr: 'Annuler',
          en: 'Undo',
          nl: 'Ongedaan maken',
          de: 'Rückgängig',
        },
      },
      // Common translations
      common: {
        loading: {
          fr: 'Chargement des profils...',
          en: 'Loading profiles...',
          nl: 'Profielen laden...',
          de: 'Profile werden geladen...',
        },
        loadingMatches: {
          fr: 'Chargement de tes matchs...',
          en: 'Loading your matches...',
          nl: 'Je matches laden...',
          de: 'Deine Matches werden geladen...',
        },
      },
      // Browse matching mode
      browse: {
        findRoommates: {
          fr: 'Trouve tes futurs',
          en: 'Find your future',
          nl: 'Vind je toekomstige',
          de: 'Finde deine zukünftigen',
        },
        roommates: {
          fr: 'résidents',
          en: 'roommates',
          nl: 'huisgenoten',
          de: 'Mitbewohner',
        },
        swipeToCreate: {
          fr: 'Swipe pour créer ton groupe idéal',
          en: 'Swipe to create your ideal group',
          nl: 'Swipe om je ideale groep te maken',
          de: 'Swipe, um deine ideale Gruppe zu erstellen',
        },
      },
      // Profile completion gate
      gate: {
        title: {
          fr: 'Complète ton profil pour matcher',
          en: 'Complete your profile to match',
          nl: 'Vul je profiel in om te matchen',
          de: 'Vervollständige dein Profil zum Matchen',
        },
        description: {
          fr: 'Pour trouver les meilleurs résidents, nous avons besoin de mieux te connaître.',
          en: 'To find the best roommates, we need to know you better.',
          nl: 'Om de beste huisgenoten te vinden, moeten we je beter leren kennen.',
          de: 'Um die besten Mitbewohner zu finden, müssen wir dich besser kennenlernen.',
        },
        requirement: {
          fr: 'Complète ton profil à au moins',
          en: 'Complete your profile to at least',
          nl: 'Vul je profiel in tot minstens',
          de: 'Vervollständige dein Profil auf mindestens',
        },
        toUnlock: {
          fr: 'pour débloquer le matching',
          en: 'to unlock matching',
          nl: 'om matching te ontgrendelen',
          de: 'um das Matching freizuschalten',
        },
        progress: {
          fr: 'Progression',
          en: 'Progress',
          nl: 'Voortgang',
          de: 'Fortschritt',
        },
        fieldsFilled: {
          fr: 'champs complétés',
          en: 'fields completed',
          nl: 'velden ingevuld',
          de: 'Felder ausgefüllt',
        },
        sectionsToComplete: {
          fr: 'Sections à compléter',
          en: 'Sections to complete',
          nl: 'Secties om in te vullen',
          de: 'Auszufüllende Abschnitte',
        },
        completeProfile: {
          fr: 'Compléter mon Living Persona',
          en: 'Complete my profile',
          nl: 'Mijn profiel voltooien',
          de: 'Mein Profil vervollständigen',
        },
        backToDashboard: {
          fr: 'Retour au tableau de bord',
          en: 'Back to dashboard',
          nl: 'Terug naar dashboard',
          de: 'Zurück zum Dashboard',
        },
        info: {
          fr: 'Un profil complet permet des matchs plus précis et augmente tes chances de trouver le résident idéal.',
          en: 'A complete profile allows for more accurate matches and increases your chances of finding the ideal roommate.',
          nl: 'Een volledig profiel zorgt voor nauwkeurigere matches en vergroot je kans om de ideale huisgenoot te vinden.',
          de: 'Ein vollständiges Profil ermöglicht genauere Matches und erhöht deine Chancen, den idealen Mitbewohner zu finden.',
        },
      },
      // Swipe page
      swipe: {
        title: {
          fr: 'Trouvez votre match',
          en: 'Find your match',
          nl: 'Vind je match',
          de: 'Finde deinen Match',
        },
        searcherContext: {
          fr: 'Trouver des résidents pour chercher ensemble',
          en: 'Find roommates to search together',
          nl: 'Vind huisgenoten om samen te zoeken',
          de: 'Finde Mitbewohner zum gemeinsamen Suchen',
        },
        residentContext: {
          fr: 'Trouver de nouveaux résidents',
          en: 'Find new roommates',
          nl: 'Vind nieuwe huisgenoten',
          de: 'Finde neue Mitbewohner',
        },
        searchers: {
          fr: 'Chercheurs',
          en: 'Searchers',
          nl: 'Zoekers',
          de: 'Suchende',
        },
        roommates: {
          fr: 'Résidents',
          en: 'Roommates',
          nl: 'Huisgenoten',
          de: 'Mitbewohner',
        },
        profilesRemaining: {
          fr: 'Profils restants',
          en: 'Profiles remaining',
          nl: 'Resterende profielen',
          de: 'Verbleibende Profile',
        },
        allSeen: {
          title: {
            fr: 'Tu as tout vu !',
            en: "You've seen everyone!",
            nl: 'Je hebt iedereen gezien!',
            de: 'Du hast alle gesehen!',
          },
          description: {
            fr: 'Revenez plus tard pour de nouveaux profils ou ajustez tes préférences.',
            en: 'Come back later for new profiles or adjust your preferences.',
            nl: 'Kom later terug voor nieuwe profielen of pas je voorkeuren aan.',
            de: 'Komm später für neue Profile zurück oder passe deine Präferenzen an.',
          },
        },
        reload: {
          fr: 'Recharger',
          en: 'Reload',
          nl: 'Herladen',
          de: 'Neu laden',
        },
        viewMatches: {
          fr: 'Voir mes matchs',
          en: 'View my matches',
          nl: 'Mijn matches bekijken',
          de: 'Meine Matches ansehen',
        },
        whyMatch: {
          fr: 'Pourquoi ce match ?',
          en: 'Why this match?',
          nl: 'Waarom deze match?',
          de: 'Warum dieser Match?',
        },
        breakdown: {
          lifestyle: {
            fr: 'Style de vie',
            en: 'Lifestyle',
            nl: 'Levensstijl',
            de: 'Lebensstil',
          },
          social: {
            fr: 'Social',
            en: 'Social',
            nl: 'Sociaal',
            de: 'Sozial',
          },
          practical: {
            fr: 'Pratique',
            en: 'Practical',
            nl: 'Praktisch',
            de: 'Praktisch',
          },
          values: {
            fr: 'Valeurs',
            en: 'Values',
            nl: 'Waarden',
            de: 'Werte',
          },
          preferences: {
            fr: 'Prefs',
            en: 'Prefs',
            nl: 'Voork.',
            de: 'Präfs.',
          },
        },
        strengths: {
          fr: 'Points forts',
          en: 'Strengths',
          nl: 'Sterke punten',
          de: 'Stärken',
        },
        considerations: {
          fr: 'Points d\'attention',
          en: 'Considerations',
          nl: 'Aandachtspunten',
          de: 'Zu beachten',
        },
        dashboard: {
          fr: 'Tableau de bord',
          en: 'Dashboard',
          nl: 'Dashboard',
          de: 'Dashboard',
        },
        matchesAndGroups: {
          fr: 'Matchs & Groupes',
          en: 'Matches & Groups',
          nl: 'Matches & Groepen',
          de: 'Matches & Gruppen',
        },
        toasts: {
          profileLiked: {
            fr: 'Profil liké !',
            en: 'Profile liked! 💚',
            nl: 'Profiel geliked! 💚',
            de: 'Profil geliked! 💚',
          },
          matchDescription: {
            fr: 'Si cette personne te like aussi, c\'est un match !',
            en: "If they like you back, it's a match!",
            nl: 'Als ze je ook liken, is het een match!',
            de: 'Wenn sie dich auch liken, ist es ein Match!',
          },
          swipeError: {
            fr: 'Échec de l\'enregistrement. Réessayez.',
            en: 'Failed to record swipe. Please try again.',
            nl: 'Swipe opslaan mislukt. Probeer opnieuw.',
            de: 'Swipe konnte nicht gespeichert werden. Bitte erneut versuchen.',
          },
          undoError: {
            fr: 'Impossible d\'annuler',
            en: 'Unable to undo swipe',
            nl: 'Kan swipe niet ongedaan maken',
            de: 'Swipe kann nicht rückgängig gemacht werden',
          },
          undoSuccess: {
            fr: 'Swipe annulé !',
            en: 'Swipe undone!',
            nl: 'Swipe ongedaan gemaakt!',
            de: 'Swipe rückgängig gemacht!',
          },
          undoErrorGeneric: {
            fr: 'Erreur lors de l\'annulation',
            en: 'Error during undo',
            nl: 'Fout tijdens ongedaan maken',
            de: 'Fehler beim Rückgängigmachen',
          },
          profilesReloaded: {
            fr: 'Profils rechargés !',
            en: 'Profiles reloaded!',
            nl: 'Profielen herladen!',
            de: 'Profile neu geladen!',
          },
          fullProfileComingSoon: {
            fr: 'Vue complète du profil bientôt disponible !',
            en: 'Full profile view coming soon!',
            nl: 'Volledige profielweergave komt binnenkort!',
            de: 'Vollständige Profilansicht kommt bald!',
          },
        },
      },
      // Properties matching page
      properties: {
        title: {
          fr: 'Vos matchs',
          en: 'Your Matches',
          nl: 'Je matches',
          de: 'Deine Matches',
        },
        propertySingular: {
          fr: 'propriété trouvée',
          en: 'property found',
          nl: 'woning gevonden',
          de: 'Immobilie gefunden',
        },
        propertiesPlural: {
          fr: 'propriétés trouvées',
          en: 'properties found',
          nl: 'woningen gevonden',
          de: 'Immobilien gefunden',
        },
        refresh: {
          fr: 'Actualiser',
          en: 'Refresh',
          nl: 'Vernieuwen',
          de: 'Aktualisieren',
        },
        generating: {
          fr: 'Génération...',
          en: 'Generating...',
          nl: 'Genereren...',
          de: 'Wird generiert...',
        },
        generateNew: {
          fr: 'Générer de nouveaux Living Matchs',
          en: 'Generate new matches',
          nl: 'Nieuwe matches genereren',
          de: 'Neue Matches generieren',
        },
        stats: {
          total: {
            fr: 'Total',
            en: 'Total',
            nl: 'Totaal',
            de: 'Gesamt',
          },
          viewed: {
            fr: 'Vus',
            en: 'Viewed',
            nl: 'Bekeken',
            de: 'Angesehen',
          },
          contacted: {
            fr: 'Contactés',
            en: 'Contacted',
            nl: 'Gecontacteerd',
            de: 'Kontaktiert',
          },
          averageScore: {
            fr: 'Score moyen',
            en: 'Average score',
            nl: 'Gemiddelde score',
            de: 'Durchschnittliche Punktzahl',
          },
          topScore: {
            fr: 'Meilleur score',
            en: 'Top score',
            nl: 'Topscore',
            de: 'Höchste Punktzahl',
          },
        },
        filters: {
          title: {
            fr: 'Filtres',
            en: 'Filters',
            nl: 'Filters',
            de: 'Filter',
          },
          minScore: {
            fr: 'Score minimum',
            en: 'Minimum score',
            nl: 'Minimumscore',
            de: 'Mindestpunktzahl',
          },
          status: {
            fr: 'Statut',
            en: 'Status',
            nl: 'Status',
            de: 'Status',
          },
          active: {
            fr: 'Actif',
            en: 'Active',
            nl: 'Actief',
            de: 'Aktiv',
          },
          viewed: {
            fr: 'Vu',
            en: 'Viewed',
            nl: 'Bekeken',
            de: 'Angesehen',
          },
          contacted: {
            fr: 'Contacté',
            en: 'Contacted',
            nl: 'Gecontacteerd',
            de: 'Kontaktiert',
          },
        },
        empty: {
          title: {
            fr: 'Aucun match trouvé',
            en: 'No matches found',
            nl: 'Geen matches gevonden',
            de: 'Keine Matches gefunden',
          },
          noFilter: {
            fr: 'Sélectionnez au moins un filtre de statut',
            en: 'Select at least one status filter',
            nl: 'Selecteer minstens één statusfilter',
            de: 'Wähle mindestens einen Statusfilter',
          },
          suggestion: {
            fr: 'Essaie de baisser le score minimum ou de générer de nouveaux Living Matchs',
            en: 'Try lowering the minimum score or generating new matches',
            nl: 'Probeer de minimumscore te verlagen of nieuwe matches te genereren',
            de: 'Versuche die Mindestpunktzahl zu senken oder neue Matches zu generieren',
          },
          lowerScore: {
            fr: 'Baisser le score minimum',
            en: 'Lower minimum score',
            nl: 'Minimumscore verlagen',
            de: 'Mindestpunktzahl senken',
          },
          generate: {
            fr: 'Générer des matchs',
            en: 'Generate matches',
            nl: 'Matches genereren',
            de: 'Matches generieren',
          },
        },
        info: {
          title: {
            fr: 'Comment ça marche ?',
            en: 'How does it work?',
            nl: 'Hoe werkt het?',
            de: 'Wie funktioniert es?',
          },
          description: {
            fr: 'Les matchs sont calculés selon votre budget (30%), localisation (25%), style de vie (20%), disponibilité (15%) et préférences (10%). Plus le score est élevé, plus la propriété correspond à tes critères.',
            en: 'Matches are calculated based on your budget (30%), location (25%), lifestyle (20%), availability (15%) and preferences (10%). The higher the score, the better the property matches your criteria.',
            nl: 'Matches worden berekend op basis van je budget (30%), locatie (25%), levensstijl (20%), beschikbaarheid (15%) en voorkeuren (10%). Hoe hoger de score, hoe beter de woning bij je criteria past.',
            de: 'Matches werden basierend auf deinem Budget (30%), Standort (25%), Lebensstil (20%), Verfügbarkeit (15%) und Präferenzen (10%) berechnet. Je höher die Punktzahl, desto besser passt die Immobilie zu deinen Kriterien.',
          },
        },
        toasts: {
          searcherOnly: {
            fr: 'Cette page est réservée aux chercheurs',
            en: 'This page is for searchers only',
            nl: 'Deze pagina is alleen voor zoekers',
            de: 'Diese Seite ist nur für Suchende',
          },
          loadError: {
            fr: 'Impossible de charger les matchs',
            en: 'Unable to load matches',
            nl: 'Kan matches niet laden',
            de: 'Matches konnten nicht geladen werden',
          },
          generatingNew: {
            fr: 'Génération de nouveaux Living Matchs...',
            en: 'Generating new matches...',
            nl: 'Nieuwe matches genereren...',
            de: 'Neue Matches werden generiert...',
          },
          newMatchesGenerated: {
            fr: 'nouveaux Living Matchs générés !',
            en: 'new matches generated!',
            nl: 'nieuwe matches gegenereerd!',
            de: 'neue Matches generiert!',
          },
          generateError: {
            fr: 'Impossible de générer les matchs',
            en: 'Unable to generate matches',
            nl: 'Kan matches niet genereren',
            de: 'Matches konnten nicht generiert werden',
          },
          contactSent: {
            fr: 'Demande de contact envoyée !',
            en: 'Contact request sent!',
            nl: 'Contactverzoek verzonden!',
            de: 'Kontaktanfrage gesendet!',
          },
          contactError: {
            fr: 'Impossible de contacter le propriétaire',
            en: 'Unable to contact owner',
            nl: 'Kan eigenaar niet contacteren',
            de: 'Eigentümer konnte nicht kontaktiert werden',
          },
          matchHidden: {
            fr: 'Match masqué',
            en: 'Match hidden',
            nl: 'Match verborgen',
            de: 'Match ausgeblendet',
          },
          hideError: {
            fr: 'Impossible de masquer ce match',
            en: 'Unable to hide this match',
            nl: 'Kan deze match niet verbergen',
            de: 'Dieser Match konnte nicht ausgeblendet werden',
          },
        },
      },
    },

    // Messaging Section
    messaging: {
      back: {
        fr: 'Retour',
        en: 'Back',
        nl: 'Terug',
        de: 'Zurück',
      },
      isTyping: {
        fr: 'est en train d\'écrire',
        en: 'is typing',
        nl: 'is aan het typen',
        de: 'schreibt',
      },
      moreOptions: {
        fr: 'Plus d\'options',
        en: 'More options',
        nl: 'Meer opties',
        de: 'Mehr Optionen',
      },
      archive: {
        fr: 'Archiver',
        en: 'Archive',
        nl: 'Archiveren',
        de: 'Archivieren',
      },
      delete: {
        fr: 'Supprimer',
        en: 'Delete',
        nl: 'Verwijderen',
        de: 'Löschen',
      },
      placeholder: {
        fr: 'Écrivez votre message...',
        en: 'Write your message...',
        nl: 'Schrijf je bericht...',
        de: 'Schreibe deine Nachricht...',
      },
      edited: {
        fr: 'modifié',
        en: 'edited',
        nl: 'bewerkt',
        de: 'bearbeitet',
      },
      today: {
        fr: 'Aujourd\'hui',
        en: 'Today',
        nl: 'Vandaag',
        de: 'Heute',
      },
      yesterday: {
        fr: 'Hier',
        en: 'Yesterday',
        nl: 'Gisteren',
        de: 'Gestern',
      },
      searchPlaceholder: {
        fr: 'Rechercher une conversation...',
        en: 'Search a conversation...',
        nl: 'Zoek een gesprek...',
        de: 'Suche eine Konversation...',
      },
      noArchivedConversations: {
        fr: 'Aucune conversation archivée',
        en: 'No archived conversations',
        nl: 'Geen gearchiveerde gesprekken',
        de: 'Keine archivierten Konversationen',
      },
      noConversations: {
        fr: 'Aucune conversation',
        en: 'No conversations',
        nl: 'Geen gesprekken',
        de: 'Keine Konversationen',
      },
      archivedWillAppear: {
        fr: 'Les conversations archivées apparaîtront ici',
        en: 'Archived conversations will appear here',
        nl: 'Gearchiveerde gesprekken verschijnen hier',
        de: 'Archivierte Konversationen erscheinen hier',
      },
      conversationsWillAppear: {
        fr: 'Vos conversations apparaîtront ici',
        en: 'Your conversations will appear here',
        nl: 'Je gesprekken verschijnen hier',
        de: 'Deine Konversationen erscheinen hier',
      },
      online: {
        fr: 'En ligne',
        en: 'Online',
        nl: 'Online',
        de: 'Online',
      },
      noMessagesYet: {
        fr: 'Pas encore de messages',
        en: 'No messages yet',
        nl: 'Nog geen berichten',
        de: 'Noch keine Nachrichten',
      },
    },

    // Unified Messaging (UnifiedConversationList)
    unifiedMessaging: {
      title: {
        fr: 'Messages',
        en: 'Messages',
        nl: 'Berichten',
        de: 'Nachrichten',
      },
      conversation: {
        fr: 'conversation',
        en: 'conversation',
        nl: 'gesprek',
        de: 'Konversation',
      },
      conversations: {
        fr: 'conversations',
        en: 'conversations',
        nl: 'gesprekken',
        de: 'Konversationen',
      },
      searchPlaceholder: {
        fr: 'Rechercher une conversation...',
        en: 'Search a conversation...',
        nl: 'Zoek een gesprek...',
        de: 'Suche eine Konversation...',
      },
      inviteBoth: {
        fr: 'Invitez votre propriétaire et tes résidents',
        en: 'Invite your landlord and roommates',
        nl: 'Nodig je verhuurder en huisgenoten uit',
        de: 'Laden Sie Ihren Vermieter und Mitbewohner ein',
      },
      inviteOwner: {
        fr: 'Invitez votre propriétaire',
        en: 'Invite your landlord',
        nl: 'Nodig je verhuurder uit',
        de: 'Laden Sie Ihren Vermieter ein',
      },
      inviteRoommates: {
        fr: 'Invitez tes résidents',
        en: 'Invite your roommates',
        nl: 'Nodig je huisgenoten uit',
        de: 'Laden Sie Ihre Mitbewohner ein',
      },
      ownerButton: {
        fr: 'Propriétaire',
        en: 'Landlord',
        nl: 'Verhuurder',
        de: 'Vermieter',
      },
      roommatesButton: {
        fr: 'Résidents',
        en: 'Roommates',
        nl: 'Huisgenoten',
        de: 'Mitbewohner',
      },
      pinned: {
        fr: 'Épinglées',
        en: 'Pinned',
        nl: 'Vastgezet',
        de: 'Angeheftet',
      },
      conversationsHeader: {
        fr: 'Conversations',
        en: 'Conversations',
        nl: 'Gesprekken',
        de: 'Konversationen',
      },
      noResults: {
        fr: 'Aucun résultat',
        en: 'No results',
        nl: 'Geen resultaten',
        de: 'Keine Ergebnisse',
      },
      noConversations: {
        fr: 'Aucune conversation',
        en: 'No conversations',
        nl: 'Geen gesprekken',
        de: 'Keine Konversationen',
      },
      tryOtherTerms: {
        fr: 'Essayez avec d\'autres termes de recherche',
        en: 'Try with other search terms',
        nl: 'Probeer andere zoektermen',
        de: 'Versuchen Sie andere Suchbegriffe',
      },
      conversationsWillAppear: {
        fr: 'Vos conversations apparaîtront ici',
        en: 'Your conversations will appear here',
        nl: 'Je gesprekken verschijnen hier',
        de: 'Deine Konversationen erscheinen hier',
      },
      now: {
        fr: 'maintenant',
        en: 'now',
        nl: 'nu',
        de: 'jetzt',
      },
      minShort: {
        fr: 'min',
        en: 'min',
        nl: 'min',
        de: 'min',
      },
      hourShort: {
        fr: 'h',
        en: 'h',
        nl: 'u',
        de: 'h',
      },
      yesterday: {
        fr: 'Hier',
        en: 'Yesterday',
        nl: 'Gisteren',
        de: 'Gestern',
      },
      dayShort: {
        fr: 'j',
        en: 'd',
        nl: 'd',
        de: 'T',
      },
    },

    // Expense Scanner Component
    expenseScanner: {
      // Step labels
      stepScan: {
        fr: 'Scanner',
        en: 'Scan',
        nl: 'Scannen',
        de: 'Scannen',
      },
      stepVerify: {
        fr: 'Vérifier',
        en: 'Verify',
        nl: 'Controleren',
        de: 'Überprüfen',
      },
      stepCategory: {
        fr: 'Catégorie',
        en: 'Category',
        nl: 'Categorie',
        de: 'Kategorie',
      },
      stepSplit: {
        fr: 'Répartir',
        en: 'Split',
        nl: 'Verdelen',
        de: 'Aufteilen',
      },
      stepOf: {
        fr: 'Étape {current}/4 •',
        en: 'Step {current}/4 •',
        nl: 'Stap {current}/4 •',
        de: 'Schritt {current}/4 •',
      },
      // Upload step
      scanTitle: {
        fr: 'Scannez votre ticket',
        en: 'Scan your receipt',
        nl: 'Scan je kassabon',
        de: 'Scannen Sie Ihren Beleg',
      },
      scanDescription: {
        fr: "L'IA analyse automatiquement tes reçus",
        en: 'AI automatically analyzes your receipts',
        nl: 'AI analyseert automatisch je bonnen',
        de: 'KI analysiert automatisch Ihre Belege',
      },
      takePhoto: {
        fr: 'Prendre une photo',
        en: 'Take a photo',
        nl: 'Foto maken',
        de: 'Foto aufnehmen',
      },
      openCamera: {
        fr: 'Ouvrir la caméra',
        en: 'Open camera',
        nl: 'Camera openen',
        de: 'Kamera öffnen',
      },
      chooseFile: {
        fr: 'Choisir un fichier',
        en: 'Choose a file',
        nl: 'Kies een bestand',
        de: 'Datei auswählen',
      },
      fromGallery: {
        fr: 'Depuis la galerie',
        en: 'From gallery',
        nl: 'Uit galerie',
        de: 'Aus der Galerie',
      },
      cancel: {
        fr: 'Annuler',
        en: 'Cancel',
        nl: 'Annuleren',
        de: 'Abbrechen',
      },
      // Scanning step
      aiAnalysisInProgress: {
        fr: 'Analyse IA en cours...',
        en: 'AI analysis in progress...',
        nl: 'AI-analyse bezig...',
        de: 'KI-Analyse läuft...',
      },
      aiReadingReceipt: {
        fr: 'Notre IA lit votre ticket comme un pro',
        en: 'Our AI reads your receipt like a pro',
        nl: 'Onze AI leest je bon als een pro',
        de: 'Unsere KI liest Ihren Beleg wie ein Profi',
      },
      extractingData: {
        fr: 'Extraction des données du ticket',
        en: 'Extracting receipt data',
        nl: 'Gegevens van bon extraheren',
        de: 'Belegdaten werden extrahiert',
      },
      // Review step
      verifyInfo: {
        fr: 'Vérifiez les informations',
        en: 'Verify the information',
        nl: 'Controleer de informatie',
        de: 'Überprüfen Sie die Informationen',
      },
      dataExtracted: {
        fr: 'Données extraites automatiquement',
        en: 'Data extracted automatically',
        nl: 'Gegevens automatisch geëxtraheerd',
        de: 'Daten automatisch extrahiert',
      },
      enterManually: {
        fr: 'Saisissez les détails manuellement',
        en: 'Enter details manually',
        nl: 'Voer details handmatig in',
        de: 'Geben Sie Details manuell ein',
      },
      scannedReceipt: {
        fr: 'Ticket scanné',
        en: 'Scanned receipt',
        nl: 'Gescande bon',
        de: 'Gescannter Beleg',
      },
      title: {
        fr: 'Titre *',
        en: 'Title *',
        nl: 'Titel *',
        de: 'Titel *',
      },
      titlePlaceholder: {
        fr: 'Ex: Courses de la semaine',
        en: 'E.g.: Weekly groceries',
        nl: 'Bijv.: Wekelijkse boodschappen',
        de: 'Z.B.: Wöchentlicher Einkauf',
      },
      amount: {
        fr: 'Montant (€) *',
        en: 'Amount (€) *',
        nl: 'Bedrag (€) *',
        de: 'Betrag (€) *',
      },
      date: {
        fr: 'Date',
        en: 'Date',
        nl: 'Datum',
        de: 'Datum',
      },
      description: {
        fr: 'Description',
        en: 'Description',
        nl: 'Beschrijving',
        de: 'Beschreibung',
      },
      optional: {
        fr: 'Optionnel',
        en: 'Optional',
        nl: 'Optioneel',
        de: 'Optional',
      },
      articles: {
        fr: 'Articles',
        en: 'Items',
        nl: 'Artikelen',
        de: 'Artikel',
      },
      addArticle: {
        fr: 'Ajouter',
        en: 'Add',
        nl: 'Toevoegen',
        de: 'Hinzufügen',
      },
      articleName: {
        fr: "Nom de l'article",
        en: 'Item name',
        nl: 'Artikelnaam',
        de: 'Artikelname',
      },
      noArticlesDetected: {
        fr: 'Aucun article détecté',
        en: 'No items detected',
        nl: 'Geen artikelen gedetecteerd',
        de: 'Keine Artikel erkannt',
      },
      clickToAddManually: {
        fr: 'Cliquez sur "Ajouter" pour en ajouter manuellement',
        en: 'Click "Add" to add items manually',
        nl: 'Klik op "Toevoegen" om handmatig toe te voegen',
        de: 'Klicken Sie auf "Hinzufügen", um manuell hinzuzufügen',
      },
      calculatedTotal: {
        fr: 'Total calculé:',
        en: 'Calculated total:',
        nl: 'Berekend totaal:',
        de: 'Berechnetes Total:',
      },
      back: {
        fr: 'Retour',
        en: 'Back',
        nl: 'Terug',
        de: 'Zurück',
      },
      next: {
        fr: 'Suivant',
        en: 'Next',
        nl: 'Volgende',
        de: 'Weiter',
      },
      // Category step
      chooseCategory: {
        fr: 'Choisissez une catégorie',
        en: 'Choose a category',
        nl: 'Kies een categorie',
        de: 'Wählen Sie eine Kategorie',
      },
      organizeExpenses: {
        fr: 'Organisez tes dépenses par type',
        en: 'Organize your expenses by type',
        nl: 'Organiseer je uitgaven per type',
        de: 'Organisieren Sie Ihre Ausgaben nach Typ',
      },
      // Confirm step
      summary: {
        fr: 'Récapitulatif',
        en: 'Summary',
        nl: 'Samenvatting',
        de: 'Zusammenfassung',
      },
      readyToShare: {
        fr: 'Tout est prêt ! Vérifiez et partagez',
        en: 'All ready! Verify and share',
        nl: 'Alles klaar! Controleer en deel',
        de: 'Alles bereit! Überprüfen und teilen',
      },
      totalAmount: {
        fr: 'Montant total',
        en: 'Total amount',
        nl: 'Totaalbedrag',
        de: 'Gesamtbetrag',
      },
      category: {
        fr: 'Catégorie',
        en: 'Category',
        nl: 'Categorie',
        de: 'Kategorie',
      },
      receiptAttached: {
        fr: 'Ticket joint',
        en: 'Receipt attached',
        nl: 'Bon bijgevoegd',
        de: 'Beleg angehängt',
      },
      ocrAnalyzed: {
        fr: 'OCR analysé',
        en: 'OCR analyzed',
        nl: 'OCR geanalyseerd',
        de: 'OCR analysiert',
      },
      splitWithRoommates: {
        fr: 'Répartir entre résidents',
        en: 'Split with roommates',
        nl: 'Verdelen met huisgenoten',
        de: 'Mit Mitbewohnern teilen',
      },
      confidence: {
        fr: 'confiance',
        en: 'confidence',
        nl: 'betrouwbaarheid',
        de: 'Vertrauen',
      },
      // Category labels
      catRent: {
        fr: 'Loyer',
        en: 'Rent',
        nl: 'Huur',
        de: 'Miete',
      },
      catGroceries: {
        fr: 'Courses',
        en: 'Groceries',
        nl: 'Boodschappen',
        de: 'Einkäufe',
      },
      catUtilities: {
        fr: 'Factures',
        en: 'Utilities',
        nl: 'Rekeningen',
        de: 'Rechnungen',
      },
      catCleaning: {
        fr: 'Ménage',
        en: 'Cleaning',
        nl: 'Schoonmaak',
        de: 'Reinigung',
      },
      catInternet: {
        fr: 'Internet',
        en: 'Internet',
        nl: 'Internet',
        de: 'Internet',
      },
      catMaintenance: {
        fr: 'Entretien',
        en: 'Maintenance',
        nl: 'Onderhoud',
        de: 'Instandhaltung',
      },
      catOther: {
        fr: 'Autre',
        en: 'Other',
        nl: 'Anders',
        de: 'Sonstiges',
      },
      // Errors and alerts
      scanFailed: {
        fr: 'Échec du scan',
        en: 'Scan failed',
        nl: 'Scan mislukt',
        de: 'Scan fehlgeschlagen',
      },
      scanErrorManualEntry: {
        fr: 'Erreur lors du scan. Tu peux saisir manuellement.',
        en: 'Scan error. You can enter manually.',
        nl: 'Scanfout. Je kunt handmatig invoeren.',
        de: 'Scan-Fehler. Sie können manuell eingeben.',
      },
      pleaseEnterValidAmount: {
        fr: 'Veuillez saisir un montant valide',
        en: 'Please enter a valid amount',
        nl: 'Voer een geldig bedrag in',
        de: 'Bitte geben Sie einen gültigen Betrag ein',
      },
      pleaseEnterTitle: {
        fr: 'Veuillez saisir un titre',
        en: 'Please enter a title',
        nl: 'Voer een titel in',
        de: 'Bitte geben Sie einen Titel ein',
      },
    },

    // Expense List By Period Component
    expenseList: {
      // Period labels
      today: {
        fr: "Aujourd'hui",
        en: 'Today',
        nl: 'Vandaag',
        de: 'Heute',
      },
      thisWeek: {
        fr: 'Cette semaine',
        en: 'This week',
        nl: 'Deze week',
        de: 'Diese Woche',
      },
      thisMonth: {
        fr: 'Ce mois',
        en: 'This month',
        nl: 'Deze maand',
        de: 'Diesen Monat',
      },
      older: {
        fr: 'Plus ancien',
        en: 'Older',
        nl: 'Ouder',
        de: 'Älter',
      },
      allExpenses: {
        fr: 'Toutes les dépenses',
        en: 'All expenses',
        nl: 'Alle uitgaven',
        de: 'Alle Ausgaben',
      },
      expense: {
        fr: 'dépense',
        en: 'expense',
        nl: 'uitgave',
        de: 'Ausgabe',
      },
      expenses: {
        fr: 'dépenses',
        en: 'expenses',
        nl: 'uitgaven',
        de: 'Ausgaben',
      },
      // Empty state
      noExpenses: {
        fr: 'Aucune dépense',
        en: 'No expenses',
        nl: 'Geen uitgaven',
        de: 'Keine Ausgaben',
      },
      scanFirstReceipt: {
        fr: 'Scannez votre premier ticket pour commencer !',
        en: 'Scan your first receipt to get started!',
        nl: 'Scan je eerste bon om te beginnen!',
        de: 'Scannen Sie Ihren ersten Beleg, um zu beginnen!',
      },
      // Expense card
      yourShare: {
        fr: 'Ta part:',
        en: 'Your share:',
        nl: 'Jouw deel:',
        de: 'Dein Anteil:',
      },
      // Category labels (shared with expenseScanner)
      catRent: {
        fr: 'Loyer',
        en: 'Rent',
        nl: 'Huur',
        de: 'Miete',
      },
      catUtilities: {
        fr: 'Charges',
        en: 'Utilities',
        nl: 'Rekeningen',
        de: 'Nebenkosten',
      },
      catGroceries: {
        fr: 'Courses',
        en: 'Groceries',
        nl: 'Boodschappen',
        de: 'Einkäufe',
      },
      catCleaning: {
        fr: 'Ménage',
        en: 'Cleaning',
        nl: 'Schoonmaak',
        de: 'Reinigung',
      },
      catMaintenance: {
        fr: 'Entretien',
        en: 'Maintenance',
        nl: 'Onderhoud',
        de: 'Instandhaltung',
      },
      catInternet: {
        fr: 'Internet',
        en: 'Internet',
        nl: 'Internet',
        de: 'Internet',
      },
      catOther: {
        fr: 'Autre',
        en: 'Other',
        nl: 'Anders',
        de: 'Sonstiges',
      },
      // Relative date labels
      yesterday: {
        fr: 'Hier',
        en: 'Yesterday',
        nl: 'Gisteren',
        de: 'Gestern',
      },
      daysAgo: {
        fr: 'Il y a {days}j',
        en: '{days}d ago',
        nl: '{days}d geleden',
        de: 'vor {days}T',
      },
      // Additional empty states
      scanReceipt: {
        fr: 'Scannez un ticket pour commencer',
        en: 'Scan a receipt to get started',
        nl: 'Scan een bon om te beginnen',
        de: 'Scannen Sie einen Beleg, um zu beginnen',
      },
      expensesWillAppearHere: {
        fr: 'Vos dépenses apparaîtront ici',
        en: 'Your expenses will appear here',
        nl: 'Uw uitgaven verschijnen hier',
        de: 'Ihre Ausgaben werden hier angezeigt',
      },
    },

    // Expense Detail Modal
    expenseDetail: {
      // Dialog title
      expenseDetails: {
        fr: 'Détails de la dépense',
        en: 'Expense details',
        nl: 'Uitgavedetails',
        de: 'Ausgabendetails',
      },
      // Amount
      totalAmount: {
        fr: 'Montant total',
        en: 'Total amount',
        nl: 'Totaalbedrag',
        de: 'Gesamtbetrag',
      },
      // Metadata
      paidBy: {
        fr: 'Payé par',
        en: 'Paid by',
        nl: 'Betaald door',
        de: 'Bezahlt von',
      },
      date: {
        fr: 'Date',
        en: 'Date',
        nl: 'Datum',
        de: 'Datum',
      },
      description: {
        fr: 'Description',
        en: 'Description',
        nl: 'Beschrijving',
        de: 'Beschreibung',
      },
      // Receipt
      receiptPhoto: {
        fr: 'Photo du ticket',
        en: 'Receipt photo',
        nl: 'Foto van bon',
        de: 'Belegfoto',
      },
      clickToView: {
        fr: 'Cliquez pour voir',
        en: 'Click to view',
        nl: 'Klik om te bekijken',
        de: 'Klicken zum Anzeigen',
      },
      receiptAlt: {
        fr: 'Ticket de caisse',
        en: 'Receipt',
        nl: 'Kassabon',
        de: 'Kassenbon',
      },
      // OCR Data
      ocrData: {
        fr: 'Données OCR extraites',
        en: 'Extracted OCR data',
        nl: 'Geëxtraheerde OCR-gegevens',
        de: 'Extrahierte OCR-Daten',
      },
      confidence: {
        fr: 'Confiance:',
        en: 'Confidence:',
        nl: 'Betrouwbaarheid:',
        de: 'Vertrauen:',
      },
      merchant: {
        fr: 'Commerce',
        en: 'Merchant',
        nl: 'Winkel',
        de: 'Händler',
      },
      detectedTotal: {
        fr: 'Total détecté',
        en: 'Detected total',
        nl: 'Gedetecteerd totaal',
        de: 'Erkannter Betrag',
      },
      detectedItems: {
        fr: 'Articles détectés',
        en: 'Detected items',
        nl: 'Gedetecteerde artikelen',
        de: 'Erkannte Artikel',
      },
      // Splits
      splitTitle: {
        fr: 'Répartition',
        en: 'Split',
        nl: 'Verdeling',
        de: 'Aufteilung',
      },
      people: {
        fr: 'personnes',
        en: 'people',
        nl: 'personen',
        de: 'Personen',
      },
      you: {
        fr: 'Toi',
        en: 'You',
        nl: 'Jij',
        de: 'Du',
      },
      roommate: {
        fr: 'Résident',
        en: 'Roommate',
        nl: 'Huisgenoot',
        de: 'Mitbewohner',
      },
      hasPaid: {
        fr: 'A payé',
        en: 'Has paid',
        nl: 'Heeft betaald',
        de: 'Hat bezahlt',
      },
      reimbursed: {
        fr: 'Remboursé',
        en: 'Reimbursed',
        nl: 'Terugbetaald',
        de: 'Erstattet',
      },
      owes: {
        fr: 'Doit',
        en: 'Owes',
        nl: 'Moet',
        de: 'Schuldet',
      },
      markPaid: {
        fr: 'Marquer payé',
        en: 'Mark as paid',
        nl: 'Markeer als betaald',
        de: 'Als bezahlt markieren',
      },
      // Category labels (shared)
      catRent: {
        fr: 'Loyer',
        en: 'Rent',
        nl: 'Huur',
        de: 'Miete',
      },
      catUtilities: {
        fr: 'Charges',
        en: 'Utilities',
        nl: 'Rekeningen',
        de: 'Nebenkosten',
      },
      catGroceries: {
        fr: 'Courses',
        en: 'Groceries',
        nl: 'Boodschappen',
        de: 'Einkäufe',
      },
      catCleaning: {
        fr: 'Ménage',
        en: 'Cleaning',
        nl: 'Schoonmaak',
        de: 'Reinigung',
      },
      catMaintenance: {
        fr: 'Entretien',
        en: 'Maintenance',
        nl: 'Onderhoud',
        de: 'Instandhaltung',
      },
      catInternet: {
        fr: 'Internet',
        en: 'Internet',
        nl: 'Internet',
        de: 'Internet',
      },
      catOther: {
        fr: 'Autre',
        en: 'Other',
        nl: 'Anders',
        de: 'Sonstiges',
      },
    },

    // Expense Charts
    expenseCharts: {
      thisWeek: {
        fr: 'cette semaine',
        en: 'this week',
        nl: 'deze week',
        de: 'diese Woche',
      },
      thisMonth: {
        fr: 'ce mois',
        en: 'this month',
        nl: 'deze maand',
        de: 'diesen Monat',
      },
      thisYear: {
        fr: 'cette année',
        en: 'this year',
        nl: 'dit jaar',
        de: 'dieses Jahr',
      },
      total: {
        fr: 'Total',
        en: 'Total',
        nl: 'Totaal',
        de: 'Gesamt',
      },
      weekPrefix: {
        fr: 'Sem',
        en: 'Week',
        nl: 'Week',
        de: 'Woche',
      },
      noData: {
        fr: 'Aucune donnée',
        en: 'No data',
        nl: 'Geen gegevens',
        de: 'Keine Daten',
      },
      othersCount: {
        fr: '+{count} autres',
        en: '+{count} others',
        nl: '+{count} anderen',
        de: '+{count} andere',
      },
      // Category labels for charts
      catRent: {
        fr: 'Loyer',
        en: 'Rent',
        nl: 'Huur',
        de: 'Miete',
      },
      catUtilities: {
        fr: 'Charges',
        en: 'Utilities',
        nl: 'Nutsvoorzieningen',
        de: 'Nebenkosten',
      },
      catGroceries: {
        fr: 'Courses',
        en: 'Groceries',
        nl: 'Boodschappen',
        de: 'Lebensmittel',
      },
      catCleaning: {
        fr: 'Ménage',
        en: 'Cleaning',
        nl: 'Schoonmaak',
        de: 'Reinigung',
      },
      catMaintenance: {
        fr: 'Entretien',
        en: 'Maintenance',
        nl: 'Onderhoud',
        de: 'Instandhaltung',
      },
      catInternet: {
        fr: 'Internet',
        en: 'Internet',
        nl: 'Internet',
        de: 'Internet',
      },
      catOther: {
        fr: 'Autre',
        en: 'Other',
        nl: 'Anders',
        de: 'Sonstiges',
      },
    },

    // Expense Calendar View
    expenseCalendar: {
      // Month names
      january: { fr: 'Janvier', en: 'January', nl: 'Januari', de: 'Januar' },
      february: { fr: 'Février', en: 'February', nl: 'Februari', de: 'Februar' },
      march: { fr: 'Mars', en: 'March', nl: 'Maart', de: 'März' },
      april: { fr: 'Avril', en: 'April', nl: 'April', de: 'April' },
      may: { fr: 'Mai', en: 'May', nl: 'Mei', de: 'Mai' },
      june: { fr: 'Juin', en: 'June', nl: 'Juni', de: 'Juni' },
      july: { fr: 'Juillet', en: 'July', nl: 'Juli', de: 'Juli' },
      august: { fr: 'Août', en: 'August', nl: 'Augustus', de: 'August' },
      september: { fr: 'Septembre', en: 'September', nl: 'September', de: 'September' },
      october: { fr: 'Octobre', en: 'October', nl: 'Oktober', de: 'Oktober' },
      november: { fr: 'Novembre', en: 'November', nl: 'November', de: 'November' },
      december: { fr: 'Décembre', en: 'December', nl: 'December', de: 'Dezember' },
      // Day abbreviations
      mon: { fr: 'Lun', en: 'Mon', nl: 'Ma', de: 'Mo' },
      tue: { fr: 'Mar', en: 'Tue', nl: 'Di', de: 'Di' },
      wed: { fr: 'Mer', en: 'Wed', nl: 'Wo', de: 'Mi' },
      thu: { fr: 'Jeu', en: 'Thu', nl: 'Do', de: 'Do' },
      fri: { fr: 'Ven', en: 'Fri', nl: 'Vr', de: 'Fr' },
      sat: { fr: 'Sam', en: 'Sat', nl: 'Za', de: 'Sa' },
      sun: { fr: 'Dim', en: 'Sun', nl: 'Zo', de: 'So' },
      // UI labels
      monthTotal: { fr: 'Total du mois', en: 'Month total', nl: 'Maand totaal', de: 'Monatssumme' },
      today: { fr: "Aujourd'hui", en: 'Today', nl: 'Vandaag', de: 'Heute' },
      totalExpenses: { fr: 'Dépenses totales', en: 'Total expenses', nl: 'Totale uitgaven', de: 'Gesamtausgaben' },
      thisMonth: { fr: 'Ce mois', en: 'This month', nl: 'Deze maand', de: 'Diesen Monat' },
      daysWithExpenses: { fr: 'Jours avec dépenses', en: 'Days with expenses', nl: 'Dagen met uitgaven', de: 'Tage mit Ausgaben' },
      averagePerExpense: { fr: 'Moyenne/dépense', en: 'Avg/expense', nl: 'Gem/uitgave', de: 'Durchschn./Ausgabe' },
      // Category labels
      catRent: { fr: 'Loyer', en: 'Rent', nl: 'Huur', de: 'Miete' },
      catUtilities: { fr: 'Charges', en: 'Utilities', nl: 'Nutsvoorzieningen', de: 'Nebenkosten' },
      catGroceries: { fr: 'Courses', en: 'Groceries', nl: 'Boodschappen', de: 'Lebensmittel' },
      catCleaning: { fr: 'Ménage', en: 'Cleaning', nl: 'Schoonmaak', de: 'Reinigung' },
      catMaintenance: { fr: 'Entretien', en: 'Maintenance', nl: 'Onderhoud', de: 'Instandhaltung' },
      catInternet: { fr: 'Internet', en: 'Internet', nl: 'Internet', de: 'Internet' },
      catOther: { fr: 'Autre', en: 'Other', nl: 'Anders', de: 'Sonstiges' },
    },

    // Smart Splitter
    smartSplitter: {
      // Header
      title: { fr: 'Partager la dépense', en: 'Split the expense', nl: 'Verdeel de uitgave', de: 'Ausgabe aufteilen' },
      subtitle: { fr: '€{amount} à répartir entre {count} personnes', en: '€{amount} to split between {count} people', nl: '€{amount} te verdelen tussen {count} mensen', de: '€{amount} aufzuteilen zwischen {count} Personen' },
      // Split methods
      equal: { fr: 'Égal', en: 'Equal', nl: 'Gelijk', de: 'Gleich' },
      equalDescription: { fr: 'Diviser en parts égales', en: 'Split equally', nl: 'Gelijk verdelen', de: 'Gleichmäßig aufteilen' },
      custom: { fr: 'Personnalisé', en: 'Custom', nl: 'Aangepast', de: 'Benutzerdefiniert' },
      customDescription: { fr: 'Montants spécifiques', en: 'Specific amounts', nl: 'Specifieke bedragen', de: 'Spezifische Beträge' },
      percentage: { fr: 'Pourcentage', en: 'Percentage', nl: 'Percentage', de: 'Prozentsatz' },
      percentageDescription: { fr: 'Répartition en %', en: 'Distribution by %', nl: 'Verdeling per %', de: 'Aufteilung in %' },
      // Allocation labels
      equalShare: { fr: 'Part égale', en: 'Equal share', nl: 'Gelijk deel', de: 'Gleicher Anteil' },
      // Validation
      correctDistribution: { fr: 'Répartition correcte', en: 'Correct distribution', nl: 'Correcte verdeling', de: 'Korrekte Verteilung' },
      incompleteDistribution: { fr: 'Répartition incomplète', en: 'Incomplete distribution', nl: 'Onvolledige verdeling', de: 'Unvollständige Verteilung' },
      totalDistributed: { fr: 'Total réparti:', en: 'Total distributed:', nl: 'Totaal verdeeld:', de: 'Verteilt insgesamt:' },
      remaining: { fr: 'Restant:', en: 'Remaining:', nl: 'Resterend:', de: 'Verbleibend:' },
      total: { fr: 'Total:', en: 'Total:', nl: 'Totaal:', de: 'Gesamt:' },
      autoDistribute: { fr: 'Distribuer automatiquement', en: 'Auto-distribute', nl: 'Automatisch verdelen', de: 'Automatisch verteilen' },
      // Actions
      back: { fr: 'Retour', en: 'Back', nl: 'Terug', de: 'Zurück' },
      confirmSplit: { fr: 'Confirmer le partage', en: 'Confirm split', nl: 'Verdeling bevestigen', de: 'Aufteilung bestätigen' },
    },

    // Residence Finance Overview
    financeOverview: {
      you: { fr: 'Toi', en: 'You', nl: 'Jij', de: 'Du' },
      totalResidence: { fr: 'Total résidence', en: 'Total residence', nl: 'Totaal woning', de: 'Gesamt Unterkunft' },
      expensesCount: { fr: '{count} dépenses', en: '{count} expenses', nl: '{count} uitgaven', de: '{count} Ausgaben' },
      thisMonth: { fr: 'Ce mois', en: 'This month', nl: 'Deze maand', de: 'Diesen Monat' },
      yourShareThisMonth: { fr: 'Ta part ce mois', en: 'Your share this month', nl: 'Jouw deel deze maand', de: 'Dein Anteil diesen Monat' },
      yourBalance: { fr: 'Ton solde', en: 'Your balance', nl: 'Jouw saldo', de: 'Dein Saldo' },
      youAreOwed: { fr: 'On te doit', en: 'You are owed', nl: 'Men is je schuldig', de: 'Man schuldet dir' },
      youOwe: { fr: 'Tu dois', en: 'You owe', nl: 'Je bent schuldig', de: 'Du schuldest' },
      contributions: { fr: 'Contributions', en: 'Contributions', nl: 'Bijdragen', de: 'Beiträge' },
    },

    // Expense History Modal
    expenseHistory: {
      title: { fr: 'Historique des dépenses', en: 'Expense History', nl: 'Uitgavenhistorie', de: 'Ausgabenverlauf' },
      expenseCount: { fr: '{count} dépense{plural}', en: '{count} expense{plural}', nl: '{count} uitgave{plural}', de: '{count} Ausgabe{plural}' },
      total: { fr: 'Total', en: 'Total', nl: 'Totaal', de: 'Gesamt' },
      list: { fr: 'Liste', en: 'List', nl: 'Lijst', de: 'Liste' },
      calendar: { fr: 'Calendrier', en: 'Calendar', nl: 'Kalender', de: 'Kalender' },
      searchPlaceholder: { fr: 'Rechercher une dépense...', en: 'Search an expense...', nl: 'Zoek een uitgave...', de: 'Ausgabe suchen...' },
      filters: { fr: 'Filtres', en: 'Filters', nl: 'Filters', de: 'Filter' },
      category: { fr: 'Catégorie', en: 'Category', nl: 'Categorie', de: 'Kategorie' },
      all: { fr: 'Toutes', en: 'All', nl: 'Alle', de: 'Alle' },
      // Category labels
      catRent: { fr: 'Loyer', en: 'Rent', nl: 'Huur', de: 'Miete' },
      catUtilities: { fr: 'Charges', en: 'Utilities', nl: 'Nutsvoorzieningen', de: 'Nebenkosten' },
      catGroceries: { fr: 'Courses', en: 'Groceries', nl: 'Boodschappen', de: 'Lebensmittel' },
      catCleaning: { fr: 'Ménage', en: 'Cleaning', nl: 'Schoonmaak', de: 'Reinigung' },
      catMaintenance: { fr: 'Entretien', en: 'Maintenance', nl: 'Onderhoud', de: 'Instandhaltung' },
      catInternet: { fr: 'Internet', en: 'Internet', nl: 'Internet', de: 'Internet' },
      catOther: { fr: 'Autre', en: 'Other', nl: 'Anders', de: 'Sonstiges' },
    },

    // Profiles Management Page
    profiles: {
      title: {
        fr: 'Gérer les Profils',
        en: 'Manage Profiles',
        nl: 'Profielen Beheren',
        de: 'Profile Verwalten',
      },
      subtitle: {
        fr: 'Gère ta profil et les profils dépendants (famille, amis, etc.)',
        en: 'Manage your profile and dependent profiles (family, friends, etc.)',
        nl: 'Beheer je profiel en afhankelijke profielen (familie, vrienden, etc.)',
        de: 'Verwalten Sie Ihr Profil und abhängige Profile (Familie, Freunde, etc.)',
      },
      myProfile: {
        fr: 'Mon Profil',
        en: 'My Profile',
        nl: 'Mijn Profiel',
        de: 'Mein Profil',
      },
      myProfileDescription: {
        fr: 'Ton profil personnel de chercheur',
        en: 'Your personal searcher profile',
        nl: 'Je persoonlijke zoeker profiel',
        de: 'Ihr persönliches Sucherprofil',
      },
      viewDashboard: {
        fr: 'Voir le Tableau de Bord',
        en: 'View Dashboard',
        nl: 'Bekijk Dashboard',
        de: 'Dashboard Anzeigen',
      },
      dependentProfiles: {
        fr: 'Profils Dépendants',
        en: 'Dependent Profiles',
        nl: 'Afhankelijke Profielen',
        de: 'Abhängige Profile',
      },
      dependentProfilesDescription: {
        fr: 'Profils que tu gères pour la famille ou les amis',
        en: 'Profiles you\'re managing for family or friends',
        nl: 'Profielen die je beheert voor familie of vrienden',
        de: 'Profile, die Sie für Familie oder Freunde verwalten',
      },
      addProfile: {
        fr: 'Ajouter un Profil',
        en: 'Add Profile',
        nl: 'Profiel Toevoegen',
        de: 'Profil Hinzufügen',
      },
      noDependentProfiles: {
        fr: 'Pas encore de profils dépendants',
        en: 'No dependent profiles yet',
        nl: 'Nog geen afhankelijke profielen',
        de: 'Noch keine abhängigen Profile',
      },
      createDependentProfile: {
        fr: 'Créez un profil pour un enfant, un membre de la famille ou un ami pour qui tu cherches un logement',
        en: 'Create a profile for a child, family member, or friend you\'re helping search for housing',
        nl: 'Maak een profiel aan voor een kind, familielid of vriend waarvoor je helpt zoeken naar huisvesting',
        de: 'Erstellen Sie ein Profil für ein Kind, Familienmitglied oder Freund, dem Sie bei der Wohnungssuche helfen',
      },
      createYourFirstProfile: {
        fr: 'Créer Votre Premier Profil',
        en: 'Create Your First Profile',
        nl: 'Creëer Je Eerste Profiel',
        de: 'Ihr Erstes Profil Erstellen',
      },
      child: {
        fr: 'Enfant',
        en: 'Child',
        nl: 'Kind',
        de: 'Kind',
      },
      familyMember: {
        fr: 'Membre de la Famille',
        en: 'Family Member',
        nl: 'Familielid',
        de: 'Familienmitglied',
      },
      friend: {
        fr: 'Ami(e)',
        en: 'Friend',
        nl: 'Vriend',
        de: 'Freund',
      },
      other: {
        fr: 'Autre',
        en: 'Other',
        nl: 'Ander',
        de: 'Andere',
      },
      active: {
        fr: 'Actif',
        en: 'Active',
        nl: 'Actief',
        de: 'Aktiv',
      },
      inactive: {
        fr: 'Inactif',
        en: 'Inactive',
        nl: 'Inactief',
        de: 'Inaktiv',
      },
      deactivate: {
        fr: 'Désactiver',
        en: 'Deactivate',
        nl: 'Deactiveren',
        de: 'Deaktivieren',
      },
      activate: {
        fr: 'Activer',
        en: 'Activate',
        nl: 'Activeren',
        de: 'Aktivieren',
      },
      delete: {
        fr: 'Supprimer',
        en: 'Delete',
        nl: 'Verwijderen',
        de: 'Löschen',
      },
      deleting: {
        fr: 'Suppression...',
        en: 'Deleting...',
        nl: 'Verwijderen...',
        de: 'Löschen...',
      },
      profileDeactivated: {
        fr: 'Profil désactivé',
        en: 'Profile deactivated',
        nl: 'Profiel gedeactiveerd',
        de: 'Profil deaktiviert',
      },
      profileActivated: {
        fr: 'Profil activé',
        en: 'Profile activated',
        nl: 'Profiel geactiveerd',
        de: 'Profil aktiviert',
      },
      profileDeleted: {
        fr: 'Profil supprimé avec succès',
        en: 'Profile deleted successfully',
        nl: 'Profiel succesvol verwijderd',
        de: 'Profil erfolgreich gelöscht',
      },
      loadingProfiles: {
        fr: 'Chargement des profils...',
        en: 'Loading profiles...',
        nl: 'Profielen laden...',
        de: 'Profile werden geladen...',
      },
      back: {
        fr: 'Retour',
        en: 'Back',
        nl: 'Terug',
        de: 'Zurück',
      },
    },

    // My Profile (Searcher)
    myProfile: {
      title: {
        fr: 'Mon Profil',
        en: 'My Profile',
        nl: 'Mijn Profiel',
        de: 'Mein Profil',
      },
      backToDashboard: {
        fr: 'Retour au Tableau de Bord',
        en: 'Back to Dashboard',
        nl: 'Terug naar Dashboard',
        de: 'Zurück zum Dashboard',
      },
      loadingProfile: {
        fr: 'Chargement de ton profil...',
        en: 'Loading your profile...',
        nl: 'Je profiel laden...',
        de: 'Ihr Profil wird geladen...',
      },
      matches: {
        fr: 'Matchs',
        en: 'Matches',
        nl: 'Matches',
        de: 'Matches',
      },
      messages: {
        fr: 'Messages',
        en: 'Messages',
        nl: 'Berichten',
        de: 'Nachrichten',
      },
      favorites: {
        fr: 'Favoris',
        en: 'Favorites',
        nl: 'Favorieten',
        de: 'Favoriten',
      },
      enhanceYourProfile: {
        fr: 'Améliorez Votre Profil',
        en: 'Enhance Your Profile',
        nl: 'Verbeter Je Profiel',
        de: 'Verbessern Sie Ihr Profil',
      },
      addMoreDetails: {
        fr: 'Ajoute plus de détails pour augmenter tes chances de trouver le Living Match parfait',
        en: 'Add more details to increase your chances of finding the perfect match',
        nl: 'Voeg meer details toe om je kansen te vergroten op het vinden van de perfecte match',
        de: 'Fügen Sie mehr Details hinzu, um Ihre Chancen auf den perfekten Match zu erhöhen',
      },
      financialGuaranteeInfo: {
        fr: 'Informations Financières & Garantie',
        en: 'Financial & Guarantee Info',
        nl: 'Financiële & Garantie Info',
        de: 'Finanzielle & Garantie-Informationen',
      },
      financialDescription: {
        fr: 'Coordonnées bancaires, garant, documents financiers',
        en: 'Bank details, guarantor, financial documents',
        nl: 'Bankgegevens, borg, financiële documenten',
        de: 'Bankverbindung, Bürge, Finanzdokumente',
      },
      communityEvents: {
        fr: 'Communauté & Événements',
        en: 'Community & Events',
        nl: 'Gemeenschap & Evenementen',
        de: 'Gemeinschaft & Veranstaltungen',
      },
      communityDescription: {
        fr: 'Intérêts communautaires, participation aux événements',
        en: 'Community interests, event participation',
        nl: 'Gemeenschapsinteresses, evenementendeelname',
        de: 'Gemeinschaftsinteressen, Veranstaltungsteilnahme',
      },
      extendedPersonality: {
        fr: 'Personnalité Étendue',
        en: 'Extended Personality',
        nl: 'Uitgebreide Persoonlijkheid',
        de: 'Erweiterte Persönlichkeit',
      },
      personalityDescription: {
        fr: 'Loisirs, intérêts, détails du style de vie',
        en: 'Hobbies, interests, lifestyle details',
        nl: 'Hobby\'s, interesses, levensstijl details',
        de: 'Hobbys, Interessen, Lebensstil-Details',
      },
      advancedPreferences: {
        fr: 'Préférences Avancées',
        en: 'Advanced Preferences',
        nl: 'Geavanceerde Voorkeuren',
        de: 'Erweiterte Präferenzen',
      },
      preferencesDescription: {
        fr: 'Préférences de vie détaillées, deal-breakers',
        en: 'Detailed living preferences, deal-breakers',
        nl: 'Gedetailleerde woonvoorkeuren, dealbreakers',
        de: 'Detaillierte Wohnpräferenzen, Deal-Breaker',
      },
      profileVerification: {
        fr: 'Vérification du Profil',
        en: 'Profile Verification',
        nl: 'Profiel Verificatie',
        de: 'Profil-Verifizierung',
      },
      verificationDescription: {
        fr: 'Vérification d\'identité, vérifications d\'antécédents',
        en: 'ID verification, background checks',
        nl: 'ID-verificatie, achtergrondcontroles',
        de: 'ID-Verifizierung, Hintergrundüberprüfungen',
      },
      edit: {
        fr: 'Modifier',
        en: 'Edit',
        nl: 'Bewerken',
        de: 'Bearbeiten',
      },
      addDetails: {
        fr: 'Ajouter plus de détails',
        en: 'Add more details',
        nl: 'Meer details toevoegen',
        de: 'Mehr Details hinzufügen',
      },
      editCoreProfile: {
        fr: 'Modifier le Profil Principal',
        en: 'Edit Core Profile',
        nl: 'Bewerk Hoofdprofiel',
        de: 'Kernprofil Bearbeiten',
      },
      redirecting: {
        fr: 'Redirection vers ton profil...',
        en: 'Redirecting to your profile...',
        nl: 'Doorsturen naar je profiel...',
        de: 'Weiterleitung zu Ihrem Profil...',
      },
    },

    // My Profile Owner
    myProfileOwner: {
      title: {
        fr: 'Mon Profil Propriétaire',
        en: 'My Owner Profile',
        nl: 'Mijn Eigenaar Profiel',
        de: 'Mein Eigentümerprofil',
      },
      completeProfile: {
        fr: 'Complète ton profil pour attirer des résidents de qualité et instaurer la confiance',
        en: 'Complete your profile to attract quality tenants and build trust',
        nl: 'Vul je profiel aan om kwaliteitshuurders aan te trekken en vertrouwen op te bouwen',
        de: 'Vervollständigen Sie Ihr Profil, um qualitativ hochwertige Mieter anzuziehen und Vertrauen aufzubauen',
      },
      propertyInformation: {
        fr: 'Informations sur la Propriété',
        en: 'Property Information',
        nl: 'Eigendom Informatie',
        de: 'Immobilieninformationen',
      },
      propertyInfoDescription: {
        fr: 'Détails de la propriété, type, emplacement',
        en: 'Property details, type, location',
        nl: 'Eigendom details, type, locatie',
        de: 'Immobiliendetails, Typ, Standort',
      },
      paymentBanking: {
        fr: 'Paiement & Banque',
        en: 'Payment & Banking',
        nl: 'Betaling & Bankieren',
        de: 'Zahlung & Banking',
      },
      paymentDescription: {
        fr: 'IBAN, SWIFT/BIC, détails de paiement',
        en: 'IBAN, SWIFT/BIC, payment details',
        nl: 'IBAN, SWIFT/BIC, betalingsdetails',
        de: 'IBAN, SWIFT/BIC, Zahlungsdetails',
      },
      experienceManagement: {
        fr: 'Expérience & Gestion',
        en: 'Experience & Management',
        nl: 'Ervaring & Beheer',
        de: 'Erfahrung & Verwaltung',
      },
      experienceDescription: {
        fr: 'Années d\'expérience, style de gestion',
        en: 'Years of experience, management style',
        nl: 'Jaren ervaring, beheersstijl',
        de: 'Jahre Erfahrung, Verwaltungsstil',
      },
      ownerBioStory: {
        fr: 'Biographie & Histoire du Propriétaire',
        en: 'Owner Bio & Story',
        nl: 'Eigenaar Bio & Verhaal',
        de: 'Eigentümer-Bio & Geschichte',
      },
      bioDescription: {
        fr: 'À propos de toi, philosophie d\'hébergement',
        en: 'About you, hosting philosophy',
        nl: 'Over jou, host filosofie',
        de: 'Über Sie, Hosting-Philosophie',
      },
      verificationDocuments: {
        fr: 'Documents de Vérification',
        en: 'Verification Documents',
        nl: 'Verificatie Documenten',
        de: 'Verifizierungsdokumente',
      },
      verificationDescription: {
        fr: 'Vérification d\'identité, documents légaux',
        en: 'Identity verification, legal documents',
        nl: 'Identiteitsverificatie, juridische documenten',
        de: 'Identitätsprüfung, rechtliche Dokumente',
      },
      landlordTypes: {
        individual: {
          fr: 'Propriétaire Individuel',
          en: 'Individual Owner',
          nl: 'Individuele Eigenaar',
          de: 'Einzelner Eigentümer',
        },
        agency: {
          fr: 'Agence',
          en: 'Agency',
          nl: 'Agentschap',
          de: 'Agentur',
        },
        company: {
          fr: 'Entreprise',
          en: 'Company',
          nl: 'Bedrijf',
          de: 'Unternehmen',
        },
        owner: {
          fr: 'Propriétaire',
          en: 'Owner',
          nl: 'Eigenaar',
          de: 'Eigentümer',
        },
      },
      profileCompletion: {
        fr: 'Complétude du Profil',
        en: 'Profile Completion',
        nl: 'Profiel Voltooiing',
        de: 'Profilvollständigkeit',
      },
      stats: {
        properties: {
          fr: 'Propriétés',
          en: 'Properties',
          nl: 'Eigendommen',
          de: 'Immobilien',
        },
        activeListings: {
          fr: 'Résidences Actives',
          en: 'Active Listings',
          nl: 'Actieve Advertenties',
          de: 'Aktive Angebote',
        },
        applications: {
          fr: 'Candidatures',
          en: 'Applications',
          nl: 'Aanvragen',
          de: 'Bewerbungen',
        },
      },
      enhanceTitle: {
        fr: 'Améliorez Votre Profil',
        en: 'Enhance Your Profile',
        nl: 'Verbeter Je Profiel',
        de: 'Verbessern Sie Ihr Profil',
      },
      enhanceDescription: {
        fr: 'Complète ces sections pour créer un profil complet et attirer des résidents de qualité',
        en: 'Complete these sections to create a comprehensive profile and attract quality tenants',
        nl: 'Vul deze secties in om een uitgebreid profiel te maken en kwaliteitshuurders aan te trekken',
        de: 'Vervollständigen Sie diese Abschnitte, um ein umfassendes Profil zu erstellen und qualitativ hochwertige Mieter anzuziehen',
      },
      editCoreProfile: {
        fr: 'Modifier le Profil Principal',
        en: 'Edit Core Profile',
        nl: 'Bewerk Kernprofiel',
        de: 'Hauptprofil Bearbeiten',
      },
      addDetails: {
        fr: 'Ajouter des Détails',
        en: 'Add Details',
        nl: 'Details Toevoegen',
        de: 'Details Hinzufügen',
      },
    },
  },

  // ============================================================================
  // OWNER PORTFOLIO
  // ============================================================================
  ownerPortfolio: {
    // Page Header
    pageTitle: {
      fr: 'Portfolio Immobilier',
      en: 'Real Estate Portfolio',
      nl: 'Vastgoedportfolio',
      de: 'Immobilienportfolio',
    },
    pageSubtitle: {
      fr: 'Votre patrimoine en un coup d\'œil',
      en: 'Your portfolio at a glance',
      nl: 'Uw portefeuille in één oogopslag',
      de: 'Ihr Portfolio auf einen Blick',
    },
    commandCenter: {
      fr: 'Command Center',
      en: 'Command Center',
      nl: 'Command Center',
      de: 'Command Center',
    },
    portfolio: {
      fr: 'Portfolio',
      en: 'Portfolio',
      nl: 'Portfolio',
      de: 'Portfolio',
    },
    refresh: {
      fr: 'Actualiser',
      en: 'Refresh',
      nl: 'Vernieuwen',
      de: 'Aktualisieren',
    },

    // Loading State
    loading: {
      fr: 'Chargement...',
      en: 'Loading...',
      nl: 'Laden...',
      de: 'Laden...',
    },
    preparingPortfolio: {
      fr: 'Préparation de ton portfolio',
      en: 'Preparing your portfolio',
      nl: 'Uw portfolio voorbereiden',
      de: 'Ihr Portfolio wird vorbereitet',
    },
    errorLoading: {
      fr: 'Erreur lors du chargement des données du portfolio',
      en: 'Error loading portfolio data',
      nl: 'Fout bij het laden van portfoliogegevens',
      de: 'Fehler beim Laden der Portfolio-Daten',
    },

    // KPI Cards
    totalProperties: {
      fr: 'Biens au total',
      en: 'Total properties',
      nl: 'Totaal aantal woningen',
      de: 'Gesamtzahl Immobilien',
    },
    published: {
      fr: 'publiés',
      en: 'published',
      nl: 'gepubliceerd',
      de: 'veröffentlicht',
    },
    applications: {
      fr: 'Candidatures',
      en: 'Applications',
      nl: 'Aanvragen',
      de: 'Bewerbungen',
    },
    approved: {
      fr: 'acceptées',
      en: 'approved',
      nl: 'goedgekeurd',
      de: 'genehmigt',
    },
    occupancyRate: {
      fr: 'Taux d\'occupation',
      en: 'Occupancy rate',
      nl: 'Bezettingsgraad',
      de: 'Belegungsrate',
    },
    excellent: {
      fr: 'Excellent',
      en: 'Excellent',
      nl: 'Uitstekend',
      de: 'Ausgezeichnet',
    },
    vacant: {
      fr: 'vacant',
      en: 'vacant',
      nl: 'leeg',
      de: 'leer',
    },
    vacants: {
      fr: 'vacants',
      en: 'vacant',
      nl: 'leeg',
      de: 'leer',
    },
    monthlyRent: {
      fr: 'Loyers mensuels',
      en: 'Monthly rent',
      nl: 'Maandelijkse huur',
      de: 'Monatliche Miete',
    },
    perMonth: {
      fr: '/mois',
      en: '/month',
      nl: '/maand',
      de: '/Monat',
    },
    perProperty: {
      fr: '/ bien',
      en: '/ property',
      nl: '/ woning',
      de: '/ Immobilie',
    },

    // Actions Section
    actionsRequired: {
      fr: 'Actions requises',
      en: 'Actions required',
      nl: 'Vereiste acties',
      de: 'Erforderliche Aktionen',
    },
    viewAll: {
      fr: 'Voir tout',
      en: 'View all',
      nl: 'Bekijk alles',
      de: 'Alle anzeigen',
    },
    noActionsRequired: {
      fr: 'Aucune action requise',
      en: 'No action required',
      nl: 'Geen actie vereist',
      de: 'Keine Aktion erforderlich',
    },
    allUnderControl: {
      fr: 'Tout est sous contrôle !',
      en: 'Everything is under control!',
      nl: 'Alles onder controle!',
      de: 'Alles unter Kontrolle!',
    },

    // Recent Properties Section
    recentProperties: {
      fr: 'Derniers biens',
      en: 'Recent properties',
      nl: 'Recente woningen',
      de: 'Neueste Immobilien',
    },
    viewAllProperties: {
      fr: 'Voir tous',
      en: 'View all',
      nl: 'Bekijk alles',
      de: 'Alle anzeigen',
    },
    noPropertiesYet: {
      fr: 'Aucune résidence pour le moment',
      en: 'No properties yet',
      nl: 'Nog geen woningen',
      de: 'Noch keine Immobilien',
    },
    addProperty: {
      fr: 'Ajouter une résidence',
      en: 'Add a property',
      nl: 'Woning toevoegen',
      de: 'Immobilie hinzufügen',
    },
    bedrooms: {
      fr: 'ch',
      en: 'bd',
      nl: 'slk',
      de: 'SZ',
    },
    bathrooms: {
      fr: 'sdb',
      en: 'ba',
      nl: 'bdk',
      de: 'Bad',
    },
    sqm: {
      fr: 'm²',
      en: 'sqm',
      nl: 'm²',
      de: 'm²',
    },

    // Property Status
    rented: {
      fr: 'Loué',
      en: 'Rented',
      nl: 'Verhuurd',
      de: 'Vermietet',
    },
    draft: {
      fr: 'Brouillon',
      en: 'Draft',
      nl: 'Concept',
      de: 'Entwurf',
    },
    archived: {
      fr: 'Archivé',
      en: 'Archived',
      nl: 'Gearchiveerd',
      de: 'Archiviert',
    },
    publishedStatus: {
      fr: 'Publié',
      en: 'Published',
      nl: 'Gepubliceerd',
      de: 'Veröffentlicht',
    },

    // Health Status
    attention: {
      fr: 'Attention',
      en: 'Attention',
      nl: 'Aandacht',
      de: 'Achtung',
    },
    critical: {
      fr: 'Critique',
      en: 'Critical',
      nl: 'Kritiek',
      de: 'Kritisch',
    },

    // Quick Access Section
    quickAccess: {
      fr: 'Accès rapide',
      en: 'Quick access',
      nl: 'Snelle toegang',
      de: 'Schnellzugriff',
    },

    // Navigation Cards
    properties: {
      fr: 'Propriétés',
      en: 'Properties',
      nl: 'Woningen',
      de: 'Immobilien',
    },
    managePortfolio: {
      fr: 'Gère ta parc immobilier',
      en: 'Manage your real estate portfolio',
      nl: 'Beheer uw vastgoedportfolio',
      de: 'Verwalten Sie Ihr Immobilienportfolio',
    },
    drafts: {
      fr: 'brouillons',
      en: 'drafts',
      nl: 'concepten',
      de: 'Entwürfe',
    },
    evaluateCandidates: {
      fr: 'Évaluez les candidats pour tes biens',
      en: 'Evaluate candidates for your properties',
      nl: 'Beoordeel kandidaten voor uw woningen',
      de: 'Bewerten Sie Kandidaten für Ihre Immobilien',
    },
    total: {
      fr: 'total',
      en: 'total',
      nl: 'totaal',
      de: 'Gesamt',
    },
    pending: {
      fr: 'en attente',
      en: 'pending',
      nl: 'in afwachting',
      de: 'ausstehend',
    },
    performance: {
      fr: 'Performance',
      en: 'Performance',
      nl: 'Prestatie',
      de: 'Leistung',
    },
    analyzePortfolio: {
      fr: 'Analysez la rentabilité de ton portfolio',
      en: 'Analyze your portfolio profitability',
      nl: 'Analyseer de winstgevendheid van uw portfolio',
      de: 'Analysieren Sie die Rentabilität Ihres Portfolios',
    },
    totalViews: {
      fr: 'vues totales',
      en: 'total views',
      nl: 'totale weergaven',
      de: 'Gesamtansichten',
    },
    requests: {
      fr: 'demandes',
      en: 'requests',
      nl: 'verzoeken',
      de: 'Anfragen',
    },

    // Summary Bar
    rentedProperties: {
      fr: 'Biens loués',
      en: 'Rented properties',
      nl: 'Verhuurde woningen',
      de: 'Vermietete Immobilien',
    },
    acceptedTenants: {
      fr: 'Résidents acceptés',
      en: 'Accepted tenants',
      nl: 'Geaccepteerde huurders',
      de: 'Akzeptierte Mieter',
    },
    averageRent: {
      fr: 'Loyer moyen',
      en: 'Average rent',
      nl: 'Gemiddelde huur',
      de: 'Durchschnittliche Miete',
    },

    // Property Card Actions
    viewDetails: {
      fr: 'Voir détails',
      en: 'View details',
      nl: 'Bekijk details',
      de: 'Details anzeigen',
    },
    edit: {
      fr: 'Modifier',
      en: 'Edit',
      nl: 'Bewerken',
      de: 'Bearbeiten',
    },
    archive: {
      fr: 'Archiver',
      en: 'Archive',
      nl: 'Archiveren',
      de: 'Archivieren',
    },
    delete: {
      fr: 'Supprimer',
      en: 'Delete',
      nl: 'Verwijderen',
      de: 'Löschen',
    },
    history: {
      fr: 'Historique',
      en: 'History',
      nl: 'Geschiedenis',
      de: 'Verlauf',
    },
    details: {
      fr: 'Détails',
      en: 'Details',
      nl: 'Details',
      de: 'Details',
    },

    // Stats Labels
    views: {
      fr: 'vues',
      en: 'views',
      nl: 'weergaven',
      de: 'Ansichten',
    },
    inquiries: {
      fr: 'demandes',
      en: 'inquiries',
      nl: 'aanvragen',
      de: 'Anfragen',
    },
    candidatures: {
      fr: 'candidatures',
      en: 'applications',
      nl: 'aanvragen',
      de: 'Bewerbungen',
    },

    // Vacancy
    daysVacant: {
      fr: 'j vacant',
      en: 'd vacant',
      nl: 'd leeg',
      de: 'T leer',
    },

    // Lease Info
    leaseUntil: {
      fr: 'Séjour jusqu\'au',
      en: 'Lease until',
      nl: 'Huurcontract tot',
      de: 'Mietvertrag bis',
    },

    // Health Grid
    propertiesInPortfolio: {
      fr: 'dans ton portfolio',
      en: 'in your portfolio',
      nl: 'in uw portfolio',
      de: 'in Ihrem Portfolio',
    },
    noPropertiesFound: {
      fr: 'Aucune résidence trouvé',
      en: 'No properties found',
      nl: 'Geen woningen gevonden',
      de: 'Keine Immobilien gefunden',
    },
    noPropertiesFilterHint: {
      fr: 'Essayez de modifier tes filtres pour voir plus de résultats.',
      en: 'Try adjusting your filters to see more results.',
      nl: 'Probeer uw filters aan te passen om meer resultaten te zien.',
      de: 'Passen Sie Ihre Filter an, um mehr Ergebnisse zu sehen.',
    },
    noPropertiesYetHint: {
      fr: 'Tu n\'as pas encore de biens dans ton portfolio.',
      en: 'You don\'t have any properties in your portfolio yet.',
      nl: 'U heeft nog geen woningen in uw portfolio.',
      de: 'Sie haben noch keine Immobilien in Ihrem Portfolio.',
    },
    biens: {
      fr: 'biens',
      en: 'properties',
      nl: 'woningen',
      de: 'Immobilien',
    },

    // PropertyFilters Component
    filters: {
      searchProperty: {
        fr: 'Rechercher une résidence...',
        en: 'Search for a property...',
        nl: 'Zoek een woning...',
        de: 'Immobilie suchen...',
      },
      allStatuses: {
        fr: 'Tous les statuts',
        en: 'All statuses',
        nl: 'Alle statussen',
        de: 'Alle Status',
      },
      published: {
        fr: 'Publiés',
        en: 'Published',
        nl: 'Gepubliceerd',
        de: 'Veröffentlicht',
      },
      rented: {
        fr: 'Loués',
        en: 'Rented',
        nl: 'Verhuurd',
        de: 'Vermietet',
      },
      vacant: {
        fr: 'Vacants',
        en: 'Vacant',
        nl: 'Leegstaand',
        de: 'Leer',
      },
      drafts: {
        fr: 'Brouillons',
        en: 'Drafts',
        nl: 'Concepten',
        de: 'Entwürfe',
      },
      archived: {
        fr: 'Archivés',
        en: 'Archived',
        nl: 'Gearchiveerd',
        de: 'Archiviert',
      },
      allHealth: {
        fr: 'Toute santé',
        en: 'All health',
        nl: 'Alle gezondheid',
        de: 'Alle Gesundheit',
      },
      excellent: {
        fr: 'Excellent',
        en: 'Excellent',
        nl: 'Uitstekend',
        de: 'Ausgezeichnet',
      },
      attention: {
        fr: 'Attention',
        en: 'Attention',
        nl: 'Aandacht',
        de: 'Achtung',
      },
      critical: {
        fr: 'Critique',
        en: 'Critical',
        nl: 'Kritiek',
        de: 'Kritisch',
      },
      allCities: {
        fr: 'Toutes villes',
        en: 'All cities',
        nl: 'Alle steden',
        de: 'Alle Städte',
      },
      allCitiesLong: {
        fr: 'Toutes les villes',
        en: 'All cities',
        nl: 'Alle steden',
        de: 'Alle Städte',
      },
      filters: {
        fr: 'Filtres',
        en: 'Filters',
        nl: 'Filters',
        de: 'Filter',
      },
      rentRange: {
        fr: 'Fourchette de loyer',
        en: 'Rent range',
        nl: 'Huurbereik',
        de: 'Mietbereich',
      },
      min: {
        fr: 'Min',
        en: 'Min',
        nl: 'Min',
        de: 'Min',
      },
      max: {
        fr: 'Max',
        en: 'Max',
        nl: 'Max',
        de: 'Max',
      },
      sortBy: {
        fr: 'Trier par',
        en: 'Sort by',
        nl: 'Sorteren op',
        de: 'Sortieren nach',
      },
      sortCreated: {
        fr: 'Date de création',
        en: 'Creation date',
        nl: 'Aanmaakdatum',
        de: 'Erstellungsdatum',
      },
      sortRent: {
        fr: 'Loyer',
        en: 'Rent',
        nl: 'Huur',
        de: 'Miete',
      },
      sortViews: {
        fr: 'Vues',
        en: 'Views',
        nl: 'Weergaven',
        de: 'Aufrufe',
      },
      sortInquiries: {
        fr: 'Demandes',
        en: 'Inquiries',
        nl: 'Aanvragen',
        de: 'Anfragen',
      },
      sortName: {
        fr: 'Nom',
        en: 'Name',
        nl: 'Naam',
        de: 'Name',
      },
      sortCity: {
        fr: 'Ville',
        en: 'City',
        nl: 'Stad',
        de: 'Stadt',
      },
      reset: {
        fr: 'Réinitialiser',
        en: 'Reset',
        nl: 'Resetten',
        de: 'Zurücksetzen',
      },
      clearFilters: {
        fr: 'Effacer les filtres',
        en: 'Clear filters',
        nl: 'Filters wissen',
        de: 'Filter löschen',
      },
      property: {
        fr: 'bien',
        en: 'property',
        nl: 'woning',
        de: 'Immobilie',
      },
      propertiesPlural: {
        fr: 'biens',
        en: 'properties',
        nl: 'woningen',
        de: 'Immobilien',
      },
      of: {
        fr: 'sur',
        en: 'of',
        nl: 'van',
        de: 'von',
      },
    },
  },

  // ============================================================================
  // RESIDENT ONBOARDING
  // ============================================================================
  resident: {
    // Basic Info Page
    basicInfo: {
      title: {
        fr: 'Faisons connaissance !',
        en: 'Let\'s get to know you! 👋',
        nl: 'Laten we kennismaken! 👋',
        de: 'Lernen wir uns kennen! 👋',
      },
      subtitle: {
        fr: 'Parle-nous un peu de toi pour commencer dans ton communauté de co-living',
        en: 'Tell us a bit about yourself to get started in your coliving community',
        nl: 'Vertel ons een beetje over jezelf om te beginnen in je coliving gemeenschap',
        de: 'Erzählen Sie uns ein bisschen über sich, um in Ihrer Coliving-Gemeinschaft zu starten',
      },
      step: {
        fr: 'Étape 1 sur 4',
        en: 'Step 1 of 4',
        nl: 'Stap 1 van 4',
        de: 'Schritt 1 von 4',
      },
      stepLabel: {
        fr: 'Informations de Base',
        en: 'Basic Information',
        nl: 'Basisinformatie',
        de: 'Grundinformationen',
      },
      firstName: {
        fr: 'Prénom',
        en: 'First Name',
        nl: 'Voornaam',
        de: 'Vorname',
      },
      firstNamePlaceholder: {
        fr: 'Jean',
        en: 'John',
        nl: 'Jan',
        de: 'Hans',
      },
      lastName: {
        fr: 'Nom',
        en: 'Last Name',
        nl: 'Achternaam',
        de: 'Nachname',
      },
      lastNamePlaceholder: {
        fr: 'Dupont',
        en: 'Doe',
        nl: 'Jansen',
        de: 'Schmidt',
      },
      dateOfBirth: {
        fr: 'Date de Naissance',
        en: 'Date of Birth',
        nl: 'Geboortedatum',
        de: 'Geburtsdatum',
      },
      nationality: {
        fr: 'Nationalité',
        en: 'Nationality',
        nl: 'Nationaliteit',
        de: 'Nationalität',
      },
      nationalityPlaceholder: {
        fr: 'ex : Belge, Français, Allemand...',
        en: 'e.g., Belgian, French, German...',
        nl: 'bijv. Belgisch, Frans, Duits...',
        de: 'z.B. Belgisch, Französisch, Deutsch...',
      },
      phoneNumber: {
        fr: 'Numéro de Téléphone',
        en: 'Phone Number',
        nl: 'Telefoonnummer',
        de: 'Telefonnummer',
      },
      phoneNumberPlaceholder: {
        fr: '+32 123 456 789',
        en: '+32 123 456 789',
        nl: '+32 123 456 789',
        de: '+32 123 456 789',
      },
      languagesSpoken: {
        fr: 'Langues que tu parles',
        en: 'Languages You Speak',
        nl: 'Talen die je Spreekt',
        de: 'Sprachen, die Sie Sprechen',
      },
      languagesPlaceholder: {
        fr: 'ex : Français, Anglais, Espagnol...',
        en: 'e.g., English, French, Spanish...',
        nl: 'bijv. Engels, Frans, Spaans...',
        de: 'z.B. Englisch, Französisch, Spanisch...',
      },
      addLanguage: {
        fr: 'Ajouter',
        en: 'Add',
        nl: 'Toevoegen',
        de: 'Hinzufügen',
      },
      continue: {
        fr: 'Continuer',
        en: 'Continue',
        nl: 'Doorgaan',
        de: 'Weiter',
      },
    },

    // Lifestyle Page
    lifestyle: {
      title: {
        fr: 'Votre Style de Vie',
        en: 'Your Lifestyle',
        nl: 'Je Levensstijl',
        de: 'Ihr Lebensstil',
      },
      subtitle: {
        fr: 'Aidez-nous à comprendre ta routine quotidienne et tes habitudes',
        en: 'Help us understand your daily routine and habits',
        nl: 'Help ons je dagelijkse routine en gewoonten te begrijpen',
        de: 'Helfen Sie uns, Ihre tägliche Routine und Gewohnheiten zu verstehen',
      },
      step: {
        fr: 'Étape 2 sur 4',
        en: 'Step 2 of 4',
        nl: 'Stap 2 van 4',
        de: 'Schritt 2 von 4',
      },
      stepLabel: {
        fr: 'Essentiels du Style de Vie',
        en: 'Lifestyle Essentials',
        nl: 'Levensstijl Essentie',
        de: 'Lebensstil-Grundlagen',
      },
      occupationStatus: {
        fr: 'Statut Professionnel',
        en: 'Occupation Status',
        nl: 'Beroepsstatus',
        de: 'Berufsstatus',
      },
      student: {
        fr: 'Étudiant',
        en: 'Student',
        nl: 'Student',
        de: 'Student',
      },
      employee: {
        fr: 'Employé',
        en: 'Employee',
        nl: 'Werknemer',
        de: 'Angestellter',
      },
      selfEmployed: {
        fr: 'Indépendant',
        en: 'Self-Employed',
        nl: 'Zelfstandige',
        de: 'Selbstständig',
      },
      intern: {
        fr: 'Stagiaire',
        en: 'Intern',
        nl: 'Stagiair',
        de: 'Praktikant',
      },
      jobSeeker: {
        fr: 'Chercheur d\'Emploi',
        en: 'Job Seeker',
        nl: 'Werkzoekende',
        de: 'Arbeitssuchender',
      },
      other: {
        fr: 'Autre',
        en: 'Other',
        nl: 'Ander',
        de: 'Andere',
      },
      wakeUpTime: {
        fr: 'Heure de Réveil Typique',
        en: 'Typical Wake-Up Time',
        nl: 'Typische Wektijd',
        de: 'Typische Aufwachzeit',
      },
      earlyBird: {
        fr: 'Lève-tôt',
        en: 'Early Bird',
        nl: 'Vroege Vogel',
        de: 'Frühaufsteher',
      },
      before7am: {
        fr: 'Avant 7h',
        en: 'Before 7am',
        nl: 'Voor 7u',
        de: 'Vor 7 Uhr',
      },
      average: {
        fr: 'Moyen',
        en: 'Average',
        nl: 'Gemiddeld',
        de: 'Durchschnittlich',
      },
      between7and9: {
        fr: '7h - 9h',
        en: '7am - 9am',
        nl: '7u - 9u',
        de: '7 - 9 Uhr',
      },
      nightOwl: {
        fr: 'Couche-tard',
        en: 'Night Owl',
        nl: 'Nachtuil',
        de: 'Nachteule',
      },
      after9am: {
        fr: 'Après 9h',
        en: 'After 9am',
        nl: 'Na 9u',
        de: 'Nach 9 Uhr',
      },
      bedtime: {
        fr: 'Heure de Coucher Typique',
        en: 'Typical Bedtime',
        nl: 'Typische Bedtijd',
        de: 'Typische Schlafenszeit',
      },
      before11pm: {
        fr: 'Avant 23h',
        en: 'Before 11pm',
        nl: 'Voor 23u',
        de: 'Vor 23 Uhr',
      },
      between11and1: {
        fr: '23h - 1h',
        en: '11pm - 1am',
        nl: '23u - 1u',
        de: '23 - 1 Uhr',
      },
      after1am: {
        fr: 'Après 1h',
        en: 'After 1am',
        nl: 'Na 1u',
        de: 'Nach 1 Uhr',
      },
      doYouSmoke: {
        fr: 'Fumes-tu ?',
        en: 'Do you smoke?',
        nl: 'Rook je?',
        de: 'Rauchen Sie?',
      },
      nonSmoker: {
        fr: 'Non-fumeur',
        en: 'Non-smoker',
        nl: 'Niet-roker',
        de: 'Nichtraucher',
      },
      smoker: {
        fr: 'Fumeur',
        en: 'Smoker',
        nl: 'Roker',
        de: 'Raucher',
      },
      cleanlinessLevel: {
        fr: 'Niveau de Propreté (1 = Décontracté, 10 = Très Ordonné)',
        en: 'Cleanliness Level (1 = Relaxed, 10 = Very Tidy)',
        nl: 'Netheid Niveau (1 = Ontspannen, 10 = Zeer Netjes)',
        de: 'Sauberkeitsniveau (1 = Entspannt, 10 = Sehr Ordentlich)',
      },
      relaxed: {
        fr: 'Décontracté',
        en: 'Relaxed',
        nl: 'Ontspannen',
        de: 'Entspannt',
      },
      veryTidy: {
        fr: 'Très Ordonné',
        en: 'Very Tidy',
        nl: 'Zeer Netjes',
        de: 'Sehr Ordentlich',
      },
    },

    // Personality Page
    personality: {
      title: {
        fr: 'Ta Personnalité',
        en: 'Your Personality',
        nl: 'Je Persoonlijkheid',
        de: 'Ihre Persönlichkeit',
      },
      subtitle: {
        fr: 'Aide-nous à t\'associer à des résidents compatibles',
        en: 'Help us match you with compatible roommates',
        nl: 'Help ons je te matchen met compatibele huisgenoten',
        de: 'Helfen Sie uns, Sie mit kompatiblen Mitbewohnern zu verbinden',
      },
      step: {
        fr: 'Étape 3 sur 4',
        en: 'Step 3 of 4',
        nl: 'Stap 3 van 4',
        de: 'Schritt 3 von 4',
      },
      stepLabel: {
        fr: 'Bases de la Personnalité',
        en: 'Personality Basics',
        nl: 'Persoonlijkheid Basis',
        de: 'Persönlichkeits-Grundlagen',
      },
      introvertExtrovertScale: {
        fr: 'Échelle Introverti ↔ Extraverti',
        en: 'Introvert ↔ Extrovert Scale',
        nl: 'Introvert ↔ Extravert Schaal',
        de: 'Introvertiert ↔ Extrovertiert Skala',
      },
      introvert: {
        fr: 'Introverti',
        en: 'Introvert',
        nl: 'Introvert',
        de: 'Introvertiert',
      },
      extrovert: {
        fr: 'Extraverti',
        en: 'Extrovert',
        nl: 'Extravert',
        de: 'Extrovertiert',
      },
      ambivert: {
        fr: 'Ambivert',
        en: 'Ambivert',
        nl: 'Ambivert',
        de: 'Ambivertiert',
      },
      socialActivityLevel: {
        fr: 'Niveau d\'Activité Sociale',
        en: 'Social Activity Level',
        nl: 'Sociaal Activiteit Niveau',
        de: 'Soziales Aktivitätsniveau',
      },
      low: {
        fr: 'Faible',
        en: 'Low',
        nl: 'Laag',
        de: 'Niedrig',
      },
      lowDesc: {
        fr: 'Je préfère le calme',
        en: 'I prefer quiet time',
        nl: 'Ik geef de voorkeur aan rust',
        de: 'Ich bevorzuge Ruhe',
      },
      medium: {
        fr: 'Moyen',
        en: 'Medium',
        nl: 'Gemiddeld',
        de: 'Mittel',
      },
      mediumDesc: {
        fr: 'Vie sociale équilibrée',
        en: 'Balanced social life',
        nl: 'Evenwichtig sociaal leven',
        de: 'Ausgeglichenes Sozialleben',
      },
      high: {
        fr: 'Élevé',
        en: 'High',
        nl: 'Hoog',
        de: 'Hoch',
      },
      highDesc: {
        fr: 'J\'adore être social',
        en: 'Love being social',
        nl: 'Ik hou van sociaal zijn',
        de: 'Liebe es, sozial zu sein',
      },
      preferredLivingStyle: {
        fr: 'Style de Vie Préféré',
        en: 'Preferred Living Style',
        nl: 'Voorkeur Woonstijl',
        de: 'Bevorzugter Lebensstil',
      },
      cozyEvenings: {
        fr: 'Soirées Cosy',
        en: 'Cozy Evenings',
        nl: 'Gezellige Avonden',
        de: 'Gemütliche Abende',
      },
      cozyEveningsDesc: {
        fr: 'Soirées film et détente',
        en: 'Movie nights and chill hangouts',
        nl: 'Filmavonden en chill hangouts',
        de: 'Filmabende und entspannte Treffen',
      },
      independentLiving: {
        fr: 'Vie Indépendante',
        en: 'Independent Living',
        nl: 'Onafhankelijk Leven',
        de: 'Unabhängiges Leben',
      },
      independentLivingDesc: {
        fr: 'Respecter l\'espace de chacun',
        en: 'Respect each other\'s space',
        nl: 'Respecteer elkaars ruimte',
        de: 'Respektiere den Raum des anderen',
      },
      communityEvents: {
        fr: 'Événements Communautaires',
        en: 'Community Events',
        nl: 'Gemeenschap Evenementen',
        de: 'Gemeinschaftsveranstaltungen',
      },
      communityEventsDesc: {
        fr: 'Activités de groupe et fêtes',
        en: 'Group activities and parties',
        nl: 'Groepsactiviteiten en feesten',
        de: 'Gruppenaktivitäten und Partys',
      },
      homeActivityLevel: {
        fr: 'À quel point es-tu Actif à la Maison ?',
        en: 'How Active Are You at Home?',
        nl: 'Hoe Actief Ben je Thuis?',
        de: 'Wie Aktiv Sind Sie Zuhause?',
      },
      quiet: {
        fr: 'Calme',
        en: 'Quiet',
        nl: 'Rustig',
        de: 'Ruhig',
      },
      quietDesc: {
        fr: 'Surtout dans ma chambre',
        en: 'Mostly in my room',
        nl: 'Meestal in mijn kamer',
        de: 'Meistens in meinem Zimmer',
      },
      social: {
        fr: 'Social',
        en: 'Social',
        nl: 'Sociaal',
        de: 'Sozial',
      },
      socialDesc: {
        fr: 'Souvent dans les espaces communs',
        en: 'Often in common areas',
        nl: 'Vaak in gemeenschappelijke ruimtes',
        de: 'Oft in Gemeinschaftsräumen',
      },
      veryActive: {
        fr: 'Très Actif',
        en: 'Very Active',
        nl: 'Zeer Actief',
        de: 'Sehr Aktiv',
      },
      veryActiveDesc: {
        fr: 'Toujours en train de faire quelque chose',
        en: 'Always doing something',
        nl: 'Altijd iets aan het doen',
        de: 'Immer etwas am Tun',
      },
    },

    // Living Situation Page
    livingSituation: {
      title: {
        fr: 'Presque Terminé !',
        en: 'Almost Done!',
        nl: 'Bijna Klaar!',
        de: 'Fast Fertig!',
      },
      subtitle: {
        fr: 'Parle-nous de ta situation de logement actuelle',
        en: 'Tell us about your current living situation',
        nl: 'Vertel ons over je huidige woonsituatie',
        de: 'Erzählen Sie uns von Ihrer aktuellen Wohnsituation',
      },
      step: {
        fr: 'Étape 4 sur 4',
        en: 'Step 4 of 4',
        nl: 'Stap 4 van 4',
        de: 'Schritt 4 von 4',
      },
      stepLabel: {
        fr: 'Situation de Logement & Bio',
        en: 'Living Situation & Bio',
        nl: 'Woonsituatie & Bio',
        de: 'Wohnsituation & Bio',
      },
      currentCity: {
        fr: 'Ville Actuelle',
        en: 'Current City',
        nl: 'Huidige Stad',
        de: 'Aktuelle Stadt',
      },
      currentCityPlaceholder: {
        fr: 'ex : Bruxelles, Paris, Berlin...',
        en: 'e.g., Brussels, Paris, Berlin...',
        nl: 'bijv. Brussel, Parijs, Berlijn...',
        de: 'z.B. Brüssel, Paris, Berlin...',
      },
      moveInDate: {
        fr: 'Quand as-tu emménagé ?',
        en: 'When did you move in?',
        nl: 'Wanneer ben je verhuisd?',
        de: 'Wann sind Sie eingezogen?',
      },
      tellUsAboutYourself: {
        fr: 'Parle-nous de toi',
        en: 'Tell us about yourself',
        nl: 'Vertel ons over jezelf',
        de: 'Erzählen Sie uns über sich',
      },
      bioPlaceholder: {
        fr: 'Écris une courte introduction sur toi, tes intérêts, ce que tu recherches dans une communauté de co-living... (min 20 caractères)',
        en: 'Write a short introduction about yourself, your interests, what you\'re looking for in a coliving community... (min 20 characters)',
        nl: 'Schrijf een korte introductie over jezelf, je interesses, wat je zoekt in een coliving gemeenschap... (min 20 tekens)',
        de: 'Schreiben Sie eine kurze Einführung über sich, Ihre Interessen, was Sie in einer Coliving-Gemeinschaft suchen... (min 20 Zeichen)',
      },
      charactersNeeded: {
        fr: 'caractères nécessaires',
        en: 'more characters needed',
        nl: 'meer tekens nodig',
        de: 'weitere Zeichen benötigt',
      },
      great: {
        fr: 'Super !',
        en: 'Great!',
        nl: 'Geweldig!',
        de: 'Großartig!',
      },
      tipsTitle: {
        fr: 'Conseils pour une super bio :',
        en: 'Tips for a great bio:',
        nl: 'Tips voor een geweldige bio:',
        de: 'Tipps für eine tolle Bio:',
      },
      tip1: {
        fr: 'Partagez tes loisirs et intérêts',
        en: 'Share your hobbies and interests',
        nl: 'Deel je hobby\'s en interesses',
        de: 'Teilen Sie Ihre Hobbys und Interessen',
      },
      tip2: {
        fr: 'Mentionne ce que tu étudies ou sur quoi tu travailles',
        en: 'Mention what you\'re studying or working on',
        nl: 'Vermeld waar je studeert of aan werkt',
        de: 'Erwähnen Sie, was Sie studieren oder woran Sie arbeiten',
      },
      tip3: {
        fr: 'Décrivez quel type d\'ambiance communautaire tu préfères',
        en: 'Describe what kind of community vibe you prefer',
        nl: 'Beschrijf wat voor soort gemeenschapssfeer je prefereert',
        de: 'Beschreiben Sie, welche Art von Gemeinschaftsatmosphäre Sie bevorzugen',
      },
      tip4: {
        fr: 'Soyez authentique et amical !',
        en: 'Be authentic and friendly!',
        nl: 'Wees authentiek en vriendelijk!',
        de: 'Seien Sie authentisch und freundlich!',
      },
      completeProfile: {
        fr: 'Compléter le Profil',
        en: 'Complete Profile',
        nl: 'Profiel Voltooien',
        de: 'Profil Vervollständigen',
      },
      completingProfile: {
        fr: 'Finalisation de ton profil...',
        en: 'Completing your profile...',
        nl: 'Je profiel voltooien...',
        de: 'Ihr Profil wird vervollständigt...',
      },
      errors: {
        cityRequired: {
          fr: 'Veuillez entrer votre ville actuelle',
          en: 'Please enter your current city',
          nl: 'Voer je huidige stad in',
          de: 'Bitte geben Sie Ihre aktuelle Stadt ein',
        },
        dateRequired: {
          fr: 'Veuillez sélectionner votre date d\'emménagement',
          en: 'Please select your move-in date',
          nl: 'Selecteer je verhuisdatum',
          de: 'Bitte wählen Sie Ihr Einzugsdatum',
        },
        bioRequired: {
          fr: 'Écris quelque chose sur toi',
          en: 'Please write something about yourself',
          nl: 'Schrijf iets over jezelf',
          de: 'Bitte schreiben Sie etwas über sich',
        },
        bioTooShort: {
          fr: 'Votre bio doit contenir au moins 20 caractères',
          en: 'Your bio must be at least 20 characters',
          nl: 'Je bio moet minimaal 20 tekens bevatten',
          de: 'Ihre Bio muss mindestens 20 Zeichen lang sein',
        },
      },
      success: {
        fr: 'Informations sauvegardées',
        en: 'Information saved',
        nl: 'Informatie opgeslagen',
        de: 'Informationen gespeichert',
      },
      successDesc: {
        fr: 'Passage à la révision',
        en: 'Proceeding to review',
        nl: 'Doorgaan naar beoordeling',
        de: 'Weiter zur Überprüfung',
      },
      progress: {
        fr: 'Étape 4 sur 4',
        en: 'Step 4 of 4',
        nl: 'Stap 4 van 4',
        de: 'Schritt 4 von 4',
      },
      heading: {
        fr: 'Situation de Logement & Bio',
        en: 'Living Situation & Bio',
        nl: 'Woonsituatie & Bio',
        de: 'Wohnsituation & Bio',
      },
      description: {
        fr: 'Parle-nous de ta situation de logement actuelle et partage un peu sur toi',
        en: 'Tell us about your current living situation and share a bit about yourself',
        nl: 'Vertel ons over je huidige woonsituatie en deel iets over jezelf',
        de: 'Erzählen Sie uns von Ihrer aktuellen Wohnsituation und teilen Sie etwas über sich',
      },
      complete: {
        fr: 'Continuer vers la révision',
        en: 'Continue to Review',
        nl: 'Doorgaan naar beoordeling',
        de: 'Weiter zur Überprüfung',
      },
      completing: {
        fr: 'Sauvegarde...',
        en: 'Saving...',
        nl: 'Opslaan...',
        de: 'Speichern...',
      },
    },

    // Review Page
    review: {
      title: {
        fr: 'Révision de Votre Profil',
        en: 'Review Your Profile',
        nl: 'Bekijk Je Profiel',
        de: 'Überprüfen Sie Ihr Profil',
      },
      subtitle: {
        fr: 'Vérifie tes informations avant de soumettre',
        en: 'Please review your information before submitting',
        nl: 'Controleer je informatie voordat je indient',
        de: 'Bitte überprüfen Sie Ihre Informationen vor dem Absenden',
      },
      submitButton: {
        fr: 'Soumettre Mon Profil',
        en: 'Submit My Profile',
        nl: 'Mijn Profiel Indienen',
        de: 'Mein Profil Einreichen',
      },
    },

    // Success Page
    success: {
      title: {
        fr: 'Profil Complété !',
        en: 'Profile Complete!',
        nl: 'Profiel Voltooid!',
        de: 'Profil Abgeschlossen!',
      },
      subtitle: {
        fr: 'Ton profil de résident a été créé avec succès. Tu peux maintenant gérer ton expérience de co-living.',
        en: 'Your resident profile has been successfully created. You can now manage your coliving experience.',
        nl: 'Je bewonersprofiel is succesvol aangemaakt. Je kunt nu je coliving ervaring beheren.',
        de: 'Ihr Bewohnerprofil wurde erfolgreich erstellt. Sie können jetzt Ihre Coliving-Erfahrung verwalten.',
      },
      nextStepsTitle: {
        fr: 'Prochaines Étapes',
        en: 'What\'s Next?',
        nl: 'Wat Nu?',
        de: 'Was Kommt Als Nächstes?',
      },
      step1: {
        fr: 'Accédez à ton tableau de bord pour voir les mises à jour et actualités de la communauté',
        en: 'Access your dashboard to view community updates and announcements',
        nl: 'Krijg toegang tot je dashboard om gemeenschap updates en aankondigingen te bekijken',
        de: 'Greifen Sie auf Ihr Dashboard zu, um Community-Updates und Ankündigungen anzuzeigen',
      },
      step2: {
        fr: 'Connecte-toi avec tes résidents et construis ta communauté',
        en: 'Connect with your housemates and build your community',
        nl: 'Maak contact met je huisgenoten en bouw je gemeenschap op',
        de: 'Vernetzen Sie sich mit Ihren Mitbewohnern und bauen Sie Ihre Gemeinschaft auf',
      },
      step3: {
        fr: 'Gère ta profil et tes préférences à tout moment',
        en: 'Manage your profile and preferences at any time',
        nl: 'Beheer je profiel en voorkeuren op elk moment',
        de: 'Verwalten Sie Ihr Profil und Ihre Einstellungen jederzeit',
      },
      goToDashboard: {
        fr: 'Aller au Tableau de Bord',
        en: 'Go to Dashboard',
        nl: 'Naar Dashboard',
        de: 'Zum Dashboard',
      },
      enhanceProfile: {
        fr: 'Améliorer le Profil',
        en: 'Enhance Profile',
        nl: 'Profiel Verbeteren',
        de: 'Profil Verbessern',
      },
      tip: {
        fr: 'Conseil : Gardez ton profil à jour pour profiter au maximum de ton expérience de co-living !',
        en: 'Tip: Keep your profile up to date to make the most of your coliving experience!',
        nl: 'Tip: Houd je profiel up-to-date om het meeste uit je coliving ervaring te halen!',
        de: 'Tipp: Halten Sie Ihr Profil auf dem neuesten Stand, um das Beste aus Ihrer Coliving-Erfahrung zu machen!',
      },
    },

    // Common for all resident pages
    common: {
      back: {
        fr: 'Retour',
        en: 'Back',
        nl: 'Terug',
        de: 'Zurück',
      },
      loading: {
        fr: 'Chargement...',
        en: 'Loading...',
        nl: 'Laden...',
        de: 'Laden...',
      },
    },
  },

  // ============================================================================
  // PROPERTIES PAGES
  // ============================================================================
  properties: {
    // Property Details Page
    details: {
      loading: {
        fr: 'Chargement de la propriété...',
        en: 'Loading property...',
        nl: 'Eigendom laden...',
        de: 'Immobilie wird geladen...',
      },
      notFound: {
        fr: 'Propriété introuvable',
        en: 'Property not found',
        nl: 'Eigendom niet gevonden',
        de: 'Immobilie nicht gefunden',
      },
      backToDashboard: {
        fr: 'Retour au tableau de bord',
        en: 'Back to dashboard',
        nl: 'Terug naar dashboard',
        de: 'Zurück zum Dashboard',
      },
      back: {
        fr: 'Retour',
        en: 'Back',
        nl: 'Terug',
        de: 'Zurück',
      },
      edit: {
        fr: 'Modifier',
        en: 'Edit',
        nl: 'Bewerken',
        de: 'Bearbeiten',
      },
      publish: {
        fr: 'Publier',
        en: 'Publish',
        nl: 'Publiceren',
        de: 'Veröffentlichen',
      },
      archive: {
        fr: 'Archiver',
        en: 'Archive',
        nl: 'Archiveren',
        de: 'Archivieren',
      },
      viewAll: {
        fr: 'Voir tout',
        en: 'View all',
        nl: 'Alles bekijken',
        de: 'Alle ansehen',
      },
      startingFrom: {
        fr: 'À partir de',
        en: 'Starting from',
        nl: 'Vanaf',
        de: 'Ab',
      },
      perMonth: {
        fr: '/mois',
        en: '/month',
        nl: '/maand',
        de: '/Monat',
      },
      roomAvailable: {
        fr: 'chambre disponible',
        en: 'room available',
        nl: 'kamer beschikbaar',
        de: 'Zimmer verfügbar',
      },
      roomsAvailable: {
        fr: 'chambres disponibles',
        en: 'rooms available',
        nl: 'kamers beschikbaar',
        de: 'Zimmer verfügbar',
      },
      roommate: {
        fr: 'résident',
        en: 'roommate',
        nl: 'huisgenoot',
        de: 'Mitbewohner',
      },
      roommates: {
        fr: 'résidents',
        en: 'roommates',
        nl: 'huisgenoten',
        de: 'Mitbewohner',
      },
    },
    overview: {
      title: {
        fr: 'Aperçu de la propriété',
        en: 'Property Overview',
        nl: 'Eigendom Overzicht',
        de: 'Immobilienübersicht',
      },
      bedrooms: {
        fr: 'Chambres',
        en: 'Bedrooms',
        nl: 'Slaapkamers',
        de: 'Schlafzimmer',
      },
      bathrooms: {
        fr: 'Salles de bain',
        en: 'Bathrooms',
        nl: 'Badkamers',
        de: 'Badezimmer',
      },
      surface: {
        fr: 'Surface',
        en: 'Surface',
        nl: 'Oppervlakte',
        de: 'Fläche',
      },
      furnished: {
        fr: 'Meublé',
        en: 'Furnished',
        nl: 'Gemeubileerd',
        de: 'Möbliert',
      },
      yes: {
        fr: 'Oui',
        en: 'Yes',
        nl: 'Ja',
        de: 'Ja',
      },
      no: {
        fr: 'Non',
        en: 'No',
        nl: 'Nee',
        de: 'Nein',
      },
      description: {
        fr: 'Description',
        en: 'Description',
        nl: 'Beschrijving',
        de: 'Beschreibung',
      },
    },
    residents: {
      title: {
        fr: 'Vos futurs résidents',
        en: 'Your future roommates',
        nl: 'Je toekomstige huisgenoten',
        de: 'Ihre zukünftigen Mitbewohner',
      },
      subtitle: {
        fr: 'Découvrez les personnes avec qui tu pourrais partager cette co-living',
        en: 'Discover the people you could share this flatshare with',
        nl: 'Ontdek de mensen met wie je deze flatshare zou kunnen delen',
        de: 'Entdecken Sie die Menschen, mit denen Sie diese WG teilen könnten',
      },
    },
    amenities: {
      title: {
        fr: 'Équipements',
        en: 'Amenities',
        nl: 'Voorzieningen',
        de: 'Ausstattung',
      },
    },
    location: {
      title: {
        fr: 'Localisation',
        en: 'Location',
        nl: 'Locatie',
        de: 'Standort',
      },
    },
    lightbox: {
      thumbnail: {
        fr: 'Miniature',
        en: 'Thumbnail',
        nl: 'Miniatuur',
        de: 'Miniaturansicht',
      },
    },
    confirmations: {
      deleteTitle: {
        fr: 'Es-tu sûr de vouloir supprimer cette propriété ? Cette action est irréversible.',
        en: 'Are you sure you want to delete this property? This action cannot be undone.',
        nl: 'Weet je zeker dat je dit eigendom wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.',
        de: 'Sind Sie sicher, dass Sie diese Immobilie löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
      },
    },
    toast: {
      propertyNotFound: {
        fr: 'Propriété introuvable',
        en: 'Property not found',
        nl: 'Eigendom niet gevonden',
        de: 'Immobilie nicht gefunden',
      },
      deleteSuccess: {
        fr: 'Propriété supprimée avec succès',
        en: 'Property deleted successfully',
        nl: 'Eigendom succesvol verwijderd',
        de: 'Immobilie erfolgreich gelöscht',
      },
      deleteFailed: {
        fr: 'Échec de la suppression de la propriété',
        en: 'Failed to delete property',
        nl: 'Eigendom verwijderen mislukt',
        de: 'Immobilie konnte nicht gelöscht werden',
      },
      publishSuccess: {
        fr: 'Propriété publiée avec succès',
        en: 'Property published successfully',
        nl: 'Eigendom succesvol gepubliceerd',
        de: 'Immobilie erfolgreich veröffentlicht',
      },
      publishFailed: {
        fr: 'Échec de la publication de la propriété',
        en: 'Failed to publish property',
        nl: 'Eigendom publiceren mislukt',
        de: 'Immobilie konnte nicht veröffentlicht werden',
      },
      archiveSuccess: {
        fr: 'Propriété archivée avec succès',
        en: 'Property archived successfully',
        nl: 'Eigendom succesvol gearchiveerd',
        de: 'Immobilie erfolgreich archiviert',
      },
      archiveFailed: {
        fr: 'Échec de l\'archivage de la propriété',
        en: 'Failed to archive property',
        nl: 'Eigendom archiveren mislukt',
        de: 'Immobilie konnte nicht archiviert werden',
      },
    },

    // Add Property Page
    add: {
      title: {
        fr: 'Ajouter une propriété',
        en: 'Add a property',
        nl: 'Een eigendom toevoegen',
        de: 'Immobilie hinzufügen',
      },
      description: {
        fr: 'Renseignez les informations de ta résidence',
        en: 'Enter your property information',
        nl: 'Voer uw eigendomsgegevens in',
        de: 'Geben Sie Ihre Immobilieninformationen ein',
      },
      subtitle: {
        fr: 'Renseignez les informations de ta résidence',
        en: 'Enter your property information',
        nl: 'Voer uw eigendomsgegevens in',
        de: 'Geben Sie Ihre Immobilieninformationen ein',
      },
      success: {
        fr: 'Propriété créée avec succès !',
        en: 'Property created successfully!',
        nl: 'Eigendom succesvol aangemaakt!',
        de: 'Immobilie erfolgreich erstellt!',
      },
      creating: {
        fr: 'Création en cours...',
        en: 'Creating...',
        nl: 'Aanmaken...',
        de: 'Wird erstellt...',
      },
      createButton: {
        fr: 'Créer la propriété',
        en: 'Create Property',
        nl: 'Eigendom aanmaken',
        de: 'Immobilie erstellen',
      },
      errors: {
        titleRequired: {
          fr: 'Veuillez entrer un titre pour ta propriété',
          en: 'Please enter a title for your property',
          nl: 'Voer een titel in voor uw eigendom',
          de: 'Bitte geben Sie einen Titel für Ihre Immobilie ein',
        },
        locationRequired: {
          fr: 'Veuillez entrer la ville et le code postal',
          en: 'Please enter the city and postal code',
          nl: 'Voer de stad en postcode in',
          de: 'Bitte geben Sie Stadt und Postleitzahl ein',
        },
        rentRequired: {
          fr: 'Veuillez entrer un loyer mensuel valide',
          en: 'Please enter a valid monthly rent',
          nl: 'Voer een geldige maandelijkse huur in',
          de: 'Bitte geben Sie eine gültige Monatsmiete ein',
        },
        createFailed: {
          fr: 'Erreur lors de la création de la propriété',
          en: 'Error creating property',
          nl: 'Fout bij het aanmaken van eigendom',
          de: 'Fehler beim Erstellen der Immobilie',
        },
      },
      sections: {
        basicInfo: {
          fr: 'Informations de base',
          en: 'Basic Information',
          nl: 'Basisinformatie',
          de: 'Grundinformationen',
        },
        location: {
          fr: 'Localisation',
          en: 'Location',
          nl: 'Locatie',
          de: 'Standort',
        },
        propertyDetails: {
          fr: 'Détails de la résidence',
          en: 'Property Details',
          nl: 'Eigendom details',
          de: 'Immobiliendetails',
        },
        pricing: {
          fr: 'Tarification',
          en: 'Pricing',
          nl: 'Prijzen',
          de: 'Preise',
        },
        amenities: {
          fr: 'Équipements',
          en: 'Amenities',
          nl: 'Voorzieningen',
          de: 'Ausstattung',
        },
        houseRules: {
          fr: 'Règles de la maison',
          en: 'House Rules',
          nl: 'Huisregels',
          de: 'Hausregeln',
        },
        availability: {
          fr: 'Disponibilité',
          en: 'Availability',
          nl: 'Beschikbaarheid',
          de: 'Verfügbarkeit',
        },
      },
      fields: {
        propertyTitle: {
          fr: 'Titre de la résidence',
          en: 'Residence Title',
          nl: 'Titel van het eigendom',
          de: 'Immobilientitel',
        },
        titlePlaceholder: {
          fr: 'Ex: Bel appartement 2 chambres à Paris',
          en: 'e.g., Cozy 2-bedroom apartment in Paris',
          nl: 'Bijv., Gezellig 2-slaapkamer appartement in Amsterdam',
          de: 'z.B., Gemütliche 2-Zimmer-Wohnung in Berlin',
        },
        description: {
          fr: 'Description',
          en: 'Description',
          nl: 'Beschrijving',
          de: 'Beschreibung',
        },
        descriptionPlaceholder: {
          fr: 'Décrivez ta propriété, ses caractéristiques et le quartier...',
          en: 'Describe your property, its features, and the neighborhood...',
          nl: 'Beschrijf uw eigendom, de kenmerken en de buurt...',
          de: 'Beschreiben Sie Ihre Immobilie, ihre Merkmale und die Nachbarschaft...',
        },
        propertyType: {
          fr: 'Type de bien',
          en: 'Property Type',
          nl: 'Type eigendom',
          de: 'Immobilientyp',
        },
        address: {
          fr: 'Adresse',
          en: 'Address',
          nl: 'Adres',
          de: 'Adresse',
        },
        addressPlaceholder: {
          fr: 'Adresse de rue',
          en: 'Street address',
          nl: 'Straatnaam',
          de: 'Straßenadresse',
        },
        city: {
          fr: 'Ville',
          en: 'City',
          nl: 'Stad',
          de: 'Stadt',
        },
        postalCode: {
          fr: 'Code postal',
          en: 'Postal Code',
          nl: 'Postcode',
          de: 'Postleitzahl',
        },
        bedrooms: {
          fr: 'Chambres',
          en: 'Bedrooms',
          nl: 'Slaapkamers',
          de: 'Schlafzimmer',
        },
        bathrooms: {
          fr: 'Salles de bain',
          en: 'Bathrooms',
          nl: 'Badkamers',
          de: 'Badezimmer',
        },
        surfaceArea: {
          fr: 'Surface (m²)',
          en: 'Surface Area (m²)',
          nl: 'Oppervlakte (m²)',
          de: 'Fläche (m²)',
        },
        optional: {
          fr: 'Optionnel',
          en: 'Optional',
          nl: 'Optioneel',
          de: 'Optional',
        },
        furnished: {
          fr: 'Meublé',
          en: 'Furnished',
          nl: 'Gemeubileerd',
          de: 'Möbliert',
        },
        monthlyRent: {
          fr: 'Loyer mensuel (€)',
          en: 'Monthly Rent (€)',
          nl: 'Maandelijkse huur (€)',
          de: 'Monatsmiete (€)',
        },
        charges: {
          fr: 'Charges (€)',
          en: 'Charges (€)',
          nl: 'Kosten (€)',
          de: 'Nebenkosten (€)',
        },
        deposit: {
          fr: 'Caution (€)',
          en: 'Deposit (€)',
          nl: 'Borg (€)',
          de: 'Kaution (€)',
        },
        smokingAllowed: {
          fr: 'Fumeurs acceptés',
          en: 'Smoking allowed',
          nl: 'Roken toegestaan',
          de: 'Rauchen erlaubt',
        },
        petsAllowed: {
          fr: 'Animaux acceptés',
          en: 'Pets allowed',
          nl: 'Huisdieren toegestaan',
          de: 'Haustiere erlaubt',
        },
        couplesAllowed: {
          fr: 'Couples acceptés',
          en: 'Couples allowed',
          nl: 'Stellen toegestaan',
          de: 'Paare erlaubt',
        },
        availableFrom: {
          fr: 'Disponible à partir du',
          en: 'Available From',
          nl: 'Beschikbaar vanaf',
          de: 'Verfügbar ab',
        },
        minimumStay: {
          fr: 'Séjour minimum (mois)',
          en: 'Minimum Stay (months)',
          nl: 'Minimum verblijf (maanden)',
          de: 'Mindestaufenthalt (Monate)',
        },
      },
      propertyTypes: {
        apartment: {
          fr: 'Appartement',
          en: 'Apartment',
          nl: 'Appartement',
          de: 'Wohnung',
        },
        house: {
          fr: 'Maison',
          en: 'House',
          nl: 'Huis',
          de: 'Haus',
        },
        studio: {
          fr: 'Studio',
          en: 'Studio',
          nl: 'Studio',
          de: 'Studio',
        },
        coliving: {
          fr: 'Espace de co-living',
          en: 'Coliving Space',
          nl: 'Coliving ruimte',
          de: 'Coliving-Raum',
        },
        shared_room: {
          fr: 'Chambre partagée',
          en: 'Shared Room',
          nl: 'Gedeelde kamer',
          de: 'Geteiltes Zimmer',
        },
        private_room: {
          fr: 'Chambre privée',
          en: 'Private Room',
          nl: 'Privé kamer',
          de: 'Privatzimmer',
        },
        entire_place: {
          fr: 'Logement entier',
          en: 'Entire Place',
          nl: 'Gehele woning',
          de: 'Gesamte Unterkunft',
        },
      },
      amenitiesLabels: {
        wifi: { fr: 'WiFi', en: 'WiFi', nl: 'WiFi', de: 'WLAN' },
        parking: { fr: 'Parking', en: 'Parking', nl: 'Parkeren', de: 'Parken' },
        elevator: { fr: 'Ascenseur', en: 'Elevator', nl: 'Lift', de: 'Aufzug' },
        balcony: { fr: 'Balcon', en: 'Balcony', nl: 'Balkon', de: 'Balkon' },
        garden: { fr: 'Jardin', en: 'Garden', nl: 'Tuin', de: 'Garten' },
        gym: { fr: 'Salle de sport', en: 'Gym', nl: 'Sportschool', de: 'Fitnessstudio' },
        laundry: { fr: 'Buanderie', en: 'Laundry', nl: 'Wasruimte', de: 'Waschküche' },
        dishwasher: { fr: 'Lave-vaisselle', en: 'Dishwasher', nl: 'Vaatwasser', de: 'Geschirrspüler' },
        washing_machine: { fr: 'Machine à laver', en: 'Washing Machine', nl: 'Wasmachine', de: 'Waschmaschine' },
        dryer: { fr: 'Sèche-linge', en: 'Dryer', nl: 'Droger', de: 'Trockner' },
        air_conditioning: { fr: 'Climatisation', en: 'Air Conditioning', nl: 'Airconditioning', de: 'Klimaanlage' },
        heating: { fr: 'Chauffage', en: 'Heating', nl: 'Verwarming', de: 'Heizung' },
        kitchen: { fr: 'Cuisine', en: 'Kitchen', nl: 'Keuken', de: 'Küche' },
        furnished: { fr: 'Meublé', en: 'Furnished', nl: 'Gemeubileerd', de: 'Möbliert' },
        pets_allowed: { fr: 'Animaux acceptés', en: 'Pets Allowed', nl: 'Huisdieren toegestaan', de: 'Haustiere erlaubt' },
        smoking_allowed: { fr: 'Fumeurs acceptés', en: 'Smoking Allowed', nl: 'Roken toegestaan', de: 'Rauchen erlaubt' },
      },
    },

    // Edit Property Page
    edit: {
      title: {
        fr: 'Modifier la propriété',
        en: 'Edit Property',
        nl: 'Eigendom bewerken',
        de: 'Immobilie bearbeiten',
      },
      description: {
        fr: 'Mettez à jour les informations de ta propriété',
        en: 'Update your property information',
        nl: 'Werk de informatie van uw eigendom bij',
        de: 'Aktualisieren Sie Ihre Immobilieninformationen',
      },
      loading: {
        fr: 'Chargement de la propriété...',
        en: 'Loading property...',
        nl: 'Eigendom laden...',
        de: 'Immobilie wird geladen...',
      },
      saving: {
        fr: 'Enregistrement...',
        en: 'Saving...',
        nl: 'Opslaan...',
        de: 'Speichern...',
      },
      saveButton: {
        fr: 'Enregistrer les modifications',
        en: 'Save Changes',
        nl: 'Wijzigingen opslaan',
        de: 'Änderungen speichern',
      },
      success: {
        fr: 'Propriété mise à jour avec succès !',
        en: 'Property updated successfully!',
        nl: 'Eigendom succesvol bijgewerkt!',
        de: 'Immobilie erfolgreich aktualisiert!',
      },
      errors: {
        loadFailed: {
          fr: 'Échec du chargement de la propriété',
          en: 'Failed to load property',
          nl: 'Eigendom laden mislukt',
          de: 'Immobilie konnte nicht geladen werden',
        },
        titleRequired: {
          fr: 'Veuillez entrer un titre pour la propriété',
          en: 'Please enter a property title',
          nl: 'Voer een titel voor het eigendom in',
          de: 'Bitte geben Sie einen Immobilientitel ein',
        },
        locationRequired: {
          fr: 'Veuillez entrer les détails de localisation',
          en: 'Please enter location details',
          nl: 'Voer locatiegegevens in',
          de: 'Bitte geben Sie Standortdetails ein',
        },
        rentRequired: {
          fr: 'Veuillez entrer un loyer mensuel valide',
          en: 'Please enter a valid monthly rent',
          nl: 'Voer een geldige maandelijkse huur in',
          de: 'Bitte geben Sie eine gültige Monatsmiete ein',
        },
        updateFailed: {
          fr: 'Échec de la mise à jour de la propriété',
          en: 'Failed to update property',
          nl: 'Eigendom bijwerken mislukt',
          de: 'Immobilie konnte nicht aktualisiert werden',
        },
      },
    },

    // Book Visit Page
    bookVisit: {
      title: {
        fr: 'Réserver une visite',
        en: 'Book a visit',
        nl: 'Een bezoek boeken',
        de: 'Besichtigung buchen',
      },
      subtitle: {
        fr: 'Choisissez une date et un créneau horaire',
        en: 'Choose a date and time slot',
        nl: 'Kies een datum en tijdslot',
        de: 'Wählen Sie ein Datum und einen Zeitfenster',
      },
      selectDate: {
        fr: 'Sélectionner une date',
        en: 'Select a date',
        nl: 'Selecteer een datum',
        de: 'Datum auswählen',
      },
      selectTime: {
        fr: 'Sélectionner un horaire',
        en: 'Select a time',
        nl: 'Selecteer een tijd',
        de: 'Zeit auswählen',
      },
      confirm: {
        fr: 'Confirmer la visite',
        en: 'Confirm visit',
        nl: 'Bezoek bevestigen',
        de: 'Besichtigung bestätigen',
      },
      noSlots: {
        fr: 'Aucun créneau disponible pour cette date',
        en: 'No slots available for this date',
        nl: 'Geen slots beschikbaar voor deze datum',
        de: 'Keine Termine für dieses Datum verfügbar',
      },
      tryAnotherDate: {
        fr: 'Essayez une autre date',
        en: 'Try another date',
        nl: 'Probeer een andere datum',
        de: 'Versuchen Sie ein anderes Datum',
      },
      hostedBy: {
        fr: 'Hébergé par',
        en: 'Hosted by',
        nl: 'Gehost door',
        de: 'Gastgeber',
      },
      beforeYouBook: {
        fr: 'Avant de réserver',
        en: 'Before you book',
        nl: 'Voordat u boekt',
        de: 'Bevor Sie buchen',
      },
      tips: {
        chooseTime: {
          fr: 'Choisissez un créneau horaire qui te convient',
          en: 'Choose a time slot that works for you',
          nl: 'Kies een tijdslot dat bij u past',
          de: 'Wählen Sie einen passenden Zeitpunkt',
        },
        provideContact: {
          fr: 'Fournis tes coordonnées pour que le propriétaire puisse te contacter',
          en: 'Provide your contact details so the owner can reach you',
          nl: 'Geef uw contactgegevens zodat de eigenaar u kan bereiken',
          de: 'Geben Sie Ihre Kontaktdaten an, damit der Eigentümer Sie erreichen kann',
        },
        ownerConfirm: {
          fr: 'Le propriétaire confirmera votre visite par email',
          en: 'The owner will confirm your visit by email',
          nl: 'De eigenaar bevestigt uw bezoek per e-mail',
          de: 'Der Eigentümer bestätigt Ihren Besuch per E-Mail',
        },
        emailConfirmation: {
          fr: 'Tu recevras un email de confirmation avec les détails',
          en: 'You will receive a confirmation email with the details',
          nl: 'U ontvangt een bevestigingsmail met de details',
          de: 'Sie erhalten eine Bestätigungs-E-Mail mit den Details',
        },
      },
      visitType: {
        fr: 'Type de visite',
        en: 'Visit type',
        nl: 'Bezoektype',
        de: 'Besichtigungsart',
      },
      inPerson: {
        fr: 'En personne',
        en: 'In person',
        nl: 'Persoonlijk',
        de: 'Vor Ort',
      },
      inPersonVisit: {
        fr: 'Visite en personne',
        en: 'In-person visit',
        nl: 'Persoonlijk bezoek',
        de: 'Besichtigung vor Ort',
      },
      visitProperty: {
        fr: 'Visitez le logement en personne',
        en: 'Visit the property in person',
        nl: 'Bezoek het eigendom persoonlijk',
        de: 'Besichtigen Sie die Immobilie vor Ort',
      },
      virtualTour: {
        fr: 'Visite virtuelle',
        en: 'Virtual tour',
        nl: 'Virtuele rondleiding',
        de: 'Virtuelle Besichtigung',
      },
      videoCall: {
        fr: 'Par appel vidéo avec le propriétaire',
        en: 'Video call with the owner',
        nl: 'Videogesprek met de eigenaar',
        de: 'Videoanruf mit dem Eigentümer',
      },
      availableTimeSlots: {
        fr: 'Créneaux disponibles',
        en: 'Available time slots',
        nl: 'Beschikbare tijdslots',
        de: 'Verfügbare Zeitfenster',
      },
      contactInfo: {
        fr: 'Vos coordonnées',
        en: 'Your contact information',
        nl: 'Uw contactgegevens',
        de: 'Ihre Kontaktdaten',
      },
      fields: {
        email: {
          fr: 'Adresse email',
          en: 'Email address',
          nl: 'E-mailadres',
          de: 'E-Mail-Adresse',
        },
        phone: {
          fr: 'Numéro de téléphone',
          en: 'Phone number',
          nl: 'Telefoonnummer',
          de: 'Telefonnummer',
        },
        messageOptional: {
          fr: 'Message pour le propriétaire (optionnel)',
          en: 'Message to the owner (optional)',
          nl: 'Bericht voor de eigenaar (optioneel)',
          de: 'Nachricht an den Eigentümer (optional)',
        },
      },
      placeholders: {
        message: {
          fr: 'Présente-toi brièvement ou posez des questions...',
          en: 'Briefly introduce yourself or ask questions...',
          nl: 'Stel uzelf kort voor of stel vragen...',
          de: 'Stellen Sie sich kurz vor oder stellen Sie Fragen...',
        },
      },
      summary: {
        title: {
          fr: 'Récapitulatif de ton visite',
          en: 'Visit summary',
          nl: 'Bezoeksamenvatting',
          de: 'Besichtigungsübersicht',
        },
        property: {
          fr: 'Propriété',
          en: 'Property',
          nl: 'Eigendom',
          de: 'Immobilie',
        },
        date: {
          fr: 'Date',
          en: 'Date',
          nl: 'Datum',
          de: 'Datum',
        },
        time: {
          fr: 'Heure',
          en: 'Time',
          nl: 'Tijd',
          de: 'Uhrzeit',
        },
        type: {
          fr: 'Type',
          en: 'Type',
          nl: 'Type',
          de: 'Typ',
        },
        duration: {
          fr: 'Durée',
          en: 'Duration',
          nl: 'Duur',
          de: 'Dauer',
        },
      },
      thirtyMinutes: {
        fr: '30 minutes',
        en: '30 minutes',
        nl: '30 minuten',
        de: '30 Minuten',
      },
      booking: {
        fr: 'Réservation en cours...',
        en: 'Booking...',
        nl: 'Boeken...',
        de: 'Wird gebucht...',
      },
      confirmBooking: {
        fr: 'Confirmer la réservation',
        en: 'Confirm booking',
        nl: 'Boeking bevestigen',
        de: 'Buchung bestätigen',
      },
      errors: {
        loadFailed: {
          fr: 'Erreur lors du chargement de la propriété',
          en: 'Error loading property',
          nl: 'Fout bij het laden van eigendom',
          de: 'Fehler beim Laden der Immobilie',
        },
        selectDateTime: {
          fr: 'Veuillez sélectionner une date et un créneau',
          en: 'Please select a date and time slot',
          nl: 'Selecteer een datum en tijdslot',
          de: 'Bitte wählen Sie ein Datum und einen Zeitfenster',
        },
        phoneRequired: {
          fr: 'Veuillez entrer ton numéro de téléphone',
          en: 'Please enter your phone number',
          nl: 'Voer uw telefoonnummer in',
          de: 'Bitte geben Sie Ihre Telefonnummer ein',
        },
        ownerMissing: {
          fr: 'Propriétaire introuvable',
          en: 'Owner not found',
          nl: 'Eigenaar niet gevonden',
          de: 'Eigentümer nicht gefunden',
        },
        bookingFailed: {
          fr: 'Erreur lors de la réservation',
          en: 'Booking failed',
          nl: 'Boeking mislukt',
          de: 'Buchung fehlgeschlagen',
        },
      },
    },

    // Apply Page
    apply: {
      title: {
        fr: 'Postuler pour ce logement',
        en: 'Apply for this property',
        nl: 'Solliciteren voor dit eigendom',
        de: 'Für diese Immobilie bewerben',
      },
      subtitle: {
        fr: 'Complète votre candidature',
        en: 'Complete your application',
        nl: 'Voltooi uw aanvraag',
        de: 'Vervollständigen Sie Ihre Bewerbung',
      },
      selectedRoom: {
        fr: 'Chambre sélectionnée',
        en: 'Selected room',
        nl: 'Geselecteerde kamer',
        de: 'Ausgewähltes Zimmer',
      },
      room: {
        fr: 'Chambre',
        en: 'Room',
        nl: 'Kamer',
        de: 'Zimmer',
      },
      perMonth: {
        fr: 'mois',
        en: 'month',
        nl: 'maand',
        de: 'Monat',
      },
      selectRoom: {
        fr: 'Sélectionner une chambre',
        en: 'Select a room',
        nl: 'Selecteer een kamer',
        de: 'Zimmer auswählen',
      },
      message: {
        fr: 'Votre message (optionnel)',
        en: 'Your message (optional)',
        nl: 'Uw bericht (optioneel)',
        de: 'Ihre Nachricht (optional)',
      },
      messagePlaceholder: {
        fr: 'Présente-toi et explique pourquoi ce logement t\'intéresse...',
        en: 'Introduce yourself and explain why you\'re interested in this property...',
        nl: 'Stel uzelf voor en leg uit waarom u geïnteresseerd bent in dit eigendom...',
        de: 'Stellen Sie sich vor und erklären Sie, warum Sie an dieser Immobilie interessiert sind...',
      },
      submit: {
        fr: 'Envoyer ma candidature',
        en: 'Submit my application',
        nl: 'Mijn aanvraag verzenden',
        de: 'Meine Bewerbung einreichen',
      },
      submitting: {
        fr: 'Envoi en cours...',
        en: 'Submitting...',
        nl: 'Verzenden...',
        de: 'Wird gesendet...',
      },
      success: {
        fr: 'Candidature envoyée avec succès !',
        en: 'Application submitted successfully!',
        nl: 'Aanvraag succesvol verzonden!',
        de: 'Bewerbung erfolgreich eingereicht!',
      },
      error: {
        fr: 'Erreur lors de l\'envoi de la candidature',
        en: 'Error submitting application',
        nl: 'Fout bij het verzenden van de aanvraag',
        de: 'Fehler beim Einreichen der Bewerbung',
      },
      submitDisclaimer: {
        fr: 'En soumettant cette candidature, tu acceptes que tes informations soient partagées avec le propriétaire.',
        en: 'By submitting this application, you agree that your information will be shared with the owner.',
        nl: 'Door deze aanvraag in te dienen, gaat u ermee akkoord dat uw gegevens worden gedeeld met de eigenaar.',
        de: 'Mit dem Absenden dieser Bewerbung stimmen Sie zu, dass Ihre Daten mit dem Eigentümer geteilt werden.',
      },
      errors: {
        mustBeLoggedIn: {
          fr: 'Tu dois être connecté pour postuler',
          en: 'You must be logged in to apply',
          nl: 'U moet ingelogd zijn om te solliciteren',
          de: 'Sie müssen angemeldet sein, um sich zu bewerben',
        },
        propertyNotFound: {
          fr: 'Propriété introuvable',
          en: 'Property not found',
          nl: 'Eigendom niet gevonden',
          de: 'Immobilie nicht gefunden',
        },
        uploadError: {
          fr: 'Erreur lors du téléchargement de',
          en: 'Error uploading',
          nl: 'Fout bij het uploaden van',
          de: 'Fehler beim Hochladen von',
        },
        alreadyApplied: {
          fr: 'Tu as déjà postulé pour ce logement',
          en: 'You have already applied for this property',
          nl: 'U heeft al gesolliciteerd voor dit eigendom',
          de: 'Sie haben sich bereits für diese Immobilie beworben',
        },
        submitError: {
          fr: 'Erreur lors de l\'envoi de la candidature',
          en: 'Error submitting application',
          nl: 'Fout bij het verzenden van de aanvraag',
          de: 'Fehler beim Einreichen der Bewerbung',
        },
      },
      sections: {
        personalInfo: {
          fr: 'Informations personnelles',
          en: 'Personal Information',
          nl: 'Persoonlijke gegevens',
          de: 'Persönliche Informationen',
        },
        moveInDetails: {
          fr: 'Détails de l\'emménagement',
          en: 'Move-in Details',
          nl: 'Verhuisdetails',
          de: 'Einzugsdetails',
        },
        professionalInfo: {
          fr: 'Informations professionnelles',
          en: 'Professional Information',
          nl: 'Professionele gegevens',
          de: 'Berufliche Informationen',
        },
        personalMessage: {
          fr: 'Message personnel',
          en: 'Personal Message',
          nl: 'Persoonlijk bericht',
          de: 'Persönliche Nachricht',
        },
        documents: {
          fr: 'Documents justificatifs',
          en: 'Supporting Documents',
          nl: 'Ondersteunende documenten',
          de: 'Nachweisdokumente',
        },
      },
      fields: {
        fullName: {
          fr: 'Nom complet',
          en: 'Full name',
          nl: 'Volledige naam',
          de: 'Vollständiger Name',
        },
        email: {
          fr: 'Email',
          en: 'Email',
          nl: 'E-mail',
          de: 'E-Mail',
        },
        phoneOptional: {
          fr: 'Téléphone (optionnel)',
          en: 'Phone (optional)',
          nl: 'Telefoon (optioneel)',
          de: 'Telefon (optional)',
        },
        desiredMoveInDate: {
          fr: 'Date d\'emménagement souhaitée',
          en: 'Desired move-in date',
          nl: 'Gewenste verhuisdatum',
          de: 'Gewünschtes Einzugsdatum',
        },
        leaseDuration: {
          fr: 'Durée de séjour',
          en: 'Lease duration',
          nl: 'Huurperiode',
          de: 'Mietdauer',
        },
        occupation: {
          fr: 'Profession',
          en: 'Occupation',
          nl: 'Beroep',
          de: 'Beruf',
        },
        employerName: {
          fr: 'Employeur',
          en: 'Employer name',
          nl: 'Werkgever',
          de: 'Arbeitgeber',
        },
        monthlyIncome: {
          fr: 'Revenu mensuel (€)',
          en: 'Monthly income (€)',
          nl: 'Maandelijks inkomen (€)',
          de: 'Monatliches Einkommen (€)',
        },
        aboutYou: {
          fr: 'Présente-toi',
          en: 'Tell us about yourself',
          nl: 'Stel uzelf voor',
          de: 'Stellen Sie sich vor',
        },
      },
      leaseOptions: {
        threeMonths: {
          fr: '3 mois',
          en: '3 months',
          nl: '3 maanden',
          de: '3 Monate',
        },
        sixMonths: {
          fr: '6 mois',
          en: '6 months',
          nl: '6 maanden',
          de: '6 Monate',
        },
        twelveMonths: {
          fr: '12 mois',
          en: '12 months',
          nl: '12 maanden',
          de: '12 Monate',
        },
        twentyFourMonths: {
          fr: '24 mois',
          en: '24 months',
          nl: '24 maanden',
          de: '24 Monate',
        },
      },
      placeholders: {
        occupation: {
          fr: 'Ex: Étudiant, Développeur, Infirmier...',
          en: 'E.g.: Student, Developer, Nurse...',
          nl: 'Bijv.: Student, Ontwikkelaar, Verpleegkundige...',
          de: 'Z.B.: Student, Entwickler, Krankenpfleger...',
        },
        employerName: {
          fr: 'Ex: Google, Université de Paris...',
          en: 'E.g.: Google, University of Paris...',
          nl: 'Bijv.: Google, Universiteit van Amsterdam...',
          de: 'Z.B.: Google, Universität Berlin...',
        },
        message: {
          fr: 'Décris-toi brièvement : tes activités, tes centres d\'intérêt, pourquoi ce logement te plaît...',
          en: 'Briefly describe yourself: your activities, interests, why you like this property...',
          nl: 'Beschrijf uzelf kort: uw activiteiten, interesses, waarom u dit eigendom leuk vindt...',
          de: 'Beschreiben Sie sich kurz: Ihre Aktivitäten, Interessen, warum Ihnen diese Immobilie gefällt...',
        },
      },
      documents: {
        idDocument: {
          fr: 'Pièce d\'identité (CNI, passeport)',
          en: 'ID document (ID card, passport)',
          nl: 'Identiteitsdocument (ID-kaart, paspoort)',
          de: 'Ausweisdokument (Personalausweis, Reisepass)',
        },
        proofOfIncome: {
          fr: 'Justificatif de revenus (3 derniers bulletins de salaire)',
          en: 'Proof of income (last 3 pay slips)',
          nl: 'Inkomensbewijs (laatste 3 loonstroken)',
          de: 'Einkommensnachweis (letzte 3 Gehaltsabrechnungen)',
        },
        referenceLetter: {
          fr: 'Lettre de recommandation (optionnel)',
          en: 'Reference letter (optional)',
          nl: 'Aanbevelingsbrief (optioneel)',
          de: 'Empfehlungsschreiben (optional)',
        },
      },
      documentsHelp: {
        fr: 'Ces documents sont optionnels mais augmentent tes chances d\'être sélectionné. Formats acceptés : PDF, JPG, PNG.',
        en: 'These documents are optional but increase your chances of being selected. Accepted formats: PDF, JPG, PNG.',
        nl: 'Deze documenten zijn optioneel maar verhogen uw kansen om geselecteerd te worden. Geaccepteerde formaten: PDF, JPG, PNG.',
        de: 'Diese Dokumente sind optional, erhöhen aber Ihre Chancen, ausgewählt zu werden. Akzeptierte Formate: PDF, JPG, PNG.',
      },
    },

    // Compare Page
    compare: {
      title: {
        fr: 'Comparer {count} propriétés',
        en: 'Compare {count} properties',
        nl: '{count} eigendommen vergelijken',
        de: '{count} Immobilien vergleichen',
      },
      addProperty: {
        fr: 'Ajouter une propriété',
        en: 'Add a property',
        nl: 'Een eigendom toevoegen',
        de: 'Immobilie hinzufügen',
      },
      removeProperty: {
        fr: 'Retirer',
        en: 'Remove',
        nl: 'Verwijderen',
        de: 'Entfernen',
      },
      noProperties: {
        fr: 'Aucune propriété à comparer',
        en: 'No properties to compare',
        nl: 'Geen eigendommen om te vergelijken',
        de: 'Keine Immobilien zum Vergleichen',
      },
      selectPrompt: {
        fr: 'Sélectionnez au moins 2 propriétés pour les comparer',
        en: 'Select at least 2 properties to compare',
        nl: 'Selecteer minimaal 2 eigendommen om te vergelijken',
        de: 'Wählen Sie mindestens 2 Immobilien zum Vergleichen',
      },
      loading: {
        fr: 'Chargement des propriétés...',
        en: 'Loading properties...',
        nl: 'Eigendommen laden...',
        de: 'Immobilien werden geladen...',
      },
      backToSearch: {
        fr: 'Retour à la recherche',
        en: 'Back to search',
        nl: 'Terug naar zoeken',
        de: 'Zurück zur Suche',
      },
      save: {
        fr: 'Sauvegarder',
        en: 'Save',
        nl: 'Opslaan',
        de: 'Speichern',
      },
      saved: {
        fr: 'Comparaison sauvegardée',
        en: 'Comparison saved',
        nl: 'Vergelijking opgeslagen',
        de: 'Vergleich gespeichert',
      },
      share: {
        fr: 'Partager',
        en: 'Share',
        nl: 'Delen',
        de: 'Teilen',
      },
      feature: {
        fr: 'Caractéristique',
        en: 'Feature',
        nl: 'Kenmerk',
        de: 'Merkmal',
      },
      perMonth: {
        fr: '/mois',
        en: '/month',
        nl: '/maand',
        de: '/Monat',
      },
      bestPrice: {
        fr: 'Meilleur prix',
        en: 'Best price',
        nl: 'Beste prijs',
        de: 'Bester Preis',
      },
      largest: {
        fr: 'Plus grand',
        en: 'Largest',
        nl: 'Grootste',
        de: 'Größte',
      },
      immediately: {
        fr: 'Immédiatement',
        en: 'Immediately',
        nl: 'Direct',
        de: 'Sofort',
      },
      viewDetails: {
        fr: 'Voir les détails',
        en: 'View details',
        nl: 'Details bekijken',
        de: 'Details ansehen',
      },
      fields: {
        monthlyPrice: {
          fr: 'Prix mensuel',
          en: 'Monthly price',
          nl: 'Maandelijkse prijs',
          de: 'Monatlicher Preis',
        },
        bedrooms: {
          fr: 'Chambres',
          en: 'Bedrooms',
          nl: 'Slaapkamers',
          de: 'Schlafzimmer',
        },
        surface: {
          fr: 'Surface',
          en: 'Surface area',
          nl: 'Oppervlakte',
          de: 'Fläche',
        },
        propertyType: {
          fr: 'Type de bien',
          en: 'Property type',
          nl: 'Type eigendom',
          de: 'Immobilientyp',
        },
        availableFrom: {
          fr: 'Disponible à partir de',
          en: 'Available from',
          nl: 'Beschikbaar vanaf',
          de: 'Verfügbar ab',
        },
        furnished: {
          fr: 'Meublé',
          en: 'Furnished',
          nl: 'Gemeubileerd',
          de: 'Möbliert',
        },
        parking: {
          fr: 'Parking',
          en: 'Parking',
          nl: 'Parkeren',
          de: 'Parken',
        },
        balcony: {
          fr: 'Balcon',
          en: 'Balcony',
          nl: 'Balkon',
          de: 'Balkon',
        },
        actions: {
          fr: 'Actions',
          en: 'Actions',
          nl: 'Acties',
          de: 'Aktionen',
        },
      },
      legend: {
        bestValue: {
          fr: 'Meilleure valeur',
          en: 'Best value',
          nl: 'Beste waarde',
          de: 'Bester Wert',
        },
        available: {
          fr: 'Disponible',
          en: 'Available',
          nl: 'Beschikbaar',
          de: 'Verfügbar',
        },
        notAvailable: {
          fr: 'Non disponible',
          en: 'Not available',
          nl: 'Niet beschikbaar',
          de: 'Nicht verfügbar',
        },
      },
      errors: {
        selectCount: {
          fr: 'Sélectionnez entre 2 et 3 propriétés pour comparer',
          en: 'Select between 2 and 3 properties to compare',
          nl: 'Selecteer 2 tot 3 eigendommen om te vergelijken',
          de: 'Wählen Sie 2 bis 3 Immobilien zum Vergleichen',
        },
        loadError: {
          fr: 'Erreur lors du chargement des propriétés',
          en: 'Error loading properties',
          nl: 'Fout bij het laden van eigendommen',
          de: 'Fehler beim Laden der Immobilien',
        },
        saveError: {
          fr: 'Erreur lors de la sauvegarde de la comparaison',
          en: 'Error saving comparison',
          nl: 'Fout bij het opslaan van de vergelijking',
          de: 'Fehler beim Speichern des Vergleichs',
        },
      },
    },

    // Property Card
    card: {
      viewDetails: {
        fr: 'Voir les détails',
        en: 'View details',
        nl: 'Details bekijken',
        de: 'Details ansehen',
      },
      available: {
        fr: 'Disponible',
        en: 'Available',
        nl: 'Beschikbaar',
        de: 'Verfügbar',
      },
      unavailable: {
        fr: 'Indisponible',
        en: 'Unavailable',
        nl: 'Niet beschikbaar',
        de: 'Nicht verfügbar',
      },
    },

    // Common status
    status: {
      published: {
        fr: 'Publié',
        en: 'Published',
        nl: 'Gepubliceerd',
        de: 'Veröffentlicht',
      },
      draft: {
        fr: 'Brouillon',
        en: 'Draft',
        nl: 'Concept',
        de: 'Entwurf',
      },
      archived: {
        fr: 'Archivé',
        en: 'Archived',
        nl: 'Gearchiveerd',
        de: 'Archiviert',
      },
    },
  },

  // ============================================================================
  // PAYMENTS PAGE
  // ============================================================================
  payments: {
    title: {
      fr: 'Paiements',
      en: 'Payments',
      nl: 'Betalingen',
      de: 'Zahlungen',
    },
    subtitle: {
      fr: 'Gère tes paiements et échéanciers',
      en: 'Manage your payments and schedules',
      nl: 'Beheer uw betalingen en schema\'s',
      de: 'Verwalten Sie Ihre Zahlungen und Zeitpläne',
    },
    loading: {
      fr: 'Chargement...',
      en: 'Loading...',
      nl: 'Laden...',
      de: 'Laden...',
    },
    newPayment: {
      fr: 'Nouveau paiement',
      en: 'New payment',
      nl: 'Nieuwe betaling',
      de: 'Neue Zahlung',
    },

    // Summary cards
    summary: {
      totalPaid: {
        fr: 'Total payé',
        en: 'Total paid',
        nl: 'Totaal betaald',
        de: 'Insgesamt bezahlt',
      },
      totalReceived: {
        fr: 'Total reçu',
        en: 'Total received',
        nl: 'Totaal ontvangen',
        de: 'Insgesamt erhalten',
      },
      pending: {
        fr: 'En attente',
        en: 'Pending',
        nl: 'In afwachting',
        de: 'Ausstehend',
      },
      transactions: {
        fr: 'Transactions',
        en: 'Transactions',
        nl: 'Transacties',
        de: 'Transaktionen',
      },
    },

    // Upcoming payments
    upcomingPayments: {
      fr: 'Paiements à venir',
      en: 'Upcoming payments',
      nl: 'Komende betalingen',
      de: 'Anstehende Zahlungen',
    },
    autoPay: {
      fr: 'Auto-paiement',
      en: 'Auto-pay',
      nl: 'Automatische betaling',
      de: 'Automatische Zahlung',
    },

    // Tabs
    tabs: {
      transactions: {
        fr: 'Transactions',
        en: 'Transactions',
        nl: 'Transacties',
        de: 'Transaktionen',
      },
      schedules: {
        fr: 'Échéanciers',
        en: 'Schedules',
        nl: 'Schema\'s',
        de: 'Zeitpläne',
      },
      accounts: {
        fr: 'Moyens de paiement',
        en: 'Payment methods',
        nl: 'Betaalmethoden',
        de: 'Zahlungsmethoden',
      },
    },

    // Transaction status
    status: {
      completed: {
        fr: 'Payé',
        en: 'Paid',
        nl: 'Betaald',
        de: 'Bezahlt',
      },
      pending: {
        fr: 'En attente',
        en: 'Pending',
        nl: 'In afwachting',
        de: 'Ausstehend',
      },
      failed: {
        fr: 'Échoué',
        en: 'Failed',
        nl: 'Mislukt',
        de: 'Fehlgeschlagen',
      },
      cancelled: {
        fr: 'Annulé',
        en: 'Cancelled',
        nl: 'Geannuleerd',
        de: 'Storniert',
      },
      refunded: {
        fr: 'Remboursé',
        en: 'Refunded',
        nl: 'Terugbetaald',
        de: 'Erstattet',
      },
    },

    // Transaction types
    types: {
      rent_payment: {
        fr: 'Loyer',
        en: 'Rent',
        nl: 'Huur',
        de: 'Miete',
      },
      security_deposit: {
        fr: 'Caution',
        en: 'Security deposit',
        nl: 'Waarborgsom',
        de: 'Kaution',
      },
      application_fee: {
        fr: 'Frais de dossier',
        en: 'Application fee',
        nl: 'Aanvraagkosten',
        de: 'Antragsgebühr',
      },
      service_fee: {
        fr: 'Frais de service',
        en: 'Service fee',
        nl: 'Servicekosten',
        de: 'Servicegebühr',
      },
      refund: {
        fr: 'Remboursement',
        en: 'Refund',
        nl: 'Terugbetaling',
        de: 'Rückerstattung',
      },
      damage_charge: {
        fr: 'Frais de dégâts',
        en: 'Damage charge',
        nl: 'Schadekosten',
        de: 'Schadenskosten',
      },
      utility_payment: {
        fr: 'Charges',
        en: 'Utilities',
        nl: 'Nutsvoorzieningen',
        de: 'Nebenkosten',
      },
      other: {
        fr: 'Autre',
        en: 'Other',
        nl: 'Overig',
        de: 'Sonstiges',
      },
    },

    // Payment frequency
    frequency: {
      weekly: {
        fr: 'Hebdomadaire',
        en: 'Weekly',
        nl: 'Wekelijks',
        de: 'Wöchentlich',
      },
      biweekly: {
        fr: 'Bimensuel',
        en: 'Biweekly',
        nl: 'Tweewekelijks',
        de: 'Zweiwöchentlich',
      },
      monthly: {
        fr: 'Mensuel',
        en: 'Monthly',
        nl: 'Maandelijks',
        de: 'Monatlich',
      },
      quarterly: {
        fr: 'Trimestriel',
        en: 'Quarterly',
        nl: 'Driemaandelijks',
        de: 'Vierteljährlich',
      },
      yearly: {
        fr: 'Annuel',
        en: 'Yearly',
        nl: 'Jaarlijks',
        de: 'Jährlich',
      },
    },

    // Empty states
    empty: {
      transactions: {
        fr: 'Aucune transaction',
        en: 'No transactions',
        nl: 'Geen transacties',
        de: 'Keine Transaktionen',
      },
      schedules: {
        fr: 'Aucun échéancier configuré',
        en: 'No schedules configured',
        nl: 'Geen schema\'s geconfigureerd',
        de: 'Keine Zeitpläne konfiguriert',
      },
      accounts: {
        fr: 'Aucun moyen de paiement',
        en: 'No payment methods',
        nl: 'Geen betaalmethoden',
        de: 'Keine Zahlungsmethoden',
      },
      addPaymentMethod: {
        fr: 'Ajouter un moyen de paiement',
        en: 'Add payment method',
        nl: 'Betaalmethode toevoegen',
        de: 'Zahlungsmethode hinzufügen',
      },
    },

    // Schedule labels
    schedule: {
      nextPayment: {
        fr: 'Prochain paiement',
        en: 'Next payment',
        nl: 'Volgende betaling',
        de: 'Nächste Zahlung',
      },
      autoPayEnabled: {
        fr: 'Activé',
        en: 'Enabled',
        nl: 'Ingeschakeld',
        de: 'Aktiviert',
      },
      autoPayDisabled: {
        fr: 'Désactivé',
        en: 'Disabled',
        nl: 'Uitgeschakeld',
        de: 'Deaktiviert',
      },
      active: {
        fr: 'Actif',
        en: 'Active',
        nl: 'Actief',
        de: 'Aktiv',
      },
      inactive: {
        fr: 'Inactif',
        en: 'Inactive',
        nl: 'Inactief',
        de: 'Inaktiv',
      },
    },

    // Payment account
    account: {
      bankAccount: {
        fr: 'Compte bancaire',
        en: 'Bank account',
        nl: 'Bankrekening',
        de: 'Bankkonto',
      },
      default: {
        fr: 'Par défaut',
        en: 'Default',
        nl: 'Standaard',
        de: 'Standard',
      },
      verified: {
        fr: 'Vérifié',
        en: 'Verified',
        nl: 'Geverifieerd',
        de: 'Verifiziert',
      },
      pendingVerification: {
        fr: 'En attente',
        en: 'Pending',
        nl: 'In afwachting',
        de: 'Ausstehend',
      },
      expires: {
        fr: 'Expire',
        en: 'Expires',
        nl: 'Verloopt',
        de: 'Läuft ab',
      },
    },
    addAccount: {
      fr: 'Ajouter un moyen de paiement',
      en: 'Add payment method',
      nl: 'Betaalmethode toevoegen',
      de: 'Zahlungsmethode hinzufügen',
    },
  },

  // ============================================================================
  // COMMUNITY PAGE
  // ============================================================================
  community: {
    title: {
      fr: 'Communauté',
      en: 'Community',
      nl: 'Gemeenschap',
      de: 'Gemeinschaft',
    },
    subtitle: {
      fr: 'Connecte-toi avec tes résidents et voisins',
      en: 'Connect with your roommates and neighbors',
      nl: 'Verbind met je huisgenoten en buren',
      de: 'Verbinde dich mit deinen Mitbewohnern und Nachbarn',
    },
    backToDashboard: {
      fr: 'Retour au tableau de bord',
      en: 'Back to Dashboard',
      nl: 'Terug naar Dashboard',
      de: 'Zurück zum Dashboard',
    },

    // Roommates section
    roommates: {
      title: {
        fr: 'Vos résidents',
        en: 'Your Roommates',
        nl: 'Je huisgenoten',
        de: 'Deine Mitbewohner',
      },
      empty: {
        fr: 'Pas encore de résidents',
        en: 'No roommates yet',
        nl: 'Nog geen huisgenoten',
        de: 'Noch keine Mitbewohner',
      },
      emptyHint: {
        fr: 'Une fois installé, tu verras tes résidents ici',
        en: 'Once you move in, you\'ll see your roommates here',
        nl: 'Zodra je bent verhuisd, zie je hier je huisgenoten',
        de: 'Sobald du eingezogen bist, siehst du hier deine Mitbewohner',
      },
      message: {
        fr: 'Message',
        en: 'Message',
        nl: 'Bericht',
        de: 'Nachricht',
      },
    },

    // Events section
    events: {
      title: {
        fr: 'Événements à venir',
        en: 'Upcoming Events',
        nl: 'Aankomende evenementen',
        de: 'Bevorstehende Veranstaltungen',
      },
      empty: {
        fr: 'Pas d\'événements à venir',
        en: 'No upcoming events',
        nl: 'Geen aankomende evenementen',
        de: 'Keine bevorstehenden Veranstaltungen',
      },
      emptyHint: {
        fr: 'Les événements de la communauté apparaîtront ici lorsqu\'ils seront planifiés',
        en: 'Community events will appear here when scheduled',
        nl: 'Gemeenschapsevenementen verschijnen hier wanneer ze zijn gepland',
        de: 'Gemeinschaftsveranstaltungen erscheinen hier, wenn sie geplant sind',
      },
      createEvent: {
        fr: 'Créer un événement',
        en: 'Create Event',
        nl: 'Evenement maken',
        de: 'Veranstaltung erstellen',
      },
      join: {
        fr: 'Rejoindre',
        en: 'Join',
        nl: 'Deelnemen',
        de: 'Teilnehmen',
      },
    },
  },

  // ============================================================================
  // GROUPS PAGES
  // ============================================================================
  groupJoin: {
    backToDashboard: {
      fr: 'Retour au tableau de bord',
      en: 'Back to Dashboard',
      nl: 'Terug naar dashboard',
      de: 'Zurück zum Dashboard',
    },
    title: {
      fr: 'Rejoindre un groupe',
      en: 'Join a Group',
      nl: 'Word lid van een groep',
      de: 'Einer Gruppe beitreten',
    },
    subtitle: {
      fr: 'Entrez un code d\'invitation ou parcourez les groupes ouverts',
      en: 'Enter an invite code or browse open groups',
      nl: 'Voer een uitnodigingscode in of blader door open groepen',
      de: 'Geben Sie einen Einladungscode ein oder durchsuchen Sie offene Gruppen',
    },
    inviteCode: {
      title: {
        fr: 'Rejoindre avec un code d\'invitation',
        en: 'Join with Invite Code',
        nl: 'Lid worden met uitnodigingscode',
        de: 'Mit Einladungscode beitreten',
      },
      placeholder: {
        fr: 'Entrez le code d\'invitation',
        en: 'Enter invite code',
        nl: 'Voer uitnodigingscode in',
        de: 'Einladungscode eingeben',
      },
      searching: {
        fr: 'Recherche...',
        en: 'Searching...',
        nl: 'Zoeken...',
        de: 'Suche...',
      },
    },
    group: {
      noDescription: {
        fr: 'Pas de description',
        en: 'No description',
        nl: 'Geen beschrijving',
        de: 'Keine Beschreibung',
      },
      members: {
        fr: 'membres',
        en: 'members',
        nl: 'leden',
        de: 'Mitglieder',
      },
      requiresApproval: {
        fr: 'Approbation requise',
        en: 'Requires approval',
        nl: 'Goedkeuring vereist',
        de: 'Genehmigung erforderlich',
      },
      joining: {
        fr: 'Adhésion en cours...',
        en: 'Joining...',
        nl: 'Aan het toetreden...',
        de: 'Beitritt läuft...',
      },
      groupFull: {
        fr: 'Groupe complet',
        en: 'Group Full',
        nl: 'Groep vol',
        de: 'Gruppe voll',
      },
      join: {
        fr: 'Rejoindre le groupe',
        en: 'Join Group',
        nl: 'Lid worden van groep',
        de: 'Gruppe beitreten',
      },
      joinShort: {
        fr: 'Rejoindre',
        en: 'Join',
        nl: 'Toetreden',
        de: 'Beitreten',
      },
      full: {
        fr: 'Complet',
        en: 'Full',
        nl: 'Vol',
        de: 'Voll',
      },
    },
    divider: {
      fr: 'ou parcourez les groupes ouverts',
      en: 'or browse open groups',
      nl: 'of blader door open groepen',
      de: 'oder durchsuchen Sie offene Gruppen',
    },
    openGroups: {
      title: {
        fr: 'Groupes ouverts',
        en: 'Open Groups',
        nl: 'Open groepen',
        de: 'Offene Gruppen',
      },
      refresh: {
        fr: 'Actualiser',
        en: 'Refresh',
        nl: 'Vernieuwen',
        de: 'Aktualisieren',
      },
      loading: {
        fr: 'Chargement...',
        en: 'Loading...',
        nl: 'Laden...',
        de: 'Laden...',
      },
      empty: {
        fr: 'Aucun groupe ouvert disponible',
        en: 'No open groups available',
        nl: 'Geen open groepen beschikbaar',
        de: 'Keine offenen Gruppen verfügbar',
      },
      emptyHint: {
        fr: 'Cliquez sur actualiser pour vérifier les nouveaux groupes',
        en: 'Click refresh to check for new groups',
        nl: 'Klik op vernieuwen om te controleren op nieuwe groepen',
        de: 'Klicken Sie auf Aktualisieren, um nach neuen Gruppen zu suchen',
      },
    },
    info: {
      title: {
        fr: 'À propos des groupes',
        en: 'About joining groups',
        nl: 'Over het toetreden tot groepen',
        de: 'Über den Beitritt zu Gruppen',
      },
      rule1: {
        fr: 'Tu ne peux être que dans un seul groupe à la fois',
        en: 'You can only be in one group at a time',
        nl: 'Je kunt maar in één groep tegelijk zijn',
        de: 'Sie können nur einer Gruppe gleichzeitig angehören',
      },
      rule2: {
        fr: 'Certains groupes nécessitent l\'approbation du créateur',
        en: 'Some groups require approval from the creator',
        nl: 'Sommige groepen vereisen goedkeuring van de maker',
        de: 'Einige Gruppen erfordern die Genehmigung des Erstellers',
      },
      rule3: {
        fr: 'Les groupes cherchent ensemble et postulent en un',
        en: 'Group search together and apply as one',
        nl: 'Groepen zoeken samen en solliciteren als één',
        de: 'Gruppen suchen gemeinsam und bewerben sich als eine',
      },
    },
    errors: {
      enterCode: {
        fr: 'Veuillez entrer un code d\'invitation',
        en: 'Please enter an invite code',
        nl: 'Voer een uitnodigingscode in',
        de: 'Bitte geben Sie einen Einladungscode ein',
      },
      alreadyInGroup: {
        fr: 'Tu es déjà dans un groupe',
        en: 'You are already in a group',
        nl: 'Je bent al lid van een groep',
        de: 'Sie sind bereits in einer Gruppe',
      },
      invalidCode: {
        fr: 'Code d\'invitation invalide',
        en: 'Invalid invite code',
        nl: 'Ongeldige uitnodigingscode',
        de: 'Ungültiger Einladungscode',
      },
      expiredCode: {
        fr: 'Ce code d\'invitation a expiré',
        en: 'This invite code has expired',
        nl: 'Deze uitnodigingscode is verlopen',
        de: 'Dieser Einladungscode ist abgelaufen',
      },
      groupNotFound: {
        fr: 'Groupe non trouvé',
        en: 'Group not found',
        nl: 'Groep niet gevonden',
        de: 'Gruppe nicht gefunden',
      },
      searchFailed: {
        fr: 'Échec de la recherche du groupe',
        en: 'Failed to find group',
        nl: 'Kan groep niet vinden',
        de: 'Gruppe konnte nicht gefunden werden',
      },
      joinFailed: {
        fr: 'Échec de l\'adhésion au groupe',
        en: 'Failed to join group',
        nl: 'Kan niet toetreden tot groep',
        de: 'Beitritt zur Gruppe fehlgeschlagen',
      },
    },
    toast: {
      requestSent: {
        fr: 'Demande envoyée ! En attente d\'approbation.',
        en: 'Join request sent! Waiting for approval.',
        nl: 'Verzoek verzonden! Wachten op goedkeuring.',
        de: 'Anfrage gesendet! Warten auf Genehmigung.',
      },
      joinSuccess: {
        fr: 'Tu as rejoint le groupe avec succès !',
        en: 'Successfully joined the group!',
        nl: 'Succesvol lid geworden van de groep!',
        de: 'Erfolgreich der Gruppe beigetreten!',
      },
    },
  },

  groupSettings: {
    backToDashboard: {
      fr: 'Retour au tableau de bord',
      en: 'Back to Dashboard',
      nl: 'Terug naar dashboard',
      de: 'Zurück zum Dashboard',
    },
    title: {
      fr: 'Paramètres du groupe',
      en: 'Group Settings',
      nl: 'Groepsinstellingen',
      de: 'Gruppeneinstellungen',
    },
    subtitle: {
      fr: 'Gère les paramètres et les membres de ton groupe',
      en: 'Manage your group settings and members',
      nl: 'Beheer je groepsinstellingen en leden',
      de: 'Verwalten Sie Ihre Gruppeneinstellungen und Mitglieder',
    },
    basicInfo: {
      title: {
        fr: 'Informations de base',
        en: 'Basic Information',
        nl: 'Basisinformatie',
        de: 'Grundlegende Informationen',
      },
      groupName: {
        fr: 'Nom du groupe',
        en: 'Group Name',
        nl: 'Groepsnaam',
        de: 'Gruppenname',
      },
      groupNamePlaceholder: {
        fr: 'Nom du groupe',
        en: 'Group name',
        nl: 'Groepsnaam',
        de: 'Gruppenname',
      },
      description: {
        fr: 'Description',
        en: 'Description',
        nl: 'Beschrijving',
        de: 'Beschreibung',
      },
      descriptionPlaceholder: {
        fr: 'Description du groupe',
        en: 'Group description',
        nl: 'Groepsbeschrijving',
        de: 'Gruppenbeschreibung',
      },
      maxMembers: {
        fr: 'Nombre maximum de membres',
        en: 'Maximum Members',
        nl: 'Maximum aantal leden',
        de: 'Maximale Mitglieder',
      },
      openToNewMembers: {
        title: {
          fr: 'Ouvert aux nouveaux membres',
          en: 'Open to new members',
          nl: 'Open voor nieuwe leden',
          de: 'Offen für neue Mitglieder',
        },
        description: {
          fr: 'Permettre aux gens de trouver et rejoindre',
          en: 'Allow people to find and join',
          nl: 'Sta mensen toe om te vinden en toe te treden',
          de: 'Erlauben Sie Leuten, zu finden und beizutreten',
        },
      },
      requireApproval: {
        title: {
          fr: 'Approbation requise',
          en: 'Require approval',
          nl: 'Goedkeuring vereist',
          de: 'Genehmigung erforderlich',
        },
        description: {
          fr: 'Vérifier avant que les membres rejoignent',
          en: 'Review before members join',
          nl: 'Controleren voordat leden toetreden',
          de: 'Überprüfen, bevor Mitglieder beitreten',
        },
      },
      saveButton: {
        fr: 'Enregistrer les paramètres',
        en: 'Save Settings',
        nl: 'Instellingen opslaan',
        de: 'Einstellungen speichern',
      },
      saving: {
        fr: 'Enregistrement...',
        en: 'Saving...',
        nl: 'Opslaan...',
        de: 'Speichern...',
      },
    },
    inviteCode: {
      title: {
        fr: 'Code d\'invitation',
        en: 'Invite Code',
        nl: 'Uitnodigingscode',
        de: 'Einladungscode',
      },
      shareHint: {
        fr: 'Partagez ce code avec les personnes que tu souhaites inviter',
        en: 'Share this code with people you want to invite',
        nl: 'Deel deze code met mensen die je wilt uitnodigen',
        de: 'Teilen Sie diesen Code mit Personen, die Sie einladen möchten',
      },
      copied: {
        fr: 'Code d\'invitation copié !',
        en: 'Invite code copied!',
        nl: 'Uitnodigingscode gekopieerd!',
        de: 'Einladungscode kopiert!',
      },
    },
    members: {
      title: {
        fr: 'Membres',
        en: 'Members',
        nl: 'Leden',
        de: 'Mitglieder',
      },
      removeConfirm: {
        fr: 'Supprimer ce membre du groupe ?',
        en: 'Remove this member from the group?',
        nl: 'Dit lid uit de groep verwijderen?',
        de: 'Dieses Mitglied aus der Gruppe entfernen?',
      },
      removed: {
        fr: 'Membre supprimé',
        en: 'Member removed',
        nl: 'Lid verwijderd',
        de: 'Mitglied entfernt',
      },
      removeFailed: {
        fr: 'Échec de la suppression du membre',
        en: 'Failed to remove member',
        nl: 'Kan lid niet verwijderen',
        de: 'Mitglied konnte nicht entfernt werden',
      },
    },
    dangerZone: {
      title: {
        fr: 'Zone de danger',
        en: 'Danger Zone',
        nl: 'Gevarenzone',
        de: 'Gefahrenzone',
      },
      leaveGroup: {
        description: {
          fr: 'Quitter ce groupe',
          en: 'Leave this group',
          nl: 'Verlaat deze groep',
          de: 'Diese Gruppe verlassen',
        },
        confirm: {
          fr: 'Es-tu sûr de vouloir quitter ce groupe ?',
          en: 'Are you sure you want to leave this group?',
          nl: 'Weet je zeker dat je deze groep wilt verlaten?',
          de: 'Sind Sie sicher, dass Sie diese Gruppe verlassen möchten?',
        },
        button: {
          fr: 'Quitter le groupe',
          en: 'Leave Group',
          nl: 'Groep verlaten',
          de: 'Gruppe verlassen',
        },
        success: {
          fr: 'Tu as quitté le groupe',
          en: 'You left the group',
          nl: 'Je hebt de groep verlaten',
          de: 'Sie haben die Gruppe verlassen',
        },
        failed: {
          fr: 'Échec de la sortie du groupe',
          en: 'Failed to leave group',
          nl: 'Kan groep niet verlaten',
          de: 'Verlassen der Gruppe fehlgeschlagen',
        },
      },
      deleteGroup: {
        description: {
          fr: 'Supprimer définitivement ce groupe et retirer tous les membres',
          en: 'Permanently delete this group and remove all members',
          nl: 'Verwijder deze groep permanent en verwijder alle leden',
          de: 'Diese Gruppe dauerhaft löschen und alle Mitglieder entfernen',
        },
        button: {
          fr: 'Supprimer le groupe',
          en: 'Delete Group',
          nl: 'Groep verwijderen',
          de: 'Gruppe löschen',
        },
        confirmTitle: {
          fr: 'Es-tu absolument sûr ?',
          en: 'Are you absolutely sure?',
          nl: 'Weet je het absoluut zeker?',
          de: 'Sind Sie absolut sicher?',
        },
        confirmDescription: {
          fr: 'Cette action ne peut pas être annulée.',
          en: 'This action cannot be undone.',
          nl: 'Deze actie kan niet ongedaan worden gemaakt.',
          de: 'Diese Aktion kann nicht rückgängig gemacht werden.',
        },
        confirmButton: {
          fr: 'Oui, supprimer le groupe',
          en: 'Yes, Delete Group',
          nl: 'Ja, groep verwijderen',
          de: 'Ja, Gruppe löschen',
        },
        deleting: {
          fr: 'Suppression...',
          en: 'Deleting...',
          nl: 'Verwijderen...',
          de: 'Löschen...',
        },
        success: {
          fr: 'Groupe supprimé',
          en: 'Group deleted',
          nl: 'Groep verwijderd',
          de: 'Gruppe gelöscht',
        },
        failed: {
          fr: 'Échec de la suppression du groupe',
          en: 'Failed to delete group',
          nl: 'Kan groep niet verwijderen',
          de: 'Gruppe konnte nicht gelöscht werden',
        },
      },
      cancel: {
        fr: 'Annuler',
        en: 'Cancel',
        nl: 'Annuleren',
        de: 'Abbrechen',
      },
    },
    errors: {
      groupNotFound: {
        fr: 'Groupe non trouvé',
        en: 'Group not found',
        nl: 'Groep niet gevonden',
        de: 'Gruppe nicht gefunden',
      },
      notMember: {
        fr: 'Tu n\'es pas membre de ce groupe',
        en: 'You are not a member of this group',
        nl: 'Je bent geen lid van deze groep',
        de: 'Sie sind kein Mitglied dieser Gruppe',
      },
      noAccess: {
        fr: 'Seuls les administrateurs du groupe peuvent accéder aux paramètres',
        en: 'Only group admins can access settings',
        nl: 'Alleen groepsbeheerders kunnen instellingen openen',
        de: 'Nur Gruppenadministratoren können auf Einstellungen zugreifen',
      },
      nameRequired: {
        fr: 'Le nom du groupe est requis',
        en: 'Group name is required',
        nl: 'Groepsnaam is vereist',
        de: 'Gruppenname ist erforderlich',
      },
      loadFailed: {
        fr: 'Échec du chargement des paramètres du groupe',
        en: 'Failed to load group settings',
        nl: 'Kan groepsinstellingen niet laden',
        de: 'Gruppeneinstellungen konnten nicht geladen werden',
      },
      saveFailed: {
        fr: 'Échec de l\'enregistrement des paramètres',
        en: 'Failed to save settings',
        nl: 'Kan instellingen niet opslaan',
        de: 'Einstellungen konnten nicht gespeichert werden',
      },
    },
    toast: {
      settingsSaved: {
        fr: 'Paramètres enregistrés avec succès',
        en: 'Settings saved successfully',
        nl: 'Instellingen succesvol opgeslagen',
        de: 'Einstellungen erfolgreich gespeichert',
      },
    },
  },

  // Public View Page
  publicView: {
    badge: {
      fr: 'Vue publique',
      en: 'Public View',
      nl: 'Openbaar profiel',
      de: 'Öffentliche Ansicht',
    },
    namePlaceholder: {
      fr: 'Nom non renseigné',
      en: 'Name not provided',
      nl: 'Naam niet opgegeven',
      de: 'Name nicht angegeben',
    },
    editProfile: {
      fr: 'Modifier mon profil',
      en: 'Edit My Profile',
      nl: 'Mijn profiel bewerken',
      de: 'Mein Profil bearbeiten',
    },
    errors: {
      loadFailed: {
        fr: 'Échec du chargement du profil',
        en: 'Failed to load profile',
        nl: 'Profiel laden mislukt',
        de: 'Profil konnte nicht geladen werden',
      },
      unexpected: {
        fr: 'Une erreur inattendue s\'est produite',
        en: 'An unexpected error occurred',
        nl: 'Er is een onverwachte fout opgetreden',
        de: 'Ein unerwarteter Fehler ist aufgetreten',
      },
    },
    stats: {
      budget: {
        fr: 'Budget',
        en: 'Budget',
        nl: 'Budget',
        de: 'Budget',
      },
      moveIn: {
        fr: 'Emménagement',
        en: 'Move-in',
        nl: 'Verhuisdatum',
        de: 'Einzugsdatum',
      },
    },
    sections: {
      about: {
        fr: 'À propos',
        en: 'About',
        nl: 'Over mij',
        de: 'Über mich',
      },
      lookingFor: {
        fr: 'Ce que je recherche',
        en: 'What I\'m looking for',
        nl: 'Wat ik zoek',
        de: 'Was ich suche',
      },
      hobbies: {
        fr: 'Loisirs',
        en: 'Hobbies',
        nl: 'Hobby\'s',
        de: 'Hobbys',
      },
      values: {
        fr: 'Valeurs',
        en: 'Values',
        nl: 'Waarden',
        de: 'Werte',
      },
    },
    infoNote: {
      title: {
        fr: 'Vue publique :',
        en: 'Public view:',
        nl: 'Openbaar profiel:',
        de: 'Öffentliche Ansicht:',
      },
      description: {
        fr: 'C\'est ce que les autres utilisateurs voient sur ton profil. Complète ton Living Persona pour augmenter tes chances de trouver le co-living idéal !',
        en: 'This is what other users see on your profile. Complete your profile to increase your chances of finding the ideal roommate!',
        nl: 'Dit is wat andere gebruikers op je profiel zien. Vul je profiel in om je kansen te vergroten om de ideale huisgenoot te vinden!',
        de: 'Das ist, was andere Nutzer auf Ihrem Profil sehen. Vervollständigen Sie Ihr Profil, um Ihre Chancen zu erhöhen, den idealen Mitbewohner zu finden!',
      },
    },
  },

  // Profile Completion Page
  profileCompletion: {
    title: {
      fr: 'Complétion de ton profil',
      en: 'Complete Your Profile',
      nl: 'Profiel voltooien',
      de: 'Profil vervollständigen',
    },
    description: {
      fr: 'Complète ton profil pour améliorer tes chances de trouver la co-living idéale',
      en: 'Complete your profile to improve your chances of finding the ideal roommate',
      nl: 'Vul je profiel in om je kansen te vergroten om de ideale huisgenoot te vinden',
      de: 'Vervollständigen Sie Ihr Profil, um Ihre Chancen zu verbessern, den idealen Mitbewohner zu finden',
    },
    overallProgress: {
      fr: 'Progression globale',
      en: 'Overall Progress',
      nl: 'Totale voortgang',
      de: 'Gesamtfortschritt',
    },
    fieldsOf: {
      fr: 'sur',
      en: 'of',
      nl: 'van',
      de: 'von',
    },
    fieldsCompleted: {
      fr: 'champs complétés',
      en: 'fields completed',
      nl: 'velden ingevuld',
      de: 'Felder ausgefüllt',
    },
    missingFields: {
      fr: 'Champs manquants',
      en: 'Missing Fields',
      nl: 'Ontbrekende velden',
      de: 'Fehlende Felder',
    },
    andMoreFields: {
      fr: 'et {{count}} autres champs',
      en: 'and {{count}} more fields',
      nl: 'en {{count}} andere velden',
      de: 'und {{count}} weitere Felder',
    },
    completeProfile: {
      fr: 'Compléter mon Living Persona',
      en: 'Complete My Profile',
      nl: 'Mijn profiel voltooien',
      de: 'Mein Profil vervollständigen',
    },
    sections: {
      basic: {
        fr: 'Informations de base',
        en: 'Basic Information',
        nl: 'Basisinformatie',
        de: 'Grundlegende Informationen',
      },
      preferences: {
        fr: 'Préférences de recherche',
        en: 'Search Preferences',
        nl: 'Zoekvoorkeuren',
        de: 'Sucheinstellungen',
      },
      lifestyle: {
        fr: 'Style de vie',
        en: 'Lifestyle',
        nl: 'Levensstijl',
        de: 'Lebensstil',
      },
      personality: {
        fr: 'Personnalité',
        en: 'Personality',
        nl: 'Persoonlijkheid',
        de: 'Persönlichkeit',
      },
      verification: {
        fr: 'Vérification',
        en: 'Verification',
        nl: 'Verificatie',
        de: 'Verifizierung',
      },
    },
  },

  // Main Profile Page
  profile: {
    tabs: {
      profile: {
        fr: 'Profil',
        en: 'Profile',
        nl: 'Profiel',
        de: 'Profil',
      },
      role: {
        fr: 'Rôle',
        en: 'Role',
        nl: 'Rol',
        de: 'Rolle',
      },
    },
    logout: {
      fr: 'Déconnexion',
      en: 'Logout',
      nl: 'Uitloggen',
      de: 'Abmelden',
    },
    unnamedUser: {
      fr: 'Utilisateur',
      en: 'User',
      nl: 'Gebruiker',
      de: 'Benutzer',
    },
    profileCompleted: {
      fr: 'Profil complété',
      en: 'Profile completed',
      nl: 'Profiel voltooid',
      de: 'Profil abgeschlossen',
    },
    personalInfo: {
      fr: 'Informations personnelles',
      en: 'Personal Information',
      nl: 'Persoonlijke informatie',
      de: 'Persönliche Informationen',
    },
    fullName: {
      fr: 'Nom complet',
      en: 'Full Name',
      nl: 'Volledige naam',
      de: 'Vollständiger Name',
    },
    notSet: {
      fr: 'Non renseigné',
      en: 'Not set',
      nl: 'Niet ingesteld',
      de: 'Nicht festgelegt',
    },
    verified: {
      fr: 'Vérifié',
      en: 'Verified',
      nl: 'Geverifieerd',
      de: 'Verifiziert',
    },
    notVerified: {
      fr: 'Non vérifié',
      en: 'Not verified',
      nl: 'Niet geverifieerd',
      de: 'Nicht verifiziert',
    },
    whatOthersSee: {
      fr: 'Ce que les autres voient',
      en: 'What others see',
      nl: 'Wat anderen zien',
      de: 'Was andere sehen',
    },
    namePlaceholder: {
      fr: 'Nom non renseigné',
      en: 'Name not provided',
      nl: 'Naam niet opgegeven',
      de: 'Name nicht angegeben',
    },
    complete: {
      fr: 'complet',
      en: 'complete',
      nl: 'voltooid',
      de: 'vollständig',
    },
    viewPublicMode: {
      fr: 'Voir en mode public',
      en: 'View in public mode',
      nl: 'Bekijk in openbare modus',
      de: 'Im öffentlichen Modus anzeigen',
    },
    profileCompletion: {
      fr: 'Complétion du profil',
      en: 'Profile Completion',
      nl: 'Profiel voltooiing',
      de: 'Profilvervollständigung',
    },
    profileComplete: {
      fr: 'Profil complet !',
      en: 'Profile complete!',
      nl: 'Profiel voltooid!',
      de: 'Profil vollständig!',
    },
    sectionsToComplete: {
      fr: '{{count}} sections à compléter',
      en: '{{count}} sections to complete',
      nl: '{{count}} secties te voltooien',
      de: '{{count}} Abschnitte zu vervollständigen',
    },
    dataRefreshed: {
      fr: 'Données actualisées',
      en: 'Data refreshed',
      nl: 'Gegevens vernieuwd',
      de: 'Daten aktualisiert',
    },
    refreshData: {
      fr: 'Actualiser les données',
      en: 'Refresh data',
      nl: 'Gegevens vernieuwen',
      de: 'Daten aktualisieren',
    },
    completeForVisibility: {
      fr: 'Complète ton profil pour améliorer votre visibilité auprès des propriétaires',
      en: 'Complete your profile to improve your visibility to property owners',
      nl: 'Vul je profiel in om je zichtbaarheid bij huiseigenaren te verbeteren',
      de: 'Vervollständigen Sie Ihr Profil, um Ihre Sichtbarkeit bei Eigentümern zu verbessern',
    },
    sections: {
      basicProfile: {
        fr: 'Profil de base',
        en: 'Basic Profile',
        nl: 'Basisprofiel',
        de: 'Grundprofil',
      },
      about: {
        fr: 'À propos',
        en: 'About',
        nl: 'Over mij',
        de: 'Über mich',
      },
      hobbies: {
        fr: 'Loisirs',
        en: 'Hobbies',
        nl: 'Hobby\'s',
        de: 'Hobbys',
      },
      personality: {
        fr: 'Personnalité',
        en: 'Personality',
        nl: 'Persoonlijkheid',
        de: 'Persönlichkeit',
      },
      values: {
        fr: 'Valeurs',
        en: 'Values',
        nl: 'Waarden',
        de: 'Werte',
      },
      financial: {
        fr: 'Financier',
        en: 'Financial',
        nl: 'Financieel',
        de: 'Finanziell',
      },
      community: {
        fr: 'Communauté',
        en: 'Community',
        nl: 'Community',
        de: 'Gemeinschaft',
      },
    },
    enhance: {
      title: {
        fr: 'Améliorer mon profil',
        en: 'Enhance My Profile',
        nl: 'Mijn profiel verbeteren',
        de: 'Mein Profil verbessern',
      },
      subtitle: {
        fr: 'Augmentez tes chances de matching',
        en: 'Increase your matching chances',
        nl: 'Verhoog je matchingkansen',
        de: 'Erhöhen Sie Ihre Matching-Chancen',
      },
      about: {
        title: {
          fr: 'À propos',
          en: 'About',
          nl: 'Over mij',
          de: 'Über mich',
        },
        description: {
          fr: 'Parle-nous de toi',
          en: 'Tell us about yourself',
          nl: 'Vertel ons over jezelf',
          de: 'Erzählen Sie uns von sich',
        },
      },
      personality: {
        title: {
          fr: 'Personnalité',
          en: 'Personality',
          nl: 'Persoonlijkheid',
          de: 'Persönlichkeit',
        },
        description: {
          fr: 'Votre style de vie',
          en: 'Your lifestyle',
          nl: 'Jouw levensstijl',
          de: 'Ihr Lebensstil',
        },
      },
      values: {
        title: {
          fr: 'Valeurs',
          en: 'Values',
          nl: 'Waarden',
          de: 'Werte',
        },
        description: {
          fr: 'Ce qui compte pour toi',
          en: 'What matters to you',
          nl: 'Wat belangrijk voor je is',
          de: 'Was Ihnen wichtig ist',
        },
      },
      hobbies: {
        title: {
          fr: 'Loisirs',
          en: 'Hobbies',
          nl: 'Hobby\'s',
          de: 'Hobbys',
        },
        description: {
          fr: 'Vos passions et activités',
          en: 'Your passions and activities',
          nl: 'Je passies en activiteiten',
          de: 'Ihre Leidenschaften und Aktivitäten',
        },
      },
      community: {
        title: {
          fr: 'Communauté',
          en: 'Community',
          nl: 'Community',
          de: 'Gemeinschaft',
        },
        description: {
          fr: 'Événements et repas partagés',
          en: 'Events and shared meals',
          nl: 'Evenementen en gedeelde maaltijden',
          de: 'Veranstaltungen und gemeinsame Mahlzeiten',
        },
      },
      financial: {
        title: {
          fr: 'Financier',
          en: 'Financial',
          nl: 'Financieel',
          de: 'Finanziell',
        },
        description: {
          fr: 'Situation professionnelle',
          en: 'Professional situation',
          nl: 'Professionele situatie',
          de: 'Berufliche Situation',
        },
      },
      verification: {
        title: {
          fr: 'Vérification',
          en: 'Verification',
          nl: 'Verificatie',
          de: 'Verifizierung',
        },
        description: {
          fr: 'Vérifiez votre identité',
          en: 'Verify your identity',
          nl: 'Verifieer je identiteit',
          de: 'Verifizieren Sie Ihre Identität',
        },
      },
      cta: {
        title: {
          fr: 'Perfectionne ton profil',
          en: 'Perfect your profile',
          nl: 'Perfectioneer je profiel',
          de: 'Perfektionieren Sie Ihr Profil',
        },
        description: {
          fr: 'Augmente tes chances de matching en complétant ton profil à 100%',
          en: 'Increase your matching chances by completing your profile to 100%',
          nl: 'Verhoog je matchingkansen door je profiel 100% te voltooien',
          de: 'Erhöhen Sie Ihre Matching-Chancen, indem Sie Ihr Profil zu 100% ausfüllen',
        },
        button: {
          fr: 'Perfectionner mon profil',
          en: 'Perfect my profile',
          nl: 'Mijn profiel perfectioneren',
          de: 'Mein Profil perfektionieren',
        },
      },
    },
    settings: {
      roleManagement: {
        fr: 'Gestion du Rôle',
        en: 'Role Management',
        nl: 'Rolbeheer',
        de: 'Rollenverwaltung',
      },
      currentRole: {
        fr: 'Rôle Actuel',
        en: 'Current Role',
        nl: 'Huidige rol',
        de: 'Aktuelle Rolle',
      },
      onboardingComplete: {
        fr: 'Living Persona créé ! Prêt à découvrir tes Living Matchs',
        en: 'Onboarding complete',
        nl: 'Onboarding voltooid',
        de: 'Onboarding abgeschlossen',
      },
      changeRole: {
        fr: 'Changer de Rôle',
        en: 'Change Role',
        nl: 'Rol wijzigen',
        de: 'Rolle ändern',
      },
      change: {
        fr: 'Changer',
        en: 'Change',
        nl: 'Wijzigen',
        de: 'Ändern',
      },
      dataPreserved: {
        fr: 'Vos données sont préservées lors du changement de rôle.',
        en: 'Your data is preserved when changing roles.',
        nl: 'Je gegevens worden bewaard bij het wijzigen van rol.',
        de: 'Ihre Daten werden beim Rollenwechsel beibehalten.',
      },
      redoOnboarding: {
        fr: 'Refaire l\'Onboarding',
        en: 'Redo Onboarding',
        nl: 'Onboarding opnieuw doen',
        de: 'Onboarding wiederholen',
      },
      accountStatus: {
        fr: 'Statut du Compte',
        en: 'Account Status',
        nl: 'Accountstatus',
        de: 'Kontostatus',
      },
      emailVerified: {
        fr: 'Email vérifié',
        en: 'Email verified',
        nl: 'E-mail geverifieerd',
        de: 'E-Mail verifiziert',
      },
      onboarding: {
        fr: 'Onboarding',
        en: 'Onboarding',
        nl: 'Onboarding',
        de: 'Onboarding',
      },
      profilePhoto: {
        fr: 'Photo de profil',
        en: 'Profile photo',
        nl: 'Profielfoto',
        de: 'Profilfoto',
      },
    },
    resetOnboarding: {
      title: {
        fr: 'Réinitialiser l\'Onboarding',
        en: 'Reset Onboarding',
        nl: 'Onboarding resetten',
        de: 'Onboarding zurücksetzen',
      },
      description: {
        fr: 'Cela réinitialisera votre progression d\'onboarding. Tes informations de profil seront préservées. Es-tu sûr de vouloir continuer ?',
        en: 'This will reset your onboarding progress. Your profile information will be preserved. Are you sure you want to continue?',
        nl: 'Hiermee wordt je onboardingvoortgang gereset. Je profielinformatie blijft behouden. Weet je zeker dat je wilt doorgaan?',
        de: 'Dadurch wird Ihr Onboarding-Fortschritt zurückgesetzt. Ihre Profilinformationen werden beibehalten. Sind Sie sicher, dass Sie fortfahren möchten?',
      },
      confirm: {
        fr: 'Réinitialiser',
        en: 'Reset',
        nl: 'Resetten',
        de: 'Zurücksetzen',
      },
    },
    password: {
      weak: {
        fr: 'Faible',
        en: 'Weak',
        nl: 'Zwak',
        de: 'Schwach',
      },
      medium: {
        fr: 'Moyen',
        en: 'Medium',
        nl: 'Gemiddeld',
        de: 'Mittel',
      },
      strong: {
        fr: 'Fort',
        en: 'Strong',
        nl: 'Sterk',
        de: 'Stark',
      },
    },
    errors: {
      loadFailed: {
        fr: 'Échec du chargement du profil',
        en: 'Failed to load profile',
        nl: 'Profiel laden mislukt',
        de: 'Profil konnte nicht geladen werden',
      },
      unexpected: {
        fr: 'Une erreur inattendue s\'est produite',
        en: 'An unexpected error occurred',
        nl: 'Er is een onverwachte fout opgetreden',
        de: 'Ein unerwarteter Fehler ist aufgetreten',
      },
      nameEmpty: {
        fr: 'Le nom ne peut pas être vide',
        en: 'Name cannot be empty',
        nl: 'Naam mag niet leeg zijn',
        de: 'Name darf nicht leer sein',
      },
      updateNameFailed: {
        fr: 'Échec de la mise à jour du nom',
        en: 'Failed to update name',
        nl: 'Naam bijwerken mislukt',
        de: 'Name konnte nicht aktualisiert werden',
      },
      selectDifferentRole: {
        fr: 'Sélectionnez un rôle différent',
        en: 'Select a different role',
        nl: 'Selecteer een andere rol',
        de: 'Wählen Sie eine andere Rolle',
      },
      searcherComingSoon: {
        fr: 'Fonctionnalité Searcher bientôt disponible',
        en: 'Searcher feature coming soon',
        nl: 'Zoekerfunctie binnenkort beschikbaar',
        de: 'Sucherfunktion in Kürze verfügbar',
      },
      searcherComingSoonDesc: {
        fr: 'Cette fonctionnalité est actuellement en développement',
        en: 'This feature is currently in development',
        nl: 'Deze functie is momenteel in ontwikkeling',
        de: 'Diese Funktion befindet sich derzeit in Entwicklung',
      },
      changeRoleFailed: {
        fr: 'Échec du changement de rôle',
        en: 'Failed to change role',
        nl: 'Rol wijzigen mislukt',
        de: 'Rollenwechsel fehlgeschlagen',
      },
      resetOnboardingFailed: {
        fr: 'Échec de la réinitialisation de l\'onboarding',
        en: 'Failed to reset onboarding',
        nl: 'Onboarding resetten mislukt',
        de: 'Onboarding-Zurücksetzung fehlgeschlagen',
      },
      enterCurrentPassword: {
        fr: 'Veuillez entrer ton mot de passe actuel',
        en: 'Please enter your current password',
        nl: 'Voer je huidige wachtwoord in',
        de: 'Bitte geben Sie Ihr aktuelles Passwort ein',
      },
      passwordMinLength: {
        fr: 'Le mot de passe doit contenir au moins 8 caractères',
        en: 'Password must be at least 8 characters',
        nl: 'Wachtwoord moet minimaal 8 tekens bevatten',
        de: 'Das Passwort muss mindestens 8 Zeichen lang sein',
      },
      passwordsNoMatch: {
        fr: 'Les mots de passe ne correspondent pas',
        en: 'Passwords do not match',
        nl: 'Wachtwoorden komen niet overeen',
        de: 'Passwörter stimmen nicht überein',
      },
      currentPasswordIncorrect: {
        fr: 'Mot de passe actuel incorrect',
        en: 'Current password is incorrect',
        nl: 'Huidig wachtwoord is onjuist',
        de: 'Aktuelles Passwort ist falsch',
      },
      updatePasswordFailed: {
        fr: 'Échec de la mise à jour du mot de passe',
        en: 'Failed to update password',
        nl: 'Wachtwoord bijwerken mislukt',
        de: 'Passwort konnte nicht aktualisiert werden',
      },
      typeDeleteToConfirm: {
        fr: 'Tapez DELETE pour confirmer',
        en: 'Type DELETE to confirm',
        nl: 'Typ DELETE om te bevestigen',
        de: 'Geben Sie DELETE ein, um zu bestätigen',
      },
      deleteAccountFailed: {
        fr: 'Échec de la suppression du compte',
        en: 'Failed to delete account',
        nl: 'Account verwijderen mislukt',
        de: 'Konto konnte nicht gelöscht werden',
      },
    },
    success: {
      nameUpdated: {
        fr: 'Nom mis à jour avec succès',
        en: 'Name updated successfully',
        nl: 'Naam succesvol bijgewerkt',
        de: 'Name erfolgreich aktualisiert',
      },
      roleSwitched: {
        fr: 'Rôle changé avec succès',
        en: 'Role switched successfully',
        nl: 'Rol succesvol gewijzigd',
        de: 'Rolle erfolgreich gewechselt',
      },
      onboardingReset: {
        fr: 'Onboarding réinitialisé avec succès',
        en: 'Onboarding reset successfully',
        nl: 'Onboarding succesvol gereset',
        de: 'Onboarding erfolgreich zurückgesetzt',
      },
      passwordUpdated: {
        fr: 'Mot de passe mis à jour avec succès',
        en: 'Password updated successfully',
        nl: 'Wachtwoord succesvol bijgewerkt',
        de: 'Passwort erfolgreich aktualisiert',
      },
      accountDeleted: {
        fr: 'Compte supprimé avec succès',
        en: 'Account deleted successfully',
        nl: 'Account succesvol verwijderd',
        de: 'Konto erfolgreich gelöscht',
      },
    },
  },

  // Profile Enhancement Pages
  profileEnhance: {
    common: {
      backToProfile: {
        fr: 'Retour au profil',
        en: 'Back to Profile',
        nl: 'Terug naar profiel',
        de: 'Zurück zum Profil',
      },
      loading: {
        fr: 'Chargement de tes informations...',
        en: 'Loading your information...',
        nl: 'Je informatie laden...',
        de: 'Ihre Informationen werden geladen...',
      },
      skip: {
        fr: 'Passer',
        en: 'Skip',
        nl: 'Overslaan',
        de: 'Überspringen',
      },
      save: {
        fr: 'Enregistrer',
        en: 'Save',
        nl: 'Opslaan',
        de: 'Speichern',
      },
      saveChanges: {
        fr: 'Enregistrer les modifications',
        en: 'Save Changes',
        nl: 'Wijzigingen opslaan',
        de: 'Änderungen speichern',
      },
      cancel: {
        fr: 'Annuler',
        en: 'Cancel',
        nl: 'Annuleren',
        de: 'Abbrechen',
      },
      add: {
        fr: 'Ajouter',
        en: 'Add',
        nl: 'Toevoegen',
        de: 'Hinzufügen',
      },
    },
    about: {
      title: {
        fr: 'Parle-nous de toi',
        en: 'Tell Us About Yourself',
        nl: 'Vertel ons over jezelf',
        de: 'Erzählen Sie uns von sich',
      },
      description: {
        fr: 'Partagez un peu de qui tu es (tous les champs sont optionnels)',
        en: 'Share a bit about who you are (all fields are optional)',
        nl: 'Deel een beetje over wie je bent (alle velden zijn optioneel)',
        de: 'Teilen Sie ein wenig darüber, wer Sie sind (alle Felder sind optional)',
      },
      shortBio: {
        label: {
          fr: 'Courte biographie',
          en: 'Short Bio',
          nl: 'Korte biografie',
          de: 'Kurze Biografie',
        },
        helper: {
          fr: 'Une brève introduction qui apparaît en haut de ton profil',
          en: 'A brief introduction that appears at the top of your profile',
          nl: 'Een korte introductie die bovenaan je profiel verschijnt',
          de: 'Eine kurze Einführung, die oben in Ihrem Profil erscheint',
        },
        placeholder: {
          fr: 'ex: Étudiant en tech passionné par le développement durable et les activités de plein air...',
          en: 'e.g., Tech student passionate about sustainability and outdoor activities...',
          nl: 'bijv. Tech-student gepassioneerd door duurzaamheid en buitenactiviteiten...',
          de: 'z.B. Tech-Student mit Leidenschaft für Nachhaltigkeit und Outdoor-Aktivitäten...',
        },
      },
      moreAboutMe: {
        label: {
          fr: 'En savoir plus sur moi',
          en: 'More About Me',
          nl: 'Meer over mij',
          de: 'Mehr über mich',
        },
        helper: {
          fr: 'Partagez plus de détails sur ton style de vie, tes intérêts ou ce qui te rend unique',
          en: 'Share more details about your lifestyle, interests, or what makes you unique',
          nl: 'Deel meer details over je levensstijl, interesses of wat je uniek maakt',
          de: 'Teilen Sie mehr Details über Ihren Lebensstil, Ihre Interessen oder was Sie einzigartig macht',
        },
        placeholder: {
          fr: 'ex: Je suis étudiant en communication qui adore la techno et la danse. Je travaille parfois de chez moi, j\'aime cuisiner sainement et garder un espace rangé...',
          en: 'e.g., I\'m a communication student who loves techno and dancing. I work from home sometimes, enjoy cooking healthy meals, and like to keep a tidy space...',
          nl: 'bijv. Ik ben een communicatiestudent die van techno en dansen houdt. Ik werk soms thuis, geniet van gezond koken en houd van een opgeruimde ruimte...',
          de: 'z.B. Ich bin Kommunikationsstudent, der Techno und Tanzen liebt. Ich arbeite manchmal von zu Hause, koche gerne gesund und halte den Raum ordentlich...',
        },
      },
      lookingFor: {
        label: {
          fr: 'Ce que je recherche',
          en: 'What I\'m Looking For',
          nl: 'Wat ik zoek',
          de: 'Was ich suche',
        },
        helper: {
          fr: 'Décris ta situation de vie idéale et le type de personnes avec qui tu aimerais vivre',
          en: 'Describe your ideal living situation and the kind of people you\'d like to live with',
          nl: 'Beschrijf je ideale woonsituatie en het soort mensen met wie je wilt samenwonen',
          de: 'Beschreiben Sie Ihre ideale Wohnsituation und die Art von Menschen, mit denen Sie leben möchten',
        },
        placeholder: {
          fr: 'ex: Je cherche une chambre conviviale dans un co-living mixte avec des personnes qui respectent les espaces partagés et apprécient les activités sociales occasionnelles...',
          en: 'e.g., Looking for a convivial room in a mixed coliving with people who respect shared spaces and enjoy occasional social activities...',
          nl: 'bijv. Op zoek naar een gezellige kamer in een gemengd coliving met mensen die gedeelde ruimtes respecteren en af en toe sociale activiteiten waarderen...',
          de: 'z.B. Suche ein gemütliches Zimmer in einem gemischten Coliving mit Menschen, die Gemeinschaftsräume respektieren und gelegentliche soziale Aktivitäten genießen...',
        },
      },
    },
    hobbies: {
      title: {
        fr: 'Vos loisirs et intérêts',
        en: 'Your Hobbies & Interests',
        nl: 'Je hobby\'s en interesses',
        de: 'Ihre Hobbys und Interessen',
      },
      description: {
        fr: 'Aidez-nous à trouver des résidents qui partagent tes passions',
        en: 'Help us find roommates who share your passions',
        nl: 'Help ons huisgenoten te vinden die je passies delen',
        de: 'Helfen Sie uns, Mitbewohner zu finden, die Ihre Leidenschaften teilen',
      },
      loading: {
        fr: 'Chargement de tes loisirs...',
        en: 'Loading your hobbies...',
        nl: 'Je hobby\'s laden...',
        de: 'Ihre Hobbys werden geladen...',
      },
      selectCommon: {
        fr: 'Sélectionnez parmi les loisirs courants :',
        en: 'Select from common hobbies:',
        nl: 'Selecteer uit veelvoorkomende hobby\'s:',
        de: 'Wählen Sie aus gängigen Hobbys:',
      },
      addOwn: {
        fr: 'Ajoute tes propres loisirs :',
        en: 'Add your own hobbies:',
        nl: 'Voeg je eigen hobby\'s toe:',
        de: 'Fügen Sie Ihre eigenen Hobbys hinzu:',
      },
      addPlaceholder: {
        fr: 'Ajouter un loisir...',
        en: 'Add a hobby...',
        nl: 'Voeg een hobby toe...',
        de: 'Hobby hinzufügen...',
      },
      customHobbies: {
        fr: 'Vos loisirs personnalisés :',
        en: 'Your custom hobbies:',
        nl: 'Je aangepaste hobby\'s:',
        de: 'Ihre benutzerdefinierten Hobbys:',
      },
      selected: {
        fr: 'loisir sélectionné',
        en: 'hobby selected',
        nl: 'hobby geselecteerd',
        de: 'Hobby ausgewählt',
      },
      selectedPlural: {
        fr: 'loisirs sélectionnés',
        en: 'hobbies selected',
        nl: 'hobby\'s geselecteerd',
        de: 'Hobbys ausgewählt',
      },
      commonList: {
        reading: { fr: 'Lecture', en: 'Reading', nl: 'Lezen', de: 'Lesen' },
        sports: { fr: 'Sports', en: 'Sports', nl: 'Sport', de: 'Sport' },
        cooking: { fr: 'Cuisine', en: 'Cooking', nl: 'Koken', de: 'Kochen' },
        music: { fr: 'Musique', en: 'Music', nl: 'Muziek', de: 'Musik' },
        movies: { fr: 'Films', en: 'Movies', nl: 'Films', de: 'Filme' },
        gaming: { fr: 'Jeux vidéo', en: 'Gaming', nl: 'Gamen', de: 'Gaming' },
        hiking: { fr: 'Randonnée', en: 'Hiking', nl: 'Wandelen', de: 'Wandern' },
        photography: { fr: 'Photographie', en: 'Photography', nl: 'Fotografie', de: 'Fotografie' },
        travel: { fr: 'Voyage', en: 'Travel', nl: 'Reizen', de: 'Reisen' },
        art: { fr: 'Art', en: 'Art', nl: 'Kunst', de: 'Kunst' },
        yoga: { fr: 'Yoga', en: 'Yoga', nl: 'Yoga', de: 'Yoga' },
        dancing: { fr: 'Danse', en: 'Dancing', nl: 'Dansen', de: 'Tanzen' },
        cycling: { fr: 'Cyclisme', en: 'Cycling', nl: 'Fietsen', de: 'Radfahren' },
        running: { fr: 'Course', en: 'Running', nl: 'Hardlopen', de: 'Laufen' },
        swimming: { fr: 'Natation', en: 'Swimming', nl: 'Zwemmen', de: 'Schwimmen' },
        drawing: { fr: 'Dessin', en: 'Drawing', nl: 'Tekenen', de: 'Zeichnen' },
        writing: { fr: 'Écriture', en: 'Writing', nl: 'Schrijven', de: 'Schreiben' },
        gardening: { fr: 'Jardinage', en: 'Gardening', nl: 'Tuinieren', de: 'Gärtnern' },
        fitness: { fr: 'Fitness', en: 'Fitness', nl: 'Fitness', de: 'Fitness' },
        technology: { fr: 'Technologie', en: 'Technology', nl: 'Technologie', de: 'Technologie' },
        nature: { fr: 'Nature', en: 'Nature', nl: 'Natuur', de: 'Natur' },
      },
    },
    personality: {
      title: {
        fr: 'Personnalité étendue',
        en: 'Extended Personality',
        nl: 'Uitgebreide persoonlijkheid',
        de: 'Erweiterte Persönlichkeit',
      },
      description: {
        fr: 'Partagez plus sur toi pour trouver des résidents compatibles',
        en: 'Share more about yourself to help find compatible roommates',
        nl: 'Deel meer over jezelf om compatibele huisgenoten te vinden',
        de: 'Teilen Sie mehr über sich, um kompatible Mitbewohner zu finden',
      },
      yourHobbies: {
        fr: 'Vos loisirs',
        en: 'Your Hobbies',
        nl: 'Je hobby\'s',
        de: 'Ihre Hobbys',
      },
      addHobbyPlaceholder: {
        fr: 'Ajouter un loisir',
        en: 'Add a hobby',
        nl: 'Voeg een hobby toe',
        de: 'Hobby hinzufügen',
      },
      yourInterests: {
        fr: 'Vos intérêts',
        en: 'Your Interests',
        nl: 'Je interesses',
        de: 'Ihre Interessen',
      },
      personalityTraits: {
        fr: 'Traits de personnalité',
        en: 'Personality Traits',
        nl: 'Persoonlijkheidskenmerken',
        de: 'Persönlichkeitsmerkmale',
      },
      saved: {
        fr: 'Détails de personnalité enregistrés !',
        en: 'Personality details saved!',
        nl: 'Persoonlijkheidsdetails opgeslagen!',
        de: 'Persönlichkeitsdetails gespeichert!',
      },
      saveFailed: {
        fr: 'Échec de l\'enregistrement des modifications',
        en: 'Failed to save changes',
        nl: 'Wijzigingen opslaan mislukt',
        de: 'Änderungen konnten nicht gespeichert werden',
      },
      loadFailed: {
        fr: 'Échec du chargement des données existantes',
        en: 'Failed to load existing data',
        nl: 'Bestaande gegevens laden mislukt',
        de: 'Vorhandene Daten konnten nicht geladen werden',
      },
      interests: {
        music: { fr: 'Musique', en: 'Music', nl: 'Muziek', de: 'Musik' },
        sports: { fr: 'Sports', en: 'Sports', nl: 'Sport', de: 'Sport' },
        reading: { fr: 'Lecture', en: 'Reading', nl: 'Lezen', de: 'Lesen' },
        cooking: { fr: 'Cuisine', en: 'Cooking', nl: 'Koken', de: 'Kochen' },
        gaming: { fr: 'Jeux vidéo', en: 'Gaming', nl: 'Gamen', de: 'Gaming' },
        travel: { fr: 'Voyage', en: 'Travel', nl: 'Reizen', de: 'Reisen' },
        art: { fr: 'Art', en: 'Art', nl: 'Kunst', de: 'Kunst' },
        photography: { fr: 'Photographie', en: 'Photography', nl: 'Fotografie', de: 'Fotografie' },
        fitness: { fr: 'Fitness', en: 'Fitness', nl: 'Fitness', de: 'Fitness' },
        movies: { fr: 'Films', en: 'Movies', nl: 'Films', de: 'Filme' },
        technology: { fr: 'Technologie', en: 'Technology', nl: 'Technologie', de: 'Technologie' },
        nature: { fr: 'Nature', en: 'Nature', nl: 'Natuur', de: 'Natur' },
      },
      traits: {
        outgoing: { fr: 'Extraverti', en: 'Outgoing', nl: 'Uitgaand', de: 'Kontaktfreudig' },
        introverted: { fr: 'Introverti', en: 'Introverted', nl: 'Introvert', de: 'Introvertiert' },
        creative: { fr: 'Créatif', en: 'Creative', nl: 'Creatief', de: 'Kreativ' },
        organized: { fr: 'Organisé', en: 'Organized', nl: 'Georganiseerd', de: 'Organisiert' },
        spontaneous: { fr: 'Spontané', en: 'Spontaneous', nl: 'Spontaan', de: 'Spontan' },
        relaxed: { fr: 'Détendu', en: 'Relaxed', nl: 'Ontspannen', de: 'Entspannt' },
        ambitious: { fr: 'Ambitieux', en: 'Ambitious', nl: 'Ambitieus', de: 'Ehrgeizig' },
        friendly: { fr: 'Amical', en: 'Friendly', nl: 'Vriendelijk', de: 'Freundlich' },
        independent: { fr: 'Indépendant', en: 'Independent', nl: 'Onafhankelijk', de: 'Unabhängig' },
        teamPlayer: { fr: 'Esprit d\'équipe', en: 'Team Player', nl: 'Teamspeler', de: 'Teamplayer' },
      },
    },
    preferences: {
      title: {
        fr: 'Préférences avancées',
        en: 'Advanced Preferences',
        nl: 'Geavanceerde voorkeuren',
        de: 'Erweiterte Einstellungen',
      },
      description: {
        fr: 'Affinez tes préférences de vie pour de meilleurs résultats',
        en: 'Fine-tune your living preferences for better matches',
        nl: 'Verfijn je woonvoorkeuren voor betere matches',
        de: 'Verfeinern Sie Ihre Wohnpräferenzen für bessere Übereinstimmungen',
      },
      saved: {
        fr: 'Préférences enregistrées !',
        en: 'Preferences saved!',
        nl: 'Voorkeuren opgeslagen!',
        de: 'Einstellungen gespeichert!',
      },
      loadFailed: {
        fr: 'Échec du chargement des données',
        en: 'Failed to load existing data',
        nl: 'Laden van gegevens mislukt',
        de: 'Laden der Daten fehlgeschlagen',
      },
      roomType: {
        label: {
          fr: 'Type de chambre préféré',
          en: 'Preferred Room Type',
          nl: 'Voorkeurskamertype',
          de: 'Bevorzugter Zimmertyp',
        },
        private: { fr: 'Privée', en: 'Private', nl: 'Privé', de: 'Privat' },
        shared: { fr: 'Partagée', en: 'Shared', nl: 'Gedeeld', de: 'Geteilt' },
        studio: { fr: 'Studio', en: 'Studio', nl: 'Studio', de: 'Studio' },
        flexible: { fr: 'Flexible', en: 'Flexible', nl: 'Flexibel', de: 'Flexibel' },
      },
      bathroom: {
        label: {
          fr: 'Préférence de salle de bain',
          en: 'Bathroom Preference',
          nl: 'Badkamervoorkeur',
          de: 'Badezimmerpräferenz',
        },
        private: { fr: 'Privée', en: 'Private', nl: 'Privé', de: 'Privat' },
        shared: { fr: 'Partagée', en: 'Shared', nl: 'Gedeeld', de: 'Geteilt' },
      },
      leaseDuration: {
        label: {
          fr: 'Durée de séjour préférée',
          en: 'Preferred Lease Duration',
          nl: 'Voorkeurshuurperiode',
          de: 'Bevorzugte Mietdauer',
        },
        select: {
          fr: 'Sélectionnez...',
          en: 'Select...',
          nl: 'Selecteer...',
          de: 'Auswählen...',
        },
        oneToThree: { fr: '1-3 mois', en: '1-3 months', nl: '1-3 maanden', de: '1-3 Monate' },
        threeToSix: { fr: '3-6 mois', en: '3-6 months', nl: '3-6 maanden', de: '3-6 Monate' },
        sixToTwelve: { fr: '6-12 mois', en: '6-12 months', nl: '6-12 maanden', de: '6-12 Monate' },
        twelvePlus: { fr: '12+ mois', en: '12+ months', nl: '12+ maanden', de: '12+ Monate' },
        flexible: { fr: 'Flexible', en: 'Flexible', nl: 'Flexibel', de: 'Flexibel' },
      },
      moveInFlexibility: {
        label: {
          fr: 'Flexibilité de date d\'emménagement',
          en: 'Move-in Date Flexibility',
          nl: 'Flexibiliteit verhuisdatum',
          de: 'Flexibilität beim Einzugsdatum',
        },
        exact: { fr: 'Exacte', en: 'Exact', nl: 'Exact', de: 'Genau' },
        withinWeek: { fr: 'Sous 1 semaine', en: 'Within 1 week', nl: 'Binnen 1 week', de: 'Innerhalb 1 Woche' },
        flexible: { fr: 'Flexible', en: 'Flexible', nl: 'Flexibel', de: 'Flexibel' },
      },
      pets: {
        label: {
          fr: 'Préférence animaux',
          en: 'Pets Preference',
          nl: 'Huisdierenvoorkeur',
          de: 'Haustier-Präferenz',
        },
        havePets: { fr: 'J\'ai des animaux', en: 'I have pets', nl: 'Ik heb huisdieren', de: 'Ich habe Haustiere' },
        noPets: { fr: 'Pas d\'animaux', en: 'No pets', nl: 'Geen huisdieren', de: 'Keine Haustiere' },
        openToPets: { fr: 'Ouvert aux animaux', en: 'Open to pets', nl: 'Open voor huisdieren', de: 'Offen für Haustiere' },
      },
      smoking: {
        label: {
          fr: 'Préférence tabac',
          en: 'Smoking Preference',
          nl: 'Rookvoorkeur',
          de: 'Rauch-Präferenz',
        },
        nonSmoking: { fr: 'Non-fumeur uniquement', en: 'Non-smoking only', nl: 'Alleen niet-rokers', de: 'Nur Nichtraucher' },
        smokingOutside: { fr: 'Fumer dehors OK', en: 'Smoking outside OK', nl: 'Buiten roken OK', de: 'Rauchen draußen OK' },
      },
      quietHours: {
        label: {
          fr: 'Heures calmes importantes',
          en: 'Quiet hours important',
          nl: 'Stille uren belangrijk',
          de: 'Ruhezeiten wichtig',
        },
        description: {
          fr: 'Préfère des horaires calmes désignés',
          en: 'Prefer designated quiet times',
          nl: 'Voorkeur voor aangewezen stille tijden',
          de: 'Bevorzugt festgelegte Ruhezeiten',
        },
      },
      guests: {
        label: {
          fr: 'Invités autorisés',
          en: 'Guests allowed',
          nl: 'Gasten toegestaan',
          de: 'Gäste erlaubt',
        },
        description: {
          fr: 'OK avec des visiteurs occasionnels',
          en: 'OK with occasional visitors',
          nl: 'OK met af en toe bezoekers',
          de: 'OK mit gelegentlichen Besuchern',
        },
      },
    },
    values: {
      title: {
        fr: 'Vos valeurs et préférences',
        en: 'Your Values & Preferences',
        nl: 'Jouw waarden en voorkeuren',
        de: 'Ihre Werte und Präferenzen',
      },
      description: {
        fr: 'Aidez-nous à comprendre ce qui compte le plus pour toi',
        en: 'Help us understand what matters most to you',
        nl: 'Help ons te begrijpen wat voor jou het belangrijkst is',
        de: 'Helfen Sie uns zu verstehen, was Ihnen am wichtigsten ist',
      },
      loading: {
        fr: 'Chargement de tes valeurs...',
        en: 'Loading your values...',
        nl: 'Laden van je waarden...',
        de: 'Laden Ihrer Werte...',
      },
      progress: {
        step: { fr: 'Étape', en: 'Step', nl: 'Stap', de: 'Schritt' },
        of: { fr: 'sur', en: 'of', nl: 'van', de: 'von' },
        stepName: { fr: 'Valeurs et préférences', en: 'Values & Preferences', nl: 'Waarden en voorkeuren', de: 'Werte und Präferenzen' },
      },
      coreValues: {
        title: { fr: 'Valeurs fondamentales', en: 'Core Values', nl: 'Kernwaarden', de: 'Grundwerte' },
        description: { fr: 'Sélectionnez ce qui compte le plus pour toi (max 5) :', en: 'Select what matters most to you (choose up to 5):', nl: 'Selecteer wat voor jou het belangrijkst is (kies er maximaal 5):', de: 'Wählen Sie, was Ihnen am wichtigsten ist (maximal 5):' },
        selected: { fr: 'sélectionné(s)', en: 'selected', nl: 'geselecteerd', de: 'ausgewählt' },
        options: {
          honesty: { fr: 'Honnêteté', en: 'Honesty', nl: 'Eerlijkheid', de: 'Ehrlichkeit' },
          respect: { fr: 'Respect', en: 'Respect', nl: 'Respect', de: 'Respekt' },
          communication: { fr: 'Communication', en: 'Communication', nl: 'Communicatie', de: 'Kommunikation' },
          sustainability: { fr: 'Durabilité', en: 'Sustainability', nl: 'Duurzaamheid', de: 'Nachhaltigkeit' },
          diversity: { fr: 'Diversité', en: 'Diversity', nl: 'Diversiteit', de: 'Vielfalt' },
          collaboration: { fr: 'Collaboration', en: 'Collaboration', nl: 'Samenwerking', de: 'Zusammenarbeit' },
          independence: { fr: 'Indépendance', en: 'Independence', nl: 'Onafhankelijkheid', de: 'Unabhängigkeit' },
          growth: { fr: 'Croissance', en: 'Growth', nl: 'Groei', de: 'Wachstum' },
          community: { fr: 'Communauté', en: 'Community', nl: 'Gemeenschap', de: 'Gemeinschaft' },
          creativity: { fr: 'Créativité', en: 'Creativity', nl: 'Creativiteit', de: 'Kreativität' },
        },
      },
      qualities: {
        title: { fr: 'Qualités importantes chez un résident', en: 'Important Qualities in a Roommate', nl: 'Belangrijke eigenschappen van een huisgenoot', de: 'Wichtige Eigenschaften eines Mitbewohners' },
        description: { fr: 'Quelles qualités apprécies-tu chez un résident ?', en: 'What qualities do you value in a roommate?', nl: 'Welke eigenschappen waardeer je bij een huisgenoot?', de: 'Welche Eigenschaften schätzen Sie bei einem Mitbewohner?' },
        selected: { fr: 'sélectionné(s)', en: 'selected', nl: 'geselecteerd', de: 'ausgewählt' },
        options: {
          cleanliness: { fr: 'Propreté', en: 'Cleanliness', nl: 'Netheid', de: 'Sauberkeit' },
          punctuality: { fr: 'Ponctualité', en: 'Punctuality', nl: 'Stiptheid', de: 'Pünktlichkeit' },
          friendliness: { fr: 'Amabilité', en: 'Friendliness', nl: 'Vriendelijkheid', de: 'Freundlichkeit' },
          quietness: { fr: 'Calme', en: 'Quietness', nl: 'Rust', de: 'Ruhe' },
          flexibility: { fr: 'Flexibilité', en: 'Flexibility', nl: 'Flexibiliteit', de: 'Flexibilität' },
          organization: { fr: 'Organisation', en: 'Organization', nl: 'Organisatie', de: 'Organisation' },
          openness: { fr: 'Ouverture', en: 'Openness', nl: 'Openheid', de: 'Offenheit' },
          reliability: { fr: 'Fiabilité', en: 'Reliability', nl: 'Betrouwbaarheid', de: 'Zuverlässigkeit' },
          humor: { fr: 'Humour', en: 'Humor', nl: 'Humor', de: 'Humor' },
          empathy: { fr: 'Empathie', en: 'Empathy', nl: 'Empathie', de: 'Empathie' },
        },
      },
      dealBreakers: {
        title: { fr: 'Points de rupture', en: 'Deal Breakers', nl: 'Dealbreakers', de: 'Ausschlusskriterien' },
        description: { fr: 'Sélectionnez les comportements ou situations que tu ne peux absolument pas tolérer :', en: 'Select behaviors or situations you absolutely cannot tolerate:', nl: 'Selecteer gedrag of situaties die je absoluut niet kunt tolereren:', de: 'Wählen Sie Verhaltensweisen oder Situationen, die Sie absolut nicht tolerieren können:' },
        selected: { fr: 'sélectionné(s)', en: 'selected', nl: 'geselecteerd', de: 'ausgewählt' },
        options: {
          smokingIndoors: { fr: 'Fumer à l\'intérieur', en: 'Smoking indoors', nl: 'Binnen roken', de: 'Drinnen rauchen' },
          loudNoise: { fr: 'Bruit fort tard le soir', en: 'Loud noise late night', nl: 'Harde geluiden \'s nachts', de: 'Lauter Lärm spät in der Nacht' },
          messiness: { fr: 'Désordre', en: 'Messiness', nl: 'Rommel', de: 'Unordnung' },
          noCleaning: { fr: 'Pas de nettoyage', en: 'No cleaning', nl: 'Niet schoonmaken', de: 'Kein Putzen' },
          bringingStrangers: { fr: 'Amener souvent des inconnus', en: 'Bringing strangers often', nl: 'Vaak vreemden meebrengen', de: 'Oft Fremde mitbringen' },
          notRespectingBoundaries: { fr: 'Ne pas respecter les limites', en: 'Not respecting boundaries', nl: 'Grenzen niet respecteren', de: 'Grenzen nicht respektieren' },
          petsAllergic: { fr: 'Animaux (si allergique)', en: 'Pets (if allergic)', nl: 'Huisdieren (bij allergie)', de: 'Haustiere (bei Allergie)' },
          noCommunication: { fr: 'Pas de communication', en: 'No communication', nl: 'Geen communicatie', de: 'Keine Kommunikation' },
          privacyInvasion: { fr: 'Invasion de la vie privée', en: 'Invasion of privacy', nl: 'Inbreuk op privacy', de: 'Eingriff in die Privatsphäre' },
        },
      },
    },
    community: {
      title: {
        fr: 'Communauté & Événements',
        en: 'Community & Events',
        nl: 'Gemeenschap & Evenementen',
        de: 'Gemeinschaft & Veranstaltungen',
      },
      description: {
        fr: 'À quel point es-tu intéressé par les événements communautaires, les fêtes et les rassemblements sociaux ?',
        en: 'How interested are you in community events, parties, and social gatherings?',
        nl: 'Hoe geïnteresseerd ben je in community-evenementen, feesten en sociale bijeenkomsten?',
        de: 'Wie interessiert sind Sie an Gemeinschaftsveranstaltungen, Partys und gesellschaftlichen Zusammenkünften?',
      },
      loading: {
        fr: 'Chargement de tes préférences...',
        en: 'Loading your preferences...',
        nl: 'Laden van je voorkeuren...',
        de: 'Laden Ihrer Präferenzen...',
      },
      eventInterest: {
        label: { fr: 'Intérêt pour les événements', en: 'Event participation interest', nl: 'Interesse in evenementen', de: 'Interesse an Veranstaltungen' },
        low: {
          label: { fr: 'Faible', en: 'Low', nl: 'Laag', de: 'Niedrig' },
          description: { fr: 'Préfère une indépendance calme', en: 'Prefer quiet independence', nl: 'Voorkeur voor rustige onafhankelijkheid', de: 'Bevorzugt ruhige Unabhängigkeit' },
        },
        medium: {
          label: { fr: 'Moyen', en: 'Medium', nl: 'Gemiddeld', de: 'Mittel' },
          description: { fr: 'Socialisation occasionnelle', en: 'Occasional socializing', nl: 'Af en toe socialiseren', de: 'Gelegentliches Sozialisieren' },
        },
        high: {
          label: { fr: 'Élevé', en: 'High', nl: 'Hoog', de: 'Hoch' },
          description: { fr: 'J\'adore les événements communautaires !', en: 'Love community events!', nl: 'Hou van community-evenementen!', de: 'Liebe Gemeinschaftsveranstaltungen!' },
        },
      },
      sharedMeals: {
        title: { fr: 'J\'aimerais des repas partagés', en: "I'd enjoy shared meals", nl: 'Ik zou gedeelde maaltijden leuk vinden', de: 'Ich würde gemeinsame Mahlzeiten genießen' },
        description: { fr: 'Cuisiner et manger ensemble avec les résidents', en: 'Cook and eat together with flatmates', nl: 'Samen koken en eten met huisgenoten', de: 'Zusammen mit Mitbewohnern kochen und essen' },
      },
      openToMeetups: {
        title: { fr: 'Ouvert aux rencontres entre résidents', en: 'Open to flatmate meetups', nl: 'Open voor huisgenoot-ontmoetingen', de: 'Offen für Mitbewohner-Treffen' },
        description: { fr: 'Passer du temps ensemble, regarder des films, soirées jeux', en: 'Hang out, watch movies, game nights', nl: 'Samen tijd doorbrengen, films kijken, spelavonden', de: 'Zusammen abhängen, Filme schauen, Spieleabende' },
      },
      perks: {
        title: { fr: 'Avantages de la communauté', en: 'Community Perks', nl: 'Community-voordelen', de: 'Community-Vorteile' },
        perk1: { fr: 'Trouver des résidents avec une énergie sociale similaire', en: 'Find flatmates with similar social energy', nl: 'Vind huisgenoten met vergelijkbare sociale energie', de: 'Finde Mitbewohner mit ähnlicher sozialer Energie' },
        perk2: { fr: 'Être associé à des styles de vie compatibles', en: 'Get matched with compatible living styles', nl: 'Gematcht worden met compatibele leefstijlen', de: 'Mit kompatiblen Lebensstilen gematcht werden' },
        perk3: { fr: 'Découvrir des espaces de co-living qui te correspondent', en: 'Discover coliving spaces that fit your vibe', nl: 'Ontdek coliving-ruimtes die bij je passen', de: 'Entdecken Sie Coliving-Räume, die zu Ihnen passen' },
      },
    },
    verification: {
      title: {
        fr: 'Vérification du profil',
        en: 'Profile Verification',
        nl: 'Profielverificatie',
        de: 'Profilverifizierung',
      },
      description: {
        fr: 'Vérifiez ton profil pour augmenter la confiance',
        en: 'Verify your profile to build trust',
        nl: 'Verifieer je profiel om vertrouwen op te bouwen',
        de: 'Verifizieren Sie Ihr Profil, um Vertrauen aufzubauen',
      },
      loading: {
        fr: 'Chargement du statut de vérification...',
        en: 'Loading verification status...',
        nl: 'Laden van verificatiestatus...',
        de: 'Laden des Verifizierungsstatus...',
      },
      idVerification: {
        title: { fr: 'Vérification d\'identité', en: 'ID Verification', nl: 'ID-verificatie', de: 'ID-Verifizierung' },
        description: { fr: 'Téléchargez une pièce d\'identité officielle', en: 'Upload a government-issued ID', nl: 'Upload een officieel identiteitsbewijs', de: 'Laden Sie einen amtlichen Ausweis hoch' },
        pending: { fr: 'En attente', en: 'Pending', nl: 'In behandeling', de: 'Ausstehend' },
        verified: { fr: 'Vérifié', en: 'Verified', nl: 'Geverifieerd', de: 'Verifiziert' },
        upload: { fr: 'Télécharger', en: 'Upload', nl: 'Uploaden', de: 'Hochladen' },
      },
      phoneVerification: {
        title: { fr: 'Vérification du téléphone', en: 'Phone Verification', nl: 'Telefoonverificatie', de: 'Telefonverifizierung' },
        description: { fr: 'Confirmez ton numéro de téléphone', en: 'Confirm your phone number', nl: 'Bevestig je telefoonnummer', de: 'Bestätigen Sie Ihre Telefonnummer' },
        verify: { fr: 'Vérifier', en: 'Verify', nl: 'Verifiëren', de: 'Verifizieren' },
      },
      emailVerification: {
        title: { fr: 'Vérification de l\'email', en: 'Email Verification', nl: 'E-mailverificatie', de: 'E-Mail-Verifizierung' },
        description: { fr: 'Confirmez ton adresse email', en: 'Confirm your email address', nl: 'Bevestig je e-mailadres', de: 'Bestätigen Sie Ihre E-Mail-Adresse' },
        verified: { fr: 'Vérifié', en: 'Verified', nl: 'Geverifieerd', de: 'Verifiziert' },
      },
      socialVerification: {
        title: { fr: 'Vérification des réseaux sociaux', en: 'Social Verification', nl: 'Sociale verificatie', de: 'Soziale Verifizierung' },
        description: { fr: 'Liez tes comptes de réseaux sociaux', en: 'Link your social media accounts', nl: 'Koppel je sociale media accounts', de: 'Verknüpfen Sie Ihre Social-Media-Konten' },
        connect: { fr: 'Connecter', en: 'Connect', nl: 'Verbinden', de: 'Verbinden' },
      },
      badges: {
        starter: { name: { fr: 'Starter', en: 'Starter', nl: 'Starter', de: 'Starter' }, description: { fr: 'Aucune vérification', en: 'No verification', nl: 'Geen verificatie', de: 'Keine Verifizierung' } },
        basic: { name: { fr: 'Basic', en: 'Basic', nl: 'Basis', de: 'Basis' }, description: { fr: 'Email ou téléphone vérifié', en: 'Email or phone verified', nl: 'E-mail of telefoon geverifieerd', de: 'E-Mail oder Telefon verifiziert' } },
        verified: { name: { fr: 'Vérifié', en: 'Verified', nl: 'Geverifieerd', de: 'Verifiziert' }, description: { fr: 'Email + Téléphone vérifiés', en: 'Email + Phone verified', nl: 'E-mail + Telefoon geverifieerd', de: 'E-Mail + Telefon verifiziert' } },
        itsme: { name: { fr: 'ITSME', en: 'ITSME', nl: 'ITSME', de: 'ITSME' }, description: { fr: 'Identité vérifiée via ITSME', en: 'Identity verified via ITSME', nl: 'Identiteit geverifieerd via ITSME', de: 'Identität über ITSME verifiziert' } },
        premium: { name: { fr: 'Premium', en: 'Premium', nl: 'Premium', de: 'Premium' }, description: { fr: 'ITSME + Email vérifiés', en: 'ITSME + Email verified', nl: 'ITSME + E-mail geverifieerd', de: 'ITSME + E-Mail verifiziert' } },
      },
      progress: {
        complete: { fr: 'Complété', en: 'Complete', nl: 'Voltooid', de: 'Abgeschlossen' },
        nextBadge: {
          starter: { fr: 'Complète 1 vérification pour débloquer le badge Basic (bleu clair)', en: 'Complete 1 verification to unlock Basic badge (light blue)', nl: 'Voltooi 1 verificatie om Basic badge te ontgrendelen (lichtblauw)', de: 'Schließen Sie 1 Verifizierung ab, um das Basic-Abzeichen freizuschalten (hellblau)' },
          basic: { fr: 'Complète 2 vérifications pour débloquer le badge Verified (bleu)', en: 'Complete 2 verifications to unlock Verified badge (blue)', nl: 'Voltooi 2 verificaties om Verified badge te ontgrendelen (blauw)', de: 'Schließen Sie 2 Verifizierungen ab, um das Verified-Abzeichen freizuschalten (blau)' },
          verified: { fr: 'Complète les 4 vérifications pour débloquer le badge Premium (bleu foncé)', en: 'Complete all 4 verifications to unlock Premium badge (dark blue)', nl: 'Voltooi alle 4 verificaties om Premium badge te ontgrendelen (donkerblauw)', de: 'Schließen Sie alle 4 Verifizierungen ab, um das Premium-Abzeichen freizuschalten (dunkelblau)' },
        },
      },
      email: {
        title: { fr: 'Vérification Email', en: 'Email Verification', nl: 'E-mailverificatie', de: 'E-Mail-Verifizierung' },
        verified: { fr: 'Votre email a été vérifié', en: 'Your email has been verified', nl: 'Je e-mail is geverifieerd', de: 'Ihre E-Mail wurde verifiziert' },
        pleaseVerify: { fr: 'Vérifie ton adresse email', en: 'Please verify your email address', nl: 'Verifieer je e-mailadres', de: 'Bitte verifizieren Sie Ihre E-Mail-Adresse' },
        resend: { fr: 'Renvoyer l\'email de vérification', en: 'Resend Verification Email', nl: 'Verificatie-e-mail opnieuw verzenden', de: 'Bestätigungs-E-Mail erneut senden' },
        sent: { fr: 'Email de vérification envoyé ! Vérifiez votre boîte de réception.', en: 'Verification email sent! Please check your inbox.', nl: 'Verificatie-e-mail verzonden! Controleer je inbox.', de: 'Bestätigungs-E-Mail gesendet! Bitte überprüfen Sie Ihren Posteingang.' },
        sendFailed: { fr: 'Échec de l\'envoi de l\'email de vérification', en: 'Failed to send verification email', nl: 'Verzenden van verificatie-e-mail mislukt', de: 'Senden der Bestätigungs-E-Mail fehlgeschlagen' },
      },
      phone: {
        title: { fr: 'Vérification Téléphone', en: 'Phone Verification', nl: 'Telefoonverificatie', de: 'Telefonverifizierung' },
        quickSms: { fr: 'Vérification rapide par SMS', en: 'Quick SMS verification', nl: 'Snelle SMS-verificatie', de: 'Schnelle SMS-Verifizierung' },
        verified: { fr: 'Téléphone vérifié', en: 'Phone verified', nl: 'Telefoon geverifieerd', de: 'Telefon verifiziert' },
        comingSoon: { fr: 'Bientôt disponible : Vérification par SMS', en: 'Coming soon: Verify via SMS', nl: 'Binnenkort: Verifiëren via SMS', de: 'Demnächst: Verifizierung per SMS' },
        verify: { fr: 'Vérifier', en: 'Verify', nl: 'Verifiëren', de: 'Verifizieren' },
        invalid: { fr: 'Veuillez entrer un numéro de téléphone valide', en: 'Please enter a valid phone number', nl: 'Voer een geldig telefoonnummer in', de: 'Bitte geben Sie eine gültige Telefonnummer ein' },
        verifyFailed: { fr: 'Échec de la vérification du téléphone', en: 'Failed to verify phone number', nl: 'Telefoonverificatie mislukt', de: 'Telefonverifizierung fehlgeschlagen' },
      },
      id: {
        title: { fr: 'Vérification d\'identité', en: 'ID Verification', nl: 'ID-verificatie', de: 'ID-Verifizierung' },
        itsmeDescription: { fr: 'Vérifie ton identité avec itsme®', en: 'Verify your identity with itsme®', nl: 'Verifieer je identiteit met itsme®', de: 'Verifizieren Sie Ihre Identität mit itsme®' },
        verified: { fr: 'Identité vérifiée', en: 'Identity verified', nl: 'Identiteit geverifieerd', de: 'Identität verifiziert' },
        comingSoon: { fr: 'Bientôt disponible : Vérification d\'identité avec itsme®', en: 'Coming soon: Identity verification with itsme®', nl: 'Binnenkort: Identiteitsverificatie met itsme®', de: 'Demnächst: Identitätsverifizierung mit itsme®' },
        verifyWithItsme: { fr: 'Vérifier avec itsme®', en: 'Verify with itsme®', nl: 'Verifiëren met itsme®', de: 'Mit itsme® verifizieren' },
      },
      backgroundCheck: {
        title: { fr: 'Vérification des antécédents', en: 'Background Check', nl: 'Antecedentenonderzoek', de: 'Hintergrundprüfung' },
        description: { fr: 'Vérification des antécédents', en: 'Background verification', nl: 'Antecedentenverificatie', de: 'Hintergrundverifizierung' },
        premium: { fr: 'Premium', en: 'Premium', nl: 'Premium', de: 'Premium' },
        verified: { fr: 'Vérification des antécédents complétée - Badge Premium débloqué !', en: 'Background check completed - Premium badge unlocked!', nl: 'Antecedentenonderzoek voltooid - Premium badge ontgrendeld!', de: 'Hintergrundprüfung abgeschlossen - Premium-Abzeichen freigeschaltet!' },
        comingSoon: { fr: 'Bientôt disponible : Vérification approfondie des antécédents', en: 'Coming soon: Comprehensive background verification', nl: 'Binnenkort: Uitgebreide antecedentenverificatie', de: 'Demnächst: Umfassende Hintergrundprüfung' },
        request: { fr: 'Demander une vérification', en: 'Request verification', nl: 'Verificatie aanvragen', de: 'Verifizierung anfordern' },
      },
      benefits: {
        title: { fr: 'Débloque des avantages avec chaque badge', en: 'Unlock benefits with each badge', nl: 'Ontgrendel voordelen met elk badge', de: 'Schalten Sie Vorteile mit jedem Abzeichen frei' },
        starter: { fr: 'Créer un profil & parcourir', en: 'Create profile & browse', nl: 'Profiel maken & bladeren', de: 'Profil erstellen & durchsuchen' },
        basic: { fr: 'Apparaître dans les recherches + badge vérifié', en: 'Appear in searches + verified badge', nl: 'Verschijnen in zoekopdrachten + geverifieerd badge', de: 'In Suchen erscheinen + verifiziertes Abzeichen' },
        verified: { fr: 'Priorité dans les résultats + réponses plus rapides', en: 'Priority in results + faster responses', nl: 'Prioriteit in resultaten + snellere reacties', de: 'Priorität in Ergebnissen + schnellere Antworten' },
        premium: { fr: 'Meilleures offres + candidatures instantanées', en: 'Best offers + instant applications', nl: 'Beste aanbiedingen + directe sollicitaties', de: 'Beste Angebote + sofortige Bewerbungen' },
      },
      loadFailed: { fr: 'Échec du chargement du statut de vérification', en: 'Failed to load verification status', nl: 'Laden van verificatiestatus mislukt', de: 'Laden des Verifizierungsstatus fehlgeschlagen' },
      done: { fr: 'Terminé', en: 'Done', nl: 'Klaar', de: 'Fertig' },
    },
    review: {
      title: {
        fr: 'Réviser ton profil amélioré',
        en: 'Review Your Enhanced Profile',
        nl: 'Bekijk je verbeterde profiel',
        de: 'Überprüfen Sie Ihr erweitertes Profil',
      },
      description: {
        fr: 'Vérifiez tes informations avant de sauvegarder',
        en: 'Check your information before saving',
        nl: 'Controleer je informatie voordat je opslaat',
        de: 'Überprüfen Sie Ihre Informationen vor dem Speichern',
      },
      loading: {
        fr: 'Chargement de ton profil...',
        en: 'Loading your profile...',
        nl: 'Laden van je profiel...',
        de: 'Laden Ihres Profils...',
      },
      progress: {
        step: { fr: 'Étape', en: 'Step', nl: 'Stap', de: 'Schritt' },
        of: { fr: 'sur', en: 'of', nl: 'van', de: 'von' },
        stepName: { fr: 'Révision & Sauvegarde', en: 'Review & Save', nl: 'Bekijken & Opslaan', de: 'Überprüfen & Speichern' },
      },
      noData: {
        fr: 'Tu n\'as pas encore ajouté d\'informations de profil améliorées. Tu peux revenir en arrière et en ajouter, ou passer cette étape pour l\'instant.',
        en: 'You haven\'t added any enhanced profile information yet. You can go back and add some, or skip this step for now.',
        nl: 'Je hebt nog geen verbeterde profielinformatie toegevoegd. Je kunt teruggaan en wat toevoegen, of deze stap voorlopig overslaan.',
        de: 'Sie haben noch keine erweiterten Profilinformationen hinzugefügt. Sie können zurückgehen und welche hinzufügen, oder diesen Schritt vorerst überspringen.',
      },
      toast: {
        loginRequired: { fr: 'Connecte-toi pour continuer', en: 'Please log in to continue', nl: 'Log in om door te gaan', de: 'Bitte melden Sie sich an, um fortzufahren' },
        success: { fr: 'Living Persona amélioré ! Tu augmentes tes chances de Living Match', en: 'Profile enhanced successfully!', nl: 'Profiel succesvol verbeterd!', de: 'Profil erfolgreich erweitert!' },
        saveFailed: { fr: 'Échec de la sauvegarde du profil', en: 'Failed to save profile', nl: 'Profiel opslaan mislukt', de: 'Profil speichern fehlgeschlagen' },
        error: { fr: 'Erreur', en: 'Error', nl: 'Fout', de: 'Fehler' },
      },
      buttons: {
        saving: { fr: 'Sauvegarde...', en: 'Saving...', nl: 'Opslaan...', de: 'Speichern...' },
        save: { fr: 'Sauvegarder le profil', en: 'Save Profile', nl: 'Profiel opslaan', de: 'Profil speichern' },
        skipForNow: { fr: 'Passer pour l\'instant', en: 'Skip for now', nl: 'Voorlopig overslaan', de: 'Vorerst überspringen' },
      },
      sections: {
        about: { fr: 'À propos de toi', en: 'About You', nl: 'Over jou', de: 'Über Sie' },
        hobbies: { fr: 'Loisirs & Intérêts', en: 'Hobbies & Interests', nl: 'Hobby\'s & Interesses', de: 'Hobbys & Interessen' },
        values: { fr: 'Valeurs & Préférences', en: 'Values & Preferences', nl: 'Waarden & Voorkeuren', de: 'Werte & Präferenzen' },
        financial: { fr: 'Informations financières', en: 'Financial Information', nl: 'Financiële informatie', de: 'Finanzinformationen' },
        community: { fr: 'Préférences communautaires', en: 'Community Preferences', nl: 'Gemeenschapsvoorkeuren', de: 'Gemeinschaftspräferenzen' },
        verification: { fr: 'Vérification', en: 'Verification', nl: 'Verificatie', de: 'Verifizierung' },
      },
      fields: {
        bio: { fr: 'Bio', en: 'Bio', nl: 'Bio', de: 'Bio' },
        aboutMe: { fr: 'À propos de moi', en: 'About Me', nl: 'Over mij', de: 'Über mich' },
        lookingFor: { fr: 'Ce que je recherche', en: 'Looking For', nl: 'Op zoek naar', de: 'Ich suche' },
        coreValues: { fr: 'Valeurs fondamentales', en: 'Core Values', nl: 'Kernwaarden', de: 'Grundwerte' },
        importantQualities: { fr: 'Qualités importantes', en: 'Important Qualities', nl: 'Belangrijke kwaliteiten', de: 'Wichtige Eigenschaften' },
        dealBreakers: { fr: 'Points rédhibitoires', en: 'Deal Breakers', nl: 'Dealbreakers', de: 'Ausschlusskriterien' },
        incomeRange: { fr: 'Tranche de revenus', en: 'Income Range', nl: 'Inkomensbereik', de: 'Einkommensspanne' },
        employmentType: { fr: 'Type d\'emploi', en: 'Employment Type', nl: 'Type dienstverband', de: 'Beschäftigungsart' },
        hasGuarantor: { fr: 'A un garant', en: 'Has Guarantor', nl: 'Heeft borgsteller', de: 'Hat Bürgen' },
        eventInterest: { fr: 'Intérêt pour les événements', en: 'Event Interest', nl: 'Interesse in evenementen', de: 'Veranstaltungsinteresse' },
        enjoySharedMeals: { fr: 'Aime les repas partagés', en: 'Enjoys Shared Meals', nl: 'Houdt van gezamenlijke maaltijden', de: 'Mag gemeinsame Mahlzeiten' },
        openToMeetups: { fr: 'Ouvert aux rencontres', en: 'Open to Meetups', nl: 'Open voor ontmoetingen', de: 'Offen für Treffen' },
      },
      edit: { fr: 'Modifier', en: 'Edit', nl: 'Bewerken', de: 'Bearbeiten' },
      complete: { fr: 'Terminer le profil', en: 'Complete Profile', nl: 'Profiel voltooien', de: 'Profil abschließen' },
      incomplete: { fr: 'Non complété', en: 'Not completed', nl: 'Niet voltooid', de: 'Nicht abgeschlossen' },
    },
    financial: {
      title: {
        fr: 'Informations financières',
        en: 'Financial Information',
        nl: 'Financiële informatie',
        de: 'Finanzielle Informationen',
      },
      description: {
        fr: 'Partagez tes préférences et capacités financières',
        en: 'Share your financial preferences and capabilities',
        nl: 'Deel je financiële voorkeuren en mogelijkheden',
        de: 'Teilen Sie Ihre finanziellen Präferenzen und Möglichkeiten',
      },
      loading: {
        fr: 'Chargement des informations financières...',
        en: 'Loading financial information...',
        nl: 'Laden van financiële informatie...',
        de: 'Laden der Finanzinformationen...',
      },
      budget: {
        title: { fr: 'Budget mensuel', en: 'Monthly Budget', nl: 'Maandelijks budget', de: 'Monatliches Budget' },
        description: { fr: 'Quel est votre budget mensuel maximum pour le loyer ?', en: 'What is your maximum monthly budget for rent?', nl: 'Wat is je maximale maandelijkse budget voor huur?', de: 'Was ist Ihr maximales monatliches Budget für Miete?' },
        placeholder: { fr: 'Entrez le montant', en: 'Enter amount', nl: 'Voer bedrag in', de: 'Betrag eingeben' },
      },
      income: {
        title: { fr: 'Preuve de revenus', en: 'Proof of Income', nl: 'Inkomstenbewijs', de: 'Einkommensnachweis' },
        description: { fr: 'Peux-tu fournir une preuve de revenus ?', en: 'Can you provide proof of income?', nl: 'Kun je een inkomstenbewijs verstrekken?', de: 'Können Sie einen Einkommensnachweis erbringen?' },
        yes: { fr: 'Oui', en: 'Yes', nl: 'Ja', de: 'Ja' },
        no: { fr: 'Non', en: 'No', nl: 'Nee', de: 'Nein' },
        maybe: { fr: 'Peut-être', en: 'Maybe', nl: 'Misschien', de: 'Vielleicht' },
      },
      deposit: {
        title: { fr: 'Dépôt de garantie', en: 'Security Deposit', nl: 'Waarborgsom', de: 'Kaution' },
        description: { fr: 'Peux-tu payer un dépôt de garantie ?', en: 'Can you pay a security deposit?', nl: 'Kun je een waarborgsom betalen?', de: 'Können Sie eine Kaution zahlen?' },
        oneMonth: { fr: '1 mois', en: '1 month', nl: '1 maand', de: '1 Monat' },
        twoMonths: { fr: '2 mois', en: '2 months', nl: '2 maanden', de: '2 Monate' },
        threeMonths: { fr: '3 mois', en: '3 months', nl: '3 maanden', de: '3 Monate' },
        flexible: { fr: 'Flexible', en: 'Flexible', nl: 'Flexibel', de: 'Flexibel' },
      },
      incomeRange: {
        label: { fr: 'Tranche de revenus mensuels', en: 'Monthly income range', nl: 'Maandelijks inkomensbereik', de: 'Monatliche Einkommensspanne' },
        under1000: { fr: '< 1 000 €', en: '< €1,000', nl: '< €1.000', de: '< 1.000 €' },
        range1000to1500: { fr: '1 000 € - 1 500 €', en: '€1,000 - €1,500', nl: '€1.000 - €1.500', de: '1.000 € - 1.500 €' },
        range1500to2000: { fr: '1 500 € - 2 000 €', en: '€1,500 - €2,000', nl: '€1.500 - €2.000', de: '1.500 € - 2.000 €' },
        range2000to3000: { fr: '2 000 € - 3 000 €', en: '€2,000 - €3,000', nl: '€2.000 - €3.000', de: '2.000 € - 3.000 €' },
        range3000to5000: { fr: '3 000 € - 5 000 €', en: '€3,000 - €5,000', nl: '€3.000 - €5.000', de: '3.000 € - 5.000 €' },
        over5000: { fr: '> 5 000 €', en: '> €5,000', nl: '> €5.000', de: '> 5.000 €' },
      },
      guarantor: {
        title: { fr: 'J\'ai un garant disponible', en: 'I have a guarantor available', nl: 'Ik heb een garantsteller beschikbaar', de: 'Ich habe einen Bürgen verfügbar' },
        description: { fr: 'Quelqu\'un qui peut se porter garant pour les paiements de loyer', en: 'Someone who can vouch for rent payments', nl: 'Iemand die kan instaan voor huurbetalingen', de: 'Jemand, der für Mietzahlungen bürgen kann' },
      },
      employment: {
        label: { fr: 'Type d\'emploi', en: 'Employment type', nl: 'Type dienstverband', de: 'Art der Beschäftigung' },
        fullTime: { fr: 'Temps plein', en: 'Full-time', nl: 'Voltijd', de: 'Vollzeit' },
        partTime: { fr: 'Temps partiel', en: 'Part-time', nl: 'Deeltijd', de: 'Teilzeit' },
        freelance: { fr: 'Freelance', en: 'Freelance', nl: 'Freelance', de: 'Freiberuflich' },
        contract: { fr: 'Contrat', en: 'Contract', nl: 'Contract', de: 'Vertrag' },
        internship: { fr: 'Stage', en: 'Internship', nl: 'Stage', de: 'Praktikum' },
        student: { fr: 'Étudiant', en: 'Student', nl: 'Student', de: 'Student' },
        unemployed: { fr: 'Sans emploi', en: 'Unemployed', nl: 'Werkloos', de: 'Arbeitslos' },
      },
      privacy: {
        title: { fr: 'Ta vie privée compte', en: 'Your privacy matters', nl: 'Je privacy is belangrijk', de: 'Ihre Privatsphäre ist wichtig' },
        description: { fr: 'Ces informations ne sont partagées qu\'avec des propriétaires vérifiés lorsque tu manifestes ton intérêt pour leurs résidences. Tu peux les mettre à jour ou les supprimer à tout moment depuis tes paramètres de profil.', en: 'This information is only shared with verified landlords when you express interest in their properties. You can update or remove it anytime from your profile settings.', nl: 'Deze informatie wordt alleen gedeeld met geverifieerde verhuurders wanneer je interesse toont in hun woningen. Je kunt dit op elk moment bijwerken of verwijderen via je profielinstellingen.', de: 'Diese Informationen werden nur an verifizierte Vermieter weitergegeben, wenn Sie Interesse an deren Immobilien bekunden. Sie können sie jederzeit in Ihren Profileinstellungen aktualisieren oder entfernen.' },
      },
    },
  },

  // ============================================================================
  // ENHANCE OWNER PROFILE
  // ============================================================================
  enhanceOwner: {
    common: {
      backToProfile: { fr: 'Retour au profil', en: 'Back to Profile', nl: 'Terug naar profiel', de: 'Zurück zum Profil' },
      loading: { fr: 'Chargement de tes informations...', en: 'Loading your information...', nl: 'Je informatie laden...', de: 'Laden Ihrer Informationen...' },
      saveChanges: { fr: 'Enregistrer les modifications', en: 'Save Changes', nl: 'Wijzigingen opslaan', de: 'Änderungen speichern' },
    },
    errors: {
      loadFailed: { fr: 'Échec du chargement des données', en: 'Failed to load existing data', nl: 'Bestaande gegevens laden mislukt', de: 'Laden bestehender Daten fehlgeschlagen' },
    },
    // Experience Page
    experience: {
      title: { fr: 'Ton Parcours de Propriétaire', en: 'Your Hosting Journey', nl: 'Je Verhuurderservaring', de: 'Ihre Vermieter-Reise' },
      description: { fr: 'Partage ton expérience et ce qui te motive en tant que propriétaire', en: 'Share your experience and what drives you as a property owner', nl: 'Deel je ervaring en wat je drijft als verhuurder', de: 'Teilen Sie Ihre Erfahrung und was Sie als Vermieter antreibt' },
      saved: { fr: 'Expérience enregistrée !', en: 'Experience saved!', nl: 'Ervaring opgeslagen!', de: 'Erfahrung gespeichert!' },
      yearsLabel: { fr: 'Années d\'expérience en location', en: 'Years of rental experience', nl: 'Jaren verhuurervaring', de: 'Jahre Vermieterfahrung' },
      years: {
        lessThan1Year: { fr: 'Moins d\'1 an', en: 'Less than 1 year', nl: 'Minder dan 1 jaar', de: 'Weniger als 1 Jahr' },
        years1to2: { fr: '1-2 ans', en: '1-2 years', nl: '1-2 jaar', de: '1-2 Jahre' },
        years3to5: { fr: '3-5 ans', en: '3-5 years', nl: '3-5 jaar', de: '3-5 Jahre' },
        years5to10: { fr: '5-10 ans', en: '5-10 years', nl: '5-10 jaar', de: '5-10 Jahre' },
        years10Plus: { fr: '10+ ans', en: '10+ years', nl: '10+ jaar', de: '10+ Jahre' },
      },
      managementLabel: { fr: 'Style de gestion', en: 'Management style', nl: 'Beheerstijl', de: 'Verwaltungsstil' },
      management: {
        selfManaged: {
          label: { fr: 'Autogéré', en: 'Self-managed', nl: 'Zelfbeheer', de: 'Selbstverwaltet' },
          desc: { fr: 'Je gère tout moi-même', en: 'I handle everything myself', nl: 'Ik regel alles zelf', de: 'Ich kümmere mich um alles selbst' },
        },
        agency: {
          label: { fr: 'Via une agence', en: 'Through agency', nl: 'Via makelaar', de: 'Über Agentur' },
          desc: { fr: 'Une agence gère mes propriétés', en: 'An agency manages my properties', nl: 'Een makelaar beheert mijn eigendommen', de: 'Eine Agentur verwaltet meine Immobilien' },
        },
        hybrid: {
          label: { fr: 'Hybride', en: 'Hybrid', nl: 'Hybride', de: 'Hybrid' },
          desc: { fr: 'Un mélange des deux approches', en: 'A mix of both approaches', nl: 'Een mix van beide benaderingen', de: 'Eine Mischung aus beiden Ansätzen' },
        },
      },
      motivationLabel: { fr: 'Principale motivation', en: 'Primary motivation', nl: 'Belangrijkste motivatie', de: 'Hauptmotivation' },
      motivation: {
        income: { fr: 'Revenus', en: 'Income', nl: 'Inkomen', de: 'Einkommen' },
        community: { fr: 'Communauté', en: 'Community', nl: 'Gemeenschap', de: 'Gemeinschaft' },
        investment: { fr: 'Investissement', en: 'Investment', nl: 'Investering', de: 'Investition' },
        other: { fr: 'Autre', en: 'Other', nl: 'Anders', de: 'Sonstiges' },
      },
      bioLabel: { fr: 'Parle-nous de toi', en: 'Tell us about yourself', nl: 'Vertel ons over jezelf', de: 'Erzählen Sie uns von sich' },
      bioPlaceholder: { fr: 'Partage ta philosophie d\'hébergement et ce qui te rend unique en tant que propriétaire...', en: 'Share your hosting philosophy and what makes you unique as a property owner...', nl: 'Deel je verhuurfilosofie en wat jou uniek maakt als verhuurder...', de: 'Teilen Sie Ihre Hosting-Philosophie und was Sie als Vermieter einzigartig macht...' },
    },
    // Bio Page
    bio: {
      title: { fr: 'Bio & Histoire du Propriétaire', en: 'Owner Bio & Story', nl: 'Verhuurder Bio & Verhaal', de: 'Vermieter Bio & Geschichte' },
      description: { fr: 'Partagez ta philosophie d\'hébergement et ce qui fait de toi un excellent bailleur', en: 'Share your hosting philosophy and what makes you a great landlord', nl: 'Deel je verhuurfilosofie en wat jou een geweldige verhuurder maakt', de: 'Teilen Sie Ihre Hosting-Philosophie und was Sie zu einem großartigen Vermieter macht' },
      saved: { fr: 'Bio enregistrée !', en: 'Bio saved!', nl: 'Bio opgeslagen!', de: 'Bio gespeichert!' },
      motivationLabel: { fr: 'Qu\'est-ce qui t\'a motivé à devenir propriétaire ?', en: 'What motivated you to become a property owner?', nl: 'Wat motiveerde je om verhuurder te worden?', de: 'Was hat Sie motiviert, Vermieter zu werden?' },
      motivations: {
        investment: { fr: 'Investissement & revenus passifs', en: 'Investment & passive income', nl: 'Investering & passief inkomen', de: 'Investition & passives Einkommen' },
        community: { fr: 'Créer une communauté', en: 'Building community', nl: 'Gemeenschap bouwen', de: 'Gemeinschaft aufbauen' },
        helpOthers: { fr: 'Aider les gens à trouver un logement', en: 'Helping people find homes', nl: 'Mensen helpen een woning te vinden', de: 'Menschen helfen, ein Zuhause zu finden' },
        business: { fr: 'Activité de gestion immobilière', en: 'Property management business', nl: 'Vastgoedbeheer als bedrijf', de: 'Immobilienverwaltungsgeschäft' },
        other: { fr: 'Autre', en: 'Other', nl: 'Anders', de: 'Sonstiges' },
      },
      storyLabel: { fr: 'Racontez votre histoire', en: 'Tell your story', nl: 'Vertel je verhaal', de: 'Erzählen Sie Ihre Geschichte' },
      storyPlaceholder: { fr: 'Partagez ta philosophie d\'hébergement, ce qui rend ta résidence spécial, et ce que tu recherches chez des résidents idéaux...', en: 'Share your hosting philosophy, what makes your property special, and what you\'re looking for in ideal tenants...', nl: 'Deel je verhuurfilosofie, wat je eigendom speciaal maakt, en wat je zoekt in ideale huurders...', de: 'Teilen Sie Ihre Hosting-Philosophie, was Ihre Immobilie besonders macht, und was Sie bei idealen Mietern suchen...' },
      tipsTitle: { fr: 'Conseils pour une bonne bio :', en: 'Tips for a great bio:', nl: 'Tips voor een goede bio:', de: 'Tipps für eine gute Bio:' },
      tips: {
        managementStyle: { fr: 'Décrivez votre style de gestion', en: 'Describe your property management style', nl: 'Beschrijf je beheerstijl', de: 'Beschreiben Sie Ihren Verwaltungsstil' },
        unique: { fr: 'Mentionnez ce qui rend ta résidence unique', en: 'Mention what makes your property unique', nl: 'Noem wat je eigendom uniek maakt', de: 'Erwähnen Sie, was Ihre Immobilie einzigartig macht' },
        values: { fr: 'Partagez ce que tu valorises chez les résidents', en: 'Share what you value in tenants', nl: 'Deel wat je waardeert bij huurders', de: 'Teilen Sie mit, was Sie bei Mietern schätzen' },
        authentic: { fr: 'Soyez authentique et personnel', en: 'Be authentic and personable', nl: 'Wees authentiek en persoonlijk', de: 'Seien Sie authentisch und persönlich' },
      },
    },
    // Verification Page
    verification: {
      title: { fr: 'Vérification du Profil', en: 'Profile Verification', nl: 'Profielverificatie', de: 'Profilverifizierung' },
      description: { fr: 'Vérifiez votre identité pour renforcer la confiance avec les résidents potentiels', en: 'Verify your identity to build trust with potential tenants', nl: 'Verifieer je identiteit om vertrouwen op te bouwen bij potentiële huurders', de: 'Verifizieren Sie Ihre Identität, um Vertrauen bei potenziellen Mietern aufzubauen' },
      saved: { fr: 'Documents de vérification enregistrés !', en: 'Verification documents saved!', nl: 'Verificatiedocumenten opgeslagen!', de: 'Verifizierungsdokumente gespeichert!' },
      status: {
        complete: { fr: 'Vérification complète', en: 'Verification Complete', nl: 'Verificatie voltooid', de: 'Verifizierung abgeschlossen' },
        verified: { fr: 'Ton profil a été vérifié', en: 'Your profile has been verified', nl: 'Je profiel is geverifieerd', de: 'Ihr Profil wurde verifiziert' },
      },
      idDocument: {
        title: { fr: 'Pièce d\'identité officielle', en: 'Government-issued ID', nl: 'Officieel identiteitsbewijs', de: 'Amtlicher Ausweis' },
        description: { fr: 'Téléchargez une photo de ton passeport, permis de conduire ou carte d\'identité nationale', en: 'Upload a photo of your passport, driver\'s license, or national ID card', nl: 'Upload een foto van je paspoort, rijbewijs of identiteitskaart', de: 'Laden Sie ein Foto Ihres Reisepasses, Führerscheins oder Personalausweises hoch' },
        uploadPrompt: { fr: 'Cliquez pour télécharger ou glisser-déposer', en: 'Click to upload or drag and drop', nl: 'Klik om te uploaden of slepen', de: 'Klicken zum Hochladen oder Drag & Drop' },
        fileTypes: { fr: 'PNG, JPG ou PDF (max 10 Mo)', en: 'PNG, JPG or PDF (max 10MB)', nl: 'PNG, JPG of PDF (max 10MB)', de: 'PNG, JPG oder PDF (max 10MB)' },
        uploaded: { fr: 'Document téléchargé', en: 'Document uploaded', nl: 'Document geüpload', de: 'Dokument hochgeladen' },
      },
      proofOfOwnership: {
        title: { fr: 'Preuve de propriété', en: 'Proof of Property Ownership', nl: 'Eigendomsbewijs', de: 'Eigentumsnachweis' },
        description: { fr: 'Téléchargez l\'acte de propriété, le titre ou le contrat de gestion', en: 'Upload property deed, title, or management contract', nl: 'Upload eigendomsakte, titel of beheercontract', de: 'Laden Sie Eigentumsurkunde, Titel oder Verwaltungsvertrag hoch' },
        uploaded: { fr: 'Document téléchargé', en: 'Document uploaded', nl: 'Document geüpload', de: 'Dokument hochgeladen' },
      },
      whyMatters: { fr: 'Pourquoi la vérification est importante', en: 'Why verification matters', nl: 'Waarom verificatie belangrijk is', de: 'Warum Verifizierung wichtig ist' },
      benefits: {
        trust: { fr: 'Renforce la confiance avec les résidents potentiels', en: 'Builds trust with potential tenants', nl: 'Bouwt vertrouwen op bij potentiële huurders', de: 'Baut Vertrauen bei potenziellen Mietern auf' },
        visibility: { fr: 'Augmente la visibilité de tes résidences', en: 'Increases visibility of your listings', nl: 'Verhoogt de zichtbaarheid van je advertenties', de: 'Erhöht die Sichtbarkeit Ihrer Anzeigen' },
        protection: { fr: 'Te protège toi et tes résidents', en: 'Protects you and your renters', nl: 'Beschermt jou en je huurders', de: 'Schützt Sie und Ihre Mieter' },
        secure: { fr: 'Tous les documents sont cryptés en sécurité', en: 'All documents are securely encrypted', nl: 'Alle documenten zijn veilig versleuteld', de: 'Alle Dokumente sind sicher verschlüsselt' },
      },
      skipForNow: { fr: 'Passer pour le moment', en: 'Skip for Now', nl: 'Nu overslaan', de: 'Vorerst überspringen' },
      submitVerification: { fr: 'Soumettre pour vérification', en: 'Submit for Verification', nl: 'Indienen ter verificatie', de: 'Zur Verifizierung einreichen' },
    },
    // Services Page
    services: {
      title: { fr: 'Ce que tu proposes', en: 'What You Offer', nl: 'Wat je aanbiedt', de: 'Was Sie anbieten' },
      description: { fr: 'Mettez en avant les équipements et services pour attirer des résidents', en: 'Highlight amenities and services to attract tenants', nl: 'Markeer voorzieningen en diensten om huurders aan te trekken', de: 'Heben Sie Annehmlichkeiten und Dienste hervor, um Mieter anzuziehen' },
      saved: { fr: 'Services enregistrés !', en: 'Services saved!', nl: 'Diensten opgeslagen!', de: 'Dienste gespeichert!' },
      amenitiesTitle: { fr: 'Équipements disponibles', en: 'Available Amenities', nl: 'Beschikbare voorzieningen', de: 'Verfügbare Annehmlichkeiten' },
      amenities: {
        wifi: { fr: 'WiFi', en: 'WiFi', nl: 'WiFi', de: 'WLAN' },
        parking: { fr: 'Parking', en: 'Parking', nl: 'Parkeren', de: 'Parkplatz' },
        gym: { fr: 'Salle de sport', en: 'Gym/Fitness', nl: 'Sportschool', de: 'Fitnessstudio' },
        tv: { fr: 'TV/Streaming', en: 'TV/Streaming', nl: 'TV/Streaming', de: 'TV/Streaming' },
        laundry: { fr: 'Buanderie', en: 'Laundry', nl: 'Wasruimte', de: 'Wäscherei' },
        kitchen: { fr: 'Cuisine équipée', en: 'Full Kitchen', nl: 'Volledige keuken', de: 'Voll ausgestattete Küche' },
      },
      servicesTitle: { fr: 'Services inclus', en: 'Included Services', nl: 'Inbegrepen diensten', de: 'Enthaltene Dienste' },
      servicesList: {
        utilities: { fr: 'Charges incluses', en: 'Utilities Included', nl: 'Nutsvoorzieningen inbegrepen', de: 'Nebenkosten inklusive' },
        cleaning: { fr: 'Service de nettoyage', en: 'Cleaning Service', nl: 'Schoonmaakservice', de: 'Reinigungsservice' },
        maintenance: { fr: 'Maintenance 24/7', en: '24/7 Maintenance', nl: '24/7 Onderhoud', de: '24/7 Wartung' },
        insurance: { fr: 'Assurance habitation', en: 'Property Insurance', nl: 'Woningverzekering', de: 'Gebäudeversicherung' },
      },
      proTip: { fr: 'Conseil pro :', en: 'Pro Tip:', nl: 'Pro Tip:', de: 'Profi-Tipp:' },
      proTipContent: { fr: 'Les résidences avec des équipements listés reçoivent 2x plus de demandes que celles sans.', en: 'Listings with amenities listed get 2x more inquiries than those without.', nl: 'Advertenties met voorzieningen krijgen 2x meer vragen dan zonder.', de: 'Anzeigen mit aufgelisteten Annehmlichkeiten erhalten 2x mehr Anfragen als ohne.' },
    },
    // Policies Page
    policies: {
      title: { fr: 'Vos règles de location', en: 'Your Rental Policies', nl: 'Je huurbeleid', de: 'Ihre Mietrichtlinien' },
      description: { fr: 'Définissez des attentes claires pour les résidents potentiels', en: 'Set clear expectations for potential tenants', nl: 'Stel duidelijke verwachtingen voor potentiële huurders', de: 'Setzen Sie klare Erwartungen für potenzielle Mieter' },
      saved: { fr: 'Règles enregistrées !', en: 'Policies saved!', nl: 'Beleid opgeslagen!', de: 'Richtlinien gespeichert!' },
      pets: {
        label: { fr: 'Autorises-tu les animaux ?', en: 'Do you allow pets?', nl: 'Sta je huisdieren toe?', de: 'Erlauben Sie Haustiere?' },
        yes: { fr: 'Oui, animaux autorisés', en: 'Yes, pets allowed', nl: 'Ja, huisdieren toegestaan', de: 'Ja, Haustiere erlaubt' },
        no: { fr: 'Pas d\'animaux', en: 'No pets', nl: 'Geen huisdieren', de: 'Keine Haustiere' },
      },
      smoking: {
        label: { fr: 'Autorises-tu de fumer ?', en: 'Do you allow smoking?', nl: 'Sta je roken toe?', de: 'Erlauben Sie Rauchen?' },
        yes: { fr: 'Fumeur autorisé', en: 'Smoking allowed', nl: 'Roken toegestaan', de: 'Rauchen erlaubt' },
        no: { fr: 'Non-fumeur', en: 'Non-smoking', nl: 'Niet roken', de: 'Nichtraucher' },
      },
      leaseDuration: {
        label: { fr: 'Durée de séjour minimum (optionnel)', en: 'Minimum lease duration (optional)', nl: 'Minimale huurperiode (optioneel)', de: 'Mindestmietdauer (optional)' },
        noPreference: { fr: 'Pas de préférence', en: 'No preference', nl: 'Geen voorkeur', de: 'Keine Präferenz' },
        month1: { fr: '1 mois', en: '1 month', nl: '1 maand', de: '1 Monat' },
        months3: { fr: '3 mois', en: '3 months', nl: '3 maanden', de: '3 Monate' },
        months6: { fr: '6 mois', en: '6 months', nl: '6 maanden', de: '6 Monate' },
        months12: { fr: '12 mois', en: '12 months', nl: '12 maanden', de: '12 Monate' },
      },
      deposit: {
        label: { fr: 'Dépôt de garantie typique (optionnel)', en: 'Typical deposit (optional)', nl: 'Typische borg (optioneel)', de: 'Typische Kaution (optional)' },
        notSpecified: { fr: 'Non spécifié', en: 'Not specified', nl: 'Niet gespecificeerd', de: 'Nicht angegeben' },
        halfMonth: { fr: 'Demi-mois de loyer', en: "Half month's rent", nl: 'Halve maand huur', de: 'Halbe Monatsmiete' },
        oneMonth: { fr: '1 mois de loyer', en: "1 month's rent", nl: '1 maand huur', de: '1 Monatsmiete' },
        twoMonths: { fr: '2 mois de loyer', en: "2 months' rent", nl: '2 maanden huur', de: '2 Monatsmieten' },
        negotiable: { fr: 'Négociable', en: 'Negotiable', nl: 'Onderhandelbaar', de: 'Verhandelbar' },
      },
      noticePeriod: {
        label: { fr: 'Préavis pour déménagement (optionnel)', en: 'Notice period for move-out (optional)', nl: 'Opzegtermijn voor verhuizing (optioneel)', de: 'Kündigungsfrist für Auszug (optional)' },
        notSpecified: { fr: 'Non spécifié', en: 'Not specified', nl: 'Niet gespecificeerd', de: 'Nicht angegeben' },
        month1: { fr: '1 mois', en: '1 month', nl: '1 maand', de: '1 Monat' },
        months2: { fr: '2 mois', en: '2 months', nl: '2 maanden', de: '2 Monate' },
        months3: { fr: '3 mois', en: '3 months', nl: '3 maanden', de: '3 Monate' },
      },
      tip: { fr: 'Conseil :', en: 'Tip:', nl: 'Tip:', de: 'Tipp:' },
      tipContent: { fr: 'Des règles claires attirent les bons résidents et évitent les malentendus.', en: 'Clear policies help attract the right tenants and avoid misunderstandings later.', nl: 'Duidelijk beleid helpt de juiste huurders aan te trekken en misverstanden te voorkomen.', de: 'Klare Richtlinien helfen, die richtigen Mieter anzuziehen und Missverständnisse zu vermeiden.' },
    },
    // Review Page
    review: {
      title: { fr: 'Vérifier ton profil amélioré', en: 'Review Your Enhanced Profile', nl: 'Bekijk je verbeterde profiel', de: 'Überprüfen Sie Ihr erweitertes Profil' },
      description: { fr: 'Assure-toi que tout est correct avant d\'enregistrer', en: 'Make sure everything looks good before saving', nl: 'Zorg ervoor dat alles er goed uitziet voor het opslaan', de: 'Stellen Sie sicher, dass alles gut aussieht, bevor Sie speichern' },
      experienceSection: { fr: 'Expérience & Motivation', en: 'Experience & Motivation', nl: 'Ervaring & Motivatie', de: 'Erfahrung & Motivation' },
      policiesSection: { fr: 'Règles pour les résidents', en: 'Tenant Policies', nl: 'Huurdersbeleid', de: 'Mieterrichtlinien' },
      servicesSection: { fr: 'Services & Équipements', en: 'Services & Amenities', nl: 'Diensten & Voorzieningen', de: 'Dienste & Annehmlichkeiten' },
      edit: { fr: 'Modifier', en: 'Edit', nl: 'Bewerken', de: 'Bearbeiten' },
      labels: {
        experience: { fr: 'Expérience :', en: 'Experience:', nl: 'Ervaring:', de: 'Erfahrung:' },
        years: { fr: 'ans', en: 'years', nl: 'jaar', de: 'Jahre' },
        management: { fr: 'Gestion :', en: 'Management:', nl: 'Beheer:', de: 'Verwaltung:' },
        motivation: { fr: 'Motivation :', en: 'Motivation:', nl: 'Motivatie:', de: 'Motivation:' },
        bio: { fr: 'Bio :', en: 'Bio:', nl: 'Bio:', de: 'Bio:' },
        pets: { fr: 'Animaux :', en: 'Pets:', nl: 'Huisdieren:', de: 'Haustiere:' },
        smoking: { fr: 'Fumeur :', en: 'Smoking:', nl: 'Roken:', de: 'Rauchen:' },
        allowed: { fr: 'Autorisé', en: 'Allowed', nl: 'Toegestaan', de: 'Erlaubt' },
        notAllowed: { fr: 'Non autorisé', en: 'Not allowed', nl: 'Niet toegestaan', de: 'Nicht erlaubt' },
        minLease: { fr: 'Séjour min :', en: 'Min lease:', nl: 'Min huur:', de: 'Min Miete:' },
        months: { fr: 'mois', en: 'months', nl: 'maanden', de: 'Monate' },
        deposit: { fr: 'Dépôt :', en: 'Deposit:', nl: 'Borg:', de: 'Kaution:' },
        noticePeriod: { fr: 'Préavis :', en: 'Notice period:', nl: 'Opzegtermijn:', de: 'Kündigungsfrist:' },
        amenities: { fr: 'Équipements :', en: 'Amenities:', nl: 'Voorzieningen:', de: 'Annehmlichkeiten:' },
        services: { fr: 'Services :', en: 'Services:', nl: 'Diensten:', de: 'Dienste:' },
        noData: { fr: 'Aucune donnée saisie', en: 'No data entered', nl: 'Geen gegevens ingevoerd', de: 'Keine Daten eingegeben' },
      },
      errors: {
        loginRequired: { fr: 'Connecte-toi pour continuer', en: 'Please log in to continue', nl: 'Log in om door te gaan', de: 'Bitte melden Sie sich an, um fortzufahren' },
        saveFailed: { fr: 'Échec de l\'enregistrement du profil amélioré', en: 'Failed to save enhanced profile', nl: 'Opslaan van verbeterd profiel mislukt', de: 'Erweitertes Profil konnte nicht gespeichert werden' },
      },
      success: { fr: 'Living Persona enregistré ! Plus de chances de trouver ton Living Match parfait', en: 'Enhanced profile saved successfully!', nl: 'Verbeterd profiel succesvol opgeslagen!', de: 'Erweitertes Profil erfolgreich gespeichert!' },
      saving: { fr: 'Enregistrement...', en: 'Saving...', nl: 'Opslaan...', de: 'Speichern...' },
      saveProfile: { fr: 'Enregistrer le profil amélioré', en: 'Save Enhanced Profile', nl: 'Verbeterd profiel opslaan', de: 'Erweitertes Profil speichern' },
      skipForNow: { fr: 'Passer pour le moment', en: 'Skip for now', nl: 'Nu overslaan', de: 'Vorerst überspringen' },
    },
  },

  // ============================================================================
  // ENHANCE RESIDENT PROFILE
  // ============================================================================
  enhanceResident: {
    common: {
      backToDashboard: { fr: 'Retour au tableau de bord', en: 'Back to Dashboard', nl: 'Terug naar dashboard', de: 'Zurück zum Dashboard' },
      loading: { fr: 'Chargement de tes informations...', en: 'Loading your information...', nl: 'Je informatie laden...', de: 'Laden Ihrer Informationen...' },
      saveChanges: { fr: 'Enregistrer les modifications', en: 'Save Changes', nl: 'Wijzigingen opslaan', de: 'Änderungen speichern' },
      saving: { fr: 'Enregistrement...', en: 'Saving...', nl: 'Opslaan...', de: 'Speichern...' },
      cancel: { fr: 'Annuler', en: 'Cancel', nl: 'Annuleren', de: 'Abbrechen' },
    },
    errors: {
      loadFailed: { fr: 'Échec du chargement des données', en: 'Failed to load existing data', nl: 'Bestaande gegevens laden mislukt', de: 'Laden bestehender Daten fehlgeschlagen' },
      requiredFields: { fr: 'Veuillez répondre à toutes les questions requises', en: 'Please answer all required questions', nl: 'Beantwoord alle verplichte vragen', de: 'Bitte beantworten Sie alle erforderlichen Fragen' },
      selectEventInterest: { fr: 'Veuillez sélectionner votre niveau d\'intérêt pour les événements', en: 'Please select your event interest level', nl: 'Selecteer je interesse niveau voor evenementen', de: 'Bitte wählen Sie Ihr Interesse an Veranstaltungen' },
    },
    // Personality Page
    personality: {
      title: { fr: 'Personnalité & Intérêts', en: 'Personality & Interests', nl: 'Persoonlijkheid & Interesses', de: 'Persönlichkeit & Interessen' },
      description: { fr: 'Partagez plus sur toi-même pour te connecter avec des voisins partageant les mêmes idées', en: 'Share more about yourself to connect with like-minded neighbors', nl: 'Deel meer over jezelf om in contact te komen met gelijkgestemde buren', de: 'Teilen Sie mehr über sich, um Gleichgesinnte zu finden' },
      loadingText: { fr: 'Chargement de tes détails de personnalité...', en: 'Loading your personality details...', nl: 'Je persoonlijkheidsdetails laden...', de: 'Laden Ihrer Persönlichkeitsdetails...' },
      saved: { fr: 'Détails de personnalité enregistrés !', en: 'Personality details saved!', nl: 'Persoonlijkheidsdetails opgeslagen!', de: 'Persönlichkeitsdetails gespeichert!' },
      hobbiesTitle: { fr: 'Vos hobbies', en: 'Your Hobbies', nl: 'Je hobby\'s', de: 'Ihre Hobbys' },
      hobbiesPlaceholder: { fr: 'Ajouter un hobby...', en: 'Add a hobby...', nl: 'Voeg een hobby toe...', de: 'Hobby hinzufügen...' },
      interestsTitle: { fr: 'Intérêts', en: 'Interests', nl: 'Interesses', de: 'Interessen' },
      interests: {
        music: { fr: 'Musique', en: 'Music', nl: 'Muziek', de: 'Musik' },
        sports: { fr: 'Sports', en: 'Sports', nl: 'Sport', de: 'Sport' },
        reading: { fr: 'Lecture', en: 'Reading', nl: 'Lezen', de: 'Lesen' },
        cooking: { fr: 'Cuisine', en: 'Cooking', nl: 'Koken', de: 'Kochen' },
        gaming: { fr: 'Jeux vidéo', en: 'Gaming', nl: 'Gaming', de: 'Gaming' },
        travel: { fr: 'Voyage', en: 'Travel', nl: 'Reizen', de: 'Reisen' },
        art: { fr: 'Art', en: 'Art', nl: 'Kunst', de: 'Kunst' },
        photography: { fr: 'Photographie', en: 'Photography', nl: 'Fotografie', de: 'Fotografie' },
        fitness: { fr: 'Fitness', en: 'Fitness', nl: 'Fitness', de: 'Fitness' },
        movies: { fr: 'Cinéma', en: 'Movies', nl: 'Films', de: 'Filme' },
        technology: { fr: 'Technologie', en: 'Technology', nl: 'Technologie', de: 'Technologie' },
        nature: { fr: 'Nature', en: 'Nature', nl: 'Natuur', de: 'Natur' },
      },
      traitsTitle: { fr: 'Traits de personnalité', en: 'Personality Traits', nl: 'Persoonlijkheidskenmerken', de: 'Persönlichkeitsmerkmale' },
      traits: {
        outgoing: { fr: 'Extraverti', en: 'Outgoing', nl: 'Extravert', de: 'Kontaktfreudig' },
        introverted: { fr: 'Introverti', en: 'Introverted', nl: 'Introvert', de: 'Introvertiert' },
        creative: { fr: 'Créatif', en: 'Creative', nl: 'Creatief', de: 'Kreativ' },
        organized: { fr: 'Organisé', en: 'Organized', nl: 'Georganiseerd', de: 'Organisiert' },
        spontaneous: { fr: 'Spontané', en: 'Spontaneous', nl: 'Spontaan', de: 'Spontan' },
        relaxed: { fr: 'Détendu', en: 'Relaxed', nl: 'Ontspannen', de: 'Entspannt' },
        ambitious: { fr: 'Ambitieux', en: 'Ambitious', nl: 'Ambitieus', de: 'Ehrgeizig' },
        friendly: { fr: 'Amical', en: 'Friendly', nl: 'Vriendelijk', de: 'Freundlich' },
        independent: { fr: 'Indépendant', en: 'Independent', nl: 'Onafhankelijk', de: 'Unabhängig' },
        teamPlayer: { fr: 'Esprit d\'équipe', en: 'Team Player', nl: 'Teamspeler', de: 'Teamplayer' },
      },
      tip: { fr: 'Conseil', en: 'Tip', nl: 'Tip', de: 'Tipp' },
      tipContent: { fr: 'Partager votre personnalité t\'aide à te connecter avec des voisins partageant des intérêts et modes de vie similaires !', en: 'Sharing your personality helps you connect with neighbors who share similar interests and lifestyles!', nl: 'Je persoonlijkheid delen helpt je in contact te komen met buren met vergelijkbare interesses en levensstijlen!', de: 'Das Teilen Ihrer Persönlichkeit hilft Ihnen, mit Nachbarn in Kontakt zu treten, die ähnliche Interessen und Lebensstile haben!' },
    },
    // Lifestyle Page
    lifestyle: {
      title: { fr: 'Préférences de mode de vie', en: 'Lifestyle Preferences', nl: 'Levensstijlvoorkeuren', de: 'Lebensstil-Präferenzen' },
      description: { fr: 'Aidez-nous à comprendre votre mode de vie quotidien et tes habitudes de vie', en: 'Help us understand your daily lifestyle and living habits', nl: 'Help ons je dagelijkse levensstijl en woongewoonten te begrijpen', de: 'Helfen Sie uns, Ihren täglichen Lebensstil und Ihre Gewohnheiten zu verstehen' },
      loadingText: { fr: 'Chargement de tes préférences de mode de vie...', en: 'Loading your lifestyle preferences...', nl: 'Je levensstijlvoorkeuren laden...', de: 'Laden Ihrer Lebensstil-Präferenzen...' },
      saved: { fr: 'Préférences de mode de vie enregistrées !', en: 'Lifestyle preferences saved!', nl: 'Levensstijlvoorkeuren opgeslagen!', de: 'Lebensstil-Präferenzen gespeichert!' },
      sleep: {
        title: { fr: 'Horaire de sommeil *', en: 'Sleep Schedule *', nl: 'Slaapschema *', de: 'Schlafplan *' },
        subtitle: { fr: 'Quand dors-tu généralement ?', en: 'When do you typically sleep?', nl: 'Wanneer slaap je meestal?', de: 'Wann schlafen Sie normalerweise?' },
        earlyBird: { fr: 'Lève-tôt', en: 'Early Bird', nl: 'Vroege vogel', de: 'Frühaufsteher' },
        earlyBirdDesc: { fr: 'Couché avant 23h', en: 'Sleep before 11pm', nl: 'Slapen voor 23u', de: 'Schlafen vor 23 Uhr' },
        nightOwl: { fr: 'Couche-tard', en: 'Night Owl', nl: 'Nachtuil', de: 'Nachteule' },
        nightOwlDesc: { fr: 'Couché après 1h', en: 'Sleep after 1am', nl: 'Slapen na 1u', de: 'Schlafen nach 1 Uhr' },
        flexible: { fr: 'Flexible', en: 'Flexible', nl: 'Flexibel', de: 'Flexibel' },
        flexibleDesc: { fr: 'Varie selon les jours', en: 'Varies by day', nl: 'Varieert per dag', de: 'Variiert je nach Tag' },
      },
      cleanliness: {
        title: { fr: 'Niveau de propreté *', en: 'Cleanliness Level *', nl: 'Netheid niveau *', de: 'Sauberkeitsniveau *' },
        subtitle: { fr: 'Comment maintiens-tu ton espace ?', en: 'How clean do you keep your space?', nl: 'Hoe netjes houd je je ruimte?', de: 'Wie sauber halten Sie Ihren Raum?' },
        veryClean: { fr: 'Très propre', en: 'Very Clean', nl: 'Zeer netjes', de: 'Sehr sauber' },
        veryCleanDesc: { fr: 'Tout impeccable', en: 'Everything spotless', nl: 'Alles onberispelijk', de: 'Alles makellos' },
        moderate: { fr: 'Modéré', en: 'Moderate', nl: 'Gemiddeld', de: 'Moderat' },
        moderateDesc: { fr: 'Rangé la plupart du temps', en: 'Tidy most times', nl: 'Meestal opgeruimd', de: 'Meistens aufgeräumt' },
        relaxed: { fr: 'Détendu', en: 'Relaxed', nl: 'Ontspannen', de: 'Entspannt' },
        relaxedDesc: { fr: 'Ambiance vécu', en: 'Lived-in feel', nl: 'Bewoond gevoel', de: 'Bewohntes Gefühl' },
      },
      noise: {
        title: { fr: 'Préférence de bruit *', en: 'Noise Preference *', nl: 'Geluidvoorkeur *', de: 'Geräuschpräferenz *' },
        subtitle: { fr: 'Quel est votre niveau de bruit idéal ?', en: "What's your ideal noise level?", nl: 'Wat is je ideale geluidsniveau?', de: 'Was ist Ihr idealer Geräuschpegel?' },
        quiet: { fr: 'Calme', en: 'Quiet', nl: 'Stil', de: 'Ruhig' },
        quietDesc: { fr: 'Paix & tranquillité', en: 'Peace & tranquility', nl: 'Rust & stilte', de: 'Ruhe & Stille' },
        moderate: { fr: 'Modéré', en: 'Moderate', nl: 'Gemiddeld', de: 'Moderat' },
        moderateDesc: { fr: 'Bruits normaux OK', en: 'Normal sounds OK', nl: 'Normale geluiden OK', de: 'Normale Geräusche OK' },
        lively: { fr: 'Animé', en: 'Lively', nl: 'Levendig', de: 'Lebhaft' },
        livelyDesc: { fr: 'Énergie & ambiance', en: 'Energy & vibes', nl: 'Energie & sfeer', de: 'Energie & Stimmung' },
      },
      cooking: {
        title: { fr: 'Fréquence de cuisine', en: 'Cooking Frequency', nl: 'Kookfrequentie', de: 'Kochhäufigkeit' },
        subtitle: { fr: 'À quelle fréquence cuisines-tu à la maison ?', en: 'How often do you cook at home?', nl: 'Hoe vaak kook je thuis?', de: 'Wie oft kochen Sie zu Hause?' },
        daily: { fr: 'Quotidien', en: 'Daily', nl: 'Dagelijks', de: 'Täglich' },
        often: { fr: 'Souvent', en: 'Often', nl: 'Vaak', de: 'Oft' },
        rarely: { fr: 'Rarement', en: 'Rarely', nl: 'Zelden', de: 'Selten' },
      },
      guests: {
        title: { fr: 'Recevoir des invités', en: 'Having Guests Over', nl: 'Gasten ontvangen', de: 'Gäste empfangen' },
        subtitle: { fr: 'À quelle fréquence as-tu des visiteurs ?', en: 'How often do you have visitors?', nl: 'Hoe vaak heb je bezoekers?', de: 'Wie oft haben Sie Besucher?' },
        never: { fr: 'Jamais', en: 'Never', nl: 'Nooit', de: 'Nie' },
        rarely: { fr: 'Rarement', en: 'Rarely', nl: 'Zelden', de: 'Selten' },
        sometimes: { fr: 'Parfois', en: 'Sometimes', nl: 'Soms', de: 'Manchmal' },
        often: { fr: 'Souvent', en: 'Often', nl: 'Vaak', de: 'Oft' },
      },
    },
    // Verification Page
    verification: {
      title: { fr: 'Vérification du profil', en: 'Profile Verification', nl: 'Profielverificatie', de: 'Profilverifizierung' },
      description: { fr: 'Fais-toi vérifier pour établir la confiance avec ton communauté', en: 'Get verified to build trust with your community', nl: 'Laat je verifiëren om vertrouwen op te bouwen met je gemeenschap', de: 'Lassen Sie sich verifizieren, um Vertrauen in Ihrer Community aufzubauen' },
      loadingText: { fr: 'Chargement du statut de vérification...', en: 'Loading verification status...', nl: 'Verificatiestatus laden...', de: 'Verifizierungsstatus wird geladen...' },
      verified: {
        title: { fr: 'Tu es vérifié !', en: "You're Verified!", nl: 'Je bent geverifieerd!', de: 'Sie sind verifiziert!' },
        description: { fr: 'Ton profil a été vérifié. Cela aide à établir la confiance dans la communauté.', en: 'Your profile has been verified. This helps build trust in the community.', nl: 'Je profiel is geverifieerd. Dit helpt vertrouwen op te bouwen in de gemeenschap.', de: 'Ihr Profil wurde verifiziert. Dies hilft, Vertrauen in der Community aufzubauen.' },
      },
      pending: {
        title: { fr: 'Vérification en cours', en: 'Verification Pending', nl: 'Verificatie in behandeling', de: 'Verifizierung ausstehend' },
        description: { fr: 'Ta demande de vérification est en cours d\'examen. Nous t\'informerons une fois terminé.', en: "Your verification request is being reviewed. We'll notify you once it's complete.", nl: 'Je verificatieverzoek wordt beoordeeld. We informeren je zodra het klaar is.', de: 'Ihre Verifizierungsanfrage wird geprüft. Wir benachrichtigen Sie, sobald sie abgeschlossen ist.' },
      },
      requestSubmitted: { fr: 'Demande de vérification envoyée ! Nous l\'examinerons bientôt.', en: "Verification request submitted! We'll review it soon.", nl: 'Verificatieverzoek ingediend! We bekijken het binnenkort.', de: 'Verifizierungsanfrage eingereicht! Wir werden sie bald prüfen.' },
      whyVerify: { fr: 'Pourquoi se faire vérifier ?', en: 'Why Get Verified?', nl: 'Waarom je laten verifiëren?', de: 'Warum verifizieren lassen?' },
      benefits: {
        buildTrust: { fr: 'Établir la confiance', en: 'Build Trust', nl: 'Vertrouwen opbouwen', de: 'Vertrauen aufbauen' },
        buildTrustDesc: { fr: 'Montrez à tes voisins que tu es un vrai membre vérifié de la communauté', en: "Show your neighbors you're a real, verified community member", nl: 'Laat je buren zien dat je een echte, geverifieerde gemeenschapslid bent', de: 'Zeigen Sie Ihren Nachbarn, dass Sie ein echtes, verifiziertes Mitglied der Gemeinschaft sind' },
        standOut: { fr: 'Se démarquer', en: 'Stand Out', nl: 'Opvallen', de: 'Sich abheben' },
        standOutDesc: { fr: 'Obtenez un badge vérifié sur ton profil', en: 'Get a verified badge on your profile', nl: 'Krijg een geverifieerd badge op je profiel', de: 'Erhalten Sie ein Verifizierungs-Badge auf Ihrem Profil' },
        easyProcess: { fr: 'Processus simple', en: 'Easy Process', nl: 'Eenvoudig proces', de: 'Einfacher Prozess' },
        easyProcessDesc: { fr: 'Processus de vérification simple qui ne prend que quelques minutes', en: 'Simple verification process that takes just a few minutes', nl: 'Eenvoudig verificatieproces dat slechts enkele minuten duurt', de: 'Einfacher Verifizierungsprozess, der nur wenige Minuten dauert' },
      },
      whatWeNeed: { fr: 'Ce dont nous avons besoin', en: "What We'll Need", nl: 'Wat we nodig hebben', de: 'Was wir brauchen' },
      requirements: {
        validId: { fr: 'Pièce d\'identité valide (passeport, permis de conduire ou carte d\'identité nationale)', en: 'Valid ID (passport, driver\'s license, or national ID)', nl: 'Geldig identiteitsbewijs (paspoort, rijbewijs of nationale ID)', de: 'Gültiger Ausweis (Reisepass, Führerschein oder Personalausweis)' },
        selfie: { fr: 'Un selfie pour confirmation d\'identité', en: 'A selfie for identity confirmation', nl: 'Een selfie ter bevestiging van identiteit', de: 'Ein Selfie zur Identitätsbestätigung' },
        proofOfResidence: { fr: 'Justificatif de domicile (optionnel, mais recommandé)', en: 'Proof of residence (optional, but recommended)', nl: 'Bewijs van verblijf (optioneel, maar aanbevolen)', de: 'Wohnsitznachweis (optional, aber empfohlen)' },
      },
      privacyProtected: { fr: 'Votre vie privée est protégée', en: 'Your Privacy is Protected', nl: 'Je privacy is beschermd', de: 'Ihre Privatsphäre ist geschützt' },
      privacyContent: { fr: 'Vos documents de vérification sont cryptés et stockés en toute sécurité. Ils ne sont utilisés qu\'à des fins de vérification et ne sont jamais partagés avec d\'autres utilisateurs.', en: "Your verification documents are encrypted and stored securely. They're only used for verification purposes and are never shared with other users.", nl: 'Je verificatiedocumenten worden versleuteld en veilig opgeslagen. Ze worden alleen gebruikt voor verificatiedoeleinden en worden nooit gedeeld met andere gebruikers.', de: 'Ihre Verifizierungsdokumente werden verschlüsselt und sicher gespeichert. Sie werden nur für Verifizierungszwecke verwendet und niemals mit anderen Benutzern geteilt.' },
      later: { fr: 'Plus tard', en: 'Later', nl: 'Later', de: 'Später' },
      startVerification: { fr: 'Commencer la vérification', en: 'Start Verification', nl: 'Verificatie starten', de: 'Verifizierung starten' },
      processingTime: { fr: 'La vérification prend généralement 1-2 jours ouvrables', en: 'Verification typically takes 1-2 business days', nl: 'Verificatie duurt meestal 1-2 werkdagen', de: 'Die Verifizierung dauert in der Regel 1-2 Werktage' },
    },
    // Community Page
    community: {
      title: { fr: 'Communauté & Événements', en: 'Community & Events', nl: 'Gemeenschap & Evenementen', de: 'Gemeinschaft & Veranstaltungen' },
      description: { fr: 'Quel est votre intérêt pour les événements communautaires, les fêtes et les rencontres sociales ?', en: 'How interested are you in community events, parties, and social gatherings?', nl: 'Hoe geïnteresseerd ben je in gemeenschapsevenementen, feesten en sociale bijeenkomsten?', de: 'Wie interessiert sind Sie an Gemeinschaftsveranstaltungen, Partys und geselligen Zusammenkünften?' },
      saved: { fr: 'Préférences communautaires enregistrées !', en: 'Community preferences saved!', nl: 'Gemeenschapsvoorkeuren opgeslagen!', de: 'Gemeinschaftspräferenzen gespeichert!' },
      eventInterest: {
        label: { fr: 'Intérêt pour les événements', en: 'Event participation interest', nl: 'Interesse in evenementdeelname', de: 'Interesse an Veranstaltungsteilnahme' },
        low: { fr: 'Faible', en: 'Low', nl: 'Laag', de: 'Niedrig' },
        lowDesc: { fr: 'Préfère l\'indépendance tranquille', en: 'Prefer quiet independence', nl: 'Liever rustige onafhankelijkheid', de: 'Bevorzuge ruhige Unabhängigkeit' },
        medium: { fr: 'Moyen', en: 'Medium', nl: 'Gemiddeld', de: 'Mittel' },
        mediumDesc: { fr: 'Socialiser occasionnellement', en: 'Occasional socializing', nl: 'Af en toe socialiseren', de: 'Gelegentliches Zusammensein' },
        high: { fr: 'Élevé', en: 'High', nl: 'Hoog', de: 'Hoch' },
        highDesc: { fr: 'J\'adore les événements communautaires !', en: 'Love community events!', nl: 'Hou van gemeenschapsevenementen!', de: 'Liebe Gemeinschaftsveranstaltungen!' },
      },
      sharedMeals: {
        title: { fr: 'J\'aimerais des repas partagés', en: "I'd enjoy shared meals", nl: 'Ik zou gedeelde maaltijden leuk vinden', de: 'Ich würde gemeinsame Mahlzeiten genießen' },
        description: { fr: 'Cuisiner et manger ensemble avec les résidents', en: 'Cook and eat together with flatmates', nl: 'Samen koken en eten met huisgenoten', de: 'Gemeinsam mit Mitbewohnern kochen und essen' },
      },
      meetups: {
        title: { fr: 'Ouvert aux rencontres entre résidents', en: 'Open to flatmate meetups', nl: 'Open voor huisgenotenbijeenkomsten', de: 'Offen für Mitbewohner-Treffen' },
        description: { fr: 'Traîner, regarder des films, soirées jeux', en: 'Hang out, watch movies, game nights', nl: 'Rondhangen, films kijken, spelletjesavonden', de: 'Abhängen, Filme schauen, Spieleabende' },
      },
      perks: {
        title: { fr: 'Avantages communautaires', en: 'Community Perks', nl: 'Gemeenschapsvoordelen', de: 'Gemeinschaftsvorteile' },
        connect: { fr: 'Connecte-toi avec des voisins partageant tes intérêts', en: 'Connect with neighbors who share your interests', nl: 'Kom in contact met buren die je interesses delen', de: 'Verbinden Sie sich mit Nachbarn, die Ihre Interessen teilen' },
        invited: { fr: 'Soyez invité aux événements de l\'immeuble correspondant à votre style', en: 'Get invited to building events that match your style', nl: 'Word uitgenodigd voor gebouwevenementen die bij je stijl passen', de: 'Werden Sie zu Gebäudeveranstaltungen eingeladen, die zu Ihrem Stil passen' },
        friendships: { fr: 'Construisez des amitiés durables dans ton communauté', en: 'Build lasting friendships in your community', nl: 'Bouw blijvende vriendschappen op in je gemeenschap', de: 'Bauen Sie dauerhafte Freundschaften in Ihrer Gemeinschaft auf' },
      },
    },
  },

  // ============================================================================
  // ENHANCE SEARCHER PROFILE (Onboarding)
  // ============================================================================
  enhanceSearcher: {
    common: {
      backToMenu: { fr: 'Retour au menu', en: 'Back to Menu', nl: 'Terug naar menu', de: 'Zurück zum Menü' },
      loading: { fr: 'Chargement de tes informations...', en: 'Loading your information...', nl: 'Je informatie laden...', de: 'Laden Ihrer Informationen...' },
      loadingPreferences: { fr: 'Chargement de tes préférences...', en: 'Loading your preferences...', nl: 'Je voorkeuren laden...', de: 'Laden Ihrer Präferenzen...' },
      loadingValues: { fr: 'Chargement de tes valeurs...', en: 'Loading your values...', nl: 'Je waarden laden...', de: 'Laden Ihrer Werte...' },
      loadingHobbies: { fr: 'Chargement de tes hobbies...', en: 'Loading your hobbies...', nl: 'Je hobby\'s laden...', de: 'Laden Ihrer Hobbys...' },
      saveAndContinue: { fr: 'Enregistrer et continuer', en: 'Save & Continue', nl: 'Opslaan & doorgaan', de: 'Speichern & Fortfahren' },
      skipForNow: { fr: 'Passer pour l\'instant', en: 'Skip for now', nl: 'Nu overslaan', de: 'Vorerst überspringen' },
      saved: { fr: 'Enregistré !', en: 'Saved!', nl: 'Opgeslagen!', de: 'Gespeichert!' },
      add: { fr: 'Ajouter', en: 'Add', nl: 'Toevoegen', de: 'Hinzufügen' },
      selected: { fr: 'sélectionné(s)', en: 'selected', nl: 'geselecteerd', de: 'ausgewählt' },
    },
    errors: {
      loadFailed: { fr: 'Échec du chargement des données existantes', en: 'Failed to load existing data', nl: 'Bestaande gegevens laden mislukt', de: 'Laden bestehender Daten fehlgeschlagen' },
    },
    // About Page
    about: {
      title: { fr: 'Parle-nous de toi', en: 'Tell Us About Yourself', nl: 'Vertel ons over jezelf', de: 'Erzählen Sie uns von sich' },
      description: { fr: 'Partagez un peu de qui tu es (tous les champs sont optionnels)', en: 'Share a bit about who you are (all fields are optional)', nl: 'Deel wat over jezelf (alle velden zijn optioneel)', de: 'Teilen Sie etwas über sich mit (alle Felder sind optional)' },
      bio: {
        label: { fr: 'Courte bio', en: 'Short Bio', nl: 'Korte bio', de: 'Kurze Bio' },
        helper: { fr: 'Une brève introduction qui apparaît en haut de ton profil', en: 'A brief introduction that appears at the top of your profile', nl: 'Een korte introductie die bovenaan je profiel verschijnt', de: 'Eine kurze Einführung, die oben in Ihrem Profil erscheint' },
        placeholder: { fr: 'ex. Étudiant en tech passionné par le développement durable et les activités en plein air...', en: 'e.g., Tech student passionate about sustainability and outdoor activities...', nl: 'bijv. Techstudent met passie voor duurzaamheid en buitenactiviteiten...', de: 'z.B. Tech-Student mit Leidenschaft für Nachhaltigkeit und Outdoor-Aktivitäten...' },
      },
      aboutMe: {
        label: { fr: 'Plus sur moi', en: 'More About Me', nl: 'Meer over mij', de: 'Mehr über mich' },
        helper: { fr: 'Partagez plus de détails sur ton mode de vie, tes intérêts ou ce qui te rend unique', en: 'Share more details about your lifestyle, interests, or what makes you unique', nl: 'Deel meer over je levensstijl, interesses of wat je uniek maakt', de: 'Teilen Sie mehr über Ihren Lebensstil, Ihre Interessen oder was Sie einzigartig macht' },
        placeholder: { fr: 'ex. Je suis étudiant en communication qui adore la techno et danser. Je travaille parfois de chez moi, j\'aime cuisiner sainement et garder un espace rangé...', en: "e.g., I'm a communication student who loves techno and dancing. I work from home sometimes, enjoy cooking healthy meals, and like to keep a tidy space...", nl: 'bijv. Ik ben een communicatiestudent die houdt van techno en dansen. Ik werk soms thuis, kook graag gezond en houd van een opgeruimde ruimte...', de: 'z.B. Ich bin Kommunikationsstudent, der Techno und Tanzen liebt. Ich arbeite manchmal von zu Hause, koche gerne gesund und mag einen aufgeräumten Raum...' },
      },
      lookingFor: {
        label: { fr: 'Ce que je recherche', en: "What I'm Looking For", nl: 'Waar ik naar zoek', de: 'Was ich suche' },
        helper: { fr: 'Décris ta situation de vie idéale et le type de personnes avec qui tu aimerais vivre', en: "Describe your ideal living situation and the kind of people you'd like to live with", nl: 'Beschrijf je ideale woonsituatie en het type mensen waarmee je zou willen wonen', de: 'Beschreiben Sie Ihre ideale Wohnsituation und die Art von Menschen, mit denen Sie leben möchten' },
        placeholder: { fr: 'ex. Je cherche une chambre conviviale dans un co-living mixte avec des personnes qui respectent les espaces partagés et aiment les activités sociales occasionnelles...', en: 'e.g., Looking for a convivial room in a mixed coliving with people who respect shared spaces and enjoy occasional social activities...', nl: 'bijv. Op zoek naar een gezellige kamer in een gemengde coliving met mensen die gedeelde ruimtes respecteren en af en toe sociale activiteiten leuk vinden...', de: 'z.B. Suche ein geselliges Zimmer in einer gemischten Coliving-WG mit Menschen, die gemeinsame Räume respektieren und gelegentliche soziale Aktivitäten genießen...' },
      },
    },
    // Community Page
    community: {
      title: { fr: 'Communauté & Événements', en: 'Community & Events', nl: 'Gemeenschap & Evenementen', de: 'Gemeinschaft & Veranstaltungen' },
      description: { fr: 'Quel est votre intérêt pour les événements communautaires, les fêtes et les rencontres sociales ?', en: 'How interested are you in community events, parties, and social gatherings?', nl: 'Hoe geïnteresseerd ben je in gemeenschapsevenementen, feesten en sociale bijeenkomsten?', de: 'Wie interessiert sind Sie an Gemeinschaftsveranstaltungen, Partys und geselligen Zusammenkünften?' },
      eventInterest: {
        label: { fr: 'Intérêt pour les événements', en: 'Event participation interest', nl: 'Interesse in evenementdeelname', de: 'Interesse an Veranstaltungsteilnahme' },
        low: { fr: 'Faible', en: 'Low', nl: 'Laag', de: 'Niedrig' },
        lowDesc: { fr: 'Préfère l\'indépendance tranquille', en: 'Prefer quiet independence', nl: 'Liever rustige onafhankelijkheid', de: 'Bevorzuge ruhige Unabhängigkeit' },
        medium: { fr: 'Moyen', en: 'Medium', nl: 'Gemiddeld', de: 'Mittel' },
        mediumDesc: { fr: 'Socialiser occasionnellement', en: 'Occasional socializing', nl: 'Af en toe socialiseren', de: 'Gelegentliches Zusammensein' },
        high: { fr: 'Élevé', en: 'High', nl: 'Hoog', de: 'Hoch' },
        highDesc: { fr: 'J\'adore les événements communautaires !', en: 'Love community events!', nl: 'Hou van gemeenschapsevenementen!', de: 'Liebe Gemeinschaftsveranstaltungen!' },
      },
      sharedMeals: {
        title: { fr: 'J\'aimerais des repas partagés', en: "I'd enjoy shared meals", nl: 'Ik zou gedeelde maaltijden leuk vinden', de: 'Ich würde gemeinsame Mahlzeiten genießen' },
        description: { fr: 'Cuisiner et manger ensemble avec les résidents', en: 'Cook and eat together with flatmates', nl: 'Samen koken en eten met huisgenoten', de: 'Gemeinsam mit Mitbewohnern kochen und essen' },
      },
      meetups: {
        title: { fr: 'Ouvert aux rencontres entre résidents', en: 'Open to flatmate meetups', nl: 'Open voor huisgenotenbijeenkomsten', de: 'Offen für Mitbewohner-Treffen' },
        description: { fr: 'Traîner, regarder des films, soirées jeux', en: 'Hang out, watch movies, game nights', nl: 'Rondhangen, films kijken, spelletjesavonden', de: 'Abhängen, Filme schauen, Spieleabende' },
      },
      perks: {
        title: { fr: 'Avantages communautaires', en: 'Community Perks', nl: 'Gemeenschapsvoordelen', de: 'Gemeinschaftsvorteile' },
        findFlatmates: { fr: 'Trouvez des résidents avec une énergie sociale similaire', en: 'Find flatmates with similar social energy', nl: 'Vind huisgenoten met vergelijkbare sociale energie', de: 'Finden Sie Mitbewohner mit ähnlicher sozialer Energie' },
        matchedStyles: { fr: 'Soyez associé à des styles de vie compatibles', en: 'Get matched with compatible living styles', nl: 'Word gematcht met compatibele levensstijlen', de: 'Werden Sie mit kompatiblen Lebensstilen zusammengebracht' },
        discoverSpaces: { fr: 'Découvrez des espaces de co-living qui correspondent à votre ambiance', en: 'Discover coliving spaces that fit your vibe', nl: 'Ontdek coliving-ruimtes die bij je vibe passen', de: 'Entdecken Sie Coliving-Räume, die zu Ihrer Stimmung passen' },
      },
    },
    // Ideal Living Page
    idealLiving: {
      title: { fr: 'Situation de vie idéale', en: 'Ideal Living Situation', nl: 'Ideale woonsituatie', de: 'Ideale Wohnsituation' },
      description: { fr: 'Parle-nous de ton environnement de co-living idéal', en: 'Tell us about your ideal coliving environment', nl: 'Vertel ons over je ideale coliving-omgeving', de: 'Erzählen Sie uns von Ihrer idealen Coliving-Umgebung' },
      communitySize: {
        title: { fr: 'Taille de communauté préférée', en: 'Preferred Community Size', nl: 'Gewenste gemeenschapsgrootte', de: 'Bevorzugte Gemeinschaftsgröße' },
        subtitle: { fr: 'Avec combien de personnes aimerais-tu vivre ?', en: 'How many people would you like to live with?', nl: 'Met hoeveel mensen zou je willen wonen?', de: 'Mit wie vielen Menschen möchten Sie zusammenleben?' },
        small: { fr: '2-3 Personnes', en: '2-3 People', nl: '2-3 Personen', de: '2-3 Personen' },
        smallDesc: { fr: 'Intime & Calme', en: 'Intimate & Quiet', nl: 'Intiem & Rustig', de: 'Intim & Ruhig' },
        medium: { fr: '4-6 Personnes', en: '4-6 People', nl: '4-6 Personen', de: '4-6 Personen' },
        mediumDesc: { fr: 'Équilibre parfait', en: 'Perfect Balance', nl: 'Perfecte balans', de: 'Perfekte Balance' },
        large: { fr: '7-10 Personnes', en: '7-10 People', nl: '7-10 Personen', de: '7-10 Personen' },
        largeDesc: { fr: 'Communauté vibrante', en: 'Vibrant Community', nl: 'Levendige gemeenschap', de: 'Lebendige Gemeinschaft' },
        xlarge: { fr: '10+ Personnes', en: '10+ People', nl: '10+ Personen', de: '10+ Personen' },
        xlargeDesc: { fr: 'Grande communauté', en: 'Large Community', nl: 'Grote gemeenschap', de: 'Große Gemeinschaft' },
      },
      genderMix: {
        title: { fr: 'Préférence de mixité', en: 'Gender Mix Preference', nl: 'Geslachtsvoorkeur', de: 'Geschlechtermix-Präferenz' },
        subtitle: { fr: 'Quelle mixité préfères-tu ?', en: 'What gender mix do you prefer?', nl: 'Welke geslachtsmix heb je liever?', de: 'Welchen Geschlechtermix bevorzugen Sie?' },
        maleOnly: { fr: 'Hommes uniquement', en: 'Male Only', nl: 'Alleen mannen', de: 'Nur Männer' },
        femaleOnly: { fr: 'Femmes uniquement', en: 'Female Only', nl: 'Alleen vrouwen', de: 'Nur Frauen' },
        mixed: { fr: 'Mixte', en: 'Mixed Gender', nl: 'Gemengd', de: 'Gemischt' },
        noPreference: { fr: 'Pas de préférence', en: 'No Preference', nl: 'Geen voorkeur', de: 'Keine Präferenz' },
      },
      ageRange: {
        title: { fr: 'Tranche d\'âge préférée', en: 'Preferred Age Range', nl: 'Gewenste leeftijdsgroep', de: 'Bevorzugte Altersgruppe' },
        subtitle: { fr: 'Quelle tranche d\'âge te convient ?', en: 'What age range are you comfortable with?', nl: 'Welke leeftijdsgroep past bij je?', de: 'Welche Altersgruppe ist Ihnen angenehm?' },
        minAge: { fr: 'Âge minimum', en: 'Minimum Age', nl: 'Minimum leeftijd', de: 'Mindestalter' },
        maxAge: { fr: 'Âge maximum', en: 'Maximum Age', nl: 'Maximum leeftijd', de: 'Höchstalter' },
      },
      sharedSpaces: {
        title: { fr: 'Importance des espaces partagés', en: 'Shared Spaces Importance', nl: 'Belang van gedeelde ruimtes', de: 'Wichtigkeit geteilter Räume' },
        subtitle: { fr: 'Quelle importance accordes-tu aux espaces communs ?', en: 'How important are shared common areas to you?', nl: 'Hoe belangrijk zijn gedeelde gemeenschappelijke ruimtes voor jou?', de: 'Wie wichtig sind Ihnen gemeinsame Bereiche?' },
        notImportant: { fr: 'Pas important', en: 'Not Important', nl: 'Niet belangrijk', de: 'Nicht wichtig' },
        veryImportant: { fr: 'Très important', en: 'Very Important', nl: 'Zeer belangrijk', de: 'Sehr wichtig' },
      },
      quietHours: {
        title: { fr: 'Préférence heures calmes', en: 'Quiet Hours Preference', nl: 'Voorkeur voor stille uren', de: 'Präferenz für Ruhezeiten' },
        subtitle: { fr: 'Préfères-tu des heures calmes établies ?', en: 'Do you prefer established quiet hours?', nl: 'Heb je liever vastgestelde stille uren?', de: 'Bevorzugen Sie festgelegte Ruhezeiten?' },
      },
      tip: { fr: 'Ces préférences nous aident à t\'associer à des propriétés et communautés qui correspondent à votre situation de vie idéale.', en: 'These preferences help us match you with properties and communities that fit your ideal living situation.', nl: 'Deze voorkeuren helpen ons je te matchen met woningen en gemeenschappen die bij je ideale woonsituatie passen.', de: 'Diese Präferenzen helfen uns, Sie mit Immobilien und Gemeinschaften zusammenzubringen, die zu Ihrer idealen Wohnsituation passen.' },
    },
    // Lifestyle Details Page
    lifestyleDetails: {
      title: { fr: 'Détails du mode de vie', en: 'Lifestyle Details', nl: 'Levensstijldetails', de: 'Lebensstil-Details' },
      description: { fr: 'Partagez plus sur tes habitudes quotidiennes et préférences', en: 'Share more about your daily habits and preferences', nl: 'Deel meer over je dagelijkse gewoonten en voorkeuren', de: 'Teilen Sie mehr über Ihre täglichen Gewohnheiten und Präferenzen' },
      music: {
        title: { fr: 'Habitudes musicales à la maison', en: 'Music Habits at Home', nl: 'Muziekgewoonten thuis', de: 'Musikgewohnheiten zu Hause' },
        subtitle: { fr: 'Comment apprécies-tu la musique chez toi ?', en: 'How do you enjoy music at home?', nl: 'Hoe geniet je van muziek thuis?', de: 'Wie genießen Sie Musik zu Hause?' },
        none: { fr: 'Silence', en: 'Silence', nl: 'Stilte', de: 'Stille' },
        noneDesc: { fr: 'Je préfère les environnements calmes', en: 'I prefer quiet environments', nl: 'Ik geef de voorkeur aan stille omgevingen', de: 'Ich bevorzuge ruhige Umgebungen' },
        headphonesOnly: { fr: 'Écouteurs uniquement', en: 'Headphones Only', nl: 'Alleen koptelefoon', de: 'Nur Kopfhörer' },
        headphonesOnlyDesc: { fr: 'La musique c\'est pour moi seul', en: 'Music is for me alone', nl: 'Muziek is alleen voor mij', de: 'Musik ist nur für mich' },
        headphonesMostly: { fr: 'Principalement écouteurs', en: 'Mostly Headphones', nl: 'Meestal koptelefoon', de: 'Meistens Kopfhörer' },
        headphonesMostlyDesc: { fr: 'Parfois de la musique douce', en: 'Sometimes play softly', nl: 'Soms zacht afspelen', de: 'Manchmal leise abspielen' },
        quietBackground: { fr: 'Musique de fond', en: 'Quiet Background', nl: 'Zachte achtergrond', de: 'Leise Hintergrundmusik' },
        quietBackgroundDesc: { fr: 'Musique à faible volume', en: 'Low volume music', nl: 'Muziek op laag volume', de: 'Musik mit niedriger Lautstärke' },
        socialListening: { fr: 'Écoute sociale', en: 'Social Listening', nl: 'Sociaal luisteren', de: 'Gemeinsames Hören' },
        socialListeningDesc: { fr: 'J\'adore partager la musique', en: 'Love sharing music', nl: 'Hou van muziek delen', de: 'Liebe es, Musik zu teilen' },
      },
      cooking: {
        title: { fr: 'Fréquence de cuisine', en: 'Cooking Frequency', nl: 'Kookfrequentie', de: 'Kochhäufigkeit' },
        subtitle: { fr: 'À quelle fréquence cuisines-tu à la maison ?', en: 'How often do you cook at home?', nl: 'Hoe vaak kook je thuis?', de: 'Wie oft kochen Sie zu Hause?' },
        never: { fr: 'Jamais', en: 'Never', nl: 'Nooit', de: 'Nie' },
        neverDesc: { fr: 'Je mange dehors ou commande', en: 'I eat out or order', nl: 'Ik eet buiten of bestel', de: 'Ich esse auswärts oder bestelle' },
        rarely: { fr: 'Rarement', en: 'Rarely', nl: 'Zelden', de: 'Selten' },
        rarelyDesc: { fr: 'De temps en temps', en: 'Once in a while', nl: 'Af en toe', de: 'Ab und zu' },
        sometimes: { fr: 'Parfois', en: 'Sometimes', nl: 'Soms', de: 'Manchmal' },
        sometimesDesc: { fr: 'Quelques fois par semaine', en: 'Few times a week', nl: 'Een paar keer per week', de: 'Ein paar Mal pro Woche' },
        often: { fr: 'Souvent', en: 'Often', nl: 'Vaak', de: 'Oft' },
        oftenDesc: { fr: 'La plupart des jours', en: 'Most days', nl: 'De meeste dagen', de: 'Die meisten Tage' },
        daily: { fr: 'Quotidien', en: 'Daily', nl: 'Dagelijks', de: 'Täglich' },
        dailyDesc: { fr: 'J\'adore cuisiner !', en: 'I love cooking!', nl: 'Ik hou van koken!', de: 'Ich liebe Kochen!' },
      },
      diet: {
        title: { fr: 'Préférences alimentaires', en: 'Dietary Preferences', nl: 'Dieetvoorkeuren', de: 'Ernährungspräferenzen' },
        subtitle: { fr: 'Qu\'est-ce qui décrit le mieux votre régime ?', en: 'What best describes your diet?', nl: 'Wat beschrijft je dieet het beste?', de: 'Was beschreibt Ihre Ernährung am besten?' },
        omnivore: { fr: 'Omnivore', en: 'Omnivore', nl: 'Alleseter', de: 'Allesfresser' },
        omnivoreDesc: { fr: 'Je mange de tout', en: 'I eat everything', nl: 'Ik eet alles', de: 'Ich esse alles' },
        vegetarian: { fr: 'Végétarien', en: 'Vegetarian', nl: 'Vegetariër', de: 'Vegetarisch' },
        vegetarianDesc: { fr: 'Pas de viande', en: 'No meat', nl: 'Geen vlees', de: 'Kein Fleisch' },
        vegan: { fr: 'Végan', en: 'Vegan', nl: 'Veganist', de: 'Vegan' },
        veganDesc: { fr: 'Pas de produits animaux', en: 'No animal products', nl: 'Geen dierlijke producten', de: 'Keine tierischen Produkte' },
        pescatarian: { fr: 'Pescétarien', en: 'Pescatarian', nl: 'Pescotariër', de: 'Pescetarier' },
        pescatarianDesc: { fr: 'Poisson mais pas de viande', en: 'Fish but no meat', nl: 'Vis maar geen vlees', de: 'Fisch aber kein Fleisch' },
        flexitarian: { fr: 'Flexitarien', en: 'Flexitarian', nl: 'Flexitariër', de: 'Flexitarier' },
        flexitarianDesc: { fr: 'Principalement végétal', en: 'Mostly plant-based', nl: 'Voornamelijk plantaardig', de: 'Hauptsächlich pflanzlich' },
      },
      communication: {
        title: { fr: 'Style de communication', en: 'Communication Style', nl: 'Communicatiestijl', de: 'Kommunikationsstil' },
        subtitle: { fr: 'Comment préfères-tu communiquer avec tes résidents ?', en: 'How do you prefer to communicate with flatmates?', nl: 'Hoe communiceer je het liefst met huisgenoten?', de: 'Wie kommunizieren Sie am liebsten mit Mitbewohnern?' },
        direct: { fr: 'Direct & Franc', en: 'Direct & Straightforward', nl: 'Direct & Eerlijk', de: 'Direkt & Geradlinig' },
        directDesc: { fr: 'Je dis ce que je pense', en: 'I say what I mean', nl: 'Ik zeg wat ik bedoel', de: 'Ich sage, was ich meine' },
        diplomatic: { fr: 'Diplomate & Tactique', en: 'Diplomatic & Tactful', nl: 'Diplomatiek & Tactvol', de: 'Diplomatisch & Taktvoll' },
        diplomaticDesc: { fr: 'Je considère les sentiments', en: 'I consider feelings', nl: 'Ik houd rekening met gevoelens', de: 'Ich berücksichtige Gefühle' },
        casual: { fr: 'Décontracté & Amical', en: 'Casual & Friendly', nl: 'Casual & Vriendelijk', de: 'Locker & Freundlich' },
        casualDesc: { fr: 'Communication détendue', en: 'Laid-back communication', nl: 'Ontspannen communicatie', de: 'Entspannte Kommunikation' },
        formal: { fr: 'Formel & Professionnel', en: 'Formal & Professional', nl: 'Formeel & Professioneel', de: 'Formell & Professionell' },
        formalDesc: { fr: 'Communication structurée', en: 'Structured communication', nl: 'Gestructureerde communicatie', de: 'Strukturierte Kommunikation' },
      },
      tip: { fr: 'Ces détails nous aident à trouver des résidents avec des modes de vie et préférences de communication compatibles.', en: 'These details help us find flatmates with compatible lifestyles and communication preferences.', nl: 'Deze details helpen ons huisgenoten te vinden met compatibele levensstijlen en communicatievoorkeuren.', de: 'Diese Details helfen uns, Mitbewohner mit kompatiblen Lebensstilen und Kommunikationspräferenzen zu finden.' },
    },
    // Values Page
    values: {
      title: { fr: 'Vos valeurs & Préférences', en: 'Your Values & Preferences', nl: 'Je waarden & Voorkeuren', de: 'Ihre Werte & Präferenzen' },
      description: { fr: 'Aidez-nous à comprendre ce qui compte le plus pour toi', en: 'Help us understand what matters most to you', nl: 'Help ons te begrijpen wat voor jou het belangrijkst is', de: 'Helfen Sie uns zu verstehen, was Ihnen am wichtigsten ist' },
      coreValues: {
        title: { fr: 'Valeurs fondamentales', en: 'Core Values', nl: 'Kernwaarden', de: 'Grundwerte' },
        subtitle: { fr: 'Sélectionnez ce qui compte le plus pour toi (jusqu\'à 5)', en: 'Select what matters most to you (choose up to 5)', nl: 'Selecteer wat voor jou het belangrijkst is (max 5)', de: 'Wählen Sie, was Ihnen am wichtigsten ist (bis zu 5)' },
        honesty: { fr: 'Honnêteté', en: 'Honesty', nl: 'Eerlijkheid', de: 'Ehrlichkeit' },
        respect: { fr: 'Respect', en: 'Respect', nl: 'Respect', de: 'Respekt' },
        communication: { fr: 'Communication', en: 'Communication', nl: 'Communicatie', de: 'Kommunikation' },
        sustainability: { fr: 'Durabilité', en: 'Sustainability', nl: 'Duurzaamheid', de: 'Nachhaltigkeit' },
        diversity: { fr: 'Diversité', en: 'Diversity', nl: 'Diversiteit', de: 'Vielfalt' },
        collaboration: { fr: 'Collaboration', en: 'Collaboration', nl: 'Samenwerking', de: 'Zusammenarbeit' },
        independence: { fr: 'Indépendance', en: 'Independence', nl: 'Onafhankelijkheid', de: 'Unabhängigkeit' },
        growth: { fr: 'Croissance', en: 'Growth', nl: 'Groei', de: 'Wachstum' },
        community: { fr: 'Communauté', en: 'Community', nl: 'Gemeenschap', de: 'Gemeinschaft' },
        creativity: { fr: 'Créativité', en: 'Creativity', nl: 'Creativiteit', de: 'Kreativität' },
      },
      qualities: {
        title: { fr: 'Qualités importantes chez un résident', en: 'Important Qualities in a Roommate', nl: 'Belangrijke eigenschappen van een huisgenoot', de: 'Wichtige Eigenschaften bei einem Mitbewohner' },
        subtitle: { fr: 'Quelles qualités apprécies-tu chez un résident ?', en: 'What qualities do you value in a roommate?', nl: 'Welke eigenschappen waardeer je bij een huisgenoot?', de: 'Welche Eigenschaften schätzen Sie bei einem Mitbewohner?' },
        cleanliness: { fr: 'Propreté', en: 'Cleanliness', nl: 'Netheid', de: 'Sauberkeit' },
        punctuality: { fr: 'Ponctualité', en: 'Punctuality', nl: 'Punctualiteit', de: 'Pünktlichkeit' },
        friendliness: { fr: 'Amabilité', en: 'Friendliness', nl: 'Vriendelijkheid', de: 'Freundlichkeit' },
        quietness: { fr: 'Calme', en: 'Quietness', nl: 'Rustigheid', de: 'Ruhe' },
        flexibility: { fr: 'Flexibilité', en: 'Flexibility', nl: 'Flexibiliteit', de: 'Flexibilität' },
        organization: { fr: 'Organisation', en: 'Organization', nl: 'Organisatie', de: 'Organisation' },
        openness: { fr: 'Ouverture', en: 'Openness', nl: 'Openheid', de: 'Offenheit' },
        reliability: { fr: 'Fiabilité', en: 'Reliability', nl: 'Betrouwbaarheid', de: 'Zuverlässigkeit' },
        humor: { fr: 'Humour', en: 'Humor', nl: 'Humor', de: 'Humor' },
        empathy: { fr: 'Empathie', en: 'Empathy', nl: 'Empathie', de: 'Empathie' },
      },
      dealBreakers: {
        title: { fr: 'Points de rupture', en: 'Deal Breakers', nl: 'Dealbreakers', de: 'Ausschlusskriterien' },
        subtitle: { fr: 'Sélectionnez les comportements ou situations que tu ne peux absolument pas tolérer', en: 'Select behaviors or situations you absolutely cannot tolerate', nl: 'Selecteer gedragingen of situaties die je absoluut niet kunt tolereren', de: 'Wählen Sie Verhaltensweisen oder Situationen, die Sie absolut nicht tolerieren können' },
        smokingIndoors: { fr: 'Fumer à l\'intérieur', en: 'Smoking indoors', nl: 'Binnen roken', de: 'Rauchen in Innenräumen' },
        loudNoise: { fr: 'Bruit fort tard le soir', en: 'Loud noise late night', nl: 'Luid geluid \'s avonds laat', de: 'Laute Geräusche spät in der Nacht' },
        messiness: { fr: 'Désordre', en: 'Messiness', nl: 'Rommel', de: 'Unordnung' },
        noCleaning: { fr: 'Pas de nettoyage', en: 'No cleaning', nl: 'Niet schoonmaken', de: 'Nicht putzen' },
        strangers: { fr: 'Amener souvent des inconnus', en: 'Bringing strangers often', nl: 'Vaak vreemden meenemen', de: 'Oft Fremde mitbringen' },
        noBoundaries: { fr: 'Ne pas respecter les limites', en: 'Not respecting boundaries', nl: 'Grenzen niet respecteren', de: 'Grenzen nicht respektieren' },
        pets: { fr: 'Animaux (si allergique)', en: 'Pets (if allergic)', nl: 'Huisdieren (als allergisch)', de: 'Haustiere (wenn allergisch)' },
        noCommunication: { fr: 'Pas de communication', en: 'No communication', nl: 'Geen communicatie', de: 'Keine Kommunikation' },
        privacyInvasion: { fr: 'Invasion de vie privée', en: 'Invasion of privacy', nl: 'Inbreuk op privacy', de: 'Verletzung der Privatsphäre' },
      },
    },
    // Community Activities Page
    communityActivities: {
      title: { fr: 'Activités communautaires', en: 'Community Activities', nl: 'Gemeenschapsactiviteiten', de: 'Gemeinschaftsaktivitäten' },
      description: { fr: 'Partagez votre intérêt pour le sport et les activités de groupe', en: 'Share your interest in sports and group activities', nl: 'Deel je interesse in sport en groepsactiviteiten', de: 'Teilen Sie Ihr Interesse an Sport und Gruppenaktivitäten' },
      sports: {
        title: { fr: 'Fréquence d\'exercice & Sport', en: 'Exercise & Sports Frequency', nl: 'Sport- & Oefenfrequentie', de: 'Sport- & Übungshäufigkeit' },
        subtitle: { fr: 'À quelle fréquence fais-tu du sport ou de l\'exercice ?', en: 'How often do you exercise or play sports?', nl: 'Hoe vaak sport je of doe je aan lichaamsbeweging?', de: 'Wie oft treiben Sie Sport oder machen Übungen?' },
        never: { fr: 'Jamais', en: 'Never', nl: 'Nooit', de: 'Nie' },
        neverDesc: { fr: 'Je ne fais pas d\'exercice', en: "I don't exercise", nl: 'Ik sport niet', de: 'Ich mache keinen Sport' },
        rarely: { fr: 'Rarement', en: 'Rarely', nl: 'Zelden', de: 'Selten' },
        rarelyDesc: { fr: 'De temps en temps', en: 'Once in a while', nl: 'Af en toe', de: 'Ab und zu' },
        sometimes: { fr: 'Parfois', en: 'Sometimes', nl: 'Soms', de: 'Manchmal' },
        sometimesDesc: { fr: 'Quelques fois par mois', en: 'Few times a month', nl: 'Een paar keer per maand', de: 'Ein paar Mal im Monat' },
        often: { fr: 'Souvent', en: 'Often', nl: 'Vaak', de: 'Oft' },
        oftenDesc: { fr: 'Quelques fois par semaine', en: 'Few times a week', nl: 'Een paar keer per week', de: 'Ein paar Mal pro Woche' },
        daily: { fr: 'Quotidien', en: 'Daily', nl: 'Dagelijks', de: 'Täglich' },
        dailyDesc: { fr: 'Tous les jours ou presque', en: 'Every day or almost', nl: 'Elke dag of bijna', de: 'Jeden Tag oder fast' },
      },
      flatmateMeetups: {
        title: { fr: 'Ouvert aux rencontres entre résidents', en: 'Open to Flatmate Meetups', nl: 'Open voor huisgenotenbijeenkomsten', de: 'Offen für Mitbewohner-Treffen' },
        description: { fr: 'Traîner, regarder des films, soirées jeux, etc.', en: 'Hang out, watch movies, game nights, etc.', nl: 'Rondhangen, films kijken, spelletjesavonden, etc.', de: 'Abhängen, Filme schauen, Spieleabende, usw.' },
      },
      groupActivities: {
        title: { fr: 'Intérêt pour les activités de groupe', en: 'Group Activities Interest', nl: 'Interesse in groepsactiviteiten', de: 'Interesse an Gruppenaktivitäten' },
        subtitle: { fr: 'À quel point es-tu intéressé par les activités de groupe avec tes résidents ?', en: 'How interested are you in group activities with flatmates?', nl: 'Hoe geïnteresseerd ben je in groepsactiviteiten met huisgenoten?', de: 'Wie interessiert sind Sie an Gruppenaktivitäten mit Mitbewohnern?' },
        notInterested: { fr: 'Pas intéressé', en: 'Not Interested', nl: 'Niet geïnteresseerd', de: 'Nicht interessiert' },
        notInterestedDesc: { fr: 'Je préfère les activités en solo', en: 'I prefer solo activities', nl: 'Ik geef de voorkeur aan solo-activiteiten', de: 'Ich bevorzuge Solo-Aktivitäten' },
        occasionally: { fr: 'Occasionnellement', en: 'Occasionally', nl: 'Af en toe', de: 'Gelegentlich' },
        occasionallyDesc: { fr: 'De temps en temps c\'est bien', en: 'Once in a while is nice', nl: 'Af en toe is leuk', de: 'Ab und zu ist schön' },
        regularly: { fr: 'Régulièrement', en: 'Regularly', nl: 'Regelmatig', de: 'Regelmäßig' },
        regularlyDesc: { fr: 'J\'aime les activités de groupe', en: 'I enjoy group activities', nl: 'Ik geniet van groepsactiviteiten', de: 'Ich genieße Gruppenaktivitäten' },
        veryActive: { fr: 'Très actif', en: 'Very Active', nl: 'Zeer actief', de: 'Sehr aktiv' },
        veryActiveDesc: { fr: 'J\'adore organiser des événements !', en: 'I love organizing events!', nl: 'Ik hou van evenementen organiseren!', de: 'Ich liebe es, Events zu organisieren!' },
      },
      examples: {
        title: { fr: 'Exemples d\'activités communautaires', en: 'Examples of Community Activities', nl: 'Voorbeelden van gemeenschapsactiviteiten', de: 'Beispiele für Gemeinschaftsaktivitäten' },
        workout: { fr: 'Séances d\'entraînement ensemble', en: 'Workout sessions together', nl: 'Samen trainen', de: 'Gemeinsam trainieren' },
        movieNights: { fr: 'Soirées films ou jeux', en: 'Movie nights or game nights', nl: 'Film- of spelletjesavonden', de: 'Film- oder Spieleabende' },
        cooking: { fr: 'Cuisiner ensemble ou potlucks', en: 'Cooking together or potlucks', nl: 'Samen koken of potlucks', de: 'Zusammen kochen oder Potlucks' },
        exploring: { fr: 'Explorer la ville ensemble', en: 'Exploring the city together', nl: 'Samen de stad verkennen', de: 'Die Stadt gemeinsam erkunden' },
        studying: { fr: 'Sessions d\'étude ou coworking', en: 'Study sessions or co-working', nl: 'Studiesessies of co-working', de: 'Lernsitzungen oder Co-Working' },
      },
    },
    // Financial Page
    financial: {
      title: { fr: 'Informations financières', en: 'Financial Information', nl: 'Financiële informatie', de: 'Finanzielle Informationen' },
      description: { fr: 'Informations optionnelles pour aider les propriétaires à comprendre votre situation financière', en: 'Optional information to help landlords understand your financial situation', nl: 'Optionele informatie om verhuurders te helpen je financiële situatie te begrijpen', de: 'Optionale Informationen, um Vermietern zu helfen, Ihre finanzielle Situation zu verstehen' },
      income: {
        label: { fr: 'Tranche de revenus mensuel', en: 'Monthly income range', nl: 'Maandelijks inkomensbereik', de: 'Monatliche Einkommensspanne' },
      },
      guarantor: {
        title: { fr: 'J\'ai un garant disponible', en: 'I have a guarantor available', nl: 'Ik heb een borg beschikbaar', de: 'Ich habe einen Bürgen verfügbar' },
        description: { fr: 'Quelqu\'un qui peut se porter garant des paiements de loyer', en: 'Someone who can vouch for rent payments', nl: 'Iemand die kan instaan voor huurbetalingen', de: 'Jemand, der für Mietzahlungen bürgen kann' },
      },
      employment: {
        label: { fr: 'Type d\'emploi', en: 'Employment type', nl: 'Type werkgelegenheid', de: 'Beschäftigungsart' },
        fullTime: { fr: 'Temps plein', en: 'Full-time', nl: 'Voltijds', de: 'Vollzeit' },
        partTime: { fr: 'Temps partiel', en: 'Part-time', nl: 'Deeltijds', de: 'Teilzeit' },
        freelance: { fr: 'Freelance', en: 'Freelance', nl: 'Freelance', de: 'Freiberuflich' },
        contract: { fr: 'Contrat', en: 'Contract', nl: 'Contract', de: 'Vertrag' },
        internship: { fr: 'Stage', en: 'Internship', nl: 'Stage', de: 'Praktikum' },
        student: { fr: 'Étudiant', en: 'Student', nl: 'Student', de: 'Student' },
        unemployed: { fr: 'Sans emploi', en: 'Unemployed', nl: 'Werkloos', de: 'Arbeitslos' },
      },
      privacy: {
        title: { fr: 'Ta vie privée compte', en: 'Your privacy matters', nl: 'Je privacy is belangrijk', de: 'Ihre Privatsphäre ist wichtig' },
        description: { fr: 'Ces informations ne sont partagées qu\'avec les propriétaires vérifiés lorsque tu exprimes un intérêt pour leurs résidences. Tu peux les mettre à jour ou les supprimer à tout moment depuis les paramètres de ton profil.', en: "This information is only shared with verified landlords when you express interest in their properties. You can update or remove it anytime from your profile settings.", nl: 'Deze informatie wordt alleen gedeeld met geverifieerde verhuurders wanneer je interesse toont in hun woningen. Je kunt het op elk moment bijwerken of verwijderen via je profielinstellingen.', de: 'Diese Informationen werden nur an verifizierte Vermieter weitergegeben, wenn Sie Interesse an deren Immobilien bekunden. Sie können sie jederzeit in Ihren Profileinstellungen aktualisieren oder entfernen.' },
      },
    },
    // Personality Page
    personality: {
      title: { fr: 'Personnalité étendue', en: 'Extended Personality', nl: 'Uitgebreide persoonlijkheid', de: 'Erweiterte Persönlichkeit' },
      description: { fr: 'Partage plus sur toi-même pour trouver des résidents compatibles', en: 'Share more about yourself to help find compatible roommates', nl: 'Deel meer over jezelf om compatibele huisgenoten te vinden', de: 'Teilen Sie mehr über sich, um kompatible Mitbewohner zu finden' },
      saved: { fr: 'Détails de personnalité enregistrés !', en: 'Personality details saved!', nl: 'Persoonlijkheidsdetails opgeslagen!', de: 'Persönlichkeitsdetails gespeichert!' },
      hobbies: {
        label: { fr: 'Vos hobbies', en: 'Your Hobbies', nl: 'Je hobby\'s', de: 'Ihre Hobbys' },
        placeholder: { fr: 'Ajouter un hobby', en: 'Add a hobby', nl: 'Voeg een hobby toe', de: 'Hobby hinzufügen' },
      },
      interests: {
        label: { fr: 'Vos intérêts', en: 'Your Interests', nl: 'Je interesses', de: 'Ihre Interessen' },
        music: { fr: 'Musique', en: 'Music', nl: 'Muziek', de: 'Musik' },
        sports: { fr: 'Sports', en: 'Sports', nl: 'Sport', de: 'Sport' },
        reading: { fr: 'Lecture', en: 'Reading', nl: 'Lezen', de: 'Lesen' },
        cooking: { fr: 'Cuisine', en: 'Cooking', nl: 'Koken', de: 'Kochen' },
        gaming: { fr: 'Jeux vidéo', en: 'Gaming', nl: 'Gaming', de: 'Gaming' },
        travel: { fr: 'Voyage', en: 'Travel', nl: 'Reizen', de: 'Reisen' },
        art: { fr: 'Art', en: 'Art', nl: 'Kunst', de: 'Kunst' },
        photography: { fr: 'Photographie', en: 'Photography', nl: 'Fotografie', de: 'Fotografie' },
        fitness: { fr: 'Fitness', en: 'Fitness', nl: 'Fitness', de: 'Fitness' },
        movies: { fr: 'Cinéma', en: 'Movies', nl: 'Films', de: 'Filme' },
        technology: { fr: 'Technologie', en: 'Technology', nl: 'Technologie', de: 'Technologie' },
        nature: { fr: 'Nature', en: 'Nature', nl: 'Natuur', de: 'Natur' },
      },
      traits: {
        label: { fr: 'Traits de personnalité', en: 'Personality Traits', nl: 'Persoonlijkheidskenmerken', de: 'Persönlichkeitsmerkmale' },
        outgoing: { fr: 'Extraverti', en: 'Outgoing', nl: 'Extravert', de: 'Kontaktfreudig' },
        introverted: { fr: 'Introverti', en: 'Introverted', nl: 'Introvert', de: 'Introvertiert' },
        creative: { fr: 'Créatif', en: 'Creative', nl: 'Creatief', de: 'Kreativ' },
        organized: { fr: 'Organisé', en: 'Organized', nl: 'Georganiseerd', de: 'Organisiert' },
        spontaneous: { fr: 'Spontané', en: 'Spontaneous', nl: 'Spontaan', de: 'Spontan' },
        relaxed: { fr: 'Détendu', en: 'Relaxed', nl: 'Ontspannen', de: 'Entspannt' },
        ambitious: { fr: 'Ambitieux', en: 'Ambitious', nl: 'Ambitieus', de: 'Ehrgeizig' },
        friendly: { fr: 'Amical', en: 'Friendly', nl: 'Vriendelijk', de: 'Freundlich' },
        independent: { fr: 'Indépendant', en: 'Independent', nl: 'Onafhankelijk', de: 'Unabhängig' },
        teamPlayer: { fr: 'Esprit d\'équipe', en: 'Team Player', nl: 'Teamspeler', de: 'Teamplayer' },
      },
    },
    // Hobbies Page
    hobbies: {
      title: { fr: 'Vos hobbies & Intérêts', en: 'Your Hobbies & Interests', nl: 'Je hobby\'s & Interesses', de: 'Ihre Hobbys & Interessen' },
      description: { fr: 'Aidez-nous à trouver des résidents qui partagent tes passions', en: 'Help us find roommates who share your passions', nl: 'Help ons huisgenoten te vinden die je passies delen', de: 'Helfen Sie uns, Mitbewohner zu finden, die Ihre Leidenschaften teilen' },
      commonHobbies: { fr: 'Sélectionnez parmi les hobbies courants :', en: 'Select from common hobbies:', nl: 'Selecteer uit veelvoorkomende hobby\'s:', de: 'Wählen Sie aus häufigen Hobbys:' },
      addOwn: { fr: 'Ajoute tes propres hobbies :', en: 'Add your own hobbies:', nl: 'Voeg je eigen hobby\'s toe:', de: 'Fügen Sie Ihre eigenen Hobbys hinzu:' },
      placeholder: { fr: 'Ajouter un hobby...', en: 'Add a hobby...', nl: 'Voeg een hobby toe...', de: 'Hobby hinzufügen...' },
      customHobbies: { fr: 'Vos hobbies personnalisés :', en: 'Your custom hobbies:', nl: 'Je aangepaste hobby\'s:', de: 'Ihre benutzerdefinierten Hobbys:' },
      selectedCount: { fr: 'hobby sélectionné', en: 'hobby selected', nl: 'hobby geselecteerd', de: 'Hobby ausgewählt' },
      selectedCountPlural: { fr: 'hobbies sélectionnés', en: 'hobbies selected', nl: 'hobby\'s geselecteerd', de: 'Hobbys ausgewählt' },
      options: {
        reading: { fr: 'Lecture', en: 'Reading', nl: 'Lezen', de: 'Lesen' },
        sports: { fr: 'Sports', en: 'Sports', nl: 'Sport', de: 'Sport' },
        cooking: { fr: 'Cuisine', en: 'Cooking', nl: 'Koken', de: 'Kochen' },
        music: { fr: 'Musique', en: 'Music', nl: 'Muziek', de: 'Musik' },
        movies: { fr: 'Cinéma', en: 'Movies', nl: 'Films', de: 'Filme' },
        gaming: { fr: 'Jeux vidéo', en: 'Gaming', nl: 'Gaming', de: 'Gaming' },
        hiking: { fr: 'Randonnée', en: 'Hiking', nl: 'Wandelen', de: 'Wandern' },
        photography: { fr: 'Photographie', en: 'Photography', nl: 'Fotografie', de: 'Fotografie' },
        travel: { fr: 'Voyage', en: 'Travel', nl: 'Reizen', de: 'Reisen' },
        art: { fr: 'Art', en: 'Art', nl: 'Kunst', de: 'Kunst' },
        yoga: { fr: 'Yoga', en: 'Yoga', nl: 'Yoga', de: 'Yoga' },
        dancing: { fr: 'Danse', en: 'Dancing', nl: 'Dansen', de: 'Tanzen' },
        cycling: { fr: 'Cyclisme', en: 'Cycling', nl: 'Fietsen', de: 'Radfahren' },
        running: { fr: 'Course', en: 'Running', nl: 'Hardlopen', de: 'Laufen' },
        swimming: { fr: 'Natation', en: 'Swimming', nl: 'Zwemmen', de: 'Schwimmen' },
        drawing: { fr: 'Dessin', en: 'Drawing', nl: 'Tekenen', de: 'Zeichnen' },
        writing: { fr: 'Écriture', en: 'Writing', nl: 'Schrijven', de: 'Schreiben' },
        gardening: { fr: 'Jardinage', en: 'Gardening', nl: 'Tuinieren', de: 'Gärtnern' },
      },
    },
  },

  // ============================================================================
  // OWNER DOCUMENTS MODAL
  // ============================================================================
  ownerDocuments: {
    // Modal Header
    generateDocument: {
      fr: 'Générer un document',
      en: 'Generate a document',
      nl: 'Document genereren',
      de: 'Dokument erstellen',
    },
    chooseDocType: {
      fr: 'Choisissez le type de document',
      en: 'Choose the document type',
      nl: 'Kies het documenttype',
      de: 'Wählen Sie den Dokumenttyp',
    },
    selectTenant: {
      fr: 'Sélectionnez le locataire',
      en: 'Select the tenant',
      nl: 'Selecteer de huurder',
      de: 'Mieter auswählen',
    },
    completeInfo: {
      fr: 'Complète les informations',
      en: 'Complete the information',
      nl: 'Vul de informatie in',
      de: 'Informationen vervollständigen',
    },
    generating: {
      fr: 'Génération en cours...',
      en: 'Generating...',
      nl: 'Genereren...',
      de: 'Wird generiert...',
    },
    documentReady: {
      fr: 'Document prêt',
      en: 'Document ready',
      nl: 'Document klaar',
      de: 'Dokument bereit',
    },

    // Document Types
    rentReceipt: {
      fr: 'Quittance de loyer',
      en: 'Rent receipt',
      nl: 'Huurkwitantie',
      de: 'Mietquittung',
    },
    rentReceiptDesc: {
      fr: 'Attestation de paiement du loyer mensuel',
      en: 'Monthly rent payment certificate',
      nl: 'Certificaat maandelijkse huurbetaling',
      de: 'Monatliche Mietzahlungsbescheinigung',
    },
    housingAttestation: {
      fr: 'Attestation d\'hébergement',
      en: 'Housing certificate',
      nl: 'Huisvestingsverklaring',
      de: 'Wohnbescheinigung',
    },
    housingAttestationDesc: {
      fr: 'Certificat de résidence pour démarches administratives',
      en: 'Residence certificate for administrative procedures',
      nl: 'Verblijfsverklaring voor administratieve procedures',
      de: 'Wohnortbescheinigung für Verwaltungsverfahren',
    },
    rentAttestation: {
      fr: 'Attestation de loyer',
      en: 'Rent certificate',
      nl: 'Huurverklaring',
      de: 'Mietbescheinigung',
    },
    rentAttestationDesc: {
      fr: 'Document récapitulatif des conditions locatives',
      en: 'Summary document of rental conditions',
      nl: 'Samenvattend document van huurvoorwaarden',
      de: 'Zusammenfassendes Dokument der Mietbedingungen',
    },

    // Tenant Selection
    noActiveTenant: {
      fr: 'Aucun locataire actif',
      en: 'No active tenant',
      nl: 'Geen actieve huurder',
      de: 'Kein aktiver Mieter',
    },
    loadingTenants: {
      fr: 'Chargement des résidents...',
      en: 'Loading tenants...',
      nl: 'Huurders laden...',
      de: 'Mieter werden geladen...',
    },
    errorLoadingTenants: {
      fr: 'Impossible de charger les résidents',
      en: 'Unable to load tenants',
      nl: 'Kan huurders niet laden',
      de: 'Mieter können nicht geladen werden',
    },
    back: {
      fr: 'Retour',
      en: 'Back',
      nl: 'Terug',
      de: 'Zurück',
    },

    // Form Labels
    period: {
      fr: 'Période',
      en: 'Period',
      nl: 'Periode',
      de: 'Zeitraum',
    },
    paymentDate: {
      fr: 'Date de paiement',
      en: 'Payment date',
      nl: 'Betaaldatum',
      de: 'Zahlungsdatum',
    },
    rent: {
      fr: 'Loyer',
      en: 'Rent',
      nl: 'Huur',
      de: 'Miete',
    },
    charges: {
      fr: 'Charges',
      en: 'Charges',
      nl: 'Servicekosten',
      de: 'Nebenkosten',
    },
    paymentMethod: {
      fr: 'Mode de paiement',
      en: 'Payment method',
      nl: 'Betaalmethode',
      de: 'Zahlungsmethode',
    },
    total: {
      fr: 'Total',
      en: 'Total',
      nl: 'Totaal',
      de: 'Gesamt',
    },
    purposeOptional: {
      fr: 'Motif / Destination (optionnel)',
      en: 'Purpose / Destination (optional)',
      nl: 'Doel / Bestemming (optioneel)',
      de: 'Zweck / Verwendung (optional)',
    },
    purposePlaceholder: {
      fr: 'Ex: Constitution d\'un dossier CAF',
      en: 'Ex: Building a CAF file',
      nl: 'Bv: Samenstellen CAF-dossier',
      de: 'Z.B.: Erstellung einer CAF-Akte',
    },

    // Payment Methods
    bankTransfer: {
      fr: 'Virement bancaire',
      en: 'Bank transfer',
      nl: 'Bankoverschrijving',
      de: 'Banküberweisung',
    },
    check: {
      fr: 'Chèque',
      en: 'Check',
      nl: 'Cheque',
      de: 'Scheck',
    },
    cash: {
      fr: 'Espèces',
      en: 'Cash',
      nl: 'Contant',
      de: 'Bargeld',
    },
    directDebit: {
      fr: 'Prélèvement automatique',
      en: 'Direct debit',
      nl: 'Automatische incasso',
      de: 'Lastschrift',
    },

    // Months
    january: { fr: 'Janvier', en: 'January', nl: 'Januari', de: 'Januar' },
    february: { fr: 'Février', en: 'February', nl: 'Februari', de: 'Februar' },
    march: { fr: 'Mars', en: 'March', nl: 'Maart', de: 'März' },
    april: { fr: 'Avril', en: 'April', nl: 'April', de: 'April' },
    may: { fr: 'Mai', en: 'May', nl: 'Mei', de: 'Mai' },
    june: { fr: 'Juin', en: 'June', nl: 'Juni', de: 'Juni' },
    july: { fr: 'Juillet', en: 'July', nl: 'Juli', de: 'Juli' },
    august: { fr: 'Août', en: 'August', nl: 'Augustus', de: 'August' },
    september: { fr: 'Septembre', en: 'September', nl: 'September', de: 'September' },
    october: { fr: 'Octobre', en: 'October', nl: 'Oktober', de: 'Oktober' },
    november: { fr: 'Novembre', en: 'November', nl: 'November', de: 'November' },
    december: { fr: 'Décembre', en: 'December', nl: 'December', de: 'Dezember' },

    // Actions & Completion
    generatePdf: {
      fr: 'Générer le PDF',
      en: 'Generate PDF',
      nl: 'PDF genereren',
      de: 'PDF erstellen',
    },
    generatingDocument: {
      fr: 'Génération du document...',
      en: 'Generating document...',
      nl: 'Document genereren...',
      de: 'Dokument wird erstellt...',
    },
    documentDownloaded: {
      fr: 'Document téléchargé',
      en: 'Document downloaded',
      nl: 'Document gedownload',
      de: 'Dokument heruntergeladen',
    },
    documentSuccess: {
      fr: 'Votre document a été généré et téléchargé avec succès.',
      en: 'Your document has been generated and downloaded successfully.',
      nl: 'Uw document is succesvol gegenereerd en gedownload.',
      de: 'Ihr Dokument wurde erfolgreich erstellt und heruntergeladen.',
    },
    generateAnother: {
      fr: 'Générer un autre',
      en: 'Generate another',
      nl: 'Nog een genereren',
      de: 'Noch eines erstellen',
    },
    close: {
      fr: 'Fermer',
      en: 'Close',
      nl: 'Sluiten',
      de: 'Schließen',
    },

    // Toasts
    toastSuccess: {
      fr: 'Document généré avec succès',
      en: 'Document generated successfully',
      nl: 'Document succesvol gegenereerd',
      de: 'Dokument erfolgreich erstellt',
    },
    toastError: {
      fr: 'Erreur lors de la génération du document',
      en: 'Error generating document',
      nl: 'Fout bij genereren document',
      de: 'Fehler beim Erstellen des Dokuments',
    },
    unknownDocType: {
      fr: 'Type de document inconnu',
      en: 'Unknown document type',
      nl: 'Onbekend documenttype',
      de: 'Unbekannter Dokumenttyp',
    },
  },

  // ============================================================================
  // OWNER MAINTENANCE
  // ============================================================================
  ownerMaintenance: {
    // Create Ticket Modal
    newMaintenanceRequest: {
      fr: 'Nouvelle demande de maintenance',
      en: 'New maintenance request',
      nl: 'Nieuw onderhoudsverzoek',
      de: 'Neue Wartungsanfrage',
    },
    property: {
      fr: 'Propriété',
      en: 'Property',
      nl: 'Woning',
      de: 'Immobilie',
    },
    selectProperty: {
      fr: 'Sélectionnez une propriété',
      en: 'Select a property',
      nl: 'Selecteer een woning',
      de: 'Wählen Sie eine Immobilie',
    },
    title: {
      fr: 'Titre',
      en: 'Title',
      nl: 'Titel',
      de: 'Titel',
    },
    titlePlaceholder: {
      fr: 'Ex: Fuite d\'eau sous l\'évier',
      en: 'Ex: Water leak under the sink',
      nl: 'Bv: Waterlek onder de gootsteen',
      de: 'Z.B.: Wasserleck unter der Spüle',
    },
    description: {
      fr: 'Description',
      en: 'Description',
      nl: 'Beschrijving',
      de: 'Beschreibung',
    },
    descriptionPlaceholder: {
      fr: 'Décrivez le problème en détail...',
      en: 'Describe the problem in detail...',
      nl: 'Beschrijf het probleem in detail...',
      de: 'Beschreiben Sie das Problem im Detail...',
    },
    category: {
      fr: 'Catégorie',
      en: 'Category',
      nl: 'Categorie',
      de: 'Kategorie',
    },
    priority: {
      fr: 'Priorité',
      en: 'Priority',
      nl: 'Prioriteit',
      de: 'Priorität',
    },
    emergencyWarning: {
      fr: 'Les urgences nécessitent une intervention immédiate (fuite importante, panne de chauffage en hiver, etc.)',
      en: 'Emergencies require immediate intervention (major leak, heating failure in winter, etc.)',
      nl: 'Noodgevallen vereisen onmiddellijke interventie (groot lek, verwarmingsstoring in de winter, etc.)',
      de: 'Notfälle erfordern sofortige Intervention (großes Leck, Heizungsausfall im Winter, etc.)',
    },
    location: {
      fr: 'Emplacement',
      en: 'Location',
      nl: 'Locatie',
      de: 'Standort',
    },
    locationPlaceholder: {
      fr: 'Ex: Salle de bain, Cuisine',
      en: 'Ex: Bathroom, Kitchen',
      nl: 'Bv: Badkamer, Keuken',
      de: 'Z.B.: Badezimmer, Küche',
    },
    estimatedCost: {
      fr: 'Coût estimé',
      en: 'Estimated cost',
      nl: 'Geschatte kosten',
      de: 'Geschätzte Kosten',
    },
    photos: {
      fr: 'Photos',
      en: 'Photos',
      nl: 'Foto\'s',
      de: 'Fotos',
    },
    addPhotos: {
      fr: 'Ajouter des photos',
      en: 'Add photos',
      nl: 'Foto\'s toevoegen',
      de: 'Fotos hinzufügen',
    },
    cancel: {
      fr: 'Annuler',
      en: 'Cancel',
      nl: 'Annuleren',
      de: 'Abbrechen',
    },
    creating: {
      fr: 'Création...',
      en: 'Creating...',
      nl: 'Aanmaken...',
      de: 'Erstellen...',
    },
    createRequest: {
      fr: 'Créer la demande',
      en: 'Create request',
      nl: 'Verzoek aanmaken',
      de: 'Anfrage erstellen',
    },

    // Add Vendor Modal
    addVendor: {
      fr: 'Ajouter un prestataire',
      en: 'Add a vendor',
      nl: 'Leverancier toevoegen',
      de: 'Anbieter hinzufügen',
    },
    registerNewVendor: {
      fr: 'Enregistrez un nouveau prestataire',
      en: 'Register a new vendor',
      nl: 'Registreer een nieuwe leverancier',
      de: 'Neuen Anbieter registrieren',
    },
    vendorName: {
      fr: 'Nom du prestataire',
      en: 'Vendor name',
      nl: 'Naam leverancier',
      de: 'Anbietername',
    },
    vendorNamePlaceholder: {
      fr: 'Ex: Jean Dupont',
      en: 'Ex: John Smith',
      nl: 'Bv: Jan Jansen',
      de: 'Z.B.: Hans Müller',
    },
    companyName: {
      fr: 'Nom de l\'entreprise',
      en: 'Company name',
      nl: 'Bedrijfsnaam',
      de: 'Firmenname',
    },
    companyNamePlaceholder: {
      fr: 'Ex: Plomberie Express SARL',
      en: 'Ex: Express Plumbing LLC',
      nl: 'Bv: Express Loodgieterij BV',
      de: 'Z.B.: Express Sanitär GmbH',
    },
    specialty: {
      fr: 'Spécialité',
      en: 'Specialty',
      nl: 'Specialiteit',
      de: 'Fachgebiet',
    },
    phone: {
      fr: 'Téléphone',
      en: 'Phone',
      nl: 'Telefoon',
      de: 'Telefon',
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
    city: {
      fr: 'Ville',
      en: 'City',
      nl: 'Stad',
      de: 'Stadt',
    },
    postalCode: {
      fr: 'Code postal',
      en: 'Postal code',
      nl: 'Postcode',
      de: 'Postleitzahl',
    },
    siret: {
      fr: 'N° SIRET',
      en: 'Business ID',
      nl: 'KvK-nummer',
      de: 'Handelsregisternummer',
    },
    notes: {
      fr: 'Notes',
      en: 'Notes',
      nl: 'Notities',
      de: 'Notizen',
    },
    notesPlaceholder: {
      fr: 'Notes personnelles sur ce prestataire...',
      en: 'Personal notes about this vendor...',
      nl: 'Persoonlijke notities over deze leverancier...',
      de: 'Persönliche Notizen zu diesem Anbieter...',
    },
    addToFavorites: {
      fr: 'Ajouter aux favoris',
      en: 'Add to favorites',
      nl: 'Toevoegen aan favorieten',
      de: 'Zu Favoriten hinzufügen',
    },
    adding: {
      fr: 'Ajout...',
      en: 'Adding...',
      nl: 'Toevoegen...',
      de: 'Hinzufügen...',
    },
    add: {
      fr: 'Ajouter',
      en: 'Add',
      nl: 'Toevoegen',
      de: 'Hinzufügen',
    },
    vendorAdded: {
      fr: 'Prestataire ajouté !',
      en: 'Vendor added!',
      nl: 'Leverancier toegevoegd!',
      de: 'Anbieter hinzugefügt!',
    },
    vendorAddedToDirectory: {
      fr: 'a été ajouté à votre annuaire.',
      en: 'has been added to your directory.',
      nl: 'is toegevoegd aan uw adresboek.',
      de: 'wurde zu Ihrem Verzeichnis hinzugefügt.',
    },

    // Validation Errors
    nameRequired: {
      fr: 'Le nom est requis',
      en: 'Name is required',
      nl: 'Naam is verplicht',
      de: 'Name ist erforderlich',
    },
    invalidEmail: {
      fr: 'Email invalide',
      en: 'Invalid email',
      nl: 'Ongeldig e-mailadres',
      de: 'Ungültige E-Mail',
    },
    invalidPhone: {
      fr: 'Numéro de téléphone invalide',
      en: 'Invalid phone number',
      nl: 'Ongeldig telefoonnummer',
      de: 'Ungültige Telefonnummer',
    },
    invalidSiret: {
      fr: 'Le SIRET doit contenir 14 chiffres',
      en: 'Business ID must contain 14 digits',
      nl: 'KvK-nummer moet 14 cijfers bevatten',
      de: 'Handelsregisternummer muss 14 Ziffern enthalten',
    },
    mustBeLoggedIn: {
      fr: 'Tu dois être connecté',
      en: 'You must be logged in',
      nl: 'U moet ingelogd zijn',
      de: 'Sie müssen angemeldet sein',
    },
    vendorAddSuccess: {
      fr: 'Prestataire ajouté',
      en: 'Vendor added',
      nl: 'Leverancier toegevoegd',
      de: 'Anbieter hinzugefügt',
    },
    vendorAddError: {
      fr: 'Erreur lors de l\'ajout',
      en: 'Error while adding',
      nl: 'Fout bij toevoegen',
      de: 'Fehler beim Hinzufügen',
    },

    // VendorDirectory
    searchVendor: {
      fr: 'Rechercher un prestataire...',
      en: 'Search for a vendor...',
      nl: 'Zoek een leverancier...',
      de: 'Anbieter suchen...',
    },
    allVendors: {
      fr: 'Tous',
      en: 'All',
      nl: 'Alle',
      de: 'Alle',
    },
    vendorDirectory: {
      fr: 'Annuaire prestataires',
      en: 'Vendor directory',
      nl: 'Leverancierslijst',
      de: 'Anbieterverzeichnis',
    },
    contact: {
      fr: 'contact',
      en: 'contact',
      nl: 'contact',
      de: 'Kontakt',
    },
    contacts: {
      fr: 'contacts',
      en: 'contacts',
      nl: 'contacten',
      de: 'Kontakte',
    },
    noVendorFound: {
      fr: 'Aucun prestataire trouvé',
      en: 'No vendor found',
      nl: 'Geen leverancier gevonden',
      de: 'Kein Anbieter gefunden',
    },
    jobs: {
      fr: 'interventions',
      en: 'jobs',
      nl: 'opdrachten',
      de: 'Aufträge',
    },
    responseTime: {
      fr: 'Rép. ~',
      en: 'Resp. ~',
      nl: 'Ant. ~',
      de: 'Antw. ~',
    },

    // Vendor Specialties
    specialties: {
      plumber: {
        fr: 'Plombier',
        en: 'Plumber',
        nl: 'Loodgieter',
        de: 'Klempner',
      },
      electrician: {
        fr: 'Électricien',
        en: 'Electrician',
        nl: 'Elektricien',
        de: 'Elektriker',
      },
      heatingTech: {
        fr: 'Chauffagiste',
        en: 'Heating technician',
        nl: 'Verwarmingstechnicus',
        de: 'Heizungstechniker',
      },
      appliance: {
        fr: 'Électroménager',
        en: 'Appliance repair',
        nl: 'Huishoudapparatuur',
        de: 'Haushaltsgeräte',
      },
      locksmith: {
        fr: 'Serrurier',
        en: 'Locksmith',
        nl: 'Slotenmaker',
        de: 'Schlosser',
      },
      painter: {
        fr: 'Peintre',
        en: 'Painter',
        nl: 'Schilder',
        de: 'Maler',
      },
      pestControl: {
        fr: 'Désinsectiseur',
        en: 'Pest control',
        nl: 'Ongediertebestrijder',
        de: 'Schädlingsbekämpfer',
      },
      handyman: {
        fr: 'Artisan',
        en: 'Handyman',
        nl: 'Klusjesman',
        de: 'Handwerker',
      },
    },
  },

  // ============================================================================
  // OWNER LEASES
  // ============================================================================
  ownerLeases: {
    // Create Lease Modal
    createLease: {
      fr: 'Créer un contrat',
      en: 'Create a lease',
      nl: 'Huurcontract aanmaken',
      de: 'Mietvertrag erstellen',
    },
    convertToLease: {
      fr: 'Convertir la candidature approuvée en contrat de location',
      en: 'Convert the approved application to a rental contract',
      nl: 'De goedgekeurde aanvraag omzetten in een huurcontract',
      de: 'Die genehmigte Bewerbung in einen Mietvertrag umwandeln',
    },
    tenant: {
      fr: 'Locataire',
      en: 'Tenant',
      nl: 'Huurder',
      de: 'Mieter',
    },
    property: {
      fr: 'Propriété',
      en: 'Property',
      nl: 'Woning',
      de: 'Immobilie',
    },
    moveInDate: {
      fr: 'Date d\'entrée',
      en: 'Move-in date',
      nl: 'Ingangsdatum',
      de: 'Einzugsdatum',
    },
    leaseDuration: {
      fr: 'Durée de séjour',
      en: 'Lease duration',
      nl: 'Huurduur',
      de: 'Mietdauer',
    },
    sixMonths: {
      fr: '6 mois',
      en: '6 months',
      nl: '6 maanden',
      de: '6 Monate',
    },
    oneYear: {
      fr: '1 an',
      en: '1 year',
      nl: '1 jaar',
      de: '1 Jahr',
    },
    twoYears: {
      fr: '2 ans',
      en: '2 years',
      nl: '2 jaar',
      de: '2 Jahre',
    },
    threeYears: {
      fr: '3 ans',
      en: '3 years',
      nl: '3 jaar',
      de: '3 Jahre',
    },
    expectedEndDate: {
      fr: 'Fin prévue:',
      en: 'Expected end:',
      nl: 'Verwachte einddatum:',
      de: 'Voraussichtliches Ende:',
    },
    monthlyRent: {
      fr: 'Loyer mensuel',
      en: 'Monthly rent',
      nl: 'Maandelijkse huur',
      de: 'Monatliche Miete',
    },
    securityDeposit: {
      fr: 'Dépôt de garantie',
      en: 'Security deposit',
      nl: 'Borg',
      de: 'Kaution',
    },
    summary: {
      fr: 'Récapitulatif',
      en: 'Summary',
      nl: 'Samenvatting',
      de: 'Zusammenfassung',
    },
    annualRent: {
      fr: 'Loyer annuel',
      en: 'Annual rent',
      nl: 'Jaarlijkse huur',
      de: 'Jahresmiete',
    },
    totalDuration: {
      fr: 'Durée totale',
      en: 'Total duration',
      nl: 'Totale duur',
      de: 'Gesamtdauer',
    },
    months: {
      fr: 'mois',
      en: 'months',
      nl: 'maanden',
      de: 'Monate',
    },
    cancel: {
      fr: 'Annuler',
      en: 'Cancel',
      nl: 'Annuleren',
      de: 'Abbrechen',
    },
    creating: {
      fr: 'Création...',
      en: 'Creating...',
      nl: 'Aanmaken...',
      de: 'Erstellen...',
    },
    createLeaseBtn: {
      fr: 'Créer le contrat',
      en: 'Create lease',
      nl: 'Huurcontract aanmaken',
      de: 'Mietvertrag erstellen',
    },

    // Validation & Toasts
    validRentRequired: {
      fr: 'Veuillez saisir un loyer mensuel valide',
      en: 'Please enter a valid monthly rent',
      nl: 'Voer een geldige maandelijkse huur in',
      de: 'Bitte geben Sie eine gültige Monatsmiete ein',
    },
    applicantIdMissing: {
      fr: 'ID du candidat manquant',
      en: 'Applicant ID missing',
      nl: 'Aanvrager-ID ontbreekt',
      de: 'Bewerber-ID fehlt',
    },
    leaseCreatedSuccess: {
      fr: 'Contrat créé avec succès !',
      en: 'Lease created successfully!',
      nl: 'Huurcontract succesvol aangemaakt!',
      de: 'Mietvertrag erfolgreich erstellt!',
    },
    nowTenant: {
      fr: 'est maintenant locataire',
      en: 'is now a tenant',
      nl: 'is nu huurder',
      de: 'ist jetzt Mieter',
    },
    leaseCreationError: {
      fr: 'Erreur lors de la création du contrat',
      en: 'Error creating lease',
      nl: 'Fout bij aanmaken huurcontract',
      de: 'Fehler beim Erstellen des Mietvertrags',
    },
  },

  // ============================================================================
  // APPLICATION MODAL
  // ============================================================================
  applicationModal: {
    // Header
    title: {
      fr: 'Postuler pour ce bien',
      en: 'Apply for Property',
      nl: 'Solliciteren voor woning',
      de: 'Für Immobilie bewerben',
    },

    // Section titles
    personalInfo: {
      fr: 'Informations personnelles',
      en: 'Personal Information',
      nl: 'Persoonlijke gegevens',
      de: 'Persönliche Daten',
    },
    moveInDetails: {
      fr: 'Détails d\'emménagement',
      en: 'Move-in Details',
      nl: 'Verhuisdetails',
      de: 'Einzugsdetails',
    },
    professionalInfo: {
      fr: 'Informations professionnelles',
      en: 'Professional Information',
      nl: 'Professionele informatie',
      de: 'Berufliche Informationen',
    },

    // Labels
    fullName: {
      fr: 'Nom complet *',
      en: 'Full Name *',
      nl: 'Volledige naam *',
      de: 'Vollständiger Name *',
    },
    email: {
      fr: 'Email *',
      en: 'Email *',
      nl: 'E-mail *',
      de: 'E-Mail *',
    },
    phone: {
      fr: 'Numéro de téléphone',
      en: 'Phone Number',
      nl: 'Telefoonnummer',
      de: 'Telefonnummer',
    },
    desiredMoveInDate: {
      fr: 'Date d\'emménagement souhaitée',
      en: 'Desired Move-in Date',
      nl: 'Gewenste verhuisdatum',
      de: 'Gewünschtes Einzugsdatum',
    },
    leaseDuration: {
      fr: 'Durée de séjour (mois)',
      en: 'Lease Duration (months)',
      nl: 'Huurduur (maanden)',
      de: 'Mietdauer (Monate)',
    },
    occupation: {
      fr: 'Profession',
      en: 'Occupation',
      nl: 'Beroep',
      de: 'Beruf',
    },
    employerInstitution: {
      fr: 'Employeur/Institution',
      en: 'Employer/Institution',
      nl: 'Werkgever/Instelling',
      de: 'Arbeitgeber/Institution',
    },
    monthlyIncome: {
      fr: 'Revenu mensuel (€)',
      en: 'Monthly Income (€)',
      nl: 'Maandinkomen (€)',
      de: 'Monatliches Einkommen (€)',
    },
    messageToOwner: {
      fr: 'Message au propriétaire (Optionnel)',
      en: 'Message to Owner (Optional)',
      nl: 'Bericht aan eigenaar (Optioneel)',
      de: 'Nachricht an Eigentümer (Optional)',
    },

    // Placeholders
    placeholders: {
      fullName: {
        fr: 'Votre nom complet',
        en: 'Your full name',
        nl: 'Uw volledige naam',
        de: 'Ihr vollständiger Name',
      },
      email: {
        fr: 'votre.email@exemple.com',
        en: 'your.email@example.com',
        nl: 'uw.email@voorbeeld.com',
        de: 'ihre.email@beispiel.de',
      },
      phone: {
        fr: '+32 XXX XX XX XX',
        en: '+32 XXX XX XX XX',
        nl: '+31 6 XXX XX XX',
        de: '+49 XXX XXXXXXX',
      },
      occupation: {
        fr: 'ex. Ingénieur, Étudiant, etc.',
        en: 'e.g., Software Engineer, Student, etc.',
        nl: 'bijv. Ingenieur, Student, etc.',
        de: 'z.B. Ingenieur, Student, etc.',
      },
      employer: {
        fr: 'Nom de l\'entreprise ou université',
        en: 'Company or university name',
        nl: 'Bedrijfs- of universiteitsnaam',
        de: 'Firmen- oder Universitätsname',
      },
      income: {
        fr: 'ex. 2500',
        en: 'e.g., 2500',
        nl: 'bijv. 2500',
        de: 'z.B. 2500',
      },
      message: {
        fr: 'Présente-toi et explique pourquoi ce bien t\'intéresse...',
        en: 'Introduce yourself and explain why you\'re interested in this property...',
        nl: 'Stel uzelf voor en leg uit waarom u geïnteresseerd bent in deze woning...',
        de: 'Stellen Sie sich vor und erklären Sie, warum Sie an dieser Immobilie interessiert sind...',
      },
    },

    // Lease duration options
    leaseOptions: {
      months3: {
        fr: '3 mois',
        en: '3 months',
        nl: '3 maanden',
        de: '3 Monate',
      },
      months6: {
        fr: '6 mois',
        en: '6 months',
        nl: '6 maanden',
        de: '6 Monate',
      },
      months12: {
        fr: '12 mois',
        en: '12 months',
        nl: '12 maanden',
        de: '12 Monate',
      },
      months24: {
        fr: '24 mois',
        en: '24 months',
        nl: '24 maanden',
        de: '24 Monate',
      },
    },

    // Helper texts
    incomeHelper: {
      fr: 'Cette information aide le propriétaire à évaluer votre candidature',
      en: 'This information helps the landlord assess your application',
      nl: 'Deze informatie helpt de verhuurder uw aanvraag te beoordelen',
      de: 'Diese Information hilft dem Vermieter, Ihre Bewerbung zu bewerten',
    },
    messageHelper: {
      fr: 'Un message personnel peut faire ressortir votre candidature',
      en: 'A personal message can help your application stand out',
      nl: 'Een persoonlijk bericht kan uw aanvraag laten opvallen',
      de: 'Eine persönliche Nachricht kann Ihre Bewerbung hervorheben',
    },

    // Disclaimer
    disclaimerNote: {
      fr: 'Note :',
      en: 'Note:',
      nl: 'Opmerking:',
      de: 'Hinweis:',
    },
    disclaimer: {
      fr: 'En soumettant cette candidature, tu confirmes que les informations fournies sont exactes. Le propriétaire examinera ta candidature et te contactera si elle est acceptée.',
      en: 'By submitting this application, you agree that the information provided is accurate. The property owner will review your application and contact you if approved.',
      nl: 'Door deze aanvraag in te dienen, bevestigt u dat de verstrekte informatie correct is. De eigenaar zal uw aanvraag beoordelen en contact met u opnemen indien goedgekeurd.',
      de: 'Mit dem Absenden dieser Bewerbung bestätigen Sie, dass die angegebenen Informationen korrekt sind. Der Eigentümer wird Ihre Bewerbung prüfen und Sie bei Genehmigung kontaktieren.',
    },

    // Buttons
    cancel: {
      fr: 'Annuler',
      en: 'Cancel',
      nl: 'Annuleren',
      de: 'Abbrechen',
    },
    submitting: {
      fr: 'Envoi en cours...',
      en: 'Submitting...',
      nl: 'Indienen...',
      de: 'Wird gesendet...',
    },
    submit: {
      fr: 'Envoyer la candidature',
      en: 'Submit Application',
      nl: 'Aanvraag indienen',
      de: 'Bewerbung absenden',
    },
  },

  // ============================================================================
  // CALENDAR (Event Calendar Component)
  // ============================================================================
  calendar: {
    weekDays: {
      mon: { fr: 'Lun', en: 'Mon', nl: 'Ma', de: 'Mo' },
      tue: { fr: 'Mar', en: 'Tue', nl: 'Di', de: 'Di' },
      wed: { fr: 'Mer', en: 'Wed', nl: 'Wo', de: 'Mi' },
      thu: { fr: 'Jeu', en: 'Thu', nl: 'Do', de: 'Do' },
      fri: { fr: 'Ven', en: 'Fri', nl: 'Vr', de: 'Fr' },
      sat: { fr: 'Sam', en: 'Sat', nl: 'Za', de: 'Sa' },
      sun: { fr: 'Dim', en: 'Sun', nl: 'Zo', de: 'So' },
    },
    noVisitPlanned: {
      fr: 'Aucune visite prévue ce jour',
      en: 'No visit planned for this day',
      nl: 'Geen bezoek gepland voor deze dag',
      de: 'Kein Besuch für diesen Tag geplant',
    },
    moreEvents: {
      fr: 'de plus',
      en: 'more',
      nl: 'meer',
      de: 'mehr',
    },
  },

  // ============================================================================
  // ARIA LABELS (Accessibility)
  // ============================================================================
  ariaLabels: {
    // Common actions
    close: {
      fr: 'Fermer',
      en: 'Close',
      nl: 'Sluiten',
      de: 'Schließen',
    },
    openMenu: {
      fr: 'Ouvrir le menu',
      en: 'Open menu',
      nl: 'Menu openen',
      de: 'Menü öffnen',
    },
    closeMenu: {
      fr: 'Fermer le menu',
      en: 'Close menu',
      nl: 'Menu sluiten',
      de: 'Menü schließen',
    },
    notifications: {
      fr: 'Notifications',
      en: 'Notifications',
      nl: 'Meldingen',
      de: 'Benachrichtigungen',
    },
    settings: {
      fr: 'Paramètres',
      en: 'Settings',
      nl: 'Instellingen',
      de: 'Einstellungen',
    },
    messages: {
      fr: 'Messages',
      en: 'Messages',
      nl: 'Berichten',
      de: 'Nachrichten',
    },
    back: {
      fr: 'Retour',
      en: 'Back',
      nl: 'Terug',
      de: 'Zurück',
    },
    dismiss: {
      fr: 'Masquer',
      en: 'Dismiss',
      nl: 'Negeren',
      de: 'Ausblenden',
    },
    hide: {
      fr: 'Masquer',
      en: 'Hide',
      nl: 'Verbergen',
      de: 'Ausblenden',
    },
    markAsRead: {
      fr: 'Marquer comme lu',
      en: 'Mark as read',
      nl: 'Markeren als gelezen',
      de: 'Als gelesen markieren',
    },
    changeLanguage: {
      fr: 'Changer de langue',
      en: 'Change language',
      nl: 'Taal wijzigen',
      de: 'Sprache ändern',
    },
    changeTheme: {
      fr: 'Changer de thème',
      en: 'Change theme',
      nl: 'Thema wijzigen',
      de: 'Thema wechseln',
    },
    switchToLightMode: {
      fr: 'Passer en mode clair',
      en: 'Switch to light mode',
      nl: 'Overschakelen naar lichte modus',
      de: 'Zu hellem Modus wechseln',
    },
    switchToDarkMode: {
      fr: 'Passer en mode sombre',
      en: 'Switch to dark mode',
      nl: 'Overschakelen naar donkere modus',
      de: 'Zu dunklem Modus wechseln',
    },
    closeModal: {
      fr: 'Fermer la fenêtre',
      en: 'Close modal',
      nl: 'Venster sluiten',
      de: 'Fenster schließen',
    },
    closeFilters: {
      fr: 'Fermer les filtres',
      en: 'Close filters',
      nl: 'Filters sluiten',
      de: 'Filter schließen',
    },
    mobileNavigation: {
      fr: 'Navigation mobile',
      en: 'Mobile navigation',
      nl: 'Mobiele navigatie',
      de: 'Mobile Navigation',
    },

    // SwipeActions
    undo: {
      fr: 'Annuler',
      en: 'Undo',
      nl: 'Ongedaan maken',
      de: 'Rückgängig',
    },
    skip: {
      fr: 'Passer',
      en: 'Skip',
      nl: 'Overslaan',
      de: 'Überspringen',
    },
    superLike: {
      fr: 'Super Like',
      en: 'Super Like',
      nl: 'Super Like',
      de: 'Super Like',
    },
    like: {
      fr: 'Like',
      en: 'Like',
      nl: 'Like',
      de: 'Gefällt mir',
    },

    // Carousel/Calendar navigation
    previousImage: {
      fr: 'Image précédente',
      en: 'Previous image',
      nl: 'Vorige afbeelding',
      de: 'Vorheriges Bild',
    },
    nextImage: {
      fr: 'Image suivante',
      en: 'Next image',
      nl: 'Volgende afbeelding',
      de: 'Nächstes Bild',
    },
    previousMonth: {
      fr: 'Mois précédent',
      en: 'Previous month',
      nl: 'Vorige maand',
      de: 'Vorheriger Monat',
    },
    nextMonth: {
      fr: 'Mois suivant',
      en: 'Next month',
      nl: 'Volgende maand',
      de: 'Nächster Monat',
    },

    // Comparison
    clearComparison: {
      fr: 'Effacer la comparaison',
      en: 'Clear comparison',
      nl: 'Vergelijking wissen',
      de: 'Vergleich löschen',
    },
    removeFromComparison: {
      fr: 'Retirer de la comparaison',
      en: 'Remove from comparison',
      nl: 'Uit vergelijking verwijderen',
      de: 'Aus Vergleich entfernen',
    },

    // Social media
    facebook: {
      fr: 'Facebook',
      en: 'Facebook',
      nl: 'Facebook',
      de: 'Facebook',
    },
    instagram: {
      fr: 'Instagram',
      en: 'Instagram',
      nl: 'Instagram',
      de: 'Instagram',
    },
    linkedIn: {
      fr: 'LinkedIn',
      en: 'LinkedIn',
      nl: 'LinkedIn',
      de: 'LinkedIn',
    },

    // Group roles
    creator: {
      fr: 'Créateur',
      en: 'Creator',
      nl: 'Maker',
      de: 'Ersteller',
    },
    admin: {
      fr: 'Admin',
      en: 'Admin',
      nl: 'Admin',
      de: 'Admin',
    },

    // Form inputs
    verificationCode: {
      fr: 'Code de vérification',
      en: 'Verification code',
      nl: 'Verificatiecode',
      de: 'Verifizierungscode',
    },
    typeLanguage: {
      fr: 'Tapez une langue',
      en: 'Type a language',
      nl: 'Typ een taal',
      de: 'Sprache eingeben',
    },

    // Media controls
    pause: {
      fr: 'Mettre en pause',
      en: 'Pause',
      nl: 'Pauze',
      de: 'Pause',
    },
    autoPlay: {
      fr: 'Lecture automatique',
      en: 'Auto play',
      nl: 'Automatisch afspelen',
      de: 'Automatische Wiedergabe',
    },
    goToImage: {
      fr: "Aller à l'image",
      en: 'Go to image',
      nl: 'Ga naar afbeelding',
      de: 'Gehe zu Bild',
    },
    delete: {
      fr: 'Supprimer',
      en: 'Delete',
      nl: 'Verwijderen',
      de: 'Löschen',
    },

    // Tenant actions
    viewLease: {
      fr: 'Voir le contrat',
      en: 'View lease',
      nl: 'Huurcontract bekijken',
      de: 'Mietvertrag anzeigen',
    },
    sendMessage: {
      fr: 'Envoyer un message',
      en: 'Send message',
      nl: 'Bericht sturen',
      de: 'Nachricht senden',
    },
    viewPayments: {
      fr: 'Voir les paiements',
      en: 'View payments',
      nl: 'Betalingen bekijken',
      de: 'Zahlungen anzeigen',
    },

    // Invitation actions
    resendInvitation: {
      fr: "Renvoyer l'invitation",
      en: 'Resend invitation',
      nl: 'Uitnodiging opnieuw versturen',
      de: 'Einladung erneut senden',
    },
    cancelInvitation: {
      fr: "Annuler l'invitation",
      en: 'Cancel invitation',
      nl: 'Uitnodiging annuleren',
      de: 'Einladung abbrechen',
    },

    // Virtual tour & onboarding
    virtualTour: {
      fr: 'Visite virtuelle',
      en: 'Virtual tour',
      nl: 'Virtuele rondleiding',
      de: 'Virtuelle Tour',
    },
    clickToContinue: {
      fr: 'Cliquez pour continuer',
      en: 'Click to continue',
      nl: 'Klik om door te gaan',
      de: 'Klicken Sie, um fortzufahren',
    },
  },

  // ============================================================================
  // AESTHETIC FILTERS
  // ============================================================================
  aestheticFilters: {
    title: {
      fr: 'Filtres Esthétiques',
      en: 'Aesthetic Filters',
      nl: 'Esthetische Filters',
      de: 'Ästhetische Filter',
    },
    clearAll: {
      fr: 'Tout effacer',
      en: 'Clear all',
      nl: 'Alles wissen',
      de: 'Alles löschen',
    },
    applyFilters: {
      fr: 'Appliquer les filtres',
      en: 'Apply Filters',
      nl: 'Filters toepassen',
      de: 'Filter anwenden',
    },
    reset: {
      fr: 'Réinitialiser',
      en: 'Reset',
      nl: 'Reset',
      de: 'Zurücksetzen',
    },
    // Section titles
    designStyle: {
      fr: 'Style de Design',
      en: 'Design Style',
      nl: 'Designstijl',
      de: 'Designstil',
    },
    naturalLight: {
      fr: 'Lumière Naturelle',
      en: 'Natural Light',
      nl: 'Natuurlijk Licht',
      de: 'Natürliches Licht',
    },
    heatingCooling: {
      fr: 'Chauffage & Climatisation',
      en: 'Heating & Cooling',
      nl: 'Verwarming & Koeling',
      de: 'Heizung & Kühlung',
    },
    furnitureStyle: {
      fr: 'Style de Mobilier',
      en: 'Furniture Style',
      nl: 'Meubelstijl',
      de: 'Möbelstil',
    },
    roomAtmosphere: {
      fr: 'Atmosphère de la Pièce',
      en: 'Room Atmosphere',
      nl: 'Kameratmosfeer',
      de: 'Raumatmosphäre',
    },
    // Labels
    minDesignQuality: {
      fr: 'Qualité de Design Minimum :',
      en: 'Minimum Design Quality:',
      nl: 'Minimum Designkwaliteit:',
      de: 'Mindestdesignqualität:',
    },
    minNaturalLight: {
      fr: 'Lumière Naturelle Minimum :',
      en: 'Minimum Natural Light:',
      nl: 'Minimum Natuurlijk Licht:',
      de: 'Mindestens Natürliches Licht:',
    },
    any: {
      fr: 'Tous',
      en: 'Any',
      nl: 'Alle',
      de: 'Alle',
    },
    basic: {
      fr: 'Basique (1)',
      en: 'Basic (1)',
      nl: 'Basis (1)',
      de: 'Einfach (1)',
    },
    exceptional: {
      fr: 'Exceptionnel (10)',
      en: 'Exceptional (10)',
      nl: 'Uitzonderlijk (10)',
      de: 'Außergewöhnlich (10)',
    },
    dark1: {
      fr: 'Sombre (1)',
      en: 'Dark (1)',
      nl: 'Donker (1)',
      de: 'Dunkel (1)',
    },
    veryBright10: {
      fr: 'Très lumineux (10)',
      en: 'Very Bright (10)',
      nl: 'Zeer helder (10)',
      de: 'Sehr hell (10)',
    },
    // Light levels
    dark: {
      fr: 'Sombre',
      en: 'Dark',
      nl: 'Donker',
      de: 'Dunkel',
    },
    dim: {
      fr: 'Faible',
      en: 'Dim',
      nl: 'Gedempt',
      de: 'Gedimmt',
    },
    moderate: {
      fr: 'Modéré',
      en: 'Moderate',
      nl: 'Matig',
      de: 'Mäßig',
    },
    bright: {
      fr: 'Lumineux',
      en: 'Bright',
      nl: 'Helder',
      de: 'Hell',
    },
    veryBright: {
      fr: 'Très lumineux',
      en: 'Very Bright',
      nl: 'Zeer helder',
      de: 'Sehr hell',
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
