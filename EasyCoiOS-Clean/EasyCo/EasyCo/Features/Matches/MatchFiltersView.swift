//
//  MatchFiltersView.swift
//  EasyCo
//
//  Filter view for property matching
//

import SwiftUI

struct MatchFiltersView: View {
    @Binding var filters: MatchFilters
    @Environment(\.dismiss) private var dismiss
    let onApply: (MatchFilters) -> Void

    @State private var tempFilters: MatchFilters

    init(filters: Binding<MatchFilters>, onApply: @escaping (MatchFilters) -> Void) {
        self._filters = filters
        self.onApply = onApply
        self._tempFilters = State(initialValue: filters.wrappedValue)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Budget section
                    budgetSection

                    // Location section
                    locationSection

                    // Property type section
                    propertyTypeSection

                    // Rooms section
                    roomsSection

                    // Amenities section
                    amenitiesSection

                    // Additional options
                    additionalOptionsSection
                }
                .padding(16)
            }
            .background(Theme.Colors.backgroundSecondary)
            .navigationTitle("Filtres")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Annuler") { dismiss() }
                }

                ToolbarItem(placement: .confirmationAction) {
                    Button("Appliquer") {
                        filters = tempFilters
                        onApply(tempFilters)
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
            .safeAreaInset(edge: .bottom) {
                resetButton
            }
        }
    }

    // MARK: - Budget Section

    private var budgetSection: some View {
        FilterSection(title: "Budget", icon: "eurosign.circle.fill") {
            VStack(spacing: 16) {
                // Price range display
                HStack {
                    Text("€\(tempFilters.minPrice ?? 0)")
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.Searcher.primary)

                    Spacer()

                    Text("€\(tempFilters.maxPrice ?? 3000)")
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.Searcher.primary)
                }

                // Min price slider
                VStack(alignment: .leading, spacing: 8) {
                    Text("Prix minimum")
                        .font(Theme.Typography.caption())
                        .foregroundColor(Theme.Colors.textSecondary)

                    Slider(
                        value: Binding(
                            get: { tempFilters.minPrice ?? 0 },
                            set: { tempFilters.minPrice = $0 }
                        ),
                        in: 0...2000,
                        step: 50
                    )
                    .tint(Theme.Colors.Searcher.primary)
                }

                // Max price slider
                VStack(alignment: .leading, spacing: 8) {
                    Text("Prix maximum")
                        .font(Theme.Typography.caption())
                        .foregroundColor(Theme.Colors.textSecondary)

                    Slider(
                        value: Binding(
                            get: { tempFilters.maxPrice ?? 3000 },
                            set: { tempFilters.maxPrice = $0 }
                        ),
                        in: 200...5000,
                        step: 50
                    )
                    .tint(Theme.Colors.Searcher.primary)
                }
            }
        }
    }

    // MARK: - Location Section

    private var locationSection: some View {
        FilterSection(title: "Localisation", icon: "location.fill") {
            VStack(alignment: .leading, spacing: 12) {
                Text("Villes")
                    .font(Theme.Typography.bodySmall(.medium))
                    .foregroundColor(Theme.Colors.textSecondary)

                FlowLayout(spacing: 8) {
                    ForEach(availableCities, id: \.self) { city in
                        CityChip(
                            city: city,
                            isSelected: tempFilters.cities.contains(city)
                        ) {
                            if tempFilters.cities.contains(city) {
                                tempFilters.cities.removeAll { $0 == city }
                            } else {
                                tempFilters.cities.append(city)
                            }
                        }
                    }
                }
            }
        }
    }

    private var availableCities: [String] {
        ["Bruxelles", "Paris", "Lyon", "Marseille", "Lille", "Bordeaux", "Toulouse", "Nice", "Nantes", "Strasbourg"]
    }

    // MARK: - Property Type Section

    private var propertyTypeSection: some View {
        FilterSection(title: "Type de bien", icon: "house.fill") {
            VStack(alignment: .leading, spacing: 12) {
                FlowLayout(spacing: 8) {
                    ForEach(PropertyType.allCases, id: \.self) { type in
                        PropertyTypeChip(
                            type: type,
                            isSelected: tempFilters.propertyTypes.contains(type)
                        ) {
                            if tempFilters.propertyTypes.contains(type) {
                                tempFilters.propertyTypes.removeAll { $0 == type }
                            } else {
                                tempFilters.propertyTypes.append(type)
                            }
                        }
                    }
                }
            }
        }
    }

    // MARK: - Rooms Section

    private var roomsSection: some View {
        FilterSection(title: "Chambres & Surface", icon: "bed.double.fill") {
            VStack(spacing: 16) {
                // Bedrooms
                HStack {
                    Text("Chambres minimum")
                        .font(Theme.Typography.body())
                        .foregroundColor(Theme.Colors.textPrimary)

                    Spacer()

                    Stepper(
                        "\(tempFilters.minBedrooms ?? 0)",
                        value: Binding(
                            get: { tempFilters.minBedrooms ?? 0 },
                            set: { tempFilters.minBedrooms = $0 > 0 ? $0 : nil }
                        ),
                        in: 0...10
                    )
                }

                Divider()

                // Surface
                HStack {
                    Text("Surface minimum")
                        .font(Theme.Typography.body())
                        .foregroundColor(Theme.Colors.textPrimary)

                    Spacer()

                    HStack(spacing: 4) {
                        TextField("0", value: Binding(
                            get: { tempFilters.minSurface ?? 0 },
                            set: { tempFilters.minSurface = $0 > 0 ? $0 : nil }
                        ), formatter: NumberFormatter())
                        .keyboardType(.numberPad)
                        .frame(width: 60)
                        .multilineTextAlignment(.trailing)
                        .padding(8)
                        .background(Theme.Colors.backgroundTertiary)
                        .cornerRadius(Theme.CornerRadius.md)

                        Text("m²")
                            .font(Theme.Typography.body())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }
                }
            }
        }
    }

    // MARK: - Amenities Section

    private var amenitiesSection: some View {
        FilterSection(title: "Équipements requis", icon: "sparkles") {
            FlowLayout(spacing: 8) {
                ForEach(popularAmenities, id: \.self) { amenity in
                    AmenityChip(
                        amenity: amenity,
                        isSelected: tempFilters.requiredAmenities.contains(amenity.rawValue)
                    ) {
                        if tempFilters.requiredAmenities.contains(amenity.rawValue) {
                            tempFilters.requiredAmenities.removeAll { $0 == amenity.rawValue }
                        } else {
                            tempFilters.requiredAmenities.append(amenity.rawValue)
                        }
                    }
                }
            }
        }
    }

    private var popularAmenities: [PropertyAmenity] {
        [.wifi, .parking, .washingMachine, .balcony, .airConditioning, .elevator, .gym, .dishwasher, .heating, .laundry]
    }

    // MARK: - Additional Options

    private var additionalOptionsSection: some View {
        FilterSection(title: "Options", icon: "slider.horizontal.3") {
            VStack(spacing: 16) {
                Toggle("Meublé uniquement", isOn: Binding(
                    get: { tempFilters.furnished ?? false },
                    set: { tempFilters.furnished = $0 ? true : nil }
                ))
                .tint(Theme.Colors.Searcher.primary)

                Divider()

                Toggle("Animaux acceptés", isOn: Binding(
                    get: { tempFilters.petsAllowed ?? false },
                    set: { tempFilters.petsAllowed = $0 ? true : nil }
                ))
                .tint(Theme.Colors.Searcher.primary)

                Divider()

                // Available from date (commented out - not in MatchFilters model)
                // HStack {
                //     Text("Disponible à partir du")
                //         .font(Theme.Typography.body())
                //         .foregroundColor(Theme.Colors.textPrimary)
                //
                //     Spacer()
                //
                //     DatePicker(
                //         "",
                //         selection: Binding(
                //             get: { tempFilters.availableFrom ?? Date() },
                //             set: { tempFilters.availableFrom = $0 }
                //         ),
                //         displayedComponents: .date
                //     )
                //     .labelsHidden()
                // }
            }
        }
    }

    // MARK: - Reset Button

    private var resetButton: some View {
        Button(action: {
            tempFilters = MatchFilters()
        }) {
            HStack(spacing: 8) {
                Image(systemName: "arrow.counterclockwise")
                Text("Réinitialiser les filtres")
            }
            .font(Theme.Typography.bodySmall(.medium))
            .foregroundColor(Theme.Colors.textSecondary)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
        }
        .background(Color.white)
    }
}

