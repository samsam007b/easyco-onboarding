import SwiftUI

// MARK: - Profile View (Web App Design)

struct ProfileView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var showEditProfile = false
    @State private var showLogoutAlert = false
    @State private var showSettings = false
    @State private var showLifestyle = false
    @State private var showPreferences = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 0) {
                    // Header Card
                    headerCard
                        .padding(16)

                    // Stats Section
                    statsSection
                        .padding(.horizontal, 16)
                        .padding(.bottom, 24)

                    // Menu Items
                    menuSection
                        .padding(.horizontal, 16)
                        .padding(.bottom, 24)

                    // Logout Button
                    logoutButton
                        .padding(.horizontal, 16)
                        .padding(.bottom, 32)
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Profil")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }
            }
            .sheet(isPresented: $showEditProfile) {
                EditProfileView()
            }
            .sheet(isPresented: $showSettings) {
                SettingsView()
            }
            .sheet(isPresented: $showLifestyle) {
                SearcherLifestyleView()
            }
            .sheet(isPresented: $showPreferences) {
                SearcherPreferencesView()
            }
            .alert("Déconnexion", isPresented: $showLogoutAlert) {
                Button("Annuler", role: .cancel) {}
                Button("Déconnexion", role: .destructive) {
                    _Concurrency.Task {
                        await authManager.logout()
                    }
                }
            } message: {
                Text("Êtes-vous sûr de vouloir vous déconnecter ?")
            }
        }
    }

    // MARK: - Header Card

    private var headerCard: some View {
        VStack(spacing: 20) {
            // Avatar
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
                    .frame(width: 100, height: 100)
                    .clipShape(Circle())
                } else {
                    avatarPlaceholder
                }

                // Edit badge
                Button(action: { showEditProfile = true }) {
                    Image(systemName: "pencil")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(width: 32, height: 32)
                        .background(
                            LinearGradient(
                                colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .clipShape(Circle())
                        .shadow(color: .black.opacity(0.2), radius: 4, x: 0, y: 2)
                }
            }

            // Name & Info
            VStack(spacing: 8) {
                Text(displayName)
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                if let email = authManager.currentUser?.email {
                    Text(email)
                        .font(.system(size: 15))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                // User type badge
                if let userType = authManager.currentUser?.userType {
                    HStack(spacing: 6) {
                        Image(systemName: userType.icon)
                            .font(.system(size: 12))
                        Text(userType.displayName)
                            .font(.system(size: 13, weight: .medium))
                    }
                    .foregroundColor(Color(hex: "FFA040"))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Color(hex: "FFF4ED"))
                    .cornerRadius(999)
                }
            }
        }
        .frame(maxWidth: .infinity)
        .padding(24)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
    }

    // MARK: - Stats Section

    private var statsSection: some View {
        HStack(spacing: 12) {
            ProfileStatCard(icon: "eye.fill", value: "234", label: "Vues", color: Color(hex: "FFA040"))
            ProfileStatCard(icon: "heart.fill", value: "12", label: "Favoris", color: Color(hex: "EF4444"))
            ProfileStatCard(icon: "message.fill", value: "8", label: "Messages", color: Color(hex: "6E56CF"))
        }
    }

    // MARK: - Menu Section

    private var menuSection: some View {
        VStack(spacing: 12) {
            MenuCard {
                MenuItemRow(
                    icon: "person.fill",
                    title: "Mes informations",
                    color: Color(hex: "FFA040"),
                    action: { showEditProfile = true }
                )

                Divider()
                    .padding(.leading, 52)

                MenuItemRow(
                    icon: "heart.fill",
                    title: "Mes favoris",
                    color: Color(hex: "EF4444"),
                    action: {}
                )

                Divider()
                    .padding(.leading, 52)

                MenuItemRow(
                    icon: "doc.text.fill",
                    title: "Mes annonces",
                    color: Color(hex: "6E56CF"),
                    action: {}
                )

                Divider()
                    .padding(.leading, 52)

                MenuItemRow(
                    icon: "person.2.fill",
                    title: "Mon style de vie",
                    color: Color(hex: "10B981"),
                    action: { showLifestyle = true }
                )

                Divider()
                    .padding(.leading, 52)

                MenuItemRow(
                    icon: "slider.horizontal.3",
                    title: "Préférences de recherche",
                    color: Color(hex: "3B82F6"),
                    action: { showPreferences = true }
                )

                Divider()
                    .padding(.leading, 52)

                MenuItemRow(
                    icon: "bell.fill",
                    title: "Notifications",
                    color: Color(hex: "FBBF24"),
                    action: {}
                )
            }

            MenuCard {
                MenuItemRow(
                    icon: "gearshape.fill",
                    title: "Paramètres",
                    color: Color(hex: "6B7280"),
                    action: { showSettings = true }
                )

                Divider()
                    .padding(.leading, 52)

                MenuItemRow(
                    icon: "questionmark.circle.fill",
                    title: "Aide & Support",
                    color: Color(hex: "10B981"),
                    action: {}
                )
            }
        }
    }

    // MARK: - Logout Button

    private var logoutButton: some View {
        Button(action: { showLogoutAlert = true }) {
            HStack(spacing: 8) {
                Image(systemName: "rectangle.portrait.and.arrow.right")
                    .font(.system(size: 16, weight: .semibold))
                Text("Déconnexion")
                    .font(.system(size: 16, weight: .semibold))
            }
            .foregroundColor(Color(hex: "EF4444"))
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(Color.white)
            .cornerRadius(16)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(Color(hex: "EF4444").opacity(0.3), lineWidth: 1)
            )
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
    }

    // MARK: - Helpers

    private var displayName: String {
        guard let user = authManager.currentUser else { return "Utilisateur" }

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
            .fill(
                LinearGradient(
                    colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .frame(width: 100, height: 100)
            .overlay {
                Text(initials)
                    .font(.system(size: 36, weight: .bold))
                    .foregroundColor(.white)
            }
    }
}

// MARK: - Profile Stat Card

struct ProfileStatCard: View {
    let icon: String
    let value: String
    let label: String
    let color: Color

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.system(size: 20))
                .foregroundColor(color)

            Text(value)
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            Text(label)
                .font(.system(size: 13))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Menu Card

struct MenuCard<Content: View>: View {
    @ViewBuilder let content: Content

    var body: some View {
        VStack(spacing: 0) {
            content
        }
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Menu Item Row

struct MenuItemRow: View {
    let icon: String
    let title: String
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

                Image(systemName: "chevron.right")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }
            .padding(16)
        }
    }
}

