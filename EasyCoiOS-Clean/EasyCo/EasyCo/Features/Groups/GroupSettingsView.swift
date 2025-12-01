import SwiftUI

// MARK: - Group Settings View

struct GroupSettingsView: View {
    let group: SearchGroup
    @StateObject private var viewModel = GroupSettingsViewModel()
    @Environment(\.dismiss) private var dismiss
    @State private var showDeleteConfirmation = false
    @State private var showLeaveConfirmation = false

    var body: some View {
        NavigationStack {
            List {
                // Group info section
                groupInfoSection

                // Search preferences section
                searchPreferencesSection

                // Members section
                membersSection

                // Notifications section
                notificationsSection

                // Invite section
                inviteSection

                // Danger zone
                dangerZoneSection
            }
            .listStyle(.insetGrouped)
            .navigationTitle("Paramètres du groupe")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Enregistrer") {
                        viewModel.saveSettings()
                        dismiss()
                    }
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "FFA040"))
                }
            }
            .alert("Quitter le groupe ?", isPresented: $showLeaveConfirmation) {
                Button("Annuler", role: .cancel) {}
                Button("Quitter", role: .destructive) {
                    viewModel.leaveGroup()
                    dismiss()
                }
            } message: {
                Text("Vous ne pourrez plus voir les propriétés partagées ni voter avec ce groupe.")
            }
            .alert("Supprimer le groupe ?", isPresented: $showDeleteConfirmation) {
                Button("Annuler", role: .cancel) {}
                Button("Supprimer", role: .destructive) {
                    viewModel.deleteGroup()
                    dismiss()
                }
            } message: {
                Text("Cette action est irréversible. Tous les membres perdront l'accès au groupe et aux propriétés partagées.")
            }
        }
        .onAppear {
            viewModel.loadSettings(from: group)
        }
    }

    // MARK: - Group Info Section

    private var groupInfoSection: some View {
        Section {
            // Group name
            HStack(spacing: 14) {
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [Color(hex: "FFA040"), Color(hex: "FFD580")],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 56, height: 56)

                    Image(systemName: "person.3.fill")
                        .font(.system(size: 22))
                        .foregroundColor(.white)
                }

                VStack(alignment: .leading, spacing: 4) {
                    TextField("Nom du groupe", text: $viewModel.groupName)
                        .font(.system(size: 17, weight: .semibold))

                    Text("\(group.members.count) membres")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }
            .padding(.vertical, 8)

            // Description
            VStack(alignment: .leading, spacing: 8) {
                Text("Description")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(Color(hex: "6B7280"))

                TextField("Décrivez votre groupe...", text: $viewModel.groupDescription, axis: .vertical)
                    .lineLimit(3...5)
                    .font(.system(size: 15))
            }
            .padding(.vertical, 4)

            // Visibility toggle
            Toggle(isOn: $viewModel.isPublic) {
                HStack(spacing: 12) {
                    Image(systemName: viewModel.isPublic ? "globe" : "lock.fill")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: viewModel.isPublic ? "6366F1" : "6B7280"))
                        .frame(width: 24)

                    VStack(alignment: .leading, spacing: 2) {
                        Text(viewModel.isPublic ? "Groupe public" : "Groupe privé")
                            .font(.system(size: 15))

                        Text(viewModel.isPublic ? "Visible dans les recherches" : "Uniquement sur invitation")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "9CA3AF"))
                    }
                }
            }
            .tint(Color(hex: "FFA040"))
        } header: {
            Text("Informations")
        }
    }

    // MARK: - Search Preferences Section

    private var searchPreferencesSection: some View {
        Section {
            // Budget range
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Image(systemName: "eurosign.circle.fill")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "10B981"))

                    Text("Budget mensuel")
                        .font(.system(size: 15))

                    Spacer()

                    Text("€\(Int(viewModel.minBudget)) - €\(Int(viewModel.maxBudget))")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "FFA040"))
                }

                // Custom range slider
                DualRangeSlider(
                    lowValue: $viewModel.minBudget,
                    highValue: $viewModel.maxBudget,
                    range: 300...3000
                )
            }
            .padding(.vertical, 4)

            // Locations
            NavigationLink {
                GroupLocationsEditor(locations: $viewModel.preferredLocations)
            } label: {
                HStack {
                    Image(systemName: "location.fill")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "6366F1"))
                        .frame(width: 24)

                    Text("Zones de recherche")
                        .font(.system(size: 15))

                    Spacer()

                    Text(viewModel.preferredLocations.isEmpty ? "Non défini" : "\(viewModel.preferredLocations.count) zone(s)")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }

            // Property type
            NavigationLink {
                GroupPropertyTypeSelector(selectedTypes: $viewModel.propertyTypes)
            } label: {
                HStack {
                    Image(systemName: "building.2.fill")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "8B5CF6"))
                        .frame(width: 24)

                    Text("Types de logement")
                        .font(.system(size: 15))

                    Spacer()

                    Text(viewModel.propertyTypes.isEmpty ? "Tous" : "\(viewModel.propertyTypes.count) type(s)")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }

            // Rooms
            Stepper(value: $viewModel.minRooms, in: 1...10) {
                HStack {
                    Image(systemName: "bed.double.fill")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "EC4899"))
                        .frame(width: 24)

                    Text("Chambres minimum")
                        .font(.system(size: 15))

                    Spacer()

                    Text("\(viewModel.minRooms)")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(Color(hex: "FFA040"))
                }
            }
        } header: {
            Text("Critères de recherche")
        } footer: {
            Text("Ces critères seront utilisés pour filtrer les propriétés affichées au groupe.")
        }
    }

    // MARK: - Members Section

    private var membersSection: some View {
        Section {
            ForEach(viewModel.members) { member in
                GroupMemberSettingsRow(
                    member: member,
                    isAdmin: member.isAdmin,
                    isCurrentUser: member.isCurrentUser,
                    onRoleChange: {
                        viewModel.toggleAdminRole(for: member)
                    },
                    onRemove: {
                        viewModel.removeMember(member)
                    }
                )
            }
        } header: {
            HStack {
                Text("Membres")
                Spacer()
                Text("\(viewModel.members.count)")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(Color(hex: "FFA040"))
                    .cornerRadius(999)
            }
        }
    }

    // MARK: - Notifications Section

    private var notificationsSection: some View {
        Section {
            Toggle(isOn: $viewModel.notifyNewProperties) {
                HStack(spacing: 12) {
                    Image(systemName: "house.fill")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "FFA040"))
                        .frame(width: 24)

                    Text("Nouvelles propriétés")
                        .font(.system(size: 15))
                }
            }
            .tint(Color(hex: "FFA040"))

            Toggle(isOn: $viewModel.notifyVotes) {
                HStack(spacing: 12) {
                    Image(systemName: "hand.thumbsup.fill")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "10B981"))
                        .frame(width: 24)

                    Text("Votes des membres")
                        .font(.system(size: 15))
                }
            }
            .tint(Color(hex: "FFA040"))

            Toggle(isOn: $viewModel.notifyMessages) {
                HStack(spacing: 12) {
                    Image(systemName: "message.fill")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "6366F1"))
                        .frame(width: 24)

                    Text("Messages du groupe")
                        .font(.system(size: 15))
                }
            }
            .tint(Color(hex: "FFA040"))

            Toggle(isOn: $viewModel.notifyConsensus) {
                HStack(spacing: 12) {
                    Image(systemName: "checkmark.seal.fill")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "8B5CF6"))
                        .frame(width: 24)

                    Text("Consensus atteint")
                        .font(.system(size: 15))
                }
            }
            .tint(Color(hex: "FFA040"))
        } header: {
            Text("Notifications")
        }
    }

    // MARK: - Invite Section

    private var inviteSection: some View {
        Section {
            // Invite code
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Code d'invitation")
                        .font(.system(size: 15))

                    Text(viewModel.inviteCode)
                        .font(.system(size: 14, design: .monospaced))
                        .foregroundColor(Color(hex: "FFA040"))
                }

                Spacer()

                Button(action: {
                    UIPasteboard.general.string = viewModel.inviteCode
                    viewModel.showCopiedFeedback = true
                }) {
                    Image(systemName: viewModel.showCopiedFeedback ? "checkmark" : "doc.on.doc")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "FFA040"))
                }
            }

            // Regenerate code
            Button(action: {
                viewModel.regenerateInviteCode()
            }) {
                HStack {
                    Image(systemName: "arrow.clockwise")
                        .font(.system(size: 16))

                    Text("Régénérer le code")
                        .font(.system(size: 15))
                }
                .foregroundColor(Color(hex: "6B7280"))
            }

            // Share link
            Button(action: {
                viewModel.shareInviteLink()
            }) {
                HStack {
                    Image(systemName: "square.and.arrow.up")
                        .font(.system(size: 16))

                    Text("Partager le lien d'invitation")
                        .font(.system(size: 15))
                }
                .foregroundColor(Color(hex: "FFA040"))
            }
        } header: {
            Text("Invitation")
        } footer: {
            Text("Le code expire après 7 jours. Partagez-le avec vos futurs colocataires.")
        }
    }

    // MARK: - Danger Zone Section

    private var dangerZoneSection: some View {
        Section {
            Button(action: { showLeaveConfirmation = true }) {
                HStack {
                    Image(systemName: "rectangle.portrait.and.arrow.right")
                        .font(.system(size: 16))

                    Text("Quitter le groupe")
                        .font(.system(size: 15))
                }
                .foregroundColor(Color(hex: "F59E0B"))
            }

            if viewModel.isAdmin {
                Button(action: { showDeleteConfirmation = true }) {
                    HStack {
                        Image(systemName: "trash.fill")
                            .font(.system(size: 16))

                        Text("Supprimer le groupe")
                            .font(.system(size: 15))
                    }
                    .foregroundColor(Color(hex: "EF4444"))
                }
            }
        } header: {
            Text("Zone de danger")
        }
    }
}