// MARK: - Filter Section

struct FilterSection<Content: View>: View {
    let title: String
    let icon: String
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 16))
                    .foregroundColor(Theme.Colors.Searcher.primary)

                Text(title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
            }

            content
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(Theme.CornerRadius.xl)
    }
}

// MARK: - City Chip

struct CityChip: View {
    let city: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(city)
                .font(Theme.Typography.bodySmall(.medium))
                .foregroundColor(isSelected ? .white : Theme.Colors.textPrimary)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(isSelected ? Theme.Colors.Searcher.primary : Theme.Colors.backgroundTertiary)
                .cornerRadius(Theme.CornerRadius.full)
        }
    }
}

// MARK: - Property Type Chip

struct PropertyTypeChip: View {
    let type: PropertyType
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Image(systemName: type.icon)
                    .font(.system(size: 12))
                Text(type.displayName)
                    .font(Theme.Typography.caption(.medium))
            }
            .foregroundColor(isSelected ? .white : Theme.Colors.textPrimary)
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(isSelected ? Theme.Colors.Searcher.primary : Theme.Colors.backgroundTertiary)
            .cornerRadius(Theme.CornerRadius.full)
        }
    }
}

// MARK: - Amenity Chip

struct AmenityChip: View {
    let amenity: PropertyAmenity
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Image(systemName: amenity.icon)
                    .font(.system(size: 12))
                Text(amenity.displayName)
                    .font(Theme.Typography.caption(.medium))
            }
            .foregroundColor(isSelected ? .white : Theme.Colors.textPrimary)
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(isSelected ? Theme.Colors.Searcher.primary : Theme.Colors.backgroundTertiary)
            .cornerRadius(Theme.CornerRadius.full)
            .overlay(
                RoundedRectangle(cornerRadius: Theme.CornerRadius.full)
                    .stroke(isSelected ? Theme.Colors.Searcher.primary : Theme.Colors.border, lineWidth: 1)
            )
        }
    }
}

// MARK: - Preview

#Preview {
    MatchFiltersView(filters: .constant(MatchFilters())) { _ in }
}
