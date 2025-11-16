import SwiftUI

// MARK: - Property Card View

struct PropertyCardView: View {
    let property: Property
    var onFavorite: (() -> Void)?

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image
            AsyncImage(url: URL(string: property.primaryImageUrl ?? "")) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Rectangle()
                    .fill(Theme.Colors.backgroundSecondary)
                    .overlay {
                        Image(systemName: "photo")
                            .font(.largeTitle)
                            .foregroundColor(Theme.Colors.textTertiary)
                    }
            }
            .frame(height: 200)
            .clipped()
            .overlay(alignment: .topTrailing) {
                // Favorite Button
                Button {
                    onFavorite?()
                } label: {
                    Image(systemName: "heart.fill")
                        .foregroundColor(.white)
                        .padding(Theme.Spacing.sm)
                        .background(Circle().fill(Color.black.opacity(0.5)))
                }
                .padding(Theme.Spacing.sm)
            }
            .overlay(alignment: .bottomLeading) {
                // Status Badge
                Text(property.status.displayName)
                    .font(Theme.Typography.captionSmall(.semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, Theme.Spacing.sm)
                    .padding(.vertical, Theme.Spacing.xs)
                    .background(Capsule().fill(Color(hex: property.status.color)))
                    .padding(Theme.Spacing.sm)
            }

            // Content
            VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                // Title
                Text(property.title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .lineLimit(2)

                // Location
                HStack(spacing: Theme.Spacing.xs) {
                    Image(systemName: "mappin.circle.fill")
                        .font(.caption)
                        .foregroundColor(Theme.Colors.textSecondary)

                    Text(property.address.shortAddress)
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textSecondary)
                }

                // Details
                HStack(spacing: Theme.Spacing.md) {
                    DetailTag(icon: "bed.double.fill", text: "\(property.bedrooms)")
                    DetailTag(icon: "shower.fill", text: "\(property.bathrooms)")
                    if let surface = property.surfaceArea {
                        DetailTag(icon: "square.fill", text: "\(surface)m²")
                    }
                }

                // Price
                Text(property.priceDescription)
                    .font(Theme.Typography.title3(.bold))
                    .foregroundColor(Theme.Colors.primary)
            }
            .padding(Theme.Spacing.md)
        }
        .background(Theme.Colors.background)
        .cornerRadius(Theme.CornerRadius.md)
        .themeShadow()
        .padding(.horizontal)
    }
}

// MARK: - Detail Tag

struct DetailTag: View {
    let icon: String
    let text: String

    var body: some View {
        HStack(spacing: Theme.Spacing.xs) {
            Image(systemName: icon)
                .font(.caption)
            Text(text)
                .font(Theme.Typography.caption())
        }
        .foregroundColor(Theme.Colors.textSecondary)
    }
}

// MARK: - Preview

#Preview {
    PropertyCardView(property: .mock)
        .padding()
}
