import SwiftUI

// MARK: - Notifications List View

struct NotificationsListView: View {
    @StateObject private var viewModel = NotificationsViewModel()
    @EnvironmentObject var languageManager: LanguageManager
    @State private var showSettings = false

    var body: some View {
        NavigationStack {
            ZStack {
                if viewModel.isLoading && viewModel.notifications.isEmpty {
                    loadingState
                } else if viewModel.notifications.isEmpty {
                    emptyState
                } else {
                    notificationsList
                }
            }
            .background(Theme.Colors.backgroundSecondary)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Notifications")
                        .font(Theme.Typography.body(.semibold))
                        .foregroundColor(Theme.Colors.textPrimary)
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    HStack(spacing: Theme.Spacing._3) {
                        // Mark all as read button
                        if viewModel.unreadCount > 0 {
                            Button(action: {
                                Task { await viewModel.markAllAsRead() }
                            }) {
                                Image(systemName: "checkmark.circle")
                                    .font(.system(size: 16, weight: .semibold))
                                    .foregroundColor(Theme.ResidentColors._600)
                            }
                        }

                        // Settings button
                        Button(action: {
                            showSettings = true
                        }) {
                            Image(systemName: "gear")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(Theme.ResidentColors._600)
                        }
                    }
                }
            }
            .sheet(isPresented: $showSettings) {
                // TODO: Add NotificationSettingsView.swift to Xcode project target
                PreferencesView()
            }
        }
        .task {
            await viewModel.loadNotifications()
        }
        .refreshable {
            await viewModel.refresh()
        }
    }

    // MARK: - Notifications List

    private var notificationsList: some View {
        ScrollView {
            LazyVStack(spacing: Theme.Spacing._3) {
                // Unread section
                if !viewModel.unreadNotifications.isEmpty {
                    sectionHeader(title: "Non lues", count: viewModel.unreadCount)

                    ForEach(viewModel.unreadNotifications) { notification in
                        NotificationRow(
                            notification: notification,
                            onTap: {
                                Task {
                                    await viewModel.handleNotificationTap(notification)
                                }
                            },
                            onDelete: {
                                Task {
                                    await viewModel.deleteNotification(notification)
                                }
                            }
                        )
                    }
                }

                // Read section
                if !viewModel.readNotifications.isEmpty {
                    sectionHeader(
                        title: "Lues",
                        count: viewModel.readNotifications.count
                    )
                    .padding(.top, viewModel.unreadNotifications.isEmpty ? 0 : Theme.Spacing._4)

                    ForEach(viewModel.readNotifications) { notification in
                        NotificationRow(
                            notification: notification,
                            onTap: {
                                Task {
                                    await viewModel.handleNotificationTap(notification)
                                }
                            },
                            onDelete: {
                                Task {
                                    await viewModel.deleteNotification(notification)
                                }
                            }
                        )
                    }
                }

                // Clear all button
                if !viewModel.notifications.isEmpty {
                    Button(action: {
                        Task { await viewModel.clearAll() }
                    }) {
                        Text("Tout effacer")
                            .font(Theme.Typography.bodySmall(.medium))
                            .foregroundColor(Color(hex: "EF4444"))
                            .padding(.vertical, Theme.Spacing._4)
                    }
                }
            }
            .padding(Theme.Spacing._4)
        }
    }

    // MARK: - Section Header

    private func sectionHeader(title: String, count: Int) -> some View {
        HStack {
            Text(title)
                .font(Theme.Typography.bodySmall(.semibold))
                .foregroundColor(Theme.Colors.textSecondary)
                .textCase(.uppercase)

            Text("(\(count))")
                .font(Theme.Typography.bodySmall(.medium))
                .foregroundColor(Theme.Colors.textTertiary)

            Spacer()
        }
        .padding(.horizontal, Theme.Spacing._2)
        .padding(.bottom, Theme.Spacing._2)
    }

    // MARK: - Empty State

    private var emptyState: some View {
        VStack(spacing: Theme.Spacing._5) {
            Image(systemName: "bell.slash.fill")
                .font(.system(size: 64, weight: .light))
                .foregroundColor(Theme.Colors.textTertiary)

            VStack(spacing: Theme.Spacing._2) {
                Text("Aucune notification")
                    .font(Theme.Typography.title3(.semibold))
                    .foregroundColor(Theme.Colors.textPrimary)

                Text("Vous êtes à jour!")
                    .font(Theme.Typography.body())
                    .foregroundColor(Theme.Colors.textSecondary)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Loading State

    private var loadingState: some View {
        VStack(spacing: 16) {
            ForEach(0..<5, id: \.self) { _ in
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(hex: "E5E7EB"))
                    .frame(height: 100)
                    .shimmer()
            }
        }
        .padding(16)
    }
}

// MARK: - Shimmer Effect

private extension View {
    func shimmer() -> some View {
        self.overlay(
            LinearGradient(
                colors: [.clear, .white.opacity(0.4), .clear],
                startPoint: .leading,
                endPoint: .trailing
            )
            .offset(x: -200)
        )
        .mask(self)
    }
}

// MARK: - Notification Row

private struct NotificationRow: View {
    let notification: AppNotification
    let onTap: () -> Void
    let onDelete: () -> Void

    var body: some View {
        Button(action: onTap) {
            rowContent
        }
        .buttonStyle(PlainButtonStyle())
    }

    private var rowContent: some View {
        HStack(spacing: Theme.Spacing._4) {
            iconView
            contentView
            deleteButton
        }
        .padding(Theme.Spacing._4)
        .background(backgroundColor)
        .cornerRadius(Theme.CornerRadius.lg)
        .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
        .overlay(borderOverlay)
    }

    private var iconView: some View {
        ZStack {
            Circle()
                .fill(iconColor.opacity(0.15))
                .frame(width: 48, height: 48)

            Image(systemName: notification.type.icon)
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(iconColor)
        }
    }

    private var contentView: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing._2) {
            titleRow
            messageText
            timeText
        }
    }

    private var titleRow: some View {
        HStack {
            Text(notification.title)
                .font(Theme.Typography.bodySmall(.semibold))
                .foregroundColor(Theme.Colors.textPrimary)
                .lineLimit(1)

            Spacer()

            if !notification.isRead {
                unreadIndicator
            }
        }
    }

    private var unreadIndicator: some View {
        Circle()
            .fill(Theme.ResidentColors._600)
            .frame(width: 8, height: 8)
    }

    private var messageText: some View {
        Text(notification.message)
            .font(Theme.Typography.bodySmall())
            .foregroundColor(Theme.Colors.textSecondary)
            .lineLimit(2)
            .multilineTextAlignment(.leading)
    }

    private var timeText: some View {
        Text(notification.timeAgo)
            .font(Theme.Typography.caption())
            .foregroundColor(Theme.Colors.textTertiary)
    }

    private var deleteButton: some View {
        Button(action: onDelete) {
            Image(systemName: "xmark")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(Theme.Colors.textTertiary)
                .frame(width: 24, height: 24)
        }
        .buttonStyle(PlainButtonStyle())
    }

    private var backgroundColor: Color {
        notification.isRead ? Color.white : Color.white.opacity(0.8)
    }

    private var borderOverlay: some View {
        RoundedRectangle(cornerRadius: Theme.CornerRadius.lg)
            .stroke(borderColor, lineWidth: 1)
    }

    private var borderColor: Color {
        notification.isRead ? Color.clear : iconColor.opacity(0.3)
    }

    private var iconColor: Color {
        Color(hex: notification.type.color)
    }
}

