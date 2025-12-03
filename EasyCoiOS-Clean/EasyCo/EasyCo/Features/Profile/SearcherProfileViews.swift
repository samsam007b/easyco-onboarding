import SwiftUI

// MARK: - Searcher Lifestyle Questionnaire

struct SearcherLifestyleView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var viewModel = SearcherLifestyleViewModel()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    VStack(spacing: 12) {
                        Image(systemName: "person.2.fill")
                            .font(.system(size: 48))
                            .foregroundColor(Color(hex: "FFA040"))

                        Text("Mon Style de Vie")
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(Color(hex: "111827"))

                        Text("Ces informations nous aident à trouver des colocataires compatibles avec vous")
                            .font(.system(size: 15))
                            .foregroundColor(Color(hex: "6B7280"))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 32)
                    }
                    .padding(.top, 24)

                    // Questionnaire Sections
                    VStack(spacing: 20) {
                        lifestyleSection
                        scheduleSection
                        socialSection
                        cleanlinessSection
                        petsSection
                        smokingSection
                    }
                    .padding(.horizontal, 16)

                    // Save Button
                    Button(action: {
                        viewModel.saveLifestyle()
                        dismiss()
                    }) {
                        Text("Enregistrer mes préférences")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(
                                LinearGradient(
                                    colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(16)
                            .shadow(color: Color(hex: "FFA040").opacity(0.3), radius: 8, x: 0, y: 4)
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 8)
                    .padding(.bottom, 32)
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
            }
        }
    }

    // MARK: - Lifestyle Section

    private var lifestyleSection: some View {
        QuestionCard(
            icon: "sun.max.fill",
            title: "Rythme de vie",
            color: Color(hex: "FBBF24")
        ) {
            VStack(spacing: 12) {
                OptionButton(
                    title: "Lève-tôt",
                    description: "Je me lève avant 7h",
                    isSelected: viewModel.lifestyle.isEarlyBird,
                    action: { viewModel.lifestyle.isEarlyBird.toggle() }
                )

                OptionButton(
                    title: "Couche-tard",
                    description: "Je me couche après minuit",
                    isSelected: viewModel.lifestyle.isNightOwl,
                    action: { viewModel.lifestyle.isNightOwl.toggle() }
                )
            }
        }
    }

    // MARK: - Schedule Section

    private var scheduleSection: some View {
        QuestionCard(
            icon: "calendar.badge.clock",
            title: "Occupation",
            color: Color(hex: "6E56CF")
        ) {
            VStack(spacing: 8) {
                ForEach(OccupationType.allCases, id: \.self) { occupation in
                    RadioButton(
                        title: occupation.displayName,
                        isSelected: viewModel.lifestyle.occupation == occupation,
                        action: { viewModel.lifestyle.occupation = occupation }
                    )
                }
            }
        }
    }

    // MARK: - Social Section

    private var socialSection: some View {
        QuestionCard(
            icon: "person.3.fill",
            title: "Sociabilité",
            color: Color(hex: "10B981")
        ) {
            VStack(spacing: 12) {
                SliderField(
                    label: "Niveau de sociabilité",
                    value: $viewModel.lifestyle.socialLevel,
                    range: 1...5,
                    minLabel: "Calme",
                    maxLabel: "Très social"
                )

                ToggleField(
                    label: "J'aime recevoir des amis",
                    isOn: $viewModel.lifestyle.likesHavingGuests
                )
            }
        }
    }

    // MARK: - Cleanliness Section

    private var cleanlinessSection: some View {
        QuestionCard(
            icon: "sparkles",
            title: "Propreté",
            color: Color(hex: "3B82F6")
        ) {
            SliderField(
                label: "Niveau d'exigence",
                value: $viewModel.lifestyle.cleanlinessLevel,
                range: 1...5,
                minLabel: "Détendu",
                maxLabel: "Très exigeant"
            )
        }
    }

    // MARK: - Pets Section

    private var petsSection: some View {
        QuestionCard(
            icon: "pawprint.fill",
            title: "Animaux",
            color: Color(hex: "F59E0B")
        ) {
            VStack(spacing: 12) {
                ToggleField(
                    label: "J'ai un animal de compagnie",
                    isOn: $viewModel.lifestyle.hasPets
                )

                ToggleField(
                    label: "J'accepte les animaux",
                    isOn: $viewModel.lifestyle.acceptsPets
                )
            }
        }
    }

    // MARK: - Smoking Section

    private var smokingSection: some View {
        QuestionCard(
            icon: "smoke.fill",
            title: "Tabac",
            color: Color(hex: "EF4444")
        ) {
            VStack(spacing: 12) {
                ToggleField(
                    label: "Je fume",
                    isOn: $viewModel.lifestyle.isSmoker
                )

                ToggleField(
                    label: "J'accepte les fumeurs",
                    isOn: $viewModel.lifestyle.acceptsSmokers
                )
            }
        }
    }
}

