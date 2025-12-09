import SwiftUI

// MARK: - Hub Members View (Resident)

struct HubMembersView: View {
    @StateObject private var viewModel = HubMembersViewModel()
    @State private var showInvite = false
    @State private var selectedMember: HubMember?
    @State private var showMemberActions = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Household header
                    householdHeader

                    // Members list
                    membersListSection

                    // Stats overview
                    statsOverviewSection

                    // Quick actions
                    quickActionsSection
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Membres")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                ToolbarItem(placement: .topBarTrailing) {
                    Button(action: { showInvite = true }) {
                        Image(systemName: "person.badge.plus")
                            .font(.system(size: 18))
                            .foregroundColor(Color(hex: "10B981"))
                    }
                }
            }
            .sheet(isPresented: $showInvite) {
                HubInviteView()
            }
            .sheet(item: $selectedMember) { member in
                MemberDetailSheet(member: member, viewModel: viewModel)
            }
        }
        .task {
            await viewModel.loadMembers()
        }
    }

    // MARK: - Household Header

    private var householdHeader: some View {
        VStack(spacing: 16) {
            // Property info
            HStack(spacing: 16) {
                // Property image
                ZStack {
                    RoundedRectangle(cornerRadius: 16)
                        .fill(
                            LinearGradient(
                                colors: [Color(hex: "10B981"), Color(hex: "34D399")],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 70, height: 70)

                    Image(systemName: "house.fill")
                        .font(.system(size: 28))
                        .foregroundColor(.white)
                }

                VStack(alignment: .leading, spacing: 6) {
                    Text(viewModel.householdName)
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))

                    Text(viewModel.householdAddress)
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))

                    // Members count badge
                    HStack(spacing: 4) {
                        Image(systemName: "person.2.fill")
                            .font(.system(size: 12))
                        Text("\(viewModel.members.count) membres")
                            .font(.system(size: 13, weight: .medium))
                    }
                    .foregroundColor(Color(hex: "10B981"))
                }

                Spacer()
            }

            // Member avatars row
            HStack(spacing: -12) {
                ForEach(viewModel.members.prefix(5)) { member in
                    MemberAvatar(member: member, size: 44)
                        .overlay(
                            Circle()
                                .stroke(Color.white, lineWidth: 3)
                        )
                }

                if viewModel.members.count > 5 {
                    ZStack {
                        Circle()
                            .fill(Color(hex: "F3F4F6"))
                            .frame(width: 44, height: 44)

                        Text("+\(viewModel.members.count - 5)")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                    .overlay(
                        Circle()
                            .stroke(Color.white, lineWidth: 3)
                    )
                }

                Spacer()
            }
        }
        .padding(20)
        .background(Color.white)
        .cornerRadius(20)
        .shadow(color: .black.opacity(0.06), radius: 10, x: 0, y: 4)
    }

    // MARK: - Members List Section

    private var membersListSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Tous les membres")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                // Filter button
                Menu {
                    Button("Tous") { viewModel.filter = .all }
                    Button("Admins") { viewModel.filter = .admins }
                    Button("Membres") { viewModel.filter = .members }
                } label: {
                    HStack(spacing: 4) {
                        Text(viewModel.filter.rawValue)
                            .font(.system(size: 14, weight: .medium))
                        Image(systemName: "chevron.down")
                            .font(.system(size: 12))
                    }
                    .foregroundColor(Color(hex: "6B7280"))
                }
            }

            VStack(spacing: 0) {
                ForEach(viewModel.filteredMembers) { member in
                    MemberRow(member: member) {
                        selectedMember = member
                    }

                    if member.id != viewModel.filteredMembers.last?.id {
                        Divider()
                            .padding(.horizontal, 16)
                    }
                }
            }
            .background(Color.white)
            .cornerRadius(16)
        }
    }

    // MARK: - Stats Overview Section

    private var statsOverviewSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Contributions")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            LazyVGrid(columns: [
                GridItem(.flexible(), spacing: 12),
                GridItem(.flexible(), spacing: 12)
            ], spacing: 12) {
                ContributionStatCard(
                    title: "Tâches complétées",
                    value: "\(viewModel.totalTasksCompleted)",
                    icon: "checkmark.circle.fill",
                    color: Color(hex: "10B981")
                )

                ContributionStatCard(
                    title: "Dépenses partagées",
                    value: String(format: "€%.0f", viewModel.totalSharedExpenses),
                    icon: "eurosign.circle.fill",
                    color: Color(hex: "6366F1")
                )

                ContributionStatCard(
                    title: "Événements créés",
                    value: "\(viewModel.totalEventsCreated)",
                    icon: "calendar.circle.fill",
                    color: Color(hex: "F59E0B")
                )

                ContributionStatCard(
                    title: "Messages envoyés",
                    value: "\(viewModel.totalMessages)",
                    icon: "message.circle.fill",
                    color: Color(hex: "EC4899")
                )
            }
        }
    }

    // MARK: - Quick Actions Section

    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Actions rapides")
                .font(.system(size: 18, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            VStack(spacing: 12) {
                QuickActionRow(
                    icon: "person.badge.plus",
                    title: "Inviter un colocataire",
                    subtitle: "Partagez votre espace",
                    color: Color(hex: "10B981")
                ) {
                    showInvite = true
                }

                QuickActionRow(
                    icon: "gearshape.fill",
                    title: "Paramètres du foyer",
                    subtitle: "Gérer les règles et préférences",
                    color: Color(hex: "6B7280")
                ) {
                    // Navigate to settings
                }

                QuickActionRow(
                    icon: "chart.bar.fill",
                    title: "Voir les statistiques",
                    subtitle: "Contributions et activité",
                    color: Color(hex: "6366F1")
                ) {
                    // Navigate to stats
                }
            }
        }
    }
}