// MARK: - Dual Range Slider

struct DualRangeSlider: View {
    @Binding var lowValue: Double
    @Binding var highValue: Double
    let range: ClosedRange<Double>

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .leading) {
                // Background track
                RoundedRectangle(cornerRadius: 3)
                    .fill(Color(hex: "E5E7EB"))
                    .frame(height: 6)

                // Selected range
                RoundedRectangle(cornerRadius: 3)
                    .fill(Color(hex: "FFA040"))
                    .frame(width: selectedWidth(in: geometry.size.width), height: 6)
                    .offset(x: lowOffset(in: geometry.size.width))

                // Low thumb
                Circle()
                    .fill(Color.white)
                    .frame(width: 24, height: 24)
                    .shadow(color: .black.opacity(0.15), radius: 4, x: 0, y: 2)
                    .offset(x: lowOffset(in: geometry.size.width) - 12)
                    .gesture(
                        DragGesture()
                            .onChanged { value in
                                let newValue = valueFor(offset: value.location.x, in: geometry.size.width)
                                lowValue = min(max(newValue, range.lowerBound), highValue - 100)
                            }
                    )

                // High thumb
                Circle()
                    .fill(Color.white)
                    .frame(width: 24, height: 24)
                    .shadow(color: .black.opacity(0.15), radius: 4, x: 0, y: 2)
                    .offset(x: highOffset(in: geometry.size.width) - 12)
                    .gesture(
                        DragGesture()
                            .onChanged { value in
                                let newValue = valueFor(offset: value.location.x, in: geometry.size.width)
                                highValue = max(min(newValue, range.upperBound), lowValue + 100)
                            }
                    )
            }
        }
        .frame(height: 24)
    }

    private func lowOffset(in width: CGFloat) -> CGFloat {
        let percent = (lowValue - range.lowerBound) / (range.upperBound - range.lowerBound)
        return width * CGFloat(percent)
    }

    private func highOffset(in width: CGFloat) -> CGFloat {
        let percent = (highValue - range.lowerBound) / (range.upperBound - range.lowerBound)
        return width * CGFloat(percent)
    }

    private func selectedWidth(in width: CGFloat) -> CGFloat {
        highOffset(in: width) - lowOffset(in: width)
    }

    private func valueFor(offset: CGFloat, in width: CGFloat) -> Double {
        let percent = Double(offset / width)
        return range.lowerBound + (range.upperBound - range.lowerBound) * percent
    }
}

