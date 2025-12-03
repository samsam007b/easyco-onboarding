import Foundation
import Combine

// MARK: - Auth Manager

@MainActor
class AuthManager: ObservableObject {
    static let shared = AuthManager()

    @Published var currentUser: User?
    @Published var isAuthenticated = false
    @Published var isLoading = false
    @Published var authError: NetworkError?

    private var cancellables = Set<AnyCancellable>()
    private let supabaseAuth = SupabaseAuth.shared
    let apiClient = APIClient.shared  // Changed to internal for OAuth extension

    private init() {
        setupAuthStateListener()
        checkAuthStatus()
    }

    // MARK: - Authentication Methods

    /// Login with email and password
    func login(email: String, password: String) async throws {
        isLoading = true
        authError = nil

        do {
            // Authenticate with Supabase
            let session = try await supabaseAuth.signIn(email: email, password: password)

            // Save token
            EasyCoKeychainManager.shared.saveAuthToken(session.accessToken)

            print("✅ Token saved, fetching profile for user: \(session.user.id)")

            // Try to fetch user profile, but don't fail if profile doesn't exist
            do {
                let user = try await fetchUserProfileFromSupabase(userId: session.user.id, email: session.user.email)
                self.currentUser = user
                print("✅ User profile loaded: \(user.firstName ?? "No name")")
            } catch {
                // Profile fetch failed, create a basic user from auth data
                print("⚠️ Profile fetch failed: \(error), using basic user data")
                self.currentUser = User(
                    id: UUID(uuidString: session.user.id) ?? UUID(),
                    email: session.user.email,
                    firstName: nil,
                    lastName: nil,
                    phoneNumber: nil,
                    profileImageURL: nil,
                    userType: .searcher,
                    onboardingCompleted: false,
                    createdAt: Date(),
                    updatedAt: Date()
                )
            }

            self.isAuthenticated = true
            isLoading = false
            print("✅ Login complete! isAuthenticated = \(self.isAuthenticated)")

        } catch {
            isLoading = false
            print("❌ Login failed: \(error)")
            let networkError = error as? NetworkError ?? .unknown(error)
            authError = networkError
            throw networkError
        }
    }

    /// Sign up with email and password
    func signUp(email: String, password: String, userData: [String: Any]) async throws {
        isLoading = true
        authError = nil

        do {
            // Create account in Supabase
            let session = try await supabaseAuth.signUp(email: email, password: password)

            // Save token
            EasyCoKeychainManager.shared.saveAuthToken(session.accessToken)

            // Create profile
            try await createProfile(userData: userData)

            // Fetch user profile
            // TODO: Implement getCurrentUser in APIClient
            // let user = try await apiClient.getCurrentUser()
            // self.currentUser = user
            self.isAuthenticated = true

            isLoading = false

        } catch {
            isLoading = false
            let networkError = error as? NetworkError ?? .unknown(error)
            authError = networkError
            throw networkError
        }
    }

    /// Logout
    func logout() async {
        isLoading = true

        do {
            try await supabaseAuth.signOut()
            EasyCoKeychainManager.shared.deleteAuthToken()

            self.currentUser = nil
            self.isAuthenticated = false

        } catch {
            print("Logout error: \(error)")
        }

        isLoading = false
    }

    /// Reset password
    func resetPassword(email: String) async throws {
        isLoading = true
        authError = nil

        do {
            try await supabaseAuth.resetPassword(email: email)
            isLoading = false

        } catch {
            isLoading = false
            let networkError = error as? NetworkError ?? .unknown(error)
            authError = networkError
            throw networkError
        }
    }

    // MARK: - Magic Link & OTP Authentication

    /// Send magic link to email for passwordless login
    func sendMagicLink(email: String) async throws {
        isLoading = true
        authError = nil

        do {
            try await supabaseAuth.sendMagicLink(email: email)
            isLoading = false
        } catch {
            isLoading = false
            let networkError = error as? NetworkError ?? .unknown(error)
            authError = networkError
            throw networkError
        }
    }

