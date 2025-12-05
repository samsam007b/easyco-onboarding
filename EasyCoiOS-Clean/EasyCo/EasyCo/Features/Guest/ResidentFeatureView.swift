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
        VStack(spacing: 24) {
            // Icon with glow (Resident colors)
            ZStack {
                // Glow effect
                Circle()
                    .fill(Theme.Colors.Resident.primary.opacity(0.25))  // #FF5722
                    .frame(width: 130, height: 130)
                    .blur(radius: 20)

                // Main circle with glass effect
                Circle()
                    .fill(Theme.Colors.Resident.primary.opacity(0.2))  // #FF5722
                    .background(.ultraThinMaterial)
                    .frame(width: 100, height: 100)
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

                Image(systemName: AppIcon.home.sfSymbol)
                    .font(.system(size: 48, weight: .semibold))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Theme.Colors.Resident.primary, Theme.Colors.Resident._400],  // #FF5722 → #FF6F3C
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }

            // Title Card with glass effect
            VStack(spacing: 12) {
                Text("Gérez votre colocation")
                    .font(.system(size: 32, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))
                    .multilineTextAlignment(.center)

                Text("Simplifiez la vie quotidienne avec vos colocataires")
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

    // MARK: - Features Section

    private var featuresSection: some View {
        VStack(spacing: 24) {
            Text("Pourquoi utiliser EasyCo ?")
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(Color(hex: "111827"))
                .padding(.bottom, 8)

            VStack(spacing: 16) {
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
                    Image(systemName: AppIcon.user.sfSymbol)
                        .font(.system(size: 18, weight: .semibold))
                    Text("Rejoindre une résidence")
                        .font(.system(size: 18, weight: .bold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 56)
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
                .shadow(color: Theme.Colors.Resident.primary.opacity(0.35), radius: 18, x: 0, y: 8)  // #FF5722
            }
            .padding(.horizontal, 24)

            Button(action: {
                showSignup = true
            }) {
                HStack(spacing: 12) {
                    Image(systemName: "plus.circle.fill")
                        .font(.system(size: 18, weight: .semibold))
                    Text("Inscrire ma résidence")
                        .font(.system(size: 18, weight: .semibold))
                }
                .foregroundColor(Theme.Colors.Resident.primary)  // #FF5722
                .frame(maxWidth: .infinity)
                .padding(.vertical, 18)
                .background(
                    Color.white.opacity(0.7)
                        .background(.thinMaterial)
                )
                .cornerRadius(18)
                .overlay(
                    RoundedRectangle(cornerRadius: 18)
                        .stroke(Theme.Colors.Resident.primary.opacity(0.3), lineWidth: 2)  // #FF5722
                )
            }
            .padding(.horizontal, 24)
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
        HStack(alignment: .top, spacing: 16) {
            // Icon with glass style
            ZStack {
                Circle()
                    .fill(iconColor.opacity(0.2))
                    .background(.ultraThinMaterial)
                    .frame(width: 56, height: 56)

                Image(systemName: icon)
                    .font(.system(size: 24, weight: .semibold))
                    .foregroundColor(iconColor)
            }

            // Content
            VStack(alignment: .leading, spacing: 6) {
                Text(title)
                    .font(.system(size: 17, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))

                Text(description)
                    .font(.system(size: 15))
                    .foregroundColor(Color(hex: "6B7280"))
                    .lineSpacing(4)
                    .fixedSize(horizontal: false, vertical: true)
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

// MARK: - Preview

struct ResidentFeatureView_Previews: PreviewProvider {
    static var previews: some View {
        ResidentFeatureView()
    }
}
