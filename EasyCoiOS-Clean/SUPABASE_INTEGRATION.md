# Supabase Integration - iOS App

Complete direct Supabase integration for the EasyCo iOS app. The iOS and web apps now share the **same Supabase database** with real-time synchronization.

## Overview

The iOS app connects **directly to Supabase** (not through Next.js API), providing:

- ✅ **Shared Database** - iOS and web apps use the same Supabase tables
- ✅ **Real-time Sync** - WebSocket subscriptions for live updates
- ✅ **Row Level Security** - Supabase RLS policies protect data
- ✅ **Type-Safe Queries** - Swift query builder with Codable support
- ✅ **Authentication** - Supabase Auth for secure access
- ✅ **No API Layer** - Direct database access (faster, simpler)

## Architecture

```
┌─────────────────────┐
│   iOS App (Swift)   │
│                     │
│  SupabaseClient     │──┐
│  SupabaseRealtime   │  │
│  SupabaseAuth       │  │
└─────────────────────┘  │
                         │
                         ▼
                  ┌──────────────┐
                  │   Supabase   │
                  │   PostgreSQL │
                  │   + Realtime │
                  └──────────────┘
                         ▲
                         │
┌─────────────────────┐  │
│  Web App (Next.js)  │  │
│                     │  │
│  @supabase/supabase │──┘
│  -js                │
└─────────────────────┘
```

Both apps connect to the **same Supabase instance** and share all data.

## Components

### 1. SupabaseClient ([SupabaseClient.swift](EasyCo/EasyCo/Core/Supabase/SupabaseClient.swift))

Main client for database operations with query builder pattern.

#### Features

**Query Builder (like Supabase JS):**
```swift
// Select with filters
let notifications: [AppNotification] = try await supabase
    .from("notifications")
    .select()
    .eq("user_id", value: userId)
    .order("created_at", ascending: false)
    .limit(50)
    .execute()

// Insert
let inserted = try await supabase
    .from("notifications")
    .insert(newNotification)

// Update
try await supabase
    .from("notifications")
    .eq("id", value: notificationId)
    .update(updates)

// Delete
try await supabase
    .from("notifications")
    .eq("id", value: notificationId)
    .delete()

// RPC (Call Postgres functions)
let count: Int = try await supabase.rpcSingle(
    "get_unread_notifications_count"
)
```

**Supported Filters:**
- `eq(column, value)` - Equal
- `neq(column, value)` - Not equal
- `gt(column, value)` - Greater than
- `gte(column, value)` - Greater than or equal
- `lt(column, value)` - Less than
- `lte(column, value)` - Less than or equal
- `like(column, pattern)` - Pattern matching
- `ilike(column, pattern)` - Case-insensitive pattern
- `is(column, value)` - IS operator (for NULL)
- `in(column, values)` - IN operator

**Modifiers:**
- `select(columns)` - Select specific columns
- `order(column, ascending)` - Order results
- `limit(count)` - Limit results
- `offset(count)` - Skip results
- `single()` - Return single result

### 2. SupabaseRealtime ([SupabaseRealtime.swift](EasyCo/EasyCo/Core/Supabase/SupabaseRealtime.swift))

WebSocket client for real-time database subscriptions.

#### Features

**Connect/Disconnect:**
```swift
// Connect to Realtime server
SupabaseRealtime.shared.connect()

// Disconnect
SupabaseRealtime.shared.disconnect()
```

**Subscribe to Changes:**
```swift
// Subscribe to all events
let subscriptionId = realtime.subscribe(
    table: "notifications",
    event: .all
) { (payload: RealtimePayload<AppNotification>) in
    switch payload.event {
    case .insert:
        print("New notification:", payload.new)
    case .update:
        print("Updated notification:", payload.new)
    case .delete:
        print("Deleted notification:", payload.old)
    case .all:
        break
    }
}

// Subscribe to specific events
let insertSub = realtime.subscribe(
    table: "messages",
    event: .insert,
    filter: "conversation_id=eq.\(conversationId)"
) { payload in
    // Handle new message
}

// Unsubscribe
realtime.unsubscribe(subscriptionId)
```

