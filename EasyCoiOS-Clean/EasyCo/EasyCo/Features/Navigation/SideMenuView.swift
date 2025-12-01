//
//  SideMenuView.swift
//  EasyCo
//
//  Side menu with all available features for each user role
//

import SwiftUI

// MARK: - Side Menu View

struct SideMenuView: View {
    @EnvironmentObject var authManager: AuthManager
    @Binding var isShowing: Bool

    var body: some View {
        ZStack {
            if isShowing {
                // Background overlay
                Color.black.opacity(0.3)
                    .ignoresSafeArea()
                    .onTapGesture {
                        withAnimation(.easeInOut(duration: 0.3)) {
                            isShowing = false
                        }
                    }

                // Menu content
                HStack(spacing: 0) {
                    Spacer()

                    menuContent
                        .frame(width: 320)
                        .background(
                            ZStack {
                                // Gradient background
                                LinearGradient(
                                    colors: [
                                        Color.white.opacity(0.95),
                                        Color.white.opacity(0.90)
                                    ],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )

                                // Blur effect
                                Rectangle()
                                    .fill(.ultraThinMaterial)
                            }
                        )
                        .clipShape(RoundedCornersShape(corners: [.topLeft, .bottomLeft], radius: 32))
                        .shadow(color: .black.opacity(0.15), radius: 30, x: -10, y: 0)
                        .overlay(
                            // Subtle border
                            RoundedCornersShape(corners: [.topLeft, .bottomLeft], radius: 32)
                                .stroke(
                                    LinearGradient(
                                        colors: [
                                            Color.white.opacity(0.8),
                                            Color.white.opacity(0.2)
                                        ],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    ),
                                    lineWidth: 1
                                )
                        )
                }
                .transition(.move(edge: .trailing))
            }
        }
        .animation(.easeInOut(duration: 0.3), value: isShowing)
    }

    private var menuContent: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header
            menuHeader

