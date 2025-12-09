import SwiftUI

// MARK: - Guest Experience View (Figma Style)
// L'écran principal avant connexion avec les 3 tabs: Découvrir / Fonctionnalités / Communauté

struct GuestExperienceView_Figma: View {
    @State private var selectedTab = 1 // Start on Features tab
    @State private var showWelcome = false

    var body: some View {
        NavigationStack {
            ZStack {
                // Content based on selected tab
                TabView(selection: $selectedTab) {
                    // Tab 1: Découvrir (Explorer)
                    GuestExplorerTab()
                        .tag(0)

                    // Tab 2: Fonctionnalités (Features) - DEFAULT
                    GuestFeaturesTab_Figma()
                        .tag(1)

                    // Tab 3: Communauté (Community)
                    GuestCommunityTab()
                        .tag(2)
                }
                .tabViewStyle(.page(indexDisplayMode: .never))

                // Custom Tab Bar at bottom
                VStack {
                    Spacer()

                    CustomGuestTabBar(
                        selectedTab: $selectedTab,
                        onSignup: {
                            showWelcome = true
                        }
                    )
                }
            }
            .background(Color(hex: "F9FAFB"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    // Logo EasyCo
                    HStack(spacing: 8) {
                        Image("IzzIcoHouseIcon")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 32, height: 32)

                        Text("EasyCo")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(Color(hex: "FFA040"))
                    }
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    // Bouton S'inscrire avec taille iOS-compliant
                    Button(action: {
                        showWelcome = true
                    }) {
                        Text("S'inscrire")
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 20)
                            .frame(height: 44) // iOS touch target
                            .background(
                                LinearGradient(
                                    colors: [
                                        Color(hex: "FFA040"),
                                        Color(hex: "FFB85C")
                                    ],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(22)
                            .shadow(
                                color: Color(hex: "FFA040").opacity(0.3),
                                radius: 8,
                                x: 0,
                                y: 4
                            )
                    }
                }
            }
        }
        .fullScreenCover(isPresented: $showWelcome) {
            WelcomeView()
        }
    }
}

// MARK: - Guest Features Tab (Figma Style - Comme ton screenshot)

struct GuestFeaturesTab_Figma: View {
    @State private var showSignup = false

    var body: some View {
        ScrollView {
            VStack(spacing: 32) {
                // Hero Section avec illustration
                heroSection

                // Section Locataires
                VStack(alignment: .leading, spacing: 20) {
                    SectionHeader(
                        icon: AppIcon.home.sfSymbol,
                        title: "Pour les Locataires",
                        color: Color(hex: "FFA040")
                    )

                    VStack(spacing: 16) {
                        FeatureCard_Figma(
                            icon: AppIcon.search.sfSymbol,
                            iconColor: Color(hex: "EC4899"),
                            title: "Trouvez votre colocation idéale",
                            description: "Parcourez des centaines d'annonces vérifiées et trouvez la colocation qui vous correspond"
                        )

                        FeatureCard_Figma(
                            icon: AppIcon.users.sfSymbol,
                            iconColor: Color(hex: "8B5CF6"),
                            title: "Matchez avec vos colocataires",
                            description: "Notre algorithme trouve les personnes compatibles avec votre style de vie"
                        )

                        FeatureCard_Figma(
                            icon: AppIcon.checkList.sfSymbol,
                            iconColor: Color(hex: "F59E0B"),
                            title: "Gérez votre quotidien",
                            description: "Tâches, dépenses, calendrier : tout en un seul endroit"
                        )
                    }
                }
                .padding(.horizontal, 20)

                // Section Propriétaires
                VStack(alignment: .leading, spacing: 20) {
                    SectionHeader(
                        icon: AppIcon.building2.sfSymbol,
                        title: "Pour les Propriétaires",
                        color: Color(hex: "8B5CF6")
                    )

                    VStack(spacing: 16) {
                        FeatureCard_Figma(
                            icon: AppIcon.megaphone.sfSymbol,
                            iconColor: Color(hex: "10B981"),
                            title: "Publiez votre annonce",
                            description: "Créez une annonce attrayante en quelques minutes et touchez des milliers de chercheurs"
                        )

                        FeatureCard_Figma(
                            icon: AppIcon.users.sfSymbol,
                            iconColor: Color(hex: "3B82F6"),
                            title: "Trouvez les meilleurs locataires",
                            description: "Consultez les profils détaillés et choisissez les candidats parfaits"
                        )

                        FeatureCard_Figma(
                            icon: AppIcon.chartBar.sfSymbol,
                            iconColor: Color(hex: "F59E0B"),
                            title: "Gérez vos propriétés",
                            description: "Suivez les paiements, les demandes de maintenance et communiquez facilement"
                        )
                    }
                }
                .padding(.horizontal, 20)

                // CTA Final
                ctaSection
                    .padding(.horizontal, 20)
                    .padding(.bottom, 40)
            }
            .padding(.top, 20)
        }
        .background(Color(hex: "F9FAFB"))
        .fullScreenCover(isPresented: $showSignup) {
            WelcomeView()
        }
    }

    // MARK: - Hero Section

