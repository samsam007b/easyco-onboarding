//
//  EnhancedProfileStepViews.swift
//  IzzIco
//
//  Created by Claude on 11/18/2025.
//

import SwiftUI

// MARK: - 1. Living Situation View

struct EnhancedLivingSituationView: View {
    @Binding var profile: EnhancedProfile?
    @Environment(\.dismiss) private var dismiss
    @State private var currentSituation: LivingSituation = .livingAlone
    @State private var moveInTimeframe: MoveInTimeframe = .asap
    @State private var minBudget: Double = 400
    @State private var maxBudget: Double = 1000
    @State private var selectedCities: Set<String> = []
    @State private var customCity: String = ""
    @State private var flexibleLocation: Bool = false

    let availableCities = ["Brussels", "Ghent", "Antwerp", "Bruges", "Leuven", "Liège", "Namur"]

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Picker("Current Situation", selection: $currentSituation) {
                        ForEach(LivingSituation.allCases, id: \.self) { situation in
                            Text(situation.displayName).tag(situation)
                        }
                    }
                    .pickerStyle(.menu)
                } header: {
                    Text("Current Living Situation")
                } footer: {
                    Text("Tell us about your current housing situation")
                }

                Section("Move-in Timeline") {
                    Picker("When do you want to move?", selection: $moveInTimeframe) {
                        ForEach(MoveInTimeframe.allCases, id: \.self) { timeframe in
                            Text(timeframe.displayName).tag(timeframe)
                        }
                    }
                    .pickerStyle(.menu)
                }

                Section {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Budget Range")
                            .font(.subheadline)
                            .foregroundColor(.secondary)

                        HStack {
                            Text("€\(Int(minBudget))")
                                .font(.headline)
                            Spacer()
                            Text("€\(Int(maxBudget))")
                                .font(.headline)
                        }

                        VStack(spacing: 8) {
                            HStack {
                                Text("Min")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                Slider(value: $minBudget, in: 300...2000, step: 50)
                            }

                            HStack {
                                Text("Max")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                Slider(value: $maxBudget, in: 300...2000, step: 50)
                            }
                        }
                    }
                    .padding(.vertical, 8)
                } header: {
                    Text("Monthly Budget")
                } footer: {
                    Text("Set your comfortable price range per month")
                }

                Section {
                    ForEach(availableCities, id: \.self) { city in
                        Toggle(city, isOn: Binding(
                            get: { selectedCities.contains(city) },
                            set: { isSelected in
                                if isSelected {
                                    selectedCities.insert(city)
                                } else {
                                    selectedCities.remove(city)
                                }
                            }
                        ))
                    }

                    HStack {
                        TextField("Add custom city", text: $customCity)
                        if !customCity.isEmpty {
                            Button("Add") {
                                selectedCities.insert(customCity)
                                customCity = ""
                            }
                            .buttonStyle(.borderless)
                        }
                    }

                    Toggle("Flexible on location", isOn: $flexibleLocation)
                } header: {
                    Text("Preferred Cities")
                } footer: {
                    Text("Select all cities you'd consider living in")
                }
            }
            .navigationTitle("Living Situation")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        saveChanges()
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
            .onAppear {
                loadCurrentValues()
            }
        }
    }

    private func loadCurrentValues() {
        guard let profile = profile else { return }
        currentSituation = profile.currentLivingSituation ?? .livingAlone
        moveInTimeframe = profile.moveInTimeframe ?? .asap
        minBudget = profile.budgetRange?.min ?? 400
        maxBudget = profile.budgetRange?.max ?? 1000
        selectedCities = Set(profile.preferredCities ?? [])
        flexibleLocation = profile.flexibleOnLocation
    }

    private func saveChanges() {
        profile?.currentLivingSituation = currentSituation
        profile?.moveInTimeframe = moveInTimeframe
        profile?.budgetRange = BudgetRange(min: minBudget, max: maxBudget, currency: "EUR")
        profile?.preferredCities = Array(selectedCities)
        profile?.flexibleOnLocation = flexibleLocation
        profile?.updatedAt = Date()
    }
}

