import Foundation

// MARK: - Room Model

/// Represents an individual room within a property
struct Room: Identifiable, Codable {
    let id: UUID
    let propertyID: UUID

    // Room Details
    var roomNumber: String?
    var roomType: RoomType
    var title: String
    var description: String?

    // Size & Features
    var surfaceArea: Double // in m²
    var hasPrivateBathroom: Bool
    var hasBathroom: Bool
    var hasBalcony: Bool
    var hasWindow: Bool
    var floor: Int?

    // Furniture
    var furnished: Bool
    var furniture: [RoomFurniture]

    // Pricing
    var monthlyRent: Double
    var charges: Double
    var deposit: Double?

    // Availability
    var isAvailable: Bool
    var availableFrom: Date?
    var availableUntil: Date?
    var minimumStayMonths: Int
    var maximumStayMonths: Int?

    // Current Occupant
    var currentOccupantID: UUID?
    var occupantSince: Date?
    var leaseEndDate: Date?

    // Images
    var images: [String]
    var mainImage: String?

    // Preferences
    var genderPreference: GenderPreference?
    var ageRangeMin: Int?
    var ageRangeMax: Int?
    var smokingAllowed: Bool

    // Status & Metadata
    var status: RoomStatus
    var viewsCount: Int
    var applicationsCount: Int

    // Timestamps
    var createdAt: Date
    var updatedAt: Date

    enum CodingKeys: String, CodingKey {
        case id, title, description, surfaceArea, furnished, furniture
        case monthlyRent, charges, deposit, images, status
        case propertyID = "property_id"
        case roomNumber = "room_number"
        case roomType = "room_type"
        case hasPrivateBathroom = "has_private_bathroom"
        case hasBathroom = "has_bathroom"
        case hasBalcony = "has_balcony"
        case hasWindow = "has_window"
        case floor
        case isAvailable = "is_available"
        case availableFrom = "available_from"
        case availableUntil = "available_until"
        case minimumStayMonths = "minimum_stay_months"
        case maximumStayMonths = "maximum_stay_months"
        case currentOccupantID = "current_occupant_id"
        case occupantSince = "occupant_since"
        case leaseEndDate = "lease_end_date"
        case mainImage = "main_image"
        case genderPreference = "gender_preference"
        case ageRangeMin = "age_range_min"
        case ageRangeMax = "age_range_max"
        case smokingAllowed = "smoking_allowed"
        case viewsCount = "views_count"
        case applicationsCount = "applications_count"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

// MARK: - Room Type

enum RoomType: String, Codable, CaseIterable {
    case single = "single"
    case double = "double"
    case shared = "shared"
    case master = "master"
    case studio = "studio"

    var displayName: String {
        switch self {
        case .single: return "Chambre simple"
        case .double: return "Chambre double"
        case .shared: return "Chambre partagée"
        case .master: return "Suite parentale"
        case .studio: return "Studio"
        }
    }

    var icon: String {
        switch self {
        case .single: return "bed.double"
        case .double: return "bed.double.fill"
        case .shared: return "person.2"
        case .master: return "crown"
        case .studio: return "house"
        }
    }
}

// MARK: - Room Furniture

enum RoomFurniture: String, Codable, CaseIterable {
    case bed = "bed"
    case desk = "desk"
    case chair = "chair"
    case wardrobe = "wardrobe"
    case shelf = "shelf"
    case nightstand = "nightstand"
    case lamp = "lamp"
    case mirror = "mirror"
    case rug = "rug"

    var displayName: String {
        switch self {
        case .bed: return "Lit"
        case .desk: return "Bureau"
        case .chair: return "Chaise"
        case .wardrobe: return "Armoire"
        case .shelf: return "Étagère"
        case .nightstand: return "Table de nuit"
        case .lamp: return "Lampe"
        case .mirror: return "Miroir"
        case .rug: return "Tapis"
        }
    }

