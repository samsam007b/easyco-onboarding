//
//  CreateMaintenanceRequestView.swift
//  IzzIco
//
//  Create new maintenance request for residents
//

import SwiftUI

struct CreateMaintenanceRequestView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var viewModel = CreateMaintenanceViewModel()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    headerSection

                    // Form sections
                    VStack(spacing: 20) {
                        titleSection
                        categorySection
                        prioritySection
                        descriptionSection
                        photosSection
                    }

                    // Submit button
                    submitButton
                }
                .padding()
            }
            .background(Theme.Colors.backgroundSecondary)
            .navigationTitle("Nouvelle demande")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") {
                        dismiss()
                    }
                }
            }
        }
    }

    private var headerSection: some View {
        VStack(spacing: 12) {
            Image.lucide("tool")
                .resizable()
                .scaledToFit()
                .frame(width: 60, height: 60)
                .foregroundColor(Theme.Colors.Resident.primary)
                .padding(20)
                .background(Theme.Colors.Resident.primary.opacity(0.1))
                .cornerRadius(20)

            VStack(spacing: 4) {
                Text("Demande de maintenance")
                    .font(Theme.Typography.title3())
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Décrivez votre problème en détail")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
                    .multilineTextAlignment(.center)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 20)
    }

    private var titleSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Titre", systemImage: "text.alignleft")
                .font(Theme.Typography.body(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            TextField("Ex: Fuite d'eau dans la salle de bain", text: $viewModel.title)
                .textFieldStyle(CustomTextFieldStyle())
        }
    }

    private var categorySection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Catégorie", systemImage: "folder")
                .font(Theme.Typography.body(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                ForEach(MaintenanceRequestCategory.allCases, id: \.self) { category in
                    CategoryButtonResident(
                        category: category,
                        isSelected: viewModel.selectedCategory == category,
                        action: {
                            viewModel.selectedCategory = category
                            Haptic.impact(.light)
                        }
                    )
                }
            }
        }
    }

    private var prioritySection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Priorité", systemImage: "exclamationmark.triangle")
                .font(Theme.Typography.body(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            HStack(spacing: 12) {
                ForEach(MaintenancePriority.allCases, id: \.self) { priority in
                    PriorityButtonResident(
                        priority: priority,
                        isSelected: viewModel.selectedPriority == priority,
                        action: {
                            viewModel.selectedPriority = priority
                            Haptic.impact(.light)
                        }
                    )
                }
            }
        }
    }

    private var descriptionSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Description", systemImage: "text.alignleft")
                .font(Theme.Typography.body(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            TextEditor(text: $viewModel.description)
                .frame(height: 120)
                .padding(12)
                .background(Theme.Colors.backgroundPrimary)
                .cornerRadius(Theme.CornerRadius.input)
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.CornerRadius.input)
                        .strokeBorder(Theme.Colors.border, lineWidth: 1)
                )
        }
    }

    private var photosSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Photos (optionnel)", systemImage: "photo")
                .font(Theme.Typography.body(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            Button(action: {
                Haptic.impact(.light)
            }) {
                HStack(spacing: 12) {
                    Image.lucide("camera")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)

                    Text("Ajouter des photos")
                        .font(Theme.Typography.body())

                    Spacer()

                    Image.lucide("chevron-right")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 16, height: 16)
                }
                .foregroundColor(Theme.Colors.textPrimary)
                .padding(16)
                .background(Theme.Colors.backgroundPrimary)
                .cornerRadius(Theme.CornerRadius.card)
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.CornerRadius.card)
                        .strokeBorder(Theme.Colors.border, lineWidth: 1)
                )
            }
        }
    }

    private var submitButton: some View {
        Button(action: {
            Task {
                await viewModel.submitRequest()
                dismiss()
            }
        }) {
            HStack(spacing: 12) {
                Image.lucide("send")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 20, height: 20)

                Text("Envoyer la demande")
                    .font(Theme.Typography.body(.semibold))
            }
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(viewModel.isValid ? AnyShapeStyle(Theme.Gradients.residentCTA) : AnyShapeStyle(Theme.Colors.gray300))
            .cornerRadius(Theme.CornerRadius.button)
            .shadow(color: viewModel.isValid ? Theme.Colors.Resident.primary.opacity(0.3) : .clear, radius: 8, y: 4)
        }
        .disabled(!viewModel.isValid)
    }
}

// MARK: - Maintenance Request Category

enum MaintenanceRequestCategory: String, CaseIterable {
    case plumbing, electrical, heating, appliances, structure, other

    var label: String {
        switch self {
        case .plumbing: return "Plomberie"
        case .electrical: return "Électricité"
        case .heating: return "Chauffage"
        case .appliances: return "Électroménager"
        case .structure: return "Structure"
        case .other: return "Autre"
        }
    }

    var icon: String {
        switch self {
        case .plumbing: return "droplet"
        case .electrical: return "zap"
        case .heating: return "thermometer"
        case .appliances: return "coffee"
        case .structure: return "home"
        case .other: return "more-horizontal"
        }
    }
}

// MARK: - Category Button

private struct CategoryButtonResident: View {
    let category: MaintenanceRequestCategory
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image.lucide(category.icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 24, height: 24)

                Text(category.label)
                    .font(Theme.Typography.bodySmall(.medium))
            }
            .foregroundColor(isSelected ? .white : Theme.Colors.textPrimary)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(isSelected ? AnyShapeStyle(Theme.Gradients.residentCTA) : AnyShapeStyle(Theme.Colors.backgroundPrimary))
            .cornerRadius(Theme.CornerRadius.card)
            .overlay(
                RoundedRectangle(cornerRadius: Theme.CornerRadius.card)
                    .strokeBorder(isSelected ? Color.clear : Theme.Colors.border, lineWidth: 1)
            )
        }
    }
}

// MARK: - Priority Button

private struct PriorityButtonResident: View {
    let priority: MaintenancePriority
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Circle()
                    .fill(priority.color)
                    .frame(width: 8, height: 8)

                Text(priority.label)
                    .font(Theme.Typography.bodySmall(.semibold))
            }
            .foregroundColor(isSelected ? .white : priority.color)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(isSelected ? AnyShapeStyle(priority.color) : AnyShapeStyle(priority.color.opacity(0.1)))
            .cornerRadius(Theme.CornerRadius.button)
        }
    }
}

// MARK: - Custom Text Field Style

private struct CustomTextFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding(12)
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.input)
            .overlay(
                RoundedRectangle(cornerRadius: Theme.CornerRadius.input)
                    .strokeBorder(Theme.Colors.border, lineWidth: 1)
            )
    }
}

// MARK: - View Model

@MainActor
class CreateMaintenanceViewModel: ObservableObject {
    @Published var title = ""
    @Published var description = ""
    @Published var selectedCategory: MaintenanceRequestCategory = .other
    @Published var selectedPriority: MaintenancePriority = .normal

    var isValid: Bool {
        !title.isEmpty && !description.isEmpty
    }

    func submitRequest() async {
        // Submit to API
        Haptic.notification(.success)
    }
}

// MARK: - Preview

struct CreateMaintenanceRequestView_Previews: PreviewProvider {
    static var previews: some View {
        CreateMaintenanceRequestView()
    }
}
