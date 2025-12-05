import SwiftUI

// MARK: - Side-by-Side Comparison View

struct PropertiesListView_Comparison: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 0) {
                    // Header avec labels
                    HStack(spacing: 0) {
                        Text("Version Actuelle")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "6B7280"))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color(hex: "F3F4F6"))

                        Divider()

                        Text("Version Figma ✨")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "FFA040"))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(Color(hex: "FFF4ED"))
                    }

                    Divider()

                    // Scrollable comparison content
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 0) {
                            // Version Actuelle (gauche)
                            PropertiesListView()
                                .frame(width: UIScreen.main.bounds.width)

                            Divider()
                                .background(Color(hex: "FFA040"))
                                .frame(width: 3)

                            // Version Stylée (droite)
                            PropertiesListView_Styled()
                                .frame(width: UIScreen.main.bounds.width)
                        }
                    }
                    .frame(height: UIScreen.main.bounds.height - 150)
                }
            }
            .navigationTitle("Comparaison Design")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

// MARK: - Comparison Preview Provider

struct PropertiesListView_Comparison_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            // Preview 1: Side-by-side sur grand écran
            PropertiesListView_Comparison()
                .previewDevice(PreviewDevice(rawValue: "iPhone 15 Pro Max"))
                .previewDisplayName("iPhone 15 Pro Max - Comparaison")

            // Preview 2: Version actuelle seule
            PropertiesListView()
                .previewDevice(PreviewDevice(rawValue: "iPhone 15 Pro"))
                .previewDisplayName("Version Actuelle")

            // Preview 3: Version stylée seule
            PropertiesListView_Styled()
                .previewDevice(PreviewDevice(rawValue: "iPhone 15 Pro"))
                .previewDisplayName("Version Figma ✨")
        }
    }
}

// MARK: - Alternative: Split Screen Comparison

struct SplitScreenComparison: View {
    var body: some View {
        GeometryReader { geometry in
            HStack(spacing: 0) {
                // Gauche: Version actuelle
                VStack(spacing: 0) {
                    Text("Actuelle")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 8)
                        .background(Color(hex: "6B7280"))

                    PropertiesListView()
                        .frame(width: geometry.size.width / 2)
                }

                // Séparateur
                Rectangle()
                    .fill(Color(hex: "FFA040"))
                    .frame(width: 2)

                // Droite: Version stylée
                VStack(spacing: 0) {
                    Text("Figma ✨")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 8)
                        .background(Color(hex: "FFA040"))

                    PropertiesListView_Styled()
                        .frame(width: geometry.size.width / 2)
                }
            }
        }
        .edgesIgnoringSafeArea(.all)
    }
}

// MARK: - Alternative: Stacked Comparison (Vertical)

struct StackedComparison: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Version actuelle
                    VStack(spacing: 8) {
                        HStack {
                            Text("Version Actuelle")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(Color(hex: "111827"))

                            Spacer()

                            Image(systemName: "clock.arrow.circlepath")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "6B7280"))
                        }
                        .padding(.horizontal, 20)

                        // Miniature version actuelle
                        PropertiesListView()
                            .frame(height: 600)
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color(hex: "E5E7EB"), lineWidth: 2)
                            )
                            .padding(.horizontal, 20)
                    }

                    // Flèche de comparaison
                    VStack(spacing: 8) {
                        Image(systemName: "arrow.down")
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(Color(hex: "FFA040"))

                        Text("Améliorations Figma")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(Color(hex: "FFA040"))
                    }
                    .padding(.vertical, 16)

                    // Version stylée
                    VStack(spacing: 8) {
                        HStack {
                            Text("Version Figma")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(Color(hex: "FFA040"))

                            Spacer()

                            Image(systemName: "sparkles")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "FFA040"))
                        }
                        .padding(.horizontal, 20)

                        // Miniature version stylée
                        PropertiesListView_Styled()
                            .frame(height: 600)
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color(hex: "FFA040"), lineWidth: 2)
                            )
                            .padding(.horizontal, 20)
                    }

                    // Liste des améliorations
                    VStack(alignment: .leading, spacing: 16) {
                        Text("✨ Améliorations clés")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(Color(hex: "111827"))

                        VStack(alignment: .leading, spacing: 12) {
                            DesignComparisonRow(
                                icon: "✅",
                                title: "Icônes signature",
                                description: "IconContainer avec style vivid"
                            )

                            DesignComparisonRow(
                                icon: "✅",
                                title: "Zones tactiles iOS",
                                description: "Boutons 48-56pt de hauteur"
                            )

                            DesignComparisonRow(
                                icon: "✅",
                                title: "Couleurs Figma",
                                description: "Gradients pastel + ombres subtiles"
                            )

                            DesignComparisonRow(
                                icon: "✅",
                                title: "Espacement amélioré",
                                description: "Padding 20pt, gaps cohérents"
                            )

                            DesignComparisonRow(
                                icon: "✅",
                                title: "Empty state élégant",
                                description: "Container gradient + icône centrée"
                            )
                        }
                    }
                    .padding(20)
                    .background(Color(hex: "FFF4ED"))
                    .cornerRadius(16)
                    .padding(.horizontal, 20)
                    .padding(.top, 16)
                }
                .padding(.vertical, 24)
            }
            .background(Color(hex: "F9FAFB"))
            .navigationTitle("Comparaison")
            .navigationBarTitleDisplayMode(.large)
        }
    }
}

