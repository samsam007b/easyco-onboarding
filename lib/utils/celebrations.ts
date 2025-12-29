'use client';

import { toast } from 'sonner';
import confetti from 'canvas-confetti';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'achievement';

interface ToastOptions {
  withConfetti?: boolean;
  confettiType?: 'burst' | 'sides' | 'stars';
  duration?: number;
  description?: string;
}

// Color schemes
const COLORS = {
  searcher: ['#9c5698', '#9D7EE5', '#FFA040', '#FFD700'],
  resident: ['#d9574f', '#ff5b21', '#ff8017', '#FFD700'],
};

// Current variant (can be set from context)
let currentVariant: 'searcher' | 'resident' = 'searcher';

export function setToastVariant(variant: 'searcher' | 'resident') {
  currentVariant = variant;
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
    showToast('achievement', 'Profil complété', {
      withConfetti: true,
      confettiType: 'sides',
      description: 'Tu es maintenant visible par les autres utilisateurs',
    });
  },

  // First match
  firstMatch: () => {
    showToast('achievement', 'Premier match', {
      withConfetti: true,
      confettiType: 'stars',
      description: 'Quelqu\'un est intéressé par ton profil',
    });
  },

  // Application sent
  applicationSent: () => {
    showToast('success', 'Candidature envoyée', {
      withConfetti: true,
      confettiType: 'burst',
      description: 'Les colocataires ont été notifiés',
    });
  },

  // Message sent
  messageSent: () => {
    toast.success('Message envoyé');
  },

  // Search saved
  searchSaved: () => {
    showToast('success', 'Recherche sauvegardée', {
      description: 'Tu recevras des alertes pour les nouvelles colocs',
    });
  },

  // Favorite added
  favoriteAdded: (name?: string) => {
    toast.success(name ? `${name} ajouté aux favoris` : 'Ajouté aux favoris');
  },

  // Visit scheduled
  visitScheduled: () => {
    showToast('success', 'Visite programmée', {
      withConfetti: true,
      description: 'Un rappel te sera envoyé avant la visite',
    });
  },

  // Welcome new user
  welcome: (firstName?: string) => {
    const message = firstName ? `Bienvenue ${firstName}` : 'Bienvenue';
    showToast('success', message, {
      withConfetti: true,
      confettiType: 'stars',
      description: 'Ton compte a été créé avec succès',
    });
  },

  // Onboarding step completed
  stepComplete: (stepName: string) => {
    toast.success(stepName, { duration: 2000 });
  },

  // All checklist items done
  checklistComplete: () => {
    showToast('achievement', 'Toutes les étapes complétées', {
      withConfetti: true,
      confettiType: 'sides',
      description: 'Tu maîtrises maintenant l\'application',
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
