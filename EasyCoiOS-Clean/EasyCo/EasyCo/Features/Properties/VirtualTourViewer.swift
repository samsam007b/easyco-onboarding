import SwiftUI
import SceneKit

// MARK: - Virtual Tour Viewer

struct VirtualTourViewer: View {
    let property: Property
    @Environment(\.dismiss) private var dismiss
    @State private var currentRoomIndex = 0
    @State private var isLoading = true
    @State private var showRoomInfo = true
    @State private var gyroscopeEnabled = true

    // Demo rooms for the tour
    private var rooms: [VirtualTourRoom] {
        [
            VirtualTourRoom(
                id: UUID(),
                name: "Salon",
                description: "Spacieux salon avec grande baie vitrée",
                imageUrl: property.images.first,
                hotspots: [
                    TourHotspot(id: UUID(), x: 0.3, y: 0.5, label: "Canapé", type: .furniture),
                    TourHotspot(id: UUID(), x: 0.7, y: 0.4, label: "TV", type: .furniture),
                    TourHotspot(id: UUID(), x: 0.5, y: 0.8, label: "Vers cuisine", type: .navigation)
                ]
            ),
            VirtualTourRoom(
                id: UUID(),
                name: "Cuisine",
                description: "Cuisine moderne entièrement équipée",
                imageUrl: property.images.count > 1 ? property.images[1] : property.images.first,
                hotspots: [
                    TourHotspot(id: UUID(), x: 0.2, y: 0.5, label: "Four", type: .appliance),
                    TourHotspot(id: UUID(), x: 0.6, y: 0.5, label: "Réfrigérateur", type: .appliance),
                    TourHotspot(id: UUID(), x: 0.8, y: 0.7, label: "Vers salon", type: .navigation)
                ]
            ),
            VirtualTourRoom(
                id: UUID(),
                name: "Chambre",
                description: "Chambre calme avec vue sur jardin",
                imageUrl: property.images.count > 2 ? property.images[2] : property.images.first,
                hotspots: [
                    TourHotspot(id: UUID(), x: 0.5, y: 0.5, label: "Lit double", type: .furniture),
                    TourHotspot(id: UUID(), x: 0.2, y: 0.6, label: "Armoire", type: .furniture)
                ]
            ),
            VirtualTourRoom(
                id: UUID(),
                name: "Salle de bain",
                description: "Salle de bain avec douche à l'italienne",
                imageUrl: property.images.count > 3 ? property.images[3] : property.images.first,
                hotspots: [
                    TourHotspot(id: UUID(), x: 0.3, y: 0.5, label: "Douche", type: .appliance),
                    TourHotspot(id: UUID(), x: 0.7, y: 0.5, label: "Lavabo", type: .appliance)
                ]
            )
        ]
    }

