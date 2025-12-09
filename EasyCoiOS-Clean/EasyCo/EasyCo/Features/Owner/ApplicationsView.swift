import SwiftUI

// MARK: - Applications View (Owner - Pinterest Modern)

struct ApplicationsView: View {
    @State private var applications: [Application] = []
    @State private var isLoading = false
    @State private var searchText = ""
    @State private var selectedProperty: UUID?
    @State private var selectedStatus: ApplicationStatus?

    // Sheet states
    @State private var showProfileSheet = false
    @State private var showAlertsSheet = false
    @State private var showMenuSheet = false

    private let role: Theme.UserRole = .owner

    var body: some View {
        NavigationStack {
            ZStack(alignment: .top) {
                // Pinterest Background
                PinterestBackground(role: role, intensity: 0.18)
                    .ignoresSafeArea()

                Group {
                    if isLoading {
                        LoadingView(message: "Chargement des candidatures...")
                    } else if applications.isEmpty {
                        emptyStateView
                    } else {
                        applicationsContent
                    }
                }

                // Floating Header
                FloatingHeaderView(
                    role: role,
                    showAddButton: false,
                    onProfileTap: { showProfileSheet = true },
                    onAlertTap: { showAlertsSheet = true },
                    onMenuTap: { showMenuSheet = true },
                    onAddTap: nil
                )
            }
        }
        .sheet(isPresented: $showProfileSheet) {
            ProfileView()
        }
        .sheet(isPresented: $showAlertsSheet) {
            AlertsView()
        }
        .sheet(isPresented: $showMenuSheet) {
            MenuView()
        }
        .task {
            await loadApplications()
        }
    }

    // MARK: - Applications Content

    private var applicationsContent: some View {
        VStack(spacing: 0) {
            // Spacer for floating header
            Color.clear.frame(height: 70)

            // Filters
            filtersSection
                .padding(.top, 12)

            // List
            ScrollView(showsIndicators: false) {
                LazyVStack(spacing: 8) {
                    ForEach(filteredApplications) { application in
                        ModernApplicationCard(application: application, role: role)
                            .buttonStyle(PlainButtonStyle())
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 12)
                .padding(.bottom, 100)
            }
        }
    }

    // MARK: - Filters Section

    private var filtersSection: some View {
        VStack(spacing: 8) {
            // Search Bar
            HStack(spacing: 12) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(Color(hex: "9CA3AF"))

                TextField("Rechercher par nom...", text: $searchText)
                    .font(Theme.PinterestTypography.bodyRegular(.regular))
                    .foregroundColor(Theme.Colors.textPrimary)

                if !searchText.isEmpty {
                    Button(action: {
                        searchText = ""
                        Haptic.selection()
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 16))
                            .foregroundColor(Color(hex: "9CA3AF"))
                    }
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.white.opacity(0.9))
                    .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
            )

            // Property and Status Filters
            HStack(spacing: 8) {
                // Property Filter
                Menu {
                    Button(action: {
                        selectedProperty = nil
                        Haptic.selection()
                    }) {
                        Label("Toutes les propriétés", systemImage: "building.2")
                    }
                    // TODO: Add actual properties
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "building.2")
                            .font(.system(size: 14, weight: .medium))
                        Text(selectedProperty == nil ? "Toutes" : "Filtrées")
                            .font(Theme.PinterestTypography.bodySmall(.semibold))
                        Image(systemName: "chevron.down")
                            .font(.system(size: 10, weight: .semibold))
                    }
                    .foregroundColor(Theme.Colors.Owner.primary)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 8)
                    .background(
                        RoundedRectangle(cornerRadius: 8)
                            .fill(Theme.Colors.Owner.primary.opacity(0.1))
                    )
                }

                // Status Filter
                Menu {
                    Button(action: {
                        selectedStatus = nil
                        Haptic.selection()
                    }) {
                        Label("Tous les statuts", systemImage: "line.3.horizontal.decrease.circle")
                    }
                    ForEach(ApplicationStatus.allCases, id: \.self) { status in
                        Button(action: {
                            selectedStatus = status
                            Haptic.selection()
                        }) {
                            Label(status.displayName, systemImage: "circle.fill")
                        }
                    }
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "line.3.horizontal.decrease.circle")
                            .font(.system(size: 14, weight: .medium))
                        Text(selectedStatus?.displayName ?? "Tous")
                            .font(Theme.PinterestTypography.bodySmall(.semibold))
                        Image(systemName: "chevron.down")
                            .font(.system(size: 10, weight: .semibold))
                    }
                    .foregroundColor(Theme.Colors.Owner.primary)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 8)
                    .background(
                        RoundedRectangle(cornerRadius: 8)
                            .fill(Theme.Colors.Owner.primary.opacity(0.1))
                    )
                }

                Spacer()

                // Results count
                Text("\(filteredApplications.count)")
                    .font(Theme.PinterestTypography.bodySmall(.bold))
                    .foregroundColor(Theme.Colors.textSecondary)
            }
        }
        .padding(.horizontal, 20)
    }

    // MARK: - Computed Properties

    private var filteredApplications: [Application] {
        var result = applications

        // Filter by search text
        if !searchText.isEmpty {
            result = result.filter { application in
                application.applicantName.localizedCaseInsensitiveContains(searchText)
            }
        }

        // Filter by property
        if let propertyId = selectedProperty {
            result = result.filter { $0.propertyId == propertyId }
        }

        // Filter by status
        if let status = selectedStatus {
            result = result.filter { $0.status == status }
        }

        // Sort: new first, then by date
        result.sort { app1, app2 in
            if app1.isNew != app2.isNew {
                return app1.isNew
            }
            return app1.date > app2.date
        }

        return result
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .fill(Theme.Colors.Owner.primary.opacity(0.15))
                    .frame(width: 140, height: 140)

                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [Theme.Colors.Owner.primary, Theme.Colors.Owner._400],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 100, height: 100)
                        .shadow(
                            color: Theme.Colors.Owner.primary.opacity(0.3),
                            radius: 12,
                            x: 0,
                            y: 6
                        )

                    Image(systemName: "doc.text")
                        .font(.system(size: 44, weight: .medium))
                        .foregroundColor(.white)
                }
            }

            VStack(spacing: 8) {
                Text("Aucune candidature")
                    .font(Theme.PinterestTypography.heroMedium(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Vos candidatures apparaîtront ici")
                    .font(Theme.PinterestTypography.bodyRegular(.medium))
                    .foregroundColor(Theme.Colors.textSecondary)
                    .multilineTextAlignment(.center)
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.horizontal, 24)
    }

    // MARK: - Data Methods

    private func loadApplications() async {
        isLoading = true

        // Demo mode
        if AppConfig.FeatureFlags.demoMode {
            try? await Task.sleep(nanoseconds: 500_000_000)
            applications = Application.mockApplications
        }

        isLoading = false
    }
}

