import SwiftUI

// MARK: - Searcher Dashboard View

struct SearcherDashboardView: View {
    @StateObject private var viewModel = SearcherDashboardViewModel()
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
                    // Profile Completeness
                    profileCompletenessCard(analytics)

                    // Activity Overview
                    activityOverview(analytics)

                    // Matches & Applications
                    matchesAndApplicationsSection(analytics)

                    // Search Insights
                    searchInsightsSection(analytics)

                    // Recommendations
                    if !viewModel.recommendations.isEmpty {
                        recommendationsSection()
                    }
                }
            }
            .padding()
        }
        .background(Color(.systemGroupedBackground))
        .navigationTitle("Mon activité")
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

    // MARK: - Profile Completeness

    private func profileCompletenessCard(_ analytics: SearcherAnalytics) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Profil complété")
                        .font(.headline)
                    Text("\(Int(analytics.profileCompleteness))%")
                        .font(.title)
                        .fontWeight(.bold)
                        .foregroundColor(Theme.Colors.primary)
                }

                Spacer()

                ZStack {
                    Circle()
                        .stroke(Color.gray.opacity(0.2), lineWidth: 8)
                        .frame(width: 60, height: 60)

                    Circle()
                        .trim(from: 0, to: analytics.profileCompleteness / 100)
                        .stroke(Theme.Colors.primary, lineWidth: 8)
                        .frame(width: 60, height: 60)
                        .rotationEffect(.degrees(-90))
                }
            }

            if analytics.profileCompleteness < 100 {
                Text("Complétez votre profil pour augmenter vos chances de trouver le logement idéal")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    // MARK: - Activity Overview

    private func activityOverview(_ analytics: SearcherAnalytics) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Vue d'ensemble")
                .font(.title3)
                .fontWeight(.bold)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                ActivityCard(
                    title: "Propriétés vues",
                    value: "\(analytics.uniquePropertiesViewed)",
                    icon: "eye.fill",
                    color: .purple
                )

                ActivityCard(
                    title: "Favoris",
                    value: "\(analytics.totalFavorites)",
                    icon: "heart.fill",
                    color: .red
                )

                ActivityCard(
                    title: "Candidatures",
                    value: "\(analytics.totalApplications)",
                    icon: "doc.text.fill",
                    color: .blue
                )

                ActivityCard(
                    title: "Messages",
                    value: "\(analytics.messagesSent)",
                    icon: "message.fill",
                    color: .green
                )
            }
        }
    }

    // MARK: - Matches & Applications

    private func matchesAndApplicationsSection(_ analytics: SearcherAnalytics) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Matches & Candidatures")
                .font(.title3)
                .fontWeight(.bold)

            // Matches
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Matches")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    HStack(alignment: .firstTextBaseline, spacing: 4) {
                        Text("\(analytics.totalMatches)")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(Theme.Colors.primary)
                        if analytics.newMatchesThisPeriod > 0 {
                            Text("+\(analytics.newMatchesThisPeriod)")
                                .font(.caption)
                                .foregroundColor(.green)
                        }
                    }
                }

                Spacer()

                VStack(alignment: .leading, spacing: 4) {
                    Text("Compatibilité moy.")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    HStack(spacing: 4) {
                        Image(systemName: "star.fill")
                            .foregroundColor(.yellow)
                        Text("\(Int(analytics.averageCompatibilityScore))%")
                            .font(.title3)
                            .fontWeight(.bold)
                    }
                }
            }
            .padding()
            .background(Color(.systemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 12))

            // Applications Status
            HStack(spacing: 12) {
                ApplicationStatusPill(label: "En attente", count: analytics.pendingApplications, color: .orange)
                ApplicationStatusPill(label: "Acceptées", count: analytics.acceptedApplications, color: .green)
                ApplicationStatusPill(label: "Refusées", count: analytics.rejectedApplications, color: .red)
            }
        }
    }

    // MARK: - Search Insights

    private func searchInsightsSection(_ analytics: SearcherAnalytics) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Insights de recherche")
                .font(.title3)
                .fontWeight(.bold)

            VStack(spacing: 12) {
                InsightRow(icon: "eurosign.circle.fill", label: "Budget moyen", value: "\(Int(analytics.averageBudget))€/mois")

                if !analytics.mostSearchedCities.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Image(systemName: "mappin.circle.fill")
                                .foregroundColor(Theme.Colors.primary)
                            Text("Villes recherchées")
                                .font(.subheadline)
                        }

                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(analytics.mostSearchedCities, id: \.self) { city in
                                    Text(city)
                                        .font(.caption)
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 6)
                                        .background(Theme.Colors.primary.opacity(0.1))
                                        .foregroundColor(Theme.Colors.primary)
                                        .clipShape(RoundedRectangle(cornerRadius: 12))
                                }
                            }
                        }
                    }
                }
            }
            .padding()
            .background(Color(.systemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
    }

    // MARK: - Recommendations

    private func recommendationsSection() -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Recommandations")
                .font(.title3)
                .fontWeight(.bold)

            ForEach(viewModel.recommendations) { insight in
                InsightCard(insight: insight)
            }
        }
    }
}

// MARK: - Activity Card

struct ActivityCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)

            Text(value)
                .font(.title3)
                .fontWeight(.bold)

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

// MARK: - Application Status Pill

struct ApplicationStatusPill: View {
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

// MARK: - Insight Row

struct InsightRow: View {
    let icon: String
    let label: String
    let value: String

    var body: some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(Theme.Colors.primary)
            Text(label)
                .font(.subheadline)
            Spacer()
            Text(value)
                .font(.headline)
                .fontWeight(.semibold)
        }
    }
}

// MARK: - Preview

#Preview {
    NavigationStack {
        SearcherDashboardView()
    }
}
