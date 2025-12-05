import SwiftUI

// MARK: - Version 5: Premium Dark Accent
// Style: Accents sombres, sophistiqué, luxueux, contrastes élégants

struct PropertiesListView_V5_PremiumDark: View {
    @StateObject private var viewModel = PropertiesViewModel()
    @State private var searchLocation: String = ""
    @State private var searchBudget: String = "€800/mois"
    @State private var searchDate: String = "Flexible"

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 22) {
                    // Hero Section - Dark premium
                    ZStack {
                        // Dark background with gradient
                        LinearGradient(
                            colors: [
                                Color(hex: "1F2937"),
                                Color(hex: "111827")
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )

                        VStack(spacing: 12) {
                            // Premium icon with gold accent
                            ZStack {
                                Circle()
                                    .fill(
                                        LinearGradient(
                                            colors: [
                                                Color(hex: "FFA040").opacity(0.3),
                                                Color(hex: "FFB85C").opacity(0.2)
                                            ],
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
                                        )
                                    )
                                    .frame(width: 70, height: 70)
                                    .blur(radius: 15)

                                Circle()
                                    .stroke(
                                        LinearGradient(
                                            colors: [
                                                Color(hex: "FFA040"),
                                                Color(hex: "FFB85C")
                                            ],
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
                                        ),
                                        lineWidth: 2
                                    )
                                    .frame(width: 60, height: 60)

                                Image(systemName: AppIcon.home.sfSymbol)
                                    .font(.system(size: 28, weight: .medium))
                                    .foregroundStyle(
                                        LinearGradient(
                                            colors: [
                                                Color(hex: "FFA040"),
                                                Color(hex: "FFB85C")
                                            ],
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
                                        )
                                    )
                            }

                            VStack(spacing: 6) {
                                Text("Colocation Premium")
                                    .font(.system(size: 26, weight: .semibold))
                                    .foregroundColor(.white)

                                Text("Sélection exclusive de propriétés")
                                    .font(.system(size: 15))
                                    .foregroundColor(.white.opacity(0.8))
                            }
                        }
                        .padding(.vertical, 28)
                    }
                    .cornerRadius(22)
                    .overlay(
                        RoundedRectangle(cornerRadius: 22)
                            .stroke(
                                LinearGradient(
                                    colors: [
                                        Color(hex: "FFA040").opacity(0.3),
                                        Color(hex: "8B5CF6").opacity(0.2)
                                    ],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                ),
                                lineWidth: 1
                            )
                    )
                    .shadow(color: Color.black.opacity(0.3), radius: 24, x: 0, y: 12)
                    .padding(.horizontal, 18)
                    .padding(.top, 16)

                    // Search Cards - Dark with accent
                    VStack(spacing: 16) {
                        // Location - Premium dark card
                        HStack(spacing: 16) {
                            ZStack {
                                RoundedRectangle(cornerRadius: 14)
                                    .fill(
                                        LinearGradient(
                                            colors: [
                                                Color(hex: "FFA040"),
                                                Color(hex: "FF8A3D")
                                            ],
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
                                        )
                                    )
                                    .frame(width: 50, height: 50)

                                Image(systemName: AppIcon.mapPin.sfSymbol)
                                    .font(.system(size: 22, weight: .semibold))
                                    .foregroundColor(.white)
                            }
                            .shadow(color: Color(hex: "FFA040").opacity(0.4), radius: 12, x: 0, y: 6)

                            VStack(alignment: .leading, spacing: 5) {
                                Text("LOCALISATION")
                                    .font(.system(size: 11, weight: .semibold))
                                    .foregroundColor(Color(hex: "9CA3AF"))
                                    .tracking(1.2)

                                TextField("Paris, Lyon...", text: $searchLocation)
                                    .font(.system(size: 17, weight: .semibold))
                                    .foregroundColor(Color(hex: "111827"))
                            }
                        }
                        .padding(18)
                        .background(
                            ZStack {
                                Color(hex: "1F2937")

                                LinearGradient(
                                    colors: [
                                        Color.white.opacity(0.05),
                                        Color.white.opacity(0.02)
                                    ],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            }
                        )
                        .cornerRadius(18)
                        .overlay(
                            RoundedRectangle(cornerRadius: 18)
                                .stroke(Color(hex: "FFA040").opacity(0.3), lineWidth: 1.5)
                        )
                        .shadow(color: Color.black.opacity(0.2), radius: 16, x: 0, y: 8)

                        // Budget & Date Row - Dark premium
                        HStack(spacing: 16) {
                            // Budget - Dark green
                            PremiumDarkCard(
                                icon: AppIcon.euro.sfSymbol,
                                accentColor: Color(hex: "10B981"),
                                label: "BUDGET",
                                value: searchBudget
                            )

                            // Date - Dark purple
                            PremiumDarkCard(
                                icon: AppIcon.calendar.sfSymbol,
                                accentColor: Color(hex: "8B5CF6"),
                                label: "DISPONIBILITÉ",
                                value: searchDate
                            )
                        }
                    }
                    .padding(.horizontal, 18)

                    // Search Button - Luxury gradient
                    Button(action: {
                        Task { await viewModel.loadProperties(refresh: true) }
                    }) {
                        HStack(spacing: 12) {
                            Image(systemName: AppIcon.search.sfSymbol)
                                .font(.system(size: 19, weight: .semibold))

                            Text("Rechercher")
                                .font(.system(size: 18, weight: .semibold))
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 58)
                        .background(
                            ZStack {
                                LinearGradient(
                                    colors: [
                                        Color(hex: "FFA040"),
                                        Color(hex: "FF8A3D")
                                    ],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )

                                // Premium shine effect
                                LinearGradient(
                                    colors: [
                                        Color.white.opacity(0.2),
                                        Color.clear
                                    ],
                                    startPoint: .top,
                                    endPoint: .bottom
                                )
                            }
                        )
                        .cornerRadius(18)
                        .overlay(
                            RoundedRectangle(cornerRadius: 18)
                                .stroke(
                                    LinearGradient(
                                        colors: [
                                            Color.white.opacity(0.3),
                                            Color.white.opacity(0.1)
                                        ],
                                        startPoint: .top,
                                        endPoint: .bottom
                                    ),
                                    lineWidth: 1
                                )
                        )
                        .shadow(color: Color(hex: "FFA040").opacity(0.5), radius: 20, x: 0, y: 10)
                    }
                    .padding(.horizontal, 18)

                    // Filters Bar - Dark premium
                    HStack(spacing: 12) {
                        Button(action: { viewModel.showFilters = true }) {
                            HStack(spacing: 10) {
                                Image(systemName: AppIcon.sliders.sfSymbol)
                                    .font(.system(size: 18, weight: .semibold))
                                Text("Filtres")
                                    .font(.system(size: 16, weight: .semibold))
                            }
                            .foregroundColor(.white)
                            .padding(.horizontal, 22)
                            .frame(height: 50)
                            .background(
                                ZStack {
                                    Color(hex: "1F2937")

                                    LinearGradient(
                                        colors: [
                                            Color.white.opacity(0.08),
                                            Color.white.opacity(0.03)
                                        ],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                }
                            )
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color.white.opacity(0.1), lineWidth: 1)
                            )
                            .shadow(color: Color.black.opacity(0.3), radius: 12, x: 0, y: 6)
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
                                    .foregroundColor(.white)

                                Image(systemName: AppIcon.chevronRight.sfSymbol)
                                    .font(.system(size: 12))
                                    .foregroundColor(.white.opacity(0.6))
                                    .rotationEffect(.degrees(90))
                            }
                            .padding(.horizontal, 20)
                            .frame(height: 50)
                            .background(
                                ZStack {
                                    Color(hex: "1F2937")

                                    LinearGradient(
                                        colors: [
                                            Color.white.opacity(0.08),
                                            Color.white.opacity(0.03)
                                        ],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                }
                            )
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color.white.opacity(0.1), lineWidth: 1)
                            )
                            .shadow(color: Color.black.opacity(0.3), radius: 12, x: 0, y: 6)
                        }
                    }
                    .padding(.horizontal, 18)

                    // Properties or Empty State
                    if viewModel.properties.isEmpty {
                        emptyStatePremium
                    }
                }
            }
            .background(Color(hex: "F3F4F6"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    HStack(spacing: 8) {
                        Text("✦")
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(Color(hex: "FFA040"))

                        Text("Explorer")
                            .font(.system(size: 20, weight: .semibold))
                            .foregroundColor(Color(hex: "111827"))

                        Text("✦")
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(Color(hex: "FFA040"))
                    }
                }
            }
        }
    }

    private var emptyStatePremium: some View {
        VStack(spacing: 20) {
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [
                                Color(hex: "1F2937"),
                                Color(hex: "111827")
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 100, height: 100)
                    .overlay(
                        Circle()
                            .stroke(
                                LinearGradient(
                                    colors: [
                                        Color(hex: "FFA040").opacity(0.5),
                                        Color(hex: "8B5CF6").opacity(0.3)
                                    ],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                ),
                                lineWidth: 2
                            )
                    )

                Image(systemName: "house.slash")
                    .font(.system(size: 40, weight: .medium))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [
                                Color(hex: "FFA040"),
                                Color(hex: "FFB85C")
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }
            .shadow(color: Color.black.opacity(0.3), radius: 16, x: 0, y: 8)

            VStack(spacing: 8) {
                Text("Aucune propriété disponible")
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Text("Affine tes critères pour découvrir nos offres premium")
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
            }
        }
        .padding(.vertical, 60)
        .padding(.horizontal, 20)
        .background(
            ZStack {
                Color(hex: "1F2937")

                LinearGradient(
                    colors: [
                        Color.white.opacity(0.05),
                        Color.white.opacity(0.02)
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            }
        )
        .cornerRadius(22)
        .overlay(
            RoundedRectangle(cornerRadius: 22)
                .stroke(
                    LinearGradient(
                        colors: [
                            Color(hex: "FFA040").opacity(0.3),
                            Color(hex: "8B5CF6").opacity(0.2)
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    lineWidth: 1.5
                )
        )
        .shadow(color: Color.black.opacity(0.3), radius: 20, x: 0, y: 10)
        .padding(.horizontal, 18)
    }
}

// MARK: - Premium Dark Card Component

struct PremiumDarkCard: View {
    let icon: String
    let accentColor: Color
    let label: String
    let value: String

    var body: some View {
        VStack(spacing: 12) {
            ZStack {
                RoundedRectangle(cornerRadius: 12)
                    .fill(
                        LinearGradient(
                            colors: [
                                accentColor,
                                accentColor.opacity(0.8)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 44, height: 44)

                Image(systemName: icon)
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(.white)
            }
            .shadow(color: accentColor.opacity(0.4), radius: 10, x: 0, y: 5)

            VStack(spacing: 4) {
                Text(label)
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundColor(Color(hex: "9CA3AF"))
                    .tracking(1)

                Text(value)
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(.white)
                    .lineLimit(1)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .background(
            ZStack {
                Color(hex: "1F2937")

                LinearGradient(
                    colors: [
                        Color.white.opacity(0.08),
                        Color.white.opacity(0.03)
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            }
        )
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(accentColor.opacity(0.3), lineWidth: 1.5)
        )
        .shadow(color: Color.black.opacity(0.2), radius: 12, x: 0, y: 6)
    }
}
