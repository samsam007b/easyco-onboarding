//
//  EnhancedProfile.swift
//  EasyCo
//
//  Created by Claude on 11/18/2025.
//

import Foundation

// MARK: - Enhanced Profile

/// Comprehensive user profile with all 8-step onboarding data
struct EnhancedProfile: Identifiable, Codable {
    let id: UUID
    let userId: UUID

    // MARK: Step 1 - Basic Info (already in User model)
    // firstName, lastName, email, phone are in User

    // MARK: Step 2 - Living Situation
    var currentLivingSituation: LivingSituation?
    var moveInTimeframe: MoveInTimeframe?
    var budgetRange: BudgetRange?
    var preferredCities: [String]?
    var flexibleOnLocation: Bool

    // MARK: Step 3 - Lifestyle Preferences
    var occupationStatus: OccupationStatus?
    var occupationField: String?
    var workSchedule: WorkSchedule?
    var workFromHome: Bool
    var hasPets: Bool
    var petDetails: String?
    var smokingHabits: SmokingHabits?
    var dietaryPreferences: [DietaryPreference]?

    // MARK: Step 4 - Daily Habits
    var sleepSchedule: SleepSchedule?
    var cleanlinessLevel: CleanlinessLevel?
    var noiseLevel: NoiseLevel?
    var guestFrequency: GuestFrequency?
    var sharingCommonSpaces: SharingPreference?

    // MARK: Step 5 - Home Lifestyle
    var cookingFrequency: CookingFrequency?
    var cookingStyle: [CookingStyle]?
    var exerciseRoutine: ExerciseRoutine?
    var hobbies: [String]?
    var musicPreferences: [MusicGenre]?
    var moviePreferences: [MovieGenre]?

    // MARK: Step 6 - Social Vibe
    var socialLevel: SocialLevel?
    var communicationStyle: CommunicationStyle?
    var conflictResolution: ConflictResolution?
    var sharedActivitiesInterest: SharedActivitiesLevel?
    var privacyNeeds: PrivacyLevel?

    // MARK: Step 7 - Personality
    var personalityTraits: [PersonalityTrait]?
    var values: [PersonalValue]?
    var dealBreakers: [String]?
    var idealRoommateQualities: [String]?

    // MARK: Step 8 - Ideal Coliving
    var idealPropertyType: PropertyType?
    var mustHaveAmenities: [PropertyAmenity]?
    var niceToHaveAmenities: [PropertyAmenity]?
    var neighborhoodVibe: [NeighborhoodVibe]?
    var transportationPreferences: [TransportationType]?

    // MARK: Profile Metadata
    var bio: String?
    var languages: [String]?
    var profileCompletionPercentage: Int
    var verificationStatus: VerificationStatus
    var verifiedDocuments: [VerificationDocument]?

    var createdAt: Date
    var updatedAt: Date

    enum CodingKeys: String, CodingKey {
        case id, userId = "user_id"
        case currentLivingSituation = "current_living_situation"
        case moveInTimeframe = "move_in_timeframe"
        case budgetRange = "budget_range"
        case preferredCities = "preferred_cities"
        case flexibleOnLocation = "flexible_on_location"
        case occupationStatus = "occupation_status"
        case occupationField = "occupation_field"
        case workSchedule = "work_schedule"
        case workFromHome = "work_from_home"
        case hasPets = "has_pets"
        case petDetails = "pet_details"
        case smokingHabits = "smoking_habits"
        case dietaryPreferences = "dietary_preferences"
        case sleepSchedule = "sleep_schedule"
        case cleanlinessLevel = "cleanliness_level"
        case noiseLevel = "noise_level"
        case guestFrequency = "guest_frequency"
        case sharingCommonSpaces = "sharing_common_spaces"
        case cookingFrequency = "cooking_frequency"
        case cookingStyle = "cooking_style"
        case exerciseRoutine = "exercise_routine"
        case hobbies
        case musicPreferences = "music_preferences"
        case moviePreferences = "movie_preferences"
        case socialLevel = "social_level"
        case communicationStyle = "communication_style"
        case conflictResolution = "conflict_resolution"
        case sharedActivitiesInterest = "shared_activities_interest"
        case privacyNeeds = "privacy_needs"
        case personalityTraits = "personality_traits"
        case values
        case dealBreakers = "deal_breakers"
        case idealRoommateQualities = "ideal_roommate_qualities"
        case idealPropertyType = "ideal_property_type"
        case mustHaveAmenities = "must_have_amenities"
        case niceToHaveAmenities = "nice_to_have_amenities"
        case neighborhoodVibe = "neighborhood_vibe"
        case transportationPreferences = "transportation_preferences"
        case bio
        case languages
        case profileCompletionPercentage = "profile_completion_percentage"
        case verificationStatus = "verification_status"
        case verifiedDocuments = "verified_documents"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }

