import SwiftUI

// MARK: - Version 2: Glassmorphism Pro
// Style: Effets de verre, blur, transparence, profondeur

struct PropertiesListView_V2_Glassmorphism: View {
    @StateObject private var viewModel = PropertiesViewModel()
    @State private var searchLocation: String = ""
    @State private var searchBudget: String = "€800/mois"
    @State private var searchDate: String = "Flexible"

    var body: some View {
        NavigationStack {
            ZStack {
                // Background gradient
                LinearGradient(
                    colors: [
                        Color(hex: "FFA040").opacity(0.15),
                        Color(hex: "8B5CF6").opacity(0.15),
                        Color(hex: "F9FAFB")
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 20) {
                        // Hero Section - Glass effect
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Trouve ta colocation")
                                .font(.system(size: 30, weight: .heavy))
                                .foregroundColor(Color(hex: "111827"))

                            Text("Transparence et modernité")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal, 20)
                        .padding(.vertical, 16)
                        .background(
                            Color.white.opacity(0.7)
                                .background(.ultraThinMaterial)
                        )
                        .cornerRadius(20)
                        .padding(.horizontal, 16)
                        .padding(.top, 16)

                        // Search Card - Glass morphism
                        VStack(spacing: 16) {
                            // Location - Glass
                            HStack(spacing: 14) {
                                ZStack {
                                    Circle()
                                        .fill(Color(hex: "FFA040").opacity(0.2))
                                        .background(.ultraThinMaterial)
                                        .frame(width: 50, height: 50)

                                    Image(systemName: AppIcon.mapPin.sfSymbol)
                                        .font(.system(size: 22, weight: .semibold))
                                        .foregroundColor(Color(hex: "FFA040"))
                                }

                                VStack(alignment: .leading, spacing: 3) {
                                    Text("LOCALISATION")
                                        .font(.system(size: 11, weight: .bold))
                                        .foregroundColor(Color(hex: "6B7280"))
                                        .tracking(1)

                                    TextField("Paris, Lyon...", text: $searchLocation)
                                        .font(.system(size: 17, weight: .semibold))
                                        .foregroundColor(Color(hex: "111827"))
                                }
                            }
                            .padding(18)
                            .background(
                                Color.white.opacity(0.6)
                                    .background(.thinMaterial)
                            )
                            .cornerRadius(18)
                            .overlay(
                                RoundedRectangle(cornerRadius: 18)
                                    .stroke(Color.white.opacity(0.5), lineWidth: 1.5)
                            )

                            // Budget & Date - Glass cards
                            HStack(spacing: 14) {
                                // Budget
                                GlassCardV2(
                                    icon: AppIcon.euro.sfSymbol,
                                    color: Color(hex: "10B981"),
                                    label: "BUDGET",
                                    value: searchBudget
                                )

                                // Date
                                GlassCardV2(
                                    icon: AppIcon.calendar.sfSymbol,
                                    color: Color(hex: "8B5CF6"),
                                    label: "DISPONIBILITÉ",
                                    value: searchDate
                                )
                            }
                        }
                        .padding(.horizontal, 16)

                        // Search Button - Frosted glass
                        Button(action: {
                            Task { await viewModel.loadProperties(refresh: true) }
                        }) {
                            HStack(spacing: 10) {
                                Image(systemName: AppIcon.search.sfSymbol)
                                    .font(.system(size: 20, weight: .bold))

                                Text("Rechercher")
                                    .font(.system(size: 19, weight: .bold))
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 58)
                            .background(
                                ZStack {
                                    // Gradient background
                                    LinearGradient(
                                        colors: [
                                            Color(hex: "FFA040"),
                                            Color(hex: "FF8A3D")
                                        ],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )

                                    // Frosted overlay
                                    Color.white.opacity(0.15)
                                        .background(.ultraThinMaterial)
                                }
                            )
                            .cornerRadius(18)
                            .overlay(
                                RoundedRectangle(cornerRadius: 18)
                                    .stroke(Color.white.opacity(0.4), lineWidth: 1.5)
                            )
                            .shadow(color: Color(hex: "FFA040").opacity(0.35), radius: 18, x: 0, y: 8)
                        }
                        .padding(.horizontal, 16)

                        // Filters Bar - Glass
                        HStack(spacing: 12) {
                            Button(action: { viewModel.showFilters = true }) {
                                HStack(spacing: 10) {
                                    Image(systemName: AppIcon.sliders.sfSymbol)
                                        .font(.system(size: 18, weight: .semibold))
                                    Text("Filtres")
                                        .font(.system(size: 16, weight: .semibold))
                                }
                                .foregroundColor(Color(hex: "111827"))
                                .padding(.horizontal, 20)
                                .frame(height: 48)
                                .background(
                                    Color.white.opacity(0.6)
                                        .background(.thinMaterial)
                                )
                                .cornerRadius(14)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 14)
                                        .stroke(Color.white.opacity(0.5), lineWidth: 1)
                                )
                            }

                            Spacer()

                            Menu {
                                Button("🎯 Meilleur match") { viewModel.sortBy = .bestMatch }
                                Button("🆕 Plus récent") { viewModel.sortBy = .newest }
                                Button("💰 Prix croissant") { viewModel.sortBy = .priceLow }
                                Button("💎 Prix décroissant") { viewModel.sortBy = .priceHigh }
                            } label: {
                                HStack(spacing: 8) {
                                    Text(viewModel.sortBy.displayName)
                                        .font(.system(size: 15, weight: .medium))
                                        .foregroundColor(Color(hex: "111827"))

                                    Image(systemName: AppIcon.chevronRight.sfSymbol)
                                        .font(.system(size: 11))
                                        .foregroundColor(Color(hex: "6B7280"))
                                        .rotationEffect(.degrees(90))
                                }
                                .padding(.horizontal, 18)
                                .frame(height: 48)
                                .background(
                                    Color.white.opacity(0.6)
                                        .background(.thinMaterial)
                                )
                                .cornerRadius(14)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 14)
                                        .stroke(Color.white.opacity(0.5), lineWidth: 1)
                                )
                            }
                        }
                        .padding(.horizontal, 16)