    private var heroSection: some View {
        VStack(spacing: 16) {
            // Animated gradient icon
            ZStack {
                // Glow effect
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
                    .frame(width: 140, height: 140)
                    .blur(radius: 20)

                // Main icon
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [
                                Color(hex: "FFA040"),
                                Color(hex: "FFB85C")
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 100, height: 100)

                Image("IzzIcoHouseIcon")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 70, height: 70)
            }

            VStack(spacing: 8) {
                Text("Bienvenue sur EasyCo")
                    .font(.system(size: 28, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text("La plateforme de colocation simplifiée")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
            }
        }
        .padding(.vertical, 32)
    }

    // MARK: - CTA Section

    private var ctaSection: some View {
        VStack(spacing: 20) {
            // Main CTA Card
            VStack(spacing: 16) {
                Text("Prêt à commencer ?")
                    .font(.system(size: 22, weight: .bold))
                    .foregroundColor(.white)

                Text("Rejoignez des milliers d'utilisateurs qui ont déjà trouvé leur colocation idéale")
                    .font(.system(size: 15))
                    .foregroundColor(.white.opacity(0.9))
                    .multilineTextAlignment(.center)

                Button(action: {
                    showSignup = true
                }) {
                    HStack(spacing: 10) {
                        Image(systemName: AppIcon.user.sfSymbol)
                            .font(.system(size: 18, weight: .semibold))

                        Text("Créer mon compte gratuitement")
                            .font(.system(size: 17, weight: .bold))
                    }
                    .foregroundColor(Color(hex: "8B5CF6"))
                    .frame(maxWidth: .infinity)
                    .frame(height: 56)
                    .background(Color.white)
                    .cornerRadius(16)
                    .shadow(color: Color.black.opacity(0.15), radius: 12, x: 0, y: 6)
                }
            }
            .padding(28)
            .background(
                LinearGradient(
                    colors: [
                        Color(hex: "8B5CF6"),
                        Color(hex: "6E56CF")
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .cornerRadius(24)
            .shadow(color: Color(hex: "8B5CF6").opacity(0.3), radius: 20, x: 0, y: 10)
        }
    }
}

// MARK: - Section Header

struct SectionHeader: View {
    let icon: String
    let title: String
    let color: Color

    var body: some View {
        HStack(spacing: 12) {
            // Icon container
            ZStack {
                Circle()
                    .fill(color.opacity(0.15))
                    .frame(width: 40, height: 40)

                Image(systemName: icon)
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(color)
            }

            Text(title)
                .font(.system(size: 22, weight: .bold))
                .foregroundColor(Color(hex: "111827"))
        }
    }
}

// MARK: - Feature Card (Figma Style)

struct FeatureCard_Figma: View {
    let icon: String
    let iconColor: Color
    let title: String
    let description: String

    var body: some View {
        HStack(alignment: .top, spacing: 16) {
            // Icon container with signature style
            ZStack {
                Circle()
                    .fill(iconColor.opacity(0.15))
                    .frame(width: 56, height: 56)

                Image(systemName: icon)
                    .font(.system(size: 24, weight: .semibold))
                    .foregroundColor(iconColor)
            }

            VStack(alignment: .leading, spacing: 6) {
                Text(title)
                    .font(.system(size: 17, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text(description)
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "6B7280"))
                    .fixedSize(horizontal: false, vertical: true)
            }

            Spacer()
        }
        .padding(20)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.04), radius: 8, x: 0, y: 2)
    }
}

// MARK: - Custom Guest Tab Bar

struct CustomGuestTabBar: View {
    @Binding var selectedTab: Int
    let onSignup: () -> Void

    var body: some View {
        HStack(spacing: 0) {
            // Tab: Découvrir
            GuestTabButton(
                icon: AppIcon.search.sfSymbol,
                label: "Découvrir",
                isSelected: selectedTab == 0,
                primaryColor: Color(hex: "FFA040"),
                action: { selectedTab = 0 }
            )

            // Tab: Fonctionnalités
            GuestTabButton(
                icon: AppIcon.sparkles.sfSymbol,
                label: "Fonctionnalités",
                isSelected: selectedTab == 1,
                primaryColor: Color(hex: "FFA040"),
                action: { selectedTab = 1 }
            )

            // Tab: Communauté
            GuestTabButton(
                icon: AppIcon.users.sfSymbol,
                label: "Communauté",
                isSelected: selectedTab == 2,
                primaryColor: Color(hex: "FFA040"),
                action: { selectedTab = 2 }
            )
        }
        .frame(height: 80)
        .background(
            RoundedRectangle(cornerRadius: 24)
                .fill(Color.white)
                .shadow(color: .black.opacity(0.08), radius: 16, x: 0, y: -4)
        )
        .padding(.horizontal, 16)
        .padding(.bottom, 8)
    }
}

// MARK: - Guest Explorer Tab (Placeholder)

struct GuestExplorerTab: View {
    var body: some View {
        PropertiesListView_Styled()
    }
}

// MARK: - Guest Community Tab (Placeholder)

struct GuestCommunityTab: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Communauté")
                    .font(.system(size: 28, weight: .bold))
                    .padding(.top, 40)

                Text("Rejoignez des milliers d'utilisateurs")
                    .font(.system(size: 16))
                    .foregroundColor(Color(hex: "6B7280"))

                // TODO: Community features
            }
        }
        .background(Color(hex: "F9FAFB"))
    }
}

// MARK: - Preview

struct GuestExperienceView_Figma_Previews: PreviewProvider {
    static var previews: some View {
        GuestExperienceView_Figma()
    }
}
