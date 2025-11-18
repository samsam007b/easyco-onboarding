# Push Notifications Implementation

Complete push notifications system for the EasyCo iOS app with support for local notifications, remote push notifications, and in-app notification management.

## Overview

The push notifications system consists of:

1. **Push Notification Service** - Manages APNs registration and remote push notifications
2. **Notification Service** - Manages in-app notifications and preferences
3. **Notification Models** - Data structures for notifications and preferences
4. **Notification Views** - UI for displaying and managing notifications
5. **AppDelegate Integration** - Handles push notification lifecycle events

## Architecture

### File Structure

```
EasyCo/
├── Models/
│   └── Notification.swift                    # Notification data models
├── Core/
│   └── Services/
│       ├── PushNotificationService.swift     # APNs & push handling
│       └── NotificationService.swift         # In-app notification management
└── Features/
    └── Notifications/
        ├── NotificationsListView.swift       # Notifications list UI
        └── NotificationSettingsView.swift    # Settings UI
```

## Components

### 1. Notification Models (`Models/Notification.swift`)

#### NotificationType
```swift
enum NotificationType: String, Codable {
    case message
    case propertyUpdate
    case newApplication
    case applicationStatusChange
    case taskAssignment
    case expenseAdded
    case paymentReminder
    case householdInvite
    case systemAnnouncement
}
```

Each notification type has:
- **Icon**: SF Symbol name for visual representation
- **Color**: Hex color for branding consistency

#### AppNotification
```swift
struct AppNotification: Codable, Identifiable {
    let id: UUID
    let userId: UUID
    let type: NotificationType
    let title: String
    let message: String
    let priority: NotificationPriority
    let isRead: Bool
    let createdAt: Date
    let data: NotificationData?
}
```

Main notification model with:
- Unique identifier
- User association
- Type classification
- Title and message content
- Priority level (low, normal, high, urgent)
- Read status
- Creation timestamp
- Optional data payload for navigation

#### NotificationData
```swift
struct NotificationData: Codable {
    let propertyId: UUID?
    let applicationId: UUID?
    let messageId: UUID?
    let taskId: UUID?
    let expenseId: UUID?
    let householdId: UUID?
    let actionUrl: String?
}
```

Additional context for navigation and deep linking.

#### NotificationPreferences
```swift
struct NotificationPreferences: Codable {
    var messagesEnabled: Bool
    var propertyUpdatesEnabled: Bool
    var applicationsEnabled: Bool
    var tasksEnabled: Bool
    var expensesEnabled: Bool
    var paymentsEnabled: Bool
    var householdEnabled: Bool
    var systemEnabled: Bool

    var pushEnabled: Bool
    var emailEnabled: Bool
    var inAppEnabled: Bool

    var quietHoursEnabled: Bool
    var quietHoursStart: String
    var quietHoursEnd: String
}
```

User preferences for notification types and channels.

### 2. PushNotificationService

Singleton service for managing Apple Push Notification service (APNs).

#### Key Features

**Permission Management:**
```swift
func requestPermission() async -> Bool
func checkAuthorizationStatus() async
```

**Device Token Registration:**
```swift
func registerDeviceToken(_ token: Data) async
private func sendTokenToBackend(_ token: String) async
```

**Local Notifications:**
```swift
func scheduleLocalNotification(
    title: String,
    body: String,
    timeInterval: TimeInterval,
    identifier: String,
    data: [String: Any]?
) async
func cancelLocalNotification(identifier: String)
```

**Badge Management:**
```swift
func updateBadgeCount(_ count: Int) async
func clearBadge() async
```

**Notification Handling:**
```swift
func handleNotificationTap(userInfo: [AnyHashable: Any])
```

#### UNUserNotificationCenterDelegate

Implements delegate methods for:
- Foreground notification presentation
- Notification tap handling
- Deep linking to relevant screens

### 3. NotificationService

Singleton service for managing in-app notifications.