            // Menu items based on role
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    if let user = authManager.currentUser {
                        switch user.userType {
                        case .searcher:
                            searcherMenuItems
                        case .owner:
                            ownerMenuItems
                        case .resident:
                            residentMenuItems
                        }
                    }
                }
            }

            Spacer()

            // Footer
            menuFooter
        }
    }

    // MARK: - Header

    private var menuHeader: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Spacer()
                Button(action: {
                    withAnimation {
                        isShowing = false
                    }
                }) {
                    Image(systemName: "xmark")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "6B7280"))
                        .frame(width: 32, height: 32)
                }
            }
            .padding(.top, 16)
            .padding(.horizontal, 20)

            // User profile section
            HStack(spacing: 12) {
                // Profile image
                if let imageUrl = authManager.currentUser?.profileImageURL,
                   !imageUrl.isEmpty,
                   let url = URL(string: imageUrl) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .scaledToFill()
                    } placeholder: {
                        profilePlaceholder
                    }
                    .frame(width: 56, height: 56)
                    .clipShape(Circle())
                } else {
                    profilePlaceholder
                        .frame(width: 56, height: 56)
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text("\(authManager.currentUser?.firstName ?? "") \(authManager.currentUser?.lastName ?? "")")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    Text(authManager.currentUser?.email ?? "")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                        .lineLimit(1)
                }

                Spacer()
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 16)
        }
    }

    private var profilePlaceholder: some View {
        ZStack {
            Circle()
                .fill(
                    LinearGradient(
                        colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )

            Text(initials)
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(.white)
        }
    }

    private var initials: String {
        let firstName = authManager.currentUser?.firstName ?? ""
        let lastName = authManager.currentUser?.lastName ?? ""

        if firstName.isEmpty && lastName.isEmpty {
            return String(authManager.currentUser?.email.prefix(1).uppercased() ?? "?")
        }

        let firstInitial = firstName.prefix(1).uppercased()
        let lastInitial = lastName.prefix(1).uppercased()
        return "\(firstInitial)\(lastInitial)"
    }

    // MARK: - Searcher Menu Items

    private var searcherMenuItems: some View {
        VStack(alignment: .leading, spacing: 0) {
            MenuSection(title: "Recherche") {
                MenuItem(icon: "magnifyingglass", title: "Explorer les propriétés", destination: AnyView(PropertiesListView()))
                MenuItem(icon: "sparkles", title: "Mes Matchs", destination: AnyView(MatchesView()))
                MenuItem(icon: "heart.fill", title: "Favoris", destination: AnyView(FavoritesView()))
                MenuItem(icon: "bell.fill", title: "Alertes", destination: AnyView(AlertsView()))
                MenuItem(icon: "bookmark.fill", title: "Recherches sauvegardées", destination: AnyView(SavedSearchesWrapper()))
            }

            MenuSection(title: "Mes candidatures") {
                MenuItem(icon: "doc.text.fill", title: "Candidatures", destination: AnyView(MyApplicationsView()))
                MenuItem(icon: "calendar.badge.clock", title: "Mes visites", destination: AnyView(MyVisitsView()))
            }

            MenuSection(title: "Social") {
                MenuItem(icon: "person.3.fill", title: "Groupes", destination: AnyView(GroupsListView()))
                MenuItem(icon: "message.fill", title: "Messages", destination: AnyView(MessagesListView()))
            }

            MenuSection(title: "Mon compte") {
                MenuItem(icon: "person.crop.circle", title: "Mon profil", destination: AnyView(ProfileView()))
                MenuItem(icon: "slider.horizontal.3", title: "Préférences", destination: AnyView(PreferencesView()))
                MenuItem(icon: "bell.badge", title: "Notifications", destination: AnyView(NotificationsListView()))
                MenuItem(icon: "gear", title: "Paramètres", destination: AnyView(SettingsView()))
            }
        }
    }

    // MARK: - Owner Menu Items

    private var ownerMenuItems: some View {
        VStack(alignment: .leading, spacing: 0) {
            MenuSection(title: "Gestion") {
                MenuItem(icon: "chart.bar.fill", title: "Dashboard", destination: AnyView(OwnerDashboardView()))
                MenuItem(icon: "building.2.fill", title: "Mes propriétés", destination: AnyView(OwnerPropertiesView()))
                MenuItem(icon: "plus.square.fill", title: "Ajouter une propriété", destination: AnyView(CreatePropertyView()))
            }

            MenuSection(title: "Candidatures & Visites") {
                MenuItem(icon: "doc.text.fill", title: "Candidatures", destination: AnyView(ApplicationsView()))
                MenuItem(icon: "calendar.badge.clock", title: "Calendrier des visites", destination: AnyView(VisitScheduleView()))
            }

            MenuSection(title: "Finances & Maintenance") {
                MenuItem(icon: "eurosign.circle.fill", title: "Finances", destination: AnyView(OwnerFinanceView()))
                MenuItem(icon: "wrench.and.screwdriver.fill", title: "Maintenance", destination: AnyView(MaintenanceView()))
                MenuItem(icon: "hammer.fill", title: "Prestataires", destination: AnyView(ContractorsView()))
            }

            MenuSection(title: "Communication") {
                MenuItem(icon: "message.fill", title: "Messages", destination: AnyView(MessagesListView()))
                MenuItem(icon: "bell.badge", title: "Notifications", destination: AnyView(NotificationsListView()))
            }

            MenuSection(title: "Mon compte") {
                MenuItem(icon: "person.crop.circle", title: "Mon profil", destination: AnyView(ProfileView()))
                MenuItem(icon: "slider.horizontal.3", title: "Préférences", destination: AnyView(PreferencesView()))
                MenuItem(icon: "gear", title: "Paramètres", destination: AnyView(SettingsView()))
            }
        }
    }

    // MARK: - Resident Menu Items

    private var residentMenuItems: some View {
        VStack(alignment: .leading, spacing: 0) {
            MenuSection(title: "Mon espace") {
                MenuItem(icon: "house.fill", title: "Hub", destination: AnyView(ResidentHubView()))
                MenuItem(icon: "checklist", title: "Tâches", destination: AnyView(TasksView()))
                MenuItem(icon: "calendar", title: "Calendrier", destination: AnyView(CalendarView()))
            }

            MenuSection(title: "Finances") {
                MenuItem(icon: "creditcard.fill", title: "Dépenses", destination: AnyView(ExpensesView()))
                MenuItem(icon: "chart.bar.fill", title: "Statistiques", destination: AnyView(ExpenseStatsView(viewModel: ExpensesViewModel())))
                MenuItem(icon: "scale.3d", title: "Soldes", destination: AnyView(BalanceView(viewModel: ExpensesViewModel())))
            }

            MenuSection(title: "Colocation") {
                MenuItem(icon: "person.3.fill", title: "Colocataires", destination: AnyView(RoommatesView()))
                MenuItem(icon: "megaphone.fill", title: "Annonces", destination: AnyView(AnnouncementsView()))
                MenuItem(icon: "message.fill", title: "Messages", destination: AnyView(MessagesListView()))
            }

            MenuSection(title: "Mon compte") {
                MenuItem(icon: "person.crop.circle", title: "Mon profil", destination: AnyView(ProfileView()))
                MenuItem(icon: "slider.horizontal.3", title: "Préférences", destination: AnyView(PreferencesView()))
                MenuItem(icon: "bell.badge", title: "Notifications", destination: AnyView(NotificationsListView()))
                MenuItem(icon: "gear", title: "Paramètres", destination: AnyView(SettingsView()))
            }
        }
    }

    // MARK: - Footer

    private var menuFooter: some View {
        VStack(spacing: 0) {
            Divider()

            Button(action: {
                withAnimation {
                    isShowing = false
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                    Task {
                        await AuthManager.shared.logout()
                    }
                }
            }) {
                HStack(spacing: 12) {
                    Image(systemName: "rectangle.portrait.and.arrow.right")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "EF4444"))

                    Text("Se déconnecter")
                        .font(.system(size: 15, weight: .medium))
                        .foregroundColor(Color(hex: "EF4444"))

                    Spacer()
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 16)
            }
        }
    }
}