// MARK: - Modern Application Card

struct ModernApplicationCard: View {
    let application: Application
    let role: Theme.UserRole

    var body: some View {
        PinterestCard(role: role) {
            HStack(spacing: 12) {
                // Avatar with gradient
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [Theme.Colors.Owner.primary, Theme.Colors.Owner._400],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 64, height: 64)
                        .shadow(
                            color: Theme.Colors.Owner.primary.opacity(0.25),
                            radius: 8,
                            x: 0,
                            y: 4
                        )

                    Group {
                        if let avatar = application.applicantAvatar {
                            AsyncImage(url: URL(string: avatar)) { image in
                                image
                                    .resizable()
                                    .scaledToFill()
                            } placeholder: {
                                initialsView
                            }
                            .frame(width: 64, height: 64)
                            .clipShape(Circle())
                        } else {
                            initialsView
                        }
                    }
                }

                VStack(alignment: .leading, spacing: 6) {
                    // Name with badges
                    HStack(spacing: 8) {
                        Text(application.applicantName)
                            .font(Theme.PinterestTypography.bodyRegular(.bold))
                            .foregroundColor(Theme.Colors.textPrimary)
                            .lineLimit(1)

                        if application.isNew {
                            Text("NOUVEAU")
                                .font(.system(size: 9, weight: .black))
                                .foregroundColor(.white)
                                .tracking(0.3)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 3)
                                .background(
                                    Capsule()
                                        .fill(Color(hex: "EF4444"))
                                )
                                .shadow(
                                    color: Color(hex: "EF4444").opacity(0.3),
                                    radius: 4,
                                    x: 0,
                                    y: 2
                                )
                        }

                        if application.isGroup {
                            HStack(spacing: 3) {
                                Image(systemName: "person.2.fill")
                                    .font(.system(size: 9))
                                Text("\(application.groupSize ?? 0)")
                                    .font(.system(size: 10, weight: .bold))
                            }
                            .foregroundColor(Theme.Colors.Owner.primary)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 3)
                            .background(
                                Capsule()
                                    .fill(Theme.Colors.Owner.primary.opacity(0.15))
                            )
                        }
                    }

