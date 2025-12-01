//
//  PropertyFormStep5View.swift
//  EasyCo
//
//  Étape 5 : Disponibilité et préférences de locataires
//

import SwiftUI

struct PropertyFormStep5View: View {
    @ObservedObject var viewModel: CreatePropertyViewModel

    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            // Header
            VStack(alignment: .leading, spacing: 8) {
                Text("Disponibilité")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Quand et pour qui est disponible votre propriété ?")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            // Date de disponibilité
            OwnerFormField(label: "Disponible à partir du", required: true) {
                DatePicker(
                    "",
                    selection: $viewModel.availableFrom,
                    displayedComponents: .date
                )
                .datePickerStyle(.compact)
                .labelsHidden()
                .padding(12)
                .background(Color.white)
                .cornerRadius(12)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                )
            }

            // Durée minimum du bail
            OwnerFormField(label: "Durée minimum du bail", required: true) {
                VStack(alignment: .leading, spacing: 8) {
                    Stepper("\(viewModel.minimumStayMonths) mois", value: $viewModel.minimumStayMonths, in: 1...24)
                        .padding(14)
                        .background(Color.white)
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                        )

                    Text("La plupart des propriétaires demandent 6-12 mois minimum")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }

            // Durée maximum (optionnel)
            Toggle(isOn: $viewModel.hasMaximumStay) {
                HStack(spacing: 8) {
                    Image(systemName: viewModel.hasMaximumStay ? "checkmark.circle.fill" : "circle")
                        .foregroundColor(viewModel.hasMaximumStay ? Color(hex: "6E56CF") : Color(hex: "9CA3AF"))
                    Text("Définir une durée maximum")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "111827"))
                }
            }
            .toggleStyle(SwitchToggleStyle(tint: Color(hex: "6E56CF")))
            .padding(16)
            .background(Color.white)
            .cornerRadius(12)

            if viewModel.hasMaximumStay {
                OwnerFormField(label: "Durée maximum du bail", required: false) {
                    Stepper("\(viewModel.maximumStayMonths ?? 12) mois", value: Binding(
                        get: { viewModel.maximumStayMonths ?? 12 },
                        set: { viewModel.maximumStayMonths = $0 }
                    ), in: (viewModel.minimumStayMonths + 1)...36)
                        .padding(14)
                        .background(Color.white)
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                        )
                }
                .transition(.opacity.combined(with: .move(edge: .top)))
            }

            Divider()
                .padding(.vertical, 8)

            // Préférences de locataires
            VStack(alignment: .leading, spacing: 16) {
                Text("Préférences de locataires")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Ces critères sont indicatifs et vous aideront à trouver les bons locataires")
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))

                // Âge préféré
                VStack(alignment: .leading, spacing: 12) {
                    Text("Âge préféré : \(Int(viewModel.preferredAgeMin)) - \(Int(viewModel.preferredAgeMax)) ans")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "374151"))

                    HStack(spacing: 16) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Min")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "6B7280"))
                            Slider(value: $viewModel.preferredAgeMin, in: 18...60, step: 1)
                                .tint(Color(hex: "6E56CF"))
                        }

                        VStack(alignment: .leading, spacing: 4) {
                            Text("Max")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "6B7280"))
                            Slider(value: $viewModel.preferredAgeMax, in: 18...60, step: 1)
                                .tint(Color(hex: "6E56CF"))
                        }
                    }
                }
                .padding(16)
                .background(Color.white)
                .cornerRadius(12)

                // Genre préféré
                OwnerFormField(label: "Genre préféré", required: false) {
                    Menu {
                        ForEach(TenantGenderPreference.allCases, id: \.self) { gender in
                            Button(action: {
                                viewModel.preferredGender = gender
                            }) {
                                Text(gender.displayName)
                            }
                        }
                    } label: {
                        HStack {
                            Text(viewModel.preferredGender.displayName)
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

                // Règles
                VStack(spacing: 12) {
                    PropertyPreferenceToggle(
                        icon: "smoke",
                        label: "Fumeur accepté",
                        isOn: $viewModel.smokingAllowed
                    )

                    PropertyPreferenceToggle(
                        icon: "pawprint.fill",
                        label: "Animaux acceptés",
                        isOn: $viewModel.petsAllowed
                    )

                    PropertyPreferenceToggle(
                        icon: "heart.fill",
                        label: "Couples acceptés",
                        isOn: $viewModel.couplesAllowed
                    )

                    PropertyPreferenceToggle(
                        icon: "figure.2.and.child.holdinghands",
                        label: "Enfants acceptés",
                        isOn: $viewModel.childrenAllowed
                    )
                }
            }

            Spacer(minLength: 40)
        }
    }
}

// MARK: - Property Preference Toggle

struct PropertyPreferenceToggle: View {
    let icon: String
    let label: String
    @Binding var isOn: Bool

    var body: some View {
        Toggle(isOn: $isOn) {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 16))
                    .foregroundColor(isOn ? Color(hex: "6E56CF") : Color(hex: "9CA3AF"))
                    .frame(width: 24)

                Text(label)
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "111827"))
            }
        }
        .toggleStyle(SwitchToggleStyle(tint: Color(hex: "6E56CF")))
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
    }
}

