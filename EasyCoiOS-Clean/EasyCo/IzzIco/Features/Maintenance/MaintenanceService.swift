//
//  MaintenanceService.swift
//  IzzIco
//
//  Service for creating and managing maintenance requests with Supabase
//

import Foundation

class MaintenanceService {

    private let supabaseURL: String
    private let supabaseKey: String

    init() {
        self.supabaseURL = AppConfig.supabaseURL
        self.supabaseKey = AppConfig.supabaseAnonKey
    }

    // MARK: - Fetch Maintenance Requests

    /// Fetch all maintenance requests for a user
    func fetchMaintenanceRequests(userId: String, accessToken: String) async throws -> [MaintenanceRequestResponse] {
        let url = URL(string: "\(supabaseURL)/rest/v1/maintenance_requests")!
        var components = URLComponents(url: url, resolvingAgainstBaseURL: false)!

        components.queryItems = [
            URLQueryItem(name: "requester_id", value: "eq.\(userId)"),
            URLQueryItem(name: "select", value: "id,title,description,priority,status,category,created_at,updated_at,property_id,property:properties(id,title,address)"),
            URLQueryItem(name: "order", value: "created_at.desc")
        ]

        var request = URLRequest(url: components.url!)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        print("🔧 Fetching maintenance requests for user: \(userId)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 200 {
            print("❌ Maintenance requests fetch failed: \(httpResponse.statusCode)")
            if let responseStr = String(data: data, encoding: .utf8) {
                print("Response: \(responseStr.prefix(500))")
            }
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        let requests = try decoder.decode([MaintenanceRequestResponse].self, from: data)
        print("✅ Loaded \(requests.count) maintenance requests")

        return requests
    }

    // MARK: - Create Maintenance Request

    /// Create a new maintenance request
    func createMaintenanceRequest(
        userId: String,
        propertyId: String,
        title: String,
        description: String,
        category: String,
        priority: String,
        accessToken: String
    ) async throws -> MaintenanceRequestResponse {
        let url = URL(string: "\(supabaseURL)/rest/v1/maintenance_requests")!

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("return=representation", forHTTPHeaderField: "Prefer")

        let body: [String: Any] = [
            "requester_id": userId,
            "property_id": propertyId,
            "title": title,
            "description": description,
            "category": category,
            "priority": priority,
            "status": "pending"
        ]

        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        print("🔧 Creating maintenance request: \(title)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 201 {
            print("❌ Maintenance request creation failed: \(httpResponse.statusCode)")
            if let responseStr = String(data: data, encoding: .utf8) {
                print("Response: \(responseStr.prefix(500))")
            }
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        let createdRequest = try decoder.decode([MaintenanceRequestResponse].self, from: data).first!
        print("✅ Maintenance request created: \(createdRequest.id)")

        return createdRequest
    }
}

// MARK: - Response Models

struct MaintenanceRequestResponse: Codable {
    let id: String
    let title: String
    let description: String
    let priority: String
    let status: String
    let category: String
    let createdAt: String
    let updatedAt: String
    let propertyId: String
    let property: PropertyEmbedded?

    enum CodingKeys: String, CodingKey {
        case id, title, description, priority, status, category
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case propertyId = "property_id"
        case property
    }

    struct PropertyEmbedded: Codable {
        let id: String
        let title: String
        let address: String
    }

    var parsedCreatedAt: Date? {
        return ISO8601DateFormatter().date(from: createdAt)
    }
}
