import SwiftUI

// MARK: - Version 1: Modern Minimal
// Style: Épuré, espaces larges, ombres douces, cards flottantes

struct PropertiesListView_V1_Modern: View {
    @StateObject private var viewModel = PropertiesViewModel()
    @State private var searchLocation: String = ""
    @State private var searchBudget: String = "€800/mois"
    @State private var searchDate: String = "Flexible"

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Hero Section - Ultra minimal
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Trouve ta colocation")
                            .font(.system(size: 32, weight: .bold))
                            .foregroundColor(Color(hex: "111827"))

                        Text("Des centaines de propriétés vérifiées")
                            .font(.system(size: 17))
                            .foregroundColor(Color(hex: "6B7280"))
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 24)
                    .padding(.top, 20)

                    // Search Cards - Floating style
                    VStack(spacing: 16) {
                        // Location
                        HStack(spacing: 16) {
                            ZStack {
                                Circle()
                                    .fill(Color(hex: "FFA040").opacity(0.12))
                                    .frame(width: 48, height: 48)

                                Image(systemName: AppIcon.mapPin.sfSymbol)
                                    .font(.system(size: 20, weight: .semibold))
                                    .foregroundColor(Color(hex: "FFA040"))
                            }

                            VStack(alignment: .leading, spacing: 4) {
                                Text("Où ?")
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundColor(Color(hex: "6B7280"))
                                    .textCase(.uppercase)
                                    .tracking(0.5)

                                TextField("Ville, quartier...", text: $searchLocation)
                                    .font(.system(size: 16, weight: .medium))
                                    .foregroundColor(Color(hex: "111827"))
                            }
                        }
                        .padding(20)
                        .background(Color.white)
                        .cornerRadius(20)
                        .shadow(color: Color.black.opacity(0.04), radius: 20, x: 0, y: 10)

                        // Budget & Date Row
                        HStack(spacing: 16) {
                            // Budget
                            HStack(spacing: 12) {
                                ZStack {
                                    Circle()
                                        .fill(Color(hex: "10B981").opacity(0.12))
                                        .frame(width: 40, height: 40)

                                    Image(systemName: AppIcon.euro.sfSymbol)
                                        .font(.system(size: 18, weight: .semibold))
                                        .foregroundColor(Color(hex: "10B981"))
                                }

                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Budget")
                                        .font(.system(size: 11, weight: .semibold))
                                        .foregroundColor(Color(hex: "6B7280"))
                                        .textCase(.uppercase)

                                    Text(searchBudget)
                                        .font(.system(size: 15, weight: .bold))
                                        .foregroundColor(Color(hex: "111827"))
                                }
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(16)
                            .background(Color.white)
                            .cornerRadius(16)
                            .shadow(color: Color.black.opacity(0.04), radius: 15, x: 0, y: 8)

                            // Date
                            HStack(spacing: 12) {
                                ZStack {
                                    Circle()
                                        .fill(Color(hex: "8B5CF6").opacity(0.12))
                                        .frame(width: 40, height: 40)

                                    Image(systemName: AppIcon.calendar.sfSymbol)
                                        .font(.system(size: 18, weight: .semibold))
                                        .foregroundColor(Color(hex: "8B5CF6"))
                                }

                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Quand ?")
                                        .font(.system(size: 11, weight: .semibold))
                                        .foregroundColor(Color(hex: "6B7280"))
                                        .textCase(.uppercase)

                                    Text(searchDate)
                                        .font(.system(size: 15, weight: .bold))
                                        .foregroundColor(Color(hex: "111827"))
                                }
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(16)
                            .background(Color.white)
                            .cornerRadius(16)
                            .shadow(color: Color.black.opacity(0.04), radius: 15, x: 0, y: 8)
                        }
                    }
                    .padding(.horizontal, 24)

                    // Search Button - Prominent
                    Button(action: {
                        Task { await viewModel.loadProperties(refresh: true) }
                    }) {
                        HStack(spacing: 12) {
                            Image(systemName: AppIcon.search.sfSymbol)
                                .font(.system(size: 18, weight: .bold))

                            Text("Rechercher")
                                .font(.system(size: 18, weight: .bold))
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 60)
                        .background(
                            LinearGradient(
                                colors: [Color(hex: "FFA040"), Color(hex: "FF8A3D")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(20)
                        .shadow(color: Color(hex: "FFA040").opacity(0.4), radius: 20, x: 0, y: 10)
                    }
                    .padding(.horizontal, 24)

                    // Filters Bar
                    HStack(spacing: 12) {
                        Button(action: { viewModel.showFilters = true }) {
                            HStack(spacing: 10) {
                                Image(systemName: AppIcon.sliders.sfSymbol)
                                    .font(.system(size: 18, weight: .semibold))
                                Text("Filtres")
                                    .font(.system(size: 16, weight: .semibold))
                            }
                            .foregroundColor(Color(hex: "111827"))
                            .padding(.horizontal, 24)
                            .frame(height: 50)
                            .background(Color.white)
                            .cornerRadius(16)
                            .shadow(color: Color.black.opacity(0.04), radius: 12, x: 0, y: 6)
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
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "6B7280"))
                                    .rotationEffect(.degrees(90))
                            }
                            .padding(.horizontal, 20)
                            .frame(height: 50)
                            .background(Color.white)
                            .cornerRadius(16)
                            .shadow(color: Color.black.opacity(0.04), radius: 12, x: 0, y: 6)
                        }
                    }
                    .padding(.horizontal, 24)

                    // Properties or Empty State
                    if viewModel.properties.isEmpty {
                        emptyState
                    }
                }
            }
            .background(Color(hex: "F9FAFB"))
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

    private var emptyState: some View {
        VStack(spacing: 20) {
            ZStack {
                Circle()
                    .fill(Color(hex: "F3F4F6"))
                    .frame(width: 100, height: 100)

                Image(systemName: "house.slash")
                    .font(.system(size: 40, weight: .medium))
                    .foregroundColor(Color(hex: "9CA3AF"))
            }

            Text("Aucune propriété trouvée")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            Text("Ajuste tes filtres pour voir plus de résultats")
                .font(.system(size: 15))
                .foregroundColor(Color(hex: "6B7280"))
                .multilineTextAlignment(.center)
        }
        .padding(.vertical, 60)
    }
}
