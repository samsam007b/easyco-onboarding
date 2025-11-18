import Foundation

// MARK: - Translation Sections

/// Main translation sections matching web app structure
struct TranslationSections {
    let auth: AuthTranslations
    let common: CommonTranslations
    let onboarding: OnboardingTranslations
    let nav: NavTranslations
    let welcome: WelcomeTranslations
    let dashboard: DashboardTranslations
    let resident: ResidentTranslations
    let properties: PropertiesTranslations
}

// MARK: - Auth Translations

struct AuthTranslations {
    let loginTitle: String
    let signupTitle: String
    let loginSubtitle: String
    let signupSubtitle: String
    let emailPlaceholder: String
    let passwordPlaceholder: String
    let confirmPasswordPlaceholder: String
    let forgotPassword: String
    let loginButton: String
    let signupButton: String
    let continueWithGoogle: String
    let orDivider: String
    let alreadyHaveAccount: String
    let dontHaveAccount: String
    let termsAndConditions: String
    let backToHome: String
    let login: String
    let signup: String
}

// MARK: - Common Translations

struct CommonTranslations {
    let save: String
    let cancel: String
    let delete: String
    let edit: String
    let close: String
    let next: String
    let previous: String
    let finish: String
    let loading: String
    let error: String
    let success: String
    let confirm: String
    let search: String
    let filter: String
    let sort: String
    let noResults: String
    let tryAgain: String
    let seeMore: String
    let seeLess: String
    let required: String
    let optional: String
}

// MARK: - Onboarding Translations

struct OnboardingTranslations {
    let welcome: String
    let getStarted: String
    let skip: String
    let continueButton: String

    // Searcher onboarding
    let searcherBasicInfo: OnboardingBasicInfo
    let searcherPreferences: OnboardingPreferences

    // Owner onboarding
    let ownerPropertyBasics: OnboardingPropertyBasics

    struct OnboardingBasicInfo {
        let title: String
        let subtitle: String
        let firstNameLabel: String
        let lastNameLabel: String
        let birthDateLabel: String
        let phoneLabel: String
    }

    struct OnboardingPreferences {
        let title: String
        let subtitle: String
        let budgetLabel: String
        let locationLabel: String
        let moveInDateLabel: String
        let roommatesLabel: String
    }

    struct OnboardingPropertyBasics {
        let title: String
        let subtitle: String
        let propertyTypeLabel: String
        let addressLabel: String
        let cityLabel: String
        let postalCodeLabel: String
        let bedroomsLabel: String
        let bathroomsLabel: String
    }
}

// MARK: - Nav Translations

struct NavTranslations {
    let explore: String
    let matches: String
    let messages: String
    let favorites: String
    let profile: String
    let dashboard: String
    let properties: String
    let residents: String
    let settings: String
    let logout: String
}

// MARK: - Welcome Translations

struct WelcomeTranslations {
    let title: String
    let subtitle: String
    let searcherRole: RoleDescription
    let ownerRole: RoleDescription
    let residentRole: RoleDescription

    struct RoleDescription {
        let title: String
        let description: String
        let action: String
    }
}

// MARK: - Dashboard Translations

struct DashboardTranslations {
    let welcome: String
    let stats: String
    let recentActivity: String
    let quickActions: String
    let viewAll: String
}

// MARK: - Resident Translations

struct ResidentTranslations {
    let hub: String
    let tasks: String
    let expenses: String
    let events: String
    let household: String
    let createTask: String
    let addExpense: String
    let scheduleEvent: String
}

// MARK: - Properties Translations

struct PropertiesTranslations {
    let explorer: String
    let searchPlaceholder: String
    let filters: String
    let sortBy: String
    let mapView: String
    let listView: String
    let noProperties: String
    let tryAdjustingFilters: String
    let resetFilters: String
    let perMonth: String
    let bedrooms: String
    let bathrooms: String
    let available: String
    let viewDetails: String
}

// MARK: - Translations Static Data

struct Translations {

    // MARK: - Auth Section

