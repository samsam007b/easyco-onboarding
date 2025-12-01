import SwiftUI

// MARK: - Favorites View (Searcher Design)

struct FavoritesView: View {
    @StateObject private var viewModel = FavoritesViewModel()
    @State private var sortOption: SortOption = .dateAdded
    @State private var showSortSheet = false

    enum SortOption: String, CaseIterable {
        case dateAdded = "Date d'ajout"
        case priceAsc = "Prix croissant"
        case priceDesc = "Prix décroissant"
        case matchScore = "Score de match"

        var icon: String {
            switch self {
            case .dateAdded: return "clock"
            case .priceAsc: return "arrow.up"
            case .priceDesc: return "arrow.down"
            case .matchScore: return "sparkles"
            }
        }
    }

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    loadingView
                } else if viewModel.favorites.isEmpty {
                    emptyStateView
                } else {
                    favoritesList
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

                ToolbarItem(placement: .topBarTrailing) {
                    if !viewModel.favorites.isEmpty {
                        Button(action: { showSortSheet = true }) {
                            Image(systemName: "arrow.up.arrow.down")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(Color(hex: "FFA040"))
                        }
                    }
                }
            }
            .sheet(isPresented: $showSortSheet) {
                sortOptionsSheet
            }
        }
        .task {
            await viewModel.loadFavorites()
        }
    }

    // MARK: - Loading View

    private var loadingView: some View {
        VStack(spacing: 16) {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: Color(hex: "FFA040")))
                .scaleEffect(1.5)

            Text("Chargement de vos favoris...")
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(hex: "F9FAFB"))
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Spacer()

            // Icon with gradient
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

                Image(systemName: "heart")
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "FFA040"))
            }

            // Text
            VStack(spacing: 12) {
                Text("Aucun favori")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Explorez les propriétés et ajoutez celles qui vous plaisent à vos favoris")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            // CTA Button
            NavigationLink(destination: PropertiesListView()) {
                HStack(spacing: 8) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 16, weight: .semibold))
                    Text("Explorer les propriétés")
                        .font(.system(size: 16, weight: .semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: 280)
                .padding(.vertical, 16)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(999)
                .shadow(color: Color(hex: "FFA040").opacity(0.3), radius: 8, x: 0, y: 4)
            }
            .padding(.top, 8)

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(hex: "F9FAFB"))
    }

    // MARK: - Favorites List

    private var favoritesList: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Stats header
                statsHeader

                // Properties grid
                LazyVStack(spacing: 16) {
                    ForEach(sortedFavorites) { property in
                        NavigationLink(destination: PropertyDetailView(property: property)) {
                            FavoritePropertyCard(
                                property: property,
                                onRemove: {
                                    Task {
                                        await viewModel.removeFavorite(property)
                                    }
                                }
                            )
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
            }
            .padding(16)
        }
    }

    // MARK: - Stats Header

    private var statsHeader: some View {
        HStack(spacing: 16) {
            // Favorites count
            VStack(alignment: .leading, spacing: 4) {
                Text("\(viewModel.favorites.count)")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(Color(hex: "FFA040"))
                Text("Favoris")
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(16)
            .background(Color.white)
            .cornerRadius(12)

            // Average price
            VStack(alignment: .leading, spacing: 4) {
                Text("€\(Int(averagePrice))")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))
                Text("Prix moyen")
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(16)
            .background(Color.white)
            .cornerRadius(12)
        }
    }

    private var averagePrice: Double {
        guard !viewModel.favorites.isEmpty else { return 0 }
        let total = viewModel.favorites.reduce(0) { $0 + $1.monthlyRent }
        return total / Double(viewModel.favorites.count)
    }

    private var sortedFavorites: [Property] {
        switch sortOption {
        case .dateAdded:
            return viewModel.favorites
        case .priceAsc:
            return viewModel.favorites.sorted { $0.monthlyRent < $1.monthlyRent }
        case .priceDesc:
            return viewModel.favorites.sorted { $0.monthlyRent > $1.monthlyRent }
        case .matchScore:
            return viewModel.favorites.sorted { ($0.compatibilityScore ?? 0) > ($1.compatibilityScore ?? 0) }
        }
    }

    // MARK: - Sort Options Sheet

    private var sortOptionsSheet: some View {
        NavigationStack {
            List {
                ForEach(SortOption.allCases, id: \.self) { option in
                    Button(action: {
                        sortOption = option
                        showSortSheet = false
                    }) {
                        HStack {
                            Image(systemName: option.icon)
                                .font(.system(size: 16))
                                .foregroundColor(sortOption == option ? Color(hex: "FFA040") : Color(hex: "6B7280"))
                                .frame(width: 24)

                            Text(option.rawValue)
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "111827"))

                            Spacer()

                            if sortOption == option {
                                Image(systemName: "checkmark")
                                    .font(.system(size: 14, weight: .semibold))
                                    .foregroundColor(Color(hex: "FFA040"))
                            }
                        }
                    }
                }
            }
            .navigationTitle("Trier par")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Fermer") {
                        showSortSheet = false
                    }
                    .foregroundColor(Color(hex: "FFA040"))
                }
            }
        }
        .presentationDetents([.medium])
    }
}

