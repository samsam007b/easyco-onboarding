# 🎯 EasyCo iOS - FLOW UTILISATEUR IDÉAL

## Vision: L'expérience parfaite, identique à la Web App

---

## 🚀 **EXPÉRIENCE SEARCHER (Chercheur de logement)**

### **1. Première Ouverture - Discovery**

```
📱 L'app s'ouvre
    ↓
🌟 LANDING PAGE (Hero + Features)
    ├─ "Trouve ton coloc idéal en 5 min"
    ├─ [Get Started] → 💜 WelcomeSheet popup
    ├─ [Sign In] → Login
    └─ Scroll: Features showcase, Testimonials
```

**WelcomeSheet Popup:**
- Tabs: Signup | Login
- 🔵 "Continue with Google"
- 🍎 "Continue with Apple"
- Divider "or"
- Email + Password fields
- [Create Account] / [Sign In]
- "Continue as Guest" (browse only)

---

### **2. Onboarding - Personnalisation**

```
✅ Sign up complete
    ↓
🎭 ROLE SELECTION
    "Je cherche un logement" ✅
    "Je propose un logement"
    ↓
📝 ONBOARDING - 8 STEPS
    1. Basic Info (name, age, gender, occupation)
    2. Living Situation (current housing, move date, budget)
    3. Lifestyle (smoking, pets, diet, noise level)
    4. Daily Habits (work schedule, social, cleanliness)
    5. Home Lifestyle (guests, shared spaces, cooking)
    6. Social Vibe (parties, quiet, mixed)
    7. Personality (5 traits slider)
    8. Ideal Coliving (must-haves, deal-breakers)
    ↓
🎉 "Profile Complete! Let's find your perfect match"
```

---

### **3. Main App - Tab Navigation**

#### **Tab 1: 🏠 PROPERTIES (Cœur de l'app)**

**Vue par défaut: GRID VIEW**
```
[Search bar: "Rechercher par ville, quartier..."]

[Filters] [Grid/List] [🔀 Swipe Mode] [Compare (2)]

┌─────────┬─────────┐
│ Property│ Property│  Match: 92%
│ €650/mo │ €720/mo │  Available: Now
│ 2BR, 1BA│ 1BR, 1BA│  [❤️] [📊Compare]
└─────────┴─────────┘

┌─────────┬─────────┐
│ Property│ Property│
│ ...     │ ...     │
└─────────┴─────────┘
```

**Actions sur chaque card:**
- Tap → 📄 **Property Detail View** (full screen)
- ❤️ → Add to Favorites
- 📊 → Add to Comparison (max 3)
- [Apply] → Application form

**Property Detail View:**
```
[< Back]                    [❤️] [Share] [📊]

[Photo Gallery - swipeable]
 └─ 5 photos, full screen tap

Property Name - €650/month
📍 Brussels, Ixelles
⭐ Match Score: 92%

[Apply Now] [Message Owner]

📋 OVERVIEW
- 2 bedrooms, 1 bathroom
- 45m², 3rd floor
- Available: Jan 1, 2025

🏠 AMENITIES
✅ WiFi  ✅ Furnished  ✅ Washing machine
✅ Shared kitchen  ❌ Parking

👥 CURRENT ROOMMATES (2)
[Avatar] Sophie, 24, Student
[Avatar] Marc, 27, Designer

🗺️ [View on Map]

💬 ABOUT THE PROPERTY
"Cozy apartment in the heart of Ixelles..."

📸 [View All Photos]

[Apply Now]
```

---

**🔀 SWIPE MODE** (Sheet modal)
```
[< Exit Swipe Mode]

╔═══════════════════════╗
║                       ║
║   [Property Photo]    ║
║                       ║
║  Property Name        ║
║  €650/mo · Ixelles    ║
║  Match: 92% ⭐         ║
║                       ║
║  2BR · 45m²           ║
╚═══════════════════════╝

    [❌ Nope]  [⭐ Super]  [💚 Like]

Swipe left = Nope
Swipe right = Like
Swipe up = Super Like (adds to favorites + sends message)
```

---

**📊 COMPARISON MODE** (Sheet modal)
```
[< Back]        [Select Features ▼] [Clear All]

Compare Properties (3/3)

┌──────────┬──────────┬──────────┐
│ Property │ Property │ Property │
│ Photo    │ Photo    │ Photo    │
│ €650     │ €720     │ €580     │
│ [X]      │ [X]      │ [X]      │
└──────────┴──────────┴──────────┘

💰 PRICE (monthly)
€650         €720         €580 👑

📏 SIZE
45m²         38m²         52m² 👑

🛏️ BEDROOMS
2 👑         1            2 👑

🏆 BEST OVERALL MATCH
Property 3 - Based on 10 features

[View Details] [View Details] [View Details]
```

---

#### **Tab 2: 💬 MESSAGES**

