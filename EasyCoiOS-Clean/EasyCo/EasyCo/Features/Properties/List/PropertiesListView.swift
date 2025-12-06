import SwiftUI

// MARK: - Properties List View
// Information Rich Design - Matching ProfileView & SearcherDashboardView aesthetic

struct PropertiesListView: View {
    @StateObject private var viewModel = PropertiesViewModel()
    @State private var searchLocation: String = ""
    @State private var searchBudget: String = "€800/mois"
    @State private var searchDate: String = "Flexible"

    var body: some View {
        NavigationStack {
            ZStack(alignment: .top) {
                // Background avec profondeur (warm gradient)
                ZStack {
                    LinearGradient(
                        colors: [
                            Color(hex: "FFF5F0"),
                            Color(hex: "FFF0E6"),
                            Color(hex: "FFE5D9")
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                    .ignoresSafeArea()

                    // Organic shapes
                    Circle()
                        .fill(Theme.Colors.Searcher.primary.opacity(0.08))
                        .frame(width: 400, height: 400)
                        .blur(radius: 100)
                        .offset(x: -100, y: -200)

                    Circle()
                        .fill(Color(hex: "FACC15").opacity(0.06))
                        .frame(width: 300, height: 300)
                        .blur(radius: 80)
                        .offset(x: 150, y: 500)
                }

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 20) {
                        // Hero Title Card
                        heroTitleCard
                            .padding(.top, 40)

                        // Search Card
                        searchCard

                        // Search Button
                        searchButton

                        // Filters Bar
                        filtersBar

                        // Properties or Empty State
                        if viewModel.properties.isEmpty {
                            emptyStateRich
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 100)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Explorer")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(Color(hex: "1F2937"))
                }
            }
        }
    }

    // MARK: - Hero Title Card

    private var heroTitleCard: some View {
        VStack(spacing: 12) {
            Text("Trouve ta colocation")
                .font(.system(size: 32, weight: .bold))
                .foregroundColor(Color(hex: "1F2937"))
                .frame(maxWidth: .infinity, alignment: .leading)

            Text("Transparence et modernité")
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(Color(hex: "6B7280"))
                .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .fill(Color.white.opacity(0.85))
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(Color.white, lineWidth: 2)
                )
        )
        .richShadow()
    }

    // MARK: - Search Card

    private var searchCard: some View {
        VStack(spacing: 16) {
            // Location
            HStack(spacing: 14) {
                ZStack {
                    Circle()
                        .fill(Theme.Colors.Searcher.primary.opacity(0.12))
                        .frame(width: 44, height: 44)

                    Image(systemName: AppIcon.mapPin.sfSymbol)
                        .font(.system(size: 20, weight: .semibold))
                        .foregroundColor(Theme.Colors.Searcher.primary)
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text("LOCALISATION")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(Color(hex: "6B7280"))
                        .tracking(0.5)

                    TextField("Paris, Lyon...", text: $searchLocation)
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(Color(hex: "1F2937"))
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }
            .padding(16)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color.white.opacity(0.85))
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color.white, lineWidth: 1.5)
                    )
            )
            .richShadow()

            // Budget & Availability
            HStack(spacing: 12) {
                RichSearchPreferenceCard(
                    icon: AppIcon.euro.sfSymbol,
                    label: "BUDGET",
                    value: searchBudget,
                    color: Color(hex: "10B981")
                )

                RichSearchPreferenceCard(
                    icon: AppIcon.calendar.sfSymbol,
                    label: "DISPONIBILITÉ",
                    value: searchDate,
                    color: Color(hex: "8B5CF6")
                )
            }
        }
    }

    // MARK: - Search Button

    private var searchButton: some View {
        Button(action: {
            Task { await viewModel.loadProperties(refresh: true) }
        }) {
            HStack(spacing: 12) {
                Image(systemName: AppIcon.search.sfSymbol)
                    .font(.system(size: 18, weight: .semibold))

                Text("Rechercher")
                    .font(.system(size: 18, weight: .bold))

                Spacer()

                Image(systemName: "arrow.right")
                    .font(.system(size: 16, weight: .bold))
            }
            .foregroundColor(.white)
            .padding(18)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(LinearGradient(
                        colors: [Theme.Colors.Searcher.primary, Theme.Colors.Searcher._400],
                        startPoint: .leading,
                        endPoint: .trailing
                    ))
            )
            .richShadow(color: Theme.Colors.Searcher.primary)
        }
    }

    // MARK: - Filters Bar

    private var filtersBar: some View {
        HStack(spacing: 12) {
            Button(action: { viewModel.showFilters = true }) {
                HStack(spacing: 8) {
                    Image(systemName: AppIcon.sliders.sfSymbol)
                        .font(.system(size: 14, weight: .semibold))
                    Text("Filtres")
                        .font(.system(size: 14, weight: .semibold))
                }
                .foregroundColor(Color(hex: "1F2937"))
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.white.opacity(0.85))
                )
                .richShadow()
            }

            Spacer()

            Menu {
                Button("🎯 Meilleur match") { viewModel.sortBy = .bestMatch }
                Button("🆕 Plus récent") { viewModel.sortBy = .newest }
                Button("💰 Prix croissant") { viewModel.sortBy = .priceLow }
                Button("💎 Prix décroissant") { viewModel.sortBy = .priceHigh }
            } label: {
                HStack(spacing: 8) {
                    Image(systemName: "target")
                        .font(.system(size: 14, weight: .semibold))
                    Text(viewModel.sortBy.displayName)
                        .font(.system(size: 14, weight: .semibold))
                    Image(systemName: "chevron.down")
                        .font(.system(size: 12, weight: .semibold))
                }
                .foregroundColor(Color(hex: "1F2937"))
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.white.opacity(0.85))
                )
                .richShadow()
            }
        }
    }

    // MARK: - Empty State Rich

    private var emptyStateRich: some View {
        VStack(spacing: 20) {
            ZStack {
                Circle()
                    .fill(Color(hex: "9CA3AF").opacity(0.12))
                    .frame(width: 100, height: 100)

                Image(systemName: "house.slash")
                    .font(.system(size: 44, weight: .medium))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }

            VStack(spacing: 8) {
                Text("Aucune propriété trouvée")
                    .font(.system(size: 22, weight: .bold))
                    .foregroundColor(Color(hex: "1F2937"))

                Text("Ajuste tes filtres pour découvrir plus")
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
            }
        }
        .padding(.vertical, 60)
        .padding(.horizontal, 30)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .fill(Color.white.opacity(0.85))
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(Color.white, lineWidth: 2)
                )
        )
        .richShadow()
    }
}

// MARK: - Rich Search Preference Card

private struct RichSearchPreferenceCard: View {
    let icon: String
    let label: String
    let value: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                ZStack {
                    Circle()
                        .fill(color.opacity(0.12))
                        .frame(width: 36, height: 36)

                    Image(systemName: icon)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(color)
                }

                Spacer()
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(label)
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(Color(hex: "6B7280"))
                    .tracking(0.5)

                Text(value)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(hex: "1F2937"))
                    .lineLimit(1)
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(Color.white.opacity(0.85))
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .stroke(Color.white, lineWidth: 1.5)
                )
        )
        .richShadow()
    }
}

// MARK: - Glass Card Component (kept for compatibility)

struct GlassCard: View {
    let icon: String
    let color: Color
    let label: String
    let value: String

    var body: some View {
        RichSearchPreferenceCard(
            icon: icon,
            label: label,
            value: value,
            color: color
        )
    }
}
