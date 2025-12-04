//
//  KPICard.swift
//  EasyCo
//
//  Key Performance Indicator card component
//

import SwiftUI

struct KPICard: View {
    let title: String
    let value: String
    let subtitle: String?
    let icon: String
    let iconColor: Color
    let trend: Trend?

    init(
        title: String,
        value: String,
        subtitle: String? = nil,
        icon: String,
        iconColor: Color = Theme.Colors.primary,
        trend: Trend? = nil
    ) {
        self.title = title
        self.value = value
        self.subtitle = subtitle
        self.icon = icon
        self.iconColor = iconColor
        self.trend = trend
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header with icon
            HStack {
                Image.lucide(icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 24, height: 24)
                    .foregroundColor(iconColor)
                    .frame(width: 48, height: 48)
                    .background(iconColor.opacity(0.1))
                    .cornerRadius(12)

                Spacer()

                if let trend = trend {
                    trendBadge(trend)
                }
            }

            // Value
            VStack(alignment: .leading, spacing: 4) {
                Text(value)
                    .font(.system(size: 32, weight: .bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text(title)
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)

                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(Theme.Typography.bodySmall())
                        .foregroundColor(Theme.Colors.textTertiary)
                }
            }
        }
        .padding(20)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Theme.Colors.backgroundPrimary)
        .cornerRadius(Theme.CornerRadius.card)
        .cardShadow()
    }

    @ViewBuilder
    private func trendBadge(_ trend: Trend) -> some View {
        HStack(spacing: 4) {
            Image.lucide(trend.isPositive ? "trending-up" : "trending-down")
                .resizable()
                .scaledToFit()
                .frame(width: 12, height: 12)

            Text(trend.formattedValue)
                .font(.system(size: 12, weight: .semibold))
        }
        .foregroundColor(trend.isPositive ? Theme.Colors.success : Theme.Colors.error)
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background((trend.isPositive ? Theme.Colors.success : Theme.Colors.error).opacity(0.1))
        .cornerRadius(8)
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
        VStack(spacing: 16) {
            KPICard(
                title: "Total des vues",
                value: "1,234",
                subtitle: "Cette semaine",
                icon: "eye",
                iconColor: Theme.Colors.primary,
                trend: Trend(value: 12.5, isPositive: true)
            )

            KPICard(
                title: "Revenus mensuels",
                value: "4,850€",
                subtitle: "Décembre 2025",
                icon: "euro",
                iconColor: Theme.Colors.success,
                trend: Trend(value: -5.2, isPositive: false)
            )

            KPICard(
                title: "Nouveaux matchs",
                value: "23",
                icon: "heart",
                iconColor: Theme.Colors.error
            )
        }
        .padding()
        .background(Theme.Colors.backgroundSecondary)
    }
}