    /// Send OTP code to email
    func sendOTP(email: String, type: OTPType = .magiclink) async throws {
        isLoading = true
        authError = nil

        do {
            try await supabaseAuth.sendOTP(email: email, type: type)
            isLoading = false
        } catch {
            isLoading = false
            let networkError = error as? NetworkError ?? .unknown(error)
            authError = networkError
            throw networkError
        }
    }

    /// Verify OTP code and login
    func verifyOTP(email: String, token: String, type: OTPType = .magiclink) async throws {
        isLoading = true
        authError = nil

        do {
            let session = try await supabaseAuth.verifyOTP(email: email, token: token, type: type)
            EasyCoKeychainManager.shared.saveAuthToken(session.accessToken)

            // TODO: Implement getCurrentUser in APIClient
            // let user = try await apiClient.getCurrentUser()
            // self.currentUser = user
            self.isAuthenticated = true
            isLoading = false
        } catch {
            isLoading = false
            let networkError = error as? NetworkError ?? .unknown(error)
            authError = networkError
            throw networkError
        }
    }

    /// Handle magic link callback (from deep link)
    func handleMagicLinkCallback(tokenHash: String, type: String = "magiclink") async throws {
        isLoading = true
        authError = nil

        do {
            let session = try await supabaseAuth.verifyEmail(tokenHash: tokenHash, type: type)
            EasyCoKeychainManager.shared.saveAuthToken(session.accessToken)

            // TODO: Implement getCurrentUser in APIClient
            // let user = try await apiClient.getCurrentUser()
            // self.currentUser = user
            self.isAuthenticated = true
            isLoading = false
        } catch {
            isLoading = false
            let networkError = error as? NetworkError ?? .unknown(error)
            authError = networkError
            throw networkError
        }
    }

    /// Resend email confirmation
    func resendConfirmation(email: String) async throws {
        isLoading = true
        authError = nil

        do {
            try await supabaseAuth.resendConfirmation(email: email)
            isLoading = false
        } catch {
            isLoading = false
            let networkError = error as? NetworkError ?? .unknown(error)
            authError = networkError
            throw networkError
        }
    }

    /// Update password (when logged in)
    func updatePassword(newPassword: String) async throws {
        isLoading = true
        authError = nil

        do {
            try await supabaseAuth.updatePassword(newPassword: newPassword)
            isLoading = false
        } catch {
            isLoading = false
            let networkError = error as? NetworkError ?? .unknown(error)
            authError = networkError
            throw networkError
        }
    }

    /// Update user profile
    func updateProfile(userData: [String: Any]) async throws {
        guard isAuthenticated else { return }

        isLoading = true

        do {
            // TODO: Implement updateProfile and getCurrentUser in APIClient
            // try await apiClient.request(.updateProfile(userData: userData))
            // let user = try await apiClient.getCurrentUser()
            // self.currentUser = user

            isLoading = false

        } catch {
            isLoading = false
            throw error
        }
    }

    // MARK: - Private Methods

    private func setupAuthStateListener() {
        // Listen to Supabase auth state changes
        supabaseAuth.onAuthStateChange { [weak self] event, session in
            Task { @MainActor in
                switch event {
                case .signedIn:
                    if let token = session?.accessToken {
                        EasyCoKeychainManager.shared.saveAuthToken(token)
                        try? await self?.fetchCurrentUser()
                    }

                case .signedOut:
                    self?.currentUser = nil
                    self?.isAuthenticated = false
                    EasyCoKeychainManager.shared.deleteAuthToken()

                case .tokenRefreshed:
                    if let token = session?.accessToken {
                        EasyCoKeychainManager.shared.saveAuthToken(token)
                    }

                default:
                    break
                }
            }
        }
    }

    private func checkAuthStatus() {
        Task {
            // Check if we have a valid token
            guard EasyCoKeychainManager.shared.getAuthToken() != nil else {
                isAuthenticated = false
                return
            }

            // Try to fetch user
            do {
                try await fetchCurrentUser()
            } catch {
                // Token is invalid, clear it
                EasyCoKeychainManager.shared.deleteAuthToken()
                isAuthenticated = false
            }
        }
    }

