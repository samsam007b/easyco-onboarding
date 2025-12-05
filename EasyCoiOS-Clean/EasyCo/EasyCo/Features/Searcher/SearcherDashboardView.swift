import SwiftUI

// MARK: - Searcher Dashboard View

struct SearcherDashboardView: View {
    @StateObject private var viewModel = SearcherDashboardViewModel()
    @State private var showSwipeMode = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Hero Search Section
                    heroSearchSection

                    // Quick Actions
                    quickActionsSection

                    // KPI Cards Grid
                    if viewModel.isLoading {
                        ProgressView("Chargement...")
                            .frame(height: 200)
                    } else if let stats = viewModel.stats {
                        kpiCardsGrid(stats: stats)
                    }

                    // Top Matches
                    if !viewModel.topMatches.isEmpty {
                        topMatchesSection
                    }

                    // Recently Viewed Properties
                    if !viewModel.recentlyViewed.isEmpty {
                        recentlyViewedSection
                    }

                    // Analytics Insights
                    if let stats = viewModel.stats {
                        analyticsInsightsSection(stats: stats)
                    }
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    HStack(spacing: 8) {
                        Image(systemName: "magnifyingglass")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Theme.Colors.Searcher.primary)
                        Text("Explorer")
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(Color(hex: "111827"))
                    }
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        Task { await viewModel.refresh() }
                    }) {
                        Image(systemName: "arrow.clockwise")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Theme.Colors.Searcher.primary)
                    }
                }
            }
            .fullScreenCover(isPresented: $showSwipeMode) {
                SwipeMatchesView()
            }
        }
        .task {
            await viewModel.loadData()
        }
    }

    // MARK: - Hero Search Section

    private var heroSearchSection: some View {
        VStack(spacing: 16) {
            // Title with greeting
            VStack(alignment: .leading, spacing: 8) {
                Text("Bonjour ! 👋")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Trouve ta colocation idéale parmi des centaines de propriétés vérifiées")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            // Search Button
            NavigationLink(destination: PropertiesListView()) {
                HStack(spacing: 12) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 18, weight: .semibold))

                    Text("Rechercher une colocation...")
                        .font(.system(size: 16))

                    Spacer()

                    Image(systemName: "arrow.right")
                        .font(.system(size: 14, weight: .semibold))
                }
                .foregroundColor(.white)
                .padding(16)
                .background(Theme.Gradients.searcherCTA)
                .cornerRadius(16)
                .shadow(color: Theme.Colors.Searcher.primary.opacity(0.3), radius: 8, x: 0, y: 4)
            }
        }
        .padding(20)
        .background(
            LinearGradient(
                colors: [
                    Theme.Colors.Searcher._100,
                    Color.white
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(20)
        .shadow(color: .black.opacity(0.05), radius: 10, x: 0, y: 4)
    }

    // MARK: - Quick Actions Section

    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Actions rapides")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            // First row
            HStack(spacing: 12) {
                // Swipe Mode
                QuickActionButton(
                    icon: "hand.draw.fill",
                    title: "Mode Swipe",
                    color: Theme.Colors.Searcher.primary
                ) {
                    showSwipeMode = true
                }

                // Favorites
                NavigationLink(destination: FavoritesView()) {
                    QuickActionButton(
                        icon: "heart.fill",
                        title: "Favoris",
                        color: Color(hex: "EF4444")
                    ) {}
                }
                .buttonStyle(PlainButtonStyle())

                // Matches
                NavigationLink(destination: MatchesView()) {
                    QuickActionButton(
                        icon: "sparkles",
                        title: "Matchs",
                        color: Color(hex: "F59E0B")
                    ) {}
                }
                .buttonStyle(PlainButtonStyle())

                // Alerts
                NavigationLink(destination: AlertsView()) {
                    QuickActionButton(
                        icon: "bell.fill",
                        title: "Alertes",
                        color: Color(hex: "3B82F6")
                    ) {}
                }
                .buttonStyle(PlainButtonStyle())
            }

            // Second row
            HStack(spacing: 12) {
                // My Visits
                NavigationLink(destination: MyVisitsView()) {
                    QuickActionButton(
                        icon: "calendar.badge.clock",
                        title: "Mes Visites",
                        color: Color(hex: "10B981")
                    ) {}
                }
                .buttonStyle(PlainButtonStyle())

                // Profile Enhancement
                NavigationLink(destination: ProfileEnhancementView(userRole: .searcher)) {
                    QuickActionButton(
                        icon: "person.crop.circle.badge.plus",
                        title: "Mon Profil",
                        color: Color(hex: "8B5CF6")
                    ) {}
                }
                .buttonStyle(PlainButtonStyle())

                // Saved Searches
                NavigationLink(destination: SavedSearchesView()) {
                    QuickActionButton(
                        icon: "bookmark.fill",
                        title: "Recherches",
                        color: Color(hex: "6366F1")
                    ) {}
                }
                .buttonStyle(PlainButtonStyle())

                // Groups
                NavigationLink(destination: GroupsListView()) {
                    QuickActionButton(
                        icon: "person.3.fill",
                        title: "Groupes",
                        color: Color(hex: "EC4899")
                    ) {}
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
    }

    // MARK: - KPI Cards Grid

    private func kpiCardsGrid(stats: SearcherStats) -> some View {
        LazyVGrid(
            columns: [
                GridItem(.flexible(), spacing: 16),
                GridItem(.flexible(), spacing: 16)
            ],
            spacing: 16
        ) {
            NavigationLink(destination: MessagesListView()) {
                SearcherKPICard(
                    title: "Messages",
                    value: "\(stats.unreadMessages)",
                    subtitle: stats.unreadMessages > 0 ? "non lus" : "tout lu",
                    icon: "envelope.fill",
                    color: Color(hex: "F59E0B"),
                    hasNotification: stats.unreadMessages > 0
                )
            }
            .buttonStyle(PlainButtonStyle())

            NavigationLink(destination: FavoritesView()) {
                SearcherKPICard(
                    title: "Favoris",
                    value: "\(stats.favoritesCount)",
                    subtitle: "propriétés",
                    icon: "heart.fill",
                    color: Color(hex: "EF4444"),
                    hasNotification: false
                )
            }
            .buttonStyle(PlainButtonStyle())

            NavigationLink(destination: MatchesView()) {
                SearcherKPICard(
                    title: "Top Matchs",
                    value: "\(stats.topMatches)",
                    subtitle: "compatibles",
                    icon: "star.fill",
                    color: Theme.Colors.Searcher.primary,
                    hasNotification: stats.topMatches > 0
                )
            }
            .buttonStyle(PlainButtonStyle())

            SearcherKPICard(
                title: "Candidatures",
                value: "\(stats.applicationsCount)",
                subtitle: "envoyées",
                icon: "paperplane.fill",
                color: Color(hex: "3B82F6"),
                hasNotification: false
            )
        }
    }

    // MARK: - Top Matches Section

    private var topMatchesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                HStack(spacing: 8) {
                    Image(systemName: "sparkles")
                        .font(.system(size: 16))
                        .foregroundColor(Theme.Colors.Searcher.primary)
                    Text("Top Matchs pour vous")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                Spacer()

                NavigationLink(destination: MatchesView()) {
                    Text("Voir tout")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Theme.Colors.Searcher.primary)
                }
            }

            VStack(spacing: 12) {
                ForEach(viewModel.topMatches.prefix(3)) { property in
                    NavigationLink(destination: PropertyDetailView(property: property)) {
                        TopMatchCard(property: property)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
        }
    }

    // MARK: - Recently Viewed Section

    private var recentlyViewedSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Récemment consultées")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                Button("Historique") {
                    // Navigate to full history
                }
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Theme.Colors.Searcher.primary)
            }

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(viewModel.recentlyViewed.prefix(5)) { property in
                        NavigationLink(destination: PropertyDetailView(property: property)) {
                            PropertyCompactCard(property: property)
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
            }
        }
    }

    // MARK: - Analytics Insights Section

    private func analyticsInsightsSection(stats: SearcherStats) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Image(systemName: "chart.bar.fill")
                    .font(.system(size: 16))
                    .foregroundColor(Theme.Colors.Searcher.primary)
                Text("Vos préférences")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
            }

            VStack(spacing: 12) {
                InsightRow(
                    icon: "mappin.circle.fill",
                    title: "Ville favorite",
                    value: stats.preferences.favoriteCity ?? "Non défini",
                    color: Theme.Colors.Searcher.primary
                )

                InsightRow(
                    icon: "eurosign.circle.fill",
                    title: "Budget préféré",
                    value: stats.preferences.priceRange ?? "Non défini",
                    color: Color(hex: "10B981")
                )

                if !stats.preferences.preferredPropertyTypes.isEmpty {
                    InsightRow(
                        icon: "house.circle.fill",
                        title: "Type de logement",
                        value: stats.preferences.preferredPropertyTypes.joined(separator: ", "),
                        color: Color(hex: "3B82F6")
                    )
                }
            }

            // Edit Preferences Button
            NavigationLink(destination: Text("Préférences de recherche")) {
                HStack {
                    Image(systemName: "slider.horizontal.3")
                        .font(.system(size: 14, weight: .semibold))
                    Text("Modifier mes préférences")
                        .font(.system(size: 14, weight: .semibold))
                }
                .foregroundColor(Theme.Colors.Searcher.primary)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(Theme.Colors.Searcher.primary.opacity(0.1))
                .cornerRadius(12)
            }
        }
    }
}

