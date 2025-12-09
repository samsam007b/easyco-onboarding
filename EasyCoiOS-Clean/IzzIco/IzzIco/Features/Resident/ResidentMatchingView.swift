import SwiftUI

// MARK: - Resident Matching View

struct ResidentMatchingView: View {
    @StateObject private var viewModel = ResidentMatchingViewModel()
    @State private var showFilters = false

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    loadingView
                } else if viewModel.potentialRoommates.isEmpty {
                    emptyStateView
                } else {
                    matchingContent
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Trouver des colocataires")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }

                ToolbarItem(placement: .topBarTrailing) {
                    Button(action: { showFilters = true }) {
                        Image(systemName: "slider.horizontal.3")
                            .font(.system(size: 16))
                            .foregroundColor(Color(hex: "10B981"))
                    }
                }
            }
            .sheet(isPresented: $showFilters) {
                RoommateFiltersSheet(filters: $viewModel.filters) {
                    Task {
                        await viewModel.applyFilters()
                    }
                }
            }
        }
        .task {
            await viewModel.loadPotentialRoommates()
        }
    }

    // MARK: - Loading View

    private var loadingView: some View {
        VStack(spacing: 16) {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: Color(hex: "10B981")))
                .scaleEffect(1.5)

            Text("Recherche de colocataires compatibles...")
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "10B981").opacity(0.2), Color(hex: "34D399").opacity(0.1)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 120, height: 120)

                Image(systemName: "person.2.fill")
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "10B981"))
            }

            VStack(spacing: 12) {
                Text("Aucun colocataire trouvé")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Ajustez vos filtres ou revenez plus tard pour découvrir de nouveaux profils")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            Button(action: { showFilters = true }) {
                HStack(spacing: 8) {
                    Image(systemName: "slider.horizontal.3")
                        .font(.system(size: 16, weight: .semibold))
                    Text("Modifier les filtres")
                        .font(.system(size: 16, weight: .semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: 280)
                .padding(.vertical, 16)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "10B981"), Color(hex: "34D399")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(999)
            }

            Spacer()
        }
    }

    // MARK: - Matching Content

    private var matchingContent: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Stats header
                matchingStatsHeader

                // Compatibility explanation
                compatibilityExplanation

                // Roommates list
                LazyVStack(spacing: 16) {
                    ForEach(viewModel.potentialRoommates) { roommate in
                        RoommateMatchCard(
                            roommate: roommate,
                            onConnect: {
                                viewModel.connectWith(roommate)
                            },
                            onDismiss: {
                                viewModel.dismissRoommate(roommate)
                            }
                        )
                    }
                }
            }
            .padding(16)
        }
    }

    // MARK: - Stats Header

    private var matchingStatsHeader: some View {
        HStack(spacing: 12) {
            MatchStatCard(
                value: "\(viewModel.potentialRoommates.count)",
                label: "Profils compatibles",
                icon: "person.2.fill",
                color: Color(hex: "10B981")
            )

            MatchStatCard(
                value: "\(viewModel.averageCompatibility)%",
                label: "Compatibilité moy.",
                icon: "chart.bar.fill",
                color: Color(hex: "6366F1")
            )

            MatchStatCard(
                value: "\(viewModel.connectionsCount)",
                label: "Connexions",
                icon: "link",
                color: Color(hex: "F59E0B")
            )
        }
    }

    // MARK: - Compatibility Explanation

    private var compatibilityExplanation: some View {
        VStack(spacing: 12) {
            HStack {
                Image(systemName: "sparkles")
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: "10B981"))

                Text("Comment fonctionne le matching ?")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()
            }

            Text("Nous analysons vos préférences de vie, habitudes et personnalité pour vous proposer les colocataires les plus compatibles.")
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "6B7280"))
                .frame(maxWidth: .infinity, alignment: .leading)

            // Legend
            HStack(spacing: 16) {
                CompatibilityLegend(color: Color(hex: "10B981"), label: "90%+ Excellent")
                CompatibilityLegend(color: Color(hex: "F59E0B"), label: "70%+ Bon")
                CompatibilityLegend(color: Color(hex: "6B7280"), label: "<70% Moyen")
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
    }
}