// MARK: - Favorite Property Card

struct FavoritePropertyCard: View {
    let property: Property
    let onRemove: () -> Void

    private var compatibilityScore: Int {
        property.compatibilityScore ?? 0
    }

    var body: some View {
        HStack(spacing: 12) {
            // Image
            AsyncImage(url: URL(string: property.images.first ?? "")) { phase in
                switch phase {
                case .success(let image):
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 120, height: 100)
                        .clipped()
                        .cornerRadius(12)
                case .failure(_), .empty:
                    Rectangle()
                        .fill(Color(hex: "E5E7EB"))
                        .frame(width: 120, height: 100)
                        .cornerRadius(12)
                        .overlay(
                            Image(systemName: "photo")
                                .font(.system(size: 24))
                                .foregroundColor(Color(hex: "9CA3AF"))
                        )
                @unknown default:
                    EmptyView()
                }
            }

            // Content
            VStack(alignment: .leading, spacing: 8) {
                // Title and remove button
                HStack(alignment: .top) {
                    Text(property.title)
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                        .lineLimit(2)

                    Spacer()

                    Button(action: onRemove) {
                        Image(systemName: "heart.fill")
                            .font(.system(size: 18))
                            .foregroundColor(Color(hex: "EF4444"))
                    }
                }

                // Location
                HStack(spacing: 4) {
                    Image(systemName: "mappin")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "6B7280"))
                    Text(property.city)
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                        .lineLimit(1)
                }

                Spacer()

                // Price and match score
                HStack {
                    Text("€\(Int(property.monthlyRent))/mois")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "FFA040"))

                    Spacer()

                    if compatibilityScore >= 70 {
                        HStack(spacing: 4) {
                            Image(systemName: "sparkles")
                                .font(.system(size: 10))
                            Text("\(compatibilityScore)%")
                                .font(.system(size: 12, weight: .semibold))
                        }
                        .foregroundColor(compatibilityScore >= 90 ? Color(hex: "10B981") : Color(hex: "FFA040"))
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(
                            (compatibilityScore >= 90 ? Color(hex: "10B981") : Color(hex: "FFA040")).opacity(0.1)
                        )
                        .cornerRadius(999)
                    }
                }
            }
            .padding(.vertical, 8)
        }
        .padding(12)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.06), radius: 8, x: 0, y: 2)
    }
}

// MARK: - ViewModel

@MainActor
class FavoritesViewModel: ObservableObject {
    @Published var favorites: [Property] = []
    @Published var isLoading = false
    @Published var error: String?

    func loadFavorites() async {
        isLoading = true

        // Demo mode
        if AppConfig.FeatureFlags.demoMode {
            try? await Task.sleep(nanoseconds: 500_000_000)
            // Simulate some favorited properties
            favorites = Property.mockProperties.prefix(4).map { property in
                var fav = property
                fav.isFavorited = true
                return fav
            }
        } else {
            do {
                favorites = try await APIClient.shared.getFavorites()
            } catch {
                self.error = "Erreur lors du chargement des favoris"
                print("Error loading favorites: \(error)")
            }
        }

        isLoading = false
    }

    func removeFavorite(_ property: Property) async {
        // Optimistic update
        favorites.removeAll { $0.id == property.id }

        if !AppConfig.FeatureFlags.demoMode {
            do {
                try await APIClient.shared.removeFavorite(propertyId: property.id.uuidString)
            } catch {
                // Revert on error
                favorites.append(property)
                print("Error removing favorite: \(error)")
            }
        }
    }
}

// MARK: - Preview

struct FavoritesView_Previews: PreviewProvider {
    static var previews: some View {
        FavoritesView()
    }
}
