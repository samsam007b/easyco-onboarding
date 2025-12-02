//
//  PropertiesListView.swift
//  EasyCo
//
//  Main properties search and list view
//

import SwiftUI

enum PropertyViewMode {
    case list
    case grid
    case map
}

struct PropertiesListView: View {
    @State private var searchText = ""
    @State private var viewMode: PropertyViewMode = .list
    @State private var showFilters = false
    @State private var activeFiltersCount = 0
    @State private var properties: [Property] = []
    @State private var isLoading = false
    @State private var selectedProperty: Property?

    // Mock data
    private var mockProperties: [Property] {
        [
            .mock,
            Property(
                id: "2",
                title: "Studio lumineux avec balcon",
                location: "Bruxelles, Louise",
                price: 680,
                bedrooms: 1,
                bathrooms: 1,
                area: 35,
                images: ["https://via.placeholder.com/400x300/90EE90"],
                isNew: false,
                isVerified: true,
                matchScore: 92,
                distance: 0.8,
                availableFrom: "1er avril"
            ),
            Property(
                id: "3",
                title: "Grande maison de maître rénovée",
                location: "Bruxelles, Uccle",
                price: 1450,
                bedrooms: 4,
                bathrooms: 2,
                area: 150,
                images: ["https://via.placeholder.com/400x300/FFB6C1"],
                isNew: true,
                isVerified: true,
                matchScore: 78,
                distance: 5.2,
                availableFrom: "Immédiatement"
            ),
            Property(
                id: "4",
                title: "Appartement 2 chambres meublé",
                location: "Bruxelles, Etterbeek",
                price: 950,
                bedrooms: 2,
                bathrooms: 1,
                area: 80,
                images: ["https://via.placeholder.com/400x300/87CEEB"],
                isNew: false,
                isVerified: false,
                matchScore: 85,
                distance: 3.1,
                availableFrom: "15 mai"
            ),
            Property(
                id: "5",
                title: "Loft moderne avec terrasse",
                location: "Bruxelles, Flagey",
                price: 1100,
                bedrooms: 2,
                bathrooms: 1,
                area: 90,
                images: ["https://via.placeholder.com/400x300/DDA0DD"],
                isNew: true,
                isVerified: true,
                matchScore: 88,
                distance: 1.5,
                availableFrom: "1er juin"
            )
        ]
    }

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.Colors.backgroundSecondary
                    .ignoresSafeArea()

