import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  ArrowLeft,
  DollarSign,
  Wrench,
  Users,
  Check,
  Phone,
  MessageCircle,
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar
} from "lucide-react";

interface Notification {
  id: string;
  type: "payment" | "maintenance" | "roommate";
  title: string;
  description: string;
  time: string;
  isNew: boolean;
  priority?: "low" | "medium" | "high";
  actionType?: "mark_done" | "contact_landlord" | "contact_roommate" | "schedule" | "pay_now";
}

interface NotificationsScreenProps {
  onBack: () => void;
}

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    // Payment notifications
    {
      id: "pay-1",
      type: "payment",
      title: "Rent Payment Due Tomorrow",
      description: "Monthly rent of €650 is due on December 22nd",
      time: "2 hours ago",
      isNew: true,
      priority: "high",
      actionType: "pay_now"
    },
    {
      id: "pay-2",
      type: "payment",
      title: "Electricity Bill Split",
      description: "Your share: €32.50 for November usage",
      time: "1 day ago",
      isNew: true,
      priority: "medium",
      actionType: "pay_now"
    },
    {
      id: "pay-3",
      type: "payment",
      title: "Deposit Refund Processed",
      description: "€200 security deposit has been refunded to your account",
      time: "3 days ago",
      isNew: false,
      priority: "low"
    },
    
    // Maintenance notifications
    {
      id: "main-1",
      type: "maintenance",
      title: "Washing Machine Repair Scheduled",
      description: "Technician will arrive tomorrow between 2-4 PM",
      time: "30 minutes ago",
      isNew: true,
      priority: "medium",
      actionType: "schedule"
    },
    {
      id: "main-2",
      type: "maintenance",
      title: "Heating Issue Reported",
      description: "Kitchen radiator not working properly - repair needed",
      time: "4 hours ago",
      isNew: true,
      priority: "high",
      actionType: "contact_landlord"
    },
    {
      id: "main-3",
      type: "maintenance",
      title: "WiFi Router Replacement",
      description: "New router installed - password updated",
      time: "2 days ago",
      isNew: false,
      priority: "low",
      actionType: "mark_done"
    },
    
    // Roommate notifications
    {
      id: "room-1",
      type: "roommate",
      title: "New Roommate Request",
      description: "Sarah (24) wants to join your flatshare starting January",
      time: "1 hour ago",
      isNew: true,
      priority: "medium",
      actionType: "contact_roommate"
    },
    {
      id: "room-2",
      type: "roommate",
      title: "Move-out Notice",
      description: "Alex will be moving out on January 15th",
      time: "6 hours ago",
      isNew: true,
      priority: "high",
      actionType: "contact_landlord"
    },
    {
      id: "room-3",
      type: "roommate",
      title: "House Meeting Reminder",
      description: "Monthly flatshare meeting tomorrow at 7 PM",
      time: "1 day ago",
      isNew: false,
      priority: "low",
      actionType: "mark_done"
    }
  ]);

  const [activeTab, setActiveTab] = useState("all");

  const getNotificationIcon = (type: string, priority?: string) => {
    const iconClass = priority === "high" ? "text-red-500" : 
                     priority === "medium" ? "text-[var(--color-easyCo-mustard)]" : 
                     "text-[var(--color-easyCo-gray-dark)]";
    
    switch (type) {
      case "payment":
        return <DollarSign className={`w-5 h-5 ${iconClass}`} />;
      case "maintenance":
        return <Wrench className={`w-5 h-5 ${iconClass}`} />;
      case "roommate":
        return <Users className={`w-5 h-5 ${iconClass}`} />;
      default:
        return <AlertCircle className={`w-5 h-5 ${iconClass}`} />;
    }
  };

  const getActionButton = (notification: Notification) => {
    switch (notification.actionType) {
      case "pay_now":
        return (
          <Button 
            size="sm" 
            className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black"
            onClick={() => handleAction(notification.id, "pay")}
          >
            <DollarSign className="w-4 h-4 mr-1" />
            Pay Now
          </Button>
        );
      case "contact_landlord":
        return (
          <Button 
            size="sm" 
            variant="outline"
            className="border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)]"
            onClick={() => handleAction(notification.id, "contact_landlord")}
          >
            <Phone className="w-4 h-4 mr-1" />
            Contact
          </Button>
        );
      case "contact_roommate":
        return (
          <Button 
            size="sm" 
            variant="outline"
            className="border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)]"
            onClick={() => handleAction(notification.id, "contact_roommate")}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Message
          </Button>
        );
      case "schedule":
        return (
          <Button 
            size="sm" 
            variant="outline"
            className="border-[var(--color-easyCo-mustard)] text-[var(--color-easyCo-mustard)]"
            onClick={() => handleAction(notification.id, "schedule")}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Schedule
          </Button>
        );
      case "mark_done":
        return (
          <Button 
            size="sm" 
            variant="ghost"
            className="text-green-600 hover:bg-green-50"
            onClick={() => handleAction(notification.id, "mark_done")}
          >
            <Check className="w-4 h-4 mr-1" />
            Done
          </Button>
        );
      default:
        return null;
    }
  };

  const handleAction = (notificationId: string, action: string) => {
    console.log(`Action ${action} for notification ${notificationId}`);
    
    // Mark notification as read when action is taken
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isNew: false }
          : notif
      )
    );
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isNew: false }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isNew: false }))
    );
  };

  const getFilteredNotifications = () => {
    if (activeTab === "all") return notifications;
    return notifications.filter(notif => notif.type === activeTab);
  };

  const getUnreadCount = (type?: string) => {
    const filtered = type && type !== "all" 
      ? notifications.filter(notif => notif.type === type && notif.isNew)
      : notifications.filter(notif => notif.isNew);
    return filtered.length;
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case "payment":
        return "bg-green-100 text-green-700";
      case "maintenance":
        return "bg-blue-100 text-blue-700";
      case "roommate":
        return "bg-purple-100 text-[var(--color-easyCo-purple)]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
      {/* Header */}
      <div className="bg-white border-b border-[var(--color-easyCo-gray-medium)] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-[var(--color-easyCo-purple)]">
                Notifications
              </h1>
              {getUnreadCount() > 0 && (
                <p className="text-sm text-[var(--color-easyCo-gray-dark)]">
                  {getUnreadCount()} new notifications
                </p>
              )}
            </div>
          </div>
          
          {getUnreadCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-[var(--color-easyCo-purple)]"
            >
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger 
              value="all" 
              className="relative data-[state=active]:bg-[var(--color-easyCo-purple)] data-[state=active]:text-white"
            >
              All
              {getUnreadCount() > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 bg-[var(--color-easyCo-mustard)] text-black text-xs flex items-center justify-center">
                  {getUnreadCount()}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="payment"
              className="relative data-[state=active]:bg-[var(--color-easyCo-purple)] data-[state=active]:text-white"
            >
              Payments
              {getUnreadCount("payment") > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 bg-[var(--color-easyCo-mustard)] text-black text-xs flex items-center justify-center">
                  {getUnreadCount("payment")}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="maintenance"
              className="relative data-[state=active]:bg-[var(--color-easyCo-purple)] data-[state=active]:text-white"
            >
              Maintenance
              {getUnreadCount("maintenance") > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 bg-[var(--color-easyCo-mustard)] text-black text-xs flex items-center justify-center">
                  {getUnreadCount("maintenance")}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="roommate"
              className="relative data-[state=active]:bg-[var(--color-easyCo-purple)] data-[state=active]:text-white"
            >
              Roommates
              {getUnreadCount("roommate") > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 bg-[var(--color-easyCo-mustard)] text-black text-xs flex items-center justify-center">
                  {getUnreadCount("roommate")}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {getFilteredNotifications().length === 0 ? (
              <Card className="border-0 rounded-3xl">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-[var(--color-easyCo-gray-medium)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-[var(--color-easyCo-gray-dark)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--color-easyCo-purple)] mb-2">
                    All caught up!
                  </h3>
                  <p className="text-[var(--color-easyCo-gray-dark)]">
                    No notifications in this category
                  </p>
                </CardContent>
              </Card>
            ) : (
              getFilteredNotifications().map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`border-0 rounded-3xl transition-all ${
                    notification.isNew 
                      ? 'ring-2 ring-[var(--color-easyCo-mustard)] shadow-md' 
                      : 'shadow-sm'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-[var(--color-easyCo-purple)]">
                              {notification.title}
                            </h3>
                            {notification.isNew && (
                              <div className="w-2 h-2 bg-[var(--color-easyCo-mustard)] rounded-full"></div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getCategoryColor(notification.type)}`}
                            >
                              {notification.type}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-[var(--color-easyCo-gray-dark)] mb-3">
                          {notification.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-[var(--color-easyCo-gray-dark)]">
                            <Clock className="w-4 h-4" />
                            {notification.time}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {notification.isNew && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-[var(--color-easyCo-gray-dark)] hover:text-[var(--color-easyCo-purple)]"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Mark read
                              </Button>
                            )}
                            {getActionButton(notification)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}