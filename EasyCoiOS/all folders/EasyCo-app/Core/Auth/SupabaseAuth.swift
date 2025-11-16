import Foundation

// MARK: - Supabase Auth Client

class SupabaseAuth {
    static let shared = SupabaseAuth()

    private let supabaseURL: String
    private let supabaseKey: String
    private var authStateChangeCallbacks: [(AuthChangeEvent, AuthSession?) -> Void] = []

    private init() {
        self.supabaseURL = AppConfig.supabaseURL
        self.supabaseKey = AppConfig.supabaseAnonKey
    }

    // MARK: - Authentication Methods

    /// Sign in with email and password
    func signIn(email: String, password: String) async throws -> AuthSession {
        let url = URL(string: "\(supabaseURL)/auth/v1/token?grant_type=password")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")

        let body = [
            "email": email,
            "password": password
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        guard httpResponse.statusCode == 200 else {
            if httpResponse.statusCode == 400 {
                throw NetworkError.unauthorized
            }
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        let session = try decoder.decode(AuthSession.self, from: data)

        // Notify listeners
        notifyAuthStateChange(.signedIn, session: session)

        return session
    }

    /// Sign up with email and password
    func signUp(email: String, password: String) async throws -> AuthSession {
        let url = URL(string: "\(supabaseURL)/auth/v1/signup")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")

        let body = [
            "email": email,
            "password": password
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        guard httpResponse.statusCode == 200 else {
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        let session = try decoder.decode(AuthSession.self, from: data)

        // Notify listeners
        notifyAuthStateChange(.signedIn, session: session)

        return session
    }

    /// Sign out
    func signOut() async throws {
        guard let token = KeychainManager.shared.getAuthToken() else { return }

        let url = URL(string: "\(supabaseURL)/auth/v1/logout")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        let (_, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 204 else {
            throw NetworkError.unknown(NSError(domain: "Logout failed", code: -1))
        }

        // Notify listeners
        notifyAuthStateChange(.signedOut, session: nil)
    }

    /// Reset password
    func resetPassword(email: String) async throws {
        let url = URL(string: "\(supabaseURL)/auth/v1/recover")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")

        let body = ["email": email]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (_, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw NetworkError.unknown(NSError(domain: "Password reset failed", code: -1))
        }
    }

    /// Refresh session
    func refreshSession(refreshToken: String) async throws -> AuthSession {
        let url = URL(string: "\(supabaseURL)/auth/v1/token?grant_type=refresh_token")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")

        let body = ["refresh_token": refreshToken]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw NetworkError.unauthorized
        }

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        let session = try decoder.decode(AuthSession.self, from: data)

        // Notify listeners
        notifyAuthStateChange(.tokenRefreshed, session: session)

        return session
    }

    // MARK: - Auth State Listener

    func onAuthStateChange(_ callback: @escaping (AuthChangeEvent, AuthSession?) -> Void) {
        authStateChangeCallbacks.append(callback)
    }

    private func notifyAuthStateChange(_ event: AuthChangeEvent, session: AuthSession?) {
        authStateChangeCallbacks.forEach { callback in
            callback(event, session)
        }
    }
}

// MARK: - Auth Change Event

enum AuthChangeEvent {
    case signedIn
    case signedOut
    case tokenRefreshed
    case userUpdated
    case passwordRecovery
}