    var body: some View {
        ZStack {
            // Background
            Color.black.ignoresSafeArea()

            // 360° View
            if isLoading {
                loadingView
            } else {
                panoramicView
            }

            // Overlay UI
            VStack {
                // Top bar
                topBar

                Spacer()

                // Room info
                if showRoomInfo {
                    roomInfoCard
                }

                // Room selector
                roomSelector

                // Bottom controls
                bottomControls
            }
        }
        .onAppear {
            // Simulate loading
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                withAnimation {
                    isLoading = false
                }
            }
        }
    }

    // MARK: - Loading View

    private var loadingView: some View {
        VStack(spacing: 20) {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                .scaleEffect(1.5)

            Text("Chargement de la visite virtuelle...")
                .font(.system(size: 16))
                .foregroundColor(.white.opacity(0.8))
        }
    }

    // MARK: - Panoramic View

    private var panoramicView: some View {
        GeometryReader { geometry in
            ZStack {
                // 360 image placeholder (in real app, use SceneKit or similar)
                AsyncImage(url: URL(string: rooms[currentRoomIndex].imageUrl ?? "")) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(width: geometry.size.width, height: geometry.size.height)
                            .clipped()
                    case .failure(_), .empty:
                        ZStack {
                            LinearGradient(
                                colors: [Color(hex: "1F2937"), Color(hex: "374151")],
                                startPoint: .top,
                                endPoint: .bottom
                            )

                            VStack(spacing: 16) {
                                Image(systemName: "view.3d")
                                    .font(.system(size: 60))
                                    .foregroundColor(.white.opacity(0.3))

                                Text("Visite virtuelle 360°")
                                    .font(.system(size: 18, weight: .medium))
                                    .foregroundColor(.white.opacity(0.5))
                            }
                        }
                    @unknown default:
                        EmptyView()
                    }
                }

                // Hotspots
                ForEach(rooms[currentRoomIndex].hotspots) { hotspot in
                    HotspotButton(hotspot: hotspot) {
                        if hotspot.type == .navigation {
                            // Navigate to next room
                            withAnimation {
                                currentRoomIndex = (currentRoomIndex + 1) % rooms.count
                            }
                        }
                    }
                    .position(
                        x: geometry.size.width * hotspot.x,
                        y: geometry.size.height * hotspot.y
                    )
                }

                // Compass indicator
                VStack {
                    HStack {
                        Spacer()
                        CompassView()
                            .padding(16)
                    }
                    Spacer()
                }
            }
        }
    }

    // MARK: - Top Bar

    private var topBar: some View {
        HStack {
            Button(action: { dismiss() }) {
                Image(systemName: "xmark")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(width: 40, height: 40)
                    .background(.ultraThinMaterial)
                    .clipShape(Circle())
            }

            Spacer()

            Text(property.title)
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.white)
                .lineLimit(1)

            Spacer()

            Button(action: { showRoomInfo.toggle() }) {
                Image(systemName: showRoomInfo ? "info.circle.fill" : "info.circle")
                    .font(.system(size: 20))
                    .foregroundColor(.white)
                    .frame(width: 40, height: 40)
                    .background(.ultraThinMaterial)
                    .clipShape(Circle())
            }
        }
        .padding(.horizontal, 16)
        .padding(.top, 8)
    }

    // MARK: - Room Info Card

    private var roomInfoCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: roomIcon(for: rooms[currentRoomIndex].name))
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: "FFA040"))

                Text(rooms[currentRoomIndex].name)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.white)

                Spacer()

                Text("\(currentRoomIndex + 1)/\(rooms.count)")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.white.opacity(0.7))
            }

            Text(rooms[currentRoomIndex].description)
                .font(.system(size: 14))
                .foregroundColor(.white.opacity(0.8))

            // Hotspot legend
            HStack(spacing: 16) {
                HotspotLegend(icon: "sofa.fill", label: "Mobilier", color: Color(hex: "3B82F6"))
                HotspotLegend(icon: "refrigerator.fill", label: "Équipement", color: Color(hex: "10B981"))
                HotspotLegend(icon: "arrow.right.circle.fill", label: "Navigation", color: Color(hex: "FFA040"))
            }
            .padding(.top, 4)
        }
        .padding(16)
        .background(.ultraThinMaterial)
        .cornerRadius(16)
        .padding(.horizontal, 16)
    }

    // MARK: - Room Selector

    private var roomSelector: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(Array(rooms.enumerated()), id: \.element.id) { index, room in
                    RoomThumbnail(
                        room: room,
                        isSelected: index == currentRoomIndex
                    ) {
                        withAnimation {
                            currentRoomIndex = index
                        }
                    }
                }
            }
            .padding(.horizontal, 16)
        }
        .padding(.vertical, 12)
    }

    // MARK: - Bottom Controls

    private var bottomControls: some View {
        HStack(spacing: 20) {
            // Gyroscope toggle
            Button(action: { gyroscopeEnabled.toggle() }) {
                VStack(spacing: 4) {
                    Image(systemName: gyroscopeEnabled ? "gyroscope" : "gyroscope")
                        .font(.system(size: 22))
                        .foregroundColor(gyroscopeEnabled ? Color(hex: "FFA040") : .white.opacity(0.6))

                    Text("Gyroscope")
                        .font(.system(size: 10))
                        .foregroundColor(.white.opacity(0.7))
                }
            }

            Spacer()

            // Share
            Button(action: {}) {
                VStack(spacing: 4) {
                    Image(systemName: "square.and.arrow.up")
                        .font(.system(size: 22))
                        .foregroundColor(.white.opacity(0.8))

                    Text("Partager")
                        .font(.system(size: 10))
                        .foregroundColor(.white.opacity(0.7))
                }
            }

            Spacer()

            // Fullscreen
            Button(action: {}) {
                VStack(spacing: 4) {
                    Image(systemName: "arrow.up.left.and.arrow.down.right")
                        .font(.system(size: 22))
                        .foregroundColor(.white.opacity(0.8))

                    Text("Plein écran")
                        .font(.system(size: 10))
                        .foregroundColor(.white.opacity(0.7))
                }
            }

            Spacer()

            // Book visit
            Button(action: {}) {
                HStack(spacing: 6) {
                    Image(systemName: "calendar.badge.plus")
                        .font(.system(size: 16))
                    Text("Réserver")
                        .font(.system(size: 14, weight: .semibold))
                }
                .foregroundColor(.white)
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(Color(hex: "FFA040"))
                .cornerRadius(999)
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 16)
        .background(.ultraThinMaterial)
    }

    // MARK: - Helper

    private func roomIcon(for name: String) -> String {
        switch name.lowercased() {
        case "salon": return "sofa.fill"
        case "cuisine": return "fork.knife"
        case "chambre": return "bed.double.fill"
        case "salle de bain": return "shower.fill"
        default: return "square.grid.2x2.fill"
        }
    }
}

