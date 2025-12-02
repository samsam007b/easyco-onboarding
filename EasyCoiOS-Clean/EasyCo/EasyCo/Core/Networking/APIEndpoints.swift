//
//  APIEndpoints.swift
//  EasyCo
//
//  API endpoints definitions
//

import Foundation

// MARK: - Authentication Endpoints

struct LoginRequest: NetworkRequest {
    typealias Response = AuthResponse

    let email: String
    let password: String

    var path: String { "/auth/login" }
    var method: HTTPMethod { .post }
    var requiresAuth: Bool { false }
    var body: Data? {
        try? NetworkManager.shared.encodeBody([
            "email": email,
            "password": password
        ])
    }
}

struct RegisterRequest: NetworkRequest {
    typealias Response = AuthResponse

    let email: String
    let password: String
    let firstName: String
    let lastName: String
    let role: UserRole

    var path: String { "/auth/register" }
    var method: HTTPMethod { .post }
    var requiresAuth: Bool { false }
    var body: Data? {
        try? NetworkManager.shared.encodeBody([
            "email": email,
            "password": password,
            "firstName": firstName,
            "lastName": lastName,
            "role": role.rawValue
        ])
    }
}

struct RefreshTokenRequest: NetworkRequest {
    typealias Response = AuthResponse

    let refreshToken: String

    var path: String { "/auth/refresh" }
    var method: HTTPMethod { .post }
    var requiresAuth: Bool { false }
    var body: Data? {
        try? NetworkManager.shared.encodeBody([
            "refreshToken": refreshToken
        ])
    }
}

struct LogoutRequest: NetworkRequest {
    typealias Response = EmptyResponse

    var path: String { "/auth/logout" }
    var method: HTTPMethod { .post }
}

// MARK: - Properties Endpoints

struct GetPropertiesRequest: NetworkRequest {
    typealias Response = PropertiesResponse

    let page: Int
    let limit: Int
    let filters: PropertyFilters?

    var path: String { "/properties" }
    var method: HTTPMethod { .get }
    var queryItems: [URLQueryItem]? {
        var items = [
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]

        if let filters = filters {
            if let minPrice = filters.minPrice {
                items.append(URLQueryItem(name: "minPrice", value: "\(minPrice)"))
            }
            if let maxPrice = filters.maxPrice {
                items.append(URLQueryItem(name: "maxPrice", value: "\(maxPrice)"))
            }
            if let type = filters.propertyType {
                items.append(URLQueryItem(name: "type", value: type.rawValue))
            }
            if let bedrooms = filters.bedrooms {
                items.append(URLQueryItem(name: "bedrooms", value: "\(bedrooms)"))
            }
            if let bathrooms = filters.bathrooms {
                items.append(URLQueryItem(name: "bathrooms", value: "\(bathrooms)"))
            }
            if let amenities = filters.amenities, !amenities.isEmpty {
                items.append(URLQueryItem(name: "amenities", value: amenities.joined(separator: ",")))
            }
        }

        return items
    }
}

struct GetPropertyRequest: NetworkRequest {
    typealias Response = Property

    let id: String

    var path: String { "/properties/\(id)" }
    var method: HTTPMethod { .get }
}

struct CreatePropertyRequest: NetworkRequest {
    typealias Response = Property

    let property: PropertyCreateDTO

    var path: String { "/properties" }
    var method: HTTPMethod { .post }
    var body: Data? {
        try? NetworkManager.shared.encodeBody(property)
    }
}

struct UpdatePropertyRequest: NetworkRequest {
    typealias Response = Property

    let id: String
    let property: PropertyUpdateDTO

    var path: String { "/properties/\(id)" }
    var method: HTTPMethod { .put }
    var body: Data? {
        try? NetworkManager.shared.encodeBody(property)
    }
}

struct DeletePropertyRequest: NetworkRequest {
    typealias Response = EmptyResponse

    let id: String

    var path: String { "/properties/\(id)" }
    var method: HTTPMethod { .delete }
}

// MARK: - Swipe/Match Endpoints

struct SwipePropertyRequest: NetworkRequest {
    typealias Response = SwipeResponse

    let propertyId: String
    let direction: SwipeDirection

    var path: String { "/swipes" }
    var method: HTTPMethod { .post }
    var body: Data? {
        try? NetworkManager.shared.encodeBody([
            "propertyId": propertyId,
            "direction": direction.rawValue
        ])
    }
}

struct GetMatchesRequest: NetworkRequest {
    typealias Response = MatchesResponse

    var path: String { "/matches" }
    var method: HTTPMethod { .get }
}

struct GetMatchRequest: NetworkRequest {
    typealias Response = Match

    let id: String

    var path: String { "/matches/\(id)" }
    var method: HTTPMethod { .get }
}

// MARK: - Messages Endpoints

struct GetConversationsRequest: NetworkRequest {
    typealias Response = ConversationsResponse

    var path: String { "/conversations" }
    var method: HTTPMethod { .get }
}

struct GetConversationRequest: NetworkRequest {
    typealias Response = Conversation