    private static let auth: [Language: AuthTranslations] = [
        .fr: AuthTranslations(
            loginTitle: "Connexion",
            signupTitle: "Inscription",
            loginSubtitle: "Connectez-vous à votre compte",
            signupSubtitle: "Créez votre compte",
            emailPlaceholder: "Adresse email",
            passwordPlaceholder: "Mot de passe",
            confirmPasswordPlaceholder: "Confirmer le mot de passe",
            forgotPassword: "Mot de passe oublié ?",
            loginButton: "Se connecter",
            signupButton: "Créer un compte",
            continueWithGoogle: "Continuer avec Google",
            orDivider: "ou",
            alreadyHaveAccount: "Déjà un compte ?",
            dontHaveAccount: "Pas encore de compte ?",
            termsAndConditions: "En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité",
            backToHome: "Retour à l'accueil",
            login: "Connexion",
            signup: "Inscription"
        ),
        .en: AuthTranslations(
            loginTitle: "Login",
            signupTitle: "Sign Up",
            loginSubtitle: "Sign in to your account",
            signupSubtitle: "Create your account",
            emailPlaceholder: "Email address",
            passwordPlaceholder: "Password",
            confirmPasswordPlaceholder: "Confirm password",
            forgotPassword: "Forgot password?",
            loginButton: "Sign in",
            signupButton: "Create account",
            continueWithGoogle: "Continue with Google",
            orDivider: "or",
            alreadyHaveAccount: "Already have an account?",
            dontHaveAccount: "Don't have an account?",
            termsAndConditions: "By creating an account, you agree to our terms of service and privacy policy",
            backToHome: "Back to home",
            login: "Login",
            signup: "Sign Up"
        ),
        .nl: AuthTranslations(
            loginTitle: "Inloggen",
            signupTitle: "Registreren",
            loginSubtitle: "Log in op uw account",
            signupSubtitle: "Maak uw account aan",
            emailPlaceholder: "E-mailadres",
            passwordPlaceholder: "Wachtwoord",
            confirmPasswordPlaceholder: "Bevestig wachtwoord",
            forgotPassword: "Wachtwoord vergeten?",
            loginButton: "Inloggen",
            signupButton: "Account aanmaken",
            continueWithGoogle: "Doorgaan met Google",
            orDivider: "of",
            alreadyHaveAccount: "Heeft u al een account?",
            dontHaveAccount: "Nog geen account?",
            termsAndConditions: "Door een account aan te maken, gaat u akkoord met onze gebruiksvoorwaarden en privacybeleid",
            backToHome: "Terug naar home",
            login: "Inloggen",
            signup: "Registreren"
        ),
        .de: AuthTranslations(
            loginTitle: "Anmelden",
            signupTitle: "Registrieren",
            loginSubtitle: "Melden Sie sich bei Ihrem Konto an",
            signupSubtitle: "Erstellen Sie Ihr Konto",
            emailPlaceholder: "E-Mail-Adresse",
            passwordPlaceholder: "Passwort",
            confirmPasswordPlaceholder: "Passwort bestätigen",
            forgotPassword: "Passwort vergessen?",
            loginButton: "Anmelden",
            signupButton: "Konto erstellen",
            continueWithGoogle: "Mit Google fortfahren",
            orDivider: "oder",
            alreadyHaveAccount: "Haben Sie bereits ein Konto?",
            dontHaveAccount: "Noch kein Konto?",
            termsAndConditions: "Durch die Erstellung eines Kontos stimmen Sie unseren Nutzungsbedingungen und Datenschutzrichtlinien zu",
            backToHome: "Zurück zur Startseite",
            login: "Anmelden",
            signup: "Registrieren"
        )
    ]

    // MARK: - Common Section

