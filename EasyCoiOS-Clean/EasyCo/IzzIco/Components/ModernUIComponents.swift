//
//  ModernUIComponents.swift
//  IzzIco
//
//  Composants UI modernes inspirés des références Pinterest
//  (Home app, Alena, Finance apps, etc.)
//

import SwiftUI

// MARK: - Dashboard Stats Card (style Home app)

/// Carte de statistiques style "smart home" avec glassmorphism
struct ModernStatsCard: View {
    let title: String
    let value: String
    let icon: String
    let role: Theme.UserRole
    let subtitle: String?

    init(
        title: String,
        value: String,
        icon: String,
        role: Theme.UserRole,
        subtitle: String? = nil
    ) {
        self.title = title
        self.value = value
        self.icon = icon
        self.role = role
        self.subtitle = subtitle
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Icon avec background gradient
            ZStack {
                Circle()
                    .fill(role.gradient)
                    .frame(width: 48, height: 48)
                    .shadow(color: role.primaryColor.opacity(0.3), radius: 8, x: 0, y: 4)

                Image(systemName: icon)
                    .font(.system(size: 22, weight: .semibold))
                    .foregroundColor(.white)
            }

            Spacer()

            // Valeur principale
            Text(value)
                .font(Theme.ModernTypography.hero(.bold))
                .foregroundColor(Theme.Colors.textPrimary)

            // Titre
            Text(title)
                .font(Theme.ModernTypography.bodyRounded(.medium))
                .foregroundColor(Theme.Colors.textSecondary)

            // Subtitle optionnel
            if let subtitle = subtitle {
                Text(subtitle)
                    .font(Theme.ModernTypography.captionRounded(.regular))
                    .foregroundColor(role.primaryColor)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(
                        Capsule()
                            .fill(role.primaryColor.opacity(0.1))
                    )
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .frame(height: 200)
        .padding(20)
        .glassCard(cornerRadius: 24)
    }
}

// MARK: - Room/Property Card (style Home app rooms)

/// Carte de propriété/chambre style "Home app"
struct ModernRoomCard: View {
    let title: String
    let subtitle: String
    let status: String
    let icon: String
    let role: Theme.UserRole
    let isActive: Bool

    init(
        title: String,
        subtitle: String,
        status: String,
        icon: String,
        role: Theme.UserRole,
        isActive: Bool = false
    ) {
        self.title = title
        self.subtitle = subtitle
        self.status = status
        self.icon = icon
        self.role = role
        self.isActive = isActive
    }

