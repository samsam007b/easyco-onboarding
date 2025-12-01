import SwiftUI

// MARK: - Settings View (Web App Design)

struct SettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var authManager: AuthManager
    @EnvironmentObject var languageManager: LanguageManager
    @State private var showRoleSwitcher = false
    @State private var showLanguageSettings = false
    @State private var notificationsEnabled = true

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Account Section
                    settingsSection(title: "Compte") {
                        SettingsRow(
                            icon: "person.crop.circle",
                            title: "Rôle actuel",
                            value: authManager.currentUser?.userType.displayName ?? "Non défini",
                            color: Color(hex: "FFA040")
                        ) {
                            showRoleSwitcher = true
                        }

                        Divider()
                            .padding(.leading, 52)

                        SettingsRow(
                            icon: "envelope.fill",
                            title: "Email",
                            value: authManager.currentUser?.email ?? "",
                            color: Color(hex: "3B82F6")
                        ) {}

                        Divider()
                            .padding(.leading, 52)

                        SettingsRow(
                            icon: "key.fill",
                            title: "Mot de passe",
                            value: "••••••••",
                            color: Color(hex: "6B7280")
                        ) {}
                    }

                    // Preferences Section
                    settingsSection(title: "Préférences") {
                        SettingsRow(
                            icon: "globe",
                            title: "Langue",
                            value: languageManager.currentLanguage.name,
                            color: Color(hex: "10B981")
                        ) {
                            showLanguageSettings = true
                        }

                        Divider()
                            .padding(.leading, 52)

                        SettingsToggleRow(
                            icon: "bell.fill",
                            title: "Notifications",
                            isOn: $notificationsEnabled,
                            color: Color(hex: "FBBF24")
                        )

                        Divider()
                            .padding(.leading, 52)

                        SettingsRow(
                            icon: "paintbrush.fill",
                            title: "Thème",
                            value: "Clair",
                            color: Color(hex: "6E56CF")
                        ) {}
                    }

                    // Privacy Section
                    settingsSection(title: "Confidentialité & Sécurité") {
                        SettingsRow(
                            icon: "lock.fill",
                            title: "Confidentialité",
                            value: "",
                            color: Color(hex: "374151")
                        ) {}

                        Divider()
                            .padding(.leading, 52)

                        SettingsRow(
                            icon: "shield.fill",
                            title: "Sécurité",
                            value: "",
                            color: Color(hex: "EF4444")
                        ) {}
                    }

                    // Support Section
                    settingsSection(title: "Support") {
                        SettingsRow(
                            icon: "questionmark.circle.fill",
                            title: "Centre d'aide",
                            value: "",
                            color: Color(hex: "10B981")
                        ) {}

                        Divider()
                            .padding(.leading, 52)

                        SettingsRow(
                            icon: "envelope.fill",
                            title: "Nous contacter",
                            value: "",
                            color: Color(hex: "3B82F6")
                        ) {}

                        Divider()
                            .padding(.leading, 52)

                        SettingsRow(
                            icon: "doc.text.fill",
                            title: "Conditions d'utilisation",
                            value: "",
                            color: Color(hex: "6B7280")
                        ) {}
                    }

                    // Logout Button
                    Button(action: {
                        Task {
                            await authManager.logout()
                            dismiss()
                        }
                    }) {
                        HStack(spacing: 12) {
                            Image(systemName: "rectangle.portrait.and.arrow.right")
                                .font(.system(size: 18))
                                .foregroundColor(Color(hex: "EF4444"))

                            Text("Se déconnecter")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(Color(hex: "EF4444"))

                            Spacer()
                        }
                        .padding(16)
                        .background(Color.white)
                        .cornerRadius(16)
                        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
                    }

                    // App Info
                    VStack(spacing: 12) {
                        Image("HouseIcon")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 60, height: 60)

                        Text("Version 1.0.0")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "9CA3AF"))
                    }
                    .padding(.top, 16)
                    .padding(.bottom, 32)
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Paramètres")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
            }
            .sheet(isPresented: $showRoleSwitcher) {
                RoleSwitcherView()
            }
            .sheet(isPresented: $showLanguageSettings) {
                LanguageSettingsView()
            }
        }
    }

    // MARK: - Settings Section

    private func settingsSection<Content: View>(title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(Color(hex: "6B7280"))
                .padding(.leading, 4)

            VStack(spacing: 0) {
                content()
            }
            .background(Color.white)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
    }
}

// MARK: - Settings Row

struct SettingsRow: View {
    let icon: String
    let title: String
    let value: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 18))
                    .foregroundColor(color)
                    .frame(width: 24)

                Text(title)
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                if !value.isEmpty {
                    Text(value)
                        .font(.system(size: 15))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                Image(systemName: "chevron.right")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }
            .padding(16)
        }
    }
}

