import SwiftUI

// MARK: - Property Card View (Complete Web App Replica)

struct PropertyCardView: View {
    let property: Property
    var onFavorite: (() -> Void)?
    var onTap: (() -> Void)?
    @State private var imageScale: CGFloat = 1.0
    @State private var shadowRadius: CGFloat = 12

    var body: some View {
        Button(action: { onTap?() }) {
            VStack(alignment: .leading, spacing: 0) {
                // Image with overlays
                imageSection

                // Content section
                VStack(alignment: .leading, spacing: 12) {
                    // Title & Rating
                    titleAndRating

                    // Location
                    locationRow

                    // Details (bedrooms, views)
                    detailsRow

                    // Description
                    if let description = property.description, !description.isEmpty {
                        Text(description)
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "6B7280"))
                            .lineLimit(2)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 16)
                .padding(.bottom, 12)

                // Glassmorphism price footer
                glassmorphismPriceFooter
            }
            .background(Color.white)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.1), radius: shadowRadius, x: 0, y: 4)
            .scaleEffect(imageScale)
        }
        .buttonStyle(PlainButtonStyle())
        .onLongPressGesture(minimumDuration: 0.1, pressing: { pressing in
            withAnimation(.easeInOut(duration: 0.2)) {
                shadowRadius = pressing ? 24 : 12
                imageScale = pressing ? 0.98 : 1.0
            }
        }, perform: {})
    }

    // MARK: - Image Section

    private var imageSection: some View {
        ZStack {
            // Main image
            GeometryReader { geometry in
                if let firstImage = property.images.first, !firstImage.isEmpty, let url = URL(string: firstImage) {
                    AsyncImage(url: url) { phase in
                        switch phase {
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(width: geometry.size.width, height: geometry.size.height)
                                .clipped()
                        case .failure(_), .empty:
                            placeholderImage
                        @unknown default:
                            placeholderImage
                        }
                    }
                } else {
                    placeholderImage
                }
            }

            // Gradient overlay at bottom for residents
            LinearGradient(
                colors: [Color.clear, Color.black.opacity(0.3)],
                startPoint: .center,
                endPoint: .bottom
            )

            // Top overlays
            VStack {
                HStack(alignment: .top) {
                    // Compatibility Score Badge (if available)
                    if let score = property.compatibilityScore {
                        compatibilityBadge(score: score)
                    } else {
                        // Property Type Badge
                        propertyTypeBadge
                    }

                    Spacer()

                    // Favorite button
                    favoriteButton
                }
                .padding(12)

                Spacer()

                // Residents photos at bottom left
                if let residents = property.residents, !residents.isEmpty {
                    residentsAvatars(residents: residents)
                }
            }
        }
        .frame(height: 224)
        .clipped()
    }

    private var placeholderImage: some View {
        Rectangle()
            .fill(Color(hex: "E5E7EB"))
            .overlay(
                Image(systemName: property.propertyType.icon)
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "9CA3AF"))
            )
    }

    private var compatibilityBadge: some View {
        Text(compatibilityText)
            .font(.system(size: 14, weight: .bold))
            .foregroundColor(.white)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(
                Capsule()
                    .fill(Color(hex: "10B981"))
                    .shadow(color: .black.opacity(0.2), radius: 6, x: 0, y: 2)
            )
    }

    private func compatibilityBadge(score: Int) -> some View {
        Text("\(score)% Match")
            .font(.system(size: 14, weight: .bold))
            .foregroundColor(.white)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(
                Capsule()
                    .fill(Color(hex: "10B981"))
                    .shadow(color: .black.opacity(0.2), radius: 6, x: 0, y: 2)
            )
    }

    private var propertyTypeBadge: some View {
        Text(property.propertyType.displayName)
            .font(.system(size: 12, weight: .medium))
            .foregroundColor(Color(hex: "374151"))
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(
                Capsule()
                    .fill(Color.white.opacity(0.9))
                    .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 1)
            )
            .background(Material.ultraThin)
            .clipShape(Capsule())
    }

    private var favoriteButton: some View {
        Button(action: {
            onFavorite?()
        }) {
            Image(systemName: (property.isFavorited ?? false) ? "heart.fill" : "heart")
                .font(.system(size: 18))
                .foregroundColor((property.isFavorited ?? false) ? Color(hex: "EF4444") : Color.white)
                .frame(width: 40, height: 40)
                .background(
                    Circle()
                        .fill(Color.white.opacity(0.9))
                        .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 1)
                )
                .background(Material.ultraThin)
                .clipShape(Circle())
        }
        .buttonStyle(PlainButtonStyle())
        .scaleEffect(imageScale)
        .animation(.spring(response: 0.3, dampingFraction: 0.6), value: imageScale)
    }

    private func residentsAvatars(residents: [PropertyResident]) -> some View {
        HStack(spacing: -12) {
            ForEach(residents.prefix(4)) { resident in
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 40, height: 40)
                    .overlay(
                        Text(resident.initials)
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white)
                    )
                    .overlay(
                        Circle()
                            .stroke(Color.white, lineWidth: 2)
                    )
            }

            if residents.count > 4 {
                Circle()
                    .fill(Color.white.opacity(0.9))
                    .frame(width: 40, height: 40)
                    .overlay(
                        Text("+\(residents.count - 4)")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(Color(hex: "374151"))
                    )
                    .overlay(
                        Circle()
                            .stroke(Color.white, lineWidth: 2)
                    )
            }
        }
        .padding(.leading, 12)
        .padding(.bottom, 12)
    }

    // MARK: - Content Sections

    private var titleAndRating: some View {
        HStack(alignment: .top) {
            Text(property.title)
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(Color(hex: "111827"))
                .lineLimit(2)
                .frame(maxWidth: .infinity, alignment: .leading)

            if property.rating > 0 {
                HStack(spacing: 4) {
                    Image(systemName: "star.fill")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "FBBF24"))
                    Text(String(format: "%.1f", property.rating))
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "111827"))
                }
            }
        }
    }

    private var locationRow: some View {
        HStack(spacing: 6) {
            Image(systemName: "mappin")
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "6B7280"))

            Text("\(property.city)\(property.neighborhood.map { ", \($0)" } ?? "")")
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "6B7280"))
        }
    }

    private var detailsRow: some View {
        HStack(spacing: 16) {
            // Bedrooms
            HStack(spacing: 6) {
                Image(systemName: "house")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "6B7280"))
                Text("\(property.bedrooms) chambre\(property.bedrooms > 1 ? "s" : "")")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            // Views count
            HStack(spacing: 6) {
                Image(systemName: "eye")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "6B7280"))
                Text("\(property.viewsCount) vues")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "6B7280"))
            }
        }
    }

    // MARK: - Glassmorphism Price Footer

    private var glassmorphismPriceFooter: some View {
        ZStack {
            // Animated background lights
            AnimatedGradientBackground()

            // Glassmorphism layer
            Rectangle()
                .fill(.ultraThinMaterial)
                .background(
                    LinearGradient(
                        colors: [
                            Color.white.opacity(0.7),
                            Color.white.opacity(0.6),
                            Color.white.opacity(0.5)
                        ],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )

            // Content
            HStack(alignment: .center, spacing: 12) {
                // Price section
                VStack(alignment: .leading, spacing: 2) {
                    HStack(alignment: .firstTextBaseline, spacing: 4) {
                        Text("€\(Int(property.monthlyRent))")
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(Color(hex: "111827"))
                        Text("/mois")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "6B7280"))
                    }

                    if let availableFrom = property.availableFrom {
                        Text("Dispo \(formatDate(availableFrom))")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }

                Spacer()

                // Action buttons
                HStack(spacing: 8) {
                    // Book visit button
                    Button(action: {}) {
                        HStack(spacing: 6) {
                            Image(systemName: "calendar")
                                .font(.system(size: 13, weight: .semibold))
                            Text("Visite")
                                .font(.system(size: 14, weight: .semibold))
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background(
                            LinearGradient(
                                colors: [Color(hex: "FFA040"), Color(hex: "FFB85C"), Color(hex: "FFD080")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(999)
                        .shadow(color: Color(hex: "FFA040").opacity(0.3), radius: 6, x: 0, y: 2)
                    }
                    .buttonStyle(PlainButtonStyle())

                    // View button
                    Button(action: { onTap?() }) {
                        Text("Voir")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 20)
                            .padding(.vertical, 10)
                            .background(
                                LinearGradient(
                                    colors: [Color(hex: "7B5FB8"), Color(hex: "A67BB8"), Color(hex: "C98B9E")],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(999)
                            .shadow(color: Color(hex: "7B5FB8").opacity(0.3), radius: 6, x: 0, y: 2)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .frame(height: 80)
    }

    // MARK: - Helpers

    private var compatibilityText: String {
        guard let score = property.compatibilityScore else { return "Nouveau" }
        return "\(score)% Match"
    }

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "dd/MM"
        return formatter.string(from: date)
    }
}

// MARK: - Animated Gradient Background

struct AnimatedGradientBackground: View {
    @State private var animateGradient = false

    var body: some View {
        ZStack {
            // Background gradient
            LinearGradient(
                colors: [
                    Color(hex: "FFF4ED"), // orange-50
                    Color(hex: "F5F3FF"), // purple-50
                    Color(hex: "FEF3C7")  // yellow-50
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            // Floating orbs
            FloatingOrb(
                color: Color(hex: "FFA040").opacity(0.6),
                size: 128,
                duration: 20,
                delay: 0
            )

            FloatingOrb(
                color: Color(hex: "A67BB8").opacity(0.5),
                size: 160,
                duration: 25,
                delay: 5
            )

            FloatingOrb(
                color: Color(hex: "FFD080").opacity(0.5),
                size: 144,
                duration: 22,
                delay: 10
            )
        }
    }
}

struct FloatingOrb: View {
    let color: Color
    let size: CGFloat
    let duration: Double
    let delay: Double

    @State private var position: CGPoint = CGPoint(x: 0, y: 0)

    var body: some View {
        Circle()
            .fill(color)
            .frame(width: size, height: size)
            .blur(radius: 40)
            .position(position)
            .onAppear {
                withAnimation(
                    Animation.easeInOut(duration: duration)
                        .repeatForever(autoreverses: true)
                        .delay(delay)
                ) {
                    position = CGPoint(x: 20, y: -20)
                }
            }
    }
}

// MARK: - Preview

struct PropertyCardView_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                ForEach(Property.mockProperties) { property in
                    PropertyCardView(property: property)
                }
            }
            .padding(16)
        }
        .background(Color(hex: "F9FAFB"))
    }
}
