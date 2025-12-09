import SwiftUI
import Combine

// MARK: - Search Bar View with Debouncing

struct SearchBarView: View {
    @Binding var searchText: String
    @FocusState private var isFocused: Bool
    @StateObject private var viewModel = SearchViewModel()

    let placeholder: String
    let onSearchTextChange: (String) -> Void
    let onSuggestionSelected: ((String) -> Void)?

    init(
        searchText: Binding<String>,
        placeholder: String = "Rechercher...",
        onSearchTextChange: @escaping (String) -> Void,
        onSuggestionSelected: ((String) -> Void)? = nil
    ) {
        self._searchText = searchText
        self.placeholder = placeholder
        self.onSearchTextChange = onSearchTextChange
        self.onSuggestionSelected = onSuggestionSelected
    }

    var body: some View {
        VStack(spacing: 0) {
            // Search Input
            HStack(spacing: 12) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: "6B7280"))

                TextField(placeholder, text: $searchText)
                    .font(.system(size: 15))
                    .focused($isFocused)
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
                    .submitLabel(.search)
                    .onChange(of: searchText) { newValue in
                        viewModel.searchText = newValue
                    }

                if !searchText.isEmpty {
                    Button(action: {
                        searchText = ""
                        viewModel.searchText = ""
                        isFocused = false
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 16))
                            .foregroundColor(Color(hex: "9CA3AF"))
                    }
                }

                if viewModel.isSearching {
                    ProgressView()
                        .scaleEffect(0.8)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color(hex: "F3F4F6"))
            .cornerRadius(12)

            // Suggestions
            if isFocused && !viewModel.suggestions.isEmpty {
                suggestionsView
            }
        }
        .onReceive(viewModel.$debouncedSearchText) { debouncedText in
            onSearchTextChange(debouncedText)
        }
    }

    // MARK: - Suggestions View

    private var suggestionsView: some View {
        VStack(spacing: 0) {
            ForEach(viewModel.suggestions, id: \.self) { suggestion in
                Button(action: {
                    searchText = suggestion
                    onSuggestionSelected?(suggestion)
                    isFocused = false
                }) {
                    HStack(spacing: 12) {
                        Image(systemName: "mappin.circle.fill")
                            .font(.system(size: 16))
                            .foregroundColor(Color(hex: "FFA040"))

                        Text(suggestion)
                            .font(.system(size: 15))
                            .foregroundColor(Color(hex: "111827"))

                        Spacer()

                        Image(systemName: "arrow.up.left")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "9CA3AF"))
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                }
                .buttonStyle(PlainButtonStyle())

                if suggestion != viewModel.suggestions.last {
                    Divider()
                        .padding(.leading, 48)
                }
            }
        }
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)
        .padding(.top, 8)
    }
}

// MARK: - Search ViewModel

class SearchViewModel: ObservableObject {
    @Published var searchText = ""
    @Published var debouncedSearchText = ""
    @Published var suggestions: [String] = []
    @Published var isSearching = false
    @Published var searchHistory: [String] = []

    private var cancellables = Set<AnyCancellable>()
    private let debounceDelay: TimeInterval = 0.5 // 500ms

    init() {
        loadSearchHistory()
        setupDebouncing()
    }

    private func setupDebouncing() {
        $searchText
            .debounce(for: .milliseconds(Int(debounceDelay * 1000)), scheduler: DispatchQueue.main)
            .sink { [weak self] text in
                self?.debouncedSearchText = text
                if !text.isEmpty {
                    self?.fetchSuggestions(for: text)
                } else {
                    self?.suggestions = self?.searchHistory ?? []
                }
            }
            .store(in: &cancellables)

        // Show history when search is active
        $searchText
            .sink { [weak self] text in
                if text.isEmpty {
                    self?.suggestions = self?.searchHistory ?? []
                }
            }
            .store(in: &cancellables)
    }

    private func fetchSuggestions(for query: String) {
        isSearching = true

        _Concurrency.Task {
            // Simulate API call delay
            try? await _Concurrency.Task.sleep(nanoseconds: 200_000_000) // 200ms

            await MainActor.run {
                if AppConfig.FeatureFlags.demoMode {
                    self.suggestions = self.getMockSuggestions(for: query)
                } else {
                    // TODO: Fetch real suggestions from API
                    self.suggestions = []
                }
                self.isSearching = false
            }
        }
    }

    private func getMockSuggestions(for query: String) -> [String] {
        let cities = [
            "Paris", "Paris 1er", "Paris 2e", "Paris 3e", "Paris 10e",
            "Lyon", "Lyon 1er", "Lyon 2e", "Lyon 6e",
            "Marseille", "Marseille Centre",
            "Bruxelles", "Ixelles", "Etterbeek", "Saint-Gilles",
            "Bordeaux", "Bordeaux Centre",
            "Toulouse", "Toulouse Centre",
            "Nantes", "Nantes Centre"
        ]

        return cities
            .filter { $0.localizedCaseInsensitiveContains(query) }
            .prefix(5)
            .map { $0 }
    }

    func addToHistory(_ query: String) {
        guard !query.isEmpty else { return }

        // Remove if already exists
        searchHistory.removeAll { $0 == query }

        // Add to beginning
        searchHistory.insert(query, at: 0)

        // Keep only last 10
        if searchHistory.count > 10 {
            searchHistory = Array(searchHistory.prefix(10))
        }

        saveSearchHistory()
    }

    private func loadSearchHistory() {
        if let data = UserDefaults.standard.data(forKey: "search_history"),
           let history = try? JSONDecoder().decode([String].self, from: data) {
            searchHistory = history
        }
    }

    private func saveSearchHistory() {
        if let encoded = try? JSONEncoder().encode(searchHistory) {
            UserDefaults.standard.set(encoded, forKey: "search_history")
        }
    }

    func clearHistory() {
        searchHistory = []
        UserDefaults.standard.removeObject(forKey: "search_history")
    }
}

// MARK: - Preview

struct SearchBarView_Previews: PreviewProvider {
    @State static var searchText = ""

    static var previews: some View {
        VStack {
            SearchBarView(
                searchText: $searchText,
                placeholder: "Ville, quartier...",
                onSearchTextChange: { text in
                    print("Searching for: \(text)")
                },
                onSuggestionSelected: { suggestion in
                    print("Selected: \(suggestion)")
                }
            )
            .padding()

            Spacer()
        }
        .background(Color(hex: "F9FAFB"))
    }
}
