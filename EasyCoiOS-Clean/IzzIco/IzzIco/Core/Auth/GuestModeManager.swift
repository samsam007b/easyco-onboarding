//
//  GuestModeManager.swift
//  IzzIco
//
//  Gère l'état guest vs authenticated de l'application
//

import SwiftUI
import Combine

// MARK: - Guest Mode Manager

@MainActor
class GuestModeManager: ObservableObject {
    static let shared = GuestModeManager()

    // MARK: - Published Properties

    @Published var isGuestMode: Bool = false
    @Published var hasSeenWelcome: Bool = false
    @Published var shouldShowWelcome: Bool = false

    // MARK: - User Defaults Keys

    private let hasSeenWelcomeKey = "hasSeenWelcome"
    private let isGuestModeKey = "isGuestMode"

    // MARK: - Initialization

    private init() {
        loadState()
    }

    // MARK: - State Management

    private func loadState() {
        hasSeenWelcome = UserDefaults.standard.bool(forKey: hasSeenWelcomeKey)
        isGuestMode = UserDefaults.standard.bool(forKey: isGuestModeKey)

        // Show welcome if not seen and not authenticated
        if !hasSeenWelcome && !AuthManager.shared.isAuthenticated {
            shouldShowWelcome = true
        }
    }

    func markWelcomeAsSeen() {
        hasSeenWelcome = true
        UserDefaults.standard.set(true, forKey: hasSeenWelcomeKey)
    }

    func enableGuestMode() {
        isGuestMode = true
        UserDefaults.standard.set(true, forKey: isGuestModeKey)
        markWelcomeAsSeen()
    }

    func disableGuestMode() {
        isGuestMode = false
        UserDefaults.standard.set(false, forKey: isGuestModeKey)
    }

    func reset() {
        hasSeenWelcome = false
        isGuestMode = false
        shouldShowWelcome = false
        UserDefaults.standard.removeObject(forKey: hasSeenWelcomeKey)
        UserDefaults.standard.removeObject(forKey: isGuestModeKey)
    }

    // MARK: - Feature Access Control

    func canAccessFeature(_ feature: AppFeature) -> Bool {
        // If authenticated, all features are accessible
        if AuthManager.shared.isAuthenticated {
            return true
        }

        // In guest mode, only browsing features are accessible
        if isGuestMode {
            return feature.isAvailableInGuestMode
        }

        // Not authenticated and not in guest mode - no features accessible
        return false
    }

    func showLoginPrompt(for feature: AppFeature) -> (title: String, message: String) {
        switch feature {
        case .favorites:
            return (
                "Connectez-vous pour sauvegarder",
                "Créez un compte pour sauvegarder vos propriétés favorites et y accéder depuis n'importe où."
            )
        case .messages:
            return (
                "Connectez-vous pour discuter",
                "Créez un compte pour échanger avec les propriétaires et les colocataires."
            )
        case .applications:
            return (
                "Connectez-vous pour postuler",
                "Créez un compte pour postuler aux propriétés qui vous intéressent."
            )
        case .profile:
            return (
                "Créez votre profil",
                "Connectez-vous pour compléter votre profil et maximiser vos chances de trouver la colocation idéale."
            )
        case .groups:
            return (
                "Rejoignez la communauté",
                "Créez un compte pour rejoindre des groupes de recherche et trouver des colocataires."
            )
        default:
            return (
                "Connexion requise",
                "Cette fonctionnalité nécessite un compte. Créez-en un gratuitement pour continuer."
            )
        }
    }
}

// MARK: - App Features

enum AppFeature {
    // Accessible in guest mode
    case propertiesList
    case propertyDetail
    case search
    case map

    // Requires authentication
    case favorites
    case messages
    case applications
    case profile
    case groups
    case bookings

    var isAvailableInGuestMode: Bool {
        switch self {
        case .propertiesList, .propertyDetail, .search, .map:
            return true
        default:
            return false
        }
    }

    var displayName: String {
        switch self {
        case .propertiesList: return "Explorer"
        case .propertyDetail: return "Détails"
        case .search: return "Recherche"
        case .map: return "Carte"
        case .favorites: return "Favoris"
        case .messages: return "Messages"
        case .applications: return "Candidatures"
        case .profile: return "Profil"
        case .groups: return "Groupes"
        case .bookings: return "Réservations"
        }
    }
}

// MARK: - Locked Feature View

struct LockedFeatureView: View {
    let feature: AppFeature
    @State private var showLoginSheet = false

    var body: some View {
        contentView
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color(hex: "F9FAFB"))
            .sheet(isPresented: $showLoginSheet) {
                AuthNavigationView()
            }
    }

    private var contentView: some View {
        VStack(spacing: 24) {
            lockIcon
            textContent
            ctaButton
            guestButton
        }
    }

    private var lockIcon: some View {
        ZStack {
            let gradientColors = [
                Color(hex: "FFA040").opacity(0.1),
                Color(hex: "FFB85C").opacity(0.1)
            ]
            let gradient = LinearGradient(
                colors: gradientColors,
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            Circle()
                .fill(gradient)
                .frame(width: 100, height: 100)

            Image(systemName: "lock.fill")
                .font(.system(size: 40))
                .foregroundColor(Color(hex: "FFA040"))
        }
    }

    private var textContent: some View {
        VStack(spacing: 12) {
            let prompt = GuestModeManager.shared.showLoginPrompt(for: feature)

            Text(prompt.title)
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(Color(hex: "111827"))
                .multilineTextAlignment(.center)

            Text(prompt.message)
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "6B7280"))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
        }
    }

    private var ctaButton: some View {
        Button(action: {
            showLoginSheet = true
        }) {
            ctaButtonContent
        }
        .padding(.horizontal, 32)
    }

    private var ctaButtonContent: some View {
        let buttonGradient = LinearGradient(
            colors: [Color(hex: "FFA040"), Color(hex: "FFB85C"), Color(hex: "FFD080")],
            startPoint: .leading,
            endPoint: .trailing
        )

        return HStack(spacing: 8) {
            Image(systemName: "person.fill")
                .font(.system(size: 16, weight: .semibold))
            Text("Créer mon compte")
                .font(.system(size: 16, weight: .semibold))
        }
        .foregroundColor(.white)
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .background(buttonGradient)
        .cornerRadius(999)
        .shadow(color: Color(hex: "FFA040").opacity(0.3), radius: 8, x: 0, y: 4)
    }

    private var guestButton: some View {
        Button(action: {
            // Dismiss back to browsing
        }) {
            Text("Continuer la navigation")
                .font(.system(size: 15, weight: .medium))
                .foregroundColor(Color(hex: "6B7280"))
                .underline()
        }
    }
}

// MARK: - Preview

struct LockedFeatureView_Previews: PreviewProvider {
    static var previews: some View {
        LockedFeatureView(feature: .favorites)
    }
}
