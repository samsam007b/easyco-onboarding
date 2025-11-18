# 📊 Analytics & Dashboards Implementation - EasyCo iOS

Documentation complète de l'implémentation du système d'analytics et dashboards pour l'application iOS.

---

## 📋 Vue d'ensemble

L'application iOS implémente un système d'analytics complet avec 3 dashboards role-based (Owner, Searcher, Resident) matching la web app. Le système utilise des composants natifs iOS pour les graphiques et un service centralisé pour le tracking.

### Dashboards disponibles

| Dashboard | User Type | Key Metrics | Charts |
|-----------|-----------|-------------|--------|
| **Owner** | Propriétaire | Revenue, Properties, Occupation, Applications | Line Chart (Revenue), Bar Chart (Occupation) |
| **Searcher** | Chercheur | Messages, Favorites, Matches, Applications | Match scores, Preferences insights |
| **Resident** | Résident | Rent, Expenses, Balance, Tasks | Progress bars, Activity timeline |

---

## 📁 Structure des fichiers

```
EasyCo/
├── Models/
│   └── Analytics.swift              # Tous les modèles analytics
├── Core/
│   └── Services/
│       └── AnalyticsService.swift   # Service de tracking et data fetching
├── Components/
│   └── Dashboard/
│       ├── KPICard.swift           # Cartes KPI avec trends
│       └── Charts.swift            # Graphiques (Line, Bar, Progress)
└── Features/
    ├── Owner/
    │   └── OwnerDashboardView.swift
    ├── Searcher/
    │   └── SearcherDashboardView.swift
    └── Resident/
        └── ResidentDashboardView.swift
```

---

## 🎯 Fonctionnalités implémentées

### ✅ Core Analytics

- [x] Models complets (PropertyView, SearchHistory, UserActivityStats)
- [x] AnalyticsService singleton avec session management
- [x] Event tracking (trackPropertyView, trackSearch, trackEvent)
- [x] Data fetching methods (getOwnerStats, getSearcherStats, getResidentStats)
- [x] Mock data pour testing
- [x] API endpoint ready (`/api/analytics`)

### ✅ Dashboard Components

- [x] **KPICard** - Cartes métriques avec gradients et trends
- [x] **CompactKPICard** - Version compacte pour grilles
- [x] **TrendLineChart** - Graphique ligne avec area fill (iOS 16+)
- [x] **ComparisonBarChart** - Graphique barres (iOS 16+)
- [x] **ProgressRing** - Cercle de progression animé
- [x] **SimpleBarChart** - Barres horizontales (iOS 15 fallback)

### ✅ Owner Dashboard

- [x] KPI Cards (Revenue, Properties, Occupation, Applications)
- [x] Revenue & Expenses trend chart (12 months)
- [x] Occupation by property bar chart
- [x] Properties grid with status
- [x] Quick actions (Add property, View applications, Reports)

### ✅ Searcher Dashboard

- [x] KPI Cards (Messages, Favorites, Matches, Applications)
- [x] Hero search section
- [x] Recently viewed properties carousel
- [x] Top matches with compatibility scores
- [x] Preferences insights (City, Budget, Property type)

### ✅ Resident Dashboard

- [x] KPI Cards (Rent, Expenses, Balance, Tasks)
- [x] Rent payment progress bar
- [x] Upcoming tasks list with priority
- [x] Recent activity timeline
- [x] Quick actions (Add expense, Create task, View roommates)

---

## 🔧 Architecture technique

### 1. Analytics Models (`Analytics.swift`)

#### a) Tracking Models

```swift
struct PropertyView: Codable, Identifiable {
    let id: UUID
    let userId: UUID?
    let propertyId: UUID
    let viewDuration: Int? // seconds
    let source: ViewSource // direct, search, recommendation, etc.
    let viewedAt: Date
    let sessionId: String?
}

struct SearchHistory: Codable, Identifiable {
    let id: UUID
    let userId: UUID?
    let searchQuery: String?
    let filters: SearchFilters?
    let resultsCount: Int
    let clickedPropertyId: UUID?
    let searchedAt: Date
    let sessionId: String?
}
```