// MARK: - View Model

@MainActor
class NotificationsViewModel: ObservableObject {
    @Published var notifications: [AppNotification] = []
    @Published var isLoading = false
    @Published var error: NetworkError?

    private let notificationService = NotificationService.shared
    private let pushService = PushNotificationService.shared

    var unreadNotifications: [AppNotification] {
        notifications.filter { !$0.isRead }
    }

    var readNotifications: [AppNotification] {
        notifications.filter { $0.isRead }
    }

    var unreadCount: Int {
        unreadNotifications.count
    }

    func loadNotifications() async {
        isLoading = true
        defer { isLoading = false }

        _ = try? await notificationService.fetchNotifications()
        notifications = notificationService.notifications
    }

    func refresh() async {
        try? await notificationService.refresh()
        notifications = notificationService.notifications
    }

    func markAllAsRead() async {
        try? await notificationService.markAllAsRead()
        notifications = notificationService.notifications

        // Clear badge
        await pushService.clearBadge()
    }

    func handleNotificationTap(_ notification: AppNotification) async {
        // Mark as read
        try? await notificationService.markAsRead(notification.id.uuidString)
        notifications = notificationService.notifications

        // Handle navigation
        await pushService.handleNotificationTap(notification)
    }

    private func buildUserInfo(for notification: AppNotification) -> [String: String] {
        var userInfo: [String: String] = [:]
        userInfo["type"] = notification.type.rawValue

        // Extract IDs from data JSONB field or related fields
        if let propertyId = notification.relatedPropertyId {
            userInfo["property_id"] = propertyId.uuidString
        } else if let propertyIdStr = notification.data?["property_id"]?.value as? String {
            userInfo["property_id"] = propertyIdStr
        }

        if let applicationIdStr = notification.data?["application_id"]?.value as? String {
            userInfo["application_id"] = applicationIdStr
        }

        if let messageId = notification.relatedMessageId {
            userInfo["message_id"] = messageId.uuidString
        } else if let messageIdStr = notification.data?["message_id"]?.value as? String {
            userInfo["message_id"] = messageIdStr
        }

        if let taskIdStr = notification.data?["task_id"]?.value as? String {
            userInfo["task_id"] = taskIdStr
        }

        if let expenseIdStr = notification.data?["expense_id"]?.value as? String {
            userInfo["expense_id"] = expenseIdStr
        }

        return userInfo
    }

    func deleteNotification(_ notification: AppNotification) async {
        try? await notificationService.deleteNotification(notification.id.uuidString)
        notifications = notificationService.notifications
    }

    func clearAll() async {
        try? await notificationService.clearAll()
        notifications = notificationService.notifications

        // Clear badge
        await pushService.clearBadge()
    }
}

// MARK: - Preview

struct NotificationsListView_Previews: PreviewProvider {
    static var previews: some View {
        NotificationsListView()
            .environmentObject(LanguageManager.shared)
    }
}
