//
//  Privacy.swift
//  EasyCo
//
//  Created by Claude on 11/18/2025.
//

import Foundation

// MARK: - Privacy & GDPR Models

/// User consent for data processing
struct UserConsent: Codable, Identifiable {
    let id: UUID
    let userId: UUID
    let consentType: ConsentType
    let isGranted: Bool
    let grantedAt: Date?
    let revokedAt: Date?
    let version: String // Version of privacy policy/terms
    let ipAddress: String?
    let userAgent: String?
    let createdAt: Date
    let updatedAt: Date

    enum CodingKeys: String, CodingKey {
        case id
        case userId = "user_id"
        case consentType = "consent_type"
        case isGranted = "is_granted"
        case grantedAt = "granted_at"
        case revokedAt = "revoked_at"
        case version
        case ipAddress = "ip_address"
        case userAgent = "user_agent"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

/// Types of consent required
enum ConsentType: String, Codable, CaseIterable {
    case termsOfService = "terms_of_service"
    case privacyPolicy = "privacy_policy"
    case marketing = "marketing"
    case analytics = "analytics"
    case dataSharing = "data_sharing"
    case profileVisibility = "profile_visibility"

    var displayName: String {
        switch self {
        case .termsOfService: return "Terms of Service"
        case .privacyPolicy: return "Privacy Policy"
        case .marketing: return "Marketing Communications"
        case .analytics: return "Analytics & Performance"
        case .dataSharing: return "Data Sharing with Partners"
        case .profileVisibility: return "Profile Visibility"
        }
    }

    var description: String {
        switch self {
        case .termsOfService:
            return "Agreement to the terms and conditions of using EasyCo"
        case .privacyPolicy:
            return "Understanding how we collect, use, and protect your data"
        case .marketing:
            return "Receive marketing emails, promotions, and updates"
        case .analytics:
            return "Allow us to collect usage data to improve the app"
        case .dataSharing:
            return "Share your data with verified landlords and roommates"
        case .profileVisibility:
            return "Make your profile visible to other users"
        }
    }

    var isRequired: Bool {
        switch self {
        case .termsOfService, .privacyPolicy:
            return true
        case .marketing, .analytics, .dataSharing, .profileVisibility:
            return false
        }
    }
}

/// Data export/deletion request
struct DataRequest: Codable, Identifiable {
    let id: UUID
    let userId: UUID
    let requestType: DataRequestType
    let status: DataRequestStatus
    let requestedAt: Date
    let processedAt: Date?
    let completedAt: Date?
    let notes: String?
    let downloadUrl: String? // For export requests

    enum CodingKeys: String, CodingKey {
        case id
        case userId = "user_id"
        case requestType = "request_type"
        case status
        case requestedAt = "requested_at"
        case processedAt = "processed_at"
        case completedAt = "completed_at"
        case notes
        case downloadUrl = "download_url"
    }
}

/// Type of data request
enum DataRequestType: String, Codable {
    case export = "export"
    case deletion = "deletion"
    case rectification = "rectification"

    var displayName: String {
        switch self {
        case .export: return "Data Export"
        case .deletion: return "Account Deletion"
        case .rectification: return "Data Correction"
        }
    }

    var icon: String {
        switch self {
        case .export: return "arrow.down.doc.fill"
        case .deletion: return "trash.fill"
        case .rectification: return "pencil.circle.fill"
        }
    }
}

/// Status of data request
enum DataRequestStatus: String, Codable {
    case pending = "pending"
    case processing = "processing"
    case completed = "completed"
    case rejected = "rejected"
    case cancelled = "cancelled"

    var displayName: String {
        switch self {
        case .pending: return "Pending"
        case .processing: return "Processing"
        case .completed: return "Completed"
        case .rejected: return "Rejected"
        case .cancelled: return "Cancelled"
        }
    }

    var color: String {
        switch self {
        case .pending: return "F59E0B" // Orange
        case .processing: return "3B82F6" // Blue
        case .completed: return "10B981" // Green
        case .rejected: return "EF4444" // Red
        case .cancelled: return "6B7280" // Gray
        }
    }
}

/// Privacy settings configuration
struct PrivacySettings: Codable {
    var profileVisibility: ProfileVisibility
    var showOnlineStatus: Bool
    var showLastSeen: Bool
    var allowMessagesFrom: MessagePermission
    var showReadReceipts: Bool
    var shareLocationData: Bool
    var shareAnalytics: Bool
    var personalizedAds: Bool
    var dataRetentionDays: Int // How long to keep user data after deletion

    static var `default`: PrivacySettings {
        PrivacySettings(
            profileVisibility: .public,
            showOnlineStatus: true,
            showLastSeen: true,
            allowMessagesFrom: .everyone,
            showReadReceipts: true,
            shareLocationData: false,
            shareAnalytics: true,
            personalizedAds: false,
            dataRetentionDays: 30
        )
    }