                        // Properties or Empty State
                        if viewModel.properties.isEmpty {
                            emptyStateGlass
                        }
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Explorer")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))
                }
            }
        }
    }

    private var emptyStateGlass: some View {
        VStack(spacing: 18) {
            ZStack {
                Circle()
                    .fill(Color.white.opacity(0.6))
                    .background(.ultraThinMaterial)
                    .frame(width: 90, height: 90)

                Image(systemName: "house.slash")
                    .font(.system(size: 38, weight: .medium))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }

            Text("Aucune propriété trouvée")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            Text("Ajuste tes filtres pour découvrir plus")
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "6B7280"))
                .multilineTextAlignment(.center)
        }
        .padding(.vertical, 50)
        .padding(.horizontal, 20)
        .background(
            Color.white.opacity(0.5)
                .background(.ultraThinMaterial)
        )
        .cornerRadius(20)
        .padding(.horizontal, 16)
    }
}

// MARK: - Glass Card Component V2

struct GlassCardV2: View {
    let icon: String
    let color: Color
    let label: String
    let value: String

    var body: some View {
        HStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(color.opacity(0.2))
                    .background(.ultraThinMaterial)
                    .frame(width: 42, height: 42)

                Image(systemName: icon)
                    .font(.system(size: 19, weight: .semibold))
                    .foregroundColor(color)
            }

            VStack(alignment: .leading, spacing: 2) {
                Text(label)
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(Color(hex: "6B7280"))
                    .tracking(0.8)

                Text(value)
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))
                    .lineLimit(1)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(
            Color.white.opacity(0.6)
                .background(.thinMaterial)
        )
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.white.opacity(0.5), lineWidth: 1.5)
        )
    }
}
