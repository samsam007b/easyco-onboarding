import SwiftUI

// MARK: - Groups List View

struct GroupsListView: View {
    @State private var groups: [SearchGroup] = []
    @State private var isLoading = false

    var body: some View {
        NavigationStack {
            VStack {
                if groups.isEmpty {
                    EmptyStateView.noGroups {
                        // Create group
                    }
                } else {
                    groupsList
                }
            }
            .navigationTitle("Groupes")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        // Create group
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
        }
        .task {
            await loadGroups()
        }
    }

    private var groupsList: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(groups) { group in
                    GroupCard(group: group)
                }
            }
            .padding()
        }
    }

    private func loadGroups() async {
        isLoading = true
        // Load from API
        isLoading = false
    }
}

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
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 2)
    }
}

struct GroupsListView_Previews: PreviewProvider {
    static var previews: some View {
        GroupsListView()
    }
}
