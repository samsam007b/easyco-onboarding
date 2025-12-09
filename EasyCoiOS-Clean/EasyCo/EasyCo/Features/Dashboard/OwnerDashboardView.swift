//
//  OwnerDashboardView.swift
//  EasyCo
//
//  Modern Pinterest-style dashboard for property owners
//

import SwiftUI

struct OwnerDashboardView: View {
    @State private var properties: [Property] = []
    @State private var revenueData: [BarChartData] = []
    @State private var occupancyData: [DonutChartData] = []
    @State private var viewsData: [LineChartData] = []
    @State private var pendingApplications: [PropertyApplication] = []
    @State private var selectedPeriod: TimePeriod = .month
    @State private var isLoading = false

    // Sheet states
    @State private var showProfileSheet = false
    @State private var showAlertsSheet = false
    @State private var showMenuSheet = false

    private let role: Theme.UserRole = .owner

    var body: some View {
        Group {
            if isLoading {
                loadingView
            } else {
                contentView
            }
        }
        .sheet(isPresented: $showProfileSheet) {
            ProfileView()
        }
        .sheet(isPresented: $showAlertsSheet) {
            AlertsView()
        }
        .sheet(isPresented: $showMenuSheet) {
            MenuView()
        }
        .onAppear {
            loadDashboardData()
        }
    }

    // MARK: - Loading View

    private var loadingView: some View {
        ZStack {
            PinterestBackground(role: role, intensity: 0.18)
                .ignoresSafeArea()

            LoadingView(message: "Chargement du dashboard...")
        }
    }

    // MARK: - Content View

