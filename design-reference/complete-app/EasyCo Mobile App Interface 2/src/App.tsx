import { useState } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { DesignSystem } from "./components/DesignSystem";
import { LandingPage } from "./components/LandingPage";
import { ListingDetailScreen } from "./components/ListingDetailScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { ChatScreen } from "./components/ChatScreen";
import { LandlordDashboard } from "./components/LandlordDashboard";
import { SharedExpensesScreen } from "./components/SharedExpensesScreen";
import { RoommateMatchingScreen } from "./components/RoommateMatchingScreen";
import { UrgentIssuesScreen } from "./components/UrgentIssuesScreen";
import { MapSearchScreen } from "./components/MapSearchScreen";
import { AvailabilityCalendarScreen } from "./components/AvailabilityCalendarScreen";
import { MyColivingsScreen } from "./components/MyColivingsScreen";
import { EditColivingScreen } from "./components/EditColivingScreen";
import { AddRoomScreen } from "./components/AddRoomScreen";
import { AvailableColivingsScreen } from "./components/AvailableColivingsScreen";
import { RoomDetailsScreen } from "./components/RoomDetailsScreen";
import { CostBreakdownScreen } from "./components/CostBreakdownScreen";
import { FavoritesScreen } from "./components/FavoritesScreen";
import { FavoritesProvider } from "./components/FavoritesContext";
import { FinanceSubMenu } from "./components/FinanceSubMenu";
import { TenantDashboard } from "./components/TenantDashboard";
import { PropertySearchScreen } from "./components/PropertySearchScreen";
import { NotificationsScreen } from "./components/NotificationsScreen";
import { SearcherOnboardingScreen } from "./components/SearcherOnboardingScreen";
import { SearcherMatchingScreen } from "./components/SearcherMatchingScreen";
import { ColivingGroupScreen } from "./components/ColivingGroupScreen";
import { SearcherDashboard } from "./components/SearcherDashboard";
import { ResidentDashboard } from "./components/ResidentDashboard";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import {
  Home,
  Search,
  MessageCircle,
  User,
  Building,
  DollarSign,
  Users,
  AlertTriangle,
  ChevronRight,
  Map,
  Calendar,
  Bed,
  Heart,
  Bell,
  AlertTriangle,
  BarChart3,
} from "lucide-react";

type Screen =
  | "landing"
  | "home"
  | "searcher-onboarding"
  | "listing"
  | "profile"
  | "chat"
  | "landlord"
  | "finance"
  | "applications"
  | "maintenance"
  | "residents"
  | "expenses"
  | "matching"
  | "searcher-matching"
  | "coliving-group"
  | "issues"
  | "map-search"
  | "property-search"
  | "availability-calendar"
  | "my-colivings"
  | "edit-coliving"
  | "add-room"
  | "available-colivings"
  | "room-details"
  | "cost-breakdown"
  | "favorites"
  | "notifications"
  | "design-system";

