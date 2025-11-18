import Foundation
import SwiftUI

// MARK: - Swipe Matches ViewModel

@MainActor
class SwipeMatchesViewModel: ObservableObject {
    @Published var properties: [Property] = []
    @Published var isLoading = false
    @Published var error: NetworkError?

    private let apiClient = APIClient.shared
    private var swipedPropertyIds: Set<UUID> = []

    // MARK: - Load Properties

    func loadProperties() async {
        isLoading = true
        error = nil

        do {
            // Fetch properties from Supabase
            let allProperties = try await apiClient.getProperties()

            // Filter out already swiped properties
            properties = allProperties.filter { !swipedPropertyIds.contains($0.id) }

            print("✅ Loaded \(properties.count) properties for swiping")
        } catch {
            self.error = error as? NetworkError ?? .unknown(error)
            print("❌ Error loading properties: \(error)")
        }

        isLoading = false
    }

    // MARK: - Handle Swipe

    func handleSwipe(property: Property, direction: SwipeDirection) async {
        // Mark as swiped
        swipedPropertyIds.insert(property.id)

        // Remove from stack
        withAnimation {
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
        if properties.count < 5 {
            await loadMoreProperties()
        }
    }

    // MARK: - Like/Dislike Actions

    private func likeProperty(_ property: Property) async {
        do {
            // Add to favorites
            try await apiClient.addFavorite(propertyId: property.id.uuidString)
            print("❤️ Liked property: \(property.title)")

            // TODO: Check for match with property owner
            // If owner also liked this user, create a match and conversation
        } catch {
            print("❌ Error liking property: \(error)")
        }
    }

    private func dislikeProperty(_ property: Property) async {
        // Record dislike in backend (optional)
        print("👎 Disliked property: \(property.title)")

        // TODO: Send dislike to backend for analytics
        // This helps improve recommendations
    }

    // MARK: - Load More

    private func loadMoreProperties() async {
        do {
            let allProperties = try await apiClient.getProperties()
            let newProperties = allProperties.filter { !swipedPropertyIds.contains($0.id) }

            withAnimation {
                properties = newProperties
            }
        } catch {
            print("❌ Error loading more properties: \(error)")
        }
    }

    // MARK: - Reset

    func reset() {
        swipedPropertyIds.removeAll()
        properties.removeAll()
    }
}