    private var contentView: some View {
        ZStack(alignment: .top) {
            // Background Pinterest avec blobs organiques mauve
            PinterestBackground(role: role, intensity: 0.18)
                .ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(spacing: Theme.PinterestSpacing.lg) {
                    // Spacer for floating header
                    Color.clear.frame(height: 70)

                    // Hero Welcome Section
                    heroWelcomeSection

                    // Period Selector
                    periodSelectorSection

                    // Stats Grid (KPIs)
                    statsGrid

                    // Revenue Chart
                    revenueChartSection

                    // Occupancy & Views Grid
                    analyticsGrid

                    // Properties Overview
                    propertiesSection

                    // Pending Applications
                    if !pendingApplications.isEmpty {
                        pendingApplicationsSection
                    }
                }
                .padding(.horizontal, Theme.PinterestSpacing.lg)
                .padding(.bottom, Theme.PinterestSpacing.xxl)
            }

            // Floating Header
            FloatingHeaderView(
                role: role,
                showAddButton: false,
                onProfileTap: { showProfileSheet = true },
                onAlertTap: { showAlertsSheet = true },
                onMenuTap: { showMenuSheet = true },
                onAddTap: nil
            )
        }
    }

    // MARK: - Hero Welcome Section

    private var heroWelcomeSection: some View {
        VStack(alignment: .leading, spacing: Theme.PinterestSpacing.xs) {
            Text("Bienvenue 👋")
                .font(Theme.PinterestTypography.heroLarge(.heavy))
                .foregroundColor(Theme.Colors.textPrimary)

            Text("Gérez vos propriétés et analysez vos performances")
                .font(Theme.PinterestTypography.bodyRegular(.medium))
                .foregroundColor(Theme.Colors.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    // MARK: - Period Selector Section

    private var periodSelectorSection: some View {
        HStack(spacing: Theme.PinterestSpacing.xs) {
            ForEach(TimePeriod.allCases, id: \.self) { period in
                Button(action: {
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                        selectedPeriod = period
                    }
                    Haptic.selection()
                }) {
                    Text(period.label)
                        .font(Theme.PinterestTypography.bodySmall(.semibold))
                        .foregroundColor(selectedPeriod == period ? .white : Theme.Colors.textSecondary)
                        .padding(.horizontal, Theme.PinterestSpacing.md)
                        .padding(.vertical, Theme.PinterestSpacing.sm)
                        .background(
                            selectedPeriod == period ?
                            LinearGradient(
                                colors: [Theme.Colors.Owner.primary, Theme.Colors.Owner._400],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ) :
                            LinearGradient(
                                colors: [Color.white.opacity(0.7), Color.white.opacity(0.5)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .cornerRadius(8)
                        .shadow(
                            color: selectedPeriod == period ? Theme.Colors.Owner.primary.opacity(0.25) : .clear,
                            radius: 8,
                            x: 0,
                            y: 4
                        )
                }
            }
        }
    }

    // MARK: - Stats Grid

    private var statsGrid: some View {
        LazyVGrid(
            columns: [
                GridItem(.flexible(), spacing: Theme.PinterestSpacing.md),
                GridItem(.flexible(), spacing: Theme.PinterestSpacing.md)
            ],
            spacing: Theme.PinterestSpacing.md
        ) {
            PinterestStatCard(
                icon: "eurosign.circle.fill",
                value: "12,450€",
                label: "Revenus",
                subtitle: "Ce mois",
                role: role
            )

            PinterestStatCard(
                icon: "building.2.fill",
                value: "8",
                label: "Propriétés",
                subtitle: "Actives",
                role: role
            )

            PinterestStatCard(
                icon: "chart.pie.fill",
                value: "94%",
                label: "Occupation",
                subtitle: "Moyenne",
                role: role
            )

            PinterestStatCard(
                icon: "doc.text.fill",
                value: "12",
                label: "Candidatures",
                subtitle: "En attente",
                role: role
            )
        }
    }

    // MARK: - Revenue Chart Section

    private var revenueChartSection: some View {
        PinterestCard(role: role) {
            VStack(alignment: .leading, spacing: Theme.PinterestSpacing.md) {
                // Header
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Revenus")
                            .font(Theme.PinterestTypography.titleMedium(.bold))
                            .foregroundColor(Theme.Colors.textPrimary)

                        Text("Évolution sur 6 mois")
                            .font(Theme.PinterestTypography.bodySmall(.medium))
                            .foregroundColor(Theme.Colors.textSecondary)
                    }

                    Spacer()

                    VStack(alignment: .trailing, spacing: 2) {
                        Text("68,500€")
                            .font(Theme.PinterestTypography.heroSmall(.bold))
                            .foregroundColor(Color(hex: "10B981"))

                        HStack(spacing: 4) {
                            Image(systemName: "arrow.up.right")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(Color(hex: "10B981"))

                            Text("+15.2%")
                                .font(Theme.PinterestTypography.bodySmall(.semibold))
                                .foregroundColor(Color(hex: "10B981"))
                        }
                    }
                }

                // Chart Placeholder
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(hex: "F3F4F6"))
                    .frame(height: 180)
                    .overlay(
                        VStack {
                            Image(systemName: "chart.bar.fill")
                                .font(.system(size: 40))
                                .foregroundColor(Color(hex: "9CA3AF"))
                            Text("Graphique des revenus")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                    )
            }
        }
    }

    // MARK: - Analytics Grid

    private var analyticsGrid: some View {
        HStack(spacing: Theme.PinterestSpacing.md) {
            // Occupancy Chart
            PinterestCard(role: role) {
                VStack(alignment: .leading, spacing: Theme.PinterestSpacing.md) {
                    Text("Taux d'occupation")
                        .font(Theme.PinterestTypography.titleSmall(.bold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    // Donut Chart Placeholder
                    ZStack {
                        Circle()
                            .stroke(Color(hex: "F3F4F6"), lineWidth: 20)
                            .frame(width: 100, height: 100)

                        Circle()
                            .trim(from: 0, to: 0.94)
                            .stroke(
                                LinearGradient(
                                    colors: [Theme.Colors.Owner.primary, Theme.Colors.Owner._400],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                ),
                                style: StrokeStyle(lineWidth: 20, lineCap: .round)
                            )
                            .frame(width: 100, height: 100)
                            .rotationEffect(.degrees(-90))

                        VStack(spacing: 2) {
                            Text("94%")
                                .font(.system(size: 24, weight: .bold))
                                .foregroundColor(Theme.Colors.textPrimary)

                            Text("Occupé")
                                .font(.system(size: 11, weight: .medium))
                                .foregroundColor(Theme.Colors.textSecondary)
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .center)
                }
            }

            // Views Trend
            PinterestCard(role: role) {
                VStack(alignment: .leading, spacing: Theme.PinterestSpacing.md) {
                    Text("Vues")
                        .font(Theme.PinterestTypography.titleSmall(.bold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text("2,345")
                        .font(Theme.PinterestTypography.heroSmall(.bold))
                        .foregroundColor(Theme.Colors.Owner.primary)

                    Text("30 derniers jours")
                        .font(Theme.PinterestTypography.bodySmall(.medium))
                        .foregroundColor(Theme.Colors.textSecondary)

                    Spacer()

                    // Mini trend chart
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Theme.Colors.Owner.primary.opacity(0.1))
                        .frame(height: 40)
                        .overlay(
                            Image(systemName: "chart.xyaxis.line")
                                .foregroundColor(Theme.Colors.Owner.primary.opacity(0.5))
                        )
                }
            }
        }
        .frame(height: 200)
    }

    // MARK: - Properties Section

    private var propertiesSection: some View {
        VStack(alignment: .leading, spacing: Theme.PinterestSpacing.md) {
            HStack {
                Text("Mes propriétés")
                    .font(Theme.PinterestTypography.titleMedium(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                NavigationLink(destination: Text("Toutes les propriétés")) {
                    HStack(spacing: 4) {
                        Text("Voir tout")
                            .font(Theme.PinterestTypography.bodySmall(.semibold))

                        Image(systemName: "chevron.right")
                            .font(.system(size: 12, weight: .semibold))
                    }
                    .foregroundColor(Theme.Colors.Owner.primary)
                }
            }

            VStack(spacing: Theme.PinterestSpacing.sm) {
                ForEach(properties.prefix(3)) { property in
                    ModernPropertyCard(property: property, role: role)
                }
            }
        }
    }

    // MARK: - Pending Applications Section

    private var pendingApplicationsSection: some View {
        VStack(alignment: .leading, spacing: Theme.PinterestSpacing.md) {
            HStack {
                Text("Candidatures en attente")
                    .font(Theme.PinterestTypography.titleMedium(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                HStack(spacing: 6) {
                    Circle()
                        .fill(Color(hex: "F59E0B"))
                        .frame(width: 8, height: 8)

                    Text("\(pendingApplications.count)")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "F59E0B"))
                }
            }

            VStack(spacing: Theme.PinterestSpacing.sm) {
                ForEach(pendingApplications.prefix(3)) { application in
                    DashboardApplicationCard(application: application, role: role)
                }
            }
        }
    }

    // MARK: - Data Loading

    private func loadDashboardData() {
        // Mock data
        properties = Array(Property.mockProperties.prefix(3))

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
                propertyTitle: "Appartement 2 chambres",
                appliedAt: Calendar.current.date(byAdding: .day, value: -3, to: Date())!,
                score: 92
            ),
            PropertyApplication(
                id: "3",
                applicantName: "Sophie Martin",
                propertyTitle: "Studio meublé - Centre",
                appliedAt: Calendar.current.date(byAdding: .day, value: -1, to: Date())!,
                score: 78
            )
        ]
    }
}

// MARK: - Modern Property Card

struct ModernPropertyCard: View {
    let property: Property
    let role: Theme.UserRole

    var body: some View {
        PinterestCard(role: role) {
            HStack(spacing: Theme.PinterestSpacing.md) {
                // Property Image
                if let imageURL = property.images.first {
                    AsyncImage(url: URL(string: imageURL)) { image in
                        image
                            .resizable()
                            .scaledToFill()
                    } placeholder: {
                        Rectangle()
                            .fill(Color(hex: "F3F4F6"))
                    }
                    .frame(width: 80, height: 80)
                    .cornerRadius(12)
                }

                // Property Info
                VStack(alignment: .leading, spacing: 6) {
                    Text(property.title)
                        .font(Theme.PinterestTypography.bodyRegular(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                        .lineLimit(1)

                    Text(property.address)
                        .font(Theme.PinterestTypography.bodySmall(.medium))
                        .foregroundColor(Theme.Colors.textSecondary)
                        .lineLimit(1)

                    HStack(spacing: Theme.PinterestSpacing.xs) {
                        HStack(spacing: 4) {
                            Image(systemName: "eye.fill")
                                .font(.system(size: 10))
                            Text("245")
                                .font(.system(size: 12, weight: .medium))
                        }
                        .foregroundColor(Color(hex: "6B7280"))

                        Circle()
                            .fill(Color(hex: "D1D5DB"))
                            .frame(width: 3, height: 3)

                        HStack(spacing: 4) {
                            Image(systemName: "doc.text.fill")
                                .font(.system(size: 10))
                            Text("8")
                                .font(.system(size: 12, weight: .medium))
                        }
                        .foregroundColor(Color(hex: "6B7280"))
                    }
                }

                Spacer()

                // Price
                VStack(alignment: .trailing, spacing: 4) {
                    Text("€\(property.price)")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text("/mois")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }
        }
    }
}

// MARK: - Dashboard Application Card

struct DashboardApplicationCard: View {
    let application: PropertyApplication
    let role: Theme.UserRole

    var body: some View {
        PinterestCard(role: role) {
            HStack(spacing: Theme.PinterestSpacing.md) {
                // Avatar
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Theme.Colors.Owner.primary, Theme.Colors.Owner._400],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 50, height: 50)
                    .overlay(
                        Text(application.applicantName.prefix(1).uppercased())
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                    )

                // Info
                VStack(alignment: .leading, spacing: 6) {
                    Text(application.applicantName)
                        .font(Theme.PinterestTypography.bodyRegular(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text(application.propertyTitle)
                        .font(Theme.PinterestTypography.bodySmall(.medium))
                        .foregroundColor(Theme.Colors.textSecondary)
                        .lineLimit(1)

                    HStack(spacing: Theme.PinterestSpacing.xs) {
                        Text(application.timeAgo)
                            .font(.system(size: 11, weight: .medium))
                            .foregroundColor(Color(hex: "9CA3AF"))

                        Circle()
                            .fill(Color(hex: "D1D5DB"))
                            .frame(width: 3, height: 3)

                        HStack(spacing: 4) {
                            Circle()
                                .fill(application.scoreColor)
                                .frame(width: 6, height: 6)

                            Text("\(application.score)%")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(application.scoreColor)
                        }
                    }
                }

                Spacer()

                // Actions
                HStack(spacing: 8) {
                    Button(action: {
                        Haptic.selection()
                    }) {
                        Image(systemName: "checkmark")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(width: 36, height: 36)
                            .background(Color(hex: "10B981"))
                            .clipShape(Circle())
                    }

                    Button(action: {
                        Haptic.selection()
                    }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(width: 36, height: 36)
                            .background(Color(hex: "EF4444"))
                            .clipShape(Circle())
                    }
                }
            }
        }
    }
}

// MARK: - Supporting Models

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
        } else if days == 1 {
            return "Hier"
        } else {
            return "Il y a \(days)j"
        }
    }

    var scoreColor: Color {
        if score >= 80 { return Color(hex: "10B981") }
        if score >= 60 { return Color(hex: "F59E0B") }
        return Color(hex: "EF4444")
    }
}

// MARK: - Preview

struct OwnerDashboardView_Previews: PreviewProvider {
    static var previews: some View {
        OwnerDashboardView()
    }
}
