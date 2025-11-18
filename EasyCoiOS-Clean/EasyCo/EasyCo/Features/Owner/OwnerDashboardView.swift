import SwiftUI
import Charts

// MARK: - Owner Dashboard View

struct OwnerDashboardView: View {
    @StateObject private var viewModel = OwnerDashboardViewModel()
    @EnvironmentObject var languageManager: LanguageManager

    private var dashboard: DashboardTranslations {
        languageManager.getSection(\.dashboard)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: Theme.Spacing._6) {
                    // Welcome Section
                    welcomeSection

                    // KPI Cards Grid
                    if viewModel.isLoading {
                        kpiCardsLoadingState
                    } else if let stats = viewModel.stats {
                        kpiCardsGrid(stats: stats)
                    }

                    // Charts Section
                    if let stats = viewModel.stats {
                        chartsSection(stats: stats)
                    }

                    // Recent Properties
                    if !viewModel.properties.isEmpty {
                        recentPropertiesSection
                    }

                    // Quick Actions
                    quickActionsSection
                }
                .padding(Theme.Spacing._4)
            }
            .background(Theme.Colors.backgroundSecondary)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Tableau de bord")
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        Task { await viewModel.refresh() }
                    }) {
                        Image(systemName: "arrow.clockwise")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Theme.OwnerColors._600)
                    }
                }
            }
        }
        .task {
            await viewModel.loadData()
        }
    }

    // MARK: - Welcome Section

    private var welcomeSection: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._3) {
            Text("Bonjour 👋")
                .font(Theme.Typography.title2(.bold))
                .foregroundColor(Theme.Colors.textPrimary)

            Text("Voici un résumé de vos propriétés et performances")
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(Theme.Spacing._5)
        .background(
            LinearGradient(
                colors: [
                    Theme.OwnerColors._50,
                    Color.white
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(Theme.CornerRadius.xl)
    }

    // MARK: - KPI Cards Grid

    private func kpiCardsGrid(stats: OwnerStats) -> some View {
        LazyVGrid(
            columns: [
                GridItem(.flexible(), spacing: Theme.Spacing._4),
                GridItem(.flexible(), spacing: Theme.Spacing._4)
            ],
            spacing: Theme.Spacing._4
        ) {
            KPICard(
                metric: KPIMetric(
                    id: "revenue",
                    title: "Revenu mensuel",
                    value: "€\(Int(stats.monthlyRevenue))",
                    trend: KPIMetric.Trend(value: "+12%", direction: .up),
                    icon: "eurosign.circle.fill",
                    color: .emerald
                )
            ) {
                // Navigate to finance page
            }

            KPICard(
                metric: KPIMetric(
                    id: "properties",
                    title: "Propriétés publiées",
                    value: "\(stats.publishedProperties)",
                    trend: nil,
                    icon: "building.2.fill",
                    color: .purple
                )
            ) {
                // Navigate to properties page
            }

            KPICard(
                metric: KPIMetric(
                    id: "occupation",
                    title: "Taux d'occupation",
                    value: "\(Int(stats.occupationRate))%",
                    trend: KPIMetric.Trend(value: "+5%", direction: .up),
                    icon: "chart.bar.fill",
                    color: .blue
                )
            )

            KPICard(
                metric: KPIMetric(
                    id: "applications",
                    title: "Demandes en attente",
                    value: "\(stats.pendingApplications)",
                    trend: KPIMetric.Trend(value: "Urgent", direction: .neutral),
                    icon: "person.2.fill",
                    color: .yellow
                )
            ) {
                // Navigate to applications page
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

    // MARK: - Charts Section

    private func chartsSection(stats: OwnerStats) -> some View {
        VStack(spacing: Theme.Spacing._4) {
            // Revenue & Expenses Chart
            if #available(iOS 16.0, *) {
                TrendLineChart(
                    title: "Revenu & Dépenses (12 mois)",
                    data: stats.revenueData.map { revenue in
                        ChartDataPoint(
                            id: revenue.month,
                            label: revenue.month,
                            value: revenue.revenue,
                            secondaryValue: revenue.expenses
                        )
                    },
                    showSecondary: true
                )
            } else {
                // Fallback for iOS 15
                VStack(alignment: .leading, spacing: Theme.Spacing._3) {
                    Text("Revenu & Dépenses (12 mois)")
                        .font(Theme.Typography.body(.semibold))

                    Text("Graphiques disponibles sur iOS 16+")
                        .font(Theme.Typography.caption())
                        .foregroundColor(Theme.Colors.textSecondary)
                }
                .padding()
                .background(Color.white)
                .cornerRadius(Theme.CornerRadius.xl)
            }

            // Occupation Chart
            VStack(alignment: .leading, spacing: Theme.Spacing._3) {
                Text("Occupation par propriété")
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .padding(.horizontal, Theme.Spacing._5)

                SimpleBarChart(
                    data: stats.occupationData.map { occupation in
                        ChartDataPoint(
                            id: occupation.id.uuidString,
                            label: String(occupation.propertyName.prefix(12)),
                            value: occupation.occupation,
                            secondaryValue: nil
                        )
                    },
                    color: Theme.OwnerColors._600
                )
                .padding(.horizontal, Theme.Spacing._5)
            }
            .padding(.vertical, Theme.Spacing._4)
            .background(Color.white)
            .cornerRadius(Theme.CornerRadius.xl)
            .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
        }
    }

    // MARK: - Recent Properties Section

    private var recentPropertiesSection: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._4) {
            HStack {
                Text("Vos propriétés")
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                Button("Voir tout") {
                    // Navigate to properties list
                }
                .font(Theme.Typography.bodySmall(.medium))
                .foregroundColor(Theme.OwnerColors._600)
            }

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: Theme.Spacing._4) {
                    ForEach(viewModel.properties.prefix(5)) { property in
                        PropertyCompactCard(property: property)
                    }
                }
            }
        }
    }

    // MARK: - Quick Actions Section

    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._4) {
            Text("Actions rapides")
                .font(Theme.Typography.body(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            VStack(spacing: Theme.Spacing._3) {
                QuickActionButton(
                    title: "Ajouter une propriété",
                    icon: "plus.circle.fill",
                    color: Theme.OwnerColors._600
                ) {
                    // Navigate to add property
                }

                QuickActionButton(
                    title: "Voir les demandes",
                    icon: "person.2.fill",
                    color: Theme.OwnerColors._500
                ) {
                    // Navigate to applications
                }

                QuickActionButton(
                    title: "Rapports financiers",
                    icon: "chart.line.uptrend.xyaxis",
                    color: Theme.OwnerColors._400
                ) {
                    // Navigate to finance reports
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
                    .foregroundColor(Theme.OwnerColors._700)
            }
        }
        .frame(width: 160)
        .padding(Theme.Spacing._3)
        .background(Color.white)
        .cornerRadius(Theme.CornerRadius.xl)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Quick Action Button

private struct QuickActionButton: View {
    let title: String
    let icon: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: Theme.Spacing._3) {
                Image(systemName: icon)
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(color)
                    .frame(width: 40, height: 40)
                    .background(color.opacity(0.1))
                    .cornerRadius(Theme.CornerRadius.lg)

                Text(title)
                    .font(Theme.Typography.body(.medium))
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Theme.Colors.textSecondary)
            }
            .padding(Theme.Spacing._4)
            .background(Color.white)
            .cornerRadius(Theme.CornerRadius.lg)
            .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - View Model

@MainActor
class OwnerDashboardViewModel: ObservableObject {
    @Published var stats: OwnerStats?
    @Published var properties: [Property] = []
    @Published var isLoading = false
    @Published var error: NetworkError?

    private let analyticsService = AnalyticsService.shared
    private let apiClient = APIClient.shared

    func loadData() async {
        isLoading = true
        defer { isLoading = false }

        do {
            // Load stats
            stats = try await analyticsService.getOwnerStats()

            // Load properties
            let endpoint = APIEndpoint(path: "/api/properties/owner")
            properties = try await apiClient.request(endpoint, method: .get)
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

struct OwnerDashboardView_Previews: PreviewProvider {
    static var previews: some View {
        OwnerDashboardView()
            .environmentObject(LanguageManager.shared)
    }
}
