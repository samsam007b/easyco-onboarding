import SwiftUI

// MARK: - Community View

struct CommunityView: View {
    @StateObject private var viewModel = CommunityViewModel()
    @State private var selectedCategory: CommunityCategory = .all
    @State private var showCreatePost = false
    @State private var showFilters = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Category filter
                categorySelector

                // Content
                ScrollView {
                    LazyVStack(spacing: 16) {
                        // Featured section
                        if selectedCategory == .all && !viewModel.featuredPosts.isEmpty {
                            featuredSection
                        }

                        // Events section
                        if selectedCategory == .all || selectedCategory == .events {
                            if !viewModel.upcomingEvents.isEmpty {
                                eventsSection
                            }
                        }

                        // Posts
                        ForEach(viewModel.filteredPosts(for: selectedCategory)) { post in
                            CommunityPostCard(
                                post: post,
                                onLike: { viewModel.toggleLike(post) },
                                onComment: { viewModel.openComments(post) },
                                onShare: { viewModel.sharePost(post) }
                            )
                        }

                        if viewModel.isLoading {
                            ProgressView()
                                .padding()
                        }
                    }
                    .padding(16)
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationTitle("Communauté")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { showFilters = true }) {
                        Image(systemName: "line.3.horizontal.decrease.circle")
                            .font(.system(size: 20))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showCreatePost = true }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(Color(hex: "FFA040"))
                    }
                }
            }
            .sheet(isPresented: $showCreatePost) {
                CreateCommunityPostView(onPost: { post in
                    viewModel.addPost(post)
                })
            }
            .sheet(isPresented: $showFilters) {
                CommunityFiltersSheet(viewModel: viewModel)
            }
        }
        .task {
            await viewModel.loadCommunityData()
        }
    }

    // MARK: - Category Selector

    private var categorySelector: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(CommunityCategory.allCases, id: \.self) { category in
                    CategoryChip(
                        category: category,
                        isSelected: selectedCategory == category,
                        onTap: {
                            withAnimation {
                                selectedCategory = category
                            }
                        }
                    )
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .background(Color.white)
    }

    // MARK: - Featured Section

    private var featuredSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "star.fill")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "F59E0B"))

                Text("À la une")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()
            }

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 14) {
                    ForEach(viewModel.featuredPosts) { post in
                        FeaturedPostCard(post: post)
                    }
                }
            }
        }
    }

    // MARK: - Events Section

    private var eventsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "calendar.badge.clock")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6366F1"))

                Text("Événements à venir")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Spacer()

                Button("Voir tout") {}
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(hex: "FFA040"))
            }

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 14) {
                    ForEach(viewModel.upcomingEvents) { event in
                        CommunityEventCard(event: event)
                    }
                }
            }
        }
    }
}

// MARK: - Category Chip

struct CategoryChip: View {
    let category: CommunityCategory
    let isSelected: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 6) {
                Image(systemName: category.icon)
                    .font(.system(size: 14))

                Text(category.title)
                    .font(.system(size: 14, weight: .medium))
            }
            .foregroundColor(isSelected ? .white : Color(hex: "6B7280"))
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            .background(
                isSelected
                    ? Color(hex: "FFA040")
                    : Color(hex: "F3F4F6")
            )
            .cornerRadius(999)
        }
    }
}

// MARK: - Featured Post Card

