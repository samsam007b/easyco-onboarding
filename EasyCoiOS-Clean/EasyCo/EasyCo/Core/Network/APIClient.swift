//
//  APIClient.swift
//  EasyCo
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
}

enum HTTPMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case patch = "PATCH"
    case delete = "DELETE"
}
