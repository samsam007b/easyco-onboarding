import SwiftUI

// MARK: - Properties List View (Figma Styled with Signature Icons)

struct PropertiesListView_Styled: View {
    @StateObject private var viewModel = PropertiesViewModel()
    @State private var searchLocation: String = ""
    @State private var searchBudget: String = "€800/mois"
    @State private var searchDate: String = "Flexible"

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 0) {
                    // Hero Search Section (Figma Style)
                    heroSearchSection
                        .padding(.horizontal, 20)
                        .padding(.top, 16)
                        .padding(.bottom, 24)

                    // Filters & Sort Bar
                    filtersAndSortBar
                        .padding(.horizontal, 20)
                        .padding(.bottom, 20)

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
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))
                }
            }
            .sheet(isPresented: $viewModel.showFilters) {
                FiltersView(viewModel: viewModel)
            }
        }
        .task {
            if viewModel.properties.isEmpty {
                await viewModel.loadProperties(refresh: false)
            }
        }
    }

    // MARK: - Hero Search Section (Figma Styled)

    private var heroSearchSection: some View {
        VStack(spacing: 16) {
            // Glassmorphism Search Card with Signature Icons
            searchCard
        }
    }

    private var searchCard: some View {
        VStack(spacing: 16) {
            // Budget & Date Row (Horizontal Cards)
            HStack(spacing: 12) {
                // Budget Card
                HStack(spacing: 12) {
                    // Signature Icon - Euro
                    IconContainer(
                        AppIcon.euro.sfSymbol,
                        style: .vivid,
                        color: Color(hex: "FFA040"),
                        size: 18,
                        containerSize: 36
                    )

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Budget")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(Color(hex: "6B7280"))

                        Text(searchBudget)
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(Color(hex: "111827"))
                    }

                    Spacer()
                }
                .padding(16)
                .background(Color.white)
                .cornerRadius(16)
                .shadow(color: Color.black.opacity(0.04), radius: 8, x: 0, y: 2)

                // Date Card
                HStack(spacing: 12) {
                    // Signature Icon - Calendar
                    IconContainer(
                        AppIcon.calendar.sfSymbol,
                        style: .vivid,
                        color: Color(hex: "FFA040"),
                        size: 18,
                        containerSize: 36
                    )

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Quand ?")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(Color(hex: "6B7280"))

                        Text(searchDate)
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(Color(hex: "111827"))
                    }

                    Spacer()
                }
                .padding(16)
                .background(Color.white)
                .cornerRadius(16)
                .shadow(color: Color.black.opacity(0.04), radius: 8, x: 0, y: 2)
            }

            // Search Button (Prominent CTA)
            Button(action: {
                Task {
                    await viewModel.loadProperties(refresh: true)
                }
            }) {
                HStack(spacing: 10) {
                    // Signature Icon - Search
                    Image(systemName: AppIcon.search.sfSymbol)
                        .font(.system(size: 18, weight: .semibold))

                    Text("Rechercher")
                        .font(.system(size: 17, weight: .semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 56) // 56pt height (iOS recommended)
                .background(
                    LinearGradient(
                        colors: [
                            Color(hex: "FFA040"),
                            Color(hex: "FFB85C")
                        ],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(16)
                .shadow(
                    color: Color(hex: "FFA040").opacity(0.25),
                    radius: 12,
                    x: 0,
                    y: 6
                )
            }
        }
        .padding(20)
        .background(
            // Soft gradient background (Figma style)
            LinearGradient(
                colors: [
                    Color(hex: "FFF4ED"), // Soft peach
                    Color(hex: "FFF9F5")  // Almost white
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(24)
        .shadow(color: Color.black.opacity(0.06), radius: 16, x: 0, y: 4)
    }

    // MARK: - Filters & Sort Bar (Figma Styled)

    private var filtersAndSortBar: some View {
        HStack(spacing: 12) {
            // Filters button with signature icon
            Button(action: {
                viewModel.showFilters = true
            }) {
                HStack(spacing: 10) {
                    // Signature Icon - Sliders
                    Image(systemName: AppIcon.sliders.sfSymbol)
                        .font(.system(size: 18))

                    Text("Filtres")
                        .font(.system(size: 16, weight: .semibold))

                    if viewModel.activeFiltersCount > 0 {
                        // Badge count
                        Text("\(viewModel.activeFiltersCount)")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                            .frame(width: 22, height: 22)
                            .background(
                                Circle()
                                    .fill(Color(hex: "FFA040"))
                            )
                    }
                }
                .foregroundColor(Color(hex: "374151"))
                .padding(.horizontal, 20)
                .frame(height: 48) // iOS-friendly touch target
                .background(Color.white)
                .cornerRadius(12)
                .shadow(color: Color.black.opacity(0.05), radius: 6, x: 0, y: 2)
            }

            Spacer()

            // Sort dropdown with signature icon
            Menu {
                Button(action: { viewModel.sortBy = .bestMatch }) {
                    HStack {
                        Image(systemName: AppIcon.sparkles.sfSymbol)
                        Text("Meilleur match")
                        if viewModel.sortBy == .bestMatch {
                            Image(systemName: AppIcon.check.sfSymbol)
                        }
                    }
                }
                Button(action: { viewModel.sortBy = .newest }) {
                    HStack {
                        Image(systemName: AppIcon.clock.sfSymbol)
                        Text("Plus récent")
                        if viewModel.sortBy == .newest {
                            Image(systemName: AppIcon.check.sfSymbol)
                        }
                    }
                }
                Button(action: { viewModel.sortBy = .priceLow }) {
                    HStack {
                        Image(systemName: "arrow.up")
                        Text("Prix: Croissant")
                        if viewModel.sortBy == .priceLow {
                            Image(systemName: AppIcon.check.sfSymbol)
                        }
                    }
                }
                Button(action: { viewModel.sortBy = .priceHigh }) {
                    HStack {
                        Image(systemName: "arrow.down")
                        Text("Prix: Décroissant")
                        if viewModel.sortBy == .priceHigh {
                            Image(systemName: AppIcon.check.sfSymbol)
                        }
                    }
                }
            } label: {
                HStack(spacing: 10) {
                    // Signature Icon - Target (Best Match)
                    Image(systemName: AppIcon.sparkles.sfSymbol)
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "FFA040"))

                    Text(viewModel.sortBy.displayName)
                        .font(.system(size: 15, weight: .medium))
                        .foregroundColor(Color(hex: "374151"))

                    Image(systemName: AppIcon.chevronRight.sfSymbol)
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "9CA3AF"))
                        .rotationEffect(.degrees(90))
                }
                .padding(.horizontal, 16)
                .frame(height: 48)
                .background(Color.white)
                .cornerRadius(12)
                .shadow(color: Color.black.opacity(0.05), radius: 6, x: 0, y: 2)
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
                            Task {
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
        .padding(.horizontal, 20)
        .padding(.bottom, 24)
    }

    // MARK: - Empty State (Figma Styled)

    private var emptyStateView: some View {
        VStack(spacing: 24) {
            // Signature Icon - Empty State
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [
                                Color(hex: "F3F4F6"),
                                Color(hex: "E5E7EB")
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 120, height: 120)

                Image(systemName: "house.slash")
                    .font(.system(size: 48, weight: .medium))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }

            VStack(spacing: 8) {
                Text("Aucune propriété trouvée")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Essayez d'ajuster vos filtres ou votre recherche")
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            Button(action: {
                viewModel.clearFilters()
            }) {
                HStack(spacing: 8) {
                    Image(systemName: AppIcon.xmark.sfSymbol)
                        .font(.system(size: 15, weight: .semibold))

                    Text("Réinitialiser les filtres")
                        .font(.system(size: 16, weight: .semibold))
                }
                .foregroundColor(.white)
                .padding(.horizontal, 28)
                .frame(height: 52)
                .background(
                    LinearGradient(
                        colors: [
                            Color(hex: "FFA040"),
                            Color(hex: "FFB85C")
                        ],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(16)
                .shadow(
                    color: Color(hex: "FFA040").opacity(0.25),
                    radius: 12,
                    x: 0,
                    y: 6
                )
            }
        }
        .padding(32)
    }
}

// MARK: - Preview

struct PropertiesListView_Styled_Previews: PreviewProvider {
    static var previews: some View {
        PropertiesListView_Styled()
    }
}
