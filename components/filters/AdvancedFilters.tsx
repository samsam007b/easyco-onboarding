'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RangeSlider } from '@/components/ui/range-slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Euro,
  MapPin,
  Home,
  Users,
  Calendar,
  Clock,
  Sparkles,
  Heart,
  Coffee,
  Music,
  Wind,
  Flame,
  Dog,
  X,
  Filter,
  RotateCcw,
} from 'lucide-react';

export interface AdvancedFiltersState {
  // Basiques
  priceRange: { min: number; max: number };
  cities: string[];
  neighborhoods: string[];
  propertyTypes: string[];
  bedrooms: { min: number | null; max: number | null };
  bathrooms: { min: number | null; max: number | null };
  furnished: boolean | null;

  // Disponibilité
  availableFrom: string;
  minStayMonths: number | null;

  // Lifestyle - Compatibility
  smoking: 'yes' | 'no' | 'flexible';
  pets: 'yes' | 'no' | 'flexible';
  cleanlinessLevel: { min: number; max: number }; // 1-10
  socialLevel: string[];

  // Horaires
  wakeUpTime: string[];
  sleepTime: string[];
  workSchedule: string[];

  // Âge & Profil
  ageRange: { min: number; max: number };
  genderMix: string[];
  occupationTypes: string[];
  languages: string[];

  // Home Lifestyle
  guestFrequency: string[];
  musicHabits: string[];
  cookingFrequency: string[];

  // Équipements
  amenities: string[];

  // Match score
  minMatchScore: number;
}

interface AdvancedFiltersProps {
  filters: AdvancedFiltersState;
  onFiltersChange: (filters: AdvancedFiltersState) => void;
  onClose: () => void;
  onReset: () => void;
  activeFiltersCount: number;
}

const CITIES = [
  'Bruxelles',
  'Ixelles',
  'Etterbeek',
  'Saint-Gilles',
  'Schaerbeek',
  'Molenbeek',
  'Anderlecht',
  'Uccle',
  'Forest',
  'Jette',
];

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Appartement' },
  { value: 'house', label: 'Maison' },
  { value: 'studio', label: 'Studio' },
  { value: 'coliving', label: 'Coliving' },
  { value: 'private_room', label: 'Chambre privée' },
];

const AMENITIES = [
  { id: 'wifi', label: 'WiFi', icon: Wind },
  { id: 'parking', label: 'Parking', icon: Home },
  { id: 'balcony', label: 'Balcon', icon: Home },
  { id: 'garden', label: 'Jardin', icon: Home },
  { id: 'elevator', label: 'Ascenseur', icon: Home },
  { id: 'dishwasher', label: 'Lave-vaisselle', icon: Home },
  { id: 'washing_machine', label: 'Machine à laver', icon: Home },
  { id: 'dryer', label: 'Sèche-linge', icon: Flame },
  { id: 'air_conditioning', label: 'Climatisation', icon: Wind },
  { id: 'heating', label: 'Chauffage', icon: Flame },
];

const WAKE_UP_TIMES = [
  { value: 'early', label: 'Tôt (5h-7h)' },
  { value: 'moderate', label: 'Moyen (7h-9h)' },
  { value: 'late', label: 'Tard (9h+)' },
];

const SLEEP_TIMES = [
  { value: 'early', label: 'Tôt (21h-22h)' },
  { value: 'moderate', label: 'Moyen (22h-00h)' },
  { value: 'late', label: 'Tard (00h+)' },
];

const WORK_SCHEDULES = [
  { value: 'traditional', label: 'Bureau (9h-17h)' },
  { value: 'flexible', label: 'Flexible' },
  { value: 'remote', label: 'Télétravail' },
  { value: 'student', label: 'Étudiant' },
];

const SOCIAL_LEVELS = [
  { value: 'introvert', label: 'Introverti' },
  { value: 'moderate', label: 'Modéré' },
  { value: 'extrovert', label: 'Extraverti' },
];

const GENDER_MIX = [
  { value: 'male-only', label: 'Hommes uniquement' },
  { value: 'female-only', label: 'Femmes uniquement' },
  { value: 'mixed', label: 'Mixte' },
  { value: 'no-preference', label: 'Pas de préférence' },
];

