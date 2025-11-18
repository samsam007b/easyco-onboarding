import SwiftUI

// MARK: - Applications View (Owner)

struct ApplicationsView: View {
    @State private var applications: [Application] = []
    @State private var isLoading = false
    @State private var searchText = ""
    @State private var selectedProperty: UUID?
    @State private var selectedStatus: ApplicationStatus?

    var body: some View {
        NavigationStack {
            Group {
                if isLoading {
                    LoadingView(message: "Chargement des candidatures...")
                } else if applications.isEmpty {
                    emptyStateView
                } else {
                    applicationsContent
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Candidatures")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }
            }
        }
        .task {
            await loadApplications()
        }
    }

    // MARK: - Applications Content

    private var applicationsContent: some View {
        VStack(spacing: 0) {
            // Filters
            filtersSection

            // List
            ScrollView {
                LazyVStack(spacing: 12) {
                    ForEach(filteredApplications) { application in
                        // TODO: Implement ApplicationDetailView
                        ApplicationCard(application: application)
                            .buttonStyle(PlainButtonStyle())
                    }
                }
                .padding(16)
            }
        }
    }

    // MARK: - Filters Section

    private var filtersSection: some View {
        VStack(spacing: 12) {
            // Search Bar
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(Color(hex: "9CA3AF"))
                TextField("Rechercher par nom...", text: $searchText)
                    .font(.system(size: 16))

                if !searchText.isEmpty {
                    Button(action: { searchText = "" }) {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(Color(hex: "9CA3AF"))
                    }
                }
            }
            .padding(12)
            .background(Color.white)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
            )

            // Property and Status Filters
            HStack(spacing: 12) {
                // Property Filter (placeholder - will need list of properties)
                Menu {
                    Button("Toutes les propriétés") {
                        selectedProperty = nil
                    }
                    // TODO: Add actual properties
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "building.2")
                            .font(.system(size: 14))
                        Text("Toutes")
                            .font(.system(size: 14, weight: .medium))
                        Image(systemName: "chevron.down")
                            .font(.system(size: 10))
                    }
                    .foregroundColor(Color(hex: "6E56CF"))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(Color(hex: "F3F0FF"))
                    .cornerRadius(8)
                }

                // Status Filter
                Menu {
                    Button("Tous les statuts") {
                        selectedStatus = nil
                    }
                    ForEach(ApplicationStatus.allCases, id: \.self) { status in
                        Button(status.displayName) {
                            selectedStatus = status
                        }
                    }
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "line.3.horizontal.decrease.circle")
                            .font(.system(size: 14))
                        Text(selectedStatus?.displayName ?? "Tous")
                            .font(.system(size: 14, weight: .medium))
                        Image(systemName: "chevron.down")
                            .font(.system(size: 10))
                    }
                    .foregroundColor(Color(hex: "6E56CF"))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(Color(hex: "F3F0FF"))
                    .cornerRadius(8)
                }

                Spacer()

                // Results count
                Text("\(filteredApplications.count) candidature(s)")
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))
            }
        }
        .padding(16)
        .background(Color(hex: "F9FAFB"))
    }

    // MARK: - Computed Properties

    private var filteredApplications: [Application] {
        var result = applications

        // Filter by search text
        if !searchText.isEmpty {
            result = result.filter { application in
                application.applicantName.localizedCaseInsensitiveContains(searchText)
            }
        }

        // Filter by property
        if let propertyId = selectedProperty {
            result = result.filter { $0.propertyId == propertyId }
        }

        // Filter by status
        if let status = selectedStatus {
            result = result.filter { $0.status == status }
        }

        // Sort: new first, then by date
        result.sort { app1, app2 in
            if app1.isNew != app2.isNew {
                return app1.isNew
            }
            return app1.date > app2.date
        }

        return result
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Spacer()

            ZStack {
                Circle()
                    .fill(Color(hex: "F3F0FF"))
                    .frame(width: 120, height: 120)

                Image(systemName: "doc.text")
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "6E56CF"))
            }

            VStack(spacing: 12) {
                Text("Aucune candidature")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Vos candidatures apparaîtront ici")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
            }

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Data Methods

    private func loadApplications() async {
        isLoading = true

        // Demo mode
        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
            applications = Application.mockApplications
        }

        isLoading = false
    }
}

// MARK: - Application Model