// MARK: - Searcher Search Preferences

struct SearcherPreferencesView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var viewModel = SearcherPreferencesViewModel()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    VStack(spacing: 12) {
                        Image(systemName: "slider.horizontal.3")
                            .font(.system(size: 48))
                            .foregroundColor(Color(hex: "FFA040"))

                        Text("Préférences de Recherche")
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(Color(hex: "111827"))

                        Text("Personnalisez vos critères pour recevoir les meilleures recommandations")
                            .font(.system(size: 15))
                            .foregroundColor(Color(hex: "6B7280"))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 32)
                    }
                    .padding(.top, 24)

                    // Preferences Sections
                    VStack(spacing: 20) {
                        budgetSection
                        roomTypeSection
                        amenitiesSection
                        locationSection
                        notificationsSection
                    }
                    .padding(.horizontal, 16)

                    // Save Button
                    Button(action: {
                        viewModel.savePreferences()
                        dismiss()
                    }) {
                        Text("Enregistrer les préférences")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(
                                LinearGradient(
                                    colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(16)
                            .shadow(color: Color(hex: "FFA040").opacity(0.3), radius: 8, x: 0, y: 4)
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 8)
                    .padding(.bottom, 32)
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
            }
        }
    }

    // MARK: - Budget Section

    private var budgetSection: some View {
        QuestionCard(
            icon: "eurosign.circle.fill",
            title: "Budget mensuel",
            color: Color(hex: "10B981")
        ) {
            VStack(spacing: 16) {
                HStack {
                    Text("\(Int(viewModel.preferences.minBudget))€")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    Spacer()

                    Text("\(Int(viewModel.preferences.maxBudget))€")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                RangeSlider(
                    minValue: $viewModel.preferences.minBudget,
                    maxValue: $viewModel.preferences.maxBudget,
                    bounds: 200...2000,
                    step: 50
                )
            }
        }
    }

    // MARK: - Room Type Section

    private var roomTypeSection: some View {
        QuestionCard(
            icon: "house.fill",
            title: "Type de logement",
            color: Color(hex: "6E56CF")
        ) {
            VStack(spacing: 8) {
                ForEach(PropertyType.allCases, id: \.self) { type in
                    CheckboxButton(
                        title: type.displayName,
                        icon: type.icon,
                        isSelected: viewModel.preferences.propertyTypes.contains(type),
                        action: {
                            if viewModel.preferences.propertyTypes.contains(type) {
                                viewModel.preferences.propertyTypes.removeAll { $0 == type }
                            } else {
                                viewModel.preferences.propertyTypes.append(type)
                            }
                        }
                    )
                }
            }
        }
    }

    // MARK: - Amenities Section

    private var amenitiesSection: some View {
        QuestionCard(
            icon: "star.fill",
            title: "Équipements souhaités",
            color: Color(hex: "FBBF24")
        ) {
            VStack(spacing: 12) {
                ForEach(viewModel.availableAmenities, id: \.self) { amenity in
                    CheckboxButton(
                        title: amenity,
                        icon: iconForAmenity(amenity),
                        isSelected: viewModel.preferences.preferredAmenities.contains(amenity),
                        action: {
                            if viewModel.preferences.preferredAmenities.contains(amenity) {
                                viewModel.preferences.preferredAmenities.removeAll { $0 == amenity }
                            } else {
                                viewModel.preferences.preferredAmenities.append(amenity)
                            }
                        }
                    )
                }
            }
        }
    }

    // MARK: - Location Section

    private var locationSection: some View {
        QuestionCard(
            icon: "mappin.circle.fill",
            title: "Localisation",
            color: Color(hex: "EF4444")
        ) {
            VStack(spacing: 12) {
                ToggleField(
                    label: "Proche des transports",
                    isOn: $viewModel.preferences.nearPublicTransport
                )

                ToggleField(
                    label: "Centre ville",
                    isOn: $viewModel.preferences.cityCenter
                )

                SliderField(
                    label: "Distance maximale (km)",
                    value: $viewModel.preferences.maxDistanceKm,
                    range: 1...30,
                    minLabel: "1 km",
                    maxLabel: "30 km"
                )
            }
        }
    }

    // MARK: - Notifications Section

    private var notificationsSection: some View {
        QuestionCard(
            icon: "bell.fill",
            title: "Notifications",
            color: Color(hex: "F59E0B")
        ) {
            VStack(spacing: 12) {
                ToggleField(
                    label: "Nouveaux matchs",
                    isOn: $viewModel.preferences.notifyNewMatches
                )

                ToggleField(
                    label: "Baisses de prix",
                    isOn: $viewModel.preferences.notifyPriceDrops
                )

                ToggleField(
                    label: "Nouvelles annonces",
                    isOn: $viewModel.preferences.notifyNewListings
                )
            }
        }
    }

    // MARK: - Helper

    private func iconForAmenity(_ amenity: String) -> String {
        switch amenity {
        case "Wifi": return "wifi"
        case "Parking": return "car.fill"
        case "Balcon": return "square.grid.3x3.square"
        case "Lave-linge": return "washer.fill"
        case "Cuisine équipée": return "fork.knife"
        case "Meublé": return "sofa.fill"
        default: return "checkmark.circle.fill"
        }
    }
}

