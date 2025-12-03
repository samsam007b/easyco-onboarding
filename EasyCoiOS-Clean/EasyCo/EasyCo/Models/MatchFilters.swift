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
        var filters = PropertyFilters()
        filters.minPrice = minPrice.map { Int($0) }
        filters.maxPrice = maxPrice.map { Int($0) }
        filters.city = cities.first
        filters.propertyTypes = propertyTypes.isEmpty ? nil : propertyTypes
        filters.minBedrooms = minBedrooms
        filters.minSurface = minSurface.map { Int($0) }
        filters.furnished = furnished
        filters.petsAllowed = petsAllowed
        return filters
    }
}
