//
//  KPICard.swift
//  IzzIco
//
//  Key Performance Indicator card component
//  Migrated to DesignTokens v3.3 on 2026-01-22
//

import SwiftUI

struct KPICard: View {
    let title: String
    let value: String
    let subtitle: String?
    let icon: String
    let iconColor: Color
    let trend: Trend?
    let role: UserRole?

    init(
        title: String,
        value: String,
        subtitle: String? = nil,
        icon: String,
        iconColor: Color = DesignTokens.Colors.primary,
        trend: Trend? = nil,
        role: UserRole? = nil
    ) {
        self.title = title
        self.value = value
        self.subtitle = subtitle
        self.icon = icon
        self.iconColor = role?.primaryColor ?? iconColor
        self.trend = trend
        self.role = role
    }

    var body: some View {
        VStack(alignment: .leading, spacing: DesignTokens.Spacing.md) {
            // Header with icon
            HStack {
                Image.lucide(icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: DesignTokens.Size.iconLarge, height: DesignTokens.Size.iconLarge)
                    .foregroundColor(iconColor)
                    .frame(width: DesignTokens.Size.avatarMedium, height: DesignTokens.Size.avatarMedium)
                    .background(iconColor.opacity(0.1))
                    .continuousCornerRadius(DesignTokens.CornerRadius.md)

                Spacer()

                if let trend = trend {
                    trendBadge(trend)
                }
            }

            // Value
            VStack(alignment: .leading, spacing: DesignTokens.Spacing.xs) {
                Text(value)
                    .font(DesignTokens.Typography.largeTitle)
                    .foregroundColor(DesignTokens.Colors.textPrimary)

                Text(title)
                    .font(DesignTokens.Typography.body)
                    .foregroundColor(DesignTokens.Colors.textSecondary)

                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(DesignTokens.Typography.footnote)
                        .foregroundColor(DesignTokens.Colors.textTertiary)
                }
            }
        }
        .padding(DesignTokens.Spacing.lg - 4) // 20pt
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(DesignTokens.Colors.backgroundPrimary)
        .continuousCornerRadius(DesignTokens.CornerRadius.card)
        .applyShadow(DesignTokens.Shadows.level2)
    }

    @ViewBuilder
    private func trendBadge(_ trend: Trend) -> some View {
        let trendColor = trend.isPositive ? DesignTokens.Colors.success : DesignTokens.Colors.error

        HStack(spacing: DesignTokens.Spacing.xs) {
            Image.lucide(trend.isPositive ? "trending-up" : "trending-down")
                .resizable()
                .scaledToFit()
                .frame(width: 12, height: 12)

            Text(trend.formattedValue)
                .font(DesignTokens.Typography.caption)
                .fontWeight(.semibold)
        }
        .foregroundColor(trendColor)
        .padding(.horizontal, DesignTokens.Spacing.sm)
        .padding(.vertical, DesignTokens.Spacing.xs)
        .background(trendColor.opacity(0.1))
        .continuousCornerRadius(DesignTokens.CornerRadius.sm)
    }
}

// MARK: - Convenience Initializers

extension KPICard {
    /// Create a role-themed KPI card
    init(
        title: String,
        value: String,
        subtitle: String? = nil,
        icon: String,
        role: UserRole,
        trend: Trend? = nil
    ) {
        self.init(
            title: title,
            value: value,
            subtitle: subtitle,
            icon: icon,
            iconColor: role.primaryColor,
            trend: trend,
            role: role
        )
    }
}

// MARK: - Trend Model

struct Trend {
    let value: Double
    let isPositive: Bool

    var formattedValue: String {
        let sign = isPositive ? "+" : ""
        return "\(sign)\(String(format: "%.1f", abs(value)))%"
    }
}

// MARK: - Preview

struct KPICard_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: DesignTokens.Spacing.md) {
            // Role-themed cards
            KPICard(
                title: "Logements vus",
                value: "1,234",
                subtitle: "Cette semaine",
                icon: "eye",
                role: .searcher,
                trend: Trend(value: 12.5, isPositive: true)
            )

            KPICard(
                title: "Revenus mensuels",
                value: "4,850 EUR",
                subtitle: "Decembre 2025",
                icon: "euro",
                role: .owner,
                trend: Trend(value: -5.2, isPositive: false)
            )

            KPICard(
                title: "Depenses partagees",
                value: "320 EUR",
                subtitle: "Ce mois",
                icon: "receipt",
                role: .resident
            )

            // Custom color cards
            KPICard(
                title: "Nouveaux matchs",
                value: "23",
                icon: "heart",
                iconColor: DesignTokens.UIAccent.dustyRose
            )

            KPICard(
                title: "Messages",
                value: "8",
                subtitle: "Non lus",
                icon: "message-circle",
                iconColor: DesignTokens.UIAccent.sky
            )
        }
        .padding()
        .background(DesignTokens.Colors.background)
    }
}
