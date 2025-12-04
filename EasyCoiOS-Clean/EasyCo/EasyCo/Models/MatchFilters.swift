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

    func matches(property: Property) -> Bool {
        // Price check
        if let minPrice = minPrice, property.monthlyRent < minPrice {
            return false
        }
        if let maxPrice = maxPrice, property.monthlyRent > maxPrice {
            return false
        }

        // City check
        if !cities.isEmpty && !cities.contains(property.city) {
            return false
        }

        // Property type check
        if !propertyTypes.isEmpty && !propertyTypes.contains(property.propertyType) {
            return false
        }

        // Bedrooms check
        if let minBedrooms = minBedrooms, property.bedrooms < minBedrooms {
            return false
        }

        // Surface check
        if let minSurface = minSurface, let surface = property.surfaceArea, surface < minSurface {
            return false
        }

        // Furnished check
        if let furnished = furnished, property.furnished != furnished {
            return false
        }

        // Pets check
        if let petsAllowed = petsAllowed, petsAllowed && !property.petsAllowed {
            return false
        }

        // Required amenities check
        if !requiredAmenities.isEmpty {
            let propertyAmenityStrings = property.amenities.map { $0.rawValue }
            let hasAll = requiredAmenities.allSatisfy { propertyAmenityStrings.contains($0) }
            if !hasAll {
                return false
            }
        }

        return true
    }
}