type UserType = "searchers" | "landlord" | "resident" | "guest";

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("landing");
  const [userType, setUserType] =
    useState<UserType>("searchers");
  const [selectedPropertyId, setSelectedPropertyId] = useState<
    number | null
  >(null);
  const [selectedRoomId, setSelectedRoomId] = useState<
    number | null
  >(null);



  const switchToLandlordMode = () => {
    setUserType("landlord");
    setCurrentScreen("landlord");
  };

  const switchToSearchersMode = () => {
    setUserType("searchers");
    setCurrentScreen("home");
  };

  const switchToResidentMode = () => {
    setUserType("resident");
    setCurrentScreen("residents");
  };

  const switchToGuestMode = () => {
    setUserType("guest");
    setCurrentScreen("home");
  };

  const handlePropertySelect = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    setCurrentScreen("listing");
  };

  const handleViewCalendar = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    setCurrentScreen("availability-calendar");
  };

  const handleEditColiving = (colivingId: number) => {
    setSelectedPropertyId(colivingId);
    setCurrentScreen("edit-coliving");
  };

  const handleRoomSelect = (
    colivingId: number,
    roomId: number,
  ) => {
    setSelectedPropertyId(colivingId);
    setSelectedRoomId(roomId);
    setCurrentScreen("room-details");
  };

  const handleBookRoom = () => {
    setCurrentScreen("chat");
  };

  const handleSaveRoom = (roomData: any) => {
    console.log("Saving room:", roomData);
    setCurrentScreen("edit-coliving");
  };

  const handleViewBudgetBreakdown = () => {
    setCurrentScreen("cost-breakdown");
  };

  // Residents Hub Screen
  if (currentScreen === "residents") {
    return (
      <ResidentDashboard
        onViewExpenses={() => setCurrentScreen("expenses")}
        onAddExpense={() => setCurrentScreen("expenses")}
        onInviteRoommate={() => setCurrentScreen("matching")}
        onReportIssue={() => setCurrentScreen("issues")}
        onViewCalendar={() => setCurrentScreen("availability-calendar")}
        onViewMessages={() => setCurrentScreen("chat")}
        onViewNotifications={() => setCurrentScreen("notifications")}
      />
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "landing":
        return (
          <LandingPage
            onFindColiving={() => {
              setUserType("searchers");
              setCurrentScreen("property-search");
            }}
            onListProperty={() => {
              setUserType("landlord");
              setCurrentScreen("landlord");
            }}
            onSignUp={() => {
              setUserType("searchers");
              setCurrentScreen("searcher-onboarding");
            }}
            onLogin={() => {
              setUserType("searchers");
              setCurrentScreen("home");
            }}
            onAbout={() => {
              // You can add an about modal or screen here
              console.log("About EasyCo clicked");
            }}
          />
        );
      case "searcher-onboarding":
        return (
          <SearcherOnboardingScreen
            onFindPlace={() => setCurrentScreen("property-search")}
            onFindPeople={() => setCurrentScreen("searcher-matching")}
            onBack={() => setCurrentScreen("home")}
          />
        );
      case "home":
        if (userType === "searchers") {
          return (
            <SearcherDashboard
              onFindPeople={() => setCurrentScreen("searcher-matching")}
              onFindPlace={() => setCurrentScreen("property-search")}
              onViewFavorites={() => setCurrentScreen("favorites")}
              onViewMessages={() => setCurrentScreen("chat")}
              onViewNotifications={() => setCurrentScreen("notifications")}
            />
          );
        }
        return (
          <HomeScreen
            onPropertySelect={handlePropertySelect}
            onRoomSelect={handleRoomSelect}
            onViewCalendar={(roomId) => {
              setSelectedRoomId(roomId);
              setCurrentScreen("availability-calendar");
            }}
          />
        );
      case "listing":
        return (
          <ListingDetailScreen
            onBack={() => setCurrentScreen("home")}
            onViewBudgetBreakdown={handleViewBudgetBreakdown}
          />
        );
      case "profile":
        return (
          <ProfileScreen
            onBack={shouldShowBottomNav ? undefined : () => 
              setCurrentScreen(
                userType === "resident" ? "residents" : 
                userType === "landlord" ? "landlord" : "home"
              )
            }
          />
        );
      case "chat":
        return (
          <ChatScreen
            onBack={() =>
              setCurrentScreen(
                userType === "resident" ? "residents" : "home",
              )
            }
          />
        );
      case "landlord":
        return (
          <LandlordDashboard 
            onFinanceSelect={() => setCurrentScreen("finance")}
            onViewProperties={() => setCurrentScreen("my-colivings")}
            onViewApplications={() => setCurrentScreen("applications")}
            onViewMaintenance={() => setCurrentScreen("maintenance")}
            onViewMessages={() => setCurrentScreen("chat")}
          />
        );
      case "finance":
        return (
          <FinanceSubMenu
            onBack={() => setCurrentScreen("landlord")}
          />
        );
      case "applications":
        return (
          <div className="min-h-screen bg-[var(--color-easyCo-gray-light)] p-6 pt-20">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-[var(--color-easyCo-purple)] mb-6">Application Management</h1>
              <p className="text-[var(--color-easyCo-gray-dark)]">Applications pipeline view coming soon...</p>
            </div>
          </div>
        );
      case "maintenance":
        return (
          <div className="min-h-screen bg-[var(--color-easyCo-gray-light)] p-6 pt-20">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-[var(--color-easyCo-purple)] mb-6">Maintenance Management</h1>
              <p className="text-[var(--color-easyCo-gray-dark)]">Maintenance tickets and vendor management coming soon...</p>
            </div>
          </div>
        );
      case "expenses":
        return (
          <SharedExpensesScreen
            onBack={() => setCurrentScreen("residents")}
          />
        );
      case "matching":
        return (
          <RoommateMatchingScreen
            onBack={() => setCurrentScreen("residents")}
          />
        );
      case "searcher-matching":
        return (
          <SearcherMatchingScreen
            onBack={() => setCurrentScreen("home")}
            onStartGroup={() => setCurrentScreen("coliving-group")}
            onSearchTogether={() => setCurrentScreen("property-search")}
          />
        );
      case "coliving-group":
        return (
          <ColivingGroupScreen
            onBack={() => setCurrentScreen("home")}
            onFindProperties={() => setCurrentScreen("property-search")}
            onGroupChat={() => setCurrentScreen("chat")}
          />
        );
      case "issues":
        return (
          <UrgentIssuesScreen
            onBack={() => setCurrentScreen("residents")}
          />
        );
      case "map-search":
        return (
          <MapSearchScreen
            onBack={() => setCurrentScreen("home")}
            onPropertySelect={handlePropertySelect}
            onViewCalendar={handleViewCalendar}
          />
        );
      case "property-search":
        return (
          <PropertySearchScreen
            onBack={() => setCurrentScreen("home")}
            onPropertySelect={handlePropertySelect}
            onBookVisit={(propertyId) => {
              setSelectedPropertyId(propertyId);
              setCurrentScreen("availability-calendar");
            }}
            onApplyNow={(propertyId) => {
              setSelectedPropertyId(propertyId);
              setCurrentScreen("chat");
            }}
          />
        );
      case "availability-calendar":
        return (
          <AvailabilityCalendarScreen
            propertyId={selectedPropertyId || 1}
            onBack={() => setCurrentScreen("map-search")}
            onBookViewing={() => setCurrentScreen("chat")}
          />
        );
      case "my-colivings":
        return (
          <MyColivingsScreen
            onEditColiving={handleEditColiving}
            onAddColiving={() => setCurrentScreen("add-room")}
          />
        );
      case "edit-coliving":
        return (
          <EditColivingScreen
            colivingId={selectedPropertyId || 1}
            onBack={() => setCurrentScreen("my-colivings")}
            onAddRoom={() => setCurrentScreen("add-room")}
            onEditRoom={(roomId) => {
              setSelectedRoomId(roomId);
              setCurrentScreen("add-room");
            }}
          />
        );
      case "add-room":
        return (
          <AddRoomScreen
            onBack={() => setCurrentScreen("edit-coliving")}
            onSave={handleSaveRoom}
          />
        );
      case "available-colivings":
        return (
          <AvailableColivingsScreen
            onRoomSelect={handleRoomSelect}
            onColivingSelect={handlePropertySelect}
          />
        );
      case "room-details":
        return (
          <RoomDetailsScreen
            roomId={selectedRoomId || 1}
            colivingId={selectedPropertyId || 1}
            onBack={() =>
              setCurrentScreen("available-colivings")
            }
            onBookRoom={handleBookRoom}
            onViewCalendar={() =>
              setCurrentScreen("availability-calendar")
            }
          />
        );
      case "cost-breakdown":
        return (
          <CostBreakdownScreen
            onBack={() => setCurrentScreen("listing")}
          />
        );
      case "favorites":
        return (
          <FavoritesScreen
            onBack={() => setCurrentScreen("home")}
            onPropertySelect={handlePropertySelect}
          />
        );
      case "notifications":
        return (
          <NotificationsScreen
            onBack={() => 
              setCurrentScreen(
                userType === "resident" ? "residents" : 
                userType === "landlord" ? "landlord" : "home"
              )
            }
          />
        );
      case "design-system":
        return (
          <DesignSystem
            onBack={() => setCurrentScreen("home")}
          />
        );
      default:
        return <HomeScreen />;
    }
  };

  const shouldShowBottomNav = ![
    "landing",
    "searcher-onboarding",
    "listing",
    "chat",
    "finance",
    "applications",
    "maintenance",
    "expenses",
    "matching",
    "searcher-matching",
    "coliving-group",
    "issues",
    "map-search",
    "property-search",
    ...(userType !== "resident" ? ["availability-calendar"] : []), // Allow calendar for residents
    "edit-coliving",
    "add-room",
    "room-details",
    "cost-breakdown",
    "favorites",
    "notifications",
    "design-system",
  ].includes(currentScreen);

  return (
    <FavoritesProvider>
      <div className="min-h-screen bg-[var(--color-easyCo-gray-50)] flex flex-col">
        {/* Demo Mode Switcher */}
        {currentScreen !== "landing" && (
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-[var(--color-easyCo-gray-200)] text-center py-2 px-4 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentScreen("landing")}
                className="text-xs px-3 py-1 text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-gray-100)] rounded-md transition-all duration-200"
              >
                Landing
              </button>
              <button
                onClick={() => setCurrentScreen("design-system")}
                className="text-xs px-3 py-1 text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-gray-100)] rounded-md transition-all duration-200"
              >
                Design System
              </button>
              <button
                onClick={() => setCurrentScreen("searcher-onboarding")}
                className="text-xs px-3 py-1 text-[var(--color-easyCo-gray-600)] hover:text-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-gray-100)] rounded-md transition-all duration-200"
              >
                Onboarding
              </button>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-[var(--color-easyCo-gray-500)] mr-2">Demo:</span>
              <button
                onClick={switchToGuestMode}
                className={`text-xs px-3 py-1 rounded-md transition-all duration-200 ${
                  userType === "guest" 
                    ? "bg-[var(--color-easyCo-mustard)] text-black font-semibold" 
                    : "text-[var(--color-easyCo-gray-600)] hover:bg-[var(--color-easyCo-gray-100)]"
                }`}
              >
                Guest
              </button>
              <button
                onClick={switchToSearchersMode}
                className={`text-xs px-3 py-1 rounded-md transition-all duration-200 ${
                  userType === "searchers" 
                    ? "bg-[var(--color-easyCo-mustard)] text-black font-semibold" 
                    : "text-[var(--color-easyCo-gray-600)] hover:bg-[var(--color-easyCo-gray-100)]"
                }`}
              >
                Searchers
              </button>
              <button
                onClick={switchToResidentMode}
                className={`text-xs px-3 py-1 rounded-md transition-all duration-200 ${
                  userType === "resident" 
                    ? "bg-[var(--color-easyCo-mustard)] text-black font-semibold" 
                    : "text-[var(--color-easyCo-gray-600)] hover:bg-[var(--color-easyCo-gray-100)]"
                }`}
              >
                Resident
              </button>
              <button
                onClick={switchToLandlordMode}
                className={`text-xs px-3 py-1 rounded-md transition-all duration-200 ${
                  userType === "landlord" 
                    ? "bg-[var(--color-easyCo-mustard)] text-black font-semibold" 
                    : "text-[var(--color-easyCo-gray-600)] hover:bg-[var(--color-easyCo-gray-100)]"
                }`}
              >
                Landlord
              </button>
            </div>
            <div></div>
          </div>
        </div>
        )}

      {/* Main Content */}
      <div className={`flex-1 ${currentScreen !== "landing" ? "pt-12" : ""}`}>{renderScreen()}</div>

      {/* Bottom Navigation for Searchers Mode */}
      {shouldShowBottomNav && (userType === "searchers" || userType === "guest") && (
        <div className="easyCo-nav">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setCurrentScreen("home")}
              className={`easyCo-nav-item ${
                currentScreen === "home" ? "easyCo-nav-item-active" : ""
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </button>

            <button
              onClick={() => setCurrentScreen("property-search")}
              className={`easyCo-nav-item ${
                currentScreen === "property-search" ? "easyCo-nav-item-active" : ""
              }`}
            >
              <Search className="w-6 h-6" />
              <span className="text-xs font-medium">Explore</span>
            </button>

            <button
              onClick={() => setCurrentScreen("searcher-matching")}
              className={`easyCo-nav-item ${
                currentScreen === "searcher-matching" || currentScreen === "coliving-group"
                  ? "easyCo-nav-item-active" : ""
              }`}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs font-medium">Match</span>
            </button>

            <button
              onClick={() => setCurrentScreen("favorites")}
              className={`easyCo-nav-item ${
                currentScreen === "favorites" ? "easyCo-nav-item-active" : ""
              }`}
            >
              <Heart className="w-6 h-6" />
              <span className="text-xs font-medium">Favorites</span>
            </button>

            <button
              onClick={() => setCurrentScreen("chat")}
              className={`easyCo-nav-item relative ${
                currentScreen === "chat" ? "easyCo-nav-item-active" : ""
              }`}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs font-medium">Messages</span>
              <div className="absolute top-1 right-2 w-2 h-2 bg-[var(--color-easyCo-mustard)] rounded-full"></div>
            </button>

            <button
              onClick={() => setCurrentScreen("profile")}
              className={`easyCo-nav-item ${
                currentScreen === "profile" ? "easyCo-nav-item-active" : ""
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">{userType === "guest" ? "Sign Up" : "Profile"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Landlord Mode */}
      {shouldShowBottomNav && userType === "landlord" && (
        <div className="easyCo-nav">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setCurrentScreen("landlord")}
              className={`easyCo-nav-item ${
                currentScreen === "landlord" ? "easyCo-nav-item-active" : ""
              }`}
            >
              <DollarSign className="w-6 h-6" />
              <span className="text-xs font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentScreen("my-colivings")}
              className={`easyCo-nav-item ${
                currentScreen === "my-colivings" ? "easyCo-nav-item-active" : ""
              }`}
            >
              <Building className="w-6 h-6" />
              <span className="text-xs font-medium">Properties</span>
            </button>

            <button
              onClick={() => setCurrentScreen("finance")}
              className={`easyCo-nav-item ${
                currentScreen === "finance" ? "easyCo-nav-item-active" : ""
              }`}
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs font-medium">Finance</span>
            </button>

            <button
              onClick={() => setCurrentScreen("applications")}
              className={`easyCo-nav-item relative ${
                currentScreen === "applications" ? "easyCo-nav-item-active" : ""
              }`}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs font-medium">Apps</span>
              <div className="absolute top-1 right-2 w-2 h-2 bg-[var(--color-easyCo-mustard)] rounded-full"></div>
            </button>

            <button
              onClick={() => setCurrentScreen("maintenance")}
              className={`easyCo-nav-item relative ${
                currentScreen === "maintenance" ? "easyCo-nav-item-active" : ""
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
              <span className="text-xs font-medium">Issues</span>
              <div className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>

            <button
              onClick={() => setCurrentScreen("chat")}
              className={`easyCo-nav-item relative ${
                currentScreen === "chat" ? "easyCo-nav-item-active" : ""
              }`}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs font-medium">Messages</span>
              <div className="absolute top-1 right-2 w-2 h-2 bg-[var(--color-easyCo-mustard)] rounded-full"></div>
            </button>

            <button
              onClick={() => setCurrentScreen("profile")}
              className={`easyCo-nav-item ${
                currentScreen === "profile" ? "easyCo-nav-item-active" : ""
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Resident Mode */}
      {shouldShowBottomNav && userType === "resident" && (
        <div className="easyCo-nav">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setCurrentScreen("residents")}
              className={`easyCo-nav-item ${
                currentScreen === "residents" ? "easyCo-nav-item-active" : ""
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Hub</span>
            </button>

            <button
              onClick={() => setCurrentScreen("expenses")}
              className={`easyCo-nav-item relative ${
                currentScreen === "expenses" ? "easyCo-nav-item-active" : ""
              }`}
            >
              <DollarSign className="w-6 h-6" />
              <span className="text-xs font-medium">Expenses</span>
              <div className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>

            <button
              onClick={() => setCurrentScreen("matching")}
              className={`easyCo-nav-item relative ${
                currentScreen === "matching" ? "easyCo-nav-item-active" : ""
              }`}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs font-medium">Match</span>
              <div className="absolute top-1 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
            </button>

            <button
              onClick={() => setCurrentScreen("issues")}
              className={`easyCo-nav-item relative ${
                currentScreen === "issues" ? "easyCo-nav-item-active" : ""
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
              <span className="text-xs font-medium">Issues</span>
              <div className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>

            <button
              onClick={() => setCurrentScreen("chat")}
              className={`easyCo-nav-item relative ${
                currentScreen === "chat" ? "easyCo-nav-item-active" : ""
              }`}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs font-medium">Messages</span>
              <div className="absolute top-1 right-2 w-2 h-2 bg-[var(--color-easyCo-mustard)] rounded-full"></div>
            </button>

            <button
              onClick={() => setCurrentScreen("profile")}
              className={`easyCo-nav-item ${
                currentScreen === "profile" ? "easyCo-nav-item-active" : ""
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Navigation for Demo - Searchers/Guest Mode */}
      {currentScreen === "home" && (userType === "searchers" || userType === "guest") && (
        <button
          onClick={() => setCurrentScreen("property-search")}
          className="easyCo-fab"
          title="Start Exploring Properties"
        >
          <Search className="w-6 h-6" />
        </button>
      )}

      {/* Quick Navigation for Demo - Landlord Mode */}
      {(currentScreen === "my-colivings" || currentScreen === "landlord") &&
        userType === "landlord" && (
          <>
            {currentScreen === "landlord" && (
              <button
                onClick={() => setCurrentScreen("finance")}
                className="easyCo-fab"
                title="Finance Reports"
              >
                <BarChart3 className="w-6 h-6" />
              </button>
            )}
            {currentScreen === "my-colivings" && (
              <button
                onClick={() => handleEditColiving(1)}
                className="easyCo-fab"
                title="Manage Property"
              >
                <Building className="w-6 h-6" />
              </button>
            )}
          </>
        )}

      {/* Quick Navigation for Demo - Resident Mode */}
      {currentScreen === "residents" && userType === "resident" && (
        <button
          onClick={() => setCurrentScreen("availability-calendar")}
          className="easyCo-fab"
          title="View Calendar"
        >
          <Calendar className="w-6 h-6" />
        </button>
      )}
      </div>
    </FavoritesProvider>
  );
}