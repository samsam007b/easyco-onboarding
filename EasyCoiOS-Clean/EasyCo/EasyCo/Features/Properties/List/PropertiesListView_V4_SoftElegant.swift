import SwiftUI

// MARK: - Version 4: Soft & Elegant
// Style: Pastel, arrondi, doux, apaisant, minimaliste raffiné

struct PropertiesListView_V4_SoftElegant: View {
    @StateObject private var viewModel = PropertiesViewModel()
    @State private var searchLocation: String = ""
    @State private var searchBudget: String = "€800/mois"
    @State private var searchDate: String = "Flexible"

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 28) {
                    // Hero Section - Soft and gentle
                    VStack(spacing: 14) {
                        // Soft icon
                        ZStack {
                            Circle()
                                .fill(
                                    LinearGradient(
                                        colors: [
                                            Color(hex: "FFA040").opacity(0.15),
                                            Color(hex: "FFB85C").opacity(0.1)
                                        ],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                                .frame(width: 80, height: 80)

                            Image(systemName: AppIcon.home.sfSymbol)
                                .font(.system(size: 36, weight: .light))
                                .foregroundColor(Color(hex: "FFA040"))
                        }

                        VStack(spacing: 6) {
                            Text("Trouve ta colocation")
                                .font(.system(size: 26, weight: .medium))
                                .foregroundColor(Color(hex: "374151"))

                            Text("En toute sérénité")
                                .font(.system(size: 16, weight: .regular))
                                .foregroundColor(Color(hex: "9CA3AF"))
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 24)
                    .background(
                        LinearGradient(
                            colors: [
                                Color(hex: "FEFCFB"),
                                Color(hex: "FFF7F0")
                            ],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                    .cornerRadius(28)
                    .shadow(color: Color(hex: "FFA040").opacity(0.08), radius: 24, x: 0, y: 12)
                    .padding(.horizontal, 20)
                    .padding(.top, 16)

                    // Search Cards - Soft pastel
                    VStack(spacing: 18) {
                        // Location - Soft peach
                        HStack(spacing: 16) {
                            ZStack {
                                Circle()
                                    .fill(
                                        LinearGradient(
                                            colors: [
                                                Color(hex: "FFA040").opacity(0.12),
                                                Color(hex: "FFB85C").opacity(0.08)
                                            ],
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
                                        )
                                    )
                                    .frame(width: 52, height: 52)

                                Image(systemName: AppIcon.mapPin.sfSymbol)
                                    .font(.system(size: 22, weight: .medium))
                                    .foregroundColor(Color(hex: "FFA040"))
                            }

                            VStack(alignment: .leading, spacing: 5) {
                                Text("Localisation")
                                    .font(.system(size: 13, weight: .medium))
                                    .foregroundColor(Color(hex: "9CA3AF"))

                                TextField("Où cherches-tu ?", text: $searchLocation)
                                    .font(.system(size: 16, weight: .medium))
                                    .foregroundColor(Color(hex: "374151"))
                            }
                        }
                        .padding(20)
                        .background(Color.white)
                        .cornerRadius(24)
                        .shadow(color: Color.black.opacity(0.03), radius: 20, x: 0, y: 10)

                        // Budget & Date Row - Soft colors
                        HStack(spacing: 16) {
                            // Budget - Soft green
                            SoftCard(
                                icon: AppIcon.euro.sfSymbol,
                                color1: Color(hex: "10B981").opacity(0.12),
                                color2: Color(hex: "34D399").opacity(0.08),
                                iconColor: Color(hex: "10B981"),
                                label: "Budget mensuel",
                                value: searchBudget
                            )

                            // Date - Soft lavender
                            SoftCard(
                                icon: AppIcon.calendar.sfSymbol,
                                color1: Color(hex: "8B5CF6").opacity(0.12),
                                color2: Color(hex: "A78BFA").opacity(0.08),
                                iconColor: Color(hex: "8B5CF6"),
                                label: "Disponibilité",
                                value: searchDate
                            )
                        }
                    }
                    .padding(.horizontal, 20)

                    // Search Button - Elegant and soft
                    Button(action: {
                        Task { await viewModel.loadProperties(refresh: true) }
                    }) {
                        HStack(spacing: 10) {
                            Image(systemName: AppIcon.search.sfSymbol)
                                .font(.system(size: 18, weight: .medium))

                            Text("Rechercher")
                                .font(.system(size: 17, weight: .semibold))
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 56)
                        .background(
                            LinearGradient(
                                colors: [
                                    Color(hex: "FFA040").opacity(0.95),
                                    Color(hex: "FFB85C").opacity(0.9)
                                ],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(28)
                        .shadow(color: Color(hex: "FFA040").opacity(0.25), radius: 20, x: 0, y: 10)
                    }
                    .padding(.horizontal, 20)

                    // Filters Bar - Soft and minimal
                    HStack(spacing: 14) {
                        Button(action: { viewModel.showFilters = true }) {
                            HStack(spacing: 10) {
                                Image(systemName: AppIcon.sliders.sfSymbol)
                                    .font(.system(size: 17, weight: .medium))
                                Text("Filtres")
                                    .font(.system(size: 15, weight: .medium))
                            }
                            .foregroundColor(Color(hex: "6B7280"))
                            .padding(.horizontal, 22)
                            .frame(height: 48)
                            .background(Color.white)
                            .cornerRadius(24)
                            .shadow(color: Color.black.opacity(0.03), radius: 16, x: 0, y: 8)
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
                                    .foregroundColor(Color(hex: "6B7280"))

                                Image(systemName: AppIcon.chevronRight.sfSymbol)
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "9CA3AF"))
                                    .rotationEffect(.degrees(90))
                            }
                            .padding(.horizontal, 20)
                            .frame(height: 48)
                            .background(Color.white)
                            .cornerRadius(24)
                            .shadow(color: Color.black.opacity(0.03), radius: 16, x: 0, y: 8)
                        }
                    }
                    .padding(.horizontal, 20)

                    // Properties or Empty State
                    if viewModel.properties.isEmpty {
                        emptyStateSoft
                    }
                }
            }
            .background(
                LinearGradient(
                    colors: [
                        Color(hex: "FAFAFA"),
                        Color(hex: "F5F5F5")
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Explorer")
                        .font(.system(size: 19, weight: .medium))
                        .foregroundColor(Color(hex: "374151"))
                }
            }
        }
    }

    private var emptyStateSoft: some View {
        VStack(spacing: 20) {
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [
                                Color(hex: "FFA040").opacity(0.1),
                                Color(hex: "FFB85C").opacity(0.05)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 100, height: 100)

                Image(systemName: "house.slash")
                    .font(.system(size: 40, weight: .light))
                    .foregroundColor(Color(hex: "D1D5DB"))
            }

            VStack(spacing: 8) {
                Text("Aucune propriété")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(Color(hex: "374151"))

                Text("Ajuste tes critères de recherche")
                    .font(.system(size: 15, weight: .regular))
                    .foregroundColor(Color(hex: "9CA3AF"))
                    .multilineTextAlignment(.center)
            }
        }
        .padding(.vertical, 60)
        .padding(.horizontal, 20)
        .background(Color.white)
        .cornerRadius(28)
        .shadow(color: Color.black.opacity(0.03), radius: 24, x: 0, y: 12)
        .padding(.horizontal, 20)
    }
}

// MARK: - Soft Card Component

struct SoftCard: View {
    let icon: String
    let color1: Color
    let color2: Color
    let iconColor: Color
    let label: String
    let value: String

    var body: some View {
        VStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [color1, color2],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 44, height: 44)

                Image(systemName: icon)
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(iconColor)
            }

            VStack(spacing: 4) {
                Text(label)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(Color(hex: "9CA3AF"))

                Text(value)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(Color(hex: "374151"))
                    .lineLimit(1)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .background(Color.white)
        .cornerRadius(20)
        .shadow(color: Color.black.opacity(0.03), radius: 16, x: 0, y: 8)
    }
}