// MARK: - Lifestyle Model

struct SearcherLifestyle: Codable {
    var isEarlyBird: Bool = false
    var isNightOwl: Bool = false
    var occupation: OccupationType = .student
    var socialLevel: Double = 3
    var likesHavingGuests: Bool = false
    var cleanlinessLevel: Double = 3
    var hasPets: Bool = false
    var acceptsPets: Bool = true
    var isSmoker: Bool = false
    var acceptsSmokers: Bool = false

    func save() {
        if let encoded = try? JSONEncoder().encode(self) {
            UserDefaults.standard.set(encoded, forKey: "searcher_lifestyle")
        }
    }

    static func load() -> SearcherLifestyle {
        guard let data = UserDefaults.standard.data(forKey: "searcher_lifestyle"),
              let lifestyle = try? JSONDecoder().decode(SearcherLifestyle.self, from: data) else {
            return SearcherLifestyle()
        }
        return lifestyle
    }
}

enum OccupationType: String, Codable, CaseIterable {
    case student = "student"
    case employed = "employed"
    case selfEmployed = "self_employed"
    case unemployed = "unemployed"
    case retired = "retired"

    var displayName: String {
        switch self {
        case .student: return "Étudiant(e)"
        case .employed: return "Salarié(e)"
        case .selfEmployed: return "Indépendant(e)"
        case .unemployed: return "Sans emploi"
        case .retired: return "Retraité(e)"
        }
    }
}

// MARK: - Preferences Model

// struct SearcherPreferences: Codable {
//     var minBudget: Double = 400
//     var maxBudget: Double = 1200
//     var propertyTypes: [PropertyType] = []
//     var preferredAmenities: [String] = []
//     var nearPublicTransport: Bool = true
//     var cityCenter: Bool = false
//     var maxDistanceKm: Double = 10
//     var notifyNewMatches: Bool = true
//     var notifyPriceDrops: Bool = true
//     var notifyNewListings: Bool = true
// 
//     func save() {
//         if let encoded = try? JSONEncoder().encode(self) {
//             UserDefaults.standard.set(encoded, forKey: "searcher_preferences")
//         }
//     }
// 
//     static func load() -> SearcherPreferences {
//         guard let data = UserDefaults.standard.data(forKey: "searcher_preferences"),
//               let preferences = try? JSONDecoder().decode(SearcherPreferences.self, from: data) else {
//             return SearcherPreferences()
//         }
//         return preferences
//     }
// }

// MARK: - ViewModels

class SearcherLifestyleViewModel: ObservableObject {
    @Published var lifestyle = SearcherLifestyle.load()

    func saveLifestyle() {
        lifestyle.save()
    }
}

