import SwiftUI

// MARK: - Saved Searches View

struct SavedSearchesView: View {
    @StateObject private var viewModel = SavedSearchesViewModel()
    @Environment(\.dismiss) private var dismiss
    @State private var showSaveSearchSheet = false
    @State private var searchName = ""
    @Binding var currentFilters: PropertyFilters

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    LoadingView(message: "Chargement de vos recherches...")
                } else if viewModel.savedSearches.isEmpty {
                    emptyStateView
                } else {
                    searchesList
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationTitle("Recherches sauvegardées")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showSaveSearchSheet = true }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(Color(hex: "FFA040"))
                    }
                }
            }
            .sheet(isPresented: $showSaveSearchSheet) {
                SaveSearchSheet(
                    searchName: $searchName,
                    filters: currentFilters,
                    onSave: { name in
                        viewModel.saveSearch(name: name, filters: currentFilters)
                        showSaveSearchSheet = false
                        searchName = ""
                    }
                )
            }
        }
        .task {
            await viewModel.loadSavedSearches()
        }
    }

    // MARK: - Searches List

    private var searchesList: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(viewModel.savedSearches) { search in
                    SavedSearchCard(
                        search: search,
                        onApply: {
                            currentFilters = search.filters
                            dismiss()
                        },
                        onToggleNotifications: {
                            viewModel.toggleNotifications(for: search.id)
                        },
                        onDelete: {
                            viewModel.deleteSearch(search.id)
                        }
                    )
                }
            }
            .padding(16)
        }
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .fill(Color(hex: "FFF4ED"))
                    .frame(width: 120, height: 120)

                Image(systemName: "bookmark.fill")
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "FFA040"))
            }

            VStack(spacing: 12) {
                Text("Aucune recherche sauvegardée")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Sauvegardez vos critères pour retrouver facilement vos logements préférés")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            Button(action: { showSaveSearchSheet = true }) {
                HStack(spacing: 8) {
                    Image(systemName: "plus")
                    Text("Sauvegarder une recherche")
                }
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.white)
                .frame(maxWidth: 280)
                .padding(.vertical, 16)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(999)
                .shadow(color: Color(hex: "FFA040").opacity(0.3), radius: 8, x: 0, y: 4)
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - Saved Search Card

struct SavedSearchCard: View {
    let search: SavedSearch
    let onApply: () -> Void
    let onToggleNotifications: () -> Void
    let onDelete: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(search.name)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))

                    Text("Créée le \(search.createdAt.formatted(date: .abbreviated, time: .omitted))")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                Spacer()

                Button(action: onDelete) {
                    Image(systemName: "trash")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "EF4444"))
                }
            }

            VStack(alignment: .leading, spacing: 8) {
                if !search.filters.cities.isEmpty {
                    FilterSummaryRow(
                        icon: "mappin.circle.fill",
                        text: search.filters.cities.prefix(3).joined(separator: ", ")
                    )
                }

                FilterSummaryRow(
                    icon: "eurosign.circle.fill",
                    text: "€\(search.filters.minPrice) - €\(search.filters.maxPrice)"
                )

                if !search.filters.propertyTypes.isEmpty {
                    FilterSummaryRow(
                        icon: "house.circle.fill",
                        text: search.filters.propertyTypes.map { $0.displayName }.joined(separator: ", ")
                    )
                }
            }

            Divider()

            HStack(spacing: 12) {
                Button(action: onToggleNotifications) {
                    HStack(spacing: 6) {
                        Image(systemName: search.notificationsEnabled ? "bell.fill" : "bell.slash.fill")
                        Text(search.notificationsEnabled ? "Notif. ON" : "Notif. OFF")
                    }
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(search.notificationsEnabled ? Color(hex: "10B981") : Color(hex: "6B7280"))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(Color(hex: "F3F4F6"))
                    .cornerRadius(999)
                }

                Spacer()

                Button(action: onApply) {
                    HStack(spacing: 6) {
                        Image(systemName: "magnifyingglass")
                        Text("Appliquer")
                    }
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(Color(hex: "FFA040"))
                    .cornerRadius(999)
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
    }
}

// MARK: - Filter Summary Row

struct FilterSummaryRow: View {
    let icon: String
    let text: String

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: icon)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "FFA040"))

            Text(text)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "374151"))
                .lineLimit(1)
        }
    }
}

// MARK: - Save Search Sheet

struct SaveSearchSheet: View {
    @Binding var searchName: String
    let filters: PropertyFilters
    let onSave: (String) -> Void
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                ZStack {
                    Circle()
                        .fill(Color(hex: "FFF4ED"))
                        .frame(width: 80, height: 80)

                    Image(systemName: "bookmark.fill")
                        .font(.system(size: 32))
                        .foregroundColor(Color(hex: "FFA040"))
                }
                .padding(.top, 32)

                VStack(spacing: 8) {
                    Text("Sauvegarder cette recherche")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))

                    Text("Retrouvez facilement vos critères et recevez des notifications")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 32)
                }

                VStack(alignment: .leading, spacing: 8) {
                    Text("Nom de la recherche")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "374151"))

                    TextField("Ex: Studio Paris Centre", text: $searchName)
                        .font(.system(size: 16))
                        .padding(12)
                        .background(Color(hex: "F3F4F6"))
                        .cornerRadius(8)
                }
                .padding(.horizontal, 24)

                Spacer()

                VStack(spacing: 12) {
                    Button(action: {
                        if !searchName.isEmpty {
                            onSave(searchName)
                        }
                    }) {
                        Text("Sauvegarder")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(
                                LinearGradient(
                                    colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(999)
                            .opacity(searchName.isEmpty ? 0.5 : 1.0)
                    }
                    .disabled(searchName.isEmpty)

                    Button(action: { dismiss() }) {
                        Text("Annuler")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 32)
            }
            .background(Color.white)
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

// MARK: - ViewModel

class SavedSearchesViewModel: ObservableObject {
    @Published var savedSearches: [SavedSearch] = []
    @Published var isLoading = false
    @Published var error: String?

    func loadSavedSearches() async {
        isLoading = true

        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
            savedSearches = SavedSearch.mockSearches
        }

        isLoading = false
    }

    func saveSearch(name: String, filters: PropertyFilters) {
        let newSearch = SavedSearch(name: name, filters: filters)
        savedSearches.insert(newSearch, at: 0)
    }

    func toggleNotifications(for searchId: UUID) {
        if let index = savedSearches.firstIndex(where: { $0.id == searchId }) {
            savedSearches[index].notificationsEnabled.toggle()
        }
    }

    func deleteSearch(_ searchId: UUID) {
        savedSearches.removeAll { $0.id == searchId }
    }
}