// MARK: - 2. Lifestyle View

struct EnhancedLifestyleView: View {
    @Binding var profile: EnhancedProfile?
    @Environment(\.dismiss) private var dismiss
    @State private var occupationStatus: OccupationStatus = .employed
    @State private var occupationField: String = ""
    @State private var workSchedule: WorkSchedule = .regularHours
    @State private var workFromHome: Bool = false
    @State private var hasPets: Bool = false
    @State private var petDetails: String = ""
    @State private var smokingHabits: SmokingHabits = .nonSmoker
    @State private var dietaryPreferences: Set<DietaryPreference> = []

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Picker("Status", selection: $occupationStatus) {
                        ForEach(OccupationStatus.allCases, id: \.self) { status in
                            Text(status.displayName).tag(status)
                        }
                    }

                    if occupationStatus == .employed || occupationStatus == .selfEmployed {
                        TextField("Field/Industry", text: $occupationField)

                        Picker("Work Schedule", selection: $workSchedule) {
                            ForEach(WorkSchedule.allCases, id: \.self) { schedule in
                                Text(schedule.displayName).tag(schedule)
                            }
                        }

                        Toggle("Work from home", isOn: $workFromHome)
                    }
                } header: {
                    Text("Occupation")
                }

                Section {
                    Toggle("I have pets", isOn: $hasPets)

                    if hasPets {
                        TextField("Pet details (type, breed, size)", text: $petDetails)
                            .textInputAutocapitalization(.sentences)
                    }
                } header: {
                    Text("Pets")
                } footer: {
                    Text(hasPets ? "Please provide details about your pet(s)" : "")
                }

                Section {
                    Picker("Smoking Habits", selection: $smokingHabits) {
                        ForEach(SmokingHabits.allCases, id: \.self) { habit in
                            Text(habit.displayName).tag(habit)
                        }
                    }
                } header: {
                    Text("Smoking")
                }

                Section {
                    ForEach(DietaryPreference.allCases, id: \.self) { preference in
                        Toggle(preference.displayName, isOn: Binding(
                            get: { dietaryPreferences.contains(preference) },
                            set: { isSelected in
                                if isSelected {
                                    dietaryPreferences.insert(preference)
                                } else {
                                    dietaryPreferences.remove(preference)
                                }
                            }
                        ))
                    }
                } header: {
                    Text("Dietary Preferences")
                } footer: {
                    Text("Select all that apply")
                }
            }
            .navigationTitle("Lifestyle")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        saveChanges()
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
            .onAppear {
                loadCurrentValues()
            }
        }
    }

    private func loadCurrentValues() {
        guard let profile = profile else { return }
        occupationStatus = profile.occupationStatus ?? .employed
        occupationField = profile.occupationField ?? ""
        workSchedule = profile.workSchedule ?? .regularHours
        workFromHome = profile.workFromHome
        hasPets = profile.hasPets
        petDetails = profile.petDetails ?? ""
        smokingHabits = profile.smokingHabits ?? .nonSmoker
        dietaryPreferences = Set(profile.dietaryPreferences ?? [])
    }

    private func saveChanges() {
        profile?.occupationStatus = occupationStatus
        profile?.occupationField = occupationField.isEmpty ? nil : occupationField
        profile?.workSchedule = workSchedule
        profile?.workFromHome = workFromHome
        profile?.hasPets = hasPets
        profile?.petDetails = petDetails.isEmpty ? nil : petDetails
        profile?.smokingHabits = smokingHabits
        profile?.dietaryPreferences = Array(dietaryPreferences)
        profile?.updatedAt = Date()
    }
}

// MARK: - 3. Daily Habits View

