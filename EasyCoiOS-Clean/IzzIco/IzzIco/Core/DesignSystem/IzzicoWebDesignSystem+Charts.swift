//
//  IzzicoWebDesignSystem+Charts.swift
//  IzzIco
//
//  Composants Charts pour le design system Izzico
//  Requires: Swift Charts (iOS 16+)
//  Created on 2026-01-25
//

import SwiftUI
import Charts

// MARK: - Chart Data Models

struct ChartDataPoint: Identifiable {
    let id = UUID()
    let label: String
    let value: Double
    let color: Color?

    init(label: String, value: Double, color: Color? = nil) {
        self.label = label
        self.value = value
        self.color = color
    }
}

// MARK: - Web Bar Chart

/// Bar chart web-style pour revenus mensuels, statistiques
struct WebBarChart: View {
    let data: [ChartDataPoint]
    let title: String
    var subtitle: String? = nil
    var roleColor: Color = IzzicoWeb.Colors.owner500
    var showValues: Bool = true

    var body: some View {
        VStack(alignment: .leading, spacing: IzzicoWeb.Spacing.lg) {
            // Header
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(IzzicoWeb.Typography.titleSmall(.bold))
                    .foregroundColor(IzzicoWeb.Colors.gray900)

                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(IzzicoWeb.Typography.bodySmall())
                        .foregroundColor(IzzicoWeb.Colors.gray600)
                }
            }

            // Chart
            Chart(data) { dataPoint in
                BarMark(
                    x: .value("Label", dataPoint.label),
                    y: .value("Value", dataPoint.value)
                )
                .foregroundStyle(
                    LinearGradient(
                        colors: [roleColor, roleColor.opacity(0.7)],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .cornerRadius(IzzicoWeb.Radius.small)

                if showValues {
                    RuleMark(y: .value("Value", dataPoint.value))
                        .foregroundStyle(IzzicoWeb.Colors.gray200)
                        .lineStyle(StrokeStyle(lineWidth: 1, dash: [5, 5]))
                }
            }
            .chartXAxis {
                AxisMarks(values: .automatic) { value in
                    AxisValueLabel()
                        .font(IzzicoWeb.Typography.caption())
                        .foregroundStyle(IzzicoWeb.Colors.gray600)
                }
            }
            .chartYAxis {
                AxisMarks(position: .leading) { value in
                    AxisGridLine()
                        .foregroundStyle(IzzicoWeb.Colors.gray200)
                    AxisValueLabel()
                        .font(IzzicoWeb.Typography.caption())
                        .foregroundStyle(IzzicoWeb.Colors.gray600)
                }
            }
            .frame(height: 220)
        }
        .padding(IzzicoWeb.Spacing.lg)
        .background(
            RoundedRectangle(cornerRadius: IzzicoWeb.Radius.xLarge, style: .continuous)
                .fill(IzzicoWeb.Colors.white)
        )
        .webShadow(IzzicoWeb.Shadows.soft)
    }
}

// MARK: - Web Line Chart

/// Line chart web-style pour tendances, évolution
struct WebLineChart: View {
    let data: [ChartDataPoint]
    let title: String
    var subtitle: String? = nil
    var roleColor: Color = IzzicoWeb.Colors.owner500
    var showArea: Bool = true

    var body: some View {
        VStack(alignment: .leading, spacing: IzzicoWeb.Spacing.lg) {
            // Header
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(IzzicoWeb.Typography.titleSmall(.bold))
                    .foregroundColor(IzzicoWeb.Colors.gray900)

                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(IzzicoWeb.Typography.bodySmall())
                        .foregroundColor(IzzicoWeb.Colors.gray600)
                }
            }

            // Chart
            Chart(data) { dataPoint in
                if showArea {
                    AreaMark(
                        x: .value("Label", dataPoint.label),
                        y: .value("Value", dataPoint.value)
                    )
                    .foregroundStyle(
                        LinearGradient(
                            colors: [roleColor.opacity(0.3), roleColor.opacity(0.05)],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                }

                LineMark(
                    x: .value("Label", dataPoint.label),
                    y: .value("Value", dataPoint.value)
                )
                .foregroundStyle(roleColor)
                .lineStyle(StrokeStyle(lineWidth: 3, lineCap: .round, lineJoin: .round))
                .interpolationMethod(.catmullRom)

                PointMark(
                    x: .value("Label", dataPoint.label),
                    y: .value("Value", dataPoint.value)
                )
                .foregroundStyle(roleColor)
                .symbolSize(60)
            }
            .chartXAxis {
                AxisMarks(values: .automatic) { value in
                    AxisValueLabel()
                        .font(IzzicoWeb.Typography.caption())
                        .foregroundStyle(IzzicoWeb.Colors.gray600)
                }
            }
            .chartYAxis {
                AxisMarks(position: .leading) { value in
                    AxisGridLine()
                        .foregroundStyle(IzzicoWeb.Colors.gray200)
                    AxisValueLabel()
                        .font(IzzicoWeb.Typography.caption())
                        .foregroundStyle(IzzicoWeb.Colors.gray600)
                }
            }
            .frame(height: 220)
        }
        .padding(IzzicoWeb.Spacing.lg)
        .background(
            RoundedRectangle(cornerRadius: IzzicoWeb.Radius.xLarge, style: .continuous)
                .fill(IzzicoWeb.Colors.white)
        )
        .webShadow(IzzicoWeb.Shadows.soft)
    }
}

