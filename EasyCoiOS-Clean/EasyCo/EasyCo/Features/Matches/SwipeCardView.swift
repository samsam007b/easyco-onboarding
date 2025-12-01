import SwiftUI

// MARK: - Swipe Card View (Tinder-style)

struct SwipeCardView: View {
    let property: Property
    let onSwipe: (SwipeDirection) -> Void

    @State private var offset: CGSize = .zero
    @State private var rotation: Double = 0
    @State private var opacity: Double = 1.0

    private let swipeThreshold: CGFloat = 120
    private let rotationMultiplier: Double = 0.05

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Main Card
                cardContent
                    .frame(width: geometry.size.width, height: geometry.size.height)

                // Like Indicator (Right)
                likeIndicator
                    .opacity(offset.width > 0 ? Double(offset.width / swipeThreshold) : 0)

                // Dislike Indicator (Left)
                dislikeIndicator
                    .opacity(offset.width < 0 ? Double(-offset.width / swipeThreshold) : 0)
            }
            .offset(offset)
            .rotationEffect(.degrees(rotation))
            .opacity(opacity)
            .gesture(
                DragGesture()
                    .onChanged { gesture in
                        offset = gesture.translation
                        rotation = Double(gesture.translation.width) * rotationMultiplier

                        // Haptic feedback at threshold
                        if abs(gesture.translation.width) > swipeThreshold * 0.8 {
                            HapticFeedback.light()
                        }
                    }
                    .onEnded { gesture in
                        handleSwipeEnd(translation: gesture.translation, velocity: gesture.predictedEndTranslation)
                    }
            )
            .animation(.spring(response: 0.3, dampingFraction: 0.7), value: offset)
            .animation(.spring(response: 0.3, dampingFraction: 0.7), value: rotation)
        }
    }

    // MARK: - Card Content

    private var cardContent: some View {
        ZStack(alignment: .bottom) {
            // Property Image
            propertyImage

            // Gradient Overlay
            LinearGradient(
                colors: [.clear, .clear, .black.opacity(0.4), .black.opacity(0.8)],
                startPoint: .top,
                endPoint: .bottom
            )

            // Top badges (Score + Favorite)
            VStack {
                HStack {
                    // Compatibility Score Badge
                    if let score = property.compatibilityScore, score > 0 {
                        compatibilityBadge(score: score)
                    }

                    Spacer()
                }
                .padding(16)

                Spacer()
            }

            // Property Info
            VStack(alignment: .leading, spacing: 12) {
                // Title and Price Row
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(property.title)
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(.white)
                            .lineLimit(2)

                        HStack(spacing: 4) {
                            Image(systemName: "location.fill")
                                .font(.system(size: 12))
                            Text("\(property.city)\(property.neighborhood != nil ? ", \(property.neighborhood!)" : "")")
                                .font(.system(size: 14))
                        }
                        .foregroundColor(.white.opacity(0.9))
                    }

                    Spacer()

                    // Price Badge
                    VStack(alignment: .trailing, spacing: 2) {
                        Text("€\(Int(property.monthlyRent))")
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(.white)
                        Text("/mois")
                            .font(.system(size: 12))
                            .foregroundColor(.white.opacity(0.7))
                    }
                }

                // Property Stats
                HStack(spacing: 16) {
                    if property.bedrooms > 0 {
                        propertyStatBadge(icon: "bed.double.fill", value: "\(property.bedrooms)")
                    }

                    if property.bathrooms > 0 {
                        propertyStatBadge(icon: "shower.fill", value: "\(property.bathrooms)")
                    }

                    if let area = property.surfaceArea, area > 0 {
                        propertyStatBadge(icon: "square.split.2x2", value: "\(Int(area))m²")
                    }

                    if property.furnished {
                        propertyStatBadge(icon: "sofa.fill", value: "Meublé")
                    }
                }

                // Amenities Row
                if !property.amenities.isEmpty {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(property.amenities.prefix(5), id: \.self) { amenity in
                                amenityChip(amenity)
                            }
                            if property.amenities.count > 5 {
                                Text("+\(property.amenities.count - 5)")
                                    .font(.system(size: 11, weight: .medium))
                                    .foregroundColor(.white.opacity(0.8))
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(Color.white.opacity(0.2))
                                    .cornerRadius(12)
                            }
                        }
                    }
                }

                // Match Insights (if available)
                if let insights = property.matchInsights, !insights.isEmpty {
                    HStack(spacing: 6) {
                        Image(systemName: "sparkles")
                            .font(.system(size: 12))
                        Text(insights.first ?? "")
                            .font(.system(size: 12, weight: .medium))
                    }
                    .foregroundColor(Theme.Colors.Searcher.primary)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Theme.Colors.Searcher.primary.opacity(0.2))
                    .cornerRadius(20)
                }
            }
            .padding(20)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .clipShape(RoundedRectangle(cornerRadius: Theme.CornerRadius._3xl))
        .shadow(color: .black.opacity(0.25), radius: 15, x: 0, y: 8)
    }

    @ViewBuilder
    private var propertyImage: some View {
        if let firstImage = property.images.first, !firstImage.isEmpty {
            AsyncImage(url: URL(string: firstImage)) { phase in
                switch phase {
                case .success(let image):
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                case .failure(_):
                    placeholderImage
                case .empty:
                    ZStack {
                        placeholderImage
                        ProgressView()
                            .tint(.white)
                    }
                @unknown default:
                    placeholderImage
                }
            }
        } else {
            placeholderImage
        }
    }

    private var placeholderImage: some View {
        Rectangle()
            .fill(Theme.Gradients.brand)
            .overlay(
                VStack(spacing: 12) {
                    Image(systemName: "house.fill")
                        .font(.system(size: 60))
                        .foregroundColor(.white.opacity(0.5))
                    Text("Pas d'image")
                        .font(.system(size: 14))
                        .foregroundColor(.white.opacity(0.5))
                }
            )
    }

    // MARK: - Components

    private func compatibilityBadge(score: Int) -> some View {
        HStack(spacing: 4) {
            Image(systemName: "heart.fill")
                .font(.system(size: 12))
            Text("\(score)%")
                .font(.system(size: 14, weight: .bold))
        }
        .foregroundColor(.white)
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(
            Theme.Gradients.compatibilityScore
        )
        .cornerRadius(20)
        .shadow(color: Theme.Colors.success.opacity(0.4), radius: 8, x: 0, y: 4)
    }

    private func propertyStatBadge(icon: String, value: String) -> some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
                .font(.system(size: 12))
            Text(value)
                .font(.system(size: 13, weight: .medium))
        }
        .foregroundColor(.white.opacity(0.9))
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(Color.white.opacity(0.15))
        .cornerRadius(12)
    }

    private func amenityChip(_ amenity: PropertyAmenity) -> some View {
        HStack(spacing: 4) {
            Image(systemName: amenity.icon)
                .font(.system(size: 10))
            Text(amenity.displayName)
                .font(.system(size: 11, weight: .medium))
        }
        .foregroundColor(.white.opacity(0.9))
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(Color.white.opacity(0.2))
        .cornerRadius(12)
    }

    // MARK: - Indicators

    private var likeIndicator: some View {
        VStack {
            HStack {
                ZStack {
                    Circle()
                        .fill(Theme.Colors.success.opacity(0.3))
                        .frame(width: 100, height: 100)
                        .blur(radius: 10)

                    VStack(spacing: 4) {
                        Image(systemName: "heart.fill")
                            .font(.system(size: 40, weight: .bold))
                        Text("LIKE")
                            .font(.system(size: 16, weight: .black))
                    }
                    .foregroundColor(Theme.Colors.success)
                }
                .padding(.leading, 40)
                .padding(.top, 60)

                Spacer()
            }
            Spacer()
        }
    }

    private var dislikeIndicator: some View {
        VStack {
            HStack {
                Spacer()

                ZStack {
                    Circle()
                        .fill(Theme.Colors.error.opacity(0.3))
                        .frame(width: 100, height: 100)
                        .blur(radius: 10)

                    VStack(spacing: 4) {
                        Image(systemName: "xmark")
                            .font(.system(size: 40, weight: .bold))
                        Text("NOPE")
                            .font(.system(size: 16, weight: .black))
                    }
                    .foregroundColor(Theme.Colors.error)
                }
                .padding(.trailing, 40)
                .padding(.top, 60)
            }
            Spacer()
        }
    }

    // MARK: - Swipe Handling

    private func handleSwipeEnd(translation: CGSize, velocity: CGSize) {
        let horizontalDistance = abs(translation.width)
        let verticalDistance = abs(translation.height)

        // Determine if it's a horizontal swipe
        guard horizontalDistance > verticalDistance else {
            resetCard()
            return
        }

        // Check if swipe passed threshold or has high velocity
        let shouldSwipe = horizontalDistance > swipeThreshold || abs(velocity.width) > 1000

        if shouldSwipe {
            let direction: SwipeDirection = translation.width > 0 ? .right : .left
            completeSwipe(direction: direction)
        } else {
            resetCard()
        }
    }

    private func completeSwipe(direction: SwipeDirection) {
        // Haptic feedback
        if direction == .right {
            HapticFeedback.success()
        } else {
            HapticFeedback.medium()
        }

        let screenWidth = UIScreen.main.bounds.width

        withAnimation(.easeOut(duration: 0.3)) {
            offset = CGSize(
                width: direction == .right ? screenWidth + 100 : -screenWidth - 100,
                height: offset.height
            )
            rotation = direction == .right ? 25 : -25
            opacity = 0
        }

        // Notify parent after animation
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            onSwipe(direction)
        }
    }

    private func resetCard() {
        HapticFeedback.light()
        withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
            offset = .zero
            rotation = 0
        }
    }
}

