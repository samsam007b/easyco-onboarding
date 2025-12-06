import SwiftUI

// MARK: - Alerts View Pinterest Style

struct AlertsView: View {
    @Environment(\.dismiss) var dismiss
    @StateObject private var alertsManager = AlertsManager.shared
    @State private var showingCreateAlert = false
    @State private var selectedFilter: AlertFilter = .all
    private let role: Theme.UserRole = .resident

    var body: some View {
        ZStack(alignment: .top) {
            // Background
            PinterestBackground(role: role, intensity: 0.15)
                .ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                if alertsManager.isLoading {
                    ProgressView()
                        .padding(.top, 100)
                } else if filteredAlerts.isEmpty {
                    emptyState
                        .padding(.horizontal, Theme.PinterestSpacing.lg)
                        .padding(.top, 60)
                } else {
                    VStack(spacing: Theme.PinterestSpacing.lg) {
                        // Filter Tabs
                        filterTabs

                        // Stats Cards
                        statsSection

                        // Alerts List
                        alertsList
                    }
                    .padding(.horizontal, Theme.PinterestSpacing.lg)
                    .padding(.top, Theme.PinterestSpacing.lg)
                    .padding(.bottom, 100)
                }
            }
        }
        .pinterestFormPresentation(isPresented: $showingCreateAlert) {
            CreateAlertView()
        }
    }

    // MARK: - Filter Tabs

    private var filterTabs: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                FilterChip(
                    title: "Toutes (\(alertsManager.alerts.count))",
                    isSelected: selectedFilter == .all
                ) {
                    selectedFilter = .all
                }

                FilterChip(
                    title: "Actives (\(alertsManager.activeAlertsCount))",
                    isSelected: selectedFilter == .active
                ) {
                    selectedFilter = .active
                }

                FilterChip(
                    title: "Inactives (\(alertsManager.inactiveAlertsCount))",
                    isSelected: selectedFilter == .inactive
                ) {
                    selectedFilter = .inactive
                }

                ForEach(AlertType.allCases, id: \.self) { type in
                    let count = alertsManager.alertsByType(type).count
                    if count > 0 {
                        FilterChip(
                            title: "\(type.displayName) (\(count))",
                            isSelected: selectedFilter == .type(type)
                        ) {
                            selectedFilter = .type(type)
                        }
                    }
                }
            }
        }
    }

    // MARK: - Stats Section

    private var statsSection: some View {
        HStack(spacing: 12) {
            StatCard(
                title: "Actives",
                value: "\(alertsManager.activeAlertsCount)",
                icon: "bell.fill",
                color: .green
            )

            StatCard(
                title: "Total déclenchements",
                value: "\(totalTriggers)",
                icon: "chart.bar.fill",
                color: .blue
            )

            StatCard(
                title: "Cette semaine",
                value: "\(recentTriggers)",
                icon: "calendar",
                color: .orange
            )
        }
    }

    // MARK: - Alerts List

    private var alertsList: some View {
        LazyVStack(spacing: 12) {
            ForEach(filteredAlerts) { alert in
                AlertCard(alert: alert)
            }
        }
    }

    // MARK: - Empty State

    private var emptyState: some View {
        VStack(spacing: 24) {
            ZStack {
                Circle()
                    .fill(role.primaryColor.opacity(0.12))
                    .frame(width: 100, height: 100)

                Image(systemName: "bell.slash.fill")
                    .font(.system(size: 48))
                    .foregroundColor(role.primaryColor.opacity(0.6))
            }

            VStack(spacing: 8) {
                Text("Aucune alerte")
                    .font(Theme.PinterestTypography.titleLarge(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Créez des alertes pour être notifié des nouvelles opportunités")
                    .font(Theme.PinterestTypography.bodyRegular(.medium))
                    .foregroundColor(Theme.Colors.textSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 40)
            }

            Button(action: {
                Haptic.light()
                showingCreateAlert = true
            }) {
                HStack(spacing: 8) {
                    Image(systemName: "plus.circle.fill")
                        .font(.system(size: 18, weight: .semibold))

                    Text("Créer une alerte")
                        .font(Theme.PinterestTypography.bodyRegular(.semibold))
                }
                .foregroundColor(.white)
                .frame(height: 50)
                .padding(.horizontal, Theme.PinterestSpacing.xl)
                .background(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                        .fill(role.gradient)
                )
                .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.35))
            }
            .buttonStyle(ScaleButtonStyle())
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - Computed Properties

    private var filteredAlerts: [Alert] {
        switch selectedFilter {
        case .all:
            return alertsManager.alerts
        case .active:
            return alertsManager.alerts.filter { $0.isActive }
        case .inactive:
            return alertsManager.alerts.filter { !$0.isActive }
        case .type(let type):
            return alertsManager.alertsByType(type)
        }
    }

    private var totalTriggers: Int {
        alertsManager.alerts.reduce(0) { $0 + $1.triggerCount }
    }

    private var recentTriggers: Int {
        let weekAgo = Date().addingTimeInterval(-7 * 24 * 60 * 60)
        return alertsManager.alerts.filter { alert in
            guard let lastTriggered = alert.lastTriggered else { return false }
            return lastTriggered > weekAgo
        }.count
    }
}

// MARK: - Alert Filter

enum AlertFilter: Equatable {
    case all
    case active
    case inactive
    case type(AlertType)
}

// MARK: - Alert Card

struct AlertCard: View {
    let alert: Alert
    @StateObject private var alertsManager = AlertsManager.shared

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                // Icon & Type
                HStack(spacing: 8) {
                    Image(systemName: alert.type.icon)
                        .foregroundColor(Color(hex: alert.type.color))
                        .font(.title3)

                    VStack(alignment: .leading, spacing: 2) {
                        Text(alert.title)
                            .font(.headline)
                            .foregroundColor(.primary)

                        Text(alert.type.displayName)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }

                Spacer()

                // Active Toggle
                Toggle("", isOn: Binding(
                    get: { alert.isActive },
                    set: { _ in
                        Task {
                            await alertsManager.toggleAlert(alert)
                        }
                    }
                ))
                .labelsHidden()
            }

            Divider()

            // Details
            VStack(alignment: .leading, spacing: 8) {
                // Frequency
                HStack {
                    Image(systemName: "clock.fill")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text(alert.frequency.displayName)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }

                // Criteria Summary
                if let criteriaText = getCriteriaText() {
                    HStack(alignment: .top) {
                        Image(systemName: "slider.horizontal.3")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Text(criteriaText)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .lineLimit(2)
                    }
                }

                // Stats
                HStack(spacing: 16) {
                    if let lastTriggered = alert.lastTriggered {
                        Label(lastTriggered.timeAgoDisplay(), systemImage: "bell.badge.fill")
                            .font(.caption)
                            .foregroundColor(.blue)
                    }

                    if alert.triggerCount > 0 {
                        Label("\(alert.triggerCount) fois", systemImage: "chart.bar.fill")
                            .font(.caption)
                            .foregroundColor(.green)
                    }
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
    }

    private func getCriteriaText() -> String? {
        var parts: [String] = []

        if let cities = alert.criteria.cities, !cities.isEmpty {
            parts.append(cities.joined(separator: ", "))
        }

        if let minPrice = alert.criteria.minPrice, let maxPrice = alert.criteria.maxPrice {
            parts.append("\(Int(minPrice))-\(Int(maxPrice))€")
        } else if let minPrice = alert.criteria.minPrice {
            parts.append(">\(Int(minPrice))€")
        } else if let maxPrice = alert.criteria.maxPrice {
            parts.append("<\(Int(maxPrice))€")
        }

        if let minBedrooms = alert.criteria.minBedrooms {
            parts.append("\(minBedrooms)+ chambres")
        }

        return parts.isEmpty ? nil : parts.joined(separator: " • ")
    }
}

// MARK: - Stat Card Pinterest

struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 24, weight: .semibold))
                .foregroundColor(color)

            Text(value)
                .font(Theme.PinterestTypography.titleMedium(.bold))
                .foregroundColor(Theme.Colors.textPrimary)

            Text(title)
                .font(Theme.PinterestTypography.caption(.medium))
                .foregroundColor(Theme.Colors.textSecondary)
                .minimumScaleFactor(0.8)
                .lineLimit(1)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, Theme.PinterestSpacing.lg)
        .background(
            RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                .fill(Color.white.opacity(0.75))
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                        .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                )
        )
        .pinterestShadow(Theme.PinterestShadows.subtle)
    }
}

