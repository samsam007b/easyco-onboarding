import Foundation

// MARK: - API Endpoint Protocol

protocol APIEndpoint {
    var path: String { get }
    var method: HTTPMethod { get }
    var headers: [String: String]? { get }
    var queryParameters: [String: String]? { get }
    var body: [String: Any]? { get }
}

// MARK: - HTTP Method

enum HTTPMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case patch = "PATCH"
    case delete = "DELETE"
}

// MARK: - Endpoints

enum Endpoint {
    // MARK: - Authentication
    case login(email: String, password: String)
    case signup(email: String, password: String, userData: [String: Any])
    case logout
    case refreshToken
    case resetPassword(email: String)

    // MARK: - User
    case getCurrentUser
    case updateProfile(userData: [String: Any])
    case uploadAvatar(imageData: Data)
    case saveOnboarding(onboardingData: [String: Any])

    // MARK: - Properties
    case getProperties(filters: PropertyFilters?)
    case getProperty(id: String)
    case createProperty(propertyData: [String: Any])
    case updateProperty(id: String, propertyData: [String: Any])
    case deleteProperty(id: String)
    case searchProperties(query: String)

    // MARK: - Favorites
    case getFavorites
    case addFavorite(propertyId: String)
    case removeFavorite(propertyId: String)

    // MARK: - Messages
    case getConversations
    case getConversation(id: String)
    case sendMessage(conversationId: String, content: String)
    case markAsRead(messageId: String)

    // MARK: - Groups
    case getGroups
    case getGroup(id: String)
    case createGroup(groupData: [String: Any])
    case joinGroup(id: String)
    case leaveGroup(id: String)

    // MARK: - Payments
    case getPaymentMethods
    case addPaymentMethod(data: [String: Any])
    case deletePaymentMethod(id: UUID)
    case setDefaultPaymentMethod(id: UUID)
    case getTransactions(page: Int, limit: Int)
    case getTransactionDetails(id: UUID)
    case createPaymentIntent(data: [String: Any])
    case confirmPayment(data: [String: Any])
    case getPendingPayments
    case payPendingPayment(data: [String: Any])
    case updateAutoPaySettings(data: [String: Any])

    // MARK: - Matching
    case getMatches(filters: PropertyFilters?)
    case likeProperty(id: UUID)
    case dislikeProperty(id: UUID)
    case undoSwipe
    case getMatchScore(propertyId: UUID)

    // MARK: - Visits
    case getVisits
    case getVisit(id: UUID)
    case createVisit(data: [String: Any])
    case updateVisit(id: UUID, data: [String: Any])
    case cancelVisit(id: UUID, reason: String?)
    case confirmVisit(id: UUID)
}

// MARK: - Endpoint Implementation

extension Endpoint: APIEndpoint {
    var path: String {
        switch self {
        // Auth
        case .login: return "/api/auth/login"
        case .signup: return "/api/auth/signup"
        case .logout: return "/api/auth/logout"
        case .refreshToken: return "/api/auth/refresh"
        case .resetPassword: return "/api/auth/reset-password"

        // User
        case .getCurrentUser: return "/api/profile"
        case .updateProfile: return "/api/profile"
        case .uploadAvatar: return "/api/profile/avatar"
        case .saveOnboarding: return "/api/profile/onboarding"

        // Properties
        case .getProperties: return "/api/properties"
        case .getProperty(let id): return "/api/properties/\(id)"
        case .createProperty: return "/api/properties"
        case .updateProperty(let id, _): return "/api/properties/\(id)"
        case .deleteProperty(let id): return "/api/properties/\(id)"
        case .searchProperties: return "/api/properties/search"

        // Favorites
        case .getFavorites: return "/api/favorites"
        case .addFavorite: return "/api/favorites"
        case .removeFavorite(let propertyId): return "/api/favorites/\(propertyId)"

        // Messages
        case .getConversations: return "/api/messages"
        case .getConversation(let id): return "/api/messages/\(id)"
        case .sendMessage(let conversationId, _): return "/api/messages/\(conversationId)"
        case .markAsRead(let messageId): return "/api/messages/\(messageId)/read"

        // Groups
        case .getGroups: return "/api/groups"
        case .getGroup(let id): return "/api/groups/\(id)"
        case .createGroup: return "/api/groups"
        case .joinGroup(let id): return "/api/groups/\(id)/join"
        case .leaveGroup(let id): return "/api/groups/\(id)/leave"

        // Payments
        case .getPaymentMethods: return "/api/payments/methods"
        case .addPaymentMethod: return "/api/payments/methods"
        case .deletePaymentMethod(let id): return "/api/payments/methods/\(id.uuidString)"
        case .setDefaultPaymentMethod(let id): return "/api/payments/methods/\(id.uuidString)/default"
        case .getTransactions: return "/api/payments/transactions"
        case .getTransactionDetails(let id): return "/api/payments/transactions/\(id.uuidString)"
        case .createPaymentIntent: return "/api/payments/intents"
        case .confirmPayment: return "/api/payments/confirm"
        case .getPendingPayments: return "/api/payments/pending"
        case .payPendingPayment: return "/api/payments/pay"
        case .updateAutoPaySettings: return "/api/payments/auto-pay"

        // Matching
        case .getMatches: return "/api/matching/matches"
        case .likeProperty(let id): return "/api/matching/like/\(id.uuidString)"
        case .dislikeProperty(let id): return "/api/matching/dislike/\(id.uuidString)"
        case .undoSwipe: return "/api/matching/undo"
        case .getMatchScore(let propertyId): return "/api/matching/score/\(propertyId.uuidString)"

        // Visits
        case .getVisits: return "/api/visits"
        case .getVisit(let id): return "/api/visits/\(id.uuidString)"
        case .createVisit: return "/api/visits"
        case .updateVisit(let id, _): return "/api/visits/\(id.uuidString)"
        case .cancelVisit(let id, _): return "/api/visits/\(id.uuidString)/cancel"
        case .confirmVisit(let id): return "/api/visits/\(id.uuidString)/confirm"
        }
    }

