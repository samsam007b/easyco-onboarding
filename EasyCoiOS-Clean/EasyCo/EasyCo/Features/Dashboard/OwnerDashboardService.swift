//
//  OwnerDashboardService.swift
//  EasyCo
//
//  Service layer for fetching owner dashboard data from Supabase
//  Fetches owner properties, applications, transactions for analytics
//

import Foundation

// MARK: - Owner Dashboard Service

class OwnerDashboardService {

    private let supabaseURL: String
    private let supabaseKey: String

    init() {
        self.supabaseURL = AppConfig.supabaseURL
        self.supabaseKey = AppConfig.supabaseAnonKey
    }

    // MARK: - Fetch Owner Properties

    /// Fetch all properties owned by user
    func fetchOwnerProperties(userId: String, accessToken: String) async throws -> [PropertyResponse] {
        let url = URL(string: "\(supabaseURL)/rest/v1/properties")!
        var components = URLComponents(url: url, resolvingAgainstBaseURL: false)!
        components.queryItems = [
            URLQueryItem(name: "owner_id", value: "eq.\(userId)"),
            URLQueryItem(name: "select", value: "id,title,address,city,bedrooms,bathrooms,surface_area,monthly_rent,charges,main_image,status,views_count,applications_count,favorites_count,created_at,updated_at,published_at")
        ]

        var request = URLRequest(url: components.url!)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        print("🏠 Fetching owner properties for user: \(userId)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 200 {
            print("❌ Owner properties fetch failed: \(httpResponse.statusCode)")
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        let properties = try decoder.decode([PropertyResponse].self, from: data)
        print("✅ Loaded \(properties.count) owner properties")

        return properties
    }

    // MARK: - Fetch Pending Applications

    /// Fetch pending applications for owner's properties
    func fetchPendingApplications(userId: String, accessToken: String) async throws -> [ApplicationResponse] {
        let url = URL(string: "\(supabaseURL)/rest/v1/applications")!
        var components = URLComponents(url: url, resolvingAgainstBaseURL: false)!
        components.queryItems = [
            URLQueryItem(name: "select", value: "id,applicant_name,applicant_email,created_at,property_id,status,property:properties(id,title)"),
            URLQueryItem(name: "status", value: "in.(pending,reviewing)"),
            URLQueryItem(name: "order", value: "created_at.desc")
        ]

        var request = URLRequest(url: components.url!)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        print("📋 Fetching pending applications for owner: \(userId)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 200 {
            print("❌ Applications fetch failed: \(httpResponse.statusCode)")
            if let responseStr = String(data: data, encoding: .utf8) {
                print("Response: \(responseStr.prefix(500))")
            }
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        let applications = try decoder.decode([ApplicationResponse].self, from: data)
        print("✅ Loaded \(applications.count) pending applications")

        return applications
    }

    // MARK: - Fetch Revenue Data

    /// Fetch transaction data for revenue analytics
    func fetchRevenueTransactions(userId: String, accessToken: String, months: Int = 6) async throws -> [TransactionResponse] {
        let url = URL(string: "\(supabaseURL)/rest/v1/transactions")!
        var components = URLComponents(url: url, resolvingAgainstBaseURL: false)!

        // Calculate date for X months ago
        let startDate = Calendar.current.date(byAdding: .month, value: -months, to: Date())!
        let startDateStr = ISO8601DateFormatter().string(from: startDate)

        components.queryItems = [
            URLQueryItem(name: "payee_id", value: "eq.\(userId)"),
            URLQueryItem(name: "transaction_type", value: "eq.rent_payment"),
            URLQueryItem(name: "status", value: "eq.completed"),
            URLQueryItem(name: "created_at", value: "gte.\(startDateStr)"),
            URLQueryItem(name: "select", value: "id,amount,currency,created_at,paid_at"),
            URLQueryItem(name: "order", value: "created_at.asc")
        ]

        var request = URLRequest(url: components.url!)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        print("💰 Fetching revenue transactions for owner: \(userId)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 200 {
            print("❌ Revenue transactions fetch failed: \(httpResponse.statusCode)")
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        let transactions = try decoder.decode([TransactionResponse].self, from: data)
        print("✅ Loaded \(transactions.count) revenue transactions")

        return transactions
    }
}

// MARK: - Response Models

struct PropertyResponse: Codable {
    let id: String
    let title: String
    let address: String
    let city: String
    let bedrooms: Int
    let bathrooms: Int
    let surfaceArea: Int
    let monthlyRent: Decimal
    let charges: Decimal?
    let mainImage: String?
    let status: String
    let viewsCount: Int
    let applicationsCount: Int
    let favoritesCount: Int
    let createdAt: String
    let updatedAt: String
    let publishedAt: String?

    enum CodingKeys: String, CodingKey {
        case id, title, address, city, bedrooms, bathrooms, status
        case surfaceArea = "surface_area"
        case monthlyRent = "monthly_rent"
        case charges
        case mainImage = "main_image"
        case viewsCount = "views_count"
        case applicationsCount = "applications_count"
        case favoritesCount = "favorites_count"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case publishedAt = "published_at"
    }
}

struct ApplicationResponse: Codable {
    let id: String
    let applicantName: String
    let applicantEmail: String
    let createdAt: String
    let propertyId: String
    let status: String
    let property: PropertyEmbedded?

    enum CodingKeys: String, CodingKey {
        case id
        case applicantName = "applicant_name"
        case applicantEmail = "applicant_email"
        case createdAt = "created_at"
        case propertyId = "property_id"
        case status
        case property
    }

    struct PropertyEmbedded: Codable {
        let id: String
        let title: String
    }

    var parsedCreatedAt: Date? {
        return ISO8601DateFormatter().date(from: createdAt)
    }
}
