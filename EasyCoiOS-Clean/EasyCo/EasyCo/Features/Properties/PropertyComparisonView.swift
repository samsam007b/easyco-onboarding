//
//  PropertyComparisonView.swift
//  EasyCo
//
//  Created by Claude on 11/18/2025.
//

import SwiftUI

// MARK: - Property Comparison View

struct PropertyComparisonView: View {
    @StateObject private var comparisonManager = PropertyComparisonManager.shared
    @Environment(\.dismiss) private var dismiss
    @State private var selectedFeatures: Set<ComparisonFeature> = Set(ComparisonFeature.allCases)

    var body: some View {
        NavigationStack {
            Group {
                if comparisonManager.comparedProperties.isEmpty {
                    emptyStateView
                } else {
                    comparisonContent
                }
            }
            .navigationTitle("Compare Properties")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Close") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Menu {
                        Button(role: .destructive) {
                            comparisonManager.clearAll()
                        } label: {
                            Label("Clear All", systemImage: "trash")
                        }

                        Divider()

                        Menu("Select Features") {
                            ForEach(ComparisonFeature.allCases, id: \.self) { feature in
                                Button {
                                    toggleFeature(feature)
                                } label: {
                                    Label(
                                        feature.rawValue,
                                        systemImage: selectedFeatures.contains(feature) ? "checkmark.circle.fill" : "circle"
                                    )
                                }
                            }
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                    }
                }
            }
        }
    }

    // MARK: - Comparison Content

    private var comparisonContent: some View {
        ScrollView {
            VStack(spacing: 0) {
                // Property headers with images
                propertyHeadersSection

                // Comparison rows
                ForEach(Array(selectedFeatures.sorted(by: { $0.rawValue < $1.rawValue })), id: \.self) { feature in
                    ComparisonRow(
                        feature: feature,
                        properties: comparisonManager.comparedProperties
                    )
                    Divider()
                }

                // Action buttons
                actionButtonsSection
            }
        }
    }

    // MARK: - Property Headers

    private var propertyHeadersSection: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(comparisonManager.comparedProperties) { property in
                    PropertyHeaderCard(
                        property: property,
                        onRemove: {
                            comparisonManager.removeFromComparison(property)
                        }
                    )
                }
            }
            .padding()
        }
        .background(Color(.systemGroupedBackground))
    }

    // MARK: - Action Buttons

    private var actionButtonsSection: some View {
        VStack(spacing: 12) {
            if let winner = determineOverallWinner() {
                VStack(spacing: 8) {
                    Text("Best Overall Match")
                        .font(.headline)
                        .foregroundColor(.secondary)

                    Text(winner.title)
                        .font(.title3)
                        .fontWeight(.bold)
                        .foregroundColor(Theme.Colors.primary)

                    Text("Based on \(selectedFeatures.count) features")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding()
                .frame(maxWidth: .infinity)
                .background(Theme.Colors.primary.opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 12))
            }

            HStack(spacing: 12) {
                ForEach(comparisonManager.comparedProperties) { property in
                    Button {
                        // TODO: Navigate to property detail
                        print("📍 View details: \(property.title)")
                    } label: {
                        VStack(spacing: 4) {
                            Image(systemName: "arrow.right.circle.fill")
                                .font(.title2)

                            Text("View")
                                .font(.caption)
                                .fontWeight(.medium)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Theme.Colors.primary)
                        .foregroundColor(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                }
            }
        }
        .padding()
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 20) {
            Image(systemName: "square.stack.3d.up")
                .font(.system(size: 60))
                .foregroundColor(.secondary)

            VStack(spacing: 8) {
                Text("No Properties to Compare")
                    .font(.title3)
                    .fontWeight(.semibold)

                Text("Add properties from the search results to compare them side by side")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
            }

            Button {
                dismiss()
            } label: {
                Label("Browse Properties", systemImage: "house.fill")
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
                    .background(Theme.Colors.primary)
                    .foregroundColor(.white)
                    .clipShape(Capsule())
            }
        }
        .padding()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Helpers

    private func toggleFeature(_ feature: ComparisonFeature) {
        if selectedFeatures.contains(feature) {
            selectedFeatures.remove(feature)
        } else {
            selectedFeatures.insert(feature)
        }
    }

    private func determineOverallWinner() -> Property? {
        guard comparisonManager.comparedProperties.count >= 2 else { return nil }

        var scores: [UUID: Int] = [:]
        for property in comparisonManager.comparedProperties {
            scores[property.id] = 0
        }

        for feature in selectedFeatures {
            if let winnerIndex = feature.compareProperties(comparisonManager.comparedProperties) {
                let winnerId = comparisonManager.comparedProperties[winnerIndex].id
                scores[winnerId, default: 0] += 1
            }
        }

        guard let winnerId = scores.max(by: { $0.value < $1.value })?.key else {
            return nil
        }

        return comparisonManager.comparedProperties.first { $0.id == winnerId }
    }
}

// MARK: - Property Header Card

struct PropertyHeaderCard: View {
    let property: Property
    let onRemove: () -> Void

    var body: some View {
        VStack(spacing: 8) {
            ZStack(alignment: .topTrailing) {
                // Property image
                if let imageUrl = property.images.first {
                    AsyncImage(url: URL(string: imageUrl)) { phase in
                        switch phase {
                        case .success(let image):
                            image
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        case .failure:
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

                // Remove button
                Button(action: onRemove) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.title3)
                        .foregroundColor(.white)
                        .background(Circle().fill(Color.black.opacity(0.5)))
                }
                .padding(8)
            }
            .frame(width: 200, height: 150)
            .clipShape(RoundedRectangle(cornerRadius: 12))

            // Property info
            VStack(alignment: .leading, spacing: 4) {
                Text(property.title)
                    .font(.headline)
                    .lineLimit(2)

                HStack {
                    Image(systemName: "location.fill")
                        .font(.caption)
                    Text(property.city)
                        .font(.caption)
                }
                .foregroundColor(.secondary)

                Text("€\(Int(property.price))/mo")
                    .font(.subheadline)
                    .fontWeight(.bold)
                    .foregroundColor(Theme.Colors.primary)
            }
            .frame(width: 200, alignment: .leading)
        }
    }

    private var placeholderImage: some View {
        Rectangle()
            .fill(Color(.systemGray5))
            .overlay(
                Image(systemName: "house.fill")
                    .font(.largeTitle)
                    .foregroundColor(.secondary)
            )
    }
}

// MARK: - Comparison Row

struct ComparisonRow: View {
    let feature: ComparisonFeature
    let properties: [Property]

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Feature header
            HStack {
                Image(systemName: feature.icon)
                    .foregroundColor(Theme.Colors.primary)

                VStack(alignment: .leading, spacing: 2) {
                    Text(feature.rawValue)
                        .font(.subheadline)
                        .fontWeight(.semibold)

                    Text(feature.description)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Spacer()
            }
            .padding(.horizontal)
            .padding(.top, 12)

            // Values
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(Array(properties.enumerated()), id: \.element.id) { index, property in
                        ComparisonValueCard(
                            value: feature == .amenities ? nil : feature.value(for: property),
                            amenities: feature == .amenities ? feature.amenitiesList(for: property) : nil,
                            isWinner: feature.compareProperties(properties) == index
                        )
                    }
                }
                .padding(.horizontal)
            }
            .padding(.bottom, 12)
        }
    }
}

