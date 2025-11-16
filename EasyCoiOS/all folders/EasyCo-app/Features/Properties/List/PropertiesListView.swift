import SwiftUI

// MARK: - Properties List View

struct PropertiesListView: View {
    @StateObject private var viewModel = PropertiesViewModel()

    var body: some View {
        NavigationStack {
            ZStack {
                if viewModel.isLoading && viewModel.properties.isEmpty {
                    LoadingView(message: "Chargement des propriétés...")
                } else if let error = viewModel.error, viewModel.properties.isEmpty {
                    ErrorView(error: error) {
                        Task {
                            await viewModel.loadProperties(refresh: true)
                        }
                    }
                } else if viewModel.properties.isEmpty {
                    EmptyStateView.noProperties {
                        viewModel.showFilters = true
                    }
                } else {
                    propertyList
                }
            }
            .navigationTitle("Explorer")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        viewModel.showFilters = true
                    } label: {
                        Image(systemName: "line.3.horizontal.decrease.circle")
                    }
                }
            }
            .sheet(isPresented: $viewModel.showFilters) {
                FiltersView(viewModel: viewModel)
            }
        }
    }

    private var propertyList: some View {
        ScrollView {
            LazyVStack(spacing: Theme.Spacing.md) {
                // Search Bar
                SearchBar(text: $viewModel.searchQuery, placeholder: "Rechercher une ville...")
                    .padding(.horizontal)

                // Properties
                ForEach(viewModel.properties) { property in
                    NavigationLink(destination: PropertyDetailView(property: property)) {
                        PropertyCardView(property: property) {
                            Task {
                                await viewModel.toggleFavorite(property)
                            }
                        }
                    }
                    .buttonStyle(PlainButtonStyle())
                    .task {
                        await viewModel.loadMoreIfNeeded(currentProperty: property)
                    }
                }

                // Loading More
                if viewModel.isLoading {
                    InlineLoadingView()
                }
            }
            .padding(.vertical)
        }
        .refreshable {
            await viewModel.loadProperties(refresh: true)
        }
    }
}

// MARK: - Preview

#Preview {
    PropertiesListView()
}
