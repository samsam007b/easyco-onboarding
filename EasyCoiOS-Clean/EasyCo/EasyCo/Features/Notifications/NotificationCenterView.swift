//
//  NotificationCenterView.swift
//  EasyCo
//
//  Created by Claude on 11/18/2025.
//

import SwiftUI

// MARK: - Notification Center View

struct NotificationCenterView: View {
    @StateObject private var viewModel = NotificationCenterViewModel()
    @State private var showingSettings = false
    @State private var selectedFilter: NotificationFilter = .all

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Filter tabs
                filterTabs

                // Notifications list
                if viewModel.isLoading {
                    loadingView
                } else if viewModel.filteredNotifications.isEmpty {
                    emptyStateView
                } else {
                    notificationsList
                }
            }
            .navigationTitle("Notifications")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Menu {
                        Button {
                            Task { await viewModel.markAllAsRead() }
                        } label: {
                            Label("Mark all as read", systemImage: "checkmark.circle")
                        }
                        .disabled(viewModel.unreadCount == 0)

                        Button {
                            Task { await viewModel.clearAllNotifications() }
                        } label: {
                            Label("Clear all", systemImage: "trash")
                        }
                        .disabled(viewModel.notifications.isEmpty)

                        Divider()

                        Button {
                            showingSettings = true
                        } label: {
                            Label("Settings", systemImage: "gear")
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                            .font(.title3)
                    }
                }
            }
            // Note: NotificationSettingsView already exists and is accessible from NotificationsListView
            // Commenting out to avoid compilation issues
            // .sheet(isPresented: $showingSettings) {
            //     NotificationSettingsView()
            // }
            .refreshable {
                await viewModel.fetchNotifications()
            }
            .task {
                await viewModel.fetchNotifications()
                viewModel.startListening()
            }
            .onDisappear {
                viewModel.stopListening()
            }
        }
    }

    // MARK: - Filter Tabs

    private var filterTabs: some View {
        HStack(spacing: 0) {
            ForEach(NotificationFilter.allCases, id: \.self) { filter in
                Button {
                    selectedFilter = filter
                    viewModel.applyFilter(filter)
                } label: {
                    VStack(spacing: 8) {
                        HStack(spacing: 4) {
                            Text(filter.title)
                                .font(.subheadline)
                                .fontWeight(selectedFilter == filter ? .semibold : .regular)

                            if filter == .unread && viewModel.unreadCount > 0 {
                                Text("\(viewModel.unreadCount)")
                                    .font(.caption2)
                                    .fontWeight(.semibold)
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(Theme.Colors.primary)
                                    .clipShape(Capsule())
                            }
                        }

                        Rectangle()
                            .fill(selectedFilter == filter ? Theme.Colors.primary : Color.clear)
                            .frame(height: 2)
                    }
                }
                .buttonStyle(.plain)
                .foregroundColor(selectedFilter == filter ? Theme.Colors.primary : .secondary)
                .frame(maxWidth: .infinity)
            }
        }
        .padding(.horizontal)
        .padding(.top, 8)
        .background(Color(.systemBackground))
    }

    // MARK: - Notifications List

    private var notificationsList: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                if viewModel.groupByDate {
                    ForEach(viewModel.groupedNotifications.keys.sorted(by: >), id: \.self) { date in
                        Section {
                            ForEach(viewModel.groupedNotifications[date] ?? []) { notification in
                                NotificationCard(
                                    notification: notification,
                                    onTap: {
                                        Task { await viewModel.handleNotificationTap(notification) }
                                    },
                                    onMarkRead: {
                                        Task { await viewModel.toggleReadStatus(notification) }
                                    },
                                    onDelete: {
                                        Task { await viewModel.deleteNotification(notification) }
                                    }
                                )
                                .padding(.horizontal)
                                .padding(.vertical, 4)

                                if notification.id != viewModel.groupedNotifications[date]?.last?.id {
                                    Divider()
                                        .padding(.leading, 72)
                                }
                            }
                        } header: {
                            Text(formatDateHeader(date))
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .foregroundColor(.secondary)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding(.horizontal)
                                .padding(.vertical, 8)
                                .background(Color(.systemGroupedBackground))
                        }
                    }
                } else {
                    ForEach(viewModel.filteredNotifications) { notification in
                        NotificationCard(
                            notification: notification,
                            onTap: {
                                Task { await viewModel.handleNotificationTap(notification) }
                            },
                            onMarkRead: {
                                Task { await viewModel.toggleReadStatus(notification) }
                            },
                            onDelete: {
                                Task { await viewModel.deleteNotification(notification) }
                            }
                        )
                        .padding(.horizontal)
                        .padding(.vertical, 4)

                        if notification.id != viewModel.filteredNotifications.last?.id {
                            Divider()
                                .padding(.leading, 72)
                        }
                    }
                }
            }
            .padding(.top, 8)
        }
    }

    // MARK: - Loading View

    private var loadingView: some View {
        VStack(spacing: 16) {
            ProgressView()
            Text("Loading notifications...")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // MARK: - Empty State

    private var emptyStateView: some View {
        VStack(spacing: 20) {
            Image(systemName: emptyStateIcon)
                .font(.system(size: 60))
                .foregroundColor(.secondary)

            VStack(spacing: 8) {
                Text(emptyStateTitle)
                    .font(.title3)
                    .fontWeight(.semibold)

                Text(emptyStateMessage)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
            }
        }
        .padding()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var emptyStateIcon: String {
        switch selectedFilter {
        case .all: return "bell.slash"
        case .unread: return "checkmark.circle"
        case .read: return "tray"
        }
    }

    private var emptyStateTitle: String {
        switch selectedFilter {
        case .all: return "No notifications"
        case .unread: return "All caught up!"
        case .read: return "No read notifications"
        }
    }

    private var emptyStateMessage: String {
        switch selectedFilter {
        case .all: return "You'll see notifications about new matches, messages, and property updates here"
        case .unread: return "You've read all your notifications"
        case .read: return "Notifications you've read will appear here"
        }
    }

    // MARK: - Helpers

    private func formatDateHeader(_ date: Date) -> String {
        let calendar = Calendar.current
        if calendar.isDateInToday(date) {
            return "Today"
        } else if calendar.isDateInYesterday(date) {
            return "Yesterday"
        } else if calendar.isDate(date, equalTo: Date(), toGranularity: .weekOfYear) {
            return "This Week"
        } else {
            let formatter = DateFormatter()
            formatter.dateFormat = "MMMM d, yyyy"
            return formatter.string(from: date)
        }
    }
}

// MARK: - Notification Filter

enum NotificationFilter: String, CaseIterable {
    case all = "all"
    case unread = "unread"
    case read = "read"

    var title: String {
        switch self {
        case .all: return "All"
        case .unread: return "Unread"
        case .read: return "Read"
        }
    }
}

// MARK: - Notification Card

struct NotificationCard: View {
    let notification: AppNotification
    let onTap: () -> Void
    let onMarkRead: () -> Void
    let onDelete: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(alignment: .top, spacing: 12) {
                // Icon
                ZStack {
                    Circle()
                        .fill(notification.isRead ? Color(.systemGray5) : iconColor.opacity(0.15))
                        .frame(width: 48, height: 48)

                    Image(systemName: iconName)
                        .font(.title3)
                        .foregroundColor(notification.isRead ? .secondary : iconColor)
                }

                // Content
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Text(notification.title)
                            .font(.subheadline)
                            .fontWeight(notification.isRead ? .regular : .semibold)
                            .foregroundColor(.primary)

                        Spacer()

                        Text(timeAgo)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }

                    Text(notification.message)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .lineLimit(2)

                    if let actionLabel = notification.actionLabel {
                        Text(actionLabel)
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundColor(Theme.Colors.primary)
                            .padding(.top, 4)
                    }
                }

                // Unread indicator
                if !notification.isRead {
                    Circle()
                        .fill(Theme.Colors.primary)
                        .frame(width: 8, height: 8)
                }
            }
        }
        .buttonStyle(.plain)
        .contextMenu {
            Button {
                onMarkRead()
            } label: {
                Label(
                    notification.isRead ? "Mark as unread" : "Mark as read",
                    systemImage: notification.isRead ? "envelope.badge" : "envelope.open"
                )
            }

            Button(role: .destructive) {
                onDelete()
            } label: {
                Label("Delete", systemImage: "trash")
            }
        }
        .swipeActions(edge: .trailing, allowsFullSwipe: true) {
            Button(role: .destructive) {
                onDelete()
            } label: {
                Label("Delete", systemImage: "trash")
            }
        }
        .swipeActions(edge: .leading, allowsFullSwipe: true) {
            Button {
                onMarkRead()
            } label: {
                Label(
                    notification.isRead ? "Unread" : "Read",
                    systemImage: notification.isRead ? "envelope.badge" : "envelope.open"
                )
            }
            .tint(Theme.Colors.primary)
        }
    }

    private var iconName: String {
        notification.type.icon
    }

    private var iconColor: Color {
        Color(hex: notification.type.color)
    }

    private var timeAgo: String {
        let interval = Date().timeIntervalSince(notification.createdAt)
        let minutes = Int(interval / 60)
        let hours = Int(interval / 3600)
        let days = Int(interval / 86400)

        if minutes < 1 {
            return "Just now"
        } else if minutes < 60 {
            return "\(minutes)m"
        } else if hours < 24 {
            return "\(hours)h"
        } else if days < 7 {
            return "\(days)d"
        } else {
            let formatter = DateFormatter()
            formatter.dateFormat = "MMM d"
            return formatter.string(from: notification.createdAt)
        }
    }
}