#### b) Stats Models

```swift
struct OwnerStats: Codable {
    let monthlyRevenue: Double
    let publishedProperties: Int
    let occupationRate: Double
    let pendingApplications: Int
    let totalPropertyViews: Int
    let averageROI: Double
    let revenueData: [MonthlyRevenue]
    let occupationData: [PropertyOccupation]
}

struct SearcherStats: Codable {
    let unreadMessages: Int
    let favoritesCount: Int
    let topMatches: Int
    let applicationsCount: Int
    let recentlyViewedProperties: [Property]
    let preferences: SearcherPreferences
}

struct ResidentStats: Codable {
    let rentPaid: Double
    let rentTotal: Double
    let sharedExpenses: Double
    let personalBalance: Double // positive = owed to you
    let roommateCount: Int
    let pendingTasks: Int
    let unreadMessages: Int
    let communityHappiness: Double // percentage
    let upcomingTasks: [ResidentTask]
    let recentActivity: [ActivityItem]
}
```

#### c) Chart Data Models

```swift
struct ChartDataPoint: Identifiable {
    let id: String
    let label: String
    let value: Double
    let secondaryValue: Double? // for dual-line charts
}

struct KPIMetric: Identifiable {
    let id: String
    let title: String
    let value: String
    let trend: Trend?
    let icon: String // SF Symbol
    let color: KPIColor

    struct Trend {
        let value: String // "+12%"
        let direction: Direction // up, down, neutral
    }
}
```

---

### 2. AnalyticsService (`AnalyticsService.swift`)

#### Singleton avec session management

```swift
@MainActor
class AnalyticsService: ObservableObject {
    static let shared = AnalyticsService()

    private var sessionId: String

    // MARK: - Tracking
    func trackPropertyView(propertyId: UUID, source: ViewSource, viewDuration: Int?)
    func trackSearch(query: String?, filters: SearchFilters?, resultsCount: Int)
    func trackEvent(_ event: AnalyticsEvent)

    // MARK: - Data Fetching
    func getOwnerStats() async throws -> OwnerStats
    func getSearcherStats() async throws -> SearcherStats
    func getResidentStats() async throws -> ResidentStats
    func getAnalyticsSummary() async throws -> AnalyticsSummary
    func getRecentlyViewedProperties(limit: Int) async throws -> [Property]
}
```

**Session Management**:
- Session ID stocké dans UserDefaults (key: `analytics_session_id`)
- Format: `session_{timestamp}_{random}`
- Persisté entre les lancements de l'app
- Permet tracking anonyme avant authentification

**Error Handling**:
- Analytics errors n'impactent jamais l'UX
- Silently fail avec logs console
- Pas de blocage des actions utilisateur

---

### 3. KPI Cards (`KPICard.swift`)

#### Full KPICard

```swift
struct KPICard: View {
    let metric: KPIMetric
    let action: (() -> Void)?

    // Features:
    // - Gradient icon background (48x48)
    // - Large value display
    // - Trend badge with direction indicator
    // - Clickable with scale animation
    // - Shadow and rounded corners
}
```

**Design tokens**:
- Height: 140px
- Padding: Theme.Spacing._5
- Corner radius: Theme.CornerRadius.xl
- Shadow: black 0.05 opacity, 8px radius
- Icon size: 20pt, gradient background
- Trend badge: Colored pill with arrow

**Gradient colors by type**:
```swift
.emerald: [#10B981, #059669]
.purple:  [#8B5CF6, #7C3AED]
.blue:    [#3B82F6, #2563EB]
.yellow:  [#F59E0B, #D97706]
.orange:  [#FFA040, #FF8C4B]
.red:     [#EF4444, #DC2626]
```

**Trend colors**:
- Up (green): `#10B981` on `#D1FAE5` background
- Down (red): `#EF4444` on `#FEE2E2` background
- Neutral (gray): `GrayColors._600` on `._100` background

#### CompactKPICard

