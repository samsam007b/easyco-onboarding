//
//  PropertyFilters.swift
//  IzzIco
//
//  Property search and filter options
//

import Foundation

struct PropertyFilters: Codable, Equatable {
    // Location
    var city: String?
    var arrondissement: String?
    var neighborhood: String?
    var maxDistance: Double? // in km

    // Price
    var minPrice: Int?
    var maxPrice: Int?

    // Property characteristics
    var minBedrooms: Int?
    var maxBedrooms: Int?
    var minBathrooms: Int?
    var minSurface: Int? // in m²
    var maxSurface: Int?

    // Property type
    var propertyTypes: [PropertyType]?

    // Amenities
    var furnished: Bool?
    var petsAllowed: Bool?
    var smokingAllowed: Bool?
    var parking: Bool?
    var elevator: Bool?
    var balcony: Bool?
    var garden: Bool?

    // Availability
    var availableFrom: Date?
    var minLeaseDuration: Int? // in months

    init() {}

    static var `default`: PropertyFilters {
        PropertyFilters()
    }

    mutating func reset() {
        self = PropertyFilters()
    }

    var isActive: Bool {
        city != nil ||
        arrondissement != nil ||
        minPrice != nil ||
        maxPrice != nil ||
        minBedrooms != nil ||
        propertyTypes != nil
    }
}
