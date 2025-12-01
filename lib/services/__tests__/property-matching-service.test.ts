/**
 * Property Matching Service Tests
 * Validates the property-to-searcher matching algorithm
 */

import {
  calculatePropertySearcherMatch,
  getPropertyMatchQuality,
  type PropertyWithResidents,
  type PropertySearcherProfile,
} from '../property-matching-service';

describe('Property Matching Service', () => {
  // Mock searcher profile
  const mockSearcher: PropertySearcherProfile = {
    user_id: 'searcher-1',
    first_name: 'Alice',
    last_name: 'Smith',
    date_of_birth: '1995-03-15',
    gender: 'female',
    min_budget: 500,
    max_budget: 800,
    preferred_neighborhoods: ['Paris 11', 'Paris 10'],
    preferred_property_type: ['coliving', 'apartment'],
    min_bedrooms: 3,
    furnished_required: true,
    required_amenities: ['wifi', 'washing_machine'],
    preferred_amenities: ['gym', 'balcony'],
    cleanliness_level: 8,
    social_energy: 7,
    smoking: false,
    pets: false,
    smoking_tolerance: false,
    pets_tolerance: true,
    core_values: ['respect', 'cleanliness', 'sustainability'],
    wake_up_time: 'early',
    sleep_time: 'early',
  };

  // Mock property - Perfect Match
  const perfectProperty: PropertyWithResidents = {
    id: 'prop-1',
    owner_id: 'owner-1',
    title: 'Beautiful Coliving in Paris 11',
    property_type: 'coliving',
    address: '123 Rue de la République',
    city: 'Paris 11',
    postal_code: '75011',
    bedrooms: 5,
    bathrooms: 2,
    furnished: true,
    monthly_rent: 700,
    charges: 50,
    deposit: 700,
    is_available: true,
    amenities: ['wifi', 'washing_machine', 'gym', 'balcony', 'kitchen'],
    smoking_allowed: false,
    pets_allowed: true,
    couples_allowed: true,
    images: [],
    status: 'published',
    views_count: 100,
    inquiries_count: 10,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    residents: [
      {
        user_id: 'resident-1',
        first_name: 'Bob',
        last_name: 'Johnson',
        date_of_birth: '1994-06-20',
        gender: 'male',
        cleanliness_level: 8,
        social_energy: 7,
        smoking: false,
        pets: false,
        smoking_tolerance: false,
        pets_tolerance: true,
        core_values: ['respect', 'cleanliness'],
        wake_up_time: 'early',
        sleep_time: 'early',
      },
      {
        user_id: 'resident-2',
        first_name: 'Carol',
        last_name: 'White',
        date_of_birth: '1996-09-10',
        gender: 'female',
        cleanliness_level: 7,
        social_energy: 8,
        smoking: false,
        pets: false,
        core_values: ['sustainability', 'fun'],
        wake_up_time: 'moderate',
        sleep_time: 'moderate',
      },
    ],
  };

  describe('calculatePropertySearcherMatch', () => {
    it('should calculate high score for perfect match', () => {
      const result = calculatePropertySearcherMatch(perfectProperty, mockSearcher);

      expect(result.score).toBeGreaterThan(80);
      expect(result.breakdown.propertyFilters).toBeGreaterThan(30);
      expect(result.breakdown.residentCompatibility).toBeGreaterThan(20);
      expect(result.breakdown.propertyLifestyle).toBeGreaterThan(10);
      expect(result.breakdown.locationPractical).toBeGreaterThan(5);
      expect(result.isScoreReliable).toBe(true);
    });

    it('should penalize property above budget', () => {
      const expensiveProperty = {
        ...perfectProperty,
        monthly_rent: 900,
        charges: 100,
      };

      const result = calculatePropertySearcherMatch(expensiveProperty, mockSearcher);

      expect(result.score).toBeLessThan(70);
      expect(result.breakdown.propertyFilters).toBeLessThan(30);
      expect(result.considerations.length).toBeGreaterThan(0);
      expect(result.considerations.some(c => c.includes('budget'))).toBe(true);
    });

    it('should create dealbreaker for smoking mismatch', () => {
      const smokingSearcher = {
        ...mockSearcher,
        smoking: true,
      };

      const nonSmokingProperty = {
        ...perfectProperty,
        smoking_allowed: false,
      };

      const result = calculatePropertySearcherMatch(nonSmokingProperty, smokingSearcher);

      expect(result.breakdown.propertyLifestyle).toBe(0);
      expect(result.dealbreakers.length).toBeGreaterThan(0);
      expect(result.dealbreakers.some(d => d.includes('smoke'))).toBe(true);
    });

    it('should create dealbreaker for pets mismatch', () => {
      const petOwnerSearcher = {
        ...mockSearcher,
        pets: true,
      };

      const noPetsProperty = {
        ...perfectProperty,
        pets_allowed: false,
      };

      const result = calculatePropertySearcherMatch(noPetsProperty, petOwnerSearcher);

      expect(result.breakdown.propertyLifestyle).toBeLessThan(8);
      expect(result.dealbreakers.length).toBeGreaterThan(0);
      expect(result.dealbreakers.some(d => d.includes('pets'))).toBe(true);
    });

    it('should handle property with no residents', () => {
      const noResidentsProperty = {
        ...perfectProperty,
        residents: [],
      };

      const result = calculatePropertySearcherMatch(noResidentsProperty, mockSearcher);

      // Should get neutral score (~50% of 35 points = ~18)
      expect(result.breakdown.residentCompatibility).toBeCloseTo(18, 0);
      expect(result.residentMatches).toHaveLength(0);
    });

    it('should penalize missing required amenities', () => {
      const noWifiProperty = {
        ...perfectProperty,
        amenities: ['washing_machine', 'gym'] as any[],
      };

      const result = calculatePropertySearcherMatch(noWifiProperty, mockSearcher);

      expect(result.breakdown.propertyFilters).toBeLessThan(30);
      expect(result.dealbreakers.some(d => d.includes('wifi'))).toBe(true);
    });

    it('should reward matching preferred neighborhoods', () => {
      const preferredLocationProperty = {
        ...perfectProperty,
        city: 'Paris 11',
      };

      const nonPreferredLocationProperty = {
        ...perfectProperty,
        city: 'Paris 18',
      };

      const result1 = calculatePropertySearcherMatch(preferredLocationProperty, mockSearcher);
      const result2 = calculatePropertySearcherMatch(nonPreferredLocationProperty, mockSearcher);

      expect(result1.breakdown.propertyFilters).toBeGreaterThan(result2.breakdown.propertyFilters);
      expect(result1.strengths.some(s => s.includes('preferred area'))).toBe(true);
    });

    it('should penalize properties with too few bedrooms', () => {
      const smallProperty = {
        ...perfectProperty,
        bedrooms: 2,
      };

      const result = calculatePropertySearcherMatch(smallProperty, mockSearcher);

      expect(result.breakdown.propertyFilters).toBeLessThan(35);
      expect(result.dealbreakers.some(d => d.includes('bedroom'))).toBe(true);
    });

    it('should reward properties with preferred amenities', () => {
      const withGymProperty = {
        ...perfectProperty,
        amenities: ['wifi', 'washing_machine', 'gym'] as any[],
      };

      const withoutGymProperty = {
        ...perfectProperty,
        amenities: ['wifi', 'washing_machine'] as any[],
      };

      const result1 = calculatePropertySearcherMatch(withGymProperty, mockSearcher);
      const result2 = calculatePropertySearcherMatch(withoutGymProperty, mockSearcher);

      expect(result1.breakdown.propertyFilters).toBeGreaterThanOrEqual(result2.breakdown.propertyFilters);
    });

    it('should handle unfurnished property when required', () => {
      const unfurnishedProperty = {
        ...perfectProperty,
        furnished: false,
      };

      const result = calculatePropertySearcherMatch(unfurnishedProperty, mockSearcher);

      expect(result.breakdown.propertyFilters).toBeLessThan(35);
    });

    it('should penalize long minimum stay requirements', () => {
      const longStayProperty = {
        ...perfectProperty,
        minimum_stay_months: 12,
      };

      const flexibleProperty = {
        ...perfectProperty,
        minimum_stay_months: 3,
      };

      const result1 = calculatePropertySearcherMatch(longStayProperty, mockSearcher);
      const result2 = calculatePropertySearcherMatch(flexibleProperty, mockSearcher);

      expect(result1.breakdown.locationPractical).toBeLessThan(result2.breakdown.locationPractical);
      expect(result1.considerations.some(c => c.includes('minimum') || c.includes('commitment'))).toBe(true);
    });

    it('should rank resident matches correctly', () => {
      const result = calculatePropertySearcherMatch(perfectProperty, mockSearcher);

      expect(result.residentMatches).toBeDefined();
      expect(result.residentMatches!.length).toBe(2);

      // Should be sorted by compatibility score (highest first)
      const scores = result.residentMatches!.map(m => m.compatibilityScore);
      expect(scores[0]).toBeGreaterThanOrEqual(scores[1]);
    });

    it('should mark score as unreliable for incomplete searcher profile', () => {
      const incompleteSearcher = {
        user_id: 'searcher-2',
        first_name: 'David',
        last_name: 'Brown',
        // Missing most fields
      };

      const result = calculatePropertySearcherMatch(perfectProperty, incompleteSearcher as any);

      expect(result.isScoreReliable).toBe(false);
    });
  });

  describe('getPropertyMatchQuality', () => {
    it('should return Perfect Match for scores >= 85', () => {
      const quality = getPropertyMatchQuality(90);
      expect(quality.label).toBe('Perfect Match');
      expect(quality.color).toBe('green');
      expect(quality.emoji).toBe('💚');
    });

    it('should return Excellent Match for scores 70-84', () => {
      const quality = getPropertyMatchQuality(75);
      expect(quality.label).toBe('Excellent Match');
      expect(quality.color).toBe('blue');
      expect(quality.emoji).toBe('💙');
    });

    it('should return Good Match for scores 55-69', () => {
      const quality = getPropertyMatchQuality(60);
      expect(quality.label).toBe('Good Match');
      expect(quality.color).toBe('yellow');
      expect(quality.emoji).toBe('💛');
    });

    it('should return Fair Match for scores 40-54', () => {
      const quality = getPropertyMatchQuality(45);
      expect(quality.label).toBe('Fair Match');
      expect(quality.color).toBe('orange');
      expect(quality.emoji).toBe('🧡');
    });

    it('should return Low Match for scores < 40', () => {
      const quality = getPropertyMatchQuality(30);
      expect(quality.label).toBe('Low Match');
      expect(quality.color).toBe('red');
      expect(quality.emoji).toBe('❤️');
    });
  });

  describe('Edge Cases', () => {
    it('should handle property with budget exactly at max', () => {
      const exactBudgetProperty = {
        ...perfectProperty,
        monthly_rent: 750,
        charges: 50, // Total = 800
      };

      const result = calculatePropertySearcherMatch(exactBudgetProperty, mockSearcher);

      expect(result.breakdown.propertyFilters).toBeGreaterThan(30);
      expect(result.strengths.some(s => s.includes('budget'))).toBe(true);
    });

    it('should handle property with no charges', () => {
      const noChargesProperty = {
        ...perfectProperty,
        charges: 0,
      };

      const result = calculatePropertySearcherMatch(noChargesProperty, mockSearcher);

      expect(result.score).toBeGreaterThan(0);
    });

    it('should handle searcher with no budget set', () => {
      const noBudgetSearcher = {
        ...mockSearcher,
        min_budget: undefined,
        max_budget: undefined,
      };

      const result = calculatePropertySearcherMatch(perfectProperty, noBudgetSearcher);

      // Should not crash and should calculate partial score
      expect(result.score).toBeGreaterThan(0);
    });

    it('should handle property with undefined availability date', () => {
      const noDateProperty = {
        ...perfectProperty,
        available_from: undefined,
      };

      const result = calculatePropertySearcherMatch(noDateProperty, mockSearcher);

      expect(result.score).toBeGreaterThan(0);
    });
  });
});
