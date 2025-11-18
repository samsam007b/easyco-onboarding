import SwiftUI
import MapKit

// MARK: - Property Map View (Simplified)

struct PropertyMapView: View {
    let properties: [Property]
    @Binding var selectedPropertyId: UUID?

    @State private var region: MKCoordinateRegion

    init(properties: [Property], selectedPropertyId: Binding<UUID?>) {
        self.properties = properties
        self._selectedPropertyId = selectedPropertyId

        // Calculate initial region from properties with coordinates
        let propertiesWithCoords = properties.filter { $0.latitude != nil && $0.longitude != nil }
        let center: CLLocationCoordinate2D

        if let firstProperty = propertiesWithCoords.first,
           let lat = firstProperty.latitude,
           let lon = firstProperty.longitude {
            center = CLLocationCoordinate2D(latitude: lat, longitude: lon)
        } else {
            // Default to Brussels
            center = CLLocationCoordinate2D(latitude: 50.8503, longitude: 4.3517)
        }

        _region = State(initialValue: MKCoordinateRegion(
            center: center,
            span: MKCoordinateSpan(latitudeDelta: 0.05, longitudeDelta: 0.05)
        ))
    }

    var body: some View {
        Map(coordinateRegion: $region, annotationItems: mapAnnotations) { annotation in
            MapAnnotation(coordinate: annotation.coordinate) {
                PropertyMarker(
                    property: annotation.property,
                    isSelected: selectedPropertyId == annotation.property.id
                ) {
                    selectedPropertyId = annotation.property.id
                }
            }
        }
    }

    // MARK: - Computed Properties

    private var mapAnnotations: [PropertyMapAnnotation] {
        properties.compactMap { property in
            guard let lat = property.latitude,
                  let lon = property.longitude else {
                return nil
            }

            return PropertyMapAnnotation(
                id: property.id,
                coordinate: CLLocationCoordinate2D(latitude: lat, longitude: lon),
                property: property
            )
        }
    }
}

// MARK: - Property Map Annotation

struct PropertyMapAnnotation: Identifiable {
    let id: UUID
    let coordinate: CLLocationCoordinate2D
    let property: Property
}

// MARK: - Property Marker

private struct PropertyMarker: View {
    let property: Property
    let isSelected: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 4) {
                // Price badge
                Text("€\(Int(property.monthlyRent))")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(
                        Capsule()
                            .fill(isSelected ? Color(hex: "FFA040") : Color(hex: "374151"))
                    )
                    .shadow(color: .black.opacity(0.2), radius: 4, x: 0, y: 2)
                    .scaleEffect(isSelected ? 1.1 : 1.0)

                // Pointer
                Triangle()
                    .fill(isSelected ? Color(hex: "FFA040") : Color(hex: "374151"))
                    .frame(width: 10, height: 6)
                    .offset(y: -4)
            }
        }
        .animation(.spring(response: 0.3, dampingFraction: 0.6), value: isSelected)
    }
}

// MARK: - Triangle Shape

private struct Triangle: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.midX, y: rect.maxY))
        return path
    }
}

// MARK: - Preview

struct PropertyMapView_Previews: PreviewProvider {
    static var previews: some View {
        PropertyMapView(
            properties: Property.mockProperties,
            selectedPropertyId: .constant(nil)
        )
    }
}