Smaller version for dense grids:
- Height: 100px
- Icon only (no gradient background)
- No trend indicator
- Used for secondary metrics

---

### 4. Charts (`Charts.swift`)

#### TrendLineChart (iOS 16+)

```swift
@available(iOS 16.0, *)
struct TrendLineChart: View {
    let title: String
    let data: [ChartDataPoint]
    let showSecondary: Bool

    // Uses native Charts framework
    // Features:
    // - Smooth curve (catmullRom interpolation)
    // - Area gradient fill
    // - Dual lines (primary + secondary)
    // - Custom tooltips
    // - Responsive container
}
```

**Styling**:
- Primary line: 3px width, rounded cap
- Secondary line: 2px width, dashed [5,5]
- Area fill: Gradient from color._200 to ._100
- Chart height: 200px
- Axis labels: 10pt font, secondary text color

#### ComparisonBarChart (iOS 16+)

```swift
@available(iOS 16.0, *)
struct ComparisonBarChart: View {
    let title: String
    let data: [ChartDataPoint]
    let color: Color

    // Features:
    // - Gradient filled bars
    // - Rounded bar corners
    // - Horizontal labels
    // - Grid lines
}
```

#### ProgressRing

```swift
struct ProgressRing: View {
    let progress: Double // 0.0 to 1.0
    let title: String
    let subtitle: String
    let color: Color

    // Features:
    // - Circular progress with animation
    // - 12px stroke width
    // - Rounded cap
    // - Percentage display in center
    // - 120x120 size
}
```

#### SimpleBarChart (iOS 15 Fallback)

```swift
struct SimpleBarChart: View {
    let data: [ChartDataPoint]
    let color: Color

    // Horizontal bars without Charts framework
    // Features:
    // - Gradient fill
    // - Label + Value display
    // - Responsive width
    // - Works on iOS 15
}
```

---

## 💡 Usage dans les dashboards

### Owner Dashboard Example

```swift
struct OwnerDashboardView: View {
    @StateObject private var viewModel = OwnerDashboardViewModel()

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Welcome Section
                welcomeSection

                // KPI Cards Grid (2 columns)
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())]) {
                    KPICard(metric: revenueMetric) { /* navigate */ }
                    KPICard(metric: propertiesMetric) { /* navigate */ }
                    KPICard(metric: occupationMetric)
                    KPICard(metric: applicationsMetric) { /* navigate */ }
                }

                // Charts Section
                if #available(iOS 16.0, *) {
                    TrendLineChart(
                        title: "Revenu & Dépenses (12 mois)",
                        data: stats.revenueData.map { ChartDataPoint(...) },
                        showSecondary: true
                    )
                }

                SimpleBarChart(
                    data: stats.occupationData.map { ChartDataPoint(...) },
                    color: Theme.OwnerColors._600
                )

                // Properties Grid
                recentPropertiesSection

                // Quick Actions
                quickActionsSection
            }
        }
        .task {
            await viewModel.loadData()
        }
    }
}
```

### Searcher Dashboard Example

```swift
struct SearcherDashboardView: View {
    @StateObject private var viewModel = SearcherDashboardViewModel()

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Hero Search Section (gradient background)
                heroSearchSection

                // KPI Cards
                kpiCardsGrid(stats: stats)

                // Recently Viewed (horizontal scroll)
                ScrollView(.horizontal) {
                    HStack {
                        ForEach(recentlyViewed) { property in
                            PropertyCompactCard(property: property)
                        }
                    }
                }

                // Top Matches with compatibility scores
                topMatchesSection

                // Analytics Insights (preferences)
                analyticsInsightsSection(stats: stats)
            }
        }
    }
}
```

### Resident Dashboard Example

```swift
struct ResidentDashboardView: View {
    @StateObject private var viewModel = ResidentDashboardViewModel()

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Welcome Section
                welcomeSection

                // KPI Cards (Rent, Expenses, Balance, Tasks)
                kpiCardsGrid(stats: stats)

                // Rent Payment Progress
                rentPaymentSection(stats: stats) // Custom progress bar

                // Upcoming Tasks
                upcomingTasksSection(tasks: stats.upcomingTasks)

                // Recent Activity Timeline
                recentActivitySection(activity: stats.recentActivity)

                // Quick Actions
                quickActionsSection
            }
        }
    }
}
```