    let id: String

    var path: String { "/conversations/\(id)" }
    var method: HTTPMethod { .get }
}

struct GetMessagesRequest: NetworkRequest {
    typealias Response = MessagesResponse

    let conversationId: String
    let page: Int
    let limit: Int

    var path: String { "/conversations/\(conversationId)/messages" }
    var method: HTTPMethod { .get }
    var queryItems: [URLQueryItem]? {
        [
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
    }
}

struct SendMessageRequest: NetworkRequest {
    typealias Response = Message

    let conversationId: String
    let text: String
    let attachments: [String]?

    var path: String { "/conversations/\(conversationId)/messages" }
    var method: HTTPMethod { .post }
    var body: Data? {
        try? NetworkManager.shared.encodeBody([
            "text": text,
            "attachments": attachments ?? []
        ])
    }
}

struct MarkMessageReadRequest: NetworkRequest {
    typealias Response = EmptyResponse

    let conversationId: String
    let messageId: String

    var path: String { "/conversations/\(conversationId)/messages/\(messageId)/read" }
    var method: HTTPMethod { .post }
}

// MARK: - Applications Endpoints

struct GetApplicationsRequest: NetworkRequest {
    typealias Response = ApplicationsResponse

    var path: String { "/applications" }
    var method: HTTPMethod { .get }
}

struct GetApplicationRequest: NetworkRequest {
    typealias Response = ApplicationDetail

    let id: String

    var path: String { "/applications/\(id)" }
    var method: HTTPMethod { .get }
}

struct CreateApplicationRequest: NetworkRequest {
    typealias Response = ApplicationDetail

    let propertyId: String
    let applicationData: ApplicationFormData

    var path: String { "/applications" }
    var method: HTTPMethod { .post }
    var body: Data? {
        try? NetworkManager.shared.encodeBody([
            "propertyId": propertyId,
            "data": applicationData
        ])
    }
}

struct UpdateApplicationStatusRequest: NetworkRequest {
    typealias Response = ApplicationDetail

    let id: String
    let status: DetailedApplicationStatus

    var path: String { "/applications/\(id)/status" }
    var method: HTTPMethod { .patch }
    var body: Data? {
        try? NetworkManager.shared.encodeBody([
            "status": status
        ])
    }
}

// MARK: - Visits Endpoints

struct GetVisitsRequest: NetworkRequest {
    typealias Response = VisitsResponse

    var path: String { "/visits" }
    var method: HTTPMethod { .get }
}

struct ScheduleVisitRequest: NetworkRequest {
    typealias Response = Visit

    let propertyId: String
    let date: Date
    let time: String
    let type: VisitType
    let notes: String?

    var path: String { "/visits" }
    var method: HTTPMethod { .post }
    var body: Data? {
        try? NetworkManager.shared.encodeBody([
            "propertyId": propertyId,
            "date": date,
            "time": time,
            "type": type.rawValue,
            "notes": notes ?? ""
        ])
    }
}

struct UpdateVisitRequest: NetworkRequest {
    typealias Response = Visit

    let id: String
    let status: VisitStatus

    var path: String { "/visits/\(id)" }
    var method: HTTPMethod { .patch }
    var body: Data? {
        try? NetworkManager.shared.encodeBody([
            "status": status
        ])
    }
}

// MARK: - Reviews Endpoints

struct GetReviewsRequest: NetworkRequest {
    typealias Response = ReviewsResponse

    let propertyId: String

    var path: String { "/properties/\(propertyId)/reviews" }
    var method: HTTPMethod { .get }
}

struct CreateReviewRequest: NetworkRequest {
    typealias Response = Review

    let propertyId: String
    let review: ReviewSubmission

    var path: String { "/properties/\(propertyId)/reviews" }
    var method: HTTPMethod { .post }
    var body: Data? {
        try? NetworkManager.shared.encodeBody(review)
    }
}

// MARK: - User/Profile Endpoints

struct GetUserProfileRequest: NetworkRequest {
    typealias Response = User

    var path: String { "/user/profile" }
    var method: HTTPMethod { .get }
}

struct UpdateUserProfileRequest: NetworkRequest {
    typealias Response = User

    let profile: UserProfileUpdate

    var path: String { "/user/profile" }
    var method: HTTPMethod { .put }
    var body: Data? {
        try? NetworkManager.shared.encodeBody(profile)
    }
}

struct UploadProfilePhotoRequest: NetworkRequest {
    typealias Response = UploadResponse

    let imageData: Data

    var path: String { "/user/profile/photo" }
    var method: HTTPMethod { .post }
    var headers: [String: String]? {
        ["Content-Type": "multipart/form-data"]
    }
    var body: Data? { imageData }
}

// MARK: - Dashboard/Analytics Endpoints

struct GetSearcherDashboardRequest: NetworkRequest {
    typealias Response = SearcherDashboardData

    var path: String { "/dashboard/searcher" }
    var method: HTTPMethod { .get }
}

struct GetOwnerDashboardRequest: NetworkRequest {
    typealias Response = OwnerDashboardData