    private func fetchCurrentUser() async throws {
        // Get auth user from Supabase
        let authUser = try await supabaseAuth.getCurrentUser()
        let user = try await fetchUserProfileFromSupabase(userId: authUser.id, email: authUser.email)
        self.currentUser = user
        self.isAuthenticated = true
    }

    /// Fetch user profile directly from Supabase
    /// Queries both 'users' table (for onboarding_completed, user_type) and 'profiles' table (for name, phone)
    private func fetchUserProfileFromSupabase(userId: String, email: String) async throws -> User {
        guard let token = EasyCoKeychainManager.shared.getAuthToken() else {
            throw NetworkError.unauthorized
        }

        let supabaseURL = AppConfig.supabaseURL
        let supabaseKey = AppConfig.supabaseAnonKey

        // First, query the 'users' table to get onboarding_completed and user_type
        var usersComponents = URLComponents(string: "\(supabaseURL)/rest/v1/users")!
        usersComponents.queryItems = [
            URLQueryItem(name: "id", value: "eq.\(userId)"),
            URLQueryItem(name: "select", value: "*")
        ]

        var usersRequest = URLRequest(url: usersComponents.url!)
        usersRequest.httpMethod = "GET"
        usersRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        usersRequest.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        usersRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        print("👤 Fetching user from: \(usersComponents.url!.absoluteString)")

        let (usersData, usersResponse) = try await URLSession.shared.data(for: usersRequest)

        var supabaseUser: SupabaseUser?

        if let httpResponse = usersResponse as? HTTPURLResponse,
           (200...299).contains(httpResponse.statusCode) {
            if let responseString = String(data: usersData, encoding: .utf8) {
                print("👤 Users response (\(httpResponse.statusCode)): \(responseString.prefix(500))")
            }

            let decoder = createDateDecoder()
            if let users = try? decoder.decode([SupabaseUser].self, from: usersData),
               let user = users.first {
                supabaseUser = user
                print("✅ User loaded: onboarding=\(user.onboardingCompleted ?? false), type=\(user.userType ?? "nil")")
            }
        }

        // Also query 'profiles' table for name/phone data
        var profilesComponents = URLComponents(string: "\(supabaseURL)/rest/v1/profiles")!
        profilesComponents.queryItems = [
            URLQueryItem(name: "user_id", value: "eq.\(userId)"),
            URLQueryItem(name: "select", value: "*")
        ]

        var profilesRequest = URLRequest(url: profilesComponents.url!)
        profilesRequest.httpMethod = "GET"
        profilesRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        profilesRequest.setValue(supabaseKey, forHTTPHeaderField: "apikey")
        profilesRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        print("👤 Fetching profile from: \(profilesComponents.url!.absoluteString)")

        let (profilesData, profilesResponse) = try await URLSession.shared.data(for: profilesRequest)

        var supabaseProfile: SupabaseProfile?

        if let httpResponse = profilesResponse as? HTTPURLResponse,
           (200...299).contains(httpResponse.statusCode) {
            if let responseString = String(data: profilesData, encoding: .utf8) {
                print("👤 Profiles response (\(httpResponse.statusCode)): \(responseString.prefix(500))")
            }

            let decoder = createDateDecoder()
            if let profiles = try? decoder.decode([SupabaseProfile].self, from: profilesData),
               let profile = profiles.first {
                supabaseProfile = profile
                print("✅ Profile loaded: \(profile.firstName ?? "No name") \(profile.lastName ?? "")")
            }
        }

        // Build User from combined data
        let parsedUserType: User.UserType
        switch supabaseUser?.userType {
        case "owner": parsedUserType = .owner
        case "resident": parsedUserType = .resident
        default: parsedUserType = .searcher
        }

        // Use data from both tables, falling back to email/userId if needed
        return User(
            id: UUID(uuidString: userId) ?? UUID(),
            email: email,
            firstName: supabaseProfile?.firstName ?? supabaseUser?.fullName?.components(separatedBy: " ").first,
            lastName: supabaseProfile?.lastName ?? supabaseUser?.fullName?.components(separatedBy: " ").dropFirst().joined(separator: " "),
            phoneNumber: supabaseProfile?.phoneNumber,
            profileImageURL: supabaseProfile?.profilePhotoUrl ?? supabaseUser?.avatarUrl,
            userType: parsedUserType,
            onboardingCompleted: supabaseUser?.onboardingCompleted ?? false,
            createdAt: supabaseProfile?.createdAt ?? supabaseUser?.createdAt ?? Date(),
            updatedAt: supabaseProfile?.updatedAt ?? supabaseUser?.updatedAt ?? Date()
        )
    }

