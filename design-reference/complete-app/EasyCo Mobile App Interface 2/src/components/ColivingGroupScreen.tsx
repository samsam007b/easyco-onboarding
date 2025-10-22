import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { 
  ArrowLeft, 
  Users, 
  MapPin, 
  DollarSign, 
  Home, 
  UserPlus, 
  UserMinus,
  Search,
  MessageCircle,
  Star,
  Calendar,
  Coffee,
  Music,
  Utensils,
  BookOpen,
  Dumbbell,
  Camera,
  Heart,
  Settings,
  Share2,
  Target,
  CheckCircle,
  Clock,
  Sparkles,
  Zap,
  TrendingUp
} from "lucide-react";

interface GroupMember {
  id: number;
  name: string;
  age: number;
  avatar: string;
  role: "creator" | "member";
  joinedAt: string;
  compatibility: number;
  topHobbies: string[];
}

interface GroupPreferences {
  budgetRange: { min: number; max: number };
  preferredLocations: string[];
  groupSize: { current: number; target: number };
  lifestyleCompatibility: string[];
  moveInDate: string;
  propertyType: string[];
  musthaveAmenities: string[];
}

const GROUP_MEMBERS: GroupMember[] = [
  {
    id: 1,
    name: "You",
    age: 24,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VyJTIwcHJvZmlsZSUyMGF2YXRhcnxlbnwxfHx8fDE3NTg0Nzk5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    role: "creator",
    joinedAt: "Created group",
    compatibility: 100,
    topHobbies: ["Reading", "Cooking", "Music"]
  },
  {
    id: 2,
    name: "Emma Chen",
    age: 22,
    avatar: "https://images.unsplash.com/photo-1561065533-316e3142d586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMGhhcHB5fGVufDF8fHx8MTc1NTUyNzU5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    role: "member",
    joinedAt: "2 days ago",
    compatibility: 94,
    topHobbies: ["Yoga", "Cooking", "Photography"]
  },
  {
    id: 3,
    name: "Marcus Williams",
    age: 24,
    avatar: "https://images.unsplash.com/photo-1670841062505-1f8f6d45862a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwcm9mZXNzaW9uYWwlMjB5b3VuZyUyMHBlcnNvbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzU1NTI3NTk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    role: "member",
    joinedAt: "1 day ago",
    compatibility: 89,
    topHobbies: ["Gaming", "Movies", "Tech"]
  }
];

const GROUP_PREFERENCES: GroupPreferences = {
  budgetRange: { min: 400, max: 600 },
  preferredLocations: ["Ixelles", "Brussels Center", "Saint-Gilles"],
  groupSize: { current: 3, target: 4 },
  lifestyleCompatibility: ["Social", "Organized", "Creative", "Tech-savvy"],
  moveInDate: "February 2025",
  propertyType: ["Apartment", "House"],
  musthaveAmenities: ["Fast WiFi", "Full Kitchen", "Good Transport"]
};

const getHobbyIcon = (hobby: string) => {
  const iconMap: { [key: string]: any } = {
    "Reading": BookOpen,
    "Cooking": Utensils,
    "Music": Music,
    "Yoga": Dumbbell,
    "Photography": Camera,
    "Gaming": Settings,
    "Movies": Camera,
    "Tech": Settings
  };
  return iconMap[hobby] || Coffee;
};

interface ColivingGroupScreenProps {
  onBack: () => void;
  onFindProperties: () => void;
  onGroupChat: () => void;
}