// MARK: - Comparison Value Card

struct ComparisonValueCard: View {
    let value: String?
    let amenities: [String]?
    let isWinner: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if let value = value {
                HStack {
                    Text(value)
                        .font(.body)
                        .fontWeight(isWinner ? .bold : .regular)
                        .foregroundColor(isWinner ? Theme.Colors.primary : .primary)

                    if isWinner {
                        Image(systemName: "crown.fill")
                            .font(.caption)
                            .foregroundColor(.orange)
                    }
                }
            }

            if let amenities = amenities {
                VStack(alignment: .leading, spacing: 4) {
                    ForEach(amenities.prefix(5), id: \.self) { amenity in
                        HStack(spacing: 4) {
                            Image(systemName: "checkmark.circle.fill")
                                .font(.caption2)
                                .foregroundColor(.green)

                            Text(amenity)
                                .font(.caption)
                        }
                    }

                    if amenities.count > 5 {
                        Text("+ \(amenities.count - 5) more")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }
            }
        }
        .frame(width: 200, alignment: .leading)
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(isWinner ? Theme.Colors.primary.opacity(0.1) : Color(.systemBackground))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(isWinner ? Theme.Colors.primary : Color(.systemGray5), lineWidth: isWinner ? 2 : 1)
        )
    }
}

// MARK: - Comparison Button (for Property Cards)

struct ComparisonButton: View {
    let property: Property
    @StateObject private var comparisonManager = PropertyComparisonManager.shared

    var body: some View {
        Button {
            comparisonManager.toggleComparison(property)
        } label: {
            Image(systemName: isInComparison ? "checkmark.square.fill" : "square.on.square")
                .font(.title3)
                .foregroundColor(isInComparison ? Theme.Colors.primary : .secondary)
        }
    }

    private var isInComparison: Bool {
        comparisonManager.isInComparison(property)
    }
}

// MARK: - Comparison Badge

struct ComparisonBadge: View {
    @StateObject private var comparisonManager = PropertyComparisonManager.shared

    var body: some View {
        if comparisonManager.count > 0 {
            Button {
                // This will be handled by the parent view
            } label: {
                HStack(spacing: 8) {
                    Image(systemName: "square.stack.3d.up.fill")
                        .font(.body)

                    Text("\(comparisonManager.count)")
                        .font(.headline)

                    Text("Compare")
                        .font(.subheadline)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(Theme.Colors.primary)
                .foregroundColor(.white)
                .clipShape(Capsule())
                .shadow(color: .black.opacity(0.2), radius: 8, y: 4)
            }
        }
    }
}

// MARK: - Preview

#Preview {
    PropertyComparisonView()
}
