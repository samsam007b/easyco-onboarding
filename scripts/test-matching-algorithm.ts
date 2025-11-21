/**
 * Test Script for Matching Algorithm
 * Tests both user-to-user and property-to-person matching
 */

import {
  calculateMatchScore,
  getMatchQuality,
  type UserPreferences,
  type PropertyFeatures,
} from '../lib/services/matching-service';

import {
  calculateUserCompatibility,
  getCompatibilityQuality,
  type UserProfile,
} from '../lib/services/user-matching-service';

// ============================================================================
// TEST DATA
// ============================================================================

// Test User Profile (Searcher)
const testUserProfile: UserProfile = {
  user_id: 'test-user-1',
  first_name: 'Marie',
  last_name: 'Dubois',
  date_of_birth: '1995-06-15',
  gender: 'female',
  nationality: 'French',
  languages: ['French', 'English'],
  occupation_status: 'employed',
  bio: 'Young professional looking for coliving',

  // Lifestyle
  cleanliness_level: 8, // Very clean
  social_energy: 7, // Fairly extroverted
  openness_to_sharing: 'open',
  cultural_openness: 'very_open',
  house_rules_preference: 6, // Moderately structured
  shared_space_importance: 7,

  // Daily routine
  wake_up_time: 'early', // 7am
  sleep_time: 'moderate', // 11pm
  works_from_home: true,
  exercise_frequency: 'often',

  // Social
  guest_frequency: 'sometimes',
  shared_meals_interest: true,
  flatmate_meetups_interest: true,
  event_participation_interest: 'high',

  // Lifestyle habits
  smoking: false,
  pets: false,
  cooking_frequency: 'often',
  music_at_home: true,

  // Values
  core_values: ['respect', 'cleanliness', 'communication', 'sharing'],

  // Preferences
  preferred_coliving_size: 'medium', // 4-6 people
  gender_preference: 'mixed',
  age_range_min: 23,
  age_range_max: 35,
  preferred_neighborhoods: ['Ixelles', 'Saint-Gilles', 'Etterbeek'],
  min_budget: 600,
  max_budget: 900,

  // Tolerance
  pets_tolerance: true,
  smoking_tolerance: false,
};

// Test Compatible User
const compatibleUser: UserProfile = {
  user_id: 'test-user-2',
  first_name: 'Sophie',
  last_name: 'Martin',
  date_of_birth: '1993-03-20',
  gender: 'female',
  nationality: 'Belgian',
  languages: ['French', 'Dutch', 'English'],
  occupation_status: 'employed',
  bio: 'Marketing professional, love social activities',

  // Lifestyle - Very similar to testUserProfile
  cleanliness_level: 7,
  social_energy: 8,
  openness_to_sharing: 'very_open',
  cultural_openness: 'very_open',
  house_rules_preference: 7,
  shared_space_importance: 6,

  // Daily routine - Similar
  wake_up_time: 'early',
  sleep_time: 'moderate',
  works_from_home: false,
  exercise_frequency: 'often',

  // Social - Very compatible
  guest_frequency: 'sometimes',
  shared_meals_interest: true,
  flatmate_meetups_interest: true,
  event_participation_interest: 'high',

  // Lifestyle habits - Compatible
  smoking: false,
  pets: false,
  cooking_frequency: 'often',
  music_at_home: true,

  // Values - Overlapping values
  core_values: ['respect', 'communication', 'fun', 'sharing'],

  // Preferences
  preferred_coliving_size: 'medium',
  gender_preference: 'mixed',
  age_range_min: 25,
  age_range_max: 40,
  preferred_neighborhoods: ['Ixelles', 'Schaerbeek'],
  min_budget: 650,
  max_budget: 950,

  pets_tolerance: true,
  smoking_tolerance: false,
};

