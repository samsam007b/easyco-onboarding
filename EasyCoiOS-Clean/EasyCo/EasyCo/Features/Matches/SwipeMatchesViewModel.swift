import Foundation
import SwiftUI

// MARK: - Swipe Matches ViewModel

@MainActor
class SwipeMatchesViewModel: ObservableObject {
    @Published var properties: [Property] = []
    @Published var isLoading = false
    @Published var error: NetworkError?
    @Published var showFilters = false
    @Published var filters = MatchFilters()
    @Published var canUndo = false
    @Published var lastSwipedProperty: Property?
    @Published var matchResult: MatchResult?

    private let apiClient = APIClient.shared
    private var swipedPropertyIds: Set<UUID> = []
    private var swipeHistory: [(property: Property, direction: SwipeDirection)] = []

    // MARK: - Load Properties

    func loadProperties() async {
        isLoading = true
        error = nil

        do {
            // Build property filters from match filters
            let propertyFilters = filters.toPropertyFilters()

            // Fetch matched properties from API with scoring
            let matchedProperties = try await apiClient.request(
                .getMatches(filters: propertyFilters),
                responseType: [Property].self
            )

            // Filter out already swiped and sort by compatibility score
            properties = matchedProperties
                .filter { !swipedPropertyIds.contains($0.id) }
                .sorted { ($0.compatibilityScore ?? 0) > ($1.compatibilityScore ?? 0) }

            print("✅ Loaded \(properties.count) matched properties")
        } catch let networkError as NetworkError {
            self.error = networkError
            print("❌ Error loading matches: \(networkError)")

            // Fallback to regular properties in demo mode
            if AppConfig.FeatureFlags.demoMode {
                await loadFallbackProperties()
            }
        } catch {
            self.error = .unknown(error)
            print("❌ Error loading matches: \(error)")
        }

        isLoading = false
    }

    private func loadFallbackProperties() async {
        do {
            let allProperties = try await apiClient.getProperties()

            // Apply local filtering and scoring
            properties = allProperties
                .filter { !swipedPropertyIds.contains($0.id) }
                .filter { filters.matches(property: $0) }
                .map { property in
                    var mutableProperty = property
                    mutableProperty.compatibilityScore = calculateLocalScore(for: property)
                    return mutableProperty
                }
                .sorted { ($0.compatibilityScore ?? 0) > ($1.compatibilityScore ?? 0) }

        } catch {
            print("❌ Error loading fallback properties: \(error)")
        }
    }

    // MARK: - Handle Swipe

    func handleSwipe(property: Property, direction: SwipeDirection) async {
        // Save for undo
        lastSwipedProperty = property
        swipeHistory.append((property: property, direction: direction))
        canUndo = true

        // Mark as swiped
        swipedPropertyIds.insert(property.id)

        // Remove from stack
        withAnimation(.spring(response: 0.3)) {
            properties.removeAll { $0.id == property.id }
        }

        // Send to backend
        switch direction {
        case .right:
            await likeProperty(property)
        case .left:
            await dislikeProperty(property)
        }

        // Auto-load more if running low
        if properties.count < 3 {
            await loadMoreProperties()
        }
    }

    // MARK: - Undo Last Swipe

    func undoLastSwipe() async {
        guard let lastSwipe = swipeHistory.popLast() else { return }

        // Remove from swiped
        swipedPropertyIds.remove(lastSwipe.property.id)

        // Add back to stack
        withAnimation(.spring(response: 0.3)) {
            properties.insert(lastSwipe.property, at: 0)
        }

        // Notify backend
        do {
            try await apiClient.request(.undoSwipe)
        } catch {
            print("❌ Error undoing swipe: \(error)")
        }

        canUndo = !swipeHistory.isEmpty
        lastSwipedProperty = swipeHistory.last?.property
    }

    // MARK: - Like/Dislike Actions

    private func likeProperty(_ property: Property) async {
        do {
            // Call match API endpoint
            try await apiClient.request(.likeProperty(id: property.id))
            print("❤️ Liked property: \(property.title)")

            // Check if this created a match
            await checkForMatch(propertyId: property.id)
        } catch {
            print("❌ Error liking property: \(error)")
            // Still add to favorites as fallback
            try? await apiClient.addFavorite(propertyId: property.id.uuidString)
        }
    }

    private func dislikeProperty(_ property: Property) async {
        do {
            try await apiClient.request(.dislikeProperty(id: property.id))
            print("👎 Disliked property: \(property.title)")
        } catch {
            print("❌ Error disliking property: \(error)")
        }
    }

    private func checkForMatch(propertyId: UUID) async {
        // The API would return match info if mutual interest exists
        // For now, we'll check via a separate call
        do {
            let scoreResponse = try await apiClient.request(
                .getMatchScore(propertyId: propertyId),
                responseType: MatchScoreResponse.self
            )

            if scoreResponse.isMatch {
                matchResult = MatchResult(
                    propertyId: propertyId,
                    propertyTitle: scoreResponse.propertyTitle ?? "",
                    ownerName: scoreResponse.ownerName ?? "",
                    conversationId: scoreResponse.conversationId
                )
            }
        } catch {
            // Match check failed, not critical
        }
    }

