//
//  SearchPreferencesView.swift
//  IzzIco
//
//  Search preferences and filters configuration
//

import SwiftUI

struct SearchPreferencesView: View {
    @StateObject private var viewModel = SearchPreferencesViewModel()
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Location preferences
                locationSection

                // Budget preferences
                budgetSection

                // Property type preferences
                propertyTypeSection

                // Amenities preferences
                amenitiesSection

                // Save button
                saveButton
            }
            .padding()
        }
        .background(Theme.Colors.backgroundSecondary)
        .navigationTitle("Préférences de recherche")
        .navigationBarTitleDisplayMode(.inline)
        .task {
            await viewModel.loadPreferences()
        }
    }

    private var locationSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Localisation")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            VStack(spacing: 12) {
                PreferenceTextField(
                    icon: "mappin.circle.fill",
                    placeholder: "Ville préférée",
                    text: $viewModel.city,
                    color: Theme.Colors.Searcher.primary
                )

                PreferenceTextField(
                    icon: "building.2.circle.fill",
                    placeholder: "Quartier",
                    text: $viewModel.neighborhood,
                    color: Theme.Colors.Searcher.primary
                )
            }
        }
    }

    private var budgetSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Budget")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            VStack(spacing: 16) {
                HStack(spacing: 16) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Min")
                            .font(Theme.Typography.bodySmall())
                            .foregroundColor(Theme.Colors.textSecondary)

                        HStack {
                            TextField("0", value: $viewModel.minBudget, format: .number)
                                .keyboardType(.numberPad)
                                .font(Theme.Typography.body(.semibold))
                            Text("€")
                                .foregroundColor(Theme.Colors.textSecondary)
                        }
                        .padding(12)
                        .background(Theme.Colors.backgroundPrimary)
                        .cornerRadius(12)
                    }

                    VStack(alignment: .leading, spacing: 8) {
                        Text("Max")
                            .font(Theme.Typography.bodySmall())
                            .foregroundColor(Theme.Colors.textSecondary)

                        HStack {
                            TextField("2000", value: $viewModel.maxBudget, format: .number)
                                .keyboardType(.numberPad)
                                .font(Theme.Typography.body(.semibold))
                            Text("€")
                                .foregroundColor(Theme.Colors.textSecondary)
                        }
                        .padding(12)
                        .background(Theme.Colors.backgroundPrimary)
                        .cornerRadius(12)
                    }
                }
            }
        }
    }

    private var propertyTypeSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Type de logement")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                ForEach(PropertyTypePrefs.allCases, id: \.self) { type in
                    PropertyTypeButton(
                        type: type,
                        isSelected: viewModel.selectedTypes.contains(type),
                        action: { viewModel.toggleType(type) }
                    )
                }
            }
        }
    }

    private var amenitiesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Équipements")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            VStack(spacing: 8) {
                ForEach(Amenity.allCases, id: \.self) { amenity in
                    AmenityToggle(
                        amenity: amenity,
                        isSelected: viewModel.selectedAmenities.contains(amenity),
                        action: { viewModel.toggleAmenity(amenity) }
                    )
                }
            }
        }
    }

    private var saveButton: some View {
        Button(action: {
            Task {
                await viewModel.savePreferences()
                dismiss()
            }
        }) {
            HStack(spacing: 8) {
                Image(systemName: "checkmark.circle.fill")
                    .font(.system(size: 18))
                Text("Enregistrer mes préférences")
                    .font(Theme.Typography.body(.semibold))
            }
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(Theme.Gradients.searcherCTA)
            .cornerRadius(Theme.CornerRadius.button)
            .shadow(color: Theme.Colors.Searcher.primary.opacity(0.3), radius: 8, y: 4)
        }
        .padding(.top, 8)
    }
}

// MARK: - Supporting Components

private struct PreferenceTextField: View {
    let icon: String
    let placeholder: String
    @Binding var text: String
    let color: Color

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(color)
                .frame(width: 24)

            TextField(placeholder, text: $text)
                .font(Theme.Typography.body())
        }
        .padding(12)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(12)
    }
}

private struct PropertyTypeButton: View {
    let type: PropertyTypePrefs
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack {
                Image(systemName: type.icon)
                    .font(.system(size: 16))
                Text(type.label)
                    .font(Theme.Typography.bodySmall(.medium))
            }
            .foregroundColor(isSelected ? .white : Theme.Colors.textPrimary)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(isSelected ? AnyShapeStyle(Theme.Gradients.searcherCTA) : AnyShapeStyle(Theme.Colors.backgroundPrimary))
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .strokeBorder(isSelected ? Color.clear : Theme.Colors.border, lineWidth: 1)
            )
        }
    }
}

private struct AmenityToggle: View {
    let amenity: Amenity
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack {
                Image(systemName: amenity.icon)
                    .foregroundColor(isSelected ? Theme.Colors.Searcher.primary : Theme.Colors.textSecondary)
                    .frame(width: 24)

                Text(amenity.label)
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                Image(systemName: isSelected ? "checkmark.circle.fill" : "circle")
                    .foregroundColor(isSelected ? Theme.Colors.Searcher.primary : Theme.Colors.textTertiary)
            }
            .padding(12)
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(12)
        }
    }
}

// MARK: - Enums

fileprivate enum PropertyTypePrefs: String, CaseIterable, Hashable {
    case studio, apartment, house, coliving

    var label: String {
        switch self {
        case .studio: return "Studio"
        case .apartment: return "Appartement"
        case .house: return "Maison"
        case .coliving: return "Coliving"
        }
    }

    var icon: String {
        switch self {
        case .studio: return "building.fill"
        case .apartment: return "building.2.fill"
        case .house: return "house.fill"
        case .coliving: return "person.3.fill"
        }
    }
}

fileprivate enum Amenity: String, CaseIterable, Hashable {
    case furnished, parking, terrace, garden, elevator

    var label: String {
        switch self {
        case .furnished: return "Meublé"
        case .parking: return "Parking"
        case .terrace: return "Terrasse"
        case .garden: return "Jardin"
        case .elevator: return "Ascenseur"
        }
    }

    var icon: String {
        switch self {
        case .furnished: return "sofa.fill"
        case .parking: return "car.fill"
        case .terrace: return "sun.max.fill"
        case .garden: return "leaf.fill"
        case .elevator: return "arrow.up.arrow.down"
        }
    }
}

// MARK: - View Model

@MainActor
class SearchPreferencesViewModel: ObservableObject {
    @Published var city = ""
    @Published var neighborhood = ""
    @Published var minBudget: Int = 0
    @Published var maxBudget: Int = 2000
    @Published fileprivate var selectedTypes: Set<PropertyTypePrefs> = []
    @Published fileprivate var selectedAmenities: Set<Amenity> = []

    func loadPreferences() async {
        // TODO: Load from UserDefaults or API
    }

    func savePreferences() async {
        // TODO: Save to UserDefaults or API
    }

    fileprivate func toggleType(_ type: PropertyTypePrefs) {
        if selectedTypes.contains(type) {
            selectedTypes.remove(type)
        } else {
            selectedTypes.insert(type)
        }
    }

    fileprivate func toggleAmenity(_ amenity: Amenity) {
        if selectedAmenities.contains(amenity) {
            selectedAmenities.remove(amenity)
        } else {
            selectedAmenities.insert(amenity)
        }
    }
}

// MARK: - Preview

struct SearchPreferencesView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            SearchPreferencesView()
        }
    }
}
