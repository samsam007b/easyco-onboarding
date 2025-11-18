import Foundation

// MARK: - User Defaults Manager

class UserDefaultsManager {
    static let shared = UserDefaultsManager()

    private let defaults = UserDefaults.standard

    // Keys
    private enum Keys {
        static let hasCompletedOnboarding = "hasCompletedOnboarding"
        static let selectedLanguage = "selectedLanguage"
        static let notificationsEnabled = "notificationsEnabled"
        static let searchFilters = "searchFilters"
        static let recentSearches = "recentSearches"
    }

    private init() {}

    // MARK: - Onboarding

    var hasCompletedOnboarding: Bool {
        get { defaults.bool(forKey: Keys.hasCompletedOnboarding) }
        set { defaults.set(newValue, forKey: Keys.hasCompletedOnboarding) }
    }

    // MARK: - Language

    var selectedLanguage: String {
        get { defaults.string(forKey: Keys.selectedLanguage) ?? "fr" }
        set { defaults.set(newValue, forKey: Keys.selectedLanguage) }
    }

    // MARK: - Notifications

    var notificationsEnabled: Bool {
        get { defaults.bool(forKey: Keys.notificationsEnabled) }
        set { defaults.set(newValue, forKey: Keys.notificationsEnabled) }
    }

    // MARK: - Search Filters

    func saveSearchFilters(_ filters: PropertyFilters) {
        if let encoded = try? JSONEncoder().encode(filters) {
            defaults.set(encoded, forKey: Keys.searchFilters)
        }
    }

    func getSearchFilters() -> PropertyFilters? {
        guard let data = defaults.data(forKey: Keys.searchFilters),
              let filters = try? JSONDecoder().decode(PropertyFilters.self, from: data) else {
            return nil
        }
        return filters
    }

    // MARK: - Recent Searches

    func addRecentSearch(_ query: String) {
        var searches = getRecentSearches()
        searches.insert(query, at: 0)

        // Keep only last 10
        searches = Array(searches.prefix(10))

        defaults.set(searches, forKey: Keys.recentSearches)
    }

    func getRecentSearches() -> [String] {
        defaults.stringArray(forKey: Keys.recentSearches) ?? []
    }

    func clearRecentSearches() {
        defaults.removeObject(forKey: Keys.recentSearches)
    }

    // MARK: - Clear All

    func clearAll() {
        hasCompletedOnboarding = false
        notificationsEnabled = false
        clearRecentSearches()
        defaults.removeObject(forKey: Keys.searchFilters)
    }
}

// MARK: - PropertyFilters Codable Extension
// Note: PropertyFilters conformance to Codable is now defined in APIEndpoint.swift