                VStack(spacing: 0) {
                    // Search Header (sticky)
                    searchHeader
                        .background(Theme.Colors.backgroundPrimary)
                        .shadow(color: .black.opacity(0.05), radius: 4, y: 2)

                    // Content based on view mode
                    Group {
                        switch viewMode {
                        case .list:
                            listView
                        case .grid:
                            gridView
                        case .map:
                            mapPlaceholder
                        }
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Recherche")
                        .font(Theme.Typography.title3())
                        .foregroundColor(Theme.Colors.textPrimary)
                }
            }
            .sheet(isPresented: $showFilters) {
                FiltersBottomSheetPlaceholder(
                    isPresented: $showFilters,
                    activeFiltersCount: $activeFiltersCount
                )
            }
            .sheet(item: $selectedProperty) { property in
                PropertyDetailPlaceholder(property: property)
            }
        }
        .onAppear {
            loadProperties()
        }
    }

    // MARK: - Search Header

    private var searchHeader: some View {
        VStack(spacing: 12) {
            // Search bar
            SearchBar(
                text: $searchText,
                placeholder: "Ville, quartier, adresse...",
                filterCount: activeFiltersCount,
                onFilterTap: {
                    showFilters = true
                }
            )
            .padding(.horizontal)

            // Quick filters + View toggle
            HStack(spacing: 12) {
                // Quick filters (horizontal scroll)
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        FilterChip(title: "Meublé", icon: nil, isSelected: .constant(false))
                        FilterChip(title: "Animaux", icon: "dog", isSelected: .constant(false))
                        FilterChip(title: "Balcon", icon: nil, isSelected: .constant(true))
                        FilterChip(title: "Parking", icon: "car", isSelected: .constant(false))
                    }
                    .padding(.horizontal)
                }

                // View mode toggle
                HStack(spacing: 8) {
                    viewModeButton(icon: "list", mode: .list)
                    viewModeButton(icon: "grid", mode: .grid)
                    viewModeButton(icon: "map", mode: .map)
                }
                .padding(.trailing)
            }

            // Results count
            HStack {
                Text("\(properties.count) propriétés")
                    .font(Theme.Typography.bodySmall(.medium))
                    .foregroundColor(Theme.Colors.textSecondary)

                Spacer()
            }
            .padding(.horizontal)
        }
        .padding(.vertical, 12)
    }

    private func viewModeButton(icon: String, mode: PropertyViewMode) -> some View {
        Button(action: {
            withAnimation(Theme.Animation.springFast) {
                viewMode = mode
            }
            Haptic.selection()
        }) {
            Image.lucide(icon)
                .resizable()
                .scaledToFit()
                .frame(width: 20, height: 20)
                .foregroundColor(viewMode == mode ? Theme.Colors.primary : Theme.Colors.gray400)
                .frame(width: 36, height: 36)
                .background(viewMode == mode ? Theme.Colors.primary.opacity(0.1) : Color.clear)
                .cornerRadius(8)
        }
    }

    // MARK: - List View

    private var listView: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(properties) { property in
                    PropertyCard(
                        property: property,
                        onTap: {
                            selectedProperty = property
                        },
                        onFavoriteTap: {
                            // Handle favorite
                        }
                    )
                }
            }
            .padding()
        }
        .refreshable {
            await refreshProperties()
        }
    }

    // MARK: - Grid View

    private var gridView: some View {
        ScrollView {
            LazyVGrid(columns: [
                GridItem(.flexible(), spacing: 16),
                GridItem(.flexible(), spacing: 16)
            ], spacing: 16) {
                ForEach(properties) { property in
                    PropertyCardCompact(
                        property: property,
                        onTap: {
                            selectedProperty = property
                        },
                        onFavoriteTap: {
                            // Handle favorite
                        }
                    )
                }
            }
            .padding()
        }
        .refreshable {
            await refreshProperties()
        }
    }

    // MARK: - Map Placeholder

    private var mapPlaceholder: some View {
        VStack(spacing: 20) {
            Spacer()

            Image.lucide("map")
                .resizable()
                .scaledToFit()
                .frame(width: 80, height: 80)
                .foregroundColor(Theme.Colors.gray300)

            Text("Vue carte")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)

            Text("À venir prochainement")
                .font(Theme.Typography.body())
                .foregroundColor(Theme.Colors.textSecondary)

            Spacer()
        }
    }

    // MARK: - Data Loading

    private func loadProperties() {
        properties = mockProperties
    }

    private func refreshProperties() async {
        try? await Task.sleep(nanoseconds: 1_000_000_000)
        properties = mockProperties
    }
}

// MARK: - Placeholders

struct FiltersBottomSheetPlaceholder: View {
    @Binding var isPresented: Bool
    @Binding var activeFiltersCount: Int

    var body: some View {
        NavigationStack {
            VStack {
                Text("Filtres avancés")
                    .font(Theme.Typography.title2())
                    .padding()

                Spacer()

                PrimaryButton(title: "Voir 12 résultats", icon: nil) {
                    activeFiltersCount = 5
                    isPresented = false
                }
                .padding()
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    IconButton(icon: "xmark", action: {
                        isPresented = false
                    }, size: 32, iconSize: 14, backgroundColor: Theme.Colors.gray100, hasShadow: false)
                }
            }
        }
    }
}

struct PropertyDetailPlaceholder: View {
    let property: Property

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    Text(property.title)
                        .font(Theme.Typography.title2())

                    Text("\(property.price)€/mois")
                        .font(Theme.Typography.price())
                        .foregroundColor(Theme.Colors.primary)

                    PrimaryButton(title: "Postuler", icon: "send") {
                        // Handle application
                    }
                    .padding()
                }
                .padding()
            }
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

// MARK: - Preview

struct PropertiesListView_Previews: PreviewProvider {
    static var previews: some View {
        PropertiesListView()
    }
}
