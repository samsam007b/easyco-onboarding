//
//  MaintenanceView.swift
//  EasyCo
//
//  Maintenance tasks management view for Owner
//

import SwiftUI

struct MaintenanceView: View {
    @State private var tasks: [MaintenanceTask] = []
    @State private var isLoading = false
    @State private var selectedFilter: TaskFilter = .all
    @State private var selectedProperty: UUID?
    @State private var showingCreateTask = false
    @State private var showingStats = false
    @State private var searchText = ""

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Stats summary
                if !tasks.isEmpty {
                    statsBar
                }

                // Filters
                filtersSection

                // Tasks list
                if isLoading {
                    LoadingView(message: "Chargement...")
                } else if filteredTasks.isEmpty {
                    emptyStateView
                } else {
                    tasksList
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Maintenance")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    HStack(spacing: 12) {
                        Button(action: { showingStats = true }) {
                            Image(systemName: "chart.bar.fill")
                                .foregroundColor(Color(hex: "6E56CF"))
                        }

                        Button(action: { showingCreateTask = true }) {
                            Image(systemName: "plus.circle.fill")
                                .foregroundColor(Color(hex: "6E56CF"))
                        }
                    }
                }
            }
            .sheet(isPresented: $showingCreateTask) {
                CreateMaintenanceTaskView()
            }
            .sheet(isPresented: $showingStats) {
                MaintenanceStatsSheet(tasks: tasks)
            }
        }
        .task {
            await loadTasks()
        }
    }

    // MARK: - Stats Bar

    private var statsBar: some View {
        let stats = MaintenanceStats.from(tasks: tasks)

        return ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                QuickStatCard(
                    value: "\(stats.pendingTasks)",
                    label: "À faire",
                    icon: "clock.fill",
                    color: Color(hex: "9CA3AF")
                )

                QuickStatCard(
                    value: "\(stats.inProgressTasks)",
                    label: "En cours",
                    icon: "gear",
                    color: Color(hex: "3B82F6")
                )

                QuickStatCard(
                    value: "\(stats.urgentTasks)",
                    label: "Urgent",
                    icon: "exclamationmark.triangle.fill",
                    color: Color(hex: "EF4444")
                )

                QuickStatCard(
                    value: String(format: "%.0f€", stats.monthlyAverageCost),
                    label: "Moy./mois",
                    icon: "eurosign.circle.fill",
                    color: Color(hex: "6E56CF")
                )
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .background(Color.white)
        .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
    }

    // MARK: - Filters Section

    private var filtersSection: some View {
        VStack(spacing: 12) {
            // Search
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(Color(hex: "9CA3AF"))

                TextField("Rechercher...", text: $searchText)
                    .font(.system(size: 16))

                if !searchText.isEmpty {
                    Button(action: { searchText = "" }) {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(Color(hex: "9CA3AF"))
                    }
                }
            }
            .padding(12)
            .background(Color.white)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
            )

            // Filter buttons
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(TaskFilter.allCases, id: \.self) { filter in
                        FilterButton(
                            title: filter.displayName,
                            count: countFor(filter),
                            isSelected: selectedFilter == filter,
                            action: { selectedFilter = filter }
                        )
                    }
                }
            }
        }
        .padding(16)
        .background(Color(hex: "F9FAFB"))
    }

    // MARK: - Tasks List

    private var tasksList: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(filteredTasks) { task in
                    MaintenanceTaskCard(
                        task: task,
                        onMarkComplete: { markTaskComplete(task) },
                        onDelete: { deleteTask(task) }
                    )
                }
            }
            .padding(16)
        }
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .fill(Color(hex: "F3F0FF"))
                    .frame(width: 120, height: 120)

                Image(systemName: "wrench.and.screwdriver.fill")
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "6E56CF"))
            }

            VStack(spacing: 12) {
                Text("Aucune tâche")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Créez votre première tâche de maintenance")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Button(action: { showingCreateTask = true }) {
                HStack(spacing: 8) {
                    Image(systemName: "plus.circle.fill")
                    Text("Nouvelle tâche")
                        .font(.system(size: 16, weight: .semibold))
                }
                .foregroundColor(.white)
                .padding(.horizontal, 24)
                .padding(.vertical, 14)
                .background(Color(hex: "6E56CF"))
                .cornerRadius(12)
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Filtered Tasks

    private var filteredTasks: [MaintenanceTask] {
        var result = tasks

        // Filter by status
        switch selectedFilter {
        case .all:
            break
        case .pending:
            result = result.filter { $0.status == .pending }
        case .inProgress:
            result = result.filter { $0.status == .inProgress }
        case .completed:
            result = result.filter { $0.status == .completed }
        case .urgent:
            result = result.filter { $0.priority == .urgent }
        case .overdue:
            result = result.filter { $0.isOverdue }
        }

        // Filter by property
        if let propertyId = selectedProperty {
            result = result.filter { $0.propertyId == propertyId }
        }

        // Filter by search
        if !searchText.isEmpty {
            result = result.filter { task in
                task.title.localizedCaseInsensitiveContains(searchText) ||
                task.description.localizedCaseInsensitiveContains(searchText) ||
                task.propertyTitle.localizedCaseInsensitiveContains(searchText)
            }
        }

        // Sort: urgent first, then by due date
        return result.sorted { task1, task2 in
            if task1.priority == .urgent && task2.priority != .urgent {
                return true
            }
            if task1.priority != .urgent && task2.priority == .urgent {
                return false
            }
            guard let date1 = task1.dueDate, let date2 = task2.dueDate else {
                return task1.createdAt > task2.createdAt
            }
            return date1 < date2
        }
    }

    private func countFor(_ filter: TaskFilter) -> Int {
        switch filter {
        case .all: return tasks.count
        case .pending: return tasks.filter { $0.status == .pending }.count
        case .inProgress: return tasks.filter { $0.status == .inProgress }.count
        case .completed: return tasks.filter { $0.status == .completed }.count
        case .urgent: return tasks.filter { $0.priority == .urgent }.count
        case .overdue: return tasks.filter { $0.isOverdue }.count
        }
    }

    // MARK: - Actions

    private func markTaskComplete(_ task: MaintenanceTask) {
        if let index = tasks.firstIndex(where: { $0.id == task.id }) {
            tasks[index].status = .completed
            tasks[index].completedAt = Date()
        }
    }

    private func deleteTask(_ task: MaintenanceTask) {
        tasks.removeAll { $0.id == task.id }
    }

    private func loadTasks() async {
        isLoading = true

        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
            tasks = MaintenanceTask.mockTasks
        }

        isLoading = false
    }
}

