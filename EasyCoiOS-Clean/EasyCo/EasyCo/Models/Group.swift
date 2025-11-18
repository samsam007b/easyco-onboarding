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
}

struct SearchPreferences: Codable {
    var minPrice: Double?
    var maxPrice: Double?
    var propertyTypes: [PropertyType]
    var cities: [String]
    var minBedrooms: Int?
    var amenities: [PropertyAmenity]
}
