//
//  RoleSelectionView.swift
//  EasyCo
//
//  Vue de sélection du rôle utilisateur lors de l'onboarding
//

import SwiftUI

// MARK: - Role Selection View

struct RoleSelectionView: View {
    let onRoleSelected: (UserType) -> Void

    @State private var selectedRole: UserType? = nil
    @State private var showCards = false

    var body: some View {
        ZStack {
            // Background
            Color(hex: "F9FAFB")
                .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 32) {
                    // Header
                    VStack(spacing: 16) {
                        // Logo with animation
                        ZStack {
                            Circle()
                                .fill(
                                    LinearGradient(
                                        colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                                .frame(width: 80, height: 80)
                                .shadow(color: Color(hex: "FFA040").opacity(0.3), radius: 20, x: 0, y: 10)

                            Text("E")
                                .font(.system(size: 36, weight: .bold))
                                .foregroundColor(.white)
                        }
                        .padding(.top, 40)
                        .scaleEffect(showCards ? 1 : 0.5)
                        .opacity(showCards ? 1 : 0)

                        VStack(spacing: 12) {
                            Text("Bienvenue sur EasyCo !")
                                .font(.system(size: 32, weight: .bold))
                                .foregroundColor(Color(hex: "111827"))
                                .multilineTextAlignment(.center)

                            Text("Pour personnaliser votre expérience, dites-nous ce que vous recherchez")
                                .font(.system(size: 16))
                                .foregroundColor(Color(hex: "6B7280"))
                                .multilineTextAlignment(.center)
                                .padding(.horizontal, 24)
                        }
                        .opacity(showCards ? 1 : 0)
                        .offset(y: showCards ? 0 : 20)
                    }

                    // Role Cards
                    VStack(spacing: 16) {
                        // Searcher Card
                        OnboardingRoleCard(
                            role: .searcher,
                            icon: "magnifyingglass",
                            title: "Je cherche un logement",
                            subtitle: "Trouve ta colocation idéale",
                            benefits: [
                                "Parcours toutes nos propriétés",
                                "Matching intelligent avec colocataires",
                                "Postule facilement aux annonces",
                                "Rejoins des groupes de recherche"
                            ],
                            isSelected: selectedRole == .searcher
                        ) {
                            withAnimation(.spring(response: 0.3)) {
                                selectedRole = .searcher
                            }
                        }
                        .opacity(showCards ? 1 : 0)
                        .offset(x: showCards ? 0 : -50)

                        // Owner Card
                        OnboardingRoleCard(
                            role: .owner,
                            icon: "house.fill",
                            title: "Je loue mon bien",
                            subtitle: "Gère tes locations facilement",
                            benefits: [
                                "Publie tes propriétés",
                                "Gère les candidatures",
                                "Communique avec les locataires",
                                "Tableau de bord propriétaire"
                            ],
                            isSelected: selectedRole == .owner
                        ) {
                            withAnimation(.spring(response: 0.3)) {
                                selectedRole = .owner
                            }
                        }
                        .opacity(showCards ? 1 : 0)
                        .offset(x: showCards ? 0 : 50)

                        // Resident Card (new)
                        OnboardingRoleCard(
                            role: .resident,
                            icon: "person.crop.square.fill",
                            title: "Je suis colocataire",
                            subtitle: "Gère ta vie en colocation",
                            benefits: [
                                "Gère tes paiements de loyer",
                                "Communique avec tes colocataires",
                                "Organise les tâches communes",
                                "Accède au calendrier partagé"
                            ],
                            isSelected: selectedRole == .resident
                        ) {
                            withAnimation(.spring(response: 0.3)) {
                                selectedRole = .resident
                            }
                        }
                        .opacity(showCards ? 1 : 0)
                        .offset(x: showCards ? 0 : -50)
                    }
                    .padding(.horizontal, 20)

                    // CTA Button
                    if let role = selectedRole {
                        Button(action: {
                            onRoleSelected(role)
                        }) {
                            HStack(spacing: 12) {
                                Text("Continuer")
                                    .font(.system(size: 18, weight: .semibold))

                                Image(systemName: "arrow.right")
                                    .font(.system(size: 16, weight: .semibold))
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 18)
                            .background(gradientForRole(role))
                            .cornerRadius(999)
                            .shadow(
                                color: colorForRole(role).opacity(0.4),
                                radius: 12,
                                x: 0,
                                y: 6
                            )
                        }
                        .padding(.horizontal, 24)
                        .transition(.scale.combined(with: .opacity))
                    }
                }
                .padding(.bottom, 40)
            }
        }
        .onAppear {
            withAnimation(.spring(response: 0.6, dampingFraction: 0.8).delay(0.1)) {
                showCards = true
            }
        }
    }