// MARK: - Member Avatar

struct MemberAvatar: View {
    let member: HubMember
    let size: CGFloat

    var body: some View {
        ZStack {
            if let imageUrl = member.avatarUrl, let url = URL(string: imageUrl) {
                AsyncImage(url: url) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(width: size, height: size)
                            .clipShape(Circle())
                    case .failure(_), .empty:
                        defaultAvatar
                    @unknown default:
                        defaultAvatar
                    }
                }
            } else {
                defaultAvatar
            }

            // Online indicator
            if member.isOnline {
                Circle()
                    .fill(Color(hex: "10B981"))
                    .frame(width: 12, height: 12)
                    .overlay(
                        Circle()
                            .stroke(Color.white, lineWidth: 2)
                    )
                    .offset(x: size/3, y: size/3)
            }
        }
        .frame(width: size, height: size)
    }

    private var defaultAvatar: some View {
        ZStack {
            Circle()
                .fill(member.avatarColor)
                .frame(width: size, height: size)

            Text(member.initials)
                .font(.system(size: size * 0.4, weight: .semibold))
                .foregroundColor(.white)
        }
    }
}

// MARK: - Member Row

struct MemberRow: View {
    let member: HubMember
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 14) {
                MemberAvatar(member: member, size: 50)

                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 8) {
                        Text(member.fullName)
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "111827"))

                        if member.isAdmin {
                            Text("Admin")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color(hex: "6366F1"))
                                .cornerRadius(4)
                        }

                        if member.isCurrentUser {
                            Text("Vous")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(Color(hex: "10B981"))
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color(hex: "10B981").opacity(0.1))
                                .cornerRadius(4)
                        }
                    }

                    HStack(spacing: 12) {
                        HStack(spacing: 4) {
                            Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "10B981"))
                            Text("\(member.tasksCompleted) tâches")
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "6B7280"))
                        }

                        Text("•")
                            .foregroundColor(Color(hex: "D1D5DB"))

                        Text("Membre depuis \(member.joinedAgo)")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "9CA3AF"))
                    }
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "D1D5DB"))
            }
            .padding(16)
        }
    }
}

// MARK: - Contribution Stat Card

struct ContributionStatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 22))
                .foregroundColor(color)

            VStack(alignment: .leading, spacing: 2) {
                Text(value)
                    .font(.system(size: 22, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text(title)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "6B7280"))
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.white)
        .cornerRadius(14)
        .shadow(color: .black.opacity(0.04), radius: 6, x: 0, y: 2)
    }
}

// MARK: - Quick Action Row

