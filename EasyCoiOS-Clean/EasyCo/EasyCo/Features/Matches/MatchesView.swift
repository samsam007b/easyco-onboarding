import SwiftUI

// MARK: - Matches View (Web App Design)

struct MatchesView: View {
    @StateObject private var viewModel = MatchesViewModel()
    @State private var showFilters = false
    @State private var filters = MatchFilters()
    @State private var viewMode: ViewMode = .grid

    enum ViewMode {
        case grid
        case list
    }

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    loadingView
                } else if viewModel.filteredMatches.isEmpty {
                    emptyStateView
                } else {
                    matchesList
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(
                leading: Button(action: { viewMode = viewMode == .grid ? .list : .grid }) {
                    Image(systemName: viewMode == .grid ? "list.bullet" : "square.grid.2x2")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "6B7280"))
                },
                trailing: Button(action: { showFilters = true }) {
                    ZStack(alignment: .topTrailing) {
                        Image(systemName: "slider.horizontal.3")
                            .font(.system(size: 16))
                            .foregroundColor(Color(hex: "FFA040"))

                        if viewModel.hasActiveFilters(filters) {
                            Circle()
                                .fill(Color(hex: "EF4444"))
                                .frame(width: 8, height: 8)
                                .offset(x: 4, y: -4)
                        }
                    }
                }
            )
            .navigationTitle("Mes Matchs")
            .sheet(isPresented: $showFilters) {
                MatchFiltersView(filters: $filters) { newFilters in
                    viewModel.applyFilters(newFilters)
                }
            }
        }
        .task {
            await viewModel.loadMatches()
        }
        .onChange(of: filters) { newFilters in
            viewModel.applyFilters(newFilters)
        }
    }

    // MARK: - Loading View

    private var loadingView: some View {
        VStack(spacing: 16) {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: Color(hex: "FFA040")))
                .scaleEffect(1.5)

            Text("Chargement de vos matchs...")
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(hex: "F9FAFB"))
    }

    // MARK: - Matches List

    private var matchesList: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Score explanation header
                scoreExplanationHeader

                // Active filters chips
                if viewModel.hasActiveFilters(filters) {
                    activeFiltersChips
                }

                // Match stats
                matchStatsHeader

                // Properties
                if viewMode == .grid {
                    gridView
                } else {
                    listView
                }
            }
            .padding(.bottom, 20)
        }
    }

    // MARK: - Score Explanation Header

    private var scoreExplanationHeader: some View {
        VStack(spacing: 12) {
            HStack {
                Image(systemName: "sparkles")
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: "FFA040"))

                Text("Vos meilleurs matchs")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                // Score legend
                HStack(spacing: 12) {
                    ScoreLegendItem(color: Color(hex: "10B981"), label: "90%+")
                    ScoreLegendItem(color: Color(hex: "FFA040"), label: "80%+")
                }
            }

            Text("Basés sur votre budget, localisation et préférences")
                .font(.system(size: 13))
                .foregroundColor(Color(hex: "6B7280"))
                .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
        .padding(.horizontal, 16)
        .padding(.top, 16)
    }

    // MARK: - Active Filters Chips

    private var activeFiltersChips: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                // Price range
                if let minPrice = filters.minPrice, let maxPrice = filters.maxPrice {
                    ActiveFilterChip(
                        label: "€\(minPrice) - €\(maxPrice)",
                        onRemove: {
                            filters.minPrice = nil
                            filters.maxPrice = nil
                        }
                    )
                }

                // Cities
                ForEach(filters.cities, id: \.self) { city in
                    ActiveFilterChip(
                        label: city,
                        onRemove: {
                            filters.cities.removeAll { $0 == city }
                        }
                    )
                }

                // Property types
                ForEach(filters.propertyTypes, id: \.self) { type in
                    ActiveFilterChip(
                        label: type.displayName,
                        onRemove: {
                            filters.propertyTypes.removeAll { $0 == type }
                        }
                    )
                }

                // Clear all
                if viewModel.hasActiveFilters(filters) {
                    Button(action: {
                        filters = MatchFilters()
                    }) {
                        Text("Effacer tout")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(Color(hex: "EF4444"))
                    }
                }
            }
            .padding(.horizontal, 16)
        }
    }

    // MARK: - Match Stats Header

    private var matchStatsHeader: some View {
        HStack(spacing: 12) {
            // Total matches
            SearcherMatchStatCard(
                value: "\(viewModel.filteredMatches.count)",
                label: "Matchs",
                icon: "sparkles",
                color: Color(hex: "FFA040")
            )

            // Excellent matches (90%+)
            SearcherMatchStatCard(
                value: "\(viewModel.excellentMatchesCount)",
                label: "Excellents",
                icon: "star.fill",
                color: Color(hex: "10B981")
            )

            // Average score
            SearcherMatchStatCard(
                value: "\(viewModel.averageScore)%",
                label: "Score moyen",
                icon: "chart.bar.fill",
                color: Color(hex: "6366F1")
            )
        }
        .padding(.horizontal, 16)
    }

    // MARK: - Grid View

    private var gridView: some View {
        LazyVGrid(
            columns: [
                GridItem(.flexible(), spacing: 16),
                GridItem(.flexible(), spacing: 16)
            ],
            spacing: 24
        ) {
            ForEach(viewModel.filteredMatches) { property in
                NavigationLink(destination: PropertyDetailView(property: property)) {
                    MatchPropertyCard(
                        property: property,
                        onFavorite: {
                            Task {
                                await viewModel.toggleFavorite(property)
                            }
                        },
                        onTap: {}
                    )
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
        .padding(16)
    }

    // MARK: - List View

    private var listView: some View {
        LazyVStack(spacing: 12) {
            ForEach(viewModel.filteredMatches) { property in
                NavigationLink(destination: PropertyDetailView(property: property)) {
                    MatchListCard(
                        property: property,
                        onFavorite: {
                            Task {
                                await viewModel.toggleFavorite(property)
                            }
                        }
                    )
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
        .padding(.horizontal, 16)
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

                Image(systemName: "sparkles")
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "FFA040"))
            }

            // Text
            VStack(spacing: 12) {
                Text(viewModel.hasActiveFilters(filters) ? "Aucun match trouvé" : "Aucun match pour l'instant")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text(viewModel.hasActiveFilters(filters)
                    ? "Essayez d'ajuster vos filtres pour voir plus de résultats"
                    : "Complétez votre profil et explorez les propriétés pour trouver vos matchs parfaits")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            // CTA Buttons
            VStack(spacing: 12) {
                if viewModel.hasActiveFilters(filters) {
                    Button(action: { filters = MatchFilters() }) {
                        HStack(spacing: 8) {
                            Image(systemName: "arrow.counterclockwise")
                                .font(.system(size: 16, weight: .semibold))
                            Text("Réinitialiser les filtres")
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
                } else {
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
                }
            }
            .padding(.top, 8)

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(hex: "F9FAFB"))
    }
}

// MARK: - Score Legend Item

struct ScoreLegendItem: View {
    let color: Color
    let label: String

    var body: some View {
        HStack(spacing: 4) {
            Circle()
                .fill(color)
                .frame(width: 8, height: 8)
            Text(label)
                .font(.system(size: 11))
                .foregroundColor(Color(hex: "6B7280"))
        }
    }
}

// MARK: - Active Filter Chip

struct ActiveFilterChip: View {
    let label: String
    let onRemove: () -> Void

    var body: some View {
        HStack(spacing: 6) {
            Text(label)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(Color(hex: "FFA040"))

            Button(action: onRemove) {
                Image(systemName: "xmark")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(Color(hex: "FFA040"))
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(Color(hex: "FFA040").opacity(0.1))
        .cornerRadius(999)
    }
}

// MARK: - Stat Card

private struct SearcherMatchStatCard: View {
    let value: String
    let label: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 14))
                    .foregroundColor(color)
                Spacer()
            }

            Text(value)
                .font(.system(size: 22, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            Text(label)
                .font(.system(size: 11))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.white)
        .cornerRadius(12)
    }
}

// MARK: - Match List Card

struct MatchListCard: View {
    let property: Property
    let onFavorite: () -> Void

    private var compatibilityScore: Int {
        property.compatibilityScore ?? 0
    }

    private var scoreColor: Color {
        if compatibilityScore >= 90 {
            return Color(hex: "10B981")
        } else if compatibilityScore >= 80 {
            return Color(hex: "FFA040")
        } else {
            return Color(hex: "6B7280")
        }
    }

    var body: some View {
        HStack(spacing: 12) {
            // Image with score badge
            ZStack(alignment: .topLeading) {
                AsyncImage(url: URL(string: property.images.first ?? "")) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(width: 100, height: 90)
                            .clipped()
                            .cornerRadius(10)
                    case .failure(_), .empty:
                        Rectangle()
                            .fill(Color(hex: "E5E7EB"))
                            .frame(width: 100, height: 90)
                            .cornerRadius(10)
                            .overlay(
                                Image(systemName: "photo")
                                    .font(.system(size: 20))
                                    .foregroundColor(Color(hex: "9CA3AF"))
                            )
                    @unknown default:
                        EmptyView()
                    }
                }

                // Score badge
                HStack(spacing: 2) {
                    Image(systemName: "sparkles")
                        .font(.system(size: 8, weight: .bold))
                    Text("\(compatibilityScore)%")
                        .font(.system(size: 10, weight: .bold))
                }
                .foregroundColor(.white)
                .padding(.horizontal, 6)
                .padding(.vertical, 3)
                .background(scoreColor)
                .cornerRadius(999)
                .padding(6)
            }

            // Content
            VStack(alignment: .leading, spacing: 6) {
                Text(property.title)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
                    .lineLimit(1)

                HStack(spacing: 4) {
                    Image(systemName: "mappin")
                        .font(.system(size: 10))
                        .foregroundColor(Color(hex: "6B7280"))
                    Text(property.city)
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                // Match reasons
                HStack(spacing: 6) {
                    MatchReasonBadge(icon: "eurosign.circle.fill", text: "Budget", color: Color(hex: "10B981"))
                    MatchReasonBadge(icon: "mappin.circle.fill", text: "Lieu", color: Color(hex: "FFA040"))
                }

                HStack {
                    Text("€\(Int(property.monthlyRent))")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(Color(hex: "FFA040"))

                    Text("/mois")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "6B7280"))

                    Spacer()

                    Button(action: onFavorite) {
                        Image(systemName: (property.isFavorited ?? false) ? "heart.fill" : "heart")
                            .font(.system(size: 18))
                            .foregroundColor((property.isFavorited ?? false) ? Color(hex: "EF4444") : Color(hex: "D1D5DB"))
                    }
                }
            }
        }
        .padding(10)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 6, x: 0, y: 2)
    }
}