// MARK: - Web Pie/Donut Chart

/// Pie/Donut chart web-style pour répartitions
@available(iOS 17.0, *)
struct WebPieChart: View {
    let data: [ChartDataPoint]
    let title: String
    var subtitle: String? = nil
    var innerRadiusRatio: CGFloat = 0.6 // 0 = pie, 0.6 = donut

    var total: Double {
        data.reduce(0) { $0 + $1.value }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: IzzicoWeb.Spacing.lg) {
            // Header
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(IzzicoWeb.Typography.titleSmall(.bold))
                    .foregroundColor(IzzicoWeb.Colors.gray900)

                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(IzzicoWeb.Typography.bodySmall())
                        .foregroundColor(IzzicoWeb.Colors.gray600)
                }
            }

            HStack(spacing: IzzicoWeb.Spacing.xl) {
                // Chart
                Chart(data) { dataPoint in
                    SectorMark(
                        angle: .value("Value", dataPoint.value),
                        innerRadius: .ratio(innerRadiusRatio),
                        angularInset: 2
                    )
                    .foregroundStyle(dataPoint.color ?? IzzicoWeb.Colors.gray400)
                    .cornerRadius(4)
                }
                .frame(width: 140, height: 140)
                .chartBackground { chartProxy in
                    // Center label for donut
                    if innerRadiusRatio > 0 {
                        VStack(spacing: 2) {
                            Text("€\(String(format: "%.0f", total))")
                                .font(IzzicoWeb.Typography.titleMedium(.bold))
                                .foregroundColor(IzzicoWeb.Colors.gray900)

                            Text("Total")
                                .font(IzzicoWeb.Typography.caption())
                                .foregroundColor(IzzicoWeb.Colors.gray600)
                        }
                    }
                }

                // Legend
                VStack(alignment: .leading, spacing: IzzicoWeb.Spacing.sm) {
                    ForEach(data) { dataPoint in
                        HStack(spacing: IzzicoWeb.Spacing.sm) {
                            // Color dot
                            Circle()
                                .fill(dataPoint.color ?? IzzicoWeb.Colors.gray400)
                                .frame(width: 12, height: 12)

                            // Label + value
                            VStack(alignment: .leading, spacing: 2) {
                                Text(dataPoint.label)
                                    .font(IzzicoWeb.Typography.bodySmall(.medium))
                                    .foregroundColor(IzzicoWeb.Colors.gray900)

                                Text("€\(String(format: "%.2f", dataPoint.value))")
                                    .font(IzzicoWeb.Typography.caption())
                                    .foregroundColor(IzzicoWeb.Colors.gray600)
                            }

                            Spacer()

                            // Percentage
                            Text("\(Int((dataPoint.value / total) * 100))%")
                                .font(IzzicoWeb.Typography.caption(.bold))
                                .foregroundColor(IzzicoWeb.Colors.gray700)
                        }
                    }
                }
            }
        }
        .padding(IzzicoWeb.Spacing.lg)
        .background(
            RoundedRectangle(cornerRadius: IzzicoWeb.Radius.xLarge, style: .continuous)
                .fill(IzzicoWeb.Colors.white)
        )
        .webShadow(IzzicoWeb.Shadows.soft)
    }
}

// MARK: - Preview

@available(iOS 17.0, *)
struct IzzicoWebDesignSystemCharts_Previews: PreviewProvider {
    static var previews: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Bar chart
                WebBarChart(
                    data: [
                        ChartDataPoint(label: "Jan", value: 2500),
                        ChartDataPoint(label: "Fév", value: 3200),
                        ChartDataPoint(label: "Mar", value: 2800),
                        ChartDataPoint(label: "Avr", value: 3500),
                        ChartDataPoint(label: "Mai", value: 3100),
                        ChartDataPoint(label: "Juin", value: 3750)
                    ],
                    title: "Revenus Mensuels",
                    subtitle: "6 derniers mois",
                    roleColor: IzzicoWeb.Colors.owner500
                )
                .padding(.horizontal)

                // Line chart
                WebLineChart(
                    data: [
                        ChartDataPoint(label: "Jan", value: 1200),
                        ChartDataPoint(label: "Fév", value: 1500),
                        ChartDataPoint(label: "Mar", value: 1350),
                        ChartDataPoint(label: "Avr", value: 1800),
                        ChartDataPoint(label: "Mai", value: 1650),
                        ChartDataPoint(label: "Juin", value: 1900)
                    ],
                    title: "Évolution Dépenses",
                    subtitle: "Tendance 6 mois",
                    roleColor: IzzicoWeb.Colors.resident500,
                    showArea: true
                )
                .padding(.horizontal)

                // Pie chart
                WebPieChart(
                    data: [
                        ChartDataPoint(label: "Loyer", value: 1250, color: IzzicoWeb.Colors.resident500),
                        ChartDataPoint(label: "Utilities", value: 180, color: IzzicoWeb.Colors.searcher500),
                        ChartDataPoint(label: "Maintenance", value: 320, color: IzzicoWeb.Colors.owner500),
                        ChartDataPoint(label: "Courses", value: 450, color: IzzicoWeb.Colors.sage)
                    ],
                    title: "Répartition Dépenses",
                    subtitle: "Ce mois",
                    innerRadiusRatio: 0.6
                )
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .background(IzzicoWeb.Colors.background)
    }
}
