//
//  PropertyComparisonManager.swift
//  EasyCo
//
//  Created by Claude on 11/18/2025.
//

import Foundation
import SwiftUI

// MARK: - Property Comparison Manager

@MainActor
class PropertyComparisonManager: ObservableObject {
    static let shared = PropertyComparisonManager()

    @Published var comparedProperties: [Property] = []
    @Published var maxComparisons = 3 // Maximum number of properties to compare

    private let storageKey = "compared_properties"

    private init() {
        loadComparedProperties()
    }

    // MARK: - Public Methods

    /// Add a property to comparison
    func addToComparison(_ property: Property) {
        guard comparedProperties.count < maxComparisons else {
            print("⚠️ Maximum comparison limit reached")
            return
        }

        guard !isInComparison(property) else {
            print("⚠️ Property already in comparison")
            return
        }

        comparedProperties.append(property)
        saveComparedProperties()
        print("✅ Added property to comparison: \(property.title)")
    }

    /// Remove a property from comparison
    func removeFromComparison(_ property: Property) {
        comparedProperties.removeAll { $0.id == property.id }
        saveComparedProperties()
        print("❌ Removed property from comparison: \(property.title)")
    }

    /// Toggle property in comparison
    func toggleComparison(_ property: Property) {
        if isInComparison(property) {
            removeFromComparison(property)
        } else {
            addToComparison(property)
        }
    }

    /// Check if property is in comparison
    func isInComparison(_ property: Property) -> Bool {
        comparedProperties.contains { $0.id == property.id }
    }

    /// Clear all comparisons
    func clearAll() {
        comparedProperties.removeAll()
        saveComparedProperties()
        print("🗑️ Cleared all comparisons")
    }

    /// Check if can add more properties
    var canAddMore: Bool {
        comparedProperties.count < maxComparisons
    }

    /// Get comparison count
    var count: Int {
        comparedProperties.count
    }

    // MARK: - Persistence

    private func saveComparedProperties() {
        // Save only property IDs for persistence
        let propertyIds = comparedProperties.map { $0.id.uuidString }
        UserDefaults.standard.set(propertyIds, forKey: storageKey)
    }

    private func loadComparedProperties() {
        guard let propertyIds = UserDefaults.standard.array(forKey: storageKey) as? [String] else {
            return
        }

        // TODO: Load actual properties from API using IDs
        // For now, we'll just clear the stored IDs since we can't restore without API
        comparedProperties = []
        print("📋 Loaded \(propertyIds.count) property IDs from storage")
    }
}

// MARK: - Comparison Feature

/// Feature category for comparison
enum ComparisonFeature: String, CaseIterable {
    case price = "Price"
    case location = "Location"
    case size = "Size"
    case bedrooms = "Bedrooms"
    case bathrooms = "Bathrooms"
    case type = "Type"
    case amenities = "Amenities"
    case availability = "Availability"
    case transport = "Transport"
    case score = "Match Score"

    var icon: String {
        switch self {
        case .price: return "eurosign.circle"
        case .location: return "location"
        case .size: return "square"
        case .bedrooms: return "bed.double"
        case .bathrooms: return "shower"
        case .type: return "house"
        case .amenities: return "star"
        case .availability: return "calendar"
        case .transport: return "tram"
        case .score: return "heart"
        }
    }

    var description: String {
        switch self {
        case .price: return "Monthly rent"
        case .location: return "Address and area"
        case .size: return "Total living space"
        case .bedrooms: return "Number of bedrooms"
        case .bathrooms: return "Number of bathrooms"
        case .type: return "Property type"
        case .amenities: return "Available amenities"
        case .availability: return "Move-in date"
        case .transport: return "Public transport"
        case .score: return "Compatibility score"
        }
    }

    /// Extract value from property for this feature
    func value(for property: Property) -> String {
        switch self {
        case .price:
            return "€\(Int(property.price))/mo"
        case .location:
            return "\(property.city), \(property.address)"
        case .size:
            return "\(property.surface ?? 0)m²"
        case .bedrooms:
            return "\(property.bedrooms)"
        case .bathrooms:
            return "\(property.bathrooms ?? 1)"
        case .type:
            return property.type.displayName
        case .amenities:
            return "\(property.amenities.count) amenities"
        case .availability:
            let formatter = DateFormatter()
            formatter.dateStyle = .medium
            return property.availableFrom.map { formatter.string(from: $0) } ?? "Now"
        case .transport:
            // TODO: Add transport info to Property model
            return "Near metro"
        case .score:
            return "\(property.matchScore ?? 0)%"
        }
    }

    /// Get detailed amenities list
    func amenitiesList(for property: Property) -> [String] {
        property.amenities.map { $0.displayName }
    }

    /// Compare values and return winner index (nil if tie)
    func compareProperties(_ properties: [Property]) -> Int? {
        guard properties.count >= 2 else { return nil }

        switch self {
        case .price:
            // Lower is better
            let minPrice = properties.map { $0.price }.min()
            return properties.firstIndex { $0.price == minPrice }

        case .size:
            // Larger is better
            let maxSize = properties.compactMap { $0.surface }.max()
            return properties.firstIndex { $0.surface == maxSize }

        case .bedrooms:
            // More is better
            let maxBedrooms = properties.map { $0.bedrooms }.max()
            return properties.firstIndex { $0.bedrooms == maxBedrooms }

        case .bathrooms:
            // More is better
            let maxBathrooms = properties.compactMap { $0.bathrooms }.max()
            return properties.firstIndex { $0.bathrooms == maxBathrooms }

        case .amenities:
            // More is better
            let maxAmenities = properties.map { $0.amenities.count }.max()
            return properties.firstIndex { $0.amenities.count == maxAmenities }

        case .score:
            // Higher score is better
            let maxScore = properties.compactMap { $0.matchScore }.max()
            return properties.firstIndex { $0.matchScore == maxScore }

        case .location, .type, .availability, .transport:
            // No clear winner for these
            return nil
        }
    }
}

// MARK: - Comparison Result

struct ComparisonResult {
    let feature: ComparisonFeature
    let values: [String]
    let winnerIndex: Int?

    var hasWinner: Bool {
        winnerIndex != nil
    }
}
