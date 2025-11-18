import SwiftUI

// MARK: - Searcher Dashboard View

struct SearcherDashboardView: View {
    @StateObject private var viewModel = SearcherDashboardViewModel()
    @EnvironmentObject var languageManager: LanguageManager

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: Theme.Spacing._6) {
                    // Hero Search Section
                    heroSearchSection

                    // KPI Cards Grid
                    if viewModel.isLoading {
                        kpiCardsLoadingState
                    } else if let stats = viewModel.stats {
                        kpiCardsGrid(stats: stats)
                    }

                    // Recently Viewed Properties
                    if !viewModel.recentlyViewed.isEmpty {
                        recentlyViewedSection
                    }

                    // Top Matches
                    topMatchesSection

                    // Analytics Insights
                    if let stats = viewModel.stats {
                        analyticsInsightsSection(stats: stats)
                    }
                }
                .padding(Theme.Spacing._4)
            }
            .background(Theme.Colors.backgroundSecondary)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Explorer")
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        Task { await viewModel.refresh() }
                    }) {
                        Image(systemName: "arrow.clockwise")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Theme.SearcherColors._600)
                    }
                }
            }
        }
        .task {
            await viewModel.loadData()
        }
    }

    // MARK: - Hero Search Section

    private var heroSearchSection: some View {
        VStack(spacing: Theme.Spacing._4) {
            // Title
            VStack(alignment: .leading, spacing: Theme.Spacing._2) {
                Text("Trouve ta colocation idéale")
                    .font(Theme.Typography.title2(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Découvre des centaines de propriétés vérifiées")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            // Search Button
            NavigationLink(destination: Text("Search View")) {
                HStack(spacing: Theme.Spacing._3) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 18, weight: .semibold))

                    Text("Rechercher une colocation...")
                        .font(Theme.Typography.body())

                    Spacer()
                }
                .foregroundColor(.white)
                .padding(Theme.Spacing._4)
                .background(
                    LinearGradient(
                        colors: [
                            Theme.SearcherColors._400,
                            Theme.SearcherColors._500,
                            Theme.SearcherColors._600
                        ],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(Theme.CornerRadius.xl)
                .shadow(color: Theme.SearcherColors._400.opacity(0.3), radius: 8, x: 0, y: 4)
            }
        }
        .padding(Theme.Spacing._5)
        .background(
            LinearGradient(
                colors: [
                    Theme.SearcherColors._50,
                    Color.white
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(Theme.CornerRadius.xl)
    }

    // MARK: - KPI Cards Grid

    private func kpiCardsGrid(stats: SearcherStats) -> some View {
        LazyVGrid(
            columns: [
                GridItem(.flexible(), spacing: Theme.Spacing._4),
                GridItem(.flexible(), spacing: Theme.Spacing._4)
            ],
            spacing: Theme.Spacing._4
        ) {
            KPICard(
                metric: KPIMetric(
                    id: "messages",
                    title: "Messages non lus",
                    value: "\(stats.unreadMessages)",
                    trend: stats.unreadMessages > 0 ?
                        KPIMetric.Trend(value: "Nouveau", direction: .neutral) : nil,
                    icon: "envelope.fill",
                    color: .orange
                )
            ) {
                // Navigate to messages
            }

            KPICard(
                metric: KPIMetric(
                    id: "favorites",
                    title: "Favoris",
                    value: "\(stats.favoritesCount)",
                    trend: nil,
                    icon: "heart.fill",
                    color: .red
                )
            ) {
                // Navigate to favorites
            }

            KPICard(
                metric: KPIMetric(
                    id: "matches",
                    title: "Top Matchs",
                    value: "\(stats.topMatches)",
                    trend: stats.topMatches > 5 ?
                        KPIMetric.Trend(value: "+\(stats.topMatches - 5)", direction: .up) : nil,
                    icon: "star.fill",
                    color: .yellow
                )
            ) {
                // Navigate to matches
            }

            KPICard(
                metric: KPIMetric(
                    id: "applications",
                    title: "Demandes envoyées",
                    value: "\(stats.applicationsCount)",
                    trend: nil,
                    icon: "paperplane.fill",
                    color: .blue
                )
            ) {
                // Navigate to applications
            }
        }
    }

    private var kpiCardsLoadingState: some View {
        LazyVGrid(
            columns: [
                GridItem(.flexible(), spacing: Theme.Spacing._4),
                GridItem(.flexible(), spacing: Theme.Spacing._4)
            ],
            spacing: Theme.Spacing._4
        ) {
            ForEach(0..<4, id: \.self) { _ in
                SkeletonView(height: 140)
            }
        }
    }

    // MARK: - Recently Viewed Section

    private var recentlyViewedSection: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._4) {
            HStack {
                Text("Récemment consultées")
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                Button("Voir tout") {
                    // Navigate to full history
                }
                .font(Theme.Typography.bodySmall(.medium))
                .foregroundColor(Theme.SearcherColors._600)
            }

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: Theme.Spacing._4) {
                    ForEach(viewModel.recentlyViewed.prefix(5)) { property in
                        PropertyCompactCard(property: property)
                    }
                }
            }
        }
    }

    // MARK: - Top Matches Section

    private var topMatchesSection: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._4) {
            HStack {
                Text("Top Matchs pour vous")
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                NavigationLink("Voir tout") {
                    Text("Matches View")
                }
                .font(Theme.Typography.bodySmall(.medium))
                .foregroundColor(Theme.SearcherColors._600)
            }

            VStack(spacing: Theme.Spacing._3) {
                ForEach(0..<3, id: \.self) { index in
                    MatchCard(
                        score: 95 - (index * 5),
                        propertyTitle: "Colocation moderne Centre-Ville",
                        city: "Bruxelles",
                        price: 750 - (index * 50)
                    )
                }
            }
        }
    }

    // MARK: - Analytics Insights Section

    private func analyticsInsightsSection(stats: SearcherStats) -> some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._4) {
            Text("Vos préférences")
                .font(Theme.Typography.body(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            VStack(spacing: Theme.Spacing._3) {
                InsightRow(
                    icon: "mappin.circle.fill",
                    title: "Ville favorite",
                    value: stats.preferences.favoriteCity ?? "Non défini",
                    color: Theme.SearcherColors._500
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
                        value: stats.preferences.preferredPropertyTypes.first ?? "",
                        color: Theme.SearcherColors._400
                    )
                }
            }
        }
    }
}

