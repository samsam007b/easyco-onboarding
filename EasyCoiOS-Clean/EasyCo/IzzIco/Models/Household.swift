//
//  Household.swift
//  IzzIco
//
//  Modèle représentant une colocation (household)
//  Utilisé pour gérer les informations de la colocation des résidents
//

import Foundation

struct Household: Identifiable, Codable {
    let id: UUID
    var name: String
    var propertyId: UUID
    var address: String
    var city: String
    var postalCode: String
    var country: String
    var maxOccupants: Int
    var currentOccupants: Int
    var ownerId: UUID
    var residentIds: [UUID]
    var moveInDate: Date
    var createdAt: Date
    var updatedAt: Date

    // Computed properties
    var isFullyOccupied: Bool {
        currentOccupants >= maxOccupants
    }

    var availableSpots: Int {
        max(0, maxOccupants - currentOccupants)
    }

    var fullAddress: String {
        "\(address), \(postalCode) \(city), \(country)"
    }

    init(
        id: UUID = UUID(),
        name: String,
        propertyId: UUID,
        address: String,
        city: String,
        postalCode: String,
        country: String = "Belgique",
        maxOccupants: Int,
        currentOccupants: Int,
        ownerId: UUID,
        residentIds: [UUID] = [],
        moveInDate: Date = Date(),
        createdAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.id = id
        self.name = name
        self.propertyId = propertyId
        self.address = address
        self.city = city
        self.postalCode = postalCode
        self.country = country
        self.maxOccupants = maxOccupants
        self.currentOccupants = currentOccupants
        self.ownerId = ownerId
        self.residentIds = residentIds
        self.moveInDate = moveInDate
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}

// MARK: - Mock Data pour mode démo
extension Household {
    static let mockHousehold = Household(
        name: "Colocation du Centre",
        propertyId: UUID(),
        address: "15 Rue de la Paix",
        city: "Bruxelles",
        postalCode: "1000",
        maxOccupants: 4,
        currentOccupants: 3,
        ownerId: UUID(),
        residentIds: [UUID(), UUID(), UUID()],
        moveInDate: Calendar.current.date(byAdding: .month, value: -6, to: Date())!
    )

    static let mockHouseholds: [Household] = [
        mockHousehold,
        Household(
            name: "Maison des Étudiants",
            propertyId: UUID(),
            address: "42 Avenue Louise",
            city: "Ixelles",
            postalCode: "1050",
            maxOccupants: 5,
            currentOccupants: 5,
            ownerId: UUID(),
            residentIds: [UUID(), UUID(), UUID(), UUID(), UUID()],
            moveInDate: Calendar.current.date(byAdding: .month, value: -12, to: Date())!
        )
    ]
}