// MARK: - View Model

@MainActor
class NotificationCenterViewModel: ObservableObject {
    @Published var notifications: [AppNotification] = []
    @Published var filteredNotifications: [AppNotification] = []
    @Published var isLoading = false
    @Published var error: Error?
    @Published var currentFilter: NotificationFilter = .all
    @Published var groupByDate = true

    private let notificationService = NotificationService.shared

    var unreadCount: Int {
        notifications.filter { !$0.isRead }.count
    }

    var groupedNotifications: [Date: [AppNotification]] {
        Dictionary(grouping: filteredNotifications) { notification in
            Calendar.current.startOfDay(for: notification.createdAt)
        }
    }

    // MARK: - Data Fetching

    func fetchNotifications() async {
        isLoading = true
        error = nil

        await notificationService.fetchNotifications()

        notifications = notificationService.notifications
        applyFilter(currentFilter)

        isLoading = false
    }

    func startListening() {
        notificationService.startListening()
    }

    func stopListening() {
        notificationService.stopListening()
    }

    // MARK: - Filtering

    func applyFilter(_ filter: NotificationFilter) {
        currentFilter = filter

        switch filter {
        case .all:
            filteredNotifications = notifications
        case .unread:
            filteredNotifications = notifications.filter { !$0.isRead }
        case .read:
            filteredNotifications = notifications.filter { $0.isRead }
        }
    }

