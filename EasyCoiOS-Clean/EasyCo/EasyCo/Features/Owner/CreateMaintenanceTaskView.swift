//
//  CreateMaintenanceTaskView.swift
//  EasyCo
//
//  Form to create a new maintenance task
//

import SwiftUI

struct CreateMaintenanceTaskView: View {
    @Environment(\.dismiss) var dismiss

    @State private var title = ""
    @State private var description = ""
    @State private var selectedCategory: MaintenanceCategory = .other
    @State private var selectedPriority: MaintenancePriority = .normal
    @State private var selectedProperty: UUID?
    @State private var selectedAssignment: AssignedTo = .myself
    @State private var selectedContractor: UUID?
    @State private var dueDate = Date().addingTimeInterval(604800) // 1 week from now
    @State private var hasDueDate = true
    @State private var estimatedCost = ""
    @State private var notes = ""
    @State private var isCreating = false

    @FocusState private var focusedField: Field?

    enum Field {
        case title, description, cost, notes
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Basic info
                    basicInfoSection

                    // Category & Priority
                    categorySection

                    // Assignment
                    assignmentSection

                    // Due date
                    dueDateSection

                    // Cost
                    costSection

                    // Notes
                    notesSection
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Nouvelle tâche")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                ToolbarItem(placement: .cancellationAction) {
                    Button("Annuler") {
                        dismiss()
                    }
                    .foregroundColor(Color(hex: "6B7280"))
                }

                ToolbarItem(placement: .confirmationAction) {
                    Button("Créer") {
                        createTask()
                    }
                    .foregroundColor(Color(hex: "6E56CF"))
                    .disabled(!isValid || isCreating)
                }
            }
        }
    }

    // MARK: - Basic Info Section

    private var basicInfoSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Informations de base")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            VStack(alignment: .leading, spacing: 8) {
                Text("Titre *")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))

                TextField("Ex: Fuite d'eau salle de bain", text: $title)
                    .focused($focusedField, equals: .title)
                    .font(.system(size: 15))
                    .padding(12)
                    .background(Color(hex: "F9FAFB"))
                    .cornerRadius(8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(focusedField == .title ? Color(hex: "6E56CF") : Color(hex: "E5E7EB"), lineWidth: 1)
                    )
            }

            VStack(alignment: .leading, spacing: 8) {
                Text("Description")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))

                TextEditor(text: $description)
                    .focused($focusedField, equals: .description)
                    .font(.system(size: 15))
                    .frame(height: 100)
                    .padding(8)
                    .background(Color(hex: "F9FAFB"))
                    .cornerRadius(8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(focusedField == .description ? Color(hex: "6E56CF") : Color(hex: "E5E7EB"), lineWidth: 1)
                    )
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
    }

    // MARK: - Category Section

    private var categorySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Catégorie et Priorité")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            VStack(alignment: .leading, spacing: 12) {
                Text("Catégorie *")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))

                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 8) {
                    ForEach(MaintenanceCategory.allCases, id: \.self) { category in
                        CategoryButton(
                            category: category,
                            isSelected: selectedCategory == category,
                            action: { selectedCategory = category }
                        )
                    }
                }
            }

            Divider()

            VStack(alignment: .leading, spacing: 12) {
                Text("Priorité *")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))

                HStack(spacing: 8) {
                    ForEach(MaintenancePriority.allCases, id: \.self) { priority in
                        PriorityButton(
                            priority: priority,
                            isSelected: selectedPriority == priority,
                            action: { selectedPriority = priority }
                        )
                    }
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
    }

    // MARK: - Assignment Section

    private var assignmentSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Attribution")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            VStack(spacing: 12) {
                ForEach(AssignedTo.allCases, id: \.self) { assignment in
                    AssignmentButton(
                        assignment: assignment,
                        isSelected: selectedAssignment == assignment,
                        action: { selectedAssignment = assignment }
                    )
                }
            }

            if selectedAssignment == .contractor {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Sélectionner un prestataire")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "374151"))

                    Button(action: {}) {
                        HStack {
                            Image(systemName: "person.2.fill")
                                .font(.system(size: 14))
                            Text("Choisir un prestataire")
                                .font(.system(size: 15))
                            Spacer()
                            Image(systemName: "chevron.right")
                                .font(.system(size: 12))
                        }
                        .foregroundColor(Color(hex: "6E56CF"))
                        .padding(12)
                        .background(Color(hex: "F3F0FF"))
                        .cornerRadius(8)
                    }
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
    }

    // MARK: - Due Date Section

    private var dueDateSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Toggle(isOn: $hasDueDate) {
                Text("Définir une date limite")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
            }
            .tint(Color(hex: "6E56CF"))

            if hasDueDate {
                DatePicker(
                    "Date limite",
                    selection: $dueDate,
                    in: Date()...,
                    displayedComponents: [.date]
                )
                .datePickerStyle(.graphical)
                .tint(Color(hex: "6E56CF"))
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
    }

    // MARK: - Cost Section

    private var costSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Coût estimé")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            HStack(spacing: 12) {
                TextField("0", text: $estimatedCost)
                    .focused($focusedField, equals: .cost)
                    .keyboardType(.decimalPad)
                    .font(.system(size: 15))
                    .padding(12)
                    .background(Color(hex: "F9FAFB"))
                    .cornerRadius(8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(focusedField == .cost ? Color(hex: "6E56CF") : Color(hex: "E5E7EB"), lineWidth: 1)
                    )

                Text("€")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(Color(hex: "6B7280"))
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
    }

    // MARK: - Notes Section

    private var notesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Notes supplémentaires")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            TextEditor(text: $notes)
                .focused($focusedField, equals: .notes)
                .font(.system(size: 15))
                .frame(height: 100)
                .padding(8)
                .background(Color(hex: "F9FAFB"))
                .cornerRadius(8)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(focusedField == .notes ? Color(hex: "6E56CF") : Color(hex: "E5E7EB"), lineWidth: 1)
                )
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
    }

    // MARK: - Validation & Actions

    private var isValid: Bool {
        !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    private func createTask() {
        isCreating = true

        // Demo mode - simulate API call
        _Concurrency.Task {
            try? await _Concurrency.Task.sleep(nanoseconds: 1_000_000_000)

            await MainActor.run {
                isCreating = false
                dismiss()
            }
        }
    }
}

