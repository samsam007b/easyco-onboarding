import SwiftUI

// MARK: - Resident Feature View (Guest Mode - Glassmorphism Style)

struct ResidentFeatureView: View {
    @State private var showSignup = false

    var body: some View {
        ZStack {
            // Background gradient (Resident colors)
            LinearGradient(
                colors: [
                    Theme.Colors.Resident.primary.opacity(0.12),  // #FF5722
                    Theme.Colors.Resident._400.opacity(0.10),      // #FF6F3C
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

                    // Features Section
                    featuresSection
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
            // Icon with glow (Resident colors)
            ZStack {
                // Glow effect
                Circle()
                    .fill(Theme.Colors.Resident.primary.opacity(0.3))  // #FF5722
                    .frame(width: 140, height: 140)
                    .blur(radius: 24)

                // Main circle with glass effect
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [
                                Theme.Colors.Resident.primary.opacity(0.15),
                                Theme.Colors.Resident._400.opacity(0.1)
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
                                    colors: [Theme.Colors.Resident.primary, Theme.Colors.Resident._400],  // #FF5722 → #FF6F3C
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                ),
                                lineWidth: 3
                            )
                    )
                    .shadow(color: Theme.Colors.Resident.primary.opacity(0.2), radius: 16, x: 0, y: 8)

                Image(systemName: AppIcon.home.sfSymbol)
                    .font(.system(size: 56, weight: .semibold))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Theme.Colors.Resident.primary, Theme.Colors.Resident._400],  // #FF5722 → #FF6F3C
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }
            .padding(.top, 40)

            // Title Card with glass effect
            VStack(spacing: 16) {
                Text("Gérez votre colocation")
                    .font(.system(size: 34, weight: .heavy))
                    .foregroundColor(Color(hex: "111827"))
                    .multilineTextAlignment(.center)

                Text("Simplifiez la vie quotidienne avec vos colocataires")
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
                                Theme.Colors.Resident.primary.opacity(0.2)
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

    // MARK: - Features Section

    private var featuresSection: some View {
        VStack(spacing: 28) {
            Text("Pourquoi utiliser EasyCo ?")
                .font(.system(size: 28, weight: .heavy))
                .foregroundColor(Color(hex: "111827"))
                .padding(.bottom, 4)

            VStack(spacing: 14) {
                FeatureCard(
                    icon: AppIcon.checkList.sfSymbol,
                    iconColor: Color(hex: "F59E0B"),
                    title: "Gestion des tâches",
                    description: "Répartissez équitablement les tâches ménagères et suivez leur progression"
                )

                FeatureCard(
                    icon: AppIcon.euro.sfSymbol,
                    iconColor: Color(hex: "10B981"),
                    title: "Suivi des dépenses",
                    description: "Partagez les dépenses communes et gardez une trace de tout"
                )

                FeatureCard(
                    icon: AppIcon.calendar.sfSymbol,
                    iconColor: Color(hex: "8B5CF6"),
                    title: "Événements partagés",
                    description: "Organisez des activités et coordonnez les plannings"
                )

                FeatureCard(
                    icon: AppIcon.message.sfSymbol,
                    iconColor: Color(hex: "3B82F6"),
                    title: "Communication facile",
                    description: "Discutez avec vos colocataires et contactez votre propriétaire"
                )
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
                    Image(systemName: AppIcon.user.sfSymbol)
                        .font(.system(size: 20, weight: .semibold))
                    Text("Rejoindre une résidence")
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
                .shadow(color: Theme.Colors.Resident.primary.opacity(0.4), radius: 20, x: 0, y: 10)  // #FF5722
            }
            .padding(.horizontal, 20)

            Button(action: {
                showSignup = true
            }) {
                HStack(spacing: 14) {
                    Image(systemName: "plus.circle.fill")
                        .font(.system(size: 20, weight: .semibold))
                    Text("Inscrire ma résidence")
                        .font(.system(size: 19, weight: .semibold))
                }
                .foregroundColor(Theme.Colors.Resident.primary)  // #FF5722
                .frame(maxWidth: .infinity)
                .padding(.vertical, 20)
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
                                    Theme.Colors.Resident.primary.opacity(0.2)
                                ],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ),
                            lineWidth: 2
                        )
                )
                .shadow(color: .black.opacity(0.06), radius: 14, x: 0, y: 7)
            }
            .padding(.horizontal, 20)
        }
    }
}

// MARK: - Feature Card Component

struct FeatureCard: View {
    let icon: String
    var iconColor: Color = Theme.Colors.Resident.primary  // #FF5722
    let title: String
    let description: String

    var body: some View {
        HStack(alignment: .top, spacing: 18) {
            // Icon with glass style
            ZStack {
                // Subtle glow
                Circle()
                    .fill(iconColor.opacity(0.15))
                    .frame(width: 64, height: 64)
                    .blur(radius: 8)

                Circle()
                    .fill(iconColor.opacity(0.2))
                    .background(.ultraThinMaterial)
                    .frame(width: 60, height: 60)
                    .overlay(
                        Circle()
                            .stroke(iconColor.opacity(0.3), lineWidth: 2)
                    )

                Image(systemName: icon)
                    .font(.system(size: 26, weight: .semibold))
                    .foregroundColor(iconColor)
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
                            iconColor.opacity(0.15)
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

struct ResidentFeatureView_Previews: PreviewProvider {
    static var previews: some View {
        ResidentFeatureView()
    }
}