    // MARK: - Computed Properties

    /// Calculates profile completion based on filled fields
    func calculateCompletion() -> Int {
        var filledFields = 0
        let totalFields = 30 // Approximate number of key fields

        if currentLivingSituation != nil { filledFields += 1 }
        if moveInTimeframe != nil { filledFields += 1 }
        if budgetRange != nil { filledFields += 1 }
        if !(preferredCities?.isEmpty ?? true) { filledFields += 1 }
        if occupationStatus != nil { filledFields += 1 }
        if workSchedule != nil { filledFields += 1 }
        if smokingHabits != nil { filledFields += 1 }
        if !(dietaryPreferences?.isEmpty ?? true) { filledFields += 1 }
        if sleepSchedule != nil { filledFields += 1 }
        if cleanlinessLevel != nil { filledFields += 1 }
        if noiseLevel != nil { filledFields += 1 }
        if guestFrequency != nil { filledFields += 1 }
        if cookingFrequency != nil { filledFields += 1 }
        if !(hobbies?.isEmpty ?? true) { filledFields += 1 }
        if socialLevel != nil { filledFields += 1 }
        if communicationStyle != nil { filledFields += 1 }
        if conflictResolution != nil { filledFields += 1 }
        if privacyNeeds != nil { filledFields += 1 }
        if !(personalityTraits?.isEmpty ?? true) { filledFields += 1 }
        if !(values?.isEmpty ?? true) { filledFields += 1 }
        if idealPropertyType != nil { filledFields += 1 }
        if !(mustHaveAmenities?.isEmpty ?? true) { filledFields += 1 }
        if !(neighborhoodVibe?.isEmpty ?? true) { filledFields += 1 }
        if bio?.isEmpty == false { filledFields += 1 }
        if !(languages?.isEmpty ?? true) { filledFields += 1 }

        return Int((Double(filledFields) / Double(totalFields)) * 100)
    }

    var isComplete: Bool {
        profileCompletionPercentage >= 80
    }
}

// MARK: - Enums for Profile Fields

enum LivingSituation: String, Codable, CaseIterable {
    case livingAlone = "living_alone"
    case withRoommates = "with_roommates"
    case withFamily = "with_family"
    case other = "other"

    var displayName: String {
        switch self {
        case .livingAlone: return "Living alone"
        case .withRoommates: return "With roommates"
        case .withFamily: return "With family"
        case .other: return "Other"
        }
    }
}

enum MoveInTimeframe: String, Codable, CaseIterable {
    case asap = "asap"
    case oneMonth = "one_month"
    case twoThreeMonths = "two_three_months"
    case flexible = "flexible"

    var displayName: String {
        switch self {
        case .asap: return "ASAP"
        case .oneMonth: return "Within 1 month"
        case .twoThreeMonths: return "2-3 months"
        case .flexible: return "Flexible"
        }
    }
}

struct BudgetRange: Codable {
    let min: Double
    let max: Double
    let currency: String

    var displayString: String {
        "\(Int(min))-\(Int(max)) \(currency)"
    }
}

enum OccupationStatus: String, Codable, CaseIterable {
    case student = "student"
    case employed = "employed"
    case selfEmployed = "self_employed"
    case unemployed = "unemployed"
    case retired = "retired"

    var displayName: String {
        switch self {
        case .student: return "Student"
        case .employed: return "Employed"
        case .selfEmployed: return "Self-employed"
        case .unemployed: return "Unemployed"
        case .retired: return "Retired"
        }
    }
}

enum WorkSchedule: String, Codable, CaseIterable {
    case regularHours = "regular_hours"
    case flexible = "flexible"
    case nightShift = "night_shift"
    case irregular = "irregular"

    var displayName: String {
        switch self {
        case .regularHours: return "Regular hours (9-5)"
        case .flexible: return "Flexible schedule"
        case .nightShift: return "Night shift"
        case .irregular: return "Irregular schedule"
        }
    }
}