                    // Property title
                    Text(application.propertyTitle)
                        .font(Theme.PinterestTypography.bodySmall(.medium))
                        .foregroundColor(Theme.Colors.textSecondary)
                        .lineLimit(1)

                    // Time and status
                    HStack(spacing: 4) {
                        HStack(spacing: 4) {
                            Image(systemName: "clock")
                                .font(.system(size: 11))
                            Text(application.date.timeAgo)
                                .font(.system(size: 11, weight: .medium))
                        }
                        .foregroundColor(Color(hex: "9CA3AF"))

                        Circle()
                            .fill(Color(hex: "D1D5DB"))
                            .frame(width: 3, height: 3)

                        HStack(spacing: 4) {
                            Circle()
                                .fill(application.status.color)
                                .frame(width: 7, height: 7)
                            Text(application.status.displayName)
                                .font(.system(size: 11, weight: .semibold))
                                .foregroundColor(application.status.color)
                        }
                    }
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }
        }
    }

    private var initialsView: some View {
        Text(String(application.applicantName.prefix(1)))
            .font(.system(size: 26, weight: .bold))
            .foregroundColor(.white)
    }
}

// MARK: - Application Model

struct Application: Identifiable {
    let id: UUID
    let applicantName: String
    let applicantAge: Int
    let applicantAvatar: String?
    let propertyId: UUID
    let propertyTitle: String
    let date: Date
    var status: ApplicationStatus
    let isNew: Bool
    let isGroup: Bool
    let groupSize: Int?
    let message: String

    static var mockApplications: [Application] {
        [
            Application(
                id: UUID(),
                applicantName: "Sophie Martin",
                applicantAge: 28,
                applicantAvatar: nil,
                propertyId: UUID(),
                propertyTitle: "Studio meublé - Ixelles",
                date: Date().addingTimeInterval(-3600),
                status: .new,
                isNew: true,
                isGroup: false,
                groupSize: nil,
                message: "Bonjour, je suis très intéressée par votre appartement..."
            ),
            Application(
                id: UUID(),
                applicantName: "Thomas & Marie",
                applicantAge: 30,
                applicantAvatar: nil,
                propertyId: UUID(),
                propertyTitle: "2 chambres - Saint-Gilles",
                date: Date().addingTimeInterval(-7200),
                status: .underReview,
                isNew: false,
                isGroup: true,
                groupSize: 2,
                message: "Nous sommes un couple à la recherche d'un appartement..."
            ),
            Application(
                id: UUID(),
                applicantName: "Lucas Dubois",
                applicantAge: 25,
                applicantAvatar: nil,
                propertyId: UUID(),
                propertyTitle: "Colocation - Schaerbeek",
                date: Date().addingTimeInterval(-86400),
                status: .accepted,
                isNew: false,
                isGroup: false,
                groupSize: nil,
                message: "Je cherche une colocation pour septembre..."
            ),
            Application(
                id: UUID(),
                applicantName: "Emma Bernard",
                applicantAge: 27,
                applicantAvatar: nil,
                propertyId: UUID(),
                propertyTitle: "Appartement 1 chambre - Etterbeek",
                date: Date().addingTimeInterval(-172800),
                status: .rejected,
                isNew: false,
                isGroup: false,
                groupSize: nil,
                message: "Je suis étudiante en master et je cherche..."
            ),
            Application(
                id: UUID(),
                applicantName: "Alex & Jules & Léa",
                applicantAge: 24,
                applicantAvatar: nil,
                propertyId: UUID(),
                propertyTitle: "Grande colocation - Uccle",
                date: Date().addingTimeInterval(-259200),
                status: .underReview,
                isNew: true,
                isGroup: true,
                groupSize: 3,
                message: "Nous sommes trois amis qui cherchons une grande colocation..."
            )
        ]
    }
}

// MARK: - Application Status

enum ApplicationStatus: String, CaseIterable {
    case new = "Nouvelle"
    case underReview = "En examen"
    case accepted = "Acceptée"
    case rejected = "Refusée"

    var displayName: String {
        self.rawValue
    }

    var color: Color {
        switch self {
        case .new: return Color(hex: "3B82F6")
        case .underReview: return Color(hex: "FBBF24")
        case .accepted: return Color(hex: "10B981")
        case .rejected: return Color(hex: "EF4444")
        }
    }
}