struct EnhancedDailyHabitsView: View {
    @Binding var profile: EnhancedProfile?
    @Environment(\.dismiss) private var dismiss
    @State private var sleepSchedule: SleepSchedule = .flexible
    @State private var cleanlinessLevel: CleanlinessLevel = .moderatelyClean
    @State private var noiseLevel: NoiseLevel = .moderate
    @State private var guestFrequency: GuestFrequency = .occasionally
    @State private var sharingPreference: SharingPreference = .comfortable

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Picker("Sleep Schedule", selection: $sleepSchedule) {
                        ForEach(SleepSchedule.allCases, id: \.self) { schedule in
                            Text(schedule.displayName).tag(schedule)
                        }
                    }
                } header: {
                    Text("Sleep Habits")
                } footer: {
                    Text("When do you typically go to bed?")
                }

                Section {
                    Picker("Cleanliness Level", selection: $cleanlinessLevel) {
                        ForEach(CleanlinessLevel.allCases, id: \.self) { level in
                            Text(level.displayName).tag(level)
                        }
                    }
                } header: {
                    Text("Cleanliness")
                } footer: {
                    Text("How tidy do you keep shared spaces?")
                }

                Section {
                    Picker("Noise Tolerance", selection: $noiseLevel) {
                        ForEach(NoiseLevel.allCases, id: \.self) { level in
                            Text(level.displayName).tag(level)
                        }
                    }
                } header: {
                    Text("Noise Level")
                } footer: {
                    Text("What noise level are you comfortable with?")
                }

                Section {
                    Picker("Guest Frequency", selection: $guestFrequency) {
                        ForEach(GuestFrequency.allCases, id: \.self) { frequency in
                            Text(frequency.displayName).tag(frequency)
                        }
                    }
                } header: {
                    Text("Guests")
                } footer: {
                    Text("How often do you have guests over?")
                }

                Section {
                    Picker("Sharing Preference", selection: $sharingPreference) {
                        ForEach(SharingPreference.allCases, id: \.self) { preference in
                            Text(preference.displayName).tag(preference)
                        }
                    }
                } header: {
                    Text("Common Spaces")
                } footer: {
                    Text("How do you feel about sharing kitchen, living room, etc.?")
                }
            }
            .navigationTitle("Daily Habits")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        saveChanges()
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
            .onAppear {
                loadCurrentValues()
            }
        }
    }

    private func loadCurrentValues() {
        guard let profile = profile else { return }
        sleepSchedule = profile.sleepSchedule ?? .flexible
        cleanlinessLevel = profile.cleanlinessLevel ?? .moderatelyClean
        noiseLevel = profile.noiseLevel ?? .moderate
        guestFrequency = profile.guestFrequency ?? .occasionally
        sharingPreference = profile.sharingCommonSpaces ?? .comfortable
    }

    private func saveChanges() {
        profile?.sleepSchedule = sleepSchedule
        profile?.cleanlinessLevel = cleanlinessLevel
        profile?.noiseLevel = noiseLevel
        profile?.guestFrequency = guestFrequency
        profile?.sharingCommonSpaces = sharingPreference
        profile?.updatedAt = Date()
    }
}

// MARK: - 4. Home Lifestyle View

struct EnhancedHomeLifestyleView: View {
    @Binding var profile: EnhancedProfile?
    @Environment(\.dismiss) private var dismiss
    @State private var cookingFrequency: CookingFrequency = .sometimes
    @State private var cookingStyles: Set<CookingStyle> = []
    @State private var exerciseRoutine: ExerciseRoutine = .occasionally
    @State private var hobbies: String = ""
    @State private var musicGenres: Set<MusicGenre> = []
    @State private var movieGenres: Set<MovieGenre> = []

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Picker("How often do you cook?", selection: $cookingFrequency) {
                        ForEach(CookingFrequency.allCases, id: \.self) { frequency in
                            Text(frequency.displayName).tag(frequency)
                        }
                    }