    var icon: String {
        switch self {
        case .bed: return "bed.double"
        case .desk: return "rectangle.on.rectangle"
        case .chair: return "chair"
        case .wardrobe: return "cabinet"
        case .shelf: return "books.vertical"
        case .nightstand: return "lamp.table"
        case .lamp: return "lamp.desk"
        case .mirror: return "mirror"
        case .rug: return "square.fill"
        }
    }
}

// MARK: - Gender Preference

enum GenderPreference: String, Codable, CaseIterable {
    case male = "male"
    case female = "female"
    case any = "any"

    var displayName: String {
        switch self {
        case .male: return "Homme"
        case .female: return "Femme"
        case .any: return "Mixte"
        }
    }
}

// MARK: - Room Status

enum RoomStatus: String, Codable, CaseIterable {
    case available = "available"
    case occupied = "occupied"
    case reserved = "reserved"
    case maintenance = "maintenance"
    case unavailable = "unavailable"

    var displayName: String {
        switch self {
        case .available: return "Disponible"
        case .occupied: return "Occupée"
        case .reserved: return "Réservée"
        case .maintenance: return "En maintenance"
        case .unavailable: return "Indisponible"
        }
    }

    var color: String {
        switch self {
        case .available: return "#10B981"
        case .occupied: return "#EF4444"
        case .reserved: return "#F59E0B"
        case .maintenance: return "#6B7280"
        case .unavailable: return "#9CA3AF"
        }
    }
}

// MARK: - Mock Data

extension Room {
    static let mockRooms: [Room] = [
        Room(
            id: UUID(),
            propertyID: UUID(),
            roomNumber: "A1",
            roomType: .single,
            title: "Chambre lumineuse avec balcon",
            description: "Belle chambre meublée avec vue dégagée",
            surfaceArea: 12,
            hasPrivateBathroom: false,
            hasBathroom: true,
            hasBalcony: true,
            hasWindow: true,
            floor: 2,
            furnished: true,
            furniture: [.bed, .desk, .chair, .wardrobe],
            monthlyRent: 650,
            charges: 80,
            deposit: 650,
            isAvailable: true,
            availableFrom: Date(),
            availableUntil: nil,
            minimumStayMonths: 3,
            maximumStayMonths: 12,
            currentOccupantID: nil,
            occupantSince: nil,
            leaseEndDate: nil,
            images: [],
            mainImage: nil,
            genderPreference: .any,
            ageRangeMin: 18,
            ageRangeMax: 35,
            smokingAllowed: false,
            status: .available,
            viewsCount: 45,
            applicationsCount: 8,
            createdAt: Date(),
            updatedAt: Date()
        ),
        Room(
            id: UUID(),
            propertyID: UUID(),
            roomNumber: "A2",
            roomType: .double,
            title: "Grande chambre avec salle de bain privée",
            description: "Chambre spacieuse entièrement équipée",
            surfaceArea: 18,
            hasPrivateBathroom: true,
            hasBathroom: true,
            hasBalcony: false,
            hasWindow: true,
            floor: 2,
            furnished: true,
            furniture: [.bed, .desk, .chair, .wardrobe, .nightstand, .mirror],
            monthlyRent: 850,
            charges: 90,
            deposit: 850,
            isAvailable: false,
            availableFrom: Date().addingTimeInterval(30 * 24 * 60 * 60),
            availableUntil: nil,
            minimumStayMonths: 6,
            maximumStayMonths: 12,
            currentOccupantID: UUID(),
            occupantSince: Date().addingTimeInterval(-180 * 24 * 60 * 60),
            leaseEndDate: Date().addingTimeInterval(30 * 24 * 60 * 60),
            images: [],
            mainImage: nil,
            genderPreference: .female,
            ageRangeMin: 22,
            ageRangeMax: 40,
            smokingAllowed: false,
            status: .occupied,
            viewsCount: 120,
            applicationsCount: 15,
            createdAt: Date(),
            updatedAt: Date()
        )
    ]
}
