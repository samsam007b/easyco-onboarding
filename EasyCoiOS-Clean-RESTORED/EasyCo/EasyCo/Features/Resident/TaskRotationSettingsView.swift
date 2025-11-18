//
//  TaskRotationSettingsView.swift
//  EasyCo
//
//  Configuration de la rotation automatique des tâches entre colocataires
//

import SwiftUI

struct TaskRotationSettingsView: View {
    @ObservedObject var viewModel: TasksViewModel
    @Environment(\.dismiss) var dismiss

    // Selected task for configuration
    @State private var selectedTask: ResidentTask?
    @State private var showTaskSelector = false

    // Rotation configuration
    @State private var rotationOrder: [Roommate] = []
    @State private var isRotationEnabled = false

    // Mock roommates (TODO: fetch from household)
    private let mockRoommates = [
        Roommate(id: UUID(), name: "Marie", avatar: "👩🏻"),
        Roommate(id: UUID(), name: "Thomas", avatar: "👨🏼"),
        Roommate(id: UUID(), name: "Sophie", avatar: "👩🏽"),
        Roommate(id: UUID(), name: "Marc", avatar: "👨🏻")
    ]

    var recurringTasks: [ResidentTask] {
        viewModel.getRecurringTasks()
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    headerSection

                    // Task selector
                    taskSelectorSection

                    // Configuration (shown if task selected)
                    if let task = selectedTask {
                        rotationConfigSection(for: task)
                        rotatationOrderSection
                        upcomingRotationsSection(for: task)
                    }

                    // Empty state
                    if recurringTasks.isEmpty {
                        emptyStateSection
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

                ToolbarItem(placement: .navigationBarTrailing) {
                    if selectedTask != nil {
                        Button(action: saveRotationSettings) {
                            Text("Sauvegarder")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 16)
                                .padding(.vertical, 8)
                                .background(Color(hex: "E8865D"))
                                .cornerRadius(10)
                        }
                    }
                }
            }
        }
        .onAppear {
            loadInitialData()
        }
    }

    // MARK: - Header Section

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Rotation des Tâches")
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            Text("Configurez la rotation automatique des tâches récurrentes entre colocataires")
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    // MARK: - Task Selector Section

    private var taskSelectorSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Tâche récurrente")
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "374151"))

            if recurringTasks.isEmpty {
                Text("Aucune tâche récurrente disponible")
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "9CA3AF"))
                    .padding(16)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color.white)
                    .cornerRadius(12)
            } else {
                Menu {
                    ForEach(recurringTasks) { task in
                        Button(action: {
                            selectedTask = task
                            loadRotationConfig(for: task)
                        }) {
                            HStack {
                                Image(systemName: task.category.icon)
                                Text(task.title)
                            }
                        }
                    }
                } label: {
                    HStack {
                        if let task = selectedTask {
                            Image(systemName: task.category.icon)
                                .foregroundColor(Color(hex: task.category.color))
                            Text(task.title)
                                .foregroundColor(Color(hex: "111827"))
                        } else {
                            Text("Sélectionner une tâche")
                                .foregroundColor(Color(hex: "9CA3AF"))
                        }
                        Spacer()
                        Image(systemName: "chevron.down")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "9CA3AF"))
                    }
                    .padding(16)
                    .background(Color.white)
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                    )
                }
            }
        }
    }

    // MARK: - Rotation Config Section

    private func rotationConfigSection(for task: ResidentTask) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            // Toggle rotation
            Toggle(isOn: $isRotationEnabled) {
                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 8) {
                        Image(systemName: isRotationEnabled ? "checkmark.circle.fill" : "circle")
                            .foregroundColor(isRotationEnabled ? Color(hex: "E8865D") : Color(hex: "9CA3AF"))
                        Text("Rotation activée")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "111827"))
                    }
                    Text("La tâche sera automatiquement assignée au prochain colocataire selon l'ordre défini")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }
            .toggleStyle(SwitchToggleStyle(tint: Color(hex: "E8865D")))
            .padding(16)
            .background(Color.white)
            .cornerRadius(12)

            // Task info card
            VStack(alignment: .leading, spacing: 12) {
                HStack(spacing: 8) {
                    Image(systemName: "info.circle.fill")
                        .foregroundColor(Color(hex: "3B82F6"))
                    Text("Informations de la tâche")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                VStack(alignment: .leading, spacing: 8) {
                    InfoRow(label: "Fréquence", value: task.recurringPattern?.displayName ?? "Non définie")

                    if let days = task.recurringDays, !days.isEmpty {
                        InfoRow(label: "Jours", value: days.map { $0.shortName }.joined(separator: ", "))
                    }

                    if let assignee = task.assigneeName {
                        InfoRow(label: "Assigné actuel", value: assignee)
                    }
                }
            }
            .padding(16)
            .background(Color(hex: "EFF6FF"))
            .cornerRadius(12)
        }
    }

    // MARK: - Rotation Order Section

    private var rotatationOrderSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Ordre de rotation")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))

                Spacer()

                Text("\(rotationOrder.count) colocataires")
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            VStack(spacing: 8) {
                ForEach(Array(rotationOrder.enumerated()), id: \.element.id) { index, roommate in
                    HStack(spacing: 12) {
                        // Position number
                        ZStack {
                            Circle()
                                .fill(index == 0 ? Color(hex: "E8865D") : Color(hex: "E5E7EB"))
                                .frame(width: 32, height: 32)

                            Text("\(index + 1)")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(index == 0 ? .white : Color(hex: "6B7280"))
                        }

                        // Avatar
                        Text(roommate.avatar)
                            .font(.system(size: 28))

                        // Name
                        VStack(alignment: .leading, spacing: 2) {
                            Text(roommate.name)
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(Color(hex: "111827"))

                            if index == 0 {
                                Text("Assigné actuel")
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "E8865D"))
                            } else if index == 1 {
                                Text("Prochain")
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "6B7280"))
                            }
                        }

                        Spacer()

                        // Drag handle
                        Image(systemName: "line.3.horizontal")
                            .foregroundColor(Color(hex: "9CA3AF"))
                    }
                    .padding(16)
                    .background(Color.white)
                    .cornerRadius(12)
                    .shadow(color: .black.opacity(0.05), radius: 2, x: 0, y: 1)
                }
                .onMove { from, to in
                    rotationOrder.move(fromOffsets: from, toOffset: to)
                }
            }

            // Add roommate button
            if rotationOrder.count < mockRoommates.count {
                Button(action: {
                    addRoommateToRotation()
                }) {
                    HStack {
                        Image(systemName: "plus.circle.fill")
                            .foregroundColor(Color(hex: "E8865D"))
                        Text("Ajouter un colocataire")
                            .font(.system(size: 15, weight: .medium))
                            .foregroundColor(Color(hex: "E8865D"))
                    }
                    .padding(16)
                    .frame(maxWidth: .infinity)
                    .background(Color.white)
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color(hex: "E8865D"), style: StrokeStyle(lineWidth: 1, dash: [5]))
                    )
                }
            }
        }
    }

    // MARK: - Upcoming Rotations Section

    private func upcomingRotationsSection(for task: ResidentTask) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Prochaines assignations")
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "374151"))

            VStack(spacing: 8) {
                ForEach(0..<min(4, rotationOrder.count), id: \.self) { index in
                    let roommate = rotationOrder[index % rotationOrder.count]
                    let futureDate = calculateNextRotationDate(for: task, iteration: index)

                    HStack(spacing: 12) {
                        // Avatar
                        Text(roommate.avatar)
                            .font(.system(size: 24))

                        // Info
                        VStack(alignment: .leading, spacing: 2) {
                            Text(roommate.name)
                                .font(.system(size: 15, weight: .medium))
                                .foregroundColor(Color(hex: "111827"))

                            Text(formatDate(futureDate))
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "6B7280"))
                        }

                        Spacer()

                        if index == 0 {
                            Text("Maintenant")
                                .font(.system(size: 12, weight: .medium))
                                .foregroundColor(Color(hex: "E8865D"))
                                .padding(.horizontal, 10)
                                .padding(.vertical, 4)
                                .background(Color(hex: "FFF4ED"))
                                .cornerRadius(12)
                        }
                    }
                    .padding(12)
                    .background(Color.white)
                    .cornerRadius(8)
                }
            }
            .padding(16)
            .background(Color(hex: "F9FAFB"))
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
            )
        }
    }

    // MARK: - Empty State

    private var emptyStateSection: some View {
        VStack(spacing: 24) {
            ZStack {
                Circle()
                    .fill(Color(hex: "FFF4ED"))
                    .frame(width: 100, height: 100)

                Image(systemName: "arrow.triangle.2.circlepath")
                    .font(.system(size: 40))
                    .foregroundColor(Color(hex: "E8865D"))
            }

            VStack(spacing: 12) {
                Text("Aucune tâche récurrente")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Créez une tâche récurrente pour configurer la rotation automatique")
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 20)
            }

            Button(action: {
                dismiss()
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
        .frame(maxWidth: .infinity)
        .padding(.vertical, 40)
    }

    // MARK: - Helper Views

    struct InfoRow: View {
        let label: String
        let value: String

        var body: some View {
            HStack {
                Text(label)
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "6B7280"))
                Spacer()
                Text(value)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "111827"))
            }
        }
    }

    // MARK: - Actions

    private func loadInitialData() {
        rotationOrder = mockRoommates

        // Select first recurring task if available
        if let firstTask = recurringTasks.first {
            selectedTask = firstTask
            loadRotationConfig(for: firstTask)
        }
    }

    private func loadRotationConfig(for task: ResidentTask) {
        // TODO: Load rotation config from backend
        // For now, use mock data
        isRotationEnabled = true

        // Set current assignee as first in rotation
        if let assigneeName = task.assigneeName {
            if let currentIndex = rotationOrder.firstIndex(where: { $0.name == assigneeName }) {
                let current = rotationOrder.remove(at: currentIndex)
                rotationOrder.insert(current, at: 0)
            }
        }
    }

    private func addRoommateToRotation() {
        // Find roommates not yet in rotation
        let availableRoommates = mockRoommates.filter { roommate in
            !rotationOrder.contains(where: { $0.id == roommate.id })
        }

        if let nextRoommate = availableRoommates.first {
            rotationOrder.append(nextRoommate)
        }
    }

    private func saveRotationSettings() {
        guard let task = selectedTask else { return }

        // TODO: Save rotation configuration to backend
        // For now, just show success and dismiss

        _Concurrency.Task {
            // Simulate API call
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)

            // Update task with rotation
            // await viewModel.updateTaskRotation(task.id, order: rotationOrder, enabled: isRotationEnabled)

            dismiss()
        }
    }

    private func calculateNextRotationDate(for task: ResidentTask, iteration: Int) -> Date {
        guard let pattern = task.recurringPattern, let dueDate = task.dueDate else {
            return Date()
        }

        let calendar = Calendar.current
        var nextDate = dueDate

        for _ in 0..<iteration {
            switch pattern {
            case .daily:
                nextDate = calendar.date(byAdding: .day, value: 1, to: nextDate) ?? nextDate
            case .weekly:
                nextDate = calendar.date(byAdding: .weekOfYear, value: 1, to: nextDate) ?? nextDate
            case .biweekly:
                nextDate = calendar.date(byAdding: .weekOfYear, value: 2, to: nextDate) ?? nextDate
            case .monthly:
                nextDate = calendar.date(byAdding: .month, value: 1, to: nextDate) ?? nextDate
            }
        }

        return nextDate
    }

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "d MMM yyyy"
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: date)
    }
}

// MARK: - Roommate Model

struct Roommate: Identifiable, Hashable {
    let id: UUID
    let name: String
    let avatar: String
}

// MARK: - Preview

#Preview {
    TaskRotationSettingsView(viewModel: TasksViewModel())
}
