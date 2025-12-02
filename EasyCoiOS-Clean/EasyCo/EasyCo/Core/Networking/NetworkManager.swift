//
//  NetworkManager.swift
//  EasyCo
//
//  Network layer for API communication
//

import Foundation
import Combine

// MARK: - API Error

enum APIError: LocalizedError {
    case invalidURL
    case requestFailed(Error)
    case invalidResponse
    case decodingError(Error)
    case serverError(statusCode: Int, message: String?)
    case unauthorized
    case notFound
    case networkUnavailable
    case timeout
    case unknown

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "URL invalide"
        case .requestFailed(let error):
            return "Échec de la requête: \(error.localizedDescription)"
        case .invalidResponse:
            return "Réponse du serveur invalide"
        case .decodingError(let error):
            return "Erreur de décodage: \(error.localizedDescription)"
        case .serverError(let code, let message):
            return message ?? "Erreur serveur (\(code))"
        case .unauthorized:
            return "Non autorisé. Veuillez vous reconnecter."
        case .notFound:
            return "Ressource non trouvée"
        case .networkUnavailable:
            return "Pas de connexion internet"
        case .timeout:
            return "Délai d'attente dépassé"
        case .unknown:
            return "Une erreur inconnue s'est produite"
        }
    }

    var toAppError: AppError {
        switch self {
        case .networkUnavailable:
            return .network
        case .unauthorized:
            return .unauthorized
        case .notFound:
            return .notFound
        default:
            return .server
        }
    }
}

// MARK: - HTTP Method

enum HTTPMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case patch = "PATCH"
    case delete = "DELETE"
}

// MARK: - Network Request Protocol

protocol NetworkRequest {
    associatedtype Response: Decodable

    var path: String { get }
    var method: HTTPMethod { get }
    var headers: [String: String]? { get }
    var queryItems: [URLQueryItem]? { get }
    var body: Data? { get }
    var requiresAuth: Bool { get }
}

extension NetworkRequest {
    var headers: [String: String]? { nil }
    var queryItems: [URLQueryItem]? { nil }
    var body: Data? { nil }
    var requiresAuth: Bool { true }
}

// MARK: - Network Manager

class NetworkManager {
    static let shared = NetworkManager()

    private let baseURL: String
    private let session: URLSession
    private let decoder: JSONDecoder
    private let encoder: JSONEncoder

    // Token management
    @Published private(set) var authToken: String?

    private init() {
        // TODO: Replace with your actual API base URL
        self.baseURL = ProcessInfo.processInfo.environment["API_BASE_URL"] ?? "https://api.easyco.fr/v1"

        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        config.timeoutIntervalForResource = 60
        config.waitsForConnectivity = true

        self.session = URLSession(configuration: config)

        self.decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        decoder.dateDecodingStrategy = .iso8601

        self.encoder = JSONEncoder()
        encoder.keyEncodingStrategy = .convertToSnakeCase
        encoder.dateEncodingStrategy = .iso8601

        // Load saved token
        self.authToken = UserDefaults.standard.string(forKey: "auth_token")
    }

    // MARK: - Token Management

    func setAuthToken(_ token: String?) {
        self.authToken = token
        if let token = token {
            UserDefaults.standard.set(token, forKey: "auth_token")
        } else {
            UserDefaults.standard.removeObject(forKey: "auth_token")
        }
    }

    func clearAuthToken() {
        setAuthToken(nil)
    }

    // MARK: - Request Execution (async/await)

