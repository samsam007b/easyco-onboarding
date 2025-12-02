import SwiftUI

// MARK: - Profile View

struct ProfileView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var showEditProfile = false
    @State private var showLogoutAlert = false
    @State private var showSettings = false

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.Colors.backgroundSecondary
                    .ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 24) {
                        // Header with avatar and name
                        profileHeader

                        // Stats cards
                        statsSection

                        // Quick actions
                        quickActionsSection

                        // Menu sections
                        menuSections
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 40)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Profil")
                        .font(Theme.Typography.title3())
                        .foregroundColor(Theme.Colors.textPrimary)
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showSettings = true }) {
                        Image.lucide("settings")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 20, height: 20)
                            .foregroundColor(Theme.Colors.textPrimary)
                    }
                }
            }
            .sheet(isPresented: $showEditProfile) {
                EditProfileModernView()
            }
            .sheet(isPresented: $showSettings) {
                SettingsView()
            }
            .alert("Déconnexion", isPresented: $showLogoutAlert) {
                Button("Annuler", role: .cancel) {}
                Button("Déconnexion", role: .destructive) {
                    Task {
                        await authManager.logout()
                    }
                }
            } message: {
                Text("Êtes-vous sûr de vouloir vous déconnecter ?")
            }
        }
    }

    // MARK: - Profile Header

    private var profileHeader: some View {
        VStack(spacing: 16) {
            // Avatar with edit button
            ZStack(alignment: .bottomTrailing) {
                if let profileImageURL = authManager.currentUser?.profileImageURL,
                   let url = URL(string: profileImageURL) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        avatarPlaceholder
                    }
                    .frame(width: 120, height: 120)
                    .clipShape(Circle())
                } else {
                    avatarPlaceholder
                }

                // Edit avatar button
                Button(action: {
                    showEditProfile = true
                }) {
                    Image.lucide("camera")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 16, height: 16)
                        .foregroundColor(.white)
                        .frame(width: 36, height: 36)
                        .background(Theme.Colors.primaryGradient)
                        .clipShape(Circle())
                        .shadow(color: Theme.Colors.primary.opacity(0.3), radius: 4, y: 2)
                }
            }

            // Name and email
            VStack(spacing: 6) {
                Text(displayName)
                    .font(.system(size: 26, weight: .bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(authManager.currentUser?.email ?? "")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            // Edit profile button
            Button(action: { showEditProfile = true }) {
                HStack(spacing: 8) {
                    Image.lucide("edit")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 16, height: 16)

                    Text("Modifier le profil")
                        .font(Theme.Typography.body(.semibold))
                }
                .foregroundColor(Theme.Colors.primary)
                .frame(height: Theme.Size.buttonHeight)
                .padding(.horizontal, 24)
                .background(Theme.Colors.backgroundPrimary)
                .cornerRadius(Theme.CornerRadius.button)
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.CornerRadius.button)
                        .stroke(Theme.Colors.primary, lineWidth: 1.5)
                )
            }
        }
        .padding(.top, 20)
    }

    // MARK: - Stats Section

    private var statsSection: some View {
        HStack(spacing: 12) {
            ProfileStatCard(
                icon: "eye",
                value: "24",
                label: "Vues",
                color: Theme.Colors.info
            )

            ProfileStatCard(
                icon: "heart",
                value: "12",
                label: "Favoris",
                color: Theme.Colors.error
            )

            ProfileStatCard(
                icon: "users",
                value: "5",
                label: "Matchs",
                color: Theme.Colors.success
            )
        }
    }

    // MARK: - Quick Actions

    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Actions rapides")
                .font(Theme.Typography.bodyLarge(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)
                .padding(.horizontal, 4)

            HStack(spacing: 12) {
                ProfileQuickActionCard(
                    icon: "heart",
                    title: "Favoris",
                    color: Theme.Colors.error,
                    destination: FavoritesView()
                )

                ProfileQuickActionCard(
                    icon: "file-text",
                    title: "Annonces",
                    color: Theme.Colors.primary,
                    destination: AnnouncementsView()
                )
            }
        }
    }

    // MARK: - Menu Sections

    private var menuSections: some View {
        VStack(spacing: 24) {
            // Account section
            MenuSection(title: "Compte") {
                ProfileMenuCard(
                    icon: "user",
                    title: "Informations personnelles",
                    subtitle: "Nom, email, téléphone",
                    destination: EditProfileModernView()
                )

                ProfileMenuCard(
                    icon: "bell",
                    title: "Notifications",
                    subtitle: "Gérer vos préférences",
                    destination: NotificationsListView()
                )

                ProfileMenuCard(
                    icon: "shield",
                    title: "Confidentialité",
                    subtitle: "Données et sécurité",
                    destination: SimplePrivacyView()
                )
            }

            // Support section
            MenuSection(title: "Support") {
                ProfileMenuCard(
                    icon: "help-circle",
                    title: "Aide et FAQ",
                    subtitle: "Besoin d'assistance ?",
                    destination: SimpleHelpView()
                )

                ProfileMenuCard(
                    icon: "message-circle",
                    title: "Nous contacter",
                    subtitle: "support@easyco.fr",
                    destination: Text("Contact")
                )
            }

            // Logout button
            Button(action: {
                showLogoutAlert = true
            }) {
                HStack(spacing: 12) {
                    Image.lucide("log-out")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)

                    Text("Déconnexion")
                        .font(Theme.Typography.body(.semibold))

                    Spacer()
                }
                .foregroundColor(Theme.Colors.error)
                .padding(16)
                .background(Theme.Colors.backgroundPrimary)
                .cornerRadius(Theme.CornerRadius.card)
                .cardShadow()
            }
            .buttonStyle(PlainButtonStyle())
        }
    }

    // MARK: - Computed Properties

    private var displayName: String {
        guard let user = authManager.currentUser else { return "" }

        if let firstName = user.firstName, let lastName = user.lastName {
            return "\(firstName) \(lastName)"
        } else if let firstName = user.firstName {
            return firstName
        } else if let lastName = user.lastName {
            return lastName
        } else {
            return user.email
        }
    }

    private var initials: String {
        guard let user = authManager.currentUser else { return "?" }

        if let firstName = user.firstName, let lastName = user.lastName {
            return "\(firstName.prefix(1))\(lastName.prefix(1))".uppercased()
        } else if let firstName = user.firstName {
            return String(firstName.prefix(1)).uppercased()
        } else if let lastName = user.lastName {
            return String(lastName.prefix(1)).uppercased()
        } else {
            return String(user.email.prefix(1)).uppercased()
        }
    }

    private var avatarPlaceholder: some View {
        Circle()
            .fill(Theme.Colors.primaryGradient)
            .frame(width: 120, height: 120)
            .overlay {
                Text(initials)
                    .font(.system(size: 40, weight: .bold))
                    .foregroundColor(.white)
            }
    }
}

