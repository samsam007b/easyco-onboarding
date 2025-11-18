//
//  TasksView.swift
//  EasyCo
//
//  Vue complète des tâches avec filtres, tri et actions
//

import SwiftUI

struct TasksView: View {
    @StateObject private var viewModel = TasksViewModel()
    @State private var showFilterMenu = false
    @State private var showSortMenu = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Filters & Search Bar
                filtersSection

                // Content
                Group {
                    if viewModel.isLoading {
                        LoadingView(message: "Chargement des tâches...")
                    } else if viewModel.filteredTasks.isEmpty {
                        emptyStateView
                    } else {
                        tasksList
                    }
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Tâches")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        viewModel.showCreateTask = true
                    }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(Color(hex: "E8865D"))
                    }
                }
            }
            .refreshable {
                await viewModel.refresh()
            }
            .sheet(isPresented: $viewModel.showCreateTask) {
                CreateTaskView(viewModel: viewModel)
            }
        }
    }

    // MARK: - Filters Section

    private var filtersSection: some View {
        VStack(spacing: 12) {
            // Search Bar
            HStack(spacing: 12) {
                HStack(spacing: 8) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "9CA3AF"))

                    TextField("Rechercher une tâche...", text: $viewModel.searchText)
                        .font(.system(size: 15))

                    if !viewModel.searchText.isEmpty {
                        Button(action: {
                            viewModel.searchText = ""
                        }) {
                            Image(systemName: "xmark.circle.fill")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "9CA3AF"))
                        }
                    }
                }
                .padding(12)
                .background(Color.white)
                .cornerRadius(12)
                .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
            }
            .padding(.horizontal, 16)

            // Filter Chips
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(TaskFilter.allCases, id: \.self) { filter in
                        TaskFilterChip(
                            title: filter.rawValue,
                            icon: filter.icon,
                            isSelected: viewModel.selectedFilter == filter,
                            count: getCount(for: filter)
                        ) {
                            viewModel.selectedFilter = filter
                        }
                    }
                }
                .padding(.horizontal, 16)
            }

            // Sort Button
            HStack {
                Menu {
                    ForEach(TaskSort.allCases, id: \.self) { sort in
                        Button(action: {
                            viewModel.selectedSort = sort
                        }) {
                            Label(sort.rawValue, systemImage: sort.icon)
                        }
                    }
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "arrow.up.arrow.down")
                            .font(.system(size: 12))
                        Text("Tri: \(viewModel.selectedSort.rawValue)")
                            .font(.system(size: 14, weight: .medium))
                    }
                    .foregroundColor(Color(hex: "6B7280"))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(Color.white)
                    .cornerRadius(8)
                }

                Spacer()

                // Task count
                Text("\(viewModel.filteredTasks.count) tâche\(viewModel.filteredTasks.count > 1 ? "s" : "")")
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))
            }
            .padding(.horizontal, 16)
        }
        .padding(.vertical, 12)
        .background(Color(hex: "F9FAFB"))
    }

    // MARK: - Tasks List

    private var tasksList: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(viewModel.filteredTasks) { task in
                    TaskCard(
                        task: task,
                        onToggleComplete: {
                            _Concurrency.Task {
                                await viewModel.toggleComplete(task.id)
                            }
                        },
                        onDelete: {
                            _Concurrency.Task {
                                await viewModel.deleteTask(task.id)
                            }
                        }
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
                    .fill(Color(hex: "FFF4ED"))
                    .frame(width: 120, height: 120)

                Image(systemName: viewModel.selectedFilter == .all ? "checklist" : "magnifyingglass")
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "E8865D"))
            }

            VStack(spacing: 12) {
                Text(emptyStateTitle)
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text(emptyStateMessage)
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 40)
            }

            if viewModel.selectedFilter == .all && !viewModel.isLoading {
                Button(action: {
                    viewModel.showCreateTask = true
                }) {
                    HStack(spacing: 8) {
                        Image(systemName: "plus.circle.fill")
                        Text("Créer une tâche")
                    }
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
                    .background(Color(hex: "E8865D"))
                    .cornerRadius(12)
                }
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Helper Properties

    private var emptyStateTitle: String {
        if !viewModel.searchText.isEmpty {
            return "Aucun résultat"
        }
        switch viewModel.selectedFilter {
        case .all: return "Aucune tâche"
        case .todo: return "Tout est fait !"
        case .completed: return "Aucune tâche complétée"
        case .overdue: return "Aucune tâche en retard"
        case .today: return "Rien pour aujourd'hui"
        }
    }

    private var emptyStateMessage: String {
        if !viewModel.searchText.isEmpty {
            return "Aucune tâche ne correspond à votre recherche"
        }
        switch viewModel.selectedFilter {
        case .all: return "Créez des tâches pour organiser votre colocation"
        case .todo: return "Bravo ! Toutes les tâches sont complétées"
        case .completed: return "Complétez des tâches pour les voir ici"
        case .overdue: return "Excellent ! Aucune tâche en retard"
        case .today: return "Profitez de votre journée !"
        }
    }

    private func getCount(for filter: TaskFilter) -> Int {
        switch filter {
        case .all: return viewModel.tasks.count
        case .todo: return viewModel.todoCount
        case .completed: return viewModel.completedCount
        case .overdue: return viewModel.overdueCount
        case .today: return viewModel.todayCount
        }
    }
}