// MARK: - Swipe Direction

enum SwipeDirection {
    case left  // Dislike
    case right // Like
}

// MARK: - Preview

#Preview {
    SwipeCardView(
        property: Property(
            id: UUID(),
            ownerID: UUID(),
            title: "Superbe Appartement Lumineux",
            description: "Beau studio rénové en plein centre avec vue dégagée",
            propertyType: .apartment,
            address: "15 Rue de la Roquette",
            city: "Bruxelles",
            neighborhood: "Ixelles",
            postalCode: "1050",
            country: "Belgique",
            latitude: 50.8266,
            longitude: 4.3640,
            bedrooms: 2,
            bathrooms: 1,
            totalRooms: 4,
            surfaceArea: 65,
            floorNumber: 3,
            totalFloors: 6,
            furnished: true,
            monthlyRent: 950,
            charges: 100,
            deposit: 1900,
            availableFrom: Date(),
            availableUntil: nil,
            minimumStayMonths: 6,
            maximumStayMonths: 24,
            isAvailable: true,
            amenities: [.wifi, .elevator, .washingMachine, .balcony, .heating],
            smokingAllowed: false,
            petsAllowed: true,
            couplesAllowed: true,
            childrenAllowed: false,
            images: [],
            mainImage: nil,
            status: .published,
            viewsCount: 145,
            applicationsCount: 8,
            favoritesCount: 32,
            rating: 4.7,
            reviewsCount: 12,
            createdAt: Date(),
            updatedAt: Date(),
            publishedAt: Date(),
            archivedAt: nil,
            compatibilityScore: 94,
            matchInsights: ["Style de vie compatible", "Budget idéal"],
            isFavorited: false,
            residents: nil
        ),
        onSwipe: { direction in
            print("Swiped: \(direction)")
        }
    )
    .frame(height: 600)
    .padding()
}
