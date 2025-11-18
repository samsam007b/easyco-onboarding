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
    private let apiClient = APIClient.shared

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

            // Fetch user profile
            let user = try await apiClient.getCurrentUser()
            self.currentUser = user
            self.isAuthenticated = true

            isLoading = false

        } catch {
            isLoading = false
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
            let user = try await apiClient.getCurrentUser()
            self.currentUser = user
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

    /// Update user profile
    func updateProfile(userData: [String: Any]) async throws {
        guard isAuthenticated else { return }

        isLoading = true

        do {
            // Update via API
            try await apiClient.request(.updateProfile(userData: userData))

            // Refresh user data
            let user = try await apiClient.getCurrentUser()
            self.currentUser = user

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
            _Concurrency.Task { @MainActor in
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
        _Concurrency.Task {
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
        let user = try await apiClient.getCurrentUser()
        self.currentUser = user
        self.isAuthenticated = true
    }

    private func createProfile(userData: [String: Any]) async throws {
        try await apiClient.request(
            .updateProfile(userData: userData)
        )
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
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id
        case email
        case createdAt = "created_at"
    }
}
