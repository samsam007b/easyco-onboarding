//
//  PropertyFormStep3View.swift
//  EasyCo
//
//  Étape 3 : Équipements et commodités
//

import SwiftUI

struct PropertyFormStep3View: View {
    @ObservedObject var viewModel: CreatePropertyViewModel

    private let columns = [
        GridItem(.flexible()),
        GridItem(.flexible())
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            // Header
            VStack(alignment: .leading, spacing: 8) {
                Text("Équipements")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Sélectionnez les équipements disponibles")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            // Compteur d'équipements sélectionnés
            if !viewModel.selectedAmenities.isEmpty {
                HStack {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(Color(hex: "10B981"))
                    Text("\(viewModel.selectedAmenities.count) équipement(s) sélectionné(s)")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "10B981"))
                }
                .padding(12)
                .background(Color(hex: "F0FDF4"))
                .cornerRadius(8)
            }

            // Grid d'équipements
            LazyVGrid(columns: columns, spacing: 12) {
                ForEach(PropertyAmenity.allCases, id: \.self) { amenity in
                    AmenityCard(
                        amenity: amenity,
                        isSelected: viewModel.selectedAmenities.contains(amenity)
                    ) {
                        toggleAmenity(amenity)
                    }
                }
            }

            Divider()
                .padding(.vertical, 8)

            // Règlement intérieur (optionnel)
            OwnerFormField(label: "Règlement intérieur", required: false) {
                VStack(alignment: .leading, spacing: 8) {
                    TextEditor(text: $viewModel.houseRules)
                        .frame(height: 120)
                        .padding(12)
                        .background(Color.white)
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                        )

                    Text("Ex: Calme après 22h, respect des espaces communs, etc.")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }

            Spacer(minLength: 40)
        }
    }

    // MARK: - Actions

    private func toggleAmenity(_ amenity: PropertyAmenity) {
        if viewModel.selectedAmenities.contains(amenity) {
            viewModel.selectedAmenities.remove(amenity)
        } else {
            viewModel.selectedAmenities.insert(amenity)
        }
    }
}

// MARK: - Amenity Card

struct AmenityCard: View {
    let amenity: PropertyAmenity
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 12) {
                Image(systemName: amenity.icon)
                    .font(.system(size: 24))
                    .foregroundColor(isSelected ? Color(hex: "6E56CF") : Color(hex: "9CA3AF"))

                Text(amenity.displayName)
                    .font(.system(size: 12))
                    .foregroundColor(isSelected ? Color(hex: "111827") : Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .padding(.horizontal, 8)
            .background(
                isSelected ?
                Color(hex: "F3F0FF") :
                Color.white
            )
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(
                        isSelected ? Color(hex: "6E56CF") : Color(hex: "E5E7EB"),
                        lineWidth: isSelected ? 2 : 1
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

