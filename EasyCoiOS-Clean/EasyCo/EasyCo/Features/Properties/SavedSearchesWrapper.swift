import SwiftUI

// MARK: - Saved Searches Wrapper
// Simple standalone view for saved searches accessible from menu

struct SavedSearchesWrapper: View {
    @StateObject private var viewModel = SavedSearchesWrapperViewModel()

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    LoadingView(message: "Chargement de vos recherches...")
                } else if viewModel.searches.isEmpty {
                    emptyStateView
                } else {
                    searchesList
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationTitle("Recherches sauvegardées")
            .navigationBarTitleDisplayMode(.inline)
        }
        .task {
            await viewModel.loadSearches()
        }
    }

    // MARK: - Searches List

    private var searchesList: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(viewModel.searches) { search in
                    SimpleSavedSearchCard(search: search) {
                        // Apply search logic here
                    } onDelete: {
                        viewModel.deleteSearch(search.id)
                    }
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

                Text("Sauvegardez vos recherches favorites pour y accéder rapidement")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - Simple Saved Search Card

struct SimpleSavedSearchCard: View {
    let search: SimpleSearch
    let onApply: () -> Void
    let onDelete: () -> Void
    @State private var showDeleteAlert = false

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(search.name)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    Text("Créée le \(search.createdAt.formatted(date: .abbreviated, time: .omitted))")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                Spacer()

                Button(action: { showDeleteAlert = true }) {
                    Image(systemName: "trash")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "EF4444"))
                        .padding(8)
                        .background(Color(hex: "FEF2F2"))
                        .clipShape(Circle())
                }
            }

            Divider()

            HStack(spacing: 16) {
                if let location = search.location {
                    Label(location, systemImage: "mappin.circle.fill")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                if let priceRange = search.priceRange {
                    Label(priceRange, systemImage: "eurosign.circle.fill")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }

            Button(action: onApply) {
                HStack {
                    Text("Appliquer cette recherche")
                    Image(systemName: "arrow.right")
                }
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "FFA040"))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
                .background(Color(hex: "FFF4ED"))
                .cornerRadius(8)
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
        .alert("Supprimer la recherche", isPresented: $showDeleteAlert) {
            Button("Annuler", role: .cancel) {}
            Button("Supprimer", role: .destructive) {
                onDelete()
            }
        } message: {
            Text("Voulez-vous vraiment supprimer cette recherche sauvegardée ?")
        }
    }
}

// MARK: - Simple Search Model

struct SimpleSearch: Identifiable {
    let id: UUID
    let name: String
    let location: String?
    let priceRange: String?
    let createdAt: Date
}

// MARK: - ViewModel

class SavedSearchesWrapperViewModel: ObservableObject {
    @Published var searches: [SimpleSearch] = []
    @Published var isLoading = false

    func loadSearches() async {
        isLoading = true

        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
            searches = [
                SimpleSearch(
                    id: UUID(),
                    name: "Studio Paris 15e",
                    location: "Paris 15e",
                    priceRange: "800-1000€",
                    createdAt: Date().addingTimeInterval(-86400 * 7)
                ),
                SimpleSearch(
                    id: UUID(),
                    name: "Appartement Lyon",
                    location: "Lyon",
                    priceRange: "700-900€",
                    createdAt: Date().addingTimeInterval(-86400 * 3)
                )
            ]
        }

        isLoading = false
    }

    func deleteSearch(_ id: UUID) {
        searches.removeAll { $0.id == id }
    }
}

// MARK: - Preview

struct SavedSearchesWrapper_Previews: PreviewProvider {
    static var previews: some View {
        SavedSearchesWrapper()
    }
}
