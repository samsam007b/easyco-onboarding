//
//  PropertyCardCompact.swift
//  EasyCo
//
//  Compact property card for grid view
//

import SwiftUI

struct PropertyCardCompact: View {
    let property: Property
    var onTap: (() -> Void)? = nil
    var onFavoriteTap: (() -> Void)? = nil
    @State private var isFavorite: Bool = false

    var body: some View {
        Button(action: {
            Haptic.impact(.light)
            onTap?()
        }) {
            VStack(alignment: .leading, spacing: 0) {
                // Image
                ZStack(alignment: .topTrailing) {
                    AsyncImage(url: URL(string: property.images.first ?? "")) { image in
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
                    .frame(height: Theme.Size.cardImageHeightCompact)
                    .clipped()
                    .cornerRadius(Theme.CornerRadius.card, corners: [.topLeft, .topRight])

                    // Favorite icon
                    IconButton(
                        icon: isFavorite ? "heart" : "heart",
                        action: {
                            isFavorite.toggle()
                            Haptic.impact(.medium)
                            onFavoriteTap?()
                        },
                        size: 32,
                        iconSize: 16,
                        color: isFavorite ? Theme.Colors.heartRed : .white,
                        backgroundColor: isFavorite ? .white : Color.black.opacity(0.3),
                        hasShadow: true
                    )
                    .padding(8)

                    // New badge
                    if property.isNew {
                        VStack {
                            HStack {
                                Badge(text: "Nouveau", style: .new)
                                    .padding(8)
                                Spacer()
                            }
                            Spacer()
                        }
                    }
                }

                // Info
                VStack(alignment: .leading, spacing: 8) {
                    // Price
                    HStack(alignment: .firstTextBaseline, spacing: 4) {
                        Text("\(property.price)€")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(Theme.Colors.primary)

                        Text("/mois")
                            .font(Theme.Typography.caption())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }

                    // Title
                    Text(property.title)
                        .font(Theme.Typography.bodySmall(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                        .lineLimit(2)
                        .fixedSize(horizontal: false, vertical: true)

                    // Location
                    HStack(spacing: 4) {
                        Image.lucide("map-pin")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 12, height: 12)
                            .foregroundColor(Theme.Colors.textTertiary)

                        Text(property.locationString)
                            .font(.system(size: 12))
                            .foregroundColor(Theme.Colors.textSecondary)
                            .lineLimit(1)
                    }

                    // Features
                    HStack(spacing: 8) {
                        if property.bedrooms > 0 {
                            CompactFeature(icon: "bed", value: "\(property.bedrooms)")
                        }

                        if property.bathrooms > 0 {
                            CompactFeature(icon: "bath", value: "\(property.bathrooms)")
                        }

                        if let area = property.area {
                            CompactFeature(icon: "ruler", value: "\(area)m²")
                        }
                    }

                    // Match score
                    if let matchScore = property.matchScore, matchScore > 0 {
                        HStack(spacing: 4) {
                            Circle()
                                .fill(Theme.Colors.success)
                                .frame(width: 5, height: 5)

                            Text("\(matchScore)%")
                                .font(.system(size: 11, weight: .semibold))
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Theme.Colors.primaryGradient)
                        .cornerRadius(10)
                    }
                }
                .padding(12)
            }
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.card)
            .cardShadow()
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Compact Feature Helper

private struct CompactFeature: View {
    let icon: String
    let value: String

    var body: some View {
        HStack(spacing: 3) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 12, height: 12)
                .foregroundColor(Theme.Colors.textTertiary)

            Text(value)
                .font(.system(size: 11, weight: .medium))
                .foregroundColor(Theme.Colors.textSecondary)
        }
    }
}

// MARK: - Preview

struct PropertyCardCompact_Previews: PreviewProvider {
    static var previews: some View {
        LazyVGrid(columns: [
            GridItem(.flexible(), spacing: 16),
            GridItem(.flexible(), spacing: 16)
        ], spacing: 16) {
            ForEach(Property.mockProperties.prefix(4)) { property in
                PropertyCardCompact(property: property)
            }
        }
        .padding()
        .background(Theme.Colors.gray50)
    }
}