enum SmokingHabits: String, Codable, CaseIterable {
    case nonSmoker = "non_smoker"
    case socialSmoker = "social_smoker"
    case regularSmoker = "regular_smoker"
    case vaping = "vaping"

    var displayName: String {
        switch self {
        case .nonSmoker: return "Non-smoker"
        case .socialSmoker: return "Social smoker"
        case .regularSmoker: return "Regular smoker"
        case .vaping: return "Vaping"
        }
    }
}

enum DietaryPreference: String, Codable, CaseIterable {
    case omnivore = "omnivore"
    case vegetarian = "vegetarian"
    case vegan = "vegan"
    case pescatarian = "pescatarian"
    case glutenFree = "gluten_free"
    case kosher = "kosher"
    case halal = "halal"

    var displayName: String {
        switch self {
        case .omnivore: return "Omnivore"
        case .vegetarian: return "Vegetarian"
        case .vegan: return "Vegan"
        case .pescatarian: return "Pescatarian"
        case .glutenFree: return "Gluten-free"
        case .kosher: return "Kosher"
        case .halal: return "Halal"
        }
    }
}

enum SleepSchedule: String, Codable, CaseIterable {
    case earlyBird = "early_bird"
    case nightOwl = "night_owl"
    case flexible = "flexible"

    var displayName: String {
        switch self {
        case .earlyBird: return "Early bird (before 10pm)"
        case .nightOwl: return "Night owl (after midnight)"
        case .flexible: return "Flexible"
        }
    }
}

enum CleanlinessLevel: String, Codable, CaseIterable {
    case veryClean = "very_clean"
    case moderatelyClean = "moderately_clean"
    case casual = "casual"

    var displayName: String {
        switch self {
        case .veryClean: return "Very clean & organized"
        case .moderatelyClean: return "Moderately clean"
        case .casual: return "Casual about tidiness"
        }
    }
}

enum NoiseLevel: String, Codable, CaseIterable {
    case quiet = "quiet"
    case moderate = "moderate"
    case lively = "lively"

    var displayName: String {
        switch self {
        case .quiet: return "Quiet environment"
        case .moderate: return "Moderate noise okay"
        case .lively: return "Lively atmosphere"
        }
    }
}

enum GuestFrequency: String, Codable, CaseIterable {
    case rarely = "rarely"
    case occasionally = "occasionally"
    case often = "often"

    var displayName: String {
        switch self {
        case .rarely: return "Rarely"
        case .occasionally: return "Occasionally"
        case .often: return "Often"
        }
    }
}

enum SharingPreference: String, Codable, CaseIterable {
    case loves = "loves"
    case comfortable = "comfortable"
    case prefers = "prefers_private"

    var displayName: String {
        switch self {
        case .loves: return "Loves sharing"
        case .comfortable: return "Comfortable sharing"
        case .prefers: return "Prefers private space"
        }
    }
}

enum CookingFrequency: String, Codable, CaseIterable {
    case daily = "daily"
    case often = "often"
    case sometimes = "sometimes"
    case rarely = "rarely"

    var displayName: String {
        switch self {
        case .daily: return "Daily"
        case .often: return "Often (4-5 times/week)"
        case .sometimes: return "Sometimes (2-3 times/week)"
        case .rarely: return "Rarely"
        }
    }
}

enum CookingStyle: String, Codable, CaseIterable {
    case healthy = "healthy"
    case experimental = "experimental"
    case traditional = "traditional"
    case quick = "quick_meals"

    var displayName: String {
        switch self {
        case .healthy: return "Healthy cooking"
        case .experimental: return "Experimental"
        case .traditional: return "Traditional"
        case .quick: return "Quick & easy"
        }
    }
}

enum ExerciseRoutine: String, Codable, CaseIterable {
    case daily = "daily"
    case several = "several_times_week"
    case occasionally = "occasionally"
    case rarely = "rarely"

    var displayName: String {
        switch self {
        case .daily: return "Daily"
        case .several: return "Several times/week"
        case .occasionally: return "Occasionally"
        case .rarely: return "Rarely"
        }
    }
}

enum MusicGenre: String, Codable, CaseIterable {
    case pop, rock, jazz, classical, electronic, hiphop, indie, country

    var displayName: String { rawValue.capitalized }
}

