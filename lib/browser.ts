// lib/browser.ts
export const isBrowser = () => typeof window !== 'undefined';

export const safeLocalStorage = {
  get<T = unknown>(key: string, fallback: T): T {
    if (!isBrowser()) return fallback;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};
