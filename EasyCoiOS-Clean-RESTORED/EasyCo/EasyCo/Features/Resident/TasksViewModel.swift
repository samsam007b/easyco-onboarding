//
//  TasksViewModel.swift
//  EasyCo
//
//  ViewModel pour la gestion complète des tâches du résident
//

import SwiftUI
import Combine

// MARK: - Task Filters

enum TaskFilter: String, CaseIterable {
    case all = "Toutes"
    case todo = "À faire"
    case completed = "Complétées"
    case overdue = "En retard"
    case today = "Aujourd'hui"

    var icon: String {
        switch self {
        case .all: return "list.bullet"
        case .todo: return "circle"
        case .completed: return "checkmark.circle.fill"
        case .overdue: return "exclamationmark.triangle.fill"
        case .today: return "calendar"
        }
    }

    var color: String {
        switch self {
        case .all: return "6B7280"
        case .todo: return "3B82F6"
        case .completed: return "10B981"
        case .overdue: return "EF4444"
        case .today: return "E8865D"
        }
    }
}

// MARK: - Task Sort

enum TaskSort: String, CaseIterable {
    case dueDate = "Date d'échéance"
    case priority = "Priorité"
    case category = "Catégorie"
    case assignee = "Assigné à"
    case created = "Date de création"

    var icon: String {
        switch self {
        case .dueDate: return "calendar"
        case .priority: return "exclamationmark.circle"
        case .category: return "tag"
        case .assignee: return "person"
        case .created: return "clock"
        }
    }
}

// MARK: - Tasks ViewModel

@MainActor
class TasksViewModel: ObservableObject {

    // MARK: - Published Properties

    @Published var tasks: [ResidentTask] = []
    @Published var filteredTasks: [ResidentTask] = []
    @Published var isLoading = false
    @Published var error: String?

    // Filters & Sort
    @Published var selectedFilter: TaskFilter = .all {
        didSet {
            applyFiltersAndSort()
        }
    }

    @Published var selectedSort: TaskSort = .dueDate {
        didSet {
            applyFiltersAndSort()
        }
    }

    @Published var searchText: String = "" {
        didSet {
            applyFiltersAndSort()
        }
    }

    // UI State
    @Published var showCreateTask = false
    @Published var selectedTask: ResidentTask?

    // MARK: - Computed Properties

    var todoCount: Int {
        tasks.filter { !$0.isCompleted }.count
    }

    var completedCount: Int {
        tasks.filter { $0.isCompleted }.count
    }

    var overdueCount: Int {
        tasks.filter { $0.isOverdue }.count
    }

    var todayCount: Int {
        tasks.filter { $0.isDueToday }.count
    }

    var completionRate: Double {
        guard !tasks.isEmpty else { return 0 }
        return Double(completedCount) / Double(tasks.count)
    }

    // MARK: - Initialization

    init() {
        _Concurrency.Task {
            await loadTasks()
        }
    }

    // MARK: - Data Loading

    func loadTasks() async {
        isLoading = true
        error = nil

        // Simuler un délai réseau
        try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)

        if AppConfig.FeatureFlags.demoMode {
            tasks = ResidentTask.mockTasks
        } else {
            // TODO: Charger depuis l'API Supabase
            // let client = SupabaseManager.shared.client
            // tasks = try await client.from("tasks").select().execute().value
        }

