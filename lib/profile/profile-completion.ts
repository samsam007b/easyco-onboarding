/**
 * Profile Completion Calculator
 * Calculates profile completion percentage based on filled fields
 */

export interface ProfileCompletionResult {
  percentage: number;
  completedFields: number;
  totalFields: number;
  missingFields: string[];
  sections: {
    basic: { completed: number; total: number; percentage: number };
    preferences: { completed: number; total: number; percentage: number };
    lifestyle: { completed: number; total: number; percentage: number };
    personality: { completed: number; total: number; percentage: number };
    verification: { completed: number; total: number; percentage: number };
  };
}

export interface UserProfile {
  // Basic Info (Required)
  first_name?: string | null;
  last_name?: string | null;
  date_of_birth?: string | null;
  phone_number?: string | null;
  profile_photo_url?: string | null;

  // Search Preferences (Required for Searchers)
  preferred_cities?: string[] | null;
  min_budget?: number | null;
  max_budget?: number | null;
  move_in_date?: string | null;
  room_type?: string | null;

  // Lifestyle
  occupation?: string | null;
  bio?: string | null;
  cleanliness_level?: number | null;
  noise_tolerance?: string | null;
  smoking?: boolean | null;
  pets?: boolean | null;
  has_pets?: boolean | null;
  pet_friendly?: boolean | null;

  // Personality & Compatibility
  morning_person?: boolean | null;
  social_level?: string | null;
  introvert_extrovert?: string | null;
  shared_meals_interest?: boolean | null;
  event_participation?: string | null;

  // Hobbies & Interests
  hobbies?: string[] | null;
  interests?: string[] | null;

  // Values
  sustainability_importance?: string | null;
  community_values?: string[] | null;

  // Financial
  income_range?: string | null;
  employment_status?: string | null;

  // Verification
  id_verified?: boolean | null;
  email_verified?: boolean | null;
  phone_verified?: boolean | null;
  background_check?: boolean | null;
}

/**
 * Calculate profile completion percentage
 */
export function calculateProfileCompletion(profile: UserProfile | null): ProfileCompletionResult {
  if (!profile) {
    return {
      percentage: 0,
      completedFields: 0,
      totalFields: 30,
      missingFields: [],
      sections: {
        basic: { completed: 0, total: 5, percentage: 0 },
        preferences: { completed: 0, total: 5, percentage: 0 },
        lifestyle: { completed: 0, total: 8, percentage: 0 },
        personality: { completed: 0, total: 5, percentage: 0 },
        verification: { completed: 0, total: 4, percentage: 0 },
      },
    };
  }

  const missingFields: string[] = [];

  // Basic Info (Weight: 5 fields)
  const basicFields = [
    { key: 'first_name', value: profile.first_name, label: 'Prénom' },
    { key: 'last_name', value: profile.last_name, label: 'Nom' },
    { key: 'date_of_birth', value: profile.date_of_birth, label: 'Date de naissance' },
    { key: 'phone_number', value: profile.phone_number, label: 'Téléphone' },
    { key: 'profile_photo_url', value: profile.profile_photo_url, label: 'Photo de profil' },
  ];

  // Search Preferences (Weight: 5 fields)
  const preferenceFields = [
    { key: 'preferred_cities', value: profile.preferred_cities, label: 'Villes préférées' },
    { key: 'min_budget', value: profile.min_budget, label: 'Budget minimum' },
    { key: 'max_budget', value: profile.max_budget, label: 'Budget maximum' },
    { key: 'move_in_date', value: profile.move_in_date, label: 'Date d\'emménagement' },
    { key: 'room_type', value: profile.room_type, label: 'Type de chambre' },
  ];

  // Lifestyle (Weight: 8 fields)
  const lifestyleFields = [
    { key: 'occupation', value: profile.occupation, label: 'Profession' },
    { key: 'bio', value: profile.bio, label: 'Biographie' },
    { key: 'cleanliness_level', value: profile.cleanliness_level, label: 'Niveau de propreté' },
    { key: 'noise_tolerance', value: profile.noise_tolerance, label: 'Tolérance au bruit' },
    { key: 'smoking', value: profile.smoking, label: 'Fumeur' },
    { key: 'pets', value: profile.pets !== null || profile.has_pets !== null, label: 'Animaux' },
    { key: 'morning_person', value: profile.morning_person, label: 'Personne matinale' },
    { key: 'hobbies', value: profile.hobbies, label: 'Loisirs' },
  ];

  // Personality (Weight: 5 fields)
  const personalityFields = [
    { key: 'social_level', value: profile.social_level, label: 'Niveau social' },
    { key: 'introvert_extrovert', value: profile.introvert_extrovert, label: 'Introvert/Extraverti' },
    { key: 'shared_meals_interest', value: profile.shared_meals_interest, label: 'Repas partagés' },
    { key: 'event_participation', value: profile.event_participation, label: 'Participation événements' },
    { key: 'community_values', value: profile.community_values, label: 'Valeurs communautaires' },
  ];

  // Verification (Weight: 4 fields)
  const verificationFields = [
    { key: 'id_verified', value: profile.id_verified, label: 'ID vérifié' },
    { key: 'email_verified', value: profile.email_verified, label: 'Email vérifié' },
    { key: 'phone_verified', value: profile.phone_verified, label: 'Téléphone vérifié' },
    { key: 'background_check', value: profile.background_check, label: 'Vérification antécédents' },
  ];

  // Helper to check if field is filled
  const isFieldFilled = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  };

  // Calculate section completions
  const calculateSection = (fields: Array<{ key: string; value: any; label: string }>) => {
    const completed = fields.filter(f => isFieldFilled(f.value)).length;
    const total = fields.length;
    const missing = fields.filter(f => !isFieldFilled(f.value));

    missing.forEach(f => missingFields.push(f.label));

    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const sections = {
    basic: calculateSection(basicFields),
    preferences: calculateSection(preferenceFields),
    lifestyle: calculateSection(lifestyleFields),
    personality: calculateSection(personalityFields),
    verification: calculateSection(verificationFields),
  };

  // Calculate overall completion
  const totalCompleted = Object.values(sections).reduce((sum, s) => sum + s.completed, 0);
  const totalFields = Object.values(sections).reduce((sum, s) => sum + s.total, 0);
  const percentage = totalFields > 0 ? Math.round((totalCompleted / totalFields) * 100) : 0;

  return {
    percentage,
    completedFields: totalCompleted,
    totalFields,
    missingFields,
    sections,
  };
}

/**
 * Get profile completion label
 */
export function getProfileCompletionLabel(percentage: number): string {
  if (percentage === 100) return 'Complet';
  if (percentage >= 80) return 'Presque complet';
  if (percentage >= 60) return 'Bien avancé';
  if (percentage >= 40) return 'En cours';
  if (percentage >= 20) return 'Démarré';
  return 'À compléter';
}

/**
 * Get profile completion color
 */
export function getProfileCompletionColor(percentage: number): {
  bg: string;
  text: string;
  border: string;
} {
  if (percentage === 100) {
    return {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    };
  }
  if (percentage >= 60) {
    return {
      bg: 'bg-[#FFF9E6]',
      text: 'text-[#F9A825]',
      border: 'border-[#FFC107]',
    };
  }
  return {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
  };
}
