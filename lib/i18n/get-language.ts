'use client';

import { Language } from './translations';

/**
 * Get the current language from localStorage.
 * This is useful for non-hook contexts (callbacks, async functions in hooks).
 * Falls back to 'fr' if not available.
 */
export function getClientLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'fr';
  }

  const savedLang = localStorage.getItem('izzico_language') as Language;
  if (savedLang && ['fr', 'en', 'nl', 'de'].includes(savedLang)) {
    return savedLang;
  }

  return 'fr';
}

/**
 * Hook-safe translations for toast messages
 * These translations can be accessed without using React hooks
 */
export const hookTranslations = {
  favorites: {
    loadFailed: {
      fr: 'Échec du chargement des favoris',
      en: 'Failed to load favorites',
      nl: 'Laden van favorieten mislukt',
      de: 'Laden der Favoriten fehlgeschlagen',
    },
    loginRequired: {
      fr: 'Connectez-vous pour sauvegarder des favoris',
      en: 'Please login to save favorites',
      nl: 'Log in om favorieten op te slaan',
      de: 'Bitte anmelden, um Favoriten zu speichern',
    },
    added: {
      fr: 'Ajouté aux favoris',
      en: 'Added to favorites',
      nl: 'Toegevoegd aan favorieten',
      de: 'Zu Favoriten hinzugefügt',
    },
    alreadyExists: {
      fr: 'Déjà dans les favoris',
      en: 'Already in favorites',
      nl: 'Al in favorieten',
      de: 'Bereits in Favoriten',
    },
    addFailed: {
      fr: 'Échec de l\'ajout aux favoris',
      en: 'Failed to add favorite',
      nl: 'Toevoegen aan favorieten mislukt',
      de: 'Hinzufügen zu Favoriten fehlgeschlagen',
    },
    removed: {
      fr: 'Retiré des favoris',
      en: 'Removed from favorites',
      nl: 'Verwijderd uit favorieten',
      de: 'Aus Favoriten entfernt',
    },
    removeFailed: {
      fr: 'Échec de la suppression du favori',
      en: 'Failed to remove favorite',
      nl: 'Verwijderen uit favorieten mislukt',
      de: 'Entfernen aus Favoriten fehlgeschlagen',
    },
  },
  messages: {
    loadConversationsFailed: {
      fr: 'Échec du chargement des conversations',
      en: 'Failed to load conversations',
      nl: 'Laden van gesprekken mislukt',
      de: 'Laden der Gespräche fehlgeschlagen',
    },
    loadMessagesFailed: {
      fr: 'Échec du chargement des messages',
      en: 'Failed to load messages',
      nl: 'Laden van berichten mislukt',
      de: 'Laden der Nachrichten fehlgeschlagen',
    },
    sendFailed: {
      fr: 'Échec de l\'envoi du message',
      en: 'Failed to send message',
      nl: 'Versturen van bericht mislukt',
      de: 'Senden der Nachricht fehlgeschlagen',
    },
    startConversationFailed: {
      fr: 'Échec du démarrage de la conversation',
      en: 'Failed to start conversation',
      nl: 'Starten van gesprek mislukt',
      de: 'Starten des Gesprächs fehlgeschlagen',
    },
  },
  visits: {
    loadFailed: {
      fr: 'Échec du chargement des visites',
      en: 'Failed to load visits',
      nl: 'Laden van bezoeken mislukt',
      de: 'Laden der Besuche fehlgeschlagen',
    },
    slotUnavailable: {
      fr: 'Ce créneau n\'est plus disponible',
      en: 'This time slot is no longer available',
      nl: 'Dit tijdslot is niet meer beschikbaar',
      de: 'Dieser Zeitslot ist nicht mehr verfügbar',
    },
    bookSuccess: {
      fr: 'Visite réservée ! Le propriétaire confirmera bientôt.',
      en: 'Visit booked successfully! The owner will confirm shortly.',
      nl: 'Bezoek geboekt! De eigenaar bevestigt binnenkort.',
      de: 'Besuch erfolgreich gebucht! Der Eigentümer wird in Kürze bestätigen.',
    },
    bookFailed: {
      fr: 'Échec de la réservation de la visite',
      en: 'Failed to book visit',
      nl: 'Boeken van bezoek mislukt',
      de: 'Buchung des Besuchs fehlgeschlagen',
    },
    cancelled: {
      fr: 'Visite annulée',
      en: 'Visit cancelled',
      nl: 'Bezoek geannuleerd',
      de: 'Besuch abgesagt',
    },
    cancelFailed: {
      fr: 'Échec de l\'annulation de la visite',
      en: 'Failed to cancel visit',
      nl: 'Annuleren van bezoek mislukt',
      de: 'Abbrechen des Besuchs fehlgeschlagen',
    },
    confirmed: {
      fr: 'Visite confirmée',
      en: 'Visit confirmed',
      nl: 'Bezoek bevestigd',
      de: 'Besuch bestätigt',
    },
    confirmFailed: {
      fr: 'Échec de la confirmation de la visite',
      en: 'Failed to confirm visit',
      nl: 'Bevestigen van bezoek mislukt',
      de: 'Bestätigung des Besuchs fehlgeschlagen',
    },
    completed: {
      fr: 'Visite marquée comme terminée',
      en: 'Visit marked as completed',
      nl: 'Bezoek gemarkeerd als voltooid',
      de: 'Besuch als abgeschlossen markiert',
    },
    completeFailed: {
      fr: 'Échec du marquage de la visite comme terminée',
      en: 'Failed to complete visit',
      nl: 'Voltooien van bezoek mislukt',
      de: 'Abschließen des Besuchs fehlgeschlagen',
    },
    feedbackSuccess: {
      fr: 'Merci pour votre avis !',
      en: 'Thank you for your feedback!',
      nl: 'Bedankt voor uw feedback!',
      de: 'Vielen Dank für Ihr Feedback!',
    },
    feedbackFailed: {
      fr: 'Échec de l\'envoi de l\'avis',
      en: 'Failed to submit feedback',
      nl: 'Indienen van feedback mislukt',
      de: 'Absenden des Feedbacks fehlgeschlagen',
    },
    loadSlotsFailed: {
      fr: 'Échec du chargement des créneaux',
      en: 'Failed to load time slots',
      nl: 'Laden van tijdslots mislukt',
      de: 'Laden der Zeitslots fehlgeschlagen',
    },
    loadAvailabilityFailed: {
      fr: 'Échec du chargement des disponibilités',
      en: 'Failed to load availability',
      nl: 'Laden van beschikbaarheid mislukt',
      de: 'Laden der Verfügbarkeit fehlgeschlagen',
    },
    availabilityUpdated: {
      fr: 'Disponibilités mises à jour',
      en: 'Availability updated',
      nl: 'Beschikbaarheid bijgewerkt',
      de: 'Verfügbarkeit aktualisiert',
    },
    availabilityUpdateFailed: {
      fr: 'Échec de la mise à jour des disponibilités',
      en: 'Failed to update availability',
      nl: 'Bijwerken van beschikbaarheid mislukt',
      de: 'Aktualisieren der Verfügbarkeit fehlgeschlagen',
    },
  },
};

/**
 * Get a translation for hooks
 * @param section The section key (favorites, messages, visits)
 * @param key The translation key within the section
 * @returns The translated string in the current language
 */
export function getHookTranslation(
  section: keyof typeof hookTranslations,
  key: string
): string {
  const lang = getClientLanguage();
  const sectionData = hookTranslations[section];
  if (!sectionData) return key;

  const translation = (sectionData as Record<string, Record<Language, string>>)[key];
  if (!translation) return key;

  return translation[lang] || translation['en'] || key;
}
