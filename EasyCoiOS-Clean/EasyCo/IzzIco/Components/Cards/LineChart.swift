//
//  LineChart.swift
//  IzzIco
//
//  Line chart component for trends over time
//

import SwiftUI

struct LineChart: View {
    let data: [LineChartData]
    let maxValue: Double?
    let lineColor: Color
    let showGradient: Bool
    let showPoints: Bool

    init(
        data: [LineChartData],
        maxValue: Double? = nil,
        lineColor: Color = Theme.Colors.primary,
        showGradient: Bool = true,
        showPoints: Bool = true
    ) {
        self.data = data
        self.maxValue = maxValue
        self.lineColor = lineColor
        self.showGradient = showGradient
        self.showPoints = showPoints
    }

    private var computedMaxValue: Double {
        maxValue ?? (data.map { $0.value }.max() ?? 1.0)
    }

    private var minValue: Double {
        data.map { $0.value }.min() ?? 0.0
    }

    var body: some View {
        VStack(spacing: 0) {
            // Chart area
            GeometryReader { geometry in
                ZStack(alignment: .bottomLeading) {
                    // Grid lines
                    gridLines(in: geometry.size)

                    // Gradient fill
                    if showGradient {
                        gradientFill(in: geometry.size)
                    }

                    // Line path
                    linePath(in: geometry.size)
                        .stroke(lineColor, style: StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round))

                    // Data points
                    if showPoints {
                        dataPoints(in: geometry.size)
                    }
                }
            }
            .frame(height: 200)
            .padding(.bottom, 12)

            // Labels
            HStack(alignment: .top, spacing: 0) {
                ForEach(Array(data.enumerated()), id: \.element.id) { index, item in
                    if shouldShowLabel(index) {
                        Text(item.label)
                            .font(Theme.Typography.bodySmall())
                            .foregroundColor(Theme.Colors.textSecondary)
                            .frame(maxWidth: .infinity)
                    }
                }
            }
        }
    }

    // MARK: - Grid Lines

    @ViewBuilder
    private func gridLines(in size: CGSize) -> some View {
        VStack(spacing: 0) {
            ForEach(0..<5) { index in
                Rectangle()
                    .fill(Theme.Colors.gray100)
                    .frame(height: 1)
                if index < 4 {
                    Spacer()
                }
            }
        }
    }

    // MARK: - Line Path

    private func linePath(in size: CGSize) -> Path {
        var path = Path()
        guard !data.isEmpty else { return path }

        let points = calculatePoints(in: size)
        path.move(to: points[0])

        for point in points.dropFirst() {
            path.addLine(to: point)
        }

        return path
    }

    // MARK: - Gradient Fill

    @ViewBuilder
    private func gradientFill(in size: CGSize) -> some View {
        var path = Path()
        guard !data.isEmpty else { return path }

        let points = calculatePoints(in: size)
        path.move(to: CGPoint(x: points[0].x, y: size.height))
        path.addLine(to: points[0])

        for point in points.dropFirst() {
            path.addLine(to: point)
        }

        path.addLine(to: CGPoint(x: points.last!.x, y: size.height))
        path.closeSubpath()

        return path
            .fill(
                LinearGradient(
                    colors: [lineColor.opacity(0.3), lineColor.opacity(0.05)],
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
    }

    // MARK: - Data Points

    @ViewBuilder
    private func dataPoints(in size: CGSize) -> some View {
        ForEach(Array(data.enumerated()), id: \.element.id) { index, item in
            let points = calculatePoints(in: size)
            Circle()
                .fill(.white)
                .frame(width: 8, height: 8)
                .overlay(
                    Circle()
                        .stroke(lineColor, lineWidth: 2)
                )
                .position(points[index])
        }
    }

    // MARK: - Calculations

    private func calculatePoints(in size: CGSize) -> [CGPoint] {
        guard !data.isEmpty else { return [] }

        let xSpacing = size.width / CGFloat(data.count - 1)
        let range = computedMaxValue - minValue

        return data.enumerated().map { index, item in
            let x = CGFloat(index) * xSpacing
            let normalizedValue = range > 0 ? (item.value - minValue) / range : 0
            let y = size.height - (CGFloat(normalizedValue) * size.height)
            return CGPoint(x: x, y: y)
        }
    }

    private func shouldShowLabel(_ index: Int) -> Bool {
        // Show labels for first, last, and every other point for readability
        return index == 0 || index == data.count - 1 || index % 2 == 0
    }
}

// MARK: - Line Chart Data Model

struct LineChartData: Identifiable {
    let id: String
    let label: String
    let value: Double

    init(id: String = UUID().uuidString, label: String, value: Double) {
        self.id = id
        self.label = label
        self.value = value
    }
}

// MARK: - Preview

struct LineChart_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 32) {
            VStack(alignment: .leading, spacing: 12) {
                Text("Évolution des vues")
                    .font(Theme.Typography.title3())

                LineChart(
                    data: [
                        LineChartData(label: "Jan", value: 45),
                        LineChartData(label: "Fév", value: 67),
                        LineChartData(label: "Mar", value: 52),
                        LineChartData(label: "Avr", value: 89),
                        LineChartData(label: "Mai", value: 73),
                        LineChartData(label: "Jun", value: 95),
                        LineChartData(label: "Jul", value: 112)
                    ],
                    lineColor: Theme.Colors.primary,
                    showGradient: true,
                    showPoints: true
                )
            }
            .padding()
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.card)
            .cardShadow()

            VStack(alignment: .leading, spacing: 12) {
                Text("Revenus mensuels")
                    .font(Theme.Typography.title3())

                LineChart(
                    data: [
                        LineChartData(label: "J", value: 4200),
                        LineChartData(label: "F", value: 3800),
                        LineChartData(label: "M", value: 5100),
                        LineChartData(label: "A", value: 4650),
                        LineChartData(label: "M", value: 5300),
                        LineChartData(label: "J", value: 4900),
                        LineChartData(label: "J", value: 6200),
                        LineChartData(label: "A", value: 5800),
                        LineChartData(label: "S", value: 6500),
                        LineChartData(label: "O", value: 5900),
                        LineChartData(label: "N", value: 6300),
                        LineChartData(label: "D", value: 6800)
                    ],
                    lineColor: Theme.Colors.success,
                    showGradient: true,
                    showPoints: false
                )
            }
            .padding()
            .background(Theme.Colors.backgroundPrimary)
            .cornerRadius(Theme.CornerRadius.card)
            .cardShadow()
        }
        .padding()
        .background(Theme.Colors.backgroundSecondary)
    }
}
