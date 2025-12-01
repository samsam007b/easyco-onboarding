import SwiftUI

// MARK: - Owner Feature View (Guest Mode)

struct OwnerFeatureView: View {
    @State private var showSignup = false

    var body: some View {
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
        .background(Color(hex: "F9FAFB"))
        .sheet(isPresented: $showSignup) {
            WelcomeSheet(
                isPresented: $showSignup,
                onCreateAccount: {
                    showSignup = false
                },
                onContinueAsGuest: {
                    showSignup = false
                }
            )
        }
    }

    // MARK: - Hero Section

    private var heroSection: some View {
        ZStack {
            // Gradient Background
            LinearGradient(
                colors: [
                    Color(hex: "6E56CF").opacity(0.15),
                    Color(hex: "9B8AE3").opacity(0.12),
                    Color(hex: "B8A9E8").opacity(0.15)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            VStack(spacing: 24) {
                // Icon
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [Color(hex: "6E56CF"), Color(hex: "9B8AE3")],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 100, height: 100)

                    Image(systemName: "building.2.fill")
                        .font(.system(size: 48))
                        .foregroundColor(.white)
                }

                // Title
                VStack(spacing: 12) {
                    Text("Louez votre propriété")
                        .font(.system(size: 32, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))
                        .multilineTextAlignment(.center)

                    Text("Trouvez les colocataires parfaits pour votre bien")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "6B7280"))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 32)
                }
            }
            .padding(.vertical, 60)
        }
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

    // MARK: - CTA Section

    private var ctaSection: some View {
        VStack(spacing: 16) {
            Button(action: {
                showSignup = true
            }) {
                HStack(spacing: 12) {
                    Image(systemName: "plus.circle.fill")
                        .font(.system(size: 18, weight: .semibold))
                    Text("Publier ma propriété")
                        .font(.system(size: 18, weight: .semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 18)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "6E56CF"), Color(hex: "9B8AE3")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(999)
                .shadow(color: Color(hex: "6E56CF").opacity(0.4), radius: 12, x: 0, y: 6)
            }
            .padding(.horizontal, 24)

            Text("C'est gratuit et sans engagement")
                .font(.system(size: 14))
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
            // Icon
            ZStack {
                Circle()
                    .fill(Color(hex: "6E56CF").opacity(0.1))
                    .frame(width: 56, height: 56)

                Image(systemName: icon)
                    .font(.system(size: 24))
                    .foregroundColor(Color(hex: "6E56CF"))
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
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
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
                .foregroundColor(Color(hex: "6E56CF"))

            Text(label)
                .font(.system(size: 14))
                .foregroundColor(Color(hex: "6B7280"))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 24)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
    }
}

// MARK: - Preview

struct OwnerFeatureView_Previews: PreviewProvider {
    static var previews: some View {
        OwnerFeatureView()
    }
}