// MARK: - Task Filter Chip Component

struct TaskFilterChip: View {
    let title: String
    let icon: String
    let isSelected: Bool
    let count: Int
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Image(systemName: icon)
                    .font(.system(size: 12))

                Text(title)
                    .font(.system(size: 14, weight: isSelected ? .semibold : .regular))

                if count > 0 {
                    Text("\(count)")
                        .font(.system(size: 12, weight: .semibold))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(isSelected ? Color.white.opacity(0.3) : Color(hex: "E5E7EB"))
                        .cornerRadius(10)
                }
            }
            .foregroundColor(isSelected ? .white : Color(hex: "6B7280"))
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(isSelected ? Color(hex: "E8865D") : Color.white)
            .cornerRadius(20)
            .shadow(color: .black.opacity(isSelected ? 0.1 : 0.05), radius: isSelected ? 4 : 2, x: 0, y: isSelected ? 2 : 1)
        }
    }
}

// MARK: - Task Card Component

struct TaskCard: View {
    let task: ResidentTask
    let onToggleComplete: () -> Void
    let onDelete: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            // Checkbox
            Button(action: onToggleComplete) {
                Image(systemName: task.isCompleted ? "checkmark.circle.fill" : "circle")
                    .font(.system(size: 24))
                    .foregroundColor(task.isCompleted ? Color(hex: "10B981") : Color(hex: "D1D5DB"))
            }

            // Task Info
            VStack(alignment: .leading, spacing: 6) {
                // Title
                Text(task.title)
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(Color(hex: "111827"))
                    .strikethrough(task.isCompleted)

                // Assignee
                if let assigneeName = task.assigneeName {
                    HStack(spacing: 4) {
                        Image(systemName: "person.fill")
                            .font(.system(size: 10))
                        Text(assigneeName)
                            .font(.system(size: 13))
                    }
                    .foregroundColor(Color(hex: "6B7280"))
                }

                // Category & Status
                HStack(spacing: 8) {
                    // Category Badge
                    HStack(spacing: 4) {
                        Image(systemName: task.category.icon)
                            .font(.system(size: 10))
                        Text(task.category.displayName)
                            .font(.system(size: 12))
                    }
                    .foregroundColor(Color(hex: task.category.color))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color(hex: task.category.color).opacity(0.1))
                    .cornerRadius(6)

                    // Due Date
                    if task.dueDate != nil {
                        HStack(spacing: 4) {
                            Image(systemName: "clock")
                                .font(.system(size: 10))
                            Text(task.statusText)
                                .font(.system(size: 12))
                        }
                        .foregroundColor(task.isOverdue ? Color(hex: "EF4444") : Color(hex: "6B7280"))
                    }
                }
            }

            Spacer()

            // Priority Indicator
            if task.priority == .urgent || task.priority == .high {
                Image(systemName: "exclamationmark.circle.fill")
                    .font(.system(size: 20))
                    .foregroundColor(Color(hex: task.priority.color))
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        .swipeActions(edge: .trailing, allowsFullSwipe: false) {
            // Delete Action
            Button(role: .destructive, action: onDelete) {
                Label("Supprimer", systemImage: "trash")
            }

            // Edit Action
            Button(action: {
                // TODO: Navigate to edit
            }) {
                Label("Modifier", systemImage: "pencil")
            }
            .tint(Color(hex: "3B82F6"))
        }
        .swipeActions(edge: .leading, allowsFullSwipe: true) {
            // Complete Action
            Button(action: onToggleComplete) {
                Label(task.isCompleted ? "Annuler" : "Compléter", systemImage: task.isCompleted ? "arrow.uturn.backward" : "checkmark")
            }
            .tint(Color(hex: "10B981"))
        }
    }
}
