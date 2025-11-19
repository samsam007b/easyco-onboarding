import Foundation

// MARK: - Alert Model

/// Represents a user alert/notification preference
struct Alert: Identifiable, Codable {
    let id: UUID
    let userID: UUID
    let type: AlertType
    let title: String
    let criteria: AlertCriteria
    var isActive: Bool
    var frequency: AlertFrequency
    var lastTriggered: Date?
    var triggerCount: Int
    let createdAt: Date
    var updatedAt: Date

    enum CodingKeys: String, CodingKey {
        case id, title, type, criteria, frequency
        case userID = "user_id"
        case isActive = "is_active"
        case lastTriggered = "last_triggered"
        case triggerCount = "trigger_count"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

// MARK: - Alert Type

enum AlertType: String, Codable, CaseIterable {
    case newProperty = "new_property"
    case priceChange = "price_change"
    case newMatch = "new_match"
    case newMessage = "new_message"
    case applicationUpdate = "application_update"
    case savedSearch = "saved_search"

    var displayName: String {
        switch self {
        case .newProperty: return "Nouvelle propriété"
        case .priceChange: return "Changement de prix"
        case .newMatch: return "Nouveau match"
        case .newMessage: return "Nouveau message"
        case .applicationUpdate: return "Mise à jour candidature"
        case .savedSearch: return "Recherche sauvegardée"
        }
    }

    var icon: String {
        switch self {
        case .newProperty: return "house.fill"
        case .priceChange: return "arrow.down.circle.fill"
        case .newMatch: return "heart.fill"
        case .newMessage: return "message.fill"
        case .applicationUpdate: return "doc.text.fill"
        case .savedSearch: return "magnifyingglass"
        }
    }

    var color: String {
        switch self {
        case .newProperty: return "#10B981"
        case .priceChange: return "#F59E0B"
        case .newMatch: return "#EF4444"
        case .newMessage: return "#3B82F6"
        case .applicationUpdate: return "#8B5CF6"
        case .savedSearch: return "#06B6D4"
        }
    }
}

// MARK: - Alert Frequency

enum AlertFrequency: String, Codable, CaseIterable {
    case instant = "instant"
    case daily = "daily"
    case weekly = "weekly"

    var displayName: String {
        switch self {
        case .instant: return "Instantané"
        case .daily: return "Quotidien"
        case .weekly: return "Hebdomadaire"
        }
    }
}

// MARK: - Alert Criteria

struct AlertCriteria: Codable {
    // Location
    var cities: [String]?
    var neighborhoods: [String]?
    var radius: Double? // in km

    // Property Type
    var propertyTypes: [PropertyType]?

    // Price Range
    var minPrice: Double?
    var maxPrice: Double?

    // Size
    var minBedrooms: Int?
    var maxBedrooms: Int?
    var minSurfaceArea: Double?

    // Amenities
    var requiredAmenities: [PropertyAmenity]?

    // Availability
    var availableFrom: Date?
    var minimumStay: Int? // in months
    var maximumStay: Int? // in months

    // Other
    var furnished: Bool?
    var petsAllowed: Bool?
    var smokingAllowed: Bool?

