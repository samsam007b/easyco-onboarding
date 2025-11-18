import SwiftUI

// MARK: - Groups List View (Web App Design)

struct GroupsListView: View {
    @State private var groups: [SearchGroup] = []
    @State private var isLoading = false
    @State private var showCreateGroup = false

    var body: some View {
        NavigationStack {
            Group {
                if isLoading {
                    LoadingView(message: "Chargement des groupes...")
                } else if groups.isEmpty {
                    emptyStateView
                } else {
                    groupsList
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Groupes de recherche")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showCreateGroup = true }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(Color(hex: "FFA040"))
                    }
                }
            }
            // TODO: Implement CreateGroupView
            // .sheet(isPresented: $showCreateGroup) {
            //     CreateGroupView()
            // }
        }
        .task {
            await loadGroups()
        }
    }

    // MARK: - Groups List

    private var groupsList: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(groups) { group in
                    // TODO: Implement GroupDetailView
                    GroupCard(group: group)
                    .buttonStyle(PlainButtonStyle())
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
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "FFA040").opacity(0.2), Color(hex: "FFB85C").opacity(0.1)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 120, height: 120)

                Image(systemName: "person.3.fill")
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "FFA040"))
            }

            VStack(spacing: 12) {
                Text("Aucun groupe")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Créez un groupe pour rechercher un logement avec des colocataires")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            Button(action: { showCreateGroup = true }) {
                HStack(spacing: 8) {
                    Image(systemName: "plus")
                        .font(.system(size: 16, weight: .semibold))
                    Text("Créer un groupe")
                        .font(.system(size: 16, weight: .semibold))
                }
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
            .padding(.top, 8)

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Data Methods

    private func loadGroups() async {
        isLoading = true

        // Demo mode
        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
            groups = SearchGroup.mockGroups
        }

        isLoading = false
    }
}

// MARK: - Group Card

struct GroupCard: View {
    let group: SearchGroup

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            HStack(spacing: 12) {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 48, height: 48)
                    .overlay(
                        Image(systemName: "person.3.fill")
                            .font(.system(size: 20))
                            .foregroundColor(.white)
                    )

                VStack(alignment: .leading, spacing: 4) {
                    Text(group.name)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))

                    Text("\(group.members.count) membre\(group.members.count > 1 ? "s" : "")")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                Spacer()
            }

            // Description
            if !group.description.isEmpty {
                Text(group.description)
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "374151"))
                    .lineLimit(2)
            }

            // Preferences
            if let minPrice = group.preferences.minPrice, let maxPrice = group.preferences.maxPrice {
                HStack(spacing: 8) {
                    Image(systemName: "eurosign.circle.fill")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "10B981"))

                    Text("\(Int(minPrice))€ - \(Int(maxPrice))€/mois")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "374151"))
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(Color(hex: "F0FDF4"))
                .cornerRadius(999)
            }

            // Cities
            if !group.preferences.cities.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(group.preferences.cities, id: \.self) { city in
                            HStack(spacing: 4) {
                                Image(systemName: "mappin.circle.fill")
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "FFA040"))
                                Text(city)
                                    .font(.system(size: 13))
                                    .foregroundColor(Color(hex: "374151"))
                            }
                            .padding(.horizontal, 10)
                            .padding(.vertical, 6)
                            .background(Color(hex: "FFF4ED"))
                            .cornerRadius(999)
                        }
                    }
                }
            }

            Divider()

            // Actions
            HStack(spacing: 16) {
                Button(action: {}) {
                    HStack(spacing: 6) {
                        Image(systemName: "eye.fill")
                            .font(.system(size: 14))
                        Text("Voir les matchs")
                            .font(.system(size: 14, weight: .medium))
                    }
                    .foregroundColor(Color(hex: "FFA040"))
                }

                Spacer()

                Button(action: {}) {
                    Image(systemName: "ellipsis")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
    }
}

struct GroupsListView_Previews: PreviewProvider {
    static var previews: some View {
        GroupsListView()
    }
}
