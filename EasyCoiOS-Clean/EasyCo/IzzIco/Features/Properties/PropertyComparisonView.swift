//
//  PropertyComparisonView.swift
//  IzzIco
//

import SwiftUI

struct PropertyComparisonView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var comparisonManager = PropertyComparisonManager.shared

    var body: some View {
        NavigationStack {
            Group {
                if comparisonManager.selectedProperties.isEmpty {
                    emptyStateView
                } else {
                    propertiesListView
                }
            }
            .navigationTitle("Comparaison")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Fermer") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(role: .destructive) {
                        comparisonManager.clear()
                    } label: {
                        Image(systemName: "trash")
                    }
                }
            }
        }
    }

    private var emptyStateView: some View {
        VStack(spacing: 20) {
            Image(systemName: "scale.3d")
                .font(.system(size: 60))
                .foregroundColor(.gray)

            Text("Aucune propriété à comparer")
                .font(.title2)
                .fontWeight(.semibold)

            Text("Ajoutez des propriétés pour les comparer")
                .font(.body)
                .foregroundColor(.secondary)
        }
        .padding()
    }

    private var propertiesListView: some View {
        ScrollView {
            VStack(spacing: 16) {
                ForEach(comparisonManager.selectedProperties) { property in
                    PropertyComparisonCard(property: property) {
                        comparisonManager.toggleProperty(property)
                    }
                }
            }
            .padding()
        }
    }
}

struct PropertyComparisonCard: View {
    let property: Property
    let onRemove: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text(property.title)
                    .font(.headline)

                Spacer()

                Button(action: onRemove) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.red)
                }
            }

            Text(property.city)
                .font(.subheadline)
                .foregroundColor(.secondary)

            HStack {
                Text("\(property.monthlyRent)€/mois")
                    .font(.title3)
                    .fontWeight(.semibold)

                Spacer()

                Text("\(property.bedrooms) ch.")
                Text("\(property.surfaceArea ?? 0)m²")
            }
            .font(.caption)
            .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 2)
    }
}

// Comparison button for property cards
struct ComparisonButton: View {
    let property: Property
    @StateObject private var comparisonManager = PropertyComparisonManager.shared

    var body: some View {
        Button {
            comparisonManager.toggleProperty(property)
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

#Preview {
    PropertyComparisonView()
}
