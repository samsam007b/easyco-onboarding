import Foundation
import CoreLocation

// MARK: - Location Models for Map Integration

/// Represents a geographic location with coordinates
struct GeoLocation: Codable, Equatable {
    let latitude: Double
    let longitude: Double

    var coordinate: CLLocationCoordinate2D {
        CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    }

    init(latitude: Double, longitude: Double) {
        self.latitude = latitude
        self.longitude = longitude
    }

    init(coordinate: CLLocationCoordinate2D) {
        self.latitude = coordinate.latitude
        self.longitude = coordinate.longitude
    }
}

// MARK: - Property Location Extension

extension Property {
    /// Returns the property's location as a GeoLocation
    var location: GeoLocation? {
        guard let lat = latitude, let lng = longitude else { return nil }
        return GeoLocation(latitude: lat, longitude: lng)
    }

    /// Returns the property's coordinate for MapKit
    var coordinate: CLLocationCoordinate2D? {
        location?.coordinate
    }

    /// Full formatted address
    var fullAddress: String {
        var components = [String]()

        if let address = address {
            components.append(address)
        }

        components.append(city)

        if let postalCode = postalCode {
            components.append(postalCode)
        }

        return components.joined(separator: ", ")
    }
}

// MARK: - Location Utilities

struct LocationUtilities {

    /// Calculates the center coordinate from an array of locations
    static func calculateCenter(from locations: [GeoLocation]) -> CLLocationCoordinate2D {
        guard !locations.isEmpty else {
            // Default to Brussels if no locations
            return CLLocationCoordinate2D(latitude: 50.8503, longitude: 4.3517)
        }

        let avgLat = locations.reduce(0.0) { $0 + $1.latitude } / Double(locations.count)
        let avgLng = locations.reduce(0.0) { $0 + $1.longitude } / Double(locations.count)

        return CLLocationCoordinate2D(latitude: avgLat, longitude: avgLng)
    }

    /// Calculates the center coordinate from an array of properties
    static func calculateCenter(from properties: [Property]) -> CLLocationCoordinate2D {
        let locations = properties.compactMap { $0.location }
        return calculateCenter(from: locations)
    }

    /// Calculates the distance between two coordinates in meters using Haversine formula
    static func distance(from: CLLocationCoordinate2D, to: CLLocationCoordinate2D) -> Double {
        let R = 6371000.0 // Earth's radius in meters

        let φ1 = from.latitude * .pi / 180
        let φ2 = to.latitude * .pi / 180
        let Δφ = (to.latitude - from.latitude) * .pi / 180
        let Δλ = (to.longitude - from.longitude) * .pi / 180

        let a = sin(Δφ / 2) * sin(Δφ / 2) +
                cos(φ1) * cos(φ2) * sin(Δλ / 2) * sin(Δλ / 2)
        let c = 2 * atan2(sqrt(a), sqrt(1 - a))

        return R * c
    }

    /// Formats distance in a human-readable format
    static func formatDistance(_ meters: Double) -> String {
        if meters < 1000 {
            return String(format: "%.0f m", meters)
        } else {
            return String(format: "%.1f km", meters / 1000)
        }
    }
}
