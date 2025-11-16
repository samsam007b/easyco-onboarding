import Foundation
import Security

// MARK: - Keychain Manager

class KeychainManager {
    static let shared = KeychainManager()

    private let service = AppConfig.bundleIdentifier
    private let authTokenKey = "auth_token"
    private let refreshTokenKey = "refresh_token"

    private init() {}

    // MARK: - Auth Token

    func saveAuthToken(_ token: String) {
        save(token, forKey: authTokenKey)
    }

    func getAuthToken() -> String? {
        get(forKey: authTokenKey)
    }

    func deleteAuthToken() {
        delete(forKey: authTokenKey)
    }

    // MARK: - Refresh Token

    func saveRefreshToken(_ token: String) {
        save(token, forKey: refreshTokenKey)
    }

    func getRefreshToken() -> String? {
        get(forKey: refreshTokenKey)
    }

    func deleteRefreshToken() {
        delete(forKey: refreshTokenKey)
    }

    // MARK: - Clear All

    func clearAll() {
        deleteAuthToken()
        deleteRefreshToken()
    }

    // MARK: - Private Methods

    private func save(_ value: String, forKey key: String) {
        guard let data = value.data(using: .utf8) else { return }

        // Delete existing item
        delete(forKey: key)

        // Create query
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlock
        ]

        // Add to keychain
        let status = SecItemAdd(query as CFDictionary, nil)

        if status != errSecSuccess {
            print("❌ Keychain save error: \(status)")
        }
    }

    private func get(forKey key: String) -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)

        guard status == errSecSuccess,
              let data = result as? Data,
              let value = String(data: data, encoding: .utf8) else {
            return nil
        }

        return value
    }

    private func delete(forKey key: String) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key
        ]

        SecItemDelete(query as CFDictionary)
    }
}
