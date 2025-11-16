import Foundation
import Combine

// MARK: - Sort Options

enum PropertySortOption {
    case bestMatch
    case newest
    case priceLow
    case priceHigh

    var displayName: String {
        switch self {
        case .bestMatch: return "🎯 Meilleur match"
        case .newest: return "Plus récent"
        case .priceLow: return "Prix: Croissant"
        case .priceHigh: return "Prix: Décroissant"
        }
    }
}

// MARK: - Properties ViewModel

@MainActor
class PropertiesViewModel: ObservableObject {
    @Published var properties: [Property] = []
    @Published var isLoading = false
    @Published var error: NetworkError?
    @Published var searchQuery = ""
    @Published var filters = PropertyFilters()
    @Published var showFilters = false
    @Published var sortBy: PropertySortOption = .bestMatch

    private let apiClient = APIClient.shared
    private var cancellables = Set<AnyCancellable>()
    private var currentPage = 1
    private var hasMorePages = true

    // Computed property for filtered and sorted properties
    var filteredProperties: [Property] {
        var result = properties

        // Apply sorting
        switch sortBy {
        case .bestMatch:
            result.sort { ($0.compatibilityScore ?? 0) > ($1.compatibilityScore ?? 0) }
        case .newest:
            result.sort { $0.createdAt > $1.createdAt }
        case .priceLow:
            result.sort { $0.monthlyRent < $1.monthlyRent }
        case .priceHigh:
            result.sort { $0.monthlyRent > $1.monthlyRent }
        }

        return result
    }

    // Count active filters
    var activeFiltersCount: Int {
        var count = 0
        if filters.minPrice != 0 || filters.maxPrice != 5000 { count += 1 }
        if !filters.cities.isEmpty { count += 1 }
        if !filters.propertyTypes.isEmpty { count += 1 }
        if filters.minBedrooms != nil { count += 1 }
        if !filters.amenities.isEmpty { count += 1 }
        return count
    }

    init() {
        setupSearchDebounce()
        Task {
            await loadProperties()
        }
    }

    // MARK: - Data Loading

    func loadProperties(refresh: Bool = false) async {
        guard !isLoading else { return }

        if refresh {
            properties = []
            currentPage = 1
            hasMorePages = true
        }

        guard hasMorePages else { return }

        isLoading = true
        error = nil

        do {
            let newProperties: [Property]

            // Mode démo : génère des propriétés factices
            if AppConfig.FeatureFlags.demoMode {
                try await Task.sleep(nanoseconds: 500_000_000) // Simule 0.5 seconde
                newProperties = generateDemoProperties()
            } else {
                newProperties = try await apiClient.getProperties(filters: filters)
            }

            if refresh {
                properties = newProperties
            } else {
                properties.append(contentsOf: newProperties)
            }

            hasMorePages = newProperties.count >= AppConfig.Pagination.defaultPageSize
            currentPage += 1

        } catch {
            self.error = error as? NetworkError ?? .unknown(error)
        }

        isLoading = false
    }

    // MARK: - Demo Data

    private func generateDemoProperties() -> [Property] {
        // Use mock properties from Property model
        return Property.mockProperties
    }

    func loadMoreIfNeeded(currentProperty property: Property) async {
        guard let index = properties.firstIndex(where: { $0.id == property.id }) else {
            return
        }

        let thresholdIndex = properties.index(properties.endIndex, offsetBy: -5)
        if index >= thresholdIndex {
            await loadProperties()
        }
    }

    // MARK: - Search

    private func setupSearchDebounce() {
        $searchQuery
            .debounce(for: .milliseconds(500), scheduler: DispatchQueue.main)
            .sink { [weak self] query in
                Task {
                    await self?.search(query: query)
                }
            }
            .store(in: &cancellables)
    }

    private func search(query: String) async {
        guard !query.isEmpty else {
            await loadProperties(refresh: true)
            return
        }

        isLoading = true
        error = nil

        do {
            // TODO: Implement search endpoint
            properties = try await apiClient.getProperties(filters: filters)
        } catch {
            self.error = error as? NetworkError ?? .unknown(error)
        }

        isLoading = false
    }

    // MARK: - Filters

    func applyFilters() async {
        showFilters = false
        await loadProperties(refresh: true)
    }

    func clearFilters() {
        filters = PropertyFilters()
        Task {
            await loadProperties(refresh: true)
        }
    }

    // MARK: - Favorites

    func toggleFavorite(_ property: Property) async {
        do {
            // TODO: Check if already favorited
            try await apiClient.addFavorite(propertyId: property.id.uuidString)

            // Update local state
            if let index = properties.firstIndex(where: { $0.id == property.id }) {
                // properties[index].isFavorited.toggle()
            }
        } catch {
            self.error = error as? NetworkError ?? .unknown(error)
        }
    }
}
