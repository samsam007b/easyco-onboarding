import Foundation
import Combine

// MARK: - Properties ViewModel

@MainActor
class PropertiesViewModel: ObservableObject {
    @Published var properties: [Property] = []
    @Published var isLoading = false
    @Published var error: NetworkError?
    @Published var searchQuery = ""
    @Published var filters = PropertyFilters()
    @Published var showFilters = false

    private let apiClient = APIClient.shared
    private var cancellables = Set<AnyCancellable>()
    private var currentPage = 1
    private var hasMorePages = true

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
            let newProperties = try await apiClient.getProperties(filters: filters)

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

    func clearFilters() async {
        filters = PropertyFilters()
        await loadProperties(refresh: true)
    }

    // MARK: - Favorites

    func toggleFavorite(_ property: Property) async {
        do {
            // TODO: Check if already favorited
            try await apiClient.addFavorite(propertyId: property.id)

            // Update local state
            if let index = properties.firstIndex(where: { $0.id == property.id }) {
                // properties[index].isFavorited.toggle()
            }
        } catch {
            self.error = error as? NetworkError ?? .unknown(error)
        }
    }
}