**Supported Events:**
- `.all` - All database changes
- `.insert` - New rows inserted
- `.update` - Rows updated
- `.delete` - Rows deleted

### 3. SupabaseAuth ([SupabaseAuth.swift](EasyCo/EasyCo/Core/Auth/SupabaseAuth.swift))

Authentication client (already implemented).

```swift
// Sign in
let session = try await SupabaseAuth.shared.signIn(
    email: "user@example.com",
    password: "password"
)

// Sign up
let session = try await SupabaseAuth.shared.signUp(
    email: "user@example.com",
    password: "password"
)

// Sign out
try await SupabaseAuth.shared.signOut()

// Refresh session
let newSession = try await SupabaseAuth.shared.refreshSession(
    refreshToken: refreshToken
)
```

## Notifications Integration

The `NotificationService` now uses Supabase directly ([NotificationService.swift](EasyCo/EasyCo/Core/Services/NotificationService.swift)):

### Fetch Notifications
```swift
// Queries: SELECT * FROM notifications
//          WHERE user_id = current_user
//          ORDER BY created_at DESC
//          LIMIT 50
let notifications: [AppNotification] = try await supabase
    .from("notifications")
    .select()
    .order("created_at", ascending: false)
    .limit(50)
    .execute()
```

### Mark as Read
```swift
// Calls Postgres function: mark_notification_read(notification_id)
let success: Bool = try await supabase.rpcSingle(
    "mark_notification_read",
    params: ["notification_id": notificationId]
)
```

### Mark All as Read
```swift
// Calls Postgres function: mark_all_notifications_read()
let success: Bool = try await supabase.rpcSingle(
    "mark_all_notifications_read"
)
```

### Delete Notification
```swift
// DELETE FROM notifications WHERE id = ?
try await supabase
    .from("notifications")
    .eq("id", value: notificationId)
    .delete()
```

### Real-time Updates
```swift
// Listen for new notifications
func startListening() {
    realtime.connect()

    subscriptionId = realtime.subscribe(
        table: "notifications",
        event: .all
    ) { [weak self] payload in
        await self?.handleRealtimeUpdate(payload)
    }
}

// Handle real-time events
private func handleRealtimeUpdate(_ payload: RealtimePayload<AppNotification>) {
    switch payload.event {
    case .insert:
        // New notification received
        notifications.insert(payload.new, at: 0)
        updateBadgeCount()

    case .update:
        // Notification updated (e.g., marked as read)
        if let index = notifications.firstIndex(where: { $0.id == payload.new.id }) {
            notifications[index] = payload.new
        }

    case .delete:
        // Notification deleted
        notifications.removeAll { $0.id == payload.old.id }
    }
}
```

## Database Schema

### Notifications Table

The iOS models match the Supabase schema exactly:

```sql
-- Supabase notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users NOT NULL,
    type VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ,
    action_url TEXT,
    action_label VARCHAR(100),
    data JSONB DEFAULT '{}'::jsonb,
    related_user_id UUID REFERENCES auth.users,
    related_property_id UUID REFERENCES public.properties,
    related_message_id UUID REFERENCES public.messages,
    related_conversation_id UUID REFERENCES public.conversations
);
```

```swift
// iOS Swift model
struct AppNotification: Codable, Identifiable {
    let id: UUID
    let userId: UUID
    let type: NotificationType
    let title: String
    let message: String
    let isRead: Bool
    let readAt: Date?
    let createdAt: Date
    let updatedAt: Date?
    let expiresAt: Date?
    let actionUrl: String?
    let actionLabel: String?
    let data: [String: AnyCodable]?
    let relatedUserId: UUID?
    let relatedPropertyId: UUID?
    let relatedMessageId: UUID?
    let relatedConversationId: UUID?

    enum CodingKeys: String, CodingKey {
        case id
        case userId = "user_id"
        case type
        case title
        case message
        case isRead = "is_read"
        case readAt = "read_at"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case expiresAt = "expires_at"
        case actionUrl = "action_url"
        case actionLabel = "action_label"
        case data
        case relatedUserId = "related_user_id"
        case relatedPropertyId = "related_property_id"
        case relatedMessageId = "related_message_id"
        case relatedConversationId = "related_conversation_id"
    }
}
```

