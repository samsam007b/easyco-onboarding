import SwiftUI

// MARK: - Room Card View

struct RoomCardView: View {
    let room: Room
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 0) {
                // Room Image
                roomImage

                // Room Info
                VStack(alignment: .leading, spacing: 12) {
                    // Status Badge & Title
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 4) {
                            if let roomNumber = room.roomNumber {
                                Text("Chambre \(roomNumber)")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }

                            Text(room.title)
                                .font(.headline)
                                .foregroundColor(.primary)
                                .lineLimit(2)
                        }

                        Spacer()

                        statusBadge
                    }

                    // Room Details
                    HStack(spacing: 16) {
                        DetailItem(
                            icon: room.roomType.icon,
                            text: room.roomType.displayName
                        )

                        DetailItem(
                            icon: "square",
                            text: "\(Int(room.surfaceArea))m²"
                        )

                        if room.hasPrivateBathroom {
                            DetailItem(
                                icon: "shower",
                                text: "SDB privée"
                            )
                        }
                    }
                    .font(.caption)
                    .foregroundColor(.secondary)

                    // Features
                    features

                    // Price
                    HStack(alignment: .firstTextBaseline, spacing: 4) {
                        Text("\(Int(room.monthlyRent))€")
                            .font(.title3)
                            .fontWeight(.bold)
                            .foregroundColor(Theme.Colors.primary)

                        Text("/mois")
                            .font(.caption)
                            .foregroundColor(.secondary)

                        if room.charges > 0 {
                            Text("+ \(Int(room.charges))€ charges")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }

                        Spacer()

                        if room.applicationsCount > 0 {
                            HStack(spacing: 4) {
                                Image(systemName: "person.2")
                                Text("\(room.applicationsCount)")
                            }
                            .font(.caption)
                            .foregroundColor(.secondary)
                        }
                    }
                }
                .padding(16)
            }
            .background(Color(.systemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .shadow(color: .black.opacity(0.08), radius: 8, x: 0, y: 2)
        }
        .buttonStyle(.plain)
    }

    // MARK: - Room Image

    private var roomImage: some View {
        Group {
            if let imageURL = room.mainImage ?? room.images.first,
               let url = URL(string: imageURL) {
                AsyncImage(url: url) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    case .failure(_):
                        placeholderImage
                    case .empty:
                        ProgressView()
                    @unknown default:
                        placeholderImage
                    }
                }
            } else {
                placeholderImage
            }
        }
        .frame(height: 180)
        .clipped()
    }

    private var placeholderImage: some View {
        Rectangle()
            .fill(
                LinearGradient(
                    colors: [Theme.Colors.primary.opacity(0.2), Theme.Colors.secondary.opacity(0.2)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .overlay(
                Image(systemName: room.roomType.icon)
                    .font(.system(size: 40))
                    .foregroundColor(.white.opacity(0.5))
            )
    }

    // MARK: - Status Badge

    private var statusBadge: some View {
        Text(room.status.displayName)
            .font(.caption2)
            .fontWeight(.semibold)
            .foregroundColor(.white)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(Color(hex: room.status.color))
            .clipShape(RoundedRectangle(cornerRadius: 6))
    }

    // MARK: - Features

    private var features: some View {
        HStack(spacing: 8) {
            if room.furnished {
                FeatureTag(icon: "sofa", text: "Meublée")
            }

            if room.hasBalcony {
                FeatureTag(icon: "sun.max", text: "Balcon")
            }

            if let genderPref = room.genderPreference, genderPref != .any {
                FeatureTag(icon: "person", text: genderPref.displayName)
            }
        }
    }
}

// MARK: - Detail Item

private struct DetailItem: View {
    let icon: String
    let text: String

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
            Text(text)
        }
    }
}

// MARK: - Feature Tag

private struct FeatureTag: View {
    let icon: String
    let text: String

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
                .font(.caption2)
            Text(text)
                .font(.caption2)
        }
        .foregroundColor(Theme.Colors.primary)
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(Theme.Colors.primary.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 6))
    }
}

// MARK: - Preview

#Preview {
    VStack(spacing: 16) {
        RoomCardView(room: Room.mockRooms[0]) {
            print("Tapped room 1")
        }

        RoomCardView(room: Room.mockRooms[1]) {
            print("Tapped room 2")
        }
    }
    .padding()
    .background(Color(.systemGroupedBackground))
}