const OCCUPATION_TYPES = [
  { value: 'student', label: 'Étudiant' },
  { value: 'employee', label: 'Employé' },
  { value: 'self-employed', label: 'Indépendant' },
  { value: 'intern', label: 'Stagiaire' },
  { value: 'job_seeker', label: 'En recherche' },
];

const GUEST_FREQUENCY = [
  { value: 'never', label: 'Jamais' },
  { value: 'rarely', label: 'Rarement' },
  { value: 'sometimes', label: 'Parfois' },
  { value: 'often', label: 'Souvent' },
];

const MUSIC_HABITS = [
  { value: 'quiet', label: 'Silencieux' },
  { value: 'low-volume', label: 'Volume bas' },
  { value: 'moderate', label: 'Modéré' },
  { value: 'loud', label: 'Fort' },
];

const COOKING_FREQUENCY = [
  { value: 'never', label: 'Jamais' },
  { value: 'once-week', label: '1x/semaine' },
  { value: 'few-times', label: 'Quelques fois' },
  { value: 'daily', label: 'Quotidien' },
];

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onClose,
  onReset,
  activeFiltersCount,
}: AdvancedFiltersProps) {
  const updateFilters = (updates: Partial<AdvancedFiltersState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end overflow-y-auto">
      <div className="min-h-screen w-full md:w-[500px] bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Filtres avancés</h2>
                  <p className="text-sm text-gray-600">
                    {activeFiltersCount} filtre{activeFiltersCount !== 1 ? 's' : ''} actif{activeFiltersCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={onReset}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
              <Button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white hover:from-[#FF8C30] hover:to-[#FFA548]"
              >
                Appliquer
              </Button>
            </div>
          </div>
        </div>

        {/* Filters Content */}
        <div className="p-6 space-y-6">
          <Accordion type="multiple" defaultValue={['price', 'location']} className="space-y-4">

            {/* Prix */}
            <AccordionItem value="price" className="border border-gray-200 rounded-2xl px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Euro className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold">Budget mensuel</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">€{filters.priceRange.min}</span>
                    <span className="text-gray-600">-</span>
                    <span className="font-medium">€{filters.priceRange.max}</span>
                  </div>
                  <RangeSlider
                    min={0}
                    max={5000}
                    step={50}
                    value={[filters.priceRange.min, filters.priceRange.max]}
                    onValueChange={(value) =>
                      updateFilters({ priceRange: { min: value[0], max: value[1] } })
                    }
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Localisation */}
            <AccordionItem value="location" className="border border-gray-200 rounded-2xl px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold">Localisation</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {CITIES.map((city) => (
                      <Badge
                        key={city}
                        variant={filters.cities.includes(city) ? 'default' : 'secondary'}
                        className={`cursor-pointer transition ${
                          filters.cities.includes(city)
                            ? 'bg-orange-600 hover:bg-orange-700'
                            : 'hover:bg-orange-50'
                        }`}
                        onClick={() =>
                          updateFilters({
                            cities: toggleArrayItem(filters.cities, city),
                          })
                        }
                      >
                        {city}
                      </Badge>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Type de logement */}
            <AccordionItem value="property-type" className="border border-gray-200 rounded-2xl px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold">Type de logement</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="space-y-3">
                  {PROPERTY_TYPES.map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-orange-50 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={filters.propertyTypes.includes(type.value)}
                        onChange={() =>
                          updateFilters({
                            propertyTypes: toggleArrayItem(filters.propertyTypes, type.value),
                          })
                        }
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Chambres & Salles de bain */}
            <AccordionItem value="rooms" className="border border-gray-200 rounded-2xl px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold">Chambres & Salles de bain</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Chambres (min-max)</Label>
                    <div className="flex gap-2">
                      <select
                        value={filters.bedrooms.min?.toString() || 'any'}
                        onChange={(e) =>
                          updateFilters({
                            bedrooms: {
                              ...filters.bedrooms,
                              min: e.target.value === 'any' ? null : parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="any">Peu importe</option>
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num.toString()}>
                            {num}+
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Salles de bain (min)</Label>
                    <select
                      value={filters.bathrooms.min?.toString() || 'any'}
                      onChange={(e) =>
                        updateFilters({
                          bathrooms: {
                            ...filters.bathrooms,
                            min: e.target.value === 'any' ? null : parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="any">Peu importe</option>
                      {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num.toString()}>
                          {num}+
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="furnished" className="text-sm font-medium">
                      Meublé
                    </Label>
                    <Switch
                      id="furnished"
                      checked={filters.furnished === true}
                      onCheckedChange={(checked) =>
                        updateFilters({ furnished: checked ? true : null })
                      }
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Lifestyle - Compatibility */}
            <AccordionItem value="lifestyle" className="border border-gray-200 rounded-2xl px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold">Compatibilité lifestyle</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="space-y-6">
                  {/* Fumeur */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Fumeur</Label>
                    <div className="flex gap-2">
                      {[
                        { value: 'no', label: 'Non' },
                        { value: 'flexible', label: 'Flexible' },
                        { value: 'yes', label: 'Oui' },
                      ].map((option) => (
                        <Badge
                          key={option.value}
                          variant={filters.smoking === option.value ? 'default' : 'secondary'}
                          className={`cursor-pointer flex-1 justify-center ${
                            filters.smoking === option.value
                              ? 'bg-orange-600 hover:bg-orange-700'
                              : 'hover:bg-orange-50'
                          }`}
                          onClick={() =>
                            updateFilters({ smoking: option.value as any })
                          }
                        >
                          {option.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Animaux */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      <Dog className="w-4 h-4 inline mr-2" />
                      Animaux de compagnie
                    </Label>
                    <div className="flex gap-2">
                      {[
                        { value: 'no', label: 'Non' },
                        { value: 'flexible', label: 'Flexible' },
                        { value: 'yes', label: 'Oui' },
                      ].map((option) => (
                        <Badge
                          key={option.value}
                          variant={filters.pets === option.value ? 'default' : 'secondary'}
                          className={`cursor-pointer flex-1 justify-center ${
                            filters.pets === option.value
                              ? 'bg-orange-600 hover:bg-orange-700'
                              : 'hover:bg-orange-50'
                          }`}
                          onClick={() =>
                            updateFilters({ pets: option.value as any })
                          }
                        >
                          {option.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Niveau de propreté */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Niveau de propreté (1-10)
                    </Label>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>{filters.cleanlinessLevel.min}</span>
                      <span className="text-gray-600">-</span>
                      <span>{filters.cleanlinessLevel.max}</span>
                    </div>
                    <RangeSlider
                      min={1}
                      max={10}
                      step={1}
                      value={[filters.cleanlinessLevel.min, filters.cleanlinessLevel.max]}
                      onValueChange={(value) =>
                        updateFilters({ cleanlinessLevel: { min: value[0], max: value[1] } })
                      }
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Relaxed</span>
                      <span>Spotless</span>
                    </div>
                  </div>

                  {/* Niveau social */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Énergie sociale</Label>
                    <div className="flex flex-wrap gap-2">
                      {SOCIAL_LEVELS.map((level) => (
                        <Badge
                          key={level.value}
                          variant={filters.socialLevel.includes(level.value) ? 'default' : 'secondary'}
                          className={`cursor-pointer ${
                            filters.socialLevel.includes(level.value)
                              ? 'bg-orange-600 hover:bg-orange-700'
                              : 'hover:bg-orange-50'
                          }`}
                          onClick={() =>
                            updateFilters({
                              socialLevel: toggleArrayItem(filters.socialLevel, level.value),
                            })
                          }
                        >
                          {level.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Horaires */}
            <AccordionItem value="schedule" className="border border-gray-200 rounded-2xl px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold">Horaires & Rythme</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="space-y-6">
                  {/* Réveil */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Heure de réveil</Label>
                    <div className="space-y-2">
                      {WAKE_UP_TIMES.map((time) => (
                        <label
                          key={time.value}
                          className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-orange-50 cursor-pointer transition"
                        >
                          <input
                            type="checkbox"
                            checked={filters.wakeUpTime.includes(time.value)}
                            onChange={() =>
                              updateFilters({
                                wakeUpTime: toggleArrayItem(filters.wakeUpTime, time.value),
                              })
                            }
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm">{time.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Coucher */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Heure de coucher</Label>
                    <div className="space-y-2">
                      {SLEEP_TIMES.map((time) => (
                        <label
                          key={time.value}
                          className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-orange-50 cursor-pointer transition"
                        >
                          <input
                            type="checkbox"
                            checked={filters.sleepTime.includes(time.value)}
                            onChange={() =>
                              updateFilters({
                                sleepTime: toggleArrayItem(filters.sleepTime, time.value),
                              })
                            }
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm">{time.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Travail */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Type d'emploi</Label>
                    <div className="flex flex-wrap gap-2">
                      {WORK_SCHEDULES.map((schedule) => (
                        <Badge
                          key={schedule.value}
                          variant={filters.workSchedule.includes(schedule.value) ? 'default' : 'secondary'}
                          className={`cursor-pointer ${
                            filters.workSchedule.includes(schedule.value)
                              ? 'bg-orange-600 hover:bg-orange-700'
                              : 'hover:bg-orange-50'
                          }`}
                          onClick={() =>
                            updateFilters({
                              workSchedule: toggleArrayItem(filters.workSchedule, schedule.value),
                            })
                          }
                        >
                          {schedule.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Âge & Profil */}
            <AccordionItem value="profile" className="border border-gray-200 rounded-2xl px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold">Âge & Profil</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="space-y-6">
                  {/* Tranche d'âge */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Tranche d'âge ({filters.ageRange.min}-{filters.ageRange.max} ans)
                    </Label>
                    <RangeSlider
                      min={18}
                      max={65}
                      step={1}
                      value={[filters.ageRange.min, filters.ageRange.max]}
                      onValueChange={(value) =>
                        updateFilters({ ageRange: { min: value[0], max: value[1] } })
                      }
                    />
                  </div>

                  {/* Mix de genre */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Mix de genre</Label>
                    <div className="flex flex-wrap gap-2">
                      {GENDER_MIX.map((gender) => (
                        <Badge
                          key={gender.value}
                          variant={filters.genderMix.includes(gender.value) ? 'default' : 'secondary'}
                          className={`cursor-pointer ${
                            filters.genderMix.includes(gender.value)
                              ? 'bg-orange-600 hover:bg-orange-700'
                              : 'hover:bg-orange-50'
                          }`}
                          onClick={() =>
                            updateFilters({
                              genderMix: toggleArrayItem(filters.genderMix, gender.value),
                            })
                          }
                        >
                          {gender.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Type d'occupation */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Type d'occupation</Label>
                    <div className="flex flex-wrap gap-2">
                      {OCCUPATION_TYPES.map((occupation) => (
                        <Badge
                          key={occupation.value}
                          variant={filters.occupationTypes.includes(occupation.value) ? 'default' : 'secondary'}
                          className={`cursor-pointer ${
                            filters.occupationTypes.includes(occupation.value)
                              ? 'bg-orange-600 hover:bg-orange-700'
                              : 'hover:bg-orange-50'
                          }`}
                          onClick={() =>
                            updateFilters({
                              occupationTypes: toggleArrayItem(filters.occupationTypes, occupation.value),
                            })
                          }
                        >
                          {occupation.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Habitudes à la maison */}
            <AccordionItem value="home-habits" className="border border-gray-200 rounded-2xl px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Coffee className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold">Habitudes à la maison</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="space-y-6">
                  {/* Fréquence invités */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Fréquence des invités</Label>
                    <div className="flex flex-wrap gap-2">
                      {GUEST_FREQUENCY.map((freq) => (
                        <Badge
                          key={freq.value}
                          variant={filters.guestFrequency.includes(freq.value) ? 'default' : 'secondary'}
                          className={`cursor-pointer ${
                            filters.guestFrequency.includes(freq.value)
                              ? 'bg-orange-600 hover:bg-orange-700'
                              : 'hover:bg-orange-50'
                          }`}
                          onClick={() =>
                            updateFilters({
                              guestFrequency: toggleArrayItem(filters.guestFrequency, freq.value),
                            })
                          }
                        >
                          {freq.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Habitudes musique */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      <Music className="w-4 h-4 inline mr-2" />
                      Habitudes musique
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {MUSIC_HABITS.map((habit) => (
                        <Badge
                          key={habit.value}
                          variant={filters.musicHabits.includes(habit.value) ? 'default' : 'secondary'}
                          className={`cursor-pointer ${
                            filters.musicHabits.includes(habit.value)
                              ? 'bg-orange-600 hover:bg-orange-700'
                              : 'hover:bg-orange-50'
                          }`}
                          onClick={() =>
                            updateFilters({
                              musicHabits: toggleArrayItem(filters.musicHabits, habit.value),
                            })
                          }
                        >
                          {habit.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Fréquence cuisine */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      <Coffee className="w-4 h-4 inline mr-2" />
                      Fréquence cuisine
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {COOKING_FREQUENCY.map((freq) => (
                        <Badge
                          key={freq.value}
                          variant={filters.cookingFrequency.includes(freq.value) ? 'default' : 'secondary'}
                          className={`cursor-pointer ${
                            filters.cookingFrequency.includes(freq.value)
                              ? 'bg-orange-600 hover:bg-orange-700'
                              : 'hover:bg-orange-50'
                          }`}
                          onClick={() =>
                            updateFilters({
                              cookingFrequency: toggleArrayItem(filters.cookingFrequency, freq.value),
                            })
                          }
                        >
                          {freq.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Équipements */}
            <AccordionItem value="amenities" className="border border-gray-200 rounded-2xl px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold">Équipements</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="grid grid-cols-2 gap-3">
                  {AMENITIES.map((amenity) => (
                    <label
                      key={amenity.id}
                      className={`flex items-center gap-2 p-3 rounded-xl border border-gray-200 cursor-pointer transition ${
                        filters.amenities.includes(amenity.id)
                          ? 'bg-orange-50 border-orange-600'
                          : 'hover:bg-orange-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity.id)}
                        onChange={() =>
                          updateFilters({
                            amenities: toggleArrayItem(filters.amenities, amenity.id),
                          })
                        }
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm">{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Score de compatibilité */}
            <AccordionItem value="match-score" className="border border-gray-200 rounded-2xl px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold">Score de compatibilité</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="space-y-4">
                  <Label className="text-sm font-medium block">
                    Score minimum: {filters.minMatchScore}%
                  </Label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={filters.minMatchScore}
                    onChange={(e) =>
                      updateFilters({ minMatchScore: Number(e.target.value) })
                    }
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer
                               [&::-webkit-slider-thumb]:appearance-none
                               [&::-webkit-slider-thumb]:w-5
                               [&::-webkit-slider-thumb]:h-5
                               [&::-webkit-slider-thumb]:rounded-full
                               [&::-webkit-slider-thumb]:bg-white
                               [&::-webkit-slider-thumb]:border-2
                               [&::-webkit-slider-thumb]:border-orange-600
                               [&::-webkit-slider-thumb]:cursor-pointer
                               [&::-webkit-slider-thumb]:shadow-md
                               [&::-moz-range-thumb]:appearance-none
                               [&::-moz-range-thumb]:w-5
                               [&::-moz-range-thumb]:h-5
                               [&::-moz-range-thumb]:rounded-full
                               [&::-moz-range-thumb]:bg-white
                               [&::-moz-range-thumb]:border-2
                               [&::-moz-range-thumb]:border-orange-600
                               [&::-moz-range-thumb]:cursor-pointer
                               [&::-moz-range-thumb]:shadow-md"
                    style={{
                      background: `linear-gradient(to right, #FFA040 0%, #FFA040 ${filters.minMatchScore}%, #E5E7EB ${filters.minMatchScore}%, #E5E7EB 100%)`
                    }}
                  />
                  <p className="text-xs text-gray-500">
                    Affiche uniquement les propriétés avec un score de compatibilité supérieur à ce seuil
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex gap-3">
            <Button
              onClick={onReset}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white hover:from-[#FF8C30] hover:to-[#FFA548]"
            >
              Voir les résultats
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