struct QuickActionRow: View {
    let icon: String
    let title: String
    let subtitle: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Image(systemName: icon)
                    .font(.system(size: 20))
                    .foregroundColor(color)
                    .frame(width: 44, height: 44)
                    .background(color.opacity(0.1))
                    .cornerRadius(12)

                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    Text(subtitle)
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "D1D5DB"))
            }
            .padding(16)
            .background(Color.white)
            .cornerRadius(14)
        }
    }
}

// MARK: - Member Detail Sheet

struct MemberDetailSheet: View {
    let member: HubMember
    @ObservedObject var viewModel: HubMembersViewModel
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Profile header
                    VStack(spacing: 16) {
                        MemberAvatar(member: member, size: 100)

                        VStack(spacing: 6) {
                            HStack(spacing: 8) {
                                Text(member.fullName)
                                    .font(.system(size: 24, weight: .bold))
                                    .foregroundColor(Color(hex: "111827"))

                                if member.isAdmin {
                                    Image(systemName: "checkmark.seal.fill")
                                        .foregroundColor(Color(hex: "6366F1"))
                                }
                            }

                            Text(member.email)
                                .font(.system(size: 15))
                                .foregroundColor(Color(hex: "6B7280"))

                            Text("Membre depuis \(member.joinedAgo)")
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "9CA3AF"))
                        }
                    }
                    .padding(.top, 20)

                    // Stats
                    HStack(spacing: 20) {
                        MemberStatItem(value: "\(member.tasksCompleted)", label: "Tâches")
                        MemberStatItem(value: String(format: "€%.0f", member.expensesPaid), label: "Dépenses")
                        MemberStatItem(value: "\(member.eventsCreated)", label: "Événements")
                    }
                    .padding(20)
                    .background(Color(hex: "F9FAFB"))
                    .cornerRadius(16)

                    // Actions
                    if !member.isCurrentUser {
                        VStack(spacing: 12) {
                            Button(action: {
                                // Send message
                            }) {
                                HStack {
                                    Image(systemName: "message.fill")
                                    Text("Envoyer un message")
                                }
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(Color(hex: "10B981"))
                                .cornerRadius(12)
                            }

                            if viewModel.currentUserIsAdmin {
                                Button(action: {
                                    viewModel.toggleAdmin(member)
                                }) {
                                    HStack {
                                        Image(systemName: member.isAdmin ? "person.badge.minus" : "person.badge.plus")
                                        Text(member.isAdmin ? "Retirer admin" : "Promouvoir admin")
                                    }
                                    .font(.system(size: 16, weight: .medium))
                                    .foregroundColor(Color(hex: "6366F1"))
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 14)
                                    .background(Color(hex: "6366F1").opacity(0.1))
                                    .cornerRadius(12)
                                }

                                Button(action: {
                                    viewModel.removeMember(member)
                                    dismiss()
                                }) {
                                    HStack {
                                        Image(systemName: "person.badge.minus")
                                        Text("Retirer du foyer")
                                    }
                                    .font(.system(size: 16, weight: .medium))
                                    .foregroundColor(Color(hex: "EF4444"))
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 14)
                                    .background(Color(hex: "EF4444").opacity(0.1))
                                    .cornerRadius(12)
                                }
                            }
                        }
                    }
                }
                .padding(20)
            }
            .navigationTitle("Profil")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Fermer") { dismiss() }
                        .foregroundColor(Color(hex: "10B981"))
                }
            }
        }
        .presentationDetents([.medium, .large])
    }
}

// MARK: - Member Stat Item

