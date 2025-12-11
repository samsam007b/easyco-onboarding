//
//  AnnouncementsView.swift
//  IzzIco
//
//  Vue des annonces importantes de la colocation
//

import SwiftUI

struct AnnouncementsView: View {
    @StateObject private var viewModel = AnnouncementsViewModel()

    private let role: Theme.UserRole = .resident

    var body: some View{
        NavigationStack {
            VStack(spacing: 0) {
                if viewModel.isLoading {
                    loadingView
                } else if viewModel.announcements.isEmpty {
                    emptyStateView
                } else {
                    announcementsListSection
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Annonces")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { viewModel.showCreateAnnouncement = true }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(role.primaryColor)
                    }
                }
            }
            .sheet(isPresented: $viewModel.showCreateAnnouncement) {
                CreateAnnouncementView(viewModel: viewModel)
            }
            .refreshable {
                await viewModel.refresh()
            }
        }
    }

    // MARK: - Announcements List

    private var announcementsListSection: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(viewModel.announcements) { announcement in
                    AnnouncementCard(announcement: announcement)
                }
            }
            .padding(16)
        }
    }

    // MARK: - Loading View

    private var loadingView: some View {
        VStack(spacing: 16) {
            ProgressView()
                .scaleEffect(1.5)
            Text("Chargement...")
                .font(.system(size: 16))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 20) {
            Image(systemName: "megaphone")
                .font(.system(size: 60))
                .foregroundColor(role.primaryColor.opacity(0.5))

            Text("Aucune annonce")
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            Text("Créez votre première annonce\npour informer vos colocataires")
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "6B7280"))
                .multilineTextAlignment(.center)

            Button(action: { viewModel.showCreateAnnouncement = true }) {
                HStack {
                    Image(systemName: "plus.circle.fill")
                    Text("Créer une annonce")
                }
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.white)
                .padding(.horizontal, 24)
                .padding(.vertical, 12)
                .background(role.primaryColor)
                .cornerRadius(12)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(32)
    }
}

// MARK: - Announcement Card

struct AnnouncementCard: View {
    let announcement: Announcement
    let role: Theme.UserRole = .resident

    var body: some View{
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                Circle()
                    .fill(Color(hex: announcement.priority.color).opacity(0.2))
                    .frame(width: 40, height: 40)
                    .overlay(
                        Image(systemName: announcement.priority.icon)
                            .font(.system(size: 18))
                            .foregroundColor(Color(hex: announcement.priority.color))
                    )

                VStack(alignment: .leading, spacing: 4) {
                    Text(announcement.title)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    HStack(spacing: 8) {
                        Text(announcement.authorName)
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "6B7280"))

                        Circle()
                            .fill(Color(hex: "9CA3AF"))
                            .frame(width: 3, height: 3)

                        Text(announcement.createdAt, style: .relative)
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }

                Spacer()

                // Priority badge
                Text(announcement.priority.displayName)
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(Color(hex: announcement.priority.color))
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(Color(hex: announcement.priority.color).opacity(0.1))
                    .cornerRadius(12)
            }

            // Content
            Text(announcement.content)
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "374151"))
                .lineLimit(announcement.isExpanded ? nil : 3)

            // Footer
            HStack {
                // View count
                HStack(spacing: 4) {
                    Image(systemName: "eye.fill")
                        .font(.system(size: 11))
                    Text("\(announcement.viewCount)")
                        .font(.system(size: 12))
                }
                .foregroundColor(Color(hex: "6B7280"))

                Spacer()

                // Read more
                if announcement.content.count > 100 {
                    Button(action: {}) {
                        Text("Lire plus")
                            .font(.system(size: 13, weight: .medium))
                            .foregroundColor(role.primaryColor)
                    }
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
    }
}

// MARK: - Create Announcement View

struct CreateAnnouncementView: View {
    @ObservedObject var viewModel: AnnouncementsViewModel
    @Environment(\.dismiss) var dismiss

    private let role: Theme.UserRole = .resident

    @State private var title = ""
    @State private var content = ""
    @State private var priority: AnnouncementPriority = .normal

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Titre")
                            .font(.system(size: 16, weight: .semibold))

