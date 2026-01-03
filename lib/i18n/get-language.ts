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
  comparison: {
    maxProperties: {
      fr: 'Tu ne peux comparer que 3 propriétés maximum',
      en: 'You can only compare up to 3 properties',
      nl: 'Je kunt maximaal 3 woningen vergelijken',
      de: 'Du kannst maximal 3 Immobilien vergleichen',
    },
    added: {
      fr: 'Ajouté à la comparaison',
      en: 'Added to comparison',
      nl: 'Toegevoegd aan vergelijking',
      de: 'Zum Vergleich hinzugefügt',
    },
    removed: {
      fr: 'Retiré de la comparaison',
      en: 'Removed from comparison',
      nl: 'Verwijderd uit vergelijking',
      de: 'Aus Vergleich entfernt',
    },
    cleared: {
      fr: 'Sélection effacée',
      en: 'Selection cleared',
      nl: 'Selectie gewist',
      de: 'Auswahl gelöscht',
    },
    minRequired: {
      fr: 'Sélectionne au moins 2 propriétés à comparer',
      en: 'Select at least 2 properties to compare',
      nl: 'Selecteer minstens 2 woningen om te vergelijken',
      de: 'Wähle mindestens 2 Immobilien zum Vergleichen',
    },
  },
  conversations: {
    loadFailed: {
      fr: 'Échec du chargement des conversations',
      en: 'Failed to load conversations',
      nl: 'Laden van gesprekken mislukt',
      de: 'Laden der Gespräche fehlgeschlagen',
    },
    loadConversationFailed: {
      fr: 'Échec du chargement de la conversation',
      en: 'Failed to load conversation',
      nl: 'Laden van gesprek mislukt',
      de: 'Laden des Gesprächs fehlgeschlagen',
    },
    sendFailed: {
      fr: 'Échec de l\'envoi du message',
      en: 'Failed to send message',
      nl: 'Versturen van bericht mislukt',
      de: 'Senden der Nachricht fehlgeschlagen',
    },
    created: {
      fr: 'Conversation créée',
      en: 'Conversation created',
      nl: 'Gesprek aangemaakt',
      de: 'Gespräch erstellt',
    },
    createFailed: {
      fr: 'Échec de la création de la conversation',
      en: 'Failed to create conversation',
      nl: 'Aanmaken van gesprek mislukt',
      de: 'Erstellen des Gesprächs fehlgeschlagen',
    },
    archived: {
      fr: 'Conversation archivée',
      en: 'Conversation archived',
      nl: 'Gesprek gearchiveerd',
      de: 'Gespräch archiviert',
    },
    archiveFailed: {
      fr: 'Échec de l\'archivage de la conversation',
      en: 'Failed to archive conversation',
      nl: 'Archiveren van gesprek mislukt',
      de: 'Archivieren des Gesprächs fehlgeschlagen',
    },
  },
  profile: {
    loadFailed: {
      fr: 'Échec du chargement du profil',
      en: 'Failed to load profile',
      nl: 'Laden van profiel mislukt',
      de: 'Laden des Profils fehlgeschlagen',
    },
    switchedTo: {
      fr: 'Basculé vers',
      en: 'Switched to',
      nl: 'Overgeschakeld naar',
      de: 'Gewechselt zu',
    },
    createNewProfile: {
      fr: 'Créer un nouveau profil',
      en: 'Create New Profile',
      nl: 'Nieuw profiel aanmaken',
      de: 'Neues Profil erstellen',
    },
    unexpectedError: {
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
    nameUpdateFailed: {
      fr: 'Échec de la mise à jour du nom',
      en: 'Failed to update name',
      nl: 'Bijwerken van naam mislukt',
      de: 'Aktualisieren des Namens fehlgeschlagen',
    },
    nameUpdated: {
      fr: 'Nom mis à jour avec succès',
      en: 'Name updated successfully',
      nl: 'Naam succesvol bijgewerkt',
      de: 'Name erfolgreich aktualisiert',
    },
    selectDifferentRole: {
      fr: 'Veuillez sélectionner un rôle différent',
      en: 'Please select a different role',
      nl: 'Selecteer een andere rol',
      de: 'Bitte wähle eine andere Rolle',
    },
    roleChangeFailed: {
      fr: 'Échec du changement de rôle',
      en: 'Failed to change role',
      nl: 'Wijzigen van rol mislukt',
      de: 'Ändern der Rolle fehlgeschlagen',
    },
    roleSwitched: {
      fr: 'Rôle changé avec succès !',
      en: 'Role switched successfully!',
      nl: 'Rol succesvol gewijzigd!',
      de: 'Rolle erfolgreich gewechselt!',
    },
    onboardingReset: {
      fr: 'Onboarding réinitialisé ! Redirection...',
      en: 'Onboarding reset! Redirecting...',
      nl: 'Onboarding gereset! Doorsturen...',
      de: 'Onboarding zurückgesetzt! Weiterleitung...',
    },
    onboardingResetFailed: {
      fr: 'Échec de la réinitialisation de l\'onboarding',
      en: 'Failed to reset onboarding',
      nl: 'Resetten van onboarding mislukt',
      de: 'Zurücksetzen des Onboardings fehlgeschlagen',
    },
    dataRefreshed: {
      fr: 'Données actualisées',
      en: 'Data refreshed',
      nl: 'Gegevens vernieuwd',
      de: 'Daten aktualisiert',
    },
    loadProfilesFailed: {
      fr: 'Échec du chargement des profils',
      en: 'Failed to load profiles',
      nl: 'Laden van profielen mislukt',
      de: 'Laden der Profile fehlgeschlagen',
    },
  },
  alerts: {
    deleted: {
      fr: 'Alerte supprimée',
      en: 'Alert deleted',
      nl: 'Waarschuwing verwijderd',
      de: 'Warnung gelöscht',
    },
    deleteFailed: {
      fr: 'Erreur lors de la suppression',
      en: 'Failed to delete',
      nl: 'Verwijderen mislukt',
      de: 'Löschen fehlgeschlagen',
    },
    saved: {
      fr: 'Préférences sauvegardées',
      en: 'Preferences saved',
      nl: 'Voorkeuren opgeslagen',
      de: 'Einstellungen gespeichert',
    },
    saveFailed: {
      fr: 'Erreur lors de la sauvegarde',
      en: 'Failed to save',
      nl: 'Opslaan mislukt',
      de: 'Speichern fehlgeschlagen',
    },
    activated: {
      fr: 'Alerte activée',
      en: 'Alert activated',
      nl: 'Waarschuwing geactiveerd',
      de: 'Warnung aktiviert',
    },
    deactivated: {
      fr: 'Alerte désactivée',
      en: 'Alert deactivated',
      nl: 'Waarschuwing gedeactiveerd',
      de: 'Warnung deaktiviert',
    },
    codeCopied: {
      fr: 'Code copié !',
      en: 'Code copied!',
      nl: 'Code gekopieerd!',
      de: 'Code kopiert!',
    },
    removedFromFavorites: {
      fr: 'Retiré des favoris',
      en: 'Removed from favorites',
      nl: 'Verwijderd uit favorieten',
      de: 'Aus Favoriten entfernt',
    },
  },
  auth: {
    error: {
      fr: 'Une erreur s\'est produite',
      en: 'An error occurred',
      nl: 'Er is een fout opgetreden',
      de: 'Ein Fehler ist aufgetreten',
    },
    googleFailed: {
      fr: 'Échec de la connexion Google',
      en: 'Google sign-in failed',
      nl: 'Google-aanmelding mislukt',
      de: 'Google-Anmeldung fehlgeschlagen',
    },
  },
  maintenance: {
    loadPropertiesFailed: {
      fr: 'Impossible de charger vos propriétés',
      en: 'Unable to load your properties',
      nl: 'Kan uw woningen niet laden',
      de: 'Ihre Immobilien konnten nicht geladen werden',
    },
    loadDataFailed: {
      fr: 'Erreur lors du chargement des données',
      en: 'Error loading data',
      nl: 'Fout bij het laden van gegevens',
      de: 'Fehler beim Laden der Daten',
    },
    loginRequired: {
      fr: 'Vous devez être connecté pour créer une demande',
      en: 'You must be logged in to create a request',
      nl: 'Je moet ingelogd zijn om een verzoek aan te maken',
      de: 'Sie müssen angemeldet sein, um eine Anfrage zu erstellen',
    },
    requestCreated: {
      fr: 'Demande de maintenance créée avec succès',
      en: 'Maintenance request created successfully',
      nl: 'Onderhoudsverzoek succesvol aangemaakt',
      de: 'Wartungsanfrage erfolgreich erstellt',
    },
    createFailed: {
      fr: 'Erreur lors de la création de la demande',
      en: 'Error creating the request',
      nl: 'Fout bij het aanmaken van het verzoek',
      de: 'Fehler beim Erstellen der Anfrage',
    },
    addedToFavorites: {
      fr: 'Ajouté aux favoris',
      en: 'Added to favorites',
      nl: 'Toegevoegd aan favorieten',
      de: 'Zu Favoriten hinzugefügt',
    },
    removedFromFavorites: {
      fr: 'Retiré des favoris',
      en: 'Removed from favorites',
      nl: 'Verwijderd uit favorieten',
      de: 'Aus Favoriten entfernt',
    },
    updateFailed: {
      fr: 'Erreur lors de la mise à jour',
      en: 'Error updating',
      nl: 'Fout bij het bijwerken',
      de: 'Fehler beim Aktualisieren',
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
