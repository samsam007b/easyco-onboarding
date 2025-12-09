//
//  TaskStatsView.swift
//  IzzIco
//
//  Statistiques et graphiques des tâches de la colocation
//

import SwiftUI
import Charts

struct TaskStatsView: View {
    @ObservedObject var viewModel: TasksViewModel
    @Environment(\.dismiss) var dismiss

    @State private var selectedPeriod: TaskStatsPeriod = .month
    @State private var selectedTab: StatsTab = .overview

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    headerSection

                    // Period selector
                    periodSelector

                    // Tab selector
                    tabSelector

                    // Content based on selected tab
                    switch selectedTab {
                    case .overview:
                        overviewSection
                    case .byPerson:
                        byPersonSection
                    case .byCategory:
                        byCategorySection
                    }

                    Spacer(minLength: 40)
                }
                .padding(20)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Fermer") {
                        dismiss()
                    }
                    .foregroundColor(Color(hex: "6B7280"))
                }
            }
        }
    }

    // MARK: - Header

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Statistiques")
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            Text("Analyse des tâches de votre colocation")
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    // MARK: - Period Selector

    private var periodSelector: some View {
        HStack(spacing: 12) {
            ForEach(TaskStatsPeriod.allCases, id: \.self) { period in
                Button(action: {
                    selectedPeriod = period
                }) {
                    Text(period.displayName)
                        .font(.system(size: 14, weight: selectedPeriod == period ? .semibold : .regular))
                        .foregroundColor(selectedPeriod == period ? .white : Color(hex: "6B7280"))
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(selectedPeriod == period ? Color(hex: "E8865D") : Color.white)
                        .cornerRadius(20)
                }
            }
        }
    }

    // MARK: - Tab Selector

    private var tabSelector: some View {
        HStack(spacing: 0) {
            ForEach(StatsTab.allCases, id: \.self) { tab in
                Button(action: {
                    selectedTab = tab
                }) {
                    VStack(spacing: 8) {
                        HStack(spacing: 6) {
                            Image(systemName: tab.icon)
                                .font(.system(size: 14))
                            Text(tab.displayName)
                                .font(.system(size: 14, weight: selectedTab == tab ? .semibold : .regular))
                        }
                        .foregroundColor(selectedTab == tab ? Color(hex: "E8865D") : Color(hex: "6B7280"))
                        .padding(.vertical, 12)
                        .frame(maxWidth: .infinity)

                        Rectangle()
                            .fill(selectedTab == tab ? Color(hex: "E8865D") : Color.clear)
                            .frame(height: 2)
                    }
                }
            }
        }
        .background(Color.white)
        .cornerRadius(12)
    }

    // MARK: - Overview Section

    private var overviewSection: some View {
        VStack(spacing: 20) {
            // Summary cards
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                TaskStatCard(
                    title: "Total",
                    value: "\(viewModel.tasks.count)",
                    icon: "list.bullet",
                    color: "3B82F6"
                )

                TaskStatCard(
                    title: "Complétées",
                    value: "\(viewModel.completedCount)",
                    subtitle: "\(Int(viewModel.completionRate * 100))%",
                    icon: "checkmark.circle.fill",
                    color: "10B981"
                )

                TaskStatCard(
                    title: "En retard",
                    value: "\(viewModel.overdueCount)",
                    icon: "exclamationmark.triangle.fill",
                    color: "EF4444"
                )

                TaskStatCard(
                    title: "Aujourd'hui",
                    value: "\(viewModel.todayCount)",
                    icon: "calendar",
                    color: "E8865D"
                )
            }

            // Completion rate chart
            completionRateChart

            // Recent activity
            recentActivitySection
        }
    }

    // MARK: - By Person Section

    private var byPersonSection: some View {
        VStack(spacing: 20) {
            // Leaderboard
            leaderboardSection

            // Completion rates by person
            completionByPersonChart
        }
    }

    // MARK: - By Category Section

    private var byCategorySection: some View {
        VStack(spacing: 20) {
            // Category distribution
            categoryDistributionChart

            // Category breakdown list
            categoryBreakdownList
        }
    }

    // MARK: - Completion Rate Chart

    private var completionRateChart: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Taux de complétion")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            ZStack {
                // Progress circle
                Circle()
                    .stroke(Color(hex: "E5E7EB"), lineWidth: 20)
                    .frame(width: 180, height: 180)

                Circle()
                    .trim(from: 0, to: viewModel.completionRate)
                    .stroke(
                        LinearGradient(
                            colors: [Color(hex: "10B981"), Color(hex: "34D399")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        style: StrokeStyle(lineWidth: 20, lineCap: .round)
                    )
                    .frame(width: 180, height: 180)
                    .rotationEffect(.degrees(-90))

                VStack(spacing: 4) {
                    Text("\(Int(viewModel.completionRate * 100))%")
                        .font(.system(size: 42, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))

                    Text("Complété")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 20)
        }
        .padding(20)
        .background(Color.white)
        .cornerRadius(16)
    }

    // MARK: - Recent Activity

    private var recentActivitySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Activité récente")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            VStack(spacing: 12) {
                ForEach(viewModel.tasks.filter { $0.isCompleted }.prefix(5)) { task in
                    HStack(spacing: 12) {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(Color(hex: "10B981"))

                        VStack(alignment: .leading, spacing: 4) {
                            Text(task.title)
                                .font(.system(size: 15, weight: .medium))
                                .foregroundColor(Color(hex: "111827"))

                            if let assignee = task.assigneeName, let completedAt = task.completedAt {
                                Text("\(assignee) · \(formatRelativeDate(completedAt))")
                                    .font(.system(size: 13))
                                    .foregroundColor(Color(hex: "6B7280"))
                            }
                        }

                        Spacer()
                    }
                    .padding(12)
                    .background(Color(hex: "F9FAFB"))
                    .cornerRadius(8)
                }
            }
        }
        .padding(20)
        .background(Color.white)
        .cornerRadius(16)
    }

    // MARK: - Leaderboard

    private var leaderboardSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Classement")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                Image(systemName: "trophy.fill")
                    .foregroundColor(Color(hex: "F59E0B"))
            }

            let completionByAssignee = viewModel.getCompletionRateByAssignee()
            let sortedAssignees = completionByAssignee.sorted { $0.value > $1.value }

            VStack(spacing: 12) {
                ForEach(Array(sortedAssignees.enumerated()), id: \.element.key) { index, item in
                    HStack(spacing: 12) {
                        // Rank badge
                        ZStack {
                            Circle()
                                .fill(rankColor(for: index))
                                .frame(width: 36, height: 36)

                            if index < 3 {
                                Image(systemName: rankIcon(for: index))
                                    .font(.system(size: 16))
                                    .foregroundColor(.white)
                            } else {
                                Text("\(index + 1)")
                                    .font(.system(size: 14, weight: .semibold))
                                    .foregroundColor(.white)
                            }
                        }

                        // Name
                        Text(item.key)
                            .font(.system(size: 15, weight: .medium))
                            .foregroundColor(Color(hex: "111827"))

                        Spacer()

                        // Completion rate
                        Text("\(Int(item.value * 100))%")
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(Color(hex: "E8865D"))
                    }
                    .padding(16)
                    .background(Color.white)
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(index < 3 ? rankColor(for: index).opacity(0.3) : Color.clear, lineWidth: 2)
                    )
                }
            }
        }
        .padding(20)
        .background(Color(hex: "F9FAFB"))
        .cornerRadius(16)
    }

    // MARK: - Completion by Person Chart

    private var completionByPersonChart: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Complétion par personne")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            let stats = viewModel.getTasksByAssignee()

            VStack(spacing: 12) {
                ForEach(stats.sorted(by: { $0.value > $1.value }), id: \.key) { assignee, count in
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text(assignee)
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(Color(hex: "111827"))

                            Spacer()

                            Text("\(count) tâches")
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "6B7280"))
                        }

                        // Progress bar
                        GeometryReader { geometry in
                            ZStack(alignment: .leading) {
                                Rectangle()
                                    .fill(Color(hex: "E5E7EB"))
                                    .frame(height: 8)
                                    .cornerRadius(4)

                                let maxCount = stats.values.max() ?? 1
                                let progress = Double(count) / Double(maxCount)

                                Rectangle()
                                    .fill(Color(hex: "E8865D"))
                                    .frame(width: geometry.size.width * progress, height: 8)
                                    .cornerRadius(4)
                            }
                        }
                        .frame(height: 8)
                    }
                }
            }
        }
        .padding(20)
        .background(Color.white)
        .cornerRadius(16)
    }

    // MARK: - Category Distribution Chart

    private var categoryDistributionChart: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Répartition par catégorie")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            let categoryStats = viewModel.getTasksByCategory()
            let total = categoryStats.values.reduce(0, +)

            VStack(spacing: 16) {
                // Donut chart representation with segments
                HStack(spacing: 4) {
                    ForEach(categoryStats.sorted(by: { $0.value > $1.value }), id: \.key) { category, count in
                        let percentage = Double(count) / Double(total)

                        Rectangle()
                            .fill(Color(hex: category.color))
                            .frame(height: 40)
                            .frame(maxWidth: .infinity)
                            .overlay(
                                Text("\(Int(percentage * 100))%")
                                    .font(.system(size: 11, weight: .semibold))
                                    .foregroundColor(.white)
                                    .opacity(percentage > 0.1 ? 1 : 0)
                            )
                    }
                }
                .cornerRadius(8)

                // Legend
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                    ForEach(categoryStats.sorted(by: { $0.value > $1.value }), id: \.key) { category, count in
                        HStack(spacing: 8) {
                            Circle()
                                .fill(Color(hex: category.color))
                                .frame(width: 12, height: 12)

                            Text(category.displayName)
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "6B7280"))

                            Spacer()

                            Text("\(count)")
                                .font(.system(size: 13, weight: .medium))
                                .foregroundColor(Color(hex: "111827"))
                        }
                    }
                }
            }
        }
        .padding(20)
        .background(Color.white)
        .cornerRadius(16)
    }

    // MARK: - Category Breakdown List

    private var categoryBreakdownList: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Détails par catégorie")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            let categoryStats = viewModel.getTasksByCategory()

            VStack(spacing: 12) {
                ForEach(categoryStats.sorted(by: { $0.value > $1.value }), id: \.key) { category, count in
                    HStack(spacing: 12) {
                        // Icon
                        ZStack {
                            Circle()
                                .fill(Color(hex: category.color).opacity(0.15))
                                .frame(width: 40, height: 40)

                            Image(systemName: category.icon)
                                .font(.system(size: 18))
                                .foregroundColor(Color(hex: category.color))
                        }

                        // Info
                        VStack(alignment: .leading, spacing: 4) {
                            Text(category.displayName)
                                .font(.system(size: 15, weight: .medium))
                                .foregroundColor(Color(hex: "111827"))

                            Text("\(count) tâche\(count > 1 ? "s" : "")")
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "6B7280"))
                        }

                        Spacer()

                        Image(systemName: "chevron.right")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "9CA3AF"))
                    }
                    .padding(12)
                    .background(Color(hex: "F9FAFB"))
                    .cornerRadius(8)
                }
            }
        }
        .padding(20)
        .background(Color.white)
        .cornerRadius(16)
    }

    // MARK: - Helper Functions

    private func rankColor(for index: Int) -> Color {
        switch index {
        case 0: return Color(hex: "F59E0B") // Gold
        case 1: return Color(hex: "9CA3AF") // Silver
        case 2: return Color(hex: "CD7F32") // Bronze
        default: return Color(hex: "6B7280")
        }
    }

    private func rankIcon(for index: Int) -> String {
        switch index {
        case 0: return "trophy.fill"
        case 1: return "medal.fill"
        case 2: return "star.fill"
        default: return ""
        }
    }

    private func formatRelativeDate(_ date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}

// MARK: - Task Stat Card

struct TaskStatCard: View {
    let title: String
    let value: String
    var subtitle: String? = nil
    let icon: String
    let color: String

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 20))
                    .foregroundColor(Color(hex: color))
                Spacer()
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(value)
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(Color(hex: color))
                }

                Text(title)
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Enums

enum TaskStatsPeriod: String, CaseIterable {
    case week = "week"
    case month = "month"
    case year = "year"

    var displayName: String {
        switch self {
        case .week: return "Semaine"
        case .month: return "Mois"
        case .year: return "Année"
        }
    }
}

enum StatsTab: String, CaseIterable {
    case overview = "overview"
    case byPerson = "by_person"
    case byCategory = "by_category"

    var displayName: String {
        switch self {
        case .overview: return "Vue d'ensemble"
        case .byPerson: return "Par personne"
        case .byCategory: return "Par catégorie"
        }
    }

    var icon: String {
        switch self {
        case .overview: return "chart.bar.fill"
        case .byPerson: return "person.2.fill"
        case .byCategory: return "tag.fill"
        }
    }
}

// MARK: - Preview

#Preview {
    TaskStatsView(viewModel: TasksViewModel())
}
