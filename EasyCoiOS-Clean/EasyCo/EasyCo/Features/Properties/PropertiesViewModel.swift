//
//  PropertiesViewModel.swift
//  EasyCo
//
//  ViewModel for properties list
//

import Foundation
import Combine

@MainActor
class PropertiesViewModel: ObservableObject {
    @Published var properties: [Property] = []
    @Published var isLoading = false
    @Published var error: AppError?
    @Published var currentPage = 1
    @Published var hasMorePages = true

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

    // MARK: - Load Properties

    func loadProperties() async {
        guard !isLoading else { return }

        isLoading = true
        error = nil

        do {
            let response = try await propertyService.getProperties(
                page: currentPage,
                limit: itemsPerPage,
                filters: filters
            )

            // Append new properties
            if currentPage == 1 {
                properties = response.properties
            } else {
                properties.append(contentsOf: response.properties)
            }

            // Check if more pages available
            hasMorePages = currentPage < response.totalPages

            isLoading = false

        } catch let apiError as APIError {
            error = apiError.toAppError
            isLoading = false
        } catch {
            self.error = .server
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
        do {
            return try await propertyService.getProperty(id: id)
        } catch {
            print("Error fetching property detail: \(error)")
            return nil
        }
    }

    // MARK: - Apply Filters

    func applyFilters(
        minPrice: Int? = nil,
        maxPrice: Int? = nil,
        propertyType: PropertyType? = nil,
        bedrooms: Int? = nil,
        bathrooms: Int? = nil,
        amenities: [String]? = nil
    ) {
        filters = PropertyFilters(
            minPrice: minPrice,
            maxPrice: maxPrice,
            propertyType: propertyType,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            amenities: amenities
        )
    }

    func clearFilters() {
        filters = nil
    }
}
