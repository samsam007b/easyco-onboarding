import Foundation
import Combine

// MARK: - Sort Options

enum PropertySortOption {
    case bestMatch
    case newest
    case priceLow
    case priceHigh

    var displayName: String {
        switch self {
        case .bestMatch: return "🎯 Meilleur match"
        case .newest: return "Plus récent"
        case .priceLow: return "Prix: Croissant"
        case .priceHigh: return "Prix: Décroissant"
        }
    }
}

// MARK: - Properties Supabase Service

/// Direct Supabase access for properties - bypasses Next.js API
@MainActor
class PropertiesSupabaseService {
    static let shared = PropertiesSupabaseService()

    private let supabaseURL = AppConfig.supabaseURL
    private let supabaseKey = AppConfig.supabaseAnonKey

    private init() {}

    /// Fetch published properties directly from Supabase
    func fetchProperties(
        minPrice: Int? = nil,
        maxPrice: Int? = nil,
        city: String? = nil,
        propertyType: PropertyType? = nil,
        minBedrooms: Int? = nil,
        limit: Int = 20,
        offset: Int = 0
    ) async throws -> [SupabaseProperty] {
        var urlComponents = URLComponents(string: "\(supabaseURL)/rest/v1/properties")!
        var queryItems: [URLQueryItem] = [
            URLQueryItem(name: "status", value: "eq.published"),
            URLQueryItem(name: "is_available", value: "eq.true"),
            URLQueryItem(name: "order", value: "published_at.desc"),
            URLQueryItem(name: "limit", value: "\(limit)"),
            URLQueryItem(name: "offset", value: "\(offset)")
        ]

        if let minPrice = minPrice, minPrice > 0 {
            queryItems.append(URLQueryItem(name: "monthly_rent", value: "gte.\(minPrice)"))
        }
        if let maxPrice = maxPrice, maxPrice < 5000 {
            queryItems.append(URLQueryItem(name: "monthly_rent", value: "lte.\(maxPrice)"))
        }
        if let city = city {
            queryItems.append(URLQueryItem(name: "city", value: "eq.\(city)"))
        }
        if let propertyType = propertyType {
            queryItems.append(URLQueryItem(name: "property_type", value: "eq.\(propertyType.rawValue)"))
        }
        if let minBedrooms = minBedrooms {
            queryItems.append(URLQueryItem(name: "bedrooms", value: "gte.\(minBedrooms)"))
        }

        urlComponents.queryItems = queryItems

        var request = URLRequest(url: urlComponents.url!)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")

        // No auth token needed - RLS policy allows anonymous access to published properties

        print("🌐 Fetching properties from: \(urlComponents.url!.absoluteString)")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.unknown(NSError(domain: "Invalid response", code: -1))
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            let errorMessage = String(data: data, encoding: .utf8) ?? "Unknown error"
            print("❌ HTTP Error \(httpResponse.statusCode): \(errorMessage)")
            throw NetworkError.httpError(statusCode: httpResponse.statusCode, data: data)
        }

        // Debug: Log raw response
        if let jsonString = String(data: data, encoding: .utf8) {
            print("📦 Properties response: \(jsonString.prefix(500))...")
        }

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { decoder in
            let container = try decoder.singleValueContainer()
            let dateString = try container.decode(String.self)

            // Try ISO8601 with fractional seconds (for timestamps like created_at)
            let isoFormatter = ISO8601DateFormatter()
            isoFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            if let date = isoFormatter.date(from: dateString) {
                return date
            }

            // Try without fractional seconds
            isoFormatter.formatOptions = [.withInternetDateTime]
            if let date = isoFormatter.date(from: dateString) {
                return date
            }

            // Try simple date format (for dates like available_from: "2025-01-01")
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyy-MM-dd"
            dateFormatter.locale = Locale(identifier: "en_US_POSIX")
            if let date = dateFormatter.date(from: dateString) {
                return date
            }

            throw DecodingError.dataCorruptedError(in: container, debugDescription: "Cannot decode date string \(dateString)")
        }