                    if cookingFrequency != .rarely {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Cooking Style")
                                .font(.subheadline)
                                .foregroundColor(.secondary)

                            ForEach(CookingStyle.allCases, id: \.self) { style in
                                Toggle(style.displayName, isOn: Binding(
                                    get: { cookingStyles.contains(style) },
                                    set: { isSelected in
                                        if isSelected {
                                            cookingStyles.insert(style)
                                        } else {
                                            cookingStyles.remove(style)
                                        }
                                    }
                                ))
                            }
                        }
                    }
                } header: {
                    Text("Cooking")
                }

                Section {
                    Picker("Exercise Frequency", selection: $exerciseRoutine) {
                        ForEach(ExerciseRoutine.allCases, id: \.self) { routine in
                            Text(routine.displayName).tag(routine)
                        }
                    }
                } header: {
                    Text("Exercise")
                }

                Section {
                    TextField("List your hobbies", text: $hobbies, axis: .vertical)
                        .lineLimit(3...6)
                        .textInputAutocapitalization(.sentences)
                } header: {
                    Text("Hobbies & Interests")
                } footer: {
                    Text("What do you enjoy doing in your free time?")
                }

                Section {
                    ForEach(MusicGenre.allCases, id: \.self) { genre in
                        Toggle(genre.displayName, isOn: Binding(
                            get: { musicGenres.contains(genre) },
                            set: { isSelected in
                                if isSelected {
                                    musicGenres.insert(genre)
                                } else {
                                    musicGenres.remove(genre)
                                }
                            }
                        ))
                    }
                } header: {
                    Text("Music Preferences")
                }

                Section {
                    ForEach(MovieGenre.allCases, id: \.self) { genre in
                        Toggle(genre.displayName, isOn: Binding(
                            get: { movieGenres.contains(genre) },
                            set: { isSelected in
                                if isSelected {
                                    movieGenres.insert(genre)
                                } else {
                                    movieGenres.remove(genre)
                                }
                            }
                        ))
                    }
                } header: {
                    Text("Movie/TV Preferences")
                }
            }
            .navigationTitle("Home Lifestyle")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        saveChanges()
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
            .onAppear {
                loadCurrentValues()
            }
        }
    }

    private func loadCurrentValues() {
        guard let profile = profile else { return }
        cookingFrequency = profile.cookingFrequency ?? .sometimes
        cookingStyles = Set(profile.cookingStyle ?? [])
        exerciseRoutine = profile.exerciseRoutine ?? .occasionally
        hobbies = (profile.hobbies ?? []).joined(separator: ", ")
        musicGenres = Set(profile.musicPreferences ?? [])
        movieGenres = Set(profile.moviePreferences ?? [])
    }

    private func saveChanges() {
        profile?.cookingFrequency = cookingFrequency
        profile?.cookingStyle = Array(cookingStyles)
        profile?.exerciseRoutine = exerciseRoutine
        profile?.hobbies = hobbies.split(separator: ",").map { $0.trimmingCharacters(in: .whitespaces) }
        profile?.musicPreferences = Array(musicGenres)
        profile?.moviePreferences = Array(movieGenres)
        profile?.updatedAt = Date()
    }
}

// MARK: - 5. Social Vibe View