        applyFiltersAndSort()
        isLoading = false
    }

    func refresh() async {
        await loadTasks()
    }

    // MARK: - CRUD Operations

    func createTask(_ task: ResidentTask) async {
        isLoading = true
        error = nil

        // Simuler un délai réseau
        try? await _Concurrency.Task.sleep(nanoseconds: 300_000_000)

        if AppConfig.FeatureFlags.demoMode {
            tasks.append(task)
        } else {
            // TODO: Créer via API
            // try await client.from("tasks").insert(task).execute()
        }

        applyFiltersAndSort()
        isLoading = false
    }

    func updateTask(_ task: ResidentTask) async {
        isLoading = true
        error = nil

        // Simuler un délai réseau
        try? await _Concurrency.Task.sleep(nanoseconds: 300_000_000)

        if AppConfig.FeatureFlags.demoMode {
            if let index = tasks.firstIndex(where: { $0.id == task.id }) {
                tasks[index] = task
            }
        } else {
            // TODO: Mettre à jour via API
            // try await client.from("tasks").update(task).eq("id", task.id).execute()
        }

        applyFiltersAndSort()
        isLoading = false
    }

    func deleteTask(_ taskId: UUID) async {
        isLoading = true
        error = nil

        // Simuler un délai réseau
        try? await _Concurrency.Task.sleep(nanoseconds: 300_000_000)

        if AppConfig.FeatureFlags.demoMode {
            tasks.removeAll { $0.id == taskId }
        } else {
            // TODO: Supprimer via API
            // try await client.from("tasks").delete().eq("id", taskId).execute()
        }

        applyFiltersAndSort()
        isLoading = false
    }

    // MARK: - Task Actions

    func completeTask(_ taskId: UUID, withPhoto photo: UIImage? = nil) async {
        guard let index = tasks.firstIndex(where: { $0.id == taskId }) else { return }

        var task = tasks[index]
        task.isCompleted = true
        task.completedAt = Date()

        // TODO: Upload photo si présente
        // if let photo = photo {
        //     let photoURL = await uploadPhoto(photo, for: taskId)
        //     task.proofPhotoURL = photoURL
        // }

        await updateTask(task)
    }

    func uncompleteTask(_ taskId: UUID) async {
        guard let index = tasks.firstIndex(where: { $0.id == taskId }) else { return }

        var task = tasks[index]
        task.isCompleted = false
        task.completedAt = nil

        await updateTask(task)
    }

    func toggleComplete(_ taskId: UUID) async {
        guard let task = tasks.first(where: { $0.id == taskId }) else { return }

        if task.isCompleted {
            await uncompleteTask(taskId)
        } else {
            await completeTask(taskId)
        }
    }

    // MARK: - Filtering & Sorting

    private func applyFiltersAndSort() {
        var result = tasks

        // Apply filter
        switch selectedFilter {
        case .all:
            break // Show all
        case .todo:
            result = result.filter { !$0.isCompleted }
        case .completed:
            result = result.filter { $0.isCompleted }
        case .overdue:
            result = result.filter { $0.isOverdue }
        case .today:
            result = result.filter { $0.isDueToday }
        }

        // Apply search
        if !searchText.isEmpty {
            result = result.filter { task in
                task.title.localizedCaseInsensitiveContains(searchText) ||
                task.description?.localizedCaseInsensitiveContains(searchText) ?? false ||
                task.assigneeName?.localizedCaseInsensitiveContains(searchText) ?? false
            }
        }

        // Apply sort
        switch selectedSort {
        case .dueDate:
            result.sort { task1, task2 in
                guard let date1 = task1.dueDate, let date2 = task2.dueDate else {
                    return task1.dueDate != nil
                }
                return date1 < date2
            }
        case .priority:
            result.sort { $0.priority.rawValue > $1.priority.rawValue }
        case .category:
            result.sort { $0.category.rawValue < $1.category.rawValue }
        case .assignee:
            result.sort { ($0.assigneeName ?? "") < ($1.assigneeName ?? "") }
        case .created:
            result.sort { $0.id.uuidString < $1.id.uuidString }
        }

        filteredTasks = result
    }

    // MARK: - Statistics

    func getTasksByCategory() -> [TaskCategory: Int] {
        var stats: [TaskCategory: Int] = [:]
        for task in tasks {
            stats[task.category, default: 0] += 1
        }
        return stats
    }

    func getTasksByAssignee() -> [String: Int] {
        var stats: [String: Int] = [:]
        for task in tasks {
            let assignee = task.assigneeName ?? "Non assigné"
            stats[assignee, default: 0] += 1
        }
        return stats
    }

    func getCompletionRateByAssignee() -> [String: Double] {
        var stats: [String: (completed: Int, total: Int)] = [:]

        for task in tasks {
            let assignee = task.assigneeName ?? "Non assigné"
            stats[assignee, default: (0, 0)].total += 1
            if task.isCompleted {
                stats[assignee, default: (0, 0)].completed += 1
            }
        }

        return stats.mapValues { data in
            guard data.total > 0 else { return 0 }
            return Double(data.completed) / Double(data.total)
        }
    }

    func getOverdueTasksByAssignee() -> [String: Int] {
        var stats: [String: Int] = [:]
        for task in tasks where task.isOverdue {
            let assignee = task.assigneeName ?? "Non assigné"
            stats[assignee, default: 0] += 1
        }
        return stats
    }

    // MARK: - Rotation Management

    func getRecurringTasks() -> [ResidentTask] {
        tasks.filter { $0.isRecurring }
    }

    func rotateTask(_ taskId: UUID, toNextAssignee nextAssigneeId: UUID, nextAssigneeName: String) async {
        guard let index = tasks.firstIndex(where: { $0.id == taskId }) else { return }

        var task = tasks[index]
        task.assigneeId = nextAssigneeId
        task.assigneeName = nextAssigneeName

        // Reset completion pour la nouvelle assignation
        task.isCompleted = false
        task.completedAt = nil

        // Mettre à jour la date d'échéance selon la récurrence
        if let pattern = task.recurringPattern, let currentDueDate = task.dueDate {
            let calendar = Calendar.current
            switch pattern {
            case .daily:
                task.dueDate = calendar.date(byAdding: .day, value: 1, to: currentDueDate)
            case .weekly:
                task.dueDate = calendar.date(byAdding: .weekOfYear, value: 1, to: currentDueDate)
            case .biweekly:
                task.dueDate = calendar.date(byAdding: .weekOfYear, value: 2, to: currentDueDate)
            case .monthly:
                task.dueDate = calendar.date(byAdding: .month, value: 1, to: currentDueDate)
            }
        }

        await updateTask(task)
    }
}
