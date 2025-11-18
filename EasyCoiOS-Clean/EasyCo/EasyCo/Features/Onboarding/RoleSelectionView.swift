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

    var body: some View {
        ZStack {
            // Background
            Color(hex: "F9FAFB")
                .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 32) {
                    // Header
                    VStack(spacing: 16) {
                        // Logo
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

                            Text("E")
                                .font(.system(size: 36, weight: .bold))
                                .foregroundColor(.white)
                        }
                        .padding(.top, 40)

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
                            .background(
                                LinearGradient(
                                    colors: role == .searcher
                                        ? [Color(hex: "FFA040"), Color(hex: "FFB85C")]
                                        : [Color(hex: "6E56CF"), Color(hex: "9B8AE3")],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(999)
                            .shadow(
                                color: (role == .searcher ? Color(hex: "FFA040") : Color(hex: "6E56CF")).opacity(0.4),
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
        role == .searcher
            ? [Color(hex: "FFA040"), Color(hex: "FFB85C")]
            : [Color(hex: "6E56CF"), Color(hex: "9B8AE3")]
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
                            .foregroundColor(role == .searcher ? Theme.SearcherColors._500 : Theme.OwnerColors._500)
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
