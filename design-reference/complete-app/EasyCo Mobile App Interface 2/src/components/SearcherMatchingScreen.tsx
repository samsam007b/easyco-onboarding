import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Heart, 
  X, 
  Star, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  CheckCircle,
  Info,
  RotateCcw,
  Users,
  ArrowLeft,
  Clock,
  Home,
  Music,
  Utensils,
  Coffee,
  BookOpen,
  Gamepad2,
  Camera,
  Dumbbell,
  Headphones,
  Palette,
  MessageCircle,
  Search,
  Sparkles,
  DollarSign,
  PartyPopper,
  UserPlus
} from "lucide-react";

interface SearcherProfile {
  id: number;
  name: string;
  age: number;
  occupation: string;
  university?: string;
  location: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  bio: string;
  budgetRange: string;
  lifestyleTags: string[];
  hobbies: string[];
  verified: boolean;
  moveInDate: string;
  images: string[];
  lookingFor: string;
  groupSize: string;
}

const SEARCHER_PROFILES: SearcherProfile[] = [
  {
    id: 1,
    name: "Emma Chen",
    age: 22,
    occupation: "Psychology Student",
    university: "KU Leuven",
    location: "Looking in Ixelles",
    avatar: "https://images.unsplash.com/photo-1561065533-316e3142d586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMGhhcHB5fGVufDF8fHx8MTc1NTUyNzU5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.9,
    reviewCount: 15,
    bio: "Psychology student looking for a calm, supportive community. I love cooking together and having deep conversations over tea. Looking for genuine connections! ☕✨",
    budgetRange: "€400-500",
    lifestyleTags: ["Early Bird", "Vegetarian", "Non-smoker", "Organized"],
    hobbies: ["Cooking", "Reading", "Yoga", "Photography"],
    verified: true,
    moveInDate: "February 2025",
    images: [
      "https://images.unsplash.com/photo-1561065533-316e3142d586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMGhhcHB5fGVufDF8fHx8MTc1NTUyNzU5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwa2l0Y2hlbiUyMGZyaWVuZGx5fGVufDF8fHx8MTc1ODQ3ODQ1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    lookingFor: "Cozy apartment with good kitchen",
    groupSize: "2-3 people"
  },
  {
    id: 2,
    name: "Marcus Williams",
    age: 24,
    occupation: "Software Developer",
    location: "Looking in Brussels Center",
    avatar: "https://images.unsplash.com/photo-1670841062505-1f8f6d45862a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwcm9mZXNzaW9uYWwlMjB5b3VuZyUyMHBlcnNvbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzU1NTI3NTk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.7,
    reviewCount: 8,
    bio: "Remote dev who loves gaming and tech meetups. Looking for roommates who appreciate good WiFi and late-night coding sessions! Always up for weekend adventures 🎮",
    budgetRange: "€600-800",
    lifestyleTags: ["Night Owl", "Gamer", "Tech-savvy", "Social"],
    hobbies: ["Gaming", "Coding", "Board Games", "Movies"],
    verified: true,
    moveInDate: "January 2025",
    images: [
      "https://images.unsplash.com/photo-1670841062505-1f8f6d45862a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwcm9mZXNzaW9uYWwlMjB5b3VuZyUyMHBlcnNvbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzU1NTI3NTk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMGRlc2t8ZW58MXx8fHwxNzU4NDc4NTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    lookingFor: "Modern place with good internet",
    groupSize: "3-4 people"
  },
  {
    id: 3,
    name: "Sofia Martinez",
    age: 23,
    occupation: "Art Student",
    university: "LUCA School of Arts",
    location: "Looking in Saint-Gilles",
    avatar: "https://images.unsplash.com/photo-1624240046299-03455da0a0bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2xsZWdlJTIwc3R1ZGVudCUyMHBvcnRyYWl0JTIwZnJpZW5kbHl8ZW58MXx8fHwxNzU1NTI3NTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.8,
    reviewCount: 12,
    bio: "Creative soul who brings color to everything! I love hosting dinner parties, painting murals, and exploring Brussels' art scene. Let's create a vibrant home together! 🎨",
    budgetRange: "€450-600",
    lifestyleTags: ["Creative", "Social", "Artistic", "Extrovert"],
    hobbies: ["Painting", "Museums", "Parties", "Photography"],
    verified: true,
    moveInDate: "March 2025",
    images: [
      "https://images.unsplash.com/photo-1624240046299-03455da0a0bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2xsZWdlJTIwc3R1ZGVudCUyMHBvcnRyYWl0JTIwZnJpZW5kbHl8ZW58MXx8fHwxNzU1NTI3NTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBzdHVkaW8lMjBwYWludGluZyUyMGNyZWF0aXZlfGVufDF8fHx8MTc1ODQ3ODU1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    lookingFor: "Bright space with creative vibes",
    groupSize: "2-4 people"
  },
  {
    id: 4,
    name: "Alex Thompson",
    age: 25,
    occupation: "Music Producer",
    location: "Looking in Etterbeek",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NTUwOTE4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.6,
    reviewCount: 23,
    bio: "Music producer seeking a harmonious living situation! I work mostly at night with good headphones - respect and creativity go hand in hand. Let's jam! 🎧",
    budgetRange: "€500-700",
    lifestyleTags: ["Musician", "Creative", "Night Owl", "Respectful"],
    hobbies: ["Music", "Concerts", "Vinyl Collecting", "Sound Design"],
    verified: true,
    moveInDate: "February 2025",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NTUwOTE4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NTg0Nzg2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    lookingFor: "Quiet neighborhood, creative space",
    groupSize: "2-3 people"
  },
  {
    id: 5,
    name: "Zara Ahmed",
    age: 21,
    occupation: "Business Student",
    university: "Solvay Brussels School",
    location: "Looking in Uccle",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU1NTA5MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.9,
    reviewCount: 18,
    bio: "Ambitious business student with a passion for fitness and adventure! Morning runs, meal prep Sundays, and weekend trips around Belgium. Let's build something amazing! 💪",
    budgetRange: "€450-550",
    lifestyleTags: ["Early Bird", "Fitness", "Organized", "Adventurous"],
    hobbies: ["Fitness", "Business", "Travel", "Hiking"],
    verified: true,
    moveInDate: "January 2025",
    images: [
      "https://images.unsplash.com/photo-1494790108755-2616b612e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU1NTA5MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltJTIwd29ya291dHxlbnwxfHx8fDE3NTg0Nzg2NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    lookingFor: "Modern apartment with gym nearby",
    groupSize: "3-4 people"
  }
];

const getTagIcon = (tag: string) => {
  const iconMap: { [key: string]: any } = {
    "Early Bird": Clock,
    "Night Owl": Clock,
    "Musician": Music,
    "Vegetarian": Utensils,
    "Social": Users,
    "Creative": Palette,
    "Gamer": Gamepad2,
    "Fitness": Dumbbell,
    "Organized": CheckCircle,
    "Tech-savvy": BookOpen,
    "Artist": Camera,
    "Coffee": Coffee,
    "Music": Headphones
  };
  return iconMap[tag] || Users;
};

const getTagColor = (tag: string) => {
  const colorMap: { [key: string]: string } = {
    "Early Bird": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Night Owl": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "Musician": "bg-purple-100 text-purple-800 border-purple-200",
    "Vegetarian": "bg-green-100 text-green-800 border-green-200",
    "Social": "bg-pink-100 text-pink-800 border-pink-200",
    "Creative": "bg-orange-100 text-orange-800 border-orange-200",
    "Gamer": "bg-blue-100 text-blue-800 border-blue-200",
    "Fitness": "bg-red-100 text-red-800 border-red-200",
    "Organized": "bg-teal-100 text-teal-800 border-teal-200",
    "Tech-savvy": "bg-gray-100 text-gray-800 border-gray-200",
    "Extrovert": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Adventurous": "bg-green-100 text-green-800 border-green-200",
    "Artistic": "bg-purple-100 text-purple-800 border-purple-200",
    "Respectful": "bg-blue-100 text-blue-800 border-blue-200",
    "Non-smoker": "bg-teal-100 text-teal-800 border-teal-200"
  };
  return colorMap[tag] || "bg-gray-100 text-gray-800 border-gray-200";
};

const getHobbyIcon = (hobby: string) => {
  const iconMap: { [key: string]: any } = {
    "Cooking": Utensils,
    "Reading": BookOpen,
    "Yoga": Dumbbell,
    "Photography": Camera,
    "Gaming": Gamepad2,
    "Coding": BookOpen,
    "Board Games": Gamepad2,
    "Movies": Camera,
    "Painting": Palette,
    "Museums": Camera,
    "Parties": Users,
    "Music": Headphones,
    "Concerts": Music,
    "Vinyl Collecting": Music,
    "Sound Design": Headphones,
    "Fitness": Dumbbell,
    "Business": Briefcase,
    "Travel": MapPin,
    "Hiking": MapPin
  };
  return iconMap[hobby] || Coffee;
};

interface SearcherMatchingScreenProps {
  onBack: () => void;
  onStartGroup?: () => void;
  onSearchTogether?: () => void;
}

export function SearcherMatchingScreen({ onBack, onStartGroup, onSearchTogether }: SearcherMatchingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<number[]>([]);
  const [rejected, setRejected] = useState<number[]>([]);
  const [showNoMore, setShowNoMore] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [matchedProfile, setMatchedProfile] = useState<SearcherProfile | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentProfile = SEARCHER_PROFILES[currentIndex];

  const handleLike = () => {
    if (currentProfile) {
      setMatches(prev => [...prev, currentProfile.id]);
      
      // Simulate a match (50% chance for demo purposes)
      if (Math.random() > 0.5) {
        setMatchedProfile(currentProfile);
        setShowMatchModal(true);
      }
      
      nextProfile();
    }
  };

  const handlePass = () => {
    if (currentProfile) {
      setRejected(prev => [...prev, currentProfile.id]);
      nextProfile();
    }
  };

  const nextProfile = () => {
    setCurrentImageIndex(0);
    setDragX(0);
    if (currentIndex < SEARCHER_PROFILES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowNoMore(true);
    }
  };

  const resetStack = () => {
    setCurrentIndex(0);
    setMatches([]);
    setRejected([]);
    setShowNoMore(false);
    setCurrentImageIndex(0);
    setShowMatchModal(false);
    setMatchedProfile(null);
  };

  const handleImageNext = () => {
    if (currentProfile && currentImageIndex < currentProfile.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const handleImagePrev = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  // Simulated swipe gestures
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      setDragX(x);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      if (dragX > 100) {
        handleLike();
      } else if (dragX < -100) {
        handlePass();
      }
      setIsDragging(false);
      setDragX(0);
    }
  };

  const closeMatchModal = () => {
    setShowMatchModal(false);
    setMatchedProfile(null);
  };

  // Match Modal
  if (showMatchModal && matchedProfile) {
    return (
      <Dialog open={showMatchModal} onOpenChange={closeMatchModal}>
        <DialogContent className="max-w-sm mx-auto rounded-3xl border-0 p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-[var(--color-easyCo-mustard)] to-yellow-300 rounded-full flex items-center justify-center animate-pulse">
                  <PartyPopper className="w-10 h-10 text-black" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-[var(--color-easyCo-purple)] to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[var(--color-easyCo-purple)] mb-2">
              It's a Match! 🎉
            </h2>
            <p className="text-[var(--color-easyCo-gray-dark)] mb-6 leading-relaxed">
              You and <span className="font-semibold text-[var(--color-easyCo-purple)]">{matchedProfile.name}</span> both liked each other!
              Time to start your coliving journey together.
            </p>

            {/* Matched Profiles Preview */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="text-center">
                <Avatar className="w-16 h-16 mx-auto mb-2 border-4 border-white shadow-lg">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VyJTIwcHJvZmlsZSUyMGF2YXRhcnxlbnwxfHx8fDE3NTg0Nzk5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="You" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium text-[var(--color-easyCo-purple)]">You</p>
              </div>

              <div className="flex items-center justify-center">
                <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
              </div>

              <div className="text-center">
                <Avatar className="w-16 h-16 mx-auto mb-2 border-4 border-white shadow-lg">
                  <AvatarImage src={matchedProfile.avatar} alt={matchedProfile.name} />
                  <AvatarFallback>{matchedProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium text-[var(--color-easyCo-purple)]">{matchedProfile.name}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => {
                  closeMatchModal();
                  onStartGroup?.();
                }}
                className="w-full bg-gradient-to-r from-[var(--color-easyCo-mustard)] to-yellow-300 hover:from-[var(--color-easyCo-mustard-dark)] hover:to-[var(--color-easyCo-mustard)] text-black rounded-2xl h-12 font-medium"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Start a Group
              </Button>

              <Button
                onClick={() => {
                  closeMatchModal();
                  // Handle chat action
                }}
                variant="outline"
                className="w-full border-2 border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] hover:bg-[var(--color-easyCo-purple)] hover:text-white rounded-2xl h-12 font-medium"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Send Message
              </Button>

              <Button
                onClick={() => {
                  closeMatchModal();
                  onSearchTogether?.();
                }}
                variant="outline"
                className="w-full border-2 border-[var(--color-easyCo-gray-medium)] text-[var(--color-easyCo-gray-dark)] hover:bg-[var(--color-easyCo-gray-light)] rounded-2xl h-12 font-medium"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Properties Together
              </Button>

              <Button
                onClick={closeMatchModal}
                variant="ghost"
                className="w-full text-[var(--color-easyCo-gray-dark)] hover:bg-[var(--color-easyCo-gray-light)] rounded-2xl h-10 text-sm"
              >
                Keep Swiping
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showNoMore) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-easyCo-purple)]/10 via-[var(--color-easyCo-gray-light)] to-[var(--color-easyCo-mustard)]/10 flex flex-col items-center justify-center p-6">
        <Card className="bg-white border-0 rounded-3xl shadow-xl p-8 text-center max-w-sm">
          <div className="w-24 h-24 bg-gradient-to-r from-[var(--color-easyCo-purple)] to-[var(--color-easyCo-purple-light)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-easyCo-purple)] mb-4">
            You've seen everyone! 🌟
          </h2>
          <p className="text-[var(--color-easyCo-gray-dark)] mb-6 leading-relaxed">
            New searchers join EasyCo every day. Check back soon for more potential groupmates!
          </p>
          
          {matches.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">🎉 You have {matches.length} potential connections!</h3>
              <p className="text-sm text-green-700">Start building your coliving group</p>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={resetStack}
              className="w-full bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl py-3"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Review Again
            </Button>
            <Button 
              onClick={onBack}
              variant="outline"
              className="w-full border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-2xl py-3"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Search
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentProfile) {
    return <div>Loading...</div>;
  }

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
              <h1 className="text-xl font-semibold text-white">Find Your Group 👥</h1>
              <p className="text-white/80 text-sm">Connect with fellow searchers</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--color-easyCo-mustard)]">{matches.length}</div>
            <div className="text-white/80 text-xs">connections</div>
          </div>
        </div>
        
        {/* Progress */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[var(--color-easyCo-mustard)] to-yellow-300 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / SEARCHER_PROFILES.length) * 100}%` }}
            />
          </div>
          <span className="text-white/80 text-sm font-medium">
            {currentIndex + 1}/{SEARCHER_PROFILES.length}
          </span>
        </div>
      </div>

      {/* Swipeable Card */}
      <div className="p-6 flex justify-center">
        <div 
          ref={cardRef}
          className="relative w-full max-w-sm"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <Card 
            className={`overflow-hidden shadow-2xl border-0 rounded-3xl cursor-grab ${isDragging ? 'cursor-grabbing' : ''} transition-transform duration-200`}
            style={{
              transform: `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`,
              opacity: isDragging ? 0.9 : 1
            }}
          >
            {/* Image Section */}
            <div className="relative h-80">
              <ImageWithFallback
                src={currentProfile.images[currentImageIndex]}
                alt={`${currentProfile.name} - Photo ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation Dots */}
              {currentProfile.images.length > 1 && (
                <div className="absolute top-4 left-4 right-4 flex gap-1">
                  {currentProfile.images.map((_, index) => (
                    <div
                      key={index}
                      className={`flex-1 h-1 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Tap zones for navigation */}
              <div 
                className="absolute top-0 left-0 w-1/2 h-full"
                onClick={handleImagePrev}
              />
              <div 
                className="absolute top-0 right-0 w-1/2 h-full"
                onClick={handleImageNext}
              />

              {/* Status Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {currentProfile.verified && (
                  <Badge className="bg-[var(--color-easyCo-mustard)] text-black shadow-lg border-0">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              {/* Swipe Indicators */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                dragX > 50 ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="bg-green-500 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-xl transform rotate-12">
                  CONNECT 💚
                </div>
              </div>
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                dragX < -50 ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-xl transform -rotate-12">
                  PASS ✕
                </div>
              </div>

              {/* Name and Basic Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {currentProfile.name}, {currentProfile.age}
                </h2>
                <div className="flex items-center text-white/90 text-sm mb-2">
                  <Star className="w-4 h-4 text-[var(--color-easyCo-mustard)] mr-1" fill="currentColor" />
                  <span className="font-medium">{currentProfile.rating}</span>
                  <span className="ml-1">({currentProfile.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {currentProfile.location}
                </div>
              </div>
            </div>
            
            <CardContent className="p-6 space-y-5">
              {/* Basic Info */}
              <div className="space-y-3">
                <div className="flex items-center text-[var(--color-easyCo-gray-dark)] text-sm">
                  <Briefcase className="w-4 h-4 mr-2 text-[var(--color-easyCo-purple)]" />
                  {currentProfile.occupation}
                </div>
                {currentProfile.university && (
                  <div className="flex items-center text-[var(--color-easyCo-gray-dark)] text-sm">
                    <GraduationCap className="w-4 h-4 mr-2 text-[var(--color-easyCo-purple)]" />
                    {currentProfile.university}
                  </div>
                )}
              </div>

              {/* Bio */}
              <div>
                <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-2 text-lg">About Me</h3>
                <p className="text-sm text-[var(--color-easyCo-gray-dark)] leading-relaxed">
                  {currentProfile.bio}
                </p>
              </div>

              {/* Budget & Preferences */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-[var(--color-easyCo-gray-light)] to-gray-50 rounded-2xl">
                <div>
                  <div className="text-xs text-[var(--color-easyCo-gray-dark)] mb-1 font-medium flex items-center">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Budget
                  </div>
                  <div className="font-semibold text-sm text-[var(--color-easyCo-purple)]">{currentProfile.budgetRange}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-easyCo-gray-dark)] mb-1 font-medium flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    Group Size
                  </div>
                  <div className="font-semibold text-sm text-[var(--color-easyCo-purple)]">{currentProfile.groupSize}</div>
                </div>
              </div>

              {/* Lifestyle Tags */}
              <div>
                <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-3 text-lg">Lifestyle</h3>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.lifestyleTags.map((tag) => {
                    const IconComponent = getTagIcon(tag);
                    return (
                      <Badge 
                        key={tag} 
                        className={`${getTagColor(tag)} text-xs px-3 py-1 rounded-full border flex items-center gap-1`}
                      >
                        <IconComponent className="w-3 h-3" />
                        {tag}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Hobbies */}
              <div>
                <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-3 text-lg">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.hobbies.map((hobby) => {
                    const IconComponent = getHobbyIcon(hobby);
                    return (
                      <Badge 
                        key={hobby} 
                        variant="outline"
                        className="border-[var(--color-easyCo-gray-medium)] text-[var(--color-easyCo-gray-dark)] text-xs px-3 py-1 rounded-full flex items-center gap-1"
                      >
                        <IconComponent className="w-3 h-3" />
                        {hobby}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Looking For */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
                <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-2 flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  Looking For
                </h3>
                <p className="text-sm text-[var(--color-easyCo-gray-dark)]">{currentProfile.lookingFor}</p>
                <p className="text-xs text-[var(--color-easyCo-gray-dark)] mt-2">
                  Moving in: {currentProfile.moveInDate}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <Button
              onClick={handlePass}
              size="lg"
              className="w-16 h-16 rounded-full bg-white border-4 border-red-200 hover:border-red-400 hover:bg-red-50 shadow-lg transition-all duration-200 p-0"
            >
              <X className="w-8 h-8 text-red-500" />
            </Button>
            
            <Button
              className="w-12 h-12 rounded-full bg-white border-2 border-[var(--color-easyCo-gray-medium)] hover:bg-[var(--color-easyCo-gray-light)] p-0 shadow-md"
            >
              <Info className="w-5 h-5 text-[var(--color-easyCo-purple)]" />
            </Button>
            
            <Button
              onClick={handleLike}
              size="lg"
              className="w-16 h-16 rounded-full bg-gradient-to-r from-[var(--color-easyCo-mustard)] to-yellow-300 hover:from-[var(--color-easyCo-mustard-dark)] hover:to-[var(--color-easyCo-mustard)] text-black shadow-lg transition-all duration-200 p-0"
            >
              <Heart className="w-8 h-8" />
            </Button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-[var(--color-easyCo-gray-dark)] flex items-center justify-center gap-2">
              Tap <X className="w-4 h-4 text-red-500" /> to pass or <Heart className="w-4 h-4 text-[var(--color-easyCo-mustard)]" /> to connect
            </p>
            <p className="text-xs text-[var(--color-easyCo-gray-dark)] mt-1">
              Or swipe the card left/right
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}