import SwiftUI

// MARK: - Groups List View

struct GroupsListView: View {
    @State private var groups: [SearchGroup] = []
    @State private var isLoading = false
    @State private var error: String?
    @State private var showCreateGroup = false
    @State private var selectedGroup: SearchGroup?

    var body: some View {
        NavigationStack {
            ZStack {
                if isLoading && groups.isEmpty {
                    ProgressView("Chargement...")
                } else if let error = error, groups.isEmpty {
                    errorView(message: error)
                } else if groups.isEmpty {
                    emptyState
                } else {
                    groupsList
                }
            }
            .navigationTitle("Groupes")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        showCreateGroup = true
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .refreshable {
                await loadGroups()
            }
            .sheet(isPresented: $showCreateGroup) {
                createGroupSheet
            }
            .sheet(item: $selectedGroup) { group in
                groupDetailSheet(group: group)
            }
        }
        .task {
            await loadGroups()
        }
    }

    private var emptyState: some View {
        VStack(spacing: 20) {
            Image(systemName: "person.3.fill")
                .font(.system(size: 60))
                .foregroundColor(Theme.Colors.primary.opacity(0.5))

            Text("Aucun groupe")
                .font(.title2)
                .fontWeight(.bold)

            Text("Créez un groupe de recherche pour chercher un logement avec vos futurs colocataires.")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)

            Button("Créer un groupe") {
                showCreateGroup = true
            }
            .buttonStyle(.borderedProminent)
        }
    }

    private var groupsList: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(groups) { group in
                    Button {
                        selectedGroup = group
                    } label: {
                        GroupCard(group: group)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding()
        }
    }

    private func errorView(message: String) -> some View {
        VStack(spacing: 16) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 50))
                .foregroundColor(.orange)
            Text("Erreur")
                .font(.headline)
            Text(message)
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            Button("Réessayer") {
                Task { await loadGroups() }
            }
            .buttonStyle(.borderedProminent)
        }
        .padding()
    }

    private var createGroupSheet: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Text("Créer un groupe")
                    .font(.title2)
                    .fontWeight(.bold)

                Text("Cette fonctionnalité sera bientôt disponible !")
                    .foregroundColor(.secondary)

                Button("Fermer") {
                    showCreateGroup = false
                }
                .buttonStyle(.borderedProminent)
            }
            .padding()
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Fermer") {
                        showCreateGroup = false
                    }
                }
            }
        }
    }

    private func groupDetailSheet(group: SearchGroup) -> some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Header
                    VStack(alignment: .leading, spacing: 8) {
                        Text(group.name)
                            .font(.title)
                            .fontWeight(.bold)

                        Text(group.description)
                            .font(.body)
                            .foregroundColor(.secondary)
                    }

                    Divider()

                    // Members
                    VStack(alignment: .leading, spacing: 12) {
                        Label("\(group.members.count) membres", systemImage: "person.3.fill")
                            .font(.headline)

                        // Preferences
                        if let minPrice = group.preferences.minPrice,
                           let maxPrice = group.preferences.maxPrice {
                            Label("Budget: €\(Int(minPrice)) - €\(Int(maxPrice))", systemImage: "eurosign.circle")
                        }

                        if !group.preferences.cities.isEmpty {
                            Label("Villes: \(group.preferences.cities.joined(separator: ", "))", systemImage: "mappin.circle")
                        }
                    }

                    Spacer()
                }
                .padding()
            }
            .navigationTitle("Détails du groupe")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Fermer") {
                        selectedGroup = nil
                    }
                }
            }
        }
    }

    private func loadGroups() async {
        isLoading = true
        error = nil

        do {
            groups = try await APIClient.shared.getGroups()
            print("✅ Loaded \(groups.count) groups")
        } catch {
            self.error = error.localizedDescription
            print("❌ Error loading groups: \(error)")

            // Fallback to mock data in demo mode
            if AppConfig.FeatureFlags.demoMode {
                groups = SearchGroup.mockGroups
            }
        }

        isLoading = false
    }
}

// MARK: - Group Card

struct GroupCard: View {
    let group: SearchGroup

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(group.name)
                .font(.headline)

            Text(group.description)
                .font(.caption)
                .foregroundColor(.secondary)
                .lineLimit(2)

            HStack {
                Label("\(group.members.count) membres", systemImage: "person.3.fill")
                    .font(.caption)
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 2)
    }
}

// MARK: - Make SearchGroup work with sheet(item:)

extension SearchGroup: @retroactive Hashable {
    public static func == (lhs: SearchGroup, rhs: SearchGroup) -> Bool {
        lhs.id == rhs.id
    }

    public func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}

// MARK: - Preview

struct GroupsListView_Previews: PreviewProvider {
    static var previews: some View {
        GroupsListView()
    }
}
