import SwiftUI

// MARK: - Favorites View (Enhanced)

struct FavoritesView: View {
    @StateObject private var viewModel = FavoritesViewModel()
    @State private var selectedTab = 0

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Filter tabs
                if !viewModel.favorites.isEmpty {
                    filterTabs
                        .padding(.horizontal, 16)
                        .padding(.top, 16)
                }

                // Content
                Group {
                    if viewModel.isLoading {
                        LoadingView(message: "Chargement de vos favoris...")
                    } else if viewModel.filteredFavorites.isEmpty && viewModel.favorites.isEmpty {
                        emptyStateView
                    } else if viewModel.filteredFavorites.isEmpty {
                        emptyFilterView
                    } else {
                        favoritesList
                    }
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Mes Favoris")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                if !viewModel.favorites.isEmpty {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Menu {
                            Button(action: { viewModel.sortBy(.dateAdded) }) {
                                Label("Date d'ajout", systemImage: viewModel.sortOption == .dateAdded ? "checkmark" : "")
                            }
                            Button(action: { viewModel.sortBy(.price) }) {
                                Label("Prix", systemImage: viewModel.sortOption == .price ? "checkmark" : "")
                            }
                            Button(action: { viewModel.sortBy(.compatibility) }) {
                                Label("Compatibilité", systemImage: viewModel.sortOption == .compatibility ? "checkmark" : "")
                            }
                        } label: {
                            Image(systemName: "arrow.up.arrow.down")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "FFA040"))
                        }
                    }
                }
            }
        }
        .task {
            if viewModel.favorites.isEmpty {
                await viewModel.loadFavorites()
            }
        }
    }

    // MARK: - Filter Tabs

    private var filterTabs: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                FilterTab(
                    title: "Tous",
                    count: viewModel.favorites.count,
                    isSelected: selectedTab == 0,
                    action: {
                        selectedTab = 0
                        viewModel.filterByType(nil)
                    }
                )

                FilterTab(
                    title: "Colivings",
                    count: viewModel.countByType(.coliving),
                    isSelected: selectedTab == 1,
                    action: {
                        selectedTab = 1
                        viewModel.filterByType(.coliving)
                    }
                )

                FilterTab(
                    title: "Studios",
                    count: viewModel.countByType(.studio),
                    isSelected: selectedTab == 2,
                    action: {
                        selectedTab = 2
                        viewModel.filterByType(.studio)
                    }
                )

                FilterTab(
                    title: "Appartements",
                    count: viewModel.countByType(.apartment),
                    isSelected: selectedTab == 3,
                    action: {
                        selectedTab = 3
                        viewModel.filterByType(.apartment)
                    }
                )
            }
            .padding(.bottom, 12)
        }
    }

    // MARK: - Favorites List

    private var favoritesList: some View {
        ScrollView {
            LazyVGrid(
                columns: [
                    GridItem(.flexible(), spacing: 16),
                    GridItem(.flexible(), spacing: 16)
                ],
                spacing: 24
            ) {
                ForEach(viewModel.filteredFavorites) { property in
                    NavigationLink(destination: PropertyDetailView(property: property)) {
                        FavoritePropertyCard(
                            property: property,
                            onRemove: {
                                _Concurrency.Task {
                                    await viewModel.removeFavorite(property)
                                }
                            }
                        )
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
            .padding(16)
        }
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "FFA040").opacity(0.2), Color(hex: "FFB85C").opacity(0.1)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 120, height: 120)

                Image(systemName: "heart.slash")
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "FFA040"))
            }

            VStack(spacing: 12) {
                Text("Aucun favori")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Ajoutez des propriétés à vos favoris pour les retrouver facilement")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Empty Filter View

    private var emptyFilterView: some View {
        VStack(spacing: 16) {
            Spacer()

            Image(systemName: "magnifyingglass")
                .font(.system(size: 48))
                .foregroundColor(Color(hex: "D1D5DB"))

            Text("Aucun favori dans cette catégorie")
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(Color(hex: "6B7280"))

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - Filter Tab Component

struct FilterTab: View {
    let title: String
    let count: Int
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Text(title)
                    .font(.system(size: 14, weight: isSelected ? .semibold : .medium))

                Text("\(count)")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(isSelected ? .white : Color(hex: "6B7280"))
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(isSelected ? Color(hex: "FFA040") : Color(hex: "E5E7EB"))
                    .cornerRadius(999)
            }
            .foregroundColor(isSelected ? Color(hex: "FFA040") : Color(hex: "6B7280"))
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(isSelected ? Color(hex: "FFF4ED") : Color.white)
            .cornerRadius(999)
            .overlay(
                RoundedRectangle(cornerRadius: 999)
                    .stroke(isSelected ? Color(hex: "FFA040") : Color(hex: "E5E7EB"), lineWidth: 1)
            )
        }
    }
}

