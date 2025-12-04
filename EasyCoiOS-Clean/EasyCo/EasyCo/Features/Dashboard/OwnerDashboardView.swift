//
//  OwnerDashboardView.swift
//  EasyCo
//
//  Dashboard for property owners with analytics, revenue, occupancy
//

import SwiftUI

struct OwnerDashboardView: View {
    @State private var properties: [Property] = []
    @State private var revenueData: [BarChartData] = []
    @State private var occupancyData: [DonutChartData] = []
    @State private var viewsData: [LineChartData] = []
    @State private var pendingApplications: [PropertyApplication] = []
    @State private var selectedPeriod: TimePeriod = .month

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    headerSection

                    // Period selector
                    periodSelector

                    // KPI Cards
                    kpiSection

                    // Revenue chart
                    revenueSection

                    // Occupancy donut
                    occupancySection

                    // Views trend
                    viewsTrendSection

                    // Properties overview
                    propertiesSection

                    // Pending applications
                    if !pendingApplications.isEmpty {
                        pendingApplicationsSection
                    }
                }
                .padding(.vertical, 20)
            }
            .background(Theme.Colors.backgroundSecondary)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Dashboard Propriétaire")
                        .font(Theme.Typography.title3())
                        .foregroundColor(Theme.Colors.textPrimary)
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        // Add property
                    }) {
                        Image.lucide("plus-circle")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 22, height: 22)
                            .foregroundColor(Theme.Colors.primary)
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
            Text("Bienvenue ! 👋")
                .font(Theme.Typography.title2())
                .foregroundColor(Theme.Colors.textPrimary)

            Text("Gérez vos propriétés et analysez vos performances")
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal)
    }

    // MARK: - Period Selector

    private var periodSelector: some View {
        HStack(spacing: 8) {
            ForEach(TimePeriod.allCases, id: \.self) { period in
                Button(action: {
                    withAnimation(.spring(response: 0.3)) {
                        selectedPeriod = period
                    }
                    Haptic.impact(.light)
                }) {
                    Text(period.label)
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(selectedPeriod == period ? .white : Theme.Colors.textSecondary)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(
                            selectedPeriod == period ?
                            AnyView(Theme.Colors.primaryGradient) :
                            AnyView(LinearGradient(colors: [Theme.Colors.gray100], startPoint: .leading, endPoint: .trailing))
                        )
                        .cornerRadius(8)
                }
            }
        }
        .padding(.horizontal)
    }

    // MARK: - KPI Section

    private var kpiSection: some View {
        VStack(spacing: 12) {
            HStack(spacing: 12) {
                KPICard(
                    title: "Revenus",
                    value: "12,450€",
                    subtitle: "Ce mois",
                    icon: "euro",
                    iconColor: Theme.Colors.success,
                    trend: Trend(value: 8.3, isPositive: true)
                )

                KPICard(
                    title: "Propriétés",
                    value: "8",
                    subtitle: "Actives",
                    icon: "home",
                    iconColor: Theme.Colors.primary
                )
            }

            HStack(spacing: 12) {
                KPICard(
                    title: "Taux d'occupation",
                    value: "94%",
                    subtitle: "Moyenne",
                    icon: "pie-chart",
                    iconColor: Color(hex: "10B981"),
                    trend: Trend(value: 3.2, isPositive: true)
                )

                KPICard(
                    title: "Candidatures",
                    value: "12",
                    subtitle: "En attente",
                    icon: "file-text",
                    iconColor: Color(hex: "F59E0B")
                )
            }
        }
        .padding(.horizontal)
    }

    // MARK: - Revenue Section

    private var revenueSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Revenus")
                        .font(Theme.Typography.title3())
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text("Évolution sur 6 mois")
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 2) {
                    Text("68,500€")
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(Theme.Colors.success)

                    HStack(spacing: 4) {
                        Image.lucide("trending-up")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 12, height: 12)
                            .foregroundColor(Theme.Colors.success)

                        Text("+15.2%")
                            .font(Theme.Typography.bodySmall(.semibold))
                            .foregroundColor(Theme.Colors.success)
                    }
                }
            }

            BarChart(
                data: revenueData,
                barColor: Theme.Colors.success,
                showValues: true
            )
        }
        .padding(20)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
        .padding(.horizontal)
    }

    // MARK: - Occupancy Section

    private var occupancySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Taux d'occupation")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            DonutChart(
                data: occupancyData,
                size: 140,
                lineWidth: 20,
                showLegend: true
            )
        }
        .padding(20)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
        .padding(.horizontal)
    }

    // MARK: - Views Trend Section

    private var viewsTrendSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Vues des annonces")
                        .font(Theme.Typography.title3())
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text("Derniers 30 jours")
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                Spacer()

                Text("2,345")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Theme.Colors.primary)
            }

            LineChart(
                data: viewsData,
                lineColor: Theme.Colors.primary,
                showGradient: true,
                showPoints: false
            )
        }
        .padding(20)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
        .padding(.horizontal)
    }

    // MARK: - Properties Section

    private var propertiesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Mes propriétés")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                NavigationLink(destination: Text("Toutes les propriétés")) {
                    Text("Voir tout")
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.primary)
                }
            }
            .padding(.horizontal)

            VStack(spacing: 12) {
                ForEach(properties.prefix(3)) { property in
                    OwnerPropertyCard(property: property)
                }
            }
            .padding(.horizontal)
        }
    }

    // MARK: - Pending Applications Section

    private var pendingApplicationsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Candidatures en attente")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                Text("\(pendingApplications.count)")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Theme.Colors.warning)
                    .cornerRadius(10)
            }
            .padding(.horizontal)

            VStack(spacing: 12) {
                ForEach(pendingApplications.prefix(3)) { application in
                    PropertyApplicationCard(application: application)
                }
            }
            .padding(.horizontal)
        }
    }

    // MARK: - Data Loading

    private func loadDashboardData() {
        // Revenue data (6 months)
        revenueData = [
            BarChartData(label: "Jul", value: 10200, formattedValue: "10.2k€"),
            BarChartData(label: "Aoû", value: 9800, formattedValue: "9.8k€"),
            BarChartData(label: "Sep", value: 11500, formattedValue: "11.5k€"),
            BarChartData(label: "Oct", value: 10900, formattedValue: "10.9k€"),
            BarChartData(label: "Nov", value: 13650, formattedValue: "13.7k€"),
            BarChartData(label: "Déc", value: 12450, formattedValue: "12.5k€")
        ]

        // Occupancy data
        occupancyData = [
            DonutChartData(label: "Occupé", value: 94, color: Theme.Colors.success),
            DonutChartData(label: "Vacant", value: 6, color: Theme.Colors.error)
        ]

        // Views data (30 days - simplified to 12 points)
        viewsData = [
            LineChartData(label: "1", value: 45),
            LineChartData(label: "5", value: 67),
            LineChartData(label: "8", value: 52),
            LineChartData(label: "10", value: 89),
            LineChartData(label: "13", value: 73),
            LineChartData(label: "15", value: 95),
            LineChartData(label: "18", value: 82),
            LineChartData(label: "20", value: 105),
            LineChartData(label: "23", value: 88),
            LineChartData(label: "25", value: 112),
            LineChartData(label: "28", value: 98),
            LineChartData(label: "30", value: 120)
        ]

        // Mock properties
        properties = Array(Property.mockProperties.prefix(3))

        // Mock pending applications
        pendingApplications = [
            PropertyApplication(
                id: "1",
                applicantName: "Marie Dupont",
                propertyTitle: "Studio meublé - Centre",
                appliedAt: Calendar.current.date(byAdding: .day, value: -2, to: Date())!,
                score: 85
            ),
            PropertyApplication(
                id: "2",
                applicantName: "Thomas Bernard",
                propertyTitle: "Studio meublé - Centre",
                appliedAt: Calendar.current.date(byAdding: .day, value: -3, to: Date())!,
                score: 92
            ),
            PropertyApplication(
                id: "3",
                applicantName: "Sophie Martin",
                propertyTitle: "Appartement 2 chambres - Ixelles",
                appliedAt: Calendar.current.date(byAdding: .day, value: -1, to: Date())!,
                score: 78
            )
        ]
    }
}