// Test Incompatible User
const incompatibleUser: UserProfile = {
  user_id: 'test-user-3',
  first_name: 'Tom',
  last_name: 'Johnson',
  date_of_birth: '1988-11-10',
  gender: 'male',
  nationality: 'American',
  languages: ['English'],
  occupation_status: 'student',
  bio: 'Party lover, night owl',

  // Lifestyle - Very different
  cleanliness_level: 3, // Low cleanliness
  social_energy: 10, // Very extroverted
  openness_to_sharing: 'private',
  cultural_openness: 'moderate',
  house_rules_preference: 2, // Very flexible
  shared_space_importance: 3,

  // Daily routine - Opposite
  wake_up_time: 'late', // Noon
  sleep_time: 'late', // 2am
  works_from_home: false,
  exercise_frequency: 'never',

  // Social - Different
  guest_frequency: 'often', // Lots of guests
  shared_meals_interest: false,
  flatmate_meetups_interest: false,
  event_participation_interest: 'low',

  // Lifestyle habits - Dealbreakers
  smoking: true, // DEALBREAKER for testUserProfile
  pets: false,
  cooking_frequency: 'never',
  music_at_home: true,

  // Values - No overlap
  core_values: ['freedom', 'fun', 'flexibility'],

  // Preferences
  preferred_coliving_size: 'very_large',
  gender_preference: 'mixed',
  age_range_min: 18,
  age_range_max: 30,
  preferred_neighborhoods: ['Louise', 'Centre'],
  min_budget: 800,
  max_budget: 1200,

  pets_tolerance: true,
  smoking_tolerance: true,
};

// Test Property (Perfect Match)
const perfectProperty: PropertyFeatures = {
  price: 750, // Within budget (600-900)
  city: 'Brussels',
  neighborhood: 'Ixelles', // Preferred neighborhood
  address: 'Rue du Trone 45',

  bedrooms: 4,
  bathrooms: 2,
  furnished: true,
  balcony: true,
  parking: false,

  available_from: '2025-11-01',
  min_lease_duration_months: 6,
  max_lease_duration_months: 12,

  smoking_allowed: false, // Matches preference
  pets_allowed: false,
};

// Test Property (Good Match)
const goodProperty: PropertyFeatures = {
  price: 850, // Slightly high but within budget
  city: 'Brussels',
  neighborhood: 'Saint-Gilles', // Preferred neighborhood
  address: 'Avenue de la Toison d\'Or 20',

  bedrooms: 3,
  bathrooms: 1,
  furnished: true,
  balcony: false,
  parking: true,

  available_from: '2025-12-01',
  min_lease_duration_months: 12,
  max_lease_duration_months: 24,

  smoking_allowed: false,
  pets_allowed: true, // User tolerates pets
};

// Test Property (Poor Match)
const poorProperty: PropertyFeatures = {
  price: 1200, // Way over budget
  city: 'Brussels',
  neighborhood: 'Woluwe', // Not in preferred list
  address: 'Boulevard de la Woluwe 100',

  bedrooms: 1, // Too small
  bathrooms: 1,
  furnished: false, // User might prefer furnished
  balcony: false,
  parking: false,

  available_from: '2026-01-01', // Too late
  min_lease_duration_months: 24, // Too long
  max_lease_duration_months: 36,

  smoking_allowed: true, // User doesn't smoke
  pets_allowed: false,
};

// User Preferences for Property Matching
const userPreferences: UserPreferences = {
  min_budget: 600,
  max_budget: 900,
  preferred_cities: ['Brussels', 'Bruxelles'],
  preferred_neighborhoods: ['Ixelles', 'Saint-Gilles', 'Etterbeek'],
  cleanliness_level: 8,
  noise_tolerance: 6,
  guest_frequency: 'sometimes',
  smoking: false,
  pets: false,
  min_bedrooms: 2,
  min_bathrooms: 1,
  furnished: true,
  balcony: true,
  parking: false,
  desired_move_in_date: '2025-11-15',
  desired_lease_duration_months: 12,
  age_range_min: 23,
  age_range_max: 35,
};

// ============================================================================
// TEST FUNCTIONS
// ============================================================================

console.log('🧪 MATCHING ALGORITHM DIAGNOSTIC TEST\n');
console.log('='.repeat(80));

// TEST 1: User-to-User Matching
console.log('\n📋 TEST 1: USER-TO-USER COMPATIBILITY\n');
console.log('-'.repeat(80));

// Test compatible match
console.log('\n✅ Test 1a: Compatible Users (Marie & Sophie)');
const compatibleResult = calculateUserCompatibility(testUserProfile, compatibleUser);
const compatibleQuality = getCompatibilityQuality(compatibleResult.score);