// MARK: - Category Button

struct CategoryButton: View {
    let category: MaintenanceCategory
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 6) {
                Image(systemName: category.icon)
                    .font(.system(size: 20))
                    .foregroundColor(isSelected ? Color(hex: category.color) : Color(hex: "6B7280"))

                Text(category.displayName)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(isSelected ? Color(hex: category.color) : Color(hex: "6B7280"))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(isSelected ? Color(hex: category.color).opacity(0.1) : Color(hex: "F9FAFB"))
            .cornerRadius(8)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(isSelected ? Color(hex: category.color) : Color(hex: "E5E7EB"), lineWidth: 1)
            )
        }
    }
}

// MARK: - Priority Button

struct PriorityButton: View {
    let priority: MaintenancePriority
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 4) {
                Image(systemName: priority.icon)
                    .font(.system(size: 12))
                Text(priority.displayName)
                    .font(.system(size: 13, weight: .medium))
            }
            .foregroundColor(isSelected ? .white : priority.color)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 10)
            .background(isSelected ? priority.color : priority.color.opacity(0.1))
            .cornerRadius(8)
        }
    }
}

// MARK: - Assignment Button

struct AssignmentButton: View {
    let assignment: AssignedTo
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                Image(systemName: assignment.icon)
                    .font(.system(size: 16))
                    .foregroundColor(isSelected ? Color(hex: "6E56CF") : Color(hex: "6B7280"))
                    .frame(width: 24)

                Text(assignment.displayName)
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(isSelected ? Color(hex: "111827") : Color(hex: "6B7280"))

                Spacer()

                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "6E56CF"))
                }
            }
            .padding(12)
            .background(isSelected ? Color(hex: "F3F0FF") : Color(hex: "F9FAFB"))
            .cornerRadius(8)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(isSelected ? Color(hex: "6E56CF") : Color(hex: "E5E7EB"), lineWidth: 1)
            )
        }
    }
}