struct FeaturedPostCard: View {
    let post: CommunityPost

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Image
            if let imageUrl = post.imageUrl {
                AsyncImage(url: URL(string: imageUrl)) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(width: 260, height: 140)
                            .clipped()
                            .cornerRadius(12)
                    case .failure(_), .empty:
                        Rectangle()
                            .fill(Color(hex: "E5E7EB"))
                            .frame(width: 260, height: 140)
                            .cornerRadius(12)
                            .overlay(
                                Image(systemName: "photo")
                                    .font(.system(size: 30))
                                    .foregroundColor(Color(hex: "9CA3AF"))
                            )
                    @unknown default:
                        EmptyView()
                    }
                }
            }

            VStack(alignment: .leading, spacing: 6) {
                // Category badge
                Text(post.category.title)
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(Color(hex: "FFA040"))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(Color(hex: "FFA040").opacity(0.1))
                    .cornerRadius(999)

                Text(post.title)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))
                    .lineLimit(2)

                HStack(spacing: 12) {
                    Label("\(post.likes)", systemImage: "heart.fill")
                        .foregroundColor(Color(hex: "EF4444"))

                    Label("\(post.comments)", systemImage: "bubble.right.fill")
                        .foregroundColor(Color(hex: "6B7280"))
                }
                .font(.system(size: 12))
            }
            .padding(.horizontal, 4)
        }
        .frame(width: 260)
        .padding(12)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.06), radius: 8, x: 0, y: 2)
    }
}

// MARK: - Community Post Card

struct CommunityPostCard: View {
    let post: CommunityPost
    let onLike: () -> Void
    let onComment: () -> Void
    let onShare: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Header
            HStack(spacing: 12) {
                // Author avatar
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "FFA040"), Color(hex: "FFD580")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 44, height: 44)
                    .overlay(
                        Text(post.authorInitials)
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                    )

                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: 6) {
                        Text(post.authorName)
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(Color(hex: "111827"))

                        if post.isVerified {
                            Image(systemName: "checkmark.seal.fill")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "3B82F6"))
                        }
                    }

                    HStack(spacing: 6) {
                        Text(post.timeAgo)
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "9CA3AF"))

                        Text("•")
                            .foregroundColor(Color(hex: "D1D5DB"))

                        Text(post.category.title)
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(post.category.color)
                    }
                }

                Spacer()

                Menu {
                    Button(action: {}) {
                        Label("Signaler", systemImage: "flag")
                    }
                    Button(action: {}) {
                        Label("Masquer", systemImage: "eye.slash")
                    }
                } label: {
                    Image(systemName: "ellipsis")
                        .font(.system(size: 16))
                        .foregroundColor(Color(hex: "6B7280"))
                        .frame(width: 32, height: 32)
                }
            }

            // Content
            Text(post.title)
                .font(.system(size: 17, weight: .semibold))
                .foregroundColor(Color(hex: "111827"))

            Text(post.content)
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "374151"))
                .lineLimit(4)

            // Image if present
            if let imageUrl = post.imageUrl {
                AsyncImage(url: URL(string: imageUrl)) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(maxHeight: 200)
                            .clipped()
                            .cornerRadius(12)
                    case .failure(_), .empty:
                        EmptyView()
                    @unknown default:
                        EmptyView()
                    }
                }
            }

            // Tags
            if !post.tags.isEmpty {
                FlowLayout(spacing: 8) {
                    ForEach(post.tags, id: \.self) { tag in
                        Text("#\(tag)")
                            .font(.system(size: 13, weight: .medium))
                            .foregroundColor(Color(hex: "6366F1"))
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .background(Color(hex: "6366F1").opacity(0.1))
                            .cornerRadius(999)
                    }
                }
            }

            Divider()

            // Actions
            HStack(spacing: 0) {
                Button(action: onLike) {
                    HStack(spacing: 6) {
                        Image(systemName: post.isLiked ? "heart.fill" : "heart")
                            .foregroundColor(post.isLiked ? Color(hex: "EF4444") : Color(hex: "6B7280"))

                        Text("\(post.likes)")
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                    .font(.system(size: 14))
                    .frame(maxWidth: .infinity)
                }

                Button(action: onComment) {
                    HStack(spacing: 6) {
                        Image(systemName: "bubble.right")
                            .foregroundColor(Color(hex: "6B7280"))

                        Text("\(post.comments)")
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                    .font(.system(size: 14))
                    .frame(maxWidth: .infinity)
                }

                Button(action: onShare) {
                    HStack(spacing: 6) {
                        Image(systemName: "square.and.arrow.up")
                            .foregroundColor(Color(hex: "6B7280"))

                        Text("Partager")
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                    .font(.system(size: 14))
                    .frame(maxWidth: .infinity)
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.04), radius: 6, x: 0, y: 2)
    }
}

// MARK: - Community Event Card

struct CommunityEventCard: View {
    let event: CommunityEvent

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Date badge
            HStack(spacing: 8) {
                VStack(spacing: 2) {
                    Text(event.dayOfMonth)
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(Color(hex: "6366F1"))

                    Text(event.monthShort)
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(Color(hex: "6366F1"))
                }
                .frame(width: 50, height: 50)
                .background(Color(hex: "6366F1").opacity(0.1))
                .cornerRadius(10)

                VStack(alignment: .leading, spacing: 4) {
                    Text(event.title)
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                        .lineLimit(2)

                    HStack(spacing: 4) {
                        Image(systemName: "clock")
                            .font(.system(size: 11))
                        Text(event.time)
                            .font(.system(size: 12))
                    }
                    .foregroundColor(Color(hex: "6B7280"))
                }
            }

            // Location
            HStack(spacing: 6) {
                Image(systemName: event.isOnline ? "video.fill" : "location.fill")
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "FFA040"))

                Text(event.isOnline ? "En ligne" : event.location)
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))
                    .lineLimit(1)
            }

            // Attendees
            HStack {
                // Avatars stack
                HStack(spacing: -8) {
                    ForEach(0..<min(3, event.attendeesCount), id: \.self) { index in
                        Circle()
                            .fill(Color(hex: attendeeColors[index % attendeeColors.count]))
                            .frame(width: 24, height: 24)
                            .overlay(
                                Circle()
                                    .stroke(Color.white, lineWidth: 2)
                            )
                    }
                }

                Text("\(event.attendeesCount) participants")
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "6B7280"))

                Spacer()

                Button(action: {}) {
                    Text("Participer")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Color(hex: "6366F1"))
                        .cornerRadius(999)
                }
            }
        }
        .padding(14)
        .frame(width: 280)
        .background(Color.white)
        .cornerRadius(14)
        .shadow(color: .black.opacity(0.04), radius: 6, x: 0, y: 2)
    }

    private let attendeeColors = ["FFA040", "6366F1", "10B981", "EF4444"]
}

