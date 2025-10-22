import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { 
  ArrowLeft, 
  Camera, 
  Plus,
  X,
  Save,
  Bed,
  DollarSign,
  Ruler,
  FileText
} from "lucide-react";

interface AddRoomScreenProps {
  onBack: () => void;
  onSave: (roomData: any) => void;
}

export function AddRoomScreen({ onBack, onSave }: AddRoomScreenProps) {
  const [roomData, setRoomData] = useState({
    name: "",
    description: "",
    size: "",
    price: "",
    photos: [] as string[]
  });

  const [dragOver, setDragOver] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setRoomData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (roomData.name && roomData.description && roomData.size && roomData.price) {
      onSave(roomData);
    }
  };

  const addPhoto = () => {
    // Mock photo addition
    const mockPhotos = [
      "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWRyb29tJTIwYXBhcnRtZW50JTIwcm9vbSUyMGNvenl8ZW58MXx8fHwxNzU1ODc3MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1556889882-50d7a74e8be4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBhcGFydG1lbnQlMjBtb2Rlcm4lMjBjbGVhbnxlbnwxfHx8fDE3NTU4NzcxNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ];
    
    const newPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    setRoomData(prev => ({
      ...prev,
      photos: [...prev.photos, newPhoto]
    }));
  };

  const removePhoto = (index: number) => {
    setRoomData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const isFormValid = roomData.name && roomData.description && roomData.size && roomData.price;

  return (
    <div className="min-h-screen bg-[var(--color-easyCo-gray-light)]">
      {/* Header */}
      <div className="bg-[var(--color-easyCo-purple)] px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-0 text-white hover:bg-white/20">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-white">Add New Room</h1>
            <p className="text-white/80 text-sm">Create a new room in your co-living</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <Card className="rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <h2 className="font-semibold text-[var(--color-easyCo-purple)] mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="room-name" className="text-sm font-medium text-[var(--color-easyCo-purple)] mb-2 block">
                  Room Name *
                </Label>
                <Input
                  id="room-name"
                  placeholder="e.g. Master Bedroom, Studio Room..."
                  value={roomData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="border-2 border-[var(--color-easyCo-gray-medium)] focus:border-[var(--color-easyCo-purple)] rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="room-description" className="text-sm font-medium text-[var(--color-easyCo-purple)] mb-2 block">
                  Description *
                </Label>
                <Textarea
                  id="room-description"
                  placeholder="Describe the room features, amenities, and what makes it special..."
                  value={roomData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="border-2 border-[var(--color-easyCo-gray-medium)] focus:border-[var(--color-easyCo-purple)] rounded-xl min-h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="room-size" className="text-sm font-medium text-[var(--color-easyCo-purple)] mb-2 block">
                    Size *
                  </Label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-easyCo-gray-dark)] w-4 h-4" />
                    <Input
                      id="room-size"
                      placeholder="e.g. 15 m²"
                      value={roomData.size}
                      onChange={(e) => handleInputChange('size', e.target.value)}
                      className="pl-10 border-2 border-[var(--color-easyCo-gray-medium)] focus:border-[var(--color-easyCo-purple)] rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="room-price" className="text-sm font-medium text-[var(--color-easyCo-purple)] mb-2 block">
                    Monthly Price *
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-easyCo-gray-dark)] w-4 h-4" />
                    <Input
                      id="room-price"
                      placeholder="650"
                      type="number"
                      value={roomData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="pl-10 border-2 border-[var(--color-easyCo-gray-medium)] focus:border-[var(--color-easyCo-purple)] rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card className="rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <h2 className="font-semibold text-[var(--color-easyCo-purple)] mb-4 flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Room Photos
            </h2>

            {/* Photo Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
                dragOver 
                  ? 'border-[var(--color-easyCo-purple)] bg-[var(--color-easyCo-purple)]/5' 
                  : 'border-[var(--color-easyCo-gray-medium)] hover:border-[var(--color-easyCo-purple)]'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                addPhoto(); // Mock photo addition
              }}
            >
              <Camera className="w-12 h-12 text-[var(--color-easyCo-gray-dark)] mx-auto mb-4" />
              <h3 className="font-medium text-[var(--color-easyCo-purple)] mb-2">
                Upload Room Photos
              </h3>
              <p className="text-sm text-[var(--color-easyCo-gray-dark)] mb-4">
                Drag and drop photos here, or click to select files
              </p>
              <Button 
                onClick={addPhoto}
                variant="outline" 
                className="border-[var(--color-easyCo-purple)] text-[var(--color-easyCo-purple)] rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Choose Photos
              </Button>
            </div>

            {/* Photo Preview Grid */}
            {roomData.photos.length > 0 && (
              <div className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  {roomData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Room photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Validation Info */}
        <div className="p-4 bg-blue-50 rounded-2xl">
          <div className="flex items-start gap-3">
            <Bed className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 text-sm mb-1">Room Setup Tips</h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                Add clear photos and detailed descriptions to attract quality tenants. Include room size and highlight unique features like private bathroom, balcony access, or study area.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline"
            onClick={onBack}
            className="flex-1 border-2 border-[var(--color-easyCo-gray-medium)] rounded-2xl py-4"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!isFormValid}
            className={`flex-1 py-4 rounded-2xl ${
              isFormValid 
                ? 'bg-[var(--color-easyCo-mustard)] hover:bg-[var(--color-easyCo-mustard-dark)] text-black' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-5 h-5 mr-2" />
            Save Room
          </Button>
        </div>

        {/* Required Fields Notice */}
        {!isFormValid && (
          <div className="text-center text-sm text-[var(--color-easyCo-gray-dark)]">
            * Please fill in all required fields to save the room
          </div>
        )}
      </div>
    </div>
  );
}