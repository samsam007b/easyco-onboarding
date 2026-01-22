import SwiftUI

// MARK: - Searcher Dashboard View
// Information Rich Design - Matching ProfileView aesthetic
// Migrated to DesignTokens v3.3 on 2026-01-22

struct SearcherDashboardView: View {
    @StateObject private var viewModel = SearcherDashboardViewModel()
    @State private var showSwipeMode = false
    @State private var showProfileSheet = false

    var body: some View {
        ZStack(alignment: .top) {
            // Background avec profondeur (warm gradient)
            ZStack {
                LinearGradient(
                    colors: [
                        Color(hex: "FFF5F0"),
                        Color(hex: "FFF0E6"),
                        Color(hex: "FFE5D9")
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()

                // Organic shapes
                Circle()
                    .fill(Theme.Colors.Searcher.primary.opacity(0.08))
                    .frame(width: 400, height: 400)
                    .blur(radius: 100)
                    .offset(x: -100, y: -200)

                Circle()
                    .fill(Color(hex: "FACC15").opacity(0.06))
                    .frame(width: 300, height: 300)
                    .blur(radius: 80)
                    .offset(x: 150, y: 500)
            }

            ScrollView(showsIndicators: false) {
                VStack(spacing: 20) {
                    // Hero Title Card
                    heroTitleCard
                        .padding(.top, 40)

                    // Search Preferences Card
                    searchPreferencesCard

                    // Large Search CTA Button
                    searchCTAButton

                    // Quick Filters
                    quickFiltersRow

                    // Stats Grid (if data available)
                    if let stats = viewModel.stats {
                        statsGrid(stats: stats)
                    }

                    // Top Matches Section
                    if !viewModel.topMatches.isEmpty {
                        topMatchesSection
                    }

                    // Recently Viewed
                    if !viewModel.recentlyViewed.isEmpty {
                        recentlyViewedSection
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 100)
            }
        }
        .fullScreenCover(isPresented: $showSwipeMode) {
            SwipeMatchesView()
        }
        .sheet(isPresented: $showProfileSheet) {
            ProfileView()
        }
        .task {
            await viewModel.loadData()
        }
    }

    // MARK: - Hero Title Card

    private var heroTitleCard: some View {
        VStack(spacing: 12) {
            Text("Trouve ta colocation")
                .font(.system(size: 32, weight: .bold))
                .foregroundColor(DesignTokens.Colors.textPrimary)
                .frame(maxWidth: .infinity, alignment: .leading)

            Text("Transparence et modernité")
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(DesignTokens.Colors.textSecondary)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .fill(Color.white.opacity(0.85))
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(Color.white, lineWidth: 2)
                )
        )
        .richShadow()
    }

    // MARK: - Search Preferences Card

    private var searchPreferencesCard: some View {
        VStack(spacing: 16) {
            // Location
            NavigationLink(destination: SearchPreferencesView()) {
                SearchPreferenceRow(
                    icon: "mappin.circle.fill",
                    label: "LOCALISATION",
                    value: viewModel.stats?.preferences.favoriteCity ?? "Paris, Lyon...",
                    color: Theme.Colors.Searcher.primary
                )
            }
            .buttonStyle(PlainButtonStyle())

            // Budget & Availability
            HStack(spacing: 12) {
                NavigationLink(destination: SearchPreferencesView()) {
                    SearchPreferenceCompact(
                        icon: "eurosign.circle.fill",
                        label: "BUDGET",
                        value: "€800/mois",
                        color: Color(hex: "10B981")
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: SearchPreferencesView()) {
                    SearchPreferenceCompact(
                        icon: "calendar.circle.fill",
                        label: "DISPONIBILITÉ",
                        value: "Flexible",
                        color: Color(hex: "8B5CF6")
                    )
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
    }

    // MARK: - Search CTA Button

    private var searchCTAButton: some View {
        NavigationLink(destination: PropertiesListView()) {
            HStack(spacing: 12) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 18, weight: .semibold))

                Text("Rechercher")
                    .font(.system(size: 18, weight: .bold))

                Spacer()

                Image(systemName: "arrow.right")
                    .font(.system(size: 16, weight: .bold))
            }
            .foregroundColor(.white)
            .padding(18)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(LinearGradient(
                        colors: [Theme.Colors.Searcher.primary, Theme.Colors.Searcher._400],
                        startPoint: .leading,
                        endPoint: .trailing
                    ))
            )
            .richShadow(color: Theme.Colors.Searcher.primary)
        }
    }

    // MARK: - Quick Filters Row

    private var quickFiltersRow: some View {
        HStack(spacing: 12) {
            NavigationLink(destination: PropertiesListView()) {
                QuickFilterButton(
                    icon: "line.3.horizontal.decrease.circle",
                    title: "Filtres"
                )
            }
            .buttonStyle(PlainButtonStyle())

            Spacer()

            Button(action: {}) {
                HStack(spacing: 8) {
                    Image(systemName: "target")
                        .font(.system(size: 14, weight: .semibold))
                    Text("Meilleur match")
                        .font(.system(size: 14, weight: .semibold))
                    Image(systemName: "chevron.down")
                        .font(.system(size: 12, weight: .semibold))
                }
                .foregroundColor(DesignTokens.Colors.textPrimary)
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.white.opacity(0.85))
                )
                .richShadow()
            }
        }
    }

