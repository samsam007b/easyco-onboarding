import SwiftUI

// MARK: - Version 3: Bold & Vibrant
// Style: Couleurs fortes, contrastes élevés, énergique, gradients vifs

struct PropertiesListView_V3_BoldVibrant: View {
    @StateObject private var viewModel = PropertiesViewModel()
    @State private var searchLocation: String = ""
    @State private var searchBudget: String = "€800/mois"
    @State private var searchDate: String = "Flexible"

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Hero Section - Bold gradient background
                    ZStack {
                        // Background gradient
                        LinearGradient(
                            colors: [
                                Color(hex: "FFA040"),
                                Color(hex: "FF8A3D"),
                                Color(hex: "FF7A30")
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )

                        VStack(alignment: .leading, spacing: 8) {
                            Text("🔥 Trouve ta colocation")
                                .font(.system(size: 28, weight: .black))
                                .foregroundColor(.white)

                            Text("Des centaines d'offres incroyables")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.white.opacity(0.95))
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(20)
                    }
                    .cornerRadius(24)
                    .shadow(color: Color(hex: "FFA040").opacity(0.5), radius: 20, x: 0, y: 10)
                    .padding(.horizontal, 16)
                    .padding(.top, 12)

                    // Search Cards - Bold colors
                    VStack(spacing: 14) {
                        // Location - Vibrant orange
                        HStack(spacing: 14) {
                            ZStack {
                                LinearGradient(
                                    colors: [
                                        Color(hex: "FFA040"),
                                        Color(hex: "FFB85C")
                                    ],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                                .frame(width: 54, height: 54)
                                .cornerRadius(27)

                                Image(systemName: AppIcon.mapPin.sfSymbol)
                                    .font(.system(size: 24, weight: .bold))
                                    .foregroundColor(.white)
                            }
                            .shadow(color: Color(hex: "FFA040").opacity(0.4), radius: 12, x: 0, y: 6)

                            VStack(alignment: .leading, spacing: 4) {
                                Text("OÙ ?")
                                    .font(.system(size: 12, weight: .black))
                                    .foregroundColor(Color(hex: "FFA040"))
                                    .tracking(1.2)

                                TextField("Paris, Lyon, Marseille...", text: $searchLocation)
                                    .font(.system(size: 17, weight: .bold))
                                    .foregroundColor(Color(hex: "111827"))
                            }
                        }
                        .padding(18)
                        .background(Color.white)
                        .cornerRadius(18)
                        .overlay(
                            RoundedRectangle(cornerRadius: 18)
                                .stroke(
                                    LinearGradient(
                                        colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    ),
                                    lineWidth: 3
                                )
                        )
                        .shadow(color: Color.black.opacity(0.08), radius: 16, x: 0, y: 8)

                        // Budget & Date Row - Bold
                        HStack(spacing: 14) {
                            // Budget - Green gradient
                            VStack(spacing: 10) {
                                ZStack {
                                    LinearGradient(
                                        colors: [
                                            Color(hex: "10B981"),
                                            Color(hex: "059669")
                                        ],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                    .frame(width: 46, height: 46)
                                    .cornerRadius(23)

                                    Image(systemName: AppIcon.euro.sfSymbol)
                                        .font(.system(size: 22, weight: .bold))
                                        .foregroundColor(.white)
                                }

                                VStack(spacing: 2) {
                                    Text("BUDGET")
                                        .font(.system(size: 10, weight: .black))
                                        .foregroundColor(Color(hex: "10B981"))
                                        .tracking(1)

                                    Text(searchBudget)
                                        .font(.system(size: 15, weight: .black))
                                        .foregroundColor(Color(hex: "111827"))
                                }
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(Color.white)
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color(hex: "10B981"), lineWidth: 2.5)
                            )
                            .shadow(color: Color(hex: "10B981").opacity(0.3), radius: 12, x: 0, y: 6)

                            // Date - Purple gradient
                            VStack(spacing: 10) {
                                ZStack {
                                    LinearGradient(
                                        colors: [
                                            Color(hex: "8B5CF6"),
                                            Color(hex: "7C3AED")
                                        ],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                    .frame(width: 46, height: 46)
                                    .cornerRadius(23)

                                    Image(systemName: AppIcon.calendar.sfSymbol)
                                        .font(.system(size: 22, weight: .bold))
                                        .foregroundColor(.white)
                                }

                                VStack(spacing: 2) {
                                    Text("QUAND ?")
                                        .font(.system(size: 10, weight: .black))
                                        .foregroundColor(Color(hex: "8B5CF6"))
                                        .tracking(1)

                                    Text(searchDate)
                                        .font(.system(size: 15, weight: .black))
                                        .foregroundColor(Color(hex: "111827"))
                                }
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(Color.white)
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color(hex: "8B5CF6"), lineWidth: 2.5)
                            )
                            .shadow(color: Color(hex: "8B5CF6").opacity(0.3), radius: 12, x: 0, y: 6)
                        }
                    }
                    .padding(.horizontal, 16)

                    // Search Button - Super bold
                    Button(action: {
                        Task { await viewModel.loadProperties(refresh: true) }
                    }) {
                        HStack(spacing: 12) {
                            Image(systemName: AppIcon.search.sfSymbol)
                                .font(.system(size: 22, weight: .black))

                            Text("RECHERCHER MAINTENANT")
                                .font(.system(size: 17, weight: .black))
                                .tracking(0.5)
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 62)
                        .background(
                            LinearGradient(
                                colors: [
                                    Color(hex: "3B82F6"),
                                    Color(hex: "2563EB"),
                                    Color(hex: "1D4ED8")
                                ],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .cornerRadius(18)
                        .shadow(color: Color(hex: "3B82F6").opacity(0.5), radius: 20, x: 0, y: 10)
                        .overlay(
                            RoundedRectangle(cornerRadius: 18)
                                .stroke(Color.white.opacity(0.3), lineWidth: 2)
                        )
                    }
                    .padding(.horizontal, 16)

                    // Filters Bar - Colorful
                    HStack(spacing: 12) {
                        Button(action: { viewModel.showFilters = true }) {
                            HStack(spacing: 10) {
                                Image(systemName: AppIcon.sliders.sfSymbol)
                                    .font(.system(size: 20, weight: .bold))
                                Text("Filtres")
                                    .font(.system(size: 16, weight: .black))
                            }
                            .foregroundColor(Color(hex: "F59E0B"))
                            .padding(.horizontal, 22)
                            .frame(height: 50)
                            .background(Color.white)
                            .cornerRadius(15)
                            .overlay(
                                RoundedRectangle(cornerRadius: 15)
                                    .stroke(Color(hex: "F59E0B"), lineWidth: 2.5)
                            )
                            .shadow(color: Color(hex: "F59E0B").opacity(0.3), radius: 10, x: 0, y: 5)
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
                                    .font(.system(size: 15, weight: .bold))
                                    .foregroundColor(Color(hex: "111827"))

                                Image(systemName: AppIcon.chevronRight.sfSymbol)
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundColor(Color(hex: "6B7280"))
                                    .rotationEffect(.degrees(90))
                            }
                            .padding(.horizontal, 18)
                            .frame(height: 50)
                            .background(Color.white)
                            .cornerRadius(15)
                            .overlay(
                                RoundedRectangle(cornerRadius: 15)
                                    .stroke(Color(hex: "E5E7EB"), lineWidth: 2)
                            )
                            .shadow(color: Color.black.opacity(0.06), radius: 10, x: 0, y: 5)
                        }
                    }
                    .padding(.horizontal, 16)

                    // Properties or Empty State
                    if viewModel.properties.isEmpty {
                        emptyStateBold
                    }
                }
            }
            .background(
                LinearGradient(
                    colors: [
                        Color(hex: "FFF7ED"),
                        Color(hex: "FEF3C7"),
                        Color(hex: "FEF3C7")
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("⚡ Explorer")
                        .font(.system(size: 20, weight: .black))
                        .foregroundColor(Color(hex: "111827"))
                }
            }
        }
    }

