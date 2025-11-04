'use client';

import { useState } from 'react';
import { ResidentProfile } from '@/types/room.types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User, Briefcase, Globe, Languages, Heart, Sparkles, Volume2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResidentProfileCardProps {
  resident: ResidentProfile;
  compact?: boolean;
  className?: string;
}

export default function ResidentProfileCard({
  resident,
  compact = false,
  className
}: ResidentProfileCardProps) {
  const [showFullProfile, setShowFullProfile] = useState(false);

  const getCleanlinessLabel = (level?: string) => {
    switch (level) {
      case 'relaxed': return 'Relaxé';
      case 'moderate': return 'Modéré';
      case 'tidy': return 'Rangé';
      case 'spotless': return 'Impeccable';
      default: return 'Non spécifié';
    }
  };

  const getNoiseToleranceLabel = (level?: string) => {
    switch (level) {
      case 'low': return 'Calme';
      case 'medium': return 'Modéré';
      case 'high': return 'Animé';
      default: return 'Non spécifié';
    }
  };

  const getOccupationStatusLabel = (status?: string) => {
    switch (status) {
      case 'student': return 'Étudiant(e)';
      case 'employed': return 'Employé(e)';
      case 'self-employed': return 'Indépendant(e)';
      case 'unemployed': return 'En recherche';
      case 'retired': return 'Retraité(e)';
      default: return '';
    }
  };

  // Compact card for resident preview
  if (compact) {
    return (
      <>
        <button
          onClick={() => setShowFullProfile(true)}
          className={cn(
            "flex flex-col items-center gap-2 p-3 rounded-lg bg-white border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all",
            className
          )}
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              {resident.profile_photo_url ? (
                <img
                  src={resident.profile_photo_url}
                  alt={`${resident.first_name} ${resident.last_name}`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-7 h-7 text-white" />
              )}
            </div>
            {resident.age && (
              <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {resident.age}
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm text-gray-900">{resident.first_name}</p>
            {resident.occupation_status && (
              <p className="text-xs text-gray-600">{getOccupationStatusLabel(resident.occupation_status)}</p>
            )}
          </div>
        </button>

        {/* Full Profile Modal */}
        <Dialog open={showFullProfile} onOpenChange={setShowFullProfile}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  {resident.profile_photo_url ? (
                    <img
                      src={resident.profile_photo_url}
                      alt={`${resident.first_name} ${resident.last_name}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{resident.first_name} {resident.last_name}</h3>
                  {resident.age && <p className="text-sm text-gray-600">{resident.age} ans</p>}
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                {resident.occupation && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-500">Profession</p>
                      <p className="font-medium text-gray-900">{resident.occupation}</p>
                    </div>
                  </div>
                )}
                {resident.nationality && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-500">Nationalité</p>
                      <p className="font-medium text-gray-900">{resident.nationality}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Languages */}
              {resident.languages && resident.languages.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Languages className="w-5 h-5 text-orange-600" />
                    <p className="font-semibold text-gray-900">Langues</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resident.languages.map((lang, idx) => (
                      <Badge key={idx} variant="default" className="bg-orange-50 border-orange-200 text-orange-700">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              {resident.bio && (
                <div>
                  <p className="font-semibold text-gray-900 mb-2">À propos</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{resident.bio}</p>
                </div>
              )}

              {/* Interests */}
              {resident.interests && resident.interests.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-orange-600" />
                    <p className="font-semibold text-gray-900">Centres d'intérêt</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resident.interests.map((interest, idx) => (
                      <Badge key={idx} className="bg-orange-100 text-orange-700 border-orange-200">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Lifestyle Compatibility */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-4">Préférences de vie</h4>
                <div className="grid grid-cols-2 gap-4">
                  {/* Cleanliness */}
                  {resident.cleanliness_preference && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Propreté</p>
                        <p className="font-medium text-gray-900">{getCleanlinessLabel(resident.cleanliness_preference)}</p>
                      </div>
                    </div>
                  )}

                  {/* Noise Tolerance */}
                  {resident.noise_tolerance && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                      <Volume2 className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-xs text-gray-500">Niveau sonore</p>
                        <p className="font-medium text-gray-900">{getNoiseToleranceLabel(resident.noise_tolerance)}</p>
                      </div>
                    </div>
                  )}

                  {/* Sociability */}
                  {resident.sociability_level && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                      <Users className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Sociabilité</p>
                        <p className="font-medium text-gray-900">{resident.sociability_level}/10</p>
                      </div>
                    </div>
                  )}

                  {/* Smoking */}
                  {resident.is_smoker !== undefined && (
                    <div className={`flex items-center gap-3 p-3 rounded-lg ${
                      resident.is_smoker ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'
                    }`}>
                      <span className="text-xl">🚬</span>
                      <div>
                        <p className="text-xs text-gray-500">Fumeur</p>
                        <p className="font-medium text-gray-900">{resident.is_smoker ? 'Oui' : 'Non'}</p>
                      </div>
                    </div>
                  )}

                  {/* Pets */}
                  {resident.has_pets !== undefined && (
                    <div className={`flex items-center gap-3 p-3 rounded-lg ${
                      resident.has_pets ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <span className="text-xl">🐾</span>
                      <div>
                        <p className="text-xs text-gray-500">Animaux</p>
                        <p className="font-medium text-gray-900">{resident.has_pets ? 'Oui' : 'Non'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Full card view (for dedicated residents section)
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            {resident.profile_photo_url ? (
              <img
                src={resident.profile_photo_url}
                alt={`${resident.first_name} ${resident.last_name}`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>
          {resident.age && (
            <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
              {resident.age}
            </div>
          )}
        </div>

        <div className="flex-1">
          <h4 className="text-lg font-bold text-gray-900">{resident.first_name} {resident.last_name}</h4>
          {resident.occupation && (
            <p className="text-sm text-gray-600">{resident.occupation}</p>
          )}

          {resident.bio && (
            <p className="text-sm text-gray-700 mt-2 line-clamp-2">{resident.bio}</p>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFullProfile(true)}
            className="mt-3 text-orange-600 border-orange-300 hover:bg-orange-50"
          >
            Voir plus
          </Button>
        </div>
      </div>

      {/* Full Profile Modal */}
      <Dialog open={showFullProfile} onOpenChange={setShowFullProfile}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                {resident.profile_photo_url ? (
                  <img
                    src={resident.profile_photo_url}
                    alt={`${resident.first_name} ${resident.last_name}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold">{resident.first_name} {resident.last_name}</h3>
                {resident.age && <p className="text-sm text-gray-600">{resident.age} ans</p>}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              {resident.occupation && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-500">Profession</p>
                    <p className="font-medium text-gray-900">{resident.occupation}</p>
                  </div>
                </div>
              )}
              {resident.nationality && (
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-500">Nationalité</p>
                    <p className="font-medium text-gray-900">{resident.nationality}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Languages */}
            {resident.languages && resident.languages.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Languages className="w-5 h-5 text-orange-600" />
                  <p className="font-semibold text-gray-900">Langues</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resident.languages.map((lang, idx) => (
                    <Badge key={idx} variant="default" className="bg-orange-50 border-orange-200 text-orange-700">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            {resident.bio && (
              <div>
                <p className="font-semibold text-gray-900 mb-2">À propos</p>
                <p className="text-gray-700 text-sm leading-relaxed">{resident.bio}</p>
              </div>
            )}

            {/* Interests */}
            {resident.interests && resident.interests.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-orange-600" />
                  <p className="font-semibold text-gray-900">Centres d'intérêt</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resident.interests.map((interest, idx) => (
                    <Badge key={idx} className="bg-orange-100 text-orange-700 border-orange-200">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Lifestyle Compatibility */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-4">Préférences de vie</h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Cleanliness */}
                {resident.cleanliness_preference && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Propreté</p>
                      <p className="font-medium text-gray-900">{getCleanlinessLabel(resident.cleanliness_preference)}</p>
                    </div>
                  </div>
                )}

                {/* Noise Tolerance */}
                {resident.noise_tolerance && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <Volume2 className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-xs text-gray-500">Niveau sonore</p>
                      <p className="font-medium text-gray-900">{getNoiseToleranceLabel(resident.noise_tolerance)}</p>
                    </div>
                  </div>
                )}

                {/* Sociability */}
                {resident.sociability_level && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                    <Users className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500">Sociabilité</p>
                      <p className="font-medium text-gray-900">{resident.sociability_level}/10</p>
                    </div>
                  </div>
                )}

                {/* Smoking */}
                {resident.is_smoker !== undefined && (
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${
                    resident.is_smoker ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'
                  }`}>
                    <span className="text-xl">🚬</span>
                    <div>
                      <p className="text-xs text-gray-500">Fumeur</p>
                      <p className="font-medium text-gray-900">{resident.is_smoker ? 'Oui' : 'Non'}</p>
                    </div>
                  </div>
                )}

                {/* Pets */}
                {resident.has_pets !== undefined && (
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${
                    resident.has_pets ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <span className="text-xl">🐾</span>
                    <div>
                      <p className="text-xs text-gray-500">Animaux</p>
                      <p className="font-medium text-gray-900">{resident.has_pets ? 'Oui' : 'Non'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
