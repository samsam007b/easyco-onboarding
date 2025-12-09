//
//  ModernDesignShowcaseView.swift
//  IzzIco
//
//  Vue showcase pour visualiser le nouveau design system moderne
//  Inspiré des références Pinterest avec l'identité EasyCo préservée
//

import SwiftUI

struct ModernDesignShowcaseView: View {
    @State private var selectedRole: Theme.UserRole = .resident
    @State private var searchText = ""
    @State private var selectedSegment = 0

    var body: some View {
        ScrollView {
            VStack(spacing: 32) {
                // Header
                headerSection

                // Role Selector
                roleSelectorSection

                // Background Examples
                backgroundsSection

                // Cards Section
                cardsSection

                // Buttons Section
                buttonsSection

                // Components Grid
                componentsSection

                // Action Buttons Grid
                actionButtonsSection

                // Lists Section
                listsSection
            }
            .padding(20)
            .padding(.bottom, 40)
        }
        .background(
            // Background avec gradient selon le rôle sélectionné
            Group {
                switch selectedRole {
                case .searcher:
                    Theme.ModernBackgrounds.searcherGradient
                case .owner:
                    Theme.ModernBackgrounds.ownerGradient
                case .resident:
                    Theme.ModernBackgrounds.residentGradient
                }
            }
            .ignoresSafeArea()
        )
    }

    // MARK: - Sections

