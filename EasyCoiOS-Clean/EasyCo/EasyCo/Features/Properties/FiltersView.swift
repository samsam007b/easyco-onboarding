//
//  FiltersView.swift
//  EasyCo
//
//  Advanced filters view for property search
//

import SwiftUI

// MARK: - Property Filters Model

struct PropertyFilters {
    var minPrice: Double = 0
    var maxPrice: Double = 2000
    var propertyType: PropertyType = .apartment
    var bedrooms: Int = 0
    var bathrooms: Int = 0
    var amenities: Set<Amenity> = []
    var availableFrom: Date?
    var maxDistance: Double = 10 // km

    enum PropertyType: String, CaseIterable {
        case apartment = "Appartement"
        case studio = "Studio"
        case house = "Maison"
        case shared = "Colocation"
    }

    enum Amenity: String, CaseIterable, Identifiable {
        case furnished = "Meublé"
        case kitchen = "Cuisine équipée"
        case balcony = "Balcon"
        case parking = "Parking"
        case pets = "Animaux acceptés"
        case garden = "Jardin"
        case elevator = "Ascenseur"
        case wifi = "WiFi inclus"

        var id: String { rawValue }

        var icon: String {
            switch self {
            case .furnished: return "home"
            case .kitchen: return "chef-hat"
            case .balcony: return "sun"
            case .parking: return "car"
            case .pets: return "dog"
            case .garden: return "tree"
            case .elevator: return "arrow-up"
            case .wifi: return "wifi"
            }
        }
    }

    var activeCount: Int {
        var count = 0
        if minPrice > 0 { count += 1 }
        if maxPrice < 2000 { count += 1 }
        if bedrooms > 0 { count += 1 }
        if bathrooms > 0 { count += 1 }
        count += amenities.count
        if availableFrom != nil { count += 1 }
        if maxDistance < 10 { count += 1 }
        return count
    }
}

// MARK: - Filters View

struct FiltersView: View {
    @Binding var isPresented: Bool
    @Binding var filters: PropertyFilters
    @State private var tempFilters: PropertyFilters

    init(isPresented: Binding<Bool>, filters: Binding<PropertyFilters>) {
        self._isPresented = isPresented
        self._filters = filters
        self._tempFilters = State(initialValue: filters.wrappedValue)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 32) {
                    // Price Range
                    priceSection

                    Divider()

                    // Property Type
                    propertyTypeSection

                    Divider()

                    // Rooms
                    roomsSection

                    Divider()

                    // Amenities
                    amenitiesSection

                    Divider()

                    // Availability
                    availabilitySection

                    Divider()

                    // Distance
                    distanceSection
                }
                .padding(Theme.Spacing.xl)
                .padding(.bottom, 100) // Space for sticky footer
            }
            .background(Theme.Colors.backgroundSecondary)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Filtres")
                        .font(Theme.Typography.title3())
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Réinitialiser") {
                        resetFilters()
                    }
                    .font(Theme.Typography.body(.medium))
                    .foregroundColor(Theme.Colors.primary)
                }
            }
            .safeAreaInset(edge: .bottom) {
                bottomBar
            }
        }
    }

    // MARK: - Price Section

    private var priceSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Budget mensuel")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            VStack(spacing: 12) {
                HStack {
                    Text("\(Int(tempFilters.minPrice))€")
                        .font(Theme.Typography.bodyLarge(.semibold))
                        .foregroundColor(Theme.Colors.primary)

                    Spacer()

                    Text("\(Int(tempFilters.maxPrice))€")
                        .font(Theme.Typography.bodyLarge(.semibold))
                        .foregroundColor(Theme.Colors.primary)
                }

                // Dual range slider simulation (simplified)
                VStack(spacing: 8) {
                    HStack {
                        Text("Min")
                            .font(Theme.Typography.caption())
                            .foregroundColor(Theme.Colors.textSecondary)
                        Slider(value: $tempFilters.minPrice, in: 0...tempFilters.maxPrice, step: 50)
                            .accentColor(Theme.Colors.primary)
                    }

                    HStack {
                        Text("Max")
                            .font(Theme.Typography.caption())
                            .foregroundColor(Theme.Colors.textSecondary)
                        Slider(value: $tempFilters.maxPrice, in: tempFilters.minPrice...3000, step: 50)
                            .accentColor(Theme.Colors.primary)
                    }
                }
            }
            .padding(Theme.Spacing.lg)
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.card)
        }
    }

    // MARK: - Property Type Section

    private var propertyTypeSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Type de logement")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            VStack(spacing: 12) {
                ForEach(PropertyFilters.PropertyType.allCases, id: \.self) { type in
                    PropertyTypeRow(
                        type: type,
                        isSelected: tempFilters.propertyType == type,
                        action: {
                            tempFilters.propertyType = type
                            Haptic.selection()
                        }
                    )
                }
            }
        }
    }

    // MARK: - Rooms Section

    private var roomsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Chambres & Salles de bain")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            VStack(spacing: 16) {
                StepperRow(
                    title: "Chambres",
                    icon: "bed",
                    value: $tempFilters.bedrooms,
                    range: 0...5
                )

                StepperRow(
                    title: "Salles de bain",
                    icon: "bath",
                    value: $tempFilters.bathrooms,
                    range: 0...3
                )
            }
        }
    }

    // MARK: - Amenities Section

    private var amenitiesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Équipements")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 12) {
                ForEach(PropertyFilters.Amenity.allCases) { amenity in
                    AmenityChip(
                        amenity: amenity,
                        isSelected: tempFilters.amenities.contains(amenity),
                        action: {
                            if tempFilters.amenities.contains(amenity) {
                                tempFilters.amenities.remove(amenity)
                            } else {
                                tempFilters.amenities.insert(amenity)
                            }
                            Haptic.selection()
                        }
                    )
                }
            }
        }
    }

    // MARK: - Availability Section

    private var availabilitySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Disponibilité")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            DatePicker(
                "Disponible à partir du",
                selection: Binding(
                    get: { tempFilters.availableFrom ?? Date() },
                    set: { tempFilters.availableFrom = $0 }
                ),
                displayedComponents: .date
            )
            .datePickerStyle(.compact)
            .accentColor(Theme.Colors.primary)
            .padding(Theme.Spacing.lg)
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.card)
        }
    }

    // MARK: - Distance Section

    private var distanceSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Distance maximale")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            VStack(spacing: 12) {
                HStack {
                    Image.lucide("map-pin")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)
                        .foregroundColor(Theme.Colors.primary)

                    Text("Rayon de \(Int(tempFilters.maxDistance)) km")
                        .font(Theme.Typography.bodyLarge(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Spacer()
                }

                Slider(value: $tempFilters.maxDistance, in: 1...20, step: 1)
                    .accentColor(Theme.Colors.primary)
            }
            .padding(Theme.Spacing.lg)
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.card)
        }
    }

    // MARK: - Bottom Bar

    private var bottomBar: some View {
        HStack(spacing: 12) {
            SecondaryButton(
                title: "Annuler",
                icon: nil,
                action: {
                    isPresented = false
                },
                fullWidth: false
            )
            .frame(width: 120)

            PrimaryButton(
                title: "Voir les résultats",
                icon: nil,
                action: applyFilters
            )
        }
        .padding()
        .background(.ultraThinMaterial)
        .overlay(
            Divider()
                .background(Theme.Colors.gray200),
            alignment: .top
        )
    }

    // MARK: - Actions

    private func applyFilters() {
        filters = tempFilters
        isPresented = false
        Haptic.notification(.success)
    }

    private func resetFilters() {
        tempFilters = PropertyFilters()
        Haptic.impact(.light)
    }
}