    private func gradientForRole(_ role: UserType) -> LinearGradient {
        switch role {
        case .searcher:
            return LinearGradient(
                colors: [Color(hex: "FFA040"), Color(hex: "FFB85C")],
                startPoint: .leading,
                endPoint: .trailing
            )
        case .owner:
            return LinearGradient(
                colors: [Color(hex: "6E56CF"), Color(hex: "9B8AE3")],
                startPoint: .leading,
                endPoint: .trailing
            )
        case .resident:
            return LinearGradient(
                colors: [Color(hex: "D97B6F"), Color(hex: "E8865D"), Color(hex: "FF8C4B")],
                startPoint: .leading,
                endPoint: .trailing
            )
        }
    }

    private func colorForRole(_ role: UserType) -> Color {
        switch role {
        case .searcher: return Color(hex: "FFA040")
        case .owner: return Color(hex: "6E56CF")
        case .resident: return Color(hex: "E8865D")
        }
    }
}

// MARK: - Onboarding Role Card Component

struct OnboardingRoleCard: View {
    let role: UserType
    let icon: String
    let title: String
    let subtitle: String
    let benefits: [String]
    let isSelected: Bool
    let onTap: () -> Void

    var gradient: [Color] {
        switch role {
        case .searcher:
            return [Color(hex: "FFA040"), Color(hex: "FFB85C")]
        case .owner:
            return [Color(hex: "6E56CF"), Color(hex: "9B8AE3")]
        case .resident:
            return [Color(hex: "D97B6F"), Color(hex: "E8865D")]
        }
    }

    var roleIconColor: Color {
        switch role {
        case .searcher: return Theme.SearcherColors.primary
        case .owner: return Theme.OwnerColors.primary
        case .resident: return Theme.ResidentColors.primary
        }
    }

    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 20) {
                // Header
                HStack(spacing: 16) {
                    // Icon
                    ZStack {
                        Circle()
                            .fill(
                                LinearGradient(
                                    colors: gradient.map { $0.opacity(0.15) },
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .frame(width: 64, height: 64)

                        Image(systemName: icon)
                            .font(.system(size: 28, weight: .medium))
                            .foregroundColor(roleIconColor)
                    }

                    // Title & Subtitle
                    VStack(alignment: .leading, spacing: 4) {
                        Text(title)
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(Color(hex: "111827"))

                        Text(subtitle)
                            .font(.system(size: 14))
                            .foregroundColor(Color(hex: "6B7280"))
                    }

                    Spacer()

                    // Selection indicator
                    ZStack {
                        Circle()
                            .stroke(
                                isSelected ? gradient[0] : Color(hex: "D1D5DB"),
                                lineWidth: 2
                            )
                            .frame(width: 28, height: 28)

                        if isSelected {
                            Circle()
                                .fill(gradient[0])
                                .frame(width: 16, height: 16)
                        }
                    }
                }

                // Benefits
                VStack(alignment: .leading, spacing: 12) {
                    ForEach(benefits, id: \.self) { benefit in
                        HStack(spacing: 10) {
                            Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 16))
                                .foregroundColor(gradient[0])

                            Text(benefit)
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "374151"))
                        }
                    }
                }
            }
            .padding(24)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color.white)
            .cornerRadius(20)
            .overlay(
                RoundedRectangle(cornerRadius: 20)
                    .stroke(
                        isSelected ? gradient[0] : Color(hex: "E5E7EB"),
                        lineWidth: isSelected ? 2 : 1
                    )
            )
            .shadow(
                color: isSelected ? gradient[0].opacity(0.2) : .black.opacity(0.05),
                radius: isSelected ? 12 : 8,
                x: 0,
                y: 4
            )
            .scaleEffect(isSelected ? 1.02 : 1.0)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Preview

struct RoleSelectionView_Previews: PreviewProvider {
    static var previews: some View {
        RoleSelectionView { role in
            print("Selected role: \(role)")
        }
    }
}
