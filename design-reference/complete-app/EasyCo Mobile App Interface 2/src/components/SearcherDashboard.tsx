import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Search, 
  Users, 
  Heart, 
  MapPin, 
  Star, 
  ArrowRight,
  Home,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Clock,
  Building,
  UserPlus,
  Filter,
  Bell,
  Zap,
  Target,
  Globe,
  Coffee,
  BookOpen,
  Camera,
  Music,
  X,
  Plus,
  Calendar
} from "lucide-react";


interface SearcherDashboardProps {
  onFindPeople: () => void;
  onFindPlace: () => void;
  onViewFavorites: () => void;
  onViewMessages: () => void;
  onViewNotifications: () => void;
}

export function SearcherDashboard({ 
  onFindPeople, 
  onFindPlace, 
  onViewFavorites, 
  onViewMessages,
  onViewNotifications 
}: SearcherDashboardProps) {
  // Quick stats data
  const stats = {
    savedProperties: 12,
    activeChats: 3,
    potentialMatches: 47,
    groupInvites: 2
  };

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-50)]">
      {/* Header - Airbnb Style */}
      <div className="easyCo-header border-b border-[var(--color-easyCo-gray-200)] pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="easyCo-heading-1 mb-1">Welcome back!</h1>
            <p className="easyCo-body-sm">Let's find your perfect coliving match</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onViewNotifications} className="easyCo-btn-icon relative">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--color-easyCo-mustard)] rounded-full"></div>
            </button>
            <button onClick={onViewMessages} className="easyCo-btn-icon relative">
              <MessageCircle className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--color-easyCo-mustard)] rounded-full"></div>
            </button>
          </div>
        </div>

        {/* Search Bar - Airbnb Inspired */}
        <div className="easyCo-search mb-6">
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-[var(--color-easyCo-gray-400)]" />
            <input 
              placeholder="Where do you want to live?"
              className="flex-1 bg-transparent border-0 outline-none text-[var(--color-easyCo-gray-700)] placeholder:text-[var(--color-easyCo-gray-400)]"
            />
            <Filter className="w-5 h-5 text-[var(--color-easyCo-purple)]" />
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        {/* Quick Stats - Airbnb Cards */}
        <div className="grid grid-cols-4 gap-3 mb-8 -mt-4">
          <div className="easyCo-stat-card">
            <div className="easyCo-heading-2 text-[var(--color-easyCo-purple)] mb-1">{stats.savedProperties}</div>
            <div className="easyCo-caption">Saved</div>
          </div>
          <div className="easyCo-stat-card">
            <div className="easyCo-heading-2 text-[var(--color-easyCo-purple)] mb-1">{stats.activeChats}</div>
            <div className="easyCo-caption">Chats</div>
          </div>
          <div className="easyCo-stat-card">
            <div className="easyCo-heading-2 text-[var(--color-easyCo-mustard-dark)] mb-1">{stats.potentialMatches}</div>
            <div className="easyCo-caption">Matches</div>
          </div>
          <div className="easyCo-stat-card">
            <div className="easyCo-heading-2 text-[var(--color-easyCo-mustard-dark)] mb-1">{stats.groupInvites}</div>
            <div className="easyCo-caption">Invites</div>
          </div>
        </div>

        {/* Main Actions - Two Path Cards */}
        <div className="space-y-6 mb-8">
          {/* Find People Card - Tinder Inspired */}
          <div 
            className="easyCo-property-card group cursor-pointer"
            onClick={onFindPeople}
          >
            <div className="relative h-64 bg-gradient-to-br from-[var(--color-easyCo-purple)] to-[var(--color-easyCo-purple-dark)] overflow-hidden">
              <div className="easyCo-image-overlay-light" />
              
              {/* Floating Profile Previews */}
              <div className="absolute top-6 right-6 flex -space-x-3">
                <Avatar className="w-12 h-12 border-3 border-white shadow-lg">
                  <AvatarImage src="https://images.unsplash.com/photo-1561065533-316e3142d586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMGhhcHB5fGVufDF8fHx8MTc1NTUyNzU5Mnww&ixlib=rb-4.1.0&q=80&w=1080" alt="Emma" />
                  <AvatarFallback>E</AvatarFallback>
                </Avatar>
                <Avatar className="w-12 h-12 border-3 border-white shadow-lg">
                  <AvatarImage src="https://images.unsplash.com/photo-1670841062505-1f8f6d45862a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwcm9mZXNzaW9uYWwlMjB5b3VuZyUyMHBlcnNvbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzU1NTI3NTk2fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Marcus" />
                  <AvatarFallback>M</AvatarFallback>
                </Avatar>
                <div className="w-12 h-12 bg-[var(--color-easyCo-mustard)] rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-black" />
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-8 h-8 text-white" />
                  <span className="easyCo-badge-primary">Most Popular</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Find Your Coliving Squad</h2>
                <p className="text-white/90 text-base leading-relaxed">Connect with 47+ like-minded people before finding a place together</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-easyCo-gray-600)]">
                    <Target className="w-4 h-4 text-[var(--color-easyCo-purple)]" />
                    <span>Smart Matching</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-easyCo-gray-600)]">
                    <Clock className="w-4 h-4 text-[var(--color-easyCo-purple)]" />
                    <span>Active Now</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[var(--color-easyCo-purple)] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Find Place Card - Airbnb Inspired */}
          <div 
            className="easyCo-property-card group cursor-pointer"
            onClick={onFindPlace}
          >
            <div className="relative h-64 bg-gradient-to-br from-[var(--color-easyCo-mustard)] to-[var(--color-easyCo-mustard-dark)] overflow-hidden">
              <div className="easyCo-image-overlay-light" />
              
              {/* Property Preview Icons */}
              <div className="absolute top-6 right-6 flex gap-2">
                <div className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow-lg">
                  <MapPin className="w-5 h-5 text-[var(--color-easyCo-purple)]" />
                </div>
                <div className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow-lg">
                  <Building className="w-5 h-5 text-[var(--color-easyCo-purple)]" />
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 mb-3">
                  <Search className="w-8 h-8 text-black" />
                  <span className="easyCo-badge-secondary">287 Available</span>
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">Browse Properties</h2>
                <p className="text-black/80 text-base leading-relaxed">Explore curated coliving spaces across Brussels</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-easyCo-gray-600)]">
                    <Star className="w-4 h-4 text-[var(--color-easyCo-mustard-dark)]" />
                    <span>Verified Listings</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-easyCo-gray-600)]">
                    <Filter className="w-4 h-4 text-[var(--color-easyCo-mustard-dark)]" />
                    <span>Smart Filters</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[var(--color-easyCo-purple)] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access - Horizontal Cards */}
        <div className="mb-8">
          <h3 className="easyCo-heading-3 mb-4">Quick Access</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <button
              onClick={onViewFavorites}
              className="flex-shrink-0 easyCo-card p-4 min-w-[140px] hover:bg-[var(--color-easyCo-gray-50)] transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5 text-[var(--color-easyCo-purple)]" />
                <span className="easyCo-body font-medium">Favorites</span>
              </div>
              <p className="easyCo-caption text-left">{stats.savedProperties} saved places</p>
            </button>

            <button
              onClick={onViewMessages}
              className="flex-shrink-0 easyCo-card p-4 min-w-[140px] hover:bg-[var(--color-easyCo-gray-50)] transition-colors relative"
            >
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle className="w-5 h-5 text-[var(--color-easyCo-purple)]" />
                <span className="easyCo-body font-medium">Messages</span>
              </div>
              <p className="easyCo-caption text-left">{stats.activeChats} conversations</p>
              {stats.activeChats > 0 && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-easyCo-mustard)] rounded-full"></div>
              )}
            </button>

            <div className="flex-shrink-0 easyCo-card p-4 min-w-[140px]">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-[var(--color-easyCo-mustard-dark)]" />
                <span className="easyCo-body font-medium">Calendar</span>
              </div>
              <p className="easyCo-caption text-left">View schedule</p>
            </div>
          </div>
        </div>

        {/* Recent Matches Preview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="easyCo-heading-3">Recent Activity</h3>
            <button className="easyCo-body-sm text-[var(--color-easyCo-purple)] font-semibold">View All</button>
          </div>
          
          <div className="space-y-3">
            <div className="easyCo-card p-4 hover:bg-[var(--color-easyCo-gray-50)] transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[var(--color-easyCo-purple-light)] rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[var(--color-easyCo-purple)]" />
                </div>
                <div className="flex-1">
                  <p className="easyCo-body font-medium">Emma liked your profile</p>
                  <p className="easyCo-body-sm">2 hours ago</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--color-easyCo-gray-400)]" />
              </div>
            </div>

            <div className="easyCo-card p-4 hover:bg-[var(--color-easyCo-gray-50)] transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[var(--color-easyCo-mustard-light)] rounded-full flex items-center justify-center">
                  <Building className="w-5 h-5 text-[var(--color-easyCo-mustard-dark)]" />
                </div>
                <div className="flex-1">
                  <p className="easyCo-body font-medium">New property match in Ixelles</p>
                  <p className="easyCo-body-sm">5 hours ago</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--color-easyCo-gray-400)]" />
              </div>
            </div>

            <div className="easyCo-card p-4 hover:bg-[var(--color-easyCo-gray-50)] transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[var(--color-easyCo-purple-light)] rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-[var(--color-easyCo-purple)]" />
                </div>
                <div className="flex-1">
                  <p className="easyCo-body font-medium">Marcus wants to start a group</p>
                  <p className="easyCo-body-sm">1 day ago</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--color-easyCo-gray-400)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="easyCo-card p-6 bg-gradient-to-r from-[var(--color-easyCo-mustard-light)] to-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[var(--color-easyCo-mustard)] rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <div className="flex-1">
              <h4 className="easyCo-heading-3 mb-2">Complete your profile to get better matches! ✨</h4>
              <p className="easyCo-body mb-4">
                Add your interests, lifestyle preferences, and photos to connect with the right roommates.
              </p>
              <button className="easyCo-btn-primary">
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={onFindPeople}
        className="easyCo-fab"
        title="Start Matching"
      >
        <Heart className="w-6 h-6" />
      </button>
    </div>
  );
}