struct EnhancedSocialVibeView: View {
    @Binding var profile: EnhancedProfile?
    @Environment(\.dismiss) private var dismiss
    @State private var socialLevel: SocialLevel = .ambivert
    @State private var communicationStyle: CommunicationStyle = .casual
    @State private var conflictResolution: ConflictResolution = .thinkFirst
    @State private var sharedActivities: SharedActivitiesLevel = .sometimes
    @State private var privacyNeeds: PrivacyLevel = .moderate

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Picker("Social Level", selection: $socialLevel) {
                        ForEach(SocialLevel.allCases, id: \.self) { level in
                            Text(level.displayName).tag(level)
                        }
                    }
                } header: {
                    Text("Social Personality")
                } footer: {
                    Text("Are you more introverted or extroverted?")
                }

                Section {
                    Picker("Communication Style", selection: $communicationStyle) {
                        ForEach(CommunicationStyle.allCases, id: \.self) { style in
                            Text(style.displayName).tag(style)
                        }
                    }
                } header: {
                    Text("Communication")
                } footer: {
                    Text("How do you prefer to communicate?")
                }

                Section {
                    Picker("Conflict Resolution", selection: $conflictResolution) {
                        ForEach(ConflictResolution.allCases, id: \.self) { style in
                            Text(style.displayName).tag(style)
                        }
                    }
                } header: {
                    Text("Handling Conflicts")
                } footer: {
                    Text("How do you deal with disagreements?")
                }

                Section {
                    Picker("Shared Activities", selection: $sharedActivities) {
                        ForEach(SharedActivitiesLevel.allCases, id: \.self) { level in
                            Text(level.displayName).tag(level)
                        }
                    }
                } header: {
                    Text("Social Activities")
                } footer: {
                    Text("Interest in doing activities with roommates?")
                }

                Section {
                    Picker("Privacy Needs", selection: $privacyNeeds) {
                        ForEach(PrivacyLevel.allCases, id: \.self) { level in
                            Text(level.displayName).tag(level)
                        }
                    }
                } header: {
                    Text("Privacy")
                } footer: {
                    Text("How much personal space do you need?")
                }
            }
            .navigationTitle("Social Vibe")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        saveChanges()
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
            .onAppear {
                loadCurrentValues()
            }
        }
    }

    private func loadCurrentValues() {
        guard let profile = profile else { return }
        socialLevel = profile.socialLevel ?? .ambivert
        communicationStyle = profile.communicationStyle ?? .casual
        conflictResolution = profile.conflictResolution ?? .thinkFirst
        sharedActivities = profile.sharedActivitiesInterest ?? .sometimes
        privacyNeeds = profile.privacyNeeds ?? .moderate
    }

    private func saveChanges() {
        profile?.socialLevel = socialLevel
        profile?.communicationStyle = communicationStyle
        profile?.conflictResolution = conflictResolution
        profile?.sharedActivitiesInterest = sharedActivities
        profile?.privacyNeeds = privacyNeeds
        profile?.updatedAt = Date()
    }
}

// MARK: - 6. Personality View

struct EnhancedPersonalityView: View {
    @Binding var profile: EnhancedProfile?
    @Environment(\.dismiss) private var dismiss
    @State private var personalityTraits: Set<PersonalityTrait> = []
    @State private var values: Set<PersonalValue> = []
    @State private var dealBreakers: String = ""
    @State private var idealQualities: String = ""

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    ForEach(PersonalityTrait.allCases, id: \.self) { trait in
                        Toggle(trait.displayName, isOn: Binding(
                            get: { personalityTraits.contains(trait) },
                            set: { isSelected in
                                if isSelected {
                                    personalityTraits.insert(trait)
                                } else {
                                    personalityTraits.remove(trait)
                                }
                            }
                        ))
                    }
                } header: {
                    Text("Personality Traits")
                } footer: {
                    Text("Select traits that describe you (choose 3-5)")
                }

                Section {
                    ForEach(PersonalValue.allCases, id: \.self) { value in
                        Toggle(value.displayName, isOn: Binding(
                            get: { values.contains(value) },
                            set: { isSelected in
                                if isSelected {
                                    values.insert(value)
                                } else {
                                    values.remove(value)
                                }
                            }
                        ))
                    }
                } header: {
                    Text("Core Values")
                } footer: {
                    Text("What matters most to you in a living situation?")
                }

                Section {
                    TextField("List your deal-breakers", text: $dealBreakers, axis: .vertical)
                        .lineLimit(3...6)
                        .textInputAutocapitalization(.sentences)
                } header: {
                    Text("Deal-Breakers")
                } footer: {
                    Text("What behaviors or situations are absolute no-gos?")
                }

                Section {
                    TextField("Describe ideal roommate", text: $idealQualities, axis: .vertical)
                        .lineLimit(3...6)
                        .textInputAutocapitalization(.sentences)
                } header: {
                    Text("Ideal Roommate")
                } footer: {
                    Text("What qualities would your perfect roommate have?")
                }
            }
            .navigationTitle("Personality")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        saveChanges()
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
            .onAppear {
                loadCurrentValues()
            }
        }
    }

    private func loadCurrentValues() {
        guard let profile = profile else { return }
        personalityTraits = Set(profile.personalityTraits ?? [])
        values = Set(profile.values ?? [])
        dealBreakers = (profile.dealBreakers ?? []).joined(separator: ", ")
        idealQualities = (profile.idealRoommateQualities ?? []).joined(separator: ", ")
    }

    private func saveChanges() {
        profile?.personalityTraits = Array(personalityTraits)
        profile?.values = Array(values)
        profile?.dealBreakers = dealBreakers.split(separator: ",").map { $0.trimmingCharacters(in: .whitespaces) }
        profile?.idealRoommateQualities = idealQualities.split(separator: ",").map { $0.trimmingCharacters(in: .whitespaces) }
        profile?.updatedAt = Date()
    }
}

