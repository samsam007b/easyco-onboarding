import SwiftUI

// MARK: - Owner Dashboard View

struct OwnerDashboardView: View {
    @StateObject private var viewModel = OwnerDashboardViewModel()
    @State private var selectedPeriod: AnalyticsPeriod = .month

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Period Selector
                periodSelector

                if viewModel.isLoading {
                    ProgressView()
                        .padding(.top, 60)
                } else if let analytics = viewModel.analytics {
                    // Key Metrics Cards
                    keyMetricsGrid(analytics)

                    // Financial Overview
                    financialSection(analytics)

                    // Property Performance
                    propertyPerformanceSection(analytics)

                    // Applications
                    applicationsSection(analytics)

                    // Insights
                    if !viewModel.insights.isEmpty {
                        insightsSection()
                    }
                }
            }
            .padding()
        }
        .background(Color(.systemGroupedBackground))
        .navigationTitle("Tableau de bord")
        .task {
            await viewModel.loadAnalytics(period: selectedPeriod)
        }
        .onChange(of: selectedPeriod) { newPeriod in
            Task {
                await viewModel.loadAnalytics(period: newPeriod)
            }
        }
    }

    // MARK: - Period Selector

    private var periodSelector: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(AnalyticsPeriod.allCases, id: \.self) { period in
                    Button(action: { selectedPeriod = period }) {
                        Text(period.displayName)
                            .font(.subheadline)
                            .fontWeight(selectedPeriod == period ? .semibold : .regular)
                            .foregroundColor(selectedPeriod == period ? .white : Theme.Colors.primary)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .background(selectedPeriod == period ? Theme.Colors.primary : Theme.Colors.primary.opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 20))
                    }
                }
            }
        }
    }

    // MARK: - Key Metrics

    private func keyMetricsGrid(_ analytics: OwnerAnalytics) -> some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
            MetricCard(
                title: "Revenus",
                value: "\(Int(analytics.totalRevenue))€",
                trend: analytics.revenueTrend,
                icon: "eurosign.circle.fill",
                color: .green
            )

            MetricCard(
                title: "Taux d'occupation",
                value: "\(Int(analytics.occupancyRate))%",
                icon: "chart.pie.fill",
                color: .blue
            )

            MetricCard(
                title: "Vues",
                value: "\(analytics.totalViews)",
                trend: analytics.viewsTrend,
                icon: "eye.fill",
                color: .purple
            )

            MetricCard(
                title: "Candidatures",
                value: "\(analytics.totalApplications)",
                trend: analytics.applicationsTrend,
                icon: "doc.text.fill",
                color: .orange
            )
        }
    }

    // MARK: - Financial Section

    private func financialSection(_ analytics: OwnerAnalytics) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Finances")
                .font(.title3)
                .fontWeight(.bold)

            VStack(spacing: 12) {
                FinanceRow(label: "Revenus actuels", value: analytics.totalRevenue, icon: "banknote.fill")
                FinanceRow(label: "Revenus projetés", value: analytics.projectedMonthlyRevenue, icon: "chart.line.uptrend.xyaxis")
                FinanceRow(label: "Loyer moyen/chambre", value: analytics.averageRentPerRoom, icon: "house.fill")
            }
            .padding()
            .background(Color(.systemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 16))
        }
    }

    // MARK: - Property Performance

    private func propertyPerformanceSection(_ analytics: OwnerAnalytics) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Performance des propriétés")
                .font(.title3)
                .fontWeight(.bold)

            HStack(spacing: 16) {
                PropertyStatBox(title: "Propriétés actives", value: "\(analytics.activeProperties)", total: analytics.totalProperties, color: .green)
                PropertyStatBox(title: "Chambres occupées", value: "\(analytics.occupiedRooms)", total: analytics.totalRooms, color: .blue)
            }

            if let rating = analytics.averageRating {
                HStack {
                    Image(systemName: "star.fill")
                        .foregroundColor(.yellow)
                    Text(String(format: "%.1f", rating))
                        .font(.title2)
                        .fontWeight(.bold)
                    Text("(\(analytics.totalReviews) avis)")
                        .foregroundColor(.secondary)
                    Spacer()
                }
                .padding()
                .background(Color(.systemBackground))
                .clipShape(RoundedRectangle(cornerRadius: 12))
            }
        }
    }

    // MARK: - Applications Section

    private func applicationsSection(_ analytics: OwnerAnalytics) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Candidatures")
                .font(.title3)
                .fontWeight(.bold)

            HStack(spacing: 12) {
                ApplicationStatPill(label: "En attente", count: analytics.pendingApplications, color: .orange)
                ApplicationStatPill(label: "Acceptées", count: analytics.acceptedApplications, color: .green)
                ApplicationStatPill(label: "Refusées", count: analytics.rejectedApplications, color: .red)
            }

            HStack {
                Text("Taux de conversion")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                Spacer()
                Text(String(format: "%.1f%%", analytics.conversionRate))
                    .font(.headline)
                    .foregroundColor(Theme.Colors.primary)
            }
            .padding()
            .background(Color(.systemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
    }

    // MARK: - Insights Section

    private func insightsSection() -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Recommandations")
                .font(.title3)
                .fontWeight(.bold)

            ForEach(viewModel.insights) { insight in
                InsightCard(insight: insight)
            }
        }
    }
}

// MARK: - Metric Card

struct MetricCard: View {
    let title: String
    let value: String
    var trend: Double?
    let icon: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(color)
                Spacer()
                if let trend = trend {
                    TrendBadge(trend: trend)
                }
            }

            Text(value)
                .font(.title2)
                .fontWeight(.bold)

            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
    }
}

// MARK: - Finance Row

struct FinanceRow: View {
    let label: String
    let value: Double
    let icon: String

    var body: some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(Theme.Colors.primary)
                .frame(width: 24)
            Text(label)
                .font(.subheadline)
            Spacer()
            Text("\(Int(value))€")
                .font(.headline)
                .fontWeight(.semibold)
        }
    }
}

// MARK: - Property Stat Box

struct PropertyStatBox: View {
    let title: String
    let value: String
    let total: Int
    let color: Color

    var body: some View {
        VStack(spacing: 8) {
            Text(value)
                .font(.title)
                .fontWeight(.bold)
                .foregroundColor(color)
            Text("sur \(total)")
                .font(.caption)
                .foregroundColor(.secondary)
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

// MARK: - Application Stat Pill

struct ApplicationStatPill: View {
    let label: String
    let count: Int
    let color: Color

    var body: some View {
        VStack(spacing: 4) {
            Text("\(count)")
                .font(.headline)
                .fontWeight(.bold)
                .foregroundColor(color)
            Text(label)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .background(color.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}

// MARK: - Insight Card

struct InsightCard: View {
    let insight: AnalyticsInsight

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: insight.icon)
                .font(.title3)
                .foregroundColor(colorForPriority(insight.priority))

            VStack(alignment: .leading, spacing: 4) {
                Text(insight.title)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                Text(insight.message)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()
        }
        .padding()
        .background(colorForPriority(insight.priority).opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    private func colorForPriority(_ priority: AnalyticsInsight.InsightPriority) -> Color {
        switch priority {
        case .low: return .blue
        case .medium: return .orange
        case .high: return .red
        }
    }
}

// MARK: - Preview

#Preview {
    NavigationStack {
        OwnerDashboardView()
    }
}
