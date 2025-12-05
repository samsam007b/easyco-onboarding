import SwiftUI

// MARK: - Preview Comparison File
// Ce fichier te permet de comparer les 5 versions de design côte à côte dans Xcode Canvas

struct PropertiesListView_AllVersions_Preview: View {
    @State private var selectedVersion = 0

    var body: some View {
        VStack(spacing: 0) {
            // Version Selector
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    VersionButton(
                        title: "V1: Modern",
                        subtitle: "Minimal",
                        isSelected: selectedVersion == 0,
                        color: Color(hex: "3B82F6")
                    ) {
                        selectedVersion = 0
                    }

                    VersionButton(
                        title: "V2: Glass",
                        subtitle: "Morphism",
                        isSelected: selectedVersion == 1,
                        color: Color(hex: "8B5CF6")
                    ) {
                        selectedVersion = 1
                    }

                    VersionButton(
                        title: "V3: Bold",
                        subtitle: "Vibrant",
                        isSelected: selectedVersion == 2,
                        color: Color(hex: "FFA040")
                    ) {
                        selectedVersion = 2
                    }

                    VersionButton(
                        title: "V4: Soft",
                        subtitle: "Elegant",
                        isSelected: selectedVersion == 3,
                        color: Color(hex: "10B981")
                    ) {
                        selectedVersion = 3
                    }

                    VersionButton(
                        title: "V5: Premium",
                        subtitle: "Dark",
                        isSelected: selectedVersion == 4,
                        color: Color(hex: "1F2937")
                    ) {
                        selectedVersion = 4
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
            }
            .background(Color(hex: "F9FAFB"))
            .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 2)

            // Selected Version Display
            TabView(selection: $selectedVersion) {
                PropertiesListView_V1_Modern()
                    .tag(0)

                PropertiesListView_V2_Glassmorphism()
                    .tag(1)

                PropertiesListView_V3_BoldVibrant()
                    .tag(2)

                PropertiesListView_V4_SoftElegant()
                    .tag(3)

                PropertiesListView_V5_PremiumDark()
                    .tag(4)
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
        }
    }
}

// MARK: - Version Button Component

struct VersionButton: View {
    let title: String
    let subtitle: String
    let isSelected: Bool
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Text(title)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(isSelected ? .white : Color(hex: "111827"))

                Text(subtitle)
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(isSelected ? .white.opacity(0.9) : Color(hex: "6B7280"))
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 12)
            .background(
                isSelected ? color : Color.white
            )
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(color, lineWidth: isSelected ? 0 : 1.5)
            )
            .shadow(
                color: isSelected ? color.opacity(0.3) : Color.clear,
                radius: isSelected ? 12 : 0,
                x: 0,
                y: isSelected ? 6 : 0
            )
        }
    }
}

// MARK: - Individual Preview for Each Version

struct PropertiesListView_V1_Preview: PreviewProvider {
    static var previews: some View {
        PropertiesListView_V1_Modern()
    }
}

struct PropertiesListView_V2_Preview: PreviewProvider {
    static var previews: some View {
        PropertiesListView_V2_Glassmorphism()
    }
}

struct PropertiesListView_V3_Preview: PreviewProvider {
    static var previews: some View {
        PropertiesListView_V3_BoldVibrant()
    }
}

struct PropertiesListView_V4_Preview: PreviewProvider {
    static var previews: some View {
        PropertiesListView_V4_SoftElegant()
    }
}

struct PropertiesListView_V5_Preview: PreviewProvider {
    static var previews: some View {
        PropertiesListView_V5_PremiumDark()
    }
}

#Preview("Comparison Selector") {
    PropertiesListView_AllVersions_Preview()
}

// MARK: - Grid Comparison (2x3 for comparing multiple at once)

struct PropertiesListView_GridComparison: View {
    var body: some View {
        ScrollView {
            LazyVGrid(columns: [
                GridItem(.flexible(), spacing: 8),
                GridItem(.flexible(), spacing: 8)
            ], spacing: 8) {
                // V1 & V2
                ComparisonCard(
                    title: "V1: Modern",
                    color: Color(hex: "3B82F6")
                ) {
                    PropertiesListView_V1_Modern()
                        .scaleEffect(0.5)
                        .frame(height: 600)
                        .clipped()
                }

                ComparisonCard(
                    title: "V2: Glass",
                    color: Color(hex: "8B5CF6")
                ) {
                    PropertiesListView_V2_Glassmorphism()
                        .scaleEffect(0.5)
                        .frame(height: 600)
                        .clipped()
                }

                // V3 & V4
                ComparisonCard(
                    title: "V3: Bold",
                    color: Color(hex: "FFA040")
                ) {
                    PropertiesListView_V3_BoldVibrant()
                        .scaleEffect(0.5)
                        .frame(height: 600)
                        .clipped()
                }

                ComparisonCard(
                    title: "V4: Soft",
                    color: Color(hex: "10B981")
                ) {
                    PropertiesListView_V4_SoftElegant()
                        .scaleEffect(0.5)
                        .frame(height: 600)
                        .clipped()
                }

                // V5 centered
                ComparisonCard(
                    title: "V5: Premium",
                    color: Color(hex: "1F2937")
                ) {
                    PropertiesListView_V5_PremiumDark()
                        .scaleEffect(0.5)
                        .frame(height: 600)
                        .clipped()
                }
            }
            .padding(8)
        }
        .background(Color(hex: "F3F4F6"))
    }
}

struct ComparisonCard<Content: View>: View {
    let title: String
    let color: Color
    let content: () -> Content

    var body: some View {
        VStack(spacing: 8) {
            Text(title)
                .font(.system(size: 13, weight: .bold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 8)
                .background(color)
                .cornerRadius(8)

            content()
                .cornerRadius(12)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(color, lineWidth: 2)
                )
        }
        .background(Color.white)
        .cornerRadius(12)
        .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 4)
    }
}

#Preview("Grid Comparison") {
    PropertiesListView_GridComparison()
}