    var method: HTTPMethod {
        switch self {
        // POST methods
        case .login, .signup, .createProperty, .addFavorite, .sendMessage, .createGroup, .joinGroup, .resetPassword, .saveOnboarding,
             .addPaymentMethod, .createPaymentIntent, .confirmPayment, .payPendingPayment,
             .likeProperty, .dislikeProperty, .undoSwipe,
             .createVisit, .cancelVisit, .confirmVisit:
            return .post

        // PUT methods
        case .updateProfile, .updateProperty, .setDefaultPaymentMethod, .updateAutoPaySettings, .updateVisit:
            return .put

        // DELETE methods
        case .deleteProperty, .removeFavorite, .leaveGroup, .deletePaymentMethod:
            return .delete

        // PATCH methods
        case .markAsRead:
            return .patch

        // GET methods (default)
        default:
            return .get
        }
    }

    var headers: [String: String]? {
        var headers = ["Content-Type": "application/json"]

        // Add auth token if available
        if let token = EasyCoKeychainManager.shared.getAuthToken() {
            headers["Authorization"] = "Bearer \(token)"
        }

        return headers
    }

    var queryParameters: [String: String]? {
        switch self {
        case .getProperties(let filters), .getMatches(let filters):
            return filters?.toDictionary()
        case .searchProperties(let query):
            return ["q": query]
        case .getTransactions(let page, let limit):
            return ["page": "\(page)", "limit": "\(limit)"]
        default:
            return nil
        }
    }

    var body: [String: Any]? {
        switch self {
        case .login(let email, let password):
            return ["email": email, "password": password]
        case .signup(let email, let password, let userData):
            var data = userData
            data["email"] = email
            data["password"] = password
            return data
        case .addFavorite(let propertyId):
            return ["property_id": propertyId]
        case .sendMessage(_, let content):
            return ["content": content]
        case .resetPassword(let email):
            return ["email": email]
        case .saveOnboarding(let onboardingData):
            return onboardingData
        case .updateProfile(let userData):
            return userData
        case .createGroup(let groupData):
            return groupData
        case .createProperty(let propertyData):
            return propertyData
        case .updateProperty(_, let propertyData):
            return propertyData

        // Payments
        case .addPaymentMethod(let data), .createPaymentIntent(let data), .confirmPayment(let data),
             .payPendingPayment(let data), .updateAutoPaySettings(let data):
            return data

        // Visits
        case .createVisit(let data):
            return data
        case .updateVisit(_, let data):
            return data
        case .cancelVisit(_, let reason):
            if let reason = reason {
                return ["reason": reason]
            }
            return nil

        default:
            return nil
        }
    }
}

// MARK: - Property Filters

struct PropertyFilters {
    var city: String?
    var cities: [String] = []
    var minPrice: Int?
    var maxPrice: Int?
    var propertyType: PropertyType?
    var propertyTypes: [PropertyType] = []
    var minRooms: Int?
    var minBedrooms: Int?
    var amenities: [PropertyAmenity] = []
    var availableFrom: Date?

    func toDictionary() -> [String: String] {
        var dict = [String: String]()

        if let city = city { dict["city"] = city }
        if let minPrice = minPrice { dict["min_price"] = "\(minPrice)" }
        if let maxPrice = maxPrice { dict["max_price"] = "\(maxPrice)" }
        if let propertyType = propertyType { dict["property_type"] = propertyType.rawValue }
        if let minRooms = minRooms { dict["min_rooms"] = "\(minRooms)" }
        if !amenities.isEmpty {
            dict["amenities"] = amenities.map { $0.rawValue }.joined(separator: ",")
        }
        if let availableFrom = availableFrom {
            let formatter = ISO8601DateFormatter()
            dict["available_from"] = formatter.string(from: availableFrom)
        }

        return dict
    }
}

// MARK: - Keychain Manager (Placeholder)

class KeychainManager {
    static let shared = KeychainManager()

    private init() {}

    func getAuthToken() -> String? {
        // TODO: Implement Keychain access
        return UserDefaults.standard.string(forKey: "auth_token")
    }

    func saveAuthToken(_ token: String) {
        // TODO: Implement Keychain save
        UserDefaults.standard.set(token, forKey: "auth_token")
    }

    func deleteAuthToken() {
        // TODO: Implement Keychain delete
        UserDefaults.standard.removeObject(forKey: "auth_token")
    }
}
