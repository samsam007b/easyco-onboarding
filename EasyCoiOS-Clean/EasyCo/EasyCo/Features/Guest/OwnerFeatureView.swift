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
        VStack(spacing: 24) {
            // Icon with glow (Owner colors)
            ZStack {
                // Glow effect
                Circle()
                    .fill(Theme.Colors.Owner.primary.opacity(0.25))  // #6E56CF
                    .frame(width: 130, height: 130)
                    .blur(radius: 20)

                // Main circle with glass effect
                Circle()
                    .fill(Theme.Colors.Owner.primary.opacity(0.2))  // #6E56CF
                    .background(.ultraThinMaterial)
                    .frame(width: 100, height: 100)
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

                Image(systemName: AppIcon.building2.sfSymbol)
                    .font(.system(size: 48, weight: .semibold))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Theme.Colors.Owner.primary, Theme.Colors.Owner._400],  // #6E56CF → #8E7AD6
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }

            // Title Card with glass effect
            VStack(spacing: 12) {
                Text("Louez votre propriété")
                    .font(.system(size: 32, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))
                    .multilineTextAlignment(.center)

                Text("Trouvez les colocataires parfaits pour votre bien")
                    .font(.system(size: 18))
                    .foregroundColor(Color(hex: "6B7280"))
                    .multilineTextAlignment(.center)
            }
            .padding(.horizontal, 32)
            .padding(.vertical, 32)
            .background(
                Color.white.opacity(0.6)
                    .background(.thinMaterial)
            )
            .cornerRadius(24)
            .overlay(
                RoundedRectangle(cornerRadius: 24)
                    .stroke(Color.white.opacity(0.5), lineWidth: 1.5)
            )
            .padding(.horizontal, 20)
        }
        .padding(.vertical, 60)
    }

    // MARK: - Benefits Section

    private var benefitsSection: some View {
        VStack(spacing: 24) {
            Text("Pourquoi choisir EasyCo ?")
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(Color(hex: "111827"))
                .padding(.bottom, 8)

            VStack(spacing: 16) {
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
            .padding(.horizontal, 16)
        }
    }

    // MARK: - Stats Section

    private var statsSection: some View {
        VStack(spacing: 24) {
            Text("EasyCo en chiffres")
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(Color(hex: "111827"))

            HStack(spacing: 16) {
                GuestStatCard(number: "10K+", label: "Propriétés")
                GuestStatCard(number: "50K+", label: "Utilisateurs")
                GuestStatCard(number: "95%", label: "Satisfaction")
            }
            .padding(.horizontal, 16)
        }
    }

    // MARK: - CTA Section (Glassmorphism)

    private var ctaSection: some View {
        VStack(spacing: 16) {
            Button(action: {
                showSignup = true
            }) {
                HStack(spacing: 12) {
                    Image(systemName: "plus.circle.fill")
                        .font(.system(size: 18, weight: .semibold))
                    Text("Publier ma propriété")
                        .font(.system(size: 18, weight: .bold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 18)
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
                        Color.white.opacity(0.1)
                            .background(.ultraThinMaterial.opacity(0.3))
                    }
                )
                .cornerRadius(18)
                .overlay(
                    RoundedRectangle(cornerRadius: 18)
                        .stroke(Color.white.opacity(0.4), lineWidth: 1.5)
                )
                .shadow(color: Theme.Colors.Owner.primary.opacity(0.35), radius: 18, x: 0, y: 8)  // #6E56CF
            }
            .padding(.horizontal, 24)

            Text("C'est gratuit et sans engagement")
                .font(.system(size: 14, weight: .medium))
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
        HStack(alignment: .top, spacing: 16) {
            // Icon with glass (Owner colors)
            ZStack {
                Circle()
                    .fill(Theme.Colors.Owner.primary.opacity(0.2))  // #6E56CF
                    .background(.ultraThinMaterial)
                    .frame(width: 56, height: 56)

                Image(systemName: icon)
                    .font(.system(size: 24, weight: .semibold))
                    .foregroundColor(Theme.Colors.Owner.primary)  // #6E56CF
            }

            // Content
            VStack(alignment: .leading, spacing: 6) {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text(description)
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "6B7280"))
                    .lineSpacing(4)
            }

            Spacer()
        }
        .padding(20)
        .background(
            Color.white.opacity(0.7)
                .background(.thinMaterial)
        )
        .cornerRadius(18)
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(Color.white.opacity(0.5), lineWidth: 1.5)
        )
        .shadow(color: .black.opacity(0.04), radius: 12, x: 0, y: 6)
    }
}

// MARK: - Guest Stat Card Component

struct GuestStatCard: View {
    let number: String
    let label: String

    var body: some View {
        VStack(spacing: 8) {
            Text(number)
                .font(.system(size: 32, weight: .bold))
                .foregroundStyle(
                    LinearGradient(
                        colors: [Theme.Colors.Owner.primary, Theme.Colors.Owner._400],  // #6E56CF → #8E7AD6
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )

            Text(label)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 24)
        .background(
            Color.white.opacity(0.7)
                .background(.thinMaterial)
        )
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.white.opacity(0.5), lineWidth: 1.5)
        )
        .shadow(color: .black.opacity(0.04), radius: 12, x: 0, y: 6)
    }
}

// MARK: - Preview

struct OwnerFeatureView_Previews: PreviewProvider {
    static var previews: some View {
        OwnerFeatureView()
    }
}
