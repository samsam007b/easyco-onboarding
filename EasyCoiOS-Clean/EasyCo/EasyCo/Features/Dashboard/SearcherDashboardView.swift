//
//  SearcherDashboardView.swift
//  EasyCo
//
//  Dashboard for searchers with activity overview, saved searches, recent matches
//

import SwiftUI

struct SearcherDashboardView: View {
    @State private var savedSearches: [SavedSearch] = []
    @State private var recentMatches: [Match] = []
    @State private var upcomingVisits: [Visit] = []
    @State private var applications: [Application] = []
    @State private var activityData: [LineChartData] = []

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header with greeting
                    headerSection

                    // KPI Cards
                    kpiSection

                    // Activity chart
                    activitySection

                    // Upcoming visits
                    if !upcomingVisits.isEmpty {
                        upcomingVisitsSection
                    }

                    // Recent matches
                    if !recentMatches.isEmpty {
                        recentMatchesSection
                    }

                    // Saved searches
                    if !savedSearches.isEmpty {
                        savedSearchesSection
                    }

                    // Applications status
                    if !applications.isEmpty {
                        applicationsSection
                    }
                }
                .padding(.vertical, 20)
            }
            .background(Theme.Colors.backgroundSecondary)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Mon Dashboard")
                        .font(Theme.Typography.title3())
                        .foregroundColor(Theme.Colors.textPrimary)
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        // Notifications
                    }) {
                        ZStack(alignment: .topTrailing) {
                            Image.lucide("bell")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 22, height: 22)
                                .foregroundColor(Theme.Colors.textPrimary)

                            // Unread badge
                            Circle()
                                .fill(Theme.Colors.error)
                                .frame(width: 8, height: 8)
                                .offset(x: 2, y: -2)
                        }
                    }
                }
            }
        }
        .onAppear {
            loadDashboardData()
        }
    }

    // MARK: - Header Section

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Bonjour ! 👋")
                .font(Theme.Typography.title2())
                .foregroundColor(Theme.Colors.textPrimary)

            Text("Voici un aperçu de votre recherche de logement")
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal)
    }

    // MARK: - KPI Section

    private var kpiSection: some View {
        VStack(spacing: 12) {
            HStack(spacing: 12) {
                KPICard(
                    title: "Vues",
                    value: "24",
                    subtitle: "Cette semaine",
                    icon: "eye",
                    iconColor: Color(hex: "60A5FA"),
                    trend: Trend(value: 12.5, isPositive: true)
                )

                KPICard(
                    title: "Matchs",
                    value: "8",
                    subtitle: "Total",
                    icon: "heart",
                    iconColor: Theme.Colors.error,
                    trend: Trend(value: 33.3, isPositive: true)
                )
            }

            HStack(spacing: 12) {
                KPICard(
                    title: "Favoris",
                    value: "15",
                    subtitle: "Sauvegardés",
                    icon: "bookmark",
                    iconColor: Color(hex: "F59E0B")
                )

                KPICard(
                    title: "Visites",
                    value: "3",
                    subtitle: "À venir",
                    icon: "calendar",
                    iconColor: Color(hex: "10B981")
                )
            }
        }
        .padding(.horizontal)
    }

    // MARK: - Activity Section

    private var activitySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Activité de recherche")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                Button(action: {}) {
                    Text("7 jours")
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.primary)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Theme.Colors.primary.opacity(0.1))
                        .cornerRadius(8)
                }
            }

            LineChart(
                data: activityData,
                lineColor: Theme.Colors.primary,
                showGradient: true,
                showPoints: true
            )
        }
        .padding(20)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
        .padding(.horizontal)
    }

    // MARK: - Upcoming Visits Section

    private var upcomingVisitsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Visites à venir")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                NavigationLink(destination: Text("Toutes les visites")) {
                    Text("Voir tout")
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.primary)
                }
            }
            .padding(.horizontal)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(upcomingVisits.prefix(3)) { visit in
                        VisitCard(visit: visit)
                    }
                }
                .padding(.horizontal)
            }
        }
    }

    // MARK: - Recent Matches Section

    private var recentMatchesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Matchs récents")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                NavigationLink(destination: MatchesListView()) {
                    Text("Voir tout")
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.primary)
                }
            }
            .padding(.horizontal)

            VStack(spacing: 12) {
                ForEach(recentMatches.prefix(3)) { match in
                    CompactMatchCard(match: match)
                }
            }
            .padding(.horizontal)
        }
    }

    // MARK: - Saved Searches Section

    private var savedSearchesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Recherches sauvegardées")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                NavigationLink(destination: Text("Toutes les recherches")) {
                    Text("Voir tout")
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.primary)
                }
            }
            .padding(.horizontal)

            VStack(spacing: 12) {
                ForEach(savedSearches.prefix(3)) { search in
                    SavedSearchCard(search: search)
                }
            }
            .padding(.horizontal)
        }
    }

    // MARK: - Applications Section

    private var applicationsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Mes candidatures")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                NavigationLink(destination: Text("Toutes les candidatures")) {
                    Text("Voir tout")
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.primary)
                }
            }
            .padding(.horizontal)

            VStack(spacing: 12) {
                ForEach(applications.prefix(3)) { application in
                    ApplicationCard(application: application)
                }
            }
            .padding(.horizontal)
        }
    }

    // MARK: - Data Loading

    private func loadDashboardData() {
        // Activity data for last 7 days
        activityData = [
            LineChartData(label: "Lun", value: 12),
            LineChartData(label: "Mar", value: 18),
            LineChartData(label: "Mer", value: 15),
            LineChartData(label: "Jeu", value: 24),
            LineChartData(label: "Ven", value: 20),
            LineChartData(label: "Sam", value: 8),
            LineChartData(label: "Dim", value: 6)
        ]

        // Mock saved searches
        savedSearches = [
            SavedSearch(
                id: "1",
                name: "Studio Bruxelles Centre",
                location: "Bruxelles, Centre",
                priceRange: "600-800€",
                newResultsCount: 3
            ),
            SavedSearch(
                id: "2",
                name: "2 chambres Ixelles",
                location: "Ixelles",
                priceRange: "900-1200€",
                newResultsCount: 0
            )
        ]

        // Mock recent matches (reuse from MatchesListView)
        let calendar = Calendar.current
        recentMatches = [
            Match(
                id: "1",
                property: .mock,
                matchedAt: calendar.date(byAdding: .hour, value: -2, to: Date())!,
                hasUnreadMessages: true,
                lastMessage: "Quand puis-je visiter ?",
                lastMessageAt: calendar.date(byAdding: .minute, value: -30, to: Date())!
            ),
            Match(
                id: "2",
                property: Property(
                    id: "2",
                    title: "Studio lumineux avec balcon",
                    location: "Bruxelles, Louise",
                    price: 680,
                    bedrooms: 1,
                    bathrooms: 1,
                    area: 35,
                    images: ["https://via.placeholder.com/400x300/90EE90"],
                    isNew: false,
                    isVerified: true,
                    matchScore: 92,
                    distance: 0.8,
                    availableFrom: "1er avril"
                ),
                matchedAt: calendar.date(byAdding: .day, value: -1, to: Date())!,
                hasUnreadMessages: false,
                lastMessage: nil,
                lastMessageAt: nil
            )
        ]

        // Mock upcoming visits
        upcomingVisits = [
            Visit(
                id: "1",
                property: .mock,
                date: calendar.date(byAdding: .day, value: 2, to: Date())!,
                time: "14:00",
                status: .confirmed
            ),
            Visit(
                id: "2",
                property: Property(
                    id: "2",
                    title: "Studio lumineux avec balcon",
                    location: "Bruxelles, Louise",
                    price: 680,
                    bedrooms: 1,
                    bathrooms: 1,
                    area: 35,
                    images: ["https://via.placeholder.com/400x300/90EE90"],
                    isNew: false,
                    isVerified: true,
                    matchScore: 92,
                    distance: 0.8,
                    availableFrom: "1er avril"
                ),
                date: calendar.date(byAdding: .day, value: 5, to: Date())!,
                time: "16:30",
                status: .pending
            )
        ]

        // Mock applications
        applications = [
            Application(
                id: "1",
                property: .mock,
                status: .pending,
                appliedAt: calendar.date(byAdding: .day, value: -3, to: Date())!
            ),
            Application(
                id: "2",
                property: Property(
                    id: "3",
                    title: "Loft moderne avec terrasse",
                    location: "Bruxelles, Flagey",
                    price: 1100,
                    bedrooms: 2,
                    bathrooms: 1,
                    area: 90,
                    images: ["https://via.placeholder.com/400x300/DDA0DD"],
                    isNew: true,
                    isVerified: true,
                    matchScore: 88,
                    distance: 1.5,
                    availableFrom: "1er juin"
                ),
                status: .accepted,
                appliedAt: calendar.date(byAdding: .day, value: -7, to: Date())!
            )
        ]
    }
}

