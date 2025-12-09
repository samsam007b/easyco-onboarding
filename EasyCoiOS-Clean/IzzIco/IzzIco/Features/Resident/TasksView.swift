//
//  TasksView.swift
//  IzzIco
//
//  Vue complète des tâches - REDESIGN Pinterest Style
//  Glassmorphism, profondeur, contraste élevé
//

import SwiftUI

struct TasksView: View {
    @StateObject private var viewModel = TasksViewModel()
    @State private var showFilterMenu = false
    @State private var showSortMenu = false
    @State private var showProfileSheet = false
    @State private var showAlertsSheet = false
    @State private var showMenuSheet = false

    private let role: Theme.UserRole = .resident

    var body: some View {
        ZStack(alignment: .top) {
            // Background Pinterest avec blobs organiques
            PinterestBackground(role: role, intensity: 0.15)
                .ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(spacing: 0) {
                    // Spacer for floating header
                    Color.clear.frame(height: 70)

                    // Filters & Search Bar
                    filtersSection
                        .padding(.bottom, Theme.PinterestSpacing.md)

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
                .padding(.bottom, 100)
            }
            .refreshable {
                await viewModel.refresh()
            }

            // Floating Header
            FloatingHeaderView(
                role: role,
                showAddButton: true,
                onProfileTap: { showProfileSheet = true },
                onAlertTap: { showAlertsSheet = true },
                onMenuTap: { showMenuSheet = true },
                onAddTap: { viewModel.showCreateTask = true }
            )
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
        .pinterestFormPresentation(isPresented: $viewModel.showCreateTask) {
            CreateTaskView(viewModel: viewModel)
        }
    }

    // MARK: - Filters Section

    private var filtersSection: some View {
        VStack(spacing: Theme.PinterestSpacing.md) {
            // Search Bar - Glassmorphism
            HStack(spacing: 12) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(Theme.Colors.textTertiary)

                TextField("Rechercher une tâche...", text: $viewModel.searchText)
                    .font(Theme.PinterestTypography.bodyRegular(.regular))
                    .foregroundColor(Theme.Colors.textPrimary)

                if !viewModel.searchText.isEmpty {
                    Button(action: {
                        withAnimation(Theme.PinterestAnimations.quickSpring) {
                            viewModel.searchText = ""
                        }
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 18))
                            .foregroundColor(Theme.Colors.textTertiary)
                    }
                }
            }
            .padding(Theme.PinterestSpacing.md)
            .pinterestGlassCard(radius: Theme.PinterestRadius.medium)
            .padding(.horizontal, Theme.PinterestSpacing.lg)

            // Filter Chips - Glassmorphism
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 10) {
                    ForEach(TaskFilter.allCases, id: \.self) { filter in
                        TaskFilterChip(
                            title: filter.rawValue,
                            icon: filter.icon,
                            isSelected: viewModel.selectedFilter == filter,
                            count: getCount(for: filter),
                            role: role
                        ) {
                            withAnimation(Theme.PinterestAnimations.smoothSpring) {
                                viewModel.selectedFilter = filter
                                Haptic.selection()
                            }
                        }
                    }
                }
                .padding(.horizontal, Theme.PinterestSpacing.lg)
            }

            // Sort & Count Row
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
                    HStack(spacing: 8) {
                        Image(systemName: "arrow.up.arrow.down")
                            .font(.system(size: 13, weight: .semibold))
                        Text("Tri: \(viewModel.selectedSort.rawValue)")
                            .font(Theme.PinterestTypography.caption(.semibold))
                    }
                    .foregroundColor(role.primaryColor)
                    .padding(.horizontal, Theme.PinterestSpacing.sm)
                    .padding(.vertical, 10)
                    .background(
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.small)
                            .fill(Color.white.opacity(0.75))
                            .overlay(
                                RoundedRectangle(cornerRadius: Theme.PinterestRadius.small)
                                    .stroke(role.primaryColor.opacity(0.3), lineWidth: 1.5)
                            )
                    )
                    .pinterestShadow(Theme.PinterestShadows.subtle)
                }

                Spacer()

                // Task count - Glassmorphism badge
                HStack(spacing: 6) {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 12))
                        .foregroundColor(role.primaryColor)
                    Text("\(viewModel.filteredTasks.count)")
                        .font(Theme.PinterestTypography.caption(.bold))
                        .foregroundColor(Theme.Colors.textPrimary)
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(
                    Capsule()
                        .fill(Color.white.opacity(0.75))
                        .overlay(
                            Capsule()
                                .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                        )
                )
                .pinterestShadow(Theme.PinterestShadows.soft)
            }
            .padding(.horizontal, Theme.PinterestSpacing.lg)
        }
        .padding(.vertical, Theme.PinterestSpacing.md)
    }

    // MARK: - Tasks List

    private var tasksList: some View {
        ScrollView(showsIndicators: false) {
            LazyVStack(spacing: Theme.PinterestSpacing.md) {
                ForEach(viewModel.filteredTasks) { task in
                    PinterestTaskCard(
                        task: task,
                        role: role,
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
            .padding(Theme.PinterestSpacing.lg)
            .padding(.bottom, Theme.PinterestSpacing.xxxl)
        }
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: Theme.PinterestSpacing.xl) {
            Spacer()

            // Icon avec gradient circle
            ZStack {
                Circle()
                    .fill(role.gradient.opacity(0.15))
                    .frame(width: 140, height: 140)
                    .blur(radius: 30)

                Circle()
                    .fill(Color.white.opacity(0.75))
                    .frame(width: 120, height: 120)
                    .overlay(
                        Circle()
                            .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                    )
                    .pinterestShadow(Theme.PinterestShadows.medium)

                Image(systemName: viewModel.selectedFilter == .all ? "checklist" : "magnifyingglass")
                    .font(.system(size: 52, weight: .light))
                    .foregroundColor(role.primaryColor)
            }

            VStack(spacing: Theme.PinterestSpacing.sm) {
                Text(emptyStateTitle)
                    .font(Theme.PinterestTypography.heroMedium(.heavy))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(emptyStateMessage)
                    .font(Theme.PinterestTypography.bodyRegular(.regular))
                    .foregroundColor(Theme.Colors.textSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 40)
            }

            if viewModel.selectedFilter == .all && !viewModel.isLoading {
                PinterestPrimaryButton("Créer une tâche", role: role, icon: "plus.circle.fill") {
                    viewModel.showCreateTask = true
                }
                .padding(.horizontal, 40)
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

// MARK: - Pinterest Task Filter Chip

struct TaskFilterChip: View {
    let title: String
    let icon: String
    let isSelected: Bool
    let count: Int
    let role: Theme.UserRole
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 13, weight: .semibold))

                Text(title)
                    .font(Theme.PinterestTypography.bodySmall(isSelected ? .semibold : .medium))

                if count > 0 {
                    Text("\(count)")
                        .font(Theme.PinterestTypography.captionSmall(.bold))
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(
                            Capsule()
                                .fill(isSelected ? Color.white.opacity(0.25) : role.primaryColor.opacity(0.12))
                        )
                }
            }
            .foregroundColor(isSelected ? .white : role.primaryColor)
            .padding(.horizontal, Theme.PinterestSpacing.md)
            .padding(.vertical, 12)
            .background(
                ZStack {
                    if isSelected {
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                            .fill(role.gradient)
                            .pinterestShadow(Theme.PinterestShadows.colored(role.primaryColor, intensity: 0.35))
                    } else {
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                            .fill(Color.white.opacity(0.75))
                            .overlay(
                                RoundedRectangle(cornerRadius: Theme.PinterestRadius.large)
                                    .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                            )
                            .pinterestShadow(Theme.PinterestShadows.subtle)
                    }
                }
            )
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

// MARK: - Pinterest Task Card

struct PinterestTaskCard: View {
    let task: ResidentTask
    let role: Theme.UserRole
    let onToggleComplete: () -> Void
    let onDelete: () -> Void

    var body: some View {
        HStack(spacing: Theme.PinterestSpacing.md) {
            // Checkbox avec gradient si complété
            Button(action: {
                Haptic.light()
                onToggleComplete()
            }) {
                ZStack {
                    if task.isCompleted {
                        Circle()
                            .fill(Color(hex: "10B981"))
                            .frame(width: 32, height: 32)
                            .pinterestShadow(Theme.PinterestShadows.colored(Color(hex: "10B981"), intensity: 0.3))

                        Image(systemName: "checkmark")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                    } else {
                        Circle()
                            .stroke(role.primaryColor.opacity(0.4), lineWidth: 2.5)
                            .frame(width: 32, height: 32)
                    }
                }
            }

            // Task Info
            VStack(alignment: .leading, spacing: 8) {
                // Title
                Text(task.title)
                    .font(Theme.PinterestTypography.bodyRegular(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .strikethrough(task.isCompleted, color: Theme.Colors.textTertiary)

                // Metadata
                HStack(spacing: 10) {
                    // Assignee
                    if let assigneeName = task.assigneeName {
                        HStack(spacing: 5) {
                            Image(systemName: "person.fill")
                                .font(.system(size: 11))
                            Text(assigneeName)
                                .font(Theme.PinterestTypography.caption(.medium))
                        }
                        .foregroundColor(Theme.Colors.textSecondary)
                    }

                    // Category Badge
                    HStack(spacing: 4) {
                        Image(systemName: task.category.icon)
                            .font(.system(size: 10, weight: .semibold))
                        Text(task.category.displayName)
                            .font(Theme.PinterestTypography.captionSmall(.semibold))
                    }
                    .foregroundColor(Color(hex: task.category.color))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(
                        Capsule()
                            .fill(Color(hex: task.category.color).opacity(0.15))
                    )

                    // Due Date
                    if task.dueDate != nil {
                        HStack(spacing: 4) {
                            Image(systemName: "clock.fill")
                                .font(.system(size: 10))
                            Text(task.statusText)
                                .font(Theme.PinterestTypography.captionSmall(.medium))
                        }
                        .foregroundColor(task.isOverdue ? Color(hex: "EF4444") : Theme.Colors.textSecondary)
                    }
                }
            }

            Spacer()

            // Priority Indicator avec gradient
            if task.priority == .urgent || task.priority == .high {
                ZStack {
                    Circle()
                        .fill(Color(hex: task.priority.color).opacity(0.15))
                        .frame(width: 36, height: 36)

                    Image(systemName: "exclamationmark")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: task.priority.color))
                }
            }
        }
        .padding(Theme.PinterestSpacing.md)
        .pinterestGlassCard(radius: Theme.PinterestRadius.medium)
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

// MARK: - Shared Views