---

## 🎨 Design System Integration

### Color Palette by Role

**Owner** (Purple):
```swift
Theme.OwnerColors._50  // Lightest (backgrounds)
Theme.OwnerColors._400 // Medium (buttons, accents)
Theme.OwnerColors._600 // Dark (icons, text)
Theme.OwnerColors._700 // Darkest (primary text)
```

**Searcher** (Yellow/Orange):
```swift
Theme.SearcherColors._50  // Lightest
Theme.SearcherColors._400 // Primary gradient start
Theme.SearcherColors._600 // Primary gradient end
Theme.SearcherColors._700 // Text
```

**Resident** (Orange/Red):
```swift
Theme.ResidentColors._50  // Lightest
Theme.ResidentColors._400 // Primary
Theme.ResidentColors._600 // Dark
Theme.ResidentColors._700 // Darkest
```

### Typography

```swift
// Titles
Theme.Typography.title2(.bold)     // Dashboard section titles
Theme.Typography.body(.semibold)   // Card titles

// Values
Theme.Typography.title2(.bold)     // Large KPI values
Theme.Typography.title3(.bold)     // Medium values

// Labels
Theme.Typography.body()            // Body text
Theme.Typography.bodySmall(.medium)// Secondary text
Theme.Typography.caption()         // Small labels
```

### Spacing

```swift
Theme.Spacing._1  // 4px
Theme.Spacing._2  // 8px
Theme.Spacing._3  // 12px
Theme.Spacing._4  // 16px  (default padding)
Theme.Spacing._5  // 20px  (card padding)
Theme.Spacing._6  // 24px  (section spacing)
```

### Shadows

```swift
// KPI Cards
.shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)

// Compact Cards
.shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)

// Hero Sections
.shadow(color: Theme.{Role}Colors._400.opacity(0.3), radius: 8, x: 0, y: 4)
```

---

## 📊 Data Flow

### 1. Dashboard Load Sequence

```
View appears
    ↓
.task { await viewModel.loadData() }
    ↓
ViewModel.loadData()
    ↓
AnalyticsService.getOwnerStats()  (or Searcher/Resident)
    ↓
APIClient.request("/api/analytics/owner")
    ↓
Parse response → OwnerStats
    ↓
@Published stats updated
    ↓
View re-renders with data
```

### 2. Event Tracking Sequence

```
User views property
    ↓
View.task {
    await analyticsService.trackPropertyView(propertyId, source: .search)
}
    ↓
AnalyticsService.trackEvent(AnalyticsEvent(...))
    ↓
APIClient.request("/api/analytics", method: .post, body: event)
    ↓
Silently succeed or fail (no UI impact)
```

---

## 🚀 API Integration

### Endpoint: POST /api/analytics

**Request**:
```json
{
  "eventName": "property_view",
  "eventParams": {
    "property_id": "uuid",
    "source": "search",
    "view_duration": "45",
    "session_id": "session_1234_abcd"
  },
  "timestamp": "2025-11-17T10:30:00Z"
}
```

**Response**:
```json
{
  "ok": true,
  "message": "Event received"
}
```

### Endpoint: GET /api/analytics/owner

**Response**:
```json
{
  "monthlyRevenue": 4200.0,
  "publishedProperties": 3,
  "occupationRate": 85.0,
  "pendingApplications": 12,
  "totalPropertyViews": 234,
  "averageROI": 6.5,
  "revenueData": [
    { "month": "Jan", "revenue": 3800, "expenses": 1200 },
    // ... 12 months
  ],
  "occupationData": [
    { "propertyId": "uuid", "propertyName": "Appart Centre", "occupation": 100 },
    // ...
  ]
}
```

---

## 📱 Responsive Design

