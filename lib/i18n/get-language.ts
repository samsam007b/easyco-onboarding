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
  preferences: {
    saved: {
      fr: 'Préférences sauvegardées !',
      en: 'Preferences saved successfully!',
      nl: 'Voorkeuren succesvol opgeslagen!',
      de: 'Einstellungen erfolgreich gespeichert!',
    },
    saveFailed: {
      fr: 'Échec de la sauvegarde des préférences',
      en: 'Failed to save preferences',
      nl: 'Opslaan van voorkeuren mislukt',
      de: 'Speichern der Einstellungen fehlgeschlagen',
    },
    errorSaving: {
      fr: 'Une erreur est survenue lors de la sauvegarde',
      en: 'An error occurred while saving',
      nl: 'Er is een fout opgetreden bij het opslaan',
      de: 'Beim Speichern ist ein Fehler aufgetreten',
    },
    changesReset: {
      fr: 'Modifications réinitialisées',
      en: 'Changes reset',
      nl: 'Wijzigingen gereset',
      de: 'Änderungen zurückgesetzt',
    },
  },
  finance: {
    loadFailed: {
      fr: 'Erreur lors du chargement des données',
      en: 'Error loading data',
      nl: 'Fout bij het laden van gegevens',
      de: 'Fehler beim Laden der Daten',
    },
    paymentMarkedPaid: {
      fr: 'Paiement marqué comme payé',
      en: 'Payment marked as paid',
      nl: 'Betaling gemarkeerd als betaald',
      de: 'Zahlung als bezahlt markiert',
    },
    updateFailed: {
      fr: 'Erreur lors de la mise à jour',
      en: 'Error updating',
      nl: 'Fout bij het bijwerken',
      de: 'Fehler beim Aktualisieren',
    },
    sendingReminder: {
      fr: 'Envoi de la relance...',
      en: 'Sending reminder...',
      nl: 'Herinnering versturen...',
      de: 'Erinnerung wird gesendet...',
    },
    reminderSent: {
      fr: 'Relance envoyée',
      en: 'Reminder sent',
      nl: 'Herinnering verzonden',
      de: 'Erinnerung gesendet',
    },
    reminderFailed: {
      fr: 'Erreur lors de l\'envoi de la relance',
      en: 'Failed to send reminder',
      nl: 'Versturen van herinnering mislukt',
      de: 'Senden der Erinnerung fehlgeschlagen',
    },
    noDataToExport: {
      fr: 'Aucune donnée à exporter',
      en: 'No data to export',
      nl: 'Geen gegevens om te exporteren',
      de: 'Keine Daten zum Exportieren',
    },
    csvDownloaded: {
      fr: 'Export CSV téléchargé',
      en: 'CSV export downloaded',
      nl: 'CSV-export gedownload',
      de: 'CSV-Export heruntergeladen',
    },
    pdfPreparing: {
      fr: 'Préparation du PDF pour impression...',
      en: 'Preparing PDF for printing...',
      nl: 'PDF voorbereiden voor afdrukken...',
      de: 'PDF zum Drucken vorbereiten...',
    },
    missingData: {
      fr: 'Erreur : données manquantes',
      en: 'Error: Missing data',
      nl: 'Fout: ontbrekende gegevens',
      de: 'Fehler: Fehlende Daten',
    },
    expenseCreated: {
      fr: 'Dépense créée avec succès ! 🎉',
      en: 'Expense created successfully! 🎉',
      nl: 'Uitgave succesvol aangemaakt! 🎉',
      de: 'Ausgabe erfolgreich erstellt! 🎉',
    },
    expenseCreateFailed: {
      fr: 'Erreur lors de la création de la dépense',
      en: 'Error creating expense',
      nl: 'Fout bij het aanmaken van uitgave',
      de: 'Fehler beim Erstellen der Ausgabe',
    },
    unexpectedError: {
      fr: 'Erreur inattendue',
      en: 'Unexpected error',
      nl: 'Onverwachte fout',
      de: 'Unerwarteter Fehler',
    },
    exportFailed: {
      fr: 'Erreur lors de l\'export',
      en: 'Error exporting',
      nl: 'Fout bij exporteren',
      de: 'Fehler beim Exportieren',
    },
    markedAsPaid: {
      fr: 'Marqué comme payé !',
      en: 'Marked as paid!',
      nl: 'Gemarkeerd als betaald!',
      de: 'Als bezahlt markiert!',
    },
    error: {
      fr: 'Erreur',
      en: 'Error',
      nl: 'Fout',
      de: 'Fehler',
    },
  },
  invitation: {
    linkGenerationFailed: {
      fr: 'Erreur lors de la génération du lien',
      en: 'Error generating link',
      nl: 'Fout bij het genereren van de link',
      de: 'Fehler beim Generieren des Links',
    },
    linkCopied: {
      fr: 'Lien copié !',
      en: 'Link copied!',
      nl: 'Link gekopieerd!',
      de: 'Link kopiert!',
    },
    messageAndLinkCopied: {
      fr: 'Message et lien copiés !',
      en: 'Message and link copied!',
      nl: 'Bericht en link gekopieerd!',
      de: 'Nachricht und Link kopiert!',
    },
    refused: {
      fr: 'Invitation refusée',
      en: 'Invitation refused',
      nl: 'Uitnodiging geweigerd',
      de: 'Einladung abgelehnt',
    },
    errorOccurred: {
      fr: 'Une erreur est survenue',
      en: 'An error occurred',
      nl: 'Er is een fout opgetreden',
      de: 'Ein Fehler ist aufgetreten',
    },
    alreadyMember: {
      fr: 'Vous êtes déjà membre de cette résidence',
      en: 'You are already a member of this residence',
      nl: 'Je bent al lid van deze residentie',
      de: 'Du bist bereits Mitglied dieser Residenz',
    },
    welcomeToResidence: {
      fr: 'Bienvenue dans la résidence !',
      en: 'Welcome to the residence!',
      nl: 'Welkom in de residentie!',
      de: 'Willkommen in der Residenz!',
    },
    acceptError: {
      fr: 'Erreur lors de l\'acceptation',
      en: 'Error during acceptance',
      nl: 'Fout bij het accepteren',
      de: 'Fehler beim Akzeptieren',
    },
    refuseError: {
      fr: 'Erreur lors du refus',
      en: 'Error during refusal',
      nl: 'Fout bij het weigeren',
      de: 'Fehler beim Ablehnen',
    },
  },
  upload: {
    selectImage: {
      fr: 'Veuillez sélectionner un fichier image',
      en: 'Please select an image file',
      nl: 'Selecteer een afbeeldingsbestand',
      de: 'Bitte wähle eine Bilddatei',
    },
    imageTooLarge: {
      fr: 'L\'image doit faire moins de 5 Mo',
      en: 'Image size must be less than 5MB',
      nl: 'Afbeelding moet kleiner zijn dan 5MB',
      de: 'Bildgröße muss unter 5MB sein',
    },
    loginRequired: {
      fr: 'Vous devez être connecté pour uploader des images',
      en: 'You must be logged in to upload images',
      nl: 'Je moet ingelogd zijn om afbeeldingen te uploaden',
      de: 'Du musst angemeldet sein, um Bilder hochzuladen',
    },
    success: {
      fr: 'Image uploadée avec succès',
      en: 'Image uploaded successfully',
      nl: 'Afbeelding succesvol geüpload',
      de: 'Bild erfolgreich hochgeladen',
    },
    uploadFailed: {
      fr: 'Échec de l\'upload de l\'image',
      en: 'Failed to upload image',
      nl: 'Uploaden van afbeelding mislukt',
      de: 'Hochladen des Bildes fehlgeschlagen',
    },
  },
  emailVerification: {
    loginRequired: {
      fr: 'Veuillez vous connecter pour renvoyer l\'email de vérification',
      en: 'Please log in to resend verification email',
      nl: 'Log in om de verificatie-e-mail opnieuw te verzenden',
      de: 'Bitte melde dich an, um die Bestätigungs-E-Mail erneut zu senden',
    },
    resendFailed: {
      fr: 'Échec de l\'envoi de l\'email de vérification',
      en: 'Failed to resend verification email',
      nl: 'Opnieuw verzenden van verificatie-e-mail mislukt',
      de: 'Erneutes Senden der Bestätigungs-E-Mail fehlgeschlagen',
    },
    sent: {
      fr: 'Email de vérification envoyé !',
      en: 'Verification email sent!',
      nl: 'Verificatie-e-mail verzonden!',
      de: 'Bestätigungs-E-Mail gesendet!',
    },
    sentDescription: {
      fr: 'Vérifiez votre boîte de réception',
      en: 'Check your inbox',
      nl: 'Controleer je inbox',
      de: 'Überprüfe deinen Posteingang',
    },
    unexpectedError: {
      fr: 'Une erreur inattendue s\'est produite',
      en: 'An unexpected error occurred',
      nl: 'Er is een onverwachte fout opgetreden',
      de: 'Ein unerwarteter Fehler ist aufgetreten',
    },
  },
  logout: {
    error: {
      fr: 'Erreur lors de la déconnexion',
      en: 'Error signing out',
      nl: 'Fout bij het uitloggen',
      de: 'Fehler beim Abmelden',
    },
    success: {
      fr: 'Déconnecté avec succès',
      en: 'Signed out successfully',
      nl: 'Succesvol uitgelogd',
      de: 'Erfolgreich abgemeldet',
    },
  },
  browse: {
    removedFromFavorites: {
      fr: 'Retiré des favoris',
      en: 'Removed from favorites',
      nl: 'Verwijderd uit favorieten',
      de: 'Aus Favoriten entfernt',
    },
    addedToFavorites: {
      fr: 'Ajouté aux favoris !',
      en: 'Added to favorites!',
      nl: 'Toegevoegd aan favorieten!',
      de: 'Zu Favoriten hinzugefügt!',
    },
    profilesReloaded: {
      fr: 'Profils rechargés !',
      en: 'Profiles reloaded!',
      nl: 'Profielen herladen!',
      de: 'Profile neu geladen!',
    },
    liked: {
      fr: 'liké !',
      en: 'liked!',
      nl: 'geliked!',
      de: 'geliked!',
    },
    fullProfileSoon: {
      fr: 'Profil complet bientôt disponible !',
      en: 'Full profile coming soon!',
      nl: 'Volledig profiel binnenkort beschikbaar!',
      de: 'Vollständiges Profil kommt bald!',
    },
    cannotUndo: {
      fr: 'Impossible d\'annuler',
      en: 'Cannot undo',
      nl: 'Kan niet ongedaan maken',
      de: 'Kann nicht rückgängig gemacht werden',
    },
    restoredToDeck: {
      fr: 'remis dans le deck',
      en: 'restored to deck',
      nl: 'terug in het deck',
      de: 'zurück ins Deck',
    },
  },
  settle: {
    tooManyRequests: {
      fr: 'Trop de requêtes',
      en: 'Too many requests',
      nl: 'Te veel verzoeken',
      de: 'Zu viele Anfragen',
    },
    waitBeforeTrying: {
      fr: 'Veuillez patienter avant de réessayer.',
      en: 'Please wait before trying again.',
      nl: 'Wacht even voordat je het opnieuw probeert.',
      de: 'Bitte warte, bevor du es erneut versuchst.',
    },
    ibanCopied: {
      fr: 'IBAN copié !',
      en: 'IBAN copied!',
      nl: 'IBAN gekopieerd!',
      de: 'IBAN kopiert!',
    },
    willNotify: {
      fr: 'recevra une notification pour confirmer',
      en: 'will receive a notification to confirm',
      nl: 'ontvangt een melding ter bevestiging',
      de: 'erhält eine Benachrichtigung zur Bestätigung',
    },
    loadError: {
      fr: 'Erreur lors du chargement des données',
      en: 'Error loading data',
      nl: 'Fout bij het laden van gegevens',
      de: 'Fehler beim Laden der Daten',
    },
    copyError: {
      fr: 'Erreur lors de la copie',
      en: 'Error copying',
      nl: 'Fout bij het kopiëren',
      de: 'Fehler beim Kopieren',
    },
    amountCopied: {
      fr: 'Montant copié !',
      en: 'Amount copied!',
      nl: 'Bedrag gekopieerd!',
      de: 'Betrag kopiert!',
    },
    paymentReported: {
      fr: 'Paiement signalé !',
      en: 'Payment reported!',
      nl: 'Betaling gemeld!',
      de: 'Zahlung gemeldet!',
    },
    error: {
      fr: 'Erreur',
      en: 'Error',
      nl: 'Fout',
      de: 'Fehler',
    },
  },
  forgotPassword: {
    unexpectedError: {
      fr: 'Une erreur inattendue s\'est produite',
      en: 'An unexpected error occurred',
      nl: 'Er is een onverwachte fout opgetreden',
      de: 'Ein unerwarteter Fehler ist aufgetreten',
    },
  },
  admin: {
    userBannedSuccess: {
      fr: 'Utilisateur banni avec succès',
      en: 'User banned successfully',
      nl: 'Gebruiker succesvol verbannen',
      de: 'Benutzer erfolgreich gesperrt',
    },
    banError: {
      fr: 'Erreur lors du bannissement',
      en: 'Error banning user',
      nl: 'Fout bij het verbannen',
      de: 'Fehler beim Sperren',
    },
    userDeleted: {
      fr: 'Utilisateur supprimé',
      en: 'User deleted',
      nl: 'Gebruiker verwijderd',
      de: 'Benutzer gelöscht',
    },
    deleteError: {
      fr: 'Erreur lors de la suppression',
      en: 'Error deleting',
      nl: 'Fout bij het verwijderen',
      de: 'Fehler beim Löschen',
    },
    adminDeleted: {
      fr: 'Administrateur supprimé',
      en: 'Administrator deleted',
      nl: 'Beheerder verwijderd',
      de: 'Administrator gelöscht',
    },
    settingsSaved: {
      fr: 'Paramètres enregistrés',
      en: 'Settings saved',
      nl: 'Instellingen opgeslagen',
      de: 'Einstellungen gespeichert',
    },
    settingsSavedDescription: {
      fr: 'Les modifications ont été sauvegardées.',
      en: 'Changes have been saved.',
      nl: 'Wijzigingen zijn opgeslagen.',
      de: 'Änderungen wurden gespeichert.',
    },
    saveError: {
      fr: 'Erreur lors de la sauvegarde',
      en: 'Error saving',
      nl: 'Fout bij het opslaan',
      de: 'Fehler beim Speichern',
    },
    saveErrorDescription: {
      fr: 'Veuillez réessayer.',
      en: 'Please try again.',
      nl: 'Probeer het opnieuw.',
      de: 'Bitte versuche es erneut.',
    },
    screenshotDeleted: {
      fr: 'Screenshot supprimé',
      en: 'Screenshot deleted',
      nl: 'Screenshot verwijderd',
      de: 'Screenshot gelöscht',
    },
    loadNotificationsError: {
      fr: 'Erreur lors du chargement des notifications',
      en: 'Error loading notifications',
      nl: 'Fout bij het laden van meldingen',
      de: 'Fehler beim Laden der Benachrichtigungen',
    },
  },
  security: {
    newError: {
      fr: 'Nouvelle erreur',
      en: 'New error',
      nl: 'Nieuwe fout',
      de: 'Neuer Fehler',
    },
    errorResolved: {
      fr: 'Erreur résolue',
      en: 'Error resolved',
      nl: 'Fout opgelost',
      de: 'Fehler behoben',
    },
    newAlert: {
      fr: 'Nouvelle alerte',
      en: 'New alert',
      nl: 'Nieuwe waarschuwing',
      de: 'Neue Warnung',
    },
    loadError: {
      fr: 'Erreur lors du chargement',
      en: 'Error loading data',
      nl: 'Fout bij het laden',
      de: 'Fehler beim Laden',
    },
    errorMarkedResolved: {
      fr: 'Erreur marquée comme résolue',
      en: 'Error marked as resolved',
      nl: 'Fout gemarkeerd als opgelost',
      de: 'Fehler als behoben markiert',
    },
    errorReopened: {
      fr: 'Erreur réouverte',
      en: 'Error reopened',
      nl: 'Fout heropend',
      de: 'Fehler wieder geöffnet',
    },
    alertAcknowledged: {
      fr: 'Alerte acquittée',
      en: 'Alert acknowledged',
      nl: 'Waarschuwing bevestigd',
      de: 'Warnung bestätigt',
    },
  },
  devtools: {
    notAuthenticated: {
      fr: 'Non authentifié',
      en: 'Not authenticated',
      nl: 'Niet geauthenticeerd',
      de: 'Nicht authentifiziert',
    },
    switchRoleFailed: {
      fr: 'Échec du changement de rôle',
      en: 'Failed to switch role',
      nl: 'Wisselen van rol mislukt',
      de: 'Rollenwechsel fehlgeschlagen',
    },
    switchedTo: {
      fr: 'Basculé vers',
      en: 'Switched to',
      nl: 'Overgeschakeld naar',
      de: 'Gewechselt zu',
    },
    errorOccurred: {
      fr: 'Une erreur est survenue',
      en: 'An error occurred',
      nl: 'Er is een fout opgetreden',
      de: 'Ein Fehler ist aufgetreten',
    },
    resetOnboardingFailed: {
      fr: 'Échec de la réinitialisation de l\'onboarding',
      en: 'Failed to reset onboarding',
      nl: 'Resetten van onboarding mislukt',
      de: 'Zurücksetzen des Onboardings fehlgeschlagen',
    },
    onboardingReset: {
      fr: 'Onboarding réinitialisé !',
      en: 'Onboarding reset!',
      nl: 'Onboarding gereset!',
      de: 'Onboarding zurückgesetzt!',
    },
    loggedOut: {
      fr: 'Déconnecté',
      en: 'Logged out',
      nl: 'Uitgelogd',
      de: 'Abgemeldet',
    },
  },
  applications: {
    loadFailed: {
      fr: 'Échec du chargement des candidatures. Veuillez réessayer ou contacter le support.',
      en: 'Failed to load applications. Please try again or contact support.',
      nl: 'Laden van aanvragen mislukt. Probeer het opnieuw of neem contact op met support.',
      de: 'Laden der Bewerbungen fehlgeschlagen. Bitte versuche es erneut oder kontaktiere den Support.',
    },
    loadSingleFailed: {
      fr: 'Échec du chargement de la candidature',
      en: 'Failed to load application',
      nl: 'Laden van aanvraag mislukt',
      de: 'Laden der Bewerbung fehlgeschlagen',
    },
    updateFailed: {
      fr: 'Échec de la mise à jour de la candidature',
      en: 'Failed to update application',
      nl: 'Bijwerken van aanvraag mislukt',
      de: 'Aktualisieren der Bewerbung fehlgeschlagen',
    },
    withdrawn: {
      fr: 'Candidature retirée',
      en: 'Application withdrawn',
      nl: 'Aanvraag ingetrokken',
      de: 'Bewerbung zurückgezogen',
    },
    withdrawFailed: {
      fr: 'Échec du retrait de la candidature',
      en: 'Failed to withdraw application',
      nl: 'Intrekken van aanvraag mislukt',
      de: 'Zurückziehen der Bewerbung fehlgeschlagen',
    },
    deleted: {
      fr: 'Candidature supprimée',
      en: 'Application deleted',
      nl: 'Aanvraag verwijderd',
      de: 'Bewerbung gelöscht',
    },
    deleteFailed: {
      fr: 'Échec de la suppression de la candidature',
      en: 'Failed to delete application',
      nl: 'Verwijderen van aanvraag mislukt',
      de: 'Löschen der Bewerbung fehlgeschlagen',
    },
    updateGroupFailed: {
      fr: 'Échec de la mise à jour de la candidature de groupe',
      en: 'Failed to update group application',
      nl: 'Bijwerken van groepsaanvraag mislukt',
      de: 'Aktualisieren der Gruppenbewerbung fehlgeschlagen',
    },
  },
  imageUpload: {
    invalidType: {
      fr: 'Veuillez télécharger un fichier image (JPEG, PNG ou WebP)',
      en: 'Please upload an image file (JPEG, PNG, or WebP)',
      nl: 'Upload een afbeeldingsbestand (JPEG, PNG of WebP)',
      de: 'Bitte lade eine Bilddatei hoch (JPEG, PNG oder WebP)',
    },
    fileTooLarge: {
      fr: 'La taille du fichier doit être inférieure à',
      en: 'File size must be less than',
      nl: 'Bestandsgrootte moet kleiner zijn dan',
      de: 'Dateigröße muss kleiner sein als',
    },
    invalidFile: {
      fr: 'Fichier image invalide. Le fichier peut être corrompu ou n\'est pas une vraie image.',
      en: 'Invalid image file. The file may be corrupted or not a real image.',
      nl: 'Ongeldig afbeeldingsbestand. Het bestand is mogelijk beschadigd of geen echte afbeelding.',
      de: 'Ungültige Bilddatei. Die Datei ist möglicherweise beschädigt oder kein echtes Bild.',
    },
    validationFailed: {
      fr: 'Échec de la validation du fichier',
      en: 'Failed to validate file',
      nl: 'Validatie van bestand mislukt',
      de: 'Validierung der Datei fehlgeschlagen',
    },
    uploadFailed: {
      fr: 'Échec du téléchargement de l\'image',
      en: 'Failed to upload image',
      nl: 'Uploaden van afbeelding mislukt',
      de: 'Hochladen des Bildes fehlgeschlagen',
    },
    deleted: {
      fr: 'Image supprimée',
      en: 'Image deleted',
      nl: 'Afbeelding verwijderd',
      de: 'Bild gelöscht',
    },
    deleteFailed: {
      fr: 'Échec de la suppression de l\'image',
      en: 'Failed to delete image',
      nl: 'Verwijderen van afbeelding mislukt',
      de: 'Löschen des Bildes fehlgeschlagen',
    },
    updatePropertyFailed: {
      fr: 'Échec de la mise à jour des images de la propriété',
      en: 'Failed to update property images',
      nl: 'Bijwerken van woningafbeeldingen mislukt',
      de: 'Aktualisieren der Immobilienbilder fehlgeschlagen',
    },
  },
  autoSave: {
    dataTooLarge: {
      fr: 'Les données sont trop volumineuses pour être sauvegardées',
      en: 'Data is too large to save',
      nl: 'Gegevens zijn te groot om op te slaan',
      de: 'Daten sind zu groß zum Speichern',
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