    func matches(property: Property) -> Bool {
        // Check cities
        if let cities = cities, !cities.isEmpty {
            guard cities.contains(property.city) else { return false }
        }

        // Check neighborhoods
        if let neighborhoods = neighborhoods, !neighborhoods.isEmpty, let propertyNeighborhood = property.neighborhood {
            guard neighborhoods.contains(propertyNeighborhood) else { return false }
        }

        // Check property types
        if let propertyTypes = propertyTypes, !propertyTypes.isEmpty {
            guard propertyTypes.contains(property.propertyType) else { return false }
        }

        // Check price range
        if let minPrice = minPrice {
            guard property.monthlyRent >= minPrice else { return false }
        }
        if let maxPrice = maxPrice {
            guard property.monthlyRent <= maxPrice else { return false }
        }

        // Check bedrooms
        if let minBedrooms = minBedrooms {
            guard property.bedrooms >= minBedrooms else { return false }
        }
        if let maxBedrooms = maxBedrooms {
            guard property.bedrooms <= maxBedrooms else { return false }
        }

        // Check surface area
        if let minSurfaceArea = minSurfaceArea, let propertySurfaceArea = property.surfaceArea {
            guard propertySurfaceArea >= minSurfaceArea else { return false }
        }

        // Check required amenities
        if let requiredAmenities = requiredAmenities, !requiredAmenities.isEmpty {
            let propertyAmenities = Set(property.amenities)
            let required = Set(requiredAmenities)
            guard required.isSubset(of: propertyAmenities) else { return false }
        }

        // Check furnished
        if let furnished = furnished {
            guard property.furnished == furnished else { return false }
        }

        // Check pets allowed
        if let petsAllowed = petsAllowed {
            guard property.petsAllowed == petsAllowed else { return false }
        }

        // Check smoking allowed
        if let smokingAllowed = smokingAllowed {
            guard property.smokingAllowed == smokingAllowed else { return false }
        }

        return true
    }
}

// MARK: - Alert Preferences

struct AlertPreferences: Codable {
    let userID: UUID
    var pushNotificationsEnabled: Bool
    var emailNotificationsEnabled: Bool
    var enabledAlertTypes: [AlertType]
    var quietHoursStart: Date?
    var quietHoursEnd: Date?

    enum CodingKeys: String, CodingKey {
        case enabledAlertTypes = "enabled_alert_types"
        case userID = "user_id"
        case pushNotificationsEnabled = "push_notifications_enabled"
        case emailNotificationsEnabled = "email_notifications_enabled"
        case quietHoursStart = "quiet_hours_start"
        case quietHoursEnd = "quiet_hours_end"
    }
}

// MARK: - Mock Data

extension Alert {
    static let mockAlerts: [Alert] = [
        Alert(
            id: UUID(),
            userID: UUID(),
            type: .savedSearch,
            title: "Studio à Paris < 900€",
            criteria: AlertCriteria(
                cities: ["Paris"],
                propertyTypes: [.studio],
                minPrice: nil,
                maxPrice: 900
            ),
            isActive: true,
            frequency: .instant,
            lastTriggered: Date().addingTimeInterval(-3600 * 2),
            triggerCount: 5,
            createdAt: Date().addingTimeInterval(-86400 * 7),
            updatedAt: Date().addingTimeInterval(-3600 * 2)
        ),
        Alert(
            id: UUID(),
            userID: UUID(),
            type: .priceChange,
            title: "Baisse de prix",
            criteria: AlertCriteria(
                cities: ["Paris", "Lyon"],
                propertyTypes: [.apartment, .coliving]
            ),
            isActive: true,
            frequency: .daily,
            lastTriggered: Date().addingTimeInterval(-86400),
            triggerCount: 2,
            createdAt: Date().addingTimeInterval(-86400 * 14),
            updatedAt: Date().addingTimeInterval(-86400)
        ),
        Alert(
            id: UUID(),
            userID: UUID(),
            type: .newMatch,
            title: "Nouveaux matchs",
            criteria: AlertCriteria(),
            isActive: true,
            frequency: .instant,
            lastTriggered: nil,
            triggerCount: 0,
            createdAt: Date().addingTimeInterval(-86400 * 3),
            updatedAt: Date().addingTimeInterval(-86400 * 3)
        )
    ]
}

extension AlertPreferences {
    static var mock: AlertPreferences {
        AlertPreferences(
            userID: UUID(),
            pushNotificationsEnabled: true,
            emailNotificationsEnabled: false,
            enabledAlertTypes: [.newProperty, .newMatch, .newMessage],
            quietHoursStart: nil,
            quietHoursEnd: nil
        )
    }
}