// MARK: - Create Community Post View

struct CreateCommunityPostView: View {
    let onPost: (CommunityPost) -> Void
    @Environment(\.dismiss) private var dismiss
    @State private var title = ""
    @State private var content = ""
    @State private var selectedCategory: CommunityCategory = .tips
    @State private var tags: [String] = []
    @State private var newTag = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Category picker
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Catégorie")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(Color(hex: "6B7280"))

                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 10) {
                                ForEach(CommunityCategory.allCases.filter { $0 != .all }, id: \.self) { category in
                                    CategoryChip(
                                        category: category,
                                        isSelected: selectedCategory == category,
                                        onTap: { selectedCategory = category }
                                    )
                                }
                            }
                        }
                    }

                    // Title
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Titre")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(Color(hex: "6B7280"))

                        TextField("Un titre accrocheur...", text: $title)
                            .font(.system(size: 16))
                            .padding(14)
                            .background(Color(hex: "F9FAFB"))
                            .cornerRadius(10)
                            .overlay(
                                RoundedRectangle(cornerRadius: 10)
                                    .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                            )
                    }

                    // Content
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Contenu")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(Color(hex: "6B7280"))

                        TextField("Partagez votre expérience, posez une question...", text: $content, axis: .vertical)
                            .font(.system(size: 16))
                            .lineLimit(5...10)
                            .padding(14)
                            .background(Color(hex: "F9FAFB"))
                            .cornerRadius(10)
                            .overlay(
                                RoundedRectangle(cornerRadius: 10)
                                    .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                            )
                    }

                    // Tags
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Tags (optionnel)")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(Color(hex: "6B7280"))

                        HStack {
                            TextField("Ajouter un tag...", text: $newTag)
                                .font(.system(size: 15))

                            Button(action: {
                                if !newTag.isEmpty && !tags.contains(newTag) {
                                    tags.append(newTag)
                                    newTag = ""
                                }
                            }) {
                                Image(systemName: "plus.circle.fill")
                                    .font(.system(size: 24))
                                    .foregroundColor(Color(hex: "FFA040"))
                            }
                            .disabled(newTag.isEmpty)
                        }
                        .padding(12)
                        .background(Color(hex: "F9FAFB"))
                        .cornerRadius(10)

                        if !tags.isEmpty {
                            FlowLayout(spacing: 8) {
                                ForEach(tags, id: \.self) { tag in
                                    HStack(spacing: 4) {
                                        Text("#\(tag)")
                                            .font(.system(size: 13, weight: .medium))

                                        Button(action: {
                                            tags.removeAll { $0 == tag }
                                        }) {
                                            Image(systemName: "xmark")
                                                .font(.system(size: 10, weight: .bold))
                                        }
                                    }
                                    .foregroundColor(Color(hex: "6366F1"))
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 6)
                                    .background(Color(hex: "6366F1").opacity(0.1))
                                    .cornerRadius(999)
                                }
                            }
                        }
                    }

                    // Media buttons
                    HStack(spacing: 12) {
                        Button(action: {}) {
                            HStack(spacing: 6) {
                                Image(systemName: "photo")
                                Text("Photo")
                            }
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(Color(hex: "6B7280"))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color(hex: "F3F4F6"))
                            .cornerRadius(10)
                        }

                        Button(action: {}) {
                            HStack(spacing: 6) {
                                Image(systemName: "link")
                                Text("Lien")
                            }
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(Color(hex: "6B7280"))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color(hex: "F3F4F6"))
                            .cornerRadius(10)
                        }
                    }
                }
                .padding(16)
            }
            .background(Color.white)
            .navigationTitle("Nouveau post")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Annuler") { dismiss() }
                        .foregroundColor(Color(hex: "6B7280"))
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Publier") {
                        let post = CommunityPost(
                            id: UUID(),
                            authorName: "Vous",
                            authorInitials: "V",
                            isVerified: false,
                            category: selectedCategory,
                            title: title,
                            content: content,
                            imageUrl: nil,
                            tags: tags,
                            likes: 0,
                            comments: 0,
                            isLiked: false,
                            timeAgo: "À l'instant"
                        )
                        onPost(post)
                        dismiss()
                    }
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(title.isEmpty || content.isEmpty ? Color(hex: "D1D5DB") : Color(hex: "FFA040"))
                    .disabled(title.isEmpty || content.isEmpty)
                }
            }
        }
    }
}

