//
//  OwnerDashboardView.swift
//  EasyCo
//
//  Owner Dashboard - Simplified version
//

import SwiftUI

// MARK: - Owner Dashboard View

struct OwnerDashboardView: View {
    @StateObject private var viewModel = OwnerDashboardViewModel()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Welcome Section
                    welcomeSection

                    // KPI Cards Grid
                    if viewModel.isLoading {
                        ProgressView("Chargement...")
                            .frame(height: 200)
                    } else if let stats = viewModel.stats {
                        kpiCardsGrid(stats: stats)
                    }

                    // Recent Properties
                    if !viewModel.properties.isEmpty {
                        recentPropertiesSection
                    }

                    // Quick Actions
                    quickActionsSection
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Tableau de bord")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        Task { await viewModel.refresh() }
                    }) {
                        Image(systemName: "arrow.clockwise")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "6E56CF"))
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
        VStack(alignment: .leading, spacing: 12) {
            Text("Bonjour 👋")
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            Text("Voici un résumé de vos propriétés et performances")
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(20)
        .background(
            LinearGradient(
                colors: [Color(hex: "F3F0FF"), Color.white],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(16)
    }

    // MARK: - KPI Cards Grid

    private func kpiCardsGrid(stats: OwnerStats) -> some View {
        LazyVGrid(
            columns: [
                GridItem(.flexible(), spacing: 16),
                GridItem(.flexible(), spacing: 16)
            ],
            spacing: 16
        ) {
            DashboardKPICard(
                title: "Revenu mensuel",
                value: "€\(Int(stats.monthlyRevenue))",
                icon: "eurosign.circle.fill",
                color: Color(hex: "10B981")
            )

            DashboardKPICard(
                title: "Propriétés",
                value: "\(stats.publishedProperties)",
                icon: "building.2.fill",
                color: Color(hex: "8B5CF6")
            )

            DashboardKPICard(
                title: "Taux d'occupation",
                value: "\(Int(stats.occupationRate))%",
                icon: "chart.bar.fill",
                color: Color(hex: "3B82F6")
            )

            DashboardKPICard(
                title: "Demandes",
                value: "\(stats.pendingApplications)",
                icon: "person.2.fill",
                color: Color(hex: "F59E0B")
            )
        }
    }

    // MARK: - Recent Properties Section

    private var recentPropertiesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Vos propriétés")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                Button("Voir tout") {
                    // Navigate to properties list
                }
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "6E56CF"))
            }

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(viewModel.properties.prefix(5)) { property in
                        DashboardPropertyCard(property: property)
                    }
                }
            }
        }
    }

    // MARK: - Quick Actions Section

    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Actions rapides")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            VStack(spacing: 12) {
                NavigationLink(destination: CreatePropertyView()) {
                    DashboardQuickActionRow(
                        title: "Ajouter une propriété",
                        icon: "plus.circle.fill",
                        color: Color(hex: "6E56CF")
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: ApplicationsView()) {
                    DashboardQuickActionRow(
                        title: "Voir les demandes",
                        icon: "person.2.fill",
                        color: Color(hex: "8B5CF6")
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: OwnerFinanceView()) {
                    DashboardQuickActionRow(
                        title: "Finances",
                        icon: "chart.pie.fill",
                        color: Color(hex: "10B981")
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: MaintenanceView()) {
                    DashboardQuickActionRow(
                        title: "Maintenance",
                        icon: "wrench.and.screwdriver.fill",
                        color: Color(hex: "F59E0B")
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: VisitScheduleView()) {
                    DashboardQuickActionRow(
                        title: "Calendrier des visites",
                        icon: "calendar",
                        color: Color(hex: "3B82F6")
                    )
                }
                .buttonStyle(PlainButtonStyle())

                NavigationLink(destination: ProfileEnhancementView(userRole: .owner)) {
                    DashboardQuickActionRow(
                        title: "Améliorer mon profil",
                        icon: "person.crop.circle.badge.plus",
                        color: Color(hex: "EC4899")
                    )
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
    }
}

// MARK: - Dashboard Quick Action Row

private struct DashboardQuickActionRow: View {
    let title: String
    let icon: String
    let color: Color

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: icon)
                .font(.system(size: 20))
                .foregroundColor(color)
                .frame(width: 44, height: 44)
                .background(color.opacity(0.1))
                .cornerRadius(12)

            Text(title)
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(Color(hex: "111827"))

            Spacer()

            Image(systemName: "chevron.right")
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "D1D5DB"))
        }
        .padding(14)
        .background(Color.white)
        .cornerRadius(14)
        .shadow(color: .black.opacity(0.04), radius: 6, x: 0, y: 2)
    }
}

// MARK: - Dashboard KPI Card

private struct DashboardKPICard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 24))
                    .foregroundColor(color)

                Spacer()
            }

            Text(value)
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            Text(title)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
    }
}

// MARK: - Dashboard Property Card

private struct DashboardPropertyCard: View {
    let property: Property

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Property image placeholder
            Rectangle()
                .fill(
                    LinearGradient(
                        colors: [Color(hex: "6E56CF"), Color(hex: "8B5CF6")],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: 160, height: 100)
                .cornerRadius(12)
                .overlay(
                    Image(systemName: "building.2.fill")
                        .font(.system(size: 32))
                        .foregroundColor(.white.opacity(0.5))
                )

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
                    .foregroundColor(Color(hex: "6E56CF"))
            }
        }
        .frame(width: 160)
        .padding(12)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Dashboard Quick Action Button

private struct DashboardQuickActionButton: View {
    let title: String
    let icon: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(color)
                    .frame(width: 40, height: 40)
                    .background(color.opacity(0.1))
                    .cornerRadius(10)

                Text(title)
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }
            .padding(16)
            .background(Color.white)
            .cornerRadius(12)
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

    func loadData() async {
        isLoading = true
        defer { isLoading = false }

        do {
            // Load stats
            stats = try await analyticsService.getOwnerStats()

            // Load mock properties for demo
            if AppConfig.FeatureFlags.demoMode {
                properties = Property.mockProperties
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
