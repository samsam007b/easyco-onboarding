//
//  PropertyFormStep1View.swift
//  IzzIco
//
//  Étape 1 : Informations de base de la propriété
//

import SwiftUI

struct PropertyFormStep1View: View {
    @ObservedObject var viewModel: CreatePropertyViewModel

    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            // Header
            VStack(alignment: .leading, spacing: 8) {
                Text("Informations de base")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Décrivez votre propriété en quelques mots")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            // Titre
            OwnerFormField(label: "Titre de l'annonce", required: true) {
                TextField("Ex: Magnifique Colocation à Ixelles", text: $viewModel.title)
                    .textFieldStyle(OwnerCustomTextFieldStyle())
            }

            // Description
            OwnerFormField(label: "Description", required: true) {
                TextEditor(text: $viewModel.description)
                    .frame(height: 120)
                    .padding(12)
                    .background(Color.white)
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                    )
            }

            // Type de logement
            OwnerFormField(label: "Type de logement", required: true) {
                Menu {
                    ForEach(PropertyType.allCases, id: \.self) { type in
                        Button(action: {
                            viewModel.propertyType = type
                        }) {
                            HStack {
                                Image(systemName: type.icon)
                                Text(type.displayName)
                            }
                        }
                    }
                } label: {
                    HStack {
                        Image(systemName: viewModel.propertyType.icon)
                            .foregroundColor(Color(hex: "6E56CF"))
                        Text(viewModel.propertyType.displayName)
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

            // Adresse
            OwnerFormField(label: "Adresse complète", required: true) {
                TextField("Ex: Rue de la Paix 42", text: $viewModel.address)
                    .textFieldStyle(OwnerCustomTextFieldStyle())
            }

            // Ville et Code postal
            HStack(spacing: 12) {
                OwnerFormField(label: "Ville", required: true) {
                    TextField("Ex: Ixelles", text: $viewModel.city)
                        .textFieldStyle(OwnerCustomTextFieldStyle())
                }

                OwnerFormField(label: "Code postal", required: true) {
                    TextField("1050", text: $viewModel.postalCode)
                        .keyboardType(.numberPad)
                        .textFieldStyle(OwnerCustomTextFieldStyle())
                }
            }

            // Quartier (optionnel)
            OwnerFormField(label: "Quartier", required: false) {
                TextField("Ex: Flagey", text: $viewModel.neighborhood)
                    .textFieldStyle(OwnerCustomTextFieldStyle())
            }

            // Surface
            OwnerFormField(label: "Surface (m²)", required: false) {
                TextField("Ex: 120", text: $viewModel.surfaceArea)
                    .keyboardType(.decimalPad)
                    .textFieldStyle(OwnerCustomTextFieldStyle())
            }

            // Nombre de chambres et salles de bain
            HStack(spacing: 12) {
                OwnerFormField(label: "Chambres", required: true) {
                    Stepper("\(viewModel.bedrooms)", value: $viewModel.bedrooms, in: 1...20)
                        .padding(14)
                        .background(Color.white)
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                        )
                }

                OwnerFormField(label: "Salles de bain", required: true) {
                    Stepper("\(viewModel.bathrooms)", value: $viewModel.bathrooms, in: 1...10)
                        .padding(14)
                        .background(Color.white)
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                        )
                }
            }

            // Meublé
            Toggle(isOn: $viewModel.furnished) {
                HStack(spacing: 8) {
                    Image(systemName: viewModel.furnished ? "checkmark.circle.fill" : "circle")
                        .foregroundColor(viewModel.furnished ? Color(hex: "6E56CF") : Color(hex: "9CA3AF"))
                    Text("Logement meublé")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "111827"))
                }
            }
            .toggleStyle(SwitchToggleStyle(tint: Color(hex: "6E56CF")))
            .padding(16)
            .background(Color.white)
            .cornerRadius(12)

            Spacer(minLength: 40)
        }
    }
}