    enum CodingKeys: String, CodingKey {
        case profileVisibility = "profile_visibility"
        case showOnlineStatus = "show_online_status"
        case showLastSeen = "show_last_seen"
        case allowMessagesFrom = "allow_messages_from"
        case showReadReceipts = "show_read_receipts"
        case shareLocationData = "share_location_data"
        case shareAnalytics = "share_analytics"
        case personalizedAds = "personalized_ads"
        case dataRetentionDays = "data_retention_days"
    }
}

/// Profile visibility options
enum ProfileVisibility: String, Codable, CaseIterable {
    case `public` = "public"
    case verified = "verified_only"
    case `private` = "private"

    var displayName: String {
        switch self {
        case .public: return "Public"
        case .verified: return "Verified Users Only"
        case .private: return "Private"
        }
    }

    var description: String {
        switch self {
        case .public: return "Everyone can see your profile"
        case .verified: return "Only verified users can see your profile"
        case .private: return "Profile is hidden from search"
        }
    }
}

/// Message permission options
enum MessagePermission: String, Codable, CaseIterable {
    case everyone = "everyone"
    case matches = "matches_only"
    case verified = "verified_only"
    case nobody = "nobody"

    var displayName: String {
        switch self {
        case .everyone: return "Everyone"
        case .matches: return "Matches Only"
        case .verified: return "Verified Users Only"
        case .nobody: return "Nobody"
        }
    }
}

/// Data category for export/deletion
struct DataCategory: Identifiable {
    let id = UUID()
    let name: String
    let description: String
    let icon: String
    let estimatedSize: String?
    let isIncludedByDefault: Bool

    static let allCategories: [DataCategory] = [
        DataCategory(
            name: "Profile Information",
            description: "Basic profile data, photos, and bio",
            icon: "person.fill",
            estimatedSize: "< 1 MB",
            isIncludedByDefault: true
        ),
        DataCategory(
            name: "Messages",
            description: "All your conversations and message history",
            icon: "message.fill",
            estimatedSize: "~ 5 MB",
            isIncludedByDefault: true
        ),
        DataCategory(
            name: "Applications",
            description: "Property applications and their status",
            icon: "doc.text.fill",
            estimatedSize: "< 500 KB",
            isIncludedByDefault: true
        ),
        DataCategory(
            name: "Saved Properties",
            description: "Favorited and saved properties",
            icon: "heart.fill",
            estimatedSize: "< 100 KB",
            isIncludedByDefault: true
        ),
        DataCategory(
            name: "Search History",
            description: "Property search history and filters",
            icon: "clock.fill",
            estimatedSize: "< 100 KB",
            isIncludedByDefault: false
        ),
        DataCategory(
            name: "Household Data",
            description: "Expenses, tasks, and household information",
            icon: "house.fill",
            estimatedSize: "~ 2 MB",
            isIncludedByDefault: true
        ),
        DataCategory(
            name: "Payment Information",
            description: "Payment history and methods (excluding card details)",
            icon: "creditcard.fill",
            estimatedSize: "< 500 KB",
            isIncludedByDefault: true
        ),
        DataCategory(
            name: "Activity Logs",
            description: "Login history and activity timestamps",
            icon: "list.bullet",
            estimatedSize: "< 200 KB",
            isIncludedByDefault: false
        )
    ]
}

// MARK: - Mock Data

extension UserConsent {
    static let mockConsents: [UserConsent] = [
        UserConsent(
            id: UUID(),
            userId: UUID(),
            consentType: .termsOfService,
            isGranted: true,
            grantedAt: Date(),
            revokedAt: nil,
            version: "1.0",
            ipAddress: "192.168.1.1",
            userAgent: "EasyCo iOS/1.0",
            createdAt: Date(),
            updatedAt: Date()
        ),
        UserConsent(
            id: UUID(),
            userId: UUID(),
            consentType: .privacyPolicy,
            isGranted: true,
            grantedAt: Date(),
            revokedAt: nil,
            version: "1.0",
            ipAddress: "192.168.1.1",
            userAgent: "EasyCo iOS/1.0",
            createdAt: Date(),
            updatedAt: Date()
        ),
        UserConsent(
            id: UUID(),
            userId: UUID(),
            consentType: .marketing,
            isGranted: false,
            grantedAt: nil,
            revokedAt: Date(),
            version: "1.0",
            ipAddress: "192.168.1.1",
            userAgent: "EasyCo iOS/1.0",
            createdAt: Date(),
            updatedAt: Date()
        )
    ]
}

extension DataRequest {
    static let mockRequests: [DataRequest] = [
        DataRequest(
            id: UUID(),
            userId: UUID(),
            requestType: .export,
            status: .completed,
            requestedAt: Date().addingTimeInterval(-86400 * 5),
            processedAt: Date().addingTimeInterval(-86400 * 4),
            completedAt: Date().addingTimeInterval(-86400 * 3),
            notes: "Data export completed successfully",
            downloadUrl: "https://example.com/downloads/data-export-123.zip"
        ),
        DataRequest(
            id: UUID(),
            userId: UUID(),
            requestType: .deletion,
            status: .pending,
            requestedAt: Date().addingTimeInterval(-3600),
            processedAt: nil,
            completedAt: nil,
            notes: nil,
            downloadUrl: nil
        )
    ]
}
