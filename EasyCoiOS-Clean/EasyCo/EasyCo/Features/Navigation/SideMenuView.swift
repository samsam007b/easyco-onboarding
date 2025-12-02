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
    @State private var selectedDestination: AnyView?
    @State private var showDestination = false

    var body: some View {
        ZStack {
            if isShowing {
                // Background overlay
                Color.black.opacity(0.4)
                    .ignoresSafeArea()
                    .onTapGesture {
                        withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                            isShowing = false
                        }
                    }

                // Menu content
                HStack(spacing: 0) {
                    Spacer()

                    menuContent
                        .frame(width: 340)
                        .background(
                            LinearGradient(
                                colors: [
                                    Color(hex: "FAFAFA"),
                                    Color(hex: "F5F5F5")
                                ],
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        )
                        .clipShape(RoundedCornersShape(corners: [.topLeft, .bottomLeft], radius: 0))
                        .shadow(color: .black.opacity(0.2), radius: 40, x: -15, y: 0)
                }
                .transition(.move(edge: .trailing))
            }
        }
        .animation(.spring(response: 0.4, dampingFraction: 0.8), value: isShowing)
        .fullScreenCover(isPresented: $showDestination) {
            if let destination = selectedDestination {
                NavigationStack {
                    destination
                }
            }
        }
    }

    private var menuContent: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header
            menuHeader
                .padding(.bottom, 8)

            // Menu items based on role
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 16) {
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
                .padding(.horizontal, 16)
                .padding(.bottom, 24)
            }

            // Footer
            menuFooter
        }
    }

    // MARK: - Header

    private var menuHeader: some View {
        VStack(alignment: .leading, spacing: 20) {
            // Close button
            HStack {
                Spacer()
                Button(action: {
                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                        isShowing = false
                    }
                }) {
                    ZStack {
                        Circle()
                            .fill(Color.white)
                            .frame(width: 36, height: 36)
                            .shadow(color: .black.opacity(0.06), radius: 4, x: 0, y: 2)

                        Image.lucide("xmark")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 14, height: 14)
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
            }
            .padding(.top, 20)
            .padding(.horizontal, 20)

            // User profile section
            HStack(spacing: 14) {
                // Profile image with gradient border
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 64, height: 64)

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
                        .frame(width: 60, height: 60)
                        .clipShape(Circle())
                    } else {
                        profilePlaceholder
                            .frame(width: 60, height: 60)
                    }
                }

                VStack(alignment: .leading, spacing: 5) {
                    Text("\(authManager.currentUser?.firstName ?? "") \(authManager.currentUser?.lastName ?? "")")
                        .font(.system(size: 17, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))
                        .lineLimit(1)

                    Text(authManager.currentUser?.email ?? "")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(Color(hex: "9CA3AF"))
                        .lineLimit(1)

                    // Role badge
                    HStack(spacing: 4) {
                        Circle()
                            .fill(Color(hex: "FFA040"))
                            .frame(width: 6, height: 6)

                        Text(authManager.currentUser?.userType.displayName ?? "")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(Color(hex: "FFA040"))
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color(hex: "FFA040").opacity(0.1))
                    .cornerRadius(12)
                }

                Spacer()
            }
            .padding(.horizontal, 20)
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
                .font(.system(size: 22, weight: .bold))
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
        VStack(alignment: .leading, spacing: 16) {
            MenuCard(title: "Recherche", items: [
                MenuItemData(icon: "search", title: "Explorer les propriétés", destination: AnyView(PropertiesListView())),
                MenuItemData(icon: "sparkles", title: "Mes Matchs", destination: AnyView(MatchesView())),
                MenuItemData(icon: "heart", title: "Favoris", destination: AnyView(FavoritesView())),
                MenuItemData(icon: "bell", title: "Alertes", destination: AnyView(AlertsView())),
                MenuItemData(icon: "bookmark", title: "Recherches sauvegardées", destination: AnyView(SavedSearchesWrapper()))
            ], onItemTap: handleItemTap)

            MenuCard(title: "Mes candidatures", items: [
                MenuItemData(icon: "file-text", title: "Candidatures", destination: AnyView(MyApplicationsView())),
                MenuItemData(icon: "calendar-clock", title: "Mes visites", destination: AnyView(MyVisitsView()))
            ], onItemTap: handleItemTap)

            MenuCard(title: "Social", items: [
                MenuItemData(icon: "users", title: "Groupes", destination: AnyView(GroupsListView())),
                MenuItemData(icon: "message-circle", title: "Messages", destination: AnyView(MessagesListView()))
            ], onItemTap: handleItemTap)

            MenuCard(title: "Mon compte", items: [
                MenuItemData(icon: "user", title: "Mon profil", destination: AnyView(ProfileView())),
                MenuItemData(icon: "sliders-horizontal", title: "Préférences", destination: AnyView(PreferencesView())),
                MenuItemData(icon: "bell", title: "Notifications", destination: AnyView(NotificationsListView())),
                MenuItemData(icon: "settings", title: "Paramètres", destination: AnyView(SettingsView()))
            ], onItemTap: handleItemTap)
        }
    }

    // MARK: - Owner Menu Items

    private var ownerMenuItems: some View {
        VStack(alignment: .leading, spacing: 16) {
            MenuCard(title: "Gestion", items: [
                MenuItemData(icon: "bar-chart-2", title: "Dashboard", destination: AnyView(OwnerDashboardView())),
                MenuItemData(icon: "building-2", title: "Mes propriétés", destination: AnyView(OwnerPropertiesView())),
                MenuItemData(icon: "plus-square", title: "Ajouter une propriété", destination: AnyView(CreatePropertyView()))
            ], onItemTap: handleItemTap)

            MenuCard(title: "Candidatures & Visites", items: [
                MenuItemData(icon: "file-text", title: "Candidatures", destination: AnyView(ApplicationsView())),
                MenuItemData(icon: "calendar-clock", title: "Calendrier des visites", destination: AnyView(VisitScheduleView()))
            ], onItemTap: handleItemTap)

            MenuCard(title: "Finances & Maintenance", items: [
                MenuItemData(icon: "euro", title: "Finances", destination: AnyView(OwnerFinanceView())),
                MenuItemData(icon: "wrench", title: "Maintenance", destination: AnyView(MaintenanceView())),
                MenuItemData(icon: "hammer", title: "Prestataires", destination: AnyView(ContractorsView()))
            ], onItemTap: handleItemTap)

            MenuCard(title: "Communication", items: [
                MenuItemData(icon: "message-circle", title: "Messages", destination: AnyView(MessagesListView())),
                MenuItemData(icon: "bell", title: "Notifications", destination: AnyView(NotificationsListView()))
            ], onItemTap: handleItemTap)

            MenuCard(title: "Mon compte", items: [
                MenuItemData(icon: "user", title: "Mon profil", destination: AnyView(ProfileView())),
                MenuItemData(icon: "sliders-horizontal", title: "Préférences", destination: AnyView(PreferencesView())),
                MenuItemData(icon: "settings", title: "Paramètres", destination: AnyView(SettingsView()))
            ], onItemTap: handleItemTap)
        }
    }

    // MARK: - Resident Menu Items

    private var residentMenuItems: some View {
        VStack(alignment: .leading, spacing: 16) {
            MenuCard(title: "Mon espace", items: [
                MenuItemData(icon: "home", title: "Hub", destination: AnyView(ResidentHubView())),
                MenuItemData(icon: "check-square", title: "Tâches", destination: AnyView(TasksView())),
                MenuItemData(icon: "calendar", title: "Calendrier", destination: AnyView(CalendarView()))
            ], onItemTap: handleItemTap)

            MenuCard(title: "Finances", items: [
                MenuItemData(icon: "credit-card", title: "Dépenses", destination: AnyView(ExpensesView())),
                MenuItemData(icon: "bar-chart-2", title: "Statistiques", destination: AnyView(ExpenseStatsView(viewModel: ExpensesViewModel()))),
                MenuItemData(icon: "scale", title: "Soldes", destination: AnyView(BalanceView(viewModel: ExpensesViewModel())))
            ], onItemTap: handleItemTap)

            MenuCard(title: "Colocation", items: [
                MenuItemData(icon: "users", title: "Colocataires", destination: AnyView(RoommatesView())),
                MenuItemData(icon: "megaphone", title: "Annonces", destination: AnyView(AnnouncementsView())),
                MenuItemData(icon: "message-circle", title: "Messages", destination: AnyView(MessagesListView()))
            ], onItemTap: handleItemTap)

            MenuCard(title: "Mon compte", items: [
                MenuItemData(icon: "user", title: "Mon profil", destination: AnyView(ProfileView())),
                MenuItemData(icon: "sliders-horizontal", title: "Préférences", destination: AnyView(PreferencesView())),
                MenuItemData(icon: "bell", title: "Notifications", destination: AnyView(NotificationsListView())),
                MenuItemData(icon: "settings", title: "Paramètres", destination: AnyView(SettingsView()))
            ], onItemTap: handleItemTap)
        }
    }

    private func handleItemTap(destination: AnyView) {
        withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
            isShowing = false
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
            selectedDestination = destination
            showDestination = true
        }
    }

    // MARK: - Footer

    private var menuFooter: some View {
        VStack(spacing: 0) {
            Divider()
                .background(Color(hex: "E5E7EB"))
                .padding(.horizontal, 16)

            Button(action: {
                withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                    isShowing = false
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
                    Task {
                        await AuthManager.shared.logout()
                    }
                }
            }) {
                HStack(spacing: 12) {
                    ZStack {
                        Circle()
                            .fill(Color(hex: "FEE2E2"))
                            .frame(width: 36, height: 36)

                        Image.lucide("log-out")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 16, height: 16)
                            .foregroundColor(Color(hex: "EF4444"))
                    }

                    Text("Se déconnecter")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(Color(hex: "EF4444"))

                    Spacer()
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 16)
            }
        }
        .background(Color(hex: "FAFAFA"))
    }
}