#### Key Features

**Fetching Notifications:**
```swift
func fetchNotifications(limit: Int = 50) async
func refresh() async
```

**Mark as Read:**
```swift
func markAsRead(_ notification: AppNotification) async
func markAllAsRead() async
```

**Delete Notifications:**
```swift
func deleteNotification(_ notification: AppNotification) async
func clearAll() async
```

**Filtering:**
```swift
func notifications(ofType type: NotificationType) -> [AppNotification]
var unreadNotifications: [AppNotification]
func notifications(withPriority priority: NotificationPriority) -> [AppNotification]
```

**Preferences Management:**
```swift
func savePreferences(_ newPreferences: NotificationPreferences) async
func toggleNotificationType(_ type: NotificationType, enabled: Bool) async
```

**Real-time Updates:**
```swift
func startListening()  // For WebSocket/SSE
func stopListening()
```

### 4. NotificationsListView

Main notifications list interface.

#### Features

- **Unread/Read Sections**: Separate sections for unread and read notifications
- **Pull to Refresh**: Manual refresh support
- **Mark All as Read**: Bulk action for clearing unread status
- **Delete Actions**: Swipe to delete individual notifications
- **Clear All**: Button to delete all notifications
- **Empty State**: Friendly empty state when no notifications
- **Loading State**: Skeleton loaders during fetch

#### Layout

```
┌─────────────────────────────┐
│   Notifications        ⚙️🗸  │ <- Navigation bar
├─────────────────────────────┤
│ NON LUES (2)                │ <- Section header
├─────────────────────────────┤
│ 🔵 Nouveau message      • │ <- Unread notification (blue dot)
│ Sophie vous a envoyé...    │
│ il y a 5 min               │
├─────────────────────────────┤
│ 🟣 Nouvelle demande     • │
│ Marc a postulé pour...     │
│ il y a 1 h                 │
├─────────────────────────────┤
│ LUES (4)                   │
├─────────────────────────────┤
│ 🔴 Rappel de paiement      │ <- Read notification
│ Le loyer de ce mois...     │
│ il y a 2 j                 │
└─────────────────────────────┘
```

### 5. NotificationSettingsView

Comprehensive settings interface for notification preferences.

#### Sections

**Permission Banner** (if not granted):
- Visual prompt to enable notifications
- "Activer" button to request permission

**General Settings:**
- Push notifications toggle
- In-app notifications toggle

**Notification Types** (8 types):
- Messages
- Property updates
- Applications
- Tasks
- Expenses
- Payments
- Household
- System announcements

Each with icon, title, subtitle, and toggle.

**Quiet Hours:**
- Enable/disable quiet hours
- Start time (default: 22:00)
- End time (default: 08:00)

**Communication Channels:**
- Email notifications toggle

#### Layout

```
┌─────────────────────────────┐
│  Paramètres notifications   │
│                      Fermer │
├─────────────────────────────┤
│ 🔔 ACTIVEZ LES NOTIFICATIONS│ <- Permission banner
│ Ne manquez aucune...        │
│          [Activer]          │
├─────────────────────────────┤
│ GÉNÉRAL                     │
├─────────────────────────────┤
│ 🔔 Notifications push    ✓  │
│ 📱 Notifs dans l'app     ✓  │
├─────────────────────────────┤
│ TYPES DE NOTIFICATIONS      │
├─────────────────────────────┤
│ ✉️ Messages              ✓  │
│ 🏠 Propriétés            ✓  │
│ 👤 Candidatures          ✓  │
│ ... (8 types total)         │
├─────────────────────────────┤
│ HEURES SILENCIEUSES         │
├─────────────────────────────┤
│ 🌙 Activer               ✓  │
│ 🌅 Début: 22:00 → Fin: 08:00│
└─────────────────────────────┘
```

## Integration with Backend

### API Endpoints

