//
//  ResidentDashboardService.swift
//  EasyCo
//
//  Service layer for fetching resident dashboard data from Supabase
//  Matches web app implementation using property_members, transactions, payment_schedules
//

import Foundation

// MARK: - Supabase Response Models

struct PropertyMemberResponse: Codable {
    let id: String
    let userId: String
    let propertyId: String
    let status: String
    let role: String?
    let moveInDate: String?
    let moveOutDate: String?
    let sharePercent: Decimal?

    enum CodingKeys: String, CodingKey {
        case id
        case userId = "user_id"
        case propertyId = "property_id"
        case status
        case role
        case moveInDate = "move_in_date"
        case moveOutDate = "move_out_date"
        case sharePercent = "share_percent"
    }

    var parsedMoveInDate: Date? {
        guard let dateStr = moveInDate else { return nil }
        return ISO8601DateFormatter().date(from: dateStr)
    }

    var parsedMoveOutDate: Date? {
        guard let dateStr = moveOutDate else { return nil }
        return ISO8601DateFormatter().date(from: dateStr)
    }
}

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

    enum CodingKeys: String, CodingKey {
        case id, title, address, city, bedrooms, bathrooms
        case surfaceArea = "surface_area"
        case monthlyRent = "monthly_rent"
        case charges
        case mainImage = "main_image"
    }
}

struct TransactionResponse: Codable {
    let id: String
    let payerId: String?
    let payeeId: String?
    let propertyId: String?
    let amount: Decimal
    let currency: String
    let transactionType: String
    let status: String
    let dueDate: String?
    let paidAt: String?
    let createdAt: String

    enum CodingKeys: String, CodingKey {
        case id
        case payerId = "payer_id"
        case payeeId = "payee_id"
        case propertyId = "property_id"
        case amount, currency
        case transactionType = "transaction_type"
        case status
        case dueDate = "due_date"
        case paidAt = "paid_at"
        case createdAt = "created_at"
    }

    var parsedDueDate: Date? {
        guard let dateStr = dueDate else { return nil }
        return ISO8601DateFormatter().date(from: dateStr)
    }

    var parsedPaidAt: Date? {
        guard let dateStr = paidAt else { return nil }
        return ISO8601DateFormatter().date(from: dateStr)
    }
}

struct PaymentScheduleResponse: Codable {
    let id: String
    let payerId: String
    let amount: Decimal
    let frequency: String
    let paymentType: String
    let nextPaymentDate: String
    let isActive: Bool

    enum CodingKeys: String, CodingKey {
        case id
        case payerId = "payer_id"
        case amount, frequency
        case paymentType = "payment_type"
        case nextPaymentDate = "next_payment_date"
        case isActive = "is_active"
    }

    var parsedNextPaymentDate: Date? {
        return ISO8601DateFormatter().date(from: nextPaymentDate)
    }
}

// MARK: - Resident Dashboard Service

class ResidentDashboardService {

    private let supabaseURL: String
    private let supabaseKey: String

    init() {
        self.supabaseURL = AppConfig.supabaseURL
        self.supabaseKey = AppConfig.supabaseAnonKey
    }

    // MARK: - Property Membership

    /// Fetch active property membership for user
    /// Matches web app: property_members table with status = 'active'
    func fetchPropertyMembership(userId: String, accessToken: String) async throws -> PropertyMemberResponse? {
        let url = URL(string: "\(supabaseURL)/rest/v1/property_members")!
        var components = URLComponents(url: url, resolvingAgainstBaseURL: false)!
        components.queryItems = [
            URLQueryItem(name: "user_id", value: "eq.\(userId)"),
            URLQueryItem(name: "status", value: "eq.active"),
            URLQueryItem(name: "select", value: "*")
        ]

        var request = URLRequest(url: components.url!)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        print("🔍 Fetching property membership for user: \(userId)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 200 {
            print("❌ Property membership fetch failed: \(httpResponse.statusCode)")
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        let members = try decoder.decode([PropertyMemberResponse].self, from: data)

        if let member = members.first {
            print("✅ Found active property membership: \(member.propertyId)")
            return member
        }

        print("⚠️ No active property membership found")
        return nil
    }

    // MARK: - Property Details

    /// Fetch property details
    func fetchPropertyDetails(propertyId: String, accessToken: String) async throws -> PropertyResponse? {
        let url = URL(string: "\(supabaseURL)/rest/v1/properties")!
        var components = URLComponents(url: url, resolvingAgainstBaseURL: false)!
        components.queryItems = [
            URLQueryItem(name: "id", value: "eq.\(propertyId)"),
            URLQueryItem(name: "select", value: "id,title,address,city,bedrooms,bathrooms,surface_area,monthly_rent,charges,main_image")
        ]

        var request = URLRequest(url: components.url!)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        print("🏠 Fetching property details: \(propertyId)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 200 {
            print("❌ Property fetch failed: \(httpResponse.statusCode)")
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        let properties = try decoder.decode([PropertyResponse].self, from: data)

        if let property = properties.first {
            print("✅ Property loaded: \(property.title)")
            return property
        }

        return nil
    }

    // MARK: - Transactions (Payment History)

    /// Fetch transactions for user
    /// Matches web app: transactions table filtered by payer_id or payee_id
    func fetchTransactions(userId: String, accessToken: String, limit: Int = 100) async throws -> [TransactionResponse] {
        let url = URL(string: "\(supabaseURL)/rest/v1/transactions")!
        var components = URLComponents(url: url, resolvingAgainstBaseURL: false)!
        components.queryItems = [
            URLQueryItem(name: "or", value: "(payer_id.eq.\(userId),payee_id.eq.\(userId))"),
            URLQueryItem(name: "order", value: "created_at.desc"),
            URLQueryItem(name: "limit", value: "\(limit)"),
            URLQueryItem(name: "select", value: "*")
        ]

        var request = URLRequest(url: components.url!)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("return=representation", forHTTPHeaderField: "Prefer")

        print("💰 Fetching transactions for user: \(userId)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 200 {
            print("❌ Transactions fetch failed: \(httpResponse.statusCode)")
            if let responseStr = String(data: data, encoding: .utf8) {
                print("Response: \(responseStr.prefix(500))")
            }
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        let transactions = try decoder.decode([TransactionResponse].self, from: data)
        print("✅ Loaded \(transactions.count) transactions")

        return transactions
    }

    // MARK: - Payment Schedules

    /// Fetch payment schedules for user
    /// Matches web app: payment_schedules table for recurring payments
    func fetchPaymentSchedules(userId: String, accessToken: String) async throws -> [PaymentScheduleResponse] {
        let url = URL(string: "\(supabaseURL)/rest/v1/payment_schedules")!
        var components = URLComponents(url: url, resolvingAgainstBaseURL: false)!
        components.queryItems = [
            URLQueryItem(name: "or", value: "(payer_id.eq.\(userId),payee_id.eq.\(userId))"),
            URLQueryItem(name: "is_active", value: "eq.true"),
            URLQueryItem(name: "order", value: "next_payment_date.asc"),
            URLQueryItem(name: "select", value: "*")
        ]

        var request = URLRequest(url: components.url!)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        print("📅 Fetching payment schedules for user: \(userId)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 200 {
            print("❌ Payment schedules fetch failed: \(httpResponse.statusCode)")
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        let schedules = try decoder.decode([PaymentScheduleResponse].self, from: data)
        print("✅ Loaded \(schedules.count) payment schedules")

        return schedules
    }
}
