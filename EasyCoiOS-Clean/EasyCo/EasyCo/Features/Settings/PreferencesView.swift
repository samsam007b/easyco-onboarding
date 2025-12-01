import SwiftUI

// MARK: - Preferences View

struct PreferencesView: View {
    @StateObject private var viewModel = PreferencesViewModel()

    var body: some View {
        NavigationStack {
            Form {
                // Language Section
                Section {
                    Picker("Langue", selection: $viewModel.selectedLanguage) {
                        ForEach(Language.allCases, id: \.self) { language in
                            Text(language.name).tag(language)
                        }
                    }
                } header: {
                    Text("Langue")
                }

                // Theme Section
                Section {
                    Picker("Thème", selection: $viewModel.selectedTheme) {
                        ForEach(AppTheme.allCases, id: \.self) { theme in
                            HStack {
                                Image(systemName: theme.icon)
                                Text(theme.displayName)
                            }
                            .tag(theme)
                        }
                    }
                } header: {
                    Text("Apparence")
                }

                // Search Preferences (for Searcher role)
                Section {
                    Toggle("Recevoir des suggestions automatiques", isOn: $viewModel.autoSuggestions)
                    Toggle("Activer les alertes de nouvelles propriétés", isOn: $viewModel.newPropertyAlerts)
                } header: {
                    Text("Recherche")
                }

                // Privacy Section
                Section {
                    Toggle("Profil visible par les propriétaires", isOn: $viewModel.profileVisible)
                    Toggle("Afficher mon statut en ligne", isOn: $viewModel.showOnlineStatus)
                } header: {
                    Text("Confidentialité")
                }

                // Notifications Section
                Section {
                    Toggle("Notifications push", isOn: $viewModel.pushNotifications)
                    Toggle("Notifications par email", isOn: $viewModel.emailNotifications)
                } header: {
                    Text("Notifications")
                }
            }
            .navigationTitle("Préférences")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

// MARK: - Theme Enum

enum AppTheme: String, CaseIterable {
    case system = "system"
    case light = "light"
    case dark = "dark"

    var displayName: String {
        switch self {
        case .system: return "Système"
        case .light: return "Clair"
        case .dark: return "Sombre"
        }
    }

    var icon: String {
        switch self {
        case .system: return "circle.lefthalf.filled"
        case .light: return "sun.max.fill"
        case .dark: return "moon.fill"
        }
    }
}

// MARK: - Preferences ViewModel

class PreferencesViewModel: ObservableObject {
    @Published var selectedLanguage: Language = .fr
    @Published var selectedTheme: AppTheme = .system
    @Published var autoSuggestions: Bool = true
    @Published var newPropertyAlerts: Bool = true
    @Published var profileVisible: Bool = true
    @Published var showOnlineStatus: Bool = false
    @Published var pushNotifications: Bool = true
    @Published var emailNotifications: Bool = false

    init() {
        loadPreferences()
    }

    private func loadPreferences() {
        // Load from UserDefaults
        if let languageRaw = UserDefaults.standard.string(forKey: "app_language"),
           let language = Language(rawValue: languageRaw) {
            selectedLanguage = language
        }

        if let themeRaw = UserDefaults.standard.string(forKey: "app_theme"),
           let theme = AppTheme(rawValue: themeRaw) {
            selectedTheme = theme
        }

        autoSuggestions = UserDefaults.standard.bool(forKey: "auto_suggestions")
        newPropertyAlerts = UserDefaults.standard.bool(forKey: "new_property_alerts")
        profileVisible = UserDefaults.standard.bool(forKey: "profile_visible")
        showOnlineStatus = UserDefaults.standard.bool(forKey: "show_online_status")
        pushNotifications = UserDefaults.standard.bool(forKey: "push_notifications")
        emailNotifications = UserDefaults.standard.bool(forKey: "email_notifications")
    }

    func savePreferences() {
        UserDefaults.standard.set(selectedLanguage.rawValue, forKey: "app_language")
        UserDefaults.standard.set(selectedTheme.rawValue, forKey: "app_theme")
        UserDefaults.standard.set(autoSuggestions, forKey: "auto_suggestions")
        UserDefaults.standard.set(newPropertyAlerts, forKey: "new_property_alerts")
        UserDefaults.standard.set(profileVisible, forKey: "profile_visible")
        UserDefaults.standard.set(showOnlineStatus, forKey: "show_online_status")
        UserDefaults.standard.set(pushNotifications, forKey: "push_notifications")
        UserDefaults.standard.set(emailNotifications, forKey: "email_notifications")
    }
}

// MARK: - Preview

struct PreferencesView_Previews: PreviewProvider {
    static var previews: some View {
        PreferencesView()
    }
}
