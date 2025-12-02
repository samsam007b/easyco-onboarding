//
//  Property.swift
//  EasyCo
//
//  Complete property model matching web app structure
//

import Foundation

// MARK: - Property Model

struct Property: Identifiable, Codable {
    // IDs
    let id: UUID
    var ownerID: UUID

    // Basic Information
    var title: String
    var description: String?
    var propertyType: PropertyType

    // Location
    var address: String
    var city: String
    var neighborhood: String?
    var postalCode: String
    var country: String
    var latitude: Double?
    var longitude: Double?

    // Property Details
    var bedrooms: Int
    var bathrooms: Int
    var totalRooms: Int?
    var surfaceArea: Double? // in m²
    var floorNumber: Int?
    var totalFloors: Int?
    var furnished: Bool

    // Pricing
    var monthlyRent: Double
    var charges: Double
    var deposit: Double?

    // Availability
    var availableFrom: Date?
    var availableUntil: Date?
    var minimumStayMonths: Int
    var maximumStayMonths: Int?
    var isAvailable: Bool

    // Amenities
    var amenities: [PropertyAmenity]

    // Rules & Preferences
    var smokingAllowed: Bool
    var petsAllowed: Bool
    var couplesAllowed: Bool
    var childrenAllowed: Bool

    // Images
    var images: [String]
    var mainImage: String?

    // Status & Metadata
    var status: PropertyStatus
    var viewsCount: Int
    var applicationsCount: Int
    var favoritesCount: Int
    var rating: Double
    var reviewsCount: Int

    // Timestamps
    var createdAt: Date
    var updatedAt: Date
    var publishedAt: Date?
    var archivedAt: Date?

    // Matching (calculated, not stored in DB)
    var compatibilityScore: Int?
    var matchInsights: [String]?
    var isFavorited: Bool?

    // Computed property for compatibility
    var mainImageURL: String? {
        mainImage ?? images.first
    }

    // Residents (for property cards)
    var residents: [PropertyResident]?

    enum CodingKeys: String, CodingKey {
        case id, title, description, address, city, neighborhood, country
        case bedrooms, bathrooms, furnished, images, amenities
        case ownerID = "owner_id"
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
        case rating
        case reviewsCount = "reviews_count"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case publishedAt = "published_at"
        case archivedAt = "archived_at"
        case compatibilityScore, matchInsights, isFavorited, residents
    }
}

// MARK: - Property Type

enum PropertyType: String, Codable, CaseIterable {
    case apartment = "apartment"
    case house = "house"
    case studio = "studio"
    case coliving = "coliving"
    case sharedRoom = "shared_room"
    case privateRoom = "private_room"
    case entirePlace = "entire_place"

    var displayName: String {
        switch self {
        case .apartment: return "Appartement"
        case .house: return "Maison"
        case .studio: return "Studio"
        case .coliving: return "Coliving"
        case .sharedRoom: return "Chambre partagée"
        case .privateRoom: return "Chambre privée"
        case .entirePlace: return "Logement entier"
        }
    }

    var icon: String {
        switch self {
        case .apartment: return "building.2"
        case .house: return "house"
        case .studio: return "bed.double"
        case .coliving: return "person.3"
        case .sharedRoom: return "person.2"
        case .privateRoom: return "door.left.hand.closed"
        case .entirePlace: return "house.fill"
        }
    }
}

// MARK: - Property Status

enum PropertyStatus: String, Codable, CaseIterable {
    case draft = "draft"
    case published = "published"
    case archived = "archived"
    case rented = "rented"
    case underReview = "under_review"

    var displayName: String {
        switch self {
        case .draft: return "Brouillon"
        case .published: return "Publié"
        case .archived: return "Archivé"
        case .rented: return "Loué"
        case .underReview: return "En révision"
        }
    }
}

// MARK: - Property Amenity

enum PropertyAmenity: String, Codable, CaseIterable {
    case wifi = "wifi"
    case parking = "parking"
    case elevator = "elevator"
    case balcony = "balcony"
    case garden = "garden"
    case gym = "gym"
    case laundry = "laundry"
    case dishwasher = "dishwasher"
    case washingMachine = "washing_machine"
    case dryer = "dryer"
    case airConditioning = "air_conditioning"
    case heating = "heating"
    case tv = "tv"
    case workspace = "workspace"
    case kitchen = "kitchen"
    case privateBathroom = "private_bathroom"
    case wheelchairAccessible = "wheelchair_accessible"
    case security = "security"
    case concierge = "concierge"
    case pool = "pool"
    case terrace = "terrace"

    var displayName: String {
        switch self {
        case .wifi: return "WiFi"
        case .parking: return "Parking"
        case .elevator: return "Ascenseur"
        case .balcony: return "Balcon"
        case .garden: return "Jardin"
        case .gym: return "Salle de sport"
        case .laundry: return "Buanderie"
        case .dishwasher: return "Lave-vaisselle"
        case .washingMachine: return "Machine à laver"
        case .dryer: return "Sèche-linge"
        case .airConditioning: return "Climatisation"
        case .heating: return "Chauffage"
        case .tv: return "TV"
        case .workspace: return "Espace de travail"
        case .kitchen: return "Cuisine"
        case .privateBathroom: return "Salle de bain privée"
        case .wheelchairAccessible: return "Accessible PMR"
        case .security: return "Sécurité"
        case .concierge: return "Concierge"
        case .pool: return "Piscine"
        case .terrace: return "Terrasse"
        }
    }

