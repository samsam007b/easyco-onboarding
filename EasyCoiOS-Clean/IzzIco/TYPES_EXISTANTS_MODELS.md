# Types Existants dans Models/

**140+ types déjà définis** - NE PAS REDÉCLARER !

**Règle d'or** : Avant de créer un type, cherche-le ici.

---

## Types par Catégorie

### Analytics
- AnalyticsInsight, AnalyticsPeriod
- OwnerAnalytics, SearcherAnalytics
- OwnerStats, SearcherStats, MaintenanceStats, ContractorStats

### Applications
- ApplicationDetail, ApplicationDocument
- SearcherApplication, SearcherApplicationStatus

### Conversations & Messages
- Conversation, ConversationParticipant, ConversationWithDetails
- OwnerConversation, OwnerConversationType
- SupabaseConversation, SupabaseMessage, SupabaseMessageType
- Message, MessageAttachment, MessagePermission, MessageTemplate, MessageWithSender
- TemplateCategory, TemplateUsage

### Dashboard
- OwnerDashboardData, SearcherDashboardData
- DashboardData

### Events
- **Event** ⚠️ CRITIQUE - Déjà existe !
- **EventType** ⚠️ CRITIQUE - Déjà existe !
- **EventAttendee**
- **RSVPStatus** ⚠️ CRITIQUE - Déjà existe !
- RecurringPattern

### Expenses
- **Expense** ⚠️ CRITIQUE - Déjà existe !
- **ExpenseCategory** ⚠️ CRITIQUE - Déjà existe !
- **ExpenseSplit** ⚠️ CRITIQUE - Déjà existe !
- SplitType
- Balance

### Household & Property
- Household
- Property, PropertyStatus, PropertyType, PropertyAmenity
- PropertyOccupation, PropertyResident, PropertyFilters
- Room, RoomType, RoomStatus, RoomFurniture
- Lease

### Location
- GeoLocation, LocationUtilities
- NeighborhoodVibe, TransportationType

### Maintenance
- **MaintenanceTask** ⚠️ CRITIQUE - Déjà existe !
- **MaintenanceCategory** ⚠️ CRITIQUE - Déjà existe !
- **MaintenancePriority** ⚠️ CRITIQUE - Déjà existe !
- **MaintenanceStatus**
- Contractor, ContractorStats

### Matching
- Match, MatchFilters

### Notifications
- AppNotification, NotificationType, NotificationPriority
- NotificationPreferences
- Alert, AlertType, AlertCriteria, AlertFrequency, AlertPreferences
- PushNotificationToken

### Payments & Subscriptions
- **PaymentMethod** ⚠️ CRITIQUE - Déjà existe !
- **PaymentMethodType**
- PendingPayment
- **StripeInvoice** (créé par Phase 1)
- **StripePaymentMethod** (créé par Phase 1)
- SubscriptionPlan, UserSubscription

### Privacy & Consent
- PrivacySettings, PrivacyLevel, ProfileVisibility
- UserConsent, ConsentType
- DataRequest, DataRequestType, DataRequestStatus, DataCategory
- MessagePermission

### Profile & Preferences
- EnhancedProfile (ÉNORME - 28 sous-types!)
- PersonalInfo, ProfessionalInfo
- SearchPreferences, SearcherPreferencesSummary
- UserRole

### Profile - Lifestyle (EnhancedProfile)
- CleanlinessLevel, NoiseLevel
- SmokingHabits, GuestFrequency
- CookingFrequency, CookingStyle, DietaryPreference
- ExerciseRoutine, SleepSchedule, WorkSchedule
- SocialLevel, SharedActivitiesLevel, SharingPreference
- CommunicationStyle, ConflictResolution
- PersonalityTrait, PersonalValue
- MovieGenre, MusicGenre

### Saved Searches
- SavedSearch
- SearchGroup

### Tasks
- **ResidentTask** ⚠️ CRITIQUE - Déjà existe !
- **TaskCategory** ⚠️ CRITIQUE - Déjà existe !
- **TaskPriority**
- AssignedTo, WeekDay

### User
- User
- GenderPreference, BudgetRange, LivingSituation, MoveInTimeframe
- EmploymentStatus, OccupationStatus
- GuarantorInfo

### Verification
- **VerificationDocument**
- **VerificationStatus** ⚠️ CRITIQUE - Déjà existe !

### Visits
- Visit, VisitStatus, TimeSlot

### Utility
- TimePeriod, AnyCodable
- RecurringPattern

---

## ⚠️ TYPES CRITIQUES (Redéclarés par Phase 2)

Ces types ont causé les conflits Phase 2 :

| Type | Fichier Original | Redéclaré Par |
|------|------------------|---------------|
| Event | Models/Event.swift | Hub/Events/ |
| EventType | Models/Event.swift | Hub/Events/ + Calendar/ |
| RSVPStatus | Models/Event.swift | Hub/Events/ |
| Expense | Models/Expense.swift | Hub/Finances/ |
| ExpenseCategory | Models/Expense.swift | Hub/Finances/ |
| ExpenseSplit | Models/Expense.swift | Hub/Finances/ |
| MaintenanceTask | Models/MaintenanceTask.swift | Hub/Maintenance/ |
| MaintenanceCategory | Models/MaintenanceTask.swift | Hub/Maintenance/ |
| MaintenancePriority | Models/MaintenanceTask.swift | Hub/Maintenance/ |
| ResidentTask | Models/ResidentTask.swift | Hub/Tasks/ |
| TaskCategory | Models/ResidentTask.swift | Hub/Tasks/ |
| VerificationStatus | Models/EnhancedProfile.swift | Settings/Verification/ |
| PaymentMethod | Models/PaymentMethod.swift | Hub/Finances/ |

**Leçon** : TOUJOURS utiliser les types de Models/, jamais redéclarer dans les vues.

---

## 🔍 Comment Vérifier

**Avant de créer un type** :

```bash
# Cherche dans ce fichier
grep "MonType" TYPES_EXISTANTS_MODELS.md

# Ou grep direct
grep -rn "struct MonType\|enum MonType" Models/
```

**Si trouve** → UTILISER (import depuis Models/)
**Si ne trouve pas** → Créer dans Models/ (pas dans la vue)

---

**Ce document est la Bible anti-redéclaration.**
