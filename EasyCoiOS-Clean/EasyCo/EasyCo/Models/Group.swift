//
//  Group.swift
//  EasyCo
//
//  Created by Claude on 11/11/2025.
//

import Foundation

struct SearchGroup: Identifiable, Codable {
    let id: UUID
    var name: String
    var description: String
    var members: [UUID]
    var adminID: UUID
    var preferences: SearchPreferences
    var createdAt: Date
    var updatedAt: Date

    enum CodingKeys: String, CodingKey {
        case id, name, description, members, preferences
        case adminID = "admin_id"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

struct SearchPreferences: Codable {
    var minPrice: Double?
    var maxPrice: Double?
    var propertyTypes: [PropertyType]
    var cities: [String]
    var minBedrooms: Int?
    var amenities: [PropertyAmenity]

    enum CodingKeys: String, CodingKey {
        case propertyTypes = "property_types"
        case minPrice = "min_price"
        case maxPrice = "max_price"
        case minBedrooms = "min_bedrooms"
        case cities, amenities
    }
}

// MARK: - Mock Data

extension SearchGroup {
    static var mockGroups: [SearchGroup] {
        [
            SearchGroup(
                id: UUID(),
                name: "Les Colocs du Centre",
                description: "Groupe de 3 amis cherchant un appartement dans le centre-ville de Bruxelles",
                members: [UUID(), UUID(), UUID()],
                adminID: UUID(),
                preferences: SearchPreferences(
                    minPrice: 400,
                    maxPrice: 700,
                    propertyTypes: [.coliving, .apartment],
                    cities: ["Bruxelles", "Ixelles"],
                    minBedrooms: 3,
                    amenities: [.wifi, .washingMachine]
                ),
                createdAt: Date(),
                updatedAt: Date()
            ),
            SearchGroup(
                id: UUID(),
                name: "Expats Brussels",
                description: "International group looking for shared accommodation",
                members: [UUID(), UUID()],
                adminID: UUID(),
                preferences: SearchPreferences(
                    minPrice: 500,
                    maxPrice: 900,
                    propertyTypes: [.coliving],
                    cities: ["Bruxelles"],
                    minBedrooms: 2,
                    amenities: [.wifi, .gym]
                ),
                createdAt: Date(),
                updatedAt: Date()
            )
        ]
    }
}