// MARK: - Community Filters Sheet

struct CommunityFiltersSheet: View {
    @ObservedObject var viewModel: CommunityViewModel
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List {
                Section {
                    Toggle(isOn: $viewModel.showVerifiedOnly) {
                        HStack(spacing: 12) {
                            Image(systemName: "checkmark.seal.fill")
                                .foregroundColor(Color(hex: "3B82F6"))

                            Text("Utilisateurs vérifiés uniquement")
                        }
                    }
                    .tint(Color(hex: "FFA040"))

                    Toggle(isOn: $viewModel.showWithImagesOnly) {
                        HStack(spacing: 12) {
                            Image(systemName: "photo.fill")
                                .foregroundColor(Color(hex: "10B981"))

                            Text("Posts avec images")
                        }
                    }
                    .tint(Color(hex: "FFA040"))
                } header: {
                    Text("Filtres")
                }

                Section {
                    Picker("Trier par", selection: $viewModel.sortOrder) {
                        ForEach(CommunitySortOrder.allCases, id: \.self) { order in
                            Text(order.title).tag(order)
                        }
                    }
                } header: {
                    Text("Tri")
                }
            }
            .navigationTitle("Filtres")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Terminé") { dismiss() }
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "FFA040"))
                }
            }
        }
        .presentationDetents([.medium])
    }
}