    private static let common: [Language: CommonTranslations] = [
        .fr: CommonTranslations(
            save: "Enregistrer",
            cancel: "Annuler",
            delete: "Supprimer",
            edit: "Modifier",
            close: "Fermer",
            next: "Suivant",
            previous: "Précédent",
            finish: "Terminer",
            loading: "Chargement...",
            error: "Erreur",
            success: "Succès",
            confirm: "Confirmer",
            search: "Rechercher",
            filter: "Filtrer",
            sort: "Trier",
            noResults: "Aucun résultat",
            tryAgain: "Réessayer",
            seeMore: "Voir plus",
            seeLess: "Voir moins",
            required: "Obligatoire",
            optional: "Optionnel"
        ),
        .en: CommonTranslations(
            save: "Save",
            cancel: "Cancel",
            delete: "Delete",
            edit: "Edit",
            close: "Close",
            next: "Next",
            previous: "Previous",
            finish: "Finish",
            loading: "Loading...",
            error: "Error",
            success: "Success",
            confirm: "Confirm",
            search: "Search",
            filter: "Filter",
            sort: "Sort",
            noResults: "No results",
            tryAgain: "Try again",
            seeMore: "See more",
            seeLess: "See less",
            required: "Required",
            optional: "Optional"
        ),
        .nl: CommonTranslations(
            save: "Opslaan",
            cancel: "Annuleren",
            delete: "Verwijderen",
            edit: "Bewerken",
            close: "Sluiten",
            next: "Volgende",
            previous: "Vorige",
            finish: "Voltooien",
            loading: "Laden...",
            error: "Fout",
            success: "Succes",
            confirm: "Bevestigen",
            search: "Zoeken",
            filter: "Filteren",
            sort: "Sorteren",
            noResults: "Geen resultaten",
            tryAgain: "Opnieuw proberen",
            seeMore: "Meer bekijken",
            seeLess: "Minder bekijken",
            required: "Verplicht",
            optional: "Optioneel"
        ),
        .de: CommonTranslations(
            save: "Speichern",
            cancel: "Abbrechen",
            delete: "Löschen",
            edit: "Bearbeiten",
            close: "Schließen",
            next: "Weiter",
            previous: "Zurück",
            finish: "Fertig",
            loading: "Laden...",
            error: "Fehler",
            success: "Erfolg",
            confirm: "Bestätigen",
            search: "Suchen",
            filter: "Filtern",
            sort: "Sortieren",
            noResults: "Keine Ergebnisse",
            tryAgain: "Erneut versuchen",
            seeMore: "Mehr anzeigen",
            seeLess: "Weniger anzeigen",
            required: "Erforderlich",
            optional: "Optional"
        )
    ]

    // MARK: - Nav Section

    private static let nav: [Language: NavTranslations] = [
        .fr: NavTranslations(
            explore: "Explorer",
            matches: "Matchs",
            messages: "Messages",
            favorites: "Favoris",
            profile: "Profil",
            dashboard: "Tableau de bord",
            properties: "Propriétés",
            residents: "Résidents",
            settings: "Paramètres",
            logout: "Déconnexion"
        ),
        .en: NavTranslations(
            explore: "Explore",
            matches: "Matches",
            messages: "Messages",
            favorites: "Favorites",
            profile: "Profile",
            dashboard: "Dashboard",
            properties: "Properties",
            residents: "Residents",
            settings: "Settings",
            logout: "Logout"
        ),
        .nl: NavTranslations(
            explore: "Verkennen",
            matches: "Matches",
            messages: "Berichten",
            favorites: "Favorieten",
            profile: "Profiel",
            dashboard: "Dashboard",
            properties: "Woningen",
            residents: "Bewoners",
            settings: "Instellingen",
            logout: "Uitloggen"
        ),
        .de: NavTranslations(
            explore: "Erkunden",
            matches: "Matches",
            messages: "Nachrichten",
            favorites: "Favoriten",
            profile: "Profil",
            dashboard: "Dashboard",
            properties: "Immobilien",
            residents: "Bewohner",
            settings: "Einstellungen",
            logout: "Abmelden"
        )
    ]

    // MARK: - Properties Section

