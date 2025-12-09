//
//  MatchesListView.swift
//  IzzIco
//
//  List of all matched properties
//

import SwiftUI

// MARK: - Matches List View

struct MatchesListView: View {
    @State private var matches: [Match] = []
    @State private var selectedMatch: Match?
    @State private var searchText = ""

    private var filteredMatches: [Match] {
        if searchText.isEmpty {
            return matches
        }
        return matches.filter { match in
            guard let property = match.property else { return false }
            return property.title.localizedCaseInsensitiveContains(searchText) ||
                property.locationString.localizedCaseInsensitiveContains(searchText)
        }
    }

    private var recentMatches: [Match] {
        filteredMatches.filter { match in
            let daysSince = Calendar.current.dateComponents([.day], from: match.matchedAt, to: Date()).day ?? 0
            return daysSince < 7
        }
    }

    private var olderMatches: [Match] {
        filteredMatches.filter { match in
            let daysSince = Calendar.current.dateComponents([.day], from: match.matchedAt, to: Date()).day ?? 0
            return daysSince >= 7
        }
    }

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.Colors.backgroundSecondary
                    .ignoresSafeArea()

                VStack(spacing: 0) {
                    // Search bar
                    SearchBar(
                        text: $searchText,
                        placeholder: "Rechercher un match...",
                        filterCount: 0,
                        onFilterTap: {}
                    )
                    .padding(.horizontal)
                    .padding(.vertical, 8)
                    .background(Theme.Colors.backgroundPrimary)

                    if matches.isEmpty {
                        emptyState
                    } else {
                        matchesList
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    HStack(spacing: 8) {
                        Text("Mes Matchs")
                            .font(Theme.Typography.title3())
                            .foregroundColor(Theme.Colors.textPrimary)

                        if !matches.isEmpty {
                            Text("\(matches.count)")
                                .font(Theme.Typography.bodySmall(.bold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Theme.Colors.primaryGradient)
                                .cornerRadius(10)
                        }
                    }
                }
            }
            .sheet(item: $selectedMatch) { match in
                ConversationPlaceholder(match: match)
            }
        }
        .onAppear {
            loadMatches()
        }
    }

    // MARK: - Matches List

    private var matchesList: some View {
        ScrollView {
            LazyVStack(spacing: 24) {
                // Recent matches (< 7 days)
                if !recentMatches.isEmpty {
                    matchSection(title: "Récents", matches: recentMatches)
                }

                // Older matches
                if !olderMatches.isEmpty {
                    matchSection(title: "Plus anciens", matches: olderMatches)
                }
            }
            .padding(.vertical, 20)
        }
    }

    private func matchSection(title: String, matches: [Match]) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(title)
                .font(Theme.Typography.title3())
                .foregroundColor(Theme.Colors.textPrimary)
                .padding(.horizontal)

            VStack(spacing: 12) {
                ForEach(matches) { match in
                    MatchCard(match: match) {
                        selectedMatch = match
                    }
                    .padding(.horizontal)
                }
            }
        }
    }

    // MARK: - Empty State

    private var emptyState: some View {
        VStack(spacing: 24) {
            Spacer()

            Image.lucide("heart-off")
                .resizable()
                .scaledToFit()
                .frame(width: 100, height: 100)
                .foregroundColor(Theme.Colors.gray300)

            VStack(spacing: 12) {
                Text("Aucun match pour le moment")
                    .font(Theme.Typography.title2())
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Commencez à swiper pour trouver votre logement idéal !")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
                    .multilineTextAlignment(.center)
            }

            PrimaryButton(
                title: "Commencer à swiper",
                icon: "heart",
                action: {
                    // Navigate to swipe view
                }
            )
            .frame(maxWidth: 300)

            Spacer()
        }
        .padding(40)
    }

    // MARK: - Data Loading

    private func loadMatches() {
        // Mock data
        let calendar = Calendar.current
        let mockProperties = Property.mockProperties

        matches = mockProperties.enumerated().map { index, property in
            Match(
                id: UUID(),
                searcherId: UUID(),
                propertyId: property.id,
                matchScore: Double(85 + index * 3),
                createdAt: calendar.date(byAdding: .day, value: -(index + 1), to: Date())!,
                matchedAt: calendar.date(byAdding: .day, value: -(index + 1), to: Date())!,
                property: property
            )
        }
    }
}

