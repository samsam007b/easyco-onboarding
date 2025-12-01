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

        print("🔐 Attempting login to: \(url.absoluteString)")
        print("🔐 Email: \(email)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        // Debug: Log response
        if let responseString = String(data: data, encoding: .utf8) {
            print("🔐 Auth response (\(httpResponse.statusCode)): \(responseString.prefix(500))")
        }

        guard httpResponse.statusCode == 200 else {
            if httpResponse.statusCode == 400 {
                // Parse error message from response
                if let errorJson = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                   let errorMessage = errorJson["error_description"] as? String ?? errorJson["msg"] as? String {
                    print("❌ Auth error: \(errorMessage)")
                }
                throw NetworkError.unauthorized
            }
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        // Decode session - don't use dateDecodingStrategy, AuthUser handles dates manually
        let decoder = JSONDecoder()

        do {
            let session = try decoder.decode(AuthSession.self, from: data)
            print("✅ Login successful for user: \(session.user.email), id: \(session.user.id)")

            // Notify listeners
            notifyAuthStateChange(.signedIn, session: session)

            return session
        } catch {
            print("❌ Failed to decode AuthSession: \(error)")
            if let responseString = String(data: data, encoding: .utf8) {
                print("📋 Raw response: \(responseString)")
            }
            throw error
        }
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
        let session = try decoder.decode(AuthSession.self, from: data)

        // Notify listeners
        notifyAuthStateChange(.signedIn, session: session)

        return session
    }

    /// Sign out
    func signOut() async throws {
        guard let token = EasyCoKeychainManager.shared.getAuthToken() else { return }

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

    // MARK: - Magic Link Authentication

    /// Send magic link to email
    func sendMagicLink(email: String, redirectTo: String? = nil) async throws {
        let url = URL(string: "\(supabaseURL)/auth/v1/magiclink")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")

        var body: [String: Any] = ["email": email]
        if let redirectTo = redirectTo {
            body["options"] = ["redirectTo": redirectTo]
        }
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        guard httpResponse.statusCode == 200 else {
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }
    }

    /// Send OTP to email (for verification)
    func sendOTP(email: String, type: OTPType = .magiclink) async throws {
        let url = URL(string: "\(supabaseURL)/auth/v1/otp")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")

        let body: [String: Any] = [
            "email": email,
            "type": type.rawValue
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        guard httpResponse.statusCode == 200 else {
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }
    }

    /// Verify OTP code
    func verifyOTP(email: String, token: String, type: OTPType = .magiclink) async throws -> AuthSession {
        let url = URL(string: "\(supabaseURL)/auth/v1/verify")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")

        let body: [String: Any] = [
            "email": email,
            "token": token,
            "type": type.rawValue
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        guard httpResponse.statusCode == 200 else {
            if httpResponse.statusCode == 401 {
                throw NetworkError.invalidOTP
            }
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        let session = try decoder.decode(AuthSession.self, from: data)

        notifyAuthStateChange(.signedIn, session: session)
        return session
    }

    /// Verify email with token from URL
    func verifyEmail(tokenHash: String, type: String = "email") async throws -> AuthSession {
        let url = URL(string: "\(supabaseURL)/auth/v1/verify")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")

        let body: [String: Any] = [
            "token_hash": tokenHash,
            "type": type
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
        let session = try decoder.decode(AuthSession.self, from: data)

        notifyAuthStateChange(.signedIn, session: session)
        return session
    }

    /// Resend email confirmation
    func resendConfirmation(email: String) async throws {
        let url = URL(string: "\(supabaseURL)/auth/v1/resend")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")

        let body: [String: Any] = [
            "type": "signup",
            "email": email
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        guard httpResponse.statusCode == 200 else {
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }
    }

    /// Update password (when user is logged in)
    func updatePassword(newPassword: String) async throws {
        guard let token = EasyCoKeychainManager.shared.getAuthToken() else {
            throw NetworkError.unauthorized
        }

        let url = URL(string: "\(supabaseURL)/auth/v1/user")!
        var request = URLRequest(url: url)
        request.httpMethod = "PUT"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        let body = ["password": newPassword]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        guard httpResponse.statusCode == 200 else {
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        notifyAuthStateChange(.userUpdated, session: nil)
    }

    /// Get current user info
    func getCurrentUser() async throws -> AuthUser {
        guard let token = EasyCoKeychainManager.shared.getAuthToken() else {
            throw NetworkError.unauthorized
        }

        let url = URL(string: "\(supabaseURL)/auth/v1/user")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        guard httpResponse.statusCode == 200 else {
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        let decoder = JSONDecoder()
        return try decoder.decode(AuthUser.self, from: data)
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
    case magicLinkSent
    case otpSent
}

// MARK: - OTP Type

enum OTPType: String {
    case signup = "signup"
    case magiclink = "magiclink"
    case recovery = "recovery"
    case emailChange = "email_change"
    case email = "email"
}