// MARK: - Models

enum CommunityCategory: String, CaseIterable {
    case all
    case tips
    case questions
    case experiences
    case events
    case marketplace

    var title: String {
        switch self {
        case .all: return "Tout"
        case .tips: return "Conseils"
        case .questions: return "Questions"
        case .experiences: return "Témoignages"
        case .events: return "Événements"
        case .marketplace: return "Marketplace"
        }
    }

    var icon: String {
        switch self {
        case .all: return "square.grid.2x2"
        case .tips: return "lightbulb.fill"
        case .questions: return "questionmark.circle.fill"
        case .experiences: return "text.bubble.fill"
        case .events: return "calendar.badge.clock"
        case .marketplace: return "cart.fill"
        }
    }

    var color: Color {
        switch self {
        case .all: return Color(hex: "6B7280")
        case .tips: return Color(hex: "F59E0B")
        case .questions: return Color(hex: "6366F1")
        case .experiences: return Color(hex: "10B981")
        case .events: return Color(hex: "8B5CF6")
        case .marketplace: return Color(hex: "EF4444")
        }
    }
}

enum CommunitySortOrder: String, CaseIterable {
    case recent
    case popular
    case mostCommented

    var title: String {
        switch self {
        case .recent: return "Plus récents"
        case .popular: return "Plus populaires"
        case .mostCommented: return "Plus commentés"
        }
    }
}

struct CommunityPost: Identifiable {
    let id: UUID
    let authorName: String
    let authorInitials: String
    let isVerified: Bool
    let category: CommunityCategory
    let title: String
    let content: String
    let imageUrl: String?
    let tags: [String]
    var likes: Int
    let comments: Int
    var isLiked: Bool
    let timeAgo: String
}

struct CommunityEvent: Identifiable {
    let id: UUID
    let title: String
    let date: Date
    let time: String
    let location: String
    let isOnline: Bool
    let attendeesCount: Int

    var dayOfMonth: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "d"
        return formatter.string(from: date)
    }

    var monthShort: String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "fr_FR")
        formatter.dateFormat = "MMM"
        return formatter.string(from: date).uppercased()
    }
}

// MARK: - ViewModel

@MainActor
class CommunityViewModel: ObservableObject {
    @Published var posts: [CommunityPost] = []
    @Published var featuredPosts: [CommunityPost] = []
    @Published var upcomingEvents: [CommunityEvent] = []
    @Published var isLoading = false
    @Published var showVerifiedOnly = false
    @Published var showWithImagesOnly = false
    @Published var sortOrder: CommunitySortOrder = .recent