// MARK: - Task Filter

enum TaskFilter: String, CaseIterable {
    case all = "Toutes"
    case pending = "À faire"
    case inProgress = "En cours"
    case completed = "Terminées"
    case urgent = "Urgentes"
    case overdue = "En retard"

    var displayName: String {
        self.rawValue
    }
}

// MARK: - Filter Button

struct FilterButton: View {
    let title: String
    let count: Int
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Text(title)
                    .font(.system(size: 14, weight: .medium))

                Text("\(count)")
                    .font(.system(size: 12, weight: .bold))
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(isSelected ? Color.white.opacity(0.3) : Color(hex: "E5E7EB"))
                    .cornerRadius(10)
            }
            .foregroundColor(isSelected ? .white : Color(hex: "6B7280"))
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(isSelected ? Color(hex: "6E56CF") : Color(hex: "F3F4F6"))
            .cornerRadius(20)
        }
    }
}

// MARK: - Quick Stat Card

struct QuickStatCard: View {
    let value: String
    let label: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundColor(color)

            Text(value)
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            Text(label)
                .font(.system(size: 11))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(width: 90)
        .padding(.vertical, 12)
        .background(Color(hex: "F9FAFB"))
        .cornerRadius(12)
    }
}

// MARK: - Maintenance Task Card

struct MaintenanceTaskCard: View {
    let task: MaintenanceTask
    let onMarkComplete: () -> Void
    let onDelete: () -> Void

