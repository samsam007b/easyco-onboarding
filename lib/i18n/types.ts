// Type definitions for i18n system
export type Language = 'fr' | 'en' | 'nl' | 'de';

export const languages = {
  fr: { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
  en: { code: 'en' as const, name: 'English', flag: '🇬🇧' },
  nl: { code: 'nl' as const, name: 'Nederlands', flag: '🇳🇱' },
  de: { code: 'de' as const, name: 'Deutsch', flag: '🇩🇪' },
} as const;

// Translation structure (will be the same for all languages)
export type Translations = typeof import('./translations').translations;