    private var emptyStateBold: some View {
        VStack(spacing: 18) {
            ZStack {
                LinearGradient(
                    colors: [
                        Color(hex: "EC4899"),
                        Color(hex: "DB2777")
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .frame(width: 100, height: 100)
                .cornerRadius(50)

                Image(systemName: "house.slash")
                    .font(.system(size: 42, weight: .bold))
                    .foregroundColor(.white)
            }
            .shadow(color: Color(hex: "EC4899").opacity(0.4), radius: 16, x: 0, y: 8)

            Text("Aucune propriété trouvée")
                .font(.system(size: 22, weight: .black))
                .foregroundColor(Color(hex: "111827"))

            Text("Ajuste tes filtres pour voir plus de résultats")
                .font(.system(size: 15, weight: .semibold))
                .foregroundColor(Color(hex: "6B7280"))
                .multilineTextAlignment(.center)
        }
        .padding(.vertical, 60)
        .padding(.horizontal, 20)
        .background(Color.white)
        .cornerRadius(20)
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(
                    LinearGradient(
                        colors: [Color(hex: "FFA040"), Color(hex: "EC4899")],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    lineWidth: 3
                )
        )
        .shadow(color: Color.black.opacity(0.1), radius: 20, x: 0, y: 10)
        .padding(.horizontal, 16)
    }
}
