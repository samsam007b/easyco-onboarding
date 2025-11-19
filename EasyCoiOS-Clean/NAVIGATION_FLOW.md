# 🗺️ EasyCo iOS - Navigation Flow (Web App Parity)

## 📱 Application Launch Flow

```
App Launch
    ↓
RootView (Auth Router)
    ├─ Not Authenticated → LandingView (NEW!)
    │                         ↓
    │                      LoginView (with OAuth + WelcomeSheet)
    │                         ↓
    │                      RoleSelectionView
    │                         ↓
    │                      OnboardingFlow (8 steps)
    │
    └─ Authenticated → MainTabView (Role-based)
                          ├─ Searcher → SearcherTabView
                          └─ Owner → OwnerTabView
```

---

## 1️⃣ **LANDING VIEW (New - like Web App)**

**Fichier:** `Features/Landing/LandingView.swift`

**Contenu:**
- Hero section avec animation
- "Get Started" button → shows WelcomeSheet
- "Sign In" button → shows LoginView
- Features showcase (3 cards)
- Testimonials slider

**État:** ❌ À CRÉER

---

## 2️⃣ **LOGIN/SIGNUP FLOW**

### **LoginView** (Existing but needs OAuth integration)

**Fichier:** `Features/Auth/LoginView.swift`

**Intégrations nécessaires:**
```swift
@State private var showWelcomeSheet = false

var body: some View {
    // Existing LoginView

    // ADD THIS:
    .sheet(isPresented: $showWelcomeSheet) {
        WelcomeSheet(
            isPresented: $showWelcomeSheet,
            onCreateAccount: { /* handle */ },
            onContinueAsGuest: { /* handle */ }
        )
    }
}

// ADD OAuth buttons section:
OAuthButtonsView(
    onGoogleSignIn: { viewModel.signInWithGoogle() },
    onAppleSignIn: { viewModel.signInWithApple() }
)
```

**État:** ⚠️ MODIFIER (ajouter OAuth + WelcomeSheet)

---

## 3️⃣ **SEARCHER TAB VIEW** (Main Navigation for Searchers)

**Fichier:** `Features/Searcher/SearcherTabView.swift`

### **Tab Structure:**

#### Tab 1: 🏠 **Properties**
```swift
NavigationStack {
    PropertiesListView()
        .toolbar {
            // Add Swipe Mode button
            ToolbarItem(placement: .navigationBarTrailing) {
                Button {
                    showSwipeMode = true
                } label: {
                    Image(systemName: "shuffle")
                }
            }

            // Add Comparison badge
            ToolbarItem(placement: .navigationBarTrailing) {
                ComparisonBadge()
                    .onTapGesture {
                        showComparison = true
                    }
            }
        }
        .sheet(isPresented: $showSwipeMode) {
            PropertySwipeView()
        }
        .sheet(isPresented: $showComparison) {
            PropertyComparisonView()
        }
}
```

**PropertiesListView** needs:
- Grid/List toggle
- Filters button → FiltersView
- Search bar
- Property cards with:
  - Favorite button
  - Comparison button (ComparisonButton)
  - Tap → PropertyDetailView

**PropertyDetailView** needs:
- Image gallery
- Property info
- "Apply" button
- "Add to Favorites" button
- "Add to Comparison" button
- "View on Map" button
- Contact owner → Messages

#### Tab 2: 💬 **Messages**
```swift
MessagesListView()
    // Existing, should work
```

#### Tab 3: 📄 **Applications**
```swift
ApplicationsListView()
    // Shows user's applications
    // Status tracking
    // Filters by status
```