enum MovieGenre: String, Codable, CaseIterable {
    case action, comedy, drama, scifi, horror, documentary, romance, thriller

    var displayName: String {
        switch self {
        case .scifi: return "Sci-Fi"
        default: return rawValue.capitalized
        }
    }
}

enum SocialLevel: String, Codable, CaseIterable {
    case veryIntroverted = "very_introverted"
    case introvert = "introvert"
    case ambivert = "ambivert"
    case extrovert = "extrovert"
    case veryExtroverted = "very_extroverted"

    var displayName: String {
        switch self {
        case .veryIntroverted: return "Very introverted"
        case .introvert: return "Introvert"
        case .ambivert: return "Ambivert"
        case .extrovert: return "Extrovert"
        case .veryExtroverted: return "Very extroverted"
        }
    }
}

enum CommunicationStyle: String, Codable, CaseIterable {
    case direct = "direct"
    case diplomatic = "diplomatic"
    case casual = "casual"

    var displayName: String {
        switch self {
        case .direct: return "Direct & straightforward"
        case .diplomatic: return "Diplomatic & tactful"
        case .casual: return "Casual & easygoing"
        }
    }
}

enum ConflictResolution: String, Codable, CaseIterable {
    case discussImmediately = "discuss_immediately"
    case thinkFirst = "think_first"
    case avoidConflict = "avoid_conflict"

    var displayName: String {
        switch self {
        case .discussImmediately: return "Discuss immediately"
        case .thinkFirst: return "Think first, discuss later"
        case .avoidConflict: return "Prefer to avoid conflict"
        }
    }
}

enum SharedActivitiesLevel: String, Codable, CaseIterable {
    case veryInterested = "very_interested"
    case sometimes = "sometimes"
    case rarely = "rarely"

    var displayName: String {
        switch self {
        case .veryInterested: return "Very interested"
        case .sometimes: return "Sometimes"
        case .rarely: return "Prefer independence"
        }
    }
}

enum PrivacyLevel: String, Codable, CaseIterable {
    case high = "high"
    case moderate = "moderate"
    case low = "low"

    var displayName: String {
        switch self {
        case .high: return "High privacy needs"
        case .moderate: return "Moderate privacy"
        case .low: return "Open & social"
        }
    }
}

enum PersonalityTrait: String, Codable, CaseIterable {
    case organized, spontaneous, adventurous, homebody, creative, analytical
    case optimistic, pragmatic, empathetic, independent, collaborative, focused

    var displayName: String { rawValue.capitalized }
}

enum PersonalValue: String, Codable, CaseIterable {
    case respect, honesty, cleanliness, communication, flexibility, sustainability
    case inclusivity, punctuality, reliability, humor, ambition, balance

    var displayName: String { rawValue.capitalized }
}

enum NeighborhoodVibe: String, Codable, CaseIterable {
    case urban = "urban"
    case suburban = "suburban"
    case quiet = "quiet"
    case trendy = "trendy"
    case studentFriendly = "student_friendly"
    case familyOriented = "family_oriented"

    var displayName: String {
        switch self {
        case .urban: return "Urban & lively"
        case .suburban: return "Suburban"
        case .quiet: return "Quiet & residential"
        case .trendy: return "Trendy & hip"
        case .studentFriendly: return "Student-friendly"
        case .familyOriented: return "Family-oriented"
        }
    }
}

enum TransportationType: String, Codable, CaseIterable {
    case walking = "walking"
    case bike = "bike"
    case publicTransport = "public_transport"
    case car = "car"

    var displayName: String {
        switch self {
        case .walking: return "Walking"
        case .bike: return "Bike"
        case .publicTransport: return "Public transport"
        case .car: return "Car"
        }
    }
}

enum VerificationStatus: String, Codable {
    case unverified = "unverified"
    case pending = "pending"
    case verified = "verified"

    var displayName: String {
        switch self {
        case .unverified: return "Not verified"
        case .pending: return "Verification pending"
        case .verified: return "Verified"
        }
    }
}

struct VerificationDocument: Codable, Identifiable {
    let id: UUID
    let type: DocumentType
    let status: VerificationStatus
    let uploadedAt: Date

    enum DocumentType: String, Codable, CaseIterable {
        case idCard = "id_card"
        case passport = "passport"
        case proofOfIncome = "proof_of_income"
        case studentCard = "student_card"