// MARK: - Supporting Models

enum DashboardTimePeriod: String, CaseIterable {
    case week = "7j"
    case month = "30j"
    case quarter = "3m"
    case year = "1an"

    var label: String { rawValue }
}

struct OwnerProperty: Identifiable {
    let id: String
    let title: String
    let location: String
    let price: Int
    let status: OwnerPropertyStatus
    let views: Int
    let applications: Int
    let imageURL: String
}

enum OwnerPropertyStatus {
    case occupied
    case vacant
    case maintenance

    var color: Color {
        switch self {
        case .occupied: return Theme.Colors.success
        case .vacant: return Theme.Colors.warning
        case .maintenance: return Theme.Colors.error
        }
    }

    var label: String {
        switch self {
        case .occupied: return "Occupé"
        case .vacant: return "Vacant"
        case .maintenance: return "Maintenance"
        }
    }

    var icon: String {
        switch self {
        case .occupied: return "check-circle"
        case .vacant: return "circle"
        case .maintenance: return "tool"
        }
    }
}

struct PropertyApplication: Identifiable {
    let id: String
    let applicantName: String
    let propertyTitle: String
    let appliedAt: Date
    let score: Int

    var timeAgo: String {
        let now = Date()
        let interval = now.timeIntervalSince(appliedAt)
        let days = Int(interval / 86400)
        if days == 0 {
            return "Aujourd'hui"
        } else {
            return "Il y a \(days)j"
        }
    }

