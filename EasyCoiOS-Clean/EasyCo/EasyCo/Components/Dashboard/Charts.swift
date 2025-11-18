import SwiftUI
import Charts

// MARK: - Line Chart Component

/// Line chart for displaying trends over time
@available(iOS 16.0, *)
struct TrendLineChart: View {
    let title: String
    let data: [ChartDataPoint]
    let showSecondary: Bool

    init(title: String, data: [ChartDataPoint], showSecondary: Bool = false) {
        self.title = title
        self.data = data
        self.showSecondary = showSecondary
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._4) {
            // Title
            Text(title)
                .font(Theme.Typography.body(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            // Chart
            Chart {
                ForEach(data) { point in
                    // Primary line
                    LineMark(
                        x: .value("Mois", point.label),
                        y: .value("Valeur", point.value)
                    )
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Theme.ResidentColors._500, Theme.ResidentColors._700],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                    .lineStyle(StrokeStyle(lineWidth: 3, lineCap: .round))
                    .interpolationMethod(.catmullRom)

                    // Area fill
                    AreaMark(
                        x: .value("Mois", point.label),
                        y: .value("Valeur", point.value)
                    )
                    .foregroundStyle(
                        LinearGradient(
                            colors: [
                                Theme.ResidentColors._200.opacity(0.3),
                                Theme.ResidentColors._100.opacity(0.1)
                            ],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                    .interpolationMethod(.catmullRom)

                    // Secondary line (if provided)
                    if showSecondary, let secondaryValue = point.secondaryValue {
                        LineMark(
                            x: .value("Mois", point.label),
                            y: .value("Secondaire", secondaryValue)
                        )
                        .foregroundStyle(Color(hex: "10B981"))
                        .lineStyle(StrokeStyle(lineWidth: 2, lineCap: .round, dash: [5, 5]))
                        .interpolationMethod(.catmullRom)
                    }
                }
            }
            .frame(height: 200)
            .chartXAxis {
                AxisMarks(values: .automatic) { value in
                    AxisGridLine()
                    AxisValueLabel()
                        .font(.system(size: 10))
                        .foregroundStyle(Theme.Colors.textSecondary)
                }
            }
            .chartYAxis {
                AxisMarks { value in
                    AxisGridLine()
                    AxisValueLabel()
                        .font(.system(size: 10))
                        .foregroundStyle(Theme.Colors.textSecondary)
                }
            }
        }
        .padding(Theme.Spacing._5)
        .background(Color.white)
        .cornerRadius(Theme.CornerRadius.xl)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
    }
}

// MARK: - Bar Chart Component

/// Bar chart for comparing values
@available(iOS 16.0, *)
struct ComparisonBarChart: View {
    let title: String
    let data: [ChartDataPoint]
    let color: Color

    init(title: String, data: [ChartDataPoint], color: Color = Theme.ResidentColors._600) {
        self.title = title
        self.data = data
        self.color = color
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._4) {
            // Title
            Text(title)
                .font(Theme.Typography.body(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)

            // Chart
            Chart(data) { point in
                BarMark(
                    x: .value("Label", point.label),
                    y: .value("Valeur", point.value)
                )
                .foregroundStyle(
                    LinearGradient(
                        colors: [color.opacity(0.8), color],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .cornerRadius(Theme.CornerRadius.md)
            }
            .frame(height: 200)
            .chartXAxis {
                AxisMarks(values: .automatic) { value in
                    AxisValueLabel()
                        .font(.system(size: 10))
                        .foregroundStyle(Theme.Colors.textSecondary)
                }
            }
            .chartYAxis {
                AxisMarks { value in
                    AxisGridLine()
                    AxisValueLabel()
                        .font(.system(size: 10))
                        .foregroundStyle(Theme.Colors.textSecondary)
                }
            }
        }
        .padding(Theme.Spacing._5)
        .background(Color.white)
        .cornerRadius(Theme.CornerRadius.xl)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
    }
}

// MARK: - Progress Ring Component

/// Circular progress indicator for percentages
struct ProgressRing: View {
    let progress: Double // 0.0 to 1.0
    let title: String
    let subtitle: String
    let color: Color

    var body: some View {
        VStack(spacing: Theme.Spacing._4) {
            ZStack {
                // Background circle
                Circle()
                    .stroke(color.opacity(0.2), lineWidth: 12)

                // Progress circle
                Circle()
                    .trim(from: 0, to: progress)
                    .stroke(
                        color,
                        style: StrokeStyle(lineWidth: 12, lineCap: .round)
                    )
                    .rotationEffect(.degrees(-90))
                    .animation(Theme.Animations.spring, value: progress)

                // Percentage text
                VStack(spacing: Theme.Spacing._1) {
                    Text("\(Int(progress * 100))%")
                        .font(Theme.Typography.title2(.bold))
                        .foregroundColor(Theme.Colors.textPrimary)

                    Text(subtitle)
                        .font(Theme.Typography.caption())
                        .foregroundColor(Theme.Colors.textSecondary)
                }
            }
            .frame(width: 120, height: 120)

            Text(title)
                .font(Theme.Typography.bodySmall(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)
                .multilineTextAlignment(.center)
        }
        .padding(Theme.Spacing._5)
        .background(Color.white)
        .cornerRadius(Theme.CornerRadius.xl)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
    }
}

// MARK: - Simple Bar Chart (iOS 15 compatible)

/// Simple horizontal bar chart without Charts framework
struct SimpleBarChart: View {
    let data: [ChartDataPoint]
    let color: Color

    var body: some View {
        VStack(spacing: Theme.Spacing._3) {
            ForEach(data) { point in
                HStack(spacing: Theme.Spacing._3) {
                    // Label
                    Text(point.label)
                        .font(Theme.Typography.caption(.medium))
                        .foregroundColor(Theme.Colors.textSecondary)
                        .frame(width: 80, alignment: .leading)

                    // Bar
                    GeometryReader { geometry in
                        ZStack(alignment: .leading) {
                            // Background
                            RoundedRectangle(cornerRadius: Theme.CornerRadius.sm)
                                .fill(color.opacity(0.2))

                            // Filled portion
                            RoundedRectangle(cornerRadius: Theme.CornerRadius.sm)
                                .fill(
                                    LinearGradient(
                                        colors: [color.opacity(0.8), color],
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                )
                                .frame(width: geometry.size.width * CGFloat(point.value / maxValue))
                        }
                    }
                    .frame(height: 24)

                    // Value
                    Text(String(format: "%.0f%%", point.value))
                        .font(Theme.Typography.caption(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                        .frame(width: 50, alignment: .trailing)
                }
            }
        }
    }

    private var maxValue: Double {
        data.map(\.value).max() ?? 100
    }
}

// MARK: - Preview

struct Charts_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: Theme.Spacing._4) {
                if #available(iOS 16.0, *) {
                    // Line Chart
                    TrendLineChart(
                        title: "Revenu & Dépenses",
                        data: MonthlyRevenue.mockData.map { revenue in
                            ChartDataPoint(
                                id: revenue.month,
                                label: revenue.month,
                                value: revenue.revenue,
                                secondaryValue: revenue.expenses
                            )
                        },
                        showSecondary: true
                    )

                    // Bar Chart
                    ComparisonBarChart(
                        title: "Occupation par propriété",
                        data: PropertyOccupation.mockData.map { occupation in
                            ChartDataPoint(
                                id: occupation.id.uuidString,
                                label: String(occupation.propertyName.prefix(10)),
                                value: occupation.occupation,
                                secondaryValue: nil
                            )
                        },
                        color: Theme.OwnerColors._600
                    )
                }

                // Progress Ring
                ProgressRing(
                    progress: 0.85,
                    title: "Taux d'occupation",
                    subtitle: "Occupation",
                    color: Theme.ResidentColors._600
                )

                // Simple Bar Chart
                VStack(alignment: .leading, spacing: Theme.Spacing._3) {
                    Text("Occupation par propriété")
                        .font(Theme.Typography.body(.semibold))

                    SimpleBarChart(
                        data: [
                            ChartDataPoint(id: "1", label: "Appart 1", value: 100, secondaryValue: nil),
                            ChartDataPoint(id: "2", label: "Appart 2", value: 75, secondaryValue: nil),
                            ChartDataPoint(id: "3", label: "Studio", value: 0, secondaryValue: nil),
                        ],
                        color: Theme.OwnerColors._600
                    )
                }
                .padding()
                .background(Color.white)
                .cornerRadius(Theme.CornerRadius.xl)
            }
            .padding()
        }
        .background(Theme.Colors.backgroundSecondary)
    }
}
