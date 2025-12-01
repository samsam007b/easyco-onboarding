import SwiftUI

// MARK: - Groups Join View

struct GroupsJoinView: View {
    @StateObject private var viewModel = GroupsJoinViewModel()
    @Environment(\.dismiss) private var dismiss
    @State private var inviteCode = ""
    @FocusState private var isCodeFocused: Bool

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header illustration
                    headerSection

                    // Join with code
                    joinWithCodeSection

                    // Or divider
                    orDivider

                    // Public groups to join
                    publicGroupsSection

                    // Tips
                    tipsSection
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }

                ToolbarItem(placement: .principal) {
                    Text("Rejoindre un groupe")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }
            }
            .alert("Erreur", isPresented: $viewModel.showError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(viewModel.errorMessage)
            }
            .alert("Groupe trouvé !", isPresented: $viewModel.showGroupFound) {
                Button("Annuler", role: .cancel) {}
                Button("Rejoindre") {
                    viewModel.joinFoundGroup()
                    dismiss()
                }
            } message: {
                if let group = viewModel.foundGroup {
                    Text("Voulez-vous rejoindre le groupe \"\(group.name)\" avec \(group.memberCount) membres ?")
                }
            }
        }
        .task {
            await viewModel.loadPublicGroups()
        }
    }

    // MARK: - Header Section

    private var headerSection: some View {
        VStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "FFA040").opacity(0.2), Color(hex: "FFD580").opacity(0.1)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 100, height: 100)

                Image(systemName: "person.3.fill")
                    .font(.system(size: 44))
                    .foregroundColor(Color(hex: "FFA040"))
            }

            VStack(spacing: 8) {
                Text("Rejoindre un groupe")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Recherchez ensemble et trouvez le logement parfait pour votre colocation")
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 16)
            }
        }
        .padding(.vertical, 20)
    }

    // MARK: - Join With Code Section

    private var joinWithCodeSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 8) {
                Image(systemName: "ticket.fill")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "FFA040"))

                Text("Code d'invitation")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
            }

            VStack(spacing: 12) {
                // Code input
                HStack(spacing: 8) {
                    ForEach(0..<6, id: \.self) { index in
                        CodeDigitBox(
                            digit: getDigit(at: index),
                            isFocused: isCodeFocused && inviteCode.count == index
                        )
                    }
                }
                .onTapGesture {
                    isCodeFocused = true
                }

                // Hidden text field for input
                TextField("", text: $inviteCode)
                    .keyboardType(.asciiCapable)
                    .textInputAutocapitalization(.characters)
                    .focused($isCodeFocused)
                    .opacity(0)
                    .frame(height: 1)
                    .onChange(of: inviteCode) { newValue in
                        let filtered = newValue.uppercased().filter { $0.isLetter || $0.isNumber }
                        if filtered.count <= 6 {
                            inviteCode = filtered
                        } else {
                            inviteCode = String(filtered.prefix(6))
                        }
                    }

                // Join button
                Button(action: {
                    Task {
                        await viewModel.findGroupByCode(inviteCode)
                    }
                }) {
                    HStack(spacing: 8) {
                        if viewModel.isSearching {
                            ProgressView()
                                .tint(.white)
                        } else {
                            Image(systemName: "magnifyingglass")
                                .font(.system(size: 16, weight: .semibold))
                        }
                        Text("Rechercher")
                            .font(.system(size: 16, weight: .semibold))
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(
                        inviteCode.count == 6
                            ? Color(hex: "FFA040")
                            : Color(hex: "D1D5DB")
                    )
                    .cornerRadius(12)
                }
                .disabled(inviteCode.count != 6 || viewModel.isSearching)
            }
            .padding(20)
            .background(Color.white)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
        }
    }

    private func getDigit(at index: Int) -> String? {
        guard index < inviteCode.count else { return nil }
        return String(inviteCode[inviteCode.index(inviteCode.startIndex, offsetBy: index)])
    }

    // MARK: - Or Divider

    private var orDivider: some View {
        HStack(spacing: 16) {
            Rectangle()
                .fill(Color(hex: "E5E7EB"))
                .frame(height: 1)

            Text("OU")
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(Color(hex: "9CA3AF"))

            Rectangle()
                .fill(Color(hex: "E5E7EB"))
                .frame(height: 1)
        }
    }

    // MARK: - Public Groups Section

    private var publicGroupsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "globe")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6366F1"))

                Text("Groupes publics")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                if viewModel.isLoadingPublicGroups {
                    ProgressView()
                }
            }

            if viewModel.publicGroups.isEmpty && !viewModel.isLoadingPublicGroups {
                emptyPublicGroupsState
            } else {
                LazyVStack(spacing: 12) {
                    ForEach(viewModel.publicGroups) { group in
                        PublicGroupCard(group: group) {
                            viewModel.requestToJoin(group)
                        }
                    }
                }
            }
        }
    }

    private var emptyPublicGroupsState: some View {
        VStack(spacing: 12) {
            Image(systemName: "person.3.sequence.fill")
                .font(.system(size: 32))
                .foregroundColor(Color(hex: "D1D5DB"))

            Text("Aucun groupe public disponible")
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "9CA3AF"))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 32)
        .background(Color.white)
        .cornerRadius(12)
    }

    // MARK: - Tips Section

    private var tipsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 8) {
                Image(systemName: "lightbulb.fill")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "F59E0B"))

                Text("Comment ça marche ?")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))
            }

            VStack(spacing: 10) {
                JoinTipRow(
                    number: "1",
                    text: "Demandez le code d'invitation à un membre du groupe"
                )
                JoinTipRow(
                    number: "2",
                    text: "Entrez le code à 6 caractères ci-dessus"
                )
                JoinTipRow(
                    number: "3",
                    text: "Une fois accepté, vous pourrez voter sur les propriétés"
                )
            }
            .padding(16)
            .background(Color(hex: "FFFBEB"))
            .cornerRadius(12)
        }
    }
}

