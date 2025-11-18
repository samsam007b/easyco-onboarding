import SwiftUI

// MARK: - Filters View (Complete Web App Replica)

struct FiltersView: View {
    @ObservedObject var viewModel: PropertiesViewModel
    @Environment(\.dismiss) private var dismiss
    @State private var expandedSections: Set<FilterSection> = []

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 16) {
                    // Budget
                    FilterAccordion(
                        title: "Budget Mensuel",
                        icon: "eurosign",
                        isExpanded: expandedSections.contains(.budget)
                    ) {
                        toggleSection(.budget)
                    } content: {
                        budgetSection
                    }

                    // Location
                    FilterAccordion(
                        title: "Localisation",
                        icon: "mappin",
                        isExpanded: expandedSections.contains(.location)
                    ) {
                        toggleSection(.location)
                    } content: {
                        locationSection
                    }

                    // Property Type
                    FilterAccordion(
                        title: "Type de logement",
                        icon: "house",
                        isExpanded: expandedSections.contains(.propertyType)
                    ) {
                        toggleSection(.propertyType)
                    } content: {
                        propertyTypeSection
                    }

                    // Rooms
                    FilterAccordion(
                        title: "Chambres & Salles de bain",
                        icon: "bed.double",
                        isExpanded: expandedSections.contains(.rooms)
                    ) {
                        toggleSection(.rooms)
                    } content: {
                        roomsSection
                    }

                    // Amenities
                    FilterAccordion(
                        title: "Équipements",
                        icon: "star",
                        isExpanded: expandedSections.contains(.amenities)
                    ) {
                        toggleSection(.amenities)
                    } content: {
                        amenitiesSection
                    }
                }
                .padding(16)
                .padding(.bottom, 100) // Space for bottom buttons
            }
            .background(Color(hex: "F9FAFB"))
            .navigationTitle("Filtres")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Réinitialiser") {
                        viewModel.clearFilters()
                    }
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(Color(hex: "FFA040"))
                }
            }
            .safeAreaInset(edge: .bottom) {
                bottomButtons
            }
        }
        .onAppear {
            // Expand budget by default
            expandedSections.insert(.budget)
        }
    }

    // MARK: - Budget Section

    private var budgetSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Range labels
            HStack {
                Text("€\(Int(viewModel.filters.minPrice))")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                Text("€\(Int(viewModel.filters.maxPrice))")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
            }

            // Min slider
            VStack(alignment: .leading, spacing: 8) {
                Text("Minimum")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "6B7280"))

                Slider(
                    value: Binding(
                        get: { Double(viewModel.filters.minPrice) },
                        set: { viewModel.filters.minPrice = Int($0) }
                    ),
                    in: 0...5000,
                    step: 50
                )
                .accentColor(Color(hex: "FFA040"))
            }

            // Max slider
            VStack(alignment: .leading, spacing: 8) {
                Text("Maximum")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "6B7280"))

                Slider(
                    value: Binding(
                        get: { Double(viewModel.filters.maxPrice) },
                        set: { viewModel.filters.maxPrice = Int($0) }
                    ),
                    in: 0...5000,
                    step: 50
                )
                .accentColor(Color(hex: "FFA040"))
            }
        }
        .padding(16)
    }

    // MARK: - Location Section

    private var locationSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            let cities = ["Bruxelles", "Ixelles", "Etterbeek", "Saint-Gilles", "Schaerbeek", "Molenbeek", "Anderlecht", "Uccle", "Forest", "Jette"]

            FlowLayout(spacing: 8) {
                ForEach(cities, id: \.self) { city in
                    FilterBadge(
                        title: city,
                        isSelected: viewModel.filters.cities.contains(city)
                    ) {
                        if viewModel.filters.cities.contains(city) {
                            viewModel.filters.cities.removeAll { $0 == city }
                        } else {
                            viewModel.filters.cities.append(city)
                        }
                    }
                }
            }
        }
        .padding(16)
    }

    // MARK: - Property Type Section

    private var propertyTypeSection: some View {
        VStack(spacing: 12) {
            ForEach([PropertyType.apartment, .house, .studio, .coliving, .privateRoom], id: \.self) { type in
                Button(action: {
                    if viewModel.filters.propertyTypes.contains(type) {
                        viewModel.filters.propertyTypes.removeAll { $0 == type }
                    } else {
                        viewModel.filters.propertyTypes.append(type)
                    }
                }) {
                    HStack {
                        Image(systemName: type.icon)
                            .font(.system(size: 18))
                            .foregroundColor(viewModel.filters.propertyTypes.contains(type) ? Color(hex: "FFA040") : Color(hex: "6B7280"))

                        Text(type.displayName)
                            .font(.system(size: 15))
                            .foregroundColor(viewModel.filters.propertyTypes.contains(type) ? Color(hex: "FFA040") : Color(hex: "374151"))

                        Spacer()

                        if viewModel.filters.propertyTypes.contains(type) {
                            Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 20))
                                .foregroundColor(Color(hex: "FFA040"))
                        } else {
                            Image(systemName: "circle")
                                .font(.system(size: 20))
                                .foregroundColor(Color(hex: "D1D5DB"))
                        }
                    }
                    .padding(16)
                    .background(viewModel.filters.propertyTypes.contains(type) ? Color(hex: "FFF4ED") : Color.white)
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(viewModel.filters.propertyTypes.contains(type) ? Color(hex: "FFA040") : Color(hex: "E5E7EB"), lineWidth: 1)
                    )
                }
            }
        }
        .padding(16)
    }

    // MARK: - Rooms Section

    private var roomsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Bedrooms
            VStack(alignment: .leading, spacing: 12) {
                Text("Chambres")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))

                HStack(spacing: 8) {
                    ForEach(1...5, id: \.self) { count in
                        Button(action: {
                            viewModel.filters.minBedrooms = count
                        }) {
                            Text("\(count)\(count == 5 ? "+" : "")")
                                .font(.system(size: 15, weight: .medium))
                                .foregroundColor(viewModel.filters.minBedrooms == count ? .white : Color(hex: "374151"))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 12)
                                .background(viewModel.filters.minBedrooms == count ? Color(hex: "FFA040") : Color.white)
                                .cornerRadius(8)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(viewModel.filters.minBedrooms == count ? Color(hex: "FFA040") : Color(hex: "E5E7EB"), lineWidth: 1)
                                )
                        }
                    }
                }
            }

            // Bathrooms
            VStack(alignment: .leading, spacing: 12) {
                Text("Salles de bain")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))

                HStack(spacing: 8) {
                    ForEach(1...3, id: \.self) { count in
                        Button(action: {
                            viewModel.filters.minBathrooms = count
                        }) {
                            Text("\(count)\(count == 3 ? "+" : "")")
                                .font(.system(size: 15, weight: .medium))
                                .foregroundColor(viewModel.filters.minBathrooms == count ? .white : Color(hex: "374151"))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 12)
                                .background(viewModel.filters.minBathrooms == count ? Color(hex: "FFA040") : Color.white)
                                .cornerRadius(8)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(viewModel.filters.minBathrooms == count ? Color(hex: "FFA040") : Color(hex: "E5E7EB"), lineWidth: 1)
                                )
                        }
                    }
                }
            }

            // Furnished toggle
            Toggle(isOn: Binding(
                get: { viewModel.filters.furnished ?? false },
                set: { viewModel.filters.furnished = $0 }
            )) {
                Text("Meublé")
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "374151"))
            }
            .tint(Color(hex: "FFA040"))
        }
        .padding(16)
    }

    // MARK: - Amenities Section

    private var amenitiesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            let amenities: [PropertyAmenity] = [.wifi, .parking, .balcony, .garden, .elevator, .washingMachine, .dishwasher, .dryer, .airConditioning, .heating]

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                ForEach(amenities, id: \.self) { amenity in
                    Button(action: {
                        if viewModel.filters.amenities.contains(amenity) {
                            viewModel.filters.amenities.removeAll { $0 == amenity }
                        } else {
                            viewModel.filters.amenities.append(amenity)
                        }
                    }) {
                        HStack(spacing: 8) {
                            Image(systemName: amenity.icon)
                                .font(.system(size: 16))
                                .foregroundColor(viewModel.filters.amenities.contains(amenity) ? Color(hex: "FFA040") : Color(hex: "6B7280"))

                            Text(amenity.displayName)
                                .font(.system(size: 13))
                                .foregroundColor(viewModel.filters.amenities.contains(amenity) ? Color(hex: "FFA040") : Color(hex: "374151"))

                            Spacer()

                            if viewModel.filters.amenities.contains(amenity) {
                                Image(systemName: "checkmark")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(Color(hex: "FFA040"))
                            }
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 10)
                        .background(viewModel.filters.amenities.contains(amenity) ? Color(hex: "FFF4ED") : Color.white)
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(viewModel.filters.amenities.contains(amenity) ? Color(hex: "FFA040") : Color(hex: "E5E7EB"), lineWidth: 1)
                        )
                    }
                }
            }
        }
        .padding(16)
    }

    // MARK: - Bottom Buttons

    private var bottomButtons: some View {
        HStack(spacing: 12) {
            // Clear button
            Button(action: {
                viewModel.clearFilters()
            }) {
                Text("Effacer")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "6B7280"))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Color.white)
                    .cornerRadius(999)
                    .overlay(
                        RoundedRectangle(cornerRadius: 999)
                            .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                    )
            }

            // Apply button
            Button(action: {
                _Concurrency.Task {
                    await viewModel.applyFilters()
                }
                dismiss()
            }) {
                HStack(spacing: 8) {
                    Text("Voir")
                        .font(.system(size: 16, weight: .semibold))

                    Text("\(viewModel.filteredProperties.count)")
                        .font(.system(size: 16, weight: .bold))

                    Text("résultats")
                        .font(.system(size: 16, weight: .semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "FFA040"), Color(hex: "FFB85C"), Color(hex: "FFD080")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(999)
                .shadow(color: Color(hex: "FFA040").opacity(0.3), radius: 8, x: 0, y: 4)
            }
        }
        .padding(16)
        .background(Color.white)
        .shadow(color: .black.opacity(0.05), radius: 10, x: 0, y: -5)
    }

    // MARK: - Helpers

    private func toggleSection(_ section: FilterSection) {
        withAnimation(.easeInOut(duration: 0.3)) {
            if expandedSections.contains(section) {
                expandedSections.remove(section)
            } else {
                expandedSections.insert(section)
            }
        }
    }
}