    var scoreColor: Color {
        if score >= 80 { return Theme.Colors.success }
        if score >= 60 { return Theme.Colors.warning }
        return Theme.Colors.error
    }
}

// MARK: - Supporting Cards

struct PropertyApplicationCard: View {
    let application: PropertyApplication

    var body: some View {
        HStack(spacing: 16) {
            // Applicant avatar
            Circle()
                .fill(Theme.Colors.primaryGradient)
                .frame(width: 56, height: 56)
                .overlay(
                    Text(application.applicantName.prefix(1).uppercased())
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(.white)
                )

            VStack(alignment: .leading, spacing: 6) {
                Text(application.applicantName)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(application.propertyTitle)
                    .font(Theme.Typography.bodySmall())
                    .foregroundColor(Theme.Colors.textSecondary)
                    .lineLimit(1)

                HStack(spacing: 12) {
                    Text(application.timeAgo)
                        .font(Theme.Typography.caption())
                        .foregroundColor(Theme.Colors.textTertiary)

                    HStack(spacing: 4) {
                        Circle()
                            .fill(application.scoreColor)
                            .frame(width: 6, height: 6)

                        Text("\(application.score)%")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(application.scoreColor)
                    }
                }
            }

            Spacer()

            VStack(spacing: 8) {
                Button(action: {
                    Haptic.impact(.medium)
                }) {
                    Image.lucide("check")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 16, height: 16)
                        .foregroundColor(.white)
                        .frame(width: 36, height: 36)
                        .background(Theme.Colors.success)
                        .clipShape(Circle())
                }

                Button(action: {
                    Haptic.impact(.medium)
                }) {
                    Image.lucide("x")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 16, height: 16)
                        .foregroundColor(.white)
                        .frame(width: 36, height: 36)
                        .background(Theme.Colors.error)
                        .clipShape(Circle())
                }
            }
        }
        .padding(16)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }
}

// MARK: - Preview

struct OwnerDashboardView_Previews: PreviewProvider {
    static var previews: some View {
        OwnerDashboardView()
    }
}
