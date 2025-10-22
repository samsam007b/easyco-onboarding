import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ImageCarousel } from "./ImageCarousel";
import { useFavorites } from "./FavoritesContext";
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Star, 
  Heart,
  Home,
  DollarSign
} from "lucide-react";

// Using the same property data for demonstration
const ALL_PROPERTIES = [
  {
    id: 1,
    images: [
      "https://images.unsplash.com/photo-1662454419622-a41092ecd245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjBraXRjaGVuJTIwYXBhcnRtZW50fGVufDF8fHx8MTc1NTUyNjE1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZpbmclMjByb29tJTIwbW9kZXJuJTIwYXBhcnRtZW50fGVufDF8fHx8MTc1NTUyNjE1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1449247613801-ab06418e2861?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjBhcGFydG1lbnQlMjBvdXRkb29yfGVufDF8fHx8MTc1NTUyNjE1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    title: "Modern House in Ixelles",
    address: "Rue de la Paix 15, 1050 Ixelles",
    price: 750,
    rating: 4.8,
    reviewCount: 24,
    totalRoommates: 4,
    tags: ["Near University", "Garden", "WiFi", "Furnished"]
  },
  {
    id: 2,
    images: [
      "https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjb3p5JTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc1NTUyNjE1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkeSUyMGFyZWElMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU1NTI2MTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXVuZHJ5JTIwcm9vbSUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3NTU1MjYxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    title: "Student Residence Saint-Gilles",
    address: "Avenue de la Couronne 89, 1060 Saint-Gilles",
    price: 480,
    rating: 4.6,
    reviewCount: 18,
    totalRoommates: 6,
    tags: ["Student Friendly", "Common Areas", "Study Room", "Laundry"]
  },
  {
    id: 3,
    images: [
      "https://images.unsplash.com/photo-1657084031100-6925483d8a7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjBraXRjaGVuJTIwYXBhcnRtZW50fGVufDF8fHx8MTc1NTUyNjE1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaW0lMjBhcGFydG1lbnQlMjBmaXRuZXNzfGVufDF8fHx8MTc1NTUyNjE1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwZ2FyYWdlJTIwYXBhcnRtZW50fGVufDF8fHx8MTc1NTUyNjE1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    title: "Luxury Loft in Uccle",
    address: "Chaussée de Waterloo 234, 1180 Uccle",
    price: 890,
    rating: 4.9,
    reviewCount: 31,
    totalRoommates: 3,
    tags: ["Professional", "Gym", "Parking", "High-end"]
  }
];

interface FavoritesScreenProps {
  onBack: () => void;
  onPropertySelect: (propertyId: number) => void;
}

export function FavoritesScreen({ onBack, onPropertySelect }: FavoritesScreenProps) {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  
  const favoriteProperties = ALL_PROPERTIES.filter(property => 
    favorites.includes(property.id)
  );

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-0">
            <ArrowLeft className="w-6 h-6 text-[var(--color-easyCo-purple)]" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-[var(--color-easyCo-purple)]">
              My Favorites
            </h1>
            <p className="text-sm text-[var(--color-easyCo-gray-dark)]">
              {favoriteProperties.length} saved properties
            </p>
          </div>
          <div className="w-10 h-10 bg-[var(--color-easyCo-purple)] rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {favoriteProperties.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[var(--color-easyCo-gray-medium)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-[var(--color-easyCo-gray-dark)]" />
            </div>
            <h3 className="font-semibold text-[var(--color-easyCo-purple)] mb-2">
              No favorites yet
            </h3>
            <p className="text-[var(--color-easyCo-gray-dark)] text-sm mb-6 max-w-sm mx-auto">
              Start exploring and save properties you like by tapping the heart icon
            </p>
            <Button 
              onClick={onBack}
              className="bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-xl"
            >
              <Home className="w-4 h-4 mr-2" />
              Explore Properties
            </Button>
          </div>
        ) : (
          // Favorites List
          <div className="space-y-4">
            {favoriteProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden shadow-sm border-0 rounded-2xl">
                <div className="relative">
                  <ImageCarousel
                    images={property.images}
                    alt={property.title}
                    className="rounded-t-2xl"
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(property.id);
                    }}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors ${
                        isFavorite(property.id) 
                          ? 'text-red-500 fill-current' 
                          : 'text-[var(--color-easyCo-gray-dark)]'
                      }`} 
                    />
                  </button>
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-[var(--color-easyCo-mustard)] text-black">
                      Favorited
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-[var(--color-easyCo-purple)]">
                      {property.title}
                    </h3>
                    <div className="text-right">
                      <div className="font-bold text-lg text-[var(--color-easyCo-purple)]">
                        €{property.price}+
                      </div>
                      <div className="text-xs text-[var(--color-easyCo-gray-dark)]">
                        per month
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-[var(--color-easyCo-gray-dark)] text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.address}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-[var(--color-easyCo-gray-dark)] text-sm">
                      <Users className="w-4 h-4 mr-1" />
                      {property.totalRoommates} total residents
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-[var(--color-easyCo-mustard)] mr-1" fill="currentColor" />
                      <span className="text-sm font-medium">{property.rating}</span>
                      <span className="text-xs text-[var(--color-easyCo-gray-dark)] ml-1">
                        ({property.reviewCount})
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-[var(--color-easyCo-gray-light)] text-[var(--color-easyCo-gray-dark)]">
                        {tag}
                      </Badge>
                    ))}
                    {property.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-[var(--color-easyCo-gray-light)] text-[var(--color-easyCo-gray-dark)]">
                        +{property.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => toggleFavorite(property.id)}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                    <Button 
                      onClick={() => onPropertySelect(property.id)}
                      className="flex-1 bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black rounded-xl"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}