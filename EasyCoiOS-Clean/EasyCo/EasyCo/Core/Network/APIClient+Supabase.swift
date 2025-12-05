//
//  APIClient+Supabase.swift
//  EasyCo
//
//  Supabase-specific API implementations
//  Extends APIClient with Favorites and Applications support
//

import Foundation

extension APIClient {

    // MARK: - Favorites

    func addFavoriteToSupabase(_ propertyId: UUID) async throws {
        // Add favorite via Supabase
        let supabaseURL = AppConfig.supabaseURL
        let supabaseKey = AppConfig.supabaseAnonKey

        guard let accessToken = EasyCoKeychainManager.shared.getAuthToken() else {
            throw NetworkError.unauthorized
        }

        guard let user = AuthManager.shared.currentUser else {
            throw NetworkError.unauthorized
        }

        let url = URL(string: "\(supabaseURL)/rest/v1/favorites")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("return=minimal", forHTTPHeaderField: "Prefer")

        let body: [String: String] = [
            "user_id": user.id.uuidString,
            "property_id": propertyId.uuidString
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        print("❤️ Adding favorite: \(propertyId)")

        let (_, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 201 {
            print("❌ Add favorite failed: \(httpResponse.statusCode)")
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: nil)
        }

        print("✅ Favorite added")
    }

    func removeFavoriteFromSupabase(_ propertyId: UUID) async throws {
        // Remove favorite via Supabase
        let supabaseURL = AppConfig.supabaseURL
        let supabaseKey = AppConfig.supabaseAnonKey

        guard let accessToken = EasyCoKeychainManager.shared.getAuthToken() else {
            throw NetworkError.unauthorized
        }

        guard let user = AuthManager.shared.currentUser else {
            throw NetworkError.unauthorized
        }

        let url = URL(string: "\(supabaseURL)/rest/v1/favorites")!
        var components = URLComponents(url: url, resolvingAgainstBaseURL: false)!
        components.queryItems = [
            URLQueryItem(name: "user_id", value: "eq.\(user.id.uuidString)"),
            URLQueryItem(name: "property_id", value: "eq.\(propertyId.uuidString)")
        ]

        var request = URLRequest(url: components.url!)
        request.httpMethod = "DELETE"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        print("💔 Removing favorite: \(propertyId)")

        let (_, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 204 && httpResponse.statusCode != 200 {
            print("❌ Remove favorite failed: \(httpResponse.statusCode)")
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: nil)
        }

        print("✅ Favorite removed")
    }

    func getFavoritesFromSupabase() async throws -> [Property] {
        // Fetch user's favorites from Supabase
        let supabaseURL = AppConfig.supabaseURL
        let supabaseKey = AppConfig.supabaseAnonKey

        guard let accessToken = EasyCoKeychainManager.shared.getAuthToken() else {
            throw NetworkError.unauthorized
        }

        guard let user = AuthManager.shared.currentUser else {
            throw NetworkError.unauthorized
        }

        let url = URL(string: "\(supabaseURL)/rest/v1/favorites")!
        var components = URLComponents(url: url, resolvingAgainstBaseURL: false)!
        components.queryItems = [
            URLQueryItem(name: "user_id", value: "eq.\(user.id.uuidString)"),
            URLQueryItem(name: "select", value: "property_id,properties(*)")
        ]

        var request = URLRequest(url: components.url!)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        print("❤️ Fetching favorites for user")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 200 {
            print("❌ Favorites fetch failed: \(httpResponse.statusCode)")
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: nil)
        }

        // For now, just return empty array
        // TODO: Properly decode favorites with embedded properties
        print("✅ Favorites fetched")
        return []
    }

    // MARK: - Applications

    func submitApplicationToSupabase(
        propertyId: UUID,
        applicantName: String,
        applicantEmail: String,
        message: String?
    ) async throws {
        // Submit rental application via Supabase
        let supabaseURL = AppConfig.supabaseURL
        let supabaseKey = AppConfig.supabaseAnonKey

        guard let accessToken = EasyCoKeychainManager.shared.getAuthToken() else {
            throw NetworkError.unauthorized
        }

        guard let user = AuthManager.shared.currentUser else {
            throw NetworkError.unauthorized
        }

        let url = URL(string: "\(supabaseURL)/rest/v1/applications")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("return=minimal", forHTTPHeaderField: "Prefer")

        var body: [String: Any] = [
            "applicant_id": user.id.uuidString,
            "property_id": propertyId.uuidString,
            "applicant_name": applicantName,
            "applicant_email": applicantEmail,
            "status": "pending"
        ]
        if let message = message {
            body["message"] = message
        }
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        print("📝 Submitting application for property: \(propertyId)")

        let (_, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        if httpResponse.statusCode != 201 {
            print("❌ Application submission failed: \(httpResponse.statusCode)")
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: nil)
        }

        print("✅ Application submitted")
    }
}
