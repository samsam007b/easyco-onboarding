//
//  SwipeViewModel.swift
//  EasyCo
//
//  ViewModel for swipe cards
//

import Foundation
import Combine

@MainActor
class SwipeViewModel: ObservableObject {
    @Published var properties: [Property] = []
    @Published var currentIndex = 0
    @Published var isLoading = false
    @Published var error: AppError?
    @Published var showMatchCelebration = false
    @Published var currentMatch: Match?

    private let propertyService = PropertyService.shared
    private var cancellables = Set<AnyCancellable>()

    // MARK: - Load Properties

    func loadProperties() async {
        isLoading = true
        error = nil

        do {
            let response = try await propertyService.getProperties(page: 1, limit: 50)
            properties = response.properties
            isLoading = false
        } catch let apiError as APIError {
            error = apiError.toAppError
            isLoading = false
        } catch {
            self.error = .server
            isLoading = false
        }
    }

    // MARK: - Swipe Actions

    func swipe(property: Property, direction: SwipeDirection) async {
        do {
            let response = try await propertyService.swipeProperty(id: property.id, direction: direction)

            // Check if it's a match
            if response.isMatch, let match = response.match {
                currentMatch = match
                showMatchCelebration = true

                // Post notification
                NotificationCenter.default.post(name: .didCreateMatch, object: match)

                // Play haptic
                Haptic.notification(.success)
            } else {
                // Play regular haptic
                if direction == .right {
                    Haptic.notification(.success)
                } else {
                    Haptic.impact(.medium)
                }
            }

            // Move to next property
            if currentIndex < properties.count - 1 {
                currentIndex += 1
            }

            // Load more if needed
            if currentIndex >= properties.count - 5 {
                await loadMoreProperties()
            }

        } catch {
            print("Swipe error: \(error)")
            // Still advance to next property on error
            if currentIndex < properties.count - 1 {
                currentIndex += 1
            }
        }
    }

    func swipeLeft() async {
        guard currentIndex < properties.count else { return }
        await swipe(property: properties[currentIndex], direction: .left)
    }

    func swipeRight() async {
        guard currentIndex < properties.count else { return }
        await swipe(property: properties[currentIndex], direction: .right)
    }

    func swipeUp() async {
        guard currentIndex < properties.count else { return }
        await swipe(property: properties[currentIndex], direction: .up)
    }

    // MARK: - Load More

    private func loadMoreProperties() async {
        do {
            let nextPage = (properties.count / 50) + 1
            let response = try await propertyService.getProperties(page: nextPage, limit: 50)
            properties.append(contentsOf: response.properties)
        } catch {
            print("Load more error: \(error)")
        }
    }

    // MARK: - Helpers

    var currentProperty: Property? {
        guard currentIndex < properties.count else { return nil }
        return properties[currentIndex]
    }

    var remainingCount: Int {
        max(0, properties.count - currentIndex)
    }

    func dismissMatchCelebration() {
        showMatchCelebration = false
        currentMatch = nil
    }
}

// MARK: - Notifications

extension Notification.Name {
    static let didCreateMatch = Notification.Name("didCreateMatch")
}