// MARK: - Code Digit Box

struct CodeDigitBox: View {
    let digit: String?
    let isFocused: Bool

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.white)
                .frame(width: 48, height: 56)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(
                            isFocused ? Color(hex: "FFA040") : Color(hex: "E5E7EB"),
                            lineWidth: isFocused ? 2 : 1
                        )
                )

            if let digit = digit {
                Text(digit)
                    .font(.system(size: 24, weight: .bold, design: .monospaced))
                    .foregroundColor(Color(hex: "111827"))
            } else if isFocused {
                Rectangle()
                    .fill(Color(hex: "FFA040"))
                    .frame(width: 2, height: 24)
                    .opacity(isFocused ? 1 : 0)
            }
        }
    }
}

// MARK: - Public Group Card

struct PublicGroupCard: View {
    let group: PublicGroup
    let onJoin: () -> Void

    var body: some View {
        HStack(spacing: 14) {
            // Group avatar
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "FFA040"), Color(hex: "FFD580")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 52, height: 52)

                Image(systemName: "person.3.fill")
                    .font(.system(size: 20))
                    .foregroundColor(.white)
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(group.name)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                HStack(spacing: 12) {
                    Label("\(group.memberCount) membres", systemImage: "person.2.fill")
                    Label(group.city, systemImage: "location.fill")
                }
                .font(.system(size: 12))
                .foregroundColor(Color(hex: "6B7280"))

                // Tags
                if !group.tags.isEmpty {
                    HStack(spacing: 6) {
                        ForEach(group.tags.prefix(3), id: \.self) { tag in
                            Text(tag)
                                .font(.system(size: 11, weight: .medium))
                                .foregroundColor(Color(hex: "6366F1"))
                                .padding(.horizontal, 8)
                                .padding(.vertical, 3)
                                .background(Color(hex: "6366F1").opacity(0.1))
                                .cornerRadius(999)
                        }
                    }
                }
            }

            Spacer()

            Button(action: onJoin) {
                Text("Rejoindre")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(Color(hex: "FFA040"))
                    .cornerRadius(999)
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.04), radius: 6, x: 0, y: 2)
    }
}

// MARK: - Join Tip Row

struct JoinTipRow: View {
    let number: String
    let text: String

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            ZStack {
                Circle()
                    .fill(Color(hex: "FFA040"))
                    .frame(width: 24, height: 24)

                Text(number)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(.white)
            }

            Text(text)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "78716C"))
                .fixedSize(horizontal: false, vertical: true)
        }
    }
}

// MARK: - Models

struct PublicGroup: Identifiable {
    let id: UUID
    let name: String
    let memberCount: Int
    let city: String
    let tags: [String]
}

struct FoundGroup {
    let id: UUID
    let name: String
    let memberCount: Int
}

// MARK: - ViewModel

@MainActor
class GroupsJoinViewModel: ObservableObject {
    @Published var publicGroups: [PublicGroup] = []
    @Published var isLoadingPublicGroups = false
    @Published var isSearching = false
    @Published var showError = false
    @Published var errorMessage = ""
    @Published var showGroupFound = false
    @Published var foundGroup: FoundGroup?

    func loadPublicGroups() async {
        if AppConfig.FeatureFlags.demoMode {
            isLoadingPublicGroups = true
            try? await Task.sleep(nanoseconds: 500_000_000)

            publicGroups = [
                PublicGroup(
                    id: UUID(),
                    name: "Coloc' Paris 11ème",
                    memberCount: 4,
                    city: "Paris",
                    tags: ["Étudiants", "Non-fumeurs"]
                ),
                PublicGroup(
                    id: UUID(),
                    name: "Jeunes actifs Lyon",
                    memberCount: 3,
                    city: "Lyon",
                    tags: ["Actifs", "25-35 ans"]
                ),
                PublicGroup(
                    id: UUID(),
                    name: "Startup Bordeaux",
                    memberCount: 5,
                    city: "Bordeaux",
                    tags: ["Tech", "Remote friendly"]
                )
            ]

            isLoadingPublicGroups = false
        }
    }

    func findGroupByCode(_ code: String) async {
        isSearching = true
        try? await Task.sleep(nanoseconds: 800_000_000)

        if AppConfig.FeatureFlags.demoMode {
            // Simulate found group for demo codes
            if code.uppercased() == "ABC123" || code.uppercased() == "DEMO01" {
                foundGroup = FoundGroup(
                    id: UUID(),
                    name: "Coloc' Test",
                    memberCount: 3
                )
                showGroupFound = true
            } else {
                errorMessage = "Aucun groupe trouvé avec ce code. Vérifiez le code et réessayez."
                showError = true
            }
        }

        isSearching = false
    }

    func joinFoundGroup() {
        // TODO: API call to join group
    }

    func requestToJoin(_ group: PublicGroup) {
        // TODO: API call to request joining public group
    }
}

// MARK: - Preview

struct GroupsJoinView_Previews: PreviewProvider {
    static var previews: some View {
        GroupsJoinView()
    }
}