    // MARK: - Load More

    private func loadMoreProperties() async {
        let propertyFilters = filters.toPropertyFilters()

        do {
            let moreProperties = try await apiClient.request(
                .getMatches(filters: propertyFilters),
                responseType: [Property].self
            )

            let newProperties = moreProperties
                .filter { !swipedPropertyIds.contains($0.id) }
                .sorted { ($0.compatibilityScore ?? 0) > ($1.compatibilityScore ?? 0) }

            withAnimation {
                properties.append(contentsOf: newProperties)
            }
        } catch {
            print("❌ Error loading more properties: \(error)")
        }
    }

    // MARK: - Apply Filters

    func applyFilters(_ newFilters: MatchFilters) async {
        filters = newFilters
        properties.removeAll()
        swipedPropertyIds.removeAll()
        await loadProperties()
    }

    // MARK: - Local Scoring (Fallback)

    private func calculateLocalScore(for property: Property) -> Int {
        var score = 50 // Base score

        // Price match
        if let minPrice = filters.minPrice, let maxPrice = filters.maxPrice {
            if property.monthlyRent >= Double(minPrice) && property.monthlyRent <= Double(maxPrice) {
                score += 20
            } else if property.monthlyRent < Double(minPrice) {
                score += 10 // Under budget is okay
            }
        }

        // City match
        if !filters.cities.isEmpty {
            if filters.cities.contains(property.city) {
                score += 15
            }
        }

        // Room requirements
        if let minBedrooms = filters.minBedrooms, property.bedrooms >= minBedrooms {
            score += 10
        }

        // Amenities match
        if !filters.requiredAmenities.isEmpty {
            let matchedAmenities = filters.requiredAmenities.filter { property.amenities.contains($0) }
            score += matchedAmenities.count * 3
        }

        // Availability
        if property.isAvailable {
            score += 5
        }

        return min(score, 100)
    }

    // MARK: - Reset

    func reset() {
        swipedPropertyIds.removeAll()
        swipeHistory.removeAll()
        properties.removeAll()
        canUndo = false
        lastSwipedProperty = nil
        matchResult = nil
    }
}

// MARK: - Match Filters

// struct MatchFilters: Equatable {
//     var cities: [String] = []
//     var minPrice: Int?
//     var maxPrice: Int?
//     var propertyTypes: [PropertyType] = []
//     var minBedrooms: Int?
//     var minBathrooms: Int?
//     var minSurface: Int?
//     var requiredAmenities: [PropertyAmenity] = []
//     var furnished: Bool?
//     var petsAllowed: Bool?
//     var availableFrom: Date?
// 
//     func toPropertyFilters() -> PropertyFilters {
//         var filters = PropertyFilters()
//         filters.cities = cities
//         filters.minPrice = minPrice
//         filters.maxPrice = maxPrice
//         filters.propertyTypes = propertyTypes
//         filters.minBedrooms = minBedrooms
//         filters.amenities = requiredAmenities
//         filters.availableFrom = availableFrom
//         return filters
//     }
// 
//     func matches(property: Property) -> Bool {
        // Price check
//         if let minPrice = minPrice, property.monthlyRent < Double(minPrice) {
//             return false
//         }
//         if let maxPrice = maxPrice, property.monthlyRent > Double(maxPrice) {
//             return false
//         }
// 
        // City check
//         if !cities.isEmpty && !cities.contains(property.city) {
//             return false
//         }
// 
        // Property type check
//         if !propertyTypes.isEmpty && !propertyTypes.contains(property.propertyType) {
//             return false
//         }
// 
        // Bedrooms check
//         if let minBedrooms = minBedrooms, property.bedrooms < minBedrooms {
//             return false
//         }
// 
        // Surface check
//         if let minSurface = minSurface, let surface = property.surfaceArea, Int(surface) < minSurface {
//             return false
//         }
// 
        // Furnished check
//         if let furnished = furnished, property.furnished != furnished {
//             return false
//         }
// 
        // Pets check
//         if let petsAllowed = petsAllowed, petsAllowed && !property.petsAllowed {
//             return false
//         }
// 
        // Required amenities check
//         if !requiredAmenities.isEmpty {
//             let hasAll = requiredAmenities.allSatisfy { property.amenities.contains($0) }
//             if !hasAll {
//                 return false
//             }
//         }
// 
//         return true
//     }
// }

// MARK: - Match Score Response

struct MatchScoreResponse: Codable {
    let score: Int
    let isMatch: Bool
    let propertyTitle: String?
    let ownerName: String?
    let conversationId: UUID?

    enum CodingKeys: String, CodingKey {
        case score
        case isMatch = "is_match"
        case propertyTitle = "property_title"
        case ownerName = "owner_name"
        case conversationId = "conversation_id"
    }
}

// MARK: - Match Result

struct MatchResult: Identifiable {
    let id = UUID()
    let propertyId: UUID
    let propertyTitle: String
    let ownerName: String
    let conversationId: UUID?
}