        return try decoder.decode([SupabaseProperty].self, from: data)
    }

    /// Search properties by title
    func searchProperties(query: String, limit: Int = 20) async throws -> [SupabaseProperty] {
        var urlComponents = URLComponents(string: "\(supabaseURL)/rest/v1/properties")!
        let queryItems: [URLQueryItem] = [
            URLQueryItem(name: "status", value: "eq.published"),
            URLQueryItem(name: "is_available", value: "eq.true"),
            URLQueryItem(name: "title", value: "ilike.*\(query)*"),
            URLQueryItem(name: "order", value: "published_at.desc"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]

        urlComponents.queryItems = queryItems

        var request = URLRequest(url: urlComponents.url!)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(supabaseKey, forHTTPHeaderField: "apikey")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw NetworkError.unknown(NSError(domain: "Search failed", code: -1))
        }

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { decoder in
            let container = try decoder.singleValueContainer()
            let dateString = try container.decode(String.self)

            // Try ISO8601 with fractional seconds
            let isoFormatter = ISO8601DateFormatter()
            isoFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            if let date = isoFormatter.date(from: dateString) {
                return date
            }

            // Try without fractional seconds
            isoFormatter.formatOptions = [.withInternetDateTime]
            if let date = isoFormatter.date(from: dateString) {
                return date
            }

            // Try simple date format (for dates like available_from: "2025-01-01")
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyy-MM-dd"
            dateFormatter.locale = Locale(identifier: "en_US_POSIX")
            if let date = dateFormatter.date(from: dateString) {
                return date
            }

            throw DecodingError.dataCorruptedError(in: container, debugDescription: "Cannot decode date string \(dateString)")
        }

        return try decoder.decode([SupabaseProperty].self, from: data)
    }
}

// MARK: - Supabase Property Model (matches DB schema exactly)

struct SupabaseProperty: Codable {
    let id: UUID
    let ownerId: UUID
    let title: String
    let description: String?
    let propertyType: String
    let address: String
    let city: String
    let neighborhood: String?
    let postalCode: String
    let country: String
    let latitude: Double?
    let longitude: Double?
    let bedrooms: Int
    let bathrooms: Int
    let totalRooms: Int?
    let surfaceArea: Int?
    let floorNumber: Int?
    let totalFloors: Int?
    let furnished: Bool
    let monthlyRent: Double
    let charges: Double?
    let deposit: Double?
    let availableFrom: Date?
    let availableUntil: Date?
    let minimumStayMonths: Int
    let maximumStayMonths: Int?
    let isAvailable: Bool
    let amenities: [String]? // JSONB stored as string array
    let smokingAllowed: Bool
    let petsAllowed: Bool
    let couplesAllowed: Bool
    let childrenAllowed: Bool
    let images: [String]?
    let mainImage: String?
    let status: String
    let viewsCount: Int
    let applicationsCount: Int
    let favoritesCount: Int
    let createdAt: Date
    let updatedAt: Date
    let publishedAt: Date?
    let archivedAt: Date?

    enum CodingKeys: String, CodingKey {
        case id, title, description, address, city, neighborhood, country
        case bedrooms, bathrooms, furnished, images, amenities
        case ownerId = "owner_id"
        case propertyType = "property_type"
        case postalCode = "postal_code"
        case latitude, longitude
        case totalRooms = "total_rooms"
        case surfaceArea = "surface_area"
        case floorNumber = "floor_number"
        case totalFloors = "total_floors"
        case monthlyRent = "monthly_rent"
        case charges, deposit
        case availableFrom = "available_from"
        case availableUntil = "available_until"
        case minimumStayMonths = "minimum_stay_months"
        case maximumStayMonths = "maximum_stay_months"
        case isAvailable = "is_available"
        case smokingAllowed = "smoking_allowed"
        case petsAllowed = "pets_allowed"
        case couplesAllowed = "couples_allowed"
        case childrenAllowed = "children_allowed"
        case mainImage = "main_image"
        case status
        case viewsCount = "views_count"
        case applicationsCount = "applications_count"
        case favoritesCount = "favorites_count"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case publishedAt = "published_at"
        case archivedAt = "archived_at"
    }