```
[Search conversations...]

┌────────────────────────────────┐
│ 🟢 Sophie • 2 min ago         │
│ "J'ai vu votre candidature"   │
└────────────────────────────────┘

┌────────────────────────────────┐
│ Marc • 1 hour ago              │
│ "La visite est confirmée pour" │
└────────────────────────────────┘

Tap → Full conversation view
  └─ Message bubbles
  └─ Quick reply templates
  └─ Schedule visit button
  └─ View property button
```

---

#### **Tab 3: 📄 APPLICATIONS**

```
[Filters: All | Pending | Accepted | Rejected]

MY APPLICATIONS (12)

┌────────────────────────────────┐
│ 🟡 PENDING                     │
│ Modern Loft - Ixelles          │
│ Applied: 2 days ago            │
│ [View] [Cancel Application]   │
└────────────────────────────────┘

┌────────────────────────────────┐
│ ✅ ACCEPTED                    │
│ Cozy Studio - Schaerbeek       │
│ Accepted: 1 week ago           │
│ [Schedule Visit] [Message]     │
└────────────────────────────────┘

┌────────────────────────────────┐
│ ❌ REJECTED                    │
│ Shared Apartment - Etterbeek   │
│ "Found another candidate"      │
└────────────────────────────────┘
```

---

#### **Tab 4: 👤 PROFILE**

```
[⚙️ Settings]  [🔔 Notifications (3)]

┌────────────────────────────────┐
│     [Profile Photo]            │
│     Samuel, 28                 │
│     ⭐ Verified Profile        │
│     Student • Non-smoker       │
└────────────────────────────────┘

🎯 PROFILE COMPLETION (75%)
[Complete your profile for better matches →]

📂 MY CONTENT
├─ ❤️ Favorites (8)
├─ 🔍 Saved Searches (3)
├─ 🔔 My Alerts (5 active)
└─ 📄 My Applications (12)

⚙️ SETTINGS
├─ Account Settings
├─ 🔒 Privacy & Data (GDPR)
├─ 🔔 Notification Preferences
├─ 🌍 Language (FR/EN/NL/DE)
├─ Help & Support
└─ About EasyCo
```

**Profile Completion Detail:**
```
Complete Your Profile (75%)

COMPLETED ✅
✅ Basic Info
✅ Living Situation
✅ Lifestyle
✅ Daily Habits
✅ Home Lifestyle
✅ Social Vibe

INCOMPLETE ⏳
⏳ Personality (0%)
⏳ Verification (0%)

WHY COMPLETE?
✓ 2x more profile views
✓ Better match accuracy
✓ Verified badge
✓ Priority in applications

[Continue Profile →]
```

**Privacy & Data:**
```
Privacy & Data

PROFILE VISIBILITY
Public ▼
○ Public - Everyone
● Verified Users Only
○ Private

COMMUNICATION
Who can message you: Everyone ▼
☑️ Show read receipts
☑️ Show online status

DATA SHARING
☐ Share location data
☑️ Share usage analytics
☐ Personalized ads

CONSENTS
✅ Terms of Service (Accepted Nov 18)
✅ Privacy Policy (Accepted Nov 18)
☐ Marketing Communications

YOUR DATA RIGHTS
├─ 📥 Download My Data
└─ 🗑️ Delete My Account

LEGAL
├─ Privacy Policy
├─ Terms of Service
└─ Cookie Policy
```

**Notifications Center:**
```
[All] [Unread (3)] [Read]

TODAY
┌────────────────────────────────┐
│ 💬 New Message                 │
│ Sophie sent you a message      │
│ 5 min ago                      │
└────────────────────────────────┘

┌────────────────────────────────┐
│ 🏠 Property Update             │
│ New property matches your      │
│ criteria                       │
│ 2 hours ago                    │
└────────────────────────────────┘

YESTERDAY
┌────────────────────────────────┐
│ ✅ Application Status          │
│ Your application was accepted  │
│ Yesterday at 3:42 PM           │
└────────────────────────────────┘

[Mark all as read] [Settings]
```

**Alerts Management:**
```
My Alerts (5 active)

┌────────────────────────────────┐
│ 🔔 ACTIVE                      │
│ Brussels - €500-700            │
│ 2+ bedrooms · Available now    │
│ 3 new matches today            │
│ [Edit] [Pause] [Delete]        │
└────────────────────────────────┘

┌────────────────────────────────┐
│ ⏸️ PAUSED                      │
│ Ghent - €600-800               │
│ [Resume]                       │
└────────────────────────────────┘

[+ Create New Alert]
```

---

## 🏠 **EXPÉRIENCE OWNER (Propriétaire)**

### **Main App - Tab Navigation**

#### **Tab 1: 🏠 MY PROPERTIES**

```
[+ Add Property]

MY PROPERTIES (4)

┌────────────────────────────────┐
│ Modern Loft - Ixelles          │
│ €650/mo · Published            │
│ 👁️ 245 views · 12 applications│
│ [Edit] [Manage] [Stats]        │
└────────────────────────────────┘

┌────────────────────────────────┐
│ Cozy Studio - Schaerbeek       │
│ €580/mo · Draft                │
│ [Continue Editing]             │
└────────────────────────────────┘
```

