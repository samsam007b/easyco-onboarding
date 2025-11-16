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
                    ForEach(property.imageUrls, id: \.self) { imageUrl in
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

                        Text(property.priceDescription)
                            .font(Theme.Typography.title2(.bold))
                            .foregroundColor(Theme.Colors.primary)
                    }

                    // Location
                    HStack(spacing: Theme.Spacing.xs) {
                        Image(systemName: "mappin.circle.fill")
                        Text(property.address.fullAddress)
                            .font(Theme.Typography.body())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }

                    Divider()

                    // Details
                    HStack(spacing: Theme.Spacing.xl) {
                        DetailItem(icon: "bed.double.fill", label: "Chambres", value: "\(property.bedrooms)")
                        DetailItem(icon: "shower.fill", label: "Salles de bain", value: "\(property.bathrooms)")
                        if let surface = property.surfaceArea {
                            DetailItem(icon: "square.fill", label: "Surface", value: "\(surface)m²")
                        }
                    }

                    Divider()

                    // Description
                    VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                        Text("Description")
                            .font(Theme.Typography.title3())
                            .foregroundColor(Theme.Colors.textPrimary)

                        Text(property.description)
                            .font(Theme.Typography.body())
                            .foregroundColor(Theme.Colors.textSecondary)
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

                    // House Rules
                    if !property.houseRules.isEmpty {
                        Divider()

                        VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                            Text("Règles de la maison")
                                .font(Theme.Typography.title3())
                                .foregroundColor(Theme.Colors.textPrimary)

                            ForEach(property.houseRules, id: \.self) { rule in
                                HStack(spacing: Theme.Spacing.xs) {
                                    Image(systemName: "checkmark.circle.fill")
                                        .foregroundColor(Theme.Colors.success)
                                    Text(rule.displayName)
                                        .font(Theme.Typography.bodySmall())
                                        .foregroundColor(Theme.Colors.textSecondary)
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

// MARK: - Preview

#Preview {
    NavigationStack {
        PropertyDetailView(property: .mock)
    }
}
