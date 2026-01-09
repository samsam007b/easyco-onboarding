'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Maximize, Play, Video, AlertTriangle } from 'lucide-react';
import { VirtualTourInfo } from '@/types/virtual-tours.types';
import { sanitizeEmbedCode } from '@/lib/security/sanitizer';
import { useLanguage } from '@/lib/i18n/use-language';

interface VirtualTourViewerProps {
  tourInfo: VirtualTourInfo;
  propertyId: string;
  onViewStart?: () => void;
  onViewEnd?: (duration: number) => void;
}

export default function VirtualTourViewer({
  tourInfo,
  propertyId,
  onViewStart,
  onViewEnd,
}: VirtualTourViewerProps) {
  const { language, getSection } = useLanguage();
  const ariaLabels = getSection('ariaLabels');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewStartTime, setViewStartTime] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // SECURITY: Sanitize embed code to extract only trusted iframe URLs
  // This prevents XSS attacks from malicious embed codes
  const sanitizedEmbedUrl = useMemo(() => {
    if (!tourInfo.tour_embed_code) return null;
    return sanitizeEmbedCode(tourInfo.tour_embed_code);
  }, [tourInfo.tour_embed_code]);

  useEffect(() => {
    if (isPlaying && !viewStartTime) {
      setViewStartTime(Date.now());
      onViewStart?.();
    }
  }, [isPlaying, viewStartTime, onViewStart]);

  useEffect(() => {
    return () => {
      if (viewStartTime) {
        const duration = Math.floor((Date.now() - viewStartTime) / 1000);
        onViewEnd?.(duration);
      }
    };
  }, [viewStartTime, onViewEnd]);

  const handleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const getEmbedUrl = (): string => {
    if (!tourInfo.virtual_tour_url) return '';

    // Convert various URL formats to embeddable format
    const url = tourInfo.virtual_tour_url;

    // Matterport
    if (url.includes('matterport.com')) {
      return url.replace('/show/', '/embed/');
    }

    // YouTube 360
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be')
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&vq=hd1080`;
    }

    return url;
  };

  if (!tourInfo.has_virtual_tour) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Visite virtuelle non disponible
          </h3>
          <p className="text-gray-600 mb-4">
            Cette propriété n'a pas encore de visite virtuelle 360°
          </p>
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Planifier une visite physique
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isPlaying) {
    return (
      <Card className="relative overflow-hidden group">
        <div className="relative h-[400px] bg-searcher-600 flex items-center justify-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="20" cy="20" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Play Button */}
          <div className="relative z-10 text-center">
            <Button
              size="lg"
              onClick={() => setIsPlaying(true)}
              className="w-24 h-24 rounded-full bg-white text-searcher-600 hover:bg-gray-100 shadow-2xl group-hover:scale-110 transition"
            >
              <Play className="w-12 h-12 ml-2" />
            </Button>

            <div className="mt-6">
              <Badge className="bg-white text-searcher-600 px-4 py-2">
                <Eye className="w-4 h-4 mr-2" />
                Visite Virtuelle 360°
              </Badge>
            </div>

            <h3 className="text-white text-2xl font-bold mt-4">
              Découvre cette propriété en immersion
            </h3>
            <p className="text-white/80 mt-2">
              Clique pour lancer la visite virtuelle interactive
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Determine the iframe source URL (sanitized embed code takes priority)
  const iframeSrc = sanitizedEmbedUrl || (tourInfo.virtual_tour_url ? getEmbedUrl() : null);
  const embedWasBlocked = tourInfo.tour_embed_code && !sanitizedEmbedUrl;

  return (
    <Card className="relative overflow-hidden" ref={containerRef}>
      <CardContent className="p-0">
        {/* Tour Viewer */}
        <div className="relative" style={{ paddingBottom: '56.25%' }}>
          {/* SECURITY FIX: Using sanitized iframe URL instead of raw HTML injection */}
          {iframeSrc ? (
            <iframe
              src={iframeSrc}
              className="absolute inset-0 w-full h-full"
              allow="xr-spatial-tracking; gyroscope; accelerometer"
              allowFullScreen
              frameBorder="0"
              title={ariaLabels?.virtualTour?.[language] || 'Visite virtuelle'}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : embedWasBlocked ? (
            // Show warning if embed code was blocked (untrusted domain)
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center p-6">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <p className="text-gray-700 font-medium">Visite virtuelle indisponible</p>
                <p className="text-gray-500 text-sm mt-1">
                  Le fournisseur de visite virtuelle n'est pas pris en charge
                </p>
              </div>
            </div>
          ) : null}

          {/* Fullscreen Button */}
          {iframeSrc && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleFullscreen}
              className="absolute bottom-4 right-4 z-10 shadow-lg bg-white"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Tour Info Banner */}
        <div className="bg-searcher-600 text-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5" />
              <div>
                <p className="font-semibold">Visite Virtuelle 360°</p>
                <p className="text-xs opacity-80">
                  Utilise ta souris ou ton doigt pour explorer
                </p>
              </div>
            </div>

            <Badge variant="default" className="bg-white/20">
              {tourInfo.virtual_tour_type === 'matterport' && 'Matterport'}
              {tourInfo.virtual_tour_type === 'youtube360' && 'YouTube 360°'}
              {tourInfo.virtual_tour_type === 'custom' && 'Visite Interactive'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
