//
//  APIClient.swift
//  IzzIco
//
//  Network API client for backend communication
//

import Foundation

class APIClient {
    static let shared = APIClient()

    private let baseURL: String
    private let session: URLSession

    private init() {
        // TODO: Replace with actual backend URL
        self.baseURL = "https://api.easyco.app"
        self.session = URLSession.shared
    }

    // MARK: - Generic Request

    func request<T: Decodable>(
        _ endpoint: String,
        method: HTTPMethod = .get,
        body: Encodable? = nil,
        headers: [String: String]? = nil
    ) async throws -> T {
        guard let url = URL(string: baseURL + endpoint) else {
            throw NetworkError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = method.rawValue

        // Add headers
        var allHeaders = headers ?? [:]
        allHeaders["Content-Type"] = "application/json"
        allHeaders["Accept"] = "application/json"

        // Add auth token if available
        if let token = getAuthToken() {
            allHeaders["Authorization"] = "Bearer \(token)"
        }

        for (key, value) in allHeaders {
            request.setValue(value, forHTTPHeaderField: key)
        }

        // Add body if present
        if let body = body {
            request.httpBody = try JSONEncoder().encode(body)
        }

        do {
            let (data, response) = try await session.data(for: request)

            guard let httpResponse = response as? HTTPURLResponse else {
                throw NetworkError.unknown(NSError(domain: "", code: -1))
            }

            guard (200...299).contains(httpResponse.statusCode) else {
                throw NetworkError.serverError(httpResponse.statusCode)
            }

            return try JSONDecoder().decode(T.self, from: data)
        } catch let error as DecodingError {
            throw NetworkError.decodingError(error)
        } catch let error as NetworkError {
            throw error
        } catch {
            throw NetworkError.unknown(error)
        }
    }

    // MARK: - Helper Methods

    private func getAuthToken() -> String? {
        // TODO: Implement token retrieval from keychain
        return nil
    }

    func getUserIdFromToken(_ token: String) throws -> String {
        // TODO: Implement JWT token parsing to extract user ID
        // For now, return a stub value to fix compilation
        return "stub-user-id"
    }

    func getConversations() async throws -> [Conversation] {
        // TODO: Implement API call to fetch conversations
        return []
    }

    func getFavorites() async throws -> [Property] {
        // TODO: Implement API call to fetch favorites
        return []
    }

    func removeFavorite(_ propertyId: UUID) async throws {
        // TODO: Implement API call to remove favorite
    }

    func getGroups() async throws -> [SearchGroup] {
        // TODO: Implement API call to fetch groups
        return []
    }

    func getMessages(conversationId: UUID) async throws -> [Message] {
        // TODO: Implement API call to fetch messages
        return []
    }

    func sendMessage(conversationId: UUID, content: String) async throws -> Message {
        // TODO: Implement API call to send message
        fatalError("Not implemented")
    }

    func getProperties(filters: PropertyFilters?) async throws -> [Property] {
        // Fetch properties from Supabase
        let supabaseURL = AppConfig.supabaseURL
        let supabaseKey = AppConfig.supabaseAnonKey

        let url = URL(string: "\(supabaseURL)/rest/v1/properties")!
        var components = URLComponents(url: url, resolvingAgainstBaseURL: false)!

        // Build query parameters
        var queryItems: [URLQueryItem] = []

        // Only fetch published properties
        queryItems.append(URLQueryItem(name: "status", value: "eq.published"))

        // Apply filters if provided
        if let filters = filters {
            if let city = filters.city {
                queryItems.append(URLQueryItem(name: "city", value: "ilike.*\(city)*"))
            }
            if let minPrice = filters.minPrice {
                queryItems.append(URLQueryItem(name: "monthly_rent", value: "gte.\(minPrice)"))
            }
            if let maxPrice = filters.maxPrice {
                queryItems.append(URLQueryItem(name: "monthly_rent", value: "lte.\(maxPrice)"))
            }
            if let minBedrooms = filters.minBedrooms {
                queryItems.append(URLQueryItem(name: "bedrooms", value: "gte.\(minBedrooms)"))
            }
            if let minBathrooms = filters.minBathrooms {
                queryItems.append(URLQueryItem(name: "bathrooms", value: "gte.\(minBathrooms)"))
            }
        }

        // Select all fields needed
        queryItems.append(URLQueryItem(name: "select", value: "*"))

        // Order by created_at descending (newest first)
        queryItems.append(URLQueryItem(name: "order", value: "created_at.desc"))

        components.queryItems = queryItems

        var request = URLRequest(url: components.url!)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")

        // Add auth token if available
        if let accessToken = EasyCoKeychainManager.shared.getAuthToken() {
            request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        }

        print("🏠 Fetching properties from Supabase...")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 200 {
            print("❌ Properties fetch failed: \(httpResponse.statusCode)")
            if let responseStr = String(data: data, encoding: .utf8) {
                print("Response: \(responseStr.prefix(500))")
            }
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601

        let properties = try decoder.decode([Property].self, from: data)
        print("✅ Loaded \(properties.count) properties from Supabase")

        return properties
    }

    func addFavorite(_ propertyId: UUID) async throws {
        // TODO: Implement API call to add favorite
    }

    // MARK: - Swipe/Match Endpoints

    func undoSwipe() async throws {
        let _: EmptyResponse = try await request("/swipes/undo", method: .post)
    }

    func likeProperty(id: UUID) async throws {
        let _: EmptyResponse = try await request("/swipes/like", method: .post, body: ["property_id": id.uuidString])
    }

    func dislikeProperty(id: UUID) async throws {
        let _: EmptyResponse = try await request("/swipes/dislike", method: .post, body: ["property_id": id.uuidString])
    }

    func getMatchScore(propertyId: UUID) async throws -> MatchScoreResponse {
        return try await request("/matches/score/\(propertyId.uuidString)", method: .get)
    }

    func getMatches(filters: PropertyFilters) async throws -> [Property] {
        // TODO: Send filters as query parameters
        return try await request("/matches", method: .get)
    }

    func getRooms(propertyId: String) async throws -> [Room] {
        // TODO: Implement API call to fetch rooms
        return []
    }
}

// MARK: - Helper Structures

struct EmptyResponse: Codable {}

enum HTTPMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case patch = "PATCH"
    case delete = "DELETE"
}
