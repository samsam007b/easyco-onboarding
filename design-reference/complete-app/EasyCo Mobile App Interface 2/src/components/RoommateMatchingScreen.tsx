import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
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
  Palette
} from "lucide-react";

interface PotentialRoommate {
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
  lifestyleTags: string[];
  verified: boolean;
  moveInDate: string;
  budget: string;
  images: string[];
  interests: string[];
}

const POTENTIAL_ROOMMATES: PotentialRoommate[] = [
  {
    id: 1,
    name: "Emma Wilson",
    age: 22,
    occupation: "Psychology Student",
    university: "KU Leuven",
    location: "Leuven",
    avatar: "https://images.unsplash.com/photo-1561065533-316e3142d586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMGhhcHB5fGVufDF8fHx8MTc1NTUyNzU5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.9,
    reviewCount: 15,
    bio: "Psychology student who loves cooking together and quiet study sessions. I'm organized, respectful, and always up for meaningful conversations over coffee ☕",
    lifestyleTags: ["Early Bird", "Vegetarian", "Non-smoker", "Organized", "Social"],
    verified: true,
    moveInDate: "February 2025",
    budget: "€400-500",
    images: [
      "https://images.unsplash.com/photo-1561065533-316e3142d586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMGhhcHB5fGVufDF8fHx8MTc1NTUyNzU5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwa2l0Y2hlbiUyMGZyaWVuZGx5fGVufDF8fHx8MTc1ODQ3ODQ1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    interests: ["Cooking", "Reading", "Yoga", "Psychology", "Coffee"]
  },
  {
    id: 2,
    name: "Lucas Martinez",
    age: 24,
    occupation: "Software Developer",
    location: "Brussels",
    avatar: "https://images.unsplash.com/photo-1670841062505-1f8f6d45862a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB5b3VuZyUyMHBlcnNvbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzU1NTI3NTk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.7,
    reviewCount: 8,
    bio: "Remote software developer who enjoys gaming and tech discussions. I'm clean, respectful of personal space, but love hanging out and sharing experiences 🎮",
    lifestyleTags: ["Night Owl", "Gamer", "Tech-savvy", "Clean", "Flexible"],
    verified: true,
    moveInDate: "January 2025",
    budget: "€600-800",
    images: [
      "https://images.unsplash.com/photo-1670841062505-1f8f6d45862a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhwcm9mZXNzaW9uYWwlMjB5b3VuZyUyMHBlcnNvbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzU1NTI3NTk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMGRlc2t8ZW58MXx8fHwxNzU4NDc4NTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    interests: ["Gaming", "Coding", "Tech", "Movies", "Fitness"]
  },
  {
    id: 3,
    name: "Sophie Chen",
    age: 23,
    occupation: "Art Student",
    university: "LUCA School of Arts",
    location: "Brussels",
    avatar: "https://images.unsplash.com/photo-1624240046299-03455da0a0bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2xsZWdlJTIwc3R1ZGVudCUyMHBvcnRyYWl0JTIwZnJpZW5kbHl8ZW58MXx8fHwxNzU1NTI3NTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.8,
    reviewCount: 12,
    bio: "Creative art student who brings positive energy everywhere. I love hosting dinner parties, painting, and exploring Brussels' art scene 🎨",
    lifestyleTags: ["Creative", "Social", "Artistic", "International", "Extrovert"],
    verified: true,
    moveInDate: "March 2025",
    budget: "€450-600",
    images: [
      "https://images.unsplash.com/photo-1624240046299-03455da0a0bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2xsZWdlJTIwc3R1ZGVudCUyMHBvcnRyYWl0JTIwZnJpZW5kbHl8ZW58MXx8fHwxNzU1NTI3NTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBzdHVkaW8lMjBwYWludGluZyUyMGNyZWF0aXZlfGVufDF8fHx8MTc1ODQ3ODU1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    interests: ["Art", "Painting", "Museums", "Parties", "Culture"]
  },
  {
    id: 4,
    name: "Alex Thompson",
    age: 25,
    occupation: "Music Producer",
    location: "Brussels",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NTUwOTE4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.6,
    reviewCount: 23,
    bio: "Music producer who's passionate about sound and creativity. I work mostly at night but with good headphones - respect for everyone's space is key 🎧",
    lifestyleTags: ["Musician", "Creative", "Night Owl", "Respectful", "Independent"],
    verified: true,
    moveInDate: "February 2025",
    budget: "€500-700",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NTUwOTE4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NTg0Nzg2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    interests: ["Music", "Production", "Concerts", "Vinyl", "Sound Design"]
  },
  {
    id: 5,
    name: "Maria Rodriguez",
    age: 21,
    occupation: "Business Student",
    university: "Solvay Brussels School",
    location: "Brussels",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU1NTA5MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.9,
    reviewCount: 18,
    bio: "Business student with a passion for fitness and healthy living. I love morning workouts, meal prep, and weekend adventures around Belgium 💪",
    lifestyleTags: ["Early Bird", "Fitness", "Organized", "Adventurous", "Healthy"],
    verified: true,
    moveInDate: "January 2025",
    budget: "€450-550",
    images: [
      "https://images.unsplash.com/photo-1494790108755-2616b612e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU1NTA5MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3ltJTIwd29ya291dHxlbnwxfHx8fDE3NTg0Nzg2NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    interests: ["Fitness", "Business", "Travel", "Nutrition", "Hiking"]
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
    "Early Bird": "bg-yellow-100 text-yellow-800",
    "Night Owl": "bg-indigo-100 text-indigo-800",
    "Musician": "bg-purple-100 text-purple-800",
    "Vegetarian": "bg-green-100 text-green-800",
    "Social": "bg-pink-100 text-pink-800",
    "Creative": "bg-orange-100 text-orange-800",
    "Gamer": "bg-blue-100 text-blue-800",
    "Fitness": "bg-red-100 text-red-800",
    "Organized": "bg-teal-100 text-teal-800",
    "Tech-savvy": "bg-gray-100 text-gray-800",
    "Clean": "bg-cyan-100 text-cyan-800",
    "Flexible": "bg-lime-100 text-lime-800"
  };
  return colorMap[tag] || "bg-gray-100 text-gray-800";
};

interface RoommateMatchingScreenProps {
  onBack: () => void;
}

export function RoommateMatchingScreen({ onBack }: RoommateMatchingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<number[]>([]);
  const [rejected, setRejected] = useState<number[]>([]);
  const [showNoMore, setShowNoMore] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentCandidate = POTENTIAL_ROOMMATES[currentIndex];

  const handleLike = () => {
    if (currentCandidate) {
      setMatches(prev => [...prev, currentCandidate.id]);
      nextCandidate();
    }
  };

  const handlePass = () => {
    if (currentCandidate) {
      setRejected(prev => [...prev, currentCandidate.id]);
      nextCandidate();
    }
  };

  const nextCandidate = () => {
    setCurrentImageIndex(0);
    setDragX(0);
    if (currentIndex < POTENTIAL_ROOMMATES.length - 1) {
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
  };

  const handleImageNext = () => {
    if (currentCandidate && currentImageIndex < currentCandidate.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const handleImagePrev = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  // Simulated swipe gestures (in a real app, you'd use touch events)
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

  if (showNoMore) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-easyCo-purple)]/10 via-[var(--color-easyCo-gray-light)] to-[var(--color-easyCo-mustard)]/10 flex flex-col items-center justify-center p-6">
        <Card className="bg-white border-0 rounded-3xl shadow-xl p-8 text-center max-w-sm">
          <div className="w-24 h-24 bg-gradient-to-r from-[var(--color-easyCo-purple)] to-[var(--color-easyCo-purple-light)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-easyCo-purple)] mb-4">
            That's everyone for now! 💫
          </h2>
          <p className="text-[var(--color-easyCo-gray-dark)] mb-6 leading-relaxed">
            You've seen all potential roommates. New people join EasyCo daily, so check back soon!
          </p>
          
          {matches.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">🎉 You have {matches.length} matches!</h3>
              <p className="text-sm text-green-700">Start conversations with your potential roommates</p>
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
              Back to Hub
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentCandidate) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-easyCo-purple)]/10 via-[var(--color-easyCo-gray-light)] to-[var(--color-easyCo-mustard)]/10">
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
              <h1 className="text-xl font-semibold text-white">Find Your Match 💫</h1>
              <p className="text-white/80 text-sm">Discover your perfect roommate</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[var(--color-easyCo-mustard)]">{matches.length}</div>
            <div className="text-white/80 text-xs">matches</div>
          </div>
        </div>
        
        {/* Progress */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[var(--color-easyCo-mustard)] to-yellow-300 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / POTENTIAL_ROOMMATES.length) * 100}%` }}
            />
          </div>
          <span className="text-white/80 text-sm font-medium">
            {currentIndex + 1}/{POTENTIAL_ROOMMATES.length}
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
              transform: `translateX(${dragX}px) rotate(${dragX * 0.1}deg)`,
              opacity: isDragging ? 0.9 : 1
            }}
          >
            {/* Image Section with Navigation */}
            <div className="relative h-96">
              <ImageWithFallback
                src={currentCandidate.images[currentImageIndex]}
                alt={`${currentCandidate.name} - Photo ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation Dots */}
              {currentCandidate.images.length > 1 && (
                <div className="absolute top-4 left-4 right-4 flex gap-1">
                  {currentCandidate.images.map((_, index) => (
                    <div
                      key={index}
                      className={`flex-1 h-1 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Invisible tap zones for navigation */}
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
                {currentCandidate.verified && (
                  <Badge className="bg-[var(--color-easyCo-mustard)] text-black shadow-lg">
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
                  LIKE ❤️
                </div>
              </div>
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                dragX < -50 ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-xl transform -rotate-12">
                  PASS ✕
                </div>
              </div>

              {/* Name and Age Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {currentCandidate.name}, {currentCandidate.age}
                </h2>
                <div className="flex items-center text-white/90 text-sm mb-2">
                  <Star className="w-4 h-4 text-[var(--color-easyCo-mustard)] mr-1" fill="currentColor" />
                  <span className="font-medium">{currentCandidate.rating}</span>
                  <span className="ml-1">({currentCandidate.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center text-white/80 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {currentCandidate.location}
                </div>
              </div>
            </div>
            
            <CardContent className="p-6 space-y-5">
              {/* Basic Info */}
              <div className="space-y-3">
                <div className="flex items-center text-[var(--color-easyCo-gray-dark)] text-sm">
                  <Briefcase className="w-4 h-4 mr-2 text-[var(--color-easyCo-purple)]" />
                  {currentCandidate.occupation}
                </div>
                {currentCandidate.university && (
                  <div className="flex items-center text-[var(--color-easyCo-gray-dark)] text-sm">
                    <GraduationCap className="w-4 h-4 mr-2 text-[var(--color-easyCo-purple)]" />
                    {currentCandidate.university}
                  </div>
                )}
              </div>

              {/* Bio */}
              <div>
                <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-2 text-lg">About Me</h3>
                <p className="text-sm text-[var(--color-easyCo-gray-dark)] leading-relaxed">
                  {currentCandidate.bio}
                </p>
              </div>

              {/* Lifestyle Tags */}
              <div>
                <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-3 text-lg">Lifestyle</h3>
                <div className="flex flex-wrap gap-2">
                  {currentCandidate.lifestyleTags.map((tag) => {
                    const IconComponent = getTagIcon(tag);
                    return (
                      <Badge 
                        key={tag} 
                        className={`${getTagColor(tag)} text-xs px-3 py-1 rounded-full border-0 flex items-center gap-1`}
                      >
                        <IconComponent className="w-3 h-3" />
                        {tag}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Move-in Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-[var(--color-easyCo-gray-light)] to-gray-50 rounded-2xl">
                <div>
                  <div className="text-xs text-[var(--color-easyCo-gray-dark)] mb-1 font-medium">Move-in Date</div>
                  <div className="font-semibold text-sm text-[var(--color-easyCo-purple)]">{currentCandidate.moveInDate}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-easyCo-gray-dark)] mb-1 font-medium">Budget Range</div>
                  <div className="font-semibold text-sm text-[var(--color-easyCo-purple)]">{currentCandidate.budget}</div>
                </div>
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
              Tap <X className="w-4 h-4 text-red-500" /> to pass or <Heart className="w-4 h-4 text-[var(--color-easyCo-mustard)]" /> to match
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