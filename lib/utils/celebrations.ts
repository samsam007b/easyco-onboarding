'use client';

import { toast } from 'sonner';
import confetti from 'canvas-confetti';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'achievement';
type Language = 'fr' | 'en' | 'nl' | 'de';

interface ToastOptions {
  withConfetti?: boolean;
  confettiType?: 'burst' | 'sides' | 'stars';
  duration?: number;
  description?: string;
}

// =============================================================================
// I18N TRANSLATIONS
// =============================================================================
const translations = {
  profileComplete: {
    title: {
      fr: 'Profil complété',
      en: 'Profile completed',
      nl: 'Profiel voltooid',
      de: 'Profil abgeschlossen',
    },
    description: {
      fr: 'Tu es maintenant visible par les autres utilisateurs',
      en: 'You are now visible to other users',
      nl: 'Je bent nu zichtbaar voor andere gebruikers',
      de: 'Du bist jetzt für andere Benutzer sichtbar',
    },
  },
  firstMatch: {
    title: {
      fr: 'Premier match',
      en: 'First match',
      nl: 'Eerste match',
      de: 'Erster Match',
    },
    description: {
      fr: 'Quelqu\'un est intéressé par ton profil',
      en: 'Someone is interested in your profile',
      nl: 'Iemand is geïnteresseerd in je profiel',
      de: 'Jemand interessiert sich für dein Profil',
    },
  },
  applicationSent: {
    title: {
      fr: 'Candidature envoyée',
      en: 'Application sent',
      nl: 'Aanvraag verzonden',
      de: 'Bewerbung gesendet',
    },
    description: {
      fr: 'Les colocataires ont été notifiés',
      en: 'The roommates have been notified',
      nl: 'De huisgenoten zijn op de hoogte gebracht',
      de: 'Die Mitbewohner wurden benachrichtigt',
    },
  },
  messageSent: {
    fr: 'Message envoyé',
    en: 'Message sent',
    nl: 'Bericht verzonden',
    de: 'Nachricht gesendet',
  },
  searchSaved: {
    title: {
      fr: 'Recherche sauvegardée',
      en: 'Search saved',
      nl: 'Zoekopdracht opgeslagen',
      de: 'Suche gespeichert',
    },
    description: {
      fr: 'Tu recevras des alertes pour les nouvelles colocs',
      en: 'You will receive alerts for new colivings',
      nl: 'Je ontvangt meldingen voor nieuwe colivings',
      de: 'Du erhältst Benachrichtigungen für neue WGs',
    },
  },
  favoriteAdded: {
    fr: (name?: string) => name ? `${name} ajouté aux favoris` : 'Ajouté aux favoris',
    en: (name?: string) => name ? `${name} added to favorites` : 'Added to favorites',
    nl: (name?: string) => name ? `${name} toegevoegd aan favorieten` : 'Toegevoegd aan favorieten',
    de: (name?: string) => name ? `${name} zu Favoriten hinzugefügt` : 'Zu Favoriten hinzugefügt',
  },
  visitScheduled: {
    title: {
      fr: 'Visite programmée',
      en: 'Visit scheduled',
      nl: 'Bezoek gepland',
      de: 'Besuch geplant',
    },
    description: {
      fr: 'Un rappel te sera envoyé avant la visite',
      en: 'A reminder will be sent before the visit',
      nl: 'Een herinnering wordt voor het bezoek verzonden',
      de: 'Eine Erinnerung wird vor dem Besuch gesendet',
    },
  },
  welcome: {
    title: {
      fr: (firstName?: string) => firstName ? `Bienvenue ${firstName}` : 'Bienvenue',
      en: (firstName?: string) => firstName ? `Welcome ${firstName}` : 'Welcome',
      nl: (firstName?: string) => firstName ? `Welkom ${firstName}` : 'Welkom',
      de: (firstName?: string) => firstName ? `Willkommen ${firstName}` : 'Willkommen',
    },
    description: {
      fr: 'Ton compte a été créé avec succès',
      en: 'Your account was created successfully',
      nl: 'Je account is succesvol aangemaakt',
      de: 'Dein Konto wurde erfolgreich erstellt',
    },
  },
  checklistComplete: {
    title: {
      fr: 'Toutes les étapes complétées',
      en: 'All steps completed',
      nl: 'Alle stappen voltooid',
      de: 'Alle Schritte abgeschlossen',
    },
    description: {
      fr: 'Tu maîtrises maintenant l\'application',
      en: 'You now master the application',
      nl: 'Je beheerst nu de applicatie',
      de: 'Du beherrschst jetzt die Anwendung',
    },
  },
};