    // MARK: - Stats Grid

    private func statsGrid(stats: SearcherStats) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Activité")
                .font(.system(size: 15, weight: .bold))
                .foregroundColor(DesignTokens.Colors.textPrimary)
                .padding(.horizontal, 4)

            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 12) {
                NavigationLink(destination: FavoritesView()) {
                    RichStatCardSearcher(
                        icon: "heart.fill",
                        value: "\(stats.favoritesCount)",
                        label: "Favoris",
                        color: DesignTokens.Semantic.error
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: MatchesView()) {
                    RichStatCardSearcher(
                        icon: "sparkles",
                        value: "\(stats.topMatches)",
                        label: "Matchs",
                        color: Theme.Colors.Searcher.primary
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: MessagesListView()) {
                    RichStatCardSearcher(
                        icon: "message.fill",
                        value: "\(stats.unreadMessages)",
                        label: "Messages",
                        color: DesignTokens.UIAccent.sky
                    )
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
    }

    // MARK: - Top Matches Section

    private var topMatchesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                HStack(spacing: 8) {
                    Image(systemName: "sparkles")
                        .font(.system(size: 16))
                        .foregroundColor(Theme.Colors.Searcher.primary)
                    Text("Top Matchs")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(DesignTokens.Colors.textPrimary)
                }

                Spacer()

                NavigationLink(destination: MatchesView()) {
                    Text("Voir tout")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Theme.Colors.Searcher.primary)
                }
            }
            .padding(.horizontal, 4)

            VStack(spacing: 10) {
                ForEach(viewModel.topMatches.prefix(3)) { property in
                    NavigationLink(destination: PropertyDetailView(property: property)) {
                        TopMatchCardRich(property: property)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
        }
    }

    // MARK: - Recently Viewed Section

    private var recentlyViewedSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Récemment consultées")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(DesignTokens.Colors.textPrimary)

                Spacer()

                NavigationLink(destination: RecentlyViewedHistoryView()) {
                    Text("Historique")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Theme.Colors.Searcher.primary)
                }
            }
            .padding(.horizontal, 4)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(viewModel.recentlyViewed.prefix(5)) { property in
                        NavigationLink(destination: PropertyDetailView(property: property)) {
                            PropertyCompactCardRich(property: property)
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
            }
        }
    }
}

// MARK: - Search Preference Row

private struct SearchPreferenceRow: View {
    let icon: String
    let label: String
    let value: String
    let color: Color

    var body: some View {
        HStack(spacing: 14) {
            ZStack {
                Circle()
                    .fill(color.opacity(0.12))
                    .frame(width: 44, height: 44)

                Image(systemName: icon)
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(color)
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(label)
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(DesignTokens.Colors.textSecondary)
                    .tracking(0.5)

                Text(value)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(DesignTokens.Colors.textPrimary)
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(DesignTokens.Colors.textTertiary)
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.white.opacity(0.85))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color.white, lineWidth: 1.5)
                )
        )
        .richShadow()
    }
}

// MARK: - Search Preference Compact

private struct SearchPreferenceCompact: View {
    let icon: String
    let label: String
    let value: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                ZStack {
                    Circle()
                        .fill(color.opacity(0.12))
                        .frame(width: 36, height: 36)

                    Image(systemName: icon)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(color)
                }