// MARK: - Group Member Settings Row

struct GroupMemberSettingsRow: View {
    let member: GroupSettingsMember
    let isAdmin: Bool
    let isCurrentUser: Bool
    let onRoleChange: () -> Void
    let onRemove: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            // Avatar
            Circle()
                .fill(Color(hex: "FFA040").opacity(0.2))
                .frame(width: 40, height: 40)
                .overlay(
                    Text(member.initials)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Color(hex: "FFA040"))
                )

            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 6) {
                    Text(member.name)
                        .font(.system(size: 15, weight: .medium))

                    if isCurrentUser {
                        Text("Vous")
                            .font(.system(size: 11, weight: .medium))
                            .foregroundColor(Color(hex: "6366F1"))
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color(hex: "6366F1").opacity(0.1))
                            .cornerRadius(4)
                    }
                }

                Text(isAdmin ? "Admin" : "Membre")
                    .font(.system(size: 12))
                    .foregroundColor(isAdmin ? Color(hex: "FFA040") : Color(hex: "6B7280"))
            }

            Spacer()

            if !isCurrentUser {
                Menu {
                    Button(action: onRoleChange) {
                        Label(
                            isAdmin ? "Retirer les droits admin" : "Promouvoir admin",
                            systemImage: isAdmin ? "person.badge.minus" : "person.badge.shield.checkmark"
                        )
                    }

                    Button(role: .destructive, action: onRemove) {
                        Label("Exclure du groupe", systemImage: "person.badge.minus")
                    }
                } label: {
                    Image(systemName: "ellipsis")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "6B7280"))
                        .frame(width: 32, height: 32)
                }
            }
        }
    }
}

// MARK: - Group Locations Editor