// MARK: - Favorite Property Card

struct FavoritePropertyCard: View {
    let property: Property
    let onRemove: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image with remove button
            ZStack(alignment: .topTrailing) {
                AsyncImage(url: URL(string: property.images.first ?? "")) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(height: 180)
                            .clipped()
                    case .failure(_), .empty:
                        Rectangle()
                            .fill(Color(hex: "E5E7EB"))
                            .frame(height: 180)
                            .overlay(
                                Image(systemName: "photo")
                                    .font(.system(size: 32))
                                    .foregroundColor(Color(hex: "9CA3AF"))
                            )
                    @unknown default:
                        EmptyView()
                    }
                }

                // Remove favorite button
                Button(action: onRemove) {
                    Image(systemName: "heart.fill")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "EF4444"))
                        .frame(width: 36, height: 36)
                        .background(Color.white)
                        .cornerRadius(18)
                        .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)
                }
                .padding(12)
            }
            .frame(height: 180)
            .cornerRadius(16, corners: [.topLeft, .topRight])

            // Content
            VStack(alignment: .leading, spacing: 12) {
                // Title
                Text(property.title)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))
                    .lineLimit(2)

                // Location
                HStack(spacing: 4) {
                    Image(systemName: "mappin")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))
                    Text(property.city)
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                        .lineLimit(1)
                }

                // Compatibility score if available
                if let score = property.compatibilityScore, score >= 80 {
                    HStack(spacing: 4) {
                        Image(systemName: "sparkles")
                            .font(.system(size: 10))
                            .foregroundColor(Color(hex: "FFA040"))
                        Text("\(score)% compatible")
                            .font(.system(size: 11, weight: .medium))
                            .foregroundColor(Color(hex: "374151"))
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color(hex: "FFF4ED"))
                    .cornerRadius(999)
                }

                Divider()

                // Price
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("€\(Int(property.monthlyRent))")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(Color(hex: "FFA040"))
                        Text("par mois")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "6B7280"))
                    }

                    Spacer()

                    // Type badge
                    Text(property.propertyType.displayName)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(Color(hex: "6B7280"))
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(hex: "F3F4F6"))
                        .cornerRadius(6)
                }
            }
            .padding(12)
        }
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.08), radius: 12, x: 0, y: 4)
    }
}

// MARK: - Favorites ViewModel

class FavoritesViewModel: ObservableObject {
    @Published var favorites: [Property] = []
    @Published var filteredFavorites: [Property] = []
    @Published var isLoading = false
    @Published var sortOption: FavoriteSortOption = .dateAdded

    private var selectedType: PropertyType?

    func loadFavorites() async {
        isLoading = true

        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
            favorites = Property.mockProperties.filter { $0.isFavorited == true }
            filteredFavorites = favorites
            applySorting()
        } else {
            do {
                favorites = try await APIClient.shared.getFavorites()
                filteredFavorites = favorites
                applySorting()
            } catch {
                print("Error loading favorites: \(error)")
            }
        }

        isLoading = false
    }

    func removeFavorite(_ property: Property) async {
        withAnimation {
            favorites.removeAll { $0.id == property.id }
            filteredFavorites.removeAll { $0.id == property.id }
        }

        if !AppConfig.FeatureFlags.demoMode {
            do {
                try await APIClient.shared.removeFavorite(propertyId: property.id.uuidString)
            } catch {
                print("Error removing favorite: \(error)")
                withAnimation {
                    favorites.append(property)
                    filterByType(selectedType)
                }
            }
        }
    }

    func filterByType(_ type: PropertyType?) {
        selectedType = type
        if let type = type {
            filteredFavorites = favorites.filter { $0.propertyType == type }
        } else {
            filteredFavorites = favorites
        }
        applySorting()
    }

    func countByType(_ type: PropertyType) -> Int {
        favorites.filter { $0.propertyType == type }.count
    }

    func sortBy(_ option: FavoriteSortOption) {
        sortOption = option
        applySorting()
    }

    private func applySorting() {
        switch sortOption {
        case .dateAdded:
            // Most recent first (by creation date)
            filteredFavorites.sort { prop1, prop2 in prop1.createdAt > prop2.createdAt }
        case .price:
            filteredFavorites.sort { prop1, prop2 in prop1.monthlyRent < prop2.monthlyRent }
        case .compatibility:
            filteredFavorites.sort { prop1, prop2 in (prop1.compatibilityScore ?? 0) > (prop2.compatibilityScore ?? 0) }
        }
    }
}

// MARK: - Sort Options

enum FavoriteSortOption {
    case dateAdded
    case price
    case compatibility
}

// MARK: - Preview

struct FavoritesView_Previews: PreviewProvider {
    static var previews: some View {
        FavoritesView()
    }
}
