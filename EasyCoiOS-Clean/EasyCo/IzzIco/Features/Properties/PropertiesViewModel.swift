//
//  PropertiesViewModel.swift
//  IzzIco
//
//  ViewModel for properties list
//

import Foundation
import Combine

enum PropertySortOption {
    case bestMatch, newest, priceLow, priceHigh

    var displayName: String {
        switch self {
        case .bestMatch: return "🎯 Meilleur match"
        case .newest: return "Plus récent"
        case .priceLow: return "Prix: Croissant"
        case .priceHigh: return "Prix: Décroissant"
        }
    }
}

@MainActor
class PropertiesViewModel: ObservableObject {
    @Published var properties: [Property] = []
    @Published var isLoading = false
    @Published var error: AppError?
    @Published var currentPage = 1
    @Published var hasMorePages = true
    @Published var showFilters = false
    @Published var sortBy: PropertySortOption = .bestMatch

    @Published var filters: PropertyFilters? {
        didSet {
            // Reset and reload when filters change
            currentPage = 1
            properties = []
            hasMorePages = true
            Task {
                await loadProperties()
            }
        }
    }

    private let propertyService = PropertyService.shared
    private var cancellables = Set<AnyCancellable>()

    private let itemsPerPage = 20

    // MARK: - Computed Properties

    var activeFiltersCount: Int {
        guard let filters = filters else { return 0 }
        var count = 0
        if filters.city != nil { count += 1 }
        if filters.minPrice != nil { count += 1 }
        if filters.maxPrice != nil { count += 1 }
        if filters.propertyTypes != nil && !filters.propertyTypes!.isEmpty { count += 1 }
        if filters.minBedrooms != nil { count += 1 }
        return count
    }

    var filteredProperties: [Property] {
        // For now, just return all properties
        // The filtering is done server-side via filters parameter
        return properties
    }

    // MARK: - Load Properties

    func loadProperties(refresh: Bool = false) async {
        guard !isLoading else { return }

        if refresh {
            currentPage = 1
            properties = []
            hasMorePages = true
        }

        isLoading = true
        error = nil

        do {
            let fetchedProperties = try await propertyService.getProperties(filters: filters)

            // For now, we load all properties at once
            // TODO: Implement proper pagination when backend supports it
            if currentPage == 1 {
                properties = fetchedProperties
            } else {
                properties.append(contentsOf: fetchedProperties)
            }

            // No pagination for now
            hasMorePages = false

            isLoading = false

        } catch let appError as AppError {
            error = appError
            isLoading = false
        } catch {
            self.error = .unknown(error)
            isLoading = false
        }
    }

    // MARK: - Load More (Pagination)

    func loadMoreIfNeeded(currentProperty property: Property) async {
        // Check if we're near the end of the list
        guard let index = properties.firstIndex(where: { $0.id == property.id }) else {
            return
        }

        let thresholdIndex = properties.count - 5
        if index >= thresholdIndex && hasMorePages && !isLoading {
            currentPage += 1
            await loadProperties()
        }
    }

    // MARK: - Refresh

    func refresh() async {
        currentPage = 1
        hasMorePages = true
        await loadProperties()
    }

    // MARK: - Get Property Detail

    func getPropertyDetail(id: String) async -> Property? {
        // For now, search in loaded properties
        // TODO: Add API call when backend supports single property fetch
        return properties.first { $0.id.uuidString == id }
    }

    // MARK: - Apply Filters

    func applyFilters(
        minPrice: Int? = nil,
        maxPrice: Int? = nil,
        propertyTypes: [PropertyType]? = nil,
        bedrooms: Int? = nil,
        bathrooms: Int? = nil
    ) {
        var newFilters = PropertyFilters()
        newFilters.minPrice = minPrice
        newFilters.maxPrice = maxPrice
        newFilters.propertyTypes = propertyTypes
        newFilters.minBedrooms = bedrooms
        newFilters.minBathrooms = bathrooms
        filters = newFilters
    }

    func clearFilters() {
        filters = nil
    }

    // MARK: - Favorites

    func toggleFavorite(_ property: Property) async {
        // TODO: Implement favorite toggle with API
        print("Toggle favorite for property: \(property.id)")
    }
}
