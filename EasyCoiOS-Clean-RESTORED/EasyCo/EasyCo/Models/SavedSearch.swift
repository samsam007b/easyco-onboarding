import Foundation

// MARK: - Saved Search Model

struct SavedSearch: Identifiable, Codable {
    let id: UUID
    let name: String
    let filters: PropertyFilters
    let createdAt: Date
    var notificationsEnabled: Bool
    var lastNotificationDate: Date?

    init(
        id: UUID = UUID(),
        name: String,
        filters: PropertyFilters,
        createdAt: Date = Date(),
        notificationsEnabled: Bool = true,
        lastNotificationDate: Date? = nil
    ) {
        self.id = id
        self.name = name
        self.filters = filters
        self.createdAt = createdAt
        self.notificationsEnabled = notificationsEnabled
        self.lastNotificationDate = lastNotificationDate
    }
}

// MARK: - Mock Data

extension SavedSearch {
    static let mockSearches: [SavedSearch] = [
        SavedSearch(
            name: "Studio Paris Centre",
            filters: PropertyFilters(
                minPrice: 600,
                maxPrice: 900,
                cities: ["Paris", "Paris 1er", "Paris 2e", "Paris 3e"],
                propertyTypes: [.studio],
                minBedrooms: 1,
                minBathrooms: 1,
                amenities: [.wifi, .washingMachine]
            ),
            createdAt: Date().addingTimeInterval(-7 * 24 * 60 * 60), // 7 jours
            notificationsEnabled: true
        ),
        SavedSearch(
            name: "Colocation Bruxelles",
            filters: PropertyFilters(
                minPrice: 400,
                maxPrice: 700,
                cities: ["Bruxelles", "Ixelles", "Etterbeek"],
                propertyTypes: [.coliving, .apartment],
                minBedrooms: 3,
                minBathrooms: 1,
                amenities: [.wifi, .parking, .washingMachine]
            ),
            createdAt: Date().addingTimeInterval(-14 * 24 * 60 * 60), // 14 jours
            notificationsEnabled: false
        ),
        SavedSearch(
            name: "Appartement Lyon avec jardin",
            filters: PropertyFilters(
                minPrice: 800,
                maxPrice: 1200,
                cities: ["Lyon", "Villeurbanne"],
                propertyTypes: [.apartment, .house],
                minBedrooms: 2,
                minBathrooms: 1,
                amenities: [.garden, .parking, .wifi]
            ),
            createdAt: Date().addingTimeInterval(-3 * 24 * 60 * 60), // 3 jours
            notificationsEnabled: true
        )
    ]
}