    // MARK: - Actions

    func handleNotificationTap(_ notification: AppNotification) async {
        // Mark as read if unread
        if !notification.isRead {
            await notificationService.markAsRead(notification)
            await fetchNotifications()
        }

        // TODO: Navigate to relevant screen based on notification type
        print("📱 Notification tapped: \(notification.title)")

        // Handle navigation based on type
        switch notification.type {
        case .message:
            // Navigate to conversation
            break
        case .propertyUpdate:
            // Navigate to property detail
            break
        case .newApplication, .applicationStatusChange:
            // Navigate to application
            break
        case .taskAssignment:
            // Navigate to tasks
            break
        case .expenseAdded:
            // Navigate to expenses
            break
        case .paymentReminder:
            // Navigate to payments
            break
        case .householdInvite:
            // Navigate to household
            break
        case .systemAnnouncement:
            break
        }
    }

    func toggleReadStatus(_ notification: AppNotification) async {
        if notification.isRead {
            // TODO: Implement mark as unread
            print("📧 Marking as unread")
        } else {
            await notificationService.markAsRead(notification)
        }
        await fetchNotifications()
    }

    func deleteNotification(_ notification: AppNotification) async {
        // TODO: Implement delete notification API
        notifications.removeAll { $0.id == notification.id }
        applyFilter(currentFilter)
    }

    func markAllAsRead() async {
        await notificationService.markAllAsRead()
        await fetchNotifications()
    }

    func clearAllNotifications() async {
        // TODO: Implement clear all API
        notifications.removeAll()
        filteredNotifications.removeAll()
    }
}

// MARK: - Preview

#Preview {
    NotificationCenterView()
}