// MARK: - Supporting Models

struct SavedSearch: Identifiable {
    let id: String
    let name: String
    let location: String
    let priceRange: String
    let newResultsCount: Int
}

struct Visit: Identifiable {
    let id: String
    let property: Property
    let date: Date
    let time: String
    let status: VisitStatus

    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEE d MMM"
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: date)
    }
}

enum VisitStatus {
    case pending
    case confirmed
    case cancelled

    var color: Color {
        switch self {
        case .pending: return Theme.Colors.warning
        case .confirmed: return Theme.Colors.success
        case .cancelled: return Theme.Colors.error
        }
    }

    var label: String {
        switch self {
        case .pending: return "En attente"
        case .confirmed: return "Confirmée"
        case .cancelled: return "Annulée"
        }
    }
}

struct DashboardApplication: Identifiable {
    let id: String
    let property: Property
    let status: ApplicationStatus
    let appliedAt: Date

    var timeAgo: String {
        let now = Date()
        let interval = now.timeIntervalSince(appliedAt)
        let days = Int(interval / 86400)
        return "Il y a \(days)j"
    }
}

enum DashboardApplicationStatus {
    case pending
    case underReview
    case accepted
    case rejected

    var color: Color {
        switch self {
        case .pending: return Theme.Colors.warning
        case .underReview: return Color(hex: "60A5FA")
        case .accepted: return Theme.Colors.success
        case .rejected: return Theme.Colors.error
        }
    }

