// lib/browser.ts
export const safeLocalStorage = {
  get<T>(key: string, fallback: T): T {
    try {
      if (typeof window === 'undefined') return fallback;
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* no-op */
    }
  },
  remove(key: string) {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(key);
    } catch {
      /* no-op */
    }
  },
};
