import SwiftUI

// MARK: - Groups List View

struct GroupsListView: View {
    @State private var groups: [Group] = []
    @State private var isLoading = false

    var body: some View {
        NavigationStack {
            Group {
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
            LazyVStack(spacing: Theme.Spacing.md) {
                ForEach(groups) { group in
                    NavigationLink(destination: GroupDetailView(group: group)) {
                        GroupCard(group: group)
                    }
                    .buttonStyle(PlainButtonStyle())
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
    let group: Group

    var body: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing.md) {
            HStack {
                Text(group.name)
                    .font(Theme.Typography.body(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Spacer()

                Image(systemName: group.status.icon)
                    .foregroundColor(Color(hex: group.status.color))
            }

            if let description = group.description {
                Text(description)
                    .font(Theme.Typography.bodySmall())
                    .foregroundColor(Theme.Colors.textSecondary)
                    .lineLimit(2)
            }

            HStack {
                Label("\(group.members.count)/\(group.maxMembers)", systemImage: "person.3.fill")
                Spacer()
                Text(group.status.displayName)
                    .font(Theme.Typography.caption(.semibold))
                    .foregroundColor(Color(hex: group.status.color))
            }
            .font(Theme.Typography.caption())
        }
        .padding()
        .background(Theme.Colors.background)
        .cornerRadius(Theme.CornerRadius.md)
        .themeShadow()
    }
}

struct GroupDetailView: View {
    let group: Group

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Theme.Spacing.lg) {
                Text(group.description ?? "")
                    .font(Theme.Typography.body())

                // Members
                VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                    Text("Membres (\(group.members.count)/\(group.maxMembers))")
                        .font(Theme.Typography.title3())

                    ForEach(group.members) { member in
                        HStack {
                            Circle()
                                .fill(Theme.Colors.primary.opacity(0.2))
                                .frame(width: 40, height: 40)
                            Text(member.displayName)
                        }
                    }
                }
            }
            .padding()
        }
        .navigationTitle(group.name)
    }
}

#Preview {
    GroupsListView()
}
