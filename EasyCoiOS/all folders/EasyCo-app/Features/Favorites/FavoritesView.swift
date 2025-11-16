import SwiftUI

// MARK: - Favorites View

struct FavoritesView: View {
    @State private var favorites: [Property] = []
    @State private var isLoading = false

    var body: some View {
        NavigationStack {
            Group {
                if isLoading {
                    LoadingView(message: "Chargement...")
                } else if favorites.isEmpty {
                    EmptyStateView.noFavorites()
                } else {
                    favoritesList
                }
            }
            .navigationTitle("Favoris")
        }
        .task {
            await loadFavorites()
        }
    }

    private var favoritesList: some View {
        ScrollView {
            LazyVStack(spacing: Theme.Spacing.md) {
                ForEach(favorites) { property in
                    NavigationLink(destination: PropertyDetailView(property: property)) {
                        PropertyCardView(property: property) {
                            Task {
                                await removeFavorite(property)
                            }
                        }
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
            .padding(.vertical)
        }
    }

    private func loadFavorites() async {
        isLoading = true

        do {
            favorites = try await APIClient.shared.getFavorites()
        } catch {
            print("Error loading favorites: \(error)")
        }

        isLoading = false
    }

    private func removeFavorite(_ property: Property) async {
        do {
            try await APIClient.shared.removeFavorite(propertyId: property.id)
            favorites.removeAll { $0.id == property.id }
        } catch {
            print("Error removing favorite: \(error)")
        }
    }
}

#Preview {
    FavoritesView()
}
