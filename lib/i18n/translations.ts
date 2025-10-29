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
          fr: 'Vérifications Systématiques',
          en: 'Systematic Verification',
          nl: 'Systematische Verificatie',
          de: 'Systematische Überprüfung',
        },
        description: {
          fr: 'Identité et annonces vérifiées manuellement. Toute annonce signalée retirée sous 24h.',
          en: 'Manually verified identities and listings. Any reported listing removed within 24h.',
          nl: 'Handmatig geverifieerde identiteiten en advertenties. Gemelde advertenties binnen 24u verwijderd.',
          de: 'Manuell verifizierte Identitäten und Anzeigen. Gemeldete Anzeigen innerhalb von 24h entfernt.',
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
          fr: 'Crée ton profil',
          en: 'Create your profile',
          nl: 'Maak je profiel',
          de: 'Erstelle dein Profil',
        },
        description: {
          fr: 'Réponds à 15 questions sur ton lifestyle et tes préférences pour que notre algorithme puisse te proposer les meilleurs matchs.',
          en: 'Answer 15 questions about your lifestyle and preferences so our algorithm can suggest the best matches for you.',
          nl: 'Beantwoord 15 vragen over je levensstijl en voorkeuren zodat ons algoritme de beste matches voor je kan voorstellen.',
          de: 'Beantworte 15 Fragen zu deinem Lebensstil und deinen Präferenzen, damit unser Algorithmus die besten Matches für dich vorschlagen kann.',
        },
      },
      step2: {
        title: {
          fr: 'Découvre tes matchs',
          en: 'Discover your matches',
          nl: 'Ontdek je matches',
          de: 'Entdecke deine Matches',
        },
        description: {
          fr: 'Notre algorithme te propose des colocataires compatibles avec ton mode de vie, tes horaires et tes valeurs. Plus besoin de deviner.',
          en: 'Our algorithm suggests flatmates compatible with your lifestyle, schedule, and values. No more guessing.',
          nl: 'Ons algoritme stelt huisgenoten voor die compatibel zijn met je levensstijl, schema en waarden. Niet meer gissen.',
          de: 'Unser Algorithmus schlägt Mitbewohner vor, die mit deinem Lebensstil, Zeitplan und Werten kompatibel sind. Kein Raten mehr.',
        },
      },
      step3: {
        title: {
          fr: 'Rejoins un groupe',
          en: 'Join a group',
          nl: 'Sluit je aan bij een groep',
          de: 'Tritt einer Gruppe bei',
        },
        description: {
          fr: 'Connecte-toi avec 2-4 personnes qui te ressemblent et cherchez ensemble. C\'est 3x plus rapide et beaucoup plus simple.',
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
        fr: 'EasyCo en chiffres',
        en: 'EasyCo by the numbers',
        nl: 'EasyCo in cijfers',
        de: 'EasyCo in Zahlen',
      },
      subtitle: {
        fr: 'Rejoins des milliers d\'utilisateurs satisfaits',
        en: 'Join thousands of satisfied users',
        nl: 'Sluit je aan bij duizenden tevreden gebruikers',
        de: 'Schließe dich Tausenden zufriedener Nutzer an',
      },
      properties: {
        fr: 'Annonces à Bruxelles',
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
          fr: 'J\'ai trouvé mes colocataires en moins de 2 semaines grâce à EasyCo. Le matching est vraiment précis, on s\'entend super bien ! Plus besoin de passer des heures sur des sites douteux.',
          en: 'I found my flatmates in less than 2 weeks thanks to EasyCo. The matching is really accurate, we get along great! No more spending hours on dodgy sites.',
          nl: 'Ik vond mijn huisgenoten in minder dan 2 weken dankzij EasyCo. De matching is echt nauwkeurig, we kunnen het geweldig vinden! Niet meer uren spenderen op dubieuze sites.',
          de: 'Ich habe meine Mitbewohner in weniger als 2 Wochen dank EasyCo gefunden. Das Matching ist wirklich genau, wir verstehen uns super! Keine Stunden mehr auf dubiosen Seiten verbringen.',
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
          fr: 'Fini les arnaques et les mauvaises surprises. Avec EasyCo, tous les profils sont vérifiés et les annonces sont authentiques. J\'ai trouvé une coloc en 3 semaines, c\'est incroyable.',
          en: 'No more scams and bad surprises. With EasyCo, all profiles are verified and listings are authentic. I found a flatshare in 3 weeks, it\'s amazing.',
          nl: 'Geen oplichting en slechte verrassingen meer. Met EasyCo zijn alle profielen geverifieerd en advertenties authentiek. Ik vond een flatshare in 3 weken, het is geweldig.',
          de: 'Keine Betrügereien und schlechten Überraschungen mehr. Mit EasyCo sind alle Profile verifiziert und Anzeigen authentisch. Ich fand eine WG in 3 Wochen, es ist unglaublich.',
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
        fr: 'Tout ce que vous devez savoir',
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
          fr: 'Nous vérifions manuellement chaque document d\'identité soumis. Notre équipe examine votre passeport, carte d\'identité ou permis de conduire pour s\'assurer qu\'il s\'agit bien de vous. Ce processus prend généralement 24-48 heures.',
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
          fr: 'L\'inscription et la création de profil sont entièrement gratuites. Vous pouvez parcourir les annonces, créer votre profil et recevoir des matchs sans aucun frais. Nous proposons également des fonctionnalités premium pour accélérer votre recherche.',
          en: 'Registration and profile creation are completely free. You can browse listings, create your profile, and receive matches at no cost. We also offer premium features to speed up your search.',
          nl: 'Registratie en profielcreatie zijn volledig gratis. Je kunt advertenties bekijken, je profiel aanmaken en matches ontvangen zonder kosten. We bieden ook premium functies om je zoektocht te versnellen.',
          de: 'Registrierung und Profilerstellung sind völlig kostenlos. Sie können Anzeigen durchsuchen, Ihr Profil erstellen und Matches ohne Kosten erhalten. Wir bieten auch Premium-Funktionen, um Ihre Suche zu beschleunigen.',
        },
      },
      question3: {
        q: {
          fr: 'Comment fonctionne le matching ?',
          en: 'How does the matching work?',
          nl: 'Hoe werkt de matching?',
          de: 'Wie funktioniert das Matching?',
        },
        a: {
          fr: 'Notre algorithme analyse vos réponses à 15 questions sur votre lifestyle, vos horaires, vos habitudes et vos valeurs. Il compare ensuite ces données avec celles des autres utilisateurs pour vous proposer les personnes les plus compatibles avec vous.',
          en: 'Our algorithm analyzes your answers to 15 questions about your lifestyle, schedule, habits, and values. It then compares this data with other users to suggest the most compatible people for you.',
          nl: 'Ons algoritme analyseert je antwoorden op 15 vragen over je levensstijl, schema, gewoonten en waarden. Het vergelijkt deze gegevens vervolgens met andere gebruikers om de meest compatibele mensen voor je voor te stellen.',
          de: 'Unser Algorithmus analysiert Ihre Antworten auf 15 Fragen zu Ihrem Lebensstil, Zeitplan, Gewohnheiten und Werten. Er vergleicht dann diese Daten mit anderen Nutzern, um Ihnen die kompatibelsten Personen vorzuschlagen.',
        },
      },
      question4: {
        q: {
          fr: 'Puis-je faire confiance aux annonces ?',
          en: 'Can I trust the listings?',
          nl: 'Kan ik de advertenties vertrouwen?',
          de: 'Kann ich den Anzeigen vertrauen?',
        },
        a: {
          fr: 'Oui, toutes les annonces sont vérifiées par notre équipe. Nous vérifions l\'identité des propriétaires et la validité de leurs documents. De plus, nous avons un système de signalement en 1 clic si vous détectez quelque chose de suspect.',
          en: 'Yes, all listings are verified by our team. We verify the identity of owners and the validity of their documents. Additionally, we have a 1-click reporting system if you detect something suspicious.',
          nl: 'Ja, alle advertenties worden geverifieerd door ons team. We verifiëren de identiteit van eigenaren en de geldigheid van hun documenten. Bovendien hebben we een rapportagesysteem met 1 klik als je iets verdachts detecteert.',
          de: 'Ja, alle Anzeigen werden von unserem Team verifiziert. Wir überprüfen die Identität der Eigentümer und die Gültigkeit ihrer Dokumente. Außerdem haben wir ein 1-Klick-Meldesystem, wenn Sie etwas Verdächtiges entdecken.',
        },
      },
      question5: {
        q: {
          fr: 'Comment rejoindre un groupe ?',
          en: 'How do I join a group?',
          nl: 'Hoe sluit ik me aan bij een groep?',
          de: 'Wie trete ich einer Gruppe bei?',
        },
        a: {
          fr: 'Une fois votre profil créé, notre algorithme vous proposera des groupes de 2-4 personnes compatibles avec vous. Vous pouvez parcourir ces groupes, voir leurs profils et demander à les rejoindre. C\'est aussi simple que ça !',
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
          fr: 'Notre équipe support est disponible 24/7 pour vous aider. Vous pouvez nous contacter via le chat en direct, par email ou par téléphone. Nous nous engageons à résoudre tous les problèmes dans les 24 heures.',
          en: 'Our support team is available 24/7 to help you. You can contact us via live chat, email, or phone. We are committed to resolving all issues within 24 hours.',
          nl: 'Ons supportteam is 24/7 beschikbaar om je te helpen. Je kunt contact met ons opnemen via livechat, e-mail of telefoon. We zijn toegewijd om alle problemen binnen 24 uur op te lossen.',
          de: 'Unser Support-Team ist 24/7 verfügbar, um Ihnen zu helfen. Sie können uns über Live-Chat, E-Mail oder Telefon kontaktieren. Wir verpflichten uns, alle Probleme innerhalb von 24 Stunden zu lösen.',
        },
      },
      contactTitle: {
        fr: 'Vous avez d\'autres questions ?',
        en: 'Have more questions?',
        nl: 'Heb je meer vragen?',
        de: 'Haben Sie weitere Fragen?',
      },
      contactSubtitle: {
        fr: 'Notre équipe est là pour vous aider',
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

  cookies: {
    banner: {
      title: {
        fr: 'Nous utilisons des cookies',
        en: 'We use cookies',
        nl: 'Wij gebruiken cookies',
        de: 'Wir verwenden Cookies',
      },
      description: {
        fr: 'Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. En cliquant sur "Accepter", vous consentez à notre utilisation des cookies.',
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
      fr: 'Que souhaitez-vous faire aujourd\'hui ?',
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
        fr: 'Trouver une coloc fiable et compatible',
        en: 'Find a reliable and compatible flatshare',
        nl: 'Vind een betrouwbare en compatibele flatshare',
        de: 'Finde eine zuverlässige und kompatible WG',
      },
    },
    owner: {
      title: {
        fr: 'Je loue mon bien',
        en: 'I\'m renting out my property',
        nl: 'Ik verhuur mijn woning',
        de: 'Ich vermiete meine Immobilie',
      },
      description: {
        fr: 'Gérer mes biens et trouver des locataires',
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
        fr: 'Accéder à mon espace de colocation',
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
      fr: 'Vous pourrez toujours changer de rôle plus tard dans les paramètres',
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

      // Owner About Page
      about: {
        title: {
          fr: 'Parlez-nous de vous',
          en: 'Tell us about yourself',
          nl: 'Vertel ons over jezelf',
          de: 'Erzählen Sie uns von sich',
        },
        subtitle: {
          fr: 'Cela nous aide à personnaliser votre expérience d\'hébergement.',
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
          fr: 'Je possède et gère mon propre bien',
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
          fr: 'Je gère plusieurs biens de manière professionnelle',
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
          fr: 'Entrez le nom de votre entreprise ou agence',
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
          fr: 'Depuis combien de temps êtes-vous hôte?',
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
          fr: '💡 Astuce : Les profils complets reçoivent 3 fois plus de demandes de locataires en moyenne.',
          en: '💡 Tip: Complete profiles receive 3x more tenant inquiries on average.',
          nl: '💡 Tip: Volledige profielen ontvangen gemiddeld 3x meer huurdersvragen.',
          de: '💡 Tipp: Vollständige Profile erhalten durchschnittlich 3x mehr Mieteranfragen.',
        },
        errorRequired: {
          fr: 'Veuillez remplir tous les champs obligatoires',
          en: 'Please fill in all required fields',
          nl: 'Vul alle verplichte velden in',
          de: 'Bitte füllen Sie alle Pflichtfelder aus',
        },
        errorCompanyName: {
          fr: 'Veuillez entrer le nom de votre entreprise',
          en: 'Please enter your company name',
          nl: 'Voer je bedrijfsnaam in',
          de: 'Bitte geben Sie Ihren Firmennamen ein',
        },
        loading: {
          fr: 'Chargement de vos informations...',
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
          fr: 'Fournissez vos coordonnées bancaires pour recevoir les paiements de loyer',
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
          fr: 'Vos coordonnées bancaires sont cryptées et stockées en toute sécurité. Elles ne seront utilisées que pour traiter les paiements de loyer des locataires vérifiés.',
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
          fr: 'Parlez-nous de vos projets de location',
          en: 'Let us know about your listing plans',
          nl: 'Laat ons weten over je verhuurplannen',
          de: 'Informieren Sie uns über Ihre Vermietungspläne',
        },
        hasPropertyLabel: {
          fr: 'Avez-vous déjà un bien à louer?',
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
          fr: 'Où se trouve votre propriété?',
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
          fr: 'Espace Coliving',
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
          fr: 'Super! Vous pourrez ajouter les détails complets de la propriété après avoir terminé votre profil.',
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
          fr: 'Complétez votre profil d\'hôte maintenant, et vous pourrez ajouter des annonces de propriétés quand vous serez prêt.',
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
          fr: 'Vérifiez votre profil',
          en: 'Review your profile',
          nl: 'Controleer je profiel',
          de: 'Überprüfen Sie Ihr Profil',
        },
        subtitle: {
          fr: 'Assurez-vous que tout est correct avant de soumettre.',
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
          fr: '✓ Téléchargé',
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
          fr: 'Après soumission, vous pourrez ajouter votre première annonce de propriété !',
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
          fr: 'Bienvenue sur EasyCo ! Votre profil d\'hôte est maintenant actif. Prêt à ajouter votre première annonce de propriété ?',
          en: 'Welcome to EasyCo! Your host profile is now active. Ready to add your first property listing?',
          nl: 'Welkom bij EasyCo! Je hostprofiel is nu actief. Klaar om je eerste eigendomsadvertentie toe te voegen?',
          de: 'Willkommen bei EasyCo! Ihr Gastgeberprofil ist jetzt aktiv. Bereit, Ihre erste Immobilienanzeige hinzuzufügen?',
        },
        stat3xLabel: {
          fr: '3x',
          en: '3x',
          nl: '3x',
          de: '3x',
        },
        stat3xDesc: {
          fr: 'Plus de demandes avec des annonces complètes',
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
          fr: '✨ Améliorez votre profil',
          en: '✨ Enhance Your Profile',
          nl: '✨ Verbeter je profiel',
          de: '✨ Verbessern Sie Ihr Profil',
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
          fr: 'Nous vous enverrons un lien de vérification à votre email',
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
          fr: 'Entrez votre numéro de téléphone',
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
          fr: '⭐ Créez la confiance avec les locataires potentiels',
          en: '⭐ Build trust with potential tenants',
          nl: '⭐ Bouw vertrouwen met potentiële huurders',
          de: '⭐ Vertrauen bei potenziellen Mietern aufbauen',
        },
        whyVerify2: {
          fr: '⭐ Obtenez un placement prioritaire des annonces',
          en: '⭐ Get priority listing placement',
          nl: '⭐ Krijg prioriteit bij advertentievermelding',
          de: '⭐ Erhalten Sie vorrangige Anzeigenplatzierung',
        },
        whyVerify3: {
          fr: '⭐ Débloquez le badge de propriétaire vérifié',
          en: '⭐ Unlock verified landlord badge',
          nl: '⭐ Ontgrendel geverifieerde verhuurdersbadge',
          de: '⭐ Verifiziertes Vermieter-Badge freischalten',
        },
        whyVerify4: {
          fr: '⭐ Respectez les exigences légales',
          en: '⭐ Comply with legal requirements',
          nl: '⭐ Voldoe aan wettelijke vereisten',
          de: '⭐ Erfüllen Sie gesetzliche Anforderungen',
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
          fr: 'Commencez par décrire les bases de votre propriété.',
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
          fr: 'Coliving',
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
          fr: 'De bonnes descriptions aident votre annonce à se démarquer.',
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
          fr: 'Décrivez les meilleures caractéristiques de votre propriété, les commodités à proximité et ce qui la rend spéciale...',
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
          fr: '📸 Photos bientôt disponibles : Vous pourrez ajouter des photos dans la prochaine version !',
          en: '📸 Photos coming soon: You\'ll be able to add photos in the next version!',
          nl: '📸 Foto\'s komen eraan: Je kunt foto\'s toevoegen in de volgende versie!',
          de: '📸 Fotos kommen bald: Sie können in der nächsten Version Fotos hinzufügen!',
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
          fr: 'Fixez des prix compétitifs pour attirer des locataires de qualité.',
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
          fr: '💰 Vous gagnerez environ',
          en: '💰 You\'ll earn approximately',
          nl: '💰 Je verdient ongeveer',
          de: '💰 Sie werden ungefähr verdienen',
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
          fr: 'Vérifiez votre annonce',
          en: 'Review your listing',
          nl: 'Controleer je advertentie',
          de: 'Überprüfen Sie Ihre Anzeige',
        },
        subtitle: {
          fr: 'Assurez-vous que tout est correct avant de publier.',
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
          fr: 'Votre annonce sera en ligne immédiatement et visible aux locataires de qualité.',
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
          fr: 'Publier l\'annonce',
          en: 'Publish Listing',
          nl: 'Advertentie publiceren',
          de: 'Anzeige veröffentlichen',
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
          fr: 'Annonce publiée !',
          en: 'Listing Published!',
          nl: 'Advertentie gepubliceerd!',
          de: 'Anzeige veröffentlicht!',
        },
        subtitle: {
          fr: 'Votre propriété est maintenant en ligne sur EasyCo. Des locataires de qualité peuvent maintenant voir et s\'informer sur votre annonce.',
          en: 'Your property is now live on EasyCo. Quality tenants can now view and inquire about your listing.',
          nl: 'Je eigendom is nu live op EasyCo. Kwaliteitshuurders kunnen nu je advertentie bekijken en erover informeren.',
          de: 'Ihre Immobilie ist jetzt auf EasyCo live. Qualitätsmieter können jetzt Ihre Anzeige ansehen und anfragen.',
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
          fr: '💡 Conseils pro',
          en: '💡 Pro Tips',
          nl: '💡 Pro Tips',
          de: '💡 Profi-Tipps',
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
          fr: 'Besoin d\'aide pour gérer votre annonce ?',
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

    // Home Lifestyle Page
    homeLifestyle: {
      title: {
        fr: 'Style de vie à la maison',
        en: 'Home Lifestyle',
        nl: 'Thuislevensstijl',
        de: 'Zuhause Lebensstil',
      },
      subtitle: {
        fr: 'Vos habitudes font d\'une maison votre chez-vous.',
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
        fr: 'Comment vous connectez-vous avec les autres ?',
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
        fr: 'Dans quelle mesure aimez-vous les interactions sociales ?',
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
        fr: 'Aimez-vous partager des repas, des histoires et des expériences ?',
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
        fr: 'Êtes-vous à l\'aise avec différentes cultures et origines ?',
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

    // Ideal Coliving Page
    idealColiving: {
      title: {
        fr: 'Coliving idéal',
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
        fr: 'Taille de coliving préférée',
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
        fr: 'Tranche d\'âge des colocataires',
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
        fr: 'Recherche de colocataires âgés de',
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
        fr: 'À quel point les espaces de vie partagés sont-ils importants pour vous ?',
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
        fr: 'Ajustez vos préférences à tout moment.',
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
        fr: 'Consultez nos',
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
        fr: 'Requis pour créer votre profil et trouver des matchs. Vos données seront traitées de manière sécurisée conformément au RGPD.',
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
        fr: 'Notre algorithme intelligent suggérera les meilleurs matchs de colocataires basés sur la compatibilité. Fortement recommandé !',
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
        fr: 'Nous ne partageons jamais vos informations personnelles avec des tiers sans consentement. Vous pouvez demander la suppression des données à tout moment.',
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
        fr: 'Les profils vérifiés sont prioritaires dans les matchs.',
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
        fr: 'Nous enverrons un lien de vérification à votre email',
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
        fr: 'Entrez votre numéro de téléphone',
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
        fr: 'Créez de la confiance avec vos futurs colocataires',
        en: 'Build trust with potential flatmates',
        nl: 'Bouw vertrouwen op met potentiële huisgenoten',
        de: 'Bauen Sie Vertrauen zu potenziellen Mitbewohnern auf',
      },
      benefit3: {
        fr: 'Démarquez-vous avec un badge vérifié',
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
    },

    // Review Page
    review: {
      title: {
        fr: 'Vérifiez votre profil',
        en: 'Review Your Profile',
        nl: 'Controleer je profiel',
        de: 'Überprüfen Sie Ihr Profil',
      },
      subtitle: {
        fr: 'Assurez-vous que tout est correct',
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
        fr: 'Coliving idéal',
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
        fr: 'Taille de coliving :',
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
        fr: '✓ Téléchargé',
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
        fr: 'Suivez les étapes pour définir vos préférences.',
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
        fr: 'Connectez-vous à votre compte EasyCo',
        en: 'Sign in to your EasyCo account',
        nl: 'Log in op je EasyCo-account',
        de: 'Melden Sie sich bei Ihrem EasyCo-Konto an',
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
        fr: 'Entrez votre mot de passe',
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
        fr: 'Vous n\'avez pas de compte ?',
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
          fr: 'Veuillez vérifier votre e-mail avant de vous connecter',
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
          fr: 'Veuillez entrer votre mot de passe',
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
        fr: 'Rejoignez EasyCo',
        en: 'Join EasyCo',
        nl: 'Word lid van EasyCo',
        de: 'Tritt EasyCo bei',
      },
      subtitle: {
        fr: 'Commencez votre aventure coliving aujourd\'hui',
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
        fr: 'Lister un bien',
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
        fr: 'Ou inscrivez-vous avec email',
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
        en: 'I agree to EasyCo\'s',
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
        fr: 'Vous avez déjà un compte ?',
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
        tryLogin: {
          fr: 'Veuillez essayer de vous connecter à la place',
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
          fr: 'Veuillez vérifier votre e-mail pour valider votre compte',
          en: 'Please check your email to verify your account',
          nl: 'Controleer je e-mail om je account te verifiëren',
          de: 'Bitte überprüfen Sie Ihre E-Mail, um Ihr Konto zu verifizieren',
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
        fr: 'Pas de souci ! Entrez votre e-mail et nous vous enverrons les instructions',
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
        fr: 'Vous vous souvenez de votre mot de passe ?',
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
          fr: 'Vérifiez votre e-mail',
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
          fr: 'Vous n\'avez pas reçu l\'e-mail ? Vérifiez votre dossier spam ou',
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
          fr: 'Vérifiez votre e-mail pour plus d\'instructions',
          en: 'Check your email for further instructions',
          nl: 'Controleer je e-mail voor verdere instructies',
          de: 'Überprüfen Sie Ihre E-Mail für weitere Anweisungen',
        },
      },
    },

    // Select User Type Page
    selectUserType: {
      title: {
        fr: 'Bienvenue sur EasyCo !',
        en: 'Welcome to EasyCo!',
        nl: 'Welkom bij EasyCo!',
        de: 'Willkommen bei EasyCo!',
      },
      subtitle: {
        fr: 'Parlez-nous de vous pour commencer',
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
        fr: 'Je cherche un espace de coliving ou des colocataires',
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
        fr: 'J\'ai un bien à lister ou gérer',
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
        fr: 'Je vis déjà dans un espace de coliving',
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
        fr: 'Configuration de votre compte...',
        en: 'Setting up your account...',
        nl: 'Je account instellen...',
        de: 'Ihr Konto wird eingerichtet...',
      },
      errors: {
        loginRequired: {
          fr: 'Veuillez vous connecter pour continuer',
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
      welcome: {
        fr: 'Bienvenue,',
        en: 'Welcome back,',
        nl: 'Welkom terug,',
        de: 'Willkommen zurück,',
      },
      welcomeMessage: {
        fr: 'Prêt à trouver votre espace de colocation parfait ?',
        en: 'Ready to find your perfect coliving space?',
        nl: 'Klaar om je perfecte coliving ruimte te vinden?',
        de: 'Bereit, Ihren perfekten Coliving-Raum zu finden?',
      },
      loadingDashboard: {
        fr: 'Chargement de votre tableau de bord...',
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
        fr: 'Complétez votre profil pour augmenter vos chances de trouver le match parfait !',
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
        fr: 'Taille de colocation :',
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
        fr: 'Colocataires âgés de',
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
        fr: 'Trouvez votre match parfait',
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
        fr: 'Commencez à parcourir les propriétés pour trouver votre espace de colocation parfait',
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
        fr: 'Gérez vos propriétés et les candidatures de locataires ici.',
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
        fr: 'Complétez votre profil pour instaurer la confiance avec les locataires potentiels !',
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
        fr: 'Ajoutez votre première propriété pour commencer à recevoir des candidatures de locataires',
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
        fr: 'Voir et modifier vos annonces',
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
        fr: 'Examiner les demandes de locataires',
        en: 'Review tenant requests',
        nl: 'Beoordeel huurders verzoeken',
        de: 'Mietergesuche prüfen',
      },
      updateYourPreferences: {
        fr: 'Mettez à jour vos préférences',
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
        fr: 'Annonces Actives',
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
        fr: 'Connectez-vous avec votre communauté de colocation',
        en: 'Connect with your coliving community',
        nl: 'Verbind met je coliving gemeenschap',
        de: 'Verbinden Sie sich mit Ihrer Coliving-Gemeinschaft',
      },
      communityMember: {
        fr: 'Membre de la Communauté',
        en: 'Community Member',
        nl: 'Gemeenschapslid',
        de: 'Gemeinschaftsmitglied',
      },
      completionMessage: {
        fr: 'Complétez votre profil pour mieux vous connecter avec votre communauté !',
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
        fr: 'Rencontrez vos colocataires',
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
        fr: 'Gérez votre profil et les profils dépendants (famille, amis, etc.)',
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
        fr: 'Votre profil personnel de chercheur',
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
        fr: 'Profils que vous gérez pour la famille ou les amis',
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
        fr: 'Créez un profil pour un enfant, un membre de la famille ou un ami pour qui vous cherchez un logement',
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
        fr: 'Chargement de votre profil...',
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
        fr: 'Ajoutez plus de détails pour augmenter vos chances de trouver le match parfait',
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
        fr: 'Complétez votre profil pour attirer des locataires de qualité et instaurer la confiance',
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
        fr: 'À propos de vous, philosophie d\'hébergement',
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
          fr: 'Annonces Actives',
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
        fr: 'Complétez ces sections pour créer un profil complet et attirer des locataires de qualité',
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
  // RESIDENT ONBOARDING
  // ============================================================================
  resident: {
    // Basic Info Page
    basicInfo: {
      title: {
        fr: 'Faisons connaissance ! 👋',
        en: 'Let\'s get to know you! 👋',
        nl: 'Laten we kennismaken! 👋',
        de: 'Lernen wir uns kennen! 👋',
      },
      subtitle: {
        fr: 'Parlez-nous un peu de vous pour commencer dans votre communauté de colocation',
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
        fr: 'Langues que vous Parlez',
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
        fr: 'Votre Style de Vie 🌟',
        en: 'Your Lifestyle 🌟',
        nl: 'Je Levensstijl 🌟',
        de: 'Ihr Lebensstil 🌟',
      },
      subtitle: {
        fr: 'Aidez-nous à comprendre votre routine quotidienne et vos habitudes',
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
        fr: 'Fumez-vous ?',
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
        fr: 'Votre Personnalité 💫',
        en: 'Your Personality 💫',
        nl: 'Je Persoonlijkheid 💫',
        de: 'Ihre Persönlichkeit 💫',
      },
      subtitle: {
        fr: 'Aidez-nous à vous associer à des colocataires compatibles',
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
        fr: 'À quel point êtes-vous Actif à la Maison ?',
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
        fr: 'Presque Terminé ! 🎉',
        en: 'Almost Done! 🎉',
        nl: 'Bijna Klaar! 🎉',
        de: 'Fast Fertig! 🎉',
      },
      subtitle: {
        fr: 'Parlez-nous de votre situation de logement actuelle',
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
        fr: 'Quand avez-vous emménagé ?',
        en: 'When did you move in?',
        nl: 'Wanneer ben je verhuisd?',
        de: 'Wann sind Sie eingezogen?',
      },
      tellUsAboutYourself: {
        fr: 'Parlez-nous de vous',
        en: 'Tell us about yourself',
        nl: 'Vertel ons over jezelf',
        de: 'Erzählen Sie uns über sich',
      },
      bioPlaceholder: {
        fr: 'Écrivez une courte introduction sur vous, vos intérêts, ce que vous recherchez dans une communauté de colocation... (min 20 caractères)',
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
        fr: 'Partagez vos loisirs et intérêts',
        en: 'Share your hobbies and interests',
        nl: 'Deel je hobby\'s en interesses',
        de: 'Teilen Sie Ihre Hobbys und Interessen',
      },
      tip2: {
        fr: 'Mentionnez ce que vous étudiez ou sur quoi vous travaillez',
        en: 'Mention what you\'re studying or working on',
        nl: 'Vermeld waar je studeert of aan werkt',
        de: 'Erwähnen Sie, was Sie studieren oder woran Sie arbeiten',
      },
      tip3: {
        fr: 'Décrivez quel type d\'ambiance communautaire vous préférez',
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
        fr: 'Finalisation de votre profil...',
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
          fr: 'Veuillez écrire quelque chose sur vous',
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
        fr: 'Parlez-nous de votre situation de logement actuelle et partagez un peu sur vous',
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
        fr: 'Veuillez vérifier vos informations avant de soumettre',
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
        fr: 'Profil Complété ! 🎉',
        en: 'Profile Complete! 🎉',
        nl: 'Profiel Voltooid! 🎉',
        de: 'Profil Abgeschlossen! 🎉',
      },
      subtitle: {
        fr: 'Votre profil de résident a été créé avec succès. Vous pouvez maintenant gérer votre expérience de colocation.',
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
        fr: 'Accédez à votre tableau de bord pour voir les mises à jour et annonces de la communauté',
        en: 'Access your dashboard to view community updates and announcements',
        nl: 'Krijg toegang tot je dashboard om gemeenschap updates en aankondigingen te bekijken',
        de: 'Greifen Sie auf Ihr Dashboard zu, um Community-Updates und Ankündigungen anzuzeigen',
      },
      step2: {
        fr: 'Connectez-vous avec vos colocataires et construisez votre communauté',
        en: 'Connect with your housemates and build your community',
        nl: 'Maak contact met je huisgenoten en bouw je gemeenschap op',
        de: 'Vernetzen Sie sich mit Ihren Mitbewohnern und bauen Sie Ihre Gemeinschaft auf',
      },
      step3: {
        fr: 'Gérez votre profil et vos préférences à tout moment',
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
        fr: 'Conseil : Gardez votre profil à jour pour profiter au maximum de votre expérience de colocation !',
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
