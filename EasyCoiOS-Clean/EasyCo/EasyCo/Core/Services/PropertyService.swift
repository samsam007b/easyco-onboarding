//
//  PropertyService.swift
//  EasyCo
//

import Foundation

class PropertyService {
    static let shared = PropertyService()
    private let apiClient = APIClient.shared

    private init() {}

    func swipeProperty(propertyId: UUID, direction: SwipeAction) async throws {
        switch direction {
        case .like:
            try await apiClient.likeProperty(id: propertyId)
        case .dislike:
            try await apiClient.dislikeProperty(id: propertyId)
        case .superLike:
            try await apiClient.likeProperty(id: propertyId)
        }
    }

    func getProperties(filters: PropertyFilters?) async throws -> [Property] {
        return try await apiClient.getProperties(filters: filters)
    }
}

enum SwipeAction {
    case like
    case dislike
    case superLike
}
