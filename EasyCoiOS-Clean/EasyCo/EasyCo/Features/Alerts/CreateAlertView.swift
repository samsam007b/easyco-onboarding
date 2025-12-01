import SwiftUI

// MARK: - Create Alert View

struct CreateAlertView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var alertsManager = AlertsManager.shared

    // Form State
    @State private var selectedType: AlertType = .newProperty
    @State private var title: String = ""
    @State private var frequency: AlertFrequency = .instant

    // Criteria State
    @State private var selectedCities: Set<String> = []
    @State private var customCity: String = ""
    @State private var selectedPropertyTypes: Set<PropertyType> = []
    @State private var minPrice: String = ""
    @State private var maxPrice: String = ""
    @State private var minBedrooms: String = ""
    @State private var maxBedrooms: String = ""
    @State private var minSurfaceArea: String = ""
    @State private var selectedAmenities: Set<PropertyAmenity> = []
    @State private var furnished: Bool? = nil
    @State private var petsAllowed: Bool? = nil
    @State private var smokingAllowed: Bool? = nil

    // UI State
    @State private var isCreating = false
    @State private var showError = false
    @State private var errorMessage = ""
    @State private var showCityPicker = false

    // Available Options
    private let popularCities = ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille"]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Alert Type Section
                    alertTypeSection

                    // Basic Info Section
                    basicInfoSection

                    // Criteria Section
                    criteriaSection

                    // Frequency Section
                    frequencySection
                }
                .padding()
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("Créer une alerte")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") {
                        dismiss()
                    }
                    .foregroundColor(.secondary)
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Créer") {
                        Task {
                            await createAlert()
                        }
                    }
                    .fontWeight(.semibold)
                    .foregroundColor(Theme.Colors.primary)
                    .disabled(!isFormValid || isCreating)
                }
            }
            .alert("Erreur", isPresented: $showError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(errorMessage)
            }
            .sheet(isPresented: $showCityPicker) {
                CityPickerView(selectedCities: $selectedCities, cities: popularCities)
            }
        }
    }

    // MARK: - Alert Type Section

    private var alertTypeSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Type d'alerte")
                .font(.headline)
                .foregroundColor(.primary)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(AlertType.allCases, id: \.self) { type in
                        AlertTypeChip(
                            type: type,
                            isSelected: selectedType == type
                        ) {
                            selectedType = type
                            // Auto-fill title if empty
                            if title.isEmpty {
                                title = type.displayName
                            }
                        }
                    }
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    // MARK: - Basic Info Section

    private var basicInfoSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Informations")
                .font(.headline)
                .foregroundColor(.primary)

            VStack(spacing: 16) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Titre")
                        .font(.subheadline)
                        .foregroundColor(.secondary)

                    TextField("Ex: Studio à Paris < 900€", text: $title)
                        .textFieldStyle(.roundedBorder)
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    // MARK: - Criteria Section

    private var criteriaSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Critères de recherche")
                .font(.headline)
                .foregroundColor(.primary)

            VStack(spacing: 20) {
                // Cities
                citiesSelector

                // Property Types
                propertyTypesSelector

                // Price Range
                priceRangeInputs

                // Bedrooms
                bedroomsInputs

                // Surface Area
                surfaceAreaInput

                // Amenities
                amenitiesSelector

                // Other Preferences
                otherPreferences
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    private var citiesSelector: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("Villes")
                    .font(.subheadline)
                    .foregroundColor(.secondary)

                Spacer()

                Button("Sélectionner") {
                    showCityPicker = true
                }
                .font(.subheadline)
                .foregroundColor(Theme.Colors.primary)
            }

            if selectedCities.isEmpty {
                Text("Toutes les villes")
                    .font(.body)
                    .foregroundColor(.secondary)
                    .padding(.vertical, 8)
            } else {
                FlowLayout(spacing: 8) {
                    ForEach(Array(selectedCities), id: \.self) { city in
                        HStack(spacing: 4) {
                            Text(city)
                                .font(.subheadline)

                            Button(action: {
                                selectedCities.remove(city)
                            }) {
                                Image(systemName: "xmark.circle.fill")
                                    .font(.caption)
                            }
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Theme.Colors.primary.opacity(0.1))
                        .foregroundColor(Theme.Colors.primary)
                        .clipShape(Capsule())
                    }
                }
            }
        }
    }

    private var propertyTypesSelector: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Type de logement")
                .font(.subheadline)
                .foregroundColor(.secondary)

            FlowLayout(spacing: 8) {
                ForEach(PropertyType.allCases, id: \.self) { type in
                    FilterChip(
                        title: type.displayName,
                        isSelected: selectedPropertyTypes.contains(type)
                    ) {
                        if selectedPropertyTypes.contains(type) {
                            selectedPropertyTypes.remove(type)
                        } else {
                            selectedPropertyTypes.insert(type)
                        }
                    }
                }
            }
        }
    }

    private var priceRangeInputs: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Loyer mensuel")
                .font(.subheadline)
                .foregroundColor(.secondary)

            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Min")
                        .font(.caption)
                        .foregroundColor(.secondary)

                    HStack {
                        TextField("400", text: $minPrice)
                            .keyboardType(.numberPad)
                            .textFieldStyle(.roundedBorder)

                        Text("€")
                            .foregroundColor(.secondary)
                    }
                }

                Text("—")
                    .foregroundColor(.secondary)
                    .padding(.top, 20)

                VStack(alignment: .leading, spacing: 4) {
                    Text("Max")
                        .font(.caption)
                        .foregroundColor(.secondary)

                    HStack {
                        TextField("1200", text: $maxPrice)
                            .keyboardType(.numberPad)
                            .textFieldStyle(.roundedBorder)

                        Text("€")
                            .foregroundColor(.secondary)
                    }
                }
            }
        }
    }

    private var bedroomsInputs: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Nombre de chambres")
                .font(.subheadline)
                .foregroundColor(.secondary)

            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Min")
                        .font(.caption)
                        .foregroundColor(.secondary)

                    TextField("1", text: $minBedrooms)
                        .keyboardType(.numberPad)
                        .textFieldStyle(.roundedBorder)
                }

                Text("—")
                    .foregroundColor(.secondary)
                    .padding(.top, 20)

                VStack(alignment: .leading, spacing: 4) {
                    Text("Max")
                        .font(.caption)
                        .foregroundColor(.secondary)

                    TextField("3", text: $maxBedrooms)
                        .keyboardType(.numberPad)
                        .textFieldStyle(.roundedBorder)
                }
            }
        }
    }

    private var surfaceAreaInput: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Surface minimale")
                .font(.subheadline)
                .foregroundColor(.secondary)

            HStack {
                TextField("20", text: $minSurfaceArea)
                    .keyboardType(.numberPad)
                    .textFieldStyle(.roundedBorder)

                Text("m²")
                    .foregroundColor(.secondary)
            }
        }
    }

    private var amenitiesSelector: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Équipements requis")
                .font(.subheadline)
                .foregroundColor(.secondary)

            FlowLayout(spacing: 8) {
                ForEach(PropertyAmenity.allCases.prefix(10), id: \.self) { amenity in
                    FilterChip(
                        title: amenity.displayName,
                        isSelected: selectedAmenities.contains(amenity)
                    ) {
                        if selectedAmenities.contains(amenity) {
                            selectedAmenities.remove(amenity)
                        } else {
                            selectedAmenities.insert(amenity)
                        }
                    }
                }
            }
        }
    }

    private var otherPreferences: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Autres préférences")
                .font(.subheadline)
                .foregroundColor(.secondary)

            VStack(spacing: 8) {
                PreferenceToggle(
                    title: "Meublé",
                    value: $furnished
                )

                PreferenceToggle(
                    title: "Animaux acceptés",
                    value: $petsAllowed
                )

                PreferenceToggle(
                    title: "Fumeurs acceptés",
                    value: $smokingAllowed
                )
            }
        }
    }

    // MARK: - Frequency Section

    private var frequencySection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Fréquence de notification")
                .font(.headline)
                .foregroundColor(.primary)

            VStack(spacing: 12) {
                ForEach(AlertFrequency.allCases, id: \.self) { freq in
                    Button(action: {
                        frequency = freq
                    }) {
                        HStack {
                            Image(systemName: frequency == freq ? "checkmark.circle.fill" : "circle")
                                .foregroundColor(frequency == freq ? Theme.Colors.primary : .secondary)

                            Text(freq.displayName)
                                .foregroundColor(.primary)

                            Spacer()
                        }
                        .padding()
                        .background(
                            RoundedRectangle(cornerRadius: 12)
                                .strokeBorder(frequency == freq ? Theme.Colors.primary : Color.secondary.opacity(0.3), lineWidth: 2)
                        )
                    }
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    // MARK: - Validation

    private var isFormValid: Bool {
        !title.trimmingCharacters(in: .whitespaces).isEmpty
    }

    // MARK: - Actions

    private func createAlert() async {
        isCreating = true

        // Build criteria
        let criteria = AlertCriteria(
            cities: selectedCities.isEmpty ? nil : Array(selectedCities),
            neighborhoods: nil,
            radius: nil,
            propertyTypes: selectedPropertyTypes.isEmpty ? nil : Array(selectedPropertyTypes),
            minPrice: Double(minPrice),
            maxPrice: Double(maxPrice),
            minBedrooms: Int(minBedrooms),
            maxBedrooms: Int(maxBedrooms),
            minSurfaceArea: Double(minSurfaceArea),
            requiredAmenities: selectedAmenities.isEmpty ? nil : Array(selectedAmenities),
            availableFrom: nil,
            minimumStay: nil,
            maximumStay: nil,
            furnished: furnished,
            petsAllowed: petsAllowed,
            smokingAllowed: smokingAllowed
        )

        let success = await alertsManager.createAlert(
            type: selectedType,
            title: title,
            criteria: criteria,
            frequency: frequency
        )

        isCreating = false

        if success {
            dismiss()
        } else {
            errorMessage = "Impossible de créer l'alerte. Veuillez réessayer."
            showError = true
        }
    }
}

// MARK: - Alert Type Chip

struct AlertTypeChip: View {
    let type: AlertType
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: type.icon)
                    .font(.title2)
                    .foregroundColor(isSelected ? .white : Color(hex: type.color))

                Text(type.displayName)
                    .font(.caption)
                    .foregroundColor(isSelected ? .white : .primary)
                    .multilineTextAlignment(.center)
            }
            .frame(width: 100, height: 80)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(isSelected ? Color(hex: type.color) : Color(.systemBackground))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .strokeBorder(isSelected ? Color(hex: type.color) : Color.secondary.opacity(0.3), lineWidth: 2)
            )
        }
    }
}