// MARK: - Supporting Views

struct ProfileStatCard: View {
    let icon: String
    let value: String
    let label: String
    let color: Color

    var body: some View {
        VStack(spacing: 8) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 24, height: 24)
                .foregroundColor(color)

            Text(value)
                .font(.system(size: 22, weight: .bold))
                .foregroundColor(Theme.Colors.textPrimary)

            Text(label)
                .font(Theme.Typography.caption())
                .foregroundColor(Theme.Colors.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 20)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }
}

struct ProfileQuickActionCard<Destination: View>: View {
    let icon: String
    let title: String
    let color: Color
    let destination: Destination

    var body: some View {
        NavigationLink(destination: destination) {
            VStack(spacing: 12) {
                Image.lucide(icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 32, height: 32)
                    .foregroundColor(.white)
                    .frame(width: 60, height: 60)
                    .background(
                        LinearGradient(
                            colors: [color, color.opacity(0.8)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .cornerRadius(16)

                Text(title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 20)
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.card)
            .cardShadow()
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct MenuSection<Content: View>: View {
    let title: String
    let content: Content

    init(title: String, @ViewBuilder content: () -> Content) {
        self.title = title
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(Theme.Typography.bodyLarge(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)
                .padding(.horizontal, 4)

            VStack(spacing: 1) {
                content
            }
        }
    }
}

struct ProfileMenuCard<Destination: View>: View {
    let icon: String
    let title: String
    let subtitle: String
    let destination: Destination

    var body: some View {
        NavigationLink(destination: destination) {
            HStack(spacing: 16) {
                Image.lucide(icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 20, height: 20)
                    .foregroundColor(Theme.Colors.primary)
                    .frame(width: 44, height: 44)
                    .background(Theme.Colors.primary.opacity(0.1))
                    .cornerRadius(12)

                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text(subtitle)
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                Spacer()

                Image.lucide("chevron-right")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 16, height: 16)
                    .foregroundColor(Theme.Colors.textTertiary)
            }
            .padding(16)
            .background(Theme.Colors.backgroundPrimary)
            .contentShape(Rectangle())
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Legacy Support Views (kept for compatibility)

struct ProfileMenuItemRow: View {
    let icon: String
    let title: String

    var body: some View {
        HStack(spacing: Theme.Spacing.md) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 20, height: 20)
                .foregroundColor(Theme.Colors.primary)
                .frame(width: 30)

            Text(title)
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textPrimary)

            Spacer()

            Image.lucide("chevron-right")
                .resizable()
                .scaledToFit()
                .frame(width: 12, height: 12)
                .foregroundColor(Theme.Colors.textTertiary)
        }
        .padding()
        .background(Theme.Colors.backgroundSecondary)
        .cornerRadius(Theme.CornerRadius.md)
    }
}

struct ProfileMenuItem: View {
    let icon: String
    let title: String
    var isDestructive: Bool = false
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: Theme.Spacing.md) {
                Image.lucide(icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 20, height: 20)
                    .foregroundColor(isDestructive ? Theme.Colors.error : Theme.Colors.primary)
                    .frame(width: 30)

                Text(title)
                    .font(Theme.Typography.body())
                    .foregroundColor(isDestructive ? Theme.Colors.error : Theme.Colors.textPrimary)

                Spacer()

                Image.lucide("chevron-right")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 12, height: 12)
                    .foregroundColor(Theme.Colors.textTertiary)
            }
            .padding()
            .background(Theme.Colors.backgroundSecondary)
            .cornerRadius(Theme.CornerRadius.md)
        }
    }
}

// MARK: - Simple Privacy View

struct SimplePrivacyView: View {
    var body: some View {
        List {
            Section("Confidentialité") {
                NavigationLink("Données personnelles") {
                    Text("Vos données personnelles - À venir")
                }
                NavigationLink("Paramètres de confidentialité") {
                    Text("Paramètres - À venir")
                }
                NavigationLink("Supprimer mon compte") {
                    Text("Suppression de compte - À venir")
                }
            }
        }
        .navigationTitle("Confidentialité")
        .navigationBarTitleDisplayMode(.large)
    }
}

// MARK: - Simple Help View

struct SimpleHelpView: View {
    var body: some View {
        List {
            Section("Support") {
                NavigationLink("FAQ") {
                    Text("FAQ - À venir")
                }
                NavigationLink("Nous contacter") {
                    Text("Contact - À venir")
                }
                NavigationLink("Conditions d'utilisation") {
                    Text("CGU - À venir")
                }
            }

            Section("Contact") {
                HStack {
                    Text("Email")
                    Spacer()
                    Text("support@easyco.fr")
                        .foregroundColor(Theme.Colors.textSecondary)
                }
                HStack {
                    Text("Téléphone")
                    Spacer()
                    Text("+33 1 23 45 67 89")
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }
        }
        .navigationTitle("Aide")
        .navigationBarTitleDisplayMode(.large)
    }
}

// MARK: - Legacy Edit Profile (kept for compatibility)

struct EditProfileView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            Form {
                Section("Informations personnelles") {
                    TextField("Nom", text: .constant(""))
                    TextField("Email", text: .constant(""))
                }
            }
            .navigationTitle("Modifier le profil")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") { dismiss() }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Enregistrer") { dismiss() }
                }
            }
        }
    }
}