    var label: String {
        switch self {
        case .pending: return "En attente"
        case .underReview: return "En cours"
        case .accepted: return "Acceptée"
        case .rejected: return "Refusée"
        }
    }

    var icon: String {
        switch self {
        case .pending: return "clock"
        case .underReview: return "loader"
        case .accepted: return "check-circle"
        case .rejected: return "x-circle"
        }
    }
}

// MARK: - Supporting Cards

struct VisitCard: View {
    let visit: Visit

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Property image
            AsyncImage(url: URL(string: visit.property.images.first ?? "")) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Rectangle()
                    .fill(Theme.Colors.gray200)
            }
            .frame(width: 280, height: 120)
            .clipped()
            .cornerRadius(12)

            VStack(alignment: .leading, spacing: 8) {
                // Status badge
                HStack(spacing: 6) {
                    Circle()
                        .fill(visit.status.color)
                        .frame(width: 6, height: 6)

                    Text(visit.status.label)
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(visit.status.color)
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 5)
                .background(visit.status.color.opacity(0.1))
                .cornerRadius(8)

                // Property title
                Text(visit.property.title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .lineLimit(2)

                // Date and time
                HStack(spacing: 12) {
                    HStack(spacing: 4) {
                        Image.lucide("calendar")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 14, height: 14)
                            .foregroundColor(Theme.Colors.textTertiary)

                        Text(visit.formattedDate)
                            .font(Theme.Typography.bodySmall())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }

                    HStack(spacing: 4) {
                        Image.lucide("clock")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 14, height: 14)
                            .foregroundColor(Theme.Colors.textTertiary)

                        Text(visit.time)
                            .font(Theme.Typography.bodySmall())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }
                }
            }
        }
        .frame(width: 280)
        .padding(16)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }
}