// MARK: - Quick Action Button

private struct QuickActionButton: View {
    let icon: String
    let title: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(color)
                    .frame(width: 44, height: 44)
                    .background(color.opacity(0.1))
                    .cornerRadius(12)

                Text(title)
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(Color(hex: "6B7280"))
                    .lineLimit(1)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(Color.white)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
    }
}

// MARK: - Searcher KPI Card

private struct SearcherKPICard: View {
    let title: String
    let value: String
    let subtitle: String
    let icon: String
    let color: Color
    let hasNotification: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 22))
                    .foregroundColor(color)

                Spacer()

                if hasNotification {
                    Circle()
                        .fill(color)
                        .frame(width: 8, height: 8)
                }
            }

            VStack(alignment: .leading, spacing: 2) {
                Text(value)
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text(subtitle)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Text(title)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "374151"))
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
    }
}

// MARK: - Top Match Card

private struct TopMatchCard: View {
    let property: Property

    var body: some View {
        HStack(spacing: 16) {
            // Match score badge
            VStack(spacing: 4) {
                Text("\(property.compatibilityScore ?? 85)%")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Theme.Colors.Searcher.primary)

                Text("Match")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(Color(hex: "6B7280"))
            }
            .frame(width: 64)
            .padding(.vertical, 14)
            .background(
                LinearGradient(
                    colors: [Theme.Colors.Searcher._100, Theme.Colors.Searcher._200],
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
            .cornerRadius(12)

            // Property info
            VStack(alignment: .leading, spacing: 6) {
                Text(property.title)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
                    .lineLimit(1)

                HStack(spacing: 4) {
                    Image(systemName: "mappin")
                        .font(.system(size: 11))
                    Text(property.city)
                        .font(.system(size: 13))
                }
                .foregroundColor(Color(hex: "6B7280"))

                Text("\(property.monthlyRent)€/mois")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(Theme.Colors.Searcher.primary)
            }

            Spacer()

            // Arrow
            Image(systemName: "chevron.right")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(Color(hex: "D1D5DB"))
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Property Compact Card

private struct PropertyCompactCard: View {
    let property: Property

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Property image
            ZStack(alignment: .topTrailing) {
                if let imageUrl = property.mainImageURL, let url = URL(string: imageUrl) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Rectangle()
                            .fill(
                                LinearGradient(
                                    colors: [Theme.Colors.Searcher.primary, Theme.Colors.Searcher._400],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .overlay(
                                Image(systemName: "building.2.fill")
                                    .font(.system(size: 28))
                                    .foregroundColor(.white.opacity(0.5))
                            )
                    }
                    .frame(width: 160, height: 100)
                    .clipped()
                    .cornerRadius(12)
                } else {
                    Rectangle()
                        .fill(
                            LinearGradient(
                                colors: [Theme.Colors.Searcher.primary, Theme.Colors.Searcher._400],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 160, height: 100)
                        .cornerRadius(12)
                        .overlay(
                            Image(systemName: "building.2.fill")
                                .font(.system(size: 28))
                                .foregroundColor(.white.opacity(0.5))
                        )
                }

                // Match badge
                if let score = property.compatibilityScore, score >= 80 {
                    Text("\(score)%")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 3)
                        .background(Theme.Colors.Searcher.primary)
                        .cornerRadius(6)
                        .padding(8)
                }
            }

            // Property info
            VStack(alignment: .leading, spacing: 4) {
                Text(property.title)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
                    .lineLimit(1)

                Text(property.city)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "6B7280"))

                Text("\(property.monthlyRent)€/mois")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Theme.Colors.Searcher.primary)
            }
        }
        .frame(width: 160)
        .padding(12)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Insight Row

private struct InsightRow: View {
    let icon: String
    let title: String
    let value: String
    let color: Color

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(color)
                .frame(width: 40, height: 40)
                .background(color.opacity(0.1))
                .cornerRadius(10)

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(Color(hex: "6B7280"))