#### Tab 4: 👤 **Profile**
```swift
NavigationStack {
    ProfileView()
        .toolbar {
            // Settings button
            ToolbarItem(placement: .navigationBarTrailing) {
                NavigationLink {
                    SettingsView()
                } label: {
                    Image(systemName: "gear")
                }
            }

            // Notifications button
            ToolbarItem(placement: .navigationBarTrailing) {
                NavigationLink {
                    NotificationCenterView()
                } label: {
                    ZStack(alignment: .topTrailing) {
                        Image(systemName: "bell.fill")
                        if unreadCount > 0 {
                            Circle()
                                .fill(.red)
                                .frame(width: 8, height: 8)
                                .offset(x: 4, y: -4)
                        }
                    }
                }
            }
        }
}
```

**ProfileView** needs:
- Profile header (avatar, name, verification badge)
- Profile completion card → ProfileCompletionView
- Saved Searches → SavedSearchesView
- Favorites → FavoritesView
- Alerts → AlertsListView
- Settings section:
  - Account settings
  - Privacy & Data → PrivacySettingsView ✅
  - Notifications → NotificationSettingsView
  - Language → LanguageSettingsView ✅
  - About & Help

---

## 4️⃣ **OWNER TAB VIEW** (Main Navigation for Owners)

**Fichier:** `Features/Owner/OwnerTabView.swift`

### **Tab Structure:**

#### Tab 1: 🏠 **My Properties**
```swift
NavigationStack {
    OwnerPropertiesListView()
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                NavigationLink {
                    AddPropertyView()
                } label: {
                    Image(systemName: "plus")
                }
            }
        }
}
```

#### Tab 2: 📨 **Applications**
```swift
OwnerApplicationsListView()
    // Shows applications received
    // Accept/Reject actions
    // Filter by status
```

#### Tab 3: 💬 **Messages**
```swift
OwnerMessagesListView()
    // Same as searcher but owner perspective
    // Quick replies/templates → MessageTemplatesView
```

#### Tab 4: 📊 **Analytics**
```swift
NavigationStack {
    AnalyticsDashboardView()
        // Property performance
        // Application stats
        // Revenue tracking
        // Charts & graphs
}
```

#### Tab 5: 👤 **Profile**
```swift
// Similar to Searcher but with:
// - Property management
// - Payout settings
// - Tax information
```

---

## 5️⃣ **CRITICAL INTEGRATIONS NEEDED**

### **A. PropertyComparisonManager Integration**

**In PropertiesListView:**
```swift
@StateObject private var comparisonManager = PropertyComparisonManager.shared

// In PropertyCard:
.overlay(alignment: .topTrailing) {
    ComparisonButton(property: property)
}

// Floating comparison badge:
.overlay(alignment: .bottom) {
    if comparisonManager.count > 0 {
        ComparisonBadge()
            .onTapGesture {
                showComparison = true
            }
    }
}
```

### **B. SwipeView Integration**

**Add button in PropertiesListView toolbar:**
```swift
ToolbarItem(placement: .navigationBarTrailing) {
    Button {
        showSwipeMode = true
    } label: {
        Image(systemName: "shuffle.circle.fill")
            .foregroundColor(Theme.Colors.primary)
    }
}

.sheet(isPresented: $showSwipeMode) {
    PropertySwipeView(
        properties: viewModel.properties,
        onLike: { property in
            viewModel.addToFavorites(property)
        },
        onDislike: { _ in },
        onSuperLike: { property in
            viewModel.addToFavorites(property)
            viewModel.sendMessage(to: property.owner)
        }
    )
}
```

### **C. NotificationCenterView Integration**

**Add to ProfileView toolbar:**
```swift
ToolbarItem(placement: .navigationBarTrailing) {
    NavigationLink {
        NotificationCenterView()
    } label: {
        ZStack(alignment: .topTrailing) {
            Image(systemName: "bell.fill")
            if notificationService.unreadCount > 0 {
                Text("\(notificationService.unreadCount)")
                    .font(.caption2)
                    .foregroundColor(.white)
                    .padding(4)
                    .background(Circle().fill(.red))
                    .offset(x: 8, y: -8)
            }
        }
    }
}
```

### **D. ProfileCompletionView Integration**

