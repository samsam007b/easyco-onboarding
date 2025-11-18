import SwiftUI

// MARK: - Group Detail View

struct GroupDetailView: View {
    let group: SearchGroup
    @StateObject private var viewModel = GroupDetailViewModel()
    @State private var selectedTab = 0

    var body: some View {
        VStack(spacing: 0) {
            // Header avec info du groupe
            groupHeader

            // Tabs
            Picker("", selection: $selectedTab) {
                Text("Propriétés").tag(0)
                Text("Membres").tag(1)
                Text("Chat").tag(2)
            }
            .pickerStyle(.segmented)
            .padding(16)
            .background(Color.white)

            // Content selon le tab
            Group {
                if selectedTab == 0 {
                    propertiesTab
                } else if selectedTab == 1 {
                    membersTab
                } else {
                    chatTab
                }
            }
        }
        .background(Color(hex: "F9FAFB"))
        .navigationTitle(group.name)
        .navigationBarTitleDisplayMode(.inline)
        .task {
            await viewModel.loadGroupData(groupId: group.id)
        }
    }

    // MARK: - Group Header

    private var groupHeader: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 8) {
                    Text(group.description)
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "374151"))
                        .lineLimit(3)

                    HStack(spacing: 16) {
                        Label("\(group.members.count) membres", systemImage: "person.3.fill")
                        Label("€\(group.preferences.minPrice)-\(group.preferences.maxPrice)", systemImage: "eurosign.circle.fill")
                    }
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "6B7280"))
                }

                Spacer()

                Menu {
                    Button(action: {}) {
                        Label("Modifier", systemImage: "pencil")
                    }
                    Button(action: {}) {
                        Label("Inviter des membres", systemImage: "person.badge.plus")
                    }
                    Button(role: .destructive, action: {}) {
                        Label("Quitter le groupe", systemImage: "rectangle.portrait.and.arrow.right")
                    }
                } label: {
                    Image(systemName: "ellipsis.circle")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }
        }
        .padding(16)
        .background(Color.white)
    }

    // MARK: - Properties Tab

    private var propertiesTab: some View {
        ScrollView {
            if viewModel.groupProperties.isEmpty {
                emptyPropertiesState
            } else {
                LazyVStack(spacing: 16) {
                    ForEach(viewModel.groupProperties) { property in
                        GroupPropertyCard(
                            property: property,
                            votes: viewModel.getVotes(for: property.id),
                            totalMembers: group.members.count,
                            currentUserVote: viewModel.getCurrentUserVote(for: property.id),
                            onVote: { vote in
                                viewModel.voteOnProperty(propertyId: property.id, vote: vote)
                            },
                            onApply: {
                                // TODO: Apply as group
                            }
                        )
                    }
                }
                .padding(16)
            }
        }
    }

    private var emptyPropertiesState: some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .fill(Color(hex: "FFF4ED"))
                    .frame(width: 100, height: 100)

                Image(systemName: "house.fill")
                    .font(.system(size: 40))
                    .foregroundColor(Color(hex: "FFA040"))
            }

            VStack(spacing: 8) {
                Text("Aucune propriété")
                    .font(.system(size: 18, weight: .bold))

                Text("Explorez les propriétés et ajoutez-les au groupe pour voter ensemble")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Members Tab

    private var membersTab: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(viewModel.members) { member in
                    MemberRow(
                        member: member,
                        isAdmin: member.id == group.adminID
                    )
                }

                // Invite button
                Button(action: {}) {
                    HStack {
                        Image(systemName: "person.badge.plus")
                            .foregroundColor(Color(hex: "FFA040"))
                        Text("Inviter un membre")
                            .font(.system(size: 15, weight: .medium))
                            .foregroundColor(Color(hex: "FFA040"))
                        Spacer()
                    }
                    .padding(16)
                    .background(Color.white)
                    .cornerRadius(12)
                }
            }
            .padding(16)
        }
    }

    // MARK: - Chat Tab

    private var chatTab: some View {
        VStack {
            Spacer()
            Text("Chat du groupe")
                .foregroundColor(Color(hex: "6B7280"))
            Text("(À implémenter)")
                .font(.system(size: 12))
                .foregroundColor(Color(hex: "9CA3AF"))
            Spacer()
        }
    }
}

// MARK: - Group Property Card

struct GroupPropertyCard: View {
    let property: Property
    let votes: PropertyVotes
    let totalMembers: Int
    let currentUserVote: VoteType?
    let onVote: (VoteType) -> Void
    let onApply: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Property image
            AsyncImage(url: URL(string: property.images.first ?? "")) { phase in
                switch phase {
                case .success(let image):
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                case .failure(_), .empty:
                    Rectangle()
                        .fill(Color(hex: "E5E7EB"))
                @unknown default:
                    EmptyView()
                }
            }
            .frame(height: 180)
            .cornerRadius(12)

