//
//  DashboardViewModels.swift
//  EasyCo
//
//  ViewModels for role-based dashboards
//

import Foundation
import Combine

// MARK: - Searcher Dashboard ViewModel

@MainActor
class SearcherDashboardViewModel: ObservableObject {
    @Published var stats: SearcherDashboardData.Stats?
    @Published var activityData: [LineChartData] = []
    @Published var upcomingVisits: [Visit] = []
    @Published var recentMatches: [Match] = []
    @Published var savedSearches: [SavedSearch] = []
    @Published var applications: [ApplicationDetail] = []

    @Published var isLoading = false
    @Published var error: AppError?

    private let networkManager = NetworkManager.shared
    private var cancellables = Set<AnyCancellable>()

    // MARK: - Load Dashboard

    func loadDashboard() async {
        isLoading = true
        error = nil

        do {
            let request = GetSearcherDashboardRequest()
            let data = try await networkManager.execute(request)

            // Update stats
            stats = data.stats

            // Convert activity data to chart format
            activityData = data.activityData.map { point in
                LineChartData(label: point.label, value: point.value)
            }

            // Update lists
            upcomingVisits = data.upcomingVisits
            recentMatches = data.recentMatches
            savedSearches = data.savedSearches
            applications = data.applications

            isLoading = false

        } catch let apiError as APIError {
            error = apiError.toAppError
            isLoading = false
        } catch {
            self.error = .server
            isLoading = false
        }
    }

    func refresh() async {
        await loadDashboard()
    }
}

// MARK: - Owner Dashboard ViewModel

@MainActor
class OwnerDashboardViewModel: ObservableObject {
    @Published var selectedPeriod: TimePeriod = .month
    @Published var stats: OwnerDashboardData.Stats?
    @Published var revenueData: [BarChartData] = []
    @Published var occupancyData: [DonutChartData] = []
    @Published var viewsData: [LineChartData] = []
    @Published var properties: [OwnerProperty] = []
    @Published var pendingApplications: [PropertyApplication] = []

    @Published var isLoading = false
    @Published var error: AppError?

    private let networkManager = NetworkManager.shared
    private var cancellables = Set<AnyCancellable>()

    // MARK: - Load Dashboard

    func loadDashboard() async {
        isLoading = true
        error = nil

        do {
            let request = GetOwnerDashboardRequest(period: selectedPeriod)
            let data = try await networkManager.execute(request)

            // Update stats
            stats = data.stats

            // Convert revenue data to chart format
            revenueData = data.revenueData.map { point in
                BarChartData(label: point.label, value: point.value)
            }

            // Convert occupancy data to chart format
            occupancyData = data.occupancyData.map { point in
                DonutChartData(
                    label: point.label,
                    value: point.value,
                    color: Color(hex: point.color)
                )
            }

            // Convert views data to chart format
            viewsData = data.viewsData.map { point in
                LineChartData(label: point.label, value: point.value)
            }

            // Update lists
            properties = data.properties
            pendingApplications = data.pendingApplications

            isLoading = false

        } catch let apiError as APIError {
            error = apiError.toAppError
            isLoading = false
        } catch {
            self.error = .server
            isLoading = false
        }
    }

    func changePeriod(_ period: TimePeriod) async {
        selectedPeriod = period
        await loadDashboard()
    }

    func refresh() async {
        await loadDashboard()
    }

    // MARK: - Application Actions

    func acceptApplication(_ applicationId: String) async -> Bool {
        do {
            let request = UpdateApplicationStatusRequest(
                id: applicationId,
                status: .accepted
            )
            _ = try await networkManager.execute(request)

            // Remove from pending list
            pendingApplications.removeAll { $0.id == applicationId }

            // Play success haptic
            Haptic.notification(.success)

            return true
        } catch {
            print("Accept application error: \(error)")
            return false
        }
    }

    func rejectApplication(_ applicationId: String) async -> Bool {
        do {
            let request = UpdateApplicationStatusRequest(
                id: applicationId,
                status: .rejected
            )
            _ = try await networkManager.execute(request)

            // Remove from pending list
            pendingApplications.removeAll { $0.id == applicationId }

            // Play haptic
            Haptic.impact(.medium)

            return true
        } catch {
            print("Reject application error: \(error)")
            return false
        }
    }
}

// MARK: - Resident Dashboard ViewModel

@MainActor
class ResidentDashboardViewModel: ObservableObject {
    @Published var currentProperty: ResidentProperty?
    @Published var nextPayment: RentPayment?
    @Published var expensesData: [DonutChartData] = []
    @Published var paymentHistory: [RentPayment] = []
    @Published var maintenanceRequests: [MaintenanceRequest] = []
    @Published var documents: [Document] = []

    @Published var isLoading = false
    @Published var error: AppError?

    private let networkManager = NetworkManager.shared
    private var cancellables = Set<AnyCancellable>()

    // MARK: - Load Dashboard

    func loadDashboard() async {
        isLoading = true
        error = nil

        do {
            let request = GetResidentDashboardRequest()
            let data = try await networkManager.execute(request)

            // Update property info
            currentProperty = data.currentProperty
            nextPayment = data.nextPayment

            // Convert expenses data to chart format
            expensesData = data.expenses.map { point in
                DonutChartData(
                    label: point.label,
                    value: point.value,
                    color: Color(hex: point.color)
                )
            }

            // Update lists
            paymentHistory = data.paymentHistory
            maintenanceRequests = data.maintenanceRequests
            documents = data.documents

            isLoading = false

        } catch let apiError as APIError {
            error = apiError.toAppError
            isLoading = false
        } catch {
            self.error = .server
            isLoading = false
        }
    }

    func refresh() async {
        await loadDashboard()
    }

    // MARK: - Payment

    func payRent() async -> Bool {
        guard let payment = nextPayment else { return false }

        // TODO: Integrate payment gateway
        // For now, just simulate payment

        do {
            // API call would go here
            // let request = PayRentRequest(paymentId: payment.id)
            // _ = try await networkManager.execute(request)

            // Play success haptic
            Haptic.notification(.success)

            // Refresh dashboard
            await loadDashboard()

            return true
        } catch {
            print("Payment error: \(error)")
            return false
        }
    }
}

// MARK: - Supporting Types for Charts

struct LineChartData: Identifiable {
    let id = UUID().uuidString
    let label: String
    let value: Double
}

struct BarChartData: Identifiable {
    let id = UUID().uuidString
    let label: String
    let value: Double
}

struct DonutChartData: Identifiable {
    let id = UUID().uuidString
    let label: String
    let value: Double
    let color: Color
}
