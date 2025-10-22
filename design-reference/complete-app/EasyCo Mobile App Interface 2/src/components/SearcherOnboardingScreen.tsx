import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Search, 
  Users, 
  Heart, 
  Home, 
  MapPin, 
  ArrowRight,
  Sparkles,
  UserCheck
} from "lucide-react";

interface SearcherOnboardingScreenProps {
  onFindPlace: () => void;
  onFindPeople: () => void;
  onBack?: () => void;
}

export function SearcherOnboardingScreen({ 
  onFindPlace, 
  onFindPeople, 
  onBack 
}: SearcherOnboardingScreenProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    
    // Add a small delay for visual feedback before navigating
    setTimeout(() => {
      if (option === 'place') {
        onFindPlace();
      } else {
        onFindPeople();
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-easyCo-purple)]/10 via-white to-[var(--color-easyCo-mustard)]/10">
      {/* Header */}
      <div className="relative px-6 pt-16 pb-8 text-center">
        <div className="mb-6">
          {/* EasyCo Logo/Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-[var(--color-easyCo-purple)] to-[var(--color-easyCo-purple-light)] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Home className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-[var(--color-easyCo-purple)] mb-3">
            How would you like to start? ✨
          </h1>
          <p className="text-lg text-[var(--color-easyCo-gray-dark)] max-w-sm mx-auto leading-relaxed">
            Choose your path to find the perfect coliving experience
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-8 w-4 h-4 bg-[var(--color-easyCo-mustard)] rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-32 right-12 w-3 h-3 bg-[var(--color-easyCo-purple-light)] rounded-full opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-28 right-6 w-2 h-2 bg-[var(--color-easyCo-mustard)] rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Options */}
      <div className="px-6 space-y-6 pb-8">
        {/* Find a Coliving Place Option */}
        <Card 
          onClick={() => handleOptionSelect('place')}
          className={`cursor-pointer transition-all duration-300 border-0 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 ${
            selectedOption === 'place' ? 'ring-4 ring-[var(--color-easyCo-mustard)] scale-105' : ''
          }`}
        >
          <CardContent className="p-0">
            {/* Illustration */}
            <div className="h-48 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 relative overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xpdmluZyUyMHNwYWNlJTIwYXBhcnRtZW50JTIwbW9kZXJufGVufDF8fHx8MTc1ODQ3OTcyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern coliving space"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent">
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Browse Properties</h3>
                      <p className="text-sm text-white/80">400+ verified listings</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[var(--color-easyCo-purple)] mb-2">
                    Find a Coliving Place 🏠
                  </h2>
                  <p className="text-[var(--color-easyCo-gray-dark)] leading-relaxed">
                    Start by exploring available properties in Brussels. Filter by location, budget, and amenities to find your ideal space.
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-[var(--color-easyCo-purple)] mt-1 flex-shrink-0" />
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-[var(--color-easyCo-gray-dark)]">Search by neighborhood & transport links</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                    <Home className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-[var(--color-easyCo-gray-dark)]">Virtual tours & detailed room info</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-[var(--color-easyCo-gray-dark)]">Verified properties & instant booking</span>
                </div>
              </div>

              {/* CTA */}
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-[var(--color-easyCo-purple)] to-[var(--color-easyCo-purple-light)] hover:from-[var(--color-easyCo-purple-dark)] hover:to-[var(--color-easyCo-purple)] text-white rounded-2xl h-12"
                onClick={() => handleOptionSelect('place')}
              >
                Start Property Search
                <Search className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Find Co-livers First Option */}
        <Card 
          onClick={() => handleOptionSelect('people')}
          className={`cursor-pointer transition-all duration-300 border-0 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 ${
            selectedOption === 'people' ? 'ring-4 ring-[var(--color-easyCo-mustard)] scale-105' : ''
          }`}
        >
          <CardContent className="p-0">
            {/* Illustration */}
            <div className="h-48 bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100 relative overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwY29saXZpbmclMjBjb21tdW5pdHklMjBoYXBweXxlbnwxfHx8fDE3NTg0Nzk3NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Happy coliving community"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent">
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Meet Your Matches</h3>
                      <p className="text-sm text-white/80">1000+ active colivers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[var(--color-easyCo-purple)] mb-2">
                    Find Co-livers First 👥
                  </h2>
                  <p className="text-[var(--color-easyCo-gray-dark)] leading-relaxed">
                    Connect with like-minded people first, then find a place together. Perfect for building your ideal living community.
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-[var(--color-easyCo-purple)] mt-1 flex-shrink-0" />
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-pink-600" />
                  </div>
                  <span className="text-[var(--color-easyCo-gray-dark)]">Swipe & match based on lifestyle</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span className="text-[var(--color-easyCo-gray-dark)]">Chat & get to know potential roommates</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-[var(--color-easyCo-gray-dark)]">Find places together as a group</span>
                </div>
              </div>

              {/* CTA */}
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-[var(--color-easyCo-mustard)] to-yellow-300 hover:from-[var(--color-easyCo-mustard-dark)] hover:to-[var(--color-easyCo-mustard)] text-black rounded-2xl h-12 font-medium"
                onClick={() => handleOptionSelect('people')}
              >
                Start Matching People
                <Heart className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Helper Text */}
      <div className="px-6 pb-8 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-[var(--color-easyCo-gray-light)]">
          <p className="text-sm text-[var(--color-easyCo-gray-dark)] mb-2">
            💡 <span className="font-medium">Not sure which to choose?</span>
          </p>
          <p className="text-xs text-[var(--color-easyCo-gray-dark)] leading-relaxed">
            Most people start with property search, but matching with co-livers first can lead to stronger communities and better compatibility!
          </p>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="px-6 pb-6">
        <div className="flex justify-center gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-[var(--color-easyCo-purple)]">400+</div>
            <div className="text-xs text-[var(--color-easyCo-gray-dark)]">Properties</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--color-easyCo-purple)]">1K+</div>
            <div className="text-xs text-[var(--color-easyCo-gray-dark)]">Co-livers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--color-easyCo-purple)]">4.8★</div>
            <div className="text-xs text-[var(--color-easyCo-gray-dark)]">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}