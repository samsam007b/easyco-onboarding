'use client';

import { PropertyLifestyleMetrics } from '@/types/room.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music, Sparkles, Volume2, Users, Cigarette, Dog, UserCheck } from 'lucide-react';

interface LifestyleCompatibilitySlidersProps {
  metrics: PropertyLifestyleMetrics;
  className?: string;
}

interface SliderConfig {
  label: string;
  value: number;
  icon: React.ReactNode;
  leftLabel: string;
  rightLabel: string;
  color: string;
}

export default function LifestyleCompatibilitySliders({
  metrics,
  className
}: LifestyleCompatibilitySlidersProps) {
  const sliders: SliderConfig[] = [
    {
      label: 'Ambiance',
      value: metrics.party_vibe,
      icon: <Music className="w-5 h-5" />,
      leftLabel: 'Calme',
      rightLabel: 'Festif',
      color: metrics.party_vibe > 7 ? 'from-owner-500 to-resident-500' : metrics.party_vibe > 4 ? 'from-blue-500 to-owner-500' : 'from-green-500 to-blue-500'
    },
    {
      label: 'Propreté',
      value: metrics.cleanliness,
      icon: <Sparkles className="w-5 h-5" />,
      leftLabel: 'Relaxé',
      rightLabel: 'Très rangé',
      color: metrics.cleanliness > 7 ? 'from-blue-500 to-cyan-500' : metrics.cleanliness > 4 ? 'from-green-500 to-blue-500' : 'from-amber-500 to-green-500'
    },
    {
      label: 'Niveau sonore',
      value: metrics.noise_level,
      icon: <Volume2 className="w-5 h-5" />,
      leftLabel: 'Très calme',
      rightLabel: 'Animé',
      color: metrics.noise_level > 7 ? 'from-amber-500 to-red-500' : metrics.noise_level > 4 ? 'from-amber-500 to-amber-600' : 'from-green-500 to-amber-500'
    },
    {
      label: 'Vie sociale',
      value: metrics.social_interaction,
      icon: <Users className="w-5 h-5" />,
      leftLabel: 'Indépendant',
      rightLabel: 'Très social',
      color: metrics.social_interaction > 7 ? 'from-resident-500 to-owner-500' : metrics.social_interaction > 4 ? 'from-blue-500 to-resident-500' : 'from-gray-500 to-blue-500'
    }
  ];

  const getPositionPercentage = (value: number) => {
    return ((value - 1) / 9) * 100;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5 text-resident-600" />
          Ambiance de la colocation
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Comprendre le style de vie et l'atmosphère
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sliders */}
        {sliders.map((slider, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-gray-600">{slider.icon}</div>
                <span className="font-medium text-gray-900">{slider.label}</span>
              </div>
              <Badge variant="default" className="bg-resident-100 text-resident-700 border-resident-200">
                {slider.value}/10
              </Badge>
            </div>

            {/* Custom Slider */}
            <div className="relative">
              {/* Track */}
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${slider.color} transition-all duration-300`}
                  style={{ width: `${getPositionPercentage(slider.value)}%` }}
                />
              </div>

              {/* Thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-resident-500 rounded-full shadow-md transition-all duration-300"
                style={{ left: `calc(${getPositionPercentage(slider.value)}% - 8px)` }}
              />

              {/* Labels */}
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">{slider.leftLabel}</span>
                <span className="text-xs text-gray-500">{slider.rightLabel}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Binary Attributes */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Règles de la maison</h4>
          <div className="grid grid-cols-2 gap-3">
            {/* Smoking */}
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              metrics.smoking_allowed ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'
            }`}>
              <Cigarette className={`w-5 h-5 ${metrics.smoking_allowed ? 'text-amber-600' : 'text-green-600'}`} />
              <div>
                <div className="text-sm font-medium text-gray-900">Fumeur</div>
                <div className={`text-xs ${metrics.smoking_allowed ? 'text-amber-700' : 'text-green-700'}`}>
                  {metrics.smoking_allowed ? 'Autorisé' : 'Non autorisé'}
                </div>
              </div>
            </div>

            {/* Pets */}
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              metrics.pets_allowed ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'
            }`}>
              <Dog className={`w-5 h-5 ${metrics.pets_allowed ? 'text-blue-600' : 'text-gray-600'}`} />
              <div>
                <div className="text-sm font-medium text-gray-900">Animaux</div>
                <div className={`text-xs ${metrics.pets_allowed ? 'text-blue-700' : 'text-gray-700'}`}>
                  {metrics.pets_allowed ? 'Acceptés' : 'Non acceptés'}
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              metrics.guests_allowed ? 'bg-owner-50 border border-owner-200' : 'bg-gray-50 border border-gray-200'
            }`}>
              <UserCheck className={`w-5 h-5 ${metrics.guests_allowed ? 'text-owner-600' : 'text-gray-600'}`} />
              <div>
                <div className="text-sm font-medium text-gray-900">Invités</div>
                <div className={`text-xs ${metrics.guests_allowed ? 'text-owner-700' : 'text-gray-700'}`}>
                  {metrics.guests_allowed ? 'Autorisés' : 'Non autorisés'}
                </div>
              </div>
            </div>

            {/* Shared Meals */}
            {metrics.shared_meals_frequency && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-resident-50 border border-resident-200">
                <span className="text-xl">•</span>
                <div>
                  <div className="text-sm font-medium text-gray-900">Repas communs</div>
                  <div className="text-xs text-resident-700 capitalize">
                    {metrics.shared_meals_frequency === 'never' ? 'Jamais' :
                     metrics.shared_meals_frequency === 'rarely' ? 'Rarement' :
                     metrics.shared_meals_frequency === 'sometimes' ? 'Parfois' :
                     metrics.shared_meals_frequency === 'often' ? 'Souvent' : 'Quotidien'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