// MARK: - Menu Section

struct MenuSection<Content: View>: View {
    let title: String
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(title)
                .font(.system(size: 11, weight: .semibold))
                .foregroundColor(Color(hex: "9CA3AF"))
                .textCase(.uppercase)
                .padding(.horizontal, 20)
                .padding(.top, 20)
                .padding(.bottom, 8)

            content
        }
    }
}

// MARK: - Menu Item

struct MenuItem: View {
    let icon: String
    let title: String
    let destination: AnyView
    let iconColor: Color?
    @Environment(\.dismiss) private var dismiss

    init(icon: String, title: String, destination: AnyView, iconColor: Color? = nil) {
        self.icon = icon
        self.title = title
        self.destination = destination
        self.iconColor = iconColor
    }

    var body: some View {
        NavigationLink(destination: destination) {
            HStack(spacing: 16) {
                // Icon only (no container background)
                Image(systemName: icon)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(effectiveIconColor)
                    .frame(width: 24)

                Text(title)
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 12)
        }
        .buttonStyle(PlainButtonStyle())
    }

    private var effectiveIconColor: Color {
        iconColor ?? inferColorFromIcon()
    }

    // Infer color based on icon semantics (matching design system color palette)
    private func inferColorFromIcon() -> Color {
        // Navigation & Search - Orange (primary brand)
        if icon.contains("magnifyingglass") || icon.contains("sparkles") {
            return Color(hex: "FFA040") // Orange
        }
        // Favorites & Likes - Pink/Red
        if icon.contains("heart") {
            return Color(hex: "EF4444") // Red
        }
        // Alerts & Notifications - Blue
        if icon.contains("bell") {
            return Color(hex: "3B82F6") // Blue
        }
        // Bookmarks & Saved - Purple
        if icon.contains("bookmark") {
            return Color(hex: "6E56CF") // Purple
        }
        // Documents & Applications - Green
        if icon.contains("doc") {
            return Color(hex: "10B981") // Green
        }
        // Calendar & Time - Amber
        if icon.contains("calendar") || icon.contains("clock") {
            return Color(hex: "F59E0B") // Amber
        }
        // Social & Groups - Indigo
        if icon.contains("person") {
            return Color(hex: "6366F1") // Indigo
        }
        // Messages - Sky Blue
        if icon.contains("message") {
            return Color(hex: "0EA5E9") // Sky
        }
        // Finance - Emerald
        if icon.contains("eurosign") || icon.contains("creditcard") {
            return Color(hex: "10B981") // Emerald
        }
        // Property & Building - Teal
        if icon.contains("building") || icon.contains("house") {
            return Color(hex: "14B8A6") // Teal
        }
        // Maintenance & Tools - Orange
        if icon.contains("wrench") || icon.contains("hammer") {
            return Color(hex: "F97316") // Orange
        }
        // Settings - Gray
        if icon.contains("gear") || icon.contains("slider") {
            return Color(hex: "6B7280") // Gray
        }
        // Chart & Stats - Purple
        if icon.contains("chart") {
            return Color(hex: "8B5CF6") // Purple
        }
        // Default to primary orange
        return Color(hex: "FFA040")
    }
}

// MARK: - Custom Shape for Rounded Corners

struct RoundedCornersShape: Shape {
    let corners: UIRectCorner
    let radius: CGFloat

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(
            roundedRect: rect,
            byRoundingCorners: corners,
            cornerRadii: CGSize(width: radius, height: radius)
        )
        return Path(path.cgPath)
    }
}

// MARK: - Preview

struct SideMenuView_Previews: PreviewProvider {
    static var previews: some View {
        SideMenuView(isShowing: .constant(true))
            .environmentObject(AuthManager.shared)
    }
}
