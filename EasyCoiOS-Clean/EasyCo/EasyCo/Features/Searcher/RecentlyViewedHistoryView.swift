//
//  RecentlyViewedHistoryView.swift
//  EasyCo
//
//  Full history of recently viewed properties
//

import SwiftUI

struct RecentlyViewedHistoryView: View {
    @StateObject private var viewModel = RecentlyViewedViewModel()

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                if viewModel.isLoading {
                    ProgressView()
                        .padding(.top, 40)
                } else if viewModel.properties.isEmpty {
                    emptyState
                } else {
                    propertyList
                }
            }
            .padding()
        }
        .background(Theme.Colors.backgroundSecondary)
        .navigationTitle("Historique")
        .navigationBarTitleDisplayMode(.inline)
        .task {
            await viewModel.loadHistory()
        }
    }

    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "clock")
                .font(.system(size: 48))
                .foregroundColor(Theme.Colors.textTertiary)

            Text("Aucune propriété consultée")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            Text("Les propriétés que vous consultez apparaîtront ici")
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textSecondary)
                .multilineTextAlignment(.center)
        }
        .padding(.top, 60)
    }

    private var propertyList: some View {
        VStack(spacing: 12) {
            ForEach(viewModel.properties) { property in
                NavigationLink(destination: PropertyDetailView(property: property)) {
                    PropertyListCard(property: property)
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
    }
}

// MARK: - Property List Card

private struct PropertyListCard: View {
    let property: Property

    var body: some View {
        HStack(spacing: 16) {
            // Property image
            if let imageUrl = property.mainImageURL, let url = URL(string: imageUrl) {
                AsyncImage(url: url) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Rectangle()
                        .fill(Theme.Colors.Searcher._100)
                        .overlay(
                            Image(systemName: "building.2.fill")
                                .foregroundColor(Theme.Colors.Searcher.primary.opacity(0.3))
                        )
                }
                .frame(width: 100, height: 80)
                .clipped()
                .cornerRadius(12)
            } else {
                Rectangle()
                    .fill(Theme.Colors.Searcher._100)
                    .frame(width: 100, height: 80)
                    .cornerRadius(12)
                    .overlay(
                        Image(systemName: "building.2.fill")
                            .foregroundColor(Theme.Colors.Searcher.primary.opacity(0.3))
                    )
            }

            // Property info
            VStack(alignment: .leading, spacing: 6) {
                Text(property.title)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .lineLimit(2)

                HStack(spacing: 4) {
                    Image(systemName: "mappin")
                        .font(.system(size: 12))
                    Text(property.city)
                        .font(Theme.Typography.bodySmall())
                }
                .foregroundColor(Theme.Colors.textSecondary)

                Text("\(property.monthlyRent)€/mois")
                    .font(Theme.Typography.body(.bold))
                    .foregroundColor(Theme.Colors.Searcher.primary)
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.system(size: 14))
                .foregroundColor(Theme.Colors.textTertiary)
        }
        .padding(16)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }
}

// MARK: - View Model

@MainActor
class RecentlyViewedViewModel: ObservableObject {
    @Published var properties: [Property] = []
    @Published var isLoading = false

    private let analyticsService = AnalyticsService.shared

    func loadHistory() async {
        isLoading = true
        defer { isLoading = false }

        do {
            properties = try await analyticsService.getRecentlyViewedProperties()
        } catch {
            // Demo mode fallback
            if AppConfig.FeatureFlags.demoMode {
                properties = Property.mockProperties
            }
        }
    }
}

// MARK: - Preview

struct RecentlyViewedHistoryView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            RecentlyViewedHistoryView()
        }
    }
}