// MARK: - Supporting Views

struct PropertyTypeRow: View {
    let type: PropertyFilters.PropertyType
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack {
                Text(type.rawValue)
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                if isSelected {
                    Image.lucide("check")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)
                        .foregroundColor(Theme.Colors.primary)
                }
            }
            .padding(Theme.Spacing.lg)
            .background(isSelected ? Theme.Colors.primary.opacity(0.1) : Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.md)
            .overlay(
                RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                    .stroke(isSelected ? Theme.Colors.primary : Color.clear, lineWidth: 2)
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct StepperRow: View {
    let title: String
    let icon: String
    @Binding var value: Int
    let range: ClosedRange<Int>

    var body: some View {
        HStack {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 24, height: 24)
                .foregroundColor(Theme.Colors.primary)

            Text(title)
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textPrimary)

            Spacer()

            HStack(spacing: 12) {
                Button(action: {
                    if value > range.lowerBound {
                        value -= 1
                        Haptic.selection()
                    }
                }) {
                    Image(systemName: "minus.circle.fill")
                        .font(.system(size: 28))
                        .foregroundColor(value > range.lowerBound ? Theme.Colors.primary : Theme.Colors.gray300)
                }
                .disabled(value <= range.lowerBound)

                Text("\(value)")
                    .font(Theme.Typography.bodyLarge(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .frame(minWidth: 30)

                Button(action: {
                    if value < range.upperBound {
                        value += 1
                        Haptic.selection()
                    }
                }) {
                    Image(systemName: "plus.circle.fill")
                        .font(.system(size: 28))
                        .foregroundColor(value < range.upperBound ? Theme.Colors.primary : Theme.Colors.gray300)
                }
                .disabled(value >= range.upperBound)
            }
        }
        .padding(Theme.Spacing.lg)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.md)
    }
}

struct AmenityChip: View {
    let amenity: PropertyFilters.Amenity
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image.lucide(amenity.icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 24, height: 24)
                    .foregroundColor(isSelected ? .white : Theme.Colors.primary)

                Text(amenity.rawValue)
                    .font(Theme.Typography.caption(.semibold))
                    .foregroundColor(isSelected ? .white : Theme.Colors.textPrimary)
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .padding(.horizontal, 8)
            .background(
                isSelected ? Theme.Colors.primaryGradient : LinearGradient(colors: [Theme.Colors.backgroundPrimary], startPoint: .top, endPoint: .bottom)
            )
            .cornerRadius(Theme.CornerRadius.md)
            .overlay(
                RoundedRectangle(cornerRadius: Theme.CornerRadius.md)
                    .stroke(isSelected ? Color.clear : Theme.Colors.gray200, lineWidth: 1)
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Preview

struct FiltersView_Previews: PreviewProvider {
    static var previews: some View {
        FiltersView(
            isPresented: .constant(true),
            filters: .constant(PropertyFilters())
        )
    }
}
