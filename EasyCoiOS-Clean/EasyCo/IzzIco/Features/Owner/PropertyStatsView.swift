//
//  PropertyStatsView.swift
//  IzzIco
//
//  Statistiques détaillées d'une propriété
//

import SwiftUI

struct PropertyStatsView: View {
    let property: Property
    @StateObject private var viewModel: PropertyStatsViewModel

    init(property: Property) {
        self.property = property
        self._viewModel = StateObject(wrappedValue: PropertyStatsViewModel(propertyId: property.id))
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Header avec photo
                propertyHeader

                // Statistiques principales
                mainStatsGrid

                // Graphique des vues
                viewsChart

                // Candidatures par statut
                applicationsBreakdown

                // Métriques de performance
                performanceMetrics
            }
            .padding(16)
        }
        .background(Color(hex: "F9FAFB"))
        .navigationTitle("Statistiques")
        .navigationBarTitleDisplayMode(.inline)
        .task {
            await viewModel.loadStats()
        }
    }

    // MARK: - Property Header

    private var propertyHeader: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Image
            AsyncImage(url: URL(string: property.images.first ?? "")) { phase in
                switch phase {
                case .success(let image):
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(height: 160)
                        .clipped()
                case .failure(_), .empty:
                    Rectangle()
                        .fill(Color(hex: "E5E7EB"))
                        .frame(height: 160)
                @unknown default:
                    EmptyView()
                }
            }
            .cornerRadius(12)

            // Titre et prix
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(property.title)
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))

                    Text("\(property.address), \(property.city)")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                Spacer()

                Text("€\(Int(property.monthlyRent))")
                    .font(.system(size: 22, weight: .bold))
                    .foregroundColor(Color(hex: "6E56CF"))
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }

    // MARK: - Main Stats Grid

    private var mainStatsGrid: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
            PropertyStatCard(
                icon: "eye.fill",
                value: "\(viewModel.stats.totalViews)",
                label: "Vues totales",
                color: Color(hex: "6E56CF"),
                trend: viewModel.stats.viewsTrend
            )

            PropertyStatCard(
                icon: "heart.fill",
                value: "\(viewModel.stats.totalFavorites)",
                label: "Favoris",
                color: Color(hex: "EF4444"),
                trend: viewModel.stats.favoritesTrend
            )

            PropertyStatCard(
                icon: "doc.text.fill",
                value: "\(viewModel.stats.totalApplications)",
                label: "Candidatures",
                color: Color(hex: "10B981"),
                trend: viewModel.stats.applicationsTrend
            )

            PropertyStatCard(
                icon: "chart.line.uptrend.xyaxis",
                value: "\(Int(viewModel.stats.conversionRate))%",
                label: "Taux conversion",
                color: Color(hex: "3B82F6"),
                trend: nil
            )
        }
    }

    // MARK: - Views Chart

    private var viewsChart: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Vues sur 7 jours")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                Menu {
                    Button("7 derniers jours") {
                        viewModel.selectedPeriod = .week
                    }
                    Button("30 derniers jours") {
                        viewModel.selectedPeriod = .month
                    }
                } label: {
                    HStack(spacing: 4) {
                        Text(viewModel.selectedPeriod.displayName)
                            .font(.system(size: 14))
                        Image(systemName: "chevron.down")
                            .font(.system(size: 10))
                    }
                    .foregroundColor(Color(hex: "6E56CF"))
                }
            }

            // Simple bar chart
            HStack(alignment: .bottom, spacing: 8) {
                ForEach(viewModel.stats.dailyViews, id: \.date) { dayData in
                    VStack(spacing: 4) {
                        // Bar
                        RoundedRectangle(cornerRadius: 4)
                            .fill(
                                LinearGradient(
                                    colors: [Color(hex: "6E56CF"), Color(hex: "8B5CF6")],
                                    startPoint: .top,
                                    endPoint: .bottom
                                )
                            )
                            .frame(height: barHeight(for: dayData.count))

                        // Day label
                        Text(dayLabel(for: dayData.date))
                            .font(.system(size: 10))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                    .frame(maxWidth: .infinity)
                }
            }
            .frame(height: 120)
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }

    // MARK: - Applications Breakdown

    private var applicationsBreakdown: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Candidatures par statut")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            VStack(spacing: 12) {
                ApplicationStatusRow(
                    status: "Nouvelles",
                    count: viewModel.stats.newApplications,
                    color: Color(hex: "3B82F6")
                )

                ApplicationStatusRow(
                    status: "En examen",
                    count: viewModel.stats.underReviewApplications,
                    color: Color(hex: "FBBF24")
                )

                ApplicationStatusRow(
                    status: "Acceptées",
                    count: viewModel.stats.acceptedApplications,
                    color: Color(hex: "10B981")
                )

                ApplicationStatusRow(
                    status: "Refusées",
                    count: viewModel.stats.rejectedApplications,
                    color: Color(hex: "EF4444")
                )
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }

    // MARK: - Performance Metrics

    private var performanceMetrics: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Métriques de performance")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            VStack(spacing: 12) {
                PerformanceMetricRow(
                    label: "Temps moyen avant candidature",
                    value: "\(viewModel.stats.avgTimeToApplication) jours"
                )

                PerformanceMetricRow(
                    label: "Score de visibilité",
                    value: "\(Int(viewModel.stats.visibilityScore))/100"
                )

                PerformanceMetricRow(
                    label: "Dernière vue",
                    value: viewModel.stats.lastViewedAt.timeAgo
                )

                PerformanceMetricRow(
                    label: "Dernière candidature",
                    value: viewModel.stats.lastApplicationAt?.timeAgo ?? "Aucune"
                )
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }

    // MARK: - Helpers

    private func barHeight(for count: Int) -> CGFloat {
        let maxCount = viewModel.stats.dailyViews.map(\.count).max() ?? 1
        let ratio = Double(count) / Double(maxCount)
        return CGFloat(ratio * 100)
    }

    private func dayLabel(for date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEE"
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: date).prefix(1).uppercased()
    }
}

// MARK: - Property Stat Card

struct PropertyStatCard: View {
    let icon: String
    let value: String
    let label: String
    let color: Color
    let trend: Double?

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 20))
                    .foregroundColor(color)

                Spacer()

                if let trend = trend {
                    TrendBadge(trend: trend)
                }
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(value)
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text(label)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "6B7280"))
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Trend Badge

struct TrendBadge: View {
    let trend: Double

    var body: some View {
        HStack(spacing: 2) {
            Image(systemName: trend >= 0 ? "arrow.up" : "arrow.down")
                .font(.system(size: 10, weight: .bold))
            Text("\(abs(Int(trend)))%")
                .font(.system(size: 11, weight: .semibold))
        }
        .foregroundColor(trend >= 0 ? Color(hex: "10B981") : Color(hex: "EF4444"))
        .padding(.horizontal, 6)
        .padding(.vertical, 3)
        .background((trend >= 0 ? Color(hex: "10B981") : Color(hex: "EF4444")).opacity(0.1))
        .cornerRadius(4)
    }
}

// MARK: - Application Status Row

struct ApplicationStatusRow: View {
    let status: String
    let count: Int
    let color: Color

    var body: some View {
        HStack {
            Circle()
                .fill(color)
                .frame(width: 8, height: 8)

            Text(status)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "374151"))

            Spacer()

            Text("\(count)")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))
        }
        .padding(12)
        .background(Color(hex: "F9FAFB"))
        .cornerRadius(8)
    }
}

// MARK: - Performance Metric Row

struct PerformanceMetricRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "6B7280"))

            Spacer()

            Text(value)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "111827"))
        }
    }
}