    @State private var showingActions = false

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                HStack(spacing: 8) {
                    Image(systemName: task.category.icon)
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: task.category.color))

                    Text(task.category.displayName)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(Color(hex: task.category.color))
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 4)
                .background(Color(hex: task.category.color).opacity(0.1))
                .cornerRadius(12)

                Spacer()

                HStack(spacing: 8) {
                    // Priority badge
                    Image(systemName: task.priority.icon)
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: task.priority.color))

                    // Status badge
                    HStack(spacing: 4) {
                        Image(systemName: task.status.icon)
                            .font(.system(size: 10))
                        Text(task.status.displayName)
                            .font(.system(size: 11, weight: .medium))
                    }
                    .foregroundColor(Color(hex: task.status.color))
                    .padding(.horizontal, 8)
                    .padding(.vertical: 3)
                    .background(Color(hex: task.status.color).opacity(0.1))
                    .cornerRadius(8)
                }
            }

            // Title
            Text(task.title)
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            // Property
            HStack(spacing: 6) {
                Image(systemName: "house.fill")
                    .font(.system(size: 12))
                Text(task.propertyTitle)
                    .font(.system(size: 13))
            }
            .foregroundColor(Color(hex: "6B7280"))

            // Description
            if !task.description.isEmpty {
                Text(task.description)
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "6B7280"))
                    .lineLimit(2)
            }

            Divider()

            // Footer info
            HStack {
                if let dueDate = task.dueDate {
                    HStack(spacing: 4) {
                        Image(systemName: task.isOverdue ? "exclamationmark.triangle.fill" : "calendar")
                            .font(.system(size: 11))
                        Text(dueDate.formatted(date: .abbreviated, time: .omitted))
                            .font(.system(size: 12))
                    }
                    .foregroundColor(task.isOverdue ? Color(hex: "EF4444") : Color(hex: "6B7280"))
                }

                if let contractor = task.contractorName {
                    HStack(spacing: 4) {
                        Image(systemName: "person.2.fill")
                            .font(.system(size: 11))
                        Text(contractor)
                            .font(.system(size: 12))
                    }
                    .foregroundColor(Color(hex: "6E56CF"))
                }

                Spacer()

                if let cost = task.actualCost ?? task.estimatedCost {
                    Text(String(format: "%.0f€", cost))
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Color(hex: "6E56CF"))
                }
            }

            // Quick actions
            if task.status != .completed {
                HStack(spacing: 8) {
                    Button(action: onMarkComplete) {
                        HStack(spacing: 4) {
                            Image(systemName: "checkmark.circle")
                                .font(.system(size: 12))
                            Text("Terminer")
                                .font(.system(size: 13, weight: .medium))
                        }
                        .foregroundColor(Color(hex: "10B981"))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 8)
                        .background(Color(hex: "ECFDF5"))
                        .cornerRadius(8)
                    }

                    Button(action: { showingActions = true }) {
                        HStack(spacing: 4) {
                            Image(systemName: "ellipsis")
                                .font(.system(size: 12))
                            Text("Plus")
                                .font(.system(size: 13, weight: .medium))
                        }
                        .foregroundColor(Color(hex: "6E56CF"))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 8)
                        .background(Color(hex: "F3F0FF"))
                        .cornerRadius(8)
                    }
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        .confirmationDialog("Actions", isPresented: $showingActions) {
            Button("Modifier") { }
            Button("Supprimer", role: .destructive) { onDelete() }
        }
    }
}

// MARK: - Maintenance Stats Sheet

struct MaintenanceStatsSheet: View {
    let tasks: [MaintenanceTask]
    @Environment(\.dismiss) var dismiss

    private var stats: MaintenanceStats {
        MaintenanceStats.from(tasks: tasks)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Overview cards
                    VStack(spacing: 12) {
                        StatsOverviewCard(
                            title: "Taux de complétion",
                            value: String(format: "%.0f%%", stats.completionRate),
                            color: Color(hex: "10B981")
                        )

                        HStack(spacing: 12) {
                            StatsOverviewCard(
                                title: "Coût estimé",
                                value: String(format: "%.0f€", stats.totalEstimatedCost),
                                color: Color(hex: "3B82F6")
                            )

                            StatsOverviewCard(
                                title: "Coût réel",
                                value: String(format: "%.0f€", stats.totalActualCost),
                                color: Color(hex: "6E56CF")
                            )
                        }
                    }

                    // More detailed stats would go here
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Statistiques")
                        .font(.system(size: 18, weight: .semibold))
                }

                ToolbarItem(placement: .cancellationAction) {
                    Button("Fermer") { dismiss() }
                }
            }
        }
    }
}

struct StatsOverviewCard: View {
    let title: String
    let value: String
    let color: Color

    var body: some View {
        VStack(spacing: 8) {
            Text(title)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "6B7280"))

            Text(value)
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(color)
        }
        .frame(maxWidth: .infinity)
        .padding(20)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}