    /// Convert to Property model for UI
    func toProperty() -> Property {
        // Convert amenities strings to PropertyAmenity enums
        let parsedAmenities: [PropertyAmenity] = (amenities ?? []).compactMap { PropertyAmenity(rawValue: $0) }

        // Convert property type string to enum
        let parsedPropertyType = PropertyType(rawValue: propertyType) ?? .apartment

        // Convert status string to enum
        let parsedStatus = PropertyStatus(rawValue: status) ?? .published

        return Property(
            id: id,
            ownerID: ownerId,
            title: title,
            description: description,
            propertyType: parsedPropertyType,
            address: address,
            city: city,
            neighborhood: neighborhood,
            postalCode: postalCode,
            country: country,
            latitude: latitude,
            longitude: longitude,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            totalRooms: totalRooms,
            surfaceArea: surfaceArea != nil ? Double(surfaceArea!) : nil,
            floorNumber: floorNumber,
            totalFloors: totalFloors,
            furnished: furnished,
            monthlyRent: monthlyRent,
            charges: charges ?? 0,
            deposit: deposit,
            availableFrom: availableFrom,
            availableUntil: availableUntil,
            minimumStayMonths: minimumStayMonths,
            maximumStayMonths: maximumStayMonths,
            isAvailable: isAvailable,
            amenities: parsedAmenities,
            smokingAllowed: smokingAllowed,
            petsAllowed: petsAllowed,
            couplesAllowed: couplesAllowed,
            childrenAllowed: childrenAllowed,
            images: images ?? [],
            mainImage: mainImage,
            status: parsedStatus,
            viewsCount: viewsCount,
            applicationsCount: applicationsCount,
            favoritesCount: favoritesCount,
            rating: 0, // Not in DB schema
            reviewsCount: 0, // Not in DB schema
            createdAt: createdAt,
            updatedAt: updatedAt,
            publishedAt: publishedAt,
            archivedAt: archivedAt,
            compatibilityScore: nil,
            matchInsights: nil,
            isFavorited: nil,
            residents: nil
        )
    }
}

// MARK: - Properties ViewModel

@MainActor
class PropertiesViewModel: ObservableObject {
    @Published var properties: [Property] = []
    @Published var isLoading = false
    @Published var error: NetworkError?
    @Published var searchQuery = ""
    @Published var filters = PropertyFilters()
    @Published var showFilters = false
    @Published var sortBy: PropertySortOption = .bestMatch

    private let propertiesService = PropertiesSupabaseService.shared
    private var cancellables = Set<AnyCancellable>()
    private var currentPage = 1
    private var hasMorePages = true

    // Computed property for filtered and sorted properties
    var filteredProperties: [Property] {
        var result = properties

        // Apply sorting
        switch sortBy {
        case .bestMatch:
            result.sort { ($0.compatibilityScore ?? 0) > ($1.compatibilityScore ?? 0) }
        case .newest:
            result.sort { $0.createdAt > $1.createdAt }
        case .priceLow:
            result.sort { $0.monthlyRent < $1.monthlyRent }
        case .priceHigh:
            result.sort { $0.monthlyRent > $1.monthlyRent }
        }

        return result
    }

    // Count active filters
    var activeFiltersCount: Int {
        var count = 0
        if filters.minPrice != 0 || filters.maxPrice != 5000 { count += 1 }
        if !filters.cities.isEmpty { count += 1 }
        if !filters.propertyTypes.isEmpty { count += 1 }
        if filters.minBedrooms != nil { count += 1 }
        if !filters.amenities.isEmpty { count += 1 }
        return count
    }

    init() {
        setupSearchDebounce()
        Task {
            await loadProperties()
        }
    }

    // MARK: - Data Loading

