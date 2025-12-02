//
//  AuthService.swift
//  EasyCo
//
//  Authentication service
//

import Foundation
import Combine

class AuthService: ObservableObject {
    static let shared = AuthService()

    @Published private(set) var currentUser: User?
    @Published private(set) var isAuthenticated = false
    @Published private(set) var authState: AuthState = .unauthenticated

    private let networkManager = NetworkManager.shared
    private var cancellables = Set<AnyCancellable>()

    enum AuthState {
        case unauthenticated
        case authenticating
        case authenticated(User)
        case error(APIError)
    }

    private init() {
        checkAuthState()
    }

    // MARK: - Auth State Check

    private func checkAuthState() {
        // Check if we have a stored token
        if networkManager.authToken != nil {
            // TODO: Validate token with server or decode JWT
            // For now, fetch current user
            Task {
                await fetchCurrentUser()
            }
        }
    }

    // MARK: - Login

    func login(email: String, password: String) async throws {
        authState = .authenticating

        do {
            let request = LoginRequest(email: email, password: password)
            let response = try await networkManager.execute(request)

            // Save tokens
            networkManager.setAuthToken(response.accessToken)
            saveRefreshToken(response.refreshToken)

            // Update state
            await MainActor.run {
                self.currentUser = response.user
                self.isAuthenticated = true
                self.authState = .authenticated(response.user)
            }

            // Post notification
            NotificationCenter.default.post(name: .userDidLogin, object: nil)

        } catch let error as APIError {
            await MainActor.run {
                self.authState = .error(error)
            }
            throw error
        }
    }

    // MARK: - Register

    func register(
        email: String,
        password: String,
        firstName: String,
        lastName: String,
        role: UserRole
    ) async throws {
        authState = .authenticating

        do {
            let request = RegisterRequest(
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                role: role
            )
            let response = try await networkManager.execute(request)

            // Save tokens
            networkManager.setAuthToken(response.accessToken)
            saveRefreshToken(response.refreshToken)

            // Update state
            await MainActor.run {
                self.currentUser = response.user
                self.isAuthenticated = true
                self.authState = .authenticated(response.user)
            }

            // Post notification
            NotificationCenter.default.post(name: .userDidRegister, object: nil)

        } catch let error as APIError {
            await MainActor.run {
                self.authState = .error(error)
            }
            throw error
        }
    }

    // MARK: - Logout

    func logout() async {
        do {
            let request = LogoutRequest()
            _ = try await networkManager.execute(request)
        } catch {
            print("Logout error: \(error)")
        }

        // Clear local state regardless of server response
        await MainActor.run {
            networkManager.clearAuthToken()
            clearRefreshToken()
            self.currentUser = nil
            self.isAuthenticated = false
            self.authState = .unauthenticated
        }

        // Post notification
        NotificationCenter.default.post(name: .userDidLogout, object: nil)
    }

    // MARK: - Refresh Token

    func refreshToken() async throws {
        guard let refreshToken = getRefreshToken() else {
            throw APIError.unauthorized
        }

        let request = RefreshTokenRequest(refreshToken: refreshToken)
        let response = try await networkManager.execute(request)

        networkManager.setAuthToken(response.accessToken)
        saveRefreshToken(response.refreshToken)

        await MainActor.run {
            self.currentUser = response.user
            self.isAuthenticated = true
            self.authState = .authenticated(response.user)
        }
    }

    // MARK: - Fetch Current User

    func fetchCurrentUser() async {
        do {
            let request = GetUserProfileRequest()
            let user = try await networkManager.execute(request)

            await MainActor.run {
                self.currentUser = user
                self.isAuthenticated = true
                self.authState = .authenticated(user)
            }
        } catch {
            // Token might be invalid
            await MainActor.run {
                self.isAuthenticated = false
                self.authState = .unauthenticated
            }
        }
    }

    // MARK: - Token Storage

    private func saveRefreshToken(_ token: String) {
        UserDefaults.standard.set(token, forKey: "refresh_token")
    }

    private func getRefreshToken() -> String? {
        UserDefaults.standard.string(forKey: "refresh_token")
    }

    private func clearRefreshToken() {
        UserDefaults.standard.removeObject(forKey: "refresh_token")
    }
}

// MARK: - Notifications

extension Notification.Name {
    static let userDidLogin = Notification.Name("userDidLogin")
    static let userDidLogout = Notification.Name("userDidLogout")
    static let userDidRegister = Notification.Name("userDidRegister")
}