    private static let properties: [Language: PropertiesTranslations] = [
        .fr: PropertiesTranslations(
            explorer: "Explorer",
            searchPlaceholder: "Ville, quartier...",
            filters: "Filtres",
            sortBy: "Trier par",
            mapView: "Carte",
            listView: "Liste",
            noProperties: "Aucune propriété trouvée",
            tryAdjustingFilters: "Essayez d'ajuster vos filtres ou votre recherche",
            resetFilters: "Réinitialiser les filtres",
            perMonth: "€/mois",
            bedrooms: "chambres",
            bathrooms: "salles de bain",
            available: "Disponible",
            viewDetails: "Voir les détails"
        ),
        .en: PropertiesTranslations(
            explorer: "Explore",
            searchPlaceholder: "City, neighborhood...",
            filters: "Filters",
            sortBy: "Sort by",
            mapView: "Map",
            listView: "List",
            noProperties: "No properties found",
            tryAdjustingFilters: "Try adjusting your filters or search",
            resetFilters: "Reset filters",
            perMonth: "€/month",
            bedrooms: "bedrooms",
            bathrooms: "bathrooms",
            available: "Available",
            viewDetails: "View details"
        ),
        .nl: PropertiesTranslations(
            explorer: "Verkennen",
            searchPlaceholder: "Stad, wijk...",
            filters: "Filters",
            sortBy: "Sorteren op",
            mapView: "Kaart",
            listView: "Lijst",
            noProperties: "Geen woningen gevonden",
            tryAdjustingFilters: "Probeer uw filters of zoekopdracht aan te passen",
            resetFilters: "Filters resetten",
            perMonth: "€/maand",
            bedrooms: "slaapkamers",
            bathrooms: "badkamers",
            available: "Beschikbaar",
            viewDetails: "Details bekijken"
        ),
        .de: PropertiesTranslations(
            explorer: "Erkunden",
            searchPlaceholder: "Stadt, Stadtteil...",
            filters: "Filter",
            sortBy: "Sortieren nach",
            mapView: "Karte",
            listView: "Liste",
            noProperties: "Keine Immobilien gefunden",
            tryAdjustingFilters: "Versuchen Sie, Ihre Filter oder Suche anzupassen",
            resetFilters: "Filter zurücksetzen",
            perMonth: "€/Monat",
            bedrooms: "Schlafzimmer",
            bathrooms: "Badezimmer",
            available: "Verfügbar",
            viewDetails: "Details anzeigen"
        )
    ]

    // MARK: - Helper Functions

    /// Get a specific translation by dot notation key (e.g., "auth.loginTitle")
    static func t(_ key: String, language: Language = .fr) -> String {
        let components = key.split(separator: ".").map(String.init)
        guard components.count == 2 else { return key }

        let section = components[0]
        let field = components[1]

        switch section {
        case "auth":
            return getAuthField(field, language: language)
        case "common":
            return getCommonField(field, language: language)
        case "nav":
            return getNavField(field, language: language)
        case "properties":
            return getPropertiesField(field, language: language)
        default:
            return key
        }
    }

    /// Get entire section for a language
    static func getSection<T>(_ keyPath: KeyPath<TranslationSections, T>, language: Language = .fr) -> T {
        // Get auth translations with fallback
        let authTranslations = auth[language] ?? auth[.fr] ?? AuthTranslations(
            loginTitle: "Connexion",
            signupTitle: "Inscription",
            loginSubtitle: "Connectez-vous à votre compte",
            emailPlaceholder: "Email",
            passwordPlaceholder: "Mot de passe",
            loginButton: "Se connecter",
            continueWithGoogle: "Continuer avec Google",
            backToHome: "Retour à l'accueil"
        )

        // Get common translations with fallback
        let commonTranslations = common[language] ?? common[.fr] ?? CommonTranslations(
            ok: "OK",
            cancel: "Annuler",
            save: "Enregistrer",
            delete: "Supprimer",
            edit: "Modifier",
            close: "Fermer",
            next: "Suivant",
            previous: "Précédent",
            done: "Terminé",
            loading: "Chargement...",
            error: "Erreur",
            success: "Succès",
            retry: "Réessayer",
            confirm: "Confirmer",
            search: "Rechercher",
            filter: "Filtrer",
            sort: "Trier",
            apply: "Appliquer",
            reset: "Réinitialiser"
        )

        // Get onboarding translations with fallback
        let onboardingTranslations = onboarding[language] ?? onboarding[.fr] ?? OnboardingTranslations(
            welcomeTitle: "Bienvenue sur EasyCo",
            welcomeSubtitle: "La plateforme de colocation simplifiée",
            step1Title: "Trouvez votre colocation idéale",
            step1Description: "Recherchez parmi des centaines de propriétés vérifiées",
            step2Title: "Gérez votre quotidien",
            step2Description: "Organisez les tâches, dépenses et paiements facilement",
            step3Title: "Communiquez simplement",
            step3Description: "Restez en contact avec vos colocataires et propriétaires",
            getStarted: "Commencer",
            skip: "Passer"
        )

        // Get nav translations with fallback
        let navTranslations = nav[language] ?? nav[.fr] ?? NavTranslations(
            home: "Accueil",
            explore: "Explorer",
            messages: "Messages",
            household: "Colocation",
            profile: "Profil"
        )

        // Get welcome translations with fallback
        let welcomeTranslations = welcome[language] ?? welcome[.fr] ?? WelcomeTranslations(
            title: "Bienvenue sur EasyCo",
            subtitle: "Choisissez comment vous souhaitez utiliser l'application",
            searcherRole: WelcomeTranslations.RoleDescription(
                title: "Chercheur",
                description: "Je recherche une colocation",
                action: "Commencer ma recherche"
            ),
            ownerRole: WelcomeTranslations.RoleDescription(
                title: "Propriétaire",
                description: "Je loue un logement",
                action: "Gérer mes propriétés"
            ),
            residentRole: WelcomeTranslations.RoleDescription(
                title: "Résident",
                description: "Je vis déjà en colocation",
                action: "Accéder à mon espace"
            )
        )

        // Get dashboard translations with fallback
        let dashboardTranslations = dashboard[language] ?? dashboard[.fr] ?? DashboardTranslations(
            welcome: "Bienvenue",
            stats: "Statistiques",
            recentActivity: "Activité récente",
            quickActions: "Actions rapides",
            viewAll: "Voir tout"
        )

        // Get resident translations with fallback
        let residentTranslations = resident[language] ?? resident[.fr] ?? ResidentTranslations(
            hub: "Espace Colocation",
            tasks: "Tâches",
            expenses: "Dépenses",
            events: "Événements",
            household: "Ménage",
            createTask: "Créer une tâche",
            addExpense: "Ajouter une dépense",
            scheduleEvent: "Planifier un événement"
        )

        // Get properties translations with fallback
        let propertiesTranslations = properties[language] ?? properties[.fr] ?? PropertiesTranslations(
            title: "Propriétés",
            searchPlaceholder: "Rechercher une ville, quartier...",
            filters: "Filtres",
            sortBy: "Trier par",
            priceRange: "Fourchette de prix",
            bedrooms: "Chambres",
            amenities: "Équipements",
            viewDetails: "Voir les détails",
            favorite: "Favori",
            apply: "Postuler"
        )

        let sections = TranslationSections(
            auth: authTranslations,
            common: commonTranslations,
            onboarding: onboardingTranslations,
            nav: navTranslations,
            welcome: welcomeTranslations,
            dashboard: dashboardTranslations,
            resident: residentTranslations,
            properties: propertiesTranslations
        )
        return sections[keyPath: keyPath]
    }