// MARK: - 7. Ideal Coliving View

struct EnhancedIdealColivingView: View {
    @Binding var profile: EnhancedProfile?
    @Environment(\.dismiss) private var dismiss
    @State private var idealPropertyType: PropertyType = .apartment
    @State private var mustHaveAmenities: Set<PropertyAmenity> = []
    @State private var niceToHaveAmenities: Set<PropertyAmenity> = []
    @State private var neighborhoodVibes: Set<NeighborhoodVibe> = []
    @State private var transportationPrefs: Set<TransportationType> = []

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Picker("Property Type", selection: $idealPropertyType) {
                        ForEach(PropertyType.allCases, id: \.self) { type in
                            Text(type.displayName).tag(type)
                        }
                    }
                } header: {
                    Text("Ideal Property")
                }

                Section {
                    ForEach(PropertyAmenity.allCases, id: \.self) { amenity in
                        Toggle(amenity.displayName, isOn: Binding(
                            get: { mustHaveAmenities.contains(amenity) },
                            set: { isSelected in
                                if isSelected {
                                    mustHaveAmenities.insert(amenity)
                                    niceToHaveAmenities.remove(amenity)
                                } else {
                                    mustHaveAmenities.remove(amenity)
                                }
                            }
                        ))
                    }
                } header: {
                    Text("Must-Have Amenities")
                } footer: {
                    Text("Features you absolutely need")
                }

                Section {
                    ForEach(PropertyAmenity.allCases, id: \.self) { amenity in
                        if !mustHaveAmenities.contains(amenity) {
                            Toggle(amenity.displayName, isOn: Binding(
                                get: { niceToHaveAmenities.contains(amenity) },
                                set: { isSelected in
                                    if isSelected {
                                        niceToHaveAmenities.insert(amenity)
                                    } else {
                                        niceToHaveAmenities.remove(amenity)
                                    }
                                }
                            ))
                        }
                    }
                } header: {
                    Text("Nice-to-Have Amenities")
                } footer: {
                    Text("Features you'd like but aren't essential")
                }

                Section {
                    ForEach(NeighborhoodVibe.allCases, id: \.self) { vibe in
                        Toggle(vibe.displayName, isOn: Binding(
                            get: { neighborhoodVibes.contains(vibe) },
                            set: { isSelected in
                                if isSelected {
                                    neighborhoodVibes.insert(vibe)
                                } else {
                                    neighborhoodVibes.remove(vibe)
                                }
                            }
                        ))
                    }
                } header: {
                    Text("Neighborhood Vibe")
                } footer: {
                    Text("What kind of area would you prefer?")
                }

                Section {
                    ForEach(TransportationType.allCases, id: \.self) { transport in
                        Toggle(transport.displayName, isOn: Binding(
                            get: { transportationPrefs.contains(transport) },
                            set: { isSelected in
                                if isSelected {
                                    transportationPrefs.insert(transport)
                                } else {
                                    transportationPrefs.remove(transport)
                                }
                            }
                        ))
                    }
                } header: {
                    Text("Transportation")
                } footer: {
                    Text("How do you prefer to get around?")
                }
            }
            .navigationTitle("Ideal Home")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        saveChanges()
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
            .onAppear {
                loadCurrentValues()
            }
        }
    }

    private func loadCurrentValues() {
        guard let profile = profile else { return }
        idealPropertyType = profile.idealPropertyType ?? .apartment
        mustHaveAmenities = Set(profile.mustHaveAmenities ?? [])
        niceToHaveAmenities = Set(profile.niceToHaveAmenities ?? [])
        neighborhoodVibes = Set(profile.neighborhoodVibe ?? [])
        transportationPrefs = Set(profile.transportationPreferences ?? [])
    }

    private func saveChanges() {
        profile?.idealPropertyType = idealPropertyType
        profile?.mustHaveAmenities = Array(mustHaveAmenities)
        profile?.niceToHaveAmenities = Array(niceToHaveAmenities)
        profile?.neighborhoodVibe = Array(neighborhoodVibes)
        profile?.transportationPreferences = Array(transportationPrefs)
        profile?.updatedAt = Date()
    }
}