// MARK: - Filter Section Enum

enum FilterSection: Hashable {
    case budget
    case location
    case propertyType
    case rooms
    case amenities
}

// MARK: - Filter Accordion Component

struct FilterAccordion<Content: View>: View {
    let title: String
    let icon: String
    let isExpanded: Bool
    let onTap: () -> Void
    @ViewBuilder let content: Content

    var body: some View {
        VStack(spacing: 0) {
            // Header
            Button(action: onTap) {
                HStack {
                    Image(systemName: icon)
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "FFA040"))

                    Text(title)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    Spacer()

                    Image(systemName: "chevron.down")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Color(hex: "6B7280"))
                        .rotationEffect(.degrees(isExpanded ? 180 : 0))
                }
                .padding(16)
            }

            // Content
            if isExpanded {
                content
                    .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Filter Badge Component

struct FilterBadge: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(isSelected ? .white : Color(hex: "374151"))
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(isSelected ? Color(hex: "FFA040") : Color(hex: "F3F4F6"))
                .cornerRadius(999)
        }
    }
}

// MARK: - Flow Layout (for wrapping badges)

struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let result = FlowResult(in: proposal.replacingUnspecifiedDimensions().width, subviews: subviews, spacing: spacing)
        return result.size
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let result = FlowResult(in: bounds.width, subviews: subviews, spacing: spacing)
        for (index, subview) in subviews.enumerated() {
            subview.place(at: CGPoint(x: bounds.minX + result.positions[index].x, y: bounds.minY + result.positions[index].y), proposal: .unspecified)
        }
    }

    struct FlowResult {
        var size: CGSize = .zero
        var positions: [CGPoint] = []

        init(in maxWidth: CGFloat, subviews: Subviews, spacing: CGFloat) {
            var x: CGFloat = 0
            var y: CGFloat = 0
            var lineHeight: CGFloat = 0

            for subview in subviews {
                let size = subview.sizeThatFits(.unspecified)

                if x + size.width > maxWidth, x > 0 {
                    x = 0
                    y += lineHeight + spacing
                    lineHeight = 0
                }

                positions.append(CGPoint(x: x, y: y))
                lineHeight = max(lineHeight, size.height)
                x += size.width + spacing
            }

            self.size = CGSize(width: maxWidth, height: y + lineHeight)
        }
    }
}

// MARK: - Preview

struct FiltersView_Previews: PreviewProvider {
    static var previews: some View {
        FiltersView(viewModel: PropertiesViewModel())
    }
}