struct GroupLocationsEditor: View {
    @Binding var locations: [String]
    @State private var newLocation = ""
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        List {
            Section {
                HStack {
                    TextField("Ajouter une ville...", text: $newLocation)

                    Button(action: {
                        if !newLocation.isEmpty {
                            locations.append(newLocation)
                            newLocation = ""
                        }
                    }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.system(size: 22))
                            .foregroundColor(Color(hex: "FFA040"))
                    }
                    .disabled(newLocation.isEmpty)
                }
            }

            Section {
                ForEach(locations, id: \.self) { location in
                    HStack {
                        Image(systemName: "location.fill")
                            .foregroundColor(Color(hex: "6366F1"))

                        Text(location)
                    }
                }
                .onDelete { indexSet in
                    locations.remove(atOffsets: indexSet)
                }
            } header: {
                Text("Zones de recherche")
            }
        }
        .navigationTitle("Zones de recherche")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Group Property Type Selector

struct GroupPropertyTypeSelector: View {
    @Binding var selectedTypes: Set<String>

    let allTypes = [
        ("Appartement", "building.2.fill"),
        ("Maison", "house.fill"),
        ("Studio", "square.fill"),
        ("Loft", "square.split.diagonal.fill"),
        ("Colocation", "person.3.fill"),
        ("Chambre", "bed.double.fill")
    ]

    var body: some View {
        List {
            ForEach(allTypes, id: \.0) { type in
                Button(action: {
                    if selectedTypes.contains(type.0) {
                        selectedTypes.remove(type.0)
                    } else {
                        selectedTypes.insert(type.0)
                    }
                }) {
                    HStack {
                        Image(systemName: type.1)
                            .font(.system(size: 18))
                            .foregroundColor(Color(hex: "FFA040"))
                            .frame(width: 28)

                        Text(type.0)
                            .foregroundColor(Color(hex: "111827"))

                        Spacer()

                        if selectedTypes.contains(type.0) {
                            Image(systemName: "checkmark")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(Color(hex: "FFA040"))
                        }
                    }
                }
            }
        }
        .navigationTitle("Types de logement")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Models

struct GroupSettingsMember: Identifiable {
    let id: UUID
    let name: String
    let email: String
    var isAdmin: Bool
    let isCurrentUser: Bool

    var initials: String {
        let components = name.components(separatedBy: " ")
        return components.compactMap { $0.first }.prefix(2).map { String($0) }.joined()
    }
}

// MARK: - ViewModel

@MainActor
class GroupSettingsViewModel: ObservableObject {
    @Published var groupName = ""
    @Published var groupDescription = ""
    @Published var isPublic = false
    @Published var minBudget: Double = 500
    @Published var maxBudget: Double = 1500
    @Published var preferredLocations: [String] = []
    @Published var propertyTypes: Set<String> = []
    @Published var minRooms = 2
    @Published var members: [GroupSettingsMember] = []
    @Published var notifyNewProperties = true
    @Published var notifyVotes = true
    @Published var notifyMessages = true
    @Published var notifyConsensus = true
    @Published var inviteCode = "ABC123"
    @Published var showCopiedFeedback = false
    @Published var isAdmin = true

    func loadSettings(from group: SearchGroup) {
        groupName = group.name
        groupDescription = group.description
        minBudget = group.preferences.minPrice ?? 0
        maxBudget = group.preferences.maxPrice ?? 0
        preferredLocations = group.preferences.cities

        // Demo members
        if AppConfig.FeatureFlags.demoMode {
            members = [
                GroupSettingsMember(
                    id: UUID(),
                    name: "Vous",
                    email: "vous@example.com",
                    isAdmin: true,
                    isCurrentUser: true
                ),
                GroupSettingsMember(
                    id: UUID(),
                    name: "Marie Dupont",
                    email: "marie@example.com",
                    isAdmin: false,
                    isCurrentUser: false
                ),
                GroupSettingsMember(
                    id: UUID(),
                    name: "Thomas Martin",
                    email: "thomas@example.com",
                    isAdmin: false,
                    isCurrentUser: false
                )
            ]
        }
    }

    func saveSettings() {
        // TODO: API call
    }

    func toggleAdminRole(for member: GroupSettingsMember) {
        if let index = members.firstIndex(where: { $0.id == member.id }) {
            members[index].isAdmin.toggle()
        }
    }

    func removeMember(_ member: GroupSettingsMember) {
        members.removeAll { $0.id == member.id }
    }

    func regenerateInviteCode() {
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        inviteCode = String((0..<6).map { _ in characters.randomElement()! })
    }

    func shareInviteLink() {
        // TODO: Share sheet
    }

    func leaveGroup() {
        // TODO: API call
    }

    func deleteGroup() {
        // TODO: API call
    }
}

// MARK: - Preview

struct GroupSettingsView_Previews: PreviewProvider {
    static var previews: some View {
        GroupSettingsView(group: SearchGroup.mockGroups.first!)
    }
}