// MARK: - Hotspot Button

struct HotspotButton: View {
    let hotspot: TourHotspot
    let action: () -> Void
    @State private var isAnimating = false

    var body: some View {
        Button(action: action) {
            ZStack {
                // Pulse animation
                Circle()
                    .fill(hotspot.color.opacity(0.3))
                    .frame(width: isAnimating ? 60 : 44, height: isAnimating ? 60 : 44)

                Circle()
                    .fill(hotspot.color)
                    .frame(width: 44, height: 44)

                Image(systemName: hotspot.icon)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
            }
        }
        .onAppear {
            withAnimation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true)) {
                isAnimating = true
            }
        }
    }
}

// MARK: - Compass View

struct CompassView: View {
    var body: some View {
        ZStack {
            Circle()
                .fill(.ultraThinMaterial)
                .frame(width: 50, height: 50)

            Image(systemName: "location.north.fill")
                .font(.system(size: 20))
                .foregroundColor(Color(hex: "EF4444"))
        }
    }
}

// MARK: - Hotspot Legend

struct HotspotLegend: View {
    let icon: String
    let label: String
    let color: Color

    var body: some View {
        HStack(spacing: 4) {
            Circle()
                .fill(color)
                .frame(width: 8, height: 8)

            Text(label)
                .font(.system(size: 11))
                .foregroundColor(.white.opacity(0.7))
        }
    }
}

// MARK: - Room Thumbnail

struct RoomThumbnail: View {
    let room: VirtualTourRoom
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 6) {
                ZStack {
                    AsyncImage(url: URL(string: room.imageUrl ?? "")) { phase in
                        switch phase {
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(width: 70, height: 50)
                                .clipped()
                                .cornerRadius(8)
                        case .failure(_), .empty:
                            Rectangle()
                                .fill(Color(hex: "374151"))
                                .frame(width: 70, height: 50)
                                .cornerRadius(8)
                                .overlay(
                                    Image(systemName: "photo")
                                        .foregroundColor(.white.opacity(0.3))
                                )
                        @unknown default:
                            EmptyView()
                        }
                    }

                    if isSelected {
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(Color(hex: "FFA040"), lineWidth: 2)
                            .frame(width: 70, height: 50)
                    }
                }

                Text(room.name)
                    .font(.system(size: 11, weight: isSelected ? .semibold : .regular))
                    .foregroundColor(isSelected ? Color(hex: "FFA040") : .white.opacity(0.7))
            }
        }
    }
}

// MARK: - Models

struct VirtualTourRoom: Identifiable {
    let id: UUID
    let name: String
    let description: String
    let imageUrl: String?
    let hotspots: [TourHotspot]
}

struct TourHotspot: Identifiable {
    let id: UUID
    let x: CGFloat
    let y: CGFloat
    let label: String
    let type: HotspotType

    var icon: String {
        switch type {
        case .furniture: return "sofa.fill"
        case .appliance: return "refrigerator.fill"
        case .navigation: return "arrow.right"
        case .info: return "info"
        }
    }

    var color: Color {
        switch type {
        case .furniture: return Color(hex: "3B82F6")
        case .appliance: return Color(hex: "10B981")
        case .navigation: return Color(hex: "FFA040")
        case .info: return Color(hex: "8B5CF6")
        }
    }
}

enum HotspotType {
    case furniture
    case appliance
    case navigation
    case info
}

// MARK: - Preview

struct VirtualTourViewer_Previews: PreviewProvider {
    static var previews: some View {
        VirtualTourViewer(property: Property.mockProperties.first!)
    }
}
