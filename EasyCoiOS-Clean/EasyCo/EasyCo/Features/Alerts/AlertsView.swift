import SwiftUI

// MARK: - Alerts View

struct AlertsView: View {
    @StateObject private var alertsManager = AlertsManager.shared
    @State private var showingCreateAlert = false
    @State private var selectedFilter: AlertFilter = .all

    var body: some View {
        NavigationStack {
            ZStack {
                if alertsManager.isLoading {
                    ProgressView()
                } else if filteredAlerts.isEmpty {
                    emptyState
                } else {
                    ScrollView {
                        VStack(spacing: 16) {
                            // Filter Tabs
                            filterTabs

                            // Stats Cards
                            statsSection

                            // Alerts List
                            alertsList
                        }
                        .padding()
                    }
                }
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("Alertes")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showingCreateAlert = true }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.title3)
                            .foregroundColor(Theme.Colors.primary)
                    }
                }
            }
            .sheet(isPresented: $showingCreateAlert) {
                CreateAlertView()
            }
            .refreshable {
                await alertsManager.loadAlerts()
            }
        }
    }

    // MARK: - Filter Tabs

    private var filterTabs: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                FilterChip(
                    title: "Toutes (\(alertsManager.alerts.count))",
                    isSelected: selectedFilter == .all
                ) {
                    selectedFilter = .all
                }

                FilterChip(
                    title: "Actives (\(alertsManager.activeAlertsCount))",
                    isSelected: selectedFilter == .active
                ) {
                    selectedFilter = .active
                }

                FilterChip(
                    title: "Inactives (\(alertsManager.inactiveAlertsCount))",
                    isSelected: selectedFilter == .inactive
                ) {
                    selectedFilter = .inactive
                }

                ForEach(AlertType.allCases, id: \.self) { type in
                    let count = alertsManager.alertsByType(type).count
                    if count > 0 {
                        FilterChip(
                            title: "\(type.displayName) (\(count))",
                            isSelected: selectedFilter == .type(type)
                        ) {
                            selectedFilter = .type(type)
                        }
                    }
                }
            }
        }
    }

    // MARK: - Stats Section

    private var statsSection: some View {
        HStack(spacing: 12) {
            StatCard(
                title: "Actives",
                value: "\(alertsManager.activeAlertsCount)",
                icon: "bell.fill",
                color: .green
            )

            StatCard(
                title: "Total déclenchements",
                value: "\(totalTriggers)",
                icon: "chart.bar.fill",
                color: .blue
            )

            StatCard(
                title: "Cette semaine",
                value: "\(recentTriggers)",
                icon: "calendar",
                color: .orange
            )
        }
    }

    // MARK: - Alerts List

    private var alertsList: some View {
        LazyVStack(spacing: 12) {
            ForEach(filteredAlerts) { alert in
                AlertCard(alert: alert)
            }
        }
    }

    // MARK: - Empty State

    private var emptyState: some View {
        VStack(spacing: 20) {
            Image(systemName: "bell.slash.fill")
                .font(.system(size: 60))
                .foregroundColor(.secondary)

            Text("Aucune alerte")
                .font(.title2)
                .fontWeight(.semibold)

            Text("Créez des alertes pour être notifié des nouvelles opportunités")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)

            Button(action: { showingCreateAlert = true }) {
                Label("Créer une alerte", systemImage: "plus.circle.fill")
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
                    .background(Theme.Colors.primary)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            }
        }
        .padding(.top, 60)
    }

    // MARK: - Computed Properties

    private var filteredAlerts: [Alert] {
        switch selectedFilter {
        case .all:
            return alertsManager.alerts
        case .active:
            return alertsManager.alerts.filter { $0.isActive }
        case .inactive:
            return alertsManager.alerts.filter { !$0.isActive }
        case .type(let type):
            return alertsManager.alertsByType(type)
        }
    }

    private var totalTriggers: Int {
        alertsManager.alerts.reduce(0) { $0 + $1.triggerCount }
    }

    private var recentTriggers: Int {
        let weekAgo = Date().addingTimeInterval(-7 * 24 * 60 * 60)
        return alertsManager.alerts.filter { alert in
            guard let lastTriggered = alert.lastTriggered else { return false }
            return lastTriggered > weekAgo
        }.count
    }
}

// MARK: - Alert Filter

enum AlertFilter: Equatable {
    case all
    case active
    case inactive
    case type(AlertType)
}

// MARK: - Alert Card

struct AlertCard: View {
    let alert: Alert
    @StateObject private var alertsManager = AlertsManager.shared

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                // Icon & Type
                HStack(spacing: 8) {
                    Image(systemName: alert.type.icon)
                        .foregroundColor(Color(hex: alert.type.color))
                        .font(.title3)

                    VStack(alignment: .leading, spacing: 2) {
                        Text(alert.title)
                            .font(.headline)
                            .foregroundColor(.primary)

                        Text(alert.type.displayName)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }

                Spacer()

                // Active Toggle
                Toggle("", isOn: Binding(
                    get: { alert.isActive },
                    set: { _ in
                        Task {
                            await alertsManager.toggleAlert(alert)
                        }
                    }
                ))
                .labelsHidden()
            }

            Divider()

            // Details
            VStack(alignment: .leading, spacing: 8) {
                // Frequency
                HStack {
                    Image(systemName: "clock.fill")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text(alert.frequency.displayName)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }

                // Criteria Summary
                if let criteriaText = getCriteriaText() {
                    HStack(alignment: .top) {
                        Image(systemName: "slider.horizontal.3")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Text(criteriaText)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .lineLimit(2)
                    }
                }

                // Stats
                HStack(spacing: 16) {
                    if let lastTriggered = alert.lastTriggered {
                        Label(lastTriggered.timeAgoDisplay(), systemImage: "bell.badge.fill")
                            .font(.caption)
                            .foregroundColor(.blue)
                    }

                    if alert.triggerCount > 0 {
                        Label("\(alert.triggerCount) fois", systemImage: "chart.bar.fill")
                            .font(.caption)
                            .foregroundColor(.green)
                    }
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
    }

    private func getCriteriaText() -> String? {
        var parts: [String] = []

        if let cities = alert.criteria.cities, !cities.isEmpty {
            parts.append(cities.joined(separator: ", "))
        }

        if let minPrice = alert.criteria.minPrice, let maxPrice = alert.criteria.maxPrice {
            parts.append("\(Int(minPrice))-\(Int(maxPrice))€")
        } else if let minPrice = alert.criteria.minPrice {
            parts.append(">\(Int(minPrice))€")
        } else if let maxPrice = alert.criteria.maxPrice {
            parts.append("<\(Int(maxPrice))€")
        }

        if let minBedrooms = alert.criteria.minBedrooms {
            parts.append("\(minBedrooms)+ chambres")
        }

        return parts.isEmpty ? nil : parts.joined(separator: " • ")
    }
}

// MARK: - Stat Card

struct StatCard: View {
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
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .shadow(color: .black.opacity(0.05), radius: 3, x: 0, y: 1)
    }
}

// MARK: - Date Extension

extension Date {
    func timeAgoDisplay() -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: self, relativeTo: Date())
    }
}

// MARK: - Preview

#Preview {
    AlertsView()
}
