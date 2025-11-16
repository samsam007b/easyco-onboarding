import Foundation
import Combine

// MARK: - API Client

class APIClient {
    static let shared = APIClient()

    private let baseURL: String
    private let session: URLSession
    private let decoder: JSONDecoder
    private let encoder: JSONEncoder

    private init() {
        self.baseURL = AppConfig.apiBaseURL

        // Configure URLSession
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 30
        configuration.timeoutIntervalForResource = 300
        configuration.waitsForConnectivity = true
        self.session = URLSession(configuration: configuration)

        // Configure JSON Decoder
        self.decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { decoder in
            let container = try decoder.singleValueContainer()
            let dateString = try container.decode(String.self)

            // Try ISO8601 with fractional seconds
            if let date = ISO8601DateFormatter().date(from: dateString) {
                return date
            }

            // Try standard date formatter
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
            if let date = formatter.date(from: dateString) {
                return date
            }

            // Fallback
            formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZ"
            if let date = formatter.date(from: dateString) {
                return date
            }

            throw DecodingError.dataCorruptedError(in: container, debugDescription: "Cannot decode date string \(dateString)")
        }

        // Configure JSON Encoder
        self.encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
    }

    // MARK: - Generic Request Methods

    /// Perform a network request and decode the response
    func request<T: Decodable>(
        _ endpoint: APIEndpoint,
        responseType: T.Type
    ) async throws -> T {
        let request = try buildRequest(from: endpoint)

        #if DEBUG
        printRequest(request)
        #endif

        do {
            let (data, response) = try await session.data(for: request)

            #if DEBUG
            printResponse(data: data, response: response)
            #endif

            try validateResponse(response, data: data)

            let decodedData = try decoder.decode(T.self, from: data)
            return decodedData

        } catch let error as NetworkError {
            throw error
        } catch let error as DecodingError {
            throw NetworkError.decodingError(error)
        } catch {
            throw NetworkError.unknown(error)
        }
    }

    /// Perform a network request without expecting a response body
    func request(_ endpoint: APIEndpoint) async throws {
        let request = try buildRequest(from: endpoint)

        #if DEBUG
        printRequest(request)
        #endif

        do {
            let (data, response) = try await session.data(for: request)

            #if DEBUG
            printResponse(data: data, response: response)
            #endif

            try validateResponse(response, data: data)

        } catch let error as NetworkError {
            throw error
        } catch {
            throw NetworkError.unknown(error)
        }
    }

    // MARK: - Combine Support

    /// Perform a request using Combine
    func publisher<T: Decodable>(
        _ endpoint: APIEndpoint,
        responseType: T.Type
    ) -> AnyPublisher<T, NetworkError> {
        do {
            let request = try buildRequest(from: endpoint)

            return session.dataTaskPublisher(for: request)
                .tryMap { data, response in
                    try self.validateResponse(response, data: data)
                    return data
                }
                .decode(type: T.self, decoder: decoder)
                .mapError { error in
                    if let networkError = error as? NetworkError {
                        return networkError
                    } else if let decodingError = error as? DecodingError {
                        return NetworkError.decodingError(decodingError)
                    } else {
                        return NetworkError.unknown(error)
                    }
                }
                .eraseToAnyPublisher()

        } catch {
            return Fail(error: error as? NetworkError ?? NetworkError.unknown(error))
                .eraseToAnyPublisher()
        }
    }

    // MARK: - Upload Methods

    /// Upload data (e.g., images)
    func upload<T: Decodable>(
        _ endpoint: APIEndpoint,
        data: Data,
        mimeType: String,
        responseType: T.Type
    ) async throws -> T {
        var request = try buildRequest(from: endpoint)

        let boundary = UUID().uuidString
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

        var body = Data()
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"file\"; filename=\"upload.jpg\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: \(mimeType)\r\n\r\n".data(using: .utf8)!)
        body.append(data)
        body.append("\r\n--\(boundary)--\r\n".data(using: .utf8)!)

        request.httpBody = body

        let (responseData, response) = try await session.data(for: request)
        try validateResponse(response, data: responseData)

        let decodedData = try decoder.decode(T.self, from: responseData)
        return decodedData
    }

    // MARK: - Private Helper Methods

    private func buildRequest(from endpoint: APIEndpoint) throws -> URLRequest {
        // Build URL
        guard var components = URLComponents(string: baseURL + endpoint.path) else {
            throw NetworkError.invalidURL
        }

        // Add query parameters
        if let queryParameters = endpoint.queryParameters {
            components.queryItems = queryParameters.map {
                URLQueryItem(name: $0.key, value: $0.value)
            }
        }

        guard let url = components.url else {
            throw NetworkError.invalidURL
        }

        // Create request
        var request = URLRequest(url: url)
        request.httpMethod = endpoint.method.rawValue

        // Add headers
        endpoint.headers?.forEach { key, value in
            request.setValue(value, forHTTPHeaderField: key)
        }

        // Add body
        if let body = endpoint.body {
            do {
                // Handle dictionary bodies
                if let dict = body as? [String: Any] {
                    request.httpBody = try JSONSerialization.data(withJSONObject: dict)
                } else {
                    request.httpBody = try encoder.encode(body)
                }
            } catch {
                throw NetworkError.encodingError(error)
            }
        }

        return request
    }

    private func validateResponse(_ response: URLResponse, data: Data?) throws {
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        switch httpResponse.statusCode {
        case 200...299:
            return
        case 401:
            throw NetworkError.unauthorized
        case 403:
            throw NetworkError.forbidden
        case 404:
            throw NetworkError.notFound
        case 500...599:
            throw NetworkError.serverError
        default:
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }
    }

    // MARK: - Debug Helpers

    #if DEBUG
    private func printRequest(_ request: URLRequest) {
        print("🌐 [\(request.httpMethod ?? "UNKNOWN")] \(request.url?.absoluteString ?? "No URL")")
        if let headers = request.allHTTPHeaderFields {
            print("📋 Headers: \(headers)")
        }
        if let body = request.httpBody, let bodyString = String(data: body, encoding: .utf8) {
            print("📦 Body: \(bodyString)")
        }
    }

    private func printResponse(data: Data, response: URLResponse) {
        if let httpResponse = response as? HTTPURLResponse {
            print("✅ Status: \(httpResponse.statusCode)")
        }
        if let responseString = String(data: data, encoding: .utf8) {
            print("📥 Response: \(responseString)")
        }
    }
    #endif
}

// MARK: - Convenience Extensions

extension APIClient {
    // Properties
    func getProperties(filters: PropertyFilters? = nil) async throws -> [Property] {
        try await request(.getProperties(filters: filters), responseType: [Property].self)
    }

    func getProperty(id: String) async throws -> Property {
        try await request(.getProperty(id: id), responseType: Property.self)
    }

    // User
    func getCurrentUser() async throws -> User {
        try await request(.getCurrentUser, responseType: User.self)
    }

    // Messages
    func getConversations() async throws -> [Conversation] {
        try await request(.getConversations, responseType: [Conversation].self)
    }

    // Groups
    func getGroups() async throws -> [Group] {
        try await request(.getGroups, responseType: [Group].self)
    }

    // Favorites
    func getFavorites() async throws -> [Property] {
        try await request(.getFavorites, responseType: [Property].self)
    }

    func addFavorite(propertyId: String) async throws {
        try await request(.addFavorite(propertyId: propertyId))
    }

    func removeFavorite(propertyId: String) async throws {
        try await request(.removeFavorite(propertyId: propertyId))
    }
}
