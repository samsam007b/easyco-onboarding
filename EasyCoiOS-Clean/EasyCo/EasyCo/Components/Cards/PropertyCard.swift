//
//  PropertyCard.swift
//  EasyCo
//
//  Property card component for list view (inspired by Airbnb)
//

import SwiftUI

struct PropertyCard: View {
    let property: Property
    var onTap: (() -> Void)? = nil
    var onFavoriteTap: (() -> Void)? = nil
    @State private var isFavorite: Bool = false
    @State private var currentImageIndex = 0

    var body: some View {
        Button(action: {
            Haptic.impact(.light)
            onTap?()
        }) {
            VStack(alignment: .leading, spacing: 0) {
                // Image Carousel
                imageCarousel

                // Content
                VStack(alignment: .leading, spacing: 12) {
                    // Price & Badge
                    HStack(alignment: .top) {
                        Text("\(property.price)€")
                            .font(Theme.Typography.price())
                            .foregroundColor(Theme.Colors.primary)

                        Text("/mois")
                            .font(Theme.Typography.bodySmall())
                            .foregroundColor(Theme.Colors.textSecondary)
                            .padding(.top, 8)

                        Spacer()

                        if property.isNew {
                            Badge(text: "Nouveau", style: .new)
                        }

                        if property.isVerified {
                            Badge(text: "Vérifié", style: .verified, icon: "check")
                        }
                    }

                    // Title
                    Text(property.title)
                        .font(Theme.Typography.bodyLarge(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                        .lineLimit(2)

                    // Location
                    HStack(spacing: 6) {
                        Image.lucide("map-pin")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 14, height: 14)
                            .foregroundColor(Theme.Colors.textTertiary)

                        Text(property.location)
                            .font(Theme.Typography.bodySmall())
                            .foregroundColor(Theme.Colors.textSecondary)
                            .lineLimit(1)

                        if let distance = property.distance {
                            Text("• \(distance)km")
                                .font(Theme.Typography.bodySmall())
                                .foregroundColor(Theme.Colors.textTertiary)
                        }
                    }

                    // Features
                    HStack(spacing: 16) {
                        if property.bedrooms > 0 {
                            FeatureIcon(icon: "bed", value: "\(property.bedrooms)")
                        }

                        if property.bathrooms > 0 {
                            FeatureIcon(icon: "bath", value: "\(property.bathrooms)")
                        }

                        if let area = property.area {
                            FeatureIcon(icon: "ruler", value: "\(area)m²")
                        }
                    }

                    // Match Score
                    if let matchScore = property.matchScore, matchScore > 0 {
                        HStack(spacing: 6) {
                            Circle()
                                .fill(Theme.Colors.success)
                                .frame(width: 6, height: 6)

                            Text("\(matchScore)% Compatible")
                                .font(Theme.Typography.badge())
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Theme.Colors.primaryGradient)
                        .cornerRadius(12)
                    }

                    // Availability
                    if let availableFrom = property.availableFrom {
                        HStack(spacing: 6) {
                            Image.lucide("calendar")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 14, height: 14)
                                .foregroundColor(Theme.Colors.textTertiary)

                            Text("Disponible dès le \(availableFrom)")
                                .font(Theme.Typography.bodySmall())
                                .foregroundColor(Theme.Colors.textSecondary)
                        }
                    }
                }
                .padding(Theme.Spacing.lg)
            }
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.card)
            .cardShadow()
        }
        .buttonStyle(PlainButtonStyle())
    }

    // MARK: - Image Carousel

    private var imageCarousel: some View {
        ZStack(alignment: .topTrailing) {
            TabView(selection: $currentImageIndex) {
                ForEach(Array(property.images.enumerated()), id: \.offset) { index, imageURL in
                    AsyncImage(url: URL(string: imageURL)) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Rectangle()
                            .fill(Theme.Colors.gray200)
                            .overlay(
                                ProgressView()
                            )
                    }
                    .tag(index)
                }
            }
            .tabViewStyle(.page(indexDisplayMode: .always))
            .indexViewStyle(.page(backgroundDisplayMode: .always))
            .frame(height: Theme.Size.cardImageHeight)
            .cornerRadius(Theme.CornerRadius.card, corners: [.topLeft, .topRight])

            // Favorite button
            IconButton(
                icon: isFavorite ? "heart" : "heart",
                action: {
                    isFavorite.toggle()
                    Haptic.impact(.medium)
                    onFavoriteTap?()
                },
                size: 40,
                iconSize: 20,
                color: isFavorite ? Theme.Colors.heartRed : .white,
                backgroundColor: isFavorite ? .white : Color.black.opacity(0.3),
                hasShadow: true
            )
            .padding(12)
        }
    }
}

// MARK: - Feature Icon Helper

private struct FeatureIcon: View {
    let icon: String
    let value: String

    var body: some View {
        HStack(spacing: 4) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 16, height: 16)
                .foregroundColor(Theme.Colors.textSecondary)

            Text(value)
                .font(Theme.Typography.bodySmall(.medium))
                .foregroundColor(Theme.Colors.textSecondary)
        }
    }
}

// MARK: - Corner Radius Extension

// extension View {
//     func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
//         clipShape(RoundedCorner(radius: radius, corners: corners))
//     }
// }

// MARK: - Mock Data

// extension Property {
//     static let mock = Property(
//         id: UUID().uuidString,
//         title: "Appartement moderne 2 chambres",
//         location: "Bruxelles, Ixelles",
//         price: 850,
//         bedrooms: 2,
//         bathrooms: 1,
//         area: 75,
//         images: [
//             "https://via.placeholder.com/400x300",
//             "https://via.placeholder.com/400x300/FF6347",
//             "https://via.placeholder.com/400x300/4682B4"
//         ],
//         isNew: true,
//         isVerified: true,
//         matchScore: 85,
//         distance: 2.3,
//         availableFrom: "15 mars"
//     )
// }

// MARK: - Preview

struct PropertyCard_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 20) {
                PropertyCard(property: .mock)

                PropertyCard(property: Property(
                    id: "2",
                    title: "Studio cosy centre-ville avec balcon",
                    location: "Bruxelles, Louise",
                    price: 650,
                    bedrooms: 1,
                    bathrooms: 1,
                    area: 35,
                    images: ["https://via.placeholder.com/400x300/90EE90"],
                    isNew: false,
                    isVerified: true,
                    matchScore: 92,
                    distance: 0.8,
                    availableFrom: "1er avril"
                ))
            }
            .padding()
        }
        .background(Theme.Colors.gray50)
    }
}
