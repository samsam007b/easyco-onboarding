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
            properties = try await propertyService.getProperties(filters: nil)
            isLoading = false
        } catch let networkError as NetworkError {
            error = .network(networkError)
            isLoading = false
        } catch {
            self.error = .unknown(error)
            isLoading = false
        }
    }

    // MARK: - Swipe Actions

    func swipe(property: Property, direction: SwipeDirection) async {
        do {
            // Convert SwipeDirection to SwipeAction
            let action: SwipeAction = {
                switch direction {
                case .left: return .dislike
                case .right: return .like
                case .up: return .superLike
                }
            }()

            try await propertyService.swipeProperty(propertyId: property.id, direction: action)

            // Play haptic
            if direction == .right || direction == .up {
                Haptic.notification(.success)
            } else {
                Haptic.impact(.medium)
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
            let moreProperties = try await propertyService.getProperties(filters: nil)
            properties.append(contentsOf: moreProperties)
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
