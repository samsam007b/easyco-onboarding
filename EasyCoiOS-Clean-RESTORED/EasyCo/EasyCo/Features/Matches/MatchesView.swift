import SwiftUI

// MARK: - Matches View (Web App Design)

struct MatchesView: View {
    @State private var matches: [Property] = []
    @State private var isLoading = false

    var body: some View {
        NavigationStack {
            Group {
                if isLoading {
                    LoadingView(message: "Chargement de vos matchs...")
                } else if matches.isEmpty {
                    emptyStateView
                } else {
                    matchesList
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Mes Matchs")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))
                }
            }
        }
        .task {
            await loadMatches()
        }
    }

    // MARK: - Matches List

    private var matchesList: some View {
        ScrollView {
            // Score explanation header
            VStack(spacing: 12) {
                HStack {
                    Image(systemName: "sparkles")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "FFA040"))

                    Text("Vos meilleurs matchs")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "111827"))

                    Spacer()
                }

                Text("Basés sur votre budget, localisation et préférences")
                    .font(.system(size: 13))
                    .foregroundColor(Color(hex: "6B7280"))
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            .padding(16)
            .background(Color.white)
            .cornerRadius(12)
            .padding(.horizontal, 16)
            .padding(.top, 16)

            LazyVGrid(
                columns: [
                    GridItem(.flexible(), spacing: 16),
                    GridItem(.flexible(), spacing: 16)
                ],
                spacing: 24
            ) {
                ForEach(matches) { property in
                    NavigationLink(destination: PropertyDetailView(property: property)) {
                        MatchPropertyCard(
                            property: property,
                            onFavorite: {
                                // TODO: Toggle favorite
                            },
                            onTap: {}
                        )
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
            .padding(16)
        }
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 24) {
            Spacer()

            // Icon with gradient
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color(hex: "FFA040").opacity(0.2), Color(hex: "FFB85C").opacity(0.1)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 120, height: 120)

                Image(systemName: "sparkles")
                    .font(.system(size: 48))
                    .foregroundColor(Color(hex: "FFA040"))
            }

            // Text
            VStack(spacing: 12) {
                Text("Aucun match pour l'instant")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Complétez votre profil et explorez les propriétés pour trouver vos matchs parfaits")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }

            // CTA Button
            Button(action: {
                // Navigate to properties list
            }) {
                HStack(spacing: 8) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 16, weight: .semibold))
                    Text("Explorer les propriétés")
                        .font(.system(size: 16, weight: .semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: 280)
                .padding(.vertical, 16)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(999)
                .shadow(color: Color(hex: "FFA040").opacity(0.3), radius: 8, x: 0, y: 4)
            }
            .padding(.top, 8)

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(hex: "F9FAFB"))
    }

    // MARK: - Data Methods

    private func loadMatches() async {
        isLoading = true

        // Demo mode - use mock data with high compatibility scores
        if AppConfig.FeatureFlags.demoMode {
            try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
            matches = Property.mockProperties.filter { ($0.compatibilityScore ?? 0) >= 80 }
        } else {
            // TODO: API call
        }

        isLoading = false
    }
}

// MARK: - Preview

struct MatchesView_Previews: PreviewProvider {
    static var previews: some View {
        MatchesView()
    }
}
