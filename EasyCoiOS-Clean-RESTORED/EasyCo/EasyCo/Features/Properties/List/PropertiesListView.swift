import SwiftUI

// MARK: - Properties List View (Complete Web App Replica)

struct PropertiesListView: View {
    @StateObject private var viewModel = PropertiesViewModel()
    @State private var searchLocation: String = ""
    @State private var searchBudget: String = "€800/mois"
    @State private var searchDate: String = "Flexible"
    @State private var showSavedSearches = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 0) {
                    // Hero Search Section (Glassmorphism)
                    heroSearchSection
                        .padding(.horizontal, 16)
                        .padding(.top, 16)
                        .padding(.bottom, 24)

                    // Filters & Sort Bar
                    filtersAndSortBar
                        .padding(.horizontal, 16)
                        .padding(.bottom, 16)

                    // Properties Grid
                    if viewModel.isLoading && viewModel.properties.isEmpty {
                        LoadingView(message: "Chargement des propriétés...")
                            .frame(height: 400)
                    } else if viewModel.properties.isEmpty {
                        emptyStateView
                            .frame(height: 400)
                    } else {
                        propertiesGrid
                    }
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Explorer")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showSavedSearches = true }) {
                        Image(systemName: "bookmark.fill")
                            .font(.system(size: 16))
                            .foregroundColor(Color(hex: "FFA040"))
                    }
                }
            }
            .sheet(isPresented: $viewModel.showFilters) {
                FiltersView(viewModel: viewModel)
            }
            // TODO: Implement SavedSearchesView
            // .sheet(isPresented: $showSavedSearches) {
            //     SavedSearchesView(currentFilters: $viewModel.filters)
            // }
        }
        .task {
            if viewModel.properties.isEmpty {
                await viewModel.loadProperties(refresh: false)
            }
        }
    }

    // MARK: - Hero Search Section

    private var heroSearchSection: some View {
        VStack(spacing: 16) {
            // Title
            VStack(alignment: .leading, spacing: 8) {
                Text("Trouve ta colocation idéale")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Découvre des centaines de propriétés vérifiées")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            // Glassmorphism Search Card
            glassmorphismSearchCard
        }
    }

    private var glassmorphismSearchCard: some View {
        VStack(spacing: 12) {
            // Location search
            HStack(spacing: 12) {
                Image(systemName: "mappin")
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: "FFA040"))

                VStack(alignment: .leading, spacing: 4) {
                    Text("Où ?")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(Color(hex: "6B7280"))

                    TextField("Ville, quartier...", text: $searchLocation)
                        .font(.system(size: 15))
                        .foregroundColor(Color(hex: "111827"))
                }
            }
            .padding(16)
            .background(Color.white.opacity(0.7))
            .cornerRadius(16)

            // Budget & Date Row
            HStack(spacing: 12) {
                // Budget
                HStack(spacing: 12) {
                    Image(systemName: "eurosign")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "FFA040"))

                    VStack(alignment: .leading, spacing: 4) {
                        Text("Budget")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(Color(hex: "6B7280"))

                        Text(searchBudget)
                            .font(.system(size: 15))
                            .foregroundColor(Color(hex: "111827"))
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(16)
                .background(Color.white.opacity(0.7))
                .cornerRadius(16)

                // Date
                HStack(spacing: 12) {
                    Image(systemName: "calendar")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "FFA040"))

                    VStack(alignment: .leading, spacing: 4) {
                        Text("Quand ?")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(Color(hex: "6B7280"))

                        Text(searchDate)
                            .font(.system(size: 15))
                            .foregroundColor(Color(hex: "111827"))
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(16)
                .background(Color.white.opacity(0.7))
                .cornerRadius(16)
            }

            // Search Button
            Button(action: {
                _Concurrency.Task {
                    await viewModel.loadProperties(refresh: true)
                }
            }) {
                HStack(spacing: 8) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 16, weight: .semibold))
                    Text("Rechercher")
                        .font(.system(size: 16, weight: .semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "FFA040"), Color(hex: "FFB85C"), Color(hex: "FFD080")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(999)
                .shadow(color: Color(hex: "FFA040").opacity(0.3), radius: 8, x: 0, y: 4)
            }
        }
        .padding(20)
        .background(
            ZStack {
                // Animated gradient background
                LinearGradient(
                    colors: [
                        Color(hex: "FFA040").opacity(0.25),
                        Color(hex: "FFB85C").opacity(0.22),
                        Color(hex: "FFD080").opacity(0.25)
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )

                // Glassmorphism overlay
                Color.white.opacity(0.3)
            }
        )
        .cornerRadius(32)
        .shadow(color: .black.opacity(0.05), radius: 20, x: 0, y: 10)
    }

    // MARK: - Filters & Sort Bar

    private var filtersAndSortBar: some View {
        HStack(spacing: 12) {
            // Filters button
            Button(action: {
                viewModel.showFilters = true
            }) {
                HStack(spacing: 8) {
                    Image(systemName: "slider.horizontal.3")
                        .font(.system(size: 16))

                    Text("Filtres")
                        .font(.system(size: 15, weight: .medium))

                    if viewModel.activeFiltersCount > 0 {
                        Text("\(viewModel.activeFiltersCount)")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                            .frame(width: 20, height: 20)
                            .background(
                                Circle()
                                    .fill(Color(hex: "FFA040"))
                            )
                    }
                }
                .foregroundColor(Color(hex: "374151"))
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(Color.white)
                .cornerRadius(12)
                .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
            }

            Spacer()

            // Sort dropdown
            Menu {
                Button(action: { viewModel.sortBy = .bestMatch }) {
                    Label("🎯 Meilleur match", systemImage: viewModel.sortBy == .bestMatch ? "checkmark" : "")
                }
                Button(action: { viewModel.sortBy = .newest }) {
                    Label("Plus récent", systemImage: viewModel.sortBy == .newest ? "checkmark" : "")
                }
                Button(action: { viewModel.sortBy = .priceLow }) {
                    Label("Prix: Croissant", systemImage: viewModel.sortBy == .priceLow ? "checkmark" : "")
                }
                Button(action: { viewModel.sortBy = .priceHigh }) {
                    Label("Prix: Décroissant", systemImage: viewModel.sortBy == .priceHigh ? "checkmark" : "")
                }
            } label: {
                HStack(spacing: 8) {
                    Text(viewModel.sortBy.displayName)
                        .font(.system(size: 15, weight: .medium))
                        .foregroundColor(Color(hex: "374151"))

                    Image(systemName: "chevron.down")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(Color.white)
                .cornerRadius(12)
                .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
            }
        }
    }

    // MARK: - Properties Grid

    private var propertiesGrid: some View {
        LazyVGrid(
            columns: [
                GridItem(.flexible(), spacing: 16),
                GridItem(.flexible(), spacing: 16)
            ],
            spacing: 24
        ) {
            ForEach(viewModel.filteredProperties) { property in
                NavigationLink(destination: PropertyDetailView(property: property)) {
                    PropertyCardView(
                        property: property,
                        onFavorite: {
                            _Concurrency.Task {
                                await viewModel.toggleFavorite(property)
                            }
                        },
                        onTap: {
                            // Navigate to detail
                        }
                    )
                }
                .buttonStyle(PlainButtonStyle())
                .task {
                    await viewModel.loadMoreIfNeeded(currentProperty: property)
                }
            }

            // Loading indicator at bottom
            if viewModel.isLoading && !viewModel.properties.isEmpty {
                ProgressView()
                    .frame(maxWidth: .infinity)
                    .gridCellColumns(2)
                    .padding(.vertical, 20)
            }
        }
        .padding(.horizontal, 16)
        .padding(.bottom, 24)
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 16) {
            Image(systemName: "house.slash")
                .font(.system(size: 64))
                .foregroundColor(Color(hex: "D1D5DB"))

            Text("Aucune propriété trouvée")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(Color(hex: "374151"))

            Text("Essayez d'ajuster vos filtres ou votre recherche")
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "6B7280"))
                .multilineTextAlignment(.center)

            Button(action: {
                viewModel.clearFilters()
            }) {
                Text("Réinitialiser les filtres")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
                    .background(
                        LinearGradient(
                            colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .cornerRadius(999)
            }
            .padding(.top, 8)
        }
        .padding(32)
    }
}

// MARK: - Preview

struct PropertiesListView_Previews: PreviewProvider {
    static var previews: some View {
        PropertiesListView()
    }
}
