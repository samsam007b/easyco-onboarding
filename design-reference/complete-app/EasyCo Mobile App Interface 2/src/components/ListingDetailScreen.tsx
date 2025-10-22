import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useFavorites } from "./FavoritesContext";
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Star, 
  Calendar,
  DollarSign,
  Heart,
  Share2,
  Wifi,
  Car,
  Coffee,
  Tv,
  CheckCircle,
  ChevronRight,
  Zap,
  Wrench,
  Sparkles,
  PieChart
} from "lucide-react";

const PROPERTY_DATA = {
  id: 1,
  title: "Modern Studio in Ixelles",
  address: "Rue de la Paix 15, 1050 Ixelles",
  price: 620,
  images: [
    "https://images.unsplash.com/photo-1556889882-50d7a74e8be4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBhcGFydG1lbnQlMjBtb2Rlcm4lMjBjbGVhbnxlbnwxfHx8fDE3NTU4NzcxNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwYXBhcnRtZW50JTIwcm9vbSUyMGNvenl8ZW58MXx8fHwxNzU1ODc3MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  ],
  rating: 4.8,
  reviewCount: 24,
  roommates: 3,
  availableFrom: "Feb 1, 2025",
  description: "Cozy studio room with desk area, perfect for students. This bright room features a comfortable single bed, spacious wardrobe, study desk with chair, and large windows providing plenty of natural light.",
  amenities: [
    { icon: Wifi, label: "High-speed WiFi" },
    { icon: Tv, label: "Smart TV" },
    { icon: Coffee, label: "Coffee machine" },
    { icon: Car, label: "Parking available" }
  ],
  features: [
    "Single bed with quality mattress",
    "Study desk with ergonomic chair",
    "Large wardrobe with hangers",
    "Full-length mirror"
  ]
};

const BUDGET_PREVIEW = [
  { icon: Wifi, label: 'Wi-Fi', amount: 25, color: '#4A148C' },
  { icon: Tv, label: 'Streaming', amount: 18, color: '#7E57C2' },
  { icon: Zap, label: 'Utilities', amount: 45, color: '#FFD600' },
  { icon: Wrench, label: 'Maintenance', amount: 20, color: '#F57F17' },
  { icon: Sparkles, label: 'Cleaning', amount: 12, color: '#9C27B0' }
];

const TOTAL_ADDITIONAL = BUDGET_PREVIEW.reduce((sum, item) => sum + item.amount, 0);

interface ListingDetailScreenProps {
  onBack: () => void;
  onViewBudgetBreakdown?: () => void;
}

export function ListingDetailScreen({ onBack, onViewBudgetBreakdown }: ListingDetailScreenProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites();

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? PROPERTY_DATA.images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === PROPERTY_DATA.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 pt-12 pb-4 relative">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-0">
            <ArrowLeft className="w-6 h-6 text-[var(--color-easyCo-purple)]" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-[var(--color-easyCo-purple)]">{PROPERTY_DATA.title}</h1>
            <p className="text-sm text-[var(--color-easyCo-gray-dark)]">{PROPERTY_DATA.address}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => toggleFavorite(PROPERTY_DATA.id)}
              className={`p-2 rounded-full ${isFavorite(PROPERTY_DATA.id) ? 'text-red-500' : 'text-[var(--color-easyCo-gray-dark)]'}`}
            >
              <Heart className={`w-5 h-5 ${isFavorite(PROPERTY_DATA.id) ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 rounded-full text-[var(--color-easyCo-gray-dark)]">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pb-24">
        {/* Image Gallery */}
        <div className="relative">
          <ImageWithFallback
            src={PROPERTY_DATA.images[currentImageIndex]}
            alt={PROPERTY_DATA.title}
            className="w-full h-64 object-cover"
          />
          
          {/* Image Navigation */}
          {PROPERTY_DATA.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-0"
              >
                ←
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-0"
              >
                →
              </Button>
            </>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Property Info */}
          <Card className="rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="font-semibold text-[var(--color-easyCo-purple)] mb-2">
                    {PROPERTY_DATA.title}
                  </h2>
                  <div className="flex items-center text-[var(--color-easyCo-gray-dark)] text-sm mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    {PROPERTY_DATA.address}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-[var(--color-easyCo-mustard)] mr-1" fill="currentColor" />
                      <span className="font-medium">{PROPERTY_DATA.rating}</span>
                      <span className="text-[var(--color-easyCo-gray-dark)] ml-1">
                        ({PROPERTY_DATA.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex items-center text-[var(--color-easyCo-gray-dark)]">
                      <Users className="w-4 h-4 mr-1" />
                      {PROPERTY_DATA.roommates} roommates
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-4">
                  <div className="font-bold text-2xl text-[var(--color-easyCo-purple)]">
                    €{PROPERTY_DATA.price}
                  </div>
                  <div className="text-sm text-[var(--color-easyCo-gray-dark)]">per month</div>
                  <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                    {PROPERTY_DATA.availableFrom}
                  </Badge>
                </div>
              </div>

              <p className="text-[var(--color-easyCo-gray-dark)] leading-relaxed">
                {PROPERTY_DATA.description}
              </p>
            </CardContent>
          </Card>

          {/* Everyday Life Budget Section */}
          <Card className="rounded-2xl shadow-sm border-0 bg-gradient-to-r from-[var(--color-easyCo-purple)]/5 to-[var(--color-easyCo-mustard)]/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--color-easyCo-purple)]/10 rounded-2xl flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-[var(--color-easyCo-purple)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-easyCo-purple)]">Everyday Life Budget</h3>
                    <p className="text-sm text-[var(--color-easyCo-gray-dark)]">Additional living costs</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-xl text-[var(--color-easyCo-purple)]">
                    +€{TOTAL_ADDITIONAL}
                  </div>
                  <div className="text-xs text-[var(--color-easyCo-gray-dark)]">per month</div>
                </div>
              </div>

              {/* Budget Preview Items */}
              <div className="grid grid-cols-5 gap-3 mb-4">
                {BUDGET_PREVIEW.map((item, index) => {
                  const IconComponent = item.icon;
                  const percentage = (item.amount / TOTAL_ADDITIONAL) * 100;
                  
                  return (
                    <div key={index} className="text-center">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <IconComponent 
                          className="w-5 h-5" 
                          style={{ color: item.color }}
                        />
                      </div>
                      <div className="text-xs font-medium text-[var(--color-easyCo-purple)] mb-1">
                        €{item.amount}
                      </div>
                      <div className="text-xs text-[var(--color-easyCo-gray-dark)]">
                        {item.label}
                      </div>
                      <div className="text-xs text-[var(--color-easyCo-gray-dark)] mt-1">
                        {percentage.toFixed(0)}%
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Visual Bar */}
              <div className="w-full bg-[var(--color-easyCo-gray-light)] rounded-full h-3 mb-4 overflow-hidden">
                <div className="h-full flex">
                  {BUDGET_PREVIEW.map((item, index) => {
                    const percentage = (item.amount / TOTAL_ADDITIONAL) * 100;
                    return (
                      <div
                        key={index}
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Total Calculation Preview */}
              <div className="bg-white rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-[var(--color-easyCo-gray-dark)]">Room rent</span>
                  <span className="font-medium">€{PROPERTY_DATA.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-[var(--color-easyCo-gray-dark)]">Additional costs</span>
                  <span className="font-medium">€{TOTAL_ADDITIONAL}</span>
                </div>
                <div className="h-px bg-[var(--color-easyCo-gray-medium)] my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[var(--color-easyCo-purple)]">Total monthly cost</span>
                  <span className="font-bold text-lg text-[var(--color-easyCo-purple)]">
                    €{PROPERTY_DATA.price + TOTAL_ADDITIONAL}
                  </span>
                </div>
              </div>

              {/* View Details Button */}
              <Button 
                onClick={onViewBudgetBreakdown}
                variant="outline"
                className="w-full border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-xl hover:bg-[var(--color-easyCo-purple)] hover:text-white"
              >
                <PieChart className="w-4 h-4 mr-2" />
                View Detailed Breakdown
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-4">Room Features</h3>
              <div className="grid grid-cols-1 gap-2">
                {PROPERTY_DATA.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-[var(--color-easyCo-gray-dark)]">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="rounded-2xl shadow-sm border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-4">Shared Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                {PROPERTY_DATA.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <amenity.icon className="w-5 h-5 text-[var(--color-easyCo-purple)]" />
                    <span className="text-sm text-[var(--color-easyCo-gray-dark)]">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--color-easyCo-gray-medium)] p-6">
        <div className="flex gap-3">
          <Button 
            variant="outline"
            className="flex-1 border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-2xl py-4"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Viewing
          </Button>
          <Button className="flex-1 bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-2xl py-4">
            <CheckCircle className="w-5 h-5 mr-2" />
            Book This Room
          </Button>
        </div>
      </div>
    </div>
  );
}