    var body: some View {
        HStack(spacing: 16) {
            // Icon
            ZStack {
                RoundedRectangle(cornerRadius: 12)
                    .fill(isActive ? role.gradient : LinearGradient(
                        colors: [Color.gray.opacity(0.2)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ))
                    .frame(width: 56, height: 56)

                Image(systemName: icon)
                    .font(.system(size: 24, weight: .semibold))
                    .foregroundColor(isActive ? .white : .gray)
            }

            // Texte
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(Theme.ModernTypography.bodyRounded(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(subtitle)
                    .font(Theme.ModernTypography.captionRounded(.regular))
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            Spacer()

            // Status badge
            Text(status)
                .font(Theme.ModernTypography.captionRounded(.medium))
                .foregroundColor(isActive ? role.primaryColor : .gray)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(
                    Capsule()
                        .fill((isActive ? role.primaryColor : Color.gray).opacity(0.15))
                )
        }
        .padding(16)
        .glassCard(cornerRadius: 20)
    }
}

// MARK: - Balance/Finance Card (style finance apps)

/// Carte de balance financière style apps de finance modernes
struct ModernBalanceCard: View {
    let title: String
    let balance: String
    let change: String
    let isPositive: Bool
    let role: Theme.UserRole
    let chartData: [Double]

    init(
        title: String,
        balance: String,
        change: String,
        isPositive: Bool = true,
        role: Theme.UserRole,
        chartData: [Double] = []
    ) {
        self.title = title
        self.balance = balance
        self.change = change
        self.isPositive = isPositive
        self.role = role
        self.chartData = chartData.isEmpty ? [10, 25, 18, 40, 35, 50, 45] : chartData
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            // Header
            VStack(alignment: .leading, spacing: 8) {
                Text(title)
                    .font(Theme.ModernTypography.bodyRounded(.medium))
                    .foregroundColor(.white.opacity(0.9))

                HStack(alignment: .firstTextBaseline, spacing: 8) {
                    Text(balance)
                        .font(Theme.ModernTypography.hero(.bold))
                        .foregroundColor(.white)

                    Text(change)
                        .font(Theme.ModernTypography.captionRounded(.semibold))
                        .foregroundColor(isPositive ? Color(hex: "10B981") : Color(hex: "EF4444"))
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(
                            Capsule()
                                .fill((isPositive ? Color(hex: "10B981") : Color(hex: "EF4444")).opacity(0.2))
                        )
                }
            }

            // Mini chart (simple line)
            GeometryReader { geo in
                Path { path in
                    let width = geo.size.width
                    let height = geo.size.height
                    let points = chartData.count
                    let stepX = width / CGFloat(points - 1)

                    guard let firstValue = chartData.first else { return }
                    let maxValue = chartData.max() ?? 1
                    let minValue = chartData.min() ?? 0
                    let range = maxValue - minValue

                    path.move(to: CGPoint(
                        x: 0,
                        y: height - (CGFloat((firstValue - minValue) / range) * height)
                    ))

                    for (index, value) in chartData.enumerated() {
                        let x = CGFloat(index) * stepX
                        let y = height - (CGFloat((value - minValue) / range) * height)
                        path.addLine(to: CGPoint(x: x, y: y))
                    }
                }
                .stroke(Color.white.opacity(0.8), lineWidth: 3)
            }
            .frame(height: 60)
        }
        .padding(24)
        .background(
            RoundedRectangle(cornerRadius: 28)
                .fill(role.gradient)
                .shadow(color: role.primaryColor.opacity(0.4), radius: 25, x: 0, y: 12)
        )
    }
}

// MARK: - Action Button Grid (style Home app)

/// Grille de boutons d'action style "Home app"
struct ModernActionButton: View {
    let title: String
    let icon: String
    let role: Theme.UserRole
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 12) {
                // Icon
                ZStack {
                    Circle()
                        .fill(role.primaryColor.opacity(0.15))
                        .frame(width: 64, height: 64)

                    Image(systemName: icon)
                        .font(.system(size: 28, weight: .semibold))
                        .foregroundColor(role.primaryColor)
                }

                // Titre
                Text(title)
                    .font(Theme.ModernTypography.captionRounded(.medium))
                    .foregroundColor(Theme.Colors.textPrimary)
                    .multilineTextAlignment(.center)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 20)
            .glassCard(cornerRadius: 20)
        }
    }
}

// MARK: - Profile/Member Card (style social apps)

/// Carte de profil/membre style apps sociales modernes
struct ModernMemberCard: View {
    let name: String
    let role: String
    let imageUrl: String?
    let compatibility: Int?
    let userRole: Theme.UserRole

    init(
        name: String,
        role: String,
        imageUrl: String? = nil,
        compatibility: Int? = nil,
        userRole: Theme.UserRole
    ) {
        self.name = name
        self.role = role
        self.imageUrl = imageUrl
        self.compatibility = compatibility
        self.userRole = userRole
    }

    var body: some View {
        HStack(spacing: 16) {
            // Avatar
            ZStack(alignment: .bottomTrailing) {
                if let imageUrl = imageUrl {
                    // TODO: AsyncImage avec URL
                    Circle()
                        .fill(userRole.gradient)
                        .frame(width: 60, height: 60)
                } else {
                    // Placeholder avec initiales
                    Circle()
                        .fill(userRole.gradient)
                        .frame(width: 60, height: 60)
                        .overlay(
                            Text(String(name.prefix(1)))
                                .font(.system(size: 24, weight: .bold))
                                .foregroundColor(.white)
                        )
                }

                // Badge de compatibilité
                if let compatibility = compatibility {
                    Text("\(compatibility)%")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 3)
                        .background(
                            Capsule()
                                .fill(Color(hex: "10B981"))
                        )
                        .offset(x: 4, y: 4)
                }
            }

            // Info
            VStack(alignment: .leading, spacing: 4) {
                Text(name)
                    .font(Theme.ModernTypography.bodyRounded(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(role)
                    .font(Theme.ModernTypography.captionRounded(.regular))
                    .foregroundColor(Theme.Colors.textSecondary)
            }

            Spacer()

            // Chevron
            Image(systemName: "chevron.right")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(Theme.Colors.textTertiary)
        }
        .padding(16)
        .glassCard(cornerRadius: 18)
    }
}

// MARK: - Search Bar (style moderne)

/// Barre de recherche moderne avec glassmorphism
struct ModernSearchBar: View {
    @Binding var text: String
    let placeholder: String
    let role: Theme.UserRole

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 18, weight: .medium))
                .foregroundColor(Theme.Colors.textTertiary)

            TextField(placeholder, text: $text)
                .font(Theme.ModernTypography.bodyRounded(.regular))
                .foregroundColor(Theme.Colors.textPrimary)

            if !text.isEmpty {
                Button(action: { text = "" }) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 18))
                        .foregroundColor(Theme.Colors.textTertiary)
                }
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 14)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.white.opacity(0.7))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(role.primaryColor.opacity(0.2), lineWidth: 1.5)
                )
        )
        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 4)
    }
}

