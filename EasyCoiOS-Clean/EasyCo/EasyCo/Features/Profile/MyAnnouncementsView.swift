//
//  MyAnnouncementsView.swift
//  EasyCo
//
//  User's personal announcements and posts
//

import SwiftUI

struct MyAnnouncementsView: View {
    @StateObject private var viewModel = MyAnnouncementsViewModel()
    @State private var showCreateAnnouncement = false

    var body: some View {
        ScrollView {
            VStack(spacing: Theme.Spacing.md) {
                if viewModel.announcements.isEmpty {
                    emptyStateView
                } else {
                    ForEach(viewModel.announcements) { announcement in
                        AnnouncementCard(
                            announcement: announcement,
                            onEdit: {
                                viewModel.selectedAnnouncement = announcement
                                showCreateAnnouncement = true
                            },
                            onDelete: {
                                viewModel.deleteAnnouncement(announcement)
                            }
                        )
                    }
                }
            }
            .padding()
        }
        .navigationTitle("Mes annonces")
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button {
                    viewModel.selectedAnnouncement = nil
                    showCreateAnnouncement = true
                } label: {
                    Image.lucide("plus")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)
                        .foregroundColor(Theme.Colors.primary)
                }
            }
        }
        .sheet(isPresented: $showCreateAnnouncement) {
            CreateAnnouncementView(
                announcement: viewModel.selectedAnnouncement,
                onSave: { title, description in
                    if let existing = viewModel.selectedAnnouncement {
                        viewModel.updateAnnouncement(existing, title: title, description: description)
                    } else {
                        viewModel.createAnnouncement(title: title, description: description)
                    }
                    showCreateAnnouncement = false
                }
            )
        }
        .task {
            await viewModel.loadAnnouncements()
        }
    }

    private var emptyStateView: some View {
        VStack(spacing: Theme.Spacing.lg) {
            Image.lucide("megaphone.fill")
                .resizable()
                .scaledToFit()
                .frame(width: 80, height: 80)
                .foregroundColor(Theme.Colors.textTertiary)
                .padding(.top, 60)

            VStack(spacing: Theme.Spacing.sm) {
                Text("Aucune annonce")
                    .font(Theme.Typography.title3(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Créez votre première annonce pour partager des informations avec votre communauté")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
            }

            Button {
                showCreateAnnouncement = true
            } label: {
                HStack(spacing: 8) {
                    Image.lucide("plus")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 16, height: 16)
                    Text("Créer une annonce")
                }
                .font(Theme.Typography.body(.semibold))
                .foregroundColor(.white)
                .padding(.horizontal, 24)
                .padding(.vertical, 12)
                .background(Theme.Colors.primary)
                .cornerRadius(Theme.CornerRadius.md)
            }
            .padding(.top, Theme.Spacing.md)
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Announcement Card

// struct AnnouncementCard: View {
//     let announcement: Announcement
//     let onEdit: () -> Void
//     let onDelete: () -> Void
//     @State private var showDeleteAlert = false
// 
//     var body: some View {
//         VStack(alignment: .leading, spacing: Theme.Spacing.md) {
//             HStack {
//                 VStack(alignment: .leading, spacing: 4) {
//                     Text(announcement.title)
//                         .font(Theme.Typography.headline(.semibold))
//                         .foregroundColor(Theme.Colors.textPrimary)
// 
//                     Text(announcement.createdAt.formatted(date: .abbreviated, time: .shortened))
//                         .font(Theme.Typography.caption())
//                         .foregroundColor(Theme.Colors.textSecondary)
//                 }
// 
//                 Spacer()
// 
//                 Menu {
//                     Button {
//                         onEdit()
//                     } label: {
//                         Label("Modifier", systemImage: "pencil")
//                     }
// 
//                     Button(role: .destructive) {
//                         showDeleteAlert = true
//                     } label: {
//                         Label("Supprimer", systemImage: "trash")
//                     }
//                 } label: {
//                     Image(systemName: "ellipsis")
//                         .font(.title3)
//                         .foregroundColor(Theme.Colors.textSecondary)
//                         .frame(width: 32, height: 32)
//                 }
//             }
// 
//             Text(announcement.description)
//                 .font(Theme.Typography.body())
//                 .foregroundColor(Theme.Colors.textSecondary)
//                 .lineLimit(3)
// 
//             HStack(spacing: Theme.Spacing.sm) {
//                 Label("\(announcement.views)", systemImage: "eye")
//                     .font(Theme.Typography.caption())
//                     .foregroundColor(Theme.Colors.textTertiary)
//             }
//         }
//         .padding()
//         .background(Theme.Colors.backgroundSecondary)
//         .cornerRadius(Theme.CornerRadius.md)
//         .alert("Supprimer l'annonce", isPresented: $showDeleteAlert) {
//             Button("Annuler", role: .cancel) {}
//             Button("Supprimer", role: .destructive) {
//                 onDelete()
//             }
//         } message: {
//             Text("Êtes-vous sûr de vouloir supprimer cette annonce ?")
//         }
//     }
// }

// MARK: - Create Announcement View

// struct CreateAnnouncementView: View {
//     let announcement: Announcement?
//     let onSave: (String, String) -> Void
//     @Environment(\.dismiss) private var dismiss
// 
//     @State private var title = ""
//     @State private var description = ""
// 
//     var body: some View {
//         NavigationStack {
//             Form {
//                 Section("Titre") {
//                     TextField("Titre de l'annonce", text: $title)
//                 }
// 
//                 Section("Description") {
//                     TextEditor(text: $description)
//                         .frame(minHeight: 150)
//                 }
//             }
//             .navigationTitle(announcement == nil ? "Nouvelle annonce" : "Modifier l'annonce")
//             .navigationBarTitleDisplayMode(.inline)
//             .toolbar {
//                 ToolbarItem(placement: .navigationBarLeading) {
//                     Button("Annuler") {
//                         dismiss()
//                     }
//                 }
// 
//                 ToolbarItem(placement: .navigationBarTrailing) {
//                     Button("Publier") {
//                         onSave(title, description)
//                     }
//                     .disabled(title.isEmpty || description.isEmpty)
//                 }
//             }
//             .onAppear {
//                 if let announcement = announcement {
//                     title = announcement.title
//                     description = announcement.description
//                 }
//             }
//         }
//     }
// }

// MARK: - Model

// struct Announcement: Identifiable {
//     let id: String
//     var title: String
//     var description: String
//     let createdAt: Date
//     var views: Int
// }

// MARK: - View Model

@MainActor
class MyAnnouncementsViewModel: ObservableObject {
    @Published var announcements: [Announcement] = []
    @Published var isLoading = false
    @Published var selectedAnnouncement: Announcement?

    func loadAnnouncements() async {
        isLoading = true

        // Simulate API call
        try? await Task.sleep(nanoseconds: 500_000_000)

        // Mock data
        announcements = [
            Announcement(
                id: "1",
                title: "Recherche colocataire",
                description: "Je recherche un colocataire pour partager un appartement T3 dans le centre-ville. Loyer 600€/mois.",
                createdAt: Date().addingTimeInterval(-86400 * 3),
                views: 24
            ),
            Announcement(
                id: "2",
                title: "Vide grenier dimanche",
                description: "Organisation d'un vide grenier dans la résidence ce dimanche de 10h à 18h. Tout le monde est le bienvenu!",
                createdAt: Date().addingTimeInterval(-86400 * 7),
                views: 56
            )
        ]

        isLoading = false
    }

    func createAnnouncement(title: String, description: String) {
        let newAnnouncement = Announcement(
            id: UUID().uuidString,
            title: title,
            description: description,
            createdAt: Date(),
            views: 0
        )
        announcements.insert(newAnnouncement, at: 0)
    }

    func updateAnnouncement(_ announcement: Announcement, title: String, description: String) {
        if let index = announcements.firstIndex(where: { $0.id == announcement.id }) {
            announcements[index].title = title
            announcements[index].description = description
        }
    }

    func deleteAnnouncement(_ announcement: Announcement) {
        announcements.removeAll { $0.id == announcement.id }
    }
}

// MARK: - Preview

struct MyAnnouncementsView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            MyAnnouncementsView()
        }
    }
}