    func execute<T: NetworkRequest>(_ request: T) async throws -> T.Response {
        let urlRequest = try buildURLRequest(for: request)

        do {
            let (data, response) = try await session.data(for: urlRequest)

            guard let httpResponse = response as? HTTPURLResponse else {
                throw APIError.invalidResponse
            }

            // Handle HTTP status codes
            switch httpResponse.statusCode {
            case 200...299:
                return try decoder.decode(T.Response.self, from: data)

            case 401:
                throw APIError.unauthorized

            case 404:
                throw APIError.notFound

            case 400...499:
                let errorMessage = try? decoder.decode(ErrorResponse.self, from: data)
                throw APIError.serverError(statusCode: httpResponse.statusCode, message: errorMessage?.message)

            case 500...599:
                throw APIError.serverError(statusCode: httpResponse.statusCode, message: "Erreur serveur")

            default:
                throw APIError.unknown
            }

        } catch let error as APIError {
            throw error
        } catch let error as URLError {
            if error.code == .notConnectedToInternet || error.code == .networkConnectionLost {
                throw APIError.networkUnavailable
            } else if error.code == .timedOut {
                throw APIError.timeout
            } else {
                throw APIError.requestFailed(error)
            }
        } catch let error as DecodingError {
            throw APIError.decodingError(error)
        } catch {
            throw APIError.requestFailed(error)
        }
    }

    // MARK: - Request Execution (Combine)

    func executePublisher<T: NetworkRequest>(_ request: T) -> AnyPublisher<T.Response, APIError> {
        do {
            let urlRequest = try buildURLRequest(for: request)

            return session.dataTaskPublisher(for: urlRequest)
                .tryMap { data, response -> Data in
                    guard let httpResponse = response as? HTTPURLResponse else {
                        throw APIError.invalidResponse
                    }

                    switch httpResponse.statusCode {
                    case 200...299:
                        return data
                    case 401:
                        throw APIError.unauthorized
                    case 404:
                        throw APIError.notFound
                    case 400...499:
                        let errorMessage = try? self.decoder.decode(ErrorResponse.self, from: data)
                        throw APIError.serverError(statusCode: httpResponse.statusCode, message: errorMessage?.message)
                    case 500...599:
                        throw APIError.serverError(statusCode: httpResponse.statusCode, message: "Erreur serveur")
                    default:
                        throw APIError.unknown
                    }
                }
                .decode(type: T.Response.self, decoder: decoder)
                .mapError { error -> APIError in
                    if let apiError = error as? APIError {
                        return apiError
                    } else if let urlError = error as? URLError {
                        if urlError.code == .notConnectedToInternet {
                            return .networkUnavailable
                        } else if urlError.code == .timedOut {
                            return .timeout
                        }
                        return .requestFailed(urlError)
                    } else if error is DecodingError {
                        return .decodingError(error)
                    }
                    return .requestFailed(error)
                }
                .eraseToAnyPublisher()

        } catch let error as APIError {
            return Fail(error: error).eraseToAnyPublisher()
        } catch {
            return Fail(error: .requestFailed(error)).eraseToAnyPublisher()
        }
    }

    // MARK: - URL Request Builder

    private func buildURLRequest<T: NetworkRequest>(for request: T) throws -> URLRequest {
        guard var urlComponents = URLComponents(string: baseURL + request.path) else {
            throw APIError.invalidURL
        }

        // Add query items
        if let queryItems = request.queryItems, !queryItems.isEmpty {
            urlComponents.queryItems = queryItems
        }

        guard let url = urlComponents.url else {
            throw APIError.invalidURL
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = request.method.rawValue

        // Add headers
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("application/json", forHTTPHeaderField: "Accept")

        // Add auth token if required
        if request.requiresAuth, let token = authToken {
            urlRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        // Add custom headers
        request.headers?.forEach { key, value in
            urlRequest.setValue(value, forHTTPHeaderField: key)
        }

        // Add body
        if let body = request.body {
            urlRequest.httpBody = body
        }

        return urlRequest
    }
}

// MARK: - Helper Models

struct ErrorResponse: Decodable {
    let message: String
    let code: String?
}

// MARK: - Encodable Extension

extension NetworkManager {
    func encodeBody<T: Encodable>(_ body: T) throws -> Data {
        try encoder.encode(body)
    }
}
