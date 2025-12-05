//
//  DashboardViewModels.swift
//  EasyCo
//
//  ViewModels for role-based dashboards
//

import Foundation
import Combine
import SwiftUI

// MARK: - Searcher Dashboard ViewModel

@MainActor
// class SearcherDashboardViewModel: ObservableObject {
//     @Published var stats: SearcherDashboardData.Stats?
//     @Published var activityData: [LineChartData] = []
//     @Published var upcomingVisits: [Visit] = []
//     @Published var recentMatches: [Match] = []
//     @Published var savedSearches: [SavedSearch] = []
//     @Published var applications: [ApplicationDetail] = []
// 
//     @Published var isLoading = false
//     @Published var error: AppError?
// 
//     private let networkManager = NetworkManager.shared
//     private var cancellables = Set<AnyCancellable>()
// 
    // MARK: - Load Dashboard
// 
//     func loadDashboard() async {
//         isLoading = true
//         error = nil
// 
//         do {
//             let request = GetSearcherDashboardRequest()
//             let data = try await networkManager.execute(request)
// 
            // Update stats
//             stats = data.stats
// 
            // Convert activity data to chart format
//             activityData = data.activityData.map { point in
//                 LineChartData(label: point.label, value: point.value)
//             }
// 
            // Update lists
//             upcomingVisits = data.upcomingVisits
//             recentMatches = data.recentMatches
//             savedSearches = data.savedSearches
//             applications = data.applications
// 
//             isLoading = false
// 
//         } catch let apiError as APIError {
//             error = apiError.toAppError
//             isLoading = false
//         } catch {
//             self.error = .server
//             isLoading = false
//         }
//     }
// 
//     func refresh() async {
//         await loadDashboard()
//     }
// }

// MARK: - Owner Dashboard ViewModel

class OwnerDashboardViewModel: ObservableObject {
    @Published var selectedPeriod: TimePeriod = .month
    @Published var stats: OwnerDashboardData?
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

        // TODO: Implement API integration
        // do {
        //     let request = GetOwnerDashboardRequest(period: selectedPeriod)
        //     let data = try await networkManager.execute(request)
        //
        //     // Update stats
        //     stats = data.stats
        //
        //     // Convert revenue data to chart format
        //     revenueData = data.revenueData.map { point in
        //         BarChartData(label: point.label, value: point.value)
        //     }
        //
        //     // Convert occupancy data to chart format
        //     occupancyData = data.occupancyData.map { point in
        //         DonutChartData(
        //             label: point.label,
        //             value: point.value,
        //             color: Color(hex: point.color)
        //         )
        //     }
        //
        //     // Convert views data to chart format
        //     viewsData = data.viewsData.map { point in
        //         LineChartData(label: point.label, value: point.value)
        //     }
        //
        //     // Update lists
        //     properties = data.properties
        //     pendingApplications = data.pendingApplications
        //
        //     isLoading = false
        //
        // } catch let apiError as APIError {
        //     error = apiError.toAppError
        //     isLoading = false
        // } catch {
        //     self.error = AppError.unknown(error)
        //     isLoading = false
        // }

        isLoading = false
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
        // TODO: Implement API integration
        // do {
        //     let request = UpdateApplicationStatusRequest(
        //         id: applicationId,
        //         status: .accepted
        //     )
        //     _ = try await networkManager.execute(request)
        //
        //     // Remove from pending list
        //     pendingApplications.removeAll { $0.id == applicationId }
        //
        //     // Play success haptic
        //     Haptic.notification(.success)
        //
        //     return true
        // } catch {
        //     print("Accept application error: \(error)")
        //     return false
        // }

        // Remove from pending list
        pendingApplications.removeAll { $0.id == applicationId }

        // Play success haptic
        Haptic.notification(.success)

