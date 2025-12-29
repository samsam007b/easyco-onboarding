/**
 * Tests for Cookie Consent System
 * Ensures GDPR compliance
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  getConsent,
  saveConsent,
  hasConsent,
  hasConsentResponse,
  acceptAll,
  rejectAll,
  clearConsent,
  canUseAnalytics,
  canUseMarketing,
} from '@/lib/consent/cookie-consent';

describe('Cookie Consent Management', () => {
  // Mock localStorage
  beforeEach(() => {
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: 0,
      key: jest.fn(),
    } as any;
  });

  afterEach(() => {
    clearConsent();
  });

  describe('Consent Storage', () => {
    it('should save consent to localStorage', () => {
      saveConsent({
        necessary: true,
        analytics: true,
        marketing: false,
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'izzico_cookie_consent',
        expect.any(String)
      );
    });

    it('should retrieve saved consent', () => {
      const mockConsent = {
        necessary: true,
        analytics: true,
        marketing: false,
        timestamp: Date.now(),
        version: '1.0',
      };

      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockConsent));

      const consent = getConsent();

      expect(consent).toEqual(mockConsent);
    });

    it('should return null if no consent saved', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      const consent = getConsent();

      expect(consent).toBeNull();
    });
  });

  describe('Consent Versioning', () => {
    it('should invalidate old consent versions', () => {
      const oldConsent = {
        necessary: true,
        analytics: true,
        marketing: true,
        timestamp: Date.now(),
        version: '0.9', // Old version
      };

      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(oldConsent));

      const consent = getConsent();

      expect(consent).toBeNull(); // Should be invalidated
    });

    it('should accept current version', () => {
      const currentConsent = {
        necessary: true,
        analytics: true,
        marketing: false,
        timestamp: Date.now(),
        version: '1.0',
      };

      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(currentConsent));

      const consent = getConsent();

      expect(consent).toEqual(currentConsent);
    });
  });

  describe('Consent Checks', () => {
    it('should check if user has consented to analytics', () => {
      const consent = {
        necessary: true,
        analytics: true,
        marketing: false,
        timestamp: Date.now(),
        version: '1.0',
      };

      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(consent));

      expect(hasConsent('analytics')).toBe(true);
      expect(hasConsent('marketing')).toBe(false);
      expect(hasConsent('necessary')).toBe(true);
    });

    it('should return false if no consent saved', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      expect(hasConsent('analytics')).toBe(false);
      expect(hasConsent('marketing')).toBe(false);
    });

    it('should check if user has responded', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);
      expect(hasConsentResponse()).toBe(false);

      const consent = {
        necessary: true,
        analytics: false,
        marketing: false,
        timestamp: Date.now(),
        version: '1.0',
      };

      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(consent));
      expect(hasConsentResponse()).toBe(true);
    });
  });

  describe('Accept/Reject All', () => {
    it('should accept all cookies', () => {
      acceptAll();

      expect(localStorage.setItem).toHaveBeenCalled();

      const savedData = (localStorage.setItem as jest.Mock).mock.calls[0][1];
      const consent = JSON.parse(savedData);

      expect(consent.necessary).toBe(true);
      expect(consent.analytics).toBe(true);
      expect(consent.marketing).toBe(true);
    });

    it('should reject all non-essential cookies', () => {
      rejectAll();

      expect(localStorage.setItem).toHaveBeenCalled();

      const savedData = (localStorage.setItem as jest.Mock).mock.calls[0][1];
      const consent = JSON.parse(savedData);

      expect(consent.necessary).toBe(true); // Always required
      expect(consent.analytics).toBe(false);
      expect(consent.marketing).toBe(false);
    });
  });

  describe('Helper Functions', () => {
    it('canUseAnalytics should return true if analytics consented', () => {
      const consent = {
        necessary: true,
        analytics: true,
        marketing: false,
        timestamp: Date.now(),
        version: '1.0',
      };

      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(consent));

      expect(canUseAnalytics()).toBe(true);
    });

    it('canUseAnalytics should return false if analytics not consented', () => {
      const consent = {
        necessary: true,
        analytics: false,
        marketing: false,
        timestamp: Date.now(),
        version: '1.0',
      };

      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(consent));

      expect(canUseAnalytics()).toBe(false);
    });

    it('canUseMarketing should work correctly', () => {
      const consent = {
        necessary: true,
        analytics: true,
        marketing: true,
        timestamp: Date.now(),
        version: '1.0',
      };

      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(consent));

      expect(canUseMarketing()).toBe(true);
    });
  });

  describe('Clear Consent', () => {
    it('should remove consent from localStorage', () => {
      clearConsent();

      expect(localStorage.removeItem).toHaveBeenCalledWith('izzico_cookie_consent');
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', () => {
      (localStorage.setItem as jest.Mock).mockImplementation(() => {
        throw new Error('Storage full');
      });

      expect(() => saveConsent({
        necessary: true,
        analytics: true,
        marketing: false,
      })).not.toThrow();
    });

    it('should handle JSON parse errors', () => {
      (localStorage.getItem as jest.Mock).mockReturnValue('invalid json');

      const consent = getConsent();

      expect(consent).toBeNull();
    });
  });
});