**Add card in ProfileView:**
```swift
if let profile = viewModel.profile, profile.completionPercentage < 100 {
    NavigationLink {
        ProfileCompletionView()
    } label: {
        HStack {
            VStack(alignment: .leading) {
                Text("Complete your profile")
                    .font(.headline)
                Text("\(profile.completionPercentage)% complete")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            Spacer()
            CircularProgressView(progress: profile.completionPercentage / 100)
                .frame(width: 40, height: 40)
        }
        .padding()
        .background(Theme.Colors.primary.opacity(0.1))
        .cornerRadius(12)
    }
}
```

### **E. AlertsListView Integration**

**Add to ProfileView:**
```swift
Section {
    NavigationLink {
        AlertsListView()
    } label: {
        HStack {
            Label("My Alerts", systemImage: "bell.badge")
            Spacer()
            if alertsManager.activeAlertsCount > 0 {
                Text("\(alertsManager.activeAlertsCount)")
                    .font(.caption)
                    .foregroundColor(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Theme.Colors.primary)
                    .clipShape(Capsule())
            }
        }
    }
}
```

---

## 6️⃣ **MISSING FILES TO CREATE**

1. ✅ `Features/Landing/LandingView.swift` - NEW
2. ⚠️ `Features/Properties/Search/PropertySwipeView.swift` - Check if exists
3. ⚠️ `Features/Alerts/AlertsListView.swift` - Check if exists
4. ⚠️ `Features/Owner/AnalyticsDashboardView.swift` - Check if exists
5. ⚠️ `Features/Applications/ApplicationsListView.swift` - Check if exists

---

## 7️⃣ **FILES TO MODIFY**

1. **ContentView.swift (RootView)**
   - Add LandingView for non-authenticated state

2. **LoginView.swift**
   - Add WelcomeSheet integration
   - Add OAuthButtonsView

3. **PropertiesListView.swift**
   - Add Swipe mode button
   - Add ComparisonBadge
   - Add ComparisonButton to cards

4. **ProfileView.swift**
   - Add NotificationCenterView link
   - Add ProfileCompletionView card
   - Add AlertsListView link
   - Add PrivacySettingsView link

5. **SearcherTabView.swift**
   - Verify all tabs are properly configured

6. **OwnerTabView.swift**
   - Add AnalyticsDashboardView tab
   - Add MessageTemplatesView

---

## 8️⃣ **PRIORITY ORDER**

### **Phase 1: Core Navigation** (Critical)
1. Modify RootView to add LandingView option
2. Integrate WelcomeSheet in LoginView
3. Integrate OAuth buttons in LoginView

### **Phase 2: Properties Features** (High)
4. Integrate ComparisonButton in property cards
5. Integrate ComparisonBadge in PropertiesListView
6. Integrate SwipeView button and sheet
7. Verify PropertyDetailView has all actions

### **Phase 3: Profile & Settings** (High)
8. Integrate NotificationCenterView in toolbar
9. Integrate ProfileCompletionView card
10. Integrate AlertsListView link
11. Verify PrivacySettingsView is accessible

### **Phase 4: Advanced Features** (Medium)
12. Integrate AnalyticsDashboardView for owners
13. Integrate MessageTemplatesView for owners
14. Verify SavedSearchesView is accessible

---

## ✅ **SUCCESS CRITERIA**

The iOS app flow should match the web app EXACTLY:

- ✅ Landing page with "Get Started" → WelcomeSheet
- ✅ OAuth sign-in (Google/Apple)
- ✅ Role selection
- ✅ 8-step onboarding per role
- ✅ Searcher tabs: Properties, Messages, Applications, Profile
- ✅ Owner tabs: Properties, Applications, Messages, Analytics, Profile
- ✅ Swipe mode accessible from properties
- ✅ Comparison mode with floating badge
- ✅ Notification center in profile toolbar
- ✅ Profile completion tracking
- ✅ Alerts management
- ✅ Privacy & GDPR settings
- ✅ Multi-language support

---

**Next Step:** Implement Phase 1 (Core Navigation) first, then build and test.