    // MARK: - Private Field Getters

    private static func getAuthField(_ field: String, language: Language) -> String {
        guard let section = auth[language] else { return field }

        switch field {
        case "loginTitle": return section.loginTitle
        case "signupTitle": return section.signupTitle
        case "loginSubtitle": return section.loginSubtitle
        case "emailPlaceholder": return section.emailPlaceholder
        case "passwordPlaceholder": return section.passwordPlaceholder
        case "loginButton": return section.loginButton
        case "continueWithGoogle": return section.continueWithGoogle
        case "backToHome": return section.backToHome
        default: return field
        }
    }

    private static func getCommonField(_ field: String, language: Language) -> String {
        guard let section = common[language] else { return field }

        switch field {
        case "save": return section.save
        case "cancel": return section.cancel
        case "next": return section.next
        case "loading": return section.loading
        case "search": return section.search
        default: return field
        }
    }

    private static func getNavField(_ field: String, language: Language) -> String {
        guard let section = nav[language] else { return field }

        switch field {
        case "explore": return section.explore
        case "matches": return section.matches
        case "messages": return section.messages
        case "favorites": return section.favorites
        case "profile": return section.profile
        default: return field
        }
    }

    private static func getPropertiesField(_ field: String, language: Language) -> String {
        guard let section = properties[language] else { return field }

        switch field {
        case "explorer": return section.explorer
        case "filters": return section.filters
        case "mapView": return section.mapView
        case "listView": return section.listView
        default: return field
        }
    }

    // MARK: - Placeholder Data (to be completed)

