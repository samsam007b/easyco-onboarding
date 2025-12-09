//
//  MaintenanceRequestCreateView.swift
//  IzzIco
//
//  View for creating a new maintenance request
//

import SwiftUI

struct MaintenanceRequestCreateView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var viewModel = MaintenanceRequestCreateViewModel()

    @State private var title: String = ""
    @State private var description: String = ""
    @State private var selectedCategory: MaintenanceCategory = .plumbing
    @State private var selectedPriority: MaintenancePriority = .medium

    var body: some View {
        NavigationStack {
            Form {
                // Title Section
                Section {
                    TextField("Titre de la demande", text: $title)
                        .font(Theme.Typography.body())
                } header: {
                    Text("TITRE")
                        .font(Theme.Typography.bodySmall(.semibold))
                }

                // Description Section
                Section {
                    TextEditor(text: $description)
                        .frame(minHeight: 100)
                        .font(Theme.Typography.body())
                } header: {
                    Text("DESCRIPTION")
                        .font(Theme.Typography.bodySmall(.semibold))
                } footer: {
                    Text("Décrivez le problème en détail")
                        .font(Theme.Typography.caption())
                }

                // Category Section
                Section {
                    Picker("Catégorie", selection: $selectedCategory) {
                        ForEach(MaintenanceCategory.allCases, id: \.self) { category in
                            HStack {
                                Image(systemName: category.icon)
                                Text(category.displayName)
                            }
                            .tag(category)
                        }
                    }
                    .pickerStyle(.menu)
                } header: {
                    Text("CATÉGORIE")
                        .font(Theme.Typography.bodySmall(.semibold))
                }

                // Priority Section
                Section {
                    Picker("Priorité", selection: $selectedPriority) {
                        ForEach(MaintenancePriority.allCases, id: \.self) { priority in
                            HStack {
                                Circle()
                                    .fill(priority.color)
                                    .frame(width: 8, height: 8)
                                Text(priority.displayName)
                            }
                            .tag(priority)
                        }
                    }
                    .pickerStyle(.segmented)
                } header: {
                    Text("PRIORITÉ")
                        .font(Theme.Typography.bodySmall(.semibold))
                }

                // Photos Section (placeholder for future)
                Section {
                    Button(action: {
                        // TODO: Add photo upload
                    }) {
                        HStack {
                            Image(systemName: "camera.fill")
                                .foregroundColor(Theme.Colors.textSecondary)
                            Text("Ajouter des photos")
                                .foregroundColor(Theme.Colors.textPrimary)
                            Spacer()
                            Image(systemName: "chevron.right")
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundColor(Theme.Colors.textTertiary)
                        }
                    }
                } header: {
                    Text("PHOTOS (OPTIONNEL)")
                        .font(Theme.Typography.bodySmall(.semibold))
                } footer: {
                    Text("Ajoutez des photos pour illustrer le problème")
                        .font(Theme.Typography.caption())
                }

                // Submit Button
                Section {
                    Button(action: {
                        Task {
                            await submitRequest()
                        }
                    }) {
                        if viewModel.isSubmitting {
                            HStack {
                                Spacer()
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle())
                                Text("Envoi en cours...")
                                    .font(Theme.Typography.body(.semibold))
                                Spacer()
                            }
                        } else {
                            HStack {
                                Spacer()
                                Text("Envoyer la demande")
                                    .font(Theme.Typography.body(.semibold))
                                    .foregroundColor(.white)
                                Spacer()
                            }
                            .padding(.vertical, 8)
                            .background(
                                LinearGradient(
                                    colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(12)
                        }
                    }
                    .disabled(!isFormValid || viewModel.isSubmitting)
                    .listRowBackground(Color.clear)
                }
            }
            .navigationTitle("Nouvelle Demande")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") {
                        dismiss()
                    }
                }
            }
            .alert("Succès", isPresented: $viewModel.showSuccess) {
                Button("OK") {
                    dismiss()
                }
            } message: {
                Text("Votre demande de maintenance a été envoyée avec succès.")
            }
            .alert("Erreur", isPresented: $viewModel.showError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(viewModel.errorMessage ?? "Une erreur est survenue")
            }
        }
    }

    private var isFormValid: Bool {
        !title.isEmpty && !description.isEmpty
    }

    private func submitRequest() async {
        await viewModel.createMaintenanceRequest(
            title: title,
            description: description,
            category: selectedCategory.rawValue,
            priority: selectedPriority.rawValue
        )
    }
}

// MARK: - ViewModel

@MainActor
class MaintenanceRequestCreateViewModel: ObservableObject {
    @Published var isSubmitting = false
    @Published var showSuccess = false
    @Published var showError = false
    @Published var errorMessage: String?

    private let service = MaintenanceService()

    func createMaintenanceRequest(
        title: String,
        description: String,
        category: String,
        priority: String
    ) async {
        isSubmitting = true

        do {
            guard let user = AuthManager.shared.currentUser else {
                throw AppError.authentication("Aucune session active")
            }

            guard let accessToken = EasyCoKeychainManager.shared.getAuthToken() else {
                throw AppError.authentication("Token d'authentification manquant")
            }

            // Get user's active property
            // For now, we'll need to fetch this or pass it as parameter
            // TODO: Get propertyId from user's active property membership
            let propertyId = user.id.uuidString // Placeholder

            let _ = try await service.createMaintenanceRequest(
                userId: user.id.uuidString,
                propertyId: propertyId,
                title: title,
                description: description,
                category: category,
                priority: priority,
                accessToken: accessToken
            )

            isSubmitting = false
            showSuccess = true

        } catch {
            print("❌ Error creating maintenance request: \(error.localizedDescription)")
            errorMessage = error.localizedDescription
            showError = true
            isSubmitting = false
        }
    }
}

// MARK: - Supporting Types

enum MaintenanceCategory: String, CaseIterable {
    case plumbing = "plumbing"
    case electrical = "electrical"
    case heating = "heating"
    case appliances = "appliances"
    case structural = "structural"
    case cleaning = "cleaning"
    case other = "other"

    var displayName: String {
        switch self {
        case .plumbing: return "Plomberie"
        case .electrical: return "Électricité"
        case .heating: return "Chauffage"
        case .appliances: return "Électroménager"
        case .structural: return "Structure"
        case .cleaning: return "Nettoyage"
        case .other: return "Autre"
        }
    }

    var icon: String {
        switch self {
        case .plumbing: return "drop.fill"
        case .electrical: return "bolt.fill"
        case .heating: return "flame.fill"
        case .appliances: return "washer.fill"
        case .structural: return "building.2.fill"
        case .cleaning: return "sparkles"
        case .other: return "wrench.and.screwdriver.fill"
        }
    }
}

enum MaintenancePriority: String, CaseIterable {
    case low = "low"
    case medium = "medium"
    case high = "high"
    case urgent = "urgent"

    var displayName: String {
        switch self {
        case .low: return "Faible"
        case .medium: return "Moyenne"
        case .high: return "Haute"
        case .urgent: return "Urgente"
        }
    }

    var color: Color {
        switch self {
        case .low: return Color(hex: "10B981")
        case .medium: return Color(hex: "F59E0B")
        case .high: return Color(hex: "F97316")
        case .urgent: return Color(hex: "EF4444")
        }
    }
}

// MARK: - Preview

struct MaintenanceRequestCreateView_Previews: PreviewProvider {
    static var previews: some View {
        MaintenanceRequestCreateView()
    }
}
