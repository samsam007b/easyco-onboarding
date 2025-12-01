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

extension PropertyFilters: Codable {
    enum CodingKeys: String, CodingKey {
        case city, cities, minPrice, maxPrice, propertyType, propertyTypes, minRooms, minBedrooms, amenities, availableFrom
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        city = try container.decodeIfPresent(String.self, forKey: .city)
        cities = try container.decodeIfPresent([String].self, forKey: .cities) ?? []
        minPrice = try container.decodeIfPresent(Int.self, forKey: .minPrice)
        maxPrice = try container.decodeIfPresent(Int.self, forKey: .maxPrice)
        propertyType = try container.decodeIfPresent(PropertyType.self, forKey: .propertyType)
        propertyTypes = try container.decodeIfPresent([PropertyType].self, forKey: .propertyTypes) ?? []
        minRooms = try container.decodeIfPresent(Int.self, forKey: .minRooms)
        minBedrooms = try container.decodeIfPresent(Int.self, forKey: .minBedrooms)
        amenities = try container.decodeIfPresent([PropertyAmenity].self, forKey: .amenities) ?? []
        availableFrom = try container.decodeIfPresent(Date.self, forKey: .availableFrom)
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encodeIfPresent(city, forKey: .city)
        try container.encode(cities, forKey: .cities)
        try container.encodeIfPresent(minPrice, forKey: .minPrice)
        try container.encodeIfPresent(maxPrice, forKey: .maxPrice)
        try container.encodeIfPresent(propertyType, forKey: .propertyType)
        try container.encode(propertyTypes, forKey: .propertyTypes)
        try container.encodeIfPresent(minRooms, forKey: .minRooms)
        try container.encodeIfPresent(minBedrooms, forKey: .minBedrooms)
        try container.encode(amenities, forKey: .amenities)
        try container.encodeIfPresent(availableFrom, forKey: .availableFrom)
    }
}

// MARK: - Data Cache Manager