// MARK: - Notification Badge (style moderne)

/// Badge de notification moderne
struct ModernNotificationBadge: View {
    let count: Int
    let role: Theme.UserRole

    var body: some View {
        if count > 0 {
            Text(count > 99 ? "99+" : "\(count)")
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(.white)
                .padding(.horizontal, count > 9 ? 6 : 5)
                .padding(.vertical, 3)
                .background(
                    Capsule()
                        .fill(role.gradient)
                )
                .shadow(color: role.primaryColor.opacity(0.4), radius: 6, x: 0, y: 3)
        }
    }
}

// MARK: - Segment Control (style moderne)

/// Segment control moderne avec glassmorphism
struct ModernSegmentControl: View {
    let options: [String]
    @Binding var selectedIndex: Int
    let role: Theme.UserRole

    var body: some View {
        HStack(spacing: 8) {
            ForEach(options.indices, id: \.self) { index in
                Button(action: {
                    withAnimation(Theme.Animations.spring) {
                        selectedIndex = index
                    }
                }) {
                    Text(options[index])
                        .font(Theme.ModernTypography.bodyRounded(selectedIndex == index ? .semibold : .regular))
                        .foregroundColor(selectedIndex == index ? .white : role.primaryColor)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(
                            Group {
                                if selectedIndex == index {
                                    RoundedRectangle(cornerRadius: 12)
                                        .fill(role.gradient)
                                        .shadow(color: role.primaryColor.opacity(0.3), radius: 8, x: 0, y: 4)
                                } else {
                                    RoundedRectangle(cornerRadius: 12)
                                        .fill(Color.clear)
                                }
                            }
                        )
                }
            }
        }
        .padding(4)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(Color.white.opacity(0.7))
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .stroke(role.primaryColor.opacity(0.2), lineWidth: 1.5)
                )
        )
        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 4)
    }
}

// MARK: - Preview

#if DEBUG
struct ModernUIComponents_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 20) {
                ModernStatsCard(
                    title: "Properties",
                    value: "12",
                    icon: "house.fill",
                    role: .owner,
                    subtitle: "+2 this month"
                )

                ModernRoomCard(
                    title: "Living Room",
                    subtitle: "2 devices active",
                    status: "80%",
                    icon: "lightbulb.fill",
                    role: .resident,
                    isActive: true
                )

                ModernBalanceCard(
                    title: "Total Balance",
                    balance: "€6,500",
                    change: "+€235",
                    isPositive: true,
                    role: .resident
                )

                LazyVGrid(columns: [
                    GridItem(.flexible()),
                    GridItem(.flexible())
                ], spacing: 16) {
                    ModernActionButton(
                        title: "Add Expense",
                        icon: "plus.circle.fill",
                        role: .resident,
                        action: {}
                    )
                    ModernActionButton(
                        title: "Calendar",
                        icon: "calendar",
                        role: .resident,
                        action: {}
                    )
                }

                ModernMemberCard(
                    name: "John Doe",
                    role: "Roommate",
                    compatibility: 92,
                    userRole: .searcher
                )

                ModernSearchBar(
                    text: .constant(""),
                    placeholder: "Search properties...",
                    role: .searcher
                )

                ModernSegmentControl(
                    options: ["All", "Active", "Archived"],
                    selectedIndex: .constant(0),
                    role: .owner
                )
            }
            .padding(20)
            .background(Theme.ModernBackgrounds.brandGradient)
        }
    }
}
#endif