console.log(`Score: ${compatibleResult.score}/100 (${compatibleQuality.label} ${compatibleQuality.emoji})`);
console.log(`Description: ${compatibleQuality.description}`);
console.log('\nBreakdown:');
console.log(`  - Lifestyle: ${compatibleResult.breakdown.lifestyle}/30`);
console.log(`  - Social: ${compatibleResult.breakdown.social}/25`);
console.log(`  - Practical: ${compatibleResult.breakdown.practical}/20`);
console.log(`  - Values: ${compatibleResult.breakdown.values}/15`);
console.log(`  - Preferences: ${compatibleResult.breakdown.preferences}/10`);
console.log('\nStrengths:');
compatibleResult.strengths.forEach(s => console.log(`  ${s}`));
if (compatibleResult.considerations.length > 0) {
  console.log('\nConsiderations:');
  compatibleResult.considerations.forEach(c => console.log(`  ${c}`));
}
if (compatibleResult.dealbreakers.length > 0) {
  console.log('\n❌ Dealbreakers:');
  compatibleResult.dealbreakers.forEach(d => console.log(`  ${d}`));
}

// Test incompatible match
console.log('\n\n❌ Test 1b: Incompatible Users (Marie & Tom)');
const incompatibleResult = calculateUserCompatibility(testUserProfile, incompatibleUser);
const incompatibleQuality = getCompatibilityQuality(incompatibleResult.score);

console.log(`Score: ${incompatibleResult.score}/100 (${incompatibleQuality.label} ${incompatibleQuality.emoji})`);
console.log(`Description: ${incompatibleQuality.description}`);
console.log('\nBreakdown:');
console.log(`  - Lifestyle: ${incompatibleResult.breakdown.lifestyle}/30`);
console.log(`  - Social: ${incompatibleResult.breakdown.social}/25`);
console.log(`  - Practical: ${incompatibleResult.breakdown.practical}/20`);
console.log(`  - Values: ${incompatibleResult.breakdown.values}/15`);
console.log(`  - Preferences: ${incompatibleResult.breakdown.preferences}/10`);
if (incompatibleResult.dealbreakers.length > 0) {
  console.log('\n❌ Dealbreakers:');
  incompatibleResult.dealbreakers.forEach(d => console.log(`  ${d}`));
}

// TEST 2: Property-to-Person Matching
console.log('\n\n📋 TEST 2: PROPERTY-TO-PERSON COMPATIBILITY\n');
console.log('-'.repeat(80));

// Test perfect match
console.log('\n💚 Test 2a: Perfect Property Match (Ixelles, €750)');
const perfectMatch = calculateMatchScore(userPreferences, perfectProperty);
const perfectQuality = getMatchQuality(perfectMatch.score);

console.log(`Score: ${perfectMatch.score}/100 (${perfectQuality.label})`);
console.log(`Description: ${perfectQuality.description}`);
console.log('\nBreakdown:');
console.log(`  - Budget: ${perfectMatch.breakdown.budget}/25`);
console.log(`  - Location: ${perfectMatch.breakdown.location}/20`);
console.log(`  - Lifestyle: ${perfectMatch.breakdown.lifestyle}/20`);
console.log(`  - Features: ${perfectMatch.breakdown.features}/15`);
console.log(`  - Timing: ${perfectMatch.breakdown.timing}/10`);
console.log(`  - Duration: ${perfectMatch.breakdown.duration}/10`);
console.log('\nInsights:');
perfectMatch.insights.forEach(i => console.log(`  ${i}`));
if (perfectMatch.warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  perfectMatch.warnings.forEach(w => console.log(`  ${w}`));
}

// Test good match
console.log('\n\n💙 Test 2b: Good Property Match (Saint-Gilles, €850)');
const goodMatch = calculateMatchScore(userPreferences, goodProperty);
const goodQuality = getMatchQuality(goodMatch.score);

