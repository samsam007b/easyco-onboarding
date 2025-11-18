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

    // Mock data for demo mode
    static var mockGroups: [SearchGroup] {
        let now = Date()

        return [
            SearchGroup(
                id: UUID(),
                name: "Coloc Centre-ville Paris",
                description: "Groupe de 4 personnes cherchant une colocation dans le centre de Paris avec un bon rapport qualité/prix",
                members: [UUID(), UUID(), UUID(), UUID()],
                adminID: UUID(),
                preferences: SearchPreferences(
                    minPrice: 800,
                    maxPrice: 1200,
                    propertyTypes: [.apartment],
                    cities: ["Paris", "Boulogne-Billancourt"],
                    minBedrooms: 4,
                    amenities: [.wifi, .washingMachine, .kitchen]
                ),
                createdAt: now,
                updatedAt: now
            ),
            SearchGroup(
                id: UUID(),
                name: "Étudiants Lyon 3",
                description: "3 étudiants en master cherchent un appartement près de l'université Lyon 3",
                members: [UUID(), UUID(), UUID()],
                adminID: UUID(),
                preferences: SearchPreferences(
                    minPrice: 600,
                    maxPrice: 900,
                    propertyTypes: [.apartment],
                    cities: ["Lyon", "Villeurbanne"],
                    minBedrooms: 3,
                    amenities: [.wifi, .kitchen]
                ),
                createdAt: now,
                updatedAt: now
            ),
            SearchGroup(
                id: UUID(),
                name: "Jeunes pro Toulouse",
                description: "Groupe de jeunes professionnels cherchant une grande colocation confortable à Toulouse",
                members: [UUID(), UUID(), UUID(), UUID(), UUID()],
                adminID: UUID(),
                preferences: SearchPreferences(
                    minPrice: 700,
                    maxPrice: 1000,
                    propertyTypes: [.house, .apartment],
                    cities: ["Toulouse", "Colomiers"],
                    minBedrooms: 5,
                    amenities: [.wifi, .dishwasher, .terrace, .parking, .kitchen]
                ),
                createdAt: now,
                updatedAt: now
            )
        ]
    }
}

struct SearchPreferences: Codable {
    var minPrice: Double?
    var maxPrice: Double?
    var propertyTypes: [PropertyType]
    var cities: [String]
    var minBedrooms: Int?
    var amenities: [PropertyAmenity]
}