                Text(value)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.system(size: 12))
                .foregroundColor(Color(hex: "D1D5DB"))
        }
        .padding(14)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.03), radius: 4, x: 0, y: 2)
    }
}

// MARK: - View Model

@MainActor
class SearcherDashboardViewModel: ObservableObject {
    @Published var stats: SearcherStats?
    @Published var recentlyViewed: [Property] = []
    @Published var topMatches: [Property] = []
    @Published var isLoading = false
    @Published var error: NetworkError?

    private let analyticsService = AnalyticsService.shared

    func loadData() async {
        isLoading = true
        defer { isLoading = false }

        do {
            // Load stats
            stats = try await analyticsService.getSearcherStats()

            // Load recently viewed
            let allRecent = try await analyticsService.getRecentlyViewedProperties()
            recentlyViewed = Array(allRecent.prefix(10))

            // Load top matches (demo mode)
            if AppConfig.FeatureFlags.demoMode {
                topMatches = Property.mockProperties
                    .filter { ($0.compatibilityScore ?? 0) >= 80 }
                    .sorted { ($0.compatibilityScore ?? 0) > ($1.compatibilityScore ?? 0) }
            }
        } catch let error as NetworkError {
            self.error = error
        } catch {
            self.error = .unknown(error)
        }
    }

    func refresh() async {
        await loadData()
    }
}