                        TextField("Titre de l'annonce", text: $title)
                            .padding(12)
                            .background(Color.white)
                            .cornerRadius(12)
                    }

                    VStack(alignment: .leading, spacing: 12) {
                        Text("Message")
                            .font(.system(size: 16, weight: .semibold))

                        TextField("Écrivez votre message...", text: $content, axis: .vertical)
                            .lineLimit(5...15)
                            .padding(12)
                            .background(Color.white)
                            .cornerRadius(12)
                    }

                    VStack(alignment: .leading, spacing: 12) {
                        Text("Priorité")
                            .font(.system(size: 16, weight: .semibold))

                        Picker("Priorité", selection: $priority) {
                            ForEach(AnnouncementPriority.allCases, id: \.self) { p in
                                Label(p.displayName, systemImage: p.icon).tag(p)
                            }
                        }
                        .pickerStyle(.segmented)
                    }
                }
                .padding(16)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Nouvelle Annonce")
                        .font(.system(size: 18, weight: .semibold))
                }
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") { dismiss() }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: createAnnouncement) {
                        Text("Publier")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 20)
                            .padding(.vertical, 8)
                            .background(role.primaryColor)
                            .cornerRadius(10)
                    }
                }
            }
        }
    }

    private func createAnnouncement() {
        let announcement = Announcement(
            title: title,
            content: content,
            priority: priority,
            authorId: UUID(),
            authorName: "Moi"
        )

        _Concurrency.Task {
            await viewModel.createAnnouncement(announcement)
            dismiss()
        }
    }
}

// MARK: - ViewModel

@MainActor
class AnnouncementsViewModel: ObservableObject {
    @Published var announcements: [Announcement] = []
    @Published var isLoading = false
    @Published var showCreateAnnouncement = false

    init() {
        loadAnnouncements()
    }

    func loadAnnouncements() {
        isLoading = true
        _Concurrency.Task {
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
            self.announcements = Announcement.mockAnnouncements
            self.isLoading = false
        }
    }

    func refresh() async {
        loadAnnouncements()
    }

    func createAnnouncement(_ announcement: Announcement) async {
        announcements.insert(announcement, at: 0)
    }
}

// MARK: - Models

struct Announcement: Identifiable {
    let id: UUID
    let title: String
    let content: String
    let priority: AnnouncementPriority
    let authorId: UUID
    let authorName: String
    let createdAt: Date
    var viewCount: Int
    var isExpanded: Bool = false

    init(
        id: UUID = UUID(),
        title: String,
        content: String,
        priority: AnnouncementPriority,
        authorId: UUID,
        authorName: String,
        createdAt: Date = Date(),
        viewCount: Int = 0
    ) {
        self.id = id
        self.title = title
        self.content = content
        self.priority = priority
        self.authorId = authorId
        self.authorName = authorName
        self.createdAt = createdAt
        self.viewCount = viewCount
    }

    static let mockAnnouncements: [Announcement] = [
        Announcement(
            title: "Réunion importante demain",
            content: "N'oubliez pas la réunion mensuelle demain à 19h. On va parler du budget, des travaux à venir et de l'organisation des tâches.",
            priority: .high,
            authorId: UUID(),
            authorName: "Marie",
            createdAt: Date().addingTimeInterval(-3600),
            viewCount: 12
        ),
        Announcement(
            title: "Coupure d'eau jeudi",
            content: "Le syndic nous informe qu'il y aura une coupure d'eau jeudi de 9h à 16h pour des travaux de plomberie dans l'immeuble.",
            priority: .urgent,
            authorId: UUID(),
            authorName: "Thomas",
            createdAt: Date().addingTimeInterval(-7200),
            viewCount: 18
        ),
        Announcement(
            title: "Nouveau code wifi",
            content: "Le code wifi a été changé pour plus de sécurité. Nouveau code: Coloc2024!Secure",
            priority: .normal,
            authorId: UUID(),
            authorName: "Julie",
            createdAt: Date().addingTimeInterval(-86400),
            viewCount: 24
        )
    ]
}

enum AnnouncementPriority: String, CaseIterable {
    case normal = "normal"
    case high = "high"
    case urgent = "urgent"

    var displayName: String {
        switch self {
        case .normal: return "Normal"
        case .high: return "Important"
        case .urgent: return "Urgent"
        }
    }

    var icon: String {
        switch self {
        case .normal: return "info.circle"
        case .high: return "exclamationmark.circle"
        case .urgent: return "exclamationmark.triangle.fill"
        }
    }

    var color: String {
        switch self {
        case .normal: return "3B82F6"
        case .high: return "F59E0B"
        case .urgent: return "EF4444"
        }
    }
}

// MARK: - Preview

struct AnnouncementsView_Previews: PreviewProvider {
    static var previews: some View {
        AnnouncementsView()
    }
}