                Spacer()
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(label)
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(DesignTokens.Colors.textSecondary)
                    .tracking(0.5)

                Text(value)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(DesignTokens.Colors.textPrimary)
                    .lineLimit(1)
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(Color.white.opacity(0.85))
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .stroke(Color.white, lineWidth: 1.5)
                )
        )
        .richShadow()
    }
}

// MARK: - Quick Filter Button

private struct QuickFilterButton: View {
    let icon: String
    let title: String

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: icon)
                .font(.system(size: 14, weight: .semibold))
            Text(title)
                .font(.system(size: 14, weight: .semibold))
        }
        .foregroundColor(DesignTokens.Colors.textPrimary)
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.white.opacity(0.85))
        )
        .richShadow()
    }
}

// MARK: - Rich Stat Card Searcher

private struct RichStatCardSearcher: View {
    let icon: String
    let value: String
    let label: String
    let color: Color

    var body: some View {
        VStack(spacing: 10) {
            ZStack {
                Circle()
                    .fill(color.opacity(0.12))
                    .frame(width: 44, height: 44)

                Image(systemName: icon)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(color)
            }

            Text(value)
                .font(.system(size: 22, weight: .bold))
                .foregroundColor(DesignTokens.Colors.textPrimary)

            Text(label)
                .font(.system(size: 11, weight: .medium))
                .foregroundColor(DesignTokens.Colors.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(Color.white.opacity(0.85))
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .stroke(Color.white, lineWidth: 1.5)
                )
        )
        .richShadow()
    }
}

// MARK: - Top Match Card Rich

private struct TopMatchCardRich: View {
    let property: Property

    var body: some View {
        HStack(spacing: 14) {
            // Match score badge
            VStack(spacing: 4) {
                Text("\(property.compatibilityScore ?? 85)%")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(Theme.Colors.Searcher.primary)

                Image(systemName: "sparkles")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Theme.Colors.Searcher.primary)
            }
            .frame(width: 56, height: 56)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Theme.Colors.Searcher.primary.opacity(0.12))
            )

            // Property info
            VStack(alignment: .leading, spacing: 6) {
                Text(property.title)
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(DesignTokens.Colors.textPrimary)
                    .lineLimit(1)

                HStack(spacing: 4) {
                    Image(systemName: "mappin")
                        .font(.system(size: 11))
                    Text(property.city)
                        .font(.system(size: 13, weight: .medium))
                }
                .foregroundColor(DesignTokens.Colors.textSecondary)

                Text("\(property.monthlyRent)€/mois")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(Theme.Colors.Searcher.primary)
            }

            Spacer()

            // Arrow
            Image(systemName: "chevron.right")
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(DesignTokens.Colors.textTertiary)
        }
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(Color.white.opacity(0.85))
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .stroke(Color.white, lineWidth: 1.5)
                )
        )
        .richShadow()
    }
}

// MARK: - Property Compact Card Rich

private struct PropertyCompactCardRich: View {
    let property: Property

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
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
                                    .font(.system(size: 24))
                                    .foregroundColor(.white.opacity(0.5))
                            )
                    }
                    .frame(width: 150, height: 110)
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
                        .frame(width: 150, height: 110)
                        .cornerRadius(12)
                        .overlay(
                            Image(systemName: "building.2.fill")
                                .font(.system(size: 24))
                                .foregroundColor(.white.opacity(0.5))
                        )
                }

                // Match badge
                if let score = property.compatibilityScore, score >= 80 {
                    HStack(spacing: 3) {
                        Image(systemName: "sparkles")
                            .font(.system(size: 8, weight: .bold))
                        Text("\(score)%")
                            .font(.system(size: 10, weight: .bold))
                    }
                    .foregroundColor(.white)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 4)
                    .background(Theme.Colors.Searcher.primary)
                    .cornerRadius(6)
                    .padding(8)
                }
            }

            // Property info
            VStack(alignment: .leading, spacing: 4) {
                Text(property.title)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(DesignTokens.Colors.textPrimary)
                    .lineLimit(1)

                Text(property.city)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(DesignTokens.Colors.textSecondary)

                Text("\(property.monthlyRent)€/mois")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Theme.Colors.Searcher.primary)
            }
        }
        .frame(width: 150)
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(Color.white.opacity(0.85))
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .stroke(Color.white, lineWidth: 1.5)
                )
        )
        .richShadow()
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
