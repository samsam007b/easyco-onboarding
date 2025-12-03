//
//  MatchFilters.swift
//  EasyCo
//

import Foundation

struct MatchFilters: Codable, Equatable {
    var minMatchScore: Double = 0.0
    var maxDistance: Double?
    var minPrice: Double?
    var maxPrice: Double?
    var cities: [String] = []
    var propertyTypes: [PropertyType] = []
    var minBedrooms: Int?
    var minSurface: Double?
    var requiredAmenities: [String] = []
    var furnished: Bool?
    var petsAllowed: Bool?

    static var `default`: MatchFilters {
        MatchFilters()
    }

    func toPropertyFilters() -> PropertyFilters {
        PropertyFilters(
            minPrice: minPrice,
            maxPrice: maxPrice,
            cities: cities,
            propertyTypes: propertyTypes,
            minBedrooms: minBedrooms,
            minSurface: minSurface,
            amenities: requiredAmenities,
            furnished: furnished,
            petsAllowed: petsAllowed
        )
    }
}
