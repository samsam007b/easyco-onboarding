//
//  CreatePropertyView.swift
//  IzzIco
//
//  Vue principale du formulaire multi-étapes de création de propriété
//

import SwiftUI

struct CreatePropertyView: View {
    @StateObject private var viewModel = CreatePropertyViewModel()
    @State private var currentStep = 1
    @Environment(\.dismiss) private var dismiss

    private let totalSteps = 5

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Progress bar
                progressBar
                    .padding(.horizontal, 20)
                    .padding(.top, 16)
                    .padding(.bottom, 24)

                // Contenu selon l'étape
                ScrollView {
                    Group {
                        switch currentStep {
                        case 1: PropertyFormStep1View(viewModel: viewModel)
                        case 2: PropertyFormStep2View(viewModel: viewModel)
                        case 3: PropertyFormStep3View(viewModel: viewModel)
                        case 4: PropertyFormStep4View(viewModel: viewModel)
                        case 5: PropertyFormStep5View(viewModel: viewModel)
                        default: EmptyView()
                        }
                    }
                    .padding(.horizontal, 20)
                }

                // Navigation buttons
                navigationButtons
                    .padding(20)
                    .background(Color.white)
                    .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: -2)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    VStack(spacing: 4) {
                        Text("Nouvelle propriété")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "111827"))
                        Text("Étape \(currentStep)/\(totalSteps)")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") {
                        dismiss()
                    }
                    .foregroundColor(Color(hex: "6E56CF"))
                }
            }
            .alert("Succès", isPresented: .constant(viewModel.successMessage != nil)) {
                Button("OK") {
                    viewModel.successMessage = nil
                    dismiss()
                }
            } message: {
                Text(viewModel.successMessage ?? "")
            }
            .alert("Erreur", isPresented: .constant(viewModel.error != nil)) {
                Button("OK") {
                    viewModel.error = nil
                }
            } message: {
                Text(viewModel.error ?? "")
            }
        }
    }

    // MARK: - Progress Bar

    private var progressBar: some View {
        HStack(spacing: 8) {
            ForEach(1...totalSteps, id: \.self) { step in
                Circle()
                    .fill(step <= currentStep ? Color(hex: "6E56CF") : Color(hex: "E5E7EB"))
                    .frame(width: 12, height: 12)
                    .overlay(
                        Circle()
                            .stroke(step == currentStep ? Color(hex: "6E56CF") : Color.clear, lineWidth: 2)
                            .frame(width: 20, height: 20)
                    )

                if step < totalSteps {
                    Rectangle()
                        .fill(step < currentStep ? Color(hex: "6E56CF") : Color(hex: "E5E7EB"))
                        .frame(height: 2)
                }
            }
        }
    }

    // MARK: - Navigation Buttons

    private var navigationButtons: some View {
        HStack(spacing: 12) {
            if currentStep > 1 {
                Button(action: {
                    withAnimation(.easeInOut(duration: 0.3)) {
                        currentStep -= 1
                    }
                }) {
                    HStack(spacing: 8) {
                        Image(systemName: "chevron.left")
                            .font(.system(size: 14, weight: .semibold))
                        Text("Précédent")
                            .font(.system(size: 16, weight: .semibold))
                    }
                    .foregroundColor(Color(hex: "6E56CF"))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Color.white)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color(hex: "6E56CF"), lineWidth: 2)
                    )
                    .cornerRadius(12)
                }
                .disabled(viewModel.isCreating)
            }

            Button(action: {
                if currentStep == totalSteps {
                    // Publier
                    _Concurrency.Task {
                        await viewModel.createProperty()
                    }
                } else {
                    // Passer à l'étape suivante
                    withAnimation(.easeInOut(duration: 0.3)) {
                        currentStep += 1
                    }
                }
            }) {
                HStack(spacing: 8) {
                    if viewModel.isCreating {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            .scaleEffect(0.8)
                        Text("Publication...")
                            .font(.system(size: 16, weight: .semibold))
                    } else {
                        Text(currentStep == totalSteps ? "Publier" : "Suivant")
                            .font(.system(size: 16, weight: .semibold))
                        if currentStep < totalSteps {
                            Image(systemName: "chevron.right")
                                .font(.system(size: 14, weight: .semibold))
                        }
                    }
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "6E56CF"), Color(hex: "8B5CF6")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(12)
                .shadow(color: Color(hex: "6E56CF").opacity(0.3), radius: 8, x: 0, y: 4)
            }
            .disabled(!viewModel.isStepValid(currentStep) || viewModel.isCreating)
            .opacity(viewModel.isStepValid(currentStep) && !viewModel.isCreating ? 1.0 : 0.5)
        }
    }
}

// Extensions Color et View sont déjà définies ailleurs dans le projet
