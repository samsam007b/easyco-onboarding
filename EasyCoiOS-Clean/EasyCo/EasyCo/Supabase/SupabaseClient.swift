import Foundation

// MARK: - Supabase Client
// VERSION: 2025-11-17-FORCE-REBUILD-v3

/// Complete Supabase client for direct database access
/// Provides query builder, real-time subscriptions, and storage
@MainActor
class SupabaseClient {
    static let shared = SupabaseClient()

    private let supabaseURL: String
    private let supabaseKey: String
    private let auth: SupabaseAuth

    private init() {
        self.supabaseURL = AppConfig.supabaseURL
        self.supabaseKey = AppConfig.supabaseAnonKey
        self.auth = SupabaseAuth.shared
    }

    // MARK: - Query Builder

    /// Create a query builder for a table
    func from(_ table: String) -> SupabaseQueryBuilder {
        SupabaseQueryBuilder(
            table: table,
            supabaseURL: supabaseURL,
            supabaseKey: supabaseKey,
            auth: auth
        )
    }

    // MARK: - RPC (Remote Procedure Call)

    /// Call a Postgres function
    func rpc<T: Decodable>(
        _ functionName: String,
        params: [String: Any]? = nil
    ) async throws -> T {
        let url = URL(string: "\(supabaseURL)/rest/v1/rpc/\(functionName)")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")

        // Add auth token if available
        if let token = EasyCoKeychainManager.shared.getAuthToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        if let params = params {
            request.httpBody = try JSONSerialization.data(withJSONObject: params)
        }

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw SupabaseError.invalidResponse
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            throw SupabaseError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        decoder.dateDecodingStrategy = .iso8601

        return try decoder.decode(T.self, from: data)
    }

    /// Call a Postgres function that returns a single value
    func rpcSingle<T: Decodable>(
        _ functionName: String,
        params: [String: Any]? = nil
    ) async throws -> T {
        return try await rpc(functionName, params: params)
    }
}

// MARK: - Query Builder

class SupabaseQueryBuilder {
    private let table: String
    private let supabaseURL: String
    private let supabaseKey: String
    private let auth: SupabaseAuth

    private var selectFields: String = "*"
    private var filters: [(String, String, String)] = [] // (column, operator, value)
    private var orderColumn: String?
    private var orderAscending: Bool = true
    private var limitValue: Int?
    private var offsetValue: Int?
    private var isSingle: Bool = false

    init(table: String, supabaseURL: String, supabaseKey: String, auth: SupabaseAuth) {
        self.table = table
        self.supabaseURL = supabaseURL
        self.supabaseKey = supabaseKey
        self.auth = auth
    }

    // MARK: - Select

    /// Select specific columns
    func select(_ columns: String = "*") -> SupabaseQueryBuilder {
        print("🚨 NEW VERSION: select() called with columns: '\(columns)'")
        selectFields = columns
        return self
    }

    // MARK: - Filters

    /// Equal filter
    func eq(_ column: String, value: Any) -> SupabaseQueryBuilder {
        print("🚨 NEW VERSION: eq() called - \(column) = \(value)")
        filters.append((column, "eq", "\(value)"))
        return self
    }

    /// Not equal filter
    func neq(_ column: String, value: Any) -> SupabaseQueryBuilder {
        filters.append((column, "neq", "\(value)"))
        return self
    }

    /// Greater than filter
    func gt(_ column: String, value: Any) -> SupabaseQueryBuilder {
        filters.append((column, "gt", "\(value)"))
        return self
    }

    /// Greater than or equal filter
    func gte(_ column: String, value: Any) -> SupabaseQueryBuilder {
        filters.append((column, "gte", "\(value)"))
        return self
    }

    /// Less than filter
    func lt(_ column: String, value: Any) -> SupabaseQueryBuilder {
        filters.append((column, "lt", "\(value)"))
        return self
    }

    /// Less than or equal filter
    func lte(_ column: String, value: Any) -> SupabaseQueryBuilder {
        filters.append((column, "lte", "\(value)"))
        return self
    }

    /// LIKE filter (pattern matching)
    func like(_ column: String, pattern: String) -> SupabaseQueryBuilder {
        filters.append((column, "like", pattern))
        return self
    }

    /// ILIKE filter (case-insensitive pattern matching)
    func ilike(_ column: String, pattern: String) -> SupabaseQueryBuilder {
        filters.append((column, "ilike", pattern))
        return self
    }

    /// IS filter (for null checks)
    func `is`(_ column: String, value: String) -> SupabaseQueryBuilder {
        filters.append((column, "is", value))
        return self
    }

    /// IN filter (value in array)
    func `in`(_ column: String, values: [Any]) -> SupabaseQueryBuilder {
        let valuesString = "(" + values.map { "\($0)" }.joined(separator: ",") + ")"
        filters.append((column, "in", valuesString))
        return self
    }

    // MARK: - Order

    /// Order results
    func order(_ column: String, ascending: Bool = true) -> SupabaseQueryBuilder {
        orderColumn = column
        orderAscending = ascending
        return self
    }

    // MARK: - Limit & Offset

    /// Limit number of results
    func limit(_ count: Int) -> SupabaseQueryBuilder {
        print("🚨 NEW VERSION: limit() called with \(count)")
        limitValue = count
        return self
    }

    /// Skip first N results
    func offset(_ count: Int) -> SupabaseQueryBuilder {
        offsetValue = count
        return self
    }

    /// Return single result instead of array
    func single() -> SupabaseQueryBuilder {
        isSingle = true
        return self
    }

    // MARK: - Execute