export function ColivingGroupScreen({ onBack, onFindProperties, onGroupChat }: ColivingGroupScreenProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const averageCompatibility = Math.round(
    GROUP_MEMBERS.reduce((sum, member) => sum + member.compatibility, 0) / GROUP_MEMBERS.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-easyCo-purple)]/10 via-white to-[var(--color-easyCo-mustard)]/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--color-easyCo-purple)] via-[var(--color-easyCo-purple-light)] to-[var(--color-easyCo-purple)] px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/20 rounded-2xl p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-white">Your Coliving Group 🏠</h1>
              <p className="text-white/80 text-sm">Find the perfect place together</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-2xl p-2"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Group Compatibility Score */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[var(--color-easyCo-mustard)] mb-1">
                {averageCompatibility}% Match
              </div>
              <div className="text-white/80 text-sm">Group Compatibility</div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-[var(--color-easyCo-mustard)] to-yellow-300 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-black" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6 pb-8">
        {/* Group Members Section */}
        <Card className="border-0 rounded-3xl shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--color-easyCo-purple)] flex items-center gap-2">
                <Users className="w-6 h-6" />
                Group Members ({GROUP_MEMBERS.length}/{GROUP_PREFERENCES.groupSize.target})
              </h2>
              <Button
                onClick={() => setShowInviteModal(true)}
                size="sm"
                className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </div>

            <div className="space-y-4">
              {GROUP_MEMBERS.map((member) => (
                <div key={member.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-[var(--color-easyCo-gray-light)] to-gray-50 rounded-2xl">
                  <div className="relative">
                    <Avatar className="w-14 h-14 border-4 border-white shadow-md">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {member.role === "creator" && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-[var(--color-easyCo-mustard)] to-yellow-300 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-black" fill="currentColor" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[var(--color-easyCo-purple)]">
                        {member.name}
                        {member.name !== "You" && `, ${member.age}`}
                      </h3>
                      {member.role === "creator" && (
                        <Badge className="bg-[var(--color-easyCo-mustard)] text-black text-xs">
                          Creator
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-[var(--color-easyCo-gray-dark)] mb-2">{member.joinedAt}</p>
                    
                    {/* Compatibility & Hobbies */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-pink-500" fill="currentColor" />
                        <span className="text-sm font-medium text-pink-600">{member.compatibility}%</span>
                      </div>
                      <div className="flex gap-1">
                        {member.topHobbies.slice(0, 3).map((hobby) => {
                          const IconComponent = getHobbyIcon(hobby);
                          return (
                            <div key={hobby} className="w-6 h-6 bg-white rounded-lg flex items-center justify-center" title={hobby}>
                              <IconComponent className="w-3 h-3 text-[var(--color-easyCo-purple)]" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={onGroupChat}
                    variant="outline"
                    size="sm"
                    className="border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-purple)] hover:text-white rounded-2xl"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Progress to Target Size */}
            {GROUP_PREFERENCES.groupSize.current < GROUP_PREFERENCES.groupSize.target && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-5 h-5 text-[var(--color-easyCo-purple)]" />
                  <span className="font-medium text-[var(--color-easyCo-purple)]">
                    Looking for {GROUP_PREFERENCES.groupSize.target - GROUP_PREFERENCES.groupSize.current} more member{GROUP_PREFERENCES.groupSize.target - GROUP_PREFERENCES.groupSize.current > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[var(--color-easyCo-purple)] to-[var(--color-easyCo-purple-light)] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(GROUP_PREFERENCES.groupSize.current / GROUP_PREFERENCES.groupSize.target) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-[var(--color-easyCo-gray-dark)] mt-2">
                  Larger groups often find better deals and create stronger communities!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shared Preferences */}
        <Card className="border-0 rounded-3xl shadow-lg bg-white">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-[var(--color-easyCo-purple)] mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Shared Preferences
            </h2>

            <div className="grid grid-cols-1 gap-6">
              {/* Budget & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium text-green-800">Budget</span>
                  </div>
                  <p className="text-lg font-bold text-green-700">
                    €{GROUP_PREFERENCES.budgetRange.min}-{GROUP_PREFERENCES.budgetRange.max}
                  </p>
                  <p className="text-sm text-green-600">per person/month</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-blue-800">Move-in</span>
                  </div>
                  <p className="text-lg font-bold text-blue-700">{GROUP_PREFERENCES.moveInDate}</p>
                  <p className="text-sm text-blue-600">target date</p>
                </div>
              </div>

              {/* Preferred Locations */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-medium text-[var(--color-easyCo-purple)]">Preferred Areas</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {GROUP_PREFERENCES.preferredLocations.map((location) => (
                    <Badge key={location} className="bg-purple-100 text-purple-800 border-purple-200 rounded-xl">
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Lifestyle Compatibility */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Heart className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="font-medium text-[var(--color-easyCo-purple)]">Lifestyle Match</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {GROUP_PREFERENCES.lifestyleCompatibility.map((trait) => (
                    <Badge key={trait} className="bg-orange-100 text-orange-800 border-orange-200 rounded-xl">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Must-Have Amenities */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span className="font-medium text-[var(--color-easyCo-purple)]">Must-Have Amenities</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {GROUP_PREFERENCES.musthaveAmenities.map((amenity) => (
                    <Badge key={amenity} className="bg-yellow-100 text-yellow-800 border-yellow-200 rounded-xl">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Compatibility Indicator */}
            <div className="mt-6 p-4 bg-gradient-to-r from-[var(--color-easyCo-mustard)]/20 to-yellow-100 rounded-2xl border border-[var(--color-easyCo-mustard)]/30">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-[var(--color-easyCo-mustard-dark)]" />
                <div>
                  <p className="font-medium text-[var(--color-easyCo-mustard-dark)]">Great Compatibility!</p>
                  <p className="text-sm text-[var(--color-easyCo-gray-dark)]">
                    Your group preferences align well - this should make finding properties much easier.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Primary CTA */}
          <Button
            onClick={onFindProperties}
            className="w-full bg-gradient-to-r from-[var(--color-easyCo-mustard)] to-yellow-300 hover:from-[var(--color-easyCo-mustard-dark)] hover:to-[var(--color-easyCo-mustard)] text-black rounded-2xl h-14 text-lg font-semibold shadow-lg"
          >
            <Search className="w-6 h-6 mr-3" />
            Find Properties for Our Group
          </Button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onGroupChat}
              variant="outline"
              className="border-2 border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-purple)] hover:text-white rounded-2xl h-12"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Group Chat
            </Button>
            
            <Button
              onClick={() => setShowInviteModal(true)}
              variant="outline"
              className="border-2 border-[var(--color-easyCo-gray-medium)] text-[var(--color-easyCo-gray-dark)] hover:bg-[var(--color-easyCo-gray-light)] rounded-2xl h-12"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Invite Friend
            </Button>
          </div>

          {/* Leave Group */}
          <Button
            onClick={() => setShowLeaveModal(true)}
            variant="ghost"
            className="w-full text-red-600 hover:bg-red-50 rounded-2xl h-10 text-sm"
          >
            <UserMinus className="w-4 h-4 mr-2" />
            Leave Group
          </Button>
        </div>
      </div>

      {/* Invite Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="max-w-sm mx-auto rounded-3xl border-0">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-[var(--color-easyCo-purple)]">
              Invite Someone to Your Group 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-[var(--color-easyCo-gray-dark)]">
              Share your group link or search for people to invite directly.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            
            <div className="space-y-3">
              <Button 
                className="w-full bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl"
                onClick={() => setShowInviteModal(false)}
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Group Link
              </Button>
              <Button 
                variant="outline"
                className="w-full border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-2xl"
                onClick={() => setShowInviteModal(false)}
              >
                <Search className="w-5 h-5 mr-2" />
                Find More People
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Leave Group Modal */}
      <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
        <DialogContent className="max-w-sm mx-auto rounded-3xl border-0">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-red-600">
              Leave Coliving Group?
            </DialogTitle>
            <DialogDescription className="text-center text-[var(--color-easyCo-gray-dark)]">
              Are you sure you want to leave this group? You'll lose access to group chats and shared property searches.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            
            <div className="space-y-3">
              <Button 
                className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl"
                onClick={() => {
                  setShowLeaveModal(false);
                  onBack();
                }}
              >
                Yes, Leave Group
              </Button>
              <Button 
                variant="outline"
                className="w-full border-[var(--color-easyCo-gray-medium)] text-[var(--color-easyCo-gray-dark)] rounded-2xl"
                onClick={() => setShowLeaveModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}