// MARK: - 8. Verification View

struct EnhancedVerificationView: View {
    @Binding var profile: EnhancedProfile?
    @Environment(\.dismiss) private var dismiss
    @State private var showingDocumentPicker = false
    @State private var selectedDocumentType: VerificationDocument.DocumentType = .idCard

    var body: some View {
        NavigationStack {
            Form {
                statusSection
                documentsSection
                benefitsSection
            }
            .navigationTitle("Verification")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
            .sheet(isPresented: $showingDocumentPicker) {
                DocumentPickerView(documentType: selectedDocumentType) { success in
                    if success {
                        // TODO: Handle document upload
                        print("📄 Document uploaded: \(selectedDocumentType.displayName)")
                    }
                }
            }
        }
    }

    // MARK: - View Components

    private var statusSection: some View {
        Section {
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Image(systemName: verificationIcon)
                        .font(.title)
                        .foregroundColor(verificationColor)

                    VStack(alignment: .leading, spacing: 4) {
                        Text(verificationStatusText)
                            .font(.headline)

                        Text(verificationDescription)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }

                    Spacer()
                }
                .padding(.vertical, 8)
            }
        } header: {
            Text("Verification Status")
        }
    }

    private var documentsSection: some View {
        Section {
            ForEach(VerificationDocument.DocumentType.allCases, id: \.self) { docType in
                ProfileDocumentRow(
                    docType: docType,
                    document: profile?.verifiedDocuments?.first { $0.type == docType },
                    onUpload: {
                        selectedDocumentType = docType
                        showingDocumentPicker = true
                    }
                )
            }
        } header: {
            Text("Documents")
        } footer: {
            Text("Upload documents to verify your identity and increase trust")
        }
    }

    private var benefitsSection: some View {
        Section {
            VStack(alignment: .leading, spacing: 12) {
                VerificationBenefitRow(
                    icon: "checkmark.shield.fill",
                    title: "Verified Badge",
                    description: "Get a verified badge on your profile"
                )

                VerificationBenefitRow(
                    icon: "eye.fill",
                    title: "2x More Views",
                    description: "Verified profiles get double the visibility"
                )

                VerificationBenefitRow(
                    icon: "hand.thumbsup.fill",
                    title: "Build Trust",
                    description: "Show you're a serious, trustworthy candidate"
                )
            }
        } header: {
            Text("Why Verify?")
        }
    }

    private var verificationIcon: String {
        switch profile?.verificationStatus {
        case .verified: return "checkmark.seal.fill"
        case .pending: return "clock.fill"
        case .unverified, nil: return "exclamationmark.shield.fill"
        }
    }

    private var verificationColor: Color {
        switch profile?.verificationStatus {
        case .verified: return .green
        case .pending: return .orange
        case .unverified, nil: return .gray
        }
    }

    private var verificationStatusText: String {
        switch profile?.verificationStatus {
        case .verified: return "Verified"
        case .pending: return "Verification Pending"
        case .unverified, nil: return "Not Verified"
        }
    }

    private var verificationDescription: String {
        switch profile?.verificationStatus {
        case .verified: return "Your profile is verified"
        case .pending: return "We're reviewing your documents"
        case .unverified, nil: return "Upload documents to get verified"
        }
    }

    private func statusColor(for status: VerificationStatus) -> Color {
        switch status {
        case .verified: return .green
        case .pending: return .orange
        case .unverified: return .gray
        }
    }
}

