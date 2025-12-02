//
//  PropertyService.swift
//  EasyCo
//
//  Property management service
//

import Foundation
import Combine

class PropertyService {
    static let shared = PropertyService()

    private let networkManager = NetworkManager.shared
    private var cancellables = Set<AnyCancellable>()

    private init() {}

    // MARK: - Get Properties

    func getProperties(page: Int = 1, limit: Int = 20, filters: PropertyFilters? = nil) async throws -> PropertiesResponse {
        let request = GetPropertiesRequest(page: page, limit: limit, filters: filters)
        return try await networkManager.execute(request)
    }

    func getPropertiesPublisher(page: Int = 1, limit: Int = 20, filters: PropertyFilters? = nil) -> AnyPublisher<PropertiesResponse, APIError> {
        let request = GetPropertiesRequest(page: page, limit: limit, filters: filters)
        return networkManager.executePublisher(request)
    }

    // MARK: - Get Property

    func getProperty(id: String) async throws -> Property {
        let request = GetPropertyRequest(id: id)
        return try await networkManager.execute(request)
    }

    // MARK: - Create Property

    func createProperty(_ property: PropertyCreateDTO) async throws -> Property {
        let request = CreatePropertyRequest(property: property)
        return try await networkManager.execute(request)
    }

    // MARK: - Update Property

    func updateProperty(id: String, _ property: PropertyUpdateDTO) async throws -> Property {
        let request = UpdatePropertyRequest(id: id, property: property)
        return try await networkManager.execute(request)
    }

    // MARK: - Delete Property

    func deleteProperty(id: String) async throws {
        let request = DeletePropertyRequest(id: id)
        _ = try await networkManager.execute(request)
    }

    // MARK: - Swipe Property

    func swipeProperty(id: String, direction: SwipeDirection) async throws -> SwipeResponse {
        let request = SwipePropertyRequest(propertyId: id, direction: direction)
        return try await networkManager.execute(request)
    }

    // MARK: - Get Matches

    func getMatches() async throws -> [Match] {
        let request = GetMatchesRequest()
        let response = try await networkManager.execute(request)
        return response.matches
    }

    func getMatch(id: String) async throws -> Match {
        let request = GetMatchRequest(id: id)
        return try await networkManager.execute(request)
    }
}