    private func createDateDecoder() -> JSONDecoder {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { decoder in
            let container = try decoder.singleValueContainer()
            let dateString = try container.decode(String.self)

            let isoFormatter = ISO8601DateFormatter()
            isoFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            if let date = isoFormatter.date(from: dateString) {
                return date
            }

            isoFormatter.formatOptions = [.withInternetDateTime]
            if let date = isoFormatter.date(from: dateString) {
                return date
            }

            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyy-MM-dd"
            dateFormatter.locale = Locale(identifier: "en_US_POSIX")
            if let date = dateFormatter.date(from: dateString) {
                return date
            }

            throw DecodingError.dataCorruptedError(in: container, debugDescription: "Cannot decode date")
        }
        return decoder
    }

    private func createProfile(userData: [String: Any]) async throws {
        // TODO: Implement createProfile/updateProfile endpoint
        // try await apiClient.request(.updateProfile(userData: userData))
    }
}

// MARK: - Supabase User Model (from 'users' table)

struct SupabaseUser: Codable {
    let id: UUID
    let email: String?
    let fullName: String?
    let avatarUrl: String?
    let userType: String?
    let emailVerified: Bool?
    let onboardingCompleted: Bool?
    let createdAt: Date?
    let updatedAt: Date?

    enum CodingKeys: String, CodingKey {
        case id
        case email
        case fullName = "full_name"
        case avatarUrl = "avatar_url"
        case userType = "user_type"
        case emailVerified = "email_verified"
        case onboardingCompleted = "onboarding_completed"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

// MARK: - Supabase Profile Model (from 'profiles' table)

struct SupabaseProfile: Codable {
    let id: UUID
    let userId: UUID?
    let email: String?
    let firstName: String?
    let lastName: String?
    let phoneNumber: String?
    let profilePhotoUrl: String?
    let dateOfBirth: Date?
    let createdAt: Date?
    let updatedAt: Date?

    enum CodingKeys: String, CodingKey {
        case id
        case userId = "user_id"
        case email
        case firstName = "first_name"
        case lastName = "last_name"
        case phoneNumber = "phone_number"
        case profilePhotoUrl = "profile_photo_url"
        case dateOfBirth = "date_of_birth"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

// MARK: - Auth Session

struct AuthSession: Codable {
    let accessToken: String
    let refreshToken: String
    let expiresIn: Int
    let tokenType: String
    let user: AuthUser

    enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case refreshToken = "refresh_token"
        case expiresIn = "expires_in"
        case tokenType = "token_type"
        case user
    }
}

struct AuthUser: Codable {
    let id: String
    let email: String
    let createdAt: Date?

    enum CodingKeys: String, CodingKey {
        case id
        case email
        case createdAt = "created_at"
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(String.self, forKey: .id)

        // Email might be in different places in the response
        if let email = try? container.decode(String.self, forKey: .email) {
            self.email = email
        } else {
            self.email = ""
        }

        // createdAt is optional and might have different formats
        if let dateString = try? container.decode(String.self, forKey: .createdAt) {
            let isoFormatter = ISO8601DateFormatter()
            isoFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            if let date = isoFormatter.date(from: dateString) {
                self.createdAt = date
            } else {
                isoFormatter.formatOptions = [.withInternetDateTime]
                self.createdAt = isoFormatter.date(from: dateString)
            }
        } else {
            self.createdAt = nil
        }
    }
}
