import Foundation

/// Configuration centrale de l'application
/// Facilite la modification des paramètres sans toucher au code
struct AppConfig {

    // MARK: - API Configuration

    /// URL de base de l'API Next.js
    static let apiBaseURL: String = {
        #if DEBUG
        return "http://localhost:3000"
        #else
        return "https://easyco.be"
        #endif
    }()

    // MARK: - Supabase Configuration
    // Même backend que la web app pour partager les données
    static let supabaseURL = "https://fgthoyilfupywmpmiuwd.supabase.co"
    static let supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndGhveWlsZnVweXdtcG1pdXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTE4OTAsImV4cCI6MjA3NTY2Nzg5MH0._X7ouZG-SqvQ-iU1zWTvFRJ1WRwbothNjMDUk5LkJMA"

    // MARK: - App Information

    static let appName = "EasyCo"
    static let appVersion = "1.0.0"
    static let bundleIdentifier = "com.easyco.app"

    // MARK: - Feature Flags

    /// Permet d'activer/désactiver des features facilement
    struct FeatureFlags {
        static let enablePushNotifications = true
        static let enableOfflineMode = false
        static let enableMatchingAlgorithm = true
        static let enableInAppPurchases = false
        static let enableBiometricAuth = true
        static let showDebugInfo: Bool = {
            #if DEBUG
            return true
            #else
            return false
            #endif
        }()
        /// Mode démo: désactivé pour utiliser le vrai backend Supabase
        /// Mettre à true pour les tests sans connexion réseau
        static let demoMode = false
    }

    // MARK: - Pagination

    struct Pagination {
        static let defaultPageSize = 20
        static let maxPageSize = 100
    }

    // MARK: - Cache

    struct Cache {
        static let imagesCacheDuration: TimeInterval = 7 * 24 * 60 * 60 // 7 jours
        static let dataCacheDuration: TimeInterval = 5 * 60 // 5 minutes
    }

    // MARK: - Validation

    struct Validation {
        static let minPasswordLength = 8
        static let maxMessageLength = 500
        static let maxBioLength = 300
    }

    // MARK: - URLs

    struct URLs {
        static let privacyPolicy = "https://easyco.be/privacy"
        static let termsOfService = "https://easyco.be/terms"
        static let support = "https://easyco.be/support"
        static let contactEmail = "support@easyco.be"
    }
}