class SearcherPreferencesViewModel: ObservableObject {
    @Published var preferences = SearcherPreferences.load()

    let availableAmenities = [
        "Wifi",
        "Parking",
        "Balcon",
        "Lave-linge",
        "Cuisine équipée",
        "Meublé"
    ]

    func savePreferences() {
        preferences.save()
    }
}

// MARK: - Reusable Components

struct QuestionCard<Content: View>: View {
    let icon: String
    let title: String
    let color: Color
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 20))
                    .foregroundColor(color)

                Text(title)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
            }

            content
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(20)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

struct OptionButton: View {
    let title: String
    let description: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                Image(systemName: isSelected ? "checkmark.circle.fill" : "circle")
                    .font(.system(size: 20))
                    .foregroundColor(isSelected ? Color(hex: "FFA040") : Color(hex: "D1D5DB"))

                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.system(size: 15, weight: .medium))
                        .foregroundColor(Color(hex: "111827"))

                    Text(description)
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                Spacer()
            }
            .padding(12)
            .background(isSelected ? Color(hex: "FFF4ED") : Color(hex: "F9FAFB"))
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(isSelected ? Color(hex: "FFA040") : Color.clear, lineWidth: 2)
            )
        }
    }
}

struct RadioButton: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                Image(systemName: isSelected ? "record.circle.fill" : "circle")
                    .font(.system(size: 20))
                    .foregroundColor(isSelected ? Color(hex: "FFA040") : Color(hex: "D1D5DB"))

                Text(title)
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()
            }
            .padding(.vertical, 8)
        }
    }
}

struct CheckboxButton: View {
    let title: String
    let icon: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                Image(systemName: isSelected ? "checkmark.square.fill" : "square")
                    .font(.system(size: 20))
                    .foregroundColor(isSelected ? Color(hex: "FFA040") : Color(hex: "D1D5DB"))

                Image(systemName: icon)
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))

                Text(title)
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()
            }
            .padding(.vertical, 8)
        }
    }
}

struct ToggleField: View {
    let label: String
    @Binding var isOn: Bool

    var body: some View {
        HStack {
            Text(label)
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "111827"))

            Spacer()

            Toggle("", isOn: $isOn)
                .labelsHidden()
                .tint(Color(hex: "FFA040"))
        }
        .padding(.vertical, 4)
    }
}

struct SliderField: View {
    let label: String
    @Binding var value: Double
    let range: ClosedRange<Double>
    let minLabel: String
    let maxLabel: String

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text(label)
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                Text("\(Int(value))")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(Color(hex: "FFA040"))
            }

            Slider(value: $value, in: range, step: 1)
                .tint(Color(hex: "FFA040"))

            HStack {
                Text(minLabel)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "9CA3AF"))

                Spacer()

                Text(maxLabel)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }
        }
    }
}

struct RangeSlider: View {
    @Binding var minValue: Double
    @Binding var maxValue: Double
    let bounds: ClosedRange<Double>
    let step: Double

    var body: some View {
        VStack(spacing: 12) {
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    // Track
                    Rectangle()
                        .fill(Color(hex: "E5E7EB"))
                        .frame(height: 4)
                        .cornerRadius(2)

                    // Active track
                    Rectangle()
                        .fill(
                            LinearGradient(
                                colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(
                            width: CGFloat((maxValue - minValue) / (bounds.upperBound - bounds.lowerBound)) * geometry.size.width,
                            height: 4
                        )
                        .offset(x: CGFloat((minValue - bounds.lowerBound) / (bounds.upperBound - bounds.lowerBound)) * geometry.size.width)
                        .cornerRadius(2)
                }
            }
            .frame(height: 4)

            HStack(spacing: 16) {
                VStack(spacing: 4) {
                    Text("Min")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "9CA3AF"))

                    Slider(value: $minValue, in: bounds, step: step)
                        .tint(Color(hex: "FFA040"))
                }

                VStack(spacing: 4) {
                    Text("Max")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "9CA3AF"))

                    Slider(value: $maxValue, in: bounds, step: step)
                        .tint(Color(hex: "FFA040"))
                }
            }
        }
    }
}

// MARK: - Preview

struct SearcherProfileViews_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            SearcherLifestyleView()
            SearcherPreferencesView()
        }
    }
}