    func loadCommunityData() async {
        if AppConfig.FeatureFlags.demoMode {
            isLoading = true
            try? await Task.sleep(nanoseconds: 500_000_000)

            posts = [
                CommunityPost(
                    id: UUID(),
                    authorName: "Sophie Martin",
                    authorInitials: "SM",
                    isVerified: true,
                    category: .tips,
                    title: "5 astuces pour bien visiter un appartement",
                    content: "Après plusieurs recherches, voici mes conseils pour ne rien rater lors d'une visite : vérifiez l'isolation, testez la pression de l'eau, regardez l'orientation des fenêtres...",
                    imageUrl: nil,
                    tags: ["visite", "conseils", "appartement"],
                    likes: 42,
                    comments: 8,
                    isLiked: false,
                    timeAgo: "Il y a 2h"
                ),
                CommunityPost(
                    id: UUID(),
                    authorName: "Lucas Dubois",
                    authorInitials: "LD",
                    isVerified: false,
                    category: .questions,
                    title: "Caution solidaire en colocation ?",
                    content: "Bonjour, je cherche à comprendre comment fonctionne la caution solidaire quand on est en colocation. Est-ce que quelqu'un peut m'expliquer les risques ?",
                    imageUrl: nil,
                    tags: ["colocation", "caution", "juridique"],
                    likes: 15,
                    comments: 23,
                    isLiked: true,
                    timeAgo: "Il y a 5h"
                ),
                CommunityPost(
                    id: UUID(),
                    authorName: "Marie Leroy",
                    authorInitials: "ML",
                    isVerified: true,
                    category: .experiences,
                    title: "Mon expérience de 6 mois en colocation à Paris",
                    content: "Je partage mon retour d'expérience après 6 mois dans une colocation avec 3 autres personnes dans le 11ème. Les hauts, les bas, et mes conseils pour bien vivre ensemble...",
                    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
                    tags: ["paris", "colocation", "témoignage"],
                    likes: 87,
                    comments: 34,
                    isLiked: false,
                    timeAgo: "Il y a 1j"
                ),
                CommunityPost(
                    id: UUID(),
                    authorName: "Thomas Bernard",
                    authorInitials: "TB",
                    isVerified: false,
                    category: .marketplace,
                    title: "Canapé IKEA à donner - Paris 15",
                    content: "Je déménage et je donne mon canapé IKEA 3 places gris. Très bon état, 2 ans. À récupérer avant le 15 décembre.",
                    imageUrl: nil,
                    tags: ["don", "meuble", "paris15"],
                    likes: 5,
                    comments: 12,
                    isLiked: false,
                    timeAgo: "Il y a 3h"
                )
            ]

            featuredPosts = posts.filter { $0.isVerified }.prefix(2).map { $0 }

            upcomingEvents = [
                CommunityEvent(
                    id: UUID(),
                    title: "Webinaire : Bien préparer son dossier locatif",
                    date: Calendar.current.date(byAdding: .day, value: 3, to: Date())!,
                    time: "18h00",
                    location: "Zoom",
                    isOnline: true,
                    attendeesCount: 45
                ),
                CommunityEvent(
                    id: UUID(),
                    title: "Rencontre entre colocataires - Paris",
                    date: Calendar.current.date(byAdding: .day, value: 7, to: Date())!,
                    time: "19h30",
                    location: "Café Le Comptoir",
                    isOnline: false,
                    attendeesCount: 23
                )
            ]

            isLoading = false
        }
    }

    func filteredPosts(for category: CommunityCategory) -> [CommunityPost] {
        var filtered = posts

        if category != .all {
            filtered = filtered.filter { $0.category == category }
        }

        if showVerifiedOnly {
            filtered = filtered.filter { $0.isVerified }
        }

        if showWithImagesOnly {
            filtered = filtered.filter { $0.imageUrl != nil }
        }

        switch sortOrder {
        case .recent:
            break // Already sorted by recent
        case .popular:
            filtered.sort { $0.likes > $1.likes }
        case .mostCommented:
            filtered.sort { $0.comments > $1.comments }
        }

        return filtered
    }

    func toggleLike(_ post: CommunityPost) {
        if let index = posts.firstIndex(where: { $0.id == post.id }) {
            posts[index].isLiked.toggle()
            posts[index].likes += posts[index].isLiked ? 1 : -1
        }
    }

    func openComments(_ post: CommunityPost) {
        // TODO: Navigate to comments view
    }

    func sharePost(_ post: CommunityPost) {
        // TODO: Share sheet
    }

    func addPost(_ post: CommunityPost) {
        posts.insert(post, at: 0)
    }
}

// MARK: - Preview

struct CommunityView_Previews: PreviewProvider {
    static var previews: some View {
        CommunityView()
    }
}
