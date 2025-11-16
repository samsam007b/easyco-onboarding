import SwiftUI

// MARK: - Profile View

struct ProfileView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var showEditProfile = false
    @State private var showLogoutAlert = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: Theme.Spacing.lg) {
                    // Header
                    VStack(spacing: Theme.Spacing.md) {
                        // Avatar
                        if let avatarUrl = authManager.currentUser?.avatarUrl,
                           let url = URL(string: avatarUrl) {
                            AsyncImage(url: url) { image in
                                image
                                    .resizable()
                                    .aspectRatio(contentMode: .fill)
                            } placeholder: {
                                avatarPlaceholder
                            }
                            .frame(width: 100, height: 100)
                            .clipShape(Circle())
                        } else {
                            avatarPlaceholder
                        }

                        // Name
                        Text(authManager.currentUser?.displayName ?? "")
                            .font(Theme.Typography.title2())
                            .foregroundColor(Theme.Colors.textPrimary)

                        // Email
                        Text(authManager.currentUser?.email ?? "")
                            .font(Theme.Typography.body())
                            .foregroundColor(Theme.Colors.textSecondary)

                        // Verified Badge
                        if authManager.currentUser?.isVerified == true {
                            HStack(spacing: Theme.Spacing.xs) {
                                Image(systemName: "checkmark.seal.fill")
                                Text("Vérifié")
                            }
                            .font(Theme.Typography.bodySmall(.semibold))
                            .foregroundColor(Theme.Colors.success)
                        }

                        // Edit Button
                        Button {
                            showEditProfile = true
                        } label: {
                            Text("Modifier le profil")
                                .font(Theme.Typography.body(.semibold))
                                .foregroundColor(Theme.Colors.primary)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Theme.Colors.primary.opacity(0.1))
                                .cornerRadius(Theme.CornerRadius.md)
                        }
                        .padding(.horizontal)
                    }
                    .padding(.top, Theme.Spacing.lg)

                    // Menu Items
                    VStack(spacing: 0) {
                        ProfileMenuItem(icon: "person.fill", title: "Mes informations") {}
                        ProfileMenuItem(icon: "heart.fill", title: "Mes favoris") {}
                        ProfileMenuItem(icon: "doc.text.fill", title: "Mes annonces") {}
                        ProfileMenuItem(icon: "bell.fill", title: "Notifications") {}
                        ProfileMenuItem(icon: "lock.fill", title: "Confidentialité") {}
                        ProfileMenuItem(icon: "questionmark.circle.fill", title: "Aide") {}

                        Divider()
                            .padding(.vertical, Theme.Spacing.sm)

                        ProfileMenuItem(icon: "rectangle.portrait.and.arrow.right", title: "Déconnexion", isDestructive: true) {
                            showLogoutAlert = true
                        }
                    }
                    .padding(.horizontal)
                }
            }
            .navigationTitle("Profil")
            .sheet(isPresented: $showEditProfile) {
                EditProfileView()
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

    private var avatarPlaceholder: some View {
        Circle()
            .fill(Theme.Colors.primary.opacity(0.2))
            .frame(width: 100, height: 100)
            .overlay {
                Text(authManager.currentUser?.initials ?? "")
                    .font(Theme.Typography.title1(.bold))
                    .foregroundColor(Theme.Colors.primary)
            }
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
                Image(systemName: icon)
                    .font(.title3)
                    .foregroundColor(isDestructive ? Theme.Colors.error : Theme.Colors.primary)
                    .frame(width: 30)

                Text(title)
                    .font(Theme.Typography.body())
                    .foregroundColor(isDestructive ? Theme.Colors.error : Theme.Colors.textPrimary)

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundColor(Theme.Colors.textTertiary)
            }
            .padding()
            .background(Theme.Colors.backgroundSecondary)
            .cornerRadius(Theme.CornerRadius.md)
        }
    }
}

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

#Preview {
    ProfileView()
        .environmentObject(AuthManager.shared)
}
