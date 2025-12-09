//
//  PropertiesListView+Integration.swift
//  IzzIco
//
//  Example integration of PropertiesListView with ViewModel
//  This shows how to replace mock data with real API calls
//

import SwiftUI

/// This is an example of how to integrate the PropertiesListView with the backend
/// To use this instead of mock data:
/// 1. Rename PropertiesListView.swift to PropertiesListView+Mock.swift
/// 2. Rename this file to PropertiesListView.swift
/// 3. Ensure proper error handling and loading states
///
struct PropertiesListViewIntegrated: View {
    @StateObject private var viewModel = PropertiesViewModel()
    @State private var showFilters = false
    @State private var viewMode: ViewMode = .list

    enum ViewMode {
        case list, grid, map
    }

    var body: some View {
        ZStack {
            Theme.Colors.backgroundSecondary
                .ignoresSafeArea()

            if viewModel.isLoading && viewModel.properties.isEmpty {
                // Initial loading state
                LoadingStateView(message: "Chargement des propriétés...")
            } else if let error = viewModel.error, viewModel.properties.isEmpty {
                // Error state (only if no properties cached)
                ErrorStateView(error: error) {
                    Task {
                        await viewModel.refresh()
                    }
                }
            } else if viewModel.properties.isEmpty {
                // Empty state
                EmptyStateView(
                    icon: "home",
                    title: "Aucune propriété",
                    message: "Aucune propriété ne correspond à vos critères",
                    actionTitle: "Réinitialiser les filtres",
                    action: {
                        viewModel.clearFilters()
                    }
                )
            } else {
                // Content
                ScrollView {
                    VStack(spacing: 20) {
                        // Search bar
                        searchHeader

                        // Quick filters
                        quickFilters

                        // Properties list
                        switch viewMode {
                        case .list:
                            propertiesList
                        case .grid:
                            propertiesGrid
                        case .map:
                            Text("Map view - TODO")
                        }

                        // Loading more indicator
                        if viewModel.isLoading && !viewModel.properties.isEmpty {
                            ProgressView()
                                .padding()
                        }
                    }
                    .padding()
                }
                .refreshable {
                    await viewModel.refresh()
                }
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            toolbarContent
        }
        .sheet(isPresented: $showFilters) {
            // Use existing FiltersView
            NavigationStack {
                // TODO: Update FiltersView to use viewModel.applyFilters()
                Text("Filters - Connect to ViewModel")
            }
        }
        .task {
            // Load initial data
            if viewModel.properties.isEmpty {
                await viewModel.loadProperties()
            }
        }
    }

    // MARK: - Search Header

    private var searchHeader: some View {
        HStack(spacing: 12) {
            HStack(spacing: 12) {
                Image.lucide("search")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 18, height: 18)
                    .foregroundColor(Theme.Colors.textTertiary)

                TextField("Rechercher un logement...", text: .constant(""))
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textPrimary)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.button)

            Button(action: {
                showFilters = true
                Haptic.impact(.light)
            }) {
                ZStack(alignment: .topTrailing) {
                    Image.lucide("sliders-horizontal")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)
                        .foregroundColor(Theme.Colors.textPrimary)
                        .frame(width: 48, height: 48)
                        .background(Theme.Colors.backgroundPrimary)
                        .cornerRadius(Theme.CornerRadius.button)

                    // Active filters badge
                    if viewModel.filters != nil {
                        Circle()
                            .fill(Theme.Colors.primary)
                            .frame(width: 8, height: 8)
                            .offset(x: -8, y: 8)
                    }
                }
            }
        }
    }

    // MARK: - Quick Filters

    private var quickFilters: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                // View mode toggle
                HStack(spacing: 4) {
                    ForEach([ViewMode.list, ViewMode.grid], id: \.self) { mode in
                        Button(action: {
                            viewMode = mode
                            Haptic.impact(.light)
                        }) {
                            Image.lucide(mode == .list ? "list" : "grid")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 16, height: 16)
                                .foregroundColor(viewMode == mode ? .white : Theme.Colors.textSecondary)
                                .frame(width: 36, height: 36)
                                .background(viewMode == mode ? Theme.Colors.primary : Theme.Colors.gray100)
                                .cornerRadius(8)
                        }
                    }
                }
                .padding(.trailing, 8)

                FilterChip(title: "Studio", isSelected: false) {}
                FilterChip(title: "T2", isSelected: false) {}
                FilterChip(title: "T3+", isSelected: false) {}
                FilterChip(title: "Meublé", isSelected: false) {}
            }
        }
    }

    // MARK: - Properties List

    private var propertiesList: some View {
        LazyVStack(spacing: 16) {
            ForEach(viewModel.properties) { property in
                NavigationLink(destination: PropertyDetailView(property: property)) {
                    PropertyCard(property: property)
                }
                .buttonStyle(PlainButtonStyle())
                .task {
                    // Pagination: load more when reaching this item
                    await viewModel.loadMoreIfNeeded(currentProperty: property)
                }
            }
        }
    }

    // MARK: - Properties Grid

    private var propertiesGrid: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
            ForEach(viewModel.properties) { property in
                NavigationLink(destination: PropertyDetailView(property: property)) {
                    PropertyCardCompact(property: property)
                }
                .buttonStyle(PlainButtonStyle())
                .task {
                    await viewModel.loadMoreIfNeeded(currentProperty: property)
                }
            }
        }
    }

    // MARK: - Toolbar

    @ToolbarContentBuilder
    private var toolbarContent: some ToolbarContent {
        ToolbarItem(placement: .principal) {
            Text("Propriétés (\(viewModel.properties.count))")
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)
        }
    }
}

// MARK: - Preview

struct PropertiesListViewIntegrated_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            PropertiesListViewIntegrated()
        }
    }
}