### Grid Layouts

```swift
// KPI Cards Grid (2 columns on all sizes)
LazyVGrid(
    columns: [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16)
    ],
    spacing: 16
) {
    // Cards...
}
```

### Horizontal Scrolls

```swift
// Recently Viewed Properties
ScrollView(.horizontal, showsIndicators: false) {
    HStack(spacing: 16) {
        ForEach(properties) { property in
            PropertyCompactCard(property: property)
                .frame(width: 160) // Fixed width
        }
    }
}
```

---

## 🐛 Error Handling

### ViewModel Error Pattern

```swift
@MainActor
class OwnerDashboardViewModel: ObservableObject {
    @Published var stats: OwnerStats?
    @Published var isLoading = false
    @Published var error: NetworkError?

    func loadData() async {
        isLoading = true
        defer { isLoading = false }

        do {
            stats = try await analyticsService.getOwnerStats()
        } catch let error as NetworkError {
            self.error = error
        } catch {
            self.error = .unknown
        }
    }
}
```

### Loading States

```swift
if viewModel.isLoading {
    // Show skeleton cards
    LazyVGrid(...) {
        ForEach(0..<4) { _ in
            SkeletonView(height: 140)
        }
    }
} else if let stats = viewModel.stats {
    // Show actual KPI cards
    kpiCardsGrid(stats: stats)
}
```

---

## 💡 Best Practices

### 1. Always use ViewModels

✅ **Bon**:
```swift
struct OwnerDashboardView: View {
    @StateObject private var viewModel = OwnerDashboardViewModel()

    var body: some View {
        ScrollView {
            if let stats = viewModel.stats {
                kpiCardsGrid(stats: stats)
            }
        }
        .task { await viewModel.loadData() }
    }
}
```

❌ **Mauvais**:
```swift
struct OwnerDashboardView: View {
    @State private var stats: OwnerStats?

    var body: some View {
        ScrollView {
            // Direct API calls in view...
        }
    }
}
```

### 2. Use mock data for testing

```swift
extension OwnerStats {
    static var mock: OwnerStats {
        OwnerStats(
            monthlyRevenue: 4200.0,
            publishedProperties: 3,
            // ...
        )
    }
}

// In preview or tests
stats = OwnerStats.mock
```

### 3. Separate chart data transformation

```swift
// Good: Transform in computed property or method
private func revenueChartData(from stats: OwnerStats) -> [ChartDataPoint] {
    stats.revenueData.map { revenue in
        ChartDataPoint(
            id: revenue.month,
            label: revenue.month,
            value: revenue.revenue,
            secondaryValue: revenue.expenses
        )
    }
}
```

### 4. Use appropriate chart for iOS version

```swift
if #available(iOS 16.0, *) {
    TrendLineChart(title: "Revenue", data: chartData, showSecondary: true)
} else {
    // Fallback for iOS 15
    SimpleBarChart(data: chartData, color: Theme.OwnerColors._600)
}
```

---

## 📚 Prochaines étapes

### Phase 2: Advanced Features

- [ ] Real-time updates via WebSocket
- [ ] Export reports (PDF, CSV)
- [ ] Custom date range filtering
- [ ] Comparison mode (month-over-month, year-over-year)
- [ ] Notifications for important metrics changes

### Phase 3: Advanced Analytics

- [ ] Predictive analytics (revenue forecasting)
- [ ] Cohort analysis
- [ ] Funnel visualization
- [ ] A/B test results display
- [ ] Heat maps for property views

---

## 🔗 Références

- [Apple Charts Documentation](https://developer.apple.com/documentation/charts)
- [SwiftUI Layout Documentation](https://developer.apple.com/documentation/swiftui/layout)
- [Web App Analytics Implementation](../lib/services/analytics-service.ts)
- [Web App Dashboards](../components/dashboard/)

---

**Dernière mise à jour**: 17 novembre 2025
**Version**: 1.0.0
**Auteur**: EasyCo Team
**Statut**: ✅ Production Ready (Core features) | 🚧 API Integration required