// MARK: - Design Comparison Row

struct DesignComparisonRow: View {
    let icon: String
    let title: String
    let description: String

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Text(icon)
                .font(.system(size: 20))

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(Color(hex: "111827"))

                Text(description)
                    .font(.system(size: 14))
                    .foregroundColor(Color(hex: "6B7280"))
            }
        }
    }
}

// MARK: - Interactive Toggle Comparison

struct InteractiveComparison: View {
    @State private var showStyled = false

    var body: some View {
        NavigationStack {
            ZStack {
                // Background views
                if showStyled {
                    PropertiesListView_Styled()
                        .transition(.asymmetric(
                            insertion: .move(edge: .trailing).combined(with: .opacity),
                            removal: .move(edge: .leading).combined(with: .opacity)
                        ))
                } else {
                    PropertiesListView()
                        .transition(.asymmetric(
                            insertion: .move(edge: .leading).combined(with: .opacity),
                            removal: .move(edge: .trailing).combined(with: .opacity)
                        ))
                }

                // Floating toggle button
                VStack {
                    Spacer()

                    Button(action: {
                        withAnimation(.spring(response: 0.5, dampingFraction: 0.7)) {
                            showStyled.toggle()
                        }
                    }) {
                        HStack(spacing: 12) {
                            Image(systemName: showStyled ? "arrow.left" : "arrow.right")
                                .font(.system(size: 16, weight: .semibold))

                            Text(showStyled ? "Version Actuelle" : "Version Figma ✨")
                                .font(.system(size: 16, weight: .bold))

                            Image(systemName: showStyled ? "sparkles" : "clock.arrow.circlepath")
                                .font(.system(size: 16))
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 24)
                        .padding(.vertical, 16)
                        .background(
                            Capsule()
                                .fill(
                                    LinearGradient(
                                        colors: showStyled
                                            ? [Color(hex: "FFA040"), Color(hex: "FFB85C")]
                                            : [Color(hex: "6B7280"), Color(hex: "9CA3AF")],
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                )
                                .shadow(
                                    color: (showStyled ? Color(hex: "FFA040") : Color.black).opacity(0.3),
                                    radius: 12,
                                    x: 0,
                                    y: 6
                                )
                        )
                    }
                    .padding(.bottom, 100)
                }
            }
            .navigationTitle("Comparaison Interactive")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

// MARK: - All Comparison Previews

struct AllComparisons_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            // 1. Side-by-side horizontal
            PropertiesListView_Comparison()
                .previewDisplayName("1. Horizontal Scroll")

            // 2. Split screen
            SplitScreenComparison()
                .previewDisplayName("2. Split Screen")

            // 3. Stacked vertical
            StackedComparison()
                .previewDisplayName("3. Stacked Vertical")

            // 4. Interactive toggle
            InteractiveComparison()
                .previewDisplayName("4. Interactive Toggle")
        }
    }
}