---

#### **Tab 2: 📨 APPLICATIONS**

```
[All] [Pending] [Accepted] [Rejected]

PENDING REVIEW (8)

┌────────────────────────────────┐
│ Sophie, 24 • Student           │
│ Applied to: Modern Loft        │
│ Match: 92% ⭐                   │
│ "Hi, I'm interested..."        │
│                                │
│ [View Profile] [Accept] [Reject]│
└────────────────────────────────┘

Tap → Full application detail
  └─ Complete profile
  └─ Verification status
  └─ References
  └─ Message applicant
  └─ Schedule visit
```

---

#### **Tab 3: 💬 MESSAGES**

```
[🎯 Quick Replies]

Same as searcher but with:
- Quick reply templates
- Bulk actions
- Schedule visits
```

---

#### **Tab 4: 📊 ANALYTICS**

```
OVERVIEW

This Month
€2,600 Revenue
32 Applications
450 Profile Views

[Property Performance Chart]
┌────────────────────────────────┐
│    Property     │ Apps │ Views │
├────────────────┼──────┼───────┤
│ Modern Loft    │  12  │  245  │
│ Cozy Studio    │   8  │  156  │
│ Shared Apt     │   7  │  189  │
│ Room in Villa  │   5  │  102  │
└────────────────────────────────┘

[Revenue Tracking]
[Conversion Funnel]
[Best Performing Listings]
```

---

#### **Tab 5: 👤 PROFILE**

Similar to searcher + owner-specific:
- Property management settings
- Payout preferences
- Tax information
- Verification documents

---

## 🎯 **FEATURES CLÉS - CHECKLIST**

### **Auth & Onboarding**
- [ ] Landing page avec Hero
- [ ] WelcomeSheet popup (OAuth + Email)
- [ ] Google Sign-in
- [ ] Apple Sign-in
- [ ] Guest mode (browse only)
- [ ] Role selection
- [ ] 8-step onboarding (Searcher)
- [ ] 6-step onboarding (Owner)

### **Properties (Searcher)**
- [ ] Grid/List view toggle
- [ ] Advanced filters
- [ ] Search by location
- [ ] Match score display
- [ ] Swipe mode (Tinder-style)
- [ ] Property comparison (max 3)
- [ ] Favorites
- [ ] Property detail with gallery
- [ ] Application submission
- [ ] Map view

### **Messages**
- [ ] Conversation list
- [ ] Real-time chat
- [ ] Quick replies
- [ ] Schedule visit button
- [ ] Message templates (Owner)

### **Applications**
- [ ] Application list with filters
- [ ] Application status tracking
- [ ] Accept/Reject (Owner)
- [ ] Application detail view
- [ ] Notifications for status changes

### **Profile & Settings**
- [ ] Profile completion tracker
- [ ] Profile editing (8 sections)
- [ ] Verification system
- [ ] Favorites management
- [ ] Saved searches
- [ ] Alerts management
- [ ] Privacy settings (GDPR)
- [ ] Data export
- [ ] Account deletion
- [ ] Notification preferences
- [ ] Language switching (FR/EN/NL/DE)

### **Analytics (Owner)**
- [ ] Revenue dashboard
- [ ] Property performance
- [ ] Application stats
- [ ] Conversion tracking
- [ ] Charts & graphs

### **Notifications**
- [ ] Push notifications
- [ ] Notification center
- [ ] Filter by read/unread
- [ ] Group by date
- [ ] Swipe actions
- [ ] Deep links to content

---

## ✨ **POLISH & UX**

### **Animations**
- [ ] Smooth tab transitions
- [ ] Card flip animations
- [ ] Swipe gestures
- [ ] Pull-to-refresh
- [ ] Skeleton loaders
- [ ] Success/Error toasts

### **Gestures**
- [ ] Swipe to delete (Messages, Favorites)
- [ ] Long-press context menus
- [ ] Pinch-to-zoom (Images)
- [ ] Pull-down to refresh

### **Empty States**
- [ ] No properties found
- [ ] No messages yet
- [ ] No applications
- [ ] No favorites

### **Loading States**
- [ ] Skeleton screens
- [ ] Progress indicators
- [ ] Infinite scroll pagination

---

## 🎨 **DESIGN SYSTEM**

Matching Web App:
- **Colors:** Purple primary (#4A148C), Yellow accent
- **Typography:** SF Pro (iOS native)
- **Spacing:** 8px grid
- **Border Radius:** 12px for cards
- **Shadows:** Subtle elevation
- **Icons:** SF Symbols (iOS native)

---

## 🚀 **NEXT: IMPLEMENTATION ORDER**

1. ✅ Review ce flow avec vous
2. Créer les fichiers manquants
3. Modifier les fichiers existants
4. Intégrer navigation
5. Build & Test
6. Itérer

**Ready to implement?** 🚀