#### Register Device Token
```
POST /api/notifications/register-device

Body:
{
  "token": "device_apns_token_string",
  "device_id": "unique_device_identifier",
  "platform": "ios",
  "app_version": "1.0.0"
}
```

#### Fetch Notifications
```
GET /api/notifications?limit=50

Response:
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "type": "message",
    "title": "Nouveau message",
    "message": "Sophie vous a envoyé...",
    "priority": "high",
    "is_read": false,
    "created_at": "2025-01-15T10:30:00Z",
    "data": {
      "message_id": "uuid",
      "action_url": "/messages"
    }
  }
]
```

#### Mark as Read
```
POST /api/notifications/{id}/read
POST /api/notifications/read-all
```

#### Delete Notifications
```
DELETE /api/notifications/{id}
DELETE /api/notifications/clear-all
```

#### Save Preferences
```
PUT /api/notifications/preferences

Body:
{
  "messages_enabled": true,
  "property_updates_enabled": true,
  "applications_enabled": true,
  "tasks_enabled": true,
  "expenses_enabled": true,
  "payments_enabled": true,
  "household_enabled": true,
  "system_enabled": true,
  "push_enabled": true,
  "email_enabled": true,
  "in_app_enabled": true,
  "quiet_hours_enabled": false,
  "quiet_hours_start": "22:00",
  "quiet_hours_end": "08:00"
}
```

### Push Notification Payload

Standard APNs payload format:

```json
{
  "aps": {
    "alert": {
      "title": "Nouveau message",
      "body": "Sophie vous a envoyé un message"
    },
    "badge": 3,
    "sound": "default"
  },
  "type": "message",
  "message_id": "uuid-string",
  "action_url": "/messages"
}
```

## Deep Linking & Navigation

The system uses `NotificationCenter` for navigation:

```swift
// In PushNotificationService
NotificationCenter.default.post(
    name: NSNotification.Name("NavigateToMessage"),
    object: nil,
    userInfo: ["messageId": messageId]
)
```

### Navigation Events

- `NavigateToMessage` - Open specific message
- `NavigateToProperty` - Open property detail
- `NavigateToApplication` - Open application detail
- `NavigateToTasks` - Open tasks list
- `NavigateToExpenses` - Open expenses list

Views should observe these notifications and navigate accordingly:

```swift
.onReceive(NotificationCenter.default.publisher(for: NSNotification.Name("NavigateToMessage"))) { notification in
    if let messageId = notification.userInfo?["messageId"] as? String {
        // Navigate to message
    }
}
```

## Setup Requirements

### 1. Xcode Configuration

**Capabilities:**
- Enable "Push Notifications" capability
- Enable "Background Modes" → "Remote notifications"

**Info.plist:**
```xml
<key>UIBackgroundModes</key>
<array>
    <string>remote-notification</string>
</array>
```

### 2. Apple Developer Portal

1. Create an **APNs Key** (.p8 file)
2. Note the **Key ID** and **Team ID**
3. Configure backend with these credentials

### 3. Backend Configuration

Configure your backend to send push notifications via APNs using:
- APNs Auth Key (.p8 file)
- Key ID
- Team ID
- Bundle ID: `com.easyco.app`

Libraries:
- Node.js: `node-apn` or `apn`
- Python: `apns2`
- Ruby: `apnotic`

## Usage Examples

### Request Permission

```swift
// In a view
@EnvironmentObject var pushService: PushNotificationService

Button("Enable Notifications") {
    Task {
        let granted = await pushService.requestPermission()
        if granted {
            print("✅ Permission granted")
        }
    }
}
```

### Schedule Local Notification

```swift
await PushNotificationService.shared.scheduleLocalNotification(
    title: "Rappel",
    body: "N'oubliez pas de payer le loyer",
    timeInterval: 86400, // 24 hours
    identifier: "rent-reminder",
    data: ["type": "payment_reminder"]
)
```

### Fetch Notifications