    var icon: String {
        switch self {
        case .wifi: return "wifi"
        case .parking: return "car.fill"
        case .elevator: return "arrow.up.arrow.down"
        case .balcony: return "square.grid.3x3.square"
        case .garden: return "leaf.fill"
        case .gym: return "figure.run"
        case .laundry: return "washer.fill"
        case .dishwasher: return "dishwasher.fill"
        case .washingMachine: return "washer.fill"
        case .dryer: return "dryer.fill"
        case .airConditioning: return "snowflake"
        case .heating: return "flame.fill"
        case .tv: return "tv.fill"
        case .workspace: return "desktopcomputer"
        case .kitchen: return "fork.knife"
        case .privateBathroom: return "shower.fill"
        case .wheelchairAccessible: return "figure.roll"
        case .security: return "lock.shield.fill"
        case .concierge: return "bell.fill"
        case .pool: return "figure.pool.swim"
        case .terrace: return "sun.max.fill"
        }
    }
}

// MARK: - Property Resident (for card display)

struct PropertyResident: Identifiable, Codable {
    let id: UUID
    var firstName: String?
    var profileImageURL: String?
    var initials: String {
        guard let firstName = firstName else { return "?" }
        return String(firstName.prefix(1)).uppercased()
    }
}

// MARK: - Mock Data

extension Property {
    static var mock: Property {
        mockProperties[0]
    }

    static var mockProperties: [Property] {
        [
            Property(
                id: UUID(),
                ownerID: UUID(),
                title: "Magnifique Colocation à Ixelles",
                description: "Belle colocation de 4 chambres dans une maison rénovée avec jardin. Ambiance conviviale et internationale.",
                propertyType: .coliving,
                address: "Rue de la Paix 42",
                city: "Ixelles",
                neighborhood: "Flagey",
                postalCode: "1050",
                country: "Belgique",
                latitude: 50.8269,
                longitude: 4.3676,
                bedrooms: 4,
                bathrooms: 2,
                totalRooms: 6,
                surfaceArea: 120,
                floorNumber: 2,
                totalFloors: 3,
                furnished: true,
                monthlyRent: 650,
                charges: 150,
                deposit: 1300,
                availableFrom: Date(),
                availableUntil: nil,
                minimumStayMonths: 6,
                maximumStayMonths: nil,
                isAvailable: true,
                amenities: [.wifi, .washingMachine, .dishwasher, .garden, .heating],
                smokingAllowed: false,
                petsAllowed: true,
                couplesAllowed: false,
                childrenAllowed: false,
                images: ["https://picsum.photos/400/300", "https://picsum.photos/401/300"],
                mainImage: "https://picsum.photos/400/300",
                status: .published,
                viewsCount: 234,
                applicationsCount: 12,
                favoritesCount: 45,
                rating: 4.8,
                reviewsCount: 23,
                createdAt: Date(),
                updatedAt: Date(),
                publishedAt: Date(),
                archivedAt: nil,
                compatibilityScore: 92,
                matchInsights: ["Même rythme de vie", "Préférences similaires"],
                isFavorited: false,
                residents: [
                    PropertyResident(id: UUID(), firstName: "Sophie", profileImageURL: nil),
                    PropertyResident(id: UUID(), firstName: "Marc", profileImageURL: nil),
                    PropertyResident(id: UUID(), firstName: "Julie", profileImageURL: nil)
                ]
            ),
            Property(
                id: UUID(),
                ownerID: UUID(),
                title: "Studio Moderne à Saint-Gilles",
                description: "Studio lumineux et entièrement meublé, proche de toutes commodités.",
                propertyType: .studio,
                address: "Avenue Jean Volders 15",
                city: "Saint-Gilles",
                neighborhood: "Parvis",
                postalCode: "1060",
                country: "Belgique",
                latitude: 50.8296,
                longitude: 4.3418,
                bedrooms: 1,
                bathrooms: 1,
                totalRooms: 2,
                surfaceArea: 45,
                floorNumber: 4,
                totalFloors: 5,
                furnished: true,
                monthlyRent: 850,
                charges: 100,
                deposit: 1700,
                availableFrom: Calendar.current.date(byAdding: .month, value: 1, to: Date()),
                availableUntil: nil,
                minimumStayMonths: 12,
                maximumStayMonths: nil,
                isAvailable: true,
                amenities: [.wifi, .elevator, .washingMachine, .balcony],
                smokingAllowed: false,
                petsAllowed: false,
                couplesAllowed: true,
                childrenAllowed: false,
                images: ["https://picsum.photos/402/300"],
                mainImage: "https://picsum.photos/402/300",
                status: .published,
                viewsCount: 156,
                applicationsCount: 8,
                favoritesCount: 28,
                rating: 4.5,
                reviewsCount: 15,
                createdAt: Date(),
                updatedAt: Date(),
                publishedAt: Date(),
                archivedAt: nil,
                compatibilityScore: 78,
                matchInsights: ["Budget compatible"],
                isFavorited: true,
                residents: nil
            )
        ]
    }
}