### Row Level Security (RLS)

Supabase RLS policies protect data automatically:

```sql
-- Users can only see their own notifications
CREATE POLICY "notifications_select_own"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can only update their own notifications
CREATE POLICY "notifications_update_own"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own notifications
CREATE POLICY "notifications_delete_own"
  ON public.notifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

The iOS app automatically includes the user's auth token in all requests, so RLS policies are enforced.

## Configuration

### AppConfig.swift

```swift
struct AppConfig {
    // Supabase Configuration
    static let supabaseURL = "https://fgthoyilfupywmpmiuwd.supabase.co"
    static let supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

The anon key is **public and safe** to include in the app. It's used for initial connections, but RLS policies ensure users can only access their own data.

## Usage Examples

### Basic Query
```swift
// Fetch user's properties
let properties: [Property] = try await SupabaseClient.shared
    .from("properties")
    .select()
    .eq("owner_id", value: userId)
    .execute()
```

### Complex Query
```swift
// Search properties with filters
let properties: [Property] = try await supabase
    .from("properties")
    .select()
    .eq("city", value: "Brussels")
    .gte("monthly_rent", value: 500)
    .lte("monthly_rent", value: 1000)
    .eq("available", value: true)
    .order("created_at", ascending: false)
    .limit(20)
    .execute()
```

### Insert with Return
```swift
// Create new message and get it back
struct MessageInsert: Codable {
    let conversationId: UUID
    let senderId: UUID
    let content: String

    enum CodingKeys: String, CodingKey {
        case conversationId = "conversation_id"
        case senderId = "sender_id"
        case content
    }
}

let newMessage = MessageInsert(
    conversationId: conversationId,
    senderId: userId,
    content: "Hello!"
)

let inserted: [Message] = try await supabase
    .from("messages")
    .insert(newMessage)
```

### Call RPC Function
```swift
// Call a Postgres function
struct MatchParams: Codable {
    let searcherId: UUID
    let limit: Int

    enum CodingKeys: String, CodingKey {
        case searcherId = "searcher_id"
        case limit
    }
}

let matches: [Property] = try await supabase.rpc(
    "get_top_matches",
    params: [
        "searcher_id": userId.uuidString,
        "limit": 10
    ]
)
```

### Real-time Subscription
```swift
class MessagesViewModel: ObservableObject {
    @Published var messages: [Message] = []
    private var subscriptionId: String?
    private let realtime = SupabaseRealtime.shared

    func startListening(conversationId: UUID) {
        realtime.connect()

        subscriptionId = realtime.subscribe(
            table: "messages",
            event: .insert,
            filter: "conversation_id=eq.\(conversationId.uuidString)"
        ) { [weak self] (payload: RealtimePayload<Message>) in
            if let newMessage = payload.new {
                self?.messages.append(newMessage)
            }
        }
    }

    func stopListening() {
        if let id = subscriptionId {
            realtime.unsubscribe(id)
        }
        realtime.disconnect()
    }
}
```

## Data Sharing Between Apps

### Automatic Sync

Because both iOS and web apps use the **same Supabase database**, they automatically share:

1. **Users** (auth.users)
2. **Profiles** (public.profiles)
3. **Properties** (public.properties)
4. **Messages** (public.messages)
5. **Conversations** (public.conversations)
6. **Notifications** (public.notifications)
7. **Applications** (public.property_applications)
8. **Favorites** (public.favorites)
9. **All other tables**

### Real-time Sync

With Supabase Realtime:
- User creates property on web → iOS app receives update instantly
- User sends message on iOS → Web app shows it immediately
- Any database change is broadcast to all connected clients

### Example: Cross-Platform Message Sync

1. User A sends message from **iOS app**
   ```swift
   let message = try await supabase.from("messages").insert(newMessage)
   ```

2. Supabase inserts message into database

3. **Web app** receives real-time event (via Supabase JS client)
   ```javascript
   supabase
     .channel('messages')
     .on('postgres_changes', { event: 'INSERT', ... }, (payload) => {
       setMessages([...messages, payload.new])
     })
   ```

4. Both apps now show the same message ✅

## Migration from Next.js API

### Before (API-based)
```swift
// Old: Call Next.js API
let endpoint = APIEndpoint(path: "/api/notifications")
let notifications: [AppNotification] = try await apiClient.request(endpoint)
```

### After (Direct Supabase)
```swift
// New: Query Supabase directly
let notifications: [AppNotification] = try await supabase
    .from("notifications")
    .select()
    .execute()
```

### Benefits

✅ **Faster** - No API layer overhead
✅ **Simpler** - No need to maintain API routes
✅ **Type-safe** - Swift models match database exactly
✅ **Real-time** - WebSocket subscriptions built-in
✅ **Secure** - RLS policies enforce permissions
✅ **Shared** - iOS and web use same database

## Error Handling

```swift
do {
    let notifications = try await supabase
        .from("notifications")
        .select()
        .execute()
} catch let error as SupabaseError {
    switch error {
    case .unauthorized:
        // User needs to re-authenticate
        print("Unauthorized access")

    case .httpError(let statusCode, let data):
        print("HTTP \(statusCode): \(String(data: data, encoding: .utf8) ?? "")")

    case .decodingError(let error):
        print("Failed to decode response: \(error)")

    default:
        print("Supabase error: \(error)")
    }
}
```

## Best Practices

### 1. Always Use Type-Safe Models
```swift
// ✅ Good
let notifications: [AppNotification] = try await supabase.from("notifications").select().execute()

// ❌ Bad
let notifications: [Any] = try await supabase.from("notifications").select().execute()
```

### 2. Use RPC for Complex Operations
```swift
// ✅ Good: Use Postgres function
let count: Int = try await supabase.rpcSingle("get_unread_notifications_count")

// ❌ Bad: Fetch all and count in app
let all = try await supabase.from("notifications").select().execute()
let count = all.filter { !$0.isRead }.count
```

### 3. Subscribe to Specific Tables Only
```swift
// ✅ Good: Subscribe to specific table
realtime.subscribe(table: "messages", event: .insert)

// ❌ Bad: Subscribe to everything
realtime.subscribe(table: "*", event: .all) // Not supported
```

### 4. Clean Up Subscriptions
```swift
class ViewModel: ObservableObject {
    private var subscriptionId: String?

    deinit {
        if let id = subscriptionId {
            SupabaseRealtime.shared.unsubscribe(id)
        }
    }
}
```

### 5. Handle Offline State
```swift
func fetchData() async {
    do {
        let data = try await supabase.from("table").select().execute()
        // Success
    } catch {
        // Fallback to cached data
        loadCachedData()
    }
}
```

## Security

### Authentication Required

All Supabase requests automatically include the auth token from Keychain:

```swift
// In SupabaseClient
if let token = EasyCoKeychainManager.shared.getAuthToken() {
    request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
}
```

### Row Level Security

Supabase RLS policies ensure users can only:
- Read their own data
- Update their own data
- Delete their own data

Attempts to access other users' data are blocked by the database.

### Anon Key is Safe

The `supabaseAnonKey` is **public** and meant to be in the app. Security is enforced by:
1. RLS policies (row level security)
2. Auth tokens (user authentication)
3. Postgres permissions

## Testing

### Mock Mode

For development without backend:

```swift
// AppConfig.swift
struct FeatureFlags {
    static let demoMode = true // Use mock data
}

// In services
if AppConfig.FeatureFlags.demoMode {
    notifications = AppNotification.mockData
} else {
    notifications = try await supabase.from("notifications").select().execute()
}
```

### Integration Testing

```swift
func testNotificationFetch() async throws {
    let service = NotificationService.shared
    await service.fetchNotifications()

    XCTAssertFalse(service.notifications.isEmpty)
    XCTAssertNil(service.error)
}
```

## Conclusion

The iOS app now has:

- ✅ **Complete Supabase integration** with query builder
- ✅ **Real-time subscriptions** via WebSocket
- ✅ **Shared database** with web app
- ✅ **Type-safe queries** with Swift Codable
- ✅ **Automatic authentication** with RLS
- ✅ **Production-ready** with proper error handling

The iOS and web apps are now **fully synchronized** through Supabase! 🎉
