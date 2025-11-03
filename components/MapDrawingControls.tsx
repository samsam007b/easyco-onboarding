'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Circle,
  Square,
  Pentagon,
  Trash2,
  Save,
  MapPin,
  Navigation,
  Clock,
} from 'lucide-react';
import { DrawingShape } from '@/types/geo-filters.types';
import { toast } from 'sonner';

interface MapDrawingControlsProps {
  onDrawingComplete?: (shape: DrawingShape) => void;
  onClearDrawing?: () => void;
  activeShape?: DrawingShape | null;
}

export default function MapDrawingControls({
  onDrawingComplete,
  onClearDrawing,
  activeShape,
}: MapDrawingControlsProps) {
  const [drawingMode, setDrawingMode] = useState<'circle' | 'polygon' | 'rectangle' | null>(null);

  const handleStartDrawing = (mode: 'circle' | 'polygon' | 'rectangle') => {
    setDrawingMode(mode);
    toast.info(
      mode === 'circle'
        ? 'Clique sur la carte pour placer le centre, puis ajuste le rayon'
        : mode === 'rectangle'
        ? 'Clique et maintiens pour dessiner un rectangle'
        : 'Clique pour ajouter des points, double-clique pour terminer'
    );
  };

  const handleClear = () => {
    setDrawingMode(null);
    onClearDrawing?.();
    toast.success('Zone de recherche effacée');
  };

  return (
    <Card className="absolute top-4 left-4 z-10 shadow-lg">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Outils de dessin</h3>
            {activeShape && (
              <Badge variant="success" className="text-xs">
                Zone active
              </Badge>
            )}
          </div>

          {/* Drawing Tools */}
          <div className="space-y-2">
            <p className="text-xs text-gray-600">Dessine une zone de recherche :</p>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={drawingMode === 'circle' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStartDrawing('circle')}
                className="flex-col h-auto py-2"
              >
                <Circle className="w-5 h-5 mb-1" />
                <span className="text-xs">Cercle</span>
              </Button>

              <Button
                variant={drawingMode === 'rectangle' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStartDrawing('rectangle')}
                className="flex-col h-auto py-2"
              >
                <Square className="w-5 h-5 mb-1" />
                <span className="text-xs">Rectangle</span>
              </Button>

              <Button
                variant={drawingMode === 'polygon' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStartDrawing('polygon')}
                className="flex-col h-auto py-2"
              >
                <Pentagon className="w-5 h-5 mb-1" />
                <span className="text-xs">Polygone</span>
              </Button>
            </div>
          </div>

          {/* Active Shape Info */}
          {activeShape && (
            <div className="pt-3 border-t space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <Badge variant="default">{activeShape.type}</Badge>
              </div>

              {activeShape.type === 'circle' && activeShape.radius && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rayon:</span>
                  <span className="font-medium">
                    {activeShape.radius < 1000
                      ? `${Math.round(activeShape.radius)}m`
                      : `${(activeShape.radius / 1000).toFixed(1)}km`}
                  </span>
                </div>
              )}

              {activeShape.type !== 'circle' && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Points:</span>
                  <span className="font-medium">{activeShape.coordinates.length}</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {activeShape && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Effacer
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Sauvegarder
                </Button>
              </>
            )}
          </div>

          {/* Quick Filters */}
          <div className="pt-3 border-t space-y-2">
            <p className="text-xs text-gray-600">Filtres rapides :</p>

            <div className="space-y-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
              >
                <MapPin className="w-3 h-3 mr-2" />
                Près du métro (500m)
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
              >
                <Navigation className="w-3 h-3 mr-2" />
                Temps de trajet max
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
              >
                <Clock className="w-3 h-3 mr-2" />
                Zone personnalisée
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