// MARK: - Date Extension

extension Date {
    func timeAgoDisplay() -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: self, relativeTo: Date())
    }
}

// MARK: - Preview

#Preview {
    AlertsView()
}

// MARK: - Menu View

struct MenuView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var authManager: AuthManager
    private let role: Theme.UserRole = .resident

    // Navigation states
    @State private var navigateToHub = false
    @State private var navigateToTasks = false
    @State private var navigateToCalendar = false
    @State private var navigateToExpenses = false
    @State private var navigateToStats = false
    @State private var navigateToBalances = false
    @State private var navigateToRoommates = false
    @State private var showLogoutAlert = false

    // Mock user data
    @State private var userName = "sam jones"
    @State private var userEmail = "sam7777jones@gmail.com"

    var body: some View {
        NavigationStack {
            ZStack(alignment: .top) {
                // Background
                PinterestBackground(role: role, intensity: 0.15)
                    .ignoresSafeArea()

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 0) {
                        // User Profile Section
                        userProfileSection
                            .padding(.top, Theme.PinterestSpacing.lg)
                            .padding(.horizontal, Theme.PinterestSpacing.lg)
                            .padding(.bottom, Theme.PinterestSpacing.xl)

                        // Menu Sections
                        VStack(spacing: Theme.PinterestSpacing.lg) {
                            mySpaceSection
                            financesSection
                            colocationSection
                            logoutSection
                        }
                        .padding(.horizontal, Theme.PinterestSpacing.lg)
                        .padding(.bottom, 100)
                    }
                }
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

    // MARK: - User Profile Section

    private var userProfileSection: some View {
        HStack(spacing: 16) {
            // Avatar
            Circle()
                .fill(role.gradient)
                .frame(width: 64, height: 64)
                .overlay(
                    Text(userName.prefix(2).uppercased())
                        .font(.system(size: 24, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                )
                .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.3))

            VStack(alignment: .leading, spacing: 4) {
                Text(userName)
                    .font(Theme.PinterestTypography.titleLarge(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(userEmail)
                    .font(Theme.PinterestTypography.bodySmall(.medium))
                    .foregroundColor(Theme.Colors.textSecondary)

                // Role badge
                HStack(spacing: 4) {
                    Circle()
                        .fill(role.primaryColor)
                        .frame(width: 6, height: 6)

                    Text("Résident")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(role.primaryColor)
                }
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(
                    Capsule()
                        .fill(role.primaryColor.opacity(0.12))
                )
            }

            Spacer()
        }
    }

    // MARK: - Menu Sections

    private var mySpaceSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("MON ESPACE")
                .font(.system(size: 11, weight: .semibold))
                .foregroundColor(Theme.Colors.textTertiary)
                .padding(.horizontal, Theme.PinterestSpacing.md)

            VStack(spacing: 8) {
                NavigationLink(destination: ResidentHubView()) {
                    MenuItemRow(
                        icon: "house.fill",
                        title: "Hub",
                        iconColor: Color(hex: "10B981")
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: TasksView()) {
                    MenuItemRow(
                        icon: "checkmark.square.fill",
                        title: "Tâches",
                        iconColor: Color(hex: "F59E0B")
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: CalendarView()) {
                    MenuItemRow(
                        icon: "calendar.badge.clock",
                        title: "Calendrier",
                        iconColor: Color(hex: "F59E0B")
                    )
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
    }

    private var financesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("FINANCES")
                .font(.system(size: 11, weight: .semibold))
                .foregroundColor(Theme.Colors.textTertiary)
                .padding(.horizontal, Theme.PinterestSpacing.md)

            VStack(spacing: 8) {
                NavigationLink(destination: ExpensesView()) {
                    MenuItemRow(
                        icon: "creditcard.fill",
                        title: "Dépenses",
                        iconColor: Color(hex: "10B981")
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: ExpenseStatsView(viewModel: ExpensesViewModel())) {
                    MenuItemRow(
                        icon: "chart.bar.fill",
                        title: "Statistiques",
                        iconColor: Color(hex: "8B5CF6")
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: ExpensesView()) {
                    MenuItemRow(
                        icon: "eurosign.circle.fill",
                        title: "Soldes",
                        iconColor: Color(hex: "F59E0B")
                    )
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
    }

    private var colocationSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("COLOCATION")
                .font(.system(size: 11, weight: .semibold))
                .foregroundColor(Theme.Colors.textTertiary)
                .padding(.horizontal, Theme.PinterestSpacing.md)

            VStack(spacing: 8) {
                NavigationLink(destination: RoommatesView()) {
                    MenuItemRow(
                        icon: "person.2.fill",
                        title: "Colocataires",
                        iconColor: Color(hex: "6366F1")
                    )
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
    }

    private var logoutSection: some View {
        VStack(spacing: 8) {
            Button(action: {
                Haptic.warning()
                showLogoutAlert = true
            }) {
                MenuItemRow(
                    icon: "rectangle.portrait.and.arrow.right",
                    title: "Se déconnecter",
                    iconColor: Color(hex: "EF4444"),
                    showChevron: false
                )
            }
            .buttonStyle(PlainButtonStyle())
        }
        .padding(.top, Theme.PinterestSpacing.lg)
    }
}

// MARK: - Menu Item Row

struct MenuItemRow: View {
    let icon: String
    let title: String
    let iconColor: Color
    var showChevron: Bool = true

    var body: some View {
        HStack(spacing: 16) {
            // Icon background
            ZStack {
                RoundedRectangle(cornerRadius: 12)
                    .fill(iconColor.opacity(0.12))
                    .frame(width: 44, height: 44)

                Image(systemName: icon)
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(iconColor)
            }

            // Title
            Text(title)
                .font(Theme.PinterestTypography.bodyLarge(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            Spacer()

            // Chevron
            if showChevron {
                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Theme.Colors.textTertiary)
            }
        }
        .padding(.horizontal, Theme.PinterestSpacing.md)
        .padding(.vertical, 12)
        .background(
            RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                .fill(Color.white.opacity(0.75))
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                        .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                )
        )
        .pinterestShadow(Theme.PinterestShadows.subtle)
    }
}