        var displayName: String {
            switch self {
            case .idCard: return "ID Card"
            case .passport: return "Passport"
            case .proofOfIncome: return "Proof of Income"
            case .studentCard: return "Student Card"
            }
        }
    }
}

// MARK: - Mock Data

extension EnhancedProfile {
    static let mockComplete = EnhancedProfile(
        id: UUID(),
        userId: UUID(),
        currentLivingSituation: .withRoommates,
        moveInTimeframe: .oneMonth,
        budgetRange: BudgetRange(min: 600, max: 900, currency: "EUR"),
        preferredCities: ["Brussels", "Ghent", "Antwerp"],
        flexibleOnLocation: true,
        occupationStatus: .employed,
        occupationField: "Software Development",
        workSchedule: .flexible,
        workFromHome: true,
        hasPets: false,
        petDetails: nil,
        smokingHabits: .nonSmoker,
        dietaryPreferences: [.vegetarian],
        sleepSchedule: .nightOwl,
        cleanlinessLevel: .veryClean,
        noiseLevel: .moderate,
        guestFrequency: .occasionally,
        sharingCommonSpaces: .comfortable,
        cookingFrequency: .often,
        cookingStyle: [.healthy, .experimental],
        exerciseRoutine: .several,
        hobbies: ["Reading", "Hiking", "Photography", "Cooking"],
        musicPreferences: [.indie, .electronic, .jazz],
        moviePreferences: [.scifi, .documentary, .drama],
        socialLevel: .ambivert,
        communicationStyle: .direct,
        conflictResolution: .discussImmediately,
        sharedActivitiesInterest: .sometimes,
        privacyNeeds: .moderate,
        personalityTraits: [.organized, .creative, .empathetic],
        values: [.respect, .honesty, .communication, .sustainability],
        dealBreakers: ["Smoking indoors", "Very loud music after midnight", "Poor hygiene"],
        idealRoommateQualities: ["Respectful", "Clean", "Good communicator", "Reliable"],
        idealPropertyType: .apartment,
        mustHaveAmenities: [.wifi, .washingMachine, .heating],
        niceToHaveAmenities: [.dishwasher, .parking, .garden],
        neighborhoodVibe: [.urban, .trendy],
        transportationPreferences: [.bike, .publicTransport],
        bio: "Software developer who loves cooking and outdoor activities. Looking for a clean, respectful living environment with like-minded people.",
        languages: ["French", "English", "Dutch"],
        profileCompletionPercentage: 95,
        verificationStatus: .verified,
        verifiedDocuments: [
            VerificationDocument(id: UUID(), type: .idCard, status: .verified, uploadedAt: Date()),
            VerificationDocument(id: UUID(), type: .proofOfIncome, status: .verified, uploadedAt: Date())
        ],
        createdAt: Date(),
        updatedAt: Date()
    )

    static let mockIncomplete = EnhancedProfile(
        id: UUID(),
        userId: UUID(),
        currentLivingSituation: .livingAlone,
        moveInTimeframe: .asap,
        budgetRange: BudgetRange(min: 500, max: 800, currency: "EUR"),
        preferredCities: ["Brussels"],
        flexibleOnLocation: false,
        occupationStatus: .student,
        occupationField: "Business",
        workSchedule: nil,
        workFromHome: false,
        hasPets: false,
        petDetails: nil,
        smokingHabits: .nonSmoker,
        dietaryPreferences: nil,
        sleepSchedule: nil,
        cleanlinessLevel: nil,
        noiseLevel: nil,
        guestFrequency: nil,
        sharingCommonSpaces: nil,
        cookingFrequency: nil,
        cookingStyle: nil,
        exerciseRoutine: nil,
        hobbies: nil,
        musicPreferences: nil,
        moviePreferences: nil,
        socialLevel: nil,
        communicationStyle: nil,
        conflictResolution: nil,
        sharedActivitiesInterest: nil,
        privacyNeeds: nil,
        personalityTraits: nil,
        values: nil,
        dealBreakers: nil,
        idealRoommateQualities: nil,
        idealPropertyType: nil,
        mustHaveAmenities: nil,
        niceToHaveAmenities: nil,
        neighborhoodVibe: nil,
        transportationPreferences: nil,
        bio: nil,
        languages: ["French"],
        profileCompletionPercentage: 30,
        verificationStatus: .unverified,
        verifiedDocuments: nil,
        createdAt: Date(),
        updatedAt: Date()
    )
}