            VStack(alignment: .leading, spacing: 12) {
                // Title and price
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(property.title)
                            .font(.system(size: 16, weight: .bold))
                            .lineLimit(2)

                        Text(property.city)
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "6B7280"))
                    }

                    Spacer()

                    Text("€\(Int(property.monthlyRent))")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "FFA040"))
                }

                // Votes
                VStack(alignment: .leading, spacing: 8) {
                    HStack(spacing: 4) {
                        Image(systemName: "person.3.fill")
                            .font(.system(size: 12))
                        Text("Votes du groupe")
                            .font(.system(size: 13, weight: .semibold))
                    }
                    .foregroundColor(Color(hex: "374151"))

                    HStack(spacing: 12) {
                        VoteButton(
                            type: .like,
                            count: votes.likes,
                            total: totalMembers,
                            isSelected: currentUserVote == .like,
                            onTap: { onVote(.like) }
                        )

                        VoteButton(
                            type: .maybe,
                            count: votes.maybes,
                            total: totalMembers,
                            isSelected: currentUserVote == .maybe,
                            onTap: { onVote(.maybe) }
                        )

                        VoteButton(
                            type: .dislike,
                            count: votes.dislikes,
                            total: totalMembers,
                            isSelected: currentUserVote == .dislike,
                            onTap: { onVote(.dislike) }
                        )
                    }
                }

                // Consensus indicator
                if votes.hasConsensus(totalMembers: totalMembers) {
                    HStack(spacing: 8) {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(Color(hex: "10B981"))
                        Text("Consensus atteint !")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(Color(hex: "10B981"))
                        Spacer()
                        Button("Candidater ensemble", action: onApply)
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color(hex: "10B981"))
                            .cornerRadius(999)
                    }
                    .padding(12)
                    .background(Color(hex: "F0FDF4"))
                    .cornerRadius(8)
                }
            }
            .padding(16)
        }
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
    }
}

// MARK: - Vote Button

struct VoteButton: View {
    let type: VoteType
    let count: Int
    let total: Int
    let isSelected: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 4) {
                Image(systemName: type.icon + (isSelected ? ".fill" : ""))
                    .font(.system(size: 18))
                    .foregroundColor(isSelected ? type.color : Color(hex: "6B7280"))

                Text("\(count)/\(total)")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(isSelected ? type.color : Color(hex: "6B7280"))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 8)
            .background(isSelected ? type.color.opacity(0.1) : Color(hex: "F3F4F6"))
            .cornerRadius(8)
        }
    }
}

// MARK: - Member Row

struct MemberRow: View {
    let member: GroupMember
    let isAdmin: Bool

    var body: some View {
        HStack(spacing: 12) {
            // Avatar
            Circle()
                .fill(Color(hex: "FFA040").opacity(0.2))
                .frame(width: 44, height: 44)
                .overlay(
                    Text(member.initials)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "FFA040"))
                )

            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 6) {
                    Text(member.name)
                        .font(.system(size: 15, weight: .semibold))
                    if isAdmin {
                        Text("Admin")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color(hex: "FFA040"))
                            .cornerRadius(4)
                    }
                }

                Text(member.email)
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Spacer()
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
    }
}

// MARK: - Supporting Models

enum VoteType {
    case like, maybe, dislike

    var icon: String {
        switch self {
        case .like: return "hand.thumbsup"
        case .maybe: return "questionmark.circle"
        case .dislike: return "hand.thumbsdown"
        }
    }

    var color: Color {
        switch self {
        case .like: return Color(hex: "10B981")
        case .maybe: return Color(hex: "FBBF24")
        case .dislike: return Color(hex: "EF4444")
        }
    }
}

struct PropertyVotes {
    var likes: Int
    var maybes: Int
    var dislikes: Int

    func hasConsensus(totalMembers: Int) -> Bool {
        // Consensus si au moins 75% des membres ont voté "like"
        let threshold = Double(totalMembers) * 0.75
        return Double(likes) >= threshold
    }
}

struct GroupMember: Identifiable {
    let id: UUID
    let name: String
    let email: String

    var initials: String {
        let components = name.components(separatedBy: " ")
        return components.compactMap { $0.first }.prefix(2).map { String($0) }.joined()
    }
}

// MARK: - ViewModel

class GroupDetailViewModel: ObservableObject {
    @Published var groupProperties: [Property] = []
    @Published var members: [GroupMember] = []
    @Published var votes: [UUID: PropertyVotes] = [:]
    @Published var userVotes: [UUID: VoteType] = [:]

    func loadGroupData(groupId: UUID) async {
        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
            groupProperties = Property.mockProperties.prefix(3).map { $0 }
            members = [
                GroupMember(id: UUID(), name: "Marie Dupont", email: "marie@example.com"),
                GroupMember(id: UUID(), name: "Thomas Martin", email: "thomas@example.com"),
                GroupMember(id: UUID(), name: "Sophie Bernard", email: "sophie@example.com")
            ]

            // Mock votes
            for property in groupProperties {
                votes[property.id] = PropertyVotes(likes: 2, maybes: 1, dislikes: 0)
            }
        }
    }

    func getVotes(for propertyId: UUID) -> PropertyVotes {
        votes[propertyId] ?? PropertyVotes(likes: 0, maybes: 0, dislikes: 0)
    }

    func getCurrentUserVote(for propertyId: UUID) -> VoteType? {
        userVotes[propertyId]
    }

    func voteOnProperty(propertyId: UUID, vote: VoteType) {
        // Remove previous vote if exists
        if let previousVote = userVotes[propertyId] {
            var currentVotes = votes[propertyId] ?? PropertyVotes(likes: 0, maybes: 0, dislikes: 0)
            switch previousVote {
            case .like: currentVotes.likes -= 1
            case .maybe: currentVotes.maybes -= 1
            case .dislike: currentVotes.dislikes -= 1
            }
            votes[propertyId] = currentVotes
        }

        // Add new vote
        userVotes[propertyId] = vote
        var currentVotes = votes[propertyId] ?? PropertyVotes(likes: 0, maybes: 0, dislikes: 0)
        switch vote {
        case .like: currentVotes.likes += 1
        case .maybe: currentVotes.maybes += 1
        case .dislike: currentVotes.dislikes += 1
        }
        votes[propertyId] = currentVotes
    }
}
