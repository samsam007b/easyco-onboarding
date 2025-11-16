import SwiftUI

// MARK: - Filters View

struct FiltersView: View {
    @ObservedObject var viewModel: PropertiesViewModel
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            Form {
                // City
                Section("Localisation") {
                    TextField("Ville", text: Binding(
                        get: { viewModel.filters.city ?? "" },
                        set: { viewModel.filters.city = $0.isEmpty ? nil : $0 }
                    ))
                }

                // Price Range
                Section("Budget") {
                    HStack {
                        TextField("Min", value: Binding(
                            get: { viewModel.filters.minPrice },
                            set: { viewModel.filters.minPrice = $0 }
                        ), format: .number)
                        .keyboardType(.numberPad)

                        Text("—")

                        TextField("Max", value: Binding(
                            get: { viewModel.filters.maxPrice },
                            set: { viewModel.filters.maxPrice = $0 }
                        ), format: .number)
                        .keyboardType(.numberPad)
                    }
                }

                // Property Type
                Section("Type de propriété") {
                    Picker("Type", selection: Binding(
                        get: { viewModel.filters.propertyType },
                        set: { viewModel.filters.propertyType = $0 }
                    )) {
                        Text("Tous").tag(nil as PropertyType?)
                        ForEach([PropertyType.apartment, .house, .studio, .room], id: \.self) { type in
                            Text(type.displayName).tag(type as PropertyType?)
                        }
                    }
                }

                // Rooms
                Section("Nombre de chambres") {
                    Stepper(value: Binding(
                        get: { viewModel.filters.minRooms ?? 0 },
                        set: { viewModel.filters.minRooms = $0 == 0 ? nil : $0 }
                    ), in: 0...10) {
                        Text("\(viewModel.filters.minRooms ?? 0) minimum")
                    }
                }

                // Amenities
                Section("Équipements") {
                    ForEach(Array(Amenity.allCases.prefix(6)), id: \.self) { amenity in
                        Toggle(amenity.displayName, isOn: Binding(
                            get: { viewModel.filters.amenities?.contains(amenity) ?? false },
                            set: { isSelected in
                                if isSelected {
                                    if viewModel.filters.amenities == nil {
                                        viewModel.filters.amenities = []
                                    }
                                    viewModel.filters.amenities?.append(amenity)
                                } else {
                                    viewModel.filters.amenities?.removeAll { $0 == amenity }
                                }
                            }
                        ))
                    }
                }
            }
            .navigationTitle("Filtres")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Réinitialiser") {
                        Task {
                            await viewModel.clearFilters()
                        }
                    }
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Appliquer") {
                        Task {
                            await viewModel.applyFilters()
                            dismiss()
                        }
                    }
                    .fontWeight(.semibold)
                }
            }
        }
    }
}
