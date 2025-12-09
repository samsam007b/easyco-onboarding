import SwiftUI

// MARK: - Property Detail View

struct PropertyDetailView: View {
    let property: Property
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Theme.Spacing.lg) {
                // Image Gallery
                TabView {
                    ForEach(property.images, id: \.self) { imageUrl in
                        AsyncImage(url: URL(string: imageUrl)) { image in
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } placeholder: {
                            Rectangle()
                                .fill(Theme.Colors.backgroundSecondary)
                        }
                    }
                }
                .frame(height: 300)
                .tabViewStyle(.page)

                VStack(alignment: .leading, spacing: Theme.Spacing.lg) {
                    // Title & Price
                    VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                        Text(property.title)
                            .font(Theme.Typography.title1())
                            .foregroundColor(Theme.Colors.textPrimary)

                        Text("\(Int(property.monthlyRent))€/mois")
                            .font(Theme.Typography.title2(.bold))
                            .foregroundColor(Theme.Colors.primary)
                    }

                    // Location
                    HStack(spacing: Theme.Spacing.xs) {
                        Image(systemName: "mappin.circle.fill")
                        Text("\(property.address), \(property.city)")
                            .font(Theme.Typography.body())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }

                    Divider()

                    // Details
                    HStack(spacing: Theme.Spacing.xl) {
                        DetailItem(icon: "bed.double.fill", label: "Chambres", value: "\(property.bedrooms)")
                        DetailItem(icon: "shower.fill", label: "Salles de bain", value: "\(property.bathrooms)")
                        if let area = property.surfaceArea {
                            DetailItem(icon: "square.fill", label: "Surface", value: "\(Int(area))m²")
                        }
                    }

                    Divider()

                    // Description
                    if let description = property.description {
                        VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                            Text("Description")
                                .font(Theme.Typography.title3())
                                .foregroundColor(Theme.Colors.textPrimary)

                            Text(description)
                                .font(Theme.Typography.body())
                                .foregroundColor(Theme.Colors.textSecondary)
                        }
                    }

                    // Amenities
                    if !property.amenities.isEmpty {
                        Divider()

                        VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                            Text("Équipements")
                                .font(Theme.Typography.title3())
                                .foregroundColor(Theme.Colors.textPrimary)

                            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: Theme.Spacing.sm) {
                                ForEach(property.amenities, id: \.self) { amenity in
                                    HStack(spacing: Theme.Spacing.xs) {
                                        Image(systemName: amenity.icon)
                                            .foregroundColor(Theme.Colors.primary)
                                        Text(amenity.displayName)
                                            .font(Theme.Typography.bodySmall())
                                            .foregroundColor(Theme.Colors.textSecondary)
                                        Spacer()
                                    }
                                }
                            }
                        }
                    }
                }
                .padding()
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button {
                    // Share
                } label: {
                    Image(systemName: "square.and.arrow.up")
                }
            }
        }
        .safeAreaInset(edge: .bottom) {
            // Contact Button
            CustomButton("Contacter", icon: "message.fill", style: .primary) {
                // Navigate to messages
            }
            .padding()
            .background(Theme.Colors.background)
        }
    }
}

struct DetailItem: View {
    let icon: String
    let label: String
    let value: String

    var body: some View {
        VStack(spacing: Theme.Spacing.xs) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(Theme.Colors.primary)

            Text(value)
                .font(Theme.Typography.body(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            Text(label)
                .font(Theme.Typography.caption())
                .foregroundColor(Theme.Colors.textSecondary)
        }
    }
}

struct PropertyDetailView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            PropertyDetailView(
                property: Property(
                    id: UUID(),
                    ownerID: UUID(),
                    title: "Bel appartement",
                    description: "Description du bien",
                    propertyType: .apartment,
                    address: "10 rue de la Paix",
                    city: "Paris",
                    neighborhood: "Le Marais",
                    postalCode: "75001",
                    country: "France",
                    latitude: 48.8566,
                    longitude: 2.3522,
                    bedrooms: 2,
                    bathrooms: 1,
                    totalRooms: 4,
                    surfaceArea: 60,
                    floorNumber: 3,
                    totalFloors: 5,
                    furnished: true,
                    monthlyRent: 1200,
                    charges: 100,
                    deposit: 2400,
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
                    applicationsCount: 8,
                    favoritesCount: 12,
                    rating: 4.5,
                    reviewsCount: 6,
                    createdAt: Date(),
                    updatedAt: Date(),
                    publishedAt: Date(),
                    archivedAt: nil,
                    compatibilityScore: 85,
                    matchInsights: ["Quartier animé", "Proche transports"],
                    isFavorited: false,
                    residents: nil
                )
            )
        }
    }
}