// MARK: - Settings Toggle Row

struct SettingsToggleRow: View {
    let icon: String
    let title: String
    @Binding var isOn: Bool
    let color: Color

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundColor(color)
                .frame(width: 24)

            Text(title)
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "111827"))

            Spacer()

            Toggle("", isOn: $isOn)
                .labelsHidden()
                .tint(Color(hex: "FFA040"))
        }
        .padding(16)
    }
}

// MARK: - Role Switcher View

struct RoleSwitcherView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var authManager: AuthManager
    @State private var selectedRole: User.UserType

    init() {
        _selectedRole = State(initialValue: AuthManager.shared.currentUser?.userType ?? .searcher)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Explanation
                    VStack(spacing: 12) {
                        Image(systemName: "arrow.triangle.2.circlepath")
                            .font(.system(size: 48))
                            .foregroundColor(Color(hex: "FFA040"))

                        Text("Changer de rôle")
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(Color(hex: "111827"))

                        Text("Sélectionnez le rôle qui correspond le mieux à votre situation actuelle")
                            .font(.system(size: 15))
                            .foregroundColor(Color(hex: "6B7280"))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 32)
                    }
                    .padding(.top, 32)

                    // Role Cards
                    VStack(spacing: 16) {
                        RoleCard(
                            role: .searcher,
                            title: "Chercheur",
                            description: "Je cherche une colocation",
                            icon: "magnifyingglass",
                            color: Color(hex: "FFA040"),
                            isSelected: selectedRole == .searcher
                        ) {
                            selectedRole = .searcher
                        }

                        RoleCard(
                            role: .owner,
                            title: "Propriétaire",
                            description: "Je propose une colocation",
                            icon: "house.fill",
                            color: Color(hex: "6E56CF"),
                            isSelected: selectedRole == .owner
                        ) {
                            selectedRole = .owner
                        }

                        RoleCard(
                            role: .resident,
                            title: "Résident",
                            description: "Je vis déjà en colocation",
                            icon: "person.fill",
                            color: Color(hex: "E8865D"),
                            isSelected: selectedRole == .resident
                        ) {
                            selectedRole = .resident
                        }
                    }
                    .padding(.horizontal, 16)

                    // Confirm Button
                    Button(action: {
                        _Concurrency.Task {
                            await switchRole()
                        }
                    }) {
                        Text("Confirmer le changement")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(
                                LinearGradient(
                                    colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(16)
                            .shadow(color: Color(hex: "FFA040").opacity(0.3), radius: 8, x: 0, y: 4)
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 24)
                    .padding(.bottom, 32)
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
            }
        }
    }

    private func switchRole() async {
        // Update user role
        if var user = authManager.currentUser {
            user.userType = selectedRole
            authManager.currentUser = user
        }
        dismiss()
    }
}

// MARK: - Role Card

struct RoleCard: View {
    let role: User.UserType
    let title: String
    let description: String
    let icon: String
    let color: Color
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                // Icon
                ZStack {
                    Circle()
                        .fill(color.opacity(0.1))
                        .frame(width: 56, height: 56)

                    Image(systemName: icon)
                        .font(.system(size: 24))
                        .foregroundColor(color)
                }

                // Text
                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))

                    Text(description)
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                Spacer()

                // Checkmark
                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 28))
                        .foregroundColor(color)
                }
            }
            .padding(20)
            .background(Color.white)
            .cornerRadius(16)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(isSelected ? color : Color.clear, lineWidth: 2)
            )
            .shadow(color: isSelected ? color.opacity(0.2) : .black.opacity(0.05), radius: 8, x: 0, y: 4)
        }
    }
}

// MARK: - Language Settings View

struct LanguageSettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var selectedLanguage = "fr"

    var body: some View {
        NavigationStack {
            List {
                LanguageRow(code: "fr", name: "Français", isSelected: selectedLanguage == "fr") {
                    selectedLanguage = "fr"
                }
                LanguageRow(code: "en", name: "English", isSelected: selectedLanguage == "en") {
                    selectedLanguage = "en"
                }
                LanguageRow(code: "nl", name: "Nederlands", isSelected: selectedLanguage == "nl") {
                    selectedLanguage = "nl"
                }
            }
            .navigationTitle("Langue")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Terminé") { dismiss() }
                }
            }
        }
    }
}

struct LanguageRow: View {
    let code: String
    let name: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack {
                Text(name)
                    .foregroundColor(Color(hex: "111827"))
                Spacer()
                if isSelected {
                    Image(systemName: "checkmark")
                        .foregroundColor(Color(hex: "FFA040"))
                }
            }
        }
    }
}

// MARK: - Preview

struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
            .environmentObject(AuthManager.shared)
    }
}