    private static let onboarding: [Language: OnboardingTranslations] = [
        .fr: OnboardingTranslations(
            welcome: "Bienvenue",
            getStarted: "Commencer",
            skip: "Passer",
            continueButton: "Continuer",
            searcherBasicInfo: .init(
                title: "Informations de base",
                subtitle: "Parlez-nous de vous",
                firstNameLabel: "Prénom",
                lastNameLabel: "Nom",
                birthDateLabel: "Date de naissance",
                phoneLabel: "Téléphone"
            ),
            searcherPreferences: .init(
                title: "Vos préférences",
                subtitle: "Aidez-nous à trouver votre colocation idéale",
                budgetLabel: "Budget mensuel",
                locationLabel: "Localisation souhaitée",
                moveInDateLabel: "Date d'emménagement",
                roommatesLabel: "Nombre de colocataires"
            ),
            ownerPropertyBasics: .init(
                title: "Informations de base",
                subtitle: "Décrivez votre propriété",
                propertyTypeLabel: "Type de propriété",
                addressLabel: "Adresse",
                cityLabel: "Ville",
                postalCodeLabel: "Code postal",
                bedroomsLabel: "Chambres",
                bathroomsLabel: "Salles de bain"
            )
        ),
        .en: OnboardingTranslations(
            welcome: "Welcome",
            getStarted: "Get Started",
            skip: "Skip",
            continueButton: "Continue",
            searcherBasicInfo: .init(
                title: "Basic Information",
                subtitle: "Tell us about yourself",
                firstNameLabel: "First Name",
                lastNameLabel: "Last Name",
                birthDateLabel: "Birth Date",
                phoneLabel: "Phone"
            ),
            searcherPreferences: .init(
                title: "Your Preferences",
                subtitle: "Help us find your ideal flatshare",
                budgetLabel: "Monthly Budget",
                locationLabel: "Desired Location",
                moveInDateLabel: "Move-in Date",
                roommatesLabel: "Number of Roommates"
            ),
            ownerPropertyBasics: .init(
                title: "Basic Information",
                subtitle: "Describe your property",
                propertyTypeLabel: "Property Type",
                addressLabel: "Address",
                cityLabel: "City",
                postalCodeLabel: "Postal Code",
                bedroomsLabel: "Bedrooms",
                bathroomsLabel: "Bathrooms"
            )
        ),
        .nl: OnboardingTranslations(
            welcome: "Welkom",
            getStarted: "Beginnen",
            skip: "Overslaan",
            continueButton: "Doorgaan",
            searcherBasicInfo: .init(
                title: "Basisinformatie",
                subtitle: "Vertel ons over uzelf",
                firstNameLabel: "Voornaam",
                lastNameLabel: "Achternaam",
                birthDateLabel: "Geboortedatum",
                phoneLabel: "Telefoon"
            ),
            searcherPreferences: .init(
                title: "Uw voorkeuren",
                subtitle: "Help ons uw ideale flatshare te vinden",
                budgetLabel: "Maandelijks budget",
                locationLabel: "Gewenste locatie",
                moveInDateLabel: "Inhuisdatum",
                roommatesLabel: "Aantal huisgenoten"
            ),
            ownerPropertyBasics: .init(
                title: "Basisinformatie",
                subtitle: "Beschrijf uw woning",
                propertyTypeLabel: "Type woning",
                addressLabel: "Adres",
                cityLabel: "Stad",
                postalCodeLabel: "Postcode",
                bedroomsLabel: "Slaapkamers",
                bathroomsLabel: "Badkamers"
            )
        ),
        .de: OnboardingTranslations(
            welcome: "Willkommen",
            getStarted: "Loslegen",
            skip: "Überspringen",
            continueButton: "Weiter",
            searcherBasicInfo: .init(
                title: "Grundinformationen",
                subtitle: "Erzählen Sie uns von sich",
                firstNameLabel: "Vorname",
                lastNameLabel: "Nachname",
                birthDateLabel: "Geburtsdatum",
                phoneLabel: "Telefon"
            ),
            searcherPreferences: .init(
                title: "Ihre Präferenzen",
                subtitle: "Helfen Sie uns, Ihre ideale WG zu finden",
                budgetLabel: "Monatliches Budget",
                locationLabel: "Gewünschter Standort",
                moveInDateLabel: "Einzugsdatum",
                roommatesLabel: "Anzahl der Mitbewohner"
            ),
            ownerPropertyBasics: .init(
                title: "Grundinformationen",
                subtitle: "Beschreiben Sie Ihre Immobilie",
                propertyTypeLabel: "Immobilientyp",
                addressLabel: "Adresse",
                cityLabel: "Stadt",
                postalCodeLabel: "Postleitzahl",
                bedroomsLabel: "Schlafzimmer",
                bathroomsLabel: "Badezimmer"
            )
        )
    ]

    private static let welcome: [Language: WelcomeTranslations] = [:]
    private static let dashboard: [Language: DashboardTranslations] = [:]
    private static let resident: [Language: ResidentTranslations] = [:]
}