// MARK: - Property Compact Card

private struct PropertyCompactCard: View {
    let property: Property

    var body: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._3) {
            // Property image
            if let imageUrl = property.mainImageURL, let url = URL(string: imageUrl) {
                AsyncImage(url: url) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Rectangle()
                        .fill(Theme.GrayColors._200)
                }
                .frame(width: 160, height: 120)
                .clipped()
                .cornerRadius(Theme.CornerRadius.lg)
            }

            // Property info
            VStack(alignment: .leading, spacing: Theme.Spacing._1) {
                Text(property.title)
                    .font(Theme.Typography.bodySmall(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .lineLimit(1)

                Text(property.city)
                    .font(Theme.Typography.caption())
                    .foregroundColor(Theme.Colors.textSecondary)

                Text("\(property.monthlyRent)€/mois")
                    .font(Theme.Typography.bodySmall(.bold))
                    .foregroundColor(Theme.SearcherColors._700)
            }
        }
        .frame(width: 160)
        .padding(Theme.Spacing._3)
        .background(Color.white)
        .cornerRadius(Theme.CornerRadius.xl)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Match Card

private struct MatchCard: View {
    let score: Int
    let propertyTitle: String
    let city: String
    let price: Int

    var body: some View {
        HStack(spacing: Theme.Spacing._4) {
            // Match score badge
            VStack(spacing: Theme.Spacing._1) {
                Text("\(score)%")
                    .font(Theme.Typography.body(.bold))
                    .foregroundColor(Theme.SearcherColors._700)

                Text("Match")
                    .font(Theme.Typography.caption())
                    .foregroundColor(Theme.Colors.textSecondary)
            }
            .frame(width: 60)
            .padding(.vertical, Theme.Spacing._3)
            .background(Theme.SearcherColors._100)
            .cornerRadius(Theme.CornerRadius.lg)

            // Property info
            VStack(alignment: .leading, spacing: Theme.Spacing._1) {
                Text(propertyTitle)
                    .font(Theme.Typography.bodySmall(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .lineLimit(1)

                Text(city)
                    .font(Theme.Typography.caption())
                    .foregroundColor(Theme.Colors.textSecondary)

                Text("\(price)€/mois")
                    .font(Theme.Typography.bodySmall(.bold))
                    .foregroundColor(Theme.SearcherColors._700)
            }

            Spacer()

            // Arrow
            Image(systemName: "chevron.right")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(Theme.Colors.textSecondary)
        }
        .padding(Theme.Spacing._4)
        .background(Color.white)
        .cornerRadius(Theme.CornerRadius.lg)
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
        HStack(spacing: Theme.Spacing._3) {
            Image(systemName: icon)
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(color)
                .frame(width: 40, height: 40)
                .background(color.opacity(0.1))
                .cornerRadius(Theme.CornerRadius.lg)

            VStack(alignment: .leading, spacing: Theme.Spacing._1) {
                Text(title)
                    .font(Theme.Typography.caption(.medium))
                    .foregroundColor(Theme.Colors.textSecondary)

                Text(value)
                    .font(Theme.Typography.bodySmall(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
            }

            Spacer()
        }
        .padding(Theme.Spacing._4)
        .background(Color.white)
        .cornerRadius(Theme.CornerRadius.lg)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - View Model

@MainActor
class SearcherDashboardViewModel: ObservableObject {
    @Published var stats: SearcherStats?
    @Published var recentlyViewed: [Property] = []
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
            recentlyViewed = try await analyticsService.getRecentlyViewedProperties(limit: 10)
        } catch let error as NetworkError {
            self.error = error
        } catch {
            self.error = .unknown
        }
    }

    func refresh() async {
        await loadData()
    }
}

// MARK: - Preview

struct SearcherDashboardView_Previews: PreviewProvider {
    static var previews: some View {
        SearcherDashboardView()
            .environmentObject(LanguageManager.shared)
    }
}
