//
//  OwnerDashboard View Model.swift
//  EasyCo
//
//  ViewModel for Owner Dashboard with Supabase integration
//

import Foundation
import SwiftUI

@MainActor
class OwnerDashboardViewModel: ObservableObject {
    @Published var properties: [Property] = []
    @Published var revenueData: [BarChartData] = []
    @Published var occupancyData: [DonutChartData] = []
    @Published var viewsData: [LineChartData] = []
    @Published var pendingApplications: [PropertyApplication] = []
    @Published var isLoading = false
    @Published var error: AppError?

    private let service = OwnerDashboardService()

    func loadDashboardData() async {
        isLoading = true
        error = nil

        do {
            // Get current user
            guard let user = AuthManager.shared.currentUser else {
                print("⚠️ No user logged in")
                loadMockData()
                isLoading = false
                return
            }

            // Get access token
            guard let accessToken = EasyCoKeychainManager.shared.getAuthToken() else {
                print("⚠️ No access token found")
                loadMockData()
                isLoading = false
                return
            }

            let userId = user.id.uuidString

            // MARK: - Load Owner Properties
            let propertiesResponse = try await service.fetchOwnerProperties(
                userId: userId,
                accessToken: accessToken
            )

            // Convert PropertyResponse to Property model
            properties = propertiesResponse.compactMap { propResp in
                Property(
                    id: UUID(uuidString: propResp.id) ?? UUID(),
                    ownerID: user.id,
                    title: propResp.title,
                    description: nil,
                    propertyType: .apartment,
                    address: propResp.address,
                    city: propResp.city,
                    neighborhood: nil,
                    postalCode: "",
                    country: "Belgique",
                    latitude: nil,
                    longitude: nil,
                    bedrooms: propResp.bedrooms,
                    bathrooms: propResp.bathrooms,
                    totalRooms: nil,
                    surfaceArea: Double(propResp.surfaceArea),
                    floorNumber: nil,
                    totalFloors: nil,
                    furnished: true,
                    monthlyRent: Double(truncating: propResp.monthlyRent as NSDecimalNumber),
                    charges: Double(truncating: (propResp.charges ?? 0) as NSDecimalNumber),
                    deposit: nil,
                    availableFrom: nil,
                    availableUntil: nil,
                    minimumStayMonths: 6,
                    maximumStayMonths: nil,
                    isAvailable: propResp.status == "published",
                    amenities: [],
                    smokingAllowed: false,
                    petsAllowed: false,
                    couplesAllowed: true,
                    childrenAllowed: false,
                    images: [],
                    mainImage: propResp.mainImage,
                    status: PropertyStatus(rawValue: propResp.status) ?? .draft,
                    viewsCount: propResp.viewsCount,
                    applicationsCount: propResp.applicationsCount,
                    favoritesCount: propResp.favoritesCount,
                    rating: 0,
                    reviewsCount: 0,
                    createdAt: ISO8601DateFormatter().date(from: propResp.createdAt) ?? Date(),
                    updatedAt: ISO8601DateFormatter().date(from: propResp.updatedAt) ?? Date(),
                    publishedAt: propResp.publishedAt.flatMap { ISO8601DateFormatter().date(from: $0) },
                    archivedAt: nil
                )
            }

            // MARK: - Load Pending Applications
            let applicationsResponse = try await service.fetchPendingApplications(
                userId: userId,
                accessToken: accessToken
            )

            pendingApplications = applicationsResponse.compactMap { appResp in
                guard let appliedAt = appResp.parsedCreatedAt else { return nil }
                return PropertyApplication(
                    id: appResp.id,
                    applicantName: appResp.applicantName,
                    propertyTitle: appResp.property?.title ?? "Propriété",
                    appliedAt: appliedAt,
                    score: Int.random(in: 70...95) // TODO: Calculate real score
                )
            }

            // MARK: - Load Revenue Data
            let transactions = try await service.fetchRevenueTransactions(
                userId: userId,
                accessToken: accessToken,
                months: 6
            )

            // Group transactions by month
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "MMM"
            dateFormatter.locale = Locale(identifier: "fr_FR")

            var revenueByMonth: [String: Double] = [:]
            for transaction in transactions {
                guard let createdAt = ISO8601DateFormatter().date(from: transaction.createdAt) else { continue }
                let monthLabel = dateFormatter.string(from: createdAt)
                let amount = Double(truncating: transaction.amount as NSDecimalNumber)
                revenueByMonth[monthLabel, default: 0] += amount
            }

            // Convert to BarChartData
            let sortedMonths = revenueByMonth.sorted { first, second in
                guard let date1 = dateFormatter.date(from: first.key),
                      let date2 = dateFormatter.date(from: second.key) else {
                    return false
                }
                return date1 < date2
            }

            revenueData = sortedMonths.map { month, value in
                let formattedValue = String(format: "%.1fk€", value / 1000)
                return BarChartData(label: month, value: value, formattedValue: formattedValue)
            }

            // Calculate occupancy from properties
            let totalProperties = properties.count
            let occupiedProperties = properties.filter { $0.status == .rented }.count
            let occupancyRate = totalProperties > 0 ? (Double(occupiedProperties) / Double(totalProperties)) * 100 : 0
            occupancyData = [
                DonutChartData(label: "Occupé", value: occupancyRate, color: Theme.Colors.success),
                DonutChartData(label: "Vacant", value: 100 - occupancyRate, color: Theme.Colors.error)
            ]

            // Views data - aggregate from properties
            let totalViews = properties.reduce(0) { $0 + $1.viewsCount }
            viewsData = generateMockViewsData(totalViews: totalViews)

            isLoading = false
            print("✅ Owner dashboard loaded from Supabase")

        } catch {
            print("❌ Error loading owner dashboard: \(error.localizedDescription)")
            self.error = AppError.unknown(error)
            loadMockData()
            isLoading = false
        }
    }

    private func loadMockData() {
        // Fallback to mock data
        revenueData = [
            BarChartData(label: "Jul", value: 10200, formattedValue: "10.2k€"),
            BarChartData(label: "Aoû", value: 9800, formattedValue: "9.8k€"),
            BarChartData(label: "Sep", value: 11500, formattedValue: "11.5k€"),
            BarChartData(label: "Oct", value: 10900, formattedValue: "10.9k€"),
            BarChartData(label: "Nov", value: 13650, formattedValue: "13.7k€"),
            BarChartData(label: "Déc", value: 12450, formattedValue: "12.5k€")
        ]

        occupancyData = [
            DonutChartData(label: "Occupé", value: 94, color: Theme.Colors.success),
            DonutChartData(label: "Vacant", value: 6, color: Theme.Colors.error)
        ]

        viewsData = generateMockViewsData(totalViews: 1000)
        properties = Array(Property.mockProperties.prefix(3))
        pendingApplications = []
    }

    private func generateMockViewsData(totalViews: Int) -> [LineChartData] {
        // Generate 12 data points with some variation
        var data: [LineChartData] = []
        let baseValue = Double(totalViews) / 30.0 // Average per day
        for i in 0..<12 {
            let label = "\(i * 3 + 1)"
            let variance = Double.random(in: 0.7...1.3)
            let value = baseValue * variance
            data.append(LineChartData(label: label, value: value))
        }
        return data
    }
}