// MARK: - Verification Benefit Row

private struct VerificationBenefitRow: View {
    let icon: String
    let title: String
    let description: String

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(Theme.Colors.primary)
                .frame(width: 32)

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.semibold)

                Text(description)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()
        }
    }
}

// MARK: - Profile Document Row

struct ProfileDocumentRow: View {
    let docType: VerificationDocument.DocumentType
    let document: VerificationDocument?
    let onUpload: () -> Void

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(docType.displayName)
                    .font(.body)

                if let doc = document {
                    Text(doc.status.displayName)
                        .font(.caption)
                        .foregroundColor(statusColor(for: doc.status))
                } else {
                    Text("Not uploaded")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }

            Spacer()

            if document != nil {
                Image(systemName: "checkmark.circle.fill")
                    .foregroundColor(.green)
            } else {
                Button("Upload") {
                    onUpload()
                }
                .buttonStyle(.bordered)
                .controlSize(.small)
            }
        }
    }

    private func statusColor(for status: VerificationStatus) -> Color {
        switch status {
        case .verified: return .green
        case .pending: return .orange
        case .unverified: return .gray
        }
    }
}

// MARK: - Document Picker View

struct DocumentPickerView: View {
    let documentType: VerificationDocument.DocumentType
    let onComplete: (Bool) -> Void
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Image(systemName: "doc.text.fill")
                    .font(.system(size: 60))
                    .foregroundColor(Theme.Colors.primary)

                Text("Upload \(documentType.displayName)")
                    .font(.title2)
                    .fontWeight(.bold)

                Text("Take a photo or select from your files")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)

                VStack(spacing: 12) {
                    Button {
                        // TODO: Implement camera
                        simulateUpload()
                    } label: {
                        Label("Take Photo", systemImage: "camera.fill")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.bordered)
                    .controlSize(.large)

                    Button {
                        // TODO: Implement file picker
                        simulateUpload()
                    } label: {
                        Label("Choose File", systemImage: "folder.fill")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.bordered)
                    .controlSize(.large)
                }
                .padding(.horizontal)
            }
            .padding()
            .navigationTitle("Upload Document")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
    }

    private func simulateUpload() {
        // TODO: Implement actual document upload
        onComplete(true)
        dismiss()
    }
}

// MARK: - Previews

#Preview("Living Situation") {
    EnhancedLivingSituationView(profile: .constant(EnhancedProfile.mockIncomplete))
}

#Preview("Lifestyle") {
    EnhancedLifestyleView(profile: .constant(EnhancedProfile.mockComplete))
}

#Preview("Daily Habits") {
    EnhancedDailyHabitsView(profile: .constant(EnhancedProfile.mockComplete))
}

#Preview("Home Lifestyle") {
    EnhancedHomeLifestyleView(profile: .constant(EnhancedProfile.mockComplete))
}

#Preview("Social Vibe") {
    EnhancedSocialVibeView(profile: .constant(EnhancedProfile.mockComplete))
}

#Preview("Personality") {
    EnhancedPersonalityView(profile: .constant(EnhancedProfile.mockComplete))
}

#Preview("Ideal Coliving") {
    EnhancedIdealColivingView(profile: .constant(EnhancedProfile.mockComplete))
}

#Preview("Verification") {
    EnhancedVerificationView(profile: .constant(EnhancedProfile.mockComplete))
}