// MARK: - Preference Toggle

struct PreferenceToggle: View {
    let title: String
    @Binding var value: Bool?

    var body: some View {
        HStack {
            Text(title)
                .foregroundColor(.primary)

            Spacer()

            HStack(spacing: 8) {
                Button(action: {
                    value = value == true ? nil : true
                }) {
                    Text("Oui")
                        .font(.subheadline)
                        .fontWeight(value == true ? .semibold : .regular)
                        .foregroundColor(value == true ? .white : .primary)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 6)
                        .background(
                            RoundedRectangle(cornerRadius: 8)
                                .fill(value == true ? Theme.Colors.primary : Color(.systemGray5))
                        )
                }

                Button(action: {
                    value = value == false ? nil : false
                }) {
                    Text("Non")
                        .font(.subheadline)
                        .fontWeight(value == false ? .semibold : .regular)
                        .foregroundColor(value == false ? .white : .primary)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 6)
                        .background(
                            RoundedRectangle(cornerRadius: 8)
                                .fill(value == false ? Theme.Colors.primary : Color(.systemGray5))
                        )
                }

                Button(action: {
                    value = nil
                }) {
                    Text("Peu importe")
                        .font(.subheadline)
                        .fontWeight(value == nil ? .semibold : .regular)
                        .foregroundColor(value == nil ? .white : .primary)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 6)
                        .background(
                            RoundedRectangle(cornerRadius: 8)
                                .fill(value == nil ? Theme.Colors.primary : Color(.systemGray5))
                        )
                }
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }
}

// MARK: - City Picker View

struct CityPickerView: View {
    @Environment(\.dismiss) private var dismiss
    @Binding var selectedCities: Set<String>
    let cities: [String]

    @State private var searchText = ""

    var filteredCities: [String] {
        if searchText.isEmpty {
            return cities
        } else {
            return cities.filter { $0.localizedCaseInsensitiveContains(searchText) }
        }
    }

    var body: some View {
        NavigationStack {
            List {
                ForEach(filteredCities, id: \.self) { city in
                    Button(action: {
                        if selectedCities.contains(city) {
                            selectedCities.remove(city)
                        } else {
                            selectedCities.insert(city)
                        }
                    }) {
                        HStack {
                            Text(city)
                                .foregroundColor(.primary)

                            Spacer()

                            if selectedCities.contains(city) {
                                Image(systemName: "checkmark")
                                    .foregroundColor(Theme.Colors.primary)
                            }
                        }
                    }
                }
            }
            .searchable(text: $searchText, prompt: "Rechercher une ville")
            .navigationTitle("Sélectionner des villes")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Terminé") {
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
        }
    }
}

// FlowLayout is defined in Components/Common/FormComponents.swift

// MARK: - Preview

#Preview {
    CreateAlertView()
}