console.log(`Score: ${goodMatch.score}/100 (${goodQuality.label})`);
console.log(`Description: ${goodQuality.description}`);
console.log('\nBreakdown:');
console.log(`  - Budget: ${goodMatch.breakdown.budget}/25`);
console.log(`  - Location: ${goodMatch.breakdown.location}/20`);
console.log(`  - Lifestyle: ${goodMatch.breakdown.lifestyle}/20`);
console.log(`  - Features: ${goodMatch.breakdown.features}/15`);
console.log(`  - Timing: ${goodMatch.breakdown.timing}/10`);
console.log(`  - Duration: ${goodMatch.breakdown.duration}/10`);
console.log('\nInsights:');
goodMatch.insights.forEach(i => console.log(`  ${i}`));
if (goodMatch.warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  goodMatch.warnings.forEach(w => console.log(`  ${w}`));
}

// Test poor match
console.log('\n\n❤️  Test 2c: Poor Property Match (Woluwe, €1200)');
const poorMatch = calculateMatchScore(userPreferences, poorProperty);
const poorQuality = getMatchQuality(poorMatch.score);

console.log(`Score: ${poorMatch.score}/100 (${poorQuality.label})`);
console.log(`Description: ${poorQuality.description}`);
console.log('\nBreakdown:');
console.log(`  - Budget: ${poorMatch.breakdown.budget}/25`);
console.log(`  - Location: ${poorMatch.breakdown.location}/20`);
console.log(`  - Lifestyle: ${poorMatch.breakdown.lifestyle}/20`);
console.log(`  - Features: ${poorMatch.breakdown.features}/15`);
console.log(`  - Timing: ${poorMatch.breakdown.timing}/10`);
console.log(`  - Duration: ${poorMatch.breakdown.duration}/10`);
if (poorMatch.warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  poorMatch.warnings.forEach(w => console.log(`  ${w}`));
}

// TEST 3: Score Validation
console.log('\n\n📋 TEST 3: SCORE VALIDATION\n');
console.log('-'.repeat(80));

const allScores = [
  compatibleResult.score,
  incompatibleResult.score,
  perfectMatch.score,
  goodMatch.score,
  poorMatch.score,
];

const validScores = allScores.every(score => score >= 0 && score <= 100);
const hasVariation = Math.max(...allScores) - Math.min(...allScores) >= 30;

console.log(`\n✅ All scores valid (0-100): ${validScores ? 'PASS' : 'FAIL'}`);
console.log(`✅ Scores show variation: ${hasVariation ? 'PASS' : 'FAIL'}`);
console.log(`\nScore range: ${Math.min(...allScores)} - ${Math.max(...allScores)}`);
console.log(`Score average: ${Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)}`);

// TEST 4: Expected Results
console.log('\n\n📋 TEST 4: EXPECTED RESULTS VALIDATION\n');
console.log('-'.repeat(80));

const expectations = [
  {
    name: 'Compatible users should score >= 70',
    pass: compatibleResult.score >= 70,
    actual: compatibleResult.score,
  },
  {
    name: 'Incompatible users should score < 55',
    pass: incompatibleResult.score < 55,
    actual: incompatibleResult.score,
  },
  {
    name: 'Perfect property should score >= 85',
    pass: perfectMatch.score >= 85,
    actual: perfectMatch.score,
  },
  {
    name: 'Good property should score 70-84',
    pass: goodMatch.score >= 70 && goodMatch.score < 85,
    actual: goodMatch.score,
  },
  {
    name: 'Poor property should score < 55',
    pass: poorMatch.score < 55,
    actual: poorMatch.score,
  },
  {
    name: 'Dealbreakers detected for incompatible user',
    pass: incompatibleResult.dealbreakers.length > 0,
    actual: `${incompatibleResult.dealbreakers.length} dealbreakers`,
  },
];

let passCount = 0;
expectations.forEach((exp, i) => {
  const status = exp.pass ? '✅ PASS' : '❌ FAIL';
  console.log(`\n${i + 1}. ${exp.name}`);
  console.log(`   ${status} (Actual: ${exp.actual})`);
  if (exp.pass) passCount++;
});

console.log(`\n${'='.repeat(80)}`);
console.log(`\n🎯 TEST SUMMARY: ${passCount}/${expectations.length} tests passed`);
console.log(`\n${passCount === expectations.length ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}\n`);