    private var headerSection: some View {
        VStack(spacing: 12) {
            Text("Modern Design System")
                .font(Theme.ModernTypography.hero(.bold))
                .foregroundColor(Theme.Colors.textPrimary)

            Text("Glassmorphism + Gradients Signature EasyCo")
                .font(Theme.ModernTypography.bodyRounded(.medium))
                .foregroundColor(Theme.Colors.textSecondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 24)
        .glassCard()
    }

    private var roleSelectorSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Sélectionnez un rôle")
                .font(Theme.ModernTypography.sectionTitle(.bold))
                .foregroundColor(Theme.Colors.textPrimary)
                .padding(.horizontal, 4)

            HStack(spacing: 12) {
                roleButton(.searcher, "Searcher", "magnifyingglass")
                roleButton(.owner, "Owner", "building.2")
                roleButton(.resident, "Resident", "person.2")
            }
        }
    }

    private func roleButton(_ role: Theme.UserRole, _ title: String, _ icon: String) -> some View {
        Button(action: {
            withAnimation(Theme.Animations.spring) {
                selectedRole = role
            }
        }) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 24, weight: .semibold))
                    .foregroundColor(selectedRole == role ? .white : role.primaryColor)

                Text(title)
                    .font(Theme.ModernTypography.captionRounded(.semibold))
                    .foregroundColor(selectedRole == role ? .white : role.primaryColor)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(
                Group {
                    if selectedRole == role {
                        RoundedRectangle(cornerRadius: 16)
                            .fill(role.gradient)
                            .shadow(color: role.primaryColor.opacity(0.4), radius: 15, x: 0, y: 8)
                    } else {
                        RoundedRectangle(cornerRadius: 16)
                            .fill(Color.white.opacity(0.6))
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(role.primaryColor.opacity(0.3), lineWidth: 1.5)
                            )
                    }
                }
            )
        }
    }

    private var backgroundsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            sectionTitle("Backgrounds Gradient")

            Text("Le background actuel utilise le gradient du rôle sélectionné avec des 'blobs' organiques flous pour créer un effet doux et moderne, similaire aux apps Pinterest.")
                .font(Theme.ModernTypography.bodyRounded(.regular))
                .foregroundColor(Theme.Colors.textSecondary)
                .padding(20)
                .glassCard()
        }
    }

    private var cardsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            sectionTitle("Cartes Glassmorphism")

            // Standard glass card
            VStack(alignment: .leading, spacing: 8) {
                Text("Standard Glass Card")
                    .font(Theme.ModernTypography.bodyRounded(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Fond blanc 75% opaque avec blur backdrop, bordure blanche semi-transparente et shadow douce.")
                    .font(Theme.ModernTypography.captionRounded(.regular))
                    .foregroundColor(Theme.Colors.textSecondary)
            }
            .padding(20)
            .glassCard()

            // Elevated glass card
            VStack(alignment: .leading, spacing: 8) {
                Text("Elevated Glass Card")
                    .font(Theme.ModernTypography.bodyRounded(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Plus opaque (85%) avec shadow plus prononcée pour un effet de surélévation.")
                    .font(Theme.ModernTypography.captionRounded(.regular))
                    .foregroundColor(Theme.Colors.textSecondary)
            }
            .padding(20)
            .glassCardElevated()

            // Tinted glass card
            VStack(alignment: .leading, spacing: 8) {
                Text("Tinted Glass Card")
                    .font(Theme.ModernTypography.bodyRounded(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Teintée avec la couleur du rôle sélectionné, bordure colorée et shadow colorée.")
                    .font(Theme.ModernTypography.captionRounded(.regular))
                    .foregroundColor(Theme.Colors.textSecondary)
            }
            .padding(20)
            .glassCardTinted(role: selectedRole)
        }
    }

    private var buttonsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            sectionTitle("Boutons")

            // Primary button
            ModernPrimaryButton(role: selectedRole, title: "Primary Button")

            // Secondary button
            ModernSecondaryButton(role: selectedRole, title: "Secondary Button")

            // Icon buttons
            HStack(spacing: 16) {
                ModernIconButton(systemName: "heart.fill", role: selectedRole)
                ModernIconButton(systemName: "message.fill", role: selectedRole)
                ModernIconButton(systemName: "star.fill", role: selectedRole)
                ModernIconButton(systemName: "bell.fill", role: selectedRole)

                Spacer()
            }
        }
    }

    private var componentsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            sectionTitle("Composants Principaux")

            // Stats Card (style Home app)
            ModernStatsCard(
                title: "Total Properties",
                value: "12",
                icon: "house.fill",
                role: selectedRole,
                subtitle: "+2 this month"
            )

            // Room Card (style Home app)
            ModernRoomCard(
                title: "Living Room",
                subtitle: "2 devices active",
                status: "80%",
                icon: "lightbulb.fill",
                role: selectedRole,
                isActive: true
            )

            // Balance Card (style finance apps)
            ModernBalanceCard(
                title: "Total Balance",
                balance: "€6,500",
                change: "+€235",
                isPositive: true,
                role: selectedRole,
                chartData: [10, 25, 18, 40, 35, 50, 45, 52, 48, 60]
            )

            // Search Bar
            ModernSearchBar(
                text: $searchText,
                placeholder: "Search properties...",
                role: selectedRole
            )

            // Segment Control
            ModernSegmentControl(
                options: ["All", "Active", "Archived"],
                selectedIndex: $selectedSegment,
                role: selectedRole
            )
        }
    }

    private var actionButtonsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            sectionTitle("Action Buttons Grid")

            LazyVGrid(columns: [
                GridItem(.flexible()),
                GridItem(.flexible())
            ], spacing: 16) {
                ModernActionButton(
                    title: "Add Expense",
                    icon: "plus.circle.fill",
                    role: selectedRole,
                    action: {}
                )

                ModernActionButton(
                    title: "Calendar",
                    icon: "calendar",
                    role: selectedRole,
                    action: {}
                )

                ModernActionButton(
                    title: "Messages",
                    icon: "message.fill",
                    role: selectedRole,
                    action: {}
                )

                ModernActionButton(
                    title: "Settings",
                    icon: "gearshape.fill",
                    role: selectedRole,
                    action: {}
                )
            }
        }
    }

    private var listsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            sectionTitle("Listes et Membres")

            // Member cards
            ModernMemberCard(
                name: "John Doe",
                role: "Roommate",
                compatibility: 92,
                userRole: selectedRole
            )

            ModernMemberCard(
                name: "Jane Smith",
                role: "Property Owner",
                compatibility: 85,
                userRole: selectedRole
            )

            ModernMemberCard(
                name: "Mike Johnson",
                role: "Tenant",
                compatibility: nil,
                userRole: selectedRole
            )
        }
    }

    // MARK: - Helpers

    private func sectionTitle(_ text: String) -> some View {
        Text(text)
            .font(Theme.ModernTypography.sectionTitle(.bold))
            .foregroundColor(Theme.Colors.textPrimary)
            .padding(.horizontal, 4)
            .padding(.top, 8)
    }
}

// MARK: - Preview

#if DEBUG
struct ModernDesignShowcaseView_Previews: PreviewProvider {
    static var previews: some View {
        ModernDesignShowcaseView()
    }
}
#endif