// MARK: - Edit Profile View

struct EditProfileView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var email = ""
    @State private var phone = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Avatar Edit
                    VStack(spacing: 16) {
                        ZStack(alignment: .bottomTrailing) {
                            Circle()
                                .fill(
                                    LinearGradient(
                                        colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                                .frame(width: 100, height: 100)

                            Button(action: {}) {
                                Image(systemName: "camera.fill")
                                    .font(.system(size: 14))
                                    .foregroundColor(.white)
                                    .frame(width: 36, height: 36)
                                    .background(Color(hex: "111827"))
                                    .clipShape(Circle())
                            }
                        }

                        Text("Changer la photo")
                            .font(.system(size: 15, weight: .medium))
                            .foregroundColor(Color(hex: "FFA040"))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.top, 24)

                    // Form
                    VStack(spacing: 16) {
                        FormField(label: "Prénom", text: $firstName, icon: "person.fill")
                        FormField(label: "Nom", text: $lastName, icon: "person.fill")
                        FormField(label: "Email", text: $email, icon: "envelope.fill")
                        FormField(label: "Téléphone", text: $phone, icon: "phone.fill")
                    }
                    .padding(.horizontal, 16)

                    // Save Button
                    Button(action: { dismiss() }) {
                        Text("Enregistrer")
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
                    .padding(.top, 8)
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Modifier le profil")
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
        }
    }
}

// MARK: - Form Field

struct FormField: View {
    let label: String
    @Binding var text: String
    let icon: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "374151"))

            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "9CA3AF"))
                    .frame(width: 20)

                TextField(label, text: $text)
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "111827"))
            }
            .padding(16)
            .background(Color.white)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
            )
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