    func loadProperties(refresh: Bool = false) async {
        guard !isLoading else { return }

        if refresh {
            properties = []
            currentPage = 1
            hasMorePages = true
        }

        guard hasMorePages else { return }

        isLoading = true
        error = nil

        do {
            let newProperties: [Property]

            // Mode démo : génère des propriétés factices
            if AppConfig.FeatureFlags.demoMode {
                try await Task.sleep(nanoseconds: 500_000_000) // Simule 0.5 seconde
                newProperties = generateDemoProperties()
            } else {
                // Fetch directly from Supabase - no Next.js API needed
                newProperties = try await fetchPropertiesFromSupabase()
            }

            if refresh {
                properties = newProperties
            } else {
                properties.append(contentsOf: newProperties)
            }

            hasMorePages = newProperties.count >= AppConfig.Pagination.defaultPageSize
            currentPage += 1

        } catch {
            print("❌ Error loading properties: \(error)")
            self.error = error as? NetworkError ?? .unknown(error)
        }

        isLoading = false
    }

    /// Fetch properties directly from Supabase
    private func fetchPropertiesFromSupabase() async throws -> [Property] {
        let offset = (currentPage - 1) * AppConfig.Pagination.defaultPageSize

        // Get first city if available
        let city = filters.cities.first

        // Get first property type if available
        let propertyType = filters.propertyTypes.first

        let supabaseProperties = try await propertiesService.fetchProperties(
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            city: city,
            propertyType: propertyType,
            minBedrooms: filters.minBedrooms,
            limit: AppConfig.Pagination.defaultPageSize,
            offset: offset
        )

        // Convert to Property models
        return supabaseProperties.map { $0.toProperty() }
    }

    // MARK: - Demo Data

    private func generateDemoProperties() -> [Property] {
        // Use mock properties from Property model
        return Property.mockProperties
    }

    func loadMoreIfNeeded(currentProperty property: Property) async {
        guard let index = properties.firstIndex(where: { $0.id == property.id }) else {
            return
        }

        let thresholdIndex = properties.index(properties.endIndex, offsetBy: -5)
        if index >= thresholdIndex {
            await loadProperties()
        }
    }

    // MARK: - Search

    private func setupSearchDebounce() {
        $searchQuery
            .debounce(for: .milliseconds(500), scheduler: DispatchQueue.main)
            .sink { [weak self] query in
                Task {
                    await self?.search(query: query)
                }
            }
            .store(in: &cancellables)
    }

    private func search(query: String) async {
        guard !query.isEmpty else {
            await loadProperties(refresh: true)
            return
        }

        isLoading = true
        error = nil

        do {
            // Search using Supabase service
            let supabaseProperties = try await propertiesService.searchProperties(
                query: query,
                limit: AppConfig.Pagination.defaultPageSize
            )

            properties = supabaseProperties.map { $0.toProperty() }
        } catch {
            print("❌ Search error: \(error)")
            self.error = error as? NetworkError ?? .unknown(error)
        }

        isLoading = false
    }

    // MARK: - Filters

    func applyFilters() async {
        showFilters = false
        await loadProperties(refresh: true)
    }

    func clearFilters() {
        filters = PropertyFilters()
        Task {
            await loadProperties(refresh: true)
        }
    }

    // MARK: - Favorites

    func toggleFavorite(_ property: Property) async {
        // Favorites require authentication - check if user is logged in
        guard AuthManager.shared.isAuthenticated else {
            print("⚠️ User must be logged in to add favorites")
            return
        }

        // Toggle local state immediately for responsiveness
        if let index = properties.firstIndex(where: { $0.id == property.id }) {
            let currentlyFavorited = properties[index].isFavorited ?? false
            properties[index].isFavorited = !currentlyFavorited

            // Note: Favorites API requires authenticated user
            // For now, just update local state - full implementation needs Supabase auth token
            print("💝 Favorite toggled for property: \(property.title)")

            // TODO: Implement favorites API call with auth token
            // This would require the user to be logged in and send their token
        }
    }
}