struct CompactMatchCard: View {
    let match: Match

    var body: some View {
        HStack(spacing: 12) {
            // Property image
            AsyncImage(url: URL(string: match.property.images.first ?? "")) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Rectangle()
                    .fill(Theme.Colors.gray200)
            }
            .frame(width: 80, height: 80)
            .cornerRadius(12)

            // Property info
            VStack(alignment: .leading, spacing: 6) {
                Text(match.property.title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .lineLimit(2)

                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    Text("\(match.property.price)€")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Theme.Colors.primary)

                    Text("/mois")
                        .font(Theme.Typography.caption())
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                if let matchScore = match.property.matchScore {
                    HStack(spacing: 4) {
                        Circle()
                            .fill(Theme.Colors.success)
                            .frame(width: 6, height: 6)

                        Text("\(matchScore)% Compatible")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(Theme.Colors.success)
                    }
                }
            }

            Spacer()

            Image.lucide("chevron-right")
                .resizable()
                .scaledToFit()
                .frame(width: 20, height: 20)
                .foregroundColor(Theme.Colors.textTertiary)
        }
        .padding(12)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }
}

struct SavedSearchCard: View {
    let search: SavedSearch

    var body: some View {
        HStack(spacing: 16) {
            Image.lucide("search")
                .resizable()
                .scaledToFit()
                .frame(width: 20, height: 20)
                .foregroundColor(Theme.Colors.primary)
                .frame(width: 48, height: 48)
                .background(Theme.Colors.primary.opacity(0.1))
                .cornerRadius(12)

            VStack(alignment: .leading, spacing: 4) {
                Text(search.name)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                HStack(spacing: 8) {
                    Text(search.location)
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)

                    Text("•")
                        .foregroundColor(Theme.Colors.textTertiary)

                    Text(search.priceRange)
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }

            Spacer()

            if search.newResultsCount > 0 {
                Text("\(search.newResultsCount)")
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.white)
                    .frame(minWidth: 20, minHeight: 20)
                    .padding(.horizontal, 6)
                    .background(Theme.Colors.primary)
                    .clipShape(Circle())
            }

            Image.lucide("chevron-right")
                .resizable()
                .scaledToFit()
                .frame(width: 20, height: 20)
                .foregroundColor(Theme.Colors.textTertiary)
        }
        .padding(16)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }
}

struct ApplicationCard: View {
    let application: DashboardApplication

    var body: some View {
        HStack(spacing: 12) {
            // Property image
            AsyncImage(url: URL(string: application.property.images.first ?? "")) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Rectangle()
                    .fill(Theme.Colors.gray200)
            }
            .frame(width: 80, height: 80)
            .cornerRadius(12)

            VStack(alignment: .leading, spacing: 8) {
                Text(application.property.title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .lineLimit(2)

                HStack(spacing: 6) {
                    Image.lucide(application.status.icon)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 12, height: 12)
                        .foregroundColor(application.status.color)

                    Text(application.status.label)
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(application.status.color)
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 5)
                .background(application.status.color.opacity(0.1))
                .cornerRadius(8)

                Text(application.timeAgo)
                    .font(Theme.Typography.caption())
                    .foregroundColor(Theme.Colors.textTertiary)
            }

            Spacer()

            Image.lucide("chevron-right")
                .resizable()
                .scaledToFit()
                .frame(width: 20, height: 20)
                .foregroundColor(Theme.Colors.textTertiary)
        }
        .padding(12)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }
}

// MARK: - Preview

struct SearcherDashboardView_Previews: PreviewProvider {
    static var previews: some View {
        SearcherDashboardView()
    }
}