```swift
// In a ViewModel
func loadNotifications() async {
    await NotificationService.shared.fetchNotifications()
    notifications = NotificationService.shared.notifications
}
```

### Handle Notification Tap

```swift
// Automatically handled by PushNotificationService
// Listen for navigation events in your views:

.onReceive(NotificationCenter.default.publisher(for: NSNotification.Name("NavigateToMessage"))) { notification in
    if let messageId = notification.userInfo?["messageId"] as? String {
        // Navigate to MessageDetailView
        navigationPath.append(MessageDetailView(messageId: messageId))
    }
}
```

## Design System Integration

All components use the Theme design system:

- **Colors**: `Theme.Colors.accentPrimary`, notification type colors
- **Typography**: `Theme.Typography.body(.semibold)`, etc.
- **Spacing**: `Theme.Spacing._4`, `._5`, etc.
- **Corner Radius**: `Theme.CornerRadius.xl`, `.lg`
- **Shadows**: Consistent shadow styling

## Testing

### Mock Data

Mock notifications are provided for development:

```swift
let mockNotifications = AppNotification.mockData
```

### Test Local Notifications

```swift
// Schedule a test notification
await PushNotificationService.shared.scheduleLocalNotification(
    title: "Test",
    body: "This is a test notification",
    timeInterval: 5,
    identifier: "test-notification"
)
```

### Test Permission Flow

1. Delete app from simulator/device
2. Reinstall
3. Navigate to notifications
4. Test permission request flow
5. Verify settings integration

## Best Practices

### 1. Permission Timing

✅ **DO**: Request permission when user performs related action
- Tapping "Enable Notifications" in settings
- Saving important search criteria
- Applying to a property

❌ **DON'T**: Request immediately on app launch

### 2. Notification Content

✅ **DO**:
- Keep titles concise (< 40 characters)
- Make messages actionable
- Include relevant context

❌ **DON'T**:
- Use ALL CAPS
- Include sensitive information
- Send redundant notifications

### 3. Badge Management

- Update badge count when notifications are fetched
- Clear badge when user views notifications
- Sync badge with unread count

```swift
await pushService.updateBadgeCount(unreadCount)
```

### 4. Quiet Hours

Respect user's quiet hours preferences:
- No notification sounds during quiet hours
- Visual notifications only
- Urgent notifications may override

### 5. Error Handling

```swift
do {
    try await notificationService.fetchNotifications()
} catch {
    // Show error to user
    // Fallback to cached data
}
```

## Future Enhancements

### 1. Rich Notifications
- Image attachments
- Action buttons (Reply, View, Dismiss)
- Custom notification UI

### 2. Notification Grouping
- Group by type or thread
- Expandable notification stacks

### 3. Real-time Updates
- WebSocket integration for instant notifications
- Live activity updates (iOS 16.1+)

### 4. Smart Filtering
- AI-powered notification prioritization
- Automatic quiet hours detection
- Notification digests

### 5. Analytics
- Track notification open rates
- Measure engagement by type
- A/B test notification content

## Troubleshooting

### Issue: Notifications not appearing

**Check:**
1. Permissions granted in Settings app
2. Push notifications enabled in app settings
3. Device token registered with backend
4. Valid APNs certificate/key on backend
5. Correct bundle ID

### Issue: Badge not updating

**Solution:**
```swift
// Ensure badge is updated after fetching
let unreadCount = NotificationService.shared.unreadCount
await PushNotificationService.shared.updateBadgeCount(unreadCount)
```

### Issue: Navigation not working

**Check:**
1. NotificationCenter observers are registered
2. Navigation paths are correct
3. Data payload is properly formatted

## Conclusion

The push notifications system provides:

- ✅ Complete APNs integration
- ✅ In-app notification management
- ✅ Comprehensive user preferences
- ✅ Deep linking support
- ✅ Modern SwiftUI interface
- ✅ Mock data for development
- ✅ Type-safe notification handling

Ready for production use with backend API integration.
