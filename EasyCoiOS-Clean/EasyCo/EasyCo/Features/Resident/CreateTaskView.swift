//
//  CreateTaskView.swift
//  EasyCo
//
//  Formulaire moderne de création de tâche - Pinterest Style
//  Nouveau système de présentation smooth et design
//

import SwiftUI

struct CreateTaskView: View {
    @ObservedObject var viewModel: TasksViewModel
    @Environment(\.dismiss) var dismiss

    private let role: Theme.UserRole = .resident

    // Form state
    @State private var title = ""
    @State private var description = ""
    @State private var selectedCategory: TaskCategory = .cleaning
    @State private var selectedPriority: TaskPriority = .normal
    @State private var assigneeName = ""
    @State private var assigneeId: UUID? = nil
    @State private var dueDate = Date()
    @State private var hasDueDate = false
    @State private var isRecurring = false

    // Validation
    @State private var showValidationError = false
    @State private var validationMessage = ""

    // Mock roommates (TODO: fetch from household)
    private let mockRoommates = [
        (id: UUID(), name: "Marie"),
        (id: UUID(), name: "Thomas"),
        (id: UUID(), name: "Sophie"),
        (id: UUID(), name: "Marc")
    ]

    var body: some View {
        PinterestFormContainer(
            title: "Nouvelle tâche",
            role: role,
            isPresented: .constant(true),
            onSave: createTask
        ) {
            VStack(spacing: Theme.PinterestSpacing.xl) {
                // Title Field
                PinterestFormTextField(
                    placeholder: "Titre",
                    text: $title,
                    icon: "text.alignleft",
                    role: role,
                    isRequired: true
                )

                // Description Field
                PinterestFormTextEditor(
                    placeholder: "Description",
                    text: $description,
                    role: role
                )

                // Category Picker Grid
                PinterestFormPickerGrid(
                    title: "Catégorie",
                    items: TaskCategory.allCases,
                    selectedItem: $selectedCategory,
                    icon: { $0.icon },
                    label: { $0.displayName },
                    color: { Color(hex: $0.color) },
                    role: role,
                    isRequired: true
                )

                // Priority Picker Grid
                PinterestFormPickerGrid(
                    title: "Priorité",
                    items: TaskPriority.allCases,
                    selectedItem: $selectedPriority,
                    icon: { getPriorityIcon($0) },
                    label: { $0.displayName },
                    color: { Color(hex: $0.color) },
                    role: role,
                    isRequired: true,
                    columns: 4
                )

                // Assignee Picker
                PinterestFormSection("Assigné à") {
                    Menu {
                        ForEach(mockRoommates, id: \.id) { roommate in
                            Button(action: {
                                assigneeId = roommate.id
                                assigneeName = roommate.name
                            }) {
                                Label(roommate.name, systemImage: "person.fill")
                            }
                        }
                    } label: {
                        HStack(spacing: 12) {
                            ZStack {
                                Circle()
                                    .fill(role.primaryColor.opacity(0.15))
                                    .frame(width: 40, height: 40)

                                Image(systemName: "person.fill")
                                    .font(.system(size: 18, weight: .medium))
                                    .foregroundColor(role.primaryColor)
                            }

                            Text(assigneeName.isEmpty ? "Sélectionner un colocataire" : assigneeName)
                                .font(Theme.PinterestTypography.bodyRegular(.regular))
                                .foregroundColor(assigneeName.isEmpty ? Theme.Colors.textTertiary : Theme.Colors.textPrimary)

                            Spacer()

                            Image(systemName: "chevron.down")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(Theme.Colors.textTertiary)
                        }
                        .padding(Theme.PinterestSpacing.md)
                        .background(
                            RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                                .fill(Color.white)
                                .overlay(
                                    RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                                        .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                                )
                        )
                        .pinterestShadow(Theme.PinterestShadows.subtle)
                    }
                }

                // Due Date Toggle
                PinterestFormToggle(
                    "Ajouter une date d'échéance",
                    isOn: $hasDueDate,
                    role: role
                )

                // Due Date Picker
                if hasDueDate {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Date d'échéance")
                            .font(Theme.PinterestTypography.bodySmall(.semibold))
                            .foregroundColor(Theme.Colors.textPrimary)

                        DatePicker("", selection: $dueDate, in: Date()..., displayedComponents: [.date, .hourAndMinute])
                            .datePickerStyle(.compact)
                            .labelsHidden()
                            .padding(Theme.PinterestSpacing.md)
                            .background(
                                RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                                    .fill(Color.white)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                                            .stroke(Color.white.opacity(0.6), lineWidth: 1.5)
                                    )
                            )
                            .pinterestShadow(Theme.PinterestShadows.subtle)
                    }
                }

                // Recurring Task Toggle
                PinterestFormToggle(
                    "Tâche récurrente",
                    isOn: $isRecurring,
                    role: role
                )

                // Validation Error
                if showValidationError {
                    HStack(spacing: 12) {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .font(.system(size: 18))
                            .foregroundColor(Color(hex: "EF4444"))
                        Text(validationMessage)
                            .font(Theme.PinterestTypography.bodySmall(.medium))
                            .foregroundColor(Color(hex: "EF4444"))
                    }
                    .padding(Theme.PinterestSpacing.md)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(
                        RoundedRectangle(cornerRadius: Theme.PinterestRadius.medium)
                            .fill(Color(hex: "FEF2F2"))
                    )
                }
            }
        }
    }

    // MARK: - Actions

    private func createTask() {
        // Validation
        guard validateForm() else { return }

        // Create task
        let newTask = ResidentTask(
            householdId: UUID(), // TODO: Get from current household
            title: title,
            description: description.isEmpty ? nil : description,
            assigneeId: assigneeId,
            assigneeName: assigneeName,
            category: selectedCategory,
            priority: selectedPriority,
            dueDate: hasDueDate ? dueDate : nil,
            isCompleted: false,
            isRecurring: isRecurring,
            recurringPattern: nil,
            recurringDays: nil,
            createdById: UUID() // TODO: Get from current user
        )

        // Add to ViewModel
        _Concurrency.Task {
            await viewModel.createTask(newTask)
            dismiss()
        }
    }

    private func validateForm() -> Bool {
        showValidationError = false

        // Title required
        if title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            validationMessage = "Le titre est obligatoire"
            showValidationError = true
            return false
        }

        // Assignee required
        if assigneeId == nil {
            validationMessage = "Veuillez sélectionner un colocataire"
            showValidationError = true
            return false
        }

        return true
    }

    private func getPriorityIcon(_ priority: TaskPriority) -> String {
        switch priority {
        case .low: return "arrow.down.circle.fill"
        case .normal: return "minus.circle.fill"
        case .high: return "arrow.up.circle.fill"
        case .urgent: return "exclamationmark.circle.fill"
        }
    }
}
