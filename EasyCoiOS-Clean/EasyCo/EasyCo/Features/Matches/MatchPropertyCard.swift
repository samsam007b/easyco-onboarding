import SwiftUI

// MARK: - Match Property Card (avec score de compatibilité)

struct MatchPropertyCard: View {
    let property: Property
    let onFavorite: () -> Void
    let onTap: () -> Void

    private var compatibilityScore: Int {
        property.compatibilityScore ?? 0
    }

    private var scoreColor: Color {
        if compatibilityScore >= 90 {
            return Color(hex: "10B981") // Vert
        } else if compatibilityScore >= 80 {
            return Color(hex: "FFA040") // Orange
        } else {
            return Color(hex: "6B7280") // Gris
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image avec badge de score
            ZStack(alignment: .topTrailing) {
                AsyncImage(url: URL(string: property.images.first ?? "")) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(height: 180)
                            .clipped()
                    case .failure(_), .empty:
                        Rectangle()
                            .fill(Color(hex: "E5E7EB"))
                            .frame(height: 180)
                            .overlay(
                                Image(systemName: "photo")
                                    .font(.system(size: 32))
                                    .foregroundColor(Color(hex: "9CA3AF"))
                            )
                    @unknown default:
                        EmptyView()
                    }
                }

                // Score badge
                HStack(spacing: 4) {
                    Image(systemName: "sparkles")
                        .font(.system(size: 12, weight: .bold))
                    Text("\(compatibilityScore)%")
                        .font(.system(size: 14, weight: .bold))
                }
                .foregroundColor(.white)
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(
                    LinearGradient(
                        colors: [scoreColor, scoreColor.opacity(0.8)],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(999)
                .padding(12)
            }
            .frame(height: 180)
            .cornerRadius(16, corners: [.topLeft, .topRight])

            // Content
            VStack(alignment: .leading, spacing: 12) {
                // Title
                Text(property.title)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))
                    .lineLimit(2)

                // Location
                HStack(spacing: 4) {
                    Image(systemName: "mappin")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))
                    Text(property.city)
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                        .lineLimit(1)
                }

                // Match reasons (pourquoi c'est un bon match)
                if compatibilityScore >= 80 {
                    VStack(alignment: .leading, spacing: 4) {
                        MatchReasonBadge(
                            icon: "eurosign.circle.fill",
                            text: "Budget OK",
                            color: Color(hex: "10B981")
                        )
                        MatchReasonBadge(
                            icon: "mappin.circle.fill",
                            text: "Localisation",
                            color: Color(hex: "FFA040")
                        )
                    }
                }

                Divider()

                // Price and favorite
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("€\(Int(property.monthlyRent))")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(Color(hex: "FFA040"))
                        Text("par mois")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "6B7280"))
                    }

                    Spacer()

                    Button(action: onFavorite) {
                        Image(systemName: (property.isFavorited ?? false) ? "heart.fill" : "heart")
                            .font(.system(size: 20))
                            .foregroundColor((property.isFavorited ?? false) ? Color(hex: "EF4444") : Color(hex: "D1D5DB"))
                    }
                }
            }
            .padding(12)
        }
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.08), radius: 12, x: 0, y: 4)
        .onTapGesture(perform: onTap)
    }
}

// MARK: - Match Reason Badge

struct MatchReasonBadge: View {
    let icon: String
    let text: String
    let color: Color

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
                .font(.system(size: 10))
                .foregroundColor(color)
            Text(text)
                .font(.system(size: 11, weight: .medium))
                .foregroundColor(Color(hex: "374151"))
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(color.opacity(0.1))
        .cornerRadius(999)
    }
}

// MARK: - Preview

struct MatchPropertyCard_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            MatchPropertyCard(
                property: Property.mockProperties.first!,
                onFavorite: {},
                onTap: {}
            )
            .frame(width: 180)
        }
        .padding()
        .background(Color(hex: "F9FAFB"))
    }
}