        return true
    }

    func rejectApplication(_ applicationId: String) async -> Bool {
        // TODO: Implement API integration
        // do {
        //     let request = UpdateApplicationStatusRequest(
        //         id: applicationId,
        //         status: .rejected
        //     )
        //     _ = try await networkManager.execute(request)
        //
        //     // Remove from pending list
        //     pendingApplications.removeAll { $0.id == applicationId }
        //
        //     // Play haptic
        //     Haptic.impact(.medium)
        //
        //     return true
        // } catch {
        //     print("Reject application error: \(error)")
        //     return false
        // }

        // Remove from pending list
        pendingApplications.removeAll { $0.id == applicationId }

        // Play haptic
        Haptic.impact(.medium)

        return true
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
            // Get current user
            guard let user = AuthManager.shared.currentUser else {
                throw AppError.authentication("Aucune session active")
            }

            // Get access token from keychain
            guard let accessToken = EasyCoKeychainManager.shared.getAuthToken() else {
                throw AppError.authentication("Token d'authentification manquant")
            }

            let userId = user.id.uuidString
            print("🔍 Loading dashboard for user: \(userId)")

            // Initialize service
            let service = ResidentDashboardService()

            let calendar = Calendar.current
            let now = Date()

            // MARK: - Load Property Membership & Details from Supabase
            do {
                let propertyMember = try await service.fetchPropertyMembership(
                    userId: userId,
                    accessToken: accessToken
                )

                if let member = propertyMember {
                    // Load full property details
                    if let property = try await service.fetchPropertyDetails(
                        propertyId: member.propertyId,
                        accessToken: accessToken
                    ) {
                        currentProperty = ResidentProperty(
                            id: property.id,
                            title: property.title,
                            location: "\(property.address), \(property.city)",
                            bedrooms: property.bedrooms,
                            bathrooms: property.bathrooms,
                            area: property.surfaceArea,
                            monthlyRent: Int(truncating: property.monthlyRent as NSDecimalNumber),
                            leaseStart: member.parsedMoveInDate ?? Date(),
                            leaseEnd: member.parsedMoveOutDate ?? Date().addingTimeInterval(365 * 24 * 60 * 60),
                            imageURL: property.mainImage ?? "https://via.placeholder.com/600x400/FFB6C1"
                        )
                        print("✅ Property loaded from Supabase: \(property.title)")
                    }
                }
            } catch {
                print("⚠️ Could not load property from Supabase, using mock data: \(error.localizedDescription)")
                // Fallback to mock data if Supabase fails
                currentProperty = ResidentProperty(
                    id: "1",
                    title: "Appartement 2 chambres - Ixelles",
                    location: "Rue de la Paix 42, 1050 Ixelles",
                    bedrooms: 2,
                    bathrooms: 1,
                    area: 75,
                    monthlyRent: 950,
                    leaseStart: calendar.date(byAdding: .year, value: -1, to: now)!,
                    leaseEnd: calendar.date(byAdding: .year, value: 2, to: now)!,
                    imageURL: "https://via.placeholder.com/600x400/FFB6C1"
                )
            }

            // MARK: - Load Transactions (Payment History) from Supabase
            do {
                let transactions = try await service.fetchTransactions(
                    userId: userId,
                    accessToken: accessToken,
                    limit: 10
                )

                // Map transactions to RentPayment
                paymentHistory = transactions
                    .filter { $0.transactionType == "rent_payment" }
                    .compactMap { tx in
                        guard let dueDate = tx.parsedDueDate else { return nil }

                        return RentPayment(
                            id: tx.id,
                            amount: Int(truncating: tx.amount as NSDecimalNumber),
                            dueDate: dueDate,
                            status: mapTransactionStatus(tx.status),
                            paidDate: tx.parsedPaidAt
                        )
                    }

                if !paymentHistory.isEmpty {
                    print("✅ Loaded \(paymentHistory.count) payments from Supabase")
                }
            } catch {
                print("⚠️ Could not load transactions from Supabase, using mock data: \(error.localizedDescription)")
            }

            // MARK: - Load Payment Schedules (Next Payment) from Supabase
            do {
                let schedules = try await service.fetchPaymentSchedules(
                    userId: userId,
                    accessToken: accessToken
                )

                // Get next rent payment
                if let nextSchedule = schedules.first(where: { $0.paymentType == "rent" }),
                   let nextDate = nextSchedule.parsedNextPaymentDate {
                    nextPayment = RentPayment(
                        id: "next",
                        amount: Int(truncating: nextSchedule.amount as NSDecimalNumber),
                        dueDate: nextDate,
                        status: .pending
                    )
                    print("✅ Next payment loaded from Supabase: \(nextDate)")
                }
            } catch {
                print("⚠️ Could not load payment schedule from Supabase, using mock data: \(error.localizedDescription)")
            }

            // Fallback: If no payment history from Supabase, use mock data
            if paymentHistory.isEmpty {
                paymentHistory = [
                    RentPayment(
                        id: "1",
                        amount: 950,
                        dueDate: calendar.date(byAdding: .month, value: -1, to: now)!,
                        status: .paid,
                        paidDate: calendar.date(byAdding: .month, value: -1, to: now)!
                    ),
                    RentPayment(
                        id: "2",
                        amount: 950,
                        dueDate: calendar.date(byAdding: .month, value: -2, to: now)!,
                        status: .paid,
                        paidDate: calendar.date(byAdding: .month, value: -2, to: now)!
                    ),
                    RentPayment(
                        id: "3",
                        amount: 950,
                        dueDate: calendar.date(byAdding: .month, value: -3, to: now)!,
                        status: .paid,
                        paidDate: calendar.date(byAdding: .month, value: -3, to: now)!
                    ),
                    RentPayment(
                        id: "4",
                        amount: 950,
                        dueDate: calendar.date(byAdding: .month, value: -4, to: now)!,
                        status: .paid,
                        paidDate: calendar.date(byAdding: .month, value: -4, to: now)!
                    )
                ]
            }

            // Fallback: If no next payment from Supabase, use mock data
            if nextPayment == nil {
                nextPayment = RentPayment(
                    id: "next",
                    amount: 950,
                    dueDate: calendar.date(byAdding: .day, value: 5, to: now)!,
                    status: .pending
                )
            }

            // Load expenses data
            expensesData = [
                DonutChartData(
                    label: "Loyer",
                    value: 950,
                    color: Theme.Colors.Resident.primary
                ),
                DonutChartData(
                    label: "Charges",
                    value: 150,
                    color: Theme.Colors.Resident._300
                ),
                DonutChartData(
                    label: "Internet",
                    value: 40,
                    color: Theme.Colors.Resident._400
                ),
                DonutChartData(
                    label: "Électricité",
                    value: 80,
                    color: Theme.Colors.Resident._600
                )
            ]

            // Load maintenance requests
            maintenanceRequests = [
                MaintenanceRequest(
                    id: "1",
                    title: "Fuite d'eau dans la cuisine",
                    description: "Le robinet goutte depuis 2 jours",
                    status: .inProgress,
                    createdAt: calendar.date(byAdding: .day, value: -3, to: now)!,
                    priority: .high
                ),
                MaintenanceRequest(
                    id: "2",
                    title: "Ampoule grillée dans le salon",
                    description: "L'ampoule du plafonnier ne fonctionne plus",
                    status: .pending,
                    createdAt: calendar.date(byAdding: .day, value: -1, to: now)!,
                    priority: .low
                )
            ]

            // Load documents
            documents = [
                Document(
                    id: "1",
                    title: "Contrat de location",
                    type: .contract,
                    uploadedAt: calendar.date(byAdding: .year, value: -1, to: now)!,
                    size: "2.4 MB"
                ),
                Document(
                    id: "2",
                    title: "État des lieux d'entrée",
                    type: .inventory,
                    uploadedAt: calendar.date(byAdding: .year, value: -1, to: now)!,
                    size: "5.1 MB"
                ),
                Document(
                    id: "3",
                    title: "Quittance Novembre 2025",
                    type: .receipt,
                    uploadedAt: calendar.date(byAdding: .month, value: -1, to: now)!,
                    size: "245 KB"
                )
            ]

            isLoading = false

            print("✅ Dashboard data loaded successfully")

        } catch {
            self.error = AppError.unknown(error)
            isLoading = false
            print("❌ Error loading dashboard: \(error.localizedDescription)")
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

        // Play success haptic
        Haptic.notification(.success)

        // Refresh dashboard
        await loadDashboard()

        return true
    }

    // MARK: - Helper Functions

    /// Maps Supabase transaction status to PaymentStatus enum
    private func mapTransactionStatus(_ status: String) -> PaymentStatus {
        switch status {
        case "completed": return .paid
        case "pending": return .pending
        case "failed": return .overdue
        default: return .pending
        }
    }
}

// MARK: - Supporting Types for Charts

// struct LineChartData: Identifiable {
//     let id = UUID().uuidString
//     let label: String
//     let value: Double
// }

// struct BarChartData: Identifiable {
//     let id = UUID().uuidString
//     let label: String
//     let value: Double
// }

// struct DonutChartData: Identifiable {
//     let id = UUID().uuidString
//     let label: String
//     let value: Double
//     let color: Color
// }