// MARK: - Menu Item Data

struct MenuItemData {
    let icon: String
    let title: String
    let destination: AnyView
}

// MARK: - Menu Card

struct MenuCard: View {
    let title: String
    let items: [MenuItemData]
    let onItemTap: (AnyView) -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Section title
            Text(title)
                .font(.system(size: 12, weight: .bold))
                .foregroundColor(Color(hex: "9CA3AF"))
                .textCase(.uppercase)
                .padding(.horizontal, 16)
                .padding(.bottom, 10)

            // Card container
            VStack(spacing: 0) {
                ForEach(Array(items.enumerated()), id: \.offset) { index, item in
                    ModernMenuItem(
                        icon: item.icon,
                        title: item.title,
                        destination: item.destination,
                        onTap: onItemTap
                    )

                    if index < items.count - 1 {
                        Divider()
                            .background(Color(hex: "F3F4F6"))
                            .padding(.leading, 56)
                    }
                }
            }
            .background(Color.white)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
        }
    }
}

// MARK: - Modern Menu Item

struct ModernMenuItem: View {
    let icon: String
    let title: String
    let destination: AnyView
    let onTap: (AnyView) -> Void
    @State private var isPressed = false

    var body: some View {
        Button(action: {
            onTap(destination)
        }) {
            HStack(spacing: 14) {
                // Icon with gradient background
                ZStack {
                    RoundedRectangle(cornerRadius: 10)
                        .fill(
                            LinearGradient(
                                colors: [iconColor.opacity(0.15), iconColor.opacity(0.08)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 40, height: 40)

                    Image.lucide(icon)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 18, height: 18)
                        .foregroundColor(iconColor)
                }

                Text(title)
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                Image.lucide("chevron-right")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 10, height: 10)
                    .foregroundColor(Color(hex: "D1D5DB"))
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .background(isPressed ? Color(hex: "F9FAFB") : Color.clear)
        }
        .buttonStyle(PlainButtonStyle())
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in isPressed = true }
                .onEnded { _ in isPressed = false }
        )
    }

    private var iconColor: Color {
        // Infer color based on icon semantics
        if icon.contains("search") || icon.contains("sparkles") {
            return Color(hex: "FFA040")
        }
        if icon.contains("heart") {
            return Color(hex: "EF4444")
        }
        if icon.contains("bell") {
            return Color(hex: "3B82F6")
        }
        if icon.contains("bookmark") {
            return Color(hex: "6E56CF")
        }
        if icon.contains("file") || icon.contains("doc") {
            return Color(hex: "10B981")
        }
        if icon.contains("calendar") || icon.contains("clock") {
            return Color(hex: "F59E0B")
        }
        if icon.contains("user") || icon.contains("person") {
            return Color(hex: "6366F1")
        }
        if icon.contains("message") {
            return Color(hex: "0EA5E9")
        }
        if icon.contains("euro") || icon.contains("credit") {
            return Color(hex: "10B981")
        }
        if icon.contains("building") || icon.contains("home") {
            return Color(hex: "14B8A6")
        }
        if icon.contains("wrench") || icon.contains("hammer") {
            return Color(hex: "F97316")
        }
        if icon.contains("settings") || icon.contains("sliders") {
            return Color(hex: "6B7280")
        }
        if icon.contains("chart") || icon.contains("bar") {
            return Color(hex: "8B5CF6")
        }
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
