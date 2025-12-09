import SwiftUI

// MARK: - Owner Feature View (Guest Mode - Glassmorphism Style)

struct OwnerFeatureView: View {
    @State private var showSignup = false

    var body: some View {
        ZStack {
            // Background gradient (Owner colors)
            LinearGradient(
                colors: [
                    Theme.Colors.Owner.primary.opacity(0.12),  // #6E56CF
                    Theme.Colors.Owner._400.opacity(0.08),      // #8E7AD6
                    Color(hex: "F9FAFB")
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 0) {
                    // Hero Section
                    heroSection

                    // Benefits Section
                    benefitsSection
                        .padding(.vertical, 40)

                    // Stats Section
                    statsSection
                        .padding(.vertical, 40)

                    // CTA Section
                    ctaSection
                        .padding(.bottom, 40)
                }
            }
        }
        .fullScreenCover(isPresented: $showSignup) {
            WelcomeView()
        }
    }

    // MARK: - Hero Section (Glassmorphism)

    private var heroSection: some View {
        VStack(spacing: 32) {
            // Icon with glow (Owner colors - Mauve)
            ZStack {
                // Glow effect
                Circle()
                    .fill(Theme.Colors.Owner.primary.opacity(0.3))  // #6E56CF
                    .frame(width: 140, height: 140)
                    .blur(radius: 24)

                // Main circle with glass effect
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [
                                Theme.Colors.Owner.primary.opacity(0.15),
                                Theme.Colors.Owner._400.opacity(0.1)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 120, height: 120)
                    .overlay(
                        Circle()
                            .stroke(
                                LinearGradient(
                                    colors: [Theme.Colors.Owner.primary, Theme.Colors.Owner._400],  // #6E56CF → #8E7AD6
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                ),
                                lineWidth: 3
                            )
                    )
                    .shadow(color: Theme.Colors.Owner.primary.opacity(0.2), radius: 16, x: 0, y: 8)

                Image(systemName: "building.2.fill")
                    .font(.system(size: 56, weight: .semibold))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Theme.Colors.Owner.primary, Theme.Colors.Owner._400],  // #6E56CF → #8E7AD6
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }
            .padding(.top, 40)

            // Title Card with glass effect
            VStack(spacing: 16) {
                Text("Louez votre propriété")
                    .font(.system(size: 34, weight: .heavy))
                    .foregroundColor(Color(hex: "111827"))
                    .multilineTextAlignment(.center)

                Text("Trouvez les colocataires parfaits pour votre bien")
                    .font(.system(size: 17))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
            }
            .padding(.horizontal, 32)
            .padding(.vertical, 32)
            .background(
                Color.white.opacity(0.65)
                    .background(.thinMaterial)
            )
            .cornerRadius(24)
            .overlay(
                RoundedRectangle(cornerRadius: 24)
                    .stroke(
                        LinearGradient(
                            colors: [
                                Color.white.opacity(0.7),
                                Theme.Colors.Owner.primary.opacity(0.2)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        lineWidth: 1.5
                    )
            )
            .shadow(color: .black.opacity(0.06), radius: 16, x: 0, y: 8)
            .padding(.horizontal, 20)
        }
        .padding(.bottom, 20)
    }

    // MARK: - Benefits Section

    private var benefitsSection: some View {
        VStack(spacing: 28) {
            Text("Pourquoi choisir EasyCo ?")
                .font(.system(size: 28, weight: .heavy))
                .foregroundColor(Color(hex: "111827"))
                .padding(.bottom, 4)

            VStack(spacing: 14) {
                BenefitCard(
                    icon: "sparkles",
                    title: "Matching intelligent",
                    description: "Notre algorithme trouve les meilleurs locataires pour votre propriété"
                )

                BenefitCard(
                    icon: "checkmark.shield.fill",
                    title: "Profils vérifiés",
                    description: "Tous les candidats sont vérifiés pour votre sécurité"
                )

                BenefitCard(
                    icon: "chart.line.uptrend.xyaxis",
                    title: "Visibilité maximale",
                    description: "Votre annonce est vue par des milliers de chercheurs actifs"
                )

                BenefitCard(
                    icon: "message.badge.filled.fill",
                    title: "Gestion simplifiée",
                    description: "Gérez les candidatures et communiquez facilement avec les locataires"
                )
            }
            .padding(.horizontal, 20)
        }
    }

    // MARK: - Stats Section

    private var statsSection: some View {
        VStack(spacing: 28) {
            Text("EasyCo en chiffres")
                .font(.system(size: 28, weight: .heavy))
                .foregroundColor(Color(hex: "111827"))

            HStack(spacing: 14) {
                GuestStatCard(number: "10K+", label: "Propriétés")
                GuestStatCard(number: "50K+", label: "Utilisateurs")
                GuestStatCard(number: "95%", label: "Satisfaction")
            }
            .padding(.horizontal, 20)
        }
    }

    // MARK: - CTA Section (Glassmorphism)

    private var ctaSection: some View {
        VStack(spacing: 18) {
            Button(action: {
                showSignup = true
            }) {
                HStack(spacing: 14) {
                    Image(systemName: "plus.circle.fill")
                        .font(.system(size: 20, weight: .semibold))
                    Text("Publier ma propriété")
                        .font(.system(size: 19, weight: .bold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 20)
                .background(
                    ZStack {
                        // Dégradé signature EasyCo - Diagonal
                        LinearGradient(
                            colors: [
                                Color(hex: "A394E6"),  // Mauve
                                Color(hex: "C99FD8"),
                                Color(hex: "E8A8C8"),
                                Color(hex: "FFB1B8"),
                                Color(hex: "FFBAA0"),
                                Color(hex: "FFC388"),
                                Color(hex: "FFCC70"),
                                Color(hex: "FFD558")   // Jaune
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )

                        // Frosted overlay subtil
                        Color.white.opacity(0.08)
                            .background(.ultraThinMaterial.opacity(0.25))
                    }
                )
                .cornerRadius(20)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(Color.white.opacity(0.5), lineWidth: 2)
                )
                .shadow(color: Theme.Colors.Owner.primary.opacity(0.4), radius: 20, x: 0, y: 10)  // #6E56CF
            }
            .padding(.horizontal, 20)

            Text("C'est gratuit et sans engagement")
                .font(.system(size: 15, weight: .semibold))
                .foregroundColor(Color(hex: "6B7280"))
        }
    }
}

// MARK: - Benefit Card Component

struct BenefitCard: View {
    let icon: String
    let title: String
    let description: String

    var body: some View {
        HStack(alignment: .top, spacing: 18) {
            // Icon with glass (Owner colors)
            ZStack {
                // Subtle glow
                Circle()
                    .fill(Theme.Colors.Owner.primary.opacity(0.15))  // #6E56CF
                    .frame(width: 64, height: 64)
                    .blur(radius: 8)

                Circle()
                    .fill(
                        LinearGradient(
                            colors: [
                                Theme.Colors.Owner.primary.opacity(0.2),
                                Theme.Colors.Owner._400.opacity(0.15)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .background(.ultraThinMaterial)
                    .frame(width: 60, height: 60)
                    .overlay(
                        Circle()
                            .stroke(Theme.Colors.Owner.primary.opacity(0.3), lineWidth: 2)
                    )

                Image(systemName: icon)
                    .font(.system(size: 26, weight: .semibold))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Theme.Colors.Owner.primary, Theme.Colors.Owner._400],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }

            // Content
            VStack(alignment: .leading, spacing: 8) {
                Text(title)
                    .font(.system(size: 19, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text(description)
                    .font(.system(size: 15, weight: .regular))
                    .foregroundColor(Color(hex: "6B7280"))
                    .lineSpacing(5)
                    .fixedSize(horizontal: false, vertical: true)
            }

            Spacer()
        }
        .padding(22)
        .background(
            Color.white.opacity(0.75)
                .background(.thinMaterial)
        )
        .cornerRadius(20)
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(
                    LinearGradient(
                        colors: [
                            Color.white.opacity(0.6),
                            Theme.Colors.Owner.primary.opacity(0.15)
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    lineWidth: 1.5
                )
        )
        .shadow(color: .black.opacity(0.06), radius: 14, x: 0, y: 7)
    }
}

// MARK: - Guest Stat Card Component

struct GuestStatCard: View {
    let number: String
    let label: String

    var body: some View {
        VStack(spacing: 10) {
            Text(number)
                .font(.system(size: 36, weight: .heavy))
                .foregroundStyle(
                    LinearGradient(
                        colors: [Theme.Colors.Owner.primary, Theme.Colors.Owner._400],  // #6E56CF → #8E7AD6
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )

            Text(label)
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 28)
        .background(
            Color.white.opacity(0.75)
                .background(.thinMaterial)
        )
        .cornerRadius(18)
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(
                    LinearGradient(
                        colors: [
                            Color.white.opacity(0.6),
                            Theme.Colors.Owner.primary.opacity(0.15)
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    lineWidth: 1.5
                )
        )
        .shadow(color: .black.opacity(0.06), radius: 14, x: 0, y: 7)
    }
}

// MARK: - Preview

struct OwnerFeatureView_Previews: PreviewProvider {
    static var previews: some View {
        OwnerFeatureView()
    }
}