// MARK: - ViewModel

@MainActor
class MatchesViewModel: ObservableObject {
    @Published var matches: [Property] = []
    @Published var filteredMatches: [Property] = []
    @Published var isLoading = false

    var excellentMatchesCount: Int {
        filteredMatches.filter { ($0.compatibilityScore ?? 0) >= 90 }.count
    }

    var averageScore: Int {
        guard !filteredMatches.isEmpty else { return 0 }
        let total = filteredMatches.reduce(0) { $0 + ($1.compatibilityScore ?? 0) }
        return total / filteredMatches.count
    }

    func loadMatches() async {
        isLoading = true

        // Demo mode - use mock data with high compatibility scores
        if AppConfig.FeatureFlags.demoMode {
            try? await Task.sleep(nanoseconds: 500_000_000)
            matches = Property.mockProperties.filter { ($0.compatibilityScore ?? 0) >= 70 }
            filteredMatches = matches
        } else {
            // TODO: API call
        }

        isLoading = false
    }

    func applyFilters(_ filters: MatchFilters) {
        filteredMatches = matches.filter { property in
            // Price filter
            if let minPrice = filters.minPrice, property.monthlyRent < Double(minPrice) {
                return false
            }
            if let maxPrice = filters.maxPrice, property.monthlyRent > Double(maxPrice) {
                return false
            }

            // City filter
            if !filters.cities.isEmpty && !filters.cities.contains(property.city) {
                return false
            }

            // Property type filter
            if !filters.propertyTypes.isEmpty && !filters.propertyTypes.contains(property.propertyType) {
                return false
            }

            // Bedrooms filter
            if let minBedrooms = filters.minBedrooms, property.bedrooms < minBedrooms {
                return false
            }

            return true
        }
    }

    func hasActiveFilters(_ filters: MatchFilters) -> Bool {
        return filters.minPrice != nil ||
               filters.maxPrice != nil ||
               !filters.cities.isEmpty ||
               !filters.propertyTypes.isEmpty ||
               filters.minBedrooms != nil ||
               filters.minSurface != nil ||
               !filters.requiredAmenities.isEmpty ||
               filters.furnished != nil ||
               filters.petsAllowed != nil
    }

    func toggleFavorite(_ property: Property) async {
        if let index = filteredMatches.firstIndex(where: { $0.id == property.id }) {
            filteredMatches[index].isFavorited?.toggle()
        }
        if let index = matches.firstIndex(where: { $0.id == property.id }) {
            matches[index].isFavorited?.toggle()
        }

        // TODO: API call to persist favorite
    }
}

// MARK: - Preview

struct MatchesView_Previews: PreviewProvider {
    static var previews: some View {
        MatchesView()
    }
}