// MARK: - Match Card

struct MatchCard: View {
    let match: Match
    let onTap: () -> Void

    var body: some View {
        Button(action: {
            Haptic.impact(.light)
            onTap()
        }) {
            HStack(spacing: 0) {
                // Property image
                AsyncImage(url: URL(string: match.property?.images.first ?? "")) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Rectangle()
                        .fill(Theme.Colors.gray200)
                        .overlay(
                            ProgressView()
                        )
                }
                .frame(width: 120, height: 140)
                .clipped()
                .cornerRadius(Theme.CornerRadius.card, corners: [.topLeft, .bottomLeft])

                // Property info
                VStack(alignment: .leading, spacing: 12) {
                    // Header
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(match.property?.title ?? "Propriété")
                                .font(Theme.Typography.body(.semibold))
                                .foregroundColor(Theme.Colors.textPrimary)
                                .lineLimit(2)

                            HStack(spacing: 4) {
                                Image.lucide("map-pin")
                                    .resizable()
                                    .scaledToFit()
                                    .frame(width: 12, height: 12)
                                    .foregroundColor(Theme.Colors.textTertiary)

                                Text(match.property?.locationString ?? "")
                                    .font(Theme.Typography.bodySmall())
                                    .foregroundColor(Theme.Colors.textSecondary)
                                    .lineLimit(1)
                            }
                        }

                        Spacer()

                        // Unread badge
                        if match.hasUnreadMessages {
                            Circle()
                                .fill(Theme.Colors.primary)
                                .frame(width: 10, height: 10)
                        }
                    }

                    // Price
                    HStack(alignment: .firstTextBaseline, spacing: 4) {
                        Text("\(match.property?.price ?? 0)€")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(Theme.Colors.primary)

                        Text("/mois")
                            .font(Theme.Typography.caption())
                            .foregroundColor(Theme.Colors.textSecondary)
                    }

                    // Last message or match time
                    if let lastMessage = match.lastMessage {
                        HStack(spacing: 6) {
                            Image.lucide("message-circle")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 14, height: 14)
                                .foregroundColor(Theme.Colors.textTertiary)

                            Text(lastMessage)
                                .font(Theme.Typography.bodySmall())
                                .foregroundColor(match.hasUnreadMessages ? Theme.Colors.textPrimary : Theme.Colors.textSecondary)
                                .fontWeight(match.hasUnreadMessages ? .semibold : .regular)
                                .lineLimit(1)
                        }
                    } else {
                        HStack(spacing: 6) {
                            Image.lucide("heart")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 14, height: 14)
                                .foregroundColor(Theme.Colors.primary)

                            Text("Nouveau match • \(match.timeAgo)")
                                .font(Theme.Typography.bodySmall())
                                .foregroundColor(Theme.Colors.primary)
                        }
                    }

                    // Match score
                    if let matchScore = match.property?.matchScore {
                        HStack(spacing: 4) {
                            Circle()
                                .fill(Theme.Colors.success)
                                .frame(width: 6, height: 6)

                            Text("\(matchScore)% Compatible")
                                .font(.system(size: 11, weight: .semibold))
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 5)
                        .background(Theme.Colors.primaryGradient)
                        .cornerRadius(10)
                    }
                }
                .padding(16)
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .frame(height: 140)
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.card)
            .cardShadow()
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Conversation Placeholder

struct ConversationPlaceholder: View {
    let match: Match
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack {
                Text("Conversation avec")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)

                Text(match.property?.title ?? "Propriété")
                    .font(Theme.Typography.title2())
                    .foregroundColor(Theme.Colors.textPrimary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)

                Spacer()

                Text("La messagerie sera implémentée dans la Phase 4")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
                    .padding()

                Spacer()
            }
            .padding()
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Image.lucide("arrow-left")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 20, height: 20)
                            .foregroundColor(Theme.Colors.textPrimary)
                    }
                }
            }
        }
    }
}

// MARK: - Preview

struct MatchesListView_Previews: PreviewProvider {
    static var previews: some View {
        MatchesListView()
    }
}
