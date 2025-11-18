import SwiftUI

// MARK: - KPI Card Component

/// Modern KPI card matching web app design
struct KPICard: View {
    let metric: KPIMetric
    let action: (() -> Void)?

    init(metric: KPIMetric, action: (() -> Void)? = nil) {
        self.metric = metric
        self.action = action
    }

    var body: some View {
        Button(action: { action?() }) {
            VStack(alignment: .leading, spacing: Theme.Spacing._4) {
                // Icon and trend row
                HStack {
                    // Icon with gradient background
                    ZStack {
                        LinearGradient(
                            colors: gradientColors,
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                        .frame(width: 48, height: 48)
                        .cornerRadius(Theme.CornerRadius.xl)

                        Image(systemName: metric.icon)
                            .font(.system(size: 20, weight: .semibold))
                            .foregroundColor(.white)
                    }

                    Spacer()

                    // Trend indicator
                    if let trend = metric.trend {
                        trendBadge(trend)
                    }
                }

                Spacer()

                // Value
                Text(metric.value)
                    .font(Theme.Typography.title2(.bold))
                    .foregroundColor(Theme.Colors.textPrimary)

                // Title
                Text(metric.title)
                    .font(Theme.Typography.bodySmall(.medium))
                    .foregroundColor(Theme.Colors.textSecondary)
                    .lineLimit(1)
            }
            .padding(Theme.Spacing._5)
            .frame(height: 140)
            .background(Color.white)
            .cornerRadius(Theme.CornerRadius.xl)
            .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
        }
        .buttonStyle(KPICardButtonStyle())
    }

    // MARK: - Private Components

    private func trendBadge(_ trend: KPIMetric.Trend) -> some View {
        HStack(spacing: Theme.Spacing._1) {
            Image(systemName: trendIcon(trend.direction))
                .font(.system(size: 10, weight: .bold))

            Text(trend.value)
                .font(Theme.Typography.caption(.semibold))
        }
        .foregroundColor(trendColor(trend.direction))
        .padding(.horizontal, Theme.Spacing._2)
        .padding(.vertical, Theme.Spacing._1)
        .background(trendBackgroundColor(trend.direction))
        .cornerRadius(Theme.CornerRadius.full)
    }

    private func trendIcon(_ direction: KPIMetric.Trend.Direction) -> String {
        switch direction {
        case .up: return "arrow.up.right"
        case .down: return "arrow.down.right"
        case .neutral: return "minus"
        }
    }

    private func trendColor(_ direction: KPIMetric.Trend.Direction) -> Color {
        switch direction {
        case .up: return Color(hex: "10B981") // Green
        case .down: return Color(hex: "EF4444") // Red
        case .neutral: return Theme.GrayColors._600
        }
    }

    private func trendBackgroundColor(_ direction: KPIMetric.Trend.Direction) -> Color {
        switch direction {
        case .up: return Color(hex: "D1FAE5") // Light green
        case .down: return Color(hex: "FEE2E2") // Light red
        case .neutral: return Theme.GrayColors._100
        }
    }

    private var gradientColors: [Color] {
        switch metric.color {
        case .emerald:
            return [Color(hex: "10B981"), Color(hex: "059669")]
        case .purple:
            return [Color(hex: "8B5CF6"), Color(hex: "7C3AED")]
        case .blue:
            return [Color(hex: "3B82F6"), Color(hex: "2563EB")]
        case .yellow:
            return [Color(hex: "F59E0B"), Color(hex: "D97706")]
        case .orange:
            return [Color(hex: "FFA040"), Color(hex: "FF8C4B")]
        case .red:
            return [Color(hex: "EF4444"), Color(hex: "DC2626")]
        }
    }
}

// MARK: - Button Style

private struct KPICardButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
            .animation(Theme.Animations.base, value: configuration.isPressed)
    }
}

// MARK: - Compact KPI Card

/// Smaller KPI card for grid layouts
struct CompactKPICard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._3) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(color)

                Spacer()
            }

            Spacer()

            Text(value)
                .font(Theme.Typography.title3(.bold))
                .foregroundColor(Theme.Colors.textPrimary)

            Text(title)
                .font(Theme.Typography.caption(.medium))
                .foregroundColor(Theme.Colors.textSecondary)
                .lineLimit(1)
        }
        .padding(Theme.Spacing._4)
        .frame(height: 100)
        .background(Color.white)
        .cornerRadius(Theme.CornerRadius.lg)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Preview

struct KPICard_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: Theme.Spacing._4) {
            // With positive trend
            KPICard(
                metric: KPIMetric(
                    id: "revenue",
                    title: "Revenu mensuel",
                    value: "€4,200",
                    trend: KPIMetric.Trend(value: "+12%", direction: .up),
                    icon: "dollarsign.circle.fill",
                    color: .emerald
                )
            )

            // With negative trend
            KPICard(
                metric: KPIMetric(
                    id: "applications",
                    title: "Applications",
                    value: "12",
                    trend: KPIMetric.Trend(value: "-5%", direction: .down),
                    icon: "person.2.fill",
                    color: .purple
                )
            )

            // Without trend
            KPICard(
                metric: KPIMetric(
                    id: "properties",
                    title: "Propriétés",
                    value: "3",
                    trend: nil,
                    icon: "building.2.fill",
                    color: .blue
                )
            )

            // Compact version
            HStack(spacing: Theme.Spacing._3) {
                CompactKPICard(
                    title: "Messages",
                    value: "24",
                    icon: "envelope.fill",
                    color: Theme.ResidentColors._600
                )

                CompactKPICard(
                    title: "Favoris",
                    value: "12",
                    icon: "heart.fill",
                    color: Color(hex: "EF4444")
                )
            }
        }
        .padding()
        .background(Theme.Colors.backgroundSecondary)
    }
}