    /// Execute SELECT query
    func execute<T: Decodable>() async throws -> [T] {
        print("🚨🚨🚨 NEW VERSION OF SupabaseClient.execute() IS RUNNING! 🚨🚨🚨")
        let url = buildURL()
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")

        if isSingle {
            request.setValue("return=representation", forHTTPHeaderField: "Prefer")
            request.addValue("singular", forHTTPHeaderField: "Accept")
        }

        // Add auth token if available
        if let token = EasyCoKeychainManager.shared.getAuthToken() {
            print("🔑 Query has auth token: \(token.prefix(20))...")
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        } else {
            print("⚠️ Query WITHOUT auth token! Table: \(table)")
        }

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw SupabaseError.invalidResponse
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            throw SupabaseError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        // DEBUG: Log the raw JSON response
        if let jsonString = String(data: data, encoding: .utf8) {
            print("📦 Raw JSON response from \(table):")
            print(jsonString)
        }

        let decoder = JSONDecoder()
        // Don't use .convertFromSnakeCase - use explicit CodingKeys instead
        // Don't use .iso8601 because Supabase returns dates with microseconds
        decoder.dateDecodingStrategy = .custom { decoder in
            let container = try decoder.singleValueContainer()
            let dateString = try container.decode(String.self)

            // Try ISO8601 with fractional seconds
            let formatter = ISO8601DateFormatter()
            formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            if let date = formatter.date(from: dateString) {
                return date
            }

            // Try without fractional seconds
            formatter.formatOptions = [.withInternetDateTime]
            if let date = formatter.date(from: dateString) {
                return date
            }

            throw DecodingError.dataCorruptedError(in: container, debugDescription: "Cannot decode date string \(dateString)")
        }

        if isSingle {
            let single = try decoder.decode(T.self, from: data)
            return [single]
        } else {
            return try decoder.decode([T].self, from: data)
        }
    }

    /// Execute INSERT query
    func insert<T: Encodable>(_ values: T) async throws -> [T] where T: Decodable {
        let url = URL(string: "\(supabaseURL)/rest/v1/\(table)")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("return=representation", forHTTPHeaderField: "Prefer")

        // Add auth token if available
        if let token = EasyCoKeychainManager.shared.getAuthToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        let encoder = JSONEncoder()
        encoder.keyEncodingStrategy = .convertToSnakeCase
        encoder.dateEncodingStrategy = .iso8601
        request.httpBody = try encoder.encode(values)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw SupabaseError.invalidResponse
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            throw SupabaseError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        decoder.dateDecodingStrategy = .iso8601

        return try decoder.decode([T].self, from: data)
    }

    /// Execute UPDATE query
    func update<T: Encodable>(_ values: T) async throws where T: Decodable {
        let url = buildURL()
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")

        // Add auth token if available
        if let token = EasyCoKeychainManager.shared.getAuthToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        let encoder = JSONEncoder()
        encoder.keyEncodingStrategy = .convertToSnakeCase
        encoder.dateEncodingStrategy = .iso8601
        request.httpBody = try encoder.encode(values)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw SupabaseError.invalidResponse
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            throw SupabaseError.httpError(statusCode: httpResponse.statusCode, data: data)
        }
    }

    /// Execute DELETE query
    func delete() async throws {
        let url = buildURL()
        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")

        // Add auth token if available
        if let token = EasyCoKeychainManager.shared.getAuthToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw SupabaseError.invalidResponse
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            throw SupabaseError.httpError(statusCode: httpResponse.statusCode, data: data)
        }
    }

    // MARK: - URL Builder

    private func buildURL() -> URL {
        var urlComponents = URLComponents(string: "\(supabaseURL)/rest/v1/\(table)")!
        var queryItems: [URLQueryItem] = []

        // Select fields
        print("🔍 Building URL with selectFields: '\(selectFields)'")
        if selectFields != "*" {
            queryItems.append(URLQueryItem(name: "select", value: selectFields))
        }

        // Filters
        for (column, op, value) in filters {
            queryItems.append(URLQueryItem(name: column, value: "\(op).\(value)"))
        }

        // Order
        if let orderColumn = orderColumn {
            let orderValue = "\(orderColumn).\(orderAscending ? "asc" : "desc")"
            queryItems.append(URLQueryItem(name: "order", value: orderValue))
        }

        // Limit
        if let limitValue = limitValue {
            queryItems.append(URLQueryItem(name: "limit", value: "\(limitValue)"))
        }

        // Offset
        if let offsetValue = offsetValue {
            queryItems.append(URLQueryItem(name: "offset", value: "\(offsetValue)"))
        }

        if !queryItems.isEmpty {
            urlComponents.queryItems = queryItems
        }

        let finalURL = urlComponents.url!
        print("🌐 Final query URL: \(finalURL.absoluteString)")
        return finalURL
    }
}

// MARK: - Supabase Error

enum SupabaseError: Error, LocalizedError {
    case invalidResponse
    case httpError(statusCode: Int, data: Data)
    case decodingError(Error)
    case encodingError(Error)
    case unauthorized
    case notFound

    var errorDescription: String? {
        switch self {
        case .invalidResponse:
            return "Invalid response from server"
        case .httpError(let statusCode, let data):
            let message = String(data: data, encoding: .utf8) ?? "Unknown error"
            return "HTTP Error \(statusCode): \(message)"
        case .decodingError(let error):
            return "Decoding error: \(error.localizedDescription)"
        case .encodingError(let error):
            return "Encoding error: \(error.localizedDescription)"
        case .unauthorized:
            return "Unauthorized access"
        case .notFound:
            return "Resource not found"
        }
    }
}
