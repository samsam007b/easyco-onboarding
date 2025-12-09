//
//  ResidentHubViewModel.swift
//  IzzIco
//
//  ViewModel pour le Hub du Résident
//  Gère le chargement et l'état du dashboard
//

import Foundation
import Combine

@MainActor
class ResidentHubViewModel: ObservableObject {
    // MARK: - Published Properties

    @Published var household: Household?
    @Published var lease: Lease?
    @Published var todaysTasks: [ResidentTask] = []
    @Published var recentExpenses: [Expense] = []
    @Published var upcomingEvents: [Event] = []
    @Published var balance: [Balance] = []
    @Published var isLoading = false
    @Published var error: String?

    // MARK: - Computed Properties

    var totalOwed: Double {
        balance.filter { $0.fromUserId == currentUserId }.reduce(0) { $0 + $1.amount }
    }

    var totalOwedToMe: Double {
        balance.filter { $0.toUserId == currentUserId }.reduce(0) { $0 + $1.amount }
    }

    var netBalance: Double {
        totalOwedToMe - totalOwed
    }

    var incompleteTodayTasks: [ResidentTask] {
        todaysTasks.filter { !$0.isCompleted }
    }

    var overdueTasks: [ResidentTask] {
        todaysTasks.filter { $0.isOverdue }
    }

    // Mock user ID pour le mode démo
    private let currentUserId = UUID()

    // MARK: - Init

    init() {
        // Charger les données au démarrage
        _Concurrency.Task {
            await loadDashboardData()
        }
    }

    // MARK: - Methods

    /// Charge toutes les données du dashboard
    func loadDashboardData() async {
        isLoading = true
        error = nil

        do {
            if AppConfig.FeatureFlags.demoMode {
                // Mode démo : utiliser les données mockées
                try? await _Concurrency.Task.sleep(nanoseconds: 800_000_000)

                household = Household.mockHousehold
                lease = Lease.mockLease
                todaysTasks = ResidentTask.mockTasks.filter { task in
                    if let dueDate = task.dueDate {
                        return Calendar.current.isDateInToday(dueDate) || task.isOverdue
                    }
                    return false
                }
                recentExpenses = Array(Expense.mockExpenses.prefix(3))
                upcomingEvents = Event.mockEvents.filter { !$0.isPast }.prefix(3).map { $0 }
                balance = Expense.mockBalances.prefix(3).map { $0 }
            } else {
                // TODO: Charger depuis l'API
                // await loadFromAPI()
            }

            isLoading = false
        } catch {
            self.error = "Erreur lors du chargement des données"
            isLoading = false
        }
    }

    /// Rafraîchir les données
    func refresh() async {
        await loadDashboardData()
    }

    /// Marquer une tâche comme complétée
    func completeTask(_ task: ResidentTask) async {
        guard let index = todaysTasks.firstIndex(where: { $0.id == task.id }) else { return }

        if AppConfig.FeatureFlags.demoMode {
            // Mode démo : mettre à jour localement
            todaysTasks[index].isCompleted = true
            todaysTasks[index].completedAt = Date()
        } else {
            // TODO: Appeler l'API pour marquer la tâche comme complétée
        }
    }

    /// Calculer le pourcentage de tâches complétées aujourd'hui
    func todaysTasksCompletionRate() -> Double {
        guard !todaysTasks.isEmpty else { return 0 }
        let completedCount = todaysTasks.filter { $0.isCompleted }.count
        return Double(completedCount) / Double(todaysTasks.count)
    }

    /// Obtenir un message de bienvenue personnalisé
    func getWelcomeMessage() -> String {
        let hour = Calendar.current.component(.hour, from: Date())

        switch hour {
        case 0..<12:
            return "Bonjour !"
        case 12..<18:
            return "Bon après-midi !"
        default:
            return "Bonsoir !"
        }
    }

    /// Obtenir le nombre total d'alertes/notifications
    func getTotalAlerts() -> Int {
        var count = 0

        // Tâches en retard
        count += overdueTasks.count

        // Dépenses non payées
        count += balance.filter { $0.fromUserId == currentUserId && $0.amount > 0 }.count

        // Événements nécessitant RSVP
        count += upcomingEvents.filter { event in
            event.attendees?.contains { $0.userId == currentUserId && $0.rsvpStatus == .pending } ?? false
        }.count

        // Bail expirant bientôt
        if let lease = lease, lease.isExpiringSoon {
            count += 1
        }

        return count
    }
}