// Color schemes
const COLORS = {
  searcher: ['#9c5698', '#9D7EE5', '#FFA040', '#FFD700'],
  resident: ['#e05747', '#ff651e', '#ff9014', '#FFD700'], // Option C palette
};

// Current variant (can be set from context)
let currentVariant: 'searcher' | 'resident' = 'searcher';
let currentLanguage: Language = 'fr';

export function setToastVariant(variant: 'searcher' | 'resident') {
  currentVariant = variant;
}

export function setToastLanguage(language: Language) {
  currentLanguage = language;
}

// Fire confetti effects
function fireConfetti(type: 'burst' | 'sides' | 'stars' = 'burst') {
  const colors = COLORS[currentVariant];

  switch (type) {
    case 'burst':
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });
      break;

    case 'sides':
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      break;

    case 'stars':
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { y: 0.5 },
        shapes: ['star'],
        colors,
      });
      break;
  }
}

// Styled toast with optional confetti
export function showToast(
  type: ToastType,
  message: string,
  options: ToastOptions = {}
) {
  const { withConfetti = false, confettiType = 'burst', duration, description } = options;

  // Fire confetti first for visual sync
  if (withConfetti) {
    fireConfetti(confettiType);
  }

  // Show toast based on type
  switch (type) {
    case 'success':
      toast.success(message, { duration, description });
      break;
    case 'error':
      toast.error(message, { duration, description });
      break;
    case 'info':
      toast.info(message, { duration, description });
      break;
    case 'warning':
      toast.warning(message, { duration, description });
      break;
    case 'achievement':
      // Achievement uses custom styling with celebration
      toast.success(message, {
        duration: duration || 5000,
        description,
      });
      if (!withConfetti) {
        fireConfetti('sides');
      }
      break;
  }
}

// Convenience methods
export const celebrateToast = {
  // Simple success with confetti
  success: (message: string, description?: string) => {
    showToast('success', message, { withConfetti: true, description });
  },

  // Achievement unlocked (major milestone)
  achievement: (message: string, description?: string) => {
    showToast('achievement', message, { withConfetti: true, confettiType: 'sides', description });
  },

  // Profile completed
  profileComplete: () => {
    const t = translations.profileComplete;
    showToast('achievement', t.title[currentLanguage], {
      withConfetti: true,
      confettiType: 'sides',
      description: t.description[currentLanguage],
    });
  },

  // First match
  firstMatch: () => {
    const t = translations.firstMatch;
    showToast('achievement', t.title[currentLanguage], {
      withConfetti: true,
      confettiType: 'stars',
      description: t.description[currentLanguage],
    });
  },

  // Application sent
  applicationSent: () => {
    const t = translations.applicationSent;
    showToast('success', t.title[currentLanguage], {
      withConfetti: true,
      confettiType: 'burst',
      description: t.description[currentLanguage],
    });
  },

  // Message sent
  messageSent: () => {
    toast.success(translations.messageSent[currentLanguage]);
  },

  // Search saved
  searchSaved: () => {
    const t = translations.searchSaved;
    showToast('success', t.title[currentLanguage], {
      description: t.description[currentLanguage],
    });
  },

  // Favorite added
  favoriteAdded: (name?: string) => {
    toast.success(translations.favoriteAdded[currentLanguage](name));
  },

  // Visit scheduled
  visitScheduled: () => {
    const t = translations.visitScheduled;
    showToast('success', t.title[currentLanguage], {
      withConfetti: true,
      description: t.description[currentLanguage],
    });
  },

  // Welcome new user
  welcome: (firstName?: string) => {
    const t = translations.welcome;
    const message = t.title[currentLanguage](firstName);
    showToast('success', message, {
      withConfetti: true,
      confettiType: 'stars',
      description: t.description[currentLanguage],
    });
  },

  // Onboarding step completed
  stepComplete: (stepName: string) => {
    toast.success(stepName, { duration: 2000 });
  },

  // All checklist items done
  checklistComplete: () => {
    const t = translations.checklistComplete;
    showToast('achievement', t.title[currentLanguage], {
      withConfetti: true,
      confettiType: 'sides',
      description: t.description[currentLanguage],
    });
  },
};

// Regular toast shortcuts (no celebration)
export const quickToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),
  loading: (message: string) => toast.loading(message),
  dismiss: (id?: string | number) => toast.dismiss(id),
  promise: toast.promise,
};