// MARK: - Match Stat Card

struct MatchStatCard: View {
    let value: String
    let label: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundColor(color)

            Text(value)
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            Text(label)
                .font(.system(size: 11))
                .foregroundColor(Color(hex: "6B7280"))
                .lineLimit(1)
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.white)
        .cornerRadius(12)
    }
}

// MARK: - Compatibility Legend

struct CompatibilityLegend: View {
    let color: Color
    let label: String

    var body: some View {
        HStack(spacing: 4) {
            Circle()
                .fill(color)
                .frame(width: 8, height: 8)

            Text(label)
                .font(.system(size: 11))
                .foregroundColor(Color(hex: "6B7280"))
        }
    }
}

// MARK: - Roommate Match Card

struct RoommateMatchCard: View {
    let roommate: PotentialRoommate
    let onConnect: () -> Void
    let onDismiss: () -> Void

    private var compatibilityColor: Color {
        if roommate.compatibilityScore >= 90 {
            return Color(hex: "10B981")
        } else if roommate.compatibilityScore >= 70 {
            return Color(hex: "F59E0B")
        } else {
            return Color(hex: "6B7280")
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            // Header with avatar and score
            HStack(spacing: 16) {
                // Avatar
                ZStack(alignment: .bottomTrailing) {
                    if let avatarUrl = roommate.avatarUrl, let url = URL(string: avatarUrl) {
                        AsyncImage(url: url) { phase in
                            switch phase {
                            case .success(let image):
                                image
                                    .resizable()
                                    .aspectRatio(contentMode: .fill)
                                    .frame(width: 70, height: 70)
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
                    if roommate.isOnline {
                        Circle()
                            .fill(Color(hex: "10B981"))
                            .frame(width: 16, height: 16)
                            .overlay(
                                Circle()
                                    .stroke(Color.white, lineWidth: 2)
                            )
                    }
                }

                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Text(roommate.name)
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(Color(hex: "111827"))

                        if roommate.isVerified {
                            Image(systemName: "checkmark.seal.fill")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "3B82F6"))
                        }
                    }

                    Text("\(roommate.age) ans • \(roommate.occupation)")
                        .font(.system(size: 14))
                        .foregroundColor(Color(hex: "6B7280"))

                    HStack(spacing: 4) {
                        Image(systemName: "mappin")
                            .font(.system(size: 12))
                        Text(roommate.location)
                            .font(.system(size: 13))
                    }
                    .foregroundColor(Color(hex: "9CA3AF"))
                }

                Spacer()

                // Compatibility score
                VStack(spacing: 4) {
                    Text("\(roommate.compatibilityScore)%")
                        .font(.system(size: 22, weight: .bold))
                        .foregroundColor(compatibilityColor)

                    Text("Match")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(Color(hex: "6B7280"))
                }
                .padding(12)
                .background(compatibilityColor.opacity(0.1))
                .cornerRadius(12)
            }
            .padding(16)

            Divider()
                .padding(.horizontal, 16)

            // Compatibility breakdown
            VStack(alignment: .leading, spacing: 12) {
                Text("Compatibilité")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "374151"))

