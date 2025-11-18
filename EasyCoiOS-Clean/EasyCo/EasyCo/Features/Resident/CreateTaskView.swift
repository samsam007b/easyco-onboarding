//
//  CreateTaskView.swift
//  EasyCo
//
//  Formulaire complet de création de tâche pour les résidents
//

import SwiftUI

struct CreateTaskView: View {
    @ObservedObject var viewModel: TasksViewModel
    @Environment(\.dismiss) var dismiss

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
    @State private var selectedRecurringPattern: RecurringPattern? = nil
    @State private var selectedDays: Set<WeekDay> = []
    @State private var enableRotation = false

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
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Nouvelle tâche")
                            .font(.system(size: 28, weight: .bold))
                            .foregroundColor(Color(hex: "111827"))

                        Text("Créez une tâche pour organiser votre colocation")
                            .font(.system(size: 15))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.top, 8)

                    // Title
                    ResidentFormField(label: "Titre", required: true) {
                        TextField("Ex: Sortir les poubelles", text: $title)
                            .textFieldStyle(ResidentCustomTextFieldStyle())
                    }

                    // Description
                    ResidentFormField(label: "Description", required: false) {
                        TextEditor(text: $description)
                            .frame(height: 100)
                            .padding(12)
                            .background(Color.white)
                            .cornerRadius(12)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                            )
                    }

                    // Category
                    ResidentFormField(label: "Catégorie", required: true) {
                        Menu {
                            ForEach(TaskCategory.allCases, id: \.self) { category in
                                Button(action: {
                                    selectedCategory = category
                                }) {
                                    HStack {
                                        Image(systemName: category.icon)
                                        Text(category.displayName)
                                    }
                                }
                            }
                        } label: {
                            HStack {
                                Image(systemName: selectedCategory.icon)
                                    .foregroundColor(Color(hex: selectedCategory.color))
                                Text(selectedCategory.displayName)
                                    .foregroundColor(Color(hex: "111827"))
                                Spacer()
                                Image(systemName: "chevron.down")
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "9CA3AF"))
                            }
                            .padding(14)
                            .background(Color.white)
                            .cornerRadius(12)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                            )
                        }
                    }

                    // Priority
                    ResidentFormField(label: "Priorité", required: true) {
                        HStack(spacing: 12) {
                            ForEach(TaskPriority.allCases, id: \.self) { priority in
                                Button(action: {
                                    selectedPriority = priority
                                }) {
                                    Text(priority.displayName)
                                        .font(.system(size: 14, weight: selectedPriority == priority ? .semibold : .regular))
                                        .foregroundColor(selectedPriority == priority ? .white : Color(hex: "6B7280"))
                                        .padding(.horizontal, 16)
                                        .padding(.vertical, 10)
                                        .background(selectedPriority == priority ? Color(hex: priority.color) : Color.white)
                                        .cornerRadius(8)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 8)
                                                .stroke(Color(hex: "E5E7EB"), lineWidth: selectedPriority == priority ? 0 : 1)
                                        )
                                }
                            }
                        }
                    }

                    // Assigned to
                    if !enableRotation {
                        ResidentFormField(label: "Assigné à", required: true) {
                            Menu {
                                ForEach(mockRoommates, id: \.id) { roommate in
                                    Button(action: {
                                        assigneeId = roommate.id
                                        assigneeName = roommate.name
                                    }) {
                                        HStack {
                                            Image(systemName: "person.fill")
                                            Text(roommate.name)
                                        }
                                    }
                                }
                            } label: {
                                HStack {
                                    Image(systemName: "person.fill")
                                        .foregroundColor(Color(hex: "E8865D"))
                                    Text(assigneeName.isEmpty ? "Sélectionner un colocataire" : assigneeName)
                                        .foregroundColor(assigneeName.isEmpty ? Color(hex: "9CA3AF") : Color(hex: "111827"))
                                    Spacer()
                                    Image(systemName: "chevron.down")
                                        .font(.system(size: 12))
                                        .foregroundColor(Color(hex: "9CA3AF"))
                                }
                                .padding(14)
                                .background(Color.white)
                                .cornerRadius(12)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                                )
                            }
                        }
                    }

                    // Due date toggle
                    Toggle(isOn: $hasDueDate) {
                        HStack(spacing: 8) {
                            Image(systemName: hasDueDate ? "checkmark.circle.fill" : "circle")
                                .foregroundColor(hasDueDate ? Color(hex: "E8865D") : Color(hex: "9CA3AF"))
                            Text("Ajouter une date d'échéance")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "111827"))
                        }
                    }
                    .toggleStyle(SwitchToggleStyle(tint: Color(hex: "E8865D")))
                    .padding(16)
                    .background(Color.white)
                    .cornerRadius(12)

                    // Due date picker
                    if hasDueDate {
                        ResidentFormField(label: "Date d'échéance", required: false) {
                            DatePicker("", selection: $dueDate, in: Date()..., displayedComponents: [.date, .hourAndMinute])
                                .datePickerStyle(.compact)
                                .labelsHidden()
                                .padding(14)
                                .background(Color.white)
                                .cornerRadius(12)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                                )
                        }
                    }

                    // Recurring toggle
                    Toggle(isOn: $isRecurring) {
                        HStack(spacing: 8) {
                            Image(systemName: isRecurring ? "checkmark.circle.fill" : "circle")
                                .foregroundColor(isRecurring ? Color(hex: "E8865D") : Color(hex: "9CA3AF"))
                            Text("Tâche récurrente")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "111827"))
                        }
                    }
                    .toggleStyle(SwitchToggleStyle(tint: Color(hex: "E8865D")))
                    .padding(16)
                    .background(Color.white)
                    .cornerRadius(12)

                    // Recurring pattern
                    if isRecurring {
                        ResidentFormField(label: "Fréquence", required: true) {
                            Menu {
                                ForEach([RecurringPattern.daily, .weekly, .biweekly, .monthly], id: \.self) { pattern in
                                    Button(action: {
                                        selectedRecurringPattern = pattern
                                    }) {
                                        Text(pattern.displayName)
                                    }
                                }
                            } label: {
                                HStack {
                                    Image(systemName: "arrow.clockwise")
                                        .foregroundColor(Color(hex: "E8865D"))
                                    Text(selectedRecurringPattern?.displayName ?? "Sélectionner la fréquence")
                                        .foregroundColor(selectedRecurringPattern == nil ? Color(hex: "9CA3AF") : Color(hex: "111827"))
                                    Spacer()
                                    Image(systemName: "chevron.down")
                                        .font(.system(size: 12))
                                        .foregroundColor(Color(hex: "9CA3AF"))
                                }
                                .padding(14)
                                .background(Color.white)
                                .cornerRadius(12)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                                )
                            }
                        }

                        // Days selection for weekly recurring
                        if selectedRecurringPattern == .weekly || selectedRecurringPattern == .biweekly {
                            ResidentFormField(label: "Jours de la semaine", required: true) {
                                VStack(spacing: 8) {
                                    ForEach(WeekDay.allCases, id: \.self) { day in
                                        Button(action: {
                                            if selectedDays.contains(day) {
                                                selectedDays.remove(day)
                                            } else {
                                                selectedDays.insert(day)
                                            }
                                        }) {
                                            HStack {
                                                Image(systemName: selectedDays.contains(day) ? "checkmark.circle.fill" : "circle")
                                                    .foregroundColor(selectedDays.contains(day) ? Color(hex: "E8865D") : Color(hex: "9CA3AF"))
                                                Text(day.displayName)
                                                    .font(.system(size: 15))
                                                    .foregroundColor(Color(hex: "111827"))
                                                Spacer()
                                            }
                                            .padding(12)
                                            .background(Color.white)
                                            .cornerRadius(8)
                                        }
                                    }
                                }
                            }
                        }

                        // Rotation toggle
                        Toggle(isOn: $enableRotation) {
                            VStack(alignment: .leading, spacing: 4) {
                                HStack(spacing: 8) {
                                    Image(systemName: enableRotation ? "checkmark.circle.fill" : "circle")
                                        .foregroundColor(enableRotation ? Color(hex: "E8865D") : Color(hex: "9CA3AF"))
                                    Text("Rotation automatique")
                                        .font(.system(size: 16))
                                        .foregroundColor(Color(hex: "111827"))
                                }
                                Text("La tâche tournera automatiquement entre les colocataires")
                                    .font(.system(size: 13))
                                    .foregroundColor(Color(hex: "6B7280"))
                            }
                        }
                        .toggleStyle(SwitchToggleStyle(tint: Color(hex: "E8865D")))
                        .padding(16)
                        .background(Color.white)
                        .cornerRadius(12)
                    }

                    // Validation error
                    if showValidationError {
                        HStack(spacing: 12) {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .foregroundColor(Color(hex: "EF4444"))
                            Text(validationMessage)
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "EF4444"))
                        }
                        .padding(12)
                        .background(Color(hex: "FEF2F2"))
                        .cornerRadius(8)
                    }

                    Spacer(minLength: 40)
                }
                .padding(20)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") {
                        dismiss()
                    }
                    .foregroundColor(Color(hex: "6B7280"))
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: createTask) {
                        Text("Créer")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 20)
                            .padding(.vertical, 10)
                            .background(Color(hex: "E8865D"))
                            .cornerRadius(10)
                    }
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
            assigneeId: enableRotation ? nil : assigneeId,
            assigneeName: enableRotation ? nil : assigneeName,
            category: selectedCategory,
            priority: selectedPriority,
            dueDate: hasDueDate ? dueDate : nil,
            isCompleted: false,
            isRecurring: isRecurring,
            recurringPattern: isRecurring ? selectedRecurringPattern : nil,
            recurringDays: (isRecurring && !selectedDays.isEmpty) ? Array(selectedDays) : nil,
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

        // Assignee required if not rotation
        if !enableRotation && assigneeId == nil {
            validationMessage = "Veuillez sélectionner un colocataire"
            showValidationError = true
            return false
        }

        // Recurring pattern required if recurring
        if isRecurring && selectedRecurringPattern == nil {
            validationMessage = "Veuillez sélectionner une fréquence de récurrence"
            showValidationError = true
            return false
        }

        // Days required for weekly recurring
        if isRecurring && (selectedRecurringPattern == .weekly || selectedRecurringPattern == .biweekly) && selectedDays.isEmpty {
            validationMessage = "Veuillez sélectionner au moins un jour de la semaine"
            showValidationError = true
            return false
        }

        return true
    }
}

// MARK: - Resident Form Components

struct ResidentFormField<Content: View>: View {
    let label: String
    let required: Bool
    let content: Content

    init(label: String, required: Bool, @ViewBuilder content: () -> Content) {
        self.label = label
        self.required = required
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 4) {
                Text(label)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))
                if required {
                    Text("*")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "EF4444"))
                }
            }
            content
        }
    }
}

struct ResidentCustomTextFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding(14)
            .background(Color.white)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
            )
            .font(.system(size: 16))
            .foregroundColor(Color(hex: "111827"))
    }
}
