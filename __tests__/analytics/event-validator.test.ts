/**
 * Tests for Event Validator
 * Ensures PII is properly detected and blocked
 */

import { describe, it, expect } from '@jest/globals';
import {
  validateEventProperties,
  validateUserProperties,
  isSafeValue,
} from '@/lib/analytics/event-validator';

describe('Event Validator - PII Detection', () => {
  describe('Email Detection', () => {
    it('should block email addresses', () => {
      const result = validateEventProperties({
        user_email: 'test@example.com',
        name: 'John Doe',
      });

      expect(result.user_email).toBeUndefined();
      expect(result.name).toBe('John Doe');
    });

    it('should detect emails in strings', () => {
      expect(isSafeValue('Contact me at john@test.com')).toBe(false);
      expect(isSafeValue('Hello world')).toBe(true);
    });
  });

  describe('Phone Number Detection', () => {
    it('should block phone numbers', () => {
      const result = validateEventProperties({
        phone: '+1-555-123-4567',
        city: 'Brussels',
      });

      expect(result.phone).toBeUndefined();
      expect(result.city).toBe('Brussels');
    });

    it('should detect various phone formats', () => {
      expect(isSafeValue('+32 2 123 45 67')).toBe(false);
      expect(isSafeValue('555-1234')).toBe(false);
      expect(isSafeValue('(555) 123-4567')).toBe(false);
    });
  });

  describe('Credit Card Detection', () => {
    it('should block credit card numbers', () => {
      const result = validateEventProperties({
        card: '4532-1234-5678-9010',
        amount: 100,
      });

      expect(result.card).toBeUndefined();
      expect(result.amount).toBe(100);
    });
  });

  describe('Blocked Keys', () => {
    it('should block password fields', () => {
      const result = validateEventProperties({
        password: 'secret123',
        username: 'john',
      });

      expect(result.password).toBeUndefined();
      expect(result.username).toBe('john');
    });

    it('should block token fields', () => {
      const result = validateEventProperties({
        access_token: 'abc123',
        api_key: 'key-123',
        user_id: 'user-456',
      });

      expect(result.access_token).toBeUndefined();
      expect(result.api_key).toBeUndefined();
      expect(result.user_id).toBe('user-456');
    });
  });

  describe('Nested Objects', () => {
    it('should recursively validate nested objects', () => {
      const result = validateEventProperties({
        user: {
          name: 'John',
          email: 'john@test.com',
          age: 25,
        },
      }) as any;

      expect(result.user).toBeDefined();
      expect(result.user.name).toBe('John');
      expect(result.user.email).toBeUndefined();
      expect(result.user.age).toBe(25);
    });
  });

  describe('Arrays', () => {
    it('should validate array items', () => {
      const result = validateEventProperties({
        tags: ['public', 'test@example.com', 'valid'],
      }) as any;

      expect(result.tags).toHaveLength(2);
      expect(result.tags).toContain('public');
      expect(result.tags).toContain('valid');
      expect(result.tags).not.toContain('test@example.com');
    });
  });

  describe('User Properties Validation', () => {
    it('should only allow whitelisted user properties', () => {
      const result = validateUserProperties({
        user_id: 'user-123',
        user_type: 'searcher',
        email: 'blocked@test.com',
        age_range: '25-34',
        random_field: 'blocked',
      });

      expect(result.user_id).toBe('user-123');
      expect(result.user_type).toBe('searcher');
      expect(result.age_range).toBe('25-34');
      expect(result.email).toBeUndefined();
      expect(result.random_field).toBeUndefined();
    });

    it('should block PII in whitelisted fields', () => {
      const result = validateUserProperties({
        city: 'test@example.com', // PII in allowed field
        language: 'fr',
      });

      expect(result.city).toBeUndefined();
      expect(result.language).toBe('fr');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null and undefined', () => {
      const result = validateEventProperties({
        null_value: null,
        undefined_value: undefined,
        valid: 'test',
      });

      expect(result.null_value).toBeUndefined();
      expect(result.undefined_value).toBeUndefined();
      expect(result.valid).toBe('test');
    });

    it('should handle empty objects and arrays', () => {
      const result = validateEventProperties({
        empty_obj: {},
        empty_arr: [],
        value: 'test',
      });

      expect(result.value).toBe('test');
    });

    it('should preserve numbers and booleans', () => {
      const result = validateEventProperties({
        count: 42,
        is_active: true,
        score: 0,
        is_verified: false,
      });

      expect(result.count).toBe(42);
      expect(result.is_active).toBe(true);
      expect(result.score).toBe(0);
      expect(result.is_verified).toBe(false);
    });
  });
});

describe('Event Validator - Performance', () => {
  it('should handle large objects efficiently', () => {
    const largeObject: any = {};
    for (let i = 0; i < 1000; i++) {
      largeObject[`field_${i}`] = `value_${i}`;
    }

    const start = Date.now();
    const result = validateEventProperties(largeObject);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(100); // Should complete in <100ms
    expect(Object.keys(result).length).toBe(1000);
  });
});