                HStack(spacing: 8) {
                    CompatibilityBadge(
                        icon: "moon.fill",
                        label: "Sommeil",
                        score: roommate.sleepCompatibility
                    )
                    CompatibilityBadge(
                        icon: "briefcase.fill",
                        label: "Travail",
                        score: roommate.workCompatibility
                    )
                    CompatibilityBadge(
                        icon: "sparkles",
                        label: "Propreté",
                        score: roommate.cleanlinessCompatibility
                    )
                    CompatibilityBadge(
                        icon: "person.2.fill",
                        label: "Social",
                        score: roommate.socialCompatibility
                    )
                }
            }
            .padding(16)

            // Shared interests
            if !roommate.sharedInterests.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Intérêts communs")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(Color(hex: "374151"))

                    FlowLayout(spacing: 8) {
                        ForEach(roommate.sharedInterests, id: \.self) { interest in
                            Text(interest)
                                .font(.system(size: 12, weight: .medium))
                                .foregroundColor(Color(hex: "10B981"))
                                .padding(.horizontal, 10)
                                .padding(.vertical, 6)
                                .background(Color(hex: "10B981").opacity(0.1))
                                .cornerRadius(999)
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 16)
            }

            Divider()
                .padding(.horizontal, 16)

            // Actions
            HStack(spacing: 12) {
                Button(action: onDismiss) {
                    HStack(spacing: 6) {
                        Image(systemName: "xmark")
                            .font(.system(size: 14))
                        Text("Passer")
                            .font(.system(size: 14, weight: .medium))
                    }
                    .foregroundColor(Color(hex: "6B7280"))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(Color(hex: "F3F4F6"))
                    .cornerRadius(10)
                }

                Button(action: onConnect) {
                    HStack(spacing: 6) {
                        Image(systemName: "message.fill")
                            .font(.system(size: 14))
                        Text("Connecter")
                            .font(.system(size: 14, weight: .semibold))
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(Color(hex: "10B981"))
                    .cornerRadius(10)
                }
            }
            .padding(16)
        }
        .background(Color.white)
        .cornerRadius(20)
        .shadow(color: .black.opacity(0.06), radius: 10, x: 0, y: 4)
    }

    private var defaultAvatar: some View {
        ZStack {
            Circle()
                .fill(
                    LinearGradient(
                        colors: [Color(hex: "10B981"), Color(hex: "34D399")],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: 70, height: 70)

            Text(roommate.name.prefix(1).uppercased())
                .font(.system(size: 28, weight: .bold))
                .foregroundColor(.white)
        }
    }
}

// MARK: - Compatibility Badge

struct CompatibilityBadge: View {
    let icon: String
    let label: String
    let score: Int

    private var scoreColor: Color {
        if score >= 80 {
            return Color(hex: "10B981")
        } else if score >= 60 {
            return Color(hex: "F59E0B")
        } else {
            return Color(hex: "EF4444")
        }
    }

    var body: some View {
        VStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 14))
                .foregroundColor(scoreColor)

            Text("\(score)%")
                .font(.system(size: 12, weight: .bold))
                .foregroundColor(scoreColor)

            Text(label)
                .font(.system(size: 10))
                .foregroundColor(Color(hex: "9CA3AF"))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 10)
        .background(scoreColor.opacity(0.1))
        .cornerRadius(10)
    }
}

// MARK: - Roommate Filters Sheet

struct RoommateFiltersSheet: View {
    @Environment(\.dismiss) private var dismiss
    @Binding var filters: RoommateFilters
    let onApply: () -> Void

    var body: some View {
        NavigationStack {
            Form {
                Section("Âge") {
                    HStack {
                        Text("Min: \(filters.minAge)")
                        Slider(value: Binding(
                            get: { Double(filters.minAge) },
                            set: { filters.minAge = Int($0) }
                        ), in: 18...60, step: 1)
                    }

                    HStack {
                        Text("Max: \(filters.maxAge)")
                        Slider(value: Binding(
                            get: { Double(filters.maxAge) },
                            set: { filters.maxAge = Int($0) }
                        ), in: 18...60, step: 1)
                    }
                }

                Section("Compatibilité minimum") {
                    Picker("Score minimum", selection: $filters.minCompatibility) {
                        Text("Tous").tag(0)
                        Text("50%+").tag(50)
                        Text("70%+").tag(70)
                        Text("90%+").tag(90)
                    }
                }

                Section("Style de vie") {
                    Toggle("Fumeur accepté", isOn: $filters.smokingOk)
                    Toggle("Animaux acceptés", isOn: $filters.petsOk)
                    Toggle("Profil vérifié uniquement", isOn: $filters.verifiedOnly)
                }
            }
            .navigationTitle("Filtres")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Annuler") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Appliquer") {
                        onApply()
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
        }
        .presentationDetents([.medium])
    }
}