actor DataCacheManager {
    static let shared = DataCacheManager()

    private let fileManager = FileManager.default
    private var cacheDirectory: URL?
    private var memoryCache = NSCache<NSString, CacheEntry>()

    // Cache configuration
    private let maxCacheAge: TimeInterval = 24 * 60 * 60 // 24 hours
    private let maxCacheSize: Int = 50 * 1024 * 1024 // 50MB

    private init() {
        setupCacheDirectory()
        memoryCache.countLimit = 100
    }

    private func setupCacheDirectory() {
        guard let cachesURL = fileManager.urls(for: .cachesDirectory, in: .userDomainMask).first else { return }
        cacheDirectory = cachesURL.appendingPathComponent("EasyCo", isDirectory: true)

        if let dir = cacheDirectory, !fileManager.fileExists(atPath: dir.path) {
            try? fileManager.createDirectory(at: dir, withIntermediateDirectories: true)
        }
    }

    // MARK: - Cache Operations

    func cache<T: Codable>(_ data: T, forKey key: String) async {
        guard let encoded = try? JSONEncoder().encode(data) else { return }

        let entry = CacheEntry(data: encoded, timestamp: Date())

        // Save to memory
        memoryCache.setObject(entry, forKey: key as NSString)

        // Save to disk
        await saveToDisk(encoded, forKey: key)
    }

    func get<T: Codable>(forKey key: String, as type: T.Type) async -> T? {
        // Check memory cache first
        if let entry = memoryCache.object(forKey: key as NSString),
           !entry.isExpired(maxAge: maxCacheAge),
           let decoded = try? JSONDecoder().decode(T.self, from: entry.data) {
            return decoded
        }

        // Check disk cache
        if let data = await loadFromDisk(forKey: key),
           let decoded = try? JSONDecoder().decode(T.self, from: data) {
            // Restore to memory cache
            let entry = CacheEntry(data: data, timestamp: Date())
            memoryCache.setObject(entry, forKey: key as NSString)
            return decoded
        }

        return nil
    }

    func remove(forKey key: String) async {
        memoryCache.removeObject(forKey: key as NSString)
        await removeFromDisk(forKey: key)
    }

    func clearAll() async {
        memoryCache.removeAllObjects()
        await clearDiskCache()
    }

    // MARK: - Disk Operations

    private func saveToDisk(_ data: Data, forKey key: String) async {
        guard let cacheDir = cacheDirectory else { return }
        let fileURL = cacheDir.appendingPathComponent(key.md5Hash + ".cache")

        try? data.write(to: fileURL)
    }

    private func loadFromDisk(forKey key: String) async -> Data? {
        guard let cacheDir = cacheDirectory else { return nil }
        let fileURL = cacheDir.appendingPathComponent(key.md5Hash + ".cache")

        // Check if file exists and is not expired
        guard let attributes = try? fileManager.attributesOfItem(atPath: fileURL.path),
              let modificationDate = attributes[.modificationDate] as? Date,
              Date().timeIntervalSince(modificationDate) < maxCacheAge else {
            return nil
        }

        return try? Data(contentsOf: fileURL)
    }

    private func removeFromDisk(forKey key: String) async {
        guard let cacheDir = cacheDirectory else { return }
        let fileURL = cacheDir.appendingPathComponent(key.md5Hash + ".cache")
        try? fileManager.removeItem(at: fileURL)
    }

    private func clearDiskCache() async {
        guard let cacheDir = cacheDirectory else { return }
        try? fileManager.removeItem(at: cacheDir)
        setupCacheDirectory()
    }

    // MARK: - Cache Size Management

    func getCacheSize() async -> Int {
        guard let cacheDir = cacheDirectory else { return 0 }

        var totalSize = 0
        if let enumerator = fileManager.enumerator(at: cacheDir, includingPropertiesForKeys: [.fileSizeKey]) {
            while let fileURL = enumerator.nextObject() as? URL {
                if let attributes = try? fileURL.resourceValues(forKeys: [.fileSizeKey]),
                   let fileSize = attributes.fileSize {
                    totalSize += fileSize
                }
            }
        }

        return totalSize
    }

    func cleanupExpiredCache() async {
        guard let cacheDir = cacheDirectory else { return }

        let now = Date()
        if let enumerator = fileManager.enumerator(at: cacheDir, includingPropertiesForKeys: [.contentModificationDateKey]) {
            while let fileURL = enumerator.nextObject() as? URL {
                if let attributes = try? fileURL.resourceValues(forKeys: [.contentModificationDateKey]),
                   let modificationDate = attributes.contentModificationDate,
                   now.timeIntervalSince(modificationDate) > maxCacheAge {
                    try? fileManager.removeItem(at: fileURL)
                }
            }
        }
    }
}

// MARK: - Cache Entry

class CacheEntry {
    let data: Data
    let timestamp: Date

    init(data: Data, timestamp: Date) {
        self.data = data
        self.timestamp = timestamp
    }

    func isExpired(maxAge: TimeInterval) -> Bool {
        return Date().timeIntervalSince(timestamp) > maxAge
    }
}

// MARK: - Network Monitor

import Network

@MainActor
class NetworkMonitor: ObservableObject {
    static let shared = NetworkMonitor()

    @Published var isConnected = true
    @Published var connectionType: NWInterface.InterfaceType?

    private let monitor = NWPathMonitor()
    private let queue = DispatchQueue(label: "NetworkMonitor")

    private init() {
        startMonitoring()
    }

    func startMonitoring() {
        monitor.pathUpdateHandler = { [weak self] path in
            DispatchQueue.main.async {
                self?.isConnected = path.status == .satisfied
                self?.connectionType = path.availableInterfaces.first?.type
            }
        }
        monitor.start(queue: queue)
    }

    func stopMonitoring() {
        monitor.cancel()
    }

    var isWiFi: Bool {
        connectionType == .wifi
    }

    var isCellular: Bool {
        connectionType == .cellular
    }
}

// MARK: - Offline Mode Manager

@MainActor
class OfflineModeManager: ObservableObject {
    static let shared = OfflineModeManager()

    @Published var isOffline: Bool = false
    @Published var pendingActions: [PendingAction] = []

    private let defaults = UserDefaults.standard
    private let pendingActionsKey = "pendingOfflineActions"

