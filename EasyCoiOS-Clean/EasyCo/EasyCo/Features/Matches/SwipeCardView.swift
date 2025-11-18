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
            if let firstImage = property.images.first {
                AsyncImage(url: URL(string: firstImage)) { phase in
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

            // Gradient Overlay
            LinearGradient(
                colors: [.clear, .black.opacity(0.7)],
                startPoint: .center,
                endPoint: .bottom
            )

            // Property Info
            VStack(alignment: .leading, spacing: 8) {
                Text(property.title)
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.white)

                HStack(spacing: 16) {
                    Label("\(property.city), \(property.neighborhood ?? "")", systemImage: "location.fill")
                    Label("\(Int(property.monthlyRent))€/mois", systemImage: "eurosign.circle.fill")
                }
                .font(.subheadline)
                .foregroundColor(.white.opacity(0.9))

                HStack(spacing: 12) {
                    if property.bedrooms > 0 {
                        HStack(spacing: 4) {
                            Image(systemName: "bed.double.fill")
                            Text("\(property.bedrooms)")
                        }
                    }

                    if property.bathrooms > 0 {
                        HStack(spacing: 4) {
                            Image(systemName: "shower.fill")
                            Text("\(property.bathrooms)")
                        }
                    }

                    if let area = property.surfaceArea, area > 0 {
                        HStack(spacing: 4) {
                            Image(systemName: "square.fill")
                            Text("\(Int(area))m²")
                        }
                    }
                }
                .font(.caption)
                .foregroundColor(.white.opacity(0.8))
            }
            .padding(20)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .shadow(color: .black.opacity(0.2), radius: 10, x: 0, y: 5)
    }

    private var placeholderImage: some View {
        Rectangle()
            .fill(
                LinearGradient(
                    colors: [Theme.Colors.primary.opacity(0.3), Theme.Colors.secondary.opacity(0.3)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .overlay(
                Image(systemName: "house.fill")
                    .font(.system(size: 60))
                    .foregroundColor(.white.opacity(0.3))
            )
    }

    // MARK: - Indicators

    private var likeIndicator: some View {
        VStack {
            HStack {
                Spacer()
                ZStack {
                    Circle()
                        .fill(Color.green.opacity(0.2))
                        .frame(width: 100, height: 100)

                    Image(systemName: "heart.fill")
                        .font(.system(size: 50))
                        .foregroundColor(.green)
                }
                .padding(.trailing, 30)
                .padding(.top, 50)
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
                        .fill(Color.red.opacity(0.2))
                        .frame(width: 100, height: 100)

                    Image(systemName: "xmark")
                        .font(.system(size: 50))
                        .foregroundColor(.red)
                }
                .padding(.leading, 30)
                .padding(.top, 50)
                Spacer()
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
            // Reset if mostly vertical
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
        let screenWidth = UIScreen.main.bounds.width

        withAnimation(.easeOut(duration: 0.3)) {
            offset = CGSize(
                width: direction == .right ? screenWidth + 100 : -screenWidth - 100,
                height: offset.height
            )
            rotation = direction == .right ? 20 : -20
            opacity = 0
        }

        // Notify parent after animation
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            onSwipe(direction)
        }
    }

    private func resetCard() {
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
            title: "Studio Lumineux Centre",
            description: "Beau studio rénové en plein centre",
            propertyType: .studio,
            address: "15 Rue de la Roquette",
            city: "Paris",
            neighborhood: "Bastille",
            postalCode: "75011",
            country: "France",
            latitude: 48.8566,
            longitude: 2.3522,
            bedrooms: 1,
            bathrooms: 1,
            totalRooms: 2,
            surfaceArea: 25,
            floorNumber: 3,
            totalFloors: 6,
            furnished: true,
            monthlyRent: 850,
            charges: 50,
            deposit: 1700,
            availableFrom: Date(),
            availableUntil: nil,
            minimumStayMonths: 3,
            maximumStayMonths: 12,
            isAvailable: true,
            amenities: [.wifi, .elevator],
            smokingAllowed: false,
            petsAllowed: false,
            couplesAllowed: true,
            childrenAllowed: false,
            images: [],
            mainImage: nil,
            status: .published,
            viewsCount: 45,
            applicationsCount: 3,
            favoritesCount: 12,
            rating: 4.5,
            reviewsCount: 8,
            createdAt: Date(),
            updatedAt: Date(),
            publishedAt: Date(),
            archivedAt: nil,
            compatibilityScore: 94,
            matchInsights: ["Quartier dynamique", "Proche transports"],
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