// MARK: - Models

struct PotentialRoommate: Identifiable {
    let id: UUID
    let name: String
    let age: Int
    let occupation: String
    let location: String
    let avatarUrl: String?
    let isOnline: Bool
    let isVerified: Bool
    let compatibilityScore: Int
    let sleepCompatibility: Int
    let workCompatibility: Int
    let cleanlinessCompatibility: Int
    let socialCompatibility: Int
    let sharedInterests: [String]
}

struct RoommateFilters {
    var minAge: Int = 18
    var maxAge: Int = 60
    var minCompatibility: Int = 0
    var smokingOk: Bool = true
    var petsOk: Bool = true
    var verifiedOnly: Bool = false
}

// MARK: - ViewModel

@MainActor
class ResidentMatchingViewModel: ObservableObject {
    @Published var potentialRoommates: [PotentialRoommate] = []
    @Published var filters = RoommateFilters()
    @Published var isLoading = false
    @Published var connectionsCount = 0

    var averageCompatibility: Int {
        guard !potentialRoommates.isEmpty else { return 0 }
        let total = potentialRoommates.reduce(0) { $0 + $1.compatibilityScore }
        return total / potentialRoommates.count
    }

    func loadPotentialRoommates() async {
        isLoading = true

        if AppConfig.FeatureFlags.demoMode {
            try? await Task.sleep(nanoseconds: 800_000_000)

            potentialRoommates = [
                PotentialRoommate(
                    id: UUID(),
                    name: "Sophie Martin",
                    age: 26,
                    occupation: "Designer UX",
                    location: "Bruxelles",
                    avatarUrl: nil,
                    isOnline: true,
                    isVerified: true,
                    compatibilityScore: 94,
                    sleepCompatibility: 90,
                    workCompatibility: 95,
                    cleanlinessCompatibility: 92,
                    socialCompatibility: 88,
                    sharedInterests: ["Yoga", "Cuisine", "Voyages", "Art"]
                ),
                PotentialRoommate(
                    id: UUID(),
                    name: "Lucas Bernard",
                    age: 28,
                    occupation: "Développeur",
                    location: "Bruxelles",
                    avatarUrl: nil,
                    isOnline: false,
                    isVerified: true,
                    compatibilityScore: 87,
                    sleepCompatibility: 85,
                    workCompatibility: 92,
                    cleanlinessCompatibility: 88,
                    socialCompatibility: 80,
                    sharedInterests: ["Gaming", "Sport", "Musique"]
                ),
                PotentialRoommate(
                    id: UUID(),
                    name: "Emma Dubois",
                    age: 24,
                    occupation: "Étudiante",
                    location: "Bruxelles",
                    avatarUrl: nil,
                    isOnline: true,
                    isVerified: false,
                    compatibilityScore: 78,
                    sleepCompatibility: 75,
                    workCompatibility: 80,
                    cleanlinessCompatibility: 82,
                    socialCompatibility: 90,
                    sharedInterests: ["Lecture", "Cinéma"]
                )
            ]

            connectionsCount = 5
        }

        isLoading = false
    }

    func applyFilters() async {
        isLoading = true
        try? await Task.sleep(nanoseconds: 500_000_000)

        potentialRoommates = potentialRoommates.filter { roommate in
            roommate.age >= filters.minAge &&
            roommate.age <= filters.maxAge &&
            roommate.compatibilityScore >= filters.minCompatibility &&
            (!filters.verifiedOnly || roommate.isVerified)
        }

        isLoading = false
    }

    func connectWith(_ roommate: PotentialRoommate) {
        connectionsCount += 1
        // TODO: API call to send connection request
    }

    func dismissRoommate(_ roommate: PotentialRoommate) {
        potentialRoommates.removeAll { $0.id == roommate.id }
    }
}

// MARK: - Preview

struct ResidentMatchingView_Previews: PreviewProvider {
    static var previews: some View {
        ResidentMatchingView()
    }
}