    let period: TimePeriod

    var path: String { "/dashboard/owner" }
    var method: HTTPMethod { .get }
    var queryItems: [URLQueryItem]? {
        [URLQueryItem(name: "period", value: period.rawValue)]
    }
}

struct GetResidentDashboardRequest: NetworkRequest {
    typealias Response = ResidentDashboardData

    var path: String { "/dashboard/resident" }
    var method: HTTPMethod { .get }
}

// MARK: - Response Models

struct AuthResponse: Decodable {
    let accessToken: String
    let refreshToken: String
    let user: User
    let expiresIn: Int
}

struct PropertiesResponse: Decodable {
    let properties: [Property]
    let total: Int
    let page: Int
    let totalPages: Int
}

struct SwipeResponse: Decodable {
    let isMatch: Bool
    let match: Match?
}

struct MatchesResponse: Decodable {
    let matches: [Match]
}

struct ConversationsResponse: Decodable {
    let conversations: [Conversation]
}

struct MessagesResponse: Decodable {
    let messages: [Message]
    let total: Int
}

struct ApplicationsResponse: Decodable {
    let applications: [ApplicationDetail]
}

struct VisitsResponse: Decodable {
    let visits: [Visit]
}

struct ReviewsResponse: Decodable {
    let reviews: [Review]
    let averageRating: Double
    let totalReviews: Int
}

struct UploadResponse: Decodable {
    let url: String
}

struct EmptyResponse: Decodable {}

// MARK: - DTO Models

struct PropertyCreateDTO: Encodable {
    let title: String
    let description: String
    let price: Int
    let location: String
    let bedrooms: Int
    let bathrooms: Int
    let area: Int?
    let type: PropertyType
    let amenities: [String]
    let images: [String]
}

struct PropertyUpdateDTO: Encodable {
    let title: String?
    let description: String?
    let price: Int?
    let location: String?
    let bedrooms: Int?
    let bathrooms: Int?
    let area: Int?
    let amenities: [String]?
}

struct UserProfileUpdate: Encodable {
    let firstName: String?
    let lastName: String?
    let phone: String?
    let bio: String?
}

struct ApplicationFormData: Encodable {
    let personalInfo: PersonalInfo
    let employment: Employment
    let guarantor: Guarantor?
    let preferences: Preferences

    struct PersonalInfo: Encodable {
        let firstName: String
        let lastName: String
        let email: String
        let phone: String
        let birthDate: Date
        let nationality: String
        let currentAddress: String
    }

    struct Employment: Encodable {
        let status: EmploymentStatus
        let employer: String?
        let position: String?
        let contractType: ContractType?
        let monthlyIncome: Int
    }

    struct Guarantor: Encodable {
        let name: String
        let email: String
        let phone: String
        let relationship: String
    }

    struct Preferences: Encodable {
        let moveInDate: Date
        let leaseDuration: LeaseDuration
        let motivation: String
    }
}

struct ReviewSubmission: Encodable {
    let overallRating: Int
    let cleanliness: Int
    let location: Int
    let value: Int
    let host: Int
    let review: String
    let isAnonymous: Bool
}

// MARK: - Supporting Types

struct PropertyFilters {
    var minPrice: Int?
    var maxPrice: Int?
    var propertyType: PropertyType?
    var bedrooms: Int?
    var bathrooms: Int?
    var amenities: [String]?
}

enum SwipeDirection: String, Codable {
    case left, right, up
}

struct SearcherDashboardData: Decodable {
    let stats: Stats
    let activityData: [ActivityDataPoint]
    let upcomingVisits: [Visit]
    let recentMatches: [Match]
    let savedSearches: [SavedSearch]
    let applications: [ApplicationDetail]

    struct Stats: Decodable {
        let views: Int
        let matches: Int
        let favorites: Int
        let visits: Int
    }

    struct ActivityDataPoint: Decodable {
        let label: String
        let value: Double
    }
}

struct OwnerDashboardData: Decodable {
    let stats: Stats
    let revenueData: [RevenueDataPoint]
    let occupancyData: [OccupancyDataPoint]
    let viewsData: [ViewsDataPoint]
    let properties: [OwnerProperty]
    let pendingApplications: [PropertyApplication]

    struct Stats: Decodable {
        let revenue: Int
        let properties: Int
        let occupancy: Int
        let applications: Int
    }

    struct RevenueDataPoint: Decodable {
        let label: String
        let value: Double
    }

    struct OccupancyDataPoint: Decodable {
        let label: String
        let value: Double
        let color: String
    }

    struct ViewsDataPoint: Decodable {
        let label: String
        let value: Double
    }
}

struct ResidentDashboardData: Decodable {
    let currentProperty: ResidentProperty
    let nextPayment: RentPayment
    let expenses: [ExpenseDataPoint]
    let paymentHistory: [RentPayment]
    let maintenanceRequests: [MaintenanceRequest]
    let documents: [Document]

    struct ExpenseDataPoint: Decodable {
        let label: String
        let value: Double
        let color: String
    }
}