    private init() {
        loadPendingActions()
        observeNetworkChanges()
    }

    private func observeNetworkChanges() {
        Task {
            for await _ in NetworkMonitor.shared.$isConnected.values {
                if NetworkMonitor.shared.isConnected && !pendingActions.isEmpty {
                    await syncPendingActions()
                }
            }
        }
    }

    // MARK: - Pending Actions

    func addPendingAction(_ action: PendingAction) {
        pendingActions.append(action)
        savePendingActions()
    }

    private func loadPendingActions() {
        guard let data = defaults.data(forKey: pendingActionsKey),
              let actions = try? JSONDecoder().decode([PendingAction].self, from: data) else {
            return
        }
        pendingActions = actions
    }

    private func savePendingActions() {
        if let encoded = try? JSONEncoder().encode(pendingActions) {
            defaults.set(encoded, forKey: pendingActionsKey)
        }
    }

    func syncPendingActions() async {
        for action in pendingActions {
            do {
                try await executeAction(action)
                if let index = pendingActions.firstIndex(where: { $0.id == action.id }) {
                    pendingActions.remove(at: index)
                }
            } catch {
                print("❌ Failed to sync action: \(error.localizedDescription)")
            }
        }
        savePendingActions()
    }

    private func executeAction(_ action: PendingAction) async throws {
        // Execute the pending action based on type
        switch action.type {
        case .sendMessage:
            // Re-send message
            print("📤 Syncing message: \(action.payload)")
        case .updateProfile:
            // Update profile
            print("👤 Syncing profile update")
        case .createApplication:
            // Submit application
            print("📝 Syncing application")
        case .scheduleVisit:
            // Schedule visit
            print("📅 Syncing visit")
        }
    }

    func clearPendingActions() {
        pendingActions.removeAll()
        defaults.removeObject(forKey: pendingActionsKey)
    }
}

// MARK: - Pending Action Model

struct PendingAction: Identifiable, Codable {
    let id: UUID
    let type: ActionType
    let payload: String
    let createdAt: Date

    init(type: ActionType, payload: String) {
        self.id = UUID()
        self.type = type
        self.payload = payload
        self.createdAt = Date()
    }

    enum ActionType: String, Codable {
        case sendMessage
        case updateProfile
        case createApplication
        case scheduleVisit
    }
}

// MARK: - String MD5 Extension

import CommonCrypto

extension String {
    var md5Hash: String {
        guard let data = self.data(using: .utf8) else { return self }

        var digest = [UInt8](repeating: 0, count: Int(CC_MD5_DIGEST_LENGTH))
        data.withUnsafeBytes { bytes in
            _ = CC_MD5(bytes.baseAddress, CC_LONG(data.count), &digest)
        }

        return digest.map { String(format: "%02x", $0) }.joined()
    }
}

// MARK: - Offline Banner View

import SwiftUI

struct OfflineBannerView: View {
    @StateObject private var networkMonitor = NetworkMonitor.shared

    var body: some View {
        if !networkMonitor.isConnected {
            HStack(spacing: 8) {
                Image(systemName: "wifi.slash")
                    .font(.system(size: 14))

                Text("Mode hors ligne")
                    .font(.system(size: 14, weight: .medium))

                Spacer()

                if OfflineModeManager.shared.pendingActions.count > 0 {
                    Text("\(OfflineModeManager.shared.pendingActions.count) actions en attente")
                        .font(.system(size: 12))
                        .opacity(0.8)
                }
            }
            .foregroundColor(.white)
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(Color(hex: "EF4444"))
            .transition(.move(edge: .top).combined(with: .opacity))
        }
    }
}

// MARK: - Cache Keys

enum CacheKey {
    static let properties = "cached_properties"
    static let conversations = "cached_conversations"
    static let favorites = "cached_favorites"
    static let profile = "cached_profile"
    static let notifications = "cached_notifications"

    static func property(_ id: UUID) -> String {
        "property_\(id.uuidString)"
    }

    static func conversation(_ id: UUID) -> String {
        "conversation_\(id.uuidString)"
    }
}
