import SwiftUI

// MARK: - Roommates View

struct RoommatesView: View {
    @StateObject private var viewModel = RoommatesViewModel()
    @State private var showAddRoommateSheet = false

    private let role: Theme.UserRole = .resident

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                if viewModel.isLoading {
                    LoadingView(message: "Chargement des colocataires...")
                } else if viewModel.roommates.isEmpty {
                    emptyStateView
                } else {
                    roommatesList
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationTitle("Colocataires")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showAddRoommateSheet = true }) {
                        Image(systemName: "plus")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(role.primaryColor)
                    }
                }
            }
            .sheet(isPresented: $showAddRoommateSheet) {
                AddRoommateSheet()
            }
        }
        .task {
            await viewModel.loadRoommates()
        }
    }

    // MARK: - Roommates List

    private var roommatesList: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(viewModel.roommates) { roommate in
                    RoommateCard(roommate: roommate)
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

                Image(systemName: "person.3.fill")
                    .font(.system(size: 48))
                    .foregroundColor(role.primaryColor)
            }

            VStack(spacing: 12) {
                Text("Aucun colocataire")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Ajoutez vos colocataires pour partager les tâches et dépenses")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            Button(action: { showAddRoommateSheet = true }) {
                HStack(spacing: 8) {
                    Image(systemName: "plus")
                    Text("Ajouter un colocataire")
                }
                .font(.system(size: 15, weight: .semibold))
                .foregroundColor(.white)
                .padding(.horizontal, 24)
                .padding(.vertical, 12)
                .background(role.primaryColor)
                .cornerRadius(12)
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// MARK: - Roommate Card

struct RoommateCard: View {
    let roommate: Roommate
    let role: Theme.UserRole = .resident

    var body: some View {
        HStack(spacing: 16) {
            // Profile Image
            if let imageUrl = roommate.profileImageURL, !imageUrl.isEmpty, let url = URL(string: imageUrl) {
                AsyncImage(url: url) { image in
                    image
                        .resizable()
                        .scaledToFill()
                } placeholder: {
                    profilePlaceholder
                }
                .frame(width: 60, height: 60)
                .clipShape(Circle())
            } else {
                profilePlaceholder
                    .frame(width: 60, height: 60)
            }

            VStack(alignment: .leading, spacing: 6) {
                Text("\(roommate.firstName) \(roommate.lastName)")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                if let email = roommate.email {
                    Text(email)
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                HStack(spacing: 12) {
                    Label(roommate.role.displayName, systemImage: "person.fill")
                        .font(.system(size: 12))
                        .foregroundColor(role.primaryColor)
                }
            }

            Spacer()

            // Status indicator
            if roommate.isActive {
                Circle()
                    .fill(Color(hex: "10B981"))
                    .frame(width: 10, height: 10)
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
    }

    private var profilePlaceholder: some View {
        ZStack {
            Circle()
                .fill(role.gradient)

            Text(roommate.initials)
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(.white)
        }
    }
}

// MARK: - Add Roommate Sheet

struct AddRoommateSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var email = ""
    @State private var role: RoommateRole = .member

    private let themeRole: Theme.UserRole = .resident

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    TextField("Email du colocataire", text: $email)
                        .textInputAutocapitalization(.never)
                        .keyboardType(.emailAddress)
                } header: {
                    Text("Email")
                }

                Section {
                    Picker("Rôle", selection: $role) {
                        ForEach(RoommateRole.allCases, id: \.self) { role in
                            Text(role.displayName).tag(role)
                        }
                    }
                } header: {
                    Text("Rôle")
                }

                Section {
                    Button("Envoyer l'invitation") {
                        // Send invitation logic
                        dismiss()
                    }
                    .frame(maxWidth: .infinity)
                    .foregroundColor(themeRole.primaryColor)
                    .disabled(email.isEmpty)
                }
            }
            .navigationTitle("Ajouter un colocataire")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") {
                        dismiss()
                    }
                }
            }
        }
    }
}

// MARK: - Roommate Model

struct Roommate: Identifiable {
    let id: UUID
    let firstName: String
    let lastName: String
    let email: String?
    let profileImageURL: String?
    let role: RoommateRole
    let isActive: Bool

    var initials: String {
        let firstInitial = firstName.prefix(1).uppercased()
        let lastInitial = lastName.prefix(1).uppercased()
        return "\(firstInitial)\(lastInitial)"
    }
}

enum RoommateRole: String, CaseIterable {
    case admin = "admin"
    case member = "member"
    case guest = "guest"

    var displayName: String {
        switch self {
        case .admin: return "Administrateur"
        case .member: return "Membre"
        case .guest: return "Invité"
        }
    }
}

// MARK: - Roommates ViewModel

class RoommatesViewModel: ObservableObject {
    @Published var roommates: [Roommate] = []
    @Published var isLoading = false

    func loadRoommates() async {
        isLoading = true

        // Simulate loading
        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
            roommates = [
                Roommate(
                    id: UUID(),
                    firstName: "Marie",
                    lastName: "Dubois",
                    email: "marie.dubois@example.com",
                    profileImageURL: nil,
                    role: .admin,
                    isActive: true
                ),
                Roommate(
                    id: UUID(),
                    firstName: "Thomas",
                    lastName: "Martin",
                    email: "thomas.martin@example.com",
                    profileImageURL: nil,
                    role: .member,
                    isActive: true
                ),
                Roommate(
                    id: UUID(),
                    firstName: "Sophie",
                    lastName: "Bernard",
                    email: "sophie.bernard@example.com",
                    profileImageURL: nil,
                    role: .member,
                    isActive: false
                )
            ]
        }

        isLoading = false
    }
}

// MARK: - Preview

struct RoommatesView_Previews: PreviewProvider {
    static var previews: some View {
        RoommatesView()
    }
}
