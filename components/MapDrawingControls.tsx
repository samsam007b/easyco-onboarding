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
import { useLanguage } from '@/lib/i18n/use-language';

type Language = 'fr' | 'en' | 'nl' | 'de';

const translations = {
  title: {
    fr: 'Outils de dessin',
    en: 'Drawing tools',
    nl: 'Tekengereedschappen',
    de: 'Zeichenwerkzeuge',
  },
  zoneActive: {
    fr: 'Zone active',
    en: 'Active zone',
    nl: 'Actieve zone',
    de: 'Aktive Zone',
  },
  drawZone: {
    fr: 'Dessine une zone de recherche :',
    en: 'Draw a search zone:',
    nl: 'Teken een zoekzone:',
    de: 'Zeichne eine Suchzone:',
  },
  shapes: {
    circle: {
      fr: 'Cercle',
      en: 'Circle',
      nl: 'Cirkel',
      de: 'Kreis',
    },
    rectangle: {
      fr: 'Rectangle',
      en: 'Rectangle',
      nl: 'Rechthoek',
      de: 'Rechteck',
    },
    polygon: {
      fr: 'Polygone',
      en: 'Polygon',
      nl: 'Polygoon',
      de: 'Polygon',
    },
  },
  instructions: {
    circle: {
      fr: 'Clique sur la carte pour placer le centre, puis ajuste le rayon',
      en: 'Click on the map to place the center, then adjust the radius',
      nl: 'Klik op de kaart om het centrum te plaatsen, pas dan de straal aan',
      de: 'Klicken Sie auf die Karte, um das Zentrum zu platzieren, dann passen Sie den Radius an',
    },
    rectangle: {
      fr: 'Clique et maintiens pour dessiner un rectangle',
      en: 'Click and hold to draw a rectangle',
      nl: 'Klik en houd ingedrukt om een rechthoek te tekenen',
      de: 'Klicken und halten Sie, um ein Rechteck zu zeichnen',
    },
    polygon: {
      fr: 'Clique pour ajouter des points, double-clique pour terminer',
      en: 'Click to add points, double-click to finish',
      nl: 'Klik om punten toe te voegen, dubbelklik om te beëindigen',
      de: 'Klicken Sie, um Punkte hinzuzufügen, doppelklicken Sie zum Beenden',
    },
  },
  labels: {
    type: {
      fr: 'Type:',
      en: 'Type:',
      nl: 'Type:',
      de: 'Typ:',
    },
    radius: {
      fr: 'Rayon:',
      en: 'Radius:',
      nl: 'Straal:',
      de: 'Radius:',
    },
    points: {
      fr: 'Points:',
      en: 'Points:',
      nl: 'Punten:',
      de: 'Punkte:',
    },
  },
  actions: {
    clear: {
      fr: 'Effacer',
      en: 'Clear',
      nl: 'Wissen',
      de: 'Löschen',
    },
    save: {
      fr: 'Sauvegarder',
      en: 'Save',
      nl: 'Opslaan',
      de: 'Speichern',
    },
  },
  quickFilters: {
    title: {
      fr: 'Filtres rapides :',
      en: 'Quick filters:',
      nl: 'Snelfilters:',
      de: 'Schnellfilter:',
    },
    nearMetro: {
      fr: 'Près du métro (500m)',
      en: 'Near subway (500m)',
      nl: 'Nabij metro (500m)',
      de: 'U-Bahn-Nähe (500m)',
    },
    maxCommute: {
      fr: 'Temps de trajet max',
      en: 'Max commute time',
      nl: 'Maximale reistijd',
      de: 'Maximale Fahrzeit',
    },
    customZone: {
      fr: 'Zone personnalisée',
      en: 'Custom zone',
      nl: 'Aangepaste zone',
      de: 'Benutzerdefinierte Zone',
    },
  },
  toasts: {
    zoneCleared: {
      fr: 'Zone de recherche effacée',
      en: 'Search zone cleared',
      nl: 'Zoekzone gewist',
      de: 'Suchzone gelöscht',
    },
  },
};

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
  const { language } = useLanguage();
  const lang = language as Language;
  const t = translations;

  const [drawingMode, setDrawingMode] = useState<'circle' | 'polygon' | 'rectangle' | null>(null);

  const handleStartDrawing = (mode: 'circle' | 'polygon' | 'rectangle') => {
    setDrawingMode(mode);
    toast.info(t.instructions[mode][lang]);
  };

  const handleClear = () => {
    setDrawingMode(null);
    onClearDrawing?.();
    toast.success(t.toasts.zoneCleared[lang]);
  };

  return (
    <Card className="absolute top-4 left-4 z-10 shadow-lg">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{t.title[lang]}</h3>
            {activeShape && (
              <Badge variant="success" className="text-xs">
                {t.zoneActive[lang]}
              </Badge>
            )}
          </div>

          {/* Drawing Tools */}
          <div className="space-y-2">
            <p className="text-xs text-gray-600">{t.drawZone[lang]}</p>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={drawingMode === 'circle' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStartDrawing('circle')}
                className="flex-col h-auto py-2"
              >
                <Circle className="w-5 h-5 mb-1" />
                <span className="text-xs">{t.shapes.circle[lang]}</span>
              </Button>

              <Button
                variant={drawingMode === 'rectangle' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStartDrawing('rectangle')}
                className="flex-col h-auto py-2"
              >
                <Square className="w-5 h-5 mb-1" />
                <span className="text-xs">{t.shapes.rectangle[lang]}</span>
              </Button>

              <Button
                variant={drawingMode === 'polygon' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStartDrawing('polygon')}
                className="flex-col h-auto py-2"
              >
                <Pentagon className="w-5 h-5 mb-1" />
                <span className="text-xs">{t.shapes.polygon[lang]}</span>
              </Button>
            </div>
          </div>

          {/* Active Shape Info */}
          {activeShape && (
            <div className="pt-3 border-t space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t.labels.type[lang]}</span>
                <Badge variant="default">{t.shapes[activeShape.type as keyof typeof t.shapes]?.[lang] || activeShape.type}</Badge>
              </div>

              {activeShape.type === 'circle' && activeShape.radius && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t.labels.radius[lang]}</span>
                  <span className="font-medium">
                    {activeShape.radius < 1000
                      ? `${Math.round(activeShape.radius)}m`
                      : `${(activeShape.radius / 1000).toFixed(1)}km`}
                  </span>
                </div>
              )}

              {activeShape.type !== 'circle' && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t.labels.points[lang]}</span>
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
                  {t.actions.clear[lang]}
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {t.actions.save[lang]}
                </Button>
              </>
            )}
          </div>

          {/* Quick Filters */}
          <div className="pt-3 border-t space-y-2">
            <p className="text-xs text-gray-600">{t.quickFilters.title[lang]}</p>

            <div className="space-y-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
              >
                <MapPin className="w-3 h-3 mr-2" />
                {t.quickFilters.nearMetro[lang]}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
              >
                <Navigation className="w-3 h-3 mr-2" />
                {t.quickFilters.maxCommute[lang]}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
              >
                <Clock className="w-3 h-3 mr-2" />
                {t.quickFilters.customZone[lang]}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