struct Application: Identifiable {
    let id: UUID
    let applicantName: String
    let applicantAge: Int
    let applicantAvatar: String?
    let propertyId: UUID
    let propertyTitle: String
    let date: Date
    var status: ApplicationStatus
    let isNew: Bool
    let isGroup: Bool
    let groupSize: Int?
    let message: String

    static var mockApplications: [Application] {
        [
            Application(
                id: UUID(),
                applicantName: "Sophie Martin",
                applicantAge: 28,
                applicantAvatar: nil,
                propertyId: UUID(),
                propertyTitle: "Studio meublé - Ixelles",
                date: Date().addingTimeInterval(-3600),
                status: .new,
                isNew: true,
                isGroup: false,
                groupSize: nil,
                message: "Bonjour, je suis très intéressée par votre appartement..."
            ),
            Application(
                id: UUID(),
                applicantName: "Thomas & Marie",
                applicantAge: 30,
                applicantAvatar: nil,
                propertyId: UUID(),
                propertyTitle: "2 chambres - Saint-Gilles",
                date: Date().addingTimeInterval(-7200),
                status: .underReview,
                isNew: false,
                isGroup: true,
                groupSize: 2,
                message: "Nous sommes un couple à la recherche d'un appartement..."
            ),
            Application(
                id: UUID(),
                applicantName: "Lucas Dubois",
                applicantAge: 25,
                applicantAvatar: nil,
                propertyId: UUID(),
                propertyTitle: "Colocation - Schaerbeek",
                date: Date().addingTimeInterval(-86400),
                status: .accepted,
                isNew: false,
                isGroup: false,
                groupSize: nil,
                message: "Je cherche une colocation pour septembre..."
            )
        ]
    }
}

// MARK: - Application Status

enum ApplicationStatus: String, CaseIterable {
    case new = "Nouvelle"
    case underReview = "En examen"
    case accepted = "Acceptée"
    case rejected = "Refusée"

    var displayName: String {
        self.rawValue
    }

    var color: Color {
        switch self {
        case .new: return Color(hex: "3B82F6")
        case .underReview: return Color(hex: "FBBF24")
        case .accepted: return Color(hex: "10B981")
        case .rejected: return Color(hex: "EF4444")
        }
    }
}

// MARK: - Application Card

struct ApplicationCard: View {
    let application: Application

    var body: some View {
        HStack(spacing: 12) {
            // Avatar
            Circle()
                .fill(
                    LinearGradient(
                        colors: [Color(hex: "6E56CF"), Color(hex: "8B5CF6")],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(width: 56, height: 56)
                .overlay(
                    Group {
                        if let avatar = application.applicantAvatar {
                            AsyncImage(url: URL(string: avatar)) { image in
                                image.resizable()
                            } placeholder: {
                                Text(String(application.applicantName.prefix(1)))
                                    .font(.system(size: 22, weight: .bold))
                                    .foregroundColor(.white)
                            }
                        } else {
                            Text(String(application.applicantName.prefix(1)))
                                .font(.system(size: 22, weight: .bold))
                                .foregroundColor(.white)
                        }
                    }
                )

            VStack(alignment: .leading, spacing: 6) {
                HStack(spacing: 8) {
                    Text(application.applicantName)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    if application.isNew {
                        Text("NOUVEAU")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color(hex: "EF4444"))
                            .cornerRadius(4)
                    }

                    if application.isGroup {
                        HStack(spacing: 2) {
                            Image(systemName: "person.2.fill")
                                .font(.system(size: 10))
                            Text("\(application.groupSize ?? 0)")
                                .font(.system(size: 11, weight: .medium))
                        }
                        .foregroundColor(Color(hex: "6E56CF"))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color(hex: "F3F0FF"))
                        .cornerRadius(4)
                    }
                }

                Text(application.propertyTitle)
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "6B7280"))

                HStack(spacing: 12) {
                    HStack(spacing: 4) {
                        Image(systemName: "clock")
                            .font(.system(size: 11))
                        Text(application.date.timeAgo)
                            .font(.system(size: 12))
                    }
                    .foregroundColor(Color(hex: "9CA3AF"))

                    HStack(spacing: 4) {
                        Circle()
                            .fill(application.status.color)
                            .frame(width: 6, height: 6)
                        Text(application.status.displayName)
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(application.status.color)
                    }
                }
            }

            Spacer()

            Image(systemName: "chevron.right")
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "9CA3AF"))
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}