// MARK: - Modern Edit Profile View

struct EditProfileModernView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var email = ""
    @State private var phone = ""
    @State private var bio = ""
    @State private var showImagePicker = false

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.Colors.backgroundSecondary
                    .ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 24) {
                        // Profile photo section
                        VStack(spacing: 16) {
                            Button(action: {
                                showImagePicker = true
                            }) {
                                ZStack(alignment: .bottomTrailing) {
                                    Circle()
                                        .fill(Theme.Colors.primaryGradient)
                                        .frame(width: 120, height: 120)
                                        .overlay {
                                            Image.lucide("user")
                                                .resizable()
                                                .scaledToFit()
                                                .frame(width: 50, height: 50)
                                                .foregroundColor(.white)
                                        }

                                    Image.lucide("camera")
                                        .resizable()
                                        .scaledToFit()
                                        .frame(width: 16, height: 16)
                                        .foregroundColor(.white)
                                        .frame(width: 36, height: 36)
                                        .background(Theme.Colors.primary)
                                        .clipShape(Circle())
                                        .shadow(color: .black.opacity(0.2), radius: 4, y: 2)
                                }
                            }

                            Text("Changer la photo de profil")
                                .font(Theme.Typography.bodySmall())
                                .foregroundColor(Theme.Colors.primary)
                        }
                        .padding(.top, 20)

                        // Form fields
                        VStack(alignment: .leading, spacing: 20) {
                            // Name
                            VStack(alignment: .leading, spacing: 12) {
                                VStack(alignment: .leading, spacing: 8) {
                                    Text("Prénom")
                                        .font(Theme.Typography.bodySmall(.semibold))
                                        .foregroundColor(Theme.Colors.textPrimary)

                                    TextField("Votre prénom", text: $firstName)
                                        .font(Theme.Typography.body())
                                        .foregroundColor(Theme.Colors.textPrimary)
                                        .padding(16)
                                        .background(Theme.Colors.backgroundPrimary)
                                        .cornerRadius(Theme.CornerRadius.md)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                                                .stroke(Theme.Colors.gray200, lineWidth: 1)
                                        )
                                }

                                VStack(alignment: .leading, spacing: 8) {
                                    Text("Nom")
                                        .font(Theme.Typography.bodySmall(.semibold))
                                        .foregroundColor(Theme.Colors.textPrimary)

                                    TextField("Votre nom", text: $lastName)
                                        .font(Theme.Typography.body())
                                        .foregroundColor(Theme.Colors.textPrimary)
                                        .padding(16)
                                        .background(Theme.Colors.backgroundPrimary)
                                        .cornerRadius(Theme.CornerRadius.md)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                                                .stroke(Theme.Colors.gray200, lineWidth: 1)
                                        )
                                }
                            }

                            // Contact
                            VStack(alignment: .leading, spacing: 12) {
                                VStack(alignment: .leading, spacing: 8) {
                                    Text("Email")
                                        .font(Theme.Typography.bodySmall(.semibold))
                                        .foregroundColor(Theme.Colors.textPrimary)

                                    TextField("votre@email.com", text: $email)
                                        .font(Theme.Typography.body())
                                        .foregroundColor(Theme.Colors.textPrimary)
                                        .padding(16)
                                        .background(Theme.Colors.backgroundPrimary)
                                        .cornerRadius(Theme.CornerRadius.md)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                                                .stroke(Theme.Colors.gray200, lineWidth: 1)
                                        )
                                        .keyboardType(.emailAddress)
                                }

                                VStack(alignment: .leading, spacing: 8) {
                                    Text("Téléphone")
                                        .font(Theme.Typography.bodySmall(.semibold))
                                        .foregroundColor(Theme.Colors.textPrimary)

                                    TextField("+33 6 12 34 56 78", text: $phone)
                                        .font(Theme.Typography.body())
                                        .foregroundColor(Theme.Colors.textPrimary)
                                        .padding(16)
                                        .background(Theme.Colors.backgroundPrimary)
                                        .cornerRadius(Theme.CornerRadius.md)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                                                .stroke(Theme.Colors.gray200, lineWidth: 1)
                                        )
                                        .keyboardType(.phonePad)
                                }
                            }

                            // Bio
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Bio")
                                    .font(Theme.Typography.bodySmall(.semibold))
                                    .foregroundColor(Theme.Colors.textPrimary)

                                TextEditor(text: $bio)
                                    .font(Theme.Typography.body())
                                    .foregroundColor(Theme.Colors.textPrimary)
                                    .frame(height: 100)
                                    .padding(12)
                                    .background(Theme.Colors.backgroundPrimary)
                                    .cornerRadius(Theme.CornerRadius.md)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                                            .stroke(Theme.Colors.gray200, lineWidth: 1)
                                    )
                            }
                        }
                        .padding(.horizontal)
                    }
                    .padding(.bottom, 100)
                }

                // Bottom buttons
                VStack {
                    Spacer()

                    VStack(spacing: 12) {
                        Button(action: { dismiss() }) {
                            Text("Enregistrer les modifications")
                                .font(Theme.Typography.body(.semibold))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .frame(height: Theme.Size.buttonHeight)
                                .background(Theme.Colors.primaryGradient)
                                .cornerRadius(Theme.CornerRadius.button)
                        }

                        Button(action: { dismiss() }) {
                            Text("Annuler")
                                .font(Theme.Typography.body(.semibold))
                                .foregroundColor(Theme.Colors.textPrimary)
                                .frame(maxWidth: .infinity)
                                .frame(height: Theme.Size.buttonHeight)
                                .background(Theme.Colors.backgroundPrimary)
                                .cornerRadius(Theme.CornerRadius.button)
                                .overlay(
                                    RoundedRectangle(cornerRadius: Theme.CornerRadius.button)
                                        .stroke(Theme.Colors.gray200, lineWidth: 1)
                                )
                        }
                    }
                    .padding()
                    .background(.ultraThinMaterial)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Modifier le profil")
                        .font(Theme.Typography.title3())
                        .foregroundColor(Theme.Colors.textPrimary)
                }
            }
        }
    }
}

// MARK: - Preview

struct ProfileView_Previews: PreviewProvider {
    static var previews: some View {
        ProfileView()
            .environmentObject(AuthManager.shared)
    }
}