struct MemberStatItem: View {
    let value: String
    let label: String

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.system(size: 22, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            Text(label)
                .font(.system(size: 13))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Models

struct HubMember: Identifiable {
    let id: UUID
    let fullName: String
    let email: String
    let avatarUrl: String?
    let avatarColor: Color
    var isAdmin: Bool
    let isCurrentUser: Bool
    let isOnline: Bool
    let joinedDate: Date
    let tasksCompleted: Int
    let expensesPaid: Double
    let eventsCreated: Int

    var initials: String {
        let parts = fullName.split(separator: " ")
        if parts.count >= 2 {
            return String(parts[0].prefix(1) + parts[1].prefix(1)).uppercased()
        }
        return String(fullName.prefix(2)).uppercased()
    }

    var joinedAgo: String {
        let formatter = RelativeDateTimeFormatter()
        formatter.locale = Locale(identifier: "fr_FR")
        formatter.unitsStyle = .short
        return formatter.localizedString(for: joinedDate, relativeTo: Date())
    }
}

// MARK: - ViewModel

@MainActor
class HubMembersViewModel: ObservableObject {
    @Published var householdName: String = ""
    @Published var householdAddress: String = ""
    @Published var members: [HubMember] = []
    @Published var filter: MemberFilter = .all
    @Published var currentUserIsAdmin = true

    @Published var totalTasksCompleted: Int = 0
    @Published var totalSharedExpenses: Double = 0
    @Published var totalEventsCreated: Int = 0
    @Published var totalMessages: Int = 0

    enum MemberFilter: String, CaseIterable {
        case all = "Tous"
        case admins = "Admins"
        case members = "Membres"
    }

    var filteredMembers: [HubMember] {
        switch filter {
        case .all:
            return members
        case .admins:
            return members.filter { $0.isAdmin }
        case .members:
            return members.filter { !$0.isAdmin }
        }
    }

    func loadMembers() async {
        // Demo data
        if AppConfig.FeatureFlags.demoMode {
            try? await Task.sleep(nanoseconds: 300_000_000)

            householdName = "Coloc' du Bonheur"
            householdAddress = "42 Rue de la Paix, Bruxelles"

            members = [
                HubMember(
                    id: UUID(),
                    fullName: "Vous (Marie)",
                    email: "marie@email.com",
                    avatarUrl: nil,
                    avatarColor: Color(hex: "10B981"),
                    isAdmin: true,
                    isCurrentUser: true,
                    isOnline: true,
                    joinedDate: Calendar.current.date(byAdding: .month, value: -6, to: Date())!,
                    tasksCompleted: 47,
                    expensesPaid: 1250,
                    eventsCreated: 12
                ),
                HubMember(
                    id: UUID(),
                    fullName: "Thomas Martin",
                    email: "thomas.m@email.com",
                    avatarUrl: nil,
                    avatarColor: Color(hex: "6366F1"),
                    isAdmin: true,
                    isCurrentUser: false,
                    isOnline: true,
                    joinedDate: Calendar.current.date(byAdding: .month, value: -5, to: Date())!,
                    tasksCompleted: 38,
                    expensesPaid: 980,
                    eventsCreated: 8
                ),
                HubMember(
                    id: UUID(),
                    fullName: "Julie Dubois",
                    email: "julie.d@email.com",
                    avatarUrl: nil,
                    avatarColor: Color(hex: "EC4899"),
                    isAdmin: false,
                    isCurrentUser: false,
                    isOnline: false,
                    joinedDate: Calendar.current.date(byAdding: .month, value: -3, to: Date())!,
                    tasksCompleted: 25,
                    expensesPaid: 720,
                    eventsCreated: 5
                ),
                HubMember(
                    id: UUID(),
                    fullName: "Lucas Bernard",
                    email: "lucas.b@email.com",
                    avatarUrl: nil,
                    avatarColor: Color(hex: "F59E0B"),
                    isAdmin: false,
                    isCurrentUser: false,
                    isOnline: true,
                    joinedDate: Calendar.current.date(byAdding: .month, value: -1, to: Date())!,
                    tasksCompleted: 12,
                    expensesPaid: 450,
                    eventsCreated: 2
                )
            ]

            totalTasksCompleted = members.reduce(0) { $0 + $1.tasksCompleted }
            totalSharedExpenses = members.reduce(0) { $0 + $1.expensesPaid }
            totalEventsCreated = members.reduce(0) { $0 + $1.eventsCreated }
            totalMessages = 234
        }
    }

    func toggleAdmin(_ member: HubMember) {
        if let index = members.firstIndex(where: { $0.id == member.id }) {
            members[index].isAdmin.toggle()
        }
    }

    func removeMember(_ member: HubMember) {
        members.removeAll { $0.id == member.id }
    }
}

// MARK: - Preview

struct HubMembersView_Previews: PreviewProvider {
    static var previews: some View {
        HubMembersView()
    }
}
