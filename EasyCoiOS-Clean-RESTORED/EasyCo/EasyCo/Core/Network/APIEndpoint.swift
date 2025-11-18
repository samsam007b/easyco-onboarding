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
        }
    }

    var method: HTTPMethod {
        switch self {
        case .login, .signup, .createProperty, .addFavorite, .sendMessage, .createGroup, .joinGroup, .resetPassword:
            return .post
        case .updateProfile, .updateProperty:
            return .put
        case .deleteProperty, .removeFavorite, .leaveGroup:
            return .delete
        case .markAsRead:
            return .patch
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
        case .getProperties(let filters):
            return filters?.toDictionary()
        case .searchProperties(let query):
            return ["q": query]
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
        default:
            return nil
        }
    }
}

// MARK: - Property Filters

struct PropertyFilters: Codable {
    // Price
    var minPrice: Int = 0
    var maxPrice: Int = 5000

    // Location
    var cities: [String] = []

    // Property Type
    var propertyTypes: [PropertyType] = []

    // Rooms
    var minBedrooms: Int? = nil
    var minBathrooms: Int? = nil
    var furnished: Bool? = nil

    // Amenities
    var amenities: [PropertyAmenity] = []

    // Availability
    var availableFrom: Date?

    func toDictionary() -> [String: String] {
        var dict = [String: String]()

        dict["min_price"] = "\(minPrice)"
        dict["max_price"] = "\(maxPrice)"

        if !cities.isEmpty {
            dict["cities"] = cities.joined(separator: ",")
        }

        if !propertyTypes.isEmpty {
            dict["property_types"] = propertyTypes.map { $0.rawValue }.joined(separator: ",")
        }

        if let minBedrooms = minBedrooms {
            dict["min_bedrooms"] = "\(minBedrooms)"
        }

        if let minBathrooms = minBathrooms {
            dict["min_bathrooms"] = "\(minBathrooms)"
        }

        if let furnished = furnished {
            dict["furnished"] = furnished ? "true" : "false"
        }

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
